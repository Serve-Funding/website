import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Section,
  Container,
  Heading,
  Text,
  FadeIn,
  Card,
  Button,
} from '@/components/ui'
import { Breadcrumb } from '@/components/breadcrumb'
import { SchemaRenderer } from '@/components/SchemaRenderer'
import { FAQSectionWithSchema } from '@/components/FAQSection'
import { GatedDownload } from '@/components/GatedDownload'

// Banker → client intro email draft, voiced per docs/mike-voice-patterns.md.
const INTRO_EMAIL_SUBJECT = 'Quick intro: a financing advisory I trust'
const INTRO_EMAIL_BODY = [
  'Hi [name],',
  '',
  "Wanted to put a name in front of you. Serve Funding is a family-owned business financing advisory I work with when a deal doesn't fit our credit box. They're not a direct lender. Think of them more like your advocate to the non-bank lending world. Channel-neutral, product-neutral, 15+ years doing this.",
  '',
  'A few things worth knowing up front:',
  "  •  Your accounts stay with us. They don't take deposits.",
  "  •  The first call is about 20 minutes. They'll tell you straight whether they can help.",
  "  •  They shop the deal across their lender network and come back with two or three real options, not a single quoted rate.",
  '',
  'Easiest way to start is here: https://servefunding.com/discover',
  '',
  "Mention you came through me and they'll prioritize the call.",
  '',
  '[your name]',
].join('\n')
const INTRO_MAILTO = `mailto:?subject=${encodeURIComponent(INTRO_EMAIL_SUBJECT)}&body=${encodeURIComponent(INTRO_EMAIL_BODY)}`

const PAGE_URL = 'https://servefunding.com/bankers'

export const metadata: Metadata = {
  title: 'Bankers: When You Have to Decline a Loan',
  description:
    'When you must decline a commercial loan but want to keep the client: how Serve Funding works with banker referrals, and why your deposits stay with you.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Bankers: When You Have to Decline a Loan',
    description:
      'A non-bank financing advisory built around banker referrals. You stay the relationship; we extend your reach.',
    url: PAGE_URL,
    siteName: 'Serve Funding',
    type: 'article',
    images: [
      {
        url: 'https://servefunding.com/partners/Trust.webp',
        width: 1024,
        height: 728,
        alt: 'Bankers, Serve Funding',
      },
    ],
  },
}

