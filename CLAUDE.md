# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

A squash merge throws away the parent link. When `dev` → `main` is squashed, `main` gets the changes as one brand-new commit that has no connection to the commits they came from, so git stops seeing `dev` as an ancestor of `main`. From then on git treats the two branches as having *independently* created the same files, and every later `dev` → `main` merge conflicts on everything they both touched — even though nobody disagreed about anything.

This has already happened three times in a row (#74, #77, #76). #77 existed specifically to repair the split and carried a proper two-parent merge commit; squashing it on the way in flattened that commit back to one parent and undid the repair. The symptom is confusing because the *content* is fine — `git diff origin/main origin/dev` comes back empty while GitHub still reports conflicts.

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

This repo ships its own Claude Code skills in `.claude/skills/`. Invoke them with the `/skill-name` command or by having Claude trigger them based on their description:

- **`/create-blog-post`** — End-to-end blog post workflow: scaffolding the `.mdoc` file with correct frontmatter, avoiding Markdoc rendering traps (no `---` in body, no checkboxes), generating a cover image via the n8n webhook, converting to WebP, and following the `dev` → PR → `main` git flow. Use this any time you draft, create, or add a new blog post — it enforces conventions that are easy to miss.

## Project Overview

Serve Funding is a Next.js 16 web application for a working capital advisory company. The site showcases funding solutions, company information, and includes an AI-powered chatbot using Claude API. The architecture emphasizes data centralization, SEO optimization (AIEO - AI Engine Optimization), and schema markup for LLM visibility.

## Development Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm start            # Run production server
npm run lint         # Run Next.js linter
```

## Key Architecture Patterns

### 1. Centralized Data Model
All company information flows through a single master data source:
- **`src/data/company-info.ts`**: Master hub containing company basics, founder info, core values, process steps, and philosophy. This file is imported across multiple parts of the app, making it the source of truth.
- **`src/data/solutions.ts`**: Funding solutions and their metadata with titles, descriptions, features, and industry tags
- **`src/data/faq-data.ts`**: Comprehensive FAQ content organized by category (about Serve Funding, working capital, solutions, etc.) - **actively expanded with new content**
- **`/posts/` directory**: Blog posts stored as Markdoc files (.mdoc) with YAML frontmatter for metadata and markdown content. File-based system for easy content management.
- **`src/data/partners.ts`**: Partner types and testimonials for the partnerships page
- **`src/data/fundingData.ts`**: Case studies and success stories

**Why this matters**: Changes to company information update everywhere automatically. The file contains `[VERIFY:]` markers for items needing founder validation. Blog posts use file-based markdown for flexibility and FAQs are centralized for easy updates without touching page components.

### 2. AI Integration (Chatbot)
The chatbot is powered by Claude API via the Anthropic SDK:
- **API Route**: `src/app/api/chat/route.ts` - Handles POST requests with message history
- **AI Context Builder**: `src/lib/ai.ts` - `buildAIContext()` dynamically generates system prompts from company data, ensuring the chatbot stays synchronized with current company information
- **Component**: `src/components/Chatbot.tsx` - Floating widget with message history
- **Model**: Uses `claude-haiku-4-5-20251001` with max 1024 tokens
- **System Prompt**: Built from company info, solutions, values, and process - keeps AI responses in company voice

**Key Detail**: The system prompt is constructed in `buildAIContext()` and includes instructions for brevity (1-2 sentences max) and no markdown formatting.

### 3. SEO & Schema Markup (AIEO Strategy)
The app implements JSON-LD schema markup to improve visibility in AI responses:
- **Schema Generators**: `src/lib/schema-generators.ts` - Reusable functions for:
  - `getOrganizationSchema()` - Company-wide schema (FinancialService type)
  - Service schemas for each funding solution
  - FAQ schemas
  - Review/aggregateRating schemas
- **Where Used**: Schemas are embedded in pages as `<script type="application/ld+json">` tags
- **Goal**: Help LLMs (ChatGPT, Claude, Perplexity) understand and cite Serve Funding in their responses

**Implementation Plan**: Documented in README.md sections on AIEO/GEO. Week-1 checklist in `WEEK-1-VERIFICATION-CHECKLIST.md` requires founder to verify 46 data points before schema deployment.

### 4. Component Architecture
Uses CVA (class-variance-authority) for styled components:
- **Design System** (`src/components/ui/`): Reusable, styled components
  - `heading.tsx`, `text.tsx`, `button.tsx`, `card.tsx`, `section.tsx`, `container.tsx`
  - All accept variant props for different visual states (e.g., button variants: default, gold, outline, ghost, link, white)
  - Components use Tailwind CSS v4
- **Page Components** (`src/components/`): Business logic and layout
  - `Header.tsx` - Navigation with dropdown menus
  - `Footer.tsx` - Multi-section footer with links
  - `Chatbot.tsx` - Floating widget
  - `HeroCarousel.tsx`, `ProcessCard.tsx` - Feature components
  - `FAQSection.tsx` - FAQ display with styling
  - `CTA.tsx` - Reusable call-to-action section (use for all CTAs, don't write manual markup)
  - `HeroFadeIn.tsx` - Hero section with fade animation
  - `Breadcrumb.tsx` - Breadcrumb navigation
  - `PartnerInquiryForm.tsx` - Partner inquiry form component

**Styling Approach**: Tailwind CSS v4 with custom olive/gold color scheme defined in `tailwind.config.ts`. Classes use CVA patterns like `cn()` utility for conditional styling.

**Component Best Practices**:
- **CTAs**: Always use `<CTA />` component from `src/components/cta.tsx` instead of writing manual section markup. Props: `title`, `text`, `buttonText`, `href` (default `/contact-us`), `useBG` (for gray background).
- **Hero Sections**: Use `<HeroFadeIn />` for consistent page headers instead of manual Section/Container/Heading combinations.
- **Forms**: Use pre-built form components from `src/components/Forms.tsx` (e.g., `PartnerInquiryForm`, `DealInquiryForm`).

### 5. Page Structure
- **App Routes** (`src/app/`): Next.js 13+ App Router
  - Each page route is a folder with `page.tsx`
  - `layout.tsx` - Root layout wrapping all pages with Header/Footer
  - `not-found.tsx` - 404 page
  - `sitemap.ts` - Dynamic sitemap for SEO
- **Dynamic Routes**: `src/app/solutions/[solution-id]/` - Dynamic solution detail pages

### 6. AI/SEO Configuration
- **`src/lib/seo.ts`**: Metadata generation for SEO
- **`next.config.ts`**: Comprehensive config including:
  - Security headers (CSP, HSTS, X-Frame-Options, etc.)
  - Image optimization (remote patterns, formats, qualities)
  - Redirects (www → non-www, legacy WordPress URLs)
  - Caching headers for static assets and _next/static

### 7. Types
TypeScript types are organized by feature:
- `src/types/faq.ts` - FAQ type definitions
- `src/types/solutions.ts` - Solution/funding type definitions

## Common Development Tasks

### Adding a New Funding Solution
1. Add entry to `src/data/solutions.ts` with title, description, features, etc.
2. Update company info in `src/data/company-info.ts` if needed
3. Dynamic route `src/app/solutions/[solution-id]/page.tsx` automatically creates detail pages
4. Solution will be available in chatbot context via `buildAIContext()`

### Updating Company Information
1. Edit `src/data/company-info.ts` (single source of truth)
2. Changes propagate to:
   - Chatbot AI context (via `src/lib/ai.ts`)
   - Schema markup (via `src/lib/schema-generators.ts`)
   - All pages importing this data
3. No cache invalidation needed - data is built at request time

### Adding New Pages
1. Create folder in `src/app/[page-name]/`
2. Create `page.tsx` with content
3. Add navigation links in `src/components/Header.tsx` if needed
4. Use design system components from `src/components/ui/`
5. Add the route to `src/app/sitemap.ts` **and** to `ROUTE_SOURCES` in `scripts/generate-last-updated.ts` (see below)

### Freshness Signals: sitemap `lastmod` and `dateModified`

**You do not hand-maintain dates anywhere. Both signals are derived from git.**

`scripts/generate-last-updated.ts` runs before every build and writes `src/data/last-updated.generated.ts`, which holds two maps:
- `DATA_LAST_UPDATED` — per data file, feeds `dateModified` into each page's JSON-LD.
- `ROUTE_LAST_MODIFIED` — per route, feeds `<lastmod>` into `src/app/sitemap.ts`.

A route's date is the newest commit date across the files listed for it in `ROUTE_SOURCES` — its `page.tsx` plus any data files it renders. So editing `src/data/industries.ts` moves both the on-page `dateModified` and the sitemap `lastmod` for every `/industries/*` URL, with no one having to remember anything.

**The one rule: when you add a route, add it to `ROUTE_SOURCES`.** The script exits non-zero if a route lists source files that don't exist, so a typo fails the build rather than silently shipping a wrong date.

**Why this matters:** Google uses `lastmod` to schedule recrawls, and it *stops trusting the field entirely* for domains that publish inaccurate dates. This previously bit us: `sitemap.ts` hardcoded a single review date, so a full content sweep in late August still reported `lastmod: 2026-05-27` while the on-page `dateModified` said `2026-08-31`. The two signals contradicted each other and the new content read as unchanged.

Two corollaries:
- **Never stamp `lastmod` with "today" or the build date.** That is the exact pattern that gets the signal discarded. If git can't answer, the script falls back to the previously committed date on purpose.
- **Shallow clones inflate dates, so the script deepens history before reading it.** Vercel clones ~10 commits deep, and under a shallow clone `git log -1 -- <file>` returns the *boundary* commit for every file the window doesn't contain — so a page untouched since June reports whatever date the window happens to start on, and that date marches forward with every deploy. The script runs `git fetch --unshallow` first; if it can't, it keeps the committed dates and says so in the build log. This shipped broken once: `/fundings` and `/blog` went live claiming 2026-08-31 when their real dates were 2026-06-09 and 2026-06-21.
- **Don't add a route to `sitemap.ts` that redirects or 404s.** `/funding` sat in the sitemap after it was retired, which surfaces as a "Page with redirect" error in Search Console.

### Announcing Changes to Search Engines

`.github/workflows/indexnow.yml` runs on every push to `main`. It waits for Vercel to publish the new sitemap, selects the URLs whose `lastmod` matches the push's commit date, and submits exactly those to IndexNow. A push that changes no tracked content submits nothing and exits clean.

- The IndexNow key is public by design and lives at `public/7f3a2b9c4d8e1f6a5b7c9d2e4f8a1b3c.txt`. The workflow reads it from that file, so there is one source of truth — don't duplicate it into a secret.
- This covers **Bing, and therefore ChatGPT**, whose search index is Bing. Google does not support IndexNow and retired sitemap ping; for Google the lever is accurate `lastmod` plus URL Inspection in Search Console.

### Creating Educational/Reference Pages
Educational pages (like `/capital-strategy`) follow this pattern:
1. **Hero Section**: Use `<HeroFadeIn />` component with clear title and subtitle
2. **Overview Section**: Explain the concept in plain language
3. **Main Content**: Use `<Card />` and `<StaggerContainer />` for visual hierarchy
4. **Examples**: Real-world scenarios with specific numbers and outcomes
5. **Decision Framework**: Help visitors choose (use cards with comparisons)
6. **Key Takeaways**: Summary in `<Card>` components for easy scanning
7. **CTA**: End with `<CTA />` component pointing to `/contact-us`
8. **Metadata**: Include proper metadata object for SEO

**Pattern Example**: `/src/app/capital-strategy/page.tsx` demonstrates this structure with the collateral vs. speed vs. cost tradeoff explanation.

### Modifying the Chatbot
- System prompt: Edit `src/lib/ai.ts` `buildAIContext()` function
- UI/styling: Edit `src/components/Chatbot.tsx`
- API logic: Edit `src/app/api/chat/route.ts`
- Conversation flow: Logic is in `src/components/Chatbot.tsx` state management

### Understanding the Markdoc System
Markdoc is a markdown framework that powers the blog:
- **Config** (`src/markdoc/config.ts`): Defines available custom tags and their attributes
- **Renderer** (`src/markdoc/renderer.tsx`): Maps Markdoc AST nodes to React components with styling
- **Blog Utils** (`src/lib/blog-utils.ts`): Reads .mdoc files, parses YAML frontmatter, returns structured data
- **Flow**: User creates `.mdoc` file → `getBlogPosts()` reads file → Markdoc parser creates AST → Renderer outputs styled HTML
- **Styling**: All rendered elements auto-styled using Tailwind (olive/gold theme applied by renderer)
- **Performance**: All 14 blog posts pre-rendered at build time via static generation

### Adding Blog Posts (Markdoc-Based System)

> **Shortcut for AI agents:** invoke the `/create-blog-post` skill at [.claude/skills/create-blog-post/SKILL.md](.claude/skills/create-blog-post/SKILL.md). It encodes every rule below as a step-by-step workflow with exact commands, a worked example, and a production debugging checklist. The sections below are the authoritative reference; the skill is the fast path.

**Deploy pipeline in one sentence:** commit to `dev` → PR to `main` → Vercel runs `npm run build` (which runs `scripts/verify-seo.ts` FIRST) → if that passes, the post is live; if it fails, production keeps serving the old build and no error surfaces unless someone checks `gh api repos/ServeFunding/website/commits/{sha}/status`.

Blog posts use Markdoc (.mdoc files) with YAML frontmatter for flexible content management:

**Step 1: Create a new file** in `/posts/[post-slug].mdoc` (slug derived from title, kebab-case)

**Step 2: Add YAML frontmatter** with required metadata:
```yaml
---
title: "Your Post Title Here"
subtitle: "Optional subtitle for extra context"
excerpt: "Short preview text for blog listing (1-2 sentences)"
author: "Author Name"
date: "2026-01-28"
category: "Insights"
image: "/blog/image-name.webp"
relatedSolutions: ["solution-id-1", "solution-id-2"]
relatedIndustries: ["healthcare", "manufacturing"]
authorImage: "/author-headshot.webp"
---
```

**Step 3: Write markdown content** with full markdown support:
- Standard markdown: `## Heading`, `**bold**`, `[link](url)`, `- lists`, `> blockquotes`
- Code blocks: ` ```language code``` `
- Tables: Standard markdown table syntax
- **Custom Callout Tags**: `{% callout type="info" title="Title" %}Content{% /callout %}`
  - Types: `info` (blue), `warning` (amber), `tip` (green), `danger` (red)
- **Related Posts Widget**: `{% relatedPosts category="Insights" limit="3" /%}`
  - Filter by `category` or `solution` ID
- All HTML auto-styled with olive/gold theme from design system

**Markdoc Content Restrictions (IMPORTANT):**
- **NEVER use `---` (horizontal rules) in blog post body content.** Markdoc renders `---` as `<hr>` which causes React hydration errors (500 errors in production). Use headings or whitespace for visual separation instead.
- **NEVER use checkbox syntax (`- [ ]` or `- [x]`)** in blog posts. Markdoc does not support checkboxes — they render as plain text `[ ]`. Use regular bullet points (`-`) instead.
- Only use markdown features listed above. Unsupported syntax may cause silent rendering failures or 500 errors in production.

**SEO Frontmatter Length Limits (HARD REQUIREMENT — enforced by `scripts/verify-seo.ts`):**
`npm run build` runs `verify-seo` BEFORE `next build`. If these limits are exceeded, the build exits non-zero and **Vercel's deploy fails silently** — the post never reaches production.
- **`title` ≤ 54 characters.** The page template appends ` | Serve Funding` (16 chars) for a 70-char OG-title budget.
- **`excerpt` 120–160 characters.** Doubles as the meta description.
- **Always run `npm run build` locally before committing a post** to catch failures before Vercel does. Verify with `npx tsx scripts/verify-seo.ts` for a fast isolated check.
- **Post-push verification:** check the commit's deploy status with `gh api repos/ServeFunding/website/commits/{sha}/status --jq '.state'` — if `failure`, production is serving stale content until you fix the frontmatter.

**Step 4: File-based routing** - Post automatically appears at `/blog/[post-slug]` without manual route creation

**Implementation Details**:
- Utility: `src/lib/blog-utils.ts` - `getBlogPosts()` reads .mdoc files and parses frontmatter
- Parser: `src/markdoc/config.ts` - Markdoc configuration with custom tags
- Renderer: `src/markdoc/renderer.tsx` - Transforms Markdoc AST to styled React components
- All 14+ blog posts currently in `/posts/` as active examples

**Blog Content Strategy**:
- Focus on educational content that addresses the funding journey
- Each post should answer specific customer questions (use PODCAST-CONTENT-ANALYSIS.md for insights)
- Link posts to FAQ answers and solutions pages
- Real examples and metrics build credibility
- Use callout tags to emphasize key insights or warnings

### Automating Blog Cover Image Generation
Blog cover images can be generated automatically via webhook integration, providing professional photography-style images matching the existing visual style.

**Setup & Integration**:
1. Webhook URL: `https://aiascend.app.n8n.cloud/webhook/generate-image`
2. Method: POST request with JSON body
3. Request format: `{"prompt": "Description of image for generation"}`
4. Output: PNG image file (converted to WebP for web optimization)

**Image Generation Script**:
```bash
# Function to generate a single image
generate_image() {
  local filename=$1
  local prompt=$2

  echo "Generating $filename..."
  curl -X POST https://aiascend.app.n8n.cloud/webhook/generate-image \
    -H "Content-Type: application/json" \
    -d "{\"prompt\": \"$prompt\"}" \
    -o "/tmp/$filename" \
    -s

  if [ -f "/tmp/$filename" ]; then
    cp "/tmp/$filename" "public/blog/$filename"
    echo "✓ Saved $filename"
  fi
}

# Call for each blog post
generate_image "image-name.png" "Professional photograph of professionals in office setting doing [action], professional business context"
```

**Image Prompt Guidelines**:
- **Always specify**: "Professional photograph of..."
- **Include**: Real people in business settings, professional context
- **Avoid**: Illustrations, graphics, cartoons, abstract designs
- **Reference style**: Look at existing images in `/public/blog/` (Meeting1.webp, Cofee.webp, Walking.webp, etc.) - these show the target professional photography aesthetic
- **Format**: Describe the scene, people, action, and business context explicitly

**Example Prompts by Topic**:
- **Funding/Finance Decisions**: "Professional photograph of diverse business team in modern office discussing financial decisions, reviewing charts and documents, strategic meeting setting"
- **Cash Flow/Seasonal**: "Professional photograph of business professionals managing warehouse or inventory operations, seasonal workflow planning, real people in operational setting"
- **Lending Partnership**: "Professional photograph of business meeting between advisors and business owner, showing collaboration and trust, handshake or engaged discussion in modern office"
- **Growth/Revenue**: "Professional photograph of professionals reviewing growth charts and revenue reports at meeting table, analyzing success with thoughtful consideration"

**Post-Generation Processing**:
1. Images are generated as PNG files (~2MB each)
2. Convert to WebP using cwebp for optimization: `cwebp image.png -o image.webp && rm image.png`
3. Optimized WebP files are typically 50-150KB (90%+ smaller than PNG)
4. Update YAML frontmatter in blog post: `image: "/blog/image-name.webp"`

**Automation Workflow**:
1. After creating blog posts, create list of image filenames and prompts
2. Run the generation script for each image
3. Convert PNG → WebP format
4. Verify files are in `/public/blog/` with correct names
5. Update YAML `image:` field in each post to match generated filename

**Key Notes**:
- Always use `.webp` format for consistency with existing blog images
- Professional photography style (not illustrations) matches site aesthetic
- Place all images in `/public/blog/` directory
- Filenames should be kebab-case matching the blog post slug when possible
- Images are automatically lazy-loaded on blog pages for performance

### Adding or Expanding FAQ Content
1. Edit `src/data/faq-data.ts`
2. Add new entries to appropriate category (organize by topic for usability)
3. Keep answers concise but comprehensive (2-3 sentences typically)
4. Include specific examples or numbers when relevant
5. Link to related blog posts or solutions pages in answers when appropriate
6. FAQ answers appear automatically on `/faq` page and power the chatbot

**FAQ Best Practices**:
- Questions should target high-intent search terms
- Answers should be skimmable (use bold, lists where appropriate)
- Address objections and concerns directly
- Reference company expertise and real client scenarios

**Adding Videos to FAQ Answers** (Optional):
For trust-building, FAQs can now include embedded YouTube videos alongside text answers:

```typescript
{
  id: 'example-faq',
  q: 'What is Asset-Based Lending?',
  a: 'Short text answer (2-3 sentences for skimmable format)...',
  videoId: 'dQw4w9WgXcQ', // YouTube video ID only (no full URL)
  videoTranscript: 'Full video transcript for accessibility and searchability...',
  relatedSolutions: ['asset-based-lending']
}
```

**How it works**:
- Video appears in expanded accordion when user clicks FAQ
- Text answer shown first, video below for those who want more detail
- Transcript in collapsible `<details>` section for accessibility
- YouTube embedding is lazy-loaded for performance
- Transcripts improve SEO (indexed as text) and accessibility (ADA compliance)

**Video Guidelines**:
- Keep videos 2-3 minutes max for engagement
- Host on YouTube (best for indexing + analytics)
- Include captions on video itself
- Transcript should match video content verbatim
- Start with 1-2 FAQs with video to test engagement impact

### Adding SEO Schema to a Page
1. Import schema generator from `src/lib/schema-generators.ts`
2. Create schema object with page data
3. Embed in page as: `<script type="application/ld+json">{JSON.stringify(schema)}</script>`
4. Validate with Google Rich Results Test tool

## Environment Setup

Create `.env.local` in root:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

This is required for the chatbot to function.

## Important Files to Know

| File | Purpose |
|------|---------|
| `src/data/company-info.ts` | Master data hub - single source of truth |
| `/posts/` | Blog post directory - Markdoc files with YAML frontmatter (14+ posts) |
| `src/lib/blog-utils.ts` | Blog utility functions - `getBlogPosts()`, `getBlogPost()`, frontmatter parsing |
| `src/markdoc/config.ts` | Markdoc configuration with custom tags (callout, relatedPosts) |
| `src/markdoc/renderer.tsx` | Transforms Markdoc AST to styled React components |
| `src/data/faq-data.ts` | FAQ content organized by category (20+ answers) |
| `src/data/solutions.ts` | Funding solutions catalog |
| `src/data/partners.ts` | Partner types and testimonials |
| `src/lib/ai.ts` | Chatbot AI context builder |
| `src/app/api/chat/route.ts` | Chatbot API endpoint |
| `src/lib/schema-generators.ts` | JSON-LD schema generation utilities |
| `src/components/cta.tsx` | Reusable CTA component (use for all CTAs!) |
| `src/components/HeroFadeIn.tsx` | Hero section component |
| `src/components/Breadcrumb.tsx` | Breadcrumb navigation |
| `next.config.ts` | Next.js configuration (headers, redirects, images) |
| `tailwind.config.ts` | Tailwind theme with olive/gold colors |
| `CLAUDE.md` | This file - guidelines for working with the codebase |
| `PODCAST-CONTENT-ANALYSIS.md` | Content gaps analysis from podcast - SEO/FAQ opportunities |

## Color Scheme

Custom theme in `tailwind.config.ts`:
- **Olive** (primary): `olive-900` (#2a231a) for dark text/backgrounds
- **Gold** (accent): `gold-500` (#c99c42) for highlights and CTAs

Use via Tailwind classes: `bg-olive-900`, `text-gold-500`, etc.

## TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Target: ES2021
- Module resolution: bundler (Next.js 13+)

## Deployment

The app is configured for multiple deployment targets:
- **Vercel** (recommended) - handles Next.js optimally
- **Railway** - requires `ANTHROPIC_API_KEY` env var
- **Self-hosted** - standalone Next.js server via `npm run build && npm start`

Next.js output is set to `standalone` for containerized deployments.

## AIEO/Schema Markup Status

This is an ongoing initiative to improve visibility in AI responses:
- **Phase 1**: ✅ Complete - Base schemas and data structure in place
- **Week 1**: Founder verification of 46 data points (in `src/data/company-info.ts`)
- **Weeks 2-4**: Implementation roadmap in `IMPLEMENTATION-GUIDE.md`
  - Week 2: FAQ page + FAQPage schema
  - Week 3: Solutions page enhancements + Service schemas
  - Week 4: Case studies + Review schema

See `HOW-AI-SEES-YOUR-SITE.md` for technical architecture details.

## Performance Considerations

- Next.js Turbopack for faster builds
- Static page generation where possible
- Image optimization (multiple formats, quality levels, caching)
- API routes optimized for serverless
- Security headers configured in `next.config.ts`
- CSP policy allows specific third-party domains (HubSpot, Umami analytics)

## Key Dependencies

- **React 19.2.1** - UI framework
- **Next.js 16.0.7** - Framework with App Router
- **Framer Motion 12.23.24** - Animations
- **Tailwind CSS 4.1.17** - Styling with PostCSS
- **@anthropic-ai/sdk 0.70.1** - Claude API
- **Lucide React 0.554.0** - Icon library
- **class-variance-authority 0.7.1** - Component styling patterns
- **@markdoc/markdoc 0.4.0** - Markdown parsing and custom tag support
- **@markdoc/next.js 0.4.1** - Next.js integration for Markdoc
