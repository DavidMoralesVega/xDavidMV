#!/usr/bin/env node

/**
 * Script para optimizar fuentes Phosphor
 * - Elimina archivos SVG, TTF y WOFF
 * - Mantiene solo WOFF2 (mejor compresión)
 * - Actualiza plugins.min.css para usar solo WOFF2
 */

const fs = require("fs");
const path = require("path");

const FONTS_DIR = path.join(__dirname, "..", "public", "fonts", "Phosphor");
const CSS_FILE = path.join(__dirname, "..", "public", "css", "plugins.min.css");

console.log("🔧 Optimizando fuentes Phosphor...\n");

// 1. Leer CSS
let css = fs.readFileSync(CSS_FILE, "utf-8");
let filesDeleted = 0;
let sizeSaved = 0;

// 2. Eliminar archivos innecesarios
const files = fs.readdirSync(FONTS_DIR);
files.forEach((file) => {
  if (file.endsWith(".svg") || file.endsWith(".ttf") || file.endsWith(".woff")) {
    const filePath = path.join(FONTS_DIR, file);
    const stats = fs.statSync(filePath);
    sizeSaved += stats.size;

    fs.unlinkSync(filePath);
    filesDeleted++;
    console.log(`❌ Eliminado: ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  }
});

// 3. Actualizar CSS para usar solo WOFF2
const fontFaceRegex = /@font-face\s*\{[^}]*font-family:\s*Phosphor[^}]*\}/g;
const matches = css.match(fontFaceRegex);

if (matches) {
  matches.forEach((fontFace) => {
    // Extraer nombre de la fuente
    const fontFamilyMatch = fontFace.match(/font-family:\s*([^;]+);/);
    if (!fontFamilyMatch) return;

    const fontFamily = fontFamilyMatch[1].trim();
    const fontFile = fontFamily.replace(/['"]/g, "");

    // Crear nuevo @font-face solo con WOFF2
    const newFontFace = `@font-face {
  font-family: ${fontFamily};
  src: url(../fonts/Phosphor/${fontFile}.woff2) format("woff2");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}`;

    // Reemplazar
    css = css.replace(fontFace, newFontFace);
  });

  // Guardar CSS actualizado
  fs.writeFileSync(CSS_FILE, css, "utf-8");
  console.log(`\n✅ CSS actualizado (plugins.min.css)`);
}

console.log(`\n📊 Resumen:`);
console.log(`   Archivos eliminados: ${filesDeleted}`);
console.log(`   Espacio liberado: ${(sizeSaved / 1024 / 1024).toFixed(2)} MB`);
console.log(`\n✨ Optimización completada!`);
