import Anthropic from "@anthropic-ai/sdk"
import { buildAIContext } from "@/lib/ai"
import { getBlogPosts } from "@/lib/blog-utils"
import { InputError, boundField, boundHistory, readJsonBody, requireMessage } from "@/lib/api-input-limits"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Everything the caller sends is bounded before the model is called: this route is
    // public and each request costs money. See src/lib/api-input-limits.ts.
    const body = await readJsonBody(request)
    const message = requireMessage(body.message)
    const userRole = boundField(body.userRole, 60) || undefined

    const messages = [
      ...boundHistory(body.conversationHistory),
      { role: "user" as const, content: message },
    ]

    // Stay on Haiku 4.5 for all turns — with the rich cached system prompt, Haiku handles
    // voice + citations well. We can route to Sonnet later once we've confirmed the model
    // ID and weighed the cost trade-off.
    const model = "claude-haiku-4-5-20251001"

    const response = await anthropic.beta.messages.create({
      model,
      max_tokens: 1024,
      betas: ["structured-outputs-2025-11-13"],
      // Prompt caching: the large static voice/product corpus is cached so we only pay
      // for it once per 5-minute window. Per-request cost drops dramatically.
      system: [
        {
          type: "text",
          text: buildAIContext(
            userRole,
            getBlogPosts().map((p) => ({ id: p.id, title: p.title, excerpt: p.excerpt })),
          ),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
      output_format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "The message to display to the user"
            },
            showForm: {
              type: "boolean",
              description: "Whether to show the contact form"
            },
            context: {
              type: "string",
              description: "Context summary for the form (only if showForm is true)"
            }
          },
          required: ["message", "showForm"],
          additionalProperties: false
        }
      }
    })

    const textContent = response.content.find(block => block.type === "text")
    const reply = textContent && "text" in textContent ? textContent.text : "Sorry, I couldn't generate a response."

    return Response.json({ reply })
  } catch (error) {
    if (error instanceof InputError) {
      return Response.json({ error: error.message }, { status: error.status })
    }
    // Log the detail server-side only. The caller gets a fixed message, never the
    // provider's error text.
    console.error("Chat API error:", error)
    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    )
  }
}
