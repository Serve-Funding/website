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
import { usePathname } from "next/navigation"
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
  // One report per page per visit. A banker re-opening the same funding card
  // three times in a minute is one read, not three, and the interesting number
  // is which deals get opened — not how twitchy the scroll was.
  const reported = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === "undefined") return

    const report = () => {
      const fromUrl = readCampaignId(window.location.href)
      if (fromUrl) {
        rememberCampaignId(fromUrl)
        const cleaned = stripCampaignId(window.location.href)
        if (cleaned) window.history.replaceState(window.history.state, "", cleaned)
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

      void fetch("/api/track-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The tab may be closing behind a click straight into a funding card.
        keepalive: true,
        body: JSON.stringify({
          id,
          path,
          funding: slug || null,
          referrer: document.referrer || null,
          occurredAt: new Date().toISOString(),
        }),
      }).catch(() => {
        // Attribution is never worth a console error on a visitor's machine.
      })
    }

    report()
    // On /fundings the deal a banker actually read is in the fragment, and
    // opening a second card changes only the fragment — no route change, so the
    // pathname effect never re-runs. Which cards get opened is the whole point.
    window.addEventListener("hashchange", report)
    return () => window.removeEventListener("hashchange", report)
  }, [pathname])

  return null
}
