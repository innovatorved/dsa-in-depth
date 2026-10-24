window.QUESTION_BANK = window.QUESTION_BANK || {};
Object.assign(window.QUESTION_BANK, {
  "dp-optimal-substructure-dag": [
    {
      "id": "m16-q01",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Implicit DAG Requirement in Dynamic Programming",
      "prompt": "In the MIT 6.006 SRTBOT Dynamic Programming framework, why must the dependency graph $G = (V, E)$ of subproblem states and transitions be a Directed Acyclic Graph (DAG)?",
      "question": "In the MIT 6.006 SRTBOT Dynamic Programming framework, why must the dependency graph $G = (V, E)$ of subproblem states and transitions be a Directed Acyclic Graph (DAG)?",
      "options": [
        "Acyclicity guarantees a valid topological ordering in which every predecessor state $u$ is completely finalized before any state $v$ that depends on $u$ is evaluated",
        "Because cyclic graphs cannot be stored in adjacency lists",
        "Because only trees with maximum degree 2 support memoization",
        "Because DAGs always have $O(V)$ edges regardless of the number of transitions"
      ],
      "answer": 0,
      "explanation": "If the subproblem dependency graph contains a directed cycle $u \\to v \\to \\dots \\to u$, evaluating $dp[u]$ requires already knowing $dp[u]$, creating an infinite recursion in top-down memoization or reading unfinalized values in bottom-up tabulation."
    },
    {
      "id": "m16-q02",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Minimum Coin Change State DAG Evaluation",
      "prompt": "Given coin denominations $C = \\{1, 3, 4\\}$, what is the minimum number of coins required to form the exact sum $x = 6$ (where the greedy algorithm picks $4 + 1 + 1 = 3$ coins)?",
      "question": "Given coin denominations $C = \\{1, 3, 4\\}$, what is the minimum number of coins required to form the exact sum $x = 6$ (where the greedy algorithm picks $4 + 1 + 1 = 3$ coins)?",
      "answer": 2,
      "tolerance": 0,
      "explanation": "Evaluating $dp[x] = 1 + \\min_{c \\in \\{1,3,4\\}} dp[x-c]$ gives: $dp[0]=0$, $dp[1]=1$, $dp[2]=2$, $dp[3]=1$, $dp[4]=1$, $dp[5]=2$ ($4+1$ or $3+2$), and $dp[6] = \\min(dp[5]+1, dp[3]+1, dp[2]+1) = \\min(3, 2, 3) = 2$ (using $3 + 3$)."
    },
    {
      "id": "m16-q03",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Pull DP vs. Push DP Tradeoff",
      "prompt": "When is **Push DP** (relaxing outgoing edges `dp[v] = min(dp[v], dp[u] + w)` from a finalized state `u`) significantly faster than **Pull DP** (scanning incoming edges `u -> v` to compute `dp[v]`)?",
      "question": "When is **Push DP** (relaxing outgoing edges `dp[v] = min(dp[v], dp[u] + w)` from a finalized state `u`) significantly faster than **Pull DP** (scanning incoming edges `u -> v` to compute `dp[v]`)?",
      "options": [
        "When a large fraction of the state space is unreachable (`dp[u] == INF`), allowing Push DP to skip all outgoing transitions from `u` with a single `if (dp[u] == INF) continue;` check",
        "When every state is reachable and we want to accumulate `dp[v]` in a single CPU register without writing to memory on every transition",
        "When the dependency graph contains negative-weight cycles",
        "When we need to avoid initializing the `dp` array to `INF`"
      ],
      "answer": 0,
      "explanation": "In sparse state spaces where most states are unreachable (`dp[u] == INF`), Pull DP still visits every state $v$ and checks all its incoming transitions, whereas Push DP skips unreachable source states $u$ in $O(1)$ time before entering the transition loop."
    },
    {
      "id": "m16-q04",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Markovian State Completeness & Optimal Substructure",
      "prompt": "Why does the naive subproblem definition $dp[u] =$ 'length of the longest simple path from $s$ to $u$' fail to satisfy Optimal Substructure on a general graph (or even when trying to avoid revisiting vertices without recording the visited set)?",
      "question": "Why does the naive subproblem definition $dp[u] =$ 'length of the longest simple path from $s$ to $u$' fail to satisfy Optimal Substructure on a general graph (or even when trying to avoid revisiting vertices without recording the visited set)?",
      "options": [
        "Because the subproblem state $u$ is not Markovian (memoryless): knowing only the best simple path length to $u$ hides *which* vertices were already visited along that path, so extending $u \\to v$ may revisit an ancestor vertex",
        "Because longest path uses $\\max$ instead of $\\min$, and $\\max$ does not distribute over addition",
        "Because graphs with more than $V - 1$ edges cannot have simple paths",
        "Because `std::max` overflows 64-bit integers on positive weights"
      ],
      "answer": 0,
      "explanation": "Optimal substructure requires subproblem independence: the optimal way to reach $u$ must not restrict which future transitions from $u$ are legal. In Longest Simple Path on a general graph, two paths to $u$ use different subsets of vertices, so to make the state Markovian we must include the subset mask $S$ of visited vertices in the state: $dp[S][u]$ ($O(N^2 2^N)$ Held-Karp DP)."
    }
  ],
  "memoization-tabulation-space-rolling": [
    {
      "id": "m16-q05",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Rolling Array Space Compression Horizon",
      "prompt": "Suppose a 2D DP recurrence $dp[i][j]$ ($0 \\le i \\le N, 0 \\le j \\le M$) depends only on $dp[i-1][j]$, $dp[i-1][j-1]$, and $dp[i][j-1]$. If we only need the final scalar value $dp[N][M]$ and we are allowed to choose which dimension is the outer loop, what is the minimum auxiliary space required?",
      "question": "Suppose a 2D DP recurrence $dp[i][j]$ ($0 \\le i \\le N, 0 \\le j \\le M$) depends only on $dp[i-1][j]$, $dp[i-1][j-1]$, and $dp[i][j-1]$. If we only need the final scalar value $dp[N][M]$ and we are allowed to choose which dimension is the outer loop, what is the minimum auxiliary space required?",
      "options": [
        "$O(\\min(N, M))$ using a 1D array of length $\\min(N, M) + 1$ and one scalar register for the overwritten diagonal $dp[i-1][j-1]$",
        "$O(N + M)$ using two arrays of size $N$ and $M$",
        "$O(N \\cdot M)$ because three dependencies require keeping the entire matrix",
        "$O(\\max(N, M))$ because the inner loop must always iterate over the larger dimension"
      ],
      "answer": 0,
      "explanation": "By swapping the inputs if $N < M$ so that the inner loop runs over the smaller dimension $\\min(N, M)$, a single 1D row of size $\\min(N, M) + 1$ plus a single temporary variable `prev_diag` (holding $dp[i-1][j-1]$ before $dp[j]$ is overwritten) suffices."
    },
    {
      "id": "m16-q06",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Memory Savings of 1D Rolling Array",
      "prompt": "A 2D DP table of `int32_t` (4 bytes each) has dimensions $10{,}000 \\times 2{,}000$. If you replace the full 2D table with a single 1D rolling `int32_t` array over the shorter dimension ($2{,}000$ elements), by what factor does the memory footprint shrink?",
      "question": "A 2D DP table of `int32_t` (4 bytes each) has dimensions $10{,}000 \\times 2{,}000$. If you replace the full 2D table with a single 1D rolling `int32_t` array over the shorter dimension ($2{,}000$ elements), by what factor does the memory footprint shrink?",
      "answer": 10000,
      "tolerance": 0,
      "explanation": "The 2D table uses $10{,}000 \\times 2{,}000 \\times 4$ bytes $= 80{,}000{,}000$ bytes, whereas the single row of $2{,}000$ elements uses $1 \\times 2{,}000 \\times 4 = 8{,}000$ bytes—a reduction factor of exactly $10{,}000\\times$ (from 80 MB down to 8 KB in L1 cache)."
    },
    {
      "id": "m16-q07",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Two-Row Ping-Pong Buffer Stale Value Bug",
      "prompt": "When using a two-row ping-pong array `dp[2][M]` indexed by `cur = i & 1` and `prv = (i - 1) & 1`, what subtle bug occurs if transitions update `dp[cur][j] = std::min(dp[cur][j], dp[prv][k] + cost)` without resetting `dp[cur]` at the start of outer loop `i`?",
      "question": "When using a two-row ping-pong array `dp[2][M]` indexed by `cur = i & 1` and `prv = (i - 1) & 1`, what subtle bug occurs if transitions update `dp[cur][j] = std::min(dp[cur][j], dp[prv][k] + cost)` without resetting `dp[cur]` at the start of outer loop `i`?",
      "options": [
        "`dp[cur][j]` still holds the computed values from row `i - 2`; taking `std::min` against `dp[cur][j]` illegally mixes row `i` with stale values from row `i - 2`",
        "`i & 1` evaluates to `2` when `i` is negative",
        "The compiler optimizes away `dp[prv]` because `cur` and `prv` alias the same memory address",
        "The array size doubles on every iteration of `i`"
      ],
      "answer": 0,
      "explanation": "Because `cur = i & 1` alternates between `0` and `1`, at iteration `i`, buffer `dp[cur]` contains the results written during iteration `i - 2`. Unless you first overwrite or `std::fill(dp[cur], INF)` at the beginning of row `i`, `std::min(dp[cur][j], ...)` will retain the smaller value from row `i - 2`."
    },
    {
      "id": "m16-q08",
      "type": "mcq",
      "difficulty": "staff",
      "title": "When Top-Down Memoization Asymptotically Beats Bottom-Up Tabulation",
      "prompt": "Consider a DP state space of size $N \\times W$ where we start at $(0, W)$ and each step transitions from $(i, w)$ to $(i+1, \\lfloor w/2 \\rfloor)$ or $(i+1, \\lfloor w/3 \\rfloor)$. Why does Top-Down Memoization (with a hash map or sparse table) asymptotically outperform Bottom-Up Tabulation over $0..N \\times 0..W$?",
      "question": "Consider a DP state space of size $N \\times W$ where we start at $(0, W)$ and each step transitions from $(i, w)$ to $(i+1, \\lfloor w/2 \\rfloor)$ or $(i+1, \\lfloor w/3 \\rfloor)$. Why does Top-Down Memoization (with a hash map or sparse table) asymptotically outperform Bottom-Up Tabulation over $0..N \\times 0..W$?",
      "options": [
        "Only states of the form $\\lfloor W / (2^a 3^b) \\rfloor$ are reachable from $W$—there are only $O(\\log^2 W)$ reachable weight states per row instead of $W$, so Top-Down visits $O(N \\log^2 W)$ states while Bottom-Up visits $O(N \\cdot W)$",
        "Top-Down Memoization uses zero memory because recursive calls are tail-call optimized",
        "Hash map lookups are faster in CPU clock cycles than L1 array indexing",
        "Bottom-Up Tabulation cannot evaluate division transitions $\\lfloor w/2 \\rfloor$"
      ],
      "answer": 0,
      "explanation": "When transitions jump multiplicatively ($w \\to \\lfloor w/2 \\rfloor, \\lfloor w/3 \\rfloor$), the set of reachable states from $W$ is exponentially sparse ($O(\\log^2 W)$ values out of $W$). Top-down memoization explores only the reachable subgraph $G_{\\text{reach}}$ from the query."
    }
  ],
  "knapsack-family-01-unbounded-bounded": [
    {
      "id": "m16-q09",
      "type": "mcq",
      "difficulty": "recall",
      "title": "0/1 vs. Unbounded Knapsack 1D Loop Direction",
      "prompt": "Why does the 1D space-optimized 0/1 Knapsack iterate capacity $w$ **backward** (`for (int w = W; w >= w_i; --w)`), whereas Unbounded Knapsack iterates $w$ **forward** (`for (int w = w_i; w <= W; ++w)`)?",
      "question": "Why does the 1D space-optimized 0/1 Knapsack iterate capacity $w$ **backward** (`for (int w = W; w >= w_i; --w)`), whereas Unbounded Knapsack iterates $w$ **forward** (`for (int w = w_i; w <= W; ++w)`)?",
      "options": [
        "Iterating backward ensures `dp[w - w_i]` still holds the value from the *previous* item row $i-1$ (using item $i$ at most once), whereas iterating forward reads an already-updated `dp[w - w_i]` from the *current* row $i$ (allowing item $i$ to be used repeatedly)",
        "Iterating backward avoids negative array indices when `w < w_i`",
        "Iterating forward sorts the items by weight automatically",
        "Backward iteration is required by C++ strict aliasing rules"
      ],
      "answer": 0,
      "explanation": "In 0/1 Knapsack, $dp_{\\text{new}}[w] = \\max(dp_{\\text{old}}[w], dp_{\\text{old}}[w - w_i] + v_i)$. If we overwrite `dp` left-to-right, `dp[w - w_i]` is already $dp_{\\text{new}}[w - w_i]$, which may already contain item $i$ (the exact transition needed for Unbounded Knapsack!)."
    },
    {
      "id": "m16-q10",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Binary Splitting Bundle Decomposition",
      "prompt": "In Bounded Knapsack, an item has weight $w = 3$, value $v = 10$, and maximum count $k = 21$. When decomposing $k = 21$ via Binary Splitting into powers of two $1, 2, 4, \\dots$ plus a remainder $R$, what is the count size $R$ of the final remainder bundle?",
      "question": "In Bounded Knapsack, an item has weight $w = 3$, value $v = 10$, and maximum count $k = 21$. When decomposing $k = 21$ via Binary Splitting into powers of two $1, 2, 4, \\dots$ plus a remainder $R$, what is the count size $R$ of the final remainder bundle?",
      "answer": 6,
      "tolerance": 0,
      "explanation": "Subtracting powers of two from $21$: $21 - 1 = 20$; $20 - 2 = 18$; $18 - 4 = 14$; $14 - 8 = 6$. The next power of two is $16 > 6$, so we stop and emit the remainder bundle of size $R = 6$. The bundles are $\\{1, 2, 4, 8, 6\\}$, which sum to $21$ and can form every integer in $[0, 21]$."
    },
    {
      "id": "m16-q11",
      "type": "mcq",
      "difficulty": "apply",
      "title": "State-Value Inversion for Huge Capacity Knapsack",
      "prompt": "Suppose you have a 0/1 Knapsack instance with $N = 100$ items, maximum item value $v_i \\le 1{,}000$, and knapsack capacity $W = 10^9$ (with $w_i \\le 10^9$). Standard $O(N \\cdot W)$ DP requires $10^{11}$ operations and gigabytes of RAM. How do you solve this exactly in $O(N \\cdot \\sum v_i) = 10^7$ operations?",
      "question": "Suppose you have a 0/1 Knapsack instance with $N = 100$ items, maximum item value $v_i \\le 1{,}000$, and knapsack capacity $W = 10^9$ (with $w_i \\le 10^9$). Standard $O(N \\cdot W)$ DP requires $10^{11}$ operations and gigabytes of RAM. How do you solve this exactly in $O(N \\cdot \\sum v_i) = 10^7$ operations?",
      "options": [
        "Invert the DP state and objective: define $dp[v]$ as the **minimum total weight** required to achieve exact value $v \\in [0, \\sum v_i]$, and return the largest $v$ with $dp[v] \\le W$",
        "Divide all weights $w_i$ and $W$ by $10^6$ and round down to the nearest integer",
        "Use `std::bitset<1000000001>` to shift $10^9$ bits per item",
        "Sort items by $v_i / w_i$ and take items greedily"
      ],
      "answer": 0,
      "explanation": "Since $N = 100$ and $v_i \\le 1000$, the maximum possible total value is $V_{\\max} = 100{,}000$. Defining $dp[v]$ as the minimum weight to achieve value $v$ (initialized to $dp[0] = 0$ and $+\\infty$ elsewhere) runs in $O(N \\cdot V_{\\max}) = 10^7$ operations and 800 KB of memory."
    },
    {
      "id": "m16-q12",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Monotonic Deque Residue Partition in O(NW) Bounded Knapsack",
      "prompt": "In the strict $O(N \\cdot W)$ Bounded Knapsack algorithm using a monotonic queue for an item $(w, v, k)$, why do we partition capacities $0..W$ by their residue $r = \\text{cap} \\bmod w$ and slide a window over quotients $q = 0, 1, \\dots, \\lfloor(W-r)/w\\rfloor$ of the quantity $dp_{\\text{old}}[q \\cdot w + r] - q \\cdot v$?",
      "question": "In the strict $O(N \\cdot W)$ Bounded Knapsack algorithm using a monotonic queue for an item $(w, v, k)$, why do we partition capacities $0..W$ by their residue $r = \\text{cap} \\bmod w$ and slide a window over quotients $q = 0, 1, \\dots, \\lfloor(W-r)/w\\rfloor$ of the quantity $dp_{\\text{old}}[q \\cdot w + r] - q \\cdot v$?",
      "options": [
        "Transitioning with $c \\in [0..k]$ copies of weight $w$ only connects states in the same residue class $r \\pmod w$; subtracting $q \\cdot v$ removes the $q$-dependent offset so all candidates $j \\in [q-k, q]$ compare a fixed key $dp_{\\text{old}}[j w + r] - j v$ inside the monotonic deque",
        "Because capacities in different residue classes can be merged using the Chinese Remainder Theorem",
        "Because `std::deque` only supports window sizes that are prime numbers",
        "To ensure that $dp[q \\cdot w + r]$ is strictly decreasing with $q$"
      ],
      "answer": 0,
      "explanation": "Writing $c = q - j$ copies taken (where $q - k \\le j \\le q$), the recurrence is $dp_{\\text{new}}[q w + r] = \\max_{j \\in [q-k, q]} (dp_{\\text{old}}[j w + r] + (q - j)v) = q v + \\max_{j \\in [q-k, q]} (dp_{\\text{old}}[j w + r] - j v)$. Factoring out $+q v$ isolates a pure function of $j$ that can be maximized over the sliding window $[q-k, q]$ in amortized $O(1)$ per state."
    }
  ],
  "lis-patience-sorting": [
    {
      "id": "m16-q13",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Strictly Increasing vs. Non-Decreasing LIS Binary Search",
      "prompt": "In the $O(N \\log N)$ Patience Sorting algorithm maintaining the monotonic `tails` vector, which C++ standard library binary search functions should be used to find the replacement position for element `x` in (1) **Strictly Increasing** ($<$) vs. (2) **Longest Non-Decreasing** ($\\le$) Subsequence?",
      "question": "In the $O(N \\log N)$ Patience Sorting algorithm maintaining the monotonic `tails` vector, which C++ standard library binary search functions should be used to find the replacement position for element `x` in (1) **Strictly Increasing** ($<$) vs. (2) **Longest Non-Decreasing** ($\\le$) Subsequence?",
      "options": [
        "(1) `std::lower_bound` (first element $\\ge x$) for Strictly Increasing; (2) `std::upper_bound` (first element $> x$) for Non-Decreasing",
        "(1) `std::upper_bound` for Strictly Increasing; (2) `std::lower_bound` for Non-Decreasing",
        "`std::lower_bound` for both variants",
        "`std::binary_search` for both variants"
      ],
      "answer": 0,
      "explanation": "For strictly increasing ($<$), an incoming element $x$ cannot extend a chain ending in $x$, so it must overwrite the first tail $\\ge x$ (`lower_bound`). For non-decreasing ($\\le$), $x$ CAN extend a chain ending in $x$, so it skips over tails $\\le x$ and overwrites the first tail strictly $> x$ (`upper_bound`)."
    },
    {
      "id": "m16-q14",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Patience Sorting `tails` Array State Trace",
      "prompt": "Suppose you run the $O(N \\log N)$ Strictly Increasing LIS algorithm on the array $A = [10, 20, 30, 5, 15]$. After all 5 elements have been processed, what is the integer value stored at `tails[1]` (the 0-indexed second element of `tails`, corresponding to length 2)?",
      "question": "Suppose you run the $O(N \\log N)$ Strictly Increasing LIS algorithm on the array $A = [10, 20, 30, 5, 15]$. After all 5 elements have been processed, what is the integer value stored at `tails[1]` (the 0-indexed second element of `tails`, corresponding to length 2)?",
      "answer": 15,
      "tolerance": 0,
      "explanation": "Trace `tails`: 1) `10` -> `[10]`. 2) `20` -> `[10, 20]`. 3) `30` -> `[10, 20, 30]`. 4) `5` overwrites `tails[0]` -> `[5, 20, 30]`. 5) `15` overwrites `tails[1]` (first element $\\ge 15$ is $20$) -> `[5, 15, 30]`. Thus `tails[1] == 15`."
    },
    {
      "id": "m16-q15",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Dilworth's Theorem & Minimum Non-Increasing Subsequence Partition",
      "prompt": "Given an array $A$ of $N$ integers, you want to partition $A$ into the **minimum possible number of disjoint non-increasing subsequences** ($a_{i_1} \\ge a_{i_2} \\ge \\dots$). By Dilworth's Theorem and Patience Sorting, what is this minimum number of chains equal to?",
      "question": "Given an array $A$ of $N$ integers, you want to partition $A$ into the **minimum possible number of disjoint non-increasing subsequences** ($a_{i_1} \\ge a_{i_2} \\ge \\dots$). By Dilworth's Theorem and Patience Sorting, what is this minimum number of chains equal to?",
      "options": [
        "The length of the Longest **Strictly Increasing** Subsequence ($<$) of $A$",
        "The length of the Longest **Non-Decreasing** Subsequence ($\\le$) of $A$",
        "The number of adjacent inversions in $A$ divided by 2",
        "The number of distinct elements in $A$"
      ],
      "answer": 0,
      "explanation": "Each pile in Patience Sorting (where $x$ is placed on the leftmost pile with $\\text{top} \\ge x$) forms a valid non-increasing subsequence, and the number of piles created is the exact length of the strictly increasing LIS (since pile tops are strictly increasing $<$, forming a maximum antichain)."
    },
    {
      "id": "m16-q16",
      "type": "mcq",
      "difficulty": "staff",
      "title": "2D Russian Doll Envelopes Tie-Breaking Invariant",
      "prompt": "To find the maximum number of nested 2D envelopes $(w_i, h_i)$ where strictly $w_a < w_b$ and $h_a < h_b$, we sort the envelopes by width $w_i$ **ascending**, and on width ties ($w_a = w_b$) by height $h_i$ **descending**, then run 1D strictly increasing LIS on the heights $h_i$. Why is sorting equal-width ties by $h_i$ descending mandatory?",
      "question": "To find the maximum number of nested 2D envelopes $(w_i, h_i)$ where strictly $w_a < w_b$ and $h_a < h_b$, we sort the envelopes by width $w_i$ **ascending**, and on width ties ($w_a = w_b$) by height $h_i$ **descending**, then run 1D strictly increasing LIS on the heights $h_i$. Why is sorting equal-width ties by $h_i$ descending mandatory?",
      "options": [
        "If two envelopes share the same width $w$, sorting their heights in descending order ($h_1 > h_2$) ensures that no strictly increasing subsequence of heights can ever select more than one envelope of width $w$",
        "Because `std::lower_bound` requires the input array to be sorted in descending order",
        "Because wider envelopes always have smaller heights",
        "To reduce the sorting time complexity from $O(N \\log N)$ to $O(N)$"
      ],
      "answer": 0,
      "explanation": "If we sorted equal widths $(w, 3), (w, 5)$ with heights ascending, the 1D LIS on heights $[3, 5]$ would pick both $3$ and $5$ even though they have the same width $w$ (violating $w_a < w_b$). Sorting heights descending $[5, 3]$ within the same width $w$ forces the strictly increasing LIS on heights to pick at most one of them!"
    }
  ],
  "sequence-dp-lcs-levenshtein": [
    {
      "id": "m16-q17",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Deletion-Insertion Edit Distance and LCS Duality",
      "prompt": "If only character **insertions** (cost 1) and **deletions** (cost 1) are allowed (no substitutions), what is the exact minimum edit distance between string $A$ of length $n$ and string $B$ of length $m$ in terms of $|\\text{LCS}(A, B)|$?",
      "question": "If only character **insertions** (cost 1) and **deletions** (cost 1) are allowed (no substitutions), what is the exact minimum edit distance between string $A$ of length $n$ and string $B$ of length $m$ in terms of $|\\text{LCS}(A, B)|$?",
      "options": [
        "$n + m - 2 \\cdot |\\text{LCS}(A, B)|$",
        "$\\max(n, m) - |\\text{LCS}(A, B)|$",
        "$n + m - |\\text{LCS}(A, B)|$",
        "$|n - m| + |\\text{LCS}(A, B)|$"
      ],
      "answer": 0,
      "explanation": "Any common subsequence of length $L$ preserved between $A$ and $B$ requires deleting the remaining $n - L$ characters of $A$ and inserting the remaining $m - L$ characters of $B$, costing $(n - L) + (m - L) = n + m - 2L$, which is minimized when $L = |\\text{LCS}(A, B)|$."
    },
    {
      "id": "m16-q18",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Wagner-Fischer Levenshtein Edit Distance Calculation",
      "prompt": "What is the standard Levenshtein Edit Distance (where insertion, deletion, and substitution each cost 1) between $A = \\text{\"KITTEN\"}$ and $B = \\text{\"SITTING\"}$?",
      "question": "What is the standard Levenshtein Edit Distance (where insertion, deletion, and substitution each cost 1) between $A = \\text{\"KITTEN\"}$ and $B = \\text{\"SITTING\"}$?",
      "answer": 3,
      "tolerance": 0,
      "explanation": "1) Substitute `K` -> `S` (`SITTEN`). 2) Substitute `E` -> `I` (`SITTIN`). 3) Insert `G` at the end (`SITTING`). Total = 3 operations."
    },
    {
      "id": "m16-q19",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Ukkonen's Banded Edit Distance Optimization",
      "prompt": "Suppose you are building a spell-checker or DNA read mapper that only cares whether $\\text{EditDistance}(A, B) \\le K$ (where $N = M = 100{,}000$ and $K = 10$). How does Ukkonen's banded alignment reduce runtime from $10^{10}$ operations to $\\approx 2 \\times 10^6$ operations?",
      "question": "Suppose you are building a spell-checker or DNA read mapper that only cares whether $\\text{EditDistance}(A, B) \\le K$ (where $N = M = 100{,}000$ and $K = 10$). How does Ukkonen's banded alignment reduce runtime from $10^{10}$ operations to $\\approx 2 \\times 10^6$ operations?",
      "options": [
        "Any grid state $(i, j)$ with $|i - j| > K$ requires at least $|i - j| > K$ insertions/deletions to reach from $(0,0)$, so we only evaluate the diagonal band $j \\in [\\max(0, i-K), \\min(M, i+K)]$ of width $2K + 1$ in $O(N \\cdot K)$ time",
        "It hashes substrings of length $K$ using Rabin-Karp and skips dynamic programming",
        "It truncates both strings to their first $K$ characters",
        "It runs Dijkstra's algorithm on the alphabet characters"
      ],
      "answer": 0,
      "explanation": "Moving off the main diagonal $i = j$ changes $i - j$ by $\\pm 1$ only on an insertion or deletion (cost $+1$). Therefore, reaching any state with $|i - j| > K$ already costs $> K$, so states outside the $[i-K, i+K]$ diagonal band never need to be computed."
    },
    {
      "id": "m16-q20",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Hunt-Szymanski LCS-to-LIS Reduction with Duplicate Characters",
      "prompt": "When reducing Longest Common Subsequence $\\text{LCS}(A, B)$ to Longest Increasing Subsequence (LIS) via the Hunt-Szymanski algorithm on strings that contain **duplicate characters**, we replace each character $B[j]$ with the list of all indices $i$ where $A[i] == B[j]$. In what order must the matching indices $i$ for a single character $B[j]$ be emitted?",
      "question": "When reducing Longest Common Subsequence $\\text{LCS}(A, B)$ to Longest Increasing Subsequence (LIS) via the Hunt-Szymanski algorithm on strings that contain **duplicate characters**, we replace each character $B[j]$ with the list of all indices $i$ where $A[i] == B[j]$. In what order must the matching indices $i$ for a single character $B[j]$ be emitted?",
      "options": [
        "In strictly **descending** order of $i$, so that a strictly increasing subsequence of indices can pick at most one occurrence from $A$ for each single character $B[j]$",
        "In strictly **ascending** order of $i$, so that a single character $B[j]$ can match all identical characters in $A$ simultaneously",
        "In random order using a Fisher-Yates shuffle",
        "Sorted by the ASCII value of $A[i+1]$"
      ],
      "answer": 0,
      "explanation": "Just like the Russian Doll Envelope height tie-breaker, if $B[j]$ matches $A$ at indices $i_1 < i_2 < i_3$, emitting them in descending order $[i_3, i_2, i_1]$ guarantees that any strictly increasing subsequence ($<$) of the combined index stream can select at most one index from each $B[j]$!"
    }
  ],
  "interval-dp-matrix-chain-triangulation": [
    {
      "id": "m16-q21",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Valid Topological Loop Orders for Interval DP",
      "prompt": "In Interval DP where $dp[i][j] = \\min_{i \\le k < j} (dp[i][k] + dp[k+1][j] + \\text{cost})$, why does the standard 2D loop `for (int i = 0; i < n; ++i) for (int j = i + 1; j < n; ++j)` fail?",
      "question": "In Interval DP where $dp[i][j] = \\min_{i \\le k < j} (dp[i][k] + dp[k+1][j] + \\text{cost})$, why does the standard 2D loop `for (int i = 0; i < n; ++i) for (int j = i + 1; j < n; ++j)` fail?",
      "options": [
        "Because computing $dp[i][j]$ requires $dp[k+1][j]$ where $k+1 > i$ (a row below row $i$ that has not been computed yet when $i$ increases from $0$ to $n-1$)",
        "Because $j$ must always be strictly less than $i$",
        "Because $dp[i][k]$ lies to the right of $dp[i][j]$ in row $i$",
        "Because Interval DP can only be implemented using top-down recursion"
      ],
      "answer": 0,
      "explanation": "Since $k \\ge i$, the right sub-interval $dp[k+1][j]$ has left endpoint $k+1 \\in [i+1, j]$. If the outer loop increments $i$ from $0$ to $n-1$, rows $i+1 \\dots j$ are still uninitialized when row $i$ is evaluated! Iterating by increasing length `len = j - i + 1` or decreasing `i = n-1 down to 0` fixes the topological order."
    },
    {
      "id": "m16-q22",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Matrix Chain Multiplication Optimal Cost",
      "prompt": "Given three matrices $A_1 (10 \\times 100)$, $A_2 (100 \\times 5)$, and $A_3 (5 \\times 50)$, what is the minimum number of scalar multiplications required to compute the product $A_1 A_2 A_3$?",
      "question": "Given three matrices $A_1 (10 \\times 100)$, $A_2 (100 \\times 5)$, and $A_3 (5 \\times 50)$, what is the minimum number of scalar multiplications required to compute the product $A_1 A_2 A_3$?",
      "answer": 7500,
      "tolerance": 0,
      "explanation": "Parenthesizing as $((A_1 A_2) A_3)$: multiplying $A_1 (10 \\times 100)$ by $A_2 (100 \\times 5)$ costs $10 \\times 100 \\times 5 = 5{,}000$ and produces a $10 \\times 5$ matrix; multiplying that by $A_3 (5 \\times 50)$ costs $10 \\times 5 \\times 50 = 2{,}500$. Total $= 5{,}000 + 2{,}500 = 7{,}500$ (vs. $(A_1 (A_2 A_3))$ which costs $100 \\times 5 \\times 50 + 10 \\times 100 \\times 50 = 75{,}000$)."
    },
    {
      "id": "m16-q23",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Burst Balloons: Guessing the Last vs. First Element",
      "prompt": "In the Burst Balloons problem (popping balloon $k$ yields $a[\\text{left}] \\cdot a[k] \\cdot a[\\text{right}]$ coins, after which `left` and `right` become adjacent), why do we define $dp[i][j]$ by guessing which balloon $k \\in (i, j)$ is popped **LAST** rather than **FIRST**?",
      "question": "In the Burst Balloons problem (popping balloon $k$ yields $a[\\text{left}] \\cdot a[k] \\cdot a[\\text{right}]$ coins, after which `left` and `right` become adjacent), why do we define $dp[i][j]$ by guessing which balloon $k \\in (i, j)$ is popped **LAST** rather than **FIRST**?",
      "options": [
        "If we guess the first balloon $k$ popped, the sub-intervals $(i, k)$ and $(k, j)$ become adjacent and interact; if we guess the LAST balloon $k$ popped in $(i, j)$, its neighbors at pop time are guaranteed to be the fixed boundary balloons $i$ and $j$, keeping $(i, k)$ and $(k, j)$ completely independent",
        "Because the last balloon popped always has value 0",
        "Because guessing the first balloon popped requires $O(N^2)$ states whereas guessing the last requires $O(N)$ states",
        "Because matrix multiplication is non-commutative"
      ],
      "answer": 0,
      "explanation": "When $k$ is the *last* balloon remaining inside open interval $(i, j)$, every balloon in $(i, k)$ and $(k, j)$ has already been popped, so $k$ is guaranteed to be adjacent to boundary balloons $i$ and $j$. Moreover, no balloon in $(i, k)$ ever touches any balloon in $(k, j)$ while $k$ is still alive!"
    },
    {
      "id": "m16-q24",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Transpose-Cache Optimization in O(N^3) Interval DP",
      "prompt": "In the innermost loop `for (int k = i; k < j; ++k) best = min(best, dp[i][k] + dp[k+1][j] + ...)` of an $O(N^3)$ Interval DP, why does maintaining a transposed copy `dpT[j][k+1] = dp[k+1][j]` yield a $4\\times$–$6\\times$ speedup on modern CPUs?",
      "question": "In the innermost loop `for (int k = i; k < j; ++k) best = min(best, dp[i][k] + dp[k+1][j] + ...)` of an $O(N^3)$ Interval DP, why does maintaining a transposed copy `dpT[j][k+1] = dp[k+1][j]` yield a $4\\times$–$6\\times$ speedup on modern CPUs?",
      "options": [
        "In row-major memory layout, `dp[k+1][j]` increments row index `k` with stride $N$ (jumping across cache lines on every step), whereas `dpT[j][k+1]` has unit stride 1 along `k`—enabling sequential L1 cache streaming and SIMD auto-vectorization",
        "It reduces the asymptotic number of loop iterations from $N^3 / 6$ to $N^2$",
        "It eliminates the need to initialize `best = INF`",
        "It allows the outer `len` loop to run in reverse order"
      ],
      "answer": 0,
      "explanation": "When $N = 1000$, stepping `dp[k+1][j]` by `k++` jumps $1000 \\times 8 = 8000$ bytes per iteration, missing L1 cache and stalling TLB prefetchers. Reading `dp[i][k]` and `dpT[j][k+1]` streams two contiguous rows side-by-side with stride 1."
    }
  ],
  "tree-dp-rerooting-technique": [
    {
      "id": "m16-q25",
      "type": "mcq",
      "difficulty": "recall",
      "title": "The O(N^2) Tree Knapsack Complexity Proof",
      "prompt": "When merging subtree knapsack arrays at node $u$ with child $v$ using loops bounded by the current accumulated size `sz[u]` and `sz[v]` (updating `sz[u] += sz[v]` *after* the merge), why is the total time across the entire tree $O(N^2)$ instead of $O(N^3)$?",
      "question": "When merging subtree knapsack arrays at node $u$ with child $v$ using loops bounded by the current accumulated size `sz[u]` and `sz[v]` (updating `sz[u] += sz[v]` *after* the merge), why is the total time across the entire tree $O(N^2)$ instead of $O(N^3)$?",
      "options": [
        "Each inner-loop iteration at parent $u$ merging child $v$ corresponds to a unique pair of vertices $(x, y)$ with $x$ in $u$'s already-merged branches and $y \\in T_v$ whose Lowest Common Ancestor is $u$; since there are $\\binom{N}{2}$ pairs in total, total work is $\\binom{N}{2} = O(N^2)$",
        "Because every tree has height at most $O(\\log N)$",
        "Because at most 2 vertices in any tree can have degree greater than 2",
        "Because `std::vector::move` runs in $O(1)$ time"
      ],
      "answer": 0,
      "explanation": "The product $\\text{sz}_{\\text{cur}}[u] \\times \\text{sz}[v]$ counts pairs of nodes $(x, y)$ that meet for the very first time at LCA $u$. Since every pair of nodes in a tree has a single unique LCA, the sum of $\\text{sz}_{\\text{cur}}[u] \\times \\text{sz}[v]$ over all tree edges is literally $\\binom{N}{2} = N(N-1)/2$."
    },
    {
      "id": "m16-q26",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Rerooting Transition for Sum of Distances in Tree",
      "prompt": "In a tree with $N = 10$ vertices, suppose vertex $u$ has total distance sum $\\text{ans}[u] = 28$ to all vertices, and its child $v$ has subtree size $\\text{sz}[v] = 3$. When rerooting the tree from $u$ to $v$ across edge $(u, v)$ of weight 1, what is $\\text{ans}[v]$?",
      "question": "In a tree with $N = 10$ vertices, suppose vertex $u$ has total distance sum $\\text{ans}[u] = 28$ to all vertices, and its child $v$ has subtree size $\\text{sz}[v] = 3$. When rerooting the tree from $u$ to $v$ across edge $(u, v)$ of weight 1, what is $\\text{ans}[v]$?",
      "answer": 32,
      "tolerance": 0,
      "explanation": "Moving the root from $u$ to $v$ moves $1$ step closer to the $\\text{sz}[v] = 3$ vertices in $T_v$ and $1$ step farther from the $N - \\text{sz}[v] = 10 - 3 = 7$ vertices outside $T_v$. Thus $\\text{ans}[v] = \\text{ans}[u] - 3 + 7 = 28 + 4 = 32$."
    },
    {
      "id": "m16-q27",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Tree Knapsack Loop-Bound Bug",
      "prompt": "In an $O(N \\cdot K)$ Tree Dependency Knapsack implementation, what happens to the time complexity on a star graph (root $0$ connected to $N - 1$ leaves) if you precompute `sz[u]` for the whole subtree first and run the outer merge loop up to `min(K, total_sz[u])` instead of the running accumulated `sz[u]`?",
      "question": "In an $O(N \\cdot K)$ Tree Dependency Knapsack implementation, what happens to the time complexity on a star graph (root $0$ connected to $N - 1$ leaves) if you precompute `sz[u]` for the whole subtree first and run the outer merge loop up to `min(K, total_sz[u])` instead of the running accumulated `sz[u]`?",
      "options": [
        "The complexity degrades from $O(N \\cdot K)$ to $O(N \\cdot K^2)$ (or $O(N^2)$ when $K = N$) because each of the $N - 1$ leaf merges at the root iterates $K$ times instead of growing by 1 per leaf",
        "The complexity improves to $O(N \\log K)$",
        "The algorithm fails to compile",
        "The complexity remains $O(N \\cdot K)$ on all trees"
      ],
      "answer": 0,
      "explanation": "On a star graph with $K = N$, using the final `total_sz[0] = N` on every child $v$ does $N \\times 1$ work for each of the $N-1$ leaves, or on a tree with $\\sqrt{N}$ branches of size $K$ does $(N/K) \\cdot K^2 = O(N K^2)$ work. Using the running accumulated `sz[u]` is essential for the $O(N K)$ bound."
    },
    {
      "id": "m16-q28",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Handling Non-Invertible Operators in Rerooting DP",
      "prompt": "Suppose we want to compute the **eccentricity** (maximum distance to any node, using $\\max$) for all $N$ roots using Rerooting DP. Why can't we compute `up[v]` by 'subtracting' `down[v]` from `down[u]`, and how do we achieve $O(N)$ total time even when node degrees are $O(N)$?",
      "question": "Suppose we want to compute the **eccentricity** (maximum distance to any node, using $\\max$) for all $N$ roots using Rerooting DP. Why can't we compute `up[v]` by 'subtracting' `down[v]` from `down[u]`, and how do we achieve $O(N)$ total time even when node degrees are $O(N)$?",
      "options": [
        "Because $\\max$ has no inverse operation; instead, for each parent $u$ with children $v_0, \\dots, v_{d-1}$, we precompute prefix maximums $P[i]$ and suffix maximums $S[i]$ of child contributions in $O(d)$ time so each child $v_i$ receives $\\max(\\text{up}[u], P[i-1], S[i+1]) + 1$ in $O(1)$",
        "We must use a Segment Tree at every node, which increases the complexity to $O(N^2)$",
        "We can replace $\\max(a, b)$ with $a + b$ during Pass 1 and divide by 2 in Pass 2",
        "Rerooting DP only works for sum and XOR operations"
      ],
      "answer": 0,
      "explanation": "Prefix and suffix arrays over the child list $v_0 \\dots v_{d-1}$ exclude child $v_i$ via $\\max(P[i-1], S[i+1])$ in $O(1)$ time per child and $O(\\sum \\text{deg}(u)) = O(N)$ total time/space—working for *any* associative commutative monoid ($\\max, \\min, \\gcd$, multiplication $\\bmod M$) without needing an inverse!"
    }
  ],
  "dag-dp-longest-path-counting": [
    {
      "id": "m16-q29",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Shortest and Longest Paths on DAGs with Negative Weights",
      "prompt": "Given a Directed Acyclic Graph (DAG) with $V$ vertices and $E$ directed edges whose weights may be positive, zero, or **negative**, what is the optimal time complexity to find the Single-Source Shortest Path (or Longest Path) from source $s$?",
      "question": "Given a Directed Acyclic Graph (DAG) with $V$ vertices and $E$ directed edges whose weights may be positive, zero, or **negative**, what is the optimal time complexity to find the Single-Source Shortest Path (or Longest Path) from source $s$?",
      "options": [
        "$O(V + E)$ by relaxing edges in topological order",
        "$O(V \\cdot E)$ using Bellman-Ford because negative edge weights are present",
        "$O((V + E) \\log V)$ using Dijkstra's algorithm with a binary heap",
        "NP-hard because negative weights reduce to Hamiltonian Path"
      ],
      "answer": 0,
      "explanation": "Because a DAG has no cycles (and therefore no negative-weight or positive-weight cycles), relaxing outgoing edges once per vertex in topological order finalizes every shortest and longest distance in $O(V + E)$ time regardless of edge signs."
    },
    {
      "id": "m16-q30",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Counting Distinct Paths in a DAG",
      "prompt": "Consider a 5-vertex DAG with edges: $(0 \\to 1), (0 \\to 2), (1 \\to 2), (1 \\to 3), (2 \\to 3), (2 \\to 4), (3 \\to 4)$. How many distinct directed paths exist from source $0$ to sink $4$?",
      "question": "Consider a 5-vertex DAG with edges: $(0 \\to 1), (0 \\to 2), (1 \\to 2), (1 \\to 3), (2 \\to 3), (2 \\to 4), (3 \\to 4)$. How many distinct directed paths exist from source $0$ to sink $4$?",
      "answer": 5,
      "tolerance": 0,
      "explanation": "Propagating `ways` in topological order $0, 1, 2, 3, 4$: `ways[0] = 1`; `ways[1] = ways[0] = 1`; `ways[2] = ways[0] + ways[1] = 1 + 1 = 2`; `ways[3] = ways[1] + ways[2] = 1 + 2 = 3`; `ways[4] = ways[2] + ways[3] = 2 + 3 = 5$."
    },
    {
      "id": "m16-q31",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Kahn's Queue Initialization Bug in Single-Source DAG DP",
      "prompt": "When computing the longest path from a specific source vertex $s$ to $t$ in a DAG using Kahn's in-degree algorithm, why is it a bug to initialize the queue with ONLY `q.push(s)` instead of pushing all vertices with `in_deg[u] == 0`?",
      "question": "When computing the longest path from a specific source vertex $s$ to $t$ in a DAG using Kahn's in-degree algorithm, why is it a bug to initialize the queue with ONLY `q.push(s)` instead of pushing all vertices with `in_deg[u] == 0`?",
      "options": [
        "If a vertex $v$ on the $s \\leadsto t$ path also has an incoming edge from an unreachable vertex $r$ (`in_deg[r] == 0`), never peeling $r$ prevents `in_deg[v]` from ever reaching $0$, so $v$ and $t$ are never visited",
        "Because `s` is guaranteed to have `in_deg[s] > 0` in every DAG",
        "Because Kahn's algorithm requires the queue to be sorted by vertex ID",
        "Because pushing only `s` causes an infinite loop on acyclic graphs"
      ],
      "answer": 0,
      "explanation": "Kahn's algorithm only enqueues a vertex $v$ when *all* of its incoming edges have been peeled (`--in_deg[v] == 0`). If an ancestor $r$ that is unreachable from $s$ is not peeled, `in_deg[v]` stays $\\ge 1$ forever! Pushing all `in_deg == 0` vertices while guarding relaxations with `if (dist[u] != -INF)` solves this cleanly."
    },
    {
      "id": "m16-q32",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Vertex-Weighted Maximum Walk via SCC Condensation",
      "prompt": "You are given a directed graph $G = (V, E)$ (which **may contain cycles**) and non-negative vertex profits $p_u \\ge 0$. You may walk along directed edges and collect each visited vertex's profit at most once (revisiting vertices is allowed, but profit is counted once). How can you find the maximum profit walk in $O(V + E)$ time?",
      "question": "You are given a directed graph $G = (V, E)$ (which **may contain cycles**) and non-negative vertex profits $p_u \\ge 0$. You may walk along directed edges and collect each visited vertex's profit at most once (revisiting vertices is allowed, but profit is counted once). How can you find the maximum profit walk in $O(V + E)$ time?",
      "options": [
        "Decompose $G$ into Strongly Connected Components (SCCs) via Tarjan's algorithm, sum the vertex profits inside each SCC $C_i$ into a super-node weight $P(C_i) = \\sum_{u \\in C_i} p_u$, and run $O(V + E)$ Longest Path DP on the resulting condensation DAG",
        "Negate all vertex profits and run Dijkstra's algorithm",
        "Run Bellman-Ford for $V - 1$ rounds without condensing SCCs",
        "The problem is NP-hard even when revisiting vertices is allowed"
      ],
      "answer": 0,
      "explanation": "Because revisiting vertices and edges is permitted, entering any Strongly Connected Component $C_i$ allows visiting *every* vertex in $C_i$ to collect $P(C_i) = \\sum_{u \\in C_i} p_u$ before exiting to any out-neighbor SCC. Since the quotient graph of SCCs is a DAG, longest path DP on the condensation graph is exact and linear-time!"
    }
  ],
  "case-pretty-printing-knuth-plass": [
    {
      "id": "m16-q33",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Knuth-Plass Final Line Badness Rule",
      "prompt": "In the Knuth-Plass line-breaking DP for paragraph justification, why is the slack penalty (badness) of the **final line** of the paragraph ($j = n$, provided its width is $\\le L$) defined to be $0$ instead of $(L - W(i, n))^3$?",
      "question": "In the Knuth-Plass line-breaking DP for paragraph justification, why is the slack penalty (badness) of the **final line** of the paragraph ($j = n$, provided its width is $\\le L$) defined to be $0$ instead of $(L - W(i, n))^3$?",
      "options": [
        "The last line of a paragraph is naturally left-aligned and does not need to stretch to the right margin; penalizing its trailing whitespace would artificially pull words down from earlier lines and make earlier lines overly sparse",
        "Because the last line always contains exactly $L$ characters",
        "To prevent division by zero when $j = n$",
        "Because the algorithm processes words from left to right and ignores the last word"
      ],
      "answer": 0,
      "explanation": "In typography, the closing line of a paragraph is allowed to end short without stretching inter-word spaces. Setting $\\text{cost}(i, n) = 0$ when $W(i, n) \\le L$ ensures the optimizer only minimizes whitespace stretching on internal full-width lines."
    },
    {
      "id": "m16-q34",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Knuth-Plass Line Breaking vs. Greedy Word Wrap",
      "prompt": "Suppose line width is $L = 6$ and we have 4 words of lengths $[4, 1, 2, 3]$. Using quadratic badness $(L - W)^2$ on non-final lines and $0$ on the final line (where words on the same line are separated by a 1-char space), Greedy packs `[4, 1]` on Line 1 (width 6, cost 0), `[2]` on Line 2 (width 2, slack 4, cost $4^2 = 16$), and `[3]` on Line 3 (final, cost 0) for total badness $16$. What is the minimum total badness achieved by Knuth-Plass DP?",
      "question": "Suppose line width is $L = 6$ and we have 4 words of lengths $[4, 1, 2, 3]$. Using quadratic badness $(L - W)^2$ on non-final lines and $0$ on the final line (where words on the same line are separated by a 1-char space), Greedy packs `[4, 1]` on Line 1 (width 6, cost 0), `[2]` on Line 2 (width 2, slack 4, cost $4^2 = 16$), and `[3]` on Line 3 (final, cost 0) for total badness $16$. What is the minimum total badness achieved by Knuth-Plass DP?",
      "answer": 8,
      "tolerance": 0,
      "explanation": "Knuth-Plass DP places `[4]` on Line 1 (width $4$, slack $6 - 4 = 2$, badness $2^2 = 4$), `[1, 2]` on Line 2 (width $1 + 1 + 2 = 4$, slack $6 - 4 = 2$, badness $2^2 = 4$), and `[3]` on Line 3 (final line, cost $0$), achieving a total badness of $4 + 4 + 0 = 8$ (strictly beating Greedy's $16$)."
    },
    {
      "id": "m16-q35",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Active Breakpoint Window Complexity in Knuth-Plass",
      "prompt": "If a paragraph has $N$ words (each of length $\\ge 1$) and target line width $L$, why does Knuth-Plass DP with an early `if (width > L) break;` inside the inner loop run in $O(N \\cdot L)$ time rather than $O(N^2)$?",
      "question": "If a paragraph has $N$ words (each of length $\\ge 1$) and target line width $L$, why does Knuth-Plass DP with an early `if (width > L) break;` inside the inner loop run in $O(N \\cdot L)$ time rather than $O(N^2)$?",
      "options": [
        "Because each word plus its separating space takes at least 2 characters, at most $\\lceil L / 2 \\rceil$ words can fit on a single line; thus the inner loop executes at most $O(L)$ iterations per starting word $i$",
        "Because prefix sums compute $W(i, j)$ in $O(1 / N)$ time",
        "Because the DP only evaluates power-of-two word indices",
        "Because $L$ is always greater than $N^2$"
      ],
      "answer": 0,
      "explanation": "Since $W(i, j)$ increases by at least $2$ each time $j$ increments, $W(i, j) > L$ is guaranteed to trigger within at most $L/2 + 1$ steps, bounding the out-degree of every vertex in the Knuth-Plass DAG by $O(L)$."
    },
    {
      "id": "m16-q36",
      "type": "mcq",
      "difficulty": "staff",
      "title": "AST Pretty-Printing State Extensions in Code Formatters",
      "prompt": "When extending Knuth-Plass from flat prose paragraphs to source code formatters (`clang-format`, `prettier`, `rustfmt`), why is the 1D state index $i$ (token index) no longer sufficient to satisfy the Markovian Optimal Substructure property?",
      "question": "When extending Knuth-Plass from flat prose paragraphs to source code formatters (`clang-format`, `prettier`, `rustfmt`), why is the 1D state index $i$ (token index) no longer sufficient to satisfy the Markovian Optimal Substructure property?",
      "options": [
        "Breaking a line inside nested AST expressions changes the **indentation column** and active parenthesis alignment stack for subsequent lines, which alters how many characters fit on future lines",
        "Source code tokens can have negative character widths",
        "Programming languages do not allow spaces between tokens",
        "Code formatters must evaluate tokens in reverse order from the end of the file"
      ],
      "answer": 0,
      "explanation": "In prose, every line after the first starts at column 0 (remaining width $L$). In source code, choosing whether to break an outer call `foo(bar(a, b))` changes the indentation column of inner tokens, so the state must include `(token_idx, current_column, paren_indentation_stack)`."
    }
  ],
  "build-hirschberg-linear-space-diff": [
    {
      "id": "m16-q37",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Hirschberg's Algorithm Time and Space Complexity",
      "prompt": "What are the exact asymptotic time and auxiliary working space complexities of Hirschberg's algorithm for reconstructing the full optimal sequence alignment (or LCS) of two strings of lengths $N$ and $M$?",
      "question": "What are the exact asymptotic time and auxiliary working space complexities of Hirschberg's algorithm for reconstructing the full optimal sequence alignment (or LCS) of two strings of lengths $N$ and $M$?",
      "options": [
        "$O(N \\cdot M)$ time (specifically $\\approx 2 N M$ cell evaluations) and $O(\\min(N, M))$ auxiliary space",
        "$O(N \\cdot M \\log N)$ time and $O(\\min(N, M))$ auxiliary space",
        "$O(N \\cdot M)$ time and $O(N \\cdot M)$ auxiliary space",
        "$O((N + M) \\log N)$ time and $O(1)$ auxiliary space"
      ],
      "answer": 0,
      "explanation": "Because the subproblem areas halve at every level of recursion ($nm + nm/2 + nm/4 + \\dots = 2nm$), Hirschberg's algorithm avoids the $\\log N$ factor in time, running in strict $\\Theta(NM)$ time and $\\Theta(\\min(N, M))$ working space."
    },
    {
      "id": "m16-q38",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Hirschberg Subproblem Area Sum",
      "prompt": "In Hirschberg's algorithm on a grid of dimensions $N = 100$ and $M = 80$, the root call splits $A$ at $\\text{mid} = 50$ and discovers that the optimal alignment crosses row $50$ at column $j^* = 30$. What is the sum of the grid areas ($\\text{rows} \\times \\text{cols}$) of the two immediate child recursive subproblems at depth 1?",
      "question": "In Hirschberg's algorithm on a grid of dimensions $N = 100$ and $M = 80$, the root call splits $A$ at $\\text{mid} = 50$ and discovers that the optimal alignment crosses row $50$ at column $j^* = 30$. What is the sum of the grid areas ($\\text{rows} \\times \\text{cols}$) of the two immediate child recursive subproblems at depth 1?",
      "answer": 4000,
      "tolerance": 0,
      "explanation": "The top-left subproblem has dimensions $50 \\times 30 = 1{,}500$, and the bottom-right subproblem has dimensions $(100 - 50) \\times (80 - 30) = 50 \\times 50 = 2{,}500$. Their sum is $1{,}500 + 2{,}500 = 4{,}000$, which is exactly $\\frac{1}{2} N M = \\frac{1}{2}(8{,}000)$ regardless of $j^*$!"
    },
    {
      "id": "m16-q39",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Finding the Optimal Midpoint Crossing Column j*",
      "prompt": "In Hirschberg's LCS algorithm, let `L[0..m]` be the 1D forward DP row for prefix `A[0..mid-1]` against `B[0..m-1]`, and let `R[0..m]` be the 1D backward DP row for suffix `A[mid..n-1]` against `B[0..m-1]`. How is the optimal split column $j^*$ on row `mid` selected?",
      "question": "In Hirschberg's LCS algorithm, let `L[0..m]` be the 1D forward DP row for prefix `A[0..mid-1]` against `B[0..m-1]`, and let `R[0..m]` be the 1D backward DP row for suffix `A[mid..n-1]` against `B[0..m-1]`. How is the optimal split column $j^*$ on row `mid` selected?",
      "options": [
        "$j^* = \\arg\\max_{0 \\le j \\le m} (L[j] + R[j])$",
        "$j^* = \\arg\\max_{0 \\le j \\le m} \\max(L[j], R[j])$",
        "$j^* = \\lfloor m / 2 \\rfloor$ unconditionally",
        "$j^* = \\arg\\min_{0 \\le j \\le m} |L[j] - R[j]|$"
      ],
      "answer": 0,
      "explanation": "$L[j]$ is the longest common subsequence of $A[0..\\text{mid}-1]$ and $B[0..j-1]$, while $R[j]$ is the longest common subsequence of $A[\\text{mid}..n-1]$ and $B[j..m-1]$. Any valid alignment of $A$ and $B$ partitions $B$ at some index $j$, achieving total score $L[j] + R[j]$."
    },
    {
      "id": "m16-q40",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Deallocating Forward/Backward Vectors Before Recursing",
      "prompt": "In a C++ implementation of Hirschberg's recursive function `solve_rec(a, b)`, why must the local `std::vector<int> L` and `R` buffers be destroyed (e.g., via an inner scope block) **before** calling `solve_rec` on the top-left and bottom-right quadrants?",
      "question": "In a C++ implementation of Hirschberg's recursive function `solve_rec(a, b)`, why must the local `std::vector<int> L` and `R` buffers be destroyed (e.g., via an inner scope block) **before** calling `solve_rec` on the top-left and bottom-right quadrants?",
      "options": [
        "If `L` and `R` remain alive on the call stack during the recursive calls, $\\log_2 N$ active stack frames simultaneously hold vectors of total size $O(M \\log N)$, violating the strict $O(M)$ peak space bound",
        "Because C++ does not allow calling a recursive function while a `std::vector` is in scope",
        "Because `L` and `R` modify the characters of `std::string_view a` in their destructors",
        "Because keeping `L` and `R` alive increases the time complexity from $O(NM)$ to $O(N^2 M)$"
      ],
      "answer": 0,
      "explanation": "Along the leftmost recursion branch, the width of `b` could remain $j^* = M$ for $\\log_2 N$ consecutive levels if the optimal path hugs the right boundary. If each frame keeps its $O(M)$ vectors allocated while recursing, peak heap usage grows to $O(M \\log N)$. Destroying `L` and `R` before recursing keeps peak heap allocation strictly $O(M)$."
    }
  ]
});
