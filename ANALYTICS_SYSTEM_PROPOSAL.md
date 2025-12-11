# 🔍 Sistema de Analytics Robusto & Tracking de Visitantes

## 📊 OBJETIVO

Crear un sistema completo de tracking que capture:
- ✅ **Quién** visitó (IP, ubicación, dispositivo)
- ✅ **Qué** vio (páginas específicas, tiempo en cada una)
- ✅ **Cuándo** lo vio (fecha, hora exacta, duración)
- ✅ **Cómo** navegó (flujo de páginas, clics, scroll depth)
- ✅ **De dónde** vino (referrer, UTM params, campaña)

---

## 🎯 ENFOQUE SELECCIONADO

### ✅ **OPCIÓN A: Firebase Analytics + Firestore Custom**

**Por qué este enfoque:**
1. ✅ Mejor relación costo/beneficio
2. ✅ Firebase Analytics gratis e ilimitado
3. ✅ Firestore para tracking detallado personalizado
4. ✅ Escalable hasta 100k visitantes/mes casi gratis
5. ✅ Dashboard en Firebase Console incluido
6. ✅ Posibilidad de dashboard custom en la app

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────┐
│           FRONTEND (Next.js)                │
└──────────────┬──────────────────────────────┘
               │
               ├──► Firebase Analytics (eventos automáticos)
               │    - page_view
               │    - scroll
               │    - engagement_time
               │    - user_engagement
               │
               └──► Firestore (tracking custom detallado)
                    ├─ sessions/
                    ├─ pageviews/
                    ├─ events/
                    └─ visitors/
```

---

## 📁 ESTRUCTURA DE DATOS EN FIRESTORE

### 1. Colección: `sessions`

```typescript
{
  sessionId: "session_1702312845_abc123",
  visitorId: "fp_hash_unique_device_id",
  userId: null, // Si implementas login más adelante

  // 👤 INFORMACIÓN DEL VISITANTE
  visitor: {
    ip: "181.115.XXX.XXX",
    ipAnonymized: "181.115.XXX.0", // GDPR compliant
    country: "Bolivia",
    countryCode: "BO",
    city: "Oruro",
    region: "Oruro Department",
    timezone: "America/La_Paz",
    latitude: -17.9647,
    longitude: -67.1064,
    isp: "Entel Bolivia",
    asn: "AS27839"
  },

  // 💻 INFORMACIÓN DEL DISPOSITIVO
  device: {
    browser: "Chrome",
    browserVersion: "120.0.0",
    os: "Windows",
    osVersion: "10",
    deviceType: "desktop", // desktop | mobile | tablet
    screenResolution: "1920x1080",
    viewport: "1920x937",
    language: "es-BO",
    languages: ["es-BO", "es", "en"],
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    isMobile: false,
    isTablet: false,
    isBot: false,
    platform: "Win32",
    cookiesEnabled: true,
    doNotTrack: false,
    touchSupport: false
  },

  // 🚪 INFORMACIÓN DE ENTRADA
  entry: {
    landingPage: "/blog/arquitectura-hexagonal",
    landingPageTitle: "Arquitectura Hexagonal en NestJS",
    referrer: "https://google.com/search?q=arquitectura+hexagonal",
    referrerDomain: "google.com",
    referrerType: "search", // search | social | direct | referral | email
    utmSource: "google",
    utmMedium: "organic",
    utmCampaign: null,
    utmContent: null,
    utmTerm: "arquitectura hexagonal nestjs",
    searchQuery: "arquitectura hexagonal nestjs" // Si viene de buscador
  },

  // ⏰ TIMESTAMPS
  startTime: Timestamp(2025-12-11 14:30:45),
  lastActivityTime: Timestamp(2025-12-11 14:35:12),
  endTime: Timestamp(2025-12-11 14:36:00),
  duration: 327, // segundos
  idleTime: 45, // segundos sin actividad
  activeTime: 282, // segundos de actividad real

  // 📊 MÉTRICAS DE SESIÓN
  metrics: {
    pageViews: 4,
    uniquePages: 3,
    bounceRate: false,
    bounce: false, // true si solo vio 1 página < 10 segundos
    engagement: "high", // low | medium | high
    engagementScore: 8.5, // 0-10 basado en tiempo, páginas, clics, scroll
    maxScrollDepth: 85, // % máximo de scroll en todas las páginas
    avgScrollDepth: 68, // % promedio
    totalScrolls: 12,
    totalClicks: 8,
    totalCopies: 2, // veces que copió texto
    exitPage: "/contacto",
    conversion: false, // si completó objetivo (contacto, newsletter, etc.)
    conversionType: null // "contact" | "newsletter" | "download"
  },

  // 📄 PÁGINAS VISITADAS (resumen)
  pages: [
    "/blog/arquitectura-hexagonal",
    "/blog",
    "/conferencias",
    "/contacto"
  ],

  // 🎯 ESTADO
  status: "completed", // active | completed | bounced | abandoned
  isReturningVisitor: false,
  sessionNumber: 1, // 1ra, 2da, 3ra visita de este visitante

  // 🏷️ SEGMENTACIÓN
  segment: "engaged-reader", // casual | engaged | lead | subscriber | client
  leadScore: 45, // 0-100 basado en comportamiento

  // 🔖 METADATA
  createdAt: Timestamp(2025-12-11 14:30:45),
  updatedAt: Timestamp(2025-12-11 14:36:00)
}
```

---

### 2. Colección: `pageviews`

```typescript
{
  id: "pv_unique_id",
  sessionId: "session_1702312845_abc123",
  visitorId: "fp_hash_unique_device_id",

  // 📄 INFORMACIÓN DE LA PÁGINA
  pageUrl: "/blog/arquitectura-hexagonal",
  pageTitle: "Arquitectura Hexagonal en NestJS | David Morales Vega",
  pageType: "blog-article", // home | blog-list | blog-article | conferencias | contacto
  articleSlug: "arquitectura-hexagonal", // si es artículo

  // ⏰ TIMESTAMPS DETALLADOS
  viewedAt: Timestamp(2025-12-11 14:31:00),
  exitedAt: Timestamp(2025-12-11 14:33:45),
  timeOnPage: 165, // segundos
  activeTimeOnPage: 142, // segundos activo (sin idle)

  // 🎯 COMPORTAMIENTO EN LA PÁGINA
  behavior: {
    scrollDepth: 75, // % máximo de scroll
    scrollMilestones: [25, 50, 75], // % alcanzados
    scrollEvents: 8, // número de eventos de scroll

    clicks: [
      {
        element: "a.social-link",
        selector: "a.social-link[href*='linkedin']",
        text: "LinkedIn",
        href: "https://linkedin.com/in/morales-vega-david",
        timestamp: Timestamp(2025-12-11 14:31:30),
        x: 450,
        y: 120
      },
      {
        element: "button.share-button",
        text: "Compartir en Twitter",
        timestamp: Timestamp(2025-12-11 14:32:15)
      }
    ],

    copiedText: [
      {
        text: "export class HexagonalService {...}",
        length: 156,
        timestamp: Timestamp(2025-12-11 14:31:45)
      }
    ],

    hoveredElements: [
      { selector: "a.internal-link", count: 3 },
      { selector: "code.code-block", count: 5 }
    ],

    videoPlayed: false,
    audioPlayed: false,
    imageViewed: 8,
    codeBlocksViewed: [
      "hexagonal-architecture-example",
      "dependency-injection-example"
    ],
    formInteraction: false
  },

  // ⚡ PERFORMANCE
  performance: {
    loadTime: 1.2, // segundos hasta DOMContentLoaded
    firstContentfulPaint: 0.8,
    largestContentfulPaint: 1.5,
    firstInputDelay: 0.05,
    cumulativeLayoutShift: 0.02,
    timeToInteractive: 2.1,
    totalBlockingTime: 0.3,
    domSize: 842, // número de nodos DOM
    resourceSize: 2.4, // MB
    requestCount: 24
  },

  // 💚 ENGAGEMENT
  engagement: {
    read: true, // llegó al 80% del artículo
    readPercentage: 100,
    liked: false,
    shared: false,
    commented: false,
    downloaded: false,
    bookmarked: false, // si lo agregó a favoritos del navegador
    printedPage: false
  },

  // 🔀 NAVEGACIÓN
  previousPage: "/blog",
  previousPageTitle: "Blog - David Morales Vega",
  nextPage: "/contacto",
  nextPageTitle: "Contacto",
  isExitPage: false,
  isBouncePage: false,

  // 📱 CONTEXTO
  viewportWidth: 1920,
  viewportHeight: 937,
  orientation: "landscape", // landscape | portrait
  onlineStatus: true,
  batteryLevel: 0.85, // si está disponible

  // 🔖 METADATA
  createdAt: Timestamp(2025-12-11 14:31:00),
  updatedAt: Timestamp(2025-12-11 14:33:45)
}
```

---

### 3. Colección: `events`

```typescript
{
  id: "event_unique_id",
  sessionId: "session_1702312845_abc123",
  visitorId: "fp_hash_unique_device_id",

  // 🎯 EVENTO
  eventName: "article_completed",
  eventCategory: "engagement", // engagement | conversion | navigation | interaction
  eventAction: "read", // read | click | scroll | submit | download | share
  eventLabel: "arquitectura-hexagonal",
  eventValue: 165, // valor numérico (segundos, cantidad, etc.)

  // 📄 CONTEXTO
  pageUrl: "/blog/arquitectura-hexagonal",
  pageTitle: "Arquitectura Hexagonal en NestJS",

  // 🎨 PROPIEDADES PERSONALIZADAS
  properties: {
    articleSlug: "arquitectura-hexagonal",
    articleCategory: "NestJS",
    readingTime: "8 min",
    wordCount: 2400,
    completionPercentage: 100,
    timeSpent: 165,
    scrollDepth: 95
  },

  // ⏰ TIMESTAMP
  timestamp: Timestamp(2025-12-11 14:33:45),

  // 🔖 METADATA
  createdAt: Timestamp(2025-12-11 14:33:45)
}
```

**Eventos predefinidos a trackear:**

```typescript
// Engagement
- article_started (scroll > 10%)
- article_half_read (scroll > 50%)
- article_completed (scroll > 80%)
- code_copied
- social_share
- image_viewed

