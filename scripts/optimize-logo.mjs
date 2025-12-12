import sharp from 'sharp';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public', 'img');

async function main() {
  const logoPath = join(PUBLIC_DIR, 'logo.png');
  const outputPath = join(PUBLIC_DIR, 'logo-small.png');

  // Create 112x112 (2x for retina) optimized logo
  await sharp(logoPath)
    .resize(112, 112, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(outputPath);

  console.log('✓ Created optimized logo-small.png (112x112 for 56x56 @2x)');
}

main().catch(console.error);
