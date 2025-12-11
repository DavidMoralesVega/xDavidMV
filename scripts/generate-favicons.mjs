import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const logoPath = join(projectRoot, 'public', 'img', 'logo.png');
const faviconDir = join(projectRoot, 'public', 'img', 'favicon');

const sizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 180, name: 'apple-touch-icon.png' }, // Regenerate Apple icon from logo
];

async function generateFavicons() {
  console.log('Generating favicons from logo.png...\n');

  for (const { size, name } of sizes) {
    const outputPath = join(faviconDir, name);

    try {
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`✗ Failed to generate ${name}:`, error.message);
    }
  }

  console.log('\n✓ Favicon generation complete!');
}

generateFavicons().catch(console.error);
