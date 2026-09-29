'use client'

import Link from "next/link"
import { Zap, FileText, Wrench, Scale, Building2, BookOpen } from "lucide-react"
import { COLORS } from "@/lib/colors"
import { trackNavClick } from "@/lib/tracking"
import type { FeaturedDropdownItem, DropdownHeaderCta } from "@/lib/header-nav"

interface DropdownMenuTwoSectionProps {
  items: FeaturedDropdownItem[]
  basePath: string
  label: string
  type?: 'pages' | 'anchors'
  onClose?: () => void
  description?: string
  featuredTitle?: string
  regularTitle?: string
  showHereToServe?: boolean
  headerCta?: DropdownHeaderCta
  onAnchorClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
}

const featuredItemClasses = "flex items-start gap-3 p-4 transition-colors"
const regularItemClasses = "block px-4 py-2.5 text-sm font-medium transition-colors"

const getIcon = (iconName?: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    Zap: <Zap size={20} className="flex-shrink-0 mt-0.5" />,
    FileText: <FileText size={20} className="flex-shrink-0 mt-0.5" />,
    Wrench: <Wrench size={20} className="flex-shrink-0 mt-0.5" />,
    Scale: <Scale size={20} className="flex-shrink-0 mt-0.5" />,
    Building2: <Building2 size={20} className="flex-shrink-0 mt-0.5" />,
    BookOpen: <BookOpen size={20} className="flex-shrink-0 mt-0.5" />,
  }
  return iconMap[iconName || '']
}

const Footer = ({ showHereToServe }: { showHereToServe?: boolean }) => {
  if (!showHereToServe) return null
  return (
    <div className="border-t px-6 lg:px-8 py-4 text-xs" style={{ borderColor: `${COLORS.primary}15`, color: `${COLORS.dark}80` }}>
      #heretoserve
    </div>
  )
}

