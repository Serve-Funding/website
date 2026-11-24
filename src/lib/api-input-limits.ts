// Input bounds for the public AI routes (/api/chat, /api/lets-talk).
//
// Both routes are unauthenticated and forward caller-supplied text to a paid model, so
// every field is bounded here before the model is called. Oversized or malformed
// requests are rejected; an over-long conversation history is trimmed to its most
// recent turns so a genuine long chat keeps working.

export const MAX_BODY_BYTES = 100_000
export const MAX_MESSAGE_CHARS = 2_000
export const MAX_HISTORY_TURNS = 20
export const MAX_HISTORY_TURN_CHARS = 4_000
export const MAX_HISTORY_TOTAL_CHARS = 20_000

export type ChatTurn = { role: 'user' | 'assistant'; content: string }

export class InputError extends Error {
  status: number
  constructor(message: string, status = 400) {
    super(message)
    this.name = 'InputError'
    this.status = status
  }
}

/** Read and parse a JSON object body, refusing anything over MAX_BODY_BYTES. */
export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  const declared = Number(request.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    throw new InputError('Request is too large', 413)
  }

  const raw = await request.text()
  // The header can be absent or wrong, so measure what actually arrived.
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    throw new InputError('Request is too large', 413)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new InputError('Request body must be JSON')
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new InputError('Request body must be a JSON object')
  }
  return parsed as Record<string, unknown>
}

/** The visitor's current message: a non-empty string within MAX_MESSAGE_CHARS. */
export function requireMessage(value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new InputError('Message is required')
  }
  if (value.length > MAX_MESSAGE_CHARS) {
    throw new InputError(`Message is too long (max ${MAX_MESSAGE_CHARS} characters)`)
  }
  return value
}

/**
 * Turn caller-supplied history into model turns. Entries that are not
 * `{ sender, text: string }` are dropped, each turn is cut to
 * MAX_HISTORY_TURN_CHARS, and only the most recent turns that fit within
 * MAX_HISTORY_TURNS and MAX_HISTORY_TOTAL_CHARS are kept.
 */
export function boundHistory(value: unknown): ChatTurn[] {
  if (!Array.isArray(value)) return []

  const kept: ChatTurn[] = []
  let total = 0
  // Walk backwards so the newest turns win. Look at no more than a bounded number
  // of entries, so a huge array of junk cannot keep the loop busy.
  const floor = Math.max(0, value.length - MAX_HISTORY_TURNS * 5)
  for (let i = value.length - 1; i >= floor && kept.length < MAX_HISTORY_TURNS; i--) {
    const entry = value[i] as { sender?: unknown; text?: unknown } | null
    if (!entry || typeof entry !== 'object' || typeof entry.text !== 'string') continue
    const content = entry.text.slice(0, MAX_HISTORY_TURN_CHARS)
    if (content.trim() === '') continue
    if (total + content.length > MAX_HISTORY_TOTAL_CHARS) break
    total += content.length
    kept.push({ role: entry.sender === 'user' ? 'user' : 'assistant', content })
  }
  return kept.reverse()
}

/** A short single-line string for interpolating into a prompt, or '' if not a string. */
export function boundField(value: unknown, maxChars: number): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim().slice(0, maxChars)
}

/** A bounded list of short strings, for multi-select form answers. */
export function boundList(value: unknown, maxItems: number, maxChars: number): string[] {
  if (!Array.isArray(value)) return []
  return value
    .slice(0, maxItems)
    .map((item) => boundField(item, maxChars))
    .filter(Boolean)
}
