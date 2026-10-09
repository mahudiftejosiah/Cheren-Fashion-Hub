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
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for port 465, false for 587 (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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
    await transporter.sendMail({
      from: fromAddress,
      to: customerEmail,
      subject: `Your Order is Confirmed — Tracking No. ${trackingNumber} | Cheren Fashion Studio`,
      text,
      html,
    });
    console.log(`[email] Confirmation sent to ${customerEmail} for order ${trackingNumber}`);
  } catch (err) {
    // Non-fatal — log the error but don't crash order creation
    console.error(`[email] Failed to send confirmation to ${customerEmail}:`, err);
  }
}
