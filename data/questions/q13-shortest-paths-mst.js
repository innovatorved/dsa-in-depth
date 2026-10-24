window.QUESTION_BANK = window.QUESTION_BANK || {};
Object.assign(window.QUESTION_BANK, {
  "disjoint-set-union-ackermann": [
    {
      id: "q13-dsu-1",
      type: "mcq",
      difficulty: "recall",
      section: "Rank & Size Invariants",
      title: "Maximum Tree Height under Union by Rank",
      prompt: "In a Disjoint Set Union (DSU) forest of $N$ elements using Union by Rank (even without Path Compression), what is the tight upper bound on the rank (height) of any root node?",
      options: [
        "floor(log_2 N), because a root of rank k must have a subtree of at least 2^k nodes",
        "O(sqrt(N)), because trees balance into square-root buckets",
        "alpha(N) <= 4 even without path compression",
        "N - 1 in the worst case"
      ],
      answer: 0,
      explanation: "A root's rank increments from k to k+1 only when two roots of equal rank k are merged, doubling the minimum subtree size from 2^k to 2^(k+1). Thus 2^rank <= N, or rank <= floor(log_2 N)."
    },
    {
      id: "q13-dsu-2",
      type: "mcq",
      difficulty: "apply",
      section: "Negative-Size Encoding",
      title: "Single-Array DSU Root Representation",
      prompt: "In the cache-friendly single-array DSU representation `parentOrSize[0..N-1]` initialized to `-1`, what does `parentOrSize[x] = -12` signify?",
      options: [
        "Node x is the root of its connected component, and its component contains exactly 12 vertices",
        "Node x has parent 12 and is at depth 1",
        "Node x has been deleted from the DSU",
        "Node x has rank 12"
      ],
      answer: 0,
      explanation: "Non-negative entries store the parent index `p >= 0`, whereas negative entries mark a root `r` and encode the component cardinality as `-parentOrSize[r]`."
    },
    {
      id: "q13-dsu-3",
      type: "mcq",
      difficulty: "apply",
      section: "Heuristic Combinations",
      title: "Path Compression Without Union by Rank",
      prompt: "What happens to the amortized time complexity of $M$ operations on $N$ elements if you implement Path Compression in `find(x)` but use naive linking (`parent[ra] = rb` arbitrarily) instead of Union by Rank/Size?",
      options: [
        "It degrades from O(M alpha(N)) to O(M log N) amortized",
        "It remains O(M alpha(N)) because path compression alone suffices",
        "It degrades to O(M * N) worst-case per find",
        "It becomes O(M) strict linear time"
      ],
      answer: 0,
      explanation: "Without Union by Rank/Size, carefully linking large flat trees under single nodes before compressing can force O(log n) pointer hops per operation (Tarjan & van Leeuwen 1984)."
    },
    {
      id: "q13-dsu-4",
      type: "mcq",
      difficulty: "staff",
      section: "Inverse Ackermann Proof",
      title: "Why Rank Stays Frozen During Path Compression",
      prompt: "When Path Compression flattens a subtree during `find(x)`, the actual height of ancestor nodes decreases, yet the algorithm never decrements `rank[u]`. Why is `rank[u]` kept frozen as an upper bound rather than recomputed?",
      options: [
        "Maintaining exact subtree heights during path compression would require bottom-up child scans, and Tarjan's potential proof only requires rank(u) < rank(parent[u]) with at most N / 2^r nodes of rank r",
        "Decrementing rank[u] would cause infinite loops in find(x)",
        "Because rank[u] is stored in read-only ROM memory",
        "Because path compression never changes the height of any tree"
      ],
      answer: 0,
      explanation: "Keeping rank as a monotonic upper bound preserves both key invariants required by the Ackermann bucket proof: strict increase along parent pointers (`rank[u] < rank[p]`) and exponential scarcity of high-rank nodes (`<= N / 2^r`)."
    }
  ],

  "dsu-rollback-weighted-offline": [
    {
      id: "q13-rdsu-1",
      type: "mcq",
      difficulty: "recall",
      section: "Rollback DSU Invariant",
      title: "Why Path Compression Breaks Rollback DSU",
      prompt: "Why must a Rollback DSU omit Path Compression and rely solely on Union by Size/Rank?",
      options: [
        "Path compression mutates O(log N) parent pointers per find query and destroys the historical tree topology needed for O(1) LIFO undo",
        "Path compression makes the tree height exceed O(N)",
        "Union by Size is faster than Path Compression on static graphs",
        "Path compression cannot be written iteratively"
      ],
      answer: 0,
      explanation: "With Union by Size alone, `find(x)` is a pure read-only traversal taking O(log N) worst-case time, and `union(a, b)` mutates exactly two array slots (`parent[rb]` and `sz[ra]`), allowing an O(1) undo record."
    },
    {
      id: "q13-rdsu-2",
      type: "mcq",
      difficulty: "apply",
      section: "Weighted / Potential DSU",
      title: "Path Compression Potential Update Order",
      prompt: "In a Weighted DSU maintaining $\\text{pot}[x] = \\varphi(x) - \\varphi(\\text{parent}[x])$, why must you cache `int p = parent[x]` and call `find(p)` *before* updating `pot[x] += pot[p]`?",
      options: [
        "Because `pot[p]` only holds the total potential from `p` to the root *after* the recursive call `find(p)` has compressed `p` directly to the root",
        "To avoid integer overflow in `pot[x]`",
        "Because `parent[x]` is negative before `find(p)` runs",
        "Order does not matter; updating `pot[x]` before `find(p)` gives the same result"
      ],
      answer: 0,
      explanation: "Before `find(p)` executes, `pot[p]` only stores the single-edge delta from `p` to `parent[p]`. After `find(p)` returns, `p` points directly to the root `r` and `pot[p]` holds the full telescoping sum from `p` to `r`."
    },
    {
      id: "q13-rdsu-3",
      type: "numeric",
      difficulty: "apply",
      section: "Segment Tree Over Time",
      title: "Maximum Segment Tree Intervals per Edge Lifespan",
      prompt: "In Offline Dynamic Connectivity over $T = 1024$ time steps, an edge that is active during the contiguous time interval $[l, r]$ is inserted into the Segment Tree over time $[0, 1023]$. At most how many Segment Tree nodes will store this edge? (Use $2 \\log_2 T$).",
      answer: 20,
      tolerance: 2,
      unit: "nodes",
      hint: "A standard segment tree of size T = 2^10 decomposes any range [l, r] into at most 2 * log2(T) canonical nodes.",
      explanation: "Just like a range query in a segment tree visits at most 2 * log2(T) = 2 * 10 = 20 canonical intervals, an edge's active lifespan [l, r] is pushed into at most 20 node edge-lists."
    },
    {
      id: "q13-rdsu-4",
      type: "mcq",
      difficulty: "staff",
      section: "Online Odd-Cycle Detection",
      title: "Bipartite Parity Condition on Intra-Component Edges",
      prompt: "In an online bipartite graph checker using Parity DSU (where `parity[x]` is the XOR distance to `find(x)`), suppose `unite(u, v)` finds that `u` and `v` already share the same root `r`. Under what condition does adding edge $(u, v)$ create an odd cycle?",
      options: [
        "When (parity[u] ^ parity[v]) == 0, meaning u and v currently have the same 2-coloring parity relative to root r",
        "When (parity[u] ^ parity[v]) == 1",
        "Whenever u and v are already in the same component, regardless of parity",
        "When sz[r] is odd"
      ],
      answer: 0,
      explanation: "The existing tree path between u and v has length parity `parity[u] ^ parity[v]`. Adding edge (u, v) closes a cycle of length `(parity[u] ^ parity[v]) ^ 1`, which is odd if and only if `parity[u] == parity[v]`."
    }
  ],

  "mst-cut-cycle-properties": [
    {
      id: "q13-mst-1",
      type: "mcq",
      difficulty: "recall",
      section: "Cut & Cycle Optimality",
      title: "The Cut Property vs The Cycle Property",
      prompt: "Which statement accurately captures the duality between the Cut Property and the Cycle Property for Minimum Spanning Trees?",
      options: [
        "The strictly lightest edge crossing any cut (S, V \\ S) belongs to every MST, whereas the strictly heaviest edge on any simple cycle belongs to no MST",
        "The lightest edge on any cycle belongs to every MST, and the heaviest edge across any cut belongs to no MST",
        "Both properties apply only when all edge weights are positive",
        "The Cut Property justifies Kruskal's algorithm, while only the Cycle Property justifies Prim's algorithm"
      ],
      answer: 0,
      explanation: "By exchange argument, swapping a lighter cut edge into a spanning tree strictly reduces weight (Cut Property), and removing the heaviest edge on a cycle breaks the cycle maximally (Cycle Property)."
    },
    {
      id: "q13-mst-2",
      type: "mcq",
      difficulty: "apply",
      section: "Dense vs Sparse MST",
      title: "Choosing Unindexed Prim vs Kruskal on Complete Graphs",
      prompt: "You need to compute the Minimum Spanning Tree of a complete Euclidean graph on $V = 5{,}000$ points in 2D space ($E = V(V-1)/2 \\approx 1.25 \\times 10^7$ implicit edges). Which algorithm minimizes both time and memory?",
      options: [
        "Dense array-based Prim's algorithm in O(V^2) time and O(V) auxiliary space, computing distances on the fly without materializing the 1.25M-edge list",
        "Kruskal's algorithm in O(E log E) time by allocating and sorting all 1.25 * 10^7 edges",
        "Heap-based Prim's algorithm pushing all 1.25 * 10^7 edges into a binary heap",
        "Bellman-Ford MST relaxation"
      ],
      answer: 0,
      explanation: "Materializing and sorting E = 1.25e7 edges for Kruskal requires ~200MB of RAM and ~3e8 comparisons, whereas O(V^2) array-based Prim needs only 5,000 floats in L1 cache and 2.5e7 distance evaluations."
    },
    {
      id: "q13-mst-3",
      type: "mcq",
      difficulty: "apply",
      section: "Bottleneck Paths",
      title: "Minimax Bottleneck Path Property of an MST",
      prompt: "Let $T$ be a Minimum Spanning Tree of a connected undirected weighted graph $G$. What special property does the unique path between any two vertices $u$ and $v$ in $T$ satisfy?",
      options: [
        "It minimizes the maximum edge weight along the path (the minimax bottleneck path) over all possible u-v paths in G",
        "It minimizes the sum of edge weights (the shortest path) between u and v in G",
        "It contains the fewest hops between u and v",
        "It maximizes the minimum edge weight along the path"
      ],
      answer: 0,
      explanation: "Every MST is automatically a Minimum Bottleneck Spanning Tree (MBST): if a u-v path in G had a strictly smaller maximum edge weight than the tree path's heaviest edge e, removing e from T would create a cut crossed by a lighter edge, violating the Cut Property."
    },
    {
      id: "q13-mst-4",
      type: "mcq",
      difficulty: "staff",
      section: "Borůvka's Parallelism",
      title: "Tie-Breaking Hazard in Borůvka's Algorithm",
      prompt: "In Borůvka's MST algorithm, every connected component simultaneously selects its minimum-weight outgoing edge. If edge weights are not unique and ties are broken inconsistently, what bug can occur in a single Borůvka phase?",
      options: [
        "A cycle of components can mutually select edges that form a closed cycle (e.g., A picks (A,B) of weight 5 and B picks a different parallel/equal edge (B,A) of weight 5)",
        "The algorithm can disconnectedly drop vertices",
        "The number of components increases instead of halving",
        "Borůvka's algorithm requires strictly positive integer weights"
      ],
      answer: 0,
      explanation: "Perturbing or tie-breaking edge weights lexicographically by `(weight, min(u,v), max(u,v), edgeId)` makes all effective edge weights strictly distinct, guaranteeing the chosen minimum outgoing edges form a cycle-free forest."
    }
  ],

  "dijkstra-relaxation-invariants": [
    {
      id: "q13-dijk-1",
      type: "mcq",
      difficulty: "recall",
      section: "Lazy Deletion Pattern",
      title: "One-Line Stale Entry Guard in Lazy Dijkstra",
      prompt: "When implementing Dijkstra's algorithm with a standard `std::priority_queue` (which lacks `decreaseKey`), duplicate pairs `(d, u)` are pushed whenever `dist[u]` improves. What check immediately after popping `(d, u)` guarantees each vertex is expanded at most once?",
      options: [
        "if (d > dist[u]) continue;",
        "if (d < dist[u]) break;",
        "if (dist[u] != INF) continue;",
        "if (pq.size() > V) pq.pop();"
      ],
      answer: 0,
      explanation: "If a shorter path to `u` was discovered after `(d, u)` was pushed, `dist[u]` will be strictly less than `d`. Skipping when `d > dist[u]` discards stale heap entries in O(1) time."
    },
    {
      id: "q13-dijk-2",
      type: "mcq",
      difficulty: "apply",
      section: "Dial's Bucket Queue",
      title: "Circular Bucket Array Size in Dial's Algorithm",
      prompt: "In Dial's algorithm on a graph where every edge weight is an integer in $\\{0, 1, \\dots, W\\}$, why do you only need $W + 1$ buckets (indexed modulo $W + 1$) instead of $V \\cdot W + 1$ buckets?",
      options: [
        "Because when the minimum unsettled distance in the queue is d, any edge relaxation from u (with dist[u] = d) produces a new distance in [d, d + W]",
        "Because the shortest path in any graph has length at most W",
        "Because buckets larger than W are discarded",
        "Because Dial's algorithm only works on DAGs"
      ],
      answer: 0,
      explanation: "Since Dijkstra pops vertices in non-decreasing distance order and edge weights are at most W, all active frontier vertices have distances in `[currentD, currentD + W]`, fitting in a circular ring of `W + 1` buckets."
    },
    {
      id: "q13-dijk-3",
      type: "mcq",
      difficulty: "apply",
      section: "Priority Queue Tradeoffs",
      title: "Why Binary/4-ary Heaps Beat Fibonacci Heaps in Practice",
      prompt: "Although Fibonacci Heaps achieve the theoretically optimal $O(E + V \\log V)$ Dijkstra bound (vs $O((V + E) \\log V)$ for binary heaps), why are contiguous 4-ary or binary heaps almost universally faster in production?",
      options: [
        "Fibonacci heaps manipulate four pointers per node across fragmented heap allocations, incurring massive cache misses, whereas most real sparse graphs have E = O(V) where decreaseKey rarely triggers deep sift-ups",
        "Fibonacci heaps cannot handle 64-bit integer distances",
        "Binary heaps have O(1) extractMin",
        "Fibonacci heaps only work on undirected graphs"
      ],
      answer: 0,
      explanation: "Pointer-based Fibonacci heaps suffer high constant factors and L3 cache misses on `extractMin` consolidation, whereas array-backed 4-ary heaps keep 4 children inside a single 64-byte cache line."
    },
    {
      id: "q13-dijk-4",
      type: "mcq",
      difficulty: "staff",
      section: "Negative Edge Trap",
      title: "Exponential Blowup of Re-Expansion Dijkstra on Negative Edges",
      prompt: "If you remove the settled-set assumption in Dijkstra and allow a vertex $u$ to be re-pushed into the priority queue whenever a negative edge improves `dist[u]`, what happens to the worst-case time complexity on graphs with negative edges (even without negative cycles)?",
      options: [
        "It degrades to exponential O(2^V) time on adversarial DAGs of stacked negative-weight gadgets",
        "It runs in O(V * E) like Bellman-Ford",
        "It remains O((V + E) log V)",
        "It loops infinitely even when no negative cycles exist"
      ],
      answer: 0,
      explanation: "On a chain of gadgets with exponentially decreasing negative edge weights (e.g., -1, -2, -4, -8, ...), greedy min-first ordering expands the entire downstream suffix before discovering each negative shortcut, causing 2^(V/2) pops."
    }
  ],

  "astar-heuristic-admissibility": [
    {
      id: "q13-astar-1",
      type: "mcq",
      difficulty: "recall",
      section: "Admissibility vs Consistency",
      title: "Defining Heuristic Consistency (Monotonicity)",
      prompt: "In $A^*$ search toward target $t$, what inequality defines a **consistent** (monotonic) heuristic $h(u)$?",
      options: [
        "h(u) <= w(u, v) + h(v) for every directed edge (u, v), with h(t) = 0",
        "h(u) >= d*(u, t) for all vertices u",
        "h(u) == w(u, v) - h(v)",
        "h(u) <= g(u) for all vertices u"
      ],
      answer: 0,
      explanation: "Consistency is the triangle inequality `h(u) <= w(u,v) + h(v)`, which ensures the reduced edge weight `w_h(u,v) = w(u,v) + h(v) - h(u) >= 0` is non-negative."
    },
    {
      id: "q13-astar-2",
      type: "mcq",
      difficulty: "apply",
      section: "Grid Heuristics",
      title: "Admissible Heuristic for 8-Directional Grid Movement",
      prompt: "On a 2D grid where orthogonal steps cost $1$ and diagonal steps cost $\\sqrt{2}$ (octile grid), why is the Manhattan distance $h(u) = |\\Delta x| + |\\Delta y|$ **inadmissible**?",
      options: [
        "Because a diagonal move reduces both |dx| and |dy| by 1 at cost sqrt(2) ≈ 1.414, whereas Manhattan distance estimates the cost as 1 + 1 = 2, overestimating the true shortest path",
        "Because Manhattan distance underestimates the true distance",
        "Because Manhattan distance can be negative",
        "Because Manhattan distance takes O(N) time to compute"
      ],
      answer: 0,
      explanation: "From (0,0) to (10,10), the true 8-directional distance is 10 * sqrt(2) ≈ 14.14, but Manhattan distance is 10 + 10 = 20 > 14.14. Overestimating d*(u,t) violates admissibility and can cause A* to return a suboptimal path."
    },
    {
      id: "q13-astar-3",
      type: "mcq",
      difficulty: "apply",
      section: "Potential Equivalence",
      title: "A* as Dijkstra with Reduced Edge Weights",
      prompt: "Running $A^*$ with priority key $f(u) = g(u) + h(u)$ is mathematically identical to running standard Dijkstra on the same graph with reweighted edges $w_h(u, v) = w(u, v) + h(v) - h(u)$. Why does any $s \\leadsto t$ path $P$ have the same relative ordering under $w_h$ as under $w$?",
      options: [
        "Because the intermediate heuristic terms telescope: sum_{e in P} w_h(e) = sum_{e in P} w(e) + h(t) - h(s), shifting every s-t path's cost by the constant h(t) - h(s)",
        "Because h(u) is zero for every vertex on the shortest path",
        "Because w_h(u, v) is always equal to w(u, v)",
        "Because Dijkstra ignores edge weights"
      ],
      answer: 0,
      explanation: "Along path v_0 -> v_1 -> ... -> v_k, summing `h(v_i) - h(v_{i-1})` telescopes to `h(v_k) - h(v_0) = h(t) - h(s)`, which depends only on the endpoints s and t, preserving optimal paths."
    },
    {
      id: "q13-astar-4",
      type: "mcq",
      difficulty: "staff",
      section: "Bidirectional Stopping Condition",
      title: "The Meet-in-the-Middle Pitfall in Bidirectional Search",
      prompt: "In Bidirectional Dijkstra from $s$ and $t$, suppose vertex $m$ is the first vertex popped from both the forward priority queue `pqF` and backward queue `pqB`. Why is $d_F[m] + d_B[m]$ **not** guaranteed to be the shortest $s$-$t$ path?",
      options: [
        "A shorter path s -> u -> v -> t may cross a direct bridge edge (u, v) between the two settled clouds without either endpoint having been popped from both queues yet; termination requires minKey(pqF) + minKey(pqB) >= bestMu",
        "Because bidirectional search only works on unweighted graphs",
        "Because backward Dijkstra must use negative edge weights",
        "Because d_F[m] + d_B[m] underestimates the true distance"
      ],
      answer: 0,
      explanation: "For example, if s->m->t has edges (s,m)=3, (m,t)=3 (total 6) and path s->u->v->t has (s,u)=2, (u,v)=1, (v,t)=2 (total 5), m can be popped from both sides at radius 3 before v is popped from F or u from B."
    }
  ],

  "bellman-ford-spfa-difference-constraints": [
    {
      id: "q13-bf-1",
      type: "mcq",
      difficulty: "recall",
      section: "Relaxation Invariant",
      title: "Why Bellman-Ford Runs Exactly V - 1 Passes",
      prompt: "In a graph with $V$ vertices and no negative-weight cycles reachable from $s$, why are $V - 1$ full edge-relaxation passes always sufficient to find all shortest paths from $s$?",
      options: [
        "Every simple path in a V-vertex graph contains at most V - 1 edges, and pass k is guaranteed to settle shortest paths of at most k edges",
        "Because a graph can have at most V - 1 edges",
        "Because negative edges can only be traversed once",
        "Because pass V resets all distances to zero"
      ],
      answer: 0,
      explanation: "By the Path-Relaxation Property, relaxing all edges in pass k propagates optimal shortest paths along the k-th edge of every shortest simple path, which has length at most V - 1."
    },
    {
      id: "q13-bf-2",
      type: "mcq",
      difficulty: "apply",
      section: "Negative Cycle Reconstruction",
      title: "Why Walk Back V Predecessor Links Before Tracing a Cycle?",
      prompt: "Suppose vertex $x$ has its distance reduced on the $V$-th pass of Bellman-Ford. Why must you first execute `for (int i = 0; i < V; ++i) x = parent[x];` before following `parent` pointers to extract the negative cycle?",
      options: [
        "Vertex x might not lie on the negative cycle itself, but rather on a downstream path reachable from the negative cycle; walking back V steps guarantees landing inside the cycle",
        "To reverse the direction of the negative cycle",
        "To clear the priority queue",
        "Because parent[x] is uninitialized for the first V steps"
      ],
      answer: 0,
      explanation: "An edge relaxation out of a negative cycle can propagate to a downstream tree vertex `x` during pass V. Stepping backward V times along `parent` pointers in a V-vertex graph must enter the cycle of predecessors."
    },
    {
      id: "q13-bf-3",
      type: "mcq",
      difficulty: "apply",
      section: "Difference Constraints",
      title: "Modeling Linear Inequalities as Shortest Paths",
      prompt: "To solve a system of difference constraints using Bellman-Ford, how should the linear inequality $x_v - x_u \\le c$ be encoded as a directed graph edge?",
      options: [
        "Add a directed edge u -> v with weight c",
        "Add a directed edge v -> u with weight c",
        "Add a directed edge u -> v with weight -c",
        "Add an undirected edge {u, v} with weight c"
      ],
      answer: 0,
      explanation: "Shortest path distances satisfy the triangle inequality `dist[v] <= dist[u] + w(u, v)`, which rearranges to `dist[v] - dist[u] <= w(u, v)`. Setting `x_i = dist[i]` requires a directed edge `u -> v` of weight `c`."
    },
    {
      id: "q13-bf-4",
      type: "mcq",
      difficulty: "staff",
      section: "Currency Arbitrage",
      title: "Detecting Multiplicative Exchange-Rate Arbitrage",
      prompt: "Given a table of currency exchange rates $R(u, v) > 0$ (units of currency $v$ per unit of currency $u$), an arbitrage loop is a cycle $C$ where $\\prod_{(u,v) \\in C} R(u, v) > 1$. How do you reduce this to Bellman-Ford?",
      options: [
        "Set edge weights to w(u, v) = -ln(R(u, v)) and run Bellman-Ford to detect a negative-weight cycle",
        "Set edge weights to w(u, v) = R(u, v) and run Dijkstra",
        "Set edge weights to w(u, v) = 1 / R(u, v) and find a Minimum Spanning Tree",
        "Set edge weights to w(u, v) = ln(R(u, v)) and run BFS"
      ],
      answer: 0,
      explanation: "Taking logarithms turns products into sums: `prod R(e) > 1` iff `sum ln R(e) > 0` iff `sum (-ln R(e)) < 0`, which is a negative-weight cycle under weights `w(u,v) = -ln R(u,v)`."
    }
  ],

  "floyd-warshall-johnson-apsp": [
    {
      id: "q13-apsp-1",
      type: "mcq",
      difficulty: "recall",
      section: "Floyd-Warshall Loop Order",
      title: "Why Intermediate Vertex k Must Be the Outer Loop",
      prompt: "In Floyd-Warshall's triple nested loop, why must the intermediate vertex `k` be the outermost loop (`for k ... for i ... for j`) rather than the innermost loop?",
      options: [
        "The DP recurrence dp[k][i][j] builds paths using intermediate vertices {0..k} from two sub-paths that already use {0..k-1}; placing k outermost ensures stage k-1 is complete for all pairs before stage k begins",
        "Putting k outermost improves CPU cache locality",
        "Putting k innermost causes integer overflow",
        "Loop order does not matter as long as you run it twice"
      ],
      answer: 0,
      explanation: "If `k` is placed innermost (`for i, for j, for k`), computing `dist[i][j]` only concatenates two paths `i ~> k` and `k ~> j` whose own intermediate vertices were not yet relaxed through larger `k'`."
    },
    {
      id: "q13-apsp-2",
      type: "mcq",
      difficulty: "apply",
      section: "Negative Cycles in Floyd-Warshall",
      title: "Detecting Negative Cycles in the Distance Matrix",
      prompt: "After running Floyd-Warshall on a graph with $V$ vertices, how do you check whether the graph contains a negative-weight cycle?",
      options: [
        "Check whether any diagonal entry satisfies dist[i][i] < 0 for some 0 <= i < V",
        "Check whether any off-diagonal entry dist[i][j] < 0",
        "Run a 4th nested loop",
        "Check whether the sum of all matrix entries is negative"
      ],
      answer: 0,
      explanation: "`dist[i][i]` initialized to 0 represents the minimum weight of a non-trivial cycle starting and ending at vertex `i`; `dist[i][i] < 0` iff `i` lies on (or can traverse) a negative cycle."
    },
    {
      id: "q13-apsp-3",
      type: "mcq",
      difficulty: "apply",
      section: "Johnson's Algorithm",
      title: "Recovering Original Distances After Potential Reweighting",
      prompt: "In Johnson's algorithm, Bellman-Ford computes potentials $h(v)$ from a super-source, edges are reweighted to $w'(u, v) = w(u, v) + h(u) - h(v) \\ge 0$, and Dijkstra computes reweighted shortest distances $d'(u, v)$. How is the true distance $d(u, v)$ in the original graph recovered?",
      options: [
        "d(u, v) = d'(u, v) - h(u) + h(v)",
        "d(u, v) = d'(u, v) + h(u) - h(v)",
        "d(u, v) = d'(u, v)",
        "d(u, v) = d'(u, v) * h(v) / h(u)"
      ],
      answer: 0,
      explanation: "Because `d'(u, v) = d(u, v) + h(u) - h(v)` by telescoping along any u->v path, subtracting `h(u) - h(v)` yields `d(u, v) = d'(u, v) - h(u) + h(v)`."
    },
    {
      id: "q13-apsp-4",
      type: "mcq",
      difficulty: "staff",
      section: "Sparse vs Dense APSP",
      title: "Asymptotic Crossover Between Floyd-Warshall and Johnson's Algorithm",
      prompt: "On a sparse graph with negative edge weights (no negative cycles) where $V = 4{,}000$ and $E = 12{,}000$, how do the operation counts of Floyd-Warshall ($O(V^3)$) and Johnson's Algorithm ($O(VE + V(V+E)\\log V)$) compare?",
      options: [
        "Floyd-Warshall performs ~6.4 * 10^10 operations (~30 seconds), whereas Johnson's algorithm performs ~6 * 10^8 operations (< 0.4 seconds)—over 100x faster",
        "Floyd-Warshall is faster because it has no priority queue",
        "Both take the same time because negative edges force O(V^3)",
        "Johnson's algorithm cannot handle negative edge weights"
      ],
      answer: 0,
      explanation: "When E = O(V), Johnson's algorithm runs one O(V^2) Bellman-Ford pass plus V runs of O(V log V) Dijkstra = O(V^2 log V), saving a full factor of V / log V ≈ 330x over O(V^3)."
    }
  ],

  "state-space-dijkstra-layered-graphs": [
    {
      id: "q13-layer-1",
      type: "numeric",
      difficulty: "recall",
      section: "Layered Graph Sizing",
      title: "Flattened State Space Size for K Discounts",
      prompt: "You want to find the shortest path in a graph with $V = 500$ vertices and up to $K = 5$ free-edge coupons (using 0, 1, 2, 3, 4, or 5 coupons). How many total state-vertices `(u, c)` exist in the layered product graph?",
      answer: 3000,
      tolerance: 0,
      unit: "states",
      hint: "Multiply V by the number of layers (K + 1, since c ranges from 0 to K inclusive).",
      explanation: "Since c in {0, 1, 2, 3, 4, 5} has K + 1 = 6 possible values, the layered graph has V * (K + 1) = 500 * 6 = 3,000 states."
    },
    {
      id: "q13-layer-2",
      type: "mcq",
      difficulty: "apply",
      section: "Refueling State-Space Graph",
      title: "Avoiding O(C) Transitions per Refuel State",
      prompt: "In the Minimum-Cost Refueling problem (tank capacity $C$, gas price $p[u]$ at city $u$), if a driver at state `(u, f)` could transition directly to `(u, f')` for every $f' > f$, each state would have $O(C)$ outgoing transitions. How do you reduce refueling transitions to $O(1)$ per state?",
      options: [
        "Only add a single 1-unit refuel edge `(u, f) -> (u, f + 1)` of cost `p[u]` (when `f < C`); buying k units is naturally represented by traversing k consecutive unit edges",
        "Only allow refueling when the tank is completely empty (`f == 0`)",
        "Only allow filling the tank to 100% capacity (`f == C`)",
        "Run Bellman-Ford instead of Dijkstra"
      ],
      answer: 0,
      explanation: "Replacing O(C) jump edges with a single incremental transition `(u, f) -> (u, f+1)` of weight `p[u]` keeps the state out-degree at `deg(u) + 1`, cutting the total edge count by a factor of C."
    },
    {
      id: "q13-layer-3",
      type: "mcq",
      difficulty: "apply",
      section: "Bitmask BFS/Dijkstra",
      title: "State Definition for Shortest Path Visiting All Waypoints",
      prompt: "In a grid or graph containing $P \\le 12$ mandatory checkpoints where you may revisit vertices and edges to collect all $P$ checkpoints in any order, what is the minimal state representation?",
      options: [
        "(u, mask) where u in [0, V) is the current vertex and mask in [0, 2^P) is the bitmask of collected checkpoints",
        "Just u, marking visited[u] = true",
        "(u, count) where count in [0, P] is the number of checkpoints collected so far",
        "Permuting all P! orders without precomputing shortest paths"
      ],
      answer: 0,
      explanation: "Because vertices can be revisited only when carrying a strictly newer subset of collected keys, the state must distinguish which subset `mask` has been collected, yielding V * 2^P states."
    },
    {
      id: "q13-layer-4",
      type: "mcq",
      difficulty: "staff",
      section: "Dominance Pruning",
      title: "Bi-Criteria Pareto Dominance in Constrained Shortest Paths",
      prompt: "In the Weight-Constrained Shortest Path problem (minimize toll cost subject to travel time $\\le T_{\\max}$), why don't you need to expand a state `(u, time2)` of cost `cost2` if you have already settled `(u, time1)` with `time1 <= time2` and `cost1 <= cost2`?",
      options: [
        "Because state (u, time1, cost1) Pareto-dominates (u, time2, cost2): any valid suffix path from u to t feasible from (u, time2) is also feasible and no more expensive from (u, time1)",
        "Because time and cost are always proportional",
        "Because Dijkstra pops states by decreasing time",
        "Because the graph is a tree"
      ],
      answer: 0,
      explanation: "Since Dijkstra pops states in non-decreasing order of `cost`, the first time a state at `u` is popped it has minimum cost; any subsequent pop at `u` has `cost2 >= cost1`, so it is only useful if its `time2 < minTimeSeen[u]`."
    }
  ],

  "case-osrm-contraction-hierarchies": [
    {
      id: "q13-ch-1",
      type: "mcq",
      difficulty: "recall",
      section: "Witness Search & Shortcuts",
      title: "When Contraction Hierarchies Add a Shortcut Edge",
      prompt: "During the preprocessing phase of Contraction Hierarchies (CH), when node $v$ is contracted between neighbor $u$ (with incoming edge $(u, v)$) and neighbor $w$ (with outgoing edge $(v, w)$), when must a shortcut edge $(u, w)$ of weight $w(u, v) + w(v, w)$ be added?",
      options: [
        "If and only if the shortest path from u to w in the remaining uncontracted graph has length > w(u, v) + w(v, w) (i.e., v is the unique witness for the shortest u-w path)",
        "Always, for every pair of neighbors (u, w) regardless of existing paths",
        "Only when u and w are highway interchanges",
        "Never; CH deletes nodes without adding edges"
      ],
      answer: 0,
      explanation: "A local witness Dijkstra checks if an alternative path u ~> w of weight <= w(u,v) + w(v,w) exists avoiding v. Only if no such witness exists is the shortcut (u, w) necessary to preserve all shortest-path distances."
    },
    {
      id: "q13-ch-2",
      type: "mcq",
      difficulty: "apply",
      section: "Upward-Only Query Invariant",
      title: "Why Bidirectional CH Queries Only Relax Upward Edges",
      prompt: "At query time in a Contraction Hierarchy with node importance ranks $r(u)$, the forward search from $s$ only relaxes edges $(u, v)$ with $r(u) < r(v)$, and the backward search from $t$ only relaxes reversed edges $(w, v)$ with $r(w) < r(v)$. Why does this always find the exact shortest path?",
      options: [
        "Every shortest path in the shortcut-augmented graph can be decomposed into an upward-rank prefix s = u_0 < u_1 < ... < u_p and a downward-rank suffix u_p > ... > t meeting at the single highest-ranked apex vertex u_p",
        "Because road networks are Directed Acyclic Graphs",
        "Because downward edges always have negative weight",
        "Because s and t always have rank 0"
      ],
      answer: 0,
      explanation: "Any interior local minimum in rank along a shortest path (`r(a) > r(b) < r(c)`) was eliminated when `b` was contracted before `a` and `c` and replaced by the shortcut `(a, c)`. Thus a Valley-free / unimodal path peaking at apex `u_p` always exists."
    },
    {
      id: "q13-ch-3",
      type: "mcq",
      difficulty: "apply",
      section: "Edge Difference Heuristic",
      title: "Choosing Contraction Order via Edge Difference",
      prompt: "Why do Contraction Hierarchy preprocessors order vertices for contraction by increasing **Edge Difference** ($\\text{shortcuts added} - \\text{incident edges removed}$)?",
      options: [
        "Contracting dead-ends and degree-2 residential streets first removes edges while adding zero or one shortcut, keeping the remaining graph sparse instead of creating an O(V^2) clique",
        "To ensure highway interchanges are contracted first",
        "To sort vertices alphabetically",
        "Because Edge Difference is always negative"
      ],
      answer: 0,
      explanation: "Contracting a major hub of degree d first could insert up to d(d-1) shortcuts, exploding graph density. Contracting low-edge-difference nodes first strips local streets cleanly before touching arterial highways."
    },
    {
      id: "q13-ch-4",
      type: "mcq",
      difficulty: "staff",
      section: "Dynamic Traffic Updates",
      title: "Customizable Contraction Hierarchies (CCH) vs Standard CH",
      prompt: "In a live navigation system like Google Maps or OSRM where live traffic updates edge travel times every 30 seconds, why is a 3-phase **Customizable Contraction Hierarchy (CCH)** used instead of re-running full CH preprocessing from scratch?",
      options: [
        "CCH fixes a topology-only nested dissection ordering once (hours), allowing metric customization to recompute shortcut weights bottom-up in ~1 second whenever traffic weights change",
        "Standard CH cannot handle floating-point edge weights",
        "CCH does not use any shortcut edges",
        "CCH runs Bellman-Ford on every query"
      ],
      answer: 0,
      explanation: "Decoupling metric-independent topological contraction (nested dissection separator ordering) from metric-dependent triangle weight relaxation lets production routing engines ingest live traffic updates in sub-second cycles."
    }
  ],

  "build-astar-bidirectional-router": [
    {
      id: "q13-build-1",
      type: "mcq",
      difficulty: "recall",
      section: "Epoch Stamping",
      title: "O(1) Distance Array Reset Across Repeated Queries",
      prompt: "In a high-throughput routing server handling $50{,}000$ queries per second on a graph with $V = 2 \\times 10^6$ vertices, why does our router use an `epoch` counter and `stamp[u] == epoch` instead of `std::fill(dist.begin(), dist.end(), INF)`?",
      options: [
        "Zeroing or filling a 2M-element array on every query touches 16MB of RAM (O(V) work), whereas incrementing `++epoch` resets the entire distance table in O(1) time so sub-linear A* queries only touch visited vertices",
        "std::fill is deprecated in C++20",
        "Epoch stamping compresses 64-bit integers into 8-bit integers",
        "Epoch stamping automatically sorts the priority queue"
      ],
      answer: 0,
      explanation: "An A* or CH query might explore only 500 vertices out of 2,000,000. Spending O(V) time in `std::fill` per query would make the initialization 4,000x slower than the search itself!"
    },
    {
      id: "q13-build-2",
      type: "mcq",
      difficulty: "apply",
      section: "Directed Backward Search",
      title: "Graph Transpose Requirement in Bidirectional Dijkstra",
      prompt: "When running Bidirectional Dijkstra on a **directed** road network with one-way streets, which adjacency list must the backward search from $t$ expand?",
      options: [
        "The reversed (transpose) adjacency list `revAdj`, where every original directed edge u -> v is stored as v -> u",
        "The standard forward adjacency list `adj`",
        "Both `adj` and `revAdj` simultaneously",
        "An unweighted adjacency matrix"
      ],
      answer: 0,
      explanation: "The backward search from t computes shortest paths `m ~> t` in the original graph, which correspond to paths `t ~> m` traversing directed edges in reverse (`revAdj`)."
    },
    {
      id: "q13-build-3",
      type: "mcq",
      difficulty: "apply",
      section: "Best-Seen Upper Bound mu",
      title: "When to Update the Best Path Length mu",
      prompt: "In Bidirectional Dijkstra, when relaxing a forward edge $(u, v)$ that improves $d_F[v]$, if vertex $v$ has already been reached by the backward search (`stampB[v] == epoch`), how should the incumbent upper bound $\\mu$ be updated?",
      options: [
        "mu = min(mu, d_F[u] + w(u, v) + d_B[v]) immediately during edge relaxation, even before v is popped from pqB",
        "Only update mu when v is popped from both pqF and pqB",
        "Set mu = d_F[v] - d_B[v]",
        "Never update mu during edge relaxation"
      ],
      answer: 0,
      explanation: "Any edge (u, v) bridging a forward-reached vertex u and a backward-reached vertex v forms a valid s ~> u -> v ~> t path of length `d_F[u] + w(u,v) + d_B[v]`, so updating `mu` immediately during relaxation captures bridge edges accurately."
    },
    {
      id: "q13-build-4",
      type: "mcq",
      difficulty: "staff",
      section: "Path Reconstruction",
      title: "Splicing Forward and Backward Predecessor Chains",
      prompt: "Once Bidirectional Dijkstra terminates with optimal meeting vertex `meetNode`, how is the complete $s \\leadsto t$ vertex sequence reconstructed from forward predecessors `pF[]` and backward predecessors `pB[]`?",
      options: [
        "Follow `pF` backward from `meetNode` to `s`, reverse that prefix, and then append the nodes obtained by following `pB` from `pB[meetNode]` to `t`",
        "Follow `pF` from `s` to `t` directly",
        "Concatenate `pB` followed by `pF` without reversing either",
        "Sort all visited vertices by `dF[u]`"
      ],
      answer: 0,
      explanation: "`pF` traces `meetNode -> ... -> s` (which reverses to `s -> ... -> meetNode`), while `pB` (recorded by expanding `revAdj` from `t`) already points along forward edges `meetNode -> pB[meetNode] -> ... -> t`."
    }
  ]
});
