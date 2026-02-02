'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    createdAt: string;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);



    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            const data = await res.json();
            setEvents(data.events || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.bgOverlay} />

            <div className="container">
                <div className={styles.header}>
                    <h1>Upcoming Events</h1>
                    <p className={styles.subtitle}>
                        Stay updated with all university events and activities
                    </p>
                </div>

                <div className={styles.events}>
                    {loading ? (
                        <div className={styles.loading}>Loading events...</div>
                    ) : events.length === 0 ? (
                        <div className={`card ${styles.emptyState}`}>
                            <p>No upcoming events at the moment. Check back later!</p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <article key={event.id} className={`card ${styles.event} fade-in`}>
                                <div className={styles.eventHeader}>
                                    <h2>{event.title}</h2>
                                    <div className={styles.eventDate}>
                                        <span className={styles.dateIcon}>📅</span>
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </div>
                                </div>

                                <p className={styles.eventDescription}>{event.description}</p>

                                <div className={styles.eventFooter}>
                                    <div className={styles.location}>
                                        <span className={styles.locationIcon}>📍</span>
                                        {event.location}
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
