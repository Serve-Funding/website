#!/usr/bin/env node
/**
 * Writes src/data/last-updated.generated.ts from git history.
 *
 * Freshness is a real input to how assistants rank and cite a page, and every
 * page except the blog was shipping without a dateModified. The hand-maintained
 * "Last Updated:" comments in the data files are not a usable source: solutions
 * .tsx claimed 2025-12-07 while being edited daily, and company-info.ts said
 * literally "[DATE]". Dates a human has to remember to bump will always rot, so
 * this derives them from the last commit that actually touched each file.
 *
 * Runs before the SEO gate in `npm run build`. The output file is committed, so
 * if git history is unavailable (a shallow CI clone, a tarball) the previously
 * committed dates stand rather than the build failing or, worse, silently
 * stamping everything with today.
 */
import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const OUT = 'src/data/last-updated.generated.ts'

/** Data files whose content drives a rendered page. */
const TRACKED = [
  'src/data/solutions.tsx',
  'src/data/industries.ts',
  'src/data/comparisons.ts',
  'src/data/solutions-comparison.ts',
  'src/data/faq-data.ts',
  'src/data/glossary.ts',
  'src/data/funding-pages.ts',
  'src/data/fundingData.ts',
  'src/data/company-info.ts',
  'src/data/partners.ts',
]

function gitDate(file: string): string | null {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null
  } catch {
    return null
  }
}

/** Previously committed dates, used when git cannot answer. */
function existing(): Record<string, string> {
  try {
    const src = fs.readFileSync(OUT, 'utf8')
    const out: Record<string, string> = {}
    for (const m of src.matchAll(/'([^']+)':\s*'(\d{4}-\d{2}-\d{2})'/g)) out[m[1]] = m[2]
    return out
  } catch {
    return {}
  }
}

const prior = existing()
const dates: Record<string, string> = {}
const unresolved: string[] = []

for (const file of TRACKED) {
  if (!fs.existsSync(file)) continue
  const d = gitDate(file) ?? prior[file]
  if (d) dates[file] = d
  else unresolved.push(file)
}

if (Object.keys(dates).length === 0) {
  console.error('generate-last-updated: no dates resolved and no prior file to fall back on.')
  process.exit(1)
}

const body = `/**
 * GENERATED FILE - DO NOT EDIT.
 *
 * Written by scripts/generate-last-updated.ts from git history, before every
 * build. Feeds dateModified into per-page schema. To change a date, change the
 * file it refers to.
 */

export const DATA_LAST_UPDATED = {
${Object.entries(dates).sort().map(([f, d]) => `  '${f}': '${d}',`).join('\n')}
} as const

export type TrackedDataFile = keyof typeof DATA_LAST_UPDATED

/** ISO date for a tracked data file, or today if it is somehow untracked. */
export function lastUpdated(file: TrackedDataFile): string {
  return DATA_LAST_UPDATED[file]
}
`

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, body)
console.log(`📅 last-updated: ${Object.keys(dates).length} data files dated from git`)
if (unresolved.length) console.log(`   unresolved (no git history, no prior value): ${unresolved.join(', ')}`)
