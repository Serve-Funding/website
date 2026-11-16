# 4. How Mike talks on calls, and what the site and portal should sound like

Source: `/tmp/audit/mike_calls.json` (900 lines, Jan to Nov 2026). Compared with `/tmp/audit/brain/team/Michael Kodinsky Voice Profile.md`, the site copy in `/tmp/audit/website/src`, `/tmp/audit/website/posts`, and the site's own internal notes in `/tmp/audit/website/docs`.

References like "L443" are the 0-based line number in `mike_calls.json`, so anyone can check a quote. No client names, companies or client amounts are used. Quotes are short and are Mike's own.

**Read this first (limits of the data)**
- About 1 line in 10 is not business: Bible study, church, travel, family chatter. I ignored those.
- A few lines are clearly not Mike (a client describing their own plans, e.g. L38; someone talking about languages, L14). I only used lines that sound like Mike explaining Serve or a product.
- These lines are his longer turns. Short questions and replies are not in the file, so how he qualifies is under-represented.
- The site is already close to Mike in many ways. `docs/mike-voice-patterns.md` in the site repo was built from 12 earlier calls, and the site already carries the origin story, "channel-neutral, product-neutral", "under-promise and over-deliver", the MCA "drug" line, the factoring "recurring sale of an asset" line and the "1 in 15 referrals" story (`src/app/bankers/page.tsx`, `src/data/industries.ts`, `src/data/solutions.tsx`). I do not list those as gaps.

---

## (a) Explanations and analogies he reuses

How he explains almost any product: one plain sentence on what it is, then a picture, then who it suits, then a cost as a range with a caveat, then what the lender will want, then timing. He gives ranges and "rule of thumb", never a single promise.

| What he is explaining | The picture or move (paraphrase) | A short phrase of his | On the site? |
|---|---|---|---|
| What Serve is | A broker is like a realtor or an insurance agent: you hire one person who works with many carriers. | "insurance brokers work with different carriers" (L704) | Not as an analogy. Site says "a broker, in the best sense of the word" (`src/app/advisors/page.tsx:131`) |
| Why he is generalist | He used to work inside one lender's box, watched referrals die, and hated it. | "I hated getting referrals and then not being able to help them" (L306); "generalists by design" (L720) | Yes, in the origin story |
| Invoice financing | Three parties: you, your customer, the funder, like a triangle. | "almost like a triangle" (L217) | Not found |
| Factoring | Not debt. You sell an asset again and again. | "a recurring sale of an asset" (L753) | Yes (`src/data/glossary.ts`, `faq-data.ts`) |
| A revolving line | It refills as you pay it down. | "it fills up again and you can borrow down again as you need to" (L272) | Yes ("water in a cup", `src/data/industries.ts`) |
| Where a deal sits | A spectrum: clean bankable deals at one end, hard ones at the other, and a grey middle where he works. | "your cleanest bankable deals" ... "all the hairy hard stuff" (L186) | Not found |
| How lenders think | They start from the risk, then work backwards to get comfortable. | "they all start with, what's the risk" (L143); "work backwards from that to try to overcome that fear" | Not found. See idea 4 below |
| Banks vs non-bank | Banks are fine for clean, steady businesses. A growing company often outruns them, and that is not a knock on the owner. | "banks are not the best solution for that" (L112); "isn't a knock on those businesses" (L645) | Partly (bankers page) |
| Small banks | He credits community banks that surprise him, so he is not anti-bank. | "smaller banks can really do some amazing stuff" (L691); "We work with banks too" (L659) | Not found |
| Consolidating a stack of cash advances | Take everything out in one step to free up breathing room, then add a second step later once they trust you. | "immediately create breathing room" (L407) | Partly (consolidation posts) |
| Several entities | Several smaller facilities can beat one big one. | "a series of smaller credit facilities" (L208) | Yes (`posts/layered-capital-explained.mdoc`) |
| Real estate | It is the cheapest money if you have equity. | "your absolute lowest cost of capital" (L271) | Yes (`posts/when-real-estate-is-cheapest-capital.mdoc`) |
| Sizing | A quick rule of thumb, always flagged as a rule. | "rule of thumb" (L198, L565, L836) | Yes (10-15% of revenue in `faq-data.ts:298`) |
| Speed vs quality | Fast groups are often costly. The good ones take longer. | "pretty ugly and expensive" (L534) | Yes (`posts/speed-cost-quality-funding-tradeoff.mdoc`) |
| Stating his own limits | A caveat before any number. | "not being a lawyer, right, always that caveat" (L286); "I want to be careful not to start telling you, you can qualify for this or that" (L223) | Not as a pattern |
| Setting expectations | Never over-sell. | "under-promise, over-deliver" (L332); "I want to always set your expectations realistically" (L740); "I don't want to get your hopes up" (L37) | Yes, partly |

