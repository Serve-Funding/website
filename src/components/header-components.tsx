'use client'

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { trackNavClick } from "@/lib/tracking"
import type { DropdownItem, FeaturedDropdownItem, DropdownHeaderCta } from "@/lib/header-nav"

interface NavItemRendererProps {
  item: DropdownItem
  href: string
  label: string
  type?: 'pages' | 'anchors'
  className: string
  hoverColor?: string
  onAnchorClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
  onClose?: () => void
}

/**
 * Renders a navigation item as either an anchor link or Next.js Link
 * Consolidates the logic for handling both item types
 */
function NavItemRenderer({
  item,
  href,
  label,
  type = 'pages',
  className,
  hoverColor,
  onAnchorClick,
  onClose
}: NavItemRendererProps) {
  const isAnchorBased = type === 'anchors'
  const trackingLabel = `${label} - ${item.name}`

  const handleClick = () => {
    trackNavClick(trackingLabel, href)
    onClose?.()
  }

  const handleHoverEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (hoverColor) e.currentTarget.style.backgroundColor = hoverColor
  }

  const handleHoverLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (hoverColor) e.currentTarget.style.backgroundColor = 'transparent'
  }

  if (isAnchorBased) {
    return (
      <a
        key={item.id}
        href={href}
        onClick={(e) => {
          handleClick()
          onAnchorClick?.(e, href)
        }}
        className={className}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
      >
        {item.name}
      </a>
    )
  }

  return (
    <Link
      key={item.id}
      href={href}
      onClick={handleClick}
      className={className}
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
    >
      {item.name}
    </Link>
  )
}

interface MobileMenuSectionProps {
  label: string
  basePath: string
  items: FeaturedDropdownItem[]
  type?: 'pages' | 'anchors'
  isExpanded: boolean
  onToggle: () => void
  onClose?: () => void
  headerCta?: DropdownHeaderCta
  onAnchorClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
  noLink?: boolean
}

const mobileMenuItemClasses = "block text-base font-medium py-3 border-b border-gray-200 text-gray-700 pl-6"

export function MobileMenuSection({ label, basePath, items, type = 'pages', isExpanded, onToggle, onClose, headerCta, onAnchorClick, noLink }: MobileMenuSectionProps) {
  const handleLinkClick = () => {
    trackNavClick(label, basePath)
    onClose?.()
  }

  return (
    <div className="border-b border-gray-200">
      {noLink ? (
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between text-base font-medium py-3 text-olive-green"
          aria-label={`Toggle ${label} menu`}
        >
          <span className="flex-1 text-left text-olive-green">{label}</span>
          <span className="px-3 py-1 -my-1 flex items-center">
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={20} />
            </motion.div>
          </span>
        </button>
      ) : (
        <div className="w-full flex items-center justify-between text-base font-medium py-3 text-olive-green">
          <Link
            href={basePath}
            onClick={handleLinkClick}
            className="flex-1 text-olive-green"
          >
            {label}
          </Link>
          <button
            onClick={onToggle}
            className="px-3 py-1 -my-1 flex items-center"
            aria-label={`Toggle ${label} menu`}
          >
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={20} />
            </motion.div>
          </button>
        </div>
      )}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-0">
            {items.map((item) => {
              const href = item.href ?? (type === 'anchors' ? `${basePath}#${item.id}` : `${basePath}/${item.id}`)

              return (
                <NavItemRenderer
                  key={item.id}
                  item={item}
                  href={href}
                  label={label}
                  type={type}
                  className={mobileMenuItemClasses}
                  onClose={onClose}
                  onAnchorClick={onAnchorClick}
                />
              )
            })}
            {headerCta && (
              <Link
                href={headerCta.href}
                onClick={() => {
                  trackNavClick(`${label} - ${headerCta.name}`, headerCta.href)
                  onClose?.()
                }}
                className={mobileMenuItemClasses}
              >
                {headerCta.name}
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

interface HamburgerIconProps {
  isOpen: boolean
}

export function HamburgerIcon({ isOpen }: HamburgerIconProps) {
  return (
    <button className="text-gray-700 w-6 h-6 flex flex-col justify-center gap-1.5 relative" aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}>
      <span
        className={`block w-6 h-0.5 bg-gray-700 origin-center transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
      />
      <span
        className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
      />
      <span
        className={`block w-6 h-0.5 bg-gray-700 origin-center transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
      />
    </button>
  )
}
