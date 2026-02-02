'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Note {
    id: number;
    subject: string;
    batch: string;
    fileUrl: string;
    createdAt: string;
    uploader: {
        email: string;
    };
}

export default function NotesPage() {
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [showUploadForm, setShowUploadForm] = useState(false);

    // Form state
    const [subject, setSubject] = useState('');
    const [batch, setBatch] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [selectedBatch, user]);

    const checkAuth = async () => {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.user) {
            router.push('/login');
        } else {
            setUser(data.user);
        }
    };

    const fetchNotes = async () => {
        try {
            const url = selectedBatch
                ? `/api/notes?batch=${selectedBatch}`
                : '/api/notes';
            const res = await fetch(url);
            const data = await res.json();
            setNotes(data.notes || []);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('subject', subject);
            formData.append('batch', batch);
            formData.append('file', file);

            const res = await fetch('/api/notes', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setSubject('');
                setBatch('');
                setFile(null);
                setShowUploadForm(false);
                fetchNotes();
            }
        } catch (error) {
            console.error('Error uploading note:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const batches = Array.from(new Set(notes.map(n => n.batch))).sort();

    if (!user) return <div className={styles.loading}>Checking authentication...</div>;

    return (
        <main className={styles.main}>
            <div className={styles.bgOverlay} />

            <div className="container">
                <div className={styles.header}>
                    <h1>Study Notes</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowUploadForm(!showUploadForm)}
                    >
                        {showUploadForm ? 'Cancel' : '+ Upload Note'}
                    </button>
                </div>

                {showUploadForm && (
                    <div className={`${styles.uploadForm} glass brutal-border fade-in`}>
                        <h2>Upload Study Note</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g., Mathematics, Physics..."
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="batch">Batch</label>
                                <input
                                    type="text"
                                    id="batch"
                                    value={batch}
                                    onChange={(e) => setBatch(e.target.value)}
                                    placeholder="e.g., 2024, 2023..."
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="file">File (PDF, DOC, etc.)</label>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                            >
                                {submitting ? 'Uploading...' : 'Upload'}
                            </button>
                        </form>
                    </div>
                )}

                <div className={styles.filters}>
                    <label htmlFor="batchFilter">Filter by Batch:</label>
                    <select
                        id="batchFilter"
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                        <option value="">All Batches</option>
                        {batches.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.notes}>
                    {loading ? (
                        <div className={styles.loading}>Loading notes...</div>
                    ) : notes.length === 0 ? (
                        <div className={`card ${styles.emptyState}`}>
                            <p>No notes available. Upload the first one!</p>
                        </div>
                    ) : (
                        <div className="grid grid-2">
                            {notes.map((note) => (
                                <div key={note.id} className={`card ${styles.note} fade-in`}>
                                    <div className={styles.noteIcon}>📄</div>
                                    <h3>{note.subject}</h3>
                                    <div className={styles.noteMeta}>
                                        <span className={styles.batch}>Batch: {note.batch}</span>
                                        <span className={styles.uploader}>
                                            By: {note.uploader.email.split('@')[0]}
                                        </span>
                                    </div>
                                    <a
                                        href={note.fileUrl}
                                        download
                                        className="btn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Download
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
