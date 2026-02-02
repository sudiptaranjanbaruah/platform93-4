'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Post {
    id: number;
    title: string | null;
    content: string | null;
    mediaUrl: string | null;
    type: 'BLOG' | 'MEDIA';
    createdAt: string;
    author: {
        email: string;
        role: string;
    };
}

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<'BLOG' | 'MEDIA'>('BLOG');
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUser();
        fetchPosts();
    }, []);

    const fetchUser = async () => {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user);
    };

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts');
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('type', type);
            if (file) formData.append('file', file);

            const res = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setTitle('');
                setContent('');
                setFile(null);
                setShowCreateForm(false);
                fetchPosts();
            }
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.bgOverlay} />

            <div className="container">
                <div className={styles.header}>
                    <h1>Community Feed</h1>
                    {user && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowCreateForm(!showCreateForm)}
                        >
                            {showCreateForm ? 'Cancel' : '+ Create Post'}
                        </button>
                    )}
                </div>

                {showCreateForm && user && (
                    <div className={`${styles.createForm} glass brutal-border fade-in`}>
                        <h2>Create New Post</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Post Type</label>
                                <div className={styles.radioGroup}>
                                    <label>
                                        <input
                                            type="radio"
                                            value="BLOG"
                                            checked={type === 'BLOG'}
                                            onChange={(e) => setType(e.target.value as 'BLOG')}
                                        />
                                        Blog/Text
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="MEDIA"
                                            checked={type === 'MEDIA'}
                                            onChange={(e) => setType(e.target.value as 'MEDIA')}
                                        />
                                        Media (Image/Video)
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="title">Title (Optional)</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Give your post a title..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="content">Content</label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    rows={5}
                                    required
                                />
                            </div>

                            {type === 'MEDIA' && (
                                <div className={styles.formGroup}>
                                    <label htmlFor="file">Upload Media</label>
                                    <input
                                        type="file"
                                        id="file"
                                        accept="image/*,video/*"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                            >
                                {submitting ? 'Posting...' : 'Post'}
                            </button>
                        </form>
                    </div>
                )}

                <div className={styles.posts}>
                    {loading ? (
                        <div className={styles.loading}>Loading posts...</div>
                    ) : posts.length === 0 ? (
                        <div className={`card ${styles.emptyState}`}>
                            <p>No posts yet. Be the first to share something!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <article key={post.id} className={`card ${styles.post} fade-in`}>
                                {post.title && <h3>{post.title}</h3>}
                                {post.content && <p className={styles.postContent}>{post.content}</p>}
                                {post.mediaUrl && (
                                    <div className={styles.mediaContainer}>
                                        {post.mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                            <img src={post.mediaUrl} alt={post.title || 'Post media'} />
                                        ) : (
                                            <video src={post.mediaUrl} controls />
                                        )}
                                    </div>
                                )}
                                <div className={styles.postMeta}>
                                    <span className={styles.author}>
                                        {post.author.email.split('@')[0]}
                                    </span>
                                    <span className={styles.date}>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
