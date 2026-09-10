'use client'

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown, Phone } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Button, Container } from "./ui"
import { motion } from "framer-motion"
import { COLORS } from "@/lib/colors"
import { trackNavClick, trackEvent } from "@/lib/tracking"
import { headerNavConfig, getExpandMenuKey, type SimpleNavItem, type DropdownNavItem, type NavItem } from "@/lib/header-nav"
import { MobileMenuSection, HamburgerIcon } from "./header-components"
import { DropdownMenuTwoSection } from "./DropdownMenuSolutions"
import { companyInfo } from "@/data/company-info"

const navItemClasses = "text-gray-700 font-medium text-base h-full relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:transition-all after:duration-300 after:w-0 hover:after:w-full flex items-center"
const underlineStyle = {
  '--underline-color': COLORS.primary,
} as React.CSSProperties & { '--underline-color': string }

// Type guards for discriminated union
const isSimpleNavItem = (item: NavItem): item is SimpleNavItem => item.type === 'link'
const isDropdownNavItem = (item: NavItem): item is DropdownNavItem => item.type === 'dropdown'

const getIsActive = (item: DropdownNavItem, pathname: string): boolean => {
  return item.basePath === '/solutions'
    ? pathname.startsWith('/solutions')
    : pathname === item.basePath
}

interface NavItemProps {
  href: string
  label: string
  isActive?: boolean
  onAnchorClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
}

function NavItem({ href, label, isActive, onAnchorClick }: NavItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackNavClick(label, href)
    onAnchorClick?.(e, href)
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`${navItemClasses} ${isActive ? 'after:w-full' : ''}`}
      style={underlineStyle}
    >
      {label}
    </Link>
  )
}

interface NavDropdownProps {
  label: string
  items: Array<{ name: string; id: string; featured?: boolean; subtitle?: string; icon?: string }>
  basePath: string
  onAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
  type?: 'pages' | 'anchors'
  isActive?: boolean
  noLink?: boolean
}

