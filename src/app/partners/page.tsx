import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Quote
} from 'lucide-react'
import {
  Section,
  Container,
  Heading,
  Text,
  Card,
  FadeIn,
  StaggerContainer,
  Button
} from '@/components/ui'
import { COLORS } from '@/lib/colors'
import { FeatureList } from '@/components/FeatureList'
import { HeroFadeIn } from '@/components/hero-fade-in'
import { CTA } from '@/components/cta'
import { Breadcrumb } from '@/components/breadcrumb'
import { partnerTypes, commitments, testimonials } from '@/data/partners'

export const metadata: Metadata = {
  title: 'Partner With Serve Funding | Bankers, CPAs, CFOs & Advisors',
  description: 'Partner with Serve Funding to offer your clients $250K-$100MM in alternative funding. Built for commercial bankers, CPAs, CFOs, and advisors.',
  keywords: 'partner with us, commercial bankers, fractional CFO, investment bankers, referral partnership, business advisors',
  alternates: { canonical: 'https://servefunding.com/partners' },
  openGraph: {
    title: 'Partner With Serve Funding | Bankers, CPAs, CFOs & Advisors',
    description: 'Grow your practice by partnering with Serve Funding. Offer your clients access to $250K-$100MM in alternative funding solutions. For bankers, CPAs, CFOs, and advisors.',
    url: 'https://servefunding.com/partners',
    type: 'website',
    images: [
      {
        url: "https://servefunding.com/partners/Trust.webp",
        width: 1024,
        height: 728,
        alt: "Partnership Opportunities",
      },
    ],
  },
}

