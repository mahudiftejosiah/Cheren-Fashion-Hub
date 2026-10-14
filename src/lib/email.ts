import nodemailer from 'nodemailer';

// ── Transporter ───────────────────────────────────────────────────────────────
// Configure via environment variables in .env:
//
//   EMAIL_HOST=smtp.gmail.com
//   EMAIL_PORT=587
//   EMAIL_USER=your@gmail.com
//   EMAIL_PASS=your_app_password      ← Gmail: use an App Password, not your real password
//   EMAIL_FROM="Cheren Fashion Studio <your@gmail.com>"
//
// For Gmail, enable 2FA then generate an App Password at:
// https://myaccount.google.com/apppasswords
//
// Other providers (Brevo, Mailgun, etc.) work the same way — just swap the host/port.

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error('[email] EMAIL_USER or EMAIL_PASS is not set in environment variables.');
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for port 465, false for 587 (STARTTLS)
    auth: { user, pass },
    // Required for Gmail App Passwords — disables XOAUTH2 fallback
    authMethod: 'PLAIN',
    tls: {
      // Reject unauthorized only in production; keeps local dev working
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });
}

// ── Order Confirmation Email ───────────────────────────────────────────────────
interface OrderConfirmationParams {
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  outfitTitle: string;
  expectedCompletionDate?: string | null;
}

