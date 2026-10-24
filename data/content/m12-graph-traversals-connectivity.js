window.MODULE_CONTENT = window.MODULE_CONTENT || {};
window.MODULE_CONTENT["m12"] = {
  "graph-representations-csr-cache": {
    title: "Graph Representations: Adjacency Lists, Bit Matrices & Compressed Sparse Row (CSR)",
    video: {
      youtubeId: "hlTwhuamoS0",
      id: "hlTwhuamoS0",
      url: "https://www.youtube.com/embed/hlTwhuamoS0",
      title: "Compressed Sparse Row (CSR) Memory Layout for High-Performance Graph & Matrix Kernels",
      channel: "Dayne Guy",
      duration: "11:45",
      start: 0,
      length: "11m",
      why: "Erik Demaine and Jason Ku establish the foundational memory models for sparse and dense graphs before contrasting pointer-heavy adjacency lists with flat array encodings."
    },
    intuition: "<p>In asymptotic analysis, an adjacency list of <code>std::vector&lt;std::vector&lt;int&gt;&gt;</code> and a Compressed Sparse Row (CSR) flat array both consume $O(V + E)$ space and iterate over a vertex's neighbors in $O(\\text{deg}(u))$ time. On physical silicon, however, their execution speed differs by $5\\times$ to $12\\times$. Pointer-chasing across $V$ separately heap-allocated dynamic arrays triggers an L3 cache miss and TLB walk on nearly every vertex transition, whereas CSR packs all edges into a single contiguous memory slab.</p><p>Selecting the right graph representation is an exercise in matching edge density $E / V^2$ and mutation frequency against the CPU's 64-byte cache line and hardware prefetcher. Static or batch-built sparse graphs belong in CSR; dense graphs where $V \\le 4096$ belong in 64-bit word-packed bitset adjacency matrices where 64 edge lookups execute in a single bitwise instruction.</p>",
    content: `<div class="lesson-content">
      <h2>The Three Canonical Graph Layouts</h2>
      <p>Given a directed or undirected graph $G = (V, E)$ with $|V| = n$ vertices and $|E| = m$ edges, an algorithm interacts with the graph through three primary operations: testing edge existence $\\text{hasEdge}(u, v)$, enumerating incident edges $\\text{neighbors}(u)$, and mutating topology $\\text{addEdge}(u, v)$. No single memory layout optimizes all three simultaneously.</p>

      <div class="invariant-box">
        <div class="box-title">Formal Invariant — Compressed Sparse Row (CSR) Slice Equivalence</div>
        <p>A static directed graph $G = (V, E)$ with vertices indexed $0 \\dots n-1$ is uniquely encoded by two flat arrays: an offset array $\\text{head}[0 \\dots n]$ of length $n + 1$ and a target array $\\text{to}[0 \\dots m-1]$ of length $m$ (plus optional $\\text{weight}[0 \\dots m-1]$). For every vertex $u \\in [0, n-1]$, its outgoing neighbors occupy the contiguous slice:</p>
        $$\\text{neighbors}(u) = \\text{to}\\big[\\text{head}[u] \\;..\\; \\text{head}[u+1] - 1\\big]$$
        <p>Consequently, $\\text{out-degree}(u) = \\text{head}[u+1] - \\text{head}[u]$ in $O(1)$ arithmetic without storing explicit length fields, and $\\text{head}[n] = m$.</p>
      </div>

      <h3>1. Vector-of-Vectors Adjacency List vs. Linked-Star Forward Star</h3>
      <p>In naive C++ or Java implementations, developers represent graphs as <code>vector&lt;vector&lt;Edge&gt;&gt; adj(n)</code>. While convenient for incremental <code>push_back</code> mutations, this layout incurs two levels of indirection: first indexing the outer spine array to load a 24-byte <code>std::vector</code> control block (pointer, size, capacity), and second dereferencing its heap pointer into a fragmented allocator arena. When $n = 10^6$ and average degree is 4, allocator metadata and geometric overallocation waste over $60\\%$ of RAM.</p>
      <p>When dynamic edge insertion is required without sorting, competitive programmers and high-performance solvers use the <strong>Adjacency Forward Star</strong> (array-backed intrusive singly linked list): three flat arrays <code>head[V]</code>, <code>to[E]</code>, and <code>next[E]</code>. Adding edge $e = (u, v)$ sets <code>to[e] = v; next[e] = head[u]; head[u] = e;</code> in $O(1)$ worst-case time with zero heap allocations after initial reservation.</p>

      <h3>2. Compressed Sparse Row (CSR) Construction via Prefix Sums</h3>
      <p>When the edge list is known upfront (or ingested in batches), CSR eliminates even the <code>next[E]</code> pointer array of the forward star. Construction proceeds in two linear passes over the raw edge buffer:</p>
      <ol>
        <li><strong>Degree Histogram &amp; Exclusive Prefix Sum:</strong> Count the out-degree of each vertex $u$ in $\\text{head}[u+1]$, then compute the cumulative sum $\\text{head}[i] = \\sum_{k=0}^{i-1} \\text{deg}(k)$.</li>
        <li><strong>Scatter Pass:</strong> Copy $\\text{head}$ into a temporary cursor array $\\text{cur}[0 \\dots n-1]$. For each edge $(u, v)$, write $\\text{to}[\\text{cur}[u]++] = v$.</li>
      </ol>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 720 220" width="100%" style="max-width: 720px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="20" y="28" fill="#94a3b8" font-family="monospace" font-size="13" font-weight="bold">CSR Flat Memory Layout (V = 4, E = 6)</text>
          <text x="20" y="65" fill="#cbd5e1" font-family="monospace" font-size="12">head[0..4] (Offsets)</text>
          <g transform="translate(180, 45)">
            <rect x="0" y="0" width="60" height="32" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="30" y="21" fill="#38bdf8" font-family="monospace" font-size="13" text-anchor="middle">0</text>
            <text x="30" y="-6" fill="#64748b" font-family="monospace" font-size="10" text-anchor="middle">u=0</text>
            <rect x="60" y="0" width="60" height="32" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="90" y="21" fill="#38bdf8" font-family="monospace" font-size="13" text-anchor="middle">2</text>
            <text x="90" y="-6" fill="#64748b" font-family="monospace" font-size="10" text-anchor="middle">u=1</text>
            <rect x="120" y="0" width="60" height="32" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="150" y="21" fill="#38bdf8" font-family="monospace" font-size="13" text-anchor="middle">4</text>
            <text x="150" y="-6" fill="#64748b" font-family="monospace" font-size="10" text-anchor="middle">u=2</text>
            <rect x="180" y="0" width="60" height="32" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="210" y="21" fill="#38bdf8" font-family="monospace" font-size="13" text-anchor="middle">5</text>
            <text x="210" y="-6" fill="#64748b" font-family="monospace" font-size="10" text-anchor="middle">u=3</text>
            <rect x="240" y="0" width="60" height="32" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
            <text x="270" y="21" fill="#94a3b8" font-family="monospace" font-size="13" text-anchor="middle">6</text>
            <text x="270" y="-6" fill="#64748b" font-family="monospace" font-size="10" text-anchor="middle">end</text>
          </g>
          <text x="20" y="160" fill="#cbd5e1" font-family="monospace" font-size="12">to[0..5] (Targets)</text>
          <g transform="translate(180, 140)">
            <rect x="0" y="0" width="60" height="32" fill="#1e293b" stroke="#34d399" stroke-width="1.5"/>
            <text x="30" y="21" fill="#34d399" font-family="monospace" font-size="13" text-anchor="middle">1</text>
            <rect x="60" y="0" width="60" height="32" fill="#1e293b" stroke="#34d399" stroke-width="1.5"/>
            <text x="90" y="21" fill="#34d399" font-family="monospace" font-size="13" text-anchor="middle">2</text>
            <rect x="120" y="0" width="60" height="32" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="150" y="21" fill="#f59e0b" font-family="monospace" font-size="13" text-anchor="middle">2</text>
            <rect x="180" y="0" width="60" height="32" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="210" y="21" fill="#f59e0b" font-family="monospace" font-size="13" text-anchor="middle">3</text>
            <rect x="240" y="0" width="60" height="32" fill="#1e293b" stroke="#a78bfa" stroke-width="1.5"/>
            <text x="300" y="21" fill="#a78bfa" font-family="monospace" font-size="13" text-anchor="middle">0</text>
            <rect x="240" y="0" width="60" height="32" fill="#1e293b" stroke="#a78bfa" stroke-width="1.5"/>
            <text x="270" y="21" fill="#a78bfa" font-family="monospace" font-size="13" text-anchor="middle">3</text>
            <rect x="300" y="0" width="60" height="32" fill="#1e293b" stroke="#f472b6" stroke-width="1.5"/>
            <text x="330" y="21" fill="#f472b6" font-family="monospace" font-size="13" text-anchor="middle">0</text>
          </g>
          <path d="M 210 77 L 185 138" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3,3"/>
          <path d="M 270 77 L 300 138" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3,3"/>
          <path d="M 330 77 L 420 138" stroke="#a78bfa" stroke-width="1.2" stroke-dasharray="3,3"/>
          <path d="M 390 77 L 480 138" stroke="#f472b6" stroke-width="1.2" stroke-dasharray="3,3"/>
          <text x="180" y="198" fill="#94a3b8" font-family="monospace" font-size="11">Single 64-byte cache line holds 16 consecutive 32-bit target vertex IDs</text>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        A["Raw Edge List (u, v)"] --> B["Count Degrees: head[u+1]++"]
        B --> C["Prefix Sum: head[i] += head[i-1]"]
        C --> D["Scatter Edges into Contiguous to[0..E-1]"]
      </div>

      <div class="simulator-mount" data-sim="sim-csr-eulerian-hierholzer"></div>

      <h3>3. Word-Packed Bitset Adjacency Matrices</h3>
      <p>For dense graphs ($E = \\Theta(V^2)$) or transitive closure / triangle counting on medium-sized graphs ($V \\le 5000$), a boolean byte matrix wastes $7/8$ of every byte. Packing 64 edges into each <code>uint64_t</code> word reduces memory to $V^2 / 8$ bytes (just $3.1\\text{ MB}$ for $V = 5000$) and unlocks word-level parallelism ($O(V / w)$ where $w = 64$):</p>
      <ul>
        <li><strong>Common Neighbors / Triangle Counting:</strong> The number of common neighbors of $u$ and $v$ is $\\sum_{k=0}^{\\lceil V/64 \\rceil - 1} \\text{popcount}(\\text{row}[u][k] \\,\\&\\, \\text{row}[v][k])$, executing 64 vertex intersections per single <code>POPCNT</code> instruction.</li>
        <li><strong>Bitset BFS / Unvisited Neighbor Discovery:</strong> Maintaining a bitset <code>unvisited</code> of remaining vertices allows BFS from $u$ to find and clear all unvisited neighbors in $O(V / 64)$ via <code>mask = row[u][k] &amp; unvisited[k]</code> and iterating set bits with <code>__builtin_ctzll(mask)</code>, reducing dense BFS from $O(V^2)$ to $O(V^2 / 64)$.</li>
      </ul>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — L1D Prefetcher &amp; TLB Page Walks</div>
        <p>A 64-byte CPU cache line holds sixteen 32-bit vertex IDs. When iterating over <code>to[head[u] .. head[u+1]-1]</code> in CSR, the Intel/AMD L1 data stream prefetcher detects sequential memory access within 2 cache lines and prefetches subsequent edges into L1D ($\\approx 4$ cycles latency). In contrast, <code>std::vector&lt;std::vector&lt;int&gt;&gt;</code> scatters small heap allocations across disparate 4 KB virtual memory pages, thrashing the L1 dTLB (typically 64 entries) and stalling the out-of-order execution engine on $\\approx 200$-cycle DRAM fetches.</p>
      </div>

      <h2>Asymptotic &amp; Hardware Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Representation</th>
            <th>Space Overhead</th>
            <th><code>hasEdge(u, v)</code></th>
            <th>Iterate <code>neighbors(u)</code></th>
            <th>Dynamic <code>addEdge(u, v)</code></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>CSR (Flat Arrays)</strong></td>
            <td><span class="badge-on">4V + 4E bytes</span></td>
            <td><span class="badge-ologn">O(log deg(u))</span> (sorted)</td>
            <td><span class="badge-on">O(deg(u))</span> (L1 contiguous)</td>
            <td><span class="badge-on">O(V + E)</span> (rebuild)</td>
          </tr>
          <tr>
            <td><strong>Forward Star (Array Linked)</strong></td>
            <td><span class="badge-on">4V + 8E bytes</span></td>
            <td><span class="badge-on">O(deg(u))</span></td>
            <td><span class="badge-on">O(deg(u))</span></td>
            <td><span class="badge-o1">O(1)</span> worst-case</td>
          </tr>
          <tr>
            <td><strong>Vector of Vectors</strong></td>
            <td><span class="badge-on">24V + ~8E bytes</span></td>
            <td><span class="badge-on">O(deg(u))</span></td>
            <td><span class="badge-on">O(deg(u))</span> (pointer chase)</td>
            <td><span class="badge-o1">O(1)</span> amortized</td>
          </tr>
          <tr>
            <td><strong>64-Bit Bitset Matrix</strong></td>
            <td><span class="badge-on2">V² / 8 bytes</span></td>
            <td><span class="badge-o1">O(1)</span> bitwise test</td>
            <td><span class="badge-on">O(V / 64 + deg(u))</span></td>
            <td><span class="badge-o1">O(1)</span> bitwise OR</td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: CSR Graph &amp; Bitset Intersection</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;utility&gt;

struct CSRGraph {
    int n, m;
    std::vector&lt;int&gt; head;
    std::vector&lt;int&gt; to;

    CSRGraph(int vertices, const std::vector&lt;std::pair&lt;int, int&gt;&gt;&amp; edges)
        : n(vertices), m(static_cast&lt;int&gt;(edges.size())), head(vertices + 1, 0), to(edges.size()) {
        for (const auto&amp; [u, v] : edges) {
            ++head[u + 1];
        }
        for (int i = 1; i &lt;= n; ++i) {
            head[i] += head[i - 1];
        }
        std::vector&lt;int&gt; cursor(head.begin(), head.end() - 1);
        for (const auto&amp; [u, v] : edges) {
            to[cursor[u]++] = v;
        }
    }

    struct NeighborRange {
        const int* b;
        const int* e;
        const int* begin() const noexcept { return b; }
        const int* end() const noexcept { return e; }
    };

    NeighborRange neighbors(int u) const noexcept {
        return {to.data() + head[u], to.data() + head[u + 1]};
    }
};

// Triangle counting on a 64-bit word-packed bitset adjacency matrix in O(V^3 / 64)
uint64_t countTrianglesBitset(int n, const std::vector&lt;std::vector&lt;uint64_t&gt;&gt;&amp; adjBits) {
    const int words = (n + 63) / 64;
    uint64_t total = 0;
    for (int u = 0; u &lt; n; ++u) {
        for (int v = u + 1; v &lt; n; ++v) {
            if ((adjBits[u][v &gt;&gt; 6] &gt;&gt; (v &amp; 63)) &amp; 1ULL) {
                for (int w = 0; w &lt; words; ++w) {
                    total += __builtin_popcountll(adjBits[u][w] &amp; adjBits[v][w]);
                }
            }
        }
    }
    return total / 3;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Undirected Edge Doubling &amp; Reverse-Edge Indexing</div>
        <p>When encoding an undirected graph in CSR or Forward Star, every undirected edge $\{u, v\}$ must be inserted twice: $(u, v)$ and $(v, u)$, so $m_{\\text{array}} = 2|E|$. However, note that CSR scatters edges sorted by source vertex $u$, which breaks the paired index trick <code>e ^ 1</code> used in residual flow networks or bridge-finding unless paired edge indices are explicitly stored in a parallel array.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Compressed Sparse Row (CSR) stores all outgoing edges in a single contiguous array to[0..E-1] indexed by prefix-sum offsets head[0..V], eliminating per-vertex heap allocations and pointer chasing.",
      "Constructing a CSR graph from an unsorted edge list takes O(V + E) time and O(V + E) auxiliary space via counting sort (degree histogram + prefix sum + scatter).",
      "For mutable sparse graphs, the array-backed Forward Star (head[V], to[E], next[E]) supports O(1) worst-case edge insertion without std::vector reallocation spikes.",
      "Word-packed 64-bit bitset adjacency matrices compress dense graphs to V^2/8 bytes and accelerate neighbor intersection and dense BFS by a factor of w = 64 using hardware POPCNT and TZCNT instructions."
    ],
    furtherReading: [
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 20.1: Representations of Graphs", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "Sedgewick & Wayne — Algorithms (4th Ed.), Section 4.1: Undirected Graphs", url: "https://algs4.cs.princeton.edu/41graph/" },
      { title: "Jeff Erickson — Algorithms, Chapter 5: Basic Graph Algorithms", url: "https://jeffe.cs.illinois.edu/teaching/algorithms/" }
    ]
  },

  "bfs-01-bfs-multi-source": {
    title: "Breadth-First Search: Multi-Source BFS, 0-1 BFS (Deque) & Bidirectional Search",
    video: {
      youtubeId: "oDqjPvD54Ss",
      title: "Breadth First Search (BFS) Algorithm Visualized",
      channel: "William Fiset",
      duration: "10:15",
      length: "10:15",
      start: 0,
      why: "Demonstrates wave-front level expansion and shortest-path tree construction on unweighted graphs."
    },
    intuition: "<p>Breadth-First Search (BFS) is not merely a traversal order; it is a specialized instance of Dijkstra's shortest-path algorithm where edge weights are restricted to $\{1\}$ (or $\{0, 1\}$ in 0-1 BFS). Because all edges added to the frontier increase path distance by at most $1$, the priority queue collapses into a FIFO queue (or a double-ended queue), maintaining the sorted order of distances without $O(\\log V)$ heap overhead.</p><p>By generalizing the initial frontier to multiple starting vertices (Multi-Source BFS), allowing zero-cost transitions pushed to the front of a deque (0-1 BFS), or expanding simultaneously from source and target (Bidirectional BFS), you can solve complex shortest-path problems in strict $O(V + E)$ linear time.</p>",
    content: `<div class="lesson-content">
      <h2>The Two-Valued Queue Monotonicity Invariant</h2>
      <p>Why does a simple FIFO queue suffice to compute exact shortest paths in unweighted graphs, and why does a double-ended queue (deque) suffice when edge weights are $w(u, v) \\in \\{0, 1\\}$? The answer lies in the <strong>Two-Valued Queue Invariant</strong>.</p>

      <div class="invariant-box">
        <div class="box-title">Formal Invariant — Queue Monotonicity &amp; Two-Level Bound</div>
        <p>At any point during standard BFS or 0-1 BFS execution, if the deque contains vertices $\\langle v_1, v_2, \\dots, v_k \\rangle$ from front to back, their tentative distances satisfy:</p>
        $$d[v_1] \\le d[v_2] \\le \\dots \\le d[v_k] \\quad \\text{and} \\quad d[v_k] - d[v_1] \\le 1$$
        <p>In 0-1 BFS, popping $u = v_1$ with minimum distance $d[u]$ and relaxing an edge $(u, x)$ produces either $d[x] = d[u]$ (via a weight-0 edge, pushed to the <strong>front</strong> before $v_2$) or $d[x] = d[u] + 1$ (via a weight-1 edge, pushed to the <strong>back</strong> after $v_k$, since $d[v_k] \\le d[u] + 1$). Thus monotonicity is preserved inductively in $O(1)$ per operation.</p>
      </div>

      <h3>1. Multi-Source BFS via Virtual Super-Source</h3>
      <p>Given a set of source vertices $S = \\{s_1, s_2, \\dots, s_k\\}$ (such as all exit cells in a grid or all infected nodes in a network), finding $\\min_{s \\in S} \\text{dist}(s, v)$ for every vertex $v \\in V$ does not require $k$ separate BFS runs. Conceptually, introduce a virtual super-source $s^*$ with directed zero-weight edges $(s^*, s_i)$ for all $s_i \\in S$. In code, simply initialize $d[s_i] = 0$ and push all $s_i \\in S$ into the queue at step 0 before starting the loop. Every vertex $v$ is visited at most once in $O(V + E)$ total time.</p>

      <h3>2. 0-1 BFS with a Double-Ended Queue (Dial's $C=1$ Specialization)</h3>
      <p>Many grid and state-space problems have free transitions ($w = 0$, e.g., moving along a conveyor belt's direction or staying in the same corridor) and unit-cost modifications ($w = 1$, e.g., rotating a tile or breaking a wall). Standard BFS fails because a path with more edges can have lower total weight. Dijkstra's algorithm runs in $O((V + E) \\log V)$, whereas 0-1 BFS achieves $O(V + E)$:</p>
      <ul>
        <li>When relaxing $(u, v)$ with weight $w \\in \\{0, 1\\}$, check if $d[u] + w &lt; d[v]$.</li>
        <li>If improved, update $d[v] = d[u] + w$. If $w == 0$, call <code>dq.push_front(v)</code>; if $w == 1$, call <code>dq.push_back(v)</code>.</li>
        <li>Because a vertex $v$ might first be discovered via a weight-1 edge ($d[u] + 1$) and later relaxed via a weight-0 edge ($d[u'] + 0 = d[u]$), $v$ can be pushed into the deque at most <strong>twice</strong>. Popping a stale duplicate is skipped in $O(1)$ or guarded by a visited bitset upon pop.</li>
      </ul>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 185" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="28" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">0-1 BFS Deque State: At Most Two Distinct Distance Values (d and d+1)</text>
          <g transform="translate(170, 65)">
            <rect x="0" y="0" width="85" height="48" fill="#064e3b" stroke="#34d399" stroke-width="2" rx="4"/>
            <text x="42" y="22" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">v₁ (pop)</text>
            <text x="42" y="39" fill="#a7f3d0" font-family="monospace" font-size="11" text-anchor="middle">dist = d</text>

            <rect x="90" y="0" width="85" height="48" fill="#064e3b" stroke="#34d399" stroke-width="1.5" rx="4"/>
            <text x="132" y="22" fill="#34d399" font-family="monospace" font-size="12" text-anchor="middle">v₂</text>
            <text x="132" y="39" fill="#a7f3d0" font-family="monospace" font-size="11" text-anchor="middle">dist = d</text>

            <rect x="180" y="0" width="85" height="48" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" rx="4"/>
            <text x="222" y="22" fill="#f59e0b" font-family="monospace" font-size="12" text-anchor="middle">v₃</text>
            <text x="222" y="39" fill="#fde68a" font-family="monospace" font-size="11" text-anchor="middle">dist = d+1</text>

            <rect x="270" y="0" width="85" height="48" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" rx="4"/>
            <text x="312" y="22" fill="#f59e0b" font-family="monospace" font-size="12" text-anchor="middle">v₄</text>
            <text x="312" y="39" fill="#fde68a" font-family="monospace" font-size="11" text-anchor="middle">dist = d+1</text>
          </g>
          <path d="M 160 89 L 65 89" stroke="#34d399" stroke-width="2"/>
          <polygon points="165,89 155,84 155,94" fill="#34d399"/>
          <text x="85" y="75" fill="#34d399" font-family="monospace" font-size="11" text-anchor="middle">w = 0 edge</text>
          <text x="85" y="108" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">push_front(d)</text>

          <path d="M 535 89 L 630 89" stroke="#f59e0b" stroke-width="2"/>
          <polygon points="530,89 540,84 540,94" fill="#f59e0b"/>
          <text x="595" y="75" fill="#f59e0b" font-family="monospace" font-size="11" text-anchor="middle">w = 1 edge</text>
          <text x="595" y="108" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">push_back(d+1)</text>
          <text x="350" y="155" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">Invariant preserved: all dist=d items precede all dist=d+1 items</text>
        </svg>
      </div>

      <div class="mermaid">
      flowchart TD
        Pop["Pop u = dq.front()"] --> Check{"u already settled?"}
        Check -- "Yes" --> Pop
        Check -- "No" --> Mark["Mark settled[u] = true"]
        Mark --> Relax["For each edge (u, v, w) where d[u] + w < d[v]"]
        Relax --> Weight{"w == 0?"}
        Weight -- "Yes (w = 0)" --> Front["d[v] = d[u]; dq.push_front(v)"]
        Weight -- "No (w = 1)" --> Back["d[v] = d[u] + 1; dq.push_back(v)"]
      </div>

      <div class="simulator-mount" data-sim="sim-bfs-dfs-tarjan-scc"></div>

      <h3>3. Bidirectional BFS &amp; Frontier Balancing</h3>
      <p>When searching for a shortest path between a single pair $(s, t)$ in a graph with branching factor $b$ and shortest-path distance $D$, standard BFS explores $\\Theta(b^D)$ states. <strong>Bidirectional BFS</strong> maintains two frontiers $Q_f$ (expanding forward from $s$) and $Q_b$ (expanding backward along reversed edges from $t$). At each step, expand the frontier with <strong>fewer vertices</strong> ($|Q_f| \\le |Q_b|$) by one full level. When the frontiers intersect at some vertex $m$, the shortest path has length $d_f[m] + d_b[m]$, and only $\\Theta(2 \\cdot b^{D/2})$ vertices are visited—turning $10^8$ states into $2 \\times 10^4$.</p>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — <code>std::deque</code> Chunked Allocation vs. Ring Buffer</div>
        <p>In C++ libstdc++ and libc++, <code>std::deque</code> is implemented as a dynamic array of pointers to fixed-size 512-byte blocks. While asymptotic $O(1)$, it introduces double indirection on index operations. For performance-critical 0-1 BFS where $|V| \\le 10^6$, pre-allocating a flat array of size $2|V| + 5$ with initial <code>head = V, tail = V</code> provides a contiguous cache-resident deque with branchless pointer arithmetic.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Variant</th>
            <th>Edge Weights</th>
            <th>Time Complexity</th>
            <th>Space Complexity</th>
            <th>Data Structure</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Single / Multi-Source BFS</strong></td>
            <td>Unweighted ($w = 1$)</td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
            <td>FIFO Queue</td>
          </tr>
          <tr>
            <td><strong>0-1 BFS</strong></td>
            <td>Binary ($w \\in \\{0, 1\\}$)</td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
            <td>Double-Ended Queue (Deque)</td>
          </tr>
          <tr>
            <td><strong>Dial's Bucket BFS ($0..C$)</strong></td>
            <td>Integer ($w \\in [0, C]$)</td>
            <td><span class="badge-on">O(V·C + E)</span></td>
            <td><span class="badge-on">O(V + C)</span></td>
            <td>Circular Array of $C+1$ Lists</td>
          </tr>
          <tr>
            <td><strong>Bidirectional BFS</strong></td>
            <td>Unweighted ($w = 1$)</td>
            <td><span class="badge-on">O(b^(D/2))</span></td>
            <td><span class="badge-on">O(b^(D/2))</span></td>
            <td>Two FIFO Queues + Visited Maps</td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: 0-1 BFS &amp; Multi-Source BFS</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;deque&gt;
#include &lt;limits&gt;

struct Edge01 {
    int to;
    int weight; // Must be 0 or 1
};

std::vector&lt;int&gt; zeroOneBFS(int n, const std::vector&lt;std::vector&lt;Edge01&gt;&gt;&amp; adj,
                            const std::vector&lt;int&gt;&amp; sources) {
    constexpr int INF = std::numeric_limits&lt;int&gt;::max() / 2;
    std::vector&lt;int&gt; dist(n, INF);
    std::vector&lt;uint8_t&gt; settled(n, 0);
    std::deque&lt;int&gt; dq;

    for (int s : sources) {
        dist[s] = 0;
        dq.push_front(s);
    }

    while (!dq.empty()) {
        int u = dq.front();
        dq.pop_front();
        if (settled[u]) continue;
        settled[u] = 1;

        for (const auto&amp; e : adj[u]) {
            if (dist[u] + e.weight &lt; dist[e.to]) {
                dist[e.to] = dist[u] + e.weight;
                if (e.weight == 0) {
                    dq.push_front(e.to);
                } else {
                    dq.push_back(e.to);
                }
            }
        }
    }
    return dist;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Early Stopping Trap in Bidirectional BFS and 0-1 BFS</div>
        <p>In <strong>standard BFS</strong>, you can mark a vertex <code>visited</code> at the exact moment it is <em>pushed</em> into the queue. In <strong>0-1 BFS</strong>, marking a vertex final upon push is a bug: a vertex pushed to the back via a weight-1 edge at distance $d+1$ may subsequently be reached via a weight-0 edge at distance $d$. Always relax distances upon push and mark <code>settled</code> upon <strong>pop</strong>. Similarly, in Bidirectional BFS, the first vertex $v$ seen by both sides is not guaranteed to be the global minimum unless you expand a full level and take $\\min_v (d_f[v] + d_b[v])$ across the entire layer.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Standard BFS and 0-1 BFS rely on the Two-Valued Queue Invariant: all elements in the deque have distances within {d, d+1} in non-decreasing order.",
      "Multi-Source BFS computes the distance from every vertex to its nearest source in O(V + E) time by seeding the queue with all sources at distance 0.",
      "In 0-1 BFS, weight-0 edges push to the front of the deque and weight-1 edges push to the back; vertices must be marked settled upon pop, not push.",
      "Bidirectional BFS reduces state-space exploration from O(b^D) to O(b^(D/2)) by expanding the smaller frontier one complete level at a time."
    ],
    furtherReading: [
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 20.2: Breadth-First Search", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "CP-Algorithms — 0-1 BFS", url: "https://cp-algorithms.com/graph/01_bfs.html" },
      { title: "Dial, R. B. (1969) — Algorithm 360: Shortest-Path Forest with Topological Ordering", url: "https://doi.org/10.1145/363269.363610" }
    ]
  },

  "dfs-edge-classification-timestamps": {
    title: "Depth-First Search: Parenthesis Theorem, White-Path Theorem & Tree/Back/Forward/Cross Edges",
    video: {
      youtubeId: "7fujbpJ0LB4",
      title: "Depth First Search (DFS) & Edge Classification",
      channel: "MIT OpenCourseWare",
      duration: "51:10",
      length: "51:10",
      start: 0,
      why: "Covers DFS discovery/finish timestamps, the Parenthesis Theorem, and edge classification proofs."
    },
    intuition: "<p>Depth-First Search (DFS) imposes a strict temporal coordinate system on a graph. By recording the global clock tick $\\text{tin}[u]$ when vertex $u$ is first discovered (colored GRAY / active on stack) and $\\text{tout}[u]$ when its entire subtree finishes exploration (colored BLACK / popped), DFS maps graph reachability into nested 1D intervals.</p><p>Two theorems—the <strong>Parenthesis Theorem</strong> and the <strong>White-Path Theorem</strong>—form the bedrock of every linear-time connectivity algorithm, from cycle detection and topological sorting to Tarjan's strongly connected components and bridge-finding.</p>",
    content: `<div class="lesson-content">
      <h2>Temporal Coordinate System &amp; The Three-Color Invariant</h2>
      <p>During a DFS traversal of a directed or undirected graph $G = (V, E)$, every vertex $u \\in V$ transitions monotonically through three states:</p>
      <ul>
        <li><strong>WHITE ($0$):</strong> Undiscovered ($t &lt; \\text{tin}[u]$).</li>
        <li><strong>GRAY ($1$):</strong> Discovered and currently active on the recursion stack ($\\text{tin}[u] \\le t &lt; \\text{tout}[u]$). The set of all GRAY vertices at any instant forms the exact path from the current DFS root to the currently executing vertex.</li>
        <li><strong>BLACK ($2$):</strong> Fully explored and popped from the recursion stack ($t \\ge \\text{tout}[u]$).</li>
      </ul>

      <div class="invariant-box">
        <div class="box-title">Formal Theorems — Parenthesis Theorem &amp; White-Path Theorem</div>
        <p><strong>Parenthesis Theorem (CLRS Theorem 20.7):</strong> In any DFS of a (directed or undirected) graph $G$, for any two vertices $u$ and $v$, exactly one of three conditions holds for their intervals $I_u = [\\text{tin}[u], \\text{tout}[u]]$ and $I_v = [\\text{tin}[v], \\text{tout}[v]]$:</p>
        <ol>
          <li>$I_u$ and $I_v$ are completely disjoint, and neither $u$ nor $v$ is a descendant of the other in the DFS forest.</li>
          <li>$I_v \\subset I_u$ ($\\text{tin}[u] &lt; \\text{tin}[v] &lt; \\text{tout}[v] &lt; \\text{tout}[u]$), and $v$ is a proper descendant of $u$ in a DFS tree.</li>
          <li>$I_u \\subset I_v$, and $u$ is a proper descendant of $v$ in a DFS tree.</li>
        </ol>
        <p><strong>White-Path Theorem (CLRS Theorem 20.9):</strong> Vertex $v$ is a descendant of $u$ in the DFS forest if and only if at time $\\text{tin}[u]$ when $u$ is discovered, there exists a path in $G$ from $u$ to $v$ consisting entirely of WHITE vertices.</p>
      </div>

      <h3>Complete Classification of Directed &amp; Undirected Edges</h3>
      <p>When DFS at vertex $u$ inspects an outgoing edge $(u, v)$, the color and timestamps of $v$ classify $(u, v)$ into one of four mutually exclusive categories:</p>
      <ol>
        <li><strong>Tree Edge:</strong> $v$ is WHITE at inspection time. DFS recurses on $v$, making $u$ the tree parent of $v$.</li>
        <li><strong>Back Edge:</strong> $v$ is GRAY at inspection time ($\\text{tin}[v] \\le \\text{tin}[u]$ and $\\text{tout}[v]$ is not yet assigned). Thus $v$ is an active ancestor of $u$ on the call stack. <em>A directed graph has a cycle if and only if a DFS yields at least one back edge.</em></li>
        <li><strong>Forward Edge:</strong> $v$ is BLACK at inspection time and $\\text{tin}[u] &lt; \\text{tin}[v]$. Here $v$ is a proper descendant of $u$ that was already visited via another tree branch.</li>
        <li><strong>Cross Edge:</strong> $v$ is BLACK at inspection time and $\\text{tin}[v] &lt; \\text{tout}[v] &lt; \\text{tin}[u]$. The intervals $I_u$ and $I_v$ are disjoint.</li>
      </ol>
      <p><strong>Crucial Undirected Graph Theorem:</strong> In an undirected simple graph $G$, every edge is either a <strong>Tree Edge</strong> or a <strong>Back Edge</strong>. Forward and cross edges cannot exist because if $\{u, v\}$ is first explored from whichever endpoint is discovered earlier (say $u$), $v$ is still WHITE or GRAY; it can never be BLACK before $\{u, v\}$ is traversed.</p>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 220" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="26" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">DFS Edge Classification &amp; Nested [tin, tout] Intervals</text>
          <defs>
            <marker id="arr-tree" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399"/></marker>
            <marker id="arr-back" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171"/></marker>
            <marker id="arr-fwd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8"/></marker>
            <marker id="arr-cross" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b"/></marker>
          </defs>
          <!-- Nodes -->
          <circle cx="150" cy="65" r="22" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="150" y="69" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">A[1,8]</text>
          <circle cx="90" cy="155" r="22" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="90" y="159" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">B[2,5]</text>
          <circle cx="210" cy="155" r="22" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="210" y="159" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">C[6,7]</text>
          <circle cx="90" cy="200" r="16" fill="#1e293b" stroke="#34d399" stroke-width="1.5"/>
          <text x="90" y="204" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">D[3,4]</text>
          <!-- Tree edges -->
          <line x1="136" y1="83" x2="104" y2="135" stroke="#34d399" stroke-width="2" marker-end="url(#arr-tree)"/>
          <line x1="164" y1="83" x2="196" y2="135" stroke="#34d399" stroke-width="2" marker-end="url(#arr-tree)"/>
          <line x1="90" y1="177" x2="90" y2="183" stroke="#34d399" stroke-width="2" marker-end="url(#arr-tree)"/>
          <!-- Back edge D -> A -->
          <path d="M 74 200 Q 30 130 128 65" fill="none" stroke="#f87171" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arr-back)"/>
          <!-- Forward edge A -> D -->
          <path d="M 145 87 Q 140 160 106 196" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3,3" marker-end="url(#arr-fwd)"/>
          <!-- Cross edge C -> B -->
          <line x1="188" y1="155" x2="114" y2="155" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arr-cross)"/>

          <!-- Legend -->
          <g transform="translate(330, 55)">
            <rect x="0" y="0" width="340" height="135" fill="#0f172a" stroke="#334155" rx="6"/>
            <text x="15" y="25" fill="#34d399" font-family="monospace" font-size="12">● Tree Edge (v is WHITE): discovery edge</text>
            <text x="15" y="55" fill="#f87171" font-family="monospace" font-size="12">● Back Edge (v is GRAY): cycle witness!</text>
            <text x="15" y="85" fill="#38bdf8" font-family="monospace" font-size="12">● Forward Edge (v is BLACK, tin[u] &lt; tin[v])</text>
            <text x="15" y="115" fill="#f59e0b" font-family="monospace" font-size="12">● Cross Edge (v is BLACK, tout[v] &lt; tin[u])</text>
          </g>
        </svg>
      </div>

      <div class="mermaid">
      flowchart TD
        Inspect["DFS at u inspects edge (u, v)"] --> Color{"State of v?"}
        Color -- "WHITE (0)" --> Tree["Tree Edge: recurse DFS(v)"]
        Color -- "GRAY (1)" --> Back["Back Edge: v is active ancestor (Cycle!)"]
        Color -- "BLACK (2)" --> Time{"tin[u] < tin[v]?"}
        Time -- "Yes" --> Fwd["Forward Edge: v is proper descendant"]
        Time -- "No" --> Cross["Cross Edge: disjoint subtree finished earlier"]
      </div>

      <div class="simulator-mount" data-sim="sim-bfs-dfs-tarjan-scc"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Recursion Stack Overflow &amp; Explicit Stack Frame Conversion</div>
        <p>Default OS thread stacks are 1 MB on Windows and 8 MB on Linux/macOS. A recursive C++ DFS frame consumes 32–64 bytes (saved registers, return address, local variables). On a degenerate path graph of $V = 2 \\times 10^5$ vertices, recursive DFS exceeds 8 MB and triggers a fatal <code>SIGSEGV</code> stack overflow. Production graph engines replace call-stack recursion with an explicit heap-allocated <code>std::vector&lt;Frame&gt;</code> storing <code>(u, nextEdgeIndex)</code>.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Operation</th>
            <th>Time Complexity</th>
            <th>Space Complexity</th>
            <th>Invariant Used</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Full DFS + Timestamps</strong></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
            <td>Each vertex colored WHITE→GRAY→BLACK once</td>
          </tr>
          <tr>
            <td><strong>Ancestor Query <code>isAncestor(u, v)</code></strong></td>
            <td><span class="badge-o1">O(1)</span></td>
            <td><span class="badge-on">O(V)</span></td>
            <td>Parenthesis Theorem: $\\text{tin}[u] \\le \\text{tin}[v]$ and $\\text{tout}[v] \\le \\text{tout}[u]$</td>
          </tr>
          <tr>
            <td><strong>Directed Cycle Detection</strong></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
            <td>Existence of edge $(u, v)$ to a GRAY vertex $v$</td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Iterative DFS with Timestamps &amp; Cycle Reconstruction</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;

struct DFSTimestamps {
    std::vector&lt;int&gt; tin, tout, parent;
    std::vector&lt;uint8_t&gt; color; // 0=WHITE, 1=GRAY, 2=BLACK
    std::vector&lt;int&gt; cycle;
    int timer = 0;

    DFSTimestamps(int n, const std::vector&lt;std::vector&lt;int&gt;&gt;&amp; adj)
        : tin(n, 0), tout(n, 0), parent(n, -1), color(n, 0) {
        struct Frame { int u; size_t edgeIdx; };
        std::vector&lt;Frame&gt; st;
        st.reserve(n);

        for (int root = 0; root &lt; n; ++root) {
            if (color[root] != 0) continue;
            color[root] = 1;
            tin[root] = ++timer;
            st.push_back({root, 0});

            while (!st.empty()) {
                auto&amp; [u, idx] = st.back();
                if (idx &lt; adj[u].size()) {
                    int v = adj[u][idx++];
                    if (color[v] == 0) {
                        parent[v] = u;
                        color[v] = 1;
                        tin[v] = ++timer;
                        st.push_back({v, 0});
                    } else if (color[v] == 1 &amp;&amp; cycle.empty()) {
                        // Back edge u -> v detected; reconstruct directed cycle
                        for (int cur = u; cur != v; cur = parent[cur]) {
                            cycle.push_back(cur);
                        }
                        cycle.push_back(v);
                        std::reverse(cycle.begin(), cycle.end());
                    }
                } else {
                    color[u] = 2;
                    tout[u] = ++timer;
                    st.pop_back();
                }
            }
        }
    }

    bool isAncestor(int u, int v) const noexcept {
        return tin[u] &lt;= tin[v] &amp;&amp; tout[v] &lt;= tout[u];
    }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Naive Stack-Push Iterative DFS Corrupts Edge Classification</div>
        <p>A common anti-pattern is writing iterative DFS by replacing <code>std::queue</code> in BFS with <code>std::stack</code> and pushing all neighbors of $u$ onto the stack at once. That pseudo-DFS marks or duplicates vertices before visiting them and fails to advance along a single path before pushing siblings, invalidating the Parenthesis Theorem and GRAY ancestor stack. Always store the per-vertex neighbor iterator <code>(u, edgeIdx)</code> on the stack.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "The Parenthesis Theorem guarantees that for any two vertices u and v, their [tin, tout] intervals are either completely disjoint or one is strictly nested inside the other.",
      "Testing whether u is an ancestor of v in the DFS forest takes O(1) time after an O(V + E) preprocessing pass: tin[u] <= tin[v] and tout[v] <= tout[u].",
      "A directed graph is cyclic if and only if DFS encounters a Back Edge (an edge from the current vertex u to a GRAY ancestor v on the active recursion stack).",
      "In an undirected simple graph, every edge is classified as either a Tree Edge or a Back Edge; Forward and Cross edges never occur."
    ],
    furtherReading: [
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 20.3: Depth-First Search", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "Tarjan, R. E. (1972) — Depth-First Search and Linear Graph Algorithms", url: "https://doi.org/10.1137/0201010" },
      { title: "Jeff Erickson — Algorithms, Chapter 6: Depth-First Search", url: "https://jeffe.cs.illinois.edu/teaching/algorithms/" }
    ]
  },

  "topological-sort-kahn-dfs": {
    title: "Directed Acyclic Graphs (DAGs): Kahn's Indegree Queue vs DFS Post-Order Reversal",
    video: {
      youtubeId: "eL-KzMXSXXI",
      title: "Topological Sort Algorithm | Graph Theory",
      channel: "William Fiset",
      duration: "13:55",
      length: "13:55",
      start: 0,
      why: "Explains topological linear extensions on DAGs and walks through post-order DFS and Kahn's algorithm."
    },
    intuition: "<p>Every Directed Acyclic Graph (DAG) defines a strict partial order over its vertices. A <strong>topological sort</strong> embeds that partial order into a total linear order $\\pi$ such that every directed edge $(u, v) \\in E$ points strictly forward ($\\pi(u) &lt; \\pi(v)$). Without a topological order, dynamic programming on DAGs, spreadsheet cell recalculation, and build-system compilation cannot execute without circular dependencies.</p><p>Two dual $O(V + E)$ paradigms compute this ordering: <strong>Kahn's Algorithm</strong> peels zero-indegree sources from the front using a queue, whereas <strong>DFS Post-Order Reversal</strong> places vertices from the back according to decreasing finish times $\\text{tout}[u]$.</p>",
    content: `<div class="lesson-content">
      <h2>Mathematical Duality: Source Peeling vs. Finish-Time Ordering</h2>
      <p>A directed graph $G = (V, E)$ admits a topological ordering if and only if $G$ is a DAG (contains no directed cycles). Both standard algorithms exploit complementary structural invariants of DAGs.</p>

      <div class="invariant-box">
        <div class="box-title">Formal Invariant — Finish-Time Monotonicity on DAGs</div>
        <p><strong>Theorem (CLRS Theorem 20.11):</strong> A directed graph $G$ is acyclic if and only if a DFS of $G$ yields no back edges. Furthermore, for every directed edge $(u, v) \\in E$ in a DAG:</p>
        $$\\text{tout}[u] &gt; \\text{tout}[v]$$
        <p><em>Proof:</em> When edge $(u, v)$ is explored from $u$, $v$ cannot be GRAY (otherwise $(u, v)$ would be a back edge, contradicting acyclicity). If $v$ is WHITE, DFS recurses on $v$ and finishes $v$ before finishing $u$, so $\\text{tout}[v] &lt; \\text{tout}[u]$. If $v$ is already BLACK, $v$ finished before $u$ even finished, so $\\text{tout}[v] &lt; \\text{tout}[u]$. Ordering vertices in decreasing order of $\\text{tout}$ therefore places $u$ before $v$ for every edge $(u, v)$.</p>
      </div>

      <h3>1. Kahn's Algorithm (1962): Indegree Peeling &amp; Cycle Detection</h3>
      <p>Every non-empty finite DAG has at least one vertex with $\\text{indegree}(u) = 0$ (otherwise walking backward along incoming edges would repeat a vertex in $\\le |V|$ steps, forming a cycle). Kahn's algorithm maintains an array $\\text{in}[0 \\dots V-1]$ and a ready queue $Q$ of all vertices with $\\text{in}[u] == 0$:</p>
      <ol>
        <li>Pop $u$ from $Q$ and append $u$ to the topological order.</li>
        <li>For each outgoing edge $(u, v)$, decrement $\\text{in}[v]$. If $\\text{in}[v]$ reaches $0$, push $v$ into $Q$.</li>
        <li><strong>Built-in Cycle Verification:</strong> If the loop terminates and the output list has fewer than $|V|$ vertices, the remaining vertices with $\\text{in}[w] &gt; 0$ contain at least one directed cycle (and everything reachable only from those cycles).</li>
      </ol>

      <h3>2. Lexicographically Smallest Topological Sort &amp; Parallel Layering</h3>
      <p>Kahn's algorithm offers two capabilities that DFS post-order reversal cannot match directly:</p>
      <ul>
        <li><strong>Lexicographically Smallest Topological Order:</strong> Replace the FIFO queue $Q$ in Kahn's algorithm with a min-heap (<code>std::priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code>). At every step, among all currently unconstrained tasks ($\text{in}[u] = 0$), picking the minimum index $u$ greedily produces the lexicographically smallest valid topological sequence in $O((V + E) \\log V)$. (Note: sorting adjacency lists in DFS does <em>not</em> produce the lexicographically smallest topological sort!).</li>
        <li><strong>Parallel Execution Waves (Level-by-Level Kahn):</strong> Processing all current zero-indegree vertices in batch waves yields the minimum number of parallel stages needed to execute a task graph with infinite processors—equal to the longest path in the DAG.</li>
      </ul>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 180" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Kahn's Indegree Peeling vs. Parallel Execution Waves</text>
          <defs>
            <marker id="arr-dag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b"/></marker>
          </defs>
          <!-- Wave 0 -->
          <rect x="40" y="42" width="130" height="122" fill="#0f172a" stroke="#38bdf8" stroke-dasharray="3,3" rx="6"/>
          <text x="105" y="58" fill="#38bdf8" font-family="monospace" font-size="11" text-anchor="middle">Wave 0 (in=0)</text>
          <circle cx="105" cy="85" r="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="105" y="89" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">0</text>
          <circle cx="105" cy="135" r="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="105" y="139" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">1</text>

          <!-- Wave 1 -->
          <rect x="260" y="42" width="130" height="122" fill="#0f172a" stroke="#34d399" stroke-dasharray="3,3" rx="6"/>
          <text x="325" y="58" fill="#34d399" font-family="monospace" font-size="11" text-anchor="middle">Wave 1</text>
          <circle cx="325" cy="85" r="16" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="325" y="89" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">2</text>
          <circle cx="325" cy="135" r="16" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="325" y="139" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">3</text>

          <!-- Wave 2 -->
          <rect x="480" y="42" width="160" height="122" fill="#0f172a" stroke="#f59e0b" stroke-dasharray="3,3" rx="6"/>
          <text x="560" y="58" fill="#f59e0b" font-family="monospace" font-size="11" text-anchor="middle">Wave 2 (Sink)</text>
          <circle cx="560" cy="110" r="16" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
          <text x="560" y="114" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">4</text>

          <!-- Edges -->
          <line x1="121" y1="85" x2="306" y2="85" stroke="#64748b" stroke-width="1.8" marker-end="url(#arr-dag)"/>
          <line x1="121" y1="90" x2="306" y2="130" stroke="#64748b" stroke-width="1.8" marker-end="url(#arr-dag)"/>
          <line x1="121" y1="135" x2="306" y2="135" stroke="#64748b" stroke-width="1.8" marker-end="url(#arr-dag)"/>
          <line x1="341" y1="88" x2="542" y2="106" stroke="#64748b" stroke-width="1.8" marker-end="url(#arr-dag)"/>
          <line x1="341" y1="132" x2="542" y2="114" stroke="#64748b" stroke-width="1.8" marker-end="url(#arr-dag)"/>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Init["Compute indegree[0..V-1]"] --> Seed["Push all u with indegree[u] == 0 to Queue"]
        Seed --> Loop{"Queue empty?"}
        Loop -- "No" --> Pop["Pop u, append to order, decrement indegree[v] for (u,v)"]
        Pop --> PushZero["If indegree[v] == 0, push v to Queue"]
        PushZero --> Loop
        Loop -- "Yes" --> Check{"order.size() == V?"}
        Check -- "Yes" --> Valid["Valid Topological Order"]
        Check -- "No" --> Cycle["Cycle Detected!"]
      </div>

      <div class="simulator-mount" data-sim="sim-toposort-kahn-2sat"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Iterative In-Place Queue vs. Recursion Overhead</div>
        <p>In Kahn's algorithm, the output vector <code>order</code> itself can act as the FIFO queue: push initial zero-indegree nodes into <code>order</code>, maintain a read index <code>readIdx = 0</code>, and loop while <code>readIdx &lt; order.size()</code>, appending newly unlocked zero-indegree neighbors directly to the back of <code>order</code>. This eliminates a separate <code>std::queue</code> allocation and performs strictly sequential writes and reads in a single contiguous vector.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Time Complexity</th>
            <th>Auxiliary Space</th>
            <th>Cycle Detection</th>
            <th>Lexicographical Order</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Kahn's Algorithm (FIFO Queue)</strong></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
            <td><code>order.size() &lt; V</code></td>
            <td>No (wave order)</td>
          </tr>
          <tr>
            <td><strong>Kahn's Algorithm (Min-Heap)</strong></td>
            <td><span class="badge-onlogn">O((V + E) log V)</span></td>
            <td><span class="badge-on">O(V)</span></td>
            <td><code>order.size() &lt; V</code></td>
            <td><strong>Yes</strong> (exact global min)</td>
          </tr>
          <tr>
            <td><strong>DFS Post-Order Reversal</strong></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
            <td>Requires 3-color GRAY check</td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Zero-Allocation In-Place Kahn's Algorithm</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;

// Returns topological order of size V, or an empty vector if G contains a directed cycle.
std::vector&lt;int&gt; topologicalSortKahn(int n, const std::vector&lt;std::vector&lt;int&gt;&gt;&amp; adj) {
    std::vector&lt;int&gt; indegree(n, 0);
    for (int u = 0; u &lt; n; ++u) {
        for (int v : adj[u]) {
            ++indegree[v];
        }
    }

    // Use the output vector itself as the FIFO queue (zero secondary queue allocation)
    std::vector&lt;int&gt; order;
    order.reserve(n);
    for (int u = 0; u &lt; n; ++u) {
        if (indegree[u] == 0) {
            order.push_back(u);
        }
    }

    for (size_t readIdx = 0; readIdx &lt; order.size(); ++readIdx) {
        int u = order[readIdx];
        for (int v : adj[u]) {
            if (--indegree[v] == 0) {
                order.push_back(v);
            }
        }
    }

    if (static_cast&lt;int&gt;(order.size()) != n) {
        return {}; // Directed cycle exists
    }
    return order;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Running DFS Post-Order Without 3-Color Cycle Verification</div>
        <p>A frequent bug is running a simple 2-state (<code>visited[u]</code> boolean) DFS that appends $u$ on post-order and reverses the result, assuming the input graph is a DAG. On a graph with a cycle, a 2-state DFS still returns a permutation of length $|V|$ without throwing an error! If using DFS for topological sort on untrusted graphs, you <strong>must</strong> maintain 3 colors (WHITE/GRAY/BLACK) and abort if any edge targets a GRAY vertex.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "A directed graph has a valid topological ordering if and only if it is a Directed Acyclic Graph (DAG).",
      "In any DFS of a DAG, every directed edge (u, v) satisfies tout[u] > tout[v], so reversing the DFS post-order yields a valid topological sort.",
      "Kahn's algorithm iteratively extracts zero-indegree vertices in O(V + E) time and detects cycles automatically whenever fewer than V vertices are emitted.",
      "Replacing Kahn's FIFO queue with a min-heap produces the lexicographically smallest topological ordering in O((V + E) log V) time."
    ],
    furtherReading: [
      { title: "Kahn, A. B. (1962) — Topological sorting of large networks", url: "https://doi.org/10.1145/368996.369025" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 20.4: Topological Sort", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "Knuth, D. E. — The Art of Computer Programming, Vol. 1, Section 2.2.3: Topological Sorting", url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html" }
    ]
  },

  "bipartite-graphs-2-coloring": {
    title: "Bipartite Graphs: Odd-Cycle Characterization & 2-Coloring Verification",
    video: {
      youtubeId: "0ACfAqs8mm0",
      title: "Bipartite Graph Verification & Two-Coloring",
      channel: "Abdul Bari",
      duration: "14:20",
      length: "14:20",
      start: 0,
      why: "Walks through BFS level parity and the proof that odd cycles are the exact obstruction to bipartiteness."
    },
    intuition: "<p>A graph $G = (V, E)$ is <strong>bipartite</strong> if its vertices can be partitioned into two disjoint independent sets $V = L \\cup R$ such that every edge connects a vertex in $L$ to a vertex in $R$. Equivalently, $G$ is 2-colorable. Recognizing bipartiteness is a superpower in algorithm design: NP-hard problems like Maximum Independent Set and Minimum Vertex Cover collapse into polynomial-time network flow problems (via König's Theorem) the instant the underlying graph is proved bipartite.</p><p>By König's 1916 characterization, the <em>only</em> obstruction to bipartiteness is an <strong>odd-length cycle</strong>. A single $O(V + E)$ BFS or DFS both verifies bipartiteness and extracts an explicit odd-cycle certificate if the check fails.</p>",
    content: `<div class="lesson-content">
      <h2>König's Odd-Cycle Theorem &amp; BFS Level Parity</h2>
      <p>Why is the absence of odd cycles both necessary and sufficient for a graph to be 2-colorable? Consider running BFS from an arbitrary root $r$ in a connected component and assigning each vertex $u$ to partition $L$ if its shortest-path distance $d(r, u)$ is even, or $R$ if $d(r, u)$ is odd.</p>

      <div class="invariant-box">
        <div class="box-title">Formal Theorem — Odd-Cycle Characterization of Bipartite Graphs</div>
        <p><strong>Theorem (König, 1916):</strong> An undirected graph $G = (V, E)$ is bipartite if and only if it contains no cycle of odd length.</p>
        <p><em>Proof Sketch:</em> ($\Rightarrow$) Along any cycle $v_0, v_1, \\dots, v_{k-1}, v_0$ in a 2-colored graph, colors must alternate $c(v_i) = i \\bmod 2$. Since $v_k = v_0$, $k$ must be even.<br/>
        ($\Leftarrow$) Suppose $G$ has no odd cycles. In each connected component, pick root $r$ and set $\\text{color}(u) = d(r, u) \\bmod 2$. If any edge $\{u, v\} \\in E$ had $\\text{color}(u) == \\text{color}(v)$, let $w = \\text{LCA}(u, v)$ in the BFS tree. Since $d(r, u) \\equiv d(r, v) \\pmod 2$, the paths $w \\leadsto u$ and $w \\leadsto v$ have the same parity, so the cycle $w \\leadsto u - v \\leadsto w$ has length $(d(r, u) - d(r, w)) + (d(r, v) - d(r, w)) + 1$, which is <strong>odd</strong>—a contradiction.</p>
      </div>

      <h3>Constructing an Explicit Odd-Cycle Certificate</h3>
      <p>In production verification systems (such as register interference graphs or VLSI layer assignment), returning a boolean <code>false</code> is insufficient; engineers need the exact odd cycle causing the conflict. When BFS/DFS discovers an edge $\{u, v\}$ with $\\text{color}[u] == \\text{color}[v]$:</p>
      <ol>
        <li>Trace parent pointers $\\text{parent}[u]$ and $\\text{parent}[v]$ upward until they meet at their lowest common ancestor $w$ in the spanning tree.</li>
        <li>Concatenate the path $w \\leadsto u$, the conflict edge $(u, v)$, and the reversed path $v \\leadsto w$ to output a simple odd cycle in $O(V)$ time.</li>
      </ol>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 190" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="175" y="26" fill="#34d399" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Bipartite (Even Cycle C₄): Valid 2-Coloring</text>
          <text x="525" y="26" fill="#f87171" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Non-Bipartite (Odd Cycle C₅): Same-Color Edge</text>
          <!-- Left: C4 -->
          <line x1="115" y1="65" x2="235" y2="65" stroke="#64748b" stroke-width="2"/>
          <line x1="115" y1="145" x2="235" y2="145" stroke="#64748b" stroke-width="2"/>
          <line x1="115" y1="65" x2="115" y2="145" stroke="#64748b" stroke-width="2"/>
          <line x1="235" y1="65" x2="235" y2="145" stroke="#64748b" stroke-width="2"/>
          <circle cx="115" cy="65" r="18" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
          <text x="115" y="69" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">L(0)</text>
          <circle cx="235" cy="65" r="18" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
          <text x="235" y="69" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">R(1)</text>
          <circle cx="115" cy="145" r="18" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
          <text x="115" y="149" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">R(1)</text>
          <circle cx="235" cy="145" r="18" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
          <text x="235" y="149" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">L(0)</text>

          <!-- Divider -->
          <line x1="350" y1="15" x2="350" y2="175" stroke="#334155" stroke-width="1.5" stroke-dasharray="4,4"/>

          <!-- Right: C5 with conflict -->
          <line x1="525" y1="50" x2="445" y2="95" stroke="#64748b" stroke-width="2"/>
          <line x1="525" y1="50" x2="605" y2="95" stroke="#64748b" stroke-width="2"/>
          <line x1="445" y1="95" x2="475" y2="155" stroke="#64748b" stroke-width="2"/>
          <line x1="605" y1="95" x2="575" y2="155" stroke="#64748b" stroke-width="2"/>
          <line x1="475" y1="155" x2="575" y2="155" stroke="#f87171" stroke-width="3" stroke-dasharray="5,3"/>
          <text x="525" y="176" fill="#f87171" font-family="monospace" font-size="11" text-anchor="middle">Conflict: d=2 — d=2</text>

          <circle cx="525" cy="50" r="16" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
          <text x="525" y="54" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">d=0</text>
          <circle cx="445" cy="95" r="16" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
          <text x="445" y="99" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">d=1</text>
          <circle cx="605" cy="95" r="16" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
          <text x="605" y="99" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">d=1</text>
          <circle cx="475" cy="155" r="16" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
          <text x="475" y="159" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">d=2</text>
          <circle cx="575" cy="155" r="16" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
          <text x="575" y="159" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">d=2</text>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Start["For each uncolored vertex r in 0..V-1"] --> Seed["color[r] = 0; push r to Queue"]
        Seed --> Pop["Pop u; inspect each neighbor v"]
        Pop --> Check{"color[v] == -1?"}
        Check -- "Yes" --> Assign["color[v] = color[u] ^ 1; push v"]
        Check -- "No" --> Conflict{"color[v] == color[u]?"}
        Conflict -- "Yes" --> Odd["Not Bipartite: Odd Cycle Found"]
        Conflict -- "No" --> Next["Valid Cross-Partition Edge"]
      </div>

      <div class="simulator-mount" data-sim="sim-bfs-dfs-tarjan-scc"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — 2-Bit State Packing &amp; Branchless XOR Coloring</div>
        <p>Storing vertex colors in a <code>std::vector&lt;int8_t&gt;</code> initialized to <code>-1</code> fits $64$ vertex states into a single 64-byte L1 cache line. Assigning the opposite color uses a single branchless bitwise XOR instruction: <code>color[v] = color[u] ^ 1</code> (flipping $0 \\leftrightarrow 1$).</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Task</th>
            <th>General Graph Complexity</th>
            <th>Bipartite Graph Complexity</th>
            <th>Algorithm Used</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>k-Coloring ($k = 2$ vs $k \\ge 3$)</strong></td>
            <td><span class="badge-o2n">NP-Complete (k ≥ 3)</span></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td>BFS / DFS 2-Coloring</td>
          </tr>
          <tr>
            <td><strong>Odd Cycle Extraction</strong></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td>BFS Tree + LCA Trace</td>
          </tr>
          <tr>
            <td><strong>Maximum Independent Set</strong></td>
            <td><span class="badge-o2n">NP-Hard</span></td>
            <td><span class="badge-onlogn">O(E √V)</span></td>
            <td>König's Theorem ($|V| - \\text{MaxMatching}$)</td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Multi-Component Bipartite Verifier</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;cstdint&gt;

struct BipartiteResult {
    bool isBipartite = true;
    std::vector&lt;int8_t&gt; color; // 0 or 1 if bipartite
};

BipartiteResult checkBipartite(int n, const std::vector&lt;std::vector&lt;int&gt;&gt;&amp; adj) {
    BipartiteResult res{true, std::vector&lt;int8_t&gt;(n, -1)};
    std::queue&lt;int&gt; q;

    for (int start = 0; start &lt; n; ++start) {
        if (res.color[start] != -1) continue;
        res.color[start] = 0;
        q.push(start);

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : adj[u]) {
                if (res.color[v] == -1) {
                    res.color[v] = res.color[u] ^ 1;
                    q.push(v);
                } else if (res.color[v] == res.color[u]) {
                    res.isBipartite = false;
                    return res;
                }
            }
        }
    }
    return res;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Disconnected Components &amp; Self-Loops</div>
        <p>Two classic bugs break bipartite checkers in production: (1) Starting BFS only from vertex $0$ instead of looping over all unvisited vertices $0 \\dots V-1$, which misses odd cycles in disconnected components; and (2) forgetting that a self-loop $(u, u)$ is a cycle of length $1$ (odd), which immediately invalidates bipartiteness.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "König's 1916 Theorem proves that a graph is bipartite (2-colorable) if and only if it contains no cycle of odd length.",
      "In a BFS spanning tree, every edge connecting two vertices at the same distance level d(r, u) == d(r, v) induces an odd cycle through their lowest common ancestor.",
      "Always wrap BFS/DFS 2-coloring in an outer loop over all vertices 0..V-1 so disconnected components are verified.",
      "Many NP-hard optimization problems (Maximum Independent Set, Minimum Vertex Cover) become polynomial-time solvable via Hopcroft-Karp once the graph is verified bipartite."
    ],
    furtherReading: [
      { title: "CP-Algorithms — Check whether a graph is bipartite", url: "https://cp-algorithms.com/graph/bipartite-check.html" },
      { title: "Sedgewick & Wayne — Algorithms (4th Ed.), Section 4.1: Bipartite Graphs", url: "https://algs4.cs.princeton.edu/41graph/" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 20 Exercises", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
    ]
  }
};

Object.assign(window.MODULE_CONTENT["m12"], {
  "bridges-articulation-biconnected": {
    title: "Undirected Connectivity: Tarjan's tin/low Algorithm for Bridges, Cut Vertices & BCCs",
    video: {
      youtubeId: "aZXi1unBdJA",
      title: "Bridges and Articulation Points Algorithm | Graph Theory",
      channel: "William Fiset",
      duration: "17:44",
      length: "17:44",
      start: 0,
      why: "Visualizes DFS discovery timestamps (tin) and low-link values (low) to isolate single points of failure in undirected networks."
    },
    intuition: "<p>In an undirected network of routers or power lines, a <strong>bridge</strong> (cut-edge) is an edge whose removal increases the number of connected components, and an <strong>articulation point</strong> (cut-vertex) is a vertex whose removal disconnects the network. Naive verification deletes each edge or vertex one by one in $O(E(V + E))$ time—far too slow for million-edge graphs.</p><p>Robert Tarjan's 1972 insight reduces this to a single $O(V + E)$ DFS pass. Since every non-tree edge in an undirected DFS is a <strong>back edge</strong> climbing to an ancestor, a subtree rooted at $v$ is protected from disconnection if and only if some back edge originating inside $v$'s subtree climbs above $v$'s parent $u$. Tracking the highest reachable ancestor timestamp via $\\text{low}[v]$ decides every cut condition in $O(1)$ per edge.</p>",
    content: `<div class="lesson-content">
      <h2>The Low-Link Function &amp; Cut Conditions</h2>
      <p>During a DFS of an undirected graph $G = (V, E)$, let $\\text{tin}[u]$ be the discovery timestamp of vertex $u$. We define the <strong>low-link value</strong> $\\text{low}[u]$ as the minimum discovery time $\\text{tin}[w]$ of any vertex $w$ reachable from $u$ using zero or more DFS tree edges downward followed by <strong>at most one back edge</strong> upward:</p>
      $$\\text{low}[u] = \\min \\begin{cases} \\text{tin}[u] \\\\ \\text{tin}[p] & \\text{for all back edges } (u, p) \\text{ (excluding the parent tree edge)} \\\\ \\text{low}[v] & \\text{for all DFS tree children } v \\text{ of } u \\end{cases}$$

      <div class="invariant-box">
        <div class="box-title">Formal Cut Theorems — Bridges vs. Articulation Points</div>
        <p>Let $(u, v)$ be a DFS tree edge where $u$ is the parent of $v$ ($\\text{tin}[u] &lt; \\text{tin}[v]$):</p>
        <ol>
          <li><strong>Bridge Condition (Strict Inequality):</strong> Tree edge $(u, v)$ is a bridge if and only if:
            $$\\text{low}[v] &gt; \\text{tin}[u]$$
            If $\\text{low}[v] == \\text{tin}[u]$, a back edge from $v$'s subtree reaches $u$ itself, forming a cycle that protects edge $(u, v)$ from being a bridge.</li>
          <li><strong>Articulation Point Condition (Weak Inequality + Root Rule):</strong> A non-root vertex $u$ is an articulation point if and only if it has at least one DFS tree child $v$ satisfying:
            $$\\text{low}[v] \\ge \\text{tin}[u]$$
            Even if a back edge from $v$'s subtree reaches $u$ ($\\text{low}[v] == \\text{tin}[u]$), deleting vertex $u$ destroys both the tree edge $(u, v)$ and that back edge endpoint, isolating $v$'s subtree! Meanwhile, a <strong>DFS root $r$</strong> is an articulation point if and only if $r$ has $\\ge 2$ children in the DFS tree.</li>
        </ol>
      </div>

      <h3>Biconnected Components (BCCs) &amp; Block-Cut Trees</h3>
      <p>A maximal subgraph with no articulation points is called a <strong>Biconnected Component (2-vertex-connected component)</strong>, and a maximal subgraph with no bridges is a <strong>2-Edge-Connected Component</strong>. By pushing traversed edges onto an auxiliary stack during DFS and popping all edges down to $(u, v)$ whenever $\\text{low}[v] \\ge \\text{tin}[u]$, Tarjan's algorithm partitions the edge set $E$ into biconnected components in $O(V + E)$ time. Contracting each 2-edge-connected component into a supernode yields the <strong>Bridge-Block Tree</strong>, turning cyclic graphs into trees where path queries can be answered via Lowest Common Ancestor (LCA).</p>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 200" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Bridge (low[v] &gt; tin[u]) vs. Articulation Point (low[v] &ge; tin[u])</text>
          <!-- Cycle 0-1-2 -->
          <line x1="90" y1="110" x2="180" y2="60" stroke="#34d399" stroke-width="2.5"/>
          <line x1="180" y1="60" x2="180" y2="160" stroke="#34d399" stroke-width="2.5"/>
          <path d="M 180 160 Q 115 150 90 110" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,3"/>
          <!-- Bridge 2-3 -->
          <line x1="180" y1="160" x2="340" y2="110" stroke="#f87171" stroke-width="3.5"/>
          <text x="265" y="155" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">BRIDGE (low[3]=4 &gt; tin[2]=3)</text>
          <!-- Cycle 3-4-5 -->
          <line x1="340" y1="110" x2="450" y2="60" stroke="#34d399" stroke-width="2.5"/>
          <line x1="450" y1="60" x2="450" y2="160" stroke="#34d399" stroke-width="2.5"/>
          <path d="M 450 160 Q 385 150 340 110" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,3"/>

          <!-- Nodes -->
          <circle cx="90" cy="110" r="22" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
          <text x="90" y="114" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">0(1/1)</text>
          <circle cx="180" cy="60" r="22" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
          <text x="180" y="64" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">1(2/1)</text>
          <circle cx="180" cy="160" r="22" fill="#78350f" stroke="#f59e0b" stroke-width="2.5"/>
          <text x="180" y="164" fill="#fef3c7" font-family="monospace" font-size="11" text-anchor="middle">2(3/1)</text>
          <circle cx="340" cy="110" r="22" fill="#78350f" stroke="#f59e0b" stroke-width="2.5"/>
          <text x="340" y="114" fill="#fef3c7" font-family="monospace" font-size="11" text-anchor="middle">3(4/4)</text>
          <circle cx="450" cy="60" r="22" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
          <text x="450" y="64" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">4(5/4)</text>
          <circle cx="450" cy="160" r="22" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
          <text x="450" y="164" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">5(6/4)</text>

          <g transform="translate(510, 65)">
            <rect x="0" y="0" width="170" height="90" fill="#0f172a" stroke="#334155" rx="6"/>
            <text x="12" y="24" fill="#cbd5e1" font-family="monospace" font-size="11">Label: u(tin/low)</text>
            <text x="12" y="48" fill="#f59e0b" font-family="monospace" font-size="11">Cut Vertices: 2, 3</text>
            <text x="12" y="72" fill="#f87171" font-family="monospace" font-size="11">Bridge Edge: (2, 3)</text>
          </g>
        </svg>
      </div>

      <div class="mermaid">
      flowchart TD
        Visit["DFS at u: tin[u] = low[u] = ++timer"] --> Edge["Inspect incident edge e = (u, v)"]
        Edge --> IsParent{"Is e the parent edge?"}
        IsParent -- "Yes" --> Skip["Ignore parent edge (handle multigraphs by edge ID!)"]
        IsParent -- "No" --> Visited{"Is v already visited?"}
        Visited -- "Yes (Back Edge)" --> Back["low[u] = min(low[u], tin[v])"]
        Visited -- "No (Tree Edge)" --> Recurse["DFS(v); low[u] = min(low[u], low[v])"]
        Recurse --> CutCheck["Bridge if low[v] > tin[u]; Cut-Vertex if low[v] >= tin[u]"]
      </div>

      <div class="simulator-mount" data-sim="sim-bfs-dfs-tarjan-scc"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Single-Pass Post-Order Aggregation</div>
        <p>Because $\\text{low}[u]$ depends only on $\\text{tin}[v]$ of back-edge neighbors and $\\text{low}[v]$ of tree children, both arrays $\\text{tin}[0..V-1]$ and $\\text{low}[0..V-1]$ occupy just $8V$ bytes ($8\\text{ MB}$ for $V = 10^6$) and update in-place during DFS return without auxiliary heap structures.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Problem</th>
            <th>Naive Deletion</th>
            <th>Tarjan's DFS</th>
            <th>Auxiliary Space</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>All Bridges (Cut-Edges)</strong></td>
            <td><span class="badge-on2">O(E · (V + E))</span></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
          </tr>
          <tr>
            <td><strong>All Articulation Points</strong></td>
            <td><span class="badge-on2">O(V · (V + E))</span></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
          </tr>
          <tr>
            <td><strong>Biconnected Components (BCC)</strong></td>
            <td><span class="badge-on2">O(V · (V + E))</span></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V + E)</span></td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Multigraph-Safe Tarjan Bridges &amp; Cut Vertices</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;utility&gt;

struct UndirectedConnectivity {
    struct Edge { int to; int id; };
    int n, timer = 0;
    std::vector&lt;std::vector&lt;Edge&gt;&gt; adj;
    std::vector&lt;int&gt; tin, low;
    std::vector&lt;uint8_t&gt; isCutVertex;
    std::vector&lt;std::pair&lt;int, int&gt;&gt; bridges;

    explicit UndirectedConnectivity(int vertices)
        : n(vertices), adj(vertices), tin(vertices, 0), low(vertices, 0), isCutVertex(vertices, 0) {}

    void addEdge(int u, int v, int id) {
        adj[u].push_back({v, id});
        adj[v].push_back({u, id});
    }

    void dfs(int u, int parentEdgeId) {
        tin[u] = low[u] = ++timer;
        int treeChildren = 0;

        for (const auto&amp; e : adj[u]) {
            if (e.id == parentEdgeId) continue; // Safe even with parallel edges!
            if (tin[e.to] != 0) {
                // Back edge to ancestor
                low[u] = std::min(low[u], tin[e.to]);
            } else {
                // Tree edge
                ++treeChildren;
                dfs(e.to, e.id);
                low[u] = std::min(low[u], low[e.to]);

                if (low[e.to] &gt; tin[u]) {
                    bridges.emplace_back(u, e.to);
                }
                if (parentEdgeId != -1 &amp;&amp; low[e.to] &gt;= tin[u]) {
                    isCutVertex[u] = 1;
                }
            }
        }
        if (parentEdgeId == -1 &amp;&amp; treeChildren &gt; 1) {
            isCutVertex[u] = 1;
        }
    }

    void solve() {
        for (int i = 0; i &lt; n; ++i) {
            if (tin[i] == 0) dfs(i, -1);
        }
    }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Parallel Edges &amp; Using <code>low[v]</code> Instead of <code>tin[v]</code> on Back Edges</div>
        <p>Two subtle bugs plague Tarjan implementations: (1) Skipping the parent via <code>if (v == parentVertex) continue;</code> fails on <strong>multigraphs</strong> where two parallel edges connect $u$ and $v$—neither parallel edge is a bridge, so always pass <code>parentEdgeId</code> rather than <code>parentVertex</code>! (2) On a back edge $(u, v)$, updating <code>low[u] = min(low[u], low[v])</code> instead of <code>tin[v]</code> breaks articulation point detection because $\\text{low}$ is defined using <em>at most one</em> back edge without bypassing $v$ through a second back edge.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "low[u] tracks the minimum discovery timestamp tin[w] reachable from u's DFS subtree using at most one back edge.",
      "A DFS tree edge (u, v) is a bridge if and only if low[v] > tin[u]; a non-root vertex u is an articulation point if and only if it has a tree child v with low[v] >= tin[u].",
      "The root of a DFS tree is an articulation point if and only if it has at least two DFS tree children.",
      "Always filter out the immediate parent transition by edge ID (e.id == parentEdgeId) rather than vertex ID so parallel edges in multigraphs are handled accurately."
    ],
    furtherReading: [
      { title: "Tarjan, R. E. (1972) — Depth-First Search and Linear Graph Algorithms", url: "https://doi.org/10.1137/0201010" },
      { title: "Hopcroft, J. & Tarjan, R. E. (1973) — Algorithm 447: Efficient Algorithms for Graph Manipulation", url: "https://doi.org/10.1145/362248.362272" },
      { title: "CP-Algorithms — Finding Bridges in a Graph in O(N+M)", url: "https://cp-algorithms.com/graph/bridge-searching.html" }
    ]
  },

  "scc-tarjan-kosaraju-2sat": {
    title: "Strongly Connected Components: Kosaraju's Two-Pass vs Tarjan's Single-Pass Stack & 2-SAT",
    video: {
      youtubeId: "wUgWX0nc4NY",
      title: "Tarjan's Strongly Connected Components Algorithm",
      channel: "William Fiset",
      duration: "21:18",
      length: "21:18",
      start: 0,
      why: "Explains why cross edges to already-popped SCCs must be ignored and how Tarjan's active stack isolates SCC roots in a single pass."
    },
    intuition: "<p>In a directed graph, two vertices $u$ and $v$ are mutually reachable ($u \\leadsto v$ and $v \\leadsto u$) if and only if they belong to the same <strong>Strongly Connected Component (SCC)</strong>. Mutual reachability is an equivalence relation that partitions any directed graph into disjoint SCCs. Contracting each SCC into a single supernode collapses every cycle in the graph, leaving behind a clean <strong>Condensation DAG</strong>.</p><p>Whether you use <strong>Kosaraju's two-pass transpose DFS</strong> or <strong>Tarjan's single-pass low-link stack</strong>, SCC decomposition runs in $O(V + E)$ time and directly powers linear-time <strong>2-SAT</strong> boolean satisfiability solvers.</p>",
    content: `<div class="lesson-content">
      <h2>SCC Equivalence Classes &amp; The Condensation DAG</h2>
      <p>Given $G = (V, E)$, define $u \\sim v \\iff (u \\leadsto v \\land v \\leadsto u)$. The equivalence classes $C_1, C_2, \\dots, C_k$ are the Strongly Connected Components of $G$. The <strong>condensation graph</strong> $G^{\\text{SCC}} = (V^{\\text{SCC}}, E^{\\text{SCC}})$ has a vertex for each $C_i$ and a directed edge $(C_i, C_j)$ whenever there is some $u \\in C_i, v \\in C_j$ with $(u, v) \\in E$ ($i \\neq j$). By construction, $G^{\\text{SCC}}$ is guaranteed to be a DAG.</p>

      <div class="invariant-box">
        <div class="box-title">Formal Invariant — Tarjan's SCC Root &amp; Active-Stack Invariant</div>
        <p>In every SCC $C$, the vertex $r \\in C$ discovered first during DFS has the minimum $\\text{tin}[r]$ among all vertices in $C$ and is called the <strong>root of $C$</strong>. By the White-Path Theorem, all other vertices in $C$ become descendants of $r$ in the DFS tree.</p>
        <p>Maintain an explicit stack $S$ of visited vertices whose SCC has not yet been finalized (marked with boolean <code>onStack[w] = true</code>). Define $\\text{low}[u]$ by updating $\\text{low}[u] = \\min(\\text{low}[u], \\text{tin}[v])$ <strong>only for edges $(u, v)$ where <code>onStack[v] == true</code></strong>. Then $u$ is the root of its SCC if and only if upon finishing $u$'s adjacency list:</p>
        $$\\text{low}[u] == \\text{tin}[u]$$
        <p>At that exact moment, popping vertices from $S$ down to $u$ extracts the exact SCC $C$ in reverse topological order of the condensation DAG!</p>
      </div>

      <h3>1. Kosaraju's Two-Pass Algorithm vs. Tarjan's Single-Pass Algorithm</h3>
      <ul>
        <li><strong>Kosaraju-Sharir (Two DFS Passes + Graph Transpose):</strong> Pass 1 runs DFS on $G$ and records vertices in decreasing order of finish time $\\text{tout}[u]$. Since the SCC with the global maximum $\\text{tout}$ is a source in $G^{\\text{SCC}}$, it is a <strong>sink</strong> in the transposed graph $G^T$ (all edges reversed). Pass 2 runs DFS on $G^T$ in that order; each DFS tree in $G^T$ is trapped inside a single sink SCC and peels components in topological order.</li>
        <li><strong>Tarjan's Algorithm (Single DFS Pass, Zero Transpose):</strong> Avoids constructing $G^T$ (saving $O(E)$ memory and half the cache misses). Because Tarjan emits each SCC when its root finishes post-order, component IDs $0, 1, \\dots, k-1$ are emitted in <strong>reverse topological order</strong> (sinks of $G^{\\text{SCC}}$ first, sources last).</li>
      </ul>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 190" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">SCC Decomposition &amp; 2-SAT Implication Symmetry (~x &rarr; y &equiv; ~y &rarr; x)</text>
          <defs>
            <marker id="arr-scc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/></marker>
          </defs>
          <!-- SCC 2 (Source) -->
          <rect x="35" y="45" width="180" height="120" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,3" rx="8"/>
          <text x="125" y="63" fill="#38bdf8" font-family="monospace" font-size="11" text-anchor="middle">SCC #1 (Source)</text>
          <circle cx="85" cy="115" r="18" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="85" y="119" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">¬x₀</text>
          <circle cx="165" cy="115" r="18" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="165" y="119" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">x₁</text>
          <path d="M 103 108 Q 125 90 147 108" fill="none" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#arr-scc)"/>
          <path d="M 147 122 Q 125 140 103 122" fill="none" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#arr-scc)"/>

          <!-- Cross edge between SCCs -->
          <line x1="183" y1="115" x2="275" y2="115" stroke="#94a3b8" stroke-width="2" marker-end="url(#arr-scc)"/>

          <!-- SCC 0 (Sink) -->
          <rect x="260" y="45" width="180" height="120" fill="#0f172a" stroke="#34d399" stroke-width="1.5" stroke-dasharray="4,3" rx="8"/>
          <text x="350" y="63" fill="#34d399" font-family="monospace" font-size="11" text-anchor="middle">SCC #0 (Popped 1st: Sink)</text>
          <circle cx="305" cy="115" r="18" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="305" y="119" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">¬x₁</text>
          <circle cx="395" cy="115" r="18" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="395" y="119" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">x₀</text>
          <path d="M 323 108 Q 350 90 377 108" fill="none" stroke="#34d399" stroke-width="1.8" marker-end="url(#arr-scc)"/>
          <path d="M 377 122 Q 350 140 323 122" fill="none" stroke="#34d399" stroke-width="1.8" marker-end="url(#arr-scc)"/>

          <!-- 2-SAT Rule Box -->
          <g transform="translate(465, 50)">
            <rect x="0" y="0" width="215" height="110" fill="#0f172a" stroke="#334155" rx="6"/>
            <text x="12" y="25" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">2-SAT Assignment Rule:</text>
            <text x="12" y="48" fill="#cbd5e1" font-family="monospace" font-size="11">comp[x₀] = 0, comp[¬x₀] = 1</text>
            <text x="12" y="70" fill="#34d399" font-family="monospace" font-size="11">x₀ = (comp[x₀] &lt; comp[¬x₀])</text>
            <text x="12" y="92" fill="#94a3b8" font-family="monospace" font-size="11">Sink SCC gets TRUE!</text>
          </g>
        </svg>
      </div>

      <div class="mermaid">
      flowchart TD
        Clause["2-SAT Clause (a OR b)"] --> Imp["Add 2 Directed Edges: (~a -> b) and (~b -> a)"]
        Imp --> Tarjan["Run Tarjan's SCC in O(V + E)"]
        Tarjan --> Check{"Exists i: comp[x_i] == comp[~x_i]?"}
        Check -- "Yes" --> Unsat["UNSATISFIABLE (x_i <=> ~x_i)"]
        Check -- "No" --> Sat["SATISFIABLE: set x_i = (comp[x_i] < comp[~x_i])"]
      </div>

      <div class="simulator-mount" data-sim="sim-bfs-dfs-tarjan-scc"></div>

      <h3>2. Linear-Time 2-SAT via Implication Graph SCCs</h3>
      <p>While 3-SAT is NP-complete, <strong>2-SAT</strong> (a conjunction of clauses $(a \\lor b)$ with two literals per clause) is solvable in $O(V + E)$ linear time (Aspvall, Plass &amp; Tarjan, 1979). Rewrite each clause $(a \\lor b)$ as two contrapositive logical implications:</p>
      $$(a \\lor b) \\iff (\\neg a \\Rightarrow b) \\land (\\neg b \\Rightarrow a)$$
      <p>Construct a directed implication graph with $2n$ vertices ($2i$ for $x_i$ and $2i+1$ for $\\neg x_i$):</p>
      <ul>
        <li><strong>Satisfiability Theorem:</strong> The 2-SAT formula is satisfiable if and only if no variable $x_i$ belongs to the same SCC as its negation $\\neg x_i$ ($\\text{comp}[2i] \\neq \\text{comp}[2i+1]$).</li>
        <li><strong>Truth Assignment:</strong> Because $p \\Rightarrow q$ means True cannot imply False, if $x_i$ is reachable from $\\neg x_i$, then $x_i$ appears in an SCC that is topologically <em>later</em> (closer to a sink, hence <strong>smaller</strong> Tarjan component ID) than $\\neg x_i$. Setting $x_i = (\\text{comp}[2i] &lt; \\text{comp}[2i+1])$ always produces a valid satisfying assignment!</li>
      </ul>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Why Tarjan Beats Kosaraju by ~2.3x in Wall-Clock Time</div>
        <p>Kosaraju's algorithm must build the transposed adjacency list $G^T$, doubling memory footprint ($2 \\times (V + E)$) and performing two full passes over the graph. Tarjan's algorithm runs a single DFS over $G$ in CSR format with one flat active stack, keeping working sets inside L2/L3 cache.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>DFS Passes</th>
            <th>Requires Transpose $G^T$?</th>
            <th>Time Complexity</th>
            <th>Space Complexity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tarjan's SCC Algorithm</strong></td>
            <td>1 Pass</td>
            <td>No</td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
          </tr>
          <tr>
            <td><strong>Kosaraju's SCC Algorithm</strong></td>
            <td>2 Passes</td>
            <td>Yes ($O(V+E)$ extra RAM)</td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V + E)</span></td>
          </tr>
          <tr>
            <td><strong>2-SAT Solver (Tarjan-based)</strong></td>
            <td>1 Pass</td>
            <td>No</td>
            <td><span class="badge-on">O(N + M)</span></td>
            <td><span class="badge-on">O(N + M)</span></td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Tarjan's SCC &amp; 2-SAT Solver</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;

struct TarjanSCC {
    int n, timer = 0, numComponents = 0;
    std::vector&lt;std::vector&lt;int&gt;&gt; adj;
    std::vector&lt;int&gt; tin, low, comp, st;
    std::vector&lt;uint8_t&gt; onStack;

    explicit TarjanSCC(int vertices)
        : n(vertices), adj(vertices), tin(vertices, 0),
          low(vertices, 0), comp(vertices, -1), onStack(vertices, 0) {
        st.reserve(vertices);
    }

    void addEdge(int u, int v) { adj[u].push_back(v); }

    void dfs(int u) {
        tin[u] = low[u] = ++timer;
        st.push_back(u);
        onStack[u] = 1;

        for (int v : adj[u]) {
            if (tin[v] == 0) {
                dfs(v);
                low[u] = std::min(low[u], low[v]);
            } else if (onStack[v]) {
                low[u] = std::min(low[u], tin[v]);
            }
        }

        if (low[u] == tin[u]) {
            while (true) {
                int w = st.back();
                st.pop_back();
                onStack[w] = 0;
                comp[w] = numComponents;
                if (w == u) break;
            }
            ++numComponents;
        }
    }

    void solve() {
        for (int i = 0; i &lt; n; ++i) {
            if (tin[i] == 0) dfs(i);
        }
    }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Updating <code>low[u]</code> from Cross Edges to Already-Popped SCCs</div>
        <p>Unlike undirected bridge-finding, a directed graph can have a cross edge $(u, v)$ where $v$ was visited earlier ($\\text{tin}[v] &lt; \\text{tin}[u]$) and <strong>already popped</strong> into a completed SCC (<code>onStack[v] == false</code>). If you omit the <code>else if (onStack[v])</code> guard, $\\text{low}[u]$ will absorb $\\text{tin}[v]$ from a disjoint SCC, preventing $\\text{low}[u] == \\text{tin}[u]$ from firing and merging separate SCCs together!</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Tarjan's SCC algorithm identifies component roots in a single DFS pass using the invariant low[u] == tin[u] while restricting non-tree updates to vertices currently on the active SCC stack (onStack[v] == true).",
      "Tarjan's algorithm emits SCCs in reverse topological order (sinks first), whereas Kosaraju's second pass on the transposed graph G^T emits SCCs in forward topological order (sources first).",
      "Contracting each SCC into a supernode yields the Condensation DAG, enabling dynamic programming over cyclic directed graphs.",
      "Every 2-SAT clause (a OR b) maps to two directed edges (~a -> b) and (~b -> a); the formula is satisfiable iff no variable x_i shares an SCC with ~x_i."
    ],
    furtherReading: [
      { title: "Tarjan, R. E. (1972) — Depth-First Search and Linear Graph Algorithms", url: "https://doi.org/10.1137/0201010" },
      { title: "Aspvall, B., Plass, M. F., & Tarjan, R. E. (1979) — A linear-time algorithm for testing the truth of certain quantified boolean formulas", url: "https://doi.org/10.1016/0020-0190(79)90002-4" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 20.5: Strongly Connected Components", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
    ]
  },

  "eulerian-paths-hierholzer": {
    title: "Eulerian Trails & Circuits: Degree Conditions & Hierholzer's O(E) Algorithm",
    video: {
      youtubeId: "8MpoO2zA2l4",
      title: "Eulerian Path and Circuit Algorithm (Hierholzer's Algorithm)",
      channel: "William Fiset",
      duration: "16:28",
      length: "16:28",
      start: 0,
      why: "Demonstrates degree parity conditions and how Hierholzer's post-order splicing avoids O(E^2) dead-end backtracking."
    },
    intuition: "<p>Whereas the Hamiltonian Cycle problem (visiting every <em>vertex</em> exactly once) is NP-complete, the <strong>Eulerian Circuit</strong> problem—traversing every <em>edge</em> of a graph exactly once—was solved by Leonhard Euler in 1736 (the Seven Bridges of Königsberg) and admits a deterministic $O(V + E)$ algorithm.</p><p>Because every time a walk enters and exits an intermediate vertex it consumes two incident edges (or one incoming and one outgoing edge in a directed graph), local degree parity completely determines global existence. <strong>Hierholzer's Algorithm (1873)</strong> constructs the trail in $O(E)$ time by greedily walking until stuck and splicing side-cycles in post-order.</p>",
    content: `<div class="lesson-content">
      <h2>Necessary &amp; Sufficient Degree Conditions</h2>
      <p>Assume all vertices with non-zero degree belong to a single connected component (or in the directed case, a single weakly connected component whose underlying active vertices satisfy the degree conditions below).</p>

      <div class="invariant-box">
        <div class="box-title">Formal Theorem — Euler-Hierholzer Existence Conditions</div>
        <ul>
          <li><strong>Undirected Eulerian Circuit (Closed Tour):</strong> Exists iff every vertex has <strong>even degree</strong> ($\\forall u, \\text{deg}(u) \\equiv 0 \\pmod 2$).</li>
          <li><strong>Undirected Eulerian Trail (Open Path):</strong> Exists iff <strong>$0$ or $2$ vertices</strong> have odd degree. If $2$ vertices have odd degree, one must be the start vertex and the other the end vertex.</li>
          <li><strong>Directed Eulerian Circuit:</strong> Exists iff every vertex belongs to the same strongly connected component and satisfies $\\text{in-deg}(u) == \\text{out-deg}(u)$.</li>
          <li><strong>Directed Eulerian Trail:</strong> Exists iff at most one vertex has $\\text{out-deg}(s) - \\text{in-deg}(s) = 1$ (start $s$), at most one vertex has $\\text{in-deg}(t) - \\text{out-deg}(t) = 1$ (end $t$), and all other vertices have $\\text{in-deg}(u) == \\text{out-deg}(u)$.</li>
        </ul>
      </div>

      <h3>How Hierholzer's Algorithm Splices Sub-Cycles in $O(E)$</h3>
      <p>Suppose we start at $s$ and greedily follow unused outgoing edges, deleting each edge as we traverse it. By the degree invariant, whenever we enter any vertex $v \\neq t$, there is at least one unused outgoing edge leaving $v$. Thus the greedy walk can <em>only</em> get stuck at the destination vertex $t$ (or $s$ for a circuit)!</p>
      <p>However, this initial walk $W$ might bypass some edges if the graph contains side-cycles. Instead of splicing linked lists mid-walk, <strong>Hierholzer's post-order formulation</strong> maintains a per-vertex edge cursor <code>head[u]</code> (just like Dinic's current-arc pointer):</p>
      <ol>
        <li>While vertex $u$ still has unused outgoing edges, grab the next edge $e = (u, v)$, advance <code>head[u]++</code>, and recurse (or push to an explicit stack) on $v$.</li>
        <li>Only when $u$ has <strong>zero remaining outgoing edges</strong> do we append $u$ to the output vector <code>trail</code>.</li>
        <li>Finally, reverse <code>trail</code>. If <code>trail.size() == E + 1</code>, the graph is connected on its edge set and <code>trail</code> is the exact Eulerian path; otherwise the edges belong to disconnected components!</li>
      </ol>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 185" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Hierholzer Post-Order Splicing: Main Walk + Detour Cycle at Vertex 1</text>
          <defs>
            <marker id="arr-eu1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8"/></marker>
            <marker id="arr-eu2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399"/></marker>
          </defs>
          <!-- Main walk 0 -> 1 -> 2 -->
          <circle cx="90" cy="110" r="20" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="90" y="114" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">0</text>
          <circle cx="240" cy="110" r="20" fill="#1e293b" stroke="#34d399" stroke-width="2.5"/>
          <text x="240" y="114" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">1</text>
          <circle cx="390" cy="110" r="20" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="390" y="114" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">2</text>

          <!-- Detour cycle 1 -> 3 -> 4 -> 1 -->
          <circle cx="190" cy="50" r="16" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="190" y="54" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">3</text>
          <circle cx="290" cy="50" r="16" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="290" y="54" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">4</text>

          <line x1="110" y1="110" x2="218" y2="110" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-eu1)"/>
          <line x1="260" y1="110" x2="368" y2="110" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-eu1)"/>
          <line x1="227" y1="94" x2="202" y2="64" stroke="#34d399" stroke-width="2" stroke-dasharray="4,2" marker-end="url(#arr-eu2)"/>
          <line x1="206" y1="50" x2="272" y2="50" stroke="#34d399" stroke-width="2" stroke-dasharray="4,2" marker-end="url(#arr-eu2)"/>
          <line x1="278" y1="64" x2="253" y2="94" stroke="#34d399" stroke-width="2" stroke-dasharray="4,2" marker-end="url(#arr-eu2)"/>

          <g transform="translate(440, 50)">
            <rect x="0" y="0" width="235" height="105" fill="#0f172a" stroke="#334155" rx="6"/>
            <text x="12" y="24" fill="#38bdf8" font-family="monospace" font-size="11">1. Walk 0 &rarr; 1 &rarr; 2 (2 finishes)</text>
            <text x="12" y="48" fill="#34d399" font-family="monospace" font-size="11">2. Back at 1: detour 1&rarr;3&rarr;4&rarr;1</text>
            <text x="12" y="72" fill="#f59e0b" font-family="monospace" font-size="11">3. Post-order: [2, 1, 4, 3, 1, 0]</text>
            <text x="12" y="94" fill="#f8fafc" font-family="monospace" font-size="11">4. Reversed: 0&rarr;1&rarr;3&rarr;4&rarr;1&rarr;2</text>
          </g>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Deg["Verify Degree Parity Conditions"] --> Start["Pick start vertex s; push s to stack"]
        Start --> Top{"u = st.back() has unused edge?"}
        Top -- "Yes" --> Advance["Consume edge (u, v); push v to stack"]
        Advance --> Top
        Top -- "No" --> Emit["Pop u and append u to trail"]
        Emit --> Empty{"Stack empty?"}
        Empty -- "No" --> Top
        Empty -- "Yes" --> Rev["Reverse trail & verify trail.size() == E + 1"]
      </div>

      <div class="simulator-mount" data-sim="sim-csr-eulerian-hierholzer"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Current-Arc Cursor vs. <code>std::set</code> Edge Deletion</div>
        <p>Deleting traversed edges from a <code>std::set&lt;int&gt;</code> or <code>std::vector::erase</code> degrades Hierholzer's algorithm to $O(E \\log V)$ or $O(E^2)$. Instead, maintain an index cursor <code>idx[u]</code> into each vertex's adjacency vector (advancing <code>idx[u]++</code>) and for undirected graphs mark a flat boolean array <code>usedEdge[edgeId] = 1</code>. This runs in strict $O(V + E)$ with sequential array scans.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Time Complexity</th>
            <th>Space Complexity</th>
            <th>Bottleneck</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Hierholzer's Algorithm (Cursor + Stack)</strong></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td>Single linear scan over adjacency lists</td>
          </tr>
          <tr>
            <td><strong>Fleury's Algorithm (Bridge Check per Step)</strong></td>
            <td><span class="badge-on2">O(E²)</span></td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td>Re-running bridge detection on every edge</td>
          </tr>
          <tr>
            <td><strong>De Bruijn Sequence Generation ($k^n$)</strong></td>
            <td><span class="badge-on">O(k^n)</span></td>
            <td><span class="badge-on">O(k^n)</span></td>
            <td>Eulerian circuit on $k^{n-1}$-state De Bruijn graph</td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Iterative Hierholzer's Algorithm (Directed &amp; Undirected)</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;

// Finds a Directed Eulerian Trail/Circuit in O(V + E). Returns empty vector if none exists.
std::vector&lt;int&gt; findDirectedEulerianTrail(int n, int m, const std::vector&lt;std::vector&lt;int&gt;&gt;&amp; adj) {
    std::vector&lt;int&gt; in(n, 0), out(n, 0);
    for (int u = 0; u &lt; n; ++u) {
        out[u] = static_cast&lt;int&gt;(adj[u].size());
        for (int v : adj[u]) ++in[v];
    }

    int start = -1, plusOne = 0, minusOne = 0;
    for (int u = 0; u &lt; n; ++u) {
        int diff = out[u] - in[u];
        if (diff == 1) { ++plusOne; start = u; }
        else if (diff == -1) { ++minusOne; }
        else if (diff != 0) return {};
    }
    if (!((plusOne == 0 &amp;&amp; minusOne == 0) || (plusOne == 1 &amp;&amp; minusOne == 1))) return {};

    if (start == -1) {
        start = 0;
        for (int u = 0; u &lt; n; ++u) {
            if (out[u] &gt; 0) { start = u; break; }
        }
    }

    std::vector&lt;size_t&gt; cursor(n, 0);
    std::vector&lt;int&gt; st = {start}, trail;
    trail.reserve(m + 1);

    while (!st.empty()) {
        int u = st.back();
        if (cursor[u] &lt; adj[u].size()) {
            int v = adj[u][cursor[u]++];
            st.push_back(v);
        } else {
            trail.push_back(u);
            st.pop_back();
        }
    }

    if (static_cast&lt;int&gt;(trail.size()) != m + 1) return {}; // Disconnected edge components
    std::reverse(trail.begin(), trail.end());
    return trail;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Passing Degree Checks on Disconnected Edge Components</div>
        <p>Consider a graph consisting of two disjoint triangles ($C_3 \\cup C_3$). Every vertex has degree $2$ (even!), so a naive check that only verifies vertex degrees declares the graph Eulerian and returns a circuit of length $3$ instead of $6$. Always check <code>trail.size() == E + 1</code> after Hierholzer's loop finishes to verify that all $E$ edges belong to the same connected component.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "An undirected graph has an Eulerian circuit iff every vertex has even degree (and all edges lie in one connected component), and an Eulerian trail iff 0 or 2 vertices have odd degree.",
      "A directed graph has an Eulerian trail iff at most one vertex has out - in = 1, at most one has in - out = 1, and all others have in == out.",
      "Hierholzer's algorithm runs in O(V + E) time by advancing a per-vertex adjacency cursor and emitting vertices in post-order when their outgoing edges are exhausted.",
      "Always verify that the resulting vertex sequence has length exactly E + 1 to guard against disconnected cycles passing the local degree test."
    ],
    furtherReading: [
      { title: "Hierholzer, C. & Wiener, C. (1873) — Über die Möglichkeit, einen Linienzug ohne Wiederholung und ohne Unterbrechung zu umfahren", url: "https://doi.org/10.1007/BF01442866" },
      { title: "CP-Algorithms — Finding the Eulerian path in O(M)", url: "https://cp-algorithms.com/graph/euler_path.html" },
      { title: "Jeff Erickson — Algorithms, Chapter 5: Eulerian Tours", url: "https://jeffe.cs.illinois.edu/teaching/algorithms/" }
    ]
  }
});

