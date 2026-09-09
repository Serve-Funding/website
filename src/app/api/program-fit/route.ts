import { NextResponse } from 'next/server'

/**
 * Program fit — asks the portal what we may tell this visitor about their
 * options, and holds the shared secret so the browser never does.
 *
 * The portal's `/api/webhooks/program-fit` owns the policy: the eligibility
 * gate, the banded count, the program names. This route is a proxy with two
 * jobs — keep the secret server-side, and make sure a failure here is invisible
 * to the visitor.
 *
 * EVERY FAILURE PATH RETURNS 200 WITH `eligible: false`. Unconfigured, timed
 * out, portal down, bad JSON — all the same answer, because the form falls back
 * to its plain confirmation and the lead is already captured by the separate
 * `/api/portal-lead` call. A screen is never worth a visitor seeing an error,
 * and it is never worth blocking a submission.
 *
 * It stays dark until PORTAL_PROGRAM_FIT_URL and PORTAL_INBOUND_SECRET are set,
 * so merging this changes nothing live.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PORTAL_URL = process.env.PORTAL_PROGRAM_FIT_URL || ''
const PORTAL_SECRET = process.env.PORTAL_INBOUND_SECRET || ''
const TIMEOUT_MS = 5000

/** What the form renders. Mirrors the portal's response shape. */
interface FitResponse {
  eligible: boolean
  blocked: string | null
  programs: string[]
  band: string | null
}

const NOTHING: FitResponse = { eligible: false, blocked: 'unavailable', programs: [], band: null }

/**
 * A crude per-IP limiter.
 *
 * Being straight about what this is and is not: the map lives in one server
 * instance's memory, so it does not survive a cold start and does not see the
 * other instances. It stops a trivial scripted loop from one address and
 * nothing more.
 *
 * The real protection is the response, not the rate: the portal returns a band
 * and program names, never lender names, criteria or an exact count, so varying
 * one field and watching the number move tells an attacker almost nothing about
 * the matrix. If that ever changes, this needs to become a real limiter.
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 10
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  // Bound the map so a spray of addresses cannot grow it without limit.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
    }
  }
  return recent.length > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  if (!PORTAL_URL || !PORTAL_SECRET) {
    return NextResponse.json(NOTHING)
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  if (rateLimited(ip)) {
    // Same shape as every other refusal: the visitor sees the fallback screen,
    // not a 429 they could probe against.
    return NextResponse.json({ ...NOTHING, blocked: 'rate_limited' })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(NOTHING)
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(PORTAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PORTAL_SECRET}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      redirect: 'error',
    })

    if (!res.ok) {
      console.error(`[program-fit] portal responded ${res.status}`)
      return NextResponse.json(NOTHING)
    }

    const fit = (await res.json()) as Partial<FitResponse>

    // Re-shape rather than forward. The portal is ours, but this response goes
    // to a browser, so the fields it can carry are named here explicitly and a
    // future portal field cannot leak through by accident.
    return NextResponse.json({
      eligible: fit.eligible === true,
      blocked: typeof fit.blocked === 'string' ? fit.blocked : null,
      programs: Array.isArray(fit.programs)
        ? fit.programs.filter((p): p is string => typeof p === 'string').slice(0, 6)
        : [],
      band: typeof fit.band === 'string' ? fit.band : null,
    } satisfies FitResponse)
  } catch (error) {
    console.error('[program-fit] request failed:', error)
    return NextResponse.json(NOTHING)
  } finally {
    clearTimeout(timeout)
  }
}
