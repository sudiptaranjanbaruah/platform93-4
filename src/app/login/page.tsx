'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to send OTP');
                return;
            }

            setMessage('OTP sent to your email!');
            setStep('otp');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Invalid OTP');
                return;
            }

            router.push('/feed');
            router.refresh();
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.bgOverlay} />

            <div className={styles.loginContainer}>
                <div className={`${styles.loginCard} glass brutal-border`}>
                    <h1>Login to NFSU Portal</h1>
                    <p className={styles.subtitle}>
                        Use your university email to access the portal
                    </p>

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className={styles.success}>
                            {message}
                        </div>
                    )}

                    {step === 'email' ? (
                        <form onSubmit={handleSendOTP} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">University Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.name@as.nfsu.edu.in"
                                    required
                                    disabled={loading}
                                />
                                <small>Must end with @as.nfsu.edu.in</small>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="otp">Enter OTP</label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="123456"
                                    maxLength={6}
                                    required
                                    disabled={loading}
                                    className={styles.otpInput}
                                />
                                <small>Check your email for the 6-digit code</small>
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                        setStep('email');
                                        setOtp('');
                                        setError('');
                                        setMessage('');
                                    }}
                                    disabled={loading}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying...' : 'Verify & Login'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
