/**
 * Shared content blocks for the numeric, quotable parts of a funding page.
 *
 * These started life inline in the /funding template. That section is being
 * folded into /solutions and /industries, and the blocks are the reason the
 * consolidation is worth doing at all: a terms table, an honest deflection and
 * a worked example with real dollars are what an answer engine lifts, and none
 * of the destination pages had anywhere to put them.
 *
 * Extracted rather than copied so the markup lives in one place across all
 * three consumers instead of drifting into three near-identical versions.
 */
import { Section, Container, Heading, Text, Card } from '@/components/ui'

export interface TermRow {
  label: string
  value: string
}

export interface NotForItem {
  who: string
  instead: string
}

/**
 * The quotable terms table. Every value should stay numeric and dated where it
 * moves, because this is the block most likely to be repeated verbatim by an
 * assistant answering a pricing question.
 */
export function TermsTable({
  terms,
  heading = 'Terms, costs and timelines',
  className = 'py-12 bg-white',
}: {
  terms: TermRow[]
  heading?: string
  className?: string
}) {
  if (!terms?.length) return null

  return (
    <Section className={className}>
      <Container>
        <div className="max-w-4xl mx-auto">
          <Heading size="h2" className="mb-6 text-olive-900">
            {heading}
          </Heading>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                {terms.map((t, i) => (
                  <tr key={i} className="border-b border-gray-200 align-top">
                    <th scope="row" className="py-3 pr-6 font-semibold text-olive-900 w-1/3">
                      {t.label}
                    </th>
                    <td className="py-3 text-gray-700">{t.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </Section>
  )
}

/**
 * Honest deflection. Repels traffic that was never going to convert, and is a
 * large part of why an assistant treats the rest of the page as trustworthy.
 */
export function NotForList({
  items,
  heading = 'When this is the wrong answer',
  intro = 'Half of being useful is being clear about what does not work. If one of these describes you, the honest path is below, and it may not run through us.',
  className = 'py-12',
}: {
  items: NotForItem[]
  heading?: string
  intro?: string
  className?: string
}) {
  if (!items?.length) return null

  return (
    <Section className={className}>
      <Container>
        <div className="max-w-4xl mx-auto">
          <Heading size="h2" className="mb-4 text-olive-900">
            {heading}
          </Heading>
          {intro && <Text className="text-gray-600 mb-6">{intro}</Text>}
          <div className="space-y-4">
            {items.map((item, i) => (
              <Card key={i} padding="md" noHover>
                <div className="font-semibold text-olive-900 mb-1">{item.who}</div>
                <Text size="sm" className="text-gray-700">
                  {item.instead}
                </Text>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

/**
 * Generic-sized walkthrough with real dollars. Never customer-identifying: the
 * disclaimer below is load-bearing, not decoration.
 */
export function WorkedExample({
  text,
  heading = 'How this plays out, with numbers',
  className = 'py-12 bg-white',
}: {
  text?: string
  heading?: string
  className?: string
}) {
  if (!text) return null

  return (
    <Section className={className}>
      <Container>
        <div className="max-w-4xl mx-auto">
          <Heading size="h2" className="mb-6 text-olive-900">
            {heading}
          </Heading>
          <Text className="text-gray-700 whitespace-pre-line">{text}</Text>
          <Text size="sm" className="text-gray-500 mt-6 italic">
            A representative structure, sized to a typical file. Details are generalized, we do
            not publish client specifics.
          </Text>
        </div>
      </Container>
    </Section>
  )
}
