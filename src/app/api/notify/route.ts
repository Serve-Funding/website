import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'team@portal.servefunding.com'
// Comma-separated list of recipients
const NOTIFY_RECIPIENTS = (process.env.RESEND_NOTIFY_EMAILS || 'tim@ai-ascend.com')
  .split(',')
  .map(e => e.trim())
  .filter(Boolean)

const DEAL_TRACKER_URL = 'https://docs.google.com/spreadsheets/d/1uvyjzPHvMMKQX_DdoMg2HfMzKL6naRqXFeRpaUZUSTI/edit?gid=1459245510#gid=1459245510'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildContactTable(body: Record<string, any>): string {
  const { name, email, phone, company, user_role } = body
  const isOwner = user_role === 'A Business Owner or Operator Seeking Funding'
  const roleLabel = isOwner ? 'Business Owner / Operator' : user_role || 'Unknown'

  const rows: Array<{ label: string; value: string; isLink?: boolean }> = [
    { label: 'Name', value: name },
    { label: 'Email', value: email, isLink: true },
    ...(company ? [{ label: 'Company', value: company }] : []),
    ...(phone ? [{ label: 'Phone', value: phone }] : []),
    { label: 'Role', value: roleLabel },
  ]

  return rows.map((row, i) => `
    <tr${i % 2 === 1 ? ' style="background: #f9f9f9;"' : ''}>
      <td style="padding: 8px 12px; font-weight: 600; color: #666; width: 140px;">${row.label}</td>
      <td style="padding: 8px 12px; color: #2a231a;">${
        row.isLink
          ? `<a href="mailto:${escapeHtml(row.value)}" style="color: #c99c42;">${escapeHtml(row.value)}</a>`
          : escapeHtml(row.value)
      }</td>
    </tr>`).join('')
}

function buildVerificationBlock(body: Record<string, any>): string {
  const v = body.verification
  if (!v) return ''

  const flags: string[] = Array.isArray(v.flags) ? v.flags : []

  const phoneParts = [
    v.phone?.type,
    v.phone?.carrier,
    v.phone?.country && v.phone.country !== 'US' ? v.phone.country : '',
  ].filter(Boolean)

  const summary = [
    v.email?.result && v.email.result !== 'unchecked' ? `Email: ${v.email.result}` : '',
    phoneParts.length ? `Phone: ${phoneParts.join(' \u00b7 ')}` : '',
  ].filter(Boolean).join(' \u2014 ')

  if (flags.length === 0) {
    return `
    <p style="margin-top: 20px; padding: 10px 14px; background: #f0f7f0; border-left: 3px solid #4a7c3f; border-radius: 4px; font-size: 13px; color: #2a231a;">
      <strong>Contact verified.</strong>${summary ? ` ${escapeHtml(summary)}` : ''}
    </p>`
  }

  return `
    <div style="margin-top: 20px; padding: 14px 16px; background: #fdf6e3; border-left: 3px solid #c99c42; border-radius: 4px;">
      <p style="margin: 0 0 8px; font-weight: 600; color: #2a231a; font-size: 14px;">
        Check this contact before booking a call
      </p>
      <ul style="margin: 0; padding-left: 18px; color: #5a4a34; font-size: 13px; line-height: 1.6;">
        ${flags.map(f => `<li>${escapeHtml(String(f))}</li>`).join('')}
      </ul>
      ${summary ? `<p style="margin: 10px 0 0; font-size: 12px; color: #8a7a64;">${escapeHtml(summary)}</p>` : ''}
    </div>`
}

