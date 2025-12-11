import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
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
let app: FirebaseApp;
let db: Firestore;
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  // Solo inicializar en el cliente
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  // Inicializar App Check con reCAPTCHA v3
  if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true, // Auto-refresh cada hora
      });
      console.log('✅ Firebase App Check activado con reCAPTCHA v3');
    } catch (error) {
      console.warn('⚠️ App Check ya inicializado o error:', error);
    }
  } else {
    console.warn('⚠️ NEXT_PUBLIC_RECAPTCHA_SITE_KEY no configurado');
  }

  // Inicializar Firestore
  db = getFirestore(app);

  // Inicializar Analytics (solo en producción)
  if (process.env.NODE_ENV === 'production' && firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
}

// Helper para trackear eventos en Analytics
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (analytics) {
    const { logEvent } = require('firebase/analytics');
    logEvent(analytics, eventName, params);
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
