import { MetadataRoute } from 'next'
import { fundingSolutions } from '@/data/solutions'
import { comparisons } from '@/data/comparisons'
import { industries } from '@/data/industries'
import { fundingPages } from '@/data/funding-pages'
import { getBlogPosts } from '@/lib/blog-utils'

// Stable build-time date for static routes — using `new Date()` per-route makes
// every URL look freshly updated to crawlers, which is noise, not signal.
// Bump this when you ship a meaningful redesign or content sweep of static pages.
const STATIC_PAGES_LAST_REVIEWED = new Date('2026-05-27T00:00:00Z')

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://servefunding.com'

  const routes = [
    '',
    '/about-us',
    '/solutions',
    '/solutions/compare',
    '/compare',
    '/industries',
    '/funding',
    '/glossary',
    '/fundings',
    '/partners',
    '/bankers',
    '/discover',
    '/faq',
    '/blog',
    '/privacy-policy',
    '/sms-terms',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: STATIC_PAGES_LAST_REVIEWED,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const solutionRoutes = fundingSolutions.map((solution) => ({
    url: `${baseUrl}/solutions/${solution.id}`,
    lastModified: STATIC_PAGES_LAST_REVIEWED,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const comparisonRoutes = comparisons.map((c) => ({
    url: `${baseUrl}/compare/${c.id}`,
    lastModified: STATIC_PAGES_LAST_REVIEWED,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  const industryRoutes = industries.map((ind) => ({
    url: `${baseUrl}/industries/${ind.id}`,
    lastModified: STATIC_PAGES_LAST_REVIEWED,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  // Problem pages carry the paid-search traffic; priority sits with the solution pages.
  const fundingRoutes = fundingPages.map((p) => ({
    url: `${baseUrl}/funding/${p.id}`,
    lastModified: STATIC_PAGES_LAST_REVIEWED,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const blogPosts = getBlogPosts()
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date((post.lastUpdated || post.date) + 'T00:00:00Z'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...routes,
    ...solutionRoutes,
    ...comparisonRoutes,
    ...industryRoutes,
    ...fundingRoutes,
    ...blogRoutes,
  ]
}
