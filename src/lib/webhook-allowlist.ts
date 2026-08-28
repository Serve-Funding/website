/**
 * Destination allowlist for /api/webhook.
 *
 * That route forwards to a URL supplied in the request body, so without this
 * check anyone could POST an arbitrary address and have the server fetch it:
 * link-local metadata endpoints, internal hosts, or a third party using
 * servefunding.com as an anonymous relay.
 *
 * Every destination the site actually uses is n8n, plus a Clay hook whose URL
 * is environment-configured. Both are matched by host so a new path on an
 * existing hook needs no change here.
 */

// Read once at module load. NEXT_PUBLIC_ so this host is already public to the
// browser — deriving it server-side leaks nothing.
function buildAllowedHosts(): ReadonlySet<string> {
  const hosts = new Set<string>(['aiascend.app.n8n.cloud'])

  const clay = process.env.NEXT_PUBLIC_CLAY_WEBHOOK_URL
  if (clay) {
    try {
      hosts.add(new URL(clay).hostname)
    } catch {
      console.error('[webhook-allowlist] NEXT_PUBLIC_CLAY_WEBHOOK_URL is not a valid URL; ignoring')
    }
  }

  return hosts
}

export const ALLOWED_WEBHOOK_HOSTS = buildAllowedHosts()

/**
 * True only for an https URL whose host is allowlisted. Everything else is
 * rejected, including http (which would expose form contents in transit) and
 * any URL shape that fails to parse.
 */
export function isAllowedWebhookUrl(raw: unknown): boolean {
  if (typeof raw !== 'string' || raw.length === 0) return false

  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return false
  }

  return url.protocol === 'https:' && ALLOWED_WEBHOOK_HOSTS.has(url.hostname)
}
