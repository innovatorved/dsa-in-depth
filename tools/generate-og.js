#!/usr/bin/env node
/**
 * Per-Page Open Graph & Twitter Card Generator — DSA In Depth
 * Generates 1200×630 PNG social cards in assets/og/*.png (plus assets/og-image.png)
 * for the landing page, hubs, 404, 12 challenges, 180 topic lessons, and 22 build labs
 * using the Neutral Charcoal (#0F0F10 / #18181A) + VedGupta Dark Blue (#1E40AF / #60A5FA) palette.
 *
 * Usage: node tools/generate-og.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets', 'og');
fs.mkdirSync(OUT_DIR, { recursive: true });

const RSVG_CANDIDATES = [
  process.env.RSVG_CONVERT,
  '/opt/homebrew/bin/rsvg-convert',
  '/opt/homebrew/Caskroom/miniconda/base/bin/rsvg-convert',
  '/usr/local/bin/rsvg-convert',
  'rsvg-convert'
].filter(Boolean);

let rsvgBin = null;
for (const bin of RSVG_CANDIDATES) {
  const res = spawnSync(bin, ['--version'], { encoding: 'utf8' });
  if (res.status === 0) {
    rsvgBin = bin;
    break;
  }
}
if (!rsvgBin) {
  console.error('rsvg-convert not found. Install librsvg to rasterize 1200x630 OG PNGs.');
  process.exit(1);
}

function escXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapLines(text, maxChars, maxLines) {
  const words = String(text || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxChars || !cur) {
      cur = next;
    } else {
      lines.push(cur);
      cur = w;
      if (lines.length === maxLines - 1) break;
    }
  }
  const usedWords = lines.join(' ').split(' ').filter(Boolean).length;
  const remaining = words.slice(usedWords).join(' ');
  if (remaining) {
    if (remaining.length <= maxChars + 3) {
      lines.push(remaining);
    } else {
      lines.push(remaining.slice(0, maxChars - 1).replace(/[,;:\-\s]+$/, '') + '…');
    }
  }
  return lines.slice(0, maxLines);
}

function schematicSvg(variant) {
  if (variant === 'rbtree') {
    return `
      <g transform="translate(855, 165)">
        <rect x="0" y="0" width="275" height="300" rx="12" fill="#18181A" stroke="#2D2D31" stroke-width="1.5"/>
        <text x="20" y="30" fill="#A1A1AA" font-family="Menlo, Monaco, monospace" font-size="12" font-weight="700">LLRB / SEGMENT HIERARCHY</text>
        <line x1="138" y1="88" x2="72" y2="148" stroke="#60A5FA" stroke-width="1.8"/>
        <line x1="138" y1="88" x2="204" y2="148" stroke="#52525B" stroke-width="1.8"/>
        <circle cx="138" cy="72" r="22" fill="#1E40AF" fill-opacity="0.28" stroke="#60A5FA" stroke-width="1.6"/>
        <text x="138" y="77" text-anchor="middle" fill="#FAFAFA" font-family="Menlo, Monaco, monospace" font-size="13" font-weight="700">42</text>
        <circle cx="72" cy="160" r="20" fill="#1E40AF" fill-opacity="0.32" stroke="#93C5FD" stroke-width="1.6"/>
        <text x="72" y="165" text-anchor="middle" fill="#FFFFFF" font-family="Menlo, Monaco, monospace" font-size="12" font-weight="700">19</text>
        <circle cx="204" cy="160" r="20" fill="#1F1F23" stroke="#3F3F46" stroke-width="1.5"/>
        <text x="204" y="165" text-anchor="middle" fill="#D4D4D8" font-family="Menlo, Monaco, monospace" font-size="12">73</text>
        <rect x="18" y="212" width="240" height="64" rx="6" fill="#121213" stroke="#27272A" stroke-width="1.5"/>
        <text x="32" y="236" fill="#60A5FA" font-family="Menlo, Monaco, monospace" font-size="11" font-weight="700">BLACK-HEIGHT INVARIANT</text>
        <text x="32" y="258" fill="#A1A1AA" font-family="Menlo, Monaco, monospace" font-size="11">h &lt;= 2 log2(N+1) · O(log N)</text>
      </g>`;
  }
  if (variant === 'swisstable') {
    return `
      <g transform="translate(855, 165)">
        <rect x="0" y="0" width="275" height="300" rx="12" fill="#18181A" stroke="#2D2D31" stroke-width="1.5"/>
        <text x="20" y="30" fill="#A1A1AA" font-family="Menlo, Monaco, monospace" font-size="12" font-weight="700">SIMD SWISSTABLE + PSL</text>
        <rect x="20" y="52" width="235" height="54" rx="6" fill="#1F1F23" stroke="#3F3F46" stroke-width="1.5"/>
        <text x="34" y="74" fill="#A1A1AA" font-family="Menlo, Monaco, monospace" font-size="11">H2 CTRL [16B SSE2 / NEON]</text>
        <text x="34" y="94" fill="#D4D4D8" font-family="Menlo, Monaco, monospace" font-size="12">0x5A 0x1F 0x80 0x3C ...</text>
        <line x1="138" y1="106" x2="138" y2="134" stroke="#60A5FA" stroke-width="1.5"/>
        <rect x="20" y="134" width="235" height="54" rx="6" fill="#1E40AF" fill-opacity="0.26" stroke="#60A5FA" stroke-width="1.5"/>
        <text x="34" y="156" fill="#93C5FD" font-family="Menlo, Monaco, monospace" font-size="11" font-weight="700">ROBIN HOOD SWAP · PSL=2</text>
        <text x="34" y="176" fill="#FFFFFF" font-family="Menlo, Monaco, monospace" font-size="12" font-weight="700">1 L1 cache line · O(1)</text>
        <rect x="20" y="214" width="235" height="62" rx="6" fill="#121213" stroke="#27272A" stroke-width="1.5"/>
        <text x="34" y="238" fill="#4ADE80" font-family="Menlo, Monaco, monospace" font-size="11" font-weight="700">64-BYTE CACHE LOCALITY</text>
        <text x="34" y="258" fill="#A1A1AA" font-family="Menlo, Monaco, monospace" font-size="11">Zero pointer-chasing stalls</text>
      </g>`;
  }
  return `
    <g transform="translate(855, 165)">
      <rect x="0" y="0" width="275" height="300" rx="12" fill="#18181A" stroke="#2D2D31" stroke-width="1.5"/>
      <text x="20" y="30" fill="#A1A1AA" font-family="Menlo, Monaco, monospace" font-size="12" font-weight="700">INVARIANT &amp; FRONTIER TRACE</text>
      <rect x="20" y="50" width="235" height="44" rx="6" fill="#1F1F23" stroke="#3F3F46" stroke-width="1.5"/>
      <text x="34" y="77" fill="#D4D4D8" font-family="Menlo, Monaco, monospace" font-size="12">1.HALF-OPEN [lo, hi) BOUND</text>
      <line x1="138" y1="94" x2="138" y2="116" stroke="#60A5FA" stroke-width="1.5"/>
      <rect x="20" y="116" width="235" height="44" rx="6" fill="#1E40AF" fill-opacity="0.26" stroke="#60A5FA" stroke-width="1.5"/>
      <text x="34" y="143" fill="#FFFFFF" font-family="Menlo, Monaco, monospace" font-size="12" font-weight="700">2.RELAXATION &amp; DP STATE</text>
      <line x1="138" y1="160" x2="138" y2="182" stroke="#60A5FA" stroke-width="1.5"/>
      <rect x="20" y="182" width="235" height="44" rx="6" fill="#1F1F23" stroke="#3F3F46" stroke-width="1.5"/>
      <text x="34" y="209" fill="#D4D4D8" font-family="Menlo, Monaco, monospace" font-size="12">3.AMORTIZED Φ PROOF</text>
      <rect x="20" y="242" width="235" height="40" rx="6" fill="#121213" stroke="#27272A" stroke-width="1.5"/>
      <text x="34" y="267" fill="#60A5FA" font-family="Menlo, Monaco, monospace" font-size="11" font-weight="700">69 Simulators · C++20 Labs</text>
    </g>`;
}

function buildCardSvg({ badge, title, subtitle, variant }) {
  const titleLines = wrapLines(title, 26, 3);
  const subLines = wrapLines(subtitle, 48, 2);

  const titleFontSize = titleLines.length >= 3 ? 44 : 50;
  const titleLineHeight = titleLines.length >= 3 ? 54 : 60;
  const titleStartY = 225;

  const titleTspans = titleLines.map((line, i) => (
    `<text x="68" y="${titleStartY + i * titleLineHeight}" fill="#F4F4F5" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="${titleFontSize}" font-weight="700">${escXml(line)}</text>`
  )).join('\n  ');

  const subStartY = titleStartY + titleLines.length * titleLineHeight + 18;
  const subTspans = subLines.map((line, i) => (
    `<text x="68" y="${subStartY + i * 32}" fill="#A1A1AA" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="22" font-weight="400">${escXml(line)}</text>`
  )).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0F0F10"/>
  <rect x="24" y="24" width="1152" height="582" rx="16" fill="#141416" stroke="#27272A" stroke-width="1.5"/>
  <rect x="24" y="24" width="1152" height="6" fill="#1E40AF"/>

  <!-- Brand & Module Header -->
  <rect x="68" y="72" width="54" height="34" rx="6" fill="#1E40AF"/>
  <text x="95" y="95" text-anchor="middle" fill="#FFFFFF" font-family="Menlo, Monaco, monospace" font-size="16" font-weight="700">DSA</text>
  <text x="136" y="95" fill="#F4F4F5" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="19" font-weight="700">DSA IN DEPTH</text>

  <rect x="68" y="128" width="${Math.min(720, Math.max(210, badge.length * 10 + 28))}" height="30" rx="6" fill="#111C33" stroke="#1E3A8A" stroke-width="1"/>
  <text x="82" y="148" fill="#93C5FD" font-family="Menlo, Monaco, monospace" font-size="13" font-weight="700">${escXml(badge.toUpperCase())}</text>

  <!-- Title & Promise -->
  ${titleTspans}
  ${subTspans}

  <!-- Right-side Architectural Schematic -->
  ${schematicSvg(variant)}

  <!-- Footer -->
  <line x1="68" y1="530" x2="1132" y2="530" stroke="#27272A" stroke-width="1"/>
  <text x="68" y="566" fill="#60A5FA" font-family="Menlo, Monaco, monospace" font-size="16" font-weight="700">dsa-in-depth.vedgupta.in</text>
  <text x="1132" y="566" text-anchor="end" fill="#A1A1AA" font-family="Menlo, Monaco, monospace" font-size="14">6 Tracks · 180 Topics · 69 Simulators &amp; C++20 Labs</text>
</svg>`;
}

function renderPng(svgStr, outPath) {
  const res = spawnSync(rsvgBin, ['-w', '1200', '-h', '630', '-f', 'png', '-o', outPath], {
    input: Buffer.from(svgStr, 'utf8')
  });
  if (res.status !== 0) {
    throw new Error(`rsvg-convert failed for ${outPath}: ${res.stderr?.toString()}`);
  }
}

const ctx = { window: { MODULE_CONTENT: {}, IMPLEMENTATIONS_DATA: {}, CURRICULUM_DATA: null, CHALLENGES_DATA: [] } };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'data/curriculum.js'), 'utf8'), ctx);
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'data/implementations_code.js'), 'utf8'), ctx);
if (fs.existsSync(path.join(ROOT, 'data/challenges.js'))) {
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'data/challenges.js'), 'utf8'), ctx);
}
const contentDir = path.join(ROOT, 'data/content');
for (const f of fs.readdirSync(contentDir).filter(f => f.endsWith('.js')).sort()) {
  vm.runInNewContext(fs.readFileSync(path.join(contentDir, f), 'utf8'), ctx);
}

const cards = [
  {
    name: 'home',
    badge: 'Interactive Textbook · Simulators & C++20 Labs',
    title: 'Data Structures & Algorithms, In Depth',
    subtitle: 'From 64-byte CPU cache lines and SIMD SwissTables to Red-Black trees, graphs, and DP invariants.',
    variant: 'swisstable'
  },
  {
    name: 'roadmap',
    badge: '6 Tracks · 18 Modules · 180 Lessons',
    title: 'Algorithms & Data Structures Roadmap',
    subtitle: 'Interactive prerequisite DAG, interview & systems study tracks, and weekly planner.',
    variant: 'graph'
  },
  {
    name: 'challenges',
    badge: '12 Production Incident & TLE Labs',
    title: 'Algorithmic Performance & TLE Challenges',
    subtitle: 'Diagnose O(N²) latency spikes, HashDoS collisions, memory blowups, and ship verified fixes.',
    variant: 'swisstable'
  },
  {
    name: 'sandbox',
    badge: 'Interactive Complexity & Blueprint Workbench',
    title: 'Algorithmic Blueprint & Capacity Sandbox',
    subtitle: 'Model N-scaling, L1/L2/DRAM cache-line budgets, and asymptotic trade-offs interactively.',
    variant: 'graph'
  },
  {
    name: 'dashboard',
    badge: 'Local-First Study Workspace',
    title: 'Learning Progress, SRS Cards & Notes',
    subtitle: 'Track completed modules, spaced-repetition invariant flashcards, and portable JSON backups.',
    variant: 'rbtree'
  },
  {
    name: 'glossary',
    badge: 'First-Principles Definitions',
    title: 'Algorithms & Data Structures Glossary',
    subtitle: 'Searchable reference for amortized potential, tree rotations, graph cuts, and cache layouts.',
    variant: 'rbtree'
  },
  {
    name: 'projects',
    badge: 'Systems Engineering Case Studies',
    title: 'Algorithmic Engines & Systems Projects',
    subtitle: 'Open-source storage structures, high-throughput indexes, and real-world systems benchmarks.',
    variant: 'swisstable'
  },
  {
    name: '404',
    badge: 'DSA In Depth · Navigation',
    title: 'Explore 180 Algorithms & Data Structures Lessons',
    subtitle: '69 step-through visual simulators, primary-source proofs, and 22 C++20 / TS build labs.',
    variant: 'graph'
  }
];

const rawChallenges = Array.isArray(ctx.window.CHALLENGES_DATA)
  ? ctx.window.CHALLENGES_DATA
  : (ctx.window.CHALLENGES_DATA?.challenges || []);

for (const ch of rawChallenges) {
  if (!ch || !ch.id) continue;
  cards.push({
    name: ch.id,
    badge: `Incident Challenge · ${String(ch.category || 'Asymptotic Debugging')}`,
    title: ch.title,
    subtitle: String(ch.summary || ch.subtitle || 'Diagnose the root-cause bottleneck and verify the O(1)/O(log N) fix.').slice(0, 140),
    variant: /hash|cache|array|lru/i.test(ch.id) ? 'swisstable' : /tree|seg|trie/i.test(ch.id) ? 'rbtree' : 'graph'
  });
}

for (const part of ctx.window.CURRICULUM_DATA.parts) {
  for (const mod of part.modules) {
    const modNum = parseInt(String(mod.id || '').replace(/\D/g, ''), 10) || 1;
    const variant = (modNum >= 7 && modNum <= 10) ? 'rbtree' : (modNum >= 1 && modNum <= 5) ? 'swisstable' : 'graph';
    for (const unit of mod.units) {
      const mc = ctx.window.MODULE_CONTENT[mod.id]?.[unit.slug] || {};
      const promise = mc.intuition || mc.promise || unit.archive?.excerpt || `${mod.title} — mathematical invariants, cache mechanics, and C++20 implementation.`;
      cards.push({
        name: unit.slug,
        badge: `Module ${mod.number} · ${mod.title}`,
        title: unit.title,
        subtitle: String(promise).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
        variant
      });
    }
  }
}

for (const [buildId, build] of Object.entries(ctx.window.IMPLEMENTATIONS_DATA || {})) {
  if (cards.some(c => c.name === buildId)) continue;
  cards.push({
    name: buildId,
    badge: 'From-Scratch Engine Build Lab',
    title: String(build.title || buildId).replace(/\s*\(.*\)\s*$/, ''),
    subtitle: String(build.summary || 'Step-by-step data structure & algorithm implementation with automated browser verification.'),
    variant: /tree|trie|seg|heap/i.test(buildId) ? 'rbtree' : /hash|cache|deque|bloom/i.test(buildId) ? 'swisstable' : 'graph'
  });
}

console.log(`Generating ${cards.length} Open Graph PNG cards (1200×630)...`);
let totalBytes = 0;
for (const card of cards) {
  const outPath = path.join(OUT_DIR, `${card.name}.png`);
  const svg = buildCardSvg(card);
  renderPng(svg, outPath);
  totalBytes += fs.statSync(outPath).size;
}

const pyCandidates = ['/opt/homebrew/Caskroom/miniconda/base/bin/python3', 'python3'];
for (const py of pyCandidates) {
  const qRes = spawnSync(py, ['-c', `
import glob
from PIL import Image
for p in glob.glob(${JSON.stringify(path.join(OUT_DIR, '*.png'))}):
    im = Image.open(p).convert('RGB').quantize(colors=96, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
    im.save(p, format='PNG', optimize=True)
`], { encoding: 'utf8' });
  if (qRes.status === 0) break;
}

totalBytes = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.png')).reduce((s, f) => s + fs.statSync(path.join(OUT_DIR, f)).size, 0);

fs.copyFileSync(path.join(OUT_DIR, 'home.png'), path.join(ROOT, 'assets', 'og-image.png'));

console.log(`✓ Generated ${cards.length} OG cards in assets/og/ (${(totalBytes / (1024 * 1024)).toFixed(2)} MB total)`);
