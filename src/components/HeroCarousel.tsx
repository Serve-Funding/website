'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Heading, Text, Container, Button } from '@/components/ui'

interface HeroSlide {
  heading: string | React.ReactNode
  desc: string | React.ReactNode
  image: string
  width: number
  height: number
}

interface HeroCta {
  label: string
  href: string
  /** One short line of reassurance under the button. */
  note?: string
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  /**
   * The hero's call to action. Constant across slides on purpose — it is the
   * page's primary action, not a property of whichever slide is showing.
   */
  cta?: HeroCta
}

export function HeroCarousel({ slides, cta }: HeroCarouselProps) {
  const [heroIndex, setHeroIndex] = React.useState(0)
  const [isUserInteracting, setIsUserInteracting] = React.useState(false)
  const [pageLoaded, setPageLoaded] = React.useState(false)

  // Wait for page to load before enabling carousel auto-rotation
  React.useEffect(() => {
    if (document.readyState === 'complete') {
      setPageLoaded(true)
    } else {
      const handleLoad = () => setPageLoaded(true)
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  React.useEffect(() => {
    if (isUserInteracting || !pageLoaded) return

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % slides.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [isUserInteracting, pageLoaded, slides.length])

  const handlePrev = () => {
    setHeroIndex((prev) => (prev - 1 + slides.length) % slides.length)
    setIsUserInteracting(true)
    setTimeout(() => setIsUserInteracting(false), 8000)
  }

  const handleNext = () => {
    setHeroIndex((prev) => (prev + 1) % slides.length)
    setIsUserInteracting(true)
    setTimeout(() => setIsUserInteracting(false), 8000)
  }

  const slide = slides[heroIndex]

  return (
    <Container className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center lg:items-stretch h-full pb-6">
      {/* Text Column */}
      <div className="relative z-20 w-full lg:flex-[0.5] lg:min-w-0 flex flex-col justify-center">
        <Heading key={`heading-${heroIndex}`} size="hero" className="text-gray-800">
          {slide.heading}
        </Heading>
        <Text size="2xl" className="mb-6 lg:mb-8 text-gray-700">
          {slide.desc}
        </Text>

        {/* One button row: the CTA, then the slide controls to its right (Tim,
            Sep 10 call). The arrows once sat in a second row underneath, which
            read as two competing layers of buttons. They stay quieter than the
            CTA on purpose — the next-slide arrow was once the darkest element
            in the hero, which made "see another slide" read as the primary
            action. */}
        <div className="flex items-start gap-3 sm:gap-4">
          {cta && (
            <div className="inline-flex flex-col items-center">
              <Link href={cta.href}>
                <Button variant="gold" size="lg">
                  {cta.label}
                </Button>
              </Link>
              {cta.note && (
                <Text size="sm" className="mt-2 text-gray-500">
                  {cta.note}
                </Text>
              )}
            </div>
          )}
          {/* h-14 matches the lg button so the arrows centre on it, not on the
              button-plus-note block. */}
          <div className="flex h-14 items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-olive-900 hover:text-white transition-all duration-300 flex-shrink-0"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-olive-900 hover:text-white transition-all duration-300 flex-shrink-0"
              aria-label="Next slide"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Column - full height */}
      <div className="relative w-full lg:flex-[0.5] lg:min-w-0 min-h-[300px] lg:min-h-0 rounded-2xl overflow-hidden shadow-lg">
        {slides.map((s, index) => (
          <Image
            key={s.image}
            src={s.image}
            alt={typeof s.heading === 'string' ? s.heading : 'Hero slide image'}
            fill
            className={`object-cover transition-opacity duration-500 ease-out ${
              index === heroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            priority={index === 0}
            loading="eager"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={85}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        ))}
      </div>
    </Container>
  )
}