function buildTriageTable(body: Record<string, any>): string {
  const fields: Array<{ label: string; key: string }> = [
    { label: 'Annual Revenue', key: 'annual_revenue' },
    { label: 'Funding Amount', key: 'funding_amount' },
    { label: 'Time in Business', key: 'time_in_business' },
    { label: 'Credit Score', key: 'owner_credit_score' },
    { label: 'Industry', key: 'business_industry' },
    { label: 'Financing Needs', key: 'financing_needs' },
    { label: 'Triage Action', key: 'triage_action' },
    { label: 'Calendly URL', key: 'calendly_url' },
  ]

  const rows = fields
    .filter(f => {
      const val = body[f.key]
      if (Array.isArray(val)) return val.length > 0
      return val && val !== ''
    })
    .map(f => {
      const val = body[f.key]
      const display = Array.isArray(val) ? val.join(', ') : val
      return { label: f.label, value: display }
    })

  if (rows.length === 0) return ''

  return `
    <h3 style="color: #2a231a; margin-top: 24px; margin-bottom: 12px;">Triage Details</h3>
    <table style="width: 100%; border-collapse: collapse;">
      ${rows.map((row, i) => `
      <tr${i % 2 === 1 ? ' style="background: #f9f9f9;"' : ''}>
        <td style="padding: 8px 12px; font-weight: 600; color: #666; width: 140px;">${row.label}</td>
        <td style="padding: 8px 12px; color: #2a231a;">${escapeHtml(String(row.value))}</td>
      </tr>`).join('')}
    </table>`
}

