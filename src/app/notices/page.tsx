'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Notice {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

export default function NoticesPage() {
    const router = useRouter();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        checkAuth();
        fetchNotices();
    }, []);

    const checkAuth = async () => {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.user) {
            router.push('/login');
        } else {
            setUser(data.user);
        }
    };

    const fetchNotices = async () => {
        try {
            const res = await fetch('/api/notices');
            const data = await res.json();
            setNotices(data.notices || []);
        } catch (error) {
            console.error('Error fetching notices:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className={styles.loading}>Checking authentication...</div>;

    return (
        <main className={styles.main}>
            <div className={styles.bgOverlay} />

            <div className="container">
                <div className={styles.header}>
                    <h1>Official Notices</h1>
                    <p className={styles.subtitle}>
                        Important announcements from the university administration
                    </p>
                </div>

                <div className={styles.notices}>
                    {loading ? (
                        <div className={styles.loading}>Loading notices...</div>
                    ) : notices.length === 0 ? (
                        <div className={`card ${styles.emptyState}`}>
                            <p>No notices available at the moment.</p>
                        </div>
                    ) : (
                        notices.map((notice) => (
                            <article key={notice.id} className={`card ${styles.notice} fade-in`}>
                                <div className={styles.noticeHeader}>
                                    <h2>{notice.title}</h2>
                                    <span className={styles.date}>
                                        {new Date(notice.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className={styles.noticeContent}>{notice.content}</p>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
