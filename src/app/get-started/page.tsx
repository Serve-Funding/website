import type { Metadata } from 'next'
import { HeroFadeIn } from '@/components/hero-fade-in'
import { OnePageForm } from '@/components/OnePageForm'

/**
 * /get-started — the one-page intake.
 *
 * A NEW ROUTE RATHER THAN A REPLACEMENT FOR /discover, on purpose. #81 tuned
 * that funnel on real numbers (128 loads → 34 starts → 22 submits over the 90
 * days to 2026-09-08), and replacing it in place would throw away the only
 * baseline we have to judge this page against. Both run; the CTA can be pointed
 * here when there is a reason to, and the loser gets retired with evidence.
 *
 * NOINDEX while that comparison runs. Two near-identical intake forms competing
 * on the same domain is a duplicate-content signal, and it would split the
 * inbound link equity of the page we have spent the AIEO work on. It is also
 * why this route is deliberately ABSENT from sitemap.ts — and therefore from
 * ROUTE_SOURCES in scripts/generate-last-updated.ts, which exists to date
 * sitemap entries. Add both in the same commit that removes this noindex.
 */
export const metadata: Metadata = {
  title: 'Get Started | Serve Funding',
  description:
    'Tell us about your business and what you need. One page, no credit pull, and an advisor reviews it before anything goes to a lender.',
  robots: { index: false, follow: false },
}

export default function GetStartedPage() {
  return (
    <>
      <HeroFadeIn
        title="Let's find the right capital for your business"
        subtitle="Everything we need is on this page. It takes about two minutes, there's no credit pull, and nothing goes to a lender until you say so."
      />
      <OnePageForm />
    </>
  )
}
