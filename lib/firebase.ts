import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics, logEvent } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;
let firebaseInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initialize Firebase - call this before using db or analytics
 * Returns a promise that resolves when Firebase is ready
 */
export function initializeFirebase(): Promise<void> {
  // Return existing promise if already initializing
  if (initPromise) return initPromise;

  // Already initialized
  if (firebaseInitialized) return Promise.resolve();

  // Server-side: return resolved promise
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  initPromise = new Promise((resolve) => {
    try {
      // Initialize app
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

      // Initialize App Check with reCAPTCHA v3
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        try {
          initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
            isTokenAutoRefreshEnabled: true,
          });
        } catch {
          // App Check already initialized or error - silently ignore
        }
      }

      // Initialize Firestore
      db = getFirestore(app);

      // Initialize Analytics (only in production)
      if (process.env.NODE_ENV === 'production' && firebaseConfig.measurementId) {
        try {
          analytics = getAnalytics(app);
        } catch {
          analytics = null;
        }
      }

      firebaseInitialized = true;
      resolve();
    } catch {
      resolve(); // Resolve anyway to not block the app
    }
  });

  return initPromise;
}

/**
 * Get Firestore instance - ensures Firebase is initialized first
 */
export async function getDb(): Promise<Firestore | null> {
  await initializeFirebase();
  return db;
}

/**
 * Check if Firebase is initialized
 */
export function isFirebaseInitialized(): boolean {
  return firebaseInitialized;
}

// Auto-initialize on client side import
if (typeof window !== 'undefined') {
  initializeFirebase();
}

// Helper para trackear eventos en Analytics
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (!analytics) {
    return;
  }

  try {
    logEvent(analytics, eventName, params);
  } catch {
    // Silently ignore analytics errors
  }
};

// Helper para trackear eventos personalizados comunes
export const trackPageView = (pagePath: string) => {
  trackEvent('page_view', { page_path: pagePath });
};

export const trackContactFormSubmit = (source: string) => {
  trackEvent('contact_form_submit', { source });
};

export const trackNewsletterSubscribe = (source: string) => {
  trackEvent('newsletter_subscribe', { source });
};

export const trackBlogArticleRead = (slug: string, readingTime: number) => {
  trackEvent('blog_article_read', {
    article_slug: slug,
    reading_time: readingTime
  });
};

export const trackConferenceView = (conferenceName: string) => {
  trackEvent('conference_view', {
    conference_name: conferenceName
  });
};

export const trackSocialClick = (platform: string, url: string) => {
  trackEvent('social_link_click', {
    platform,
    url
  });
};

export const trackCVDownload = () => {
  trackEvent('cv_download', {
    timestamp: new Date().toISOString()
  });
};

// Exportar instancias
export { app, db, analytics };
