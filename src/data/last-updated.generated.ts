/**
 * GENERATED FILE - DO NOT EDIT.
 *
 * Written by scripts/generate-last-updated.ts from git history, before every
 * build. DATA_LAST_UPDATED feeds dateModified into per-page schema;
 * ROUTE_LAST_MODIFIED feeds <lastmod> into the sitemap. To change a date,
 * change the file it refers to.
 */

export const DATA_LAST_UPDATED = {
  'src/data/company-info.ts': '2026-08-31',
  'src/data/comparisons.ts': '2026-08-31',
  'src/data/faq-data.ts': '2026-08-31',
  'src/data/fundingData.ts': '2026-06-06',
  'src/data/glossary.ts': '2026-08-31',
  'src/data/industries.ts': '2026-08-31',
  'src/data/partners.ts': '2025-12-10',
  'src/data/solutions-comparison.ts': '2026-08-31',
  'src/data/solutions.tsx': '2026-08-31',
} as const

export const ROUTE_LAST_MODIFIED = {
  '/': '2026-09-09',
  '/about-us': '2026-08-31',
  '/bankers': '2026-08-31',
  '/blog': '2026-06-21',
  '/compare': '2026-08-31',
  '/compare/[comparison-id]': '2026-08-31',
  '/discover': '2026-09-09',
  '/faq': '2026-08-31',
  '/fundings': '2026-06-09',
  '/glossary': '2026-08-31',
  '/industries': '2026-08-31',
  '/industries/[industry-id]': '2026-08-31',
  '/partners': '2026-08-31',
  '/privacy-policy': '2026-08-31',
  '/sms-terms': '2026-08-31',
  '/solutions': '2026-08-31',
  '/solutions/[solution-id]': '2026-09-07',
  '/solutions/compare': '2026-09-07',
  '/terms-of-service': '2026-08-31',
} as const

export type TrackedDataFile = keyof typeof DATA_LAST_UPDATED
export type TrackedRoute = keyof typeof ROUTE_LAST_MODIFIED

/** ISO date for a tracked data file, or today if it is somehow untracked. */
export function lastUpdated(file: TrackedDataFile): string {
  return DATA_LAST_UPDATED[file]
}

/** ISO date for a tracked route, used as the sitemap <lastmod>. */
export function routeLastModified(route: TrackedRoute): Date {
  return new Date(`${ROUTE_LAST_MODIFIED[route]}T00:00:00Z`)
}
