// Renders the app icons (PNG) without any image libraries: node scripts/make-icons.mjs
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { join } from 'node:path';

const OUT = join(import.meta.dirname, '..', 'public', 'icons');

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, px, height = size) {
  const raw = Buffer.alloc(height * (size * 4 + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (size * 4 + 1)] = 0;
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const segDist = (px, py, ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};

// u,v in [0,1]. Returns [r,g,b] for the icon at that point.
function shade(u, v, scale) {
  const top = [247, 214, 208], bottom = [226, 150, 148];
  let c = mix(top, bottom, (u * 0.35 + v * 0.65));
  // heart, centred, scaled for maskable safe zone
  const x = (u - 0.5) / (0.30 * scale), y = -(v - 0.53) / (0.30 * scale);
  const h = Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y;
  if (h <= 0) {
    c = [255, 250, 245];
    // check mark inside the heart
    const s = 0.30 * scale;
    const p = [(u - 0.5) / s, (v - 0.5) / s];
    const d = Math.min(segDist(p[0], p[1], -0.42, 0.02, -0.12, 0.32), segDist(p[0], p[1], -0.12, 0.32, 0.45, -0.28));
    if (d < 0.11) c = [196, 104, 110];
  }
  return c;
}

// Wide images (link previews) keep the heart in a centred square of side `height`.
function render(size, scale, height = size) {
  const px = Buffer.alloc(size * height * 4);
  const ss = 4, off = (size - height) / 2;
  for (let y = 0; y < height; y++) for (let x = 0; x < size; x++) {
    let r = 0, g = 0, b = 0;
    for (let sy = 0; sy < ss; sy++) for (let sx = 0; sx < ss; sx++) {
      const c = shade((x - off + (sx + 0.5) / ss) / height, (y + (sy + 0.5) / ss) / height, scale);
      r += c[0]; g += c[1]; b += c[2];
    }
    const i = (y * size + x) * 4, n = ss * ss;
    px[i] = r / n; px[i + 1] = g / n; px[i + 2] = b / n; px[i + 3] = 255;
  }
  return png(size, px, height);
}

writeFileSync(join(OUT, 'icon-192.png'), render(192, 1));
writeFileSync(join(OUT, 'icon-512.png'), render(512, 1));
writeFileSync(join(OUT, 'maskable-512.png'), render(512, 0.8));
writeFileSync(join(OUT, 'apple-touch-icon.png'), render(180, 1));
writeFileSync(join(OUT, 'badge-96.png'), render(96, 1));
writeFileSync(join(OUT, 'share-1200x630.png'), render(1200, 0.75, 630));
console.log('icons written to', OUT);
