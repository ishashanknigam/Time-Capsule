import nodemailer from "nodemailer";

let transporter = null;

export function getTransporter() {
  const MAIL_DRIVER = process.env.MAIL_DRIVER || "console";

  if (MAIL_DRIVER === "console") {
    return {
      sendMail: async (opts) => {
        console.log(`📧 [Console] Email to ${opts.to}: ${opts.subject}`);
        return { messageId: "console-message-id" };
      },
    };
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });
    
    console.log("✅ SMTP transporter initialized");
  }
  return transporter;
}

export async function sendCapsuleEmail({
  to,
  senderName,
  message,
  wroteAt,
  unlockDate,
}) {
  if (!to || !senderName || !message) {
    throw new Error("Missing required email fields");
  }

  if (!isValidEmail(to)) {
    throw new Error(`Invalid email: ${to}`);
  }

  try {
    const from = process.env.SMTP_FROM || "Time Capsule <no-reply@example.com>";
    const subject = `📬 Time Capsule Message from ${senderName}`;

    const text = `Hello!\n\nYou have received a Time Capsule message from ${senderName}.\n\nWritten on: ${new Date(
      wroteAt
    ).toDateString()}\nDelivered on: ${new Date(
      unlockDate
    ).toDateString()}\n\n--- MESSAGE ---\n\n${message}\n\n--- END ---\n\nThis message was scheduled to be delivered on ${new Date(
      unlockDate
    ).toDateString()}.\n\nBest regards,\nTime Capsule Team`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 30px;">
                    <h1 style="color: #4F46E5; margin: 0 0 20px 0; font-size: 24px;">📬 Time Capsule Message</h1>
                    <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                      Hello! You have received a special message from <strong>${senderName}</strong>.
                    </p>
                    <div style="background-color: #F9FAFB; border-left: 4px solid #4F46E5; padding: 20px; margin: 20px 0; border-radius: 4px;">
                      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message.replace(
                        /\n/g,
                        "<br/>"
                      )}</p>
                    </div>
                    <table width="100%" cellpadding="10" style="margin: 20px 0;">
                      <tr>
                        <td style="background-color: #F3F4F6; padding: 15px; border-radius: 4px;">
                          <p style="margin: 0; color: #6B7280; font-size: 14px;">
                            <strong>Written on:</strong> ${new Date(
                              wroteAt
                            ).toDateString()}<br/>
                            <strong>Delivered on:</strong> ${new Date(
                              unlockDate
                            ).toDateString()}
                          </p>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #9CA3AF; font-size: 12px; margin: 20px 0 0 0; text-align: center;">
                      This message was scheduled for delivery via Time Capsule
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    console.log("   Preparing email...");
    const transporter = getTransporter();

    console.log("   Sending email via SMTP...");
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: html,
      headers: {
        "X-Mailer": "Time Capsule App",
        "X-Priority": "3",
        Importance: "normal",
      },
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully!`);
    console.log(`   To: ${to}`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Accepted: ${info.accepted}`);
    console.log(`   Rejected: ${info.rejected}`);
    console.log(`   Response: ${info.response || "No response"}\n`);
    return info;
  } catch (err) {
    console.error(`❌ Email failed for ${to}: ${err.message}`);
    throw err;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
