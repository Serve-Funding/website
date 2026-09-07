import { MetadataRoute } from 'next'
import { fundingSolutions } from '@/data/solutions'
import { comparisons } from '@/data/comparisons'
import { industries } from '@/data/industries'
import { getBlogPosts } from '@/lib/blog-utils'
import { routeLastModified } from '@/data/last-updated.generated'

// lastmod comes from git, via scripts/generate-last-updated.ts, because Google
// uses it to schedule recrawls and drops the signal entirely for sites whose
// dates are wrong. A hardcoded review date used to make every page here report
// the same stale day while the on-page dateModified said something newer.
// See ROUTE_SOURCES in that script to change what a route's date is derived from.

const baseUrl = 'https://servefunding.com'

/** Static routes, each dated by the files that render it. */
const STATIC_ROUTES = [
  '/',
  '/about-us',
  '/solutions',
  '/solutions/compare',
  '/compare',
  '/industries',
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
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getBlogPosts()

  const postDate = (post: { lastUpdated?: string; date: string }) =>
    new Date((post.lastUpdated || post.date) + 'T00:00:00Z')

  // The blog index changes whenever a post lands, not just when its template does.
  const newestPost = blogPosts
    .map(postDate)
    .sort((a, b) => a.getTime() - b.getTime())
    .pop()

  const routes = STATIC_ROUTES.map((route) => {
    const templateDate = routeLastModified(route)
    const lastModified =
      route === '/blog' && newestPost && newestPost > templateDate ? newestPost : templateDate

    return {
      url: route === '/' ? baseUrl : `${baseUrl}${route}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: route === '/' ? 1 : 0.8,
    }
  })

  const solutionRoutes = fundingSolutions.map((solution) => ({
    url: `${baseUrl}/solutions/${solution.id}`,
    lastModified: routeLastModified('/solutions/[solution-id]'),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const comparisonRoutes = comparisons.map((c) => ({
    url: `${baseUrl}/compare/${c.id}`,
    lastModified: routeLastModified('/compare/[comparison-id]'),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  const industryRoutes = industries.map((ind) => ({
    url: `${baseUrl}/industries/${ind.id}`,
    lastModified: routeLastModified('/industries/[industry-id]'),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: postDate(post),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...routes,
    ...solutionRoutes,
    ...comparisonRoutes,
    ...industryRoutes,
    ...blogRoutes,
  ]
}