function NavDropdown({ label, basePath, isActive, noLink }: NavDropdownProps) {
  if (noLink) {
    return (
      <div className="relative h-full flex items-center group">
        <span
          className={`${navItemClasses} group-hover:after:w-full ${isActive ? 'after:w-full' : ''} gap-1 cursor-default`}
          style={underlineStyle}
        >
          {label} <ChevronDown size={18} />
        </span>
      </div>
    )
  }
  return (
    <div className="relative h-full flex items-center group">
      <Link
        href={basePath}
        onClick={() => trackNavClick(label, basePath)}
        className={`${navItemClasses} group-hover:after:w-full ${isActive ? 'after:w-full' : ''} gap-1`}
        style={underlineStyle}
      >
        {label} <ChevronDown size={18} />
      </Link>
    </div>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [headerHeight, setHeaderHeight] = useState(80)
  const pathname = usePathname()
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  const getActiveDropdownData = () => {
    if (!activeDropdown) return null
    return headerNavConfig.items.find(item => isDropdownNavItem(item) && item.label === activeDropdown) as DropdownNavItem | undefined
  }

  const activeDropdownData = getActiveDropdownData()

  const closeDropdownWithDelay = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  useEffect(() => {
    // Initialize scroll state immediately to prevent layout shift
    setIsScrolled(window.scrollY > 10)

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10)
          // Update header height on scroll to handle height changes
          if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Measure initial header height
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight)
    }
  }, [isScrolled])

  useEffect(() => {
    setActiveDropdown(null)
    setIsMenuOpen(false)
    setExpandedMenu(null)
  }, [pathname])

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle same-page anchor links
    if (!href.startsWith('#')) {
      const currentPath = href.split('#')[0]
      if (currentPath !== pathname && currentPath !== '') {
        return // Let normal navigation happen (don't prevent default)
      }
    }

    const anchorId = href.includes('#') ? href.split('#')[1] : null
    if (!anchorId) return

    e.preventDefault()

    // Close mobile menu if open
    setIsMenuOpen(false)
    setExpandedMenu(null)

    // Update URL hash to trigger hashchange events (for modal opening, etc)
    window.location.hash = anchorId

    // Find the element and scroll to it with a small delay for DOM updates
    setTimeout(() => {
      const element = document.getElementById(anchorId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 50)
  }

  return (
    <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 font-sans transition-all duration-300 bg-white/60 backdrop-blur-md shadow-md ${
      isScrolled ? "py-3" : "py-4"
    } ${isMenuOpen ? 'shadow-lg' : ''} ${activeDropdown ? 'bg-white' : ''}`}>
      <Container>
        {/* Single row header - Logo, centered nav, and CTA Button */}
        <div className="relative flex items-center justify-between gap-8">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 transition-transform duration-300 flex-shrink-0">
            <Image
              src="/Logo_Full-color_long_samecolor-1.webp"
              alt="Serve Funding"
              className={`w-auto transition-all duration-300 ${isScrolled ? "h-10" : "h-12"}`}
              width={305}
              height={84}
              priority
            />
          </Link>

          {/* Center Nav - Hidden on small screens, flex-1 to center it */}
          <nav
            className="hidden lg:flex items-stretch space-x-8 flex-1 justify-center py-2"
            onMouseEnter={() => {
              cancelClose()
            }}
            onMouseLeave={() => {
              closeDropdownWithDelay()
            }}
          >
            {headerNavConfig.items.map((item) => {
              if (isSimpleNavItem(item)) {
                return (
                  <NavItem
                    key={item.label}
                    href={item.href}
                    label={item.label}
                    isActive={pathname === item.href}
                    onAnchorClick={handleAnchorClick}
                  />
                )
              }

              if (isDropdownNavItem(item)) {
                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => setActiveDropdown(item.label)}
                  >
                    <NavDropdown
                      label={item.label}
                      basePath={item.basePath}
                      items={item.items}
                      isActive={getIsActive(item, pathname)}
                      onAnchorClick={handleAnchorClick}
                      type={item.itemType || 'pages'}
                      noLink={item.noLink}
                    />
                  </div>
                )
              }
            })}
          </nav>

          {/* Right side: Phone + CTA Button + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Click-to-call. Some visitors would rather ring a person than
                fill in a form, and the number was previously only in the
                JSON-LD — machine-readable and invisible to a human. Hidden
                below lg so it never competes with the hamburger; the mobile
                menu carries its own copy. */}
            <a
              href={`tel:${companyInfo.contact.phone.replace(/[^\d+]/g, '')}`}
              onClick={() => trackEvent('phone_click', { location: 'header' })}
              className="hidden lg:flex items-center gap-2 text-sm font-medium text-olive-900 hover:text-gold-500 transition-colors whitespace-nowrap"
            >
              <Phone size={16} />
              {companyInfo.contact.phone.replace(/^\+1\s*/, '')}
            </a>

            {/* CTA Button */}
            <Link href="/discover" onClick={() => { trackNavClick("Let's Talk (Header)", "/discover"); trackEvent("lets_talk_click", { location: "header" }) }}>
              <Button variant="default" size="sm" className="rounded-full flex-shrink-0">
                Let&apos;s Talk
              </Button>
            </Link>

            {/* Mobile Menu Button - Animated */}
            <div className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <HamburgerIcon isOpen={isMenuOpen} />
            </div>
          </div>
        </div>

        {/* Unified Dropdown Container - Full Width */}
        {activeDropdownData && (
          <div
            key={activeDropdown}
            className="hidden lg:block fixed left-0 right-0 w-screen transition-all duration-300 z-40 bg-white shadow-md"
            style={{
              top: `${headerHeight}px`,
              borderColor: `${COLORS.primary}15`,
            }}
            onMouseEnter={() => {
              cancelClose()
            }}
            onMouseLeave={() => closeDropdownWithDelay()}
          >
            <Container className="bg-transparent">
              <DropdownMenuTwoSection
                items={activeDropdownData.items}
                basePath={activeDropdownData.basePath}
                label={activeDropdown!}
                type={activeDropdownData.itemType || 'pages'}
                onClose={() => setActiveDropdown(null)}
                description={activeDropdownData.description}
                featuredTitle={activeDropdownData.featuredTitle}
                regularTitle={activeDropdownData.regularTitle}
                headerCta={activeDropdownData.headerCta}
                onAnchorClick={handleAnchorClick}
              />
            </Container>
          </div>
        )}

        {/* Mobile Menu - Inside header */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
            style={{ maxHeight: `calc(100vh - ${headerHeight}px)` }}
          >
            {/* Navigation Links */}
            <div className="space-y-0 px-4 py-4 overflow-y-auto" style={{ maxHeight: `calc(100vh - ${headerHeight}px - 24px)` }}>
              {headerNavConfig.items.map((item) => {
                const closeMenu = () => {
                  setIsMenuOpen(false)
                  setExpandedMenu(null)
                }

                if (isSimpleNavItem(item)) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        trackNavClick(item.label, item.href)
                        closeMenu()
                      }}
                      className="block text-base font-medium py-3 text-olive-green"
                    >
                      {item.label}
                    </Link>
                  )
                }

                if (isDropdownNavItem(item)) {
                  const expandKey = getExpandMenuKey(item.label)

                  return (
                    <MobileMenuSection
                      key={item.label}
                      label={item.label}
                      basePath={item.basePath}
                      items={item.items}
                      type={item.itemType || 'pages'}
                      isExpanded={expandedMenu === expandKey}
                      onToggle={() => setExpandedMenu(expandedMenu === expandKey ? null : expandKey)}
                      onClose={closeMenu}
                      headerCta={item.headerCta}
                      onAnchorClick={handleAnchorClick}
                      noLink={item.noLink}
                    />
                  )
                }
              })}

              {/* Let's Talk Button */}
              <Link href="/discover" onClick={() => { trackNavClick("Let's Talk (Mobile Menu)", "/discover"); trackEvent("lets_talk_click", { location: "mobile_menu" }); setIsMenuOpen(false) }} className="w-full block pt-4">
                <Button variant="default" className="w-full">
                  Let&apos;s Talk
                </Button>
              </Link>

              {/* Click-to-call, the mobile counterpart of the header number —
                  a tap places the call on the device most likely to be able to. */}
              <a
                href={`tel:${companyInfo.contact.phone.replace(/[^\d+]/g, '')}`}
                onClick={() => { trackEvent('phone_click', { location: 'mobile_menu' }); setIsMenuOpen(false) }}
                className="w-full flex items-center justify-center gap-2 pt-4 text-base font-medium text-olive-900"
              >
                <Phone size={18} />
                {companyInfo.contact.phone.replace(/^\+1\s*/, '')}
              </a>
            </div>
        </motion.div>
        )}
      </Container>
    </header>
  )
}
