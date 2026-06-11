import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceMap = 'C:/Users/21939/AppData/Local/Temp/codex-clipboard-12e3dccc-8800-4c3d-9ed2-83db91435b0f.png';
const sourcePlayers = 'C:/Users/21939/AppData/Local/Temp/codex-clipboard-b623ad23-aa3b-4377-a8f4-7685a5bebd93.png';
const publicDir = path.join(root, 'public', 'posters');
const width = 2048;
const height = 1152;

const mapClip = `
  M235 210
  C315 135 430 95 555 115
  C665 45 790 35 900 90
  C1000 35 1135 35 1235 95
  C1370 95 1515 115 1640 185
  C1760 235 1835 315 1815 405
  C1885 475 1840 565 1765 610
  C1715 690 1615 725 1540 765
  C1445 830 1365 900 1245 925
  C1150 1000 1030 1035 930 990
  C825 1015 730 960 650 905
  C560 875 465 820 430 740
  C335 690 280 610 300 525
  C225 450 220 340 275 285
  C245 260 230 235 235 210 Z
`;

await fs.mkdir(publicDir, { recursive: true });
await fs.copyFile(sourceMap, path.join(publicDir, 'north-america-landmarks.png'));

const base = await sharp(sourceMap)
  .resize(width, height, { fit: 'cover' })
  .modulate({ brightness: 0.82, saturation: 0.76 })
  .blur(0.35)
  .png()
  .toBuffer();

const groupSoftMask = Buffer.from(`
  <svg width="1480" height="650" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="blur"><feGaussianBlur stdDeviation="42"/></filter>
    </defs>
    <rect x="55" y="65" width="1370" height="560" rx="150" fill="white" filter="url(#blur)"/>
  </svg>
`);

const groupCrop = await sharp(sourcePlayers)
  .extract({ left: 145, top: 175, width: 740, height: 325 })
  .resize(1480, 650, { fit: 'fill' })
  .modulate({ brightness: 0.96, saturation: 0.72 })
  .composite([{ input: groupSoftMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const clipMask = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="white"/>
        <stop offset=".72" stop-color="white"/>
        <stop offset="1" stop-color="black"/>
      </linearGradient>
    </defs>
    <path d="${mapClip}" fill="url(#fade)"/>
  </svg>
`);

const portraitsCanvas = await sharp({
  create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([{ input: groupCrop, left: 340, top: 390 }])
  .png()
  .toBuffer();

const clippedPortraits = await sharp(portraitsCanvas)
  .composite([{ input: clipMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const finish = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="left" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#080706" stop-opacity=".93"/>
        <stop offset=".36" stop-color="#130d08" stop-opacity=".62"/>
        <stop offset=".62" stop-color="#130d08" stop-opacity=".06"/>
        <stop offset="1" stop-color="#080706" stop-opacity=".24"/>
      </linearGradient>
      <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset=".55" stop-color="#080706" stop-opacity="0"/>
        <stop offset="1" stop-color="#080706" stop-opacity=".72"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#left)"/>
    <rect width="${width}" height="${height}" fill="url(#bottom)"/>
  </svg>
`);

await sharp(base)
  .composite([
    { input: clippedPortraits, left: 0, top: 0 },
    { input: finish, left: 0, top: 0 },
  ])
  .webp({ quality: 91 })
  .toFile(path.join(publicDir, 'north-america-stars-hero.webp'));

console.log('Generated public/posters/north-america-stars-hero.webp');
