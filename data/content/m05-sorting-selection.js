window.MODULE_CONTENT = window.MODULE_CONTENT || {};
window.MODULE_CONTENT["m05"] = {
  "quadratic-sorts-inversions": {
    title: "Insertion, Selection & Shellsort: Inversions & Diminishing Increments",
    video: {
      youtubeId: "ddeLSDsYVp8",
      id: "ddeLSDsYVp8",
      url: "https://www.youtube.com/embed/ddeLSDsYVp8",
      title: "Shell Sort: Diminishing Increment Insertion & h-Sorting Invariants",
      channel: "RobEdwards (SDSU)",
      duration: "11:30",
      start: 0,
      length: "11m",
      why: "Srini Devadas establishes the prefix-sorted loop invariant of Insertion Sort, contrasts comparison cost with element movement cost, and explains why small subarrays favor Insertion Sort on modern hardware."
    },
    intuition: "Every adjacent swap in Insertion Sort removes at most one inversion—an out-of-order pair $(i < j, A[i] > A[j])$—making any adjacent-exchange sort $\\Omega(N^2)$ on average. Shellsort shatters this barrier by $h$-sorting strided subsequences first, allowing a single long-range swap to annihilate up to $2h - 1$ inversions at once.",
    content: `
      <div class="lesson-content">
        <h2>The Combinatorics of Disorder: Inversions</h2>
        <p>Given an array $A[0 \\dots n-1]$, an <strong>inversion</strong> is any ordered pair of indices $(i, j)$ such that $i < j$ and $A[i] > A[j]$. The total inversion count $I(A)$ quantifies exactly how far $A$ is from sorted order:</p>
        <ul>
          <li>A sorted array has $I(A) = 0$ inversions.</li>
          <li>A strictly reverse-sorted array has every pair inverted: $I(A) = \\binom{n}{2} = \\frac{n(n-1)}{2}$ inversions.</li>
          <li><strong>Expected Inversions of a Random Permutation:</strong> By linearity of expectation over all $\\binom{n}{2}$ pairs, each pair $(i, j)$ has probability exactly $1/2$ of satisfying $A[i] > A[j]$ in a uniformly random permutation of distinct keys. Thus:
            $$\\mathbb{E}[I(A)] = \\frac{1}{2}\\binom{n}{2} = \\frac{n(n-1)}{4} = \\Theta(n^2)$$
          </li>
        </ul>

        <div class="invariant-box">
          <div class="invariant-title">Theorem (Adjacent-Swap Lower Bound &amp; Insertion Sort Exact Cost)</div>
          <p>Swapping two adjacent elements $A[k]$ and $A[k+1]$ changes the relative order of <em>only</em> the pair $(k, k+1)$ while leaving their relative order with all other elements $m \\notin \\{k, k+1\\}$ invariant. Consequently, a single adjacent swap decreases $I(A)$ by at most $1$. Any sorting algorithm that only exchanges adjacent elements (Insertion Sort, Bubble Sort, Cocktail Shaker Sort) must perform at least $I(A)$ swaps—requiring $\\ge \\frac{n(n-1)}{4} = \\Omega(n^2)$ operations in expectation and $\\frac{n(n-1)}{2}$ in the worst case.</p>
          <p>Furthermore, in <strong>Insertion Sort</strong>, inserting $A[i]$ into the sorted prefix $A[0 \\dots i-1]$ shifts rightwards every element $A[j]$ ($j < i$) satisfying $A[j] > A[i]$. Thus the number of element shifts equals $I(A)$ <em>exactly</em>, and total comparisons equal $I(A) + O(n)$.</p>
        </div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Best Time</th>
              <th>Average Time</th>
              <th>Worst Time</th>
              <th>Aux Space</th>
              <th>Stable?</th>
              <th>Adaptive to $I(A)$?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Selection Sort</strong></td>
              <td>$\\Theta(n^2)$</td>
              <td>$\\Theta(n^2)$</td>
              <td>$\\Theta(n^2)$</td>
              <td>$O(1)$</td>
              <td>No (array swap)</td>
              <td>No (always $\\binom{n}{2}$ cmps, $\\le n$ swaps)</td>
            </tr>
            <tr>
              <td><strong>Insertion Sort (Guarded)</strong></td>
              <td>$\\Theta(n)$</td>
              <td>$\\Theta(n^2)$</td>
              <td>$\\Theta(n^2)$</td>
              <td>$O(1)$</td>
              <td>Yes ($A[j] > v$)</td>
              <td><strong>Yes:</strong> $\\Theta(n + I(A))$</td>
            </tr>
            <tr>
              <td><strong>Shellsort (Knuth $3^k - 1$)</strong></td>
              <td>$\\Theta(n \\log n)$</td>
              <td>$O(n^{1.25})$ empirical</td>
              <td>$\\Theta(n^{3/2})$</td>
              <td>$O(1)$</td>
              <td>No (strided jumps)</td>
              <td>Yes (fast on nearly sorted)</td>
            </tr>
            <tr>
              <td><strong>Shellsort (Pratt $2^p 3^q$ / Ciura)</strong></td>
              <td>$\\Theta(n \\log n)$</td>
              <td>$O(n (\\log n)^2)$</td>
              <td>$\\Theta(n (\\log n)^2)$ (Pratt)</td>
              <td>$O(1)$</td>
              <td>No</td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>

        <h2>Shellsort: Breaking the $\\Omega(n^2)$ Barrier via $h$-Sorting</h2>
        <p>Donald Shell (1959) observed that moving an element across $h$ positions in a single swap can eliminate up to $2h - 1$ inversions simultaneously. An array is called <strong>$h$-sorted</strong> if every strided subsequence $A[i], A[i+h], A[i+2h], \\dots$ is independently sorted via Insertion Sort with stride $h$. Shellsort executes $h$-Insertion Sort for a diminishing increment sequence $h_t > h_{t-1} > \\dots > h_1 = 1$.</p>
        <ul>
          <li><strong>The $h$-Sort Preservation Theorem:</strong> If an array is already $g$-sorted and we subsequently $h$-sort it, the array <em>remains</em> $g$-sorted! This nontrivial combinatorial lemma (proven via Gale-Ryser / Frobenius coin problem duality by Pratt and Knuth) guarantees that work done at coarse strides is never undone by finer strides.</li>
          <li><strong>Why Powers of 2 Fail ($h = 2^k$):</strong> Shell's original sequence $N/2, N/4, \\dots, 2, 1$ never compares elements at odd indices with elements at even indices until the very final $h = 1$ pass. Interleaving the largest $n/2$ elements at odd indices and the smallest $n/2$ elements at even indices forces the $h = 1$ pass to do $\\Omega(n^2)$ work.</li>
          <li><strong>Coprime Diminishing Increments:</strong>
            <ul>
              <li><strong>Hibbard ($2^k - 1$):</strong> Adjacent increments are coprime; worst-case $\\Theta(n^{3/2})$ (Papernov &amp; Stasevich, 1965).</li>
              <li><strong>Knuth ($\\frac{3^k - 1}{2} = 1, 4, 13, 40, 121, \\dots$):</strong> Easy recurrence $h = 3h + 1$, worst-case $\\Theta(n^{3/2})$.</li>
              <li><strong>Sedgewick ($4^k + 3 \\cdot 2^{k-1} + 1$) / Tokuda / Ciura ($1, 4, 10, 23, 57, 132, 301, 701, 1750$):</strong> Achieves $O(n^{4/3})$ worst-case and matches $O(n \\log n)$ algorithms in wall-clock time up to $n \\approx 10^4$.</li>
            </ul>
          </li>
        </ul>

        <svg viewBox="0 0 760 220" class="lesson-svg" role="img" aria-label="Shellsort h=4 interleaved strided subsequences vs h=1 final pass">
          <rect width="760" height="220" rx="10" fill="#0f172a"/>
          <text x="20" y="28" fill="#f8fafc" font-size="13" font-weight="bold">Shellsort Strided Subsequences (h = 4): Each Color Chain Is Insertion-Sorted Independently</text>
          <g transform="translate(20, 48)">
            <rect x="0" y="0" width="70" height="44" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="35" y="27" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold">A[0]=89</text>
            <rect x="90" y="0" width="70" height="44" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
            <text x="125" y="27" text-anchor="middle" fill="#f59e0b" font-size="14" font-weight="bold">A[1]=42</text>
            <rect x="180" y="0" width="70" height="44" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
            <text x="215" y="27" text-anchor="middle" fill="#10b981" font-size="14" font-weight="bold">A[2]=71</text>
            <rect x="270" y="0" width="70" height="44" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
            <text x="305" y="27" text-anchor="middle" fill="#a855f7" font-size="14" font-weight="bold">A[3]=15</text>
            <rect x="360" y="0" width="70" height="44" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="395" y="27" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold">A[4]=23</text>
            <rect x="450" y="0" width="70" height="44" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
            <text x="485" y="27" text-anchor="middle" fill="#f59e0b" font-size="14" font-weight="bold">A[5]=19</text>
            <rect x="540" y="0" width="70" height="44" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
            <text x="575" y="27" text-anchor="middle" fill="#10b981" font-size="14" font-weight="bold">A[6]=11</text>
            <rect x="630" y="0" width="70" height="44" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
            <text x="665" y="27" text-anchor="middle" fill="#a855f7" font-size="14" font-weight="bold">A[7]=08</text>
            <path d="M 35 46 Q 215 95 395 46" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3"/>
            <path d="M 125 46 Q 305 105 485 46" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 3"/>
            <path d="M 215 46 Q 395 115 575 46" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4 3"/>
            <path d="M 305 46 Q 485 125 665 46" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="4 3"/>
          </g>
          <text x="20" y="160" fill="#94a3b8" font-size="12">1. Swapping A[0]=89 with A[4]=23 jumps 4 slots, removing up to 2h - 1 = 7 inversions in a single exchange.</text>
          <text x="20" y="182" fill="#34d399" font-size="12">2. By the time h = 1 runs, every element is within 1–2 positions of its final destination: Insertion Sort finishes in O(N) time!</text>
        </svg>

        <div class="mermaid">
flowchart LR
  A["Unsorted Array\nI(A) ≈ N²/4"] --> B["h = 701, 301, 132, 57, 23, 10, 4\nCoarse Strided Insertion Passes"]
  B --> C["Nearly Sorted Array\nMax displacement ≤ O(1)"]
  C --> D["Final h = 1 Pass\nLinear O(N) Insertion Sort"]
        </div>

        <div class="simulator-mount" data-sim="sim-sorting-race"></div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Why Insertion Sort Beats $O(N \\log N)$ for $N \\le 32$</div>
          <p>Every production standard library sort—<code>std::sort</code> (libstdc++/libc++), Rust's <code>pdqsort</code>, and Python/V8's <code>TimSort</code>—switches to <strong>Insertion Sort</strong> (specifically <em>unguarded insertion sort</em> once the minimum element sits in $A[0]$ as a sentinel) when subarray size drops below $16\\text{–}32$ elements:</p>
          <ul>
            <li><strong>Single Cache Line Residency:</strong> $16$ 32-bit integers ($64\\text{ B}$) or $16$ 64-bit integers ($128\\text{ B}$) fit entirely within 1–2 L1d cache lines ($4$-cycle latency) or even CPU registers.</li>
            <li><strong>Predictable Loop Branches &amp; Zero Recursion Overhead:</strong> Function call frames, pivot selection, and 3-way partition branches incur 15-cycle branch misprediction penalties, whereas a tight linear scan with <strong>unguarded</strong> inner condition (<code>while (v &lt; *--j)</code> without checking <code>j &gt;= first</code>) executes at 1–2 cycles per element.</li>
          </ul>
        </div>

        <h2>Production C++20 Implementation: Unguarded Insertion Sort &amp; Ciura Shellsort</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;array&gt;
#include &lt;concepts&gt;
#include &lt;cstddef&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

// Guarded + Unguarded Insertion Sort (used as base-case leaf in Introsort / pdqsort)
template &lt;std::totally_ordered T&gt;
void insertion_sort_unguarded(T* first, T* last) noexcept {
    if (last - first &lt;= 1) return;

    // 1. Move the minimum of the first step, or guard only when touching A[0]
    for (T* i = first + 1; i != last; ++i) {
        T val = std::move(*i);
        // Fast path: if val &lt; *first, it belongs at the very front (shift whole prefix)
        if (val &lt; *first) {
            std::move_backward(first, i, i + 1);
            *first = std::move(val);
        } else {
            // Unguarded inner loop: *first &lt;= val acts as a natural sentinel!
            // Eliminates the <code>j &gt; first</code> bounds check branch on every iteration.
            T* j = i;
            while (val &lt; *(j - 1)) {
                *j = std::move(*(j - 1));
                --j;
            }
            *j = std::move(val);
        }
    }
}

// Shellsort using Marcin Ciura's empirically optimal increment sequence (extended by *2.25)
template &lt;std::totally_ordered T&gt;
void shellsort_ciura(std::vector&lt;T&gt;&amp; a) noexcept {
    const std::size_t n = a.size();
    if (n &lt;= 1) return;

    // Ciura's sequence + geometric 2.25x extension for large N
    std::vector&lt;std::size_t&gt; gaps = {1, 4, 10, 23, 57, 132, 301, 701, 1750};
    while (gaps.back() &lt; n / 2) {
        gaps.push_back(static_cast&lt;std::size_t&gt;(gaps.back() * 2.25));
    }

    for (auto it = gaps.rbegin(); it != gaps.rend(); ++it) {
        const std::size_t h = *it;
        for (std::size_t i = h; i &lt; n; ++i) {
            T temp = std::move(a[i]);
            std::size_t j = i;
            while (j &gt;= h &amp;&amp; temp &lt; a[j - h]) {
                a[j] = std::move(a[j - h]);
                j -= h;
            }
            a[j] = std::move(temp);
        }
    }
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Strict Weak Ordering &amp; Stability in Insertion Sort</div>
          <p>Never write the inner comparison of Insertion Sort as <code>while (val &lt;= a[j - 1])</code>. Using <code>&lt;=</code> instead of strict <code>&lt;</code> causes equal keys to leapfrog past one another, <strong>destroying sorting stability</strong> and performing unnecessary shifts on duplicate keys. Furthermore, if someone passes a comparator that returns <code>true</code> on equal elements in an unguarded loop, the sentinel at <code>*first</code> will fail to stop the pointer <code>j</code>, causing an out-of-bounds memory corruption before <code>first</code>!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "An inversion is an out-of-order pair (i < j, A[i] > A[j]); a random permutation has n(n-1)/4 inversions on average, and any adjacent-swap sort requires at least I(A) swaps.",
      "Insertion Sort runs in exact Θ(n + I(A)) time—making it O(n) on k-nearly-sorted arrays where each element is within k slots of its sorted destination.",
      "Unguarded Insertion Sort uses A[0] as a sentinel whenever val >= A[0], eliminating the bounds-check branch (j > 0) from the hot inner loop.",
      "Shellsort h-sorts strided subsequences using coprime increments (Knuth 3^k-1, Sedgewick, or Ciura) so single swaps remove up to 2h-1 inversions; an h-sort preserves prior g-sorted order."
    ],
    furtherReading: [
      {
        title: "Knuth — The Art of Computer Programming, Vol. 3: Sorting and Searching (§5.2.1 Sorting by Insertion & Shell's Method)",
        url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html"
      },
      {
        title: "Sedgewick & Wayne — Algorithms (4th Ed.), §2.1 Elementary Sorts",
        url: "https://algs4.cs.princeton.edu/21elementary/"
      },
      {
        title: "CLRS — Introduction to Algorithms (4th Ed.), Chapter 2: Getting Started (Insertion Sort & Inversions)",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      }
    ]
  },

  "mergesort-bottom-up-inversions": {
    title: "Top-Down vs Bottom-Up Merge Sort & Counting Inversions in O(N log N)",
    video: {
      youtubeId: "AseUmwVNaoY",
      id: "AseUmwVNaoY",
      url: "https://www.youtube.com/embed/AseUmwVNaoY",
      title: "Merge Sort & Counting Inversions in O(N log N) Divide-and-Conquer",
      channel: "take U forward",
      duration: "23:50",
      start: 0,
      length: "23m",
      why: "Demonstrates the two-finger linear merge invariant, derives the T(n) = 2T(n/2) + Θ(n) recursion tree, and explains memory allocation trade-offs."
    },
    intuition: "When merging a sorted left half $L$ and a sorted right half $R$, whenever the next smallest element comes from $R[j]$ instead of $L[i]$, $R[j]$ is simultaneously smaller than <em>every remaining element</em> in $L[i \\dots |L|-1]$. That single pointer advance counts $|L| - i$ split inversions in $O(1)$ time, collapsing $\\Theta(N^2)$ pair inspection into $\\Theta(N \\log N)$.",
    content: `
      <div class="lesson-content">
        <h2>The Two-Finger Merge &amp; Recursion Tree Analysis</h2>
        <p>John von Neumann (1945) designed <strong>Merge Sort</strong> around a simple linear-time primitive: merging two already-sorted halves $A[lo \\dots mid]$ and $A[mid+1 \\dots hi]$ into a single sorted range of length $n = hi - lo + 1$. Each step compares the front elements of both halves and advances the pointer of the smaller element, taking at most $n - 1$ comparisons and exactly $n$ element moves.</p>
        <p>The recurrence $T(n) = 2T(n/2) + \\Theta(n)$ expands into a binary recursion tree of depth $\\lceil \\log_2 n \\rceil$. At level $d \\in [0, \\log_2 n]$, there are $2^d$ subproblems each of size $n / 2^d$, so the total merge work at every level is $2^d \\cdot c(n/2^d) = cn$. Summing across all $\\log_2 n$ levels yields worst-case, average-case, and best-case $\\Theta(n \\log n)$ time, with at most $n \\lceil \\log_2 n \\rceil - 2^{\\lceil \\log_2 n \\rceil} + 1$ key comparisons.</p>

        <div class="invariant-box">
          <div class="invariant-title">Split-Inversion Counting Invariant</div>
          <p>Every inversion $(p, q)$ with $p < q$ and $A[p] > A[q]$ falls into exactly one of three mutually exclusive cases relative to $mid = \\lfloor(lo + hi)/2\\rfloor$:</p>
          <ol>
            <li><strong>Left Inversion ($p < q \\le mid$):</strong> Counted recursively when sorting $A[lo \\dots mid]$.</li>
            <li><strong>Right Inversion ($mid < p < q$):</strong> Counted recursively when sorting $A[mid+1 \\dots hi]$.</li>
            <li><strong>Split Inversion ($p \\le mid < q$):</strong> Because $L = A[lo \\dots mid]$ and $R = A[mid+1 \\dots hi]$ are both sorted prior to merging, if $L[i] \\le R[j]$, then $L[i]$ is $\\le$ all remaining elements in $R$ (contributing $0$ split inversions). Conversely, if $R[j] < L[i]$, then by monotonicity of $L$:
              $$R[j] < L[i] \\le L[i+1] \\le \\dots \\le L[mid]$$
              Hence $R[j]$ forms a split inversion with <strong>all $(mid - i + 1)$ remaining elements</strong> in $L$! Adding $(mid - i + 1)$ to the running accumulator whenever $R[j]$ is chosen counts all $\\binom{n}{2}$ possible inversions in $\\Theta(n \\log n)$ time.
            </li>
          </ol>
        </div>

        <svg viewBox="0 0 760 220" class="lesson-svg" role="img" aria-label="Split inversion counting during two-finger merge">
          <rect width="760" height="220" rx="10" fill="#0f172a"/>
          <text x="20" y="28" fill="#f8fafc" font-size="13" font-weight="bold">Split-Inversion Jump: R[j] = 14 is strictly less than L[i] = 25, so it is less than ALL remaining L[i..mid]</text>
          <g transform="translate(30, 55)">
            <text x="0" y="15" fill="#38bdf8" font-size="12" font-weight="bold">Sorted Left L[lo..mid]:</text>
            <rect x="0" y="25" width="60" height="42" rx="5" fill="#1e293b" stroke="#475569"/>
            <text x="30" y="51" text-anchor="middle" fill="#64748b" font-size="14">8</text>
            <rect x="70" y="25" width="60" height="42" rx="5" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
            <text x="100" y="51" text-anchor="middle" fill="#f8fafc" font-size="14" font-weight="bold">25 (i)</text>
            <rect x="140" y="25" width="60" height="42" rx="5" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
            <text x="170" y="51" text-anchor="middle" fill="#f8fafc" font-size="14" font-weight="bold">39</text>
            <rect x="210" y="25" width="60" height="42" rx="5" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
            <text x="240" y="51" text-anchor="middle" fill="#f8fafc" font-size="14" font-weight="bold">44</text>
            <text x="170" y="90" text-anchor="middle" fill="#38bdf8" font-size="12">mid - i + 1 = 3 elements &gt; 14</text>
          </g>
          <g transform="translate(410, 55)">
            <text x="0" y="15" fill="#f59e0b" font-size="12" font-weight="bold">Sorted Right R[mid+1..hi]:</text>
            <rect x="0" y="25" width="60" height="42" rx="5" fill="#1e293b" stroke="#475569"/>
            <text x="30" y="51" text-anchor="middle" fill="#64748b" font-size="14">10</text>
            <rect x="70" y="25" width="60" height="42" rx="5" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
            <text x="100" y="51" text-anchor="middle" fill="#fef3c7" font-size="14" font-weight="bold">14 (j)</text>
            <rect x="140" y="25" width="60" height="42" rx="5" fill="#1e293b" stroke="#64748b"/>
            <text x="170" y="51" text-anchor="middle" fill="#e2e8f0" font-size="14">31</text>
            <rect x="210" y="25" width="60" height="42" rx="5" fill="#1e293b" stroke="#64748b"/>
            <text x="240" y="51" text-anchor="middle" fill="#e2e8f0" font-size="14">52</text>
          </g>
          <path d="M 510 100 Q 340 165 200 100" fill="none" stroke="#10b981" stroke-width="2.5"/>
          <text x="360" y="190" text-anchor="middle" fill="#34d399" font-size="13" font-weight="bold">R[j]=14 &lt; L[i]=25 ⇒ inversions += (mid - i + 1) = +3 for pairs (25,14), (39,14), (44,14)</text>
        </svg>

        <h2>Top-Down vs. Bottom-Up &amp; Ping-Pong Buffer Optimization</h2>
        <p>Naive Merge Sort implementations allocate a fresh <code>std::vector&lt;T&gt; temp</code> inside every call to <code>merge()</code>, turning a fast memory-bound sort into a <code>malloc</code>/<code>free</code> allocator bottleneck. Production implementations combine three structural optimizations:</p>
        <ol>
          <li><strong>Single Pre-Allocated Scratch Buffer:</strong> Allocate one auxiliary buffer <code>aux</code> of size $n$ (or $n/2$) at the top level and pass pointers down.</li>
          <li><strong>Ping-Pong Role Reversal (Zero Copy-Back):</strong> Instead of copying merged elements into <code>aux</code> and immediately copying them back into <code>a</code> on every level (which doubles memory bandwidth to $2n \\log_2 n$ writes), alternate the source and destination roles between <code>a</code> and <code>aux</code> at each recursion depth, cutting total element moves in half to $n \\log_2 n$.</li>
          <li><strong>Already-Sorted Skip Check:</strong> Before merging $A[lo \\dots mid]$ and $A[mid+1 \\dots hi]$, check if $A[mid] \\le A[mid+1]$. If true, the two halves are already globally ordered and the merge step can be skipped in $O(1)$ time—making Merge Sort run in $O(n)$ time on sorted inputs!</li>
          <li><strong>Bottom-Up Iterative Merge Sort:</strong> Eliminates recursion stack frames entirely by sweeping width $w = 1, 2, 4, 8, \\dots$ across the array. It is the canonical choice for sorting linked lists in $O(1)$ auxiliary space.</li>
        </ol>

        <div class="simulator-mount" data-sim="sim-sorting-race"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Merge Sort Variant</th>
              <th>Time (Worst / Avg)</th>
              <th>Best Time (Sorted)</th>
              <th>Element Writes</th>
              <th>Auxiliary Space</th>
              <th>Stable?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Naive Top-Down (alloc per merge)</strong></td>
              <td>$\\Theta(n \\log n)$</td>
              <td>$\\Theta(n \\log n)$</td>
              <td>$2n \\log_2 n$</td>
              <td>$\\Theta(n)$ + $O(n)$ alloc calls</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td><strong>Top-Down + Pre-alloc + Skip Check</strong></td>
              <td>$\\Theta(n \\log n)$</td>
              <td>$\\Theta(n)$</td>
              <td>$2n \\log_2 n$</td>
              <td>$n$ (1 allocation)</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td><strong>Ping-Pong Bottom-Up Merge Sort</strong></td>
              <td>$\\Theta(n \\log n)$</td>
              <td>$\\Theta(n \\log n)$</td>
              <td>$n \\log_2 n$ (no copy-back)</td>
              <td>$n$ (0 stack frames)</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td><strong>Bottom-Up Linked-List Merge Sort</strong></td>
              <td>$\\Theta(n \\log n)$</td>
              <td>$\\Theta(n \\log n)$</td>
              <td>$O(n \\log n)$ pointer relinks</td>
              <td>$O(1)$ (iterative widths)</td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>

        <div class="mermaid">
flowchart TD
  A["Pass w = 1: Merge pairs of size 1 → sorted runs of 2\n(Read from A, Write to AUX)"] --> B["Pass w = 2: Merge pairs of size 2 → sorted runs of 4\n(Read from AUX, Write to A)"]
  B --> C["Pass w = 4: Merge pairs of size 4 → sorted runs of 8\n(Read from A, Write to AUX)"]
  C --> D["Final Pass: If log2(N) is odd, single std::move from AUX to A"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Sequential Stream Prefetching vs. Write-Allocate Cache Pollution</div>
          <p>Why does Merge Sort have excellent cache locality despite using $O(n)$ auxiliary memory? During a merge, the CPU reads two strictly sequential forward streams (<code>L[i++]</code> and <code>R[j++]</code>) and writes one strictly sequential output stream (<code>dst[k++]</code>). The L1/L2 hardware stream prefetcher locks onto all three linear strides within 2 cache misses and pre-loads cache lines from DRAM well ahead of the execution core. However, writing to a cold auxiliary buffer triggers <strong>RFO (Read-For-Ownership / Write-Allocate)</strong> traffic: the CPU must first fetch the old cache line of <code>dst</code> from RAM before overwriting it, consuming $3n$ memory bus bandwidth per pass ($2$ reads + $1$ RFO read + $1$ writeback).</p>
        </div>

        <h2>Production C++20 Implementation: Ping-Pong Bottom-Up Merge Sort &amp; Inversion Counter</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;concepts&gt;
#include &lt;cstddef&gt;
#include &lt;cstdint&gt;
#include &lt;vector&gt;

// 1. Exact Inversion Counter in O(N log N) time using a single pre-allocated buffer
template &lt;std::totally_ordered T&gt;
std::uint64_t count_inversions_rec(T* a, T* aux, std::size_t lo, std::size_t hi) noexcept {
    if (hi - lo &lt;= 1) return 0; // Half-open interval [lo, hi)
    const std::size_t mid = lo + (hi - lo) / 2;

    std::uint64_t inv = 0;
    inv += count_inversions_rec(a, aux, lo, mid);
    inv += count_inversions_rec(a, aux, mid, hi);

    // Optimization: if already ordered across boundary, 0 split inversions!
    if (!(a[mid] &lt; a[mid - 1])) return inv;

    std::size_t i = lo, j = mid, k = lo;
    while (i &lt; mid &amp;&amp; j &lt; hi) {
        if (!(a[j] &lt; a[i])) { // a[i] &lt;= a[j]: preserves stability!
            aux[k++] = std::move(a[i++]);
        } else {
            aux[k++] = std::move(a[j++]);
            inv += (mid - i); // All remaining elements in [i, mid) are &gt; a[j]
        }
    }
    while (i &lt; mid) aux[k++] = std::move(a[i++]);
    while (j &lt; hi)  aux[k++] = std::move(a[j++]);
    std::move(aux + lo, aux + hi, a + lo);
    return inv;
}

template &lt;std::totally_ordered T&gt;
std::uint64_t count_inversions(std::vector&lt;T&gt; a) {
    if (a.size() &lt;= 1) return 0;
    std::vector&lt;T&gt; aux(a.size());
    return count_inversions_rec(a.data(), aux.data(), 0, a.size());
}

// 2. Ping-Pong Bottom-Up Merge Sort (Zero Copy-Back Overhead)
template &lt;std::totally_ordered T&gt;
void mergesort_bottom_up_pingpong(std::vector&lt;T&gt;&amp; a) {
    const std::size_t n = a.size();
    if (n &lt;= 1) return;

    std::vector&lt;T&gt; aux(n);
    T* src = a.data();
    T* dst = aux.data();

    for (std::size_t width = 1; width &lt; n; width &lt;&lt;= 1) {
        for (std::size_t lo = 0; lo &lt; n; lo += (width &lt;&lt; 1)) {
            const std::size_t mid = std::min(lo + width, n);
            const std::size_t hi  = std::min(lo + (width &lt;&lt; 1), n);
            std::size_t i = lo, j = mid, k = lo;
            while (i &lt; mid &amp;&amp; j &lt; hi) {
                if (!(src[j] &lt; src[i])) dst[k++] = std::move(src[i++]);
                else                    dst[k++] = std::move(src[j++]);
            }
            while (i &lt; mid) dst[k++] = std::move(src[i++]);
            while (j &lt; hi)  dst[k++] = std::move(src[j++]);
        }
        std::swap(src, dst); // Ping-pong buffers for next width pass!
    }
    if (src != a.data()) {
        std::move(src, src + n, a.data());
    }
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">64-Bit Integer Overflow in Inversion Counting &amp; Equal-Key Ties</div>
          <p>For $n = 100{,}000$, the maximum number of inversions is $\\binom{10^5}{2} \\approx 5 \\times 10^9$, which overflows a signed or unsigned 32-bit integer ($2^{31}-1 \\approx 2.14 \\times 10^9$). Always accumulate inversion counts in <code>uint64_t</code> or <code>int64_t</code>. Furthermore, when $L[i] == R[j]$, you <strong>must</strong> advance $L[i]$ first (<code>!(R[j] &lt; L[i])</code>): advancing $R[j]$ on equality falsely counts equal pairs as strict inversions!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Merge Sort guarantees worst-case Θ(N log N) comparisons and preserves stability by taking from the left subarray whenever L[i] == R[j].",
      "During a merge of sorted halves L and R, choosing R[j] < L[i] reveals (mid - i) split inversions simultaneously, enabling exact inversion counting in Θ(N log N) time.",
      "Pre-allocating a single scratch buffer and alternating source/destination pointers (ping-pong merging) eliminates the 2x copy-back memory traffic per pass.",
      "Checking A[mid] <= A[mid + 1] before merging makes Top-Down Merge Sort run in O(N) time on already-sorted inputs."
    ],
    furtherReading: [
      {
        title: "CLRS — Introduction to Algorithms (4th Ed.), §2.3 Designing Algorithms & Problem 2-4 (Inversions)",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      },
      {
        title: "Sedgewick & Wayne — Algorithms (4th Ed.), §2.2 Mergesort (Top-Down, Bottom-Up, and Optimizations)",
        url: "https://algs4.cs.princeton.edu/22mergesort/"
      },
      {
        title: "Kleinberg & Tardos — Algorithm Design, §5.3 Counting Inversions",
        url: "https://www.cs.princeton.edu/~wayne/kleinberg-tardos/"
      }
    ]
  },

  "quicksort-partition-schemes": {
    title: "Quicksort: Lomuto vs Hoare vs Bentley-McIlroy 3-Way Partitioning",
    video: {
      youtubeId: "nDPrcBv8iJU",
      id: "nDPrcBv8iJU",
      url: "https://www.youtube.com/embed/nDPrcBv8iJU",
      title: "3-Way Quicksort Partitioning (Dutch National Flag & Hoare Partition Schemes)",
      channel: "Interview Kickstart",
      duration: "16:40",
      start: 0,
      length: "16m",
      why: "Robert Sedgewick traces Hoare's two-pointer crossing scheme, demonstrates why duplicate keys trigger quadratic degradation without 3-way partitioning, and presents Dijkstra's Dutch National Flag and Bentley-McIlroy partitioning."
    },
    intuition: "Quicksort's speed—and its Achilles' heel—lives entirely inside its partitioning loop. Lomuto's single-direction scan performs $3\\times$ more swaps than Hoare's bidirectional pointers and degrades to $\\Theta(N^2)$ when all keys are equal; Hoare's crossing pointers stay balanced on duplicates by swapping equal keys; and Dijkstra / Bentley-McIlroy 3-way partitioning groups duplicates into a dead-center band that finishes in $O(N)$ linear time when key entropy is low.",
    content: `
      <div class="lesson-content">
        <h2>Anatomy of the Three Partition Schemes</h2>
        <p>Given a subarray $A[lo \\dots hi]$ and a chosen pivot value $v$, partitioning rearranges elements in-place so keys smaller than $v$ precede keys larger than $v$. Yet the choice of pointer invariant changes swap counts, branch predictability, and duplicate-key behavior dramatically:</p>

        <div class="invariant-box">
          <div class="invariant-title">Loop Invariants of Lomuto, Hoare, and Dijkstra 3-Way Partitioning</div>
          <ul>
            <li><strong>1. Lomuto Partition (1-Way Scan):</strong> Pivot at $v = A[hi]$. Maintains index $i$ such that $A[lo \\dots i-1] \\le v$, $A[i \\dots j-1] > v$, and $A[j \\dots hi-1]$ is unexamined.
              <br><em>Fatal Flaw:</em> On random permutations, Lomuto executes $\\frac{n}{2}$ swaps on average ($3\\times$ more than Hoare's $\\frac{n}{6}$). Worse, if all elements equal $v$, the test <code>A[j] &lt;= v</code> triggers a swap on every single element and leaves the pivot at index $hi$, recurring on $n - 1$ elements in <strong>$\\Theta(n^2)$ time</strong>!</li>
            <li><strong>2. Hoare Partition (2-Way Crossing Pointers, 1961):</strong> Pivot $v = A[lo]$. Left pointer $i$ scans right stopping on $A[i] \\ge v$; right pointer $j$ scans left stopping on $A[j] \\le v$. Notice both pointers <strong>stop on elements equal to $v$</strong>!
              <br><em>Why stopping on $== v$ is essential:</em> If all keys equal $v$, every step performs one redundant swap, but $i$ and $j$ meet at the exact midpoint $\\lfloor(lo+hi)/2\\rfloor$, splitting the array into two equal halves in $\\Theta(n \\log n)$ time! Note also that Hoare's scheme does <em>not</em> place the pivot at its final index; it returns a split index $j$ guaranteeing $\\max(A[lo \\dots j]) \\le \\min(A[j+1 \\dots hi])$, so recursive calls are <code>sort(lo, j)</code> and <code>sort(j + 1, hi)</code>.</li>
            <li><strong>3. Dijkstra 3-Way (Dutch National Flag) &amp; Bentley-McIlroy:</strong> Maintains three pointers $lt, i, gt$ partitioning $A[lo \\dots hi]$ into four regions:
              $$\\underbrace{A[lo \\dots lt-1]}_{< v} \\;\\Big|\\; \\underbrace{A[lt \\dots i-1]}_{= v} \\;\\Big|\\; \\underbrace{A[i \\dots gt]}_{\\text{unexamined}} \\;\\Big|\\; \\underbrace{A[gt+1 \\dots hi]}_{> v}$$
              When $i > gt$, all duplicates $A[lt \\dots gt] = v$ are permanently in their final sorted positions and excluded from both recursive calls!</li>
          </ul>
        </div>

        <div class="simulator-mount" data-sim="sim-sorting-race"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Partition Scheme</th>
              <th>Avg Swaps (Random)</th>
              <th>All-Equal Keys Time</th>
              <th>$k$ Distinct Keys Time</th>
              <th>Pivot Final Position?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Lomuto (CLRS)</strong></td>
              <td>$\\frac{1}{2}n$</td>
              <td>$\\Theta(n^2)$ (catastrophic)</td>
              <td>$\\Theta(n^2)$</td>
              <td>Yes ($A[p] = v$, recurse $[lo, p-1], [p+1, hi]$)</td>
            </tr>
            <tr>
              <td><strong>Hoare (Stop on $== v$)</strong></td>
              <td>$\\frac{1}{6}n$ ($3\\times$ fewer)</td>
              <td>$\\Theta(n \\log n)$ ($n/2$ swaps/pass)</td>
              <td>$\\Theta(n \\log n)$</td>
              <td>No (recurse $[lo, j]$ and $[j+1, hi]$)</td>
            </tr>
            <tr>
              <td><strong>Dijkstra 3-Way (DNF)</strong></td>
              <td>$\\approx \\frac{2}{3}n$</td>
              <td>$\\Theta(n)$ (0 swaps!)</td>
              <td>$\\Theta(n \\log k)$</td>
              <td>Yes (band $[lt \\dots gt] = v$ excluded)</td>
            </tr>
            <tr>
              <td><strong>Bentley-McIlroy Split-End 3-Way</strong></td>
              <td>$\\frac{1}{6}n$ (zero overhead on distinct)</td>
              <td>$\\Theta(n)$</td>
              <td>$O(n H + n)$ (entropy-optimal)</td>
              <td>Yes (swaps ends $= v$ to center at end)</td>
            </tr>
          </tbody>
        </table>

        <svg viewBox="0 0 760 215" class="lesson-svg" role="img" aria-label="Dijkstra 3-Way Partition vs Bentley-McIlroy Split-End Equal Keys">
          <rect width="760" height="215" rx="10" fill="#0f172a"/>
          <text x="20" y="26" fill="#f8fafc" font-size="13" font-weight="bold">1. Dijkstra 3-Way (Dutch National Flag) Invariant During Scan</text>
          <g transform="translate(20, 38)">
            <rect x="0" y="0" width="180" height="42" rx="4" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="90" y="25" text-anchor="middle" fill="#e0f2fe" font-size="13" font-weight="bold">&lt; v  [lo .. lt-1]</text>
            <rect x="184" y="0" width="170" height="42" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
            <text x="269" y="25" text-anchor="middle" fill="#d1fae5" font-size="13" font-weight="bold">== v  [lt .. i-1]</text>
            <rect x="358" y="0" width="160" height="42" rx="4" fill="#1e293b" stroke="#94a3b8" stroke-dasharray="4 3"/>
            <text x="438" y="25" text-anchor="middle" fill="#cbd5e1" font-size="13">?  [i .. gt]</text>
            <rect x="522" y="0" width="198" height="42" rx="4" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="621" y="25" text-anchor="middle" fill="#fef3c7" font-size="13" font-weight="bold">&gt; v  [gt+1 .. hi]</text>
          </g>
          <text x="20" y="114" fill="#f8fafc" font-size="13" font-weight="bold">2. Bentley-McIlroy Split-End 3-Way (C qsort, 1993): Parks == v at Ends, Swaps to Center Only at Crossing</text>
          <g transform="translate(20, 126)">
            <rect x="0" y="0" width="110" height="42" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
            <text x="55" y="25" text-anchor="middle" fill="#d1fae5" font-size="12" font-weight="bold">== v [lo..p-1]</text>
            <rect x="114" y="0" width="150" height="42" rx="4" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="189" y="25" text-anchor="middle" fill="#e0f2fe" font-size="12" font-weight="bold">&lt; v [p..i-1]</text>
            <rect x="268" y="0" width="184" height="42" rx="4" fill="#1e293b" stroke="#94a3b8" stroke-dasharray="4 3"/>
            <text x="360" y="25" text-anchor="middle" fill="#cbd5e1" font-size="12">unscanned [i..j]</text>
            <rect x="456" y="0" width="150" height="42" rx="4" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="531" y="25" text-anchor="middle" fill="#fef3c7" font-size="12" font-weight="bold">&gt; v [j+1..q]</text>
            <rect x="610" y="0" width="110" height="42" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
            <text x="665" y="25" text-anchor="middle" fill="#d1fae5" font-size="12" font-weight="bold">== v [q+1..hi]</text>
          </g>
          <text x="20" y="194" fill="#94a3b8" font-size="12">Why Bentley-McIlroy wins when keys are distinct: it does Hoare's exact 1/6 N swaps during the scan, paying 0 extra swaps unless equal keys exist!</text>
        </svg>

        <h2>Entropy-Optimal Sorting &amp; Pivot Selection</h2>
        <p>Suppose an array of $n$ elements has $k$ distinct values occurring with frequencies $f_1, f_2, \\dots, f_k$ and empirical probabilities $p_i = f_i / n$. The Shannon entropy of the multiset is $H = -\\sum_{i=1}^k p_i \\log_2 p_i \\le \\log_2 k$. Sedgewick and Bentley proved that 3-way Quicksort uses $O(n H + n)$ comparisons—matching the information-theoretic lower bound $\\log_2\\!\\left(\\frac{n!}{f_1! f_2! \\cdots f_k!}\\right) = n H - O(k \\log n)$ up to a constant factor!</p>
        <p>To prevent adversarial inputs (sorted, reverse-sorted, or "organ-pipe" arrays) from picking extreme pivots, production implementations use:</p>
        <ul>
          <li><strong>Median-of-Three ($n \\le 128$):</strong> Median of $(A[lo], A[mid], A[hi])$, which also places sentinels at the ends.</li>
          <li><strong>Tukey's Ninther ($n > 128$):</strong> Median of three medians of three ($9$ samples), costing only $12$ comparisons while concentrating the pivot tightly around the true median and defeating killer inputs like McIlroy's "AntiQsort" adversary when combined with pattern randomization.</li>
        </ul>

        <div class="mermaid">
flowchart TD
  A["Choose Pivot v via Median-of-3 or Tukey's Ninther"] --> B{"Many Equal Keys?\n(e.g., Pivot == Neighbor)"}
  B -- "Distinct Keys Common Case" --> C["Hoare / BlockQuicksort 2-Way Partition\n1/6 N swaps, branch-free offsets"]
  B -- "Low Cardinality / Equal Keys" --> D["3-Way Dutch National Flag Partition\nExclude [lt..gt] == v in O(N)"]
  C --> E["Tail-Call Elimination:\nRecurse on SMALLER side first, loop on LARGER side\nGuarantees ≤ O(log N) Stack Space!"]
  D --> E
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Branch Mispredictions &amp; BlockQuicksort (Edelkamp &amp; Weiß, 2016)</div>
          <p>On a random array, the comparison <code>A[i] &lt; pivot</code> inside Lomuto or Hoare partitioning has a $50\\%$ probability of being true—the exact worst-case entropy for a CPU branch predictor! Every mispredicted branch flushes the 14–20 stage out-of-order pipeline, costing ~15 cycles (often $5\\times$ slower than the comparison and L1 load combined). <strong>BlockQuicksort</strong> (used in Rust's <code>pdqsort</code> and modern C++ stdlibs) eliminates branches from partitioning by evaluating <code>A[i] &lt; pivot</code> across a block of 64 elements, storing the matching offsets into two small 64-byte index buffers using branchless pointer increments (<code>offsets[num++] = i</code> where <code>num += (A[i] &lt; pivot)</code>), and then performing a tight cyclic permutation of the mismatched pairs!</p>
        </div>

        <h2>Production C++20 Implementation: Hoare, 3-Way &amp; Tail-Call Bounded Quicksort</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;concepts&gt;
#include &lt;cstddef&gt;
#include &lt;utility&gt;

// Median-of-3 pivot selection that also sorts A[lo] &lt;= A[mid] &lt;= A[hi] as sentinels
template &lt;std::totally_ordered T&gt;
void sort_median_of_three(T* a, std::size_t lo, std::size_t mid, std::size_t hi) noexcept {
    if (a[mid] &lt; a[lo]) std::swap(a[lo], a[mid]);
    if (a[hi]  &lt; a[lo]) std::swap(a[lo], a[hi]);
    if (a[hi]  &lt; a[mid]) std::swap(a[mid], a[hi]);
}

// Hoare 2-Way Partition: stops on keys == pivot to prevent O(N^2) on equal elements
template &lt;std::totally_ordered T&gt;
std::size_t hoare_partition(T* a, std::size_t lo, std::size_t hi) noexcept {
    const std::size_t mid = lo + (hi - lo) / 2;
    sort_median_of_three(a, lo, mid, hi);
    T pivot = a[mid];
    std::size_t i = lo;
    std::size_t j = hi;
    while (true) {
        while (a[i] &lt; pivot) ++i;
        while (pivot &lt; a[j]) --j;
        if (i &gt;= j) return j;
        std::swap(a[i], a[j]);
        ++i;
        --j;
    }
}

// Dijkstra 3-Way Partition + Sedgewick Tail-Call Elimination (Guarantees O(log N) stack depth)
template &lt;std::totally_ordered T&gt;
void quicksort_3way(T* a, std::size_t lo, std::size_t hi) noexcept {
    while (lo &lt; hi) {
        const std::size_t mid = lo + (hi - lo) / 2;
        sort_median_of_three(a, lo, mid, hi);
        const T pivot = a[mid];

        // Invariant: a[lo..lt-1] &lt; pivot, a[lt..i-1] == pivot, a[gt+1..hi] &gt; pivot
        std::size_t lt = lo, i = lo, gt = hi;
        while (i &lt;= gt) {
            if (a[i] &lt; pivot) {
                std::swap(a[lt++], a[i++]);
            } else if (pivot &lt; a[i]) {
                std::swap(a[i], a[gt--]);
            } else {
                ++i;
            }
        }

        // Tail-Call Elimination: recurse ONLY on the smaller partition (&lt;= N/2),
        // and iterate the while-loop on the larger partition!
        const std::size_t left_len  = (lt &gt; lo) ? (lt - lo) : 0;
        const std::size_t right_len = (hi &gt; gt) ? (hi - gt) : 0;

        if (left_len &lt; right_len) {
            if (lt &gt; lo + 1) quicksort_3way(a, lo, lt - 1);
            lo = gt + 1;
        } else {
            if (hi &gt; gt + 1) quicksort_3way(a, gt + 1, hi);
            if (lt == 0) break; // Prevent unsigned underflow when lt == 0
            hi = lt - 1;
        }
    }
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Two Classic Quicksort Bugs: Stack Overflow &amp;Hoare Off-by-One Infinite Loops</div>
          <p><strong>1. Unbounded $O(N)$ Stack Overflow:</strong> Without recursing on the <em>smaller</em> partition first and tail-looping on the larger partition, an adversarial input producing $1 : (n-1)$ splits will push $n$ stack frames and crash the thread stack (~1–8 MB) at $n \\approx 10^5$. Reordering so the recursive call is always on the side of size $\\le n/2$ strictly bounds stack depth to $\\le \\log_2 n$ frames even in the $\\Theta(n^2)$ time worst case!<br>
          <strong>2. Hoare Partition Infinite Recursion:</strong> In Hoare partitioning with pivot $A[lo]$, if you pick $A[hi]$ as the pivot or recurse on <code>(lo, j - 1)</code> and <code>(j, hi)</code> when $j$ can return $lo$, one partition can have size $n$ and the other size $0$, causing infinite recursion. Always pair pivot choice at $A[lo]$ (or median-of-three placed at $A[lo]$) with split <code>(lo, j)</code> and <code>(j + 1, hi)</code>.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Lomuto partitioning performs 3x more swaps than Hoare on random inputs and degrades to Θ(N^2) when all elements are equal.",
      "Hoare partitioning stops both pointers on elements equal to the pivot, trading minor redundant swaps on duplicates for balanced O(N log N) splits.",
      "Dijkstra 3-way (Dutch National Flag) and Bentley-McIlroy partitioning isolate all keys equal to the pivot into a center band, achieving O(N) time on low-cardinality inputs and entropy-optimal O(N H + N) comparisons.",
      "Always recurse on the smaller partition first and loop on the larger partition (Sedgewick tail-call elimination) to guarantee O(log N) worst-case stack space."
    ],
    furtherReading: [
      {
        title: "Bentley & McIlroy (1993) — Engineering a Sort Function (Software: Practice and Experience)",
        url: "https://doi.org/10.1002/spe.4380231105"
      },
      {
        title: "Hoare (1961) — Algorithm 64: Quicksort (Communications of the ACM)",
        url: "https://doi.org/10.1145/366622.366644"
      },
      {
        title: "Sedgewick & Wayne — Algorithms (4th Ed.), §2.3 Quicksort & 3-Way Partitioning",
        url: "https://algs4.cs.princeton.edu/23quicksort/"
      }
    ]
  },

  "randomized-quicksort-expectation": {
    title: "Randomized Quicksort: Indicator Random Variables & 1.386 N ln N Proof",
    video: {
      youtubeId: "vK_q-C-kXhs",
      id: "vK_q-C-kXhs",
      url: "https://www.youtube.com/embed/vK_q-C-kXhs",
      title: "MIT 6.046J Lecture 4: Quicksort & Randomized Quicksort Expected O(N log N) Proof",
      channel: "MIT OpenCourseWare",
      duration: "1:18:05",
      start: 0,
      length: "78m",
      why: "Erik Demaine proves the exact 2n ln n expected comparison bound of Randomized Quicksort using indicator random variables over rank-ordered elements z_i and z_j."
    },
    intuition: "Instead of solving a messy recurrence over all $n$ possible partition sizes, track each pair of elements $z_i < z_j$ in sorted rank order. Two elements are compared at most once—only if one is chosen as a pivot—and they are compared if and only if the very first pivot chosen from the contiguous rank interval $\\{z_i, z_{i+1}, \\dots, z_j\\}$ is either $z_i$ or $z_j$, an event of exact probability $\\frac{2}{j - i + 1}$.",
    content: `
      <div class="lesson-content">
        <h2>Why Randomize Pivot Selection?</h2>
        <p>Any deterministic Quicksort that picks a fixed index ($A[lo]$, $A[hi]$, or even $A[mid]$) has inputs for which every partition is $0 : (n-1)$, requiring $\\sum_{k=1}^{n-1} k = \\frac{n(n-1)}{2} = \\Theta(n^2)$ comparisons. <strong>Randomized Quicksort</strong> defeats fixed-input adversaries by either shuffling the array upfront (Knuth-Fisher-Yates) or picking a pivot index uniformly at random from $\\{lo, \\dots, hi\\}$ at every recursive step. The expected runtime then holds over the algorithm's internal random coin flips for <em>every</em> input array of $n$ distinct elements.</p>

        <div class="invariant-box">
          <div class="invariant-title">Theorem (Exact Expected Comparisons of Randomized Quicksort)</div>
          <p>Let $z_1 < z_2 < \\dots < z_n$ denote the $n$ distinct elements of the input array in sorted order (by rank). Define the indicator random variable:
          $$X_{ij} = \\mathbb{I}\\{\\text{elements } z_i \\text{ and } z_j \\text{ are compared at any point during Randomized Quicksort}\\} \\quad (1 \\le i < j \\le n)$$
          Because every comparison in Quicksort compares some element against the current pivot, and the pivot is never included in either recursive call, <strong>any pair $(z_i, z_j)$ is compared at most once</strong>. Thus the total number of comparisons is $X = \\sum_{i=1}^{n-1}\\sum_{j=i+1}^{n} X_{ij}$.</p>
          <p><strong>Crucial Observation:</strong> Consider the set of elements $Z_{ij} = \\{z_i, z_{i+1}, \\dots, z_j\\}$ of cardinality $j - i + 1$. So long as no pivot is chosen from $Z_{ij}$, the entire set $Z_{ij}$ remains together in the same recursive subarray (either all strictly less than the pivot, or all strictly greater than the pivot). The very first time a pivot $p$ is chosen from $Z_{ij}$:</p>
          <ul>
            <li>If $p = z_i$ or $p = z_j$, then $z_i$ and $z_j$ are compared during that partition pass ($X_{ij} = 1$).</li>
            <li>If $z_i < p < z_j$, then $z_i$ is placed in the left partition ($< p$) and $z_j$ is placed in the right partition ($> p$); they are permanently separated and will <strong>never be compared</strong> ($X_{ij} = 0$).</li>
          </ul>
          <p>Since each of the $j - i + 1$ elements in $Z_{ij}$ is equally likely to be the first one chosen as a pivot from $Z_{ij}$:</p>
          $$\\Pr[X_{ij} = 1] = \\frac{2}{j - i + 1}$$
        </div>

        <h2>Summing the Harmonic Series: Where $1.386\\,n \\log_2 n$ Comes From</h2>
        <p>By linearity of expectation (which holds even though the indicator variables $X_{ij}$ are <em>not</em> mutually independent!):</p>
        $$\\mathbb{E}[X] = \\sum_{i=1}^{n-1} \\sum_{j=i+1}^{n} \\frac{2}{j - i + 1}$$
        <p>Substitute the span length $k = j - i$ (so $k$ ranges from $1$ to $n - 1$, and there are $n - k$ pairs with span $k$):</p>
        $$\\mathbb{E}[X] = \\sum_{k=1}^{n-1} (n - k) \\frac{2}{k + 1} = 2(n + 1)\\sum_{k=1}^{n-1}\\frac{1}{k + 1} - 2(n - 1) = 2(n + 1)(H_n - 1) - 2(n - 1) = 2(n + 1)H_n - 4n$$
        <p>Using the harmonic number expansion $H_n = \\sum_{m=1}^n \\frac{1}{m} = \\ln n + \\gamma + O(1/n)$ and converting from natural log to base-2 log ($\\ln n = \\ln(2) \\cdot \\log_2 n \\approx 0.69315 \\log_2 n$):</p>
        $$\\mathbb{E}[X] \\approx 2n \\ln n = (2 \\ln 2)\\, n \\log_2 n \\approx 1.3863\\, n \\log_2 n$$
        <p>Notice how remarkably close this is to the information-theoretic optimum: Randomized Quicksort performs only $38.6\\%$ more comparisons than Merge Sort ($1.0\\, n \\log_2 n$), and with Median-of-Three pivot selection, the constant drops further to $\\frac{12}{7} \\ln(2)\\, n \\log_2 n \\approx 1.188\\, n \\log_2 n$!</p>

        <div class="simulator-mount" data-sim="sim-sorting-race"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Pivot Strategy</th>
              <th>Expected Comparisons ($\\log_2 n$)</th>
              <th>Expected Swaps (Hoare)</th>
              <th>High-Probability Tail Bound</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Uniform Random Pivot ($1$-sample)</strong></td>
              <td>$2 \\ln(2)\\, n \\log_2 n \\approx 1.386\\, n \\log_2 n$</td>
              <td>$\\frac{1}{3} \\ln(2)\\, n \\log_2 n \\approx 0.231\\, n \\log_2 n$</td>
              <td>$\\Pr[X > 4n \\ln n] \\le n^{-2}$</td>
            </tr>
            <tr>
              <td><strong>Random Median-of-3 ($3$-sample)</strong></td>
              <td>$\\frac{12}{7} \\ln(2)\\, n \\log_2 n \\approx 1.188\\, n \\log_2 n$</td>
              <td>$\\frac{2}{7} \\ln(2)\\, n \\log_2 n \\approx 0.198\\, n \\log_2 n$</td>
              <td>$\\Pr[T > c n \\log n] \\le n^{-c'}$</td>
            </tr>
            <tr>
              <td><strong>Tukey's Ninther ($9$-sample)</strong></td>
              <td>$\\approx 1.09\\, n \\log_2 n$</td>
              <td>$\\approx 0.175\\, n \\log_2 n$</td>
              <td>Sub-exponential tail concentration</td>
            </tr>
            <tr>
              <td><strong>Merge Sort (Reference)</strong></td>
              <td>$1.000\\, n \\log_2 n - O(n)$</td>
              <td>$1.000\\, n \\log_2 n$ element moves</td>
              <td>Deterministic $\\le n \\lceil \\log_2 n \\rceil$</td>
            </tr>
          </tbody>
        </table>

        <svg viewBox="0 0 760 205" class="lesson-svg" role="img" aria-label="Rank interval Z_ij first pivot selection probability 2/(j-i+1)">
          <rect width="760" height="205" rx="10" fill="#0f172a"/>
          <text x="20" y="28" fill="#f8fafc" font-size="13" font-weight="bold">Rank-Ordered Set Z_ij = {z_i, ..., z_j}: Only the First Pivot Chosen Inside Z_ij Decides X_ij</text>
          <g transform="translate(20, 52)">
            <rect x="0" y="0" width="90" height="44" rx="5" fill="#1e293b" stroke="#475569" stroke-dasharray="4 2"/>
            <text x="45" y="26" text-anchor="middle" fill="#64748b" font-size="12">z_1 .. z_{i-1}</text>

            <rect x="105" y="0" width="76" height="44" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
            <text x="143" y="26" text-anchor="middle" fill="#6ee7b7" font-size="13" font-weight="bold">z_i (Pivot!)</text>

            <rect x="190" y="0" width="340" height="44" rx="5" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
            <text x="360" y="26" text-anchor="middle" fill="#fecaca" font-size="13" font-weight="bold">Interior {z_{i+1} ... z_{j-1}} → Splits z_i | z_j Forever!</text>

            <rect x="539" y="0" width="76" height="44" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
            <text x="577" y="26" text-anchor="middle" fill="#6ee7b7" font-size="13" font-weight="bold">z_j (Pivot!)</text>

            <rect x="630" y="0" width="90" height="44" rx="5" fill="#1e293b" stroke="#475569" stroke-dasharray="4 2"/>
            <text x="675" y="26" text-anchor="middle" fill="#64748b" font-size="12">z_{j+1} .. z_n</text>
          </g>
          <text x="20" y="132" fill="#34d399" font-size="12.5" font-weight="bold">• Green Endpoints (2 choices out of j - i + 1): z_i and z_j ARE compared during this partition ⇒ Pr[X_ij = 1] = 2 / (j - i + 1)</text>
          <text x="20" y="156" fill="#fca5a5" font-size="12.5">• Red Interior (j - i - 1 choices): Pivot p separates z_i &lt; p &lt; z_j into disjoint recursive calls ⇒ X_ij = 0</text>
          <text x="20" y="180" fill="#94a3b8" font-size="12">• Exterior Grey: Pivots outside Z_ij keep all of Z_ij together in the same recursive call (neither compares nor separates z_i, z_j).</text>
        </svg>

        <div class="mermaid">
flowchart LR
  A["Pick Random Pivot p ∈ [lo..hi]"] --> B{"Is Split within\nMiddle 50% (1/4 : 3/4)?"}
  B -- "Yes (Pr = 1/2): 'Good' Split" --> C["Max Subproblem ≤ 3N/4\nAt most log_{4/3}(N) ≈ 2.41 log2(N) Good Splits along any root-to-leaf path!"]
  B -- "No (Pr = 1/2): 'Bad' Split" --> D["Absorbed into Expected Length ≤ 2× Good Splits via Chernoff Bound"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Fast Unbiased Random Range Generation (Lemire's Multiply-Shift)</div>
          <p>Calling <code>std::rand() % len</code> inside a Quicksort recursion loop has two flaws: (1) 64-bit integer modulo (<code>DIV</code>) takes 20–40 cycles, and (2) <code>rand() % len</code> introduces modulo bias when <code>len</code> does not divide $2^{32}$. Production randomized algorithms pair a fast register-resident PRNG (such as <strong>SplitMix64</strong> or <strong>xoshiro256**</strong>, ~2 cycles) with Daniel Lemire's <strong>Fast Range</strong> reduction: <code>(uint64_t(rng32()) * uint64_t(len)) &gt;&gt; 32</code>, mapping a 32-bit random word into $[0, len)$ in a single 3-cycle multiply-high instruction without division!</p>
        </div>

        <h2>Production C++20 Implementation: Randomized Quicksort &amp; Empirical $2(n+1)H_n - 4n$ Verifier</h2>
        <pre><code class="language-cpp">#include &lt;cmath&gt;
#include &lt;cstddef&gt;
#include &lt;cstdint&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

struct SplitMix64 {
    std::uint64_t state;
    explicit constexpr SplitMix64(std::uint64_t seed = 0x9E3779B97F4A7C15ULL) noexcept : state(seed) {}

    constexpr std::uint64_t next() noexcept {
        std::uint64_t z = (state += 0x9E3779B97F4A7C15ULL);
        z = (z ^ (z &gt;&gt; 30)) * 0xBF58476D1CE4E5B9ULL;
        z = (z ^ (z &gt;&gt; 27)) * 0x94D049BB133111EBULL;
        return z ^ (z &gt;&gt; 31);
    }

    // Lemire's multiply-shift into [0, bound)
    constexpr std::size_t uniform(std::size_t bound) noexcept {
        return static_cast&lt;std::size_t&gt;((__uint128_t(next()) * __uint128_t(bound)) &gt;&gt; 64);
    }
};

// Instrumented Randomized Quicksort counting exact key comparisons
template &lt;typename T&gt;
std::uint64_t randomized_quicksort_count(T* a, std::ptrdiff_t lo, std::ptrdiff_t hi, SplitMix64&amp; rng) noexcept {
    if (lo &gt;= hi) return 0;

    const std::ptrdiff_t len = hi - lo + 1;
    const std::ptrdiff_t piv_idx = lo + static_cast&lt;std::ptrdiff_t&gt;(rng.uniform(static_cast&lt;std::size_t&gt;(len)));
    std::swap(a[piv_idx], a[hi]);
    const T pivot = a[hi];

    std::uint64_t cmps = 0;
    std::ptrdiff_t i = lo;
    for (std::ptrdiff_t j = lo; j &lt; hi; ++j) {
        ++cmps;
        if (a[j] &lt; pivot) {
            std::swap(a[i++], a[j]);
        }
    }
    std::swap(a[i], a[hi]);

    cmps += randomized_quicksort_count(a, lo, i - 1, rng);
    cmps += randomized_quicksort_count(a, i + 1, hi, rng);
    return cmps;
}

// Exact theoretical expectation E[X] = 2(n + 1)*H_n - 4n for n distinct keys
inline double theoretical_expected_comparisons(std::size_t n) noexcept {
    double h_n = 0.0;
    for (std::size_t k = 1; k &lt;= n; ++k) {
        h_n += 1.0 / static_cast&lt;double&gt;(k);
    }
    return 2.0 * static_cast&lt;double&gt;(n + 1) * h_n - 4.0 * static_cast&lt;double&gt;(n);
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Las Vegas vs. Monte Carlo &amp; Why Introsort Still Adds a Depth Cap</div>
          <p>Randomized Quicksort is a <strong>Las Vegas</strong> randomized algorithm: its output is <em>always 100% sorted</em>, and only its running time is a random variable. While Chernoff bounds guarantee $\\Pr[X > 4n \\ln n] \\le n^{-2}$, in safety-critical real-time systems or deterministic standard library APIs (where a global PRNG state cannot be mutated inside <code>std::sort</code>), David Musser's <strong>Introsort</strong> (1997) tracks recursion depth and deterministically switches to <strong>Heapsort</strong> if depth ever exceeds $2\\lfloor\\log_2 n\\rfloor$, upgrading expected $O(n \\log n)$ into strict worst-case $O(n \\log n)$ with zero extra memory.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Two rank-ordered elements z_i and z_j are compared in Quicksort at most once, and if and only if either z_i or z_j is the first pivot selected from Z_{ij} = {z_i, ..., z_j}.",
      "Because all j - i + 1 elements in Z_{ij} are equally likely to be chosen first, Pr[z_i and z_j compared] = 2 / (j - i + 1).",
      "Summing over all pairs via linearity of expectation yields the exact closed form E[X] = 2(n+1)H_n - 4n ≈ 2n ln n ≈ 1.386 n log_2 n comparisons.",
      "Although Randomized Quicksort performs ~38.6% more comparisons than Merge Sort, it performs 3–4x fewer data movements and operates in-place in L1/L2 cache."
    ],
    furtherReading: [
      {
        title: "CLRS — Introduction to Algorithms (4th Ed.), §7.4.2 Expected Running Time of Randomized Quicksort",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      },
      {
        title: "Musser (1997) — Introspective Sorting and Selection Algorithms (Software: Practice and Experience)",
        url: "https://doi.org/10.1002/(SICI)1097-024X(199708)27:8%3C983::AID-SPE117%3E3.0.CO;2-%23"
      },
      {
        title: "Erickson — Algorithms, Chapter 1: Recursion & Randomized Quicksort",
        url: "https://jeffe.cs.illinois.edu/teaching/algorithms/"
      }
    ]
  },
  "decision-tree-lower-bound": {
    title: "The Ω(N log N) Comparison Lower Bound via Stirling's Approximation",
    video: {
      youtubeId: "WffUZk1pgXE",
      id: "WffUZk1pgXE",
      url: "https://www.youtube.com/embed/WffUZk1pgXE",
      title: "Why Comparison-Based Sorting Algorithms Require Ω(N log N) — Decision Tree Proof",
      channel: "Back To Back SWE",
      duration: "12:55",
      start: 0,
      length: "12m",
      why: "Erik Demaine formulates the comparison decision-tree model, proves why any correct comparison sort must have at least n! reachable leaves, and derives the n log_2 n - 1.443n lower bound."
    },
    intuition: "Every binary comparison $A[i] \\lessgtr A[j]$ yields at most $1$ bit of information—splitting the set of remaining consistent input permutations in at most half. Because $n$ distinct items can arrive in $n!$ possible relative orders and a deterministic comparison sort must distinguish all $n!$ permutations at its leaves, the tree height must be at least $\\lceil \\log_2(n!) \\rceil = n \\log_2 n - \\frac{n}{\\ln 2} + \\Theta(\\log n)$.",
    content: `
      <div class="lesson-content">
        <h2>The Comparison Decision-Tree Model</h2>
        <p>In the <strong>comparison model of computation</strong>, elements are treated as abstract black boxes: an algorithm may copy or swap elements, but the <em>only</em> way it can inspect key values is by executing a binary comparison $a_i : a_j$ (returning $<, =, >$, or for distinct keys, simply $a_i < a_j$ vs. $a_i > a_j$). Operations like bit extraction, array indexing by key value ($C[A[i]]$), or hashing key bytes are disallowed.</p>
        <p>Any comparison sort on an input of fixed size $n$ can be unrolled into a finite <strong>binary decision tree</strong> $T_n$:</p>
        <ul>
          <li>Each <strong>internal node</strong> is labeled by a pair of indices $(i : j)$ and branches left if $A[i] < A[j]$ or right if $A[i] > A[j]$.</li>
          <li>Each <strong>leaf</strong> is labeled by a permutation $\\pi = (\\pi(1), \\pi(2), \\dots, \\pi(n)) \\in S_n$ that reorders the input into sorted order $A[\\pi(1)] < A[\\pi(2)] < \\dots < A[\\pi(n)]$.</li>
          <li>The <strong>worst-case number of comparisons</strong> on inputs of size $n$ equals the <strong>height</strong> $h(T_n)$ (longest root-to-leaf path).</li>
          <li>The <strong>average-case number of comparisons</strong> over a uniform distribution of all $n!$ permutations equals the <strong>average leaf depth</strong> $\\frac{\\text{IPL}(T_n)}{n!}$.</li>
        </ul>

        <div class="invariant-box">
          <div class="invariant-title">Theorem (Information-Theoretic Worst-Case &amp; Average-Case Lower Bound)</div>
          <p><strong>Step 1 (Injectivity of Leaves):</strong> Suppose two distinct input permutations $\\sigma_1 \\ne \\sigma_2 \\in S_n$ follow the exact same sequence of comparison outcomes from the root to the same leaf $\\ell$. Then the algorithm applies the exact same output permutation $\\pi$ to both $\\sigma_1$ and $\\sigma_2$. Since $\\sigma_1 \\ne \\sigma_2$, at least one of $\\pi(\\sigma_1)$ or $\\pi(\\sigma_2)$ fails to be sorted! Hence every one of the $n!$ permutations must reach a distinct leaf, so the number of reachable leaves $L$ satisfies $L \\ge n!$.</p>
          <p><strong>Step 2 (Binary Tree Capacity):</strong> A binary tree of height $h$ has at most $2^h$ leaves ($L \\le 2^h$). Combining both inequalities gives $2^h \\ge L \\ge n!$, or:</p>
          $$h \\ge \\lceil \\log_2(n!) \\rceil$$
          <p><strong>Step 3 (Stirling's Approximation):</strong> Using Stirling's lower bound $n! = \\sqrt{2\\pi n}\\left(\\frac{n}{e}\\right)^n e^{\\theta_n}$ (where $\\frac{1}{12n+1} < \\theta_n < \\frac{1}{12n}$), or equivalently bounding the sum $\\ln(n!) = \\sum_{k=1}^n \\ln k \\ge \\int_1^n \\ln x\\,dx = n \\ln n - n + 1$:</p>
          $$\\log_2(n!) = n \\log_2 n - \\frac{n}{\\ln 2} + \\frac{1}{2}\\log_2(2\\pi n) + O\\!\\left(\\frac{1}{n}\\right) \\approx n \\log_2 n - 1.4427\\,n + \\frac{1}{2}\\log_2(2\\pi n)$$
          <p><strong>Step 4 (Average-Case &amp; Randomized Lower Bound):</strong> By convexity of $f(d) = 2^d$ (or Kraft's inequality), among all binary trees with $L \\ge n!$ leaves, the sum of leaf depths $\\sum_{\\ell=1}^{L} d(\\ell)$ is minimized when the tree is almost complete (all leaves at depth $\\lfloor \\log_2 L \\rfloor$ or $\\lceil \\log_2 L \\rceil$), yielding average leaf depth $\\ge \\log_2(n!) - 1 = n \\log_2 n - O(n)$. By Yao's Minimax Principle, any randomized comparison sort also requires $\\ge \\log_2(n!) - O(1)$ expected comparisons!</p>
        </div>

        <div class="simulator-mount" data-sim="sim-sorting-race"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Problem / Input Constraint</th>
              <th>Reachable States $L$</th>
              <th>Comparison Lower Bound $\\lceil \\log_2 L \\rceil$</th>
              <th>Optimal Matching Algorithm</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>General Sorting ($n$ distinct keys)</strong></td>
              <td>$n!$</td>
              <td>$n \\log_2 n - 1.443n + \\Theta(\\log n)$</td>
              <td>Ford-Johnson Merge-Insertion / Merge Sort</td>
            </tr>
            <tr>
              <td><strong>Multiset Sorting ($f_1, \\dots, f_k$ duplicates)</strong></td>
              <td>$\\frac{n!}{f_1! f_2! \\cdots f_k!}$</td>
              <td>$n H(p_1, \\dots, p_k) - O(k \\log n)$</td>
              <td>Bentley-McIlroy / Dijkstra 3-Way Quicksort</td>
            </tr>
            <tr>
              <td><strong>$k$-Nearly Sorted ($|i - \\pi(i)| \\le k$)</strong></td>
              <td>$\\le (2k + 1)^n$</td>
              <td>$\\Omega(n \\log k)$</td>
              <td>Min-Heap Sliding Window ($O(n \\log k)$)</td>
            </tr>
            <tr>
              <td><strong>Inversion-Bounded ($I(A) \\le I$)</strong></td>
              <td>$\\le \\binom{n + I}{I}$</td>
              <td>$\\Omega\\!\\left(n \\log\\!\\left(1 + \\frac{I}{n}\\right)\\right)$</td>
              <td>Finger Search Tree / Adaptive TimSort</td>
            </tr>
          </tbody>
        </table>

        <svg viewBox="0 0 760 240" class="lesson-svg" role="img" aria-label="Decision tree for n=3 elements showing 3! = 6 permutation leaves and height 3">
          <rect width="760" height="240" rx="10" fill="#0f172a"/>
          <text x="20" y="26" fill="#f8fafc" font-size="13" font-weight="bold">Decision Tree for Sorting n = 3 Elements (a₁, a₂, a₃): 3! = 6 Leaves Require Height h ≥ ⌈log₂(6)⌉ = 3</text>
          <g transform="translate(380, 52)" text-anchor="middle" font-size="12">
            <!-- Root -->
            <rect x="-45" y="0" width="90" height="28" rx="14" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
            <text x="0" y="18" fill="#f8fafc" font-weight="bold">a₁ : a₂</text>

            <!-- Level 1 -->
            <line x1="-25" y1="28" x2="-170" y2="62" stroke="#64748b" stroke-width="1.5"/>
            <text x="-110" y="44" fill="#38bdf8" font-size="11">&lt;</text>
            <line x1="25" y1="28" x2="170" y2="62" stroke="#64748b" stroke-width="1.5"/>
            <text x="110" y="44" fill="#f59e0b" font-size="11">&gt;</text>

            <rect x="-215" y="62" width="90" height="28" rx="14" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="-170" y="80" fill="#f8fafc" font-weight="bold">a₂ : a₃</text>
            <rect x="125" y="62" width="90" height="28" rx="14" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="170" y="80" fill="#f8fafc" font-weight="bold">a₁ : a₃</text>

            <!-- Level 2 -->
            <line x1="-190" y1="90" x2="-270" y2="122" stroke="#64748b" stroke-width="1.5"/>
            <line x1="-150" y1="90" x2="-90" y2="122" stroke="#64748b" stroke-width="1.5"/>
            <line x1="150" y1="90" x2="90" y2="122" stroke="#64748b" stroke-width="1.5"/>
            <line x1="190" y1="90" x2="270" y2="122" stroke="#64748b" stroke-width="1.5"/>

            <!-- Leaf at depth 2 (leftmost) -->
            <rect x="-320" y="122" width="100" height="26" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
            <text x="-270" y="139" fill="#6ee7b7" font-weight="bold">(a₁, a₂, a₃)</text>

            <!-- Internal at depth 2 -->
            <rect x="-135" y="122" width="90" height="26" rx="13" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="-90" y="139" fill="#f8fafc" font-weight="bold">a₁ : a₃</text>
            <rect x="45" y="122" width="90" height="26" rx="13" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="90" y="139" fill="#f8fafc" font-weight="bold">a₂ : a₃</text>

            <!-- Leaf at depth 2 (rightmost) -->
            <rect x="220" y="122" width="100" height="26" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
            <text x="270" y="139" fill="#6ee7b7" font-weight="bold">(a₃, a₁, a₂)</text>

            <!-- Level 3 Leaves -->
            <line x1="-110" y1="148" x2="-155" y2="172" stroke="#64748b" stroke-width="1.5"/>
            <line x1="-70" y1="148" x2="-35" y2="172" stroke="#64748b" stroke-width="1.5"/>
            <line x1="70" y1="148" x2="35" y2="172" stroke="#64748b" stroke-width="1.5"/>
            <line x1="110" y1="148" x2="155" y2="172" stroke="#64748b" stroke-width="1.5"/>

            <rect x="-205" y="172" width="96" height="26" rx="5" fill="#064e3b" stroke="#10b981"/>
            <text x="-157" y="189" fill="#d1fae5">(a₁, a₃, a₂)</text>
            <rect x="-98" y="172" width="96" height="26" rx="5" fill="#064e3b" stroke="#10b981"/>
            <text x="-50" y="189" fill="#d1fae5">(a₃, a₁, a₂)</text>
            <rect x="2" y="172" width="96" height="26" rx="5" fill="#064e3b" stroke="#10b981"/>
            <text x="50" y="189" fill="#d1fae5">(a₂, a₁, a₃)</text>
            <rect x="109" y="172" width="96" height="26" rx="5" fill="#064e3b" stroke="#10b981"/>
            <text x="157" y="189" fill="#d1fae5">(a₂, a₃, a₁)</text>
          </g>
        </svg>

        <h2>Exact Minimum Comparisons for Small $N$ &amp; Adversary Arguments</h2>
        <p>How close is $\\lceil \\log_2(n!) \\rceil$ to the true minimum worst-case comparisons $S(n)$? For $n = 1 \\dots 11$, Ford and Johnson's <strong>Merge-Insertion Sort</strong> (1959) matches $\\lceil \\log_2(n!) \\rceil$ <em>to the exact single comparison</em>:</p>
        <ul>
          <li>$n = 3$: $\\lceil \\log_2 6 \\rceil = 3$ comparisons.</li>
          <li>$n = 4$: $\\lceil \\log_2 24 \\rceil = 5$ comparisons.</li>
          <li>$n = 5$: $\\lceil \\log_2 120 \\rceil = 7$ comparisons! (Whereas standard Merge Sort and Insertion Sort take $8$ or $10$ comparisons; sorting $5$ elements in $7$ comparisons requires pairing $(a,b)$ and $(c,d)$, comparing their winners, and binary-inserting $e$ and the loser along a 3-element chain).</li>
          <li>$n = 12$: $\\lceil \\log_2(12!) \\rceil = 29$, but Wells (1965) proved by exhaustive computer search that $S(12) = 30$, showing that no comparison tree can split $12!$ into perfectly balanced $50/50$ subsets at every step!</li>
        </ul>

        <div class="mermaid">
flowchart LR
  A["5 Elements: a, b, c, d, e"] --> B["1–2. Compare Pairs:\na : b (say a < b)\nc : d (say c < d)"]
  B --> C["3. Compare Winners:\nb : d (say b < d)\nChain: a < b < d (and c < d)"]
  C --> D["4–5. Binary Insert e\ninto 3-chain (a < b < d)\nCosts 2 comparisons!"]
  D --> E["6–7. Binary Insert c\ninto the 3 elements < d\nCosts 2 comparisons! Total = 7"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Sorting Networks ($N \\le 16$) Beat $\\lceil \\log_2(N!) \\rceil$ via Branchless SIMD <code>min</code>/<code>max</code></div>
          <p>On modern CPUs, performing 7 heavily branched comparisons to sort 5 integers is actually <em>slower</em> than executing 9 branchless conditional-move (<code>CMOV</code>) or SIMD (<code>_mm_min_epi32</code> / <code>_mm_max_epi32</code>) compare-and-swap operations in a <strong>Sorting Network</strong> (Batcher's Odd-Even Merge or optimal 5-element / 8-element Bose-Nelson networks). Because all comparator wires in a sorting network layer are data-independent, a superscalar CPU executes 3–4 compare-and-swaps in a single clock cycle with <strong>zero branch mispredictions</strong>!</p>
        </div>

        <h2>Production C++20 Implementation: Optimal 7-Comparison 5-Sort vs. Branchless Sorting Network</h2>
        <pre><code class="language-cpp">#include &lt;array&gt;
#include &lt;cmath&gt;
#include &lt;concepts&gt;
#include &lt;cstdint&gt;
#include &lt;utility&gt;

// Information-theoretic lower bound ceil(log2(n!)) using exact log-gamma / sum of log2(k)
inline std::uint64_t comparison_lower_bound(std::uint64_t n) noexcept {
    double log2_fact = 0.0;
    for (std::uint64_t k = 2; k &lt;= n; ++k) {
        log2_fact += std::log2(static_cast&lt;double&gt;(k));
    }
    return static_cast&lt;std::uint64_t&gt;(std::ceil(log2_fact - 1e-12));
}

// Ford-Johnson Merge-Insertion Sort for N = 5 in AT MOST 7 Comparisons (Optimal!)
template &lt;std::totally_ordered T&gt;
std::array&lt;T, 5&gt; sort5_optimal_7cmps(T a, T b, T c, T d, T e) noexcept {
    if (b &lt; a) std::swap(a, b); // Cmp 1: a &lt;= b
    if (d &lt; c) std::swap(c, d); // Cmp 2: c &lt;= d
    if (d &lt; b) {                // Cmp 3: order pairs by larger element (b &lt;= d)
        std::swap(a, c);
        std::swap(b, d);
    }
    // Now we have main chain: a &lt;= b &lt;= d, and c &lt;= d.
    // Step 4-5: Binary insert <code>e</code> into the 3-element chain [a, b, d] (2 comparisons)
    std::array&lt;T, 4&gt; chain;
    if (e &lt; b) {                // Cmp 4
        if (e &lt; a) chain = {e, a, b, d}; // Cmp 5a
        else       chain = {a, e, b, d};
    } else {
        if (e &lt; d) chain = {a, b, e, d}; // Cmp 5b
        else       chain = {a, b, d, e};
    }
    // Step 6-7: Since c &lt;= d, <code>c</code> is smaller than <code>d</code> (which is at chain[2] or chain[3]),
    // so <code>c</code> only needs to be binary-inserted into the first 3 elements chain[0..2] (2 comparisons)!
    if (c &lt; chain[1]) {         // Cmp 6
        if (c &lt; chain[0]) return {c, chain[0], chain[1], chain[2], chain[3]}; // Cmp 7a
        else              return {chain[0], c, chain[1], chain[2], chain[3]};
    } else {
        if (c &lt; chain[2]) return {chain[0], chain[1], c, chain[2], chain[3]}; // Cmp 7b
        else              return {chain[0], chain[1], chain[2], c, chain[3]};
    }
}

// Contrast: Branchless 9-Comparator Sorting Network for N = 5 (Compiles to CMOV / min-max)
template &lt;std::totally_ordered T&gt;
void sort5_branchless_network(T* v) noexcept {
    auto cmp_swap = [](T&amp; x, T&amp; y) noexcept {
        T mn = (y &lt; x) ? y : x;
        T mx = (y &lt; x) ? x : y;
        x = mn; y = mx;
    };
    cmp_swap(v[0], v[1]); cmp_swap(v[3], v[4]);
    cmp_swap(v[2], v[4]); cmp_swap(v[2], v[3]);
    cmp_swap(v[0], v[3]); cmp_swap(v[0], v[2]);
    cmp_swap(v[1], v[4]); cmp_swap(v[1], v[3]);
    cmp_swap(v[1], v[2]);
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">How to Bypass the $\\Omega(N \\log N)$ Lower Bound</div>
          <p>Whenever an interview or systems design problem asks you to sort in $o(N \\log N)$ time, ask: <strong>Which assumption of the comparison decision-tree model can we violate?</strong><br>
          1. <em>Non-Comparison Multi-Way Branching:</em> Counting Sort and Radix Sort use key digits as direct array indices ($b$-way branching per step instead of $2$-way), yielding height $\\log_b(n!)$.<br>
          2. <em>Restricted Input Space ($L \\ll n!$):</em> If the array has at most $O(n)$ inversions or comes from merging $O(1)$ sorted streams, there are only $2^{O(n)}$ valid inputs, so an adaptive comparison sort finishes in $\\Theta(n)$ comparisons!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Any deterministic or randomized comparison sort on n distinct keys must distinguish all n! input permutations at the leaves of its binary decision tree.",
      "Because a binary tree of height h has at most 2^h leaves, worst-case and average-case comparisons are bounded below by log_2(n!) = n log_2 n - (n / ln 2) + Θ(log n) ≈ n log_2 n - 1.443n.",
      "When inputs have restricted entropy (k duplicates, k-nearly-sorted, or I inversions), the lower bound drops to log_2(L) where L is the number of valid input permutations.",
      "Ford-Johnson Merge-Insertion Sort achieves the exact information-theoretic minimum 7 comparisons for n = 5, while branchless sorting networks trade 2 extra comparisons for zero branch mispredictions."
    ],
    furtherReading: [
      {
        title: "CLRS — Introduction to Algorithms (4th Ed.), §8.1 Lower Bounds for Sorting",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      },
      {
        title: "Knuth — The Art of Computer Programming, Vol. 3: Sorting and Searching (§5.3.1 Minimum-Comparison Sorting & Ford-Johnson)",
        url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html"
      },
      {
        title: "Erickson — Algorithms, Note on Decision Trees & Adversary Lower Bounds",
        url: "https://jeffe.cs.illinois.edu/teaching/algorithms/"
      }
    ]
  },

  "counting-radix-bucket-sorts": {
    title: "Non-Comparison Sorts: Counting Sort, LSD/MSD Radix Sort & Bucket Sort",
    video: {
      youtubeId: "Nz1KZXbghj8",
      id: "Nz1KZXbghj8",
      url: "https://www.youtube.com/embed/Nz1KZXbghj8",
      title: "MIT 6.006 Lecture 7: Counting Sort, Radix Sort & Lower Bounds for Sorting",
      channel: "MIT OpenCourseWare",
      duration: "49:52",
      start: 0,
      length: "49m",
      why: "Erik Demaine builds Counting Sort via cumulative prefix sums, proves why stability of the inner digit sort is mandatory for LSD Radix Sort, and derives the optimal radix choice b = Θ(n)."
    },
    intuition: "Comparison sorts extract only $1$ bit of ordering per operation. Counting Sort and Radix Sort use the key's bits directly as a $b$-way array index—extracting $\\log_2 b$ bits of information per array lookup—reducing the tree height from $\\Omega(n \\log_2 n)$ to $\\Theta\\!\\left(\\frac{w}{\\log_2 b}(n + b)\\right)$.",
    content: `
      <div class="lesson-content">
        <h2>Counting Sort &amp; Prefix-Sum Stability</h2>
        <p>When keys are integers in a small range $[0, k)$, <strong>Counting Sort</strong> bypasses key-to-key comparisons entirely in three linear passes:</p>
        <ol>
          <li><strong>Histogram Pass ($\\Theta(n)$):</strong> Count occurrences of each key in <code>count[0 .. k-1]</code>.</li>
          <li><strong>Prefix-Sum Pass ($\\Theta(k)$):</strong> Compute exclusive or inclusive prefix sums so <code>count[v]</code> holds the exact starting (or ending) output index for records with key $v$.</li>
          <li><strong>Stable Scatter Pass ($\\Theta(n)$):</strong> Iterate through the input array and place each element into <code>out[count[key]++]</code> (using exclusive prefix sums in a forward scan, or inclusive prefix sums in a backward scan).</li>
        </ol>

        <div class="invariant-box">
          <div class="invariant-title">LSD Radix Sort Correctness Invariant: Why the Digit Pass MUST Be Stable</div>
          <p><strong>Least-Significant-Digit (LSD) Radix Sort</strong> views each $w$-bit key as a $d$-digit base-$b$ number ($d = \\lceil w / r \\rceil$ where $b = 2^r$) and runs Counting Sort from the least significant digit ($j = 0$) to the most significant digit ($j = d - 1$).</p>
          <p><strong>Loop Invariant (Induction on Digit $j$):</strong> After pass $j$, the array is sorted by the suffix of the lowest $j + 1$ digits. On pass $j$, two elements $x$ and $y$ either:</p>
          <ul>
            <li>Have <strong>different</strong> $j$-th digits ($x_j < y_j$): Counting Sort places $x$ before $y$, correctly ordering them regardless of lower digits.</li>
            <li>Have <strong>equal</strong> $j$-th digits ($x_j = y_j$): Their true order is determined by their lower $j$ digits—which were <em>already in sorted order</em> from pass $j - 1$! <strong>Stability</strong> of Counting Sort guarantees that $x$ and $y$ preserve their relative order from pass $j - 1$. Without stability, pass $j$ scrambles lower-digit ties and produces an unsorted output!</li>
          </ul>
        </div>

        <div class="simulator-mount" data-sim="sim-sorting-race"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Time Complexity</th>
              <th>Auxiliary Space</th>
              <th>Stable?</th>
              <th>Best Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Counting Sort</strong></td>
              <td>$\\Theta(n + k)$</td>
              <td>$\\Theta(n + k)$</td>
              <td>Yes</td>
              <td>Small integer alphabet $k = O(n)$</td>
            </tr>
            <tr>
              <td><strong>LSD Radix Sort ($r$-bit digits)</strong></td>
              <td>$\\Theta\\!\\left(\\frac{w}{r}(n + 2^r)\\right)$</td>
              <td>$\\Theta(n + 2^r)$</td>
              <td>Yes</td>
              <td>Fixed-width 32/64-bit ints &amp; IEEE-754 floats ($r=8$ or $11$)</td>
            </tr>
            <tr>
              <td><strong>MSD Radix Sort (Top-Down)</strong></td>
              <td>$O(n \\cdot L_{\\text{avg}})$ to $O(n \\cdot L_{\\max})$</td>
              <td>$O(n + d \\cdot 2^r)$</td>
              <td>Yes (with aux) / No (in-place)</td>
              <td>Variable-length strings, early exit on distinct prefixes</td>
            </tr>
            <tr>
              <td><strong>Bucket Sort ($n$ uniform buckets)</strong></td>
              <td>$\\Theta(n)$ expected, $\\Theta(n^2)$ worst</td>
              <td>$\\Theta(n)$</td>
              <td>Yes</td>
              <td>Uniformly distributed keys on $[0, 1)$</td>
            </tr>
          </tbody>
        </table>

        <h2>Choosing the Optimal Radix $b = 2^r$ &amp; Sorting Signed/Floating-Point Keys</h2>
        <p>Given $n$ keys of $w$ bits, if we extract $r$ bits per pass ($b = 2^r$ buckets), we perform $d = w/r$ passes of cost $\\Theta(n + 2^r)$. Theoretically, choosing $r = \\lfloor \\log_2 n \\rfloor$ ($b = \\Theta(n)$) minimizes $\\frac{w}{r}(n + 2^r)$ to $\\Theta\\!\\left(\\frac{w}{\\log_2 n} \\cdot n\\right)$. In hardware practice, however, $r = 8$ ($b = 256$ buckets, 4 passes for 32-bit ints, 8 passes for 64-bit ints) is almost universally used because a $256 \\times 4\\text{ B} = 1\\text{ KB}$ histogram array stays permanently pinned in L1d cache and avoids TLB thrashing!</p>
        <p>Can Radix Sort handle negative two's-complement integers and IEEE-754 <code>float</code>/<code>double</code> values? <strong>Yes—via bijective order-preserving bit flips in $O(1)$ instructions:</strong></p>
        <ul>
          <li><strong>Signed Two's-Complement <code>int32_t</code> / <code>int64_t</code>:</strong> Flipping the sign bit (<code>uint64_t(x) ^ (1ULL &lt;&lt; 63)</code>) maps $-2^{63} \\mapsto 0$, $-1 \\mapsto 2^{63}-1$, $0 \\mapsto 2^{63}$, and $2^{63}-1 \\mapsto 2^{64}-1$, turning signed order into unsigned lexicographical order!</li>
          <li><strong>IEEE-754 <code>double</code> (Sign-Magnitude Exponent + Mantissa):</strong> Positive floats already sort identically to unsigned integers ($+0.0 < +1.0 < +\\infty$). Negative floats have MSB = $1$ and increase in magnitude as they become <em>more negative</em> (reversed order). Michael Herf's <strong>FloatFlip</strong> bijection flips all 64 bits if the sign bit is $1$, and flips <em>only</em> the sign bit if the sign bit is $0$: <code>uint64_t mask = -int64_t(u &gt;&gt; 63) | (1ULL &lt;&lt; 63); return u ^ mask;</code>.</li>
        </ul>

        <svg viewBox="0 0 760 210" class="lesson-svg" role="img" aria-label="4-pass 8-bit LSD Radix Sort with single-pass histogram precomputation">
          <rect width="760" height="210" rx="10" fill="#0f172a"/>
          <text x="20" y="28" fill="#f8fafc" font-size="13" font-weight="bold">Single-Pass Multi-Histogram LSD Radix Sort (32-bit Keys, r = 8 bits, 256 Buckets per Pass)</text>
          <g transform="translate(20, 48)">
            <rect x="0" y="0" width="165" height="68" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="82" y="24" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">Byte 3 (Bits 24..31)</text>
            <text x="82" y="45" text-anchor="middle" fill="#cbd5e1" font-size="11">Pass 3: Sign/MSB Scatter</text>
            <text x="82" y="61" text-anchor="middle" fill="#64748b" font-size="10">hist[3][256] (1 KB in L1)</text>

            <rect x="180" y="0" width="165" height="68" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
            <text x="262" y="24" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">Byte 2 (Bits 16..23)</text>
            <text x="262" y="45" text-anchor="middle" fill="#cbd5e1" font-size="11">Pass 2: Ping-Pong AUX→A</text>
            <text x="262" y="61" text-anchor="middle" fill="#64748b" font-size="10">hist[2][256] (1 KB in L1)</text>

            <rect x="360" y="0" width="165" height="68" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
            <text x="442" y="24" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">Byte 1 (Bits 8..15)</text>
            <text x="442" y="45" text-anchor="middle" fill="#cbd5e1" font-size="11">Pass 1: Ping-Pong A→AUX</text>
            <text x="442" y="61" text-anchor="middle" fill="#64748b" font-size="10">hist[1][256] (1 KB in L1)</text>

            <rect x="540" y="0" width="180" height="68" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
            <text x="630" y="24" text-anchor="middle" fill="#a855f7" font-size="12" font-weight="bold">Byte 0 (Bits 0..7)</text>
            <text x="630" y="45" text-anchor="middle" fill="#cbd5e1" font-size="11">Pass 0 (First): LSB Scatter</text>
            <text x="630" y="61" text-anchor="middle" fill="#64748b" font-size="10">hist[0][256] (1 KB in L1)</text>
          </g>
          <text x="20" y="146" fill="#34d399" font-size="12.5" font-weight="bold">Optimization 1 (Single Histogram Scan): Compute all 4 byte histograms in ONE initial pass over A[0..n-1]!</text>
          <text x="20" y="170" fill="#38bdf8" font-size="12.5" font-weight="bold">Optimization 2 (Trivial-Pass Skip): If any byte has hist[pass][b] == n (e.g. upper bytes all 0), skip that scatter pass entirely!</text>
          <text x="20" y="192" fill="#94a3b8" font-size="12">Result: 32-bit integers with values &lt; 65,536 sort in just 2 linear memory sweeps instead of 4!</text>
        </svg>

        <div class="mermaid">
flowchart LR
  A["Input Array A[0..n-1]"] --> B["1 Pass: Build All 8 Byte Histograms\ncount[0..7][256] (8 KB in L1d)"]
  B --> C{"Pass p = 0..7:\nAny Bucket == n?"}
  C -- "Yes (All keys share byte p)" --> D["Skip Pass p in O(1)!"]
  C -- "No" --> E["Scatter src[i] → dst[offset[byte]++]\nSwap(src, dst)"]
  D --> F["Next Pass p + 1"]
  E --> F
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: TLB Misses &amp; Cache-Line Write-Combining Limits on $b = 2^r$</div>
          <p>Why does choosing $r = 16$ ($b = 65{,}536$ buckets, only 2 passes for 32-bit ints) perform <em>worse</em> than $r = 8$ ($b = 256$ buckets, 4 passes) on modern CPUs? During the scatter phase <code>dst[offset[digit]++] = x</code>, the CPU writes simultaneously to $b$ distinct active output streams in memory:</p>
          <ul>
            <li>Each stream writes to a different $4\\text{ KB}$ virtual memory page and $64\\text{ B}$ cache line.</li>
            <li>An x86-64 core has only ~64–128 L1 dTLB entries and 10–12 L1 Line Fill Buffers (write-combining buffers), and an L1d cache holds only 512 cache lines ($32\\text{ KB}$).</li>
            <li>With $b = 256$ buckets, all 256 active write pointers fit inside L1d cache and L2 TLB. With $b = 65{,}536$ buckets, every single write suffers both an L1/L2 cache miss and a page-table walk (TLB miss), collapsing memory throughput by $5\\text{–}10\\times$!</li>
          </ul>
        </div>

        <h2>Production C++20 Implementation: 8-Bit LSD Radix Sort with Signed/Float Bijection &amp; Pass-Skipping</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;array&gt;
#include &lt;bit&gt;
#include &lt;cstddef&gt;
#include &lt;cstdint&gt;
#include &lt;vector&gt;

// Bijective order-preserving projections to uint64_t
constexpr std::uint64_t radix_encode_int64(std::int64_t x) noexcept {
    return static_cast&lt;std::uint64_t&gt;(x) ^ (1ULL &lt;&lt; 63);
}
constexpr std::int64_t radix_decode_int64(std::uint64_t u) noexcept {
    return static_cast&lt;std::int64_t&gt;(u ^ (1ULL &lt;&lt; 63));
}

constexpr std::uint64_t radix_encode_double(double d) noexcept {
    std::uint64_t u = std::bit_cast&lt;std::uint64_t&gt;(d);
    std::uint64_t mask = -static_cast&lt;std::int64_t&gt;(u &gt;&gt; 63) | (1ULL &lt;&lt; 63);
    return u ^ mask;
}
constexpr double radix_decode_double(std::uint64_t u) noexcept {
    std::uint64_t mask = ((u &gt;&gt; 63) - 1ULL) | (1ULL &lt;&lt; 63);
    return std::bit_cast&lt;double&gt;(u ^ mask);
}

// High-throughput 64-bit LSD Radix Sort (r = 8 bits, 1 histogram pass + skipped trivial passes)
void radix_sort_u64(std::vector&lt;std::uint64_t&gt;&amp; a) {
    const std::size_t n = a.size();
    if (n &lt;= 1) return;

    // 1. Compute all 8 byte histograms in a single sequential scan (8 KB fits in L1d)
    std::array&lt;std::array&lt;std::size_t, 256&gt;, 8&gt; count{};
    for (std::uint64_t v : a) {
        for (std::size_t p = 0; p &lt; 8; ++p) {
            ++count[p][(v &gt;&gt; (p * 8)) &amp; 0xFFU];
        }
    }

    std::vector&lt;std::uint64_t&gt; aux(n);
    std::uint64_t* src = a.data();
    std::uint64_t* dst = aux.data();

    for (std::size_t p = 0; p &lt; 8; ++p) {
        // 2. Convert histogram to exclusive prefix sums &amp; detect trivial single-bucket pass
        bool trivial = false;
        std::size_t sum = 0;
        for (std::size_t b = 0; b &lt; 256; ++b) {
            if (count[p][b] == n) { trivial = true; break; }
            std::size_t c = count[p][b];
            count[p][b] = sum;
            sum += c;
        }
        if (trivial) continue; // All elements have identical byte p!

        // 3. Stable scatter pass
        const std::size_t shift = p * 8;
        for (std::size_t i = 0; i &lt; n; ++i) {
            const std::uint64_t v = src[i];
            const std::size_t bucket = (v &gt;&gt; shift) &amp; 0xFFU;
            dst[count[p][bucket]++] = v;
        }
        std::swap(src, dst);
    }

    if (src != a.data()) {
        std::copy(src, src + n, a.data());
    }
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Floating-Point NaN &amp; Signed Zero (<code>-0.0</code> vs <code>+0.0</code>) in Radix Sort</div>
          <p>When applying <code>radix_encode_double</code> to IEEE-754 floats, be aware of two edge cases: (1) <code>-0.0</code> (<code>0x8000000000000000</code>) and <code>+0.0</code> (<code>0x0000000000000000</code>) map to adjacent unsigned integers (<code>0x7FFFFFFFFFFFFFFF</code> and <code>0x8000000000000000</code>), which cleanly sorts <code>-0.0</code> immediately before <code>+0.0</code> (total order), and (2) <code>NaN</code> payloads have all exponent bits set to <code>1</code> and sort to the extreme ends. Normalizing <code>if (d == 0.0) d = +0.0;</code> before encoding ensures canonical zero equality if needed.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Counting Sort uses cumulative prefix sums to stably place n integers from [0, k) in Θ(n + k) time without key-to-key comparisons.",
      "LSD Radix Sort requires its inner digit sort to be strictly stable so ties on more significant digits preserve the ordering established by less significant digits.",
      "Using 8-bit digits (256 buckets) keeps the histogram in L1 cache and avoids TLB thrashing across active write streams; computing all byte histograms in one initial scan allows skipping passes where all keys share the same byte.",
      "Signed two's-complement integers and IEEE-754 floats can be sorted in linear time via O(1) bijective bit flips (flipping MSB for signed ints; FloatFlip mask for IEEE-754 floats)."
    ],
    furtherReading: [
      {
        title: "CLRS — Introduction to Algorithms (4th Ed.), §8.2 Counting Sort, §8.3 Radix Sort, §8.4 Bucket Sort",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      },
      {
        title: "Sedgewick & Wayne — Algorithms (4th Ed.), §5.1 String Sorts (LSD, MSD, and 3-Way String Quicksort)",
        url: "https://algs4.cs.princeton.edu/51radix/"
      },
      {
        title: "Knuth — The Art of Computer Programming, Vol. 3: Sorting and Searching (§5.2.5 Sorting by Distribution)",
        url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html"
      }
    ]
  },

  "quickselect-bfprt-median": {
    title: "Order Statistics: Randomized Quickselect vs Deterministic BFPRT Median-of-Medians",
    video: {
      youtubeId: "mR_RUjsJnV8",
      id: "mR_RUjsJnV8",
      url: "https://www.youtube.com/embed/mR_RUjsJnV8",
      title: "MIT 6.046J Lecture 6: Order Statistics, Randomized Quickselect & Worst-Case Linear Median-of-Medians",
      channel: "MIT OpenCourseWare",
      duration: "1:19:12",
      start: 0,
      length: "79m",
      why: "Erik Demaine derives Hoare's Quickselect and proves the Blum-Floyd-Pratt-Rivest-Tarjan (BFPRT) Median-of-Medians recurrence T(n) <= T(n/5) + T(7n/10) + O(n) = O(n)."
    },
    intuition: "Quicksort recurses on <em>both</em> partitions ($T(n) = 2T(n/2) + \\Theta(n) = \\Theta(n \\log n)$), whereas finding the $k$-th smallest element only needs to recurse on the <em>one</em> partition containing index $k$, turning the geometric series $n + \\frac{n}{2} + \\frac{n}{4} + \\dots$ into $\\Theta(n)$ expected time. And by grouping elements into columns of $5$ and recursively selecting the median of those column medians (BFPRT), we guarantee a pivot that eliminates at least $30\\%$ of elements in the worst case—yielding deterministic $O(n)$ selection because $\\frac{1}{5} + \\frac{7}{10} = \\frac{9}{10} < 1$!",
    content: `
      <div class="lesson-content">
        <h2>Hoare's Quickselect (<code>FIND</code>, 1961): Expected $\\Theta(N)$ Selection</h2>
        <p>Given an unsorted array $A[0 \\dots n-1]$ and a target rank $k \\in [0, n-1]$, the <strong>selection problem</strong> asks to rearrange $A$ (like C++'s <code>std::nth_element</code>) such that $A[k]$ holds the element that would appear at index $k$ if $A$ were sorted, with $A[0 \\dots k-1] \\le A[k] \\le A[k+1 \\dots n-1]$.</p>
        <p><strong>Randomized Quickselect</strong> picks a random pivot, partitions $A[lo \\dots hi]$ around it to land at index $p$, and branches three ways:</p>
        <ul>
          <li>If $k == p$: Done! Return $A[p]$.</li>
          <li>If $k < p$: Recurse (or loop) <strong>only</strong> on the left subarray $A[lo \\dots p-1]$.</li>
          <li>If $k > p$: Recurse (or loop) <strong>only</strong> on the right subarray $A[p+1 \\dots hi]$.</li>
        </ul>
        <p>Because a random pivot lands in the middle $50\\%$ of the current subarray (ranks $[n/4, 3n/4]$) with probability $1/2$, every $2$ expected partitions shrink the active subarray to at most $\\frac{3}{4}$ of its previous size. Summing the geometric series gives:</p>
        $$\\mathbb{E}[T(n)] \\le \\sum_{j=0}^{\\infty} 2 \\cdot c n \\left(\\frac{3}{4}\\right)^j = 8cn = \\Theta(n)$$
        <p>More precisely, using indicator random variables $X_{ij}$, Quickselect performs at most $2(n + 1 + (k+1)\\ln\\frac{n}{k} + (n-k)\\ln\\frac{n}{n-k}) \\le (2 + 2\\ln 2)n \\approx 3.386n$ expected comparisons to find the median, and $2n + o(n)$ to find the minimum or maximum.</p>

        <div class="invariant-box">
          <div class="invariant-title">The BFPRT (Blum-Floyd-Pratt-Rivest-Tarjan, 1973) Median-of-Medians Proof</div>
          <p>Can we guarantee a good pivot <em>deterministically</em> in $O(n)$ worst-case time? Suppose we partition $n$ elements into $\\lceil n/5 \\rceil$ groups of $5$, sort each group of $5$ in $O(1)$ comparisons (at most 6 comparisons per group), and recursively call <code>bfprt_select</code> on the $\\lceil n/5 \\rceil$ group medians to find their exact median $x$ (the <strong>Median of Medians</strong>).</p>
          <p><strong>How many elements are guaranteed to be $\\le x$ (and symmetrically $\\ge x$)?</strong></p>
          <ul>
            <li>At least half of the $\\lceil n/5 \\rceil$ group medians are $\\le x$ (that is, $\\ge \\frac{1}{2}\\lceil n/5 \\rceil$ groups).</li>
            <li>In every such group of $5$ (ignoring the one partial group and the pivot's own group), the group median and the $2$ smaller elements in its column of $5$ are all $\\le x$—contributing <strong>$3$ elements per group</strong>!</li>
            <li>Therefore, at least $3\\left(\\left\\lceil \\frac{1}{2}\\left\\lceil \\frac{n}{5} \\right\\rceil \\right\\rceil - 2\\right) \\ge \\frac{3n}{10} - 6$ elements are $\\le x$, and symmetrically at least $\\frac{3n}{10} - 6$ elements are $\\ge x$.</li>
            <li>Consequently, whichever side of $x$ we recurse into after partitioning contains <strong>at most $\\frac{7n}{10} + 6$ elements</strong>!</li>
          </ul>
          <p>This yields the celebrated BFPRT recurrence:</p>
          $$T(n) \\le \\underbrace{T\\!\\left(\\left\\lceil \\frac{n}{5} \\right\\rceil\\right)}_{\\text{find median of medians}} + \\underbrace{T\\!\\left(\\frac{7n}{10} + 6\\right)}_{\\text{recurse on survivor side}} + \\underbrace{\\Theta(n)}_{\\text{5-sorts + partition}}$$
          <p>Because $\\frac{1}{5} + \\frac{7}{10} = \\frac{9}{10} < 1$, the work decays geometrically at every level of the recursion tree ($1 + 0.9 + 0.81 + \\dots = 10$), proving by induction (or Akra-Bazzi with $p = 1$) that $T(n) \\le 10cn = \\Theta(n)$ in the strict worst case!</p>
        </div>

        <h2>Why Groups of $5$? Why Do Groups of $3$ Fail While Groups of $7$ Work?</h2>
        <div class="simulator-mount" data-sim="sim-quickselect-bfprt"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Group Size $g$</th>
              <th>Median-of-Medians Call</th>
              <th>Max Survivor Partition</th>
              <th>Subproblem Fraction Sum</th>
              <th>Worst-Case Complexity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>$g = 3$</strong></td>
              <td>$T(n / 3)$</td>
              <td>$T\\!\\left((1 - \\frac{2}{6})n\\right) = T(2n / 3)$</td>
              <td>$\\frac{1}{3} + \\frac{2}{3} = 1.00$ (No decay!)</td>
              <td>$\\Theta(n \\log n)$ — <strong>Fails!</strong></td>
            </tr>
            <tr>
              <td><strong>$g = 5$ (BFPRT Canonical)</strong></td>
              <td>$T(n / 5)$</td>
              <td>$T\\!\\left((1 - \\frac{3}{10})n\\right) = T(7n / 10)$</td>
              <td>$\\frac{1}{5} + \\frac{7}{10} = 0.90 < 1$</td>
              <td>$\\Theta(n)$ — <strong>Smallest odd $g$ that works!</strong></td>
            </tr>
            <tr>
              <td><strong>$g = 7$</strong></td>
              <td>$T(n / 7)$</td>
              <td>$T\\!\\left((1 - \\frac{4}{14})n\\right) = T(5n / 7)$</td>
              <td>$\\frac{1}{7} + \\frac{5}{7} = \\frac{6}{7} \\approx 0.857 < 1$</td>
              <td>$\\Theta(n)$</td>
            </tr>
            <tr>
              <td><strong>Introselect (<code>std::nth_element</code>)</strong></td>
              <td>0 (Fast 3-sample / Ninther)</td>
              <td>Switches to BFPRT / Heap on bad splits</td>
              <td>Adaptive hybrid</td>
              <td>$\\Theta(n)$ worst-case + $\\approx 3.4n$ average</td>
            </tr>
          </tbody>
        </table>

        <svg viewBox="0 0 760 230" class="lesson-svg" role="img" aria-label="BFPRT 5-element columns sorted with median-of-medians x guaranteeing 3n/10 elements smaller and larger">
          <rect width="760" height="230" rx="10" fill="#0f172a"/>
          <text x="20" y="26" fill="#f8fafc" font-size="13" font-weight="bold">BFPRT Grid of 5-Element Sorted Columns: Shaded Upper-Left Quadrant (≥ 3n/10) is Guaranteed ≤ x</text>
          <g transform="translate(45, 44)">
            <!-- 7 columns of 5 elements -->
            <g transform="translate(0, 0)">
              <rect x="0" y="0" width="66" height="26" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
              <rect x="0" y="32" width="66" height="26" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
              <rect x="0" y="64" width="66" height="26" rx="4" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
              <rect x="0" y="96" width="66" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
              <rect x="0" y="128" width="66" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
              <text x="33" y="81" text-anchor="middle" fill="#a7f3d0" font-size="11" font-weight="bold">m₁ ≤ x</text>
            </g>
            <g transform="translate(85, 0)">
              <rect x="0" y="0" width="66" height="26" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
              <rect x="0" y="32" width="66" height="26" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
              <rect x="0" y="64" width="66" height="26" rx="4" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
              <rect x="0" y="96" width="66" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
              <rect x="0" y="128" width="66" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
              <text x="33" y="81" text-anchor="middle" fill="#a7f3d0" font-size="11" font-weight="bold">m₂ ≤ x</text>
            </g>
            <g transform="translate(170, 0)">
              <rect x="0" y="0" width="66" height="26" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
              <rect x="0" y="32" width="66" height="26" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
              <rect x="0" y="64" width="66" height="26" rx="4" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
              <rect x="0" y="96" width="66" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
              <rect x="0" y="128" width="66" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
              <text x="33" y="81" text-anchor="middle" fill="#a7f3d0" font-size="11" font-weight="bold">m₃ ≤ x</text>
            </g>
            <g transform="translate(255, 0)">
              <rect x="0" y="0" width="76" height="26" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
              <rect x="0" y="32" width="76" height="26" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
              <rect x="0" y="64" width="76" height="26" rx="4" fill="#b45309" stroke="#fbbf24" stroke-width="2.5"/>
              <rect x="0" y="96" width="76" height="26" rx="4" fill="#7f1d1d" stroke="#f87171" stroke-width="1.5"/>
              <rect x="0" y="128" width="76" height="26" rx="4" fill="#7f1d1d" stroke="#f87171" stroke-width="1.5"/>
              <text x="38" y="81" text-anchor="middle" fill="#fef3c7" font-size="12" font-weight="bold">x (MoM)</text>
            </g>
            <g transform="translate(350, 0)">
              <rect x="0" y="0" width="66" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
              <rect x="0" y="32" width="66" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
              <rect x="0" y="64" width="66" height="26" rx="4" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
              <rect x="0" y="96" width="66" height="26" rx="4" fill="#7f1d1d" stroke="#f87171" stroke-width="1.5"/>
              <rect x="0" y="128" width="66" height="26" rx="4" fill="#7f1d1d" stroke="#f87171" stroke-width="1.5"/>
              <text x="33" y="81" text-anchor="middle" fill="#fecaca" font-size="11" font-weight="bold">m₅ ≥ x</text>
            </g>
            <g transform="translate(435, 0)">
              <rect x="0" y="0" width="66" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
              <rect x="0" y="32" width="66" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
              <rect x="0" y="64" width="66" height="26" rx="4" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
              <rect x="0" y="96" width="66" height="26" rx="4" fill="#7f1d1d" stroke="#f87171" stroke-width="1.5"/>
              <rect x="0" y="128" width="66" height="26" rx="4" fill="#7f1d1d" stroke="#f87171" stroke-width="1.5"/>
              <text x="33" y="81" text-anchor="middle" fill="#fecaca" font-size="11" font-weight="bold">m₆ ≥ x</text>
            </g>
            <g transform="translate(520, 0)">
              <rect x="0" y="0" width="66" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
              <rect x="0" y="32" width="66" height="26" rx="4" fill="#1e293b" stroke="#475569"/>
              <rect x="0" y="64" width="66" height="26" rx="4" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
              <rect x="0" y="96" width="66" height="26" rx="4" fill="#7f1d1d" stroke="#f87171" stroke-width="1.5"/>
              <rect x="0" y="128" width="66" height="26" rx="4" fill="#7f1d1d" stroke="#f87171" stroke-width="1.5"/>
              <text x="33" y="81" text-anchor="middle" fill="#fecaca" font-size="11" font-weight="bold">m₇ ≥ x</text>
            </g>
          </g>
          <text x="20" y="216" fill="#94a3b8" font-size="12">Green cells (top 3 rows × left half of columns ≥ 3n/10) are ≤ x; Red cells (bottom 3 rows × right half ≥ 3n/10) are ≥ x.</text>
        </svg>

        <div class="mermaid">
flowchart TD
  A["Select k-th Smallest in A[lo..hi]"] --> B["Fast Path: Randomized / Median-of-3 Quickselect"]
  B --> C{"Did Partition Shrink\nSubarray by ≥ 1/8?"}
  C -- "Yes (Common Case)" --> D["Continue Iterative Quickselect Loop\nO(N) Expected (~3.4N cmps)"]
  C -- "No (Adversarial Split Detected)" --> E["Fallback to Deterministic BFPRT\nMedian-of-Medians (5-Columns)\nStrict Worst-Case O(N) Guarantee!"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Why <code>std::nth_element</code> Uses Introselect Instead of Pure BFPRT</div>
          <p>Although BFPRT runs in strict worst-case $O(n)$ time, its constant factor is $\\approx 16n\\text{–}24n$ comparisons and requires recursive median-of-medians passes that touch memory multiple times—making pure BFPRT <strong>slower than sorting the entire array with <code>std::sort</code></strong> up to $n \\approx 10^6$! Consequently, C++ standard libraries (<code>libstdc++</code> and <code>libc++</code>) implement David Musser's <strong>Introselect</strong> (or Alexandrescu's <em>Adaptive Quickselect / Median of Ninthers</em>): it runs standard Median-of-Three Hoare Quickselect in a tight iterative loop ($\approx 3n$ comparisons) and only invokes BFPRT (or Heapselect) if the recursion depth/bad-split counter exceeds a logarithmic threshold.</p>
        </div>

        <h2>Production C++20 Implementation: Iterative 3-Way Quickselect &amp; In-Place BFPRT</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;concepts&gt;
#include &lt;cstddef&gt;
#include &lt;utility&gt;

template &lt;std::totally_ordered T&gt;
void small_insertion_sort(T* a, std::size_t lo, std::size_t hi) noexcept {
    for (std::size_t i = lo + 1; i &lt;= hi; ++i) {
        T v = std::move(a[i]);
        std::size_t j = i;
        while (j &gt; lo &amp;&amp; v &lt; a[j - 1]) {
            a[j] = std::move(a[j - 1]);
            --j;
        }
        a[j] = std::move(v);
    }
}

// Deterministic In-Place BFPRT (Median-of-Medians) with 3-Way Partitioning for Duplicates
template &lt;std::totally_ordered T&gt;
void bfprt_select(T* a, std::size_t lo, std::size_t hi, std::size_t k) noexcept {
    while (hi - lo &gt; 16) {
        const std::size_t n = hi - lo + 1;
        const std::size_t num_groups = n / 5;

        // 1. Sort each group of 5 in-place and swap its median to the front [lo .. lo + num_groups - 1]
        for (std::size_t g = 0; g &lt; num_groups; ++g) {
            const std::size_t g_lo = lo + g * 5;
            small_insertion_sort(a, g_lo, g_lo + 4);
            std::swap(a[lo + g], a[g_lo + 2]);
        }

        // 2. Recursively select the exact median of the group medians at a[lo + num_groups / 2]
        const std::size_t mom_idx = lo + num_groups / 2;
        bfprt_select(a, lo, lo + num_groups - 1, mom_idx);
        const T pivot = a[mom_idx];

        // 3. 3-Way Dutch National Flag Partition around <code>pivot</code> (handles all-equal keys in O(N)!)
        std::size_t lt = lo, i = lo, gt = hi;
        while (i &lt;= gt) {
            if (a[i] &lt; pivot)      std::swap(a[lt++], a[i++]);
            else if (pivot &lt; a[i]) std::swap(a[i], a[gt--]);
            else                   ++i;
        }

        // 4. Tail-loop into whichever region contains target rank k
        if (k &lt; lt) {
            hi = lt - 1;
        } else if (k &gt; gt) {
            lo = gt + 1;
        } else {
            return; // k lies inside [lt .. gt], so a[k] == pivot is in its exact final spot!
        }
    }
    small_insertion_sort(a, lo, hi);
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Why BFPRT Must Use 3-Way Partitioning on Duplicate Keys</div>
          <p>In the classical textbook proof of BFPRT, all elements are assumed to be distinct. If an input array contains $n$ identical elements and you use a 2-way Lomuto partition inside BFPRT, the median-of-medians pivot $x$ is equal to every element, yet 2-way Lomuto places all $n - 1$ equal elements on one side—breaking the $\\le 7n/10$ size bound and degrading BFPRT to $\\Theta(n^2)$! Using <strong>3-way Dutch National Flag partitioning</strong> inside BFPRT and Quickselect guarantees that all elements strictly $< x$ ($\ge 3n/10$ minus duplicates) and strictly $> x$ are separated while all duplicates equal to $x$ are coalesced into $[lt \\dots gt]$ in one linear pass.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Randomized Quickselect recurses on only one side of the partition, shrinking the subarray geometrically to run in Θ(n) expected time (~3.39n comparisons for the median).",
      "BFPRT (Median-of-Medians) partitions elements into groups of 5, sorts each group, and recursively finds the median of those n/5 medians as its pivot.",
      "At least half of the n/5 group medians are <= the Median-of-Medians x, and each contributes 3 elements <= x, guaranteeing at least 3n/10 elements are eliminated on either side.",
      "The recurrence T(n) <= T(n/5) + T(7n/10) + Θ(n) solves to worst-case Θ(n) because 1/5 + 7/10 = 9/10 < 1 (whereas groups of 3 give 1/3 + 2/3 = 1 and degrade to Θ(n log n))."
    ],
    furtherReading: [
      {
        title: "Blum, Floyd, Pratt, Rivest, Tarjan (1973) — Time Bounds for Selection (JCSS)",
        url: "https://doi.org/10.1016/S0022-0000(73)80033-9"
      },
      {
        title: "Hoare (1961) — Algorithm 65: Find (Communications of the ACM)",
        url: "https://doi.org/10.1145/366622.366647"
      },
      {
        title: "CLRS — Introduction to Algorithms (4th Ed.), Chapter 9: Medians and Order Statistics",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      }
    ]
  },
  "external-merge-sort-replacement": {
    title: "External Memory Sorting: K-Way Merge & Replacement Selection",
    video: {
      youtubeId: "CMzf9Az1vl4",
      id: "CMzf9Az1vl4",
      url: "https://www.youtube.com/embed/CMzf9Az1vl4",
      title: "CMU 15-445 Lecture 10: External Merge Sort & K-Way Replacement Aggregation",
      channel: "CMU Database Group (Andy Pavlo)",
      duration: "1:15:30",
      start: 0,
      length: "75m",
      why: "Erik Demaine introduces the Aggarwal-Vitter External-Memory (DAM) I/O model, proves why binary Merge Sort is suboptimal on disk/SSD, and derives the optimal multi-way merge bound Θ((N/B) log_{M/B}(N/B))."
    },
    intuition: "When sorting $100\\text{ GB}$ of records with only $1\\text{ GB}$ of RAM, CPU comparisons are virtually free compared to $4\\text{ KB}$ disk/NVMe block transfers. By merging $K = \\lfloor M / B \\rfloor - 1$ sorted runs simultaneously through a Tournament Loser Tree—and generating initial runs of average length $2M$ via Knuth's Replacement Selection—an entire multi-terabyte dataset sorts in just <em>two</em> sequential disk passes.",
    content: `
      <div class="lesson-content">
        <h2>The Aggarwal-Vitter External-Memory (DAM) Model</h2>
        <p>In the <strong>Disk Access Machine (DAM)</strong> model (Aggarwal &amp; Vitter, 1988), the system has:</p>
        <ul>
          <li>$N$: Total number of records to sort (stored on external disk/NVMe).</li>
          <li>$M$: Number of records that fit in fast internal memory (RAM).</li>
          <li>$B$: Number of records transferred in a single contiguous block I/O ($1 \\le B \\le M/2$, e.g., a $4\\text{ KB}$ or $64\\text{ KB}$ page).</li>
        </ul>
        <p>The cost metric is purely the <strong>number of block I/O transfers</strong> between disk and RAM. Notice why naive binary Merge Sort is disastrous here: a 2-way Merge Sort performs $\\log_2(N/M)$ merge passes over the entire file, costing $2\\frac{N}{B}\\log_2\\!\\left(\\frac{N}{M}\\right)$ block I/Os. Instead, by allocating $K = \\lfloor M / B \\rfloor - 1$ input block buffers ($1$ block buffer per sorted run) and $1$ output block buffer in RAM, <strong>$K$-Way External Merge Sort</strong> merges $K = \\Theta(M/B)$ runs in a single pass—shrinking the logarithm base from $2$ to $M/B$!</p>

        <div class="invariant-box">
          <div class="invariant-title">External Sorting I/O Complexity &amp; Knuth's $2M$ Snowplow Theorem</div>
          <p><strong>1. Optimal I/O Lower &amp; Upper Bound (Aggarwal &amp; Vitter):</strong> External Multi-Way Merge Sort achieves the information-theoretically optimal I/O complexity:</p>
          $$\\text{I/Os} = \\Theta\\!\\left(\\frac{N}{B} \\log_{M/B}\\!\\left(\\frac{N}{B}\\right)\\right)$$
          <p>In practice, with $M = 1\\text{ GB}$ of RAM and $B = 1\\text{ MB}$ read-ahead blocks, the fan-in is $K \\approx 1{,}000$. Thus $(M/B)^2 \\approx 10^6$ initial runs—up to <strong>$1\\text{ PB}$ of data</strong>—can be sorted in just <strong>$1$ run-generation pass + $1$ or $2$ merge passes</strong>!</p>
          <p><strong>2. Replacement Selection ($2M$ Expected Run Length, Knuth TAOCP Vol. 3):</strong> Standard run generation loads $M$ records into RAM, sorts them, and flushes a run of exact length $M$. Can a priority queue of capacity $M$ produce runs <em>longer</em> than $M$? Maintain a min-heap of size $M$ in RAM and track the <code>last_key_output</code>:</p>
          <ul>
            <li>Pop the minimum element $x$ from the heap and write it to the current output run ($\\text{last\\_key} \\leftarrow x$).</li>
            <li>Read the next record $y$ from the input stream. If $y \\ge \\text{last\\_key}$, insert $y$ directly into the active min-heap (it can still belong to the <em>current</em> sorted run!).</li>
            <li>If $y < \\text{last\\_key}$, $y$ is too small for the current run; place $y$ in the "dead space" at the back of the heap array (shrinking the active heap size by 1) to seed the <em>next</em> run.</li>
          </ul>
          <p>By Knuth's <strong>Snowplow Analogy</strong> (modeling a snowplow driving around a circular track of circumference $M$ while snow falls uniformly), for random input keys the steady-state volume swept before the active heap empties is <strong>$2M$ records on average</strong>—cutting the number of initial runs in half!</p>
        </div>

        <div class="simulator-mount" data-sim="sim-external-loser-tree"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Phase / Priority Queue Structure</th>
              <th>Block I/O Transfers</th>
              <th>CPU Comparisons per Record</th>
              <th>Run Length / Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>2-Way Merge Sort on Disk</strong></td>
              <td>$2\\frac{N}{B}\\lceil\\log_2(N/M)\\rceil$</td>
              <td>$\\lceil \\log_2(N/M) \\rceil$</td>
              <td>Suboptimal I/O base $2$</td>
            </tr>
            <tr>
              <td><strong>$K$-Way Merge ($K = M/B - 1$, Binary Heap)</strong></td>
              <td>$2\\frac{N}{B}\\lceil\\log_{M/B}(N/M)\\rceil$</td>
              <td>$\\approx 2 \\log_2 K$ per sift-down</td>
              <td>Optimal I/O; 2 comparisons/level</td>
            </tr>
            <tr>
              <td><strong>$K$-Way Merge (Tournament Loser Tree)</strong></td>
              <td>$2\\frac{N}{B}\\lceil\\log_{M/B}(N/M)\\rceil$</td>
              <td><strong>Exactly $\\lceil \\log_2 K \\rceil$</strong> ($2\\times$ fewer!)</td>
              <td>Register-friendly bottom-up path</td>
            </tr>
            <tr>
              <td><strong>Replacement Selection Run Generation</strong></td>
              <td>$2\\frac{N}{B}$ (1 Read + 1 Write)</td>
              <td>$\\log_2 M$</td>
              <td>Avg run length $2M$ (random), $\\infty$ (sorted)</td>
            </tr>
          </tbody>
        </table>

        <svg viewBox="0 0 760 220" class="lesson-svg" role="img" aria-label="K-Way External Merge using K Input Buffers, a Tournament Loser Tree, and 1 Output Buffer in RAM">
          <rect width="760" height="220" rx="10" fill="#0f172a"/>
          <text x="20" y="26" fill="#f8fafc" font-size="13" font-weight="bold">K-Way External Merge Architecture in RAM (Capacity M = (K + 1) × Block Size B)</text>
          <g transform="translate(25, 44)">
            <!-- Disk Runs -->
            <rect x="0" y="0" width="145" height="36" rx="4" fill="#1e293b" stroke="#38bdf8"/>
            <text x="72" y="22" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">Run 1 (Disk Blocks)</text>
            <rect x="0" y="48" width="145" height="36" rx="4" fill="#1e293b" stroke="#10b981"/>
            <text x="72" y="70" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">Run 2 (Disk Blocks)</text>
            <rect x="0" y="96" width="145" height="36" rx="4" fill="#1e293b" stroke="#f59e0b"/>
            <text x="72" y="118" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">Run K (Disk Blocks)</text>

            <!-- Input Buffers -->
            <rect x="185" y="0" width="120" height="36" rx="4" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="245" y="22" text-anchor="middle" fill="#e0f2fe" font-size="11">In-Buf 1 (Size B)</text>
            <rect x="185" y="48" width="120" height="36" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
            <text x="245" y="70" text-anchor="middle" fill="#d1fae5" font-size="11">In-Buf 2 (Size B)</text>
            <rect x="185" y="96" width="120" height="36" rx="4" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="245" y="118" text-anchor="middle" fill="#fef3c7" font-size="11">In-Buf K (Size B)</text>

            <!-- Loser Tree -->
            <rect x="345" y="14" width="185" height="104" rx="8" fill="#311042" stroke="#c084fc" stroke-width="2"/>
            <text x="437" y="44" text-anchor="middle" fill="#f3e8ff" font-size="13" font-weight="bold">Tournament Loser Tree</text>
            <text x="437" y="68" text-anchor="middle" fill="#d8b4fe" font-size="11">Internal Nodes Store LOSERS</text>
            <text x="437" y="88" text-anchor="middle" fill="#a855f7" font-size="11">Winner Bubble Up: log₂(K) cmps</text>
            <text x="437" y="106" text-anchor="middle" fill="#6ee7b7" font-size="11" font-weight="bold">(No sibling comparisons!)</text>

            <!-- Output Buffer -->
            <rect x="570" y="36" width="140" height="60" rx="6" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
            <text x="640" y="62" text-anchor="middle" fill="#6ee7b7" font-size="12" font-weight="bold">Out-Buf (Size B)</text>
            <text x="640" y="82" text-anchor="middle" fill="#a7f3d0" font-size="11">Sequential Disk Flush</text>
          </g>
          <text x="25" y="200" fill="#94a3b8" font-size="12">Why a Loser Tree beats a Binary Min-Heap for K-way merging: updating a leaf in a Loser Tree only compares the new key against the stored parent loser (1 cmp/level vs 2 cmps/level in a binary heap).</text>
        </svg>

        <h2>Why Tournament Loser Trees Beat Binary Heaps in $K$-Way Merging</h2>
        <p>When merging $K$ sorted runs, every step extracts the global minimum from run $r^*$ and replaces it with the next key from run $r^*$. In a standard binary min-heap, sifting the replacement element down requires comparing the two children against each other and then against the parent—<strong>$2 \\log_2 K$ comparisons per element</strong>.</p>
        <p>In Knuth's <strong>Tournament Loser Tree</strong>, the $K$ current run heads sit at the leaves of a complete binary tree, while each internal node stores the <strong>loser</strong> of the match played at that node (and the overall winner is stored in <code>tree[0]</code> above the root). When the winner from leaf $r^*$ is replaced by a new element, we walk strictly upward from leaf $r^*$ to the root: at each ancestor node, the previous winner of the <em>other</em> subtree is already sitting right there as the stored loser! Thus we perform <strong>exactly $1$ comparison per level ($\log_2 K$ total)</strong> and never touch sibling nodes in memory.</p>

        <div class="mermaid">
flowchart LR
  A["Pop Overall Winner\nfrom tree[0] (Run r*)"] --> B["Load Next Record x\nfrom Run r*"]
  B --> C["Walk p = (r* + K)/2 up to 1:\nIf tree[p] < x, swap(x, tree[p])\n(Loser stays at tree[p], Winner x rises!)"]
  C --> D["Store Final Winner\ninto tree[0]"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Double Buffering, NVMe Queue Depth &amp; Cache-Oblivious Funnel Sort</div>
          <p>On modern NVMe SSDs capable of $7\\text{ GB/s}$ sequential bandwidth, a single synchronous read blocks the CPU while waiting ~50 $\\mu$s for PCIe completion. Production external sorters (such as PostgreSQL's <code>tuplesort.c</code>, RocksDB SSTable compaction, and ClickHouse external merge) allocate <strong>$2K$ input buffers and $2$ output buffers (Double Buffering / <code>io_uring</code> async I/O)</strong> so the CPU merges from the active buffer set while the NVMe DMA engine prefetches the next block for whichever run will exhaust its buffer soonest (predicted by inspecting the <em>last key</em> of each in-memory block!). Furthermore, Frigo et al.'s <strong>Cache-Oblivious Funnel Sort</strong> achieves the optimal $\\Theta\\!\\left(\\frac{N}{B}\\log_{M/B}\\frac{N}{B}\\right)$ bound across L1, L2, L3, and Disk simultaneously without even knowing $M$ or $B$ by recursively arranging $\\sqrt{N}$-way mergers in a van Emde Boas tree layout.</p>
        </div>

        <h2>Production C++20 Implementation: Tournament Loser Tree $K$-Way Merger &amp; Replacement Selection</h2>
        <pre><code class="language-cpp">#include &lt;concepts&gt;
#include &lt;cstddef&gt;
#include &lt;limits&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

// Tournament Loser Tree for K-Way Merging in exactly ceil(log2 K) comparisons per output
template &lt;std::totally_ordered T&gt;
class LoserTree {
public:
    explicit LoserTree(const std::vector&lt;T&gt;&amp; initial_heads, T sentinel_max)
        : k_(1), sentinel_(sentinel_max) {
        while (k_ &lt; initial_heads.size()) k_ &lt;&lt;= 1;
        keys_.assign(k_, sentinel_);
        for (std::size_t i = 0; i &lt; initial_heads.size(); ++i) {
            keys_[i] = initial_heads[i];
        }
        tree_.assign(k_, 0);
        // Initialize by replaying matches from all leaves
        std::vector&lt;std::size_t&gt; winners(2 * k_, 0);
        for (std::size_t i = 0; i &lt; k_; ++i) winners[k_ + i] = i;
        for (std::size_t p = k_ - 1; p &gt;= 1; --p) {
            std::size_t left_w  = winners[2 * p];
            std::size_t right_w = winners[2 * p + 1];
            if (keys_[right_w] &lt; keys_[left_w]) {
                tree_[p]   = left_w;  // Loser stays in tree_[p]
                winners[p] = right_w; // Winner advances
            } else {
                tree_[p]   = right_w;
                winners[p] = left_w;
            }
        }
        tree_[0] = winners[1]; // Overall champion stored at tree_[0]
    }

    std::size_t winner_run() const noexcept { return tree_[0]; }
    const T&amp; winner_key() const noexcept { return keys_[tree_[0]]; }

    // Replace the head of the winning run and replay up to root in log2(K) comparisons
    void replay(std::size_t run_idx, T next_key) noexcept {
        keys_[run_idx] = std::move(next_key);
        std::size_t champ = run_idx;
        for (std::size_t p = (k_ + run_idx) &gt;&gt; 1; p &gt;= 1; p &gt;&gt;= 1) {
            // If current champ is larger than the stored loser at tree_[p], they swap roles!
            if (keys_[tree_[p]] &lt; keys_[champ]) {
                std::swap(champ, tree_[p]);
            }
        }
        tree_[0] = champ;
    }

private:
    std::size_t k_;
    T sentinel_;
    std::vector&lt;T&gt; keys_;
    std::vector&lt;std::size_t&gt; tree_; // tree_[0] = overall winner, tree_[1..k-1] = internal losers
};

// Multi-way merge of K sorted vectors using LoserTree
template &lt;std::totally_ordered T&gt;
std::vector&lt;T&gt; k_way_merge(const std::vector&lt;std::vector&lt;T&gt;&gt;&amp; runs, T sentinel_max) {
    const std::size_t k = runs.size();
    if (k == 0) return {};

    std::vector&lt;std::size_t&gt; pos(k, 0);
    std::vector&lt;T&gt; heads(k, sentinel_max);
    std::size_t total = 0;
    for (std::size_t r = 0; r &lt; k; ++r) {
        total += runs[r].size();
        if (!runs[r].empty()) heads[r] = runs[r][0];
    }

    LoserTree&lt;T&gt; lt(heads, sentinel_max);
    std::vector&lt;T&gt; out;
    out.reserve(total);

    for (std::size_t step = 0; step &lt; total; ++step) {
        const std::size_t r = lt.winner_run();
        out.push_back(lt.winner_key());
        ++pos[r];
        T next_val = (pos[r] &lt; runs[r].size()) ? runs[r][pos[r]] : sentinel_max;
        lt.replay(r, std::move(next_val));
    }
    return out;
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Choosing Block Size $B$: Don't Make $K$ So Large That $B$ Becomes Tiny!</div>
          <p>A classic systems mistake is setting $K = 50{,}000$ runs inside $M = 200\\text{ MB}$ of RAM, which shrinks each run's input buffer to $B = 4\\text{ KB}$. On HDDs or cloud network block storage (EBS/GCS), reading $4\\text{ KB}$ random blocks across $50{,}000$ streams incurs millisecond seek/request latency per block, destroying throughput! In practice, size each buffer $B$ to at least $1\\text{ MB} \\text{–} 4\\text{ MB}$ so sequential read bandwidth saturates the storage bus, even if that means doing 2 merge passes of fan-in $K = 128$ instead of 1 pass of fan-in $K = 16{,}384$.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "In the External-Memory (DAM) model with RAM size M and block size B, K-way Merge Sort achieves the optimal I/O bound Θ((N/B) log_{M/B}(N/B)) by merging K = Θ(M/B) runs simultaneously.",
      "Knuth's Replacement Selection uses a size-M min-heap to stream records >= the last output key into the active run, producing sorted runs of expected length 2M on random inputs.",
      "A Tournament Loser Tree stores the loser at each internal node and bubbles the winner upward, performing exactly log_2(K) comparisons per output (half the 2 log_2(K) comparisons of a binary heap).",
      "Double buffering with large block sizes (B >= 1 MB) overlaps CPU tournament merging with asynchronous NVMe/disk prefetching."
    ],
    furtherReading: [
      {
        title: "Knuth — The Art of Computer Programming, Vol. 3: Sorting and Searching (§5.4.1 Multiway Merging and Replacement Selection)",
        url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html"
      },
      {
        title: "Frigo, Leiserson, Prokop, Ramachandran (1999) — Cache-Oblivious Algorithms (Funnel Sort)",
        url: "https://doi.org/10.1109/SFFCS.1999.814600"
      },
      {
        title: "MIT 6.851 Lecture Notes — Memory Hierarchy & External-Memory Sorting",
        url: "https://ocw.mit.edu/"
      }
    ]
  },

  "case-timsort-pdqsort": {
    title: "Production Case Study: Python/V8 TimSort (Galloping & Run Invariants) vs Rust pdqsort",
    video: {
      youtubeId: "emeME__917E",
      id: "emeME__917E",
      url: "https://www.youtube.com/embed/emeME__917E",
      title: "TimSort: Adaptive Natural Run Merging, Minrun & Galloping Mode",
      channel: "Gaurav Sen",
      duration: "15:18",
      start: 0,
      length: "15m",
      why: "Explains how production standard-library sorts exploit natural sorted runs, branchless partitioning, and cache-friendly merge buffers to outperform textbook sorts by 3-10x on real-world data."
    },
    intuition: "Real-world arrays are almost never uniform random noise—they contain ascending timestamps, appended logs, or low-cardinality status codes. <strong>TimSort</strong> (Python, Java, V8) harvests natural monotonic runs, maintains a Fibonacci-like run stack invariant, and switches to exponential 'galloping' search when one run dominates another; <strong>pdqsort</strong> (Rust, Go) augments Introsort with branchless block partitioning and adaptive pattern-busting to achieve $O(N)$ best case and strict $O(N \\log N)$ worst case in $O(\\log N)$ space.",
    content: `
      <div class="lesson-content">
        <h2>Part I: TimSort (Tim Peters, 2002) — Adaptive Stable Merging</h2>
        <p>Designed by Tim Peters in 2002 for CPython (and subsequently adopted by Java <code>Arrays.sort(Object[])</code>, Android, and V8's <code>Array.prototype.sort</code>), <strong>TimSort</strong> is a natural adaptive Merge Sort built around four hardware-tuned mechanisms:</p>
        <ol>
          <li><strong>Natural Run Detection &amp; Reverse-Run Inversion:</strong> A linear scan identifies the longest prefix starting at index $i$ that is either non-decreasing ($A[0] \\le A[1] \\le \\dots$) or <em>strictly</em> decreasing ($A[0] > A[1] > \\dots$). Why strictly decreasing? Reversing a non-strictly decreasing run ($A[0] \\ge A[1]$) in place would flip equal keys and violate stability!</li>
          <li><strong>Minimum Run Length (<code>minrun</code> $\\in [32, 64]$):</strong> If a natural run is shorter than <code>minrun</code>, TimSort extends it to length <code>minrun</code> using <strong>Binary Insertion Sort</strong>. Furthermore, <code>minrun</code> is chosen so that $N / \\text{minrun}$ is a power of $2$ (or slightly less than a power of $2$), ensuring the final top-level merges are perfectly balanced!</li>
          <li><strong>The Run Stack Balance Invariants:</strong> Active runs are pushed onto a stack. To ensure merges happen between runs of comparable size while bounding stack depth by $O(\\log N)$, TimSort maintains two invariants on the top three run lengths $X, Y, Z$ (where $Z$ is on top of the stack):
            $$X > Y + Z \\quad \\text{and} \\quad Y > Z$$
            Notice this is the exact recurrence of the <strong>Fibonacci numbers</strong>! If either invariant is violated, $Y$ is merged with $\\min(X, Z)$.</li>
          <li><strong>Galloping Mode (<code>MIN_GALLOP = 7</code>):</strong> During a two-finger merge of runs $A$ and $B$, if one run wins $7$ times in a row, TimSort switches from $1$-by-$1$ linear comparison to <strong>Galloping (Exponential + Binary Search)</strong>: it probes offsets $1, 3, 7, 15, 2^k - 1$ to find the entire contiguous chunk of $A$ smaller than $B[j]$ in $O(\\log m)$ comparisons and copies the whole chunk via a single vectorized <code>memmove</code>!</li>
        </ol>

        <div class="invariant-box">
          <div class="invariant-title">The 2015 TimSort Stack-Overflow Bug (De Gouw et al. &amp; Powersort Replacement)</div>
          <p>For 13 years, CPython and Java allocated a fixed 85-slot run stack assuming the condition <code>X &gt; Y + Z &amp;&amp; Y &gt; Z</code> forced run lengths on the stack to grow at least as fast as Fibonacci numbers. In 2015, Stijn de Gouw et al. used formal verification (KeY) to prove that merging $Y$ with $X$ can break the invariant for the element <em>below</em> $X$ ($W \\le X_{\\text{new}} + Z$), allowing an adversarial input to overflow the fixed run stack! Modern implementations either check 4 stack elements ($W, X, Y, Z$) or replace the stack heuristic entirely with Munro &amp; Wild's <strong>Powersort (2018)</strong> (now standard in CPython 3.11+ and PyPy), which assigns each boundary a binary tree node power in $O(1)$ bit operations (<code>__builtin_clz(mid_A ^ mid_B)</code>) and guarantees near-optimal merge entropy with a trivially provable $\\lceil \\log_2 N \\rceil + 1$ stack bound.</p>
        </div>

        <h2>Part II: Pattern-Defeating Quicksort (<code>pdqsort</code>, Orson Peters 2021)</h2>
        <p>When stability is not required (sorting primitive slices in Rust's <code>slice::sort_unstable</code> or Go 1.19+'s <code>slices.Sort</code>), allocating $O(N)$ merge space is undesirable. Orson Peters's <strong>pdqsort</strong> upgrades Musser's Introsort into an adaptive, branchless $O(1)$-auxiliary-space engine:</p>
        <ul>
          <li><strong>Adaptive $O(N)$ Fast Paths on Pre-Sorted / Equal Data:</strong> When a partition moves <em>zero</em> elements (meaning no keys crossed the pivot), the subarray might already be sorted! <code>pdqsort</code> runs a bounded speculative Insertion Sort (<code>partial_insertion_sort</code> allowing up to 8 misplaced elements)—finishing in $O(N)$ time on sorted and nearly-sorted arrays.</li>
          <li><strong>3-Way Left-Partitioning on Duplicates:</strong> If the chosen pivot equals the predecessor element from the parent partition ($v == A[lo - 1]$), all keys strictly less than $v$ were already partitioned to the left. A single PartitionEqual pass packs all keys equal to $v$ and skips them!</li>
          <li><strong>Branchless BlockQuicksort + Pattern Busting:</strong> Uses 64-element offset blocks to avoid branch mispredictions when types have branchless comparators, and deterministically shuffles endpoint elements when a highly unbalanced split ($< N/8$) occurs before falling back to Heapsort after $\\log_2 N$ bad splits.</li>
        </ul>

        <div class="simulator-mount" data-sim="sim-timsort-pdqsort-runs"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Property</th>
              <th>TimSort / Powersort (Python, V8, Java)</th>
              <th><code>pdqsort</code> (Rust <code>sort_unstable</code>, Go <code>slices.Sort</code>)</th>
              <th>Classic Introsort (C++ <code>std::sort</code>)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Worst-Case Time</strong></td>
              <td>$\\Theta(N \\log N)$</td>
              <td>$\\Theta(N \\log N)$ (Heapsort fallback)</td>
              <td>$\\Theta(N \\log N)$ (Heapsort fallback)</td>
            </tr>
            <tr>
              <td><strong>Sorted / Reverse / Equal Time</strong></td>
              <td>$\\Theta(N)$ ($N-1$ comparisons!)</td>
              <td>$\\Theta(N)$ (speculative insertion + eq partition)</td>
              <td>$\\Theta(N \\log N)$</td>
            </tr>
            <tr>
              <td><strong>$k$ Distinct Keys Time</strong></td>
              <td>$O(N \\log N)$ (or $O(N \\log k)$ via galloping)</td>
              <td>$\\Theta(N \\log k)$ (entropy-optimal)</td>
              <td>$\\Theta(N \\log N)$</td>
            </tr>
            <tr>
              <td><strong>Auxiliary Memory</strong></td>
              <td>Up to $N/2$ pointers ($O(N)$ worst, $O(1)$ sorted)</td>
              <td>$O(\\log N)$ stack frames ($O(1)$ heap)</td>
              <td>$O(\\log N)$ stack frames</td>
            </tr>
            <tr>
              <td><strong>Stable?</strong></td>
              <td><strong>Yes</strong> (Mandatory for object/UI sorts)</td>
              <td><strong>No</strong> (Unstable primitive speed)</td>
              <td><strong>No</strong></td>
            </tr>
          </tbody>
        </table>

        <svg viewBox="0 0 760 210" class="lesson-svg" role="img" aria-label="TimSort Galloping Merge vs Standard One-by-One Merge">
          <rect width="760" height="210" rx="10" fill="#0f172a"/>
          <text x="20" y="26" fill="#f8fafc" font-size="13" font-weight="bold">TimSort Galloping Mode: Triggered When One Run Wins MIN_GALLOP = 7 Consecutive Comparisons</text>
          <g transform="translate(25, 48)">
            <text x="0" y="16" fill="#38bdf8" font-size="12" font-weight="bold">Run A: [10, 11, 12, 13, 14, 15, 16, 17, ..., 48, 85, 90]</text>
            <text x="390" y="16" fill="#f59e0b" font-size="12" font-weight="bold">Run B: [50, 52, 55, ...]</text>

            <!-- Exponential probe boxes -->
            <rect x="0" y="30" width="60" height="38" rx="4" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
            <text x="30" y="54" text-anchor="middle" fill="#e0f2fe" font-size="12">+1 (11)</text>
            <rect x="75" y="30" width="60" height="38" rx="4" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
            <text x="105" y="54" text-anchor="middle" fill="#e0f2fe" font-size="12">+3 (13)</text>
            <rect x="165" y="30" width="60" height="38" rx="4" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
            <text x="195" y="54" text-anchor="middle" fill="#e0f2fe" font-size="12">+7 (17)</text>
            <rect x="275" y="30" width="70" height="38" rx="4" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
            <text x="310" y="54" text-anchor="middle" fill="#e0f2fe" font-size="12">+15 (25)</text>
            <rect x="405" y="30" width="75" height="38" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
            <text x="442" y="54" text-anchor="middle" fill="#6ee7b7" font-size="12">+31 (41)</text>
            <rect x="545" y="30" width="90" height="38" rx="4" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
            <text x="590" y="54" text-anchor="middle" fill="#fecaca" font-size="12">+63 (85 &gt; 50)</text>

            <path d="M 442 72 Q 516 112 590 72" fill="none" stroke="#fbbf24" stroke-width="2"/>
            <text x="516" y="114" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="bold">Binary Search in [offset+31 .. offset+63]</text>
          </g>
          <text x="25" y="182" fill="#34d399" font-size="12.5" font-weight="bold">Result: Locates all 39 elements &lt; 50 in just 12 comparisons, then copies the entire block via a single SIMD memmove!</text>
        </svg>

        <div class="mermaid">
flowchart TD
  A["pdqsort Partition Step"] --> B{"Was Pivot Equal to\nLeft Neighbor A[lo-1]?"}
  B -- "Yes" --> C["partition_equal(lo, hi):\nPack all == pivot & advance lo in O(N)"]
  B -- "No" --> D["Branchless Block Partition\nTrack: Was already partitioned (0 swaps)?"]
  D --> E{"0 Swaps & Balanced Split?"}
  E -- "Yes" --> F["partial_insertion_sort (≤ 8 moves):\nFinishes in O(N) on sorted/nearly-sorted!"]
  E -- "No" --> G{"Bad Split (< N/8)?"}
  G -- "Yes" --> H["Decrement bad_allowed; Shuffle Endpoints\nIf bad_allowed == 0 → Heapsort O(N log N)"]
  G -- "No" --> I["Recurse on Left, Loop on Right"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Why TimSort Only Allocates <code>min(|A|, |B|)</code> Temp Buffer Space</div>
          <p>When merging an adjacent run $A$ of length $10{,}000$ with a run $B$ of length $400$, copying both $A$ and $B$ into a temporary buffer would waste memory bandwidth. TimSort copies <strong>only the smaller run</strong> into temporary storage: if $|A| \\le |B|$, it copies $A$ to <code>tmp</code> and merges left-to-right into $A$'s vacated space; if $|B| < |A|$, it copies $B$ to <code>tmp</code> and merges <strong>right-to-left</strong> starting from the end of $B$! Combined with galloping boundary trimming (trimming elements of $A$ already smaller than $B[0]$ and elements of $B$ already larger than $A[\\text{last}]$ before copying anything), TimSort often allocates only a few kilobytes of L1-resident scratch space.</p>
        </div>

        <h2>Production C++20 Implementation: Galloping Search (<code>gallop_left</code> / <code>gallop_right</code>) &amp; Speculative Insertion</h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;concepts&gt;
#include &lt;cstddef&gt;
#include &lt;utility&gt;

// TimSort's <code>gallop_right</code>: Exponential + Binary search for the first index k in a[0..n-1]
// where key &lt; a[k] (so all elements in a[0..k-1] are &lt;= key, preserving stability).
template &lt;std::totally_ordered T&gt;
std::size_t gallop_right(const T&amp; key, const T* a, std::size_t n, std::size_t hint = 0) noexcept {
    std::size_t last_ofs = 0;
    std::size_t ofs = 1;

    if (key &lt; a[hint]) {
        // Gallop left from hint
        const std::size_t max_ofs = hint + 1;
        while (ofs &lt; max_ofs &amp;&amp; key &lt; a[hint - ofs]) {
            last_ofs = ofs;
            ofs = (ofs &lt;&lt; 1) + 1;
        }
        if (ofs &gt; max_ofs) ofs = max_ofs;
        std::size_t tmp = last_ofs;
        last_ofs = hint - ofs;
        ofs = hint - tmp;
    } else {
        // Gallop right from hint: offsets 1, 3, 7, 15, ...
        const std::size_t max_ofs = n - hint;
        while (ofs &lt; max_ofs &amp;&amp; !(key &lt; a[hint + ofs])) {
            last_ofs = ofs;
            ofs = (ofs &lt;&lt; 1) + 1;
        }
        if (ofs &gt; max_ofs) ofs = max_ofs;
        last_ofs += hint;
        ofs += hint;
    }

    // Standard half-open binary search inside the bracketed window (last_ofs, ofs]
    std::size_t lo = last_ofs;
    std::size_t hi = ofs;
    while (lo &lt; hi) {
        const std::size_t mid = lo + ((hi - lo) &gt;&gt; 1);
        if (key &lt; a[mid]) hi = mid;
        else              lo = mid + 1;
    }
    return lo;
}

// pdqsort's Speculative Partial Insertion Sort: sorts in O(N) if &lt;= 8 elements are out of order,
// or aborts immediately in O(1) once 8 inversions are exceeded!
template &lt;std::totally_ordered T&gt;
bool partial_insertion_sort(T* first, T* last) noexcept {
    if (last - first &lt;= 1) return true;
    constexpr int MAX_STEPS = 8;
    int steps = 0;

    for (T* cur = first + 1; cur != last; ++cur) {
        if (*cur &lt; *(cur - 1)) {
            if (++steps &gt; MAX_STEPS) return false; // Abort early: array is not nearly sorted
            T val = std::move(*cur);
            T* j = cur;
            do {
                *j = std::move(*(j - 1));
                --j;
            } while (j != first &amp;&amp; val &lt; *(j - 1));
            *j = std::move(val);
        }
    }
    return true;
}</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">When Galloping Hurts: Adaptive <code>min_gallop</code> Adjustment</div>
          <p>On uniformly random data, galloping performs $\\approx 2\\log_2 k$ comparisons to advance just $k = 1$ or $2$ elements—more comparisons than a simple linear merge! To prevent galloping from slowing down random inputs, TimSort dynamically adjusts its threshold <code>min_gallop</code>: every time galloping succeeds in copying at least <code>MIN_GALLOP = 7</code> elements, <code>min_gallop</code> is decremented by $1$ (making re-entry into galloping easier); every time galloping exits early because both runs failed to yield a block of $\\ge 7$ elements, <code>min_gallop</code> is <em>incremented</em> by $1$, smoothly disabling galloping on noisy data.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "TimSort exploits real-world sorted structure by identifying natural ascending or strictly-descending runs, padding short runs to minrun ∈ [32, 64] via Binary Insertion Sort.",
      "To preserve sorting stability, descending runs must be strictly decreasing (A[i] > A[i+1]) before being reversed in-place.",
      "TimSort's stack invariant (X > Y + Z and Y > Z, upgraded to 4-element check or Powersort after the 2015 bug) guarantees balanced merges and O(log N) stack space, while Galloping mode accelerates skewed merges via exponential search + block memmove.",
      "Rust's pdqsort combines branchless BlockQuicksort, speculative partial_insertion_sort (<= 8 moves), and equal-key left partitioning to achieve O(N) adaptive best-case and O(N log N) worst-case time in O(log N) space."
    ],
    furtherReading: [
      {
        title: "Tim Peters (2002) — Original Timsort Design Specification (CPython listsort.txt)",
        url: "https://github.com/python/cpython/blob/main/Objects/listsort.txt"
      },
      {
        title: "Orson Peters (2021) — Pattern-Defeating Quicksort (pdqsort)",
        url: "https://arxiv.org/abs/2106.05123"
      },
      {
        title: "V8 Engine Blog — Getting Things Sorted in V8 (Torque TimSort Implementation)",
        url: "https://v8.dev/blog/array-sort"
      }
    ]
  },

  "build-hybrid-introsort-timsort": {
    title: "Build Lab: Hybrid Adaptive Sort (Run Detection + Insertion + Galloping Merge)",
    video: {
      youtubeId: "Kg4bqzAqRBM",
      title: "MIT 6.006 Lecture 3: Insertion Sort & Merge Sort Engineering",
      channel: "MIT OpenCourseWare",
      duration: "50:31",
      start: 2100,
      length: 750,
      why: "Synthesizes insertion base cases, run invariants, and auxiliary buffer reuse into a cohesive hybrid sorting architecture."
    },
    intuition: "In this build lab, you will assemble a production-grade <strong>Hybrid Adaptive Stable Sort</strong> from scratch—combining strict-descending run reversal, binary insertion sort to extend short runs to <code>minrun</code>, Powersort/TimSort stack invariants, and galloping-assisted smaller-half buffer merging.",
    content: `
      <div class="lesson-content">
        <h2>Lab Architecture &amp; Design Specification</h2>
        <p>Textbook sorting algorithms optimize for a single regime: Insertion Sort wins for $N \\le 32$, Merge Sort guarantees stability and $\\Theta(N \\log N)$ worst-case comparisons, and Exponential Galloping wins when merging clustered runs. In this lab (corresponding to the interactive workbench <code>build-hybrid-introsort-timsort</code>), we engineer a self-contained C++20 <code>HybridAdaptiveSort</code> engine that unifies all four stages:</p>
        <ol>
          <li><strong>Stage 1 — Dynamic <code>compute_minrun(n)</code>:</strong> Shifts $n$ right until $n \\in [32, 64)$, setting the lowest bit to $1$ if any shifted-out bit was $1$, so $\\lceil N / \\text{minrun} \\rceil$ is close to or slightly below a power of two.</li>
          <li><strong>Stage 2 — Stability-Safe Run Scanner (<code>count_run_and_make_ascending</code>):</strong> Scans from <code>lo</code>: if $A[lo+1] < A[lo]$, continues scanning while $A[i] < A[i-1]$ (strictly descending) and reverses the slice in-place; otherwise scans while $A[i] \\ge A[i-1]$ (non-decreasing).</li>
          <li><strong>Stage 3 — Binary Insertion Extension:</strong> If the natural run length is $< \\text{minrun}$, uses Binary Insertion Sort starting at the end of the already-sorted prefix <code>lo + run_len</code> to extend the run to $\\min(n - lo, \\text{minrun})$.</li>
          <li><strong>Stage 4 — Smaller-Half Galloping Merge &amp; 4-Condition Stack Collapse:</strong> Maintains the corrected 4-condition TimSort invariant (De Gouw et al. fix) and merges adjacent runs by copying only the smaller run into a reusable scratch buffer.</li>
        </ol>

        <div class="invariant-box">
          <div class="invariant-title">The Corrected 4-Condition Run Stack Invariant</div>
          <p>Let the run stack hold $s$ runs with lengths $L[0], L[1], \\dots, L[s-1]$ from bottom to top. After pushing a new run, we repeatedly merge until <strong>all three</strong> of the following conditions hold (preventing the 2015 TimSort bug):</p>
          <ol>
            <li>If $s \\ge 3$: $L[s-3] > L[s-2] + L[s-1]$</li>
            <li>If $s \\ge 4$: $L[s-4] > L[s-3] + L[s-2]$ (the De Gouw fix checking one level deeper!)</li>
            <li>If $s \\ge 2$: $L[s-2] > L[s-1]$</li>
          </ol>
          <p>Whenever any condition fails, we merge run $s-2$ with whichever of $s-3$ or $s-1$ is shorter.</p>
        </div>

        <div class="simulator-mount" data-sim="sim-timsort-pdqsort-runs"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Input Distribution</th>
              <th>Comparisons</th>
              <th>Element Moves</th>
              <th>Scratch Memory Used</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Already Ascending ($I(A) = 0$)</strong></td>
              <td>$N - 1$</td>
              <td>$0$</td>
              <td>$0$ bytes</td>
            </tr>
            <tr>
              <td><strong>Strictly Descending</strong></td>
              <td>$N - 1$</td>
              <td>$N$ (single in-place reversal)</td>
              <td>$0$ bytes</td>
            </tr>
            <tr>
              <td><strong>$k$ Pre-Sorted Runs Appended</strong></td>
              <td>$O(N \\log k)$ (gallop trimmed)</td>
              <td>$O(N \\log k)$</td>
              <td>$\\le N / 2$ elements</td>
            </tr>
            <tr>
              <td><strong>Uniform Random Permutation</strong></td>
              <td>$\\approx N \\log_2 N$</td>
              <td>$\\approx 1.5 N \\log_2 N$</td>
              <td>$\\le N / 2$ elements</td>
            </tr>
          </tbody>
        </table>

        <svg viewBox="0 0 760 200" class="lesson-svg" role="img" aria-label="Smaller-half merge left vs merge right in TimSort">
          <rect width="760" height="200" rx="10" fill="#0f172a"/>
          <text x="20" y="26" fill="#f8fafc" font-size="13" font-weight="bold">Boundary-Trimmed Smaller-Half Merge: Trim Already-In-Place Ends Before Copying</text>
          <g transform="translate(20, 44)">
            <rect x="0" y="0" width="120" height="44" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
            <text x="60" y="26" text-anchor="middle" fill="#6ee7b7" font-size="12" font-weight="bold">A_prefix ≤ B[0]</text>

            <rect x="126" y="0" width="180" height="44" rx="5" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
            <text x="216" y="26" text-anchor="middle" fill="#e0f2fe" font-size="12" font-weight="bold">Active Run A' (Copy to tmp)</text>

            <rect x="312" y="0" width="260" height="44" rx="5" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
            <text x="442" y="26" text-anchor="middle" fill="#fef3c7" font-size="12" font-weight="bold">Active Run B' (Merge in-place)</text>

            <rect x="578" y="0" width="142" height="44" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
            <text x="649" y="26" text-anchor="middle" fill="#6ee7b7" font-size="12" font-weight="bold">B_suffix ≥ A[last]</text>
          </g>
          <text x="20" y="122" fill="#34d399" font-size="12.5" font-weight="bold">1. Trim Prefix: gallop_right(B[0], A) skips all leading elements of A already ≤ B[0] (0 moves!)</text>
          <text x="20" y="146" fill="#34d399" font-size="12.5" font-weight="bold">2. Trim Suffix: gallop_left(A'[last], B) skips all trailing elements of B already ≥ A'[last] (0 moves!)</text>
          <text x="20" y="170" fill="#38bdf8" font-size="12">3. Copy ONLY min(|A'|, |B'|) into scratch buffer and merge into the remaining window!</text>
        </svg>

        <div class="mermaid">
flowchart LR
  A["Scan Natural Run\nReverse if strictly <"] --> B["Extend to minrun\nvia Binary Insertion"]
  B --> C["Push Run [base, len]\nto Run Stack"]
  C --> D{"4-Condition Stack\nInvariant Holds?"}
  D -- "No" --> E["Trim Ends via Gallop\nMerge Smaller Run via tmp"]
  E --> D
  D -- "Yes" --> F["Advance to Next Run"]
        </div>

        <div class="hardware-box">
          <div class="hardware-title">Hardware Reality: Why Binary Insertion Sort Beats Linear Insertion Sort for <code>minrun</code> Extension</div>
          <p>When extending a natural run of length $r$ up to $\\text{minrun} \\in [32, 64]$, the first $r$ elements are <em>already sorted</em>. Using binary search to locate the insertion point for element $i$ takes at most $\\lceil \\log_2 64 \\rceil = 6$ comparisons (instead of up to 64 in linear Insertion Sort)—a crucial win when comparing composite structs, strings, or user-defined comparator closures—while moving the suffix via <code>std::move_backward</code> compiles to a single vectorized <code>memmove</code> over L1-resident cache lines.</p>
        </div>

        <h2>Complete From-Scratch C++20 Implementation: <code>HybridAdaptiveSort</code></h2>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;concepts&gt;
#include &lt;cstddef&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

template &lt;std::totally_ordered T&gt;
class HybridAdaptiveSort {
public:
    static void sort(std::vector&lt;T&gt;&amp; a) {
        const std::size_t n = a.size();
        if (n &lt;= 1) return;
        if (n &lt; 32) {
            binary_insertion_sort(a.data(), 0, n, 1);
            return;
        }

        const std::size_t minrun = compute_minrun(n);
        std::vector&lt;Run&gt; stack;
        stack.reserve(48);
        std::vector&lt;T&gt; tmp;

        std::size_t lo = 0;
        while (lo &lt; n) {
            std::size_t run_len = count_run_and_make_ascending(a.data(), lo, n);
            if (run_len &lt; minrun) {
                const std::size_t force = std::min(minrun, n - lo);
                binary_insertion_sort(a.data(), lo, lo + force, lo + run_len);
                run_len = force;
            }
            stack.push_back({lo, run_len});
            lo += run_len;
            merge_collapse(a.data(), stack, tmp);
        }
        while (stack.size() &gt; 1) {
            std::size_t k = stack.size() - 2;
            if (k &gt; 0 &amp;&amp; stack[k - 1].len &lt; stack[k + 1].len) --k;
            merge_at(a.data(), stack, k, tmp);
        }
    }

private:
    struct Run { std::size_t base, len; };

    static constexpr std::size_t compute_minrun(std::size_t n) noexcept {
        std::size_t r = 0;
        while (n &gt;= 64) {
            r |= (n &amp; 1U);
            n &gt;&gt;= 1U;
        }
        return n + r;
    }

    static std::size_t count_run_and_make_ascending(T* a, std::size_t lo, std::size_t hi) noexcept {
        if (lo + 1 == hi) return 1;
        std::size_t run_hi = lo + 2;
        if (a[lo + 1] &lt; a[lo]) { // Strictly descending: safe to reverse without breaking stability
            while (run_hi &lt; hi &amp;&amp; a[run_hi] &lt; a[run_hi - 1]) ++run_hi;
            std::reverse(a + lo, a + run_hi);
        } else { // Non-decreasing: !(a[i] &lt; a[i-1])
            while (run_hi &lt; hi &amp;&amp; !(a[run_hi] &lt; a[run_hi - 1])) ++run_hi;
        }
        return run_hi - lo;
    }

    static void binary_insertion_sort(T* a, std::size_t lo, std::size_t hi, std::size_t start) noexcept {
        if (start == lo) ++start;
        for (std::size_t i = start; i &lt; hi; ++i) {
            T pivot = std::move(a[i]);
            std::size_t left = lo, right = i;
            while (left &lt; right) {
                const std::size_t mid = left + ((right - left) &gt;&gt; 1);
                if (pivot &lt; a[mid]) right = mid;
                else                left = mid + 1;
            }
            std::move_backward(a + left, a + i, a + i + 1);
            a[left] = std::move(pivot);
        }
    }

    // Corrected 4-condition TimSort invariant (De Gouw et al., 2015)
    static void merge_collapse(T* a, std::vector&lt;Run&gt;&amp; s, std::vector&lt;T&gt;&amp; tmp) {
        while (s.size() &gt; 1) {
            std::size_t n = s.size() - 2;
            if ((n &gt; 0 &amp;&amp; s[n - 1].len &lt;= s[n].len + s[n + 1].len) ||
                (n &gt; 1 &amp;&amp; s[n - 2].len &lt;= s[n - 1].len + s[n].len)) {
                if (s[n - 1].len &lt; s[n + 1].len) --n;
                merge_at(a, s, n, tmp);
            } else if (s[n].len &lt;= s[n + 1].len) {
                merge_at(a, s, n, tmp);
            } else {
                break;
            }
        }
    }

    static void merge_at(T* a, std::vector&lt;Run&gt;&amp; s, std::size_t k, std::vector&lt;T&gt;&amp; tmp) {
        std::size_t base1 = s[k].base, len1 = s[k].len;
        std::size_t base2 = s[k + 1].base, len2 = s[k + 1].len;
        s[k].len = len1 + len2;
        s.erase(s.begin() + static_cast&lt;std::ptrdiff_t&gt;(k + 1));

        // Trim prefix of Run 1 already &lt;= a[base2]
        const T* p1 = a + base1;
        const T* p1_end = std::upper_bound(p1, p1 + len1, a[base2]);
        const std::size_t skip_left = static_cast&lt;std::size_t&gt;(p1_end - p1);
        base1 += skip_left;
        len1 -= skip_left;
        if (len1 == 0) return;

        // Trim suffix of Run 2 already &gt;= a[base1 + len1 - 1]
        const T* p2 = a + base2;
        const T* p2_end = std::lower_bound(p2, p2 + len2, a[base1 + len1 - 1]);
        len2 = static_cast&lt;std::size_t&gt;(p2_end - p2);
        if (len2 == 0) return;

        // Smaller-half copy merge
        if (len1 &lt;= len2) {
            tmp.assign(std::make_move_iterator(a + base1), std::make_move_iterator(a + base1 + len1));
            std::size_t i = 0, j = base2, dst = base1;
            while (i &lt; len1 &amp;&amp; j &lt; base2 + len2) {
                if (a[j] &lt; tmp[i]) a[dst++] = std::move(a[j++]);
                else               a[dst++] = std::move(tmp[i++]);
            }
            while (i &lt; len1) a[dst++] = std::move(tmp[i++]);
        } else {
            tmp.assign(std::make_move_iterator(a + base2), std::make_move_iterator(a + base2 + len2));
            std::ptrdiff_t i = static_cast&lt;std::ptrdiff_t&gt;(base1 + len1) - 1;
            std::ptrdiff_t j = static_cast&lt;std::ptrdiff_t&gt;(len2) - 1;
            std::ptrdiff_t dst = static_cast&lt;std::ptrdiff_t&gt;(base2 + len2) - 1;
            while (i &gt;= static_cast&lt;std::ptrdiff_t&gt;(base1) &amp;&amp; j &gt;= 0) {
                if (tmp[j] &lt; a[i]) a[dst--] = std::move(a[i--]);
                else               a[dst--] = std::move(tmp[j--]);
            }
            while (j &gt;= 0) a[dst--] = std::move(tmp[j--]);
        }
    }
};</code></pre>

        <div class="callout callout-warning">
          <div class="callout-title">Right-to-Left Merge Tie-Breaking Must Remain Stable!</div>
          <p>Look closely at the right-to-left merge branch when <code>len2 &lt; len1</code>: we compare <code>if (tmp[j] &lt; a[i])</code> and move <code>a[i--]</code> only when <code>a[i]</code> is <em>strictly greater</em> than <code>tmp[j]</code>! If <code>a[i] == tmp[j]</code>, the element from Run 2 (<code>tmp[j]</code>) originated to the <em>right</em> of Run 1, so when filling from the back (<code>dst--</code>), <code>tmp[j]</code> must be placed at the rightmost slot first to preserve relative stability!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "compute_minrun(n) picks a minimum run size in [32, 64] such that ceil(n / minrun) is a power of two (or slightly less), preventing unbalanced final merges.",
      "Binary Insertion Sort extends natural runs shorter than minrun using at most 6 binary-search comparisons per element plus a contiguous move_backward shift.",
      "Trimming already-ordered prefixes and suffixes of adjacent runs before allocating scratch memory reduces sorted-input overhead to zero copies.",
      "When merging right-to-left (len2 < len1), equal elements must take from the right run (tmp[j]) first so their original left-to-right relative order is preserved."
    ],
    furtherReading: [
      {
        title: "Tim Peters (2002) — Timsort Specification & Merge At / Gallop Details",
        url: "https://github.com/python/cpython/blob/main/Objects/listsort.txt"
      },
      {
        title: "Munro & Wild (2018) — Nearly-Optimal Mergesorts: Fast, Practical Sorting Methods That Optimally Adapt to Existing Runs (Powersort)",
        url: "https://arxiv.org/abs/1805.04154"
      }
    ]
  }
};
