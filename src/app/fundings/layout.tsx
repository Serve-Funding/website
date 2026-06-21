import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Success Stories & Fundings | Serve Funding',
  description: 'Real working capital wins from Serve Funding clients — payroll, acquisitions, bridge capital, and more across industries. $250K-$100MM funded in 3-10 days.',
  alternates: { canonical: 'https://servefunding.com/fundings' },
  openGraph: {
    title: 'Client Success Stories & Fundings | Serve Funding',
    description: 'Real working capital wins across manufacturing, staffing, healthcare, and more. See how Serve Funding structures deals from $250K to $100MM.',
    url: 'https://servefunding.com/fundings',
    type: 'website',
  },
  robots: 'index, follow',
}

export default function FundingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
