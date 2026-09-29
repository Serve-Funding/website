import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Section,
  Container,
  Heading,
  Text,
  FadeIn,
  Card,
} from '@/components/ui'
import { Breadcrumb } from '@/components/breadcrumb'
import { CTA } from '@/components/cta'
import { GatedDownload } from '@/components/GatedDownload'
import { FAQSectionWithSchema } from '@/components/FAQSection'
import { SchemaRenderer } from '@/components/SchemaRenderer'

const PAGE_URL = 'https://servefunding.com/advisors'

export const metadata: Metadata = {
  title: 'Business Advisors: Resource & Referral Hub',
  description:
    'For CPAs, fractional CFOs, and business advisors whose clients need capital the bank can’t provide: how a referral to Serve Funding works, and what we fund.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Business Advisors: Resource & Referral Hub',
    description:
      'A business financing advisory for CPAs, fractional CFOs, investment bankers, and advisors. You stay the trusted advisor; we find the capital.',
    url: PAGE_URL,
    siteName: 'Serve Funding',
    type: 'article',
    images: [
      {
        url: 'https://servefunding.com/partners/Handshake.webp',
        width: 1024,
        height: 882,
        alt: 'Business advisors, Serve Funding',
      },
    ],
  },
}

const advisorTypes = [
  {
    title: 'CPAs & Accountants',
    text: 'You see the cash-flow squeeze in the numbers before anyone else does. We turn that into a financing plan your client can act on.',
  },
  {
    title: 'Fractional CFOs',
    text: 'You own the forecast. We bring the lender market to it, so the capital plan has real options behind it.',
  },
  {
    title: 'Investment Bankers',
    text: 'Bridge capital, acquisition financing, and working capital around a transaction, for the deals that need debt alongside the raise.',
  },
  {
    title: 'Private Equity Firms',
    text: 'Working capital and asset-based facilities for portfolio companies, from add-on acquisitions to seasonal swings.',
  },
  {
    title: 'Business Advisors & Consultants',
    text: 'When a client’s growth plan hits a funding wall, we find the structure that gets them over it.',
  },
]

const solutions = [
  {
    title: 'Working capital & bridge',
    text: 'Short- and mid-term working capital loans and lines of credit for situational capital needs.',
  },
  {
    title: 'Asset-based lending',
    text: 'Non-bank facilities built on receivables, inventory, purchase orders, equipment, and commercial real estate.',
  },
  {
    title: 'Subordinated & stretch capital',
    text: 'A short-term infusion behind an existing bank facility, for bankable clients who need a little more.',
  },
  {
    title: 'Equipment leasing & financing',
    text: 'New and existing equipment across construction, manufacturing, data centers, and more.',
  },
  {
    title: 'Real estate lending',
    text: 'Bridge and long-term financing for commercial and investment property: purchase, refinance, and cash-out.',
  },
]

const referralSteps = [
  {
    title: 'You make the introduction',
    text: 'Send your client to servefunding.com/discover, or email michael@servefunding.com if you would rather make a warm introduction or set up a three-way call.',
  },
  {
    title: 'A 20-minute discovery call',
    text: 'We map the situation (collateral, revenue trajectory, use of funds, timing) and identify which structures fit. If nothing does, we say so on this call.',
  },
  {
    title: 'We shop the deal',
    text: 'We take the deal to the lenders that fit and come back with two or three real options for your client to compare, not a single quoted rate.',
  },
  {
    title: 'Closing, with you in the loop',
    text: 'We negotiate terms on your client’s behalf and guide them through closing. You stay informed throughout, as much as your client wants you to be.',
  },
]

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How a CPA, fractional CFO, or business advisor refers a client to Serve Funding',
  description:
    'The steps from an advisor’s introduction to a closed financing facility, with the advisor kept in the loop.',
  step: referralSteps.map((step, idx) => ({
    '@type': 'HowToStep',
    position: idx + 1,
    name: step.title,
    text: step.text,
  })),
}