Stories he reuses: the origin story (he looked back and they closed about 1 in 15), his father's business as an immigrant entrepreneur, his wife is his partner and two sons work in the business, and one long deal that took many months and then repeated a year later. Only the first two are on the site.

---

## (b) Six ideas he repeats that the website does not say, or says differently

Check each against his dates. Fee points are flagged because the site rules say fee figures were removed on purpose.

### 1. The one ask is exclusivity, and he explains why in plain words
He says it on about 13 of the 900 lines. Pieces: a client engagement agreement; the client lists lenders they are already talking to and those are left out; "you can fire us at any time"; and the reason, which is that he only gets paid if he succeeds.
- "the only way we make a living is if we can succeed" (L583)
- "you can fire us at any time" (L596)
- "list out who you're already talking to" (L666)
- He also says it dilutes the odds of a result if the client shops the same deal in parallel (L50).
- **Site:** no public page mentions exclusivity or an engagement agreement (search of `src/` and `posts/` finds only the terms page and unrelated uses). The internal file `docs/objections-and-responses.md` (section 18, around lines 335-344) has the pitch, but that is not published. The chatbot prompt `src/lib/ai.ts` never mentions it.
- **Why it matters:** the owner meets it for the first time in a PDF. The site should say it early, in his tone: one ask, a carve-out, and you can leave.

### 2. No commitment until we show you a path (staged trust)
Order in his calls: docs, then a quick check with lenders, then soft quotes, then whether the owner likes the path, and only then the agreement.
- "we're not asking you to commit to anything until we've shown you" (L359 and L265, May 2026)
- "run it by our lenders, give you some soft quotes" (L609)
- **Site:** `src/app/discover/page.tsx` says what happens next is the client's call, which is close, but it does not describe the steps. The portal could show these steps as a short checklist.

### 3. The fee follows the facility, so he tells you not to borrow more than you need
He says his fee is based on the facility amount, so he will not size it up, and that you can take less than you qualify for.
- "we also don't want to set up a bigger facility than you need right now because our fee is based on the facility amount" (L863, Oct 2026)
- "You can always take less than what they, they qualify for" (L362)
- He says that a person wired differently could push a bigger line to earn more, and he does not (L696).
- He also frames success as: all-in cost, even with Serve's fee, should beat what is on the table (L812, L228).
- **Site:** not said. `src/data/faq-data.ts:164` instead claims cost falls "10-20 percentage points". Mike never says a number like that on calls. He says "we hope to be able to save you more than that" (L228, said about his fee). His style is a range with a caveat. I mark the site claim as a risk, since I could not find support for it in these 900 lines.
- **Fee wording is not settled (unsure):** Jan 2026 calls (L539, L551, L606) describe a small upfront due-diligence fee, about a quarter of a percentage point of the facility, credited against the success fee. Calls from Aug to Sep 2026 (L401, L895, L489) say "we work for free" and the success fee is paid after. `src/lib/ai.ts:138` tells the chatbot "NO due-diligence fee" and `docs/objections-and-responses.md:323-410` still describes a negotiated DD fee. Mike should confirm what is true now before any page says either. I do not suggest publishing any figure.

### 4. Lenders think in risk. Our job is an honest but strategic story. Tell us the bad news first.
He tells owners what is going on in the lender's head and asks them to say the awkward thing early so he can handle it.
- "they all start with, what's the risk" (L143)
- "Honest, real, but strategic" (L164)
- "tell the best story we can" (L280); "put it out there right away" (L345)
- "the more transparent and whole the information you provide me, the better we can serve you" (L177)
- **Site:** the bankers page speaks of "organizing the financial story" but never tells an owner why to disclose a weakness early or what a lender fears. A short "what lenders worry about, and how we handle it" line would sound like him. It also helps the portal (see section c).

### 5. How to tell a good broker from a bad one, said out loud
He gives the owner a test.
- If a site lists more than two or three kinds of funding, that person is not a direct lender (L801); anyone who does AR, ABL, leasing and SBA is "never a direct lender" (L122).
- Some brokers add their own fee on top of what the lender pays them (L200, L617), add points, or ask for money up front with no result (L761).
- "God knows who they're sending you to" (L798).
- **Site:** the chatbot prompt has a line about predatory players adding points (`src/lib/ai.ts`, and `docs/mike-voice-patterns.md`), and `posts/how-to-choose-working-capital-lender.mdoc` has a fee checklist. I did not find a public page that gives the "how to spot a broker who is not on your side" test in his words. It also fits next to idea 1: we do the opposite and say so.
- Careful: describe this as a pattern, name no firm.

### 6. He turns work down early, and gives the reason in plain words
- "we don't usually work on deals this small" (L709); "I just don't think we're going to be of any value to you" (L573); "I'm going to advise us to slow roll it" (L521).
- He names the reason (no receivables or assets, already heavily leveraged so it is effectively unsecured, a new owner with no history, no real revenue yet) and tells them what to try next.
- He also says why he asks for a lot of detail: so he does not spin his wheels and so he can see who has been out shopping and getting no's everywhere (L515).
- **Site:** `src/types/solutions.ts:33` has an "honest deflection" slot per solution, and the earlier research (`quotes-findings.md`) shows clients thank him for candor. What the site lacks is the same candor at the front door, before the form: who we are not a fit for (too small, no assets or revenue, already stacked and shopped everywhere), said the way he says it.

