"use client"

/**
 * Tells the portal which banker just opened a campaign link.
 *
 * Outreach links carry the recipient's LinkedIn identifier (`?id=…`, see
 * src/lib/campaign-visitor.ts). This component reads it on the first render of a
 * visit, posts it to our own /api/track-visit — which forwards it server-side to
 * the portal — and then removes it from the address bar. Every later page in the
 * same tab is attributed from sessionStorage, so a banker who opens a funding
 * card and then wanders to /solutions shows up as one person reading two pages.
 *
 * WHAT COUNTS AS AN OPEN — the hard part, learned the hard way.
 *
 * The first send (2026-09-18) recorded 150 "opens" against 150 messages. That is
 * not a 100% click rate, it is something fetching every link once: the visits
 * arrived every 2-3 minutes in lockstep with LGM's send cadence, 164 of 167 had
 * no referrer, and most "second visits" were 60-90 seconds after the first.
 *
 * Note what that rules out. This beacon only fires from JavaScript, so a plain
 * link-preview crawler — which reads HTML and stops — cannot produce these rows.
 * Whatever is fetching runs a real browser engine. That is either LinkedIn
 * rendering a preview card, or, since every recipient is a BANK, a mail/URL
 * security appliance doing detonation (Proofpoint, Mimecast, Defender Safe
 * Links all drive headless Chrome). Both look exactly like a visitor to us.
 *
 * So the beacon now carries two things it did not: the user agent, which names
 * the fetcher, and `engaged` — whether a human actually did something. A
 * detonation sandbox loads, screenshots, and closes; it does not move a pointer,
 * scroll, or press a key. The send is held until the first such signal, or a
 * short timeout, whichever comes first, and reports which one it was.
 *
 * Every hit is still recorded. `engaged` is a FLAG, not a filter — the bot
 * traffic is itself the evidence of what is happening, and throwing it away
 * would leave us unable to tell "nobody clicked" from "we stopped counting".
 *
 * Deliberately silent and non-blocking: no id means no request at all, and a
 * failed request is swallowed. Nothing a visitor sees depends on this working.
 *
 * WHY THE URL IS REWRITTEN. The id is an identifier for a named person. Leaving
 * it in `location.href` would send it onward in the Referer header of every
 * outbound click, put it in any screenshot, and make the link mis-attribute the
 * next person if it were forwarded. Stripping it costs nothing — the funding
 * slug in the fragment is preserved, so the card still opens — and `/fundings`
 * reads its slug through `hashSlug()`, which tolerates either order regardless
 * of whether this component has run yet.
 */

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  hashSlug,
  readCampaignId,
  recallCampaignId,
  rememberCampaignId,
  stripCampaignId,
} from "@/lib/campaign-visitor"
import { trackEvent } from "@/lib/tracking"

