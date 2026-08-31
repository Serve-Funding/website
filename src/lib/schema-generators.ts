/**
 * SCHEMA MARKUP GENERATORS
 *
 * Reusable functions to generate JSON-LD schema markup for various content types.
 * These improve AI visibility and structured data understanding.
 *
 * Used for: SEO, Featured Snippets, Google Rich Results, LLM training data
 */

import { ReactNode } from 'react'
import { getTitleAsString } from '@/lib/solution-helpers'
import { companyInfo } from '@/data/company-info'
import { fundingSolutions } from '@/data/solutions'

// ============================================================================
// ORGANIZATION SCHEMA (Global - Add to Layout)
// ============================================================================

export const getOrganizationSchema = (config?: {
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}) => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "FinancialService"],
  "@id": "https://servefunding.com",
  "name": companyInfo.name,
  "description": companyInfo.description,
  "url": "https://servefunding.com",
  "telephone": companyInfo.contact.phone,
  "email": companyInfo.contact.email,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": companyInfo.contact.address.street,
    "addressLocality": companyInfo.contact.address.city,
    "addressRegion": companyInfo.contact.address.state,
    "postalCode": companyInfo.contact.address.zip,
    "addressCountry": companyInfo.contact.address.country
  },
  "areaServed": {
    "@type": "Country",
    "name": "USA"
  },
  "foundingDate": `${companyInfo.founded.year}`,
  "founder": {
    "@type": "Person",
    "name": "Michael Kodinsky",
    "jobTitle": "Founder & CEO",
    "sameAs": "https://www.linkedin.com/in/michael-kodinsky/"
  },
  "knowsAbout": fundingSolutions.map(solution => getTitleAsString(solution.title)),
  "sameAs": [
    "https://www.linkedin.com/in/michael-kodinsky/"
  ],
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", ".speakable", "[data-speakable]"]
  },
  ...(config?.aggregateRating && {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": config.aggregateRating.ratingValue,
      "reviewCount": config.aggregateRating.reviewCount
    }
  })
})

// ============================================================================
// WEBSITE SCHEMA (Global - Add to Layout)
// ============================================================================

export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://servefunding.com#website",
  "name": companyInfo.name,
  "url": "https://servefunding.com",
  "publisher": { "@id": "https://servefunding.com" },
  "inLanguage": "en-US"
})

// ============================================================================
// FINANCIAL SERVICE SCHEMA (For each funding solution)
// ============================================================================

export const getFinancialServiceSchema = (service: {
  id: string
  title: string
  shortDesc: string
  fullDesc: string
  features: string[]
  /** Canonical URL. Defaults to the /solutions page for this id. */
  url?: string
  ratesAndTerms?: {
    minAmount?: string
    maxAmount?: string
    interestRate?: string
    closingTime?: string
  }
}) => ({
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "@id": `https://servefunding.com#${service.id}`,
  "name": service.title,
  "url": service.url ?? `https://servefunding.com/solutions/${service.id}`,
  "description": service.fullDesc,
  "areaServed": {
    "@type": "Country",
    "name": "USA"
  },
  "provider": {
    "@type": "Organization",
    "@id": "https://servefunding.com",
    "name": companyInfo.name,
    "url": "https://servefunding.com"
  },
  "telephone": companyInfo.contact.phone,
  "email": companyInfo.contact.email,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": companyInfo.contact.address.street,
    "addressLocality": companyInfo.contact.address.city,
    "addressRegion": companyInfo.contact.address.state,
    "postalCode": companyInfo.contact.address.zip,
    "addressCountry": companyInfo.contact.address.country
  },
  ...(service.ratesAndTerms && {
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      ...(service.ratesAndTerms.minAmount && {
        "price": `${service.ratesAndTerms.minAmount} - ${service.ratesAndTerms.maxAmount}`
      }),
      ...(service.ratesAndTerms.interestRate && {
        "eligibleQuantity": service.ratesAndTerms.interestRate
      })
    }
  })
})

// ============================================================================
// WEBPAGE SCHEMA
// ============================================================================

/**
 * Per-page WebPage node, carrying the freshness signal.
 *
 * Assistants weigh how recently a page was updated when deciding what to cite,
 * and until now only blog posts emitted dateModified. Everything else asserted
 * nothing about its own age. Dates come from src/data/last-updated.generated.ts,
 * which is derived from git rather than hand-maintained.
 */
export const getWebPageSchema = (page: {
  url: string
  name: string
  description?: string
  /** ISO date. Use lastUpdated() from src/data/last-updated.generated.ts. */
  dateModified: string
  datePublished?: string
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${page.url}#webpage`,
  "url": page.url,
  "name": page.name,
  ...(page.description && { "description": page.description }),
  "dateModified": page.dateModified,
  ...(page.datePublished && { "datePublished": page.datePublished }),
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://servefunding.com#website"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://servefunding.com"
  }
})

// ============================================================================
// FAQ PAGE SCHEMA
// ============================================================================

