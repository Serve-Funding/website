---
name: create-blog-post
description: Create a new Serve Funding blog post (Markdoc .mdoc file in /posts/, with matching cover image in /public/blog/). Use when the user asks to draft, create, add, or publish a blog post. Handles frontmatter, renderer constraints, cover image generation via the n8n webhook, WebP conversion, and the dev → PR → main git workflow.
---

# Create a Serve Funding blog post

A blog post on this site is a single `.mdoc` file in `/posts/` plus a cover image in `/public/blog/`. The file-based router at `src/app/blog/[blog-id]/page.tsx` picks up the slug automatically — no route code to write.

## Prerequisites (install once per machine)

- **Node 20+** and the repo's deps installed: `npm install` in the repo root.
- **`cwebp`** for PNG → WebP conversion. On macOS: `brew install webp`. On Ubuntu: `sudo apt install webp`.
- **`gh`** (GitHub CLI) authenticated against the `ServeFunding/website` repo: `gh auth login`.
- **Clone is clean** and you branch from an up-to-date `dev`: `git fetch origin && git switch -c content/{slug} origin/dev`.

If any of these are missing the skill's commands will fail partway through. Verify before starting, not after.

## Ground rules (do not skip)

1. **Use Mike's voice. It's the single biggest lever for both AI citation and reader trust.** The `docs/` folder (gitignored, local-only) contains ~1,200 lines of verbatim Michael Kodinsky quotes from real discovery calls — signature analogies (triangle, lockbox, water-in-a-cup, drug, basement-to-ladder, band-aid), repeated phrases ("here to serve," "channel-neutral product-neutral," "under-promise and over-deliver"), and his actual product explanations. **Every new post must mine this corpus first and embed at least 2–3 named direct quotes from Mike.** Paraphrasing his analogies is the lazy version of using them. See Step 0 and the Voice Cheat Sheet appendix.
2. **Never put customer info from `docs/` into published output.** `docs/` is committed to the repo as internal AI tooling, but the transcripts contain real prospect names (Lewis Farsedakis, Lawson Aschenbach, Frank Tonuzi, Lwany Sarabia, Lynn Chipperfield, Carlos/Rosa Rodriguez, Joel Hamann, Daryl Wakefield, Schuyler Rooke, Eli Angote, Stephen Deason, Chuck Wahr) who shared their situations expecting confidentiality. Lift Mike's *own* words freely. For deal-specific examples, prefer `src/data/fundingData.ts` — the public case-study source. Anything tied to an identifiable prospect that isn't already in `fundingData.ts` must be anonymized or dropped. See memory: `feedback_no_customer_info_in_public_content`.
3. **Workflow is feature branch → PR → `dev`, then a `dev` → `main` release PR.** Never push directly to `main` or `dev`. Branch from `origin/dev`, commit there, open a PR into `dev`. (If you see a lone commit on `main` from someone who skipped this, flag it — Kyler did this once and it desynced `dev`.)
2. **`npm run build` runs `scripts/verify-seo.ts` FIRST.** If frontmatter fails length rules, the build dies before Next.js even starts — which means **Vercel deploys fail silently** and the post never reaches production. Hard limits:
   - **Title ≤ 54 chars.** The template appends ` | Serve Funding` (16 chars) for a 70-char OG-title budget. Count carefully.
   - **Excerpt 120–160 chars.** This doubles as the meta description.
   - **Subtitle** has no hard limit but keep it under ~100 chars for mobile.
   - Run `npx tsx scripts/verify-seo.ts` locally before committing. It prints exact char counts on failure.
3. **Markdoc constraints — silent rendering failures if violated:**
   - Never use `---` (horizontal rules) in the body. Only in the frontmatter delimiters at the very top. Renders as `<hr>` → React hydration error → 500 in prod.
   - Never use checkbox syntax (`- [ ]` / `- [x]`). Markdoc ignores it and prints literal `[ ]`. Use plain bullets.
   - Only use standard markdown + the two supported custom tags (`callout`, `relatedPosts`). Anything else may render blank.