// Conversión
- contact_form_submitted
- newsletter_subscribed
- cv_downloaded
- conference_details_viewed

// Navegación
- internal_link_clicked
- external_link_clicked
- search_performed
- filter_applied

// Interacción
- video_played
- video_completed
- button_clicked
- form_started
- form_abandoned
```

---

### 4. Colección: `visitors`

```typescript
{
  visitorId: "fp_hash_unique_device_id",

  // 👤 IDENTIFICACIÓN
  email: null, // si se suscribe o contacta
  name: null,

  // ⏰ HISTORIAL
  firstSeen: Timestamp(2025-11-15 10:20:00),
  lastSeen: Timestamp(2025-12-11 14:36:00),
  daysSinceFirstVisit: 26,
  daysSinceLastVisit: 0,

  // 📊 ESTADÍSTICAS ACUMULADAS
  stats: {
    totalSessions: 12,
    totalPageViews: 48,
    totalTimeOnSite: 2847, // segundos
    averageSessionDuration: 237, // segundos
    averagePageViews: 4,
    bounceRate: 0.25, // 25% de sesiones fueron bounce
    returningVisitorRate: 0.92, // 92% de veces fue returning

    // Contenido consumido
    articlesRead: [
      "arquitectura-hexagonal",
      "microservicios-nestjs",
      "https-no-es-opcional"
    ],
    articlesStarted: 8,
    articlesCompleted: 3,

    conferencesViewed: ["ngworkshop-oruro-2024", "ccbol-ai-python"],
    pagesVisited: ["/", "/blog", "/conferencias", "/contacto"],

    // Interacciones
    totalClicks: 96,
    totalScrolls: 144,
    totalCopies: 6,

    // Conversiones
    contactFormSubmitted: true,
    contactFormSubmissions: 1,
    newsletterSubscribed: true,
    newsletterSubscribedAt: Timestamp(2025-12-05 18:30:00),
    cvDownloaded: false,

    // Social
    socialLinksClicked: {
      linkedin: 2,
      github: 1,
      twitter: 0
    },
    articlesShared: 1
  },

  // 💻 TECNOLOGÍA RECURRENTE
  commonDevice: "desktop",
  commonBrowser: "Chrome",
  commonOS: "Windows",
  commonLocation: {
    city: "Oruro",
    country: "Bolivia"
  },

  devices: [
    {
      type: "desktop",
      browser: "Chrome",
      os: "Windows",
      lastSeen: Timestamp(2025-12-11 14:36:00),
      sessions: 10
    },
    {
      type: "mobile",
      browser: "Chrome",
      os: "Android",
      lastSeen: Timestamp(2025-12-08 20:15:00),
      sessions: 2
    }
  ],

  // 🌍 GEOGRAFÍA
  locations: [
    {
      city: "Oruro",
      country: "Bolivia",
      sessions: 11,
      lastSeen: Timestamp(2025-12-11 14:36:00)
    },
    {
      city: "La Paz",
      country: "Bolivia",
      sessions: 1,
      lastSeen: Timestamp(2025-11-20 16:45:00)
    }
  ],

  // 🚪 ADQUISICIÓN
  firstReferrer: "https://google.com/search",
  firstReferrerDomain: "google.com",
  firstReferrerType: "search",
  firstUtmSource: "google",
  firstUtmMedium: "organic",
  firstUtmCampaign: null,

  acquisitionChannel: "organic-search",
  // organic-search | social | direct | referral | email | paid

  // 🎯 SEGMENTACIÓN
  segment: "engaged-reader",
  // segments: casual | engaged-reader | lead | subscriber | client | vip

  leadScore: 85, // 0-100 basado en:
  // - Tiempo en sitio
  // - Páginas vistas
  // - Artículos completados
  // - Interacciones
  // - Conversiones

  leadQuality: "hot", // cold | warm | hot

  // 🏷️ INTERESES DETECTADOS
  interests: ["NestJS", "Angular", "Arquitectura", "Microservicios", "TypeScript"],
  topCategories: ["Backend", "Arquitectura de Software", "JavaScript"],

  // 📈 ENGAGEMENT TREND
  engagementTrend: "increasing", // increasing | stable | decreasing
  lastSessionEngagement: "high",
  averageEngagement: "medium",

  // 💰 VALOR
  lifetimeValue: 0, // $ si hay monetización
  conversionValue: 0,

  // 🔔 MARKETING
  emailMarketingConsent: true,
  pushNotificationConsent: false,

  // 🚫 EXCLUSIONES
  isBlacklisted: false,
  isSpam: false,

  // 🔖 METADATA
  createdAt: Timestamp(2025-11-15 10:20:00),
  updatedAt: Timestamp(2025-12-11 14:36:00),

  // 📝 NOTAS
  notes: [] // Notas manuales del admin
}
```

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### 1. **Obtener IP del Usuario**

```typescript
// lib/analytics/ipDetection.ts

