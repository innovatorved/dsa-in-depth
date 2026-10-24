window.MODULE_CONTENT = window.MODULE_CONTENT || {};
window.MODULE_CONTENT["m13"] = {
  "disjoint-set-union-ackermann": {
    title: "Disjoint Set Union (Union-Find): Union by Rank + Path Compression & O(α(N)) Proof Intuition",
    video: {
      youtubeId: "ibjEGG7ylHk",
      title: "Union Find (Disjoint Set) Data Structure — Path Compression & Union by Rank",
      channel: "William Fiset",
      duration: "14:52",
      length: "14:52",
      start: 0,
      why: "Visualizes parent pointer trees, union by rank/size balancing, and how path compression flattens trees to near-constant depth."
    },
    intuition: "<p>Maintaining dynamic connected components under edge insertions is one of the most fundamental operations in computer science. A naive array of component IDs supports $O(1)$ connectivity queries but requires $O(N)$ scans to merge two components; conversely, naive parent-pointer trees merge in $O(1)$ but degenerate into $O(N)$ linked lists on queries.</p><p>By combining two deceptively simple heuristics—<strong>Union by Rank (or Size)</strong> and <strong>Path Compression</strong>—Robert Tarjan proved in 1975 that a sequence of $M$ operations on $N$ elements executes in $O(M \\cdot \\alpha(N))$ time, where $\\alpha(N) \\le 4$ is the inverse Ackermann function for all physically conceivable inputs ($N &lt; 2^{65536}$).</p>",
    content: `<div class="lesson-content">
      <h2>Tree Height Invariants &amp; The Inverse Ackermann Bound</h2>
      <p>A Disjoint Set Union (DSU) forest represents each set as a rooted tree where every node $x$ stores a parent pointer $\\text{parent}[x]$, and the root $r$ of a set satisfies $\\text{parent}[r] = r$ (or $\\text{parent}[r] &lt; 0$ in the negative-size encoding).</p>

      <div class="invariant-box">
        <div class="box-title">Formal Theorem — Rank Subtree Bound &amp; Tarjan-Seidel Amortized Bound</div>
        <p><strong>Lemma (Rank Exponential Size Invariant):</strong> Under Union by Rank (without or with path compression), a node $x$ of rank $k$ is the root of a subtree containing at least $2^k$ nodes. Consequently, the maximum rank (and tree height) in an $N$-element DSU forest is bounded by:</p>
        $$\\text{rank}(x) \\le \\lfloor \\log_2 N \\rfloor$$
        <p><strong>Theorem (Tarjan 1975, Fredman &amp; Saks 1989):</strong> With both Union by Rank/Size and Path Compression ($\text{parent}[x] \leftarrow \text{find}(\text{parent}[x])$), any intermixed sequence of $N$ $\\text{MAKE-SET}$ and $M$ $\\text{UNION}/\\text{FIND}$ operations takes $\\Theta(N + M \\alpha(M, N))$ time, and this bound is tight in the cell-probe model.</p>
      </div>

      <h3>Why $\\alpha(N)$ Arises: Rank Buckets &amp; Ackermann Tower Collapse</h3>
      <p>Why isn't the amortized cost $O(1)$ or $O(\\log^* N)$? Consider what happens when <code>find(x)</code> traverses a path $x = v_0 \\to v_1 \\to \\dots \\to r$. Path compression rewires $v_0, v_1, \\dots$ to point directly to the root $r$. Notice that along any upward path, node ranks strictly increase: $\\text{rank}(v_0) &lt; \\text{rank}(v_1) &lt; \\dots &lt; \\text{rank}(r)$.</p>
      <p>Every time <code>find</code> traverses an edge $(u, p)$ that is <em>not</em> the last edge into the root, $\\text{rank}(\\text{parent}[u])$ strictly increases to $\\text{rank}(r)$. Using a potential function grouped by levels of the Ackermann hierarchy $A_k(j)$ (where $A_0(j) = j+1$, $A_1(j) = 2j+1$, $A_2(j) = 2^{j+1}$, $A_3(j) = \\text{tower of } 2\\text{s}$), charging a traversal step to the level $k$ where $\\text{rank}(\\text{parent}[u]) \\ge A_k(\\text{rank}(u))$ proves that each node can pay for at most $O(\\alpha(N))$ non-terminal pointer hops across its entire lifetime!</p>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 185" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="175" y="25" fill="#f59e0b" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Before find(4): Path of Length 3</text>
          <text x="525" y="25" fill="#34d399" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">After find(4): Path Compressed to Root 0</text>
          <!-- Before -->
          <circle cx="175" cy="55" r="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="175" y="59" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">0</text>
          <circle cx="130" cy="95" r="15" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="130" y="99" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">1</text>
          <circle cx="220" cy="95" r="15" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
          <text x="220" y="99" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">2</text>
          <circle cx="220" cy="135" r="15" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
          <text x="220" y="139" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">3</text>
          <circle cx="220" cy="170" r="14" fill="#1e293b" stroke="#f87171" stroke-width="2"/>
          <text x="220" y="174" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">4</text>
          <line x1="142" y1="84" x2="163" y2="66" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="208" y1="84" x2="187" y2="66" stroke="#f59e0b" stroke-width="2"/>
          <line x1="220" y1="120" x2="220" y2="110" stroke="#f59e0b" stroke-width="2"/>
          <line x1="220" y1="156" x2="220" y2="150" stroke="#f87171" stroke-width="2"/>

          <line x1="350" y1="15" x2="350" y2="175" stroke="#334155" stroke-dasharray="4,4"/>

          <!-- After -->
          <circle cx="525" cy="55" r="18" fill="#064e3b" stroke="#34d399" stroke-width="2.5"/>
          <text x="525" y="59" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">0</text>
          <circle cx="435" cy="135" r="16" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="435" y="139" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">1</text>
          <circle cx="495" cy="135" r="16" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="495" y="139" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">2</text>
          <circle cx="555" cy="135" r="16" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="555" y="139" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">3</text>
          <circle cx="615" cy="135" r="16" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="615" y="139" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">4</text>
          <line x1="445" y1="122" x2="512" y2="69" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="500" y1="120" x2="520" y2="73" stroke="#34d399" stroke-width="2"/>
          <line x1="550" y1="120" x2="530" y2="73" stroke="#34d399" stroke-width="2"/>
          <line x1="605" y1="122" x2="538" y2="69" stroke="#34d399" stroke-width="2"/>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Find["find(x): trace ancestors to root r"] --> Compress["Rewire every visited node u: parent[u] = r"]
        Compress --> Union["union(a, b): ra = find(a), rb = find(b)"]
        Union --> Same{"ra == rb?"}
        Same -- "Yes" --> Noop["Already in same component (return false)"]
        Same -- "No" --> Attach["Attach smaller rank/size root under larger root"]
      </div>

      <div class="simulator-mount" data-sim="sim-dsu-rollback-timeline"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Single-Array Negative-Size Encoding &amp; Path Halving</div>
        <p>Instead of allocating two vectors <code>parent[N]</code> and <code>size[N]</code> ($8N$ bytes across two cache streams), production C++ DSU implementations use a <strong>single signed array</strong> <code>p[N]</code> ($4N$ bytes) initialized to <code>-1</code>: if <code>p[x] &lt; 0</code>, $x$ is a root of size <code>-p[x]</code>; if <code>p[x] &gt;= 0</code>, <code>p[x]</code> is $x$'s parent index. Furthermore, iterative <strong>Path Halving</strong> (<code>while (p[x] &gt;= 0 &amp;&amp; p[p[x]] &gt;= 0) { p[x] = p[p[x]]; x = p[x]; }</code>) achieves the exact same $O(\\alpha(N))$ amortized bound in a single top-free upward pass without function-call recursion!</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Heuristic Combination</th>
            <th>Worst-Case Single Op</th>
            <th>Amortized per Op ($M$ ops)</th>
            <th>Space Overhead</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Naive Tree (No Heuristics)</strong></td>
            <td><span class="badge-on">O(N)</span></td>
            <td><span class="badge-on">O(N)</span></td>
            <td><span class="badge-on">4N bytes</span></td>
          </tr>
          <tr>
            <td><strong>Union by Size/Rank Only</strong></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-on">4N bytes</span></td>
          </tr>
          <tr>
            <td><strong>Path Compression Only</strong></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-on">4N bytes</span></td>
          </tr>
          <tr>
            <td><strong>Union by Size + Path Compression / Halving</strong></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-o1">O(α(N)) ≈ O(1)</span></td>
            <td><span class="badge-on">4N bytes</span></td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Single-Array Signed DSU with Path Compression</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;utility&gt;

class DisjointSetUnion {
public:
    explicit DisjointSetUnion(int n) : parentOrNegSize(n, -1), numComponents(n) {}

    int find(int x) noexcept {
        int root = x;
        while (parentOrNegSize[root] &gt;= 0) {
            root = parentOrNegSize[root];
        }
        while (x != root) {
            int next = parentOrNegSize[x];
            parentOrNegSize[x] = root;
            x = next;
        }
        return root;
    }

    bool unite(int a, int b) noexcept {
        a = find(a);
        b = find(b);
        if (a == b) return false;
        // Remember: more negative means LARGER component size!
        if (parentOrNegSize[a] &gt; parentOrNegSize[b]) {
            std::swap(a, b);
        }
        parentOrNegSize[a] += parentOrNegSize[b];
        parentOrNegSize[b] = a;
        --numComponents;
        return true;
    }

    bool connected(int a, int b) noexcept { return find(a) == find(b); }
    int componentSize(int x) noexcept { return -parentOrNegSize[find(x)]; }
    int components() const noexcept { return numComponents; }

private:
    std::vector&lt;int&gt; parentOrNegSize;
    int numComponents;
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Updating Rank by Subtree Height During Path Compression</div>
        <p>In Union by Rank, <code>rank[r]</code> is an <em>upper bound</em> on height, not the exact height after path compression (since recomputing exact subtree height after compressing paths would cost $O(N)$). Moreover, only increments <code>rank[ra]++</code> when merging two trees of <strong>equal</strong> rank; if using Union by Size, always add <code>size[ra] += size[rb]</code> on every merge.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Combining Union by Rank/Size with Path Compression (or Path Halving) achieves O(alpha(N)) amortized time per operation, where alpha(N) <= 4 for all N < 2^65536.",
      "Without path compression, Union by Size guarantees that every tree has depth at most floor(log_2 N) because every step up a tree at least doubles the subtree size.",
      "Encoding both parent indices (>= 0) and negated component sizes (< 0) in a single int32 array cuts memory usage in half (4N bytes) and eliminates dual-array cache misses.",
      "Using Path Compression alone without Union by Rank/Size still allows O(log N) amortized sequences; both heuristics are required for O(alpha(N))."
    ],
    furtherReading: [
      { title: "Tarjan, R. E. (1975) — Efficiency of a Good But Not Linear Set Union Algorithm", url: "https://doi.org/10.1145/321879.321884" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 19: Data Structures for Disjoint Sets", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "CP-Algorithms — Disjoint Set Union", url: "https://cp-algorithms.com/data_structures/disjoint_set_union.html" }
    ]
  },

  "dsu-rollback-weighted-offline": {
    title: "Weighted DSU (Potentials/Parity) & Rollback DSU for Dynamic Connectivity Over Time",
    video: {
      youtubeId: "vq5u09x2Kzo",
      id: "vq5u09x2Kzo",
      url: "https://www.youtube.com/embed/vq5u09x2Kzo",
      title: "Algorithms & Data Structures: Disjoint Set Union (Union-Find, Rank & Rollback)",
      channel: "Pavel Mavrin",
      duration: "1:24:10",
      start: 0,
      length: "84m",
      why: "Builds on union-find fundamentals to support group potential maintenance along edges and undo stacks."
    },
    intuition: "<p>Standard Union-Find only answers a boolean question: <em>Are $u$ and $v$ in the same component?</em> By augmenting each parent pointer with an abelian group weight (such as $\\mathbb{Z}_2$ parity for online bipartite checking or $(\\mathbb{Z}, +)$ for relative potentials $x_u - x_v = w$), a <strong>Weighted DSU</strong> maintains exact algebraic relationships across dynamic edge insertions in $O(\\alpha(N))$ time.</p><p>What if edges can also be <strong>deleted</strong>? Because path compression destroys historical tree structure, standard DSU cannot undo merges. By omitting path compression, keeping <strong>Union by Size ($O(\\log N)$ depth)</strong>, and logging every root attachment on an undo stack, a <strong>Rollback DSU</strong> combined with a Segment Tree over Time solves general Offline Dynamic Connectivity in $O((M + Q) \\log Q \\log N)$ time.</p>",
    content: `<div class="lesson-content">
      <h2>1. Weighted DSU: Path-Compressed Group Potentials</h2>
      <p>Suppose each edge $(u, v)$ imposes a constraint $\\phi(u) - \\phi(v) = w$ in an abelian group $(G, +)$ (or $\\phi(u) \\oplus \\phi(v) = 1$ for 2-coloring / bipartiteness). In a Weighted DSU, every node $x$ stores $\\text{diff}[x]$, defined as the group difference between $x$ and its immediate parent $\\text{parent}[x]$:</p>
      $$\\text{diff}[x] = \\phi(x) - \\phi(\\text{parent}[x])$$

      <div class="invariant-box">
        <div class="box-title">Formal Invariant — Telescope Potential Compression &amp; Union Splicing</div>
        <p>For any node $x$ with root $r$, the potential of $x$ relative to $r$ is the telescoping sum along the upward path $x = v_0 \\to v_1 \\to \\dots \\to v_k = r$:</p>
        $$\\phi(x) - \\phi(r) = \\sum_{i=0}^{k-1} \\text{diff}[v_i]$$
        <p>When path compression rewires $x$ directly to $r$, we first recursively compress $\\text{parent}[x]$ (so $\\text{diff}[\\text{parent}[x]] = \\phi(\\text{parent}[x]) - \\phi(r)$) and then update $\\text{diff}[x] \\leftarrow \\text{diff}[x] + \\text{diff}[\\text{parent}[x]]$ before setting $\\text{parent}[x] = r$.</p>
        <p>When merging two components to enforce $\\phi(u) - \\phi(v) = w$ where $r_u = \\text{find}(u)$ and $r_v = \\text{find}(v)$, attaching $r_u$ as a child of $r_v$ sets:</p>
        $$\\text{diff}[r_u] = w + \\text{diff}[v] - \\text{diff}[u]$$
      </div>

      <h3>2. Rollback DSU &amp; Segment Tree Over Time (Offline Dynamic Connectivity)</h3>
      <p>Why must Rollback DSU <strong>disable path compression</strong>? A single <code>find(x)</code> with path compression can modify $O(\\log N)$ parent pointers, and undoing all of them would require $O(\\log N)$ space per query while losing the amortized bound anyway under repeated undo/redo cycles. Using <strong>Union by Size without path compression</strong> guarantees:</p>
      <ul>
        <li>Every <code>find(x)</code> is a read-only $O(\\log N)$ walk up the tree.</li>
        <li>Every <code>unite(a, b)</code> mutates <strong>at most two array slots</strong> (<code>parent[rb] = ra</code> and <code>size[ra] += size[rb]</code>), which can be pushed onto a history stack and rolled back in strict $O(1)$ time!</li>
      </ul>
      <p>To handle arbitrary edge additions and deletions over time steps $t \\in [0, Q-1]$, each edge $e$ is active on one or more time intervals $[l, r]$. Inserting each interval into a <strong>Segment Tree over Time</strong> splits $[l, r]$ into $O(\\log Q)$ segment tree nodes. A single DFS over the segment tree applies <code>dsu.unite(u, v)</code> upon entering a node and calls <code>dsu.rollback(checkpoint)</code> upon exiting!</p>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 190" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Weighted DSU Union Splicing vs. Segment Tree Over Time Rollback</text>
          <!-- Left: Weighted DSU -->
          <g transform="translate(30, 45)">
            <rect x="0" y="0" width="300" height="125" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" rx="6"/>
            <text x="150" y="20" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">Weighted Union: φ(u) - φ(v) = w</text>
            <circle cx="75" cy="52" r="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="75" y="56" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">r_u</text>
            <circle cx="215" cy="52" r="14" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
            <text x="215" y="56" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">r_v</text>
            <circle cx="75" cy="105" r="13" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="75" y="109" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">u</text>
            <circle cx="215" cy="105" r="13" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="215" y="109" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">v</text>
            <line x1="75" y1="92" x2="75" y2="66" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="42" y="83" fill="#94a3b8" font-family="monospace" font-size="10">diff[u]</text>
            <line x1="215" y1="92" x2="215" y2="66" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="245" y="83" fill="#94a3b8" font-family="monospace" font-size="10">diff[v]</text>
            <line x1="89" y1="52" x2="201" y2="52" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,2"/>
            <text x="145" y="43" fill="#f59e0b" font-family="monospace" font-size="10" text-anchor="middle">w + diff[v] - diff[u]</text>
          </g>
          <!-- Right: Rollback Stack -->
          <g transform="translate(365, 45)">
            <rect x="0" y="0" width="305" height="125" fill="#0f172a" stroke="#34d399" stroke-width="1.5" rx="6"/>
            <text x="152" y="20" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">Rollback DSU + Time Segment Tree</text>
            <text x="15" y="48" fill="#cbd5e1" font-family="monospace" font-size="11">1. Enter SegTree node: save snapshot()</text>
            <text x="15" y="70" fill="#34d399" font-family="monospace" font-size="11">2. Apply node's edges via unite(u, v)</text>
            <text x="15" y="92" fill="#38bdf8" font-family="monospace" font-size="11">3. Recurse Left &amp; Right (or answer leaf)</text>
            <text x="15" y="114" fill="#f59e0b" font-family="monospace" font-size="11">4. Exit node: rollback(snapshot) in O(1)/op</text>
          </g>
        </svg>
      </div>

      <div class="mermaid">
      flowchart TD
        Enter["Enter Segment Tree Node [L, R]"] --> Snap["int snap = dsu.snapshot()"]
        Snap --> Apply["For each edge (u, v) covering [L, R]: dsu.unite(u, v)"]
        Apply --> Leaf{"L == R?"}
        Leaf -- "Yes" --> Ans["Record answer for query at time L"]
        Leaf -- "No" --> Rec["DFS Left [L, M], then DFS Right [M+1, R]"]
        Ans --> Roll["dsu.rollback(snap)"]
        Rec --> Roll
      </div>

      <div class="simulator-mount" data-sim="sim-dsu-rollback-timeline"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Flat Undo Log vs. Persistent Functional Trees</div>
        <p>A persistent DSU built on a path-copied functional treap or rope allocates $O(\\log N)$ heap nodes per union. A Rollback DSU stores a flat <code>std::vector< pair<int, int> > history</code> where each successful merge pushes <code>(childRoot, oldParentOrNegSizeOfChild)</code> and restores both the parent and size in 4 instructions on pop.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>DSU Variant</th>
            <th><code>find(x)</code></th>
            <th><code>unite(u, v)</code></th>
            <th><code>rollback()</code></th>
            <th>Primary Use Case</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Weighted DSU (with Compression)</strong></td>
            <td><span class="badge-o1">O(α(N))</span></td>
            <td><span class="badge-o1">O(α(N))</span></td>
            <td>Unsupported</td>
            <td>Online Bipartite / Difference Constraints</td>
          </tr>
          <tr>
            <td><strong>Rollback DSU (Union by Size Only)</strong></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-o1">O(1)</span> per undo</td>
            <td>LIFO Undo / Mo's Algorithm on Graphs</td>
          </tr>
          <tr>
            <td><strong>SegTree Over Time + Rollback DSU</strong></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-onlogn">O(log Q log N)</span></td>
            <td><span class="badge-o1">O(1)</span> per node exit</td>
            <td>Offline Dynamic Connectivity (Add + Delete)</td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Rollback DSU &amp; Weighted Potential DSU</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;utility&gt;

class RollbackDSU {
public:
    explicit RollbackDSU(int n) : p(n, -1), comps(n) {}

    int find(int x) const noexcept {
        while (p[x] &gt;= 0) x = p[x];
        return x;
    }

    bool unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) return false;
        if (p[a] &gt; p[b]) std::swap(a, b); // p[a] is more negative (larger size)
        history.emplace_back(b, p[b]);
        p[a] += p[b];
        p[b] = a;
        --comps;
        return true;
    }

    size_t snapshot() const noexcept { return history.size(); }

    void rollback(size_t targetSize) noexcept {
        while (history.size() &gt; targetSize) {
            auto [b, oldNegSizeB] = history.back();
            history.pop_back();
            int a = p[b];
            p[a] -= oldNegSizeB;
            p[b] = oldNegSizeB;
            ++comps;
        }
    }

    int components() const noexcept { return comps; }

private:
    std::vector&lt;int&gt; p;
    std::vector&lt;std::pair&lt;int, int&gt;&gt; history;
    int comps;
};

