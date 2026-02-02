import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, setAuthCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        // Verify OTP
        const isValid = verifyOTP(email, otp);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid or expired OTP' },
                { status: 400 }
            );
        }

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Create new student user
            user = await prisma.user.create({
                data: {
                    email,
                    role: 'STUDENT',
                },
            });
        }

        // Set auth cookie
        await setAuthCookie({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return NextResponse.json({
            message: 'Login successful',
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        );
    }
}
