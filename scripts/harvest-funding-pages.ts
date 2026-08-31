#!/usr/bin/env node
/**
 * One-shot harvest for the /funding -> /solutions + /industries consolidation.
 *
 * Emits docs/funding-pages-harvest.md: every block worth keeping from
 * src/data/funding-pages.ts, keyed by the destination page it moves to.
 * Delete this script once the migration lands.
 */
import fs from 'fs'
import { fundingPages, type FundingPage } from '../src/data/funding-pages'

type Dest = { dest: string; note?: string }
const MAP: Record<string, Dest> = {
  'revenue-based-financing':          { dest: '/solutions/working-capital-loans' },
  'invoice-factoring':               { dest: '/solutions/invoice-factoring', note: 'Cleanest transplant. Written 2026-08-31, never had a counterpart problem.' },
  'purchase-order-financing':        { dest: '/solutions/purchase-order-funding' },
  'business-bridge-loan':            { dest: '/solutions/bridge-funding', note: 'Carry the real-estate routing block over verbatim. It is the fix Michael asked for on 2026-08-28.' },
  'mca-consolidation':               { dest: '/solutions/debt-refinance', note: 'Competitor-compensation line already cut in PR #60. Does not travel.' },
  'asset-based-lending-manufacturing': { dest: '/industries/manufacturing', note: 'WORKED-EXAMPLE CONFLICT. Destination has one. Recommendation: take the ABL version, it was reworked in PR #60.' },
  'asset-based-lending-healthcare':  { dest: '/industries/healthcare', note: 'WORKED-EXAMPLE CONFLICT. Recommendation: keep the existing one, this repeats it.' },
  'asset-based-lending-staffing':    { dest: '/industries/staffing', note: 'WORKED-EXAMPLE CONFLICT. Kyler to pick, they are close in quality.' },
  'asset-based-lending-construction':{ dest: '/industries/construction', note: 'WORKED-EXAMPLE CONFLICT. Kyler to pick.' },
}

const bullets = (xs: string[]) => xs.map(x => `- ${x}`).join('\n')
const paras = (s: string) => s.split('\n\n').map(p => p.trim()).filter(Boolean).join('\n\n')

function page(p: FundingPage): string {
  const m = MAP[p.id]
  const out: string[] = []
  out.push(`## \`${p.id}\` → \`${m.dest}\``)
  out.push('')
  if (m.note) out.push(`> **${m.note}**\n`)
  out.push(`**Source H1:** ${p.h1}`)
  out.push('')

  out.push(`### MOVE — terms table → new \`terms\` field`)
  out.push('')
  out.push('| Label | Value |')
  out.push('|---|---|')
  p.terms.forEach(t => out.push(`| ${t.label} | ${t.value} |`))
  out.push('')

  out.push(`### MOVE — deflections → \`notFor\` (new on Solution) / \`whatDoesntFit\` (exists on Industry)`)
  out.push('')
  p.notFor.forEach(n => {
    out.push(`**${n.who}**`)
    out.push('')
    out.push(n.instead)
    out.push('')
  })

  out.push(`### MOVE — worked example → new \`workedExample\` field`)
  out.push('')
  out.push(paras(p.workedExample))
  out.push('')

  out.push(`### FOLD — answer capsule → compare against the destination's existing \`whatIs\` / \`introduction\`, keep the stronger`)
  out.push('')
  out.push(p.directAnswer)
  out.push('')

  out.push(`### FOLD — how it works → into \`fullDesc\` / \`introduction\` prose`)
  out.push('')
  p.howItWorks.forEach((h, i) => out.push(`${i + 1}. **${h.step}** — ${h.detail}`))
  out.push('')

  out.push(`### FOLD — FAQs → \`src/data/faq-data.ts\`, tag \`relatedSolutions\`, de-dupe against what is there`)
  out.push('')
  p.faqs.forEach(f => {
    out.push(`**Q: ${f.question}**`)
    out.push('')
    out.push(f.answer)
    out.push('')
  })

  out.push(`### REWRITE — the problem narrative. Strongest writing here, wrong register for the destination. Keep the substance, change the voice.`)
  out.push('')
  out.push(paras(p.theProblem))
  out.push('')
  return out.join('\n')
}

const order = Object.keys(MAP)
const sorted = [...fundingPages].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))

const header = `# /funding harvest — blocks keyed by destination

**Generated ${new Date().toISOString().slice(0, 10)} from \`src/data/funding-pages.ts\` after PR #60.**
Advance rates below are Michael's verified figures, not the originally published ones.

Nine pages move into nine destinations. Every block below is either MOVE (structured, transplants
as-is), FOLD (merges into a field that already exists), or REWRITE (substance survives, voice does not).
Blocks deliberately dropped: \`fitsIf\` (duplicates \`bestFor\`), \`versus\` (\`/compare/*\` owns it),
\`schema\` (both destinations already emit it), and the \`/funding\` index hero.

Delete this file and \`scripts/harvest-funding-pages.ts\` once the migration lands.

---

`

const generalAbl = `## Product-level ABL facts → \`/solutions/asset-based-lending\`

Pulled from all four ABL crosses. These are true of ABL generally rather than of one vertical, so
they belong on the product page. The vertical-specific exclusions stay on the industry pages.

| Label | Value |
|---|---|
| Eligible receivables | 80%-85% |
| Machinery and equipment | 70%-80% of appraised liquidation value |
| Finished goods inventory | 60%-75% of net orderly liquidation value |
| Raw materials | Generally ineligible. Lenders want finished goods |
| Work in process | Ineligible, zero borrowing base credit |
| Facility size | $250K to $25MM |
| Pricing | Prime + 1%-6% depending on vertical and collateral mix |
| Reporting | Monthly borrowing-base certificate, weekly for tighter facilities |

Sourced from the manufacturing cross after PR #60. Vertical-specific rates that do NOT belong here:
healthcare net-collectible-value advances, construction retainage treatment, staffing AR rates.

---

`

fs.mkdirSync('docs', { recursive: true })
fs.writeFileSync('docs/funding-pages-harvest.md', header + generalAbl + sorted.map(page).join('\n---\n\n'))
console.log(`Harvested ${sorted.length} pages -> docs/funding-pages-harvest.md`)