4. **Cover images must be `.webp`.** PNG/JPG work but break the convention and hurt Lighthouse. Always convert.
5. **Future-dated posts disappear.** [src/lib/blog-utils.ts](src/lib/blog-utils.ts) filters posts where `date > today` out of both the index AND the static route list — `/blog/{slug}` 404s until the date arrives. If you want it live now, date it today or earlier.

## Inputs to collect from the user

Before writing anything, confirm:

- **Topic / angle** — what question does this answer? What's the hook?
- **Category** — one of: `Insights`, `Case Study`, `Business Growth`, `Values`. (Yes, there's also a stray `"Case Studies"` on one file — prefer `Case Study` singular.)
- **Related solutions** — IDs from [src/data/solutions.tsx](src/data/solutions.tsx). Valid options: `working-capital-loans`, `invoice-factoring`, `equipment-leasing`, `asset-based-lending`, `inventory-financing`, `purchase-order-funding`, `government-contracts`, `real-estate-lending`, `unsecured-debt`, `bridge-funding`, `sba-loans`, `debt-refinance`.
- **Related industries** — free-form lowercase strings, e.g. `construction`, `manufacturing`, `healthcare`, `staffing`, `retail`, `hospitality`, `services`.
- **Author** — default `"Michael Kodinsky"` with `authorImage: "/Michael Headshot.webp"`. Ask if it should be someone else.

If the user gives you just a topic, make reasonable picks and surface your choices in the response — don't gate progress on a perfect answer.

## Step 0 — Mine the voice corpus FIRST

Before writing a single line, open these and pull the material that already exists on this topic:

| File | What's in it | Use for |
|---|---|---|
| `docs/mike-voice-patterns.md` | Mike's signature phrases ("here to serve," "channel-neutral," "under-promise/over-deliver"), rhythm, asides, and the opener-pitch structure | Voice and tone calibration; signature-phrase placement |
| `docs/product-explanations.md` | Mike's plain-English product explanations with analogies (triangle, lockbox, water-in-a-cup, drug, basement-to-ladder, band-aid, "cousin to") | Lifting his actual analogies verbatim when explaining a product |
| `docs/objections-and-responses.md` | Real prospect objections paired with Mike's verbatim responses (rate too high, MCA fear, broker spam, fee transparency, "I'm shopping," "I need a strategic partner") | Content addressing high-intent objection queries; reframing language |
| `docs/prospect-faqs.md` | The actual questions real prospects asked Mike — disguised, anxious, half-formed | Building FAQ sections that match real query language, not invented marketing FAQs |
| `docs/qualifying-questions.md` | Mike's 13-phase qualifying sequence (orient, time in business, revenue, bottom line, use of funds, AR, inventory, debt stack, credit, urgency, what-they've-tried, curiosity asides, next steps) | Decision-framework sections; "how to know if this fits you" content |
| `docs/linkedin-post-themes.md` | 50 of Mike's authored LinkedIn posts (public, safe to quote) | Pull-quote material; topical-cluster ideas |

**The bar:** every new post must include at least 2–3 named direct quotes from Mike (format: `**Michael Kodinsky:** *"..."*` or `**Michael Kodinsky, Founder of Serve Funding:** *"..."*`). 2026 GEO research shows named-expert quotes lift LLM citations 1.5–2x. Paraphrasing his analogies is the lazy version — embed his actual words, with attribution, because that's what AI engines lift cleanly into citations.

**The hard rule:** never put real prospect names, identifying business details, or deal specifics from `docs/` into the published post. The transcripts contain ~12 real prospects who shared confidential information; the only deal-level specifics that ship are the ones already published in [src/data/fundingData.ts](src/data/fundingData.ts).

See the **Voice Cheat Sheet** at the end of this skill for Mike's signature analogies, ready to drop into a draft.

## Step 1 — Write the `.mdoc` file

Path: `/posts/{kebab-case-slug}.mdoc`. The slug IS the URL, so choose it deliberately.

Template (note the answer-first structure — see "Content quality" section below for why):

