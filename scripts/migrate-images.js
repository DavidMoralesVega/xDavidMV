#!/usr/bin/env node

/**
 * Script para migrar de Next/Image a <img> nativo
 * - Reemplaza import de next/image
 * - Convierte componentes <Image> a <img>
 * - Agrega loading="lazy" y fetchpriority según corresponda
 */

const fs = require("fs");
const path = require("path");

const files = [
  "components/ui/ImageLightbox.tsx",
  "components/sections/hero/HeroSection.tsx",
  "components/sections/TechStackSection.tsx",
  "components/sections/CtaSection.tsx",
  "components/sections/BlogSection.tsx",
  "components/portfolios/PortfolioMasonry.tsx",
  "components/pages/services/Services.tsx",
  "components/headers/Header.tsx",
  "components/blogs/BlogListClient.tsx",
  "components/blogs/BlogArticle.tsx",
  "app/404/page.tsx",
  "app/not-found.tsx",
  "components/mdx/MDXComponents.tsx",
];

let filesProcessed = 0;
let replacements = 0;

console.log("🖼️  Migrando imágenes Next/Image a <img> nativo...\n");

files.forEach((file) => {
  const filePath = path.join(__dirname, "..", file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Saltando ${file} (no existe)`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;

  // 1. Eliminar import de next/image
  if (content.includes('from "next/image"') || content.includes("from 'next/image'")) {
    content = content.replace(/import\s+Image\s+from\s+["']next\/image["'];?\n?/g, "");
    modified = true;
    replacements++;
  }

  // 2. Reemplazar <Image ... /> y <Image ...> ... </Image> por <img ... />
  // Buscar tanto self-closing como con cierre
  const imageSelfClosingRegex = /<Image\s+([^>]*)\/?>/g;
  const imageWithClosingRegex = /<Image\s+([^>]*)>[\s\S]*?<\/Image>/g;

  // Primero manejar self-closing tags
  let matches = content.match(imageSelfClosingRegex);
  if (matches) {
    matches.forEach((match) => {
      if (match.includes("</Image>")) return; // Skip if it's actually a closing tag

      const imgTag = convertImageToImg(match);
      if (imgTag) {
        content = content.replace(match, imgTag);
        modified = true;
        replacements++;
      }
    });
  }

  // Luego manejar tags con cierre
  matches = content.match(imageWithClosingRegex);
  if (matches) {
    matches.forEach((match) => {
      const imgTag = convertImageToImg(match);
      if (imgTag) {
        content = content.replace(match, imgTag);
        modified = true;
        replacements++;
      }
    });
  }

  function convertImageToImg(match) {
    // Extraer atributos - manejar ambos {variable} y "string"
    const srcMatch = match.match(/src=\{([^}]+)\}|src="([^"]+)"/);
    const altMatch = match.match(/alt=\{([^}]+)\}|alt="([^"]+)"/);
    const widthMatch = match.match(/width=\{?(\d+)\}?/);
    const heightMatch = match.match(/height=\{?(\d+)\}?/);
    const priorityMatch = match.includes("priority");
    const classNameMatch = match.match(/className="([^"]+)"/);

    if (!srcMatch || !altMatch) return null;

    const src = srcMatch[1] || srcMatch[2];
    const alt = altMatch[1] || altMatch[2];
    const width = widthMatch ? widthMatch[1] : "";
    const height = heightMatch ? heightMatch[1] : "";
    const className = classNameMatch ? classNameMatch[1] : "";

    // Determinar si src es variable o string
    const srcAttr = src.startsWith("{") ? `src={${src}}` : `src="${src}"`;
    const altAttr = alt.includes(".") || alt.includes(" ") ? `alt={${alt}}` : `alt="${alt}"`;

    // Construir <img> nativo
    let imgTag = `<img\n`;
    imgTag += `                ${srcAttr}\n`;
    imgTag += `                ${altAttr}\n`;
    if (width) imgTag += `                width="${width}"\n`;
    if (height) imgTag += `                height="${height}"\n`;
    if (className) imgTag += `                className="${className}"\n`;

    // Agregar loading y fetchpriority
    if (priorityMatch) {
      imgTag += `                fetchPriority="high"\n`;
      imgTag += `                loading="eager"\n`;
    } else {
      imgTag += `                loading="lazy"\n`;
    }

    imgTag += `              />`;

    return imgTag;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf-8");
    filesProcessed++;
    console.log(`✅ ${file}`);
  } else {
    console.log(`⏭️  ${file} (sin cambios)`);
  }
});

console.log(`\n📊 Resumen:`);
console.log(`   Archivos procesados: ${filesProcessed}`);
console.log(`   Reemplazos realizados: ${replacements}`);
console.log(`\n✨ Migración completada!`);
