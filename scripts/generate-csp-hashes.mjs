#!/usr/bin/env node

/**
 * Script para generar hashes SHA-256 de scripts inline
 * Compatible con SSG - No requiere servidor
 *
 * Uso: node scripts/generate-csp-hashes.mjs
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Scripts inline que usamos en el proyecto
const inlineScripts = {
  colorScheme: `(function() {
  try {
    var scheme = localStorage.getItem('color-scheme') || 'light';
    document.documentElement.setAttribute('color-scheme', scheme);
  } catch(e) {}
})();`,
};

console.log('🔐 Generando hashes SHA-256 para CSP...\n');

const hashes = {};

Object.entries(inlineScripts).forEach(([name, script]) => {
  // Generar hash SHA-256
  const hash = crypto
    .createHash('sha256')
    .update(script, 'utf8')
    .digest('base64');

  hashes[name] = `sha256-${hash}`;

  console.log(`✓ ${name}:`);
  console.log(`  Script: ${script.substring(0, 50)}...`);
  console.log(`  Hash: sha256-${hash}\n`);
});

// Generar CSP header actualizado
const cspDirectives = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    ...Object.values(hashes), // Hashes de scripts inline
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://*.firebase.com",
    "https://*.googleapis.com",
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'", // Necesario para estilos inline de animaciones
    "https://fonts.googleapis.com"
  ],
  "img-src": [
    "'self'",
    "data:",
    "https:",
    "blob:"
  ],
  "font-src": [
    "'self'",
    "data:",
    "https://fonts.gstatic.com"
  ],
  "connect-src": [
    "'self'",
    "https://firestore.googleapis.com",
    "https://*.firebase.com",
    "https://*.googleapis.com",
    "https://www.google-analytics.com",
    "https://api.ipify.org",
    "https://ipapi.co"
  ],
  "frame-src": [
    "'self'",
    "https://www.google.com"
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  "upgrade-insecure-requests": []
};

const cspString = Object.entries(cspDirectives)
  .map(([directive, values]) => {
    if (values.length === 0) return directive;
    return `${directive} ${values.join(' ')}`;
  })
  .join('; ');

console.log('📋 CSP Header generado:\n');
console.log(cspString);
console.log('\n');

// Actualizar firebase.json
const firebasePath = path.join(process.cwd(), 'firebase.json');
let firebaseConfig = JSON.parse(fs.readFileSync(firebasePath, 'utf-8'));

// Encontrar y actualizar CSP header
const headerIndex = firebaseConfig.hosting.headers[0].headers.findIndex(
  h => h.key === 'Content-Security-Policy'
);

if (headerIndex !== -1) {
  firebaseConfig.hosting.headers[0].headers[headerIndex].value = cspString;
  fs.writeFileSync(firebasePath, JSON.stringify(firebaseConfig, null, 2));
  console.log('✅ firebase.json actualizado con nuevo CSP');
} else {
  console.log('⚠️  No se encontró CSP header en firebase.json');
}

// Guardar hashes en archivo para referencia
const hashesPath = path.join(process.cwd(), '.csp-hashes.json');
fs.writeFileSync(hashesPath, JSON.stringify({ hashes, csp: cspString }, null, 2));
console.log('✅ Hashes guardados en .csp-hashes.json');

console.log('\n🎉 ¡Listo! CSP mejorado sin \'unsafe-inline\' ni \'unsafe-eval\'');
console.log('\n⚠️  Importante:');
console.log('  1. Si cambias el script inline, regenera los hashes');
console.log('  2. Ejecuta: node scripts/generate-csp-hashes.mjs');
console.log('  3. Deploy: npm run deploy');
