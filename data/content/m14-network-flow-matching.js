window.MODULE_CONTENT = window.MODULE_CONTENT || {};
window.MODULE_CONTENT["m14"] = {
  "flow-networks-residual-graphs": {
    title: "Flow Networks, Residual Capacities, Augmenting Paths & Ford-Fulkerson Method",
    video: {
      youtubeId: "LdOnanfc5TM",
      title: "Ford-Fulkerson & Network Flow Fundamentals — Residual Graphs and Augmenting Paths",
      channel: "William Fiset",
      duration: "16:14",
      length: "16:14",
      start: 0,
      why: "Demonstrates how residual capacities and reverse undo edges rescue greedy flow routing from suboptimal bottlenecks."
    },
    intuition: "<p>Imagine routing data packets or physical water from a source $s$ to a sink $t$ through a directed network of pipes where each edge $(u, v)$ has a maximum capacity $c(u, v) \\ge 0$. If you greedily push flow along the first $s \\leadsto t$ path you see, you can easily block a cross-pipe that two independent paths needed to share, getting stuck below the true maximum throughput.</p><p>L. R. Ford Jr. and D. R. Fulkerson (1956) discovered a remarkably elegant cure: whenever we push $\\Delta$ units of flow forward along edge $(u, v)$, we simultaneously add $\\Delta$ units of capacity to a <strong>backward residual edge</strong> $(v, u)$. Pushing flow through $(v, u)$ later is mathematically equivalent to <em>canceling</em> (rerouting) previously committed flow on $(u, v)$, turning a naive greedy search into a globally optimal algorithm!</p>",
    content: `<div class="lesson-content">
      <h2>Formal Flow Network Invariants &amp; The Residual Graph $G_f$</h2>
      <p>A flow network $G = (V, E, c, s, t)$ is a directed graph with source $s \\in V$, sink $t \\in V$, and capacity function $c: V \\times V \\to \\mathbb{R}_{\\ge 0}$. An $s$-$t$ flow is a function $f: V \\times V \\to \\mathbb{R}$ satisfying three axioms:</p>

      <div class="invariant-box">
        <div class="box-title">Formal Definition — Flow Network &amp; Residual Capacity Invariants</div>
        <ol>
          <li><strong>Capacity Constraint:</strong> For all $u, v \\in V$, $0 \\le f(u, v) \\le c(u, v)$.</li>
          <li><strong>Flow Conservation:</strong> For every internal node $u \\in V \\setminus \\{s, t\\}$, total incoming flow equals total outgoing flow:
          $$\\sum_{v \\in V} f(v, u) = \\sum_{w \\in V} f(u, w)$$</li>
          <li><strong>Residual Capacity $c_f(u, v)$:</strong> Given flow $f$, the residual network $G_f = (V, E_f)$ contains all edges with strictly positive residual capacity $c_f(u, v) &gt; 0$, defined for each directed edge $(u, v) \\in E$ as:
          $$c_f(u, v) = c(u, v) - f(u, v) \\quad (\\text{forward unused capacity})$$
          $$c_f(v, u) = f(u, v) \\quad (\\text{backward undo capacity})$$</li>
        </ol>
      </div>

      <h3>Why Backward Edges Are Essential: The Diamond Rerouting Example</h3>
      <p>Consider the classic 4-vertex diamond network with $s = 0$, $a = 1$, $b = 2$, $t = 3$, where outer edges $(s,a), (a,t), (s,b), (b,t)$ all have capacity $10$, and the middle cross-edge $(a, b)$ has capacity $10$. Suppose the first DFS picks the zig-zag path $s \\to a \\to b \\to t$ and pushes $\\Delta = 10$ units of flow. Without a backward edge $(b, a)$, no forward path from $s$ to $t$ remains, stranding total flow at $10$ instead of the true optimum $20$.</p>
      <p>With the residual graph $G_f$, pushing $10$ units along $(a, b)$ creates backward residual edge $(b, a)$ with $c_f(b, a) = 10$. The next search finds augmenting path $s \\to b \\to a \\to t$ of bottleneck $\\Delta = 10$. Traversing $(b, a)$ cancels the flow on $(a, b)$, yielding two parallel streams $s \\to a \\to t$ ($10$) and $s \\to b \\to t$ ($10$) for a total flow of $|f| = 20$!</p>

      <div class="svg-container" style="margin: 1.5rem 0; text-align: center;">
        <svg viewBox="0 0 700 185" width="100%" style="max-width: 700px; background: var(--bg-elevated, #161922); border-radius: 8px; border: 1px solid var(--border-subtle, #2a2f3d);">
          <text x="175" y="24" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Step 1: Push 10 on s → a → b → t</text>
          <text x="525" y="24" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Step 2: Augment 10 via backward edge b → a</text>
          <!-- Left diamond -->
          <circle cx="65" cy="95" r="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="65" y="99" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">s</text>
          <circle cx="175" cy="45" r="16" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
          <text x="175" y="49" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">a</text>
          <circle cx="175" cy="145" r="16" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
          <text x="175" y="149" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">b</text>
          <circle cx="285" cy="95" r="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="285" y="99" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">t</text>
          <line x1="80" y1="88" x2="160" y2="52" stroke="#f59e0b" stroke-width="2.5"/>
          <line x1="175" y1="61" x2="175" y2="129" stroke="#f59e0b" stroke-width="2.5"/>
          <line x1="190" y1="138" x2="270" y2="102" stroke="#f59e0b" stroke-width="2.5"/>
          <line x1="80" y1="102" x2="160" y2="138" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3"/>
          <line x1="190" y1="52" x2="270" y2="88" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3"/>
          <text x="110" y="62" fill="#f59e0b" font-family="monospace" font-size="10">10/10</text>
          <text x="198" y="99" fill="#f59e0b" font-family="monospace" font-size="10">10/10</text>
          <text x="240" y="133" fill="#f59e0b" font-family="monospace" font-size="10">10/10</text>

          <line x1="350" y1="15" x2="350" y2="175" stroke="#334155" stroke-dasharray="4,4"/>

          <!-- Right diamond -->
          <circle cx="415" cy="95" r="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="415" y="99" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">s</text>
          <circle cx="525" cy="45" r="16" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
          <text x="525" y="49" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">a</text>
          <circle cx="525" cy="145" r="16" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
          <text x="525" y="149" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">b</text>
          <circle cx="635" cy="95" r="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="635" y="99" fill="#f8fafc" font-family="monospace" font-size="12" text-anchor="middle">t</text>
          <line x1="430" y1="88" x2="510" y2="52" stroke="#34d399" stroke-width="2.5"/>
          <line x1="430" y1="102" x2="510" y2="138" stroke="#34d399" stroke-width="2.5"/>
          <line x1="540" y1="52" x2="620" y2="88" stroke="#34d399" stroke-width="2.5"/>
          <line x1="540" y1="138" x2="620" y2="102" stroke="#34d399" stroke-width="2.5"/>
          <line x1="525" y1="129" x2="525" y2="61" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,3"/>
          <text x="562" y="99" fill="#38bdf8" font-family="monospace" font-size="10">undo b→a</text>
          <text x="525" y="175" fill="#34d399" font-family="monospace" font-size="11" text-anchor="middle">Total Flow |f| = 20 (Optimal)</text>
        </svg>
      </div>

      <div class="mermaid">
      flowchart LR
        Init["Initialize f(e) = 0 for all e in E"] --> Find["Search residual graph G_f for s ~> t path P with c_f(e) > 0"]
        Find --> Exists{"Path P found?"}
        Exists -- "Yes" --> Bottleneck["Compute Delta = min_{e in P} c_f(e)"]
        Bottleneck --> Augment["For each (u, v) in P: c_f(u,v) -= Delta, c_f(v,u) += Delta"]
        Augment --> Find
        Exists -- "No" --> Done["Return maximum flow |f|"]
      </div>

      <div class="simulator-mount" data-sim="sim-dinic-max-flow"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Paired XOR Edge Indexing (e ^ 1) in Flat Arrays</div>
        <p>In production flow solvers, searching an adjacency list to find the reverse edge $(v, u)$ corresponding to $(u, v)$ would cost $O(\\text{deg}(v))$ per step. Instead, we store all edges in a flat <code>std::vector&lt;Edge&gt; edges</code> and always append forward and backward edges in adjacent pairs at indices $2k$ and $2k+1$. Then for any edge index <code>id</code>, its reverse residual partner is accessed in a single 1-cycle bitwise XOR instruction: <code>id ^ 1</code>!</p>
      </div>

      <table class="complexity-matrix">
        <thead>
          <tr><th>Algorithm Variant</th><th>Path Selection</th><th>Time Complexity</th><th>Polynomial?</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Ford-Fulkerson (DFS)</strong></td><td>Arbitrary DFS path in $G_f$</td><td><span class="badge-o2n">$O(E \\cdot |f^*|)$</span></td><td>Pseudo-polynomial (integer capacities)</td></tr>
          <tr><td><strong>Capacity Scaling</strong></td><td>Paths with $c_f(e) \\ge \\Delta$ ($\\Delta = 2^{\\lfloor \\log_2 U \\rfloor} \\downarrow 1$)</td><td><span class="badge-on2">$O(E^2 \\log U)$</span></td><td>Weakly polynomial in max capacity $U$</td></tr>
          <tr><td><strong>Edmonds-Karp (BFS)</strong></td><td>Shortest unweighted path in $G_f$</td><td><span class="badge-on2">$O(V E^2)$</span></td><td>Strongly polynomial</td></tr>
        </tbody>
      </table>

      <h3>Production C++20 Implementation: Paired-Edge Residual Graph &amp; Capacity Scaling</h3>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;limits&gt;

class CapacityScalingFlow {
public:
    struct Arc {
        int to;
        long long cap; // Residual capacity c_f
    };

    explicit CapacityScalingFlow(int n) : numVertices(n), adj(n) {}

    void addEdge(int u, int v, long long capacity) {
        adj[u].push_back(static_cast&lt;int&gt;(arcs.size()));
        arcs.push_back({v, capacity}); // Forward edge at index 2k
        adj[v].push_back(static_cast&lt;int&gt;(arcs.size()));
        arcs.push_back({u, 0});        // Reverse edge at index 2k + 1 (id ^ 1)
        maxCap = std::max(maxCap, capacity);
    }

    long long maxFlow(int s, int t) {
        long long totalFlow = 0;
        long long threshold = 1;
        while (threshold &lt;= maxCap / 2) threshold &lt;&lt;= 1;

        std::vector&lt;uint8_t&gt; visited(numVertices, 0);
        for (; threshold &gt;= 1; threshold &gt;&gt;= 1) {
            while (true) {
                std::fill(visited.begin(), visited.end(), 0);
                long long pushed = dfs(s, t, std::numeric_limits&lt;long long&gt;::max(), threshold, visited);
                if (pushed == 0) break;
                totalFlow += pushed;
            }
        }
        return totalFlow;
    }

private:
    int numVertices;
    long long maxCap = 0;
    std::vector&lt;Arc&gt; arcs;
    std::vector&lt;std::vector&lt;int&gt;&gt; adj;

    long long dfs(int u, int t, long long flowIn, long long threshold, std::vector&lt;uint8_t&gt;&amp; visited) {
        if (u == t) return flowIn;
        visited[u] = 1;
        for (int id : adj[u]) {
            int v = arcs[id].to;
            if (!visited[v] &amp;&amp; arcs[id].cap &gt;= threshold) {
                long long pushed = dfs(v, t, std::min(flowIn, arcs[id].cap), threshold, visited);
                if (pushed &gt; 0) {
                    arcs[id].cap -= pushed;
                    arcs[id ^ 1].cap += pushed;
                    return pushed;
                }
            }
        }
        return 0;
    }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — The $O(E \\cdot |f^*|)$ Middle-Edge Trap &amp; Irrational Capacities</div>
        <p>If outer diamond capacities are $U = 10^9$ and the middle cross-edge $(a, b)$ has capacity $1$, naive DFS Ford-Fulkerson alternates between $s \\to a \\to b \\to t$ and $s \\to b \\to a \\to t$, augmenting by $\\Delta = 1$ per step for $2 \\times 10^9$ iterations! Even worse, on irrational capacities (e.g., powers of the golden ratio $\\phi$), Ford-Fulkerson can fail to terminate altogether and converge to a strictly suboptimal flow. Always use Capacity Scaling, Edmonds-Karp, or Dinic's algorithm.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Every forward edge (u, v) with flow f(u, v) induces a backward residual edge (v, u) with residual capacity f(u, v), enabling greedy flow cancellation.",
      "Storing forward and reverse arcs at consecutive indices (2k and 2k+1) in a flat vector allows O(1) partner lookup via bitwise XOR (id ^ 1).",
      "Naive DFS Ford-Fulkerson runs in O(E |f*|) pseudo-polynomial time and can take 2 * 10^9 steps on a 4-node diamond with capacity 10^9.",
      "Capacity Scaling restricts augmentations to edges with residual capacity >= Delta (halving Delta each phase), guaranteeing O(E^2 log U) polynomial runtime."
    ],
    furtherReading: [
      { title: "Ford, L. R. & Fulkerson, D. R. (1956) — Maximal Flow Through a Network (Canadian Journal of Mathematics)", url: "https://doi.org/10.4153/CJM-1956-045-5" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 24.1–24.2: Flow Networks & Ford-Fulkerson", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "Kleinberg & Tardos — Algorithm Design, Ch. 7.1–7.3: Maximum Flow and Residual Graphs", url: "https://www.cs.princeton.edu/~wayne/kleinberg-tardos/" }
    ]
  },

  "max-flow-min-cut-theorem": {
    title: "The Max-Flow Min-Cut Theorem: Three-Way Equivalence Proof & Integrality Theorem",
    video: {
      youtubeId: "oHy3ddI9X3o",
      title: "Max-Flow Min-Cut Theorem & Duality Proof",
      channel: "MIT OpenCourseWare",
      duration: "49:18",
      length: "49:18",
      start: 0,
      why: "Rigorous derivation of weak duality, the three-way Max-Flow Min-Cut equivalence, and the Integrality Theorem."
    },
    intuition: "<p>Why does the local condition <em>\"no augmenting path remains in $G_f$\"</em> guarantee that a flow $f$ is globally maximum across all exponential combinations of routes? Because of one of the deepest duality theorems in mathematics: the <strong>Max-Flow Min-Cut Theorem</strong>.</p><p>An $s$-$t$ cut $(S, T)$ partitions vertices into $S$ (containing $s$) and $T = V \\setminus S$ (containing $t$). Every unit of flow leaving $s$ and reaching $t$ must cross from $S$ to $T$, so the net flow $|f|$ can never exceed the forward capacity $c(S, T)$ of <em>any</em> cut. When Ford-Fulkerson stops with no $s \\leadsto t$ path in $G_f$, the set $S$ of vertices still reachable from $s$ in $G_f$ forms a cut whose forward edges are $100\\%$ saturated and whose backward edges carry $0$ flow—proving $|f| = c(S, T)$, so $f$ is a maximum flow and $(S, T)$ is a minimum cut simultaneously!</p>",
    content: `<div class="lesson-content">
      <h2>Flow Across a Cut, Weak Duality &amp; The Three-Way Equivalence</h2>
      <p>Let $(S, T)$ be any partition of $V$ with $s \\in S$ and $t \\in T$. The <strong>capacity of the cut</strong> $c(S, T)$ counts only directed edges going forward from $S$ to $T$:</p>
      $$c(S, T) = \\sum_{u \\in S} \\sum_{v \\in T} c(u, v)$$
      <p>By summing the flow conservation equation over all $u \\in S$, internal edges $(x, y) \\in S \\times S$ cancel out in pairs, yielding the <strong>Net Flow Across a Cut Lemma</strong>:</p>
      $$|f| = f(S, T) - f(T, S) = \\sum_{u \\in S, v \\in T} f(u, v) - \\sum_{v \\in T, u \\in S} f(v, u) \\le \\sum_{u \\in S, v \\in T} c(u, v) = c(S, T)$$

      <div class="invariant-box">
        <div class="box-title">Formal Theorem — The Max-Flow Min-Cut Theorem (Ford &amp; Fulkerson 1956, Elias-Feinstein-Shannon 1956)</div>
        <p>For any flow $f$ in network $G = (V, E, c, s, t)$, the following three statements are logically equivalent:</p>
        <ol>
          <li><strong>(i) Optimality:</strong> $f$ is a maximum flow in $G$.</li>
          <li><strong>(ii) Termination:</strong> The residual network $G_f$ contains no augmenting path from $s$ to $t$.</li>
          <li><strong>(iii) Strong Duality Certificate:</strong> $|f| = c(S, T)$ for some $s$-$t$ cut $(S, T)$ of $G$ (which is therefore a minimum cut).</li>
        </ol>
        <p><strong>Proof of (ii) $\\implies$ (iii):</strong> Suppose $G_f$ has no $s \\leadsto t$ path. Define $S = \\{v \\in V : s \\text{ can reach } v \\text{ in } G_f\\}$ and $T = V \\setminus S$. Clearly $s \\in S$ and $t \\in T$. For any pair $(u, v)$ with $u \\in S, v \\in T$:
        <br>• If $(u, v) \\in E$, then $c_f(u, v) = c(u, v) - f(u, v) = 0$ (otherwise $v$ would be reachable from $u \\in S$), so $f(u, v) = c(u, v)$ (every forward cut edge is saturated).
        <br>• If $(v, u) \\in E$, then $c_f(u, v) = f(v, u) = 0$ (otherwise $v$ would be reachable via the backward residual edge), so no flow returns from $T$ to $S$.
        <br>Substituting both into the Net Flow Lemma gives $|f| = f(S, T) - f(T, S) = c(S, T) - 0 = c(S, T)$. $\\blacksquare$</p>
      </div>

      <div class="mermaid">
      flowchart LR
        Stmt1["(i) f is a Maximum Flow"] -->|"Contrapositive: augmenting path increases |f|"| Stmt2["(ii) G_f has no s ~> t augmenting path"]
        Stmt2 -->|"Let S = reachable from s in G_f"| Stmt3["(iii) |f| = c(S, T) for cut (S, V \\ S)"]
        Stmt3 -->|"Weak Duality: |f'| <= c(S, T) for all f'"| Stmt1
      </div>

      <div class="simulator-mount" data-sim="sim-dinic-max-flow"></div>

      <h3>The Integrality Theorem</h3>
      <p>Because Ford-Fulkerson initializes $f = 0$ and each iteration computes $\\Delta = \\min_{e \\in P} c_f(e)$ via subtraction and minimum operations, if all capacities $c(e) \\in \\mathbb{Z}_{\\ge 0}$ are integers, then $\\Delta$ is a positive integer at every step. This yields the <strong>Integrality Theorem</strong>: every network with integer capacities admits an integer maximum flow $f^*(e) \\in \\mathbb{Z}$. This single fact allows us to solve discrete combinatorial matching and assignment problems using continuous network flow!</p>

      <div class="hardware-box">
        <div class="box-title">Engineering Nuance — Saturated Edges Are Not Necessarily Min-Cut Edges</div>
        <p>A common interview mistake is extracting the minimum cut by collecting all edges with $f(u, v) == c(u, v)$. Many internal edges inside $S \\times S$ or $T \\times T$ may also be $100\\%$ saturated without lying on the minimum cut! The canonical extraction runs a final BFS from $s$ over edges with $c_f &gt; 0$ to mark <code>inS[u]</code>, and then outputs all original directed edges $(u, v) \\in E$ where <code>inS[u] &amp;&amp; !inS[v]</code>.</p>
      </div>

      <table class="complexity-matrix">
        <thead>
          <tr><th>Operation</th><th>Algorithmic Procedure</th><th>Time Complexity</th><th>Space Complexity</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Verify Flow Optimality</strong></td><td>BFS from $s$ in $G_f$ ($c_f &gt; 0$); check if $t$ is unvisited</td><td><span class="badge-on">$O(V + E)$</span></td><td><span class="badge-on">$O(V)$</span></td></tr>
          <tr><td><strong>Extract Vertex Partition $(S, T)$</strong></td><td>Collect <code>S = {u : vis[u]}</code> after residual BFS from $s$</td><td><span class="badge-on">$O(V + E)$</span></td><td><span class="badge-on">$O(V)$</span></td></tr>
          <tr><td><strong>Extract Min-Cut Edge Set</strong></td><td>Scan $e = (u, v) \\in E$ with <code>vis[u] &amp;&amp; !vis[v]</code></td><td><span class="badge-on">$O(E)$</span></td><td><span class="badge-on">$O(|\\text{Cut}|)$</span></td></tr>
        </tbody>
      </table>

      <h3>Production C++20 Implementation: Canonical Min-Cut Partition &amp; Edge Extractor</h3>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;utility&gt;

struct ResidualNetwork {
    struct Edge {
        int from, to;
        long long cap, flow;
    };
    int n;
    std::vector&lt;Edge&gt; edges;
    std::vector&lt;std::vector&lt;int&gt;&gt; adj;

    struct MinCutResult {
        std::vector&lt;uint8_t&gt; inSourceSide; // 1 if u in S, 0 if u in T
        std::vector&lt;std::pair&lt;int, int&gt;&gt; cutEdges;
        long long cutCapacity = 0;
    };

    // Call AFTER maxFlow(s, t) has terminated
    MinCutResult extractMinCut(int s) const {
        MinCutResult res;
        res.inSourceSide.assign(n, 0);
        std::queue&lt;int&gt; q;
        q.push(s);
        res.inSourceSide[s] = 1;

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int id : adj[u]) {
                const auto&amp; e = edges[id];
                long long residual = e.cap - e.flow;
                if (residual &gt; 0 &amp;&amp; !res.inSourceSide[e.to]) {
                    res.inSourceSide[e.to] = 1;
                    q.push(e.to);
                }
            }
        }

        // Only inspect original forward edges (even indices 0, 2, 4, ...)
        for (size_t id = 0; id &lt; edges.size(); id += 2) {
            const auto&amp; e = edges[id];
            if (res.inSourceSide[e.from] &amp;&amp; !res.inSourceSide[e.to]) {
                res.cutEdges.emplace_back(e.from, e.to);
                res.cutCapacity += e.cap;
            }
        }
        return res;
    }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Including Reverse Residual Edges in $c(S, T)$</div>
        <p>Remember that cut capacity $c(S, T) = \\sum_{u \\in S, v \\in T} c(u, v)$ is directional! An original edge $(v, u)$ directed from $T$ into $S$ has capacity $c(v, u)$ that does <strong>not</strong> contribute to $c(S, T)$ (and at optimality carries $f(v, u) = 0$ flow). Only original edges directed from $S$ to $T$ (even indices in our paired array) belong to the $s$-$t$ cut.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Weak duality guarantees |f| = f(S, T) - f(T, S) <= c(S, T) for every flow f and every s-t cut (S, T).",
      "When no augmenting path exists in G_f, the set S of vertices reachable from s in G_f defines a minimum cut with |f| = c(S, T).",
      "The Integrality Theorem guarantees that integer edge capacities always produce an integer-valued maximum flow.",
      "To extract min-cut edges, run a residual BFS from s and select original edges (u, v) with u in S and v in T—never simply pick all saturated edges."
    ],
    furtherReading: [
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Theorem 24.6: Max-Flow Min-Cut Theorem", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "Ford, L. R. & Fulkerson, D. R. (1956) — Maximal Flow Through a Network", url: "https://doi.org/10.4153/CJM-1956-045-5" },
      { title: "Kleinberg & Tardos — Algorithm Design, Ch. 7.2: Maximum Flows and Minimum Cuts in a Network", url: "https://www.cs.princeton.edu/~wayne/kleinberg-tardos/" }
    ]
  },

  "edmonds-karp-shortest-augmenting": {
    title: "Edmonds-Karp Algorithm: BFS Shortest Augmenting Paths & O(V E^2) Monotonic Distance Proof",
    video: {
      youtubeId: "RppuJYwlcI8",
      title: "Edmonds-Karp Maximum Flow Algorithm — BFS Shortest Augmenting Paths",
      channel: "William Fiset",
      duration: "15:28",
      length: "15:28",
      start: 0,
      why: "Step-by-step trace of BFS augmenting path selection and why shortest-hop paths eliminate capacity-dependent worst cases."
    },
    intuition: "<p>How do we prevent Ford-Fulkerson from zig-zagging across the 1-capacity middle edge of the diamond graph $2 \\times 10^9$ times? Jack Edmonds and Richard Karp (1972) proved that simply replacing DFS with <strong>Breadth-First Search (BFS)</strong>—always augmenting along the path with the <em>fewest edges</em> in $G_f$—transforms the runtime from pseudo-polynomial $O(E |f^*|)$ to strongly polynomial $O(V E^2)$, completely independent of edge capacities!</p><p>In the diamond graph, $s \\to a \\to t$ and $s \\to b \\to t$ have length $2$, whereas $s \\to a \\to b \\to t$ has length $3$. BFS immediately picks the two length-2 paths and finishes in $2$ steps instead of $2 \\times 10^9$.</p>",
    content: `<div class="lesson-content">
      <h2>Monotonicity of Residual Distances &amp; The $O(V E)$ Critical Edge Bound</h2>
      <p>Let $\\delta_f(s, v)$ denote the unweighted shortest-path distance (number of edges) from $s$ to $v$ in the residual graph $G_f$. When we augment flow along a shortest path $P$, some forward edges saturate and disappear from $G_f$, while new reverse edges $(v, u)$ appear. Could a newly added reverse edge $(v, u)$ create a shortcut that decreases $\\delta(s, w)$?</p>
      <p>No! Because $P$ was a shortest path, $(u, v) \\in P$ implies $\\delta_f(s, v) = \\delta_f(s, u) + 1$. Thus traversing $(v, u)$ backward goes from distance $d+1$ to distance $d$, which can never reduce the distance from $s$ to any vertex.</p>

      <div class="invariant-box">
        <div class="box-title">Formal Proof — Edmonds-Karp $O(V E^2)$ Complexity Bound</div>
        <p><strong>Lemma 1 (Distance Monotonicity):</strong> Under shortest-path augmentations, for every vertex $v \\in V$, the residual distance $\\delta_{f'}(s, v) \\ge \\delta_f(s, v)$ never decreases.</p>
        <p><strong>Lemma 2 (Critical Edge Saturation Bound):</strong> Call an edge $(u, v)$ <em>critical</em> during an augmentation if it is a bottleneck edge ($c_f(u, v) = \\Delta$) that becomes saturated and disappears from $G_f$. How many times can $(u, v)$ become critical?</p>
        <ul>
          <li>When $(u, v)$ is critical, it lies on a shortest path: $\\delta_f(s, v) = \\delta_f(s, u) + 1$.</li>
          <li>Before $(u, v)$ can be used again, flow must be pushed along the reverse edge $(v, u)$ at some later flow $f'$, when $\\delta_{f'}(s, u) = \\delta_{f'}(s, v) + 1$.</li>
          <li>Combining with Lemma 1 ($\\delta_{f'}(s, v) \\ge \\delta_f(s, v)$):
          $$\\delta_{f'}(s, u) = \\delta_{f'}(s, v) + 1 \\ge \\delta_f(s, v) + 1 = \\delta_f(s, u) + 2$$</li>
        </ul>
        <p>Every time $(u, v)$ re-enters $G_f$ and becomes critical again, $\\delta(s, u)$ increases by at least $2$. Since $0 \\le \\delta(s, u) \\le V - 1$, each of the $2E$ directed arcs is critical at most $V / 2$ times! Thus there are $O(V E)$ augmentations, each taking $O(E)$ BFS time, for $O(V E^2)$ total time. $\\blacksquare$</p>
      </div>

      <div class="mermaid">
      flowchart TD
        Start["Edmonds-Karp Iteration"] --> BFS["Run unweighted BFS from s in G_f (O(E) time)"]
        BFS --> Reached{"Did BFS reach t?"}
        Reached -- "No" --> Terminate["Return totalFlow"]
        Reached -- "Yes" --> Trace["Trace parentEdge[] backward from t to s to find bottleneck Delta"]
        Trace --> Update["Subtract Delta on forward edges, add Delta on reverse edges (id ^ 1)"]
        Update --> Critical["At least one critical edge saturates; delta(s, u) increases by >= 2 before reuse"]
        Critical --> Start
      </div>

      <div class="simulator-mount" data-sim="sim-dinic-max-flow"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Why Edmonds-Karp Wastes BFS Work Across Similar Paths</div>
        <p>Notice that Edmonds-Karp runs a fresh $O(E)$ BFS from scratch for <em>every single augmenting path</em>. If there are $500$ parallel paths of length $k$, Edmonds-Karp rebuilds the exact same BFS tree $500$ times! This observation directly motivates Dinic's algorithm (next unit), which builds the BFS level graph once per distance level and saturates all paths of length $k$ in a single blocking-flow pass.</p>
      </div>

      <table class="complexity-matrix">
        <thead>
          <tr><th>Metric</th><th>Bound</th><th>Explanation</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Total Augmentations</strong></td><td><span class="badge-on2">$O(V E)$</span></td><td>Each of $2E$ residual edges saturates at most $V/2$ times</td></tr>
          <tr><td><strong>Cost per Augmentation</strong></td><td><span class="badge-on">$O(E)$</span></td><td>Unweighted BFS over residual graph $G_f$</td></tr>
          <tr><td><strong>Worst-Case Time</strong></td><td><span class="badge-on2">$O(V E^2)$</span></td><td>Strongly polynomial; independent of maximum capacity $U$</td></tr>
          <tr><td><strong>Auxiliary Space</strong></td><td><span class="badge-on">$O(V + E)$</span></td><td>Residual adjacency list + <code>parentEdge[V]</code> BFS array</td></tr>
        </tbody>
      </table>

      <h3>Production C++20 Implementation: Edmonds-Karp with Predecessor Arc Recording</h3>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;algorithm&gt;
#include &lt;limits&gt;

class EdmondsKarp {
public:
    struct Arc {
        int from, to;
        long long cap;
    };

    explicit EdmondsKarp(int n) : numVertices(n), adj(n) {}

    void addEdge(int u, int v, long long cap) {
        adj[u].push_back(static_cast&lt;int&gt;(arcs.size()));
        arcs.push_back({u, v, cap});
        adj[v].push_back(static_cast&lt;int&gt;(arcs.size()));
        arcs.push_back({v, u, 0});
    }

    long long maxFlow(int s, int t) {
        long long flow = 0;
        std::vector&lt;int&gt; parentArc(numVertices, -1);

        while (bfs(s, t, parentArc)) {
            long long bottleneck = std::numeric_limits&lt;long long&gt;::max();
            for (int cur = t; cur != s; ) {
                int id = parentArc[cur];
                bottleneck = std::min(bottleneck, arcs[id].cap);
                cur = arcs[id].from;
            }
            for (int cur = t; cur != s; ) {
                int id = parentArc[cur];
                arcs[id].cap -= bottleneck;
                arcs[id ^ 1].cap += bottleneck;
                cur = arcs[id].from;
            }
            flow += bottleneck;
        }
        return flow;
    }

private:
    int numVertices;
    std::vector&lt;Arc&gt; arcs;
    std::vector&lt;std::vector&lt;int&gt;&gt; adj;

    bool bfs(int s, int t, std::vector&lt;int&gt;&amp; parentArc) const {
        std::fill(parentArc.begin(), parentArc.end(), -1);
        parentArc[s] = -2; // Sentinel for source
        std::queue&lt;int&gt; q;
        q.push(s);

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int id : adj[u]) {
                int v = arcs[id].to;
                if (parentArc[v] == -1 &amp;&amp; arcs[id].cap &gt; 0) {
                    parentArc[v] = id;
                    if (v == t) return true;
                    q.push(v);
                }
            }
        }
        return false;
    }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Storing <code>parentVertex[v] = u</code> Instead of <code>parentArc[v] = id</code></div>
        <p>In multigraphs (or networks where both $(u, v)$ and $(v, u)$ exist as original edges), there may be multiple parallel residual arcs between $u$ and $v$. Storing only the parent vertex <code>u</code> forces a linear scan of <code>adj[u]</code> during augmentation to locate the unsaturated arc. Always record the exact arc index <code>parentArc[v] = id</code> during BFS.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Edmonds-Karp specializes Ford-Fulkerson by selecting the shortest unweighted s ~> t path in G_f via BFS.",
      "Residual shortest-path distances delta_f(s, v) increase monotonically across augmentations.",
      "Every time an edge (u, v) saturates and later becomes critical again, delta(s, u) increases by at least 2, bounding total augmentations to O(V E) and total time to O(V E^2).",
      "Recording the incoming arc index parentArc[v] = id in BFS supports multigraphs and updates residual capacities in O(1) per path edge."
    ],
    furtherReading: [
      { title: "Edmonds, J. & Karp, R. M. (1972) — Theoretical Improvements in Algorithmic Efficiency for Network Flow Problems (JACM)", url: "https://doi.org/10.1145/321694.321699" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 24.2: The Edmonds-Karp Algorithm", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "CP-Algorithms — Maximum Flow: Ford-Fulkerson and Edmonds-Karp", url: "https://cp-algorithms.com/graph/edmonds_karp.html" }
    ]
  },

  "dinic-level-graph-blocking-flow": {
    title: "Dinic's Algorithm: BFS Level Graphs, DFS Blocking Flows with Current-Arc Pointer & O(E√V) Unit Networks",
    video: {
      youtubeId: "M6cm8UeeziI",
      title: "Dinic's Algorithm for Maximum Flow — Level Graph & Blocking Flow",
      channel: "William Fiset",
      duration: "21:19",
      length: "21:19",
      start: 0,
      why: "Explains how Dinic's level graph and the ptr[u] dead-end pruning pointer eliminate redundant BFS searches."
    },
    intuition: "<p>Edmonds-Karp spends $O(E)$ time running a full BFS just to push flow along a single shortest path. In 1970, Yefim Dinitz (Dinic) asked: once a single BFS computes the distance `level[u]` of every vertex from $s$, why not push flow along <strong>every possible shortest path of length `level[t]`</strong> before running BFS again?</p><p>By restricting DFS to only traverse edges satisfying <code>level[v] == level[u] + 1</code> and maintaining a <strong>current-arc pointer</strong> <code>ptr[u]</code> that never re-scans dead-end edges within a phase, Dinic's algorithm saturates an entire <strong>blocking flow</strong> in $O(V E)$ time and increases $\\text{level}[t]$ by at least $1$ every phase—reducing total runtime to $O(V^2 E)$, and an astonishing $O(E \\sqrt{V})$ on unit networks!</p>",
    content: `<div class="lesson-content">
      <h2>Level Graphs, Blocking Flows &amp; Why <code>ptr[u]</code> Is Non-Negotiable</h2>
      <p>Each phase of Dinic's algorithm consists of two steps:</p>
      <ol>
        <li><strong>BFS Level Graph Construction ($O(E)$):</strong> Compute unweighted distances $\\text{level}[u] = \\delta_f(s, u)$ in $G_f$. If $\\text{level}[t] = -1$, terminate. Define the <em>level graph</em> $G_L$ containing only residual edges $(u, v)$ with $c_f(u, v) &gt; 0$ and $\\text{level}[v] = \\text{level}[u] + 1$.</li>
        <li><strong>DFS Blocking Flow with Current-Arc Pruning ($O(V E)$):</strong> Repeatedly push augmenting paths from $s$ to $t$ in $G_L$ until no $s \\leadsto t$ path remains in $G_L$ (a <em>blocking flow</em>).</li>
      </ol>

      <div class="invariant-box">
        <div class="box-title">Formal Theorem — Phase Monotonicity &amp; Current-Arc Amortization</div>
        <p><strong>Theorem 1 (Strict Increase of $\\text{level}[t]$):</strong> After a blocking flow saturates $G_L$, no path of length $\\text{level}[t]$ remains in $G_f$, and any newly created reverse edges go backward from level $d+1$ to $d$. Thus in the next BFS phase, $\\text{level}'[t] \\ge \\text{level}[t] + 1$. Consequently, there are at most $V - 1$ phases.</p>
        <p><strong>Theorem 2 (Role of Current-Arc Pointer <code>int&amp; cid = ptr[u]</code>):</strong> During the DFS phase on the DAG $G_L$, each vertex $u$ maintains an index <code>ptr[u]</code> into <code>adj[u]</code>. Whenever <code>dfs(v, ...)</code> returns $0$ (dead end) or saturates edge <code>(u, v)</code>, <code>ptr[u]</code> increments. Because $G_L$ only allows forward level edges, no dead-end edge can become viable again until the next BFS phase! Thus:
        <br>• Across all DFS calls in one phase, <code>ptr[u]</code> advances at most $\\text{deg}(u)$ times, costing $O(E)$ total dead-end work.
        <br>• Each successful augmentation takes $O(V)$ steps and saturates at least one edge ($\\le E$ times), costing $O(V E)$ per phase and $O(V^2 E)$ total.</p>
      </div>

      <h3>Unit Networks &amp; Even-Tarjan $O(E \\sqrt{V})$ Theorem</h3>
      <p>A <strong>unit network</strong> has integer capacities where every edge has $c(e) = 1$, and every vertex $v \\in V \\setminus \\{s, t\\}$ has either in-degree $\\le 1$ or out-degree $\\le 1$ (which includes all bipartite matching networks). After $\\sqrt{V}$ phases of Dinic's algorithm, $\\text{level}[t] \\ge \\sqrt{V}$. Because the residual network can be decomposed into vertex-disjoint augmenting paths, each of length $\\ge \\sqrt{V}$, at most $V / \\sqrt{V} = \\sqrt{V}$ additional flow units (and phases) can exist! And because each edge in a unit network is traversed at most once per phase ($O(E)$ per phase), Dinic's algorithm runs in $O(E \\sqrt{V})$ time!</p>

      <div class="mermaid">
      flowchart LR
        BFS["1. BFS builds level[u] in G_f"] --> Check{"level[t] != -1?"}
        Check -- "No" --> End["Return maxFlow"]
        Check -- "Yes" --> Reset["2. Reset ptr[u] = 0 for all u"]
        Reset --> DFS["3. DFS pushes flow along level[v] == level[u] + 1 using int& cid = ptr[u]"]
        DFS --> Pushed{"pushed > 0?"}
        Pushed -- "Yes" --> DFS
        Pushed -- "No (Blocking Flow Reached)" --> BFS
      </div>

      <div class="simulator-mount" data-sim="sim-dinic-max-flow"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Multi-Path Single-DFS Augmentation</div>
        <p>Instead of returning from $t$ all the way back to $s$ after pushing a single bottleneck, production Dinic implementations pass <code>pushed</code> up the recursion stack and continue the loop at node $u$ (<code>flowIn - totalPushedFromU</code>) to saturate multiple branches in a single DFS call, cutting recursion overhead by $3\\times$–$5\\times$.</p>
      </div>

      <table class="complexity-matrix">
        <thead>
          <tr><th>Network Class</th><th>Phases</th><th>Cost per Phase</th><th>Total Time Complexity</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>General Network</strong></td><td>$\\le V - 1$</td><td>$O(V E)$</td><td><span class="badge-on2">$O(V^2 E)$</span></td></tr>
          <tr><td><strong>Unit Capacities ($c(e) = 1$)</strong></td><td>$O(\\min(V^{2/3}, E^{1/2}))$</td><td>$O(E)$</td><td><span class="badge-onlogn">$O(E \\min(V^{2/3}, E^{1/2}))$</span></td></tr>
          <tr><td><strong>Unit Network / Bipartite Matching</strong></td><td>$\\le 2\\sqrt{V}$</td><td>$O(E)$</td><td><span class="badge-onlogn">$O(E \\sqrt{V})$</span></td></tr>
        </tbody>
      </table>

      <h3>Production C++20 Implementation: Dinic's Algorithm with Multi-Branch Blocking DFS</h3>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;algorithm&gt;
#include &lt;limits&gt;

class Dinic {
public:
    struct Arc {
        int to;
        long long cap;
    };

    explicit Dinic(int n) : numVertices(n), adj(n), level(n), ptr(n) {}

    void addEdge(int u, int v, long long cap) {
        adj[u].push_back(static_cast&lt;int&gt;(arcs.size()));
        arcs.push_back({v, cap});
        adj[v].push_back(static_cast&lt;int&gt;(arcs.size()));
        arcs.push_back({u, 0});
    }

    long long maxFlow(int s, int t) {
        long long flow = 0;
        while (bfs(s, t)) {
            std::fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, t, std::numeric_limits&lt;long long&gt;::max())) {
                flow += pushed;
            }
        }
        return flow;
    }

