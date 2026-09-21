type ConfirmationEmail = {
  to: string;
  patientName: string;
  clinicName: string;
  startTime: string;
};

export async function sendConfirmationEmail(email: ConfirmationEmail): Promise<void> {
  const subject = 'Your appointment is booked';
  const text = `Hi ${email.patientName}, your appointment at ${email.clinicName} is confirmed for ${new Date(email.startTime).toLocaleString()}.`;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info('[sendConfirmationEmail]', { to: email.to, subject, text });
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM ?? 'ClinicDesk <beth.t@example.com>',
      to: email.to,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    console.error('Failed to send confirmation email', await response.text());
  }
}
