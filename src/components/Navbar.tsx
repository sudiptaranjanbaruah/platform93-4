'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

interface User {
    email: string;
    role: 'STUDENT' | 'ADMIN';
}

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Check auth status
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => setUser(data.user));

        // Check theme preference
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        window.location.href = '/';
    };

    return (
        <nav className={`${styles.navbar} glass`}>
            <div className="container">
                <div className={styles.navContent}>
                    <Link href="/" className={styles.logo}>
                        <h2>NFSU Portal</h2>
                    </Link>

                    <button
                        className={styles.menuToggle}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>

                    <div className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
                        <Link href="/">Home</Link>
                        <Link href="/feed">Feed</Link>
                        <Link href="/events">Events</Link>

                        {user && (
                            <>
                                <Link href="/notices">Notices</Link>
                                <Link href="/notes">Notes</Link>
                                {user.role === 'ADMIN' && (
                                    <Link href="/admin" className={styles.adminLink}>
                                        Admin
                                    </Link>
                                )}
                            </>
                        )}

                        <div className={styles.navActions}>
                            <button
                                onClick={toggleTheme}
                                className={styles.themeToggle}
                                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>

                            {user ? (
                                <div className={styles.userMenu}>
                                    <span className={styles.userEmail}>{user.email.split('@')[0]}</span>
                                    <button onClick={handleLogout} className="btn">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="btn btn-primary">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
