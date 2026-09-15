import { ArrowRight, Calendar } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Section,
  Container,
  Heading,
  Text,
  Card,
  StaggerContainer,
  FadeIn,
  Button
} from '@/components/ui'
import { HeroFadeIn } from '@/components/hero-fade-in'
import { Breadcrumb } from '@/components/breadcrumb'
import { SchemaRenderer } from '@/components/SchemaRenderer'
import { getBlogPosts } from '@/lib/blog-utils'

const NEWSLETTER_CATEGORY = 'Creative Working Capital'

export const metadata: Metadata = {
  title: 'Creative Working Capital Newsletter | Serve Funding',
  description: 'Every issue of Creative Working Capital, Serve Funding\'s monthly newsletter: a memo from Michael, one real deal and the structure that made it work.',
  keywords: 'Creative Working Capital, Serve Funding newsletter, working capital case studies, alternative lending insights, Michael Kodinsky',
  alternates: { canonical: 'https://servefunding.com/newsletter' },
  openGraph: {
    title: 'Creative Working Capital Newsletter',
    description: 'Every issue of Serve Funding\'s monthly newsletter: a memo from Michael, one real deal and the structure that made it work, and the value behind it.',
    url: 'https://servefunding.com/newsletter',
    type: 'website',
    images: [
      {
        url: 'https://servefunding.com/newsletter-logo.webp',
        width: 1148,
        height: 429,
        alt: 'Creative Working Capital, the Serve Funding newsletter',
      },
    ],
  },
}

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate + 'T00:00:00Z')
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' })
}

const sections = [
  {
    title: "Michael's Memo",
    text: 'A short letter from our founder on one idea about capital that month: structure over rate, what an approval really means, when to wait.',
  },
  {
    title: 'Deal Highlight',
    text: 'One real transaction, anonymized: the business, the challenge, the structure that closed, and why it fit.',
  },
  {
    title: 'More Than Money',
    text: 'One of our core values and what it looked like in practice on that deal.',
  },
]

export default function NewsletterPage() {
  const issues = getBlogPosts()
    .filter((post) => post.category === NEWSLETTER_CATEGORY)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const years = Array.from(new Set(issues.map((post) => post.date.slice(0, 4))))

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Creative Working Capital Newsletter',
    description: 'Archive of Creative Working Capital, the Serve Funding monthly newsletter.',
    url: 'https://servefunding.com/newsletter',
    mainEntity: {
      '@type': 'Blog',
      name: 'Creative Working Capital',
      blogPosts: issues.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        url: `https://servefunding.com/blog/${post.id}`,
        datePublished: post.date,
        author: { '@type': 'Person', name: post.author },
      })),
    },
  }

  return (
    <>
      <SchemaRenderer schema={collectionSchema} />

      <Breadcrumb items={[{ label: 'Newsletter' }]} />

      <HeroFadeIn
        title="Creative Working Capital"
        subtitle={
          <>
            Our monthly newsletter, archived in full. One idea about capital, one real deal, and the value behind it.{' '}
            <Link href="#newsletter" className="underline hover:no-underline">
              Get the next issue by email
            </Link>
            .
          </>
        }
      />

      {/* What every issue contains */}
      <Section background="white">
        <Container>
          <FadeIn className="text-center mb-10">
            <Heading size="h2">What&apos;s in every issue</Heading>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {sections.map((section) => (
              <Card key={section.title} padding="md">
                <Heading size="h3" className="mb-3 text-olive-900">{section.title}</Heading>
                <Text className="text-gray-600 text-sm leading-relaxed">{section.text}</Text>
              </Card>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Issues, newest first, grouped by year */}
      <Section background="gray">
        <Container>
          {issues.length === 0 ? (
            <Text className="text-center text-gray-600">The first archived issue is on its way.</Text>
          ) : (
            years.map((year) => {
              const yearIssues = issues.filter((post) => post.date.startsWith(year))
              return (
                <div key={year} className="mb-16 last:mb-0">
                  <FadeIn className="mb-8">
                    <Heading size="h2" className="text-olive-900">{year}</Heading>
                  </FadeIn>
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {yearIssues.map((post) => (
                      <Link key={post.id} href={`/blog/${post.id}`}>
                        <Card className="cursor-pointer group h-full">
                          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                            <Calendar size={16} className="text-gold-500" />
                            <span>{formatDate(post.date)} issue</span>
                          </div>
                          <Heading size="h3" className="mb-2 text-olive-900 group-hover:text-gold-500 transition-colors">
                            {post.title}
                          </Heading>
                          <Text className="text-gray-600 text-sm mb-4">
                            {post.subtitle}
                          </Text>
                          <Text className="text-gray-700 mb-6 flex-1 leading-relaxed">
                            {post.excerpt}
                          </Text>
                          <Button variant="link" className="text-gold-500 hover:text-gold-600 p-0 flex items-center gap-2 w-fit">
                            Read the issue <ArrowRight size={16} />
                          </Button>
                        </Card>
                      </Link>
                    ))}
                  </StaggerContainer>
                </div>
              )
            })
          )}
        </Container>
      </Section>
    </>
  )
}
