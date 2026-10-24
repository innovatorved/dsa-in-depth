// Auto-generated DSA From-Scratch Projects & Build Showcase Catalog (22 Projects)
(function() {
  const data = [
  {
    "id": "build-dynamic-circular-deque",
    "slug": "build-dynamic-circular-deque",
    "name": "build-dynamic-circular-deque",
    "title": "Dynamic Circular Buffer & Amortized O(1) Vector",
    "category": "Linear Structures & Memory",
    "difficulty": "Intermediate",
    "estimatedMinutes": 30,
    "summary": "A cache-contiguous circular ring buffer and dynamic vector using power-of-two bitmask wrap-around, geometric doubling/halving with hysteresis, and potential-function telemetry.",
    "description": "A cache-contiguous circular ring buffer and dynamic vector using power-of-two bitmask wrap-around, geometric doubling/halving with hysteresis, and potential-function telemetry.",
    "highlights": [
      "Power-of-2 capacity invariant enabling single-cycle (head + i) & mask wrap-around",
      "Order-preserving geometric doubling (2x) and quarter-load shrinking (0.25x)",
      "Potential-function Φ = 2n - m instrumentation verifying O(1) amortized bounds"
    ],
    "tags": [
      "Circular Buffer",
      "Amortized O(1)",
      "Bitmask Indexing",
      "Dynamic Array",
      "Cache Locality"
    ],
    "relatedLessons": [
      "build-dynamic-circular-deque",
      "dynamic-arrays-geometric-resizing",
      "amortized-analysis-potential",
      "ram-model-vs-modern-cpu",
      "bit-manipulation-twos-complement"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-dynamic-circular-deque/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-dynamic-circular-deque/",
    "pinned": true,
    "featuredBadge": "Linear Structures & Memory · ~30m"
  },
  {
    "id": "build-lfu-lru-cache",
    "slug": "build-lfu-lru-cache",
    "name": "build-lfu-lru-cache",
    "title": "O(1) LRU and Frequency-Bucketed LFU Cache Engine",
    "category": "Linked Structures & Caching",
    "difficulty": "Advanced",
    "estimatedMinutes": 35,
    "summary": "Strict O(1) LRU and Shah-Mitra-Matani frequency-bucketed LFU caches built over sentinel-guarded intrusive doubly linked lists with zero heap-log overhead.",
    "description": "Strict O(1) LRU and Shah-Mitra-Matani frequency-bucketed LFU caches built over sentinel-guarded intrusive doubly linked lists with zero heap-log overhead.",
    "highlights": [
      "Sentinel-guarded doubly linked list eliminating null-pointer branches",
      "Shah-Mitra-Matani O(1) LFU cache with frequency-bucketed LRU tie-breaking",
      "Exact minFreq invariant maintenance across hits, promotions, and evictions"
    ],
    "tags": [
      "LFU Cache",
      "LRU Cache",
      "Intrusive Linked List",
      "O(1) Eviction",
      "Frequency Buckets"
    ],
    "relatedLessons": [
      "build-lfu-lru-cache",
      "lru-lfu-eviction-structures",
      "singly-doubly-intrusive-lists",
      "case-redis-skiplist-ziplist",
      "separate-chaining-vs-open-addressing"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-lfu-lru-cache/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-lfu-lru-cache/",
    "pinned": true,
    "featuredBadge": "Linked Structures & Caching · ~35m"
  },
  {
    "id": "build-robin-hood-hash-map",
    "slug": "build-robin-hood-hash-map",
    "name": "build-robin-hood-hash-map",
    "title": "Open-Addressing Robin Hood Hash Map with Backward-Shift Deletion",
    "category": "Hashing & Sketches",
    "difficulty": "Advanced",
    "estimatedMinutes": 35,
    "summary": "An open-addressed hash table implementing Celis Robin Hood displacement, early-exit lookups on PSL ordering, and tombstone-free backward-shift deletion.",
    "description": "An open-addressed hash table implementing Celis Robin Hood displacement, early-exit lookups on PSL ordering, and tombstone-free backward-shift deletion.",
    "highlights": [
      "Probe Sequence Length (PSL) displacement minimizing probe variance",
      "Early-exit search termination when current PSL exceeds occupant PSL",
      "Tombstone-free backward-shift deletion preventing probe degradation"
    ],
    "tags": [
      "Robin Hood Hashing",
      "Open Addressing",
      "Backward-Shift Delete",
      "PSL Variance",
      "FNV-1a"
    ],
    "relatedLessons": [
      "build-robin-hood-hash-map",
      "robin-hood-cuckoo-hashing",
      "separate-chaining-vs-open-addressing",
      "universal-k-independent-hashing",
      "case-rust-hashbrown-swisstable"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-robin-hood-hash-map/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-robin-hood-hash-map/",
    "pinned": true,
    "featuredBadge": "Hashing & Sketches · ~35m"
  },
  {
    "id": "build-bloom-cuckoo-filter",
    "slug": "build-bloom-cuckoo-filter",
    "name": "build-bloom-cuckoo-filter",
    "title": "Space-Efficient Bloom Filter & Fingerprint Cuckoo Filter",
    "category": "Hashing & Sketches",
    "difficulty": "Advanced",
    "estimatedMinutes": 35,
    "summary": "A Kirsch-Mitzenmacher double-hashed Bloom filter and a partial-key Cuckoo filter supporting dynamic deletions, fingerprint buckets, and false-positive rate telemetry.",
    "description": "A Kirsch-Mitzenmacher double-hashed Bloom filter and a partial-key Cuckoo filter supporting dynamic deletions, fingerprint buckets, and false-positive rate telemetry.",
    "highlights": [
      "Kirsch-Mitzenmacher double-hashing Bloom filter with Uint32Array bitset",
      "Partial-key Cuckoo filter computing alternate bucket via i2 = i1 ^ hash(fp)",
      "Dynamic deletion support with zero false negatives and bounded kick-out displacement"
    ],
    "tags": [
      "Bloom Filter",
      "Cuckoo Filter",
      "Kirsch-Mitzenmacher",
      "XOR Partial-Key Cuckoo",
      "Probabilistic Sketch"
    ],
    "relatedLessons": [
      "bloom-filters-counting-xor",
      "robin-hood-cuckoo-hashing",
      "universal-k-independent-hashing",
      "count-min-sketch-heavy-hitters",
      "hyperloglog-cardinality"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-bloom-cuckoo-filter/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-bloom-cuckoo-filter/",
    "pinned": true,
    "featuredBadge": "Hashing & Sketches · ~35m"
  },
  {
    "id": "build-hybrid-introsort-timsort",
    "slug": "build-hybrid-introsort-timsort",
    "name": "build-hybrid-introsort-timsort",
    "title": "Hybrid IntroSort & Quickselect Order-Statistic Engine",
    "category": "Sorting & Order Statistics",
    "difficulty": "Intermediate",
    "estimatedMinutes": 30,
    "summary": "Musser’s hybrid IntroSort (median-of-three 3-way QuickSort + depth-bounded HeapSort fallback + small-subarray InsertionSort) paired with linear-time 3-way Quickselect.",
    "description": "Musser’s hybrid IntroSort (median-of-three 3-way QuickSort + depth-bounded HeapSort fallback + small-subarray InsertionSort) paired with linear-time 3-way Quickselect.",
    "highlights": [
      "Musser IntroSort combining 3-way Dutch National Flag QuickSort, HeapSort, and InsertionSort",
      "Depth trap 2*floor(log2 N) guaranteeing worst-case O(N log N) even on killer inputs",
      "Expected O(N) Quickselect with 3-way partitioning for duplicate-heavy arrays"
    ],
    "tags": [
      "IntroSort",
      "Dijkstra 3-Way Partition",
      "HeapSort Fallback",
      "InsertionSort",
      "Quickselect"
    ],
    "relatedLessons": [
      "build-hybrid-introsort-timsort",
      "quicksort-partition-schemes",
      "quickselect-bfprt-median",
      "case-timsort-pdqsort",
      "quadratic-sorts-inversions"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-hybrid-introsort-timsort/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-hybrid-introsort-timsort/",
    "pinned": true,
    "featuredBadge": "Sorting & Order Statistics · ~30m"
  },
  {
    "id": "build-indexed-d-ary-priority-queue",
    "slug": "build-indexed-d-ary-priority-queue",
    "name": "build-indexed-d-ary-priority-queue",
    "title": "Indexed d-ary Priority Queue with O(log_d N) Decrease-Key",
    "category": "Trees & Priority Queues",
    "difficulty": "Intermediate",
    "estimatedMinutes": 30,
    "summary": "Sedgewick’s Indexed d-ary Min-Priority Queue maintaining bidirectional heap/key position maps for O(1) lookup and O(log_d N) decreaseKey and arbitrary deletion.",
    "description": "Sedgewick’s Indexed d-ary Min-Priority Queue maintaining bidirectional heap/key position maps for O(1) lookup and O(log_d N) decreaseKey and arbitrary deletion.",
    "highlights": [
      "Configurable arity d (default d=4) reducing siftUp height by log2(d) and grouping children into one cache line",
      "Bidirectional index maps pq[] and qp[] supporting O(1) contains(id) and O(log_d N) updateKey/delete",
      "Zero duplicate heap entries during Dijkstra and Prim edge relaxations"
    ],
    "tags": [
      "Indexed Priority Queue",
      "d-ary Heap",
      "Decrease-Key",
      "Cache Line Alignment",
      "Dijkstra"
    ],
    "relatedLessons": [
      "build-indexed-d-ary-priority-queue",
      "binary-d-ary-heaps",
      "dijkstra-relaxation-invariants",
      "case-timer-wheels-vs-heaps",
      "mergeable-heaps-binomial-fibonacci"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-indexed-d-ary-priority-queue/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-indexed-d-ary-priority-queue/",
    "pinned": true,
    "featuredBadge": "Trees & Priority Queues · ~30m"
  },
  {
    "id": "build-llrb-order-statistic-tree",
    "slug": "build-llrb-order-statistic-tree",
    "name": "build-llrb-order-statistic-tree",
    "title": "Left-Leaning Red-Black Order-Statistic Tree",
    "category": "Balanced Trees & Augmentation",
    "difficulty": "Advanced",
    "estimatedMinutes": 50,
    "summary": "A Left-Leaning Red-Black (LLRB) balanced binary search tree augmented with subtree sizes to support O(log n) insertion, deletion, rank(key), select(k), and range cardinality queries.",
    "description": "A Left-Leaning Red-Black (LLRB) balanced binary search tree augmented with subtree sizes to support O(log n) insertion, deletion, rank(key), select(k), and range cardinality queries.",
    "highlights": [
      "Sedgewick Left-Leaning Red-Black (LLRB) 2-3 tree isomorphism with 3 local fixup operations",
      "Subtree size augmentation maintained across rotateLeft, rotateRight, and moveRedLeft/Right",
      "O(log n) order-statistic queries: rank(key), select(k), and rangeCount(lo, hi)"
    ],
    "tags": [
      "LLRB Tree",
      "2-3 Tree Isomorphism",
      "Order Statistics",
      "Tree Rotations",
      "Rank & Select"
    ],
    "relatedLessons": [
      "build-llrb-order-statistic-tree",
      "red-black-llrb-isomorphism",
      "tree-rotations-avl-invariants",
      "augmented-trees-order-intervals",
      "treaps-split-merge-paradigm"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-llrb-order-statistic-tree/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-llrb-order-statistic-tree/",
    "pinned": false,
    "featuredBadge": "Balanced Trees & Augmentation · ~50m"
  },
  {
    "id": "build-implicit-treap-rope",
    "slug": "build-implicit-treap-rope",
    "name": "build-implicit-treap-rope",
    "title": "Implicit Treap Rope with O(log n) Split, Merge & Lazy Reverse",
    "category": "Balanced Trees & Augmentation",
    "difficulty": "Advanced",
    "estimatedMinutes": 45,
    "summary": "An implicit treap (randomized Cartesian tree over implicit array indices) supporting O(log n) split, merge, arbitrary-index insert/delete, range reversal, and cut-and-paste rope operations.",
    "description": "An implicit treap (randomized Cartesian tree over implicit array indices) supporting O(log n) split, merge, arbitrary-index insert/delete, range reversal, and cut-and-paste rope operations.",
    "highlights": [
      "Implicit array indexing derived purely from dynamic left-subtree sizes",
      "Deterministic xorshift32 priority generator maintaining expected O(log n) tree height",
      "O(log n) substring cut-and-paste, range sum, and lazy range reversal via split and merge"
    ],
    "tags": [
      "Implicit Treap",
      "Rope",
      "Split-Merge Paradigm",
      "Lazy Reversal",
      "Randomized BST"
    ],
    "relatedLessons": [
      "treaps-split-merge-paradigm",
      "augmented-trees-order-intervals",
      "lazy-propagation-segment-tree-beats",
      "skip-lists-probabilistic-indexing",
      "red-black-llrb-isomorphism"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-implicit-treap-rope/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-implicit-treap-rope/",
    "pinned": false,
    "featuredBadge": "Balanced Trees & Augmentation · ~45m"
  },
  {
    "id": "build-fenwick-range-tree",
    "slug": "build-fenwick-range-tree",
    "name": "build-fenwick-range-tree",
    "title": "Fenwick Range-Update Range-Query Tree & O(log n) Binary Lifting",
    "category": "Range Queries & Trees",
    "difficulty": "Intermediate",
    "estimatedMinutes": 35,
    "summary": "A Binary Indexed Tree (Fenwick Tree) featuring O(n) linear construction, dual-array range-update/range-query (RURQ), and O(log n) prefix binary lifting.",
    "description": "A Binary Indexed Tree (Fenwick Tree) featuring O(n) linear construction, dual-array range-update/range-query (RURQ), and O(log n) prefix binary lifting.",
    "highlights": [
      "O(n) linear-time tree construction via immediate parent propagation i + (i & -i)",
      "Dual-BIT algebraic decomposition enabling O(log n) range add and O(log n) range sum",
      "O(log n) binary lifting on the Fenwick tree to find the lowerBound prefix threshold in a single pass"
    ],
    "tags": [
      "Fenwick Tree",
      "Binary Indexed Tree",
      "Range Update Range Query",
      "Binary Lifting",
      "Two-s Complement"
    ],
    "relatedLessons": [
      "fenwick-tree-binary-indexed",
      "bit-manipulation-twos-complement",
      "segment-trees-bottom-up-monoids",
      "lazy-propagation-segment-tree-beats",
      "static-range-queries-sparse-table"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-fenwick-range-tree/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-fenwick-range-tree/",
    "pinned": false,
    "featuredBadge": "Range Queries & Trees · ~35m"
  },
  {
    "id": "build-lazy-segment-tree",
    "slug": "build-lazy-segment-tree",
    "name": "build-lazy-segment-tree",
    "title": "Segment Tree with Affine Lazy Propagation & Monoid Beats",
    "category": "Range Queries & Trees",
    "difficulty": "Advanced",
    "estimatedMinutes": 50,
    "summary": "A full segment tree with composable affine lazy tags (f(x) = a*x + b) supporting range add, range multiply, range assign, range sum/min/max queries, and O(log n) first-element tree walk.",
    "description": "A full segment tree with composable affine lazy tags (f(x) = a*x + b) supporting range add, range multiply, range assign, range sum/min/max queries, and O(log n) first-element tree walk.",
    "highlights": [
      "Composable affine lazy operator f(x) = mul * x + add supporting range multiply, range add, and range assign",
      "Simultaneous maintenance of range sum, minimum, and maximum across all updates",
      "O(log n) tree-walk search findFirstAtLeast(l, r, threshold) without binary search overhead"
    ],
    "tags": [
      "Segment Tree",
      "Lazy Propagation",
      "Affine Transformation",
      "Range Sum Min Max",
      "Tree Walk"
    ],
    "relatedLessons": [
      "build-lazy-segment-tree",
      "segment-trees-bottom-up-monoids",
      "lazy-propagation-segment-tree-beats",
      "fenwick-tree-binary-indexed",
      "dynamic-persistent-segment-trees"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-lazy-segment-tree/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-lazy-segment-tree/",
    "pinned": false,
    "featuredBadge": "Range Queries & Trees · ~50m"
  },
  {
    "id": "build-persistent-segment-tree",
    "slug": "build-persistent-segment-tree",
    "name": "build-persistent-segment-tree",
    "title": "Persistent Segment Tree (Path-Copying Time Travel & Range K-th Smallest)",
    "category": "Range Queries & Trees",
    "difficulty": "Advanced",
    "estimatedMinutes": 50,
    "summary": "An immutable path-copying Persistent Segment Tree supporting O(log n) versioned point updates, historical range sum queries, and O(log n) static range k-th smallest (quantile) queries.",
    "description": "An immutable path-copying Persistent Segment Tree supporting O(log n) versioned point updates, historical range sum queries, and O(log n) static range k-th smallest (quantile) queries.",
    "highlights": [
      "O(log n) structural path-copying creating immutable versioned roots without mutating history",
      "Historical range sum queries across arbitrary past versions in O(log n) time",
      "Wavelet-style Range K-th Smallest (Order Statistic on [L, R]) by walking two version roots simultaneously"
    ],
    "tags": [
      "Persistent Segment Tree",
      "Path Copying",
      "Time Travel Queries",
      "Static Range K-th Smallest",
      "Functional Data Structures"
    ],
    "relatedLessons": [
      "dynamic-persistent-segment-trees",
      "segment-trees-bottom-up-monoids",
      "augmented-trees-order-intervals",
      "treaps-split-merge-paradigm",
      "fenwick-tree-binary-indexed"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-persistent-segment-tree/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-persistent-segment-tree/",
    "pinned": false,
    "featuredBadge": "Range Queries & Trees · ~50m"
  },
  {
    "id": "build-aho-corasick-scanner",
    "slug": "build-aho-corasick-scanner",
    "name": "build-aho-corasick-scanner",
    "title": "Aho-Corasick Multi-Pattern Automaton Scanner",
    "category": "Strings & Automata",
    "difficulty": "Advanced",
    "estimatedMinutes": 45,
    "summary": "An Aho-Corasick multi-pattern string matching automaton with BFS failure links, dictionary output shortcuts, and deterministic O(|T| + z) stream scanning.",
    "description": "An Aho-Corasick multi-pattern string matching automaton with BFS failure links, dictionary output shortcuts, and deterministic O(|T| + z) stream scanning.",
    "highlights": [
      "Trie construction with BFS failure-link synthesis generalizing KMP to dictionaries",
      "Dictionary suffix shortcuts (outputLinks) avoiding O(m) failure-chain traversal on sparse matches",
      "Deterministic DFA transition table compilation guaranteeing O(1) per-character text scanning"
    ],
    "tags": [
      "Aho-Corasick",
      "Trie",
      "Failure Links",
      "Dictionary Links",
      "Multi-Pattern Search"
    ],
    "relatedLessons": [
      "build-aho-corasick-scanner",
      "aho-corasick-trie-automaton",
      "tries-radix-trees-patricia",
      "kmp-prefix-function-automaton",
      "z-algorithm-linear-box"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-aho-corasick-scanner/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-aho-corasick-scanner/",
    "pinned": false,
    "featuredBadge": "Strings & Automata · ~45m"
  },
  {
    "id": "build-suffix-array-lcp",
    "slug": "build-suffix-array-lcp",
    "name": "build-suffix-array-lcp",
    "title": "Suffix Array (Prefix-Doubling), Kasai LCP & RMQ Substring Index",
    "category": "Strings & Automata",
    "difficulty": "Advanced",
    "estimatedMinutes": 50,
    "summary": "A full-text Suffix Array index built via prefix-doubling, paired with Kasai linear-time LCP array construction, O(1) Sparse Table RMQ queries, binary-search pattern matching, and distinct substring counting.",
    "description": "A full-text Suffix Array index built via prefix-doubling, paired with Kasai linear-time LCP array construction, O(1) Sparse Table RMQ queries, binary-search pattern matching, and distinct substring counting.",
    "highlights": [
      "Prefix-doubling O(n log n) suffix array construction with rank pair comparison",
      "Kasai linear-time O(n) LCP array construction exploiting h[i] >= h[i-1] - 1",
      "O(1) Longest Common Prefix of arbitrary suffixes via Sparse Table RMQ and distinct-substring counting"
    ],
    "tags": [
      "Suffix Array",
      "Prefix Doubling",
      "Kasai LCP Array",
      "Sparse Table RMQ",
      "Substring Search"
    ],
    "relatedLessons": [
      "suffix-arrays-prefix-doubling-sais",
      "suffix-automaton-sam-endpos",
      "static-range-queries-sparse-table",
      "z-algorithm-linear-box",
      "aho-corasick-trie-automaton"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-suffix-array-lcp/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-suffix-array-lcp/",
    "pinned": false,
    "featuredBadge": "Strings & Automata · ~50m"
  },
  {
    "id": "build-thompson-nfa-regex-engine",
    "slug": "build-thompson-nfa-regex-engine",
    "name": "build-thompson-nfa-regex-engine",
    "title": "Thompson Lockstep NFA Regular Expression Engine (Zero Backtracking)",
    "category": "Strings & Automata",
    "difficulty": "Advanced",
    "estimatedMinutes": 50,
    "summary": "A Ken Thompson non-backtracking regular expression compiler and lockstep NFA simulator that guarantees O(|P| * |T|) time even on pathological ReDoS patterns like (a+)+b.",
    "description": "A Ken Thompson non-backtracking regular expression compiler and lockstep NFA simulator that guarantees O(|P| * |T|) time even on pathological ReDoS patterns like (a+)+b.",
    "highlights": [
      "Explicit concatenation insertion and Dijkstra Shunting-Yard regex-to-postfix compiler",
      "Ken Thompson structural NFA fragment assembly supporting |, *, +, ?, ., and parentheses",
      "Lockstep state-set simulation with generation-id deduplication preventing catastrophic backtracking (ReDoS)"
    ],
    "tags": [
      "Thompson NFA",
      "Shunting-Yard Parser",
      "Regular Expressions",
      "Zero Backtracking",
      "ReDoS Immunity"
    ],
    "relatedLessons": [
      "build-thompson-nfa-regex-engine",
      "aho-corasick-trie-automaton",
      "kmp-prefix-function-automaton",
      "dfs-edge-classification-timestamps",
      "stacks-expression-evaluation"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-thompson-nfa-regex-engine/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-thompson-nfa-regex-engine/",
    "pinned": false,
    "featuredBadge": "Strings & Automata · ~50m"
  },
  {
    "id": "build-tarjan-scc-2sat-solver",
    "slug": "build-tarjan-scc-2sat-solver",
    "name": "build-tarjan-scc-2sat-solver",
    "title": "Tarjan Strongly Connected Components & Linear-Time 2-SAT Solver",
    "category": "Graph Algorithms",
    "difficulty": "Advanced",
    "estimatedMinutes": 45,
    "summary": "Tarjan single-pass low-link Strongly Connected Components (SCC) engine and a linear-time 2-SAT boolean satisfiability solver over implication graphs.",
    "description": "Tarjan single-pass low-link Strongly Connected Components (SCC) engine and a linear-time 2-SAT boolean satisfiability solver over implication graphs.",
    "highlights": [
      "Single-pass Tarjan DFS computing discovery times, low-link values, and reverse-topological SCC IDs",
      "Implication graph encoding (a v b) as (~a -> b) and (~b -> a) over 2n literal vertices",
      "Linear-time O(V + E) 2-SAT satisfiability check and truth assignment extraction"
    ],
    "tags": [
      "Tarjan SCC",
      "Low-Link Invariant",
      "Condensation DAG",
      "2-SAT Solver",
      "Implication Graph"
    ],
    "relatedLessons": [
      "build-tarjan-scc-2sat-solver",
      "scc-tarjan-kosaraju-2sat",
      "dfs-edge-classification-timestamps",
      "topological-sort-kahn-dfs",
      "bridges-articulation-biconnected"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-tarjan-scc-2sat-solver/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-tarjan-scc-2sat-solver/",
    "pinned": false,
    "featuredBadge": "Graph Algorithms · ~45m"
  },
  {
    "id": "build-astar-bidirectional-router",
    "slug": "build-astar-bidirectional-router",
    "name": "build-astar-bidirectional-router",
    "title": "A* & Bidirectional Shortest-Path Router with Consistent Potentials",
    "category": "Graph Algorithms",
    "difficulty": "Advanced",
    "estimatedMinutes": 45,
    "summary": "A shortest-path routing engine implementing Dijkstra, A* with admissible/consistent heuristics, and Bidirectional Dijkstra with exact stopping condition and node-expansion instrumentation.",
    "description": "A shortest-path routing engine implementing Dijkstra, A* with admissible/consistent heuristics, and Bidirectional Dijkstra with exact stopping condition and node-expansion instrumentation.",
    "highlights": [
      "Admissible & consistent Euclidean/Octile heuristic guiding A* frontier expansion",
      "Bidirectional search with exact mu-stopping criterion (topF + topB >= bestPathLen)",
      "Node-expansion telemetry comparing standard Dijkstra, A*, and Bidirectional search on the same graph"
    ],
    "tags": [
      "A* Search",
      "Bidirectional Dijkstra",
      "Admissible Heuristic",
      "Consistent Potential",
      "Shortest Path"
    ],
    "relatedLessons": [
      "build-astar-bidirectional-router",
      "astar-heuristic-admissibility",
      "binary-d-ary-heaps",
      "dfs-edge-classification-timestamps",
      "bellman-ford-spfa-difference-constraints"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-astar-bidirectional-router/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-astar-bidirectional-router/",
    "pinned": false,
    "featuredBadge": "Graph Algorithms · ~45m"
  },
  {
    "id": "build-dsu-rollback-connectivity",
    "slug": "build-dsu-rollback-connectivity",
    "name": "build-dsu-rollback-connectivity",
    "title": "Rollback Disjoint-Set Union & Offline Dynamic Connectivity Engine",
    "category": "Graph Algorithms",
    "difficulty": "Advanced",
    "estimatedMinutes": 55,
    "summary": "A Rollback Disjoint-Set Union (Union-Find with undo stack) paired with a segment tree over the query timeline to solve offline dynamic graph connectivity with edge insertions and deletions.",
    "description": "A Rollback Disjoint-Set Union (Union-Find with undo stack) paired with a segment tree over the query timeline to solve offline dynamic graph connectivity with edge insertions and deletions.",
    "highlights": [
      "Path-compression-free Union-by-Size DSU with O(log n) find and O(1) exact undo stack",
      "Snapshot & rollback API restoring exact parent pointers, component sizes, and component count",
      "Offline Dynamic Connectivity over a time-segment tree solving edge additions, deletions, and queries in O((n + Q log Q) log n)"
    ],
    "tags": [
      "Rollback DSU",
      "Offline Dynamic Connectivity",
      "Segment Tree over Time",
      "Union by Rank",
      "Undo Stack"
    ],
    "relatedLessons": [
      "dsu-rollback-weighted-offline",
      "disjoint-set-union-ackermann",
      "segment-trees-bottom-up-monoids",
      "mst-cut-cycle-properties",
      "dynamic-persistent-segment-trees"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-dsu-rollback-connectivity/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-dsu-rollback-connectivity/",
    "pinned": false,
    "featuredBadge": "Graph Algorithms · ~55m"
  },
  {
    "id": "build-dinic-max-flow-engine",
    "slug": "build-dinic-max-flow-engine",
    "name": "build-dinic-max-flow-engine",
    "title": "Dinic Blocking-Flow Max-Flow, Min-Cut & Bipartite Matching Engine",
    "category": "Network Flow & Matching",
    "difficulty": "Advanced",
    "estimatedMinutes": 50,
    "summary": "Dinic blocking-flow maximum flow engine with BFS level graphs, Shimon Even current-arc pointer pruning, s-t minimum cut extraction, and bipartite maximum cardinality matching.",
    "description": "Dinic blocking-flow maximum flow engine with BFS level graphs, Shimon Even current-arc pointer pruning, s-t minimum cut extraction, and bipartite maximum cardinality matching.",
    "highlights": [
      "Residual edge pairing via XOR index (edgeIdx ^ 1) in a flat edge pool",
      "BFS level-graph construction paired with current-arc pointer DFS blocking flows",
      "Max-Flow Min-Cut partition extraction and O(E sqrt(V)) unit-network bipartite matching"
    ],
    "tags": [
      "Dinic Algorithm",
      "Level Graph",
      "Current-Arc Optimization",
      "Max-Flow Min-Cut",
      "Bipartite Matching"
    ],
    "relatedLessons": [
      "build-dinic-max-flow-engine",
      "dinic-level-graph-blocking-flow",
      "bipartite-matching-hopcroft-karp",
      "min-cost-max-flow-mcmf",
      "dfs-edge-classification-timestamps"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-dinic-max-flow-engine/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-dinic-max-flow-engine/",
    "pinned": false,
    "featuredBadge": "Network Flow & Matching · ~50m"
  },
  {
    "id": "build-dancing-links-exact-cover",
    "slug": "build-dancing-links-exact-cover",
    "name": "build-dancing-links-exact-cover",
    "title": "Knuth Algorithm X & Dancing Links (DLX) Exact Cover Solver",
    "category": "Backtracking & Combinatorial Search",
    "difficulty": "Advanced",
    "estimatedMinutes": 55,
    "summary": "Donald Knuth's Algorithm X implemented via Dancing Links (DLX) 4-way toroidal doubly-linked lists with Minimum-Remaining-Values (MRV) column selection.",
    "description": "Donald Knuth's Algorithm X implemented via Dancing Links (DLX) 4-way toroidal doubly-linked lists with Minimum-Remaining-Values (MRV) column selection.",
    "highlights": [
      "4-way toroidal doubly-linked matrix where every 1-bit is a node with L, R, U, D and column header pointers",
      "Knuth reversible pointer surgery: x.L.R = x.R; x.R.L = x.L and exact restoration x.L.R = x; x.R.L = x",
      "S-heuristic (Minimum Remaining Values column selection) pruning exponential search trees"
    ],
    "tags": [
      "Dancing Links",
      "Algorithm X",
      "Exact Cover",
      "Toroidal Doubly Linked List",
      "MRV Heuristic"
    ],
    "relatedLessons": [
      "build-dancing-links-exact-cover",
      "exact-cover-knuth-algorithm-x",
      "branch-and-bound-admissible-bounds",
      "singly-doubly-intrusive-lists",
      "meet-in-the-middle-search"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-dancing-links-exact-cover/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-dancing-links-exact-cover/",
    "pinned": false,
    "featuredBadge": "Backtracking & Combinatorial Search · ~55m"
  },
  {
    "id": "build-hirschberg-linear-space-diff",
    "slug": "build-hirschberg-linear-space-diff",
    "name": "build-hirschberg-linear-space-diff",
    "title": "Hirschberg O(n)-Space Divide-and-Conquer Sequence Alignment & Diff",
    "category": "Dynamic Programming & Divide-and-Conquer",
    "difficulty": "Advanced",
    "estimatedMinutes": 50,
    "summary": "Dan Hirschberg's divide-and-conquer sequence alignment and edit-script diff engine that recovers the full optimal edit transcript in O(nm) time and strictly linear O(n + m) memory.",
    "description": "Dan Hirschberg's divide-and-conquer sequence alignment and edit-script diff engine that recovers the full optimal edit transcript in O(nm) time and strictly linear O(n + m) memory.",
    "highlights": [
      "Two-row rolling DP computing forward prefix costs and backward suffix costs in O(min(n, m)) memory",
      "Optimal midpoint split k* = argmin_k (fwd[k] + bwd[m - k]) on the middle row i = floor(n/2)",
      "Master-Theorem geometric work series T(n,m) <= 2 n m achieving O(nm) time in O(n + m) total space"
    ],
    "tags": [
      "Hirschberg Algorithm",
      "Linear Space DP",
      "Sequence Alignment",
      "Edit Distance",
      "Divide and Conquer"
    ],
    "relatedLessons": [
      "build-hirschberg-linear-space-diff",
      "sequence-dp-lcs-levenshtein",
      "dp-optimal-substructure-dag",
      "mergesort-bottom-up-inversions",
      "recurrence-relations-master-theorem"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-hirschberg-linear-space-diff/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-hirschberg-linear-space-diff/",
    "pinned": false,
    "featuredBadge": "Dynamic Programming & Divide-and-Conquer · ~50m"
  },
  {
    "id": "build-li-chao-convex-hull-dp",
    "slug": "build-li-chao-convex-hull-dp",
    "name": "build-li-chao-convex-hull-dp",
    "title": "Li Chao Segment Tree & Monotonic Convex Hull Trick DP Engine",
    "category": "Dynamic Programming & Divide-and-Conquer",
    "difficulty": "Advanced",
    "estimatedMinutes": 50,
    "summary": "A dynamically allocated Li Chao Segment Tree and a Monotonic Convex Hull Trick queue for optimizing O(n^2) dynamic programming recurrences of the form dp[i] = min_j (m_j * x_i + b_j) to O(n log X) and O(n).",
    "description": "A dynamically allocated Li Chao Segment Tree and a Monotonic Convex Hull Trick queue for optimizing O(n^2) dynamic programming recurrences of the form dp[i] = min_j (m_j * x_i + b_j) to O(n log X) and O(n).",
    "highlights": [
      "Dynamic Li Chao Segment Tree handling arbitrary (non-monotonic) slopes and query points in O(log X)",
      "Single-intersection line dominance invariant recursing into at most one child per level",
      "O(n) Monotonic Deque Convex Hull Trick for sorted slopes and queries"
    ],
    "tags": [
      "Li Chao Tree",
      "Convex Hull Trick",
      "DP Optimization",
      "Lower Envelope",
      "Dynamic Allocation"
    ],
    "relatedLessons": [
      "build-li-chao-convex-hull-dp",
      "convex-hull-trick-li-chao-tree",
      "segment-trees-bottom-up-monoids",
      "dynamic-persistent-segment-trees",
      "monotonic-deque-sliding-extrema"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-li-chao-convex-hull-dp/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-li-chao-convex-hull-dp/",
    "pinned": false,
    "featuredBadge": "Dynamic Programming & Divide-and-Conquer · ~50m"
  },
  {
    "id": "build-kd-tree-nearest-neighbor",
    "slug": "build-kd-tree-nearest-neighbor",
    "name": "build-kd-tree-nearest-neighbor",
    "title": "Multi-Dimensional k-d Tree with Branch-and-Bound k-NN & Range Search",
    "category": "Computational Geometry & Spatial Indexing",
    "difficulty": "Advanced",
    "estimatedMinutes": 45,
    "summary": "A balanced multi-dimensional k-d Tree supporting orthogonal bounding-box range queries and branch-and-bound 1-NN / k-NN search with hypersphere-hyperplane pruning telemetry.",
    "description": "A balanced multi-dimensional k-d Tree supporting orthogonal bounding-box range queries and branch-and-bound 1-NN / k-NN search with hypersphere-hyperplane pruning telemetry.",
    "highlights": [
      "Alternating-axis median partitioning building a balanced k-d tree",
      "Branch-and-Bound Nearest Neighbor pruning the far half-space when axisDist^2 >= bestDist^2",
      "Bounded Max-Heap k-Nearest Neighbors (k-NN) and orthogonal hyper-rectangle range queries"
    ],
    "tags": [
      "k-d Tree",
      "Spatial Indexing",
      "Branch-and-Bound k-NN",
      "Orthogonal Range Search",
      "Hypersphere Pruning"
    ],
    "relatedLessons": [
      "build-kd-tree-nearest-neighbor",
      "spatial-indexing-kd-quad-rtrees",
      "branch-and-bound-admissible-bounds",
      "quickselect-bfprt-median",
      "binary-d-ary-heaps"
    ],
    "language": "JavaScript (ES2022+)",
    "languageColor": "#f1e05a",
    "githubUrl": "https://dsa-in-depth.vedgupta.in/build/build-kd-tree-nearest-neighbor/",
    "githubRepo": "innovatorved/dsa-in-depth",
    "liveUrl": "/build/build-kd-tree-nearest-neighbor/",
    "pinned": false,
    "featuredBadge": "Computational Geometry & Spatial Indexing · ~45m"
  }
];
  if (typeof window !== 'undefined') {
    window.PROJECTS_DATA = data;
    window.PROJECTS = data;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = data;
  }
})();
