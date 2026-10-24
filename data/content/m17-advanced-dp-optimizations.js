window.MODULE_CONTENT = window.MODULE_CONTENT || {};

window.MODULE_CONTENT["m17"] = {
  "bitmask-dp-tsp-hamiltonian": {
    title: "Bitmask DP: Held-Karp O(N^2 2^N) Traveling Salesperson & Submask Enumeration (O(3^N) Proof)",
    video: {
      youtubeId: "cY4HiiFHO1o",
      title: "Traveling Salesman Problem (TSP) Dynamic Programming — Held-Karp Algorithm",
      channel: "WilliamFiset",
      duration: "19:34",
      length: "19:34",
      start: 0,
      why: "Walks through encoding visited subset states as 32-bit integers and why Held-Karp compresses N! tours into N * 2^N states."
    },
    intuition: "Checking all N! permutations of cities for $N = 20$ requires $2.4 \\times 10^{18}$ operations (centuries of CPU time), because it distinguishes the internal ordering of already-visited cities. Held and Karp (1962) observed that to extend a partial tour from city u, we only need to know *which subset* of cities S has been visited so far and *which city* u we are currently standing on—collapsing $20!$ down to $20 \\times 2^{20} \\approx 2 \\times 10^7$ states.",
    content: `
      <div class="lesson-content">
        <h3>1. The Held-Karp $O(N^2 2^N)$ TSP Formulation</h3>
        <p>Given a weighted graph on $N$ vertices $\\{0, 1, \\dots, N-1\\}$ with distance matrix $W[u][v]$, the <strong>Traveling Salesperson Problem (TSP)</strong> asks for the minimum-weight Hamiltonian cycle visiting every vertex exactly once and returning to start vertex $0$. Since a cycle can be rotated to start at vertex $0$ without loss of generality, we fix $0$ as the start vertex.</p>
        <p>Define state $dp[\\text{mask}][u]$ for $\\text{mask} \\in [1, 2^N - 1]$ (with bit $0$ and bit $u$ set) as the minimum cost of a simple walk starting at vertex $0$, visiting the exact subset of vertices encoded by $\\text{mask}$, and ending at vertex $u$:</p>
        $$dp[\\text{mask}][u] = \\min_{v \\in \\text{mask} \\setminus \\{u\\}} \\big(dp[\\text{mask} \\setminus \\{u\\}][v] + W[v][u]\\big)$$
        <p>Why is the outer loop <code>for (uint32_t mask = 1; mask < (1U << n); ++mask)</code> already a valid topological order? Because removing a bit $u$ (<code>mask ^ (1U << u)</code>) strictly decreases the integer value of <code>mask</code> ($\text{mask} \\setminus \\{u\\} < \\text{mask}$), so every predecessor mask has already been finalized!</p>

        <div class="invariant-box">
          <h4>Core Invariant — Submask Enumeration in Exact $O(3^N)$ Time</h4>
          <p>Many partition DPs (such as Minimum Number of Work Sessions, Chromatic Number, or Steiner Tree) require iterating over all submasks $s \\subseteq m$ for every mask $m \\in [0, 2^N - 1]$. A naive check of all pairs $(m, s)$ takes $O(4^N)$. Instead, using the two's complement decrement trick:</p>
          <pre><code class="language-cpp">for (int s = m; s &gt; 0; s = (s - 1) &amp; m) { ... }</code></pre>
          <p>visits <strong>only</strong> the $2^{\\text{popcount}(m)}$ valid submasks of $m$ in descending order!<br/>
          <strong>Proof of $O(3^N)$ Total Time:</strong> By the Binomial Theorem, summing $2^k$ over all masks $m$ with $\\text{popcount}(m) = k$ gives:</p>
          $$\\sum_{m=0}^{2^N - 1} 2^{\\text{popcount}(m)} = \\sum_{k=0}^{N} \\binom{N}{k} 2^k \\cdot 1^{N - k} = (2 + 1)^N = 3^N$$
          <p>Combinatorially, each of the $N$ bit positions is independently in one of <strong>3 states</strong>: (1) in both $m$ and $s$, (2) in $m$ but not $s$, or (3) in neither $m$ nor $s$!</p>
        </div>

        <h3>2. Breaking the $O(W \\cdot 2^N)$ Barrier: Tuple State DP (Elevator Rides / Bin Packing)</h3>
        <p>Suppose we want to pack $N \\le 20$ items of weights $w_i \\le 10^9$ into the minimum number of bins of capacity $W = 10^9$. We cannot put remaining capacity $c \\in [0..W]$ in the DP index! Instead, store a <strong>lexicographic pair</strong> inside the DP value itself: $dp[\\text{mask}] = (\\text{min\\_bins},\\; \\text{min\\_weight\\_in\\_last\\_bin})$, solved in $O(N \\cdot 2^N)$ time regardless of how huge $W$ is!</p>

        <div class="mermaid">
flowchart LR
  M0["mask = 01011_2<br/>{0, 1, 3} ending at v=1"] -->|"+ W[1][2]"| M1["mask = 01111_2<br/>{0, 1, 2, 3} ending at u=2"]
  M2["mask = 01011_2<br/>{0, 1, 3} ending at v=3"] -->|"+ W[3][2]"| M1
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Memory Layout <code>dp[1 &lt;&lt; N][N]</code> vs. <code>dp[N][1 &lt;&lt; N]</code> & <code>TZCNT</code> Loops</h4>
          <p>In Held-Karp TSP, the outer loop iterates over <code>mask</code> and the inner loops iterate over set bits $u$ and $v$. If you declare <code>dp[N][1 &lt;&lt; N]</code>, reading <code>dp[v][mask]</code> for different vertices $v$ jumps by $2^N \\times 4$ bytes (4 MB for $N = 20$), causing an L3 cache/TLB miss on every inner transition! Declaring <strong><code>dp[1 &lt;&lt; N][N]</code></strong> (flat <code>dp[mask * N + u]</code>) places all $N$ endpoints of the same <code>mask</code> inside a single 80-byte contiguous cache line. Furthermore, iterating only over set bits via <code>for (uint32_t bits = mask; bits; bits &amp;= bits - 1) { int u = __builtin_ctz(bits); ... }</code> halves the number of loop iterations.</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-bitmask-sos-broken-profile"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Bitmask DP Pattern</th>
              <th>State Count</th>
              <th>Transitions / State</th>
              <th>Total Time Complexity</th>
              <th>Practical $N$ Limit (1s)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Subset / Bin Packing Tuple DP (<code>dp[mask]</code>)</td>
              <td><span class="badge-oexp">O(2^N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-oexp">O(N * 2^N)</span></td>
              <td>$N \\le 22$ ($\\approx 9 \\times 10^7$ ops)</td>
            </tr>
            <tr>
              <td>Held-Karp TSP / Hamiltonian Walk (<code>dp[mask][u]</code>)</td>
              <td><span class="badge-oexp">O(N * 2^N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-oexp">O(N^2 * 2^N)</span></td>
              <td>$N \\le 20$ ($\\approx 4 \\times 10^8$ ops)</td>
            </tr>
            <tr>
              <td>Submask Partition DP (<code>s = (s - 1) &amp; m</code>)</td>
              <td><span class="badge-oexp">O(2^N)</span></td>
              <td><span class="badge-oexp">O(2^popcount(m))</span></td>
              <td><span class="badge-oexp">O(3^N)</span></td>
              <td>$N \\le 15$ ($3^{15} \\approx 1.4 \\times 10^7$)</td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

// 1. Held-Karp O(N^2 * 2^N) Exact Traveling Salesperson Tour (Fixed at start vertex 0)
long long tsp_held_karp(const std::vector&lt;std::vector&lt;long long&gt;&gt;&amp; dist) {
    const int n = static_cast&lt;int&gt;(dist.size());
    if (n &lt;= 1) return 0;
    constexpr long long INF = 1LL &lt;&lt; 60;

    // Since vertex 0 is always visited first, we only need (N - 1) bits for vertices {1..N-1}
    // or full (1 &lt;&lt; N) with mask &amp; 1 == 1. Flat layout: dp[mask * n + u] for L1 cache locality.
    const std::uint32_t full_mask = (1U &lt;&lt; n);
    std::vector&lt;long long&gt; dp(static_cast&lt;std::size_t&gt;(full_mask) * n, INF);
    dp[1U * n + 0] = 0; // Base case: mask = {0}, standing at vertex 0

    for (std::uint32_t mask = 1; mask &lt; full_mask; mask += 2) { // mask += 2 keeps bit 0 always set!
        for (std::uint32_t u_bits = mask; u_bits; u_bits &amp;= u_bits - 1) {
            int u = __builtin_ctz(u_bits);
            long long cur_cost = dp[mask * n + u];
            if (cur_cost == INF) continue;

            // Push DP to unvisited vertices v
            std::uint32_t unvisited = ((full_mask - 1U) ^ mask);
            for (std::uint32_t v_bits = unvisited; v_bits; v_bits &amp;= v_bits - 1) {
                int v = __builtin_ctz(v_bits);
                std::uint32_t next_mask = mask | (1U &lt;&lt; v);
                dp[next_mask * n + v] = std::min(dp[next_mask * n + v], cur_cost + dist[u][v]);
            }
        }
    }

    long long best_tour = INF;
    const std::uint32_t all_visited = full_mask - 1U;
    for (int u = 1; u &lt; n; ++u) {
        best_tour = std::min(best_tour, dp[all_visited * n + u] + dist[u][0]);
    }
    return best_tour;
}

// 2. O(N * 2^N) Bin Packing / Elevator Rides via Tuple State DP: (num_rides, current_ride_weight)
int min_bins_bitmask_dp(const std::vector&lt;long long&gt;&amp; weights, long long capacity) {
    const int n = static_cast&lt;int&gt;(weights.size());
    const std::uint32_t limit = 1U &lt;&lt; n;
    std::vector&lt;std::pair&lt;int, long long&gt;&gt; dp(limit, { n + 1, 0 });
    dp[0] = { 1, 0 }; // 1st bin open with 0 weight used

    for (std::uint32_t mask = 1; mask &lt; limit; ++mask) {
        for (std::uint32_t bits = mask; bits; bits &amp;= bits - 1) {
            int i = __builtin_ctz(bits);
            auto [rides, used_w] = dp[mask ^ (1U &lt;&lt; i)];
            std::pair&lt;int, long long&gt; candidate =
                (used_w + weights[i] &lt;= capacity)
                    ? std::make_pair(rides, used_w + weights[i])
                    : std::make_pair(rides + 1, weights[i]);
            dp[mask] = std::min(dp[mask], candidate);
        }
    }
    return dp[limit - 1].first;
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Infinite Loop in Submask Enumeration When <code>s = 0</code></h4>
          <p>In the submask loop <code>for (int s = m; s &gt; 0; s = (s - 1) &amp; m)</code>, notice that the loop condition is strictly <code>s &gt; 0</code>! If you write <code>s &gt;= 0</code>, then after visiting <code>s = 0</code>, evaluating <code>(0 - 1) &amp; m = (-1) &amp; m = m</code> wraps right back to <code>m</code> and causes an <strong>infinite loop</strong>! Always handle the empty submask <code>s = 0</code> outside the loop if needed.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Held-Karp TSP compresses N! permutations into O(N * 2^N) states dp[mask][u] representing the visited subset mask and last vertex u, running in O(N^2 * 2^N) time.",
      "Stepping mask by 2 (mask += 2) fixes vertex 0 as the tour origin and halves both the time and active state space.",
      "Iterating s = (s - 1) & m visits only the 2^popcount(m) submasks of m; summed over all 2^N masks, total work is sum C(N, k) 2^k = 3^N.",
      "Tuple State DP stores (bins_used, last_bin_weight) as the DP value to solve exact bin packing in O(N * 2^N) time independent of capacity W."
    ],
    furtherReading: [
      {
        title: "Michael Held & Richard M. Karp — A Dynamic Programming Approach to Sequencing Problems (J. SIAM, 1962)",
        url: "https://epubs.siam.org/doi/10.1137/0110015"
      },
      {
        title: "CP-Algorithms — Submask Enumeration and O(3^N) Complexity Proof",
        url: "https://cp-algorithms.com/algebra/all-submasks.html"
      }
    ]
  },

  "sos-dp-fast-zeta-mobius": {
    title: "Sum Over Subsets (SOS) DP & Fast Walsh-Hadamard Transform (FWHT) for Bitwise Convolutions",
    video: {
      youtubeId: "RYdueyYBQS8",
      id: "RYdueyYBQS8",
      url: "https://www.youtube.com/embed/RYdueyYBQS8",
      title: "Sum Over Subsets (SOS DP) & Fast Zeta Transform Fundamentals",
      channel: "Vivek Gupta",
      duration: "38:15",
      start: 0,
      length: "38m",
      why: "Explains how processing the boolean hypercube dimension-by-dimension reduces O(3^N) submask aggregation to O(N * 2^N) in 6 lines of code."
    },
    intuition: "Enumerating submasks for every mask takes $O(3^N)$ time because each mask sums its submasks from scratch. Sum Over Subsets (SOS) DP views an $N$-bit mask as a point in an $N$-dimensional $\{0, 1\}^N$ hypercube and computes $N$-dimensional prefix sums one bit-dimension at a time—collapsing $O(3^N)$ down to $O(N \\cdot 2^N)$ in just 5 lines of in-place code!",
    content: `
      <div class="lesson-content">
        <h3>1. From $O(3^N)$ Submasks to $O(N \\cdot 2^N)$ Hypercube Prefix Sums (SOS DP)</h3>
        <p>Given an array $A[0..2^N - 1]$, we want to compute the <strong>Submask Zeta Transform (Sum Over Subsets)</strong> for every mask $m$:</p>
        $$F[m] = \\sum_{s \\subseteq m} A[s]$$
        <p>Think of an $N$-bit integer $m$ not as a scalar, but as an $N$-tuple of coordinates $(b_{N-1}, \\dots, b_1, b_0) \\in \\{0, 1\\}^N$. Then $s \\subseteq m$ simply means $s_i \\le m_i$ in every coordinate $i \\in \\{0..N-1\\}$—so $F[m]$ is literally an <strong>$N$-dimensional prefix sum</strong> over a $\\underbrace{2 \\times 2 \\times \\dots \\times 2}_{N}$ grid!</p>

        <div class="invariant-box">
          <h4>Core Invariant — SOS DP Dimension-by-Dimension Invariant</h4>
          <p>Define $dp[m][i]$ as the sum of $A[s]$ over all submasks $s \\subseteq m$ that are allowed to differ from $m$ <strong>only in the lowest $i + 1$ bits</strong> (bits $0..i$), while matching $m$ on bits $i+1..N-1$:<br/>
          1. If bit $i$ of $m$ is $0$, then bit $i$ of $s$ must also be $0$: $dp[m][i] = dp[m][i-1]$.<br/>
          2. If bit $i$ of $m$ is $1$, then bit $i$ of $s$ can be either $1$ (matching $m$) or $0$ (matching $m \\oplus 2^i$):<br/>
          $$dp[m][i] = dp[m][i-1] + dp[m \\oplus 2^i][i-1]$$
          Because $dp[m][i]$ only reads $dp[\\dots][i-1]$, the second dimension $i$ compresses <strong>100% in-place</strong>! Furthermore, reversing the $+\\to -$ sign computes the <strong>Fast Möbius Inversion</strong> (recovering $A$ from $F$ by Inclusion-Exclusion in $O(N 2^N)$)!</p>
        </div>

        <h3>2. Bitwise Convolutions (OR, AND, XOR) via Fast Walsh-Hadamard Transform (FWHT)</h3>
        <p>Suppose we want to compute the bitwise convolution $C[k] = \\sum_{i \\circledast j = k} A[i] \\cdot B[j]$ for $\\circledast \\in \\{|, \\&, \\oplus\\}$ in $O(N \\cdot 2^N)$ instead of $O(4^N)$:</p>
        <ul>
          <li><strong>Bitwise OR Convolution ($i \\mathbin{|} j = k$):</strong> Notice $(i \\mathbin{|} j) \\subseteq k \\iff i \\subseteq k \\text{ and } j \\subseteq k$. Therefore, the Submask Zeta Transform turns OR-convolution into <strong>pointwise multiplication</strong>: $\\hat{C}[m] = \\hat{A}[m] \\cdot \\hat{B}[m]$, followed by Fast Möbius Inversion (subtracting <code>dp[m ^ (1 << i)]</code>)!</li>
          <li><strong>Bitwise AND Convolution ($i \\mathbin{\\&} j = k$):</strong> $(i \\mathbin{\\&} j) \\supseteq k \\iff i \\supseteq k \\text{ and } j \\supseteq k$. Use the <strong>Supermask Zeta Transform</strong> (when bit $i$ of $m$ is $0$, add <code>dp[m | (1 << i)]</code>), multiply pointwise, and invert by subtracting!</li>
          <li><strong>Bitwise XOR Convolution ($i \\oplus j = k$):</strong> Apply the <strong>Fast Walsh-Hadamard Transform (FWHT)</strong>—an $N$-dimensional size-2 DFT with butterfly $(u, v) \\leftarrow (u + v,\\; u - v)$—multiply pointwise, and apply the inverse butterfly $(u, v) \\leftarrow ((u + v)/2,\\; (u - v)/2)$!</li>
        </ul>

        <div class="mermaid">
flowchart LR
  AB["Arrays A, B<br/>Size 2^N"] -->|"Forward Transform O(N 2^N)<br/>OR: Submask SOS<br/>AND: Supermask SOS<br/>XOR: Hadamard (u+v, u-v)"| Hat["Transformed A_hat, B_hat"]
  Hat -->|"Pointwise Product O(2^N)<br/>C_hat[m] = A_hat[m] * B_hat[m]"| Chat["C_hat"]
  Chat -->|"Inverse Transform O(N 2^N)<br/>OR/AND: Mobius (-)<br/>XOR: Hadamard / 2^N"| C["Convolution C = A * B"]
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Why Outer Loop <code>bit</code> + Butterfly Stride Beats Outer Loop <code>mask</code></h4>
          <p>In SOS DP, you <em>must</em> put <code>for (int i = 0; i < N; ++i)</code> as the <strong>outer loop</strong> and <code>for (int mask = 0; mask < (1 << N); ++mask)</code> as the inner loop! First, putting <code>mask</code> on the outside is mathematically incorrect for in-place updates when <code>dp[m]</code> aggregates over $\\max$ or $+$. Second, with <code>i</code> on the outside, the butterfly step processes contiguous power-of-2 blocks of size $2^i$, enabling unconditional branchless inner loops (<code>for (int b = 0; b < (1 << N); b += 1 << (i + 1)) for (int j = 0; j < (1 << i); ++j)</code>) that the compiler auto-vectorizes with AVX2!</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-bitmask-sos-broken-profile"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Bitwise Transform / Convolution</th>
              <th>Naive Complexity</th>
              <th>Submask Complexity</th>
              <th>SOS / FWHT Complexity</th>
              <th>Time at $N = 20$ ($2^{20} \\approx 10^6$)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sum Over Subsets ($\\sum_{s \\subseteq m} A[s]$)</td>
              <td><span class="badge-oexp">O(4^N)</span></td>
              <td><span class="badge-oexp">O(3^N)</span> ($3.5 \\times 10^9$)</td>
              <td><span class="badge-oexp">O(N * 2^N)</span> ($2 \\times 10^7$)</td>
              <td><strong>~15 ms</strong> (vs. 4.5 sec for $3^N$)</td>
            </tr>
            <tr>
              <td>Sum Over Supersets ($\\sum_{s \\supseteq m} A[s]$)</td>
              <td><span class="badge-oexp">O(4^N)</span></td>
              <td><span class="badge-oexp">O(3^N)</span></td>
              <td><span class="badge-oexp">O(N * 2^N)</span></td>
              <td><strong>~15 ms</strong></td>
            </tr>
            <tr>
              <td>Bitwise OR / AND Convolution</td>
              <td><span class="badge-oexp">O(4^N)</span></td>
              <td><span class="badge-oexp">O(3^N)</span></td>
              <td><span class="badge-oexp">O(N * 2^N)</span></td>
              <td><strong>~45 ms</strong> (3 passes)</td>
            </tr>
            <tr>
              <td>Bitwise XOR Convolution (FWHT)</td>
              <td><span class="badge-oexp">O(4^N)</span></td>
              <td><span class="badge-oexp">O(4^N)</span></td>
              <td><span class="badge-oexp">O(N * 2^N)</span></td>
              <td><strong>~45 ms</strong> (3 passes)</td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;cstdint&gt;
#include &lt;vector&gt;

// 1. Branchless In-Place Sum Over Subsets (Fast Zeta) &amp; Inverse (Fast Mobius) in O(N * 2^N)
// invert = false: F[m] = sum_{s subseteq m} A[s]
// invert = true:  Recovers A[m] from F[m] via Inclusion-Exclusion
void sos_submask_transform(std::vector&lt;long long&gt;&amp; f, int n, bool invert = false) {
    const int total = 1 &lt;&lt; n;
    for (int i = 0; i &lt; n; ++i) {
        const int half = 1 &lt;&lt; i;
        const int step = half &lt;&lt; 1;
        // Branchless butterfly: skips all masks where bit i is 0 without an <code>if</code>!
        for (int base = 0; base &lt; total; base += step) {
            for (int j = 0; j &lt; half; ++j) {
                if (!invert) {
                    f[base + half + j] += f[base + j];
                } else {
                    f[base + half + j] -= f[base + j];
                }
            }
        }
    }
}

// 2. Bitwise OR Convolution: C[k] = sum_{i | j == k} A[i] * B[j] in O(N * 2^N)
std::vector&lt;long long&gt; bitwise_or_convolution(std::vector&lt;long long&gt; a, std::vector&lt;long long&gt; b, int n) {
    sos_submask_transform(a, n, false);
    sos_submask_transform(b, n, false);
    for (int m = 0; m &lt; (1 &lt;&lt; n); ++m) a[m] *= b[m];
    sos_submask_transform(a, n, true); // Fast Mobius Inversion recovers exact OR-convolution!
    return a;
}

// 3. Fast Walsh-Hadamard Transform (FWHT) for Bitwise XOR Convolution: C[k] = sum_{i ^ j == k} A[i] * B[j]
void fwht_xor(std::vector&lt;long long&gt;&amp; a, int n, bool invert = false) {
    const int total = 1 &lt;&lt; n;
    for (int i = 0; i &lt; n; ++i) {
        const int half = 1 &lt;&lt; i;
        const int step = half &lt;&lt; 1;
        for (int base = 0; base &lt; total; base += step) {
            for (int j = 0; j &lt; half; ++j) {
                long long u = a[base + j];
                long long v = a[base + half + j];
                a[base + j] = u + v;
                a[base + half + j] = u - v;
            }
        }
    }
    if (invert) {
        for (long long&amp; x : a) x &gt;&gt;= n; // Divide by 2^n
    }
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Swapping the <code>bit</code> and <code>mask</code> Loop Order in SOS DP</h4>
          <p>Never write <code>for (int mask = 0; mask &lt; (1 &lt;&lt; n); ++mask) for (int i = 0; i &lt; n; ++i)</code>! When <code>mask</code> is the outer loop, <code>f[mask ^ (1 &lt;&lt; i)]</code> has already been completely summed across <strong>all $n$ dimensions</strong> instead of just dimensions $0..i-1$, causing submasks that differ in multiple bits to be double-, triple-, or $k!$-counted! Dimension <code>i</code> <strong>must</strong> be the outer loop.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Sum Over Subsets (SOS) DP treats an N-bit mask as an N-dimensional {0, 1}^N hypercube and computes 1D prefix sums along each bit dimension i = 0..N-1.",
      "SOS DP reduces submask and supermask aggregation from O(3^N) to O(N * 2^N) time and runs 100% in-place in a single array of size 2^N.",
      "Reversing addition to subtraction in SOS DP computes the Fast Mobius Inversion (Inclusion-Exclusion over the boolean lattice) in O(N * 2^N).",
      "Bitwise OR, AND, and XOR convolutions reduce to O(2^N) pointwise multiplication via Submask Zeta, Supermask Zeta, and Fast Walsh-Hadamard Transform (FWHT)."
    ],
    furtherReading: [
      {
        title: "Codeforces Tutorial — SOS Dynamic Programming (Sum Over Subsets)",
        url: "https://codeforces.com/blog/entry/45223"
      },
      {
        title: "CP-Algorithms — Fast Walsh-Hadamard Transform and Bitwise Convolutions",
        url: "https://usaco.guide/plat/dp-sos"
      }
    ]
  },

  "digit-dp-lexicographic-automata": {
    title: "Digit DP: Counting Constrained Integers in [L, R] via Tight/Leading-Zero State Automata",
    video: {
      youtubeId: "heUFId6Qd1A",
      title: "Introduction to Digit Dynamic Programming — Counting Constrained Numbers",
      channel: "Kartik Arora",
      duration: "31:15",
      length: "31:15",
      start: 0,
      why: "Explains the prefix reduction count(R) - count(L-1), the `tight` lexicographic flag, and the `started` leading-zero flag."
    },
    intuition: "How do you count how many integers between $1$ and $R = 10^{18}$ have digit sum divisible by $K$ or contain no adjacent equal digits? Iterating takes $10^{18}$ steps, but $R$ has only 19 base-10 digits! Digit DP builds a tiny deterministic automaton that chooses digits from Most Significant to Least Significant, tracking a single boolean `tight` flag indicating whether the prefix still matches $R$'s prefix.",
    content: `
      <div class="lesson-content">
        <h3>1. Prefix Reduction $[L, R] \\to [0, R] - [0, L-1]$ & The <code>tight</code> Automaton</h3>
        <p>To count integers $x \\in [L, R]$ satisfying a digit predicate $P(x)$, we reduce the two-sided range query to two one-sided queries: $\\text{solve}(R) - \\text{solve}(L - 1)$ (or $\\text{solve}(R) - \\text{solve}(L) + P(L)$ when $L$ is a 1000-digit string). Let $S[0..n-1]$ be the base-10 digit string of the upper bound $R$ (most significant digit at index $0$).</p>

        <div class="invariant-box">
          <h4>Core Invariant — The <code>tight</code> (Prefix-Match) & <code>started</code> (Leading-Zero) Flags</h4>
          <p>When choosing digit $d$ at position $\\text{pos} \\in [0..n-1]$:<br/>
          1. <strong><code>tight</code> Flag (<code>bool</code>):</strong> <code>tight == true</code> iff every previous digit $0..\\text{pos}-1$ was chosen equal to $S[0..\\text{pos}-1]$.<br/>
             - If <code>tight == true</code>, $d$ is restricted to $0 \\le d \\le S[\\text{pos}]$, and <code>next_tight = (d == S[pos])</code>.<br/>
             - If <code>tight == false</code>, our prefix is already strictly smaller than $S$'s prefix! Thus $d$ can be <strong>any digit $0 \\le d \\le 9$</strong>, and <code>next_tight = false</code> forever.<br/>
          2. <strong><code>started</code> Flag (<code>bool</code>):</strong> Shorter numbers (e.g., $42$ when $R = 5000$) are generated as $0042$. When the problem depends on leading zeros (such as "no adjacent equal digits", where $0042$ has two leading $0$s that are NOT real digits, or "count occurrences of digit $0$"), <code>started == false</code> indicates we are still in the leading-zero prefix, and <code>next_started = started || (d > 0)</code>.</p>
        </div>

        <h3>2. Cross-Query Memoization Trick: Caching <code>tight == false</code> Across Multiple Test Cases</h3>
        <p>Observe a powerful structural fact: whenever <code>tight == false</code>, the remaining transitions from <code>(remaining_len, state)</code> depend only on <code>0..9</code> and <strong>do NOT depend on the input number $R$ at all</strong>! Therefore, if you index your memo table by <code>remaining_len = n - 1 - pos</code> and memoize <em>only</em> states where <code>tight == false</code> (and <code>started == true</code>), you can <strong>allocate and populate the memo table ONCE globally</strong> and answer $Q = 10^5$ range queries $[L_q, R_q]$ without ever clearing <code>memo</code>!</p>

        <div class="mermaid">
flowchart LR
  Root["pos=0, tight=true<br/>Bound R = '352'"] -->|"d = 3 (Matches R[0])"| T1["pos=1, tight=true<br/>Allowed d in [0..5]"]
  Root -->|"d in {0, 1, 2} (&lt; R[0])"| F1["pos=1, tight=false<br/>Allowed d in [0..9] (Memoized!)"]
  T1 -->|"d = 5"| T2["pos=2, tight=true<br/>Allowed d in [0..2]"]
  T1 -->|"d in [0..4]"| F2["pos=2, tight=false<br/>Shares Memo with F1's children!"]
  F1 -->|"d in [0..9]"| F2
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Flat Static Array <code>memo[20][STATE]</code> vs. Clearing on <code>tight == true</code></h4>
          <p>For a 64-bit integer $R \\le 10^{18}$ ($n \\le 19$ digits), at each position <code>pos</code> there is <strong>at most one</strong> reachable prefix with <code>tight == true</code> (namely, the unique prefix equal to $S[0..\\text{pos}-1]$). Thus <code>tight == true</code> states never overlap within a single call! Only <code>tight == false</code> states are reached via multiple paths and benefit from memoization.</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-bitmask-sos-broken-profile"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Digit DP Problem</th>
              <th>Automaton State $\\Sigma$</th>
              <th>Digits $D = \\log_{10} R$</th>
              <th>Time Complexity</th>
              <th>Space Complexity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Digit Sum $\\equiv 0 \\pmod K$</td>
              <td>$\\text{rem} \\in [0..K-1]$</td>
              <td><span class="badge-ologn">O(log_10 R)</span></td>
              <td><span class="badge-on">O(10 * D * K)</span></td>
              <td><span class="badge-on">O(D * K)</span></td>
            </tr>
            <tr>
              <td>No Adjacent Equal Digits</td>
              <td>$\\text{last\\_d} \\in [0..10]$</td>
              <td><span class="badge-ologn">O(log_10 R)</span></td>
              <td><span class="badge-on">O(10 * D * 11)</span></td>
              <td><span class="badge-on">O(D * 11)</span></td>
            </tr>
            <tr>
              <td>Numbers with Distinct Digits</td>
              <td>$\\text{mask} \\in [0..2^{10}-1]$</td>
              <td><span class="badge-ologn">O(log_10 R)</span></td>
              <td><span class="badge-on">O(10 * D * 1024)</span></td>
              <td><span class="badge-on">O(D * 1024)</span></td>
            </tr>
            <tr>
              <td>Avoid Substring Pattern $P$</td>
              <td>KMP Automaton $\\text{state} \\in [0..|P|]$</td>
              <td><span class="badge-ologn">O(log_10 R)</span></td>
              <td><span class="badge-on">O(10 * D * |P|)</span></td>
              <td><span class="badge-on">O(D * |P|)</span></td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;cstring&gt;
#include &lt;string&gt;
#include &lt;vector&gt;

// Count numbers in [0, R] with no two adjacent equal digits (demonstrates both <code>tight</code> and <code>started</code>)
long long count_no_adjacent_equal_digits(long long R) {
    if (R &lt; 0) return 0;
    if (R == 0) return 1;
    std::string s = std::to_string(R);
    const int n = static_cast&lt;int&gt;(s.size());

    // memo[pos][last_digit][started] for tight == false states (last_digit = 10 means none yet)
    long long memo[20][11][2];
    std::memset(memo, -1, sizeof(memo));

    auto dfs = [&amp;](auto&amp; self, int pos, int last_d, bool tight, bool started) -&gt; long long {
        if (pos == n) return 1LL; // Successfully formed a valid number (including 0 if !started)
        if (!tight &amp;&amp; memo[pos][last_d][started] != -1) {
            return memo[pos][last_d][started];
        }

        int limit = tight ? (s[pos] - '0') : 9;
        long long ways = 0;

        for (int d = 0; d &lt;= limit; ++d) {
            bool next_started = started || (d &gt; 0);
            // Adjacent equality constraint only applies once the number has actually started!
            if (started &amp;&amp; d == last_d) continue;

            int next_last = next_started ? d : 10;
            bool next_tight = tight &amp;&amp; (d == limit);
            ways += self(self, pos + 1, next_last, next_tight, next_started);
        }

        if (!tight) {
            memo[pos][last_d][started] = ways;
        }
        return ways;
    };

    return dfs(dfs, 0, 10, true, false);
}

long long count_range_no_adjacent_equal(long long L, long long R) {
    return count_no_adjacent_equal_digits(R) - count_no_adjacent_equal_digits(L - 1);
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Reusing <code>tight == false</code> Memo Across Different-Length Strings Indexed by <code>pos</code></h4>
          <p>If you reuse a global <code>memo</code> table across multiple calls $\\text{solve}(R)$ and $\\text{solve}(L-1)$ where $R$ has $18$ digits and $L-1$ has $12$ digits, indexing <code>memo</code> by left-to-right <code>pos</code> is a <strong>fatal bug</strong>! <code>pos = 3</code> in an 18-digit number has $15$ digits remaining, whereas <code>pos = 3</code> in a 12-digit number has $9$ digits remaining! To share <code>memo</code> across numbers of different lengths, always index by <strong><code>rem_len = n - pos</code></strong> (number of digits remaining to be placed).</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Digit DP reduces range queries [L, R] to prefix queries solve(R) - solve(L - 1) over the base-10 (or base-2) digit representation of the upper bound.",
      "The boolean tight flag tracks whether the prefix chosen so far equals the upper bound's prefix; once tight becomes false, all digits 0..9 are legal.",
      "The boolean started flag distinguishes leading padding zeros (which are not real digits of a shorter integer) from internal zeros after the first non-zero digit.",
      "Indexing the memo table by remaining length (n - pos) and caching only !tight states allows a single global memo table to be reused across all queries without resetting."
    ],
    furtherReading: [
      {
        title: "Codeforces Tutorial — Digit DP (Tight & Leading-Zero Automata)",
        url: "https://codeforces.com/blog/entry/53960"
      },
      {
        title: "USACO Guide — Digit Dynamic Programming",
        url: "https://usaco.guide/gold/digit-dp"
      }
    ]
  },

  "broken-profile-dp-grid-tiling": {
    title: "Broken Profile (Plug) DP: Domino Tilings & Grid Connectivity in O(N M 2^M)",
    video: {
      youtubeId: "aWbxqYjaQM0",
      id: "aWbxqYjaQM0",
      url: "https://www.youtube.com/embed/aWbxqYjaQM0",
      title: "Grid Tiling & Broken-Profile Bitmask Dynamic Programming",
      channel: "CodeChef",
      duration: "52:40",
      start: 0,
      length: "52m",
      why: "Matt Fontaine explains why advancing the DP frontier one cell at a time instead of a full row at a time drops complexity from O(N 4^M) to O(N M 2^M)."
    },
    intuition: "If you try to tile an $N \\times M$ grid ($M \\le 16$) with dominoes by transitioning from one full row mask to the next, checking all compatible pairs of row masks takes $O(N \\cdot 4^M)$ time. Broken Profile DP advances the boundary *one single cell $(r, c)$ at a time*: the 'broken' staircase frontier between processed and unprocessed cells still has length $M$, so the state is still an $M$-bit mask, but each cell has at most 2 local choices—dropping runtime from $O(N \\cdot 4^M)$ to $O(N \\cdot M \\cdot 2^M)$!",
    content: `
      <div class="lesson-content">
        <h3>1. Full-Row Transitions vs. The Cell-by-Cell Broken Profile Frontier</h3>
        <p>Consider counting the number of ways to tile an $N \\times M$ grid with $1 \\times 2$ and $2 \\times 1$ dominoes (ensure $M \\le N$ by transposing the grid if $M > N$, so $M \\le \\sqrt{NM}$).</p>
        <p>In a naive row-by-row Bitmask DP, transitioning from row $r-1$'s protrusion mask to row $r$'s protrusion mask requires enumerating all horizontal domino placements inside row $r$, costing $O((1 + \\sqrt{2})^M)$ or $O(4^M)$ per row.</p>
        <p>In <strong>Broken Profile DP</strong>, we process cells in reading order $(r, c)$. At the moment we stand at cell $(r, c)$, the frontier separating the already-processed prefix from the unprocessed suffix consists of exactly $M$ boundary cells:</p>
        <ul>
          <li>Cells $(r, 0), (r, 1), \\dots, (r, c-1)$ in the <strong>current row $r$</strong> (bits $0..c-1$ of <code>mask</code>).</li>
          <li>Cells $(r-1, c), (r-1, c+1), \\dots, (r-1, M-1)$ in the <strong>previous row $r-1$</strong> (bits $c..M-1$ of <code>mask</code>).</li>
        </ul>

        <div class="invariant-box">
          <h4>Core Invariant — Broken Profile Bit Meaning at Cell $(r, c)$</h4>
          <p>In the $M$-bit profile <code>mask</code> before processing cell $(r, c)$:<br/>
          - Bit $k$ ($k < c$) is $1$ iff cell $(r, k)$ is already covered (or protrudes downward).<br/>
          - Bit $c$ is $1$ iff cell $(r-1, c)$ protrudes a vertical domino downward into $(r, c)$ (meaning $(r, c)$ is already covered from above!).<br/>
          When processing $(r, c)$, we look at bit $c$ of <code>mask</code>:<br/>
          1. <strong>If bit $c$ is $1$ ($(r, c)$ already covered from above):</strong> We cannot place a new domino starting at $(r, c)$; we simply clear bit $c$ (<code>mask ^ (1 << c)</code>) so $(r, c)$ does not protrude into $(r+1, c)$.<br/>
          2. <strong>If bit $c$ is $0$ ($(r, c)$ is uncovered):</strong> We MUST cover $(r, c)$ in one of two ways:<br/>
             - <em>Vertical Domino $(r, c) \\to (r+1, c)$:</em> Set bit $c$ to $1$ (<code>mask | (1 << c)</code>), protruding into row $r+1$.<br/>
             - <em>Horizontal Domino $(r, c-1) \\to (r, c)$:</em> Alternatively (in the backward-looking convention where bit $0$ means covered and $1$ means uncovered, or looking at bit $c$ and $c+1$), if $c + 1 < M$ and bit $c+1$ is $0$ (cell $(r-1, c+1)$ doesn't protrude into $(r, c+1)$), place a horizontal domino covering $(r, c)$ and $(r, c+1)$ by setting bit $c+1$ to $1$ (<code>mask | (1 << (c + 1))</code>) so $(r, c+1)$ will be seen as covered when the loop steps to $c + 1$!</p>
        </div>

        <h3>2. Visual Geometry of the Staircase Frontier</h3>
        <div class="mermaid">
flowchart LR
  subgraph Grid["Staircase Frontier at Cell (r, c)"]
    B0["Bits 0 .. c-1:<br/>Row r, Cols 0 .. c-1"] --- Step["Step at Col c:<br/>Cell (r, c) replaces (r-1, c)"]
    Step --- B1["Bits c .. M-1:<br/>Row r-1, Cols c .. M-1"]
  end
  Grid --> Choice{"Is bit c set in mask?<br/>(Already covered?)"}
  Choice -- "Yes (bit c == 1)" --> Clear["Clear bit c:<br/>next_mask = mask ^ (1 &lt;&lt; c)"]
  Choice -- "No (bit c == 0)" --> Place["1. Vertical: next_mask = mask | (1 &lt;&lt; c)<br/>2. Horizontal (if c+1 &lt; M and bit c+1 == 0):<br/>   next_mask = mask | (1 &lt;&lt; (c+1))"]
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Always Transpose the Grid So $M = \\min(R, C)$</h4>
          <p>Suppose a grid has $R = 12$ rows and $C = 100$ columns ($R \\times C = 1200$). If you orient the profile along $C = 100$, $2^{100}$ is astronomically impossible. Because $R \\times C \\le 1200$ implies $\\min(R, C) \\le \\lfloor \\sqrt{1200} \\rfloor = 34$ (and in typical tiling problems $R \\le 12, C \\le 1000$), <strong>transposing the grid so that $M = \\min(R, C)$ is the width</strong> reduces $2^M$ to $2^{12} = 4096$, solving a $12 \\times 1000$ grid in $12{,}000 \\times 4096 \\approx 4.9 \\times 10^7$ simple integer additions (~25 milliseconds)!</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-bitmask-sos-broken-profile"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Grid Tiling Method ($N \\ge M$)</th>
              <th>States Kept in Memory</th>
              <th>Transitions / Step</th>
              <th>Total Time Complexity</th>
              <th>Time for $N=100, M=12$</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Naive Full-Row Matrix Transition</td>
              <td><span class="badge-oexp">O(2^M)</span></td>
              <td><span class="badge-oexp">O(2^M)</span></td>
              <td><span class="badge-oexp">O(N * 4^M)</span></td>
              <td>$\\approx 1.6 \\times 10^9$ ops (TLE)</td>
            </tr>
            <tr>
              <td>Broken Profile (Cell-by-Cell Rolling)</td>
              <td><span class="badge-oexp">O(2^M)</span></td>
              <td><span class="badge-o1">O(1)</span> ($\le 2$ choices)</td>
              <td><span class="badge-oexp">O(N * M * 2^M)</span></td>
              <td>$\\approx 4.9 \\times 10^6$ ops (<strong>3 ms</strong>)</td>
            </tr>
            <tr>
              <td>Matrix Exponentiation on Profile (Huge $N$)</td>
              <td><span class="badge-oexp">O(4^M)</span></td>
              <td>Matrix-Matrix Mult</td>
              <td><span class="badge-oexp">O(8^M log N)</span></td>
              <td>Best when $M \\le 7, N = 10^{18}$</td>
            </tr>
            <tr>
              <td>Kasteleyn's Pfaffian / Cosine Product Formula</td>
              <td><span class="badge-o1">O(1)</span></td>
              <td>Closed-Form Cosine Sum</td>
              <td><span class="badge-on2">O(N * M)</span></td>
              <td>Exact float/complex formula (no obstacles)</td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;vector&gt;

// Count ways to tile an N x M grid with 1x2 and 2x1 dominoes modulo 10^9 + 7 in O(N * M * 2^min(N, M))
long long count_domino_tilings_broken_profile(int n, int m) {
    if ((1LL * n * m) % 2 != 0) return 0; // Odd number of cells cannot be tiled by dominoes!
    if (m &gt; n) std::swap(n, m);           // Ensure M &lt;= N so 2^M is tiny!

    constexpr long long MOD = 1'000'000'007LL;
    const int num_masks = 1 &lt;&lt; m;
    std::vector&lt;long long&gt; dp(num_masks, 0), next_dp(num_masks, 0);
    dp[0] = 1; // Initially, no dominoes protrude into row 0

    for (int r = 0; r &lt; n; ++r) {
        for (int c = 0; c &lt; m; ++c) {
            std::fill(next_dp.begin(), next_dp.end(), 0);
            for (int mask = 0; mask &lt; num_masks; ++mask) {
                long long ways = dp[mask];
                if (!ways) continue;

                if ((mask &gt;&gt; c) &amp; 1) {
                    // Cell (r, c) is already covered by a vertical domino from (r-1, c)
                    // or a horizontal domino from (r, c-1); clear bit c for row r+1
                    int nmask = mask ^ (1 &lt;&lt; c);
                    next_dp[nmask] = (next_dp[nmask] + ways) % MOD;
                } else {
                    // Option 1: Place a VERTICAL domino covering (r, c) and (r+1, c)
                    if (r + 1 &lt; n) {
                        int nmask = mask | (1 &lt;&lt; c);
                        next_dp[nmask] = (next_dp[nmask] + ways) % MOD;
                    }
                    // Option 2: Place a HORIZONTAL domino covering (r, c) and (r, c+1)
                    // Legal iff c + 1 &lt; m AND cell (r, c+1) is not already covered from (r-1, c+1)
                    if (c + 1 &lt; m &amp;&amp; !((mask &gt;&gt; (c + 1)) &amp; 1)) {
                        int nmask = mask | (1 &lt;&lt; (c + 1));
                        next_dp[nmask] = (next_dp[nmask] + ways) % MOD;
                    }
                }
            }
            std::swap(dp, next_dp);
        }
    }
    return dp[0]; // After the last row, 0 dominoes may protrude past row n - 1
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Allowing Horizontal Dominoes to Wrap Around Row Boundaries ($c = M - 1 \\to c = 0$)</h4>
          <p>When placing a horizontal domino at cell $(r, c)$ by setting bit $c + 1$ (<code>mask | (1 << (c + 1))</code>), you <strong>must</strong> guard with <code>if (c + 1 &lt; m)</code>! Without that check, at the rightmost column $c = m - 1$, a horizontal domino would illegally wrap around the edge of the board or shift out of the $M$-bit mask. Similarly, if the grid contains blocked obstacle cells <code>grid[r][c] == '#'</code>, an obstacle cell requires that bit $c$ is currently $0$ (no domino protruding into the obstacle) and transitions only to <code>mask</code> (leaving bit $c$ as $0$).</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Broken Profile DP advances the boundary one cell (r, c) at a time instead of one full row at a time, reducing complexity from O(N * 4^M) to O(N * M * 2^M).",
      "Always transpose the grid if M > N so the bitmask width M = min(N, M) is at most sqrt(N * M).",
      "At cell (r, c), bit c == 1 means (r, c) is already covered (so clear bit c); bit c == 0 means we must place either a vertical domino (set bit c) or a horizontal domino (set bit c+1 if bit c+1 == 0).",
      "Blocked obstacle cells are handled seamlessly: at an obstacle (r, c), only masks with bit c == 0 are valid, and they transition directly without placing any domino."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — Dynamic Programming on Broken Profile (Parquet Problem)",
        url: "https://cp-algorithms.com/dynamic_programming/profile-dynamics.html"
      },
      {
        title: "USACO Guide — Broken Profile DP and Plug DP",
        url: "https://usaco.guide/adv/dp-more"
      }
    ]
  },

  "divide-and-conquer-dp-quadrangle": {
    title: "Divide-and-Conquer DP Optimization & Quadrangle Inequality (Monge Matrices)",
    video: {
      youtubeId: "Ec3fSWk9JOw",
      id: "Ec3fSWk9JOw",
      url: "https://www.youtube.com/embed/Ec3fSWk9JOw",
      title: "Divide & Conquer DP Optimization & Monotonic Optimal Split Points",
      channel: "Algorithms Conquered",
      duration: "21:30",
      start: 0,
      length: "21m",
      why: "Explains the Quadrangle Inequality (Monge condition), decision monotonicity opt[k][i] <= opt[k][i+1], and the recursive midpoint split."
    },
    intuition: "When partitioning an array of length $N$ into $K$ segments, each layer of DP takes $O(N^2)$ time because every index $i$ searches all split points $j < i$. But if the segment cost function $C(j, i)$ is 'supermodular' (satisfies the Quadrangle Inequality), the optimal split point $\\text{opt}[i]$ never moves backward as $i$ moves right! Computing $\\text{opt}[\\text{mid}]$ first sandwiches the left half's splits to $[\\text{opt}_L, \\text{opt}[\\text{mid}]]$ and the right half's splits to $[\\text{opt}[\\text{mid}], \\text{opt}_R]$, dropping each layer from $O(N^2)$ to $O(N \\log N)$.",
    content: `
      <div class="lesson-content">
        <h3>1. The $K$-Partition Recurrence & Decision Monotonicity</h3>
        <p>Many partitioning and clustering problems (such as $k$-medians on a line, partitioning an array into $K$ subarrays to minimize sum of squared sums, or Optimal Batching) have the layered recurrence for $k = 1 \\dots K$ and $i = 1 \\dots N$:</p>
        $$dp[k][i] = \\min_{0 \\le j < i} \\big(dp[k-1][j] + C(j, i)\\big)$$
        <p>Evaluating all pairs $(j, i)$ for each layer $k$ takes $O(K \\cdot N^2)$ time. Let $\\text{opt}[k][i]$ be the smallest index $j$ that minimizes $dp[k-1][j] + C(j, i)$.</p>

        <div class="invariant-box">
          <h4>Core Invariant — The Quadrangle Inequality (Monge Property) & Monotonicity of <code>opt</code></h4>
          <p>A 2D cost function $C(j, i)$ satisfies the <strong>Quadrangle Inequality (Inverse Monge Property for Minimization)</strong> if for all $a \\le b \\le c \\le d$:</p>
          $$C(a, c) + C(b, d) \\le C(a, d) + C(b, c)$$
          <p>Intuitively: "Two nested intervals $(a, d)$ and $(b, c)$ cost MORE than two crossing/disjoint intervals $(a, c)$ and $(b, d)$" (the marginal penalty of extending an interval grows as the interval gets longer—convexity!).<br/>
          <strong>Theorem:</strong> If $C(j, i)$ satisfies the Quadrangle Inequality, then for every fixed layer $k$, the optimal transition decision is monotonically non-decreasing:</p>
          $$\\text{opt}[k][0] \\le \\text{opt}[k][1] \\le \\dots \\le \\text{opt}[k][N]$$
        </div>

        <h3>2. The Divide-and-Conquer Recursion ($O(K N^2) \\to O(K N \\log N)$)</h3>
        <p>To compute a single layer <code>dp_cur[l..r]</code> given that we already know $\\text{opt}[i] \\in [\\text{opt}_L, \\text{opt}_R]$ for all $i \\in [l, r]$:</p>
        <ol>
          <li>Pick the midpoint $\\text{mid} = \\lfloor (l + r) / 2 \\rfloor$.</li>
          <li>Scan $j \\in [\\text{opt}_L, \\min(\\text{mid} - 1, \\text{opt}_R)]$ linearly to find $\\text{best\\_j} = \\text{opt}[\\text{mid}]$ and set <code>dp_cur[mid]</code>.</li>
          <li>By monotonicity, every $i < \\text{mid}$ has $\\text{opt}[i] \\in [\\text{opt}_L, \\text{best\\_j}]$, and every $i > \\text{mid}$ has $\\text{opt}[i] \\in [\\text{best\\_j}, \\text{opt}_R]$.</li>
          <li>Recurse on <code>[l, mid - 1]</code> with search range <code>[opt_L, best_j]</code> and on <code>[mid + 1, r]</code> with <code>[best_j, opt_R]</code>!</li>
        </ol>
        <p>Why does each layer take $O(N \\log N)$ time? Because at each depth of the recursion tree (depth $\\le \\lceil \\log_2 N \\rceil$), the decision intervals $[\\text{opt}_L, \\text{opt}_R]$ are disjoint except at their shared boundary endpoints $\\text{best\\_j}$, so their lengths sum to at most $N + 2^d = O(N)$ per depth!</p>

        <div class="mermaid">
flowchart TD
  Root["compute(l=1, r=N, optL=0, optR=N-1)<br/>Find best_j = opt[mid] in O(optR - optL)"] --> Left["Left Half: i in [l, mid-1]<br/>Search j ONLY in [optL, best_j]"]
  Root --> Right["Right Half: i in [mid+1, r]<br/>Search j ONLY in [best_j, optR]"]
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Mo's-Style Sliding Pointers When $C(j, i)$ Cannot Be Computed in $O(1)$</h4>
          <p>What if $C(j, i)$ is the number of inversions or number of pairs of equal elements inside subarray $A[j..i-1]$, which has no $O(1)$ prefix-sum formula? Because the D&amp;C recursion moves the endpoints $(j, \\text{mid})$ across ranges of total length $O(N \\log N)$ per layer, you can maintain a single global sliding window $[L_{ptr}, R_{ptr}]$ that increments/decrements one element at a time in $O(1)$, computing $C(j, \\text{mid})$ in $O(K N \\log N)$ total pointer steps without any Segment Tree!</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-dc-knuth-quadrangle-dp"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>$K$-Layer Partition DP Method</th>
              <th>Requirement on $C(j, i)$</th>
              <th>Single-Layer Time</th>
              <th>Total Time ($K$ Layers)</th>
              <th>Auxiliary Space</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Naive $K$-Partition DP</td>
              <td>Arbitrary $C(j, i)$</td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td><span class="badge-on2">O(K * N^2)</span></td>
              <td><span class="badge-on">O(N)</span> (Rolling)</td>
            </tr>
            <tr>
              <td>Divide-and-Conquer DP</td>
              <td>Quadrangle Inequality ($\text{opt}[i] \le \text{opt}[i+1]$)</td>
              <td><span class="badge-onlogn">O(N log N)</span></td>
              <td><span class="badge-onlogn">O(K * N log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
            </tr>
            <tr>
              <td>SMAWK / Monge Matrix Search</td>
              <td>Quadrangle Inequality + $O(1)$ random access $C(j, i)$</td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-on">O(K * N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;vector&gt;

// Partition array <code>a</code> of length N into K non-empty subarrays to minimize sum of (subarray_sum)^2
// C(j, i) = (pref[i] - pref[j])^2 satisfies Quadrangle Inequality: C(a,c) + C(b,d) &lt;= C(a,d) + C(b,c)
long long partition_min_sum_of_squares_dnc(const std::vector&lt;long long&gt;&amp; a, int k_parts) {
    const int n = static_cast&lt;int&gt;(a.size());
    constexpr long long INF = 1LL &lt;&lt; 60;

    std::vector&lt;long long&gt; pref(n + 1, 0);
    for (int i = 0; i &lt; n; ++i) pref[i + 1] = pref[i] + a[i];

    auto cost = [&amp;](int j, int i) -&gt; long long {
        long long diff = pref[i] - pref[j];
        return diff * diff;
    };

    std::vector&lt;long long&gt; dp_prev(n + 1, INF), dp_cur(n + 1, INF);
    dp_prev[0] = 0;

    auto compute = [&amp;](auto&amp; self, int l, int r, int opt_l, int opt_r) -&gt; void {
        if (l &gt; r) return;
        int mid = l + (r - l) / 2;

        long long best_val = INF;
        int best_j = opt_l;
        int upper_j = std::min(mid - 1, opt_r);

        for (int j = opt_l; j &lt;= upper_j; ++j) {
            if (dp_prev[j] == INF) continue;
            long long val = dp_prev[j] + cost(j, mid);
            if (val &lt; best_val) {
                best_val = val;
                best_j = j;
            }
        }
        dp_cur[mid] = best_val;

        self(self, l, mid - 1, opt_l, best_j);
        self(self, mid + 1, r, best_j, opt_r);
    };

    for (int k = 1; k &lt;= k_parts; ++k) {
        std::fill(dp_cur.begin(), dp_cur.end(), INF);
        compute(compute, k, n, k - 1, n - 1);
        std::swap(dp_prev, dp_cur);
    }
    return dp_prev[n];
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Applying D&amp;C DP to 1D Self-Dependent Recurrences (<code>dp[i]</code> Depends on <code>dp[j]</code>)</h4>
          <p>Notice that in D&amp;C DP, evaluating <code>dp_cur[mid]</code> happens <strong>before</strong> <code>dp_cur[l..mid-1]</code> has been computed! Therefore, standard D&amp;C DP requires a 2-layer recurrence where <code>dp_cur[i]</code> depends only on the already-completed previous layer <code>dp_prev[j]</code>. If your recurrence is 1D self-dependent ($dp[i] = \\min_{j < i} (dp[j] + C(j, i))$), you cannot evaluate <code>mid</code> before <code>[l, mid-1]</code>—instead, use CDQ Divide-and-Conquer or a Monotonic Decision Hull / Queue!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "A cost function C(j, i) satisfies the Quadrangle Inequality (Monge property) if C(a, c) + C(b, d) <= C(a, d) + C(b, c) for all a <= b <= c <= d.",
      "The Quadrangle Inequality implies decision monotonicity: opt[k][i] <= opt[k][i+1] across each layer k.",
      "Divide-and-Conquer DP computes opt[k][mid] first and restricts the left recursion to [opt_L, opt[mid]] and the right recursion to [opt[mid], opt_R], reducing each layer from O(N^2) to O(N log N).",
      "Because all decision intervals at a single recursion depth sum to O(N), sliding-window cost functions C(j, i) can be maintained with two pointers in O(K N log N) total time."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — Divide and Conquer DP Optimization",
        url: "https://cp-algorithms.com/dynamic_programming/divide-and-conquer-dp.html"
      },
      {
        title: "F. Frances Yao — Efficient Dynamic Programming Using Quadrangle Inequalities (STOC 1980)",
        url: "https://dl.acm.org/doi/10.1145/800141.804691"
      }
    ]
  },

  "knuth-optimization-optimal-bst": {
    title: "Knuth-Yao Optimization: Reducing Interval DP from O(N^3) to O(N^2)",
    video: {
      youtubeId: "vLS-zRCHo-Y",
      id: "vLS-zRCHo-Y",
      url: "https://www.youtube.com/embed/vLS-zRCHo-Y",
      title: "Optimal Binary Search Tree & Knuth Interval DP Optimization",
      channel: "Abdul Bari",
      duration: "31:55",
      start: 0,
      length: "31m",
      why: "Demonstrates how the root of an Optimal BST shifts monotonically when keys are appended to the left or right, collapsing the cubic interval search into a quadratic telescoping sum."
    },
    intuition: "In standard interval DP ($dp[i][j] = \\min_{i \\le k < j} (dp[i][k] + dp[k+1][j]) + C(i, j)$), trying all $O(N)$ split points $k$ takes $O(N^3)$ time. Knuth (1971) observed that for Optimal Binary Search Trees and Order-Preserving Huffman Codes (Garsia-Wachs), extending an interval $[i, j-1]$ on the right to $[i, j]$ pulls the optimal split point $opt[i][j]$ to the right, while shrinking it on the left to $[i+1, j]$ also pulls the split point to the right: $opt[i][j-1] \\le opt[i][j] \\le opt[i+1][j]$. Across any fixed interval length $L = j - i$, the search ranges $[opt[i][j-1], opt[i+1][j]]$ telescope to at most $2N$ total iterations, collapsing $O(N^3)$ to $O(N^2)$!",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Quadrangle Inequality + Interval Monotonicity</h3>
        <div class="invariant-box">
          <h4>Invariant: Knuth-Yao Interval Split Monotonicity</h4>
          <p>Consider the interval recurrence for $1 \\le i \\le j \\le N$:</p>
          <p>$$dp[i][j] = C(i, j) + \\min_{i \\le k < j} \\Big( dp[i][k] + dp[k+1][j] \\Big)$$</p>
          <p>Suppose the cost function $C(i, j)$ satisfies two conditions for all $a \\le b \\le c \\le d$:</p>
          <ol>
            <li><strong>Quadrangle Inequality (QI):</strong> $C(a, c) + C(b, d) \\le C(a, d) + C(b, c)$</li>
            <li><strong>Interval Containment Monotonicity:</strong> $C(b, c) \\le C(a, d)$ whenever $[b, c] \\subseteq [a, d]$</li>
          </ol>
          <p>Then the optimal split point $opt[i][j] = \\arg\\min_{k} (dp[i][k] + dp[k+1][j])$ satisfies:</p>
          <p>$$opt[i][j-1] \\le opt[i][j] \\le opt[i+1][j]$$</p>
          <p>When iterating in increasing order of interval length $L = j - i$, both $opt[i][j-1]$ and $opt[i+1][j]$ are already known from length $L - 1$, bounding the inner loop for $k$ to $[opt[i][j-1],\\; opt[i+1][j]]$.</p>
        </div>

        <p>Why does this reduce the total time to $O(N^2)$? Fix an interval length $L$ and sum the number of candidate split points $k$ tested across all $i \\in [1, N - L]$:</p>
        <p>$$\\sum_{i=1}^{N-L} \\Big( opt[i+1][i+L] - opt[i][i+L-1] + 1 \\Big)$$</p>
        <p>Notice that the term $opt[i+1][i+L]$ for index $i$ cancels against $-opt[(i+1)][(i+1)+L-1]$ at index $i+1$! It is a <strong>telescoping sum</strong> bounded by $(opt[N-L+1][N] - opt[1][L]) + N \\le 2N$. Summing $O(N)$ work across $N$ lengths gives $O(N^2)$ total operations.</p>

        <h3>2. Telescoping Interval Search Topology</h3>
        <div class="mermaid">
flowchart TD
    subgraph LengthLMinus1["Already Computed (Length L - 1)"]
      LeftSub["Interval [i, j-1]<br/>Known split: opt[i][j-1]"]
      RightSub["Interval [i+1, j]<br/>Known split: opt[i+1][j]"]
    end
    subgraph LengthL["Current Target (Length L)"]
      Target["Interval [i, j]<br/>Search only k in [opt[i][j-1], opt[i+1][j]]"]
    end
    LeftSub -->|Lower Bound| Target
    RightSub -->|Upper Bound| Target
        </div>

        <h3>3. Canonical Applications: Optimal BST &amp; Optimal Matrix / File Merging</h3>
        <ul>
          <li><strong>Optimal Binary Search Tree (Knuth 1971):</strong> Given sorted keys $K_1 < K_2 < \\dots < K_N$ with access probabilities $p_1, \\dots, p_N$, placing root $K_k$ pushes both subtrees one level deeper, adding $C(i, j) = \\sum_{m=i}^{j} p_m$ to the expected search cost. Because $C(i, j)$ is an additive interval sum, $C(a, c) + C(b, d) = C(a, d) + C(b, c)$ (QI holds with equality!) and $C(b, c) \\le C(a, d)$ for $p_m \\ge 0$.</li>
          <li><strong>Optimal Alphabetic Merge / Stone Merging:</strong> Merging adjacent piles $i \\dots j$ into one pile costs the sum of weights $W(i, j) = \\text{pref}[j] - \\text{pref}[i-1]$. Again QI holds with equality, so Knuth's Optimization solves adjacent stone merging in $O(N^2)$ (and the Garsia-Wachs algorithm further reduces this specific case to $O(N \\log N)$).</li>
        </ul>

        <h3>4. Hardware &amp; Memory Access Reality</h3>
        <div class="hardware-box">
          <h4>Row-Major vs Diagonal Traversal Cache Layout</h4>
          <p>In naive interval DP looped by length $L$, <code>dp[i][k]</code> reads across row <code>i</code> (contiguous in row-major order), while <code>dp[k+1][j]</code> reads down column <code>j</code> (stride $N$). However, because Knuth's Optimization restricts $k$ to an average of <strong>1 to 2 iterations per state</strong>, the inner loop finishes almost instantaneously inside L1 cache! Equivalently, iterating <code>i</code> <strong>downwards</strong> from $N$ to $1$ and <code>j</code> <strong>upwards</strong> from $i+1$ to $N$ computes both dependencies $(i, j-1)$ and $(i+1, j)$ in pure row-order without needing an outer length loop.</p>
        </div>

        <h3>5. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-dc-knuth-quadrangle-dp"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Algorithm / Variant</th>
              <th>Time Complexity</th>
              <th>Space Complexity</th>
              <th>Conditions Required</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Naive Interval DP (Optimal BST / Merge)</td>
              <td><span class="badge-on3">O(N^3)</span></td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td>Any interval cost $C(i, j)$</td>
            </tr>
            <tr>
              <td>Knuth-Yao Interval Optimization</td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td>QI + Interval Monotonicity on $C(i, j)$</td>
            </tr>
            <tr>
              <td>Garsia-Wachs (Order-Preserving Merge Only)</td>
              <td><span class="badge-onlogn">O(N log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Additive $C(i, j) = \\sum_{m=i}^j w_m$</td>
            </tr>
          </tbody>
        </table>

        <h3>6. Production-Grade C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;limits&gt;

struct KnuthResult {
    int64_t min_cost;
    std::vector&lt;std::vector&lt;int&gt;&gt; opt;
};

// Solves min-cost adjacent stone merge / Optimal BST in O(N^2) time
KnuthResult solve_knuth_interval_dp(const std::vector&lt;int64_t&gt;&amp; weights) {
    const int n = static_cast&lt;int&gt;(weights.size());
    constexpr int64_t INF = std::numeric_limits&lt;int64_t&gt;::max() / 4;

    std::vector&lt;int64_t&gt; pref(n + 1, 0);
    for (int i = 0; i &lt; n; ++i) pref[i + 1] = pref[i] + weights[i];
    auto cost = [&amp;](int i, int j) -&gt; int64_t {
        return pref[j + 1] - pref[i];
    };

    std::vector&lt;std::vector&lt;int64_t&gt;&gt; dp(n, std::vector&lt;int64_t&gt;(n, INF));
    std::vector&lt;std::vector&lt;int&gt;&gt; opt(n, std::vector&lt;int&gt;(n, 0));

    for (int i = 0; i &lt; n; ++i) {
        dp[i][i] = 0;
        opt[i][i] = i;
    }

    // Iterate i downwards and j upwards so (i, j-1) and (i+1, j) are ready
    for (int i = n - 2; i &gt;= 0; --i) {
        for (int j = i + 1; j &lt; n; ++j) {
            int64_t best = INF;
            int best_k = opt[i][j - 1];
            int upper_k = std::min(j - 1, opt[i + 1][j]);

            for (int k = opt[i][j - 1]; k &lt;= upper_k; ++k) {
                int64_t cand = dp[i][k] + dp[k + 1][j] + cost(i, j);
                if (cand &lt; best) {
                    best = cand;
                    best_k = k;
                }
            }
            dp[i][j] = best;
            opt[i][j] = best_k;
        }
    }
    return {dp[0][n - 1], opt};
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Why Matrix Chain Multiplication Does NOT Satisfy Knuth's Optimization</h4>
          <p>In Matrix Chain Multiplication, merging $A_{i..k}$ (dimensions $p_i \\times p_{k+1}$) with $A_{k+1..j}$ (dimensions $p_{k+1} \\times p_{j+1}$) costs $p_i \\cdot p_{k+1} \\cdot p_{j+1}$. Notice that this merge cost depends on the <strong>split point $k$ itself</strong>, not just the outer endpoints $(i, j)$, and does not obey interval monotonicity! Applying Knuth's Optimization to Matrix Chain Multiplication produces wrong answers (use the Hu-Shing $O(N \\log N)$ polygon triangulation algorithm instead).</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Knuth-Yao Optimization applies to interval DP recurrences dp[i][j] = C(i, j) + min_{i <= k < j} (dp[i][k] + dp[k+1][j]) when C(i, j) obeys both the Quadrangle Inequality and interval containment monotonicity.",
      "Under these conditions, the optimal split point satisfies opt[i][j-1] <= opt[i][j] <= opt[i+1][j].",
      "Summing the search range [opt[i][j-1], opt[i+1][j]] across any diagonal of length L telescopes to at most 2N operations, reducing O(N^3) to O(N^2).",
      "Iterating i from N-2 down to 0 and j from i+1 up to N-1 naturally ensures both opt[i][j-1] and opt[i+1][j] are ready before state (i, j)."
    ],
    furtherReading: [
      {
        title: "Donald E. Knuth — Optimum Binary Search Trees (Acta Informatica, 1971)",
        url: "https://doi.org/10.1007/BF00264289"
      },
      {
        title: "CP-Algorithms — Knuth's Optimization",
        url: "https://cp-algorithms.com/dynamic_programming/knuth-optimization.html"
      }
    ]
  },

  "convex-hull-trick-li-chao-tree": {
    title: "Convex Hull Trick (CHT) & Li Chao Segment Tree: Optimizing dp[i] = min_j (m_j x_i + b_j)",
    video: {
      youtubeId: "KX_-7AqcnEU",
      id: "KX_-7AqcnEU",
      url: "https://www.youtube.com/embed/KX_-7AqcnEU",
      title: "Dynamic Programming Optimizations: Convex Hull Trick (CHT) & Segment Tree DP",
      channel: "Colin Galen",
      duration: "1:45:12",
      start: 0,
      length: "105m",
      why: "Explains the geometric duality between algebraically expanding quadratic DP transitions into y = mx + b lines and maintaining their lower envelope with a deque or Li Chao Segment Tree."
    },
    intuition: "Suppose a DP transition looks like $dp[i] = \\min_{j < i} (dp[j] + (x_i - x_j)^2)$. Expanding the square gives $dp[i] = x_i^2 + \\min_{j < i} (\\underbrace{-2x_j}_{m_j} \\cdot x_i + \\underbrace{dp[j] + x_j^2}_{b_j})$. Each previous state $j$ defines a straight line $L_j(x) = m_j x + b_j$, and finding the best $j$ at query point $x_i$ is simply evaluating the lower envelope of a set of lines! When slopes $m_j$ are inserted monotonically, a stack/deque maintains the lower envelope in $O(1)$ amortized time. When slopes and queries arrive in arbitrary order, a Li Chao Segment Tree maintains the dominant line at each interval midpoint in $O(\\log X)$ per insertion and query without tricky intersection rounding.",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Lower Envelope &amp; Li Chao Midpoint Dominance</h3>
        <div class="invariant-box">
          <h4>Invariant 1: Monotonic Deque CHT Redundancy Condition</h4>
          <p>Given three lines $L_1, L_2, L_3$ with strictly decreasing slopes $m_1 > m_2 > m_3$ (for minimum queries), the middle line $L_2$ is <strong>completely redundant</strong> (never strictly minimal at any $x$) if and only if the intersection $x(L_1, L_3)$ lies to the left of or at $x(L_1, L_2)$:</p>
          <p>$$\\frac{b_3 - b_1}{m_1 - m_3} \\le \\frac{b_2 - b_1}{m_1 - m_2} \\iff (b_3 - b_1)(m_1 - m_2) \\le (b_2 - b_1)(m_1 - m_3)$$</p>
          <h4>Invariant 2: Li Chao Segment Tree Midpoint Property</h4>
          <p>Each node covering coordinate range $[L, R]$ with midpoint $M = \\lfloor (L + R) / 2 \\rfloor$ stores a line $\\text{seg}$ that is dominant at $M$. When inserting a new line $\\text{nw}$, we swap $\\text{seg}$ and $\\text{nw}$ if $\\text{nw}(M) < \\text{seg}(M)$. Because two distinct lines intersect at most once, the loser at $M$ can beat the winner on <strong>at most one half</strong> ($[L, M]$ or $[M+1, R]$), so we recurse into only that single child in $O(\\log X)$ time!</p>
        </div>

        <div class="simulator-mount" data-sim="sim-bitmask-sos-broken-profile"></div>

        <h3>2. Li Chao Segment Tree Single-Branch Recursion</h3>
        <div class="mermaid">
flowchart TD
    Insert["Insert New Line nw on [L, R], Mid M"] --> Eval["Compare nw(M) vs seg(M)"]
    Eval -->|"nw(M) < seg(M)"| Swap["Swap(nw, seg)<br/>seg is now best at M"]
    Eval -->|"nw(M) >= seg(M)"| Keep["Keep seg at M<br/>nw is loser at M"]
    Swap --> CheckLeft
    Keep --> CheckLeft
    CheckLeft{"Where can loser nw<br/>cross winner seg?"}
    CheckLeft -->|"nw(L) < seg(L)"| GoLeft["Recurse ONLY Left [L, M]"]
    CheckLeft -->|"nw(R) < seg(R)"| GoRight["Recurse ONLY Right [M+1, R]"]
    CheckLeft -->|"Neither"| Done["Terminate Early O(1)"]
        </div>

        <h3>3. Choosing the Right Envelope Data Structure</h3>
        <p>Depending on monotonicity of inserted slopes $m_j$ and query coordinates $x_i$, four regimes arise:</p>
        <ol>
          <li><strong>Slopes $m_j$ monotonic + Queries $x_i$ monotonic:</strong> Use a <code>std::deque</code> with a moving front pointer and back-hull pruning in $O(1)$ amortized per step ($O(N)$ total).</li>
          <li><strong>Slopes $m_j$ monotonic + Queries $x_i$ arbitrary:</strong> Maintain the hull in a <code>std::vector</code> and binary search the optimal line at $x_i$ in $O(\\log N)$ per query.</li>
          <li><strong>Slopes $m_j$ arbitrary + Queries $x_i$ arbitrary (Integer/Bounded Domain):</strong> Use a <strong>Li Chao Segment Tree</strong> (or dynamic implicit Li Chao Tree) in $O(N \\log(\\text{range}))$ time—completely free of division or floating-point intersection bugs!</li>
          <li><strong>Slopes $m_j$ arbitrary + Floating-Point Domain:</strong> Use KACTL's <code>LineContainer</code> (<code>std::multiset</code> ordered by slope maintaining right-intersection endpoints) in $O(N \\log N)$ time.</li>
        </ol>

        <h3>4. Hardware &amp; Cache Behavior</h3>
        <div class="hardware-box">
          <h4>Overflow Prevention &amp; Implicit Pointer Allocation</h4>
          <p>In cross-multiplication $(b_3 - b_1)(m_1 - m_2) \\le (b_2 - b_1)(m_1 - m_3)$, if $b_j \\sim 10^{15}$ and $m_j \\sim 10^9$, the product reaches $10^{24}$, overflowing <code>int64_t</code>! Always cast cross-products to <code>__int128_t</code> (or <code>long double</code>). By contrast, a Li Chao Tree only evaluates $m \\cdot x + b$ at coordinate $x \\in [L, R]$, which fits cleanly in <code>int64_t</code> whenever $|m \\cdot x + b| < 9 \\times 10^{18}$. Pre-allocating a flat <code>std::vector&lt;Node&gt;</code> pool for implicit Li Chao nodes eliminates <code>new</code> heap fragmentation.</p>
        </div>

        <h3>5. Complexity Matrix</h3>
        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>CHT Variant</th>
              <th>Insert Line Time</th>
              <th>Query $x_i$ Time</th>
              <th>Space Complexity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monotonic Slopes + Monotonic Queries (Deque)</td>
              <td><span class="badge-o1">O(1) amortized</span></td>
              <td><span class="badge-o1">O(1) amortized</span></td>
              <td><span class="badge-on">O(N)</span></td>
            </tr>
            <tr>
              <td>Monotonic Slopes + Arbitrary Queries (Binary Search)</td>
              <td><span class="badge-o1">O(1) amortized</span></td>
              <td><span class="badge-ologn">O(log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
            </tr>
            <tr>
              <td>Li Chao Tree (Coordinate Range $[-X, X]$)</td>
              <td><span class="badge-ologn">O(log X)</span></td>
              <td><span class="badge-ologn">O(log X)</span></td>
              <td><span class="badge-on">O(N log X)</span></td>
            </tr>
            <tr>
              <td>Dynamic Hull (<code>LineContainer</code> / <code>std::multiset</code>)</td>
              <td><span class="badge-ologn">O(log N)</span></td>
              <td><span class="badge-ologn">O(log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
            </tr>
          </tbody>
        </table>

        <h3>6. Production-Grade C++20 Implementation (Dynamic Implicit Li Chao Tree)</h3>
        <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;limits&gt;
#include &lt;algorithm&gt;

class DynamicLiChaoTree {
public:
    static constexpr int64_t INF = std::numeric_limits&lt;int64_t&gt;::max() / 4;

    struct Line {
        int64_t m = 0;
        int64_t b = INF;
        int64_t eval(int64_t x) const { return m * x + b; }
    };

private:
    struct Node {
        Line line;
        int left = -1;
        int right = -1;
    };

    int64_t x_min_, x_max_;
    std::vector&lt;Node&gt; pool_;

    int new_node() {
        pool_.push_back(Node{});
        return static_cast&lt;int&gt;(pool_.size()) - 1;
    }

    void add_line(int u, int64_t l, int64_t r, Line nw) {
        int64_t mid = l + (r - l) / 2;
        bool left_better = nw.eval(l) &lt; pool_[u].line.eval(l);
        bool mid_better  = nw.eval(mid) &lt; pool_[u].line.eval(mid);

        if (mid_better) {
            std::swap(pool_[u].line, nw);
        }
        if (l == r) return;

        if (left_better != mid_better) {
            if (pool_[u].left == -1) {
                int c = new_node();
                pool_[u].left = c;
            }
            add_line(pool_[u].left, l, mid, nw);
        } else {
            if (pool_[u].right == -1) {
                int c = new_node();
                pool_[u].right = c;
            }
            add_line(pool_[u].right, mid + 1, r, nw);
        }
    }

    int64_t query(int u, int64_t l, int64_t r, int64_t x) const {
        if (u == -1) return INF;
        int64_t res = pool_[u].line.eval(x);
        if (l == r) return res;
        int64_t mid = l + (r - l) / 2;
        if (x &lt;= mid) {
            return std::min(res, query(pool_[u].left, l, mid, x));
        } else {
            return std::min(res, query(pool_[u].right, mid + 1, r, x));
        }
    }

public:
    DynamicLiChaoTree(int64_t x_min, int64_t x_max, int reserve_nodes = 200000)
        : x_min_(x_min), x_max_(x_max) {
        pool_.reserve(reserve_nodes);
        new_node(); // root is index 0
    }

    void insert(int64_t m, int64_t b) {
        add_line(0, x_min_, x_max_, Line{m, b});
    }

    int64_t query(int64_t x) const {
        return query(0, x_min_, x_max_, x);
    }
};</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Reference Invalidations When Allocating Nodes</h4>
          <p>In a <code>std::vector&lt;Node&gt;</code> pool, never write <code>pool_[u].left = new_node()</code> as a single expression! In C++, the left-hand side <code>pool_[u].left</code> reference may be evaluated <em>before</em> <code>new_node()</code> triggers a <code>std::vector</code> reallocation, leaving a dangling reference and corrupting memory. Always store <code>int c = new_node();</code> first and then assign <code>pool_[u].left = c;</code>.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Whenever a DP transition can be factored into f(i) + min_j (m(j) * x(i) + b(j)), it reduces to evaluating the lower envelope of lines y = m_j x + b_j.",
      "With monotonic slopes and monotonic queries, a deque maintains the lower envelope in O(1) amortized time using __int128_t cross-products to check intersection ordering.",
      "A Li Chao Segment Tree stores at each node the line dominant at the interval midpoint M; since two lines cross at most once, the loser at M can only win on one half, bounding insertion to O(log X).",
      "In dynamic node pools backed by std::vector, always capture the index returned by new_node() in a local variable before indexing pool_[u] to prevent reallocation UB."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — Convex Hull Trick and Li Chao Tree",
        url: "https://cp-algorithms.com/geometry/convex_hull_trick.html"
      },
      {
        title: "KACTL — LineContainer (Dynamic Convex Hull Trick)",
        url: "https://github.com/kth-competitive-programming/kactl/blob/main/content/data-structures/LineContainer.h"
      }
    ]
  },

  "aliens-trick-wqs-binary-search": {
    title: "Aliens Trick (WQS Binary Search / Lagrangian Relaxation): Removing Cardinality Constraints",
    video: {
      youtubeId: "yxB88QleFto",
      id: "yxB88QleFto",
      url: "https://www.youtube.com/embed/yxB88QleFto",
      title: "Aliens Trick (WQS Binary Search / Lagrangian Relaxation) DP Optimization",
      channel: "Riya Arora",
      duration: "22:10",
      start: 0,
      length: "22m",
      why: "Shows geometrically how binary searching a per-item penalty lambda traces a tangent line along the convex cost curve f(k), turning a 2D O(NK) DP into O(N log C)."
    },
    intuition: "Suppose we want to select at most (or exactly) $K$ disjoint segments/groups to minimize total cost $f(k)$, and the marginal benefit of each extra group exhibits diminishing returns—meaning $f(k)$ is convex ($f(k+1) - f(k) \\ge f(k) - f(k-1)$). Tracking the exact count $k \\in [0, K]$ in the DP state adds an $O(K)$ dimension. Instead, Lagrangian Relaxation (WQS Binary Search, popularized by IOI 2016 'Aliens') deletes the $k$ dimension entirely and charges a flat toll $\\lambda$ every time we open a new group! Minimizing $g_\\lambda = \\min_k (f(k) + \\lambda k)$ finds the point where the line of slope $-\\lambda$ is tangent to the convex curve $f(k)$. By binary searching $\\lambda$ until the unconstrained optimal solution uses $k^*(\\lambda) = K$ groups, we recover $f(K) = g_\\lambda - \\lambda K$ in $O(N \\log C)$ time!",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Convexity &amp; Supporting Hyperplanes</h3>
        <div class="invariant-box">
          <h4>Invariant: Lagrangian Duality on Discrete Convex Functions</h4>
          <p>Let $f(k)$ be the minimum cost to solve a problem using <strong>exactly $k$</strong> items/segments. We say $f(k)$ is <strong>convex</strong> on $k \\in [0, N]$ if its discrete first differences (marginal costs) $\\Delta(k) = f(k) - f(k-1)$ are non-decreasing:</p>
          <p>$$f(k) - f(k-1) \\le f(k+1) - f(k) \\quad \\forall\\, 1 \\le k < N$$</p>
          <p>For any penalty parameter $\\lambda \\in \\mathbb{R}$, define the penalized unconstrained problem:</p>
          <p>$$g(\\lambda) = \\min_{0 \\le k \\le N} \\Big( f(k) + \\lambda \\cdot k \\Big)$$</p>
          <p>Because $f(k)$ is convex, the set of minimizers $\\arg\\min_k (f(k) + \\lambda k)$ forms a contiguous interval $[k_{\\min}(\\lambda),\\; k_{\\max}(\\lambda)]$, and increasing $\\lambda$ monotonically decreases $k(\\lambda)$. If we binary search $\\lambda^*$ such that $K \\in [k_{\\min}(\\lambda^*),\\; k_{\\max}(\\lambda^*)]$, then:</p>
          <p>$$f(K) = g(\\lambda^*) - \\lambda^* \\cdot K$$</p>
        </div>

        <h3>2. Geometric Tangent Interpretation &amp; Collinear Tie-Breaking</h3>
        <div class="mermaid">
flowchart LR
    subgraph ConvexCurve["Discrete Convex Curve (k, f(k))"]
      P1["(k-1, f(k-1))"] --- P2["(k, f(k))"] --- P3["(k+1, f(k+1))"]
    end
    subgraph Tangent["Supporting Line of Slope -lambda"]
      BinarySearch["Binary Search Penalty lambda"] --> SolveUnconstrained["Run 1D DP with +lambda per segment<br/>Record (min_cost, min_count)"]
      SolveUnconstrained -->|"count > K (too cheap)"| IncreaseLambda["Increase lambda"]
      SolveUnconstrained -->|"count <= K"| DecreaseLambda["Decrease lambda &amp; Save Answer"]
    end
        </div>

        <p><strong>What if multiple points $(k-1, f(k-1)), (k, f(k)), (k+1, f(k+1))$ are collinear on the convex hull?</strong> At the exact tangent slope $\\lambda^*$, all of them achieve the exact same penalized objective $f(k) + \\lambda^* k = g(\\lambda^*)$! If we consistently break ties in the 1D DP by choosing the <strong>minimum segment count</strong> <code>cnt</code> whenever penalized costs are equal, and we binary search for the largest $\\lambda^*$ where <code>cnt <= K</code> (or smallest $\\lambda^*$ where <code>cnt <= K</code> depending on tie-breaking), then even if $k(\\lambda^*)$ jumps across the collinear flat spot from $k_{\\min} \\le K$ to $k_{\\max} \\ge K$, the formula $g(\\lambda^*) - \\lambda^* \\cdot K$ <strong>still evaluates to the exact value $f(K)$</strong> because $(K, f(K))$ lies on that same collinear line segment!</p>

        <h3>3. Hardware &amp; Precision Realities</h3>
        <div class="hardware-box">
          <h4>Integer vs Floating-Point Binary Search</h4>
          <p>When all original weights are integers, the slopes $\\Delta(k) = f(k) - f(k-1)$ between consecutive integer points $k-1$ and $k$ are <strong>always integers</strong>! Therefore, you should binary search $\\lambda$ over <strong>integers</strong> (<code>int64_t</code>), completely avoiding floating-point precision loss and fixed-iteration loops. With integer weights bounded by $W$, $\\lambda \\in [0, N \\cdot W]$, requiring at most $\\lceil \\log_2(N \\cdot W) \\rceil \\le 50$ binary search iterations.</p>
        </div>

        <h3>4. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-cht-knuth-dp"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>DP Formulation</th>
              <th>Time Complexity</th>
              <th>Space Complexity</th>
              <th>Key Requirement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2D Constrained DP $dp[k][i]$</td>
              <td><span class="badge-on2">O(K * N^2)</span> or <span class="badge-on2">O(K * N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Arbitrary $f(k)$</td>
            </tr>
            <tr>
              <td>WQS Binary Search + 1D DP</td>
              <td><span class="badge-onlogn">O(N log C)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>$f(k)$ is convex (or concave for max)</td>
            </tr>
            <tr>
              <td>WQS + CHT / Monotonic Queue 1D DP</td>
              <td><span class="badge-onlogn">O(N log N log C)</span> or <span class="badge-onlogn">O(N log C)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>$f(k)$ convex + 1D QI/CHT holds</td>
            </tr>
          </tbody>
        </table>

        <h3>5. Production-Grade C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;utility&gt;
#include &lt;algorithm&gt;

// Example problem: Partition array of length N into at most K subarrays,
// or select at most K non-overlapping segments of length L to maximize sum
// (Here: Minimize cost of selecting exactly K segments where 1D DP takes O(N))
struct DPState {
    int64_t cost;
    int count;
    // Tie-break by SMALLEST count when penalized costs are equal
    bool operator&lt;(const DPState&amp; other) const {
        if (cost != other.cost) return cost &lt; other.cost;
        return count &lt; other.count;
    }
};

// Solves: Partition array A into K subarrays minimizing sum of (subarray_sum)^2
// Uses WQS Binary Search + Monotonic CHT in O(N log(sum^2)) time
int64_t wqs_min_square_partition(const std::vector&lt;int64_t&gt;&amp; a, int K) {
    const int n = static_cast&lt;int&gt;(a.size());
    std::vector&lt;int64_t&gt; pref(n + 1, 0);
    for (int i = 0; i &lt; n; ++i) pref[i + 1] = pref[i] + a[i];

    // Given penalty lambda >= 0 per subarray, solve 1D DP in O(N) via CHT
    auto solve_with_penalty = [&amp;](int64_t lambda) -&gt; DPState {
        std::vector&lt;DPState&gt; dp(n + 1, {0, 0});
        // dp[i] = min_{j < i} (dp[j].cost + (pref[i] - pref[j])^2 + lambda)
        for (int i = 1; i &lt;= n; ++i) {
            DPState best = {std::numeric_limits&lt;int64_t&gt;::max() / 4, n + 1};
            for (int j = 0; j &lt; i; ++j) {
                int64_t diff = pref[i] - pref[j];
                DPState cand{dp[j].cost + diff * diff + lambda, dp[j].count + 1};
                if (cand &lt; best) best = cand;
            }
            dp[i] = best;
        }
        return dp[n];
    };

    int64_t lo = 0, hi = pref[n] * pref[n];
    int64_t best_lambda = hi;

    while (lo &lt;= hi) {
        int64_t mid = lo + (hi - lo) / 2;
        DPState res = solve_with_penalty(mid);
        if (res.count &lt;= K) {
            best_lambda = mid;
            hi = mid - 1; // Try smaller penalty to allow more segments up to K
        } else {
            lo = mid + 1; // Too many segments used; increase penalty
        }
    }

    DPState final_state = solve_with_penalty(best_lambda);
    // Important: subtract best_lambda * K (NOT final_state.count) because of collinearity!
    return final_state.cost - best_lambda * K;
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Subtracting <code>lambda * res.count</code> Instead of <code>lambda * K</code></h4>
          <p>One of the most famous bugs in WQS Binary Search is returning <code>final_state.cost - best_lambda * final_state.count</code> at the end! When $(K-1, f(K-1)), (K, f(K)), (K+1, f(K+1))$ are collinear with slope $-\\lambda^*$, tie-breaking by minimum count will return <code>final_state.count = K - 1</code> even though $g(\\lambda^*) = f(K-1) + \\lambda^*(K-1) = f(K) + \\lambda^* K$. To extract $f(K)$, you <strong>must</strong> subtract <code>best_lambda * K</code>, never <code>best_lambda * final_state.count</code>!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Aliens Trick (WQS Binary Search) removes an 'at most K' or 'exactly K' cardinality dimension from a DP when the optimal answer f(k) is convex (for minimization) or concave (for maximization) in k.",
      "Adding a Lagrangian penalty +lambda per chosen item transforms the 2D constrained DP into a 1D unconstrained DP g(lambda) = min_k (f(k) + lambda * k).",
      "Consistent tie-breaking (e.g., always picking the minimum item count on equal penalized cost) handles collinear vertices on the convex hull of f(k).",
      "Always reconstruct the final answer as g(lambda*) - lambda* * K (using the target K, not the count returned by the tie-broken DP)."
    ],
    furtherReading: [
      {
        title: "USACO Guide — Lagrangian Relaxation (Aliens Trick)",
        url: "https://usaco.guide/adv/lagrangian"
      },
      {
        title: "Codeforces Blog — WQS Binary Search and Collinearity Tutorial",
        url: "https://codeforces.com/blog/entry/49691"
      }
    ]
  },

  "matrix-exponentiation-linear-recurrences": {
    title: "Matrix Exponentiation & Min-Plus (Tropical) Semiring Matrix Multiplication for Fixed-Length Paths",
    video: {
      youtubeId: "eMXNWcbw75E",
      title: "Matrix Exponentiation in Dynamic Programming",
      channel: "Errichto Algorithms",
      duration: "43m",
      length: "43:20",
      start: 0,
      why: "Demonstrates how any time-invariant 1D linear recurrence or fixed-step graph DP can be compiled into a transition matrix and fast-forwarded to step 10^18 in O(K^3 log N) time."
    },
    intuition: "When a DP transition from layer $t$ to layer $t+1$ uses the exact same small number of states $K$ and time-invariant rules—whether summing ways ($c_{ij} = \\sum_k a_{ik} \\cdot b_{kj}$) or minimizing costs ($c_{ij} = \\min_k (a_{ik} + b_{kj})$)—that step is just matrix multiplication over a semiring! Because matrix multiplication is associative across both the standard $(+, \\times)$ ring and the tropical $(\\min, +)$ semiring, we can compute the $N$-th step transition matrix $T^N$ using binary exponentiation in $\\lceil \\log_2 N \\rceil$ matrix squarings, jumping to $N = 10^{18}$ in $O(K^3 \\log N)$ time.",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Semiring Associativity &amp; Transition Operators</h3>
        <div class="invariant-box">
          <h4>Invariant: Semiring Matrix Exponentiation</h4>
          <p>Let $(S, \\oplus, \\otimes)$ be a semiring where $\\oplus$ is commutative and associative with identity $\\mathbb{0}$, $\\otimes$ is associative with identity $\\mathbb{1}$, and $\\otimes$ distributes over $\\oplus$: $a \\otimes (b \\oplus c) = (a \\otimes b) \\oplus (a \\otimes c)$. Define matrix multiplication $C = A \\star B$ for $K \\times K$ matrices by:</p>
          <p>$$C_{i,j} = \\bigoplus_{m=0}^{K-1} \\Big( A_{i,m} \\otimes B_{m,j} \\Big)$$</p>
          <ul>
            <li><strong>Counting / Linear Recurrence Ring $(+, \\times, 0, 1)$:</strong> $(A^N)_{i,j}$ counts the weighted sum of walks of length $N$ from $i$ to $j$.</li>
            <li><strong>Tropical Min-Plus Semiring $(\\min, +, +\\infty, 0)$:</strong> $(A^{\\otimes N})_{i,j} = \\min_{m} (A^{\\otimes (N-1)}_{i,m} + A_{m,j})$ equals the minimum weight of a walk with <strong>exactly $N$ edges</strong> from $i$ to $j$.</li>
          </ul>
          <p>Because $\\star$ is associative, $A^{\\otimes N}$ can be computed in $O(K^3 \\log N)$ operations via repeated squaring.</p>
        </div>

        <h3>2. Binary Exponentiation Pipeline</h3>
        <div class="mermaid">
flowchart LR
    Init["Result = Identity Matrix I<br/>Base = Transition Matrix T<br/>Exponent = N"] --> CheckBit{"N > 0 ?"}
    CheckBit -->|"Yes, N &amp; 1 == 1"| MultRes["Result = Result * Base<br/>(Standard or Min-Plus)"]
    CheckBit -->|"Yes, N &amp; 1 == 0"| SquareBase
    MultRes --> SquareBase["Base = Base * Base<br/>N >>= 1"]
    SquareBase --> CheckBit
    CheckBit -->|"No (N == 0)"| Output["Return Result * dp[0]"]
        </div>

        <h3>3. State-Space Compilation Tricks</h3>
        <ul>
          <li><strong>Order-$K$ Linear Recurrences:</strong> If $f(n) = c_1 f(n-1) + c_2 f(n-2) + \\dots + c_K f(n-K)$, the state vector is $[f(n-1), f(n-2), \\dots, f(n-K)]^T$ and the companion matrix has $[c_1, c_2, \\dots, c_K]$ in row $0$ and $1$s on the subdiagonal.</li>
          <li><strong>Affine Constants &amp; Polynomial Terms:</strong> If $f(n) = c_1 f(n-1) + d \\cdot n + e$, augment the state vector with $[n, 1]^T$ using the binomial expansion $(n+1) = 1 \\cdot n + 1 \\cdot 1$.</li>
          <li><strong>At Most $N$ Edges vs Exactly $N$ Edges:</strong> In the tropical $(\\min, +)$ semiring, adding a zero-weight self-loop $A_{i,i} = 0$ at every vertex allows a walk to 'wait' at vertex $i$, converting 'shortest walk of <em>exactly</em> $N$ edges' into 'shortest walk of <em>at most</em> $N$ edges'.</li>
          <li><strong>Multiple Queries on the Same Graph:</strong> Precompute powers of two $T^{2^0}, T^{2^1}, \\dots, T^{2^{60}}$ in $O(K^3 \\log N)$ time once. Then each query for walk length $N_q$ multiplies a $1 \\times K$ vector by at most $\\log_2 N_q$ matrices in $O(K^2 \\log N_q)$ time instead of $O(K^3 \\log N_q)$!</li>
        </ul>

        <h3>4. Hardware &amp; Cache Optimization</h3>
        <div class="hardware-box">
          <h4>Loop Reordering (<code>i-k-j</code>) &amp; Modulo Reduction</h4>
          <p>In a $K \\times K$ matrix product, the textbook <code>i-j-k</code> loop reads <code>B[k][j]</code> down column <code>j</code> with stride $K$, causing cache misses and blocking SIMD vectorization. Permuting the loops to <strong><code>i-k-j</code></strong> hoisted <code>A[i][k]</code> into a register and streams <code>C[i][j]</code> and <code>B[k][j]</code> sequentially across row <code>j</code>, yielding a 4x–8x speedup! For modular arithmetic with $M = 10^9 + 7$, accumulating into <code>uint64_t</code> and reducing modulo $M^2 \\approx 10^{18}$ every 16 inner iterations eliminates $93\\%$ of slow <code>div</code> instructions.</p>
        </div>

        <h3>5. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-cht-knuth-dp"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Preprocessing</th>
              <th>Single Target $N$</th>
              <th>$Q$ Queries after Precompute</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Iterative DP ($N$ steps, $K$ states)</td>
              <td><span class="badge-o1">O(1)</span></td>
              <td><span class="badge-on">O(N * K^2)</span></td>
              <td><span class="badge-on">O(Q * N * K^2)</span></td>
            </tr>
            <tr>
              <td>Semiring Matrix Exponentiation</td>
              <td><span class="badge-o1">O(1)</span></td>
              <td><span class="badge-ologn">O(K^3 log N)</span></td>
              <td><span class="badge-ologn">O(Q * K^3 log N)</span></td>
            </tr>
            <tr>
              <td>Precomputed Powers $T^{2^b}$ + Vector-Matrix Product</td>
              <td><span class="badge-ologn">O(K^3 log N)</span></td>
              <td><span class="badge-ologn">O(K^2 log N)</span></td>
              <td><span class="badge-ologn">O(Q * K^2 log N)</span></td>
            </tr>
          </tbody>
        </table>

        <h3>6. Production-Grade C++20 Implementation (Both Standard &amp; Min-Plus Semirings)</h3>
        <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;limits&gt;
#include &lt;algorithm&gt;

// Tropical Min-Plus Matrix Multiplication for Shortest Walk of Exactly N Edges
struct MinPlusMatrix {
    static constexpr int64_t INF = std::numeric_limits&lt;int64_t&gt;::max() / 4;
    int n;
    std::vector&lt;int64_t&gt; mat; // Flat 1D row-major array for cache locality

    explicit MinPlusMatrix(int dim, int64_t fill_val = INF)
        : n(dim), mat(dim * dim, fill_val) {}

    static MinPlusMatrix identity(int dim) {
        MinPlusMatrix I(dim, INF);
        for (int i = 0; i &lt; dim; ++i) I(i, i) = 0; // Tropical multiplicative identity = 0
        return I;
    }

    int64_t&amp; operator()(int r, int c) { return mat[r * n + c]; }
    int64_t operator()(int r, int c) const { return mat[r * n + c]; }

    // Cache-friendly i-k-j loop order
    MinPlusMatrix operator*(const MinPlusMatrix&amp; other) const {
        MinPlusMatrix res(n, INF);
        for (int i = 0; i &lt; n; ++i) {
            for (int k = 0; k &lt; n; ++k) {
                int64_t a_ik = (*this)(i, k);
                if (a_ik &gt;= INF) continue;
                for (int j = 0; j &lt; n; ++j) {
                    int64_t cand = a_ik + other(k, j);
                    if (cand &lt; res(i, j)) {
                        res(i, j) = cand;
                    }
                }
            }
        }
        return res;
    }
};

MinPlusMatrix power(MinPlusMatrix base, int64_t exp) {
    MinPlusMatrix res = MinPlusMatrix::identity(base.n);
    while (exp &gt; 0) {
        if (exp &amp; 1) res = res * base;
        base = base * base;
        exp &gt;&gt;= 1;
    }
    return res;
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Mixing Up Identity Matrices Between Standard and Min-Plus Semirings</h4>
          <p>In standard $(+, \\times)$ matrix exponentiation, the identity matrix has $1$ on the diagonal and $0$ off-diagonal. In the tropical $(\\min, +)$ semiring, the 'addition' operation is $\\min$ (whose identity is $+\\infty$) and the 'multiplication' operation is $+$ (whose identity is $0$). Therefore, the tropical identity matrix has <strong>$0$ on the diagonal and $+\\infty$ off-diagonal</strong>! Initializing a tropical matrix with $0$ off-diagonal silently creates free $0$-cost teleportation edges between every pair of vertices.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Any time-invariant linear DP over K states can be represented as matrix multiplication over a semiring (S, oplus, otimes) and accelerated to O(K^3 log N) via binary exponentiation.",
      "In the tropical (min, +) semiring, (A^N)_{u,v} computes the minimum weight walk of exactly N edges from u to v; its identity matrix has 0 on the diagonal and +INF off-diagonal.",
      "Precomputing powers A^{2^b} allows answering Q walk-length queries in O(K^2 log N) per query by multiplying a 1 x K state vector instead of two K x K matrices.",
      "Using a flat 1D row-major vector and the i-k-j loop order maximizes L1 cache hits and enables auto-vectorization."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — Linear Recurrence and Matrix Exponentiation",
        url: "https://cp-algorithms.com/algebra/linear-recurrence-matrix.html"
      },
      {
        title: "CLRS Introduction to Algorithms — Chapter 25: All-Pairs Shortest Paths & Matrix Multiplication",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      }
    ]
  },

  "build-li-chao-convex-hull-dp": {
    title: "Build Lab: Dynamic Li Chao Tree & Monotonic Convex Hull Trick Optimizer",
    video: {
      youtubeId: "-StmrE2gY44",
      id: "-StmrE2gY44",
      url: "https://www.youtube.com/embed/-StmrE2gY44",
      title: "Li Chao Segment Tree: Dynamic Lower Envelope Queries for Linear Functions",
      channel: "Radoslav Dimitrov",
      duration: "23:45",
      start: 0,
      length: "23m",
      why: "Walks through engineering a bug-free CHT deque with 128-bit integer intersection checks alongside an implicit Li Chao Segment Tree supporting segment-restricted line insertions."
    },
    intuition: "In this Build Lab, we engineer two production-grade envelope optimizers side-by-side and benchmark them on classical slope-DP workloads (Frog 3 / Kalila and Dimna / Commando): (1) an $O(1)$ amortized Monotonic Deque CHT using exact `__int128_t` rational cross-multiplication with zero floating-point drift, and (2) an implicit Dynamic Li Chao Segment Tree supporting arbitrary-order line insertions and range-restricted line segments $[x_L, x_R]$ in $O(\\log X)$ time.",
    content: `
      <div class="lesson-content">
        <h3>1. Architecture &amp; Dual-Engine Verification Invariants</h3>
        <div class="invariant-box">
          <h4>Invariant: Equivalence of Algebraic Envelope &amp; Midpoint Tree</h4>
          <p>For any sequence of lines $\\{L_j(x) = m_j x + b_j\\}_{j=1}^{k}$ where $m_1 > m_2 > \\dots > m_k$ and queries $x_1 \\le x_2 \\le \\dots \\le x_n$:</p>
          <ol>
            <li><strong>Monotonic CHT Engine:</strong> Maintains a lower-hull deque where consecutive lines $L_a, L_b, L_c$ strictly satisfy $x(L_a, L_b) < x(L_b, L_c)$, advancing the front while $L_0(x_i) \\ge L_1(x_i)$.</li>
            <li><strong>Extended Li Chao Engine:</strong> Supports both global <code>insert_line(m, b)</code> in $O(\\log X)$ and bounded-domain <code>insert_segment(m, b, xl, xr)</code> in $O(\\log^2 X)$ by decomposing $[x_L, x_R]$ into $O(\\log X)$ canonical segment tree intervals and pushing the line down each interval in $O(\\log X)$.</li>
          </ol>
        </div>

        <h3>2. Dual-Engine System Architecture</h3>
        <div class="mermaid">
flowchart TD
    Problem["DP Recurrence: dp[i] = f(i) + min_j (m_j * x_i + b_j)"] --> Dispatch{"Are m_j and x_i<br/>Monotonic?"}
    Dispatch -->|"Yes (m_j decreasing, x_i increasing)"| DequeCHT["MonotonicDequeCHT<br/>O(1) Amortized, __int128 Cross-Product"]
    Dispatch -->|"No (Arbitrary m_j or x_i)"| LiChao["DynamicLiChaoSegmentTree<br/>O(log X) Global / O(log^2 X) Segment"]
    DequeCHT --> Verify["Cross-Validate onFrog-3 / Commando Suite"]
    LiChao --> Verify
        </div>

        <h3>3. Engineering Details &amp; Hardware Layout</h3>
        <div class="hardware-box">
          <h4>Contiguous Arena Allocation &amp; Branchless Evaluations</h4>
          <p>Our <code>MonotonicDequeCHT</code> uses a <code>std::vector&lt;Line&gt;</code> with an explicit <code>head_</code> index rather than <code>std::deque</code>, keeping all active lines in a single contiguous memory buffer and avoiding <code>std::deque</code>'s 512-byte chunk indirection. Our <code>LiChaoEngine</code> pre-reserves a contiguous <code>std::vector&lt;Node&gt;</code> arena so node indices are 32-bit <code>int</code> offsets (8 bytes per child pair instead of 16 bytes for 64-bit pointers).</p>
        </div>

        <h3>4. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-cht-knuth-dp"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Operation</th>
              <th>MonotonicDequeCHT</th>
              <th>LiChaoEngine (Global Line)</th>
              <th>LiChaoEngine (Bounded Segment)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Insert Line / Segment</td>
              <td><span class="badge-o1">O(1) amortized</span></td>
              <td><span class="badge-ologn">O(log X)</span></td>
              <td><span class="badge-ologn">O(log^2 X)</span></td>
            </tr>
            <tr>
              <td>Point Query $\\min_j L_j(x)$</td>
              <td><span class="badge-o1">O(1) amortized</span></td>
              <td><span class="badge-ologn">O(log X)</span></td>
              <td><span class="badge-ologn">O(log X)</span></td>
            </tr>
            <tr>
              <td>Total Time for $N$ States</td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-onlogn">O(N log X)</span></td>
              <td><span class="badge-onlogn">O(N log^2 X)</span></td>
            </tr>
          </tbody>
        </table>

        <h3>5. Complete C++20 Build Lab Implementation</h3>
        <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;limits&gt;
#include &lt;algorithm&gt;
#include &lt;cassert&gt;

// ============================================================================
// Engine 1: O(1) Amortized Monotonic Deque CHT (Decreasing Slopes, Increasing x)
// ============================================================================
class MonotonicDequeCHT {
public:
    struct Line {
        int64_t m;
        int64_t b;
        int64_t eval(int64_t x) const { return m * x + b; }
    };

private:
    std::vector&lt;Line&gt; hull_;
    std::size_t head_ = 0;

    // Returns true if l2 is made redundant by l1 and l3 (m1 >= m2 >= m3)
    static bool is_redundant(const Line&amp; l1, const Line&amp; l2, const Line&amp; l3) {
        // Intersection(l1, l3) <= Intersection(l1, l2)
        // (l3.b - l1.b) / (l1.m - l3.m) <= (l2.b - l1.b) / (l1.m - l2.m)
        __int128 lhs = static_cast&lt;__int128&gt;(l3.b - l1.b) * (l1.m - l2.m);
        __int128 rhs = static_cast&lt;__int128&gt;(l2.b - l1.b) * (l1.m - l3.m);
        return lhs &lt;= rhs;
    }

public:
    void insert_line(int64_t m, int64_t b) {
        Line nw{m, b};
        // Handle parallel lines with equal slope
        if (hull_.size() &gt; head_ &amp;&amp; hull_.back().m == m) {
            if (b &gt;= hull_.back().b) return;
            hull_.pop_back();
        }
        while (hull_.size() - head_ &gt;= 2 &amp;&amp;
               is_redundant(hull_[hull_.size() - 2], hull_.back(), nw)) {
            hull_.pop_back();
        }
        hull_.push_back(nw);
    }

    // Queries minimum value at x (assumes x is non-decreasing across calls)
    int64_t query_monotonic(int64_t x) {
        while (hull_.size() - head_ &gt;= 2 &amp;&amp;
               hull_[head_].eval(x) &gt;= hull_[head_ + 1].eval(x)) {
            ++head_;
        }
        return hull_[head_].eval(x);
    }
};

// ============================================================================
// Engine 2: Dynamic Li Chao Tree with Bounded-Segment Insertion Support
// ============================================================================
class LiChaoEngine {
public:
    static constexpr int64_t INF = std::numeric_limits&lt;int64_t&gt;::max() / 4;

    struct Line {
        int64_t m = 0;
        int64_t b = INF;
        int64_t eval(int64_t x) const { return m * x + b; }
    };

private:
    struct Node {
        Line line;
        int left = -1;
        int right = -1;
    };

    int64_t x_min_, x_max_;
    std::vector&lt;Node&gt; pool_;

    int alloc_node() {
        pool_.push_back(Node{});
        return static_cast&lt;int&gt;(pool_.size()) - 1;
    }

    void push_line(int u, int64_t l, int64_t r, Line nw) {
        int64_t mid = l + (r - l) / 2;
        bool left_win = nw.eval(l) &lt; pool_[u].line.eval(l);
        bool mid_win  = nw.eval(mid) &lt; pool_[u].line.eval(mid);

        if (mid_win) std::swap(pool_[u].line, nw);
        if (l == r) return;

        if (left_win != mid_win) {
            if (pool_[u].left == -1) {
                int c = alloc_node();
                pool_[u].left = c;
            }
            push_line(pool_[u].left, l, mid, nw);
        } else {
            if (pool_[u].right == -1) {
                int c = alloc_node();
                pool_[u].right = c;
            }
            push_line(pool_[u].right, mid + 1, r, nw);
        }
    }

    void add_segment(int u, int64_t l, int64_t r, int64_t ql, int64_t qr, Line nw) {
        if (ql &gt; r || qr &lt; l) return;
        if (ql &lt;= l &amp;&amp; r &lt;= qr) {
            push_line(u, l, r, nw);
            return;
        }
        int64_t mid = l + (r - l) / 2;
        if (ql &lt;= mid) {
            if (pool_[u].left == -1) {
                int c = alloc_node();
                pool_[u].left = c;
            }
            add_segment(pool_[u].left, l, mid, ql, qr, nw);
        }
        if (qr &gt; mid) {
            if (pool_[u].right == -1) {
                int c = alloc_node();
                pool_[u].right = c;
            }
            add_segment(pool_[u].right, mid + 1, r, ql, qr, nw);
        }
    }

    int64_t query(int u, int64_t l, int64_t r, int64_t x) const {
        if (u == -1) return INF;
        int64_t ans = pool_[u].line.eval(x);
        if (l == r) return ans;
        int64_t mid = l + (r - l) / 2;
        if (x &lt;= mid) return std::min(ans, query(pool_[u].left, l, mid, x));
        return std::min(ans, query(pool_[u].right, mid + 1, r, x));
    }

public:
    LiChaoEngine(int64_t x_min, int64_t x_max) : x_min_(x_min), x_max_(x_max) {
        pool_.reserve(131072);
        alloc_node();
    }

    void insert_line(int64_t m, int64_t b) {
        push_line(0, x_min_, x_max_, Line{m, b});
    }

    void insert_segment(int64_t m, int64_t b, int64_t xl, int64_t xr) {
        add_segment(0, x_min_, x_max_, xl, xr, Line{m, b});
    }

    int64_t query(int64_t x) const {
        return query(0, x_min_, x_max_, x);
    }
};

// Verification on Frog 3: dp[i] = C + h[i]^2 + min_{j < i} (-2*h[j]*h[i] + dp[j] + h[j]^2)
int64_t solve_frog3_verified(const std::vector&lt;int64_t&gt;&amp; h, int64_t C) {
    MonotonicDequeCHT cht;
    LiChaoEngine lichao(0, h.back());

    int64_t dp_cur = 0;
    cht.insert_line(-2 * h[0], h[0] * h[0]);
    lichao.insert_line(-2 * h[0], h[0] * h[0]);

    for (std::size_t i = 1; i &lt; h.size(); ++i) {
        int64_t v1 = C + h[i] * h[i] + cht.query_monotonic(h[i]);
        int64_t v2 = C + h[i] * h[i] + lichao.query(h[i]);
        assert(v1 == v2);
        dp_cur = v1;

        int64_t m = -2 * h[i];
        int64_t b = dp_cur + h[i] * h[i];
        cht.insert_line(m, b);
        lichao.insert_line(m, b);
    }
    return dp_cur;
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Equal Slopes in Monotonic CHT</h4>
          <p>If two states $j_1 < j_2$ produce the <strong>exact same slope</strong> $m_{j_1} = m_{j_2}$, the denominator $(m_1 - m_2)$ in the intersection formula vanishes! In <code>__int128</code> cross-multiplication, $(b_2 - b_1) \\cdot 0$ becomes $0$, which can leave a strictly dominated parallel line on the hull. Always check <code>hull_.back().m == m</code> before cross-multiplication: if the new intercept $b$ is worse, discard the new line; if it is strictly better, pop the old parallel line before running the hull redundancy loop.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "MonotonicDequeCHT achieves O(1) amortized insertions and queries using exact __int128_t cross-multiplication, provided slopes are inserted in monotonic order and queries are monotonic.",
      "Parallel lines with equal slopes must be deduplicated before running the 3-line intersection check so zero-denominator cross-products do not corrupt the hull.",
      "LiChaoEngine supports arbitrary-order line insertions in O(log X) and domain-restricted line segments [x_L, x_R] in O(log^2 X) without any slope-sorting or division.",
      "Cross-validating O(1) CHT against a Li Chao Tree on small/medium inputs is a battle-tested technique for verifying slope monotonicity assumptions."
    ],
    furtherReading: [
      {
        title: "AtCoder Educational DP Contest — Problem Z: Frog 3",
        url: "https://atcoder.jp/contests/dp/tasks/dp_z"
      },
      {
        title: "CP-Algorithms — Li Chao Tree Segment Insertion",
        url: "https://cp-algorithms.com/geometry/convex_hull_trick.html"
      }
    ]
  }
};