export function CampaignVisitorTracker() {
  const pathname = usePathname()
  const router = useRouter()
  // One report per page per visit. A banker re-opening the same funding card
  // three times in a minute is one read, not three, and the interesting number
  // is which deals get opened — not how twitchy the scroll was.
  const reported = useRef<Set<string>>(new Set())
  /** Teardown for each open engagement watcher, drained when the route changes. */
  const pending = useRef<(() => void)[]>([])


  useEffect(() => {
    if (typeof window === "undefined") return

    const report = () => {
      const fromUrl = readCampaignId(window.location.href)
      if (fromUrl) {
        rememberCampaignId(fromUrl)
        const cleaned = stripCampaignId(window.location.href)
        if (cleaned) {
          const searchChanged = new URL(cleaned, window.location.origin).search !== window.location.search
          if (searchChanged) {
            // The canonical `?id=…` form goes through the router, not
            // history.replaceState. On first load Next commits its own canonical
            // URL — which still carries the query — over anything written to
            // history directly, so a direct rewrite here was undone a tick later
            // and the id sat in the address bar for the whole visit (seen on
            // Next 16.1). router.replace makes the cleaned URL the canonical one.
            // Same pathname, so the page keeps its state and the open card.
            router.replace(cleaned, { scroll: false })
          } else {
            // Only the fragment changed. No router involvement: a hash-only
            // rewrite is not undone at hydration, and going through the router
            // would re-fire every search-param effect on the page for nothing.
            window.history.replaceState(window.history.state, "", cleaned)
          }
        }
      }

      const id = fromUrl ?? recallCampaignId()
      if (!id) return

      const path = window.location.pathname
      const slug = hashSlug(window.location.hash)
      const key = slug ? `${path}#${slug}` : path
      if (reported.current.has(key)) return
      reported.current.add(key)

      // Umami sees the same open, so the marketing side of the question ("did
      // the LinkedIn campaign drive traffic at all") is answerable without the
      // portal.
      trackEvent("campaign_link_open", { path, ...(slug && { funding: slug }) })

      const openedAt = new Date().toISOString()
      const send = (engaged: boolean, reason: string) =>
        fetch("/api/track-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // The tab may be closing behind a click straight into a funding card.
          keepalive: true,
          body: JSON.stringify({
            id,
            path,
            funding: slug || null,
            referrer: document.referrer || null,
            occurredAt: openedAt,
            engaged,
            // Why we called it: `interaction` (a human did something),
            // `timeout` (nobody did, within the window), `hidden` (the page went
            // away first — what a detonation sandbox looks like).
            engagementReason: reason,
            userAgent: navigator.userAgent,
          }),
        })
      // Exactly one send per page view, whichever trigger gets there first.
      let sent = false
      const fire = (engaged: boolean, reason: string) => {
        if (sent) return
        sent = true
        cleanup()
        void send(engaged, reason)
          .then((res) => {
            // Only a delivered beacon counts as reported. /api/track-visit
            // answers 502 when the portal did not take the visit, so the key is
            // released and the next hashchange or route change tries again — a
            // portal blip must not erase the record that this open happened.
            if (!res.ok) reported.current.delete(key)
          })
          .catch(() => {
            // Attribution is never worth a console error on a visitor's machine.
            reported.current.delete(key)
          })
      }

      /**
       * Signals a headless fetcher does not produce. Pointer MOVEMENT rather
       * than a click, because the interesting case is a banker who reads the
       * card and leaves without clicking anything — that is still a read.
       * `scroll` is listed for the same reason.
       */
      const HUMAN = ["pointermove", "pointerdown", "keydown", "touchstart", "scroll", "wheel"]
      const onHuman = () => fire(true, "interaction")
      const onHidden = () => {
        // The page is going away. Send what we have rather than lose the visit,
        // and say so — "hidden" before any interaction is the signature of a
        // load-screenshot-close sandbox.
        if (document.visibilityState === "hidden") fire(false, "hidden")
      }

      /**
       * How long to wait for a human before giving up and reporting the visit
       * as unengaged. Long enough that a real reader has moved or scrolled —
       * measured on the live data, the machine traffic never does — and short
       * enough that an open we never hear about again is rare.
       */
      const ENGAGEMENT_WINDOW_MS = 2500
      const timer = window.setTimeout(() => fire(false, "timeout"), ENGAGEMENT_WINDOW_MS)

      function cleanup() {
        window.clearTimeout(timer)
        for (const type of HUMAN) window.removeEventListener(type, onHuman)
        document.removeEventListener("visibilitychange", onHidden)
        window.removeEventListener("pagehide", onHidden)
      }

      for (const type of HUMAN) {
        window.addEventListener(type, onHuman, { once: true, passive: true })
      }
      document.addEventListener("visibilitychange", onHidden)
      window.addEventListener("pagehide", onHidden)
      pending.current.push(cleanup)
    }

    report()
    // On /fundings the deal a banker actually read is in the fragment, and
    // opening a second card changes only the fragment — no route change, so the
    // pathname effect never re-runs. Which cards get opened is the whole point.
    window.addEventListener("hashchange", report)
    return () => {
      window.removeEventListener("hashchange", report)
      // Every in-flight engagement watcher, not just the last one: a visitor can
      // open two funding cards inside one route, and an un-removed pointermove
      // listener would fire against a page that has already gone.
      for (const undo of pending.current.splice(0)) undo()
    }
  }, [pathname, router])

  return null
}
