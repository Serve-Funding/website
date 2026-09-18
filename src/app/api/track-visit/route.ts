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
 * CONFIGURATION. Reuses the lead handoff's pair by default: the secret is
 * PORTAL_INBOUND_SECRET and the target is PORTAL_INBOUND_URL's origin with
 * `/api/webhooks/site-visit` as the path — the same portal, one path over. So
 * the projects that already hand leads to the portal (Aug 2026) forward visits
 * with no new variables (Kyler + Tim, 2026-09-18). SITE_VISIT_PORTAL_URL and
 * SITE_VISIT_PORTAL_SECRET, when set, override each half, for a deployment
 * that wants the two writers on different keys. Dark when neither pair is set;
 * unlike /api/portal-lead there is no separate on/off flag, because
 * "configured" and "enabled" cannot usefully disagree here.
 *
 * WHAT A FORGED VISIT CAN AND CANNOT DO. This is an unauthenticated endpoint on
 * a public page, and a LinkedIn public identifier is public, so anyone who wants
 * to can claim a named banker read a deal. The bounds below (size, origin, a
 * per-instance throttle) raise the cost of doing it in bulk; they do not make
 * the signal proof of anything. It is treated downstream as what it is — a
 * reason to move a name up a call list, never an authorization decision and
 * never a fact shown to the person it is about. Site-wide rate limiting for
 * every public route here is a separate, already-written piece of work; see
 * docs/api-abuse-hardening-plan.md.
 *
 * Responses carry no information about the visitor. This is a beacon, not an
 * API: the page never learns whether we recognised them, because the portal
 * answers the same `{ ok: true }` for a matched and an unmatched id alike. Two
 * statuses only: 204 when the visit was taken (or deliberately dropped —
 * unconfigured, malformed, throttled), 502 when the portal did not take it, so
 * the tracker can release its "reported" mark and try again later instead of
 * counting a timed-out forward as delivered. Our own failures go to the log.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** The portal's site-visit endpoint, derived from the lead endpoint's origin. */
function siteVisitUrlFrom(inboundUrl: string | undefined): string {
  if (!inboundUrl) return ''
  try {
    return new URL('/api/webhooks/site-visit', inboundUrl).toString()
  } catch {
    return ''
  }
}

const PORTAL_URL =
  process.env.SITE_VISIT_PORTAL_URL || siteVisitUrlFrom(process.env.PORTAL_INBOUND_URL)
const PORTAL_SECRET = process.env.SITE_VISIT_PORTAL_SECRET || process.env.PORTAL_INBOUND_SECRET || ''
const TIMEOUT_MS = 3000

/** Matches src/lib/campaign-visitor.ts — re-checked here, since this is a public route. */
const MAX_ID_LENGTH = 128
const ID_PATTERN = /^[^\s<>"'/?#&=%\\]+$/u
const MAX_STR = 512

/**
 * The largest body worth reading. A real beacon is ~250 bytes; this is checked
 * BEFORE parsing, because `request.json()` buffers and parses the whole payload
 * first, so a megabyte of unused JSON around a valid `id` would be paid for in
 * full before any field-length cap could apply.
 */
const MAX_BODY_BYTES = 2048

/**
 * Hosts allowed to post a visit. Not a security boundary — anything that is not
 * a browser simply omits the header — but it costs nothing and stops the beacon
 * being embedded in someone else's page. `null` (no Origin at all) is refused
 * for the same reason: every real caller is a same-origin `fetch` from our own
 * page, and browsers always send Origin on a POST.
 */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false
  let host: string
  try {
    host = new URL(origin).hostname
  } catch {
    return false
  }
  return (
    host === 'servefunding.com' ||
    host === 'www.servefunding.com' ||
    host === 'localhost' ||
    // Vercel preview deployments, so a PR preview is testable.
    host.endsWith('.vercel.app')
  )
}

/**
 * A per-instance throttle. Deliberately modest about what it is: serverless
 * spreads callers over many short-lived instances, so this bounds one instance's
 * fan-out to the portal rather than the total request rate. It is here because
 * the portal write is the expensive end, not because it stops a determined
 * flood.
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 30
const seen = new Map<string, { count: number; resetAt: number }>()

function throttled(key: string, now: number): boolean {
  const held = seen.get(key)
  if (!held || now >= held.resetAt) {
    // Sweep on write, so the map cannot grow without bound across a warm
    // instance's lifetime.
    for (const [k, v] of seen) if (now >= v.resetAt) seen.delete(k)
    seen.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  held.count += 1
  return held.count > MAX_PER_WINDOW
}

function str(value: unknown, max = MAX_STR): string | null {
  return typeof value === 'string' && value.length > 0 ? value.slice(0, max) : null
}

const noContent = () => new NextResponse(null, { status: 204 })
/** The portal did not take the visit. Bodyless: the status is the whole message. */
const notDelivered = () => new NextResponse(null, { status: 502 })

export async function POST(request: Request) {
  if (!PORTAL_URL || !PORTAL_SECRET) return noContent()
  if (!sameOrigin(request)) return noContent()

  const declared = Number(request.headers.get('content-length') ?? '')
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return noContent()

  // Read as text and measure, because Content-Length is caller-supplied and a
  // chunked request has none at all.
  let raw: string
  try {
    raw = await request.text()
  } catch {
    return noContent()
  }
  if (raw.length > MAX_BODY_BYTES) return noContent()

  let body: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return noContent()
    body = parsed as Record<string, unknown>
  } catch {
    return noContent()
  }

  // The id is the whole payload — without one there is nobody to attribute to,
  // so drop the request here rather than have the portal store an orphan row.
  const id = str(body.id, MAX_ID_LENGTH)
  if (!id || !ID_PATTERN.test(id)) return noContent()

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (throttled(ip, Date.now())) return noContent()

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
        referrer: str(body.referrer),
        occurredAt: str(body.occurredAt, 40),
        source: 'website',
      }),
      signal: controller.signal,
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error(`[track-visit] portal responded ${res.status}: ${detail.slice(0, 500)}`)
      return notDelivered()
    }
  } catch (error) {
    console.error('[track-visit] forward failed:', error)
    return notDelivered()
  } finally {
    clearTimeout(timeout)
  }

  return noContent()
}
