'use client'

import dynamic from 'next/dynamic'

/**
 * LazyComponents.tsx
 *
 * Client-side wrapper for dynamically imported components.
 * This allows us to use dynamic imports with ssr: false in a Server Component layout.
 *
 * These components are lazy-loaded to:
 * - Reduce initial bundle size
 * - Improve First Input Delay (FID)
 * - Defer non-critical UI
 */

// Lazy load Chatbot to reduce initial bundle size (~40KB savings)
// Chatbot loads client-side only after page interactive
export const Chatbot = dynamic(
  () => import('@/components/Chatbot').then(mod => ({ default: mod.Chatbot })),
  {
    ssr: false,
    loading: () => null,
  }
)