export function DropdownMenuTwoSection({
  items,
  basePath,
  label,
  type = 'pages',
  onClose,
  description,
  featuredTitle = 'Featured',
  regularTitle = 'All Items',
  showHereToServe = true,
  headerCta,
  onAnchorClick
}: DropdownMenuTwoSectionProps) {
  const handleClick = (id: string) => {
    trackNavClick(`${label} - ${id}`, basePath)
    onClose?.()
  }

  const featuredItems = items.filter(item => item.featured)
  const regularItems = items.filter(item => !item.featured)
  const allFeatured = featuredItems.length > 0 && regularItems.length === 0

  return (
    <div className="flex flex-col gap-0">
      {/* Header - Always show */}
      <div className="border-b p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8" style={{ borderColor: `${COLORS.primary}15` }}>
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="text-lg font-semibold" style={{ color: COLORS.dark }}>
            {label}
          </div>
          {description && (
            <div className="text-sm leading-relaxed max-w-2xl" style={{ color: COLORS.dark }}>
              {description}
            </div>
          )}
        </div>
        {headerCta && (
          <Link
            href={headerCta.href}
            onClick={() => handleClick(headerCta.href)}
            className="inline-flex items-center gap-3 px-4 py-3 rounded-lg border transition-all hover:-translate-y-0.5 hover:shadow-md flex-shrink-0"
            style={{
              color: COLORS.dark,
              borderColor: `${COLORS.secondary}`,
              backgroundImage: `linear-gradient(135deg, ${COLORS.highlight}33 0%, ${COLORS.secondary}33 100%)`,
            }}
          >
            <div style={{ color: COLORS.primary }}>
              {getIcon(headerCta.icon)}
            </div>
            <div className="flex flex-col">
              <div className="font-semibold text-sm leading-snug" style={{ color: COLORS.primary }}>{headerCta.name}</div>
              {headerCta.subtitle && (
                <div className="text-xs leading-tight" style={{ color: `${COLORS.dark}99` }}>{headerCta.subtitle}</div>
              )}
            </div>
            <span aria-hidden style={{ color: COLORS.primary }} className="ml-1 font-semibold">→</span>
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8">
        {allFeatured ? (
          // All featured - one column per item, up to 3
          <div className={`grid grid-cols-1 gap-8 ${featuredItems.length === 2 ? 'lg:grid-cols-2 max-w-3xl' : 'lg:grid-cols-3'}`}>
            {featuredItems.map((item) => {
              const href = item.href ?? (type === 'anchors' ? `${basePath}#${item.id}` : `${basePath}/${item.id}`)
              return (
                <Link
                  key={item.id}
                  href={href}
                  onClick={(e) => {
                    handleClick(item.id)
                    if (type === 'anchors' && !item.href) {
                      onAnchorClick?.(e as React.MouseEvent<HTMLAnchorElement>, href)
                    }
                  }}
                  className={featuredItemClasses}
                  style={{ color: COLORS.dark }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.background
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div style={{ color: COLORS.primary }}>
                    {getIcon(item.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base leading-snug">{item.name}</div>
                    {item.subtitle && (
                      <div className="text-xs mt-1 leading-tight" style={{ color: `${COLORS.dark}80` }}>{item.subtitle}</div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : featuredItems.length > 0 ? (
          // Mixed featured and regular - 2 section layout
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Featured Items - Left */}
            <div className="flex flex-col gap-3 lg:flex-shrink-0 lg:min-w-[280px]">
              {featuredItems.length > 0 && (
                <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: `${COLORS.primary}` }}>
                  {featuredTitle}
                </div>
              )}
              {featuredItems.map((item) => {
                const href = item.href ?? (type === 'anchors' ? `${basePath}#${item.id}` : `${basePath}/${item.id}`)
                return (
                  <Link
                    key={item.id}
                    href={href}
                    onClick={(e) => {
                      handleClick(item.id)
                      if (type === 'anchors') {
                        onAnchorClick?.(e as React.MouseEvent<HTMLAnchorElement>, href)
                      }
                    }}
                    className={featuredItemClasses}
                    style={{ color: COLORS.dark }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.background
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <div style={{ color: COLORS.primary }}>
                      {getIcon(item.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base leading-snug">{item.name}</div>
                      {item.subtitle && (
                        <div className="text-xs mt-1 leading-tight" style={{ color: `${COLORS.dark}80` }}>{item.subtitle}</div>
                      )}
                      {item.amount && (
                        <div className="text-xs mt-1 font-medium" style={{ color: COLORS.primary }}>{item.amount}</div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px" style={{ backgroundColor: `${COLORS.primary}15` }}></div>

            {/* Regular Items - Right */}
            <div className="flex flex-col gap-3 flex-1">
              {regularItems.length > 0 && (
                <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: `${COLORS.primary}` }}>
                  {regularTitle}
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 gap-y-1">
                {regularItems.map((item) => {
                  const href = item.href ?? (type === 'anchors' ? `${basePath}#${item.id}` : `${basePath}/${item.id}`)
                  return (
                    <Link
                      key={item.id}
                      href={href}
                      onClick={(e) => {
                        handleClick(item.id)
                        if (type === 'anchors') {
                          onAnchorClick?.(e as React.MouseEvent<HTMLAnchorElement>, href)
                        }
                      }}
                      className="block px-4 py-2 text-sm font-medium transition-colors"
                      style={{ color: COLORS.dark }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.background
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <div className="leading-snug line-clamp-2">{item.name}</div>
                      {item.amount && (
                        <div className="text-xs mt-0.5" style={{ color: `${COLORS.primary}80` }}>{item.amount}</div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          // Only regular items - single column
          <div className="flex flex-col gap-3">
            {items.map((item) => {
              const href = item.href ?? (type === 'anchors' ? `${basePath}#${item.id}` : `${basePath}/${item.id}`)
              return (
                <Link
                  key={item.id}
                  href={href}
                  onClick={(e) => {
                    handleClick(item.id)
                    if (type === 'anchors' && !item.href) {
                      onAnchorClick?.(e as React.MouseEvent<HTMLAnchorElement>, href)
                    }
                  }}
                  className="block px-4 py-2 text-sm font-medium transition-colors"
                  style={{ color: COLORS.dark }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.background
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div className="leading-snug">{item.name}</div>
                  {item.amount && (
                    <div className="text-xs mt-1" style={{ color: `${COLORS.primary}80` }}>{item.amount}</div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <Footer showHereToServe={showHereToServe} />
    </div>
  )
}