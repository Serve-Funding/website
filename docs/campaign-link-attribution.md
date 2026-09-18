# Campaign link attribution — who opened the funding card

**The question this answers:** we send 2,000 bankers a LinkedIn message with a link to a
funding. Some open it. Today all we can see is "traffic went up". We want to see *which
banker* opened *which deal*, so that a banker who keeps reading our deals and has never
sent us one becomes a name on Cole's call list instead of an anonymous hit in Umami.

Decided on the Marketing & Lead Gen call, 17 Sep 2026 (Tim, Mike, Sarah, Kyler).

## The link

```
https://servefunding.com/fundings?id=<linkedin-id>#<funding-slug>
```

| Piece | What it is |
| --- | --- |
| `<linkedin-id>` | The recipient's LinkedIn public identifier — the bit after `/in/` in their profile URL. Both shapes work: the short one (`jimtingler`) and the long member-hash one (`steven-a-sandoval-33514650`). The `ACoAAA…` member URN works too. **The whole profile URL also works** (`?id=https://www.linkedin.com/in/jimtingler/`), trailing slash and all, so a merge field can be the raw URL column if trimming it is awkward. |
| `<funding-slug>` | The funding title, lowercased, spaces to hyphens: **Seasonal Working Capital** → `seasonal-working-capital`. This is what opens the deal card on top of the fundings grid. |

Clay already holds the LinkedIn URL for every person in the list, so the merge field is
just that URL with everything up to `/in/` trimmed off.

`?id=` is deliberately not a `utm_*` parameter. UTM tags describe a *source*; this
describes a *person*, and mixing them would mean every analytics tool in the stack
reporting a banker's name as a traffic channel.

### Either order works — on purpose

The natural thing to type is `#<slug>?id=<id>`, because the funding is the part you think
of as the page:

```
https://servefunding.com/fundings#seasonal-working-capital?id=jimtingler   ← also fine
```

That URL is legal but means something different to a browser: everything after `#` is the
fragment, so no query string is ever sent. The site reads the id out of *either* position
so a link built the intuitive way still attributes. You do not have to remember which is
which — but prefer the `?id=…#slug` form in new campaigns, because it is the one that
survives being pasted into tools that rewrite links.

### Two gotchas to know about

- **Escaping is fine.** Two funding titles contain characters a tool may percent-encode:
  **Bridge to M&A Exit** → `bridge-to-m&a-exit` and **Refinance 2 MCA's** →
  `refinance-2-mca's`. The site decodes the fragment, so `%26` and `%27` open the right
  card — and so does a fully-escaped `#slug%3Fid%3D…`. You do not have to police this.
- **Total Working Capital appears TWICE** in the fundings list, so both cards slug to
  `total-working-capital` and a link only ever opens the first (the Medical Device
  Manufacturer, FL one). The Labels Manufacturer, TX card **cannot be sent at all** until
  one of the two is retitled in `src/data/fundingData.ts`. That is a copy change, so it
  is Mike and Sarah's call, not something the build makes for them.

`npm run verify-campaign-links` checks every funding card is still reachable with an id
attached — both orderings, raw and escaped — and runs as part of `npm run build`, so a
new funding whose title breaks the link fails the deploy instead of quietly sending
bankers to the wrong page. It prints the reachable count rather than a blanket tick, so
the duplicate above is visible on every build.

## What happens when they click

1. `CampaignVisitorTracker` (mounted in the root layout) reads the id.
2. It **removes the id from the address bar** immediately, keeping the funding slug. The
   card still opens; the id is then out of any screenshot, out of the `Referer` of every
   link the visitor clicks next, and out of the URL if they forward it (where it would
   otherwise attribute the next reader to the first). It does **not** vanish from our own
   Vercel access log — in the `?id=…` form it was in the first request line before any
   script ran. That is our own infrastructure and a public identifier, but it means
   nothing belongs in this parameter that could not live in a server log.
3. It fires a `campaign_link_open` event to Umami — so the "did LinkedIn drive traffic"
   question is answerable without leaving analytics.
4. It POSTs `{ id, path, funding, referrer }` to `/api/track-visit` on our own origin.
   That route — and only that route — holds the shared secret and forwards the visit to
   the portal server-side.
5. The id is remembered for the rest of that browser tab, so if the banker then clicks
   through to `/solutions` or a blog post, those reads are attributed to the same person.

Everything from step 3 on is fire-and-forget. A visitor never sees an error, and never
learns whether we recognised them.

### How much to trust it

A LinkedIn public identifier is public, and `/api/track-visit` is an open endpoint on an
open page, so anyone determined could claim a named banker read a deal. The route caps
body size, requires the request to come from our own origin, and throttles per IP — but
those raise the cost of faking traffic, they do not make a visit proof of anything.

Treat an open as a reason to move a name up a call list. It is not evidence, it should
never be quoted back to the person it is about, and nothing should gate on it.

## The portal side

The portal resolves the id against the LinkedIn URL it already stores for every campaign
lead and shows the result under **Signals → Site visits**: who read what, how many times,
what lifecycle stage they are in, and whether they have ever referred a deal. See
`Serve-Platform` → `db/migrations/2026_09_17_site_visits.sql` and
`src/lib/site-visits/`.

## Configuration

| Variable | Where | Meaning |
| --- | --- | --- |
| `SITE_VISIT_PORTAL_URL` | website (Vercel) | `https://<portal-host>/api/webhooks/site-visit` |
| `SITE_VISIT_PORTAL_SECRET` | website (Vercel) | Shared secret, must match the portal |
| `SITE_VISIT_SECRET` | portal (Vercel) | The same value |

Until both website variables are set, `/api/track-visit` accepts the beacon and drops it.
Nothing else on the site changes, so this can merge before the portal side is live.
