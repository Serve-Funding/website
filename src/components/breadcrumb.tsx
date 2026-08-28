'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { COLORS } from '@/lib/colors'
import { SchemaRenderer } from '@/components/SchemaRenderer'
import { getBreadcrumbSchema } from '@/lib/schema-generators'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  renderSchema?: boolean
}

export function Breadcrumb({ items, renderSchema = true }: BreadcrumbProps) {
  const pathname = usePathname()

  const allItems = [
    { label: 'Home', href: '/' },
    ...items
  ]

  // Convert visual breadcrumbs to full URLs for schema.
  // The last crumb intentionally has no href — you don't link the page you're
  // already on — but BreadcrumbList still needs its real URL. Falling back to
  // the bare origin made every page claim the homepage as its own final crumb.
  const schemaItems = allItems.map(item => ({
    name: item.label,
    url: `https://servefunding.com${item.href ?? pathname ?? ''}`
  }))

  const breadcrumbSchema = getBreadcrumbSchema(schemaItems)

  return (
    <>
      {/* Render breadcrumb schema if enabled */}
      {renderSchema && <SchemaRenderer schema={breadcrumbSchema} />}

      {/* Visual breadcrumb navigation */}
      <nav className="text-sm text-gray-600 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {allItems.map((item, index) => (
          <span key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className="hover:opacity-80 transition-opacity duration-200"
                style={{color: COLORS.primary}}
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-semibold">{item.label}</span>
            )}
            {index < allItems.length - 1 && <span className="mx-2" style={{color: COLORS.primary}}>{'>'}</span>}
          </span>
        ))}
      </nav>
    </>
  )
}
