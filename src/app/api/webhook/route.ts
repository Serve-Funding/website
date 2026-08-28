import { isAllowedWebhookUrl } from '@/lib/webhook-allowlist'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { webhookUrl, ...data } = body

    if (!webhookUrl) {
      return Response.json(
        { error: 'webhookUrl is required' },
        { status: 400 }
      )
    }

    // The destination comes from the request body, so it has to be checked
    // against the allowlist before it is fetched. Without this the route is an
    // open proxy. The response deliberately does not echo the URL back, so a
    // probe learns nothing about what is allowed.
    if (!isAllowedWebhookUrl(webhookUrl)) {
      console.error(`[webhook] blocked destination: ${String(webhookUrl).slice(0, 120)}`)
      return Response.json(
        { error: 'webhookUrl is not permitted' },
        { status: 400 }
      )
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      console.error(`Webhook failed with status ${response.status}`)
      return Response.json(
        { error: 'Webhook request failed', status: response.status },
        { status: response.status }
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Webhook forwarding error:', error)
    return Response.json(
      { error: 'Failed to forward webhook' },
      { status: 500 }
    )
  }
}
