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

import { isIP } from 'node:net'

export type Window = { max: number; windowMs: number }


export type Verdict = { ok: true } | { ok: false; retryAfterSeconds: number }

/**
 * Addresses tracked at once. When the table is full of live entries, a new address is
 * let through uncounted instead of pushing a live entry out: dropping one would hand a
 * throttled caller a fresh allowance, and refusing would lock out real visitors. A
 * flood from that many addresses is beyond what a per-address counter can stop.
 */
const MAX_TRACKED_CLIENTS = 20_000
/** While the table is full, look for finished entries at most this often. */
const SWEEP_INTERVAL_MS = 10_000

type Counter = { count: number; resetAt: number }

export class RateLimiter {
  private readonly counters = new Map<string, Counter[]>()
  private readonly windows: Window[]
  private nextSweepAt = 0

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

  /** Give back one counted request, for a caller that a later check turned away. */
  refund(client: string): void {
    for (const counter of this.counters.get(client) ?? []) {
      if (counter.count > 0) counter.count -= 1
    }
  }

  /** True when a new address can be tracked, after clearing out finished entries. */
  private hasRoom(now: number): boolean {
    if (this.counters.size < MAX_TRACKED_CLIENTS) return true
    if (now < this.nextSweepAt) return false
    this.nextSweepAt = now + SWEEP_INTERVAL_MS
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
  const raw = real || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || ''
  if (!raw) return 'unknown'

  const address = raw.toLowerCase().split('%')[0]
  if (isIP(address) === 4) return address
  if (isIP(address) === 6) {
    const groups = ipv6Groups(address)
    // An IPv4 address carried inside IPv6 (::ffff:203.0.113.7, in either spelling) is
    // that IPv4 address.
    if (groups.slice(0, 5).every((g) => g === 0) && groups[5] === 0xffff) {
      return [groups[6] >> 8, groups[6] & 255, groups[7] >> 8, groups[7] & 255].join('.')
    }
    return groups.slice(0, 4).map((g) => g.toString(16)).join(':') + '::/64'
  }
  // Not an address we recognise: still a stable key, kept short.
  return `other:${address.slice(0, 64)}`
}

/** The eight 16-bit groups of a valid IPv6 address. */
function ipv6Groups(address: string): number[] {
  // A dotted IPv4 tail stands for the last two groups.
  const dotted = /^(.*:)(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(address)
  const text = dotted
    ? dotted[1] +
      ((Number(dotted[2]) << 8) | Number(dotted[3])).toString(16) +
      ':' +
      ((Number(dotted[4]) << 8) | Number(dotted[5])).toString(16)
    : address
  const [head, tail] = text.split('::')
  const front = head ? head.split(':') : []
  const back = tail ? tail.split(':') : []
  const filled =
    tail === undefined ? front : [...front, ...Array(8 - front.length - back.length).fill('0'), ...back]
  return filled.map((g) => parseInt(g, 16))
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE

/**
 * The two routes that call the model use one limiter, because they share one bill.
 * The allowance is shared only where both routes run in the same server process;
 * otherwise each route counts on its own. One person sends a few messages a minute.
 */
export const aiRouteLimiter = new RateLimiter([
  { max: 20, windowMs: MINUTE },
  { max: 200, windowMs: HOUR },
])

/**
 * Team notification emails. Nothing that calls this route retries a refused request,
 * so a refusal here is a lost email: the limits are loose and only stop a flood.
 *
 * Chat transcripts and lead notifications have separate allowances, so that chat
 * traffic can never use up the room a lead notification needs. The route-wide limiter
 * runs before the body is read, so a flood of unreadable requests is refused cheaply.
 * A request that one of the other two then turns away is given back to it, so refused
 * transcripts cannot use up the room a lead needs there either.
 */
export const notifyRouteLimiter = new RateLimiter([
  { max: 120, windowMs: MINUTE },
  { max: 1200, windowMs: HOUR },
])
export const transcriptNotifyLimiter = new RateLimiter([
  { max: 30, windowMs: MINUTE },
  { max: 300, windowMs: HOUR },
])
export const leadNotifyLimiter = new RateLimiter([
  { max: 30, windowMs: MINUTE },
  { max: 300, windowMs: HOUR },
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
