import type { Metadata, Viewport } from "next"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { headers } from "next/headers"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ScrollToTop } from "@/components/ScrollToTop"
import { UmamiRouteTracker } from "@/components/UmamiRouteTracker"
import { PerformanceMonitor } from "@/components/PerformanceMonitor"
import Script from "next/script"
import { SchemaRenderer } from "@/components/SchemaRenderer"
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/schema-generators"
import "@/app/globals.css"
import { Montserrat } from 'next/font/google'
import { Chatbot, NewsletterModalLazy } from "@/components/LazyComponents"

// Lazy load NewsletterForm to improve LCP
const NewsletterForm = dynamic(() => import("@/components/Forms").then(mod => ({ default: mod.NewsletterForm })), {
  ssr: true,
  loading: () => <div className="py-20" />
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL("https://servefunding.com"),
  title: "Serve Funding - Creative Working Capital | $250K-$100MM",
  description: "Alternative working capital and funding solutions from $250K-$100MM. Debt refinance, payroll, MCA consolidation, and more when traditional banks decline.",
  keywords: "debt refinance, payroll financing, mca consolidation, when banks say no, alternative business financing, asset-based lending, invoice factoring, channel neutral advisor, boutique lender",
  openGraph: {
    title: "Serve Funding - Creative Working Capital | $250K-$100MM",
    description: "Boutique working capital advisory specializing in debt refinance, payroll financing, MCA consolidation, and alternative funding when traditional banks decline. Relationships over bots. Fast funding in 3-10 days.",
    url: "https://servefunding.com/",
    siteName: "Serve Funding",
    type: "website",
    images: [
      {
        url: "https://servefunding.com/home/right%20funding%20solutions.webp",
        width: 960,
        height: 628,
        alt: "Serve Funding - Creative Working Capital Solutions",
      },
    ],
  },
  // No static title/description here — Next derives the Twitter card from each
  // page's openGraph, so every page gets a content-specific card automatically.
  twitter: {
    card: "summary_large_image",
  },
  robots: "index, follow",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Extract nonce from middleware for CSP
  const headersList = await headers()
  const nonce = headersList.get('x-nonce') || undefined

  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        {/* Site-wide entity schema: Organization + WebSite */}
        <SchemaRenderer schema={getOrganizationSchema()} nonce={nonce} />
        <SchemaRenderer schema={getWebSiteSchema()} nonce={nonce} />

        {/* Preconnect to critical third-party origins for LCP improvement */}
        {process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL} />
        )}
        <link rel="preconnect" href="https://js.hs-scripts.com" />
        <link rel="preconnect" href="https://ddwl4m2hdecbv.cloudfront.net" />
      </head>
      <body className="bg-white flex flex-col min-h-screen">
        <ScrollToTop />
        <PerformanceMonitor />
        <Header />
        <Suspense fallback={null}>
          <UmamiRouteTracker />
        </Suspense>
        <main className="flex-grow pt-20">
          {children}
        </main>
        <NewsletterForm />
        <Footer />
        <Chatbot />
        <NewsletterModalLazy />

        {/* Load third-party scripts after main content with nonce */}
        {process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
            nonce={nonce}
          />
        )}

        {/* HubSpot Tracking with nonce */}
        <Script
          id="hs-script-loader"
          src="https://js.hs-scripts.com/23433903.js"
          strategy="lazyOnload"
          nonce={nonce}
        />
      </body>
    </html>
  )
}