/**
 * Obtiene la IP del usuario
 * Opciones:
 * 1. ipify.org - GRATIS, simple, confiable
 * 2. cloudflare headers (si usas Cloudflare)
 * 3. Vercel headers (si usas Vercel)
 */
export async function getUserIP(): Promise<string> {
  try {
    // Opción 1: ipify.org (Recomendado para desarrollo)
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;

    // Opción 2: Si usas Cloudflare (en producción)
    // const ip = request.headers.get('CF-Connecting-IP');

    // Opción 3: Si usas Vercel (en producción)
    // const ip = request.headers.get('x-real-ip') ||
    //           request.headers.get('x-forwarded-for')?.split(',')[0];

  } catch (error) {
    console.error('Error obteniendo IP:', error);
    return 'unknown';
  }
}

/**
 * Anonimiza la IP para cumplir GDPR
 */
export function anonymizeIP(ip: string): string {
  const parts = ip.split('.');
  if (parts.length === 4) {
    // IPv4: 181.115.234.56 → 181.115.234.0
    parts[3] = '0';
    return parts.join('.');
  } else {
    // IPv6: truncar últimos 80 bits
    const ipv6Parts = ip.split(':');
    return ipv6Parts.slice(0, 4).join(':') + '::';
  }
}
```

---

### 2. **Geolocalización por IP**

```typescript
// lib/analytics/geolocation.ts

interface GeolocationData {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  timezone: string;
  latitude: number;
  longitude: number;
  isp: string;
  asn: string;
}

/**
 * Obtiene geolocalización a partir de IP
 *
 * Servicios disponibles (ordenados por recomendación):
 *
 * 1. ipapi.co - GRATIS 30k requests/mes
 *    https://ipapi.co/api/
 *
 * 2. ip-api.com - GRATIS 45 requests/min
 *    http://ip-api.com/docs/
 *
 * 3. ipgeolocation.io - GRATIS 1k requests/día
 *    https://ipgeolocation.io/
 *
 * 4. Abstract API - GRATIS 20k requests/mes
 *    https://www.abstractapi.com/ip-geolocation-api
 */
export async function getGeolocation(ip: string): Promise<GeolocationData> {
  try {
    // Opción 1: ipapi.co (Recomendado)
    const response = await fetch(`https://ipapi.co/${ip}/json/`);

    if (!response.ok) {
      throw new Error('IP API request failed');
    }

    const data = await response.json();

    return {
      ip: data.ip,
      country: data.country_name,
      countryCode: data.country_code,
      city: data.city,
      region: data.region,
      timezone: data.timezone,
      latitude: data.latitude,
      longitude: data.longitude,
      isp: data.org,
      asn: data.asn
    };

  } catch (error) {
    console.error('Error obteniendo geolocalización:', error);

    // Fallback: datos genéricos
    return {
      ip,
      country: 'Unknown',
      countryCode: 'XX',
      city: 'Unknown',
      region: 'Unknown',
      timezone: 'UTC',
      latitude: 0,
      longitude: 0,
      isp: 'Unknown',
      asn: 'Unknown'
    };
  }
}

/**
 * Opción 2: ip-api.com (alternativa)
 */
export async function getGeolocationIpApi(ip: string): Promise<GeolocationData> {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const data = await response.json();

  return {
    ip: data.query,
    country: data.country,
    countryCode: data.countryCode,
    city: data.city,
    region: data.regionName,
    timezone: data.timezone,
    latitude: data.lat,
    longitude: data.lon,
    isp: data.isp,
    asn: data.as
  };
}
```

---

### 3. **Device Fingerprinting**

```typescript
// lib/analytics/fingerprint.ts
import FingerprintJS from '@fingerprintjs/fingerprintjs';

interface DeviceFingerprint {
  visitorId: string;
  confidence: number;
  components: Record<string, any>;
}

/**
 * Genera un fingerprint único del dispositivo
 * Usa @fingerprintjs/fingerprintjs (open source)
 *
 * Alternativas:
 * - ClientJS (más simple pero menos preciso)
 * - Custom (calcular hash de características del navegador)
 */
export async function getDeviceFingerprint(): Promise<DeviceFingerprint> {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    return {
      visitorId: result.visitorId,
      confidence: result.confidence.score,
      components: result.components
    };
  } catch (error) {
    console.error('Error generando fingerprint:', error);

    // Fallback: generar ID simple basado en navegador
    return {
      visitorId: generateSimpleFingerprint(),
      confidence: 0.5,
      components: {}
    };
  }
}

/**
 * Fallback: fingerprint simple
 */
function generateSimpleFingerprint(): string {
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.maxTouchPoints || 0
  ].join('|');

  return hashString(data);
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}
```

**Instalación de dependencia:**

```bash
npm install @fingerprintjs/fingerprintjs
```

---

### 4. **Detección de Dispositivo**

```typescript
// lib/analytics/deviceDetection.ts

interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  screenResolution: string;
  viewport: string;
  language: string;
  languages: string[];
  userAgent: string;
  isMobile: boolean;
  isTablet: boolean;
  isBot: boolean;
  platform: string;
  cookiesEnabled: boolean;
  doNotTrack: boolean;
  touchSupport: boolean;
}

export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;

  return {
    browser: getBrowserName(ua),
    browserVersion: getBrowserVersion(ua),
    os: getOS(ua),
    osVersion: getOSVersion(ua),
    deviceType: getDeviceType(ua),
    screenResolution: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    languages: navigator.languages ? Array.from(navigator.languages) : [navigator.language],
    userAgent: ua,
    isMobile: /Mobile|Android|iPhone|iPod/i.test(ua),
    isTablet: /Tablet|iPad/i.test(ua),
    isBot: /bot|crawler|spider|crawling|slurp|scraper|archiver/i.test(ua),
    platform: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === '1',
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
  };
}

