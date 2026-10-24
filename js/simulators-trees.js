/* ═══════════════════════════════════════════════════════════════
   DSA In Depth — Track II & III Simulators (Sorting, Search, Trees & Range Queries)
   11. sim-sorting-race
   12. sim-binary-search-decision
   13. sim-binary-dary-heap (alias: sim-binary-heap-sift)
   14. sim-avl-red-black-tree (alias: sim-avl-llrb-rotations)
   15. sim-bplus-tree-splitting (alias: sim-btree-split-merge)
   16. sim-treap-splay-tree (alias: sim-treap-splay)
   17. sim-segment-tree-lazy
   18. sim-fenwick-bit-tree (alias: sim-fenwick-bit-jump)
   19. sim-morris-euler-traversal
   20. sim-bst-hibbard-deletion
   21. sim-fibonacci-heap-timer-wheel
   22. sim-interval-order-statistic-tree
   23. sim-persistent-path-copying
   24. sim-sparse-table-lca-rmq
   25. sim-mos-sqrt-decomposition
   ═══════════════════════════════════════════════════════════════ */

window.SIMULATORS = window.SIMULATORS || {};

(() => {
  const { esc, createStepSimulator, renderArrayCells } = window.Simulators;

  // ───────────────────────────────────────────────────────────────
  // 11. Sorting Arena: QuickSort 3-Way, MergeSort & LSD RadixSort
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-sorting-race'] = createStepSimulator({
    id: 'sim-sorting-race',
    aliases: [],
    title: 'Sorting Arena: 3-Way QuickSort, MergeSort & LSD RadixSort',
    badge: 'O(N log N) vs O(d·N)',
    badgeClass: 'badge-onlogn',
    blurb: 'Step through Bentley-McIlroy 3-way partition QuickSort, Bottom-Up MergeSort inversion counting, and non-comparison LSD RadixSort with live comparison and swap counters.',
    slugs: [
      'quadratic-sorts-inversions',
      'mergesort-bottom-up-inversions',
      'quicksort-partition-schemes',
      'randomized-quicksort-expectation',
      'decision-tree-lower-bound',
      'counting-radix-bucket-sorts'
    ],
    presets: [
      { id: 'qs3', label: 'QuickSort 3-Way Partition (Duplicate Keys)', mode: 'qs3' },
      { id: 'merge', label: 'Bottom-Up MergeSort & Inversion Count', mode: 'merge' },
      { id: 'radix', label: 'Non-Comparison LSD RadixSort (Base 10)', mode: 'radix' }
    ],
    buildFrames(preset) {
      const frames = [];
      if (preset.mode === 'radix') {
        const states = [
          { arr: [170, 45, 75, 90, 802, 24, 2, 66], pass: 'Initial Unsorted Array', exp: '-' },
          { arr: [170, 90, 802, 2, 24, 45, 75, 66], pass: 'Pass 1: Stable Bucket Sort by 1s Digit (d=1)', exp: '10^0' },
          { arr: [802, 2, 24, 45, 66, 170, 75, 90], pass: 'Pass 2: Stable Bucket Sort by 10s Digit (d=10)', exp: '10^1' },
          { arr: [2, 24, 45, 66, 75, 90, 170, 802], pass: 'Pass 3: Stable Bucket Sort by 100s Digit (d=100) — Sorted!', exp: '10^2' }
        ];
        states.forEach((st, i) => {
          frames.push({
            stageHtml: renderArrayCells(st.arr, { match: i === 3 ? [0, 1, 2, 3, 4, 5, 6, 7] : [], active: i > 0 && i < 3 ? [0, 1, 2, 3, 4, 5, 6, 7] : [] }),
            invariant: `${st.pass} | Relative order of lower digits preserved by stability!`,
            metrics: [
              { label: 'Digit Place', value: st.exp },
              { label: 'Key Comparisons', value: '0 (Non-Comparison!)' },
              { label: 'Bucket Passes', value: `${i} / 3` },
              { label: 'Time Bound', value: 'O(d · (N + B))' }
            ],
            log: st.pass
          });
        });
        return frames;
      }

      const init = [38, 27, 43, 3, 9, 82, 10, 27];
      const steps = [
        { arr: [38, 27, 43, 3, 9, 82, 10, 27], active: [0, 1, 2, 3, 4, 5, 6, 7], pivot: [1], cmp: 0, swp: 0, msg: 'Select pivot = 27. Partition into < 27, == 27, > 27.' },
        { arr: [3, 9, 10, 27, 27, 38, 43, 82], match: [3, 4], active: [0, 1, 2], pivot: [5, 6, 7], cmp: 7, swp: 5, msg: '3-Way Partition complete! Equal band [3..4] (both 27s) locked in final position.' },
        { arr: [3, 9, 10, 27, 27, 38, 43, 82], match: [0, 1, 2, 3, 4], pivot: [5, 6, 7], cmp: 10, swp: 5, msg: 'Left partition [3, 9, 10] sorted around pivot 9.' },
        { arr: [3, 9, 10, 27, 27, 38, 43, 82], match: [0, 1, 2, 3, 4, 5, 6, 7], active: [], pivot: [], cmp: 13, swp: 6, msg: 'Right partition [38, 43, 82] sorted around pivot 43. Array fully sorted!' }
      ];
      steps.forEach((st) => {
        frames.push({
          stageHtml: renderArrayCells(st.arr, { active: st.active, match: st.match, pivot: st.pivot }),
          invariant: `Partition Invariant: A[lo..lt-1] < pivot | A[lt..gt] == pivot | A[gt+1..hi] > pivot`,
          metrics: [
            { label: 'Comparisons', value: `${st.cmp}` },
            { label: 'Swaps / Moves', value: `${st.swp}` },
            { label: 'Equal Keys Locked', value: `${(st.match || []).length} / ${st.arr.length}` }
          ],
          log: st.msg
        });
      });
      return frames;
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 12. Monotonic Predicate [F, F, F, T, T, T] Binary Search
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-binary-search-decision'] = createStepSimulator({
    id: 'sim-binary-search-decision',
    aliases: ['sim-binary-search-predicate'],
    title: 'Half-Open [lo, hi) Monotonic Predicate Decision Boundary Search',
    badge: 'O(log N) · Zero Off-By-One',
    badgeClass: 'badge-ologn',
    blurb: 'Evaluate predicate P(x) over a monotonic boolean space [F, F, ..., F, T, T, ..., T]. Maintain the loop invariant P(lo−1) == False and P(hi) == True until lo == hi.',
    slugs: [
      'binary-search-boundary-invariants',
      'parametric-search-answer-space',
      'rotated-bitonic-unbounded-search',
      'meet-in-the-middle-search'
    ],
    presets: [
      { id: 'lower_bound', label: 'First True Boundary in [F, F, F, F, F, T, T, T]', boundary: 5 },
      { id: 'koko', label: 'Parametric Search: Minimum Ship Capacity (boundary = 2)', boundary: 2 }
    ],
    buildFrames(preset) {
      const frames = [];
      const vals = [10, 18, 24, 31, 39, 47, 55, 68];
      const b = preset.boundary;
      let lo = 0, hi = vals.length, step = 0;

      while (lo < hi) {
        const mid = lo + ((hi - lo) >> 1);
        const pred = mid >= b;
        step++;

        const tags = {};
        vals.forEach((_, i) => {
          tags[i] = i >= b ? 'P=True' : 'P=False';
        });
        tags[mid] = `mid=${mid} (${pred ? 'T' : 'F'})`;

        const active = [];
        for (let i = lo; i < hi; i++) active.push(i);

        const prevLo = lo, prevHi = hi;
        if (pred) hi = mid;
        else lo = mid + 1;

        frames.push({
          stageHtml: renderArrayCells(vals, { active, pivot: [mid], match: vals.map((_, i) => i >= b ? i : -1).filter(i => i >= 0), tags }),
          invariant: `Invariant: P(i < ${lo}) = False ∧ P(i ≥ ${hi}) = True | Active Half-Open Interval: [${lo}, ${hi})`,
          metrics: [
            { label: 'Interval [lo, hi)', value: `[${prevLo}, ${prevHi}) -> [${lo}, ${hi})` },
            { label: 'Midpoint Probe', value: `mid = ${mid} (val ${vals[mid]})` },
            { label: 'Predicate P(mid)', value: pred ? 'TRUE (hi = mid)' : 'FALSE (lo = mid + 1)' },
            { label: 'Probes Used', value: `${step} / ⌈log₂ 8⌉ = 3` }
          ],
          log: `Probed mid=${mid}: P(${vals[mid]}) is ${pred}. Narrowed interval [${prevLo}, ${prevHi}) -> [${lo}, ${hi}).`
        });
      }

      frames.push({
        stageHtml: renderArrayCells(vals, { match: [lo], tags: { [lo]: `lo=hi=${lo} (FIRST TRUE)` } }),
        invariant: `Terminated: lo == hi == ${lo}. First index satisfying P(x) = True is [${lo}] (value ${vals[lo]}).`,
        metrics: [
          { label: 'Converged Index', value: `lo = hi = ${lo}` },
          { label: 'Optimal Value', value: `${vals[lo]}` },
          { label: 'Total Evaluations', value: `${step}` },
          { label: 'Off-By-One Risk', value: '0% (Half-Open)' }
        ],
        log: `Loop terminated with lo == hi == ${lo}. Exact decision boundary found at index [${lo}]!`
      });

      return frames;
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 13. Binary / d-Ary Heap Sift & Floyd's O(N) Bottom-Up Heapify
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-binary-dary-heap'] = createStepSimulator({
    id: 'sim-binary-dary-heap',
    aliases: ['sim-binary-heap-sift', 'sim-heap-sift', 'sim-heap-floyd-build'],
    title: 'Binary & d-Ary Heap Dual View, Floyd O(N) Build & Indexed PQ',
    badge: 'Floyd Build O(N) · Sift O(log_d N)',
    badgeClass: 'badge-on',
    blurb: 'Observe how implicit array indices (parent = ⌊(i−1)/d⌋, child_k = d·i+k) eliminate pointer overhead, why Floyd’s bottom-up siftDown sums ∑ 2^(h−k)·k ≤ 2N work, and how an Indexed PQ maintains pos[id] ⇄ heap[i].',
    slugs: [
      'binary-d-ary-heaps',
      'two-heaps-k-way-merge-patterns',
      'build-indexed-d-ary-priority-queue',
      'binary-dary-heaps-floyd-build',
      'indexed-priority-queue-two-heaps',
      'build-indexed-dary-priority-queue'
    ],
    presets: [
      { id: 'floyd', label: 'Floyd Bottom-Up O(N) Min-Heap Construction', mode: 'floyd' },
      { id: 'extract', label: 'Indexed 4-Ary PQ decreaseKey(id, newKey) + Two-Heaps Median', mode: 'extract' }
    ],
    buildFrames(preset) {
      const frames = [];
      const arr = [45, 32, 18, 29, 12, 9, 25];
      let totalSwaps = 0;

      const renderHeapStage = (a, activeIdx, swappedIdx) => {
        const tags = { 0: 'Root' };
        for (let i = 1; i < a.length; i++) tags[i] = `p=[${(i - 1) >> 1}]`;
        return `
          <div style="font-size:12px;font-family:var(--font-mono,monospace);text-align:center;color:var(--fg-muted);">
            Tree Levels: &nbsp; L0: [${a[0]}] &nbsp;|&nbsp; L1: [${a[1]}, ${a[2]}] &nbsp;|&nbsp; L2: [${a.slice(3).join(', ')}]
          </div>
          ${renderArrayCells(a, { pivot: activeIdx != null ? [activeIdx] : [], match: swappedIdx != null ? [swappedIdx] : [], tags })}
        `;
      };

      frames.push({
        stageHtml: renderHeapStage(arr, null, null),
        invariant: `Leaves [${Math.floor(arr.length / 2)}..${arr.length - 1}] are trivially valid 1-node heaps (0 work for 50% of nodes!).`,
        metrics: [
          { label: 'Heap Size N', value: `${arr.length}` },
          { label: 'Internal Nodes', value: `i = ${Math.floor(arr.length / 2) - 1} down to 0` },
          { label: 'Total Sift Swaps', value: '0' },
          { label: 'Bound ∑ h_i', value: '≤ 2N − 2 log₂N' }
        ],
        log: 'Starting Floyd bottom-up heapify from last internal node i = ⌊N/2⌋ - 1 = 2 down to 0.'
      });

      for (let start = Math.floor(arr.length / 2) - 1; start >= 0; start--) {
        let cur = start;
        while (2 * cur + 1 < arr.length) {
          let left = 2 * cur + 1;
          let right = left + 1;
          let smallest = left;
          if (right < arr.length && arr[right] < arr[left]) smallest = right;
          if (arr[cur] <= arr[smallest]) break;
          const oldCurVal = arr[cur], oldSmVal = arr[smallest];
          [arr[cur], arr[smallest]] = [arr[smallest], arr[cur]];
          totalSwaps++;
          frames.push({
            stageHtml: renderHeapStage([...arr], cur, smallest),
            invariant: `siftDown(start=${start}): swapped parent [${cur}]=${oldCurVal} with smaller child [${smallest}]=${oldSmVal}`,
            metrics: [
              { label: 'Root Index', value: `i = ${start}` },
              { label: 'Swapped Indices', value: `[${cur}] ⇄ [${smallest}]` },
              { label: 'Total Swaps', value: `${totalSwaps}` },
              { label: 'Current Min (A[0])', value: `${arr[0]}` }
            ],
            log: `siftDown(${start}): A[${cur}]=${oldCurVal} > A[${smallest}]=${oldSmVal} -> swapped to restore min-heap order.`
          });
          cur = smallest;
        }
      }
      return frames;
    }
  });
  window.SIMULATORS['sim-binary-heap-sift'] = window.SIMULATORS['sim-binary-dary-heap'];

  // ───────────────────────────────────────────────────────────────
  // 14. AVL & Left-Leaning Red-Black (LLRB) Tree Rotations
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-avl-red-black-tree'] = createStepSimulator({
    id: 'sim-avl-red-black-tree',
    aliases: ['sim-avl-llrb-rotations', 'sim-avl-red-black'],
    title: 'Self-Balancing BST: AVL Balance Factors & LLRB 2-3-4 Rotations',
    badge: 'Height ≤ 1.44 log₂N (AVL) / 2 log₂N (RB)',
    badgeClass: 'badge-ologn',
    blurb: 'Trace how AVL LL/LR/RR/RL rotations and Sedgewick Left-Leaning Red-Black (LLRB) local transformations (rotateLeft, rotateRight, flipColors) preserve in-order sequence and subtree sizes while bounding tree height.',
    slugs: [
      'tree-rotations-avl-invariants',
      'red-black-llrb-isomorphism',
      'build-llrb-order-statistic-tree',
      'tree-rotations-avl-balance',
      'build-left-leaning-red-black-tree'
    ],
    presets: [
      { id: 'llrb', label: 'LLRB Insert Sequence (10, 20, 30, 15, 25) & Color Flips', mode: 'llrb' },
      { id: 'avl_lr', label: 'AVL Left-Right (LR) Double Rotation on Skewed Insert', mode: 'avl' }
    ],
    buildFrames() {
      const steps = [
        {
          svg: `
            <svg viewBox="0 0 460 150" style="width:100%;max-height:165px;">
              <line x1="230" y1="35" x2="310" y2="95" stroke="#ef4444" stroke-width="3"/>
              <circle cx="230" cy="35" r="20" fill="#18181b" stroke="#6366f1" stroke-width="2"/>
              <text x="230" y="40" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">10(B)</text>
              <circle cx="310" cy="95" r="20" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
              <text x="310" y="100" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">20(R)</text>
            </svg>
          `,
          inv: 'Inserted 20: Red right-leaning link on 10 -> violates LLRB left-leaning invariant!',
          op: 'Insert 20 (Red)',
          rot: 'Pending rotateLeft(10)',
          bh: '1'
        },
        {
          svg: `
            <svg viewBox="0 0 460 150" style="width:100%;max-height:165px;">
              <line x1="230" y1="35" x2="150" y2="95" stroke="#ef4444" stroke-width="3"/>
              <circle cx="230" cy="35" r="20" fill="#18181b" stroke="#10b981" stroke-width="2"/>
              <text x="230" y="40" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">20(B)</text>
              <circle cx="150" cy="95" r="20" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
              <text x="150" y="100" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">10(R)</text>
            </svg>
          `,
          inv: 'Executed rotateLeft(10): 20 becomes root, red link now leans left (20 -> 10). In-order [10, 20] preserved!',
          op: 'rotateLeft(10)',
          rot: '1 Left Rotation',
          bh: '1'
        },
        {
          svg: `
            <svg viewBox="0 0 460 150" style="width:100%;max-height:165px;">
              <line x1="230" y1="35" x2="150" y2="95" stroke="#ef4444" stroke-width="3"/>
              <line x1="230" y1="35" x2="310" y2="95" stroke="#ef4444" stroke-width="3"/>
              <circle cx="230" cy="35" r="20" fill="#18181b" stroke="#f59e0b" stroke-width="2"/>
              <text x="230" y="40" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">20(B)</text>
              <circle cx="150" cy="95" r="20" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
              <text x="150" y="100" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">10(R)</text>
              <circle cx="310" cy="95" r="20" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
              <text x="310" y="100" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">30(R)</text>
            </svg>
          `,
          inv: 'Inserted 30: Both children of 20 are RED (temporary 4-node [10, 20, 30]) -> trigger flipColors(20)!',
          op: 'Insert 30 (Red)',
          rot: 'Temporary 4-Node',
          bh: '1'
        },
        {
          svg: `
            <svg viewBox="0 0 460 150" style="width:100%;max-height:165px;">
              <line x1="230" y1="35" x2="150" y2="95" stroke="#71717a" stroke-width="2"/>
              <line x1="230" y1="35" x2="310" y2="95" stroke="#71717a" stroke-width="2"/>
              <circle cx="230" cy="35" r="20" fill="#18181b" stroke="#10b981" stroke-width="2"/>
              <text x="230" y="40" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">20(B)</text>
              <circle cx="150" cy="95" r="20" fill="#18181b" stroke="#6366f1" stroke-width="2"/>
              <text x="150" y="100" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">10(B)</text>
              <circle cx="310" cy="95" r="20" fill="#18181b" stroke="#6366f1" stroke-width="2"/>
              <text x="310" y="100" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">30(B)</text>
            </svg>
          `,
          inv: 'flipColors(20) + root forced BLACK: Black-height increased uniformly to 2 across all root-to-leaf paths!',
          op: 'flipColors(20)',
          rot: 'Balanced 2-3 Isomorphism',
          bh: '2 (Perfect Balance)'
        }
      ];

      return steps.map(st => ({
        stageHtml: st.svg,
        invariant: st.inv,
        metrics: [
          { label: 'Operation', value: st.op },
          { label: 'Rebalance Action', value: st.rot },
          { label: 'Black-Height (bh)', value: st.bh },
          { label: 'In-Order Keys', value: '[10, 20, 30]' }
        ],
        log: st.inv
      }));
    }
  });
  window.SIMULATORS['sim-avl-llrb-rotations'] = window.SIMULATORS['sim-avl-red-black-tree'];

  // ───────────────────────────────────────────────────────────────
  // 15. B+ Tree Page Split, Leaf Sibling Scan & LSM-Tree Compaction
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-bplus-tree-splitting'] = createStepSimulator({
    id: 'sim-bplus-tree-splitting',
    aliases: ['sim-btree-split-merge', 'sim-btree-node-split', 'sim-bplus-tree-page-split'],
    title: 'B+ Tree Page Split, Leaf Sibling Scan & LSM-Tree SSTable Compaction',
    badge: 'O(log_B N) I/Os vs LSM Sequential Writes',
    badgeClass: 'badge-ologn',
    blurb: 'Trace how a full B+ Tree leaf page splits and copies its separator key up to the parent directory, or switch to LSM-Tree mode to inspect MemTable flushes, L0→L1 k-way merge compaction, and Bloom filter skips.',
    slugs: [
      'b-trees-bplus-trees-disk-pages',
      'lsm-trees-write-amplification',
      'btrees-bplus-trees-disk-pages',
      'lsm-trees-compaction-write-amp'
    ],
    presets: [
      { id: 'split', label: 'B+ Tree Leaf Overflow Split (Insert 25 into Full Leaf)', mode: 'split' },
      { id: 'lsm', label: 'LSM-Tree MemTable Flush, L0→L1 Compaction & Bloom Filter', mode: 'lsm' },
      { id: 'scan', label: 'Range Query [15, 45] via Leaf Sibling Pointer Chain', mode: 'scan' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'lsm') {
        const lsmSteps = [
          {
            html: `
              <div style="text-align:center;font-family:var(--font-mono,monospace);font-size:12px;">
                <div style="margin-bottom:8px;color:#34d399;">RAM MemTable (RB-Tree / SkipList, 4/4 Full): <code>[ k10="v1" | k20="v2_new" | k35="TOMB" ]</code></div>
                <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
                  <div style="border:1px solid #f59e0b;border-radius:8px;padding:8px 12px;background:rgba(245,158,11,0.1);">
                    L0 SSTable #1: <b>[ k15="a" | k20="v2_old" | k40="b" ]</b> (Bloom: 10 bits/key)
                  </div>
                  <div style="border:1px solid #6366f1;border-radius:8px;padding:8px 12px;background:rgba(99,102,241,0.1);">
                    L1 Disjoint Run: <b>[ k05="z" | k35="old" | k50="w" ]</b>
                  </div>
                </div>
              </div>
            `,
            inv: 'Write Path: Sequential WAL append + in-memory MemTable insert. Deletions write a Tombstone marker (k35="TOMB") instead of in-place disk erase.',
            pages: 'MemTable + L0 + L1',
            io: 'Sequential WAL Only'
          },
          {
            html: `
              <div style="text-align:center;font-family:var(--font-mono,monospace);font-size:12px;">
                <div style="margin-bottom:8px;color:#38bdf8;">Leveled Compaction: K-Way Merge (L0 #0 + L0 #1 + L1) → Deduplicate &amp; Drop Shadowed Versions</div>
                <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
                  <div style="border:1px solid #10b981;border-radius:8px;padding:8px 12px;background:rgba(16,185,129,0.12);">
                    New L1 SSTable Run #A: <b>[ k05="z" | k10="v1" | k15="a" | k20="v2_new" ]</b>
                  </div>
                  <div style="border:1px solid #10b981;border-radius:8px;padding:8px 12px;background:rgba(16,185,129,0.12);">
                    New L1 SSTable Run #B: <b>[ k40="b" | k50="w" ]</b> <i>(k35 Tombstone purged!)</i>
                  </div>
                </div>
              </div>
            `,
            inv: 'Compaction Invariant: L1+ SSTables are strictly key-disjoint! Newer k20="v2_new" overwrote "v2_old", and k35="TOMB" annihilated k35="old".',
            pages: '2 Non-Overlapping L1 Runs',
            io: 'WAF ≈ O(T · L) Sequential'
          }
        ];
        return lsmSteps.map(st => ({
          stageHtml: st.html,
          invariant: st.inv,
          metrics: [
            { label: 'LSM State', value: st.pages },
            { label: 'Disk I/O Pattern', value: st.io },
            { label: 'Point Lookup', value: 'Bloom Filter p ≈ e^(-m/n · ln²2)' }
          ],
          log: st.inv
        }));
      }

      const steps = [
        {
          html: `
            <div style="text-align:center;font-family:var(--font-mono,monospace);font-size:12px;">
              <div style="margin-bottom:10px;color:var(--fg-muted);">Root Directory Page: <code>[ 30 ]</code></div>
              <div style="display:flex;justify-content:center;gap:18px;flex-wrap:wrap;">
                <div style="border:1px solid #f59e0b;border-radius:8px;padding:8px 12px;background:rgba(245,158,11,0.1);">
                  Leaf P1 (FULL 3/3): <b>[ 10 | 15 | 20 ]</b>
                </div>
                <div style="border:1px solid #3f3f46;border-radius:8px;padding:8px 12px;">
                  → Leaf P2: <b>[ 30 | 40 | 50 ]</b>
                </div>
              </div>
            </div>
          `,
          inv: 'Leaf P1 has 3/3 keys [10, 15, 20]. Inserting key = 25 triggers page overflow (4 > max 3).',
          pages: '1 Root + 2 Leaves',
          io: '2 Page Reads'
        },
        {
          html: `
            <div style="text-align:center;font-family:var(--font-mono,monospace);font-size:12px;">
              <div style="margin-bottom:10px;color:#34d399;">Root Directory Page (Copy-Up 20!): <code>[ 20 | 30 ]</code></div>
              <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
                <div style="border:1px solid #10b981;border-radius:8px;padding:8px 12px;background:rgba(16,185,129,0.1);">
                  Leaf P1a: <b>[ 10 | 15 ]</b>
                </div>
                <div style="border:1px solid #10b981;border-radius:8px;padding:8px 12px;background:rgba(16,185,129,0.1);">
                  ⇄ Leaf P1b (NEW): <b>[ 20 | 25 ]</b>
                </div>
                <div style="border:1px solid #3f3f46;border-radius:8px;padding:8px 12px;">
                  ⇄ Leaf P2: <b>[ 30 | 40 | 50 ]</b>
                </div>
              </div>
            </div>
          `,
          inv: 'Split [10, 15, 20, 25] -> P1a=[10, 15], P1b=[20, 25]. Copied separator 20 up to Root [20 | 30] and spliced P1a ⇄ P1b ⇄ P2.',
          pages: '1 Root + 3 Leaves',
          io: '2 Reads + 3 Writes'
        },
        {
          html: `
            <div style="text-align:center;font-family:var(--font-mono,monospace);font-size:12px;">
              <div style="margin-bottom:10px;color:var(--fg-muted);">Range Scan <code>SELECT * WHERE k BETWEEN 15 AND 40</code></div>
              <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
                <div style="border:1px solid #6366f1;border-radius:8px;padding:8px 12px;background:rgba(99,102,241,0.15);">
                  Leaf P1a: [ 10 | <b style="color:#34d399;">15</b> ]
                </div>
                <div style="border:1px solid #6366f1;border-radius:8px;padding:8px 12px;background:rgba(99,102,241,0.15);">
                  → Leaf P1b: [ <b style="color:#34d399;">20 | 25</b> ]
                </div>
                <div style="border:1px solid #6366f1;border-radius:8px;padding:8px 12px;background:rgba(99,102,241,0.15);">
                  → Leaf P2: [ <b style="color:#34d399;">30 | 40</b> | 50 ]
                </div>
              </div>
            </div>
          `,
          inv: 'Range Scan: 1 root-to-leaf descent to 15, then sequential leaf sibling pointer hops P1a → P1b → P2 without touching internal nodes!',
          pages: 'Sequential Leaf Chain',
          io: 'O(log_B N + K/B) I/Os'
        }
      ];

      return steps.map(st => ({
        stageHtml: st.html,
        invariant: st.inv,
        metrics: [
          { label: 'Tree Topology', value: st.pages },
          { label: 'Disk Page I/O', value: st.io },
          { label: 'Occupancy Invariant', value: '⌈M/2⌉ ≤ keys ≤ M−1' }
        ],
        log: st.inv
      }));
    }
  });
  window.SIMULATORS['sim-btree-split-merge'] = window.SIMULATORS['sim-bplus-tree-splitting'];

  // ───────────────────────────────────────────────────────────────
  // 16. Randomized Treap Split/Merge & Splay Tree Zig-Zig
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-treap-splay-tree'] = createStepSimulator({
    id: 'sim-treap-splay-tree',
    aliases: ['sim-treap-splay', 'sim-treap-split-merge', 'sim-splay-tree-zig-zig'],
    title: 'Randomized Treap (split / merge) & Splay Tree Zig-Zig Animator',
    badge: 'Expected / Amortized O(log N)',
    badgeClass: 'badge-ologn',
    blurb: 'Inspect how a Treap simultaneously satisfies BST order on keys and Max-Heap order on random priorities via two primitives — split(T, k) and merge(L, R) — and how Splay Tree zig-zig rotations halve path depth.',
    slugs: [
      'treaps-split-merge-paradigm',
      'splay-trees-dynamic-optimality',
      'treaps-randomized-implicit-split-merge',
      'splay-trees-static-optimality'
    ],
    presets: [
      { id: 'treap', label: 'Treap split(T, key = 25) -> (L ≤ 25, R > 25)', mode: 'treap' },
      { id: 'splay', label: 'Splay Tree Zig-Zig vs Naive Single Rotations', mode: 'splay' }
    ],
    buildFrames() {
      const steps = [
        {
          arr: ['10 (p=42)', '20 (p=95)', '25 (p=60)', '30 (p=81)', '40 (p=35)'],
          active: [0, 1, 2, 3, 4],
          pivot: [1],
          inv: 'Treap Root = (key=20, prio=95): BST invariant on keys (10 < 20 < 25 < 30 < 40) ∧ Max-Heap on priorities (95 > 81 > 60).',
          log: 'Start split(root=20, k=25): Since root.key (20) ≤ 25, root 20 and its entire left subtree [10] belong to Left Output Tree L.'
        },
        {
          arr: ['10 (p=42)', '20 (p=95)', '25 (p=60)', '30 (p=81)', '40 (p=35)'],
          match: [0, 1],
          pivot: [3],
          active: [2, 4],
          inv: 'Recurse split(root.right = 30, k=25): Since 30 > 25, node 30 and its right child [40] belong to Right Output Tree R.',
          log: 'At node (30, p=81): 30 > 25, so 30 goes to R; recurse left into node (25, p=60).'
        },
        {
          arr: ['L: 10(42)', 'L: 20(95)', 'L: 25(60)', 'R: 30(81)', 'R: 40(35)'],
          match: [0, 1, 2],
          pivot: [3, 4],
          inv: 'Split Complete in O(log N)! Tree L has keys {10, 20, 25} ≤ 25; Tree R has keys {30, 40} > 25. Both preserve heap priorities!',
          log: 'Node (25, p=60) ≤ 25 attaches as right child of 20 in L. Returned (L={10,20,25}, R={30,40}).'
        }
      ];

      return steps.map((st, idx) => ({
        stageHtml: renderArrayCells(st.arr, { active: st.active, match: st.match, pivot: st.pivot }),
        invariant: st.inv,
        metrics: [
          { label: 'Primitive', value: 'split(T, k=25)' },
          { label: 'Recursion Depth', value: `${idx + 1} (O(log N))` },
          { label: 'L Keys (≤ 25)', value: idx === 2 ? '{10, 20, 25}' : 'Building...' },
          { label: 'R Keys (> 25)', value: idx >= 1 ? '{30, 40}' : 'Building...' }
        ],
        log: st.log
      }));
    }
  });
  window.SIMULATORS['sim-treap-splay'] = window.SIMULATORS['sim-treap-splay-tree'];

  // ───────────────────────────────────────────────────────────────
  // 17. Segment Tree with Lazy Propagation & Segment Tree Beats
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-segment-tree-lazy'] = createStepSimulator({
    id: 'sim-segment-tree-lazy',
    aliases: ['sim-segment-fenwick'],
    title: 'Segment Tree Monoids, Lazy Propagation & Ji Driver Beats',
    badge: 'O(log N) Lazy · O(log² N) Beats',
    badgeClass: 'badge-ologn',
    blurb: 'Watch how a range update [L, R] halts at maximal canonical nodes with a deferred lazy[v] tag, or switch to Segment Tree Beats to see how tracking (max1, smax, cntMax) turns range chmin(x) into a lazy tag when smax < x < max1.',
    slugs: [
      'segment-trees-bottom-up-monoids',
      'lazy-propagation-segment-tree-beats',
      'dynamic-persistent-segment-trees',
      'build-lazy-segment-tree',
      'segment-tree-bottom-up-zkw',
      'lazy-propagation-algebraic-monoids',
      'dynamic-persistent-segtree-beats'
    ],
    presets: [
      { id: 'range_add', label: 'rangeAdd(L=2, R=5, +10) followed by rangeSum(2, 2)', mode: 'lazy' },
      { id: 'beats', label: 'Segment Tree Beats: rangeChmin(L=0, R=3, x=7) via smax < x < max1', mode: 'beats' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'beats') {
        const bSteps = [
          {
            vals: ['v1[0..3]: sum=29, max1=10, smax=6, cnt=2', 'v2[0..1]: 10, 5', 'v3[2..3]: 10, 4'],
            active: [0],
            match: [],
            tags: { 0: 'Check smax(6) < x(7) < max1(10)' },
            inv: 'Ji Driver Beats Condition at v1[0..3] over [10, 5, 10, 4]: max1 = 10 (cntMax = 2), strictly second max smax = 6.',
            log: 'Executing rangeChmin(0, 3, x=7): Since smax(6) < 7 < max1(10), ONLY the cntMax=2 copies of max1=10 are affected!'
          },
          {
            vals: ['v1[0..3]: sum=23, max1=7, smax=6, cnt=2', 'v2[0..1]: 10, 5 (deferred)', 'v3[2..3]: 10, 4 (deferred)'],
            active: [],
            match: [0],
            tags: { 0: 'TAGGED max1=7 in O(1)!' },
            inv: 'Updated v1.sum -= cntMax × (10 − 7) = 29 − 6 = 23 and set v1.max1 = 7 in O(1) time without recursing to leaves!',
            log: 'Halted at v1! Because x=7 > smax=6, the identity of which elements are maximum does not change.'
          }
        ];
        return bSteps.map(st => ({
          stageHtml: renderArrayCells(st.vals, { active: st.active, match: st.match, tags: st.tags }),
          invariant: st.inv,
          metrics: [
            { label: 'Beats Condition', value: 'smax < x < max1' },
            { label: 'Sum Delta', value: 'sum -= cntMax · (max1 - x)' },
            { label: 'Amortized Cost', value: 'O(log N) / O(log² N)' }
          ],
          log: st.log
        }));
      }

      const steps = [
        {
          vals: ['[0..7]:36', '[0..3]:10', '[4..7]:26', '[0..1]:3', '[2..3]:7', '[4..5]:11', '[6..7]:15'],
          active: [0, 1, 2],
          match: [],
          tags: { 0: 'Root', 1: 'Left', 2: 'Right' },
          inv: 'Initial Segment Tree over A = [1, 2, 3, 4, 5, 6, 7, 8]. All lazy[v] = 0.',
          log: 'Built segment tree over [0..7]. Executing rangeAdd(L=2, R=5, delta=+10).'
        },
        {
          vals: ['[0..7]:76', '[0..3]:30', '[4..7]:46', '[0..1]:3', '[2..3]:27', '[4..5]:31', '[6..7]:15'],
          active: [0, 1, 2],
          match: [4, 5],
          tags: { 4: 'LAZY=+10!', 5: 'LAZY=+10!' },
          inv: 'Canonical Cover! [2..5] decomposed into 2 maximal canonical nodes: v5 [2..3] and v6 [4..5]. Halted without visiting leaves!',
          log: 'rangeAdd(2, 5, +10): Covered by canonical nodes v5[2..3] (sum += 2×10, lazy=+10) and v6[4..5] (sum += 2×10, lazy=+10).'
        },
        {
          vals: ['[0..7]:76', '[0..3]:30', '[4..7]:46', '[0..1]:3', '[2..3]:27', '[4..5]:31', '[6..7]:15'],
          pivot: [4],
          match: [4],
          tags: { 4: 'pushDown(+10)→leaves' },
          inv: 'Query rangeSum(2, 2): Must descend inside v5 [2..3] -> pushDown(v5) propagates lazy=+10 to children [2..2] and [3..3] in O(1)!',
          log: 'Query [2..2] partially overlaps v5[2..3]: invoked pushDown(v5), clearing lazy[v5]=0 and updating leaf [2..2] = 3 + 10 = 13.'
        }
      ];

      return steps.map(st => ({
        stageHtml: renderArrayCells(st.vals, { active: st.active, match: st.match, pivot: st.pivot, tags: st.tags }),
        invariant: st.inv,
        metrics: [
          { label: 'Canonical Nodes Hit', value: '≤ 2 per Tree Level' },
          { label: 'Total Nodes Visited', value: 'O(log N)' },
          { label: 'Lazy Tag Rule', value: 'tree[v] += len(v) · δ' }
        ],
        log: st.log
      }));
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 18. Fenwick Tree (Binary Indexed Tree) i & -i Bit-Jump Visualizer
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-fenwick-bit-tree'] = createStepSimulator({
    id: 'sim-fenwick-bit-tree',
    aliases: ['sim-fenwick-bit-jump', 'sim-fenwick-bit-geometry'],
    title: 'Fenwick Tree (BIT) lowbit(i) = i & −i Bit-Jump & Binary Lifting',
    badge: 'O(log N) · N Words Memory',
    badgeClass: 'badge-ologn',
    blurb: 'Trace how Fenwick Tree prefix queries strip the lowest set bit (i −= i & −i) and point updates add the lowest set bit (i += i & −i), visiting at most popcount(i) ≤ log₂ N nodes.',
    slugs: [
      'fenwick-tree-binary-indexed',
      'fenwick-tree-bit-tricks-lifting'
    ],
    presets: [
      { id: 'query7', label: 'prefixSum(7 = 0b0111): 7 → 6 → 4 → 0', mode: 'query' },
      { id: 'update3', label: 'add(3 = 0b0011, +5): 3 → 4 → 8', mode: 'update' }
    ],
    buildFrames(preset) {
      const bit = ['-', 'T[1]', 'T[2]', 'T[3]', 'T[4]', 'T[5]', 'T[6]', 'T[7]', 'T[8]'];
      const ranges = {
        1: '[1..1] (0001₂)',
        2: '[1..2] (0010₂)',
        3: '[3..3] (0011₂)',
        4: '[1..4] (0100₂)',
        5: '[5..5] (0101₂)',
        6: '[5..6] (0110₂)',
        7: '[7..7] (0111₂)',
        8: '[1..8] (1000₂)'
      };

      const jumps = preset.mode === 'update'
        ? [
            { idx: 3, bin: '0011₂', lowbit: 1, next: 4, note: 'add(3, +5): i=3 (0011₂), lowbit = 3 & -3 = 1. Updated T[3] (covers [3..3]), next i = 3 + 1 = 4.' },
            { idx: 4, bin: '0100₂', lowbit: 4, next: 8, note: 'i=4 (0100₂), lowbit = 4 & -4 = 4. Updated T[4] (covers [1..4]), next i = 4 + 4 = 8.' },
            { idx: 8, bin: '1000₂', lowbit: 8, next: 16, note: 'i=8 (1000₂), lowbit = 8 & -8 = 8. Updated T[8] (covers [1..8]), next i = 16 > N (Done!).' }
          ]
        : [
            { idx: 7, bin: '0111₂', lowbit: 1, next: 6, note: 'prefixSum(7): i=7 (0111₂), lowbit=1. Accumulate T[7] (range [7..7]), strip lowest bit -> i = 7 - 1 = 6.' },
            { idx: 6, bin: '0110₂', lowbit: 2, next: 4, note: 'i=6 (0110₂), lowbit=2. Accumulate T[6] (range [5..6]), strip lowest bit -> i = 6 - 2 = 4.' },
            { idx: 4, bin: '0100₂', lowbit: 4, next: 0, note: 'i=4 (0100₂), lowbit=4. Accumulate T[4] (range [1..4]), strip lowest bit -> i = 4 - 4 = 0 (Done! Partitioned [1..7] = [1..4] ∪ [5..6] ∪ [7..7]).' }
          ];

      const visited = [];
      return jumps.map((st, sIdx) => {
        visited.push(st.idx);
        const tags = { ...ranges, [st.idx]: `ACTIVE (${st.bin})` };
        return {
          stageHtml: renderArrayCells(bit.slice(1), {
            active: visited.map(x => x - 1),
            match: [st.idx - 1],
            tags: Object.fromEntries(Object.entries(tags).map(([k, v]) => [Number(k) - 1, v]))
          }),
          invariant: `Index i = ${st.idx} (${st.bin}) | lowbit(i) = i & −i = ${st.lowbit} | Covers interval of length ${st.lowbit}: ${ranges[st.idx]}`,
          metrics: [
            { label: 'Current Index i', value: `${st.idx} (${st.bin})` },
            { label: 'lowbit (i & -i)', value: `${st.lowbit}` },
            { label: 'Next Index', value: `${st.next}` },
            { label: 'Bit Jumps', value: `${sIdx + 1} ≤ log₂(8)` }
          ],
          log: st.note
        };
      });
    }
  });
  window.SIMULATORS['sim-fenwick-bit-jump'] = window.SIMULATORS['sim-fenwick-bit-tree'];

  // ───────────────────────────────────────────────────────────────
  // 19. Morris O(1)-Space Threaded Traversal & Euler Tour Flattening
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-morris-euler-traversal'] = createStepSimulator({
    id: 'sim-morris-euler-traversal',
    aliases: ['sim-morris-traversal', 'sim-euler-tour-flattening'],
    title: 'Morris O(1)-Space Threaded In-Order & Euler Tour Subtree Flattening',
    badge: 'O(N) Time · O(1) Aux Space / Contiguous [tin, tout]',
    badgeClass: 'badge-on',
    blurb: 'Trace how Morris Traversal temporarily rewires each in-order predecessor’s null right pointer (pred.right = curr) to climb back up without a call stack, and how Euler Tour timestamps flatten every subtree into a contiguous array slice [tin[u], tout[u]].',
    slugs: [
      'tree-representations-traversals',
      'morris-threaded-traversal',
      'tree-serialization-reconstruction',
      'tree-terminology-representations',
      'dfs-traversals-morris-threading',
      'euler-tour-linearization-subtrees'
    ],
    presets: [
      { id: 'morris', label: 'Morris In-Order Threading (Create & Remove Temporary Threads)', mode: 'morris' },
      { id: 'euler', label: 'Euler Tour Subtree Flattening [tin[u], tout[u]] & O(1) Ancestor Check', mode: 'euler' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'euler') {
        const eulerSteps = [
          {
            svg: `
              <svg viewBox="0 0 520 155" style="width:100%;max-height:165px;">
                <line x1="140" y1="32" x2="80" y2="85" stroke="#6366f1" stroke-width="2"/>
                <line x1="140" y1="32" x2="200" y2="85" stroke="#71717a" stroke-width="2"/>
                <line x1="80" y1="85" x2="45" y2="132" stroke="#10b981" stroke-width="2"/>
                <line x1="80" y1="85" x2="115" y2="132" stroke="#10b981" stroke-width="2"/>
                <circle cx="140" cy="32" r="18" fill="#18181b" stroke="#6366f1" stroke-width="2"/>
                <text x="140" y="36" text-anchor="middle" fill="#fff" font-size="11" font-family="monospace">1[0,4]</text>
                <circle cx="80" cy="85" r="18" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
                <text x="80" y="89" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">2[1,3]</text>
                <circle cx="200" cy="85" r="18" fill="#18181b" stroke="#71717a" stroke-width="2"/>
                <text x="200" y="89" text-anchor="middle" fill="#d4d4d8" font-size="11" font-family="monospace">3[4,4]</text>
                <circle cx="45" cy="132" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
                <text x="45" y="136" text-anchor="middle" fill="#a7f3d0" font-size="10" font-family="monospace">4[2,2]</text>
                <circle cx="115" cy="132" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
                <text x="115" y="136" text-anchor="middle" fill="#a7f3d0" font-size="10" font-family="monospace">5[3,3]</text>
                <rect x="255" y="25" width="250" height="105" rx="8" fill="#18181b" stroke="#3f3f46"/>
                <text x="380" y="48" text-anchor="middle" fill="#a5b4fc" font-size="11" font-family="monospace">Flattened DFS Array flat[0..4]</text>
                <text x="380" y="75" text-anchor="middle" fill="#34d399" font-size="12" font-family="monospace">[ u1 | u2, u4, u5 | u3 ]</text>
                <text x="380" y="102" text-anchor="middle" fill="#fcd34d" font-size="11" font-family="monospace">Subtree(2) ≡ slice [1..3]!</text>
              </svg>
            `,
            inv: 'Euler Tour Bijection: Subtree(u) maps to exact contiguous slice flat[tin[u] .. tout[u]]. For u=2, [tin=1, tout=3] covers {2, 4, 5}.',
            op: 'DFS Entry/Exit Timestamps',
            threads: 'tin=[0,1,4,2,3], tout=[4,3,4,2,3]',
            space: 'O(1) Ancestor Test'
          },
          {
            svg: `
              <svg viewBox="0 0 520 155" style="width:100%;max-height:165px;">
                <rect x="30" y="22" width="460" height="110" rx="8" fill="#18181b" stroke="#10b981" stroke-width="2"/>
                <text x="260" y="50" text-anchor="middle" fill="#34d399" font-size="12" font-family="monospace">isAncestor(u=2, v=5): tin[2] ≤ tin[5] ∧ tout[5] ≤ tout[2]</text>
                <text x="260" y="78" text-anchor="middle" fill="#e4e4e7" font-size="12" font-family="monospace">Check: 1 ≤ 3  AND  3 ≤ 3  ⟹  TRUE in O(1) time!</text>
                <text x="260" y="106" text-anchor="middle" fill="#a5b4fc" font-size="11" font-family="monospace">Preorder + Inorder Split: Root = pre[0], LeftSize = inMap[Root] − inStart</text>
              </svg>
            `,
            inv: 'Interval Nesting Theorem: u is an ancestor of v iff [tin[v], tout[v]] ⊆ [tin[u], tout[u]].',
            op: 'isAncestor(2, 5) = TRUE',
            threads: 'Nested Intervals [3,3] ⊆ [1,3]',
            space: 'O(1) Query Time'
          }
        ];
        return eulerSteps.map(st => ({
          stageHtml: st.svg,
          invariant: st.inv,
          metrics: [
            { label: 'Phase', value: st.op },
            { label: 'Interval Mapping', value: st.threads },
            { label: 'Complexity', value: st.space }
          ],
          log: st.inv
        }));
      }

      const morrisSteps = [
        {
          svg: `
            <svg viewBox="0 0 500 155" style="width:100%;max-height:165px;">
              <line x1="250" y1="30" x2="160" y2="85" stroke="#71717a" stroke-width="2"/>
              <line x1="250" y1="30" x2="340" y2="85" stroke="#71717a" stroke-width="2"/>
              <line x1="160" y1="85" x2="110" y2="132" stroke="#71717a" stroke-width="2"/>
              <line x1="160" y1="85" x2="210" y2="132" stroke="#71717a" stroke-width="2"/>
              <path d="M 225 128 Q 255 80 248 48" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="5,4"/>
              <circle cx="250" cy="30" r="18" fill="#1e1b4b" stroke="#6366f1" stroke-width="2.5"/>
              <text x="250" y="34" text-anchor="middle" fill="#fff" font-size="11" font-family="monospace">curr=4</text>
              <circle cx="160" cy="85" r="17" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="160" y="89" text-anchor="middle" fill="#e4e4e7" font-size="11" font-family="monospace">2</text>
              <circle cx="340" cy="85" r="17" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="340" y="89" text-anchor="middle" fill="#e4e4e7" font-size="11" font-family="monospace">5</text>
              <circle cx="110" cy="132" r="16" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="110" y="136" text-anchor="middle" fill="#e4e4e7" font-size="11" font-family="monospace">1</text>
              <circle cx="210" cy="132" r="16" fill="#451a03" stroke="#f59e0b" stroke-width="2.5"/>
              <text x="210" y="136" text-anchor="middle" fill="#fde68a" font-size="10" font-family="monospace">pred=3</text>
              <text x="345" y="132" fill="#fcd34d" font-size="11" font-family="monospace">Thread: pred(3).right = curr(4)</text>
            </svg>
          `,
          inv: 'Phase 1 (Create Thread): At curr=4, in-order predecessor in left subtree is pred=3. Since pred.right == null, set pred.right = curr(4) and advance curr = curr.left(2).',
          op: 'pred(3).right = curr(4)',
          threads: '1 Active Thread (3 → 4)',
          out: '[]'
        },
        {
          svg: `
            <svg viewBox="0 0 500 155" style="width:100%;max-height:165px;">
              <line x1="250" y1="30" x2="160" y2="85" stroke="#10b981" stroke-width="2"/>
              <line x1="250" y1="30" x2="340" y2="85" stroke="#71717a" stroke-width="2"/>
              <line x1="160" y1="85" x2="110" y2="132" stroke="#10b981" stroke-width="2"/>
              <line x1="160" y1="85" x2="210" y2="132" stroke="#10b981" stroke-width="2"/>
              <path d="M 225 128 Q 255 80 248 48" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="5,4"/>
              <circle cx="250" cy="30" r="18" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="250" y="34" text-anchor="middle" fill="#fff" font-size="11" font-family="monospace">4</text>
              <circle cx="160" cy="85" r="17" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
              <text x="160" y="89" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">2 ✓</text>
              <circle cx="340" cy="85" r="17" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="340" y="89" text-anchor="middle" fill="#e4e4e7" font-size="11" font-family="monospace">5</text>
              <circle cx="110" cy="132" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
              <text x="110" y="136" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">1 ✓</text>
              <circle cx="210" cy="132" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
              <text x="210" y="136" text-anchor="middle" fill="#a7f3d0" font-size="10" font-family="monospace">3 ✓</text>
              <text x="340" y="132" fill="#34d399" font-size="11" font-family="monospace">Follow 3.right → Climb to 4!</text>
            </svg>
          `,
          inv: 'Visited 1, 2, 3 in-order: After emitting 3, curr = 3.right follows the temporary Morris thread directly back up to ancestor 4 in O(1) space!',
          op: 'Follow Thread 3 → 4',
          threads: 'Climbing Thread 3 → 4',
          out: '[1, 2, 3]'
        },
        {
          svg: `
            <svg viewBox="0 0 500 155" style="width:100%;max-height:165px;">
              <line x1="250" y1="30" x2="160" y2="85" stroke="#10b981" stroke-width="2"/>
              <line x1="250" y1="30" x2="340" y2="85" stroke="#10b981" stroke-width="2.5"/>
              <line x1="160" y1="85" x2="110" y2="132" stroke="#10b981" stroke-width="2"/>
              <line x1="160" y1="85" x2="210" y2="132" stroke="#10b981" stroke-width="2"/>
              <circle cx="250" cy="30" r="18" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
              <text x="250" y="34" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">4 ✓</text>
              <circle cx="160" cy="85" r="17" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
              <text x="160" y="89" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">2 ✓</text>
              <circle cx="340" cy="85" r="17" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
              <text x="340" y="89" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">5 ✓</text>
              <circle cx="110" cy="132" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
              <text x="110" y="136" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">1 ✓</text>
              <circle cx="210" cy="132" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
              <text x="210" y="136" text-anchor="middle" fill="#a7f3d0" font-size="10" font-family="monospace">3.r=null</text>
              <text x="345" y="132" fill="#a5b4fc" font-size="11" font-family="monospace">Restored 3.right = null!</text>
            </svg>
          `,
          inv: 'Phase 2 (Remove Thread): At curr=4, pred(3).right == curr(4) detects left subtree completion! Restore pred.right = null, emit 4, advance to 5.',
          op: 'pred(3).right = null',
          threads: '0 (Tree Fully Restored)',
          out: '[1, 2, 3, 4, 5]'
        }
      ];

      return morrisSteps.map(st => ({
        stageHtml: st.svg,
        invariant: st.inv,
        metrics: [
          { label: 'Pointer Action', value: st.op },
          { label: 'Thread State', value: st.threads },
          { label: 'In-Order Output', value: st.out },
          { label: 'Aux Call-Stack Space', value: 'O(1) Words' }
        ],
        log: st.inv
      }));
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 20. BST Hibbard Deletion, Tree Diameter & Random BST Duality
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-bst-hibbard-deletion'] = createStepSimulator({
    id: 'sim-bst-hibbard-deletion',
    aliases: ['sim-bst-deletion', 'sim-random-bst-quicksort'],
    title: 'BST Hibbard Successor Deletion, Tree Diameter & QuickSort Duality',
    badge: 'Expected Height ≈ 4.311 ln N · O(H) Delete',
    badgeClass: 'badge-ologn',
    blurb: 'Step through Hibbard’s 3-case BST deletion (splicing out the in-order successor y = min(z.right) when deleting a 2-child node z), or inspect the exact bijection between Random BST depth and QuickSort pivot comparisons.',
    slugs: [
      'bst-operations-hibbard-deletion',
      'randomly-built-bst-height',
      'tree-diameter-centers-isomorphism',
      'random-bst-quicksort-duality'
    ],
    presets: [
      { id: 'hibbard', label: 'Hibbard 2-Child Deletion: delete(root, z = 20) via Successor y = 25', mode: 'hibbard' },
      { id: 'duality', label: 'Random BST ⇄ QuickSort Pivot Duality & 2 H_n ln N Comparisons', mode: 'duality' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'duality') {
        const dualSteps = [
          {
            svg: `
              <svg viewBox="0 0 500 150" style="width:100%;max-height:165px;">
                <line x1="250" y1="32" x2="150" y2="95" stroke="#6366f1" stroke-width="2.5"/>
                <line x1="250" y1="32" x2="350" y2="95" stroke="#6366f1" stroke-width="2.5"/>
                <circle cx="250" cy="32" r="20" fill="#1e1b4b" stroke="#6366f1" stroke-width="2.5"/>
                <text x="250" y="36" text-anchor="middle" fill="#fff" font-size="11" font-family="monospace">p₁=40</text>
                <rect x="70" y="80" width="160" height="42" rx="6" fill="#18181b" stroke="#10b981"/>
                <text x="150" y="105" text-anchor="middle" fill="#34d399" font-size="11" font-family="monospace">L: {10, 20, 30} &lt; 40</text>
                <rect x="270" y="80" width="160" height="42" rx="6" fill="#18181b" stroke="#f59e0b"/>
                <text x="350" y="105" text-anchor="middle" fill="#fcd34d" font-size="11" font-family="monospace">R: {50, 60, 70} &gt; 40</text>
              </svg>
            `,
            inv: 'Bijection Theorem: First inserted BST key (40) is the BST root ⟺ First QuickSort pivot (40) partitions all remaining elements into L (<40) and R (>40).',
            step: 'Root = First Pivot = 40',
            prob: 'Pr[z_i ↔ z_j] = 2 / (j − i + 1)',
            height: 'E[Depth] = 2 ln N'
          },
          {
            svg: `
              <svg viewBox="0 0 500 150" style="width:100%;max-height:165px;">
                <rect x="30" y="20" width="440" height="110" rx="8" fill="#18181b" stroke="#6366f1" stroke-width="2"/>
                <text x="250" y="48" text-anchor="middle" fill="#a5b4fc" font-size="12" font-family="monospace">Indicator Random Variable X_{i,j} = I{z_i is ancestor of z_j}</text>
                <text x="250" y="76" text-anchor="middle" fill="#34d399" font-size="12" font-family="monospace">z_i and z_j are compared iff first chosen from {z_i..z_j} is z_i or z_j</text>
                <text x="250" y="104" text-anchor="middle" fill="#fcd34d" font-size="11" font-family="monospace">∑∑ 2/(j−i+1) = 2(N+1)H_N − 4N ≈ 1.386 N log₂ N</text>
              </svg>
            `,
            inv: 'Reed’s Theorem (2003): Random Insertion BST has E[H_N] = α ln N − β ln ln N + O(1) where α ≈ 4.31107 (worst-case sorted input degrades to Θ(N)).',
            step: 'Harmonic Sum Telescoping',
            prob: '2(N+1)H_N − 4N Total Cmp',
            height: 'E[Height] ≈ 4.311 ln N'
          }
        ];
        return dualSteps.map(st => ({
          stageHtml: st.svg,
          invariant: st.inv,
          metrics: [
            { label: 'Duality Stage', value: st.step },
            { label: 'Pair Comparison Prob', value: st.prob },
            { label: 'Asymptotic Bound', value: st.height }
          ],
          log: st.inv
        }));
      }

      const steps = [
        {
          svg: `
            <svg viewBox="0 0 500 155" style="width:100%;max-height:165px;">
              <line x1="220" y1="30" x2="130" y2="85" stroke="#71717a" stroke-width="2"/>
              <line x1="220" y1="30" x2="320" y2="85" stroke="#f59e0b" stroke-width="2.5"/>
              <line x1="320" y1="85" x2="270" y2="132" stroke="#10b981" stroke-width="2.5"/>
              <line x1="320" y1="85" x2="375" y2="132" stroke="#71717a" stroke-width="2"/>
              <circle cx="220" cy="30" r="18" fill="#450a0a" stroke="#ef4444" stroke-width="2.5"/>
              <text x="220" y="34" text-anchor="middle" fill="#fca5a5" font-size="11" font-family="monospace">z=20</text>
              <circle cx="130" cy="85" r="17" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="130" y="89" text-anchor="middle" fill="#e4e4e7" font-size="11" font-family="monospace">10</text>
              <circle cx="320" cy="85" r="17" fill="#18181b" stroke="#f59e0b" stroke-width="2"/>
              <text x="320" y="89" text-anchor="middle" fill="#fde68a" font-size="11" font-family="monospace">30</text>
              <circle cx="270" cy="132" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
              <text x="270" y="136" text-anchor="middle" fill="#a7f3d0" font-size="10" font-family="monospace">y=25</text>
              <circle cx="375" cy="132" r="16" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="375" y="136" text-anchor="middle" fill="#e4e4e7" font-size="10" font-family="monospace">35</text>
            </svg>
          `,
          inv: 'Delete z = 20 (Case 3: Two Children): Locate in-order successor y = min(z.right) = 25. By definition, y has NO left child (y.left == null)!',
          caseLabel: '2 Children → Find min(z.right)',
          succ: 'y = 25 (y.left == null)',
          order: '[10, 20, 25, 30, 35]'
        },
        {
          svg: `
            <svg viewBox="0 0 500 155" style="width:100%;max-height:165px;">
              <line x1="220" y1="30" x2="130" y2="85" stroke="#10b981" stroke-width="2.5"/>
              <line x1="220" y1="30" x2="320" y2="85" stroke="#10b981" stroke-width="2.5"/>
              <line x1="320" y1="85" x2="375" y2="132" stroke="#71717a" stroke-width="2"/>
              <circle cx="220" cy="30" r="18" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
              <text x="220" y="34" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">y=25</text>
              <circle cx="130" cy="85" r="17" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="130" y="89" text-anchor="middle" fill="#e4e4e7" font-size="11" font-family="monospace">10</text>
              <circle cx="320" cy="85" r="17" fill="#18181b" stroke="#10b981" stroke-width="2"/>
              <text x="320" y="89" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">30</text>
              <circle cx="375" cy="132" r="16" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="375" y="136" text-anchor="middle" fill="#e4e4e7" font-size="10" font-family="monospace">35</text>
              <text x="260" y="136" fill="#34d399" font-size="11" font-family="monospace">Transplanted y=25 into z’s slot!</text>
            </svg>
          `,
          inv: 'Spliced y = 25 out of 30.left and transplanted y into z’s position! All left keys {10} < 25 < all remaining right keys {30, 35}.',
          caseLabel: 'Transplant Successor y = 25',
          succ: 'z replaced by y=25',
          order: '[10, 25, 30, 35]'
        }
      ];

      return steps.map(st => ({
        stageHtml: st.svg,
        invariant: st.inv,
        metrics: [
          { label: 'Hibbard Step', value: st.caseLabel },
          { label: 'Successor Node y', value: st.succ },
          { label: 'In-Order Sequence', value: st.order },
          { label: 'Asymmetry Note', value: 'Repeated delete skews height → Θ(√N)' }
        ],
        log: st.inv
      }));
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 21. Fibonacci Heap Consolidation & Hierarchical Timer Wheel
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-fibonacci-heap-timer-wheel'] = createStepSimulator({
    id: 'sim-fibonacci-heap-timer-wheel',
    aliases: ['sim-fibonacci-heap', 'sim-timer-wheel'],
    title: 'Fibonacci Heap Consolidation / Cascading Cuts & Hierarchical Timer Wheel',
    badge: 'O(1) Amortized decreaseKey · O(1) Timer Wheel',
    badgeClass: 'badge-o1',
    blurb: 'Compare Fredman-Tarjan Fibonacci Heaps (Φ = t(H) + 2m(H), degree-table consolidation, and cascading cuts) against Varghese-Lauck O(1) Hierarchical Timing Wheels used in Linux kernel hrtimers and Kafka.',
    slugs: [
      'mergeable-heaps-binomial-fibonacci',
      'case-timer-wheels-vs-heaps',
      'mergeable-heaps-binomial-fibonacci-pairing',
      'case-linux-timer-wheels-hrtimer'
    ],
    presets: [
      { id: 'fib', label: 'Fibonacci Heap extractMin Consolidation & Cascading Cut (Φ = t + 2m)', mode: 'fib' },
      { id: 'wheel', label: 'Hierarchical Timer Wheel O(1) Insert/Cancel & Slot Cascade', mode: 'wheel' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'wheel') {
        const wSteps = [
          {
            html: `
              <div style="text-align:center;font-family:var(--font-mono,monospace);font-size:12px;">
                <div style="margin-bottom:8px;color:#38bdf8;">Level 0 Wheel (1ms ticks, 8 slots, cursor = 3) | Level 1 Wheel (8ms ticks)</div>
                <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
                  <span style="padding:6px 10px;border:1px solid #3f3f46;border-radius:6px;">S0..S2</span>
                  <span style="padding:6px 10px;border:2px solid #10b981;border-radius:6px;background:rgba(16,185,129,0.15);">S3 (NOW): [T_a]</span>
                  <span style="padding:6px 10px;border:1px solid #6366f1;border-radius:6px;background:rgba(99,102,241,0.12);">S7 (+4ms): [T_b]</span>
                  <span style="padding:6px 10px;border:1px solid #f59e0b;border-radius:6px;background:rgba(245,158,11,0.12);">L1 Bucket #1 (8..15ms): [T_c@11ms]</span>
                </div>
              </div>
            `,
            inv: 'Timer Wheel Invariant: Insert(Δt=4ms) indexes slot (cursor + 4) & 7 = S7 in O(1) array lookup + doubly-linked list prepend. Cancel(node) is O(1) unlink!',
            op: 'insert(T_b, +4ms) → Slot 7',
            cost: 'O(1) Direct Array Slot',
            phi: '99% Cancelled Before Expiry'
          },
          {
            html: `
              <div style="text-align:center;font-family:var(--font-mono,monospace);font-size:12px;">
                <div style="margin-bottom:8px;color:#34d399;">Odometer Wrap at Tick 8 (cursor = 0): Cascade Level 1 Bucket #1 → Level 0 Slots!</div>
                <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
                  <span style="padding:6px 10px;border:2px solid #10b981;border-radius:6px;background:rgba(16,185,129,0.15);">L0 Slot 3 (11ms &amp; 7 = 3): [T_c] Cascaded!</span>
                  <span style="padding:6px 10px;border:1px solid #3f3f46;border-radius:6px;">L1 Bucket #1: [ Empty ]</span>
                </div>
              </div>
            `,
            inv: 'Amortized O(1) Tick Cascade: When Level 0 wraps every 8 ticks, timers in L1[1] are redistributed to exact L0 slots using low bits (11 & 7 = 3).',
            op: 'Cascade L1[1] → L0[3]',
            cost: 'O(1) Amortized per Timer',
            phi: 'Beats O(log N) Heap Churn'
          }
        ];
        return wSteps.map(st => ({
          stageHtml: st.html,
          invariant: st.inv,
          metrics: [
            { label: 'Wheel Action', value: st.op },
            { label: 'Time Complexity', value: st.cost },
            { label: 'Networking Insight', value: st.phi }
          ],
          log: st.inv
        }));
      }

      const fSteps = [
        {
          html: `
            <div style="text-align:center;font-family:var(--font-mono,monospace);font-size:12px;">
              <div style="margin-bottom:8px;color:var(--fg-muted);">Lazy Root List (t(H)=4 trees, m(H)=1 marked node y): Potential Φ = t + 2m = 6</div>
              <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
                <div style="border:2px solid #10b981;border-radius:8px;padding:6px 10px;">Min Root <b>[3]</b> (deg 0)</div>
                <div style="border:1px solid #6366f1;border-radius:8px;padding:6px 10px;">Root <b>[7]</b> (deg 0)</div>
                <div style="border:1px solid #6366f1;border-radius:8px;padding:6px 10px;">Root <b>[10]</b>—child <b>[18]</b> (deg 1)</div>
                <div style="border:1px solid #f59e0b;border-radius:8px;padding:6px 10px;">Root <b>[12]</b>—marked <b>[24*]</b> (deg 1)</div>
              </div>
            </div>
          `,
          inv: 'Potential Function Φ(H) = t(H) + 2m(H): Lazy insert & meld simply splice into root list in O(1) actual time (ΔΦ = +1).',
          op: 'Before extractMin / decreaseKey',
          cost: 'Φ = 4 + 2(1) = 6',
          deg: 'Max Degree D(N) ≤ ⌊log_φ N⌋'
        },
        {
          html: `
            <div style="text-align:center;font-family:var(--font-mono,monospace);font-size:12px;">
              <div style="margin-bottom:8px;color:#34d399;">After extractMin(3): Degree-Table A[d] Pairwise Links Equal-Degree Trees!</div>
              <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
                <div style="border:2px solid #10b981;border-radius:8px;padding:8px 12px;background:rgba(16,185,129,0.12);">
                  Consolidated Tree (deg 2): <b>Root [7]</b> → children <b>[10 (→18), 12 (→24*)]</b>
                </div>
              </div>
            </div>
          `,
          inv: 'Degree-Table Consolidation: Linked deg-0 [7] with deg-1 [10] & [12] until at most 1 root per degree remains! Paid for by Δt(H) drop in Φ.',
          op: 'Consolidate via A[0..D(N)]',
          cost: 'O(log N) Amortized',
          deg: 'Golden Ratio φ = (1+√5)/2'
        },
        {
          html: `
            <div style="text-align:center;font-family:var(--font-mono,monospace);font-size:12px;">
              <div style="margin-bottom:8px;color:#fcd34d;">decreaseKey(child of 24* → 2): Cut Node to Root List + Cascading Cut on Marked Parent 24*!</div>
              <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
                <div style="border:2px solid #10b981;border-radius:8px;padding:6px 10px;">New Min Root <b>[2]</b></div>
                <div style="border:1px solid #38bdf8;border-radius:8px;padding:6px 10px;">Cascaded Root <b>[24] (unmarked!)</b></div>
                <div style="border:1px solid #6366f1;border-radius:8px;padding:6px 10px;">Root <b>[7]</b></div>
              </div>
            </div>
          `,
          inv: 'Cascading Cut: Parent 24* lost its 2nd child, so 24* is cut to root list and unmarked (Δm = −1 releases 2 units of potential to pay for the cut + Δt = +1!).',
          op: 'decreaseKey + Cascading Cut',
          cost: 'O(1) Amortized (c + ΔΦ ≤ 1)',
          deg: 'Subtree Size ≥ F_{k+2} ≥ φ^k'
        }
      ];
      return fSteps.map(st => ({
        stageHtml: st.html,
        invariant: st.inv,
        metrics: [
          { label: 'Heap Operation', value: st.op },
          { label: 'Amortized Cost', value: st.cost },
          { label: 'Degree Invariant', value: st.deg }
        ],
        log: st.inv
      }));
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 22. Augmented Order-Statistic & Interval Overlap Tree (Linux CFS/VMA)
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-interval-order-statistic-tree'] = createStepSimulator({
    id: 'sim-interval-order-statistic-tree',
    aliases: ['sim-interval-tree', 'sim-order-statistic-tree'],
    title: 'Augmented Order-Statistic (rank/select) & Interval Overlap Tree',
    badge: 'O(log N) Augmented Descent · O(1) Rotation Fixup',
    badgeClass: 'badge-ologn',
    blurb: 'Explore the Augmentation Theorem: maintain subtree maxEnd = max(hi, L.maxEnd, R.maxEnd) for O(log N) interval overlap search and Linux VMA gap allocation, or subtree size sz for O(log N) select(k) / rank(x).',
    slugs: [
      'augmented-trees-order-intervals',
      'case-linux-rbtree-cfs',
      'order-statistic-interval-trees',
      'case-linux-cfs-scheduler-rbtree'
    ],
    presets: [
      { id: 'interval', label: 'Interval Tree Overlap Search query([14, 16]) via maxEnd Pruning', mode: 'interval' },
      { id: 'ost', label: 'Order-Statistic select(k=4) & Linux CFS rb_leftmost / VMA Gap', mode: 'ost' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'ost') {
        const ostSteps = [
          {
            svg: `
              <svg viewBox="0 0 500 155" style="width:100%;max-height:165px;">
                <line x1="250" y1="32" x2="140" y2="95" stroke="#71717a" stroke-width="2"/>
                <line x1="250" y1="32" x2="360" y2="95" stroke="#10b981" stroke-width="2.5"/>
                <circle cx="250" cy="32" r="22" fill="#1e1b4b" stroke="#6366f1" stroke-width="2.5"/>
                <text x="250" y="36" text-anchor="middle" fill="#fff" font-size="11" font-family="monospace">20(sz=6)</text>
                <circle cx="140" cy="95" r="22" fill="#18181b" stroke="#71717a" stroke-width="2"/>
                <text x="140" y="99" text-anchor="middle" fill="#e4e4e7" font-size="11" font-family="monospace">10(sz=3)</text>
                <circle cx="360" cy="95" r="22" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
                <text x="360" y="99" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">30(sz=2)</text>
                <text x="250" y="138" text-anchor="middle" fill="#34d399" font-size="11" font-family="monospace">select(k=4): leftSz = sz(10) = 3. Since k(4) &gt; 3, subtract (3+1)=4 → go Right(k'=0)!</text>
              </svg>
            `,
            inv: 'Order-Statistic Invariant: sz[u] = 1 + sz[u.left] + sz[u.right] is recomputable in O(1) during any rotation! At root 20, leftSz=3, so 20 has rank 3; k=4 goes right with k′ = 4 − 4 = 0.',
            op: 'Step 1: Root 20 (rank 3 < k=4)',
            rule: 'k > leftSz ⟹ k′ = 4 − (3+1) = 0',
            linux: 'CFS caches rb_leftmost for O(1) min_vruntime'
          },
          {
            svg: `
              <svg viewBox="0 0 500 155" style="width:100%;max-height:165px;">
                <line x1="250" y1="32" x2="140" y2="95" stroke="#71717a" stroke-width="2"/>
                <line x1="250" y1="32" x2="360" y2="95" stroke="#10b981" stroke-width="2.5"/>
                <line x1="360" y1="95" x2="430" y2="135" stroke="#71717a" stroke-width="2"/>
                <circle cx="250" cy="32" r="22" fill="#18181b" stroke="#71717a" stroke-width="2"/>
                <text x="250" y="36" text-anchor="middle" fill="#a1a1aa" font-size="11" font-family="monospace">20(sz=6)</text>
                <circle cx="140" cy="95" r="22" fill="#18181b" stroke="#71717a" stroke-width="2"/>
                <text x="140" y="99" text-anchor="middle" fill="#a1a1aa" font-size="11" font-family="monospace">10(sz=3)</text>
                <circle cx="360" cy="95" r="22" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
                <text x="360" y="99" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">30(sz=2)</text>
                <circle cx="430" cy="132" r="18" fill="#18181b" stroke="#71717a" stroke-width="2"/>
                <text x="430" y="136" text-anchor="middle" fill="#e4e4e7" font-size="10" font-family="monospace">35(1)</text>
                <text x="220" y="138" text-anchor="middle" fill="#34d399" font-size="11" font-family="monospace">At node 30: leftSz = 0 == k′(0) → Match! Found 0-indexed rank-4 key = 30</text>
              </svg>
            `,
            inv: 'At node 30, its left child is null (leftSz = 0). Since k′ = 0 == leftSz, node 30 is the exact 0-indexed rank-4 element! In Linux mm/mmap.c, VMA rb-trees similarly augment each node with rb_subtree_gap for O(log N) unmapped address allocation.',
            op: 'Step 2: Found Node 30 (k′ = 0)',
            rule: 'k′ == leftSz(0) ⟹ return 30',
            linux: 'VMA rb_subtree_gap finds free mmap range in O(log N)'
          }
        ];
        return ostSteps.map(st => ({
          stageHtml: st.svg,
          invariant: st.inv,
          metrics: [
            { label: 'Operation', value: st.op },
            { label: 'Rank Reduction', value: st.rule },
            { label: 'Linux Kernel Note', value: st.linux }
          ],
          log: st.inv
        }));
      }

      const iSteps = [
        {
          svg: `
            <svg viewBox="0 0 520 155" style="width:100%;max-height:165px;">
              <line x1="260" y1="35" x2="140" y2="100" stroke="#10b981" stroke-width="2.5"/>
              <line x1="260" y1="35" x2="380" y2="100" stroke="#71717a" stroke-width="2"/>
              <rect x="190" y="14" width="140" height="38" rx="8" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
              <text x="260" y="37" text-anchor="middle" fill="#fff" font-size="11" font-family="monospace">[17,19] max=30</text>
              <rect x="65" y="82" width="150" height="38" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
              <text x="140" y="105" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">[5,8] L.max=23 ≥ 14</text>
              <rect x="305" y="82" width="150" height="38" rx="8" fill="#18181b" stroke="#71717a"/>
              <text x="380" y="105" text-anchor="middle" fill="#d4d4d8" font-size="11" font-family="monospace">[21,24] max=30</text>
              <text x="260" y="143" text-anchor="middle" fill="#fcd34d" font-size="11" font-family="monospace">Query [14, 16]: Root [17,19] misses, but u.left.maxEnd (23) ≥ 14 ⟹ Go Left ONLY!</text>
            </svg>
          `,
          inv: 'Deterministic Single-Path Theorem: If u.left.maxEnd ≥ q.lo (23 ≥ 14), we are guaranteed to either find an overlap in u.left OR prove no overlap can exist in u.right!',
          op: 'searchOverlap([14, 16]) at Root',
          rule: 'u.left.maxEnd (23) ≥ q.lo (14)',
          linux: 'Hit [15, 23] inside Left Subtree in O(log N)'
        },
        {
          svg: `
            <svg viewBox="0 0 520 155" style="width:100%;max-height:165px;">
              <rect x="40" y="25" width="440" height="100" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
              <text x="260" y="55" text-anchor="middle" fill="#a7f3d0" font-size="12" font-family="monospace">Descended to [15, 23] (maxEnd=23): 15 ≤ 16 ∧ 14 ≤ 23 ⟹ OVERLAP FOUND!</text>
              <text x="260" y="82" text-anchor="middle" fill="#e4e4e7" font-size="11" font-family="monospace">Why right branch is safe to skip: If u.left has interval [a, 23] with a &gt; 16,</text>
              <text x="260" y="105" text-anchor="middle" fill="#fcd34d" font-size="11" font-family="monospace">then every interval in u.right has lo ≥ u.lo ≥ a &gt; 16 (impossible to overlap [14,16]!)</text>
            </svg>
          `,
          inv: 'Matched [15, 23] in O(log N) time along a single root-to-leaf path without backtracking!',
          op: 'Overlap [15, 23] Found!',
          rule: 'lo ≤ q.hi ∧ q.lo ≤ hi',
          linux: 'Zero Backtracking (Strict O(log N))'
        }
      ];

      return iSteps.map(st => ({
        stageHtml: st.svg,
        invariant: st.inv,
        metrics: [
          { label: 'Search Step', value: st.op },
          { label: 'Pruning Predicate', value: st.rule },
          { label: 'Guarantee', value: st.linux }
        ],
        log: st.inv
      }));
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 23. Persistent BST Path-Copying & Structural Sharing Visualizer
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-persistent-path-copying'] = createStepSimulator({
    id: 'sim-persistent-path-copying',
    aliases: ['sim-persistent-bst', 'sim-path-copying'],
    title: 'Persistent BST Path-Copying & Structural Sharing Multi-Version DAG',
    badge: 'O(log N) Space/Time per Version · Immutable V0..Vt',
    badgeClass: 'badge-ologn',
    blurb: 'Trace how functional path-copying allocates only O(log N) new nodes along the root-to-insertion spine while sharing all unmodified subtrees via immutable child pointers (as used in Git trees, Clojure, and ZFS/Btrfs CoW).',
    slugs: [
      'persistent-trees-path-copying'
    ],
    presets: [
      { id: 'insert25', label: 'Root V1 = insert(Root V0, key = 25) — Allocate 3 Spine Nodes, Share 4 Nodes', mode: 'insert' }
    ],
    buildFrames() {
      const steps = [
        {
          svg: `
            <svg viewBox="0 0 540 160" style="width:100%;max-height:170px;">
              <line x1="160" y1="32" x2="95" y2="90" stroke="#71717a" stroke-width="2"/>
              <line x1="160" y1="32" x2="225" y2="90" stroke="#71717a" stroke-width="2"/>
              <line x1="225" y1="90" x2="185" y2="140" stroke="#71717a" stroke-width="2"/>
              <line x1="225" y1="90" x2="265" y2="140" stroke="#71717a" stroke-width="2"/>
              <circle cx="160" cy="32" r="18" fill="#18181b" stroke="#6366f1" stroke-width="2"/>
              <text x="160" y="36" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">V0:20</text>
              <circle cx="95" cy="90" r="17" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="95" y="94" text-anchor="middle" fill="#e4e4e7" font-size="11" font-family="monospace">10</text>
              <circle cx="225" cy="90" r="17" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="225" y="94" text-anchor="middle" fill="#e4e4e7" font-size="11" font-family="monospace">30</text>
              <circle cx="185" cy="140" r="15" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="185" y="144" text-anchor="middle" fill="#e4e4e7" font-size="10" font-family="monospace">22</text>
              <circle cx="265" cy="140" r="15" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="265" y="144" text-anchor="middle" fill="#e4e4e7" font-size="10" font-family="monospace">40</text>
              <text x="405" y="85" text-anchor="middle" fill="#a5b4fc" font-size="11" font-family="monospace">Immutable Snapshot V0 (5 Nodes)</text>
              <text x="405" y="108" text-anchor="middle" fill="#fcd34d" font-size="11" font-family="monospace">Goal: V1 = insert(V0, 25)</text>
            </svg>
          `,
          inv: 'Immutability Rule: No existing node in V0 may ever be mutated in-place. Search path for 25 visits spine: 20 → 30 → 22 → right(null).',
          allocated: '0 New Nodes',
          shared: '5 / 5 Existing Nodes',
          versions: 'V0 = {10, 20, 22, 30, 40}'
        },
        {
          svg: `
            <svg viewBox="0 0 540 160" style="width:100%;max-height:170px;">
              <line x1="120" y1="30" x2="65" y2="90" stroke="#71717a" stroke-width="2"/>
              <line x1="120" y1="30" x2="185" y2="90" stroke="#71717a" stroke-width="2"/>
              <line x1="370" y1="30" x2="65" y2="90" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5,4"/>
              <line x1="370" y1="30" x2="430" y2="85" stroke="#10b981" stroke-width="2.5"/>
              <line x1="430" y1="85" x2="380" y2="138" stroke="#10b981" stroke-width="2.5"/>
              <line x1="380" y1="138" x2="465" y2="145" stroke="#10b981" stroke-width="2.5"/>
              <circle cx="120" cy="30" r="17" fill="#18181b" stroke="#6366f1" stroke-width="2"/>
              <text x="120" y="34" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">V0:20</text>
              <circle cx="65" cy="90" r="16" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2"/>
              <text x="65" y="94" text-anchor="middle" fill="#bae6fd" font-size="10" font-family="monospace">10(Shared)</text>
              <circle cx="185" cy="90" r="16" fill="#18181b" stroke="#71717a" stroke-width="2"/>
              <text x="185" y="94" text-anchor="middle" fill="#e4e4e7" font-size="10" font-family="monospace">V0:30</text>
              <circle cx="370" cy="30" r="18" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
              <text x="370" y="34" text-anchor="middle" fill="#a7f3d0" font-size="10" font-family="monospace">V1:20′</text>
              <circle cx="430" cy="85" r="17" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
              <text x="430" y="89" text-anchor="middle" fill="#a7f3d0" font-size="10" font-family="monospace">30′</text>
              <circle cx="380" cy="138" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
              <text x="380" y="142" text-anchor="middle" fill="#a7f3d0" font-size="10" font-family="monospace">22′</text>
              <circle cx="465" cy="145" r="15" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
              <text x="465" y="149" text-anchor="middle" fill="#a7f3d0" font-size="10" font-family="monospace">25★</text>
            </svg>
          `,
          inv: 'Path Copying Complete! Cloned only the 3 spine nodes (20′ → 30′ → 22′) plus new leaf 25★. V1:20′.left points directly to V0’s untouched subtree [10], and 30′.right shares V0’s [40]!',
          allocated: '4 Nodes (O(log N) Spine)',
          shared: 'Subtrees [10] & [40] Shared!',
          versions: 'Both V0 and V1 Queryable in O(log N)'
        }
      ];

      return steps.map(st => ({
        stageHtml: st.svg,
        invariant: st.inv,
        metrics: [
          { label: 'New Nodes Allocated', value: st.allocated },
          { label: 'Structural Sharing', value: st.shared },
          { label: 'Active Snapshots', value: st.versions }
        ],
        log: st.inv
      }));
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 24. Sparse Table O(1) RMQ & Euler-Tour / Binary-Lifting LCA
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-sparse-table-lca-rmq'] = createStepSimulator({
    id: 'sim-sparse-table-lca-rmq',
    aliases: ['sim-sparse-table-rmq', 'sim-lca-binary-lifting'],
    title: 'Sparse Table O(1) Idempotent RMQ & Euler-Tour / Binary-Lifting LCA',
    badge: 'O(N log N) Build · O(1) RMQ & LCA',
    badgeClass: 'badge-o1',
    blurb: 'See why idempotent operations (min, max, gcd) answer range queries in O(1) time via two overlapping power-of-two blocks st[k][L] and st[k][R − 2^k + 1], and how LCA(u, v) reduces to RMQ on the Euler Tour depth array.',
    slugs: [
      'static-range-queries-sparse-table',
      'lowest-common-ancestor-rmq',
      'sparse-table-disjoint-sparse-table',
      'lca-binary-lifting-rmq-duality'
    ],
    presets: [
      { id: 'rmq', label: 'Sparse Table O(1) Overlapping Block Query RMQ(L=1, R=6)', mode: 'rmq' },
      { id: 'lca', label: 'Tree LCA(u, v) via Euler Tour Depth RMQ & Binary Lifting up[k][u]', mode: 'lca' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'lca') {
        const lcaSteps = [
          {
            vals: ['E[0]:u1(d=0)', 'E[1]:u2(d=1)', 'E[2]:u4(d=2)', 'E[3]:u2(d=1)', 'E[4]:u5(d=2)', 'E[5]:u2(d=1)', 'E[6]:u1(d=0)'],
            active: [2, 4],
            match: [],
            tags: { 2: 'first[u4]=2', 4: 'first[u5]=4' },
            inv: 'Step 1 (Euler Tour Reduction): Locate first occurrences first[u4]=2 and first[u5]=4 in the 2N−1 Euler Tour array E.',
            log: 'Every node on the unique path between u4 and u5 appears in E[2..4]; the LCA is the unique shallowest node in E[2..4].'
          },
          {
            vals: ['E[0]:u1(d=0)', 'E[1]:u2(d=1)', 'E[2]:u4(d=2)', 'E[3]:u2(d=1)', 'E[4]:u5(d=2)', 'E[5]:u2(d=1)', 'E[6]:u1(d=0)'],
            active: [2, 3, 4],
            match: [3],
            tags: { 2: 'first[u4]=2', 3: 'MIN DEPTH d=1 (LCA=u2!)', 4: 'first[u5]=4' },
            inv: 'Step 2 (Bender & Farach-Colton Duality): Query O(1) Sparse Table RMQ over E[2..4] → minimum depth d=1 at E[3] = u2!',
            log: 'Queried RMQ over Euler depth slice [2..4]: minimum depth is d=1 at E[3] = node u2. Therefore LCA(u4, u5) = u2 in O(1) time!'
          }
        ];
        return lcaSteps.map(st => ({
          stageHtml: renderArrayCells(st.vals, { active: st.active, match: st.match, tags: st.tags }),
          invariant: st.inv,
          metrics: [
            { label: 'Euler Tour Length', value: '2N − 1 = 7' },
            { label: 'Query Slice', value: '[first[u4]=2 .. first[u5]=4]' },
            { label: 'Distance Formula', value: 'dep[u] + dep[v] − 2·dep[LCA]' }
          ],
          log: st.log
        }));
      }

      const arr = [7, 2, 3, 0, 5, 10, 3, 12];
      const steps = [
        {
          vals: arr.map((v, i) => `A[${i}]=${v}`),
          active: [1, 2, 3, 4, 5, 6],
          pivot: [],
          match: [],
          tags: { 1: 'L = 1', 6: 'R = 6 (len = 6, k = ⌊log₂ 6⌋ = 2)' },
          inv: 'Step 1 (Compute Scale k): For query [L=1, R=6], length = R − L + 1 = 6. Largest power of 2 ≤ 6 is 2^k = 4 (k = ⌊log₂ 6⌋ = 2).',
          log: 'Precomputed lg[6] = 2 in O(1). Two blocks of length 2² = 4 will completely cover [1..6]: prefix [1..4] and suffix [3..6].'
        },
        {
          vals: arr.map((v, i) => `A[${i}]=${v}`),
          active: [1, 2, 3, 4],
          pivot: [3, 4, 5, 6],
          match: [3, 4],
          tags: { 1: 'Left 2² Block [1..4]', 3: 'Overlap [3..4] (min=0!)', 6: 'Right 2² Block [3..6]' },
          inv: 'Step 2 (Idempotent Overlap Lookup): Cover [1..6] = [1..4] ∪ [3..6] with overlap [3..4]. Return min(st[2][1], st[2][3]) = min(0, 0) = 0!',
          log: 'Because min(a, a) = a is idempotent, overlapping indices {3, 4} do not corrupt the minimum: min(st[2][1]=0, st[2][3]=0) = 0 in O(1)!'
        }
      ];

      return steps.map(st => ({
        stageHtml: renderArrayCells(st.vals, { active: st.active, pivot: st.pivot, match: st.match, tags: st.tags }),
        invariant: st.inv,
        metrics: [
          { label: 'Query Interval [L, R]', value: '[1, 6] (len = 6)' },
          { label: 'Scale k = ⌊log₂ len⌋', value: 'k = 2 (2^k = 4)' },
          { label: 'Overlapping Lookup', value: 'min(st[2][1], st[2][3]) = 0' },
          { label: 'Query Time', value: 'O(1) (2 Table Reads)' }
        ],
        log: st.log
      }));
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 25. Mo's Algorithm, Heavy-Light Decomposition & Cartesian Tree
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-mos-sqrt-decomposition'] = createStepSimulator({
    id: 'sim-mos-sqrt-decomposition',
    aliases: ['sim-mos-algorithm', 'sim-heavy-light-decomposition', 'sim-cartesian-tree'],
    title: 'Heavy-Light Decomposition, Cartesian Tree Stack & Mo’s Snake-Order Sweep',
    badge: 'O((N+Q)√N) Mo · O(log² N) HLD · O(N) Cartesian',
    badgeClass: 'badge-ologn',
    blurb: 'Switch between three foundational range-query reductions: (1) Mo’s offline √N block-snake query ordering, (2) Heavy-Light path decomposition into ≤ 2 log₂ N contiguous Segment Tree intervals, and (3) O(N) Monotonic Stack Cartesian Tree construction.',
    slugs: [
      'sqrt-decomposition-mos-algorithm',
      'heavy-light-decomposition',
      'cartesian-trees-treap-duality',
      'heavy-light-centroid-decomposition',
      'case-cartesian-tree-rmq-treap'
    ],
    presets: [
      { id: 'mo', label: 'Mo’s Algorithm Snake-Order Query Sweep (Block Size B = √N)', mode: 'mo' },
      { id: 'hld', label: 'Heavy-Light Decomposition (HLD) Path Query Climb in O(log² N)', mode: 'hld' },
      { id: 'cartesian', label: 'O(N) Cartesian Tree Construction via Right-Spine Monotonic Stack', mode: 'cartesian' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'hld') {
        const hldSteps = [
          {
            svg: `
              <svg viewBox="0 0 520 155" style="width:100%;max-height:165px;">
                <line x1="160" y1="28" x2="100" y2="82" stroke="#10b981" stroke-width="4"/>
                <line x1="100" y1="82" x2="60" y2="135" stroke="#10b981" stroke-width="4"/>
                <line x1="160" y1="28" x2="220" y2="82" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,4"/>
                <line x1="220" y1="82" x2="255" y2="135" stroke="#6366f1" stroke-width="4"/>
                <circle cx="160" cy="28" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
                <text x="160" y="32" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">1(sz=5)</text>
                <circle cx="100" cy="82" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
                <text x="100" y="86" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">2(sz=2)</text>
                <circle cx="60" cy="135" r="15" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
                <text x="60" y="139" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">4(sz=1)</text>
                <circle cx="220" cy="82" r="16" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
                <text x="220" y="86" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">3(sz=2)</text>
                <circle cx="255" cy="135" r="15" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
                <text x="255" y="139" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">5(sz=1)</text>
                <rect x="295" y="25" width="210" height="110" rx="8" fill="#18181b" stroke="#3f3f46"/>
                <text x="400" y="50" text-anchor="middle" fill="#34d399" font-size="11" font-family="monospace">Heavy Chain #1: [1, 2, 4] → pos[0..2]</text>
                <text x="400" y="76" text-anchor="middle" fill="#a5b4fc" font-size="11" font-family="monospace">Heavy Chain #2: [3, 5] → pos[3..4]</text>
                <text x="400" y="106" text-anchor="middle" fill="#fcd34d" font-size="10" font-family="monospace">Path(4, 5) = Seg[3..4] ∪ Seg[0..2]!</text>
              </svg>
            `,
            inv: 'Heavy-Light Theorem: Every light edge (u → v) satisfies sz[v] ≤ sz[u]/2, so any root-to-leaf path crosses ≤ log₂ N light edges and decomposes into ≤ 2 log₂ N contiguous Segment Tree slices!',
            m1: 'Step 1: Climb Chain #2 [3..5]',
            m2: 'pos[head[5]=3 .. 5] = [3..4]',
            m3: 'Jump Light Edge 3 → parent 1'
          },
          {
            svg: `
              <svg viewBox="0 0 520 155" style="width:100%;max-height:165px;">
                <line x1="160" y1="28" x2="100" y2="82" stroke="#10b981" stroke-width="4"/>
                <line x1="100" y1="82" x2="60" y2="135" stroke="#10b981" stroke-width="4"/>
                <line x1="160" y1="28" x2="220" y2="82" stroke="#71717a" stroke-width="2" stroke-dasharray="5,4"/>
                <line x1="220" y1="82" x2="255" y2="135" stroke="#71717a" stroke-width="2"/>
                <circle cx="160" cy="28" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
                <text x="160" y="32" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">1(sz=5)</text>
                <circle cx="100" cy="82" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
                <text x="100" y="86" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">2(sz=2)</text>
                <circle cx="60" cy="135" r="15" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
                <text x="60" y="139" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">4(sz=1)</text>
                <circle cx="220" cy="82" r="16" fill="#18181b" stroke="#71717a" stroke-width="2"/>
                <text x="220" y="86" text-anchor="middle" fill="#a1a1aa" font-size="10" font-family="monospace">3(sz=2)</text>
                <circle cx="255" cy="135" r="15" fill="#18181b" stroke="#71717a" stroke-width="2"/>
                <text x="255" y="139" text-anchor="middle" fill="#a1a1aa" font-size="10" font-family="monospace">5(sz=1)</text>
                <rect x="295" y="25" width="210" height="110" rx="8" fill="#18181b" stroke="#10b981"/>
                <text x="400" y="50" text-anchor="middle" fill="#34d399" font-size="11" font-family="monospace">Same Chain #1: head[1] == head[4]</text>
                <text x="400" y="76" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">Final Query: Seg[pos[1]..pos[4]] = [0..2]</text>
                <text x="400" y="106" text-anchor="middle" fill="#fcd34d" font-size="10" font-family="monospace">Done in 2 Segment Tree Queries!</text>
              </svg>
            `,
            inv: 'Once u=1 and v=4 share the same heavy chain (head[1] == head[4] == 1), one final Segment Tree query over [pos[1]..pos[4]] = [0..2] completes the path query in O(log² N)!',
            m1: 'Step 2: Same Chain head[1]==head[4]',
            m2: 'pos[1 .. 4] = [0..2] Contiguous',
            m3: 'O(log² N) Total Path Query'
          }
        ];
        return hldSteps.map(st => ({
          stageHtml: st.svg,
          invariant: st.inv,
          metrics: [
            { label: 'Chain Step', value: st.m1 },
            { label: 'DFS Slice', value: st.m2 },
            { label: 'Total Path Complexity', value: st.m3 }
          ],
          log: st.inv
        }));
      }

      if (preset.mode === 'cartesian') {
        const cSteps = [
          {
            vals: ['A[0]=3', 'A[1]=1', 'A[2]=4', 'A[3]=2'],
            active: [0, 1, 2],
            match: [2],
            tags: { 1: 'Root Min=1', 2: 'Right Spine: [1 → 4]' },
            inv: 'Step 1 (Before A[3]=2): After scanning [3, 1, 4], node 1 is the root (with left child 3) and the monotonic right-spine stack holds [1, 4].',
            log: 'Right-spine stack maintains strictly increasing values from root to rightmost leaf: [A[1]=1, A[2]=4].'
          },
          {
            vals: ['A[0]=3', 'A[1]=1', 'A[2]=4', 'A[3]=2'],
            active: [0, 1, 2],
            match: [3],
            tags: { 1: 'Root Min=1 (Stay on Spine)', 2: 'Popped 4 > 2 (Becomes 2.left!)', 3: 'Insert 2 as 1.right' },
            inv: 'Step 2 (Insert A[3]=2): Pop all right-spine nodes > 2 (node 4). Last popped node (4) becomes 2.left, and 2 attaches as right child of 1!',
            log: 'Amortized O(N) Build: Each node is pushed onto the right-spine stack once and popped at most once (≤ 2N stack ops total).'
          }
        ];
        return cSteps.map(st => ({
          stageHtml: renderArrayCells(st.vals, { active: st.active, match: st.match, tags: st.tags }),
          invariant: st.inv,
          metrics: [
            { label: 'Heap Property', value: 'parent.val ≤ child.val' },
            { label: 'In-Order Property', value: 'Recovers Original Array A' },
            { label: 'Build Complexity', value: 'Θ(N) Monotonic Stack' }
          ],
          log: st.log
        }));
      }

      const moSteps = [
        {
          vals: ['Q1:[1, 6] (blk 0, R↑)', 'Q2:[0, 7] (blk 0, R↑)', 'Q3:[3, 5] (blk 1, R↓)', 'Q4:[4, 2] (blk 1, R↓)'],
          active: [0, 1],
          match: [0],
          tags: { 0: 'Even Block 0: Sweep R Ascending (6 → 7)', 1: 'curR advances +1' },
          inv: 'Step 1 (Even Block 0): Queries with L ∈ Block 0 are sorted by R ascending. curR sweeps right monotonically (6 → 7) in O(N) total steps for the block.',
          log: 'In Even Block 0, curR moves right from 6 to 7 (+1 step) while curL jitters within Block 0 by at most B = √N steps.'
        },
        {
          vals: ['Q1:[1, 6] (blk 0, R↑)', 'Q2:[0, 7] (blk 0, R↑)', 'Q3:[3, 5] (blk 1, R↓)', 'Q4:[4, 2] (blk 1, R↓)'],
          active: [2, 3],
          match: [2],
          tags: { 2: 'Odd Block 1: Sweep R Descending (5 → 2)', 3: 'Snake Order Saves Rewind!' },
          inv: 'Step 2 (Odd Block 1 Snake Sweep): Flipping R-order to descending in odd blocks avoids rewinding curR from N back to 0, cutting right-pointer movement by 50%!',
          log: 'Right pointer curR sweeps monotonically per block (≤ √N · N steps), while curL moves ≤ B = √N steps per query (≤ Q√N steps).'
        }
      ];

      return moSteps.map(st => ({
        stageHtml: renderArrayCells(st.vals, { active: st.active, match: st.match, tags: st.tags }),
        invariant: st.inv,
        metrics: [
          { label: 'Optimal Block Size B', value: 'B = max(1, ⌊N / √Q⌋)' },
          { label: 'Left Pointer Moves', value: '≤ Q · B = O(N√Q)' },
          { label: 'Right Pointer Moves', value: '≤ (N/B) · N = O(N√Q)' }
        ],
        log: st.log
      }));
    }
  });
})();
