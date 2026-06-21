import type { Metadata } from 'next'

// Post-Calendly confirmation page: thin, parameterized (carries invitee email in
// the URL), and has no organic value — keep it out of the index and off the SERP.
export const metadata: Metadata = {
  title: 'Meeting Confirmed | Serve Funding',
  robots: { index: false, follow: false },
}

export default function CallConfirmedLayout({ children }: { children: React.ReactNode }) {
  return children
}
