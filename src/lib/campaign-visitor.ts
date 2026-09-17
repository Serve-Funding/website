/**
 * Campaign visitor identity — reading the `?id=` we hang off outreach links.
 *
 * The LinkedIn campaign (LGM, list built in Clay) sends each banker a link to a
 * specific funding card with their own LinkedIn identifier appended, e.g.
 *
 *   https://servefunding.com/fundings?id=jimtingler#payroll-rescue
 *
 * When they open it we hand that id to the portal, which already knows the same
 * identifier (every campaign lead carries their LinkedIn URL), so the portal can
 * say "this banker read this deal on Tuesday" instead of "someone did". A banker
 * who keeps opening our links and has never referred anyone is the warmest call
 * on Cole's list.
 *
 * THE HASH ORDER IS NOT A TYPO — BOTH FORMS MUST WORK.
 * The natural thing to write when you are pasting links into a campaign tool is
 * `/fundings#payroll-rescue?id=jimtingler`, because the funding slug is the part
 * you think of as the page. That URL is legal but means something different:
 * everything after `#` is the fragment, so the browser sends NO query string and
 * `useSearchParams()` returns nothing. Rather than police link-building inside a
 * campaign tool — where a wrong link is silently an unattributed open — we read
 * the id out of either position. `readCampaignId` is the one place that knows.
 *
 * Not personal data we go looking for: the id is only ever what we ourselves put
 * in the link we sent that person. It is stripped from the address bar as soon
 * as it is read (see CampaignVisitorTracker) so it cannot leak onward through a
 * Referer header, a shared screenshot, or a copy-pasted URL.
 */

/** Query/fragment key. Deliberately not `utm_*` — this is an identity, not a source. */
export const CAMPAIGN_ID_PARAM = "id"

/** Survives client-side navigation so later pages in the visit attribute too. */
const STORAGE_KEY = "sf_campaign_id"

/**
 * Cap on what we will accept as an id. LinkedIn public identifiers run to ~100
 * characters at the extreme ("annoyingly long" is the member-hash suffix form,
 * e.g. `steven-a-sandoval-33514650`); the `ACoAAA…` member URN is ~40. 128 is
 * comfortably clear of both and stops a hand-crafted URL from posting a payload.
 */
const MAX_ID_LENGTH = 128

/**
 * Characters a LinkedIn identifier can actually contain. Public identifiers are
 * lowercase alphanumerics and hyphens, but they are generated from the member's
 * name, so accented and non-Latin letters do occur — `kristian-madueño-chavez`
 * and `jeanné-mack` are both real rows in our own campaign list. Hence a
 * negated class (no whitespace, no delimiters, no markup) rather than `[a-z0-9-]`,
 * which would drop exactly the people whose names are not ASCII.
 */
const ID_PATTERN = /^[^\s<>"'/?#&=%\\]+$/u

/** Normalize one candidate id, or reject it. */
export function normalizeCampaignId(raw: string | null | undefined): string | null {
  if (!raw) return null
  let value = raw.trim()
  // A link built by hand in a campaign tool may arrive percent-encoded once.
  try {
    value = decodeURIComponent(value)
  } catch {
    // Malformed escape — keep the raw form rather than losing the visit.
  }
  value = value.trim()
  if (!value || value.length > MAX_ID_LENGTH) return null
  if (!ID_PATTERN.test(value)) return null
  return value.toLowerCase()
}

/**
 * Pull the campaign id out of a full URL, wherever the link builder put it.
 *
 * Checked in order:
 *   1. the real query string        — `/fundings?id=x#slug`  (canonical)
 *   2. a query tacked onto the hash — `/fundings#slug?id=x`
 *
 * `?` is the ONLY separator recognised inside the fragment. Treating `&` as one
 * as well would look more tolerant and would instead break a live funding card:
 * one of our own deals slugs to `bridge-to-m&a-exit`, and splitting its fragment
 * on `&` points the page at `bridge-to-m`, which matches nothing and opens no
 * card. Nobody hand-builds `#slug&id=x` anyway — you write `?` — so the
 * tolerance would have cost a real link to buy a hypothetical one.
 *
 * Returns null when there is no id, which is the overwhelmingly common case
 * (organic traffic) and must stay free of side effects.
 */
export function readCampaignId(href: string): string | null {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null
  }

  const fromQuery = normalizeCampaignId(url.searchParams.get(CAMPAIGN_ID_PARAM))
  if (fromQuery) return fromQuery

  const hash = url.hash.replace(/^#/, "")
  if (!hash) return null
  const afterQuery = hash.replace(/^[^?]*\?/, "")
  if (afterQuery === hash) return null
  return normalizeCampaignId(new URLSearchParams(afterQuery).get(CAMPAIGN_ID_PARAM))
}

/**
 * The same URL with every trace of the id removed, preserving the funding slug.
 *
 * Returns null when nothing needed removing, so the caller can skip the history
 * rewrite entirely on ordinary traffic.
 */
export function stripCampaignId(href: string): string | null {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null
  }
  let changed = false

  if (url.searchParams.has(CAMPAIGN_ID_PARAM)) {
    url.searchParams.delete(CAMPAIGN_ID_PARAM)
    changed = true
  }

  const hash = url.hash.replace(/^#/, "")
  const split = hash.match(/^([^?]*)\?(.*)$/)
  if (split) {
    const params = new URLSearchParams(split[2])
    if (params.has(CAMPAIGN_ID_PARAM)) {
      params.delete(CAMPAIGN_ID_PARAM)
      const rest = params.toString()
      // Keep the slug — it is what opens the funding card — and keep any other
      // params someone hung off the fragment, so this stays a targeted removal.
      url.hash = rest ? `${split[1]}?${rest}` : split[1]
      changed = true
    }
  }

  if (!changed) return null
  // `url.search` empties to "" on its own; `url.hash` set to "" leaves no "#".
  return `${url.pathname}${url.search}${url.hash}`
}

/**
 * The slug a fundings link points at, with any query junk trimmed off.
 *
 * `/fundings#payroll-rescue?id=x` has a *fragment* of `payroll-rescue?id=x`, so
 * anything matching on `location.hash` verbatim finds no funding and opens no
 * card. Every reader of the hash goes through here.
 *
 * Splits on `?` only — see readCampaignId for why `&` must stay part of a slug.
 */
export function hashSlug(hash: string): string {
  return hash.replace(/^#/, "").split("?")[0]
}

/** Remember the id for the rest of the visit (per tab). Best effort. */
export function rememberCampaignId(id: string): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Private mode / storage disabled — the first pageview is still attributed.
  }
}

/** The id carried by this visit, from the URL or from earlier in the session. */
export function recallCampaignId(): string | null {
  try {
    return normalizeCampaignId(window.sessionStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}
