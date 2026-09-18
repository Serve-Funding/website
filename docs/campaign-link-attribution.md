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

**Nothing new to set.** The beacon reuses the lead handoff's variables from August 2026:
`PORTAL_INBOUND_SECRET` is the shared secret, and the target is `PORTAL_INBOUND_URL`'s
origin with the path swapped to `/api/webhooks/site-visit`. The portal side accepts the same
value under `INBOUND_LEAD_SECRET` / `PORTAL_INBOUND_SECRET`. Any project that already hands
leads to the portal (the production `website` and `serve-platform` projects) forwards visits
as soon as the code is deployed.

Optional overrides, for a deployment that wants the two writers on separate keys:

| Variable | Where | Meaning |
| --- | --- | --- |
| `SITE_VISIT_PORTAL_URL` | website (Vercel) | `https://<portal-host>/api/webhooks/site-visit` |
| `SITE_VISIT_PORTAL_SECRET` | website (Vercel) | Shared secret, must match the portal |
| `SITE_VISIT_SECRET` | portal (Vercel) | The same value |

With neither pair set, `/api/track-visit` accepts the beacon and drops it. The dev projects
(`website-cuky`, `portal_testing`) carry no `PORTAL_INBOUND_*` today, so the dev preview
stays dark until one pair is added there.

## Building the link in La Growth Machine

The campaigns run in Michael's LGM account. Steps and message copy are **UI-only** — LGM's
API is `GET,HEAD` on `/campaigns/{id}/messages` and `/campaigns/{id}/steps`, so nobody can
script the copy in; it has to be typed in the app. What follows is what to type.

### The merge field: use the LinkedIn URL you already have

Every LGM lead already carries a `linkedinUrl` — checked against the live audience
"Bankers connected on LI" (1,927 leads), e.g.
`https://www.linkedin.com/in/anthony-banks-mba-5ba40011`.

**You do not have to trim it to a slug.** The site reduces a whole LinkedIn profile URL to
the identifier itself, so the raw merge value works as-is:

```
https://servefunding.com/fundings?id={{linkedinUrl}}#bridge-to-m&a-exit
```

Verified against production on 2026-09-18 with a real value: the URL collapses to
`anthony-banks-mba-5ba40011`, the right funding card opens, and the visit lands in the
portal. A non-LinkedIn URL is rejected rather than guessed, so a mis-mapped field shows up
as an unrecognised id instead of being credited to the wrong person.

**One thing to check in the editor:** whether `{{linkedinUrl}}` is offered in the variable
list. LGM documents ~24 lead variables and names `{{firstname}}`, `{{companyName}}`,
`{{proEmail}}`, `{{persoEmail}}` — all of which are lead fields under their API names, which
is why `linkedinUrl` probably is one too. It is not confirmed in writing. Open the variable
dropdown; if it is there, you are done.

### If `{{linkedinUrl}}` is not in the list

Use a custom attribute. LGM leads have 20 of them and **all 20 are empty today**, so
`customAttribute1` is free. LGM syncs custom attributes from HubSpot, and the audiences are
already HubSpot-sourced, so this is a mapping change rather than a data project:

1. Map HubSpot `hs_linkedin_url` → `customAttribute1` in the LGM ↔ HubSpot field mapping.
   **5,111 contacts already have `hs_linkedin_url` populated.**
2. Use `?id={{customAttribute1}}` instead. It holds the same full URL, which the site
   reduces the same way.

Do **not** re-import the audience as a CSV to get the attribute in — that creates a new
CLASSIC audience and loses the HubSpot linkage the current one has.

### Which funding to link

Any card on `/fundings`, by its title lowercased with spaces hyphenated. The full list is in
`src/data/fundingData.ts`; `npm run verify-campaign-links` proves every one of them is
reachable with an id attached.

For a **banker** audience, `bridge-to-m&a-exit` is the strongest of the current 22: the story
is a private banker referring the client to a colleague on the commercial team, who had a
nine-year relationship with Serve Funding. It is the campaign's own thesis told back to the
reader. That is a recommendation, not a decision — the copy is Mike and Sarah's.

Two cards cannot be sent as they stand:

- **Total Working Capital** appears twice, so only the Medical Device Manufacturer one opens.
  Retitle one to free the other (the `fundingType` on each row already distinguishes them:
  "Working Capital + AR Line" vs "Working Capital + SBA").

### The message

The last line changes from the June wording per the 17 Sep call — Michael: *"deal is better
than story"*; Sarah's edit: *read more about this deal*. The June message, which is the last
one that actually ran, for shape:

> Hi {{firstname}},
>
> I'm sharing our June banker newsletter with you called CREATIVE WORKING CAPITAL. Would love
> to hear your feedback if you'd like to offer any, including what type of content would be
> helpful to you in the future!
>
> https://servefunding-23433903.hs-sites.com/800k-in-working-capital-for-heavily-cyclical-business

Two changes: the link points at the funding card instead of the HubSpot page, and it carries
the id. Michael's own line on the call — *"I don't want anything ever going out that's like,
hey, this month's blog"* — so lead with the deal, not the newsletter.

### The campaign shell

`Banker CWC Newsletter — Sep 2026` (`6aa8f97bc0b4c28955b9ab4d`) is **empty**: no steps, no
messages, and only the `LGM` channel, so it has no LinkedIn action to attach copy to.
`Sharing Newsletter w/ Bankers on LI June '26` (`6a2a1a53f8eca00bce4c9862`) is the last one
that ran — one `LINKEDIN_DIRECT_MESSAGE` step with a working message. Duplicating that in the
UI and swapping the copy and audience is fewer clicks than building the shell up.

### Prove it before the send

1. Put the finished link in a LinkedIn message to yourself, or just paste it into a browser.
2. Open **Signals → Site visits** in the portal.
3. You should see one row, on the *Warm — never referred* slice, with your name, the deal you
   linked, and "today".

If the row shows under **Unrecognised ids** with a raw value instead, the merge field did not
resolve — the raw value on that row is exactly what LGM sent, which is what tells you which
variable to fix. That slice existing is the point: a whole send attributing to nobody would
otherwise look identical to nobody clicking.
