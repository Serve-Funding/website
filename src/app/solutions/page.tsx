import type { Metadata } from 'next'
import { SolutionsClient } from './client'
import { Breadcrumb } from '@/components/breadcrumb'

export const metadata: Metadata = {
  title: "Funding Solutions When Banks Decline | Serve Funding",
  description: 'Explore 10+ funding solutions: asset-based lending, invoice factoring, PO funding & more. Fast approval in 3-10 days. $250K-$100MM.',
  keywords: "when banks say no, alternative funding, asset-based lending, invoice factoring, business loans, working capital, MCA consolidation, equipment leasing",
  alternates: { canonical: 'https://servefunding.com/solutions' },
  openGraph: {
    title: "Funding Solutions When Banks Decline",
    description: "See all 10+ funding options. Asset-based lending, invoice factoring, PO funding, equipment leasing, government contracts, and more. Get approved in 3-10 days. $250K-$100MM.",
    url: "https://servefunding.com/solutions",
    type: "website",
    images: [
      {
        url: "https://servefunding.com/solutions/Asset%20Based%20Lending.webp",
        width: 1024,
        height: 728,
        alt: "Alternative Funding Solutions",
      },
    ],
  },
}

export default function Solutions() {
  return (
    <>
      {/* Breadcrumb - includes schema */}
      <Breadcrumb items={[{ label: 'Solutions' }]} />

      <SolutionsClient />
    </>
  )
}