// FAQ data in the site's standard { q, a } shape so it works with FAQSectionWithSchema.
const bankerFaqs = [
  {
    q: "Will my client switch their depository relationship to a different bank?",
    a: "No. Serve Funding is a financing advisory, not a bank. We don't take deposits, we don't open operating accounts, and we don't compete with you for the relationship. Your depository, treasury, ACH, payroll, and FX business all stay where they are. The only new account that gets opened in a typical placement is a lockbox or DACA account at the alternative lender's bank, and that account specifically serves the AR-collateralized facility. Your operating account is untouched.",
  },
  {
    q: "Do you pay banker referral fees?",
    a: "No. We don't pay bankers for referrals. Most banks don't allow it under their compliance policies, and even where it would be permissible, paying for referrals introduces a misalignment we don't want. The benefit of referring to us is structural: your client gets credit they couldn't get at the bank, you stay the hero of the relationship, the depository business doesn't go to a competing bank, and the client comes back to you cleaner and more bankable when the trajectory allows it.",
  },
  {
    q: "What happens to my client after I refer them?",
    a: "We take a 20-minute discovery call to map the situation: collateral position, revenue trajectory, use of funds, timing. We tell the client honestly which path fits (often two or three layered products). We shop the deal across our extensive lender network: asset-based lenders, factors, equipment specialists, SBA partners, real estate lenders. We come back to the client with two or three real options to choose from. You're kept in the loop throughout if the client wants you in the loop; we don't run separately from the banking relationship.",
  },
  {
    q: "When will my client be bankable again?",
    a: "Depends on what got them declined and what we put in place. A factoring or asset-based facility used to bridge slow AR while the business cleans up its tax returns typically produces a bankable profile within 12 to 24 months. An MCA consolidation refinance into a term loan is often a longer arc, 18 to 36 months. A real-estate cash-out for working capital can pencil out to bankable inside a year. The point is we're not trying to keep your client off your bank line forever; we're stabilizing them so they can come back to you.",
  },
  {
    q: "What kind of deals do you actually do?",
    a: "Revenue range $500K to $100MM+, with most placements between $2MM and $50MM in revenue. Deal sizes $250K to $100MM+. Products: invoice factoring, asset-based lending, working capital loans, equipment financing, purchase order funding, government contract financing, bridge capital, SBA (referred through specialty non-bank SBA lenders), real estate cash-out, MCA consolidation. Industries: staffing, manufacturing, healthcare supply, government contractors, construction, distribution, professional services, e-commerce. Channel-neutral, product-neutral. We shop whichever lender fits the situation, not whichever pays us the most.",
  },
  {
    q: "What kind of deals do you not do?",
    a: "Pure equity rounds (we refer out to capital advisors). Consumer-facing lending. Cannabis. Crypto-specific. Anything where the business doesn't have at least $500K in trailing revenue or a clear path to it. Deals where the client is unwilling to put up any collateral, has no PG-creditworthy owner, and has thin revenue, we'll tell them honestly that none of our network will write it. We say no plainly when no is the right answer.",
  },
  {
    q: "What do I tell my client when I refer them?",
    a: 'Something like: "Our credit team can\'t get this done in our box, but I know a financing advisory that works with bankers exactly like us. They\'ll shop the deal across an extensive network of alternative lenders and bring back honest options. They don\'t take your deposits, your accounts stay with us, and they\'ve been doing this 15+ years. The first call is 20 minutes and they\'ll tell you straight whether they can help. Here\'s the link." Then send servefunding.com/discover or servefunding.com/bankers (whichever feels right). We take it from there.',
  },
  {
    q: "How fast do you fund?",
    a: "Depends on the product. Working capital loans and bridge capital fund in 2 to 10 business days. Invoice factoring closes in 2 to 3 weeks (then 24–48 hours per invoice after). Asset-based lending takes 4 to 8 weeks. Government contract financing 10 to 20 business days. SBA 4 to 12 weeks (we refer those to non-bank SBA lenders). When timing is genuinely critical we can usually find a bridge structure that funds in days while a permanent facility closes in the background.",
  },
  {
    q: "Who actually works the deal, the founders or an intake team?",
    a: "Serve Funding is a small, family-owned advisory. Co-founders Michael and Sarah Kodinsky are involved in every banker-referred deal, and the relationship stays with them from the first call through closing. We've stayed deliberately small because relationship-driven work doesn't scale through a call center.",
  },
  {
    q: "Can I just send my client to your discovery form?",
    a: "Yes. The fastest path is servefunding.com/discover. Mention you're a banker referral and we'll prioritize the discovery call. If you'd prefer to make a warm introduction over email, michael@servefunding.com goes straight to Michael, and he is happy to coordinate a three-way call if that fits the situation better than a hand-off.",
  },
]

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'What to do when you decline a commercial loan but want to keep the client',
  description:
    'How a commercial banker refers a declined or partially-declined client to Serve Funding while keeping the depository relationship.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Identify the credit-box mismatch',
      text: "The client has revenue and a real business but doesn't fit your underwriting box, usually because of net income, leverage, DSCR, or industry concentration. The deal is fundamentally sound; your credit box just doesn't fit it.",
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Make the warm introduction',
      text: "Send the client a short email or text with the Serve Funding discovery link. Tell them you can't get the deal done in your credit box but you have an advisor you trust who specializes in this situation. Mention that the advisor doesn't take deposits and your relationship stays in place.",
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Serve Funding discovery call',
      text: 'A 20-minute discovery call maps the client situation (collateral, revenue trajectory, use of funds, timing) and identifies which two or three products fit. If nothing fits, the client hears that honestly on the first call.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Lender shopping and placement',
      text: 'Serve Funding shops the deal across its extensive lender network and returns to the client with two or three real options. You stay in the loop if the client wants you in the loop.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Closing and ongoing relationship',
      text: 'The new facility closes. The client keeps banking with you. Serve Funding stays in advisory mode and helps the client graduate back to bankable credit over the following 12 to 36 months.',
    },
  ],
}