Object.assign(window.MODULE_CONTENT["m12"], {
  "case-bundler-build-graph-cycles": {
    title: "Production Case Study: Topological Scheduling & SCC Cycle Reporting in Build Systems (bazel, turborepo, cargo)",
    video: {
      youtubeId: "R6uoSjZ2imo",
      id: "R6uoSjZ2imo",
      url: "https://www.youtube.com/embed/R6uoSjZ2imo",
      title: "Strongly Connected Components (Kosaraju's Two-Pass Algorithm & Condensation DAGs)",
      channel: "take U forward",
      duration: "27:30",
      start: 0,
      length: "27m",
      why: "Connects DAG scheduling, critical-path latency, and strongly connected component cycle diagnostics to large-scale software build systems."
    },
    intuition: "<p>Every invocation of <code>cargo build</code>, <code>bazel build //...</code>, or <code>turbo run build</code> constructs a directed dependency graph $G = (V, E)$ where vertices are compilation units (crates, targets, or monorepo packages) and directed edges $(u, v)$ encode that $u$ must finish building before $v$ can begin. A monorepo at Google or Meta contains millones of targets; scheduling them with maximum parallelism while immediately diagnosing circular dependencies is a mission-critical graph problem.</p><p>Production build engines combine three algorithms from this module: <strong>Tarjan's SCC</strong> to isolate minimal circular dependency chains, <strong>Kahn's event-driven work-stealing queue</strong> to feed worker threads dynamically as dependencies resolve, and <strong>Critical-Path DAG DP</strong> to prioritize targets sitting on the longest compilation chain.</p>",
    content: `<div class="lesson-content">
      <h2>Architecture of a Modern Build Scheduler</h2>
      <p>Suppose package $A$ depends on $B$, and $B$ depends on $C$. In the <strong>compilation execution DAG</strong>, edges point in the direction of data flow: $C \\to B \\to A$ ($C$ unlocks $B$, which unlocks $A$). A production build system must satisfy three engineering constraints:</p>
      <ol>
        <li><strong>Soundness (Zero Race Conditions):</strong> Target $v$ is never scheduled onto a worker thread until all predecessors $u$ with $(u, v) \\in E$ have exited with status code <code>0</code>.</li>
        <li><strong>Work-Conserving Critical-Path Priority:</strong> If 8 CPU cores are free and 20 zero-indegree targets are ready, the scheduler must pick the targets with the largest downstream <strong>bottom-level critical path</strong> $\\text{crit}[u] = \\text{cost}(u) + \\max_{(u,v) \\in E} \\text{crit}[v]$.</li>
        <li><strong>Actionable Cycle Diagnostics:</strong> If a developer introduces a circular dependency, simply printing <code>Error: cycle detected</code> across $50{,}000$ targets is useless. The engine must isolate the exact Strongly Connected Component with $|C| \\ge 2$ (or self-loop) and extract a <strong>shortest simple cycle</strong> inside that SCC.</li>
      </ol>

      <div class="invariant-box">
        <div class="box-title">Formal Theorem — Brent's Theorem &amp; Critical-Path Scheduling Bound</div>
        <p>Let $T_1 = \\sum_{u \\in V} \\text{cost}(u)$ be the total sequential build work and $T_\\infty = \\max_{\\text{path } P} \\sum_{u \\in P} \\text{cost}(u)$ be the critical-path length (span) of the DAG. On $P$ parallel worker threads, any schedule requires at least $\\max(T_1 / P, T_\\infty)$ time. A greedy work-conserving Kahn scheduler that prioritizes ready tasks by decreasing $\\text{crit}[u]$ achieves total build time:</p>
        $$T_P \\le \\frac{T_1 - T_\\infty}{P} + T_\\infty$$
        <p>Staying within a $(2 - 1/P)$ factor of the theoretical optimum while adapting dynamically to cache hits and variable compiler runtimes.</p>
      </div>

      <h3>Why Kahn's Indegree Queue Alone Is Insufficient for Error Reporting</h3>
      <p>When Kahn's algorithm halts early on a cyclic build graph, every vertex inside a cycle has remaining $\\text{indegree} &gt; 0$—<em>but so does every valid downstream package that depends on that cycle!</em> If core library <code>auth</code> and <code>crypto</code> form a 2-node cycle, and 400 UI packages depend on <code>auth</code>, all 402 packages remain unvisited when Kahn's queue runs dry. Running <strong>Tarjan's SCC</strong> filters out the 400 downstream victims (which form trivial 1-node SCCs) and pinpoints the exact 2-node SCC <code>{auth, crypto}</code>.</p>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 190" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Build Graph: Critical-Path Priority Queue &amp; SCC Cycle Isolation</text>
          <defs>
            <marker id="arr-bld" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/></marker>
            <marker id="arr-cyc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171"/></marker>
          </defs>
          <!-- Valid DAG branch -->
          <rect x="30" y="50" width="115" height="42" fill="#064e3b" stroke="#34d399" stroke-width="2" rx="5"/>
          <text x="87" y="68" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">core-types (8s)</text>
          <text x="87" y="83" fill="#34d399" font-family="monospace" font-size="10" text-anchor="middle">crit = 20s [P1]</text>

          <rect x="200" y="50" width="115" height="42" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" rx="5"/>
          <text x="257" y="68" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">db-engine (12s)</text>
          <text x="257" y="83" fill="#38bdf8" font-family="monospace" font-size="10" text-anchor="middle">crit = 12s</text>

          <line x1="145" y1="71" x2="198" y2="71" stroke="#94a3b8" stroke-width="2" marker-end="url(#arr-bld)"/>

          <!-- Cyclic SCC branch -->
          <rect x="370" y="42" width="300" height="125" fill="#1f1215" stroke="#f87171" stroke-dasharray="4,3" rx="6"/>
          <text x="520" y="60" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">Non-Trivial SCC (|C|=2) vs Victim</text>

          <circle cx="430" cy="110" r="24" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
          <text x="430" y="114" fill="#fef2f2" font-family="monospace" font-size="11" text-anchor="middle">auth</text>
          <circle cx="525" cy="110" r="24" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
          <text x="525" y="114" fill="#fef2f2" font-family="monospace" font-size="11" text-anchor="middle">crypto</text>
          <path d="M 452 100 Q 477 82 503 100" fill="none" stroke="#f87171" stroke-width="2" marker-end="url(#arr-cyc)"/>
          <path d="M 503 120 Q 477 138 452 120" fill="none" stroke="#f87171" stroke-width="2" marker-end="url(#arr-cyc)"/>

          <circle cx="625" cy="110" r="24" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="625" y="114" fill="#cbd5e1" font-family="monospace" font-size="11" text-anchor="middle">ui-app</text>
          <line x1="549" y1="110" x2="599" y2="110" stroke="#94a3b8" stroke-width="1.8" marker-end="url(#arr-bld)"/>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Parse["Parse Lockfile / Build Targets"] --> Tarjan["Run Tarjan SCC Check"]
        Tarjan --> HasCycle{"Any SCC with |C| > 1?"}
        HasCycle -- "Yes" --> BFS["Run BFS inside SCC to print shortest cycle"]
        HasCycle -- "No" --> Crit["Compute bottom-level critical path crit[u] on DAG"]
        Crit --> Sched["Kahn Max-Heap Scheduler keyed by crit[u]"]
      </div>

      <div class="simulator-mount" data-sim="sim-toposort-kahn-2sat"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Lock-Free Atomic Indegree Decrement in Build Daemons</div>
        <p>In Rust's <code>cargo</code> and Vercel's <code>turborepo</code>, worker threads finishing a build target $u$ do not acquire a global mutex to update neighbor indegrees. Instead, each target stores <code>std::atomic&lt;uint32_t&gt; remaining_deps</code>. When a worker finishes $u$, it loops over $v \\in \\text{adj}[u]$ and executes <code>if (remaining_deps[v].fetch_sub(1, std::memory_order_acq_rel) == 1) workStealingQueue.push(v);</code>—achieving wait-free topological propagation across 64+ CPU cores.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Build Engine Phase</th>
            <th>Algorithm</th>
            <th>Time Complexity</th>
            <th>Space Complexity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Cycle Isolation</strong></td>
            <td>Tarjan's SCC + Intra-SCC BFS</td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
          </tr>
          <tr>
            <td><strong>Critical-Path Precomputation</strong></td>
            <td>Reverse Topological DAG DP</td>
            <td><span class="badge-on">O(V + E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
          </tr>
          <tr>
            <td><strong>Priority Ready-Queue Dispatch</strong></td>
            <td>Kahn's Algorithm + Max-Heap</td>
            <td><span class="badge-onlogn">O(V log V + E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Critical-Path DAG Scheduler with Cycle Diagnostics</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;algorithm&gt;

struct BuildScheduleResult {
    bool hasCycle = false;
    std::vector&lt;int&gt; executionOrder;
    std::vector&lt;int&gt; criticalPathTime;
};

BuildScheduleResult scheduleBuildTargets(int n, const std::vector&lt;int&gt;&amp; buildCost,
                                         const std::vector&lt;std::vector&lt;int&gt;&gt;&amp; adj) {
    BuildScheduleResult res{false, {}, std::vector&lt;int&gt;(n, 0)};
    std::vector&lt;int&gt; indeg(n, 0);
    for (int u = 0; u &lt; n; ++u) {
        for (int v : adj[u]) ++indeg[v];
    }

    // 1. Verify DAG and obtain topological order
    std::vector&lt;int&gt; topo;
    topo.reserve(n);
    for (int u = 0; u &lt; n; ++u) {
        if (indeg[u] == 0) topo.push_back(u);
    }
    std::vector&lt;int&gt; tmpIndeg = indeg;
    for (size_t i = 0; i &lt; topo.size(); ++i) {
        int u = topo[i];
        for (int v : adj[u]) {
            if (--tmpIndeg[v] == 0) topo.push_back(v);
        }
    }
    if (static_cast&lt;int&gt;(topo.size()) != n) {
        res.hasCycle = true;
        return res;
    }

    // 2. Compute bottom-level critical path in reverse topological order
    for (int i = n - 1; i &gt;= 0; --i) {
        int u = topo[i];
        int maxChild = 0;
        for (int v : adj[u]) {
            maxChild = std::max(maxChild, res.criticalPathTime[v]);
        }
        res.criticalPathTime[u] = buildCost[u] + maxChild;
    }

    // 3. Priority Kahn dispatch keyed by longest critical path first
    using State = std::pair&lt;int, int&gt;; // (criticalPathTime, u)
    std::priority_queue&lt;State&gt; pq;
    for (int u = 0; u &lt; n; ++u) {
        if (indeg[u] == 0) pq.push({res.criticalPathTime[u], u});
    }
    while (!pq.empty()) {
        auto [crit, u] = pq.top();
        pq.pop();
        res.executionOrder.push_back(u);
        for (int v : adj[u]) {
            if (--indeg[v] == 0) {
                pq.push({res.criticalPathTime[v], v});
            }
        }
    }
    return res;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Reversed Edge Direction Between Dependency Declaration and Execution Flow</div>
        <p>In a <code>package.json</code> or <code>Cargo.toml</code> file, target $A$ lists $B$ in its <code>dependencies</code> array ($A \\to_{\\text{depends}} B$). For execution scheduling, however, $B$ must finish <em>before</em> $A$ starts ($B \\to_{\\text{unlocks}} A$), meaning $A$'s initial indegree is the number of packages $A$ depends on! Reversing this convention schedules dependents before their dependencies and breaks compilation.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Build systems model targets as vertices and unlock dependencies as directed edges in a DAG, where indegree[u] counts how many prerequisites of u have not yet finished compiling.",
      "When Kahn's algorithm halts early due to a cycle, downstream targets depending on the cycle also retain positive indegree; Tarjan's SCC isolates the exact cyclic components.",
      "Prioritizing ready zero-indegree tasks by their bottom-level critical path length minimizes multi-core makespan within Brent's Theorem bounds.",
      "Multi-threaded build daemons use atomic fetch_sub(1) on remaining dependency counters to trigger zero-indegree tasks without global lock contention."
    ],
    furtherReading: [
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 20.4–20.5: Topological Sort & SCCs", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "Tarjan, R. E. (1972) — Depth-First Search and Linear Graph Algorithms", url: "https://doi.org/10.1137/0201010" },
      { title: "Jeff Erickson — Algorithms, Chapter 6: DAGs and Topological Ordering", url: "https://jeffe.cs.illinois.edu/teaching/algorithms/" }
    ]
  },

  "build-tarjan-scc-2sat-solver": {
    title: "Build Lab: Tarjan's SCC Condensation DAG & Linear-Time 2-SAT Constraint Solver",
    video: {
      youtubeId: "09_LlHjoEiY",
      title: "2-SAT Problem & Strongly Connected Components Implementation",
      channel: "William Fiset",
      duration: "19:45",
      length: "19:45",
      start: 0,
      why: "Walks through encoding boolean constraints into an implication graph and extracting truth assignments from Tarjan SCC IDs."
    },
    intuition: "<p>In this Build Lab, we assemble a complete, production-grade <strong>Tarjan SCC Condensation Engine and Linear-Time 2-SAT Solver</strong>. Many seemingly intractable scheduling, circuit-routing, and configuration conflicts—where every constraint involves choosing between two options or avoiding pairwise conflicts—reduce directly to 2-SAT.</p><p>By indexing variable $x_i$ as vertex $2i$ and its negation $\\neg x_i$ as $2i \\oplus 1$, we can encode OR, XOR, NAND, and implication constraints into a compact CSR/adjacency graph, decompose it into Strongly Connected Components in a single $O(N + M)$ pass, and read off a verified boolean assignment directly from the topological order of the SCC IDs.</p>",
    content: `<div class="lesson-content">
      <h2>Engineering Blueprint: Literal Encoding &amp; Constraint Gadgets</h2>
      <p>Given $N$ boolean variables $x_0, x_1, \\dots, x_{N-1}$, we allocate $2N$ vertices in the implication graph. For each variable $i \\in [0, N-1]$:</p>
      <ul>
        <li>Vertex $2i$ represents the positive literal $x_i$ (<code>isTrue = true</code>).</li>
        <li>Vertex $2i + 1$ represents the negated literal $\\neg x_i$ (<code>isTrue = false</code>).</li>
        <li>Negating any literal vertex $u \\in [0, 2N-1]$ is a single branchless bitwise XOR: $\\neg u = u \\oplus 1$.</li>
      </ul>

      <div class="invariant-box">
        <div class="box-title">Formal Gadget Dictionary — Reducing Boolean Constraints to 2-SAT Clauses</div>
        <p>Every binary boolean constraint over literals $a, b$ reduces to one or more base clauses $(p \\lor q)$, each adding two directed edges $(\\neg p \\to q)$ and $(\\neg q \\to p)$:</p>
        <ul>
          <li><strong>At least one true ($a \\lor b$):</strong> <code>addClause(a, b)</code> $\\implies (\\neg a \\to b), (\\neg b \\to a)$.</li>
          <li><strong>Implication ($a \\Rightarrow b$):</strong> Equivalent to $(\\neg a \\lor b) \\implies$ <code>addClause(a ^ 1, b)</code>.</li>
          <li><strong>Mutual Exclusion / At most one true ($\\neg(a \\land b)$):</strong> Equivalent to $(\\neg a \\lor \\neg b) \\implies$ <code>addClause(a ^ 1, b ^ 1)</code>.</li>
          <li><strong>XOR / Exactly one true ($a \\oplus b$):</strong> Combine $(a \\lor b) \\land (\\neg a \\lor \\neg b)$.</li>
          <li><strong>Equality ($a \\iff b$):</strong> Combine $(\\neg a \\lor b) \\land (a \\lor \\neg b)$.</li>
          <li><strong>Force $a$ to be True (Unit Clause):</strong> Equivalent to $(a \\lor a) \\implies$ single edge $(\\neg a \\to a)$.</li>
        </ul>
      </div>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 185" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">2-SAT Vertex Indexing (2i / 2i^1) &amp; Condensation DAG Assignment</text>
          <g transform="translate(35, 50)">
            <rect x="0" y="0" width="290" height="115" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" rx="6"/>
            <text x="145" y="24" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Bitwise Literal Encoding</text>
            <text x="20" y="52" fill="#cbd5e1" font-family="monospace" font-size="11">var x_i (True)  &rarr; u = 2*i</text>
            <text x="20" y="76" fill="#cbd5e1" font-family="monospace" font-size="11">var ~x_i (False)&rarr; u = 2*i + 1</text>
            <text x="20" y="100" fill="#34d399" font-family="monospace" font-size="11">negate(u)       &rarr; u ^ 1  (O(1) ALU)</text>
          </g>
          <g transform="translate(365, 50)">
            <rect x="0" y="0" width="300" height="115" fill="#0f172a" stroke="#34d399" stroke-width="1.5" rx="6"/>
            <text x="150" y="24" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Tarjan Component ID Resolution</text>
            <text x="20" y="52" fill="#f87171" font-family="monospace" font-size="11">If comp[2*i] == comp[2*i+1]: UNSAT</text>
            <text x="20" y="76" fill="#cbd5e1" font-family="monospace" font-size="11">If comp[2*i] &lt; comp[2*i+1]:  x_i = true</text>
            <text x="20" y="100" fill="#cbd5e1" font-family="monospace" font-size="11">If comp[2*i] &gt; comp[2*i+1]:  x_i = false</text>
          </g>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Encode["Encode Clauses into 2N-Vertex Graph"] --> RunSCC["Run Tarjan's Single-Pass SCC"]
        RunSCC --> LoopVars["For i = 0 .. N-1: compare comp[2i] vs comp[2i+1]"]
        LoopVars --> Equal{"comp[2i] == comp[2i+1]?"}
        Equal -- "Yes" --> FalseRet["Return UNSAT"]
        Equal -- "No" --> Assign["assignment[i] = (comp[2i] < comp[2i+1])"]
      </div>

      <div class="simulator-mount" data-sim="sim-bfs-dfs-tarjan-scc"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Prefix-Optimization for "At Most One" Over $K$ Variables</div>
        <p>Suppose a constraint requires at most one of $K$ literals $\\{l_0, l_1, \\dots, l_{K-1}\\}$ to be true. Naive pairwise mutex adds $\\binom{K}{2} = O(K^2)$ edges! Instead, introduce $K$ auxiliary prefix variables $p_0, \\dots, p_{K-1}$ where $p_j$ means "$\\bigvee_{r=0}^j l_r$ is true", adding implications $l_j \\Rightarrow p_j$, $p_{j-1} \\Rightarrow p_j$, and $p_{j-1} \\Rightarrow \\neg l_j$. This reduces the edge count from $O(K^2)$ to strictly $3K = O(K)$ linear edges!</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Operation / Feature</th>
            <th>Naive / Backtracking</th>
            <th>Tarjan 2-SAT Engine</th>
            <th>Memory Footprint</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Solve $N$ Vars, $M$ Clauses</strong></td>
            <td><span class="badge-o2n">O(2^N)</span> worst-case</td>
            <td><span class="badge-on">O(N + M)</span></td>
            <td><span class="badge-on">O(N + M)</span></td>
          </tr>
          <tr>
            <td><strong>At-Most-One of $K$ Literals</strong></td>
            <td><span class="badge-on2">O(K²)</span> pairwise clauses</td>
            <td><span class="badge-on">O(K)</span> with prefix vars</td>
            <td><span class="badge-on">O(K)</span> auxiliary literals</td>
          </tr>
          <tr>
            <td><strong>Condensation DAG Construction</strong></td>
            <td><span class="badge-on2">O(V²)</span> dense matrix</td>
            <td><span class="badge-on">O(V + E)</span> deduplicated</td>
            <td><span class="badge-on">O(V + E)</span></td>
          </tr>
        </tbody>
      </table>

      <h2>Complete Implementation: Linear-Time 2-SAT Solver &amp; Condensation DAG Builder</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;cstdint&gt;

class TwoSatSolver {
public:
    explicit TwoSatSolver(int numVars)
        : n(numVars), adj(2 * numVars), tin(2 * numVars, 0),
          low(2 * numVars, 0), comp(2 * numVars, -1),
          onStack(2 * numVars, 0), assignment(numVars, false) {
        st.reserve(2 * numVars);
    }

    static int lit(int var, bool isTrue) noexcept {
        return 2 * var + (isTrue ? 0 : 1);
    }

    // Adds (u OR v) where u, v are literal indices in [0, 2n-1]
    void addClause(int u, int v) {
        adj[u ^ 1].push_back(v);
        adj[v ^ 1].push_back(u);
    }

    void addXor(int u, int v) {
        addClause(u, v);
        addClause(u ^ 1, v ^ 1);
    }

    void addEq(int u, int v) {
        addClause(u ^ 1, v);
        addClause(u, v ^ 1);
    }

    bool solve() {
        for (int i = 0; i &lt; 2 * n; ++i) {
            if (tin[i] == 0) dfs(i);
        }
        for (int i = 0; i &lt; n; ++i) {
            if (comp[2 * i] == comp[2 * i + 1]) return false;
            // In Tarjan's SCC, smaller component ID means closer to a sink in the DAG
            assignment[i] = (comp[2 * i] &lt; comp[2 * i + 1]);
        }
        return true;
    }

    const std::vector&lt;bool&gt;&amp; values() const noexcept { return assignment; }

private:
    int n, timer = 0, sccCount = 0;
    std::vector&lt;std::vector&lt;int&gt;&gt; adj;
    std::vector&lt;int&gt; tin, low, comp, st;
    std::vector&lt;uint8_t&gt; onStack;
    std::vector&lt;bool&gt; assignment;

    void dfs(int u) {
        tin[u] = low[u] = ++timer;
        st.push_back(u);
        onStack[u] = 1;
        for (int v : adj[u]) {
            if (tin[v] == 0) {
                dfs(v);
                low[u] = std::min(low[u], low[v]);
            } else if (onStack[v]) {
                low[u] = std::min(low[u], tin[v]);
            }
        }
        if (low[u] == tin[u]) {
            while (true) {
                int w = st.back();
                st.pop_back();
                onStack[w] = 0;
                comp[w] = sccCount;
                if (w == u) break;
            }
            ++sccCount;
        }
    }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Inverting <code>&lt;</code> vs <code>&gt;</code> Between Tarjan and Kosaraju</div>
        <p>In <strong>Tarjan's algorithm</strong>, SCCs are popped in post-order (sinks get ID $0$, sources get ID $K-1$), so the sink-most literal satisfies $\\text{comp}[2i] &lt; \\text{comp}[2i+1]$. In <strong>Kosaraju's algorithm</strong>, the second pass discovers sources first (sources get ID $0$, sinks get ID $K-1$), so the inequality reverses to $\\text{comp}[2i] &gt; \\text{comp}[2i+1]$. Mixing the two conventions sets every implied variable to False instead of True!</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Representing positive literal x_i as 2i and negative literal ~x_i as 2i + 1 enables O(1) branchless negation via bitwise XOR (u ^ 1).",
      "Every binary boolean operator (OR, IMPLIES, NAND, XOR, EQ) reduces to at most two 2-SAT clauses (four directed implication edges).",
      "Prefix variable encoding reduces 'at most one of K literals' constraints from O(K^2) edges to O(K) edges.",
      "In Tarjan's SCC numbering, sinks receive smaller component IDs than sources, so x_i = (comp[2i] < comp[2i+1]) yields a valid truth assignment whenever comp[2i] != comp[2i+1]."
    ],
    furtherReading: [
      { title: "Aspvall, B., Plass, M. F., & Tarjan, R. E. (1979) — A linear-time algorithm for testing the truth of certain quantified boolean formulas", url: "https://doi.org/10.1016/0020-0190(79)90002-4" },
      { title: "CP-Algorithms — 2-SAT in Linear Time", url: "https://cp-algorithms.com/graph/2SAT.html" },
      { title: "Tarjan, R. E. (1972) — Depth-First Search and Linear Graph Algorithms", url: "https://doi.org/10.1137/0201010" }
    ]
  }
});
