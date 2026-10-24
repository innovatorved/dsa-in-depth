window.QUESTION_BANK = window.QUESTION_BANK || {};
Object.assign(window.QUESTION_BANK, {
  "graph-representations-csr-cache": [
    {
      id: "q12-csr-1",
      type: "mcq",
      difficulty: "recall",
      section: "CSR Memory Layout",
      title: "CSR Out-Degree Computation",
      prompt: "In a Compressed Sparse Row (CSR) representation of a directed graph with $V$ vertices and $E$ edges using arrays `head[0..V]` and `to[0..E-1]`, how is the out-degree of vertex $u$ ($0 \\le u < V$) computed in $O(1)$ time?",
      options: [
        "head[u + 1] - head[u]",
        "to[head[u + 1]] - to[head[u]]",
        "head[u] - head[u - 1]",
        "E / V + head[u]"
      ],
      answer: 0,
      explanation: "Because `head` stores the exclusive prefix sum of vertex degrees, the outgoing neighbors of vertex `u` occupy the contiguous slice `to[head[u] .. head[u+1]-1]`, whose exact length is `head[u + 1] - head[u]`."
    },
    {
      id: "q12-csr-2",
      type: "numeric",
      difficulty: "apply",
      section: "Bitset Adjacency Matrix",
      title: "64-Bit Word-Packed Bitset Row Size",
      prompt: "You represent a dense graph with $V = 2000$ vertices using a 64-bit word-packed bitset adjacency matrix (`uint64_t`). How many `uint64_t` words are required to store a single vertex's adjacency row? (Use $\\lceil 2000 / 64 \\rceil$).",
      answer: 32,
      tolerance: 0,
      unit: "words",
      hint: "Compute ceil(2000 / 64) = (2000 + 63) / 64 in integer arithmetic.",
      explanation: "2000 / 64 = 31.25, so ceiling division requires 32 uint64_t words (256 bytes, or exactly four 64-byte cache lines) per vertex row."
    },
    {
      id: "q12-csr-3",
      type: "mcq",
      difficulty: "apply",
      section: "CSR Construction",
      title: "Undirected CSR Array Sizing",
      prompt: "When encoding an undirected simple graph with $V$ vertices and $E$ undirected edges in a CSR structure, what must be the lengths of the `head` and `to` arrays?",
      options: [
        "head has length V + 1, and to has length 2E",
        "head has length V, and to has length E",
        "head has length 2V + 1, and to has length 2E",
        "head has length V + 1, and to has length E"
      ],
      answer: 0,
      explanation: "Each undirected edge {u, v} is stored as two directed arcs (u -> v and v -> u), requiring 2E entries in `to`, while `head` always requires V + 1 offsets so `head[V] = 2E` bounds the final vertex."
    },
    {
      id: "q12-csr-4",
      type: "mcq",
      difficulty: "staff",
      section: "Hardware Cache Mechanics",
      title: "Why CSR Outperforms Vector-of-Vectors",
      prompt: "In a BFS benchmark on a sparse graph with $V = 2 \\times 10^6$ and $E = 8 \\times 10^6$, CSR runs $6.8\\times$ faster than `std::vector<std::vector<int>>`. Which hardware mechanism explains the largest share of this speedup?",
      options: [
        "CSR stores all target IDs in a single contiguous buffer, eliminating per-vertex heap pointer indirection, L1 dTLB page misses, and allocator metadata bloat",
        "CSR reduces the asymptotic time complexity of BFS from O(V log V + E) to O(V + E)",
        "CSR automatically sorts edges by weight using SIMD instructions",
        "std::vector<std::vector<int>> copies the entire adjacency list onto the stack on every function call"
      ],
      answer: 0,
      explanation: "Both layouts are asymptotically O(V + E), but vector-of-vectors performs two pointer dereferences across fragmented heap allocations per vertex, causing L3 cache and TLB misses, whereas CSR streams contiguous 32-bit ints through the L1D hardware prefetcher."
    }
  ],

  "bfs-01-bfs-multi-source": [
    {
      id: "q12-bfs-1",
      type: "mcq",
      difficulty: "recall",
      section: "0-1 BFS Mechanics",
      title: "Deque Insertion Rule in 0-1 BFS",
      prompt: "In 0-1 BFS, when relaxing an edge $(u, v)$ of weight $w \\in \\{0, 1\\}$ that strictly improves `dist[v]`, where must vertex $v$ be inserted into the deque `dq`?",
      options: [
        "Push to the front (`dq.push_front(v)`) if w == 0, and push to the back (`dq.push_back(v)`) if w == 1",
        "Push to the back (`dq.push_back(v)`) if w == 0, and push to the front (`dq.push_front(v)`) if w == 1",
        "Always push to the back, then sort the deque",
        "Push to the front only if v has never been visited before"
      ],
      answer: 0,
      explanation: "To maintain the invariant that the deque is sorted by distance and contains at most two distinct values {d, d+1}, a weight-0 transition yields distance d (placed at the front) and a weight-1 transition yields distance d+1 (placed at the back)."
    },
    {
      id: "q12-bfs-2",
      type: "mcq",
      difficulty: "apply",
      section: "Multi-Source BFS",
      title: "Multi-Source Grid Distance Complexity",
      prompt: "Given an $R \\times C$ grid containing $K$ fire stations ($1 \\le K \\le R \\cdot C$), what is the optimal time complexity to compute the shortest Manhattan distance from every grid cell to its nearest fire station?",
      options: [
        "O(R · C) by seeding all K fire stations into the BFS queue at distance 0 simultaneously",
        "O(K · R · C) by running a separate BFS from each fire station",
        "O(R · C log K) by running Voronoi binary search",
        "O(K^2 + R · C) using Floyd-Warshall"
      ],
      answer: 0,
      explanation: "Seeding all K sources at distance 0 into the FIFO queue is equivalent to adding a virtual super-source connected to each station with weight-0 edges, visiting every grid cell and edge once in O(R * C) time."
    },
    {
      id: "q12-bfs-3",
      type: "numeric",
      difficulty: "apply",
      section: "0-1 BFS Invariants",
      title: "Maximum Deque Pushes per Vertex in 0-1 BFS",
      prompt: "In a correct 0-1 BFS implementation where vertices are pushed only when `dist[u] + w < dist[v]`, at most how many times can any single vertex $v$ be pushed into the deque over the entire execution?",
      answer: 2,
      tolerance: 0,
      unit: "pushes",
      hint: "Consider the Two-Valued Queue Invariant: what are the only possible distance values v can take after first being reached?",
      explanation: "When v is first reached from some u at distance d, dist[v] becomes either d+1 (via weight 1) or d (via weight 0). Since all subsequent pops have distance >= d, dist[v] can only be improved once more (from d+1 down to d), so v is pushed at most 2 times."
    },
    {
      id: "q12-bfs-4",
      type: "mcq",
      difficulty: "staff",
      section: "Failure Modes",
      title: "Why Push-Time Visited Marking Fails in 0-1 BFS",
      prompt: "Why does marking `visited[v] = true` at the moment $v$ is *pushed* into the deque (as is standard in unweighted BFS) produce wrong shortest paths in 0-1 BFS?",
      options: [
        "Because v may first be pushed to the back via a weight-1 edge at distance d + 1, before another vertex u at distance d relaxes v via a weight-0 edge to distance d",
        "Because weight-0 edges create negative cycles",
        "Because std::deque invalidates boolean references on push_front",
        "Because 0-1 BFS visits vertices in decreasing order of distance"
      ],
      answer: 0,
      explanation: "If v is locked upon its first push at distance d + 1, a subsequent path of cost d + 0 = d from another vertex at layer d would be ignored. Vertices in 0-1 BFS must be marked settled upon *pop*, not push."
    }
  ],

  "dfs-edge-classification-timestamps": [
    {
      id: "q12-dfs-1",
      type: "mcq",
      difficulty: "recall",
      section: "Parenthesis Theorem",
      title: "O(1) Ancestor Test Using DFS Timestamps",
      prompt: "Given entry timestamps `tin[0..V-1]` and exit timestamps `tout[0..V-1]` from a DFS of a rooted tree, which boolean condition holds if and only if $u$ is an ancestor of $v$ (including $u = v$)?",
      options: [
        "tin[u] <= tin[v] && tout[v] <= tout[u]",
        "tin[u] <= tin[v] && tout[u] <= tout[v]",
        "tin[v] <= tin[u] && tout[u] <= tout[v]",
        "tout[u] < tin[v]"
      ],
      answer: 0,
      explanation: "By the Parenthesis Theorem, v is in the subtree of u iff v is discovered after u is discovered (`tin[u] <= tin[v]`) and finishes before u finishes (`tout[v] <= tout[u]`)."
    },
    {
      id: "q12-dfs-2",
      type: "mcq",
      difficulty: "recall",
      section: "Edge Classification",
      title: "Impossible Edge Types in Undirected Simple Graphs",
      prompt: "In a Depth-First Search of an undirected simple graph $G$, which edge classifications can NEVER occur?",
      options: [
        "Forward edges and Cross edges",
        "Tree edges and Back edges",
        "Back edges only",
        "Tree edges only"
      ],
      answer: 0,
      explanation: "In an undirected graph, when edge {u, v} is first explored from whichever endpoint is discovered first, the other endpoint cannot already be BLACK (finished), so every edge is either a Tree edge (to WHITE) or a Back edge (to GRAY ancestor)."
    },
    {
      id: "q12-dfs-3",
      type: "mcq",
      difficulty: "apply",
      section: "Directed Edge Classification",
      title: "Identifying Cross vs Forward Edges by Timestamps",
      prompt: "During a directed DFS, vertex $u$ inspects an edge $(u, v)$ and finds that $v$ is already colored BLACK (finished). How do you distinguish whether $(u, v)$ is a Forward edge or a Cross edge?",
      options: [
        "If tin[u] < tin[v], it is a Forward edge; if tin[v] < tin[u], it is a Cross edge",
        "If tin[u] > tin[v], it is a Forward edge; if tin[u] < tin[v], it is a Cross edge",
        "It is always a Cross edge because v is BLACK",
        "If tout[v] > tin[u], it is a Cross edge"
      ],
      answer: 0,
      explanation: "If v is BLACK and tin[u] < tin[v], v was discovered and finished while u was active on the stack, so v is a proper descendant of u (Forward edge). If tin[v] < tin[u], v finished before u was even discovered (Cross edge)."
    },
    {
      id: "q12-dfs-4",
      type: "mcq",
      difficulty: "staff",
      section: "White-Path Theorem",
      title: "Why 2-Color Visited Fails Directed Cycle Detection",
      prompt: "A developer attempts to detect cycles in a directed graph by running DFS with a single boolean array `visited[u]` and reporting a cycle whenever an edge $(u, v)$ hits `visited[v] == true`. On which graph topology does this produce a false positive?",
      options: [
        "A diamond DAG (0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3) where edge (2, 3) is a Cross/Forward edge to an already-finished BLACK vertex",
        "A directed cycle of length 3 (0 -> 1 -> 2 -> 0)",
        "A disconnected forest of isolated vertices",
        "A directed tree rooted at 0 where all edges point toward the root"
      ],
      answer: 0,
      explanation: "In the diamond DAG, DFS from 0 visits 1 -> 3, finishes 3 (BLACK), returns to 0, and visits 2 -> 3. A 2-color boolean check sees `visited[3] == true` and falsely claims a cycle on a Cross edge. Directed cycle detection requires checking that `v` is GRAY (currently on the recursion stack)."
    }
  ],

  "topological-sort-kahn-dfs": [
    {
      id: "q12-topo-1",
      type: "mcq",
      difficulty: "recall",
      section: "DFS Post-Order Invariant",
      title: "Finish-Time Inequality on DAG Edges",
      prompt: "In any Depth-First Search of a Directed Acyclic Graph (DAG), what relationship holds between the finish timestamps `tout[u]` and `tout[v]` for every directed edge $(u, v) \\in E$?",
      options: [
        "tout[u] > tout[v]",
        "tout[u] < tout[v]",
        "tin[u] < tin[v]",
        "tout[u] == tout[v]"
      ],
      answer: 0,
      explanation: "Because a DAG has no back edges, when u explores (u, v), v is either WHITE (so DFS finishes v before returning to finish u) or already BLACK (already finished). In both cases, tout[v] < tout[u]."
    },
    {
      id: "q12-topo-2",
      type: "mcq",
      difficulty: "apply",
      section: "Lexicographical Topological Sort",
      title: "Computing the Lexicographically Smallest Topological Order",
      prompt: "You need to output the lexicographically smallest valid topological ordering of a DAG with $V$ vertices and $E$ edges. Which algorithm guarantees the correct result?",
      options: [
        "Kahn's indegree algorithm using a min-heap (`std::priority_queue` ordered by smallest vertex ID) in O((V + E) log V)",
        "Standard DFS post-order reversal after sorting each vertex's adjacency list in descending order",
        "Standard DFS post-order reversal after sorting each vertex's adjacency list in ascending order",
        "Kahn's algorithm with a LIFO stack"
      ],
      answer: 0,
      explanation: "At each position of the permutation, we must greedily pick the smallest vertex ID whose prerequisites are all satisfied (indegree == 0). A min-heap over zero-indegree vertices in Kahn's algorithm achieves this exact greedy choice; DFS post-order reversal does not."
    },
    {
      id: "q12-topo-3",
      type: "numeric",
      difficulty: "apply",
      section: "Kahn Cycle Detection",
      title: "Remaining Vertices After Kahn Termination",
      prompt: "Consider a directed graph with $V = 7$ vertices and edges $0 \\to 1$, $1 \\to 2$, $2 \\to 3$, $3 \\to 1$, $3 \\to 4$, $4 \\to 5$, and $0 \\to 6$. How many vertices are emitted into the topological order vector before Kahn's algorithm terminates?",
      answer: 2,
      tolerance: 0,
      unit: "vertices",
      hint: "Trace which vertices start with or reach indegree 0: check 0 and 6, then check if 1's indegree ever reaches 0.",
      explanation: "Initially only vertex 0 has indegree 0. Popping 0 decrements indegree[6] from 1 to 0 (so 6 is emitted) and decrements indegree[1] from 2 (edges 0->1 and 3->1) to 1. Because 1->2->3->1 is a cycle, 1, 2, 3, and downstream victims 4, 5 never reach indegree 0. Exactly 2 vertices (0 and 6) are emitted."
    },
    {
      id: "q12-topo-4",
      type: "mcq",
      difficulty: "staff",
      section: "DAG Structure",
      title: "Hamiltonian Path Uniqueness in a DAG",
      prompt: "How can you determine in $O(V + E)$ time whether a DAG has a *unique* topological ordering (which is equivalent to containing a directed Hamiltonian path)?",
      options: [
        "Run Kahn's algorithm and verify that the queue contains at most 1 vertex at the start of every iteration (or check that every consecutive pair (order[i], order[i+1]) has a directed edge in E)",
        "Check whether the graph is connected and E == V - 1",
        "Verify that exactly one vertex has indegree 0 and exactly one vertex has outdegree 0",
        "Run DFS from vertex 0 and check if tout[0] == 2V"
      ],
      answer: 0,
      explanation: "A topological sort is unique iff at every step of Kahn's peeling there is only a single zero-indegree choice (equivalently, the topological order v_1, v_2, ..., v_n contains the directed edge (v_i, v_{i+1}) for all 1 <= i < n)."
    }
  ],

  "bipartite-graphs-2-coloring": [
    {
      id: "q12-bip-1",
      type: "mcq",
      difficulty: "recall",
      section: "König's Theorem",
      title: "Structural Characterization of Bipartite Graphs",
      prompt: "Which statement is a necessary and sufficient condition for an undirected graph $G$ to be bipartite?",
      options: [
        "G contains no cycle of odd length",
        "G contains no cycle of even length",
        "Every vertex in G has even degree",
        "G is a tree"
      ],
      answer: 0,
      explanation: "By König's 1916 theorem, a graph is 2-colorable (bipartite) if and only if it contains no odd-length cycle."
    },
    {
      id: "q12-bip-2",
      type: "mcq",
      difficulty: "apply",
      section: "BFS Level Parity",
      title: "Same-Level Edges in a BFS Tree",
      prompt: "Suppose you run BFS from a root $r$ in a connected undirected graph $G$, partitioning vertices by their shortest-path distance $d(r, u)$. If there exists an edge $\{u, v\} \\in E$ such that $d(r, u) == d(r, v)$, what can you immediately conclude?",
      options: [
        "G is not bipartite, because the tree paths from LCA(u, v) to u and v have equal length k, forming an odd cycle of length 2k + 1",
        "G is bipartite, and {u, v} is a cross edge between partitions",
        "{u, v} must be a bridge in G",
        "BFS computed incorrect distances"
      ],
      answer: 0,
      explanation: "In a BFS tree of an undirected graph, every edge connects vertices whose distances from r differ by at most 1. If d(r, u) == d(r, v), both u and v would receive the same parity color d mod 2, creating an odd cycle of length 2(d(r,u) - d(r,LCA(u,v))) + 1."
    },
    {
      id: "q12-bip-3",
      type: "numeric",
      difficulty: "apply",
      section: "Component Counting",
      title: "Number of Valid 2-Colorings of a Disconnected Bipartite Graph",
      prompt: "An undirected bipartite graph $G$ has $V = 12$ vertices partitioned across $C = 4$ connected components. How many distinct valid 2-colorings (assigning each vertex color Red or Blue) does $G$ have?",
      answer: 16,
      tolerance: 0,
      unit: "colorings",
      hint: "In each connected component, choosing the color of one root vertex uniquely forces the colors of all other vertices in that component.",
      explanation: "Each of the C = 4 connected components can be independently colored in exactly 2 ways (swapping Red and Blue), yielding 2^C = 2^4 = 16 valid 2-colorings."
    },
    {
      id: "q12-bip-4",
      type: "mcq",
      difficulty: "staff",
      section: "Graph Modeling",
      title: "Partitioning Into Two Cliques via Complement Graph",
      prompt: "You are given an undirected graph $G = (V, E)$ ($|V| \\le 2000$) and asked whether $V$ can be partitioned into two disjoint **cliques** (complete subgraphs). How can this be solved in $O(V^2)$ time?",
      options: [
        "Construct the complement graph G' = (V, E') where {u, v} is in E' iff {u, v} is NOT in E, and test whether G' is bipartite (2-colorable)",
        "Run Tarjan's bridge-finding algorithm on G and check if there is exactly 1 bridge",
        "Run 2-coloring directly on G",
        "It cannot be solved in polynomial time because Clique is NP-Complete"
      ],
      answer: 0,
      explanation: "Two vertices u, v in the same partition must have an edge in G; equivalently, they must NOT have an edge in the complement graph G'. Thus partitioning V into two cliques in G is identical to partitioning V into two independent sets in G', which is 2-coloring (bipartiteness) on G'!"
    }
  ],

  "bridges-articulation-biconnected": [
    {
      id: "q12-bcc-1",
      type: "mcq",
      difficulty: "recall",
      section: "Cut Conditions",
      title: "Bridge vs Articulation Point Inequality",
      prompt: "In Tarjan's undirected DFS algorithm where $(u, v)$ is a DFS tree edge ($u$ is the parent of $v$), what are the exact inequalities for $(u, v)$ being a **bridge** vs. a non-root $u$ being an **articulation point**?",
      options: [
        "Bridge: low[v] > tin[u]; Articulation Point: low[v] >= tin[u]",
        "Bridge: low[v] >= tin[u]; Articulation Point: low[v] > tin[u]",
        "Bridge: low[v] < tin[u]; Articulation Point: low[v] == tin[u]",
        "Bridge: low[u] > tin[v]; Articulation Point: low[u] >= tin[v]"
      ],
      answer: 0,
      explanation: "If low[v] == tin[u], a back edge from v's subtree reaches u itself—this saves edge (u, v) from being a bridge, but deleting vertex u still disconnects v's subtree from the rest of the graph. Hence bridges require strict `low[v] > tin[u]`, while cut vertices require `low[v] >= tin[u]`."
    },
    {
      id: "q12-bcc-2",
      type: "mcq",
      difficulty: "recall",
      section: "Root Rule",
      title: "DFS Root Articulation Point Condition",
      prompt: "Why does the inequality `low[v] >= tin[root]` fail to correctly classify the root of a DFS tree as an articulation point, and what condition replaces it?",
      options: [
        "Because tin[root] == 1 is the minimum timestamp in the tree so low[v] >= tin[root] is trivially true for every child; instead, the root is an articulation point iff it has >= 2 DFS tree children",
        "Because the root can never be an articulation point in any graph",
        "Because the root has no back edges incident to it",
        "Because low[root] is always 0"
      ],
      answer: 0,
      explanation: "Since no vertex has tin < tin[root], low[v] >= tin[root] holds even when the root is a leaf of size-1 degree. In a DFS tree (where cross edges cannot exist), the root disconnects the graph iff it branches into 2 or more independent DFS subtrees."
    },
    {
      id: "q12-bcc-3",
      type: "mcq",
      difficulty: "apply",
      section: "Multigraph Edge Handling",
      title: "Parallel Edges in Tarjan's Bridge Algorithm",
      prompt: "In an undirected multigraph where two parallel edges $e_1, e_2$ connect vertices $u$ and $v$, why must the DFS function pass `parentEdgeId` instead of `parentVertex`?",
      options: [
        "If `v == parentVertex` is skipped, both e1 and e2 are ignored when scanning from v, causing the algorithm to miss the cycle of length 2 and falsely report {u, v} as a bridge",
        "Because multigraphs can contain forward edges",
        "Because `parentVertex` causes infinite recursion on parallel edges",
        "Because `tin[u]` overflows on parallel edges"
      ],
      answer: 0,
      explanation: "When DFS traverses e1 from u to v, only e1 is the tree edge used to enter v. The second parallel edge e2 is a back edge from v to u that sets low[v] = min(low[v], tin[u]), proving {u, v} is not a bridge. Filtering by `v == parentVertex` skips e2 as well."
    },
    {
      id: "q12-bcc-4",
      type: "mcq",
      difficulty: "staff",
      section: "Low-Link Definition",
      title: "Why Back Edges Must Use tin[v] Instead of low[v]",
      prompt: "When DFS at vertex $u$ encounters a back edge $(u, v)$ to an ancestor $v$, suppose you write `low[u] = min(low[u], low[v])` instead of `low[u] = min(low[u], tin[v])`. Which algorithm breaks on a figure-eight graph (two cycles sharing a single cut vertex $v$)?",
      options: [
        "Articulation point detection breaks: a back edge from the second cycle into cut-vertex v inherits v's low[v] < tin[v] from the first cycle, making low[child] < tin[v] and hiding that v is an articulation point",
        "Bridge detection breaks on trees",
        "Connected component counting breaks",
        "Both expressions are always mathematically identical on all graphs"
      ],
      answer: 0,
      explanation: "If vertex v is the articulation point joining an upper cycle and a lower cycle, low[v] reaches the root of the upper cycle (< tin[v]). If a back edge from the lower cycle into v copies low[v] instead of tin[v], it pretends to bypass v into the upper cycle without passing through v, failing to detect v as a cut vertex!"
    }
  ],

  "scc-tarjan-kosaraju-2sat": [
    {
      id: "q12-scc-1",
      type: "mcq",
      difficulty: "recall",
      section: "Tarjan's SCC Invariant",
      title: "The Role of the onStack Guard in Tarjan's SCC",
      prompt: "In Tarjan's strongly connected components algorithm, when vertex $u$ inspects an edge $(u, v)$ to an already-discovered vertex $v$ (`tin[v] != 0`), why do we update `low[u] = min(low[u], tin[v])` ONLY if `onStack[v] == true`?",
      options: [
        "If `onStack[v] == false`, v belongs to an already-completed SCC that cannot reach u; absorbing tin[v] would corrupt low[u] via a cross edge",
        "To prevent stack overflow on self-loops",
        "Because `onStack[v] == false` means v has not been discovered yet",
        "To ensure edges are processed in BFS order"
      ],
      answer: 0,
      explanation: "A cross edge (u, v) to a vertex v whose SCC has already been popped cannot form a cycle back to u (otherwise u would have been visited and included in v's SCC before v finished). Ignoring vertices with `onStack[v] == false` prevents cross edges from leaking smaller timestamps into u's SCC."
    },
    {
      id: "q12-scc-2",
      type: "mcq",
      difficulty: "apply",
      section: "Topological Order of SCC IDs",
      title: "Tarjan vs Kosaraju Component Numbering Order",
      prompt: "As Tarjan's algorithm pops Strongly Connected Components and assigns sequential component IDs `0, 1, ..., K-1`, how are those IDs ordered relative to the Condensation DAG?",
      options: [
        "Reverse topological order: sinks of the condensation DAG receive the smallest component IDs (popped first), and sources receive the largest IDs",
        "Forward topological order: sources receive ID 0 and sinks receive ID K-1",
        "Ordered by component vertex count",
        "Arbitrary order depending on hash seed"
      ],
      answer: 0,
      explanation: "Because Tarjan's algorithm pops an SCC in post-order when its root finishes exploring all outgoing edges, any downstream SCC reachable from u must finish and pop *before* u's SCC pops. Thus sinks get ID 0 and sources get ID K-1."
    },
    {
      id: "q12-scc-3",
      type: "mcq",
      difficulty: "apply",
      section: "2-SAT Reduction",
      title: "Implication Edges for a 2-SAT Clause",
      prompt: "In a 2-SAT solver, how is the boolean clause $(x_1 \\lor \\neg x_2)$ represented in the directed implication graph?",
      options: [
        "Two directed edges: (~x_1 -> ~x_2) and (x_2 -> x_1)",
        "Two directed edges: (x_1 -> ~x_2) and (~x_2 -> x_1)",
        "One undirected edge between x_1 and ~x_2",
        "Two directed edges: (~x_1 -> x_2) and (~x_2 -> x_1)"
      ],
      answer: 0,
      explanation: "A clause (A OR B) is logically equivalent to (~A => B) AND (~B => A). Substituting A = x_1 and B = ~x_2 gives (~x_1 => ~x_2) and (x_2 => x_1)."
    },
    {
      id: "q12-scc-4",
      type: "mcq",
      difficulty: "staff",
      section: "Condensation DAG Properties",
      title: "Minimum Edges to Make a Directed Graph Strongly Connected",
      prompt: "Given a directed graph $G$ whose condensation DAG $G^{\\text{SCC}}$ has $K > 1$ strongly connected components, $S$ source components (indegree 0), and $T$ sink components (outdegree 0), what is the minimum number of directed edges that must be added to $G$ to make the entire graph strongly connected?",
      options: [
        "max(S, T)",
        "S + T",
        "K - 1",
        "abs(S - T) + 1"
      ],
      answer: 0,
      explanation: "Every source SCC needs at least one incoming edge and every sink SCC needs at least one outgoing edge, requiring at least max(S, T) edges. By matching sinks to sources cyclically, max(S, T) edges are both necessary and sufficient (when K > 1)."
    }
  ],

  "eulerian-paths-hierholzer": [
    {
      id: "q12-eul-1",
      type: "mcq",
      difficulty: "recall",
      section: "Degree Parity Conditions",
      title: "Directed Eulerian Trail Degree Condition",
      prompt: "Assume all edges of a directed graph $G$ belong to a single weakly connected component. Under what exact degree condition does $G$ possess a directed Eulerian trail (path) that is NOT a closed circuit?",
      options: [
        "Exactly one vertex has out-deg - in-deg == 1, exactly one vertex has in-deg - out-deg == 1, and all other vertices have in-deg == out-deg",
        "Exactly two vertices have odd total degree (in-deg + out-deg)",
        "Every vertex has in-deg == out-deg",
        "G is a Directed Acyclic Graph (DAG)"
      ],
      answer: 0,
      explanation: "An open directed Eulerian trail leaves the start vertex s one more time than it enters (out - in = 1), enters the end vertex t one more time than it leaves (in - out = 1), and enters/exits every intermediate vertex an equal number of times."
    },
    {
      id: "q12-eul-2",
      type: "mcq",
      difficulty: "apply",
      section: "Hierholzer's Algorithm",
      title: "Why Hierholzer Emits Vertices in Post-Order",
      prompt: "In Hierholzer's $O(E)$ algorithm, why is a vertex $u$ appended to the output trail only when all of its outgoing edges have been exhausted (post-order), rather than when $u$ is first visited (pre-order)?",
      options: [
        "Post-order emission automatically splices any unexplored side-cycles attached to u into the trail before recording the step that arrived at u",
        "Pre-order emission requires O(E log E) sorting",
        "Post-order emission guarantees the trail is lexicographically largest",
        "Because Eulerian graphs have no cycles"
      ],
      answer: 0,
      explanation: "When the greedy walk gets stuck at the end of the trail and unwinds the stack, any vertex u on the stack that still has unused incident edges explores its detour cycle first; emitting in post-order and reversing seamlessly splices all detour cycles in O(1) per edge."
    },
    {
      id: "q12-eul-3",
      type: "numeric",
      difficulty: "apply",
      section: "De Bruijn Sequences",
      title: "Edge Count in a Binary De Bruijn Graph",
      prompt: "To construct a shortest circular binary string (De Bruijn sequence) containing every binary substring of length $n = 5$ exactly once, we model length-$(n-1) = 4$ binary strings as vertices and length-$5$ binary strings as directed edges in an Eulerian circuit. How many directed edges does this graph have?",
      answer: 32,
      tolerance: 0,
      unit: "edges",
      hint: "Each distinct binary string of length n = 5 corresponds to exactly one directed edge.",
      explanation: "There are 2^{n-1} = 16 vertices (4-bit states), each with out-degree 2 and in-degree 2, giving 2^5 = 32 directed edges."
    },
    {
      id: "q12-eul-4",
      type: "mcq",
      difficulty: "staff",
      section: "Failure Modes",
      title: "Detecting Disconnected Cycles in Hierholzer's Algorithm",
      prompt: "An input graph has $V = 6$ vertices and $E = 6$ edges forming two disconnected triangles ($0-1-2-0$ and $3-4-5-3$). Every vertex has degree $2$ (even). How does a production Hierholzer implementation detect that no Eulerian circuit exists?",
      options: [
        "After Hierholzer's traversal from the first non-zero-degree vertex finishes, check whether `trail.size() == E + 1` (here 4 != 7, revealing unvisited edges in another component)",
        "Check whether V == E",
        "Check whether the graph is bipartite",
        "Verify that the minimum degree is at least 3"
      ],
      answer: 0,
      explanation: "Local degree parity checks pass on disjoint cycles. Checking that the single Hierholzer traversal consumed all E edges (`trail.size() == E + 1`) verifies edge-set connectivity in O(1) time."
    }
  ],

  "case-bundler-build-graph-cycles": [
    {
      id: "q12-buildcase-1",
      type: "mcq",
      difficulty: "recall",
      section: "Dependency Graph Direction",
      title: "Indegree Semantics in a Build Scheduler",
      prompt: "In a monorepo build system (like `cargo` or `turborepo`), package `app` depends on `ui-lib`, and `ui-lib` depends on `core-utils`. When using Kahn's algorithm to schedule builds, which target starts with `indegree == 0`?",
      options: [
        "`core-utils`, because it has zero prerequisites and can begin compiling immediately",
        "`app`, because nothing depends on it",
        "`ui-lib`, because it is in the middle of the chain",
        "All three start with indegree 0"
      ],
      answer: 0,
      explanation: "In an execution DAG, edges flow from prerequisite to dependent (`core-utils -> ui-lib -> app`), so `indegree[u]` counts how many dependencies of `u` have not yet finished building."
    },
    {
      id: "q12-buildcase-2",
      type: "mcq",
      difficulty: "apply",
      section: "Cycle Isolation",
      title: "Why Kahn's Leftover Set Over-Reports Cycles",
      prompt: "Suppose a build graph has 1,000 packages. Two low-level packages `A` and `B` form a circular dependency `A <-> B`, and 300 higher-level packages depend (directly or transitively) on `A`. When Kahn's algorithm halts, how many packages have remaining `indegree > 0`, and how do you isolate the actual bug?",
      options: [
        "302 packages have indegree > 0; running Tarjan's SCC isolates the single non-trivial SCC `{A, B}` of size >= 2",
        "Only 2 packages (`A` and `B`) have indegree > 0",
        "All 1,000 packages have indegree > 0",
        "0 packages have indegree > 0"
      ],
      answer: 0,
      explanation: "Because `A` and `B` never finish, their 300 downstream dependents never have their indegrees decremented to 0. Tarjan's SCC algorithm separates the 300 downstream victims (each a trivial size-1 SCC without self-loops) from `{A, B}`."
    },
    {
      id: "q12-buildcase-3",
      type: "numeric",
      difficulty: "apply",
      section: "Critical-Path Makespan",
      title: "Critical-Path Lower Bound (T_infinity)",
      prompt: "A build DAG has 4 targets with build times: `A = 5s`, `B = 12s`, `C = 8s`, `D = 6s`, and execution edges `A -> C`, `B -> C`, `C -> D`. Even with an infinite number of CPU cores ($P = \\infty$), what is the minimum possible wall-clock build time $T_\\infty$ (in seconds)?",
      answer: 26,
      tolerance: 0,
      unit: "seconds",
      hint: "Compute the longest weighted path in the DAG: max(cost(A), cost(B)) + cost(C) + cost(D).",
      explanation: "Target C cannot start until both A (5s) and B (12s) finish at t = 12s. Then C takes 8s (finishing at 20s) and D takes 6s, giving critical path B -> C -> D = 12 + 8 + 6 = 26 seconds."
    },
    {
      id: "q12-buildcase-4",
      type: "mcq",
      difficulty: "staff",
      section: "Concurrent Scheduling",
      title: "Wait-Free Dependency Resolution Across Worker Threads",
      prompt: "In a multi-threaded build daemon executing a DAG across 32 worker threads, how do worker threads trigger newly ready targets without contending on a global graph lock?",
      options: [
        "Each target stores an atomic counter `remaining_deps`; when a worker finishes target u, it executes `remaining_deps[v].fetch_sub(1)` for each dependent v, and whichever thread observes the previous value == 1 pushes v to the work-stealing queue",
        "Each worker thread re-runs Kahn's algorithm from scratch after every file compilation",
        "Worker threads poll all V vertices in a spin-loop every millisecond",
        "Using `std::mutex` around every adjacency list read"
      ],
      answer: 0,
      explanation: "Atomic `fetch_sub(1, memory_order_acq_rel)` guarantees that the exact thread completing the last prerequisite of `v` sees the transition `1 -> 0` and enqueues `v` exactly once with zero mutex contention."
    }
  ],

  "build-tarjan-scc-2sat-solver": [
    {
      id: "q12-2satlab-1",
      type: "mcq",
      difficulty: "recall",
      section: "Literal Indexing",
      title: "Bitwise Negation of 2-SAT Literal Indices",
      prompt: "In a 2-SAT solver where variable $x_i$ ($0 \\le i < N$) is mapped to vertex $2i$ (positive literal) and $\\neg x_i$ is mapped to vertex $2i + 1$ (negative literal), which expression computes the negated literal vertex for any vertex index $u \\in [0, 2N-1]$?",
      options: [
        "u ^ 1",
        "u + 1",
        "2 * N - 1 - u",
        "~u"
      ],
      answer: 0,
      explanation: "Flipping the least significant bit via bitwise XOR (`u ^ 1`) maps even `2i` to `2i + 1` and odd `2i + 1` to `2i` in a single CPU cycle."
    },
    {
      id: "q12-2satlab-2",
      type: "mcq",
      difficulty: "apply",
      section: "Boolean Gadgets",
      title: "Encoding XOR in a 2-SAT Solver",
      prompt: "How do you encode the constraint $x_0 \\oplus x_1 = \\text{True}$ (exactly one of $x_0, x_1$ is True) using `addClause(a, b)`?",
      options: [
        "Call `addClause(lit(0, true), lit(1, true))` AND `addClause(lit(0, false), lit(1, false))`",
        "Call `addClause(lit(0, true), lit(1, false))` only",
        "Call `addClause(lit(0, true), lit(0, false))`",
        "XOR cannot be represented in 2-SAT"
      ],
      answer: 0,
      explanation: "x_0 XOR x_1 is equivalent to (x_0 OR x_1) AND (~x_0 OR ~x_1), which requires two 2-SAT clauses (4 directed implication edges)."
    },
    {
      id: "q12-2satlab-3",
      type: "mcq",
      difficulty: "apply",
      section: "Truth Assignment Extraction",
      title: "Assigning Variable Values from Tarjan SCC IDs",
      prompt: "After running Tarjan's SCC algorithm on a satisfiable 2-SAT implication graph, you observe that for variable $x_3$, `comp[lit(3, true)] = 2` and `comp[lit(3, false)] = 5`. What truth value must be assigned to $x_3$?",
      options: [
        "True, because Tarjan assigns smaller component IDs to SCCs closer to sinks, so (~x_3 -> x_3) may exist, meaning choosing x_3 = True cannot trigger a contradiction",
        "False, because 5 > 2",
        "Either True or False works regardless of edges between the SCCs",
        "The formula is unsatisfiable"
      ],
      answer: 0,
      explanation: "In Tarjan's post-order numbering, if there is an implication path between ~x_3 and x_3, the destination SCC finishes first and gets the smaller ID (2 < 5). Choosing the sink-most literal (`comp[x_3] < comp[~x_3]`) ensures True never implies False."
    },
    {
      id: "q12-2satlab-4",
      type: "numeric",
      difficulty: "staff",
      section: "Prefix Variable Optimization",
      title: "Naive vs Prefix At-Most-One Clause Count",
      prompt: "Suppose a scheduling group contains $K = 100$ boolean variables and at most one of them can be True. Naive pairwise exclusion $(\\neg x_i \\lor \\neg x_j)$ for all $0 \\le i < j < K$ generates how many 2-SAT clauses?",
      answer: 4950,
      tolerance: 0,
      unit: "clauses",
      hint: "Compute K * (K - 1) / 2 for K = 100.",
      explanation: "Pairwise exclusion over K = 100 variables creates 100 * 99 / 2 = 4,950 clauses (9,900 directed edges), whereas prefix-variable encoding reduces this to ~3K = 300 clauses."
    }
  ]
});
