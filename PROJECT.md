# Project Architecture & Contributor Guide (`PROJECT.md`)

**DSA In Depth** is a zero-framework, static-first interactive textbook, visual simulator suite, and browser coding lab platform for mastering Data Structures & Algorithms from first principles and hardware reality.

## Architectural Invariants

1. **Zero Runtime Framework**: Pure semantic HTML5, CSS custom properties, and vanilla ES2022 JavaScript. No React/Vue/Next build step required to run locally — `python3 -m http.server 8000` or `npx serve .` works out of the box.
2. **Deferred Hydration & Lazy Module Loading**:
   - `index.html` loads `js/init.js` and `js/manifest.js` immediately, then hydrates deferred app scripts via `js/bootstrap.js`.
   - Per-module lesson content (`data/content/m01-*.js` .. `m18-*.js`) and question banks (`data/questions/q01-*.js` .. `q18-*.js`) are loaded on demand by `js/lazy.js` using cache-busted hashes in `window.LAZY_MANIFEST`.
3. **Static Pre-Rendering for SEO & Instant First Paint**:
   - `node tools/generate-static.js` pre-renders all 180 unit pages (`/topic/<slug>/index.html`), all 20+ coding lab pages (`/build/<id>/index.html`), and `sitemap.xml`.
4. **Deterministic Asset Stamping**:
   - `node tools/stamp-assets.js` computes 10-character SHA-1 hashes for every CSS/JS/data file and updates query strings (`?v=xxxxxxxxxx`) across `index.html`, `404.html`, and `js/manifest.js`, while syncing quantitative curriculum counts across `README.md`, `index.html`, and `js/landing.js`.
5. **Strict Validation Gate (`node tools/validate.js`)**:
   - Verifies curriculum schema, 180 unit slugs, 32 interactive simulators, 20+ build labs (and executes their test suites), primary-source URL compliance against `SOURCES.md`, Mermaid diagram syntax, and pre-rendered HTML word counts (`>= 300` words per page).

## Directory Structure

```text
dsa-in-depth/
├── index.html                     # Main SPA shell & landing view
├── 404.html                       # Client-side fallback router
├── package.json                   # Build, stamp, and validation scripts
├── README.md                      # Overview, track matrix, and quickstart
├── PROJECT.md                     # Architectural overview & invariants
├── SOURCES.md                     # Canonical bibliography & primary-source allowlist
├── docs/
│   ├── learning-philosophy.md     # 4-stage mastery loop
│   └── editorial-policy.md        # Citation, complexity badge & schema rules
├── css/
│   ├── variables.css              # Design tokens, dark/light palettes, complexity badge tokens
│   ├── layout.css                 # Sidebar, reader column, drawers, responsive layout
│   ├── components.css             # Callouts, complexity tables, simulators, quizzes, IDE embeds
│   ├── content.css                # Lesson typography, code blocks, hardware & invariant boxes
│   └── landing.css                # Hero, track cards, interactive showcase
├── js/
│   ├── init.js                    # Theme & font initialization
│   ├── manifest.js                # Auto-generated SHA-1 asset manifest (window.LAZY_MANIFEST)
│   ├── bootstrap.js               # Deferred script loader & service worker registration
│   ├── lazy.js                    # On-demand module content, question, and simulator loader
│   ├── app.js                     # History API router & view controller
│   ├── renderer.js                # Unit & build lab HTML renderer, Mermaid & simulator mounting
│   ├── landing.js                 # Landing page hero & curriculum explorer
│   ├── search.js                  # Cmd+K instant fuzzy search across units, labs, and glossary
│   ├── quiz.js                    # Multi-tier (recall/apply/staff) quiz engine
│   ├── exercises.js               # In-unit interactive micro-exercises
│   ├── progress.js                # LocalStorage XP, streak, completion & backup manager
│   ├── dashboard.js               # Progress analytics & SM-2 Spaced Repetition flashcard engine
│   ├── challenges.js              # 12 Algorithmic Performance & TLE Incident Simulator engine
│   ├── sandbox.js                 # Interactive Algorithm Selection Decision Tree & Complexity Analyzer
│   ├── roadmap.js                 # Prerequisite DAG & 4 curated study tracks
│   ├── simulators.js              # Simulator registry & common step-control dispatcher
│   ├── simulators-linear.js       # Simulators 1–6 (Cache lines, Dynamic Array, Pointers, Deque, Stack, SkipList)
│   ├── simulators-hashing.js      # Simulators 7–10 (Robin Hood, SwissTable SIMD, Bloom/Cuckoo, Consistent Ring)
│   ├── simulators-trees.js        # Simulators 11–17 (Heap Floyd, AVL/LLRB, Treap, Splay, B+ Tree, Fenwick, SegTree)
│   ├── simulators-strings.js      # Simulators 18–21 (KMP/Z, Aho-Corasick, Suffix Array/LCP, Thompson NFA)
│   ├── simulators-graphs.js       # Simulators 22–27 (Tarjan SCC, DSU, Dijkstra/A*, Bellman-Ford, MST, Dinic)
│   └── simulators-dp-adv.js       # Simulators 28–32 (Knapsack, Myers Diff, Bitmask TSP, Li Chao CHT, Convex Hull)
├── data/
│   ├── curriculum.js              # Master 6-Track, 18-Module, 180-Unit manifest
│   ├── projects.js                # Build labs metadata catalog
│   ├── implementations_code.js    # Complete zero-dependency JS reference implementations + unit tests
│   ├── guided_labs.js             # Step-by-step guided instructions, hints & starter code
│   ├── challenges.js              # 12 Algorithmic Incident & TLE Debugging Challenges
│   ├── srs-cards.js               # 500+ SM-2 Spaced Repetition flashcards
│   ├── glossary.js                # 250+ rigorous algorithmic & mathematical definitions
│   ├── roadmap.js                 # Prerequisite DAG & study tracks
│   ├── whiteboard-blueprints.js   # Interactive Problem → Constraint → Algorithm decision matrices
│   ├── content/                   # m01-*.js through m18-*.js (180 units)
│   └── questions/                 # q01-*.js through q18-*.js (540–900 questions)
└── tools/
    ├── stamp-assets.js            # Computes SHA-1 cache-busting query params & syncs counts
    ├── generate-static.js         # Pre-renders /topic/<slug>/ and /build/<id>/ static HTML + sitemap.xml
    ├── validate.js                # Comprehensive schema, link, source, simulator, and test validator
    └── build.js                   # Full pipeline orchestrator (stamp → generate-static → stamp → validate)
```

## Common Commands

```bash
# Run the full build & verification pipeline
node tools/build.js

# Run validation checks only
node tools/validate.js

# Check asset hash stamps
node tools/stamp-assets.js --check
```
