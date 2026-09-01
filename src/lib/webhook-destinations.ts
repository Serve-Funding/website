/**
 * Server-owned destinations for /api/webhook.
 *
 * The browser names a form (`target: 'inquiry'`), never a URL. That is the
 * whole point: while the destination came from the request body, the route was
 * an open proxy, and every hook URL had to ship in the client bundle for the
 * forms to work. Both problems are the same problem, and naming the form
 * instead of the address closes it structurally rather than by filtering.
 *
 * URLs default to the live hooks and can be overridden per environment. None of
 * these are NEXT_PUBLIC_ — that prefix would inline them back into the bundle.
 */

export type WebhookTarget = 'inquiry' | 'newsletter'

const PRIMARY: Record<WebhookTarget, string> = {
  inquiry:
    process.env.N8N_INQUIRY_WEBHOOK_URL ||
    'https://aiascend.app.n8n.cloud/webhook/sf-inquiry',
  newsletter:
    process.env.N8N_NEWSLETTER_WEBHOOK_URL ||
    'https://aiascend.app.n8n.cloud/webhook/sf-newsletter',
}

/**
 * Optional mirror. Reads the un-prefixed name first; the NEXT_PUBLIC_ fallback
 * is only so an existing Vercel variable keeps working. Reading it here is safe
 * — a NEXT_PUBLIC_ value only reaches the browser if a client component
 * references it, and none do any more.
 */
const MIRROR =
  process.env.CLAY_WEBHOOK_URL || process.env.NEXT_PUBLIC_CLAY_WEBHOOK_URL || ''

export function isWebhookTarget(value: unknown): value is WebhookTarget {
  return value === 'inquiry' || value === 'newsletter'
}

export function primaryDestination(target: WebhookTarget): string {
  return PRIMARY[target]
}

/**
 * Clay receives a copy of real submissions. Spam caught by the honeypot goes to
 * the primary hook only, which is what the client used to do.
 */
export function mirrorDestination(isSpam: boolean): string | null {
  if (isSpam || !MIRROR) return null
  return MIRROR
}

/**
 * The literal URLs that shipped in the browser bundle before this change, which
 * is what an old cached page will send. Deliberately NOT derived from PRIMARY —
 * setting an env override there would otherwise stop the shim recognising the
 * very requests it exists to catch.
 */
const SHIPPED_URLS: Record<WebhookTarget, string> = {
  inquiry: 'https://aiascend.app.n8n.cloud/webhook/sf-inquiry',
  newsletter: 'https://aiascend.app.n8n.cloud/webhook/sf-newsletter',
}

/**
 * Transitional. A visitor whose page was loaded before this deploy is still
 * running the old bundle and will POST `webhookUrl`. Rejecting those would
 * silently drop real leads for as long as those tabs stay open, so an exact
 * match against a known destination is still accepted. Delete once the logged
 * count reaches zero.
 */
export function legacyTargetForUrl(raw: unknown): WebhookTarget | null {
  if (typeof raw !== 'string' || !raw) return null
  for (const [target, url] of Object.entries(SHIPPED_URLS)) {
    if (raw === url) return target as WebhookTarget
  }
  return null
}
