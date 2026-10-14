import { Resend } from 'resend'

// Resend API key — server-side only, loaded from environment variable
const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey) {
  console.warn('RESEND_API_KEY environment variable not set.')
}

export const resend = new Resend(resendApiKey || '')

export const TEAM_EMAIL = 'info@hesabika.com'
export const FROM_EMAIL = 'Hesabika Trust <info@hesabika.com>'
export const FROM_NOREPLY = 'Hesabika Website <noreply@hesabika.com>'

export const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width"/>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'IBM Plex Sans',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:linear-gradient(135deg,#166935 0%,#0f4d26 100%);padding:28px 32px;">
      <p style="color:white;font-size:20px;font-weight:bold;margin:0;">Hesabika Trust</p>
      <p style="color:rgba(255,255,255,0.6);font-size:11px;margin:6px 0 0;letter-spacing:0.1em;text-transform:uppercase;">Translating Concern into Action</p>
    </div>
    <div style="padding:32px;">
      ${content}
    </div>
    <div style="background:#0d0d0d;padding:16px 32px;text-align:center;">
      <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">
        © ${new Date().getFullYear()} Hesabika Trust · All Rights Reserved<br/>
        P.O Box 22770-00505, Nairobi, Kenya · +254 718 899 103
      </p>
    </div>
  </div>
</body>
</html>
`

export const notifyTemplate = (title: string, color: string, rows: [string, string][], body?: string) => `
<div style="background:${color};padding:20px 28px;margin:-32px -32px 24px;">
  <h2 style="color:white;margin:0;font-size:18px;">${title}</h2>
</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
  ${rows.map(([label, value]) => `
  <tr>
    <td style="padding:8px 0;color:#888;font-size:13px;width:140px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;font-weight:600;color:#222;font-size:13px;">${value}</td>
  </tr>`).join('')}
</table>
${body ? `<div style="padding:14px 16px;background:#f5f5f0;border-radius:8px;border-left:4px solid ${color};margin-top:8px;">
  <p style="margin:0;font-size:13px;color:#444;line-height:1.7;">${body}</p>
</div>` : ''}
`