export const getFAQPageSchema = (faqs: Array<{
  question: string
  answer: string
}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  })),
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", ".faq-question", ".faq-answer"]
  }
})

// ============================================================================
// ARTICLE/BLOG POST SCHEMA
// ============================================================================

export const getArticleSchema = (article: {
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: {
    name: string
    url?: string
  }
  content: string
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": article.headline,
  "description": article.description,
  "image": article.image,
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "author": {
    "@type": "Person",
    "name": article.author?.name || "Serve Funding",
    ...(article.author?.url && { "url": article.author.url }),
    "jobTitle": "Founder & CEO, Serve Funding",
    "sameAs": "https://www.linkedin.com/in/michael-kodinsky/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Serve Funding",
    "url": "https://servefunding.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://servefunding.com/Logo_Full-color_long_samecolor-1.webp"
    }
  },
  "articleBody": article.content,
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", "h2", ".speakable", "[data-speakable]"]
  }
})

// ============================================================================
// BREADCRUMB SCHEMA (Navigation Context)
// ============================================================================

export const getBreadcrumbSchema = (items: Array<{
  name: string
  url: string
}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})

// ============================================================================
// PERSON SCHEMA (Founder/Team)
// ============================================================================

export const getPersonSchema = (person: {
  name: string
  jobTitle: string
  description: string
  linkedinUrl?: string
  image?: string
  education?: {
    school: string
    degree: string
  }
}) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": person.name,
  "jobTitle": person.jobTitle,
  "description": person.description,
  "image": person.image,
  ...(person.linkedinUrl && { "sameAs": [person.linkedinUrl] }),
  ...(person.education && {
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": person.education.school,
      "educationalCredentialAwarded": person.education.degree
    }
  })
})

// ============================================================================
// REVIEW/TESTIMONIAL SCHEMA (Case Studies)
// ============================================================================

export const getReviewSchema = (review: {
  companyName: string
  title: string
  description: string
  fullStory: string
  ratingValue?: number
  amount: string
}) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "FinancialService",
    "name": "Serve Funding"
  },
  "name": review.title,
  "reviewBody": `${review.description}\n\n${review.fullStory}`,
  "author": {
    "@type": "Organization",
    "name": review.companyName
  },
  ...(review.ratingValue && {
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.ratingValue,
      "bestRating": "5"
    }
  })
})

// ============================================================================
// AGGREGATE RATING SCHEMA (Overall Reputation)
// ============================================================================

export const getAggregateRatingSchema = (stats: {
  ratingValue: number
  reviewCount: number
  bestRating?: number
  worstRating?: number
}) => ({
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "ratingValue": stats.ratingValue,
  "reviewCount": stats.reviewCount,
  "bestRating": stats.bestRating || 5,
  "worstRating": stats.worstRating || 1
})

// ============================================================================
// HOW-TO SCHEMA (Process Steps)
// ============================================================================

export const getHowToSchema = (howTo: {
  name: string
  description: string
  image?: string
  steps: Array<{
    name: string
    description: string
    image?: string
  }>
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": howTo.name,
  "description": howTo.description,
  ...(howTo.image && { "image": howTo.image }),
  "step": howTo.steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.description,
    ...(step.image && { "image": step.image })
  }))
})

// ============================================================================
// COMPARISON SCHEMA (For comparison tables)
// ============================================================================

export const getComparisonSchema = (comparison: {
  title: string
  description: string
  items: Array<{
    name: string
    pros: string[]
    cons: string[]
  }>
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": comparison.title,
  "description": comparison.description,
  "articleBody": `Comparison of: ${comparison.items.map(i => i.name).join(", ")}`
})

// ============================================================================
// HELPER: Create Full Page Schema Bundle
// ============================================================================

export const getFullPageSchemaBundle = (config: {
  organizationData: any
  pageSchemas: any[]
  breadcrumbs?: any
}) => [
  config.organizationData,
  ...(config.breadcrumbs ? [config.breadcrumbs] : []),
  ...config.pageSchemas
]

// ============================================================================
// IMPLEMENTATION HELPERS
// ============================================================================

/**
 * Convert schema object to JSON string for script tag
 * Use in: <script dangerouslySetInnerHTML={{__html: schemaToScript(schema)}} />
 */
export const schemaToScript = (schema: any): string => {
  return JSON.stringify(schema, null, 2)
}

/**
 * Create script tag component data
 */
export const createSchemaScript = (schema: any) => ({
  type: "application/ld+json",
  dangerouslySetInnerHTML: {
    __html: schemaToScript(schema)
  }
})

export default {
  getOrganizationSchema,
  getWebSiteSchema,
  getFinancialServiceSchema,
  getWebPageSchema,
  getFAQPageSchema,
  getArticleSchema,
  getBreadcrumbSchema,
  getPersonSchema,
  getReviewSchema,
  getAggregateRatingSchema,
  getHowToSchema,
  getComparisonSchema,
  getFullPageSchemaBundle,
  schemaToScript,
  createSchemaScript
}