// type=early: initial contact capture
// type=calendly: transitioning to scheduling (includes triage + AI conversation)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, type = 'early' } = body

    // Chat transcripts don't have a name/email (they're anonymous browser sessions)
    if (type !== 'chat_message' && (!name || !email)) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
    }

    const isOwner = body.user_role === 'A Business Owner or Operator Seeking Funding'
    const roleShort = isOwner ? 'Owner' : 'Partner'

    if (type === 'early') {
      // First email: someone just started the form
      const { data, error } = await resend.emails.send({
        from: `Serve Funding <${FROM_EMAIL}>`,
        to: NOTIFY_RECIPIENTS,
        subject: `New Lead: ${name} (${roleShort}) just started the form`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2a231a; margin-bottom: 24px;">New Lead Filling Out the Form</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${buildContactTable(body)}
            </table>
            ${buildVerificationBlock(body)}
            <p style="color: #999; font-size: 13px; margin-top: 24px;">
              They are currently completing the triage questions. Full details will follow when they finish.
            </p>
            <p style="font-size: 13px; margin-top: 16px;">
              You should see this lead pop up in the
              <a href="${DEAL_TRACKER_URL}" style="color: #c99c42;">deal tracker</a>
              soon.
            </p>
          </div>
        `,
      })

      if (error) {
        console.error('Resend error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, id: data?.id })
    }

    if (type === 'calendly') {
      // Second email: they're scheduling a call — full details + AI conversation
      const transitionSource = body.transition_source || 'unknown'
      const dealContext = body.deal_context || ''
      const chatTranscript = body.chat_transcript || ''

      const sourceLabel = transitionSource === 'mike_triage'
        ? 'Fast-tracked (Mike triage)'
        : transitionSource === 'ai_chat'
        ? 'After AI conversation'
        : transitionSource === 'schedule_directly'
        ? 'Skipped to scheduling'
        : transitionSource

      const { data, error } = await resend.emails.send({
        from: `Serve Funding <${FROM_EMAIL}>`,
        to: NOTIFY_RECIPIENTS,
        subject: `${name} (${roleShort}) is scheduling a call`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2a231a; margin-bottom: 24px;">${escapeHtml(name)} is Scheduling a Call</h2>
            <p style="color: #666; margin-bottom: 16px;">
              <strong>How they got here:</strong> ${escapeHtml(sourceLabel)}
            </p>
            <table style="width: 100%; border-collapse: collapse;">
              ${buildContactTable(body)}
            </table>
            ${buildVerificationBlock(body)}
            ${buildTriageTable(body)}
            ${chatTranscript ? `
            <h3 style="color: #2a231a; margin-top: 24px; margin-bottom: 12px;">AI Conversation</h3>
            <div style="background: #f5f5f0; border-radius: 8px; padding: 16px; font-size: 14px; color: #333; line-height: 1.5;">
              ${escapeHtml(chatTranscript).split('\n').map(line => {
                const isBot = line.startsWith('Serve Funding:')
                const label = isBot ? 'Serve Funding' : line.split(':')[0]
                const text = line.substring(line.indexOf(':') + 2)
                return `<div style="margin-bottom: 12px; padding: 10px 14px; border-radius: 12px; max-width: 90%; ${
                  isBot
                    ? 'background: #ffffff; border: 1px solid #e5e5e0;'
                    : 'background: #2a231a; color: #ffffff; margin-left: auto;'
                }"><div style="font-size: 11px; font-weight: 600; margin-bottom: 4px; ${isBot ? 'color: #c99c42;' : 'color: #d4c9a8;'}">${escapeHtml(label)}</div>${escapeHtml(text)}</div>`
              }).join('')}
            </div>` : dealContext ? `
            <h3 style="color: #2a231a; margin-top: 24px; margin-bottom: 12px;">Deal Context</h3>
            <div style="background: #f5f5f0; border-radius: 8px; padding: 16px; white-space: pre-wrap; font-size: 14px; color: #333; line-height: 1.6;">
${escapeHtml(dealContext)}
            </div>` : ''}
            <p style="font-size: 13px; margin-top: 24px;">
              Check the
              <a href="${DEAL_TRACKER_URL}" style="color: #c99c42;">deal tracker</a>
              for the full record.
            </p>
          </div>
        `,
      })

      if (error) {
        console.error('Resend error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, id: data?.id })
    }

    if (type === 'chat_message') {
      // Chat transcript: fires after every AI reply with full running transcript
      // Body: { type, sessionId, pageUrl, transcript: [{ sender: 'user'|'bot', text, timestamp }] }
      const sessionId: string = body.sessionId || 'unknown'
      const pageUrl: string = body.pageUrl || ''
      const transcript: Array<{ sender: 'user' | 'bot'; text: string; timestamp?: string }> =
        Array.isArray(body.transcript) ? body.transcript : []

      if (transcript.length === 0) {
        return NextResponse.json({ error: 'Empty transcript' }, { status: 400 })
      }

      const userTurns = transcript.filter(t => t.sender === 'user').length
      const firstUserMsg = transcript.find(t => t.sender === 'user')?.text?.slice(0, 80) || 'New chat'
      const subject = `Chat (${userTurns} msg${userTurns === 1 ? '' : 's'}): ${firstUserMsg}`

      const transcriptHtml = transcript.map(t => {
        const isBot = t.sender === 'bot'
        const label = isBot ? 'Serve Funding' : 'Visitor'
        return `<div style="margin-bottom: 12px; padding: 10px 14px; border-radius: 12px; max-width: 90%; ${
          isBot
            ? 'background: #ffffff; border: 1px solid #e5e5e0;'
            : 'background: #2a231a; color: #ffffff; margin-left: auto;'
        }"><div style="font-size: 11px; font-weight: 600; margin-bottom: 4px; ${isBot ? 'color: #c99c42;' : 'color: #d4c9a8;'}">${label}</div>${escapeHtml(t.text)}</div>`
      }).join('')

      const { data, error } = await resend.emails.send({
        from: `Serve Funding Chat <${FROM_EMAIL}>`,
        to: NOTIFY_RECIPIENTS,
        subject,
        headers: {
          // Thread by sessionId so each chat reads as one Gmail conversation.
          'References': `<chat-${sessionId}@servefunding.com>`,
          'In-Reply-To': `<chat-${sessionId}@servefunding.com>`,
        },
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2a231a; margin-bottom: 8px;">Chat Activity</h2>
            <p style="color: #666; font-size: 13px; margin-bottom: 4px;">
              <strong>Session:</strong> ${escapeHtml(sessionId)}
            </p>
            ${pageUrl ? `<p style="color: #666; font-size: 13px; margin-bottom: 16px;"><strong>Page:</strong> <a href="${escapeHtml(pageUrl)}" style="color: #c99c42;">${escapeHtml(pageUrl)}</a></p>` : ''}
            <div style="background: #f5f5f0; border-radius: 8px; padding: 16px; font-size: 14px; color: #333; line-height: 1.5;">
              ${transcriptHtml}
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 16px;">
              Sent on each AI reply; threaded by session so the conversation reads as one chain in your inbox.
            </p>
          </div>
        `,
      })

      if (error) {
        console.error('Resend error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, id: data?.id })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Notify API error:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