// Written as the questions an advisor would actually type into a search box or
// an AI assistant. Each answer stands on its own, because that is the unit an
// assistant quotes.
const advisorFaqs = [
  {
    q: 'Where can I send a client who needs financing their bank turned down?',
    a: "To a business financing advisory like Serve Funding. We're not a lender. We represent your client to the non-bank lending market: asset-based lenders, factors, equipment lessors, real estate lenders, and specialty lenders. We find what fits their situation, and we bring back two or three real options instead of one quoted rate. Start at servefunding.com/discover, or email michael@servefunding.com for a warm introduction.",
  },
  {
    q: 'Is Serve Funding a lender or a broker?',
    a: "A broker, in the best sense of the word. We're a family-owned business financing advisory, so we work for the client, not for a lender. We're channel-neutral and product-neutral: we're not trying to fit every client into AR financing or equipment leasing. We look across everything available and recommend the structure that actually fits.",
  },
  {
    q: 'What size of business and financing do you work with?',
    a: 'We place financing from $250K to $100MM for businesses with real revenue and a real plan. Most clients are growing companies that should be bankable in 12 to 24 months but aren’t today, because of thin DSCR, tax returns that lag current revenue, recent leverage, or an industry the bank won’t take.',
  },
  {
    q: 'What kinds of financing can you arrange for my client?',
    a: 'Five broad kinds: working capital and bridge loans; asset-based lending on receivables, inventory, purchase orders, equipment, and commercial real estate; subordinated or stretch capital behind an existing bank facility; equipment leasing and financing; and real estate lending. Programs in our network include revenue-based term loans up to $10MM, asset-based lines up to $50MM or more, and government contract financing up to $10MM or more.',
  },
  {
    q: 'Can you help a client stuck in merchant cash advances?',
    a: "Often, yes. MCAs can work like a drug that businesses get hooked on, with each advance making the next one more necessary. If the business has real revenue and something to build on, we look at refinancing the stack into a term loan or an asset-based facility with a payment the business can carry. If the numbers don't support that, we'll say so plainly rather than add another layer.",
  },
  {
    q: 'Do you finance government contractors, healthcare, or tech companies?',
    a: 'Yes. Government contract financing covers receivables, contracts, and work in progress for prime contractors and subcontractors on federal, state, and Defense contracts. There are specialty term loans for healthcare firms, and revenue-based term loans for software and SaaS companies with no equity warrants. We also work regularly with manufacturing, construction, staffing, and distribution.',
  },
  {
    q: 'How fast can my client get funded?',
    a: 'It depends on the structure. Working capital loans and bridge capital typically fund in 2 to 10 business days, and some real estate bridge loans close in under a week. Invoice factoring usually takes 2 to 3 weeks to set up, and asset-based lending 4 to 8 weeks. When timing is critical, a bridge can often fund quickly while a longer-term facility closes behind it.',
  },
  {
    q: 'What happens if you can’t help my client?',
    a: "We tell them on the first call. Time is the one resource none of us can make more of, and the worst outcome for a referral is weeks of underwriting that end in a no. So we'd rather be honest early than string anyone along. If we can't place a deal, we'll tell you too.",
  },
  {
    q: 'Will you compete with me for the client relationship?',
    a: "No. We only do financing, so we don't offer the tax, accounting, or advisory work you provide. We want your client to come away seeing you as the advisor who found a way. That's how referral relationships last, and it's how we've built ours.",
  },
]

