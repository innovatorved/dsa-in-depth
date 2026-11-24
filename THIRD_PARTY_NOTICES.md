# Third-Party Notices & Licensing Disclosures

This project incorporates, bundles, or interfaces with the following open-source libraries, fonts, and specifications:

---

## 1. Client-Side Libraries & Bundled Assets

### `@innovatorved/code-lab` (`v0.7.1`)
- **License:** MIT License
- **Copyright:** (c) 2026 Ved Gupta (`https://github.com/innovatorved/code-lab`)
- **Usage:** Browser-native IDE workbench, POSIX shell, guided lab stepper, and Web Worker C++20/TypeScript/JavaScript/Python WebAssembly runtime bundled under `js/vendor/code-lab.js`, `js/vendor/guided-lab.js`, `css/vendor/code-lab.css`, and `preview-sw.js` with CDN fallback (`@innovatorved/code-lab@0.7.1`).

### KaTeX
- **License:** MIT License
- **Copyright:** (c) 2013–2026 Khan Academy and contributors
- **Usage:** Build-time and client-side mathematical typesetting for asymptotic bounds, recurrences, and potential functions (`css/vendor/katex/`, `js/vendor/katex/`).

### Mermaid.js
- **License:** MIT License
- **Copyright:** (c) 2014–2026 Knut Sveidqvist and contributors
- **Usage:** Dynamic state-machine and graph diagram rendering loaded on demand when a lesson contains `.mermaid` blocks.

### Geist & Geist Mono Fonts
- **License:** SIL Open Font License 1.1
- **Copyright:** (c) 2023 Vercel, Inc.
- **Usage:** Self-hosted WOFF2 webfonts packaged locally under `fonts/geist-latin.woff2` and `fonts/geist-mono-latin.woff2`.

---

## 2. Primary Literature & Algorithmic Attribution

Algorithms and data structures covered across lessons (such as Tarjan SCC, Dinic blocking flow, Sleator-Tarjan splay trees, SwissTable SIMD probing, Myers diff, and Knuth Algorithm X) describe published computer science results cited in [`SOURCES.md`](./SOURCES.md). All prose explanations, simulators, and reference implementations in this repository are original works.
