import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP } from '@/lib/auth';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validate university email
        if (!email || !email.endsWith('@as.nfsu.edu.in')) {
            return NextResponse.json(
                { error: 'Please use a valid university email (@as.nfsu.edu.in)' },
                { status: 400 }
            );
        }

        // Generate and store OTP
        const otp = generateOTP();
        storeOTP(email, otp);

        // Send OTP via email
        const emailSent = await sendOTPEmail(email, otp);

        if (!emailSent) {
            return NextResponse.json(
                { error: 'Failed to send OTP. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'OTP sent successfully to your email',
            success: true
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        );
    }
}
