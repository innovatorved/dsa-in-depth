/* ═══════════════════════════════════════════════════════════════
   Renderer — Content rendering for lessons, builds, and overview
   ═══════════════════════════════════════════════════════════════ */

window.loadScript = window.loadScript || function loadScript(src) {
  const baseSrc = src.split('?')[0];
  window._loadedScripts = window._loadedScripts || {};
  if (window._loadedScripts[baseSrc]) {
    return Promise.resolve();
  }

  const activeScripts = Array.from(document.querySelectorAll('script[src]')).filter(s => s.getAttribute('type') !== 'text/plain');
  const existingActive = activeScripts.find(s => {
    const sSrc = s.getAttribute('src') || '';
    return sSrc === src || sSrc.split('?')[0] === baseSrc;
  });

  if (existingActive) {
    if (existingActive.dataset.loaded === 'true') {
      window._loadedScripts[baseSrc] = true;
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      existingActive.addEventListener('load', () => {
        existingActive.dataset.loaded = 'true';
        window._loadedScripts[baseSrc] = true;
        resolve();
      }, { once: true });
      existingActive.addEventListener('error', reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    const versionedSrc = (src.includes('?') || !window.ASSET_VERSION) ? src : `${src}?v=${window.ASSET_VERSION}`;
    s.src = versionedSrc;
    s.onload = () => {
      s.dataset.loaded = 'true';
      window._loadedScripts[baseSrc] = true;
      resolve();
    };
    s.onerror = (e) => reject(e);
    document.body.appendChild(s);
  });
};

window.SIMULATOR_SCRIPT_MAP = {
  "ram-model-vs-modern-cpu": "js/simulators-linear.js",
  "asymptotic-notations-rigor": "js/simulators-linear.js",
  "recurrence-relations-master-theorem": "js/simulators-linear.js",
  "akra-bazzi-uneven-divides": "js/simulators-linear.js",
  "amortized-analysis-potential": "js/simulators-linear.js",
  "space-complexity-stack-frames": "js/simulators-linear.js",
  "cache-oblivious-algorithms": "js/simulators-linear.js",
  "branch-prediction-simd-cost": "js/simulators-linear.js",
  "complexity-tradeoff-framework": "js/simulators-linear.js",
  "case-v8-elements-kinds": "js/simulators-linear.js",
  "dynamic-arrays-geometric-resizing": "js/simulators-linear.js",
  "prefix-sums-difference-arrays": "js/simulators-linear.js",
  "two-pointers-invariant-proofs": "js/simulators-linear.js",
  "sliding-window-monotonicity": "js/simulators-linear.js",
  "kadane-subarray-invariants": "js/simulators-linear.js",
  "bit-manipulation-twos-complement": "js/simulators-linear.js",
  "bitsets-word-level-parallelism": "js/simulators-linear.js",
  "in-place-matrix-cyclic-shifts": "js/simulators-linear.js",
  "boyer-moore-majority-misra-gries": "js/simulators-linear.js",
  "build-dynamic-circular-deque": "js/simulators-linear.js",
  "singly-doubly-intrusive-lists": "js/simulators-linear.js",
  "floyd-brent-cycle-detection": "js/simulators-linear.js",
  "unrolled-linked-lists-ropes": "js/simulators-linear.js",
  "skip-lists-probabilistic-indexing": "js/simulators-linear.js",
  "stacks-expression-evaluation": "js/simulators-linear.js",
  "monotonic-stack-next-greater": "js/simulators-linear.js",
  "monotonic-deque-sliding-extrema": "js/simulators-linear.js",
  "lru-lfu-eviction-structures": "js/simulators-hashing.js",
  "case-redis-skiplist-ziplist": "js/simulators-linear.js",
  "build-lfu-lru-cache": "js/simulators-hashing.js",
  "universal-k-independent-hashing": "js/simulators-hashing.js",
  "separate-chaining-vs-open-addressing": "js/simulators-hashing.js",
  "robin-hood-cuckoo-hashing": "js/simulators-hashing.js",
  "hashdos-siphash-random-seeds": "js/simulators-hashing.js",
  "consistent-hashing-rendezvous": "js/simulators-hashing.js",
  "bloom-filters-counting-xor": "js/simulators-hashing.js",
  "count-min-sketch-heavy-hitters": "js/simulators-hashing.js",
  "hyperloglog-cardinality": "js/simulators-hashing.js",
  "case-rust-hashbrown-swisstable": "js/simulators-hashing.js",
  "build-robin-hood-hash-map": "js/simulators-hashing.js",
  "quadratic-sorts-inversions": "js/simulators-trees.js",
  "mergesort-bottom-up-inversions": "js/simulators-trees.js",
  "quicksort-partition-schemes": "js/simulators-trees.js",
  "randomized-quicksort-expectation": "js/simulators-trees.js",
  "decision-tree-lower-bound": "js/simulators-trees.js",
  "counting-radix-bucket-sorts": "js/simulators-trees.js",
  "quickselect-bfprt-median": "js/simulators-linear.js",
  "external-merge-sort-replacement": "js/simulators-linear.js",
  "case-timsort-pdqsort": "js/simulators-linear.js",
  "build-hybrid-introsort-timsort": "js/simulators-linear.js",
  "binary-search-boundary-invariants": "js/simulators-trees.js",
  "parametric-search-answer-space": "js/simulators-trees.js",
  "rotated-bitonic-unbounded-search": "js/simulators-trees.js",
  "fractional-cascading": "js/simulators-linear.js",
  "divide-and-conquer-closest-pair": "js/simulators-linear.js",
  "karatsuba-strassen-algebraic-dc": "js/simulators-linear.js",
  "fast-fourier-transform-polynomials": "js/simulators-linear.js",
  "meet-in-the-middle-search": "js/simulators-trees.js",
  "cdq-divide-and-conquer": "js/simulators-linear.js",
  "case-git-bisect-eytzinger": "js/simulators-linear.js",
  "tree-representations-traversals": "js/simulators-trees.js",
  "morris-threaded-traversal": "js/simulators-trees.js",
  "tree-serialization-reconstruction": "js/simulators-trees.js",
  "bst-operations-hibbard-deletion": "js/simulators-trees.js",
  "randomly-built-bst-height": "js/simulators-trees.js",
  "binary-d-ary-heaps": "js/simulators-trees.js",
  "mergeable-heaps-binomial-fibonacci": "js/simulators-trees.js",
  "two-heaps-k-way-merge-patterns": "js/simulators-trees.js",
  "case-timer-wheels-vs-heaps": "js/simulators-trees.js",
  "build-indexed-d-ary-priority-queue": "js/simulators-trees.js",
  "tree-rotations-avl-invariants": "js/simulators-trees.js",
  "red-black-llrb-isomorphism": "js/simulators-trees.js",
  "treaps-split-merge-paradigm": "js/simulators-trees.js",
  "splay-trees-dynamic-optimality": "js/simulators-trees.js",
  "augmented-trees-order-intervals": "js/simulators-trees.js",
  "b-trees-bplus-trees-disk-pages": "js/simulators-trees.js",
  "lsm-trees-write-amplification": "js/simulators-trees.js",
  "persistent-trees-path-copying": "js/simulators-trees.js",
  "case-linux-rbtree-cfs": "js/simulators-trees.js",
  "build-llrb-order-statistic-tree": "js/simulators-trees.js",
  "static-range-queries-sparse-table": "js/simulators-trees.js",
  "fenwick-tree-binary-indexed": "js/simulators-trees.js",
  "segment-trees-bottom-up-monoids": "js/simulators-trees.js",
  "lazy-propagation-segment-tree-beats": "js/simulators-trees.js",
  "dynamic-persistent-segment-trees": "js/simulators-trees.js",
  "sqrt-decomposition-mos-algorithm": "js/simulators-trees.js",
  "lowest-common-ancestor-rmq": "js/simulators-trees.js",
  "heavy-light-decomposition": "js/simulators-trees.js",
  "cartesian-trees-treap-duality": "js/simulators-trees.js",
  "build-lazy-segment-tree": "js/simulators-trees.js",
  "tries-radix-trees-patricia": "js/simulators-strings.js",
  "bitwise-tries-max-xor": "js/simulators-strings.js",
  "rabin-karp-polynomial-rolling-hash": "js/simulators-strings.js",
  "kmp-prefix-function-automaton": "js/simulators-strings.js",
  "z-algorithm-linear-box": "js/simulators-strings.js",
  "boyer-moore-horspool-simd": "js/simulators-strings.js",
  "aho-corasick-trie-automaton": "js/simulators-strings.js",
  "manacher-palindromic-tree": "js/simulators-strings.js",
  "case-ripgrep-teddy-simd": "js/simulators-strings.js",
  "build-aho-corasick-scanner": "js/simulators-strings.js",
  "suffix-trees-ukkonen-intuition": "js/simulators-strings.js",
  "suffix-arrays-prefix-doubling-sais": "js/simulators-strings.js",
  "kasai-lcp-array-rmq": "js/simulators-strings.js",
  "suffix-automaton-sam-endpos": "js/simulators-strings.js",
  "burrows-wheeler-transform-fm-index": "js/simulators-strings.js",
  "thompson-nfa-vs-backtracking-regex": "js/simulators-strings.js",
  "myers-diff-hirschberg-lcs": "js/simulators-strings.js",
  "huffman-lz77-deflate": "js/simulators-strings.js",
  "case-git-myers-histogram-diff": "js/simulators-strings.js",
  "build-thompson-nfa-regex-engine": "js/simulators-strings.js",
  "graph-representations-csr-cache": "js/simulators-graphs.js",
  "bfs-01-bfs-multi-source": "js/simulators-graphs.js",
  "dfs-edge-classification-timestamps": "js/simulators-graphs.js",
  "topological-sort-kahn-dfs": "js/simulators-graphs.js",
  "bipartite-graphs-2-coloring": "js/simulators-graphs.js",
  "bridges-articulation-biconnected": "js/simulators-graphs.js",
  "scc-tarjan-kosaraju-2sat": "js/simulators-graphs.js",
  "eulerian-paths-hierholzer": "js/simulators-graphs.js",
  "case-bundler-build-graph-cycles": "js/simulators-graphs.js",
  "build-tarjan-scc-2sat-solver": "js/simulators-graphs.js",
  "disjoint-set-union-ackermann": "js/simulators-graphs.js",
  "dsu-rollback-weighted-offline": "js/simulators-graphs.js",
  "mst-cut-cycle-properties": "js/simulators-graphs.js",
  "dijkstra-relaxation-invariants": "js/simulators-graphs.js",
  "astar-heuristic-admissibility": "js/simulators-graphs.js",
  "bellman-ford-spfa-difference-constraints": "js/simulators-graphs.js",
  "floyd-warshall-johnson-apsp": "js/simulators-graphs.js",
  "state-space-dijkstra-layered-graphs": "js/simulators-graphs.js",
  "case-osrm-contraction-hierarchies": "js/simulators-graphs.js",
  "build-astar-bidirectional-router": "js/simulators-graphs.js",
  "flow-networks-residual-graphs": "js/simulators-graphs.js",
  "max-flow-min-cut-theorem": "js/simulators-graphs.js",
  "edmonds-karp-shortest-augmenting": "js/simulators-graphs.js",
  "dinic-level-graph-blocking-flow": "js/simulators-graphs.js",
  "push-relabel-preflow": "js/simulators-graphs.js",
  "bipartite-matching-hopcroft-karp": "js/simulators-graphs.js",
  "weighted-matching-hungarian": "js/simulators-graphs.js",
  "min-cost-max-flow-mcmf": "js/simulators-graphs.js",
  "flow-reductions-project-selection": "js/simulators-graphs.js",
  "build-dinic-max-flow-engine": "js/simulators-graphs.js",
  "combinatorial-generation-permutations": "js/simulators-dp-adv.js",
  "backtracking-state-space-trees": "js/simulators-dp-adv.js",
  "exact-cover-knuth-algorithm-x": "js/simulators-dp-adv.js",
  "branch-and-bound-admissible-bounds": "js/simulators-dp-adv.js",
  "minimax-alpha-beta-pruning": "js/simulators-dp-adv.js",
  "greedy-choice-exchange-arguments": "js/simulators-dp-adv.js",
  "matroids-greedy-foundations": "js/simulators-dp-adv.js",
  "regret-greedy-heap-rollback": "js/simulators-dp-adv.js",
  "case-sat-solvers-cdcl-dpll": "js/simulators-dp-adv.js",
  "build-dancing-links-exact-cover": "js/simulators-dp-adv.js",
  "dp-optimal-substructure-dag": "js/simulators-dp-adv.js",
  "memoization-tabulation-space-rolling": "js/simulators-dp-adv.js",
  "knapsack-family-01-unbounded-bounded": "js/simulators-dp-adv.js",
  "lis-patience-sorting": "js/simulators-dp-adv.js",
  "sequence-dp-lcs-levenshtein": "js/simulators-dp-adv.js",
  "interval-dp-matrix-chain-triangulation": "js/simulators-dp-adv.js",
  "tree-dp-rerooting-technique": "js/simulators-dp-adv.js",
  "dag-dp-longest-path-counting": "js/simulators-dp-adv.js",
  "case-pretty-printing-knuth-plass": "js/simulators-dp-adv.js",
  "build-hirschberg-linear-space-diff": "js/simulators-dp-adv.js",
  "bitmask-dp-tsp-hamiltonian": "js/simulators-dp-adv.js",
  "sos-dp-fast-zeta-mobius": "js/simulators-dp-adv.js",
  "digit-dp-lexicographic-automata": "js/simulators-dp-adv.js",
  "broken-profile-dp-grid-tiling": "js/simulators-dp-adv.js",
  "divide-and-conquer-dp-quadrangle": "js/simulators-dp-adv.js",
  "knuth-optimization-optimal-bst": "js/simulators-dp-adv.js",
  "convex-hull-trick-li-chao-tree": "js/simulators-dp-adv.js",
  "aliens-trick-wqs-binary-search": "js/simulators-dp-adv.js",
  "matrix-exponentiation-linear-recurrences": "js/simulators-dp-adv.js",
  "build-li-chao-convex-hull-dp": "js/simulators-dp-adv.js",
  "geometry-primitives-orientation-ccw": "js/simulators-dp-adv.js",
  "convex-hull-graham-andrew": "js/simulators-dp-adv.js",
  "sweep-line-bentley-ottmann": "js/simulators-dp-adv.js",
  "spatial-indexing-kd-quad-rtrees": "js/simulators-dp-adv.js",
  "modular-arithmetic-gcd-crt": "js/simulators-dp-adv.js",
  "primality-miller-rabin-pollard-rho": "js/simulators-dp-adv.js",
  "las-vegas-monte-carlo-karger": "js/simulators-dp-adv.js",
  "np-completeness-reductions": "js/simulators-dp-adv.js",
  "approximation-algorithms-fptas": "js/simulators-dp-adv.js",
  "build-kd-tree-nearest-neighbor": "js/simulators-dp-adv.js"
};

window.Renderer = (() => {
  // SVG Icons
  const icons = {
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>',
    circle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/></svg>',
    dot: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/></svg>',
    play: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    link: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    book: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    code: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    chevronRight: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
    chevronDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    pin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.89A2 2 0 0 1 15 10.77V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5.77a2 2 0 0 1-1.11 1.79l-1.78.89A2 2 0 0 0 5 15.24Z"/></svg>',
    github: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
    globe: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    external: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    calendar: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    terminal: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
    target: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    arrowLeft: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>'
  };

  /**
   * Format content review date (e.g. "2026-09-17" -> "Sep 17, 2026")
   */
  function formatReviewDate(dateStr) {
    if (!dateStr) return '2026';
    try {
      const parts = String(dateStr).split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        const y = parts[0];
        if (m >= 0 && m < 12 && !isNaN(d)) {
          return `${months[m]} ${d}, ${y}`;
        }
      }
      return String(dateStr);
    } catch (_) {
      return String(dateStr);
    }
  }

  /**
   * Render the Course Overview (home page)
   */
  function renderOverview() {
    const data = window.CURRICULUM_DATA;
    if (!data) return '<p>Loading curriculum data...</p>';

    const stats = data.stats;
    const pct = window.Progress.getPercentage();
    const streak = window.Progress.getStreak ? window.Progress.getStreak().current : 0;
    const projects = window.PROJECTS_DATA || [];
    const pinnedProjects = projects.filter(p => p.pinned);

    let html = `
      <div class="hero">
        <div class="hero__eyebrow">DSA Curriculum</div>
        <h1 class="hero__title">DSA In Depth</h1>
        <p class="hero__subtitle">Deep notes, case studies, YouTube tutorials, and from-scratch implementations for senior engineering practice.</p>
        <div class="hero__stats">
          <div><div class="hero__stat-value">${stats.tracks || 6}</div><div class="hero__stat-label">Tracks</div></div>
          <div><div class="hero__stat-value">${stats.units}</div><div class="hero__stat-label">Topics</div></div>
          <div><div class="hero__stat-value">${pct}%</div><div class="hero__stat-label">Complete</div></div>
          <div><div class="hero__stat-value" style="color: ${streak > 0 ? '#f97316' : 'inherit'};">${streak} 🔥</div><div class="hero__stat-label">Day Streak</div></div>
        </div>
        <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <a href="#/glossary" class="btn btn--sm btn--primary">📖 Glossary</a>
        </div>
      </div>`;

    // Render each part
    for (const part of data.parts) {
      html += `
        <div class="part-header">
          <h2 class="part-header__title">${part.title}</h2>
          <p class="part-header__summary">${part.summary}</p>
        </div>
        <div class="module-grid">`;

      for (const mod of part.modules) {
        const prog = window.Progress.getModuleProgress(mod.id);
        const progPct = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;
        html += `
          <div class="module-card" data-module="${mod.id}" data-action="navigate-module" data-module-id="${mod.id}">
            <div class="module-card__header">
              <span class="module-card__number">${mod.number}</span>
              <div class="module-card__info">
                <div class="module-card__title">${mod.title}</div>
                <div class="module-card__meta">
                  <span>${mod.units.length} units</span>
                  <span>·</span>
                  <span>${prog.completed}/${prog.total} done</span>
                </div>
              </div>
            </div>
            <p class="module-card__summary">${mod.summary || ''}</p>
            <div class="module-card__progress">
              <div class="module-card__progress-fill" style="width:${progPct}%"></div>
            </div>
          </div>`;
      }

      html += '</div>';

      // Add section divider between parts
      if (part.number < data.parts.length) {
        html += '<div class="section-divider"><span class="section-divider__line"></span><span class="section-divider__text">Next Part</span><span class="section-divider__line"></span></div>';
      }
    }

    return html;
  }

  function unescapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  function highlightSyntax(code, lang) {
    if (!code) return '';
    const cleanLang = (lang || 'cpp').toLowerCase();

    const CPP_KEYWORDS = new Set([
      'auto', 'bool', 'break', 'case', 'catch', 'class', 'const', 'constexpr', 'continue',
      'default', 'delete', 'do', 'double', 'else', 'enum', 'explicit', 'export', 'extern',
      'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 'mutable',
      'namespace', 'new', 'noexcept', 'nullptr', 'operator', 'private', 'protected', 'public',
      'return', 'short', 'signed', 'sizeof', 'static', 'static_assert', 'struct', 'switch',
      'template', 'this', 'throw', 'true', 'try', 'typedef', 'typename', 'union', 'unsigned',
      'using', 'virtual', 'void', 'volatile', 'while'
    ]);

    const JS_KEYWORDS = new Set([
      'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
      'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for',
      'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null', 'return',
      'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'undefined', 'var',
      'void', 'while', 'with', 'yield', 'type', 'interface', 'implements', 'declare'
    ]);

    const PY_KEYWORDS = new Set([
      'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else',
      'except', 'False', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
      'lambda', 'None', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'True', 'try',
      'while', 'with', 'yield', 'self'
    ]);

    const SH_KEYWORDS = new Set([
      'if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'in', 'case',
      'esac', 'echo', 'exit', 'return', 'set', 'export', 'alias', 'local', 'function'
    ]);

    const CPP_TYPES = new Set([
      'vector', 'string', 'span', 'pair', 'tuple', 'unordered_map', 'unordered_set', 'map', 'set',
      'queue', 'stack', 'priority_queue', 'unique_ptr', 'shared_ptr', 'optional', 'size_t',
      'uint32_t', 'uint64_t', 'int64_t', 'int32_t', 'ptrdiff_t', 'RecurrenceTerm', 'ListNode', 'TreeNode'
    ]);

    const isCpp = ['cpp', 'c++', 'cc', 'cxx', 'c', 'hpp', 'h'].includes(cleanLang);
    const isPy = ['py', 'python'].includes(cleanLang);
    const isSh = ['sh', 'bash', 'shell', 'zsh'].includes(cleanLang);
    const isJs = ['js', 'javascript', 'ts', 'typescript', 'node'].includes(cleanLang);

    const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[\s\S]*?`)|(\b\d+\.?\d*(?:[eE][+-]?\d+)?\b)|(\b[a-zA-Z_]\w*\b)|([+\-*/%=&|<>!^~?:;,.]+)/g;

    let result = '';
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(code)) !== null) {
      if (match.index > lastIndex) {
        result += escapeHtml(code.slice(lastIndex, match.index));
      }
      const [full, commentOrHash, str, num, word, op] = match;
      if (commentOrHash) {
        if (commentOrHash.startsWith('#') && isCpp && /^\s*#\s*(include|define|pragma|ifdef|ifndef|endif|else)/.test(commentOrHash)) {
          result += '<span class="tok-preproc">' + escapeHtml(commentOrHash) + '</span>';
        } else if (commentOrHash.startsWith('#') && (isPy || isSh)) {
          result += '<span class="tok-comment">' + escapeHtml(commentOrHash) + '</span>';
        } else if (commentOrHash.startsWith('//') || commentOrHash.startsWith('/*')) {
          result += '<span class="tok-comment">' + escapeHtml(commentOrHash) + '</span>';
        } else {
          result += escapeHtml(commentOrHash);
        }
      } else if (str) {
        result += '<span class="tok-str">' + escapeHtml(str) + '</span>';
      } else if (num) {
        result += '<span class="tok-num">' + escapeHtml(num) + '</span>';
      } else if (word) {
        if (isCpp && CPP_KEYWORDS.has(word)) {
          result += '<span class="tok-kw">' + escapeHtml(word) + '</span>';
        } else if (isCpp && CPP_TYPES.has(word)) {
          result += '<span class="tok-type">' + escapeHtml(word) + '</span>';
        } else if (isJs && JS_KEYWORDS.has(word)) {
          result += '<span class="tok-kw">' + escapeHtml(word) + '</span>';
        } else if (isPy && PY_KEYWORDS.has(word)) {
          result += '<span class="tok-kw">' + escapeHtml(word) + '</span>';
        } else if (isSh && SH_KEYWORDS.has(word)) {
          result += '<span class="tok-kw">' + escapeHtml(word) + '</span>';
        } else if (code[tokenRegex.lastIndex] === '(') {
          result += '<span class="tok-fn">' + escapeHtml(word) + '</span>';
        } else {
          result += escapeHtml(word);
        }
      } else if (op) {
        result += '<span class="tok-op">' + escapeHtml(op) + '</span>';
      } else {
        result += escapeHtml(full);
      }
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < code.length) {
      result += escapeHtml(code.slice(lastIndex));
    }
    return result;
  }

  function renderMathInHtml(html) {
    if (!html || typeof html !== 'string') return html;

    const k = (typeof window !== 'undefined' && window.katex) || (typeof globalThis !== 'undefined' && globalThis.katex);

    // Stash pre, code, svg, script, textarea blocks to protect them from math delimiters
    const stash = [];
    let safe = html.replace(/<(pre|code|svg|script|textarea)\b[\s\S]*?<\/\1>/gi, (m) => {
      stash.push(m);
      return '\x00PROTECTED_' + (stash.length - 1) + '\x00';
    });

    // 1. Block math $$...$$
    safe = safe.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      const clean = math.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
      if (k && typeof k.renderToString === 'function') {
        try {
          return k.renderToString(clean, { displayMode: true, throwOnError: false });
        } catch (_) {}
      }
      return '<div class="katex-display-math" data-math="' + escapeHtml(clean) + '">$$' + escapeHtml(clean) + '$$</div>';
    });

    // 2. Inline math $...$
    safe = safe.replace(/\$([^\$\n\r]+?)\$/g, (_, math) => {
      const clean = math.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
      if (k && typeof k.renderToString === 'function') {
        try {
          return k.renderToString(clean, { displayMode: false, throwOnError: false });
        } catch (_) {}
      }
      return '<span class="katex-inline-math" data-math="' + escapeHtml(clean) + '">$' + escapeHtml(clean) + '$</span>';
    });

    // Restore protected blocks
    return safe.replace(/\x00PROTECTED_(\d+)\x00/g, (_, i) => stash[Number(i)]);
  }

  function renderTopicCodeBlock(rawCode, lang) {
    const cleanLang = (lang || 'cpp').toLowerCase();
    const isRunnable = ['js', 'javascript', 'ts', 'typescript', 'cpp', 'c++', 'cc', 'cxx', 'c', 'hpp', 'py', 'python', 'node', 'sh', 'bash'].includes(cleanLang);
    const displayLang = (cleanLang === 'cpp' || cleanLang === 'c++' || cleanLang === 'cc') ? 'C++20' : cleanLang.toUpperCase();
    const unescaped = unescapeHtml(rawCode).trim();
    const lineCount = unescaped ? unescaped.split('\n').length : 0;
    const isLong = lineCount > 6;
    const collapsedClass = isLong ? ' code-block--collapsed' : '';
    const initialExpanded = !isLong;

    const runBtn = isRunnable
      ? `<button type="button" class="code-block__copy code-block__run-btn" data-action="run-snippet-codelab" data-lang="${escapeHtml(cleanLang)}" title="Execute this snippet in the in-browser CodeLab IDE"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4"/></svg><span>Run in CodeLab</span></button>`
      : '';

    const copyBtn = `<button type="button" class="code-block__copy" data-action="copy-code" title="Copy code to clipboard">Copy</button>`;

    const toggleBtn = `<button type="button" class="code-block__copy code-block__toggle-btn" data-action="toggle-code" aria-expanded="${initialExpanded}" title="Expand or collapse code block">
      <span class="code-block__toggle-text">${initialExpanded ? 'Collapse' : 'Expand'}</span>
      <span class="code-block__chevron">${initialExpanded ? '▲' : '▼'}</span>
    </button>`;

    const highlighted = highlightSyntax(unescaped, cleanLang);

    return (
      '<div class="code-block code-block--collapsible' + collapsedClass + '">' +
        '<div class="code-block__header" data-action="toggle-code-header">' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<span class="code-block__lang">' + escapeHtml(displayLang) + '</span>' +
            '<span class="code-block__lines-chip">' + lineCount + ' lines</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:6px;">' +
            runBtn +
            copyBtn +
            toggleBtn +
          '</div>' +
        '</div>' +
        '<pre><code class="language-' + escapeHtml(cleanLang) + '">' + highlighted + '</code></pre>' +
      '</div>'
    );
  }

  function renderTopicCodeLabCard(slug, unit, mod, moduleContent) {
    let fallbackCpp = '';
    if (moduleContent?.content) {
      const m = moduleContent.content.match(/<pre><code\s+class=["']language-cpp["']>([\s\S]*?)<\/code><\/pre>/);
      if (m) fallbackCpp = m[1];
    }
    const lab = (window.TopicGuidedLabs && typeof window.TopicGuidedLabs.getLab === 'function')
      ? window.TopicGuidedLabs.getLab(slug, fallbackCpp, unit?.title)
      : null;
    if (!lab) return '';

    const steps = Array.isArray(lab.steps) ? lab.steps : [];
    const labTitle = lab.title || `${unit?.title || 'Interactive'} — Guided Algorithm Coding Practice`;
    const labSummary = lab.summary || 'Hands-on algorithm implementation with step-by-step progressive hints and automated C++20 verification.';
    const totalSteps = steps.length || 3;
    const comp = lab.complexity || { time: 'O(N log N)', space: 'O(N)', pattern: mod?.title || 'Algorithmic Invariants' };

    return `
      <section class="build-lab-card topic-codelab-hero" id="guided-coding-practice-${escapeHtml(slug)}" aria-label="Guided Algorithm Coding Practice">
        <div class="build-lab-card__top">
          <div class="build-lab-card__intro">
            <div class="build-lab-card__eyebrow">
              <span>Guided Algorithm Coding Practice · C++20 Workbench</span>
              <span class="build-lab-card__progress">${totalSteps} Guided Steps + Progressive Hints</span>
            </div>
            <h2 class="build-lab-card__title">${escapeHtml(labTitle)}</h2>
            <p class="build-lab-card__desc">${escapeHtml(labSummary)}</p>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
              <span class="badge">⏱ Target Time: <code>${escapeHtml(comp.time || 'O(N log N)')}</code></span>
              <span class="badge">💾 Auxiliary Space: <code>${escapeHtml(comp.space || 'O(N)')}</code></span>
              <span class="badge">🧭 Pattern: ${escapeHtml(comp.pattern || mod?.title || 'Core Invariants')}</span>
            </div>
          </div>
          <div class="build-lab-card__cta-col">
            <button type="button" class="btn btn--primary build-lab-card__launch-btn" data-action="open-topic-codelab" data-slug="${escapeHtml(slug)}" data-mode="guided">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              <span>Code Algorithm &amp; Run Tests</span>
            </button>
            <button type="button" class="btn btn--outline build-lab-card__launch-btn" data-action="open-topic-codelab" data-slug="${escapeHtml(slug)}" data-mode="solution">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>View Reference Solution</span>
            </button>
          </div>
        </div>

        ${steps.length ? `
          <div class="build-lab-steps-grid">
            ${steps.map((s, idx) => {
              const defaultPhases = ['Phase 1 · State & Boundaries', 'Phase 2 · Core Transition', 'Phase 3 · Verification & Bounds'];
              const phaseLabel = s.phase || defaultPhases[idx] || `Phase ${idx + 1} · Implementation`;
              const stepTitle = (s.title || `Step ${idx + 1}`).replace(/^Step\s*\d+:\s*/i, '');
              return `
              <div class="build-lab-step-card">
                <div class="build-lab-step-card__body">
                  <div class="build-lab-step-card__header">
                    <span class="build-lab-step-card__num">0${idx + 1}</span>
                    <span class="build-lab-step-card__target">${escapeHtml(phaseLabel)}</span>
                  </div>
                  <div class="build-lab-step-card__title">${escapeHtml(stepTitle)}</div>
                  ${s.concept ? `<div class="build-lab-step-card__invariant">${escapeHtml(s.concept)}</div>` : ''}
                  <div class="build-lab-step-card__concept">${escapeHtml(s.instructions || 'Implement and verify core invariants in src/main.cpp.')}</div>
                  ${s.hint ? `
                    <details class="quiz-hint-details">
                      <summary>💡 Progressive Hint (Step ${idx + 1})</summary>
                      <pre><code>${escapeHtml(s.hint)}</code></pre>
                    </details>
                  ` : ''}
                </div>
                <div class="build-lab-step-card__footer">
                  <span>Step ${idx + 1} of ${steps.length} · <code>src/main.cpp</code></span>
                  <button type="button" class="btn btn--sm btn--outline" data-action="open-topic-codelab" data-slug="${escapeHtml(slug)}" data-mode="guided" data-step-index="${idx}">
                    Code Step ${idx + 1} →
                  </button>
                </div>
              </div>
            `;
            }).join('')}
          </div>
        ` : ''}
      </section>
    `;
  }

  /**
   * Render a Lesson View
   */
  function renderLesson(slug) {
    const data = window.CURRICULUM_DATA;
    if (!data) return '<p>Loading...</p>';

    // Find unit and module
    let unit = null;
    let mod = null;
    let part = null;
    for (const p of data.parts) {
      for (const m of p.modules) {
        for (const u of m.units) {
          if (u.slug === slug) {
            unit = u;
            mod = m;
            part = p;
            break;
          }
        }
        if (unit) break;
      }
      if (unit) break;
    }

    if (!unit) return '<p>Topic not found.</p>';

    const isCompleted = window.Progress.isCompleted(slug);
    const kindClass = unit.kind === 'system' ? 'system' : 'lesson';

    // Get module content if loaded
    const moduleContent = window.MODULE_CONTENT?.[mod.id]?.[slug];
    const archiveContent = window.ARCHIVE_CONTENT?.[slug] || null;
    // Trigger lazy-load of archive file if not yet loaded (only slugs that ship a data/archive file)
    if (!archiveContent && unit.archive && ARCHIVE_SLUGS.has(slug) && !window.ARCHIVE_CONTENT?.[slug]) {
      const archiveScript = document.createElement('script');
      archiveScript.src = 'data/archive/' + slug + '.js' + (window.ASSET_VERSION ? '?v=' + window.ASSET_VERSION : '');
      archiveScript.onload = () => {
        // Re-render once archive content is available (only if the learner is still on this lesson),
        // then restore what the first render wired up: simulator, diagrams, audio.
        const reader = document.getElementById('reader');
        if (!reader || decodeURIComponent(location.hash) !== '#topic/' + slug) return;
        const sim = window.Simulators?.getSimulatorForUnit?.(slug)?.sim;
        sim?.unmount?.(reader);
        reader.innerHTML = renderLesson(slug);
        sim?.mount?.(reader);
        window.App?.initMermaid?.();
        window.setupAudioListeners?.(slug);
      };
      document.head.appendChild(archiveScript);
    }

    const reviewDate = formatReviewDate(unit.archive?.updated);

    // Build header
    let html = `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/" data-nav="home">Home</a>
        <span class="breadcrumbs__sep">${icons.chevronRight}</span>
        <a href="#" data-nav="module" data-module="${mod.id}">${mod.title}</a>
        <span class="breadcrumbs__sep">${icons.chevronRight}</span>
        <span class="breadcrumbs__current">${unit.title}</span>
      </nav>

      <div class="lesson-header">
        <div class="lesson-header__badge">
          <span class="lesson-header__kind lesson-header__kind--${kindClass}">${unit.kind}</span>
          ${unit.archive?.tags?.map(t => ' <span class="tag">' + t + '</span>').join('') || ''}
        </div>
        <h1 class="lesson-header__title">${unit.title}</h1>
        <div class="lesson-header__meta">
          ${(() => {
            const words = unit.archive?.wordCount || (moduleContent?.content ? moduleContent.content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length : 0);
            return words ? '<span class="lesson-header__meta-item">' + icons.clock + ' ' + Math.ceil(words / 200) + ' min read</span>' : '';
          })()}
          <span class="lesson-header__meta-item">${icons.book} Module ${mod.number}: ${mod.title}</span>
          <span class="lesson-header__meta-item" title="Content curriculum review date">${icons.calendar} Updated ${reviewDate}</span>
        </div>
        <div class="lesson-header__actions" style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
          <button class="completion-toggle${isCompleted ? ' completed' : ''}" data-action="toggle-complete" data-slug="${slug}">
            ${isCompleted ? icons.check + ' Completed' : icons.circle + ' Mark Complete'}
          </button>
          <a href="#cheatsheet/${mod.id}" class="btn btn--sm btn--outline" title="View printable cheat sheet for this module">
            📄 Cheat Sheet
          </a>
        </div>
      </div>`;

    // Video embed (from module content)
    if (moduleContent?.video?.youtubeId) {
      html += renderVideoEmbed(moduleContent.video);
      html += renderMoreVideos(moduleContent.videos);
    }

    // Intuition-first primer (plain-language mental model before the deep dive)
    if (moduleContent?.intuition) {
      html += `
        <aside class="intuition">
          <h3 class="intuition__title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>Intuition first</h3>
          <div class="intuition__body">${convertMarkdownToHTML(moduleContent.intuition)}</div>
        </aside>`;
    }

    // Audio player
    const initialDuration = unit.archive?.audioDuration || unit.audioDuration || '--:--';
    html += `
      <div class="audio-player" id="audio-player-${slug}">
        <button class="audio-player__play-btn" id="audio-btn-${slug}" data-action="toggle-audio" data-slug="${slug}" aria-label="Play audio" title="Play audio">
          <svg id="audio-play-icon-${slug}" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg id="audio-pause-icon-${slug}" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="display:none;">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
        <span class="audio-player__time" id="audio-time-${slug}">0:00 / ${initialDuration}</span>
        <div class="audio-player__track" data-action="seek-audio" data-slug="${slug}" id="audio-track-${slug}">
          <div class="audio-player__progress" id="audio-bar-${slug}" style="width: 0%;"></div>
        </div>
        <button class="audio-player__speed-btn" data-action="cycle-audio-speed" data-slug="${slug}" id="audio-speed-${slug}" title="Playback speed">1x</button>
        <audio id="audio-${slug}" src="audio/${slug}.mp3" preload="metadata"></audio>
      </div>`;

    // Content
    html += '<article class="prose">';

    if (archiveContent && archiveContent.trim().length > 100) {
      // Use authentic markdown from curriculum
      html += convertMarkdownToHTML(archiveContent);
      // If module content has complementary details (e.g. diagrams or breakdown), augment smoothly
      const isPlaceholder = moduleContent?.content?.includes('This topic is covered in depth in the curriculum archive');
      if (moduleContent?.content && !isPlaceholder && !archiveContent.includes('Real-World Usage')) {
        html += '<hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--divider);">';
        let deepDiveHtml = moduleContent.content.replace(
          /<pre><code\s+class=["']language-([a-zA-Z0-9_\-+]+)["']>([\s\S]*?)<\/code><\/pre>/g,
          (match, lang, code) => renderTopicCodeBlock(code, lang)
        );
        html += '<div class="lesson-deep-dive">' + deepDiveHtml + '</div>';
      }
    } else if (moduleContent?.content) {
      let bodyHtml = moduleContent.content.replace(
        /<div\s+class=["']simulator-mount["']\s+data-sim=["']([^"']+)["']\s*><\/div>/g,
        (match, simId) => {
          const simObj = window.SIMULATORS?.[simId];
          return simObj && typeof simObj.render === 'function'
            ? `<div class="simulator-mount" data-sim="${simId}">${simObj.render()}</div>`
            : match;
        }
      );
      bodyHtml = bodyHtml.replace(
        /<pre><code\s+class=["']language-([a-zA-Z0-9_\-+]+)["']>([\s\S]*?)<\/code><\/pre>/g,
        (match, lang, code) => renderTopicCodeBlock(code, lang)
      );
      html += bodyHtml;
    } else {
      // Fallback
      html += renderFallbackContent(unit, mod);
    }

    html += '</article>';

    // Check yourself: unified slider with Concept Checks, Napkin Math (numeric), and Staff Trade-Off Matrix (tradeoff)
    if (window.Quiz?.renderCheckSlider) html += window.Quiz.renderCheckSlider(slug);

    // Interactive Visual Simulator (only if not already mounted inline via .simulator-mount)
    const hasInlineSim = moduleContent?.content?.includes('class="simulator-mount"');
    if (!hasInlineSim) {
      if (window.Simulators && window.Simulators.getSimulatorForUnit) {
        const simData = window.Simulators.getSimulatorForUnit(slug);
        if (simData) {
          html += `<div class="simulator-mount" data-sim="${simData.sim.id}">${simData.html}</div>`;
        } else if (window.SIMULATOR_SCRIPT_MAP?.[slug]) {
          html += `<div class="sim-card-placeholder" data-sim-slug="${slug}"></div>`;
        }
      } else if (window.SIMULATOR_SCRIPT_MAP?.[slug]) {
        html += `<div class="sim-card-placeholder" data-sim-slug="${slug}"></div>`;
      }
    }

    // Interactive Guided C++20 CodeLab Workbench Card (Unified Guided Algorithm Coding Practice)
    html += renderTopicCodeLabCard(slug, unit, mod, moduleContent);

    // Key takeaways
    if (moduleContent?.keyTakeaways?.length) {
      html += `
        <div class="takeaways">
          <h3 class="takeaways__title">Key Takeaways</h3>
          <div class="takeaways__list">
            ${moduleContent.keyTakeaways.map(t => '<div class="takeaways__item">' + t + '</div>').join('')}
          </div>
        </div>`;
    }

    // Incident challenges and architecture blueprints for this lesson
    html += renderLessonChallenges(slug);
    html += renderLessonBlueprints(slug);

    // Further reading
    if (moduleContent?.furtherReading?.length) {
      html += `
        <div class="further-reading">
          <h3 class="further-reading__title">Further Reading</h3>
          <div class="further-reading__list">
            ${moduleContent.furtherReading.map(r => '<a class="further-reading__link" href="' + r.url + '" target="_blank" rel="noopener">' + icons.link + ' ' + r.title + '</a>').join('')}
          </div>
        </div>`;
    } else if (unit.archive?.sources?.length) {
      html += `
        <div class="further-reading">
          <h3 class="further-reading__title">Sources</h3>
          <div class="further-reading__list">
            ${unit.archive.sources.filter(s => s.startsWith('http')).map(s => '<a class="further-reading__link" href="' + s + '" target="_blank" rel="noopener">' + icons.link + ' ' + s.replace(/https?:\/\//, '').split('/').slice(0, 2).join('/') + '</a>').join('')}
          </div>
        </div>`;
    }

    // Was this helpful / Report issue feedback bar
    html += renderLessonFeedback(slug, unit);

    // Prev/Next navigation
    html += renderLessonNav(slug, mod, part);

    return renderMathInHtml(html);
  }

  // Order build files: README first, then implementation, demo, tests
  const buildFileRank = f => (/readme/i.test(f) ? 0 : /^demo\b|\/demo\b/i.test(f) ? 2 : /test/i.test(f) ? 3 : 1);
  const orderedBuildFiles = files => Object.entries(files || {}).sort((a, b) => buildFileRank(a[0]) - buildFileRank(b[0]));

  // Lesson title lookup for cross-links
  function findUnitTitle(slug) {
    for (const p of window.CURRICULUM_DATA?.parts || []) for (const m of p.modules) for (const u of m.units) if (u.slug === slug) return u.title;
    return null;
  }

  /**
   * Builds that teach this lesson (primarySlug or relatedSlugs)
   */
  function buildsForLesson(slug) {
    return Object.entries(window.IMPLEMENTATIONS_DATA || {})
      .filter(([, b]) => b.primarySlug === slug || (b.relatedSlugs || []).includes(slug))
      .sort((a, b) => (a[1].primarySlug === slug ? 0 : 1) - (b[1].primarySlug === slug ? 0 : 1));
  }

  function renderLessonBuilds(slug) {
    const builds = buildsForLesson(slug);
    if (!builds.length) return '';
    return `
      <div class="lesson-builds">
        <h3 class="lesson-builds__title">${icons.code} Multi-File Capstone Algorithm Lab — Guided Implementation</h3>
        ${builds.map(([id, b]) => {
          const prog = window.Progress?.getBuildProgress ? window.Progress.getBuildProgress(id) : null;
          const stepCount = prog?.completedSteps?.length || 0;
          const badgeHtml = prog?.completed
            ? `<span class="badge" style="margin-left:auto;color:var(--success);border-color:var(--success);">✓ Lab Complete (4/4)</span>`
            : stepCount > 0
              ? `<span class="badge" style="margin-left:auto;">${stepCount}/4 Steps</span>`
              : '';
          return `
          <a class="lesson-builds__item" href="/build/${id}/" data-action="navigate-build" data-build-id="${id}">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <span class="lesson-builds__name">${escapeHtml(b.title || id)}</span>
              ${badgeHtml}
            </div>
            ${b.summary ? `<span class="lesson-builds__summary">${escapeHtml(b.summary)}</span>` : ''}
            <span class="lesson-builds__cta">${icons.terminal} Open Guided Algorithm Lab (C++20, TypeScript &amp; JS) →</span>
          </a>`;
        }).join('')}
      </div>`;
  }

  function challengesForLesson(slug) {
    const raw = window.CHALLENGES_DATA || window.ChallengesData;
    const list = Array.isArray(raw) ? raw : (raw?.challenges || []);
    return list.filter(c => (c.relatedSlugs || []).includes(slug));
  }

  function renderLessonChallenges(slug) {
    const challenges = challengesForLesson(slug);
    if (!challenges.length) return '';
    return `
      <div class="lesson-builds lesson-challenges">
        <h3 class="lesson-builds__title">${icons.target} Debug This in Production — Incident Simulator &amp; Code Hotfix</h3>
        ${challenges.map(c => `
          <a class="lesson-builds__item" href="/challenges/${c.id}/" data-nav="challenges" data-challenge="${c.id}">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <span class="lesson-builds__name">${escapeHtml(c.title)}</span>
              <span class="badge">${escapeHtml(c.severity || 'SEV-1')} · ${escapeHtml(c.difficulty || 'Senior')}</span>
            </div>
            ${c.subtitle ? `<span class="lesson-builds__summary">${escapeHtml(c.subtitle)}</span>` : ''}
            <span class="lesson-builds__cta">${icons.terminal} Launch Production Incident &amp; CodeLab Hotfix →</span>
          </a>`).join('')}
      </div>`;
  }

  function blueprintsForLesson(slug) {
    return (window.WHITEBOARD_DATA?.blueprints || []).filter(bp => bp.id === slug.replace(/^case-/, '') || (bp.relatedSlugs || []).includes(slug));
  }

  function renderLessonBlueprints(slug) {
    const bps = blueprintsForLesson(slug);
    if (!bps.length) return '';
    return `
      <div class="lesson-builds lesson-blueprints">
        <h3 class="lesson-builds__title">${icons.globe} Interactive Architecture Blueprint — Capacity Sandbox</h3>
        ${bps.map(bp => `
          <a class="lesson-builds__item" href="/sandbox/?blueprint=${bp.id}" data-nav="sandbox" data-blueprint="${bp.id}">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <span class="lesson-builds__name">${escapeHtml(bp.title)}</span>
              ${bp.targetQps ? `<span class="badge">${escapeHtml(String(bp.targetQps))} QPS</span>` : ''}
            </div>
            ${bp.description ? `<span class="lesson-builds__summary">${escapeHtml(bp.description)}</span>` : ''}
            <span class="lesson-builds__cta">${icons.target} Open Topology &amp; Stress-Test in Architecture Sandbox →</span>
          </a>`).join('')}
      </div>`;
  }

  /**
   * Render a Build (Implementation) View
   * Initially presents the Build Guide, Interactive Lab Overview Card & Steps, and Reference Code,
   * with a one-click full-page Interactive Lab transition.
   */
  function renderBuild(buildId) {
    const impls = window.IMPLEMENTATIONS_DATA;
    if (!impls || !impls[buildId]) return '<p>Build not found.</p>';

    const build = impls[buildId];
    const guided = window.GUIDED_LABS_DATA?.[buildId] || null;
    const steps = Array.isArray(guided?.steps) ? guided.steps : [];
    const files = orderedBuildFiles(build.files);
    const lessons = [build.primarySlug, ...(build.relatedSlugs || [])].filter(Boolean)
      .map(s => ({ slug: s, title: findUnitTitle(s) })).filter(l => l.title);
    const demoFile = files.find(([f]) => /(^|\/)demo\.js$/i.test(f))?.[0];
    const testFile = files.find(([f]) => /(^|\/)test\.js$/i.test(f))?.[0];

    let completedIds = [];
    try {
      const raw =
        localStorage.getItem('sd-codelab-v1:' + buildId) ||
        localStorage.getItem('codelab_progress_' + buildId) ||
        localStorage.getItem('sd_codelab_' + buildId);
      const saved = JSON.parse(raw || 'null');
      if (Array.isArray(saved?.completedSteps)) completedIds = saved.completedSteps;
    } catch (_) {}

    const totalSteps = steps.length || 4;
    const progressPct = Math.min(100, Math.round((completedIds.length / Math.max(1, totalSteps)) * 100));
    const difficulty = guided?.difficulty || 'Intermediate';
    const estMinutes = guided?.estimatedMinutes || 25;

    let html = `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="#" data-nav="home">Home</a>
        <span class="breadcrumbs__sep">${icons.chevronRight}</span>
        <span class="breadcrumbs__current">${escapeHtml(build.title || buildId)}</span>
      </nav>

      <div class="lesson-header">
        <div class="lesson-header__badge">
          <span class="lesson-header__kind lesson-header__kind--build">${icons.code} Guided Algorithm Coding Lab</span>
        </div>
        <h1 class="lesson-header__title">${escapeHtml(build.title || buildId.replace(/-/g, ' '))}</h1>
        ${build.summary ? `<p class="build-summary">${escapeHtml(build.summary)}</p>` : ''}
        <div class="lesson-header__meta">
          <span class="lesson-header__meta-item">${icons.clock} ~${estMinutes} min</span>
          <span class="lesson-header__meta-item">${icons.code} ${escapeHtml(difficulty)}</span>
          ${lessons.length ? `<span class="lesson-header__meta-item">${icons.book} Lesson${lessons.length > 1 ? 's' : ''}: ${lessons.map(l =>
            `<a href="#" data-nav="topic" data-slug="${l.slug}">${escapeHtml(l.title)}</a>`).join(', ')}</span>` : ''}
        </div>
      </div>

      <section class="build-lab-card" aria-label="Guided Algorithm Lab Overview">
        <div class="build-lab-card__top">
          <div class="build-lab-card__intro">
            <div class="build-lab-card__eyebrow">
              <span>Guided Algorithm Coding Lab</span>
              <span class="build-lab-card__progress" id="build-lab-progress-badge">${completedIds.length}/${totalSteps} Steps Completed</span>
            </div>
            <h2 class="build-lab-card__title">Code &amp; Verify Algorithm Invariants in the Browser Workbench</h2>
            <p class="build-lab-card__desc">
              Complete ${totalSteps} progressive algorithmic steps with guided hints in <strong>C++20 (WebAssembly)</strong>, <strong>TypeScript</strong>, or <strong>JavaScript</strong> against automated unit test assertions — zero local setup required.
            </p>
            <div class="build-lab-progress-track" aria-hidden="true">
              <div class="build-lab-progress-track__fill" style="width:${progressPct}%"></div>
            </div>
          </div>
          <div class="build-lab-card__cta-col">
            <button type="button" class="btn btn--primary build-lab-card__launch-btn" data-action="open-code-lab" data-lab-mode="guided">
              ${icons.terminal}
              <span>Launch Guided Lab</span>
            </button>
            <button type="button" class="btn btn--outline build-lab-card__launch-btn" data-action="open-code-lab" data-lab-mode="sandbox">
              ${icons.code}
              <span>Open Full Solution</span>
            </button>
          </div>
        </div>

        ${steps.length ? `
          <div class="build-lab-steps-grid" id="build-lab-steps-grid">
            ${steps.map((s, idx) => {
              const isDone = completedIds.includes(s.id);
              const cleanTitle = (s.title || '').replace(/^Step\s*\d+:\s*/i, '');
              return `
                <button type="button" class="build-lab-step-card ${isDone ? 'is-done' : ''}" data-action="open-code-lab" data-lab-mode="guided" data-step-index="${idx}">
                  <div class="build-lab-step-card__header">
                    <span class="build-lab-step-card__num">${isDone ? icons.check : `0${idx + 1}`}</span>
                    <span class="build-lab-step-card__target">${escapeHtml(s.targetFile || '')}${s.targetSymbol ? ` · ${escapeHtml(s.targetSymbol.split('/')[0].trim())}` : ''}</span>
                  </div>
                  <div class="build-lab-step-card__title">${escapeHtml(cleanTitle)}</div>
                  <div class="build-lab-step-card__concept">${escapeHtml(s.concept || '')}</div>
                  <div class="build-lab-step-card__footer">
                    <span>${(s.testNames || []).length} test${(s.testNames || []).length === 1 ? '' : 's'}</span>
                    <span class="build-lab-step-card__open">Step ${idx + 1} →</span>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        ` : ''}
      </section>

      <div id="build-walkthrough-pane">`;

    for (const [filename, content] of files) {
      if (filename.endsWith('.md')) {
        const cleanMd = content
          .replace(/^#\s+[^\n]+\n+/, '')
          .replace(/\n##\s+(?:How to run|9\.\s*Verification & Running the Lab)\b[\s\S]*?(?=\n##\s+|\s*$)/g, '\n');
        const anchor = `build-file-${buildId}-${filename.replace(/[^\w-]/g, '_')}`;
        html += `<article class="prose" id="${anchor}">` + convertMarkdownToHTML(cleanMd) + '</article>';
      }
    }

    html += `
      </div>

      <div class="build-lab-overlay" id="build-lab-overlay" aria-hidden="true">
        <div id="codelab-mount-${escapeHtml(buildId)}" class="build-lab-overlay__mount" data-build-id="${escapeHtml(buildId)}"></div>
      </div>`;
    return html;
  }


  /**
   * Render YouTube video embed (lazy-loaded)
   */
  function renderVideoEmbed(video) {
    if (!video?.youtubeId) return '';
    return `<div class="video-main" data-video="${escapeHtml(JSON.stringify(video))}">${renderMainVideoInner(video, false)}</div>`;
  }

  // Player + caption for the main video; autoplay loads the iframe straight away (used when swapping in)
  function renderMainVideoInner(video, autoplay) {
    const id = video.youtubeId;
    const player = autoplay
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
      : `<div class="video-embed__placeholder" data-action="load-youtube" data-video-id="${id}">
          <img class="video-embed__thumb" src="https://img.youtube.com/vi/${id}/hqdefault.jpg"
               alt="${escapeHtml(video.title || '')}"
               loading="lazy">
          <div class="video-embed__play-btn">${icons.play}</div>
        </div>`;
    return `
      <div class="video-embed" id="video-${id}">${player}</div>
      ${video.title ? `<div class="video-embed__info">
        <span class="video-embed__channel">${escapeHtml(video.channel || 'YouTube')}</span>
        <span class="video-embed__title">${escapeHtml(video.title)}</span>
        <a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer" style="margin-left:auto; font-size:11px; color:var(--accent,#6366f1); text-decoration:none; display:flex; align-items:center; gap:2px;">
          Watch on YouTube ↗
        </a>
      </div>` : ''}
      ${video.why ? `<p class="video-embed__why">${escapeHtml(video.why)}</p>` : ''}`;
  }

  // Units with a data/archive/<slug>.js file; requesting any other slug 404s. Keep in sync with data/archive/.
  const ARCHIVE_SLUGS = new Set([]);

  const VIDEO_ROLE_LABELS = {
    primary: 'Main pick',
    intro: 'Quick intro',
    'deep-dive': 'Deep dive',
    interview: 'Interview walkthrough',
    'case-study': 'Case study'
  };

  // A card still links to YouTube (ctrl/cmd/middle-click open a tab); a plain click plays it in the main player
  function renderMoreVideoCard(v) {
    return `
      <a class="video-more__card" href="https://www.youtube.com/watch?v=${v.youtubeId}" target="_blank" rel="noopener noreferrer"
         data-action="play-in-main-video" data-video="${escapeHtml(JSON.stringify(v))}"
         title="Play here (Ctrl/⌘-click to open on YouTube)">
        <span class="video-more__thumb">
          <img src="https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg" alt="" loading="lazy">
          <span class="video-more__play">${icons.play}</span>
          ${v.length ? `<span class="video-more__len">${escapeHtml(v.length)}</span>` : ''}
        </span>
        <span class="video-more__meta">
          <span class="video-more__role">${escapeHtml(VIDEO_ROLE_LABELS[v.role] || 'Also watch')}</span>
          <span class="video-more__title">${escapeHtml(v.title || '')}</span>
          <span class="video-more__channel">${escapeHtml(v.channel || 'YouTube')}</span>
          ${v.why ? `<span class="video-more__why">${escapeHtml(v.why)}</span>` : ''}
        </span>
      </a>`;
  }

  /**
   * Render supplementary videos (intro / deep-dive / interview / case-study)
   */
  function renderMoreVideos(videos) {
    if (!Array.isArray(videos) || !videos.length) return '';
    const cards = videos.filter(v => v?.youtubeId).map(renderMoreVideoCard).join('');
    return cards ? `
      <div class="video-more">
        <h2 class="video-more__heading">More videos on this topic</h2>
        <div class="video-more__list">${cards}</div>
      </div>` : '';
  }

  // Swap a card's video into the main player (and the current main video into that card's slot)
  window.playInMainVideo = function(event, card) {
    const next = JSON.parse(card.dataset.video || 'null');
    if (!next) return true;
    if (window.Analytics?.trackVideoPlay) window.Analytics.trackVideoPlay(next.youtubeId, next.title || '');
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1) return true; // let the link open YouTube
    const main = document.querySelector('.video-main');
    if (!main) return true;
    event.preventDefault();
    const prev = JSON.parse(main.dataset.video || 'null');
    main.dataset.video = JSON.stringify(next);
    main.innerHTML = renderMainVideoInner(next, true);
    if (prev) card.outerHTML = renderMoreVideoCard({ ...prev, role: prev.role || 'primary' });
    const top = main.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.6) main.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return false;
  };

  /**
   * Convert basic markdown to HTML
   */
  function convertMarkdownToHTML(md) {
    if (!md) return '';

    // Phase 1: Extract code blocks, mermaid diagrams, inline code spans, and math to protect them from markdown regexes
    const codeBlocks = [];
    const inlineCodes = [];
    const mathSpans = [];
    let html = md
      // Mermaid blocks MUST be replaced before generic code blocks
      .replace(/```mermaid\s*\n([\s\S]*?)```/g, (_, diagram) => {
        const idx = codeBlocks.length;
        codeBlocks.push('<div class="mermaid">' + diagram.trim() + '</div>');
        return '\x00CODEBLOCK_' + idx + '\x00';
      })
      // Code blocks (``` blocks) - handle info strings like title="terminal"
      .replace(/```(\S+)?[^\n]*\n([\s\S]*?)```/g, (_, lang, code) => {
        const idx = codeBlocks.length;
        const cleanLang = (lang || 'text').toLowerCase();
        codeBlocks.push(renderTopicCodeBlock(code.trim(), cleanLang));
        return '\x00CODEBLOCK_' + idx + '\x00';
      })
      // Inline code (`...`) - escape HTML entities inside backticks & protect from markdown regexes
      .replace(/`([^`\n]+)`/g, (_, code) => {
        const idx = inlineCodes.length;
        inlineCodes.push('<code>' + escapeHtml(code) + '</code>');
        return '\x00INLINECODE_' + idx + '\x00';
      })
      // Block math ($$...$$) - protect from markdown asterisks / underscores
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
        const idx = mathSpans.length;
        mathSpans.push({ isBlock: true, math });
        return '\x00MATHSPAN_' + idx + '\x00';
      })
      // Inline math ($...$) - protect from markdown asterisks / underscores
      .replace(/\$([^\$\n\r]+?)\$/g, (_, math) => {
        const idx = mathSpans.length;
        mathSpans.push({ isBlock: false, math });
        return '\x00MATHSPAN_' + idx + '\x00';
      });

    // Phase 2: Process block-level markdown syntax (code blocks & inline code are safely extracted)
    html = html
      // GitHub alerts / blockquote callouts
      .replace(/^>\s*\[!NOTE\]\s*(.*)$/gm, '<div class="callout callout--note"><div class="callout__title">ℹ️ Note</div><p>$1</p></div>')
      .replace(/^>\s*\[!TIP\]\s*(.*)$/gm, '<div class="callout callout--tip"><div class="callout__title">💡 Tip</div><p>$1</p></div>')
      .replace(/^>\s*\[!WARNING\]\s*(.*)$/gm, '<div class="callout callout--warn"><div class="callout__title">⚠️ Warning</div><p>$1</p></div>')
      .replace(/^>\s*\[!IMPORTANT\]\s*(.*)$/gm, '<div class="callout callout--danger"><div class="callout__title">❗ Important</div><p>$1</p></div>')
      .replace(/^>\s*(.*)$/gm, '<blockquote><p>$1</p></blockquote>')
      // Headers
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h2>$1</h2>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr>')
      // Tables
      .replace(/^\|(.+)\|[ \t]*\n\|[-| :]+\|[ \t]*\n((?:\|.+\|[ \t]*(?:\n|$))*)/gm, (_, header, body) => {
        const ths = header.split('|').map(h => '<th>' + h.trim() + '</th>').join('');
        const rows = body.trim().split('\n').map(row => {
          const tds = row.trim().replace(/^\||\|$/g, '').split('|').map(c => '<td>' + c.trim() + '</td>').join('');
          return '<tr>' + tds + '</tr>';
        }).join('');
        return '<table><thead><tr>' + ths + '</tr></thead><tbody>' + rows + '</tbody></table>\n';
      });

    // Phase 3: Process paragraphs and lists (joining hard-wrapped continuation lines cleanly)
    const lines = html.split('\n');
    const processed = [];
    let inList = false;
    let listType = '';
    let openLi = false;
    let paraLines = [];

    function flushPara() {
      if (paraLines.length > 0) {
        processed.push('<p>' + paraLines.join(' ') + '</p>');
        paraLines = [];
      }
    }

    function closeList() {
      if (openLi) {
        processed[processed.length - 1] += '</li>';
        openLi = false;
      }
      if (inList) {
        processed.push('</' + listType + '>');
        inList = false;
        listType = '';
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Extracted code / mermaid block placeholder
      if (line.trim().match(/^\x00CODEBLOCK_\d+\x00$/)) {
        flushPara();
        closeList();
        processed.push(line.trim());
        continue;
      }

      // Skip already-processed block-level HTML tags
      if (line.match(/^<(h[1-6]|table|thead|tbody|tr|th|td|div|pre|hr|ul|ol|li|blockquote)\b/)) {
        flushPara();
        closeList();
        processed.push(line);
        continue;
      }

      // Unordered list item
      if (line.match(/^[-*] /)) {
        flushPara();
        if (!inList || listType !== 'ul') {
          closeList();
          processed.push('<ul>');
          inList = true; listType = 'ul';
        } else if (openLi) {
          processed[processed.length - 1] += '</li>';
          openLi = false;
        }
        processed.push('<li>' + line.replace(/^[-*] /, ''));
        openLi = true;
        continue;
      }

      // Ordered list item
      if (line.match(/^\d+\. /)) {
        flushPara();
        if (!inList || listType !== 'ol') {
          closeList();
          processed.push('<ol>');
          inList = true; listType = 'ol';
        } else if (openLi) {
          processed[processed.length - 1] += '</li>';
          openLi = false;
        }
        processed.push('<li>' + line.replace(/^\d+\. /, ''));
        openLi = true;
        continue;
      }

      // Blank line ends current paragraph or list
      if (line.trim() === '') {
        flushPara();
        closeList();
        continue;
      }

      // Continuation line inside an active list item
      if (inList && openLi) {
        if (line.match(/^\s+[-*] /)) {
          processed[processed.length - 1] += '<br>• ' + line.replace(/^\s+[-*] /, '').trim();
        } else {
          processed[processed.length - 1] += ' ' + line.trim();
        }
        continue;
      }

      // Paragraph line
      paraLines.push(line.trim());
    }

    flushPara();
    closeList();

    // Phase 4: Inline formatting (after multi-line paragraphs and list items are joined) & code restoration
    let out = processed.join('\n')
      // Bold
      .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
      // Links (standard and wiki-style)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\[\[wiki\/([^\]|]+)\|([^\]]+)\]\]/g, '<a href="#" data-nav="topic" data-slug="$1">$2</a>')
      .replace(/\[\[wiki\/([^\]]+)\]\]/g, (_, slug) => '<a href="#" data-nav="topic" data-slug="' + slug + '">' + slug.replace(/-/g, ' ') + '</a>');

    out = out
      .replace(/\x00CODEBLOCK_(\d+)\x00/g, (_, idx) => codeBlocks[parseInt(idx)])
      .replace(/\x00INLINECODE_(\d+)\x00/g, (_, idx) => inlineCodes[parseInt(idx)])
      .replace(/\x00MATHSPAN_(\d+)\x00/g, (_, idx) => {
        const item = mathSpans[parseInt(idx)];
        if (!item) return '';
        return item.isBlock ? `$$${item.math}$$` : `$${item.math}$`;
      });

    return renderMathInHtml(out);
  }

  /**
   * Render fallback content when no detailed content is available
   */
  function renderFallbackContent(unit, mod) {
    const excerpt = unit.archive?.excerpt || '';
    let html = '';

    if (excerpt) {
      html += '<p>' + excerpt + '</p>';
    }

    html += `
      <div class="callout callout--note">
        <div class="callout__title">📚 Content Loading</div>
        <p>Detailed content for this topic is being prepared. In the meantime, explore the module overview and related topics in Module ${mod.number}: ${mod.title}.</p>
      </div>`;

    return html;
  }

  /**
   * Render feedback and report issue bar
   */
  function renderLessonFeedback(slug, unit) {
    const issueTitle = encodeURIComponent(`[Feedback] ${unit.title}`);
    const issueBody = encodeURIComponent(`### Topic: ${unit.title}\n**URL:** https://dsa-in-depth.vedgupta.in/topic/${slug}/\n\n### Feedback / Correction:\n`);
    const issueUrl = `https://github.com/innovatorved/dsa-in-depth/issues/new?title=${issueTitle}&labels=feedback,curriculum&body=${issueBody}`;

    return `
      <div class="lesson-feedback" id="lesson-feedback-${slug}">
        <div class="lesson-feedback__content">
          <div class="lesson-feedback__meta">
            <span class="lesson-feedback__title">Was this lesson helpful?</span>
            <span class="lesson-feedback__sub">Spot an issue or have a suggestion? Let us know on GitHub.</span>
          </div>
          <div class="lesson-feedback__actions">
            <button type="button" class="btn btn--sm btn--outline lesson-feedback__btn" data-action="feedback-vote" data-slug="${slug}" data-vote="yes">
              👍 Helpful
            </button>
            <button type="button" class="btn btn--sm btn--outline lesson-feedback__btn" data-action="feedback-vote" data-slug="${slug}" data-vote="no">
              👎 Needs work
            </button>
            <a href="${issueUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--sm btn--outline lesson-feedback__btn" title="Open an issue on GitHub">
              ${icons.github} Report an issue
            </a>
          </div>
        </div>
      </div>`;
  }

  /**
   * Render prev/next lesson navigation
   */
  function renderLessonNav(currentSlug, currentMod, currentPart) {
    const data = window.CURRICULUM_DATA;
    if (!data) return '';

    // Build flat list of all slugs
    const allUnits = [];
    for (const p of data.parts) {
      for (const m of p.modules) {
        for (const u of m.units) {
          allUnits.push({ slug: u.slug, title: u.title, modTitle: m.title });
        }
      }
    }

    const idx = allUnits.findIndex(u => u.slug === currentSlug);
    if (idx < 0) return '';

    const prev = idx > 0 ? allUnits[idx - 1] : null;
    const next = idx < allUnits.length - 1 ? allUnits[idx + 1] : null;

    let html = '<div class="lesson-nav">';

    if (prev) {
      html += `<a class="lesson-nav__link" href="/topic/${prev.slug}/" data-nav="topic" data-slug="${prev.slug}">
        <span class="lesson-nav__label">← Previous</span>
        <span class="lesson-nav__title">${prev.title}</span>
      </a>`;
    } else {
      html += '<div></div>';
    }

    if (next) {
      html += `<a class="lesson-nav__link lesson-nav__link--next" href="/topic/${next.slug}/" data-nav="topic" data-slug="${next.slug}">
        <span class="lesson-nav__label">Next →</span>
        <span class="lesson-nav__title">${next.title}</span>
      </a>`;
    } else {
      html += '<div></div>';
    }

    html += '</div>';
    return html;
  }

  /**
   * Escape HTML
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Global helper for video loading
  window.loadYouTubeVideo = function(videoId, container) {
    container.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
    if (window.Analytics?.trackVideoPlay) {
      const title = container.parentElement?.querySelector('.video-embed__title')?.textContent || '';
      window.Analytics.trackVideoPlay(videoId, title);
    }
  };

  // Global helper for lesson feedback
  window.handleFeedbackVote = function(btn, slug, vote) {
    const parent = btn.closest('.lesson-feedback__actions');
    if (parent) {
      parent.querySelectorAll('.lesson-feedback__btn').forEach(b => {
        if (b.tagName === 'BUTTON') {
          b.classList.remove('is-voted');
          b.disabled = true;
        }
      });
      btn.classList.add('is-voted');
      btn.textContent = vote === 'yes' ? '✓ Thanks for your feedback!' : '✓ We\'ll improve this!';
    }
    try {
      localStorage.setItem('feedback_' + slug, vote);
    } catch (_) {}
    if (window.Analytics?.trackLessonFeedback) {
      window.Analytics.trackLessonFeedback({ slug, vote });
    } else if (window.Analytics?.trackEvent) {
      window.Analytics.trackEvent('lesson_feedback', {
        topic_slug: slug,
        feedback_vote: vote,
        event_category: 'engagement'
      });
    }
  };

  // Global helpers for audio player
  window.toggleAudio = function(slug) {
    const audio = document.getElementById('audio-' + slug);
    const playIcon = document.getElementById('audio-play-icon-' + slug);
    const pauseIcon = document.getElementById('audio-pause-icon-' + slug);
    if (!audio) return;

    if (audio.paused) {
      // Pause all other audio players
      document.querySelectorAll('audio').forEach(a => {
        if (a !== audio && !a.paused) {
          a.pause();
          const otherSlug = a.id.replace('audio-', '');
          const otherPlay = document.getElementById('audio-play-icon-' + otherSlug);
          const otherPause = document.getElementById('audio-pause-icon-' + otherSlug);
          if (otherPlay) otherPlay.style.display = 'block';
          if (otherPause) otherPause.style.display = 'none';
        }
      });
      window.setupAudioListeners(slug);
      audio.play().then(() => {
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (window.Analytics?.trackAudioPlay) {
          window.Analytics.trackAudioPlay(slug, audio.currentTime);
        }
      }).catch(err => {
        console.warn('Audio playback error:', err);
      });
    } else {
      audio.pause();
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (window.Analytics?.trackAudioPause) {
        window.Analytics.trackAudioPause(slug, audio.currentTime, audio.duration);
      }
    }
  };

  window.seekAudio = function(slug, event) {
    const audio = document.getElementById('audio-' + slug);
    const track = document.getElementById('audio-track-' + slug);
    if (!audio || !track || !audio.duration) return;

    const rect = track.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percent = clickX / rect.width;
    audio.currentTime = percent * audio.duration;
    if (window.Analytics?.trackAudioSeek) {
      window.Analytics.trackAudioSeek(slug, audio.currentTime);
    }
  };

  window.cycleAudioSpeed = function(slug) {
    const audio = document.getElementById('audio-' + slug);
    const btn = document.getElementById('audio-speed-' + slug);
    if (!audio || !btn) return;

    const speeds = [1, 1.25, 1.5, 1.75, 2, 0.75];
    const currentSpeed = audio.playbackRate || 1;
    const nextIndex = (speeds.indexOf(currentSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];

    audio.playbackRate = newSpeed;
    btn.textContent = newSpeed + 'x';
    if (window.Analytics?.trackAudioSpeedChange) {
      window.Analytics.trackAudioSpeedChange(slug, newSpeed);
    }
  };

  window.setupAudioListeners = function(slug) {
    const audio = document.getElementById('audio-' + slug);
    if (!audio || audio._listenersAttached) return;
    audio._listenersAttached = true;

    const bar = document.getElementById('audio-bar-' + slug);
    const timeDisplay = document.getElementById('audio-time-' + slug);
    const playIcon = document.getElementById('audio-play-icon-' + slug);
    const pauseIcon = document.getElementById('audio-pause-icon-' + slug);

    function formatTime(secs) {
      if (isNaN(secs) || !isFinite(secs)) return '0:00';
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    if (audio.duration && isFinite(audio.duration) && timeDisplay) {
      timeDisplay.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
    }

    audio.addEventListener('loadedmetadata', () => {
      if (timeDisplay && audio.duration && isFinite(audio.duration)) {
        timeDisplay.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      if (bar) bar.style.width = pct + '%';
      if (timeDisplay) {
        timeDisplay.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
      }
    });

    audio.addEventListener('ended', () => {
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (bar) bar.style.width = '0%';
      if (timeDisplay) {
        timeDisplay.textContent = '0:00 / ' + formatTime(audio.duration);
      }
      if (window.Analytics?.trackAudioComplete) {
        window.Analytics.trackAudioComplete(slug, audio.duration);
      }
    });
  };

  // Global helper for code copy
  window.copyCode = function(btn) {
    const block = btn.closest('.code-block');
    const code = block?.querySelector('code');
    const filename = block?.querySelector('.code-block__lang')?.textContent || '';
    if (code) {
      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = '✓ Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
        if (window.Analytics?.trackCodeCopy) {
          window.Analytics.trackCodeCopy(filename, '', code.textContent.length);
        }
      });
    }
  };

  /**
   * Render a single Project Card
   */
  function renderProjectCard(project) {
    const isPinned = project.pinned;
    const hasLive = Boolean(project.liveUrl);
    const tagsHtml = (project.tags || []).slice(0, 5).map(t => `<span class="project-card__tag">${escapeHtml(t)}</span>`).join('');
    const safeName = escapeHtml(project.name);

    return `
      <div class="project-card" id="project-${project.id}" data-project-id="${project.id}">
        <div class="project-card__top">
          <div class="project-card__title-group">
            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-card__title-link" aria-label="${safeName} repository" data-repo-placement="card_title">
              <h3 class="project-card__title">${escapeHtml(project.name)}</h3>
            </a>
            ${project.title ? `<span class="project-card__subtitle">· ${escapeHtml(project.title)}</span>` : ''}
            <span class="project-card__lang">
              <span class="project-card__lang-dot" style="background-color: ${project.languageColor || 'var(--accent)'}"></span>
              <span class="project-card__lang-name">${escapeHtml(project.language || 'Code')}</span>
            </span>
          </div>

          <div class="project-card__badges">
            ${project.featuredBadge ? `<span class="project-card__badge project-card__badge--hn">${project.featuredBadge}</span>` : ''}
            ${isPinned ? `<span class="project-card__badge project-card__badge--pinned">${icons.pin} Pinned</span>` : ''}
            ${project.stars ? `<span class="project-card__stars-pill">${icons.star} ${project.stars}</span>` : ''}
          </div>
        </div>

        <p class="project-card__desc">${escapeHtml(project.description)}</p>

        <div class="project-card__footer">
          <div class="project-card__tags">
            ${tagsHtml}
          </div>

          <div class="project-card__actions">
            <button type="button" class="btn btn--sm btn--secondary project-card__btn" data-action="open-repo-codelab" data-repo="${escapeHtml(project.githubRepo || ('innovatorved/' + project.name))}" data-title="${safeName}" title="Clone and explore ${safeName} inside the in-browser CodeLab IDE">
              ${icons.terminal}
              <span>Explore in CodeLab</span>
            </button>
            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--sm btn--secondary project-card__btn" aria-label="${safeName} GitHub repository" data-repo-placement="card_footer_github">
              ${icons.github}
              <span>GitHub</span>
              ${icons.external}
            </a>
            ${hasLive ? `
              <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--sm btn--primary project-card__btn" aria-label="${safeName} live demo" data-repo-placement="card_footer_demo">
                ${icons.globe}
                <span>Live Demo</span>
                ${icons.external}
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render the Dedicated Projects Showcase View
   */
  function renderProjects(selectedId) {
    const projects = window.PROJECTS_DATA || [];
    if (!projects.length) {
      return '<div style="padding: 40px; text-align: center; color: var(--fg-muted);">Loading projects...</div>';
    }

    let html = `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/" data-nav="home">Home</a>
        <span class="breadcrumbs__sep">${icons.chevronRight}</span>
        <span class="breadcrumbs__current">Projects</span>
      </nav>

      <div class="lesson-header">
        <div class="lesson-header__badge">
          <span class="lesson-header__kind lesson-header__kind--build">${icons.code} Open Source</span>
          <span class="tag">${projects.length} Repos</span>
        </div>
        <h1 class="lesson-header__title">DSA &amp; Systems Engineering Projects &amp; Case Studies</h1>
        <div class="lesson-header__actions" style="margin-top: var(--space-3); display: flex; gap: var(--space-3); flex-wrap: wrap;">
          <a href="/" data-nav="home" class="btn btn--sm btn--secondary">← Back to Curriculum</a>
          <a href="https://code-lab-3dr.pages.dev" target="_blank" rel="noopener noreferrer" class="btn btn--sm btn--primary">${icons.code} Launch CodeLab Cloud IDE</a>
        </div>
      </div>

      <div class="projects-grid">
        ${projects.map(p => renderProjectCard(p)).join('')}
      </div>
    `;

    return html;
  }





  /**
   * Render System Design Glossary
   */
  function renderGlossary() {
    const glossary = window.GLOSSARY_DATA || window.GLOSSARY || [];
    let html = `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/" data-nav="home">Home</a>
        <span class="breadcrumbs__sep">${icons.chevronRight}</span>
        <span class="breadcrumbs__current">Glossary</span>
      </nav>

      <div class="lesson-header">
        <div class="lesson-header__badge">
          <span class="lesson-header__kind lesson-header__kind--lesson">Reference</span>
          <span class="tag">${glossary.length} Terms</span>
        </div>
        <h1 class="lesson-header__title">Data Structures &amp; Algorithms Glossary</h1>
        <p class="hero__subtitle" style="margin-top:0.5rem;">Rigorous mathematical, asymptotic, and mechanical definitions across all 18 modules.</p>
        <div style="margin-top:1rem;">
          <input type="text" id="glossary-filter" data-action="filter-glossary" placeholder="Filter terms (e.g. amortized, Red-Black, Dijkstra, suffix)..." style="width:100%; max-width:400px; padding:0.5rem 0.75rem; background:var(--surface); border:1px solid var(--border); border-radius:6px; color:var(--fg); font-size:13px;">
        </div>
      </div>

      <div style="margin-top:1.5rem; display:flex; flex-direction:column; gap:0.75rem;">
    `;

    for (const item of glossary) {
      const defText = item.definition || item.def || '';
      const catText = item.category || item.cat || 'Algorithms';
      const compText = item.complexity ? ` · <code>${escapeHtml(item.complexity)}</code>` : '';
      html += `
        <div class="glossary-item" style="padding:1rem; border:1px solid var(--border); border-radius:6px; background:var(--surface);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem; gap:8px; flex-wrap:wrap;">
            <strong style="font-size:15px; color:var(--fg);">${escapeHtml(item.term)}${compText}</strong>
            <span class="badge badge--secondary" style="font-size:11px;">${escapeHtml(catText)}</span>
          </div>
          <p style="margin:0.25rem 0 0; font-size:13px; color:var(--fg-muted); line-height:1.5;">${escapeHtml(defText)}</p>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }

  /**
   * Render Printable Module Cheat Sheet
   */
  function renderCheatSheet(moduleId) {
    const data = window.CURRICULUM_DATA;
    let targetMod = null;
    if (data) {
      for (const p of data.parts) {
        for (const m of p.modules) {
          if (m.id === moduleId || m.number === moduleId) {
            targetMod = m;
            break;
          }
        }
      }
    }

    if (!targetMod) {
      return '<div style="padding:40px; text-align:center;">Module not found for cheat sheet.</div>';
    }

    const modContent = window.MODULE_CONTENT?.[targetMod.id] || {};

    let html = `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/" data-nav="home">Home</a>
        <span class="breadcrumbs__sep">${icons.chevronRight}</span>
        <a href="#topic/${targetMod.units[0]?.slug}">Module ${targetMod.number}</a>
        <span class="breadcrumbs__sep">${icons.chevronRight}</span>
        <span class="breadcrumbs__current">Cheat Sheet</span>
      </nav>

      <div class="lesson-header">
        <div class="lesson-header__badge">
          <span class="lesson-header__kind lesson-header__kind--lesson">Module ${targetMod.number}</span>
          <span class="tag">Printable</span>
        </div>
        <h1 class="lesson-header__title">${targetMod.title} — Cheat Sheet</h1>
        <p class="hero__subtitle" style="margin-top:0.5rem;">${targetMod.summary}</p>
        <div class="lesson-header__actions" style="margin-top:1rem;">
          <button class="btn btn--sm btn--primary" data-action="window-print">
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>

      <div style="margin-top:1.5rem; display:flex; flex-direction:column; gap:1.5rem;">
    `;

    for (const unit of targetMod.units) {
      const c = modContent[unit.slug];
      const takeaways = c?.keyTakeaways || [];
      html += `
        <div style="padding:1.25rem; border:1px solid var(--border); border-radius:8px; background:var(--surface);">
          <h3 style="font-size:16px; margin:0 0 0.5rem; display:flex; justify-content:space-between;">
            <span>${unit.title}</span>
            <a href="/topic/${unit.slug}/" style="font-size:12px; color:var(--link); text-decoration:none;">View Lesson →</a>
          </h3>
          ${takeaways.length ? `
            <div style="font-size:12px; font-weight:700; color:var(--fg-muted); margin-bottom:0.25rem;">KEY TAKEAWAYS:</div>
            <ul style="margin:0; padding-left:1.25rem; font-size:13px; color:var(--fg-prose); line-height:1.5;">
              ${takeaways.map(t => `<li style="margin-bottom:0.25rem;">${escapeHtml(t)}</li>`).join('')}
            </ul>
          ` : '<p style="font-size:12px; color:var(--fg-muted);">Deep unit content available in lesson.</p>'}
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }

  return {
    renderOverview,
    renderLesson,
    renderBuild,
    renderProjects,
    renderProjectCard,
    renderVideoEmbed,
    renderGlossary,
    renderCheatSheet,
    convertMarkdownToHTML,
    renderTopicCodeBlock,
    renderTopicCodeLabCard,
    escapeHtml,
    icons
  };
})();
