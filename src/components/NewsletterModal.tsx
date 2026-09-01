'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heading, Text } from '@/components/ui'
import { NewsletterModalForm } from '@/components/Forms'
import { useFormSubmit } from '@/hooks/useFormSubmit'
import { COLORS } from '@/lib/colors'

export function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { success, handleSubmit, formData, isSubmitting } = useFormSubmit(
    'newsletter_modal',
    'newsletter'
  )

  useEffect(() => {
    const showModal = () => {
      setIsOpen(true)
    }

    // Show modal after page load
    if (document.readyState === 'complete') {
      showModal()
    } else {
      window.addEventListener('load', showModal)
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', showModal)
    }
  }, [])

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
            onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
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