class WeightedDSU {
public:
    explicit WeightedDSU(int n) : parent(n, -1), diff(n, 0) {}

    // Returns (root, phi(x) - phi(root))
    std::pair&lt;int, long long&gt; find(int x) {
        if (parent[x] &lt; 0) return {x, 0};
        auto [r, dParent] = find(parent[x]);
        parent[x] = r;
        diff[x] += dParent;
        return {r, diff[x]};
    }

    // Enforces phi(u) - phi(v) == w. Returns false if inconsistent with existing component!
    bool unite(int u, int v, long long w) {
        auto [ru, du] = find(u);
        auto [rv, dv] = find(v);
        if (ru == rv) return (du - dv) == w;
        if (parent[ru] &gt; parent[rv]) {
            parent[rv] += parent[ru];
            parent[ru] = rv;
            diff[ru] = w + dv - du;
        } else {
            parent[ru] += parent[rv];
            parent[rv] = ru;
            diff[rv] = du - dv - w;
        }
        return true;
    }

private:
    std::vector&lt;int&gt; parent;
    std::vector&lt;long long&gt; diff;
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Non-LIFO Undo Attempts &amp; Unclosed Edge Intervals</div>
        <p>A Rollback DSU stack only supports <strong>LIFO (stack-ordered)</strong> rollbacks; if edge $e_1$ is added before $e_2$, you cannot delete $e_1$ while keeping $e_2$ without the Segment Tree over Time wrapper! Also, when building the Segment Tree over Time, remember to close all edges still present at the end of the query stream with right endpoint $R = Q - 1$.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Weighted DSU stores diff[x] = phi(x) - phi(parent[x]) and accumulates telescoping sums during path compression to maintain group potentials or bipartite parity in O(alpha(N)) time.",
      "Rollback DSU disables path compression and relies exclusively on Union by Size so that find(x) is O(log N) read-only and unite(u, v) mutates only 2 integers.",
      "Restoring a Rollback DSU to any prior snapshot pops the history stack in O(1) per rolled-back union.",
      "Splitting each edge's active lifespan [L, R] across a Segment Tree over Time turns arbitrary edge additions and deletions into nested LIFO scopes solvable in O((M + Q) log Q log N)."
    ],
    furtherReading: [
      { title: "CP-Algorithms — Deleting from a data structure in O(T(n) log n) (Dynamic Connectivity)", url: "https://cp-algorithms.com/data_structures/deleting_in_log_n.html" },
      { title: "CP-Algorithms — Disjoint Set Union (Weighted / Bipartite Parity)", url: "https://cp-algorithms.com/data_structures/disjoint_set_union.html" },
      { title: "Tarjan, R. E. (1983) — Data Structures and Network Algorithms (SIAM)", url: "https://doi.org/10.1137/1.9781611970265" }
    ]
  },

  "mst-cut-cycle-properties": {
    title: "Minimum Spanning Trees: Cut & Cycle Optimality Properties, Kruskal's, Prim's & Borůvka's",
    video: {
      youtubeId: "jsmMtJpPnhU",
      title: "Minimum Spanning Tree Algorithms (Kruskal's & Prim's)",
      channel: "William Fiset",
      duration: "20:10",
      length: "20:10",
      start: 0,
      why: "Explains the Cut and Cycle optimality properties and contrasts edge-centric Kruskal's with vertex-centric Prim's."
    },
    intuition: "<p>Given a connected, undirected, weighted graph $G = (V, E, w)$, a <strong>Minimum Spanning Tree (MST)</strong> is an acyclic subset of $|V| - 1$ edges connecting all vertices with minimum total weight $\\sum_{e \\in T} w(e)$. Remarkably, all classic MST algorithms—<strong>Kruskal's (1956)</strong>, <strong>Prim's (1957 / Jarník 1930)</strong>, and <strong>Borůvka's (1926)</strong>—are manifestations of two dual greedy rules: the <strong>Cut Property</strong> (inclusion) and the <strong>Cycle Property</strong> (exclusion).</p><p>Understanding both properties not only proves why greedy MST algorithms work, but also solves bottleneck path queries (minimax path along MST edges) and implicit/XOR MST problems where Borůvka's $O(\\log V)$ parallel rounds shine.</p>",
    content: `<div class="lesson-content">
      <h2>The Two Fundamental MST Optimality Laws</h2>
      <p>Robert Tarjan termed these the <strong>Blue Rule</strong> (Cut Property) and <strong>Red Rule</strong> (Cycle Property): applying them in any order colors exactly $|V| - 1$ edges Blue (in the MST).</p>

      <div class="invariant-box">
        <div class="box-title">Formal Theorems — Cut Property &amp; Cycle Property</div>
        <ol>
          <li><strong>Cut Property (Inclusion):</strong> Let $S \\subset V$ ($\\emptyset \\neq S \\neq V$) be any cut of $G$, and let $e = (u, v)$ with $u \\in S, v \\in V \\setminus S$ be a strictly minimum-weight edge crossing the cut $(S, V \\setminus S)$. Then $e$ belongs to <strong>every</strong> MST of $G$ (if ties exist, $e$ belongs to <em>some</em> MST).<br/>
          <em>Exchange Proof:</em> Suppose an MST $T$ omits $e$. Adding $e$ to $T$ creates a unique fundamental cycle $C$ that must cross the cut $(S, V \\setminus S)$ at least one other time via some edge $e' \\in T$ with $w(e') \\ge w(e)$. Replacing $e'$ with $e$ yields a spanning tree $T' = T \\setminus \\{e'\\} \\cup \\{e\\}$ with $w(T') = w(T) + w(e) - w(e') \\le w(T)$.</li>
          <li><strong>Cycle Property (Exclusion):</strong> Let $C$ be any simple cycle in $G$, and let $e_{\\max} \\in C$ be a strictly maximum-weight edge on $C$. Then $e_{\\max}$ cannot belong to <strong>any</strong> MST of $G$.</li>
          <li><strong>Minimax Path Corollary:</strong> For any two vertices $x, y \\in V$, the unique path between $x$ and $y$ inside an MST $T$ minimizes the maximum edge weight $\\max_{e \\in P} w(e)$ over all paths $P$ in $G$.</li>
        </ol>
      </div>

      <h3>Comparing Kruskal's, Prim's, and Borůvka's Algorithms</h3>
      <ul>
        <li><strong>Kruskal's Algorithm ($O(E \\log E)$):</strong> Sorts all edges by weight and adds $e = (u, v)$ if $\\text{dsu.unite}(u, v)$ succeeds. When $e$ connects components $C_u$ and $C_v$, $e$ is the lightest edge crossing the cut $(C_u, V \\setminus C_u)$. Ideal for sparse graphs where edges are already in a flat buffer.</li>
        <li><strong>Prim's Algorithm ($O(E \\log V)$ or $O(V^2)$):</strong> Grows a single component $S$ starting from root $0$, repeatedly extracting the lightest edge crossing $(S, V \\setminus S)$. On dense graphs ($E \\approx V^2$), an array-based Prim without a heap runs in optimal $O(V^2)$ time (beating $O(V^2 \\log V)$ binary heaps!).</li>
        <li><strong>Borůvka's Algorithm ($O(E \\log V)$ in $\\le \\lceil \\log_2 V \\rceil$ rounds):</strong> In each round, every current component simultaneously selects its cheapest outgoing edge and merges. Because every active component merges with at least one neighbor, the number of components at least halves each round ($\\le \\log_2 V$ rounds). Essential for parallel/GPU MST and implicit graphs (e.g., finding the MST where $w(u, v) = a_u \\oplus a_v$ using a binary Trie).</li>
      </ul>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 185" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Cut Exchange Argument: Adding e = (u, v) &amp; Removing e' on Cut (S, V \ S)</text>
          <!-- Cut S -->
          <ellipse cx="170" cy="110" rx="110" ry="60" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="5,3"/>
          <text x="95" y="75" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">Cut S</text>
          <!-- Cut V \ S -->
          <ellipse cx="480" cy="110" rx="110" ry="60" fill="#0f172a" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
          <text x="530" y="75" fill="#94a3b8" font-family="monospace" font-size="12" font-weight="bold">V \ S</text>

          <!-- Nodes -->
          <circle cx="220" cy="85" r="15" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="220" y="89" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">u</text>
          <circle cx="430" cy="85" r="15" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="430" y="89" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">v</text>
          <circle cx="220" cy="138" r="15" fill="#1e293b" stroke="#f87171" stroke-width="2"/>
          <text x="220" y="142" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">x</text>
          <circle cx="430" cy="138" r="15" fill="#1e293b" stroke="#f87171" stroke-width="2"/>
          <text x="430" y="142" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">y</text>

          <!-- Edges -->
          <line x1="235" y1="85" x2="415" y2="85" stroke="#34d399" stroke-width="3"/>
          <text x="325" y="76" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">e (min cut weight = 3)</text>
          <line x1="235" y1="138" x2="415" y2="138" stroke="#f87171" stroke-width="2.5" stroke-dasharray="4,3"/>
          <text x="325" y="156" fill="#f87171" font-family="monospace" font-size="11" text-anchor="middle">e' in T (weight = 9 &ge; 3)</text>
          <path d="M 205 85 Q 150 111 205 138" fill="none" stroke="#cbd5e1" stroke-width="2"/>
          <path d="M 445 85 Q 500 111 445 138" fill="none" stroke="#cbd5e1" stroke-width="2"/>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Graph["Weighted Undirected Graph G=(V,E)"] --> Density{"Dense (E ≈ V²)?"}
        Density -- "Yes" --> PrimArr["Array-Based Prim: O(V²) time, O(V) space"]
        Density -- "No (Sparse)" --> Implicit{"Implicit / Parallel?"}
        Implicit -- "No" --> Krusk["Kruskal + DSU: O(E log E)"]
        Implicit -- "Yes" --> Boruvka["Borůvka: <= log₂(V) rounds of cheapest component exits"]
      </div>

      <div class="simulator-mount" data-sim="sim-kruskal-dsu-mst"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Why Kruskal Beats Heap-Prim on Sparse Graphs</div>
        <p>Although Prim's $O(E \\log V)$ looks asymptotically equivalent to Kruskal's $O(E \\log E)$, Kruskal spends $90\\%$ of its runtime inside <code>std::sort</code> (Introsort / PDQSort) over a contiguous array of 12-byte <code>{w, u, v}</code> structs—maximizing L1 cache hits and SIMD-friendly comparisons—followed by a sequential scan with $O(1)$-cached DSU lookups, terminating early as soon as $V - 1$ edges are added.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Time Complexity</th>
            <th>Auxiliary Space</th>
            <th>Optimal Regime</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Kruskal's (Sort + DSU)</strong></td>
            <td><span class="badge-onlogn">O(E log E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
            <td>Sparse graphs ($E = O(V)$), edge lists</td>
          </tr>
          <tr>
            <td><strong>Prim's (Binary Heap)</strong></td>
            <td><span class="badge-onlogn">O(E log V)</span></td>
            <td><span class="badge-on">O(V)</span></td>
            <td>Adjacency list graphs</td>
          </tr>
          <tr>
            <td><strong>Prim's (Flat Array, No Heap)</strong></td>
            <td><span class="badge-on2">O(V²)</span></td>
            <td><span class="badge-on">O(V)</span></td>
            <td>Dense / geometric graphs ($E = \\Theta(V^2)$)</td>
          </tr>
          <tr>
            <td><strong>Borůvka's Algorithm</strong></td>
            <td><span class="badge-onlogn">O(E log V)</span></td>
            <td><span class="badge-on">O(V)</span></td>
            <td>Parallel / GPU &amp; implicit/XOR edge weights</td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Kruskal's MST &amp; Dense $O(V^2)$ Prim's MST</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;limits&gt;

struct WeightedEdge {
    int u, v;
    long long weight;
    bool operator&lt;(const WeightedEdge&amp; other) const noexcept {
        return weight &lt; other.weight;
    }
};

// Returns (totalMSTWeight, selectedEdges). If disconnected, selectedEdges.size() &lt; n - 1.
std::pair&lt;long long, std::vector&lt;WeightedEdge&gt;&gt; kruskalMST(int n, std::vector&lt;WeightedEdge&gt; edges) {
    std::sort(edges.begin(), edges.end());
    std::vector&lt;int&gt; p(n, -1);
    auto find = [&amp;](int x) {
        int r = x;
        while (p[r] &gt;= 0) r = p[r];
        while (x != r) { int nxt = p[x]; p[x] = r; x = nxt; }
        return r;
    };

    long long totalWeight = 0;
    std::vector&lt;WeightedEdge&gt; mst;
    mst.reserve(n &gt; 0 ? n - 1 : 0);

    for (const auto&amp; e : edges) {
        int ru = find(e.u), rv = find(e.v);
        if (ru != rv) {
            if (p[ru] &gt; p[rv]) std::swap(ru, rv);
            p[ru] += p[rv];
            p[rv] = ru;
            totalWeight += e.weight;
            mst.push_back(e);
            if (static_cast&lt;int&gt;(mst.size()) == n - 1) break;
        }
    }
    return {totalWeight, mst};
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Tie-Breaking CycleCreation in Parallel Borůvka Rounds</div>
        <p>If a graph has duplicate edge weights (e.g., a triangle $A-B-C$ where all three edges have weight $5$), and in a Borůvka round component $A$ picks $(A, B)$, $B$ picks $(B, C)$, and $C$ picks $(C, A)$, adding all three simultaneously creates a cycle! Always break weight ties deterministically using the lexicographical tuple <code>(weight, min(u, v), max(u, v))</code> so all edge weights become strictly distinct.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "The Cut Property proves that the strictly lightest edge crossing any cut (S, V \\ S) belongs to every MST; the Cycle Property proves the strictly heaviest edge on any cycle belongs to no MST.",
      "Every MST is automatically a Minimum Bottleneck Spanning Tree: the unique tree path between u and v minimizes the maximum edge weight along the path.",
      "Kruskal's O(E log E) algorithm excels on sparse edge lists due to cache-local sorting and O(alpha(V)) DSU merges, while heapless O(V^2) Prim's is optimal for dense graphs.",
      "Borůvka's algorithm halves the number of connected components in each of at most ceil(log_2 V) rounds, making it ideal for parallel execution and implicit XOR/geometric edge weights."
    ],
    furtherReading: [
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 21: Minimum Spanning Trees", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "Tarjan, R. E. (1983) — Data Structures and Network Algorithms, Ch. 6: Minimum Spanning Trees", url: "https://doi.org/10.1137/1.9781611970265" },
      { title: "Sedgewick & Wayne — Algorithms (4th Ed.), Section 4.3: Minimum Spanning Trees", url: "https://algs4.cs.princeton.edu/43mst/" }
    ]
  },

  "dijkstra-relaxation-invariants": {
    title: "Dijkstra's Algorithm: Non-Negative Edge Invariant, Priority Queue Tradeoffs & Dial's Bucket Queue",
    video: {
      youtubeId: "pSqmAO-m7Lk",
      title: "Dijkstra's Shortest Path Algorithm — Graph Theory",
      channel: "William Fiset",
      duration: "24:42",
      length: "24:42",
      start: 0,
      why: "Covers greedy frontier expansion, lazy duplicate deletion in priority queues, and why negative weights violate the settled invariant."
    },
    intuition: "<p>Edsger Dijkstra conceived his shortest-path algorithm in twenty minutes at a café table in Amsterdam in 1956. By maintaining a growing set $S$ of <strong>settled vertices</strong> whose true shortest-path distances $\\delta(s, u)$ are known, and greedily extracting the unsettled vertex $u \\notin S$ with the minimum tentative distance $d[u]$, Dijkstra's algorithm solves single-source shortest paths in $O((V + E) \\log V)$ time—provided every edge weight is non-negative ($w(e) \\ge 0$).</p><p>In high-performance engineering, textbook Fibonacci heaps ($O(E + V \\log V)$) are almost universally slower than cache-resident <strong>4-ary heaps with lazy insertion</strong>, or <strong>Dial's Bucket Queue / Radix Heap</strong> when edge weights are bounded integers.</p>",
    content: `<div class="lesson-content">
      <h2>The Non-Negative Edge Greedy Settlement Proof</h2>
      <p>Why does the vertex $u \\in V \\setminus S$ with the minimum tentative distance $d[u]$ have $d[u] == \\delta(s, u)$ (the true global shortest path distance) at the exact moment it is popped from the priority queue?</p>

      <div class="invariant-box">
        <div class="box-title">Formal Proof — Dijkstra's Settled Set Inductive Invariant</div>
        <p><strong>Theorem (CLRS Theorem 22.6):</strong> If $w(e) \\ge 0$ for all $e \\in E$, then whenever Dijkstra's algorithm extracts $u = \\arg\\min_{x \\in V \\setminus S} d[x]$ and adds $u$ to $S$, we have $d[u] = \\delta(s, u)$.</p>
        <p><em>Proof by Contradiction:</em> Suppose $u$ is the first vertex added to $S$ for which $d[u] &gt; \\delta(s, u)$. Consider an actual shortest path $P: s \\leadsto u$. Since $s \\in S$ and $u \\notin S$, let $(x, y)$ be the first edge along $P$ that crosses the cut $(S, V \\setminus S)$, so $x \\in S$ and $y \\in V \\setminus S$.<br/>
        By the inductive hypothesis, when $x$ was settled, $d[x] = \\delta(s, x)$, and relaxing $(x, y)$ set $d[y] \\le d[x] + w(x, y) = \\delta(s, y)$. Because the subpath $y \\leadsto u$ along $P$ consists entirely of edges with <strong>non-negative weights</strong> ($w \\ge 0$), we have:</p>
        $$d[y] = \\delta(s, y) \\le \\delta(s, u) &lt; d[u]$$
        <p>Wait: $y \\in V \\setminus S$ and $d[y] &lt; d[u]$, contradicting that $u$ was chosen as the minimum $d[\\cdot]$ in $V \\setminus S$! Notice where the proof breaks if a negative edge exists: $\\delta(s, y) \\le \\delta(s, u)$ fails if the remaining suffix $y \\leadsto u$ has negative total weight.</p>
      </div>

      <h3>1. Lazy Duplicate Insertion vs. <code>decrease-key</code></h3>
      <p>Standard C++ <code>std::priority_queue</code> and Python <code>heapq</code> do not expose a <code>decrease_key</code> handle. Instead, whenever an edge relaxation improves $d[v]$, we push a new pair <code>(d[v], v)</code> into the heap. When a pair <code>(d_popped, u)</code> is later extracted, we check <code>if (d_popped &gt; d[u]) continue;</code> in $O(1)$ time—skipping stale entries in a single branch without maintaining an external index-to-heap-position map!</p>

      <h3>2. Dial's Algorithm (1969): $O(V \\cdot C + E)$ Bucket Queue</h3>
      <p>When all edge weights are small integers $w(e) \\in \\{0, 1, \\dots, C\\}$ (generalizing 0-1 BFS where $C = 1$), any tentative distance pushed when popping $d[u]$ lies in $[d[u], d[u] + C]$. Maintaining a circular array of $C + 1$ buckets (indexed by $\\text{dist} \\bmod (C + 1)$) eliminates the $\\log V$ heap factor completely, running in $O(V + E + \\text{maxDist}) \\le O(V \\cdot C + E)$ linear time.</p>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 185" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Dijkstra Cut Proof (x in S, y in V\S) &amp; Negative-Edge Counterexample</text>
          <!-- Left: Cut Proof -->
          <g transform="translate(25, 42)">
            <rect x="0" y="0" width="315" height="125" fill="#0f172a" stroke="#34d399" stroke-width="1.5" rx="6"/>
            <text x="157" y="20" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">Non-Negative Invariant: d[y] &le; δ(s, u) &lt; d[u]</text>
            <ellipse cx="85" cy="78" rx="65" ry="38" fill="#064e3b" stroke="#34d399" stroke-dasharray="3,2"/>
            <text x="45" y="55" fill="#34d399" font-family="monospace" font-size="10">Settled S</text>
            <circle cx="55" cy="82" r="12" fill="#1e293b" stroke="#f8fafc"/>
            <text x="55" y="86" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">s</text>
            <circle cx="115" cy="82" r="12" fill="#1e293b" stroke="#f8fafc"/>
            <text x="115" y="86" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">x</text>
            <circle cx="195" cy="82" r="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="195" y="86" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">y</text>
            <circle cx="275" cy="82" r="12" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
            <text x="275" y="86" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">u</text>
            <line x1="67" y1="82" x2="103" y2="82" stroke="#34d399" stroke-width="2"/>
            <line x1="127" y1="82" x2="183" y2="82" stroke="#38bdf8" stroke-width="2"/>
            <line x1="207" y1="82" x2="263" y2="82" stroke="#94a3b8" stroke-width="2" stroke-dasharray="3,3"/>
            <text x="235" y="72" fill="#94a3b8" font-family="monospace" font-size="10" text-anchor="middle">w &ge; 0</text>
          </g>
          <!-- Right: Negative Counterexample -->
          <g transform="translate(365, 42)">
            <rect x="0" y="0" width="310" height="125" fill="#1f1215" stroke="#f87171" stroke-width="1.5" rx="6"/>
            <text x="155" y="20" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">Negative Weight Trap (Even in a DAG!)</text>
            <circle cx="55" cy="85" r="14" fill="#1e293b" stroke="#f8fafc"/>
            <text x="55" y="89" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">s</text>
            <circle cx="160" cy="52" r="14" fill="#1e293b" stroke="#38bdf8"/>
            <text x="160" y="56" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">A</text>
            <circle cx="255" cy="85" r="14" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
            <text x="255" y="89" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">B</text>
            <line x1="68" y1="78" x2="146" y2="56" stroke="#94a3b8" stroke-width="2"/>
            <text x="100" y="58" fill="#cbd5e1" font-family="monospace" font-size="10">+5</text>
            <line x1="69" y1="85" x2="241" y2="85" stroke="#34d399" stroke-width="2"/>
            <text x="155" y="102" fill="#34d399" font-family="monospace" font-size="10">+2 (settled 1st!)</text>
            <line x1="173" y1="58" x2="242" y2="79" stroke="#f87171" stroke-width="2"/>
            <text x="220" y="58" fill="#f87171" font-family="monospace" font-size="10" font-weight="bold">-10</text>
            <text x="155" y="118" fill="#fca5a5" font-family="monospace" font-size="10" text-anchor="middle">B settled at d=2 before s&rarr;A&rarr;B (d=-5) explored</text>
          </g>
        </svg>
      </div>

      <div class="mermaid">
      flowchart TD
        Pop["Pop (d_popped, u) from Min-Heap"] --> Stale{"d_popped > dist[u]?"}
        Stale -- "Yes (Stale Duplicate)" --> Pop
        Stale -- "No (u Settled!)" --> Scan["For each outgoing edge (u, v, w)"]
        Scan --> Relax{"dist[u] + w < dist[v]?"}
        Relax -- "Yes" --> Push["dist[v] = dist[u] + w; pq.push({dist[v], v})"]
        Relax -- "No" --> Next["Continue"]
      </div>

      <div class="simulator-mount" data-sim="sim-dijkstra-astar-grid"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Why 4-ary Heaps Beat Fibonacci Heaps in Practice</div>
        <p>Although Fibonacci heaps achieve $O(1)$ amortized <code>decrease-key</code> and $O(E + V \\log V)$ total time, every node in a Fibonacci heap stores 4 pointers (<code>parent</code>, <code>child</code>, <code>left</code>, <code>right</code>), triggering pointer-chasing cache misses and high constant factors on <code>extract-min</code>. A contiguous array-backed <strong>4-ary (d-ary) heap</strong> places all 4 children of a node inside a single 64-byte cache line (for 16-byte <code>(dist, vertex)</code> pairs), halving heap height to $\\log_4 E$ and outperforming Fibonacci heaps by $3\\times$ to $8\\times$ on real road networks.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Priority Queue Structure</th>
            <th><code>extract-min</code></th>
            <th>Relaxation / <code>decrease-key</code></th>
            <th>Total Time Complexity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Flat Array Scan</strong></td>
            <td><span class="badge-on">O(V)</span></td>
            <td><span class="badge-o1">O(1)</span></td>
            <td><span class="badge-on2">O(V² + E) = O(V²)</span></td>
          </tr>
          <tr>
            <td><strong>Binary / 4-ary Heap (Lazy Push)</strong></td>
            <td><span class="badge-ologn">O(log E)</span></td>
            <td><span class="badge-ologn">O(log E)</span></td>
            <td><span class="badge-onlogn">O((V + E) log V)</span></td>
          </tr>
          <tr>
            <td><strong>Fibonacci Heap</strong></td>
            <td><span class="badge-ologn">O(log V)</span> amortized</td>
            <td><span class="badge-o1">O(1)</span> amortized</td>
            <td><span class="badge-onlogn">O(E + V log V)</span></td>
          </tr>
          <tr>
            <td><strong>Dial's Circular Buckets ($w \\le C$)</strong></td>
            <td><span class="badge-o1">O(1) + bucket scan</span></td>
            <td><span class="badge-o1">O(1)</span> list splice</td>
            <td><span class="badge-on">O(V · C + E)</span></td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Lazy-Deletion Dijkstra &amp; Dial's Bucket Queue</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;limits&gt;

struct WeightedArc {
    int to;
    long long weight;
};

std::vector&lt;long long&gt; dijkstra(int n, int source, const std::vector&lt;std::vector&lt;WeightedArc&gt;&gt;&amp; adj) {
    constexpr long long INF = std::numeric_limits&lt;long long&gt;::max() / 4;
    std::vector&lt;long long&gt; dist(n, INF);
    using State = std::pair&lt;long long, int&gt;;
    std::priority_queue&lt;State, std::vector&lt;State&gt;, std::greater&lt;State&gt;&gt; pq;

    dist[source] = 0;
    pq.emplace(0, source);

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d &gt; dist[u]) continue; // Critical lazy deletion guard!

        for (const auto&amp; e : adj[u]) {
            if (dist[u] + e.weight &lt; dist[e.to]) {
                dist[e.to] = dist[u] + e.weight;
                pq.emplace(dist[e.to], e.to);
            }
        }
    }
    return dist;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Missing the <code>if (d &gt; dist[u]) continue;</code> Guard or Allowing Negative Edges to Re-Push</div>
        <p>Without the <code>if (d &gt; dist[u]) continue;</code> check at the top of the loop, a vertex pushed $k$ times will re-scan all of its outgoing edges $k$ times, degrading Dijkstra's runtime from $O(E \\log V)$ to $O(V \\cdot E)$ on dense graphs! Equally critical: if you allow a modified Dijkstra to re-push already-settled vertices on negative-weight edges (even without negative cycles), a chain of 3-vertex diamonds with exponentially decreasing negative weights forces $\\Omega(2^{V/3})$ exponential vertex pops.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Dijkstra's greedy choice is sound if and only if all edge weights are non-negative (w >= 0), ensuring no path through unsettled vertices can ever undercut the minimum tentative distance d[u].",
      "Lazy duplicate insertion with the O(1) guard `if (d > dist[u]) continue;` avoids complex decrease-key index maps while preserving O((V + E) log V) time.",
      "Contiguous 4-ary heaps outperform Fibonacci heaps in practice because all 4 children reside in a single L1 cache line.",
      "When edge weights are integers in [0, C], Dial's circular bucket queue replaces the heap with C + 1 buckets to achieve O(V*C + E) time."
    ],
    furtherReading: [
      { title: "Dijkstra, E. W. (1959) — A note on two problems in connexion with graphs", url: "https://doi.org/10.1007/BF01386390" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 22.3: Dijkstra's Algorithm", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "Dial, R. B. (1969) — Algorithm 360: Shortest-Path Forest with Topological Ordering", url: "https://doi.org/10.1145/363269.363610" }
    ]
  }
};

