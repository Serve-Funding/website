'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { X, Send, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS as BRAND_COLORS } from '@/lib/colors'
import { trackChatbotSessionStart, trackChatbotMessage } from '@/lib/tracking'
import { Button } from '@/components/ui'
import { fundingSolutions } from '@/data/solutions'
import { comparisons } from '@/data/comparisons'
import { industries } from '@/data/industries'
import { getTitleAsString } from '@/lib/solution-helpers'

// Resolve an internal URL to a short, human-readable label for the inline pill chips.
function labelForUrl(url: string): string {
  if (!url.startsWith('/')) return url
  const clean = url.replace(/\/$/, '')

  if (clean.startsWith('/solutions/')) {
    const id = clean.replace('/solutions/', '')
    const s = fundingSolutions.find((x) => x.id === id)
    if (s) return getTitleAsString(s.title)
  }
  if (clean.startsWith('/compare/')) {
    const id = clean.replace('/compare/', '')
    const c = comparisons.find((x) => x.id === id)
    if (c) return c.title
  }
  if (clean.startsWith('/industries/')) {
    const id = clean.replace('/industries/', '')
    const i = industries.find((x) => x.id === id)
    if (i) return i.title
  }

  const pageNames: Record<string, string> = {
    '/faq': 'FAQ',
    '/fundings': 'Case Studies',
    '/bankers': 'For Bankers',
    '/partners': 'Partners',
    '/glossary': 'Glossary',
    '/capital-strategy': 'Capital Strategy',
    '/about-us': 'About',
    '/contact-us': 'Contact',
    '/discover': 'Get Started',
    '/blog': 'Blog',
    '/solutions': 'Solutions',
  }
  if (pageNames[clean]) return pageNames[clean]

  const last = clean.split('/').filter(Boolean).pop() || clean
  return last.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Page-aware contextual hook: maps the visitor's current pathname to a short
// "Are you interested in..." nudge and a matching opener for the chat.
function getContextualHint(pathname: string): { hook: string; opener: string } | null {
  if (!pathname || pathname === '/discover') return null

  if (pathname === '/') {
    return {
      hook: 'Want help finding the right capital for your business?',
      opener: "Hi. I can help you think through what kind of capital fits your situation. What's on your mind?",
    }
  }

  if (pathname.startsWith('/solutions/')) {
    const id = pathname.replace('/solutions/', '').replace(/\/$/, '')
    if (id === 'compare' || id === '') return {
      hook: 'Exploring funding options? I can help!',
      opener: "Looks like you're weighing options. Tell me a bit about your situation and I'll point you toward the one that actually fits.",
    }
    const solution = fundingSolutions.find((s) => s.id === id)
    if (solution) {
      const title = getTitleAsString(solution.title)
      return {
        hook: `Curious how ${title.toLowerCase()} would work for your business?`,
        opener: `I see you're reading about ${title}. Want to walk through whether this fits your situation, or compare it to something else?`,
      }
    }
  }

  if (pathname.startsWith('/compare/')) {
    const id = pathname.replace('/compare/', '').replace(/\/$/, '')
    const comp = comparisons.find((c) => c.id === id)
    if (comp) {
      return {
        hook: `Trying to decide between ${comp.productA.name} and ${comp.productB.name}?`,
        opener: `${comp.productA.name} vs ${comp.productB.name}. Happy to talk through which one would actually fit. What's your situation?`,
      }
    }
    return {
      hook: 'Comparing two products and not sure which to pick?',
      opener: "Comparison pages can only go so far. Want to tell me about your situation and I'll point you to the one that actually fits?",
    }
  }

  if (pathname.startsWith('/industries/')) {
    const id = pathname.replace('/industries/', '').replace(/\/$/, '')
    const ind = industries.find((i) => i.id === id)
    if (ind) {
      return {
        hook: `Looking for capital in ${ind.id.replace(/-/g, ' ')}?`,
        opener: `Looks like you're in ${ind.id.replace(/-/g, ' ')}. We do a lot of work in this space. What's the capital need you're trying to solve?`,
      }
    }
  }

  if (pathname.startsWith('/blog/')) {
    return {
      hook: 'Have a question on what you just read?',
      opener: 'Reading something specific? I can help connect it to your situation. What brought you to this article?',
    }
  }

  if (pathname === '/glossary' || pathname.startsWith('/glossary')) {
    return {
      hook: 'Want any of these terms explained in plain English?',
      opener: "Glossary's a starting point. Want me to break any of these down or talk through how they actually apply to your situation?",
    }
  }

  if (pathname === '/faq') {
    return {
      hook: "Don't see your specific question?",
      opener: "FAQs cover the basics. What's the question that's not on the page?",
    }
  }

  if (pathname === '/bankers') {
    return {
      hook: 'Have a client situation you want to talk through?',
      opener: "Banker here? Happy to walk through a specific client situation. What kind of deal are you trying to get done?",
    }
  }

  if (pathname === '/capital-strategy') {
    return {
      hook: 'Wondering which capital stack fits your goal?',
      opener: "Capital strategy is about matching the structure to the goal. What's the goal you're trying to fund?",
    }
  }

  if (pathname === '/partners') {
    return {
      hook: 'Interested in partnering with us?',
      opener: "Looking to partner? Tell me a bit about your practice and the kinds of clients you serve.",
    }
  }

  if (pathname === '/fundings') {
    return {
      hook: 'Want to know if your deal could be next?',
      opener: "Case studies are real deals. Tell me about your situation and I'll tell you honestly whether we'd be a fit.",
    }
  }

  // Default fallback for any other page
  return {
    hook: 'Got a funding question I can help with?',
    opener: "What brought you here today? Happy to help you think through it.",
  }
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  actionButtons?: Array<{ label: string; action: string }>
}

// Loading bubble that rotates through "thinking" phrases so the visitor knows
// something useful is happening while the model is generating a reply.
function ThinkingBubble() {
  const phrases = [
    'Thinking…',
    'Pulling the right pages…',
    'Looking at your situation…',
    'Drafting a clear answer…',
    'Checking the funding options…',
  ]
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % phrases.length), 1800)
    return () => clearInterval(t)
  }, [phrases.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg rounded-bl-none flex items-center gap-2.5">
        <AnimatePresence mode="wait">
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-sm italic"
          >
            {phrases[idx]}
          </motion.span>
        </AnimatePresence>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </div>
    </motion.div>
  )
}

