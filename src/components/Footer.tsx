import Link from "next/link"
import Image from "next/image"
import { Container, Heading, Text, SocialIcons, Section } from "./ui"
import { COLORS as BRAND_COLORS } from "@/lib/colors"
import { getBlogPosts } from "@/lib/blog-utils"

export function Footer() {
  const blogPosts = getBlogPosts()
  const sortedBlogPosts = [...blogPosts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  const currentYear = new Date().getFullYear()

  return (
    <>
      <footer className="text-gray-800 font-sans">
        <Section background="white">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Menu */}
              <div>
                <Heading size="h3" className="text-olive-900 font-bold mb-6">Menu</Heading>
                <div className="space-y-3 flex flex-col">
                  <Link href="/" className="text-olive-900 hover:text-gold-500 transition-colors">Home</Link>
                  <Link href="/solutions" className="text-olive-900 hover:text-gold-500 transition-colors">Solutions</Link>
                  <Link href="/fundings" className="text-olive-900 hover:text-gold-500 transition-colors">Fundings</Link>
                  <Link href="/partners" className="text-olive-900 hover:text-gold-500 transition-colors">Partners</Link>
                  <Link href="/bankers" className="text-olive-900 hover:text-gold-500 transition-colors">Bankers</Link>
                  <Link href="/about-us" className="text-olive-900 hover:text-gold-500 transition-colors">About Us</Link>
                  <Link href="/discover" className="text-olive-900 hover:text-gold-500 transition-colors">Discover</Link>
                  <Link href="/faq" className="text-olive-900 hover:text-gold-500 transition-colors">FAQ</Link>
                </div>
              </div>

              {/* Solutions */}
              <div>
                <Heading size="h3" className="text-olive-900 font-bold mb-6">Solutions</Heading>
                <div className="space-y-3 flex flex-col">
                  <Link href="/solutions/working-capital-loans" className="text-olive-900 hover:text-gold-500 transition-colors">Working Capital Loans</Link>
                  <Link href="/solutions/invoice-factoring" className="text-olive-900 hover:text-gold-500 transition-colors">Invoice Factoring</Link>
                  <Link href="/solutions/asset-based-lending" className="text-olive-900 hover:text-gold-500 transition-colors">Asset-Based Lending</Link>
                  <Link href="/solutions/equipment-leasing" className="text-olive-900 hover:text-gold-500 transition-colors">Equipment Leasing</Link>
                  <Link href="/solutions/purchase-order-funding" className="text-olive-900 hover:text-gold-500 transition-colors">Purchase Order Funding</Link>
                  <Link href="/solutions/compare" className="text-olive-900 hover:text-gold-500 transition-colors">Compare All Options</Link>
                  <Link href="/solutions" className="text-gold-500 hover:text-gold-600 transition-colors font-semibold mt-2">
                    View All Solutions →
                  </Link>
                </div>
              </div>

              {/* Learn / Resources */}
              <div>
                <Heading size="h3" className="text-olive-900 font-bold mb-6">Learn</Heading>
                <div className="space-y-3 flex flex-col">
                  <Link href="/compare" className="text-olive-900 hover:text-gold-500 transition-colors">Head-to-Head Comparisons</Link>
                  <Link href="/industries" className="text-olive-900 hover:text-gold-500 transition-colors">By Industry</Link>
                  <Link href="/glossary" className="text-olive-900 hover:text-gold-500 transition-colors">Glossary</Link>
                </div>

                {/* From the Blog */}
                <p className="text-olive-900 font-semibold mt-8 mb-3">From the Blog</p>
                <div className="space-y-3 flex flex-col">
                  {sortedBlogPosts.slice(0, 4).map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`} className="text-gray-500 hover:text-gold-500 transition-colors text-sm">
                      → {post.title}
                    </Link>
                  ))}
                  <Link href="/blog" className="text-gold-500 hover:text-gold-600 transition-colors font-semibold mt-2">
                    View All Posts →
                  </Link>
                </div>
              </div>

              {/* Legal & Social */}
              <div>
                <Heading size="h3" className="text-olive-900 font-bold mb-6">Legal</Heading>
                <div className="space-y-3 flex flex-col mb-6">
                  <Link href="/privacy-policy" className="text-olive-900 hover:text-gold-500 transition-colors">Privacy Policy</Link>
                  <Link href="/sms-terms" className="text-olive-900 hover:text-gold-500 transition-colors">SMS Terms</Link>
                  <Link href="/terms-of-service" className="text-olive-900 hover:text-gold-500 transition-colors">Terms of Service</Link>
                </div>
                <SocialIcons />
              </div>
            </div>

            {/* Network Affiliations and Logo */}
            <div className="border-t border-gray-200 pt-12">
              <div className="flex flex-wrap justify-center items-center gap-12 mb-12">
                <a href="https://www.acg.org/" target="_blank" rel="noopener noreferrer" title="Visit ACG Global - Association for Corporate Growth" className="hover:opacity-80 transition-opacity">
                  <Image src="/ACG Global Logo.webp" alt="ACG Global - Association for Corporate Growth" width={140} height={60} className="h-16 w-auto" />
                </a>
                <a href="https://www.factoring.org/" target="_blank" rel="noopener noreferrer" title="Visit IFA - International Factoring Association" className="hover:opacity-80 transition-opacity">
                  <Image src="/IFA.webp" alt="IFA - International Factoring Association" width={100} height={50} className="h-16 w-auto" />
                </a>
                <a href="https://www.sfnet.com/" target="_blank" rel="noopener noreferrer" title="Visit Secured Finance Network" className="hover:opacity-80 transition-opacity">
                  <Image src="/Secured Finance Network.jpg" alt="Secured Finance Network" width={160} height={50} className="h-16 w-auto" />
                </a>
                <a href="https://www.turnaround.org/" target="_blank" rel="noopener noreferrer" title="Visit TMA - Turnaround Management Association" className="hover:opacity-80 transition-opacity">
                  <Image src="/TMA.webp" alt="TMA - Turnaround Management Association" width={120} height={50} className="h-16 w-auto" />
                </a>
              </div>
              <div className="flex justify-center mt-24">
                <Image
                  src="/Logo_Full-color_long_samecolor-1.webp"
                  alt="Serve Funding"
                  className="h-28 w-auto"
                  width={440}
                  height={121}
                />
              </div>
            </div>
          </Container>
        </Section>

        {/* Copyright - Full Width */}
        <div className="py-4" style={{ backgroundColor: BRAND_COLORS.primary }}>
          <Container>
            <Text size="sm" className="text-center" style={{ color: '#ffffff' }}>
              © {currentYear} Serve Funding, LLC. All rights reserved.
            </Text>
          </Container>
        </div>
      </footer>
    </>
  )
}
