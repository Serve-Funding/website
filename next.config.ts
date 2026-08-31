import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  // Modern output for better performance
  output: 'standalone',

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Minification is automatic with Turbopack in Next.js 16
  compiler: {
    // Remove console.logs in production for smaller bundle
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [85], // Consistent high quality for all images
    minimumCacheTTL: 31536000, // 1 year
  },

  // Enable compression
  compress: true,

  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Configure headers for caching and security
  async headers() {
    return [
      // Security headers for all routes
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // CSP is now handled by middleware.ts with nonce for better security
          // This removes 'unsafe-inline' and 'unsafe-eval' from script-src
        ],
      },
      // Static asset caching
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // /funding Group A folded into the /solutions pages that already rank.
      // The problem pages duplicated a product page each and had no inbound
      // internal links; their terms tables, deflections and worked examples now
      // live on the destination. See docs/funding-pages-harvest.md.
      { source: '/funding/revenue-based-financing', destination: '/solutions/working-capital-loans', permanent: true },
      { source: '/funding/invoice-factoring', destination: '/solutions/invoice-factoring', permanent: true },
      { source: '/funding/purchase-order-financing', destination: '/solutions/purchase-order-funding', permanent: true },
      { source: '/funding/business-bridge-loan', destination: '/solutions/bridge-funding', permanent: true },
      { source: '/funding/mca-consolidation', destination: '/solutions/debt-refinance', permanent: true },

      // www redirect - SEO best practice to prevent duplicate content
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.servefunding.com",
          },
        ],
        destination: "https://servefunding.com/:path*",
        permanent: true,
      },
      // WordPress legacy redirects
      {
        source: "/frequently-asked-questions-faq",
        destination: "/faq",
        permanent: true, // 301 redirect for SEO
      },
      {
        source: "/sample-page",
        destination: "/",
        permanent: true, // 301 redirect to home
      },
      // Old WordPress category/blog pages to new blog
      {
        source: "/category/uncategorized",
        destination: "/blog",
        permanent: true, // 301 redirect for SEO
      },
      {
        source: "/category/:category",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blogs",
        destination: "/blog",
        permanent: true, // 301 redirect for SEO
      },
      // Client success pages - alias to fundings
      {
        source: "/client-success",
        destination: "/fundings",
        permanent: true, // 301 redirect for SEO
      },
      // Core values - redirect to about-us where E-A-T is featured
      {
        source: "/core-values",
        destination: "/about-us",
        permanent: true, // 301 redirect for SEO
      },
      // Consolidated FAQ redirects
      {
        source: "/faq/working-capital",
        destination: "/faq",
        permanent: true, // 301 redirect for SEO
      },
      {
        source: "/faq/about-serve-funding",
        destination: "/faq",
        permanent: true, // 301 redirect for SEO
      },
      // Refer page redirect to partners
      {
        source: "/refer",
        destination: "/partners",
        permanent: false, // 302 temporary redirect
      },
      // Legacy lets-talk redirect to discover
      {
        source: "/lets-talk",
        destination: "/discover",
        permanent: true,
      },
      // Deal inquiry redirect to discover
      {
        source: "/deal-inquiry",
        destination: "/discover",
        permanent: true,
      },
      // Contact us redirect to discover
      {
        source: "/contact-us",
        destination: "/discover",
        permanent: true,
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
