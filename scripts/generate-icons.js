import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icons');

const sizes = [16, 48, 128, 192, 512];

async function generateIcons() {
  for (const size of sizes) {
    const svgPath = join(iconsDir, `icon${size}.svg`);
    const pngPath = join(iconsDir, `icon${size}.png`);

    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(pngPath);

    console.log(`Generated: icon${size}.png`);
  }
}

generateIcons().catch(console.error);
