import type { Metadata } from 'next'
import { Container, Heading, Text, Section } from '@/components/ui'
import { Breadcrumb } from '@/components/breadcrumb'
import { COLORS as BRAND_COLORS } from '@/lib/colors'

export const metadata: Metadata = {
  title: 'SMS Terms of Service | Serve Funding',
  description: 'Terms governing SMS/text messages from Serve Funding: opt-in, message frequency, message and data rates, and how to opt out by replying STOP.',
  robots: 'index, follow',
  alternates: { canonical: 'https://servefunding.com/sms-terms' },
  openGraph: {
    title: 'SMS Terms of Service | Serve Funding',
    description: 'Terms governing SMS/text messages from Serve Funding: opt-in, message frequency, message and data rates, and how to opt out by replying STOP.',
    url: 'https://servefunding.com/sms-terms',
    type: 'website',
    images: [
      {
        url: 'https://servefunding.com/home/right%20funding%20solutions.webp',
        width: 960,
        height: 628,
        alt: 'Serve Funding SMS Terms of Service',
      },
    ],
  },
}

export default function SmsTerms() {
  return (
    <>
      {/* Breadcrumb - includes schema */}
      <Breadcrumb items={[{ label: 'SMS Terms of Service' }]} />

      {/* Hero Section */}
      <Section className="pt-0 pb-0 md:py-0 overflow-hidden" style={{ backgroundColor: BRAND_COLORS.primary }}>
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[300px] py-16 text-center">
            <Heading size="h1" color="white" className="mb-4">
              SMS Terms of Service
            </Heading>
            <Text size="2xl" className="text-white/90 max-w-3xl">
              Last Updated: July 22, 2026
            </Text>
          </div>
        </Container>
      </Section>

      {/* Content Section */}
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto prose prose-lg">
            {/* Program Description */}
            <div className="mb-12">
              <Text className="text-gray-700 mb-4">
                Serve Funding, LLC sends conversational and account-related text messages to clients and prospects who contact us or otherwise consent to receive them. We use SMS to follow up on financing inquiries, coordinate documents, and provide updates on active applications.
              </Text>
            </div>

            {/* Terms */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                Program Terms
              </Heading>
              <ul className="list-disc list-inside text-gray-700 space-y-3">
                <li>
                  <strong>Message frequency varies</strong> based on your activity and conversations with our team.
                </li>
                <li>
                  <strong>Message and data rates may apply.</strong> If you have questions about your text or data plan, contact your wireless provider.
                </li>
                <li>
                  Reply <strong>STOP</strong> to unsubscribe at any time. You will receive a confirmation and no further messages.
                </li>
                <li>
                  Reply <strong>HELP</strong> for help, or contact us at deals@servefunding.com or +1 770-820-7409.
                </li>
                <li>
                  Carriers are not liable for delayed or undelivered messages.
                </li>
              </ul>
            </div>

            {/* Consent */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                Consent
              </Heading>
              <Text className="text-gray-700 mb-4">
                You opt in to receive text messages from us by providing your mobile number and agreeing to be contacted by text — for example, by checking the SMS consent box on one of our website forms, by texting us first, or by requesting text updates during a conversation with our team. Consent to receive text messages is not a condition of receiving any of our services.
              </Text>
              <Text className="text-gray-700">
                Mobile phone numbers and SMS opt-in consent are never sold, rented, or shared with third parties or affiliates for their own marketing or promotional purposes.
              </Text>
            </div>

            {/* Privacy */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                Privacy
              </Heading>
              <Text className="text-gray-700">
                For details on how we handle your information, see our{' '}
                <a href="/privacy-policy" className="text-olive-900 underline hover:text-olive-700">Privacy Policy</a>.
              </Text>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
