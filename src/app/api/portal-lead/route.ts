import { NextResponse } from 'next/server'

// Parallel-stream forwarder: mirrors discover-form leads to the Serve portal's
// inbound-log endpoint. Additive to the existing n8n + HubSpot paths — it never
// blocks them and never surfaces failure to a visitor. Dark until
// PORTAL_LEAD_ENABLED=true, so merging this changes no live behavior.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ENABLED = process.env.PORTAL_LEAD_ENABLED === 'true'
const PORTAL_URL = process.env.PORTAL_INBOUND_URL || ''
const PORTAL_SECRET = process.env.PORTAL_INBOUND_SECRET || ''
const TIMEOUT_MS = 5000

export async function POST(request: Request) {
  // Read the payload defensively; a bad body must never 500 the visitor's page.
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_json' })
  }

  // Kill switch: stay dark until explicitly enabled in the environment.
  if (!ENABLED) {
    return NextResponse.json({ ok: true, skipped: 'disabled' })
  }

  // Misconfiguration is a failure WE should see (server logs), not the visitor.
  if (!PORTAL_URL || !PORTAL_SECRET) {
    console.error('[portal-lead] enabled but PORTAL_INBOUND_URL / PORTAL_INBOUND_SECRET is unset')
    return NextResponse.json({ ok: false, reason: 'not_configured' })
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
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error(`[portal-lead] portal responded ${res.status}: ${detail.slice(0, 500)}`)
      return NextResponse.json({ ok: false, reason: 'portal_error', status: res.status })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    // Swallow — the visitor's flow (n8n + email) already succeeded independently.
    console.error('[portal-lead] forward failed:', error)
    return NextResponse.json({ ok: false, reason: 'forward_failed' })
  } finally {
    clearTimeout(timeout)
  }
}
