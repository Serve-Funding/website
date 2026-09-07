import { verifyContact } from '@/lib/verify-contact'

// Both lookups are paid per call, so cap what one client can spend.
// ponytail: in-memory, so the cap is per serverless instance rather than
// global. Move to Upstash/Vercel KV if a bot ever makes that gap matter.
const MAX_PER_WINDOW = 20
const WINDOW_MS = 60 * 60 * 1000
const hits = new Map<string, { count: number; resetAt: number }>()

function overLimit(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    if (hits.size > 5000) {
      for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key)
    }
    return false
  }

  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json()

    if (!email) {
      return Response.json({ error: 'email is required' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
    if (overLimit(ip)) {
      // Fail open — a rate-limited client is still allowed through the form.
      return Response.json({
        email: { result: 'unchecked' },
        phone: { valid: null },
        flags: ['Verification skipped (rate limited)'],
        hardFail: null,
      })
    }

    return Response.json(await verifyContact({ email, phone }))
  } catch (error) {
    console.error('Contact verification error:', error)
    // Never block intake on our own failure.
    return Response.json({
      email: { result: 'unchecked' },
      phone: { valid: null },
      flags: ['Verification failed to run'],
      hardFail: null,
    })
  }
}
