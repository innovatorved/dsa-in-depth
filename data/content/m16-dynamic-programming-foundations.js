window.MODULE_CONTENT = window.MODULE_CONTENT || {};

window.MODULE_CONTENT["m16"] = {
  "dp-optimal-substructure-dag": {
    title: "Dynamic Programming as Shortest Paths on an Implicit DAG: Optimal Substructure & SRTBOT Framework",
    video: {
      youtubeId: "aPQY__2H3tE",
      title: "5 Simple Steps for Solving Dynamic Programming Problems (Subproblem DAGs)",
      channel: "Reducible",
      duration: "21:27",
      start: 0,
      length: "21m",
      why: "Visualizes Dynamic Programming problems as finding shortest/longest paths over an explicit Directed Acyclic Graph (DAG) of subproblem transitions."
    },
    intuition: "Dynamic Programming is not a bag of algebraic tricks—it is literally Shortest (or Longest) Path relaxation on an implicit Directed Acyclic Graph (DAG) whose vertices are subproblem states and whose directed edges are state transitions. If your state transitions contain a cycle, your DP is ill-defined; if they form a DAG, total runtime is simply (Number of Vertices) + (Number of Edges).",
    content: `
      <div class="lesson-content">
        <h3>1. The Implicit State-Space DAG & The SRTBOT Design Framework</h3>
        <p>Every Dynamic Programming problem reduces to evaluating a function on the vertices $V$ of an implicit <strong>Directed Acyclic Graph (DAG)</strong> $G = (V, E)$, where a directed edge $u \\to v$ means computing state $v$ depends on the value of state $u$. MIT's 6.006 <strong>SRTBOT Framework</strong> turns DP design into a mechanical 6-step checklist:</p>
        <ol>
          <li><strong>S — Subproblem Definition:</strong> Define the exact meaning of state $x \\in V$ in plain English (often prefixes $A[0..i]$, suffixes $A[i..n]$, or substrings $A[i..j]$) and count $|V|$.</li>
          <li><strong>R — Relate (Recurrence):</strong> Guess the last local decision among out-neighbors (or in-neighbors) of $x$ and express $dp[x] = \\bigoplus_{u \\to x} (dp[u] \\otimes w(u, x))$ over a semiring $(\\min, +)$, $(\\max, +)$, or $(+, \\times)$.</li>
          <li><strong>T — Topological Order:</strong> Prove that the dependency graph $G$ is <strong>acyclic</strong> and specify an evaluation loop order (or DFS post-order) where every $u$ is finalized before $x$.</li>
          <li><strong>B — Base Cases:</strong> Explicitly initialize source vertices in $G$ (in-degree $0$).</li>
          <li><strong>O — Original Problem:</strong> Express the final answer as a single sink state $dp[t]$ or an aggregation over a subset of states.</li>
          <li><strong>T — Time &amp; Space Analysis:</strong> $\\text{Time} = \\sum_{x \\in V} \\text{work}(x) = O(|V| + |E|)$.</li>
        </ol>

        <div class="invariant-box">
          <h4>Core Invariant — Bellman's Principle of Optimality & Acyclicity</h4>
          <p>A problem exhibits <strong>Optimal Substructure</strong> if an optimal solution to state $x$ can be constructed strictly from optimal solutions to its predecessor subproblems $u \\in N^-(x)$, paired with a <strong>Markovian (memoryless)</strong> state definition: how we arrived at state $u$ does not restrict which future transitions are legal from $u$. If how you reached $u$ matters (e.g., Longest Simple Path in a graph with cycles, which is NP-hard), then $u$ is missing state dimensions!</p>
        </div>

        <h3>2. Pull DP ("Gather") vs. Push DP ("Scatter") & Parent Pointers</h3>
        <p>Given a topological ordering of states $u_1, u_2, \\dots, u_{|V|}$, there are two dual ways to execute the relaxations:</p>
        <ul>
          <li><strong>Pull DP (In-Edge Relaxation):</strong> When standing at state $x$, iterate over all incoming edges $u \\to x$: <code>dp[x] = min(dp[x], dp[u] + cost(u, x))</code>. Ideal when in-neighbors are easy to enumerate and allows immediate register accumulation of <code>dp[x]</code>.</li>
          <li><strong>Push DP (Out-Edge Relaxation):</strong> Once <code>dp[u]</code> is finalized, iterate over all outgoing edges $u \\to v$: <code>dp[v] = min(dp[v], dp[u] + cost(u, v))</code>. Ideal when unreachable states can be skipped (<code>if (dp[u] == INF) continue;</code>) or when outgoing transitions are cleaner to express than incoming ones.</li>
        </ul>

        <div class="mermaid">
flowchart LR
  subgraph Pull["Pull DP at State x (Read Finalized u)"]
    U1["dp[x - c_1]"] -->|"cost c_1"| X["Compute dp[x] in register"]
    U2["dp[x - c_2]"] -->|"cost c_2"| X
  end
  subgraph Push["Push DP from Finalized State u"]
    U["Finalized dp[u]"] -->|"Relax +c_1"| V1["dp[u + c_1]"]
    U -->|"Relax +c_2"| V2["dp[u + c_2]"]
  end
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Pull DP Register Accumulation vs. Push DP Store-to-Load Forwarding</h4>
          <p>In a tight inner loop, <strong>Pull DP</strong> accumulates <code>best = std::min(best, dp[u] + w)</code> inside a single CPU register (<code>%rax</code>) and performs <em>one</em> memory write <code>dp[x] = best</code> at the end of the loop. In contrast, <strong>Push DP</strong> repeatedly reads and writes different memory addresses <code>dp[u + step]</code>, which can stall the CPU's Store-to-Load forwarding buffer if addresses alias or exceed L1 cache lines. Conversely, when 95% of the state space is unreachable (<code>dp[u] == INF</code>), Push DP skips the inner loop entirely via a single branch, running orders of magnitude faster!</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-dp-dag-table"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Subproblem Domain</th>
              <th>Number of States $|V|$</th>
              <th>Transitions per State</th>
              <th>Total Time $O(|V| + |E|)$</th>
              <th>State Space Size</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1D Prefix / Suffix ($A[0..i]$)</td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-o1">O(1)</span> or <span class="badge-on">O(N)</span></td>
              <td><span class="badge-on">O(N)</span> or <span class="badge-on2">O(N^2)</span></td>
              <td><span class="badge-on">O(N)</span></td>
            </tr>
            <tr>
              <td>Pair of Prefixes ($A[0..i], B[0..j]$)</td>
              <td><span class="badge-on2">O(N * M)</span></td>
              <td><span class="badge-o1">O(1)</span></td>
              <td><span class="badge-on2">O(N * M)</span></td>
              <td><span class="badge-on2">O(N * M)</span></td>
            </tr>
            <tr>
              <td>2D Contiguous Subarray ($A[i..j]$)</td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td><span class="badge-on">O(j - i)</span></td>
              <td><span class="badge-on3">O(N^3)</span></td>
              <td><span class="badge-on2">O(N^2)</span></td>
            </tr>
            <tr>
              <td>Subset Bitmask ($S \\subseteq \\{0..N-1\\}$)</td>
              <td><span class="badge-oexp">O(2^N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-oexp">O(N * 2^N)</span></td>
              <td><span class="badge-oexp">O(2^N)</span></td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;limits&gt;
#include &lt;vector&gt;

// Minimum Coin Change with Full Optimal Solution Reconstruction (DAG Shortest Path + Parent Pointers)
struct CoinChangeResult {
    int min_coins; // -1 if unreachable
    std::vector&lt;int&gt; chosen_coins;
};

CoinChangeResult solve_coin_change_with_reconstruction(const std::vector&lt;int&gt;&amp; coins, int amount) {
    constexpr int INF = 1'000'000'000;
    // S (Subproblems): dp[x] = min coins to form exact sum x in [0..amount]
    std::vector&lt;int&gt; dp(amount + 1, INF);
    std::vector&lt;int&gt; parent_coin(amount + 1, -1);

    // B (Base Case): 0 coins needed to form sum 0
    dp[0] = 0;

    // T (Topological Order): x = 1 .. amount (since coins &gt; 0, u = x - c &lt; x is acyclic!)
    for (int x = 1; x &lt;= amount; ++x) {
        int best = INF;
        int best_c = -1;
        // R (Relate - Pull DP): dp[x] = 1 + min_{c in coins} dp[x - c]
        for (int c : coins) {
            if (x &gt;= c &amp;&amp; dp[x - c] + 1 &lt; best) {
                best = dp[x - c] + 1;
                best_c = c;
            }
        }
        dp[x] = best;
        parent_coin[x] = best_c;
    }

    if (dp[amount] &gt;= INF) {
        return { -1, {} };
    }

    // Backpointer Traversal along the Implicit DAG from sink <code>amount</code> back to source <code>0</code>
    std::vector&lt;int&gt; used;
    for (int cur = amount; cur &gt; 0; cur -= parent_coin[cur]) {
        used.push_back(parent_coin[cur]);
    }
    return { dp[amount], std::move(used) };
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Cyclic State Transitions & Sentinel Overflow (<code>INF + cost</code>)</h4>
          <p>Two errors break DP solvers in production: First, if a coin can have value $c = 0$ (or negative weight cycles exist), the transition $x \\to x - 0$ is a self-loop ($G$ is no longer a DAG!). Second, initializing unreachable states to <code>std::numeric_limits&lt;int&gt;::max()</code> and evaluating <code>dp[x - c] + 1</code> causes signed 32-bit integer overflow (Undefined Behavior in C++, wrapping around to <code>INT_MIN</code> and corrupting <code>std::min</code>). Always use a safe sentinel such as <code>1'000'000'000</code> (<code>0x3f3f3f3f</code>) so <code>INF + cost</code> cannot overflow.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Every Dynamic Programming problem is equivalent to relaxing vertices in topological order on an implicit Directed Acyclic Graph (DAG) of states.",
      "The 6-step SRTBOT framework (Subproblems, Relate, Topological order, Base cases, Original problem, Time) guarantees a complete, non-cyclic formulation.",
      "Pull DP accumulates transitions into a local register before writing dp[x], whereas Push DP skips unreachable states with dp[u] == INF.",
      "Reconstructing the actual optimal choices requires either storing O(|V|) argmin parent pointers or re-checking which predecessor satisfies dp[x] == dp[u] + w(u, x) backward from the sink."
    ],
    furtherReading: [
      {
        title: "MIT 6.006 Introduction to Algorithms — Lecture 19: Dynamic Programming I (SRTBOT)",
        url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
      },
      {
        title: "Jeff Erickson — Algorithms, Chapter 3: Dynamic Programming",
        url: "https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf"
      },
      {
        title: "Thomas H. Cormen et al. — Introduction to Algorithms (CLRS), Chapter 14/15: Dynamic Programming",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      }
    ]
  },

  "memoization-tabulation-space-rolling": {
    title: "Top-Down Memoization vs Bottom-Up Tabulation & Rolling-Array Space Compression",
    video: {
      youtubeId: "YBSt1jYwVfU",
      title: "Dynamic Programming Lecture #1 — Iteration vs Recursion & State Space Saving",
      channel: "Errichto Algorithms",
      duration: "50:48",
      length: "50:48",
      start: 0,
      why: "Compares top-down DFS memoization against bottom-up topological tabulation and demonstrates how sliding dependency windows compress space."
    },
    intuition: "Top-down memoization is DFS on the state DAG that lazily visits only the states reachable from the query; bottom-up tabulation is topological relaxation that strips away recursion stack overhead, enables SIMD vectorization, and lets us free old rows the instant no future state depends on them.",
    content: `
      <div class="lesson-content">
        <h3>1. Top-Down Memoization vs. Bottom-Up Tabulation</h3>
        <p>Given the same state DAG $G = (V, E)$, how should we evaluate it?</p>
        <ul>
          <li><strong>Top-Down Memoization (DFS Post-Order):</strong> Starts at the target state $t$ and recursively evaluates predecessors, caching results in a table or hash map.
            <ul>
              <li><em>When Top-Down Wins:</em> When the state space $V$ is sparse—only a tiny fraction of states in the bounding box are actually reachable from the initial state (e.g., Digit DP with tight bounds, Game DP with strange step sizes, or Interval DP with sparse valid cuts).</li>
              <li><em>Where Top-Down Loses:</em> Recursion stack frames cost $32$–$64$ bytes per depth (risking stack overflow at depth $N = 10^5$), function call prologue/epilogue overhead, non-contiguous memory access, and inability to apply rolling-array space compression.</li>
            </ul>
          </li>
          <li><strong>Bottom-Up Tabulation (Explicit Topological Order):</strong> Iterates through nested loops in an order where all dependencies of state $x$ are already computed.
            <ul>
              <li><em>When Bottom-Up Wins:</em> Dense state spaces where most states are visited, tight time limits requiring L1 cache locality and auto-vectorization (SIMD), or memory limits requiring $O(M)$ rolling-array compression instead of $O(N \\cdot M)$.</li>
            </ul>
          </li>
        </ul>

        <div class="invariant-box">
          <h4>Core Invariant — The Dependency Horizon & Rolling-Array Compression</h4>
          <p>Suppose a 2D recurrence $dp[i][j]$ depends only on states in rows $i$ and $i-1$: $dp[i][j] = f(dp[i-1][\\dots], dp[i][\\dots])$. Once row $i$ is completely computed, row $i-1$ is <strong>dead</strong> (out-degree $0$ to any future row $i' > i$). Thus we only ever need to store the <em>active dependency frontier</em>:<br/>
          1. <strong>Two-Row Ping-Pong (<code>dp[2][M]</code>):</strong> Index rows via <code>i &amp; 1</code> (current) and <code>(i - 1) &amp; 1</code> (previous).<br/>
          2. <strong>Single-Row In-Place (<code>dp[M]</code>):</strong> Overwrite <code>dp[j]</code> in-place by choosing the inner loop direction ($j = 0 \\to M$ vs. $j = M \\to 0$) so we never clobber a value from row $i-1$ that a later $j'$ in row $i$ still needs!</p>
        </div>

        <h3>2. Choosing the Inner Loop Direction for 1-Row Compression</h3>
        <p>When compressing $dp[i][j]$ into a 1D array $dp[j]$:</p>
        <ul>
          <li>If $dp[i][j]$ depends on $dp[i-1][j - w]$ (strictly smaller column from the <strong>previous</strong> row, as in 0/1 Knapsack), we must iterate $j$ <strong>backward</strong> ($W \\to w$) so that when computing $dp[j]$, $dp[j - w]$ still holds its untouched value from row $i-1$.</li>
          <li>If $dp[i][j]$ depends on $dp[i][j - w]$ (smaller column from the <strong>current</strong> row, as in Unbounded Knapsack), we iterate $j$ <strong>forward</strong> ($w \\to W$) so that $dp[j - w]$ already holds the updated row-$i$ value.</li>
          <li>If $dp[i][j]$ depends on $dp[i-1][j]$, $dp[i][j-1]$, and $dp[i-1][j-1]$ (as in Edit Distance / LCS), we iterate $j$ forward while saving the single overwritten diagonal scalar <code>prev_diag = dp[j]</code> in a temporary register!</li>
        </ul>

        <div class="mermaid">
flowchart TD
  subgraph TwoRow["2D Table O(N*M) vs 1D Rolling Array O(M)"]
    R0["Row i-1: ... [dp[i-1][j-1]] [dp[i-1][j]] ..."] --> R1["Row i:   ... [dp[i][j-1]]   [dp[i][j]]   ..."]
  end
  R1 --> Scalar["1D Array + 1 Register (<code>prev_diag</code>):<br/><code>prev_diag</code> holds dp[i-1][j-1]<br/><code>dp[j]</code> holds dp[i-1][j] (before overwrite)<br/><code>dp[j-1]</code> holds dp[i][j-1] (already updated)"]
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Why 1D Rolling Arrays Run $4\\times$–$10\\times$ Faster Than 2D Vector-of-Vectors</h4>
          <p>Allocating <code>std::vector&lt;std::vector&lt;int&gt;&gt; dp(5000, std::vector&lt;int&gt;(5000))</code> allocates $5{,}000$ separate heap buffers totaling <strong>100 MB</strong>, completely blowing out the CPU's 32 KB L1 cache and 1 MB L2 cache and stalling on DRAM bandwidth. Compressing to a single 1D <code>std::vector&lt;int&gt; dp(5001)</code> occupies just <strong>20 KB</strong>—fitting 100% inside L1 data cache for the entire duration of the $2.5 \\times 10^7$ loop iterations!</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-dp-dag-table"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Evaluation Strategy</th>
              <th>Time Complexity</th>
              <th>Auxiliary Space</th>
              <th>Cache Locality</th>
              <th>Supports Decision Reconstruction?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Top-Down Memoization (Hash Map)</td>
              <td><span class="badge-on">O(|V_reach| + |E_reach|)</span></td>
              <td><span class="badge-on">O(|V_reach| + Depth)</span></td>
              <td>Poor (Pointer Chasing)</td>
              <td>Yes (Full visited table retained)</td>
            </tr>
            <tr>
              <td>Top-Down Memoization (Flat Table)</td>
              <td><span class="badge-on2">O(N * M)</span></td>
              <td><span class="badge-on2">O(N * M + Depth)</span></td>
              <td>Moderate (DFS jumps)</td>
              <td>Yes (Full table retained)</td>
            </tr>
            <tr>
              <td>Bottom-Up Full 2D Table</td>
              <td><span class="badge-on2">O(N * M)</span></td>
              <td><span class="badge-on2">O(N * M)</span></td>
              <td>High (Row-major stream)</td>
              <td>Yes (O(N + M) backtrace)</td>
            </tr>
            <tr>
              <td>Bottom-Up 1D Rolling Array</td>
              <td><span class="badge-on2">O(N * M)</span></td>
              <td><span class="badge-on">O(min(N, M))</span></td>
              <td>Maximum (L1 Cache resident)</td>
              <td>Value only (Or Divide &amp; Conquer / Hirschberg)</td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;string_view&gt;
#include &lt;vector&gt;

// Space-Optimized O(min(N, M)) Longest Common Subsequence using 1 Row + 1 Diagonal Register
int lcs_rolling_one_row(std::string_view a, std::string_view b) {
    // Always make <code>b</code> the shorter string so our 1D array uses O(min(N, M)) space!
    if (a.size() &lt; b.size()) std::swap(a, b);
    const int n = static_cast&lt;int&gt;(a.size());
    const int m = static_cast&lt;int&gt;(b.size());

    std::vector&lt;int&gt; dp(m + 1, 0);

    for (int i = 1; i &lt;= n; ++i) {
        int prev_diag = 0; // Holds dp[i - 1][j - 1]
        for (int j = 1; j &lt;= m; ++j) {
            int saved_up = dp[j]; // Save dp[i - 1][j] before overwriting dp[j]
            if (a[i - 1] == b[j - 1]) {
                dp[j] = prev_diag + 1;
            } else {
                dp[j] = std::max(dp[j], dp[j - 1]); // max(dp[i-1][j], dp[i][j-1])
            }
            prev_diag = saved_up; // Advance diagonal register for j + 1
        }
    }
    return dp[m];
}

// Two-Row Ping-Pong Template (i &amp; 1) when transitions read multiple non-adjacent columns
long long min_falling_path_ping_pong(const std::vector&lt;std::vector&lt;int&gt;&gt;&amp; grid) {
    const int n = static_cast&lt;int&gt;(grid.size());
    const int m = static_cast&lt;int&gt;(grid[0].size());
    constexpr long long INF = 1LL &lt;&lt; 60;

    std::vector&lt;long long&gt; dp[2];
    dp[0].assign(grid[0].begin(), grid[0].end());
    dp[1].assign(m, INF);

    for (int i = 1; i &lt; n; ++i) {
        const int cur = i &amp; 1;
        const int prv = (i - 1) &amp; 1;
        for (int j = 0; j &lt; m; ++j) {
            long long best = dp[prv][j];
            if (j &gt; 0) best = std::min(best, dp[prv][j - 1]);
            if (j + 1 &lt; m) best = std::min(best, dp[prv][j + 1]);
            dp[cur][j] = grid[i][j] + best;
        }
    }
    const auto&amp; last_row = dp[(n - 1) &amp; 1];
    return *std::min_element(last_row.begin(), last_row.end());
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Failing to Reset <code>dp[i &amp; 1]</code> in Ping-Pong Buffers</h4>
          <p>When using a two-row ping-pong buffer <code>dp[2][M]</code> with <code>dp[cur][j] = std::min(dp[cur][j], ...)</code> (especially in Push DP or multi-transition loops), remember that <code>dp[cur]</code> still holds stale values from row <code>i - 2</code>! You <strong>must</strong> reset <code>std::fill(dp[cur].begin(), dp[cur].end(), INF)</code> (or overwrite <code>dp[cur][j]</code> unconditionally first) at the start of every outer loop iteration.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Top-down memoization visits only reachable states from the query via DFS, excelling on sparse state spaces.",
      "Bottom-up tabulation eliminates recursion overhead, streams sequentially through cache lines, and enables rolling-array space compression.",
      "When dp[i][j] depends only on row i-1 and row i, space compresses from O(N * M) to O(min(N, M)) by swapping the shorter dimension to the inner loop.",
      "Always verify whether the inner loop must run forward (using current-row states) or backward (preserving previous-row states) when overwriting a single 1D array."
    ],
    furtherReading: [
      {
        title: "MIT 6.006 Introduction to Algorithms — Lecture 20: Dynamic Programming II",
        url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
      },
      {
        title: "CP-Algorithms — Introduction to Dynamic Programming & Space Optimization",
        url: "https://cp-algorithms.com/dynamic_programming/intro-to-dp.html"
      }
    ]
  },

  "knapsack-family-01-unbounded-bounded": {
    title: "The Knapsack Family: 0/1, Unbounded, Subset Sum Bitset & Bounded Knapsack (Binary Splitting / Monotonic Queue)",
    video: {
      youtubeId: "8LusJS5-AGo",
      title: "0/1 Knapsack, Unbounded Knapsack & Subset Sum Dynamic Programming",
      channel: "Tushar Roy - Coding Made Simple",
      duration: "29:12",
      length: "29:12",
      start: 0,
      why: "Clear walkthrough of the 0/1 vs Unbounded state transitions and 1D space-compressed loop directions."
    },
    intuition: "The entire Knapsack family revolves around one question: how many copies of item i can we take? Flipping the 1D capacity loop from backward (W down to w_i) to forward (w_i up to W) turns 0/1 Knapsack into Unbounded Knapsack; packing boolean states into `std::bitset<W>` speeds up Subset Sum by 64x via word-level shift-OR; and decomposing count k_i into powers of two solves Bounded Knapsack in O(N W log k).",
    content: `
      <div class="lesson-content">
        <h3>1. The Four Canonical Knapsack Variants</h3>
        <p>Given $N$ item types with weights $w_i$, values $v_i$, and knapsack capacity $W$:</p>
        <ol>
          <li><strong>0/1 Knapsack ($c_i \\in \\{0, 1\\}$):</strong> Each item taken at most once. 1D recurrence iterates $w$ <strong>backward</strong> from $W$ down to $w_i$:
          $$dp[w] = \\max(dp[w],\\; dp[w - w_i] + v_i)$$</li>
          <li><strong>Unbounded / Complete Knapsack ($c_i \\in \\{0, 1, 2, \\dots\\}$):</strong> Unlimited copies of each item. 1D recurrence iterates $w$ <strong>forward</strong> from $w_i$ up to $W$ so $dp[w - w_i]$ already includes item $i$:
          $$dp[w] = \\max(dp[w],\\; dp[w - w_i] + v_i)$$</li>
          <li><strong>Subset Sum Bitset Acceleration ($v_i = 0/1$ feasibility):</strong> Can a subset sum to $w$? Pack the boolean array into 64-bit machine words (<code>std::bitset<MAXW></code>). Adding item $w_i$ becomes a single word-parallel shift-OR:
          $$\\text{bits} \\mathrel{|=} (\\text{bits} \\ll w_i) \\quad \\implies \\quad O\\!\\left(\\frac{N \\cdot W}{64}\\right)$$</li>
          <li><strong>Bounded Knapsack ($c_i \\in \\{0, 1, \\dots, k_i\\}$):</strong> At most $k_i$ copies of item $i$. Naive transition checks all $c \\in [0..k_i]$ in $O(N W \\cdot k_i)$. How do we remove the $k_i$ factor?</li>
        </ol>

        <div class="invariant-box">
          <h4>Core Invariant — Binary Splitting ($O(N W \\log K)$) & Monotonic Queue ($O(N W)$) for Bounded Knapsack</h4>
          <p><strong>Method 1 (Binary Splitting):</strong> Any integer $k_i$ can be decomposed into $\\lfloor \\log_2 k_i \\rfloor + 1$ bundles with sizes $1, 2, 4, \\dots, 2^{p-1}$ plus the remainder $R = k_i - (2^p - 1)$. Every integer in $[0, k_i]$ is uniquely expressible as a subset sum of these $\\approx \\log_2 k_i$ bundles! Running standard 0/1 Knapsack on these bundles reduces time to $O(W \\sum \\log k_i)$.<br/>
          <strong>Method 2 (Monotonic Deque per Residue Class $\\bmod w_i$):</strong> For a fixed item $(w_i, v_i, k_i)$, transition $dp_{new}[w]$ only depends on capacities congruent to $w \\pmod{w_i}$. Writing $w = q \\cdot w_i + r$, we have:</p>
          $$dp_{new}[q w_i + r] = q \\cdot v_i + \\max_{q - k_i \\le j \\le q} \\big(dp_{old}[j w_i + r] - j \\cdot v_i\\big)$$
          <p>This is a sliding-window maximum of width $k_i + 1$ over $q = 0, 1, \\dots, \\lfloor (W-r)/w_i \\rfloor$, solvable in exact <strong>$O(W)$ time per item</strong> ($O(N W)$ total) using a monotonic deque!</p>
        </div>

        <div class="simulator-mount" data-sim="sim-dp-dag-table"></div>

        <h3>2. The $\\sqrt{S}$ Frequency Compression Trick for Subset Sum ($\\sum w_i = S$)</h3>
        <p>When the sum of all item weights is $\\sum_{i=1}^N w_i = S$, at most $O(\\sqrt{S})$ <em>distinct</em> weight values can exist! Why? Because the minimum sum of $d$ distinct positive integers is $1 + 2 + \\dots + d = d(d+1)/2 \\le S \\implies d \\le \\sqrt{2S}$. By grouping identical weights into <code>(weight, count)</code> pairs and applying binary splitting (or packing pairs of equal weights into a next-level weight $2w$ until at most 2 copies of each weight remain), Subset Sum on $\\sum w_i = S$ runs in $O\\!\\left(\\frac{S \\sqrt{S}}{64}\\right)$ time!</p>

        <div class="mermaid">
flowchart LR
  Count["Bounded Item (w, v, k=13)"] --> Split["Binary Splitting:<br/>Bundles of size 1, 2, 4, and remainder 6<br/>(1 + 2 + 4 + 6 = 13)"]
  Split --> ZeroOne["Every count c in [0..13] can be formed<br/>as a 0/1 subset of {1, 2, 4, 6}!"]
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — AVX2 / AVX-512 Word-Level Bitset Parallelism</h4>
          <p>In C++, <code>std::bitset&lt;100001&gt; dp; dp |= (dp &lt;&lt; w);</code> compiles under <code>-O3 -march=native</code> to a tight loop of 256-bit AVX2 (<code>VPXOR</code>/<code>VPOR</code>/<code>VPSLLQ</code>) or 512-bit AVX-512 instructions processing 256 to 512 capacity states <strong>per CPU clock cycle</strong>. For $N = 2000, W = 100{,}000$, scalar DP executes $2 \\times 10^8$ loop iterations (~150 ms), whereas <code>std::bitset</code> executes $2000 \\times (100000 / 256) \\approx 7.8 \\times 10^5$ SIMD instructions in <strong>under 1.2 milliseconds</strong>.</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Knapsack Problem Variant</th>
              <th>1D Loop Direction</th>
              <th>Time Complexity</th>
              <th>Space Complexity</th>
              <th>Key Technique</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0/1 Knapsack ($c_i \\in \\{0, 1\\}$)</td>
              <td>Backward ($W \\to w_i$)</td>
              <td><span class="badge-on2">O(N * W)</span></td>
              <td><span class="badge-on">O(W)</span></td>
              <td>In-place 1D rolling array</td>
            </tr>
            <tr>
              <td>Unbounded Knapsack ($c_i \\ge 0$)</td>
              <td>Forward ($w_i \\to W$)</td>
              <td><span class="badge-on2">O(N * W)</span></td>
              <td><span class="badge-on">O(W)</span></td>
              <td>Reuse updated $dp[w - w_i]$</td>
            </tr>
            <tr>
              <td>Bounded Knapsack (Binary Split)</td>
              <td>Backward per bundle</td>
              <td><span class="badge-on2">O(W * sum log k_i)</span></td>
              <td><span class="badge-on">O(W)</span></td>
              <td>Powers-of-2 + remainder bundles</td>
            </tr>
            <tr>
              <td>Bounded Knapsack (Monotonic Deque)</td>
              <td>Residue classes $\\bmod w_i$</td>
              <td><span class="badge-on2">O(N * W)</span></td>
              <td><span class="badge-on">O(W)</span></td>
              <td>Sliding window max on $dp[j w_i + r] - j v_i$</td>
            </tr>
            <tr>
              <td>Subset Sum Bitset ($\sum w_i = S$)</td>
              <td>Word-parallel <code>|=</code></td>
              <td><span class="badge-on">O(S sqrt(S) / 64)</span></td>
              <td><span class="badge-on">O(S / 64)</span></td>
              <td>Frequency grouping + <code>std::bitset</code></td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;bitset&gt;
#include &lt;cstdint&gt;
#include &lt;deque&gt;
#include &lt;vector&gt;

struct BoundedItem {
    int weight;
    long long value;
    int count;
};

// 1. Bounded Knapsack in O(W * sum(log k_i)) via Binary Splitting
long long bounded_knapsack_binary_split(const std::vector&lt;BoundedItem&gt;&amp; items, int capacity) {
    std::vector&lt;long long&gt; dp(capacity + 1, 0);

    auto apply_01_item = [&amp;](int w, long long v) {
        for (int cap = capacity; cap &gt;= w; --cap) {
            dp[cap] = std::max(dp[cap], dp[cap - w] + v);
        }
    };

    for (const auto&amp; item : items) {
        int rem = item.count;
        for (int b = 1; b &lt;= rem; b &lt;&lt;= 1) {
            int bundle_w = b * item.weight;
            if (bundle_w &lt;= capacity) {
                apply_01_item(bundle_w, b * item.value);
            }
            rem -= b;
        }
        if (rem &gt; 0 &amp;&amp; rem * item.weight &lt;= capacity) {
            apply_01_item(rem * item.weight, rem * item.value);
        }
    }
    return dp[capacity];
}

// 2. Bounded Knapsack in Strict O(N * W) Time via Monotonic Deque over Residue Classes
long long bounded_knapsack_monotonic_queue(const std::vector&lt;BoundedItem&gt;&amp; items, int capacity) {
    std::vector&lt;long long&gt; dp(capacity + 1, 0);
    std::deque&lt;std::pair&lt;int, long long&gt;&gt; dq; // (quotient q, shifted_val = dp[q*w + r] - q*v)

    for (const auto&amp; item : items) {
        const int w = item.weight;
        const long long v = item.value;
        const int k = item.count;
        if (w &gt; capacity || k == 0) continue;

        for (int r = 0; r &lt; w; ++r) {
            dq.clear();
            int max_q = (capacity - r) / w;
            for (int q = 0; q &lt;= max_q; ++q) {
                long long shifted = dp[q * w + r] - q * v;
                while (!dq.empty() &amp;&amp; dq.back().second &lt;= shifted) {
                    dq.pop_back();
                }
                dq.emplace_back(q, shifted);
                // Evict window elements older than q - k
                if (dq.front().first &lt; q - k) {
                    dq.pop_front();
                }
                dp[q * w + r] = dq.front().second + q * v;
            }
        }
    }
    return dp[capacity];
}

// 3. O(N * W / 64) Word-Parallel Subset Sum using std::bitset
template &lt;std::size_t MAXW = 100001&gt;
bool subset_sum_bitset(const std::vector&lt;int&gt;&amp; weights, int target) {
    if (target &lt; 0 || static_cast&lt;std::size_t&gt;(target) &gt;= MAXW) return false;
    std::bitset&lt;MAXW&gt; reachable;
    reachable.set(0);
    for (int w : weights) {
        reachable |= (reachable &lt;&lt; w);
    }
    return reachable.test(target);
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Splitting $k_i$ into Powers of 2 Up to $\\lceil \\log_2 k_i \\rceil$ Instead of Remainder $R$</h4>
          <p>When binary-splitting $k_i = 13$, if you emit powers of two $1, 2, 4, 8$, their sum is $15 > 13$—allowing the solver to illegally take 14 or 15 copies of the item! You must subtract $1, 2, 4, \\dots$ while $2^b \\le \\text{rem}$ ($13 - 1 - 2 - 4 = 6$) and emit the leftover remainder $R = 6$ as the final bundle so the bundle sum equals $1 + 2 + 4 + 6 = 13$ exactly. Also note: when weights $W \\le 10^9$ are huge but values $\\sum v_i \\le 10^5$ are small, <strong>invert the DP state and objective</strong>: let $dp[v]$ be the <em>minimum weight</em> required to achieve exact value $v$ in $O(N \\sum v_i)$ time!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "0/1 Knapsack iterates capacity backward (W down to w_i) so each item is used at most once; Unbounded Knapsack iterates forward (w_i up to W) to allow unlimited reuse.",
      "Binary splitting decomposes count k_i into powers of two 1, 2, 4, ... plus remainder R, reducing Bounded Knapsack to O(W sum log k_i) 0/1 Knapsack steps.",
      "Grouping capacities by residue r = w mod w_i transforms Bounded Knapsack into a sliding-window maximum solvable in O(N * W) via a monotonic deque.",
      "When capacity W is huge (10^9) but total value V is small (10^5), swap state and value: compute the minimum weight needed to achieve value v in O(N * V)."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — 0-1 Knapsack, Unbounded Knapsack, and Bounded Knapsack (Monotonic Queue & Binary Splitting)",
        url: "https://cp-algorithms.com/dynamic_programming/knapsack.html"
      },
      {
        title: "MIT 6.006 Introduction to Algorithms — Pseudo-Polynomial Time and Knapsack DP",
        url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
      }
    ]
  },

  "lis-patience-sorting": {
    title: "Longest Increasing Subsequence (LIS): O(N^2) DP vs O(N log N) Patience Sorting & Dilworth's Theorem",
    video: {
      youtubeId: "22s1xxRvy28",
      title: "Patience Sorting and Longest Increasing Subsequence in O(N log N)",
      channel: "Stable Sort",
      duration: "11:45",
      length: "11:45",
      start: 0,
      why: "Visualizes card piles in Patience Sorting, why pile tops stay sorted, and how binary search finds the exact LIS length and reconstructs the sequence."
    },
    intuition: "Instead of asking 'What is the longest increasing subsequence ending at index i?' in O(N^2) time, invert the state and ask: 'For each possible length L, what is the smallest possible tail value of an increasing subsequence of length L?' Because a shorter prefix of a valid subsequence always has a strictly smaller tail, this `tails` array is monotonically sorted—unlocking O(log N) binary search per element.",
    content: `
      <div class="lesson-content">
        <h3>1. State Inversion: From $O(N^2)$ Prefix DP to $O(N \\log N)$ Monotonic Tails</h3>
        <p>The textbook $O(N^2)$ recurrence defines $dp[i]$ as the length of the Longest Increasing Subsequence ending at $A[i]$: $dp[i] = 1 + \\max_{j < i, A[j] < A[i]} dp[j]$. To break the $O(N^2)$ barrier, we apply <strong>State-Value Inversion</strong>:</p>
        <p>Define $\\text{tails}[L]$ (0-indexed for length $L + 1$) as the <strong>minimum possible ending value</strong> among all strictly increasing subsequences of length $L + 1$ seen so far in prefix $A[0..i]$.</p>

        <div class="invariant-box">
          <h4>Core Invariant — Strict Monotonicity of the Patience Sorting <code>tails</code> Array</h4>
          <p>After processing any prefix $A[0..i]$, the array $\\text{tails}$ satisfies:</p>
          $$\\text{tails}[0] < \\text{tails}[1] < \\dots < \\text{tails}[k - 1]$$
          <p><strong>Proof:</strong> If $\\text{tails}[L] \\le \\text{tails}[L-1]$ were ever true, then taking the second-to-last element of the length-$(L+1)$ subsequence ending in $\\text{tails}[L]$ would give a valid increasing subsequence of length $L$ with ending value $< \\text{tails}[L] \\le \\text{tails}[L-1]$, contradicting the minimality of $\\text{tails}[L-1]$!<br/>
          Because $\\text{tails}$ is sorted, inserting $x = A[i]$ replaces the first element $\\ge x$ via <code>std::lower_bound</code> (for <strong>strictly increasing</strong> $<$) or <code>std::upper_bound</code> (for <strong>non-decreasing</strong> $\\le$) in $O(\\log N)$ time.</p>
        </div>

        <h3>2. Patience Sorting & Dilworth's Theorem (Chain / Antichain Duality)</h3>
        <p>Imagine dealing cards $A[0..n-1]$ into piles from left to right according to <strong>Patience Sorting (Aldous &amp; Diaconis, 1999)</strong>: place card $x$ on the leftmost pile whose top card is $\\ge x$ (or start a new pile to the right if all pile tops are $< x$). Each pile is a <em>non-increasing subsequence</em>, and the top cards of the piles from left to right are literally our array $\\text{tails}[0..k-1]$!</p>
        <ul>
          <li><strong>Dilworth's Theorem (1950):</strong> In any finite partially ordered set, the minimum number of disjoint chains (non-increasing subsequences) needed to partition the sequence equals the maximum size of an antichain (strictly increasing subsequence). Thus:
            <ul>
              <li><em>Minimum number of non-increasing subsequences to cover $A$</em> $=$ <strong>Length of Strictly Increasing LIS</strong> (<code>lower_bound</code>).</li>
              <li><em>Minimum number of strictly decreasing subsequences to cover $A$</em> $=$ <strong>Length of Non-Decreasing LNDS</strong> (<code>upper_bound</code>).</li>
            </ul>
          </li>
          <li><strong>2D Envelope / Russian Doll Nesting $(w_i, h_i)$:</strong> To find the longest chain where both $w_a < w_b$ and $h_a < h_b$, sort pairs by <strong>$w_i$ ascending, and on ties by $h_i$ DESCENDING</strong>, then run 1D strictly increasing LIS on $h_i$! Sorting ties by $h_i$ descending guarantees we can never pick two envelopes with the same width $w$.</li>
        </ul>

        <div class="mermaid">
flowchart LR
  subgraph Patience["Patience Sorting Piles on A = [4, 10, 4, 3, 8, 9]"]
    P1["Pile 0 (L=1):<br/>4 -> 4 -> 3<br/>Top = 3"] --> P2["Pile 1 (L=2):<br/>10 -> 8<br/>Top = 8"]
    P2 --> P3["Pile 2 (L=3):<br/>9<br/>Top = 9"]
  end
  P3 --> Result["LIS Length = 3 (Number of Piles)<br/>3 Non-Increasing Chains Partition A:<br/>[4, 4, 3], [10, 8], [9]"]
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Why <code>tails</code> Alone Is NOT the LIS (Reconstruction via Index Tracking)</h4>
          <p>A notorious interview and production bug is returning the final <code>tails</code> vector itself as the LIS! On $A = [10, 20, 30, 5]$, after processing $30$ we have <code>tails = [10, 20, 30]</code>, and when $5$ arrives it overwrites <code>tails[0] = 5</code>, leaving <code>tails = [5, 20, 30]</code>—which is <strong>not a valid subsequence</strong> because $5$ appeared after $20$ and $30$! To reconstruct the true sequence in $O(N \\log N)$ time, store the array index <code>tail_idx[pos] = i</code> and record <code>parent[i] = (pos &gt; 0 ? tail_idx[pos - 1] : -1)</code> at the moment $A[i]$ is placed at position <code>pos</code>.</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-dp-dag-table"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>LIS Variant / Algorithm</th>
              <th>Binary Search Comparator</th>
              <th>Time Complexity</th>
              <th>Auxiliary Space</th>
              <th>Output Capability</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Naive Prefix DP ($dp[i]$)</td>
              <td>Linear Scan $j < i$</td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Length + Count + Sequence</td>
            </tr>
            <tr>
              <td>Patience Sorting (Strictly Increasing $<$)</td>
              <td><code>std::lower_bound</code> ($\ge x$)</td>
              <td><span class="badge-onlogn">O(N log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Length + Reconstructed LIS</td>
            </tr>
            <tr>
              <td>Patience Sorting (Non-Decreasing $\le$)</td>
              <td><code>std::upper_bound</code> ($> x$)</td>
              <td><span class="badge-onlogn">O(N log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Length + Reconstructed LNDS</td>
            </tr>
            <tr>
              <td>Count of All LIS / Weighted LIS</td>
              <td>Fenwick / Segment Tree on ranks</td>
              <td><span class="badge-onlogn">O(N log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Max Weighted LIS + Exact Count</td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;vector&gt;

// 1. O(N log N) Strictly Increasing Subsequence with Full Sequence Reconstruction
std::vector&lt;int&gt; longest_increasing_subsequence(const std::vector&lt;int&gt;&amp; nums) {
    const int n = static_cast&lt;int&gt;(nums.size());
    if (n == 0) return {};

    std::vector&lt;int&gt; tails;          // tails[len] = smallest ending value of LIS of length len+1
    std::vector&lt;int&gt; tail_idx;       // tail_idx[len] = index in <code>nums</code> that achieved tails[len]
    std::vector&lt;int&gt; parent(n, -1);  // parent[i] = predecessor index in <code>nums</code> for element i

    for (int i = 0; i &lt; n; ++i) {
        auto it = std::lower_bound(tails.begin(), tails.end(), nums[i]);
        int pos = static_cast&lt;int&gt;(it - tails.begin());

        if (it == tails.end()) {
            tails.push_back(nums[i]);
            tail_idx.push_back(i);
        } else {
            *it = nums[i];
            tail_idx[pos] = i;
        }
        if (pos &gt; 0) {
            parent[i] = tail_idx[pos - 1];
        }
    }

    // Reconstruct valid subsequence backward from the index of the longest pile top
    std::vector&lt;int&gt; result(tails.size());
    int curr = tail_idx.back();
    for (int k = static_cast&lt;int&gt;(tails.size()) - 1; k &gt;= 0; --k) {
        result[k] = nums[curr];
        curr = parent[curr];
    }
    return result;
}

// 2. 2D Russian Doll Envelopes: Sort (w ASC, h DESC) + 1D LIS on h
int max_nested_envelopes(std::vector&lt;std::pair&lt;int, int&gt;&gt; envelopes) {
    std::sort(envelopes.begin(), envelopes.end(), [](const auto&amp; a, const auto&amp; b) {
        if (a.first != b.first) return a.first &lt; b.first;
        return a.second &gt; b.second; // DESCENDING height on equal width prevents duplicate width picks!
    });

    std::vector&lt;int&gt; tails;
    for (const auto&amp; [w, h] : envelopes) {
        auto it = std::lower_bound(tails.begin(), tails.end(), h);
        if (it == tails.end()) tails.push_back(h);
        else *it = h;
    }
    return static_cast&lt;int&gt;(tails.size());
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Using <code>lower_bound</code> Instead of <code>upper_bound</code> for Non-Decreasing Subsequences</h4>
          <p>When a problem asks for the Longest <strong>Non-Decreasing</strong> Subsequence ($A[i_1] \\le A[i_2] \\le \\dots$), equal elements are allowed to extend an existing chain! If you use <code>std::lower_bound</code> ($\ge x$), an equal element overwrites the existing tail instead of extending it. Always remember the pairing: <strong>Strictly Increasing ($<$) $\\iff$ <code>lower_bound</code></strong>; <strong>Non-Decreasing ($\le$) $\\iff$ <code>upper_bound</code></strong>.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Patience Sorting inverts the DP state: tails[L] stores the minimum ending value of an increasing subsequence of length L+1.",
      "Because tails is strictly increasing, each element updates a single entry via std::lower_bound in O(log N) time, achieving O(N log N) overall.",
      "The tails array itself is not necessarily a valid subsequence; reconstructing the actual LIS requires tracking tail_idx[pos] and parent[i] at insertion time.",
      "By Dilworth's Theorem, the minimum number of non-increasing subsequences needed to partition an array equals the length of its strictly increasing LIS."
    ],
    furtherReading: [
      {
        title: "David Aldous & Persi Diaconis — Longest Increasing Subsequences: From Patience Sorting to the Baik-Deift-Johansson Theorem (Bulletin of the AMS, 1999)",
        url: "https://www.ams.org/journals/bull/1999-36-04/S0273-0979-99-00796-X/S0273-0979-99-00796-X.pdf"
      },
      {
        title: "CP-Algorithms — Longest Increasing Subsequence in O(N log N)",
        url: "https://cp-algorithms.com/sequences/longest_increasing_subsequence.html"
      }
    ]
  },

  "sequence-dp-lcs-levenshtein": {
    title: "Sequence Alignment DP: Longest Common Subsequence (LCS) & Wagner-Fischer Edit Distance",
    video: {
      youtubeId: "ASoaQq66foQ",
      title: "Longest Common Subsequence — Dynamic Programming & Competing Subproblems",
      channel: "Back To Back SWE",
      duration: "51:04",
      length: "51:04",
      start: 0,
      why: "Erik Demaine derives the Wagner-Fischer Edit Distance DAG, sequence alignment in computational biology, and prefix-pair subproblem spaces."
    },
    intuition: "Every `git diff`, spell-checker, and DNA sequence aligner walks a 2D grid graph where moving right deletes a character from A, moving down inserts a character from B, and moving diagonally matches or substitutes characters. When one string has no duplicate characters—or few matching pairs—we can even collapse the 2D grid into a 1D Longest Increasing Subsequence problem in O(N log N) time!",
    content: `
      <div class="lesson-content">
        <h3>1. The Alignment Grid DAG: Wagner-Fischer Edit Distance & LCS</h3>
        <p>Given strings $A[0..n-1]$ and $B[0..m-1]$, prefix-pair Dynamic Programming defines subproblem $(i, j)$ on prefixes $A[0..i-1]$ and $B[0..j-1]$ across an $(n+1) \\times (m+1)$ grid DAG with three incoming edges into $(i, j)$:</p>
        <ul>
          <li><strong>Wagner–Fischer Levenshtein Edit Distance (1974):</strong> Minimum insertions, deletions, and substitutions to transform $A$ into $B$:
            $$dp[i][j] = \\begin{cases} dp[i-1][j-1] & \\text{if } A[i-1] = B[j-1] \\\\ 1 + \\min\\big(\\underbrace{dp[i-1][j]}_{\\text{Delete } A[i-1]},\\; \\underbrace{dp[i][j-1]}_{\\text{Insert } B[j-1]},\\; \\underbrace{dp[i-1][j-1]}_{\\text{Substitute}}\\big) & \\text{if } A[i-1] \\neq B[j-1] \\end{cases}$$
            with base cases $dp[i][0] = i$ and $dp[0][j] = j$.
          </li>
          <li><strong>Deletion-Insertion Edit Distance vs. LCS Duality:</strong> When substitutions are forbidden (or cost $2$), transforming $A$ into $B$ deletes $n - |\\text{LCS}|$ characters and inserts $m - |\\text{LCS}|$ characters:
            $$d_{\\text{del/ins}}(A, B) = n + m - 2 \\cdot |\\text{LCS}(A, B)|$$
          </li>
        </ul>

        <div class="invariant-box">
          <h4>Core Invariant — Ukkonen's $O(N \\cdot K)$ Banded Diagonal Optimization & Hunt-Szymanski Reduction</h4>
          <p><strong>1. Ukkonen's Banded Edit Distance (1985):</strong> Whenever we only care if $\\text{EditDistance}(A, B) \\le K$ (e.g., fuzzy search or spell-checking with threshold $K \\ll N$), any path in the alignment grid that strays further than $K$ diagonals away from the main diagonal ($|i - j| > K$) must pay at least $|i - j| > K$ insertions/deletions! Restricting DP evaluation to the band $j \\in [\\max(0, i - K), \\min(m, i + K)]$ reduces time from $O(N \\cdot M)$ to <strong>$O(N \\cdot K)$</strong>.<br/>
          <strong>2. Hunt–Szymanski LCS-to-LIS Reduction:</strong> When all elements of $A$ are distinct (e.g., a permutation), mapping each character in $B$ to its index in $A$ transforms LCS into <strong>Longest Increasing Subsequence (LIS)</strong> in $O((N + M) \\log N)$ time! Even with duplicates, mapping each $B[j]$ to its occurrences in $A$ sorted in <em>descending</em> order reduces LCS to LIS in $O(R \\log N)$ where $R$ is the number of matching pairs.</p>
        </div>

        <div class="simulator-mount" data-sim="sim-dp-dag-table"></div>

        <h3>2. Needleman-Wunsch (Global) vs. Smith-Waterman (Local) Sequence Alignment</h3>
        <p>In computational genomics, mismatches carry penalty $-\\mu$ and gaps carry penalty $-\\delta$ while matches score $+\\sigma$:</p>
        <ul>
          <li><strong>Needleman–Wunsch (Global Alignment):</strong> Aligns full strings end-to-end; initializes $dp[i][0] = -i\\delta, dp[0][j] = -j\\delta$ and returns $dp[n][m]$.</li>
          <li><strong>Smith–Waterman (Local Alignment):</strong> Finds the highest-scoring aligned <em>substrings</em> by adding a $0$ floor to every state transition ($dp[i][j] = \\max(0, \\dots)$)—allowing the alignment path to start fresh at any $(i, j)$ with score $0$—and returns $\\max_{i,j} dp[i][j]$.</li>
        </ul>

        <div class="mermaid">
flowchart TD
  Diag["(i-1, j-1)<br/>Match (+0) or Substitute (+1)"] -->|"Diagonal Edge"| Cell["(i, j)"]
  Up["(i-1, j)<br/>Delete A[i-1] (+1)"] -->|"Vertical Edge"| Cell
  Left["(i, j-1)<br/>Insert B[j-1] (+1)"] -->|"Horizontal Edge"| Cell
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Myers' Bit-Parallel $O(N M / 64)$ Edit Distance & SETH Lower Bound</h4>
          <p>Can general Edit Distance or LCS be solved in $O(N^{2 - \\epsilon})$ time? Backurs and Indyk (STOC 2015) proved that any $O(N^{2 - \\epsilon})$ algorithm for Edit Distance or LCS would refute the <strong>Strong Exponential Time Hypothesis (SETH)</strong>! In practice, production libraries (like <code>agrep</code>, <code>ripgrep</code>, and Edlib) use <strong>Myers' Bit-Parallel Algorithm (1999)</strong>, encoding the horizontal and vertical $\\in \\{-1, 0, +1\\}$ differences along columns into 64-bit integers and computing 64 rows in $O(1)$ bitwise ALU operations ($O(N M / 64)$ time).</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Sequence Alignment Algorithm</th>
              <th>Time Complexity</th>
              <th>Space Complexity</th>
              <th>Best Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Wagner-Fischer Edit Distance (1D Rolling)</td>
              <td><span class="badge-on2">O(N * M)</span></td>
              <td><span class="badge-on">O(min(N, M))</span></td>
              <td>General strings when only distance is needed</td>
            </tr>
            <tr>
              <td>Ukkonen's Banded Edit Distance ($d \\le K$)</td>
              <td><span class="badge-on">O(N * K)</span></td>
              <td><span class="badge-on">O(K)</span></td>
              <td>Fuzzy search, spell-checkers, near-identical files</td>
            </tr>
            <tr>
              <td>Hunt-Szymanski (LCS on Permutation / Sparse Matches)</td>
              <td><span class="badge-onlogn">O((N + R) log N)</span></td>
              <td><span class="badge-on">O(N + R)</span></td>
              <td>Permutations ($R \\le M$) or large alphabets</td>
            </tr>
            <tr>
              <td>Myers' Bit-Parallel Edit Distance</td>
              <td><span class="badge-on2">O(N * M / 64)</span></td>
              <td><span class="badge-on">O(M / 64)</span></td>
              <td>High-throughput genomics &amp; CLI search (<code>agrep</code>)</td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cmath&gt;
#include &lt;cstdint&gt;
#include &lt;string_view&gt;
#include &lt;unordered_map&gt;
#include &lt;vector&gt;

// 1. Wagner-Fischer Levenshtein Edit Distance in O(N*M) Time and O(min(N, M)) Space
int edit_distance_space_optimized(std::string_view a, std::string_view b) {
    if (a.size() &lt; b.size()) std::swap(a, b);
    const int n = static_cast&lt;int&gt;(a.size());
    const int m = static_cast&lt;int&gt;(b.size());

    std::vector&lt;int&gt; dp(m + 1);
    for (int j = 0; j &lt;= m; ++j) dp[j] = j;

    for (int i = 1; i &lt;= n; ++i) {
        int prev_diag = dp[0]; // Holds dp[i - 1][j - 1]
        dp[0] = i;             // Base case dp[i][0] = i deletions
        for (int j = 1; j &lt;= m; ++j) {
            int saved_up = dp[j];
            if (a[i - 1] == b[j - 1]) {
                dp[j] = prev_diag;
            } else {
                dp[j] = 1 + std::min({ saved_up, dp[j - 1], prev_diag });
            }
            prev_diag = saved_up;
        }
    }
    return dp[m];
}

// 2. Ukkonen's O(N * K) Banded Edit Distance (Returns distance if &lt;= k, else k + 1)
int banded_edit_distance(std::string_view a, std::string_view b, int k) {
    const int n = static_cast&lt;int&gt;(a.size());
    const int m = static_cast&lt;int&gt;(b.size());
    if (std::abs(n - m) &gt; k) return k + 1;

    constexpr int INF = 1'000'000'000;
    std::vector&lt;int&gt; prev(m + 1, INF), curr(m + 1, INF);
    for (int j = 0; j &lt;= std::min(m, k); ++j) prev[j] = j;

    for (int i = 1; i &lt;= n; ++i) {
        int lo = std::max(1, i - k);
        int hi = std::min(m, i + k);
        curr[lo - 1] = (lo == 1) ? i : INF;

        int row_min = curr[lo - 1];
        for (int j = lo; j &lt;= hi; ++j) {
            int cost = (a[i - 1] == b[j - 1]) ? 0 : 1;
            curr[j] = std::min({
                prev[j] + 1,         // Delete
                curr[j - 1] + 1,     // Insert
                prev[j - 1] + cost   // Match / Substitute
            });
            row_min = std::min(row_min, curr[j]);
        }
        if (hi &lt; m) curr[hi + 1] = INF; // Guard boundary outside band
        if (row_min &gt; k) return k + 1;   // Early exit: entire band exceeded threshold k!
        std::swap(prev, curr);
    }
    return std::min(k + 1, prev[m]);
}

// 3. Hunt-Szymanski O((N + M) log N) LCS when elements of <code>a</code> are distinct
int lcs_distinct_via_lis(const std::vector&lt;int&gt;&amp; a, const std::vector&lt;int&gt;&amp; b) {
    std::unordered_map&lt;int, int&gt; pos_in_a;
    pos_in_a.reserve(a.size() * 2);
    for (int i = 0; i &lt; static_cast&lt;int&gt;(a.size()); ++i) {
        pos_in_a[a[i]] = i;
    }
    std::vector&lt;int&gt; tails;
    for (int x : b) {
        auto it = pos_in_a.find(x);
        if (it == pos_in_a.end()) continue;
        int idx = it-&gt;second;
        auto lb = std::lower_bound(tails.begin(), tails.end(), idx);
        if (lb == tails.end()) tails.push_back(idx);
        else *lb = idx;
    }
    return static_cast&lt;int&gt;(tails.size());
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Forgetting to Update <code>dp[0] = i</code> in 1-Row Edit Distance</h4>
          <p>In Longest Common Subsequence, $dp[i][0] = 0$ for all $i$, so <code>dp[0]</code> stays <code>0</code> forever. In Levenshtein Edit Distance, transforming $A[0..i-1]$ into the empty string requires $i$ deletions ($dp[i][0] = i$)! Forgetting to set <code>prev_diag = dp[0]; dp[0] = i;</code> at the start of every outer row loop leaves <code>dp[0] == 0</code>, allowing free deletions of prefixes of $A$ and returning completely wrong distances.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Wagner-Fischer Edit Distance relaxes an (N+1) x (M+1) DAG where horizontal edges insert, vertical edges delete, and diagonal edges match or substitute.",
      "When only edits up to threshold K are relevant, Ukkonen's banded DP restricts evaluation to |i - j| <= K, cutting time from O(N * M) to O(N * K).",
      "When one sequence has distinct elements (or sparse matching pairs), Hunt-Szymanski reduces LCS to 1D Longest Increasing Subsequence in O(N log N) time.",
      "Under SETH, no strongly subquadratic O(N^(2 - eps)) algorithm exists for general Edit Distance or LCS."
    ],
    furtherReading: [
      {
        title: "Robert A. Wagner & Michael J. Fischer — The String-to-String Correction Problem (Journal of the ACM, 1974)",
        url: "https://dl.acm.org/doi/10.1145/321796.321811"
      },
      {
        title: "MIT 6.006 Introduction to Algorithms — Lecture 21: Edit Distance & Sequence Alignment",
        url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
      }
    ]
  },

  "interval-dp-matrix-chain-triangulation": {
    title: "Interval DP: Matrix Chain Multiplication, Optimal BST & Polygon Triangulation",
    video: {
      youtubeId: "eKkXU3uu2zk",
      title: "Matrix Chain Multiplication — Parenthesization & Interval Dynamic Programming",
      channel: "Abdul Bari",
      duration: "48:25",
      length: "48:25",
      start: 0,
      why: "Covers the Catalan-sized space of binary expression trees and why interval length must be the outer topological loop."
    },
    intuition: "When a decision splits a contiguous range [i, j] into two independent sub-ranges [i, k] and [k+1, j]—like parenthesizing matrix multiplications, choosing the root of a Binary Search Tree, or slicing a convex polygon with a triangle—prefixes alone aren't enough. We must parameterize states by both endpoints (i, j) and iterate in increasing order of interval length L = j - i + 1.",
    content: `
      <div class="lesson-content">
        <h3>1. Catalan Tree Spaces & The Interval Length Topological Order</h3>
        <p>How many ways can we parenthesize a product of $n$ matrices $A_1 A_2 \\cdots A_n$, construct a Binary Search Tree on $n$ sorted keys, or triangulate a convex $(n+1)$-gon? The answer to all three is the $(n-1)$-th <strong>Catalan Number</strong>:</p>
        $$C_{n-1} = \\frac{1}{n}\\binom{2n-2}{n-1} = \\Theta\\!\\left(\\frac{4^n}{n^{3/2}}\\right)$$
        <p>Because the last operation merges two contiguous sub-intervals $[i, k]$ and $[k+1, j]$ into $[i, j]$, any subproblem is uniquely identified by its pair of endpoints $(i, j)$ with $0 \\le i \\le j < n$—collapsing $\\Theta(4^n / n^{3/2})$ trees into just $\\binom{n+1}{2} = \\Theta(n^2)$ distinct subproblems!</p>

        <div class="invariant-box">
          <h4>Core Invariant — Interval Length Topological Ordering ($\\text{len} = j - i + 1$)</h4>
          <p>In Interval DP, state $dp[i][j]$ depends on <strong>shorter</strong> intervals $dp[i][k]$ (to the left in row $i$) and $dp[k+1][j]$ (below in column $j$). Therefore, naive row-major iteration (<code>for i = 0..n-1: for j = i..n-1</code>) is <strong>invalid</strong> because $dp[k+1][j]$ belongs to a later row $k+1 > i$ that hasn't been computed yet!<br/>
          Two valid topological orders exist:<br/>
          1. <strong>By Increasing Length:</strong> <code>for (int len = 2; len &lt;= n; ++len) for (int i = 0; i + len - 1 &lt; n; ++i)</code>.<br/>
          2. <strong>By Decreasing Left Endpoint:</strong> <code>for (int i = n - 1; i &gt;= 0; --i) for (int j = i + 1; j &lt; n; ++j)</code>.</p>
        </div>

        <h3>2. Three Isomorphic Interval DP Archetypes</h3>
        <ul>
          <li><strong>Matrix Chain Multiplication (Dimensions $p_0 \\times p_1, p_1 \\times p_2, \\dots, p_{n-1} \\times p_n$):</strong> Multiplying matrix $A_{i..k}$ ($p_i \\times p_{k+1}$) by $A_{k+1..j}$ ($p_{k+1} \\times p_{j+1}$) costs $p_i p_{k+1} p_{j+1}$ scalar multiplications:
            $$dp[i][j] = \\min_{i \\le k < j} \\big(dp[i][k] + dp[k+1][j] + p_i \\cdot p_{k+1} \\cdot p_{j+1}\\big)$$
          </li>
          <li><strong>Minimum Weight Convex Polygon Triangulation (Vertices $0..n-1$):</strong> Every diagonal-free triangulation of sub-polygon $[i..j]$ includes exactly one triangle $(i, k, j)$ on base edge $(i, j)$ for some apex $i < k < j$:
            $$dp[i][j] = \\min_{i < k < j} \\big(dp[i][k] + dp[k][j] + \\text{weight}(\\triangle i k j)\\big)$$
          </li>
          <li><strong>Burst Balloons / Reverse Action Trick:</strong> If popping balloon $k$ first causes $k-1$ and $k+1$ to become adjacent, the left and right subproblems are <em>not independent</em>! Instead, guess which balloon $k \\in (i, j)$ is popped <strong>LAST</strong> inside open interval $(i, j)$: its neighbors at the moment it pops are guaranteed to be the fixed boundary balloons $i$ and $j$, making $(i, k)$ and $(k, j)$ 100% independent!</li>
        </ul>

        <div class="mermaid">
flowchart TD
  IJ["Interval [i, j] (Length L = j - i + 1)"] -->|"Guess split point k in [i, j-1]"| IK["Left Sub-Interval [i, k]<br/>(Length &lt; L, already finalized)"]
  IJ -->|"Guess split point k in [i, j-1]"| KJ["Right Sub-Interval [k+1, j]<br/>(Length &lt; L, already finalized)"]
  IK --> Merge["Combine: dp[i][k] + dp[k+1][j] + cost(i, k, j)"]
  KJ --> Merge
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Transposing the Right Operand for Cache-Friendly $O(N^3)$ Loops</h4>
          <p>In the innermost loop <code>for (int k = i; k &lt; j; ++k)</code> of <code>dp[i][k] + dp[k+1][j]</code>, accessing <code>dp[i][k]</code> streams sequentially across row $i$ (stride 1, L1 cache hit), whereas accessing <code>dp[k+1][j]</code> jumps down column $j$ with stride $N$—causing an L1/L2 cache miss on every step when $N \\ge 512$! Maintaining a transposed mirror array <code>dpT[j][k+1] = dp[k+1][j]</code> turns both inner-loop reads into unit-stride sequential scans, allowing the compiler to auto-vectorize the $k$-loop with AVX2 (<code>VPMINSD</code>/<code>VPADDD</code>) for a $4\\times$–$6\\times$ wall-clock speedup.</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-interval-tree-rerooting-dp"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Interval DP Problem</th>
              <th>State Space $|V|$</th>
              <th>Transitions per State</th>
              <th>Standard DP Time</th>
              <th>Optimized Time (Advanced)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Matrix Chain Multiplication</td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td><span class="badge-on">O(j - i)</span></td>
              <td><span class="badge-on3">O(N^3)</span></td>
              <td><span class="badge-onlogn">O(N log N)</span> (Hu-Shing 1982)</td>
            </tr>
            <tr>
              <td>Convex Polygon Triangulation</td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td><span class="badge-on">O(j - i)</span></td>
              <td><span class="badge-on3">O(N^3)</span></td>
              <td><span class="badge-on3">O(N^3)</span></td>
            </tr>
            <tr>
              <td>Optimal Binary Search Tree</td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td><span class="badge-on">O(j - i)</span></td>
              <td><span class="badge-on3">O(N^3)</span></td>
              <td><span class="badge-on2">O(N^2)</span> (Knuth Optimization)</td>
            </tr>
            <tr>
              <td>Burst Balloons (Guess Last Action)</td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td><span class="badge-on">O(j - i)</span></td>
              <td><span class="badge-on3">O(N^3)</span></td>
              <td><span class="badge-on3">O(N^3)</span></td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;limits&gt;
#include &lt;vector&gt;

// 1. Matrix Chain Multiplication with Transpose-Cache Optimization (p has size n + 1)
long long matrix_chain_multiplication(const std::vector&lt;long long&gt;&amp; p) {
    const int n = static_cast&lt;int&gt;(p.size()) - 1;
    if (n &lt;= 1) return 0;
    constexpr long long INF = 1LL &lt;&lt; 60;

    // dp[i][j] = min scalar multiplications for A_i .. A_j
    // dpT[j][i] = transposed copy of dp[i][j] so inner k-loop has stride-1 on both arrays!
    std::vector&lt;std::vector&lt;long long&gt;&gt; dp(n, std::vector&lt;long long&gt;(n, 0));
    std::vector&lt;std::vector&lt;long long&gt;&gt; dpT(n, std::vector&lt;long long&gt;(n, 0));

    for (int len = 2; len &lt;= n; ++len) {
        for (int i = 0; i + len - 1 &lt; n; ++i) {
            const int j = i + len - 1;
            const long long outer_p = p[i] * p[j + 1];
            long long best = INF;
            for (int k = i; k &lt; j; ++k) {
                // Both dp[i][k] and dpT[j][k + 1] are contiguous in memory along index k!
                long long cost = dp[i][k] + dpT[j][k + 1] + outer_p * p[k + 1];
                if (cost &lt; best) best = cost;
            }
            dp[i][j] = best;
            dpT[j][i] = best;
        }
    }
    return dp[0][n - 1];
}

// 2. Burst Balloons: Guess the LAST balloon popped inside open interval (i, j)
long long max_coins_burst_balloons(const std::vector&lt;int&gt;&amp; nums) {
    // Pad with virtual boundary balloons of value 1 at both ends
    std::vector&lt;long long&gt; a;
    a.reserve(nums.size() + 2);
    a.push_back(1);
    for (int x : nums) if (x &gt; 0) a.push_back(x);
    a.push_back(1);

    const int m = static_cast&lt;int&gt;(a.size());
    std::vector&lt;std::vector&lt;long long&gt;&gt; dp(m, std::vector&lt;long long&gt;(m, 0));

    // len is the distance j - i between open interval boundaries (minimum 2)
    for (int len = 2; len &lt; m; ++len) {
        for (int i = 0; i + len &lt; m; ++i) {
            const int j = i + len;
            const long long boundary_prod = a[i] * a[j];
            long long best = 0;
            for (int k = i + 1; k &lt; j; ++k) {
                best = std::max(best, dp[i][k] + dp[k][j] + boundary_prod * a[k]);
            }
            dp[i][j] = best;
        }
    }
    return dp[0][m - 1];
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Guessing the First Action When Sub-Intervals Interact</h4>
          <p>Whenever removing an element $k$ causes its left and right neighbors to become adjacent and interact (as in Burst Balloons, Minimum Cost to Merge Stones, or Zuma / Remove Boxes), guessing the <em>first</em> element to remove destroys subproblem independence because the left and right halves will later touch across the gap! Always invert time and guess the <strong>last</strong> operation performed on the interval $[i, j]$.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Interval DP collapses Catalan-many binary expression trees O(4^N / N^1.5) into O(N^2) contiguous sub-range states dp[i][j].",
      "Always iterate in topological order of increasing interval length len = j - i + 1 (or decreasing left endpoint i) so shorter sub-intervals are finalized first.",
      "When removing an element causes the left and right sub-ranges to touch, guess the LAST element operated on inside (i, j) to keep subproblems independent.",
      "Maintaining a transposed copy dpT[j][k+1] = dp[k+1][j] converts column-strided memory reads into unit-stride cache-line scans."
    ],
    furtherReading: [
      {
        title: "Thomas H. Cormen et al. — Introduction to Algorithms (CLRS), Section 15.2: Matrix-Chain Multiplication",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      },
      {
        title: "Jeff Erickson — Algorithms, Section 3.6: Dynamic Programming on Intervals",
        url: "https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf"
      }
    ]
  },

  "tree-dp-rerooting-technique": {
    title: "DP on Trees: Maximum Independent Set, Subtree Knapsack (O(N^2) Amortized Proof) & All-Roots Rerooting",
    video: {
      youtubeId: "7_huTWwl5jM",
      title: "Rerooting DP on Trees Tutorial — All-Roots Subtree Aggregation",
      channel: "Prince Gupta",
      duration: "38:15",
      length: "38:15",
      start: 0,
      why: "Explains bottom-up subtree aggregation, the O(N^2) tree knapsack complexity proof, and the 2-pass prefix/suffix rerooting technique."
    },
    intuition: "A rooted tree is already a DAG where information naturally flows from leaves up to the root in DFS post-order. Two miracles make Tree DP remarkably fast: first, merging knapsack arrays across child subtrees looks like O(N^3) but is actually O(N^2) because every pair of nodes meets only once at their LCA; second, the Rerooting (Up-Down) technique computes the answer for all N possible roots in O(N) total time.",
    content: `
      <div class="lesson-content">
        <h3>1. Bottom-Up Subtree DP & The $O(N^2)$ Tree Knapsack Theorem</h3>
        <p>By rooting an undirected tree arbitrarily at vertex $0$, every vertex $u$ defines a subproblem on its subtree $T_u$, solved in DFS post-order:</p>
        <ul>
          <li><strong>Maximum Weight Independent Set on a Tree (House Robber III):</strong> Maintain two states per node: $dp[u][0]$ (max weight in $T_u$ if $u$ is excluded) and $dp[u][1]$ (if $u$ is included):
            $$dp[u][0] = \\sum_{v \\in \\text{children}(u)} \\max(dp[v][0], dp[v][1]), \\qquad dp[u][1] = w_u + \\sum_{v \\in \\text{children}(u)} dp[v][0]$$
          </li>
          <li><strong>Subtree Dependency Knapsack (Selecting $K$ Connected Nodes):</strong> Suppose at node $u$ we merge a knapsack table of size $\\text{sz}[u]$ with child $v$'s table of size $\\text{sz}[v]$. A naive bound where both loops run up to $N$ gives $O(N^3)$. However, if we bound the loop ranges strictly by the <strong>current accumulated subtree size $\\text{sz}[u]$</strong> and child size $\\text{sz}[v]$ before updating $\\text{sz}[u] \\mathrel{+}= \\text{sz}[v]$, what is the true complexity?</li>
        </ul>

        <div class="invariant-box">
          <h4>Core Invariant — The $O(N^2)$ (and $O(N \\cdot K)$) Tree Knapsack Complexity Proof</h4>
          <p>When merging child $v$ into parent $u$'s partial subtree via nested loops of lengths $\\text{sz}_{\\text{cur}}[u]$ and $\\text{sz}[v]$, the number of inner-loop operations performed at that merge step is $\\text{sz}_{\\text{cur}}[u] \\times \\text{sz}[v]$.<br/>
          Combinatorial interpretation: $\\text{sz}_{\\text{cur}}[u] \\times \\text{sz}[v]$ equals the exact number of pairs of vertices $(x, y)$ such that $x$ belongs to a previously merged branch of $u$, $y \\in T_v$, and <strong>$\\text{LCA}(x, y) = u$</strong>! Since every pair of vertices $(x, y)$ in the tree has a <em>unique</em> Lowest Common Ancestor $u$, summing over the entire tree counts each pair $(x, y)$ at most once:</p>
          $$\\sum_{u} \\sum_{v \\in \\text{children}(u)} \\text{sz}_{\\text{cur}}[u] \\cdot \\text{sz}[v] = \\binom{N}{2} = O(N^2)$$
          <p>If capacities are further capped at $K$, the complexity is strictly <strong>$O(N \\cdot K)$</strong>!</p>
        </div>

        <h3>2. The All-Roots Rerooting Technique (Up-Down / In-Out DP)</h3>
        <p>What if we need the tree DP answer when <em>every</em> vertex $u \\in \\{0..N-1\\}$ is chosen as the root (e.g., Sum of Distances in Tree, Minimum Height Trees, or Maximum Path from Every Node)? Running $N$ separate DFS traversals takes $O(N^2)$. Instead, <strong>Two-Pass Rerooting</strong> solves all $N$ roots in $O(N)$:</p>
        <ol>
          <li><strong>Pass 1 (Post-Order Downward DP <code>down[u]</code>):</strong> Root at $0$ and compute <code>down[u]</code> for every subtree $T_u$.</li>
          <li><strong>Pass 2 (Pre-Order Upward DP <code>up[v]</code>):</strong> As we step from parent $u$ to child $v$, the "complement subtree" $T \\setminus T_v$ seen by $v$ consists of $u$'s upward contribution <code>up[u]</code> merged with all siblings $w \\in \\text{children}(u) \\setminus \\{v\\}$. To avoid division (which fails on $\\max/\\min$ or $\\bmod p$ zeroes), precompute <strong>prefix and suffix merges</strong> of $u$'s children!</li>
        </ol>

        <div class="mermaid">
flowchart LR
  subgraph Pass1["Pass 1: Bottom-Up (Post-Order)"]
    C1["Child v_1: down[v_1]"] --> U["Parent u: down[u]"]
    C2["Child v_2: down[v_2]"] --> U
  end
  subgraph Pass2["Pass 2: Top-Down Rerooting (Pre-Order)"]
    UpU["up[u] (Outside T_u)"] --> Combine["Combine via Prefix/Suffix<br/>of siblings != v_2"]
    C1b["Sibling v_1: down[v_1]"] --> Combine
    Combine --> UpV2["up[v_2] passed into Child v_2"]
  end
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Why Bound-Capped Tree Knapsack Must Update <code>sz[u] += sz[v]</code> AFTER the Merge Loop</h4>
          <p>A single-line bug turns an $O(N^2)$ Tree Knapsack into an $O(N^3)$ TLE: if you increment <code>sz[u] += sz[v]</code> <em>before</em> the merge loop (or loop up to the precomputed total subtree size instead of the running accumulated size), the first child merge at the root iterates $N \\times \\text{sz}[v_1]$ instead of $1 \\times \\text{sz}[v_1]$, destroying the LCA pair-counting invariant!</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-interval-tree-rerooting-dp"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Tree DP Pattern</th>
              <th>Naive Approach</th>
              <th>Optimal Tree DP Time</th>
              <th>Auxiliary Space</th>
              <th>Key Mechanism</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Max Independent Set / Vertex Cover</td>
              <td><span class="badge-oexp">O(2^N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>2-state post-order $dp[u][0/1]$</td>
            </tr>
            <tr>
              <td>Tree Diameter / Max Path Sum</td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Combine top-2 child depths at each LCA</td>
            </tr>
            <tr>
              <td>Subtree Knapsack (Cap $K \\le N$)</td>
              <td><span class="badge-on3">O(N * K^2)</span></td>
              <td><span class="badge-on2">O(N * K)</span></td>
              <td><span class="badge-on2">O(N * K)</span></td>
              <td>Cap loops at $\\min(K, \\text{sz}_{\\text{cur}}[u])$</td>
            </tr>
            <tr>
              <td>All-Roots Queries (Rerooting DP)</td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Downward post-order + Upward prefix/suffix</td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;vector&gt;

// 1. All-Roots Rerooting DP: Compute sum of distances from EVERY node u to all other nodes in O(N)
std::vector&lt;long long&gt; sum_of_distances_in_tree(int n, const std::vector&lt;std::pair&lt;int, int&gt;&gt;&amp; edges) {
    std::vector&lt;std::vector&lt;int&gt;&gt; adj(n);
    for (auto [u, v] : edges) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    std::vector&lt;int&gt; sz(n, 1);
    std::vector&lt;long long&gt; ans(n, 0);

    // Pass 1 (Bottom-Up): Compute subtree sizes and ans[0] = sum of depths from root 0
    auto dfs_down = [&amp;](auto&amp; self, int u, int p) -&gt; void {
        for (int v : adj[u]) {
            if (v == p) continue;
            self(self, v, u);
            sz[u] += sz[v];
            ans[0] += ans[v] + sz[v]; // momentarily use ans[u] to accumulate subtree dist sum
        }
        if (u != 0) {
            long long sub_sum = 0;
            for (int v : adj[u]) if (v != p) sub_sum += ans[v] + sz[v];
            ans[u] = sub_sum;
        }
    };
    dfs_down(dfs_down, 0, -1);

    // Pass 2 (Top-Down Rerooting): Shift root from u to child v in O(1):
    // Nodes in T_v (sz[v] of them) get 1 step closer; nodes outside T_v (n - sz[v]) get 1 step farther!
    auto dfs_up = [&amp;](auto&amp; self, int u, int p) -&gt; void {
        for (int v : adj[u]) {
            if (v == p) continue;
            ans[v] = ans[u] - sz[v] + (n - sz[v]);
            self(self, v, u);
        }
    };
    dfs_up(dfs_up, 0, -1);
    return ans;
}

// 2. O(N * K) Tree Dependency Knapsack (Must pick parent u to pick any node in T_u)
std::vector&lt;long long&gt; tree_knapsack_Exact_ONK(
    int n, int k, const std::vector&lt;int&gt;&amp; parent, const std::vector&lt;long long&gt;&amp; profit) {
    std::vector&lt;std::vector&lt;int&gt;&gt; children(n);
    int root = 0;
    for (int i = 0; i &lt; n; ++i) {
        if (parent[i] == -1) root = i;
        else children[parent[i]].push_back(i);
    }

    constexpr long long NEG_INF = -(1LL &lt;&lt; 60);
    std::vector&lt;std::vector&lt;long long&gt;&gt; dp(n);
    std::vector&lt;int&gt; sz(n, 0);

    auto dfs = [&amp;](auto&amp; self, int u) -&gt; void {
        sz[u] = 1;
        dp[u] = { 0LL, profit[u] }; // Size 0 -&gt; 0, Size 1 (just u) -&gt; profit[u]

        for (int v : children[u]) {
            self(self, v);
            int new_cap = std::min(k, sz[u] + sz[v]);
            std::vector&lt;long long&gt; next_dp(new_cap + 1, NEG_INF);
            next_dp[0] = 0;

            // CRITICAL: Bound i by current sz[u] and j by sz[v] BEFORE adding sz[v] to sz[u]!
            for (int i = 1; i &lt;= std::min(k, sz[u]); ++i) {
                for (int j = 0; j &lt;= std::min(k - i, sz[v]); ++j) {
                    next_dp[i + j] = std::max(next_dp[i + j], dp[u][i] + dp[v][j]);
                }
            }
            dp[u] = std::move(next_dp);
            sz[u] += sz[v]; // Update sz[u] AFTER the merge!
        }
    };
    dfs(dfs, root);
    return dp[root];
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Using Inverse Operations (Subtraction / Division) in Rerooting When Merging $\\max$ or $\\min$</h4>
          <p>For additive objectives like Sum of Distances, removing child $v$'s contribution from $u$ is a simple subtraction. However, when the DP transition uses a <strong>non-invertible operator</strong> like $\\max$ (e.g., Eccentricity / Longest Path from Every Node) or multiplication $\\bmod M$ (where a child factor could be $0 \\pmod M$), you <em>cannot</em> divide or subtract! Instead, for a node $u$ with $d$ children $v_0, \\dots, v_{d-1}$, precompute prefix merges $P[i] = \\bigoplus_{j < i} f(v_j)$ and suffix merges $S[i] = \\bigoplus_{j > i} f(v_j)$ in $O(d)$ time so child $v_i$ receives $P[i] \\oplus S[i] \\oplus \\text{up}[u]$ in $O(1)$ without inversion.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Rooting a tree turns it into a DAG where subtree states dp[u] are computed bottom-up in DFS post-order.",
      "Merging subtree knapsack tables bounded by running subtree sizes sz[u] and sz[v] runs in O(N^2) (or O(N * K)) total time because every pair of nodes meets only once at their LCA.",
      "Two-pass Rerooting DP computes all-roots answers in O(N) via a bottom-up post-order pass followed by a top-down pre-order pass.",
      "When transitions use non-invertible operators (max, min, GCD, or multiplication mod M), use prefix and suffix child arrays during the top-down rerooting pass."
    ],
    furtherReading: [
      {
        title: "USACO Guide — DP on Trees and All-Roots Rerooting Technique",
        url: "https://usaco.guide/gold/dp-trees"
      },
      {
        title: "CP-Algorithms — Dynamic Programming on Trees & Rerooting",
        url: "https://cp-algorithms.com/graph/tree_rerooting.html"
      }
    ]
  },

  "dag-dp-longest-path-counting": {
    title: "DP on DAGs: Longest Path, Path Counting & Topological State Propagation",
    video: {
      youtubeId: "TXkDpqjDMHA",
      title: "Dynamic Programming on Directed Acyclic Graphs (DAGs) & Shortest/Longest Paths",
      channel: "WilliamFiset",
      duration: "15:52",
      length: "15:52",
      start: 0,
      why: "Shows how Kahn's topological sort and DAG relaxation solve Longest Path, Shortest Path with negative weights, and Path Counting in linear time."
    },
    intuition: "In a general graph, finding the Longest Simple Path is NP-hard and counting paths is #P-complete because cycles allow infinite walks. On a Directed Acyclic Graph (DAG)—or on a cyclic graph condensed into a DAG of Strongly Connected Components via Tarjan's algorithm—both problems collapse to a single linear O(V + E) pass along topological order.",
    content: `
      <div class="lesson-content">
        <h3>1. Linear-Time Semiring Relaxation on DAGs</h3>
        <p>Given a Directed Acyclic Graph $G = (V, E)$ with topological ordering $\\pi = (v_1, v_2, \\dots, v_n)$ such that every directed edge $(u, v) \\in E$ satisfies $\\text{pos}(u) < \\text{pos}(v)$, we can evaluate any associative path algebra in $O(V + E)$ time:</p>
        <ul>
          <li><strong>Shortest Path (even with negative edge weights!):</strong> $(\\min, +)$ semiring: $dp[v] = \\min_{u \\to v} (dp[u] + w(u, v))$.</li>
          <li><strong>Longest Path (Critical Path Method / Project Scheduling):</strong> $(\\max, +)$ semiring: $dp[v] = \\max_{u \\to v} (dp[u] + w(u, v))$.</li>
          <li><strong>Number of Distinct $s \\leadsto v$ Walks:</strong> $(+, \\times)$ semiring: $\\text{ways}[v] = \\sum_{u \\to v} \\text{ways}[u] \\pmod{M}$.</li>
          <li><strong>Path Expectation / Probability:</strong> If leaving $u$ chooses an out-edge with probability $p(u, v)$, then $\\mathbb{E}[\\text{len}(u)] = \\sum_{u \\to v} p(u, v) \\cdot (w(u, v) + \\mathbb{E}[\\text{len}(v)])$ evaluated in <em>reverse</em> topological order.</li>
        </ul>

        <div class="invariant-box">
          <h4>Core Invariant — Kahn's In-Degree Peeling vs. Source Reachability Contamination</h4>
          <p>When solving <strong>Single-Source</strong> Longest Path from a specific start vertex $s$ on a DAG, other vertices $r \\neq s$ may also have in-degree $0$! If you initialize all vertices to <code>dp[v] = 0</code> and run Kahn's algorithm from all in-degree-$0$ vertices, paths starting at $r \\neq s$ will contaminate <code>dp[v]</code>.<br/>
          <strong>Rule:</strong> For single-source queries from $s$, initialize <code>dp[s] = 0</code> and <code>dp[v] = -INF</code> for all $v \\neq s$. Still peel <em>all</em> in-degree-$0$ vertices in Kahn's queue so the topological dependencies unlock properly, and guard edge relaxations with <code>if (dp[u] != -INF)</code>!</p>
        </div>

        <h3>2. Extending DAG DP to General Directed Graphs via SCC Condensation</h3>
        <p>What if the input graph $G$ contains directed cycles, and we want to maximize the sum of vertex weights collected along a walk (where each vertex's weight is collected at most once)? Every Strongly Connected Component (SCC) $C_i$ allows visiting <em>all</em> vertices inside $C_i$ and exiting through any outgoing edge! Thus:</p>
        <ol>
          <li>Run Tarjan's or Kosaraju's algorithm in $O(V + E)$ to partition $G$ into SCCs $C_1, \\dots, C_k$.</li>
          <li>Contract each SCC $C_i$ into a super-node with weight $W(C_i) = \\sum_{u \\in C_i} w_u$.</li>
          <li>The quotient graph $G^{\\text{SCC}}$ is a guaranteed DAG! Run $O(V + E)$ Longest Path DP on $G^{\\text{SCC}}$.</li>
        </ol>

        <div class="mermaid">
flowchart LR
  subgraph Kahn["Kahn's Topological Relaxation from Source s"]
    In0["Other Source r (in_deg=0)<br/>dp[r] = -INF"] -->|"Unlocks in_deg of u,<br/>does NOT relax dp[u]"| U["Vertex u<br/>dp[u] = 10"]
    S["Start Source s<br/>dp[s] = 0"] -->|"+10"| U
    U -->|"+7"| T["Target t<br/>dp[t] = 17"]
  end
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Reordering Vertex IDs into Topological Order for Cache Streaming</h4>
          <p>In large sparse DAGs (such as neural network computation graphs or static timing analysis circuits with $10^7$ gates), vertex IDs are often numbered arbitrarily, so <code>dp[v] = max(dp[v], dp[u] + w)</code> triggers random memory writes across <code>dp[]</code>. Relabeling vertices so that new ID $i$ is the $i$-th vertex in topological order turns <code>dp[u]</code> reads into monotonically forward memory accesses and guarantees every edge $(i, j)$ satisfies $i < j$.</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-dp-dag-table"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Graph Problem</th>
              <th>On a General Graph</th>
              <th>On a DAG</th>
              <th>Space Complexity</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Shortest Path (Negative Weights, No Neg Cycles)</td>
              <td><span class="badge-on2">O(V * E)</span> (Bellman-Ford)</td>
              <td><span class="badge-on">O(V + E)</span></td>
              <td><span class="badge-on">O(V)</span></td>
              <td>Topological $(\\min, +)$ relaxation</td>
            </tr>
            <tr>
              <td>Longest Simple Path</td>
              <td><span class="badge-oexp">NP-Hard</span></td>
              <td><span class="badge-on">O(V + E)</span></td>
              <td><span class="badge-on">O(V)</span></td>
              <td>Topological $(\\max, +)$ relaxation</td>
            </tr>
            <tr>
              <td>Count Distinct $s \\leadsto t$ Walks</td>
              <td><span class="badge-oexp">#P-Complete</span> (Simple)</td>
              <td><span class="badge-on">O(V + E)</span></td>
              <td><span class="badge-on">O(V)</span></td>
              <td>Topological $(+, \\times)$ propagation</td>
            </tr>
            <tr>
              <td>Reachability Count (Bitset Approximate/Exact)</td>
              <td><span class="badge-on2">O(V * E / 64)</span> ( via SCC)</td>
              <td><span class="badge-on2">O(V * E / 64)</span></td>
              <td><span class="badge-on2">O(V^2 / 64)</span></td>
              <td>Reverse topo <code>reach[u] |= reach[v]</code></td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;queue&gt;
#include &lt;vector&gt;

struct DirectedEdge {
    int to;
    long long weight;
};

struct DagPathMetrics {
    bool is_acyclic;
    long long longest_path;   // -INF if t is unreachable from s
    long long num_paths_mod;  // Number of distinct s -&gt; t paths modulo 10^9 + 7
};

// Simultaneous Cycle Detection, Single-Source Longest Path, and Path Counting on a DAG
DagPathMetrics solve_dag_s_to_t(
    int n, const std::vector&lt;std::vector&lt;DirectedEdge&gt;&gt;&amp; adj, int s, int t) {
    constexpr long long NEG_INF = -(1LL &lt;&lt; 60);
    constexpr long long MOD = 1'000'000'007LL;

    std::vector&lt;int&gt; in_deg(n, 0);
    for (int u = 0; u &lt; n; ++u) {
        for (const auto&amp; e : adj[u]) ++in_deg[e.to];
    }

    // Push ALL in-degree 0 vertices so Kahn's topological peeling unlocks the entire DAG
    std::queue&lt;int&gt; q;
    for (int u = 0; u &lt; n; ++u) {
        if (in_deg[u] == 0) q.push(u);
    }

    std::vector&lt;long long&gt; dist(n, NEG_INF);
    std::vector&lt;long long&gt; ways(n, 0);
    dist[s] = 0;
    ways[s] = 1;

    int visited_count = 0;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        ++visited_count;

        for (const auto&amp; e : adj[u]) {
            if (dist[u] != NEG_INF) {
                dist[e.to] = std::max(dist[e.to], dist[u] + e.weight);
                ways[e.to] = (ways[e.to] + ways[u]) % MOD;
            }
            if (--in_deg[e.to] == 0) {
                q.push(e.to);
            }
        }
    }

    if (visited_count != n) {
        return { false, NEG_INF, 0 }; // Graph contains a directed cycle!
    }
    return { true, dist[t], ways[t] };
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Pushing Only <code>s</code> into Kahn's Queue Instead of All <code>in_deg == 0</code> Nodes</h4>
          <p>A frequent bug in Single-Source DAG DP is initializing Kahn's queue with <code>q.push(s)</code> instead of pushing all vertices with <code>in_deg[u] == 0</code>. If a vertex $v$ is reachable from $s$ (e.g., $s \\to v$) AND also has an incoming edge from an unreachable source $r \\to v$, then $v$'s <code>in_deg</code> starts at $2$. If $r$ is never processed, <code>in_deg[v]</code> only drops from $2$ to $1$ and $v$ is <strong>never pushed into the queue</strong>! Always push all <code>in_deg == 0</code> vertices (or run a reachability DFS from $s$ first to restrict <code>in_deg</code> to the reachable subgraph).</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "On a DAG, Shortest Path (even with negative weights), Longest Path, and Path Counting all run in O(V + E) time by relaxing edges in topological order.",
      "For single-source queries from s, initialize dist[s] = 0 and dist[v] = -INF for v != s, while still peeling all in-degree 0 vertices in Kahn's queue.",
      "Kahn's algorithm simultaneously validates acyclicity: if visited_count < V upon termination, the graph contains a directed cycle.",
      "Vertex-weighted longest walk on a cyclic directed graph reduces to DAG DP after condensing Strongly Connected Components (SCCs) via Tarjan's algorithm."
    ],
    furtherReading: [
      {
        title: "Thomas H. Cormen et al. — Introduction to Algorithms (CLRS), Section 24.2: Single-Source Shortest Paths in Directed Acyclic Graphs",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      },
      {
        title: "CSES Problem Set / USACO Guide —Topological Sort and Dynamic Programming on DAGs",
        url: "https://usaco.guide/gold/toposort"
      }
    ]
  },

  "case-pretty-printing-knuth-plass": {
    title: "Production Case Study: Knuth-Plass Line Breaking in TeX & Code Formatters (prettier, rustfmt)",
    video: {
      youtubeId: "RORuwHiblPc",
      title: "Text Justification & Word Wrap by Dynamic Programming (Knuth-Plass Formulation)",
      channel: "Tushar Roy - Coding Made Simple",
      duration: "15:31",
      start: 0,
      length: "16m",
      why: "Derives the badness cost matrix and O(N²) DP state transition table that minimizes cubic whitespace penalties across justified paragraph lines."
    },
    intuition: "Why do paragraphs typeset in LaTeX look like a master printer crafted them, while greedy word-wrappers create hideous 'rivers' of stretched whitespace? Because greedy wrapping packs each line to the brim until a long word overflows, leaving the previous line sparse. Knuth and Plass (1981) formulated paragraph justification as a Shortest Path DAG where vertices are word boundaries, edges are candidate lines, and edge weights are cubic/quadratic 'badness' penalties.",
    content: `
      <div class="lesson-content">
        <h3>1. Why Greedy Word Wrapping Fails & The Knuth-Plass Badness Function</h3>
        <p>Given $n$ words of widths $w_0, w_1, \\dots, w_{n-1}$ and target line width $L$, a <strong>greedy line breaker</strong> (used in basic web browsers and early word processors) packs words onto the current line until the next word exceeds $L$. This local myopia often packs $99\\%$ of lines tightly and then encounters a long URL or technical identifier, leaving a massive gap on the preceding line.</p>
        <p>In 1981, Donald Knuth and Michael Plass revolutionized digital typography in $\\TeX$ by optimizing <strong>global paragraph demerits</strong> across all lines simultaneously:</p>
        <ul>
          <li>The width of placing words $i \\dots j-1$ on a single line (with 1 unit space between adjacent words) is $W(i, j) = \\sum_{k=i}^{j-1} w_k + (j - 1 - i)$ (computable in $O(1)$ via prefix sums).</li>
          <li>The <strong>badness (or slack penalty)</strong> $\\text{cost}(i, j)$ of a line spanning words $[i, j)$ is:
            $$\\text{cost}(i, j) = \\begin{cases} +\\infty & \\text{if } W(i, j) > L \\\\ 0 & \\text{if } j = n \\text{ (last line of paragraph is left-aligned)} \\\\ (L - W(i, j))^p & \\text{otherwise } (p = 2 \\text{ or } p = 3 \\text{ in } \\TeX) \\end{cases}$$
          </li>
        </ul>

        <div class="invariant-box">
          <h4>Core Invariant — Suffix DP Recurrence & Sparse Active Breakpoint Window</h4>
          <p>Let $dp[i]$ be the minimum total badness to typeset the suffix of words $i \\dots n-1$:<br/>
          $$dp[i] = \\min_{i < j \\le n,\\; W(i, j) \\le L} \\big(\\text{cost}(i, j) + dp[j]\\big), \\qquad dp[n] = 0$$
          Because every word has width $w_k \\ge 1$ plus a space of width $1$, how many words $j - i$ can possibly fit on a single line of width $L$? At most $\\lceil L / 2 \\rceil$! As soon as $W(i, j) > L$, we <code>break</code> out of the inner $j$-loop immediately. Thus the time complexity is not $O(n^2)$, but <strong>$O(n \\cdot W_{\\text{max\\_words\\_per\\_line}}) = O(n \\cdot L)$</strong>—which is linear $O(n)$ for a fixed page width $L \\approx 80$!</p>
        </div>

        <h3>2. From $\\TeX$ Paragraphs to Code Formatters (<code>prettier</code>, <code>clang-format</code>, <code>rustfmt</code>)</h3>
        <p>Modern source code formatters (<code>clang-format</code>, Wadler/Oppen pretty-printers in <code>prettier</code> and <code>rustfmt</code>) extend Knuth-Plass from flat word arrays to <strong>Abstract Syntax Trees (ASTs)</strong>:</p>
        <ul>
          <li>Each token break has a <em> syntactic penalty weight</em> (breaking after a <code>,</code> or <code>;</code> is cheap; breaking inside <code>a + b</code> is expensive) and an <em>indentation level</em> $I$.</li>
          <li>Because indentation changes the remaining line budget $L - I$ for subsequent tokens, the state in <code>clang-format</code> is <code>(token_index, column_offset, paren_stack_state)</code> explored via Dijkstra / $A^*$ on the formatting DAG.</li>
        </ul>

        <div class="mermaid">
flowchart LR
  W0["Word 0"] -->|"(L - W(0,3))^3"| W3["Word 3"]
  W0 -->|"(L - W(0,4))^3"| W4["Word 4"]
  W3 -->|"(L - W(3,6))^3"| W6["Word 6 (End, cost=0)"]
  W4 -->|"(L - W(4,6))^3"| W6
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Concave Monge Property & $O(N)$ SMAWK / Convex Hull Acceleration</h4>
          <p>What if line width $L$ is huge (so $O(N \\cdot L)$ is too slow)? Because the penalty function $f(x) = x^2$ or $x^3$ is convex, the transition matrix $C[i][j] = \\text{cost}(i, j) + dp[j]$ satisfies the <strong>Quadrangle Inequality (Monge Property)</strong>: optimal split points are monotonic ($\\text{opt}[i] \\le \\text{opt}[i+1]$). Using Wilber's algorithm or Hirschberg-Larmore's Convex Hull / Monge deque, Knuth-Plass line breaking runs in strict $O(N)$ time regardless of $L$!</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-edit-distance-myers"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Line-Breaking Algorithm</th>
              <th>Time Complexity</th>
              <th>Space Complexity</th>
              <th>Global Optimality</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Greedy Word Wrap (Browser / Notepad)</td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-o1">O(1)</span></td>
              <td>Suboptimal (Creates loose lines before long words)</td>
            </tr>
            <tr>
              <td>Naive All-Pairs Suffix DP</td>
              <td><span class="badge-on2">O(N^2)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Exact Global Optimum</td>
            </tr>
            <tr>
              <td>Knuth-Plass DP with Early <code>W(i,j) &gt; L</code> Break</td>
              <td><span class="badge-on">O(N * (L / avg_w))</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Exact Global Optimum (Linear for fixed $L$)</td>
            </tr>
            <tr>
              <td>Monge / CHT Accelerated Knuth-Plass ($p=2$)</td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Exact Global Optimum for arbitrary $L$</td>
            </tr>
          </tbody>
        </table>

        <h3>4. Reference C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;string&gt;
#include &lt;vector&gt;

struct LineBreakPlan {
    long long total_demerits;
    // Pairs of [start_word_idx, end_word_idx_exclusive) for each formatted line
    std::vector&lt;std::pair&lt;int, int&gt;&gt; lines;
};

// Knuth-Plass Optimal Paragraph Line Breaking with Cubic Badness Penalty
LineBreakPlan knuth_plass_line_break(const std::vector&lt;int&gt;&amp; word_widths, int line_width) {
    const int n = static_cast&lt;int&gt;(word_widths.size());
    if (n == 0) return { 0, {} };

    std::vector&lt;int&gt; pref(n + 1, 0);
    for (int i = 0; i &lt; n; ++i) pref[i + 1] = pref[i] + word_widths[i];

    auto line_len = [&amp;](int i, int j) -&gt; int {
        return (pref[j] - pref[i]) + (j - 1 - i);
    };

    constexpr long long INF = 1LL &lt;&lt; 60;
    std::vector&lt;long long&gt; dp(n + 1, INF);
    std::vector&lt;int&gt; next_break(n + 1, n);
    dp[n] = 0;

    // Evaluate suffixes i = n-1 down to 0
    for (int i = n - 1; i &gt;= 0; --i) {
        for (int j = i + 1; j &lt;= n; ++j) {
            int width = line_len(i, j);
            if (width &gt; line_width) {
                // Only exception: a single word wider than line_width must still be placed on its own line
                if (j == i + 1) {
                    dp[i] = dp[j];
                    next_break[i] = j;
                }
                break; // Monotonicity of width: no larger j can ever fit on this line!
            }
            long long slack = line_width - width;
            // Last line (j == n) has 0 badness penalty in standard typography
            long long badness = (j == n) ? 0LL : (slack * slack * slack);
            if (badness + dp[j] &lt; dp[i]) {
                dp[i] = badness + dp[j];
                next_break[i] = j;
            }
        }
    }

    // Reconstruct optimal line breaks from parent pointers <code>next_break</code>
    LineBreakPlan plan{ dp[0], {} };
    for (int cur = 0; cur &lt; n; cur = next_break[cur]) {
        plan.lines.emplace_back(cur, next_break[cur]);
    }
    return plan;
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Penalizing the Final Line ($j = n$) or Crashing on Overlong Words ($w_i > L$)</h4>
          <p>In real-world typesetting and code formatting, two edge cases must be handled explicitly: First, the final line of a paragraph ($j = n$) is ragged-right and should incur <strong>$0$ badness penalty</strong> for leftover slack (otherwise the solver will artificially pull words down from earlier lines just to pad the last line!). Second, if a single word or URL has $w_i > L$, breaking immediately when <code>width > line_width</code> at $j = i + 1$ leaves <code>dp[i] = INF</code>; a production formatter must allow single overfull tokens ($j = i + 1$) as a fallback.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Knuth-Plass line breaking formulates paragraph justification as a DAG shortest path problem over word boundaries with quadratic or cubic slack penalties.",
      "Terminating the inner loop as soon as W(i, j) > L reduces runtime from O(N^2) to O(N * max_words_per_line), which is O(N) for standard column widths.",
      "The final line of a paragraph (j == n) has 0 slack penalty so earlier lines are not distorted to pad the last line.",
      "Modern code formatters (clang-format, prettier, rustfmt) generalize Knuth-Plass to AST token streams with syntax-weighted break demerits and indentation states."
    ],
    furtherReading: [
      {
        title: "Donald E. Knuth & Michael F. Plass — Breaking Paragraphs into Lines (Software: Practice and Experience, 1981)",
        url: "https://www-cs-faculty.stanford.edu/~knuth/papers/plass.pdf"
      },
      {
        title: "MIT 6.006 Introduction to Algorithms — Lecture 20: Text Justification via Dynamic Programming",
        url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
      }
    ]
  },

  "build-hirschberg-linear-space-diff": {
    title: "Build Lab: Hirschberg's O(NM)-Time O(min(N,M))-Space Sequence Alignment & Diff Reconstructor",
    video: {
      youtubeId: "3TfDm8GpWRU",
      title: "Space-Efficient Sequence Alignment — Hirschberg's Linear-Space Divide & Conquer DP",
      channel: "Bioinformatics Algorithms: An Active Learning Approach",
      duration: "10:36",
      start: 0,
      length: "11m",
      why: "Shows how meeting in the middle with forward and reverse 2-row DP sweeps finds the optimal alignment midpoint in O(min(N, M)) space and O(NM) total time."
    },
    intuition: "Rolling arrays compute the Edit Distance or LCS *score* in O(min(N, M)) memory, but throw away the parent pointers needed to reconstruct the actual diff! Hirschberg's algorithm (1975) marries Divide-and-Conquer with Rolling-Array DP: by running a 1D forward DP on the top half of A and a 1D backward DP on the bottom half of A, we find the exact column j* where the optimal alignment crosses the middle row mid = N/2—reconstructing the entire alignment in O(N*M) time and strict O(min(N, M)) space.",
    content: `
      <div class="lesson-content">
        <h3>1. The Memory Bottleneck of Full Alignment Tables</h3>
        <p>When aligning two genomic sequences or source files of length $N = M = 100{,}000$, storing a 2D table of 32-bit parent pointers requires $10^{10} \\times 4 \\text{ bytes} = 40 \\text{ GB}$ of RAM—causing an immediate Out-Of-Memory (OOM) crash. Yet a 1D rolling array of length $M + 1$ takes only $400 \\text{ KB}$, at the cost of forgetting the path. How can we recover the full path using only $O(M)$ memory?</p>

        <div class="invariant-box">
          <h4>Core Invariant — Hirschberg's Midpoint Split Theorem (1975)</h4>
          <p>Let $\\text{mid} = \\lfloor n / 2 \\rfloor$ split string $A[0..n-1]$ into top half $A_{\\text{top}} = A[0..\\text{mid}-1]$ and bottom half $A_{\\text{bot}} = A[\\text{mid}..n-1]$. Any path from $(0, 0)$ to $(n, m)$ in the alignment DAG must pass through some vertex $(\\text{mid}, j)$ on row $\\text{mid}$ for $0 \\le j \\le m$. Therefore:</p>
          $$\\text{OPT}(A, B) = \\min_{0 \\le j \\le m} \\Big( \\underbrace{\\text{ForwardDP}(A[0..\\text{mid}-1],\\; B[0..j-1])}_{L[j]} + \\underbrace{\\text{BackwardDP}(A[\\text{mid}..n-1],\\; B[j..m-1])}_{R[j]} \\Big)$$
          <p>We compute the 1D row $L[0..m]$ using a standard rolling-array forward pass, and $R[0..m]$ using a rolling-array backward pass (on reversed suffixes), find $j^* = \\arg\\min_{0 \\le j \\le m} (L[j] + R[j])$ (or $\\arg\\max$ for LCS), and recursively solve the two subproblems:<br/>
          1. Top-Left quadrant: $(A[0..\\text{mid}-1],\\; B[0..j^*-1])$ of area $\\frac{n}{2} \\cdot j^*$.<br/>
          2. Bottom-Right quadrant: $(A[\\text{mid}..n-1],\\; B[j^*..m-1])$ of area $\\frac{n}{2} \\cdot (m - j^*)$.</p>
        </div>

        <h3>2. The Geometric Series Proof: Why Total Time Only Doubles ($2NM$)</h3>
        <p>At depth $0$ of the recursion, the forward and backward 1D passes do proportional to $\\frac{n}{2} m + \\frac{n}{2} m = n m$ work. At depth $1$, the two recursive calls process areas $\\frac{n}{2} j^*$ and $\\frac{n}{2} (m - j^*)$, whose sum is:</p>
        $$\\frac{n}{2} j^* + \\frac{n}{2}(m - j^*) = \\frac{1}{2} n m$$
        <p>At depth $d$, the $2^d$ subproblems have total grid area $\\frac{1}{2^d} n m$! Summing over all recursion levels gives the geometric series:</p>
        $$T(n, m) = nm \\left(1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\dots\\right) = 2nm = \\Theta(nm)$$
        <p>Meanwhile, by reusing preallocated scratch vectors (or freeing row buffers before recursing), peak memory is strictly $\\Theta(\\min(n, m) + \\text{output size})$!</p>

        <div class="mermaid">
flowchart TD
  Full["Full Grid: n x m<br/>Work = n * m"] --> Split["Find optimal crossing (mid, j*)<br/>where mid = n/2 and j* minimizes L[j] + R[j]"]
  Split --> TL["Top-Left Quadrant:<br/>(n/2) x j*"]
  Split --> BR["Bottom-Right Quadrant:<br/>(n/2) x (m - j*)"]
  TL --> Sum["Total Work at Depth 1:<br/>(n/2)*j* + (n/2)*(m - j*) = (1/2) n*m!"]
  BR --> Sum
        </div>

        <div class="hardware-box">
          <h4>Hardware Reality — Reusing Scratch Buffers vs. Allocating Vectors Inside Recursion</h4>
          <p>If each recursive call in Hirschberg allocates new <code>std::vector&lt;int&gt;</code> buffers on the heap, the $O(N)$ recursive calls perform $O(N)$ <code>malloc</code>/<code>free</code> syscalls and risk $O(M \\log N)$ stack-accumulated memory if vectors stay alive across recursive calls. Production implementations Either shrink-to-fit/free temporary vectors <em>before</em> recursing, or write the 1D DP directly into a shared scratch arena slices of size $j^* + 1$ and $m - j^* + 1$.</p>
        </div>

        <h3>3. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-edit-distance-myers"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Sequence Reconstruction Method</th>
              <th>Time Complexity</th>
              <th>Auxiliary Working Space</th>
              <th>RAM for $N = M = 50{,}000$</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Full 2D DP Table (<code>int dp[N][M]</code>)</td>
              <td><span class="badge-on2">1 * N * M</span></td>
              <td><span class="badge-on2">O(N * M)</span></td>
              <td><strong>10.0 GB</strong> (OOM)</td>
            </tr>
            <tr>
              <td>Bit-Packed Direction Table (2 bits/cell)</td>
              <td><span class="badge-on2">1 * N * M</span></td>
              <td><span class="badge-on2">O(N * M / 4)</span></td>
              <td><strong>625 MB</strong></td>
            </tr>
            <tr>
              <td>Hirschberg's Divide &amp; Conquer DP</td>
              <td><span class="badge-on2">2 * N * M</span></td>
              <td><span class="badge-on">O(min(N, M))</span></td>
              <td><strong>&lt; 1 MB</strong> (L2 Cache!)</td>
            </tr>
          </tbody>
        </table>

        <h3>4. Complete Production C++20 Build Lab Implementation</h3>
        <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;string&gt;
#include &lt;string_view&gt;
#include &lt;vector&gt;

// Hirschberg's Algorithm: Reconstruct exact Longest Common Subsequence in O(N*M) time and O(M) space
class HirschbergLCS {
    // 1D Rolling Forward LCS row for A[0..n-1] vs B[0..m-1]
    static std::vector&lt;int&gt; lcs_forward_row(std::string_view a, std::string_view b) {
        const int m = static_cast&lt;int&gt;(b.size());
        std::vector&lt;int&gt; dp(m + 1, 0);
        for (char ca : a) {
            int prev_diag = 0;
            for (int j = 1; j &lt;= m; ++j) {
                int saved_up = dp[j];
                if (ca == b[j - 1]) dp[j] = prev_diag + 1;
                else dp[j] = std::max(dp[j], dp[j - 1]);
                prev_diag = saved_up;
            }
        }
        return dp;
    }

    // 1D Rolling Backward LCS row for reversed suffixes of A and B
    static std::vector&lt;int&gt; lcs_backward_row(std::string_view a, std::string_view b) {
        const int n = static_cast&lt;int&gt;(a.size());
        const int m = static_cast&lt;int&gt;(b.size());
        std::vector&lt;int&gt; dp(m + 1, 0);
        for (int i = n - 1; i &gt;= 0; --i) {
            int prev_diag = 0;
            for (int j = m - 1; j &gt;= 0; --j) {
                int saved_down = dp[j];
                if (a[i] == b[j]) dp[j] = prev_diag + 1;
                else dp[j] = std::max(dp[j], dp[j + 1]);
                prev_diag = saved_down;
            }
        }
        return dp;
    }

    static void solve_rec(std::string_view a, std::string_view b, std::string&amp; out) {
        const int n = static_cast&lt;int&gt;(a.size());
        const int m = static_cast&lt;int&gt;(b.size());
        if (n == 0 || m == 0) return;

        // Base Case: Single character in <code>a</code> takes O(m) scan
        if (n == 1) {
            if (b.find(a[0]) != std::string_view::npos) {
                out.push_back(a[0]);
            }
            return;
        }

        const int mid = n / 2;
        int best_j = 0;
        {
            // Scope block ensures <code>L</code> and <code>R</code> are deallocated BEFORE recursing!
            std::vector&lt;int&gt; L = lcs_forward_row(a.substr(0, mid), b);
            std::vector&lt;int&gt; R = lcs_backward_row(a.substr(mid), b);
            int max_len = -1;
            for (int j = 0; j &lt;= m; ++j) {
                if (L[j] + R[j] &gt; max_len) {
                    max_len = L[j] + R[j];
                    best_j = j;
                }
            }
        }

        // Conquer Top-Left [0..mid) x [0..best_j) and Bottom-Right [mid..n) x [best_j..m)
        solve_rec(a.substr(0, mid), b.substr(0, best_j), out);
        solve_rec(a.substr(mid), b.substr(best_j), out);
    }

public:
    static std::string reconstruct_lcs(std::string_view a, std::string_view b) {
        std::string out;
        out.reserve(std::min(a.size(), b.size()));
        solve_rec(a, b, out);
        return out;
    }
};</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Keeping <code>L</code> and <code>R</code> Vectors Alive on the Stack Across Recursive Calls</h4>
          <p>Look closely at the inner block <code>{ std::vector&lt;int&gt; L = ...; std::vector&lt;int&gt; R = ...; }</code> in <code>solve_rec</code>: if you do <em>not</em> destroy or clear <code>L</code> and <code>R</code> before invoking the two recursive calls, each level of the recursion tree holds onto its $O(M)$ vectors while descending, inflating peak space from $O(M)$ to $O(M \\log N)$ (or $O(N + M)$)! Scoping <code>L</code> and <code>R</code> so their destructors run before <code>solve_rec</code> recurses guarantees strict $O(M)$ auxiliary heap memory at every instant.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Hirschberg's algorithm reconstructs the full optimal alignment/LCS path in O(N * M) time and O(min(N, M)) space by combining Divide-and-Conquer with 1D rolling DP.",
      "Running a forward 1D DP on A[0..mid-1] and a backward 1D DP on A[mid..n-1] finds the exact column j* where the optimal path crosses row mid = n/2.",
      "Because the two recursive subproblems have areas (n/2)*j* and (n/2)*(m - j*) summing to (1/2)nm, total work across all depths forms a geometric series 1 + 1/2 + 1/4 + ... = 2nm.",
      "Deallocate the forward/backward row vectors L and R before entering the recursive calls to maintain strict O(M) peak heap usage."
    ],
    furtherReading: [
      {
        title: "Daniel S. Hirschberg — A Linear Space Algorithm for Computing Maximal Common Subsequences (Communications of the ACM, 1975)",
        url: "https://dl.acm.org/doi/10.1145/360825.360861"
      },
      {
        title: "Jeff Erickson — Algorithms, Section 3.8: Linear-Space Sequence Alignment (Hirschberg's Algorithm)",
        url: "https://jeffe.cs.illinois.edu/teaching/algorithms/book/03-dynprog.pdf"
      }
    ]
  }
};