export default function Partners() {
  return (
    <>
      {/* Breadcrumb - includes schema */}
      <Breadcrumb items={[{ label: 'Partners' }]} />

      {/* Hero Section */}
      <HeroFadeIn
        title="Our Trusted Partners"
        subtitle={<>Serve Funding Partners with Commercial Bankers, CPA's,<br />Fractional CFO's, Investment Bankers, and Business Advisors.<br />Help Your Clients Access Funding Solutions from $250K to $100MM.</>}
      />

      {/* Discuss Funding Needs CTA */}
      <Section background="gray">
        <Container>
          <FadeIn className="text-center max-w-3xl mx-auto">
            <Heading size="h2" className="mb-8">
              Let&apos;s Discuss Your Client&apos;s or Prospect&apos;s Funding Needs.
            </Heading>
            <Text className="max-w-xl mx-auto my-6">
              Answer a few questions and schedule a call at your convenience. <br /> Takes a few minutes and there&apos;s no obligation.
            </Text>
            <Link href="/discover?role=partner">
              <Button variant="default" size="lg">
                Discuss a Client&apos;s Funding Needs
              </Button>
            </Link>
            <Text size="sm" className="mt-6 text-gray-600">
              Commercial bankers — see the{' '}
              <Link href="/bankers" className="text-gold-500 hover:underline font-semibold">
                Bankers
              </Link>
              {' '}page for how the referral works, what happens to your client after the hand-off, and the depository-relationship protections.
            </Text>
          </FadeIn>
        </Container>
      </Section>

      {/* The Problem We Solve */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <Heading size="h2">
                The Referral Challenge
              </Heading>
            </FadeIn>

            <StaggerContainer className="space-y-6">
              <Card noHover>
                <Heading size="h3" className="text-olive-900 mb-3">You are the Hero in Their Story</Heading>
                <Text className="text-gray-700 leading-relaxed">
                  When we come through for your prospect, they remember that you went out of your way. They see you as the banker or advisor who didn't give up, who found a solution. They often come back to you as a stronger, more loyal client. When we solve for your existing clients, you strengthen that relationship by being the one who delivered. Either way—you've deepened trust, enhanced your reputation, and positioned yourself as the trusted advisor your clients can count on.
                </Text>
              </Card>

              <Card noHover>
                <Heading size="h3" className="text-olive-900 mb-3">Time Wasted, Credibility Lost</Heading>
                <Text className="text-gray-700 leading-relaxed">
                  You refer a prospect or client to an alternative lender. They go down the road. Two to four weeks of underwriting pass. Then the lender hits a wall—maybe it's a customer contract clause that makes the deal impossible, maybe it's collateral issues, maybe the leverage doesn't work. The business owner gets turned down. Again. Meanwhile, weeks have passed, their opportunity window is closing, and your credibility takes a hit for the referral that didn't work out.
                </Text>
              </Card>

              <Card noHover>
                <Heading size="h3" className="text-olive-900 mb-3">If There's a Way, We'll Find It</Heading>
                <Text className="text-gray-700 leading-relaxed">
                  Here's our commitment: if there's a way to get it done, we will find a way. We're not locked into one product or one box. We can layer solutions. We can look at multiple lenders at once. We can use real estate, equipment, personal assets, cash flow—whatever combination works. The only time we can't help is if expectations are just unrealistic. But as long as there's something viable to build on, we'll sweep the corners of the known credit universe to find it. That's how we protect your reputation.
                </Text>
              </Card>
            </StaggerContainer>
          </div>
        </Container>
      </Section>

      {/* Partnership Overview */}
      <Section background='gray'>
        <Container>
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <Heading size="h2" className="mb-6 text-olive-900">
              Why Partner With Us
            </Heading>
            <Text size="2xl" className="text-gray-700 mb-4">
              We value our trusted network. Partnering with Serve Funding means you're working with a committed team that understands the importance of your reputation with every referral.
            </Text>
          </FadeIn>

          <FadeIn className='max-w-5xl mx-auto'>
            <Card>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left: Text Content */}
                <div>
                  <Heading size="h3" className="mb-4 text-olive-900">
                    The Importance of Trust: Your Reputation Matters
                  </Heading>
                  <Text className="text-gray-700">
                    We get it—when a banker declines credit and wants to refer a client to an alternative funding solution, they need assurance that their client is in trusted hands. By referring your clients and prospects to Serve Funding, you're introducing them to a trusted advisor who prioritizes their best interests.
                  </Text>
                </div>

                {/* Right: Trust Image */}
                <div className="relative h-96 rounded-2xl overflow-hidden">
                  <Image
                    src="/partners/Trust.webp"
                    alt="Trust"
                    width={1024}
                    height={889}
                    className="w-full h-full object-cover rounded-2xl"
                    priority={false}
                  />
                </div>
              </div>
            </Card>
          </FadeIn>
        </Container>
      </Section>

      {/* Our Commitment */}
      <Section>
        <Container>
          <FadeIn className="text-center mb-16">
            <Heading size="h2" className="mb-6 text-olive-900">
              Our Commitment to You
            </Heading>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {commitments.map((commitment, idx) => (
              <Card
                key={idx}
                color='background'
                className="h-full"
                hoverColor={COLORS.secondary}
              >
                <Heading size="h4" className="mb-3 transition-colors" style={{ color: COLORS.primary }}>
                  {commitment.title}
                </Heading>
                <Text className="transition-colors" color="dark">
                  {commitment.desc}
                </Text>
              </Card>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section background="background">
        <Container>
          <FadeIn className="text-center mb-16">
            <Heading size="h2" className="text-olive-900">
              Feedback From Our Partners
            </Heading>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="group">
                <Quote className="mb-4" size={32} style={{ color: COLORS.secondary }} />
                <Text className="text-gray-700 mb-6 italic leading-relaxed flex-1">
                  "{testimonial.text}"
                </Text>
                <Text className="text-olive-900 font-semibold">
                  — {testimonial.author}
                </Text>
              </Card>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Partner Types */}
      <div className='mt-28 mb-12'>
        {partnerTypes.map((partner, idx) => {
              // Create ID from partner title
              const partnerId = partner.title.toLowerCase().replace(/[\s/&]/g, '-')
              return (
                <Section key={idx} id={partnerId}>
                  <Container>
                    <div className={`flex flex-col lg:flex-row gap-12 w-full lg:items-stretch ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Text Content */}
                    <div className={`lg:w-2/3 ${idx % 2 === 1 ? 'lg:[direction:ltr]' : ''}`}>
                      <Heading size="h2">
                        <span className="text-olive-900">{partner.title.split(' ').slice(0, -1).join(' ')}</span>
                        {partner.title.split(' ').length > 1 && <span className="text-gold-500"> {partner.title.split(' ').slice(-1)[0]}</span>}
                      </Heading>

                      <Text className="text-gray-700 mb-6 leading-relaxed text-lg">
                        {partner.description}
                      </Text>

                      <FeatureList features={partner.benefits} />
                    </div>

                    {/* Image Content */}
                    <div className={`relative h-auto rounded-3xl overflow-hidden group m-4 lg:m-0 lg:mt-20 lg:flex-shrink-0 lg:w-1/3`}>
                      <Image
                        src={partner.image}
                        alt={partner.title}
                        width={partner.imageWidth}
                        height={partner.imageHeight}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-olive-900/40 to-transparent"></div>
                    </div>
                  </div>
                  </Container>
                </Section>
              )
            })}
      </div>

      <CTA
        title="Have a Client in Need of Financing?"
        text={<>Answer a few questions and schedule a call at your convenience.<br />Takes a few minutes and there's no obligation.</>}
        buttonText="Discuss a Client's Funding Needs"
        href="/discover?role=partner"
        useBG
      />
    </>
  )
}
