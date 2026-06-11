import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceDir = path.join(root, 'public', 'stars');
const outputDir = path.join(root, 'public', 'posters');
const width = 2400;
const height = 1800;

const players = [
  { file: 'haaland.jpg', x: 1110, y: 140, w: 360, h: 760, zoom: 1.2 },
  { file: 'yamal.jpg', x: 1390, y: 70, w: 340, h: 720, zoom: 1.75 },
  { file: 'bellingham.jpg', x: 1660, y: 130, w: 350, h: 750, zoom: 1.28 },
  { file: 'vinicius.jpg', x: 1940, y: 180, w: 390, h: 790, zoom: 1.32 },
  { file: 'messi.jpg', x: 980, y: 730, w: 450, h: 930, zoom: 1.25 },
  { file: 'ronaldo.jpg', x: 1900, y: 720, w: 450, h: 930, zoom: 1.28 },
  { file: 'mbappe.jpg', x: 1370, y: 600, w: 620, h: 1120, zoom: 1.42 },
];

const themes = [
  { name: 'a', blue: '#102b59', green: '#1b6f50', shift: -24 },
  { name: 'b', blue: '#17203d', green: '#7a5d22', shift: 18 },
  { name: 'c', blue: '#102647', green: '#176044', shift: 0 },
];

function backgroundSvg(theme) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="blue" cx="78%" cy="30%" r="60%">
          <stop offset="0" stop-color="${theme.blue}" stop-opacity=".9"/>
          <stop offset="1" stop-color="#05080f" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="green" cx="70%" cy="85%" r="48%">
          <stop offset="0" stop-color="${theme.green}" stop-opacity=".64"/>
          <stop offset="1" stop-color="#05080f" stop-opacity="0"/>
        </radialGradient>
        <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
          <path d="M72 0H0V72" fill="none" stroke="#75f0ad" stroke-opacity=".07"/>
        </pattern>
        <linearGradient id="shade" x1="0" x2="1">
          <stop offset="0" stop-color="#05080f"/>
          <stop offset=".44" stop-color="#05080f" stop-opacity=".98"/>
          <stop offset=".72" stop-color="#05080f" stop-opacity=".08"/>
          <stop offset="1" stop-color="#05080f" stop-opacity=".4"/>
        </linearGradient>
      </defs>
      <rect width="2400" height="1800" fill="#05080f"/>
      <rect width="2400" height="1800" fill="url(#blue)"/>
      <rect width="2400" height="1800" fill="url(#green)"/>
      <rect width="2400" height="1800" fill="url(#grid)"/>
      <rect width="2400" height="1800" fill="url(#shade)"/>
      <path d="M1210 0L1560 1800M1620 0L1970 1800" stroke="#75f0ad" stroke-opacity=".09" stroke-width="5"/>
    </svg>
  `);
}

function fadeMask(w, h) {
  return Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="white"/>
          <stop offset=".32" stop-color="white"/>
          <stop offset=".62" stop-color="black"/>
          <stop offset="1" stop-color="black"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#fade)"/>
    </svg>
  `);
}

async function playerLayer(player, index) {
  const input = path.join(sourceDir, player.file);
  const saturation = index === 6 ? 0.9 : 0.58;
  const scaledWidth = Math.round(player.w * player.zoom);
  const scaledHeight = Math.round(player.h * player.zoom);
  return sharp(input)
    .resize(scaledWidth, scaledHeight, { fit: 'cover', position: 'north' })
    .extract({
      left: Math.round((scaledWidth - player.w) / 2),
      top: 0,
      width: player.w,
      height: player.h,
    })
    .modulate({ saturation, brightness: 0.82 })
    .linear(1.12, -8)
    .composite([{ input: fadeMask(player.w, player.h), blend: 'dest-in' }])
    .webp({ quality: 90 })
    .toBuffer();
}

await fs.mkdir(outputDir, { recursive: true });

for (const theme of themes) {
  const layers = await Promise.all(players.map((player, index) => playerLayer(player, index)));
  const composites = layers.map((input, index) => ({
    input,
    left: players[index].x + theme.shift * (index % 2 === 0 ? 1 : -1),
    top: players[index].y,
  }));

  const smoke = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".45" stop-color="#05080f" stop-opacity="0"/>
          <stop offset="1" stop-color="#05080f"/>
        </linearGradient>
      </defs>
      <rect width="2400" height="1800" fill="url(#bottom)"/>
      <text x="1220" y="1660" fill="#75f0ad" fill-opacity=".35" font-size="24" font-family="monospace" letter-spacing="6">
        07 GLOBAL ICONS / 48 TEAMS / DATA EDITION
      </text>
    </svg>
  `);

  await sharp(backgroundSvg(theme))
    .composite([...composites, { input: smoke, left: 0, top: 0 }])
    .webp({ quality: 90 })
    .toFile(path.join(outputDir, `hero-poster-${theme.name}.webp`));
}

await fs.copyFile(
  path.join(outputDir, 'hero-poster-c.webp'),
  path.join(outputDir, 'hero-poster.webp')
);

console.log('Generated hero-poster-a.webp, hero-poster-b.webp, hero-poster-c.webp, and hero-poster.webp');
