# Contributing to DSA In Depth

Thank you for contributing to DSA In Depth! Whether you are fixing an algorithmic edge case, clarifying a loop invariant or amortized proof, improving accessibility, or refining a visual simulator, contributions are welcome.

## Prerequisites

- **Node.js** `>= 20`
- **Python 3** (optional, used only by `npm run serve` for local static preview)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start a local static server at http://localhost:8000
npm run serve

# 3. After editing content, templates, CSS, or JS, regenerate static pages and asset hashes
npm run prerender
npm run stamp

# 4. Run validation and production build gates
npm test
npm run stamp:check
npm run build
```

## Contribution Guidelines

1. **Primary-Source Citations (`SOURCES.md`)**:
   - `furtherReading` links in `data/content/m*.js` must reference peer-reviewed literature, canonical textbooks, or official engineering repositories listed in [`SOURCES.md`](./SOURCES.md). `tools/validate.js` rejects SEO content farms.
2. **Invariants & Hardware Clarity**:
   - Pair asymptotic complexity claims with concrete structural invariants and memory/cache layout notes.
3. **Design System & Accessibility**:
   - Use semantic CSS custom properties from `design-system/tokens.css` and `css/variables.css` so every component adapts cleanly between Warm Neutral Paper (`[data-theme="light"]`) and Neutral Charcoal (`[data-theme="dark"]`) with WCAG AA contrast (`>= 4.5:1`).
   - Keep interactive controls keyboard accessible (`<button type="button">`, `:focus-visible`, valid ARIA roles) and respect `prefers-reduced-motion: reduce`.
4. **Static Pre-Render & Asset Stamps**:
   - Whenever you modify `index.html`, `js/renderer.js`, `js/landing.js`, `data/*`, or any CSS/JS asset, run `npm run prerender && npm run stamp` before committing.

## Pull Request Checklist

- [ ] `npm run prerender` and `npm run stamp` have been run if HTML, CSS, JS, or curriculum data changed.
- [ ] `npm test` (`tools/validate.js` and `tools/check-rendered.js`) passes with 0 errors.
- [ ] `npm run stamp:check` passes.
- [ ] `npm run build` succeeds cleanly.
