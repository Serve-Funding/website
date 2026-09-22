# CLAUDE.md

## Git Workflow (HARD RULE — applies to every change)

**All changes go `dev` → PR → `main`. AI agents must never push directly to `main` and must never merge PRs themselves.**

Production is served from `main`. Vercel auto-deploys on every `main` push, so a bad commit on `main` is a bad commit in production. The PR gate exists so a human reviews SEO length errors, Markdoc traps, and deploy-breaking changes before they ship.

**Workflow for any code or content change:**

1. `git checkout dev && git pull` — start from fresh `dev`.
2. Make the change, run `npm run build` locally (it runs `scripts/verify-seo.ts` first — must pass).
3. `git add` the specific files you changed (never `git add .`), commit with a conventional prefix (`fix:`, `feat:`, `content:`, `seo:`, `perf:`, `copy:`, `docs:`).
4. `git push origin dev`.
5. `gh pr create --base main --head dev --title "..." --body "..."` — open the PR.
6. **Stop.** Report the PR URL to the user and explicitly hand off:

   > "PR ready at {url}. Only a human can merge — please review the diff, watch the Vercel check go green, and click **Merge pull request** on GitHub to ship to production."

**Why this is a hard rule:**
- Merging is the one action that goes live. It's explicitly reserved for the human owner so they see what's shipping.
- Skipping the PR (direct push to `main`) desyncs `dev` from `main` and hides changes from review. This already bit us once (commit e1afeee): a direct-to-main push sailed through without review, failed Vercel's SEO gate, and sat broken in production for a day before anyone noticed.
- Vercel's build can fail silently on frontmatter length violations — the PR check is how you catch that before it affects the live site.

AI agents may `git commit`, `git push`, and `gh pr create`. AI agents must **not** run `gh pr merge`, `git push origin main`, or anything else that lands changes on `main` — even if the user says "just merge it." If the user asks you to merge, respond that merging is reserved for human review on github.com and give them the PR URL.

### Never squash-merge `dev` → `main` (use "Create a merge commit")

**`dev` and `main` are both long-lived. Squashing between them corrupts the history relationship, and it is not self-correcting.**

A squash merge throws away the parent link, so git stops seeing `dev` as an ancestor of `main` and every later `dev` → `main` merge conflicts on everything both touched — even though nobody disagreed about anything. The symptom is confusing because the *content* is fine — `git diff origin/main origin/dev` comes back empty while GitHub still reports conflicts.

**Rules:**
- `dev` → `main`: always **"Create a merge commit"**. Never "Squash and merge", never "Rebase and merge".
- feature branch → `dev`: squash is fine. Those branches are deleted after merging, so there is no history left to corrupt.
- Best fix is to turn the option off: **Settings → General → Pull Requests**, uncheck "Allow squash merging" (or set the default merge button to "Create a merge commit") so it cannot happen by muscle memory.

**If it happens anyway**, the repair is to merge `main` back into `dev` and push `dev` — that makes `main` an ancestor of `dev` again, costs nothing in content when the trees already match, and does not require touching `main`:

```bash
git checkout dev && git pull
git merge origin/main      # trivial when the trees are already identical
git push origin dev
```

Diagnose it with `git rev-list --parents -n 1 <main-tip>` (one parent means it was squashed) and `git merge-base --is-ancestor origin/dev origin/main`.

## Project Skills

This repo ships its own Claude Code skills in `.claude/skills/`:

- **`/create-blog-post`** — the end-to-end blog post workflow: `.mdoc` scaffolding with correct frontmatter, the Markdoc traps, the cover image via the n8n webhook (converted to WebP), and the `dev` → PR → `main` flow. Use it any time you draft, create, or add a new blog post.

## Project Overview

Serve Funding's marketing site: funding solutions, company information, a Markdoc blog, and a Claude-powered chatbot. The architecture emphasizes data centralization, SEO optimization (AIEO — AI Engine Optimization), and JSON-LD schema markup for LLM visibility. Stack, project structure, environment variables and deployment targets are in `README.md`.

## Commands

`npm run build` runs `scripts/generate-last-updated.ts`, `scripts/verify-seo.ts` and two more verification scripts before `next build`, and any failure stops it. Vercel runs the same build, so run it locally before committing; `npx tsx scripts/verify-seo.ts` is the fast isolated check. Other scripts are in `package.json`.

## Conventions

