// Front Desk re-theme helper. Prints contrast-safe brand tokens from a logo colour.
// Usage: node retheme.mjs "#13ABC3" "#B8902F"   (logo colour, optional second logo colour)
// Paste the output over the Brand block at the top of styles.css. See BRIEF.md section 7.
const [brand, second = '#B8902F'] = process.argv.slice(2);
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const lum = h => hex2rgb(h).map(c => c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((a, c, i) => a + c * [.2126, .7152, .0722][i], 0);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
const toHsl = h => { const [r, g, b] = hex2rgb(h), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l]; const s = d / (1 - Math.abs(2 * l - 1));
  const hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [(hh * 60 + 360) % 360, s, l]; };
const hsl = (h, s, l) => { const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return '#' + [0, 8, 4].map(n => Math.round(f(n) * 255).toString(16).padStart(2, '0')).join('').toUpperCase(); };
const [H, S] = toHsl(brand), [H2, S2] = toHsl(second);
const tint = hsl(H, Math.min(S, .5), .95);
const deep = hsl(H, Math.min(S, .72), .15);
let L = toHsl(brand)[2], text; do { text = hsl(H, S, L); L -= .005; } while (Math.min(ratio(text, '#FFFFFF'), ratio(text, '#F5F8F8'), ratio(text, tint)) < 5.2 && L > 0);
const hover = hsl(H, S, Math.max(0, L - .06));
let L2 = .6, onDeep; do { onDeep = hsl(H, Math.min(S, .7), L2); L2 += .01; } while (ratio(onDeep, deep) < 7 && L2 < 1);
let L3 = .55, acc; do { acc = hsl(H2, Math.min(S2, .7), L3); L3 += .01; } while (ratio(acc, deep) < 4.5 && L3 < 1);
const out = { '--brand': brand.toUpperCase(), '--brand-text': text, '--brand-text-hover': hover, '--brand-deep': deep, '--brand-on-deep': onDeep, '--brand-tint': tint, '--accent': second.toUpperCase(), '--accent-on-deep': acc };
for (const [k, v] of Object.entries(out)) console.log(`  ${k}: ${v};`);
console.log(`  /* checks: brand-text on white ${ratio(text,'#FFFFFF').toFixed(2)}, on tint ${ratio(text,tint).toFixed(2)}, white on deep ${ratio('#FFFFFF',deep).toFixed(2)}, on-deep ${ratio(onDeep,deep).toFixed(2)}, accent-on-deep ${ratio(acc,deep).toFixed(2)} */`);