```markdown
---
title: "Headline phrased as the exact question a buyer would ask"
subtitle: "One sentence that earns the click"
excerpt: "1–2 sentence preview for the blog index card. 120–160 chars."
author: "Michael Kodinsky"
date: "YYYY-MM-DD"
category: "Insights"
image: "/blog/{slug}.webp"
relatedSolutions: ["solution-id-1", "solution-id-2"]
relatedIndustries: ["construction", "manufacturing"]
authorImage: "/Michael Headshot.webp"
---

**Direct answer to the title question in the first 50 words.** No throat-clearing, no "in today's economy" preamble. State the answer, then qualify it. This is the chunk an LLM will quote when someone asks the question your headline poses.

A short paragraph of context that explains *why* the answer is what it is — the reasoning a reader (or model) needs to trust the claim.

## How it actually works

Mechanics. Concrete numbers. Named scenarios — "a $4M HVAC contractor in Texas" beats "a small business." Use `**bold**` for emphasis, not ALL CAPS.

## When this applies vs. when it doesn't

A comparison or decision-framework section. Side-by-side bullets, or a short table. This is what gets cited when someone asks ChatGPT "X vs Y."

{% callout type="tip" title="The takeaway" %}
One line a reader should walk away with — and one line an AI is likely to surface as a snippet.
{% /callout %}

## Common mistakes / what to avoid

Frame failure modes explicitly. "Founders most often get this wrong by ___." Negative-space content ranks well because few competitors write it.

## FAQ

**Short question phrased the way a buyer would type it?**
Direct answer in 1–2 sentences.

**Another related question?**
Direct answer.

{% relatedPosts category="Insights" limit="3" /%}
```

Callout types: `info` (blue), `warning` (amber), `tip` (green), `danger` (red).

## Content quality — what makes a post AI-discoverable

The Markdoc/SEO mechanics above just get the post to render and deploy. These rules are what make it actually *cited* by ChatGPT, Claude, Perplexity, and Google's AI Overviews — which is where Serve Funding's discovery upside is. Skipping these produces a post that publishes cleanly and gets read by nobody.

**1. Answer-first, always.**
The first 50 words must directly answer the question in the title. LLMs extract the highest-confidence chunk near the top of the page; if your opening is a hook or anecdote, the model has nothing to quote and will pick a competitor's page instead. Order: **direct answer → why it's true → how it works → edge cases → FAQ.**

**2. Concrete specifics over hedged abstractions.**
"$4M HVAC contractor with 60-day receivables" is referenceable. "A growing business" is not. Named industries, dollar amounts, time-to-funding, and real decision criteria are what models pattern-match on. If a sentence would still be true with the numbers removed, the numbers aren't doing work — replace them with real ones.

**3. Cover the topic, not just one angle.**
A single post on "invoice factoring" is invisible. A post on "invoice factoring" + posts on "factoring vs. ABL," "factoring for staffing companies," "what factoring costs," "when factoring is the wrong choice" is a topic cluster the model treats as authoritative. Before writing, check `/posts/` for adjacent coverage and either link to it or note the gap. Aim to own the surface area of a topic before moving to the next one.

**4. Include a "what to avoid" or "common mistakes" section.**
Negative-space content (mistakes, myths, when-not-to) is high-signal for AI extraction and underwritten by competitors. Almost every post should have one section framed this way.

**5. Use a real FAQ block at the bottom.**
2–4 short Q/A pairs (6–10 on a pillar post) phrased the way a buyer would actually type them into search. **Mine [docs/prospect-faqs.md](docs/prospect-faqs.md) first** — those are the actual questions real prospects asked Mike on real calls, with their actual word choices. They're better source material than anything you'd invent. This is the single highest-leverage section for AI citation — each Q/A is a self-contained chunk that maps cleanly to a query.

**6. Link inline to FAQ entries and `/solutions/{id}` pages.**
Internal linking with consistent anchor text reinforces entity association — the model learns that Serve Funding "is the source on" these topics. Don't bolt links on at the end; weave them where they're useful.