function getBrowserName(ua: string): string {
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Opera/') || ua.includes('OPR/')) return 'Opera';
  return 'Unknown';
}

function getBrowserVersion(ua: string): string {
  const match = ua.match(/(Firefox|Chrome|Safari|Edge|OPR)\/(\d+\.\d+)/);
  return match ? match[2] : 'Unknown';
}

function getOS(ua: string): string {
  if (ua.includes('Windows NT')) return 'Windows';
  if (ua.includes('Mac OS X')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown';
}

function getOSVersion(ua: string): string {
  const windowsMatch = ua.match(/Windows NT (\d+\.\d+)/);
  if (windowsMatch) {
    const versions: Record<string, string> = {
      '10.0': '10/11',
      '6.3': '8.1',
      '6.2': '8',
      '6.1': '7'
    };
    return versions[windowsMatch[1]] || windowsMatch[1];
  }

  const macMatch = ua.match(/Mac OS X (\d+[._]\d+)/);
  if (macMatch) return macMatch[1].replace('_', '.');

  const androidMatch = ua.match(/Android (\d+\.\d+)/);
  if (androidMatch) return androidMatch[1];

  return 'Unknown';
}

function getDeviceType(ua: string): 'desktop' | 'mobile' | 'tablet' {
  if (/Tablet|iPad/i.test(ua)) return 'tablet';
  if (/Mobile|Android|iPhone|iPod/i.test(ua)) return 'mobile';
  return 'desktop';
}
```

---

### 5. **Session Tracking Principal**

```typescript
// lib/analytics/sessionTracking.ts
import { collection, doc, setDoc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserIP, anonymizeIP } from './ipDetection';
import { getGeolocation } from './geolocation';
import { getDeviceFingerprint } from './fingerprint';
import { getDeviceInfo } from './deviceDetection';

// Variables globales de sesión
let sessionId: string | null = null;
let visitorId: string | null = null;
let sessionStartTime: number | null = null;
let currentPageStartTime: number | null = null;
let lastActivityTime: number = Date.now();
let currentPageviewId: string | null = null;

/**
 * Inicializa una nueva sesión de tracking
 */
export async function initSession(): Promise<string> {
  try {
    // Generar IDs únicos
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStartTime = Date.now();

    // Obtener fingerprint del dispositivo
    const fingerprint = await getDeviceFingerprint();
    visitorId = fingerprint.visitorId;

    // Obtener información del dispositivo
    const deviceInfo = getDeviceInfo();

    // Obtener IP
    const ip = await getUserIP();
    const ipAnonymized = anonymizeIP(ip);

    // Obtener geolocalización
    const location = await getGeolocation(ip);

    // Obtener parámetros UTM
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {
      utmSource: urlParams.get('utm_source'),
      utmMedium: urlParams.get('utm_medium'),
      utmCampaign: urlParams.get('utm_campaign'),
      utmContent: urlParams.get('utm_content'),
      utmTerm: urlParams.get('utm_term')
    };

    // Detectar tipo de referrer
    const referrerType = detectReferrerType(document.referrer);

    // Verificar si es visitante recurrente
    const isReturning = await checkReturningVisitor(visitorId);

    // Crear documento de sesión en Firestore
    const sessionRef = doc(db, 'sessions', sessionId);
    await setDoc(sessionRef, {
      sessionId,
      visitorId,
      userId: null,

      visitor: {
        ip: ipAnonymized, // IP anonimizada por GDPR
        ipAnonymized,
        country: location.country,
        countryCode: location.countryCode,
        city: location.city,
        region: location.region,
        timezone: location.timezone,
        latitude: location.latitude,
        longitude: location.longitude,
        isp: location.isp,
        asn: location.asn
      },

      device: deviceInfo,

      entry: {
        landingPage: window.location.pathname,
        landingPageTitle: document.title,
        referrer: document.referrer,
        referrerDomain: getReferrerDomain(document.referrer),
        referrerType,
        ...utmParams,
        searchQuery: urlParams.get('q') || urlParams.get('query') || null
      },

      startTime: Timestamp.now(),
      lastActivityTime: Timestamp.now(),
      endTime: null,
      duration: 0,
      idleTime: 0,
      activeTime: 0,

      metrics: {
        pageViews: 0,
        uniquePages: 0,
        bounceRate: false,
        bounce: false,
        engagement: 'low',
        engagementScore: 0,
        maxScrollDepth: 0,
        avgScrollDepth: 0,
        totalScrolls: 0,
        totalClicks: 0,
        totalCopies: 0,
        exitPage: null,
        conversion: false,
        conversionType: null
      },

      pages: [],

      status: 'active',
      isReturningVisitor: isReturning,
      sessionNumber: await getSessionNumber(visitorId),

      segment: 'casual',
      leadScore: 0,

      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // Setup tracking de actividad
    setupActivityTracking();

    // Actualizar perfil del visitante
    await updateVisitorProfile(visitorId);

    console.log('✅ Session tracking iniciado:', sessionId);

    return sessionId;

  } catch (error) {
    console.error('❌ Error iniciando session:', error);
    throw error;
  }
}

/**
 * Detecta el tipo de referrer
 */
function detectReferrerType(referrer: string): string {
  if (!referrer) return 'direct';

  const domain = getReferrerDomain(referrer);

  // Search engines
  if (/google|bing|yahoo|duckduckgo|baidu|yandex/i.test(domain)) {
    return 'search';
  }

  // Social media
  if (/facebook|twitter|linkedin|instagram|tiktok|pinterest|reddit/i.test(domain)) {
    return 'social';
  }

  // Email
  if (/mail\.|outlook|gmail/i.test(domain)) {
    return 'email';
  }

  // Mismo dominio
  if (domain === window.location.hostname) {
    return 'internal';
  }

  return 'referral';
}

function getReferrerDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/**
 * Verifica si el visitante ya visitó antes
 */
async function checkReturningVisitor(visitorId: string): Promise<boolean> {
  // Verificar en localStorage primero (más rápido)
  const hasVisitedBefore = localStorage.getItem('hasVisited') === 'true';

  if (!hasVisitedBefore) {
    localStorage.setItem('hasVisited', 'true');
    return false;
  }

  return true;
}

/**
 * Obtiene el número de sesión del visitante
 */
async function getSessionNumber(visitorId: string): Promise<number> {
  const sessionCount = parseInt(localStorage.getItem('sessionCount') || '0');
  const newCount = sessionCount + 1;
  localStorage.setItem('sessionCount', newCount.toString());
  return newCount;
}

/**
 * Actualiza el perfil del visitante
 */
async function updateVisitorProfile(visitorId: string): Promise<void> {
  // Implementación en próximo documento
  // Esta función actualiza/crea el documento en la colección 'visitors'
}

/**
 * Configura el tracking de actividad del usuario
 */
function setupActivityTracking(): void {
  // Implementación detallada en próximo archivo
  // - Scroll tracking
  // - Click tracking
  // - Copy tracking
  // - Visibility tracking
  // - Idle detection
  // - Page exit tracking
}
```

---

## 💰 COSTOS ESTIMADOS

### Con 100 visitantes/día (3,000/mes):

```
Firebase Analytics         → $0 (ilimitado)
Firestore Writes          → $0 (gratis hasta 20k/día)
  - Sessions: 100/día
  - Pageviews: 400/día (~4 páginas/visitante)
  - Events: 800/día
  - Total: ~1,300 writes/día ✅ GRATIS

Firestore Reads           → $0 (gratis hasta 50k/día)
  - Dashboard queries: 1k/día ✅ GRATIS

IP Geolocation (ipapi.co) → $0 (30k/mes gratis)
  - 100 visitantes/día = 3k/mes ✅ GRATIS

TOTAL: $0/mes
```

### Con 1,000 visitantes/día (30,000/mes):

```
Firestore Writes: 13k/día  → GRATIS aún
Firestore Reads: 10k/día   → GRATIS aún
IP API: 30k/mes           → GRATIS aún

TOTAL: $0/mes
```

### Con 10,000 visitantes/día (300,000/mes):

```
Firestore Writes: 130k/día
  - Excede 20k gratis
  - 110k × $0.18/100k = $0.20/día = $6/mes

Firestore Reads: 100k/día
  - Excede 50k gratis
  - 50k × $0.06/100k = $0.03/día = $0.90/mes

IP API: 300k/mes
  - Plan Pro: $15/mes

TOTAL: ~$22/mes
```

---

## 📋 FASES DE IMPLEMENTACIÓN

### 🔴 FASE 1: MVP (Día 1-2) - 4-6 horas

**Objetivo:** Tracking básico funcional

```typescript
✅ Session tracking
✅ IP + Geolocation
✅ Device fingerprinting
✅ Device info detection
✅ Pageview tracking básico
✅ UTM parameters capture
✅ Almacenamiento en Firestore
```

**Entregables:**
- Colecciones `sessions` y `pageviews` en Firestore
- Datos básicos capturados en cada visita
- Console logs para debugging

---

### 🟡 FASE 2: Tracking Avanzado (Día 3-4) - 4-6 horas

**Objetivo:** Capturar comportamiento detallado

```typescript
✅ Scroll depth tracking
✅ Click tracking
✅ Copy text tracking
✅ Time on page preciso
✅ Idle detection
✅ Performance metrics
✅ Engagement scoring
✅ Session completion
```

**Entregables:**
- Tracking de comportamiento completo
- Colección `events` implementada
- Métricas de engagement calculadas

---

### 🟢 FASE 3: Dashboard Admin (Día 5-7) - 8-10 horas

**Objetivo:** Visualizar datos capturados

```typescript
✅ Real-time active users
✅ Geographic map
✅ Traffic sources
✅ Top pages
✅ User journey flow
✅ Engagement metrics
✅ Conversion funnel
✅ Visitor profiles
```

**Entregables:**
- `/admin/analytics` dashboard completo
- Queries optimizadas
- Gráficas y visualizaciones

---

### 🔵 FASE 4: Features Avanzados (Día 8-14) - Opcional

```typescript
✅ Heatmaps
✅ Session recordings
✅ Funnel analysis
✅ Cohort analysis
✅ A/B testing integration
✅ Alerts & notifications
✅ Export a CSV/Excel
✅ Scheduled reports
```

---

## 🎯 SIGUIENTE PASO

**Cuando estés listo para implementar, empezaremos con:**

### FASE 1 - MVP (4-6 horas de trabajo)

1. ✅ Instalar dependencias necesarias
2. ✅ Crear estructura de archivos
3. ✅ Implementar IP + Geolocation
4. ✅ Implementar Device Fingerprinting
5. ✅ Implementar Session Tracking
6. ✅ Implementar Pageview Tracking
7. ✅ Integrar en el layout
8. ✅ Testing y verificación

**Al final de FASE 1 tendrás:**
- Sistema de tracking completo funcionando
- Datos guardándose en Firestore automáticamente
- Base sólida para dashboard posterior

---

## 📚 RECURSOS Y DOCUMENTACIÓN

### APIs Externas Recomendadas:

- **IP Detection:** https://www.ipify.org/
- **Geolocation:** https://ipapi.co/api/
- **Fingerprinting:** https://github.com/fingerprintjs/fingerprintjs

### Firebase Documentation:

- **Firestore:** https://firebase.google.com/docs/firestore
- **Analytics:** https://firebase.google.com/docs/analytics

### Privacy Compliance:

- **GDPR Guidelines:** https://gdpr.eu/
- **IP Anonymization:** https://support.google.com/analytics/answer/2763052

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### Privacidad y GDPR:

1. ✅ **IP Anonimizada** - Almacenamos solo IP anonimizada
2. ✅ **Cookie Consent** - Pedir consentimiento antes de trackear
3. ✅ **Data Retention** - Borrar datos después de X días
4. ✅ **User Rights** - Permitir borrar datos bajo request

### Performance:

1. ✅ **Async Loading** - No bloquear carga de página
2. ✅ **Debouncing** - Eventos de scroll/resize con debounce
3. ✅ **Batching** - Agrupar writes a Firestore
4. ✅ **Error Handling** - Fallar silenciosamente sin romper UX

---

## 🎨 MEJORAS AVANZADAS ADICIONALES

Las siguientes mejoras complementan el sistema base y lo convierten en una solución de analytics empresarial completa.

---

### 7. 🗺️ Mapas de Calor (Heatmaps) & Session Replay

#### **Heatmaps de Clicks**

Registra cada click del usuario con coordenadas exactas para generar mapas visuales de interacción.

```typescript
// lib/analytics/heatmap.ts
interface ClickHeatmapData {
  x: number;
  y: number;
  page: string;
  element: string;
  timestamp: number;
  viewportWidth: number;
  viewportHeight: number;
}

export async function trackClick(event: MouseEvent) {
  const clickData: ClickHeatmapData = {
    x: event.clientX,
    y: event.clientY,
    page: window.location.pathname,
    element: (event.target as HTMLElement).tagName,
    timestamp: Date.now(),
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };

  await addDoc(collection(db, 'heatmap_clicks'), {
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    ...clickData,
    createdAt: serverTimestamp(),
  });
}
```

**Estructura Firestore para heatmaps:**

```typescript
// Colección: heatmap_clicks
{
  sessionId: "session_123",
  visitorId: "fp_abc",
  x: 450,
  y: 320,
  page: "/blog/arquitectura-hexagonal",
  element: "A", // tag name
  elementSelector: "a.social-link",
  elementText: "LinkedIn",
  timestamp: 1702312845000,
  viewportWidth: 1920,
  viewportHeight: 937,
  createdAt: Timestamp
}
```

#### **Heatmaps de Scroll Depth**

Trackea cuánto scroll hace el usuario en cada página.

```typescript
export function trackScrollDepth() {
  let maxScroll = 0;
  let scrollDepthMarkers = [25, 50, 75, 90, 100];
  let triggeredMarkers = new Set<number>();

  const handleScroll = debounce(() => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );

    maxScroll = Math.max(maxScroll, scrollPercentage);

    scrollDepthMarkers.forEach((marker) => {
      if (scrollPercentage >= marker && !triggeredMarkers.has(marker)) {
        triggeredMarkers.add(marker);

        addDoc(collection(db, 'scroll_depth'), {
          sessionId: getSessionId(),
          page: window.location.pathname,
          depth: marker,
          timestamp: serverTimestamp(),
        });
      }
    });
  }, 500);

  window.addEventListener('scroll', handleScroll);
}
```

#### **Session Replay Ligero**

Graba el flujo de navegación del usuario sin capturar información sensible.

```typescript
interface SessionAction {
  type: 'click' | 'scroll' | 'input' | 'navigation';
  timestamp: number;
  data: any;
}

export class SessionRecorder {
  private actions: SessionAction[] = [];
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
    this.attachListeners();
  }

  private attachListeners() {
    // Track clicks
    document.addEventListener('click', (e) => {
      this.recordAction({
        type: 'click',
        timestamp: Date.now() - this.startTime,
        data: {
          x: e.clientX,
          y: e.clientY,
          target: (e.target as HTMLElement).tagName,
          text: (e.target as HTMLElement).innerText?.slice(0, 50),
        },
      });
    });

    // Track navigation
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      this.recordAction({
        type: 'navigation',
        timestamp: Date.now() - this.startTime,
        data: { url: args[2] },
      });
      return originalPushState.apply(history, args);
    }.bind(this);
  }

  private recordAction(action: SessionAction) {
    this.actions.push(action);

    // Save to Firestore every 10 actions or on page unload
    if (this.actions.length >= 10) {
      this.flush();
    }
  }

  async flush() {
    if (this.actions.length === 0) return;

    await updateDoc(doc(db, 'sessions', getSessionId()), {
      recording: arrayUnion(...this.actions),
    });

    this.actions = [];
  }
}
```

**Beneficios:**
- Ver exactamente dónde hacen click los usuarios
- Identificar elementos ignorados o confusos
- Optimizar CTAs basado en datos reales
- Detectar problemas de UX antes de perder conversiones

---

### 8. 📊 Funnels de Conversión & Goal Tracking

Analiza el flujo de usuarios a través de pasos específicos y detecta dónde abandonan.

```typescript
// lib/analytics/funnels.ts
interface Funnel {
  id: string;
  name: string;
  steps: FunnelStep[];
}

