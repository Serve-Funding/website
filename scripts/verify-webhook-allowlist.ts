/**
 * Guards the /api/webhook destination allowlist.
 *
 * That route fetches a URL taken from the request body. If this logic ever
 * loosens, the route becomes an open proxy again, and nothing else in the build
 * would notice. Runs as part of `npm run build`, alongside verify-seo.
 */

import { isAllowedWebhookUrl } from '../src/lib/webhook-allowlist'

let failures = 0

function check(label: string, actual: boolean, expected: boolean) {
  if (actual !== expected) {
    console.error(`  FAIL  ${label} — expected ${expected}, got ${actual}`)
    failures++
  }
}

// The destinations the site actually posts to.
check('n8n inquiry hook', isAllowedWebhookUrl('https://aiascend.app.n8n.cloud/webhook/sf-inquiry'), true)
check('n8n newsletter hook', isAllowedWebhookUrl('https://aiascend.app.n8n.cloud/webhook/sf-newsletter'), true)
check('unknown path on an allowed host', isAllowedWebhookUrl('https://aiascend.app.n8n.cloud/webhook/anything-else'), true)

// The attacks this exists to stop.
check('cloud metadata endpoint', isAllowedWebhookUrl('http://169.254.169.254/latest/meta-data/'), false)
check('localhost', isAllowedWebhookUrl('http://localhost:3000/api/notify'), false)
check('internal address', isAllowedWebhookUrl('https://10.0.0.1/'), false)
check('arbitrary third party', isAllowedWebhookUrl('https://example.com/collect'), false)
check('plain http on an allowed host', isAllowedWebhookUrl('http://aiascend.app.n8n.cloud/webhook/sf-inquiry'), false)

// Host matching must be exact, not a suffix or prefix test.
check('lookalike suffix domain', isAllowedWebhookUrl('https://aiascend.app.n8n.cloud.evil.test/x'), false)
check('subdomain of an allowed host', isAllowedWebhookUrl('https://evil.aiascend.app.n8n.cloud/x'), false)
check('allowed host in the userinfo section', isAllowedWebhookUrl('https://aiascend.app.n8n.cloud@evil.test/x'), false)
check('allowed host in the query string', isAllowedWebhookUrl('https://evil.test/?u=aiascend.app.n8n.cloud'), false)

// Shapes that must not throw or slip through.
check('empty string', isAllowedWebhookUrl(''), false)
check('not a url', isAllowedWebhookUrl('not-a-url'), false)
check('null', isAllowedWebhookUrl(null), false)
check('object', isAllowedWebhookUrl({ toString: () => 'https://aiascend.app.n8n.cloud/' }), false)
check('protocol-relative', isAllowedWebhookUrl('//aiascend.app.n8n.cloud/webhook/sf-inquiry'), false)
check('file protocol', isAllowedWebhookUrl('file:///etc/passwd'), false)

if (failures > 0) {
  console.error(`\n✗ webhook allowlist: ${failures} check(s) failed`)
  process.exit(1)
}

console.log('✓ webhook allowlist: all checks passed')