// Render text with bare URLs replaced by pill chips (internal) or underlined links (external).
// Also collapses the "Name (/path)" pattern so the chip stands alone without empty parens.
function renderTextWithLinks(text: string): React.ReactNode {
  const linkPattern = /(https?:\/\/[^\s)]+|\/(?:solutions|blog|industries|compare|glossary|bankers|faq|fundings|partners|capital-strategy|about-us|contact-us|discover)\/?[\w-]*(?:#[\w\-:%~,.]+)?)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = linkPattern.exec(text)) !== null) {
    let preceding = text.slice(lastIndex, match.index)
    const url = match[0].replace(/[.,;:!?)]+$/, '') // trim trailing punctuation
    let trailing = match[0].slice(url.length)
    const isExternal = url.startsWith('http')

    const afterChar = text[match.index + match[0].length] || ''
    // Eat the "Name ( ... )" wrapping parens if both sides are present.
    if (!isExternal && /\s\($/.test(preceding) && afterChar === ')') {
      preceding = preceding.replace(/\s\($/, ' ')
      trailing = '' // we'll skip the close-paren below
      lastIndex = match.index + match[0].length + 1
    } else {
      lastIndex = match.index + match[0].length
    }

    if (preceding) parts.push(preceding)

    parts.push(
      isExternal ? (
        <a
          key={key++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: BRAND_COLORS.primary }}
        >
          {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </a>
      ) : (
        // Use Next Link for internal paths so the chat state persists across navigation
        // (the Chatbot lives in the root layout, so soft-nav keeps the conversation).
        <Link
          key={key++}
          href={url}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold no-underline align-baseline transition-colors hover:brightness-95"
          style={{
            backgroundColor: `${BRAND_COLORS.primary}14`,
            color: BRAND_COLORS.primary,
            border: `1px solid ${BRAND_COLORS.primary}33`,
            whiteSpace: 'nowrap',
          }}
        >
          {labelForUrl(url)}
          <ArrowUpRight size={11} strokeWidth={2.5} aria-hidden />
        </Link>
      )
    )
    if (trailing) parts.push(trailing)
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts.length > 0 ? parts : text
}

interface ChatbotProps {
  userRole?: string
}

export function Chatbot({ userRole }: ChatbotProps = {}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [aiContext, setAiContext] = useState('')
  const [storedUserRole] = useState<string | undefined>(userRole)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [showContextual, setShowContextual] = useState(false)
  const [contextualDismissed, setContextualDismissed] = useState(false)
  const contextualHint = getContextualHint(pathname || '/')
  const sessionIdRef = useRef<string>(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  )
  // Latest transcript; 90s debounce lives on the server (Resend scheduledAt).
  const pendingTranscriptRef = useRef<Array<{ sender: 'user' | 'bot'; text: string; timestamp: string }> | null>(null)
  const lastSentLengthRef = useRef<number>(0)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to Serve Funding! 👋 Feel free to ask me anything about our services, funding solutions, or how we can help your business grow.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)


  // Enable VirtualKeyboard API for Chrome to handle keyboard overlays
  useEffect(() => {
    if ('virtualKeyboard' in navigator) {
      (navigator as any).virtualKeyboard.overlaysContent = true
    }
  }, [])

  // Track chatbot session start
  useEffect(() => {
    if (isOpen) {
      trackChatbotSessionStart()
    }
  }, [isOpen])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView()
    }
  }, [messages, isOpen, isLoading])

  // Show pill only after the user starts scrolling. Hide when they return to top.
  useEffect(() => {
    const SCROLL_THRESHOLD = 200
    const handle = () => setHasScrolled(window.scrollY > SCROLL_THRESHOLD)
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  // Reset contextual nudge whenever the page changes, then show it after engagement delay
  useEffect(() => {
    setShowContextual(false)
    setContextualDismissed(false)
    if (!contextualHint) return
    const timer = setTimeout(() => {
      setShowContextual(true)
    }, 12000) // 12s on page = engagement signal
    return () => clearTimeout(timer)
  }, [pathname, contextualHint])

  // Push the pending transcript to /api/notify. flushImmediate skips the server's 90s debounce.
  const flushNotify = useCallback((useBeacon = false, flushImmediate = false) => {
    const transcript = pendingTranscriptRef.current
    if (!transcript || transcript.length === 0) return
    if (transcript.length <= lastSentLengthRef.current && !flushImmediate) return
    const payload = JSON.stringify({
      type: 'chat_message',
      sessionId: sessionIdRef.current,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      name: 'Chat Visitor',
      email: 'chat@servefunding.com',
      transcript,
      flushImmediate,
    })
    lastSentLengthRef.current = transcript.length
    if (useBeacon && typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon('/api/notify', blob)
    } else {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => { /* non-blocking */ })
    }
  }, [])

  const queueNotify = useCallback((transcript: Array<{ sender: 'user' | 'bot'; text: string; timestamp: string }>) => {
    pendingTranscriptRef.current = transcript
    flushNotify(false)
  }, [flushNotify])

  // Force-flush on page unload / tab hidden — survives navigation away.
  useEffect(() => {
    const onUnload = () => flushNotify(true)
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushNotify(true)
    }
    window.addEventListener('beforeunload', onUnload)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('beforeunload', onUnload)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [flushNotify])

  // Flush when the chat panel is closed (user signal that engagement paused).
  useEffect(() => {
    if (!isOpen) flushNotify(false)
  }, [isOpen, flushNotify])

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return

    // Track message sent with preview
    trackChatbotMessage(undefined, inputValue)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Get AI response with conversation history and user role
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory: messages,
          userRole: storedUserRole,
        }),
      })
      const data = await apiResponse.json()

      if (data.error) {
        console.error('Chat API returned error:', data.error)
        throw new Error(data.error)
      }

      const reply: string | undefined = data.reply
      if (!reply) throw new Error('Empty reply from chat API')

      // Try to parse as structured JSON; if it fails, treat as plain text reply.
      let displayText = reply
      let showForm = false
      let context = ''
      try {
        const parsed = JSON.parse(reply)
        if (parsed && typeof parsed === 'object') {
          displayText = parsed.message || reply
          showForm = parsed.showForm === true
          context = parsed.context || ''
        }
      } catch {
        // Plain-text reply (structured-outputs didn't kick in) — render as-is.
      }

      if (showForm) {
        setAiContext(context)
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: displayText,
        sender: 'bot',
        timestamp: new Date(),
        actionButtons: showForm ? [
          { label: "Schedule a Call", action: 'open_calendly' }
        ] : undefined
      }
      // Update state with the pure updater (React Strict Mode double-invokes this in dev).
      setMessages((prev) => [...prev, botMessage])

      // Queue the latest transcript for the debounced email send. We do NOT email
      // after every turn — we wait until the visitor stops engaging (90s idle),
      // closes the chat, or leaves the page. Then a single email goes out.
      const transcript = [...messages, userMessage, botMessage].map((m) => ({
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp.toISOString(),
      }))
      queueNotify(transcript)
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, messages])

  const handleActionButtonClick = useCallback((action: string) => {
    if (action === 'open_calendly') {
      // High-intent moment — flush immediately, skip the 90s debounce.
      flushNotify(false, true)

      const baseUrl = 'https://calendly.com/michael_kodinsky/discovery'
      const now = new Date()
      const monthParam = now.toISOString().split('T')[0].substring(0, 7) // YYYY-MM format
      const params = new URLSearchParams({
        month: monthParam,
        a1: aiContext || 'I want to learn more about your services',
        date: now.toISOString().split('T')[0],
      })
      const calendlyUrl = `${baseUrl}?${params.toString()}`
      window.open(calendlyUrl, '_blank')
    }
  }, [aiContext, flushNotify])


  // Hide chatbot on the discover page (has its own inline AI chat)
  if (pathname === '/discover') return null

  return (
    <>
      {/* Slide-in-from-right contextual notification (like an incoming message) */}
      <AnimatePresence>
        {!isOpen && hasScrolled && showContextual && !contextualDismissed && contextualHint && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              bottom: '76px',
              right: '20px',
              zIndex: 41,
              maxWidth: 'min(360px, calc(100vw - 40px))',
            }}
          >
            <div
              style={{
                position: 'relative',
                backgroundColor: '#ffffff',
                border: `1.5px solid ${BRAND_COLORS.primary}22`,
                borderRadius: '14px',
                padding: '14px 16px 14px 18px',
                boxShadow: '0 10px 30px rgba(42, 35, 26, 0.18)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              {/* Red unread badge */}
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '-6px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#e53935',
                  border: '2px solid #ffffff',
                  boxShadow: '0 2px 6px rgba(229, 57, 53, 0.5)',
                }}
                aria-hidden
              />

              <Image src="/navigator-icon.svg" alt="" width={20} height={20} unoptimized aria-hidden style={{ flexShrink: 0, marginTop: '2px' }} />

              <button
                onClick={() => {
                  setIsOpen(true)
                  setMessages([{
                    id: '1',
                    text: contextualHint.opener,
                    sender: 'bot',
                    timestamp: new Date(),
                  }])
                  setShowContextual(false)
                }}
                className="text-left flex-1 cursor-pointer"
                style={{ color: BRAND_COLORS.primary }}
              >
                <span className="block text-xs font-semibold mb-1" style={{ color: BRAND_COLORS.secondary }}>
                  Serve Funding Navigator
                </span>
                <span className="block text-sm leading-snug">{contextualHint.hook}</span>
                <span className="block text-xs mt-1.5 font-medium" style={{ color: BRAND_COLORS.secondary }}>
                  Tap to chat →
                </span>
              </button>

              <button
                onClick={() => setContextualDismissed(true)}
                aria-label="Dismiss"
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0 -mr-1 -mt-1 p-1"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered Bottom Trigger (replaces bottom-right circle) */}
      <AnimatePresence>
        {!isOpen && hasScrolled && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              pointerEvents: 'none',
              zIndex: 40,
              padding: '0 16px',
            }}
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              animate={{
                borderColor: [
                  `${BRAND_COLORS.primary}55`,
                  `${BRAND_COLORS.highlight}cc`,
                  `${BRAND_COLORS.primary}55`,
                ],
                boxShadow: [
                  '0 -2px 14px rgba(201, 156, 66, 0.18), 0 -6px 28px rgba(201, 156, 66, 0.08)',
                  '0 -2px 22px rgba(239, 224, 115, 0.55), 0 -8px 44px rgba(201, 156, 66, 0.30)',
                  '0 -2px 14px rgba(201, 156, 66, 0.18), 0 -6px 28px rgba(201, 156, 66, 0.08)',
                ],
              }}
              transition={{
                borderColor: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                boxShadow: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
              }}
              whileHover={{
                backgroundColor: BRAND_COLORS.background,
                borderColor: BRAND_COLORS.highlight,
                boxShadow:
                  '0 -2px 28px rgba(239, 224, 115, 0.75), 0 -10px 56px rgba(201, 156, 66, 0.42), inset 0 1px 0 rgba(255,255,255,0.65)',
                transition: { duration: 0.25, ease: 'easeOut' },
              }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 px-7 py-3.5 pb-4 cursor-pointer"
              style={{
                pointerEvents: 'auto',
                backgroundColor: '#ffffff',
                borderWidth: '1.5px 1.5px 0 1.5px',
                borderStyle: 'solid',
                borderRadius: '16px 16px 0 0',
                color: BRAND_COLORS.primary,
                maxWidth: '100%',
              }}
              aria-label="Open Serve Funding Navigator chat"
            >
              <Image src="/navigator-icon.svg" alt="" width={22} height={22} unoptimized aria-hidden />
              <span className="text-left">
                <span className="block text-base font-semibold leading-tight">Ask the Navigator</span>
                <span className="block text-xs text-gray-600 font-normal leading-tight mt-0.5">Capital that serves you</span>
              </span>
              <span
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                style={{ color: BRAND_COLORS.secondary }}
                aria-hidden
              >
                →
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window — centered, expanding poppy panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-[min(640px,calc(100vw-32px))] sm:h-[min(720px,calc(100vh-48px))] bg-white rounded-none sm:rounded-3xl shadow-2xl flex flex-col z-50"
            style={{
              // Mobile: full viewport height with keyboard handling
              height: typeof window !== 'undefined' && window.innerWidth < 640 ? '100vh' : undefined,
              // @ts-ignore - dvh is valid CSS but TypeScript doesn't recognize it yet
              height: typeof window !== 'undefined' && window.innerWidth < 640 ? '100dvh' : undefined,
              maxHeight: typeof window !== 'undefined' && window.innerWidth < 640 ? 'calc(100dvh - env(keyboard-inset-height, 0px))' : undefined,
              border: typeof window !== 'undefined' && window.innerWidth >= 640 ? `2px solid ${BRAND_COLORS.secondary}33` : undefined,
            }}
            role="dialog"
            aria-label="Serve Funding Chat Assistant"
          >
            {/* Header — brand icon + gradient text, no border, minimal */}
            <div className="px-6 py-4 rounded-none sm:rounded-t-3xl flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Image src="/navigator-icon.svg" alt="" width={22} height={22} unoptimized aria-hidden />
                <h3
                  className="text-lg font-bold leading-tight"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%)`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Serve Funding Navigator
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" role="log" aria-label="Chat messages">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    style={{
                      backgroundColor: message.sender === 'user' ? BRAND_COLORS.background : '#f3f4f6',
                      color: message.sender === 'user' ? '#333333' : '#1f2937',
                    }}
                    className={`max-w-[85%] sm:max-w-[70%] px-4 py-2 rounded-lg break-words ${
                      message.sender === 'user'
                        ? 'rounded-br-none'
                        : 'rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{renderTextWithLinks(message.text)}</p>
                  </div>
                  {/* Action Buttons */}
                  {message.actionButtons && message.actionButtons.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {message.actionButtons.map((btn, idx) => (
                        <Button
                          key={idx}
                          onClick={() => handleActionButtonClick(btn.action)}
                          variant="default"
                          className="hover:-translate-y-0.5"
                        >
                          {btn.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && <ThinkingBubble />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 rounded-none sm:rounded-b-2xl flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Ask a question..."
                  style={{
                    borderColor: BRAND_COLORS.secondary,
                  } as React.CSSProperties}
                  className="w-full px-4 py-4 pr-8 border rounded-lg focus:outline-none transition-all text-base bg-gray-50"
                  disabled={isLoading}
                  aria-label="Chat message input"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  style={{
                    color: BRAND_COLORS.primary,
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
              {/* AI Disclaimer */}
              <div className="mt-2">
                <p className="text-xs text-gray-400 text-center">
                  AI can make mistakes. For important funding decisions, please speak with our team directly.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}
