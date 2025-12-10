# Plan de Internacionalización (i18n) - moralesvegadavid.com

> **Estado:** Pendiente de implementación
> **Fecha:** 2025-12-10
> **Prioridad:** Media

---

## Resumen Ejecutivo

Implementar internacionalización usando **subdirectorios con next-intl**, manteniendo español como idioma por defecto (sin prefijo) e inglés con prefijo `/en/`.

---

## Decisión Técnica

### Método Elegido: Subdirectorios + next-intl

```
https://www.moralesvegadavid.com/           → Español (default)
https://www.moralesvegadavid.com/en/        → English
https://www.moralesvegadavid.com/contact    → Contacto (español)
https://www.moralesvegadavid.com/en/contact → Contact (inglés)
```

### ¿Por qué esta opción?

| Criterio | Puntuación |
|----------|------------|
| SEO | ⭐⭐⭐⭐⭐ |
| Profesionalismo | ⭐⭐⭐⭐⭐ |
| Control de traducciones | ⭐⭐⭐⭐⭐ |
| Compatibilidad Firebase | ⭐⭐⭐⭐⭐ |
| Indexación Google | ⭐⭐⭐⭐⭐ |
| Facilidad de implementación | ⭐⭐⭐ |

---

## Opciones Descartadas

### ❌ Google Translate Widget
- **Razón:** Malo para SEO, no indexa versiones traducidas, traducciones de baja calidad para términos técnicos.

### ❌ Subdominios (es.domain.com / en.domain.com)
- **Razón:** Requiere configuración DNS adicional, no compatible fácilmente con static export, mayor complejidad de mantenimiento.

### ❌ Query Parameters (?lang=en)
- **Razón:** Muy malo para SEO, URLs no amigables.

---

## Arquitectura Propuesta

### Estructura de Carpetas (Después)

```
app/
├── [lang]/                         # Parámetro dinámico de idioma
│   ├── layout.tsx                  # Layout con idioma
│   ├── page.tsx                    # Home
│   ├── contact/
│   │   └── page.tsx
│   ├── (blogs)/
│   │   ├── blog-standard/
│   │   │   └── page.tsx
│   │   └── blog-article/
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── (portfolios)/
│   │   └── conferencias/
│   │       └── page.tsx
│   └── preview/
│       └── page.tsx
│
├── dictionaries/                   # Traducciones
│   ├── es.json                     # Español
│   └── en.json                     # English
│
├── lib/
│   ├── i18n.ts                     # Configuración i18n
│   └── dictionaries.ts             # Loader de diccionarios
│
└── middleware.ts                   # Detección de idioma
```

### Archivos de Traducción

**dictionaries/es.json**
```json
{
  "metadata": {
    "title": "David Morales Vega | Arquitecto de Soluciones & Tech Lead",
    "description": "Arquitecto de Soluciones y Technical Lead con 7+ años de experiencia..."
  },
  "nav": {
    "home": "Inicio",
    "conferences": "Conferencias",
    "blog": "Blog",
    "contact": "Contacto"
  },
  "hero": {
    "title": "Arquitectura. Desarrollo. Innovación. Liderazgo.",
    "subtitle": "Hola! Soy David Morales Vega.",
    "role": "Arquitecto de Soluciones, Tech Lead e Ing. de Software.",
    "cta": "Ver conferencias",
    "download_cv": "Descargar CV"
  },
  "about": {
    "experience": "Años de experiencia",
    "talks": "Charlas y Talleres",
    "manifest": "Diseño ecosistemas digitales escalables..."
  },
  "contact": {
    "title": "Contacto",
    "subtitle": "Conectemos",
    "form": {
      "name": "Nombre",
      "email": "Correo electrónico",
      "message": "Mensaje",
      "send": "Enviar mensaje"
    }
  },
  "footer": {
    "rights": "Todos los derechos reservados",
    "location": "Oruro, Bolivia"
  }
}
```

**dictionaries/en.json**
```json
{
  "metadata": {
    "title": "David Morales Vega | Solutions Architect & Tech Lead",
    "description": "Solutions Architect and Technical Lead with 7+ years of experience..."
  },
  "nav": {
    "home": "Home",
    "conferences": "Conferences",
    "blog": "Blog",
    "contact": "Contact"
  },
  "hero": {
    "title": "Architecture. Development. Innovation. Leadership.",
    "subtitle": "Hi! I'm David Morales Vega.",
    "role": "Solutions Architect, Tech Lead & Software Engineer.",
    "cta": "View conferences",
    "download_cv": "Download CV"
  },
  "about": {
    "experience": "Years of experience",
    "talks": "Talks & Workshops",
    "manifest": "I design scalable digital ecosystems..."
  },
  "contact": {
    "title": "Contact",
    "subtitle": "Let's connect",
    "form": {
      "name": "Name",
      "email": "Email",
      "message": "Message",
      "send": "Send message"
    }
  },
  "footer": {
    "rights": "All rights reserved",
    "location": "Oruro, Bolivia"
  }
}
```

---

## Configuración Técnica

### 1. Middleware (middleware.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';

const locales = ['es', 'en'];
const defaultLocale = 'es';

