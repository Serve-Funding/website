import {
  isWebhookTarget,
  legacyTargetForUrl,
  mirrorDestination,
  primaryDestination,
  type WebhookTarget,
} from '@/lib/webhook-destinations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { target, webhookUrl, ...data } = body

    let resolved: WebhookTarget | null = isWebhookTarget(target) ? target : null

    // Old bundle still in a visitor's tab. See legacyTargetForUrl.
    if (!resolved && webhookUrl) {
      resolved = legacyTargetForUrl(webhookUrl)
      if (resolved) console.warn(`[webhook] legacy webhookUrl accepted for '${resolved}'`)
    }

    if (!resolved) {
      console.error(`[webhook] unknown target: ${safeForLog(target ?? webhookUrl)}`)
      return Response.json({ error: 'unknown webhook target' }, { status: 400 })
    }

    const post = (url: string) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        // An allowlisted host must not be able to bounce us somewhere else.
        redirect: 'error',
      })

    // Mirrored copy is best-effort and never affects what the visitor sees,
    // matching the fire-and-forget behaviour this replaces on the client.
    const mirror = mirrorDestination(data.is_spam === true)
    if (mirror) {
      post(mirror).catch((error) => console.error('[webhook] mirror failed:', error))
    }

    const response = await post(primaryDestination(resolved))

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

/** Keeps an attacker-supplied value from forging extra log lines. */
function safeForLog(value: unknown): string {
  return String(value).replace(/[\r\n]+/g, ' ').slice(0, 120)
}
