# Content Security Policy (CSP) - Explicación

## Estado Actual

**CSP Implementado**: Pragmático y compatible con Next.js SSG

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline'
    https://www.googletagmanager.com
    https://www.google-analytics.com
    https://*.firebase.com
    https://*.googleapis.com
    https://static.cloudflareinsights.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self'
    https://firestore.googleapis.com
    https://*.firebase.com
    https://*.googleapis.com
    https://www.google-analytics.com
    https://api.ipify.org
    https://ipapi.co
    https://cloudflareinsights.com;
  frame-src 'self' https://www.google.com;
  worker-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests
```

---

## ¿Por Qué 'unsafe-inline' para Scripts?

### El Problema con SHA-256 Hashes en Next.js SSG

Inicialmente intentamos usar SHA-256 hashes específicos para cada script inline, pero esto **no es compatible** con Next.js en producción porque:

1. **Next.js genera múltiples scripts inline dinámicamente** durante el build:
   - Cada chunk de código tiene su propio script inline
   - Los hashes cambian en cada build
   - Hay ~30+ scripts inline diferentes

2. **Build-time vs Runtime**:
   - SSG genera HTML estático en build time
   - Los hashes de los scripts cambian con cada build
   - No hay forma de "inyectar" hashes dinámicamente en headers estáticos

3. **Cloudflare + Firebase Hosting**:
   - Firebase Hosting sirve a través de Cloudflare
   - Cloudflare inyecta sus propios scripts inline (Insights/Analytics)
   - Estos scripts también tienen hashes que cambian

### Ejemplo de Errores en Producción

```
Executing inline script violates CSP directive 'script-src 'self' sha256-...'
Either 'unsafe-inline', a hash ('sha256-mPTEjcoeOrs1OlsE6LeBDC6CGvo8/GeOPmSsZdvs7d0='),
or a nonce is required.
```

Cada script inline de Next.js requeriría su propio hash, y estos cambian en cada build.

---

## Alternativas Evaluadas

### ❌ Opción 1: SHA-256 Hashes Individuales
**Estado**: Intentado, no funcional con Next.js SSG

**Por qué no funciona**:
- Next.js genera ~30 scripts inline con hashes únicos
- Los hashes cambian en cada build
- Imposible mantener manualmente
- Script de auto-generación no puede actualizar headers estáticos de Firebase

### ❌ Opción 2: Nonces Dinámicos
**Estado**: No compatible con SSG puro

**Por qué no funciona**:
- Requiere generar nonce único en cada request
- SSG genera HTML estático una sola vez
- No hay server-side rendering para generar nonces

**Posible con**:
- Next.js con SSR (Server-Side Rendering)
- Next.js con middleware
- Edge functions

**No compatible con**:
- SSG puro (Static Site Generation)
- Firebase Hosting estático

### ❌ Opción 3: CSP en Meta Tags
**Estado**: Más flexible pero con limitaciones

**Implementación**:
```tsx
// app/layout.tsx
<meta httpEquiv="Content-Security-Policy" content="..." />
```

**Ventajas**:
- Puede incluirse en HTML generado
- Podría usar nonces en build time

**Desventajas**:
- CSP en meta tag es menos fuerte que en headers
- No protege la carga inicial del documento
- No previene ciertos ataques de timing

### ❌ Opción 4: Extraer Todos los Scripts Inline
**Estado**: Técnicamente posible pero muy complejo

**Requeriría**:
```js
// next.config.js
module.exports = {
  compiler: {
    removeConsole: true,
    // Configurar para evitar inline scripts
  },
  experimental: {
    // Múltiples flags experimentales
  }
}
```

**Problemas**:
- Rompe optimizaciones de Next.js
- Afecta performance (más requests HTTP)
- Cloudflare aún inyecta scripts inline
- Mantenimiento complejo

---

## ✅ Solución Implementada: CSP Pragmático

### Estrategia de Seguridad en Capas

Aunque usamos `'unsafe-inline'` para scripts, mantenemos **múltiples capas de seguridad**:

#### 1. Restricciones de Script muy específicas
```
script-src 'self' 'unsafe-inline'
  https://www.googletagmanager.com      # Google Analytics
  https://www.google-analytics.com      # Google Analytics
  https://*.firebase.com                # Firebase
  https://*.googleapis.com              # Google APIs
  https://static.cloudflareinsights.com # Cloudflare
```

**Solo** estos dominios pueden cargar scripts. Ningún otro dominio puede inyectar JavaScript.

#### 2. Otras Directivas Fuertes
- `object-src 'none'` - No Flash, no plugins
- `base-uri 'self'` - Previene ataques de base tag injection
- `form-action 'self'` - Formularios solo pueden enviarse a mismo origen
- `frame-ancestors 'none'` - Previene clickjacking
- `upgrade-insecure-requests` - Fuerza HTTPS

#### 3. Headers de Seguridad Adicionales
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
```