Object.assign(window.MODULE_CONTENT["m13"], {
  "astar-heuristic-admissibility": {
    title: "A* Search & Bidirectional A*: Admissibility, Consistency (Triangle Inequality) & Optimality Proof",
    video: {
      youtubeId: "ySN5Wnu88nE",
      title: "A* (A Star) Search Algorithm — Admissible Heuristics",
      channel: "Computerphile",
      duration: "14:43",
      length: "14:43",
      start: 0,
      why: "Demonstrates how heuristic potential functions focus Dijkstra's uniform wave into a directed beam toward the target."
    },
    intuition: "<p>Standard Dijkstra's algorithm is blind to the target's location: searching for a route from New York to Philadelphia expands a circular wave equally westward toward Ohio and eastward toward New Jersey. <strong>A* Search (Hart, Nilsson &amp; Raphael, 1968)</strong> orders the priority queue by $f(u) = g(u) + h(u)$, combining the exact distance from the start $g(u)$ with a heuristic estimate $h(u)$ of the remaining distance to the target $t$.</p><p>The deepest mathematical insight of A* is that <strong>a consistent heuristic is nothing more than a Johnson potential reweighting</strong>: running A* with priority $g(u) + h(u)$ is algebraically identical to running standard Dijkstra on reduced edge weights $w_h(u, v) = w(u, v) - h(u) + h(v) \\ge 0$.</p>",
    content: `<div class="lesson-content">
      <h2>Admissibility vs. Consistency (Monotonicity)</h2>
      <p>Let $\\delta(u, t)$ denote the true shortest-path distance from vertex $u$ to target $t$. The behavior and complexity of A* depend on two hierarchy conditions on the heuristic function $h: V \\to \\mathbb{R}_{\\ge 0}$ (with $h(t) = 0$):</p>

      <div class="invariant-box">
        <div class="box-title">Formal Definitions &amp; Equivalence to Potential Reweighting</div>
        <ol>
          <li><strong>Admissibility (Never Overestimates):</strong> $h$ is <em>admissible</em> if for all $u \\in V$:
            $$0 \\le h(u) \\le \\delta(u, t)$$
            Admissibility guarantees that when target $t$ is popped from the priority queue, $g(t) = \\delta(s, t)$ is optimal (since $f(t) = g(t) + 0$, and any alternative path through an open node $x$ has $f(x) = g(x) + h(x) \\le g(x) + \\delta(x, t)$).</li>
          <li><strong>Consistency / Monotonicity (Triangle Inequality):</strong> $h$ is <em>consistent</em> if $h(t) = 0$ and for every directed edge $(u, v) \\in E$:
            $$h(u) \\le w(u, v) + h(v) \\iff w_h(u, v) := w(u, v) - h(u) + h(v) \\ge 0$$
            Every consistent heuristic is automatically admissible (by telescoping along any shortest path $u \\leadsto t$). Crucially, under consistency, any path $P: s \\leadsto u$ has reduced weight $w_h(P) = w(P) - h(s) + h(u) = f(u) - h(s)$. Since $w_h(u, v) \\ge 0$, A* is literally Dijkstra's algorithm on $w_h$, guaranteeing <strong>every vertex is popped and expanded at most once</strong>!</li>
        </ol>
      </div>

      <h3>Canonical Grid &amp; Geometric Heuristics</h3>
      <ul>
        <li><strong>4-Directional Grid (Up/Down/Left/Right, unit cost):</strong> Manhattan distance $h(u) = |x_u - x_t| + |y_u - y_t|$ is both admissible and consistent.</li>
        <li><strong>8-Directional Grid (King moves cost $1$):</strong> Chebyshev distance $h(u) = \\max(|x_u - x_t|, |y_u - y_t|)$. (If diagonal moves cost $\\sqrt{2}$, use Octile distance: $\\Delta_{\\max} + (\\sqrt{2} - 1)\\Delta_{\\min}$).</li>
        <li><strong>Continuous 2D/3D Euclidean Space or Road Networks:</strong> Euclidean distance $h(u) = \\|p_u - p_t\\|_2 / v_{\\max}$ (straight-line distance divided by the maximum legal highway speed).</li>
      </ul>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 185" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="175" y="25" fill="#94a3b8" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Dijkstra (h = 0): Isotropic Circle</text>
          <text x="525" y="25" fill="#34d399" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">A* (Consistent h): Focused Ellipsoid</text>
          <!-- Left: Dijkstra -->
          <circle cx="135" cy="105" r="65" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,3"/>
          <circle cx="135" cy="105" r="42" fill="#0f172a" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2,2"/>
          <circle cx="135" cy="105" r="7" fill="#38bdf8"/>
          <text x="135" y="124" fill="#38bdf8" font-family="monospace" font-size="11" text-anchor="middle">s</text>
          <circle cx="200" cy="105" r="7" fill="#f59e0b"/>
          <text x="200" y="124" fill="#f59e0b" font-family="monospace" font-size="11" text-anchor="middle">t</text>

          <line x1="350" y1="15" x2="350" y2="175" stroke="#334155" stroke-dasharray="4,4"/>

          <!-- Right: A* -->
          <ellipse cx="515" cy="105" rx="58" ry="24" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
          <circle cx="470" cy="105" r="7" fill="#38bdf8"/>
          <text x="470" y="124" fill="#38bdf8" font-family="monospace" font-size="11" text-anchor="middle">s</text>
          <circle cx="560" cy="105" r="7" fill="#f59e0b"/>
          <text x="560" y="124" fill="#f59e0b" font-family="monospace" font-size="11" text-anchor="middle">t</text>
          <line x1="477" y1="105" x2="553" y2="105" stroke="#34d399" stroke-width="2.5"/>
          <text x="525" y="162" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">Only nodes with g(u) + h(u) &le; δ(s, t) are expanded</text>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Heuristic["Heuristic h(u)"] --> CheckCons{"h(u) <= w(u,v) + h(v)?"}
        CheckCons -- "Yes (Consistent)" --> Once["Reduced weights w_h >= 0: Each node expanded <= 1 time!"]
        CheckCons -- "No, only h(u) <= dist(u,t)" --> Exp["Admissible but Inconsistent: Nodes may re-open O(2^V) times!"]
        CheckCons -- "h(u) > dist(u,t)" --> Weighted["Inadmissible (Weighted A*): Fast, bounded suboptimal"]
      </div>

      <div class="simulator-mount" data-sim="sim-dijkstra-astar-grid"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Avoiding <code>std::hypot</code> / <code>sqrt</code> Latency in Inner Loops</div>
        <p>On x86-64/ARM64, 64-bit floating-point <code>sqrt</code> has 12–20 cycles throughput latency and converts integer distances into floats. On 4-connected or 8-connected grids, always use exact integer heuristics (Manhattan $|dx| + |dy|$ or scaled Octile $1000(\\Delta_{\\max}) + 414(\\Delta_{\\min})$) so priority queue keys remain 64-bit integers compared in a single ALU cycle.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Heuristic Class</th>
            <th>Guarantees Optimal Path?</th>
            <th>Max Expansions per Vertex</th>
            <th>Worst-Case Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Zero Heuristic ($h(u) = 0$)</strong></td>
            <td>Yes (Standard Dijkstra)</td>
            <td><span class="badge-o1">1</span></td>
            <td><span class="badge-onlogn">O((V + E) log V)</span></td>
          </tr>
          <tr>
            <td><strong>Consistent ($h(u) \\le w(u,v) + h(v)$)</strong></td>
            <td><strong>Yes</strong></td>
            <td><span class="badge-o1">1</span></td>
            <td><span class="badge-onlogn">O((V + E) log V)</span></td>
          </tr>
          <tr>
            <td><strong>Admissible Only ($h(u) \\le \\delta(u, t)$)</strong></td>
            <td>Yes (if re-expansion allowed)</td>
            <td><span class="badge-o2n">O(2^V)</span></td>
            <td><span class="badge-o2n">Exponential</span> (if closed set re-opened)</td>
          </tr>
          <tr>
            <td><strong>Weighted A* ($f = g + \\epsilon \\cdot h, \\epsilon &gt; 1$)</strong></td>
            <td>$\\epsilon$-Approximation ($\\le \\epsilon \\cdot \\text{OPT}$)</td>
            <td><span class="badge-o1">1</span> (without re-opening)</td>
            <td><span class="badge-onlogn">O((V + E) log V)</span></td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: A* Search on a Weighted Graph</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;limits&gt;
#include &lt;functional&gt;

struct AStarEdge {
    int to;
    long long weight;
};

long long astarShortestPath(int n, int start, int target,
                            const std::vector&lt;std::vector&lt;AStarEdge&gt;&gt;&amp; adj,
                            const std::function&lt;long long(int)&gt;&amp; heuristic) {
    constexpr long long INF = std::numeric_limits&lt;long long&gt;::max() / 4;
    std::vector&lt;long long&gt; gScore(n, INF);
    std::vector&lt;uint8_t&gt; closed(n, 0);

    using State = std::pair&lt;long long, int&gt;; // (fScore = g + h, u)
    std::priority_queue&lt;State, std::vector&lt;State&gt;, std::greater&lt;State&gt;&gt; openSet;

    gScore[start] = 0;
    openSet.emplace(heuristic(start), start);

    while (!openSet.empty()) {
        auto [f, u] = openSet.top();
        openSet.pop();

        if (u == target) return gScore[target];
        if (closed[u]) continue; // Sound and optimal when heuristic is consistent!
        closed[u] = 1;

        for (const auto&amp; e : adj[u]) {
            long long tentativeG = gScore[u] + e.weight;
            if (tentativeG &lt; gScore[e.to]) {
                gScore[e.to] = tentativeG;
                openSet.emplace(tentativeG + heuristic(e.to), e.to);
            }
        }
    }
    return -1; // Target unreachable
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Using Manhattan Distance on an 8-Directional Grid</div>
        <p>On a grid where diagonal movement is allowed with cost $1$ (or $\\sqrt{2} \\approx 1.414$), moving from $(0, 0)$ to $(1, 1)$ has true distance $1$ (or $1.414$), but Manhattan distance gives $h = |1 - 0| + |1 - 0| = 2 &gt; \\delta$. Because Manhattan distance <strong>overestimates</strong> diagonal shortcuts, it is inadmissible on 8-way grids and can return suboptimal paths! Always match the norm to the allowed move set ($L_1$ for 4-way, $L_\\infty$ / Octile for 8-way, $L_2$ for any-angle).</p>
      </div>
    </div>`,
    keyTakeaways: [
      "A heuristic h(u) is admissible if 0 <= h(u) <= dist(u, t), and consistent if h(u) <= w(u, v) + h(v) for every edge (u, v).",
      "Consistency is mathematically equivalent to Johnson's potential reweighting w_h(u, v) = w(u, v) - h(u) + h(v) >= 0, proving that A* with a consistent heuristic never needs to re-expand a closed vertex.",
      "Every vertex u with g(u) + h(u) < dist(s, t) must be expanded by A*, whereas vertices with g(u) + h(u) > dist(s, t) are pruned completely.",
      "Never use L1 Manhattan distance on an 8-directional grid where diagonal moves cost less than 2, as it violates admissibility."
    ],
    furtherReading: [
      { title: "Hart, P. E., Nilsson, N. J., & Raphael, B. (1968) — A Formal Basis for the Heuristic Determination of Minimum Cost Paths", url: "https://doi.org/10.1109/TSSC.1968.300136" },
      { title: "Russell & Norvig — Artificial Intelligence: A Modern Approach (4th Ed.), Ch. 3.5: Informed (Heuristic) Search Strategies", url: "https://aima.cs.berkeley.edu/" },
      { title: "amitp (Red Blob Games) / Stanford Theory — Introduction to A* Pathfinding", url: "https://theory.stanford.edu/~amitp/GameProgramming/" }
    ]
  },

  "bellman-ford-spfa-difference-constraints": {
    title: "Negative Weights: Bellman-Ford, Negative Cycle Reconstruction & Systems of Difference Constraints",
    video: {
      youtubeId: "lyw4FaxrwHg",
      title: "Bellman-Ford Algorithm — Single Source Shortest Path & Negative Cycles",
      channel: "William Fiset",
      duration: "16:12",
      length: "16:12",
      start: 0,
      why: "Explains the V-1 edge relaxation bound, negative cycle detection on the V-th pass, and why negative cycles make shortest paths undefined."
    },
    intuition: "<p>When a graph contains negative edge weights—representing financial currency arbitrage, heat-releasing chemical reactions, or timing constraints—Dijkstra's greedy settlement invariant collapses. Worse yet, if the graph contains a <strong>negative-weight cycle</strong> reachable from the source, traversing the cycle repeatedly drives path weight to $-\\infty$.</p><p>The <strong>Bellman-Ford-Moore Algorithm (1956–1958)</strong> replaces greedy selection with dynamic programming over path edge counts: since any simple shortest path in a $V$-vertex graph contains at most $V - 1$ edges, relaxing all $E$ edges $V - 1$ times guarantees optimality, and any improvement on round $V$ is an airtight proof of a negative cycle.</p>",
    content: `<div class="lesson-content">
      <h2>The Path-Relaxation Property &amp; Negative Cycle Witness</h2>
      <p>Let a shortest simple path from $s$ to $v$ be $P = \\langle v_0, v_1, \\dots, v_k \\rangle$ where $v_0 = s$, $v_k = v$, and $k \\le |V| - 1$.</p>

      <div class="invariant-box">
        <div class="box-title">Formal Theorem — Path-Relaxation Invariant (CLRS Lemma 22.15)</div>
        <p>If $G = (V, E)$ contains no negative-weight cycles reachable from $s$, then after $i$ complete passes of relaxing every edge in $E$, for every vertex $v$ that has a shortest path from $s$ consisting of at most $i$ edges, $d[v] = \\delta(s, v)$.</p>
        <p><strong>Corollary (Negative Cycle Certificate on Pass $V$):</strong> Since every simple path has $\\le |V| - 1$ edges, if no negative cycle is reachable from $s$, no distance $d[v]$ can decrease on the $|V|$-th pass. Conversely, if any edge $(u, v)$ satisfies $d[u] + w(u, v) &lt; d[v]$ on pass $|V|$, then $v$ is reachable from a negative-weight cycle! Walking backward $|V|$ steps along $\\text{parent}[\\cdot]$ pointers from $v$ is <strong>guaranteed</strong> to land strictly inside the negative cycle itself.</p>
      </div>

      <h3>1. Reconstructing the Exact Negative Cycle</h3>
      <p>Notice a subtle trap: if vertex $v$ is relaxed on pass $V$, $v$ might not lie <em>on</em> the negative cycle itself—it might merely be a downstream vertex <em>reachable</em> from a negative cycle $C$. However, because the predecessor subgraph traced backward from $v$ has out-degree $1$ in the reversed sense and was updated within the last $V$ steps, executing <code>for (int i = 0; i &lt; V; ++i) x = parent[x];</code> walks backward out of the downstream tail and is guaranteed to place $x$ on the cycle $C$. From there, following $\\text{parent}$ until returning to $x$ extracts the exact cycle.</p>

      <h3>2. Systems of Difference Constraints ($x_v - x_u \\le w$)</h3>
      <p>Suppose a scheduling or VLSI layout problem gives $M$ linear inequalities of the form:</p>
      $$x_v - x_u \\le w_{u,v} \\iff x_v \\le x_u + w_{u,v}$$
      <p>Compare this directly with the shortest-path triangle inequality $\\delta(s, v) \\le \\delta(s, u) + w(u, v)$! By creating a directed edge $(u, v)$ of weight $w_{u,v}$ for each constraint $x_v - x_u \\le w_{u,v}$ and adding a virtual source $s^*$ with $0$-weight edges to all variables, the system of inequalities has a feasible solution if and only if the constraint graph has <strong>no negative cycle</strong>, and setting $x_v = \\delta(s^*, v)$ is a valid solution!</p>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 185" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Pass V Relaxation Witness &amp; Backward V-Step Negative Cycle Extraction</text>
          <defs>
            <marker id="arr-bf" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171"/></marker>
            <marker id="arr-tail" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/></marker>
          </defs>
          <!-- Negative Cycle 1 -> 2 -> 3 -> 1 -->
          <rect x="35" y="45" width="275" height="120" fill="#1f1215" stroke="#f87171" stroke-dasharray="4,3" rx="8"/>
          <text x="172" y="62" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">Negative Cycle (Sum = -2)</text>
          <circle cx="95" cy="115" r="18" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
          <text x="95" y="119" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">1</text>
          <circle cx="175" cy="78" r="18" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
          <text x="175" y="82" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">2</text>
          <circle cx="250" cy="115" r="18" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
          <text x="250" y="119" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">3</text>
          <line x1="111" y1="106" x2="157" y2="85" stroke="#f87171" stroke-width="2" marker-end="url(#arr-bf)"/>
          <text x="125" y="88" fill="#fca5a5" font-family="monospace" font-size="10">+2</text>
          <line x1="191" y1="85" x2="233" y2="106" stroke="#f87171" stroke-width="2" marker-end="url(#arr-bf)"/>
          <text x="220" y="88" fill="#fca5a5" font-family="monospace" font-size="10">+1</text>
          <line x1="232" y1="118" x2="115" y2="118" stroke="#f87171" stroke-width="2" marker-end="url(#arr-bf)"/>
          <text x="175" y="135" fill="#fca5a5" font-family="monospace" font-size="10" font-weight="bold">-5</text>

          <!-- Downstream tail -->
          <circle cx="385" cy="115" r="18" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="385" y="119" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">4</text>
          <circle cx="505" cy="115" r="18" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
          <text x="505" y="119" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">v=5</text>
          <line x1="268" y1="115" x2="365" y2="115" stroke="#94a3b8" stroke-width="2" marker-end="url(#arr-tail)"/>
          <line x1="403" y1="115" x2="485" y2="115" stroke="#94a3b8" stroke-width="2" marker-end="url(#arr-tail)"/>
          <text x="515" y="75" fill="#f59e0b" font-family="monospace" font-size="11" text-anchor="middle">Relaxed on pass V!</text>
          <text x="515" y="152" fill="#34d399" font-family="monospace" font-size="11" text-anchor="middle">Walk parent[v] V times &rarr; lands in {1,2,3}</text>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Init["Initialize dist[s] = 0, others = INF"] --> Loop["Run V-1 relaxation passes over all E edges"]
        Loop --> Early{"Any edge relaxed in pass?"}
        Early -- "No" --> Done["Converged Early: Optimal Distances Ready"]
        Early -- "Yes (after V-1 passes)" --> PassV["Run V-th pass: check if dist[u] + w < dist[v]"]
        PassV -- "No improvement" --> Done
        PassV -- "Improved at v" --> Trace["Walk x = parent[x] V times, then extract cycle"]
      </div>

      <div class="simulator-mount" data-sim="sim-bellman-ford-floyd-johnson"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Flat Edge-Struct Array vs. Adjacency Lists in Bellman-Ford, and the SPFA Anti-Pattern</div>
        <p>Because Bellman-Ford relaxes <em>every</em> edge indiscriminately on each pass, iterating over a single contiguous <code>std::vector&lt;Edge&gt;</code> of 16-byte <code>{u, v, w}</code> structs is $3\\times$ faster than nested adjacency list loops. Conversely, the Queue-based Bellman-Ford variant (<strong>SPFA</strong>) has worst-case $O(V \\cdot E)$ complexity and is easily forced into $O(V \\cdot E)$ with terrible random-access cache misses by grid/ladder anti-SPFA test cases.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Algorithm / Problem</th>
            <th>Average / Best Case</th>
            <th>Worst-Case Time</th>
            <th>Space Complexity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Bellman-Ford (with Early Exit)</strong></td>
            <td><span class="badge-on">O(k · E)</span> ($k \\le V$)</td>
            <td><span class="badge-on2">O(V · E)</span></td>
            <td><span class="badge-on">O(V)</span></td>
          </tr>
          <tr>
            <td><strong>SPFA (Queue-Based Moore)</strong></td>
            <td><span class="badge-on">O(E)</span> (random graphs)</td>
            <td><span class="badge-on2">O(V · E)</span> (adversarial grids)</td>
            <td><span class="badge-on">O(V)</span></td>
          </tr>
          <tr>
            <td><strong>Difference Constraints ($M$ inequalities)</strong></td>
            <td><span class="badge-on">O(N + M)</span></td>
            <td><span class="badge-on2">O(N · M)</span></td>
            <td><span class="badge-on">O(N + M)</span></td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Bellman-Ford with Exact Negative Cycle Reconstruction</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;

struct BFEdge {
    int u, v;
    long long weight;
};

// Finds any negative cycle in the graph (initializing dist to 0 acts as a virtual super-source!)
std::vector&lt;int&gt; findNegativeCycle(int n, const std::vector&lt;BFEdge&gt;&amp; edges) {
    std::vector&lt;long long&gt; dist(n, 0);
    std::vector&lt;int&gt; parent(n, -1);
    int lastRelaxed = -1;

    for (int step = 0; step &lt; n; ++step) {
        lastRelaxed = -1;
        for (const auto&amp; e : edges) {
            if (dist[e.u] + e.weight &lt; dist[e.v]) {
                dist[e.v] = dist[e.u] + e.weight;
                parent[e.v] = e.u;
                lastRelaxed = e.v;
            }
        }
        if (lastRelaxed == -1) return {}; // Early exit: no negative cycle exists
    }

    // Walk backward n steps to guarantee landing strictly inside the negative cycle
    int cycleNode = lastRelaxed;
    for (int i = 0; i &lt; n; ++i) {
        cycleNode = parent[cycleNode];
    }

    std::vector&lt;int&gt; cycle;
    for (int cur = cycleNode;; cur = parent[cur]) {
        cycle.push_back(cur);
        if (cur == cycleNode &amp;&amp; cycle.size() &gt; 1) break;
    }
    std::reverse(cycle.begin(), cycle.end());
    return cycle;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — relaxing from <code>INF</code> Causes Signed Overflow with Negative Edges</div>
        <p>When finding single-source shortest paths from $s$ (where unreachable vertices start at <code>dist[u] = INF</code>), if edge $(u, v)$ has weight $-10$ and $u$ is unreachable ($d[u] = \\text{INF}$), evaluating <code>dist[u] + (-10) &lt; dist[v]</code> will evaluate to <code>INF - 10 &lt; INF</code> (True!), propagating fake finite distances through unreachable components! Always guard single-source relaxations with <code>if (dist[e.u] != INF &amp;&amp; dist[e.u] + e.weight &lt; dist[e.v])</code>.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Bellman-Ford relaxes all E edges V - 1 times because any simple shortest path in a V-vertex graph contains at most V - 1 edges.",
      "An edge relaxation on the V-th pass proves the existence of a negative cycle; walking parent[x] backward V times from the relaxed vertex is guaranteed to enter the cycle.",
      "Initializing all dist[0..V-1] = 0 is equivalent to adding a virtual super-source with weight-0 edges to every vertex, detecting negative cycles anywhere in a disconnected graph.",
      "A system of difference constraints x_v - x_u <= w is feasible iff the graph with edges (u -> v, weight w) has no negative cycle."
    ],
    furtherReading: [
      { title: "Bellman, R. (1958) — On a routing problem", url: "https://doi.org/10.1090/qam/102435" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 22.1 & 22.4: Bellman-Ford & Difference Constraints", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "CP-Algorithms — Bellman-Ford & Finding a Negative Cycle in the Graph", url: "https://cp-algorithms.com/graph/bellman_ford.html" }
    ]
  },

  "floyd-warshall-johnson-apsp": {
    title: "All-Pairs Shortest Paths: Floyd-Warshall DP Transitive Closure & Johnson's Potential Reweighting",
    video: {
      youtubeId: "4NQ3HnhyNfQ",
      title: "Floyd-Warshall All-Pairs Shortest Path Algorithm",
      channel: "William Fiset",
      duration: "15:30",
      length: "15:30",
      start: 0,
      why: "Explains the intermediate-vertex DP state transition and negative cycle detection on the matrix diagonal."
    },
    intuition: "<p>When an application needs shortest-path distances between <strong>every pair of vertices</strong> $(u, v) \\in V \\times V$, the optimal algorithm depends on graph density and negative edge weights. On dense graphs ($V \\le 500$), <strong>Floyd-Warshall's $O(V^3)$ DP</strong> consists of three tight nested loops with virtually zero constant-factor overhead.</p><p>On sparse graphs with negative edge weights (but no negative cycles), running Bellman-Ford from every vertex takes $O(V^2 E)$ time. <strong>Johnson's Algorithm (1977)</strong> solves sparse All-Pairs Shortest Paths in $O(V E + V^2 \\log V)$ by running Bellman-Ford <em>once</em> to compute vertex potentials $h(v)$ that shift every edge weight to be non-negative ($w_h(u, v) \\ge 0$) without altering shortest paths, then running $V$ fast passes of Dijkstra!</p>",
    content: `<div class="lesson-content">
      <h2>1. Floyd-Warshall: Intermediate Vertex Set Induction</h2>
      <p>Define $d^{(k)}[i][j]$ as the minimum weight of any path from $i$ to $j$ whose <strong>intermediate vertices</strong> belong strictly to the prefix set $\\{0, 1, \\dots, k\\}$. Considering whether vertex $k$ is used as an intermediate stop along the shortest path from $i$ to $j$ yields the recurrence:</p>
      $$d^{(k)}[i][j] = \\min\\Big(d^{(k-1)}[i][j],\\; d^{(k-1)}[i][k] + d^{(k-1)}[k][j]\\Big)$$

      <div class="invariant-box">
        <div class="box-title">Formal Invariant — Why $k$ Must Be the Outermost Loop &amp; In-Place Space Compression</div>
        <p>Why can we overwrite a single 2D matrix $d[i][j]$ in-place without corrupting phase $k$'s dependencies? Notice that during phase $k$, $d[i][j]$ reads $d[i][k]$ and $d[k][j]$. In phase $k$ itself, $d[i][k]$ is updated to $\\min(d[i][k], d[i][k] + d[k][k])$. As long as no negative cycle passes through $k$ ($d[k][k] \\ge 0$), $d^{(k)}[i][k] == d^{(k-1)}[i][k]$ and $d^{(k)}[k][j] == d^{(k-1)}[k][j]$! Thus in-place updates are exact.</p>
        <p><strong>Negative Cycle Detection:</strong> A vertex $u$ lies on a negative cycle if and only if after completion (or during execution) its diagonal entry satisfies $d[u][u] &lt; 0$.</p>
      </div>

      <h3>2. Johnson's Potential Reweighting Theorem (1977)</h3>
      <p>How can we eliminate negative edge weights without changing which path between $u$ and $v$ is shortest? (Simply adding a constant $+C$ to every edge is a classic blunder: it penalizes a 5-edge path by $+5C$ and a 2-edge path by $+2C$, changing the optimal path!)</p>
      <p>Instead, assign every vertex $v \\in V$ a scalar <strong>potential</strong> $h(v) \\in \\mathbb{R}$ and define the reweighted edge cost:</p>
      $$w_h(u, v) = w(u, v) + h(u) - h(v)$$
      <p>Along <em>any</em> path $P = \\langle v_0, v_1, \\dots, v_k \\rangle$ from $v_0 = u$ to $v_k = v$, the intermediate potentials telescope and cancel completely:</p>
      $$w_h(P) = \\sum_{i=1}^k \\big(w(v_{i-1}, v_i) + h(v_{i-1}) - h(v_i)\\big) = w(P) + h(u) - h(v)$$
      <p>Because $h(u) - h(v)$ depends only on the endpoints $(u, v)$ and not on the path $P$, <strong>every path from $u$ to $v$ shifts by the exact same constant $h(u) - h(v)$</strong>! To guarantee $w_h(u, v) \\ge 0$ for all $(u, v) \\in E$, we need $h(v) - h(u) \\le w(u, v)$—which is satisfied by setting $h(v) = \\delta(s^*, v)$ from a single Bellman-Ford run starting at a virtual super-source $s^*$!</p>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 185" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Johnson's Potential Telescoping: w_h(u, v) = w(u, v) + h(u) - h(v) &ge; 0</text>
          <g transform="translate(45, 50)">
            <rect x="0" y="0" width="610" height="115" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" rx="6"/>
            <circle cx="80" cy="65" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="80" y="62" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">u</text>
            <text x="80" y="76" fill="#38bdf8" font-family="monospace" font-size="10" text-anchor="middle">h=0</text>

            <circle cx="295" cy="65" r="22" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
            <text x="295" y="62" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">x</text>
            <text x="295" y="76" fill="#f59e0b" font-family="monospace" font-size="10" text-anchor="middle">h=-4</text>

            <circle cx="510" cy="65" r="22" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
            <text x="510" y="62" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">v</text>
            <text x="510" y="76" fill="#34d399" font-family="monospace" font-size="10" text-anchor="middle">h=-6</text>

            <line x1="102" y1="65" x2="273" y2="65" stroke="#94a3b8" stroke-width="2"/>
            <text x="187" y="52" fill="#f87171" font-family="monospace" font-size="11" text-anchor="middle">w = -4</text>
            <text x="187" y="85" fill="#34d399" font-family="monospace" font-size="11" text-anchor="middle">w_h = -4 + 0 - (-4) = 0</text>

            <line x1="317" y1="65" x2="488" y2="65" stroke="#94a3b8" stroke-width="2"/>
            <text x="402" y="52" fill="#f87171" font-family="monospace" font-size="11" text-anchor="middle">w = -1</text>
            <text x="402" y="85" fill="#34d399" font-family="monospace" font-size="11" text-anchor="middle">w_h = -1 + (-4) - (-6) = +1</text>
          </g>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Super["Add virtual s* with w(s*, v) = 0"] --> BF["Run Bellman-Ford from s* to get h[v] = dist(s*, v)"]
        BF --> Neg{"Negative cycle?"}
        Neg -- "Yes" --> Abort["Report Negative Cycle"]
        Neg -- "No" --> Reweight["Set w_h(u,v) = w(u,v) + h[u] - h[v] >= 0"]
        Reweight --> Dijk["Run Dijkstra from each u in V; recover dist(u,v) = d_h(u,v) - h[u] + h[v]"]
      </div>

      <div class="simulator-mount" data-sim="sim-bellman-ford-floyd-johnson"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Auto-Vectorization &amp; Cache Row-Major Access in Floyd-Warshall</div>
        <p>In Floyd-Warshall's loop order <code>for k ... for i ... for j</code>, the inner loop over <code>j</code> streams sequentially across row <code>d[i][0..V-1]</code> and row <code>d[k][0..V-1]</code> while holding <code>d[i][k]</code> in a scalar register. Compilers (<code>-O3 -mavx2</code>) auto-vectorize this inner loop using <code>VPMINSD</code> / <code>VPADDD</code> SIMD instructions, processing 8 distances per clock cycle!</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>APSP Algorithm</th>
            <th>Negative Edges?</th>
            <th>Time Complexity</th>
            <th>Space Complexity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>$V \\times$ Dijkstra</strong></td>
            <td>No ($w \\ge 0$ only)</td>
            <td><span class="badge-onlogn">O(V E + V² log V)</span></td>
            <td><span class="badge-on2">O(V²)</span> output</td>
          </tr>
          <tr>
            <td><strong>Floyd-Warshall DP</strong></td>
            <td><strong>Yes</strong> (detects $d[i][i] &lt; 0$)</td>
            <td><span class="badge-on2">O(V³)</span></td>
            <td><span class="badge-on2">O(V²)</span></td>
          </tr>
          <tr>
            <td><strong>Johnson's Algorithm</strong></td>
            <td><strong>Yes</strong> (1 BF + $V$ Dijkstras)</td>
            <td><span class="badge-onlogn">O(V E + V² log V)</span></td>
            <td><span class="badge-on2">O(V² + E)</span></td>
          </tr>
          <tr>
            <td><strong>Warshall Bitset Transitive Closure</strong></td>
            <td>Unweighted Reachability</td>
            <td><span class="badge-on2">O(V³ / 64)</span></td>
            <td><span class="badge-on2">V² / 8 bytes</span></td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Floyd-Warshall &amp; Johnson's Potential Reweighting</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;limits&gt;

void floydWarshall(int n, std::vector&lt;std::vector&lt;long long&gt;&gt;&amp; dist) {
    constexpr long long INF = std::numeric_limits&lt;long long&gt;::max() / 4;
    for (int k = 0; k &lt; n; ++k) {
        for (int i = 0; i &lt; n; ++i) {
            if (dist[i][k] &gt;= INF) continue; // Crucial overflow guard + branch skip!
            for (int j = 0; j &lt; n; ++j) {
                if (dist[k][j] &lt; INF) {
                    dist[i][j] = std::min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Writing <code>for i ... for j ... for k</code> in Floyd-Warshall</div>
        <p>Permuting the loops of Floyd-Warshall to place <code>k</code> on the inside (<code>for i ... for j ... for k</code>) is one of the most notorious bugs in competitive and production programming: it only considers paths of length $\\le 2$ (single intermediate hop $i \\to k \\to j$) or corrupts transitive dependencies across multi-hop paths! The intermediate vertex <code>k</code> <strong>must always be the outermost loop</strong>.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Floyd-Warshall relaxes paths by expanding the allowed set of intermediate vertices {0..k}; therefore k must always be the outermost loop.",
      "Adding a uniform constant +C to every edge alters shortest paths because paths with more edges are penalized more heavily.",
      "Johnson's reweighting w_h(u, v) = w(u, v) + h(u) - h(v) telescopes along every u->v path to shift all path weights by the same constant h(u) - h(v), preserving shortest paths while making all edge weights non-negative.",
      "After Floyd-Warshall finishes, vertex u belongs to a negative cycle if and only if dist[u][u] < 0."
    ],
    furtherReading: [
      { title: "Floyd, R. W. (1962) — Algorithm 97: Shortest Path", url: "https://doi.org/10.1145/367766.368168" },
      { title: "Johnson, D. B. (1977) — Efficient Algorithms for Shortest Paths in Sparse Networks", url: "https://doi.org/10.1145/321992.321993" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 23: All-Pairs Shortest Paths", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
    ]
  }
});

Object.assign(window.MODULE_CONTENT["m13"], {
  "state-space-dijkstra-layered-graphs": {
    title: "Modeling Problems as State-Space Graphs: Layered Graphs ((u, k) States) & Bitmask Dijkstra",
    video: {
      youtubeId: "69rcy6lb-HQ",
      id: "69rcy6lb-HQ",
      url: "https://www.youtube.com/embed/69rcy6lb-HQ",
      title: "State-Space Graph Shortest Paths & Multi-State BFS/Dijkstra Modeling",
      channel: "NeetCodeIO",
      duration: "13:50",
      start: 0,
      length: "13m",
      why: "Shows how augmenting vertex definitions with auxiliary state variables turns constrained optimization problems into standard Dijkstra."
    },
    intuition: "<p>Senior engineers rarely modify the internal code of Dijkstra's algorithm; instead, they <strong>modify the definition of a vertex</strong>. Whenever a shortest-path problem introduces resource constraints, coupons, fuel tanks, or required key collections, the naive graph $G = (V, E)$ violates the Markov property because the best future path from $u$ depends on <em>how</em> you arrived at $u$.</p><p>By lifting the graph into a product state space $V' = V \\times \\mathcal{S}$—such as $(u, k)$ where $k$ is the number of free-edge coupons used, or $(u, \\text{mask})$ where $\\text{mask} \\in [0, 2^K - 1]$ tracks collected keys—the problem becomes memoryless again and is solved by unmodified Dijkstra on $G' = (V', E')$.</p>",
    content: `<div class="lesson-content">
      <h2>The Product Graph Lifting Principle</h2>
      <p>Suppose we want the shortest path from $s$ to $t$ in $G = (V, E, w)$, given at most $K$ uses of a special transition (e.g., halving or zeroing an edge's weight). In the base graph $G$, reaching $u$ with cost $10$ and $0$ coupons left is incomparable to reaching $u$ with cost $15$ and $2$ coupons left. We restore total ordering per state by defining the <strong>$(K+1)$-Layer Graph</strong>:</p>

      <div class="invariant-box">
        <div class="box-title">Formal Construction — Layered State-Space Graph $G_K = (V \\times \\{0..K\\}, E_K)$</div>
        <p>For each original vertex $u \\in V$ and layer $k \\in \\{0, 1, \\dots, K\\}$, create state $(u, k)$ indexed in a flat 1D array as $\\text{id}(u, k) = u \\cdot (K + 1) + k$. For each original edge $(u, v)$ of weight $w$:</p>
        <ul>
          <li><strong>Intra-Layer Transition (Normal Edge):</strong> For all $0 \\le k \\le K$, add edge $(u, k) \\to (v, k)$ with weight $w$.</li>
          <li><strong>Inter-Layer Transition (Coupon / State Upgrade):</strong> For all $0 \\le k &lt; K$, add edge $(u, k) \\to (v, k + 1)$ with discounted weight $0$ (or $\\lfloor w / 2 \\rfloor$).</li>
        </ul>
        <p>Then $\\min_{0 \\le k \\le K} \\text{dist}[(t, k)]$ is the exact optimal answer in $O(K(V + E) \\log(KV))$ time!</p>
      </div>

      <h3>Common State-Space Modeling Patterns</h3>
      <ol>
        <li><strong>Fuel Tank / Battery Capacity ($V \\times [0..F]$):</strong> At state $(u, f)$, either buy $1$ unit of fuel at price $p[u]$ via transition $(u, f) \\to (u, f+1)$ of weight $p[u]$, or drive an edge $(u, v)$ of length $L \\le f$ via transition $(u, f) \\to (v, f - L)$ of weight $0$.Notice that splitting fuel refilling into $+1$ increments keeps out-degree $O(\\text{deg}(u) + 1)$ instead of $O(\\text{deg}(u) + F)$!</li>
        <li><strong>Bitmask Keys &amp; Locks ($V \\times [0..2^K - 1]$):</strong> When a maze has $K \\le 12$ keys and locked doors, state $(u, \\text{mask})$ transitions to $(v, \\text{mask} \\mid \\text{keysAt}[v])$ whenever $(\\text{mask} \\,\\&\\, \\text{requiredDoor}[u][v]) == \\text{requiredDoor}[u][v]$.</li>
        <li><strong>Edge Parity / Modulo-$M$ Path Length ($V \\times [0..M-1]$):</strong> Finding the shortest path of even/odd length or weight divisible by $M$ uses state $(u, r)$ where $r \\in [0, M-1]$ is the remainder modulo $M$.</li>
      </ol>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 190" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="24" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Layered Graph: Normal Intra-Layer Edges (w) vs. Discounted Inter-Layer Jumps (0)</text>
          <defs>
            <marker id="arr-ly1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8"/></marker>
            <marker id="arr-ly2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399"/></marker>
          </defs>
          <!-- Layer 0 -->
          <rect x="45" y="42" width="590" height="52" fill="#0f172a" stroke="#38bdf8" stroke-dasharray="4,3" rx="6"/>
          <text x="105" y="72" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">Layer k = 0</text>
          <circle cx="240" cy="68" r="15" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="240" y="72" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">(s,0)</text>
          <circle cx="400" cy="68" r="15" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="400" y="72" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">(u,0)</text>
          <circle cx="560" cy="68" r="15" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="560" y="72" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">(t,0)</text>
          <line x1="255" y1="68" x2="383" y2="68" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-ly1)"/>
          <text x="320" y="60" fill="#38bdf8" font-family="monospace" font-size="10" text-anchor="middle">+w(s,u)</text>
          <line x1="415" y1="68" x2="543" y2="68" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-ly1)"/>
          <text x="480" y="60" fill="#38bdf8" font-family="monospace" font-size="10" text-anchor="middle">+w(u,t)</text>

          <!-- Layer 1 -->
          <rect x="45" y="120" width="590" height="52" fill="#0f172a" stroke="#34d399" stroke-dasharray="4,3" rx="6"/>
          <text x="105" y="150" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">Layer k = 1</text>
          <circle cx="240" cy="146" r="15" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="240" y="150" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">(s,1)</text>
          <circle cx="400" cy="146" r="15" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="400" y="150" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">(u,1)</text>
          <circle cx="560" cy="146" r="15" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="560" y="150" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">(t,1)</text>
          <line x1="415" y1="146" x2="543" y2="146" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-ly1)"/>
          <text x="480" y="164" fill="#38bdf8" font-family="monospace" font-size="10" text-anchor="middle">+w(u,t)</text>

          <!-- Inter-layer diagonal -->
          <line x1="253" y1="76" x2="386" y2="138" stroke="#34d399" stroke-width="2.2" stroke-dasharray="4,2" marker-end="url(#arr-ly2)"/>
          <text x="305" y="114" fill="#34d399" font-family="monospace" font-size="10" font-weight="bold">coupon: +0</text>
          <line x1="413" y1="76" x2="546" y2="138" stroke="#34d399" stroke-width="2.2" stroke-dasharray="4,2" marker-end="url(#arr-ly2)"/>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Pop["Pop (d, u, k) from Min-Heap"] --> Guard{"d > dist[u][k]?"}
        Guard -- "Yes" --> Pop
        Guard -- "No" --> SameLayer["Relax (u, k) -> (v, k) with cost +w"]
        SameLayer --> NextLayer{"k < K?"}
        NextLayer -- "Yes" --> Upgrade["Relax (u, k) -> (v, k+1) with discounted cost"]
        NextLayer -- "No" --> Continue["Next neighbor"]
      </div>

      <div class="simulator-mount" data-sim="sim-dijkstra-astar-grid"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Implicit Transitions vs. Materializing $G_K$ in RAM</div>
        <p>Never allocate a physical adjacency list for $G_K$! Generating $K$ copies of $E$ edges wastes $O(K \\cdot E)$ memory and pollutes L3 cache. Instead, keep the original graph $G$ read-only in L1/L2 cache, flatten the distance table to <code>dist[u * (K + 1) + k]</code>, and generate the intra-layer and inter-layer transitions on-the-fly inside the Dijkstra loop.</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>State Space Model</th>
            <th>Expanded Vertices $|V'|$</th>
            <th>Expanded Edges $|E'|$</th>
            <th>Total Time Complexity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>$K$-Coupon Layered Graph</strong></td>
            <td><span class="badge-on">V · (K + 1)</span></td>
            <td><span class="badge-on">2 · E · K</span></td>
            <td><span class="badge-onlogn">O(K(V + E) log(KV))</span></td>
          </tr>
          <tr>
            <td><strong>Fuel Tank ($+1$ Unit Refill)</strong></td>
            <td><span class="badge-on">V · (F + 1)</span></td>
            <td><span class="badge-on">(V + E) · F</span></td>
            <td><span class="badge-onlogn">O(F(V + E) log(FV))</span></td>
          </tr>
          <tr>
            <td><strong>Bitmask Keys ($K$ Keys)</strong></td>
            <td><span class="badge-o2n">V · 2^K</span></td>
            <td><span class="badge-o2n">E · 2^K</span></td>
            <td><span class="badge-o2n">O(2^K (V + E) log(V 2^K))</span></td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: Implicit Layered Dijkstra ($K$ Free Edges)</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;limits&gt;
#include &lt;algorithm&gt;

struct FlightEdge {
    int to;
    long long cost;
};

long long shortestPathWithKCoupons(int n, int kMax, int src, int dst,
                                   const std::vector&lt;std::vector&lt;FlightEdge&gt;&gt;&amp; adj) {
    constexpr long long INF = std::numeric_limits&lt;long long&gt;::max() / 4;
    const int stride = kMax + 1;
    std::vector&lt;long long&gt; dist(n * stride, INF);

    using State = std::pair&lt;long long, int&gt;; // (cost, encodedState = u * stride + k)
    std::priority_queue&lt;State, std::vector&lt;State&gt;, std::greater&lt;State&gt;&gt; pq;

    dist[src * stride + 0] = 0;
    pq.emplace(0, src * stride + 0);

    while (!pq.empty()) {
        auto [d, state] = pq.top();
        pq.pop();
        if (d &gt; dist[state]) continue;

        int u = state / stride;
        int k = state % stride;
        if (u == dst) return d; // First time any layer of dst is popped is global min!

        for (const auto&amp; e : adj[u]) {
            // 1. Normal edge on layer k
            int nextSame = e.to * stride + k;
            if (d + e.cost &lt; dist[nextSame]) {
                dist[nextSame] = d + e.cost;
                pq.emplace(dist[nextSame], nextSame);
            }
            // 2. Coupon transition to layer k + 1 (if available)
            if (k &lt; kMax) {
                int nextUp = e.to * stride + (k + 1);
                if (d &lt; dist[nextUp]) {
                    dist[nextUp] = d;
                    pq.emplace(dist[nextUp], nextUp);
                }
            }
        }
    }
    return -1;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Dominance Pruning Neglect &amp; State Explosion</div>
        <p>In layered graphs where a larger resource $k$ is strictly worse (i.e., $k$ counts coupons <em>used</em>), if you already have $\\text{dist}[v][k'] \\le d_{\\text{new}}$ for some $k' &lt; k$, then state $(v, k)$ is <strong>Pareto-dominated</strong> by $(v, k')$ and never needs to be pushed! Checking dominance or propagating downward bounds across layers prevents redundant heap expansions.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Whenever path validity or cost depends on history (coupons used, fuel remaining, keys collected, path parity), augment the vertex state space V' = V x S so transitions become memoryless.",
      "Keep the base graph G read-only and generate state transitions implicitly inside Dijkstra's loop to avoid O(|S| * E) memory overhead.",
      "Splitting resource recharges into unit transitions (u, f) -> (u, f+1) keeps vertex out-degree O(1) instead of O(F).",
      "Because Dijkstra pops states in non-decreasing order of cost, the first time any target state (dst, k) is popped is guaranteed to be the minimum across all layers."
    ],
    furtherReading: [
      { title: "Jeff Erickson — Algorithms, Chapter 8: Shortest Paths (State-Space Graphs)", url: "https://jeffe.cs.illinois.edu/teaching/algorithms/" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 22: Single-Source Shortest Paths", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "CP-Algorithms — Dijkstra on Sparse Graphs", url: "https://cp-algorithms.com/graph/dijkstra_sparse.html" }
    ]
  },

  "case-osrm-contraction-hierarchies": {
    title: "Production Case Study: How Continental Road Routing Works in 1 Millisecond (Contraction Hierarchies & Hub Labeling)",
    video: {
      youtubeId: "FXYs-fg1y8s",
      id: "FXYs-fg1y8s",
      url: "https://www.youtube.com/embed/FXYs-fg1y8s",
      title: "Contraction Hierarchies: Vertex Importance Ordering, Shortcuts & Bidirectional Road Routing",
      channel: "Nathan Sturtevant",
      duration: "14:22",
      start: 0,
      length: "14m",
      why: "Explains why standard Dijkstra and A* are too slow for continental road networks and how hierarchical preprocessing enables sub-millisecond queries."
    },
    intuition: "<p>A continental road network (such as Europe or North America in OpenStreetMap) contains $|V| \\approx 5 \\times 10^7$ intersections and $|E| \\approx 1.2 \\times 10^8$ road segments. Running standard Dijkstra from Lisbon to Moscow visits 50 million vertices and takes <strong>3 to 8 seconds</strong>—even with A* Euclidean heuristics, it still takes hundreds of milliseconds, which is $500\\times$ too slow for ride-sharing dispatch or logistics engines handling $10{,}000$ queries per second.</p><p>Production routing engines like <strong>OSRM (Open Source Routing Machine)</strong> and <strong>Valhalla</strong> achieve <strong>0.3-millisecond</strong> queries via <strong>Contraction Hierarchies (CH, Geisberger et al. 2008)</strong>: an offline preprocessing phase orders vertices by highway importance and inserts shortcut edges so that an online bidirectional search only climbs <em>upward</em> in rank, visiting fewer than 400 vertices per continental query!</p>",
    content: `<div class="lesson-content">
      <h2>The Mechanics of Contraction Hierarchies (CH)</h2>
      <p>Contraction Hierarchies separate routing into two phases: a one-time offline preprocessing phase (taking ~10 minutes for a continent) and an ultra-fast online query phase.</p>

      <div class="invariant-box">
        <div class="box-title">Formal Invariant — Witness Search &amp; Upward-Downward Path Canonical Form</div>
        <p>Assign every vertex $v \\in V$ a distinct importance rank $\\text{rank}(v) \\in \\{1, 2, \\dots, |V|\\}$ (residential dead-ends lowest, interstate highway junctions highest). We <strong>contract</strong> vertices one by one in increasing order of rank:</p>
        <p>When contracting vertex $v$, for every pair of remaining higher-rank neighbors $(u, w)$ with $\\text{rank}(u) &gt; \\text{rank}(v)$ and $\\text{rank}(w) &gt; \\text{rank}(v)$ such that edges $(u, v)$ and $(v, w)$ exist, we run a local <strong>witness search</strong> to check if the shortest path $\\delta(u, w)$ in the remaining graph is strictly $\\le w(u, v) + w(v, w)$ without using $v$. If <em>not</em> (i.e., $u \\to v \\to w$ is the unique shortest path), we insert a <strong>shortcut edge</strong> $(u, w)$ of weight $w(u, v) + w(v, w)$.</p>
        <p><strong>CH Optimality Theorem:</strong> In the shortcut-augmented graph $G^*$, for every pair $(s, t) \\in V \\times V$, there exists a shortest path of the canonical <strong>up-down form</strong>:</p>
        $$s = u_0 \\to u_1 \\to \\dots \\to u_p = m = v_q \\to \\dots \\to v_0 = t$$
        <p>where ranks strictly increase along the forward prefix ($\text{rank}(u_0) &lt; \dots &lt; \text{rank}(u_p)$) and strictly decrease along the suffix ($\text{rank}(v_q) &gt; \dots &gt; \text{rank}(v_0)$) meeting at the maximum-rank apex vertex $m$!</p>
      </div>

      <h3>1. Online Query: Upward-Only Bidirectional Dijkstra</h3>
      <p>Because every shortest path has an up-down canonical representation in $G^*$, the online query runs two miniature Dijkstras simultaneously:</p>
      <ul>
        <li><strong>Forward Search from $s$ in $G^\\uparrow$:</strong> Only traverses outgoing edges $(u, x)$ where $\\text{rank}(x) &gt; \\text{rank}(u)$.</li>
        <li><strong>Backward Search from $t$ in $G^\\downarrow$:</strong> Only traverses incoming edges $(y, v)$ where $\\text{rank}(y) &gt; \\text{rank}(v)$.</li>
      </ul>
      <p>Because both searches strictly climb the hierarchy toward major highway arterials, the search trees contain only $\\approx 200$ vertices each! The true shortest path distance is $\\min_{m \\in V} (d^\\uparrow[m] + d^\\downarrow[m])$ over all meeting vertices $m$.</p>

      <h3>2. Edge-Difference Heuristic &amp; Hub Labeling (2-Hop Cover)</h3>
      <p>How do we choose the contraction order? Contracting a vertex $v$ deletes $\\text{deg}(v)$ incident edges and adds $s(v)$ shortcuts. Ordering vertices by a priority queue of <strong>Edge Difference</strong> $\\Delta(v) = s(v) - \\text{deg}(v)$ (plus contracted neighbor depth) keeps the total number of added shortcuts below $0.4 |E|$. Taking this one step further, <strong>Hub Labeling (Abraham et al. 2011)</strong> stores each vertex's tiny upward search space $L_f(s)$ and $L_b(t)$ as sorted arrays of <code>(hubId, dist)</code>, reducing shortest-path queries to a $0.5$-microsecond sorted-array merge intersection!</p>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 190" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Contraction Hierarchy Up-Down Path Meeting at Apex Highway Hub m</text>
          <defs>
            <marker id="arr-chup" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399"/></marker>
            <marker id="arr-chdn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8"/></marker>
          </defs>
          <!-- Rank guide lines -->
          <line x1="40" y1="55" x2="660" y2="55" stroke="#334155" stroke-dasharray="3,3"/>
          <text x="55" y="49" fill="#f59e0b" font-family="monospace" font-size="10">High Rank (Interstate Hubs)</text>
          <line x1="40" y1="155" x2="660" y2="155" stroke="#334155" stroke-dasharray="3,3"/>
          <text x="55" y="172" fill="#94a3b8" font-family="monospace" font-size="10">Low Rank (Local Streets)</text>

          <!-- Nodes -->
          <circle cx="110" cy="155" r="15" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="110" y="159" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">s</text>
          <circle cx="220" cy="105" r="16" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="220" y="109" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">u₁</text>
          <circle cx="350" cy="55" r="20" fill="#78350f" stroke="#f59e0b" stroke-width="2.5"/>
          <text x="350" y="59" fill="#fef3c7" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">m</text>
          <circle cx="480" cy="105" r="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="480" y="109" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">v₁</text>
          <circle cx="590" cy="155" r="15" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="590" y="159" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">t</text>

          <!-- Upward search -->
          <line x1="123" y1="147" x2="205" y2="112" stroke="#34d399" stroke-width="2.5" marker-end="url(#arr-chup)"/>
          <line x1="235" y1="98" x2="330" y2="62" stroke="#34d399" stroke-width="2.5" marker-end="url(#arr-chup)"/>
          <text x="195" y="75" fill="#34d399" font-family="monospace" font-size="11">Forward Search (G&uarr;)</text>

          <!-- Backward search -->
          <line x1="577" y1="147" x2="495" y2="112" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arr-chdn)"/>
          <line x1="465" y1="98" x2="370" y2="62" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arr-chdn)"/>
          <text x="455" y="75" fill="#38bdf8" font-family="monospace" font-size="11">Backward Search (G&darr;)</text>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Order["Order vertices by Edge Difference (shortcuts - deg)"] --> Contract["Contract v: add shortcut (u,w) if witness Dijkstra > w(u,v)+w(v,w)"]
        Contract --> Query["Online Query(s, t): run Upward Dijkstra from s & t"]
        Query --> Meet["Best dist = min_m (dist_up[m] + dist_down[m])"]
      </div>

      <div class="simulator-mount" data-sim="sim-dijkstra-astar-grid"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Stall-on-Demand &amp; Unpacking Shortcuts</div>
        <p>To reconstruct the full turn-by-turn geometry of a route without storing path lists on every shortcut, each shortcut edge $e = (u, w)$ stores only a single 32-bit integer: <code>middleVertex = v</code>. Once the optimal meeting apex $m$ is found, a recursive in-order traversal unpacks $(u, w) \\to (u, v) + (v, w)$ in $O(|P|)$ time proportional to the number of edges on the final path!</p>
      </div>

      <h2>Complexity Matrix (Continental Road Network: ~50M Vertices)</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Routing Algorithm</th>
            <th>Preprocessing Time</th>
            <th>Visited Nodes / Query</th>
            <th>Query Latency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Standard Dijkstra</strong></td>
            <td><span class="badge-o1">0 s</span></td>
            <td><span class="badge-on">~25,000,000</span></td>
            <td>~3,500 ms</td>
          </tr>
          <tr>
            <td><strong>Bidirectional A* (Euclidean)</strong></td>
            <td><span class="badge-o1">0 s</span></td>
            <td><span class="badge-on">~1,200,000</span></td>
            <td>~180 ms</td>
          </tr>
          <tr>
            <td><strong>Contraction Hierarchies (CH)</strong></td>
            <td><span class="badge-onlogn">~8 min</span></td>
            <td><span class="badge-o1">~350</span></td>
            <td><strong>~0.3 ms</strong></td>
          </tr>
          <tr>
            <td><strong>Hub Labeling (HL / 2-Hop)</strong></td>
            <td><span class="badge-onlogn">~25 min</span></td>
            <td><span class="badge-o1">~80 hub comparisons</span></td>
            <td><strong>~0.0005 ms (0.5 µs)</strong></td>
          </tr>
        </tbody>
      </table>

      <h2>Production Implementation: CH Upward-Only Bidirectional Query &amp; Shortcut Unpacker</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;limits&gt;
#include &lt;algorithm&gt;

struct CHShortcutEdge {
    int to;
    long long weight;
    int middleVertex; // -1 if original road edge, else contracted vertex v
};

class ContractionHierarchyRouter {
public:
    ContractionHierarchyRouter(int n, std::vector&lt;int&gt; rankOrder,
                               std::vector&lt;std::vector&lt;CHShortcutEdge&gt;&gt; upFwd,
                               std::vector&lt;std::vector&lt;CHShortcutEdge&gt;&gt; upBwd)
        : numVertices(n), rank(std::move(rankOrder)),
          adjUp(std::move(upFwd)), revUp(std::move(upBwd)) {}

    long long queryDistance(int s, int t) const {
        constexpr long long INF = std::numeric_limits&lt;long long&gt;::max() / 4;
        std::vector&lt;long long&gt; dF(numVertices, INF), dB(numVertices, INF);
        using State = std::pair&lt;long long, int&gt;;
        std::priority_queue&lt;State, std::vector&lt;State&gt;, std::greater&lt;State&gt;&gt; pqF, pqB;

        dF[s] = 0; pqF.emplace(0, s);
        dB[t] = 0; pqB.emplace(0, t);
        long long best = INF;

        while (!pqF.empty() || !pqB.empty()) {
            if (!pqF.empty()) {
                auto [d, u] = pqF.top(); pqF.pop();
                if (d &lt;= dF[u] &amp;&amp; d &lt; best) {
                    best = std::min(best, d + dB[u]);
                    for (const auto&amp; e : adjUp[u]) {
                        if (rank[e.to] &gt; rank[u] &amp;&amp; d + e.weight &lt; dF[e.to]) {
                            dF[e.to] = d + e.weight;
                            pqF.emplace(dF[e.to], e.to);
                        }
                    }
                }
            }
            if (!pqB.empty()) {
                auto [d, u] = pqB.top(); pqB.pop();
                if (d &lt;= dB[u] &amp;&amp; d &lt; best) {
                    best = std::min(best, dF[u] + d);
                    for (const auto&amp; e : revUp[u]) {
                        if (rank[e.to] &gt; rank[u] &amp;&amp; d + e.weight &lt; dB[e.to]) {
                            dB[e.to] = d + e.weight;
                            pqB.emplace(dB[e.to], e.to);
                        }
                    }
                }
            }
        }
        return best == INF ? -1 : best;
    }

private:
    int numVertices;
    std::vector&lt;int&gt; rank;
    std::vector&lt;std::vector&lt;CHShortcutEdge&gt;&gt; adjUp, revUp;
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Stopping Bidirectional CH on the First Meeting Vertex</div>
        <p>In both standard Bidirectional Dijkstra and Contraction Hierarchies, the <strong>first</strong> vertex $v$ reached by both the forward and backward searches is <em>not</em> necessarily the optimal apex $m$! You must maintain an upper bound <code>best = min(best, dF[u] + dB[u])</code> and continue expanding each queue until its minimum key exceeds <code>best</code>.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Contraction Hierarchies (CH) contract vertices in increasing order of importance, adding a shortcut (u, w) whenever u -> v -> w is the unique shortest path between higher-rank neighbors.",
      "Every shortest path in the shortcut-augmented graph has a canonical up-down form that climbs in rank from s to an apex m and descends in rank from m to t.",
      "Online CH queries run bidirectional Dijkstra restricted strictly to upward edges (rank[next] > rank[cur]), visiting ~350 nodes instead of 50 million.",
      "Storing a single middleVertex integer per shortcut enables recursive unpacking into the full original road geometry in O(|path|) time."
    ],
    furtherReading: [
      { title: "Geisberger, R., Sanders, P., Schultes, D., & Delling, D. (2008) — Contraction Hierarchies: Faster and Simpler Hierarchical Routing in Road Networks", url: "https://doi.org/10.1007/978-3-540-68552-4_24" },
      { title: "Bast, H. et al. (2016) — Route Planning in Transportation Networks (Microsoft Research / KIT Survey)", url: "https://doi.org/10.1007/978-3-319-49487-6_2" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 22: Single-Source Shortest Paths", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
    ]
  },

  "build-astar-bidirectional-router": {
    title: "Build Lab: A* and Bidirectional Dijkstra Pathfinding Engine with Consistent Potentials",
    video: {
      youtubeId: "-L-WgKMFuhE",
      id: "-L-WgKMFuhE",
      url: "https://www.youtube.com/embed/-L-WgKMFuhE",
      title: "A* Pathfinding Algorithm: Heuristics, Open/Closed Priority Queues & Optimality",
      channel: "Sebastian Lague",
      duration: "13:34",
      start: 0,
      length: "13m",
      why: "Demonstrates frontier expansion, stopping criteria, and path reconstruction in heuristic and bidirectional routers."
    },
    intuition: "<p>In this Build Lab, we engineer a dual-mode <strong>A* and Bidirectional Dijkstra Pathfinding Engine</strong> equipped with timestamp-based zero-allocation array clearing and exact stopping-criterion invariants.</p><p>Two engineering bugs plague 90% of hand-rolled bidirectional and A* routers: (1) zeroing $O(V)$-sized `dist[]` and `visited[]` arrays on every query (which makes a $300$-node A* query take $O(V)$ time!), and (2) terminating Bidirectional Dijkstra the instant the two frontiers touch instead of waiting until $\\text{top}_F + \\text{top}_B \\ge \\mu$.</p>",
    content: `<div class="lesson-content">
      <h2>Engineering Invariants for Sub-Millisecond Routing</h2>
      <p>When a routing engine serves thousands of queries per second over a graph of $V = 10^6$ vertices, each individual query might touch only $k = 500$ vertices. Calling <code>std::fill(dist.begin(), dist.end(), INF)</code> at the start of every query touches $8\\text{ MB}$ of RAM ($O(V)$ work), destroying the sub-linear advantage of A* and Bidirectional Search!</p>

      <div class="invariant-box">
        <div class="box-title">Formal Invariant — Generation Timestamp Array &amp; Bidirectional Stopping Rule</div>
        <ol>
          <li><strong>$O(1)$ Generation-Counter Reset:</strong> Maintain a global <code>queryId</code> counter and an array <code>seenGen[0..V-1]</code>. Whenever vertex $u$ is accessed during query <code>queryId</code>, if <code>seenGen[u] != queryId</code>, lazily initialize <code>dist[u] = INF; parent[u] = -1; seenGen[u] = queryId;</code> on-the-fly in $O(1)$ time! Total memory touched per query is strictly $O(k)$ where $k$ is the number of visited vertices.</li>
          <li><strong>Exact Bidirectional Dijkstra Stopping Criterion:</strong> Let $\\mu$ be the minimum total path weight $d_F[w] + d_B[w]$ observed across any vertex $w$ reached by both directions so far (updated whenever an edge $(u, v)$ is relaxed and $v$ was already reached by the opposite search). The search can safely terminate if and only if:
            $$\\min_{x \\in Q_F} d_F[x] + \\min_{y \\in Q_B} d_B[y] \\ge \\mu$$
            At that moment, no unexpanded path can possibly have total weight $&lt; \\mu$.</li>
        </ol>
      </div>

      <h3>Consistent Symmetric Potentials for Bidirectional A*</h3>
      <p>In Bidirectional A*, the forward search targets $t$ using heuristic $h_F(u) \\approx \\delta(u, t)$, while the backward search targets $s$ using $h_B(u) \\approx \\delta(s, u)$. If we use $h_F$ and $h_B$ independently, their reduced edge weights $w_F(u, v) = w(u, v) - h_F(u) + h_F(v)$ and $w_B(u, v) = w(u, v) - h_B(v) + h_B(u)$ do not match! Goldberg and Harrelson (2005) proved that defining the <strong>average potential</strong>:</p>
      $$p_F(u) = \\frac{h_F(u) - h_B(u)}{2}, \\quad p_B(u) = -p_F(u) = \\frac{h_B(u) - h_F(u)}{2}$$
      <p>makes both directions run on the <strong>exact same consistent reduced weight function</strong> while preserving admissibility!</p>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 185" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="350" y="25" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">Why Bidirectional Dijkstra Cannot Stop on First Frontier Contact</text>
          <!-- Nodes -->
          <circle cx="95" cy="95" r="18" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
          <text x="95" y="99" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">s</text>
          <circle cx="350" cy="52" r="18" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
          <text x="350" y="56" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">A</text>
          <circle cx="260" cy="140" r="18" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
          <text x="260" y="144" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">B</text>
          <circle cx="440" cy="140" r="18" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
          <text x="440" y="144" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">C</text>
          <circle cx="605" cy="95" r="18" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="605" y="99" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">t</text>

          <!-- Top path s -> A -> t (5 + 5 = 10) -->
          <line x1="113" y1="90" x2="332" y2="55" stroke="#f87171" stroke-width="2"/>
          <text x="215" y="62" fill="#f87171" font-family="monospace" font-size="11">+5</text>
          <line x1="368" y1="55" x2="587" y2="90" stroke="#f87171" stroke-width="2"/>
          <text x="485" y="62" fill="#f87171" font-family="monospace" font-size="11">+5</text>
          <text x="350" y="88" fill="#fca5a5" font-family="monospace" font-size="10" text-anchor="middle">First contact at A: μ = 5+5 = 10</text>

          <!-- Bottom path s -> B -> C -> t (4 + 1 + 4 = 9) -->
          <line x1="112" y1="101" x2="242" y2="136" stroke="#34d399" stroke-width="2.5"/>
          <text x="170" y="135" fill="#34d399" font-family="monospace" font-size="11">+4</text>
          <line x1="278" y1="140" x2="422" y2="140" stroke="#34d399" stroke-width="2.5"/>
          <text x="350" y="133" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">+1 (bridge!)</text>
          <line x1="458" y1="136" x2="588" y2="101" stroke="#34d399" stroke-width="2.5"/>
          <text x="530" y="135" fill="#34d399" font-family="monospace" font-size="11">+4</text>
          <text x="350" y="172" fill="#34d399" font-family="monospace" font-size="11" text-anchor="middle">True shortest path s&rarr;B&rarr;C&rarr;t = 9 (found before topF + topB &ge; 10)</text>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Increment["++queryId (O(1) array reset)"] --> Step["Expand min(pqF.top(), pqB.top())"]
        Step --> Relax["On edge (u, v, w): update dF[v] & bestMu = min(bestMu, dF[u] + w + dB[v])"]
        Relax --> StopCheck{"pqF.top() + pqB.top() >= bestMu?"}
        StopCheck -- "No" --> Step
        StopCheck -- "Yes" --> Reconstruct["Splice s -> meetVertex -> t path"]
      </div>

      <div class="simulator-mount" data-sim="sim-dijkstra-astar-grid"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Zero-Fill Elimination via Epoch Stamps</div>
        <p>On a graph of $V = 10^6$ vertices, <code>std::vector<long long> dist(V, INF)</code> allocates and zeroes $8\\text{ MB}$ of heap memory, taking ~1.8 milliseconds per call just in <code>memset</code> page faults. Reusing a persistent workspace struct with <code>uint32_t epoch</code> and <code>vector<uint32_t> stamp(V, 0)</code> reduces per-query initialization time from $1.8\\text{ ms}$ to $0.4\\text{ nanoseconds}$ (a single <code>++epoch</code> instruction)!</p>
      </div>

      <h2>Complexity Matrix</h2>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Design Choice</th>
            <th>Initialization Time / Query</th>
            <th>Search Space ($D$ hops)</th>
            <th>Correctness Guarantee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Naive Re-allocated Dijkstra</strong></td>
            <td><span class="badge-on">O(V)</span> (<code>memset</code> bottleneck)</td>
            <td><span class="badge-on">O(b^D)</span></td>
            <td>Exact</td>
          </tr>
          <tr>
            <td><strong>Epoch-Stamped A* (Consistent $h$)</strong></td>
            <td><span class="badge-o1">O(1)</span> (<code>++epoch</code>)</td>
            <td><span class="badge-on">Focused beam</span></td>
            <td>Exact</td>
          </tr>
          <tr>
            <td><strong>Epoch-Stamped Bidirectional Dijkstra</strong></td>
            <td><span class="badge-o1">O(1)</span> (<code>++epoch</code>)</td>
            <td><span class="badge-on">O(2 · b^(D/2))</span></td>
            <td>Exact (with $\\text{top}_F + \\text{top}_B \\ge \\mu$)</td>
          </tr>
        </tbody>
      </table>

      <h2>Complete Implementation: Epoch-Stamped Bidirectional Router with Path Splicing</h2>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;limits&gt;
#include &lt;algorithm&gt;

struct RouterEdge { int to; long long weight; };

class BidirectionalRouter {
public:
    explicit BidirectionalRouter(int n)
        : numVertices(n), adj(n), revAdj(n),
          dF(n), dB(n), pF(n), pB(n), stampF(n, 0), stampB(n, 0) {}

    void addDirectedEdge(int u, int v, long long w) {
        adj[u].push_back({v, w});
        revAdj[v].push_back({u, w});
    }

    std::pair&lt;long long, std::vector&lt;int&gt;&gt; findShortestPath(int s, int t) {
        if (s == t) return {0, {s}};
        constexpr long long INF = std::numeric_limits&lt;long long&gt;::max() / 4;
        ++epoch;

        using State = std::pair&lt;long long, int&gt;;
        std::priority_queue&lt;State, std::vector&lt;State&gt;, std::greater&lt;State&gt;&gt; pqF, pqB;

        setF(s, 0, -1); pqF.emplace(0, s);
        setB(t, 0, -1); pqB.emplace(0, t);

        long long mu = INF;
        int meetNode = -1;

        while (!pqF.empty() &amp;&amp; !pqB.empty()) {
            if (pqF.top().first + pqB.top().first &gt;= mu) break;

            if (pqF.top().first &lt;= pqB.top().first) {
                auto [d, u] = pqF.top(); pqF.pop();
                if (d &gt; getF(u)) continue;
                for (const auto&amp; e : adj[u]) {
                    if (d + e.weight &lt; getF(e.to)) {
                        setF(e.to, d + e.weight, u);
                        pqF.emplace(d + e.weight, e.to);
                        if (stampB[e.to] == epoch &amp;&amp; d + e.weight + dB[e.to] &lt; mu) {
                            mu = d + e.weight + dB[e.to];
                            meetNode = e.to;
                        }
                    }
                }
            } else {
                auto [d, u] = pqB.top(); pqB.pop();
                if (d &gt; getB(u)) continue;
                for (const auto&amp; e : revAdj[u]) {
                    if (d + e.weight &lt; getB(e.to)) {
                        setB(e.to, d + e.weight, u);
                        pqB.emplace(d + e.weight, e.to);
                        if (stampF[e.to] == epoch &amp;&amp; dF[e.to] + d + e.weight &lt; mu) {
                            mu = dF[e.to] + d + e.weight;
                            meetNode = e.to;
                        }
                    }
                }
            }
        }

        if (meetNode == -1) return {-1, {}};
        std::vector&lt;int&gt; path;
        for (int cur = meetNode; cur != -1; cur = pF[cur]) path.push_back(cur);
        std::reverse(path.begin(), path.end());
        for (int cur = pB[meetNode]; cur != -1; cur = pB[cur]) path.push_back(cur);
        return {mu, path};
    }

private:
    int numVertices;
    uint32_t epoch = 0;
    std::vector&lt;std::vector&lt;RouterEdge&gt;&gt; adj, revAdj;
    std::vector&lt;long long&gt; dF, dB;
    std::vector&lt;int&gt; pF, pB;
    std::vector&lt;uint32_t&gt; stampF, stampB;

    long long getF(int u) const noexcept {
        return stampF[u] == epoch ? dF[u] : std::numeric_limits&lt;long long&gt;::max() / 4;
    }
    long long getB(int u) const noexcept {
        return stampB[u] == epoch ? dB[u] : std::numeric_limits&lt;long long&gt;::max() / 4;
    }
    void setF(int u, long long d, int p) noexcept { stampF[u] = epoch; dF[u] = d; pF[u] = p; }
    void setB(int u, long long d, int p) noexcept { stampB[u] = epoch; dB[u] = d; pB[u] = p; }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Using Outgoing Edges Instead of Reversed Edges in the Backward Search</div>
        <p>On a <strong>directed</strong> graph (e.g., road networks with one-way streets), the backward search from $t$ must traverse edges <em>backward</em> (in the transpose graph <code>revAdj</code> where edge $(u, v)$ is traversed from $v$ to $u$). Traversing forward outgoing edges from $t$ finds paths $t \\leadsto m$ instead of $m \\leadsto t$, routing cars the wrong way down one-way streets!</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Epoch-stamped distance arrays eliminate O(V) per-query initialization overhead, reducing reset cost to O(1) (`++epoch`) so sub-linear searches stay sub-linear.",
      "Bidirectional Dijkstra must continue until pqF.top().dist + pqB.top().dist >= bestMu; stopping when the frontiers first intersect can miss shorter bridge edges.",
      "On directed graphs, the backward search from t must expand along the reversed adjacency list revAdj.",
      "Splicing the forward predecessor chain s ~> meetNode with the backward successor chain meetNode ~> t reconstructs the exact shortest path in O(|path|) time."
    ],
    furtherReading: [
      { title: "Goldberg, A. V. & Harrelson, C. (2005) — Computing the Shortest Path: A* Search Meets Graph Theory", url: "https://doi.org/10.5555/1070432.1070455" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 22.3: Dijkstra's Algorithm", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "Russell & Norvig — Artificial Intelligence: A Modern Approach (4th Ed.), Ch. 3.4–3.5: Bidirectional & Heuristic Search", url: "https://aima.cs.berkeley.edu/" }
    ]
  }
});
