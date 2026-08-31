/**
 * GENERATED FILE - DO NOT EDIT.
 *
 * Written by scripts/generate-last-updated.ts from git history, before every
 * build. Feeds dateModified into per-page schema. To change a date, change the
 * file it refers to.
 */

export const DATA_LAST_UPDATED = {
  'src/data/company-info.ts': '2026-08-31',
  'src/data/comparisons.ts': '2026-08-31',
  'src/data/faq-data.ts': '2026-08-31',
  'src/data/funding-pages.ts': '2026-08-31',
  'src/data/fundingData.ts': '2026-06-06',
  'src/data/glossary.ts': '2026-08-31',
  'src/data/industries.ts': '2026-08-31',
  'src/data/partners.ts': '2025-12-10',
  'src/data/solutions-comparison.ts': '2026-08-31',
  'src/data/solutions.tsx': '2026-08-31',
} as const

export type TrackedDataFile = keyof typeof DATA_LAST_UPDATED

/** ISO date for a tracked data file, or today if it is somehow untracked. */
export function lastUpdated(file: TrackedDataFile): string {
  return DATA_LAST_UPDATED[file]
}
