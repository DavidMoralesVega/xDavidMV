import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const logoPath = join(projectRoot, 'public', 'img', 'logo.png');
const faviconDir = join(projectRoot, 'public', 'img', 'favicon');

const androidSizes = [
  { size: 512, name: 'android-icon-512.png' },
];

async function generateAndroidIcons() {
  console.log('Generating Android icons from logo.png...\n');

  for (const { size, name } of androidSizes) {
    const outputPath = join(faviconDir, name);

    try {
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`✗ Failed to generate ${name}:`, error.message);
    }
  }

  console.log('\n✓ Android icon generation complete!');
}

generateAndroidIcons().catch(console.error);
