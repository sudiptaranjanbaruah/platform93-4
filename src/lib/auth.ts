import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
    userId: number;
    email: string;
    role: 'STUDENT' | 'ADMIN';
}

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

export async function setAuthCookie(payload: JWTPayload) {
    const token = generateToken(payload);
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

export async function getAuthUser(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    if (!token) return null;
    return verifyToken(token.value);
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
}

// OTP Storage (in-memory for simplicity, use Redis in production)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(email: string, otp: string) {
    otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });
}

export function verifyOTP(email: string, otp: string): boolean {
    const stored = otpStore.get(email);
    if (!stored) return false;
    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email);
        return false;
    }
    if (stored.otp === otp) {
        otpStore.delete(email);
        return true;
    }
    return false;
}
