import sharp from 'sharp';
import { readdir, stat, mkdir, writeFile, unlink, rename } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

// Configuration
const CONFIG = {
  maxWidth: 1920,
  jpegQuality: 80,
  webpQuality: 80,
  pngCompressionLevel: 9,
};

// Images to optimize with custom settings
const CUSTOM_SIZES = {
  'cta.jpg': { width: 1920, quality: 75 },
  'leadership.jpg': { width: 1600, quality: 75 },
  'architecture-software.jpg': { width: 1600, quality: 75 },
  'tech-legal.jpg': { width: 1600, quality: 75 },
  'astronauta.jpg': { width: 1200, quality: 80 },
  'material-you.jpg': { width: 1200, quality: 80 },
  'contact.webp': { width: 1200, quality: 80 },
  'DavidMV.png': { width: 800, quality: 85 },
  'hero-video.webp': { width: 1280, quality: 75 },
  'programar-horas.webp': { width: 1200, quality: 75 },
  'https-seguridad.webp': { width: 1200, quality: 75 },
  'problema-seo.webp': { width: 1200, quality: 75 },
  'education.webp': { width: 1200, quality: 75 },
};

async function getFilesRecursively(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('_')) {
      await getFilesRecursively(fullPath, files);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        const stats = await stat(fullPath);
        // Only process files larger than 100KB
        if (stats.size > 100 * 1024) {
          files.push({ path: fullPath, size: stats.size, name: entry.name });
        }
      }
    }
  }

  return files;
}

async function optimizeImage(file) {
  const { path: filePath, size, name } = file;
  const ext = extname(name).toLowerCase();
  const customConfig = CUSTOM_SIZES[name] || {};

  const width = customConfig.width || CONFIG.maxWidth;
  const quality = customConfig.quality || (ext === '.png' ? undefined : CONFIG.jpegQuality);

  try {
    let pipeline = sharp(filePath).resize({
      width,
      withoutEnlargement: true
    });

    // Convert everything to WebP for best compression (except logos)
    if (name.includes('logo')) {
      if (ext === '.png') {
        pipeline = pipeline.png({ compressionLevel: CONFIG.pngCompressionLevel });
      } else {
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      }
    } else {
      // Convert JPG/PNG to WebP
      pipeline = pipeline.webp({ quality: quality || 80 });
    }

    const buffer = await pipeline.toBuffer();
    const savings = size - buffer.length;
    const savingsPercent = ((savings / size) * 100).toFixed(1);

    if (savings > 0) {
      // Determine output path (convert jpg to webp)
      const isJpg = ext === '.jpg' || ext === '.jpeg';
      const shouldConvertToWebp = isJpg && !name.includes('logo');
      const outputPath = shouldConvertToWebp
        ? filePath.replace(/\.jpe?g$/i, '.webp')
        : filePath;
      const outputName = shouldConvertToWebp
        ? name.replace(/\.jpe?g$/i, '.webp')
        : name;

      // Write to temp file, then replace/create
      const tempPath = outputPath + '.tmp';
      await writeFile(tempPath, buffer);

      // If converting format, delete original and rename temp
      if (shouldConvertToWebp) {
        await unlink(filePath); // Delete original .jpg
      } else {
        try { await unlink(outputPath); } catch {} // Delete existing if overwriting
      }
      await rename(tempPath, outputPath);

      console.log(`✓ ${name} → ${outputName}: ${formatSize(size)} → ${formatSize(buffer.length)} (-${savingsPercent}%)`);
      return savings;
    } else {
      console.log(`○ ${name}: Already optimized`);
      return 0;
    }
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`);
    return 0;
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function main() {
  console.log('🖼️  Scanning for large images...\n');

  const files = await getFilesRecursively(PUBLIC_DIR);
  files.sort((a, b) => b.size - a.size);

  console.log(`Found ${files.length} images larger than 100KB:\n`);
  files.forEach(f => console.log(`  ${f.name}: ${formatSize(f.size)}`));
  console.log('');

  let totalSavings = 0;

  for (const file of files) {
    totalSavings += await optimizeImage(file);
  }

  console.log(`\n✨ Total savings: ${formatSize(totalSavings)}`);
}

main().catch(console.error);
