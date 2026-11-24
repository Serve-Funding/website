# October campaign — plan

Written 2026-09-21, after the September send. Read
[campaign-link-attribution.md](campaign-link-attribution.md) first; this is what changes
next time and why.

## Where September actually landed

| | |
| --- | --- |
| Audience | 1,927 |
| Messages sent so far | 273, pacing ~150/day, ~11 days left |
| Raw fetches recorded | 288 |
| **Human reads** | **6** |
| Replies | 8 |
| Visitors resolved to a name | 264 of 269 (98%) |

**The headline number was wrong for three days and that is the most important lesson here.**
We reported a 98% open rate. It was a link scanner fetching every URL once. Three signals
gave it away: visits arriving every 2-3 minutes in lockstep with LGM's send pacing (16 of
them on a Sunday afternoon), 164 of 167 with no referrer, and five of nine "repeat
visitors" 60-90 seconds apart.

The beacon only fires from JavaScript, so this was never a simple preview crawler — it is
something driving a real browser engine. The user agents confirm it and also confirm that
**user-agent filtering would not have worked**: the same `Chrome/142.0.7444.175 Win64`
string appears on both a scanner fetch and a genuine human read. One fetcher reported
Windows NT 6.1 — Windows 7 — running Chrome 140, which nobody does; that is a sandbox
image, consistent with a bank's URL-detonation appliance.

What works is the engagement signal, now live: hold the beacon until a pointer moves, the
page scrolls or a key is pressed, or 2.5s elapses. Measured since it shipped: **12 timeouts,
3 interactions.** Roughly four in five fetches are machines.

**Rule for October: never quote an open rate off `visit_count`. Use `human_visit_count`.**

## The change: opaque tokens instead of LinkedIn identifiers

Today the link carries the banker's own LinkedIn identifier
(`?id=peggy-pound-2a336b126`). October should carry a token we mint
(`?id=k3f9ax`).

### Why

1. **It deletes an entire bug class.** Everything expensive in September came from using
   LinkedIn's identifier as the join key: the `ACoAA…` vs vanity split (571 contacts
   backfilled), 11 non-ASCII slugs, two people permanently lost to charset mangling, 13
   profile renames. A token we mint is unambiguous by construction.
2. **The link stops carrying a person's name.** Tim's "in case it's sus" instinct. The id
   is stripped from the address bar on load either way, but `?id=k3f9ax` is not legible in
   the first place.
3. **Campaign attribution for free.** The token knows which send it came from, so "Peggy
   read the September newsletter" stops being inferred from timestamps.

### Why it is NOT urgent

Matching is at 98%. Of the five unresolved visitors, only three would have been saved by a
token — the other two are our own test clicks. **This is a ~1% matching improvement.** The
value is in the bugs it prevents, not the ones it fixes.

### What it does NOT fix

**The scanners.** A detonation sandbox fetches whatever URL it is handed. Opaque or not.
That problem is solved, and it is solved by the engagement signal.

It also does **not** fix a broken merge field: the token still arrives via
`{{customAttribute1}}`, so a mis-wired campaign still sends a literal `{{...}}`. That
failure is visible under Unrecognised ids, which is how we caught it in September.

### Design

`campaign_link_tokens` in the portal:

| column | |
| --- | --- |
| `token` | short, random, case-insensitive, no ambiguous characters (no `0`/`O`, `1`/`l`). 8 chars of Crockford base32 is ~40 bits — far more than enough for a few thousand per send, and short enough to read aloud |
| `organization_id` | |
| `contact_id` / `person_key` | who it was minted for |
| `campaign` | which send |
| `funding_slug` | what we pointed them at |
| `minted_at`, `first_used_at`, `use_count` | |

- **Minting** moves into `scraping/make_campaign_links.py` — it already resolves each lead
  to a person, so it mints a token instead of looking up an identifier, and writes the
  table.
- **Resolution** becomes a direct lookup instead of a fuzzy key match. Keep the existing
  `linkedin_key` path as a fallback so September's links keep resolving; they will be in
  people's inboxes for months.
