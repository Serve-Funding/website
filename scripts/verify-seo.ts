#!/usr/bin/env node
/**
 * SEO Verification Script
 *
 * Validates all metadata (titles, descriptions) across the codebase
 * to prevent SEO issues from being deployed to production.
 *
 * Runs at build time and fails the build if validation errors are found.
 */

import fs from 'fs'
import path from 'path'

// Constants
const TITLE_MAX_LENGTH = 70
const DESCRIPTION_MAX_LENGTH = 160
const DESCRIPTION_MIN_LENGTH = 120
const SUFFIX = ' | Serve Funding' // 17 chars
const TITLE_WITH_SUFFIX_MAX = TITLE_MAX_LENGTH - SUFFIX.length // 53 chars

interface ValidationResult {
  file: string
  field: string
  value: string
  length: number
  maxLength?: number
  minLength?: number
  valid: boolean
  error?: string
}

/**
 * Extract a string-literal value for `key:` from a code block (escape-aware).
 * Handles single, double, and backtick quotes; returns the unescaped value or null.
 */
function extractStringLiteral(block: string, key: string): string | null {
  const patterns = [
    new RegExp(`${key}\\s*:\\s*'((?:\\\\.|[^'\\\\])*)'`),
    new RegExp(`${key}\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`),
    new RegExp(`${key}\\s*:\\s*\`((?:\\\\.|[^\`\\\\])*)\``),
  ]
  let best: { index: number; value: string } | null = null
  for (const re of patterns) {
    const m = block.match(re)
    if (m && m.index !== undefined && (best === null || m.index < best.index)) {
      best = { index: m.index, value: m[1] }
    }
  }
  return best ? best.value.replace(/\\(['"`\\])/g, '$1') : null
}

/**
 * Validate a description/excerpt against the DESCRIPTION_MIN/MAX window.
 */
function checkDescription(file: string, field: string, value: string): ValidationResult {
  if (value.length > DESCRIPTION_MAX_LENGTH) {
    return { file, field, value, length: value.length, maxLength: DESCRIPTION_MAX_LENGTH, valid: false,
      error: `Description exceeds ${DESCRIPTION_MAX_LENGTH} chars (${value.length} chars)` }
  }
  if (value.length < DESCRIPTION_MIN_LENGTH) {
    return { file, field, value, length: value.length, minLength: DESCRIPTION_MIN_LENGTH, valid: false,
      error: `Description is below recommended minimum ${DESCRIPTION_MIN_LENGTH} chars (${value.length} chars)` }
  }
  return { file, field, value, length: value.length, maxLength: DESCRIPTION_MAX_LENGTH, valid: true }
}

/**
 * Extract YAML frontmatter from Markdoc files
 */
function extractFrontmatter(content: string): Record<string, string> {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  const frontmatter: Record<string, string> = {}

  if (frontmatterMatch) {
    const yamlContent = frontmatterMatch[1]
    const lines = yamlContent.split('\n')

    for (const line of lines) {
      if (!line.trim()) continue
      const colonIndex = line.indexOf(':')
      if (colonIndex === -1) continue

      const key = line.substring(0, colonIndex).trim()
      let value = line.substring(colonIndex + 1).trim()

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      if (key) {
        frontmatter[key] = value
      }
    }
  }

  return frontmatter
}

/**
 * Validate blog posts from /posts/*.mdoc
 */
function validateBlogPosts(): ValidationResult[] {
  const results: ValidationResult[] = []
  const postsDir = path.join(process.cwd(), 'posts')

  if (!fs.existsSync(postsDir)) {
    return results
  }

  const mdocFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdoc'))

  for (const file of mdocFiles) {
    const filePath = path.join(postsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const frontmatter = extractFrontmatter(content)

    // Validate title (will get suffix added)
    if (frontmatter.title) {
      const title = frontmatter.title
      const finalTitleLength = title.length + SUFFIX.length

      if (finalTitleLength > TITLE_MAX_LENGTH) {
        results.push({
          file: `posts/${file}`,
          field: 'title',
          value: title,
          length: finalTitleLength,
          maxLength: TITLE_MAX_LENGTH,
          valid: false,
          error: `Title with suffix exceeds ${TITLE_MAX_LENGTH} chars (${finalTitleLength} chars). Max title length: ${TITLE_WITH_SUFFIX_MAX}`
        })
      } else {
        results.push({
          file: `posts/${file}`,
          field: 'title',
          value: title,
          length: finalTitleLength,
          maxLength: TITLE_MAX_LENGTH,
          valid: true
        })
      }
    }

    // Validate excerpt
    if (frontmatter.excerpt) {
      const excerpt = frontmatter.excerpt

      if (excerpt.length > DESCRIPTION_MAX_LENGTH) {
        results.push({
          file: `posts/${file}`,
          field: 'excerpt',
          value: excerpt,
          length: excerpt.length,
          maxLength: DESCRIPTION_MAX_LENGTH,
          valid: false,
          error: `Excerpt exceeds ${DESCRIPTION_MAX_LENGTH} chars (${excerpt.length} chars)`
        })
      } else if (excerpt.length < DESCRIPTION_MIN_LENGTH) {
        results.push({
          file: `posts/${file}`,
          field: 'excerpt',
          value: excerpt,
          length: excerpt.length,
          minLength: DESCRIPTION_MIN_LENGTH,
          valid: false,
          error: `Excerpt is below recommended minimum ${DESCRIPTION_MIN_LENGTH} chars (${excerpt.length} chars)`
        })
      } else {
        results.push({
          file: `posts/${file}`,
          field: 'excerpt',
          value: excerpt,
          length: excerpt.length,
          maxLength: DESCRIPTION_MAX_LENGTH,
          valid: true
        })
      }
    } else {
      results.push({
        file: `posts/${file}`,
        field: 'excerpt',
        value: '',
        length: 0,
        maxLength: DESCRIPTION_MAX_LENGTH,
        valid: false,
        error: 'Missing excerpt field'
      })
    }
  }

  return results
}

/**
 * Validate centralized SEO data from src/lib/seo.ts
 */
function validateCentralizedSEO(): ValidationResult[] {
  const results: ValidationResult[] = []

  try {
    const seoPath = path.join(process.cwd(), 'src', 'lib', 'seo.ts')
    const content = fs.readFileSync(seoPath, 'utf-8')

    // Find each metadata object by matching key: { ... }
    // Use a more robust approach to handle quotes inside strings
    const objectPattern = /(\w+)\s*:\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g
    let match

    while ((match = objectPattern.exec(content)) !== null) {
      const key = match[1]
      const objectContent = match[2]

      // Only process pageMetaData entries (they contain title, description, keywords, canonical)
      if (!objectContent.includes('title') || !objectContent.includes('description')) {
        continue
      }

      // Extract title - look for title: "..."
      const titleMatch = objectContent.match(/title\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
      if (titleMatch) {
        const title = titleMatch[1]

        if (title.length > TITLE_MAX_LENGTH) {
          results.push({
            file: `src/lib/seo.ts (${key})`,
            field: 'title',
            value: title,
            length: title.length,
            maxLength: TITLE_MAX_LENGTH,
            valid: false,
            error: `Title exceeds ${TITLE_MAX_LENGTH} chars (${title.length} chars)`
          })
        } else {
          results.push({
            file: `src/lib/seo.ts (${key})`,
            field: 'title',
            value: title,
            length: title.length,
            maxLength: TITLE_MAX_LENGTH,
            valid: true
          })
        }
      }

      // Extract description - look for description: "..."
      const descMatch = objectContent.match(/description\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
      if (descMatch) {
        const description = descMatch[1]

        if (description.length > DESCRIPTION_MAX_LENGTH) {
          results.push({
            file: `src/lib/seo.ts (${key})`,
            field: 'description',
            value: description,
            length: description.length,
            maxLength: DESCRIPTION_MAX_LENGTH,
            valid: false,
            error: `Description exceeds ${DESCRIPTION_MAX_LENGTH} chars (${description.length} chars)`
          })
        } else if (description.length < DESCRIPTION_MIN_LENGTH) {
          results.push({
            file: `src/lib/seo.ts (${key})`,
            field: 'description',
            value: description,
            length: description.length,
            minLength: DESCRIPTION_MIN_LENGTH,
            valid: false,
            error: `Description is below recommended minimum ${DESCRIPTION_MIN_LENGTH} chars (${description.length} chars)`
          })
        } else {
          results.push({
            file: `src/lib/seo.ts (${key})`,
            field: 'description',
            value: description,
            length: description.length,
            maxLength: DESCRIPTION_MAX_LENGTH,
            valid: true
          })
        }
      }
    }
  } catch (error) {
    console.warn('Warning: Could not parse src/lib/seo.ts - skipping validation')
  }

  return results
}

/**
 * Validate solutions data from src/data/solutions.tsx
 */
function validateSolutionsData(): ValidationResult[] {
  const results: ValidationResult[] = []

  try {
    const solutionsPath = path.join(process.cwd(), 'src', 'data', 'solutions.tsx')
    const content = fs.readFileSync(solutionsPath, 'utf-8')

    // Match each solution object: { id: "...", title: "...", seoTitle: "...", shortDesc: "..." }
    const solutionMatches = content.matchAll(/{\s*id:\s*["']([^"']+)["'][^}]*?}/gs)

    for (const match of solutionMatches) {
      const solutionBlock = match[0]
      const id = match[1]

      // Extract seoTitle
      const seoTitleMatch = solutionBlock.match(/seoTitle\s*:\s*["']([^"']+)["']/)
      if (seoTitleMatch) {
        const seoTitle = seoTitleMatch[1]
        const finalTitleLength = seoTitle.length + SUFFIX.length

        if (finalTitleLength > TITLE_MAX_LENGTH) {
          results.push({
            file: `src/data/solutions.tsx (${id})`,
            field: 'seoTitle',
            value: seoTitle,
            length: finalTitleLength,
            maxLength: TITLE_MAX_LENGTH,
            valid: false,
            error: `SEO Title with suffix exceeds ${TITLE_MAX_LENGTH} chars (${finalTitleLength} chars). Max title length: ${TITLE_WITH_SUFFIX_MAX}`
          })
        } else {
          results.push({
            file: `src/data/solutions.tsx (${id})`,
            field: 'seoTitle',
            value: seoTitle,
            length: finalTitleLength,
            maxLength: TITLE_MAX_LENGTH,
            valid: true
          })
        }
      }

      // Extract shortDesc
      const shortDescMatch = solutionBlock.match(/shortDesc\s*:\s*["']([^"']+)["']/)
      if (shortDescMatch) {
        const shortDesc = shortDescMatch[1]

        if (shortDesc.length > DESCRIPTION_MAX_LENGTH) {
          results.push({
            file: `src/data/solutions.tsx (${id})`,
            field: 'shortDesc',
            value: shortDesc,
            length: shortDesc.length,
            maxLength: DESCRIPTION_MAX_LENGTH,
            valid: false,
            error: `Short description exceeds ${DESCRIPTION_MAX_LENGTH} chars (${shortDesc.length} chars)`
          })
        } else if (shortDesc.length < DESCRIPTION_MIN_LENGTH) {
          results.push({
            file: `src/data/solutions.tsx (${id})`,
            field: 'shortDesc',
            value: shortDesc,
            length: shortDesc.length,
            minLength: DESCRIPTION_MIN_LENGTH,
            valid: false,
            error: `Short description is below recommended minimum ${DESCRIPTION_MIN_LENGTH} chars (${shortDesc.length} chars)`
          })
        } else {
          results.push({
            file: `src/data/solutions.tsx (${id})`,
            field: 'shortDesc',
            value: shortDesc,
            length: shortDesc.length,
            maxLength: DESCRIPTION_MAX_LENGTH,
            valid: true
          })
        }
      }
    }
  } catch (error) {
    console.warn('Warning: Could not parse src/data/solutions.tsx - skipping validation')
  }

  return results
}

/**
 * Validate inline `export const metadata` blocks in src/app/.../page.tsx.
 * These render as-is (no " | Serve Funding" suffix appended), so titles are
 * checked at full length. Pages that pull metadata from src/lib/seo.ts have no
 * inline string literal and are skipped here (covered by validateCentralizedSEO).
 */
function validateAppPageMetadata(): ValidationResult[] {
  const results: ValidationResult[] = []
  const appDir = path.join(process.cwd(), 'src', 'app')

  if (!fs.existsSync(appDir)) {
    return results
  }

  const pages: string[] = []
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name === 'page.tsx') pages.push(full)
    }
  }
  walk(appDir)

  for (const filePath of pages) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const idx = content.indexOf('export const metadata')
    if (idx === -1) continue

    // Scope to the metadata object so we read its top-level title/description,
    // not an openGraph or nested value further down the block.
    const block = content.slice(idx, idx + 1500)
    const file = path.relative(process.cwd(), filePath)

    const title = extractStringLiteral(block, 'title')
    if (title !== null) {
      const valid = title.length <= TITLE_MAX_LENGTH
      results.push({
        file, field: 'title', value: title, length: title.length, maxLength: TITLE_MAX_LENGTH, valid,
        error: valid ? undefined : `Title exceeds ${TITLE_MAX_LENGTH} chars (${title.length} chars)`
      })
    }

    const description = extractStringLiteral(block, 'description')
    if (description !== null) {
      results.push(checkDescription(file, 'description', description))
    }
  }

  return results
}

/**
 * Validate title and excerpt fields in data files that become page metadata
 * (comparisons → /compare/[id], industries → /industries/[id],
 * funding-pages → /funding/[slug]).
 *
 * These titles get " | Serve Funding" appended by their templates, so they are
 * checked against TITLE_WITH_SUFFIX_MAX rather than TITLE_MAX_LENGTH. Dynamic
 * routes build metadata in generateMetadata() with no string literal to read,
 * so this function is the only gate covering them.
 */
function validateDataExcerpts(): ValidationResult[] {
  const results: ValidationResult[] = []
  const files = [
    'src/data/comparisons.ts',
    'src/data/industries.ts',
    'src/data/funding-pages.ts',
  ]

  for (const rel of files) {
    const filePath = path.join(process.cwd(), rel)
    if (!fs.existsSync(filePath)) continue

    const content = fs.readFileSync(filePath, 'utf-8')

    // Label each hit by the nearest preceding id so failures are easy to locate.
    const labelFor = (index: number) => {
      const idMatch = [...content.slice(0, index).matchAll(/id:\s*['"`]([^'"`]+)['"`]/g)].pop()
      return idMatch ? idMatch[1] : 'unknown'
    }

    const excerptRe = /excerpt:\s*('((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"|`((?:\\.|[^`\\])*)`)/g
    let m: RegExpExecArray | null

    while ((m = excerptRe.exec(content)) !== null) {
      const value = (m[2] ?? m[3] ?? m[4] ?? '').replace(/\\(['"`\\])/g, '$1')
      results.push(checkDescription(`${rel} (${labelFor(m.index)})`, 'excerpt', value))
    }

    const titleRe = /^\s*title:\s*('((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"|`((?:\\.|[^`\\])*)`)/gm
    while ((m = titleRe.exec(content)) !== null) {
      const value = (m[2] ?? m[3] ?? m[4] ?? '').replace(/\\(['"`\\])/g, '$1')
      const finalLength = value.length + SUFFIX.length
      const valid = finalLength <= TITLE_MAX_LENGTH
      results.push({
        file: `${rel} (${labelFor(m.index)})`,
        field: 'title',
        value,
        length: finalLength,
        maxLength: TITLE_MAX_LENGTH,
        valid,
        error: valid
          ? undefined
          : `Title with suffix exceeds ${TITLE_MAX_LENGTH} chars (${finalLength} chars). Max title length: ${TITLE_WITH_SUFFIX_MAX}`,
      })
    }
  }

  return results
}

/**
 * Display validation results in a clear format
 */
function displayResults(allResults: ValidationResult[]): void {
  const failures = allResults.filter(r => !r.valid)
  const successes = allResults.filter(r => r.valid)

  console.log('\n📋 SEO Validation Report\n')
  console.log(`✅ Valid: ${successes.length} fields`)

  if (failures.length > 0) {
    console.log(`\n❌ Failures (${failures.length}):\n`)

    failures.forEach((fail, index) => {
      console.log(`  ${index + 1}. ${fail.file}`)
      console.log(`     Field: ${fail.field}`)
      console.log(`     Error: ${fail.error}`)

      const preview = fail.value.substring(0, 75).replace(/\n/g, ' ')
      const endEllipsis = fail.value.length > 75 ? '...' : ''
      console.log(`     Value: "${preview}${endEllipsis}"`)
      console.log()
    })
  }

  console.log(`\n📊 Summary: ${successes.length}/${allResults.length} fields pass validation\n`)
}

/**
 * Main validation runner
 */
function validateAllSEO(): void {
  console.log('\n🔍 Starting SEO Validation...\n')

  const allResults = [
    ...validateBlogPosts(),
    ...validateCentralizedSEO(),
    ...validateSolutionsData(),
    ...validateAppPageMetadata(),
    ...validateDataExcerpts()
  ]

  if (allResults.length === 0) {
    console.log('⚠️  No SEO data found to validate')
    return
  }

  displayResults(allResults)

  const failures = allResults.filter(r => !r.valid)

  if (failures.length > 0) {
    console.error('❌ SEO Validation Failed')
    console.error('\nFix the errors above and try again.\n')
    console.error('Guidelines:')
    console.error(`  - Titles with " | Serve Funding" suffix must be ≤ ${TITLE_WITH_SUFFIX_MAX} chars`)
    console.error(`  - Descriptions must be ${DESCRIPTION_MIN_LENGTH}-${DESCRIPTION_MAX_LENGTH} chars`)
    console.error(`  - Blog post titles max: ${TITLE_WITH_SUFFIX_MAX} chars (suffix added by template)`)
    console.error(`  - Solution SEO titles max: ${TITLE_WITH_SUFFIX_MAX} chars (suffix added by template)\n`)
    process.exit(1)
  }

  console.log('✅ All SEO metadata passes validation\n')
  process.exit(0)
}

// Run validation
validateAllSEO()