export async function sendOrderConfirmationEmail(params: OrderConfirmationParams) {
  const {
    customerName,
    customerEmail,
    trackingNumber,
    outfitTitle,
    expectedCompletionDate,
  } = params;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const trackingUrl = `${appUrl}/track-order`;
  const fromAddress = process.env.EMAIL_FROM || `Cheren Fashion Studio <${process.env.EMAIL_USER}>`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation</title>
  <style>
    body { margin: 0; padding: 0; background: #09090b; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .wrapper { max-width: 580px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #18181b; border: 1px solid #27272a; border-radius: 20px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #18181b 0%, #1c1917 100%); padding: 36px 36px 28px; border-bottom: 1px solid #27272a; }
    .logo { font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin: 0 0 4px; }
    .logo span { color: #f59e0b; }
    .subtitle { font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 2px; margin: 0; }
    .body { padding: 32px 36px; }
    .greeting { font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 8px; }
    .intro { font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0 0 28px; }
    .tracking-box { background: #09090b; border: 1px solid #f59e0b40; border-radius: 14px; padding: 20px 24px; margin-bottom: 24px; }
    .tracking-label { font-size: 10px; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 6px; }
    .tracking-number { font-size: 28px; font-weight: 800; color: #f59e0b; font-family: 'Courier New', monospace; margin: 0; letter-spacing: 1px; }
    .details { border-radius: 12px; border: 1px solid #27272a; overflow: hidden; margin-bottom: 28px; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #27272a; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-size: 11px; color: #71717a; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .detail-value { font-size: 12px; color: #e4e4e7; font-weight: 600; text-align: right; max-width: 60%; }
    .cta-btn { display: block; width: fit-content; margin: 0 auto 28px; background: #f59e0b; color: #09090b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 100px; }
    .note { font-size: 12px; color: #71717a; line-height: 1.6; text-align: center; margin: 0 0 8px; }
    .footer { padding: 20px 36px; border-top: 1px solid #27272a; text-align: center; }
    .footer p { font-size: 11px; color: #52525b; margin: 0; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">

      <div class="header">
        <p class="logo">Cheren <span>Fashion</span> Studio</p>
        <p class="subtitle">Bespoke Tailoring &amp; Luxury Fashion</p>
      </div>

      <div class="body">
        <p class="greeting">Hello, ${customerName}! 👋</p>
        <p class="intro">
          Your order has been received and logged into our studio system.
          Below is your unique tracking number — keep it safe, you'll need it to
          check your order progress at any time.
        </p>

        <div class="tracking-box">
          <p class="tracking-label">Your Tracking Number</p>
          <p class="tracking-number">${trackingNumber}</p>
        </div>

        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Outfit</span>
            <span class="detail-value">${outfitTitle}</span>
          </div>
          ${expectedCompletionDate ? `
          <div class="detail-row">
            <span class="detail-label">Expected Completion</span>
            <span class="detail-value">${expectedCompletionDate}</span>
          </div>` : ''}
          <div class="detail-row">
            <span class="detail-label">Current Status</span>
            <span class="detail-value" style="color:#f59e0b;">Order Received</span>
          </div>
        </div>

        <a href="${trackingUrl}" class="cta-btn">Track My Order</a>

        <p class="note">
          Visit <strong style="color:#e4e4e7;">${trackingUrl}</strong> and enter your
          tracking number to see live updates on your tailoring progress.
        </p>
        <p class="note">
          Questions? Reply to this email or reach us via WhatsApp.
        </p>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} Cheren Fashion Studio. All rights reserved.</p>
        <p>You received this email because an order was placed under your email address.</p>
      </div>

    </div>
  </div>
</body>
</html>
  `.trim();

  // Plain-text fallback
  const text = [
    `Hello ${customerName},`,
    '',
    'Your order has been received by Cheren Fashion Studio.',
    '',
    `Tracking Number: ${trackingNumber}`,
    `Outfit: ${outfitTitle}`,
    expectedCompletionDate ? `Expected Completion: ${expectedCompletionDate}` : '',
    '',
    `Track your order at: ${trackingUrl}`,
    '',
    'Thank you for choosing Cheren Fashion Studio.',
  ]
    .filter((l) => l !== undefined)
    .join('\n');

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: fromAddress,
      to: customerEmail,
      subject: `Your Order is Confirmed — Tracking No. ${trackingNumber} | Cheren Fashion Studio`,
      text,
      html,
    });
    console.log(`[email] Order confirmation sent to ${customerEmail} for order ${trackingNumber} — messageId: ${info.messageId}`);
  } catch (err: any) {
    // Non-fatal — log the full error so it shows in your server console
    console.error(`[email] FAILED to send order confirmation to ${customerEmail}:`);
    console.error(`[email]   code:    ${err?.code}`);
    console.error(`[email]   command: ${err?.command}`);
    console.error(`[email]   message: ${err?.message}`);
  }
}

// ── Apprenticeship Acceptance Email ───────────────────────────────────────────
interface ApprenticeshipAcceptanceParams {
  applicantName: string;
  applicantEmail: string;
  experienceLevel?: string;
  availability?: string;
  additionalInstructions?: string | null;
}

export async function sendApprenticeshipAcceptanceEmail(
  params: ApprenticeshipAcceptanceParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const {
    applicantName,
    applicantEmail,
    experienceLevel,
    availability,
    additionalInstructions,
  } = params;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const fromAddress =
    process.env.EMAIL_FROM || `Cheren Fashion Studio <${process.env.EMAIL_USER}>`;

  if (!applicantEmail || !applicantEmail.includes('@')) {
    return { success: false, error: 'Invalid or missing applicant email address.' };
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Apprenticeship Accepted</title>
  <style>
    body { margin:0; padding:0; background:#09090b; font-family:'Helvetica Neue',Arial,sans-serif; }
    .wrapper { max-width:580px; margin:0 auto; padding:40px 20px; }
    .card { background:#18181b; border:1px solid #27272a; border-radius:20px; overflow:hidden; }
    .header { background:linear-gradient(135deg,#18181b 0%,#1c1917 100%); padding:36px 36px 28px; border-bottom:1px solid #27272a; }
    .logo { font-size:22px; font-weight:800; color:#fff; letter-spacing:-0.5px; margin:0 0 4px; }
    .logo span { color:#f59e0b; }
    .subtitle { font-size:11px; color:#a1a1aa; text-transform:uppercase; letter-spacing:2px; margin:0; }
    .badge { display:inline-block; margin:0 auto 0; background:#10b981; color:#fff; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:6px 18px; border-radius:100px; }
    .body { padding:32px 36px; }
    .greeting { font-size:20px; font-weight:700; color:#fff; margin:0 0 8px; }
    .intro { font-size:14px; color:#a1a1aa; line-height:1.7; margin:0 0 24px; }
    .highlight { background:#09090b; border:1px solid #10b98140; border-radius:14px; padding:20px 24px; margin-bottom:24px; }
    .hl-label { font-size:10px; font-weight:700; color:#a1a1aa; text-transform:uppercase; letter-spacing:2px; margin:0 0 6px; display:block; }
    .hl-value { font-size:16px; font-weight:800; color:#10b981; margin:0; }
    .details { border-radius:12px; border:1px solid #27272a; overflow:hidden; margin-bottom:28px; }
    .dr { display:flex; justify-content:space-between; padding:11px 16px; border-bottom:1px solid #27272a; }
    .dr:last-child { border-bottom:none; }
    .dl { font-size:11px; color:#71717a; font-weight:600; text-transform:uppercase; letter-spacing:1px; }
    .dv { font-size:12px; color:#e4e4e7; font-weight:600; }
    .cta { display:block; width:fit-content; margin:0 auto 24px; background:#f59e0b; color:#09090b; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; text-decoration:none; padding:14px 32px; border-radius:100px; }
    .note { font-size:12px; color:#71717a; line-height:1.6; text-align:center; margin:0 0 8px; }
    .footer { padding:20px 36px; border-top:1px solid #27272a; text-align:center; }
    .footer p { font-size:11px; color:#52525b; margin:0; line-height:1.8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <p class="logo">Cheren <span>Fashion</span> Studio</p>
        <p class="subtitle">Bespoke Tailoring &amp; Luxury Fashion</p>
      </div>
      <div class="body">
        <p style="text-align:center;margin:0 0 20px;">
          <span class="badge">✓ Application Accepted</span>
        </p>
        <p class="greeting">Congratulations, ${applicantName}! 🎉</p>
        <p class="intro">
          We are delighted to inform you that your application to the
          <strong style="color:#f59e0b;">Cheren Fashion Studio Apprenticeship Programme</strong>
          has been reviewed and officially accepted.
        </p>
        <div class="highlight">
          <span class="hl-label">Programme Status</span>
          <p class="hl-value">Accepted</p>
        </div>
        <div class="details">
          ${experienceLevel ? `<div class="dr"><span class="dl">Experience Level</span><span class="dv">${experienceLevel}</span></div>` : ''}
          ${availability ? `<div class="dr"><span class="dl">Availability</span><span class="dv">${availability}</span></div>` : ''}
          <div class="dr">
            <span class="dl">Next Step</span>
            <span class="dv">Await further contact from our team</span>
          </div>
        </div>
        ${additionalInstructions ? `
        <div style="background:#1c1917;border:1px solid #44403c;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
          <span style="font-size:10px;font-weight:700;color:#a1a1aa;text-transform:uppercase;letter-spacing:2px;display:block;margin-bottom:8px;">Additional Instructions</span>
          <p style="font-size:13px;color:#e7e5e4;line-height:1.6;margin:0;">${additionalInstructions}</p>
        </div>` : ''}
        <a href="${appUrl}/apprenticeship" class="cta">View Programme Details</a>
        <p class="note">Our team will be in touch shortly with your start details and onboarding information.</p>
        <p class="note">Questions? Reply to this email or contact us directly at <strong style="color:#e4e4e7;">${process.env.EMAIL_USER || 'studio@cherenfashion.com'}</strong></p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Cheren Fashion Studio. All rights reserved.</p>
        <p>This email was sent because you applied for our apprenticeship programme.</p>
      </div>
    </div>
  </div>
</body>
</html>`.trim();

  const text = [
    `Congratulations, ${applicantName}!`,
    '',
    'Your application to the Cheren Fashion Studio Apprenticeship Programme has been accepted.',
    '',
    experienceLevel ? `Experience Level: ${experienceLevel}` : '',
    availability ? `Availability: ${availability}` : '',
    additionalInstructions ? `\nAdditional Instructions:\n${additionalInstructions}` : '',
    '',
    'Our team will be in touch shortly with start details and onboarding information.',
    '',
    `View programme details: ${appUrl}/apprenticeship`,
    '',
    'Cheren Fashion Studio',
  ].filter(Boolean).join('\n');

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: fromAddress,
      to: applicantEmail,
      subject: `Congratulations! Your Fashion Hub Apprenticeship Application Has Been Accepted`,
      text,
      html,
    });
    console.log(`[email] Apprenticeship acceptance sent to ${applicantEmail} — messageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    const errorMsg = err?.message || 'Unknown email error';
    console.error(`[email] Failed to send acceptance to ${applicantEmail}:`, errorMsg);
    return { success: false, error: errorMsg };
  }
}

// ── Apprenticeship Rejection Email (optional) ──────────────────────────────────
interface ApprenticeshipRejectionParams {
  applicantName: string;
  applicantEmail: string;
}

export async function sendApprenticeshipRejectionEmail(
  params: ApprenticeshipRejectionParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { applicantName, applicantEmail } = params;
  const fromAddress =
    process.env.EMAIL_FROM || `Cheren Fashion Studio <${process.env.EMAIL_USER}>`;

  if (!applicantEmail || !applicantEmail.includes('@')) {
    return { success: false, error: 'Invalid or missing applicant email address.' };
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    body{margin:0;padding:0;background:#09090b;font-family:'Helvetica Neue',Arial,sans-serif;}
    .wrapper{max-width:580px;margin:0 auto;padding:40px 20px;}
    .card{background:#18181b;border:1px solid #27272a;border-radius:20px;overflow:hidden;}
    .header{background:linear-gradient(135deg,#18181b,#1c1917);padding:36px 36px 28px;border-bottom:1px solid #27272a;}
    .logo{font-size:22px;font-weight:800;color:#fff;margin:0 0 4px;}
    .logo span{color:#f59e0b;}
    .subtitle{font-size:11px;color:#a1a1aa;text-transform:uppercase;letter-spacing:2px;margin:0;}
    .body{padding:32px 36px;}
    .footer{padding:20px 36px;border-top:1px solid #27272a;text-align:center;}
    .footer p{font-size:11px;color:#52525b;margin:0;line-height:1.8;}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <p class="logo">Cheren <span>Fashion</span> Studio</p>
        <p class="subtitle">Apprenticeship Programme</p>
      </div>
      <div class="body">
        <p style="font-size:18px;font-weight:700;color:#fff;margin:0 0 12px;">Dear ${applicantName},</p>
        <p style="font-size:14px;color:#a1a1aa;line-height:1.7;margin:0 0 16px;">
          Thank you for taking the time to apply for our apprenticeship programme. We truly appreciate your interest in Cheren Fashion Studio.
        </p>
        <p style="font-size:14px;color:#a1a1aa;line-height:1.7;margin:0 0 16px;">
          After careful consideration, we are unable to offer you a place in the current intake. This decision was not easy, and we encourage you to continue developing your skills and to consider applying again in the future.
        </p>
        <p style="font-size:14px;color:#a1a1aa;line-height:1.7;margin:0;">
          We wish you all the best in your fashion journey.
        </p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Cheren Fashion Studio. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`.trim();

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: fromAddress,
      to: applicantEmail,
      subject: `Update on Your Cheren Fashion Studio Apprenticeship Application`,
      text: `Dear ${applicantName},\n\nThank you for applying to our apprenticeship programme. After careful consideration, we are unable to offer you a place in the current intake. We encourage you to keep developing your skills and consider applying again.\n\nWe wish you all the best.\n\nCheren Fashion Studio`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unknown email error' };
  }
}