#### 4. Validación en Cliente
- Validación Zod en formularios (previene inyección)
- Honeypot anti-spam
- Sanitización de inputs

#### 5. Contexto del Sitio
- **Portfolio estático** - No hay área de admin
- **No user-generated content** - No comentarios, no posts de usuarios
- **SSG puro** - No dynamic rendering server-side
- **Sin cookies sensibles** - No sesiones, no auth

---

## Nivel de Seguridad

### ⚠️ Con 'unsafe-inline'

| Protección | Estado | Notas |
|------------|--------|-------|
| XSS via script inline malicioso | ⚠️ Parcial | Solo si hay vulnerabilidad en tu código |
| XSS via script externo | ✅ Protegido | Solo dominios whitelisted |
| Clickjacking | ✅ Protegido | frame-ancestors 'none' |
| MIME sniffing | ✅ Protegido | nosniff header |
| Form hijacking | ✅ Protegido | form-action 'self' |
| Base tag injection | ✅ Protegido | base-uri 'self' |
| Plugin-based attacks | ✅ Protegido | object-src 'none' |

### Mitigación del Riesgo de 'unsafe-inline'

El riesgo es **bajo** porque:

1. **No hay inputs sin sanitizar**: Todo input pasa por Zod validation
2. **No hay user-generated content**: Es un portfolio personal
3. **No hay área administrativa**: No login, no dashboard
4. **Código auditado**: Todo el código es tuyo y controlado
5. **Build determinístico**: El HTML es estático y revisable

**Vector de ataque realista**:
- Requeriría encontrar vulnerabilidad XSS en tu código
- Y que la vulnerabilidad permita inyectar `<script>` tag
- Muy improbable en un sitio estático sin inputs dinámicos

---

## Comparación: Antes vs Después

### Antes (Sin CSP)
```
// Sin headers de seguridad
```
- ❌ Cualquier dominio puede cargar scripts
- ❌ Sin protección contra clickjacking
- ❌ Sin HTTPS forzado
- **Nivel de Seguridad**: 3/10

### Intento Inicial (SHA-256 Hashes)
```
script-src 'self' sha256-mDLClJfQZGN7vFs6ooSG4lfDonk43CDKGWvoL+UI0EU= ...
```
- ✅ Máxima seguridad
- ❌ **No funciona en producción** (Next.js genera múltiples hashes)
- ❌ Sitio roto en producción
- **Nivel de Seguridad**: 0/10 (sitio no funcional)

### Actual (Pragmático)
```
script-src 'self' 'unsafe-inline' [dominios específicos]
```
- ✅ Funciona en producción
- ✅ Dominios whitelisted muy específicos
- ✅ Múltiples capas de protección
- ⚠️ 'unsafe-inline' permite scripts inline
- **Nivel de Seguridad**: 7.5/10

---

## Roadmap de Mejoras Futuras

### Corto Plazo (Si se requiere mayor seguridad)

1. **Migrar a Next.js con SSR** (Server-Side Rendering)
   - Permite usar nonces dinámicos
   - CSP perfecto posible
   - Requiere: Vercel, AWS, o servidor Node.js

2. **Implementar Trusted Types**
   ```
   Content-Security-Policy:
     require-trusted-types-for 'script';
     trusted-types nextjs react;
   ```
   - Previene DOM XSS
   - Compatible con Next.js 15+

### Largo Plazo

3. **Migrar de Cloudflare Hosting a Plataforma con Edge Functions**
   - Vercel Edge Functions
   - Cloudflare Workers
   - AWS Lambda@Edge
   - Permite CSP con nonces dinámicos

4. **Implementar CSP Reporting**
   ```
   Content-Security-Policy-Report-Only: ...
   report-uri https://your-csp-reporter.com/report
   ```
   - Monitorear violaciones
   - Ajustar política basado en datos reales

---

## Recomendaciones

### Para Este Proyecto (Portfolio SSG)
✅ **Mantener CSP actual** - Balance óptimo entre seguridad y funcionalidad

### Si Migras a Aplicación Dinámica
⚠️ **Considerar migrar a SSR** - Para habilitar nonces y CSP más estricto

### Si Agregas User-Generated Content
🔴 **Requerir CSP estricto** - Migrar a SSR con nonces es OBLIGATORIO

---

## Recursos

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator (Google)](https://csp-evaluator.withgoogle.com/)
- [Next.js CSP Documentation](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

---

**Última Actualización**: Diciembre 12, 2025
**Versión**: 1.1.0 (CSP Pragmático para SSG)
**Estado**: ✅ Funcional en Producción
