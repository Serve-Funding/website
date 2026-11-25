// Request throttling for the public API routes (/api/chat, /api/lets-talk, /api/notify).
//
// What this is: fixed-window counters held in the memory of one server instance, keyed
// by the caller's network address. It is a best-effort brake on one address hammering
// a route.
//
// What this is not: a shared counter, or a count of people. Each server instance
// counts on its own, so a flood spread across instances gets a multiple of these
// limits, and everyone behind one office or VPN address shares one allowance. A limit
// that must hold exactly, or across many addresses, belongs at the edge (a firewall
// rule) in front of this code.
//
// The windows are set far above what one person does in the chat, so that a shared
// address with several real visitors still fits.

export type Window = { max: number; windowMs: number }


export type Verdict = { ok: true } | { ok: false; retryAfterSeconds: number }

/**
 * Addresses tracked at once. When the table is full of live entries, a new address is
 * let through uncounted instead of pushing a live entry out: dropping one would hand a
 * throttled caller a fresh allowance, and refusing would lock out real visitors. A
 * flood from that many addresses is beyond what a per-address counter can stop.
 */
const MAX_TRACKED_CLIENTS = 20_000

type Counter = { count: number; resetAt: number }

export class RateLimiter {
  private readonly counters = new Map<string, Counter[]>()
  private readonly windows: Window[]

  /** A request must fit every window. */
  constructor(windows: Window[]) {
    this.windows = windows
  }

  /** Count one request from `client` and say whether it may proceed. */
  check(client: string, now: number = Date.now()): Verdict {
    let held = this.counters.get(client)
    if (!held) {
      if (!this.hasRoom(now)) return { ok: true }
      held = this.windows.map((w) => ({ count: 0, resetAt: now + w.windowMs }))
      this.counters.set(client, held)
    }

    // Decide before counting, so a refused request does not extend the wait.
    let retryAt = 0
    held.forEach((counter, i) => {
      if (now >= counter.resetAt) {
        counter.count = 0
        counter.resetAt = now + this.windows[i].windowMs
      }
      if (counter.count >= this.windows[i].max) retryAt = Math.max(retryAt, counter.resetAt)
    })
    if (retryAt > 0) {
      return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((retryAt - now) / 1000)) }
    }

    for (const counter of held) counter.count += 1
    return { ok: true }
  }

  /** True when a new address can be tracked, after clearing out finished entries. */
  private hasRoom(now: number): boolean {
    if (this.counters.size < MAX_TRACKED_CLIENTS) return true
    for (const [key, held] of this.counters) {
      if (held.every((counter) => now >= counter.resetAt)) this.counters.delete(key)
    }
    return this.counters.size < MAX_TRACKED_CLIENTS
  }
}

/**
 * The caller's address as the hosting platform reports it. Vercel sets these headers
 * itself and overwrites what the caller sent. Requests with no address share one
 * bucket. An IPv6 caller is keyed by its /64 network, because one subscriber holds
 * that whole range and could otherwise use a new address for every request.
 */
export function clientAddress(request: Request): string {
  const real = request.headers.get('x-real-ip')?.trim()
  const address = real || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || ''
  if (!address) return 'unknown'
  return address.includes(':') ? ipv6Network(address) : address
}

/** The first four groups of an IPv6 address, with `::` expanded. */
function ipv6Network(address: string): string {
  const [head, tail] = address.toLowerCase().split('%')[0].split('::')
  const front = head ? head.split(':') : []
  const back = tail ? tail.split(':') : []
  const groups =
    tail === undefined ? front : [...front, ...Array(Math.max(0, 8 - front.length - back.length)).fill('0'), ...back]
  return groups.slice(0, 4).map((g) => g.replace(/^0+(?=.)/, '')).join(':') + '::/64'
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE

/**
 * The two routes that call the model share one limiter, because they share one bill.
 * One person sends a few messages a minute.
 */
export const aiRouteLimiter = new RateLimiter([
  { max: 20, windowMs: MINUTE },
  { max: 200, windowMs: HOUR },
])

/**
 * Team notification emails, in two separate allowances so that chat traffic can never
 * use up the room a lead notification needs. The chat sends a transcript when a
 * visitor goes quiet; the intake form and downloads send a few emails per lead.
 */
export const transcriptNotifyLimiter = new RateLimiter([
  { max: 30, windowMs: MINUTE },
  { max: 300, windowMs: HOUR },
])
export const leadNotifyLimiter = new RateLimiter([
  { max: 20, windowMs: MINUTE },
  { max: 100, windowMs: HOUR },
])

/** A 429 for a throttled request, or null when the request may proceed. */
export function tooManyRequests(limiter: RateLimiter, request: Request): Response | null {
  const verdict = limiter.check(clientAddress(request))
  if (verdict.ok) return null
  return Response.json(
    { error: 'Too many requests. Please wait a moment and try again.' },
    { status: 429, headers: { 'Retry-After': String(verdict.retryAfterSeconds) } },
  )
}
