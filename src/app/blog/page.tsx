import { ArrowRight, Calendar } from 'lucide-react'
import type { Metadata } from 'next'
import {
  Section,
  Container,
  Heading,
  Text,
  Card,
  StaggerContainer,
  Button
} from '@/components/ui'
import { HeroFadeIn } from '@/components/hero-fade-in'
import { CTA } from '@/components/cta'
import { Breadcrumb } from '@/components/breadcrumb'
import { SchemaRenderer } from '@/components/SchemaRenderer'
import { getBlogPosts } from '@/lib/blog-utils'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Business Growth Funding When Banks Decline | Serve Funding',
  description: 'Learn alternative lending strategies when banks decline. Real funding case studies, working capital solutions & expert guides.',
  keywords: 'business funding, alternative lending, working capital strategies, case studies, when banks decline, growth funding',
  alternates: { canonical: 'https://servefunding.com/blog' },
  openGraph: {
    title: 'Business Growth Funding When Banks Decline',
    description: 'See how real businesses secured funding in 3-10 days when banks declined. Learn alternative lending strategies, explore case studies, and discover creative working capital solutions.',
    url: 'https://servefunding.com/blog',
    type: 'website',
    images: [
      {
        url: "https://servefunding.com/Logo_Full-color_long_samecolor-1.webp",
        width: 1024,
        height: 728,
        alt: "Serve Funding Blog - Funding Strategies for Growing Businesses",
      },
    ],
  },
}

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate + 'T00:00:00Z')
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPage() {
  const blogPosts = getBlogPosts()
  const sortedPosts = [...blogPosts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // Blog collection schema
  const blogCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Serve Funding Blog",
    "description": "Insights, case studies, and financing guides for growing businesses",
    "url": "https://servefunding.com/blog",
    "mainEntity": {
      "@type": "Blog",
      "name": "Serve Funding Blog",
      "blogPosts": sortedPosts.map(post => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "url": `https://servefunding.com/blog/${post.id}`,
        "datePublished": post.date,
        "author": {
          "@type": "Person",
          "name": post.author
        }
      }))
    }
  }

  return (
    <>
      {/* Schema Markup */}
      <SchemaRenderer schema={blogCollectionSchema} />

      {/* Breadcrumb - includes schema */}
      <Breadcrumb items={[{ label: 'Blog' }]} />

      {/* Hero Section */}
      <HeroFadeIn
        title="Serve Funding Blog"
        subtitle="Insights on working capital financing, business growth strategies, and alternative lending for entrepreneurs and business leaders."
      />

      {/* Blog Posts List */}
      <Section background="white">
        <Container>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="cursor-pointer group">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <Calendar size={16} className="text-gold-500" />
                    <span>{formatDate(post.date)}</span>
                  </div>

                  <span className="inline-block mb-4 px-3 py-1 bg-gold-100 text-gold-700 text-xs font-semibold rounded-full w-fit">
                    {post.category}
                  </span>

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
                    Read More <ArrowRight size={16} />
                  </Button>
                </Card>
              </Link>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* CTA Section */}
      <CTA
        title="Ready to explore your financing options?"
        text="Let's discuss how we can help your business grow with the right working capital solution."
        buttonText="Start Your Consultation"
        useBG={true}
      />
    </>
  )
}
