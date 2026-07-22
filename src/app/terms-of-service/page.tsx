import type { Metadata } from 'next'
import { Container, Heading, Text, Section } from '@/components/ui'
import { Breadcrumb } from '@/components/breadcrumb'
import { COLORS as BRAND_COLORS } from '@/lib/colors'

export const metadata: Metadata = {
  title: 'Terms of Service | Serve Funding',
  description: 'Terms and conditions governing your use of Serve Funding\'s website, services, and financial advisory offerings. Last updated July 2026.',
  robots: 'index, follow',
  alternates: { canonical: 'https://servefunding.com/terms-of-service' },
  openGraph: {
    title: 'Terms of Service | Serve Funding',
    description: 'Terms and conditions governing your use of Serve Funding\'s website, services, and financial advisory offerings. Last updated July 2026.',
    url: 'https://servefunding.com/terms-of-service',
    type: 'website',
    images: [
      {
        url: 'https://servefunding.com/home/right%20funding%20solutions.webp',
        width: 960,
        height: 628,
        alt: 'Serve Funding Terms of Service',
      },
    ],
  },
}

export default function TermsOfService() {
  return (
    <>
      {/* Breadcrumb - includes schema */}
      <Breadcrumb items={[{ label: 'Terms of Service' }]} />

      {/* Hero Section */}
      <Section className="pt-0 pb-0 md:py-0 overflow-hidden" style={{ backgroundColor: BRAND_COLORS.primary }}>
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[300px] py-16 text-center">
            <Heading size="h1" color="white" className="mb-4">
              Terms of Service
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
            {/* Acceptance & Eligibility */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                Acceptance & Eligibility
              </Heading>
              <Text className="text-gray-700 mb-4">
                By accessing and using this website and our services, you agree to be bound by these Terms of Service. These terms govern your use of Serve Funding's website and the financial advisory services we provide.
              </Text>
              <Text className="text-gray-700 mb-4">
                Our services are intended for individuals aged 18 years or older and business entities. By using our services, you represent and warrant that you meet these eligibility requirements.
              </Text>
              <Text className="text-gray-700 font-semibold">
                Important: We do not guarantee approval for funding or financing as each request is subject to lender criteria and evaluation.
              </Text>
            </div>

            {/* Services Offered */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                Services Offered
              </Heading>
              <Text className="text-gray-700 mb-4">
                Serve Funding provides working capital advisory services including, but not limited to:
              </Text>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Funding assessments and consultations</li>
                <li>Access to various financial products</li>
                <li>Lender liaison and coordination services</li>
                <li>Financial guidance and education</li>
              </ul>
              <Text className="text-gray-700">
                Please note: Serve Funding is not a direct lender. We act as an advisory firm connecting clients with appropriate lending partners.
              </Text>
            </div>

            {/* User Obligations */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                User Obligations
              </Heading>
              <Text className="text-gray-700 mb-4">
                As a client of Serve Funding, you agree to:
              </Text>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate, complete, and truthful information</li>
                <li>Respond promptly to our requests for additional information or documentation</li>
                <li>Comply with all applicable laws and lender requirements</li>
                <li>Use our services only for lawful purposes</li>
                <li>Not misrepresent your financial situation or credentials</li>
              </ul>
            </div>

            {/* Important Disclaimers */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                Important Disclaimers
              </Heading>
              <Text className="text-gray-700 mb-4">
                <strong>Not Financial, Legal, or Tax Advice:</strong> The information and advisory services provided by Serve Funding are for general informational purposes only and do not constitute financial, legal, or tax advice. We strongly recommend that you consult with qualified professionals—including financial advisors, attorneys, and tax specialists—before making any financial decisions based on our recommendations or information.
              </Text>
              <Text className="text-gray-700 mb-4">
                <strong>No Guarantee of Funding:</strong> Serve Funding makes no warranties or guarantees regarding the approval or availability of funding. All funding is subject to lender evaluation, underwriting, and approval based on their specific criteria.
              </Text>
              <Text className="text-gray-700">
                <strong>Market Conditions:</strong> Interest rates, terms, and availability of financial products are subject to change based on market conditions and lender policies. Information provided may not reflect real-time market conditions.
              </Text>
            </div>

            {/* Liability & Compensation */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                Compensation & Liability
              </Heading>
              <Text className="text-gray-700 mb-4">
                <strong>How We Are Compensated:</strong> Serve Funding receives commissions from lenders upon successful completion of transactions. We do not charge clients directly for advisory services unless otherwise agreed to in writing. Our compensation is contingent on successful funding outcomes.
              </Text>
              <Text className="text-gray-700 mb-4">
                <strong>Limitation of Liability:</strong> To the fullest extent permitted by applicable law, Serve Funding, its owners, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or loss of profits, arising out of or relating to your use of our services, even if we have been advised of the possibility of such damages.
              </Text>
              <Text className="text-gray-700">
                <strong>Indemnification:</strong> You agree to indemnify and hold harmless Serve Funding from any claims, damages, or costs arising from your violation of these Terms of Service or your use of our services.
              </Text>
            </div>

            {/* SMS/Text Messaging */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                SMS/Text Messaging
              </Heading>
              <Text className="text-gray-700 mb-4">
                If you opt in to receive text messages from Serve Funding, we may send you conversational SMS messages related to your inquiry, funding request, appointment scheduling, and customer care. Message frequency varies. Message and data rates may apply. You can opt out at any time by replying <strong>STOP</strong>, or reply <strong>HELP</strong> for assistance. Carriers are not liable for delayed or undelivered messages.
              </Text>
              <Text className="text-gray-700">
                Consent to receive text messages is not a condition of receiving our services. Mobile phone numbers and SMS opt-in consent are never sold, rented, or shared with third parties or affiliates for marketing or promotional purposes. For complete details, please review our{' '}
                <a href="/sms-terms" className="text-olive-900 underline hover:text-olive-700">SMS Terms of Service</a>
                {' '}and <a href="/privacy-policy" className="text-olive-900 underline hover:text-olive-700">Privacy Policy</a>.
              </Text>
            </div>

            {/* Data Protection & Privacy */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                Data Protection & Privacy
              </Heading>
              <Text className="text-gray-700 mb-4">
                Your privacy and the confidentiality of your information are important to us. Client information is maintained in accordance with our Privacy Policy and all applicable data protection laws.
              </Text>
              <Text className="text-gray-700">
                <strong>Security Disclaimer:</strong> While we implement security measures to protect your information, we cannot guarantee complete security as no method of transmission over the internet or electronic storage is 100% secure. You use our services at your own risk in this regard.
              </Text>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                Intellectual Property Rights
              </Heading>
              <Text className="text-gray-700">
                All content on our website, including text, graphics, logos, images, and software, is the property of Serve Funding or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or transmit any content without our prior written permission.
              </Text>
            </div>

            {/* Termination & Modifications */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                Termination & Modifications
              </Heading>
              <Text className="text-gray-700 mb-4">
                <strong>Right to Terminate:</strong> Serve Funding reserves the right to suspend or terminate your access to our services at any time, with or without cause, and with or without notice if you violate these Terms of Service or engage in conduct that violates applicable law.
              </Text>
              <Text className="text-gray-700">
                <strong>Changes to Terms:</strong> We reserve the right to modify these Terms of Service at any time. Material changes will be communicated to you with reasonable notice. Your continued use of our services constitutes your acceptance of the modified terms.
              </Text>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                Governing Law & Jurisdiction
              </Heading>
              <Text className="text-gray-700">
                These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction where Serve Funding is located, without regard to its conflict of law provisions. You agree to submit to the exclusive jurisdiction of the courts in that location for the resolution of any disputes.
              </Text>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                Contact Us
              </Heading>
              <Text className="text-gray-700 mb-2">
                If you have questions about these Terms of Service, please contact us at:
              </Text>
              <Text className="text-gray-700">
                <strong>Email:</strong> michael@servefunding.com<br />
                <strong>Phone:</strong> +770-820-7409
              </Text>
            </div>

            {/* Final */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <Text className="text-gray-600 text-sm">
                By using Serve Funding's website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </Text>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