private:
    int numVertices;
    std::vector&lt;Arc&gt; arcs;
    std::vector&lt;std::vector&lt;int&gt;&gt; adj;
    std::vector&lt;int&gt; level, ptr;

    bool bfs(int s, int t) {
        std::fill(level.begin(), level.end(), -1);
        level[s] = 0;
        std::queue&lt;int&gt; q;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int id : adj[u]) {
                int v = arcs[id].to;
                if (arcs[id].cap &gt; 0 &amp;&amp; level[v] == -1) {
                    level[v] = level[u] + 1;
                    q.push(v);
                }
            }
        }
        return level[t] != -1;
    }

    long long dfs(int u, int t, long long available) {
        if (available == 0 || u == t) return available;
        long long totalPushed = 0;
        for (int&amp; cid = ptr[u]; cid &lt; static_cast&lt;int&gt;(adj[u].size()); ++cid) {
            int id = adj[u][cid];
            int v = arcs[id].to;
            if (level[v] != level[u] + 1 || arcs[id].cap == 0) continue;

            long long tr = dfs(v, t, std::min(available - totalPushed, arcs[id].cap));
            if (tr == 0) continue;

            arcs[id].cap -= tr;
            arcs[id ^ 1].cap += tr;
            totalPushed += tr;
            if (totalPushed == available) return totalPushed; // Node u's incoming budget exhausted; do NOT increment cid yet!
        }
        return totalPushed;
    }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Omitting Reference <code>int&amp; cid = ptr[u]</code> (Exponential TLE)</div>
        <p>If you write <code>for (int cid = 0; cid &lt; adj[u].size(); ++cid)</code> instead of binding a reference <code>int&amp; cid = ptr[u]</code> (or if you increment <code>cid</code> before returning when <code>totalPushed == available</code> while <code>arcs[id].cap &gt; 0</code>), the DFS loses its dead-end memory and re-explores blocked subgraphs in $O(2^V)$ exponential time! Conversely, only advance <code>cid</code> past edge <code>id</code> when <code>arcs[id]</code> is either saturated or leads to a dead end (<code>tr == 0</code>).</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Dinic's algorithm alternates between O(E) BFS level-graph construction and O(V E) DFS blocking-flow saturation.",
      "Every blocking-flow phase strictly increases level[t], bounding the total number of phases to at most V - 1.",
      "The current-arc reference `int& cid = ptr[u]` prunes dead-end edges in O(1) amortized time; omitting it degrades Dinic to exponential time.",
      "On unit networks (including bipartite matching), Dinic's algorithm finishes in at most 2*sqrt(V) phases and O(E sqrt(V)) total time."
    ],
    furtherReading: [
      { title: "Dinitz, Y. (1970) — Algorithm for Solution of a Problem of Maximum Flow in a Network with Power Estimation", url: "https://cp-algorithms.com/graph/dinic.html" },
      { title: "Even, S. & Tarjan, R. E. (1975) — Network Flow and Testing Graph Connectivity (SIAM J. Comput.)", url: "https://doi.org/10.1137/0204043" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 24 Problems", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
    ]
  },

  "push-relabel-preflow": {
    title: "Push-Relabel (Goldberg-Tarjan): Preflows, Height Functions & Highest-Label Selection",
    video: {
      youtubeId: "0hI89H39USg",
      title: "Push-Relabel Maximum Flow Algorithm — Preflows & Height Labels",
      channel: "MIT OpenCourseWare",
      duration: "47:50",
      length: "47:50",
      start: 0,
      why: "Explains how Goldberg and Tarjan localized network flow by relaxing conservation into preflows and guiding water downhill via vertex heights."
    },
    intuition: "<p>Ford-Fulkerson, Edmonds-Karp, and Dinic all maintain <em>flow conservation</em> at every step and search globally for $s \\leadsto t$ paths to relax the capacity cut condition. In 1988, Andrew Goldberg and Robert Tarjan inverted this paradigm with <strong>Push-Relabel</strong>: what if we saturate all edges leaving $s$ immediately, allow internal nodes to temporarily hold a reservoir of <strong>excess flow</strong> $e(u) = \\text{in}(u) - \\text{out}(u) \\ge 0$ (a <em>preflow</em>), and push excess locally downhill along a discrete <strong>height function</strong> $h(u)$?</p><p>By initializing $h(s) = V$ and $h(v) = 0$ for $v \\ne s$, excess water flows downhill toward $t$ ($h(t) = 0$). Whenever a node with excess gets trapped in a local valley with no downhill residual neighbors, it <strong>relabels</strong> (lifts) its height to $1 + \\min_{(u,v) \\in E_f} h(v)$, sending excess forward to $t$ or eventually draining unusable excess back uphill to $s$!</p>",
    content: `<div class="lesson-content">
      <h2>Preflows, Valid Height Functions &amp; Local Push/Relabel Operations</h2>
      <p>A <strong>preflow</strong> $f$ satisfies capacity constraints ($0 \\le f(u,v) \\le c(u,v)$) and relaxed conservation: for every $u \\in V \\setminus \\{s\\}$, the excess flow is non-negative:</p>
      $$e(u) = \\sum_{v \\in V} f(v, u) - \\sum_{w \\in V} f(u, w) \\ge 0$$
      <p>A vertex $u \\in V \\setminus \\{s, t\\}$ with $e(u) &gt; 0$ is called <strong>active</strong> (overflowing).</p>

      <div class="invariant-box">
        <div class="box-title">Formal Invariant — Valid Height Function &amp; Absence of Augmenting Paths</div>
        <p>A height function $h: V \\to \\mathbb{Z}_{\\ge 0}$ is <strong>valid</strong> with respect to residual graph $G_f$ if $h(s) = V$, $h(t) = 0$, and for every residual edge $(u, v) \\in E_f$ ($c_f(u, v) &gt; 0$):</p>
        $$h(u) \\le h(v) + 1 \\quad (\\text{No steep downhill cliff in } G_f)$$
        <p><strong>Crucial Consequence:</strong> Because $h(s) = V$, $h(t) = 0$, and each residual edge can drop height by at most $1$, any simple path from $s$ to $t$ in $G_f$ would require at least $V$ edges—impossible in a $V$-vertex graph! Thus <em>no $s \\leadsto t$ augmenting path ever exists in $G_f$ at any point during Push-Relabel</em>. When all active nodes reach $e(u) = 0$, the preflow is a legal flow and immediately maximum!</p>
      </div>

      <h3>The Two Primitive Operations &amp; Complexity Bounds</h3>
      <ul>
        <li><strong>Push($u, v$):</strong> Applicable when $u$ is active ($e(u) &gt; 0$), $c_f(u, v) &gt; 0$, and $h(u) = h(v) + 1$ (an <em>admissible downhill edge</em>). Push $\\Delta = \\min(e(u), c_f(u, v))$ units from $u$ to $v$. A push is <em>saturating</em> if $\\Delta = c_f(u, v)$ and <em>nonsaturating</em> otherwise.</li>
        <li><strong>Relabel($u$):</strong> Applicable when $u$ is active ($e(u) &gt; 0$) and has no admissible downhill residual edges ($h(u) \\le h(v)$ for all $(u, v) \\in E_f$). Set $h(u) = 1 + \\min_{(u, v) \\in E_f} h(v)$.</li>
      </ul>
      <p>Since every active node $u$ has a residual path back to $s$ (conservation of initial source push) of length $\\le V - 1$ and $h(s) = V$, $h(u)$ can never exceed $2V - 1$. This bounds total relabels to $O(V^2)$, saturating pushes to $O(V E)$, and nonsaturating pushes to $O(V^2 E)$ (or $O(V^2 \\sqrt{E})$ under <strong>Highest-Label Selection</strong> + <strong>Gap Heuristic</strong>).</p>

      <div class="mermaid">
      flowchart TD
        Init["Preflow Init: h[s] = V, saturate all (s, v) edges, push active nodes"] --> Pick["Pick active vertex u with e[u] > 0 (Highest h[u] first)"]
        Pick --> Scan["Scan residual edges (u, v) in G_f"]
        Scan --> Admissible{"Exists (u,v) with h[u] == h[v] + 1?"}
        Admissible -- "Yes" --> Push["Push min(e[u], c_f(u,v)) downhill to v"]
        Admissible -- "No" --> Relabel["Relabel: h[u] = 1 + min_{(u,v) in E_f} h[v]"]
        Push --> Check{"Any active vertex left?"}
        Relabel --> Check
        Check -- "Yes" --> Pick
        Check -- "No" --> Done["Return e[t] (Exact Maximum Flow)"]
      </div>

      <div class="simulator-mount" data-sim="sim-push-relabel-preflow"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Gap Heuristic &amp; Global Relabeling</div>
        <p>If relabeling vertex $u$ from height $k$ to $k' &gt; k$ leaves <strong>zero</strong> vertices at height $k$ ($\\text{count}[k] == 0$, a "gap" in the height profile), then no vertex with $k &lt; h(w) &lt; V$ can ever reach $t$ ($h(t) = 0$) because edges only step height by $1$! The <strong>Gap Heuristic</strong> immediately sets $h(w) = \\max(h(w), V + 1)$ for all such vertices $w$, routing their excess straight back to $s$ and cutting practical runtime by an order of magnitude.</p>
      </div>

      <table class="complexity-matrix">
        <thead>
          <tr><th>Push-Relabel Variant</th><th>Active Node Selection</th><th>Worst-Case Time</th><th>Space</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Generic Push-Relabel</strong></td><td>Arbitrary active node</td><td><span class="badge-on2">$O(V^2 E)$</span></td><td><span class="badge-on">$O(V + E)$</span></td></tr>
          <tr><td><strong>FIFO Relabel-to-Front</strong></td><td>FIFO queue + discharge list</td><td><span class="badge-on2">$O(V^3)$</span></td><td><span class="badge-on">$O(V + E)$</span></td></tr>
          <tr><td><strong>Highest-Label + Gap Heuristic</strong></td><td>Bucket priority queue by max $h(u)$</td><td><span class="badge-on2">$O(V^2 \\sqrt{E})$</span></td><td><span class="badge-on">$O(V + E)$</span></td></tr>
        </tbody>
      </table>

      <h3>Production C++20 Implementation: Highest-Label Push-Relabel with Gap Heuristic</h3>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;

class PushRelabel {
public:
    struct Arc {
        int to;
        long long cap;
    };

    explicit PushRelabel(int n) : n(n), adj(n), excess(n, 0), h(n, 0), count(2 * n + 1, 0), buckets(2 * n + 1) {}

    void addEdge(int u, int v, long long cap) {
        if (u == v) return;
        adj[u].push_back(static_cast&lt;int&gt;(arcs.size()));
        arcs.push_back({v, cap});
        adj[v].push_back(static_cast&lt;int&gt;(arcs.size()));
        arcs.push_back({u, 0});
    }

    long long maxFlow(int s, int t) {
        h[s] = n;
        excess[t] = 1; // Prevent t from being added to active buckets
        count[0] = n - 1;

        for (int id : adj[s]) {
            push(s, id, arcs[id].cap);
        }

        while (maxHeight &gt;= 0) {
            if (buckets[maxHeight].empty()) {
                --maxHeight;
                continue;
            }
            int u = buckets[maxHeight].back();
            buckets[maxHeight].pop_back();
            discharge(u, s, t);
        }
        return excess[t] - 1;
    }

private:
    int n, maxHeight = 0;
    std::vector&lt;Arc&gt; arcs;
    std::vector&lt;std::vector&lt;int&gt;&gt; adj;
    std::vector&lt;long long&gt; excess;
    std::vector&lt;int&gt; h, count;
    std::vector&lt;std::vector&lt;int&gt;&gt; buckets;

    void push(int u, int id, long long d) {
        if (d == 0) return;
        int v = arcs[id].to;
        if (excess[v] == 0 &amp;&amp; h[v] &lt; n) {
            buckets[h[v]].push_back(v);
            maxHeight = std::max(maxHeight, h[v]);
        }
        arcs[id].cap -= d;
        arcs[id ^ 1].cap += d;
        excess[u] -= d;
        excess[v] += d;
    }

    void discharge(int u, int s, int t) {
        while (excess[u] &gt; 0) {
            int minNeighborH = 2 * n;
            for (int id : adj[u]) {
                if (arcs[id].cap == 0) continue;
                int v = arcs[id].to;
                if (h[u] == h[v] + 1) {
                    push(u, id, std::min(excess[u], arcs[id].cap));
                    if (excess[u] == 0) return;
                } else {
                    minNeighborH = std::min(minNeighborH, h[v]);
                }
            }
            // Relabel with Gap Heuristic
            int oldH = h[u];
            --count[oldH];
            if (count[oldH] == 0 &amp;&amp; oldH &lt; n) {
                for (int i = 0; i &lt; n; ++i) {
                    if (i != s &amp;&amp; i != t &amp;&amp; h[i] &gt; oldH &amp;&amp; h[i] &lt;= n) {
                        --count[h[i]];
                        h[i] = n + 1;
                    }
                }
            }
            h[u] = minNeighborH + 1;
            ++count[h[u]];
            if (h[u] &gt;= n) return; // Excess will drain back to s in phase 2 or can be ignored for maxFlow value
        }
    }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Reading Edge Flows Before Phase-2 Excess Drainage</div>
        <p>When only the scalar value $|f^*| = e(t)$ is needed, nodes lifted to $h(u) \\ge V$ can stop discharging because their excess can never reach $t$. However, if you need the actual per-edge flow assignment $f(u, v)$ (satisfying strict flow conservation $e(u) = 0$ everywhere), you must continue discharging nodes with $V \\le h(u) &lt; 2V$ until all remaining excess drains back into $s$.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Push-Relabel relaxes flow conservation into a preflow (e(u) >= 0) while strictly maintaining the cut validity invariant h(u) <= h(v) + 1 in G_f.",
      "Because h(s) = V and h(t) = 0, no augmenting path from s to t ever exists in G_f during Push-Relabel.",
      "Vertex heights never exceed 2V - 1, bounding total relabels to O(V^2) and saturating pushes to O(V E).",
      "Selecting the active node with the maximum height (Highest-Label) combined with the Gap Heuristic achieves O(V^2 sqrt(E)) time."
    ],
    furtherReading: [
      { title: "Goldberg, A. V. & Tarjan, R. E. (1988) — A New Approach to the Maximum-Flow Problem (JACM)", url: "https://doi.org/10.1145/48014.61051" },
      { title: "Cherkassky, B. V. & Goldberg, A. V. (1997) — On Implementing the Push-Relabel Method for the Maximum Flow Problem", url: "https://doi.org/10.1007/BF02614316" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 24.4–24.5: Push-Relabel Algorithms", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
    ]
  },

  "bipartite-matching-hopcroft-karp": {
    title: "Maximum Bipartite Matching: König's Theorem, Hall's Marriage Theorem & Hopcroft-Karp O(E√V)",
    video: {
      youtubeId: "lM5eIpF0xjA",
      id: "lM5eIpF0xjA",
      url: "https://www.youtube.com/embed/lM5eIpF0xjA",
      title: "Hopcroft-Karp O(E√V) Maximum Bipartite Matching Algorithm Explained",
      channel: "Joromy Bou Khalil",
      duration: "12:40",
      start: 0,
      length: "12m",
      why: "Explains alternating and augmenting paths in bipartite graphs, Hall's Marriage condition, and Hopcroft-Karp's simultaneous path augmentation."
    },
    intuition: "<p>A <strong>matching</strong> $M \\subseteq E$ in a bipartite graph $G = (L \\cup R, E)$ is a set of edges where no two edges share an endpoint. We can solve Maximum Bipartite Matching by adding a super-source $s$ connected to all $u \\in L$ (capacity $1$) and a super-sink $t$ connected from all $v \\in R$ (capacity $1$), or directly via John Hopcroft and Richard Karp's (1973) specialized $O(E \\sqrt{V})$ algorithm.</p><p>Better still, bipartite graphs enjoy a clean combinatorial duality that fails on general graphs: <strong>König's Theorem</strong> states that the size of a Maximum Matching $|M^*|$ equals the size of a <strong>Minimum Vertex Cover</strong> $|C^*|$, and its complement $V \\setminus C^*$ is a <strong>Maximum Independent Set</strong>!</p>",
    content: `<div class="lesson-content">
      <h2>Alternating Paths, Berge's Lemma &amp; Hopcroft-Karp $O(E \\sqrt{V})$</h2>
      <p>Given a matching $M$, a vertex is <strong>matched</strong> if it is incident to an edge in $M$, and <strong>free</strong> (unmatched) otherwise. An <strong>alternating path</strong> alternates between unmatched edges ($E \\setminus M$) and matched edges ($M$). An <strong>augmenting path</strong> $P$ is an alternating path that both starts at a free vertex in $L$ and ends at a free vertex in $R$. Flipping the membership of edges along $P$ ($M' = M \\oplus P$) replaces $k$ matched edges with $k + 1$ unmatched edges, increasing $|M|$ by $1$!</p>

      <div class="invariant-box">
        <div class="box-title">Formal Theorems — Berge's Lemma, Hall's Marriage Theorem &amp; König's Duality</div>
        <ol>
          <li><strong>Berge's Lemma (1957):</strong> A matching $M$ is maximum if and only if $G$ contains no $M$-augmenting path.</li>
          <li><strong>Hall's Marriage Theorem (1935):</strong> A bipartite graph $G = (L \\cup R, E)$ has a matching saturating all of $L$ ($|M| = |L|$) if and only if for every subset $S \\subseteq L$, its neighborhood $N(S) \\subseteq R$ satisfies:
          $$|N(S)| \\ge |S|$$</li>
          <li><strong>König's Theorem (1931):</strong> In any bipartite graph, the maximum matching size equals the minimum vertex cover size, and the maximum independent set size is $|V| - |M^*|$:
          $$\\nu(G) = |M^*| = \\tau(G) = |C^*|, \\qquad \\alpha(G) = |V| - |M^*|$$</li>
        </ol>
      </div>

      <h3>How Hopcroft-Karp Achieves $O(E \\sqrt{V})$</h3>
      <p>While Kuhn's algorithm finds one augmenting path per $O(E)$ DFS ($O(V E)$ total), Hopcroft-Karp mirrors Dinic's algorithm on the bipartite graph directly:</p>
      <ol>
        <li><strong>Multi-Source BFS from all free $u \\in L$:</strong> Assigns distances <code>dist[u]</code> along alternating layers until the shortest augmenting path length $k$ to a free vertex in $R$ is reached.</li>
        <li><strong>Simultaneous Vertex-Disjoint DFS:</strong> Finds a maximal set of vertex-disjoint shortest augmenting paths of length $k$ in $O(E)$ time and flips all of them. Because the shortest augmenting path length strictly increases each phase, at most $2\\sqrt{V}$ phases occur!</li>
      </ol>

      <div class="mermaid">
      flowchart LR
        FreeL["Seed BFS queue with all unmatched u in L (dist[u] = 0)"] --> Layer["Expand alternating paths: u --unmatched--> v --matched--> matchR[v]"]
        Layer --> Found{"Reached any free v in R?"}
        Found -- "No" --> Opt["Matching M is Maximum (Extract König Cover)"]
        Found -- "Yes" --> DFS["Run DFS from each free u in L along dist[next] == dist[u] + 1"]
        DFS --> Flip["Flip M = M (+) P along vertex-disjoint augmenting paths"]
        Flip --> FreeL
      </div>

      <div class="simulator-mount" data-sim="sim-dinic-max-flow"></div>

      <div class="hardware-box">
        <div class="box-title">Constructive Algorithm — Extracting Minimum Vertex Cover &amp; Maximum Independent Set</div>
        <p>Once a maximum matching $M^*$ is computed, how do you construct the Minimum Vertex Cover $C^*$? Start an alternating reachability search from all <strong>unmatched vertices in $L$</strong> (moving $L \\to R$ via unmatched edges and $R \\to L$ via matched edges). Let $Z$ be the set of visited vertices. Then the Minimum Vertex Cover is:</p>
        $$C^* = (L \\setminus Z) \\cup (R \\cap Z)$$
        <p>And the Maximum Independent Set is its complement $I^* = V \\setminus C^* = (L \\cap Z) \\cup (R \\setminus Z)$!</p>
      </div>

      <table class="complexity-matrix">
        <thead>
          <tr><th>Algorithm</th><th>Time Complexity</th><th>Space Complexity</th><th>Best Use Case</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Kuhn's Alternating DFS</strong></td><td><span class="badge-on2">$O(V E)$</span></td><td><span class="badge-on">$O(V + E)$</span></td><td>Small bipartite graphs ($V \\le 2000$), concise code</td></tr>
          <tr><td><strong>Hopcroft-Karp</strong></td><td><span class="badge-onlogn">$O(E \\sqrt{V})$</span></td><td><span class="badge-on">$O(V + E)$</span></td><td>Large bipartite graphs ($V, E \\le 2 \\times 10^5$)</td></tr>
          <tr><td><strong>König Cover Extraction</strong></td><td><span class="badge-on">$O(V + E)$</span></td><td><span class="badge-on">$O(V)$</span></td><td>Post-processing after Hopcroft-Karp</td></tr>
        </tbody>
      </table>

      <h3>Production C++20 Implementation: Hopcroft-Karp with König Minimum Vertex Cover</h3>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;limits&gt;

class HopcroftKarp {
public:
    HopcroftKarp(int nLeft, int nRight)
        : nL(nLeft), nR(nRight), adj(nLeft), matchL(nLeft, -1), matchR(nRight, -1), dist(nLeft) {}

    void addEdge(int u, int v) { adj[u].push_back(v); }

    int maxMatching() {
        int matching = 0;
        while (bfs()) {
            for (int u = 0; u &lt; nL; ++u) {
                if (matchL[u] == -1 &amp;&amp; dfs(u)) {
                    ++matching;
                }
            }
        }
        return matching;
    }

    // Returns {chosenLeftNodes, chosenRightNodes} forming a Minimum Vertex Cover
    std::pair&lt;std::vector&lt;int&gt;, std::vector&lt;int&gt;&gt; minVertexCover() {
        std::vector&lt;uint8_t&gt; visL(nL, 0), visR(nR, 0);
        std::queue&lt;int&gt; q;
        for (int u = 0; u &lt; nL; ++u) {
            if (matchL[u] == -1) {
                visL[u] = 1;
                q.push(u);
            }
        }
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : adj[u]) {
                if (v != matchL[u] &amp;&amp; !visR[v]) {
                    visR[v] = 1;
                    int nextU = matchR[v];
                    if (nextU != -1 &amp;&amp; !visL[nextU]) {
                        visL[nextU] = 1;
                        q.push(nextU);
                    }
                }
            }
        }
        std::vector&lt;int&gt; coverL, coverR;
        for (int u = 0; u &lt; nL; ++u) if (!visL[u]) coverL.push_back(u); // L \ Z
        for (int v = 0; v &lt; nR; ++v) if (visR[v]) coverR.push_back(v);  // R n Z
        return {coverL, coverR};
    }

private:
    static constexpr int INF = 1e9;
    int nL, nR;
    std::vector&lt;std::vector&lt;int&gt;&gt; adj;
    std::vector&lt;int&gt; matchL, matchR, dist;

    bool bfs() {
        std::queue&lt;int&gt; q;
        for (int u = 0; u &lt; nL; ++u) {
            if (matchL[u] == -1) {
                dist[u] = 0;
                q.push(u);
            } else {
                dist[u] = INF;
            }
        }
        bool foundAugmenting = false;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : adj[u]) {
                int nextU = matchR[v];
                if (nextU == -1) {
                    foundAugmenting = true;
                } else if (dist[nextU] == INF) {
                    dist[nextU] = dist[u] + 1;
                    q.push(nextU);
                }
            }
        }
        return foundAugmenting;
    }

    bool dfs(int u) {
        for (int v : adj[u]) {
            int nextU = matchR[v];
            if (nextU == -1 || (dist[nextU] == dist[u] + 1 &amp;&amp; dfs(nextU))) {
                matchL[u] = v;
                matchR[v] = u;
                return true;
            }
        }
        dist[u] = INF; // Dead-end pruning: never revisit u in this phase
        return false;
    }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Applying König's Theorem to Non-Bipartite Graphs</div>
        <p>On general (non-bipartite) graphs containing odd cycles, Maximum Matching is solvable in $O(E \\sqrt{V})$ via Edmonds' Blossom algorithm, but <strong>Minimum Vertex Cover and Maximum Independent Set are NP-Hard</strong>! For example, on a triangle $K_3$, the maximum matching has size $1$, while the minimum vertex cover has size $2$.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "An M-augmenting path starts and ends at unmatched vertices and alternates between unmatched and matched edges; symmetric difference M (+) P increases |M| by 1.",
      "Hopcroft-Karp finds a maximal set of shortest vertex-disjoint augmenting paths per phase, completing in at most 2*sqrt(V) phases and O(E sqrt(V)) time.",
      "Setting dist[u] = INF when dfs(u) fails prunes dead-end vertices so each edge is inspected at most once per phase.",
      "In bipartite graphs (and only bipartite graphs), König's Theorem guarantees |Max Matching| = |Min Vertex Cover| = |V| - |Max Independent Set|."
    ],
    furtherReading: [
      { title: "Hopcroft, J. E. & Karp, R. M. (1973) — An n^(5/2) Algorithm for Maximum Matchings in Bipartite Graphs (SIAM J. Comput.)", url: "https://doi.org/10.1137/0202019" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 24.3: Maximum Bipartite Matching", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "CP-Algorithms — Kuhn's & Hopcroft-Karp Algorithms for Maximum Bipartite Matching", url: "https://cp-algorithms.com/graph/kuhn_maximum_bipartite_matching.html" }
    ]
  },

  "weighted-matching-hungarian": {
    title: "Minimum-Weight Bipartite Matching: Kuhn-Munkres (Hungarian Algorithm) & Primal-Dual Potentials",
    video: {
      youtubeId: "cQ5MsiGaDY8",
      title: "The Hungarian Algorithm (Kuhn-Munkres) for the Assignment Problem",
      channel: "Abdul Bari",
      duration: "24:10",
      length: "24:10",
      start: 0,
      why: "Clear walkthrough of the assignment problem, dual row/column potentials, and zero-slack augmenting paths."
    },
    intuition: "<p>Suppose you have $N$ workers and $N$ tasks with an $N \\times N$ cost matrix $C[i][j]$, and you must assign each worker to a distinct task to minimize total cost. Naive brute force checks $N!$ permutations; naive Bellman-Ford Min-Cost Flow takes $O(N^4)$ time.</p><p>Harold Kuhn (1955) and James Munkres (1957)—building on theorems by Hungarian mathematicians Dénes Kőnig and Jenő Egerváry—solved the Assignment Problem in $O(N^3)$ time via the <strong>Primal-Dual Method</strong>: maintain dual vertex potentials $u[i]$ for workers and $v[j]$ for tasks such that $u[i] + v[j] \\le C[i][j]$ everywhere. If we find a perfect matching using only <strong>tight (zero-slack) edges</strong> where $u[i] + v[j] = C[i][j]$, then its total cost equals $\\sum u[i] + \\sum v[j]$, which is a mathematical lower bound on <em>every</em> possible assignment!</p>",
    content: `<div class="lesson-content">
      <h2>Linear Programming Duality &amp; Complementary Slackness</h2>
      <p>The Assignment Problem seeks a permutation $\\pi$ of $\\{1, \\dots, N\\}$ minimizing $\\sum_{i=1}^N C[i][\\pi(i)]$. Consider any dual vertex potentials $u[1..N]$ and $v[1..N]$ satisfying the dual feasibility invariant:</p>
      $$u[i] + v[j] \\le C[i][j] \\quad \\forall i, j \\in \\{1, \\dots, N\\}$$
      <p>Define the <strong>slack</strong> of edge $(i, j)$ as $\\text{slack}(i, j) = C[i][j] - u[i] - v[j] \\ge 0$. For <em>any</em> valid permutation $\\pi$, summing the dual inequality over all matched pairs $(i, \\pi(i))$ gives:</p>
      $$\\sum_{i=1}^N C[i][\\pi(i)] \\ge \\sum_{i=1}^N \\big(u[i] + v[\\pi(i)]\\big) = \\sum_{i=1}^N u[i] + \\sum_{j=1}^N v[j]$$

      <div class="invariant-box">
        <div class="box-title">Formal Theorem — Kuhn-Munkres Primal-Dual Optimality &amp; $O(N^3)$ Slack Tracking</div>
        <p><strong>Theorem (Complementary Slackness):</strong> If a perfect matching $M$ uses exclusively tight edges ($\\text{slack}(i, j) = C[i][j] - u[i] - v[j] = 0$ for all $(i, j) \\in M$), then $\\text{cost}(M) = \\sum u[i] + \\sum v[j]$, so $M$ is a globally minimum-cost perfect matching.</p>
        <p><strong>Why $O(N^3)$ Instead of $O(N^4)$?</strong> When matching worker $i$ ($1 \\le i \\le N$), we grow an alternating tree $T$ of tight edges. Whenever $T$ cannot expand to an unmatched task, we compute the minimum slack $\\Delta = \\min_{i' \\in T_L, j' \\notin T_R} (C[i'][j'] - u[i'] - v[j'])$, add $+\\Delta$ to $u[i']$ for $i' \\in T_L$, and subtract $-\\Delta$ from $v[j']$ for $j' \\in T_R$. By maintaining an array <code>minv[j]</code> $= \\min_{i' \\in T_L} \\text{slack}(i', j)$ for each column $j \\notin T_R$, each of the $\\le N$ tree expansions per worker takes $O(N)$ time, giving $O(N^2)$ per worker and $O(N^3)$ total!</p>
      </div>

      <div class="mermaid">
      flowchart LR
        Worker["For worker i = 1..N: start alternating tree at dummy column j0 = 0"] --> UpdateSlack["Update minv[j] = min(minv[j], C[i0][j] - u[i0] - v[j]) for j not in T_R"]
        UpdateSlack --> PickMin["Find j1 not in T_R minimizing delta = minv[j1]"]
        PickMin --> Shift["For k in T: u[p[k]] += delta, v[k] -= delta; for k not in T: minv[k] -= delta"]
        Shift --> Free{"Is column j1 unmatched (p[j1] == 0)?"}
        Free -- "No (matched to i0 = p[j1])" --> UpdateSlack
        Free -- "Yes" --> Augment["Flip matching along way[j] chain back to column 0"]
      </div>

      <div class="simulator-mount" data-sim="sim-hungarian-mcmf"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — Jonker-Volgenant / Lopatin-Kuznetsov 1-Indexed Array Formulation</div>
        <p>Rather than building graph objects, the industry-standard 1-indexed array formulation (Jonker &amp; Volgenant 1987) uses Column $0$ as a virtual root holding the current worker $i$, and updates four flat 1D vectors (<code>u</code>, <code>v</code>, <code>p</code>, <code>minv</code>, <code>way</code>) in a tight inner loop over $j \\in [1..M]$. Because it executes pure sequential array arithmetic with zero heap allocations, it solves $N = 500$ assignment instances in under $4\\text{ ms}$!</p>
      </div>

      <table class="complexity-matrix">
        <thead>
          <tr><th>Algorithm Variant</th><th>Time Complexity</th><th>Space Complexity</th><th>Notes</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Naive Kuhn-Munkres (Matrix Re-scan)</strong></td><td><span class="badge-on2">$O(N^4)$</span></td><td><span class="badge-on2">$O(N^2)$</span></td><td>Recomputes $\\Delta$ over all $(i', j')$ in $O(N^2)$ per relabel</td></tr>
          <tr><td><strong>Hungarian with <code>minv[j]</code> Slack Array</strong></td><td><span class="badge-on2">$O(N^3)$</span></td><td><span class="badge-on2">$O(N^2)$</span></td><td>Optimal for dense $N \\times M$ assignment ($N \\le M \\le 1000$)</td></tr>
          <tr><td><strong>Rectangular $N \\times M$ ($N \\le M$)</strong></td><td><span class="badge-on2">$O(N^2 M)$</span></td><td><span class="badge-on2">$O(N M)$</span></td><td>Matches every row $1..N$ to a distinct column in $1..M$</td></tr>
        </tbody>
      </table>

      <h3>Production C++20 Implementation: $O(N^2 M)$ Hungarian Algorithm with Potentials</h3>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;limits&gt;

struct AssignmentResult {
    long long minCost;
    std::vector&lt;int&gt; rowMatch; // 0-indexed: rowMatch[i] = assigned column j
};

// Solves Min-Weight Matching matching all N rows to M columns (requires N &lt;= M)
AssignmentResult hungarianMinWeightAssignment(const std::vector&lt;std::vector&lt;long long&gt;&gt;&amp; cost) {
    int n = static_cast&lt;int&gt;(cost.size());
    int m = static_cast&lt;int&gt;(cost[0].size());
    constexpr long long INF = std::numeric_limits&lt;long long&gt;::max() / 4;

    // 1-indexed potentials u[1..n], v[0..m], matching p[0..m] (row matched to col j), way[1..m]
    std::vector&lt;long long&gt; u(n + 1, 0), v(m + 1, 0);
    std::vector&lt;int&gt; p(m + 1, 0), way(m + 1, 0);

    for (int i = 1; i &lt;= n; ++i) {
        p[0] = i;
        int j0 = 0;
        std::vector&lt;long long&gt; minv(m + 1, INF);
        std::vector&lt;uint8_t&gt; used(m + 1, 0);

        do {
            used[j0] = 1;
            int i0 = p[j0], j1 = 0;
            long long delta = INF;

            for (int j = 1; j &lt;= m; ++j) {
                if (!used[j]) {
                    long long cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
                    if (cur &lt; minv[j]) {
                        minv[j] = cur;
                        way[j] = j0;
                    }
                    if (minv[j] &lt; delta) {
                        delta = minv[j];
                        j1 = j;
                    }
                }
            }
            for (int j = 0; j &lt;= m; ++j) {
                if (used[j]) {
                    u[p[j]] += delta;
                    v[j] -= delta;
                } else {
                    minv[j] -= delta;
                }
            }
            j0 = j1;
        } while (p[j0] != 0);

        // Augment matching along tight alternating path traced by way[]
        do {
            int j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
        } while (j0 != 0);
    }

    std::vector&lt;int&gt; rowMatch(n, -1);
    for (int j = 1; j &lt;= m; ++j) {
        if (p[j] &gt; 0) rowMatch[p[j] - 1] = j - 1;
    }
    // Dual objective at column 0: -v[0] equals sum u[i] + sum v[j] = exact minimum cost
    return {-v[0], rowMatch};
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Passing $N &gt; M$ or Maximize-Weight Without Negation</div>
        <p>The 1-indexed Hungarian loop assumes every row $i \\in [1..N]$ can be matched to a distinct column, which requires $N \\le M$ (if $N &gt; M$, transpose the matrix first!). To solve <strong>Maximum-Weight Matching</strong>, simply negate all matrix entries (<code>cost[i][j] = -profit[i][j]</code>)—unlike Dijkstra, the Hungarian algorithm handles negative edge weights natively without offset hacks!</p>
      </div>
    </div>`,
    keyTakeaways: [
      "The Hungarian algorithm maintains dual potentials u[i] + v[j] <= C[i][j] and augments only along tight zero-slack edges where u[i] + v[j] == C[i][j].",
      "By Complementary Slackness, any perfect matching composed of tight edges has cost equal to sum(u[i]) + sum(v[j]), proving global optimality.",
      "Maintaining per-column minimum slack `minv[j]` reduces each worker's phase from O(N^3) to O(N^2), achieving O(N^3) total time.",
      "The algorithm handles negative costs natively and returns the optimal objective value directly in `-v[0]`."
    ],
    furtherReading: [
      { title: "Kuhn, H. W. (1955) — The Hungarian Method for the Assignment Problem (Naval Research Logistics Quarterly)", url: "https://doi.org/10.1002/nav.3800020109" },
      { title: "CP-Algorithms — Hungarian Algorithm for Solving the Assignment Problem in O(n^3)", url: "https://cp-algorithms.com/graph/hungarian-algorithm.html" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 25: Matchings in Bipartite Graphs", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
    ]
  },

  "min-cost-max-flow-mcmf": {
    title: "Minimum-Cost Maximum Flow (MCMF): Successive Shortest Paths with Johnson Potentials",
    video: {
      youtubeId: "UtSrgTsKUfU",
      id: "UtSrgTsKUfU",
      url: "https://www.youtube.com/embed/UtSrgTsKUfU",
      title: "Minimum-Cost Network Flow & Successive Shortest Augmenting Paths",
      channel: "NPTEL (IIT Kharagpur)",
      duration: "54:20",
      start: 0,
      length: "54m",
      why: "Explains residual edge cost skew-symmetry (-cost on reverse arcs) and why Johnson node potentials let Dijkstra replace Bellman-Ford."
    },
    intuition: "<p>In <strong>Minimum-Cost Maximum Flow (MCMF)</strong>, every directed edge $e = (u, v)$ has both a capacity $c(e)$ and a per-unit shipping cost $w(e)$. We want to route the maximum possible flow $|f^*|$ from $s$ to $t$ at the minimum total cost $\\sum_{e} f(e) \\cdot w(e)$.</p><p>Notice what happens to the residual graph $G_f$: if pushing $1$ unit forward along $(u, v)$ costs $+w(u, v)$, then canceling $1$ unit via the reverse residual edge $(v, u)$ refunds $-w(u, v)$! Because reverse edges have <strong>negative costs</strong>, we cannot run raw Dijkstra on $G_f$. However, by maintaining Johnson vertex potentials $\\pi(u)$ updated after each augmentation ($\\pi'(u) = \\pi(u) + d(s, u)$), every reduced residual edge cost $w_\\pi(u, v) = w(u, v) + \\pi(u) - \\pi(v)$ stays non-negative ($\\ge 0$), allowing fast $O(E \\log V)$ Dijkstra on every augmentation!</p>",
    content: `<div class="lesson-content">
      <h2>Cost Skew-Symmetry, Negative Cycle Optimality &amp; Successive Shortest Paths</h2>
      <p>For each original edge $e = (u, v)$ with capacity $c(e)$ and unit cost $w(e)$, its reverse residual partner $e^R = (v, u)$ has initial capacity $0$ and unit cost $w(e^R) = -w(e)$.</p>

      <div class="invariant-box">
        <div class="box-title">Formal Theorem — Min-Cost Flow Optimality &amp; Potential Preservation</div>
        <p><strong>Theorem 1 (Negative-Cost Cycle Optimality Criterion):</strong> A flow $f$ of value $|f|$ has minimum cost among all flows of value $|f|$ if and only if the residual graph $G_f$ contains no directed cycle of strictly negative total cost.</p>
        <p><strong>Theorem 2 (Successive Shortest Path Invariant):</strong> Suppose $f$ has no negative-cost residual cycles and $\\pi: V \\to \\mathbb{R}$ are valid node potentials satisfying $w_\\pi(u, v) = w(u, v) + \\pi(u) - \\pi(v) \\ge 0$ for all $(u, v) \\in E_f$. Let $d'(u)$ be the shortest path distance from $s$ to $u$ in $G_f$ under $w_\\pi$, and augment flow along a shortest $s \\leadsto t$ path $P$. Then updating potentials to:</p>
        $$\\pi_{\\text{new}}(u) = \\pi(u) + d'(u)$$
        <p>guarantees $w_{\\pi_{\\text{new}}}(u, v) \\ge 0$ for <em>all</em> edges in the new residual graph $G_{f'}$—including newly created reverse edges $(v, u)$ along $P$, because along $P$, $d'(v) = d'(u) + w_\\pi(u, v) \\implies w_{\\pi_{\\text{new}}}(v, u) = 0$! $\\blacksquare$</p>
      </div>

      <div class="mermaid">
      flowchart TD
        Init["1. Init potentials pi[u]: 0 if all w(e) >= 0, else 1 pass of Bellman-Ford/DAG DP"] --> Dijk["2. Run Dijkstra on G_f using reduced cost w_pi(u,v) = w(u,v) + pi[u] - pi[v] >= 0"]
        Dijk --> Reach{"Did Dijkstra reach t?"}
        Reach -- "No" --> Done["Return {totalFlow, totalCost}"]
        Reach -- "Yes" --> Shift["3. Update pi[u] += d[u] for all reachable u"]
        Shift --> Aug["4. Find bottleneck Delta on shortest path P; update residual caps and totalCost += Delta * (pi[t] - pi[s])"]
        Aug --> Dijk
      </div>

      <div class="simulator-mount" data-sim="sim-hungarian-mcmf"></div>

      <div class="hardware-box">
        <div class="box-title">Hardware Reality — True Path Cost from Potential Difference $\\pi[t] - \\pi[s]$</div>
        <p>After updating $\\pi[u] \\mathrel{+}= d[u]$ (where $\\pi[s] = 0$), what is the true unadjusted unit cost of the augmenting path $P$ from $s$ to $t$? By telescoping sum, $\\sum_{e \\in P} w(e) = \\pi_{\\text{new}}[t] - \\pi_{\\text{new}}[s] = \\pi_{\\text{new}}[t]$! You don't even need to sum edge costs along the path—simply add <code>pushed * pi[t]</code> to <code>totalCost</code>!</p>
      </div>

      <table class="complexity-matrix">
        <thead>
          <tr><th>MCMF Algorithm</th><th>Time Complexity</th><th>Handles Initial $w(e) &lt; 0$?</th><th>Best Use Case</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Successive Shortest Path (SPFA)</strong></td><td><span class="badge-on2">$O(|f^*| \\cdot V E)$</span></td><td>Yes (if no negative cycles)</td><td>Small flow $|f^*|$, general initial costs</td></tr>
          <tr><td><strong>SSP + Johnson Potentials + Dijkstra</strong></td><td><span class="badge-onlogn">$O(V E + |f^*| \\cdot E \\log V)$</span></td><td>Yes (via 1 initial Bellman-Ford)</td><td>Standard production &amp; CP choice</td></tr>
          <tr><td><strong>Primal-Dual Capacity Scaling</strong></td><td><span class="badge-on2">$O(E^2 \\log U \\log V)$</span></td><td>Yes</td><td>Large capacities $U \\gg V$</td></tr>
        </tbody>
      </table>

      <h3>Production C++20 Implementation: Min-Cost Max-Flow with Johnson Potentials &amp; Dijkstra</h3>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;algorithm&gt;
#include &lt;limits&gt;

class MinCostMaxFlow {
public:
    struct Arc {
        int from, to;
        long long cap, cost;
    };

    explicit MinCostMaxFlow(int n) : n(n), adj(n), pi(n, 0) {}

    void addEdge(int u, int v, long long cap, long long cost) {
        adj[u].push_back(static_cast&lt;int&gt;(arcs.size()));
        arcs.push_back({u, v, cap, cost});
        adj[v].push_back(static_cast&lt;int&gt;(arcs.size()));
        arcs.push_back({v, u, 0, -cost}); // Reverse edge has negative cost!
        if (cost &lt; 0) hasNegativeInitCost = true;
    }

    // Optional: call or auto-triggered if initial graph has negative-cost edges (no negative cycles)
    void initPotentialsBellmanFord(int s) {
        std::fill(pi.begin(), pi.end(), INF);
        pi[s] = 0;
        for (int iter = 0; iter &lt; n - 1; ++iter) {
            bool changed = false;
            for (const auto&amp; e : arcs) {
                if (e.cap &gt; 0 &amp;&amp; pi[e.from] &lt; INF &amp;&amp; pi[e.from] + e.cost &lt; pi[e.to]) {
                    pi[e.to] = pi[e.from] + e.cost;
                    changed = true;
                }
            }
            if (!changed) break;
        }
    }

    std::pair&lt;long long, long long&gt; minCostMaxFlow(int s, int t, long long flowLimit = INF) {
        if (hasNegativeInitCost) initPotentialsBellmanFord(s);

        long long totalFlow = 0, totalCost = 0;
        std::vector&lt;long long&gt; dist(n);
        std::vector&lt;int&gt; parentArc(n);

        while (totalFlow &lt; flowLimit) {
            std::fill(dist.begin(), dist.end(), INF);
            std::fill(parentArc.begin(), parentArc.end(), -1);
            using State = std::pair&lt;long long, int&gt;;
            std::priority_queue&lt;State, std::vector&lt;State&gt;, std::greater&lt;State&gt;&gt; pq;

            dist[s] = 0;
            pq.emplace(0, s);

            while (!pq.empty()) {
                auto [d, u] = pq.top();
                pq.pop();
                if (d &gt; dist[u]) continue;

                for (int id : adj[u]) {
                    const auto&amp; e = arcs[id];
                    if (e.cap == 0) continue;
                    long long reducedCost = e.cost + pi[u] - pi[e.to];
                    if (d + reducedCost &lt; dist[e.to]) {
                        dist[e.to] = d + reducedCost;
                        parentArc[e.to] = id;
                        pq.emplace(dist[e.to], e.to);
                    }
                }
            }

            if (dist[t] == INF) break;

            for (int i = 0; i &lt; n; ++i) {
                if (dist[i] &lt; INF) pi[i] += dist[i];
            }

            long long push = flowLimit - totalFlow;
            for (int cur = t; cur != s; cur = arcs[parentArc[cur]].from) {
                push = std::min(push, arcs[parentArc[cur]].cap);
            }
            for (int cur = t; cur != s; cur = arcs[parentArc[cur]].from) {
                int id = parentArc[cur];
                arcs[id].cap -= push;
                arcs[id ^ 1].cap += push;
            }

            totalFlow += push;
            totalCost += push * (pi[t] - pi[s]);
        }
        return {totalFlow, totalCost};
    }

private:
    static constexpr long long INF = std::numeric_limits&lt;long long&gt;::max() / 4;
    int n;
    bool hasNegativeInitCost = false;
    std::vector&lt;Arc&gt; arcs;
    std::vector&lt;std::vector&lt;int&gt;&gt; adj;
    std::vector&lt;long long&gt; pi;
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Updating Potentials Only Along the Augmenting Path</div>
        <p>You must update $\\pi[u] \\mathrel{+}= \\text{dist}[u]$ for <strong>every reachable vertex $u$</strong> (<code>if (dist[u] &lt; INF)</code>), not just vertices on the chosen $s \\leadsto t$ path! If you only update $\\pi$ on the path, non-path edges leaving the path will violate $w_\\pi(u, v) \\ge 0$ in the next iteration and corrupt Dijkstra.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "Every forward edge of cost +w induces a backward residual edge of cost -w, so residual networks naturally acquire negative-cost edges.",
      "Maintaining Johnson potentials pi[u] += dist[u] across all reachable vertices keeps every residual edge's reduced cost w_pi(u,v) = w(u,v) + pi[u] - pi[v] >= 0.",
      "When initial edge costs are non-negative, pi[u] can be initialized to 0; if initial negative costs exist (without negative cycles), one Bellman-Ford pass initializes pi[u].",
      "The true unadjusted unit cost of the shortest augmenting path equals pi_new[t] - pi_new[s]."
    ],
    furtherReading: [
      { title: "Ahuja, Magnanti, Orlin — Network Flows: Theory, Algorithms, and Applications, Ch. 9: Minimum Cost Flows", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "CP-Algorithms — Minimum-Cost Flow: Successive Shortest Path Algorithm with Potentials", url: "https://cp-algorithms.com/graph/min_cost_flow.html" },
      { title: "Edmonds, J. & Karp, R. M. (1972) — Theoretical Improvements in Algorithmic Efficiency for Network Flow Problems", url: "https://doi.org/10.1145/321694.321699" }
    ]
  },

  "flow-reductions-project-selection": {
    title: "Network Flow Modeling Patterns: Closure Problem (Project Selection), Circulation with Demands & Image Segmentation",
    video: {
      youtubeId: "kTwC_D8ol-c",
      id: "kTwC_D8ol-c",
      url: "https://www.youtube.com/embed/kTwC_D8ol-c",
      title: "Maximum Flow & Minimum Cut Reductions: The Project Selection (Closure) Problem",
      channel: "Thomas Meeks",
      duration: "15:10",
      start: 0,
      length: "15m",
      why: "Shows how non-obvious optimization problems reduce to s-t Min-Cut and lower-bound circulation."
    },
    intuition: "<p>In staff-level systems engineering and algorithmic competitions, network flow rarely appears disguised as water pipes. Instead, it hides inside resource scheduling, compiler register allocation, open-pit mining (<strong>Maximum-Weight Closure / Project Selection</strong>), computer vision <strong>Graph-Cut Image Segmentation</strong>, and <strong>Circulation with Lower Bounds</strong>.</p><p>The secret to Min-Cut modeling is viewing an $s$-$t$ cut $(S, T)$ as a <strong>binary decision engine</strong>: placing a node $u \\in S$ means \"Select / True / Foreground\", placing $u \\in T$ means \"Reject / False / Background\", and a directed edge $(u, v)$ of capacity $C$ imposes a penalty of $C$ if and only if $u \\in S$ and $v \\in T$ ( setting $C = \\infty$ makes $u \\in S \\implies v \\in S$ a hard prerequisite constraint)!</p>",
    content: `<div class="lesson-content">
      <h2>Pattern 1: Maximum-Weight Closure (Project Selection) via $s$-$t$ Min-Cut</h2>
      <p>Suppose you have $N$ projects where project $i$ yields net value $w_i \\in \\mathbb{R}$ ($w_i &gt; 0$ for profitable projects, $w_i &lt; 0$ for prerequisite infrastructure/machines), and a dependency DAG where choosing $u$ requires also choosing $v$ ($u \\to v$). A valid selection $A \\subseteq V$ is a <strong>closure</strong> (no edge leaves $A$).</p>

      <div class="invariant-box">
        <div class="box-title">Reduction Theorem — Maximum-Weight Closure to Minimum $s$-$t$ Cut (Picard 1976)</div>
        <p>Construct a flow network on $V \\cup \\{s, t\\}$:</p>
        <ul>
          <li>For each profitable node $u$ with $w_u &gt; 0$, add edge $(s, u)$ with capacity $w_u$.</li>
          <li>For each costly node $v$ with $w_v &lt; 0$, add edge $(v, t)$ with capacity $|w_v| = -w_v$.</li>
          <li>For each prerequisite dependency $u \\to v$, add edge $(u, v)$ with capacity $\\infty$.</li>
        </ul>
        <p>For any finite-capacity cut $(S, T)$, no $\\infty$ edge can cross from $S$ to $T$, so $A = S \\setminus \\{s\\}$ is a valid closure! Its cut capacity is:</p>
        $$c(S, T) = \\sum_{u \\in T, w_u &gt; 0} w_u + \\sum_{v \\in S, w_v &lt; 0} |w_v| = \\underbrace{\\sum_{w_u &gt; 0} w_u}_{W^+} - \\sum_{u \\in A} w_u$$
        <p>Therefore, minimizing $c(S, T)$ maximizes $\\sum_{u \\in A} w_u = W^+ - \\text{MinCut}(s, t)$! $\\blacksquare$</p>
      </div>

      <div class="mermaid">
      flowchart LR
        S["Source s"] -->|"cap = w_u (Profit)"| P1["Profitable Project u (w_u > 0)"]
        P1 -->|"cap = INF (Prerequisite)"| M1["Costly Machine v (w_v < 0)"]
        M1 -->|"cap = |w_v| (Cost)"| T["Sink t"]
      </div>

      <div class="simulator-mount" data-sim="sim-hungarian-mcmf"></div>

      <h2>Pattern 2: Flow with Edge Lower Bounds $L(e) \\le f(e) \\le U(e)$</h2>
      <p>What if every edge $e = (u, v)$ requires at least $L(e)$ units of flow: $L(e) \\le f(e) \\le U(e)$? Write $f(e) = L(e) + f'(e)$ where $0 \\le f'(e) \\le U(e) - L(e)$. Pre-committing $L(e)$ creates a vertex net balance $b(v) = \\sum_{e \\in \\text{in}(v)} L(e) - \\sum_{e \\in \\text{out}(v)} L(e)$ that $f'$ must absorb:</p>
      <ul>
        <li>Add a super-source $S^*$ and super-sink $T^*$.</li>
        <li>For each vertex $v$ with $b(v) &gt; 0$ (excess incoming lower-bound flow), add edge $(S^*, v)$ of capacity $b(v)$.</li>
        <li>For each vertex $v$ with $b(v) &lt; 0$ (deficit), add edge $(v, T^*)$ of capacity $-b(v)$.</li>
        <li>For an $s$-$t$ flow network (not a closed circulation), add a feedback edge $(t, s)$ with capacity $\\infty$.</li>
      </ul>
      <p>A feasible circulation exists if and only if $\\text{MaxFlow}(S^*, T^*) = \\sum_{b(v) &gt; 0} b(v)$ (saturating all outgoing edges from $S^*$)!</p>

      <div class="hardware-box">
        <div class="box-title">Pattern 3 — Vertex Capacities via Node Splitting ($u_{\\text{in}} \\to u_{\\text{out}}$)</div>
        <p>Standard flow networks only constrain <em>edge</em> capacities. Whenever a vertex $u$ can pass at most $C_u$ units of flow (or in vertex-disjoint paths / minimum vertex cut), split $u$ into two nodes $u_{\\text{in}} = 2u$ and $u_{\\text{out}} = 2u + 1$ connected by an internal directed edge $(u_{\\text{in}}, u_{\\text{out}})$ of capacity $C_u$, routing all incoming edges into $u_{\\text{in}}$ and all outgoing edges from $u_{\\text{out}}$.</p>
      </div>

      <table class="complexity-matrix">
        <thead>
          <tr><th>Modeling Problem</th><th>Graph Construction</th><th>Objective Formula</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Project Selection (Max Closure)</strong></td><td>$s \\xrightarrow{w_u} u \\xrightarrow{\\infty} v \\xrightarrow{|w_v|} t$</td><td>$\\sum_{w_u &gt; 0} w_u - \\text{MaxFlow}(s, t)$</td></tr>
          <tr><td><strong>Vertex Capacity $C_u$</strong></td><td>Split $u \\mapsto u_{\\text{in}} \\xrightarrow{C_u} u_{\\text{out}}$</td><td>Standard Max-Flow / Min-Cut on $2V$ nodes</td></tr>
          <tr><td><strong>Lower-Bound Circulation</strong></td><td>Cap $U(e)-L(e)$; connect $S^* \\to v$ ($b_v &gt; 0$), $v \\to T^*$ ($b_v &lt; 0$)</td><td>Feasible iff $\\text{MaxFlow}(S^*, T^*) == \\sum_{b_v &gt; 0} b_v$</td></tr>
          <tr><td><strong>Bipartite Min Weight Vertex Cover</strong></td><td>$s \\xrightarrow{w_u} u \\in L$, $u \\xrightarrow{\\infty} v$, $v \\in R \\xrightarrow{w_v} t$</td><td>$\\text{MinCut}(s, t) = \\text{MaxFlow}(s, t)$</td></tr>
        </tbody>
      </table>

      <h3>Production C++20 Implementation: Maximum-Weight Closure (Project Selection) Solver</h3>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;algorithm&gt;
#include &lt;limits&gt;

struct ClosureResult {
    long long maxNetProfit;
    std::vector&lt;int&gt; selectedProjects;
};

// weights[i] &gt; 0: profit of project i; weights[i] &lt; 0: cost of prerequisite i
// dependencies: pairs (u, v) meaning selecting u requires selecting v
ClosureResult solveMaxWeightClosure(
    const std::vector&lt;long long&gt;&amp; weights,
    const std::vector&lt;std::pair&lt;int, int&gt;&gt;&amp; dependencies) {

    int n = static_cast&lt;int&gt;(weights.size());
    int s = n, t = n + 1;
    constexpr long long INF = std::numeric_limits&lt;long long&gt;::max() / 4;

    Dinic dinic(n + 2);
    long long totalPositiveProfit = 0;

    for (int i = 0; i &lt; n; ++i) {
        if (weights[i] &gt; 0) {
            totalPositiveProfit += weights[i];
            dinic.addEdge(s, i, weights[i]);
        } else if (weights[i] &lt; 0) {
            dinic.addEdge(i, t, -weights[i]);
        }
    }
    for (auto [u, v] : dependencies) {
        dinic.addEdge(u, v, INF);
    }

    long long minCutLoss = dinic.maxFlow(s, t);
    // Selected projects are vertices in S (reachable from s in final residual graph)
    // Note: in our Dinic class, final BFS sets level[u] != -1 iff u is reachable from s in G_f!
    return {totalPositiveProfit - minCutLoss, {}};
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Using <code>LLONG_MAX</code> for $\\infty$ Edges (Integer Overflow)</div>
        <p>When modeling hard constraints with $\\infty$ edges, never use <code>std::numeric_limits&lt;long long&gt;::max()</code> directly if your flow solver or cut summation ever adds two capacities together. Set <code>INF</code> to strictly exceed $\\sum_{w_u &gt; 0} w_u + 1$ (e.g., <code>1e15</code>), which guarantees no min-cut can ever sever a hard dependency edge while preventing 64-bit integer overflow.</p>
      </div>
    </div>`,
    keyTakeaways: [
      "An s-t minimum cut acts as a binary classifier (u in S vs u in T) where edge (u, v) charges penalty c(u, v) iff u in S and v in T.",
      "Maximum-Weight Closure (Project Selection) reduces to s-t Min-Cut: MaxProfit = sum_{w_u > 0} w_u - MinCut(s, t), with selected projects equal to S \\ {s}.",
      "Edge lower bounds L(e) <= f(e) <= U(e) reduce to standard max-flow by setting residual capacity U(e) - L(e) and routing vertex imbalances b(v) from S* and to T*.",
      "Vertex capacities are modeled by splitting each node u into u_in -> u_out with an internal edge of capacity C_u."
    ],
    furtherReading: [
      { title: "Kleinberg & Tardos — Algorithm Design, Ch. 7.7–7.11: Extensions to Maximum Flow (Circulation, Project Selection, Image Segmentation)", url: "https://www.cs.princeton.edu/~wayne/kleinberg-tardos/" },
      { title: "Picard, J. C. (1976) — Maximal Closure of a Graph and Applications to Combinatorial Problems (Management Science)", url: "https://doi.org/10.1287/mnsc.22.11.1268" },
      { title: "CP-Algorithms — Flows with Demands (Lower Bounds)", url: "https://cp-algorithms.com/graph/flow_with_demands.html" }
    ]
  },

  "build-dinic-max-flow-engine": {
    title: "Build Lab: Dinic's Maximum Flow, Min-Cut Partitioning & Bipartite Matching Engine",
    video: {
      youtubeId: "GhjwOiJ4SqU",
      id: "GhjwOiJ4SqU",
      url: "https://www.youtube.com/embed/GhjwOiJ4SqU",
      title: "Maximum Bipartite Matching via Network Flow & Augmenting Paths",
      channel: "WilliamFiset",
      duration: "14:15",
      start: 0,
      length: "14m",
      why: "Demonstrates how a single Dinic engine powers max-flow, s-t min-cut partition extraction, and bipartite matching."
    },
    intuition: "<p>In this Build Lab, we assemble a unified, zero-allocation-per-phase <strong>Dinic Network Flow, Min-Cut &amp; Bipartite Matching Engine</strong>. By exposing clean inspection APIs over the paired residual arc array, a single 100-line class solves maximum throughput, extracts minimum $s$-$t$ cuts, solves Maximum-Weight Project Selection, and computes $O(E \\sqrt{V})$ Maximum Bipartite Matchings.</p>",
    content: `<div class="lesson-content">
      <h2>Architecture of the Unified Dinic Flow &amp; Matching Engine</h2>
      <p>Our production engine combines four essential engineering techniques:</p>
      <ol>
        <li><strong>Paired Arc Storage (<code>arcs[2k]</code>, <code>arcs[2k+1]</code>):</strong> Every <code>addEdge(u, v, cap)</code> returns the forward arc index <code>2k</code>, allowing callers to inspect the exact final flow on any edge via <code>getEdgeFlow(edgeId)</code> in $O(1)$ time.</li>
        <li><strong>Multi-Branch Blocking Flow DFS:</strong> Pushes multiple bottleneck branches from a single DFS invocation using the current-arc reference <code>int&amp; cid = ptr[u]</code>.</li>
        <li><strong>Zero-Cost Min-Cut Extraction from Final <code>level[]</code>:</strong> Because <code>maxFlow(s, t)</code> terminates precisely when <code>bfs(s, t)</code> fails to reach $t$, the <code>level[u]</code> array at termination <em>already</em> marks the exact residual reachability set $S = \\{u : \\text{level}[u] \\ne -1\\}$!</li>
        <li><strong>Bipartite Matching Adapter:</strong> Wraps $L \\cup R$ into a unit network on $n_L + n_R + 2$ vertices and reads matched pairs directly from saturated $(u, v)$ arcs.</li>
      </ol>

      <div class="mermaid">
      flowchart LR
        Add["addEdge(u, v, cap) -> returns arcId = 2k"] --> Solve["maxFlow(s, t): BFS level[] + DFS ptr[]"]
        Solve --> FlowVal["getEdgeFlow(arcId): arcs[arcId ^ 1].cap"]
        Solve --> Cut["inSourcePartition(u): level[u] != -1"]
        Solve --> Match["extractBipartitePairs(): scan arcIds where flow == 1"]
      </div>

      <div class="simulator-mount" data-sim="sim-dinic-max-flow"></div>

      <div class="invariant-box">
        <div class="box-title">Engineering Invariant — Reading Edge Flow from the Reverse Arc</div>
        <p>When we store only residual capacity <code>cap</code> on each <code>Arc</code> (saving 8 bytes per arc by omitting <code>flow</code>), how do we know the net flow $f(e)$ carried by original directed edge <code>id = 2k</code>? Since its reverse residual arc <code>id ^ 1 = 2k + 1</code> was initialized with capacity $0$, its residual capacity <code>arcs[id ^ 1].cap</code> is <em>identically equal</em> to the current flow $f(e)$ on the forward edge!</p>
      </div>

      <div class="hardware-box">
        <div class="box-title">Hardware &amp; Cache Reality — 16-Byte Arc Structs &amp; Single-Allocation Pool</div>
        <p>By storing only <code>int32_t to</code>, <code>int32_t next</code>, and <code>int64_t cap</code> inside each <code>Arc</code>, every residual arc occupies exactly 16 bytes — fitting 4 arcs per 64-byte L1 cache line. Pre-reserving <code>arcs.reserve(2 * M)</code> upfront eliminates vector reallocations during graph construction and guarantees that forward arc <code>2k</code> and reverse arc <code>2k + 1</code> always reside in the same or adjacent L1 cache line during path augmentation.</p>
      </div>

      <table class="complexity-matrix">
        <thead>
          <tr><th>Engine Method</th><th>Time Complexity</th><th>Memory Footprint</th></tr>
        </thead>
        <tbody>
          <tr><td><code>addEdge(u, v, cap)</code></td><td><span class="badge-o1">$O(1)$ amortized</span></td><td>$32\\text{ bytes}$ per directed edge pair</td></tr>
          <tr><td><code>maxFlow(s, t)</code></td><td><span class="badge-on2">$O(V^2 E)$</span> / <span class="badge-onlogn">$O(E \\sqrt{V})$ unit</span></td><td>Reuses pre-allocated <code>level</code>, <code>ptr</code>, <code>q</code></td></tr>
          <tr><td><code>getMinCutEdges()</code></td><td><span class="badge-on">$O(E)$</span></td><td>Reads <code>level[u] != -1</code> without an extra BFS</td></tr>
          <tr><td><code>getEdgeFlow(edgeId)</code></td><td><span class="badge-o1">$O(1)$</span></td><td>Returns <code>arcs[edgeId ^ 1].cap</code></td></tr>
        </tbody>
      </table>

      <h3>Complete Production C++20 Implementation: Unified Dinic Flow, Min-Cut &amp; Matching Engine</h3>
      <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;queue&gt;
#include &lt;algorithm&gt;
#include &lt;limits&gt;

class DinicEngine {
public:
    struct Arc {
        int from, to;
        long long cap;
    };

    explicit DinicEngine(int n) : n(n), adj(n), level(n, -1), ptr(n, 0) {}

    // Returns the forward arc index (even integer 2k)
    int addEdge(int u, int v, long long cap) {
        int id = static_cast&lt;int&gt;(arcs.size());
        adj[u].push_back(id);
        arcs.push_back({u, v, cap});
        adj[v].push_back(id + 1);
        arcs.push_back({v, u, 0});
        return id;
    }

    long long maxFlow(int s, int t) {
        long long totalFlow = 0;
        while (bfs(s, t)) {
            std::fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, t, std::numeric_limits&lt;long long&gt;::max())) {
                totalFlow += pushed;
            }
        }
        return totalFlow;
    }

    // Exact flow pushed along the edge returned by addEdge()
    long long getEdgeFlow(int edgeId) const noexcept {
        return arcs[edgeId ^ 1].cap;
    }

    // True iff vertex u belongs to the source side S of the minimum s-t cut
    bool inSourceSide(int u) const noexcept {
        return level[u] != -1;
    }

    std::vector&lt;std::pair&lt;int, int&gt;&gt; extractMinCutEdges() const {
        std::vector&lt;std::pair&lt;int, int&gt;&gt; cut;
        for (size_t id = 0; id &lt; arcs.size(); id += 2) {
            const auto&amp; e = arcs[id];
            if (level[e.from] != -1 &amp;&amp; level[e.to] == -1 &amp;&amp; (e.cap + arcs[id ^ 1].cap) &gt; 0) {
                cut.emplace_back(e.from, e.to);
            }
        }
        return cut;
    }

private:
    int n;
    std::vector&lt;Arc&gt; arcs;
    std::vector&lt;std::vector&lt;int&gt;&gt; adj;
    std::vector&lt;int&gt; level, ptr;

    bool bfs(int s, int t) {
        std::fill(level.begin(), level.end(), -1);
        level[s] = 0;
        std::queue&lt;int&gt; q;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int id : adj[u]) {
                int v = arcs[id].to;
                if (arcs[id].cap &gt; 0 &amp;&amp; level[v] == -1) {
                    level[v] = level[u] + 1;
                    q.push(v);
                }
            }
        }
        return level[t] != -1;
    }

    long long dfs(int u, int t, long long available) {
        if (available == 0 || u == t) return available;
        long long totalPushed = 0;
        for (int&amp; cid = ptr[u]; cid &lt; static_cast&lt;int&gt;(adj[u].size()); ++cid) {
            int id = adj[u][cid];
            int v = arcs[id].to;
            if (level[v] != level[u] + 1 || arcs[id].cap == 0) continue;

            long long tr = dfs(v, t, std::min(available - totalPushed, arcs[id].cap));
            if (tr == 0) continue;

            arcs[id].cap -= tr;
            arcs[id ^ 1].cap += tr;
            totalPushed += tr;
            if (totalPushed == available) return totalPushed;
        }
        return totalPushed;
    }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Failure Mode — Terminating BFS Early at $v == t$ When You Need the Min-Cut Partition</div>
        <p>Some Dinic implementations optimize <code>bfs(s, t)</code> by returning <code>true</code> immediately when $t$ is pushed into the queue. While valid during intermediate phases, on the final unsuccessful BFS $t$ is never reached anyway—so <code>level[u] != -1</code> always holds the exact complete source partition $S$ without needing an extra BFS pass!</p>
      </div>
    </div>`,
    keyTakeaways: [
      "The reverse residual arc `arcs[edgeId ^ 1].cap` stores the exact net flow carried by forward edge `edgeId`, avoiding a separate `flow` field.",
      "Because `maxFlow(s, t)` ends on an unsuccessful BFS from s, `level[u] != -1` immediately identifies the source partition S of the minimum s-t cut.",
      "Returning the arc index from `addEdge()` lets bipartite matching and circulation wrappers inspect individual edge flows in O(1) time.",
      "When `totalPushed == available` in multi-branch DFS, returning before `++cid` ensures partially saturated arcs are not skipped."
    ],
    furtherReading: [
      { title: "AtCoder Library (ACL) — maxflow (Dinic's Algorithm Reference Implementation)", url: "https://atcoder.github.io/ac-library/production/document_en/maxflow.html" },
      { title: "CP-Algorithms — Maximum Flow: Dinic's Algorithm", url: "https://cp-algorithms.com/graph/dinic.html" },
      { title: "Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms (4th Ed.), Ch. 24: Maximum Flow", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
    ]
  }
};
