import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Discover Your Funding Options | Serve Funding',
  description: 'Share a few details about your business and we\'ll show you the credit options available. Working capital, asset-based lending, and more from $250K-$100MM.',
  alternates: { canonical: 'https://servefunding.com/discover' },
  openGraph: {
    title: 'Discover Your Funding Options | Serve Funding',
    description: 'Tell us about your business and we\'ll match you with the right working capital solution. Fast, relationship-based advisory from $250K to $100MM.',
    url: 'https://servefunding.com/discover',
    type: 'website',
  },
  robots: 'index, follow',
}

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return children
}