interface FunnelStep {
  name: string;
  url: string;
  eventType?: 'pageview' | 'event';
  eventName?: string;
}

// Define tus funnels
const contactFunnel: Funnel = {
  id: 'contact_funnel',
  name: 'Contact Form Funnel',
  steps: [
    { name: 'Landing Page', url: '/', eventType: 'pageview' },
    { name: 'Contact Page View', url: '/contact', eventType: 'pageview' },
    { name: 'Form Started', url: '/contact', eventType: 'event', eventName: 'form_started' },
    { name: 'Form Submitted', url: '/contact', eventType: 'event', eventName: 'contact_form_submit' },
  ],
};

export async function trackFunnelProgress(sessionId: string, step: FunnelStep) {
  await addDoc(collection(db, 'funnel_progress'), {
    sessionId,
    funnelId: contactFunnel.id,
    stepName: step.name,
    completedAt: serverTimestamp(),
  });
}

// Calcular conversion rates
export async function getFunnelAnalytics(funnelId: string, dateRange: DateRange) {
  const q = query(
    collection(db, 'funnel_progress'),
    where('funnelId', '==', funnelId),
    where('completedAt', '>=', dateRange.start),
    where('completedAt', '<=', dateRange.end)
  );

  const snapshot = await getDocs(q);

  // Group by session to see progression
  const sessionSteps = new Map<string, Set<string>>();

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (!sessionSteps.has(data.sessionId)) {
      sessionSteps.set(data.sessionId, new Set());
    }
    sessionSteps.get(data.sessionId)!.add(data.stepName);
  });

  // Calculate drop-off rates
  const funnel = contactFunnel;
  const stats = funnel.steps.map((step, index) => {
    const completedThisStep = Array.from(sessionSteps.values()).filter(
      (steps) => steps.has(step.name)
    ).length;

    const completedPreviousStep = index === 0
      ? completedThisStep
      : Array.from(sessionSteps.values()).filter(
          (steps) => steps.has(funnel.steps[index - 1].name)
        ).length;

    return {
      step: step.name,
      completed: completedThisStep,
      dropOff: completedPreviousStep - completedThisStep,
      conversionRate: completedPreviousStep > 0
        ? (completedThisStep / completedPreviousStep) * 100
        : 0,
    };
  });

  return stats;
}
```

**Ejemplo de análisis de funnel:**

```
Landing Page         → 1000 visitantes (100%)
Contact Page View    → 250 visitantes (25%) ❌ -75% drop
Form Started         → 180 visitantes (72%) ✅ buena conversión
Form Submitted       → 145 visitantes (80%) ✅ excelente conversión final

