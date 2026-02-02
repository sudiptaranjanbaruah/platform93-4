'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'notice' | 'event'>('notice');

    // Notice form
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeContent, setNoticeContent] = useState('');
    const [noticeSubmitting, setNoticeSubmitting] = useState(false);

    // Event form
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventSubmitting, setEventSubmitting] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.user || data.user.role !== 'ADMIN') {
            router.push('/');
        } else {
            setUser(data.user);
        }
    };

    const handleNoticeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNoticeSubmitting(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/notices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: noticeTitle, content: noticeContent }),
            });

            if (res.ok) {
                setMessage('Notice posted successfully!');
                setNoticeTitle('');
                setNoticeContent('');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to post notice');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setNoticeSubmitting(false);
        }
    };

    const handleEventSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEventSubmitting(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: eventTitle,
                    description: eventDescription,
                    date: eventDate,
                    location: eventLocation,
                }),
            });

            if (res.ok) {
                setMessage('Event posted successfully!');
                setEventTitle('');
                setEventDescription('');
                setEventDate('');
                setEventLocation('');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to post event');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setEventSubmitting(false);
        }
    };

    if (!user) return <div className={styles.loading}>Checking authentication...</div>;

    return (
        <main className={styles.main}>
            <div className="container">
                <div className={styles.header}>
                    <h1>Admin Dashboard</h1>
                    <p className={styles.subtitle}>Manage notices and events</p>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'notice' ? styles.active : ''}`}
                        onClick={() => setActiveTab('notice')}
                    >
                        Post Notice
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'event' ? styles.active : ''}`}
                        onClick={() => setActiveTab('event')}
                    >
                        Post Event
                    </button>
                </div>

                {message && (
                    <div className={styles.success}>{message}</div>
                )}

                {error && (
                    <div className={styles.error}>{error}</div>
                )}

                {activeTab === 'notice' && (
                    <div className={`${styles.formContainer} brutal-border`}>
                        <h2>Create New Notice</h2>
                        <form onSubmit={handleNoticeSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="noticeTitle">Title</label>
                                <input
                                    type="text"
                                    id="noticeTitle"
                                    value={noticeTitle}
                                    onChange={(e) => setNoticeTitle(e.target.value)}
                                    placeholder="Notice title..."
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="noticeContent">Content</label>
                                <textarea
                                    id="noticeContent"
                                    value={noticeContent}
                                    onChange={(e) => setNoticeContent(e.target.value)}
                                    placeholder="Notice content..."
                                    rows={8}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-admin"
                                disabled={noticeSubmitting}
                            >
                                {noticeSubmitting ? 'Posting...' : 'Post Notice'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'event' && (
                    <div className={`${styles.formContainer} brutal-border`}>
                        <h2>Create New Event</h2>
                        <form onSubmit={handleEventSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="eventTitle">Event Title</label>
                                <input
                                    type="text"
                                    id="eventTitle"
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                    placeholder="Event title..."
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="eventDescription">Description</label>
                                <textarea
                                    id="eventDescription"
                                    value={eventDescription}
                                    onChange={(e) => setEventDescription(e.target.value)}
                                    placeholder="Event description..."
                                    rows={5}
                                    required
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="eventDate">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        id="eventDate"
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="eventLocation">Location</label>
                                    <input
                                        type="text"
                                        id="eventLocation"
                                        value={eventLocation}
                                        onChange={(e) => setEventLocation(e.target.value)}
                                        placeholder="Event location..."
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-admin"
                                disabled={eventSubmitting}
                            >
                                {eventSubmitting ? 'Posting...' : 'Post Event'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
