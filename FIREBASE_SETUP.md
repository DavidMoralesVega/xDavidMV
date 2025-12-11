# 🔥 Firebase + App Check Setup

## ✅ Estado de Implementación

- ✅ Firebase SDK instalado
- ✅ Firebase App Check configurado con reCAPTCHA v3
- ✅ Variables de entorno configuradas
- ✅ Integración en layout principal

---

## 🔐 Firebase App Check - reCAPTCHA v3

### Configuración Actual

**reCAPTCHA Site Key:** `6LcmsygsAAAAADhVJ5jA9QD_qqngMR8TWngrdmLN`

**Proyecto Firebase:** `xdavidmv`

### ¿Qué protege App Check?

- ✅ **Firestore Database** - Cuando lo implementes
- ✅ **Cloud Storage** - Cuando lo implementes
- ✅ **Cloud Functions** - Cuando las implementes
- ✅ **Firebase Analytics** - Ya activo

### Cómo funciona

1. Cuando un usuario visita tu sitio, reCAPTCHA v3 verifica que sea un navegador legítimo
2. Si es legítimo, Firebase genera un **token** que se auto-refresca cada hora
3. Todas las requests a servicios Firebase **requieren** este token
4. Los bots sin token son **bloqueados automáticamente**

---

## 📊 Firebase Analytics

### Eventos que se trackean automáticamente:

- `page_view` - Vistas de página
- `scroll` - Profundidad de scroll
- `click` - Clics en enlaces
- `session_start` - Inicio de sesión
- `first_visit` - Primera visita

### Eventos personalizados disponibles:

```typescript
import {
  trackContactFormSubmit,
  trackNewsletterSubscribe,
  trackBlogArticleRead,
  trackConferenceView,
  trackSocialClick,
  trackCVDownload
} from '@/lib/firebase';

// Ejemplo de uso:
trackContactFormSubmit('footer');
trackBlogArticleRead('arquitectura-hexagonal', 8);
trackSocialClick('linkedin', 'https://linkedin.com/in/...');
```

---

## 🚀 Próximos Pasos

### 1. Verificar que funciona

```bash
npm run dev
```

Abre la consola del navegador y deberías ver:
```
✅ Firebase App Check activado con reCAPTCHA v3
🔥 Firebase inicializado correctamente
```

### 2. Habilitar Enforcement en Firebase Console

1. Ve a: https://console.firebase.google.com/project/xdavidmv/appcheck
2. Click en cada servicio que quieras proteger
3. Activa "Enforcement"
4. **IMPORTANTE:** Solo hazlo DESPUÉS de verificar que funciona en dev

### 3. Implementar Firestore (Opcional pero recomendado)

Si quieres guardar contactos y newsletter en Firebase:

```typescript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Guardar contacto
await addDoc(collection(db, 'contacts'), {
  name: data.Name,
  email: data['E-mail'],
  message: data.Message,
  createdAt: new Date()
});
```

### 4. Monitorear en Firebase Console

- **Analytics:** https://console.firebase.google.com/project/xdavidmv/analytics
- **App Check:** https://console.firebase.google.com/project/xdavidmv/appcheck

---

## 🛡️ Seguridad

### ¿Qué hacer si ves intentos bloqueados?

1. Ve a Firebase Console → App Check
2. Revisa "Requests bloqueadas"
3. Verás IPs y patterns de ataque
4. Ajusta reglas de Firestore si es necesario

### Firestore Security Rules (cuando implementes)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo requests con App Check token válido
    match /{document=**} {
      allow read: if request.auth != null || request.token.firebase.sign_in_provider != null;
      allow write: if request.token.firebase.sign_in_provider != null;
    }
  }
}
```

---

## 📝 Archivos Creados

- `lib/firebase.ts` - Configuración de Firebase
- `components/firebase/FirebaseInit.tsx` - Inicializador client-side
- `.env.local` - Variables de entorno (NO subir a Git)
- `.env.example` - Template de variables

---

## ⚠️ Importante

- **NO subas** `.env.local` a Git (ya está en `.gitignore`)
- **La Site Key** es pública (puede estar en el código)
- **La Secret Key** NUNCA debe estar en el frontend
- Firebase maneja la Secret Key en su backend

---

## 🔗 Enlaces Útiles

- **Firebase Console:** https://console.firebase.google.com/project/xdavidmv
- **reCAPTCHA Admin:** https://www.google.com/recaptcha/admin
- **Firebase Docs:** https://firebase.google.com/docs/app-check
- **reCAPTCHA v3 Docs:** https://developers.google.com/recaptcha/docs/v3

---

## 🎯 Testing

### Verificar que App Check funciona

```javascript
// Abre la consola del navegador en tu sitio
console.log('App Check token:', await firebase.appCheck().getToken());

// Deberías ver:
// { token: "eyJhbGc...", expireTimeMillis: 1234567890 }
```

### Ver analytics en tiempo real

1. Firebase Console → Analytics → Realtime
2. Navega por tu sitio
3. Deberías ver eventos en tiempo real

---

## 💰 Costos

Todo lo implementado es **100% GRATIS**:

- Firebase App Check: GRATIS
- reCAPTCHA v3: GRATIS (10,000 evaluaciones/mes)
- Firebase Analytics: GRATIS (sin límites)
- Firestore: GRATIS (50k lecturas/día, 20k escrituras/día)

---

## 🐛 Troubleshooting

### Error: "App Check token not found"

**Solución:** Verifica que `.env.local` tenga todas las variables

### Error: "reCAPTCHA site key invalid"

**Solución:** Verifica que el dominio esté autorizado en reCAPTCHA Admin

### No veo eventos en Analytics

**Solución:**
1. Verifica que `measurementId` esté en `.env.local`
2. Analytics puede tardar 24h en mostrar datos iniciales
3. Usa la vista "Realtime" para ver eventos inmediatos

---

¡Firebase App Check está listo! 🎉
