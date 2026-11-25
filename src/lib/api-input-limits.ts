// Input bounds for the public AI routes (/api/chat, /api/lets-talk).
//
// Both routes are unauthenticated and forward caller-supplied text to a paid model, so
// every field is bounded here before the model is called. Oversized or malformed
// requests are rejected; an over-long conversation history is trimmed to its most
// recent turns so a genuine long chat keeps working.
//
// The site's own chat UIs trim with `historyForRequest` before sending, so a long
// conversation never reaches the body limit. The server bounds are still the
// authority: nothing here trusts the caller to have trimmed.

// Room for a fully trimmed request in multi-byte text (history + message + form
// answers), with margin. Anything larger did not come from the site's UI.
export const MAX_BODY_BYTES = 200_000
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

  // The header can be absent or wrong, so count the bytes as they arrive and stop
  // reading the moment the limit is passed.
  const reader = request.body?.getReader()
  const chunks: Uint8Array[] = []
  let received = 0
  if (reader) {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      received += value.byteLength
      if (received > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => {})
        throw new InputError('Request is too large', 413)
      }
      chunks.push(value)
    }
  }
  const bytes = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  const raw = new TextDecoder().decode(bytes)

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
 * Turn caller-supplied history into model turns. Entries without a string `text`
 * are dropped, each turn is cut to MAX_HISTORY_TURN_CHARS, and only the most recent
 * turns that fit within MAX_HISTORY_TURNS and MAX_HISTORY_TOTAL_CHARS are kept.
 * A `sender` other than 'user' is treated as the assistant, as it always was.
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

/**
 * Client side: the history to put in a request body. Applies the same bounds the
 * server enforces and sends only `sender` and `text`, so a long conversation keeps
 * working instead of growing past the body limit. The UI keeps its full transcript
 * for display; only the request is trimmed.
 */
export function historyForRequest(
  messages: ReadonlyArray<{ sender: string; text: string }>
): Array<{ sender: 'user' | 'bot'; text: string }> {
  return boundHistory(messages).map((turn) => ({
    sender: turn.role === 'user' ? 'user' : 'bot',
    text: turn.content,
  }))
}

/**
 * Client side: what to tell a visitor whose request was throttled (HTTP 429), using
 * the wait the server reported.
 */
export function throttledMessage(response: Response): string {
  const seconds = Number(response.headers.get('retry-after'))
  const wait =
    !Number.isFinite(seconds) || seconds <= 0
      ? 'a little while'
      : seconds <= 90
        ? 'about a minute'
        : `about ${Math.ceil(seconds / 60)} minutes`
  return `We've had a lot of messages from your network in a short time. Please try again in ${wait}, or contact us at michael@servefunding.com.`
}
