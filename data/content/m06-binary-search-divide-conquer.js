window.MODULE_CONTENT = window.MODULE_CONTENT || {};
window.MODULE_CONTENT["m06"] = {
  "binary-search-boundary-invariants": {
    title: "Closed vs Half-Open Binary Search: Eliminating Off-by-One Infinite Loops",
    video: {
      youtubeId: "GU7DpgHINWQ",
      id: "GU7DpgHINWQ",
      url: "https://www.youtube.com/embed/GU7DpgHINWQ",
      title: "Binary Search Boundary Invariants & Monotonic Predicates (Without Off-by-One Bugs)",
      channel: "Errichto Algorithms",
      duration: "32:44",
      start: 0,
      length: "32m",
      why: "Demonstrates why ad-hoc binary search implementations fail on 2-element boundary cases and establishes the monotonic F...FT...T predicate partition invariant."
    },
    intuition: "Stop thinking of binary search as 'looking for a target value' and start viewing it as locating the unique boundary between <strong>False</strong> and <strong>True</strong> in a monotonic boolean array $[F, F, \\dots, F, T, T, \\dots, T]$. When you maintain the strict invariant that $lo$ lies in the False region and $hi$ lies in the True region, off-by-one bugs and 2-element infinite loops become mathematically impossible.",
    content: `
      <div class="lesson-content">
        <h2>Why Binary Search Bugs Persisted for 60 Years</h2>
        <p>Jon Bentley famously reported in <em>Programming Pearls</em> that over $90\\%$ of professional programmers failed to write a bug-free binary search in an hour, and Joshua Bloch revealed in 2006 that Java's <code>Arrays.binarySearch</code> had contained a signed integer overflow bug (<code>int mid = (low + high) / 2;</code> overflowing when <code>low + high &gt;= 2^31</code>) for nearly a decade. Every binary search bug stems from one of two root causes:</p>
        <ol>
          <li><strong>Signed Midpoint Overflow:</strong> Writing <code>(lo + hi) / 2</code> instead of <code>lo + (hi - lo) / 2</code> or C++20's overflow-free <code>std::midpoint(lo, hi)</code>.</li>
          <li><strong>2-Element Infinite Loops (<code>lo = mid</code> with Floor Rounding):</strong> When $hi = lo + 1$, integer floor division sets $mid = \\lfloor(lo + hi)/2\\rfloor = lo$. If the loop body executes <code>lo = mid</code> without advancing past $mid$, the interval $[lo, hi]$ never shrinks and loops forever!</li>
        </ol>

        <div class="invariant-box">
          <div class="invariant-title">The Three Canonical Boundary Formulations (<code>lower_bound</code> / First True)</div>
          <p>Let $P : \\{0, \\dots, n-1\\} \\to \\{\\text{False}, \\text{True}\\}$ be a monotonic predicate (if $P(i)$ is True, then $P(j)$ is True for all $j \\ge i$). Extending conventionally with virtual sentinels $P(-1) = \\text{False}$ and $P(n) = \\text{True}$, we seek the <strong>first index $i \\in [0, n]$ where $P(i)$ is True</strong> ( returning $n$ if all elements are False):</p>
          <ul>
            <li><strong>1. C++ STL Half-Open Interval $[lo, hi)$ (<code>lo = 0, hi = n</code>):</strong>
              <br><em>Invariant:</em> All indices $< lo$ are False; all indices $\\ge hi$ are True.
              <br><em>Loop:</em> <code>while (lo &lt; hi)</code> with <code>mid = lo + (hi - lo) / 2</code>. Since $lo < hi$, $mid \\in [lo, hi - 1]$ strictly!
              <br><em>Update:</em> If $P(mid)$ is True, the first True is $\\le mid$, so set <code>hi = mid</code> (shrinks because $mid < hi$). If $P(mid)$ is False, the first True is $> mid$, so set <code>lo = mid + 1</code> (shrinks because $mid + 1 > lo$). Terminates at $lo == hi$ in $\\lceil \\log_2(n+1) \\rceil$ steps.</li>
            <li><strong>2. Dijkstra / TopCoder Open-Interval Dual Sentinel $(lo, hi)$ (<code>lo = -1, hi = n</code>):</strong>
              <br><em>Invariant:</em> $P(lo)$ is always False; $P(hi)$ is always True.
              <br><em>Loop:</em> <code>while (hi - lo &gt; 1)</code> with <code>mid = lo + (hi - lo) / 2</code>. Because $hi - lo \\ge 2$, $lo < mid < hi$ is <em>strictly interior</em>, so BOTH <code>lo = mid</code> and <code>hi = mid</code> strictly shrink $hi - lo$! At termination, $hi = lo + 1$: <code>lo</code> is the <strong>last False</strong> and <code>hi</code> is the <strong>first True</strong>.</li>
            <li><strong>3. Closed Interval $[lo, hi]$ (<code>lo = 0, hi = n - 1</code>):</strong>
              <br><em>Loop:</em> <code>while (lo &lt;= hi)</code> with <code>lo = mid + 1</code> and <code>hi = mid - 1</code>. Requires $3$-way branching or tracking an explicit <code>ans</code> variable because <code>hi = mid - 1</code> discards $mid$ from the interval.</li>
          </ul>
        </div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Formulation</th>
              <th>Initial Bounds</th>
              <th>Loop Condition</th>
              <th>Updates ($P(mid)$ True / False)</th>
              <th>Post-Loop State</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Half-Open $[lo, hi)$ (STL <code>lower_bound</code>)</strong></td>
              <td><code>lo = 0, hi = n</code></td>
              <td><code>lo &lt; hi</code></td>
              <td><code>hi = mid</code> / <code>lo = mid + 1</code></td>
              <td><code>lo == hi</code> (First True in $[0, n]$)</td>
            </tr>
            <tr>
              <td><strong>Open Sentinels $(lo, hi)$ (Dijkstra)</strong></td>
              <td><code>lo = -1, hi = n</code></td>
              <td><code>hi - lo &gt; 1</code></td>
              <td><code>hi = mid</code> / <code>lo = mid</code></td>
              <td><code>lo</code> = Last False, <code>hi</code> = First True</td>
            </tr>
            <tr>
              <td><strong>Closed $[lo, hi]$ (Classic 3-Way)</strong></td>
              <td><code>lo = 0, hi = n - 1</code></td>
              <td><code>lo &lt;= hi</code></td>
              <td><code>hi = mid - 1</code> / <code>lo = mid + 1</code></td>
              <td><code>lo == hi + 1</code> (Insertion point <code>lo</code>)</td>
            </tr>
            <tr>
              <td><strong>Meta / Bitwise Jump Binary Search</strong></td>
              <td><code>pos = 0, bit = 1 &lt;&lt; lg(n)</code></td>
              <td><code>bit &gt; 0</code></td>
              <td><code>if (!P(pos + bit)) pos += bit</code></td>
              <td><code>pos</code> = Last False, <code>pos + 1</code> = First True</td>
            </tr>
          </tbody>
        </table>

        <svg viewBox="0 0 760 215" class="lesson-svg" role="img" aria-label="Monotonic predicate partition showing False prefix, True suffix, lower_bound and upper_bound">
          <rect width="760" height="215" rx="10" fill="#0f172a"/>
          <text x="20" y="26" fill="#f8fafc" font-size="13" font-weight="bold">Monotonic Predicate Partition: Every Binary Search Finds the F → T Cliff</text>
          <g transform="translate(25, 45)">
            <rect x="0" y="0" width="80" height="46" rx="5" fill="#7f1d1d" stroke="#f87171" stroke-dasharray="4 2"/>
            <text x="40" y="20" text-anchor="middle" fill="#fca5a5" font-size="11">idx -1</text>
            <text x="40" y="36" text-anchor="middle" fill="#fecaca" font-size="12" font-weight="bold">False</text>

            <rect x="88" y="0" width="80" height="46" rx="5" fill="#7f1d1d" stroke="#f87171" stroke-width="1.5"/>
            <text x="128" y="20" text-anchor="middle" fill="#fca5a5" font-size="11">A[0] = 2</text>
            <text x="128" y="36" text-anchor="middle" fill="#fecaca" font-size="12" font-weight="bold">False</text>

            <rect x="176" y="0" width="80" height="46" rx="5" fill="#7f1d1d" stroke="#f87171" stroke-width="1.5"/>
            <text x="216" y="20" text-anchor="middle" fill="#fca5a5" font-size="11">A[1] = 5</text>
            <text x="216" y="36" text-anchor="middle" fill="#fecaca" font-size="12" font-weight="bold">False</text>

            <rect x="264" y="0" width="80" height="46" rx="5" fill="#7f1d1d" stroke="#f87171" stroke-width="2.5"/>
            <text x="304" y="20" text-anchor="middle" fill="#fca5a5" font-size="11">A[2] = 8</text>
            <text x="304" y="36" text-anchor="middle" fill="#fecaca" font-size="12" font-weight="bold">Last F (lo)</text>

            <line x1="352" y1="-10" x2="352" y2="62" stroke="#fbbf24" stroke-width="3" stroke-dasharray="5 3"/>

            <rect x="360" y="0" width="85" height="46" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
            <text x="402" y="20" text-anchor="middle" fill="#6ee7b7" font-size="11">A[3] = 12</text>
            <text x="402" y="36" text-anchor="middle" fill="#a7f3d0" font-size="12" font-weight="bold">First T (hi)</text>

            <rect x="453" y="0" width="80" height="46" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
            <text x="493" y="20" text-anchor="middle" fill="#6ee7b7" font-size="11">A[4] = 12</text>
            <text x="493" y="36" text-anchor="middle" fill="#a7f3d0" font-size="12" font-weight="bold">True</text>

            <rect x="541" y="0" width="80" height="46" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
            <text x="581" y="20" text-anchor="middle" fill="#6ee7b7" font-size="11">A[5] = 19</text>
            <text x="581" y="36" text-anchor="middle" fill="#a7f3d0" font-size="12" font-weight="bold">True</text>

            <rect x="629" y="0" width="80" height="46" rx="5" fill="#064e3b" stroke="#10b981" stroke-dasharray="4 2"/>
            <text x="669" y="20" text-anchor="middle" fill="#6ee7b7" font-size="11">idx n=6</text>
            <text x="669" y="36" text-anchor="middle" fill="#a7f3d0" font-size="12" font-weight="bold">True</text>
          </g>
          <text x="25" y="130" fill="#fbbf24" font-size="12.5" font-weight="bold">• std::lower_bound(x=12): Predicate P(i) := (A[i] &gt;= 12) → First True is index 3</text>
          <text x="25" y="154" fill="#38bdf8" font-size="12.5" font-weight="bold">• std::upper_bound(x=12): Predicate P(i) := (A[i] &gt; 12)  → First True is index 5</text>
          <text x="25" y="178" fill="#34d399" font-size="12.5" font-weight="bold">• Count of elements equal to 12 = upper_bound(12) - lower_bound(12) = 5 - 3 = 2 (Range [3, 5))</text>
        </svg>

        <div class="mermaid">
flowchart LR
  A["Half-Open Range [lo, hi)\nwith lo < hi"] --> B["mid = lo + (hi - lo) / 2\nGuaranteed: lo <= mid < hi"]
  B --> C{"Predicate P(mid)?"}
  C -- "True (mid could be First True)" --> D["hi = mid\n(Shrinks since mid < hi)"]
  C -- "False (mid cannot be True)" --> E["lo = mid + 1\n(Shrinks since mid + 1 > lo)"]
  D --> F["Loop Ends at lo == hi:\nExact First True Index!"]
  E --> F
        </div>

        <div class="simulator-mount" data-sim="sim-binary-search-decision"></div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Branchless Bitwise (Meta) Binary Search &amp; <code>CMOV</code></div>
          <p>In a standard <code>while (lo &lt; hi)</code> loop, the condition <code>if (a[mid] &lt; target)</code> is data-dependent and unpredictable (50/50 outcome), incurring ~15 cycles per branch misprediction. By instead writing the search as a fixed $\\lfloor \\log_2 n \\rfloor + 1$ iteration loop (or <code>while (len &gt; 1) { size_t half = len / 2; base += (a[base + half] &lt; target) * half; len -= half; }</code>), Clang and GCC emit a single <strong>branchless conditional move (<code>CMOV</code>)</strong> instruction! Even though a 2-way comparison always checks $\\lceil \\log_2 n \\rceil$ elements instead of stopping early when <code>a[mid] == target</code>, avoiding early-exit branches is faster because early hits occur on fewer than $2/n$ of queries while the extra equality branch slows down $99.9\\%$ of queries.</p>
        </div>

        <h2>Production C++20 Implementation: Half-Open <code>lower_bound</code>, <code>upper_bound</code> &amp; Branchless Search</h2>
        <pre><code class="language-cpp">#include &lt;bit&gt;
#include &lt;concepts&gt;
#include &lt;cstddef&gt;
#include &lt;numeric&gt;

// 1. Canonical Half-Open [lo, hi) lower_bound: First index i in [0, n] with !(a[i] &lt; target)
template &lt;std::totally_ordered T&gt;
constexpr std::size_t lower_bound_half_open(const T* a, std::size_t n, const T&amp; target) noexcept {
    std::size_t lo = 0;
    std::size_t hi = n; // Half-open [0, n): n is the "not found / past-the-end" sentinel
    while (lo &lt; hi) {
        const std::size_t mid = std::midpoint(lo, hi); // Overflow-safe lo + (hi - lo) / 2
        if (a[mid] &lt; target) {
            lo = mid + 1; // mid is strictly False; advance past mid
        } else {
            hi = mid;     // mid is True (a[mid] &gt;= target); keep mid in candidate range
        }
    }
    return lo;
}

// 2. Canonical Half-Open [lo, hi) upper_bound: First index i in [0, n] with target &lt; a[i]
template &lt;std::totally_ordered T&gt;
constexpr std::size_t upper_bound_half_open(const T* a, std::size_t n, const T&amp; target) noexcept {
    std::size_t lo = 0;
    std::size_t hi = n;
    while (lo &lt; hi) {
        const std::size_t mid = std::midpoint(lo, hi);
        if (!(target &lt; a[mid])) { // a[mid] &lt;= target (False)
            lo = mid + 1;
        } else {                  // a[mid] &gt; target  (True)
            hi = mid;
        }
    }
    return lo;
}

// 3. Branchless CMOV Lower Bound (Paul-Virak Khuong &amp; Pat Morin style)
template &lt;std::totally_ordered T&gt;
constexpr std::size_t lower_bound_branchless(const T* a, std::size_t n, const T&amp; target) noexcept {
    if (n == 0) return 0;
    const T* base = a;
    std::size_t len = n;
    while (len &gt; 1) {
        const std::size_t half = len &gt;&gt; 1;
        // Compiles to a single CMP + CMOV with zero branch mispredictions!
        base += (base[half - 1] &lt; target) ? half : 0;
        len -= half;
    }
    return static_cast&lt;std::size_t&gt;(base - a) + ((*base &lt; target) ? 1U : 0U);
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Finding the "Last False" with <code>lo = mid</code> Requires Upper-Midpoint Rounding!</div>
          <p>Suppose you use a closed interval $[lo, hi]$ to find the <strong>last False</strong> index, updating <code>lo = mid</code> when $P(mid)$ is False and <code>hi = mid - 1</code> when $P(mid)$ is True. If you compute <code>mid = lo + (hi - lo) / 2</code> (floor division), then when $hi = lo + 1$ and $P(lo)$ is False, $mid = lo$ and <code>lo = mid</code> loops forever! Whenever a binary search branch assigns <code>lo = mid</code>, you <strong>must</strong> round the midpoint <em>up</em> via <code>mid = lo + (hi - lo + 1) / 2</code>—or better yet, use the open sentinel loop <code>while (hi - lo &gt; 1)</code> where $lo < mid < hi$ is guaranteed automatically!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Formulate every binary search as finding the transition point of a monotonic predicate P(i) changing from False to True.",
      "In the half-open interval [lo, hi) with while (lo < hi) and mid = lo + (hi - lo) / 2, mid is strictly less than hi, so hi = mid and lo = mid + 1 both strictly shrink the interval on every iteration.",
      "In Dijkstra's open-sentinel interval (lo, hi) with lo = -1, hi = n, and while (hi - lo > 1), mid is strictly interior (lo < mid < hi), allowing symmetrical lo = mid and hi = mid updates without rounding tricks.",
      "Two-way branchless binary search outperforms three-way early-exit binary search on modern CPUs by replacing unpredictable branches with single-cycle conditional moves (CMOV)."
    ],
    furtherReading: [
      {
        title: "Khuong & Morin (2017) — Array Layouts for Comparison-Based Searching (ACM JEA)",
        url: "https://arxiv.org/abs/1509.05053"
      },
      {
        title: "Knuth — The Art of Computer Programming, Vol. 3: Sorting and Searching (§6.2.1 Searching an Ordered Table)",
        url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html"
      },
      {
        title: "Bentley — Programming Pearls (2nd Ed.), Column 4: Writing Correct Programs",
        url: "https://www.cs.bell-labs.com/cm/cs/pearls/"
      }
    ]
  },

  "parametric-search-answer-space": {
    title: "Parametric Search: Binary Searching the Answer Space & Feasibility Predicates",
    video: {
      youtubeId: "JAfJssvFgDI",
      id: "JAfJssvFgDI",
      url: "https://www.youtube.com/embed/JAfJssvFgDI",
      title: "Parametric Search: Binary Searching the Answer Space with Monotonic Predicates",
      channel: "Luv CP",
      duration: "25:10",
      start: 0,
      length: "25m",
      why: "Shows how optimization problems ('minimize the maximum capacity/time X') reduce to binary searching an implicit monotonic decision predicate feasible(X)."
    },
    intuition: "When a problem asks to <em>minimize the maximum</em> resource $X$ (or <em>maximize the minimum</em> separation $X$) and computing the optimal $X$ directly feels intractable, flip the question on its head: <em>'If someone hands me a fixed budget $X$, can I verify whether $X$ is achievable in $O(N)$ time?'</em> Whenever feasibility is monotonic ($\\text{feasible}(X) \\implies \\text{feasible}(X + 1)$), binary search finds the exact optimal threshold $X^*$ in $O(N \\log(\\text{range}))$ time.",
    content: `
      <div class="lesson-content">
        <h2>Optimization vs. Decision Duality (Megiddo's Parametric Search)</h2>
        <p>Many combinatorial optimization problems have the form:</p>
        $$\\min \\,\\{ X \\in [L, R] : \\text{feasible}(X) = \\text{True} \\} \\quad \\text{or} \\quad \\max \\,\\{ X \\in [L, R] : \\text{feasible}(X) = \\text{True} \\}$$
        <p>Constructing the globally optimal schedule or partition from scratch can require dynamic programming in $O(N^2 K)$ time. Yet checking the <strong>decision problem</strong>—given a candidate threshold $X$, does there exist a valid configuration with cost $\\le X$?—can often be solved by a simple <strong>$O(N)$ greedy scan</strong>! This reduction is valid whenever the feasibility predicate satisfies <strong>monotonicity</strong>:</p>
        <ul>
          <li><strong>Minimization (False $\\to$ True):</strong> If budget $X$ is sufficient, any larger budget $X' > X$ is also sufficient ($[F, F, \\dots, F, T, T, \\dots, T]$). We seek the <em>first True</em>.</li>
          <li><strong>Maximization (True $\\to$ False):</strong> If minimum separation $X$ is achievable, any smaller separation $X' < X$ is also achievable ($[T, T, \\dots, T, F, F, \\dots, F]$). We seek the <em>last True</em>.</li>
        </ul>

        <div class="invariant-box">
          <div class="invariant-title">Three Classic Parametric Search Reductions</div>
          <ol>
            <li><strong>Min-Max Array Partitioning (Painter's Partition / Split Array Largest Sum / Book Allocation):</strong> Partition an array of non-negative weights $w_0, \\dots, w_{n-1}$ into at most $k$ contiguous subarrays to minimize the maximum subarray sum $X$.
              <br><em>Bounds:</em> $L = \\max_i w_i$ (each item must fit in some bucket), $R = \\sum_i w_i$ (all items in 1 bucket).
              <br><em>Greedy Check $O(n)$:</em> Pack items left-to-right into the current bucket as long as <code>cur_sum + w[i] &lt;= X</code>; start a new bucket whenever it overflows. $X$ is feasible iff total buckets used $\\le k$.</li>
            <li><strong>Max-Min Geometric Placement (Aggressive Cows / Magnetic Force):</strong> Place $k$ points among $n$ sorted coordinates $x_0 < \\dots < x_{n-1}$ to maximize the minimum distance $D$ between any pair.
              <br><em>Greedy Check $O(n)$:</em> Place the first point at $x_0$, and greedily place each subsequent point at the first $x_i \\ge \\text{last\\_pos} + D$. $D$ is feasible iff $\\ge k$ points are placed.</li>
            <li><strong>0-1 Fractional Programming (Maximum Ratio Cycle / Best Average Subset):</strong> Maximize $\\frac{\\sum_{i \\in S} a_i}{\\sum_{i \\in S} b_i}$ ($b_i > 0$) subject to $|S| \\ge k$.
              <br><em>Dinkelbach / Parametric Reduction:</em> A ratio $\\ge \\lambda$ is achievable iff $\\max_{|S| \\ge k} \\sum_{i \\in S} (a_i - \\lambda b_i) \\ge 0$! Transforming each item's weight to $c_i(\\lambda) = a_i - \\lambda b_i$ turns a non-linear ratio optimization into a linear sum check!</li>
          </ol>
        </div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Problem Class</th>
              <th>Direct DP / Naive Complexity</th>
              <th>Parametric Search Complexity</th>
              <th>Monotonicity Prerequisite</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Split Array into $K$ Subarrays</strong></td>
              <td>$O(N^2 K)$ DP</td>
              <td>$O\\!\\left(N \\log(\\sum w_i)\\right)$</td>
              <td><strong>$w_i \\ge 0$ mandatory!</strong> (Negative weights break greedy packing)</td>
            </tr>
            <tr>
              <td><strong>$K$-th Smallest in $M \\times N$ Sorted Matrix</strong></td>
              <td>$O(M N \\log(MN))$ or $O(K \\log M)$</td>
              <td>$O\\!\\left((M + N) \\log(\\text{max} - \\text{min})\\right)$</td>
              <td>Count of elements $\\le X$ is monotonically non-decreasing in $X$</td>
            </tr>
            <tr>
              <td><strong>0-1 Fractional Programming ($\\max \\frac{\\sum a_i}{\\sum b_i}$)</strong></td>
              <td>Exponential / Non-linear</td>
              <td>$O\\!\\left(N \\log N \\cdot \\log(\\frac{\\text{range}}{\\varepsilon})\\right)$</td>
              <td>$b_i > 0$ so $f(\\lambda) = \\max \\sum(a_i - \\lambda b_i)$ is strictly decreasing</td>
            </tr>
            <tr>
              <td><strong>Continuous Real-Valued Search</strong></td>
              <td>Analytical solver</td>
              <td>Fixed $60\\text{–}80$ iterations ($2^{-60} \\approx 10^{-18}$)</td>
              <td>Monotonic continuous predicate over IEEE-754 <code>double</code></td>
            </tr>
          </tbody>
        </table>

        <svg viewBox="0 0 760 205" class="lesson-svg" role="img" aria-label="Parametric search over continuous and discrete answer spaces">
          <rect width="760" height="205" rx="10" fill="#0f172a"/>
          <text x="20" y="26" fill="#f8fafc" font-size="13" font-weight="bold">Parametric Search Pipeline: Decoupling the Binary Search Driver from the O(N) Greedy Verifier</text>
          <g transform="translate(25, 46)">
            <rect x="0" y="10" width="210" height="86" rx="8" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
            <text x="105" y="38" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="bold">Answer Space [lo, hi]</text>
            <text x="105" y="60" text-anchor="middle" fill="#bae6fd" font-size="11">lo = max(w_i), hi = sum(w_i)</text>
            <text x="105" y="80" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">Propose mid = lo + (hi-lo)/2</text>

            <path d="M 215 40 L 295 40" stroke="#38bdf8" stroke-width="2.5"/>
            <text x="255" y="32" text-anchor="middle" fill="#38bdf8" font-size="11">Candidate X</text>

            <rect x="300" y="10" width="230" height="86" rx="8" fill="#311042" stroke="#c084fc" stroke-width="2"/>
            <text x="415" y="38" text-anchor="middle" fill="#f3e8ff" font-size="13" font-weight="bold">O(N) Greedy Oracle</text>
            <text x="415" y="60" text-anchor="middle" fill="#e9d5ff" font-size="11">feasible(X): Count buckets needed</text>
            <text x="415" y="80" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="bold">Returns: buckets_used &lt;= K</text>

            <path d="M 535 35 L 595 22" stroke="#10b981" stroke-width="2"/>
            <path d="M 535 65 L 595 78" stroke="#f87171" stroke-width="2"/>

            <rect x="600" y="4" width="115" height="36" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
            <text x="657" y="26" text-anchor="middle" fill="#6ee7b7" font-size="11" font-weight="bold">True → hi = mid</text>

            <rect x="600" y="60" width="115" height="36" rx="5" fill="#7f1d1d" stroke="#f87171" stroke-width="1.5"/>
            <text x="657" y="82" text-anchor="middle" fill="#fecaca" font-size="11" font-weight="bold">False → lo = mid+1</text>
          </g>
          <text x="25" y="168" fill="#94a3b8" font-size="12">Even if sum(w_i) = 10^14, log₂(10^14) ≈ 47 iterations! The O(N) greedy check runs only 47 times over L1-cached data.</text>
        </svg>

        <div class="mermaid">
flowchart LR
  A["Optimization Goal:\nMinimize Max Cost X"] --> B["Identify Tight Bounds:\nlo = max_i(w_i), hi = sum_i(w_i)"]
  B --> C["Write O(N) Decision Oracle:\nbool feasible(X)"]
  C --> D["Verify Monotonicity:\nDoes feasible(X) ⇒ feasible(X+1)?"]
  D --> E["Half-Open Binary Search\non [lo, hi) in O(N log(hi - lo))"]
        </div>

        <div class="simulator-mount" data-sim="sim-binary-search-decision"></div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Floating-Point Binary Search Trap (<code>while (hi - lo &gt; eps)</code> Infinite Loops!)</div>
          <p>When binary searching over continuous IEEE-754 <code>double</code> values, writing <code>while (hi - lo &gt; 1e-9)</code> is a classic production time-bomb! An IEEE-754 <code>double</code> has 53 bits of significand precision ($\approx 15\text{–}17$ decimal digits). If your answer $X$ is around $10^8$, the spacing between adjacent representable doubles (1 ULP = $2^{-52} \\times 10^8 \\approx 2.2 \\times 10^{-8}$) is <strong>larger than <code>1e-9</code></strong>! At that point, <code>mid = (lo + hi) * 0.5</code> rounds to either exact <code>lo</code> or exact <code>hi</code>, and <code>while (hi - lo &gt; 1e-9)</code> spins in an infinite loop forever. <strong>Golden Rule:</strong> For floating-point binary search, always use a <strong>fixed iteration count</strong> (<code>for (int iter = 0; iter < 70; ++iter)</code>), which halves the interval $2^{70} \\approx 10^{21}$ times down to machine epsilon and guarantees termination!</p>
        </div>

        <h2>Production C++20 Implementation: Discrete Min-Max Partition &amp; Continuous 0-1 Fractional Search</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstddef&gt;
#include &lt;cstdint&gt;
#include &lt;numeric&gt;
#include &lt;vector&gt;

// 1. Discrete Parametric Search: Split array w of non-negative ints into &lt;= k contiguous subarrays
//    minimizing the maximum subarray sum. Time: O(N log(sum(w))), Space: O(1).
std::int64_t minimize_max_subarray_sum(const std::vector&lt;std::int64_t&gt;&amp; w, std::size_t k) noexcept {
    std::int64_t lo = *std::max_element(w.begin(), w.end());
    std::int64_t hi = std::accumulate(w.begin(), w.end(), std::int64_t{0});

    auto feasible = [&amp;](std::int64_t cap) noexcept -&gt; bool {
        std::size_t buckets = 1;
        std::int64_t cur = 0;
        for (std::int64_t x : w) {
            if (cur + x &gt; cap) {
                ++buckets;
                cur = x;
                if (buckets &gt; k) return false; // Early exit!
            } else {
                cur += x;
            }
        }
        return true;
    };

    while (lo &lt; hi) {
        const std::int64_t mid = lo + (hi - lo) / 2;
        if (feasible(mid)) hi = mid;
        else               lo = mid + 1;
    }
    return lo;
}

// 2. Continuous Parametric Search (0-1 Fractional Programming):
//    Choose exactly k items to maximize (sum a_i) / (sum b_i) where b_i &gt; 0.
double maximize_ratio_subset(const std::vector&lt;double&gt;&amp; a,
                             const std::vector&lt;double&gt;&amp; b,
                             std::size_t k) {
    const std::size_t n = a.size();
    double lo = 0.0, hi = 0.0;
    for (std::size_t i = 0; i &lt; n; ++i) hi = std::max(hi, a[i] / b[i]);

    std::vector&lt;double&gt; residuals(n);
    // Fixed 64 iterations: immune to IEEE-754 ULP underflow infinite loops!
    for (int iter = 0; iter &lt; 64; ++iter) {
        const double mid = lo + 0.5 * (hi - lo);
        for (std::size_t i = 0; i &lt; n; ++i) {
            residuals[i] = a[i] - mid * b[i];
        }
        // Use O(N) Introselect (nth_element) instead of O(N log N) sort to sum top k residuals!
        std::nth_element(residuals.begin(),
                         residuals.begin() + static_cast&lt;std::ptrdiff_t&gt;(k),
                         residuals.end(),
                         std::greater&lt;double&gt;{});
        double top_k_sum = 0.0;
        for (std::size_t i = 0; i &lt; k; ++i) top_k_sum += residuals[i];

        if (top_k_sum &gt;= 0.0) lo = mid;
        else                  hi = mid;
    }
    return lo;
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">When Parametric Search Fails: Non-Monotonic Predicates &amp; Negative Weights</div>
          <p>Before applying Parametric Search, <strong>prove two things</strong>:<br>
          1. <em>Monotonicity of the Answer Space:</em> Does $X$ always stay feasible for all $X' > X$? (For example, "Does there exist a subarray of exact sum $X$?" is <em>not</em> monotonic in $X$).<br>
          2. <em>Correctness of the Greedy Oracle:</em> In "Split Array Largest Sum", the greedy oracle <code>if (cur + x > cap)</code> works <strong>only because all weights $w_i \\ge 0$</strong>! If $w_i$ can be negative, extending a subarray further to the right might <em>decrease</em> its sum, so greedy left-to-right packing is no longer valid even though the global feasibility predicate is still monotonic in $X$!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Parametric Search transforms min-max or max-min optimization problems into a binary search over candidate answers X coupled with a fast O(N) feasibility check.",
      "In 0-1 Fractional Programming, testing whether (∑ a_i) / (∑ b_i) >= λ reduces to checking whether the top-k largest values of (a_i - λ b_i) sum to >= 0 (solvable in O(N) per step via std::nth_element).",
      "For floating-point binary search, always run a fixed number of iterations (60–80) rather than while (hi - lo > eps) to prevent infinite loops when eps is smaller than 1 ULP.",
      "Always verify that item weights satisfy the greedy oracle's precondition (e.g., w_i >= 0 for greedy prefix packing)."
    ],
    furtherReading: [
      {
        title: "Megiddo (1983) — Applying Parallel Computation Algorithms in the Design of Serial Algorithms (Parametric Search, JACM)",
        url: "https://doi.org/10.1145/2157.322410"
      },
      {
        title: "Erickson — Algorithms, Binary Search & Parametric Reductions",
        url: "https://jeffe.cs.illinois.edu/teaching/algorithms/"
      },
      {
        title: "CP-Algorithms — Binary Search & Fractional Programming",
        url: "https://cp-algorithms.com/num_methods/binary_search.html"
      }
    ]
  },

  "rotated-bitonic-unbounded-search": {
    title: "Exponential (Galloping) Search, Rotated Arrays & Ternary Search on Unimodal Functions",
    video: {
      youtubeId: "K1DIBa5UCMo",
      id: "K1DIBa5UCMo",
      url: "https://www.youtube.com/embed/K1DIBa5UCMo",
      title: "Ternary Search on Unimodal Functions & Convex Optimization",
      channel: "CodeDigger",
      duration: "14:20",
      start: 0,
      length: "14m",
      why: "Covers peak-finding invariants on bitonic/unimodal sequences, rotated sorted array midpoint classification, and unbounded search."
    },
    intuition: "Even when an array is not globally sorted—whether it is unbounded in length, cyclically rotated at an unknown pivot, or rises to a single peak before falling—we can still eliminate a constant fraction of the search space at every probe by comparing adjacent slopes or endpoint sentinels.",
    content: `
      <div class="lesson-content">
        <h2>1. Exponential (Galloping / Bentley-Yao) Search in $O(\\log i)$ Time</h2>
        <p>Suppose you want to search for a target $x$ in a sorted array of unknown (or enormous) size $N$, where $x$ is known to sit near the beginning (at index $i \\ll N$)—such as advancing a posting-list cursor in an inverted search index (Lucene/ripgrep) or TimSort's galloping merge. Standard binary search across $[0, N)$ always pays $\\lceil \\log_2 N \\rceil$ comparisons. <strong>Exponential Search</strong> (Bentley &amp; Yao, 1976) finds $x$ in $\\mathbf{2\\lfloor \\log_2 i \\rfloor + 2 = O(\\log i)}$ comparisons:</p>
        <ol>
          <li><strong>Doubling Phase:</strong> Probe indices $b = 1, 2, 4, 8, \\dots, 2^k$ until $A[2^k] \\ge x$ (or $2^k \\ge N$). Since $2^{k-1} \\le i \\le 2^k$, this takes $\\lfloor \\log_2 i \\rfloor + 1$ comparisons.</li>
          <li><strong>Binary Search Phase:</strong> Run standard binary search inside the bracketed half-open window $(2^{k-1}, \\min(2^k, N)]$, which has length $\\le 2^{k-1} \\le i$ and takes at most $\\lfloor \\log_2 i \\rfloor + 1$ comparisons!</li>
        </ol>

        <h2>2. Searching Cyclically Rotated Sorted Arrays</h2>
        <p>When a sorted array of distinct keys $A$ is cyclically rotated (e.g., $[40, 50, 60, 10, 20, 30]$), it splits into an <strong>Upper Sorted Prefix</strong> (all elements $\\ge A[0]$) followed by a <strong>Lower Sorted Suffix</strong> (all elements $< A[0]$, or $\\le A[n-1]$). We can either:</p>
        <ul>
          <li><strong>Find the Minimum Pivot Index in $\\log_2 n$ Steps:</strong> Apply monotonic binary search with predicate $P(i) := (A[i] \\le A[n-1])$, which evaluates to $[F, F, \\dots, F, T, T, \\dots, T]$ and returns the exact rotation minimum index!</li>
          <li><strong>Single-Pass Direct Rotated Search:</strong> At any midpoint $mid$, <strong>at least one of the two halves $[lo, mid]$ or $[mid, hi]$ is guaranteed to be strictly sorted</strong>! If $A[lo] \\le A[mid]$, the left half is sorted (so check if $target \\in [A[lo], A[mid])$); otherwise the right half $[mid, hi]$ is sorted (so check if $target \\in (A[mid], A[hi]]$).</li>
        </ul>

        <div class="invariant-box">
          <div class="invariant-title">3. Unimodal Optimization: Discrete Slope Binary Search vs. Continuous Ternary Search</div>
          <p>A function $f(x)$ on $[L, R]$ is <strong>strictly unimodal</strong> (peak-shaped) if it strictly increases on $[L, x^*]$ and strictly decreases on $[x^*, R]$ (or symmetrically valley-shaped / convex):</p>
          <ul>
            <li><strong>Discrete Unimodal / Bitonic Array $A[0 \\dots n-1]$:</strong> Do <em>not</em> use Ternary Search ($2$ probes per step)! Instead, compare <strong>adjacent elements</strong> $A[mid]$ and $A[mid + 1]$ in a standard binary search:
              <br>• If $A[mid] < A[mid + 1]$, we are on the rising left slope ($mid < i^*$), so <code>lo = mid + 1</code>.
              <br>• If $A[mid] > A[mid + 1]$, we are on the falling right slope ($mid \\ge i^*$), so <code>hi = mid</code>.
              <br>This locates the peak in $1 \\cdot \\log_2 n$ array accesses instead of Ternary Search's $2 \\log_{3/2} n \\approx 3.42 \\log_2 n$!</li>
            <li><strong>Continuous Unimodal Function $f(x)$:</strong> On a continuous interval $[lo, hi]$, we probe $m_1 = lo + (hi - lo)/3$ and $m_2 = hi - (hi - lo)/3$. If $f(m_1) < f(m_2)$, the maximum cannot lie in $[lo, m_1)$, so set $lo = m_1$; otherwise set $hi = m_2$, shrinking the interval to $\\frac{2}{3}$ of its length per step (or use <strong>Golden Section Search</strong> with ratio $\\varphi - 1 \\approx 0.618$ to reuse one of the two interior function evaluations from the previous iteration!).</li>
          </ul>
        </div>

        <div class="simulator-mount" data-sim="sim-binary-search-decision"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Search Problem</th>
              <th>Probes per Iteration</th>
              <th>Interval Shrink Factor</th>
              <th>Total Evaluations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Exponential (Galloping) Search</strong></td>
              <td>$1$ (doubling + binary)</td>
              <td>$2\\times$ expand, $1/2$ shrink</td>
              <td>$2\\lfloor \\log_2 i \\rfloor + 2 = O(\\log i)$</td>
            </tr>
            <tr>
              <td><strong>Rotated Array (Distinct Keys)</strong></td>
              <td>$1$</td>
              <td>$1/2$</td>
              <td>$\\lceil \\log_2 n \\rceil$</td>
            </tr>
            <tr>
              <td><strong>Rotated Array (With Duplicates)</strong></td>
              <td>$1$</td>
              <td>$1/2$ avg, $n-1$ worst ($A[lo]==A[mid]==A[hi]$)</td>
              <td>$\\Theta(\\log n)$ avg, $\\Theta(n)$ worst case</td>
            </tr>
            <tr>
              <td><strong>Discrete Bitonic Peak (Slope Binary)</strong></td>
              <td>$2$ adjacent ($A[m], A[m+1]$)</td>
              <td>$1/2$</td>
              <td>$2 \\log_2 n$ array reads</td>
            </tr>
            <tr>
              <td><strong>Continuous Ternary vs. Golden Section</strong></td>
              <td>$2$ (Ternary) / $1$ reused (Golden)</td>
              <td>$2/3 \\approx 0.667$ vs. $0.618$</td>
              <td>$O(\\log(1/\\varepsilon))$</td>
            </tr>
          </tbody>
        </table>

        <svg viewBox="0 0 760 215" class="lesson-svg" role="img" aria-label="Rotated sorted array two-step curve and Unimodal ternary vs golden section search">
          <rect width="760" height="215" rx="10" fill="#0f172a"/>
          <text x="20" y="26" fill="#f8fafc" font-size="13" font-weight="bold">Left: Rotated Sorted Array Partition (P(i): A[i] ≤ A[n-1])   |   Right: Unimodal Peak Search</text>
          <!-- Left: Rotated Array -->
          <g transform="translate(25, 45)">
            <rect x="0" y="0" width="335" height="145" rx="8" fill="#1e293b" stroke="#475569"/>
            <line x1="25" y1="115" x2="170" y2="30" stroke="#38bdf8" stroke-width="3"/>
            <circle cx="25" cy="115" r="4" fill="#38bdf8"/>
            <circle cx="170" cy="30" r="4" fill="#38bdf8"/>
            <text x="90" y="55" fill="#38bdf8" font-size="11" font-weight="bold">Upper Sorted (&gt; A[n-1])</text>

            <line x1="175" y1="75" x2="175" y2="15" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4 3"/>

            <line x1="185" y1="130" x2="310" y2="85" stroke="#10b981" stroke-width="3"/>
            <circle cx="185" cy="130" r="5" fill="#fbbf24"/>
            <circle cx="310" cy="85" r="4" fill="#10b981"/>
            <text x="245" y="128" fill="#10b981" font-size="11" font-weight="bold">Lower Sorted (≤ A[n-1])</text>
            <text x="185" y="142" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="bold">Pivot Min</text>
          </g>
          <!-- Right: Unimodal -->
          <g transform="translate(395, 45)">
            <rect x="0" y="0" width="340" height="145" rx="8" fill="#1e293b" stroke="#475569"/>
            <path d="M 25 125 Q 185 -25 315 125" fill="none" stroke="#c084fc" stroke-width="3"/>
            <line x1="120" y1="125" x2="120" y2="54" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 2"/>
            <circle cx="120" cy="54" r="4" fill="#38bdf8"/>
            <text x="120" y="138" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">m₁</text>

            <line x1="220" y1="125" x2="220" y2="45" stroke="#10b981" stroke-width="2" stroke-dasharray="3 2"/>
            <circle cx="220" cy="45" r="4" fill="#10b981"/>
            <text x="220" y="138" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">m₂</text>

            <text x="170" y="25" text-anchor="middle" fill="#fef3c7" font-size="11" font-weight="bold">f(m₁) &lt; f(m₂) ⇒ Discard [lo, m₁)</text>
          </g>
        </svg>

        <div class="mermaid">
flowchart TD
  A["Rotated Array Search: mid = (lo + hi)/2"] --> B{"A[lo] == A[mid] == A[hi]?"}
  B -- "Yes (Ambiguous Duplicates)" --> C["++lo; --hi; (O(N) worst case)"]
  B -- "No" --> D{"Is Left Half Sorted?\n(A[lo] <= A[mid])"}
  D -- "Yes" --> E{"A[lo] <= target < A[mid]?"}
  E -- "Yes" --> F["hi = mid - 1"]
  E -- "No" --> G["lo = mid + 1"]
  D -- "No (Right Half [mid..hi] is Sorted)" --> H{"A[mid] < target <= A[hi]?"}
  H -- "Yes" --> G
  H -- "No" --> F
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Why Exponential Search Beats Binary Search on Inverted Indexes</div>
          <p>In full-text search engines (Lucene, Tantivy) and columnar databases (ClickHouse, DuckDB), intersecting two sorted posting lists $L_1$ and $L_2$ requires advancing the cursor in $L_2$ to the first document ID $\\ge d_1$. Because successive jumps $i = \\text{next\\_pos} - \\text{cur\\_pos}$ are usually small ($i \\in [1, 64]$), <strong>Exponential Search</strong> probes $cur + 1, cur + 3, cur + 7, \\dots$—staying completely inside the <strong>current 64-byte L1d cache line</strong>! By contrast, a full binary search over $L_2[cur \\dots N]$ immediately jumps to the midpoint $(cur + N)/2$ megabytes away in DRAM, suffering an guaranteed L3/DRAM cache miss on the very first comparison!</p>
        </div>

        <h2>Production C++20 Implementation: Exponential Search, Rotated Search &amp; Golden-Section Unimodal Optimizer</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cmath&gt;
#include &lt;concepts&gt;
#include &lt;cstddef&gt;
#include &lt;numbers&gt;

// 1. Exponential (Galloping) Search from cursor hint: O(log(result - hint)) time &amp; cache-local!
template &lt;std::totally_ordered T&gt;
constexpr std::size_t exponential_lower_bound(const T* a, std::size_t n, const T&amp; target, std::size_t hint = 0) noexcept {
    if (hint &gt;= n || !(a[hint] &lt; target)) {
        // Fallback if target &lt;= a[hint]
        return static_cast&lt;std::size_t&gt;(std::lower_bound(a, a + std::min(hint + 1, n), target) - a);
    }
    std::size_t step = 1;
    std::size_t lo = hint;
    std::size_t hi = hint + 1;
    while (hi &lt; n &amp;&amp; a[hi] &lt; target) {
        lo = hi;
        step &lt;&lt;= 1;
        hi = (n - hi &gt; step) ? (hi + step) : n;
    }
    return static_cast&lt;std::size_t&gt;(std::lower_bound(a + lo + 1, a + hi, target) - a);
}

// 2. Discrete Unimodal Peak Finder in log2(n) iterations (1 slope comparison per step)
template &lt;std::totally_ordered T&gt;
constexpr std::size_t find_bitonic_peak(const T* a, std::size_t n) noexcept {
    std::size_t lo = 0, hi = n - 1;
    while (lo &lt; hi) {
        const std::size_t mid = lo + (hi - lo) / 2;
        if (a[mid] &lt; a[mid + 1]) {
            lo = mid + 1; // Rising slope: peak is strictly to the right
        } else {
            hi = mid;     // Falling slope: mid could be the peak
        }
    }
    return lo;
}

// 3. Continuous Golden-Section Search: maximizes unimodal f(x) on [lo, hi] reusing 1 evaluation/step!
template &lt;typename Func&gt;
double golden_section_maximize(Func f, double lo, double hi, int iterations = 70) {
    constexpr double inv_phi  = 1.0 / std::numbers::phi;        // (sqrt(5) - 1) / 2 ≈ 0.618034
    constexpr double inv_phi2 = 1.0 - inv_phi;                  // (3 - sqrt(5)) / 2 ≈ 0.381966

    double m1 = lo + inv_phi2 * (hi - lo);
    double m2 = lo + inv_phi  * (hi - lo);
    double f1 = f(m1);
    double f2 = f(m2);

    for (int it = 0; it &lt; iterations; ++it) {
        if (f1 &lt; f2) {
            lo = m1;
            m1 = m2; f1 = f2; // Reuse previous m2 evaluation!
            m2 = lo + inv_phi * (hi - lo);
            f2 = f(m2);       // Only ONE new f() call per step!
        } else {
            hi = m2;
            m2 = m1; f2 = f1; // Reuse previous m1 evaluation!
            m1 = lo + inv_phi2 * (hi - lo);
            f1 = f(m1);
        }
    }
    return 0.5 * (lo + hi);
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Why Rotated Search With Duplicates Cannot Beat $\\Omega(N)$ in the Worst Case</div>
          <p>Suppose a rotated sorted array allows duplicate keys and the input is $[1, 1, 1, \\dots, 1, 0, 1, 1]$ (a single $0$ hidden among $n - 1$ ones). At the initial step, $A[lo] = A[mid] = A[hi] = 1$, which gives <strong>zero information</strong> about whether the $0$ lies in the left half $[lo, mid-1]$ or the right half $[mid+1, hi]$! Any comparison-based algorithm must inspect all $n$ positions in the worst case to find the $0$, proving an information-theoretic $\\Omega(n)$ worst-case lower bound when duplicates are present.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Exponential (Galloping) Search doubles a step offset 1, 2, 4, ..., 2^k before binary searching [2^{k-1}, 2^k], finding an element at distance i in 2 log_2(i) + O(1) comparisons with high L1 cache locality.",
      "In any cyclically rotated sorted array of distinct elements, comparing A[mid] with A[lo] (or A[n-1]) immediately identifies which half is strictly sorted.",
      "When duplicates are allowed in a rotated array, A[lo] == A[mid] == A[hi] forces an Ω(N) worst-case fallback (++lo; --hi).",
      "On a discrete unimodal/bitonic array, binary searching the adjacent difference A[mid] < A[mid+1] finds the peak in log_2(N) steps; on continuous unimodal functions, Golden Section Search improves on Ternary Search by reusing one interior point per iteration."
    ],
    furtherReading: [
      {
        title: "Bentley & Yao (1976) — An Almost Optimal Algorithm for Unbounded Searching (Information Processing Letters)",
        url: "https://doi.org/10.1016/0020-0190(76)90071-5"
      },
      {
        title: "Kiefer (1953) — Sequential Minimax Search for a Maximum (Golden Section & Fibonacci Search, Proc. AMS)",
        url: "https://doi.org/10.1090/S0002-9939-1953-0055639-3"
      }
    ]
  },

  "fractional-cascading": {
    title: "Fractional Cascading: Searching K Sorted Lists in O(log N + K)",
    video: {
      youtubeId: "NMxLL3D5qd8",
      id: "NMxLL3D5qd8",
      url: "https://www.youtube.com/embed/NMxLL3D5qd8",
      title: "MIT 6.851 Lecture 3: Geometric Data Structures & Fractional Cascading",
      channel: "MIT OpenCourseWare",
      duration: "1:24:10",
      start: 0,
      length: "84m",
      why: "Erik Demaine explains Chazelle and Guibas's Fractional Cascading technique, showing how propagating every second element upward eliminates K-1 binary searches."
    },
    intuition: "Searching for the same query key $q$ across $k$ separate sorted lists of length $n$ naively costs $O(k \\log n)$ time. <strong>Fractional Cascading</strong> (Chazelle &amp; Guibas, 1986) bubbles every <em>second</em> element of list $L_{i+1}$ upward into list $L_i$ with cross-list bridge pointers—so after a single $O(\\log n)$ binary search in the top list $L_0$, each subsequent list is resolved in $O(1)$ time using at most <em>one</em> local comparison!",
    content: `
      <div class="lesson-content">
        <h2>The $O(k \\log n) \\to O(\\log n + k)$ Iterative Search Bottleneck</h2>
        <p>In computational geometry (2D orthogonal range trees, segment trees of sorted vectors), database multi-column index lookups, and packet classification, we often store a catalog of $k$ sorted arrays $L_0, L_1, \\dots, L_{k-1}$, each of size $\\approx n$, and need to compute $\\text{lower\\_bound}(L_i, q)$ for the <strong>same query value $q$</strong> in every list $i = 0 \\dots k-1$.</p>
        <p>Executing $k$ independent binary searches takes $O(k \\log n)$ time. Could we store a pointer from each element of $L_0$ to its successor in $L_1$, $L_2$, etc.? If we simply merged all $k$ lists into $L_0$, $L_0$ would blow up to size $k n$, and propagating full lists across $k$ levels would consume $\\Theta(k^2 n)$ space! Bernard Chazelle and Leonidas Guibas (1986) solved this space-time trade-off with <strong>Fractional Cascading</strong>: propagate only a <strong>$\\frac{1}{2}$-fraction</strong> of each augmented list upward!</p>

        <div class="invariant-box">
          <div class="invariant-title">Fractional Cascading Construction &amp; Geometric Space Bound</div>
          <p>We construct <strong>augmented lists</strong> $M_0, M_1, \\dots, M_{k-1}$ bottom-up from $i = k - 1$ down to $0$:</p>
          <ol>
            <li><strong>Base List ($i = k - 1$):</strong> Set $M_{k-1} = L_{k-1}$.</li>
            <li><strong>Inductive Step ($i = k - 2 \\text{ down to } 0$):</strong> Form $M_i$ by merging $L_i$ with <strong>every second element (even indices $0, 2, 4, \\dots$)</strong> of $M_{i+1}$!</li>
            <li><strong>Two Pointers per Entry in $M_i$:</strong> Each entry $e \\in M_i$ stores:
              <ul>
                <li><code>real_idx</code>: The index of the smallest element $\\ge e.\\text{val}$ in the <em>original</em> list $L_i$.</li>
                <li><code>next_cascade_idx</code>: The index of the smallest element $\\ge e.\\text{val}$ in the <em>next augmented</em> list $M_{i+1}$.</li>
              </ul>
            </li>
          </ol>
          <p><strong>Why Space Remains Strictly Linear $\\sum_{i=0}^{k-1} |M_i| \\le 2 \\sum_{i=0}^{k-1} |L_i|$:</strong></p>
          <p>Each list $L_j$ contributes $|L_j|$ elements to $M_j$, $\\frac{1}{2}|L_j|$ elements to $M_{j-1}$, $\\frac{1}{4}|L_j|$ elements to $M_{j-2}$, and so on. Summing the geometric series $1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\dots = 2$ proves that the total size of all augmented lists is at most <strong>$2N$</strong> ($O(kn)$ space, zero asymptotic blowup)!</p>
          <p><strong>Why Query Time per Level Is $O(1)$ (At Most 1 Comparison!):</strong></p>
          <p>Because every <em>second</em> element of $M_{i+1}$ was promoted into $M_i$, any two promoted elements in $M_i$ have <strong>at most one unpromoted element of $M_{i+1}$ sitting between them</strong>! Thus, once we know the successor of $q$ in $M_i$ (at index $p$), following $p$'s bridge pointer into $M_{i+1}$ lands at an index $c$ such that the true successor of $q$ in $M_{i+1}$ is <strong>guaranteed to be either $c - 1$ or $c$</strong>—requiring just a single <code>if (c > 0 && M_{i+1}[c - 1].val >= q) --c;</code> comparison!</p>
        </div>

        <div class="simulator-mount" data-sim="sim-fractional-cascading-eytzinger"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Catalog Search Method</th>
              <th>Total Space</th>
              <th>Query Time ($k$ Lists of Size $n$)</th>
              <th> application in Range Trees</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>$k$ Independent Binary Searches</strong></td>
              <td>$\\Theta(kn)$</td>
              <td>$\\Theta(k \\log n)$</td>
              <td>2D Orthogonal Range Query in $O(\\log^2 N + K)$</td>
            </tr>
            <tr>
              <td><strong>Full Cross-List Unification</strong></td>
              <td>$\\Theta(k^2 n)$ (Quadratic!)</td>
              <td>$\\Theta(\\log(kn) + k)$</td>
              <td>Impractical memory blowup</td>
            </tr>
            <tr>
              <td><strong>Fractional Cascading ($1/2$-Sample)</strong></td>
              <td>$\\le 2kn = \\Theta(kn)$</td>
              <td>$\\mathbf{\\Theta(\\log n + k)}$</td>
              <td>Upgrades 2D Range Tree to $\\mathbf{O(\\log N + K)}$!</td>
            </tr>
            <tr>
              <td><strong>Graph Fractional Cascading (Degree $d$)</strong></td>
              <td>$\\Theta(kn)$ (Sample $1/(2d)$)</td>
              <td>$\\Theta(\\log n + k \\log d)$</td>
              <td>Used in Segment Trees ($d=2 \\implies O(\\log N)$)</td>
            </tr>
          </tbody>
        </table>

        <svg viewBox="0 0 760 230" class="lesson-svg" role="img" aria-label="Fractional cascading bridge pointers between M_i and M_{i+1} requiring at most 1 step back">
          <rect width="760" height="230" rx="10" fill="#0f172a"/>
          <text x="20" y="26" fill="#f8fafc" font-size="13" font-weight="bold">Fractional Cascading Invariant: Every 2nd Element of M_{i+1} Is Promoted to M_i (Gap ≤ 1)</text>
          <g transform="translate(25, 48)">
            <text x="0" y="20" fill="#38bdf8" font-size="12" font-weight="bold">Augmented M_i:</text>
            <rect x="130" y="0" width="85" height="36" rx="5" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="172" y="23" text-anchor="middle" fill="#e0f2fe" font-size="12">10 (from L_i)</text>

            <rect x="235" y="0" width="95" height="36" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
            <text x="282" y="23" text-anchor="middle" fill="#6ee7b7" font-size="12" font-weight="bold">18 (promoted)</text>

            <rect x="350" y="0" width="85" height="36" rx="5" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="392" y="23" text-anchor="middle" fill="#e0f2fe" font-size="12">25 (from L_i)</text>

            <rect x="455" y="0" width="110" height="36" rx="5" fill="#78350f" stroke="#fbbf24" stroke-width="2.5"/>
            <text x="510" y="23" text-anchor="middle" fill="#fef3c7" font-size="12" font-weight="bold">34 (p: ≥ q=27)</text>

            <!-- Downward bridge arrow -->
            <path d="M 510 38 L 465 92" stroke="#fbbf24" stroke-width="2.5"/>
            <text x="548" y="68" fill="#fbbf24" font-size="11" font-weight="bold">next_cascade_idx = c</text>

            <text x="0" y="116" fill="#f59e0b" font-size="12" font-weight="bold">Augmented M_{i+1}:</text>
            <rect x="130" y="96" width="80" height="36" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
            <text x="170" y="119" text-anchor="middle" fill="#6ee7b7" font-size="12">idx 0: 18</text>

            <rect x="225" y="96" width="80" height="36" rx="5" fill="#1e293b" stroke="#64748b"/>
            <text x="265" y="119" text-anchor="middle" fill="#cbd5e1" font-size="12">idx 1: 22</text>

            <rect x="320" y="96" width="95" height="36" rx="5" fill="#311042" stroke="#c084fc" stroke-width="2"/>
            <text x="367" y="119" text-anchor="middle" fill="#f3e8ff" font-size="12" font-weight="bold">c-1: 29 (≥ 27!)</text>

            <rect x="430" y="96" width="85" height="36" rx="5" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>
            <text x="472" y="119" text-anchor="middle" fill="#fef3c7" font-size="12" font-weight="bold">idx c: 34</text>

            <path d="M 430 114 L 415 114" stroke="#c084fc" stroke-width="2.5"/>
          </g>
          <text x="25" y="204" fill="#34d399" font-size="12.5" font-weight="bold">Query q = 27 lands at 34 in M_i → Bridge jumps to 34 (idx c) in M_{i+1} → Check c-1 (29 ≥ 27) in O(1)!</text>
        </svg>

        <div class="mermaid">
flowchart LR
  A["Query q"] --> B["Binary Search in Top Augmented List M_0\nO(log N) Time → Index p_0"]
  B --> C["Emit L_0[M_0[p_0].real_idx]\nFollow c = M_0[p_0].next_cascade_idx"]
  C --> D["In M_1: If c > 0 and M_1[c-1].val >= q, --c\nO(1) Time (Single Comparison!)"]
  D --> E["Repeat across M_2 ... M_{k-1}\nTotal Time: O(log N + k)"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Cache Misses per List vs. Computational Geometry Range Trees</div>
          <p>In a 2D Orthogonal Range Tree (answering "count or report all points in $[x_1, x_2] \\times [y_1, y_2]$"), a standard tree builds a sorted $Y$-array at every internal node of the primary $X$-tree. A query visits $O(\\log N)$ canonical $X$-nodes and runs binary search on each node's $Y$-array in $O(\\log^2 N)$ time. By applying Fractional Cascading from each parent $Y$-array to its left and right child $Y$-arrays, we run binary search <strong>only once at the root $Y$-array</strong> ($O(\\log N)$) and follow $O(1)$ bridge pointers down the $O(\\log N)$ tree levels—shaving a full $\\log N$ factor off both asymptotic complexity ($O(\\log N + K)$) and L3 cache misses!</p>
        </div>

        <h2>Production C++20 Implementation: Complete <code>FractionalCascadingCatalog</code></h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;concepts&gt;
#include &lt;cstddef&gt;
#include &lt;limits&gt;
#include &lt;vector&gt;

template &lt;std::totally_ordered T&gt;
class FractionalCascadingCatalog {
public:
    struct Node {
        T val;
        std::size_t real_idx;         // Index of lower_bound(val) in original list L_i
        std::size_t next_cascade_idx; // Index of lower_bound(val) in next augmented list M_{i+1}
    };

    explicit FractionalCascadingCatalog(const std::vector&lt;std::vector&lt;T&gt;&gt;&amp; lists, T sentinel_max)
        : k_(lists.size()), sentinel_(sentinel_max), orig_(lists), aug_(k_) {
        if (k_ == 0) return;

        // Build bottom-up from level k - 1 down to 0
        for (std::ptrdiff_t lvl = static_cast&lt;std::ptrdiff_t&gt;(k_) - 1; lvl &gt;= 0; --lvl) {
            const auto&amp; L = orig_[lvl];
            std::vector&lt;T&gt; merged;
            if (static_cast&lt;std::size_t&gt;(lvl) == k_ - 1) {
                merged = L;
            } else {
                // Extract every 2nd element (indices 1, 3, 5, ...) of M_{lvl+1}
                std::vector&lt;T&gt; promoted;
                const auto&amp; M_next = aug_[lvl + 1];
                for (std::size_t j = 1; j &lt; M_next.size(); j += 2) {
                    if (M_next[j].val &lt; sentinel_) promoted.push_back(M_next[j].val);
                }
                merged.resize(L.size() + promoted.size());
                std::merge(L.begin(), L.end(), promoted.begin(), promoted.end(), merged.begin());
                merged.erase(std::unique(merged.begin(), merged.end()), merged.end());
            }
            merged.push_back(sentinel_); // +infinity sentinel at end

            // Populate real_idx (into L) and next_cascade_idx (into M_{lvl+1}) via two-pointer sweep
            auto&amp; M = aug_[lvl];
            M.resize(merged.size());
            std::size_t r_ptr = 0, c_ptr = 0;
            for (std::size_t idx = 0; idx &lt; merged.size(); ++idx) {
                const T v = merged[idx];
                while (r_ptr &lt; L.size() &amp;&amp; L[r_ptr] &lt; v) ++r_ptr;
                if (static_cast&lt;std::size_t&gt;(lvl) + 1 &lt; k_) {
                    const auto&amp; M_next = aug_[lvl + 1];
                    while (c_ptr + 1 &lt; M_next.size() &amp;&amp; M_next[c_ptr].val &lt; v) ++c_ptr;
                }
                M[idx] = Node{v, r_ptr, c_ptr};
            }
        }
    }

    // Returns the lower_bound index in each of the k original lists in O(log N + k) time!
    std::vector&lt;std::size_t&gt; query_all_lower_bounds(const T&amp; q) const {
        if (k_ == 0) return {};
        std::vector&lt;std::size_t&gt; results(k_);

        // 1. Single O(log N) binary search in top augmented list M_0
        const auto&amp; M0 = aug_[0];
        auto it = std::lower_bound(M0.begin(), M0.end(), q,
                                   [](const Node&amp; nd, const T&amp; val) { return nd.val &lt; val; });
        std::size_t cur = static_cast&lt;std::size_t&gt;(it - M0.begin());
        results[0] = M0[cur].real_idx;

        // 2. O(1) cascade step for each subsequent list 1 .. k - 1
        for (std::size_t lvl = 0; lvl + 1 &lt; k_; ++lvl) {
            std::size_t next_pos = aug_[lvl][cur].next_cascade_idx;
            const auto&amp; M_next = aug_[lvl + 1];
            // Because every 2nd element of M_{lvl+1} was promoted to M_lvl,
            // the exact lower_bound in M_{lvl+1} is either next_pos - 1 or next_pos!
            if (next_pos &gt; 0 &amp;&amp; !(M_next[next_pos - 1].val &lt; q)) {
                --next_pos;
            }
            cur = next_pos;
            results[lvl + 1] = M_next[cur].real_idx;
        }
        return results;
    }

private:
    std::size_t k_;
    T sentinel_;
    std::vector&lt;std::vector&lt;T&gt;&gt; orig_;
    std::vector&lt;std::vector&lt;Node&gt;&gt; aug_;
};</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Promoting From $M_{i+1}$ vs. Promoting Only From $L_{i+1}$</div>
          <p>A common implementation mistake is merging $L_i$ with every second element of the <em>original</em> list $L_{i+1}$ instead of the <em>already-augmented</em> list $M_{i+1}$. If you only sample $L_{i+1}$, a dense cluster of elements in $L_{i+2}$ can create an arbitrarily large gap of promoted elements in $M_{i+1}$ that never reaches $M_i$, breaking the $O(1)$ one-step-back invariant! Always sample every second element of $M_{i+1}$ (built bottom-up from $k-1$ down to $0$).</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Fractional Cascading builds augmented lists M_i bottom-up by merging each original list L_i with every 2nd element of M_{i+1}.",
      "Because the promotion fraction is 1/2, the geometric series 1 + 1/2 + 1/4 + ... = 2 bounds the total size of all augmented lists to at most 2x the original input size.",
      "Every pair of consecutive promoted elements in M_i sandwiches at most 1 unpromoted element in M_{i+1}, so following a bridge pointer from M_i to M_{i+1} requires at most 1 local comparison (next_pos - 1 vs next_pos).",
      "Total query time across k lists drops from O(k log n) to O(log n + k), reducing 2D Orthogonal Range Tree queries from O(log^2 N + K) to O(log N + K)."
    ],
    furtherReading: [
      {
        title: "Chazelle & Guibas (1986) — Fractional Cascading: I. A Data Structuring Technique (Algorithmica)",
        url: "https://doi.org/10.1007/BF01840440"
      },
      {
        title: "de Berg, Cheong, van Kreveld, Overmars — Computational Geometry (3rd Ed.), §5.6 Fractional Cascading",
        url: "https://www.springer.com/gp/book/9783540779735"
      },
      {
        title: "MIT 6.851 Lecture Notes — Geometric Data Structures & Fractional Cascading",
        url: "https://ocw.mit.edu/"
      }
    ]
  },

  "divide-and-conquer-closest-pair": {
    title: "Geometric Divide-and-Conquer: Planar Closest Pair of Points in O(N log N)",
    video: {
      youtubeId: "kCLGVat2SHk",
      id: "kCLGVat2SHk",
      url: "https://www.youtube.com/embed/kCLGVat2SHk",
      title: "Planar Closest Pair of Points in O(N log N) via Divide and Conquer (7-Neighbor Strip Proof)",
      channel: "Algorithms by Sharma Thankachan",
      duration: "18:35",
      start: 0,
      length: "18m",
      why: "Erik Demaine derives the O(N log N) planar closest-pair divide-and-conquer algorithm and proves the geometric packing lemma bounding strip comparisons to at most 7 neighbors."
    },
    intuition: "Checking all N(N-1)/2 pairs of 2D points takes O(N^2) time. Splitting the plane at the median X-coordinate solves the left and right halves recursively to get minimum distance delta = min(delta_L, delta_R). The cross-boundary merge only needs to inspect points inside a vertical strip of width 2*delta centered at the split line—and because no two points in the same half can be closer than delta, a simple 8-box pigeonhole packing proves each point in the Y-sorted strip only needs to be compared against the next 7 points!",
    content: `
      <div class="lesson-content">
        <h2>The Naive Bottleneck vs. Shamos-Hoey (1975) Divide-and-Conquer</h2>
        <p>Given $N$ points $P = \\{p_0, p_1, \\dots, p_{N-1}\\}$ in the Euclidean plane $\\mathbb{R}^2$, the <strong>Closest Pair of Points</strong> problem asks for the minimum Euclidean distance $\\min_{i \\neq j} \\|p_i - p_j\\|_2$. Exhaustive pairwise inspection requires $\\binom{N}{2} = \\Theta(N^2)$ distance calculations. Can we apply spatial Divide-and-Conquer like Merge Sort to reach $O(N \\log N)$?</p>

        <ol>
          <li><strong>Divide:</strong> Presort all points by $X$-coordinate ($P_X$) and by $Y$-coordinate ($P_Y$) once in $O(N \\log N)$ time. At each recursive step, split $P_X$ at the median index $m = \\lfloor N / 2 \\rfloor$ with vertical dividing line $x = x_m$ into $P_L$ and $P_R$. Partition $P_Y$ in $O(N)$ time into $Y$-sorted subsets $P_{YL}$ and $P_{YR}$.</li>
          <li><strong>Conquer:</strong> Recursively find the minimum distance $\\delta_L$ in $P_L$ and $\\delta_R$ in $P_R$. Let $\\delta = \\min(\\delta_L, \\delta_R)$.</li>
          <li><strong>Combine (The $2\\delta$ Strip):</strong> Any pair $(p_l, p_r)$ with $p_l \\in P_L, p_r \\in P_R$ that beats $\\delta$ must have both points within horizontal distance $\\delta$ of the dividing line $x = x_m$. Filter $P_Y$ in $O(N)$ time (preserving $Y$-sorted order) into a strip array $S = \\{p \\in P_Y : |p.x - x_m| &lt; \\delta\\}$.</li>
        </ol>

        <div class="simulator-mount" data-sim="sim-closest-pair-strip"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Algorithm / Variant</th>
              <th>Time Complexity</th>
              <th>Auxiliary Space</th>
              <th>Combine Step Cost per Level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Naive All-Pairs Search</td>
              <td>$\\Theta(N^2)$</td>
              <td>$O(1)$</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td>D&amp;C Re-sorting $Y$ at Every Level</td>
              <td>$\\Theta(N \\log^2 N)$</td>
              <td>$O(N)$</td>
              <td>$O(N \\log N)$ sort of strip $S$</td>
            </tr>
            <tr>
              <td>Shamos-Hoey D&amp;C (Merge-Sort on $Y$)</td>
              <td>$\\Theta(N \\log N)$</td>
              <td>$O(N)$</td>
              <td>$O(N)$ strip filter + $\\le 7N$ comparisons</td>
            </tr>
            <tr>
              <td>Rabin (1976) Randomized Grid Hashing</td>
              <td>$\\Theta(N)$ expected</td>
              <td>$O(N)$ hash table</td>
              <td>$O(1)$ expected ($3 \\times 3$ grid cells of side $\\delta$)</td>
            </tr>
          </tbody>
        </table>

        <div class="invariant-box">
          <div class="invariant-title">The 7-Neighbor Geometric Packing Lemma</div>
          <p>Suppose we iterate through the strip $S$ in ascending order of $Y$-coordinate. For any point $p = S[i]$ with vertical coordinate $y_0$, any subsequent point $q = S[j]$ ($j &gt; i$) with $\\|p - q\\|_2 &lt; \\delta$ must lie inside the bounding rectangle $R = [x_m - \\delta, x_m + \\delta] \\times [y_0, y_0 + \\delta]$ of width $2\\delta$ and height $\\delta$.</p>
          <p>Partition $R$ into <strong>eight squares of side $\\frac{\\delta}{2} \\times \\frac{\\delta}{2}$</strong> (four in the left half $x \\le x_m$, four in the right half $x \\ge x_m$). The maximum distance between any two points inside the same $\\frac{\\delta}{2} \\times \\frac{\\delta}{2}$ square is its diagonal:</p>
          $$\\text{diam}\\left(\\frac{\\delta}{2} \\times \\frac{\\delta}{2}\\right) = \\sqrt{\\left(\\frac{\\delta}{2}\\right)^2 + \\left(\\frac{\\delta}{2}\\right)^2} = \\frac{\\delta}{\\sqrt{2}} \\approx 0.7071\\delta &lt; \\delta$$
          <p>Because every pair of points inside $P_L$ has distance $\\ge \\delta_L \\ge \\delta$ and every pair inside $P_R$ has distance $\\ge \\delta_R \\ge \\delta$, <strong>at most one point can occupy each of the 8 squares</strong>! Counting $S[i]$ itself as occupying one square, at most <strong>7 subsequent points</strong> $S[i+1], \\dots, S[i+7]$ can lie inside $R$.</p>
        </div>

        <svg viewBox="0 0 680 250" width="100%" height="250" role="img" aria-label="Planar closest pair 2-delta by delta rectangle partitioned into eight delta/2 squares">
          <rect width="680" height="250" rx="8" fill="#0f172a"/>
          <text x="20" y="26" fill="#e2e8f0" font-size="14" font-weight="bold">The 2δ × δ Bounding Box Partitioned into Eight (δ/2 × δ/2) Pigeonhole Squares</text>

          <!-- Left 4 boxes (P_L) -->
          <g transform="translate(160, 50)">
            <rect x="0" y="0" width="80" height="80" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
            <rect x="80" y="0" width="80" height="80" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
            <rect x="0" y="80" width="80" height="80" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
            <rect x="80" y="80" width="80" height="80" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>

            <!-- Right 4 boxes (P_R) -->
            <rect x="160" y="0" width="80" height="80" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
            <rect x="240" y="0" width="80" height="80" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
            <rect x="160" y="80" width="80" height="80" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
            <rect x="240" y="80" width="80" height="80" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>

            <!-- Center dividing line x = x_m -->
            <line x1="160" y1="-12" x2="160" y2="175" stroke="#ef4444" stroke-width="3" stroke-dasharray="5,4"/>
            <text x="160" y="-15" text-anchor="middle" fill="#f87171" font-size="11.5" font-weight="bold">x = x_m</text>

            <!-- Diagonal in top-left box -->
            <line x1="0" y1="80" x2="80" y2="0" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3"/>
            <text x="40" y="45" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="bold">δ / √2 &lt; δ</text>

            <!-- Points in boxes -->
            <circle cx="135" cy="158" r="6" fill="#ef4444"/>
            <text x="115" y="150" fill="#fca5a5" font-size="11" font-weight="bold">S[i] (y_0)</text>

            <circle cx="35" cy="125" r="5" fill="#60a5fa"/>
            <circle cx="120" cy="40" r="5" fill="#60a5fa"/>
            <circle cx="195" cy="135" r="5" fill="#34d399"/>
            <circle cx="285" cy="115" r="5" fill="#34d399"/>
            <circle cx="210" cy="35" r="5" fill="#34d399"/>
            <circle cx="290" cy="50" r="5" fill="#34d399"/>

            <!-- Dimension labels -->
            <text x="80" y="182" text-anchor="middle" fill="#93c5fd" font-size="12" font-weight="bold">← δ (Left Half P_L) →</text>
            <text x="240" y="182" text-anchor="middle" fill="#6ee7b7" font-size="12" font-weight="bold">← δ (Right Half P_R) →</text>
            <text x="335" y="45" fill="#cbd5e1" font-size="12">δ/2</text>
            <text x="335" y="125" fill="#cbd5e1" font-size="12">δ/2</text>
          </g>
        </svg>

        <div class="mermaid">
flowchart TD
  A["Presort Points by X -> P_X\nCount N; Allocate Buffer B"] --> B["Recurse on Left [lo, mid) -> delta_L\nRecurse on Right [mid, hi) -> delta_R"]
  B --> C["delta = min(delta_L, delta_R)\nstd::merge Left & Right by Y-Coordinate"]
  C --> D["Filter Y-Sorted Range into Strip S\nwhere |p.x - x_mid| < delta"]
  D --> E["For each S[i], check S[j] (j = i+1..i+7)\nStop early as soon as S[j].y - S[i].y >= delta"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Combining Bottom-Up Y-Merge vs. Top-Down Partitioning</div>
          <p>Instead of passing down a pre-sorted $P_Y$ vector and partitioning it on the way down (which requires scattered writes depending on whether a point belongs to $P_L$ or $P_R$), production implementations perform the $Y$-sort <strong>bottom-up during the unwind phase</strong>—identical to standard Merge Sort! After recursive calls on $[lo, mid)$ and $[mid, hi)$ return $\\delta_L$ and $\\delta_R$ AND leave both subarrays sorted by $Y$, a single streaming <code>std::merge</code> by $Y$ takes $O(N)$ sequential L1-cached reads, followed immediately by the strip filter and 7-neighbor scan. Furthermore, comparing <strong>squared Euclidean distances</strong> $\\Delta x^2 + \\Delta y^2 &lt; \\delta^2$ inside the inner loop avoids hardware <code>sqrtpd</code> latency (~12–15 cycles) until the final return.</p>
        </div>

        <h2>Production C++20 Implementation: $O(N \\log N)$ Closest Pair of Points</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cmath&gt;
#include &lt;cstddef&gt;
#include &lt;cstdint&gt;
#include &lt;limits&gt;
#include &lt;vector&gt;

struct Point2D {
    double x;
    double y;
    std::uint32_t id;
};

struct ClosestPairResult {
    double min_dist;
    std::uint32_t id1;
    std::uint32_t id2;
};

inline double dist_sq(const Point2D&amp; a, const Point2D&amp; b) noexcept {
    const double dx = a.x - b.x;
    const double dy = a.y - b.y;
    return dx * dx + dy * dy;
}

ClosestPairResult solve_closest_pair(std::vector&lt;Point2D&gt;&amp; pts) {
    const std::size_t n = pts.size();
    if (n &lt; 2) return {std::numeric_limits&lt;double&gt;::infinity(), 0, 0};

    // 1. Sort initially by X-coordinate (tie-break by Y)
    std::sort(pts.begin(), pts.end(), [](const Point2D&amp; a, const Point2D&amp; b) {
        return (a.x != b.x) ? (a.x &lt; b.x) : (a.y &lt; b.y);
    });

    std::vector&lt;Point2D&gt; scratch(n);
    std::vector&lt;Point2D&gt; strip(n);
    double best_d2 = std::numeric_limits&lt;double&gt;::infinity();
    std::uint32_t best_u = 0, best_v = 0;

    auto update_best = [&amp;](const Point2D&amp; a, const Point2D&amp; b) noexcept {
        const double d2 = dist_sq(a, b);
        if (d2 &lt; best_d2) {
            best_d2 = d2;
            best_u = a.id;
            best_v = b.id;
        }
    };

    auto rec = [&amp;](auto&amp; self, std::size_t lo, std::size_t hi) -&gt; void {
        if (hi - lo &lt;= 8) {
            // Small base case: O(1) brute force + insertion sort by Y
            for (std::size_t i = lo; i &lt; hi; ++i) {
                for (std::size_t j = i + 1; j &lt; hi; ++j) {
                    update_best(pts[i], pts[j]);
                }
            }
            std::sort(pts.begin() + lo, pts.begin() + hi,
                      [](const Point2D&amp; a, const Point2D&amp; b) { return a.y &lt; b.y; });
            return;
        }

        const std::size_t mid = lo + (hi - lo) / 2;
        const double mid_x = pts[mid].x;

        self(self, lo, mid);
        self(self, mid, hi);

        // Merge [lo, mid) and [mid, hi) by Y-coordinate in O(N) time
        std::merge(pts.begin() + lo, pts.begin() + mid,
                   pts.begin() + mid, pts.begin() + hi,
                   scratch.begin() + lo,
                   [](const Point2D&amp; a, const Point2D&amp; b) { return a.y &lt; b.y; });
        std::copy(scratch.begin() + lo, scratch.begin() + hi, pts.begin() + lo);

        // Collect points within horizontal distance sqrt(best_d2) of mid_x
        std::size_t s_len = 0;
        for (std::size_t i = lo; i &lt; hi; ++i) {
            const double dx = pts[i].x - mid_x;
            if (dx * dx &lt; best_d2) {
                strip[s_len++] = pts[i];
            }
        }

        // Scan Y-sorted strip: inner loop executes at most 7 times per point!
        for (std::size_t i = 0; i &lt; s_len; ++i) {
            for (std::size_t j = i + 1; j &lt; s_len; ++j) {
                const double dy = strip[j].y - strip[i].y;
                if (dy * dy &gt;= best_d2) break; // Early exit on vertical distance
                update_best(strip[i], strip[j]);
            }
        }
    };

    rec(rec, 0, n);
    return {std::sqrt(best_d2), best_u, best_v};
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Pitfall: Splitting by Coordinate Value Instead of Array Index</div>
          <p>Suppose $\\frac{N}{2}$ points lie on the exact same vertical line $x = x_m$. If you partition $P_Y$ using the predicate <code>p.x &lt; mid_x</code> vs. <code>p.x &gt;= mid_x</code>, all collinear points fall into the right partition, causing an unbalanced $O(N^2)$ recursion tree! Either split strictly by <strong>original array index / identity</strong> when top-down partitioning $P_Y$, or use the <strong>bottom-up <code>std::merge</code> by $Y$</strong> shown above, which always splits indices at <code>mid = lo + (hi - lo) / 2</code> regardless of duplicate $X$-coordinates.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Sorting by X initially and merging by Y bottom-up during recursion satisfies T(N) = 2T(N/2) + O(N) = O(N log N).",
      "Only points with |p.x - x_mid| < delta can form a cross-boundary pair closer than delta = min(delta_L, delta_R).",
      "Partitioning the 2*delta x delta bounding box into eight (delta/2 x delta/2) squares of diagonal delta/sqrt(2) < delta proves that each point in the Y-sorted strip needs to check at most 7 subsequent points.",
      "Tracking squared distance best_d2 eliminates slow hardware square-root instructions from the recursive inner loop."
    ],
    furtherReading: [
      {
        title: "Shamos & Hoey (1975) — Closest-Point Problems (IEEE FOCS)",
        url: "https://doi.org/10.1109/SFCS.1975.8"
      },
      {
        title: "Rabin (1976) — Probabilistic Algorithms (Expected O(N) Closest Pair via Grid Hashing)",
        url: "https://apps.dtic.mil/sti/citations/ADA030647"
      },
      {
        title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), §33.4 Finding the Closest Pair of Points",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      }
    ]
  },

  "karatsuba-strassen-algebraic-dc": {
    title: "Algebraic Divide-and-Conquer: Karatsuba Multiplication & Strassen's Matrix Product",
    video: {
      youtubeId: "JCbZayFr9RE",
      title: "Karatsuba Sub-Quadratic Multiplication & Algebraic Divide-and-Conquer",
      channel: "Stanford Algorithms (Tim Roughgarden)",
      duration: "12:39",
      start: 0,
      length: "13m",
      why: "Tim Roughgarden derives Gauss's 3-multiplication algebraic trick that reduces O(n²) grade-school multiplication to O(n^(log₂ 3)) ≈ O(n^1.585)."
    },
    intuition: "In Master Theorem Case 1, when recursive branching dominates combine work (a > b^d), reducing the number of recursive subproblems `a` directly shrinks the polynomial exponent log_b(a). By trading cheap linear additions for expensive recursive multiplications, Karatsuba drops 4 limb multiplications to 3 (O(n^2) -> O(n^1.585)), and Strassen drops 8 block matrix multiplications to 7 (O(n^3) -> O(n^2.807)).",
    content: `
      <div class="lesson-content">
        <h2>Trading Expensive Multiplications for Cheap Additions</h2>
        <p>When we divide a problem of size $n$ into subproblems of size $n/2$, the Master Theorem tells us that for $T(n) = a T(n/2) + \\Theta(n^d)$ with $a &gt; 2^d$, the asymptotic complexity is governed purely by the number of leaves in the recursion tree: $\\Theta(n^{\\log_2 a})$. Even reducing $a$ by <strong>one single recursive call</strong> changes the exponent of the polynomial!</p>

        <h3>1. Karatsuba Fast Integer &amp; Polynomial Multiplication (1960)</h3>
        <p>Given two $n$-limb big integers (or degree-$n$ polynomials) $X$ and $Y$, split each at $m = \\lfloor n/2 \\rfloor$ into high and low halves in base $B^m$:</p>
        $$X = x_1 B^m + x_0, \\qquad Y = y_1 B^m + y_0$$
        <p>Their product is:</p>
        $$X \\cdot Y = \\underbrace{x_1 y_1}_{z_2} B^{2m} + \\underbrace{(x_1 y_0 + x_0 y_1)}_{z_1} B^m + \\underbrace{x_0 y_0}_{z_0}$$
        <p>Naively computing $x_1 y_1, x_1 y_0, x_0 y_1, x_0 y_0$ requires $a = 4$ multiplications of size $n/2$, giving $T(n) = 4T(n/2) + \\Theta(n) = \\Theta(n^{\\log_2 4}) = \\Theta(n^2)$. Anatolii Karatsuba observed (following Gauss's complex multiplication trick) that $z_1$ can be recovered using only <strong>one additional multiplication</strong> plus two subtractions:</p>
        $$z_2 = x_1 y_1, \\qquad z_0 = x_0 y_0, \\qquad z_1 = (x_1 + x_0)(y_1 + y_0) - z_2 - z_0$$
        <p>Now $a = 3$, so $T(n) = 3T(n/2) + \\Theta(n) = \\Theta\\!\\left(n^{\\log_2 3}\\right) \\approx \\Theta\\!\\left(n^{1.58496}\\right)$.</p>

        <h3>2. Strassen's Sub-Cubic Matrix Multiplication (1969)</h3>
        <p>Given two $n \\times n$ matrices $A$ and $B$, partition each into four $\\frac{n}{2} \\times \\frac{n}{2}$ quadrant blocks:</p>
        $$\\begin{bmatrix} C_{11} &amp; C_{12} \\\\ C_{21} &amp; C_{22} \\end{bmatrix} = \\begin{bmatrix} A_{11} &amp; A_{12} \\\\ A_{21} &amp; A_{22} \\end{bmatrix} \\begin{bmatrix} B_{11} &amp; B_{12} \\\\ B_{21} &amp; B_{22} \\end{bmatrix}$$
        <p>Standard block multiplication requires $8$ recursive $\\frac{n}{2} \\times \\frac{n}{2}$ matrix products, giving $T(n) = 8T(n/2) + \\Theta(n^2) = \\Theta(n^3)$. Volker Strassen shocked the mathematical community by defining <strong>7 intermediate block products</strong> $M_1, \\dots, M_7$ using $18$ matrix additions/subtractions:</p>
        <ul>
          <li>$M_1 = (A_{11} + A_{22})(B_{11} + B_{22})$</li>
          <li>$M_2 = (A_{21} + A_{22}) B_{11}$</li>
          <li>$M_3 = A_{11} (B_{12} - B_{22})$</li>
          <li>$M_4 = A_{22} (B_{21} - B_{11})$</li>
          <li>$M_5 = (A_{11} + A_{12}) B_{22}$</li>
          <li>$M_6 = (A_{21} - A_{11})(B_{11} + B_{12})$</li>
          <li>$M_7 = (A_{12} - A_{22})(B_{21} + B_{22})$</li>
        </ul>
        <p>From which the four output quadrants are reconstructed in $\\Theta(n^2)$ additions:</p>
        $$C_{11} = M_1 + M_4 - M_5 + M_7, \\quad C_{12} = M_3 + M_5, \\quad C_{21} = M_2 + M_4, \\quad C_{22} = M_1 - M_2 + M_3 + M_6$$
        <p>This yields $T(n) = 7T(n/2) + \\Theta(n^2) = \\Theta\\!\\left(n^{\\log_2 7}\\right) \\approx \\Theta\\!\\left(n^{2.80735}\\right)$.</p>

        <div class="simulator-mount" data-sim="sim-fft-butterfly-karatsuba"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Recurrence</th>
              <th>Asymptotic Time</th>
              <th>Practical Crossover Threshold</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Schoolbook Big-Int / Poly Multiply</td>
              <td>$4T(n/2) + O(n)$</td>
              <td>$\\Theta(n^2)$</td>
              <td>$n &lt; 32$ limbs ($64$-bit words)</td>
            </tr>
            <tr>
              <td>Karatsuba Multiplication</td>
              <td>$3T(n/2) + O(n)$</td>
              <td>$\\Theta(n^{1.585})$</td>
              <td>$32 \\le n \\le 2000$ limbs</td>
            </tr>
            <tr>
              <td>Toom-Cook (Toom-3) / FFT Multiplication</td>
              <td>$5T(n/3) + O(n)$ / FFT</td>
              <td>$\\Theta(n^{1.465})$ / $\\Theta(n \\log n)$</td>
              <td>$n &gt; 2000$ limbs (GMP library)</td>
            </tr>
            <tr>
              <td>Cache-Blocked GEMM vs. Strassen</td>
              <td>$8T(n/2)$ vs. $7T(n/2) + 18(n/2)^2$</td>
              <td>$\\Theta(n^3)$ vs. $\\Theta(n^{2.807})$</td>
              <td>Strassen wins for $n \\ge 512\\text{–}1024$</td>
            </tr>
          </tbody>
        </table>

        <div class="invariant-box">
          <div class="invariant-title">Master Theorem Case 1: Leaf-Dominated Recurrences</div>
          <p>In both Karatsuba ($a=3, b=2, d=1$) and Strassen ($a=7, b=2, d=2$), the branching factor $a$ strictly exceeds $b^d$ ($3 &gt; 2^1$ and $7 &gt; 2^2$). Consequently, work grows geometrically down the recursion tree by a factor of $3/2$ or $7/4$ per level. Stopping the recursion at a tuned base-case leaf size $n_0$ (e.g., $n_0 = 32$ for Karatsuba, $n_0 = 64$ for Strassen) replaces the bottom $\\log_2 n_0$ levels of recursive allocation overhead with vectorizable SIMD loops, speeding up total runtime by $5\\times\\text{–}15\\times$!</p>
        </div>

        <svg viewBox="0 0 680 220" width="100%" height="220" role="img" aria-label="Karatsuba 3-way split vs Schoolbook 4-way split recursion tree">
          <rect width="680" height="220" rx="8" fill="#0f172a"/>
          <text x="20" y="26" fill="#e2e8f0" font-size="14" font-weight="bold">Karatsuba Gauss Trick: Replacing 2 Cross-Multiplications with 1 Sum-Product</text>

          <!-- Left box: Naive 4 products -->
          <g transform="translate(20, 45)">
            <rect x="0" y="0" width="290" height="155" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="1.5"/>
            <text x="145" y="24" text-anchor="middle" fill="#fca5a5" font-size="13" font-weight="bold">Naive Divide &amp; Conquer (4 Calls)</text>
            <text x="20" y="55" fill="#cbd5e1" font-size="12">1. x_1 · y_1   (High × High)</text>
            <text x="20" y="78" fill="#cbd5e1" font-size="12">2. x_1 · y_0   (High × Low)</text>
            <text x="20" y="101" fill="#cbd5e1" font-size="12">3. x_0 · y_1   (Low × High)</text>
            <text x="20" y="124" fill="#cbd5e1" font-size="12">4. x_0 · y_0   (Low × Low)</text>
            <text x="145" y="146" text-anchor="middle" fill="#f87171" font-size="12" font-weight="bold">Leaves at depth k: 4^k = n^2</text>
          </g>

          <!-- Right box: Karatsuba 3 products -->
          <g transform="translate(345, 45)">
            <rect x="0" y="0" width="315" height="155" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
            <text x="157" y="24" text-anchor="middle" fill="#6ee7b7" font-size="13" font-weight="bold">Karatsuba Divide &amp; Conquer (3 Calls)</text>
            <text x="20" y="55" fill="#cbd5e1" font-size="12">1. z_2 = x_1 · y_1</text>
            <text x="20" y="80" fill="#cbd5e1" font-size="12">2. z_0 = x_0 · y_0</text>
            <text x="20" y="105" fill="#fde68a" font-size="12" font-weight="bold">3. z_m = (x_1 + x_0) · (y_1 + y_0)</text>
            <text x="20" y="126" fill="#93c5fd" font-size="11.5">Recover z_1 = z_m - z_2 - z_0 (2 Subtractions)</text>
            <text x="157" y="146" text-anchor="middle" fill="#34d399" font-size="12" font-weight="bold">Leaves at depth k: 3^k = n^{1.585}</text>
          </g>
        </svg>

        <div class="mermaid">
flowchart TD
  A["Multiply Polynomials A[0..n), B[0..n)"] --> B{"n <= 32?"}
  B -- "Yes (Base Case)" --> C["Schoolbook O(n^2) Nested Loop\n(L1 Cache + SIMD Auto-Vectorized)"]
  B -- "No (n > 32)" --> D["Split at m = n / 2:\nA = A_1 x^m + A_0, B = B_1 x^m + B_0"]
  D --> E["3 Recursive Calls of Size m:\nz_0 = A_0*B_0, z_2 = A_1*B_1, z_m = (A_0+A_1)*(B_0+B_1)"]
  E --> F["Combine in O(n): z_1 = z_m - z_2 - z_0\nAdd into Result at Offsets 0, m, 2m"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Arena Scratch Buffers &amp; IEEE-754 Stability in Strassen</div>
          <p>Two practical factors govern algebraic D&amp;C in production:</p>
          <ol>
            <li><strong>Heap Allocation Thrashing:</strong> If each Karatsuba call allocates three <code>std::vector</code>s on the heap, <code>malloc</code>/<code>free</code> lock contention destroys performance. Passing a single pre-allocated contiguous scratch arena bump-pointer reduces runtime by over $4\\times$.</li>
            <li><strong>Floating-Point Catastrophic Cancellation in Strassen:</strong> Because Strassen computes $C_{11} = M_1 + M_4 - M_5 + M_7$ by adding and subtracting quadrants of vastly different magnitudes, IEEE-754 floating-point error is bounded only in the <em>normwise</em> sense ($\\|\\Delta C\\| \\le c_n u \\|A\\| \\|B\\|$), not the <em>componentwise</em> sense ($|\\Delta C_{ij}| \\le c_n u (|A||B|)_{ij}$). If $A$ and $B$ have poorly scaled rows/columns, small entries in $C$ can lose all significant digits!</li>
          </ol>
        </div>

        <h2>Production C++20 Implementation: Arena-Backed Karatsuba Polynomial Multiplier</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstddef&gt;
#include &lt;cstdint&gt;
#include &lt;vector&gt;

// Multiplies two polynomials a[0..n-1] and b[0..n-1] (n = power of 2) into res[0..2n-1]
// Uses a pre-allocated scratch buffer to perform ZERO heap allocations during recursion!
void karatsuba_rec(const std::int64_t* a, const std::int64_t* b,
                   std::int64_t* res, std::int64_t* scratch, std::size_t n) noexcept {
    std::fill_n(res, 2 * n, 0);

    // Base case: Schoolbook O(n^2) loop auto-vectorizes cleanly for n <= 32
    if (n &lt;= 32) {
        for (std::size_t i = 0; i &lt; n; ++i) {
            for (std::size_t j = 0; j &lt; n; ++j) {
                res[i + j] += a[i] * b[j];
            }
        }
        return;
    }

    const std::size_t m = n / 2;
    const std::int64_t* a0 = a;
    const std::int64_t* a1 = a + m;
    const std::int64_t* b0 = b;
    const std::int64_t* b1 = b + m;

    // Carve out workspace from linear scratch arena:
    // sum_a[m], sum_b[m], z_m[2m], next_scratch[...]
    std::int64_t* sum_a = scratch;
    std::int64_t* sum_b = scratch + m;
    std::int64_t* z_m   = scratch + 2 * m;
    std::int64_t* next_scratch = scratch + 4 * m;

    for (std::size_t i = 0; i &lt; m; ++i) {
        sum_a[i] = a0[i] + a1[i];
        sum_b[i] = b0[i] + b1[i];
    }

    // 1. z0 = a0 * b0 stored directly in res[0 .. 2m-1]
    karatsuba_rec(a0, b0, res, next_scratch, m);
    // 2. z2 = a1 * b1 stored directly in res[2m .. 4m-1]
    karatsuba_rec(a1, b1, res + 2 * m, next_scratch, m);
    // 3. z_m = (a0 + a1) * (b0 + b1) stored in z_m[0 .. 2m-1]
    karatsuba_rec(sum_a, sum_b, z_m, next_scratch, m);

    // Combine: z1 = z_m - z0 - z2 added into res[m .. 3m-1]
    for (std::size_t i = 0; i &lt; 2 * m; ++i) {
        z_m[i] -= (res[i] + res[2 * m + i]);
    }
    for (std::size_t i = 0; i &lt; 2 * m; ++i) {
        res[m + i] += z_m[i];
    }
}

std::vector&lt;std::int64_t&gt; karatsuba_multiply(const std::vector&lt;std::int64_t&gt;&amp; A,
                                             const std::vector&lt;std::int64_t&gt;&amp; B) {
    std::size_t n = 1;
    const std::size_t max_len = std::max(A.size(), B.size());
    while (n &lt; max_len) n &lt;&lt;= 1;

    std::vector&lt;std::int64_t&gt; a_pad(n, 0), b_pad(n, 0);
    std::copy(A.begin(), A.end(), a_pad.begin());
    std::copy(B.begin(), B.end(), b_pad.begin());

    std::vector&lt;std::int64_t&gt; res(2 * n, 0);
    std::vector&lt;std::int64_t&gt; scratch(6 * n, 0); // 4m + 4(m/2) + ... <= 4n scratch space
    karatsuba_rec(a_pad.data(), b_pad.data(), res.data(), scratch.data(), n);
    res.resize(A.size() + B.size() - 1);
    return res;
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Carry Propagation in Big-Integer Karatsuba</div>
          <p>When multiplying polynomials, $a_0 + a_1$ has the exact same degree $m-1$ as $a_0$ and $a_1$. When multiplying <strong>base-$2^{64}$ big integers</strong>, however, the sum $x_0 + x_1$ can produce a $1$-bit carry into limb $m+1$, making the recursive operands $(m+1)$ limbs wide! Moreover, subtracting $z_2$ and $z_0$ requires signed borrow handling. Production big-int libraries (like GMP) either work with redundant limb representations or handle the top carry bit explicitly outside the $m$-limb recursion.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Karatsuba replaces 4 half-size multiplications with 3 using z_1 = (x_1 + x_0)(y_1 + y_0) - x_1*y_1 - x_0*y_0, reducing complexity from O(n^2) to O(n^{log_2 3}) = O(n^{1.585}).",
      "Strassen replaces 8 block matrix multiplications with 7 and 18 block additions/subtractions, reducing complexity from O(n^3) to O(n^{log_2 7}) = O(n^{2.807}).",
      "Because both recurrences fall into Master Theorem Case 1 (leaf-dominated), cutting off recursion at a base-case size (n <= 32 or 64) and switching to a flat SIMD loop eliminates 90%+ of recursion overhead.",
      "Passing a pre-allocated linear scratch buffer avoids O(n^{1.585}) heap allocations during recursion."
    ],
    furtherReading: [
      {
        title: "Karatsuba & Ofman (1962) — Multiplication of Many-Digital Numbers by Automatic Computers",
        url: "https://www.mathnet.ru/eng/dan26914"
      },
      {
        title: "Strassen (1969) — Gaussian Elimination is Not Optimal (Numerische Mathematik)",
        url: "https://doi.org/10.1007/BF02165411"
      },
      {
        title: "Higham — Accuracy and Stability of Numerical Algorithms (2nd Ed.), §23.2 Strassen's Method",
        url: "https://doi.org/10.1137/1.9780898718027"
      }
    ]
  },

  "fast-fourier-transform-polynomials": {
    title: "Fast Fourier Transform (Cooley-Tukey FFT) & O(N log N) Polynomial Convolution",
    video: {
      youtubeId: "h7apO7q16V0",
      title: "But what is the Fast Fourier Transform? A visual introduction (Reducible)",
      channel: "Reducible",
      duration: "27:33",
      start: 0,
      length: 1653,
      why: "Crystal-clear visual derivation of polynomial evaluation vs interpolation, +/- pairing symmetry, complex roots of unity, and the Cooley-Tukey O(N log N) butterfly."
    },
    intuition: "Multiplying two degree-N polynomials in coefficient form takes O(N^2) convolutions, but multiplying them in point-value form at 2N sample points takes O(N) pointwise products! Evaluating a polynomial at 2N arbitrary points still takes O(N^2)—unless we split the polynomial into even and odd powers A(x) = A_even(x^2) + x * A_odd(x^2) and choose the 2N-th complex roots of unity, whose squares collapse by half at every level down to O(N log N).",
    content: `
      <div class="lesson-content">
        <h2>Coefficient Representation vs. Point-Value Representation</h2>
        <p>A polynomial $A(x) = \\sum_{j=0}^{n-1} a_j x^j$ of degree $&lt; n$ can be represented in two dual ways:</p>
        <ol>
          <li><strong>Coefficient Form:</strong> The vector $(a_0, a_1, \\dots, a_{n-1})$. Adding two polynomials takes $O(n)$, but multiplying $C(x) = A(x)B(x)$ requires discrete convolution $c_k = \\sum_{j=0}^{k} a_j b_{k-j}$ in $\\Theta(n^2)$ time.</li>
          <li><strong>Point-Value Form:</strong> A set of $n$ distinct sample points $\\{(x_0, y_0), \\dots, (x_{n-1}, y_{n-1})\\}$ where $y_k = A(x_k)$. By the Fundamental Theorem of Algebra, $n$ point-value pairs uniquely determine a polynomial of degree $&lt; n$. In point-value form, multiplying $C(x) = A(x)B(x)$ (padded to $N \\ge 2n - 1$ points) is simply <strong>pointwise multiplication</strong> $C(x_k) = A(x_k) \\cdot B(x_k)$ in $\\Theta(N)$ time!</li>
        </ol>

        <h2>The Collapsing Property of Complex $N$-th Roots of Unity</h2>
        <p>How can we evaluate $A(x)$ at $N$ points in $O(N \\log N)$ time instead of $O(N^2)$? Group the terms of $A(x)$ into even-indexed and odd-indexed coefficients:</p>
        $$A(x) = \\underbrace{(a_0 + a_2 x^2 + a_4 x^4 + \\dots)}_{A_{\\text{even}}(x^2)} + x \\underbrace{(a_1 + a_3 x^2 + a_5 x^4 + \\dots)}_{A_{\\text{odd}}(x^2)}$$
        <p>Notice that both $A_{\\text{even}}(u)$ and $A_{\\text{odd}}(u)$ are polynomials of half the size ($N/2$) evaluated at $u = x^2$. If we choose evaluation points that come in opposite pairs $\\pm x$, then $(+x)^2 = (-x)^2 = x^2$, so evaluating $A$ at <strong>$N$ points reduces to evaluating $A_{\\text{even}}$ and $A_{\\text{odd}}$ at only $N/2$ squared points</strong>! For this +/- symmetry to hold recursively across all $\\log_2 N$ levels (where squares of squares must also be +/- pairs), we must choose the <strong>complex $N$-th roots of unity</strong>:</p>
        $$\\omega_N^k = e^{2\\pi i k / N} = \\cos\\!\\left(\\frac{2\\pi k}{N}\\right) + i \\sin\\!\\left(\\frac{2\\pi k}{N}\\right), \\qquad k = 0, 1, \\dots, N-1$$

        <div class="simulator-mount" data-sim="sim-fft-butterfly-karatsuba"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Transform / Convolution Method</th>
              <th>Time Complexity</th>
              <th>Arithmetic Domain</th>
              <th>Numerical Precision / Constraints</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Direct Convolution / Karatsuba</td>
              <td>$\\Theta(N^2)$ / $\\Theta(N^{1.585})$</td>
              <td>Exact Integers / Reals</td>
              <td>Exact; slow for $N &gt; 5000$</td>
            </tr>
            <tr>
              <td>Cooley-Tukey Radix-2 FFT</td>
              <td>$\\Theta(N \\log N)$</td>
              <td>Complex <code>double</code> ($\mathbb{C}$)</td>
              <td>~53-bit mantissa; rounding error for coefficients $&gt; 10^{14}$</td>
            </tr>
            <tr>
              <td>Number-Theoretic Transform (NTT)</td>
              <td>$\\Theta(N \\log N)$</td>
              <td>$\\mathbb{Z}_p$ ($p = 998244353 = 119 \\cdot 2^{23} + 1$)</td>
              <td>100% Exact Modular Arithmetic (Primitive Root $g = 3$)</td>
            </tr>
          </tbody>
        </table>

        <div class="invariant-box">
          <div class="invariant-title">Halving &amp; Reflection Lemmas (The Cooley-Tukey Butterfly)</div>
          <p>For any even $N$ and $k \\in [0, N/2)$:</p>
          <ol>
            <li><strong>Halving Lemma:</strong> $\\left(\\omega_N^k\\right)^2 = \\left(\\omega_N^{k + N/2}\\right)^2 = e^{2\\pi i k / (N/2)} = \\omega_{N/2}^k$. Squaring all $N$ roots of unity collapses them into the $N/2$-th roots of unity twice over.</li>
            <li><strong>Reflection Lemma:</strong> $\\omega_N^{k + N/2} = -\\omega_N^k$.</li>
          </ol>
          <p>Combining these gives the <strong>Radix-2 Butterfly Operation</strong> that computes both $y_k$ and $y_{k + N/2}$ from $u = y^{[\\text{even}]}_k$ and $v = \\omega_N^k \\cdot y^{[\\text{odd}]}_k$ in $O(1)$:</p>
          $$y_k = u + v, \\qquad y_{k + N/2} = u - v$$
          <p>And because the Vandermonde matrix $V_N[j, k] = \\omega_N^{jk}$ satisfies $V_N^{-1}[j, k] = \\frac{1}{N} \\omega_N^{-jk}$, the <strong>Inverse FFT (IFFT)</strong> uses the exact same algorithm with $\\omega_N^{-1} = e^{-2\\pi i / N}$ followed by dividing each output by $N$!</p>
        </div>

        <svg viewBox="0 0 680 230" width="100%" height="230" role="img" aria-label="Cooley-Tukey Radix-2 FFT Butterfly and 8th roots of unity on the complex unit circle">
          <rect width="680" height="230" rx="8" fill="#0f172a"/>
          <text x="20" y="26" fill="#e2e8f0" font-size="14" font-weight="bold">8th Roots of Unity on the Unit Circle &amp; The Radix-2 Butterfly Operation</text>

          <!-- Left: Complex Unit Circle -->
          <g transform="translate(135, 130)">
            <circle cx="0" cy="0" r="72" fill="none" stroke="#475569" stroke-width="2"/>
            <line x1="-88" y1="0" x2="88" y2="0" stroke="#64748b" stroke-width="1.5"/>
            <line x1="0" y1="-85" x2="0" y2="85" stroke="#64748b" stroke-width="1.5"/>
            <line x1="-51" y1="-51" x2="51" y2="51" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,3"/>
            <line x1="-51" y1="51" x2="51" y2="-51" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,3"/>

            <!-- 8 roots -->
            <circle cx="72" cy="0" r="5" fill="#10b981"/>
            <text x="80" y="4" fill="#6ee7b7" font-size="11" font-weight="bold">ω^0 = 1</text>

            <circle cx="51" cy="-51" r="5" fill="#fbbf24"/>
            <text x="58" y="-54" fill="#fde68a" font-size="11" font-weight="bold">ω^1</text>

            <circle cx="0" cy="-72" r="5" fill="#3b82f6"/>
            <text x="8" y="-76" fill="#93c5fd" font-size="11">ω^2 = i</text>

            <circle cx="-72" cy="0" r="5" fill="#ef4444"/>
            <text x="-126" y="4" fill="#fca5a5" font-size="11" font-weight="bold">ω^4 = -1</text>

            <circle cx="-51" cy="51" r="5" fill="#fbbf24"/>
            <text x="-118" y="65" fill="#fde68a" font-size="11" font-weight="bold">ω^5 = -ω^1</text>
          </g>

          <!-- Right: Radix-2 Butterfly Diagram -->
          <g transform="translate(320, 65)">
            <rect x="0" y="0" width="335" height="140" rx="6" fill="#1e293b" stroke="#334155"/>
            <text x="167" y="22" text-anchor="middle" fill="#cbd5e1" font-size="12.5" font-weight="bold">Cooley-Tukey Radix-2 Butterfly</text>

            <text x="20" y="55" fill="#93c5fd" font-size="13" font-weight="bold">u = A_even(ω_N^{2k})</text>
            <text x="20" y="115" fill="#fde68a" font-size="13" font-weight="bold">v = ω_N^k · A_odd(ω_N^{2k})</text>

            <line x1="175" y1="50" x2="245" y2="50" stroke="#3b82f6" stroke-width="2.5"/>
            <line x1="175" y1="50" x2="245" y2="110" stroke="#3b82f6" stroke-width="2"/>
            <line x1="175" y1="110" x2="245" y2="50" stroke="#fbbf24" stroke-width="2"/>
            <line x1="175" y1="110" x2="245" y2="110" stroke="#ef4444" stroke-width="2.5"/>

            <text x="255" y="55" fill="#6ee7b7" font-size="12.5" font-weight="bold">y_k = u + v</text>
            <text x="255" y="115" fill="#fca5a5" font-size="12.5" font-weight="bold">y_{k+N/2} = u - v</text>
          </g>
        </svg>

        <div class="mermaid">
flowchart LR
  A["Coeffs A(x), B(x)\nZero-Pad to 2^k >= deg(A)+deg(B)+1"] --> B["Forward Iterative FFT\nBit-Reversal + log N Butterfly Stages\nO(N log N)"]
  B --> C["Pointwise Product\nC(ω^k) = A(ω^k) * B(ω^k)\nO(N)"]
  C --> D["Inverse FFT (IFFT)\nConjugate Roots ω^{-k} and Divide by N\nO(N log N)"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Bit-Reversal In-Place Iterative FFT vs. Recursive Out-of-Place</div>
          <p>A recursive FFT allocates temporary arrays at every level to separate even indices ($0, 2, 4, 6$) and odd indices ($1, 3, 5, 7$). Observe what happens to the binary representation of index $i$ as we repeatedly partition by parity (least significant bit first, then second bit, etc.): an index $i$ ends up at the position given by <strong>reversing its $\\log_2 N$ binary bits</strong>! By permuting the array in-place via a single $O(N)$ bit-reversal pass upfront, we can execute all $\\log_2 N$ butterfly stages <strong>purely in-place and bottom-up</strong> ($len = 2, 4, 8, \\dots, N$) with zero heap allocations and sequential SIMD memory strides.</p>
        </div>

        <h2>Production C++20 Implementation: Iterative In-Place FFT &amp; Polynomial Convolution</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cmath&gt;
#include &lt;complex&gt;
#include &lt;cstddef&gt;
#include &lt;cstdint&gt;
#include &lt;numbers&gt;
#include &lt;vector&gt;

using cd = std::complex&lt;double&gt;;

// In-place Iterative Radix-2 Cooley-Tukey FFT (invert = false) and IFFT (invert = true)
void fft_inplace(std::vector&lt;cd&gt;&amp; a, bool invert) noexcept {
    const std::size_t n = a.size();

    // 1. O(N) In-place Bit-Reversal Permutation
    for (std::size_t i = 1, j = 0; i &lt; n; ++i) {
        std::size_t bit = n &gt;&gt; 1;
        for (; j &amp; bit; bit &gt;&gt;= 1) {
            j ^= bit;
        }
        j ^= bit;
        if (i &lt; j) std::swap(a[i], a[j]);
    }

    // 2. Bottom-Up Butterfly Stages: len = 2, 4, 8, ..., n
    for (std::size_t len = 2; len &lt;= n; len &lt;&lt;= 1) {
        const double ang = 2.0 * std::numbers::pi / static_cast&lt;double&gt;(len) * (invert ? -1.0 : 1.0);
        const cd wlen(std::cos(ang), std::sin(ang));
        const std::size_t half = len &gt;&gt; 1;

        for (std::size_t i = 0; i &lt; n; i += len) {
            cd w(1.0, 0.0);
            for (std::size_t j = 0; j &lt; half; ++j) {
                const cd u = a[i + j];
                const cd v = a[i + j + half] * w;
                a[i + j]        = u + v;
                a[i + j + half] = u - v;
                w *= wlen;
            }
        }
    }

    // 3. Normalize by 1/N for Inverse FFT
    if (invert) {
        const double inv_n = 1.0 / static_cast&lt;double&gt;(n);
        for (cd&amp; x : a) x *= inv_n;
    }
}

// Convolves two integer polynomials A and B in O(N log N) time
std::vector&lt;std::int64_t&gt; multiply_polynomials_fft(const std::vector&lt;std::int64_t&gt;&amp; A,
                                                   const std::vector&lt;std::int64_t&gt;&amp; B) {
    if (A.empty() || B.empty()) return {};
    const std::size_t result_len = A.size() + B.size() - 1;
    std::size_t n = 1;
    while (n &lt; result_len) n &lt;&lt;= 1;

    std::vector&lt;cd&gt; fa(n, cd(0.0, 0.0)), fb(n, cd(0.0, 0.0));
    for (std::size_t i = 0; i &lt; A.size(); ++i) fa[i] = static_cast&lt;double&gt;(A[i]);
    for (std::size_t i = 0; i &lt; B.size(); ++i) fb[i] = static_cast&lt;double&gt;(B[i]);

    fft_inplace(fa, false);
    fft_inplace(fb, false);
    for (std::size_t i = 0; i &lt; n; ++i) {
        fa[i] *= fb[i];
    }
    fft_inplace(fa, true);

    std::vector&lt;std::int64_t&gt; result(result_len);
    for (std::size_t i = 0; i &lt; result_len; ++i) {
        result[i] = static_cast&lt;std::int64_t&gt;(std::llround(fa[i].real()));
    }
    return result;
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Circular Wrap-Around &amp; Floating-Point Twiddle Drift</div>
          <p>Two bugs frequently corrupt FFT convolutions:</p>
          <ol>
            <li><strong>Under-padding (Circular Convolution):</strong> Multiplying degree-$d_1$ and degree-$d_2$ polynomials produces degree $d_1 + d_2$ ($d_1 + d_2 + 1$ coefficients). If you only pad $N$ to $\\max(d_1, d_2)$ instead of the next power of two $\\ge d_1 + d_2 + 1$, terms with $k \\ge N$ alias mod $N$ ($x^N \\equiv 1$) and corrupt the low coefficients!</li>
            <li><strong>Twiddle Factor Drift &amp; Integer Overflow:</strong> Repeatedly multiplying <code>w *= wlen</code> over $N = 2^{20}$ iterations accumulates IEEE-754 rounding error. For exact integer convolutions where coefficients exceed $2^{53} \\approx 9 \\times 10^{15}$, use the <strong>Number-Theoretic Transform (NTT)</strong> modulo a prime $p = c \\cdot 2^k + 1$ (such as $998244353 = 119 \\cdot 2^{23} + 1$, where $3^{(p-1)/N} \\bmod p$ serves as an exact integer $N$-th root of unity).</li>
          </ol>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Multiplying polynomials of degree < n takes O(n^2) in coefficient form (convolution) but O(n) in point-value form (pointwise product).",
      "Splitting A(x) = A_even(x^2) + x * A_odd(x^2) and evaluating at complex N-th roots of unity collapses the evaluation points in half at every level via (omega_N^k)^2 = omega_{N/2}^k.",
      "The Inverse FFT uses the conjugate roots omega_N^{-k} and scales by 1/N because the Vandermonde Fourier matrix is unitary up to scale N.",
      "Bit-reversal permutation orders the leaves upfront so all log_2 N butterfly stages run bottom-up and in-place with zero extra memory allocations."
    ],
    furtherReading: [
      {
        title: "Cooley & Tukey (1965) — An Algorithm for the Machine Calculation of Complex Fourier Series",
        url: "https://doi.org/10.1090/S0025-5718-1965-0178586-1"
      },
      {
        title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Chapter 30: Polynomials and the FFT",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      },
      {
        title: "CP-Algorithms — Fast Fourier Transform & Number Theoretic Transform",
        url: "https://cp-algorithms.com/algebra/fft.html"
      }
    ]
  },

  "meet-in-the-middle-search": {
    title: "Meet-in-the-Middle: Halving the Exponent from O(2^N) to O(2^(N/2) log(2^(N/2)))",
    video: {
      youtubeId: "57SUNQL4JFA",
      title: "Meet in the Middle Algorithm — Bidirectional Exponential Search",
      channel: "Gaurav Sen",
      duration: "19:42",
      start: 0,
      length: 1182,
      why: "Demonstrates how splitting an N=40 exponential search space into two N/2=20 halves turns an impossible 10^12-operation brute force into a 10^6-element two-pointer sweep."
    },
    intuition: "When N = 40 and weights are arbitrary 64-bit integers, dynamic programming O(N * W) fails because W = 10^18, and brute-force enumeration O(2^40) = 1.1 * 10^12 times out. Splitting the 40 items into two independent halves of 20 items each produces only 2^20 = 1,048,576 subset sums per half—which easily fit in L3 cache and can be combined via two-pointer sweep in ~10 milliseconds!",
    content: `
      <div class="lesson-content">
        <h2>The Exponential Wall at $N = 40$ and Horowitz-Sahni (1974)</h2>
        <p>Consider the exact or closest <strong>Subset Sum</strong> problem: given $N$ signed 64-bit integers $A = [a_0, a_1, \\dots, a_{N-1}]$ and a target sum $T$ (where $|a_i|, |T| \\le 10^{18}$), find a subset $S \\subseteq \\{0, \\dots, N-1\\}$ whose sum $\\sum_{i \\in S} a_i$ equals $T$ (or is the largest sum $\\le T$). Why do standard techniques fail when $N = 40$?</p>
        <ul>
          <li><strong>Pseudo-polynomial DP ($O(N \\cdot T)$):</strong> Fails catastrophically when $T = 10^{18}$ (requires exabytes of RAM).</li>
          <li><strong>Exhaustive Brute Force ($O(2^N)$):</strong> At $N = 40$, $2^{40} = 1{,}099{,}511{,}627{,}776 \\approx 1.1 \\times 10^{12}$ states—requiring minutes of CPU time.</li>
        </ul>
        <p>In 1974, Ellis Horowitz and Sartaj Sahni introduced the <strong>Meet-in-the-Middle</strong> paradigm: partition the input array $A$ into two disjoint halves of size $n_1 = \\lfloor N/2 \\rfloor$ and $n_2 = \\lceil N/2 \\rceil$:</p>
        $$A_L = A[0 .. n_1 - 1], \\qquad A_R = A[n_1 .. N - 1]$$
        <p>Any subset $S \\subseteq A$ uniquely decomposes into $S_L \\subseteq A_L$ and $S_R \\subseteq A_R$ such that $\\text{sum}(S) = \\text{sum}(S_L) + \\text{sum}(S_R) = T$. Thus, enumerating all $2^{n_1}$ subset sums of $A_L$ into a list $L$ and all $2^{n_2}$ subset sums of $A_R$ into a list $R$ reduces Subset Sum to the classic <strong>2-SUM problem</strong>: find $x \\in L$ and $y \\in R$ such that $x + y = T$ (or $x + y \\le T$ is maximized)!</p>

        <div class="simulator-mount" data-sim="sim-binary-search-decision"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Algorithm / Variant ($N = 40$)</th>
              <th>Time Complexity</th>
              <th>Auxiliary Space</th>
              <th>Operations at $N = 40$</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Naive Recursive / Bitmask Brute Force</td>
              <td>$\\Theta(2^N)$</td>
              <td>$O(1)$</td>
              <td>$\\approx 1.10 \\times 10^{12}$ ops (TLE)</td>
            </tr>
            <tr>
              <td>Meet-in-the-Middle + Sort + Binary Search</td>
              <td>$\\Theta\\!\\left(N \\cdot 2^{N/2}\\right)$</td>
              <td>$\\Theta(2^{N/2})$</td>
              <td>$\\approx 2.1 \\times 10^7$ ops (~25 ms)</td>
            </tr>
            <tr>
              <td>Meet-in-the-Middle + Incremental Merge + 2-Pointer</td>
              <td>$\\Theta\\!\\left(2^{N/2}\\right)$</td>
              <td>$\\Theta(2^{N/2})$</td>
              <td>$\\approx 2.1 \\times 10^6$ ops (~3 ms!)</td>
            </tr>
            <tr>
              <td>Schroeppel-Shamir (1981) 4-Way Split + Heap</td>
              <td>$\\Theta\\!\\left(N \\cdot 2^{N/2}\\right)$</td>
              <td>$\\Theta\\!\\left(2^{N/4}\\right)$</td>
              <td>Space drops to $2^{10} = 1024$ elements!</td>
            </tr>
          </tbody>
        </table>

        <div class="invariant-box">
          <div class="invariant-title">Shaving the Extra $\\log(2^{N/2}) = N/2$ Factor via Incremental Merge</div>
          <p>If you generate all $2^{N/2}$ subset sums in arbitrary bitmask order and then call <code>std::sort</code>, sorting takes $O(2^{N/2} \\log(2^{N/2})) = O(N \\cdot 2^{N/2})$ time. Instead, build the sorted subset-sum array $L$ <strong>incrementally one element at a time</strong>:</p>
          <p>Suppose after processing $k$ items, $L[0 .. 2^k - 1]$ is already sorted. Adding item $a_k$ produces $2^k$ new sums $L[0]+a_k, \\dots, L[2^k-1]+a_k$, which are <strong>already in sorted order</strong>! Merging these two sorted halves of size $2^k$ takes $O(2^{k+1})$ linear time. Summing over all $k = 0 \\dots N/2 - 1$ gives a geometric series:</p>
          $$\\sum_{k=0}^{N/2 - 1} O(2^{k+1}) = O(2 + 4 + 8 + \\dots + 2^{N/2}) = \\Theta\\!\\left(2^{N/2}\\right)$$
          <p>Once both $L$ and $R$ are generated in sorted order in $\\Theta(2^{N/2})$ time, a single linear <strong>two-pointer sweep</strong> ($i$ ascending in $L$, $j$ descending in $R$) finds the optimal pair in $\\Theta(2^{N/2})$ time—completely eliminating the factor of $N/2 = 20$!</p>
        </div>

        <svg viewBox="0 0 680 225" width="100%" height="225" role="img" aria-label="Meet in the Middle splitting N=40 into two halves of N/2=20 and sweeping with two pointers">
          <rect width="680" height="225" rx="8" fill="#0f172a"/>
          <text x="20" y="26" fill="#e2e8f0" font-size="14" font-weight="bold">Meet-in-the-Middle: Splitting N = 40 into Two Sorted Halves of Size 2^20 = 1,048,576</text>

          <!-- Top input split -->
          <rect x="30" y="45" width="290" height="36" rx="5" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
          <text x="175" y="68" text-anchor="middle" fill="#93c5fd" font-size="12.5" font-weight="bold">Left Half A_L [0 .. 19] (20 items)</text>

          <rect x="360" y="45" width="290" height="36" rx="5" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
          <text x="505" y="68" text-anchor="middle" fill="#6ee7b7" font-size="12.5" font-weight="bold">Right Half A_R [20 .. 39] (20 items)</text>

          <!-- Down arrows -->
          <path d="M 175 83 L 175 110" stroke="#3b82f6" stroke-width="2"/>
          <path d="M 505 83 L 505 110" stroke="#10b981" stroke-width="2"/>

          <!-- Sorted arrays L and R -->
          <rect x="30" y="114" width="290" height="44" rx="5" fill="#172554" stroke="#60a5fa" stroke-width="2"/>
          <text x="175" y="133" text-anchor="middle" fill="#dbeafe" font-size="12" font-weight="bold">Sorted L (2^20 = 1,048,576 sums)</text>
          <text x="175" y="150" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="bold">i = 0 ───────────► (Ascending)</text>

          <rect x="360" y="114" width="290" height="44" rx="5" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
          <text x="505" y="133" text-anchor="middle" fill="#d1fae5" font-size="12" font-weight="bold">Sorted R (2^20 = 1,048,576 sums)</text>
          <text x="505" y="150" text-anchor="middle" fill="#fbbf24" font-size="11.5" font-weight="bold">(Descending) ◄─────────── j = |R|-1</text>

          <!-- Bottom Two-Pointer Combine -->
          <rect x="115" y="175" width="450" height="36" rx="6" fill="#311042" stroke="#c084fc" stroke-width="2"/>
          <text x="340" y="198" text-anchor="middle" fill="#f3e8ff" font-size="12.5" font-weight="bold">Two-Pointer Combine: If L[i] + R[j] &le; T, record &amp; ++i; else --j  →  O(2^{N/2})</text>
        </svg>

        <div class="mermaid">
flowchart LR
  A["Array A of Size N <= 46"] --> B["Split into A_L (N/2) & A_R (N - N/2)"]
  B --> C["Generate Sorted Subset Sums L\nvia Incremental Merge in O(2^{N/2})"]
  B --> D["Generate Sorted Subset Sums R\nvia Incremental Merge in O(2^{N/2})"]
  C --> E["Two-Pointer Sweep (i in L up, j in R down)\nTotal Time: O(2^{N/2})"]
  D --> E
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Why $2^{20}$ Int64s Fly in L3 Cache vs. Hash Table Disasters</div>
          <p>A common beginner mistake in Meet-in-the-Middle is inserting the $2^{20} = 1{,}048{,}576$ left subset sums into an <code>std::unordered_set&lt;int64_t&gt;</code> and probing it $2^{20}$ times. An <code>std::unordered_set</code> of $10^6$ nodes allocates $10^6$ separate heap objects (~32–48 MB of pointer-chasing nodes) and incurs millions of L3 cache/TLB misses. By contrast, a flat <code>std::vector&lt;int64_t&gt;</code> of size $2^{20}$ occupies exactly <strong>$8\\text{ MB}$ of contiguous RAM</strong>—fitting entirely inside modern CPU L3 cache ($16\\text{–}64\\text{ MB}$)—and both the incremental merge and two-pointer sweep access memory purely sequentially at hardware prefetcher speed!</p>
        </div>

        <h2>Production C++20 Implementation: $O(2^{N/2})$ Subset Sum via Incremental Merge &amp; Two Pointers</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstddef&gt;
#include &lt;cstdint&gt;
#include &lt;limits&gt;
#include &lt;span&gt;
#include &lt;vector&gt;

// Generates all 2^k subset sums of items in strictly sorted order in O(2^k) time
// without calling std::sort, using incremental std::inplace_merge!
std::vector&lt;std::int64_t&gt; generate_sorted_subset_sums(std::span&lt;const std::int64_t&gt; items) {
    const std::size_t k = items.size();
    std::vector&lt;std::int64_t&gt; sums;
    sums.reserve(std::size_t{1} &lt;&lt; k);
    sums.push_back(0);

    for (const std::int64_t x : items) {
        const std::size_t curr_sz = sums.size();
        for (std::size_t i = 0; i &lt; curr_sz; ++i) {
            sums.push_back(sums[i] + x);
        }
        // Merge the two sorted halves [0, curr_sz) and [curr_sz, 2*curr_sz) in linear time
        if (x &gt;= 0) {
            std::inplace_merge(sums.begin(),
                               sums.begin() + static_cast&lt;std::ptrdiff_t&gt;(curr_sz),
                               sums.end());
        } else {
            // Even for negative x, [curr_sz, 2*curr_sz) is still sorted ascending!
            std::inplace_merge(sums.begin(),
                               sums.begin() + static_cast&lt;std::ptrdiff_t&gt;(curr_sz),
                               sums.end());
        }
    }
    return sums;
}

// Finds the maximum subset sum <= target in O(2^(N/2)) time and space
std::int64_t max_subset_sum_at_most(const std::vector&lt;std::int64_t&gt;&amp; nums,
                                    std::int64_t target) {
    const std::size_t n = nums.size();
    const std::size_t mid = n / 2;

    std::span&lt;const std::int64_t&gt; left_span(nums.data(), mid);
    std::span&lt;const std::int64_t&gt; right_span(nums.data() + mid, n - mid);

    const std::vector&lt;std::int64_t&gt; L = generate_sorted_subset_sums(left_span);
    const std::vector&lt;std::int64_t&gt; R = generate_sorted_subset_sums(right_span);

    std::int64_t best = std::numeric_limits&lt;std::int64_t&gt;::min();
    std::size_t i = 0;
    std::ptrdiff_t j = static_cast&lt;std::ptrdiff_t&gt;(R.size()) - 1;

    // Linear O(2^(N/2)) two-pointer sweep
    while (i &lt; L.size() &amp;&amp; j &gt;= 0) {
        const std::int64_t cur = L[i] + R[static_cast&lt;std::size_t&gt;(j)];
        if (cur &lt;= target) {
            if (cur &gt; best) best = cur;
            if (best == target) return best; // Exact match early exit
            ++i;
        } else {
            --j;
        }
    }
    return best;
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Asymmetric Splits When $N$ Is Odd or When Applying 0/1 Knapsack Dominance Pruning</div>
          <p>If $N = 41$, splitting into $20$ and $21$ gives $|L| = 1.05 \\times 10^6$ and $|R| = 2.10 \\times 10^6$. If you use binary search (lookup each element of one list in the other), always sort the <em>larger</em> list and binary-search from the <em>smaller</em> list, or use the symmetric two-pointer sweep above. Furthermore, in <strong>0/1 Knapsack Meet-in-the-Middle</strong> (pairs $(w_i, v_i)$ sorted by weight $w_i$), before running two pointers, filter the right list $R$ in $O(|R|)$ to remove <em>dominated states</em> (any state with higher weight $w_b \\ge w_a$ but smaller or equal value $v_b \\le v_a$) so that remaining states are strictly increasing in both weight and value!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Meet-in-the-Middle cuts the exponent of exhaustive search in half by decomposing an N-item space into two independent N/2-item halves.",
      "Building subset sums via incremental linear merging takes O(2 + 4 + ... + 2^(N/2)) = O(2^(N/2)) time, shaving off the O(N) sorting factor.",
      "Combining two sorted lists of size 2^(N/2) with opposite-direction two pointers takes linear O(2^(N/2)) time and sequential L1/L3 cache scans.",
      "For 0/1 Knapsack with large weights, removing weight-value dominated states makes the sorted list monotonic in both coordinates, enabling two-pointer or binary search queries."
    ],
    furtherReading: [
      {
        title: "Horowitz & Sahni (1974) — Computing Partitions with Applications to the Knapsack Problem (JACM)",
        url: "https://doi.org/10.1145/321812.321823"
      },
      {
        title: "Schroeppel & Shamir (1981) — A T = O(2^(n/2)), S = O(2^(n/4)) Algorithm for Certain NP-Complete Problems (SIAM J. Comput.)",
        url: "https://doi.org/10.1137/0210033"
      },
      {
        title: "CP-Algorithms / USACO Guide — Meet in the Middle",
        url: "https://usaco.guide/gold/meet-in-the-middle"
      }
    ]
  },

  "cdq-divide-and-conquer": {
    title: "Offline Divide-and-Conquer over Time (CDQ Divide-and-Conquer for 3D Partial Orders)",
    video: {
      youtubeId: "xVka6z1hu-I",
      id: "xVka6z1hu-I",
      url: "https://www.youtube.com/embed/xVka6z1hu-I",
      title: "MIT 6.851 Lecture 9: Orthogonal Range Searching & Multi-Dimensional Divide-and-Conquer",
      channel: "MIT OpenCourseWare",
      duration: "1:22:40",
      start: 0,
      length: "82m",
      why: "Explains how divide-and-conquer eliminates one coordinate dimension per recursion level, the foundational principle behind CDQ divide-and-conquer."
    },
    intuition: "In 2D dominance (counting inversions), Merge Sort sorts by X first and merges by Y while counting how many left-half elements beat each right-half element. What about 3D dominance (x_i <= x_j, y_i <= y_j, z_i <= z_j)? Instead of building an expensive 2D Segment Tree of O(N log^2 N) space, CDQ Divide-and-Conquer sorts by X, recurses on [lo, mid) and [mid, hi), and merges by Y while maintaining a lightweight 1D Fenwick Tree on Z—eliminating one dimension via D&C in O(N) space!",
    content: `
      <div class="lesson-content">
        <h2>What Is CDQ Divide-and-Conquer?</h2>
        <p>Popularized by IOI gold medalist <strong>Chen Danqi (CDQ)</strong> in 2008 (and rooted in Bentley's 1980 multidimensional divide-and-conquer), <strong>CDQ Divide-and-Conquer</strong> is an offline technique that eliminates one dimension of a multidimensional query problem (or eliminates the "time" dimension of a dynamic update-and-query problem) by recursing on array halves $[lo, mid)$ and $[mid, hi)$ and computing <strong>only the cross-half contribution</strong> where left-half elements update right-half elements.</p>

        <h3>The Canonical Problem: 3D Partial Order (3D Dominance Counting)</h3>
        <p>Given $N$ points $P_i = (x_i, y_i, z_i)$ in $\\mathbb{R}^3$ (with coordinates compressed to $[1, N]$), for each point $j$ we want to count how many points $i \\neq j$ satisfy:</p>
        $$x_i \\le x_j \\quad \\land \\quad y_i \\le y_j \\quad \\land \\quad z_i \\le z_j$$
        <p>Let's see how each dimension is systematically neutralized:</p>
        <ol>
          <li><strong>Dimension 1 ($X$-Coordinate) — Initial Presort:</strong> Sort all points lexicographically by $(x, y, z)$ and collapse identical points $(x, y, z)$ into weighted unique points. Now, throughout the entire recursion on $[lo, hi)$, every point in the left half $i \\in [lo, mid)$ is guaranteed to satisfy $x_i \\le x_j$ for every point in the right half $j \\in [mid, hi)$!</li>
          <li><strong>Dimension 2 ($Y$-Coordinate) — Two-Pointer Merge:</strong> Assume recursively that $[lo, mid)$ and $[mid, hi)$ are sorted by $Y$. Sweep pointer $p_L$ across $[lo, mid)$ and pointer $p_R$ across $[mid, hi)$ in ascending $Y$-order. Whenever $P[p_L].y \\le P[p_R].y$, advance $p_L$; otherwise advance $p_R$. At the moment we process $p_R$, <strong>every left-half point already passed by $p_L$ satisfies both $x_i \\le x_j$ and $y_i \\le y_j$</strong>!</li>
          <li><strong>Dimension 3 ($Z$-Coordinate) — 1D Fenwick Tree (BIT):</strong> When advancing $p_L$, insert its $Z$-coordinate into a 1D Fenwick Tree: <code>bit.add(P[p_L].z, P[p_L].weight)</code>. When advancing $p_R$, query prefix sum <code>bit.query(P[p_R].z)</code> to count how many active left-half points also satisfy $z_i \\le z_j$! Finally, <strong>rollback</strong> the Fenwick tree by subtracting only the touched $P[p_L].z$ entries in $O(hi - lo)$ time.</li>
        </ol>

        <div class="simulator-mount" data-sim="sim-fft-butterfly-karatsuba"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Approach for 3D Dominance / Dynamic 2D Range Count</th>
              <th>Time Complexity</th>
              <th>Space Complexity</th>
              <th>Cache &amp; Constant Factor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2D Segment Tree / Fenwick Tree of Treaps (Online)</td>
              <td>$O(N \\log^2 N)$</td>
              <td>$O(N \\log^2 N)$</td>
              <td>Heavy pointer chasing (~400 MB for $N=2\\cdot 10^5$)</td>
            </tr>
            <tr>
              <td>K-D Tree Orthogonal Range Counting</td>
              <td>$O(N^{5/3})$ worst-case</td>
              <td>$O(N)$</td>
              <td>Suboptimal asymptotic bound</td>
            </tr>
            <tr>
              <td>CDQ Divide-and-Conquer + 1D Fenwick Tree (Offline)</td>
              <td>$\\Theta(N \\log^2 N)$</td>
              <td>$\\Theta(N)$</td>
              <td>Tiny L1-resident BIT + sequential array scans!</td>
            </tr>
          </tbody>
        </table>

        <div class="invariant-box">
          <div class="invariant-title">The CDQ Cross-Boundary Invariant &amp; Rollback Requirement</div>
          <p>At any node $[lo, hi)$ of the CDQ recursion tree, left-half elements $i \\in [lo, mid)$ <strong>only update</strong> the Fenwick Tree, and right-half elements $j \\in [mid, hi)$ <strong>only query</strong> the Fenwick Tree. Why is it illegal to call <code>std::fill(bit.begin(), bit.end(), 0)</code> to reset the Fenwick Tree at the end of $[lo, hi)$? Because <code>std::fill</code> takes $O(N)$ time at <em>every</em> recursive call, blowing total time up to $O(N^2)$! Instead, you must undo only the insertions performed during that merge by calling <code>bit.add(P[i].z, -P[i].weight)</code> for each $i \\in [lo, p_L)$, keeping work at node $[lo, hi)$ strictly $O((hi - lo) \\log N)$.</p>
        </div>

        <svg viewBox="0 0 680 230" width="100%" height="230" role="img" aria-label="CDQ Divide and Conquer eliminating X via split, Y via merge, and Z via 1D Fenwick Tree">
          <rect width="680" height="230" rx="8" fill="#0f172a"/>
          <text x="20" y="26" fill="#e2e8f0" font-size="14" font-weight="bold">CDQ Divide-and-Conquer: How 3 Dimensions Collapse into a 1D Fenwick Tree</text>

          <!-- Box 1: Left Half -->
          <g transform="translate(20, 48)">
            <rect x="0" y="0" width="205" height="120" rx="6" fill="#172554" stroke="#3b82f6" stroke-width="2"/>
            <text x="102" y="22" text-anchor="middle" fill="#93c5fd" font-size="12.5" font-weight="bold">Left Half [lo, mid)</text>
            <text x="102" y="42" text-anchor="middle" fill="#cbd5e1" font-size="11">All have x_i &le; x_j (Dim 1 Fixed)</text>
            <text x="102" y="65" text-anchor="middle" fill="#60a5fa" font-size="11.5" font-weight="bold">Sorted by Y (Dim 2)</text>
            <rect x="18" y="80" width="168" height="26" rx="4" fill="#1e3a8a"/>
            <text x="102" y="97" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="bold">Action: bit.add(z_i, +cnt_i)</text>
          </g>

          <!-- Box 2: 1D BIT Bridge -->
          <g transform="translate(245, 48)">
            <rect x="0" y="0" width="190" height="120" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
            <text x="95" y="22" text-anchor="middle" fill="#fde68a" font-size="12.5" font-weight="bold">1D Fenwick Tree on Z</text>
            <text x="95" y="45" text-anchor="middle" fill="#cbd5e1" font-size="11">Sweeps p_L and p_R in</text>
            <text x="95" y="62" text-anchor="middle" fill="#cbd5e1" font-size="11">non-decreasing Y order</text>
            <text x="95" y="92" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="bold">O(log N) per Update/Query</text>
            <text x="95" y="110" text-anchor="middle" fill="#f87171" font-size="10.5">Rollback: bit.add(z_i, -cnt_i)</text>
          </g>

          <!-- Box 3: Right Half -->
          <g transform="translate(455, 48)">
            <rect x="0" y="0" width="205" height="120" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
            <text x="102" y="22" text-anchor="middle" fill="#6ee7b7" font-size="12.5" font-weight="bold">Right Half [mid, hi)</text>
            <text x="102" y="42" text-anchor="middle" fill="#cbd5e1" font-size="11">All have x_j &ge; x_i (Dim 1 Fixed)</text>
            <text x="102" y="65" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="bold">Sorted by Y (Dim 2)</text>
            <rect x="18" y="80" width="168" height="26" rx="4" fill="#065f46"/>
            <text x="102" y="97" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="bold">Action: ans_j += bit.query(z_j)</text>
          </g>

          <rect x="20" y="182" width="640" height="34" rx="5" fill="#311042" stroke="#c084fc" stroke-width="1.5"/>
          <text x="340" y="203" text-anchor="middle" fill="#f3e8ff" font-size="12" font-weight="bold">Recurrence: T(N) = 2T(N/2) + O(N log N) = Θ(N log^2 N) Time, Θ(N) Auxiliary Space</text>
        </svg>

        <div class="mermaid">
flowchart TD
  A["Sort Points by (X, Y, Z) & Deduplicate Duplicates"] --> B["cdq(lo, hi): Split at mid = (lo + hi) / 2"]
  B --> C["Recurse cdq(lo, mid) and cdq(mid, hi)\nBoth Halves Return Sorted by Y"]
  C --> D["Two-Pointer Merge by Y:\nIf P[p_L].y <= P[p_R].y -> bit.add(P[p_L].z, +w)\nElse -> ans[P[p_R].id] += bit.query(P[p_R].z)"]
  D --> E["Rollback BIT for all inserted p_L in [lo, mid)\nCopy Y-Merged Scratch Back to P[lo..hi)"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Why Deduplicating Equal $(x, y, z)$ Triples Is Mandatory</div>
          <p>Suppose two distinct input items $A$ and $B$ have the <strong>exact same coordinates</strong> $(x, y, z)$. After sorting, one of them ($A$) appears before the other ($B$). In CDQ divide-and-conquer, an element on the left can contribute to an element on the right, <em>buuuuut</em> the element on the right ($B$) can <strong>never</strong> contribute back to the element on the left ($A$)! Consequently, $A$ would undercount its equal partner $B$. By collapsing identical $(x, y, z)$ points into a single representative with multiplicity <code>cnt</code> before starting CDQ (and adding <code>cnt - 1</code> to its own dominance count), strict ordering between distinct triples is restored.</p>
        </div>

        <h2>Production C++20 Implementation: 3D Dominance Counting via CDQ Divide-and-Conquer</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstddef&gt;
#include &lt;cstdint&gt;
#include &lt;vector&gt;

struct Point3D {
    int x, y, z;
    int weight;   // Multiplicity of identical (x, y, z) points
    int dom_cnt;  // Number of points dominated by this unique point
    int orig_id;
};

class FenwickTree {
public:
    explicit FenwickTree(std::size_t max_z) : tree_(max_z + 1, 0) {}

    void add(int idx, int delta) noexcept {
        for (std::size_t i = static_cast&lt;std::size_t&gt;(idx); i &lt; tree_.size(); i += i &amp; (~i + 1)) {
            tree_[i] += delta;
        }
    }

    int query(int idx) const noexcept {
        int sum = 0;
        for (std::size_t i = static_cast&lt;std::size_t&gt;(idx); i &gt; 0; i &amp;= i - 1) {
            sum += tree_[i];
        }
        return sum;
    }

private:
    std::vector&lt;int&gt; tree_;
};

// Solves 3D Partial Order (1 <= z_i <= max_z) in O(N log^2 N) time and O(N) space.
// Returns for each unique point the total weight of other points it dominates.
void solve_3d_dominance_cdq(std::vector&lt;Point3D&gt;&amp; pts, int max_z) {
    if (pts.empty()) return;

    // 1. Sort lexicographically by (x, y, z)
    std::sort(pts.begin(), pts.end(), [](const Point3D&amp; a, const Point3D&amp; b) {
        if (a.x != b.x) return a.x &lt; b.x;
        if (a.y != b.y) return a.y &lt; b.y;
        return a.z &lt; b.z;
    });

    // 2. Deduplicate identical (x, y, z) triples and accumulate multiplicity weight
    std::vector&lt;Point3D&gt; uniq;
    uniq.reserve(pts.size());
    for (const auto&amp; p : pts) {
        if (!uniq.empty() &amp;&amp; uniq.back().x == p.x &amp;&amp;
            uniq.back().y == p.y &amp;&amp; uniq.back().z == p.z) {
            uniq.back().weight += p.weight;
        } else {
            uniq.push_back(p);
        }
    }

    const std::size_t m = uniq.size();
    std::vector&lt;Point3D&gt; scratch(m);
    FenwickTree bit(static_cast&lt;std::size_t&gt;(max_z));

    auto cdq = [&amp;](auto&amp; self, std::size_t lo, std::size_t hi) -&gt; void {
        if (hi - lo &lt;= 1) return;
        const std::size_t mid = lo + (hi - lo) / 2;

        self(self, lo, mid);
        self(self, mid, hi);

        // Both [lo, mid) and [mid, hi) are now sorted by Y.
        // Merge them by Y while applying left-half BIT updates to right-half queries.
        std::size_t pL = lo, pR = mid, out = lo;
        while (pL &lt; mid &amp;&amp; pR &lt; hi) {
            if (uniq[pL].y &lt;= uniq[pR].y) {
                bit.add(uniq[pL].z, uniq[pL].weight);
                scratch[out++] = uniq[pL++];
            } else {
                uniq[pR].dom_cnt += bit.query(uniq[pR].z);
                scratch[out++] = uniq[pR++];
            }
        }
        while (pR &lt; hi) {
            uniq[pR].dom_cnt += bit.query(uniq[pR].z);
            scratch[out++] = uniq[pR++];
        }
        // Rollback Fenwick tree for all left-half elements that were inserted!
        for (std::size_t i = lo; i &lt; pL; ++i) {
            bit.add(uniq[i].z, -uniq[i].weight);
        }
        while (pL &lt; mid) {
            scratch[out++] = uniq[pL++];
        }

        std::copy(scratch.begin() + lo, scratch.begin() + hi, uniq.begin() + lo);
    };

    cdq(cdq, 0, m);

    // Account for self-dominance among identical (x, y, z) duplicates
    for (auto&amp; u : uniq) {
        u.dom_cnt += (u.weight - 1);
    }
    pts = std::move(uniq);
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Pre-Order vs. Post-Order CDQ for Dynamic Programming Transitions</div>
          <p>In pure counting problems (like 3D dominance or offline 2D range queries), left and right subproblems are independent, so standard <strong>post-order Merge-Sort CDQ</strong> (<code>cdq(lo, mid); cdq(mid, hi); merge();</code>) works fastest because the merge step sorts by $Y$ bottom-up. However, if you use CDQ to optimize <strong>1D/2D Dynamic Programming</strong> where $dp[j] = \\max_{i &lt; j}(\dots)$ requires $dp[i]$ for the entire left half $[lo, mid)$ to be <strong>fully finalized before</strong> propagating to $[mid, hi)$, you MUST execute CDQ in <strong>in-order</strong>: <code>cdq(lo, mid); cross_update(lo, mid, mid, hi); cdq(mid, hi);</code>!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "CDQ Divide-and-Conquer eliminates one coordinate (or time) dimension by sorting on X initially and computing only left-half-to-right-half interactions across the recursion tree.",
      "For 3D Dominance, X is handled by the divide split, Y is handled by a two-pointer merge, and Z is handled by a 1D Fenwick Tree.",
      "Total complexity is O(N log^2 N) time and O(N) space—avoiding the O(N log^2 N) memory explosion and pointer-chasing overhead of 2D Segment Trees.",
      "Always deduplicate identical (x, y, z) points upfront and rollback the Fenwick Tree by undoing only the [lo, p_L) insertions rather than zeroing the entire BIT array."
    ],
    furtherReading: [
      {
        title: "Bentley (1980) — Multidimensional Divide-and-Conquer (Communications of the ACM)",
        url: "https://doi.org/10.1145/358841.358850"
      },
      {
        title: "USACO Guide Platinum — Offline Divide & Conquer (CDQ)",
        url: "https://usaco.guide/plat/DC-SRQ"
      },
      {
        title: "Codeforces — A Tutorial on CDQ Divide and Conquer",
        url: "https://codeforces.com/blog/entry/47096"
      }
    ]
  },

  "case-git-bisect-eytzinger": {
    title: "Production Case Study: Cache-Friendly Eytzinger Binary Search Layout vs Standard Binary Search",
    video: {
      youtubeId: "1RIPMQQRBWk",
      title: "Fast-Forwarding Binary Search: Cache-Friendly Eytzinger Layout (Algorithmica / Morin)",
      channel: "CppCon",
      duration: "58:14",
      start: 420,
      length: 1920,
      why: "Explains why std::lower_bound is bottlenecked by cache misses and associative cache-set aliasing on power-of-2 arrays, and how Eytzinger layout with software prefetching achieves a 3x-4x speedup."
    },
    intuition: "Standard binary search (`std::lower_bound`) on a sorted array jumps across memory by N/2, N/4, N/8... incurring a fresh cache miss on almost every step until the final 3 steps, AND suffering associative cache-set thrashing when N is a power of two. Storing the array in 1-indexed Breadth-First Search (Eytzinger / Binary Heap) order packs the top 4 levels of the decision tree into a single 64-byte cache line and lets us prefetch 4 levels ahead via `__builtin_prefetch(&b[k * 16])`!",
    content: `
      <div class="lesson-content">
        <h2>Why <code>std::lower_bound</code> Is Slow on Modern Hardware</h2>
        <p>Given a static sorted table of $N = 2^{20}$ ($1{,}048{,}576$) 32-bit integers ($4\\text{ MB}$), how fast is <code>std::lower_bound</code>? Textbook complexity says $20$ comparisons. Hardware reality says <strong>~16 sequential DRAM/L3 memory stalls</strong> for three architectural reasons analyzed by Paul-Virak Khuong and Pat Morin (2017):</p>
        <ol>
          <li><strong>Zero Spatial Locality in the Top $\\log_2 N - 4$ Levels:</strong> A $64$-byte CPU cache line holds sixteen 32-bit integers. Standard sorted order packs <em>adjacent</em> ranks ($A[i], A[i+1], \\dots, A[i+15]$) into a cache line. That spatial locality is completely useless until the search interval $[lo, hi)$ shrinks to width $\\le 16$ in the final $4$ iterations! The first $16$ probes each fetch a 64-byte line only to read a single 4-byte integer and discard the remaining 60 bytes.</li>
          <li><strong>Data-Dependent Memory Addresses Block Hardware Prefetching:</strong> The CPU cannot know whether the next probe is $mid - step$ or $mid + step$ until the load of $A[mid]$ completes, preventing memory-level parallelism (MLP).</li>
          <li><strong>Power-of-Two Cache-Set Aliasing:</strong> When $N = 2^{20}$, the top probes occur at byte offsets $N/2, N/4, 3N/4, N/8, \\dots$, which are all large multiples of $2^{12} = 4096$ bytes. Because CPU L1/L2 caches index their cache sets using lower address bits (bits $6\\dots 11$), <strong>all top binary-search probes map to the exact same cache set</strong>, evicting each other even when the working set is tiny!</li>
        </ol>

        <h2>The Eytzinger (BFS / 1-Indexed Heap) Array Layout</h2>
        <p>Named after 16th-century genealogist Michaël Eytzinger (and identical to the 1-indexed array layout of a binary heap), the <strong>Eytzinger layout</strong> stores the implicit binary search tree in <strong>Breadth-First Search (BFS) level order</strong> starting at index $k = 1$:</p>
        <ul>
          <li>The root (overall median) is at $B[1]$.</li>
          <li>For any node at index $k$, its left child (quartile $< B[k]$) is at $B[2k]$ and its right child (quartile $\ge B[k]$) is at $B[2k + 1]$.</li>
        </ul>

        <div class="simulator-mount" data-sim="sim-fractional-cascading-eytzinger"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Search Layout ($N = 2^{20}$ <code>uint32_t</code>)</th>
              <th>Comparisons</th>
              <th>Cache Lines Touched</th>
              <th>Prefetch / MLP Capability</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sorted Array + Branched <code>std::lower_bound</code></td>
              <td>$20$</td>
              <td>$~17$ lines (+ set aliasing)</td>
              <td>None (1 load in flight at a time)</td>
            </tr>
            <tr>
              <td>Sorted Array + Branchless <code>cmov</code></td>
              <td>$20$</td>
              <td>$~17$ lines (+ set aliasing)</td>
              <td>Eliminates branch mispredicts only</td>
            </tr>
            <tr>
              <td>Eytzinger Layout + Branchless + 4-Level Prefetch</td>
              <td>$20$</td>
              <td>$5$ cache lines ($4$ levels/line!)</td>
              <td>4 concurrent cache lines in flight ($3.5\\times$ faster!)</td>
            </tr>
          </tbody>
        </table>

        <div class="invariant-box">
          <div class="invariant-title">Why Eytzinger Unlocks 4-Levels-Ahead Software Prefetching</div>
          <p>In the Eytzinger array $B[1..N]$, what are the 16 great-great-grandchildren of node $k$ (4 levels down the search tree)? Their indices are the contiguous range:</p>
          $$\\left[16k, \\; 16k + 15\\right]$$
          <p>Because sixteen 32-bit integers equal <strong>exactly $64$ bytes (one single cache line!)</strong>, if we align $B$ to a 64-byte boundary, <strong>all 16 possible targets 4 steps in the future reside in the exact same cache line</strong> starting at <code>&amp;B[16 * k]</code>! Thus, at step $k$, we can unconditionally issue <code>__builtin_prefetch(&amp;B[16 * k])</code> <em>without knowing which way the next 4 branches will go</em>, keeping 4 independent DRAM loads pipelined in flight simultaneously!</p>
        </div>

        <svg viewBox="0 0 680 245" width="100%" height="245" role="img" aria-label="Eytzinger BFS array layout packing tree levels into contiguous cache lines and prefetching 16k">
          <rect width="680" height="245" rx="8" fill="#0f172a"/>
          <text x="20" y="25" fill="#e2e8f0" font-size="14" font-weight="bold">Eytzinger (BFS) Layout: Sorted [0..14] vs. 1-Indexed Level-Order B[1..15]</text>

          <!-- Tree levels -->
          <g transform="translate(20, 42)">
            <!-- Root k=1 -->
            <rect x="285" y="0" width="70" height="28" rx="5" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
            <text x="320" y="18" text-anchor="middle" fill="#dbeafe" font-size="12" font-weight="bold">B[1] = 7</text>

            <!-- Level 2: k=2, 3 -->
            <line x1="305" y1="28" x2="175" y2="45" stroke="#64748b" stroke-width="1.5"/>
            <line x1="335" y1="28" x2="465" y2="45" stroke="#64748b" stroke-width="1.5"/>
            <rect x="140" y="45" width="70" height="28" rx="5" fill="#172554" stroke="#3b82f6" stroke-width="1.5"/>
            <text x="175" y="63" text-anchor="middle" fill="#93c5fd" font-size="12" font-weight="bold">B[2] = 3</text>
            <rect x="430" y="45" width="70" height="28" rx="5" fill="#172554" stroke="#3b82f6" stroke-width="1.5"/>
            <text x="465" y="63" text-anchor="middle" fill="#93c5fd" font-size="12" font-weight="bold">B[3] = 11</text>

            <!-- Level 3: k=4,5,6,7 -->
            <rect x="65" y="88" width="66" height="26" rx="4" fill="#064e3b" stroke="#10b981"/>
            <text x="98" y="105" text-anchor="middle" fill="#6ee7b7" font-size="11.5">B[4] = 1</text>
            <rect x="215" y="88" width="66" height="26" rx="4" fill="#064e3b" stroke="#10b981"/>
            <text x="248" y="105" text-anchor="middle" fill="#6ee7b7" font-size="11.5">B[5] = 5</text>
            <rect x="355" y="88" width="66" height="26" rx="4" fill="#064e3b" stroke="#10b981"/>
            <text x="388" y="105" text-anchor="middle" fill="#6ee7b7" font-size="11.5">B[6] = 9</text>
            <rect x="505" y="88" width="66" height="26" rx="4" fill="#064e3b" stroke="#10b981"/>
            <text x="538" y="105" text-anchor="middle" fill="#6ee7b7" font-size="11.5">B[7] = 13</text>
          </g>

          <!-- Contiguous 64-byte Cache Line Strip at Bottom -->
          <g transform="translate(20, 172)">
            <rect x="0" y="0" width="640" height="55" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
            <text x="320" y="20" text-anchor="middle" fill="#fde68a" font-size="12" font-weight="bold">Single 64-Byte Cache Line (16 × uint32_t): Holds B[0..15] (Top 4 Tree Levels Entirely in L1!)</text>
            <text x="320" y="42" text-anchor="middle" fill="#cbd5e1" font-size="12" font-family="monospace">idx: [0:-] [1:7] [2:3] [3:11] [4:1] [5:5] [6:9] [7:13] [8:0] [9:2] [10:4] [11:6] [12:8] [13:10] [14:12] [15:14]</text>
          </g>
        </svg>

        <div class="mermaid">
flowchart LR
  A["Start at Root k = 1"] --> B["Prefetch 4 Levels Ahead:\n__builtin_prefetch(&B[16 * k])"]
  B --> C["Branchless Child Step:\nk = 2 * k + (B[k] < x)\nRepeat while k <= N"]
  C --> D["Decode Answer Index:\nuint32_t shift = __builtin_ffs(~k)\nans_node = k >> shift"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Decoding the Final Eytzinger Node with <code>__builtin_ctz(~k)</code></div>
          <p>During the branchless search loop <code>while (k &lt;= N) k = 2 * k + (B[k] &lt; x);</code>, every time <code>B[k] &lt; x</code> is <strong>false</strong> (meaning $B[k] \\ge x$, so $B[k]$ is a valid <code>lower_bound</code> candidate!), we take the <strong>left branch</strong> ($2k$), appending a $0$-bit to the binary representation of $k$. Every time <code>B[k] &lt; x</code> is <strong>true</strong>, we take the <strong>right branch</strong> ($2k + 1$), appending a $1$-bit to $k$. Therefore, the last ancestor where we branched left ($B[\\text{ancestor}] \\ge x$) is obtained simply by stripping all trailing $1$-bits from $k$ and shifting right by one more bit: <code>k &gt;&gt; (__builtin_ctz(~k) + 1)</code>! One hardware <code>tzcnt</code> instruction recovers the exact <code>lower_bound</code> node without maintaining a separate <code>best</code> variable inside the loop.</p>
        </div>

        <h2>Production C++20 Implementation: 64-Byte Aligned Eytzinger Table with Prefetching</h2>
        <pre><code class="language-cpp">#include &lt;bit&gt;
#include &lt;concepts&gt;
#include &lt;cstddef&gt;
#include &lt;cstdint&gt;
#include &lt;span&gt;
#include &lt;vector&gt;

template &lt;std::totally_ordered T&gt;
class EytzingerTable {
public:
    explicit EytzingerTable(std::span&lt;const T&gt; sorted_input)
        : n_(sorted_input.size()), tree_(n_ + 1) {
        std::size_t src_idx = 0;
        build_inorder(1, sorted_input, src_idx);
    }

    // Returns the Eytzinger index k in [1..n_] of the first element >= x,
    // or 0 if all elements are < x.
    std::size_t lower_bound_eytzinger_index(const T&amp; x) const noexcept {
        std::size_t k = 1;
        constexpr std::size_t kPrefetchMultiplier = 16; // 4 levels ahead = 16 elements (64B for uint32_t)

        while (k &lt;= n_) {
            if (k * kPrefetchMultiplier &lt;= n_) {
                __builtin_prefetch(&amp;tree_[k * kPrefetchMultiplier], 0, 1);
            }
            // Branchless step: left child (2k) if tree_[k] >= x, right child (2k+1) if tree_[k] < x
            k = (k &lt;&lt; 1) + static_cast&lt;std::size_t&gt;(tree_[k] &lt; x);
        }

        // Strip trailing 1-bits (right branches) + the 0-bit of the last left branch
        const int trailing_ones = std::countr_one(k);
        return k &gt;&gt; (trailing_ones + 1);
    }

    const T&amp; node_value(std::size_t k) const noexcept { return tree_[k]; }

private:
    std::size_t n_;
    std::vector&lt;T&gt; tree_; // 1-indexed: tree_[1 .. n_]

    // Populates tree_ in BFS order via an in-order traversal of the implicit binary tree
    void build_inorder(std::size_t k, std::span&lt;const T&gt; sorted_in, std::size_t&amp; src_idx) noexcept {
        if (k &gt; n_) return;
        build_inorder(k &lt;&lt; 1, sorted_in, src_idx);
        tree_[k] = sorted_in[src_idx++];
        build_inorder((k &lt;&lt; 1) | 1, sorted_in, src_idx);
    }
};</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">When NOT to Use the Eytzinger Layout</div>
          <p>The Eytzinger layout sacrifices <strong>in-order sequential iteration</strong> and <strong>$O(1)$ rank arithmetic</strong> (computing how many elements lie between two pointers takes bit manipulation instead of pointer subtraction). Do not use Eytzinger if your workload frequently iterates over sorted ranges $[A, B]$; for range-scan-heavy workloads, use a <strong>B-Tree (or $B^+$-Tree with 16-key SIMD nodes)</strong> which preserves leaf-level sequential order while still packing 4 binary levels per cache line.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Standard sorted binary search wastes 60 of every 64 bytes in a cache line during the first log_2(N) - 4 probes and suffers associative cache-set aliasing when N is a power of 2.",
      "The Eytzinger layout stores the implicit binary search tree in 1-indexed BFS order (root at 1, children at 2k and 2k+1), packing the top 4 levels into a single 64-byte cache line.",
      "Because all 16 great-great-grandchildren of node k lie contiguously at indices [16k .. 16k+15], __builtin_prefetch(&tree_[16*k]) prefetches the exact cache line needed 4 steps later.",
      "After the branchless loop while (k <= N) k = 2*k + (tree_[k] < x), the lower_bound node is decoded in O(1) via k >> (std::countr_one(k) + 1)."
    ],
    furtherReading: [
      {
        title: "Khuong & Morin (2017) — Array Layouts for Comparison-Based Searching (ACM J. Exp. Algorithmics)",
        url: "https://arxiv.org/abs/1509.05053"
      },
      {
        title: "Algorithmica (Sergey Slotin) — Eytzinger Binary Search & SIMD Search Trees",
        url: "https://en.algorithmica.org/hpc/data-structures/binary-search/"
      },
      {
        title: "Git Documentation — Fighting Regressions with git bisect (Binary Search in Production)",
        url: "https://git-scm.com/docs/git-bisect-lk2009"
      }
    ]
  }
};