- **Enumeration** is not a real risk — the endpoint answers 204 to everything and tells a
  caller nothing — but mint random, not sequential.

### What we lose

**Debuggability.** `matt-clemens-cfa�-a222a242` told me instantly what had broken. An
unresolved token tells you nothing without a lookup. Mitigate by keeping the raw
`visitor_id` on the visit (already the case) and showing the mint record in the
Unrecognised ids slice.

## Everything else outstanding, ranked

### Before the October send

1. **Retitle one `Total Working Capital` card.** Two cards share the slug
   `total-working-capital`, so one of them cannot be linked at all. Copy change — Mike and
   Sarah's call. The build prints `22 of 23 reachable` until it is fixed.
2. **Decide the suppression rule.** Dave Groves replied "No thanks". One field
   (`contacts.do_not_call`) and the warm list already respects it. Worth agreeing the
   general rule: any "no thanks" reply → suppress.
3. **Clear the `{{linkedinurl}}` test rows.** 9 visits from the merge-field test still sit
   at the top of Unrecognised ids. Now that real unmatched ids matter, they are noise.

### Worth doing, not blocking

4. **Filter the call queue by "read a deal."** The surface that turns this into Cole's
   morning. Deliberately deferred: it reorders the ladder in `call-queue/priority.ts`,
   which decides how a rep spends their day, and we have six reads to go on. Revisit once
   a fortnight of `engaged` data exists.
5. **Sync `hs_linkedin_url` from HubSpot.** HubSpot holds a LinkedIn URL for 5,111
   contacts; the portal's `contacts` table has 2,040. Proven on five named bankers. The
   portal's HubSpot client already has contacts-read scope, so it is a small add.
6. **The dev database is behind.** Both September migrations were applied to prod only —
   the runner said so each time and there are no dev credentials in any worktree. Every
   Conductor worktree's `.env.local` points at **prod**.
7. **Two unrelated migrations were never applied to prod**:
   `2026_09_10_application_owners_drop.sql` and
   `2026_09_10_deal_application_twins_drop.sql`. Not ours, and `_drop` migrations want a
   human. Someone should check whether the code depending on them is already live.
8. **Supabase's advisor has opened PRs against `site_visits`** (portal #1388,
   `auth_rls_initplan`). Worth taking — the policy re-evaluates `auth.uid()` per row.

## Sequencing — the rule that bit us twice

**Apply the migration FIRST, then merge.**

On 2026-09-21 website#106 and portal#1394 merged a minute apart with the migration
unapplied. The portal 500'd on an unknown column, `/api/track-visit` turned that into a
502, and the beacon swallowed it by design. **Twelve minutes of traffic gone**, and nothing
alerted — it surfaced only because a preview click happened to be watched.

The repo's "Migrations applied to both databases" CI check is push-only, so it reports the
problem *after* the merge has caused it. It is a smoke alarm, not a lock.

For any change spanning the two repos:

1. Apply the migration to prod (`./scripts/db.sh prod migrate …`) **and** to dev.
2. Merge the portal PR.
3. Merge the website PR.
4. Click one link and confirm a row lands with the new fields.

## Timeline

| When | What |
| --- | --- |
| Now → campaign ends (~11 days) | Let September finish on the current links. Watch `human_visit_count`, not `visit_count` |
| While it runs | Items 1-3 above; #1396 (contact timeline) merged and verified |
| ~1 week before October | Build tokens: portal table + mint in the generator + resolution with fallback |
| Day before | Apply migration, merge both, click-test one link |
| October send | Mint tokens, regenerate the CSV, import to LGM, map to Custom attribute 1 |

## What to measure next time

Report **reads and replies**, never fetches. September's honest scoreboard, at 273 sent:

```
6 reads  ·  8 replies  ·  1 in ~45 messaged has genuinely read the deal
```

That is a real, modest, believable result. The 98% was never real.
