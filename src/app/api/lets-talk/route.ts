import Anthropic from "@anthropic-ai/sdk"
import { buildDealAIContext } from "@/lib/ai"
import { InputError, boundField, boundHistory, boundList, readJsonBody, requireMessage } from "@/lib/api-input-limits"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Everything the caller sends is bounded before the model is called: this route is
    // public and each request costs money. See src/lib/api-input-limits.ts.
    const body = await readJsonBody(request)
    const message = requireMessage(body.message)

    const messages = [
      ...boundHistory(body.conversationHistory),
      { role: "user" as const, content: message },
    ]

    // Form answers are interpolated into the system prompt, so each is cut to a short
    // single line first.
    const rawForm =
      body.formData && typeof body.formData === "object" && !Array.isArray(body.formData)
        ? (body.formData as Record<string, unknown>)
        : {}
    const field = (key: string, maxChars = 200) => boundField(rawForm[key], maxChars)
    const formData = {
      // The intake form sends a single `name`; older callers sent first and last.
      name: field("name", 160) || `${field("firstname", 80)} ${field("lastname", 80)}`.trim(),
      company: field("company"),
      email: field("email"),
      phone: field("phone", 40),
      capital_for: field("capital_for"),
      contact_us_details: field("contact_us_details", 2_000),
      business_industry: field("business_industry"),
      time_in_business: field("time_in_business"),
      annual_revenue: field("annual_revenue"),
      financing_needs: boundList(rawForm.financing_needs, 12, 100),
      funding_amount: field("funding_amount"),
      owner_credit_score: field("owner_credit_score"),
    }

    // Build system prompt with form context
    const userRole = field("user_role", 60) || undefined
    const dealContext = buildDealAIContext(userRole)

    const systemPrompt = `${dealContext}

User Information from Deal Inquiry Form:
- Name: ${formData.name || 'Not provided'}
- Company: ${formData.company || 'Not specified'}
- Email: ${formData.email || 'Not provided'}
- Phone: ${formData.phone || 'Not provided'}
- Capital Needed: ${formData.capital_for || 'Not specified'}
- Deal Details: ${formData.contact_us_details || 'Not provided'}
- Business Industry: ${formData.business_industry || 'Not specified'}
- Time in Business: ${formData.time_in_business || 'Not specified'}
- Annual Revenue: ${formData.annual_revenue || 'Not specified'}
- Financing Needs: ${formData.financing_needs.join(', ') || 'Not specified'}
- Funding Amount Needed: ${formData.funding_amount || 'Not specified'}
- Owner Credit Score: ${formData.owner_credit_score || 'Not specified'}

Use this context to provide personalized responses that reference their specific situation.`

    const response = await anthropic.beta.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      betas: ["structured-outputs-2025-11-13"],
      system: systemPrompt,
      messages,
      output_format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "The conversational response to the user"
            },
            context: {
              type: "string",
              description: "Brief summary of what was learned about their deal/situation (1-2 sentences)"
            },
            showSchedule: {
              type: "boolean",
              description: "Whether to show the schedule call button (true if deal fits scope, false otherwise)"
            }
          },
          required: ["message", "context"],
          additionalProperties: false
        }
      }
    })

    const textContent = response.content.find(block => block.type === "text")
    const reply = textContent && "text" in textContent ? textContent.text : JSON.stringify({ message: "Sorry, I couldn't generate a response." })

    return Response.json({ reply })
  } catch (error) {
    if (error instanceof InputError) {
      return Response.json({ error: error.message }, { status: error.status })
    }
    // Log the detail server-side only. The caller gets a fixed message, never the
    // provider's error text.
    console.error("Deal Inquiry API error:", error)
    return Response.json(
      { error: "Failed to process deal inquiry request" },
      { status: 500 }
    )
  }
}
