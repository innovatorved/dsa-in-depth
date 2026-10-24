/**
 * DSA In Depth — Interactive Algorithm Selection Decision Matrices & Capacity Blueprints
 * 12 Algorithmic Building Blocks + 10 Interactive Problem -> Constraint -> Algorithm Blueprints.
 * Exposes window.WHITEBOARD_DATA and window.WHITEBOARD_BLUEPRINTS.
 */
(function(root) {
  'use strict';

  var BUILDING_BLOCKS = [
    {
      id: 'input-stream-parser',
      name: 'Constraint & Input Validator',
      category: 'edge',
      icon: 'globe',
      maxQpsPerInstance: 100000,
      baseLatencyMs: 0.2,
      costPerInstanceMonthly: 10,
      defaultInstances: 1,
      description: 'Inspects input scale N, query count Q, key cardinality, and monotonicity before dispatching to the optimal algorithmic kernel.'
    },
    {
      id: 'bit-parallel-filter',
      name: 'Bitset / Bloom / Xor Pre-Filter',
      category: 'edge',
      icon: 'shield',
      maxQpsPerInstance: 250000,
      baseLatencyMs: 0.1,
      costPerInstanceMonthly: 15,
      defaultInstances: 1,
      description: 'O(1) bitwise / k-hash membership filter (~9.6 bits/key at 1% FPR) that eliminates negative lookups before touching main memory or disk.'
    },
    {
      id: 'hash-index-robin-hood',
      name: 'SwissTable / Robin Hood Hash Map',
      category: 'cache',
      icon: 'zap',
      maxQpsPerInstance: 120000,
      baseLatencyMs: 0.3,
      costPerInstanceMonthly: 40,
      defaultInstances: 1,
      description: 'Open-addressed SIMD-probed / PSL-bounded hash table with SipHash seeding for O(1) expected lookup and bounded probe variance.'
    },
    {
      id: 'lru-lfu-eviction-tier',
      name: 'Intrusive O(1) LRU / LFU Cache',
      category: 'cache',
      icon: 'layers',
      maxQpsPerInstance: 95000,
      baseLatencyMs: 0.4,
      costPerInstanceMonthly: 55,
      defaultInstances: 1,
      description: 'Hash map paired with intrusive doubly-linked frequency/recency lists for strict O(1) worst-case get, put, and eviction.'
    },
    {
      id: 'monotonic-window-engine',
      name: 'Two-Pointer / Monotonic Deque Kernel',
      category: 'compute',
      icon: 'cpu',
      maxQpsPerInstance: 85000,
      baseLatencyMs: 0.8,
      costPerInstanceMonthly: 35,
      defaultInstances: 2,
      description: 'Amortized O(N) sliding window and monotonic stack/deque processor (each element pushed and popped at most once).'
    },
    {
      id: 'divide-conquer-sorter',
      name: 'Introsort / TimSort / Quickselect Engine',
      category: 'compute',
      icon: 'cpu',
      maxQpsPerInstance: 40000,
      baseLatencyMs: 2.2,
      costPerInstanceMonthly: 45,
      defaultInstances: 2,
      description: 'Hybrid O(N log N) adaptive sort (galloping run merge + 3-way Dutch Flag partition) and O(N) Quickselect order-statistic selector.'
    },
    {
      id: 'graph-shortest-path-router',
      name: 'Dijkstra / Bidirectional A* / CH Router',
      category: 'compute',
      icon: 'git-branch',
      maxQpsPerInstance: 25000,
      baseLatencyMs: 3.1,
      costPerInstanceMonthly: 60,
      defaultInstances: 2,
      description: 'CSR-backed shortest-path and Tarjan/Dinic graph engine using 4-ary indexed heaps, consistent heuristics, or Contraction Hierarchies.'
    },
    {
      id: 'dp-state-optimizer',
      name: 'Rolling-Array & Li Chao CHT DP Kernel',
      category: 'compute',
      icon: 'activity',
      maxQpsPerInstance: 30000,
      baseLatencyMs: 2.5,
      costPerInstanceMonthly: 50,
      defaultInstances: 2,
      description: 'Space-compressed bottom-up DP engine supporting Monge D&C, Knuth-Yao, Convex Hull Trick (Li Chao Tree), and Aliens WQS relaxation.'
    },
    {
      id: 'balanced-order-tree',
      name: 'LLRB / Treap / B+ Tree Ordered Index',
      category: 'storage',
      icon: 'database',
      maxQpsPerInstance: 35000,
      baseLatencyMs: 1.8,
      costPerInstanceMonthly: 80,
      defaultInstances: 2,
      description: 'Self-balancing O(log N) ordered index supporting rank(k), select(i), predecessor/successor, split/merge, and range scans.'
    },
    {
      id: 'range-segment-fenwick',
      name: 'Lazy Segment Tree / Fenwick / Sparse Table',
      category: 'storage',
      icon: 'database',
      maxQpsPerInstance: 65000,
      baseLatencyMs: 1.1,
      costPerInstanceMonthly: 65,
      defaultInstances: 2,
      description: 'O(log N) monoid range-update/range-query Segment Tree, lowbit Fenwick BIT, and O(1) idempotent RMQ Sparse Table.'
    },
    {
      id: 'string-automaton-index',
      name: 'Aho-Corasick / Suffix Array / Thompson NFA',
      category: 'storage',
      icon: 'search',
      maxQpsPerInstance: 50000,
      baseLatencyMs: 1.5,
      costPerInstanceMonthly: 70,
      defaultInstances: 2,
      description: 'Linear-time O(N + M + Z) multi-pattern Aho-Corasick scanner, SA + Kasai LCP substring index, and ReDoS-proof Thompson NFA.'
    },
    {
      id: 'priority-event-scheduler',
      name: 'Indexed 4-Ary Heap / Hashed Timer Wheel',
      category: 'messaging',
      icon: 'clock',
      maxQpsPerInstance: 90000,
      baseLatencyMs: 0.5,
      costPerInstanceMonthly: 40,
      defaultInstances: 2,
      description: 'Cache-conscious 4-ary priority queue with O(log_4 N) decreaseKey and O(1) hierarchical hashed timer wheel.'
    }
  ];

  var BLUEPRINTS = [
    // =========================================================================
    // 1. Contiguous Subarray & Sliding Window Decision Matrix
    // =========================================================================
    {
      id: 'array-subarray-window-selector',
      title: 'Contiguous Subarray & Sliding Window Selector (N ≤ 10⁷)',
      subtitle: 'Prefix Sums vs Two Pointers vs Monotonic Deque vs Kadane vs Divide-and-Conquer',
      category: 'Track 1 · Linear Structures & Pointer Idioms',
      difficulty: 'Intermediate',
      targetQps: 50000,
      targetLatencyMs: 5,
      constraintN: 'N ≤ 10^7, target O(N) time & O(1)–O(K) space',
      optimalComplexity: 'O(N) time, O(1) or O(K) auxiliary space',
      description: 'Interactive decision blueprint for choosing between 1D/2D Prefix Sums, Two Pointers, Monotonic Deque, and Prefix-Sum + Ordered Map when negativity breaks window monotonicity.',
      relatedSlugs: [
        'sliding-window-monotonicity',
        'monotonic-deque-sliding-extrema',
        'prefix-sums-difference-arrays',
        'kadane-subarray-invariants'
      ],
      requirements: [
        'If all elements are non-negative (A[i] >= 0), window sum is monotonic in [L, R] -> use Two Pointers in O(N) time and O(1) space.',
        'If negative numbers exist, window sum is non-monotonic -> use Prefix Sums + Hash Map (exact sum K) or Prefix Sums + Monotonic Deque (shortest subarray >= K).',
        'For sliding window minimum/maximum of width K -> maintain a Monotonic Deque of indices where each index is pushed and popped at most once (2N ops total).',
        'For static range sum queries + batch offline range updates -> Difference Array D[L] += v, D[R+1] -= v followed by a single O(N) prefix sum pass.'
      ],
      defaultInputs: {
        dau: 5000000,
        readsPerUser: 40,
        writesPerUser: 10,
        payloadBytes: 512,
        cacheHitRatio: 88,
        replicationFactor: 2,
        retentionDays: 30
      },
      frames: [
        { id: 'f-ingest', label: '1. Input & Monotonicity Check', x: 40, y: 50, width: 250, height: 340, color: '#3b82f6' },
        { id: 'f-kernel', label: '2. O(N) Streaming Window Kernel', x: 330, y: 50, width: 320, height: 340, color: '#10b981' },
        { id: 'f-state', label: '3. Prefix / Frequency State', x: 690, y: 50, width: 260, height: 340, color: '#8b5cf6' }
      ],
      notes: [
        { id: 'note-1', title: 'Constraint Rule (N = 10^6)', text: 'O(N^2) nested loops perform 5×10^11 ops (TLE > 500s). Two pointers or Monotonic Deque guarantees <= 2N pointer advances (< 4ms).', x: 40, y: 410, color: '#f59e0b' },
        { id: 'note-2', title: 'Negative Number Trap', text: 'Never use a shrinking two-pointer window for subarray sum >= K when A[i] < 0! Use a monotonic increasing deque over prefix sums P[i].', x: 420, y: 410, color: '#ef4444' }
      ],
      nodes: [
        { id: 'n1', blockId: 'input-stream-parser', label: 'Array Stream (N ≤ 10^7)', x: 80, y: 150, instances: 1 },
        { id: 'n2', blockId: 'monotonic-window-engine', label: 'Two-Pointer / Monotonic Deque', x: 400, y: 110, instances: 2 },
        { id: 'n3', blockId: 'range-segment-fenwick', label: 'Prefix Sum / Diff Array', x: 400, y: 240, instances: 1 },
        { id: 'n4', blockId: 'hash-index-robin-hood', label: 'Prefix-Sum Frequency Map', x: 730, y: 175, instances: 1 }
      ],
      connections: [
        { from: 'n1', to: 'n2', label: 'Monotonic / Window Min-Max' },
        { from: 'n1', to: 'n3', label: 'Static Range / Negative A[i]' },
        { from: 'n2', to: 'n4', label: 'Window Distinct Count' },
        { from: 'n3', to: 'n4', label: 'P[r] - P[l] = K Lookup' }
      ]
    },

    // =========================================================================
    // 2. High-Throughput Key Lookup & Probabilistic Membership Tier
    // =========================================================================
    {
      id: 'cache-lookup-probabilistic-tier',
      title: 'High-Throughput Key Lookup & Probabilistic Filter (10⁸ Keys)',
      subtitle: 'Bloom/Xor Filter Pre-Reject + Intrusive O(1) LFU/LRU + SwissTable SIMD Hash Index',
      category: 'Track 2 · Hashing, Probing & Sketches',
      difficulty: 'Advanced',
      targetQps: 120000,
      targetLatencyMs: 2,
      constraintN: '10^8 keys, 120K QPS, < 16 bits/key filter budget',
      optimalComplexity: 'O(1) expected lookup, O(1) worst-case eviction',
      description: 'Layered lookup architecture combining a cache-line-aligned Bloom/Xor filter to reject 99% of non-existent keys with an intrusive O(1) frequency-bucketed LFU cache and SwissTable SIMD hash map.',
      relatedSlugs: [
        'case-rust-hashbrown-swisstable',
        'bloom-filters-counting-xor',
        'lru-lfu-eviction-structures',
        'build-robin-hood-hash-map'
      ],
      requirements: [
        'Pre-filter negative lookups using a Bloom Filter (m/n ≈ 9.6 bits/key, k = 7 hashes for 1% FPR) or static Xor Filter (1.23n slots, 3 memory reads).',
        'Prevent adversarial HashDoS collisions by seeding hash functions per process (SipHash-1-3 / keyed Murmur3 finalizer).',
        'Probe 16 control bytes (1-bit status + 7-bit H2 fingerprint) in a single 128-bit SSE2/NEON instruction via SwissTable layout.',
        'Maintain O(1) eviction via an intrusive doubly-linked list per frequency bucket (tracking minFreq) rather than an O(log N) heap.'
      ],
      defaultInputs: {
        dau: 10000000,
        readsPerUser: 60,
        writesPerUser: 8,
        payloadBytes: 256,
        cacheHitRatio: 94,
        replicationFactor: 2,
        retentionDays: 90
      },
      frames: [
        { id: 'f-filter', label: '1. Sublinear Membership Filter', x: 40, y: 50, width: 260, height: 340, color: '#06b6d4' },
        { id: 'f-cache', label: '2. O(1) Eviction & SIMD Hash', x: 340, y: 50, width: 320, height: 340, color: '#10b981' },
        { id: 'f-sketch', label: '3. Heavy-Hitter Admission', x: 700, y: 50, width: 260, height: 340, color: '#f59e0b' }
      ],
      notes: [
        { id: 'note-1', title: 'SwissTable SIMD Speedup', text: '16 H2 control bytes fit in one XMM register; _mm_cmpeq_epi8 + _mm_movemask_epi8 tests 16 hash slots in 2 CPU cycles.', x: 40, y: 410, color: '#06b6d4' },
        { id: 'note-2', title: 'TinyLFU Admission', text: '4-bit Count-Min Sketch with periodic halving prevents one-hit-wonder scans from polluting the O(1) LFU cache.', x: 420, y: 410, color: '#10b981' }
      ],
      nodes: [
        { id: 'n1', blockId: 'bit-parallel-filter', label: 'Bloom / Xor Filter (1% FPR)', x: 80, y: 155, instances: 1 },
        { id: 'n2', blockId: 'lru-lfu-eviction-tier', label: 'O(1) Bucketed LFU Cache', x: 410, y: 110, instances: 2 },
        { id: 'n3', blockId: 'hash-index-robin-hood', label: 'SwissTable / Robin Hood Map', x: 410, y: 240, instances: 2 },
        { id: 'n4', blockId: 'input-stream-parser', label: 'Count-Min + HyperLogLog', x: 740, y: 175, instances: 1 }
      ],
      connections: [
        { from: 'n1', to: 'n2', label: 'Maybe Present (k Hashes = 1)' },
        { from: 'n2', to: 'n3', label: 'Cache Miss -> SIMD Probe' },
        { from: 'n2', to: 'n4', label: 'Frequency & Cardinality' }
      ]
    },

    // =========================================================================
    // 3. Adaptive Sorting & Order Statistics Selector
    // =========================================================================
    {
      id: 'sorting-order-statistics-pipeline',
      title: 'Adaptive Sorting & Order-Statistic Selector (N = 10⁶..10⁹)',
      subtitle: 'TimSort vs pdqsort/Introsort vs LSD Radix Sort vs Quickselect vs External K-Way Merge',
      category: 'Track 2 · Sorting Mechanics & Order Statistics',
      difficulty: 'Intermediate',
      targetQps: 30000,
      targetLatencyMs: 8,
      constraintN: 'N ≤ 10^7 in-RAM or N = 10^9 external disk',
      optimalComplexity: 'O(N) Quickselect / Radix, O(N log N) Comparison',
      description: 'Decision matrix mapping key type, entropy, duplicate density, and memory bounds to the optimal sorting or selection algorithm.',
      relatedSlugs: [
        'case-timsort-pdqsort',
        'counting-radix-bucket-sorts',
        'quickselect-bfprt-median',
        'external-merge-sort-replacement'
      ],
      requirements: [
        'Need only the K-th smallest element or Top-K unordered? Do NOT sort in O(N log N) — use Quickselect in O(N) expected time (or size-K heap in O(N log K)).',
        'Partially sorted real-world objects requiring stability? Use TimSort (natural runs + binary insertion + galloping merge) for O(N) on presorted inputs.',
        'Unboxed primitives with possible adversarial duplicates? Use pdqsort / Introsort (3-way Dutch Flag partition + Heapsort depth fallback at 2 log₂ N).',
        'Fixed-width 32/64-bit integers with N >= 10^5? Bypass the Ω(N log N) comparison barrier using 8-bit pass LSD Radix Sort in O(w/8 · N) time.'
      ],
      defaultInputs: {
        dau: 2000000,
        readsPerUser: 25,
        writesPerUser: 15,
        payloadBytes: 1024,
        cacheHitRatio: 75,
        replicationFactor: 2,
        retentionDays: 30
      },
      frames: [
        { id: 'f-classify', label: '1. Entropy & Key Classifier', x: 40, y: 50, width: 250, height: 340, color: '#3b82f6' },
        { id: 'f-sort', label: '2. In-Memory Sort / Select Kernel', x: 330, y: 50, width: 320, height: 340, color: '#06b6d4' },
        { id: 'f-ext', label: '3. External K-Way Merge', x: 690, y: 50, width: 260, height: 340, color: '#8b5cf6' }
      ],
      notes: [
        { id: 'note-1', title: '3-Way Partition Rule', text: 'When duplicate keys exist, 2-way Lomuto degrades to O(N^2). 3-way Dutch National Flag runs in O(N log k) where k = unique keys.', x: 40, y: 410, color: '#ef4444' },
        { id: 'note-2', title: 'External Memory I/O', text: 'Replacement selection creates runs of average length 2M; a 4-ary loser tree merges K runs in O((N/B) log_{M/B}(N/M)) I/Os.', x: 420, y: 410, color: '#8b5cf6' }
      ],
      nodes: [
        { id: 'n1', blockId: 'input-stream-parser', label: 'Distribution & Key Inspector', x: 80, y: 155, instances: 1 },
        { id: 'n2', blockId: 'divide-conquer-sorter', label: 'TimSort / pdqsort / Radix', x: 400, y: 110, instances: 2 },
        { id: 'n3', blockId: 'divide-conquer-sorter', label: 'O(N) Quickselect / BFPRT', x: 400, y: 240, instances: 1 },
        { id: 'n4', blockId: 'priority-event-scheduler', label: 'K-Way Merge Min-Heap', x: 730, y: 175, instances: 1 }
      ],
      connections: [
        { from: 'n1', to: 'n2', label: 'Full Order Required' },
        { from: 'n1', to: 'n3', label: 'K-th Order Statistic Only' },
        { from: 'n2', to: 'n4', label: 'Sorted Runs > RAM Size M' }
      ]
    },

    // =========================================================================
    // 4. Ordered Dynamic Index & Storage Hierarchy (In-Memory vs NVMe)
    // =========================================================================
    {
      id: 'ordered-index-storage-hierarchy',
      title: 'Ordered Dynamic Index & Storage Hierarchy (RAM vs NVMe)',
      subtitle: 'Eytzinger Array vs LLRB/AVL vs Implicit Treap vs Skip List vs B+ Tree vs LSM-Tree',
      category: 'Track 3 · Balanced, Disk-Backed & Persistent Trees',
      difficulty: 'Staff',
      targetQps: 60000,
      targetLatencyMs: 3,
      constraintN: 'Dynamic ordered keys + predecessor/range/rank queries',
      optimalComplexity: 'O(log_B N) disk I/Os or O(log N) RAM comparisons',
      description: 'Architectural selector for ordered dictionaries across static cache-aligned Eytzinger layouts, lock-free Skip Lists, augmented LLRB/Treaps, and disk-paged B+ / LSM storage engines.',
      relatedSlugs: [
        'case-git-bisect-eytzinger',
        'b-trees-bplus-trees-disk-pages',
        'lsm-trees-write-amplification',
        'case-redis-skiplist-ziplist'
      ],
      requirements: [
        'Static dataset in RAM? Use 1-indexed BFS Eytzinger layout with software prefetching (__builtin_prefetch) for 3× faster searches than sorted binary search.',
        'In-memory dynamic order statistics (rank/select) or interval overlap? Use an augmented Left-Leaning Red-Black (LLRB) tree or Split/Merge Treap.',
        'Concurrent lock-free sorted index (e.g., Redis ZSET / LevelDB MemTable)? Use a Probabilistic Skip List (p = 1/4) avoiding global tree rotations.',
        'Block storage (4KB–16KB NVMe pages)? Choose B+ Trees (fanout B ≈ 512, height 3–4) for read/range-heavy workloads, or LSM-Trees (MemTable + Bloom-filtered SSTables) for write-intensive ingestion.'
      ],
      defaultInputs: {
        dau: 4000000,
        readsPerUser: 35,
        writesPerUser: 20,
        payloadBytes: 1024,
        cacheHitRatio: 85,
        replicationFactor: 3,
        retentionDays: 365
      },
      frames: [
        { id: 'f-mem', label: '1. In-Memory Ordered Tier', x: 40, y: 50, width: 300, height: 340, color: '#10b981' },
        { id: 'f-filter', label: '2. LSM / Page Filter Tier', x: 370, y: 50, width: 260, height: 340, color: '#06b6d4' },
        { id: 'f-disk', label: '3. Paged NVMe Storage Tier', x: 660, y: 50, width: 290, height: 340, color: '#8b5cf6' }
      ],
      notes: [
        { id: 'note-1', title: 'RUM Conjecture Tradeoff', text: 'You cannot simultaneously optimize Read overhead, Update (write) amplification, and Memory/space amplification.', x: 40, y: 410, color: '#f59e0b' },
        { id: 'note-2', title: 'B+ Tree Leaf Chaining', text: 'B+ Trees store all values in doubly-linked leaf pages, making range scans sequential page reads.', x: 420, y: 410, color: '#8b5cf6' }
      ],
      nodes: [
        { id: 'n1', blockId: 'balanced-order-tree', label: 'LLRB / SkipList MemTable', x: 90, y: 115, instances: 2 },
        { id: 'n2', blockId: 'range-segment-fenwick', label: 'Eytzinger Static Index', x: 90, y: 245, instances: 1 },
        { id: 'n3', blockId: 'bit-parallel-filter', label: 'SSTable Per-Run Bloom Filter', x: 420, y: 175, instances: 2 },
        { id: 'n4', blockId: 'balanced-order-tree', label: 'B+ Tree / Compacted SSTables', x: 710, y: 175, instances: 2 }
      ],
      connections: [
        { from: 'n1', to: 'n3', label: 'Flush Immutable MemTable' },
        { from: 'n2', to: 'n4', label: 'Fence Pointers (O(1) Page Jump)' },
        { from: 'n3', to: 'n4', label: 'Point Read -> 1 Disk Page I/O' }
      ]
    },

    // =========================================================================
    // 5. Range Query & Sublinear Decomposition Selector
    // =========================================================================
    {
      id: 'range-query-point-update-matrix',
      title: 'Range Query & Tree Path Decomposition Matrix (N, Q ≤ 5·10⁵)',
      subtitle: 'Sparse Table vs Fenwick BIT vs Lazy/Beats Segment Tree vs Persistent SegTree vs HLD',
      category: 'Track 3 · Range Queries & Tree Decompositions',
      difficulty: 'Advanced',
      targetQps: 45000,
      targetLatencyMs: 3,
      constraintN: 'N, Q ≤ 5 × 10^5, online vs offline range aggregations',
      optimalComplexity: 'O(1) static RMQ, O(log N) dynamic monoid, O(log² N) HLD',
      description: 'Complete decision blueprint mapping operation algebraic properties (invertibility, idempotence, associativity) and update patterns to the fastest range-query data structure.',
      relatedSlugs: [
        'static-range-queries-sparse-table',
        'fenwick-tree-binary-indexed',
        'lazy-propagation-segment-tree-beats',
        'heavy-light-decomposition'
      ],
      requirements: [
        'Static array + idempotent operation (min, max, gcd, bitwise AND/OR)? Use a Sparse Table for O(1) query time after O(N log N) build.',
        'Dynamic point updates + prefix-invertible group operation (+, XOR)? Use a Fenwick Tree (BIT) — 1D array of size N+1, 5× smaller and faster than a Segment Tree.',
        'Dynamic range updates + non-invertible monoid (min, max, max-subarray-sum, affine a·x + b)? Use a Lazy-Propagating Segment Tree (or Segment Tree Beats for range chmin/chmax).',
        'Historical version queries or K-th smallest in subarray [L, R]? Use a Path-Copying Persistent Segment Tree (O(log N) new nodes per update).',
        'Path/subtree queries on an arbitrary tree of N nodes? Flatten via Euler Tour (for subtrees) or Heavy-Light Decomposition (<= log₂ N heavy chains) over a Segment Tree.'
      ],
      defaultInputs: {
        dau: 2500000,
        readsPerUser: 50,
        writesPerUser: 20,
        payloadBytes: 256,
        cacheHitRatio: 90,
        replicationFactor: 2,
        retentionDays: 60
      },
      frames: [
        { id: 'f-algebra', label: '1. Algebraic Property Classifier', x: 40, y: 50, width: 260, height: 340, color: '#3b82f6' },
        { id: 'f-1d', label: '2. 1D Range Index Kernel', x: 340, y: 50, width: 310, height: 340, color: '#10b981' },
        { id: 'f-tree', label: '3. Tree / Historical Extension', x: 690, y: 50, width: 260, height: 340, color: '#8b5cf6' }
      ],
      notes: [
        { id: 'note-1', title: 'Why Fenwick Cannot Do Dynamic RMQ', text: 'min(a, b) has no inverse! Prefix [1..R] cannot "subtract" [1..L-1] for arbitrary updates; use a ZKW bottom-up Segment Tree.', x: 40, y: 410, color: '#ef4444' },
        { id: 'note-2', title: 'HLD Light-Edge Bound', text: 'Moving from a light child u to parent p at least doubles subtree size (sz[p] >= 2 sz[u]), bounding light jumps to <= log₂ N.', x: 420, y: 410, color: '#10b981' }
      ],
      nodes: [
        { id: 'n1', blockId: 'input-stream-parser', label: 'Query & Monoid Dispatcher', x: 80, y: 155, instances: 1 },
        { id: 'n2', blockId: 'range-segment-fenwick', label: 'Sparse Table (O(1)) / BIT', x: 400, y: 110, instances: 2 },
        { id: 'n3', blockId: 'range-segment-fenwick', label: 'Lazy / Beats Segment Tree', x: 400, y: 240, instances: 2 },
        { id: 'n4', blockId: 'balanced-order-tree', label: 'Persistent Roots / HLD Chains', x: 730, y: 175, instances: 1 }
      ],
      connections: [
        { from: 'n1', to: 'n2', label: 'Static RMQ or Invertible Sum' },
        { from: 'n1', to: 'n3', label: 'Range Update / General Monoid' },
        { from: 'n3', to: 'n4', label: 'Path Copying / Heavy Paths' }
      ]
    },

    // =========================================================================
    // 6. Exact, Multi-Pattern & Regex String Search Engine (ripgrep Architecture)
    // =========================================================================
    {
      id: 'multi-pattern-string-search-engine',
      title: 'Exact, Multi-Pattern & Regex String Search Engine (ripgrep)',
      subtitle: 'KMP/Z vs Boyer-Moore/SIMD Teddy vs Aho-Corasick vs Suffix Array/FM-Index vs Thompson NFA',
      category: 'Track 4 · Strings, Automata & Information Retrieval',
      difficulty: 'Staff',
      targetQps: 40000,
      targetLatencyMs: 4,
      constraintN: 'Streaming text N up to GBs, K patterns or regexes',
      optimalComplexity: 'O(N/M) average Boyer-Moore, O(N + M + Z) Aho-Corasick, O(N·M) NFA',
      description: 'Production text-search decision pipeline inspired by ripgrep and RE2: literal prefix extraction, SIMD Teddy / Boyer-Moore pre-filtering, Aho-Corasick multi-pattern trie, and ReDoS-proof Thompson NFA.',
      relatedSlugs: [
        'case-ripgrep-teddy-simd',
        'aho-corasick-trie-automaton',
        'thompson-nfa-vs-backtracking-regex',
        'suffix-arrays-prefix-doubling-sais'
      ],
      requirements: [
        'Single streaming pattern? Use KMP / Z-algorithm for strict O(N + M) worst-case guarantees, or Boyer-Moore-Horspool + SIMD memchr on rarest byte for sublinear O(N/M) speed on natural text.',
        'Multiple fixed patterns (K = 10..100,000)? Build an Aho-Corasick automaton (or SIMD Teddy for K <= 64 short literals) to scan the text in a single pass.',
        'Offline fixed corpus queried millions of times for arbitrary substrings? Precompute Suffix Array + Kasai LCP (or compressed BWT FM-Index) for O(M log N) / O(M) queries.',
        'Arbitrary regular expression? Compile to Thompson NFA (or lazy DFA cache) so worst-case execution is strictly O(N · M) with zero catastrophic backtracking.'
      ],
      defaultInputs: {
        dau: 3000000,
        readsPerUser: 30,
        writesPerUser: 5,
        payloadBytes: 2048,
        cacheHitRatio: 82,
        replicationFactor: 2,
        retentionDays: 30
      },
      frames: [
        { id: 'f-lit', label: '1. Literal Extraction & SIMD Pre-Filter', x: 40, y: 50, width: 280, height: 340, color: '#f59e0b' },
        { id: 'f-auto', label: '2. Linear Automaton Engine', x: 350, y: 50, width: 310, height: 340, color: '#10b981' },
        { id: 'f-index', label: '3. Offline Corpus Suffix Index', x: 690, y: 50, width: 260, height: 340, color: '#3b82f6' }
      ],
      notes: [
        { id: 'note-1', title: 'Why ripgrep Beats grep', text: 'Extracts required literal inner substrings from the regex AST, scans 32 bytes/cycle via AVX2 SIMD Teddy, and verifies only candidate lines with a lazy DFA.', x: 40, y: 410, color: '#f59e0b' },
        { id: 'note-2', title: 'Distinct Substrings Formula', text: 'Using Suffix Array + Kasai LCP array, total distinct substrings = N(N+1)/2 - Σ LCP[i] in O(N) time.', x: 420, y: 410, color: '#3b82f6' }
      ],
      nodes: [
        { id: 'n1', blockId: 'bit-parallel-filter', label: 'SIMD Teddy / Horspool Skipper', x: 90, y: 155, instances: 2 },
        { id: 'n2', blockId: 'string-automaton-index', label: 'Aho-Corasick Multi-Pattern DFA', x: 410, y: 110, instances: 2 },
        { id: 'n3', blockId: 'string-automaton-index', label: 'Thompson NFA / Lazy DFA', x: 410, y: 240, instances: 2 },
        { id: 'n4', blockId: 'string-automaton-index', label: 'Suffix Array + LCP / FM-Index', x: 730, y: 175, instances: 1 }
      ],
      connections: [
        { from: 'n1', to: 'n2', label: 'Multi-Literal Stream' },
        { from: 'n1', to: 'n3', label: 'Candidate Line -> NFA Verify' },
        { from: 'n2', to: 'n4', label: 'Indexed Corpus Lookup' }
      ]
    },

    // =========================================================================
    // 7. Graph Connectivity, Topological Scheduling & Dynamic Cut Engine
    // =========================================================================
    {
      id: 'graph-connectivity-cycle-analyzer',
      title: 'Graph Connectivity, Cycle Condensation & Dynamic Cut Engine',
      subtitle: 'CSR Adjacency + Kahn/DFS TopoSort vs Tarjan SCC/2-SAT vs Bridges/BCC vs Rollback DSU',
      category: 'Track 5 · Graph Representations & Connectivity',
      difficulty: 'Advanced',
      targetQps: 35000,
      targetLatencyMs: 5,
      constraintN: 'V, E ≤ 10^6, directed vs undirected connectivity',
      optimalComplexity: 'O(V + E) Tarjan/Kahn, O(α(V)) DSU, O((Q + E) log Q) Dynamic Connectivity',
      description: 'Blueprint for dependency build systems (Bazel/Cargo), circuit solvers, and fault-tolerance analyzers: CSR layout, SCC condensation DAGs, Tarjan bridge/cut-vertex detection, and offline dynamic connectivity.',
      relatedSlugs: [
        'case-bundler-build-graph-cycles',
        'scc-tarjan-kosaraju-2sat',
        'bridges-articulation-biconnected',
        'dsu-rollback-weighted-offline'
      ],
      requirements: [
        'Store static or batch graphs in Compressed Sparse Row (CSR: head[V+1] + to[E] TypedArrays) for 5–10× faster cache-local traversal than pointer arrays.',
        'Directed graph with potential cycles? Run Tarjan single-pass SCC (tin/low + stack) to report cycles and condense the graph into a DAG of components in O(V + E).',
        'Undirected single-point-of-failure analysis? Use Tarjan bridge (low[v] > tin[u]) and articulation point (low[v] >= tin[u]) detection.',
        'Incremental edge additions only? Use Disjoint Set Union (Union by Rank + Path Compression) in O(α(V)) per op. Edge deletions too? Use Segment Tree over Time + Rollback DSU in O((E + Q) log Q log V).'
      ],
      defaultInputs: {
        dau: 1500000,
        readsPerUser: 20,
        writesPerUser: 10,
        payloadBytes: 512,
        cacheHitRatio: 80,
        replicationFactor: 2,
        retentionDays: 30
      },
      frames: [
        { id: 'f-csr', label: '1. Cache-Conscious CSR Storage', x: 40, y: 50, width: 260, height: 340, color: '#3b82f6' },
        { id: 'f-dfs', label: '2. Linear O(V+E) Tarjan / Kahn', x: 340, y: 50, width: 310, height: 340, color: '#8b5cf6' },
        { id: 'f-dsu', label: '3. Dynamic Connectivity (DSU)', x: 690, y: 50, width: 260, height: 340, color: '#10b981' }
      ],
      notes: [
        { id: 'note-1', title: '2-SAT Implication Graph', text: 'Clause (a v b) becomes (~a -> b) and (~b -> a). Formula is satisfiable iff no variable x and ~x lie in the same Tarjan SCC.', x: 40, y: 410, color: '#8b5cf6' },
        { id: 'note-2', title: 'Why Rollback DSU Uses No Path Compression', text: 'Path compression mutates O(log N) pointers per find; union-by-rank alone stays O(log N) and undoes in O(1) stack pop.', x: 420, y: 410, color: '#10b981' }
      ],
      nodes: [
        { id: 'n1', blockId: 'input-stream-parser', label: 'CSR Graph Builder (head/to)', x: 80, y: 155, instances: 1 },
        { id: 'n2', blockId: 'graph-shortest-path-router', label: 'Tarjan SCC / Bridges / 2-SAT', x: 400, y: 110, instances: 2 },
        { id: 'n3', blockId: 'priority-event-scheduler', label: 'Kahn Parallel DAG Scheduler', x: 400, y: 240, instances: 1 },
        { id: 'n4', blockId: 'range-segment-fenwick', label: 'Time SegTree + Rollback DSU', x: 730, y: 175, instances: 1 }
      ],
      connections: [
        { from: 'n1', to: 'n2', label: 'DFS Timestamp & Low-Link' },
        { from: 'n2', to: 'n3', label: 'Condensed Acyclic DAG' },
        { from: 'n1', to: 'n4', label: 'Edge Lifespan Intervals [add, del]' }
      ]
    },

    // =========================================================================
    // 8. Shortest Paths & Continental Road Routing Selector
    // =========================================================================
    {
      id: 'shortest-path-routing-engine',
      title: 'Shortest Paths & Continental Road Routing Selector (V ≤ 10⁷)',
      subtitle: 'BFS vs 0-1 Deque BFS vs Dial Bucket vs 4-Ary Dijkstra vs Bidirectional A* vs Contraction Hierarchies',
      category: 'Track 5 · Shortest Paths & Heuristic Search',
      difficulty: 'Staff',
      targetQps: 25000,
      targetLatencyMs: 2,
      constraintN: 'Road network V = 2 × 10^7, target < 1ms query time',
      optimalComplexity: 'O(V + E) 0-1 BFS, O((V+E) log V) Dijkstra, <200 settles CH',
      description: 'Complete shortest-path algorithm selector mapping edge weight domains (unweighted, {0,1}, small integers, non-negative, negative, APSP, static road networks) to the optimal solver.',
      relatedSlugs: [
        'case-osrm-contraction-hierarchies',
        'dijkstra-relaxation-invariants',
        'astar-heuristic-admissibility',
        'bellman-ford-spfa-difference-constraints'
      ],
      requirements: [
        'Edge weights in {0, 1}? Use 0-1 BFS with a double-ended deque (weight 0 -> pushFront, weight 1 -> pushBack) for strict O(V + E) linear time.',
        'Non-negative weights w >= 0? Use Dijkstra with a 4-ary heap and strict stale-entry skip (if d > dist[u] continue). For point-to-point with coordinates, use Bidirectional A* with a consistent heuristic.',
        'Negative weights or difference constraints (x_v - x_u <= w)? Use Bellman-Ford in O(V · E) to detect negative cycles, or Johnson\'s potential reweighting w\'(u,v) = w(u,v) + h(u) - h(v) >= 0 followed by V Dijkstras for sparse APSP.',
        'Continental road network requiring sub-millisecond queries? Precompute Contraction Hierarchies (node importance ordering + witness shortcuts) so bidirectional upward search settles < 300 nodes!'
      ],
      defaultInputs: {
        dau: 5000000,
        readsPerUser: 20,
        writesPerUser: 2,
        payloadBytes: 512,
        cacheHitRatio: 85,
        replicationFactor: 2,
        retentionDays: 30
      },
      frames: [
        { id: 'f-weights', label: '1. Edge Weight Domain Classifier', x: 40, y: 50, width: 260, height: 340, color: '#3b82f6' },
        { id: 'f-sssp', label: '2. Online SSSP / A* Frontier', x: 340, y: 50, width: 310, height: 340, color: '#10b981' },
        { id: 'f-ch', label: '3. Contraction Hierarchy Overlay', x: 690, y: 50, width: 260, height: 340, color: '#f59e0b' }
      ],
      notes: [
        { id: 'note-1', title: 'Bidirectional Stopping Rule', text: 'Do NOT stop the instant forward and backward frontiers touch! Stop only when minKey(pqF) + minKey(pqB) >= bestPathMu.', x: 40, y: 410, color: '#ef4444' },
        { id: 'note-2', title: 'State-Space Dijkstra', text: 'When paths have K free upgrades or bitmask keys, run Dijkstra on virtual state graph (u, state) of size V × K.', x: 420, y: 410, color: '#3b82f6' }
      ],
      nodes: [
        { id: 'n1', blockId: 'monotonic-window-engine', label: '0-1 BFS Deque / Dial Buckets', x: 80, y: 155, instances: 1 },
        { id: 'n2', blockId: 'priority-event-scheduler', label: 'Indexed 4-Ary Priority Queue', x: 400, y: 110, instances: 2 },
        { id: 'n3', blockId: 'graph-shortest-path-router', label: 'Bidirectional A* / Johnson Potentials', x: 400, y: 240, instances: 2 },
        { id: 'n4', blockId: 'graph-shortest-path-router', label: 'Contraction Hierarchy Upward DAG', x: 730, y: 175, instances: 2 }
      ],
      connections: [
        { from: 'n1', to: 'n2', label: 'General Non-Negative Weights' },
        { from: 'n2', to: 'n3', label: 'Settle Min d === dist[u]' },
        { from: 'n3', to: 'n4', label: 'Shortcut Witness Overlay (1ms)' }
      ]
    },

    // =========================================================================
    // 9. Network Flow, Min-Cut & Bipartite Assignment Blueprint
    // =========================================================================
    {
      id: 'network-flow-matching-reduction',
      title: 'Network Flow, Min-Cut & Bipartite Assignment Blueprint',
      subtitle: 'Hopcroft-Karp vs Dinic Blocking Flow vs Push-Relabel vs Hungarian vs Min-Cost Max-Flow',
      category: 'Track 5 · Network Flow & Combinatorial Reductions',
      difficulty: 'Staff',
      targetQps: 12000,
      targetLatencyMs: 10,
      constraintN: 'Bipartite matching, project closure, or circulation demands',
      optimalComplexity: 'O(E √V) Dinic / Hopcroft-Karp, O(V³) Hungarian, O(F · E log V) MCMF',
      description: 'Reduction blueprint for transforming scheduling, assignment, image segmentation, and project selection problems into Max-Flow, Min-Cut, or Min-Cost Max-Flow networks.',
      relatedSlugs: [
        'dinic-level-graph-blocking-flow',
        'bipartite-matching-hopcroft-karp',
        'min-cost-max-flow-mcmf',
        'flow-reductions-project-selection'
      ],
      requirements: [
        'Unweighted Bipartite Matching (Maximum Independent Set / Minimum Vertex Cover via König\'s Theorem)? Use Dinic on unit network or Hopcroft-Karp in O(E √V) time.',
        'Dense N × N Minimum-Weight Perfect Bipartite Assignment? Use the Kuhn-Munkres Hungarian Algorithm with primal-dual vertex potentials u[i] + v[j] <= cost[i][j] in O(N³).',
        'Project Selection / Maximum-Weight Closure (projects with positive revenue, prerequisites with negative cost)? Model as s-t Min-Cut: s -> positive projects, negative costs -> t, ∞ capacity on dependencies.',
        'Capacitated assignment with per-unit transport costs? Use Min-Cost Max-Flow (MCMF) via Successive Shortest Paths with Johnson potential reweighting.'
      ],
      defaultInputs: {
        dau: 800000,
        readsPerUser: 15,
        writesPerUser: 10,
        payloadBytes: 1024,
        cacheHitRatio: 70,
        replicationFactor: 2,
        retentionDays: 30
      },
      frames: [
        { id: 'f-model', label: '1. Graph Reduction Builder', x: 40, y: 50, width: 260, height: 340, color: '#8b5cf6' },
        { id: 'f-flow', label: '2. Blocking Flow / Preflow Engine', x: 340, y: 50, width: 310, height: 340, color: '#10b981' },
        { id: 'f-cut', label: '3. Min-Cut & Dual Potentials', x: 690, y: 50, width: 260, height: 340, color: '#ec4899' }
      ],
      notes: [
        { id: 'note-1', title: 'König\'s Bipartite Duality', text: 'In any bipartite graph, Max Matching = Min Vertex Cover, and Max Independent Set = V - Max Matching.', x: 40, y: 410, color: '#8b5cf6' },
        { id: 'note-2', title: 'Current-Arc Pointer Invariant', text: 'Dinic MUST advance ptr[u] across DFS calls within a phase; otherwise dead-end edges degrade each phase to O(V^2 E).', x: 420, y: 410, color: '#ef4444' }
      ],
      nodes: [
        { id: 'n1', blockId: 'input-stream-parser', label: 'Residual Network & Demands', x: 80, y: 155, instances: 1 },
        { id: 'n2', blockId: 'graph-shortest-path-router', label: 'Dinic (BFS Level + ptr[u] DFS)', x: 400, y: 110, instances: 2 },
        { id: 'n3', blockId: 'graph-shortest-path-router', label: 'Hungarian / Johnson MCMF', x: 400, y: 240, instances: 2 },
        { id: 'n4', blockId: 'balanced-order-tree', label: 'Residual s-Reachable Min-Cut', x: 730, y: 175, instances: 1 }
      ],
      connections: [
        { from: 'n1', to: 'n2', label: 'Max-Flow / Unit Matching' },
        { from: 'n1', to: 'n3', label: 'Weighted Cost / Potentials' },
        { from: 'n2', to: 'n4', label: 'Saturated Cut Partition (S, T)' }
      ]
    },

    // =========================================================================
    // 10. Dynamic Programming State Space & Algebraic Optimization Selector
    // =========================================================================
    {
      id: 'dp-state-space-optimization-matrix',
      title: 'DP State Space & Algebraic Optimization Matrix',
      subtitle: 'Rolling Array vs Bitmask/SOS vs Monge D&C/Knuth vs Li Chao Convex Hull Trick vs Aliens Trick',
      category: 'Track 6 · Dynamic Programming & Algebraic Optimizations',
      difficulty: 'Grandmaster',
      targetQps: 20000,
      targetLatencyMs: 6,
      constraintN: 'Reducing O(N³) / O(K·N²) transitions to O(N log N) or O(N)',
      optimalComplexity: 'O(N log N) CHT / Aliens / D&C, O(N 2^N) SOS DP',
      description: 'Master decision matrix for compressing DP space and accelerating transition bottlenecks using monotonicity of optimal split points, linear-envelope geometry, and Lagrangian relaxation.',
      relatedSlugs: [
        'dp-optimal-substructure-dag',
        'convex-hull-trick-li-chao-tree',
        'divide-and-conquer-dp-quadrangle',
        'aliens-trick-wqs-binary-search'
      ],
      requirements: [
        'Transition dp[i] = min_{j < i} (dp[j] + m_j · x_i + b_j) has a product term m_j · x_i? Model each j as a line y = m_j x + (dp[j] + b_j) and query via Convex Hull Trick (monotonic deque in O(N) or Li Chao Segment Tree in O(N log X) for arbitrary slopes).',
        '2D layering dp[k][i] = min_{j < i} (dp[k-1][j] + C(j, i)) where C satisfies the Quadrangle Inequality C(a,c) + C(b,d) <= C(a,d) + C(b,c)? Optimal split opt[k][i] is monotonic in i -> use Divide & Conquer DP in O(K N log N).',
        'Interval DP dp[l][r] = min_{l <= k < r} (dp[l][k] + dp[k+1][r]) + C(l, r) with Quadrangle Inequality? Use Knuth-Yao bounds opt[l][r-1] <= opt[l][r] <= opt[l+1][r] to drop O(N³) to O(N²).',
        'Constrained to pick exactly K items/segments with concave/convex value F(K)? Apply the Aliens Trick (WQS Binary Search): binary search per-item penalty λ and solve unconstrained DP in O(N log(range)).',
        'Subset convolution f[mask] = Σ_{sub ⊆ mask} g[sub] for N <= 22? Replace O(3^N) submask iteration with Sum Over Subsets (SOS) DP in O(N 2^N).'
      ],
      defaultInputs: {
        dau: 1800000,
        readsPerUser: 30,
        writesPerUser: 8,
        payloadBytes: 512,
        cacheHitRatio: 88,
        replicationFactor: 2,
        retentionDays: 30
      },
      frames: [
        { id: 'f-state', label: '1. SRTBOT State & Cost Form', x: 40, y: 50, width: 260, height: 340, color: '#ec4899' },
        { id: 'f-opt', label: '2. Transition Accelerator', x: 340, y: 50, width: 320, height: 340, color: '#8b5cf6' },
        { id: 'f-space', label: '3. Space & Dimension Reduction', x: 700, y: 50, width: 260, height: 340, color: '#10b981' }
      ],
      notes: [
        { id: 'note-1', title: 'CHT vs Monge D&C', text: 'If cost C(j, i) factors as m(j)*x(i), use Li Chao CHT. If C(j, i) is a general Monge function satisfying Quadrangle Inequality, use D&C DP.', x: 40, y: 410, color: '#ec4899' },
        { id: 'note-2', title: 'Hirschberg Space Trick', text: 'To reconstruct the actual optimal path in O(min(N,M)) space, find the midpoint split via forward + backward 1D DP rolls and recurse.', x: 420, y: 410, color: '#10b981' }
      ],
      nodes: [
        { id: 'n1', blockId: 'input-stream-parser', label: 'Recurrence & Cost Classifier', x: 80, y: 155, instances: 1 },
        { id: 'n2', blockId: 'dp-state-optimizer', label: 'Li Chao Tree / Monotonic CHT', x: 400, y: 110, instances: 2 },
        { id: 'n3', blockId: 'dp-state-optimizer', label: 'Monge D&C / Knuth / SOS Kernel', x: 400, y: 240, instances: 2 },
        { id: 'n4', blockId: 'range-segment-fenwick', label: 'WQS Aliens Binary Search + 1D Roll', x: 740, y: 175, instances: 1 }
      ],
      connections: [
        { from: 'n1', to: 'n2', label: 'Bilinear m_j · x_i + b_j' },
        { from: 'n1', to: 'n3', label: 'Quadrangle Inequality / Bitmask' },
        { from: 'n2', to: 'n4', label: 'Remove K-Cardinality via λ Penalty' },
        { from: 'n3', to: 'n4', label: 'Compress Space to O(N)' }
      ]
    }
  ];

  // Add alias ID 'url-shortener' lookup support via calculateCapacity & blueprint helper
  function calculateCapacity(inputs, nodes, connections) {
    var dau = Number(inputs && inputs.dau) || 1000000;
    var readsPerUser = Number(inputs && inputs.readsPerUser) || 30;
    var writesPerUser = Number(inputs && inputs.writesPerUser) || 5;
    var payloadBytes = Number(inputs && inputs.payloadBytes) || 512;
    var cacheHitRatio = Math.min(99.9, Math.max(0, Number(inputs && inputs.cacheHitRatio) || 85));
    var replicationFactor = Math.max(1, Number(inputs && inputs.replicationFactor) || 2);
    var retentionDays = Math.max(1, Number(inputs && inputs.retentionDays) || 30);

    var readQps = Math.round((dau * readsPerUser) / 86400);
    var writeQps = Math.round((dau * writesPerUser) / 86400);
    var totalQps = readQps + writeQps;
    var peakQps = Math.round(totalQps * 2.5);

    var ingressMbps = Number(((writeQps * payloadBytes * 8) / 1e6).toFixed(2));
    var egressMbps = Number(((readQps * payloadBytes * 8) / 1e6).toFixed(2));
    var originReadQps = Math.round(readQps * (1 - cacheHitRatio / 100));

    var dailyStorageGb = Number(((dau * writesPerUser * payloadBytes * replicationFactor) / 1e9).toFixed(2));
    var yearlyStorageTb = Number(((dailyStorageGb * retentionDays) / 1000).toFixed(2));
    var hotRamGb = Number(Math.max(0.5, (dailyStorageGb * 0.2)).toFixed(2));
    var computeCores = Math.max(2, Math.ceil(peakQps / 15000));

    var blockMap = {};
    for (var i = 0; i < BUILDING_BLOCKS.length; i++) {
      blockMap[BUILDING_BLOCKS[i].id] = BUILDING_BLOCKS[i];
    }

    var nodeList = Array.isArray(nodes) ? nodes : [];
    var totalLatency = 0.4;
    var totalMonthlyCost = 0;
    var bottlenecks = [];
    var nodeMetrics = {};

    for (var j = 0; j < nodeList.length; j++) {
      var n = nodeList[j];
      var block = blockMap[n.blockId] || BUILDING_BLOCKS[0];
      var inst = Math.max(1, Number(n.instances) || block.defaultInstances || 1);
      var cap = inst * (block.maxQpsPerInstance || 50000);
      var effectiveLoad = block.category === 'storage' ? (originReadQps + writeQps) : totalQps;
      var util = Math.min(999, Math.round((effectiveLoad / Math.max(1, cap)) * 100));

      var nodeLat = block.baseLatencyMs * (util > 85 ? 1 + (util - 85) * 0.08 : 1);
      totalLatency += nodeLat;
      totalMonthlyCost += inst * (block.costPerInstanceMonthly || 25);

      nodeMetrics[n.id] = {
        capacityQps: cap,
        utilizationPct: util,
        latencyMs: Number(nodeLat.toFixed(2)),
        status: util > 95 ? 'overloaded' : (util > 75 ? 'warning' : 'healthy')
      };

      if (util > 90) {
        bottlenecks.push({
          nodeId: n.id,
          label: n.label || block.name,
          utilizationPct: util,
          recommendation: 'Scale ' + (n.label || block.name) + ' instances or upgrade to a lower asymptotic complexity structure.'
        });
      }
    }

    return {
      readQps: readQps,
      writeQps: writeQps,
      totalQps: totalQps,
      peakQps: peakQps,
      ingressMbps: ingressMbps,
      egressMbps: egressMbps,
      cacheHitRatio: cacheHitRatio,
      originReadQps: originReadQps,
      dailyStorageGb: dailyStorageGb,
      yearlyStorageTb: yearlyStorageTb,
      hotRamGb: hotRamGb,
      computeCores: computeCores,
      estimatedP99Ms: Number(totalLatency.toFixed(2)),
      estimatedMonthlyCostUsd: Math.round(totalMonthlyCost),
      bottlenecks: bottlenecks,
      nodeMetrics: nodeMetrics
    };
  }

  var WHITEBOARD_DATA = {
    version: '2.0.0',
    buildingBlocks: BUILDING_BLOCKS,
    blueprints: BLUEPRINTS,
    calculateCapacity: calculateCapacity
  };

  root.WHITEBOARD_DATA = WHITEBOARD_DATA;
  root.WHITEBOARD_BLUEPRINTS = BLUEPRINTS;
})(typeof window !== 'undefined' ? window : globalThis);
