/**
 * Shared Solution Types
 */

import { ReactNode } from 'react'
import type { TermRow, NotForItem } from '@/components/content-blocks'

export interface FundingSolution {
  id: string
  title: string | ReactNode
  seoTitle?: string // SEO title for search results (benefit-driven, under 60 chars)
  image: string
  category: string

  // Descriptions
  whatIs: string // Answer capsule - "What is X?" in 1-2 sentences
  shortDesc: string // Short description for cards/listings
  fullDesc: string // Full description for detail pages

  // Features and benefits
  features: string[]

  // Use cases
  bestFor?: string[]

  /**
   * Quotable numeric table. Keep every value numeric and dated where it moves;
   * this is the block an answer engine is most likely to repeat verbatim.
   */
  terms?: TermRow[]

  /**
   * Honest deflection: who this is wrong for, and where they should go instead.
   * Mirrors `whatDoesntFit` on the Industry type.
   */
  notFor?: NotForItem[]

  /** Generic-sized worked example with real dollars. No customer identification. */
  workedExample?: string
}
