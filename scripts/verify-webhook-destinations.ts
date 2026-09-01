/**
 * Guards two properties of /api/webhook that nothing else in the build checks.
 *
 * 1. The route resolves destinations server-side. If a caller-supplied URL ever
 *    becomes routable again, the route is an open proxy again.
 * 2. No hook URL appears in a client component. That is what keeps the vendor
 *    host out of the browser bundle, and it is one careless import away from
 *    regressing silently.
 *
 * Runs in `npm run build`, alongside verify-seo.
 */

import fs from 'fs'
import path from 'path'
import {
  isWebhookTarget,
  legacyTargetForUrl,
  primaryDestination,
} from '../src/lib/webhook-destinations'

let failures = 0

function check(label: string, actual: unknown, expected: unknown) {
  if (actual !== expected) {
    console.error(`  FAIL  ${label} — expected ${String(expected)}, got ${String(actual)}`)
    failures++
  }
}

// Targets the site actually uses.
check('inquiry is a target', isWebhookTarget('inquiry'), true)
check('newsletter is a target', isWebhookTarget('newsletter'), true)
check('inquiry resolves to https', primaryDestination('inquiry').startsWith('https://'), true)
check('newsletter resolves to https', primaryDestination('newsletter').startsWith('https://'), true)

// Anything else must not name a destination.
for (const bad of [
  'https://example.com/collect',
  'http://169.254.169.254/latest/meta-data/',
  'clay',
  '',
  '__proto__',
  'constructor',
]) {
  check(`rejected target: ${bad || '(empty)'}`, isWebhookTarget(bad), false)
}
check('null target', isWebhookTarget(null), false)
check('object target', isWebhookTarget({ toString: () => 'inquiry' }), false)

// The legacy shim accepts known URLs exactly, and nothing else.
// Pinned to the URLs that shipped, so an env override cannot break the shim.
check('legacy inquiry url', legacyTargetForUrl('https://aiascend.app.n8n.cloud/webhook/sf-inquiry'), 'inquiry')
check('legacy newsletter url', legacyTargetForUrl('https://aiascend.app.n8n.cloud/webhook/sf-newsletter'), 'newsletter')
check('legacy rejects third party', legacyTargetForUrl('https://example.com/collect'), null)
check('legacy rejects metadata', legacyTargetForUrl('http://169.254.169.254/'), null)
check(
  'legacy rejects suffix lookalike',
  legacyTargetForUrl('https://aiascend.app.n8n.cloud/webhook/sf-inquiry.evil.test'),
  null
)
check('legacy rejects null', legacyTargetForUrl(null), null)

// No hook URL may be reachable from a client component.
const CLIENT_DIRS = ['src/app', 'src/components', 'src/hooks']
const HOOK_HOST = /n8n\.cloud|NEXT_PUBLIC_CLAY_WEBHOOK_URL/

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) return walk(full)
    return /\.(ts|tsx)$/.test(e.name) ? [full] : []
  })
}

for (const file of CLIENT_DIRS.flatMap(walk)) {
  const src = fs.readFileSync(file, 'utf8')
  if (!src.includes("'use client'") && !src.includes('"use client"')) continue
  if (HOOK_HOST.test(src)) {
    console.error(`  FAIL  hook URL reachable from a client component: ${file}`)
    failures++
  }
}

if (failures > 0) {
  console.error(`\n✗ webhook destinations: ${failures} check(s) failed`)
  process.exit(1)
}

console.log('✓ webhook destinations: all checks passed')