CONCLUSIÓN: El problema está entre Landing → Contact
```

**Beneficios:**
- Identificar dónde se pierden usuarios
- Optimizar pasos con mayor fricción
- Calcular conversion rates precisos
- Tomar decisiones basadas en datos

---

### 9. 🔔 Sistema de Alertas en Tiempo Real

Recibe notificaciones cuando ocurren eventos importantes.

```typescript
// lib/analytics/alerts.ts
interface Alert {
  id: string;
  name: string;
  condition: (data: any) => boolean;
  action: (data: any) => Promise<void>;
  enabled: boolean;
}

// Ejemplo: Alerta cuando hay un visitante de alto valor
const highValueVisitorAlert: Alert = {
  id: 'high_value_visitor',
  name: 'High Value Visitor Detected',
  condition: (visitor) => {
    return visitor.pageviews > 10 &&
           visitor.timeOnSite > 300 &&
           visitor.referrer?.includes('linkedin');
  },
  action: async (visitor) => {
    // Enviar notificación (email, Slack, etc.)
    await fetch('/api/notify', {
      method: 'POST',
      body: JSON.stringify({
        type: 'high_value_visitor',
        data: visitor,
      }),
    });
  },
  enabled: true,
};

// Ejemplo: Alerta cuando alguien está por abandonar sin convertir
const exitIntentNoConversionAlert: Alert = {
  id: 'exit_intent_no_conversion',
  name: 'Exit Intent - No Conversion',
  condition: (session) => {
    return session.pageviews >= 3 &&
           !session.hasConverted &&
           session.exitIntentTriggered;
  },
  action: async (session) => {
    // Mostrar oferta de último momento
    showExitIntentPopup({
      title: '¡Espera! ¿Te gustaría recibir mi newsletter?',
      message: 'Artículos semanales sobre desarrollo de software',
      cta: 'Suscribirme',
    });
  },
  enabled: true,
};