Smaller gaps worth a line each: he says he is "faith-driven" (L191, Aug 2026) and "our business is not our own, God gave it to us to serve others"; the site carries "servant leadership" and "Here to Serve" (`src/app/about-us/page.tsx:154,206`) but no faith wording. That is Mike's choice to make. He also names who the client will hear from (his wife and partner, a son) and the channel (a portal link, a data room), which the site only partly does (`advisors/page.tsx:184`, `bankers/page.tsx:98`).

---

## (c) Additions to the voice profile

The current profile is built from about 30 emails in a single week (Mar 27 to Apr 1, 2026). It describes a written, formal, warm-authoritative voice and ends with banker messaging. It has no spoken section. Suggested additions:

**1. A new section: "Spoken voice (calls, Jan to Nov 2026)"**
- He talks to owners the way he explains to a friend: long, story-like sentences, then a check-in. Frequent fillers and markers in 900 lines: "you know" (268), "I mean" (63), "obviously" (46), "look," (20), "if you will" (7), "so again" (7), "simply put" (3), "frankly" (3), "I kid you not" (2), "candidly".
- Do not copy the fillers into copy. Keep the markers that carry meaning: "simply put", "to be clear", "if you will", "look,".
- Two rhythms: short and plain when qualifying, story mode when explaining a product or building trust (matches `docs/mike-voice-patterns.md` section 10).
- Check-ins after explaining: "Does that sound good?" (L265). Restates what he heard before moving on ("what I'm hearing is ..."): 8 times.

**2. How he explains a product** (a recipe)
1. One plain sentence on what it is.
2. A picture or comparison.
3. Who it suits and who it does not.
4. Cost as a range ("somewhere in the teens", "high single to low, low teens"), with "typically", "usually", "rule of thumb".
5. What the lender will ask for.
6. Timing, under-promised.
- Always a caveat before a number: "not a lawyer", "I don't want to give any straight answers right now" (L580), "I want to be careful not to start telling you, you can qualify for this or that" (L223).

**3. Trust moves to name**
- Says what he will not do: will not promise, will not oversize, will not work against another broker.
- Admits ignorance: "I don't work with restaurants regularly" (L142); "I don't know" appears 22 times.
- Announces candor before bad news ("I'll be very transparent and explain why", L490).
- Offers the exit: "you can fire us at any time"; "it's your call, of course" (L173).
- Credits the banker or referrer: "We try to spotlight on the banker in the eyes of the client" (L292).

**4. Vocabulary: what he really says**
- He says **broker** (11 lines) as often as **advisory/advisor** (9). He says "brokers for all things business financing" (L202) and then "we're not a direct lender". The site tends to say "advisory" first. Both are his; plain "broker" comes first on calls.
- Heavy on: **non-bank** (10), **credit box** (6), **term sheet** (5), **data room** (9), **facility**, **collateral** (11), **personal guarantee**, **private credit** (3).
- Phrases in the profile that never showed up in 900 spoken lines: "sweet spot", "go to market", "tear sheet", "full speed ahead", "howdy", "out of the box", "touch base". They are email phrases. Do not push them into site or portal copy meant to sound like his speech.
- "leverage" is used in the lender sense only ("create some leverage", L851), which fits the profile's rule.
- "Here to serve" is hardly ever said as a sign-off on a call. When he says it, he explains it: a "biblical nod to a servant leader approach" (L47). The site is right to use it as a line, but pair it with that explanation.

**5. Words for the portal**
He talks about the portal the way he talks about everything: honest that it is new, and kind about the owner's time.
- "it's such a work in progress" (L697); "if there is a bug or two" (L334); "just let us know" (L457).
- "it auto-saves" (L342); "skip them" for things you cannot answer (L869); approximations are fine, "ballpark it" (L531).
- "a magic link that you can log in" (L541); "simple folders broken out by category" (L713); attachments by email are fine (L545).
- Lists "who you're already talking to" inside the agreement (L666).
- Suggested portal lines in his voice: "Skip anything you can't answer. We'll ask again later." / "A rough number is fine." / "Anything you'd rather we hear from you first, put it here."
- Avoid: "streamline", "seamless", anything with a number or percentage he does not use.

**6. Two cautions to add to the profile**
- Fees: he states Serve's terms on calls. The site rule (no figures on public pages) stays. The profile should say: talk about how we are paid, never the numbers, on public pages.
- Do not quote "10-20 points cheaper"-style claims as Mike's. They are not in his speech.

---

**Files:** `/tmp/audit/out/4-voice-calls.md`
