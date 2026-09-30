/**
 * Partner one-pagers offered as gated downloads on /bankers and /advisors.
 *
 * The files live in public/downloads/, so the URL is not secret — the gate is a
 * lead-capture step, not access control. What it buys is the part Sarah asked
 * for (2026-09-29): when Mia sends a banker to the page from a LinkedIn DM, the
 * visit lands on our site and the team gets told who downloaded what.
 *
 * The key doubles as the value /api/notify accepts, so a request can only ever
 * name one of these, never an arbitrary file.
 */
export const DOWNLOADS = {
  bankers: {
    title: 'Serve Funding Empowers Bankers',
    file: '/downloads/serve-funding-empowers-bankers.pdf',
    audience: 'Banker',
  },
  advisors: {
    title: 'Serve Funding Empowers Advisors',
    file: '/downloads/serve-funding-empowers-advisors.pdf',
    audience: 'Advisor',
  },
} as const

export type DownloadKey = keyof typeof DOWNLOADS

export function isDownloadKey(value: unknown): value is DownloadKey {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(DOWNLOADS, value)
}
