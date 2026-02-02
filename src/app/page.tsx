import styles from './page.module.css';
import Image from 'next/image';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.bgOverlay} />

      <section className={styles.hero}>
        <div className="container">
          <div className={`${styles.heroContent} fade-in`}>
            <h1 className={styles.title}>
              Welcome to <span className={styles.highlight}>NFSU Portal</span>
            </h1>
            <p className={styles.subtitle}>
              Your gateway to campus life, learning resources, and community connection.
              Share moments, access notes, stay updated with events and notices.
            </p>
            <div className={styles.cta}>
              <a href="/login" className="btn btn-primary">
                Get Started
              </a>
              <a href="/events" className="btn">
                View Events
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <div className="grid grid-3">
            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIcon}>📸</div>
              <h3>Share & Connect</h3>
              <p>Upload photos, videos, and blogs. Share your campus experiences with the community.</p>
            </div>

            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIcon}>📚</div>
              <h3>Access Notes</h3>
              <p>Browse batch-wise organized study materials and notes uploaded by students.</p>
            </div>

            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIcon}>📅</div>
              <h3>Stay Updated</h3>
              <p>Get the latest notices and event information from the university administration.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.about}>
        <div className="container">
          <div className={`${styles.aboutContent} glass`}>
            <h2>About NFSU Portal</h2>
            <p>
              The National Forensic Sciences University Portal is a comprehensive platform
              designed to enhance student engagement and streamline access to academic resources.
              Built with modern web technologies and a focus on user experience, this portal
              combines brutalist design aesthetics with glassmorphic elements for a unique,
              contemporary interface.
            </p>
            <p>
              Login with your university email (@as.nfsu.edu.in) to unlock full access to
              all features including the social feed, notices, and notes repository.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
