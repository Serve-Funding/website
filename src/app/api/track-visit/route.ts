import { NextResponse } from 'next/server'

/**
 * Campaign-open forwarder: hands "this LinkedIn id opened this page" to the
 * Serve portal, which resolves the id to a campaign lead and surfaces the person
 * in Signals → Site visits.
 *
 * Server-side on purpose. The browser posts here, to our own origin, and only
 * this route holds the shared secret — so the portal endpoint is not callable
 * from a page, the secret never ships in a bundle, and `connect-src 'self'` in
 * middleware.ts needs no new origin. Same shape as /api/portal-lead.
 *
 * Dark until SITE_VISIT_PORTAL_URL and SITE_VISIT_PORTAL_SECRET are both set;
 * unlike /api/portal-lead there is no separate on/off flag, because "configured"
 * and "enabled" cannot usefully disagree here — there is no second delivery path
 * this one is being added alongside.
 *
 * Every response is a 204. This is a beacon, not an API: the visitor's page must
 * not learn whether we recognised them, and nothing it does depends on the
 * answer. Our own failures go to the server log.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PORTAL_URL = process.env.SITE_VISIT_PORTAL_URL || ''
const PORTAL_SECRET = process.env.SITE_VISIT_PORTAL_SECRET || ''
const TIMEOUT_MS = 3000

/** Matches src/lib/campaign-visitor.ts — re-checked here, since this is a public route. */
const MAX_ID_LENGTH = 128
const ID_PATTERN = /^[^\s<>"'/?#&=%\\]+$/u
const MAX_STR = 512

function str(value: unknown, max = MAX_STR): string | null {
  return typeof value === 'string' && value.length > 0 ? value.slice(0, max) : null
}

const noContent = () => new NextResponse(null, { status: 204 })

export async function POST(request: Request) {
  if (!PORTAL_URL || !PORTAL_SECRET) return noContent()

  let body: Record<string, unknown>
  try {
    const parsed: unknown = await request.json()
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return noContent()
    body = parsed as Record<string, unknown>
  } catch {
    return noContent()
  }

  // The id is the whole payload — without one there is nobody to attribute to,
  // so drop the request here rather than have the portal store an orphan row.
  const id = str(body.id, MAX_ID_LENGTH)
  if (!id || !ID_PATTERN.test(id)) return noContent()

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    // Re-built field by field rather than forwarded: a public endpoint must not
    // be a way to post arbitrary JSON into the portal's database.
    const res = await fetch(PORTAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PORTAL_SECRET}`,
      },
      body: JSON.stringify({
        id: id.toLowerCase(),
        path: str(body.path),
        funding: str(body.funding),
        referrer: str(body.referrer, 1024),
        occurredAt: str(body.occurredAt, 40),
        source: 'website',
      }),
      signal: controller.signal,
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error(`[track-visit] portal responded ${res.status}: ${detail.slice(0, 500)}`)
    }
  } catch (error) {
    console.error('[track-visit] forward failed:', error)
  } finally {
    clearTimeout(timeout)
  }

  return noContent()
}