function getLocale(request: NextRequest): string {
  // Detectar idioma del navegador
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0].split('-')[0];
    if (locales.includes(preferred)) {
      return preferred;
    }
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si ya tiene locale en la URL
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Para español (default), no redirigir
  // Para otros idiomas, detectar y redirigir si es necesario
  const locale = getLocale(request);

  // Si el idioma detectado es inglés, redirigir a /en/
  if (locale === 'en') {
    request.nextUrl.pathname = `/en${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Si es español, mantener sin prefijo
  return;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|img|video|.*\\..*).*)'],
};
```

### 2. Configuración i18n (lib/i18n.ts)

```typescript
export const i18n = {
  defaultLocale: 'es',
  locales: ['es', 'en'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
```

### 3. Loader de Diccionarios (lib/dictionaries.ts)

```typescript
import type { Locale } from './i18n';

const dictionaries = {
  es: () => import('../dictionaries/es.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
```

---

## Cambios en SEO

### Hreflang Tags (Automáticos)

```html
<link rel="alternate" hreflang="es" href="https://www.moralesvegadavid.com/" />
<link rel="alternate" hreflang="en" href="https://www.moralesvegadavid.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://www.moralesvegadavid.com/" />
```

### Sitemap Actualizado

```xml
<url>
  <loc>https://www.moralesvegadavid.com/</loc>
  <xhtml:link rel="alternate" hreflang="es" href="https://www.moralesvegadavid.com/"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://www.moralesvegadavid.com/en/"/>
</url>
<url>
  <loc>https://www.moralesvegadavid.com/en/</loc>
  <xhtml:link rel="alternate" hreflang="es" href="https://www.moralesvegadavid.com/"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://www.moralesvegadavid.com/en/"/>
</url>
```

### Open Graph por Idioma

```typescript
// Español
og:locale = "es_BO"

// English
og:locale = "en_US"
og:locale:alternate = "es_BO"
```

---

## Plan de Implementación

### Fase 1: Preparación (1-2 horas)
- [ ] Instalar dependencia: `npm install next-intl`
- [ ] Crear estructura de carpetas `[lang]`
- [ ] Crear archivos de configuración i18n
- [ ] Crear middleware de detección

### Fase 2: Traducciones (2-3 horas)
- [ ] Crear `dictionaries/es.json` con todos los textos
- [ ] Crear `dictionaries/en.json` con traducciones
- [ ] Revisar y ajustar traducciones técnicas

### Fase 3: Migración de Componentes (3-4 horas)
- [ ] Actualizar layout.tsx para usar diccionarios
- [ ] Migrar cada página para usar traducciones
- [ ] Actualizar componentes con textos hardcodeados
- [ ] Agregar selector de idioma en header/footer

### Fase 4: SEO y Metadata (1-2 horas)
- [ ] Actualizar `lib/seo.tsx` para soportar i18n
- [ ] Configurar hreflang tags
- [ ] Actualizar sitemap.ts para múltiples idiomas
- [ ] Actualizar robots.txt

### Fase 5: Testing y QA (1-2 horas)
- [ ] Verificar todas las rutas en ambos idiomas
- [ ] Probar detección automática de idioma
- [ ] Validar SEO con herramientas
- [ ] Probar en dispositivos móviles

---

## Componente Selector de Idioma

```tsx
// components/common/LanguageSwitcher.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '@/lib/i18n';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    // Remover locale actual del pathname
    let newPath = pathname;
    i18n.locales.forEach((locale) => {
      if (pathname.startsWith(`/${locale}/`)) {
        newPath = pathname.replace(`/${locale}`, '');
      } else if (pathname === `/${locale}`) {
        newPath = '/';
      }
    });

    // Agregar nuevo locale (excepto para español que es default)
    if (newLocale === 'en') {
      newPath = `/en${newPath}`;
    }

    router.push(newPath);
  };

  return (
    <div className="language-switcher">
      <button
        onClick={() => switchLocale('es')}
        className={currentLocale === 'es' ? 'active' : ''}
      >
        ES
      </button>
      <span>/</span>
      <button
        onClick={() => switchLocale('en')}
        className={currentLocale === 'en' ? 'active' : ''}
      >
        EN
      </button>
    </div>
  );
}
```

---

## Consideraciones Especiales

### Términos que NO se traducen
Mantener en inglés en ambos idiomas:
- Angular
- NestJS
- TypeScript
- React
- Next.js
- DevOps
- CI/CD
- Docker
- GraphQL
- Tech Lead (opcional)

### Blog Articles
- Los artículos del blog pueden tener versiones en cada idioma
- O pueden existir solo en un idioma con indicador
- Decisión pendiente según contenido

### URLs de Conferencias
```
/conferencias           → Español
/en/conferences         → English (traducir slug)
```

---

## Estimación de Tiempo Total

| Fase | Tiempo Estimado |
|------|-----------------|
| Fase 1: Preparación | 1-2 horas |
| Fase 2: Traducciones | 2-3 horas |
| Fase 3: Migración | 3-4 horas |
| Fase 4: SEO | 1-2 horas |
| Fase 5: Testing | 1-2 horas |
| **Total** | **8-13 horas** |

---

## Recursos

- [Next.js Internationalization Docs](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Google Hreflang Guide](https://developers.google.com/search/docs/specialty/international/localized-versions)

---

## Notas Adicionales

- La implementación es compatible con `output: "export"` (static)
- Firebase Hosting soporta esta estructura
- El middleware funciona en el edge para detección de idioma
- Las traducciones se pueden generar con ayuda de IA y luego revisar manualmente

---

**Última actualización:** 2025-12-10
**Autor:** Claude Code Assistant
