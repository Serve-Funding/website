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
import { SchemaRenderer } from '@/components/SchemaRenderer'
import { CTA } from '@/components/cta'
import { glossaryTerms, getTermsByCategory } from '@/data/glossary'

export const metadata: Metadata = {
  title: 'Business Financing Glossary | Serve Funding',
  description:
    'Plain-English definitions of business financing terms: factor rate, lockbox, ABL, MCA, recourse, UCC-1, holdback, and more. Updated for 2026.',
  alternates: { canonical: 'https://servefunding.com/glossary' },
  openGraph: {
    title: 'Business Financing Glossary',
    description:
      'Plain-English definitions of business financing terms: factor rate, lockbox, ABL, MCA, recourse, and more.',
    url: 'https://servefunding.com/glossary',
    siteName: 'Serve Funding',
    type: 'article',
    images: [
      {
        url: 'https://servefunding.com/Logo_Full-color_long_samecolor-1.webp',
        width: 1024,
        height: 728,
        alt: 'Business Financing Glossary',
      },
    ],
  },
}

// DefinedTerm schema for each glossary entry — citation-bait for "what is X" queries.
const definedTermSchemas = glossaryTerms.map(t => ({
  '@context': 'https://schema.org',
  '@type': 'DefinedTerm',
  '@id': `https://servefunding.com/glossary#${t.slug}`,
  name: t.term,
  description: t.shortDefinition,
  inDefinedTermSet: {
    '@type': 'DefinedTermSet',
    '@id': 'https://servefunding.com/glossary',
    name: 'Serve Funding Business Financing Glossary',
  },
}))

const definedTermSetSchema = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  '@id': 'https://servefunding.com/glossary',
  name: 'Serve Funding Business Financing Glossary',
  description:
    'Plain-English definitions of business financing terms, updated for 2026.',
  hasDefinedTerm: glossaryTerms.map(t => ({
    '@type': 'DefinedTerm',
    '@id': `https://servefunding.com/glossary#${t.slug}`,
    name: t.term,
    description: t.shortDefinition,
  })),
}

const CATEGORY_ORDER = [
  'Foundational',
  'Products',
  'Pricing & Math',
  'Process & Documents',
  'Industry-Specific',
  'Serve Funding Framework',
]

export default function GlossaryPage() {
  const byCategory = getTermsByCategory()

  return (
    <>
      <SchemaRenderer schema={definedTermSetSchema} />
      {definedTermSchemas.map((s, i) => (
        <SchemaRenderer key={i} schema={s} />
      ))}

      <Breadcrumb items={[{ label: 'Glossary' }]} />

      <Section className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <FadeIn className="max-w-3xl mx-auto text-center">
            <Heading size="h1" className="mb-4 text-olive-900">
              Business Financing Glossary
            </Heading>
            <Text size="2xl" className="text-gray-700 mb-3">
              {glossaryTerms.length} terms, defined the way we explain them on a discovery call.
            </Text>
            <Text className="text-gray-600">
              Plain English, no textbook prose, with the analogies Michael Kodinsky uses
              when he&apos;s explaining these on a real call. Use the categories below to
              navigate or search the page.
            </Text>
          </FadeIn>
        </Container>
      </Section>

      {/* Category navigation */}
      <Section className="py-6 bg-white border-b border-gray-200">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-wrap gap-3 justify-center">
            {CATEGORY_ORDER.filter(cat => byCategory[cat]?.length).map(cat => (
              <a
                key={cat}
                href={`#${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gold-500 hover:text-white transition-colors text-sm font-medium text-olive-900"
              >
                {cat} ({byCategory[cat].length})
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* Terms by category */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto space-y-16">
            {CATEGORY_ORDER.filter(cat => byCategory[cat]?.length).map(cat => (
              <div
                key={cat}
                id={cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                className="scroll-mt-32"
              >
                <Heading size="h2" className="mb-6 text-olive-900">
                  {cat}
                </Heading>
                <div className="space-y-8">
                  {byCategory[cat].map(term => (
                    <article
                      key={term.slug}
                      id={term.slug}
                      className="scroll-mt-32 border-b border-gray-200 pb-8 last:border-b-0"
                    >
                      <Heading size="h3" className="mb-2 text-olive-900">
                        {term.term}
                      </Heading>
                      <Text className="text-gray-700 mb-3 font-semibold">
                        {term.shortDefinition}
                      </Text>
                      <Text className="text-gray-700 mb-4 whitespace-pre-line">
                        {term.fullExplanation}
                      </Text>
                      {term.example && (
                        <Card padding="sm" noHover className="mb-4 bg-gold-50 border-l-4 border-l-gold-500">
                          <Text size="sm" className="text-gray-800">
                            <strong>Example:</strong> {term.example}
                          </Text>
                        </Card>
                      )}
                      {(term.relatedTerms?.length || term.relatedSolutions?.length) && (
                        <div className="flex flex-wrap gap-2 text-sm">
                          {term.relatedTerms?.map(slug => (
                            <a
                              key={slug}
                              href={`#${slug}`}
                              className="text-gold-500 hover:underline"
                            >
                              {slug.replace(/-/g, ' ')}
                            </a>
                          ))}
                          {term.relatedSolutions?.map(sid => (
                            <Link
                              key={sid}
                              href={`/solutions/${sid}`}
                              className="text-olive-700 hover:underline"
                            >
                              → {sid.replace(/-/g, ' ')}
                            </Link>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CTA
        title="Stuck on a term that isn't here?"
        text="A 20-minute call: we'll explain it plainly, and tell you whether it actually matters for your situation."
        buttonText="Start a Conversation"
        useBG
      />
    </>
  )
}