export function setupAlerts() {
  const alerts = [highValueVisitorAlert, exitIntentNoConversionAlert];

  // Escuchar cambios en Firestore en tiempo real
  onSnapshot(collection(db, 'sessions'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'modified') {
        const sessionData = change.doc.data();

        alerts.forEach((alert) => {
          if (alert.enabled && alert.condition(sessionData)) {
            alert.action(sessionData);
          }
        });
      }
    });
  });
}
```

**Casos de uso:**
- Visitante de alto valor (muchas páginas, mucho tiempo)
- Usuario abandonando sin convertir (exit intent)
- Primera conversión del día
- Spike de tráfico inusual
- Error 404 recurrente
- Tiempo de carga lento detectado

---

### 10. 📈 Dashboard de Analytics con Queries Pre-calculadas

Panel de control con métricas clave optimizadas.

```typescript
// lib/analytics/dashboard.ts
export async function getDashboardStats(dateRange: DateRange) {
  const stats = {
    overview: await getOverviewStats(dateRange),
    topPages: await getTopPages(dateRange),
    topReferrers: await getTopReferrers(dateRange),
    deviceBreakdown: await getDeviceBreakdown(dateRange),
    geographyBreakdown: await getGeographyBreakdown(dateRange),
    conversionFunnel: await getFunnelAnalytics('contact_funnel', dateRange),
    realtimeVisitors: await getRealtimeVisitors(),
  };

  return stats;
}

async function getOverviewStats(dateRange: DateRange) {
  const [sessions, pageviews, uniqueVisitors, conversions] = await Promise.all([
    getCount(collection(db, 'sessions'), dateRange),
    getCount(collection(db, 'pageviews'), dateRange),
    getUniqueCount(collection(db, 'sessions'), 'visitorId', dateRange),
    getCount(collection(db, 'events'), dateRange, where('eventName', '==', 'contact_form_submit')),
  ]);

  const avgSessionDuration = await getAverage(collection(db, 'sessions'), 'duration', dateRange);
  const bounceRate = await getBounceRate(dateRange);

  return {
    sessions,
    pageviews,
    uniqueVisitors,
    conversions,
    conversionRate: sessions > 0 ? (conversions / sessions) * 100 : 0,
    avgSessionDuration,
    bounceRate,
    pagesPerSession: sessions > 0 ? pageviews / sessions : 0,
  };
}