- **`src/data/company-info.ts` is the single source of truth for company facts.** The chatbot's system prompt (`buildAIContext()` in `src/lib/ai.ts`) and the JSON-LD schema are built from it, so change a fact there, not in page copy. `[VERIFY:]` markers flag items needing founder validation.
- **CTAs**: Always use `<CTA />` component from `src/components/cta.tsx` instead of writing manual section markup. Props: `title`, `text`, `buttonText`, `href` (default `/discover`), `useBG` (for gray background).
- **Hero Sections**: Use `<HeroFadeIn />` for consistent page headers instead of manual Section/Container/Heading combinations.
- **Forms**: Use pre-built form components from `src/components/Forms.tsx` (e.g., `DealInquiryForm`, `NewsletterForm`).
- **FAQ answers** live in `src/data/faq-data.ts` and feed both the `/faq` page and the chatbot's context. An entry can carry a YouTube `videoId` plus a verbatim `videoTranscript` (see `src/types/faq.ts`).
- **Educational/reference pages** follow one order: `<HeroFadeIn />` → plain-language overview → main content in `<Card />` / `<StaggerContainer />` → real-world examples with specific numbers → a decision framework → key takeaways in cards → `<CTA />`, plus a proper metadata object.

## Freshness Signals: sitemap `lastmod` and `dateModified`

**You do not hand-maintain dates anywhere. Both signals are derived from git.**

`scripts/generate-last-updated.ts` runs before every build and writes `src/data/last-updated.generated.ts`, which holds two maps:
- `DATA_LAST_UPDATED` — per data file, feeds `dateModified` into each page's JSON-LD.
- `ROUTE_LAST_MODIFIED` — per route, feeds `<lastmod>` into `src/app/sitemap.ts`.

A route's date is the newest commit date across the files listed for it in `ROUTE_SOURCES` — its `page.tsx` plus any data files it renders.

**The one rule: when you add a route, add it to `src/app/sitemap.ts` and to `ROUTE_SOURCES`.** The script exits non-zero if a route lists source files that don't exist, so a typo fails the build rather than silently shipping a wrong date.

**Why this matters:** Google uses `lastmod` to schedule recrawls, and it *stops trusting the field entirely* for domains that publish inaccurate dates. Corollaries:
- **Never stamp `lastmod` with "today" or the build date.** That is the exact pattern that gets the signal discarded. If git can't answer, the script falls back to the previously committed date on purpose.
- **Shallow clones inflate dates, so the script deepens history before reading it** (`git fetch --unshallow`; Vercel clones ~10 commits deep). If it can't, it keeps the committed dates and says so in the build log.
- **Don't add a route to `sitemap.ts` that redirects or 404s.** `/funding` sat in the sitemap after it was retired, which surfaces as a "Page with redirect" error in Search Console.

## Announcing Changes to Search Engines

`.github/workflows/indexnow.yml` runs on every push to `main` and submits exactly the URLs whose `lastmod` matches the push's commit date to IndexNow. The IndexNow key is public by design and lives at `public/7f3a2b9c4d8e1f6a5b7c9d2e4f8a1b3c.txt`; the workflow reads it from that file, so there is one source of truth — don't duplicate it into a secret. This covers **Bing, and therefore ChatGPT**, whose search index is Bing. Google does not support IndexNow; for Google the lever is accurate `lastmod` plus URL Inspection in Search Console.

## Blog Posts (Markdoc)

Posts are `.mdoc` files in `/posts/` with YAML frontmatter, and each routes automatically to `/blog/[post-slug]`. To create one, use `/create-blog-post` — it carries the frontmatter template, the cover-image workflow and a production debugging checklist. These rules apply to every post edit, new or old:

- **NEVER use `---` (horizontal rules) in blog post body content.** Markdoc renders `---` as `<hr>` which causes React hydration errors (500 errors in production). Use headings or whitespace for visual separation instead.
- **NEVER use checkbox syntax (`- [ ]` or `- [x]`)** in blog posts. Markdoc does not support checkboxes — they render as plain text `[ ]`. Use regular bullet points (`-`) instead.
- Only use standard markdown plus the custom tags defined in `src/markdoc/config.ts` (`callout`, `relatedPosts`). Unsupported syntax may cause silent rendering failures or 500 errors in production.
- **SEO frontmatter limits (HARD REQUIREMENT — enforced by `scripts/verify-seo.ts`):** `title` ≤ 54 characters (the page template appends ` | Serve Funding` for a 70-char OG-title budget); `excerpt` 120–160 characters (it doubles as the meta description). Exceeding them fails the build, and **Vercel's deploy fails silently** — the post never reaches production.
- **Post-push verification:** check the commit's deploy status with `gh api repos/ServeFunding/website/commits/{sha}/status --jq '.state'` — if `failure`, production is serving stale content until you fix the frontmatter.
