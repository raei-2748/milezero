#!/usr/bin/env node
// Generates assets/img/contours.svg: topographic contour rings around a datum point.
// Deterministic (seeded), so re-running produces the same file.
//   node scripts/contours.mjs

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = 1600, H = 1000;
const datum = { x: 1120, y: 470 };

let seed = 20270204;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);

// A few low-frequency harmonics give each ring a natural, terrain-like wobble.
const harmonics = Array.from({ length: 5 }, (_, i) => ({
  k: i + 2,
  amp: 0.06 / (i + 1) + rand() * 0.03,
  phase: rand() * Math.PI * 2,
  drift: (rand() - 0.5) * 0.9,
}));

function ring(r, n = 64) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    let m = 1;
    for (const h of harmonics) m += h.amp * Math.sin(h.k * t + h.phase + h.drift * Math.log(r / 40));
    // Rings stretch away from the datum to the left, like a ridge running downhill.
    const sx = 1 + 0.55 * Math.max(0, -Math.cos(t)) * Math.min(1, r / 500);
    pts.push([datum.x + Math.cos(t) * r * m * sx * 1.25, datum.y + Math.sin(t) * r * m * 0.82]);
  }
  // Smooth closed path through the points (Catmull-Rom to cubic Bézier).
  let d = `M${pts[0][0].toFixed(0)},${pts[0][1].toFixed(0)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(0)},${c1[1].toFixed(0)} ${c2[0].toFixed(0)},${c2[1].toFixed(0)} ${p2[0].toFixed(0)},${p2[1].toFixed(0)}`;
  }
  return d + "Z";
}

const rings = [];
for (let i = 1; i <= 26; i++) {
  const r = 34 * i ** 1.08;
  const index = i % 5 === 0; // every fifth line is an "index contour", drawn heavier
  rings.push(`<path d="${ring(r)}" stroke-width="${index ? 1.6 : 0.8}"${index ? "" : ' opacity=".7"'}/>`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#C98F4E" stroke-linejoin="round">
${rings.join("\n")}
</svg>
`;
writeFileSync(join(root, "assets/img/contours.svg"), svg);
console.log(`wrote assets/img/contours.svg (${(svg.length / 1024).toFixed(0)} KiB)`);
