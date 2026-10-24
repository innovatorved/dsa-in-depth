# Editorial Policy & Content Quality Standards

Every unit in `data/content/m01-*.js` through `m18-*.js` and question bank in `data/questions/q01-*.js` through `q18-*.js` must adhere to these mandatory engineering and editorial standards. All rules are enforced programmatically by `node tools/validate.js`.

---

## 1. Strict Primary-Source Citation Policy
- **Approved Registry Only**: All `furtherReading` URLs (2–4 per unit) and `archive.sources` must reference items from [`SOURCES.md`](../SOURCES.md) — canonical textbooks (CLRS, Sedgewick & Wayne, Knuth TAOCP, Skiena, DPV, Kleinberg & Tardos, CP-Algorithms, Open Data Structures, Okasaki, Erickson), peer-reviewed papers (ACM, IEEE, SIAM, USENIX, arXiv), or official system documentation (V8, Rust `hashbrown`, Linux Kernel, Redis, Git, AtCoder Library).
- **Zero SEO Content Farms**: Links to GeeksforGeeks, Medium, W3Schools, Tutorialspoint, Baeldung, Programiz, or Javatpoint are strictly banned and will fail `tools/validate.js`.

## 2. Mandatory Unit Structure (`window.MODULE_CONTENT[modId][slug]`)
Each unit object must contain:
1. **`title`**: Exact title matching `data/curriculum.js`.
2. **`video`**: Curated lecture object (`{ youtubeId, title, channel, why, length }`) from the allowlisted channels in `SOURCES.md`.
3. **`intuition`**: 1–2 crisp HTML paragraphs (`<p>...</p>`) establishing the core mental model and physical bottleneck.
4. **`content`**: Semantic HTML wrapped in `<div class="lesson-content">...</div>` containing:
   - **Complexity & Hardware Scorecard (`<table class="complexity-matrix">`)**: Time (Worst, Average, Amortized), Auxiliary Space, Cache Locality Rating, and Stability/In-Place properties using semantic badges (`.badge-o1`, `.badge-ologn`, `.badge-on`, `.badge-onlogn`, `.badge-on2`, `.badge-o2n`).
   - **Formal Invariant & Proof Sketch (`<div class="invariant-box">` / `<div class="callout callout-note">`)**: Explicit statement of the structural or loop invariant and why it guarantees correctness/complexity.
   - **Hardware & Memory Layout Reality (`<div class="hardware-box">`)**: Cache line behavior, memory overhead per element, and branch prediction characteristics.
   - **Mermaid Architecture / State Diagram (`<div class="mermaid">`)**: Valid `flowchart TD`, `flowchart LR`, or `sequenceDiagram` with quoted node labels when special characters appear.
   - **Interactive Simulator Mount (`<div class="simulator-mount" data-sim="sim-..."></div>`)**: Linked to a registered simulator in `js/simulators.js`.
   - **Production-Grade Implementation (`<pre><code>`)**: Clean, idiomatic, edge-case-hardened implementation code.
   - **Failure Modes & Adversarial Pitfalls (`<div class="callout callout-warning">`)**: Concrete breakdown of worst-case inputs, integer overflow traps, recursion stack limits, and when *not* to use the structure.
5. **`keyTakeaways`**: Array of **3 to 5** non-empty strings summarizing staff-level invariants.
6. **`furtherReading`**: Array of **2 to 4** `{ title, url }` objects.

## 3. Question Bank Standards (`window.QUESTION_BANK[slug]`)
- Every unit must have **3 to 5** questions in its corresponding `data/questions/qXX-*.js` file.
- Questions must span three difficulty tiers:
  - `recall`: Core asymptotic bounds, structural definitions, and hardware layout facts.
  - `apply`: Step-by-step trace execution, recurrence solving, or choosing the right algorithm under concrete $N$ constraints.
  - `staff`: Adversarial input analysis, amortized potential proofs, cache-line optimization, or subtle bug diagnosis.
