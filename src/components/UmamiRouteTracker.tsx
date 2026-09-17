"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { stripCampaignId } from "@/lib/campaign-visitor"

// Sends a manual Umami pageview on route changes to improve SPA tracking fidelity.
export function UmamiRouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === "undefined") return
    // Never report a campaign id as part of a URL. CampaignVisitorTracker strips
    // it from the address bar, but effects run in mount order and a pageview
    // recorded a tick earlier would file the banker's identity under a page
    // path, where nothing expects to find a person. Stripping here means the
    // guarantee does not depend on which component happens to be mounted first.
    const stripped = stripCampaignId(window.location.href)
    const url = stripped ?? `${window.location.pathname}${window.location.search}`
    const umami = (window as any).umami
    if (umami?.track) {
      umami.track("pageview", { url })
    }
  }, [pathname, searchParams])

  return null
}
