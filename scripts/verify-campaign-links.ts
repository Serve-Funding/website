/**
 * Guards the campaign attribution link — `/fundings?id=<linkedin-id>#<slug>`.
 *
 * Two silent failure modes, both of which cost a whole send:
 *
 * 1. **The id is not read.** A link built as `#slug?id=x` puts the id in the
 *    fragment, where `useSearchParams()` cannot see it. Every open then looks
 *    anonymous and nobody notices, because the page still renders perfectly.
 * 2. **The funding card does not open.** Every funding slug must survive the
 *    fragment parser. One live deal slugs to `bridge-to-m&a-exit`; a parser that
 *    treats `&` as a separator turns it into `bridge-to-m`, which matches no
 *    case study, so the banker lands on the grid instead of the deal we sent.
 *
 * Both are invisible in review and invisible in production, so they are pinned
 * here and run in `npm run build` alongside verify-seo.
 */

import { fundingCases } from '../src/data/fundingData'
import { hashSlug, readCampaignId, stripCampaignId } from '../src/lib/campaign-visitor'

const SITE = 'https://servefunding.com'
let failures = 0

function check(label: string, actual: unknown, expected: unknown) {
  if (actual !== expected) {
    console.error(`  FAIL  ${label} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
    failures++
  }
}

/** Must match `generateSlug` in src/app/fundings/page.tsx. */
const slugOf = (title: string) => title.toLowerCase().replace(/\s+/g, '-')

// ---------------------------------------------------------------------------
// Every funding card is reachable, in both link orderings, carrying an id.
// ---------------------------------------------------------------------------
for (const study of fundingCases) {
  const slug = slugOf(study.title)

  // Canonical: query first, fragment last.
  const canonical = `${SITE}/fundings?id=jimtingler#${slug}`
  check(`canonical id — ${slug}`, readCampaignId(canonical), 'jimtingler')
  check(`canonical slug — ${slug}`, hashSlug(new URL(canonical).hash), slug)

  // What a human writes in a campaign tool: fragment first, id tacked on.
  const fragmentFirst = `${SITE}/fundings#${slug}?id=jimtingler`
  check(`fragment-first id — ${slug}`, readCampaignId(fragmentFirst), 'jimtingler')
  check(`fragment-first slug — ${slug}`, hashSlug(new URL(fragmentFirst).hash), slug)

  // Stripping the id must leave the card addressable.
  const strippedFragmentFirst = stripCampaignId(fragmentFirst)
  check(
    `fragment-first strips to slug — ${slug}`,
    strippedFragmentFirst && hashSlug(new URL(strippedFragmentFirst, SITE).hash),
    slug
  )
  check(`fragment-first strip drops id — ${slug}`, strippedFragmentFirst?.includes('jimtingler'), false)
}

// ---------------------------------------------------------------------------
// Two funding cards sharing a title share a slug, and the page opens the FIRST
// match — so the second card cannot be linked to at all. A WARNING, not a
// failure: the fix is to retitle a card, which is Mike and Sarah's copy to
// change, not the build's. Today `Total Working Capital` appears twice.
// ---------------------------------------------------------------------------
const seenSlugs = new Map<string, number>()
for (const study of fundingCases) {
  const slug = slugOf(study.title)
  seenSlugs.set(slug, (seenSlugs.get(slug) ?? 0) + 1)
}
for (const [slug, count] of seenSlugs) {
  if (count > 1) {
    console.warn(
      `  WARN  ${count} funding cards slug to "${slug}" — only the first can be opened by a campaign link. Retitle one to make both linkable.`
    )
  }
}

// ---------------------------------------------------------------------------
// Parser behaviour that the link builder depends on.
// ---------------------------------------------------------------------------
check('id from a bare query', readCampaignId(`${SITE}/blog/x?id=Jim-Tingler`), 'jim-tingler')
check('id percent-encoded once', readCampaignId(`${SITE}/fundings?id=jean%2Dsimon`), 'jean-simon')
check('non-ascii identifier kept', readCampaignId(`${SITE}/fundings?id=jeann%C3%A9-mack`), 'jeanné-mack')
check('long member-hash identifier', readCampaignId(`${SITE}/fundings?id=steven-a-sandoval-33514650`), 'steven-a-sandoval-33514650')
check('linkedin member urn lowercased', readCampaignId(`${SITE}/fundings?id=ACoAAAB1cDEBxyz`), 'acoaaab1cdebxyz')
check('no id is no id', readCampaignId(`${SITE}/fundings#seasonal-working-capital`), null)
check('empty id rejected', readCampaignId(`${SITE}/fundings?id=`), null)
check('over-long id rejected', readCampaignId(`${SITE}/fundings?id=${'a'.repeat(129)}`), null)
check('id with markup rejected', readCampaignId(`${SITE}/fundings?id=%3Cscript%3E`), null)

check('nothing to strip', stripCampaignId(`${SITE}/fundings#seasonal-working-capital`), null)
check('query id stripped, hash kept', stripCampaignId(`${SITE}/fundings?id=x#payroll-cover`), '/fundings#payroll-cover')
check(
  'other fragment params survive',
  stripCampaignId(`${SITE}/fundings#payroll-cover?id=x&utm_source=li`),
  '/fundings#payroll-cover?utm_source=li'
)

if (failures > 0) {
  console.error(`\n✗ campaign links: ${failures} check(s) failed`)
  process.exit(1)
}

console.log(`✓ campaign links: ${fundingCases.length} funding cards reachable with attribution`)
