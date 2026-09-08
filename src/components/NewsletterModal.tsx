'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heading, Text } from '@/components/ui'
import { NewsletterModalForm } from '@/components/Forms'
import { useFormSubmit } from '@/hooks/useFormSubmit'
import { COLORS } from '@/lib/colors'

/**
 * Paths where this modal must never open. These are the pages a visitor is
 * already converting on — covering the form to ask for a newsletter signup
 * trades a lead for an email address, which is the wrong way round.
 *
 * /discover is the lead form itself: the modal was landing on top of question
 * one, on the page where 94 of 128 visitors never answered it.
 */
const SUPPRESSED_PATHS = ['/discover', '/call-confirmed', '/contact']

/** How long a dismissal or signup is remembered. */
const QUIET_DAYS = 30
const STORAGE_KEY = 'sf_newsletter_modal_last_seen'

/** Give the page its own first impression before interrupting it. */
const DELAY_MS = 25_000
/** ...or open once they have read far enough to be engaged, whichever first. */
const SCROLL_FRACTION = 0.5

function isInQuietPeriod(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const last = Number(raw)
    if (!Number.isFinite(last)) return false
    return Date.now() - last < QUIET_DAYS * 24 * 60 * 60 * 1000
  } catch {
    // Private mode, or storage blocked. Treat as never shown rather than
    // suppressing forever — but see markSeen: we also fail open there.
    return false
  }
}

function markSeen(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    // Nothing to do. Worst case the visitor sees it again next session.
  }
}

export function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { success, handleSubmit, formData, isSubmitting } = useFormSubmit(
    'newsletter_modal',
    'newsletter'
  )

  const dismiss = useCallback(() => {
    setIsOpen(false)
    markSeen()
  }, [])

  useEffect(() => {
    if (!pathname) return
    if (SUPPRESSED_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))) return
    if (isInQuietPeriod()) return

    let timer: ReturnType<typeof setTimeout> | undefined

    const open = () => {
      setIsOpen(true)
      // Count the impression immediately: the point of the quiet period is one
      // interruption per visitor per month, whether or not they engage with it.
      markSeen()
      cleanup()
    }

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      if (window.scrollY / scrollable >= SCROLL_FRACTION) open()
    }

    const cleanup = () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }

    timer = setTimeout(open, DELAY_MS)
    window.addEventListener('scroll', onScroll, { passive: true })

    return cleanup
  }, [pathname])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
            className="fixed inset-0 bg-black/50 z-[1000]"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-full max-w-xl z-[1001] max-h-[90vh] overflow-y-auto rounded-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-modal-title"
          >
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden relative">
              {/* Close button */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 z-[9999] cursor-pointer"
                aria-label="Close newsletter modal"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8 md:p-12" style={{ backgroundColor: COLORS.white }}>
                {/* Logo and Heading Section */}
                <div className="mb-6 sm:mb-8 flex justify-center">
                  <Image
                    src="/newsletter-logo.webp"
                    alt="Creative Working Capital Newsletter"
                    width={560}
                    height={210}
                    className="w-full max-w-xs sm:max-w-sm h-auto"
                    sizes="(max-width: 640px) 320px, 384px"
                    priority={false}
                  />
                </div>

                <Heading color="gradient" id="newsletter-modal-title" size="h3" className='!mt-6 sm:!mt-8 md:!mt-12'>
                  Sign-up for our newsletter
                </Heading>

                <Text className="opacity-80 mb-8 sm:mb-12 text-sm sm:text-base">
                  Receive exclusive access to monthly client success stories<br />and detailed credit criteria from our preferred lender network.
                </Text>

                {/* Form Section */}
                <div className="max-w-xl mx-auto">
                  <NewsletterModalForm
                    success={success}
                    handleSubmit={handleSubmit}
                    formData={formData}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
