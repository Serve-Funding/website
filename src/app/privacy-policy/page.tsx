import type { Metadata } from 'next'
import { Container, Heading, Text, Section } from '@/components/ui'
import { Breadcrumb } from '@/components/breadcrumb'
import { COLORS as BRAND_COLORS } from '@/lib/colors'

export const metadata: Metadata = {
  title: 'Privacy Policy | Serve Funding',
  description: 'Read Serve Funding\'s privacy policy to understand how we collect, use, store, and safeguard your personal information across our website and services.',
  robots: 'index, follow',
  alternates: { canonical: 'https://servefunding.com/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy | Serve Funding',
    description: 'Read Serve Funding\'s privacy policy to understand how we collect, use, store, and safeguard your personal information across our website and services.',
    url: 'https://servefunding.com/privacy-policy',
    type: 'website',
    images: [
      {
        url: 'https://servefunding.com/home/right%20funding%20solutions.webp',
        width: 960,
        height: 628,
        alt: 'Serve Funding Privacy Policy',
      },
    ],
  },
}

export default function PrivacyPolicy() {
  return (
    <>
      {/* Breadcrumb - includes schema */}
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

      {/* Hero Section */}
      <Section className="pt-0 pb-0 md:py-0 overflow-hidden" style={{ backgroundColor: BRAND_COLORS.primary }}>
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[300px] py-16 text-center">
            <Heading size="h1" color="white" className="mb-4">
              Privacy Policy
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
            {/* Introduction */}
            <div className="mb-12">
              <Text className="text-gray-700 mb-4">
                Serve Funding, LLC ("we," "us," "our," or "Company") is committed to protecting your privacy and ensuring you have a positive experience on our website and when using our services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
              </Text>
              <Text className="text-gray-700">
                Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our website or services.
              </Text>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                1. Information We Collect
              </Heading>

              <Heading size="h4" className="text-olive-800 mb-3">
                Personal Information
              </Heading>
              <Text className="text-gray-700 mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </Text>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Fill out contact forms on our website</li>
                <li>Request information about our services</li>
                <li>Submit referral applications</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us directly via email or phone</li>
              </ul>
              <Text className="text-gray-700 mb-4">
                This personal information may include:
              </Text>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Name and contact information (email address, phone number)</li>
                <li>Company/business information</li>
                <li>Financial information and business details</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <Heading size="h4" className="text-olive-800 mb-3">
                Automatically Collected Information
              </Heading>
              <Text className="text-gray-700 mb-4">
                When you visit our website, we may automatically collect certain technical information:
              </Text>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Links clicked</li>
                <li>Referral source</li>
                <li>Device information</li>
              </ul>

              <Heading size="h4" className="text-olive-800 mb-3">
                Cookies and Tracking Technology
              </Heading>
              <Text className="text-gray-700">
                We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. Cookies are small files stored on your device that help us remember your preferences and understand how you use our site. You can manage cookie preferences through your browser settings.
              </Text>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                2. How We Use Your Information
              </Heading>
              <Text className="text-gray-700 mb-4">
                We use the information we collect for various purposes:
              </Text>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Assess your eligibility for funding and financial products</li>
                <li>Respond to your inquiries and provide customer service</li>
                <li>Send marketing communications and promotional materials</li>
                <li>Improve our website, services, and user experience</li>
                <li>Comply with legal obligations and regulatory requirements</li>
                <li>Prevent fraudulent transactions and protect against misuse</li>
                <li>Analyze usage patterns to enhance our services</li>
                <li>Contact you about updates to our policies or services</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                3. How We Share Your Information
              </Heading>
              <Text className="text-gray-700 mb-4">
                We may share your information in the following circumstances:
              </Text>

              <Heading size="h4" className="text-olive-800 mb-3">
                Service Providers
              </Heading>
              <Text className="text-gray-700 mb-6">
                We share information with third-party service providers who assist us in operating our website and conducting our business, such as hosting providers, analytics services, and customer support platforms.
              </Text>

              <Heading size="h4" className="text-olive-800 mb-3">
                Lenders and Financial Institutions
              </Heading>
              <Text className="text-gray-700 mb-6">
                To facilitate funding opportunities, we share your information with lenders, financial institutions, and other funding partners who are involved in evaluating your application.
              </Text>

              <Heading size="h4" className="text-olive-800 mb-3">
                Legal Requirements
              </Heading>
              <Text className="text-gray-700 mb-6">
                We may disclose your information when required by law, such as to comply with subpoenas, court orders, or other legal processes.
              </Text>

              <Heading size="h4" className="text-olive-800 mb-3">
                Business Transfers
              </Heading>
              <Text className="text-gray-700 mb-6">
                If Serve Funding is involved in a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will provide notice before your information becomes subject to a different privacy policy.
              </Text>

              <Text className="text-gray-700">
                Notwithstanding the above, mobile phone numbers and SMS opt-in consent are excluded from any sharing for marketing purposes and are handled as described in the &quot;Mobile Information &amp; SMS Messaging&quot; section below.
              </Text>
            </div>

            {/* Mobile Information & SMS Messaging */}
            <div className="mb-12" id="sms-terms">
              <Heading size="h2" className="text-olive-900 mb-4">
                4. Mobile Information &amp; SMS Messaging
              </Heading>
              <Text className="text-gray-700 mb-4">
                <strong>Mobile phone numbers and SMS/text-messaging opt-in consent are never sold, rented, or shared with third parties or affiliates for their own marketing or promotional purposes.</strong> This restriction applies regardless of any other sharing described in this Policy, including our sharing of application information with lenders, financial institutions, and funding partners to service your financing request.
              </Text>
              <Text className="text-gray-700 mb-4">
                We may share mobile information only with service providers who help us operate our messaging service (for example, our telephony provider, Dialpad), solely to deliver the service and under obligations of confidentiality. All text-messaging opt-in data and consent records are kept confidential and are not transferred to any third-party marketers.
              </Text>
              <Text className="text-gray-700">
                Message frequency varies. Message and data rates may apply. Reply <strong>STOP</strong> to opt out of text messages at any time, or <strong>HELP</strong> for assistance. For full details, see our{' '}
                <a href="/sms-terms" className="text-olive-900 underline hover:text-olive-700">SMS Terms of Service</a>.
              </Text>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                5. Data Security
              </Heading>
              <Text className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These security measures include:
              </Text>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Secure password protection for accounts</li>
                <li>Regular security audits and updates</li>
                <li>Restricted access to personal information</li>
              </ul>
              <Text className="text-gray-700 font-semibold">
                However, no security system is completely infallible. While we strive to protect your information, we cannot guarantee absolute security.
              </Text>
            </div>

            {/* Your Privacy Rights */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                6. Your Privacy Rights
              </Heading>
              <Text className="text-gray-700 mb-4">
                Depending on your location and applicable laws, you may have the following rights regarding your personal information:
              </Text>

              <Heading size="h4" className="text-olive-800 mb-3">
                Right to Access
              </Heading>
              <Text className="text-gray-700 mb-4">
                You can request access to the personal information we hold about you.
              </Text>

              <Heading size="h4" className="text-olive-800 mb-3">
                Right to Correction
              </Heading>
              <Text className="text-gray-700 mb-4">
                You can request that we correct inaccuracies in your personal information.
              </Text>

              <Heading size="h4" className="text-olive-800 mb-3">
                Right to Opt-Out
              </Heading>
              <Text className="text-gray-700 mb-4">
                You can opt out of receiving marketing communications by clicking the "unsubscribe" link in our emails or by contacting us directly.
              </Text>

              <Heading size="h4" className="text-olive-800 mb-3">
                Right to Deletion
              </Heading>
              <Text className="text-gray-700 mb-4">
                You can request deletion of your personal information, subject to legal and business-related exceptions (such as maintaining records for compliance purposes).
              </Text>

              <Text className="text-gray-700">
                To exercise any of these rights, please contact us using the contact information provided below.
              </Text>
            </div>

            {/* Cookies & Tracking */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                7. Cookies & Tracking Technologies
              </Heading>
              <Text className="text-gray-700 mb-4">
                Our website uses cookies and similar tracking technologies to:
              </Text>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Enhance your browsing experience</li>
                <li>Remember your preferences</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Track conversions and marketing effectiveness</li>
              </ul>
              <Text className="text-gray-700">
                You can manage your cookie preferences through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. If you disable cookies, some features of our website may not function properly.
              </Text>
            </div>

            {/* Third-Party Links */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                8. Third-Party Links
              </Heading>
              <Text className="text-gray-700">
                Our website may contain links to third-party websites. This Privacy Policy applies only to our website. We are not responsible for the privacy practices of other websites. We encourage you to review the privacy policies of any third-party sites before providing your information.
              </Text>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                9. Children's Privacy
              </Heading>
              <Text className="text-gray-700">
                Our website and services are not intended for children under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information and terminate the child's access to our services.
              </Text>
            </div>

            {/* Policy Updates */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                10. Updates to This Privacy Policy
              </Heading>
              <Text className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated Privacy Policy on our website with a new "Last Updated" date.
              </Text>
              <Text className="text-gray-700">
                Your continued use of our website and services following the posting of revised Privacy Policy means that you accept and agree to the changes.
              </Text>
            </div>

            {/* Contact Us */}
            <div className="mb-12">
              <Heading size="h2" className="text-olive-900 mb-4">
                11. Contact Us
              </Heading>
              <Text className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy, wish to exercise your privacy rights, or have concerns about our privacy practices, please contact us at:
              </Text>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                <Text className="text-gray-700 mb-2">
                  <strong>Serve Funding, LLC</strong>
                </Text>
                <Text className="text-gray-700 mb-2">
                  <strong>Email:</strong> michael@servefunding.com
                </Text>
                <Text className="text-gray-700">
                  <strong>Phone:</strong> +770-820-7409
                </Text>
              </div>

              <Text className="text-gray-700">
                We will respond to your inquiries within a reasonable timeframe and in accordance with applicable laws.
              </Text>
            </div>

            {/* Final */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <Text className="text-gray-600 text-sm">
                By using Serve Funding's website and services, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with our privacy practices, please do not use our website or services.
              </Text>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