export default function ForBankersPage() {
  return (
    <>
      <SchemaRenderer schema={itemListSchema} />

      <Breadcrumb items={[{ label: 'Bankers' }]} />

      {/* Hero — one consolidated section, no separate "answer block" card */}
      <Section className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <FadeIn className="max-w-5xl mx-auto">
            <Heading size="h1" className="mb-4 text-olive-900">
              When You Have to Decline the Deal,{' '}<br className="hidden md:inline" />
              Stay the Hero
            </Heading>
            <Text size="2xl" className="text-gray-700 mb-4">
              A non-bank financing advisory built around banker referrals. You stay the relationship; we extend your reach. We don&apos;t take deposits, we don&apos;t compete for the depository, and the client comes back to you cleaner when the trajectory allows.
            </Text>
            <Text size="sm" className="text-gray-500">
              A family-owned advisory led by co-founders Michael and Sarah Kodinsky.
            </Text>
          </FadeIn>
        </Container>
      </Section>

      {/* The relationship frame */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              You stay the relationship.{' '}<br className="hidden md:inline" />
              We extend your reach.
            </Heading>
            <Text className="text-gray-700 mb-6">
              Plenty of sound businesses fall outside a bank&apos;s credit box: DSCR that just misses, tax returns that lag current revenue, leverage from a recent acquisition, an industry concentration the bank can&apos;t take. The need is real, and your client knows it. Left alone, they&apos;re one search away from a broker who&apos;ll put them in a merchant cash advance they&apos;ll regret.
            </Text>
            <Text className="text-gray-700">
              The better option is an advisor whose business depends on never threatening yours. We work downstream of your decline. Your client gets the capital, you stay the banker who found a way, the operating account stays with you, and when the financials catch up, the client comes back to your credit team ready to qualify.
            </Text>
          </div>
        </Container>
      </Section>

      {/* Banker one-pager, gated so the team knows who downloaded it */}
      <Section id="download" className="py-12 bg-gray-50 scroll-mt-28">
        <Container>
          <GatedDownload
            asset="bankers"
            heading="Get the Banker One-Pager"
            description="Keep this on file as a reference or forward internally: what we fund, and a sampling of the programs we place, with real terms."
            highlights={[
              'The five kinds of capital we place: working capital and bridge, asset-based lending, subordinated and stretch capital, equipment, and real estate',
              'Eight sample programs with amounts, terms, rates, and credit requirements',
              'How we position you as the one who got it done',
            ]}
          />
        </Container>
      </Section>

      {/* Why we exist — Michael's origin story */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              Why Michael built{' '}<br className="hidden md:inline" />
              Serve Funding this way
            </Heading>
            <Text className="text-gray-700 mb-6">
              Before Serve Funding, Michael Kodinsky spent years on the direct-lender side, running asset-based deals. Most of that business came from bankers: a client the bank couldn&apos;t approve, and a banker who made the introduction.
            </Text>
            <Card padding="md" noHover className="bg-gray-50 border-l-4 border-l-gold-500 mb-6">
              <Text className="text-gray-800 italic mb-3">
                &ldquo;I did a study at one point. I looked back two years and found we were closing one deal out of every fifteen or sixteen we looked at. The problem wasn&apos;t the closing ratio. Sales is a numbers game. The problem was that on so many of the others, we thought we had a deal. We spent weeks, the client&apos;s time and our own, only to hit a wall.&rdquo;
              </Text>
              <Text size="sm" className="text-gray-600">
                Michael Kodinsky, Co-Founder &amp; CEO
              </Text>
            </Card>
            <Text className="text-gray-700 mb-6">
              A lender with one product has to make every client fit that product, and it can take weeks to find out the fit isn&apos;t there. By then the client&apos;s window is closing, and the banker who made the introduction wears the result.
            </Text>
            <Text className="text-gray-700">
              So Michael and Sarah built Serve Funding the other way around. We&apos;re channel-neutral and product-neutral: we look at every structure available before we recommend one, and if nothing fits, we say so on the first call. That&apos;s how we protect your client&apos;s time, and your reputation along with it.
            </Text>
          </div>
        </Container>
      </Section>

      {/* What we actually do */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              What we do,{' '}<br className="hidden md:inline" />
              and what we don&apos;t
            </Heading>

            <div className="grid md:grid-cols-2 gap-6">
              <Card padding="md" noHover>
                <Heading size="h3" className="mb-3 text-olive-900">We do</Heading>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex gap-2"><span className="text-gold-500 font-bold">•</span><span>Invoice factoring and asset-based lending</span></li>
                  <li className="flex gap-2"><span className="text-gold-500 font-bold">•</span><span>Working capital loans and lines of credit</span></li>
                  <li className="flex gap-2"><span className="text-gold-500 font-bold">•</span><span>Equipment financing and sale-leaseback</span></li>
                  <li className="flex gap-2"><span className="text-gold-500 font-bold">•</span><span>Purchase-order funding (domestic + international)</span></li>
                  <li className="flex gap-2"><span className="text-gold-500 font-bold">•</span><span>Government contract financing (federal, state, local)</span></li>
                  <li className="flex gap-2"><span className="text-gold-500 font-bold">•</span><span>Bridge capital for timing gaps and M&amp;A</span></li>
                  <li className="flex gap-2"><span className="text-gold-500 font-bold">•</span><span>Non-bank SBA placement (referred to specialty lenders)</span></li>
                  <li className="flex gap-2"><span className="text-gold-500 font-bold">•</span><span>Real estate cash-out for working capital</span></li>
                  <li className="flex gap-2"><span className="text-gold-500 font-bold">•</span><span>MCA consolidation refinances</span></li>
                  <li className="flex gap-2"><span className="text-gold-500 font-bold">•</span><span>Layered capital stacks (multiple products simultaneously)</span></li>
                </ul>
              </Card>

              <Card padding="md" noHover>
                <Heading size="h3" className="mb-3 text-olive-900">We don&apos;t</Heading>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex gap-2"><span className="text-gray-400 font-bold">•</span><span>Take deposits or open operating accounts</span></li>
                  <li className="flex gap-2"><span className="text-gray-400 font-bold">•</span><span>Compete with your bank for the depository relationship</span></li>
                  <li className="flex gap-2"><span className="text-gray-400 font-bold">•</span><span>Raise equity or place equity capital (we refer out)</span></li>
                  <li className="flex gap-2"><span className="text-gray-400 font-bold">•</span><span>Sell your client products that don&apos;t fit their situation</span></li>
                  <li className="flex gap-2"><span className="text-gray-400 font-bold">•</span><span>Cold-pitch your client services they didn&apos;t ask for</span></li>
                  <li className="flex gap-2"><span className="text-gray-400 font-bold">•</span><span>Hold long-term debt on our balance sheet (we&apos;re an advisor, not a lender)</span></li>
                  <li className="flex gap-2"><span className="text-gray-400 font-bold">•</span><span>Push a client into a deal because we want to close them</span></li>
                </ul>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* ICP — what deals fit */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              What kind of clients fit
            </Heading>
            <Text className="text-gray-700 mb-6">
              Our sweet spot is a growing business that should be bankable in 12 to 24 months but isn&apos;t today. Specifically:
            </Text>
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-olive-900">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Criterion</th>
                    <th className="px-4 py-3 font-semibold">Range</th>
                    <th className="px-4 py-3 font-semibold">Sweet spot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-4 py-3 font-semibold text-olive-900">Annual revenue</td><td className="px-4 py-3 text-gray-700">$500K – $100MM+</td><td className="px-4 py-3 text-gray-700">$2MM – $50MM</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-olive-900">Deal size</td><td className="px-4 py-3 text-gray-700">$250K – $100MM+</td><td className="px-4 py-3 text-gray-700">$500K – $10MM</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-olive-900">Time in business</td><td className="px-4 py-3 text-gray-700">2+ years preferred</td><td className="px-4 py-3 text-gray-700">3+ years</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-olive-900">Why bank declined</td><td className="px-4 py-3 text-gray-700">Almost any credit-box reason</td><td className="px-4 py-3 text-gray-700">Thin DSCR, tax-return lag, leverage, industry concentration</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-olive-900">Customer type</td><td className="px-4 py-3 text-gray-700">B2B, B2G; some B2C with the right structure</td><td className="px-4 py-3 text-gray-700">B2B with strong commercial customers</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-olive-900">Industries</td><td className="px-4 py-3 text-gray-700">Most</td><td className="px-4 py-3 text-gray-700">Staffing, manufacturing, healthcare supply, gov contractors, construction, distribution</td></tr>
                </tbody>
              </table>
            </div>
            <Text className="text-gray-700">
              We can do meaningfully smaller and meaningfully larger than the sweet spot. We&apos;ve closed $250K factoring lines and $50MM ABL facilities in the same year. The sweet spot is just the range where the structural fit is cleanest and the timeline to bankability is most predictable.
            </Text>
          </div>
        </Container>
      </Section>

      {/* The arc — what happens after the referral */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              What happens after the referral
            </Heading>
            <ol className="space-y-6">
              <li>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center">1</div>
                  <div>
                    <Heading size="h4" className="mb-1 text-olive-900">Discovery call (20 minutes)</Heading>
                    <Text className="text-gray-700">We map the situation (collateral position, revenue trajectory, use of funds, timing) and identify which two or three products fit. If nothing fits, we say so on this call.</Text>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center">2</div>
                  <div>
                    <Heading size="h4" className="mb-1 text-olive-900">Diligence and lender shopping</Heading>
                    <Text className="text-gray-700">Serve Funding builds a data room with the client, shops the deal across the relevant subset of our extensive lender network, and returns with two or three real options, not just one quoted rate but actual term sheets the client can compare.</Text>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center">3</div>
                  <div>
                    <Heading size="h4" className="mb-1 text-olive-900">Delivery: closing the facility</Heading>
                    <Text className="text-gray-700">We negotiate terms on the client&apos;s behalf, coordinate underwriting, and guide closing. You&apos;re kept in the loop on closing timing and any material structural changes. We don&apos;t run separately from the banking relationship.</Text>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center">4</div>
                  <div>
                    <Heading size="h4" className="mb-1 text-olive-900">Ongoing advisory, and graduation back to the bank</Heading>
                    <Text className="text-gray-700">Most clients stay engaged with us through one or two refinances as the business matures. The endpoint of a well-built engagement is often a hand-back to the original banker once the financials qualify for a bank line again, typically 12 to 36 months depending on what got them declined in the first place.</Text>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center">5</div>
                  <div>
                    <Heading size="h4" className="mb-1 text-olive-900">The warm hand-back to your credit team</Heading>
                    <Text className="text-gray-700">When a client looks ready for bank credit again, we reach back out to you with where the business stands, so your credit team can pick the conversation up cleanly. You decide whether and when to reopen it. And if we can&apos;t place a deal you referred, we&apos;ll tell you that too, so you know where your client landed.</Text>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </Container>
      </Section>

      {/* Quote — Michael on time */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
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

      {/* What to say to your client */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              What to say to your client{' '}<br className="hidden md:inline" />
              when you make the referral
            </Heading>
            <Text className="text-gray-700 mb-6">
              You know your client better than we do. The framing below is just a starting point. Adapt it to how the two of you actually talk.
            </Text>
            <Card padding="md" noHover className="border-l-4 border-l-olive-500">
              <Text className="text-gray-800 italic">
                &ldquo;Our credit team can&apos;t get this done in our box — it&apos;s a structural fit issue, not a question of whether your business is sound. I want to introduce you to a financing advisory we&apos;ve worked with before. They&apos;re channel-neutral and they shop deals across a wide network of alternative lenders to find what actually fits. They don&apos;t take deposits, so your accounts stay with us. They&apos;re straight with people: if they can&apos;t help, they&apos;ll tell you on the first call. It&apos;s about 20 minutes. Here&apos;s the link.&rdquo;
              </Text>
            </Card>
            <Text size="sm" className="text-gray-500 mt-4">
              Direct link to share: <code className="bg-gray-100 px-2 py-1 rounded">servefunding.com/discover</code>
            </Text>
          </div>
        </Container>
      </Section>

      {/* FAQ — uses the site's standard accordion + auto-emits FAQPage schema */}
      <FAQSectionWithSchema
        title="Banker FAQ"
        description="The questions referring bankers ask before sending the first client."
        faqs={bankerFaqs}
        background="white"
        schemaName="Serve Funding Banker Referral"
      />

      {/* Useful links for bankers */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading size="h2" className="mb-6 text-olive-900">
              Useful links to send your clients
            </Heading>
            <Text className="text-gray-700 mb-6">
              The content on this site is built so you can send a client straight to the page that matches their situation. A few starting points:
            </Text>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/solutions/compare" className="block">
                <Card padding="sm">
                  <div className="font-semibold text-olive-900 mb-1">All 12 funding solutions compared</div>
                  <Text size="sm" className="text-gray-600">For clients who want to see the full menu first.</Text>
                </Card>
              </Link>
              <Link href="/compare" className="block">
                <Card padding="sm">
                  <div className="font-semibold text-olive-900 mb-1">Head-to-head comparisons</div>
                  <Text size="sm" className="text-gray-600">For clients weighing two specific products.</Text>
                </Card>
              </Link>
              <Link href="/industries" className="block">
                <Card padding="sm">
                  <div className="font-semibold text-olive-900 mb-1">Industry-specific guides</div>
                  <Text size="sm" className="text-gray-600">Send a manufacturing or staffing client straight to their industry page.</Text>
                </Card>
              </Link>
              <Link href="/blog/the-two-underwriting-buckets" className="block">
                <Card padding="sm">
                  <div className="font-semibold text-olive-900 mb-1">The Two Underwriting Buckets</div>
                  <Text size="sm" className="text-gray-600">For clients who need a conceptual frame before our call.</Text>
                </Card>
              </Link>
              <Link href="/blog/mca-vs-revenue-based-financing" className="block">
                <Card padding="sm">
                  <div className="font-semibold text-olive-900 mb-1">MCA vs Revenue-Based Financing</div>
                  <Text size="sm" className="text-gray-600">For clients already in stacked MCAs: the consolidation arc.</Text>
                </Card>
              </Link>
              <Link href="/glossary" className="block">
                <Card padding="sm">
                  <div className="font-semibold text-olive-900 mb-1">Glossary</div>
                  <Text size="sm" className="text-gray-600">33 plain-English definitions of terms your client might encounter on a term sheet.</Text>
                </Card>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="background">
        <Container>
          <FadeIn className="text-center">
            <Heading size="h2">Ready to make the introduction?</Heading>
            <Text size="2xl" className="mt-4 text-gray-600 max-w-2xl mx-auto mb-8">
              Open a pre-drafted intro email in your own client. Edit it however you like. We just wanted to take the blank-page problem off your plate.
            </Text>
            <a href={INTRO_MAILTO}>
              <Button variant="default" size="lg">
                Draft the Intro Email
              </Button>
            </a>
            <Text size="sm" className="mt-4 text-gray-500">
              Or send your client straight to{' '}
              <Link href="/discover" className="underline hover:no-underline">
                servefunding.com/discover
              </Link>
              .
            </Text>
          </FadeIn>
        </Container>
      </Section>
    </>
  )
}