export default function AdvisorsPage() {
  return (
    <>
      <SchemaRenderer schema={howToSchema} />

      <Breadcrumb items={[{ label: 'Advisors' }]} />

      {/* Hero */}
      <Section className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <FadeIn className="max-w-4xl mx-auto">
            <Text size="sm" className="uppercase tracking-wide font-semibold text-gold-500 mb-3">
              Resource &amp; Referral Hub for Business Advisors
            </Text>
            <Heading size="h1" className="mb-4 text-olive-900">
              When Your Client Needs Capital, Bring Us In
            </Heading>
            <Text size="2xl" className="text-gray-700 mb-4">
              Serve Funding is a business financing advisory, not a lender. When a client needs capital their bank can&apos;t provide, we take them to the lending market, bring back real options, and keep you in the loop the whole way.
            </Text>
            <Text size="sm" className="text-gray-500">
              A family-owned advisory led by co-founders Michael and Sarah Kodinsky. Funding from $250K to $100MM.
            </Text>
          </FadeIn>
        </Container>
      </Section>

      {/* Time and trust */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              It&apos;s about time, and it&apos;s about trust
            </Heading>
            <Text className="text-gray-700 mb-6">
              Your clients&apos; time is limited while they build their businesses. Yours is limited too, between client work and everything else on your plate. Financing shouldn&apos;t become a second job for either of you.
            </Text>
            <Text className="text-gray-700 mb-6">
              And every time you make a referral, part of your reputation goes with it. The worst outcome is a referral that spends weeks in underwriting and then falls apart. So we look at every structure available before we recommend one, and if nothing fits, we tell your client on the first call.
            </Text>
            <Card padding="md" noHover className="bg-gray-50 border-l-4 border-l-gold-500">
              <Text className="text-gray-800 italic mb-3">
                &ldquo;Time is our most valuable resource. It&apos;s the only one that&apos;s truly finite. Everything else in the world, you can make more of, but not time.&rdquo;
              </Text>
              <Text size="sm" className="text-gray-600">
                Michael Kodinsky, Co-Founder &amp; CEO
              </Text>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Advisor one-pager, gated so the team knows who downloaded it */}
      <Section id="download" className="py-12 bg-gray-50 scroll-mt-28">
        <Container>
          <GatedDownload
            asset="advisors"
            heading="Get the advisor one-pager"
            description="Two pages to keep on file or share with your team: what we fund, and a sampling of the programs we place, with real terms."
            highlights={[
              'The five kinds of capital we place: working capital and bridge, asset-based lending, subordinated and stretch capital, equipment, and real estate',
              'Eight sample programs with amounts, terms, rates, and credit requirements',
              'How we strengthen your standing with the clients you already serve',
            ]}
          />
        </Container>
      </Section>

      {/* Who we work with */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <Heading size="h2" className="mb-8 text-olive-900 text-center">
              Who we work with
            </Heading>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {advisorTypes.map((type) => (
                <Card key={type.title} padding="md" noHover>
                  <Heading size="h4" className="mb-2 text-olive-900">{type.title}</Heading>
                  <Text size="sm" className="text-gray-700">{type.text}</Text>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* What we fund */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <Heading size="h2" className="mb-3 text-olive-900 text-center">
              Creative capital solutions
            </Heading>
            <Text className="text-gray-700 mb-8 text-center max-w-2xl mx-auto">
              We&apos;re channel-neutral and product-neutral, so we can layer structures and shop several lenders at once.
            </Text>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {solutions.map((solution) => (
                <Card key={solution.title} padding="md" noHover>
                  <Heading size="h4" className="mb-2 text-olive-900">{solution.title}</Heading>
                  <Text size="sm" className="text-gray-700">{solution.text}</Text>
                </Card>
              ))}
            </div>
            <Text size="sm" className="text-gray-600 mt-6 text-center">
              See <Link href="/solutions/compare" className="underline hover:no-underline">all funding solutions side by side</Link>.
            </Text>
          </div>
        </Container>
      </Section>

      {/* How a referral works */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              How a referral works
            </Heading>
            <ol className="space-y-6">
              {referralSteps.map((step, idx) => (
                <li key={step.title}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center">{idx + 1}</div>
                    <div>
                      <Heading size="h4" className="mb-1 text-olive-900">{step.title}</Heading>
                      <Text className="text-gray-700">{step.text}</Text>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      <FAQSectionWithSchema
        title="Advisor FAQ"
        description="The questions CPAs, CFOs, and advisors ask before sending the first client."
        faqs={advisorFaqs}
        background="gray"
        schemaName="Serve Funding Advisor Referral"
      />

      <CTA
        title="Have a Client in Need of Financing?"
        text={<>Answer a few questions and schedule a call at your convenience.<br />Takes a few minutes and there&apos;s no obligation.</>}
        buttonText="Discuss a Client's Funding Needs"
        href="/discover?role=partner"
        useBG
      />
    </>
  )
}
