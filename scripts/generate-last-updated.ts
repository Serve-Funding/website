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
 * Two maps come out of this:
 *   DATA_LAST_UPDATED   — per data file, feeds dateModified into page schema.
 *   ROUTE_LAST_MODIFIED — per route, feeds <lastmod> into the sitemap.
 *
 * The sitemap map exists because a hardcoded review date meant every static and
 * dynamic route reported the same stale <lastmod> while the on-page
 * dateModified said something newer. Google reads lastmod to schedule recrawls,
 * so a whole content sweep can land and read as unchanged. Deriving both from
 * the same git history keeps the two signals from contradicting each other.
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

/**
 * Route -> the files that actually render it. The route's date is the newest
 * commit date across them, so editing either the template or its data moves the
 * sitemap. Dynamic families are keyed by their Next.js segment name; the
 * sitemap applies that one date to every URL in the family.
 *
 * Blog routes are deliberately absent: posts carry their own frontmatter dates
 * and the sitemap reads those directly.
 */
const ROUTE_SOURCES: Record<string, string[]> = {
  '/': ['src/app/page.tsx', 'src/data/company-info.ts', 'src/data/solutions.tsx'],
  '/about-us': ['src/app/about-us/page.tsx', 'src/data/company-info.ts'],
  '/solutions': ['src/app/solutions/page.tsx', 'src/data/solutions.tsx'],
  '/solutions/compare': ['src/app/solutions/compare/page.tsx', 'src/data/solutions-comparison.ts'],
  '/compare': ['src/app/compare/page.tsx', 'src/data/comparisons.ts'],
  '/industries': ['src/app/industries/page.tsx', 'src/data/industries.ts'],
  '/glossary': ['src/app/glossary/page.tsx', 'src/data/glossary.ts'],
  '/fundings': ['src/app/fundings/page.tsx', 'src/data/fundingData.ts'],
  '/partners': ['src/app/partners/page.tsx', 'src/data/partners.ts'],
  '/bankers': ['src/app/bankers/page.tsx'],
  '/discover': ['src/app/discover/page.tsx', 'src/data/form-questions.ts'],
  '/faq': ['src/app/faq/page.tsx', 'src/data/faq-data.ts'],
  '/blog': ['src/app/blog/page.tsx'],
  '/privacy-policy': ['src/app/privacy-policy/page.tsx'],
  '/sms-terms': ['src/app/sms-terms/page.tsx'],
  '/terms-of-service': ['src/app/terms-of-service/page.tsx'],
  '/solutions/[solution-id]': ['src/app/solutions/[solution-id]/page.tsx', 'src/data/solutions.tsx'],
  '/compare/[comparison-id]': ['src/app/compare/[comparison-id]/page.tsx', 'src/data/comparisons.ts'],
  '/industries/[industry-id]': ['src/app/industries/[industry-id]/page.tsx', 'src/data/industries.ts'],
}

/**
 * True when `git log` can be trusted to answer "when did this file last change".
 *
 * Vercel clones ~10 commits deep. Under a shallow clone git reports the boundary
 * commit for every file the window doesn't contain, so a page untouched since
 * June comes back dated to whenever the window happens to start — and that date
 * marches forward with every deploy. Inflated dates are worse than no dates:
 * Google drops the lastmod signal entirely for domains that publish them.
 *
 * So deepen the history first, and if that isn't possible, say so and let the
 * committed values stand instead of believing the shallow answer.
 */
function isShallow(): boolean {
  try {
    return execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() === 'true'
  } catch {
    return false
  }
}

function ensureFullHistory(): boolean {
  if (!isShallow()) return true
  try {
    execFileSync('git', ['fetch', '--unshallow', '--quiet'], { stdio: 'ignore', timeout: 120_000 })
  } catch {
    // No network, no credentials, or a detached build checkout. Fall through.
  }
  return !isShallow()
}

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
function existing(block: 'DATA_LAST_UPDATED' | 'ROUTE_LAST_MODIFIED'): Record<string, string> {
  try {
    const src = fs.readFileSync(OUT, 'utf8')
    const start = src.indexOf(`export const ${block} = {`)
    if (start === -1) return {}
    const end = src.indexOf('} as const', start)
    const out: Record<string, string> = {}
    for (const m of src.slice(start, end).matchAll(/'([^']+)':\s*'(\d{4}-\d{2}-\d{2})'/g)) out[m[1]] = m[2]
    return out
  } catch {
    return {}
  }
}

const priorData = existing('DATA_LAST_UPDATED')
const priorRoutes = existing('ROUTE_LAST_MODIFIED')
const dates: Record<string, string> = {}
const unresolved: string[] = []

const trustGit = ensureFullHistory()
if (!trustGit) {
  console.log('   git history is shallow and could not be deepened; keeping committed dates')
}

/** Committed dates win over a shallow git's guesses, never over a full one. */
function resolve(file: string): string | undefined {
  return trustGit ? (gitDate(file) ?? priorData[file]) : (priorData[file] ?? gitDate(file) ?? undefined)
}

for (const file of TRACKED) {
  if (!fs.existsSync(file)) continue
  const d = resolve(file)
  if (d) dates[file] = d
  else unresolved.push(file)
}

if (Object.keys(dates).length === 0) {
  console.error('generate-last-updated: no dates resolved and no prior file to fall back on.')
  process.exit(1)
}

const routes: Record<string, string> = {}
for (const [route, sources] of Object.entries(ROUTE_SOURCES)) {
  const present = sources.filter(f => fs.existsSync(f))
  if (present.length === 0) {
    console.error(`generate-last-updated: no source files exist for route ${route}.`)
    process.exit(1)
  }
  // Newest wins: a page is as fresh as the most recently edited thing behind it.
  const newest = present
    .map(gitDate)
    .filter((d): d is string => d !== null)
    .sort()
    .pop()
  const d = trustGit ? (newest ?? priorRoutes[route]) : (priorRoutes[route] ?? newest)
  if (d) routes[route] = d
  else unresolved.push(route)
}

const body = `/**
 * GENERATED FILE - DO NOT EDIT.
 *
 * Written by scripts/generate-last-updated.ts from git history, before every
 * build. DATA_LAST_UPDATED feeds dateModified into per-page schema;
 * ROUTE_LAST_MODIFIED feeds <lastmod> into the sitemap. To change a date,
 * change the file it refers to.
 */

export const DATA_LAST_UPDATED = {
${Object.entries(dates).sort().map(([f, d]) => `  '${f}': '${d}',`).join('\n')}
} as const

export const ROUTE_LAST_MODIFIED = {
${Object.entries(routes).sort().map(([r, d]) => `  '${r}': '${d}',`).join('\n')}
} as const

export type TrackedDataFile = keyof typeof DATA_LAST_UPDATED
export type TrackedRoute = keyof typeof ROUTE_LAST_MODIFIED

/** ISO date for a tracked data file, or today if it is somehow untracked. */
export function lastUpdated(file: TrackedDataFile): string {
  return DATA_LAST_UPDATED[file]
}

/** ISO date for a tracked route, used as the sitemap <lastmod>. */
export function routeLastModified(route: TrackedRoute): Date {
  return new Date(\`\${ROUTE_LAST_MODIFIED[route]}T00:00:00Z\`)
}
`

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, body)
console.log(
  `📅 last-updated: ${Object.keys(dates).length} data files, ${Object.keys(routes).length} routes dated from ` +
    (trustGit ? 'git' : 'the committed fallback (shallow clone)')
)
if (unresolved.length) console.log(`   unresolved (no git history, no prior value): ${unresolved.join(', ')}`)
