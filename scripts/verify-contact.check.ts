/**
 * Self-check for src/lib/verify-contact.ts — run with:  npx tsx scripts/verify-contact.check.ts
 *
 * Stubs fetch so it never touches Twilio or NeverBounce. Asserts the two things
 * that matter: an undeliverable email hard-fails, and everything else fails open.
 */
import assert from 'node:assert/strict'

// Keys must be set before the module is imported — it reads env at module load.
process.env.NEVERBOUNCE_API_KEY = 'test-key'
process.env.TWILIO_ACCOUNT_SID = 'test-sid'
process.env.TWILIO_AUTH_TOKEN = 'test-token'


type Stub = { email?: any; phone?: any; emailStatus?: number; phoneStatus?: number }

function stubFetch({ email, phone, emailStatus = 200, phoneStatus = 200 }: Stub) {
  global.fetch = (async (url: string | URL | Request) => {
    const href = String(url)
    const isEmail = href.includes('neverbounce')
    const status = isEmail ? emailStatus : phoneStatus
    const body = isEmail ? email : phone
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    } as Response
  }) as typeof fetch
}

async function main() {
const { verifyContact } = await import('../src/lib/verify-contact')

const OK_EMAIL = { status: 'success', result: 'valid', flags: [], suggested_correction: '' }
const usMobile = (carrier = 'Verizon') => ({
  valid: true,
  country_code: 'US',
  line_type_intelligence: { type: 'mobile', carrier_name: carrier },
})

// 1. Clean lead — no flags, nothing blocked.
stubFetch({ email: OK_EMAIL, phone: usMobile() })
let v = await verifyContact({ email: 'owner@realco.com', phone: '(704) 555-1234' })
assert.equal(v.hardFail, null)
assert.deepEqual(v.flags, [], `expected no flags, got ${JSON.stringify(v.flags)}`)
assert.equal(v.phone.carrier, 'Verizon')

// 2. Undeliverable email is the only thing that blocks the form.
stubFetch({
  email: { status: 'success', result: 'invalid', suggested_correction: 'owner@gmail.com' },
  phone: usMobile(),
})
v = await verifyContact({ email: 'owner@gmial.com', phone: '+17045551234' })
assert.equal(v.hardFail, 'email')
assert.match(v.flags[0], /undeliverable/i)
assert.match(v.flags[0], /owner@gmail\.com/)

// 3. Burner VoIP number — flagged, not blocked. This is the India/NC lead case.
stubFetch({
  email: OK_EMAIL,
  phone: { valid: true, country_code: 'US', line_type_intelligence: { type: 'nonFixedVoip', carrier_name: 'Google Voice' } },
})
v = await verifyContact({ email: 'owner@realco.com', phone: '+17045551234' })
assert.equal(v.hardFail, null)
assert.equal(v.flags.length, 1)
assert.match(v.flags[0], /VoIP/i)

// 4. Foreign number — flagged with the country.
stubFetch({
  email: OK_EMAIL,
  phone: { valid: true, country_code: 'IN', line_type_intelligence: { type: 'mobile', carrier_name: 'Airtel' } },
})
v = await verifyContact({ email: 'owner@realco.com', phone: '+919876543210' })
assert.equal(v.hardFail, null)
assert.match(v.flags.join(' '), /registered in IN/)

// 5. Disposable email is flagged but still gets through.
stubFetch({ email: { status: 'success', result: 'disposable' }, phone: usMobile() })
v = await verifyContact({ email: 'x@mailinator.com', phone: '+17045551234' })
assert.equal(v.hardFail, null)
assert.match(v.flags.join(' '), /Disposable/)

// 6. Both APIs down — fail open, never block a real lead.
stubFetch({ emailStatus: 500, phoneStatus: 500 })
v = await verifyContact({ email: 'owner@realco.com', phone: '+17045551234' })
assert.equal(v.hardFail, null)
assert.equal(v.email.result, 'unchecked')
assert.equal(v.phone.valid, null)

// 7. NeverBounce auth failure returns HTTP 200 with a non-success status.
stubFetch({ email: { status: 'auth_failure', message: 'bad key' }, phone: usMobile() })
v = await verifyContact({ email: 'owner@realco.com', phone: '+17045551234' })
assert.equal(v.hardFail, null)
assert.equal(v.email.result, 'unchecked')

// 8. No phone given is itself worth telling the team about.
stubFetch({ email: OK_EMAIL })
v = await verifyContact({ email: 'owner@realco.com' })
assert.equal(v.hardFail, null)
assert.match(v.flags.join(' '), /No phone number given/)

console.log('verify-contact: 8/8 checks passed')
}

main()
