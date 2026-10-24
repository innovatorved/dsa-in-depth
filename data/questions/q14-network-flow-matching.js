window.QUESTION_BANK = window.QUESTION_BANK || {};
Object.assign(window.QUESTION_BANK, {
  "flow-networks-residual-graphs": [
    {
      id: "q14-flow-1",
      type: "mcq",
      difficulty: "recall",
      section: "Residual Graph Mechanics",
      title: "Role of Backward Residual Edges",
      prompt: "In the Ford-Fulkerson method, why do we add $\\Delta$ units of capacity to the backward residual edge $(v, u)$ whenever we push $\\Delta$ units of flow forward along edge $(u, v)$?",
      options: [
        "Pushing flow along the backward residual edge (v, u) in a later augmentation cancels (reroutes) previously committed flow on (u, v), preventing greedy lock-in",
        "To convert the directed graph into an undirected graph",
        "To ensure all cycles have positive weight",
        "Because flow conservation requires every edge to carry flow in both directions simultaneously"
      ],
      answer: 0,
      explanation: "Decreasing f(u, v) by d while remaining >= 0 is mathematically identical to pushing d units along a reverse residual arc (v, u) of capacity c_f(v, u) = f(u, v)."
    },
    {
      id: "q14-flow-2",
      type: "numeric",
      difficulty: "apply",
      section: "Paired XOR Indexing",
      title: "Bitwise XOR Reverse Edge Lookup",
      prompt: "In a flat residual arc vector where forward and backward arcs are appended in pairs `(2k, 2k+1)` starting at index `0`, if a forward arc is stored at index `id = 14`, at what array index is its reverse residual arc located?",
      answer: 15,
      tolerance: 0,
      unit: "index",
      hint: "Compute 14 ^ 1.",
      explanation: "For any even index 2k, (2k) ^ 1 = 2k + 1 (14 ^ 1 = 15), and for any odd index 2k + 1, (2k + 1) ^ 1 = 2k (15 ^ 1 = 14)."
    },
    {
      id: "q14-flow-3",
      type: "mcq",
      difficulty: "apply",
      section: "Ford-Fulkerson Complexity",
      title: "Why Naive DFS Ford-Fulkerson Is Pseudo-Polynomial",
      prompt: "On the 4-vertex diamond network where outer edges have capacity $U = 10^9$ and the middle cross-edge $(a, b)$ has capacity $1$, how many augmenting paths can naive DFS Ford-Fulkerson take in the worst case?",
      options: [
        "2 * 10^9 augmentations, alternating between s -> a -> b -> t and s -> b -> a -> t by 1 unit each time",
        "At most 4 augmentations because E = 5",
        "At most log_2(10^9) ≈ 30 augmentations",
        "It loops infinitely on integer capacities"
      ],
      answer: 0,
      explanation: "Without shortest-path (Edmonds-Karp) or capacity-scaling selection, DFS can repeatedly route 1 unit across (a, b) and then undo it via (b, a), taking O(E * |f*|) = 2 * 10^9 steps."
    },
    {
      id: "q14-flow-4",
      type: "mcq",
      difficulty: "staff",
      section: "Capacity Scaling",
      title: "Capacity Scaling Polynomial Bound",
      prompt: "How does Capacity Scaling eliminate the $O(E |f^*|)$ pathology of DFS Ford-Fulkerson?",
      options: [
        "It maintains a threshold Delta = 2^k down to 1 and only traverses residual edges with c_f(e) >= Delta, guaranteeing at most 2E augmentations per scaling phase and O(E^2 log U) total time",
        "It sorts all edges by weight once like Kruskal's algorithm",
        "It divides all capacities by 2 and rounds down",
        "It replaces the graph with a Minimum Spanning Tree"
      ],
      answer: 0,
      explanation: "At the end of phase 2*Delta, the minimum cut in the >= 2*Delta residual graph has residual capacity < 2*Delta * E, so in phase Delta at most 2E augmentations of size >= Delta can occur across O(log U) phases."
    }
  ],

  "max-flow-min-cut-theorem": [
    {
      id: "q14-cut-1",
      type: "mcq",
      difficulty: "recall",
      section: "Cut Capacity Definition",
      title: "Directional Capacity of an s-t Cut",
      prompt: "Given an $s$-$t$ cut $(S, T)$ with $s \\in S$ and $t \\in T$, how is the capacity $c(S, T)$ defined?",
      options: [
        "The sum of capacities c(u, v) of directed edges with u in S and v in T (ignoring edges directed from T to S)",
        "The sum of capacities of edges in both directions between S and T",
        "The sum of capacities of edges from S to T minus the capacities of edges from T to S",
        "The minimum capacity of a single edge between S and T"
      ],
      answer: 0,
      explanation: "While net flow across a cut is `f(S, T) - f(T, S)`, the capacity `c(S, T)` bounds `f(S, T) <= c(S, T)` and counts only forward edges from S to T."
    },
    {
      id: "q14-cut-2",
      type: "mcq",
      difficulty: "apply",
      section: "Min-Cut Extraction",
      title: "Why Saturated Edges Alone Do Not Define the Min-Cut",
      prompt: "After computing a maximum flow $f^*$, why is it **incorrect** to extract the minimum $s$-$t$ cut simply by collecting all edges where $f^*(e) = c(e)$?",
      options: [
        "Edges internal to S x S or T x T may also be 100% saturated without crossing the cut; the true min-cut consists of edges (u, v) where u is reachable from s in G_f and v is not",
        "Because min-cut edges always have f*(e) = 0",
        "Because no edge in a maximum flow is ever saturated",
        "Because only reverse edges belong to the min-cut"
      ],
      answer: 0,
      explanation: "For example, if s -> a (cap 5) feeds a -> t (cap 5), both edges are saturated, so taking all saturated edges yields total capacity 10 instead of the true min-cut 5."
    },
    {
      id: "q14-cut-3",
      type: "mcq",
      difficulty: "apply",
      section: "Integrality Theorem",
      title: "Consequence of the Integrality Theorem",
      prompt: "What does the Integrality Theorem for network flows guarantee when all edge capacities $c(e)$ are non-negative integers?",
      options: [
        "There exists a maximum flow f* in which the flow value f*(e) on every edge is an integer, and Ford-Fulkerson / Dinic automatically finds one",
        "The minimum cut contains an even number of edges",
        "Every fractional flow is invalid",
        "The maximum flow value is always a prime number"
      ],
      answer: 0,
      explanation: "Because residual capacities start as integers and each augmentation subtracts/adds integer bottlenecks, every edge flow remains an integer throughout execution."
    },
    {
      id: "q14-cut-4",
      type: "mcq",
      difficulty: "staff",
      section: "Sensitivity Analysis",
      title: "Identifying Critical Bottleneck Edges Whose Capacity Increase Raises Max-Flow",
      prompt: "After running Dinic's algorithm, you want to find all directed edges $e = (u, v) \\in E$ such that increasing $c(e)$ by $+1$ strictly increases the maximum $s$-$t$ flow. Which condition characterizes such edges?",
      options: [
        "In the final residual graph G_f, u is reachable from s (via positive-residual edges) AND t is reachable from v (i.e., v can reach t in G_f)",
        "Every edge with f(u, v) == c(u, v)",
        "Every edge on the minimum s-t cut (u in S, v in T)",
        "Every edge incident to s"
      ],
      answer: 0,
      explanation: "Increasing c(u, v) by +1 creates residual edge (u, v). This creates an s ~> t augmenting path in G_f iff s can reach u in G_f AND v can reach t in G_f (note: if two serial min-cuts exist, a single cut edge has u in S but v cannot reach t!)."
    }
  ],

  "edmonds-karp-shortest-augmenting": [
    {
      id: "q14-ek-1",
      type: "mcq",
      difficulty: "recall",
      section: "Algorithmic Definition",
      title: "How Edmonds-Karp Selects Augmenting Paths",
      prompt: "How does the Edmonds-Karp algorithm choose which augmenting path to push flow along in each iteration?",
      options: [
        "It runs an unweighted BFS in the residual graph G_f to select a path with the minimum number of edges",
        "It runs Dijkstra's algorithm treating capacities as edge weights",
        "It selects the path with the maximum bottleneck capacity",
        "It uses DFS with randomized neighbor order"
      ],
      answer: 0,
      explanation: "Edmonds-Karp defines path length strictly by hop count (1 per residual edge), found in O(E) time via unweighted BFS."
    },
    {
      id: "q14-ek-2",
      type: "mcq",
      difficulty: "apply",
      section: "Monotonicity Lemma",
      title: "Why Critical Edges Saturate at Most V/2 Times",
      prompt: "In the Edmonds-Karp proof, when edge $(u, v)$ is a critical bottleneck edge that saturates, $\\delta_f(s, v) = \\delta_f(s, u) + 1$. Why must $\\delta(s, u)$ increase by at least $2$ before $(u, v)$ can become critical again?",
      options: [
        "Before (u, v) can be used again, flow must be pushed along reverse edge (v, u) when delta_{f'}(s, u) = delta_{f'}(s, v) + 1 >= delta_f(s, v) + 1 = delta_f(s, u) + 2",
        "Because every BFS skips odd-numbered vertices",
        "Because (u, v) is deleted permanently after saturation",
        "Because edge capacities double after each saturation"
      ],
      answer: 0,
      explanation: "Using (v, u) requires v to be 1 hop closer to s than u (`d'(u) = d'(v) + 1`), and since `d'(v) >= d(v) = d(u) + 1` by distance monotonicity, `d'(u) >= d(u) + 2`."
    },
    {
      id: "q14-ek-3",
      type: "mcq",
      difficulty: "apply",
      section: "Complexity Comparison",
      title: "Worst-Case Time Complexity of Edmonds-Karp",
      prompt: "What is the tight worst-case time complexity of Edmonds-Karp on a network with $V$ vertices and $E$ edges?",
      options: [
        "O(V E^2), because at most O(V E) augmentations occur and each BFS takes O(E) time",
        "O(V^2 E)",
        "O(E log V)",
        "O(E * |f*|)"
      ],
      answer: 0,
      explanation: "Each of the 2E residual edges can be the critical bottleneck at most V/2 times, giving O(V E) augmentations, each requiring an O(E) BFS."
    },
    {
      id: "q14-ek-4",
      type: "mcq",
      difficulty: "staff",
      section: "Edge-Disjoint Paths",
      title: "Menger's Theorem & Maximum Edge-Disjoint Paths",
      prompt: "How do you find the maximum number of edge-disjoint directed paths from $s$ to $t$ in a directed graph $G = (V, E)$, and what is the runtime using Edmonds-Karp?",
      options: [
        "Assign capacity 1 to every edge and run Max-Flow; since |f*| <= E, Edmonds-Karp finishes in at most E augmentations and O(E^2) time",
        "Run Dijkstra k times removing shortest paths, which can fail on diamond graphs",
        "Assign capacity V to every edge and run Bellman-Ford",
        "The problem is NP-hard"
      ],
      answer: 0,
      explanation: "Note that greedily removing shortest paths without reverse residual edges fails on the diamond graph! Setting c(e) = 1 and running Max-Flow (which uses reverse edges to un-cross paths) finds all k <= E edge-disjoint paths in O(E^2) time."
    }
  ],

  "dinic-level-graph-blocking-flow": [
    {
      id: "q14-dinic-1",
      type: "mcq",
      difficulty: "recall",
      section: "Blocking Flow Definition",
      title: "What Is a Blocking Flow in Dinic's Level Graph?",
      prompt: "In Dinic's algorithm, what is a **blocking flow** on the BFS level graph $G_L$?",
      options: [
        "A flow in G_L that saturates at least one edge on every directed s ~> t path in G_L (though not necessarily a maximum flow in G_f overall)",
        "A flow that saturates every edge leaving s",
        "A single augmenting path of maximum bottleneck",
        "A flow where every edge in G_L is 100% saturated"
      ],
      answer: 0,
      explanation: "A blocking flow leaves no unsaturated s ~> t path in the level DAG G_L, forcing the shortest path distance level[t] in G_f to strictly increase in the next BFS phase."
    },
    {
      id: "q14-dinic-2",
      type: "mcq",
      difficulty: "apply",
      section: "Current-Arc Pointer",
      title: "Why Omitting `int& cid = ptr[u]` Causes Exponential Slowdown",
      prompt: "In Dinic's DFS, each vertex $u$ maintains `ptr[u]` tracking the next edge in `adj[u]` to explore. What happens to the time complexity of a single blocking-flow phase if you start the loop at `cid = 0` on every DFS call instead of `int& cid = ptr[u]`?",
      options: [
        "The phase degrades from O(V E) to O(2^V) exponential time because the DFS repeatedly re-explores dead-end subgraphs in the DAG G_L",
        "The phase stays O(V E) because saturated edges have cap == 0",
        "The phase becomes O(E log V)",
        "The algorithm returns an incorrect flow value"
      ],
      answer: 0,
      explanation: "Checking `cap == 0` only skips saturated edges, NOT unsaturated edges `(u, v)` whose downstream vertex `v` is a dead end that cannot reach `t`. Advancing `ptr[u]` prunes dead-end branches permanently for the rest of the phase."
    },
    {
      id: "q14-dinic-3",
      type: "mcq",
      difficulty: "apply",
      section: "Unit Network Complexity",
      title: "Dinic's Complexity on Bipartite Matching & Unit Networks",
      prompt: "What is the worst-case time complexity of Dinic's algorithm on a unit network (such as Maximum Bipartite Matching)?",
      options: [
        "O(E * sqrt(V)), because after sqrt(V) phases all remaining augmenting paths have length >= sqrt(V) and are vertex-disjoint, bounding remaining phases by sqrt(V)",
        "O(V^2 E)",
        "O(V E^2)",
        "O(V^3)"
      ],
      answer: 0,
      explanation: "By the Even-Tarjan theorem, unit networks admit at most 2 * sqrt(V) blocking-flow phases, and each phase traverses each edge at most once in O(E) time."
    },
    {
      id: "q14-dinic-4",
      type: "mcq",
      difficulty: "staff",
      section: "Multi-Branch DFS Subtlety",
      title: "Why Multi-Branch Dinic Must Return Before Incrementing `cid` When `totalPushed == available`",
      prompt: "In the multi-branch Dinic DFS loop `for (int& cid = ptr[u]; ...)`, after pushing `tr` flow along arc `id`, why must we check `if (totalPushed == available) return totalPushed;` **before** the loop header increments `++cid`?",
      options: [
        "Because if `totalPushed == available`, node u's incoming flow budget ran out before arc `id` was necessarily saturated (`arcs[id].cap` may still be > 0); incrementing `cid` would prematurely skip remaining capacity on arc `id`",
        "To prevent stack overflow",
        "Because `cid` is a const reference",
        "Because `arcs[id ^ 1]` would not be updated otherwise"
      ],
      answer: 0,
      explanation: "An arc `id` should only be skipped by `++cid` when `arcs[id]` is either fully saturated or `v` is a dead end (`tr == 0`). If `u` exhausted its incoming `available` budget, `arcs[id]` may still carry more flow when reached from another ancestor!"
    }
  ],

  "push-relabel-preflow": [
    {
      id: "q14-pr-1",
      type: "mcq",
      difficulty: "recall",
      section: "Preflow & Height Invariant",
      title: "The Valid Height Function Inequality in Push-Relabel",
      prompt: "In Goldberg-Tarjan's Push-Relabel algorithm with $h(s) = V$ and $h(t) = 0$, what invariant must the height function $h$ satisfy for every residual edge $(u, v) \\in E_f$ ($c_f(u, v) > 0$)?",
      options: [
        "h(u) <= h(v) + 1 (no residual edge ever drops height by 2 or more)",
        "h(u) >= h(v) + 1 for all residual edges",
        "h(u) == h(v) for all residual edges",
        "h(u) < V for all u"
      ],
      answer: 0,
      explanation: "Maintaining `h(u) <= h(v) + 1` on all residual edges ensures that stepping from `h(s) = V` to `h(t) = 0` would require at least V edges, which is impossible on a simple path in a V-vertex graph."
    },
    {
      id: "q14-pr-2",
      type: "numeric",
      difficulty: "apply",
      section: "Maximum Vertex Height",
      title: "Upper Bound on Vertex Height h(u)",
      prompt: "In a flow network with $V = 100$ vertices, every active vertex $u$ ($e(u) > 0$) has a simple path to $s$ in the residual graph $G_f$. Given $h(s) = 100$ and the height invariant $h(x) \\le h(y) + 1$, what is the maximum possible height $h(u)$ any vertex can ever be relabeled to? (Use $2V - 1$).",
      answer: 199,
      tolerance: 0,
      unit: "height",
      hint: "Compute 2*V - 1 for V = 100.",
      explanation: "Since u has a simple path of length <= V - 1 to s in G_f and each edge drops height by at most 1, h(u) - h(s) <= V - 1 => h(u) <= 2V - 1 = 199."
    },
    {
      id: "q14-pr-3",
      type: "mcq",
      difficulty: "apply",
      section: "Gap Heuristic",
      title: "How the Gap Heuristic Prunes Unreachable Active Nodes",
      prompt: "Suppose relabeling vertex $u$ away from height $k$ ($0 < k < V$) leaves **zero** vertices with height $k$ (`count[k] == 0`). Why can the Gap Heuristic immediately lift every vertex $w$ with $k < h(w) < V$ to height $V + 1$?",
      options: [
        "Because residual edges can only step height downward by 1 (`h(x) = h(y) + 1`); an empty level k acts as an impassable moat separating all nodes with h(w) > k from sink t (h(t) = 0)",
        "Because all edges incident to w have capacity 0",
        "Because sink t has moved to height V + 1",
        "Because the graph is disconnected in the original network"
      ],
      answer: 0,
      explanation: "With no vertex at height k, no path in G_f can bridge from height > k to height < k. Thus vertices with h(w) > k can never reach t and represent the source side S of the min-cut."
    },
    {
      id: "q14-pr-4",
      type: "mcq",
      difficulty: "staff",
      section: "Selection Rules",
      title: "Highest-Label Selection Complexity",
      prompt: "Why does always discharging an active vertex with the **maximum height $h(u)$** (Highest-Label Push-Relabel) reduce the number of nonsaturating pushes from $O(V^2 E)$ to $O(V^2 \\sqrt{E})$?",
      options: [
        "Pushing from the global maximum height prevents lower nodes from repeatedly sending excess uphill to the same node between relabels, bounding phases without relabels across dense/sparse thresholds",
        "It eliminates saturating pushes completely",
        "It ensures no vertex is ever relabeled more than once",
        "It converts Push-Relabel into Dijkstra's algorithm"
      ],
      answer: 0,
      explanation: "Cheriyan & Maheshwari (1989) and Tunçel (1994) proved that discharging the highest active vertex bounds nonsaturating pushes to O(V^2 sqrt(E)), making Highest-Label + Gap Heuristic the fastest max-flow solver on dense benchmarks."
    }
  ],

  "bipartite-matching-hopcroft-karp": [
    {
      id: "q14-hk-1",
      type: "mcq",
      difficulty: "recall",
      section: "König's Duality",
      title: "König's Theorem and Maximum Independent Set in Bipartite Graphs",
      prompt: "In a bipartite graph with $V = 120$ vertices where Hopcroft-Karp finds a Maximum Matching of size $|M^*| = 45$, what are the sizes of the **Minimum Vertex Cover** and the **Maximum Independent Set**?",
      options: [
        "Minimum Vertex Cover = 45, and Maximum Independent Set = 120 - 45 = 75",
        "Minimum Vertex Cover = 75, and Maximum Independent Set = 45",
        "Minimum Vertex Cover = 60, and Maximum Independent Set = 60",
        "Cannot be determined from |M*| alone"
      ],
      answer: 0,
      explanation: "By König's Theorem, |Min Vertex Cover| = |Max Matching| = 45. Since the complement of a vertex cover is always an independent set, |Max Independent Set| = V - |Min Vertex Cover| = 120 - 45 = 75."
    },
    {
      id: "q14-hk-2",
      type: "mcq",
      difficulty: "apply",
      section: "Hall's Marriage Theorem",
      title: "Regular Bipartite Graphs Always Have Perfect Matchings",
      prompt: "Using Hall's Marriage Theorem ($|N(S)| \\ge |S|$ for all $S \\subseteq L$), why does every $d$-regular bipartite graph ($d \\ge 1$, where every vertex in $L$ and $R$ has degree exactly $d$) have a perfect matching?",
      options: [
        "Any subset S subseteq L has exactly d*|S| outgoing edges, and since each vertex in N(S) can absorb at most d edges, d*|N(S)| >= d*|S| => |N(S)| >= |S|",
        "Because every d-regular graph is a tree",
        "Because d-regular graphs have no cycles",
        "Only when d is an even number"
      ],
      answer: 0,
      explanation: "Double-counting the edges between S and N(S) gives `E(S, N(S)) = d * |S| <= d * |N(S)|`. Dividing by `d >= 1` yields `|N(S)| >= |S|` for every S."
    },
    {
      id: "q14-hk-3",
      type: "mcq",
      difficulty: "apply",
      section: "Constructive König Cover",
      title: "Constructing the Minimum Vertex Cover from Alternating Reachability",
      prompt: "After computing a maximum matching $M^*$ in $G = (L \\cup R, E)$, let $Z$ be the set of vertices reachable from **unmatched vertices in $L$** via alternating paths ($L \\to R$ via unmatched edges, $R \\to L$ via matched edges). Which set forms the Minimum Vertex Cover?",
      options: [
        "(L \\ Z) union (R intersect Z)",
        "(L intersect Z) union (R \\ Z)",
        "All matched vertices in L",
        "Z itself"
      ],
      answer: 0,
      explanation: "No edge can go from `L intersect Z` to `R \\ Z` (an unmatched edge would bring the R-endpoint into Z; a matched edge would have brought the L-endpoint into Z from R). Thus `(L \\ Z) U (R n Z)` covers all edges and has size exactly `|M*|`."
    },
    {
      id: "q14-hk-4",
      type: "mcq",
      difficulty: "staff",
      section: "DAG Minimum Path Cover",
      title: "Minimum Vertex-Disjoint Path Cover in a DAG",
      prompt: "Given a Directed Acyclic Graph (DAG) with $V$ vertices, how do you find the minimum number of vertex-disjoint directed paths needed to cover all $V$ vertices?",
      options: [
        "Build a bipartite graph (L_out, R_in) with an edge u_out -> v_in for each DAG edge (u, v); each matched edge merges two paths, so the Minimum Path Cover size is V - |MaxMatching|",
        "Run topological sort and count vertices with in-degree 0",
        "Find the longest path and subtract its length from V",
        "The problem is NP-hard even on DAGs"
      ],
      answer: 0,
      explanation: "Initially, V paths of length 0 cover each vertex individually. Every matched edge `(u_out, v_in)` joins the end of one path to the start of another (valid because each node has <= 1 successor and <= 1 predecessor, and acyclicity prevents cycles), reducing the path count by 1."
    }
  ],

  "weighted-matching-hungarian": [
    {
      id: "q14-hung-1",
      type: "mcq",
      difficulty: "recall",
      section: "Dual Potentials",
      title: "Tight (Equality) Subgraph Condition in the Hungarian Algorithm",
      prompt: "In the Hungarian algorithm for minimizing $\\sum C[i][\\pi(i)]$, what defines a **tight edge** $(i, j)$ under dual vertex potentials $u[i]$ and $v[j]$?",
      options: [
        "u[i] + v[j] == C[i][j] (zero slack), while all other edges satisfy u[i] + v[j] <= C[i][j]",
        "u[i] - v[j] == C[i][j]",
        "C[i][j] == 0 in the original input matrix",
        "u[i] == v[j]"
      ],
      answer: 0,
      explanation: "Dual feasibility requires `u[i] + v[j] <= C[i][j]` everywhere. An edge where equality holds (`slack(i,j) = C[i][j] - u[i] - v[j] = 0`) is tight and eligible to enter the matching."
    },
    {
      id: "q14-hung-2",
      type: "mcq",
      difficulty: "apply",
      section: "O(N^3) Optimization",
      title: "Why `minv[j]` Reduces Hungarian Runtime from O(N^4) to O(N^3)",
      prompt: "When growing the alternating tree for worker $i$, at most $N$ dual potential adjustments occur before an augmenting path is found. How does maintaining `minv[j]` (the minimum slack to column $j \\notin T_R$ from any row $i' \\in T_L$) save a factor of $N$?",
      options: [
        "When a new row i0 enters T_L, updating minv[j] = min(minv[j], slack(i0, j)) and finding the minimum delta across j not in T_R takes O(N) time instead of scanning all O(N^2) pairs (i', j)",
        "It uses a Fibonacci heap to store matrix rows",
        "It skips half the workers",
        "It sorts the cost matrix in O(N log N) time"
      ],
      answer: 0,
      explanation: "With `minv[j]`, each of the <= N tree extensions per worker performs two O(N) loops over columns j = 1..M, totaling O(N^2) time per worker and O(N^3) overall."
    },
    {
      id: "q14-hung-3",
      type: "mcq",
      difficulty: "apply",
      section: "Max-Weight & Negative Costs",
      title: "Solving Maximum-Weight Bipartite Matching with Hungarian",
      prompt: "You want to solve **Maximum-Weight Perfect Matching** on a profit matrix $P[i][j]$ (where some profits may be negative). How should you transform $P$ before calling the min-weight Hungarian algorithm?",
      options: [
        "Simply negate every entry (`C[i][j] = -P[i][j]`); no positive offset is required because Hungarian potentials handle negative costs natively",
        "Add +10^9 to every entry and run Hopcroft-Karp",
        "Take the reciprocal 1 / P[i][j]",
        "Hungarian cannot solve maximization problems"
      ],
      answer: 0,
      explanation: "Unlike Dijkstra, the Hungarian algorithm's dual constraints `u[i] + v[j] <= C[i][j]` work for arbitrary positive, zero, or negative real/integer costs without any offset."
    },
    {
      id: "q14-hung-4",
      type: "mcq",
      difficulty: "staff",
      section: "Potential Shift Invariant",
      title: "Effect of Dual Potential Adjustment (+Delta on T_L, -Delta on T_R)",
      prompt: "During a relabel step in the Hungarian algorithm, we add $+\\Delta$ to $u[i']$ for all $i' \\in T_L$ and subtract $-\\Delta$ from $v[j']$ for all $j' \\in T_R$. What is the effect on (1) existing tight edges inside the alternating tree $T$ ($i' \\in T_L, j' \\in T_R$), and (2) frontier edges ($i' \\in T_L, j' \\notin T_R$)?",
      options: [
        "(1) Tree edges have u[i'] + v[j'] unchanged (+Delta - Delta = 0) so they remain tight; (2) Frontier edges have slack reduced by Delta, making at least one new column j1 tight!",
        "All edges in the matrix have their slack reduced by Delta",
        "Tree edges become loose and are removed from the matching",
        "Only matched edges change slack"
      ],
      answer: 0,
      explanation: "For `(i', j') in T_L x T_R`, `(u[i'] + Delta) + (v[j'] - Delta) = u[i'] + v[j']`, preserving every existing tree edge, while for `(i', j') in T_L x (R \\ T_R)`, slack decreases by `Delta`, bringing `j1` into `T_R`."
    }
  ],

  "min-cost-max-flow-mcmf": [
    {
      id: "q14-mcmf-1",
      type: "mcq",
      difficulty: "recall",
      section: "Reverse Edge Cost",
      title: "Cost of Reverse Residual Edges in MCMF",
      prompt: "In Minimum-Cost Maximum Flow, if a forward directed edge $e = (u, v)$ has capacity $c$ and unit cost $+w$, what are the initial capacity and unit cost of its reverse residual edge $e^R = (v, u)$?",
      options: [
        "Initial capacity 0 and unit cost -w",
        "Initial capacity 0 and unit cost +w",
        "Initial capacity c and unit cost -w",
        "Initial capacity 0 and unit cost 0"
      ],
      answer: 0,
      explanation: "Canceling 1 unit of flow previously pushed along (u, v) refunds the cost +w that was paid, so traversing (v, u) changes total cost by -w."
    },
    {
      id: "q14-mcmf-2",
      type: "mcq",
      difficulty: "apply",
      section: "Johnson Potentials in MCMF",
      title: "Why Newly Activated Reverse Edges Have Non-Negative Reduced Cost",
      prompt: "Suppose we augment flow along a shortest path $P$ found by Dijkstra under reduced costs $w_\\pi(u, v) = w(u, v) + \\pi[u] - \\pi[v] \\ge 0$, and then update $\\pi'[x] = \\pi[x] + d[x]$ for all reachable $x$. What is the new reduced cost $w_{\\pi'}(v, u)$ of a newly created reverse edge $(v, u)$ along $P$?",
      options: [
        "Exactly 0, because (u, v) lay on the shortest path so d[v] = d[u] + w(u, v) + pi[u] - pi[v]",
        "Strictly negative (-w(u, v))",
        "Strictly positive (+2 * w(u, v))",
        "Infinity"
      ],
      answer: 0,
      explanation: "Along the shortest path P, `d[v] - d[u] = w(u, v) + pi[u] - pi[v]`, which rearranges to `pi'[v] - pi'[u] = w(u, v)`, or `w_{pi'}(v, u) = -w(u, v) + pi'[v] - pi'[u] = 0`!"
    },
    {
      id: "q14-mcmf-3",
      type: "mcq",
      difficulty: "apply",
      section: "Min-Cost vs Max-Flow",
      title: "Stopping Early for Minimum-Cost Flow (Without Requiring Max Flow)",
      prompt: "Suppose you want to find a flow from $s$ to $t$ of **any value** that minimizes total cost (equivalently, maximizes profit when edge costs are negative after Bellman-Ford initialization). When should the Successive Shortest Path loop stop?",
      options: [
        "Stop as soon as the true path cost per unit of flow `pi[t] - pi[s] >= 0` (i.e., when augmenting further would no longer decrease total cost)",
        "Always run until no s ~> t augmenting path exists",
        "Stop after exactly 1 augmentation",
        "Stop when the priority queue has size V"
      ],
      answer: 0,
      explanation: "Because SSP augments paths in non-decreasing order of true unit cost `pi[t] - pi[s]` (convexity of min-cost flow value curve), stopping as soon as `pi[t] - pi[s] >= 0` finds the global minimum-cost flow across all flow values."
    },
    {
      id: "q14-mcmf-4",
      type: "mcq",
      difficulty: "staff",
      section: "Convexity of Slope",
      title: "Convexity of Minimum Cost as a Function of Flow Value",
      prompt: "Let $C(F)$ denote the minimum cost to send $F$ units of flow from $s$ to $t$. What mathematical property does the function $F \\mapsto C(F)$ satisfy?",
      options: [
        "C(F) is convex (piecewise-linear with non-decreasing slopes), because each successive shortest augmenting path has unit cost >= the previous path's unit cost",
        "C(F) is concave (marginal cost decreases with F)",
        "C(F) is strictly linear",
        "C(F) oscillates unpredictably"
      ],
      answer: 0,
      explanation: "Since `d[t] >= 0` in every Dijkstra step, `pi[t]` never decreases across iterations, proving that marginal cost per additional unit of flow is monotonically non-decreasing (convex)."
    }
  ],

  "flow-reductions-project-selection": [
    {
      id: "q14-red-1",
      type: "mcq",
      difficulty: "recall",
      section: "Project Selection Reduction",
      title: "Direction of Infinite-Capacity Dependency Edges in Max-Weight Closure",
      prompt: "In the Maximum-Weight Closure (Project Selection) reduction to $s$-$t$ Min-Cut, where $u \\in S$ means project $u$ is selected and $u \\in T$ means project $u$ is not selected: if selecting project $u$ **requires** also selecting prerequisite $v$, how must the $\\infty$-capacity edge be directed?",
      options: [
        "Add a directed edge u -> v with capacity infinity, so that u in S and v in T would incur infinite cut cost",
        "Add a directed edge v -> u with capacity infinity",
        "Add an edge s -> v with capacity infinity",
        "Add an edge u -> t with capacity infinity"
      ],
      answer: 0,
      explanation: "An s-t cut charges capacity c(x, y) iff x in S and y in T. To forbid (u in S AND v in T), we place a directed edge u -> v of capacity infinity."
    },
    {
      id: "q14-red-2",
      type: "numeric",
      difficulty: "apply",
      section: "Project Selection Calculation",
      title: "Computing Maximum Net Profit from Min-Cut",
      prompt: "You have two profitable projects $P_1 (+50), P_2 (+40)$ and two machines $M_1 (-30), M_2 (-35)$. If the minimum $s$-$t$ cut in the closure network has capacity $\\text{MinCut}(s, t) = 35$, what is the maximum achievable net profit?",
      answer: 55,
      tolerance: 0,
      unit: "profit",
      hint: "Compute (50 + 40) - 35.",
      explanation: "Total positive profit W+ = 50 + 40 = 90. Subtracting MinCut(s, t) = 35 gives MaxNetProfit = 90 - 35 = 55."
    },
    {
      id: "q14-red-3",
      type: "mcq",
      difficulty: "apply",
      section: "Vertex Capacities",
      title: "Node Splitting for Vertex-Disjoint Paths (Menger's Vertex Theorem)",
      prompt: "How do you model a vertex capacity constraint where internal vertex $u$ can be traversed by at most $1$ path (or pass at most $C_u$ units of flow)?",
      options: [
        "Split u into two vertices u_in and u_out connected by a directed edge u_in -> u_out of capacity C_u; route all incoming edges to u_in and all outgoing edges from u_out",
        "Set all outgoing edges of u to capacity C_u",
        "Set all incoming edges of u to capacity C_u / deg(u)",
        "Delete u from the graph"
      ],
      answer: 0,
      explanation: "Splitting `u` into `u_in -> u_out` funnels all flow passing through `u` across a single internal directed edge of capacity `C_u`."
    },
    {
      id: "q14-red-4",
      type: "mcq",
      difficulty: "staff",
      section: "Circulation with Lower Bounds",
      title: "Feasibility Check for Flow with Edge Lower Bounds",
      prompt: "To test if a network admits a feasible circulation satisfying $L(e) \\le f(e) \\le U(e)$, we set edge capacities to $U(e) - L(e)$, compute vertex excess $b(v) = \\sum_{\\text{in}} L(e) - \\sum_{\\text{out}} L(e)$, connect $S^* \\to v$ (cap $b(v)$ if $b(v) > 0$) and $v \\to T^*$ (cap $-b(v)$ if $b(v) < 0$). When does a feasible circulation exist?",
      options: [
        "If and only if MaxFlow(S*, T*) equals the sum of all positive balances sum_{b(v) > 0} b(v) (saturating every edge leaving S*)",
        "Whenever MaxFlow(S*, T*) > 0",
        "Whenever sum_{e} L(e) <= sum_{e} U(e)",
        "If and only if MinCut(S*, T*) == 0"
      ],
      answer: 0,
      explanation: "Every pre-committed lower bound L(e) creates a conservation deficit at its tail and surplus at its head; a compensating flow f' in [0, U-L] exists iff S* can route 100% of surpluses to T*."
    }
  ],

  "build-dinic-max-flow-engine": [
    {
      id: "q14-build-1",
      type: "mcq",
      difficulty: "recall",
      section: "Flow Inspection",
      title: "Reading Final Edge Flow from Reverse Arc Capacity",
      prompt: "In our `DinicEngine` where forward arc `edgeId = 2k` is initialized with capacity $C$ and reverse arc `edgeId ^ 1 = 2k + 1` is initialized with capacity $0$, why does `arcs[edgeId ^ 1].cap` equal the exact flow pushed along `edgeId`?",
      options: [
        "Because every forward push of +d subtracts d from arcs[edgeId].cap and adds +d to arcs[edgeId ^ 1].cap, and every backward cancellation subtracts d from arcs[edgeId ^ 1].cap",
        "Because reverse arcs never change capacity",
        "Because `arcs[edgeId ^ 1].cap` stores the original capacity C",
        "Only when C == 1"
      ],
      answer: 0,
      explanation: "The invariant `arcs[2k].cap + arcs[2k+1].cap == C` holds at all times, with `arcs[2k+1].cap == f(e)` and `arcs[2k].cap == C - f(e)`."
    },
    {
      id: "q14-build-2",
      type: "mcq",
      difficulty: "apply",
      section: "Zero-Extra-BFS Min-Cut",
      title: "Why `level[u] != -1` After `maxFlow(s, t)` Gives the Min-Cut Partition",
      prompt: "Why doesn't `DinicEngine::inSourceSide(u)` need to run an extra BFS after `maxFlow(s, t)` finishes?",
      options: [
        "Because the `while (bfs(s, t))` loop terminates specifically on the final BFS pass where `t` was unreachable, leaving `level[u] != -1` for every vertex `u` reachable from `s` in the final residual graph G_f",
        "Because `level[u]` never changes after the first BFS",
        "Because `s` is the only vertex in the source partition",
        "Because `ptr[u]` stores the min-cut"
      ],
      answer: 0,
      explanation: "The terminating BFS visits the exact set S of vertices reachable from s via positive-residual edges (`arcs[id].cap > 0`) and marks them with `level[u] >= 0`."
    },
    {
      id: "q14-build-3",
      type: "mcq",
      difficulty: "apply",
      section: "Even Index Filtering",
      title: "Why `extractMinCutEdges()` Steps by `id += 2`",
      prompt: "In `extractMinCutEdges()`, why does the loop iterate `for (size_t id = 0; id < arcs.size(); id += 2)` over even indices only?",
      options: [
        "Even indices `0, 2, 4, ...` correspond to the original directed edges added via `addEdge(u, v, cap)`, whereas odd indices `1, 3, 5, ...` are synthetic reverse residual arcs",
        "To run twice as fast by sampling half the edges",
        "Because odd indices always have `level[to] != -1`",
        "Because Dinic only uses even-numbered vertices"
      ],
      answer: 0,
      explanation: "Only original edges directed from S (`level[from] != -1`) to T (`level[to] == -1`) belong to the s-t cut; odd indices are reverse residual arcs."
    },
    {
      id: "q14-build-4",
      type: "mcq",
      difficulty: "staff",
      section: "Incremental / Dynamic Flow",
      title: "Warm-Starting Dinic After Increasing an Edge Capacity",
      prompt: "Suppose you have already run `dinic.maxFlow(s, t)` and now increase the capacity of an edge $(u, v)$ by $+\\Delta$ (by calling `addEdge(u, v, Delta)`). How can you compute the new maximum flow without resetting existing flows?",
      options: [
        "Simply call `dinic.maxFlow(s, t)` again on the existing residual state; the current flow remains valid and Dinic will only push the incremental augmenting flow!",
        "You must zero out all flows and re-run from scratch",
        "Subtract Delta from the old maxFlow",
        "Run Bellman-Ford"
      ],
      answer: 0,
      explanation: "Increasing capacity on an edge (or adding a new edge) preserves all three flow axioms on the existing flow f. Calling `maxFlow(s, t)` warm-starts from the current residual network G_f! (For small +1 increases, this takes O(E) time)."
    }
  ]
});
