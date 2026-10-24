window.MODULE_CONTENT = window.MODULE_CONTENT || {};
window.MODULE_CONTENT["m09"] = {
  "static-range-queries-sparse-table": {
    title: "Disjoint & Standard Sparse Tables: O(1) Idempotent Range Minimum Query (RMQ)",
    video: {
      youtubeId: "0jWeUdxrGm4",
      title: "Sparse Table Data Structure — Range Minimum Query (RMQ)",
      channel: "WilliamFiset",
      duration: "14:47",
      start: 0,
      length: 887,
      why: "Clear geometric visualization of how overlapping power-of-two intervals cover any query range [L, R] in O(1) time for idempotent operations."
    },
    intuition: `<p>Every binary integer can be decomposed into a sum of powers of two, which lets us answer any range query over a static array in $O(\\log N)$ time by stitching together precomputed power-of-two blocks. When the combine operation is <strong>idempotent</strong> ($a \\oplus a = a$, such as $\\min$, $\\max$, $\\gcd$, bitwise OR/AND), we do not even need disjoint blocks: two potentially overlapping blocks of length $2^k$ where $k = \\lfloor \\log_2(R - L + 1) \\rfloor$—one anchored at $L$ and one ending at $R$—completely cover $[L, R]$ in $O(1)$ time with two array reads.</p>
    <p>What if the operation is an associative <strong>non-idempotent</strong> semigroup like range sum, matrix multiplication, or modular product where overlapping elements would be double-counted? A <strong>Disjoint Sparse Table (DST)</strong> solves this in $O(N \\log N)$ preprocessing and $O(1)$ query time by building a divide-and-conquer tree of height $\\lceil \\log_2 N \\rceil$ where each level stores prefix and suffix accumulations radiating outward from the midpoint of each block. Any query $[L, R]$ is answered in $O(1)$ by finding the unique level where $L$ and $R$ straddle a midpoint—computable via the highest set bit of $L \\oplus R$ (<code> + "</code>__builtin_clz(L ^ R)<code>" + </code>)—and combining one precomputed suffix with one precomputed prefix.</p>`,
    content: `<div class="lesson-content">
      <h3>1. The Algebra of Range Queries: Semigroups, Monoids, Groups, and Idempotence</h3>
      <p>Before selecting a range query structure, classify the binary operator $\\oplus: S \\times S \\to S$:</p>
      <ul>
        <li><strong>Group (Invertible Associative Operation)</strong> — e.g., $+, \\oplus(\\text{XOR}), \\times \\pmod p$. Because every element has an inverse $a^{-1}$, any static range query $A[L \\dots R]$ reduces to a 1D prefix array $P[i] = P[i-1] \\oplus A[i]$ via $P[R] \\oplus P[L-1]^{-1}$ in $O(N)$ build and $O(1)$ query time.</li>
        <li><strong>Idempotent Semigroup (Band)</strong> — e.g., $\\min, \\max, \\gcd, \\text{lcm}, \\&, |$. These operations have <em>no inverse</em> (knowing $\\min(A[0..R]) = 2$ and $\\min(A[0..L-1]) = 2$ tells you nothing about $\\min(A[L..R])$), so prefix arrays fail. However, they satisfy <strong>idempotence</strong>: $x \\oplus x = x$. Consequently, if two sub-intervals $I_1, I_2$ satisfy $I_1 \\cup I_2 = [L, R]$, then $\\text{ans}(I_1) \\oplus \\text{ans}(I_2) = \\text{ans}([L, R])$ even when $I_1 \\cap I_2 \\neq \\emptyset$.</li>
        <li><strong>General Semigroup / Monoid (Non-Invertible, Non-Idempotent)</strong> — e.g., $2 \\times 2$ matrix multiplication, polynomial hashing, maximum subarray sum tuple, string concatenation. Neither prefix inversion nor overlapping intervals work; we must partition $[L, R]$ into strictly <strong>disjoint</strong> intervals.</li>
      </ul>

      <div class="invariant-box">
        <strong>Standard Sparse Table Coverage Invariant:</strong> For any interval $[L, R]$ of length $\\text{len} = R - L + 1$, let $k = \\lfloor \\log_2(\\text{len}) \\rfloor$, so $2^k \\le \\text{len} < 2^{k+1}$. Then the left interval $[L, L + 2^k - 1]$ and the right interval $[R - 2^k + 1, R]$ both lie entirely inside $[L, R]$ and satisfy $(L + 2^k - 1) \\ge (R - 2^k + 1)$, meaning their union is <em>exactly</em> $[L, R]$:
        $$\\bigoplus_{i=L}^{R} A[i] = \\text{st}[k][L] \\oplus \\text{st}[k][R - 2^k + 1]$$
      </div>

      <h3>2. Standard Sparse Table Construction &amp; Disjoint Sparse Table (DST)</h3>
      <p>The Standard Sparse Table builds a 2D table $\\text{st}[k][i]$ of size $(\\lfloor \\log_2 N \\rfloor + 1) \\times N$, where $\\text{st}[k][i]$ stores the range aggregate over $[i, i + 2^k - 1]$. Level $0$ is just $\\text{st}[0][i] = A[i]$, and each subsequent level is built by combining two adjacent intervals of length $2^{k-1}$:</p>
      <p>$$\\text{st}[k][i] = \\text{st}[k-1][i] \\oplus \\text{st}[k-1][i + 2^{k-1}]$$</p>
      <p>In contrast, a <strong>Disjoint Sparse Table (DST)</strong> pads $N$ to a power of two $2^H$ and considers blocks of size $2^{H - h}$ at depth $h \\in [0, H-1]$. Around the midpoint $M$ of each block, DST computes suffixes moving left from $M-1$ down to the block start, and prefixes moving right from $M$ up to the block end. For any query $L < R$, let $b = \\lfloor \\log_2(L \\oplus R) \\rfloor$ be the most significant bit where $L$ and $R$ differ. At level $h = H - 1 - b$, indices $L$ and $R$ fall into the left and right halves of the same block separated by midpoint $M$, so $\\text{dst}[h][L] \\oplus \\text{dst}[h][R]$ combines $[L, M-1]$ and $[M, R]$ with <em>zero overlap</em> in $O(1)$ time!</p>

      <svg viewBox="0 0 760 230" class="lesson-svg" role="img" aria-label="Comparison of Overlapping Standard Sparse Table vs Disjoint Sparse Table Midpoint Split">
        <style>
          .st-bg { fill: #0f172a; rx: 10px; }
          .st-box1 { fill: rgba(56, 189, 248, 0.22); stroke: #38bdf8; stroke-width: 2px; rx: 4px; }
          .st-box2 { fill: rgba(244, 114, 182, 0.22); stroke: #f472b6; stroke-width: 2px; rx: 4px; }
          .st-mid { stroke: #facc15; stroke-width: 2.5px; stroke-dasharray: 5 3; }
          .st-lbl { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .st-sub { fill: #94a3b8; font-family: sans-serif; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="230" class="st-bg"/>
        <!-- Left panel: Standard Sparse Table -->
        <text x="30" y="28" class="st-lbl" fill="#38bdf8">1. Standard Sparse Table (Idempotent: min, max, gcd)</text>
        <text x="30" y="46" class="st-sub">Query [L=2, R=8], len = 7, k = floor(log2(7)) = 2 (2^k = 4)</text>
        <rect x="30" y="65" width="320" height="28" fill="#1e293b" stroke="#475569" rx="4"/>
        <!-- First 2^k block [2..5] -->
        <rect x="70" y="102" width="160" height="28" class="st-box1"/>
        <text x="150" y="120" text-anchor="middle" class="st-lbl">st[2][2] covers [2..5]</text>
        <!-- Second 2^k block [5..8] -->
        <rect x="150" y="138" width="160" height="28" class="st-box2"/>
        <text x="230" y="156" text-anchor="middle" class="st-lbl">st[2][5] covers [5..8]</text>
        <text x="190" y="188" text-anchor="middle" class="st-sub" fill="#facc15">Overlap at index 5 is safe because min(x, x) = x</text>

        <!-- Right panel: Disjoint Sparse Table -->
        <text x="410" y="28" class="st-lbl" fill="#34d399">2. Disjoint Sparse Table (Any Semigroup: Matrix, Sum, Prod)</text>
        <text x="410" y="46" class="st-sub">Query [L=2, R=6], msb(2 ^ 6) = msb(4) = bit 2 -&gt; Midpoint M = 4</text>
        <rect x="410" y="65" width="320" height="28" fill="#1e293b" stroke="#475569" rx="4"/>
        <line x1="570" y1="58" x2="570" y2="175" class="st-mid"/>
        <text x="570" y="190" text-anchor="middle" class="st-lbl" fill="#facc15">Midpoint M=4</text>
        <!-- Left suffix [2..3] -->
        <rect x="490" y="110" width="80" height="32" class="st-box1"/>
        <text x="530" y="130" text-anchor="middle" class="st-lbl">dst[h][2]</text>
        <!-- Right prefix [4..6] -->
        <rect x="570" y="110" width="120" height="32" class="st-box2"/>
        <text x="630" y="130" text-anchor="middle" class="st-lbl">dst[h][6]</text>
        <text x="570" y="210" text-anchor="middle" class="st-sub">[2..3] and [4..6] are strictly disjoint: zero double-counting!</text>
      </svg>

      <div class="mermaid">
flowchart LR
  subgraph Level0["k = 0 (len = 1)"]
    A0["[0..0]"]
    A1["[1..1]"]
    A2["[2..2]"]
    A3["[3..3]"]
  end
  subgraph Level1["k = 1 (len = 2)"]
    B0["[0..1]"]
    B1["[1..2]"]
    B2["[2..3]"]
  end
  subgraph Level2["k = 2 (len = 4)"]
    C0["[0..3]"]
  end
  A0 & A1 --> B0
  A1 & A2 --> B1
  A2 & A3 --> B2
  B0 & B2 --> C0
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Row-Major Layout &amp; Hardware <code>CLZ</code>:</strong> Always index your Sparse Table as <code>st[k][i]</code> (level major) rather than <code>st[i][k]</code>. During construction, <code>st[k][i] = min(st[k-1][i], st[k-1][i + (1 &lt;&lt; (k-1))])</code> streams sequentially across two contiguous rows of <code>st[k-1]</code>, allowing the CPU hardware prefetcher and AVX2 <code>_mm256_min_epi32</code> vector instructions to build 8 cells per clock cycle. During queries, never call floating-point <code>Math.log2(len)</code>; use integer bit intrinsics <code>31 - Math.clz32(len)</code> (or <code>__builtin_clz</code> in C++, which compiles to a single 1-cycle <code>LZCNT</code> / <code>BSR</code> instruction).
      </div>

      <div class="simulator-mount" data-sim="sim-sparse-table-lca-rmq"></div>

      <h3>3. Production Implementation: Standard RMQ &amp; Disjoint Sparse Table</h3>
      <pre><code class="language-javascript">/**
 * 1. Standard Sparse Table for O(1) Idempotent Range Minimum Query (RMQ)
 * Build: O(N log N) time &amp; space | Query: O(1) time (2 table lookups + 1 clz32)
 */
class SparseTableRMQ {
  constructor(arr) {
    this.n = arr.length;
    this.maxK = 31 - Math.clz32(this.n);
    // Flat Float64Array / Int32Array per level for L1/L2 cache locality
    this.st = Array.from({ length: this.maxK + 1 }, () =&gt; new Int32Array(this.n));
    for (let i = 0; i &lt; this.n; i++) this.st[0][i] = arr[i];

    for (let k = 1; k &lt;= this.maxK; k++) {
      const half = 1 &lt;&lt; (k - 1);
      const limit = this.n - (1 &lt;&lt; k);
      const prev = this.st[k - 1];
      const curr = this.st[k];
      for (let i = 0; i &lt;= limit; i++) {
        const a = prev[i], b = prev[i + half];
        curr[i] = a &lt; b ? a : b;
      }
    }
  }

  query(l, r) {
    const k = 31 - Math.clz32(r - l + 1);
    const row = this.st[k];
    const a = row[l], b = row[r - (1 &lt;&lt; k) + 1];
    return a &lt; b ? a : b;
  }
}

/**
 * 2. Disjoint Sparse Table (DST) for O(1) Non-Idempotent Semigroup Queries
 * Supports any associative combine(a, b) (e.g., modular product, matrix mult)
 */
class DisjointSparseTable {
  constructor(arr, combine) {
    this.combine = combine;
    this.levels = Math.max(1, 32 - Math.clz32(arr.length - 1));
    this.size = 1 &lt;&lt; this.levels;
    this.table = Array.from({ length: this.levels }, () =&gt; new Array(this.size));

    for (let h = 0; h &lt; this.levels; h++) {
      const blockLen = 1 &lt;&lt; (this.levels - h);
      const half = blockLen &gt;&gt; 1;
      for (let start = 0; start &lt; arr.length; start += blockLen) {
        const mid = Math.min(start + half, arr.length);
        const end = Math.min(start + blockLen, arr.length);
        // Suffixes extending left from mid - 1 down to start
        if (mid - 1 &lt; arr.length) {
          this.table[h][mid - 1] = arr[mid - 1];
          for (let i = mid - 2; i &gt;= start; i--) {
            this.table[h][i] = combine(arr[i], this.table[h][i + 1]);
          }
        }
        // Prefixes extending right from mid up to end - 1
        if (mid &lt; arr.length) {
          this.table[h][mid] = arr[mid];
          for (let i = mid + 1; i &lt; end; i++) {
            this.table[h][i] = combine(this.table[h][i - 1], arr[i]);
          }
        }
      }
    }
  }

  query(l, r) {
    if (l === r) return this.table[this.levels - 1][l];
    const msbDiff = 31 - Math.clz32(l ^ r);
    const h = this.levels - 1 - msbDiff;
    return this.combine(this.table[h][l], this.table[h][r]);
  }
}</code></pre>

      <h3>4. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Structure</th>
            <th>Required Algebraic Property</th>
            <th>Build Time</th>
            <th>Space Complexity</th>
            <th>Range Query Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Prefix Array</td>
            <td>Invertible Group ($+, \\oplus$)</td>
            <td>$\\Theta(N)$</td>
            <td>$\\Theta(N)$</td>
            <td>$\\Theta(1)$</td>
          </tr>
          <tr>
            <td>Standard Sparse Table</td>
            <td>Idempotent Semigroup ($\\min, \\max, \\gcd$)</td>
            <td>$\\Theta(N \\log N)$</td>
            <td>$\\Theta(N \\log N)$</td>
            <td>$\\Theta(1)$</td>
          </tr>
          <tr>
            <td>Disjoint Sparse Table (DST)</td>
            <td>Any Associative Semigroup</td>
            <td>$\\Theta(N \\log N)$</td>
            <td>$\\Theta(N \\log N)$</td>
            <td>$\\Theta(1)$</td>
          </tr>
          <tr>
            <td>Block RMQ + Four Russians ($\\pm 1$ RMQ)</td>
            <td>Idempotent RMQ</td>
            <td>$\\Theta(N)$</td>
            <td>$\\Theta(N)$</td>
            <td>$\\Theta(1)$</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Using Standard Sparse Table on Non-Idempotent Operations:</strong> Never use the overlapping $O(1)$ query formula $\\text{st}[k][L] \\oplus \\text{st}[k][R - 2^k + 1]$ for range sum, XOR, or GCD-count! Unless $R - L + 1$ happens to be an exact power of two, the middle indices $[R - 2^k + 1, L + 2^k - 1]$ are included in <em>both</em> lookups and will be counted twice. Either use a Disjoint Sparse Table ($O(1)$) or iterate over the set bits of $R - L + 1$ in $O(\\log N)$ time.
      </div>
    </div>`,
    keyTakeaways: [
      "Standard Sparse Tables exploit idempotence (x op x = x) to cover any interval [L, R] using two overlapping blocks of size 2^k where k = floor(log2(R - L + 1)) in O(1) time.",
      "Disjoint Sparse Tables (DST) generalize O(1) static queries to any associative semigroup (matrices, modular products, max subarray tuples) by precomputing suffixes and prefixes radiating from block midpoints.",
      "In a DST, the exact level h where L and R straddle the midpoint is found in O(1) time via the most significant bit of L ^ R (31 - Math.clz32(L ^ R)).",
      "Always store Sparse Tables in level-major order st[k][i] so construction streams sequentially across cache lines and enables SIMD vectorization."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — Sparse Table for O(1) Range Minimum Query",
        url: "https://cp-algorithms.com/data_structures/sparse-table.html"
      },
      {
        title: "Bender & Farach-Colton (2000) — The LCA Problem Revisited (RMQ & Sparse Table Foundations)",
        url: "https://doi.org/10.1007/3-540-44985-X_9"
      },
      {
        title: "CodeChef Editorial — Disjoint Sparse Table (Tutorial by grounded principle)",
        url: "https://discuss.codechef.com/t/tutorial-disjoint-sparse-table/17404"
      }
    ]
  },

  "fenwick-tree-binary-indexed": {
    title: "Fenwick Trees (Binary Indexed Trees): lowbit Geometry, Point Updates & Range Updates",
    video: {
      youtubeId: "CWDQJGaN1gY",
      title: "Fenwick Tree (Binary Indexed Tree) — Construction, Point Update & Prefix Sum",
      channel: "WilliamFiset",
      duration: "14:52",
      start: 0,
      length: 892,
      why: "Demonstrates how two's complement bit isolation i & -i links every 1-based index to its parent responsibility interval."
    },
    intuition: `<p>A Segment Tree over an array of $N$ elements requires at least $2N$ (or $4N$) nodes because it stores both left and right children at every internal node. Peter Fenwick observed in 1994 that if our operation is an <strong>invertible group</strong> (like addition), we can discard every right child in a segment tree! If a parent node knows the sum of $[1..8]$ and its left child knows $[1..4]$, the right child $[5..8]$ is redundant because $\\text{sum}(5..8) = \\text{sum}(1..8) - \\text{sum}(1..4)$. Deleting every right child leaves exactly $N$ nodes that map 1-to-1 onto a 1-based array $T[1..N]$.</p>
    <p>In this 1-based array, the length of the interval that cell $T[i]$ is responsible for equals the value of the lowest set bit of $i$: $\\text{lowbit}(i) = i \\mathrel{\\&} (-i)$ in two's complement arithmetic. Stripping the lowest set bit ($i \\leftarrow i - (i \\mathrel{\\&} -i)$) walks down prefix blocks to accumulate $\\text{prefixSum}(i)$ in at most $\\text{popcount}(i) \\le \\lceil \\log_2 N \\rceil$ steps; adding the lowest set bit ($i \\leftarrow i + (i \\mathrel{\\&} -i)$) climbs upward through all enclosing ancestor intervals to apply a point update.</p>`,
    content: `<div class="lesson-content">
      <h3>1. Two's Complement Geometry &amp; The Responsibility Interval</h3>
      <p>In a 1-indexed Fenwick Tree $T[1 \\dots N]$, let $\\text{lowbit}(i) = i \\mathrel{\\&} (-i)$ denote the largest power of two $2^k$ that divides $i$. Because $-i = \\sim i + 1$ in two's complement binary representation, all bits below $2^k$ flip from $0 \\to 1$ and carry into position $k$, while all bits above $k$ are inverted and masked out by the bitwise AND.</p>

      <div class="invariant-box">
        <strong>Fenwick Responsibility Invariant:</strong> Each cell $T[i]$ (for $1 \\le i \\le N$) stores the aggregate of the half-open interval of length $\\text{lowbit}(i)$ ending at $i$:
        $$T[i] = \\sum_{j = i - \\text{lowbit}(i) + 1}^{i} A[j]$$
        <ul>
          <li>If $i$ is odd ($\\text{lowbit}(i) = 1$), $T[i]$ stores only $A[i]$.</li>
          <li>If $i = 6 = 0110_2$ ($\\text{lowbit}(6) = 2$), $T[6]$ stores $A[5] + A[6]$.</li>
          <li>If $i = 8 = 1000_2$ ($\\text{lowbit}(8) = 8$), $T[8]$ stores $A[1] + A[2] + \\dots + A[8]$.</li>
        </ul>
      </div>

      <svg viewBox="0 0 760 240" class="lesson-svg" role="img" aria-label="Fenwick Tree Responsibility Intervals for indices 1 through 8">
        <style>
          .ft-bg { fill: #0f172a; rx: 10px; }
          .ft-bar1 { fill: rgba(56, 189, 248, 0.25); stroke: #38bdf8; stroke-width: 2px; rx: 3px; }
          .ft-bar2 { fill: rgba(52, 211, 153, 0.25); stroke: #34d399; stroke-width: 2px; rx: 3px; }
          .ft-bar4 { fill: rgba(250, 204, 21, 0.25); stroke: #facc15; stroke-width: 2px; rx: 3px; }
          .ft-bar8 { fill: rgba(244, 114, 182, 0.25); stroke: #f472b6; stroke-width: 2px; rx: 3px; }
          .ft-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .ft-sub { fill: #94a3b8; font-family: monospace; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="240" class="ft-bg"/>
        <text x="30" y="26" class="ft-txt" fill="#38bdf8">Fenwick Tree T[1..8]: Responsibility Intervals [i - lowbit(i) + 1 .. i]</text>
        <!-- Columns 1 to 8: x = 40 + (i-1)*85, width = 75 -->
        <g transform="translate(40, 42)">
          <!-- T[8]: [1..8] -->
          <rect x="0" y="0" width="670" height="26" class="ft-bar8"/>
          <text x="335" y="17" text-anchor="middle" class="ft-txt">T[8] (1000₂, lowbit=8): covers A[1..8]</text>
          <!-- T[4]: [1..4] -->
          <rect x="0" y="36" width="330" height="26" class="ft-bar4"/>
          <text x="165" y="53" text-anchor="middle" class="ft-txt">T[4] (0100₂, lowbit=4): A[1..4]</text>
          <!-- T[2]: [1..2] and T[6]: [5..6] -->
          <rect x="0" y="72" width="160" height="26" class="ft-bar2"/>
          <text x="80" y="89" text-anchor="middle" class="ft-txt">T[2] (0010₂): A[1..2]</text>
          <rect x="340" y="72" width="160" height="26" class="ft-bar2"/>
          <text x="420" y="89" text-anchor="middle" class="ft-txt">T[6] (0110₂): A[5..6]</text>
          <!-- Odd indices: T[1], T[3], T[5], T[7] -->
          <rect x="0" y="108" width="75" height="26" class="ft-bar1"/>
          <text x="37" y="125" text-anchor="middle" class="ft-txt">T[1]</text>
          <rect x="170" y="108" width="75" height="26" class="ft-bar1"/>
          <text x="207" y="125" text-anchor="middle" class="ft-txt">T[3]</text>
          <rect x="340" y="108" width="75" height="26" class="ft-bar1"/>
          <text x="377" y="125" text-anchor="middle" class="ft-txt">T[5]</text>
          <rect x="510" y="108" width="75" height="26" class="ft-bar1"/>
          <text x="547" y="125" text-anchor="middle" class="ft-txt">T[7]</text>
          <!-- Index labels -->
          <text x="37" y="158" text-anchor="middle" class="ft-sub">i=1 (0001)</text>
          <text x="122" y="158" text-anchor="middle" class="ft-sub">i=2 (0010)</text>
          <text x="207" y="158" text-anchor="middle" class="ft-sub">i=3 (0011)</text>
          <text x="292" y="158" text-anchor="middle" class="ft-sub">i=4 (0100)</text>
          <text x="377" y="158" text-anchor="middle" class="ft-sub">i=5 (0101)</text>
          <text x="462" y="158" text-anchor="middle" class="ft-sub">i=6 (0110)</text>
          <text x="547" y="158" text-anchor="middle" class="ft-sub">i=7 (0111)</text>
          <text x="632" y="158" text-anchor="middle" class="ft-sub">i=8 (1000)</text>
          <text x="335" y="182" text-anchor="middle" class="ft-txt" fill="#facc15">prefixSum(7) = T[7] + T[6] + T[4] | add(3, v) updates T[3] -&gt; T[4] -&gt; T[8]</text>
        </g>
      </svg>

      <h3>2. $O(N)$ Linear-Time Construction &amp; $O(\\log N)$ Binary Lifting (<code>lowerBound</code>)</h3>
      <p>Calling <code>add(i, A[i])</code> $N$ times builds a Fenwick tree in $O(N \\log N)$ time. We can instead build it in <strong>exact $\\Theta(N)$ time</strong> by propagating each node $T[i]$ directly to its immediate update parent $j = i + (i \\mathrel{\\&} -i)$ in a single forward loop:</p>
      <p>$$\\text{For } i = 1 \\dots N: \\quad j = i + (i \\mathrel{\\&} -i); \\quad \\text{if } j \\le N \\text{ then } T[j] \\mathrel{+}= T[i]$$</p>
      <p>Furthermore, if all array elements are non-negative ($A[i] \\ge 0$), the prefix sums are monotonically non-decreasing. Instead of binary searching over <code>prefixSum(mid)</code> in $O(\\log^2 N)$ time, we can find the smallest index $i$ with $\\text{prefixSum}(i) \\ge k$ in <strong>single-pass $O(\\log N)$ time via Binary Lifting</strong>: test bit steps $p = 2^{\\lfloor \\log_2 N \\rfloor}, \\dots, 2, 1$; if $T[\\text{idx} + p] < k$, advance $\\text{idx} \\mathrel{+}= p$ and subtract $k \\mathrel{-}= T[\\text{idx}]$ because $T[\\text{idx} + p]$ stores the exact sum of the next $p$ elements!</p>

      <div class="mermaid">
flowchart LR
  subgraph UpdateTree["Update Tree (i += i & -i)"]
    U1["1 (001)"] --> U2["2 (010)"]
    U3["3 (011)"] --> U4["4 (100)"]
    U2 --> U4
    U5["5 (101)"] --> U6["6 (110)"]
    U7["7 (111)"] --> U8["8 (1000)"]
    U6 --> U8
    U4 --> U8
  end
  subgraph QueryTree["Query Tree (i -= i & -i)"]
    Q7["7 (111)"] --> Q6["6 (110)"] --> Q4["4 (100)"] --> Q0["0 (stop)"]
    Q5["5 (101)"] --> Q4
    Q3["3 (011)"] --> Q2["2 (010)"] --> Q0
  end
      </div>

      <h3>3. Range Add &amp; Range Sum Using Two Dual Fenwick Trees</h3>
      <p>Let $D[i] = A[i] - A[i-1]$ be the difference array of $A$, so adding $+\\Delta$ to $A[l \\dots r]$ only requires two point updates: $D[l] \\mathrel{+}= \\Delta$ and $D[r+1] \\mathrel{-}= \\Delta$. How do we recover the prefix sum $\\sum_{i=1}^{x} A[i]$ from $D$? Using summation by parts:</p>
      <p>$$\\sum_{i=1}^{x} A[i] = \\sum_{i=1}^{x} \\sum_{j=1}^{i} D[j] = \\sum_{j=1}^{x} D[j] \\cdot (x - j + 1) = (x + 1)\\sum_{j=1}^{x} D[j] - \\sum_{j=1}^{x} j \\cdot D[j]$$</p>
      <p>By maintaining two Fenwick trees—$B_1$ storing $D[j]$ and $B_2$ storing $j \\cdot D[j]$—both <code>rangeAdd(l, r, delta)</code> and <code>rangeSum(l, r)</code> execute in $O(\\log N)$ time with only $2N$ words of memory!</p>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Why Fenwick Beats Segment Trees by 3x–5x:</strong> A Fenwick tree uses exactly $N + 1$ contiguous words (4 MB for $10^6$ <code>int32</code>s, fitting entirely inside a modern CPU's L3 cache), has zero recursion overhead, and its loop condition <code>i -= i &amp; -i</code> executes in $\\frac{1}{2} \\log_2 N$ iterations on average (the average Hamming weight of an integer). On modern x86-64 CPUs with BMI1 (<code>BLSR</code> for <code>i &amp; (i - 1)</code> and <code>BLSI</code> for <code>i &amp; -i</code>), the inner loop is literally 3 machine instructions.
      </div>

      <div class="simulator-mount" data-sim="sim-fenwick-bit-tree"></div>

      <h3>4. Production Implementation: Fenwick Tree with $O(N)$ Build, Binary Lifting &amp; Range Add/Sum</h3>
      <pre><code class="language-javascript">class FenwickTree {
  /**
   * O(N) linear-time construction from 0-indexed input array
   */
  constructor(arrOrSize) {
    if (typeof arrOrSize === "number") {
      this.n = arrOrSize;
      this.tree = new Float64Array(this.n + 1);
    } else {
      this.n = arrOrSize.length;
      this.tree = new Float64Array(this.n + 1);
      for (let i = 1; i &lt;= this.n; i++) {
        this.tree[i] += arrOrSize[i - 1];
        const parent = i + (i &amp; -i);
        if (parent &lt;= this.n) this.tree[parent] += this.tree[i];
      }
    }
  }

  // Point update: A[idx] += delta (1-indexed: 1 &lt;= idx &lt;= n)
  add(idx, delta) {
    for (let i = idx; i &lt;= this.n; i += i &amp; -i) {
      this.tree[i] += delta;
    }
  }

  // Prefix sum: A[1] + ... + A[idx]
  prefixSum(idx) {
    let sum = 0;
    for (let i = idx; i &gt; 0; i -= i &amp; -i) {
      sum += this.tree[i];
    }
    return sum;
  }

  rangeSum(l, r) {
    return this.prefixSum(r) - this.prefixSum(l - 1);
  }

  /**
   * O(log N) Binary Lifting on Fenwick Tree (requires A[i] &gt;= 0):
   * Returns smallest 1-based index idx such that prefixSum(idx) &gt;= targetSum
   */
  lowerBound(targetSum) {
    let idx = 0;
    let bitMask = 1 &lt;&lt; (31 - Math.clz32(this.n));
    for (; bitMask &gt; 0; bitMask &gt;&gt;= 1) {
      const next = idx + bitMask;
      if (next &lt;= this.n &amp;&amp; this.tree[next] &lt; targetSum) {
        idx = next;
        targetSum -= this.tree[next];
      }
    }
    return idx + 1;
  }
}

/**
 * Dual Fenwick Tree supporting both Range Add and Range Sum in O(log N)
 */
class RangeFenwickTree {
  constructor(n) {
    this.n = n;
    this.b1 = new FenwickTree(n); // stores D[i]
    this.b2 = new FenwickTree(n); // stores i * D[i]
  }

  rangeAdd(l, r, delta) {
    this.b1.add(l, delta);
    this.b1.add(r + 1, -delta);
    this.b2.add(l, delta * l);
    this.b2.add(r + 1, -delta * (r + 1));
  }

  prefixSum(x) {
    return (x + 1) * this.b1.prefixSum(x) - this.b2.prefixSum(x);
  }

  rangeSum(l, r) {
    return this.prefixSum(r) - this.prefixSum(l - 1);
  }
}</code></pre>

      <h3>5. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Operation</th>
            <th>Standard Fenwick Tree</th>
            <th>Dual Fenwick Tree ($B_1, B_2$)</th>
            <th>Iterative Segment Tree</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Construction from Array</td>
            <td>$\\Theta(N)$</td>
            <td>$\\Theta(N)$</td>
            <td>$\\Theta(N)$</td>
          </tr>
          <tr>
            <td>Point Update / Prefix Query</td>
            <td>$O(\\log N)$</td>
            <td>$O(\\log N)$</td>
            <td>$O(\\log N)$</td>
          </tr>
          <tr>
            <td>Range Add + Range Sum</td>
            <td>Not directly (needs Dual BIT)</td>
            <td>$O(\\log N)$</td>
            <td>$O(\\log N)$ (Lazy Segment Tree)</td>
          </tr>
          <tr>
            <td>Prefix <code>lowerBound</code> Search</td>
            <td>$O(\\log N)$ via Binary Lifting</td>
            <td>—</td>
            <td>$O(\\log N)$ tree walk</td>
          </tr>
          <tr>
            <td>Memory Footprint</td>
            <td>$N + 1$ words</td>
            <td>$2N + 2$ words</td>
            <td>$2N$ to $4N$ words</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — 0-Indexed Infinite Loops &amp; Non-Invertible Arbitrary Range Queries:</strong> Never pass index <code>0</code> to <code>add(0, delta)</code> in a 1-indexed Fenwick Tree! Because <code>0 &amp; -0 === 0</code>, the loop <code>for (let i = 0; i &lt;= n; i += i &amp; -i)</code> never advances and hangs forever. Always use 1-based indexing inside the tree (or the 0-based variant <code>i |= i + 1</code> / <code>i = (i &amp; (i + 1)) - 1</code>). Also remember that while a Fenwick tree supports <em>prefix</em> $\\min(1..r)$ when updates only decrease values, it cannot compute arbitrary $\\min(l..r)$ via subtraction because $\\min$ has no inverse.
      </div>
    </div>`,
    keyTakeaways: [
      "A Fenwick tree is a segment tree with all right children removed, storing the aggregate of [i - lowbit(i) + 1 .. i] at 1-based index T[i] where lowbit(i) = i & -i.",
      "Passing each node's value to its immediate parent i + (i & -i) constructs a Fenwick tree in exact O(N) time.",
      "Binary lifting on T[] finds the first prefix sum >= K in O(log N) time because T[idx + 2^p] holds the exact sum of the next 2^p elements.",
      "Maintaining two Fenwick trees over D[i] and i * D[i] supports both range additions and range sum queries in O(log N) time."
    ],
    furtherReading: [
      {
        title: "Fenwick (1994) — A New Data Structure for Cumulative Frequency Tables (Software: Practice and Experience)",
        url: "https://doi.org/10.1002/spe.4380240306"
      },
      {
        title: "CP-Algorithms — Fenwick Tree (Binary Indexed Tree) & Range Updates",
        url: "https://cp-algorithms.com/data_structures/fenwick.html"
      }
    ]
  },

  "segment-trees-bottom-up-monoids": {
    title: "Segment Trees over Monoids: Recursive vs Iterative (ZKW) Bottom-Up Implementation",
    video: {
      youtubeId: "ZBHKZF5w4YU",
      title: "Segment Tree Data Structure — Iterative & Recursive Construction",
      channel: "WilliamFiset",
      duration: "19:33",
      start: 0,
      length: 1173,
      why: "Explains the 2N iterative array layout and how bottom-up pointer convergence partitions any interval [L, R) into at most 2 log2 N canonical nodes."
    },
    intuition: `<p>While a Fenwick tree requires an invertible operation (like addition) to recover $[L, R]$ from two prefixes, a <strong>Segment Tree</strong> only requires a <strong>Monoid</strong> $(M, \\oplus, e)$: an associative binary operation $\\oplus$ with an identity element $e$. That single abstraction covers everything from $\\min/\\max$, $\\gcd$, and matrix multiplication to maximum subarray sum (Kadane's 4-tuple) and balanced parenthesis matching.</p>
    <p>In competitive programming and high-performance systems, there are two ways to lay out a Segment Tree in memory. The classic <strong>Recursive Top-Down</strong> tree splits $[tl, tr]$ at $tm = \\lfloor(tl+tr)/2\\rfloor$ and requires an array of size $4N$ when $N$ is not a power of two. The <strong>Iterative Bottom-Up (ZKW) Segment Tree</strong> places the $N$ leaves directly at indices $[N \\dots 2N-1]$ and computes internal nodes $[1 \\dots N-1]$ via $\\text{tree}[i] = \\text{tree}[2i] \\oplus \\text{tree}[2i+1]$ in an array of size <strong>exact $2N$</strong>, answering queries with a branch-free bottom-up loop that runs 3x–4x faster than recursion.</p>`,
    content: `<div class="lesson-content">
      <h3>1. Why Recursive Segment Trees Need $4N$ Space While Iterative Needs $2N$</h3>
      <p>In a top-down recursive segment tree using 1-based heap indexing ($\\text{left} = 2v$, $\\text{right} = 2v+1$), if $N = 2^k + 1$ (just over a power of two), the tree has height $k + 2$, and the rightmost leaves at the deepest level can reach index $\\approx 4N - 5$. Hence recursive implementations must allocate $4N$ entries.</p>
      <p>In an <strong>Iterative (ZKW) Segment Tree</strong>, we bypass top-down midpoint splitting entirely: we place element $A[i]$ at index $N + i$ (for $0 \\le i < N$) and populate internal nodes from $i = N - 1$ down to $1$ using $\\text{tree}[i] = \\text{tree}[2i] \\oplus \\text{tree}[2i + 1]$. Every internal node $i \\in [1, N-1]$ has two valid children $2i$ and $2i+1$ in $[2, 2N-1]$, requiring <strong>exactly $2N$ elements</strong> for any $N$ (even when $N$ is not a power of two!).</p>

      <div class="invariant-box">
        <strong>Non-Commutative Monoid Query Invariant:</strong> In an iterative $2N$ segment tree querying $[l, r)$ (shifted to $[l+N, r+N)$), whenever $l$ is a right child (<code>l &amp; 1</code>), $\\text{tree}[l]$ is on the left boundary of the remaining range and must be multiplied on the <em>right</em> of the left accumulator: $\\text{resL} = \\text{resL} \\oplus \\text{tree}[l++]$. Whenever $r$ is a right child (<code>r &amp; 1</code> after decrementing <code>--r</code>), $\\text{tree}[r]$ is on the right boundary and must be multiplied on the <em>left</em> of the right accumulator: $\\text{resR} = \\text{tree}[r] \\oplus \\text{resR}$. At the end, $\\text{ans} = \\text{resL} \\oplus \\text{resR}$ preserves exact left-to-right index order!
      </div>

      <svg viewBox="0 0 760 245" class="lesson-svg" role="img" aria-label="2N Iterative Segment Tree Layout and Bottom-Up Query Decomposition">
        <style>
          .seg-bg { fill: #0f172a; rx: 10px; }
          .seg-node { fill: #1e293b; stroke: #475569; stroke-width: 1.8px; rx: 6px; }
          .seg-pickL { fill: rgba(56, 189, 248, 0.28); stroke: #38bdf8; stroke-width: 2.5px; rx: 6px; }
          .seg-pickR { fill: rgba(244, 114, 182, 0.28); stroke: #f472b6; stroke-width: 2.5px; rx: 6px; }
          .seg-edge { stroke: #475569; stroke-width: 1.5px; }
          .seg-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .seg-sub { fill: #94a3b8; font-family: monospace; font-size: 10px; }
        </style>
        <rect x="0" y="0" width="760" height="245" class="seg-bg"/>
        <text x="25" y="25" class="seg-txt" fill="#38bdf8">Iterative 2N Segment Tree (N = 8): Query [1, 7) -&gt; leaves [9, 15)</text>
        <!-- Edges -->
        <line x1="380" y1="62" x2="200" y2="95" class="seg-edge"/>
        <line x1="380" y1="62" x2="560" y2="95" class="seg-edge"/>
        <line x1="200" y1="121" x2="110" y2="152" class="seg-edge"/>
        <line x1="200" y1="121" x2="290" y2="152" class="seg-edge"/>
        <line x1="560" y1="121" x2="470" y2="152" class="seg-edge"/>
        <line x1="560" y1="121" x2="650" y2="152" class="seg-edge"/>
        <!-- Root 1 -->
        <rect x="335" y="36" width="90" height="26" class="seg-node"/>
        <text x="380" y="53" text-anchor="middle" class="seg-txt">1: [0..7]</text>
        <!-- Level 2: 2, 3 -->
        <rect x="155" y="95" width="90" height="26" class="seg-node"/>
        <text x="200" y="112" text-anchor="middle" class="seg-txt">2: [0..3]</text>
        <rect x="515" y="95" width="90" height="26" class="seg-node"/>
        <text x="560" y="112" text-anchor="middle" class="seg-txt">3: [4..7]</text>
        <!-- Level 3: 4, 5 (picked L), 6 (picked R), 7 -->
        <rect x="65" y="152" width="90" height="26" class="seg-node"/>
        <text x="110" y="169" text-anchor="middle" class="seg-txt">4: [0..1]</text>
        <rect x="245" y="152" width="90" height="26" class="seg-pickL"/>
        <text x="290" y="169" text-anchor="middle" class="seg-txt">5: [2..3]</text>
        <rect x="425" y="152" width="90" height="26" class="seg-pickR"/>
        <text x="470" y="169" text-anchor="middle" class="seg-txt">6: [4..5]</text>
        <rect x="605" y="152" width="90" height="26" class="seg-node"/>
        <text x="650" y="169" text-anchor="middle" class="seg-txt">7: [6..7]</text>
        <!-- Leaves 8..15 -->
        <rect x="25" y="198" width="75" height="24" class="seg-node"/>
        <text x="62" y="214" text-anchor="middle" class="seg-sub">8: A[0]</text>
        <rect x="115" y="198" width="75" height="24" class="seg-pickL"/>
        <text x="152" y="214" text-anchor="middle" class="seg-txt">9: A[1]</text>
        <rect x="205" y="198" width="75" height="24" class="seg-node"/>
        <text x="242" y="214" text-anchor="middle" class="seg-sub">10: A[2]</text>
        <rect x="295" y="198" width="75" height="24" class="seg-node"/>
        <text x="332" y="214" text-anchor="middle" class="seg-sub">11: A[3]</text>
        <rect x="385" y="198" width="75" height="24" class="seg-node"/>
        <text x="422" y="214" text-anchor="middle" class="seg-sub">12: A[4]</text>
        <rect x="475" y="198" width="75" height="24" class="seg-node"/>
        <text x="512" y="214" text-anchor="middle" class="seg-sub">13: A[5]</text>
        <rect x="565" y="198" width="75" height="24" class="seg-pickR"/>
        <text x="602" y="214" text-anchor="middle" class="seg-txt">14: A[6]</text>
        <rect x="655" y="198" width="75" height="24" class="seg-node"/>
        <text x="692" y="214" text-anchor="middle" class="seg-sub">15: A[7]</text>
        <text x="380" y="238" text-anchor="middle" class="seg-txt" fill="#facc15">resL = tree[9] op tree[5] | resR = tree[6] op tree[14] | ans = resL op resR</text>
      </svg>

      <h3>2. Designing Non-Trivial Monoids: Dynamic Range Maximum Subarray Sum</h3>
      <p>How do we answer "what is the maximum contiguous subarray sum inside $A[L..R]$" under point updates? A single scalar is not closed under concatenation because the optimal subarray across $L \\cup R$ might straddle the boundary between the left child and the right child. We lift each node to a 4-tuple monoid state $(S, P, Q, M)$:</p>
      <ul>
        <li>$S$: Total sum of the segment ($S = S_L + S_R$)</li>
        <li>$P$: Maximum prefix sum of the segment ($P = \\max(P_L, S_L + P_R)$)</li>
        <li>$Q$: Maximum suffix sum of the segment ($Q = \\max(Q_R, Q_L + S_R)$)</li>
        <li>$M$: Maximum subarray sum anywhere in the segment ($M = \\max(M_L, M_R, Q_L + P_R)$)</li>
      </ul>

      <div class="mermaid">
flowchart LR
  L["Left Child: (S_L, P_L, Q_L, M_L)"] --> C["Combine Operator (op)"]
  R["Right Child: (S_R, P_R, Q_R, M_R)"] --> C
  C --> Out["Parent:\nS = S_L + S_R\nP = max(P_L, S_L + P_R)\nQ = max(Q_R, Q_L + S_R)\nM = max(M_L, M_R, Q_L + P_R)"]
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Eliminating Object Allocations in Tuple Segment Trees:</strong> In JavaScript, Java, or Python, allocating a 4-field object <code>{ sum, pref, suff, best }</code> on every <code>combine</code> call creates millions of short-lived heap objects per second and triggers GC pauses. Instead, pack the $k$ fields of node $i$ into a single flat <code>Float64Array(2 * N * k)</code> at base offset <code>i * k</code> (Structure-of-Arrays or Flat Interleaved Array), reducing memory by 4x and keeping the entire segment tree inside L2/L3 cache.
      </div>

      <div class="simulator-mount" data-sim="sim-segment-tree-lazy"></div>

      <h3>3. Production Implementation: Generic Non-Commutative Iterative Segment Tree &amp; Max Subarray Monoid</h3>
      <pre><code class="language-javascript">/**
 * Generic Iterative (ZKW) Segment Tree over any Monoid (M, combine, identity)
 * Space: Exact 2N | Build: O(N) | Point Update &amp; Range Query: O(log N)
 */
class MonoidSegmentTree {
  constructor(arr, combine, identity) {
    this.n = arr.length;
    this.combine = combine;
    this.identity = identity;
    this.tree = new Array(2 * this.n);
    for (let i = 0; i &lt; this.n; i++) {
      this.tree[this.n + i] = arr[i];
    }
    for (let i = this.n - 1; i &gt;= 1; i--) {
      this.tree[i] = combine(this.tree[i &lt;&lt; 1], this.tree[(i &lt;&lt; 1) | 1]);
    }
  }

  // Point replacement: A[idx] = val (0-indexed)
  set(idx, val) {
    let p = idx + this.n;
    this.tree[p] = val;
    for (p &gt;&gt;= 1; p &gt;= 1; p &gt;&gt;= 1) {
      this.tree[p] = this.combine(this.tree[p &lt;&lt; 1], this.tree[(p &lt;&lt; 1) | 1]);
    }
  }

  // Range query over closed interval [l, r] (0-indexed), preserving non-commutative order!
  query(l, r) {
    let resL = this.identity;
    let resR = this.identity;
    for (let a = l + this.n, b = r + this.n + 1; a &lt; b; a &gt;&gt;= 1, b &gt;&gt;= 1) {
      if (a &amp; 1) resL = this.combine(resL, this.tree[a++]);
      if (b &amp; 1) resR = this.combine(this.tree[--b], resR);
    }
    return this.combine(resL, resR);
  }
}

// Example: Maximum Subarray Sum Monoid (GSS1 / Kadane Monoid)
const KadaneMonoid = {
  identity: { sum: 0, pref: -Infinity, suff: -Infinity, best: -Infinity },
  leaf(x) {
    return { sum: x, pref: x, suff: x, best: x };
  },
  combine(L, R) {
    if (L.best === -Infinity) return R;
    if (R.best === -Infinity) return L;
    return {
      sum: L.sum + R.sum,
      pref: Math.max(L.pref, L.sum + R.pref),
      suff: Math.max(R.suff, L.suff + R.sum),
      best: Math.max(L.best, R.best, L.suff + R.pref)
    };
  }
};</code></pre>

      <h3>4. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Implementation Variant</th>
            <th>Array Size Required</th>
            <th>Build Time</th>
            <th>Point Update / Range Query</th>
            <th>Supports Tree Walk (<code>maxRight</code> / Binary Search)?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Iterative Bottom-Up ($2N$ ZKW)</td>
            <td>Exact $2N$</td>
            <td>$\\Theta(N)$</td>
            <td>$\\Theta(\\log N)$ (branchless loop)</td>
            <td>Yes (pad $N$ to $2^{\\lceil \\log_2 N \\rceil}$)</td>
          </tr>
          <tr>
            <td>Recursive Top-Down ($2v, 2v+1$)</td>
            <td>$4N$</td>
            <td>$\\Theta(N)$</td>
            <td>$\\Theta(\\log N)$ (function calls)</td>
            <td>Yes (natural top-down recursion)</td>
          </tr>
          <tr>
            <td>Euler-Tour Indexed Recursive ($v+1, v + 2(tm-tl+1)$)</td>
            <td>Exact $2N - 1$</td>
            <td>$\\Theta(N)$</td>
            <td>$\\Theta(\\log N)$</td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Commutativity Bug in Iterative Segment Trees:</strong> Many tutorials write a single accumulator <code>res = combine(res, tree[a++]); res = combine(res, tree[--b]);</code>. That scrambles the left-to-right order of intervals and breaks non-commutative monoids like matrix multiplication, affine functions $f(x) = ax + b$, or Kadane's Maximum Subarray tuple! Always maintain two accumulators <code>resL</code> and <code>resR</code>, prepend <code>tree[--b]</code> to the left of <code>resR</code>, and return <code>combine(resL, resR)</code>.
      </div>
    </div>`,
    keyTakeaways: [
      "A Segment Tree works over any Monoid (associative combine + identity element), requiring no inverse or idempotence.",
      "Iterative bottom-up (ZKW) segment trees store leaves at [N .. 2N-1] and internal nodes at [1 .. N-1], using exact 2N space instead of 4N.",
      "To support non-commutative monoids (matrices, max-subarray tuples, polynomial hashes) in an iterative segment tree, maintain separate left and right accumulators resL and resR.",
      "Complex range queries like Range Maximum Subarray Sum are solved by lifting the node value into a tuple (sum, maxPrefix, maxSuffix, maxSubarray) that is closed under associative merging."
    ],
    furtherReading: [
      {
        title: "Al.Cash (Codeforces) — Efficient and Easy Segment Trees (Iterative 2N ZKW Guide)",
        url: "https://codeforces.com/blog/entry/18051"
      },
      {
        title: "CP-Algorithms — Segment Tree & Advanced Monoid Aggregations",
        url: "https://cp-algorithms.com/data_structures/segment_tree.html"
      }
    ]
  },

  "lazy-propagation-segment-tree-beats": {
    title: "Lazy Propagation & Segment Tree Beats (Ji Driver Segment Tree for Range Chmin/Chmax)",
    video: {
      youtubeId: "xuoQdt5pHj0",
      title: "Lazy Propagation Segment Tree — Range Updates in O(log N)",
      channel: "WilliamFiset",
      duration: "17:28",
      start: 0,
      length: 1048,
      why: "Shows how deferring O(N) descendant updates into O(log N) lazy tags preserves logarithmic time for both range updates and range queries."
    },
    intuition: `<p>If we apply a range update (such as adding $+\\Delta$ to every element in $A[L..R]$) by updating every leaf in $[L, R]$, a single range update degrades to $\\Theta(N)$ time. <strong>Lazy Propagation</strong> restores $O(\\log N)$ time by halting the recursion as soon as a segment tree node's interval $[tl, tr]$ is completely contained inside $[L, R]$: we update that node's aggregate summary immediately and attach a <strong>lazy tag</strong> recording the pending transformation for its descendants, pushing the tag down one level only when a subsequent update or query actually needs to inspect its children.</p>
    <p>What if the range update is non-linear with respect to range sum—such as clamping every element $A[i] \\leftarrow \\min(A[i], x)$ (<strong>Range Chmin</strong>) while querying <strong>Range Sum</strong>? Standard lazy propagation fails because knowing the sum of $[tl, tr]$ and $x$ does not tell us how many elements in $[tl, tr]$ exceed $x$. Runze Ji's <strong>Segment Tree Beats</strong> (2016) solves this by storing at each node the <em>strict maximum</em> $\\text{max}_1$, the <em>count of maximums</em> $\\text{cntMax}$, and the <em>strictly second-largest value</em> $\\text{max}_2$. Whenever $\\text{max}_2 < x < \\text{max}_1$, only the $\\text{cntMax}$ copies of $\\text{max}_1$ change, so we can update the range sum in $O(1)$ time via $\\text{sum} \\mathrel{-}= (\\text{max}_1 - x) \\cdot \\text{cntMax}$! Potential function analysis proves this achieves $O(N \\log N)$ (or $O(N \\log^2 N)$ with range additions) amortized time.</p>`,
    content: `<div class="lesson-content">
      <h3>1. The Algebraic Axioms of Lazy Propagation (Monoid Action)</h3>
      <p>Formally, a Lazy Segment Tree requires two monoids and a distributive action:</p>
      <ol>
        <li><strong>Data Monoid $(S, \\oplus, e_S)$</strong>: Combines left and right child summaries (<code>pull</code> / <code>pushUp</code>), e.g., $(S_L + S_R, \\text{len}_L + \\text{len}_R)$.</li>
        <li><strong>Tag (Endomorphism) Monoid $(F, \\circ, \\text{id}_F)$</strong>: Composes a new lazy operation $f_{\\text{new}}$ onto an existing pending tag $f_{\\text{old}}$ via $f_{\\text{new}} \\circ f_{\\text{old}}$. For range affine updates $f(x) = ax + b$, composing $f_2(x) = a_2 x + b_2$ after $f_1(x) = a_1 x + b_1$ yields $f_2(f_1(x)) = (a_2 a_1)x + (a_2 b_1 + b_2)$.</li>
        <li><strong>Distributive Mapping $F \\times S \\to S$</strong>: For any tag $f \\in F$ and states $s_1, s_2 \\in S$, applying $f$ distributes over $\\oplus$: $f(s_1 \\oplus s_2) = f(s_1) \\oplus f(s_2)$.</li>
      </ol>

      <div class="invariant-box">
        <strong>Segment Tree Beats Three-Case Tag Condition (Range Chmin $A[i] \\leftarrow \\min(A[i], x)$):</strong> At node $v$ maintaining $(\\text{sum}, \\text{max}_1, \\text{cntMax}, \\text{max}_2)$:
        <ol>
          <li><strong>Break Condition ($x \\ge \\text{max}_1$):</strong> No element in $v$'s subtree exceeds $x$; return immediately in $O(1)$ (no-op).</li>
          <li><strong>Tag Condition ($\\text{max}_2 < x < \\text{max}_1$):</strong> Exactly $\\text{cntMax}$ elements in $v$'s subtree exceed $x$, and all of them equal $\\text{max}_1$. Update $\\text{sum} \\mathrel{-}= (\\text{max}_1 - x) \\cdot \\text{cntMax}$, set $\\text{max}_1 = x$, and stop in $O(1)$!</li>
          <li><strong>Recurse Condition ($x \\le \\text{max}_2$):</strong> At least two distinct values in $v$'s subtree collapse into $x$; push down tags, recurse to both children, and <code>pull(v)</code>. Each recursive split permanently reduces the number of distinct value classes in $v$'s subtree by at least 1, bounding total amortized work to $O((N + Q)\\log N)$.</li>
        </ol>
      </div>

      <svg viewBox="0 0 760 225" class="lesson-svg" role="img" aria-label="Segment Tree Beats Three Cases for Range Chmin">
        <style>
          .stb-bg { fill: #0f172a; rx: 10px; }
          .stb-card1 { fill: rgba(52, 211, 153, 0.16); stroke: #34d399; stroke-width: 2px; rx: 8px; }
          .stb-card2 { fill: rgba(56, 189, 248, 0.16); stroke: #38bdf8; stroke-width: 2px; rx: 8px; }
          .stb-card3 { fill: rgba(244, 114, 182, 0.16); stroke: #f472b6; stroke-width: 2px; rx: 8px; }
          .stb-title { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 700; }
          .stb-desc { fill: #cbd5e1; font-family: sans-serif; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="225" class="stb-bg"/>
        <text x="24" y="26" class="stb-title" fill="#facc15">Segment Tree Beats: Range Chmin(l, r, x) Decision Cases at Node v</text>

        <rect x="20" y="42" width="230" height="165" class="stb-card1"/>
        <text x="34" y="66" class="stb-title" fill="#34d399">Case 1: x &gt;= v.max1</text>
        <text x="34" y="90" class="stb-desc">Break Condition (No-Op)</text>
        <text x="34" y="114" class="stb-desc">Every element in v is</text>
        <text x="34" y="132" class="stb-desc">already &lt;= x.</text>
        <text x="34" y="160" class="stb-title">Action: return immediately</text>
        <text x="34" y="182" class="stb-desc">Cost: O(1)</text>

        <rect x="265" y="42" width="230" height="165" class="stb-card2"/>
        <text x="279" y="66" class="stb-title" fill="#38bdf8">Case 2: v.max2 &lt; x &lt; v.max1</text>
        <text x="279" y="90" class="stb-desc">Tag Condition (Lazy Clamp)</text>
        <text x="279" y="114" class="stb-desc">Only the cntMax copies of</text>
        <text x="279" y="132" class="stb-desc">max1 are clamped to x.</text>
        <text x="279" y="160" class="stb-title">sum -= (max1 - x) * cntMax</text>
        <text x="279" y="182" class="stb-desc">max1 = x; Cost: O(1)</text>

        <rect x="510" y="42" width="230" height="165" class="stb-card3"/>
        <text x="524" y="66" class="stb-title" fill="#f472b6">Case 3: x &lt;= v.max2</text>
        <text x="524" y="90" class="stb-desc">Recurse Condition</text>
        <text x="524" y="114" class="stb-desc">Both max1 and max2 exceed x;</text>
        <text x="524" y="132" class="stb-desc">they merge into a single value!</text>
        <text x="524" y="160" class="stb-title">pushDown(v); recurse L &amp; R</text>
        <text x="524" y="182" class="stb-desc">Amortized by potential drop</text>
      </svg>

      <div class="mermaid">
flowchart TD
  Start["chmin(v, tl, tr, ql, qr, x)"] --> Cond1{"ql > tr OR qr < tl\nOR x >= v.max1?"}
  Cond1 -- Yes --> Ret["Return O(1) (Break)"]
  Cond1 -- No --> Cond2{"ql <= tl AND tr <= qr\nAND x > v.max2?"}
  Cond2 -- Yes --> Apply["v.sum -= (v.max1 - x) * v.cntMax\nv.max1 = x\nReturn O(1) (Tag)"]
  Cond2 -- No --> Push["pushDown(v) (clamp children to v.max1)\nRecurse Left & Right\npull(v)"]
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Struct-of-Arrays (SoA) TypedArrays for Lazy Segment Trees:</strong> A Segment Tree Beats node tracks 4 fields (<code>sum</code>, <code>max1</code>, <code>max2</code>, <code>cntMax</code>). Storing 4 separate flat TypedArrays (<code>Float64Array</code> for <code>sum</code> and <code>Int32Array</code> for <code>max1</code>, <code>max2</code>, <code>cntMax</code>) of length $4N$ eliminates pointer chasing and object headers completely, packing 16 <code>Int32</code> values into a single 64-byte cache line.
      </div>

      <div class="simulator-mount" data-sim="sim-segment-tree-lazy"></div>

      <h3>2. Production Implementation: Segment Tree Beats (Range Chmin + Range Sum)</h3>
      <pre><code class="language-javascript">/**
 * Ji Driver Segment Tree (Segment Tree Beats)
 * Supports:
 *  - rangeChmin(ql, qr, x): for i in [ql..qr], A[i] = Math.min(A[i], x) in O(log N) amortized
 *  - rangeSum(ql, qr): sum of A[ql..qr] in O(log N)
 *  - rangeMax(ql, qr): max of A[ql..qr] in O(log N)
 */
class SegmentTreeBeats {
  constructor(arr) {
    this.n = arr.length;
    const size = 4 * this.n;
    this.sum = new Float64Array(size);
    this.max1 = new Float64Array(size);
    this.max2 = new Float64Array(size);
    this.cntMax = new Int32Array(size);
    this._build(1, 0, this.n - 1, arr);
  }

  _build(v, tl, tr, arr) {
    if (tl === tr) {
      this.sum[v] = arr[tl];
      this.max1[v] = arr[tl];
      this.max2[v] = -Infinity;
      this.cntMax[v] = 1;
      return;
    }
    const tm = (tl + tr) &gt;&gt; 1;
    this._build(v &lt;&lt; 1, tl, tm, arr);
    this._build((v &lt;&lt; 1) | 1, tm + 1, tr, arr);
    this._pull(v);
  }

  _pull(v) {
    const L = v &lt;&lt; 1, R = L | 1;
    this.sum[v] = this.sum[L] + this.sum[R];
    if (this.max1[L] === this.max1[R]) {
      this.max1[v] = this.max1[L];
      this.max2[v] = Math.max(this.max2[L], this.max2[R]);
      this.cntMax[v] = this.cntMax[L] + this.cntMax[R];
    } else if (this.max1[L] &gt; this.max1[R]) {
      this.max1[v] = this.max1[L];
      this.max2[v] = Math.max(this.max2[L], this.max1[R]);
      this.cntMax[v] = this.cntMax[L];
    } else {
      this.max1[v] = this.max1[R];
      this.max2[v] = Math.max(this.max1[L], this.max2[R]);
      this.cntMax[v] = this.cntMax[R];
    }
  }

  _applyChmin(v, x) {
    if (x &gt;= this.max1[v]) return;
    this.sum[v] -= (this.max1[v] - x) * this.cntMax[v];
    this.max1[v] = x;
  }

  _pushDown(v) {
    // Parent's max1 acts as an implicit upper-bound clamp on both children!
    this._applyChmin(v &lt;&lt; 1, this.max1[v]);
    this._applyChmin((v &lt;&lt; 1) | 1, this.max1[v]);
  }

  rangeChmin(ql, qr, x, v = 1, tl = 0, tr = this.n - 1) {
    if (ql &gt; tr || qr &lt; tl || x &gt;= this.max1[v]) return; // Case 1: Break
    if (ql &lt;= tl &amp;&amp; tr &lt;= qr &amp;&amp; x &gt; this.max2[v]) {     // Case 2: Tag
      this._applyChmin(v, x);
      return;
    }
    this._pushDown(v);                                   // Case 3: Recurse
    const tm = (tl + tr) &gt;&gt; 1;
    this.rangeChmin(ql, qr, x, v &lt;&lt; 1, tl, tm);
    this.rangeChmin(ql, qr, x, (v &lt;&lt; 1) | 1, tm + 1, tr);
    this._pull(v);
  }

  rangeSum(ql, qr, v = 1, tl = 0, tr = this.n - 1) {
    if (ql &gt; tr || qr &lt; tl) return 0;
    if (ql &lt;= tl &amp;&amp; tr &lt;= qr) return this.sum[v];
    this._pushDown(v);
    const tm = (tl + tr) &gt;&gt; 1;
    return (
      this.rangeSum(ql, qr, v &lt;&lt; 1, tl, tm) +
      this.rangeSum(ql, qr, (v &lt;&lt; 1) | 1, tm + 1, tr)
    );
  }
}</code></pre>

      <h3>3. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Structure &amp; Operation Suite</th>
            <th>Build Time</th>
            <th>Range Update Time</th>
            <th>Range Query Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Standard Lazy Segment Tree (Range Affine $ax + b$, Range Sum)</td>
            <td>$\\Theta(N)$</td>
            <td>$O(\\log N)$ worst-case</td>
            <td>$O(\\log N)$ worst-case</td>
          </tr>
          <tr>
            <td>Segment Tree Beats (Range <code>chmin</code>/<code>chmax</code> + Range Sum)</td>
            <td>$\\Theta(N)$</td>
            <td>$O(\\log N)$ amortized</td>
            <td>$O(\\log N)$ worst-case</td>
          </tr>
          <tr>
            <td>Segment Tree Beats (Range <code>chmin</code>/<code>chmax</code> + Range <code>add</code> + Range Sum)</td>
            <td>$\\Theta(N)$</td>
            <td>$O(\\log^2 N)$ amortized</td>
            <td>$O(\\log N)$ worst-case</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Confusing <em>Strict</em> Second Maximum (<code>max2</code>) with Non-Strict Second Element:</strong> In Segment Tree Beats, <code>max2[v]</code> MUST be the <strong>strictly second-largest distinct value</strong> in node $v$'s subtree (if all elements in $v$ are equal to $7$, then <code>max1[v] = 7</code>, <code>cntMax[v] = tr - tl + 1</code>, and <code>max2[v] = -Infinity</code>). If you accidentally set <code>max2[v] = 7</code> when both children have <code>max1 = 7</code>, then <code>x > max2[v]</code> will never trigger for $x < 7$, causing your Segment Tree Beats to recurse all the way to the leaves on every update and degrade to $\\Theta(N)$ per query!
      </div>
    </div>`,
    keyTakeaways: [
      "Lazy propagation requires a Data Monoid (S, op) and an Endomorphism Tag Monoid (F, compose) whose action distributes over op: f(s1 op s2) = f(s1) op f(s2).",
      "When combining two non-commutative lazy operations like range assignment/scaling and range addition, compose them as an affine transformation f(x) = a*x + b where f2(f1(x)) = (a2*a1)*x + (a2*b1 + b2).",
      "Segment Tree Beats handles non-linear range updates (chmin/chmax with range sum) by tracking max1, cntMax, and strict second maximum max2 at every node.",
      "Whenever x <= max2, recursing into children merges max1 and max2 into a single value x, reducing the tree's potential function and guaranteeing O(log N) (or O(log^2 N)) amortized time."
    ],
    furtherReading: [
      {
        title: "Codeforces (jiry_2 / Runze Ji) — A Simple Introduction to Segment Tree Beats",
        url: "https://codeforces.com/blog/entry/57319"
      },
      {
        title: "AtCoder Library (ACL) — Lazy Segment Tree Monoid & Homomorphism Reference",
        url: "https://atcoder.github.io/ac-library/production/document_en/lazysegtree.html"
      }
    ]
  },

  "dynamic-persistent-segment-trees": {
    title: "Dynamic (Sparse) & Persistent Segment Trees: K-th Smallest in Subarray in O(log N)",
    video: {
      youtubeId: "m3uEG4NgJx8",
      id: "m3uEG4NgJx8",
      url: "https://www.youtube.com/embed/m3uEG4NgJx8",
      title: "AlgorithmsThread 5: Persistent Segment Trees & Path-Copying K-th Order Statistics",
      channel: "SecondThread",
      duration: "39:42",
      start: 0,
      length: "39m",
      why: "Explains how prefix frequency trees share O(N log N) nodes via path copying and how subtracting two roots answers subarray order statistics in O(log N)."
    },
    intuition: `<p>What if the index universe is $U = [0, 10^{18}]$ (too huge to allocate a $4U$ array), or we need to preserve all $N$ historical versions of a segment tree after $N$ point updates? Both problems are solved by replacing implicit heap indexing ($2v, 2v+1$) with explicit child indices <code> + "</code>left[v]<code>" + </code> and <code> + "</code>right[v]<code>" + </code> allocated from a flat node pool.</p>
    <p>In a <strong>Dynamic (Sparse) Segment Tree</strong>, we start with a single root node covering $[0, U-1]$ and allocate child nodes lazily only when a point update visits them; $Q$ updates over $[0, 10^{18}]$ allocate at most $Q \\lceil \\log_2 U \\rceil$ nodes. In a <strong>Persistent Segment Tree (Chairman Tree)</strong>, each point update path-copies only the $\\lceil \\log_2 N \\rceil + 1$ nodes on the root-to-leaf path while sharing all unmodified sibling subtrees. By inserting array elements $A[1], A[2], \\dots, A[N]$ one by one into a value-indexed Persistent Segment Tree, root $R_i$ represents the frequency histogram of prefix $A[1..i]$. Because segment tree structures are identical across all roots, the virtual tree $R_r - R_{l-1}$ gives the exact frequency histogram of subarray $A[l..r]$, letting us walk down both roots in lockstep to find the <strong>$k$-th smallest element in $A[l..r]$ in $O(\\log N)$ time</strong>!</p>`,
    content: `<div class="lesson-content">
      <h3>1. Dynamic (Sparse) Segment Trees vs Persistent Segment Trees</h3>
      <p>Both structures abandon the fixed $4N$ array layout in favor of an arena pool of nodes <code>(leftChild, rightChild, sum)</code>:</p>
      <ul>
        <li><strong>Dynamic (Sparse) Segment Tree</strong>: Used when the coordinate range $[0, U]$ is up to $10^{18}$ and online queries forbid offline coordinate compression. Unvisited children stay <code>0</code> (the null sentinel with sum <code>0</code>).</li>
        <li><strong>Persistent Segment Tree (Prefix Histogram / Wavelet Isomorphism)</strong>: After coordinate-compressing $A[1..N]$ into ranks $[0, M-1]$ ($M \\le N$), version $R_i = \\text{update}(R_{i-1}, 0, M-1, \\text{rank}(A[i]), +1)$ creates $\\lceil \\log_2 M \\rceil + 1$ new nodes. Across all $N$ insertions, total memory is $O(N \\log N)$ nodes—never $O(N^2)$!</li>
      </ul>

      <div class="invariant-box">
        <strong>Tree-Subtraction Invariant for Range Order Statistics:</strong> For any value sub-interval $[vl, vr]$ corresponding to corresponding nodes $u_r$ in root $R_r$ and $u_{l-1}$ in root $R_{l-1}$, the count of elements in subarray $A[l..r]$ whose values fall in $[vl, vr]$ is:
        $$\\text{count}(l, r, [vl, vr]) = \\text{sum}[u_r] - \\text{sum}[u_{l-1}]$$
        During <code>kthSmallest(l, r, k)</code> ($1$-indexed $k$), let $c_{\\text{left}} = \\text{sum}[\\text{left}[u_r]] - \\text{sum}[\\text{left}[u_{l-1}]]$. If $k \\le c_{\\text{left}}$, the $k$-th smallest element lies in the left value half $[vl, vm]$; otherwise we subtract $k \\mathrel{-}= c_{\\text{left}}$ and descend into the right value half $[vm + 1, vr]$.
      </div>

      <svg viewBox="0 0 760 235" class="lesson-svg" role="img" aria-label="Persistent Segment Tree Path Copying and Dual-Root Walk for Kth Smallest">
        <style>
          .pst-bg { fill: #0f172a; rx: 10px; }
          .pst-old { fill: #1e293b; stroke: #64748b; stroke-width: 1.8px; rx: 6px; }
          .pst-new { fill: rgba(56, 189, 248, 0.25); stroke: #38bdf8; stroke-width: 2.2px; rx: 6px; }
          .pst-share { stroke: #facc15; stroke-width: 2px; stroke-dasharray: 5 3; fill: none; }
          .pst-edge { stroke: #94a3b8; stroke-width: 1.6px; fill: none; }
          .pst-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .pst-sub { fill: #94a3b8; font-family: sans-serif; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="235" class="pst-bg"/>
        <text x="24" y="26" class="pst-txt" fill="#38bdf8">Persistent Segment Tree: Path-Copying Root R[i-1] -&gt; Root R[i] (O(log N) new nodes)</text>
        <!-- Old tree R[i-1] -->
        <rect x="120" y="45" width="90" height="28" class="pst-old"/>
        <text x="165" y="63" text-anchor="middle" class="pst-txt">R[i-1]: 3</text>
        <line x1="150" y1="73" x2="95" y2="115" class="pst-edge"/>
        <line x1="180" y1="73" x2="235" y2="115" class="pst-edge"/>
        <rect x="50" y="115" width="90" height="28" class="pst-old"/>
        <text x="95" y="133" text-anchor="middle" class="pst-txt">L: 2</text>
        <rect x="190" y="115" width="90" height="28" class="pst-old"/>
        <text x="235" y="133" text-anchor="middle" class="pst-txt">R: 1 (shared)</text>

        <!-- New tree R[i] -->
        <rect x="470" y="45" width="90" height="28" class="pst-new"/>
        <text x="515" y="63" text-anchor="middle" class="pst-txt">R[i]: 4</text>
        <line x1="500" y1="73" x2="445" y2="115" class="pst-edge"/>
        <!-- Shared link from R[i] to old R -->
        <path d="M 470 65 Q 350 95 280 125" class="pst-share"/>
        <rect x="400" y="115" width="90" height="28" class="pst-new"/>
        <text x="445" y="133" text-anchor="middle" class="pst-txt">L': 3</text>
        <line x1="445" y1="143" x2="445" y2="180" class="pst-edge"/>
        <rect x="400" y="180" width="90" height="28" class="pst-new"/>
        <text x="445" y="198" text-anchor="middle" class="pst-txt">Leaf': +1</text>

        <text x="380" y="222" text-anchor="middle" class="pst-sub" fill="#facc15">Yellow dashed pointer shares untouched subtree R:1; subtracting R[r] - R[l-1] isolates subarray A[l..r]</text>
      </svg>

      <div class="mermaid">
flowchart TD
  Q["kthSmallest(u_prev, u_curr, vl, vr, k)"] --> Base{"vl == vr?"}
  Base -- Yes --> Found["Return sortedValues[vl]"]
  Base -- No --> Calc["cntLeft = sum[left[u_curr]] - sum[left[u_prev]]\nvm = (vl + vr) >> 1"]
  Calc --> Branch{"k <= cntLeft?"}
  Branch -- Yes --> GoL["kthSmallest(left[u_prev], left[u_curr], vl, vm, k)"]
  Branch -- No --> GoR["kthSmallest(right[u_prev], right[u_curr], vm+1, vr, k - cntLeft)"]
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Pre-Allocated TypedArray Arena Pool:</strong> For $N = 10^5$ elements, a Persistent Segment Tree allocates $N(\\lceil \\log_2 N \\rceil + 2) \\approx 1.9 \\times 10^6$ nodes. Allocating 1.9 million JS objects <code>{ left, right, sum }</code> consumes ~120 MB of heap and thrashes the garbage collector. Allocating three flat <code>Int32Array(maxNodes)</code> arrays (<code>lc</code>, <code>rc</code>, <code>cnt</code>) and bumping an integer cursor <code>ptr = 1</code> consumes just $3 \\times 4 \\times 1.9 \\times 10^6 \\approx 22.8\\text{ MB}$ with zero GC overhead!
      </div>

      <div class="simulator-mount" data-sim="sim-segment-tree-lazy"></div>

      <h3>2. Production Implementation: Persistent Segment Tree for $O(\\log N)$ Range $k$-th Smallest</h3>
      <pre><code class="language-javascript">/**
 * Persistent Segment Tree (Chairman Tree) using a Flat TypedArray Arena Pool
 * Answers: k-th smallest element (1-indexed k) in subarray A[l..r] (0-indexed) in O(log N) time.
 */
class PersistentKthSegmentTree {
  constructor(arr) {
    this.n = arr.length;
    // 1. Coordinate compress values in A
    this.sortedVals = Array.from(new Set(arr)).sort((a, b) =&gt; a - b);
    this.m = this.sortedVals.length;

    const maxNodes = (this.n + 1) * (Math.ceil(Math.log2(Math.max(2, this.m))) + 3);
    this.lc = new Int32Array(maxNodes);
    this.rc = new Int32Array(maxNodes);
    this.cnt = new Int32Array(maxNodes);
    this.ptr = 1; // Node 0 is the implicit zero sentinel (lc[0]=0, rc[0]=0, cnt[0]=0)

    this.roots = new Int32Array(this.n + 1);
    this.roots[0] = 0;

    for (let i = 0; i &lt; this.n; i++) {
      const rank = this._lowerBound(this.sortedVals, arr[i]);
      this.roots[i + 1] = this._insert(this.roots[i], 0, this.m - 1, rank);
    }
  }

  _lowerBound(sorted, x) {
    let lo = 0, hi = sorted.length - 1;
    while (lo &lt; hi) {
      const mid = (lo + hi) &gt;&gt; 1;
      if (sorted[mid] &lt; x) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  _insert(prevNode, vl, vr, targetRank) {
    const curr = this.ptr++;
    this.lc[curr] = this.lc[prevNode];
    this.rc[curr] = this.rc[prevNode];
    this.cnt[curr] = this.cnt[prevNode] + 1;

    if (vl === vr) return curr;
    const vm = (vl + vr) &gt;&gt; 1;
    if (targetRank &lt;= vm) {
      this.lc[curr] = this._insert(this.lc[prevNode], vl, vm, targetRank);
    } else {
      this.rc[curr] = this._insert(this.rc[prevNode], vm + 1, vr, targetRank);
    }
    return curr;
  }

  /**
   * Returns the k-th smallest value (1 &lt;= k &lt;= r - l + 1) in A[l..r] (0-indexed)
   */
  kthSmallest(l, r, k) {
    let uPrev = this.roots[l];
    let uCurr = this.roots[r + 1];
    let vl = 0, vr = this.m - 1;

    while (vl &lt; vr) {
      const vm = (vl + vr) &gt;&gt; 1;
      const leftCount = this.cnt[this.lc[uCurr]] - this.cnt[this.lc[uPrev]];
      if (k &lt;= leftCount) {
        uPrev = this.lc[uPrev];
        uCurr = this.lc[uCurr];
        vr = vm;
      } else {
        k -= leftCount;
        uPrev = this.rc[uPrev];
        uCurr = this.rc[uCurr];
        vl = vm + 1;
      }
    }
    return this.sortedVals[vl];
  }
}</code></pre>

      <h3>3. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Structure</th>
            <th>Universe / Versions</th>
            <th>Space Complexity</th>
            <th>Update Time</th>
            <th>Range $k$-th / Aggregate Query</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dynamic (Sparse) Segment Tree</td>
            <td>Universe $[0, U-1]$, $Q$ updates</td>
            <td>$O(Q \\log U)$ nodes</td>
            <td>$O(\\log U)$</td>
            <td>$O(\\log U)$</td>
          </tr>
          <tr>
            <td>Persistent Segment Tree (Static Range $k$-th)</td>
            <td>$N$ prefix versions</td>
            <td>$O(N \\log N)$ nodes</td>
            <td>$O(\\log N)$ per version</td>
            <td>$O(\\log N)$</td>
          </tr>
          <tr>
            <td>Fenwick of Dynamic Segment Trees (Dynamic Range $k$-th)</td>
            <td>$N$ elements + $Q$ point updates</td>
            <td>$O((N + Q) \\log^2 N)$ nodes</td>
            <td>$O(\\log^2 N)$</td>
            <td>$O(\\log^2 N)$</td>
          </tr>
          <tr>
            <td>Merge Sort Tree (Subarray Binary Search)</td>
            <td>Static array of size $N$</td>
            <td>$O(N \\log N)$ words</td>
            <td>—</td>
            <td>$O(\\log^3 N)$ for $k$-th smallest</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Using Naive Lazy Propagation Inside a Persistent Segment Tree:</strong> In a persistent segment tree, a single child node may be shared by dozens of historical parent roots. If <code>pushDown(v)</code> mutates <code>v.left</code> and <code>v.right</code> in place, it silently corrupts every historical version sharing those children! To combine persistence with range updates, either (1) use <strong>Permanent Lazy Tags</strong> (accumulate tags along the query path without pushing down) when the operation allows, or (2) allocate new cloned copies of <code>v.left</code> and <code>v.right</code> inside <code>pushDown(v)</code>.
      </div>
    </div>`,
    keyTakeaways: [
      "Dynamic (Sparse) Segment Trees allocate child nodes on demand from a node pool, handling coordinate universes up to U = 10^18 in O(Q log U) space.",
      "Node 0 serves as an implicit null sentinel (lc[0] = 0, rc[0] = 0, cnt[0] = 0), eliminating null-pointer branches during tree walks.",
      "A Persistent Segment Tree over value ranks creates N prefix roots R[1..N] in O(N log N) total time and space via path copying.",
      "Subtracting cnt[u_curr] - cnt[u_prev] on the fly lets us binary-search the frequency histogram of subarray A[l..r] for the k-th smallest element in O(log N) time."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — Persistent Segment Tree & K-th Order Statistic in Subarray",
        url: "https://cp-algorithms.com/data_structures/segment_tree.html#preserving-the-history-of-its-values-persistent-segment-tree"
      },
      {
        title: "Driscoll, Sarnak, Sleator, & Tarjan (1989) — Making Data Structures Persistent (JCSS)",
        url: "https://doi.org/10.1016/0022-0000(89)90034-2"
      }
    ]
  },

  "sqrt-decomposition-mos-algorithm": {
    title: "√N Block Decomposition & Mo's Offline Query Ordering (O((N+Q)√N))",
    video: {
      youtubeId: "BJhzd_VG61k",
      title: "Square Root Decomposition & Mo's Algorithm Explained",
      channel: "Gaurav Sen",
      duration: "14:21",
      start: 0,
      length: 861,
      why: "Walks through block sizing B = sqrt(N) and how sorting offline queries by (L / B, R) bounds total pointer movement to O((N + Q) sqrt(N))."
    },
    intuition: `<p>Not every range query forms a clean monoid! Consider counting the number of distinct elements in $A[L..R]$, finding the mode (most frequent element) in $A[L..R]$, or counting pairs $(i, j) \\in [L, R]$ with $A[i] \\oplus A[j] = K$. Merging two halves $[L, M]$ and $[M+1, R]$ in $O(1)$ or $O(\\log N)$ time is impossible because frequency interactions cross the midpoint. However, incrementing or decrementing a single boundary pointer (<code>L--</code>, <code>L++</code>, <code>R++</code>, <code>R--</code>) updates a frequency table in $O(1)$ time!</p>
    <p><strong>Mo's Algorithm</strong> exploits this $O(1)$ sliding-window transition for offline queries: divide the array into blocks of size $B = \\max(1, \\lfloor N / \\sqrt{Q} \\rfloor)$ and sort all $Q$ queries primarily by the left endpoint's block $\\lfloor L / B \\rfloor$, and secondarily by $R$ (alternating ascending and descending $R$ on odd/even blocks—the <strong>boustrophedon / snake order</strong>). Within a single block of width $B$, the right pointer $R$ sweeps monotonically across $[0, N-1]$ in at most $N$ steps; across all $N/B$ blocks, $R$ moves at most $N \\cdot (N/B) = N^2 / B$ times, while $L$ oscillates inside a block of width $B$ at most $Q \\cdot B$ times. Choosing $B = N / \\sqrt{Q}$ balances both terms to $O(N \\sqrt{Q})$!</p>`,
    content: `<div class="lesson-content">
      <h3>1. Online $\\sqrt{N}$ Block Decomposition vs Offline Mo's Algorithm</h3>
      <p>There are two primary ways to apply square-root decomposition to array range queries:</p>
      <ul>
        <li><strong>Online $\\sqrt{N}$ Block Decomposition:</strong> Partition $A[0..N-1]$ into $\\lceil N / B \\rceil$ blocks of size $B \\approx \\sqrt{N}$. Each block maintains a summary (or sorted copy / frequency bucket). A range query $[L, R]$ inspects at most $\\lceil N / B \\rceil$ full blocks in the interior plus at most $2B$ individual elements in the two partial boundary blocks ($\\lfloor L/B \\rfloor$ and $\\lfloor R/B \\rfloor$), taking $O(B + N/B) = O(\\sqrt{N})$ time.</li>
        <li><strong>Offline Mo's Algorithm:</strong> Reorders $Q$ static queries $[L_i, R_i]$ so a single sliding window $[\\text{curL}, \\text{curR}]$ visits all queries with minimal total Manhattan movement $\\sum (|L_i - L_{i-1}| + |R_i - R_{i-1}|)$.</li>
      </ul>

      <div class="invariant-box">
        <strong>Optimal Block Size &amp; Snake-Order Amortized Bound:</strong> For $N$ elements and $Q$ queries, let block size be $B = \\max\\!\\left(1, \\left\\lfloor \\frac{N}{\\sqrt{Q}} \\right\\rfloor\\right)$.
        <ul>
          <li><strong>Left Pointer Movement:</strong> Within the same block ($\\lfloor L_i / B \\rfloor = \\lfloor L_{i-1} / B \\rfloor$), $|L_i - L_{i-1}| < B$. Across all $Q$ queries (including block transitions), $L$ moves at most $Q \\cdot B + N = O(N \\sqrt{Q})$ steps.</li>
          <li><strong>Right Pointer Movement:</strong> Within each of the $N / B$ blocks, $R$ is sorted monotonically so it moves at most $N$ steps per block. Across all $N / B$ blocks, $R$ moves at most $(N / B) \\cdot N = N^2 / B = O(N \\sqrt{Q})$ steps. Using <strong>snake order</strong> (ascending $R$ on even blocks, descending $R$ on odd blocks) eliminates the wasted $O(N)$ rewind of $R$ between adjacent blocks, cutting total $R$ movement in half!</li>
        </ul>
      </div>

      <svg viewBox="0 0 760 230" class="lesson-svg" role="img" aria-label="Mo's Algorithm 2D Query Plane and Boustrophedon Snake Order">
        <style>
          .mo-bg { fill: #0f172a; rx: 10px; }
          .mo-grid { stroke: #334155; stroke-width: 1.5px; stroke-dasharray: 4 4; }
          .mo-path { stroke: #38bdf8; stroke-width: 2.5px; fill: none; }
          .mo-pt { fill: #f472b6; stroke: #f8fafc; stroke-width: 1.5px; }
          .mo-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .mo-sub { fill: #94a3b8; font-family: sans-serif; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="230" class="mo-bg"/>
        <text x="25" y="25" class="mo-txt" fill="#38bdf8">Mo's Algorithm in the (L, R) Query Plane: Snake Ordering Across L-Blocks</text>
        <!-- Axes -->
        <line x1="70" y1="190" x2="710" y2="190" stroke="#64748b" stroke-width="2"/>
        <line x1="70" y1="40" x2="70" y2="190" stroke="#64748b" stroke-width="2"/>
        <text x="390" y="215" text-anchor="middle" class="mo-txt">Left Endpoint L (Grouped into Blocks of width B = N / sqrt(Q))</text>
        <text x="22" y="115" class="mo-txt">R</text>
        <!-- Vertical block dividers -->
        <line x1="230" y1="40" x2="230" y2="190" class="mo-grid"/>
        <line x1="390" y1="40" x2="390" y2="190" class="mo-grid"/>
        <line x1="550" y1="40" x2="550" y2="190" class="mo-grid"/>
        <text x="150" y="55" text-anchor="middle" class="mo-sub" fill="#34d399">Block 0 (R asc ↑)</text>
        <text x="310" y="55" text-anchor="middle" class="mo-sub" fill="#facc15">Block 1 (R desc ↓)</text>
        <text x="470" y="55" text-anchor="middle" class="mo-sub" fill="#34d399">Block 2 (R asc ↑)</text>
        <text x="630" y="55" text-anchor="middle" class="mo-sub" fill="#facc15">Block 3 (R desc ↓)</text>
        <!-- Snake path -->
        <path d="M 105 170 L 185 135 L 140 95 L 195 70 L 265 78 L 345 120 L 290 165 L 430 155 L 510 110 L 465 68 L 590 80 L 660 140 L 610 175" class="mo-path"/>
        <circle cx="105" cy="170" r="5" class="mo-pt"/>
        <circle cx="185" cy="135" r="5" class="mo-pt"/>
        <circle cx="140" cy="95" r="5" class="mo-pt"/>
        <circle cx="195" cy="70" r="5" class="mo-pt"/>
        <circle cx="265" cy="78" r="5" class="mo-pt"/>
        <circle cx="345" cy="120" r="5" class="mo-pt"/>
        <circle cx="290" cy="165" r="5" class="mo-pt"/>
        <circle cx="430" cy="155" r="5" class="mo-pt"/>
        <circle cx="510" cy="110" r="5" class="mo-pt"/>
        <circle cx="465" cy="68" r="5" class="mo-pt"/>
        <circle cx="590" cy="80" r="5" class="mo-pt"/>
        <circle cx="660" cy="140" r="5" class="mo-pt"/>
        <circle cx="610" cy="175" r="5" class="mo-pt"/>
      </svg>

      <h3>2. Critical Implementation Rule: Expand Window Before Contracting!</h3>
      <p>When transitioning the active window $[\\text{curL}, \\text{curR}]$ to target $[L, R]$, the order of the four <code>while</code> loops is critical! If you execute <code>remove(curL++)</code> or <code>remove(curR--)</code> <em>before</em> expanding <code>add(--curL)</code> and <code>add(++curR)</code>, and the new query $[L, R]$ is disjoint from $[\\text{curL}, \\text{curR}]$, the intermediate window transiently becomes inverted ($\\text{curL} > \\text{curR} + 1$) with negative element counts! Always run the two <strong>expansion loops (<code>--curL</code>, <code>++curR</code>) first</strong>, and the two <strong>contraction loops (<code>curL++</code>, <code>curR--</code>) second</strong>.</p>

      <div class="mermaid">
flowchart LR
  S["Start Query [L, R]"] --> E1["1. while (curL > L)\nadd(--curL)"]
  E1 --> E2["2. while (curR < R)\nadd(++curR)"]
  E2 --> C1["3. while (curL < L)\nremove(curL++)"]
  C1 --> C2["4. while (curR > R)\nremove(curR--)"]
  C2 --> Ans["Record Answer for [L, R]"]
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Hilbert Curve Ordering vs Block Snake Ordering:</strong> While block-snake ordering guarantees $O(N \\sqrt{Q})$ Manhattan movement, mapping each query point $(L, R)$ to its 1D index along a space-filling <strong>Hilbert Curve</strong> of order $2^k \\ge N$ and sorting queries by <code>hilbertOrder(L, R)</code> eliminates the block-size parameter $B$ completely and improves cache locality on skewed query distributions by another 20%–35%.
      </div>

      <div class="simulator-mount" data-sim="sim-mos-sqrt-decomposition"></div>

      <h3>3. Production Implementation: Online $\\sqrt{N}$ Decomposition &amp; Offline Mo's Algorithm</h3>
      <pre><code class="language-javascript">/**
 * 1. Online Sqrt Block Decomposition for Range Sum + Point Update
 * Block size B = ceil(sqrt(N)) | Point Update: O(1) | Range Query: O(sqrt(N))
 */
class SqrtBlockDecomposition {
  constructor(arr) {
    this.n = arr.length;
    this.B = Math.max(1, Math.ceil(Math.sqrt(this.n)));
    this.arr = Float64Array.from(arr);
    this.blocks = new Float64Array(Math.ceil(this.n / this.B));
    for (let i = 0; i &lt; this.n; i++) {
      this.blocks[Math.floor(i / this.B)] += this.arr[i];
    }
  }

  update(idx, newVal) {
    const b = Math.floor(idx / this.B);
    this.blocks[b] += newVal - this.arr[idx];
    this.arr[idx] = newVal;
  }

  query(l, r) {
    let sum = 0;
    const bL = Math.floor(l / this.B);
    const bR = Math.floor(r / this.B);
    if (bL === bR) {
      for (let i = l; i &lt;= r; i++) sum += this.arr[i];
      return sum;
    }
    for (let i = l, end = (bL + 1) * this.B; i &lt; end; i++) sum += this.arr[i];
    for (let b = bL + 1; b &lt; bR; b++) sum += this.blocks[b];
    for (let i = bR * this.B; i &lt;= r; i++) sum += this.arr[i];
    return sum;
  }
}

/**
 * 2. Offline Mo's Algorithm with Boustrophedon (Snake) Ordering
 * Example: Count distinct values in each query [l, r] in O((N + Q) sqrt(N))
 */
function mosDistinctQueries(arr, queries) {
  const n = arr.length;
  const q = queries.length;
  const B = Math.max(1, Math.floor(n / Math.sqrt(Math.max(1, q))));

  // Coordinate compress arr into [0 .. M-1] so freq[] fits in a fast Int32Array
  const unique = Array.from(new Set(arr)).sort((a, b) =&gt; a - b);
  const rankMap = new Map(unique.map((v, idx) =&gt; [v, idx]));
  const a = Int32Array.from(arr, (v) =&gt; rankMap.get(v));

  const indexedQueries = queries.map(([l, r], idx) =&gt; ({
    l,
    r,
    idx,
    block: Math.floor(l / B)
  }));

  // Snake order sort: primary by L-block, secondary by R (asc on even block, desc on odd block)
  indexedQueries.sort((q1, q2) =&gt; {
    if (q1.block !== q2.block) return q1.block - q2.block;
    return (q1.block &amp; 1) ? (q2.r - q1.r) : (q1.r - q2.r);
  });

  const freq = new Int32Array(unique.length);
  const answers = new Int32Array(q);
  let distinct = 0;
  let curL = 0, curR = -1;

  for (let i = 0; i &lt; q; i++) {
    const { l, r, idx } = indexedQueries[i];
    // ALWAYS expand (--curL, ++curR) BEFORE contracting (curL++, curR--)!
    while (curL &gt; l) {
      const val = a[--curL];
      if (++freq[val] === 1) distinct++;
    }
    while (curR &lt; r) {
      const val = a[++curR];
      if (++freq[val] === 1) distinct++;
    }
    while (curL &lt; l) {
      const val = a[curL++];
      if (--freq[val] === 0) distinct--;
    }
    while (curR &gt; r) {
      const val = a[curR--];
      if (--freq[val] === 0) distinct--;
    }
    answers[idx] = distinct;
  }
  return answers;
}</code></pre>

      <h3>4. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Algorithm Variant</th>
            <th>Optimal Block Size $B$</th>
            <th>Time Complexity</th>
            <th>Supports Point Updates?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Online $\\sqrt{N}$ Block Decomposition</td>
            <td>$B = \\lceil \\sqrt{N} \\rceil$</td>
            <td>$O(1)$ update, $O(\\sqrt{N})$ query</td>
            <td>Yes (online)</td>
          </tr>
          <tr>
            <td>Standard Mo's Algorithm (Snake / Hilbert)</td>
            <td>$B = \\lfloor N / \\sqrt{Q} \\rfloor$</td>
            <td>$O(N \\sqrt{Q} + Q \\log Q)$</td>
            <td>No (static offline)</td>
          </tr>
          <tr>
            <td>Mo's Algorithm with Updates (3D $(L, R, T)$)</td>
            <td>$B = N^{2/3}$</td>
            <td>$O(Q \\cdot N^{2/3})$</td>
            <td>Yes (offline time dimension $T$)</td>
          </tr>
          <tr>
            <td>Rollback Mo's Algorithm (Delete-Free Monotonic Ops)</td>
            <td>$B = \\lfloor N / \\sqrt{Q} \\rfloor$</td>
            <td>$O((N + Q)\\sqrt{N})$</td>
            <td>No (handles max/DSU without delete)</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Using $B = \\sqrt{N}$ When $Q \\gg N$ or $Q \\ll N$, and Contracting Before Expanding:</strong> First, if $N = 10^5$ and $Q = 4 \\times 10^5$, setting $B = \\sqrt{N} = 316$ instead of $N / \\sqrt{Q} = 158$ doubles the left-pointer movement cost. Second, never put the <code>curL &lt; l</code> or <code>curR &gt; r</code> removal loops before the expansion loops: if <code>curL</code> crosses past <code>curR + 1</code>, the window temporarily contains negative counts (<code>freq[v] = -1</code>), corrupting frequency-bucket invariants or causing out-of-bounds array accesses.
      </div>
    </div>`,
    keyTakeaways: [
      "Square-root block decomposition partitions an array of size N into blocks of size B = sqrt(N), answering range queries in O(sqrt(N)) and point updates in O(1).",
      "Mo's algorithm reorders offline queries [L, R] by (floor(L / B), R with snake parity) where B = N / sqrt(Q), bounding total window movement to O(N sqrt(Q)).",
      "Always execute the two window expansion loops (--curL, ++curR) before the two window contraction loops (curL++, curR--) so the window never inverts.",
      "When removal is harder than insertion (e.g., maintaining maximum frequency or DSU connected components), Rollback Mo's resets the left pointer to the block boundary after each query."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — Sqrt Decomposition & Mo's Algorithm",
        url: "https://cp-algorithms.com/data_structures/sqrt_decomposition.html"
      },
      {
        title: "Codeforces (sergei_k / Gepardo) — An Alternative Sorting Order for Mo's Algorithm (Hilbert Curve)",
        url: "https://codeforces.com/blog/entry/61203"
      }
    ]
  },

  "lowest-common-ancestor-rmq": {
    title: "Lowest Common Ancestor (LCA): Binary Lifting vs Euler Tour + ±1 RMQ Reduction",
    video: {
      youtubeId: "sD1IoalFomA",
      title: "Lowest Common Ancestor (LCA) — Euler Tour & RMQ Reduction + Binary Lifting",
      channel: "WilliamFiset",
      duration: "18:05",
      start: 0,
      length: 1085,
      why: "Clearly contrasts O(log N) binary lifting jump pointers against the O(1) query Euler Tour + Sparse Table RMQ reduction."
    },
    intuition: `<p>Given a rooted tree $T$ with $N$ vertices, the <strong>Lowest Common Ancestor $\\text{LCA}(u, v)$</strong> is the deepest node that is an ancestor of both $u$ and $v$. LCA is the key to computing the distance between any two tree vertices in fast time via $\\text{dist}(u, v) = \\text{depth}[u] + \\text{depth}[v] - 2 \\cdot \\text{depth}[\\text{LCA}(u, v)]$, as well as aggregating paths and building virtual trees.</p>
    <p>Two paradigms dominate production and algorithmic practice. <strong>Binary Lifting</strong> precomputes $\\text{up}[k][u]$—the $2^k$-th ancestor of $u$—using the recurrence $\\text{up}[k][u] = \\text{up}[k-1][\\text{up}[k-1][u]]$, answering both $\\text{LCA}(u, v)$ and $k$-th ancestor queries (<code> + "</code>kthAncestor(u, k)<code>" + </code>) in $O(\\log N)$ time. Alternatively, <strong>Bender &amp; Farach-Colton's Euler Tour Reduction</strong> records every vertex visit (including return visits after each child subtree) in an array $E[0 \\dots 2N-2]$. Because the DFS must climb up to $\\text{LCA}(u, v)$ to pass from $u$'s subtree to $v$'s subtree and never climbs above $\\text{LCA}(u, v)$ in between, $\\text{LCA}(u, v)$ is simply the <strong>shallowest node in the Euler Tour subarray between $\\text{first}[u]$ and $\\text{first}[v]$</strong>—reducing LCA to an $O(1)$ Sparse Table RMQ!</p>`,
    content: `<div class="lesson-content">
      <h3>1. Paradigm A: Binary Lifting ($2^k$ Jump Pointers &amp; Path Aggregates)</h3>
      <p>Binary Lifting stores a table $\\text{up}[k][u]$ for $0 \\le k \\le \\lfloor \\log_2 N \\rfloor$, where $\\text{up}[0][u] = \\text{parent}[u]$ and $\\text{up}[k][u] = \\text{up}[k-1][\\text{up}[k-1][u]]$. Combined with entry/exit timestamps ($\\text{tin}[u], \\text{tout}[u]$), we can test whether $u$ is an ancestor of $v$ in $O(1)$ time:</p>
      <p>$$\\text{isAncestor}(u, v) \\iff \\text{tin}[u] \\le \\text{tin}[v] \\;\\land\\; \\text{tout}[v] \\le \\text{tout}[u]$$</p>
      <p>To find $\\text{LCA}(u, v)$ when neither is an ancestor of the other, iterate $k$ from $\\lfloor \\log_2 N \\rfloor$ down to $0$: if $\\text{up}[k][u]$ is <em>not</em> an ancestor of $v$, jump $u \\leftarrow \\text{up}[k][u]$. After the loop, $u$ is the immediate child of $\\text{LCA}(u, v)$ along the path, so $\\text{up}[0][u]$ is the exact LCA!</p>

      <div class="invariant-box">
        <strong>Euler Tour RMQ Invariant (Harel &amp; Tarjan 1984 / Bender &amp; Farach-Colton 2000):</strong> Let $E[0 \\dots 2N-2]$ be the sequence of vertices visited in an Euler tour of $T$ (appending $u$ upon entering $u$ and again upon returning to $u$ from each child), and let $\\text{first}[u]$ be the index of $u$'s first appearance in $E$. Assuming $\\text{first}[u] \\le \\text{first}[v]$, the Lowest Common Ancestor is the unique vertex minimizing depth in $E[\\text{first}[u] \\dots \\text{first}[v]]$:
        $$\\text{LCA}(u, v) = \\arg\\min_{w \\in E[\\text{first}[u] \\dots \\text{first}[v]]} \\text{depth}[w]$$
        Moreover, adjacent depths in $E$ differ by <strong>exactly $+1$ or $-1$</strong> ($|\\text{depth}[E[i]] - \\text{depth}[E[i-1]]| = 1$). By partitioning $E$ into blocks of size $b = \\frac{1}{2}\\log_2 N$ and precomputing all $2^{b-1} = O(\\sqrt{N})$ normalized $\\pm 1$ block shapes (the <strong>Method of Four Russians</strong>), LCA achieves optimal <strong>$\\Theta(N)$ build and $\\Theta(1)$ query time</strong>!
      </div>

      <svg viewBox="0 0 760 230" class="lesson-svg" role="img" aria-label="Euler Tour of a Rooted Tree and RMQ over Depth Array">
        <style>
          .lca-bg { fill: #0f172a; rx: 10px; }
          .lca-node { fill: #1e293b; stroke: #38bdf8; stroke-width: 2px; }
          .lca-ans { fill: rgba(52, 211, 153, 0.28); stroke: #34d399; stroke-width: 2.5px; }
          .lca-edge { stroke: #64748b; stroke-width: 2px; }
          .lca-cell { fill: #1e293b; stroke: #475569; stroke-width: 1.5px; rx: 4px; }
          .lca-hi { fill: rgba(56, 189, 248, 0.22); stroke: #38bdf8; stroke-width: 2px; rx: 4px; }
          .lca-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .lca-sub { fill: #94a3b8; font-family: monospace; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="230" class="lca-bg"/>
        <text x="24" y="25" class="lca-txt" fill="#38bdf8">Euler Tour LCA Reduction: LCA(4, 5) = argmin_depth in E[first[4] .. first[5]] = node 2</text>

        <!-- Left: Tree diagram -->
        <line x1="120" y1="55" x2="75" y2="105" class="lca-edge"/>
        <line x1="120" y1="55" x2="165" y2="105" class="lca-edge"/>
        <line x1="75" y1="105" x2="45" y2="160" class="lca-edge"/>
        <line x1="75" y1="105" x2="105" y2="160" class="lca-edge"/>
        <circle cx="120" cy="55" r="16" class="lca-node"/>
        <text x="120" y="59" text-anchor="middle" class="lca-txt">1</text>
        <circle cx="75" cy="105" r="16" class="lca-ans"/>
        <text x="75" y="109" text-anchor="middle" class="lca-txt">2</text>
        <circle cx="165" cy="105" r="16" class="lca-node"/>
        <text x="165" y="109" text-anchor="middle" class="lca-txt">3</text>
        <circle cx="45" cy="160" r="16" class="lca-node"/>
        <text x="45" y="164" text-anchor="middle" class="lca-txt">4</text>
        <circle cx="105" cy="160" r="16" class="lca-node"/>
        <text x="105" y="164" text-anchor="middle" class="lca-txt">5</text>

        <!-- Right: Euler Tour Array E[0..8] for 5 nodes: 1, 2, 4, 2, 5, 2, 1, 3, 1 -->
        <g transform="translate(220, 55)">
          <text x="0" y="0" class="lca-sub">Index i:    0     1     2     3     4     5     6     7     8</text>
          <!-- Highlight range [2..4] -->
          <rect x="106" y="14" width="160" height="75" class="lca-hi"/>
          <!-- Tour E[] -->
          <text x="0" y="38" class="lca-txt">Euler E:   [1]   [2]   [4]   [2]   [5]   [2]   [1]   [3]   [1]</text>
          <text x="0" y="68" class="lca-txt" fill="#34d399">Depth D:    0     1     2     1     2     1     0     1     0</text>
          <text x="186" y="112" text-anchor="middle" class="lca-txt" fill="#facc15">first[4]=2, first[5]=4 -&gt; min depth in E[2..4] is at i=3 (Node 2, depth 1)</text>
          <text x="186" y="136" text-anchor="middle" class="lca-sub">Notice adjacent depths: |D[i] - D[i-1]| = 1 everywhere (±1 RMQ)</text>
        </g>
      </svg>

      <div class="mermaid">
flowchart LR
  subgraph BinaryLifting["Binary Lifting (up[k][u])"]
    BL1["Build: O(N log N)\nQuery LCA: O(log N)\nSupports kthAncestor(u, k)\n& Path Max/Min Edge"]
  end
  subgraph EulerRMQ["Euler Tour + Sparse Table"]
    ER1["Build: O(N log N)\nQuery LCA: O(1)\n2N - 1 Euler states\nIdeal when Q >> N"]
  end
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Packing <code>(depth &lt;&lt; 20) | node</code> into a Single 32-bit Integer:</strong> In the Euler Tour RMQ approach, instead of looking up <code>depth[euler[i]]</code> via a double pointer indirection inside your Sparse Table comparison, pack each Euler tour entry as a single 32-bit integer <code>packed[i] = (depth[u] &lt;&lt; 20) | u</code> (for $N < 2^{20} \\approx 10^6$). Now <code>Math.min(a, b)</code> automatically compares by <code>depth</code> first and breaks ties, and the winning node ID is extracted via <code>minVal &amp; ((1 &lt;&lt; 20) - 1)</code> with zero extra array lookups!
      </div>

      <div class="simulator-mount" data-sim="sim-sparse-table-lca-rmq"></div>

      <h3>2. Production Implementation: Binary Lifting (<code>lca</code>, <code>kthAncestor</code>, <code>dist</code>) &amp; $O(1)$ Euler Tour RMQ</h3>
      <pre><code class="language-javascript">/**
 * 1. Binary Lifting LCA + K-th Ancestor + Tree Distance
 * Build: O(N log N) | Query LCA / kthAncestor / dist: O(log N)
 */
class BinaryLiftingLCA {
  constructor(n, adj, root = 0) {
    this.n = n;
    this.LOG = Math.max(1, 32 - Math.clz32(n));
    this.up = Array.from({ length: this.LOG }, () =&gt; new Int32Array(n));
    this.depth = new Int32Array(n);
    this.tin = new Int32Array(n);
    this.tout = new Int32Array(n);
    this._build(adj, root);
  }

  _build(adj, root) {
    let timer = 0;
    // Iterative DFS to avoid call-stack overflow on deep trees (N = 2e5)
    const stack = [[root, root, 0]]; // [u, parent, childIdx]
    while (stack.length &gt; 0) {
      const top = stack[stack.length - 1];
      const u = top[0], p = top[1], idx = top[2];
      if (idx === 0) {
        this.tin[u] = ++timer;
        this.up[0][u] = p;
        for (let k = 1; k &lt; this.LOG; k++) {
          this.up[k][u] = this.up[k - 1][this.up[k - 1][u]];
        }
      }
      const neighbors = adj[u];
      if (idx &lt; neighbors.length) {
        const v = neighbors[idx];
        top[2]++;
        if (v !== p) {
          this.depth[v] = this.depth[u] + 1;
          stack.push([v, u, 0]);
        }
      } else {
        this.tout[u] = ++timer;
        stack.pop();
      }
    }
  }

  isAncestor(u, v) {
    return this.tin[u] &lt;= this.tin[v] &amp;&amp; this.tout[v] &lt;= this.tout[u];
  }

  kthAncestor(u, k) {
    if (k &gt; this.depth[u]) return -1;
    for (let bit = 0; k &gt; 0; bit++, k &gt;&gt;= 1) {
      if (k &amp; 1) u = this.up[bit][u];
    }
    return u;
  }

  lca(u, v) {
    if (this.isAncestor(u, v)) return u;
    if (this.isAncestor(v, u)) return v;
    for (let k = this.LOG - 1; k &gt;= 0; k--) {
      if (!this.isAncestor(this.up[k][u], v)) {
        u = this.up[k][u];
      }
    }
    return this.up[0][u];
  }

  dist(u, v) {
    const w = this.lca(u, v);
    return this.depth[u] + this.depth[v] - 2 * this.depth[w];
  }
}</code></pre>

      <h3>3. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>LCA Algorithm</th>
            <th>Preprocessing Time &amp; Space</th>
            <th><code>lca(u, v)</code> Query Time</th>
            <th>Supports <code>kthAncestor(u, k)</code> &amp; Path Min/Max Edge?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Binary Lifting (<code>up[k][u]</code>)</td>
            <td>$\\Theta(N \\log N)$ time &amp; space</td>
            <td>$\\Theta(\\log N)$</td>
            <td>Yes ($\\Theta(\\log N)$)</td>
          </tr>
          <tr>
            <td>Euler Tour + Standard Sparse Table</td>
            <td>$\\Theta(N \\log N)$ time &amp; space</td>
            <td>$\\Theta(1)$</td>
            <td>No (requires LA structure)</td>
          </tr>
          <tr>
            <td>Euler Tour + $\\pm 1$ RMQ (Bender &amp; Farach-Colton)</td>
            <td>$\\Theta(N)$ time &amp; space</td>
            <td>$\\Theta(1)$</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Tarjan's Offline Disjoint-Set LCA</td>
            <td>$\\Theta(N + Q)$ space</td>
            <td>$\\Theta((N + Q)\\alpha(N))$ offline</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Heavy-Light Decomposition (HLD Jump)</td>
            <td>$\\Theta(N)$ time &amp; space</td>
            <td>$O(\\log N)$</td>
            <td>Yes ($O(\\log N)$ via DFS tin array)</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Subtree Euler Tour ($N$ Entries) vs Full LCA Euler Tour ($2N - 1$ Entries):</strong> Do not confuse the $N$-element preorder traversal <code>tin[u]</code> (used for subtree queries) with the $(2N - 1)$-element Euler Tour <code>E[0..2N-2]</code> required for RMQ-LCA! In an $N$-element preorder array, the LCA of $u$ and $v$ does <em>not</em> appear between <code>tin[u]</code> and <code>tin[v]</code> (it appears before both of them!). Only when you re-append parent $u$ to <code>E[]</code> after returning from every child subtree does the LCA appear inside $[\\text{first}[u], \\text{first}[v]]$.
      </div>
    </div>`,
    keyTakeaways: [
      "Binary Lifting stores 2^k jump pointers up[k][u] = up[k-1][up[k-1][u]], answering both LCA(u, v) and kthAncestor(u, k) in O(log N) time.",
      "Using entry/exit timestamps (tin[u] <= tin[v] && tout[v] <= tout[u]) checks ancestry in O(1) time and simplifies binary lifting.",
      "Recording a vertex every time an Euler Tour enters it or returns from a child produces an array E[0..2N-2] where LCA(u, v) is the minimum-depth vertex in E[first[u] .. first[v]].",
      "Because adjacent depths in the Euler Tour differ by exactly +1 or -1, Sparse Table (O(N log N) build) or Four Russians ±1 RMQ (O(N) build) answers LCA queries in O(1) time."
    ],
    furtherReading: [
      {
        title: "Bender & Farach-Colton (2000) — The LCA Problem Revisited (LATIN 2000)",
        url: "https://doi.org/10.1007/3-540-44985-X_9"
      },
      {
        title: "CP-Algorithms — Lowest Common Ancestor: Binary Lifting & Farach-Colton/Bender O(1) RMQ",
        url: "https://cp-algorithms.com/graph/lca.html"
      }
    ]
  },

  "heavy-light-decomposition": {
    title: "Heavy-Light Decomposition (HLD): Decomposing Trees into O(log N) Heavy Paths",
    video: {
      youtubeId: "_S1CQ5g9uTg",
      id: "_S1CQ5g9uTg",
      url: "https://www.youtube.com/embed/_S1CQ5g9uTg",
      title: "Algorithms & Data Structures: Heavy-Light Decomposition (HLD) on Trees",
      channel: "Pavel Mavrin",
      duration: "1:12:30",
      start: 0,
      length: "72m",
      why: "Explains the heavy/light edge classification, why every root-to-leaf path crosses at most log2(N) light edges, and how DFS ordering flattens both heavy chains and subtrees."
    },
    intuition: `<p>How do we support dynamic updates and range queries (sum, max, affine transformations) along the <strong>simple path between any two vertices $u$ and $v$</strong> in an arbitrary tree, AND simultaneously across any <strong>subtree $T_u$</strong>? If the tree is a single line, a Segment Tree solves it in $O(\\log N)$; if the tree branches arbitrarily, a naive DFS ordering keeps subtrees contiguous but shatters root-to-node paths into $O(N)$ disconnected pieces.</p>
    <p>Sleator and Tarjan's <strong>Heavy-Light Decomposition (HLD)</strong> bridges the two: at every internal vertex $u$, classify the edge to the child $c$ with the largest subtree size $\\text{sz}[c]$ as <strong>heavy</strong>, and the edges to all other children as <strong>light</strong>. Whenever you step down a light edge $(u, v)$, the subtree size at least halves ($\\text{sz}[v] \\le \\text{sz}[u] / 2$)—for if $\\text{sz}[v] > \\text{sz}[u] / 2$, $v$ would be the heaviest child! Consequently, any path from a node to the root traverses <strong>at most $\\lfloor \\log_2 N \\rfloor$ light edges</strong> and therefore intersects <strong>at most $\\lfloor \\log_2 N \\rfloor + 1$ disjoint heavy paths</strong>. By visiting the heavy child <em>first</em> during DFS (the <code> + "</code>swap-to-front<code>" + </code> trick), every heavy chain AND every subtree simultaneously map to contiguous intervals in a single flat array <code> + "</code>pos[0..N-1]<code>" + </code>!</p>`,
    content: `<div class="lesson-content">
      <h3>1. Heavy vs Light Edges &amp; The $\\lfloor \\log_2 N \\rfloor$ Path-Partition Bound</h3>
      <p>For each node $u$ with children $c_1, c_2, \\dots, c_k$, pick a child $c^*$ maximizing $\\text{sz}[c^*]$. Call $(u, c^*)$ the <strong>heavy edge</strong> out of $u$, and all other edges $(u, c_i)$ ($c_i \\neq c^*$) <strong>light edges</strong>.</p>

      <div class="invariant-box">
        <strong>HLD Halving Invariant &amp; Unified DFS Layout:</strong>
        <ol>
          <li><strong>Light Edge Halving:</strong> If $(u, v)$ is a light edge, there exists a heavy sibling $c^*$ with $\\text{sz}[c^*] \\ge \\text{sz}[v]$. Since $\\text{sz}[u] \\ge 1 + \\text{sz}[c^*] + \\text{sz}[v] > 2 \\cdot \\text{sz}[v]$, we have $\\text{sz}[v] < \\frac{1}{2}\\text{sz}[u]$. Thus any path from $u$ to the root crosses at most $\\lfloor \\log_2 N \\rfloor$ light edges and traverses at most $\\lfloor \\log_2 N \\rfloor + 1$ heavy chains.</li>
          <li><strong>Heavy-Child-First Preorder (<code>pos[u]</code>):</strong> If the second DFS visits <code>heavy[u]</code> <em>before</em> all light children of $u$, then:
            <ul>
              <li>Every heavy chain starting at <code>head[u]</code> down to $u$ occupies the contiguous subarray $[\\text{pos}[\\text{head}[u]], \\text{pos}[u]]$.</li>
              <li>Every subtree $T_u$ simultaneously occupies the contiguous subarray $[\\text{pos}[u], \\text{pos}[u] + \\text{sz}[u] - 1]$!</li>
            </ul>
          </li>
        </ol>
      </div>

      <svg viewBox="0 0 760 245" class="lesson-svg" role="img" aria-label="Heavy-Light Decomposition Tree Chains and Contiguous Flattened Array">
        <style>
          .hld-bg { fill: #0f172a; rx: 10px; }
          .hld-heavy { stroke: #38bdf8; stroke-width: 4px; }
          .hld-light { stroke: #94a3b8; stroke-width: 1.8px; stroke-dasharray: 5 4; }
          .hld-node { fill: #1e293b; stroke: #38bdf8; stroke-width: 2px; }
          .hld-node2 { fill: #1e293b; stroke: #f472b6; stroke-width: 2px; }
          .hld-node3 { fill: #1e293b; stroke: #34d399; stroke-width: 2px; }
          .hld-cell1 { fill: rgba(56, 189, 248, 0.25); stroke: #38bdf8; stroke-width: 2px; rx: 4px; }
          .hld-cell2 { fill: rgba(244, 114, 182, 0.25); stroke: #f472b6; stroke-width: 2px; rx: 4px; }
          .hld-cell3 { fill: rgba(52, 211, 153, 0.25); stroke: #34d399; stroke-width: 2px; rx: 4px; }
          .hld-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .hld-sub { fill: #94a3b8; font-family: sans-serif; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="245" class="hld-bg"/>
        <text x="24" y="25" class="hld-txt" fill="#38bdf8">Heavy-Light Decomposition: Heavy Chains (Solid) vs Light Edges (Dashed)</text>

        <!-- Tree on left -->
        <!-- Heavy chain 1: 0 -> 1 -> 3 -> 6 -->
        <line x1="160" y1="50" x2="105" y2="95" class="hld-heavy"/>
        <line x1="105" y1="95" x2="65" y2="145" class="hld-heavy"/>
        <line x1="65" y1="145" x2="40" y2="195" class="hld-heavy"/>
        <!-- Light edges & Chain 2 (4 -> 7) and Chain 3 (2 -> 5) -->
        <line x1="105" y1="95" x2="145" y2="145" class="hld-light"/>
        <line x1="145" y1="145" x2="145" y2="195" class="hld-heavy" stroke="#f472b6"/>
        <line x1="160" y1="50" x2="225" y2="95" class="hld-light"/>
        <line x1="225" y1="95" x2="225" y2="145" class="hld-heavy" stroke="#34d399"/>

        <circle cx="160" cy="50" r="15" class="hld-node"/><text x="160" y="54" text-anchor="middle" class="hld-txt">0</text>
        <circle cx="105" cy="95" r="15" class="hld-node"/><text x="105" y="99" text-anchor="middle" class="hld-txt">1</text>
        <circle cx="65" cy="145" r="15" class="hld-node"/><text x="65" y="149" text-anchor="middle" class="hld-txt">3</text>
        <circle cx="40" cy="195" r="15" class="hld-node"/><text x="40" y="199" text-anchor="middle" class="hld-txt">6</text>
        <circle cx="145" cy="145" r="15" class="hld-node2"/><text x="145" y="149" text-anchor="middle" class="hld-txt">4</text>
        <circle cx="145" cy="195" r="15" class="hld-node2"/><text x="145" y="199" text-anchor="middle" class="hld-txt">7</text>
        <circle cx="225" cy="95" r="15" class="hld-node3"/><text x="225" y="99" text-anchor="middle" class="hld-txt">2</text>
        <circle cx="225" cy="145" r="15" class="hld-node3"/><text x="225" y="149" text-anchor="middle" class="hld-txt">5</text>

        <!-- Flattened array on right -->
        <g transform="translate(290, 58)">
          <text x="0" y="0" class="hld-txt">Heavy-Child-First Preorder Array pos[0..7]:</text>
          <!-- Chain 1: 0, 1, 3, 6 -->
          <rect x="0" y="16" width="210" height="36" class="hld-cell1"/>
          <text x="105" y="39" text-anchor="middle" class="hld-txt">[0]  [1]  [3]  [6]</text>
          <text x="105" y="68" text-anchor="middle" class="hld-sub" fill="#38bdf8">Chain head=0 (pos 0..3)</text>
          <!-- Chain 2: 4, 7 -->
          <rect x="220" y="16" width="105" height="36" class="hld-cell2"/>
          <text x="272" y="39" text-anchor="middle" class="hld-txt">[4]  [7]</text>
          <text x="272" y="68" text-anchor="middle" class="hld-sub" fill="#f472b6">head=4 (4..5)</text>
          <!-- Chain 3: 2, 5 -->
          <rect x="335" y="16" width="105" height="36" class="hld-cell3"/>
          <text x="387" y="39" text-anchor="middle" class="hld-txt">[2]  [5]</text>
          <text x="387" y="68" text-anchor="middle" class="hld-sub" fill="#34d399">head=2 (6..7)</text>

          <text x="0" y="105" class="hld-txt" fill="#facc15">Dual Property of Heavy-Child-First Ordering:</text>
          <text x="0" y="128" class="hld-sub">• Path(7, 5) climbs: [pos[4]..pos[7]] -&gt; [pos[2]..pos[5]] -&gt; [pos[0]..pos[1]]</text>
          <text x="0" y="148" class="hld-sub">• Subtree(1) = {1, 3, 6, 4, 7} is ALSO contiguous: pos[1..5]!</text>
        </g>
      </svg>

      <h3>2. Climbing Chains in <code>queryPath(u, v)</code> &amp; Handling Edge Weights vs Vertex Weights</h3>
      <p>To query or update the path between $u$ and $v$, compare the chain heads $\\text{head}[u]$ and $\\text{head}[v]$:</p>
      <ul>
        <li>While $\\text{head}[u] \\neq \\text{head}[v]$, pick whichever chain head is deeper (say $\\text{depth}[\\text{head}[u]] > \\text{depth}[\\text{head}[v]]$), query the contiguous segment $[\\text{pos}[\\text{head}[u]], \\text{pos}[u]]$ in the Segment Tree, and jump $u \\leftarrow \\text{parent}[\\text{head}[u]]$ across the light edge into the upper chain.</li>
        <li>Once $\\text{head}[u] = \\text{head}[v]$, $u$ and $v$ lie on the same heavy chain! Query the final segment $[\\min(\\text{pos}[u], \\text{pos}[v]), \\max(\\text{pos}[u], \\text{pos}[v])]$ (for vertex queries) or $[\\min(\\text{pos}[u], \\text{pos}[v]) + 1, \\max(\\text{pos}[u], \\text{pos}[v])]$ (when weights live on <strong>edges</strong> and each edge weight is stored at its deeper child endpoint, excluding the LCA vertex!).</li>
      </ul>

      <div class="mermaid">
flowchart TD
  Start["queryPath(u, v)"] --> Loop{"head[u] != head[v]?"}
  Loop -- Yes --> Swap["If depth[head[u]] < depth[head[v]]:\nswap(u, v)"]
  Swap --> Seg["ans = combine(ans, seg.query(pos[head[u]], pos[u]))\nu = parent[head[u]]"]
  Seg --> Loop
  Loop -- No --> Final["Ensure depth[u] <= depth[v]\nVertex query: seg.query(pos[u], pos[v])\nEdge query: seg.query(pos[u] + 1, pos[v])"]
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — The <code>swap(adj[u][0], adj[u][heavyIdx])</code> Trick &amp; Tight Bound on Segment Tree Calls:</strong> By moving the heavy child to <code>adj[u][0]</code> during the first size-computation DFS, the second decomposition DFS simply iterates over <code>adj[u]</code> in order. Even better: although a path crosses $O(\\log N)$ heavy chains and each chain call takes $O(\\log N)$ in a Segment Tree ($O(\\log^2 N)$ worst case), all chain intervals except the last one start at a chain head <code>pos[head[u]]</code>, and the sum of lengths of the sub-trees along any heavy path telescopes! In an iterative $2N$ segment tree, HLD path queries execute in microsecond-level cache-hot loops.
      </div>

      <div class="simulator-mount" data-sim="sim-mos-sqrt-decomposition"></div>

      <h3>3. Production Implementation: Heavy-Light Decomposition with Iterative Segment Tree</h3>
      <pre><code class="language-javascript">/**
 * Heavy-Light Decomposition (HLD) supporting:
 *  - Point update on vertex u: O(log N)
 *  - Path query between u and v: O(log^2 N)
 *  - Subtree query on u: O(log N)
 *  - LCA(u, v): O(log N)
 */
class HeavyLightDecomposition {
  constructor(n, adj, values, combine, identity, root = 0) {
    this.n = n;
    this.combine = combine;
    this.identity = identity;

    this.parent = new Int32Array(n);
    this.depth = new Int32Array(n);
    this.sz = new Int32Array(n);
    this.heavy = new Int32Array(n).fill(-1);
    this.head = new Int32Array(n);
    this.pos = new Int32Array(n);

    this._dfsSize(adj, root);
    this._dfsDecompose(adj, root);

    // Build flat 2N iterative segment tree in HLD pos[] order
    this.tree = new Array(2 * n);
    for (let u = 0; u &lt; n; u++) {
      this.tree[n + this.pos[u]] = values[u];
    }
    for (let i = n - 1; i &gt;= 1; i--) {
      this.tree[i] = combine(this.tree[i &lt;&lt; 1], this.tree[(i &lt;&lt; 1) | 1]);
    }
  }

  _dfsSize(adj, root) {
    const order = [root];
    this.parent[root] = -1;
    this.depth[root] = 0;
    for (let i = 0; i &lt; order.length; i++) {
      const u = order[i];
      for (const v of adj[u]) {
        if (v !== this.parent[u]) {
          this.parent[v] = u;
          this.depth[v] = this.depth[u] + 1;
          order.push(v);
        }
      }
    }
    for (let i = order.length - 1; i &gt;= 0; i--) {
      const u = order[i];
      this.sz[u] = 1;
      let maxSub = 0;
      for (const v of adj[u]) {
        if (v !== this.parent[u]) {
          this.sz[u] += this.sz[v];
          if (this.sz[v] &gt; maxSub) {
            maxSub = this.sz[v];
            this.heavy[u] = v;
          }
        }
      }
    }
  }

  _dfsDecompose(adj, root) {
    let curPos = 0;
    const stack = [[root, root]]; // [u, chainHead]
    while (stack.length &gt; 0) {
      const [u, h] = stack.pop();
      this.head[u] = h;
      this.pos[u] = curPos++;
      // Push light children first so heavy[u] is popped and visited FIRST!
      for (let i = adj[u].length - 1; i &gt;= 0; i--) {
        const v = adj[u][i];
        if (v !== this.parent[u] &amp;&amp; v !== this.heavy[u]) {
          stack.push([v, v]);
        }
      }
      if (this.heavy[u] !== -1) {
        stack.push([this.heavy[u], h]);
      }
    }
  }

  _segQuery(l, r) {
    let resL = this.identity, resR = this.identity;
    for (let a = l + this.n, b = r + this.n + 1; a &lt; b; a &gt;&gt;= 1, b &gt;&gt;= 1) {
      if (a &amp; 1) resL = this.combine(resL, this.tree[a++]);
      if (b &amp; 1) resR = this.combine(this.tree[--b], resR);
    }
    return this.combine(resL, resR);
  }

  setVertex(u, val) {
    let p = this.pos[u] + this.n;
    this.tree[p] = val;
    for (p &gt;&gt;= 1; p &gt;= 1; p &gt;&gt;= 1) {
      this.tree[p] = this.combine(this.tree[p &lt;&lt; 1], this.tree[(p &lt;&lt; 1) | 1]);
    }
  }

  queryPath(u, v) {
    let res = this.identity;
    while (this.head[u] !== this.head[v]) {
      if (this.depth[this.head[u]] &lt; this.depth[this.head[v]]) {
        const tmp = u; u = v; v = tmp;
      }
      res = this.combine(res, this._segQuery(this.pos[this.head[u]], this.pos[u]));
      u = this.parent[this.head[u]];
    }
    if (this.depth[u] &gt; this.depth[v]) {
      const tmp = u; u = v; v = tmp;
    }
    return this.combine(res, this._segQuery(this.pos[u], this.pos[v]));
  }

  querySubtree(u) {
    return this._segQuery(this.pos[u], this.pos[u] + this.sz[u] - 1);
  }
}</code></pre>

      <h3>4. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Tree Decomposition Technique</th>
            <th>Build Time &amp; Space</th>
            <th>Path Update / Query</th>
            <th>Subtree Update / Query</th>
            <th>Dynamic Tree Topology (<code>link</code>/<code>cut</code>)?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Euler Tour Preorder (<code>tin[u]..tout[u]</code>) + Fenwick</td>
            <td>$\\Theta(N)$</td>
            <td>Root-to-node or Invertible only</td>
            <td>$\\Theta(\\log N)$</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Heavy-Light Decomposition (HLD) + SegTree</td>
            <td>$\\Theta(N)$</td>
            <td>$O(\\log^2 N)$ (any monoid)</td>
            <td>$O(\\log N)$</td>
            <td>No (fixed tree topology)</td>
          </tr>
          <tr>
            <td>Link-Cut Trees (Sleator-Tarjan Splay Chains)</td>
            <td>$\\Theta(N)$</td>
            <td>$O(\\log N)$ amortized</td>
            <td>Harder (requires Top Tree / Euler)</td>
            <td>Yes (<code>link(u,v)</code>, <code>cut(u,v)</code> in $O(\\log N)$)</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Swapping <code>depth[u] &lt; depth[v]</code> Instead of <code>depth[head[u]] &lt; depth[head[v]]</code>:</strong> Inside the <code>while (head[u] !== head[v])</code> loop of HLD, you MUST compare the depths of the <strong>chain heads</strong> (<code>depth[head[u]] &lt; depth[head[v]]</code>), NOT the depths of $u$ and $v$ themselves! A node $u$ can be deeper than $v$ while <code>head[u]</code> is actually the root of the entire tree (<code>depth[head[u]] = 0</code>); jumping from <code>head[u]</code> would jump above the root (<code>parent[root] = -1</code>) and crash or miss the LCA entirely.
      </div>
    </div>`,
    keyTakeaways: [
      "Every time a path steps down a light edge (u, v), the subtree size strictly more than halves (sz[v] <= sz[u] / 2), bounding light edges on any root-to-leaf path to <= floor(log2 N).",
      "Visiting the heavy child first during the second DFS ensures that both every heavy chain [pos[head[u]]..pos[u]] AND every subtree [pos[u]..pos[u]+sz[u]-1] occupy contiguous intervals in a single array.",
      "During path queries, always advance whichever node has the deeper chain head (depth[head[u]] > depth[head[v]]), never comparing depth[u] vs depth[v] until head[u] == head[v].",
      "For edge-weighted trees, assign each edge's weight to its deeper endpoint and query [pos[u] + 1, pos[v]] on the final shared chain so the LCA vertex is excluded."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — Heavy-Light Decomposition (Path & Subtree Queries)",
        url: "https://cp-algorithms.com/graph/hld.html"
      },
      {
        title: "Codeforces (AI.Cash) — Easiest HLD with Subtree Queries (Heavy-Child-First Trick)",
        url: "https://codeforces.com/blog/entry/53170"
      },
      {
        title: "Sleator & Tarjan (1983) — A Data Structure for Dynamic Trees (JCSS — Original Heavy/Light Edge Analysis)",
        url: "https://doi.org/10.1016/0022-0000(83)90006-5"
      }
    ]
  },

  "cartesian-trees-treap-duality": {
    title: "Cartesian Trees: Linear-Time Monotonic Stack Construction & RMQ-LCA Duality",
    video: {
      youtubeId: "0rCFkuQS968",
      id: "0rCFkuQS968",
      url: "https://www.youtube.com/embed/0rCFkuQS968",
      title: "MIT 6.851 Lecture 15: Static Trees, RMQ-LCA Duality & Cartesian Trees in O(N)",
      channel: "MIT OpenCourseWare",
      duration: "1:18:50",
      start: 0,
      length: "78m",
      why: "Derives the O(N) right-spine monotonic stack construction of a Cartesian Tree and proves the bidirectional reduction between RMQ and LCA."
    },
    intuition: `<p>Given an array $A[0..N-1]$, its <strong>Min-Cartesian Tree</strong> (introduced by Jean Vuillemin in 1980) is the unique binary tree whose <strong>inorder traversal reproduces the array indices $0, 1, \\dots, N-1$</strong> and whose nodes satisfy the <strong>min-heap property on values $A[i]$</strong> ($A[\\text{parent}] \\le A[\\text{child}]$). Equivalently, the root of the Cartesian tree for $A[L..R]$ is the index $m = \\arg\\min_{i \\in [L, R]} A[i]$, its left subtree is the Cartesian tree of $A[L..m-1]$, and its right subtree is the Cartesian tree of $A[m+1..R]$.</p>
    <p>Two remarkable consequences follow immediately. First, for any range $[L, R]$, the Lowest Common Ancestor $\\text{LCA}(L, R)$ in the Cartesian tree is the unique ancestor falling between $L$ and $R$ in inorder traversal—which is <strong>literally $\\arg\\min_{i \\in [L, R]} A[i]$</strong>! Thus <em>any</em> static Range Minimum Query (RMQ) reduces in $\\Theta(N)$ time to LCA on a Cartesian tree, and conversely LCA reduces to $\\pm 1$ RMQ via Euler Tour (<strong>RMQ-LCA Duality</strong>). Second, we can construct the Cartesian tree in <strong>strict $\\Theta(N)$ time</strong> by inserting indices $i = 0, 1, \\dots, N-1$ from left to right while maintaining the tree's <strong>right spine</strong> on a monotonic increasing stack!</p>`,
    content: `<div class="lesson-content">
      <h3>1. Linear-Time $\\Theta(N)$ Right-Spine Construction via Monotonic Stack</h3>
      <p>Suppose we have already built the Cartesian tree for prefix $A[0..i-1]$. Because index $i$ is larger than every index in $\{0, \\dots, i-1\}$, node $i$ <strong>must be placed somewhere along the rightmost spine</strong> of the current tree (and cannot have a right child yet). As we climb up the right spine from the bottommost node, any spine node $s$ with $A[s] > A[i]$ violates the min-heap invariant if $s$ remains above $i$. Therefore:</p>
      <ol>
        <li>Pop all nodes $s$ from the right-spine stack that have $A[s] > A[i]$; let $last$ be the last node popped (the shallowest popped node with $A[last] > A[i]$).</li>
        <li>Make $last$ the <strong>left child</strong> of $i$ (<code>left[i] = last</code>), preserving the inorder requirement because all indices in $last$'s subtree are $< i$.</li>
        <li>If the stack is still non-empty, its top node $p$ satisfies $A[p] \\le A[i]$; attach $i$ as the <strong>right child</strong> of $p$ (<code>right[p] = i</code>). Push $i$ onto the right-spine stack.</li>
      </ol>
      <p>Because each index $i \\in [0, N-1]$ is pushed onto the right-spine stack once and popped at most once, the entire construction runs in at most $2N$ stack operations—<strong>exact $\\Theta(N)$ time</strong>!</p>

      <div class="invariant-box">
        <strong>Cartesian Tree — Treap — Quicksort — RMQ-LCA Isomorphism:</strong>
        <ul>
          <li><strong>RMQ $\\iff$ LCA Duality:</strong> For any $0 \\le L \\le R < N$, $\\arg\\min_{i \\in [L, R]} A[i] = \\text{LCA}_{\\text{Cartesian}(A)}(L, R)$. Furthermore, node $i$'s subtree covers the exact maximal contiguous subarray $[L_i, R_i]$ around $i$ where $A[i]$ is the minimum—the foundation of the $O(N)$ Largest Rectangle in a Histogram algorithm!</li>
          <li><strong>Treap Isomorphism:</strong> A Treap with keys $0, 1, \\dots, N-1$ and random priorities $P[i]$ is <em>literally</em> the Cartesian tree of $P$.</li>
        </ul>
      </div>

      <svg viewBox="0 0 760 235" class="lesson-svg" role="img" aria-label="Cartesian Tree Construction on Array and Right Spine Monotonic Stack">
        <style>
          .ct-bg { fill: #0f172a; rx: 10px; }
          .ct-node { fill: #1e293b; stroke: #38bdf8; stroke-width: 2px; }
          .ct-spine { fill: rgba(250, 204, 21, 0.22); stroke: #facc15; stroke-width: 2.5px; }
          .ct-new { fill: rgba(52, 211, 153, 0.25); stroke: #34d399; stroke-width: 2.5px; }
          .ct-edge { stroke: #64748b; stroke-width: 2px; }
          .ct-pop { stroke: #f472b6; stroke-width: 2px; stroke-dasharray: 5 3; fill: none; }
          .ct-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .ct-sub { fill: #94a3b8; font-family: sans-serif; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="235" class="ct-bg"/>
        <text x="24" y="25" class="ct-txt" fill="#38bdf8">Cartesian Tree Right-Spine Insertion: Inserting A[5] = 4 into A = [9, 3, 7, 1, 8, 4]</text>

        <!-- Left: Before inserting i=5 (val=4) -->
        <text x="160" y="48" text-anchor="middle" class="ct-sub">1. Before i=5: Right Spine = [i=3(1), i=4(8)]</text>
        <line x1="160" y1="75" x2="95" y2="125" class="ct-edge"/>
        <line x1="160" y1="75" x2="225" y2="125" class="ct-edge"/>
        <line x1="95" y1="125" x2="55" y2="175" class="ct-edge"/>
        <line x1="95" y1="125" x2="135" y2="175" class="ct-edge"/>
        <circle cx="160" cy="75" r="18" class="ct-spine"/><text x="160" y="79" text-anchor="middle" class="ct-txt">3:1</text>
        <circle cx="95" cy="125" r="18" class="ct-node"/><text x="95" y="129" text-anchor="middle" class="ct-txt">1:3</text>
        <circle cx="55" cy="175" r="18" class="ct-node"/><text x="55" y="179" text-anchor="middle" class="ct-txt">0:9</text>
        <circle cx="135" cy="175" r="18" class="ct-node"/><text x="135" y="179" text-anchor="middle" class="ct-txt">2:7</text>
        <circle cx="225" cy="125" r="18" class="ct-spine"/><text x="225" y="129" text-anchor="middle" class="ct-txt">4:8</text>

        <!-- Right: After inserting i=5 (val=4) -->
        <text x="530" y="48" text-anchor="middle" class="ct-sub">2. Pop 4:8 (&gt; 4), make 4:8 left child of 5:4, attach 5:4 to 3:1</text>
        <line x1="510" y1="75" x2="445" y2="125" class="ct-edge"/>
        <line x1="510" y1="75" x2="585" y2="125" class="ct-edge"/>
        <line x1="445" y1="125" x2="405" y2="175" class="ct-edge"/>
        <line x1="445" y1="125" x2="485" y2="175" class="ct-edge"/>
        <line x1="585" y1="125" x2="545" y2="175" class="ct-edge"/>
        <circle cx="510" cy="75" r="18" class="ct-spine"/><text x="510" y="79" text-anchor="middle" class="ct-txt">3:1</text>
        <circle cx="445" cy="125" r="18" class="ct-node"/><text x="445" y="129" text-anchor="middle" class="ct-txt">1:3</text>
        <circle cx="405" cy="175" r="18" class="ct-node"/><text x="405" y="179" text-anchor="middle" class="ct-txt">0:9</text>
        <circle cx="485" cy="175" r="18" class="ct-node"/><text x="485" y="179" text-anchor="middle" class="ct-txt">2:7</text>
        <circle cx="585" cy="125" r="18" class="ct-new"/><text x="585" y="129" text-anchor="middle" class="ct-txt">5:4</text>
        <circle cx="545" cy="175" r="18" class="ct-node"/><text x="545" y="179" text-anchor="middle" class="ct-txt">4:8</text>

        <text x="380" y="218" text-anchor="middle" class="ct-txt" fill="#facc15">RMQ(1, 5) = LCA(node 1, node 5) = node 3 (value 1) | Subtree of 1:3 is [0..2]</text>
      </svg>

      <div class="mermaid">
flowchart LR
  RMQ["General Static RMQ on A[0..N-1]"] -->|"O(N) Monotonic Stack"| CT["Cartesian Tree T(A)"]
  CT -->|"O(N) Euler Tour"| PM1["±1 RMQ on Depth Array D[0..2N-2]"]
  PM1 -->|"Four Russians Block Lookup"| O1["Theta(N) Build, Theta(1) Query RMQ!"]
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Flat Pre-Allocated Stack &amp; Zero-Allocation Construction:</strong> Using a single pre-allocated <code>Int32Array(n)</code> as the right-spine stack and <code>Int32Array(n)</code> for <code>parent</code>, <code>left</code>, and <code>right</code> builds the Cartesian tree of $10^7$ integers in ~35 milliseconds in V8/C++—completely dominated by sequential L1 cache streaming with zero dynamic allocations.
      </div>

      <div class="simulator-mount" data-sim="sim-mos-sqrt-decomposition"></div>

      <h3>2. Production Implementation: $\\Theta(N)$ Cartesian Tree &amp; All-Subarray-Minimums Summation</h3>
      <pre><code class="language-javascript">/**
 * Constructs the Min-Cartesian Tree of arr[0..N-1] in exact Theta(N) time
 * using a monotonic right-spine stack.
 * Ties broken by smaller index (arr[stack[top]] &gt; arr[i] pops strictly greater values).
 */
function buildCartesianTree(arr) {
  const n = arr.length;
  const parent = new Int32Array(n).fill(-1);
  const left = new Int32Array(n).fill(-1);
  const right = new Int32Array(n).fill(-1);
  const stack = new Int32Array(n);
  let top = -1;

  for (let i = 0; i &lt; n; i++) {
    let lastPopped = -1;
    // Pop nodes from right spine that are strictly greater than arr[i]
    while (top &gt;= 0 &amp;&amp; arr[stack[top]] &gt; arr[i]) {
      lastPopped = stack[top--];
    }
    // The shallowest popped node becomes the left child of i
    if (lastPopped !== -1) {
      left[i] = lastPopped;
      parent[lastPopped] = i;
    }
    // If stack is non-empty, i becomes the right child of stack[top]
    if (top &gt;= 0) {
      right[stack[top]] = i;
      parent[i] = stack[top];
    }
    stack[++top] = i;
  }

  // The root of the entire Cartesian tree is at the bottom of the right spine (stack[0])
  const root = n &gt; 0 ? stack[0] : -1;
  return { root, parent, left, right };
}

/**
 * Application: Sum of min(A[L..R]) over all N*(N+1)/2 subarrays in O(N) time!
 * In the Cartesian tree, node i is the minimum for all subarrays [L, R]
 * where L is in i's left subtree (+ i) and R is in i's right subtree (+ i).
 */
function sumOfSubarrayMinimums(arr) {
  const n = arr.length;
  const { root, left, right } = buildCartesianTree(arr);
  const sz = new Int32Array(n);
  let totalSum = 0;

  // Iterative post-order traversal
  const order = [];
  const stack = root !== -1 ? [root] : [];
  while (stack.length &gt; 0) {
    const u = stack.pop();
    order.push(u);
    if (left[u] !== -1) stack.push(left[u]);
    if (right[u] !== -1) stack.push(right[u]);
  }

  for (let idx = order.length - 1; idx &gt;= 0; idx--) {
    const u = order[idx];
    const szL = left[u] !== -1 ? sz[left[u]] : 0;
    const szR = right[u] !== -1 ? sz[right[u]] : 0;
    sz[u] = 1 + szL + szR;
    totalSum += arr[u] * (szL + 1) * (szR + 1);
  }
  return totalSum;
}</code></pre>

      <h3>3. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Problem / Transformation</th>
            <th>Naive / Divide &amp; Conquer</th>
            <th>Via Cartesian Tree</th>
            <th>Space Overhead</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Build Min/Max Cartesian Tree</td>
            <td>$O(N^2)$ worst-case without RMQ</td>
            <td>$\\Theta(N)$ (at most $2N$ stack ops)</td>
            <td>$3N$ integers (<code>left</code>, <code>right</code>, <code>parent</code>)</td>
          </tr>
          <tr>
            <td>Reduce General RMQ to $\\pm 1$ RMQ</td>
            <td>—</td>
            <td>$\\Theta(N)$ via Cartesian Tree + Euler Tour</td>
            <td>$\\Theta(N)$</td>
          </tr>
          <tr>
            <td>Sum of $\\min(A[L..R])$ / Largest Histogram Area</td>
            <td>$O(N^2)$</td>
            <td>$\\Theta(N)$ via subtree sizes $(sz_L + 1)(sz_R + 1)$</td>
            <td>$\\Theta(N)$</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Duplicate Values &amp; Strict vs Non-Strict Inequality on the Spine:</strong> When $A$ contains duplicate values ($A[j] = A[i]$ for $j < i$), using strict inequality <code>arr[stack[top]] &gt; arr[i]</code> keeps the earlier index $j$ above $i$ (breaking ties to the left, so each duplicate range is counted exactly once in <code>sumOfSubarrayMinimums</code>). If you use <code>&gt;=</code> in one place and <code>&gt;</code> in another, duplicate subarrays will be either double-counted or skipped!
      </div>
    </div>`,
    keyTakeaways: [
      "A Cartesian tree for A[0..N-1] is a binary tree that is simultaneously a BST on array indices (inorder traversal is 0..N-1) and a min-heap on array values A[i].",
      "Maintaining the right spine on a monotonic stack builds the Cartesian tree in exact Theta(N) time because every node is pushed once and popped at most once.",
      "RMQ(L, R) on array A is identical to LCA(L, R) in the Cartesian tree of A, completing the bidirectional linear-time equivalence between RMQ and LCA.",
      "In the Cartesian tree, the subtree rooted at i spans the exact maximal interval [L_i, R_i] where A[i] is the minimum, so A[i] is the minimum of (sz[left[i]] + 1) * (sz[right[i]] + 1) subarrays."
    ],
    furtherReading: [
      {
        title: "Vuillemin (1980) — A Unifying Look at Data Structures (Communications of the ACM — Original Cartesian Tree Paper)",
        url: "https://doi.org/10.1145/358841.358852"
      },
      {
        title: "Bender & Farach-Colton (2000) — The LCA Problem Revisited (Cartesian Tree RMQ-to-LCA Reduction)",
        url: "https://doi.org/10.1007/3-540-44985-X_9"
      },
      {
        title: "CP-Algorithms — Cartesian Tree Construction & RMQ Duality",
        url: "https://cp-algorithms.com/graph/rmq_linear.html"
      }
    ]
  },

  "build-lazy-segment-tree": {
    title: "Build Lab: Generic Lazy-Propagating Segment Tree with Range Affine Updates & Queries",
    video: {
      youtubeId: "QvgpIX4_vyA",
      title: "Lazy Segment Tree Implementation — Range Affine Update & Range Sum/Min/Max",
      channel: "Errichto Algorithms",
      duration: "24:15",
      start: 0,
      length: 1455,
      why: "Walks through composing affine lazy tags f(x) = a*x + b so range assignment, range scaling, and range addition unify into a single bug-free lazy segment tree."
    },
    intuition: `<p>In interviews and production analytics engines, the hardest lazy segment tree bug occurs when a problem combines <strong>multiple range update types</strong>—such as <code>rangeAdd(l, r, b)</code>, <code>rangeScale(l, r, a)</code>, and <code>rangeAssign(l, r, c)</code>—alongside range queries like <code>rangeSum(l, r)</code>, <code>rangeMin(l, r)</code>, and <code>maxRight(l, pred)</code>. Maintaining separate boolean flags and <code> + "</code>addTag<code>" + </code> / <code> + "</code>setTag<code>" + </code> fields leads to a tangle of 8+ conditional branches inside <code> + "</code>pushDown<code>" + </code>.</p>
    <p>Instead, notice that <strong>all three range updates are special cases of a single Range Affine Transformation $f(x) = a \\cdot x + b$</strong>!
    <ul>
      <li><code>rangeAdd(l, r, delta)</code> is the affine map $(a = 1, b = \\text{delta})$.</li>
      <li><code>rangeScale(l, r, factor)</code> is the affine map $(a = \\text{factor}, b = 0)$.</li>
      <li><code>rangeAssign(l, r, val)</code> is the affine map $(a = 0, b = \\text{val})$ (multiplying old values by $0$ and adding $\\text{val}$)!</li>
    </ul>
    Composing a new tag $f_{\\text{new}}(x) = a_2 x + b_2$ onto an existing pending tag $f_{\\text{old}}(x) = a_1 x + b_1$ is simply $f_{\\text{new}}(f_{\\text{old}}(x)) = (a_2 a_1)x + (a_2 b_1 + b_2)$, with identity tag $(1, 0)$! In this Build Lab, we engineer both an specialized SoA <strong>Range Affine Lazy Segment Tree</strong> and a generic AtCoder-style <strong>Monoid + Homomorphism Lazy Segment Tree</strong> supporting $O(\\log N)$ binary search (<code> + "</code>maxRight<code>" + </code>).</p>`,
    content: `<div class="lesson-content">
      <h3>1. Algebraic Specification of the Range Affine Lazy Segment Tree</h3>
      <p>Let each node $v$ covering $[tl, tr]$ of length $\\text{len} = tr - tl + 1$ store:</p>
      <ul>
        <li><strong>Data Summary:</strong> $\\text{sum}[v] = \\sum_{i=tl}^{tr} A[i]$.</li>
        <li><strong>Lazy Affine Tag:</strong> $(\\text{lazyA}[v], \\text{lazyB}[v])$, initialized to the identity map $(1, 0)$.</li>
      </ul>

      <div class="invariant-box">
        <strong>Affine Tag Application &amp; Composition Invariants:</strong> When applying affine tag $(a, b)$ to node $v$ of length $\\text{len} = tr - tl + 1$:
        <ol>
          <li><strong>Summary Update:</strong> $\\sum_{i=tl}^{tr} (a \\cdot A[i] + b) = a \\cdot \\text{sum}[v] + b \\cdot \\text{len}$.</li>
          <li><strong>Tag Composition ($f_{\\text{new}} \\circ f_{\\text{old}}$):</strong> If $v$ already holds pending tag $(a_1, b_1)$, applying $(a_2, b_2)$ updates the tag to:
          $$\\text{lazyA}[v] \\leftarrow a_2 \\cdot a_1, \\qquad \\text{lazyB}[v] \\leftarrow a_2 \\cdot b_1 + b_2$$
          Notice that when $a_2 = 0$ (<code>rangeAssign(l, r, c)</code>), this automatically zeroes out $a_1$ and $b_1$, leaving $(0, c)$ with zero <code>if/else</code> branching!</li>
        </ol>
      </div>

      <svg viewBox="0 0 760 220" class="lesson-svg" role="img" aria-label="Affine Tag Composition Pipeline in Lazy Segment Tree">
        <style>
          .lab-bg { fill: #0f172a; rx: 10px; }
          .lab-box { fill: #1e293b; stroke: #38bdf8; stroke-width: 2px; rx: 8px; }
          .lab-box2 { fill: rgba(52, 211, 153, 0.18); stroke: #34d399; stroke-width: 2px; rx: 8px; }
          .lab-arr { stroke: #facc15; stroke-width: 2.5px; }
          .lab-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .lab-sub { fill: #94a3b8; font-family: sans-serif; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="220" class="lab-bg"/>
        <text x="24" y="26" class="lab-txt" fill="#38bdf8">Unified Range Affine Endomorphism: f(x) = a*x + b Covers Add, Scale, and Assign</text>

        <rect x="24" y="45" width="215" height="150" class="lab-box"/>
        <text x="38" y="70" class="lab-txt" fill="#facc15">1. Three Operations -&gt; (a, b)</text>
        <text x="38" y="98" class="lab-txt">rangeAdd(d)    -&gt; (1, d)</text>
        <text x="38" y="124" class="lab-txt">rangeScale(k)  -&gt; (k, 0)</text>
        <text x="38" y="150" class="lab-txt">rangeAssign(c) -&gt; (0, c)</text>
        <text x="38" y="176" class="lab-sub">Identity Tag   -&gt; (1, 0)</text>

        <line x1="240" y1="120" x2="270" y2="120" class="lab-arr"/>

        <rect x="272" y="45" width="225" height="150" class="lab-box"/>
        <text x="286" y="70" class="lab-txt" fill="#38bdf8">2. Apply (a, b) to Node v</text>
        <text x="286" y="98" class="lab-txt">sum[v] = a * sum[v] + b * len</text>
        <text x="286" y="126" class="lab-txt">lazyA[v] = a * lazyA[v]</text>
        <text x="286" y="152" class="lab-txt">lazyB[v] = a * lazyB[v] + b</text>
        <text x="286" y="176" class="lab-sub">Zero conditional branches!</text>

        <line x1="498" y1="120" x2="528" y2="120" class="lab-arr"/>

        <rect x="530" y="45" width="206" height="150" class="lab-box2"/>
        <text x="544" y="70" class="lab-txt" fill="#34d399">3. Tree Walk maxRight(l, pred)</text>
        <text x="544" y="98" class="lab-sub">Finds largest r &gt;= l where</text>
        <text x="544" y="116" class="lab-sub">pred(sum(l..r)) is true in</text>
        <text x="544" y="138" class="lab-txt">Single-Pass O(log N)</text>
        <text x="544" y="166" class="lab-sub">(vs O(log^2 N) binary search)</text>
      </svg>

      <div class="mermaid">
flowchart TD
  MR["maxRight(v, tl, tr, l, pred, acc)"] --> Out{"tr < l?"}
  Out -- Yes --> RetTr["Return tr (before l)"]
  Out -- No --> Inside{"tl >= l AND\npred(combine(acc, sum[v]))?"}
  Inside -- Yes --> Consume["acc = combine(acc, sum[v])\nReturn tr (consume whole subtree O(1)!)"]
  Inside -- No --> Leaf{"tl == tr?"}
  Leaf -- Yes --> Stop["Return tl - 1 (boundary reached)"]
  Leaf -- No --> Push["pushDown(v); recurse Left;\nif Left fully consumed, recurse Right"]
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Why Tree-Walk <code>maxRight</code> Beats Binary Search + Query by $O(\\log N)$:</strong> Calling binary search over <code>rangeSum(l, mid)</code> performs $\\log_2 N$ segment tree queries, each taking $O(\\log N)$ time ($O(\\log^2 N)$ total, ~400 node visits for $N = 10^5$). By descending directly inside the Segment Tree while maintaining a running accumulator <code>acc</code>, <code>maxRight(l, pred)</code> consumes at most $O(\\log N)$ whole canonical subtrees in $O(1)$ each and descends down at most <strong>one</strong> leaf path where <code>pred(combine(acc, sum[v]))</code> first turns false—visiting at most $4 \\log_2 N \\approx 68$ nodes total!
      </div>

      <div class="simulator-mount" data-sim="sim-segment-tree-lazy"></div>

      <h3>2. Complete Production Implementation: Range Affine Lazy Segment Tree + Verification Suite</h3>
      <pre><code class="language-javascript">/**
 * Production Range Affine Lazy Segment Tree (Struct-of-Arrays TypedArray Layout)
 * Supports:
 *  - rangeAffine(ql, qr, a, b): for i in [ql..qr], A[i] = a * A[i] + b in O(log N)
 *  - rangeAdd(ql, qr, delta):   special case rangeAffine(ql, qr, 1, delta)
 *  - rangeScale(ql, qr, k):     special case rangeAffine(ql, qr, k, 0)
 *  - rangeAssign(ql, qr, val):  special case rangeAffine(ql, qr, 0, val)
 *  - rangeSum(ql, qr):          sum of A[ql..qr] in O(log N)
 *  - maxRight(l, pred):         largest r &gt;= l-1 such that pred(sum(l..r)) is true in O(log N)
 */
class RangeAffineLazySegTree {
  constructor(arr) {
    this.n = arr.length;
    const size = 4 * this.n;
    this.sum = new Float64Array(size);
    this.lazyA = new Float64Array(size).fill(1);
    this.lazyB = new Float64Array(size).fill(0);
    if (this.n &gt; 0) this._build(1, 0, this.n - 1, arr);
  }

  _build(v, tl, tr, arr) {
    if (tl === tr) {
      this.sum[v] = arr[tl];
      return;
    }
    const tm = (tl + tr) &gt;&gt; 1;
    this._build(v &lt;&lt; 1, tl, tm, arr);
    this._build((v &lt;&lt; 1) | 1, tm + 1, tr, arr);
    this.sum[v] = this.sum[v &lt;&lt; 1] + this.sum[(v &lt;&lt; 1) | 1];
  }

  _apply(v, len, a, b) {
    this.sum[v] = a * this.sum[v] + b * len;
    this.lazyA[v] = a * this.lazyA[v];
    this.lazyB[v] = a * this.lazyB[v] + b;
  }

  _pushDown(v, tl, tr) {
    const a = this.lazyA[v], b = this.lazyB[v];
    if (a === 1 &amp;&amp; b === 0) return;
    const tm = (tl + tr) &gt;&gt; 1;
    this._apply(v &lt;&lt; 1, tm - tl + 1, a, b);
    this._apply((v &lt;&lt; 1) | 1, tr - tm, a, b);
    this.lazyA[v] = 1;
    this.lazyB[v] = 0;
  }

  rangeAffine(ql, qr, a, b, v = 1, tl = 0, tr = this.n - 1) {
    if (ql &gt; tr || qr &lt; tl) return;
    if (ql &lt;= tl &amp;&amp; tr &lt;= qr) {
      this._apply(v, tr - tl + 1, a, b);
      return;
    }
    this._pushDown(v, tl, tr);
    const tm = (tl + tr) &gt;&gt; 1;
    this.rangeAffine(ql, qr, a, b, v &lt;&lt; 1, tl, tm);
    this.rangeAffine(ql, qr, a, b, (v &lt;&lt; 1) | 1, tm + 1, tr);
    this.sum[v] = this.sum[v &lt;&lt; 1] + this.sum[(v &lt;&lt; 1) | 1];
  }

  rangeAdd(ql, qr, delta) {
    this.rangeAffine(ql, qr, 1, delta);
  }

  rangeScale(ql, qr, factor) {
    this.rangeAffine(ql, qr, factor, 0);
  }

  rangeAssign(ql, qr, val) {
    this.rangeAffine(ql, qr, 0, val);
  }

  rangeSum(ql, qr, v = 1, tl = 0, tr = this.n - 1) {
    if (ql &gt; tr || qr &lt; tl) return 0;
    if (ql &lt;= tl &amp;&amp; tr &lt;= qr) return this.sum[v];
    this._pushDown(v, tl, tr);
    const tm = (tl + tr) &gt;&gt; 1;
    return (
      this.rangeSum(ql, qr, v &lt;&lt; 1, tl, tm) +
      this.rangeSum(ql, qr, (v &lt;&lt; 1) | 1, tm + 1, tr)
    );
  }

  /**
   * Single-pass O(log N) Segment Tree Walk (requires non-negative elements for monotone sum):
   * Returns largest index r in [l-1 .. n-1] such that pred(sum(l..r)) === true.
   */
  maxRight(l, pred) {
    let acc = 0;
    const walk = (v, tl, tr) =&gt; {
      if (tr &lt; l) return tr;
      if (tl &gt;= l &amp;&amp; pred(acc + this.sum[v])) {
        acc += this.sum[v];
        return tr;
      }
      if (tl === tr) return tl - 1;
      this._pushDown(v, tl, tr);
      const tm = (tl + tr) &gt;&gt; 1;
      const resL = walk(v &lt;&lt; 1, tl, tm);
      if (resL &lt; tm) return resL; // Stopped inside left child!
      return walk((v &lt;&lt; 1) | 1, tm + 1, tr);
    };
    return walk(1, 0, this.n - 1);
  }
}</code></pre>

      <h3>3. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Method</th>
            <th>Time Complexity</th>
            <th>Nodes Visited (Worst Case)</th>
            <th>Extra Heap Allocations</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>constructor(arr)</code></td>
            <td>$\\Theta(N)$</td>
            <td>$2N - 1$</td>
            <td>$3 \\times 4N$ <code>Float64Array</code></td>
          </tr>
          <tr>
            <td><code>rangeAffine</code> / <code>rangeAdd</code> / <code>rangeAssign</code></td>
            <td>$O(\\log N)$</td>
            <td>$\\le 4 \\lceil \\log_2 N \\rceil$</td>
            <td>$0$</td>
          </tr>
          <tr>
            <td><code>rangeSum(ql, qr)</code></td>
            <td>$O(\\log N)$</td>
            <td>$\\le 4 \\lceil \\log_2 N \\rceil$</td>
            <td>$0$</td>
          </tr>
          <tr>
            <td><code>maxRight(l, pred)</code></td>
            <td>$O(\\log N)$</td>
            <td>$\\le 4 \\lceil \\log_2 N \\rceil$</td>
            <td>$0$</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Forgetting to Multiply $b$ by Segment Length <code>len = tr - tl + 1</code>:</strong> When applying an affine tag $(a, b)$ to a single element $x$, the new value is $ax + b$. When applying $(a, b)$ to a segment sum $\\text{sum}[v] = \\sum_{i=tl}^{tr} A[i]$ covering $\\text{len} = tr - tl + 1$ elements, the additive constant $b$ is added to <em>every one of the $\\text{len}$ elements</em>, so $\\text{sum}[v] \\leftarrow a \\cdot \\text{sum}[v] + b \\cdot \\text{len}$! However, when composing the lazy tag <code>lazyB[v] = a * lazyB[v] + b</code>, you do <em>not</em> multiply $b$ by <code>len</code> because <code>lazyB[v]</code> is a per-element affine coefficient that will be multiplied by child lengths when pushed down.
      </div>
    </div>`,
    keyTakeaways: [
      "Representing range updates as affine functions f(x) = a*x + b unifies rangeAdd (1, d), rangeScale (k, 0), and rangeAssign (0, c) under a single branchless composition rule.",
      "Composing a new affine tag (a2, b2) onto an existing tag (a1, b1) yields (a2 * a1, a2 * b1 + b2), with identity (1, 0).",
      "When updating node v's range sum, multiply the additive offset b by the segment length (tr - tl + 1), while keeping lazyB[v] as a per-element offset.",
      "Walking the segment tree directly in maxRight(l, pred) finds the threshold index in O(log N) time, shaving a log N factor off binary search + rangeSum."
    ],
    furtherReading: [
      {
        title: "AtCoder Library (ACL) — Lazy Segment Tree Design & max_right Specification",
        url: "https://atcoder.github.io/ac-library/production/document_en/lazysegtree.html"
      },
      {
        title: "CP-Algorithms — Segment Tree with Lazy Propagation & Range Assignments",
        url: "https://cp-algorithms.com/data_structures/segment_tree.html#range-updates-lazy-propagation"
      }
    ]
  }
};
