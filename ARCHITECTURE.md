# DSA In Depth — Architecture

DSA In Depth is a static-first, progressive-enhancement web application that delivers 180 pre-rendered algorithmic lessons, 69 interactive visual simulators, and a client-side WebAssembly coding workbench with zero backend servers.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     Pre-Rendered Static HTML Pages                         │
│   /  ·  /topic/<slug>/  ·  /build/<id>/  ·  /roadmap/  ·  /challenges/     │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
┌─────────────────────────────────────▼──────────────────────────────────────┐
│                   Progressive Client Shell (js/bootstrap.js)               │
│  ┌─────────────────────┐  ┌───────────────────────┐  ┌──────────────────┐  │
│  │ Curriculum Router   │  │ 69 Lifecycle-Managed  │  │ KaTeX Math &     │  │
│  │ & Search (js/app.js)│  │ Step Simulators       │  │ Mermaid Diagrams │  │
│  └─────────────────────┘  └───────────┬───────────┘  └──────────────────┘  │
└───────────────────────────────────────┼────────────────────────────────────┘
                                        │
┌───────────────────────────────────────▼────────────────────────────────────┐
│            Vendored @innovatorved/code-lab v0.7.0 Workbench                │
│  • Isolated Web Worker C++20 / TypeScript / JavaScript / Python Runtime    │
│  • 180 Topic Guided Labs + 22 Multi-File From-Scratch Algorithm Builds     │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Directory Structure

| Path | Responsibility |
| :--- | :--- |
| `design-system/` | Shared CSS design tokens (`tokens.css`) and semantic components (`components.css`) used across the In-Depth series |
| `css/` | Product layout, responsive shell, typography, landing page, and simulator stylesheets |
| `data/curriculum.js` | 6-track, 18-module, 180-unit curriculum DAG and unit metadata |
| `data/content/` | Per-module (`m01`–`m18`) intuition primers, complexity scorecards, invariants, diagrams, and primary-source citations |
| `data/questions/` | Per-module concept checks, trace predictors, and staff-level trade-off questions |
| `data/topic_guided_labs.js` | 180 progressive 3-step C++20 Guided Algorithm Labs with coaching hints and verification |
| `data/implementations_code.js` & `data/guided_labs.js` | 22 multi-file capstone algorithm implementations and step-by-step guided specs |
| `data/challenges.js` & `data/whiteboard-blueprints.js` | Production incident debugging challenges and capacity/topology blueprints |
| `js/simulators*.js` | 69 lifecycle-managed (`render`, `mount`, `unmount`) visual step simulators |
| `js/vendor/` | Self-hosted KaTeX (`js/vendor/katex/`) and `@innovatorved/code-lab` `v0.7.0` bundles |
| `tools/` | Static site generator (`generate-static.js`), OG card renderer (`generate-og.js`), asset stamper (`stamp-assets.js`), bundler (`build.js`), and validators (`validate.js`, `check-rendered.js`) |

---

## 2. Static Pre-Rendering & Progressive Hydration

1. **Build-Time Pre-Rendering (`tools/generate-static.js`)**:
   - Evaluates `Renderer.renderLesson(slug)` and `Renderer.renderBuild(buildId)` inside a deterministic Node VM with build-time KaTeX math rendering.
   - Emits standalone `index.html` directories for all 180 `/topic/<slug>/` units, 22 `/build/<id>/` capstones, challenge entry routes, and hub routes (`/roadmap/`, `/challenges/`, `/sandbox/`, `/dashboard/`, `/glossary/`, `/projects/`).
2. **Self-Hosted Zero-Blocking Assets (`js/bootstrap.js`, `tools/stamp-assets.js`)**:
   - Fonts (`fonts/geist-latin.woff2`, `fonts/geist-mono-latin.woff2`), KaTeX (`css/vendor/katex/katex.min.css`), and `@innovatorved/code-lab` (`v0.7.0`) are served locally with content-addressed `?v=<sha1>` cache keys.
