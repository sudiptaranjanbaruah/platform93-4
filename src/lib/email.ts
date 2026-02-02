import nodemailer from 'nodemailer';

console.log('📧 Email Configuration:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  from: process.env.SMTP_FROM,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@university.edu',
      to: email,
      subject: 'Your OTP for University Portal Login',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5016;">University Portal - Login OTP</h2>
          <p>Your One-Time Password (OTP) for logging into the University Portal is:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}
