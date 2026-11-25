// Request throttling for the public API routes (/api/chat, /api/lets-talk, /api/notify).
//
// What this is: fixed-window counters held in the memory of one server instance, keyed
// by the caller's IP address. One caller hammering a route is cut off after a handful
// of requests, and a ceiling across all callers bounds what one instance will spend on
// the model in an hour.
//
// What this is not: a shared counter. Each server instance counts on its own, so a
// flood spread across several instances gets a multiple of these limits. A limit that
// must hold exactly belongs at the edge (a firewall rule), in front of this code.
//
// The windows are deliberately far above what a person does in the chat, so a real
// visitor never meets them.

export type Window = { max: number; windowMs: number }

export type LimiterOptions = {
  /** Windows applied to each caller separately. A request must fit all of them. */
  perClient: Window[]
  /** Optional ceiling across every caller of this limiter, per instance. */
  overall?: Window
}

export type Verdict = { ok: true } | { ok: false; retryAfterSeconds: number }

/** Callers tracked at once. Past this, the oldest entries are dropped first. */
const MAX_TRACKED_CLIENTS = 5_000
const OVERALL_KEY = ''

type Counter = { count: number; resetAt: number }

export class RateLimiter {
  private readonly counters = new Map<string, Counter[]>()
  private readonly options: LimiterOptions

  constructor(options: LimiterOptions) {
    this.options = options
  }

  /** Count one request from `client` and say whether it may proceed. */
  check(client: string, now: number = Date.now()): Verdict {
    const overall = this.options.overall
    const overallCounters = overall ? this.countersFor(OVERALL_KEY, [overall], now) : []
    const clientCounters = this.countersFor(`c:${client}`, this.options.perClient, now)

    // Decide before counting, so a refused request does not push the window further
    // out of reach and a refused caller cannot use up the overall ceiling.
    const windows = [...(overall ? [overall] : []), ...this.options.perClient]
    const held = [...overallCounters, ...clientCounters]
    let retryAt = 0
    held.forEach((counter, i) => {
      if (counter.count >= windows[i].max) retryAt = Math.max(retryAt, counter.resetAt)
    })
    if (retryAt > 0) {
      return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((retryAt - now) / 1000)) }
    }

    for (const counter of held) counter.count += 1
    return { ok: true }
  }

  private countersFor(key: string, windows: Window[], now: number): Counter[] {
    let held = this.counters.get(key)
    if (!held) {
      this.makeRoom(now)
      held = windows.map((w) => ({ count: 0, resetAt: now + w.windowMs }))
      this.counters.set(key, held)
      return held
    }
    held.forEach((counter, i) => {
      if (now >= counter.resetAt) {
        counter.count = 0
        counter.resetAt = now + windows[i].windowMs
      }
    })
    return held
  }

  /** Keep the map bounded: drop finished entries, then the oldest, before adding one. */
  private makeRoom(now: number): void {
    if (this.counters.size < MAX_TRACKED_CLIENTS) return
    for (const [key, held] of this.counters) {
      if (key !== OVERALL_KEY && held.every((counter) => now >= counter.resetAt)) {
        this.counters.delete(key)
      }
    }
    for (const key of this.counters.keys()) {
      if (this.counters.size < MAX_TRACKED_CLIENTS) break
      if (key !== OVERALL_KEY) this.counters.delete(key)
    }
  }
}

/**
 * The caller's address as the hosting platform reports it. Vercel sets these headers
 * itself and overwrites anything the caller sent, so they cannot be forged there.
 * Requests with no address at all share one bucket.
 */
export function clientAddress(request: Request): string {
  const real = request.headers.get('x-real-ip')?.trim()
  if (real) return real
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || 'unknown'
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE

/**
 * The two routes that call the model share one limiter, because they share one bill.
 * A person sends a few messages a minute; these allow well over that.
 */
export const aiRouteLimiter = new RateLimiter({
  perClient: [
    { max: 12, windowMs: MINUTE },
    { max: 100, windowMs: HOUR },
  ],
  overall: { max: 600, windowMs: HOUR },
})

/**
 * Team notification emails. The chat sends one after each reply and the intake form a
 * few per submission. No overall ceiling: a lead notification must never be refused
 * because of someone else's traffic.
 */
export const notifyRouteLimiter = new RateLimiter({
  perClient: [
    { max: 30, windowMs: MINUTE },
    { max: 300, windowMs: HOUR },
  ],
})

/** A 429 for a throttled request, or null when the request may proceed. */
export function tooManyRequests(limiter: RateLimiter, request: Request): Response | null {
  const verdict = limiter.check(clientAddress(request))
  if (verdict.ok) return null
  return Response.json(
    { error: 'Too many requests. Please wait a moment and try again.' },
    { status: 429, headers: { 'Retry-After': String(verdict.retryAfterSeconds) } },
  )
}