async function getTopPages(dateRange: DateRange, limit = 10) {
  const q = query(
    collection(db, 'pageviews'),
    where('timestamp', '>=', dateRange.start),
    where('timestamp', '<=', dateRange.end),
    orderBy('timestamp', 'desc')
  );

  const snapshot = await getDocs(q);

  const pageCounts = new Map<string, number>();
  snapshot.forEach((doc) => {
    const page = doc.data().page;
    pageCounts.set(page, (pageCounts.get(page) || 0) + 1);
  });

  return Array.from(pageCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([page, views]) => ({ page, views }));
}
```

**Métricas del Dashboard:**

```
┌─────────────────────────────────────────────┐
│  📊 OVERVIEW                                │
├─────────────────────────────────────────────┤
│  Sessions:              3,245  (+12%)       │
│  Unique Visitors:       2,891  (+8%)        │
│  Pageviews:            12,456  (+15%)       │
│  Avg. Session:          3m 45s              │
│  Bounce Rate:           42%                 │
│  Conversion Rate:       4.2%                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🌍 TOP COUNTRIES                           │
├─────────────────────────────────────────────┤
│  🇧🇴 Bolivia            45%   1,460 visits  │
│  🇦🇷 Argentina          18%     584 visits  │
│  🇨🇱 Chile              12%     389 visits  │
│  🇵🇪 Perú                8%     260 visits  │
│  🇺🇸 Estados Unidos      6%     195 visits  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📱 DEVICES                                 │
├─────────────────────────────────────────────┤
│  Desktop     68%  ████████████████████      │
│  Mobile      28%  ████████                  │
│  Tablet       4%  ██                        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🔥 TOP PAGES (Last 7 days)                │
├─────────────────────────────────────────────┤
│  1. /blog/arquitectura-hexagonal    1,245  │
│  2. /                               1,087  │
│  3. /blog                             892  │
│  4. /conferencias                     456  │
│  5. /blog/microservicios-nestjs       389  │
└─────────────────────────────────────────────┘
```

---

### 11. 📤 Exportación de Datos & Reportes

Exporta datos a CSV, PDF o Google Sheets para análisis externo.

```typescript
// lib/analytics/export.ts
export async function exportToCSV(dateRange: DateRange, type: 'sessions' | 'pageviews' | 'events') {
  const data = await fetchData(type, dateRange);

  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}_${dateRange.start.toISOString()}_${dateRange.end.toISOString()}.csv`;
  a.click();
}

export async function generatePDFReport(dateRange: DateRange) {
  const stats = await getDashboardStats(dateRange);

  // Usar una librería como jsPDF o react-pdf
  const doc = new jsPDF();

  doc.text('Analytics Report', 20, 20);
  doc.text(`Period: ${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`, 20, 30);

  doc.text(`Total Sessions: ${stats.overview.sessions}`, 20, 50);
  doc.text(`Unique Visitors: ${stats.overview.uniqueVisitors}`, 20, 60);
  doc.text(`Conversion Rate: ${stats.overview.conversionRate.toFixed(2)}%`, 20, 70);

  // ... agregar más datos y gráficas

  doc.save(`analytics_report_${Date.now()}.pdf`);
}
```

**Formatos de exportación:**
- CSV (Excel-compatible)
- PDF (reportes ejecutivos)
- JSON (integraciones API)
- Google Sheets (sincronización automática)

---

### 12. 🔗 Integraciones con Herramientas Externas

Conecta tus analytics con otras plataformas.

```typescript
// lib/analytics/integrations.ts

// Integración con Mailchimp/Brevo para newsletter
export async function syncHighEngagementVisitors() {
  const highEngagementQuery = query(
    collection(db, 'visitors'),
    where('engagementScore', '>=', 70),
    where('emailCaptured', '==', false)
  );

  const visitors = await getDocs(highEngagementQuery);

  // Estos son usuarios que deberías intentar capturar
  return visitors.docs.map((doc) => doc.data());
}

// Integración con Google Sheets para reportes automáticos
export async function exportToGoogleSheets(dateRange: DateRange) {
  const stats = await getDashboardStats(dateRange);

  await fetch('/api/google-sheets/append', {
    method: 'POST',
    body: JSON.stringify({
      spreadsheetId: 'YOUR_SPREADSHEET_ID',
      range: 'Analytics!A:H',
      values: [
        [
          dateRange.start.toLocaleDateString(),
          stats.overview.sessions,
          stats.overview.uniqueVisitors,
          stats.overview.pageviews,
          stats.overview.conversions,
          stats.overview.conversionRate,
          stats.overview.avgSessionDuration,
          stats.overview.bounceRate,
        ],
      ],
    }),
  });
}

// Webhook para enviar eventos importantes a Slack/Discord
export async function sendWebhook(event: string, data: any) {
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    body: JSON.stringify({
      text: `📊 *${event}*`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${event}*\n${JSON.stringify(data, null, 2)}`,
          },
        },
      ],
    }),
  });
}
```

**Integraciones disponibles:**
- Slack/Discord (notificaciones en tiempo real)
- Google Sheets (reportes automáticos)
- Mailchimp/Brevo (email marketing)
- Zapier/Make (automatizaciones)
- Webhooks custom (cualquier servicio)

---

## 🎯 RESUMEN DE TODAS LAS MEJORAS

| # | Categoría | Funcionalidad | Complejidad | Impacto | Costo Adicional |
|---|-----------|---------------|-------------|---------|-----------------|
| 1 | **Predictive Analytics** | Hot lead detection, conversion probability | Alta | 🔥🔥🔥 | $0 |
| 2 | **Behavioral Triggers** | Exit intent, scroll CTAs, time triggers | Media | 🔥🔥🔥 | $0 |
| 3 | **Segmentation** | RFM analysis, auto-segmentation | Media | 🔥🔥 | $0 |
| 4 | **Attribution** | Multi-touch attribution modeling | Alta | 🔥🔥 | $0 |
| 5 | **Cohort Analysis** | Retention tracking by cohort | Media | 🔥🔥 | $0 |
| 6 | **Competitive Intel** | Referrer analysis, competitor insights | Baja | 🔥 | $0 |
| 7 | **Heatmaps** | Click maps, scroll depth, session replay | Alta | 🔥🔥🔥 | $0 |
| 8 | **Funnels** | Conversion funnels, goal tracking | Media | 🔥🔥🔥 | $0 |
| 9 | **Alertas** | Real-time alerts, automated actions | Media | 🔥🔥 | $0 |
| 10 | **Dashboard** | Pre-calculated queries, visualizations | Media | 🔥🔥 | $0 |
| 11 | **Export** | CSV/PDF reports, scheduled exports | Baja | 🔥 | $0 |
| 12 | **Integraciones** | Mailchimp, Sheets, Slack webhooks | Media | 🔥🔥 | $0 |

**TOTAL: 12 funcionalidades avanzadas - TODO GRATIS** 🎉

---

## 🚀 PLAN DE IMPLEMENTACIÓN ACTUALIZADO

### **FASE 1 (Base)** - Tracking Fundamental
**Tiempo:** 4-6 horas

```typescript
✅ Session tracking con IP + Geolocation
✅ Device fingerprinting
✅ Pageview tracking detallado
✅ Almacenamiento en Firestore
```

### **FASE 2 (Core Analytics)** - Funcionalidades Esenciales
**Tiempo:** 4-6 horas

```typescript
✅ Funnels de conversión (#8)
✅ Dashboard básico (#10)
✅ Behavioral triggers: Exit intent (#2)
✅ Tracking de eventos avanzado
```

### **FASE 3 (Engagement)** - Análisis de Comportamiento
**Tiempo:** 6-8 horas

```typescript
✅ Heatmaps de clicks y scroll (#7)
✅ Segmentación RFM (#3)
✅ Alertas en tiempo real (#9)
✅ Visitor profiling completo
```

### **FASE 4 (Advanced)** - Features Empresariales
**Tiempo:** 8-10 horas

```typescript
✅ Predictive analytics (#1)
✅ Attribution modeling (#4)
✅ Cohort analysis (#5)
✅ Session replay (#7)
```

### **FASE 5 (Integraciones)** - Ecosistema Completo
**Tiempo:** 4-6 horas

```typescript
✅ Export CSV/PDF (#11)
✅ Integraciones externas (#12)
✅ Competitive intelligence (#6)
✅ Scheduled reports
```

**TOTAL TIEMPO DE IMPLEMENTACIÓN:** 26-36 horas (3-5 días de trabajo)

---

## 💡 COMPARACIÓN CON HERRAMIENTAS COMERCIALES

Con **TODAS** estas funcionalidades implementadas, tu sistema será equivalente a:

| Herramienta | Funcionalidad Principal | Costo Mensual | Tu Sistema |
|-------------|------------------------|---------------|------------|
| **Hotjar** | Heatmaps + Session Replay | $39 - $99 | ✅ INCLUIDO |
| **Mixpanel** | Funnels + Cohorts | $25 - $999 | ✅ INCLUIDO |
| **Amplitude** | Predictive Analytics | $49 - $2,000 | ✅ INCLUIDO |
| **Google Analytics 4** | Core Analytics | GRATIS | ✅ INCLUIDO |
| **Segment** | Event Tracking | $120 - $1,200 | ✅ INCLUIDO |
| **FullStory** | Session Replay | $199 - $499 | ✅ INCLUIDO |
| **Heap** | Auto-capture | $3,600/año | ✅ INCLUIDO |

**Total si pagaras todas:** ~$500 - $4,800/mes

**Tu costo con Firebase:** **$0/mes** (hasta 30k visitantes/mes) 🎉

---

## 🎓 DECISIÓN ESTRATÉGICA

### Opción A: Implementar TODO (Recomendado)
**Ventajas:**
- Sistema de analytics de nivel empresarial
- Control total de tus datos
- Sin límites artificiales
- Sin costos mensuales recurrentes
- Personalizable al 100%

**Desventajas:**
- Requiere tiempo de implementación inicial (3-5 días)
- Necesitas mantener el código

### Opción B: Implementar solo Fases 1-3
**Ventajas:**
- Rápido de implementar (1-2 días)
- Cubre 80% de necesidades
- Más simple de mantener

**Desventajas:**
- Te perderías features avanzados potentes
- Migrar después requiere más esfuerzo

### Opción C: Usar herramienta externa
**Ventajas:**
- Setup inmediato (minutos)
- Soporte oficial

**Desventajas:**
- Costo mensual recurrente ($100-$500/mes)
- Datos en servidores de terceros
- Límites según plan
- Menos personalizable

---

## 🚀 CUANDO ESTÉS LISTO

Avísame y empezamos con **FASE 1: MVP**

Te implementaré todo el tracking básico funcionando en 4-6 horas de trabajo.

Luego podemos continuar con las fases adicionales según tus prioridades.

---

**Última actualización:** 2025-12-11
**Estado:** Propuesta completa con 12 funcionalidades avanzadas, pendiente de implementación
