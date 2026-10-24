/**
 * DSA In Depth — Prerequisite DAG, 18-Module Progression & 4 Curated Study Tracks
 * Exposes window.ROADMAP_DATA with stages, nodes, edges, paths, careerPaths, and modules.
 */
(function(root) {
  'use strict';

  var ROADMAP_DATA = {
  "stages": [
    {
      "id": "stage-1",
      "number": 1,
      "trackId": "track-1",
      "title": "Foundations, Memory Hierarchy & Linear Structures",
      "summary": "Asymptotic rigor, Master/Akra-Bazzi recurrences, amortized potential Φ, CPU cache hierarchy, contiguous arrays, two pointers, sliding windows, linked lists, monotonic stacks/deques, and O(1) LRU/LFU caches.",
      "hours": "24 hrs",
      "color": "#3b82f6",
      "unitCount": 30
    },
    {
      "id": "stage-2",
      "number": 2,
      "trackId": "track-2",
      "title": "Hashing, Sorting & Divide-and-Conquer",
      "summary": "Universal & SipHash hashing, Robin Hood & SwissTable SIMD probing, probabilistic sketches (Bloom, CMS, HLL), TimSort/pdqsort, Radix/Quickselect/BFPRT, binary search invariants, FFT, and CDQ divide-and-conquer.",
      "hours": "26 hrs",
      "color": "#06b6d4",
      "unitCount": 30
    },
    {
      "id": "stage-3",
      "number": 3,
      "trackId": "track-3",
      "title": "Trees, Balanced Hierarchies & Range Queries",
      "summary": "Binary tree traversals, Morris threading, d-ary/mergeable heaps, AVL & LLRB trees, Treaps, Splay trees, B+ & LSM trees, Sparse Tables, Fenwick BIT, Lazy/Persistent Segment Trees, Mo's algorithm, LCA, and HLD.",
      "hours": "30 hrs",
      "color": "#10b981",
      "unitCount": 30
    },
    {
      "id": "stage-4",
      "number": 4,
      "trackId": "track-4",
      "title": "Strings, Automata & Information Retrieval",
      "summary": "Radix/PATRICIA & 0-1 XOR tries, Rabin-Karp, KMP, Z-algorithm, Boyer-Moore/SIMD Teddy, Aho-Corasick, Manacher/Eertree, Suffix Trees/Arrays/LCP, Suffix Automaton, BWT/FM-Index, Thompson NFA, and Myers Diff.",
      "hours": "22 hrs",
      "color": "#f59e0b",
      "unitCount": 20
    },
    {
      "id": "stage-5",
      "number": 5,
      "trackId": "track-5",
      "title": "Graph Theory, Shortest Paths & Network Flow",
      "summary": "CSR cache-conscious graphs, 0-1 BFS, DFS edge classification, Kahn/DFS topological sort, Tarjan bridges/SCC/2-SAT, Eulerian trails, DSU + rollback, MST, Dijkstra, A*, Bellman-Ford/Johnson, Contraction Hierarchies, Dinic, Hopcroft-Karp, Hungarian, and MCMF.",
      "hours": "30 hrs",
      "color": "#8b5cf6",
      "unitCount": 30
    },
    {
      "id": "stage-6",
      "number": 6,
      "trackId": "track-6",
      "title": "Dynamic Programming, Combinatorial Search & Advanced Paradigms",
      "summary": "Backtracking, Knuth DLX Exact Cover, Branch-and-Bound, Alpha-Beta, Matroids & Exchange Arguments, Classical/Interval/Tree/DAG DP, Bitmask/SOS/Digit/Plug DP, D&C/Knuth/Li Chao CHT/Aliens optimizations, Geometry, Number Theory, and NP-Completeness.",
      "hours": "38 hrs",
      "color": "#ec4899",
      "unitCount": 40
    }
  ],
  "nodes": [
    {
      "id": "n-ram-cache",
      "label": "RAM Model vs CPU Cache",
      "slug": "ram-model-vs-modern-cpu",
      "stage": 1,
      "trackId": "track-1",
      "moduleId": "m01",
      "type": "simulator",
      "difficulty": "Beginner",
      "x": 140,
      "y": 80,
      "prerequisites": [],
      "description": "64-byte cache lines, spatial/temporal locality, TLB translation, and why pointer chasing loses 20× to contiguous scans."
    },
    {
      "id": "n-asymptotics",
      "label": "Asymptotics & Master Theorem",
      "slug": "recurrence-relations-master-theorem",
      "stage": 1,
      "trackId": "track-1",
      "moduleId": "m01",
      "type": "concept",
      "difficulty": "Beginner",
      "x": 420,
      "y": 80,
      "prerequisites": [
        "n-ram-cache"
      ],
      "description": "Formal O/Ω/Θ bounds, recursion trees, Master Theorem 3 cases, and Akra-Bazzi uneven splits."
    },
    {
      "id": "n-amortized",
      "label": "Amortized Potential (Φ)",
      "slug": "amortized-analysis-potential",
      "stage": 1,
      "trackId": "track-1",
      "moduleId": "m01",
      "type": "concept",
      "difficulty": "Intermediate",
      "x": 700,
      "y": 80,
      "prerequisites": [
        "n-asymptotics"
      ],
      "description": "Aggregate, Banker's accounting, and Physicist's potential Φ(D_i) - Φ(D_{i-1}) proofs."
    },
    {
      "id": "n-dyn-array",
      "label": "Dynamic Arrays &Prefix Sums",
      "slug": "dynamic-arrays-geometric-resizing",
      "stage": 1,
      "trackId": "track-1",
      "moduleId": "m02",
      "type": "simulator",
      "difficulty": "Beginner",
      "x": 180,
      "y": 200,
      "prerequisites": [
        "n-ram-cache",
        "n-amortized"
      ],
      "description": "Geometric 2× vs 1.5× growth, 1D/2D prefix sums, and difference arrays."
    },
    {
      "id": "n-two-pointers",
      "label": "Two Pointers & Sliding Window",
      "slug": "sliding-window-monotonicity",
      "stage": 1,
      "trackId": "track-1",
      "moduleId": "m02",
      "type": "simulator",
      "difficulty": "Beginner",
      "x": 460,
      "y": 200,
      "prerequisites": [
        "n-dyn-array"
      ],
      "description": "Converging pointers, Dutch National Flag, monotonic sliding windows, and Kadane's invariant."
    },
    {
      "id": "n-bit-tricks",
      "label": "Bit Manipulation & Bitsets",
      "slug": "bitsets-word-level-parallelism",
      "stage": 1,
      "trackId": "track-1",
      "moduleId": "m02",
      "type": "build",
      "difficulty": "Intermediate",
      "x": 740,
      "y": 200,
      "prerequisites": [
        "n-dyn-array"
      ],
      "description": "Two's complement, Brian Kernighan x & (x-1), popcount, O(N/64) word-level parallelism, and Circular Deque build."
    },
    {
      "id": "n-linked-lists",
      "label": "Intrusive Lists & Cycle Detection",
      "slug": "floyd-brent-cycle-detection",
      "stage": 1,
      "trackId": "track-1",
      "moduleId": "m03",
      "type": "concept",
      "difficulty": "Beginner",
      "x": 220,
      "y": 320,
      "prerequisites": [
        "n-two-pointers"
      ],
      "description": "Singly/doubly/intrusive lists, Floyd Tortoise-and-Hare, Brent cycle detection, and Skip Lists."
    },
    {
      "id": "n-mono-stack",
      "label": "Monotonic Stack & Deque",
      "slug": "monotonic-deque-sliding-extrema",
      "stage": 1,
      "trackId": "track-1",
      "moduleId": "m03",
      "type": "simulator",
      "difficulty": "Intermediate",
      "x": 500,
      "y": 320,
      "prerequisites": [
        "n-two-pointers"
      ],
      "description": "Next Greater Element, Largest Rectangle in Histogram, and O(N) sliding window min/max."
    },
    {
      "id": "n-lru-lfu",
      "label": "Build: O(1) LRU & LFU Cache",
      "slug": "build-lfu-lru-cache",
      "stage": 1,
      "trackId": "track-1",
      "moduleId": "m03",
      "type": "build",
      "difficulty": "Intermediate",
      "x": 780,
      "y": 320,
      "prerequisites": [
        "n-linked-lists",
        "n-mono-stack"
      ],
      "description": "Composing hash maps with intrusive doubly-linked frequency lists for strict O(1) eviction."
    },
    {
      "id": "n-robin-hood",
      "label": "Robin Hood & SwissTable SIMD",
      "slug": "robin-hood-cuckoo-hashing",
      "stage": 2,
      "trackId": "track-2",
      "moduleId": "m04",
      "type": "simulator",
      "difficulty": "Intermediate",
      "x": 180,
      "y": 460,
      "prerequisites": [
        "n-dyn-array",
        "n-lru-lfu"
      ],
      "description": "Universal hashing, SipHash defense, Robin Hood PSL swapping, Cuckoo hashing, and SwissTable H2 SIMD probing."
    },
    {
      "id": "n-sketches",
      "label": "Bloom, Count-Min & HyperLogLog",
      "slug": "bloom-filters-counting-xor",
      "stage": 2,
      "trackId": "track-2",
      "moduleId": "m04",
      "type": "simulator",
      "difficulty": "Intermediate",
      "x": 480,
      "y": 460,
      "prerequisites": [
        "n-robin-hood"
      ],
      "description": "Sublinear probabilistic membership, frequency estimation, and cardinality sketches."
    },
    {
      "id": "n-build-rh",
      "label": "Build: Robin Hood Hash Map",
      "slug": "build-robin-hood-hash-map",
      "stage": 2,
      "trackId": "track-2",
      "moduleId": "m04",
      "type": "build",
      "difficulty": "Intermediate",
      "x": 760,
      "y": 460,
      "prerequisites": [
        "n-robin-hood"
      ],
      "description": "Open-addressed Robin Hood hash table with tombstone-free backward-shift deletion."
    },
    {
      "id": "n-sorting",
      "label": "Mergesort, 3-Way Quicksort & TimSort",
      "slug": "quicksort-partition-schemes",
      "stage": 2,
      "trackId": "track-2",
      "moduleId": "m05",
      "type": "build",
      "difficulty": "Intermediate",
      "x": 220,
      "y": 580,
      "prerequisites": [
        "n-asymptotics",
        "n-two-pointers"
      ],
      "description": "Inversion counting, Lomuto/Hoare/Dutch-Flag Quicksort, Ω(N log N) decision tree bound, and TimSort/pdqsort."
    },
    {
      "id": "n-radix-select",
      "label": "Radix Sort & BFPRT Quickselect",
      "slug": "quickselect-bfprt-median",
      "stage": 2,
      "trackId": "track-2",
      "moduleId": "m05",
      "type": "concept",
      "difficulty": "Intermediate",
      "x": 520,
      "y": 580,
      "prerequisites": [
        "n-sorting"
      ],
      "description": "LSD/MSD Radix sort, O(N) expected Quickselect, and deterministic Median-of-Medians."
    },
    {
      "id": "n-bsearch",
      "label": "Binary & Parametric Search",
      "slug": "parametric-search-answer-space",
      "stage": 2,
      "trackId": "track-2",
      "moduleId": "m06",
      "type": "concept",
      "difficulty": "Beginner",
      "x": 260,
      "y": 700,
      "prerequisites": [
        "n-sorting"
      ],
      "description": "Half-open boundary invariants, monotonic predicate search, rotated/bitonic search, and Eytzinger layout."
    },
    {
      "id": "n-alg-dc",
      "label": "FFT, Meet-in-Middle & CDQ D&C",
      "slug": "fast-fourier-transform-polynomials",
      "stage": 2,
      "trackId": "track-2",
      "moduleId": "m06",
      "type": "concept",
      "difficulty": "Advanced",
      "x": 640,
      "y": 700,
      "prerequisites": [
        "n-bsearch",
        "n-radix-select"
      ],
      "description": "Closest pair of points, Karatsuba/Strassen, Cooley-Tukey FFT O(N log N) convolution, and CDQ offline D&C."
    },
    {
      "id": "n-bst-morris",
      "label": "Binary Trees, Morris & BSTs",
      "slug": "bst-operations-hibbard-deletion",
      "stage": 3,
      "trackId": "track-3",
      "moduleId": "m07",
      "type": "concept",
      "difficulty": "Beginner",
      "x": 180,
      "y": 840,
      "prerequisites": [
        "n-bsearch",
        "n-linked-lists"
      ],
      "description": "Pre/In/Post/Level traversals, O(1)-space Morris threading, succinct serialization, and Hibbard deletion."
    },
    {
      "id": "n-heaps",
      "label": "d-Ary Heaps, Two Heaps & Timer Wheels",
      "slug": "build-indexed-d-ary-priority-queue",
      "stage": 3,
      "trackId": "track-3",
      "moduleId": "m07",
      "type": "build",
      "difficulty": "Intermediate",
      "x": 480,
      "y": 840,
      "prerequisites": [
        "n-bst-morris"
      ],
      "description": "Floyd O(N) build-heap, Binomial/Fibonacci heaps, K-way merge, and Indexed 4-Ary Priority Queue build."
    },
    {
      "id": "n-avl-llrb",
      "label": "AVL & Left-Leaning Red-Black Trees",
      "slug": "red-black-llrb-isomorphism",
      "stage": 3,
      "trackId": "track-3",
      "moduleId": "m08",
      "type": "simulator",
      "difficulty": "Advanced",
      "x": 200,
      "y": 960,
      "prerequisites": [
        "n-bst-morris"
      ],
      "description": "Tree rotations, 2-3-4 isomorphism, LLRB invariants, and Order-Statistic / Interval Tree augmentation."
    },
    {
      "id": "n-treap-btree",
      "label": "Treaps, Splay, B+ & LSM Trees",
      "slug": "b-trees-bplus-trees-disk-pages",
      "stage": 3,
      "trackId": "track-3",
      "moduleId": "m08",
      "type": "simulator",
      "difficulty": "Advanced",
      "x": 520,
      "y": 960,
      "prerequisites": [
        "n-avl-llrb"
      ],
      "description": "Split/merge Treaps, amortized Splay trees, disk-paged B+ Trees, LSM compaction, and Path-Copying Persistence."
    },
    {
      "id": "n-fenwick-rmq",
      "label": "Sparse Table & Fenwick BIT",
      "slug": "fenwick-tree-binary-indexed",
      "stage": 3,
      "trackId": "track-3",
      "moduleId": "m09",
      "type": "simulator",
      "difficulty": "Intermediate",
      "x": 220,
      "y": 1080,
      "prerequisites": [
        "n-bit-tricks",
        "n-bst-morris"
      ],
      "description": "O(1) idempotent RMQ Sparse Tables and Fenwick lowbit point/range prefix trees."
    },
    {
      "id": "n-segtree",
      "label": "Lazy & Persistent Segment Trees",
      "slug": "build-lazy-segment-tree",
      "stage": 3,
      "trackId": "track-3",
      "moduleId": "m09",
      "type": "build",
      "difficulty": "Advanced",
      "x": 500,
      "y": 1080,
      "prerequisites": [
        "n-fenwick-rmq",
        "n-treap-btree"
      ],
      "description": "Bottom-up ZKW monoid trees, Lazy Propagation, Segment Tree Beats, and Persistent wavelet/subarray quantile trees."
    },
    {
      "id": "n-lca-hld",
      "label": "Mo's Algorithm, LCA & HLD",
      "slug": "heavy-light-decomposition",
      "stage": 3,
      "trackId": "track-3",
      "moduleId": "m09",
      "type": "concept",
      "difficulty": "Staff",
      "x": 780,
      "y": 1080,
      "prerequisites": [
        "n-segtree"
      ],
      "description": "√N Mo's offline ordering, Binary Lifting / Euler-Tour RMQ LCA, and O(log² N) Heavy-Light Decomposition."
    },
    {
      "id": "n-tries-kmp",
      "label": "Radix/XOR Tries, KMP & Z-Algorithm",
      "slug": "kmp-prefix-function-automaton",
      "stage": 4,
      "trackId": "track-4",
      "moduleId": "m10",
      "type": "simulator",
      "difficulty": "Intermediate",
      "x": 200,
      "y": 1220,
      "prerequisites": [
        "n-robin-hood",
        "n-bst-morris"
      ],
      "description": "PATRICIA radix tries, 0-1 bitwise max-XOR tries, Rabin-Karp, KMP π-automaton, and linear Z-boxes."
    },
    {
      "id": "n-aho-corasick",
      "label": "Aho-Corasick, SIMD Teddy & Manacher",
      "slug": "build-aho-corasick-scanner",
      "stage": 4,
      "trackId": "track-4",
      "moduleId": "m10",
      "type": "build",
      "difficulty": "Advanced",
      "x": 520,
      "y": 1220,
      "prerequisites": [
        "n-tries-kmp"
      ],
      "description": "Boyer-Moore Horspool, ripgrep SIMD Teddy, Manacher/Eertree palindromes, and Aho-Corasick multi-pattern build."
    },
    {
      "id": "n-suffix-sa",
      "label": "Suffix Arrays, LCP, SAM & FM-Index",
      "slug": "suffix-arrays-prefix-doubling-sais",
      "stage": 4,
      "trackId": "track-4",
      "moduleId": "m11",
      "type": "simulator",
      "difficulty": "Advanced",
      "x": 240,
      "y": 1340,
      "prerequisites": [
        "n-radix-select",
        "n-aho-corasick"
      ],
      "description": "Ukkonen suffix trees, SA-IS & prefix-doubling Suffix Arrays, Kasai LCP + RMQ, Suffix Automaton, and BWT/FM-Index."
    },
    {
      "id": "n-thompson-diff",
      "label": "Thompson NFA, Myers Diff & DEFLATE",
      "slug": "build-thompson-nfa-regex-engine",
      "stage": 4,
      "trackId": "track-4",
      "moduleId": "m11",
      "type": "build",
      "difficulty": "Advanced",
      "x": 580,
      "y": 1340,
      "prerequisites": [
        "n-suffix-sa"
      ],
      "description": "ReDoS-proof Thompson NFA regex engine, Myers O(ND) Git diff, and Huffman/LZ77 compression."
    },
    {
      "id": "n-bfs-dfs-topo",
      "label": "CSR Graphs, 0-1 BFS & Topological Sort",
      "slug": "topological-sort-kahn-dfs",
      "stage": 5,
      "trackId": "track-5",
      "moduleId": "m12",
      "type": "concept",
      "difficulty": "Intermediate",
      "x": 180,
      "y": 1480,
      "prerequisites": [
        "n-heaps"
      ],
      "description": "Cache-friendly CSR adjacency arrays, 0-1 deque BFS, DFS edge timestamps, and Kahn/DFS DAG ordering."
    },
    {
      "id": "n-tarjan-scc",
      "label": "Bridges, Tarjan SCC & 2-SAT Solver",
      "slug": "build-tarjan-scc-2sat-solver",
      "stage": 5,
      "trackId": "track-5",
      "moduleId": "m12",
      "type": "build",
      "difficulty": "Advanced",
      "x": 500,
      "y": 1480,
      "prerequisites": [
        "n-bfs-dfs-topo"
      ],
      "description": "Articulation points, biconnected components, Kosaraju/Tarjan SCC condensation, 2-SAT, and Hierholzer Eulerian trails."
    },
    {
      "id": "n-dsu-mst",
      "label": "Union-Find (α(N)), Rollback DSU & MST",
      "slug": "disjoint-set-union-ackermann",
      "stage": 5,
      "trackId": "track-5",
      "moduleId": "m13",
      "type": "simulator",
      "difficulty": "Intermediate",
      "x": 200,
      "y": 1600,
      "prerequisites": [
        "n-bfs-dfs-topo"
      ],
      "description": "Inverse-Ackermann DSU, offline Rollback DSU over segment trees, and Kruskal/Prim/Borůvka MST cut-cycle proofs."
    },
    {
      "id": "n-dijkstra-astar",
      "label": "Dijkstra, Bidirectional A* & Contraction",
      "slug": "build-astar-bidirectional-router",
      "stage": 5,
      "trackId": "track-5",
      "moduleId": "m13",
      "type": "build",
      "difficulty": "Advanced",
      "x": 540,
      "y": 1600,
      "prerequisites": [
        "n-heaps",
        "n-dsu-mst"
      ],
      "description": "Dijkstra relaxation, admissible/consistent A* potentials, Bellman-Ford/Johnson APSP, and OSRM Contraction Hierarchies."
    },
    {
      "id": "n-maxflow-dinic",
      "label": "Max-Flow Min-Cut & Dinic Blocking Flow",
      "slug": "build-dinic-max-flow-engine",
      "stage": 5,
      "trackId": "track-5",
      "moduleId": "m14",
      "type": "build",
      "difficulty": "Staff",
      "x": 260,
      "y": 1720,
      "prerequisites": [
        "n-dijkstra-astar",
        "n-tarjan-scc"
      ],
      "description": "Residual graphs, Ford-Fulkerson, Edmonds-Karp, Push-Relabel, and Dinic O(E √V) level-graph blocking flow."
    },
    {
      "id": "n-matching-mcmf",
      "label": "Hopcroft-Karp, Hungarian & MCMF",
      "slug": "min-cost-max-flow-mcmf",
      "stage": 5,
      "trackId": "track-5",
      "moduleId": "m14",
      "type": "concept",
      "difficulty": "Staff",
      "x": 600,
      "y": 1720,
      "prerequisites": [
        "n-maxflow-dinic"
      ],
      "description": "König/Hall theorems, Kuhn-Munkres Hungarian assignment, Johnson-potential MCMF, and Project Selection min-cut."
    },
    {
      "id": "n-dlx-search",
      "label": "Backtracking, Knuth DLX & Alpha-Beta",
      "slug": "build-dancing-links-exact-cover",
      "stage": 6,
      "trackId": "track-6",
      "moduleId": "m15",
      "type": "build",
      "difficulty": "Advanced",
      "x": 180,
      "y": 1860,
      "prerequisites": [
        "n-tarjan-scc"
      ],
      "description": "Permutations/Gray codes, Algorithm X with Dancing Links (DLX), Branch-and-Bound, Alpha-Beta Zobrist, and CDCL SAT."
    },
    {
      "id": "n-greedy-matroids",
      "label": "Greedy Exchange Arguments & Matroids",
      "slug": "matroids-greedy-foundations",
      "stage": 6,
      "trackId": "track-6",
      "moduleId": "m15",
      "type": "concept",
      "difficulty": "Intermediate",
      "x": 520,
      "y": 1860,
      "prerequisites": [
        "n-dsu-mst"
      ],
      "description": "Greedy stays ahead, exchange arguments, Graphic/Linear Matroids, and Regret Greedy with heap rollback."
    },
    {
      "id": "n-dp-classical",
      "label": "Knapsack, LIS, LCS & Space-Rolling DP",
      "slug": "knapsack-family-01-unbounded-bounded",
      "stage": 6,
      "trackId": "track-6",
      "moduleId": "m16",
      "type": "simulator",
      "difficulty": "Intermediate",
      "x": 200,
      "y": 1980,
      "prerequisites": [
        "n-bsearch",
        "n-greedy-matroids"
      ],
      "description": "SRTBOT DAG framework, 0/1 & Bounded Knapsack (monotonic queue), O(N log N) Patience LIS, and Hirschberg linear-space diff."
    },
    {
      "id": "n-dp-tree-dag",
      "label": "Interval DP, Tree Rerooting & Knuth-Plass",
      "slug": "tree-dp-rerooting-technique",
      "stage": 6,
      "trackId": "track-6",
      "moduleId": "m16",
      "type": "concept",
      "difficulty": "Advanced",
      "x": 540,
      "y": 1980,
      "prerequisites": [
        "n-dp-classical",
        "n-lca-hld"
      ],
      "description": "Matrix chain triangulation, O(N²) subtree knapsack proof, all-roots tree rerooting, and Knuth-Plass line breaking."
    },
    {
      "id": "n-dp-bitmask-sos",
      "label": "Bitmask TSP, SOS DP (FWHT) & Digit DP",
      "slug": "sos-dp-fast-zeta-mobius",
      "stage": 6,
      "trackId": "track-6",
      "moduleId": "m17",
      "type": "simulator",
      "difficulty": "Advanced",
      "x": 200,
      "y": 2100,
      "prerequisites": [
        "n-bit-tricks",
        "n-dp-classical"
      ],
      "description": "Held-Karp O(N² 2^N) TSP, O(3^N) submask DP, Sum Over Subsets (Zeta/Möbius), Digit DP, and Broken-Profile DP."
    },
    {
      "id": "n-dp-cht-aliens",
      "label": "D&C, Knuth, Li Chao CHT & Aliens Trick",
      "slug": "build-li-chao-convex-hull-dp",
      "stage": 6,
      "trackId": "track-6",
      "moduleId": "m17",
      "type": "build",
      "difficulty": "Staff",
      "x": 560,
      "y": 2100,
      "prerequisites": [
        "n-dp-tree-dag",
        "n-dp-bitmask-sos"
      ],
      "description": "Monge Quadrangle Inequality D&C DP, Knuth O(N²) optimization, Li Chao Segment Tree CHT, WQS Binary Search, and Tropical Matrices."
    },
    {
      "id": "n-geometry-kd",
      "label": "Convex Hull, Sweep-Line & k-d Tree Build",
      "slug": "build-kd-tree-nearest-neighbor",
      "stage": 6,
      "trackId": "track-6",
      "moduleId": "m18",
      "type": "build",
      "difficulty": "Advanced",
      "x": 240,
      "y": 2220,
      "prerequisites": [
        "n-segtree",
        "n-alg-dc"
      ],
      "description": "CCW orientation predicates, Andrew Monotone Chain + Rotating Calipers, Bentley-Ottmann sweep-line, and k-d Tree KNN."
    },
    {
      "id": "n-num-np-approx",
      "label": "Miller-Rabin, Karger Min-Cut & NP-Hardness",
      "slug": "np-completeness-reductions",
      "stage": 6,
      "trackId": "track-6",
      "moduleId": "m18",
      "type": "milestone",
      "difficulty": "Staff",
      "x": 600,
      "y": 2220,
      "prerequisites": [
        "n-geometry-kd",
        "n-dp-cht-aliens",
        "n-matching-mcmf"
      ],
      "description": "Extended GCD/CRT, Miller-Rabin & Pollard-ρ, Karger randomized min-cut, Cook-Levin 3-SAT reductions, and FPTAS approximation."
    }
  ],
  "edges": [
    {
      "id": "e-n-ram-cache-n-asymptotics",
      "source": "n-ram-cache",
      "target": "n-asymptotics",
      "label": "requires"
    },
    {
      "id": "e-n-asymptotics-n-amortized",
      "source": "n-asymptotics",
      "target": "n-amortized",
      "label": "requires"
    },
    {
      "id": "e-n-ram-cache-n-dyn-array",
      "source": "n-ram-cache",
      "target": "n-dyn-array",
      "label": "requires"
    },
    {
      "id": "e-n-amortized-n-dyn-array",
      "source": "n-amortized",
      "target": "n-dyn-array",
      "label": "requires"
    },
    {
      "id": "e-n-dyn-array-n-two-pointers",
      "source": "n-dyn-array",
      "target": "n-two-pointers",
      "label": "requires"
    },
    {
      "id": "e-n-dyn-array-n-bit-tricks",
      "source": "n-dyn-array",
      "target": "n-bit-tricks",
      "label": "requires"
    },
    {
      "id": "e-n-two-pointers-n-linked-lists",
      "source": "n-two-pointers",
      "target": "n-linked-lists",
      "label": "requires"
    },
    {
      "id": "e-n-two-pointers-n-mono-stack",
      "source": "n-two-pointers",
      "target": "n-mono-stack",
      "label": "requires"
    },
    {
      "id": "e-n-linked-lists-n-lru-lfu",
      "source": "n-linked-lists",
      "target": "n-lru-lfu",
      "label": "requires"
    },
    {
      "id": "e-n-mono-stack-n-lru-lfu",
      "source": "n-mono-stack",
      "target": "n-lru-lfu",
      "label": "requires"
    },
    {
      "id": "e-n-dyn-array-n-robin-hood",
      "source": "n-dyn-array",
      "target": "n-robin-hood",
      "label": "requires"
    },
    {
      "id": "e-n-lru-lfu-n-robin-hood",
      "source": "n-lru-lfu",
      "target": "n-robin-hood",
      "label": "requires"
    },
    {
      "id": "e-n-robin-hood-n-sketches",
      "source": "n-robin-hood",
      "target": "n-sketches",
      "label": "requires"
    },
    {
      "id": "e-n-robin-hood-n-build-rh",
      "source": "n-robin-hood",
      "target": "n-build-rh",
      "label": "requires"
    },
    {
      "id": "e-n-asymptotics-n-sorting",
      "source": "n-asymptotics",
      "target": "n-sorting",
      "label": "requires"
    },
    {
      "id": "e-n-two-pointers-n-sorting",
      "source": "n-two-pointers",
      "target": "n-sorting",
      "label": "requires"
    },
    {
      "id": "e-n-sorting-n-radix-select",
      "source": "n-sorting",
      "target": "n-radix-select",
      "label": "requires"
    },
    {
      "id": "e-n-sorting-n-bsearch",
      "source": "n-sorting",
      "target": "n-bsearch",
      "label": "requires"
    },
    {
      "id": "e-n-bsearch-n-alg-dc",
      "source": "n-bsearch",
      "target": "n-alg-dc",
      "label": "requires"
    },
    {
      "id": "e-n-radix-select-n-alg-dc",
      "source": "n-radix-select",
      "target": "n-alg-dc",
      "label": "requires"
    },
    {
      "id": "e-n-bsearch-n-bst-morris",
      "source": "n-bsearch",
      "target": "n-bst-morris",
      "label": "requires"
    },
    {
      "id": "e-n-linked-lists-n-bst-morris",
      "source": "n-linked-lists",
      "target": "n-bst-morris",
      "label": "requires"
    },
    {
      "id": "e-n-bst-morris-n-heaps",
      "source": "n-bst-morris",
      "target": "n-heaps",
      "label": "requires"
    },
    {
      "id": "e-n-bst-morris-n-avl-llrb",
      "source": "n-bst-morris",
      "target": "n-avl-llrb",
      "label": "requires"
    },
    {
      "id": "e-n-avl-llrb-n-treap-btree",
      "source": "n-avl-llrb",
      "target": "n-treap-btree",
      "label": "requires"
    },
    {
      "id": "e-n-bit-tricks-n-fenwick-rmq",
      "source": "n-bit-tricks",
      "target": "n-fenwick-rmq",
      "label": "requires"
    },
    {
      "id": "e-n-bst-morris-n-fenwick-rmq",
      "source": "n-bst-morris",
      "target": "n-fenwick-rmq",
      "label": "requires"
    },
    {
      "id": "e-n-fenwick-rmq-n-segtree",
      "source": "n-fenwick-rmq",
      "target": "n-segtree",
      "label": "requires"
    },
    {
      "id": "e-n-treap-btree-n-segtree",
      "source": "n-treap-btree",
      "target": "n-segtree",
      "label": "requires"
    },
    {
      "id": "e-n-segtree-n-lca-hld",
      "source": "n-segtree",
      "target": "n-lca-hld",
      "label": "requires"
    },
    {
      "id": "e-n-robin-hood-n-tries-kmp",
      "source": "n-robin-hood",
      "target": "n-tries-kmp",
      "label": "requires"
    },
    {
      "id": "e-n-bst-morris-n-tries-kmp",
      "source": "n-bst-morris",
      "target": "n-tries-kmp",
      "label": "requires"
    },
    {
      "id": "e-n-tries-kmp-n-aho-corasick",
      "source": "n-tries-kmp",
      "target": "n-aho-corasick",
      "label": "requires"
    },
    {
      "id": "e-n-radix-select-n-suffix-sa",
      "source": "n-radix-select",
      "target": "n-suffix-sa",
      "label": "requires"
    },
    {
      "id": "e-n-aho-corasick-n-suffix-sa",
      "source": "n-aho-corasick",
      "target": "n-suffix-sa",
      "label": "requires"
    },
    {
      "id": "e-n-suffix-sa-n-thompson-diff",
      "source": "n-suffix-sa",
      "target": "n-thompson-diff",
      "label": "requires"
    },
    {
      "id": "e-n-heaps-n-bfs-dfs-topo",
      "source": "n-heaps",
      "target": "n-bfs-dfs-topo",
      "label": "requires"
    },
    {
      "id": "e-n-bfs-dfs-topo-n-tarjan-scc",
      "source": "n-bfs-dfs-topo",
      "target": "n-tarjan-scc",
      "label": "requires"
    },
    {
      "id": "e-n-bfs-dfs-topo-n-dsu-mst",
      "source": "n-bfs-dfs-topo",
      "target": "n-dsu-mst",
      "label": "requires"
    },
    {
      "id": "e-n-heaps-n-dijkstra-astar",
      "source": "n-heaps",
      "target": "n-dijkstra-astar",
      "label": "requires"
    },
    {
      "id": "e-n-dsu-mst-n-dijkstra-astar",
      "source": "n-dsu-mst",
      "target": "n-dijkstra-astar",
      "label": "requires"
    },
    {
      "id": "e-n-dijkstra-astar-n-maxflow-dinic",
      "source": "n-dijkstra-astar",
      "target": "n-maxflow-dinic",
      "label": "requires"
    },
    {
      "id": "e-n-tarjan-scc-n-maxflow-dinic",
      "source": "n-tarjan-scc",
      "target": "n-maxflow-dinic",
      "label": "requires"
    },
    {
      "id": "e-n-maxflow-dinic-n-matching-mcmf",
      "source": "n-maxflow-dinic",
      "target": "n-matching-mcmf",
      "label": "requires"
    },
    {
      "id": "e-n-tarjan-scc-n-dlx-search",
      "source": "n-tarjan-scc",
      "target": "n-dlx-search",
      "label": "requires"
    },
    {
      "id": "e-n-dsu-mst-n-greedy-matroids",
      "source": "n-dsu-mst",
      "target": "n-greedy-matroids",
      "label": "requires"
    },
    {
      "id": "e-n-bsearch-n-dp-classical",
      "source": "n-bsearch",
      "target": "n-dp-classical",
      "label": "requires"
    },
    {
      "id": "e-n-greedy-matroids-n-dp-classical",
      "source": "n-greedy-matroids",
      "target": "n-dp-classical",
      "label": "requires"
    },
    {
      "id": "e-n-dp-classical-n-dp-tree-dag",
      "source": "n-dp-classical",
      "target": "n-dp-tree-dag",
      "label": "requires"
    },
    {
      "id": "e-n-lca-hld-n-dp-tree-dag",
      "source": "n-lca-hld",
      "target": "n-dp-tree-dag",
      "label": "requires"
    },
    {
      "id": "e-n-bit-tricks-n-dp-bitmask-sos",
      "source": "n-bit-tricks",
      "target": "n-dp-bitmask-sos",
      "label": "requires"
    },
    {
      "id": "e-n-dp-classical-n-dp-bitmask-sos",
      "source": "n-dp-classical",
      "target": "n-dp-bitmask-sos",
      "label": "requires"
    },
    {
      "id": "e-n-dp-tree-dag-n-dp-cht-aliens",
      "source": "n-dp-tree-dag",
      "target": "n-dp-cht-aliens",
      "label": "requires"
    },
    {
      "id": "e-n-dp-bitmask-sos-n-dp-cht-aliens",
      "source": "n-dp-bitmask-sos",
      "target": "n-dp-cht-aliens",
      "label": "requires"
    },
    {
      "id": "e-n-segtree-n-geometry-kd",
      "source": "n-segtree",
      "target": "n-geometry-kd",
      "label": "requires"
    },
    {
      "id": "e-n-alg-dc-n-geometry-kd",
      "source": "n-alg-dc",
      "target": "n-geometry-kd",
      "label": "requires"
    },
    {
      "id": "e-n-geometry-kd-n-num-np-approx",
      "source": "n-geometry-kd",
      "target": "n-num-np-approx",
      "label": "requires"
    },
    {
      "id": "e-n-dp-cht-aliens-n-num-np-approx",
      "source": "n-dp-cht-aliens",
      "target": "n-num-np-approx",
      "label": "requires"
    },
    {
      "id": "e-n-matching-mcmf-n-num-np-approx",
      "source": "n-matching-mcmf",
      "target": "n-num-np-approx",
      "label": "requires"
    }
  ],
  "paths": [
    {
      "id": "foundations-45",
      "title": "Core Foundations & Linear/Tree Mechanics (45 Units)",
      "role": "CS Fundamentals & Core Engineering",
      "targetRole": "Software Engineer (L3/L4)",
      "estimatedWeeks": 6,
      "estimatedHours": "45 hrs",
      "difficulty": "Beginner → Intermediate",
      "xpReward": 2250,
      "icon": "compass",
      "tagline": "Master asymptotic analysis, hardware cache lines, arrays, pointers, hash tables, sorting, trees, graphs, and DP fundamentals.",
      "description": "A tightly sequenced 45-unit foundation covering the essential data structures and algorithmic proof techniques every software engineer needs before tackling advanced systems or competitive problems.",
      "unitCount": 45,
      "unitSlugs": [
        "ram-model-vs-modern-cpu",
        "asymptotic-notations-rigor",
        "recurrence-relations-master-theorem",
        "amortized-analysis-potential",
        "space-complexity-stack-frames",
        "dynamic-arrays-geometric-resizing",
        "prefix-sums-difference-arrays",
        "two-pointers-invariant-proofs",
        "sliding-window-monotonicity",
        "kadane-subarray-invariants",
        "singly-doubly-intrusive-lists",
        "floyd-brent-cycle-detection",
        "stacks-expression-evaluation",
        "monotonic-stack-next-greater",
        "lru-lfu-eviction-structures",
        "universal-k-independent-hashing",
        "separate-chaining-vs-open-addressing",
        "bloom-filters-counting-xor",
        "quadratic-sorts-inversions",
        "mergesort-bottom-up-inversions",
        "quicksort-partition-schemes",
        "counting-radix-bucket-sorts",
        "binary-search-boundary-invariants",
        "parametric-search-answer-space",
        "rotated-bitonic-unbounded-search",
        "tree-representations-traversals",
        "bst-operations-hibbard-deletion",
        "binary-d-ary-heaps",
        "two-heaps-k-way-merge-patterns",
        "tree-rotations-avl-invariants",
        "red-black-llrb-isomorphism",
        "fenwick-tree-binary-indexed",
        "segment-trees-bottom-up-monoids",
        "tries-radix-trees-patricia",
        "kmp-prefix-function-automaton",
        "graph-representations-csr-cache",
        "bfs-01-bfs-multi-source",
        "topological-sort-kahn-dfs",
        "disjoint-set-union-ackermann",
        "mst-cut-cycle-properties",
        "dijkstra-relaxation-invariants",
        "backtracking-state-space-trees",
        "greedy-choice-exchange-arguments",
        "dp-optimal-substructure-dag",
        "memoization-tabulation-space-rolling"
      ],
      "steps": [
        {
          "type": "topic",
          "slug": "ram-model-vs-modern-cpu",
          "id": "ram-model-vs-modern-cpu",
          "title": "1.1: The RAM Model vs Modern CPU Cache Hierarchy"
        },
        {
          "type": "topic",
          "slug": "asymptotic-notations-rigor",
          "id": "asymptotic-notations-rigor",
          "title": "1.1: Asymptotic Notation Rigor: O, Ω, Θ, o, ω & Limit Laws"
        },
        {
          "type": "topic",
          "slug": "recurrence-relations-master-theorem",
          "id": "recurrence-relations-master-theorem",
          "title": "1.1: Solving Recurrences: Recursion Trees, Substitution & Master Theorem"
        },
        {
          "type": "topic",
          "slug": "amortized-analysis-potential",
          "id": "amortized-analysis-potential",
          "title": "1.1: Amortized Analysis: Aggregate, Banker's & Physicist's Potential (Φ)"
        },
        {
          "type": "topic",
          "slug": "space-complexity-stack-frames",
          "id": "space-complexity-stack-frames",
          "title": "1.1: Space Complexity: Call Stacks, Tail Recursion & Auxiliary Heap"
        },
        {
          "type": "topic",
          "slug": "dynamic-arrays-geometric-resizing",
          "id": "dynamic-arrays-geometric-resizing",
          "title": "1.2: Dynamic Arrays: Geometric Growth Factors (2× vs 1.5×) & Memory Reuse"
        },
        {
          "type": "topic",
          "slug": "prefix-sums-difference-arrays",
          "id": "prefix-sums-difference-arrays",
          "title": "1.2: 1D/2D Prefix Sums & Difference Arrays for O(1) Range Updates"
        },
        {
          "type": "topic",
          "slug": "two-pointers-invariant-proofs",
          "id": "two-pointers-invariant-proofs",
          "title": "1.2: Two-Pointer Invariants: Converging, Fast-Slow & Dutch National Flag"
        },
        {
          "type": "topic",
          "slug": "sliding-window-monotonicity",
          "id": "sliding-window-monotonicity",
          "title": "1.2: Fixed & Variable Sliding Windows: Monotonicity & Two-Pointer Validity"
        },
        {
          "type": "topic",
          "slug": "kadane-subarray-invariants",
          "id": "kadane-subarray-invariants",
          "title": "1.2: Maximum Subarray (Kadane's Algorithm) & Circular Array Extensions"
        },
        {
          "type": "topic",
          "slug": "singly-doubly-intrusive-lists",
          "id": "singly-doubly-intrusive-lists",
          "title": "1.3: Singly, Doubly & Intrusive Linked Lists (Linux Kernel list_head)"
        },
        {
          "type": "topic",
          "slug": "floyd-brent-cycle-detection",
          "id": "floyd-brent-cycle-detection",
          "title": "1.3: Pointer Chasing: Floyd's Tortoise-and-Hare vs Brent's Cycle Detection"
        },
        {
          "type": "topic",
          "slug": "stacks-expression-evaluation",
          "id": "stacks-expression-evaluation",
          "title": "1.3: Call Stacks, Dijkstra's Shunting-Yard Algorithm & AST Evaluation"
        },
        {
          "type": "topic",
          "slug": "monotonic-stack-next-greater",
          "id": "monotonic-stack-next-greater",
          "title": "1.3: Monotonic Stacks: Next Greater Element, Histogram & Subarray Mins"
        },
        {
          "type": "topic",
          "slug": "lru-lfu-eviction-structures",
          "id": "lru-lfu-eviction-structures",
          "title": "1.3: Composing Hash Maps + Doubly Linked Lists: O(1) LRU & LFU Caches"
        },
        {
          "type": "topic",
          "slug": "universal-k-independent-hashing",
          "id": "universal-k-independent-hashing",
          "title": "2.1: Hash Functions: Division, Multiplicative, Universal & k-Independent Families"
        },
        {
          "type": "topic",
          "slug": "separate-chaining-vs-open-addressing",
          "id": "separate-chaining-vs-open-addressing",
          "title": "2.1: Collision Resolution: Separate Chaining vs Linear/Quadratic/Double Probing"
        },
        {
          "type": "topic",
          "slug": "bloom-filters-counting-xor",
          "id": "bloom-filters-counting-xor",
          "title": "2.1: Bloom Filters, Counting Bloom Filters, Cuckoo Filters & Xor Filters"
        },
        {
          "type": "topic",
          "slug": "quadratic-sorts-inversions",
          "id": "quadratic-sorts-inversions",
          "title": "2.2: Insertion, Selection & Shellsort: Inversions & Diminishing Increments"
        },
        {
          "type": "topic",
          "slug": "mergesort-bottom-up-inversions",
          "id": "mergesort-bottom-up-inversions",
          "title": "2.2: Top-Down vs Bottom-Up Merge Sort & Counting Inversions in O(N log N)"
        },
        {
          "type": "topic",
          "slug": "quicksort-partition-schemes",
          "id": "quicksort-partition-schemes",
          "title": "2.2: Quicksort: Lomuto vs Hoare vs Bentley-McIlroy 3-Way Partitioning"
        },
        {
          "type": "topic",
          "slug": "counting-radix-bucket-sorts",
          "id": "counting-radix-bucket-sorts",
          "title": "2.2: Non-Comparison Sorts: Counting Sort, LSD/MSD Radix Sort & Bucket Sort"
        },
        {
          "type": "topic",
          "slug": "binary-search-boundary-invariants",
          "id": "binary-search-boundary-invariants",
          "title": "2.3: Closed vs Half-Open Binary Search: Eliminating Off-by-One Infinite Loops"
        },
        {
          "type": "topic",
          "slug": "parametric-search-answer-space",
          "id": "parametric-search-answer-space",
          "title": "2.3: Parametric Search: Binary Searching the Answer Space & Feasibility Predicates"
        },
        {
          "type": "topic",
          "slug": "rotated-bitonic-unbounded-search",
          "id": "rotated-bitonic-unbounded-search",
          "title": "2.3: Exponential (Galloping) Search, Rotated Arrays & Ternary Search on Unimodal Functions"
        },
        {
          "type": "topic",
          "slug": "tree-representations-traversals",
          "id": "tree-representations-traversals",
          "title": "3.1: Tree Representations & Recursive vs Iterative Pre/In/Post/Level-Order Traversals"
        },
        {
          "type": "topic",
          "slug": "bst-operations-hibbard-deletion",
          "id": "bst-operations-hibbard-deletion",
          "title": "3.1: Binary Search Trees: Search, Insertion, Successor & Hibbard Deletion Asymmetry"
        },
        {
          "type": "topic",
          "slug": "binary-d-ary-heaps",
          "id": "binary-d-ary-heaps",
          "title": "3.1: Binary & d-ary Heaps: Floyd's O(N) Bottom-Up Build-Heap Proof"
        },
        {
          "type": "topic",
          "slug": "two-heaps-k-way-merge-patterns",
          "id": "two-heaps-k-way-merge-patterns",
          "title": "3.1: Priority Queue Patterns: Running Median (Two Heaps), K-Way Merge & Top-K"
        },
        {
          "type": "topic",
          "slug": "tree-rotations-avl-invariants",
          "id": "tree-rotations-avl-invariants",
          "title": "3.2: Tree Rotations & AVL Trees: Balance Factors, LL/RR/LR/RL Rebalancing & Fibonacci Height Bound"
        },
        {
          "type": "topic",
          "slug": "red-black-llrb-isomorphism",
          "id": "red-black-llrb-isomorphism",
          "title": "3.2: 2-3-4 Trees, Red-Black Trees & Sedgewick's Left-Leaning Red-Black (LLRB) Isomorphism"
        },
        {
          "type": "topic",
          "slug": "fenwick-tree-binary-indexed",
          "id": "fenwick-tree-binary-indexed",
          "title": "3.3: Fenwick Trees (Binary Indexed Trees): lowbit Geometry, Point Updates & Range Updates"
        },
        {
          "type": "topic",
          "slug": "segment-trees-bottom-up-monoids",
          "id": "segment-trees-bottom-up-monoids",
          "title": "3.3: Segment Trees over Monoids: Recursive vs Iterative (ZKW) Bottom-Up Implementation"
        },
        {
          "type": "topic",
          "slug": "tries-radix-trees-patricia",
          "id": "tries-radix-trees-patricia",
          "title": "4.1: Prefix Tries, Compressed Radix Trees & PATRICIA Trees"
        },
        {
          "type": "topic",
          "slug": "kmp-prefix-function-automaton",
          "id": "kmp-prefix-function-automaton",
          "title": "4.1: Knuth-Morris-Pratt (KMP): Prefix Function π[i] Amortized Linearity & DFA View"
        },
        {
          "type": "topic",
          "slug": "graph-representations-csr-cache",
          "id": "graph-representations-csr-cache",
          "title": "5.1: Graph Representations: Adjacency Lists, Bit Matrices & Compressed Sparse Row (CSR)"
        },
        {
          "type": "topic",
          "slug": "bfs-01-bfs-multi-source",
          "id": "bfs-01-bfs-multi-source",
          "title": "5.1: Breadth-First Search: Multi-Source BFS, 0-1 BFS (Deque) & Bidirectional Search"
        },
        {
          "type": "topic",
          "slug": "topological-sort-kahn-dfs",
          "id": "topological-sort-kahn-dfs",
          "title": "5.1: Directed Acyclic Graphs (DAGs): Kahn's Indegree Queue vs DFS Post-Order Reversal"
        },
        {
          "type": "topic",
          "slug": "disjoint-set-union-ackermann",
          "id": "disjoint-set-union-ackermann",
          "title": "5.2: Disjoint Set Union (Union-Find): Union by Rank + Path Compression & O(α(N)) Proof Intuition"
        },
        {
          "type": "topic",
          "slug": "mst-cut-cycle-properties",
          "id": "mst-cut-cycle-properties",
          "title": "5.2: Minimum Spanning Trees: Cut & Cycle Optimality Properties, Kruskal's, Prim's & Borůvka's"
        },
        {
          "type": "topic",
          "slug": "dijkstra-relaxation-invariants",
          "id": "dijkstra-relaxation-invariants",
          "title": "5.2: Dijkstra's Algorithm: Non-Negative Edge Invariant, Priority Queue Tradeoffs & Dial's Bucket Queue"
        },
        {
          "type": "topic",
          "slug": "backtracking-state-space-trees",
          "id": "backtracking-state-space-trees",
          "title": "6.1: Backtracking Architecture: Choice, Constraint, Undo & Symmetry-Breaking Pruning"
        },
        {
          "type": "topic",
          "slug": "greedy-choice-exchange-arguments",
          "id": "greedy-choice-exchange-arguments",
          "title": "6.1: Proving Greedy Correctness: Greedy Stays Ahead & Exchange Arguments (Interval Scheduling, Minimizing Lateness)"
        },
        {
          "type": "topic",
          "slug": "dp-optimal-substructure-dag",
          "id": "dp-optimal-substructure-dag",
          "title": "6.2: Dynamic Programming as Shortest Paths on an Implicit DAG: Optimal Substructure & SRTBOT Framework"
        },
        {
          "type": "topic",
          "slug": "memoization-tabulation-space-rolling",
          "id": "memoization-tabulation-space-rolling",
          "title": "6.2: Top-Down Memoization vs Bottom-Up Tabulation & Rolling-Array Space Compression"
        }
      ]
    },
    {
      "id": "interview-75",
      "title": "High-Signal Coding Interview Mastery (75 Units)",
      "role": "Senior / Staff Algorithmic Interviews",
      "targetRole": "Senior Software Engineer (L5/L6)",
      "estimatedWeeks": 8,
      "estimatedHours": "75 hrs",
      "difficulty": "Intermediate → Advanced",
      "xpReward": 4000,
      "icon": "target",
      "tagline": "75 highest-leverage algorithmic invariants: sliding windows, monotonic stacks, LLRB/heaps, tries, Tarjan/Dijkstra, and DP archetypes.",
      "description": "Eliminates rote memorization by organizing the 75 highest-signal interview topics around formal loop invariants, monotonic predicates, state-space graphs, and from-scratch browser coding labs.",
      "unitCount": 75,
      "unitSlugs": [
        "asymptotic-notations-rigor",
        "recurrence-relations-master-theorem",
        "amortized-analysis-potential",
        "complexity-tradeoff-framework",
        "dynamic-arrays-geometric-resizing",
        "prefix-sums-difference-arrays",
        "two-pointers-invariant-proofs",
        "sliding-window-monotonicity",
        "kadane-subarray-invariants",
        "bit-manipulation-twos-complement",
        "in-place-matrix-cyclic-shifts",
        "boyer-moore-majority-misra-gries",
        "singly-doubly-intrusive-lists",
        "floyd-brent-cycle-detection",
        "stacks-expression-evaluation",
        "monotonic-stack-next-greater",
        "monotonic-deque-sliding-extrema",
        "lru-lfu-eviction-structures",
        "build-lfu-lru-cache",
        "separate-chaining-vs-open-addressing",
        "robin-hood-cuckoo-hashing",
        "consistent-hashing-rendezvous",
        "bloom-filters-counting-xor",
        "mergesort-bottom-up-inversions",
        "quicksort-partition-schemes",
        "counting-radix-bucket-sorts",
        "quickselect-bfprt-median",
        "build-hybrid-introsort-timsort",
        "binary-search-boundary-invariants",
        "parametric-search-answer-space",
        "rotated-bitonic-unbounded-search",
        "divide-and-conquer-closest-pair",
        "meet-in-the-middle-search",
        "tree-representations-traversals",
        "morris-threaded-traversal",
        "tree-serialization-reconstruction",
        "bst-operations-hibbard-deletion",
        "binary-d-ary-heaps",
        "two-heaps-k-way-merge-patterns",
        "tree-rotations-avl-invariants",
        "red-black-llrb-isomorphism",
        "augmented-trees-order-intervals",
        "build-llrb-order-statistic-tree",
        "static-range-queries-sparse-table",
        "fenwick-tree-binary-indexed",
        "segment-trees-bottom-up-monoids",
        "lowest-common-ancestor-rmq",
        "cartesian-trees-treap-duality",
        "tries-radix-trees-patricia",
        "bitwise-tries-max-xor",
        "rabin-karp-polynomial-rolling-hash",
        "kmp-prefix-function-automaton",
        "manacher-palindromic-tree",
        "thompson-nfa-vs-backtracking-regex",
        "myers-diff-hirschberg-lcs",
        "graph-representations-csr-cache",
        "bfs-01-bfs-multi-source",
        "dfs-edge-classification-timestamps",
        "topological-sort-kahn-dfs",
        "bipartite-graphs-2-coloring",
        "bridges-articulation-biconnected",
        "disjoint-set-union-ackermann",
        "mst-cut-cycle-properties",
        "dijkstra-relaxation-invariants",
        "astar-heuristic-admissibility",
        "state-space-dijkstra-layered-graphs",
        "bipartite-matching-hopcroft-karp",
        "combinatorial-generation-permutations",
        "backtracking-state-space-trees",
        "greedy-choice-exchange-arguments",
        "dp-optimal-substructure-dag",
        "memoization-tabulation-space-rolling",
        "knapsack-family-01-unbounded-bounded",
        "lis-patience-sorting",
        "sequence-dp-lcs-levenshtein"
      ],
      "steps": [
        {
          "type": "topic",
          "slug": "asymptotic-notations-rigor",
          "id": "asymptotic-notations-rigor",
          "title": "1.1: Asymptotic Notation Rigor: O, Ω, Θ, o, ω & Limit Laws"
        },
        {
          "type": "topic",
          "slug": "recurrence-relations-master-theorem",
          "id": "recurrence-relations-master-theorem",
          "title": "1.1: Solving Recurrences: Recursion Trees, Substitution & Master Theorem"
        },
        {
          "type": "topic",
          "slug": "amortized-analysis-potential",
          "id": "amortized-analysis-potential",
          "title": "1.1: Amortized Analysis: Aggregate, Banker's & Physicist's Potential (Φ)"
        },
        {
          "type": "topic",
          "slug": "complexity-tradeoff-framework",
          "id": "complexity-tradeoff-framework",
          "title": "1.1: Time-Space-Precomputation Tradeoff Design Framework"
        },
        {
          "type": "topic",
          "slug": "dynamic-arrays-geometric-resizing",
          "id": "dynamic-arrays-geometric-resizing",
          "title": "1.2: Dynamic Arrays: Geometric Growth Factors (2× vs 1.5×) & Memory Reuse"
        },
        {
          "type": "topic",
          "slug": "prefix-sums-difference-arrays",
          "id": "prefix-sums-difference-arrays",
          "title": "1.2: 1D/2D Prefix Sums & Difference Arrays for O(1) Range Updates"
        },
        {
          "type": "topic",
          "slug": "two-pointers-invariant-proofs",
          "id": "two-pointers-invariant-proofs",
          "title": "1.2: Two-Pointer Invariants: Converging, Fast-Slow & Dutch National Flag"
        },
        {
          "type": "topic",
          "slug": "sliding-window-monotonicity",
          "id": "sliding-window-monotonicity",
          "title": "1.2: Fixed & Variable Sliding Windows: Monotonicity & Two-Pointer Validity"
        },
        {
          "type": "topic",
          "slug": "kadane-subarray-invariants",
          "id": "kadane-subarray-invariants",
          "title": "1.2: Maximum Subarray (Kadane's Algorithm) & Circular Array Extensions"
        },
        {
          "type": "topic",
          "slug": "bit-manipulation-twos-complement",
          "id": "bit-manipulation-twos-complement",
          "title": "1.2: Twos-Complement Arithmetic, Bitmasks, Brian Kernighan's Trick & XOR"
        },
        {
          "type": "topic",
          "slug": "in-place-matrix-cyclic-shifts",
          "id": "in-place-matrix-cyclic-shifts",
          "title": "1.2: In-Place Array Rotations (Juggling/Reversal) & Matrix Transposition"
        },
        {
          "type": "topic",
          "slug": "boyer-moore-majority-misra-gries",
          "id": "boyer-moore-majority-misra-gries",
          "title": "1.2: Boyer-Moore Majority Vote & Misra-Gries Heavy Hitters"
        },
        {
          "type": "topic",
          "slug": "singly-doubly-intrusive-lists",
          "id": "singly-doubly-intrusive-lists",
          "title": "1.3: Singly, Doubly & Intrusive Linked Lists (Linux Kernel list_head)"
        },
        {
          "type": "topic",
          "slug": "floyd-brent-cycle-detection",
          "id": "floyd-brent-cycle-detection",
          "title": "1.3: Pointer Chasing: Floyd's Tortoise-and-Hare vs Brent's Cycle Detection"
        },
        {
          "type": "topic",
          "slug": "stacks-expression-evaluation",
          "id": "stacks-expression-evaluation",
          "title": "1.3: Call Stacks, Dijkstra's Shunting-Yard Algorithm & AST Evaluation"
        },
        {
          "type": "topic",
          "slug": "monotonic-stack-next-greater",
          "id": "monotonic-stack-next-greater",
          "title": "1.3: Monotonic Stacks: Next Greater Element, Histogram & Subarray Mins"
        },
        {
          "type": "topic",
          "slug": "monotonic-deque-sliding-extrema",
          "id": "monotonic-deque-sliding-extrema",
          "title": "1.3: Monotonic Deques: O(N) Sliding Window Minimum/Maximum"
        },
        {
          "type": "topic",
          "slug": "lru-lfu-eviction-structures",
          "id": "lru-lfu-eviction-structures",
          "title": "1.3: Composing Hash Maps + Doubly Linked Lists: O(1) LRU & LFU Caches"
        },
        {
          "type": "build",
          "slug": "build-lfu-lru-cache",
          "id": "build-lfu-lru-cache",
          "title": "1.3: Build Lab: O(1) LRU and Frequency-Bucketed LFU Cache Engine"
        },
        {
          "type": "topic",
          "slug": "separate-chaining-vs-open-addressing",
          "id": "separate-chaining-vs-open-addressing",
          "title": "2.1: Collision Resolution: Separate Chaining vs Linear/Quadratic/Double Probing"
        },
        {
          "type": "topic",
          "slug": "robin-hood-cuckoo-hashing",
          "id": "robin-hood-cuckoo-hashing",
          "title": "2.1: Variance Reduction: Robin Hood Hashing (PSL) & Cuckoo Hashing"
        },
        {
          "type": "topic",
          "slug": "consistent-hashing-rendezvous",
          "id": "consistent-hashing-rendezvous",
          "title": "2.1: Consistent Hashing with Bounded Loads & Rendezvous (HRW) Hashing"
        },
        {
          "type": "topic",
          "slug": "bloom-filters-counting-xor",
          "id": "bloom-filters-counting-xor",
          "title": "2.1: Bloom Filters, Counting Bloom Filters, Cuckoo Filters & Xor Filters"
        },
        {
          "type": "topic",
          "slug": "mergesort-bottom-up-inversions",
          "id": "mergesort-bottom-up-inversions",
          "title": "2.2: Top-Down vs Bottom-Up Merge Sort & Counting Inversions in O(N log N)"
        },
        {
          "type": "topic",
          "slug": "quicksort-partition-schemes",
          "id": "quicksort-partition-schemes",
          "title": "2.2: Quicksort: Lomuto vs Hoare vs Bentley-McIlroy 3-Way Partitioning"
        },
        {
          "type": "topic",
          "slug": "counting-radix-bucket-sorts",
          "id": "counting-radix-bucket-sorts",
          "title": "2.2: Non-Comparison Sorts: Counting Sort, LSD/MSD Radix Sort & Bucket Sort"
        },
        {
          "type": "topic",
          "slug": "quickselect-bfprt-median",
          "id": "quickselect-bfprt-median",
          "title": "2.2: Order Statistics: Randomized Quickselect vs Deterministic BFPRT Median-of-Medians"
        },
        {
          "type": "build",
          "slug": "build-hybrid-introsort-timsort",
          "id": "build-hybrid-introsort-timsort",
          "title": "2.2: Build Lab: Hybrid Adaptive Sort (Run Detection + Insertion + Galloping Merge)"
        },
        {
          "type": "topic",
          "slug": "binary-search-boundary-invariants",
          "id": "binary-search-boundary-invariants",
          "title": "2.3: Closed vs Half-Open Binary Search: Eliminating Off-by-One Infinite Loops"
        },
        {
          "type": "topic",
          "slug": "parametric-search-answer-space",
          "id": "parametric-search-answer-space",
          "title": "2.3: Parametric Search: Binary Searching the Answer Space & Feasibility Predicates"
        },
        {
          "type": "topic",
          "slug": "rotated-bitonic-unbounded-search",
          "id": "rotated-bitonic-unbounded-search",
          "title": "2.3: Exponential (Galloping) Search, Rotated Arrays & Ternary Search on Unimodal Functions"
        },
        {
          "type": "topic",
          "slug": "divide-and-conquer-closest-pair",
          "id": "divide-and-conquer-closest-pair",
          "title": "2.3: Geometric Divide-and-Conquer: Planar Closest Pair of Points in O(N log N)"
        },
        {
          "type": "topic",
          "slug": "meet-in-the-middle-search",
          "id": "meet-in-the-middle-search",
          "title": "2.3: Meet-in-the-Middle: Halving the Exponent from O(2^N) to O(2^(N/2) log(2^(N/2)))"
        },
        {
          "type": "topic",
          "slug": "tree-representations-traversals",
          "id": "tree-representations-traversals",
          "title": "3.1: Tree Representations & Recursive vs Iterative Pre/In/Post/Level-Order Traversals"
        },
        {
          "type": "topic",
          "slug": "morris-threaded-traversal",
          "id": "morris-threaded-traversal",
          "title": "3.1: Morris In-Order Traversal: O(1) Auxiliary Space via Temporary Threading"
        },
        {
          "type": "topic",
          "slug": "tree-serialization-reconstruction",
          "id": "tree-serialization-reconstruction",
          "title": "3.1: Unique Tree Reconstruction (Preorder + Inorder) & Succinct Bit-String Serialization"
        },
        {
          "type": "topic",
          "slug": "bst-operations-hibbard-deletion",
          "id": "bst-operations-hibbard-deletion",
          "title": "3.1: Binary Search Trees: Search, Insertion, Successor & Hibbard Deletion Asymmetry"
        },
        {
          "type": "topic",
          "slug": "binary-d-ary-heaps",
          "id": "binary-d-ary-heaps",
          "title": "3.1: Binary & d-ary Heaps: Floyd's O(N) Bottom-Up Build-Heap Proof"
        },
        {
          "type": "topic",
          "slug": "two-heaps-k-way-merge-patterns",
          "id": "two-heaps-k-way-merge-patterns",
          "title": "3.1: Priority Queue Patterns: Running Median (Two Heaps), K-Way Merge & Top-K"
        },
        {
          "type": "topic",
          "slug": "tree-rotations-avl-invariants",
          "id": "tree-rotations-avl-invariants",
          "title": "3.2: Tree Rotations & AVL Trees: Balance Factors, LL/RR/LR/RL Rebalancing & Fibonacci Height Bound"
        },
        {
          "type": "topic",
          "slug": "red-black-llrb-isomorphism",
          "id": "red-black-llrb-isomorphism",
          "title": "3.2: 2-3-4 Trees, Red-Black Trees & Sedgewick's Left-Leaning Red-Black (LLRB) Isomorphism"
        },
        {
          "type": "topic",
          "slug": "augmented-trees-order-intervals",
          "id": "augmented-trees-order-intervals",
          "title": "3.2: Augmenting BSTs: Order-Statistic Trees (select/rank) & Interval Trees"
        },
        {
          "type": "build",
          "slug": "build-llrb-order-statistic-tree",
          "id": "build-llrb-order-statistic-tree",
          "title": "3.2: Build Lab: Left-Leaning Red-Black (LLRB) Order-Statistic Tree with rank and select"
        },
        {
          "type": "topic",
          "slug": "static-range-queries-sparse-table",
          "id": "static-range-queries-sparse-table",
          "title": "3.3: Disjoint & Standard Sparse Tables: O(1) Idempotent Range Minimum Query (RMQ)"
        },
        {
          "type": "topic",
          "slug": "fenwick-tree-binary-indexed",
          "id": "fenwick-tree-binary-indexed",
          "title": "3.3: Fenwick Trees (Binary Indexed Trees): lowbit Geometry, Point Updates & Range Updates"
        },
        {
          "type": "topic",
          "slug": "segment-trees-bottom-up-monoids",
          "id": "segment-trees-bottom-up-monoids",
          "title": "3.3: Segment Trees over Monoids: Recursive vs Iterative (ZKW) Bottom-Up Implementation"
        },
        {
          "type": "topic",
          "slug": "lowest-common-ancestor-rmq",
          "id": "lowest-common-ancestor-rmq",
          "title": "3.3: Lowest Common Ancestor (LCA): Binary Lifting vs Euler Tour + ±1 RMQ Reduction"
        },
        {
          "type": "topic",
          "slug": "cartesian-trees-treap-duality",
          "id": "cartesian-trees-treap-duality",
          "title": "3.3: Cartesian Trees: Linear-Time Monotonic Stack Construction & RMQ-LCA Duality"
        },
        {
          "type": "topic",
          "slug": "tries-radix-trees-patricia",
          "id": "tries-radix-trees-patricia",
          "title": "4.1: Prefix Tries, Compressed Radix Trees & PATRICIA Trees"
        },
        {
          "type": "topic",
          "slug": "bitwise-tries-max-xor",
          "id": "bitwise-tries-max-xor",
          "title": "4.1: Bitwise (0-1) Tries: Maximum XOR Subarray & Subtree Queries"
        },
        {
          "type": "topic",
          "slug": "rabin-karp-polynomial-rolling-hash",
          "id": "rabin-karp-polynomial-rolling-hash",
          "title": "4.1: Rabin-Karp Rolling Hash: Mersenne Prime Moduli (2^61 - 1) & Birthday Collision Avoidance"
        },
        {
          "type": "topic",
          "slug": "kmp-prefix-function-automaton",
          "id": "kmp-prefix-function-automaton",
          "title": "4.1: Knuth-Morris-Pratt (KMP): Prefix Function π[i] Amortized Linearity & DFA View"
        },
        {
          "type": "topic",
          "slug": "manacher-palindromic-tree",
          "id": "manacher-palindromic-tree",
          "title": "4.1: Palindromes in O(N): Manacher's Algorithm & Eertree (Palindromic Automaton)"
        },
        {
          "type": "topic",
          "slug": "thompson-nfa-vs-backtracking-regex",
          "id": "thompson-nfa-vs-backtracking-regex",
          "title": "4.2: Regular Expression Engines: Thompson's O(NM) NFA Simulation vs Catastrophic ReDoS Backtracking"
        },
        {
          "type": "topic",
          "slug": "myers-diff-hirschberg-lcs",
          "id": "myers-diff-hirschberg-lcs",
          "title": "4.2: Myers O(ND) Shortest Edit Script & Hirschberg's Linear-Space Alignment"
        },
        {
          "type": "topic",
          "slug": "graph-representations-csr-cache",
          "id": "graph-representations-csr-cache",
          "title": "5.1: Graph Representations: Adjacency Lists, Bit Matrices & Compressed Sparse Row (CSR)"
        },
        {
          "type": "topic",
          "slug": "bfs-01-bfs-multi-source",
          "id": "bfs-01-bfs-multi-source",
          "title": "5.1: Breadth-First Search: Multi-Source BFS, 0-1 BFS (Deque) & Bidirectional Search"
        },
        {
          "type": "topic",
          "slug": "dfs-edge-classification-timestamps",
          "id": "dfs-edge-classification-timestamps",
          "title": "5.1: Depth-First Search: Parenthesis Theorem, White-Path Theorem & Tree/Back/Forward/Cross Edges"
        },
        {
          "type": "topic",
          "slug": "topological-sort-kahn-dfs",
          "id": "topological-sort-kahn-dfs",
          "title": "5.1: Directed Acyclic Graphs (DAGs): Kahn's Indegree Queue vs DFS Post-Order Reversal"
        },
        {
          "type": "topic",
          "slug": "bipartite-graphs-2-coloring",
          "id": "bipartite-graphs-2-coloring",
          "title": "5.1: Bipartite Graphs: Odd-Cycle Characterization & 2-Coloring Verification"
        },
        {
          "type": "topic",
          "slug": "bridges-articulation-biconnected",
          "id": "bridges-articulation-biconnected",
          "title": "5.1: Undirected Connectivity: Tarjan's tin/low Algorithm for Bridges, Cut Vertices & BCCs"
        },
        {
          "type": "topic",
          "slug": "disjoint-set-union-ackermann",
          "id": "disjoint-set-union-ackermann",
          "title": "5.2: Disjoint Set Union (Union-Find): Union by Rank + Path Compression & O(α(N)) Proof Intuition"
        },
        {
          "type": "topic",
          "slug": "mst-cut-cycle-properties",
          "id": "mst-cut-cycle-properties",
          "title": "5.2: Minimum Spanning Trees: Cut & Cycle Optimality Properties, Kruskal's, Prim's & Borůvka's"
        },
        {
          "type": "topic",
          "slug": "dijkstra-relaxation-invariants",
          "id": "dijkstra-relaxation-invariants",
          "title": "5.2: Dijkstra's Algorithm: Non-Negative Edge Invariant, Priority Queue Tradeoffs & Dial's Bucket Queue"
        },
        {
          "type": "topic",
          "slug": "astar-heuristic-admissibility",
          "id": "astar-heuristic-admissibility",
          "title": "5.2: A* Search & Bidirectional A*: Admissibility, Consistency (Triangle Inequality) & Optimality Proof"
        },
        {
          "type": "topic",
          "slug": "state-space-dijkstra-layered-graphs",
          "id": "state-space-dijkstra-layered-graphs",
          "title": "5.2: Modeling Problems as State-Space Graphs: Layered Graphs ((u, k) States) & Bitmask Dijkstra"
        },
        {
          "type": "topic",
          "slug": "bipartite-matching-hopcroft-karp",
          "id": "bipartite-matching-hopcroft-karp",
          "title": "5.3: Maximum Bipartite Matching: König's Theorem, Hall's Marriage Theorem & Hopcroft-Karp O(E√V)"
        },
        {
          "type": "topic",
          "slug": "combinatorial-generation-permutations",
          "id": "combinatorial-generation-permutations",
          "title": "6.1: Combinatorial Generation: Subsets, Lexicographic Permutations (Narayana) & Gray Codes"
        },
        {
          "type": "topic",
          "slug": "backtracking-state-space-trees",
          "id": "backtracking-state-space-trees",
          "title": "6.1: Backtracking Architecture: Choice, Constraint, Undo & Symmetry-Breaking Pruning"
        },
        {
          "type": "topic",
          "slug": "greedy-choice-exchange-arguments",
          "id": "greedy-choice-exchange-arguments",
          "title": "6.1: Proving Greedy Correctness: Greedy Stays Ahead & Exchange Arguments (Interval Scheduling, Minimizing Lateness)"
        },
        {
          "type": "topic",
          "slug": "dp-optimal-substructure-dag",
          "id": "dp-optimal-substructure-dag",
          "title": "6.2: Dynamic Programming as Shortest Paths on an Implicit DAG: Optimal Substructure & SRTBOT Framework"
        },
        {
          "type": "topic",
          "slug": "memoization-tabulation-space-rolling",
          "id": "memoization-tabulation-space-rolling",
          "title": "6.2: Top-Down Memoization vs Bottom-Up Tabulation & Rolling-Array Space Compression"
        },
        {
          "type": "topic",
          "slug": "knapsack-family-01-unbounded-bounded",
          "id": "knapsack-family-01-unbounded-bounded",
          "title": "6.2: The Knapsack Family: 0/1, Unbounded, Subset Sum Bitset & Bounded Knapsack (Binary Splitting / Monotonic Queue)"
        },
        {
          "type": "topic",
          "slug": "lis-patience-sorting",
          "id": "lis-patience-sorting",
          "title": "6.2: Longest Increasing Subsequence (LIS): O(N^2) DP vs O(N log N) Patience Sorting & Dilworth's Theorem"
        },
        {
          "type": "topic",
          "slug": "sequence-dp-lcs-levenshtein",
          "id": "sequence-dp-lcs-levenshtein",
          "title": "6.2: Sequence Alignment DP: Longest Common Subsequence (LCS) & Wagner-Fischer Edit Distance"
        }
      ]
    },
    {
      "id": "staff-systems-40",
      "title": "Staff Systems & Production Engine Internals (40 Units)",
      "role": "Systems, Storage, Runtime & Infrastructure Architect",
      "targetRole": "Staff / Principal Systems Engineer",
      "estimatedWeeks": 6,
      "estimatedHours": "50 hrs",
      "difficulty": "Advanced → Staff",
      "xpReward": 3200,
      "icon": "cpu",
      "tagline": "Inside V8, Redis ZSET, Rust SwissTable, SipHash, TimSort/pdqsort, Linux CFS rbtree, B+/LSM trees, ripgrep SIMD, Git diff, and OSRM.",
      "description": "Focuses on hardware reality and production engine internals: how modern compilers, kernels, databases, and search engines adapt classical data structures for L1/L2 cache lines, SIMD instructions, and NVMe pages.",
      "unitCount": 40,
      "unitSlugs": [
        "ram-model-vs-modern-cpu",
        "cache-oblivious-algorithms",
        "branch-prediction-simd-cost",
        "case-v8-elements-kinds",
        "bitsets-word-level-parallelism",
        "build-dynamic-circular-deque",
        "singly-doubly-intrusive-lists",
        "unrolled-linked-lists-ropes",
        "case-redis-skiplist-ziplist",
        "build-lfu-lru-cache",
        "robin-hood-cuckoo-hashing",
        "hashdos-siphash-random-seeds",
        "consistent-hashing-rendezvous",
        "bloom-filters-counting-xor",
        "count-min-sketch-heavy-hitters",
        "hyperloglog-cardinality",
        "case-rust-hashbrown-swisstable",
        "external-merge-sort-replacement",
        "case-timsort-pdqsort",
        "case-git-bisect-eytzinger",
        "case-timer-wheels-vs-heaps",
        "build-indexed-d-ary-priority-queue",
        "b-trees-bplus-trees-disk-pages",
        "lsm-trees-write-amplification",
        "persistent-trees-path-copying",
        "case-linux-rbtree-cfs",
        "tries-radix-trees-patricia",
        "boyer-moore-horspool-simd",
        "case-ripgrep-teddy-simd",
        "burrows-wheeler-transform-fm-index",
        "thompson-nfa-vs-backtracking-regex",
        "huffman-lz77-deflate",
        "case-git-myers-histogram-diff",
        "graph-representations-csr-cache",
        "case-bundler-build-graph-cycles",
        "case-osrm-contraction-hierarchies",
        "build-astar-bidirectional-router",
        "case-sat-solvers-cdcl-dpll",
        "case-pretty-printing-knuth-plass",
        "spatial-indexing-kd-quad-rtrees"
      ],
      "steps": [
        {
          "type": "topic",
          "slug": "ram-model-vs-modern-cpu",
          "id": "ram-model-vs-modern-cpu",
          "title": "1.1: The RAM Model vs Modern CPU Cache Hierarchy"
        },
        {
          "type": "topic",
          "slug": "cache-oblivious-algorithms",
          "id": "cache-oblivious-algorithms",
          "title": "1.1: Cache-Aware vs Cache-Oblivious Layouts (van Emde Boas Layout)"
        },
        {
          "type": "topic",
          "slug": "branch-prediction-simd-cost",
          "id": "branch-prediction-simd-cost",
          "title": "1.1: Branch Misprediction Penalties & Branchless Algorithmic Design"
        },
        {
          "type": "topic",
          "slug": "case-v8-elements-kinds",
          "id": "case-v8-elements-kinds",
          "title": "1.1: Production Case Study: How V8 Optimizes JS Arrays (SMI, Double & Holey Elements)"
        },
        {
          "type": "topic",
          "slug": "bitsets-word-level-parallelism",
          "id": "bitsets-word-level-parallelism",
          "title": "1.2: Bitsets, Popcount (__builtin_popcount) & O(N/64) Word-Level Parallelism"
        },
        {
          "type": "build",
          "slug": "build-dynamic-circular-deque",
          "id": "build-dynamic-circular-deque",
          "title": "1.2: Build Lab: Dynamic Circular Buffer & Amortized O(1) Vector"
        },
        {
          "type": "topic",
          "slug": "singly-doubly-intrusive-lists",
          "id": "singly-doubly-intrusive-lists",
          "title": "1.3: Singly, Doubly & Intrusive Linked Lists (Linux Kernel list_head)"
        },
        {
          "type": "topic",
          "slug": "unrolled-linked-lists-ropes",
          "id": "unrolled-linked-lists-ropes",
          "title": "1.3: Unrolled Linked Lists & Gap Buffers: Defeating Pointer Chasing"
        },
        {
          "type": "topic",
          "slug": "case-redis-skiplist-ziplist",
          "id": "case-redis-skiplist-ziplist",
          "title": "1.3: Production Case Study: Redis ZSET (Listpack vs SkipList + Dict Dual Indexing)"
        },
        {
          "type": "build",
          "slug": "build-lfu-lru-cache",
          "id": "build-lfu-lru-cache",
          "title": "1.3: Build Lab: O(1) LRU and Frequency-Bucketed LFU Cache Engine"
        },
        {
          "type": "topic",
          "slug": "robin-hood-cuckoo-hashing",
          "id": "robin-hood-cuckoo-hashing",
          "title": "2.1: Variance Reduction: Robin Hood Hashing (PSL) & Cuckoo Hashing"
        },
        {
          "type": "topic",
          "slug": "hashdos-siphash-random-seeds",
          "id": "hashdos-siphash-random-seeds",
          "title": "2.1: Algorithmic Complexity Attacks (HashDoS) & SipHash Defense"
        },
        {
          "type": "topic",
          "slug": "consistent-hashing-rendezvous",
          "id": "consistent-hashing-rendezvous",
          "title": "2.1: Consistent Hashing with Bounded Loads & Rendezvous (HRW) Hashing"
        },
        {
          "type": "topic",
          "slug": "bloom-filters-counting-xor",
          "id": "bloom-filters-counting-xor",
          "title": "2.1: Bloom Filters, Counting Bloom Filters, Cuckoo Filters & Xor Filters"
        },
        {
          "type": "topic",
          "slug": "count-min-sketch-heavy-hitters",
          "id": "count-min-sketch-heavy-hitters",
          "title": "2.1: Count-Min Sketch & Streaming Frequency Estimation Error Bounds"
        },
        {
          "type": "topic",
          "slug": "hyperloglog-cardinality",
          "id": "hyperloglog-cardinality",
          "title": "2.1: HyperLogLog: Harmonic Mean & Stochastic Averaging in 1.5 KB"
        },
        {
          "type": "topic",
          "slug": "case-rust-hashbrown-swisstable",
          "id": "case-rust-hashbrown-swisstable",
          "title": "2.1: Production Case Study: Google Abseil SwissTable & Rust hashbrown SIMD Probing"
        },
        {
          "type": "topic",
          "slug": "external-merge-sort-replacement",
          "id": "external-merge-sort-replacement",
          "title": "2.2: External Memory Sorting: K-Way Merge & Replacement Selection"
        },
        {
          "type": "topic",
          "slug": "case-timsort-pdqsort",
          "id": "case-timsort-pdqsort",
          "title": "2.2: Production Case Study: Python/V8 TimSort (Galloping & Run Invariants) vs Rust pdqsort"
        },
        {
          "type": "topic",
          "slug": "case-git-bisect-eytzinger",
          "id": "case-git-bisect-eytzinger",
          "title": "2.3: Production Case Study: Cache-Friendly Eytzinger Binary Search Layout vs Standard Binary Search"
        },
        {
          "type": "topic",
          "slug": "case-timer-wheels-vs-heaps",
          "id": "case-timer-wheels-vs-heaps",
          "title": "3.1: Production Case Study: Hierarchical Hashed Timer Wheels vs Four-Heap Timers (Go runtime, Kafka, Linux)"
        },
        {
          "type": "build",
          "slug": "build-indexed-d-ary-priority-queue",
          "id": "build-indexed-d-ary-priority-queue",
          "title": "3.1: Build Lab: Indexed 4-Ary Min/Max Priority Queue with O(log_d N) decreaseKey"
        },
        {
          "type": "topic",
          "slug": "b-trees-bplus-trees-disk-pages",
          "id": "b-trees-bplus-trees-disk-pages",
          "title": "3.2: B-Trees & B+ Trees: Page Fanout, Proactive Splitting & Leaf Sibling Chains"
        },
        {
          "type": "topic",
          "slug": "lsm-trees-write-amplification",
          "id": "lsm-trees-write-amplification",
          "title": "3.2: LSM-Trees vs B+ Trees: MemTables, SSTables, Compaction & RUM Conjecture"
        },
        {
          "type": "topic",
          "slug": "persistent-trees-path-copying",
          "id": "persistent-trees-path-copying",
          "title": "3.2: Persistent Data Structures: Path Copying, Fat Nodes & Fractional Cascading Time Travel"
        },
        {
          "type": "topic",
          "slug": "case-linux-rbtree-cfs",
          "id": "case-linux-rbtree-cfs",
          "title": "3.2: Production Case Study: Intrusive Augmented Red-Black Trees in the Linux Kernel CFS & VMA Manager"
        },
        {
          "type": "topic",
          "slug": "tries-radix-trees-patricia",
          "id": "tries-radix-trees-patricia",
          "title": "4.1: Prefix Tries, Compressed Radix Trees & PATRICIA Trees"
        },
        {
          "type": "topic",
          "slug": "boyer-moore-horspool-simd",
          "id": "boyer-moore-horspool-simd",
          "title": "4.1: Sublinear Average-Case Matching: Boyer-Moore Bad-Character/Good-Suffix & Horspool"
        },
        {
          "type": "topic",
          "slug": "case-ripgrep-teddy-simd",
          "id": "case-ripgrep-teddy-simd",
          "title": "4.1: Production Case Study: Why ripgrep Is So Fast (Aho-Corasick, Boyer-Moore & SIMD Teddy)"
        },
        {
          "type": "topic",
          "slug": "burrows-wheeler-transform-fm-index",
          "id": "burrows-wheeler-transform-fm-index",
          "title": "4.2: Burrows-Wheeler Transform (BWT), Last-to-First (LF) Mapping & FM-Index Substring Search"
        },
        {
          "type": "topic",
          "slug": "thompson-nfa-vs-backtracking-regex",
          "id": "thompson-nfa-vs-backtracking-regex",
          "title": "4.2: Regular Expression Engines: Thompson's O(NM) NFA Simulation vs Catastrophic ReDoS Backtracking"
        },
        {
          "type": "topic",
          "slug": "huffman-lz77-deflate",
          "id": "huffman-lz77-deflate",
          "title": "4.2: Lossless Compression: Huffman Optimality Proof, LZ77 Sliding Window & DEFLATE"
        },
        {
          "type": "topic",
          "slug": "case-git-myers-histogram-diff",
          "id": "case-git-myers-histogram-diff",
          "title": "4.2: Production Case Study: Inside git diff (Myers vs Patience vs Histogram Diff)"
        },
        {
          "type": "topic",
          "slug": "graph-representations-csr-cache",
          "id": "graph-representations-csr-cache",
          "title": "5.1: Graph Representations: Adjacency Lists, Bit Matrices & Compressed Sparse Row (CSR)"
        },
        {
          "type": "topic",
          "slug": "case-bundler-build-graph-cycles",
          "id": "case-bundler-build-graph-cycles",
          "title": "5.1: Production Case Study: Topological Scheduling & SCC Cycle Reporting in Build Systems (bazel, turborepo, cargo)"
        },
        {
          "type": "topic",
          "slug": "case-osrm-contraction-hierarchies",
          "id": "case-osrm-contraction-hierarchies",
          "title": "5.2: Production Case Study: How Continental Road Routing Works in 1 Millisecond (Contraction Hierarchies & Hub Labeling)"
        },
        {
          "type": "build",
          "slug": "build-astar-bidirectional-router",
          "id": "build-astar-bidirectional-router",
          "title": "5.2: Build Lab: A* and Bidirectional Dijkstra Pathfinding Engine with Consistent Potentials"
        },
        {
          "type": "topic",
          "slug": "case-sat-solvers-cdcl-dpll",
          "id": "case-sat-solvers-cdcl-dpll",
          "title": "6.1: Production Case Study: Modern SAT Solvers & Package Dependency Resolution (DPLL, Unit Propagation & Two-Watched Literals)"
        },
        {
          "type": "topic",
          "slug": "case-pretty-printing-knuth-plass",
          "id": "case-pretty-printing-knuth-plass",
          "title": "6.2: Production Case Study: Knuth-Plass Line Breaking in TeX & Code Formatters (prettier, rustfmt)"
        },
        {
          "type": "topic",
          "slug": "spatial-indexing-kd-quad-rtrees",
          "id": "spatial-indexing-kd-quad-rtrees",
          "title": "6.4: Multidimensional Spatial Indexing: k-d Trees, Quadtrees, R-Trees & Z-Order (Morton) Curves"
        }
      ]
    },
    {
      "id": "competitive-180",
      "title": "Complete Competitive Programming & Olympiad Mastery (180 Units)",
      "role": "ICPC / IOI / Grandmaster & Full-Curriculum Scholar",
      "targetRole": "Algorithmic Grandmaster & Researcher",
      "estimatedWeeks": 18,
      "estimatedHours": "180 hrs",
      "difficulty": "Beginner → Grandmaster",
      "xpReward": 10000,
      "icon": "zap",
      "tagline": "All 180 units across all 18 modules: from RAM vs CPU cache to Segment Tree Beats, HLD, Suffix Automata, Dinic, SOS DP, Li Chao CHT, and Aliens Trick.",
      "description": "The complete, unabridged 180-unit textbook and lab sequence covering every theorem, amortized potential proof, visual simulator, and from-scratch implementation across all 6 tracks.",
      "unitCount": 180,
      "unitSlugs": [
        "ram-model-vs-modern-cpu",
        "asymptotic-notations-rigor",
        "recurrence-relations-master-theorem",
        "akra-bazzi-uneven-divides",
        "amortized-analysis-potential",
        "space-complexity-stack-frames",
        "cache-oblivious-algorithms",
        "branch-prediction-simd-cost",
        "complexity-tradeoff-framework",
        "case-v8-elements-kinds",
        "dynamic-arrays-geometric-resizing",
        "prefix-sums-difference-arrays",
        "two-pointers-invariant-proofs",
        "sliding-window-monotonicity",
        "kadane-subarray-invariants",
        "bit-manipulation-twos-complement",
        "bitsets-word-level-parallelism",
        "in-place-matrix-cyclic-shifts",
        "boyer-moore-majority-misra-gries",
        "build-dynamic-circular-deque",
        "singly-doubly-intrusive-lists",
        "floyd-brent-cycle-detection",
        "unrolled-linked-lists-ropes",
        "skip-lists-probabilistic-indexing",
        "stacks-expression-evaluation",
        "monotonic-stack-next-greater",
        "monotonic-deque-sliding-extrema",
        "lru-lfu-eviction-structures",
        "case-redis-skiplist-ziplist",
        "build-lfu-lru-cache",
        "universal-k-independent-hashing",
        "separate-chaining-vs-open-addressing",
        "robin-hood-cuckoo-hashing",
        "hashdos-siphash-random-seeds",
        "consistent-hashing-rendezvous",
        "bloom-filters-counting-xor",
        "count-min-sketch-heavy-hitters",
        "hyperloglog-cardinality",
        "case-rust-hashbrown-swisstable",
        "build-robin-hood-hash-map",
        "quadratic-sorts-inversions",
        "mergesort-bottom-up-inversions",
        "quicksort-partition-schemes",
        "randomized-quicksort-expectation",
        "decision-tree-lower-bound",
        "counting-radix-bucket-sorts",
        "quickselect-bfprt-median",
        "external-merge-sort-replacement",
        "case-timsort-pdqsort",
        "build-hybrid-introsort-timsort",
        "binary-search-boundary-invariants",
        "parametric-search-answer-space",
        "rotated-bitonic-unbounded-search",
        "fractional-cascading",
        "divide-and-conquer-closest-pair",
        "karatsuba-strassen-algebraic-dc",
        "fast-fourier-transform-polynomials",
        "meet-in-the-middle-search",
        "cdq-divide-and-conquer",
        "case-git-bisect-eytzinger",
        "tree-representations-traversals",
        "morris-threaded-traversal",
        "tree-serialization-reconstruction",
        "bst-operations-hibbard-deletion",
        "randomly-built-bst-height",
        "binary-d-ary-heaps",
        "mergeable-heaps-binomial-fibonacci",
        "two-heaps-k-way-merge-patterns",
        "case-timer-wheels-vs-heaps",
        "build-indexed-d-ary-priority-queue",
        "tree-rotations-avl-invariants",
        "red-black-llrb-isomorphism",
        "treaps-split-merge-paradigm",
        "splay-trees-dynamic-optimality",
        "augmented-trees-order-intervals",
        "b-trees-bplus-trees-disk-pages",
        "lsm-trees-write-amplification",
        "persistent-trees-path-copying",
        "case-linux-rbtree-cfs",
        "build-llrb-order-statistic-tree",
        "static-range-queries-sparse-table",
        "fenwick-tree-binary-indexed",
        "segment-trees-bottom-up-monoids",
        "lazy-propagation-segment-tree-beats",
        "dynamic-persistent-segment-trees",
        "sqrt-decomposition-mos-algorithm",
        "lowest-common-ancestor-rmq",
        "heavy-light-decomposition",
        "cartesian-trees-treap-duality",
        "build-lazy-segment-tree",
        "tries-radix-trees-patricia",
        "bitwise-tries-max-xor",
        "rabin-karp-polynomial-rolling-hash",
        "kmp-prefix-function-automaton",
        "z-algorithm-linear-box",
        "boyer-moore-horspool-simd",
        "aho-corasick-trie-automaton",
        "manacher-palindromic-tree",
        "case-ripgrep-teddy-simd",
        "build-aho-corasick-scanner",
        "suffix-trees-ukkonen-intuition",
        "suffix-arrays-prefix-doubling-sais",
        "kasai-lcp-array-rmq",
        "suffix-automaton-sam-endpos",
        "burrows-wheeler-transform-fm-index",
        "thompson-nfa-vs-backtracking-regex",
        "myers-diff-hirschberg-lcs",
        "huffman-lz77-deflate",
        "case-git-myers-histogram-diff",
        "build-thompson-nfa-regex-engine",
        "graph-representations-csr-cache",
        "bfs-01-bfs-multi-source",
        "dfs-edge-classification-timestamps",
        "topological-sort-kahn-dfs",
        "bipartite-graphs-2-coloring",
        "bridges-articulation-biconnected",
        "scc-tarjan-kosaraju-2sat",
        "eulerian-paths-hierholzer",
        "case-bundler-build-graph-cycles",
        "build-tarjan-scc-2sat-solver",
        "disjoint-set-union-ackermann",
        "dsu-rollback-weighted-offline",
        "mst-cut-cycle-properties",
        "dijkstra-relaxation-invariants",
        "astar-heuristic-admissibility",
        "bellman-ford-spfa-difference-constraints",
        "floyd-warshall-johnson-apsp",
        "state-space-dijkstra-layered-graphs",
        "case-osrm-contraction-hierarchies",
        "build-astar-bidirectional-router",
        "flow-networks-residual-graphs",
        "max-flow-min-cut-theorem",
        "edmonds-karp-shortest-augmenting",
        "dinic-level-graph-blocking-flow",
        "push-relabel-preflow",
        "bipartite-matching-hopcroft-karp",
        "weighted-matching-hungarian",
        "min-cost-max-flow-mcmf",
        "flow-reductions-project-selection",
        "build-dinic-max-flow-engine",
        "combinatorial-generation-permutations",
        "backtracking-state-space-trees",
        "exact-cover-knuth-algorithm-x",
        "branch-and-bound-admissible-bounds",
        "minimax-alpha-beta-pruning",
        "greedy-choice-exchange-arguments",
        "matroids-greedy-foundations",
        "regret-greedy-heap-rollback",
        "case-sat-solvers-cdcl-dpll",
        "build-dancing-links-exact-cover",
        "dp-optimal-substructure-dag",
        "memoization-tabulation-space-rolling",
        "knapsack-family-01-unbounded-bounded",
        "lis-patience-sorting",
        "sequence-dp-lcs-levenshtein",
        "interval-dp-matrix-chain-triangulation",
        "tree-dp-rerooting-technique",
        "dag-dp-longest-path-counting",
        "case-pretty-printing-knuth-plass",
        "build-hirschberg-linear-space-diff",
        "bitmask-dp-tsp-hamiltonian",
        "sos-dp-fast-zeta-mobius",
        "digit-dp-lexicographic-automata",
        "broken-profile-dp-grid-tiling",
        "divide-and-conquer-dp-quadrangle",
        "knuth-optimization-optimal-bst",
        "convex-hull-trick-li-chao-tree",
        "aliens-trick-wqs-binary-search",
        "matrix-exponentiation-linear-recurrences",
        "build-li-chao-convex-hull-dp",
        "geometry-primitives-orientation-ccw",
        "convex-hull-graham-andrew",
        "sweep-line-bentley-ottmann",
        "spatial-indexing-kd-quad-rtrees",
        "modular-arithmetic-gcd-crt",
        "primality-miller-rabin-pollard-rho",
        "las-vegas-monte-carlo-karger",
        "np-completeness-reductions",
        "approximation-algorithms-fptas",
        "build-kd-tree-nearest-neighbor"
      ],
      "steps": [
        {
          "type": "topic",
          "slug": "ram-model-vs-modern-cpu",
          "id": "ram-model-vs-modern-cpu",
          "title": "1.1: The RAM Model vs Modern CPU Cache Hierarchy"
        },
        {
          "type": "topic",
          "slug": "asymptotic-notations-rigor",
          "id": "asymptotic-notations-rigor",
          "title": "1.1: Asymptotic Notation Rigor: O, Ω, Θ, o, ω & Limit Laws"
        },
        {
          "type": "topic",
          "slug": "recurrence-relations-master-theorem",
          "id": "recurrence-relations-master-theorem",
          "title": "1.1: Solving Recurrences: Recursion Trees, Substitution & Master Theorem"
        },
        {
          "type": "topic",
          "slug": "akra-bazzi-uneven-divides",
          "id": "akra-bazzi-uneven-divides",
          "title": "1.1: Beyond Master Theorem: Akra-Bazzi for Uneven Subproblems"
        },
        {
          "type": "topic",
          "slug": "amortized-analysis-potential",
          "id": "amortized-analysis-potential",
          "title": "1.1: Amortized Analysis: Aggregate, Banker's & Physicist's Potential (Φ)"
        },
        {
          "type": "topic",
          "slug": "space-complexity-stack-frames",
          "id": "space-complexity-stack-frames",
          "title": "1.1: Space Complexity: Call Stacks, Tail Recursion & Auxiliary Heap"
        },
        {
          "type": "topic",
          "slug": "cache-oblivious-algorithms",
          "id": "cache-oblivious-algorithms",
          "title": "1.1: Cache-Aware vs Cache-Oblivious Layouts (van Emde Boas Layout)"
        },
        {
          "type": "topic",
          "slug": "branch-prediction-simd-cost",
          "id": "branch-prediction-simd-cost",
          "title": "1.1: Branch Misprediction Penalties & Branchless Algorithmic Design"
        },
        {
          "type": "topic",
          "slug": "complexity-tradeoff-framework",
          "id": "complexity-tradeoff-framework",
          "title": "1.1: Time-Space-Precomputation Tradeoff Design Framework"
        },
        {
          "type": "topic",
          "slug": "case-v8-elements-kinds",
          "id": "case-v8-elements-kinds",
          "title": "1.1: Production Case Study: How V8 Optimizes JS Arrays (SMI, Double & Holey Elements)"
        },
        {
          "type": "topic",
          "slug": "dynamic-arrays-geometric-resizing",
          "id": "dynamic-arrays-geometric-resizing",
          "title": "1.2: Dynamic Arrays: Geometric Growth Factors (2× vs 1.5×) & Memory Reuse"
        },
        {
          "type": "topic",
          "slug": "prefix-sums-difference-arrays",
          "id": "prefix-sums-difference-arrays",
          "title": "1.2: 1D/2D Prefix Sums & Difference Arrays for O(1) Range Updates"
        },
        {
          "type": "topic",
          "slug": "two-pointers-invariant-proofs",
          "id": "two-pointers-invariant-proofs",
          "title": "1.2: Two-Pointer Invariants: Converging, Fast-Slow & Dutch National Flag"
        },
        {
          "type": "topic",
          "slug": "sliding-window-monotonicity",
          "id": "sliding-window-monotonicity",
          "title": "1.2: Fixed & Variable Sliding Windows: Monotonicity & Two-Pointer Validity"
        },
        {
          "type": "topic",
          "slug": "kadane-subarray-invariants",
          "id": "kadane-subarray-invariants",
          "title": "1.2: Maximum Subarray (Kadane's Algorithm) & Circular Array Extensions"
        },
        {
          "type": "topic",
          "slug": "bit-manipulation-twos-complement",
          "id": "bit-manipulation-twos-complement",
          "title": "1.2: Twos-Complement Arithmetic, Bitmasks, Brian Kernighan's Trick & XOR"
        },
        {
          "type": "topic",
          "slug": "bitsets-word-level-parallelism",
          "id": "bitsets-word-level-parallelism",
          "title": "1.2: Bitsets, Popcount (__builtin_popcount) & O(N/64) Word-Level Parallelism"
        },
        {
          "type": "topic",
          "slug": "in-place-matrix-cyclic-shifts",
          "id": "in-place-matrix-cyclic-shifts",
          "title": "1.2: In-Place Array Rotations (Juggling/Reversal) & Matrix Transposition"
        },
        {
          "type": "topic",
          "slug": "boyer-moore-majority-misra-gries",
          "id": "boyer-moore-majority-misra-gries",
          "title": "1.2: Boyer-Moore Majority Vote & Misra-Gries Heavy Hitters"
        },
        {
          "type": "build",
          "slug": "build-dynamic-circular-deque",
          "id": "build-dynamic-circular-deque",
          "title": "1.2: Build Lab: Dynamic Circular Buffer & Amortized O(1) Vector"
        },
        {
          "type": "topic",
          "slug": "singly-doubly-intrusive-lists",
          "id": "singly-doubly-intrusive-lists",
          "title": "1.3: Singly, Doubly & Intrusive Linked Lists (Linux Kernel list_head)"
        },
        {
          "type": "topic",
          "slug": "floyd-brent-cycle-detection",
          "id": "floyd-brent-cycle-detection",
          "title": "1.3: Pointer Chasing: Floyd's Tortoise-and-Hare vs Brent's Cycle Detection"
        },
        {
          "type": "topic",
          "slug": "unrolled-linked-lists-ropes",
          "id": "unrolled-linked-lists-ropes",
          "title": "1.3: Unrolled Linked Lists & Gap Buffers: Defeating Pointer Chasing"
        },
        {
          "type": "topic",
          "slug": "skip-lists-probabilistic-indexing",
          "id": "skip-lists-probabilistic-indexing",
          "title": "1.3: Skip Lists: Probabilistic Multi-Level Indexing & O(log N) Search Proof"
        },
        {
          "type": "topic",
          "slug": "stacks-expression-evaluation",
          "id": "stacks-expression-evaluation",
          "title": "1.3: Call Stacks, Dijkstra's Shunting-Yard Algorithm & AST Evaluation"
        },
        {
          "type": "topic",
          "slug": "monotonic-stack-next-greater",
          "id": "monotonic-stack-next-greater",
          "title": "1.3: Monotonic Stacks: Next Greater Element, Histogram & Subarray Mins"
        },
        {
          "type": "topic",
          "slug": "monotonic-deque-sliding-extrema",
          "id": "monotonic-deque-sliding-extrema",
          "title": "1.3: Monotonic Deques: O(N) Sliding Window Minimum/Maximum"
        },
        {
          "type": "topic",
          "slug": "lru-lfu-eviction-structures",
          "id": "lru-lfu-eviction-structures",
          "title": "1.3: Composing Hash Maps + Doubly Linked Lists: O(1) LRU & LFU Caches"
        },
        {
          "type": "topic",
          "slug": "case-redis-skiplist-ziplist",
          "id": "case-redis-skiplist-ziplist",
          "title": "1.3: Production Case Study: Redis ZSET (Listpack vs SkipList + Dict Dual Indexing)"
        },
        {
          "type": "build",
          "slug": "build-lfu-lru-cache",
          "id": "build-lfu-lru-cache",
          "title": "1.3: Build Lab: O(1) LRU and Frequency-Bucketed LFU Cache Engine"
        },
        {
          "type": "topic",
          "slug": "universal-k-independent-hashing",
          "id": "universal-k-independent-hashing",
          "title": "2.1: Hash Functions: Division, Multiplicative, Universal & k-Independent Families"
        },
        {
          "type": "topic",
          "slug": "separate-chaining-vs-open-addressing",
          "id": "separate-chaining-vs-open-addressing",
          "title": "2.1: Collision Resolution: Separate Chaining vs Linear/Quadratic/Double Probing"
        },
        {
          "type": "topic",
          "slug": "robin-hood-cuckoo-hashing",
          "id": "robin-hood-cuckoo-hashing",
          "title": "2.1: Variance Reduction: Robin Hood Hashing (PSL) & Cuckoo Hashing"
        },
        {
          "type": "topic",
          "slug": "hashdos-siphash-random-seeds",
          "id": "hashdos-siphash-random-seeds",
          "title": "2.1: Algorithmic Complexity Attacks (HashDoS) & SipHash Defense"
        },
        {
          "type": "topic",
          "slug": "consistent-hashing-rendezvous",
          "id": "consistent-hashing-rendezvous",
          "title": "2.1: Consistent Hashing with Bounded Loads & Rendezvous (HRW) Hashing"
        },
        {
          "type": "topic",
          "slug": "bloom-filters-counting-xor",
          "id": "bloom-filters-counting-xor",
          "title": "2.1: Bloom Filters, Counting Bloom Filters, Cuckoo Filters & Xor Filters"
        },
        {
          "type": "topic",
          "slug": "count-min-sketch-heavy-hitters",
          "id": "count-min-sketch-heavy-hitters",
          "title": "2.1: Count-Min Sketch & Streaming Frequency Estimation Error Bounds"
        },
        {
          "type": "topic",
          "slug": "hyperloglog-cardinality",
          "id": "hyperloglog-cardinality",
          "title": "2.1: HyperLogLog: Harmonic Mean & Stochastic Averaging in 1.5 KB"
        },
        {
          "type": "topic",
          "slug": "case-rust-hashbrown-swisstable",
          "id": "case-rust-hashbrown-swisstable",
          "title": "2.1: Production Case Study: Google Abseil SwissTable & Rust hashbrown SIMD Probing"
        },
        {
          "type": "build",
          "slug": "build-robin-hood-hash-map",
          "id": "build-robin-hood-hash-map",
          "title": "2.1: Build Lab: Open-Addressed Robin Hood Hash Table with Tombstone-Free Backward Shift Deletion"
        },
        {
          "type": "topic",
          "slug": "quadratic-sorts-inversions",
          "id": "quadratic-sorts-inversions",
          "title": "2.2: Insertion, Selection & Shellsort: Inversions & Diminishing Increments"
        },
        {
          "type": "topic",
          "slug": "mergesort-bottom-up-inversions",
          "id": "mergesort-bottom-up-inversions",
          "title": "2.2: Top-Down vs Bottom-Up Merge Sort & Counting Inversions in O(N log N)"
        },
        {
          "type": "topic",
          "slug": "quicksort-partition-schemes",
          "id": "quicksort-partition-schemes",
          "title": "2.2: Quicksort: Lomuto vs Hoare vs Bentley-McIlroy 3-Way Partitioning"
        },
        {
          "type": "topic",
          "slug": "randomized-quicksort-expectation",
          "id": "randomized-quicksort-expectation",
          "title": "2.2: Randomized Quicksort: Indicator Random Variables & 1.386 N ln N Proof"
        },
        {
          "type": "topic",
          "slug": "decision-tree-lower-bound",
          "id": "decision-tree-lower-bound",
          "title": "2.2: The Ω(N log N) Comparison Lower Bound via Stirling's Approximation"
        },
        {
          "type": "topic",
          "slug": "counting-radix-bucket-sorts",
          "id": "counting-radix-bucket-sorts",
          "title": "2.2: Non-Comparison Sorts: Counting Sort, LSD/MSD Radix Sort & Bucket Sort"
        },
        {
          "type": "topic",
          "slug": "quickselect-bfprt-median",
          "id": "quickselect-bfprt-median",
          "title": "2.2: Order Statistics: Randomized Quickselect vs Deterministic BFPRT Median-of-Medians"
        },
        {
          "type": "topic",
          "slug": "external-merge-sort-replacement",
          "id": "external-merge-sort-replacement",
          "title": "2.2: External Memory Sorting: K-Way Merge & Replacement Selection"
        },
        {
          "type": "topic",
          "slug": "case-timsort-pdqsort",
          "id": "case-timsort-pdqsort",
          "title": "2.2: Production Case Study: Python/V8 TimSort (Galloping & Run Invariants) vs Rust pdqsort"
        },
        {
          "type": "build",
          "slug": "build-hybrid-introsort-timsort",
          "id": "build-hybrid-introsort-timsort",
          "title": "2.2: Build Lab: Hybrid Adaptive Sort (Run Detection + Insertion + Galloping Merge)"
        },
        {
          "type": "topic",
          "slug": "binary-search-boundary-invariants",
          "id": "binary-search-boundary-invariants",
          "title": "2.3: Closed vs Half-Open Binary Search: Eliminating Off-by-One Infinite Loops"
        },
        {
          "type": "topic",
          "slug": "parametric-search-answer-space",
          "id": "parametric-search-answer-space",
          "title": "2.3: Parametric Search: Binary Searching the Answer Space & Feasibility Predicates"
        },
        {
          "type": "topic",
          "slug": "rotated-bitonic-unbounded-search",
          "id": "rotated-bitonic-unbounded-search",
          "title": "2.3: Exponential (Galloping) Search, Rotated Arrays & Ternary Search on Unimodal Functions"
        },
        {
          "type": "topic",
          "slug": "fractional-cascading",
          "id": "fractional-cascading",
          "title": "2.3: Fractional Cascading: Searching K Sorted Lists in O(log N + K)"
        },
        {
          "type": "topic",
          "slug": "divide-and-conquer-closest-pair",
          "id": "divide-and-conquer-closest-pair",
          "title": "2.3: Geometric Divide-and-Conquer: Planar Closest Pair of Points in O(N log N)"
        },
        {
          "type": "topic",
          "slug": "karatsuba-strassen-algebraic-dc",
          "id": "karatsuba-strassen-algebraic-dc",
          "title": "2.3: Algebraic Divide-and-Conquer: Karatsuba Multiplication & Strassen's Matrix Product"
        },
        {
          "type": "topic",
          "slug": "fast-fourier-transform-polynomials",
          "id": "fast-fourier-transform-polynomials",
          "title": "2.3: Fast Fourier Transform (Cooley-Tukey FFT) & O(N log N) Polynomial Convolution"
        },
        {
          "type": "topic",
          "slug": "meet-in-the-middle-search",
          "id": "meet-in-the-middle-search",
          "title": "2.3: Meet-in-the-Middle: Halving the Exponent from O(2^N) to O(2^(N/2) log(2^(N/2)))"
        },
        {
          "type": "topic",
          "slug": "cdq-divide-and-conquer",
          "id": "cdq-divide-and-conquer",
          "title": "2.3: Offline Divide-and-Conquer over Time (CDQ Divide-and-Conquer for 3D Partial Orders)"
        },
        {
          "type": "topic",
          "slug": "case-git-bisect-eytzinger",
          "id": "case-git-bisect-eytzinger",
          "title": "2.3: Production Case Study: Cache-Friendly Eytzinger Binary Search Layout vs Standard Binary Search"
        },
        {
          "type": "topic",
          "slug": "tree-representations-traversals",
          "id": "tree-representations-traversals",
          "title": "3.1: Tree Representations & Recursive vs Iterative Pre/In/Post/Level-Order Traversals"
        },
        {
          "type": "topic",
          "slug": "morris-threaded-traversal",
          "id": "morris-threaded-traversal",
          "title": "3.1: Morris In-Order Traversal: O(1) Auxiliary Space via Temporary Threading"
        },
        {
          "type": "topic",
          "slug": "tree-serialization-reconstruction",
          "id": "tree-serialization-reconstruction",
          "title": "3.1: Unique Tree Reconstruction (Preorder + Inorder) & Succinct Bit-String Serialization"
        },
        {
          "type": "topic",
          "slug": "bst-operations-hibbard-deletion",
          "id": "bst-operations-hibbard-deletion",
          "title": "3.1: Binary Search Trees: Search, Insertion, Successor & Hibbard Deletion Asymmetry"
        },
        {
          "type": "topic",
          "slug": "randomly-built-bst-height",
          "id": "randomly-built-bst-height",
          "title": "3.1: Randomly Built BSTs: Expected Height O(log N) via Quicksort Dual Proof"
        },
        {
          "type": "topic",
          "slug": "binary-d-ary-heaps",
          "id": "binary-d-ary-heaps",
          "title": "3.1: Binary & d-ary Heaps: Floyd's O(N) Bottom-Up Build-Heap Proof"
        },
        {
          "type": "topic",
          "slug": "mergeable-heaps-binomial-fibonacci",
          "id": "mergeable-heaps-binomial-fibonacci",
          "title": "3.1: Mergeable Priority Queues: Leftist, Skew, Binomial & Fibonacci Heaps (O(1) Decrease-Key)"
        },
        {
          "type": "topic",
          "slug": "two-heaps-k-way-merge-patterns",
          "id": "two-heaps-k-way-merge-patterns",
          "title": "3.1: Priority Queue Patterns: Running Median (Two Heaps), K-Way Merge & Top-K"
        },
        {
          "type": "topic",
          "slug": "case-timer-wheels-vs-heaps",
          "id": "case-timer-wheels-vs-heaps",
          "title": "3.1: Production Case Study: Hierarchical Hashed Timer Wheels vs Four-Heap Timers (Go runtime, Kafka, Linux)"
        },
        {
          "type": "build",
          "slug": "build-indexed-d-ary-priority-queue",
          "id": "build-indexed-d-ary-priority-queue",
          "title": "3.1: Build Lab: Indexed 4-Ary Min/Max Priority Queue with O(log_d N) decreaseKey"
        },
        {
          "type": "topic",
          "slug": "tree-rotations-avl-invariants",
          "id": "tree-rotations-avl-invariants",
          "title": "3.2: Tree Rotations & AVL Trees: Balance Factors, LL/RR/LR/RL Rebalancing & Fibonacci Height Bound"
        },
        {
          "type": "topic",
          "slug": "red-black-llrb-isomorphism",
          "id": "red-black-llrb-isomorphism",
          "title": "3.2: 2-3-4 Trees, Red-Black Trees & Sedgewick's Left-Leaning Red-Black (LLRB) Isomorphism"
        },
        {
          "type": "topic",
          "slug": "treaps-split-merge-paradigm",
          "id": "treaps-split-merge-paradigm",
          "title": "3.2: Randomized Treaps & Implicit Treaps: Rebalancing Without Rotations via split and merge"
        },
        {
          "type": "topic",
          "slug": "splay-trees-dynamic-optimality",
          "id": "splay-trees-dynamic-optimality",
          "title": "3.2: Splay Trees: Zig-Zig / Zig-Zag Rotations, Amortized O(log N) Potential Proof & Static Optimality"
        },
        {
          "type": "topic",
          "slug": "augmented-trees-order-intervals",
          "id": "augmented-trees-order-intervals",
          "title": "3.2: Augmenting BSTs: Order-Statistic Trees (select/rank) & Interval Trees"
        },
        {
          "type": "topic",
          "slug": "b-trees-bplus-trees-disk-pages",
          "id": "b-trees-bplus-trees-disk-pages",
          "title": "3.2: B-Trees & B+ Trees: Page Fanout, Proactive Splitting & Leaf Sibling Chains"
        },
        {
          "type": "topic",
          "slug": "lsm-trees-write-amplification",
          "id": "lsm-trees-write-amplification",
          "title": "3.2: LSM-Trees vs B+ Trees: MemTables, SSTables, Compaction & RUM Conjecture"
        },
        {
          "type": "topic",
          "slug": "persistent-trees-path-copying",
          "id": "persistent-trees-path-copying",
          "title": "3.2: Persistent Data Structures: Path Copying, Fat Nodes & Fractional Cascading Time Travel"
        },
        {
          "type": "topic",
          "slug": "case-linux-rbtree-cfs",
          "id": "case-linux-rbtree-cfs",
          "title": "3.2: Production Case Study: Intrusive Augmented Red-Black Trees in the Linux Kernel CFS & VMA Manager"
        },
        {
          "type": "build",
          "slug": "build-llrb-order-statistic-tree",
          "id": "build-llrb-order-statistic-tree",
          "title": "3.2: Build Lab: Left-Leaning Red-Black (LLRB) Order-Statistic Tree with rank and select"
        },
        {
          "type": "topic",
          "slug": "static-range-queries-sparse-table",
          "id": "static-range-queries-sparse-table",
          "title": "3.3: Disjoint & Standard Sparse Tables: O(1) Idempotent Range Minimum Query (RMQ)"
        },
        {
          "type": "topic",
          "slug": "fenwick-tree-binary-indexed",
          "id": "fenwick-tree-binary-indexed",
          "title": "3.3: Fenwick Trees (Binary Indexed Trees): lowbit Geometry, Point Updates & Range Updates"
        },
        {
          "type": "topic",
          "slug": "segment-trees-bottom-up-monoids",
          "id": "segment-trees-bottom-up-monoids",
          "title": "3.3: Segment Trees over Monoids: Recursive vs Iterative (ZKW) Bottom-Up Implementation"
        },
        {
          "type": "topic",
          "slug": "lazy-propagation-segment-tree-beats",
          "id": "lazy-propagation-segment-tree-beats",
          "title": "3.3: Lazy Propagation & Segment Tree Beats (Ji Driver Segment Tree for Range Chmin/Chmax)"
        },
        {
          "type": "topic",
          "slug": "dynamic-persistent-segment-trees",
          "id": "dynamic-persistent-segment-trees",
          "title": "3.3: Dynamic (Sparse) & Persistent Segment Trees: K-th Smallest in Subarray in O(log N)"
        },
        {
          "type": "topic",
          "slug": "sqrt-decomposition-mos-algorithm",
          "id": "sqrt-decomposition-mos-algorithm",
          "title": "3.3: √N Block Decomposition & Mo's Offline Query Ordering (O((N+Q)√N))"
        },
        {
          "type": "topic",
          "slug": "lowest-common-ancestor-rmq",
          "id": "lowest-common-ancestor-rmq",
          "title": "3.3: Lowest Common Ancestor (LCA): Binary Lifting vs Euler Tour + ±1 RMQ Reduction"
        },
        {
          "type": "topic",
          "slug": "heavy-light-decomposition",
          "id": "heavy-light-decomposition",
          "title": "3.3: Heavy-Light Decomposition (HLD): Decomposing Trees into O(log N) Heavy Paths"
        },
        {
          "type": "topic",
          "slug": "cartesian-trees-treap-duality",
          "id": "cartesian-trees-treap-duality",
          "title": "3.3: Cartesian Trees: Linear-Time Monotonic Stack Construction & RMQ-LCA Duality"
        },
        {
          "type": "build",
          "slug": "build-lazy-segment-tree",
          "id": "build-lazy-segment-tree",
          "title": "3.3: Build Lab: Generic Lazy-Propagating Segment Tree with Range Affine Updates & Queries"
        },
        {
          "type": "topic",
          "slug": "tries-radix-trees-patricia",
          "id": "tries-radix-trees-patricia",
          "title": "4.1: Prefix Tries, Compressed Radix Trees & PATRICIA Trees"
        },
        {
          "type": "topic",
          "slug": "bitwise-tries-max-xor",
          "id": "bitwise-tries-max-xor",
          "title": "4.1: Bitwise (0-1) Tries: Maximum XOR Subarray & Subtree Queries"
        },
        {
          "type": "topic",
          "slug": "rabin-karp-polynomial-rolling-hash",
          "id": "rabin-karp-polynomial-rolling-hash",
          "title": "4.1: Rabin-Karp Rolling Hash: Mersenne Prime Moduli (2^61 - 1) & Birthday Collision Avoidance"
        },
        {
          "type": "topic",
          "slug": "kmp-prefix-function-automaton",
          "id": "kmp-prefix-function-automaton",
          "title": "4.1: Knuth-Morris-Pratt (KMP): Prefix Function π[i] Amortized Linearity & DFA View"
        },
        {
          "type": "topic",
          "slug": "z-algorithm-linear-box",
          "id": "z-algorithm-linear-box",
          "title": "4.1: The Z-Algorithm: Linear-Time [L, R] Z-Box Maintenance & Pattern Matching"
        },
        {
          "type": "topic",
          "slug": "boyer-moore-horspool-simd",
          "id": "boyer-moore-horspool-simd",
          "title": "4.1: Sublinear Average-Case Matching: Boyer-Moore Bad-Character/Good-Suffix & Horspool"
        },
        {
          "type": "topic",
          "slug": "aho-corasick-trie-automaton",
          "id": "aho-corasick-trie-automaton",
          "title": "4.1: Aho-Corasick Automaton: Trie + BFS Failure Links + Dictionary Suffix Links"
        },
        {
          "type": "topic",
          "slug": "manacher-palindromic-tree",
          "id": "manacher-palindromic-tree",
          "title": "4.1: Palindromes in O(N): Manacher's Algorithm & Eertree (Palindromic Automaton)"
        },
        {
          "type": "topic",
          "slug": "case-ripgrep-teddy-simd",
          "id": "case-ripgrep-teddy-simd",
          "title": "4.1: Production Case Study: Why ripgrep Is So Fast (Aho-Corasick, Boyer-Moore & SIMD Teddy)"
        },
        {
          "type": "build",
          "slug": "build-aho-corasick-scanner",
          "id": "build-aho-corasick-scanner",
          "title": "4.1: Build Lab: Multi-Pattern Aho-Corasick Automaton with Overlapping Match Streamer"
        },
        {
          "type": "topic",
          "slug": "suffix-trees-ukkonen-intuition",
          "id": "suffix-trees-ukkonen-intuition",
          "title": "4.2: Suffix Trees & Ukkonen's Online O(N) Construction: Active Point & Suffix Links"
        },
        {
          "type": "topic",
          "slug": "suffix-arrays-prefix-doubling-sais",
          "id": "suffix-arrays-prefix-doubling-sais",
          "title": "4.2: Suffix Arrays: Manber-Myers O(N log N) Prefix Doubling & SA-IS O(N) Overview"
        },
        {
          "type": "topic",
          "slug": "kasai-lcp-array-rmq",
          "id": "kasai-lcp-array-rmq",
          "title": "4.2: Kasai's O(N) LCP Array Algorithm & Counting Distinct Substrings via SA + LCP"
        },
        {
          "type": "topic",
          "slug": "suffix-automaton-sam-endpos",
          "id": "suffix-automaton-sam-endpos",
          "title": "4.2: Suffix Automaton (SAM / DAWG): endpos Equivalence Classes & State Transitions"
        },
        {
          "type": "topic",
          "slug": "burrows-wheeler-transform-fm-index",
          "id": "burrows-wheeler-transform-fm-index",
          "title": "4.2: Burrows-Wheeler Transform (BWT), Last-to-First (LF) Mapping & FM-Index Substring Search"
        },
        {
          "type": "topic",
          "slug": "thompson-nfa-vs-backtracking-regex",
          "id": "thompson-nfa-vs-backtracking-regex",
          "title": "4.2: Regular Expression Engines: Thompson's O(NM) NFA Simulation vs Catastrophic ReDoS Backtracking"
        },
        {
          "type": "topic",
          "slug": "myers-diff-hirschberg-lcs",
          "id": "myers-diff-hirschberg-lcs",
          "title": "4.2: Myers O(ND) Shortest Edit Script & Hirschberg's Linear-Space Alignment"
        },
        {
          "type": "topic",
          "slug": "huffman-lz77-deflate",
          "id": "huffman-lz77-deflate",
          "title": "4.2: Lossless Compression: Huffman Optimality Proof, LZ77 Sliding Window & DEFLATE"
        },
        {
          "type": "topic",
          "slug": "case-git-myers-histogram-diff",
          "id": "case-git-myers-histogram-diff",
          "title": "4.2: Production Case Study: Inside git diff (Myers vs Patience vs Histogram Diff)"
        },
        {
          "type": "build",
          "slug": "build-thompson-nfa-regex-engine",
          "id": "build-thompson-nfa-regex-engine",
          "title": "4.2: Build Lab: ReDoS-Proof Regular Expression Engine via Thompson's Construction & NFA Step Simulation"
        },
        {
          "type": "topic",
          "slug": "graph-representations-csr-cache",
          "id": "graph-representations-csr-cache",
          "title": "5.1: Graph Representations: Adjacency Lists, Bit Matrices & Compressed Sparse Row (CSR)"
        },
        {
          "type": "topic",
          "slug": "bfs-01-bfs-multi-source",
          "id": "bfs-01-bfs-multi-source",
          "title": "5.1: Breadth-First Search: Multi-Source BFS, 0-1 BFS (Deque) & Bidirectional Search"
        },
        {
          "type": "topic",
          "slug": "dfs-edge-classification-timestamps",
          "id": "dfs-edge-classification-timestamps",
          "title": "5.1: Depth-First Search: Parenthesis Theorem, White-Path Theorem & Tree/Back/Forward/Cross Edges"
        },
        {
          "type": "topic",
          "slug": "topological-sort-kahn-dfs",
          "id": "topological-sort-kahn-dfs",
          "title": "5.1: Directed Acyclic Graphs (DAGs): Kahn's Indegree Queue vs DFS Post-Order Reversal"
        },
        {
          "type": "topic",
          "slug": "bipartite-graphs-2-coloring",
          "id": "bipartite-graphs-2-coloring",
          "title": "5.1: Bipartite Graphs: Odd-Cycle Characterization & 2-Coloring Verification"
        },
        {
          "type": "topic",
          "slug": "bridges-articulation-biconnected",
          "id": "bridges-articulation-biconnected",
          "title": "5.1: Undirected Connectivity: Tarjan's tin/low Algorithm for Bridges, Cut Vertices & BCCs"
        },
        {
          "type": "topic",
          "slug": "scc-tarjan-kosaraju-2sat",
          "id": "scc-tarjan-kosaraju-2sat",
          "title": "5.1: Strongly Connected Components: Kosaraju's Two-Pass vs Tarjan's Single-Pass Stack & 2-SAT"
        },
        {
          "type": "topic",
          "slug": "eulerian-paths-hierholzer",
          "id": "eulerian-paths-hierholzer",
          "title": "5.1: Eulerian Trails & Circuits: Degree Conditions & Hierholzer's O(E) Algorithm"
        },
        {
          "type": "topic",
          "slug": "case-bundler-build-graph-cycles",
          "id": "case-bundler-build-graph-cycles",
          "title": "5.1: Production Case Study: Topological Scheduling & SCC Cycle Reporting in Build Systems (bazel, turborepo, cargo)"
        },
        {
          "type": "build",
          "slug": "build-tarjan-scc-2sat-solver",
          "id": "build-tarjan-scc-2sat-solver",
          "title": "5.1: Build Lab: Tarjan's SCC Condensation DAG & Linear-Time 2-SAT Constraint Solver"
        },
        {
          "type": "topic",
          "slug": "disjoint-set-union-ackermann",
          "id": "disjoint-set-union-ackermann",
          "title": "5.2: Disjoint Set Union (Union-Find): Union by Rank + Path Compression & O(α(N)) Proof Intuition"
        },
        {
          "type": "topic",
          "slug": "dsu-rollback-weighted-offline",
          "id": "dsu-rollback-weighted-offline",
          "title": "5.2: Weighted DSU (Potentials/Parity) & Rollback DSU for Dynamic Connectivity Over Time"
        },
        {
          "type": "topic",
          "slug": "mst-cut-cycle-properties",
          "id": "mst-cut-cycle-properties",
          "title": "5.2: Minimum Spanning Trees: Cut & Cycle Optimality Properties, Kruskal's, Prim's & Borůvka's"
        },
        {
          "type": "topic",
          "slug": "dijkstra-relaxation-invariants",
          "id": "dijkstra-relaxation-invariants",
          "title": "5.2: Dijkstra's Algorithm: Non-Negative Edge Invariant, Priority Queue Tradeoffs & Dial's Bucket Queue"
        },
        {
          "type": "topic",
          "slug": "astar-heuristic-admissibility",
          "id": "astar-heuristic-admissibility",
          "title": "5.2: A* Search & Bidirectional A*: Admissibility, Consistency (Triangle Inequality) & Optimality Proof"
        },
        {
          "type": "topic",
          "slug": "bellman-ford-spfa-difference-constraints",
          "id": "bellman-ford-spfa-difference-constraints",
          "title": "5.2: Negative Weights: Bellman-Ford, Negative Cycle Reconstruction & Systems of Difference Constraints"
        },
        {
          "type": "topic",
          "slug": "floyd-warshall-johnson-apsp",
          "id": "floyd-warshall-johnson-apsp",
          "title": "5.2: All-Pairs Shortest Paths: Floyd-Warshall DP Transitive Closure & Johnson's Potential Reweighting"
        },
        {
          "type": "topic",
          "slug": "state-space-dijkstra-layered-graphs",
          "id": "state-space-dijkstra-layered-graphs",
          "title": "5.2: Modeling Problems as State-Space Graphs: Layered Graphs ((u, k) States) & Bitmask Dijkstra"
        },
        {
          "type": "topic",
          "slug": "case-osrm-contraction-hierarchies",
          "id": "case-osrm-contraction-hierarchies",
          "title": "5.2: Production Case Study: How Continental Road Routing Works in 1 Millisecond (Contraction Hierarchies & Hub Labeling)"
        },
        {
          "type": "build",
          "slug": "build-astar-bidirectional-router",
          "id": "build-astar-bidirectional-router",
          "title": "5.2: Build Lab: A* and Bidirectional Dijkstra Pathfinding Engine with Consistent Potentials"
        },
        {
          "type": "topic",
          "slug": "flow-networks-residual-graphs",
          "id": "flow-networks-residual-graphs",
          "title": "5.3: Flow Networks, Residual Capacities, Augmenting Paths & Ford-Fulkerson Method"
        },
        {
          "type": "topic",
          "slug": "max-flow-min-cut-theorem",
          "id": "max-flow-min-cut-theorem",
          "title": "5.3: The Max-Flow Min-Cut Theorem: Three-Way Equivalence Proof & Integrality Theorem"
        },
        {
          "type": "topic",
          "slug": "edmonds-karp-shortest-augmenting",
          "id": "edmonds-karp-shortest-augmenting",
          "title": "5.3: Edmonds-Karp Algorithm: BFS Shortest Augmenting Paths & O(V E^2) Monotonic Distance Proof"
        },
        {
          "type": "topic",
          "slug": "dinic-level-graph-blocking-flow",
          "id": "dinic-level-graph-blocking-flow",
          "title": "5.3: Dinic's Algorithm: BFS Level Graphs, DFS Blocking Flows with Current-Arc Pointer & O(E√V) Unit Networks"
        },
        {
          "type": "topic",
          "slug": "push-relabel-preflow",
          "id": "push-relabel-preflow",
          "title": "5.3: Push-Relabel (Goldberg-Tarjan): Preflows, Height Functions & Highest-Label Selection"
        },
        {
          "type": "topic",
          "slug": "bipartite-matching-hopcroft-karp",
          "id": "bipartite-matching-hopcroft-karp",
          "title": "5.3: Maximum Bipartite Matching: König's Theorem, Hall's Marriage Theorem & Hopcroft-Karp O(E√V)"
        },
        {
          "type": "topic",
          "slug": "weighted-matching-hungarian",
          "id": "weighted-matching-hungarian",
          "title": "5.3: Minimum-Weight Bipartite Matching: Kuhn-Munkres (Hungarian Algorithm) & Primal-Dual Potentials"
        },
        {
          "type": "topic",
          "slug": "min-cost-max-flow-mcmf",
          "id": "min-cost-max-flow-mcmf",
          "title": "5.3: Minimum-Cost Maximum Flow (MCMF): Successive Shortest Paths with Johnson Potentials"
        },
        {
          "type": "topic",
          "slug": "flow-reductions-project-selection",
          "id": "flow-reductions-project-selection",
          "title": "5.3: Network Flow Modeling Patterns: Closure Problem (Project Selection), Circulation with Demands & Image Segmentation"
        },
        {
          "type": "build",
          "slug": "build-dinic-max-flow-engine",
          "id": "build-dinic-max-flow-engine",
          "title": "5.3: Build Lab: Dinic's Maximum Flow, Min-Cut Partitioning & Bipartite Matching Engine"
        },
        {
          "type": "topic",
          "slug": "combinatorial-generation-permutations",
          "id": "combinatorial-generation-permutations",
          "title": "6.1: Combinatorial Generation: Subsets, Lexicographic Permutations (Narayana) & Gray Codes"
        },
        {
          "type": "topic",
          "slug": "backtracking-state-space-trees",
          "id": "backtracking-state-space-trees",
          "title": "6.1: Backtracking Architecture: Choice, Constraint, Undo & Symmetry-Breaking Pruning"
        },
        {
          "type": "topic",
          "slug": "exact-cover-knuth-algorithm-x",
          "id": "exact-cover-knuth-algorithm-x",
          "title": "6.1: Exact Cover & Knuth's Algorithm X with Dancing Links (DLX)"
        },
        {
          "type": "topic",
          "slug": "branch-and-bound-admissible-bounds",
          "id": "branch-and-bound-admissible-bounds",
          "title": "6.1: Branch and Bound: Best-First / DFS Relaxation Bounds for Combinatorial Optimization"
        },
        {
          "type": "topic",
          "slug": "minimax-alpha-beta-pruning",
          "id": "minimax-alpha-beta-pruning",
          "title": "6.1: Game Trees: Minimax, Alpha-Beta Pruning, Move Ordering & Zobrist Transposition Tables"
        },
        {
          "type": "topic",
          "slug": "greedy-choice-exchange-arguments",
          "id": "greedy-choice-exchange-arguments",
          "title": "6.1: Proving Greedy Correctness: Greedy Stays Ahead & Exchange Arguments (Interval Scheduling, Minimizing Lateness)"
        },
        {
          "type": "topic",
          "slug": "matroids-greedy-foundations",
          "id": "matroids-greedy-foundations",
          "title": "6.1: Matroid Theory: Graphic & Linear Matroids and When the Greedy Algorithm Is Guaranteed Optimal"
        },
        {
          "type": "topic",
          "slug": "regret-greedy-heap-rollback",
          "id": "regret-greedy-heap-rollback",
          "title": "6.1: Regret Greedy (Undoable Greedy with Priority Queues): Scheduling with Deadlines & Stock Trading"
        },
        {
          "type": "topic",
          "slug": "case-sat-solvers-cdcl-dpll",
          "id": "case-sat-solvers-cdcl-dpll",
          "title": "6.1: Production Case Study: Modern SAT Solvers & Package Dependency Resolution (DPLL, Unit Propagation & Two-Watched Literals)"
        },
        {
          "type": "build",
          "slug": "build-dancing-links-exact-cover",
          "id": "build-dancing-links-exact-cover",
          "title": "6.1: Build Lab: Knuth's Dancing Links (DLX) Exact Cover & Constraint Satisfaction Solver"
        },
        {
          "type": "topic",
          "slug": "dp-optimal-substructure-dag",
          "id": "dp-optimal-substructure-dag",
          "title": "6.2: Dynamic Programming as Shortest Paths on an Implicit DAG: Optimal Substructure & SRTBOT Framework"
        },
        {
          "type": "topic",
          "slug": "memoization-tabulation-space-rolling",
          "id": "memoization-tabulation-space-rolling",
          "title": "6.2: Top-Down Memoization vs Bottom-Up Tabulation & Rolling-Array Space Compression"
        },
        {
          "type": "topic",
          "slug": "knapsack-family-01-unbounded-bounded",
          "id": "knapsack-family-01-unbounded-bounded",
          "title": "6.2: The Knapsack Family: 0/1, Unbounded, Subset Sum Bitset & Bounded Knapsack (Binary Splitting / Monotonic Queue)"
        },
        {
          "type": "topic",
          "slug": "lis-patience-sorting",
          "id": "lis-patience-sorting",
          "title": "6.2: Longest Increasing Subsequence (LIS): O(N^2) DP vs O(N log N) Patience Sorting & Dilworth's Theorem"
        },
        {
          "type": "topic",
          "slug": "sequence-dp-lcs-levenshtein",
          "id": "sequence-dp-lcs-levenshtein",
          "title": "6.2: Sequence Alignment DP: Longest Common Subsequence (LCS) & Wagner-Fischer Edit Distance"
        },
        {
          "type": "topic",
          "slug": "interval-dp-matrix-chain-triangulation",
          "id": "interval-dp-matrix-chain-triangulation",
          "title": "6.2: Interval DP: Matrix Chain Multiplication, Optimal BST & Polygon Triangulation"
        },
        {
          "type": "topic",
          "slug": "tree-dp-rerooting-technique",
          "id": "tree-dp-rerooting-technique",
          "title": "6.2: DP on Trees: Maximum Independent Set, Subtree Knapsack (O(N^2) Amortized Proof) & All-Roots Rerooting"
        },
        {
          "type": "topic",
          "slug": "dag-dp-longest-path-counting",
          "id": "dag-dp-longest-path-counting",
          "title": "6.2: DP on DAGs: Longest Path, Path Counting & Topological State Propagation"
        },
        {
          "type": "topic",
          "slug": "case-pretty-printing-knuth-plass",
          "id": "case-pretty-printing-knuth-plass",
          "title": "6.2: Production Case Study: Knuth-Plass Line Breaking in TeX & Code Formatters (prettier, rustfmt)"
        },
        {
          "type": "build",
          "slug": "build-hirschberg-linear-space-diff",
          "id": "build-hirschberg-linear-space-diff",
          "title": "6.2: Build Lab: Hirschberg's O(NM)-Time O(min(N,M))-Space Sequence Alignment & Diff Reconstructor"
        },
        {
          "type": "topic",
          "slug": "bitmask-dp-tsp-hamiltonian",
          "id": "bitmask-dp-tsp-hamiltonian",
          "title": "6.3: Bitmask DP: Held-Karp O(N^2 2^N) Traveling Salesperson & Submask Enumeration (O(3^N) Proof)"
        },
        {
          "type": "topic",
          "slug": "sos-dp-fast-zeta-mobius",
          "id": "sos-dp-fast-zeta-mobius",
          "title": "6.3: Sum Over Subsets (SOS) DP & Fast Walsh-Hadamard Transform (FWHT) for Bitwise Convolutions"
        },
        {
          "type": "topic",
          "slug": "digit-dp-lexicographic-automata",
          "id": "digit-dp-lexicographic-automata",
          "title": "6.3: Digit DP: Counting Constrained Integers in [L, R] via Tight/Leading-Zero State Automata"
        },
        {
          "type": "topic",
          "slug": "broken-profile-dp-grid-tiling",
          "id": "broken-profile-dp-grid-tiling",
          "title": "6.3: Broken Profile (Plug) DP: Domino Tilings & Grid Connectivity in O(N M 2^M)"
        },
        {
          "type": "topic",
          "slug": "divide-and-conquer-dp-quadrangle",
          "id": "divide-and-conquer-dp-quadrangle",
          "title": "6.3: Divide-and-Conquer DP Optimization & Quadrangle Inequality (Monge Matrices)"
        },
        {
          "type": "topic",
          "slug": "knuth-optimization-optimal-bst",
          "id": "knuth-optimization-optimal-bst",
          "title": "6.3: Knuth-Yao Optimization: Reducing Interval DP from O(N^3) to O(N^2)"
        },
        {
          "type": "topic",
          "slug": "convex-hull-trick-li-chao-tree",
          "id": "convex-hull-trick-li-chao-tree",
          "title": "6.3: Convex Hull Trick (CHT) & Li Chao Segment Tree: Optimizing dp[i] = min_j (m_j x_i + b_j)"
        },
        {
          "type": "topic",
          "slug": "aliens-trick-wqs-binary-search",
          "id": "aliens-trick-wqs-binary-search",
          "title": "6.3: Aliens Trick (WQS Binary Search / Lagrangian Relaxation): Removing Cardinality Constraints"
        },
        {
          "type": "topic",
          "slug": "matrix-exponentiation-linear-recurrences",
          "id": "matrix-exponentiation-linear-recurrences",
          "title": "6.3: Matrix Exponentiation & Min-Plus (Tropical) Semiring Matrix Multiplication for Fixed-Length Paths"
        },
        {
          "type": "build",
          "slug": "build-li-chao-convex-hull-dp",
          "id": "build-li-chao-convex-hull-dp",
          "title": "6.3: Build Lab: Dynamic Li Chao Tree & Monotonic Convex Hull Trick Optimizer"
        },
        {
          "type": "topic",
          "slug": "geometry-primitives-orientation-ccw",
          "id": "geometry-primitives-orientation-ccw",
          "title": "6.4: Robust Computational Geometry Primitives: 2D Cross/Dot Products, CCW Orientation & Segment Intersection"
        },
        {
          "type": "topic",
          "slug": "convex-hull-graham-andrew",
          "id": "convex-hull-graham-andrew",
          "title": "6.4: 2D Convex Hull: Graham Scan vs Andrew's Monotone Chain & Rotating Calipers"
        },
        {
          "type": "topic",
          "slug": "sweep-line-bentley-ottmann",
          "id": "sweep-line-bentley-ottmann",
          "title": "6.4: Sweep-Line Paradigm: Bentley-Ottmann Segment Intersection & Area of Union of Rectangles"
        },
        {
          "type": "topic",
          "slug": "spatial-indexing-kd-quad-rtrees",
          "id": "spatial-indexing-kd-quad-rtrees",
          "title": "6.4: Multidimensional Spatial Indexing: k-d Trees, Quadtrees, R-Trees & Z-Order (Morton) Curves"
        },
        {
          "type": "topic",
          "slug": "modular-arithmetic-gcd-crt",
          "id": "modular-arithmetic-gcd-crt",
          "title": "6.4: Algorithmic Number Theory: Extended Euclidean Algorithm, Modular Inverse, CRT & Sieve of Eratosthenes"
        },
        {
          "type": "topic",
          "slug": "primality-miller-rabin-pollard-rho",
          "id": "primality-miller-rabin-pollard-rho",
          "title": "6.4: Randomized Number Theory: Miller-Rabin Primality Testing & Pollard's ρ Integer Factorization"
        },
        {
          "type": "topic",
          "slug": "las-vegas-monte-carlo-karger",
          "id": "las-vegas-monte-carlo-karger",
          "title": "6.4: Las Vegas vs Monte Carlo Algorithms: Karger's Randomized Min-Cut & Freivalds' Matrix Verification"
        },
        {
          "type": "topic",
          "slug": "np-completeness-reductions",
          "id": "np-completeness-reductions",
          "title": "6.4: P, NP, NP-Hardness & Polynomial-Time Reductions (3-SAT ≤p Independent Set ≤p Vertex Cover ≤p Subset Sum)"
        },
        {
          "type": "topic",
          "slug": "approximation-algorithms-fptas",
          "id": "approximation-algorithms-fptas",
          "title": "6.4: Approximation Algorithms: 2-Approx Vertex Cover, Greedy ln N Set Cover, Metric TSP & Knapsack FPTAS"
        },
        {
          "type": "build",
          "slug": "build-kd-tree-nearest-neighbor",
          "id": "build-kd-tree-nearest-neighbor",
          "title": "6.4: Build Lab: 2D/3D k-d Tree with Bounding-Box Pruning for K-Nearest Neighbor & Range Search"
        }
      ]
    }
  ],
  "modules": [
    {
      "id": "m01",
      "number": "1.1",
      "trackId": "track-1",
      "trackTitle": "Foundations, Memory Hierarchy & Linear Structures",
      "title": "Asymptotic Analysis, Recurrences & Memory Hierarchy",
      "difficulty": "Beginner → Intermediate",
      "unitCount": 10,
      "builds": [],
      "simulators": [
        "cache-line-traversal"
      ],
      "summary": "Why constant factors and 64-byte cache lines matter alongside O(N), recurrence proofs (Master & Akra-Bazzi), and potential-method amortized analysis.",
      "icon": "cpu",
      "prerequisites": []
    },
    {
      "id": "m02",
      "number": "1.2",
      "trackId": "track-1",
      "trackTitle": "Foundations, Memory Hierarchy & Linear Structures",
      "title": "Contiguous Arrays, Bit Manipulation & Pointer Idioms",
      "difficulty": "Beginner → Intermediate",
      "unitCount": 10,
      "builds": [
        "build-dynamic-circular-deque"
      ],
      "simulators": [
        "dynamic-array-amortized",
        "two-pointers-sliding-window"
      ],
      "summary": "Geometric array resizing, prefix sums, two-pointer loop invariants, two's-complement bit manipulation, SWAR parallelism, and heavy hitters.",
      "icon": "layers",
      "prerequisites": [
        "m01"
      ]
    },
    {
      "id": "m03",
      "number": "1.3",
      "trackId": "track-1",
      "trackTitle": "Foundations, Memory Hierarchy & Linear Structures",
      "title": "Linked Structures, Monotonic Stacks/Queues & Cache-Conscious Lists",
      "difficulty": "Intermediate",
      "unitCount": 10,
      "builds": [
        "build-lfu-lru-cache"
      ],
      "simulators": [
        "deque-monotonic-queue",
        "monotonic-stack-histogram",
        "skiplist-tower-search"
      ],
      "summary": "Intrusive linked lists, Floyd/Brent cycle detection, unrolled lists, probabilistic skip lists, monotonic stacks/deques, and O(1) LRU/LFU caches.",
      "icon": "git-commit",
      "prerequisites": [
        "m02"
      ]
    },
    {
      "id": "m04",
      "number": "2.1",
      "trackId": "track-2",
      "trackTitle": "Hashing, Sorting & Divide-and-Conquer",
      "title": "Hash Tables, Modern Probing & Probabilistic Sketches",
      "difficulty": "Intermediate → Advanced",
      "unitCount": 10,
      "builds": [
        "build-robin-hood-hash-map"
      ],
      "simulators": [
        "robin-hood-probing",
        "swisstable-simd-probe",
        "bloom-cuckoo-filter",
        "consistent-hashing-ring"
      ],
      "summary": "Universal hash families, Robin Hood & Cuckoo probing, SipHash HashDoS defense, consistent hashing, Bloom/Cuckoo/Xor filters, CMS, and HyperLogLog.",
      "icon": "hash",
      "prerequisites": [
        "m02",
        "m03"
      ]
    },
    {
      "id": "m05",
      "number": "2.2",
      "trackId": "track-2",
      "trackTitle": "Hashing, Sorting & Divide-and-Conquer",
      "title": "Sorting Mechanics, Hybrid Sorts & Linear-Time Order Statistics",
      "difficulty": "Intermediate",
      "unitCount": 10,
      "builds": [
        "build-hybrid-introsort-timsort"
      ],
      "simulators": [
        "quicksort-3way-partition"
      ],
      "summary": "Inversions, top-down/bottom-up MergeSort, 3-way QuickSort, Ω(N log N) lower bound, RadixSort, Quickselect/BFPRT, external sorting, and TimSort/pdqsort.",
      "icon": "bar-chart-2",
      "prerequisites": [
        "m01",
        "m02"
      ]
    },
    {
      "id": "m06",
      "number": "2.3",
      "trackId": "track-2",
      "trackTitle": "Hashing, Sorting & Divide-and-Conquer",
      "title": "Binary Search on Monotonic Spaces & Divide-and-Conquer",
      "difficulty": "Intermediate → Advanced",
      "unitCount": 10,
      "builds": [],
      "simulators": [
        "eytzinger-binary-search"
      ],
      "summary": "Half-open binary search invariants, Megiddo parametric search, galloping/ternary search, fractional cascading, closest pair, Karatsuba/Strassen, FFT, and CDQ.",
      "icon": "search",
      "prerequisites": [
        "m05"
      ]
    },
    {
      "id": "m07",
      "number": "3.1",
      "trackId": "track-3",
      "trackTitle": "Trees, Balanced Hierarchies & Range Queries",
      "title": "Binary Trees, Traversals, BSTs & Priority Heaps",
      "difficulty": "Beginner → Intermediate",
      "unitCount": 10,
      "builds": [
        "build-indexed-d-ary-priority-queue"
      ],
      "simulators": [
        "heap-floyd-build"
      ],
      "summary": "Tree representations, Morris O(1)-space threading, succinct serialization, Hibbard BST deletion, d-ary/Fibonacci heaps, and timer wheels.",
      "icon": "git-branch",
      "prerequisites": [
        "m03",
        "m06"
      ]
    },
    {
      "id": "m08",
      "number": "3.2",
      "trackId": "track-3",
      "trackTitle": "Trees, Balanced Hierarchies & Range Queries",
      "title": "Self-Balancing, Augmented, Disk-Backed & Persistent Trees",
      "difficulty": "Advanced",
      "unitCount": 10,
      "builds": [
        "build-llrb-order-statistic-tree"
      ],
      "simulators": [
        "avl-llrb-rotations",
        "treap-split-merge",
        "splay-tree-zig-zig",
        "bplus-tree-page-split"
      ],
      "summary": "AVL trees, Red-Black & Sedgewick LLRB trees, randomized Treaps, Splay trees, Order-Statistic/Interval trees, B+ vs LSM trees, and persistence.",
      "icon": "shield",
      "prerequisites": [
        "m07"
      ]
    },
    {
      "id": "m09",
      "number": "3.3",
      "trackId": "track-3",
      "trackTitle": "Trees, Balanced Hierarchies & Range Queries",
      "title": "Range Query & Sublinear Decomposition Structures",
      "difficulty": "Advanced → Staff",
      "unitCount": 10,
      "builds": [
        "build-lazy-segment-tree"
      ],
      "simulators": [
        "fenwick-bit-geometry",
        "segment-tree-lazy"
      ],
      "summary": "Sparse Tables, Fenwick Trees (BIT), bottom-up/lazy/beats/persistent Segment Trees, Sqrt Decomposition, Mo's Algorithm, LCA, HLD, and Cartesian Trees.",
      "icon": "sliders",
      "prerequisites": [
        "m02",
        "m07",
        "m08"
      ]
    },
    {
      "id": "m10",
      "number": "4.1",
      "trackId": "track-4",
      "trackTitle": "Strings, Automata & Information Retrieval",
      "title": "Tries, Exact String Matching & Multi-Pattern Automata",
      "difficulty": "Intermediate → Advanced",
      "unitCount": 10,
      "builds": [
        "build-aho-corasick-scanner"
      ],
      "simulators": [
        "kmp-z-automaton",
        "aho-corasick-trie"
      ],
      "summary": "Radix/PATRICIA tries, bitwise XOR tries, Rabin-Karp 2^61-1 rolling hashes, KMP, Z-algorithm, Boyer-Moore, Aho-Corasick, Manacher, and ripgrep internals.",
      "icon": "type",
      "prerequisites": [
        "m04",
        "m07"
      ]
    },
    {
      "id": "m11",
      "number": "4.2",
      "trackId": "track-4",
      "trackTitle": "Strings, Automata & Information Retrieval",
      "title": "Suffix Structures, Sequence Alignment & Data Compression",
      "difficulty": "Advanced → Staff",
      "unitCount": 10,
      "builds": [
        "build-thompson-nfa-regex-engine"
      ],
      "simulators": [
        "suffix-array-kasai-lcp",
        "thompson-nfa-lockstep"
      ],
      "summary": "Ukkonen Suffix Trees, Manber-Myers/SA-IS Suffix Arrays, Kasai LCP, Suffix Automata (SAM), BWT/FM-Index, Thompson NFA regex, Myers diff, and Huffman/LZ77.",
      "icon": "file-text",
      "prerequisites": [
        "m05",
        "m10"
      ]
    },
    {
      "id": "m12",
      "number": "5.1",
      "trackId": "track-5",
      "trackTitle": "Graph Theory, Shortest Paths & Network Flow",
      "title": "Graph Representations, Traversals, Connectivity & Topological Order",
      "difficulty": "Intermediate → Advanced",
      "unitCount": 10,
      "builds": [
        "build-tarjan-scc-2sat-solver"
      ],
      "simulators": [
        "tarjan-scc-condensation"
      ],
      "summary": "CSR arrays, 0-1 BFS, DFS parenthesis/edge theorems, Kahn/DFS topological sort, bipartite 2-coloring, Tarjan bridges/cut vertices/SCCs, 2-SAT, and Eulerian trails.",
      "icon": "share-2",
      "prerequisites": [
        "m03",
        "m07"
      ]
    },
    {
      "id": "m13",
      "number": "5.2",
      "trackId": "track-5",
      "trackTitle": "Graph Theory, Shortest Paths & Network Flow",
      "title": "Disjoint Sets, Minimum Spanning Trees & Shortest Paths",
      "difficulty": "Intermediate → Advanced",
      "unitCount": 10,
      "builds": [
        "build-astar-bidirectional-router"
      ],
      "simulators": [
        "dsu-path-compression",
        "dijkstra-astar-frontier",
        "bellman-ford-negative-cycle",
        "kruskal-prim-mst"
      ],
      "summary": "DSU α(N) inverse Ackermann, weighted/rollback DSU, Kruskal/Prim/Borůvka MST, Dijkstra, A*, Bellman-Ford difference constraints, Floyd-Warshall/Johnson, and Contraction Hierarchies.",
      "icon": "navigation",
      "prerequisites": [
        "m07",
        "m12"
      ]
    },
    {
      "id": "m14",
      "number": "5.3",
      "trackId": "track-5",
      "trackTitle": "Graph Theory, Shortest Paths & Network Flow",
      "title": "Network Flow, Min-Cut & Bipartite Matching",
      "difficulty": "Advanced → Staff",
      "unitCount": 10,
      "builds": [
        "build-dinic-max-flow-engine"
      ],
      "simulators": [
        "dinic-level-blocking-flow"
      ],
      "summary": "Residual networks, Max-Flow Min-Cut theorem, Edmonds-Karp, Dinic's blocking flow, Push-Relabel, Hopcroft-Karp, Hungarian algorithm, MCMF, and flow reductions.",
      "icon": "activity",
      "prerequisites": [
        "m12",
        "m13"
      ]
    },
    {
      "id": "m15",
      "number": "6.1",
      "trackId": "track-6",
      "trackTitle": "Dynamic Programming, Combinatorial Search & Advanced Paradigms",
      "title": "Recursion, Backtracking, Pruning & Greedy Exchange Arguments",
      "difficulty": "Intermediate → Advanced",
      "unitCount": 10,
      "builds": [
        "build-dancing-links-exact-cover"
      ],
      "simulators": [
        "dancing-links-dlx"
      ],
      "summary": "Lexicographic permutations, Gray codes, backtracking symmetry pruning, Knuth Algorithm X (DLX), Branch & Bound, Alpha-Beta minimax, greedy exchange proofs, matroids, and SAT solvers.",
      "icon": "compass",
      "prerequisites": [
        "m12",
        "m13"
      ]
    },
    {
      "id": "m16",
      "number": "6.2",
      "trackId": "track-6",
      "trackTitle": "Dynamic Programming, Combinatorial Search & Advanced Paradigms",
      "title": "Dynamic Programming Foundations & Classical Archetypes",
      "difficulty": "Intermediate → Advanced",
      "unitCount": 10,
      "builds": [
        "build-hirschberg-linear-space-diff"
      ],
      "simulators": [
        "knapsack-rolling-dp",
        "myers-diff-edit-graph"
      ],
      "summary": "SRTBOT DAG framework, memoization vs tabulation, rolling arrays, 0/1/Unbounded/Bounded Knapsack, LIS patience sorting, LCS/Edit Distance, Interval DP, Tree rerooting DP, and Knuth-Plass.",
      "icon": "grid",
      "prerequisites": [
        "m06",
        "m15"
      ]
    },
    {
      "id": "m17",
      "number": "6.3",
      "trackId": "track-6",
      "trackTitle": "Dynamic Programming, Combinatorial Search & Advanced Paradigms",
      "title": "Advanced DP State Spaces & Algebraic Optimizations",
      "difficulty": "Advanced → Grandmaster",
      "unitCount": 10,
      "builds": [
        "build-li-chao-convex-hull-dp"
      ],
      "simulators": [
        "bitmask-tsp-sos",
        "li-chao-convex-hull"
      ],
      "summary": "Bitmask Held-Karp & O(3^N) submasks, SOS DP & FWHT, Digit DP, Broken-Profile DP, D&C Quadrangle Inequality, Knuth Optimization, CHT & Li Chao Tree, Aliens Trick (WQS), and Tropical Matrices.",
      "icon": "zap",
      "prerequisites": [
        "m02",
        "m16"
      ]
    },
    {
      "id": "m18",
      "number": "6.4",
      "trackId": "track-6",
      "trackTitle": "Dynamic Programming, Combinatorial Search & Advanced Paradigms",
      "title": "Computational Geometry, Number Theory, Randomized & Approximation Algorithms",
      "difficulty": "Advanced → Grandmaster",
      "unitCount": 10,
      "builds": [
        "build-kd-tree-nearest-neighbor"
      ],
      "simulators": [
        "convex-hull-monotone-chain"
      ],
      "summary": "CCW orientation predicates, Graham/Andrew Convex Hull, Rotating Calipers, Bentley-Ottmann sweep line, k-d/R-trees, Extended GCD/CRT, Miller-Rabin/Pollard-ρ, Karger Min-Cut, NP reductions, and FPTAS.",
      "icon": "hexagon",
      "prerequisites": [
        "m06",
        "m09",
        "m17"
      ]
    }
  ]
};

  // Alias careerPaths to paths so both js/roadmap.js, js/dashboard.js, and js/search.js work seamlessly
  ROADMAP_DATA.careerPaths = ROADMAP_DATA.paths;

  root.ROADMAP_DATA = ROADMAP_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