**7. Mike's voice — the mandate, not the suggestion.**
- **Minimum 2 named direct quotes from Mike**, attributed `**Michael Kodinsky:** *"..."*` or `**Michael Kodinsky, Founder of Serve Funding:** *"..."*`. Pillar posts get 3–5.
- **Use his analogies verbatim, not paraphrased.** Triangle / lockbox / water-in-a-cup for factoring. Drug / basement-to-ladder / band-aid for MCAs. "Cousin to" for factoring↔ABL. See the Voice Cheat Sheet appendix.
- **Use his signature phrases:** "here to serve," "channel-neutral, product-neutral advisor," "specialize in being generalists," "under-promise and over-deliver," "does that make sense?", "relationships > bots." Sprinkle 2–3 per post, never more.
- **The rhythm:** warm + direct + curious + transparent. Mike interrupts himself, self-narrates, asks questions back, admits when he doesn't know. The bot should mirror this — never a polished marketing voice.

**8. Length and structure.**
- Educational, not salesy. Answer the reader's real question; CTAs go in the page chrome, not in the body.
- 800–1500 words for a normal post. 2500–4500 words for a pillar post or comparison page.
- One core claim per post. Posts that try to cover three things get cited for none.

## Step 2 — Generate the cover image

Use the n8n webhook. Prompts must describe **professional photography** — real people, business context. Never illustrations, cartoons, or abstract graphics. Look at `/public/blog/Meeting1.webp`, `Cofee.webp`, `Walking.webp` for the target aesthetic.

```bash
SLUG="your-post-slug"
PROMPT="Professional photograph of [people] in [setting] [doing action], [business context]"

curl -X POST https://aiascend.app.n8n.cloud/webhook/generate-image \
  -H "Content-Type: application/json" \
  -d "{\"prompt\": \"$PROMPT\"}" \
  -o "/tmp/${SLUG}.png" -s

cwebp "/tmp/${SLUG}.png" -o "public/blog/${SLUG}.webp"
rm "/tmp/${SLUG}.png"
```

**Prompt patterns by topic:**
- Funding decisions: `Professional photograph of diverse business team in modern office discussing financial decisions, reviewing charts and documents`
- Cash flow / operations: `Professional photograph of business professionals managing warehouse or inventory operations, real people in operational setting`
- Lender relationships: `Professional photograph of business meeting between advisor and business owner, collaboration and trust, handshake in modern office`
- Growth / revenue: `Professional photograph of professionals reviewing growth charts and revenue reports at meeting table`

**Verify** the WebP is in `public/blog/{slug}.webp` and is 40–150 KB. If it came out >300 KB, re-run `cwebp` with `-q 75`.

## Step 3 — Local preview AND build verification

```bash
npm run dev
```

