/**
 * Service Worker for PWA
 *
 * Implements caching strategies for offline support and performance optimization
 * Compatible with SSG (Static Site Generation)
 */

const CACHE_VERSION = 'v1.1.0';
const CACHE_NAME = `dmv-portfolio-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/favicon/icon-192x192.png',
  '/favicon/icon-512x512.png',
  '/favicon/android-icon-512.png',
  '/favicon/apple-touch-icon.png',
  '/favicon/favicon.ico',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets (images, fonts, CSS, JS)
  cacheFirst: ['images', 'fonts', 'css', 'js', 'favicon', 'videos'],

  // Network first for HTML pages (to get fresh content)
  networkFirst: ['/', 'blog', 'proyectos'],

  // Network only (never cache)
  networkOnly: ['api', 'formspree', 'analytics', 'googletagmanager'],
};

/**
 * Install Event - Cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...', CACHE_VERSION);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...', CACHE_VERSION);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim(); // Take control immediately
      })
  );
});

/**
 * Fetch Event - Handle requests with appropriate caching strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (except for specific CDNs)
  if (url.origin !== location.origin && !shouldCacheCrossOrigin(url)) {
    return;
  }

  // Determine strategy based on request URL
  const strategy = determineStrategy(url);

  switch (strategy) {
    case 'cache-first':
      event.respondWith(cacheFirst(request));
      break;
    case 'network-first':
      event.respondWith(networkFirst(request));
      break;
    case 'network-only':
      event.respondWith(fetch(request));
      break;
    default:
      event.respondWith(networkFirst(request));
  }
});

/**
 * Cache First Strategy
 * Good for static assets that rarely change
 */
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      console.log('[SW] Cache hit:', request.url);
      return cachedResponse;
    }

    console.log('[SW] Cache miss, fetching:', request.url);
    const networkResponse = await fetch(request);

    // Cache the response for future use
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return getOfflineFallback(request);
  }
}

/**
 * Network First Strategy
 * Good for HTML pages that need fresh content
 */
async function networkFirst(request) {
  try {
    console.log('[SW] Network first:', request.url);
    const networkResponse = await fetch(request);

    // Cache the response for offline use
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return getOfflineFallback(request);
  }
}

/**
 * Determine which caching strategy to use
 */
function determineStrategy(url) {
  const pathname = url.pathname;

  // Check network-only patterns first
  for (const pattern of CACHE_STRATEGIES.networkOnly) {
    if (pathname.includes(pattern) || url.href.includes(pattern)) {
      return 'network-only';
    }
  }

  // Check cache-first patterns
  for (const pattern of CACHE_STRATEGIES.cacheFirst) {
    if (pathname.includes(pattern)) {
      return 'cache-first';
    }
  }

  // Check file extension
  const ext = pathname.split('.').pop();
  const staticExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'woff', 'woff2', 'ttf', 'eot', 'css', 'js'];

  if (staticExtensions.includes(ext)) {
    return 'cache-first';
  }

  // Default to network-first for HTML and other content
  return 'network-first';
}

/**
 * Check if cross-origin request should be cached
 */
function shouldCacheCrossOrigin(url) {
  const allowedOrigins = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net',
  ];

  return allowedOrigins.some(origin => url.hostname.includes(origin));
}

/**
 * Get offline fallback page
 */
async function getOfflineFallback(request) {
  const cachedOffline = await caches.match(OFFLINE_PAGE);

  if (cachedOffline) {
    return cachedOffline;
  }

  // Return a basic offline response
  return new Response(
    `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sin conexión</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: #f5f5f5;
          color: #333;
        }
        .container {
          text-align: center;
          padding: 2rem;
        }
        h1 { margin: 0 0 1rem; }
        p { margin: 0 0 1.5rem; color: #666; }
        button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
        }
        button:hover { background: #0051cc; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Sin conexión a Internet</h1>
        <p>No se pudo cargar esta página. Verifica tu conexión e intenta nuevamente.</p>
        <button onclick="location.reload()">Reintentar</button>
      </div>
    </body>
    </html>`,
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/html; charset=UTF-8',
      }),
    }
  );
}

/**
 * Message Event - Handle messages from the application
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.urls || [];
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(urlsToCache))
    );
  }
});

console.log('[SW] Service Worker loaded', CACHE_VERSION);
