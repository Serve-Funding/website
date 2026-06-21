import Markdoc from '@markdoc/markdoc'
import {
  Section,
  Container,
  Heading,
  Text,
  FadeIn,
  Card
} from '@/components/ui'
import { BlogHeroFadeIn } from '@/components/blog-hero-fade-in'
import { Breadcrumb } from '@/components/breadcrumb'
import { CTA } from '@/components/cta'
import { SchemaRenderer } from '@/components/SchemaRenderer'
import { SocialShareButtons } from '@/components/SocialShareButtons'
import { getArticleSchema } from '@/lib/schema-generators'
import { getBlogPost, getBlogPostIds, isPostPublished } from '@/lib/blog-utils'
import { fundingSolutions } from '@/data/solutions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { renderMarkdoc } from '@/markdoc/renderer'
import { config } from '@/markdoc/config'

interface Props {
  params: Promise<{
    'blog-id': string
  }>
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const postIds = getBlogPostIds()
  return postIds.map((id) => ({
    'blog-id': id,
  }))
}

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Strip Markdoc/markdown to plain text so the BlogPosting schema's articleBody
// carries the real article (tables, stats, worked examples) AI engines extract,
// not just the one-sentence excerpt.
const toPlainText = (markdown: string): string =>
  markdown
    .replace(/\{%[\s\S]*?%\}/g, ' ')         // markdoc tags
    .replace(/```[\s\S]*?```/g, ' ')          // code fences
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')    // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')  // links -> anchor text
    .replace(/[#>*_`|]/g, ' ')                // markdown symbols
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000)

export async function generateMetadata({ params }: Props) {
  const { 'blog-id': blogId } = await params
  const blogPost = getBlogPost(blogId)

  if (!blogPost || !isPostPublished(blogPost.date)) {
    return {
      title: 'Blog Post Not Found'
    }
  }

  // Use blog post image if available, fallback to logo
  const imageUrl = blogPost.image
    ? `https://servefunding.com${blogPost.image}`
    : "https://servefunding.com/Logo_Full-color_long_samecolor-1.webp"

  return {
    title: `${blogPost.title} | Serve Funding`,
    description: blogPost.excerpt,
    alternates: { canonical: `https://servefunding.com/blog/${blogPost.id}` },
    openGraph: {
      title: blogPost.title,
      description: blogPost.excerpt,
      url: `https://servefunding.com/blog/${blogPost.id}`,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1024,
          height: 728,
          alt: blogPost.title,
        },
      ],
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { 'blog-id': blogId } = await params
  const blogPost = getBlogPost(blogId)

  if (!blogPost || !isPostPublished(blogPost.date)) {
    notFound()
  }

  const formattedDate = formatDate(blogPost.date)
  const formattedLastUpdated = blogPost.lastUpdated ? formatDate(blogPost.lastUpdated) : null

  // Parse markdown content
  const ast = Markdoc.parse(blogPost.content)
  const transformed = Markdoc.transform(ast, config)

  // Generate article schema
  const articleSchema = getArticleSchema({
    headline: blogPost.title,
    description: blogPost.excerpt,
    datePublished: blogPost.date,
    dateModified: blogPost.lastUpdated || blogPost.date,
    image: blogPost.image ? `https://servefunding.com${blogPost.image}` : undefined,
    author: {
      name: blogPost.author,
      url: 'https://servefunding.com/about-us'
    },
    content: toPlainText(blogPost.content)
  })

  return (
    <>
      {/* Schema Markup */}
      <SchemaRenderer schema={articleSchema} />

      {/* Breadcrumb - includes schema */}
      <Breadcrumb items={[
        { label: 'Blog', href: '/blog' },
        { label: blogPost.title }
      ]} />

      {/* Hero Section */}
      <BlogHeroFadeIn
        title={blogPost.title}
        subtitle={blogPost.subtitle}
        date={formattedDate}
        author={blogPost.author}
        authorTitle="Founder & CEO"
        authorPhoto="/Michael Headshot.webp"
        category={blogPost.category}
        backgroundImage={blogPost.image}
      />

      {/* Main Article Content */}
      <Section background="white">
        <Container>
          <FadeIn className="max-w-3xl mx-auto">
            {renderMarkdoc(transformed)}

            {/* Last Updated indicator for freshness signals */}
            {formattedLastUpdated && (
              <div className="mt-8 pt-4 border-t border-gray-200">
                <Text size="sm" className="text-gray-500">
                  Last updated: {formattedLastUpdated}
                </Text>
              </div>
            )}
          </FadeIn>

          {/* Social Share Buttons */}
          <SocialShareButtons
            title={blogPost.title}
            excerpt={blogPost.excerpt}
            url={`https://servefunding.com/blog/${blogPost.id}`}
          />
        </Container>
      </Section>

      {/* Related Solutions Section */}
      {blogPost.relatedSolutions && blogPost.relatedSolutions.length > 0 && (
        <Section background="white">
          <Container>
            <FadeIn className="text-center mb-12">
              <Heading size="h2" className="mb-4">Related Funding Solutions</Heading>
              <Text size="lg" className="text-gray-700 mb-8 max-w-2xl mx-auto">
                Explore the funding solutions mentioned above.
              </Text>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {blogPost.relatedSolutions.map((solutionId) => {
                const solution = fundingSolutions.find(s => s.id === solutionId)
                return solution ? (
                  <Link key={solutionId} href={`/solutions/${solutionId}`} className="group">
                    <Card padding="md">
                      <Heading size="h3" className="mb-3 text-olive-900 group-hover:text-gold-500 transition-colors">
                        {solution.title}
                      </Heading>
                      <Text className="text-gray-600 text-sm mb-4">
                        {solution.shortDesc}
                      </Text>
                      <div className="text-gold-500 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Learn More <ChevronRight size={16} />
                      </div>
                    </Card>
                  </Link>
                ) : null
              })}
            </div>
          </Container>
        </Section>
      )}

      <CTA
        title="Ready to explore your financing options?"
        text="Let's discuss how we can help your business grow with the right working capital solution."
        buttonText="Get in Touch"
        useBG={true}
      />
    </>
  )
}