Open `http://localhost:3000/blog/{slug}`. Check:
- Hero renders with cover image (not a broken icon)
- No 500 error (that's the `---` trap)
- Callouts are colored, not raw `{% callout %}` text
- Related posts widget populates

Then — **this is not optional** — run the same build Vercel runs:

```bash
npm run build
```

If this fails with an SEO error, fix the frontmatter and re-run. Skipping this step is how the invoice-factoring-myths post sat broken on production for a day: the deploy silently failed on title/excerpt length and nobody noticed until someone checked the live URL.

## Step 4 — Subagent review loop (do this for pillar posts)

For substantive posts (>1500 words, comparison content, anything intended to anchor a topical cluster), run the post through a two-agent review loop before committing. This caught real, ship-blocking issues on the factoring and MCA pillar posts — invented URLs, customer-anxiety questions left unaddressed, salesy hedge language. Skip it only for short case studies or quick updates.

**Save the draft to `/tmp/sf-blog-drafts/{slug}.mdoc` first**, so the review agents can read a stable file path.

**Round 1 — spawn both agents in parallel (same message, two `Agent` tool calls):**

```
Agent #1: Reader-persona review
  subagent_type: general-purpose
  prompt: role-play as a specific small-business-owner persona matched to the post's
  target audience (be detailed: industry, revenue, growth rate, what triggered them
  to read this, what they're afraid of, what they don't know). Read the draft cold.
  Report: did it answer my real questions, what confused me, what was missing,
  what landed, trust check, would I act, what would tip me from "interesting"
  to "calling tomorrow."

Agent #2: GEO research + audit
  subagent_type: general-purpose
  prompt: do 2-4 fresh web searches on 2026 GEO best practices for the post's topic
  cluster. Audit the draft against: citation density in first 30%, named-expert
  direct-quote coverage, listicle/table extractability, FAQPage schema readiness,
  question-format headings, primary-source outbound links, factual accuracy
  (spot-check claims and URLs — flag anything that looks fabricated). Suggest
  specific quoted replacements and the must-fix priority list.
```

**Synthesize** the two reports. They usually converge — the reader's biggest unaddressed fear is also the GEO's missing-high-volume-FAQ. Apply the union of must-fix items.

**Round 2 — re-run the same two agents** on the revised draft to verify the fixes landed AND catch any regressions. Round 2 frequently identifies smaller polish items (a hedging phrase, a specific number still missing, a missing related question). Apply those, then ship.

**Common gotcha:** the GEO agent will sometimes suggest specific URLs ("link to [Fed report]") that are plausible-looking but don't exist. Always `curl -sIL -o /dev/null -w "%{http_code}\n"` a suggested external URL before pasting it into the post. Inventing URLs is the single biggest factual-integrity risk in this workflow.

## Step 5 — Commit and PR

```bash
git fetch origin && git switch -c content/{slug} origin/dev   # if not already on it
git add posts/{slug}.mdoc public/blog/{slug}.webp
git commit -m "content: add {short post description}"
git push -u origin content/{slug}
gh pr create --base dev --title "content: {title}" --body "Adds {short summary}."
```

One commit per post is the norm. If the user hasn't asked you to commit, stop after Step 3 and show them the files — don't create commits unprompted.

## Common mistakes — check for these before finishing

**Content quality (re-read your draft against these before committing):**
- First 50 words don't directly answer the title's question → the post will publish but won't get cited. Rewrite the opening as the answer, not a hook.
- No FAQ section at the bottom → biggest single miss for AI discoverability. Add 2–4 Q/A pairs.
- No "common mistakes" or "when not to" section → the negative-space content competitors skip. Add one.
- Generic abstractions where specifics belong ("a small business," "growing companies") → replace with named industries and real numbers.
- No internal links to `/solutions/{id}` or FAQ entries → weakens entity association.

**Mechanics (will silently break the post or the deploy):**
- **Title > 54 chars or excerpt > 160 chars** → `verify-seo` fails → Vercel build fails → post never deploys. Always run `npm run build` locally.
- `---` appears on a line by itself inside the body → will 500 in prod. Grep `grep -n '^---$' posts/{slug}.mdoc` should return exactly two lines (1 and ~12).
- Image path in frontmatter doesn't match the file you saved (`.jpg` vs `.webp`, wrong slug).
- `relatedSolutions` contains an ID that doesn't exist in `src/data/solutions.tsx` → broken links in the "Related Solutions" widget.
- Author image path has wrong capitalization (`/Michael Headshot.webp` is correct, case-sensitive on Linux deploys).
- Post dated in the future → hidden until the date arrives (filter in `src/lib/blog-utils.ts`). Check this first if a committed post isn't showing.
- Pushed straight to `main` or `dev` instead of a feature branch → PR. Always use the PR flow.

## Debugging checklist: "the post isn't showing on production"

Run these in order:

1. `git log origin/main -- posts/{slug}.mdoc` — is the commit actually on main?
2. `gh api repos/ServeFunding/website/commits/{sha}/status --jq '.state'` — did Vercel fail? If `failure`, check `target_url` for the build log.
3. `npm run build` locally — reproduces Vercel's failure mode, usually an SEO length error.
4. Check the post's `date:` field — if it's in the future, it's deliberately hidden.
5. Check the author image path's capitalization.

## Fully worked example — from topic to live post

User says: "Add a post about whether SBA loans are worth the paperwork for a $500K ask."

```bash
# 1. Make sure the repo is clean, then branch from fresh dev
git fetch origin && git switch -c content/sba-loans-worth-the-paperwork-at-500k origin/dev

# 2. Pick a slug
SLUG="sba-loans-worth-the-paperwork-at-500k"

# 3. Create the .mdoc file (see template in Step 1). Keep:
#    title ≤ 54 chars, excerpt 120–160 chars, date today or earlier
#    e.g. title: "Are SBA Loans Worth the Paperwork at $500K?"  (44 chars ✓)

# 4. Generate and convert the cover image
curl -X POST https://aiascend.app.n8n.cloud/webhook/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Professional photograph of small business owner reviewing loan documents with advisor at modern office desk, stacks of paperwork, thoughtful expression"}' \
  -o "/tmp/${SLUG}.png" -s
cwebp "/tmp/${SLUG}.png" -o "public/blog/${SLUG}.webp"
rm "/tmp/${SLUG}.png"

# 5. Verify
npx tsx scripts/verify-seo.ts   # must report "All SEO metadata passes"
npm run build                    # must exit 0
npm run dev                      # open http://localhost:3000/blog/${SLUG}

# 6. Ship — only if the user asked you to commit
git add posts/${SLUG}.mdoc public/blog/${SLUG}.webp
git commit -m "content: add SBA loan paperwork post"
git push -u origin content/${SLUG}
gh pr create --base dev \
  --title "content: SBA loans worth the paperwork" \
  --body "Adds /blog/${SLUG} — answers whether SBA paperwork burden pencils out at a \$500K ask."

# 7. After the dev → main release PR merges, confirm the deploy succeeded
SHA=$(git rev-parse origin/main)
gh api repos/ServeFunding/website/commits/${SHA}/status --jq '.state'
# Expect: "success". If "failure", see debugging checklist above.
```

---

## Voice Cheat Sheet — Mike's signature analogies and phrases

This is the ready-to-drop reference. When the post needs an analogy or framing, **use these verbatim** — paraphrasing them weakens the citation lift and breaks the topical-authority signal across the cluster of posts that share them.

### Product analogies (use these by name)

**AR factoring — the triangle.** You at one corner, your customer at another, the factor (the lender that buys your invoices) at the third. The factor steps into the middle and buys the invoice from you at a slight discount, advancing you 80% – 95% within 24 to 48 hours. When the customer eventually pays, they pay the factor, not you. *Source: Lwany call.*

**AR factoring — the lockbox / DACA.** A separate bank account (Deposit Account Control Agreement) the factor sets up. Customers remit payment there going forward; your company name is still on the account, the factor has visibility and sweep ability. *Source: Lwany call.*

**AR factoring — water in a cup.** The line is a cup. The water is the money outstanding. As you upload invoices and draw, the water rises (line fills up). As customers pay into the lockbox, the cup empties, and the line replenishes. The cup just gets bigger as your AR grows — no re-underwriting. *Source: Lwany call.*

**ABL — "cousin to factoring".** Both create a revolving line collateralized by AR (+ inventory at lower advance). The difference: factoring is a recurring sale of an asset (off-balance-sheet); ABL is a true line of credit on the balance sheet. Same lockbox / DACA mechanics. *Source: Chuck Wahr call.*

**MCA — the drug analogy.** "It's like a drug that people get addicted to." They sell it cleverly, you stack them, by the time you're seven deep the "reverse" is just another MCA. The line that captures the addiction is: *"MCAs are like a drug that, that people get addicted to."* — use it verbatim. *Source: Carlos call.*

**MCA consolidation — basement to first floor in steps.** "You're not going from the basement to the first floor with us in one leap. You're going a few steps up the ladder, so to speak. Like you're moving in the right direction, and you got to keep, you know, moving in the right direction." *Source: Carlos call.* Use this verbatim when explaining the MCA exit journey.

**MCA consolidation — the band-aid framing.** "To really actually work to better the business, not just be a Band-Aid that just gets peeled off two weeks later and another one gets put on and it's worse and worse each time." *Source: Carlos call.*

**MCA consolidation — "do us a favor".** "MCA consolidations are always difficult because of the nature of them, because you're asking somebody to say, hey, give us, you know, buy this 20% or 30% debt from us for, and charge us 10% for it. Would you do that please? You're basically saying somebody, hey, do us a big favor and take a risk on us just because we're asking." *Source: Eli call.*

**The two underwriting buckets.** Mike's single most important conceptual frame. Every business-lending product falls into one of two buckets: **asset-backed** (receivables, inventory, real estate, equipment) or **revenue-based** (historical cash flows, trailing 12-month revenues, MCA structures). Use this frame to organize *any* product explanation. *Source: Joel call.*

**Real estate as the cheapest capital.** "Real estate is always going to command the lowest rates, because it's lenders, generally speaking, favorite asset, if you will, from a security standpoint, it's not going anywhere, it's generally appreciating." *Source: Lawson call.*

**Equipment — sale-leaseback.** "It's almost like you're selling it back to the lender and then leasing it back from them. Which is just a fancy way of saying, that's how you're getting cash out of it." *Source: Daryl call.*

**Layered capital — the stack.** Combining multiple products (e.g., $1MM AR revolver + $240K unsecured term + $550K second mortgage = $1.79MM total) to maximize available capital without over-leveraging any single source. This is Mike's signature multi-prong move. *Source: medical-device case in `fundingData.ts`.*

### Signature phrases (sprinkle 2–3 per post)

- **"Here to serve."** Biblical-nod servant-leadership mantra. The brand line.
- **"Channel-neutral, product-neutral advisor."** The positioning vs. captive brokers.
- **"Specialize in being generalists."** The deliberate oxymoron.
- **"Time is our most valuable resource — the only one that's truly finite."** Mike's most recurring framing line across all 12 calls. Use for "why we exist" or "why speed matters" content.
- **"Under-promise and over-deliver."** Mike's commitment phrase, the inverse of broker-spam culture.
- **"Relationships > bots."** The site's tagline. Use sparingly so it stays earned.
- **"Does that make sense?"** Conversational check-in. Use at the end of any product-explanation section.
- **"Small business owners are the backbone of our economy."** Use sparingly when framing the mission.
- **"When banks say no, we say how."** Use as a section-closer when explaining the bank-decline pipeline.

### Rhythm patterns (the bot/blog should mirror these)

- **Self-narrate.** "I'm getting carried away" / "let me explain what I mean" / "okay, hopefully you're sitting down for this." Mike interrupts himself constantly — it's the texture that makes him sound human.
- **Ask questions back.** After explaining a product, end with "Does that make sense?" or "What was driving you to ask that?"
- **Admit when you don't know.** Mike says "I'd have to check" or "I'm not the right person for that" — don't bluff in his voice.
- **Walk away from bad deals.** Mike will explicitly tell a prospect Serve isn't the right fit. Posts should mirror this — "if this describes you, factoring isn't the right product, and we'll tell you that on the first call."
- **Multi-prong recommendations.** Mike rarely pitches a single product. He stacks 2–3 (PO + AR; factoring + RBF subordinate; ABL + unsecured term). The "right answer" is rarely one product.
- **Use the prospect's actual numbers.** Mike plugs the prospect's revenue, AR balance, etc. into his explanation. Blog posts can't do this live, but the worked examples should be *sized* to the target persona (e.g., a $2.8MM HVAC contractor, not "a small business").

### What NOT to do

- Don't paraphrase the analogies. "Imagine a triangle" weakens the brand and the GEO signal. Use "The factoring triangle" as the named concept.
- Don't invent quotes. If Mike didn't say it in `docs/`, don't put quote marks around it.
- Don't use the prospect names in `docs/` in published output. Lift his words, anonymize the rest. See ground rule #2.
- Don't bolt the voice on at the end. Mike's analogies are the *structure* of his explanations, not decorations on top. Write the post around them, not despite them.
