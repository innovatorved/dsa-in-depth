window.QUESTION_BANK = window.QUESTION_BANK || {};
Object.assign(window.QUESTION_BANK, {
  "bitmask-dp-tsp-hamiltonian": [
    {
      "id": "m17-q01",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "Why does formatting the Bellman-Held-Karp TSP DP table as `dp[mask][u]` (mask outer, endpoint inner) run significantly faster on modern CPUs than `dp[u][mask]`?",
      "question": "Why does formatting the Bellman-Held-Karp TSP DP table as `dp[mask][u]` (mask outer, endpoint inner) run significantly faster on modern CPUs than `dp[u][mask]`?",
      "options": [
        "Iterating `mask` in increasing order keeps all `N` endpoints of `dp[mask][0..N-1]` inside a single contiguous cache line (spatial locality)",
        "It reduces the asymptotic time complexity from $O(N^2 2^N)$ to $O(N 2^N)$",
        "It eliminates the need to check whether vertex `u` belongs to `mask`",
        "It allows the compiler to replace bitwise OR operations with floating-point instructions"
      ],
      "answer": 0,
      "explanation": "When `mask` is the outer index of `dp[2^N][N]`, all `N` endpoint values for the current mask sit adjacent in memory (at most 160 bytes for `N = 20`), fitting in 2–3 L1 cache lines instead of striding across $2^N$ entries per transition."
    },
    {
      "id": "m17-q02",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "In the Traveling Salesperson Problem on $N = 5$ vertices ($0, 1, 2, 3, 4$) where we fix vertex $0$ as the starting vertex of the tour, how many distinct non-empty subset masks `mask` that include vertex $0$ (i.e., `(mask & 1) == 1`) exist in the state space?",
      "question": "In the Traveling Salesperson Problem on $N = 5$ vertices ($0, 1, 2, 3, 4$) where we fix vertex $0$ as the starting vertex of the tour, how many distinct non-empty subset masks `mask` that include vertex $0$ (i.e., `(mask & 1) == 1`) exist in the state space?",
      "answer": 16,
      "tolerance": 0,
      "explanation": "Fixing bit $0$ to $1$ leaves $N - 1 = 4$ remaining vertices ($1, 2, 3, 4$), each of which can be independently included or excluded, giving $2^{5-1} = 2^4 = 16$ masks."
    },
    {
      "id": "m17-q03",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "How does iterating submasks via `for (int sub = (mask - 1) & mask; sub > 0; sub = (sub - 1) & mask)` achieve $O(3^N)$ total work across all $2^N$ masks instead of $O(4^N)$?",
      "question": "How does iterating submasks via `for (int sub = (mask - 1) & mask; sub > 0; sub = (sub - 1) & mask)` achieve $O(3^N)$ total work across all $2^N$ masks instead of $O(4^N)$?",
      "options": [
        "By the Binomial Theorem, each of the $N$ elements is independently in one of 3 states (in `sub`, in `mask \\setminus sub`, or outside `mask`), summing $\\sum_{k=0}^N \\binom{N}{k} 2^k = 3^N$",
        "Because `(sub - 1) & mask` skips every odd-popcount submask",
        "Because each mask has at most 3 proper submasks on average",
        "Because hardware BMI2 instructions execute the inner loop in $O(1)$ parallel cycles"
      ],
      "answer": 0,
      "explanation": "A mask with $k$ set bits has $2^k$ submasks. Summing $\\binom{N}{k} 2^k$ over $k = 0 \\dots N$ equals $(1 + 2)^N = 3^N$, because every bit $i \\in [0, N-1]$ has 3 choices: $0$ in both, $1$ in `mask` only, or $1$ in both `mask` and `sub`."
    },
    {
      "id": "m17-q04",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "You are counting the number of Simple Cycles in an undirected graph on $N \\le 19$ vertices using Hamiltonian walk bitmask DP `dp[mask][u]`. How do you prevent counting the same cycle $|C|$ times (once for each starting vertex) without doing an $O(N)$ outer loop of separate DP runs?",
      "question": "You are counting the number of Simple Cycles in an undirected graph on $N \\le 19$ vertices using Hamiltonian walk bitmask DP `dp[mask][u]`. How do you prevent counting the same cycle $|C|$ times (once for each starting vertex) without doing an $O(N)$ outer loop of separate DP runs?",
      "options": [
        "In every `mask`, fix the starting vertex of the cycle to be the lowest-indexed set bit `__builtin_ctz(mask)` and only allow transitions to vertices $v > \\text{__builtin_ctz}(mask)$",
        "Divide the final sum of `dp[mask][u]` by $N$ at the end",
        "Only transitions from $u$ to $v$ where $u < v$ are allowed anywhere along the cycle",
        "Initialize `dp[(1 << N) - 1][0] = 1` and run the DP backwards"
      ],
      "answer": 0,
      "explanation": "Every simple cycle $C$ has a unique minimum-numbered vertex $s = \\min(C) = \\text{__builtin_ctz}(\\text{mask})$. By requiring every partial path on `mask` to start at $s$ and only visit vertices $v > s$, each directed cycle on `mask` is counted once from its canonical minimum vertex (and dividing by 2 handles undirected orientation for $|C| \\ge 3$)."
    }
  ],
  "sos-dp-fast-zeta-mobius": [
    {
      "id": "m17-q05",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "In Sum Over Subsets (SOS) DP (`for i = 0..N-1: for mask = 0..2^N-1: if (mask & (1<<i)) dp[mask] += dp[mask ^ (1<<i)]`), why can we overwrite `dp[mask]` in-place without reading stale or doubly-counted values?",
      "question": "In Sum Over Subsets (SOS) DP (`for i = 0..N-1: for mask = 0..2^N-1: if (mask & (1<<i)) dp[mask] += dp[mask ^ (1<<i)]`), why can we overwrite `dp[mask]` in-place without reading stale or doubly-counted values?",
      "options": [
        "Because in stage $i$, `dp[mask]` with bit $i = 1$ only reads `dp[mask ^ (1 << i)]` where bit $i = 0$, and entries with bit $i = 0$ are never modified during stage $i$",
        "Because addition is idempotent ($x + x = x$)",
        "Because `mask` must be iterated in strictly decreasing order from $2^N - 1$ down to $0$",
        "Because `mask ^ (1 << i)` is always strictly greater than `mask`"
      ],
      "answer": 0,
      "explanation": "During outer iteration $i$, any mask with bit $i = 0$ already holds its final stage-$i$ value from stage $i - 1$ and is never modified in stage $i$. Thus `dp[mask]` (bit $i = 1$) reads the untouched stage-$(i-1)$ value of `dp[mask ^ (1 << i)]` regardless of whether `mask` is looped upwards or downwards."
    },
    {
      "id": "m17-q06",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "For $N = 10$ bits ($2^{10} = 1024$ masks), how many inner-loop additions `dp[mask] += dp[mask ^ (1 << i)]` are executed in total across all $N = 10$ bit dimensions of the Fast Zeta Transform?",
      "question": "For $N = 10$ bits ($2^{10} = 1024$ masks), how many inner-loop additions `dp[mask] += dp[mask ^ (1 << i)]` are executed in total across all $N = 10$ bit dimensions of the Fast Zeta Transform?",
      "answer": 5120,
      "tolerance": 0,
      "explanation": "In each of the $N = 10$ bit dimensions, exactly half of the masks ($2^{N-1} = 512$) have bit $i$ set to $1$ and perform an addition. Total additions $= 10 \\times 512 = 5120$."
    },
    {
      "id": "m17-q07",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "How do you modify the Fast Subset Zeta Transform to compute the **Fast Subset Mobius Transform** (Inclusion-Exclusion over the Boolean lattice, recovering $A[\\text{mask}]$ from $F[\\text{mask}] = \\sum_{\\text{sub} \\subseteq \\text{mask}} A[\\text{sub}]$)?",
      "question": "How do you modify the Fast Subset Zeta Transform to compute the **Fast Subset Mobius Transform** (Inclusion-Exclusion over the Boolean lattice, recovering $A[\\text{mask}]$ from $F[\\text{mask}] = \\sum_{\\text{sub} \\subseteq \\text{mask}} A[\\text{sub}]$)?",
      "options": [
        "Replace `+=` with `-=`: `if (mask & (1 << i)) dp[mask] -= dp[mask ^ (1 << i)];`",
        "Replace `^` with `|` and keep `+=`",
        "Negate every element of `dp` before running the standard Zeta Transform",
        "Run the outer loop $i$ from $N-1$ down to $0$ while keeping `+=`"
      ],
      "answer": 0,
      "explanation": "Each dimension $i$ of the Zeta Transform multiplies by the $2 \\times 2$ matrix $\\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$. Its inverse is $\\begin{pmatrix} 1 & 0 \\\\ -1 & 1 \\end{pmatrix}$, which simply subtracts `dp[mask ^ (1 << i)]` from `dp[mask]` when bit $i$ is $1$."
    },
    {
      "id": "m17-q08",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "You are given an array of $M$ integers $a_1, \\dots, a_M \\in [0, 2^{20}-1]$ and want to count the number of ordered pairs $(x, y)$ whose bitwise AND is zero ($a_x \\mathbin{\\&} a_y = 0$). How does SOS DP solve this in $O(M + N 2^N)$ time ($N = 20$)?",
      "question": "You are given an array of $M$ integers $a_1, \\dots, a_M \\in [0, 2^{20}-1]$ and want to count the number of ordered pairs $(x, y)$ whose bitwise AND is zero ($a_x \\mathbin{\\&} a_y = 0$). How does SOS DP solve this in $O(M + N 2^N)$ time ($N = 20$)?",
      "options": [
        "Build frequency array `freq[v]`, run Subset Zeta Transform to get `F[mask]` (count of elements that are submasks of `mask`), and sum `F[(~a_x) & ((1 << N) - 1)]` over all $x$",
        "Run Superset Zeta Transform on `freq[v]` and sum `G[a_x]` over all $x$",
        "Sort the array and binary search for `~a_x`",
        "Square each entry of `freq[v]` and apply the Fast Mobius Transform"
      ],
      "answer": 0,
      "explanation": "Notice that $a_x \\mathbin{\\&} a_y = 0 \\iff a_y$ is a submask of the bitwise complement $\\sim a_x$. After one Subset Zeta Transform $F[\\text{mask}] = \\sum_{\\text{sub} \\subseteq \\text{mask}} \\text{freq}[\\text{sub}]$, the number of $y$ compatible with $a_x$ is simply $F[(\\sim a_x) \\mathbin{\\&} ((1 \\ll N) - 1)]$."
    }
  ],
  "digit-dp-lexicographic-automata": [
    {
      "id": "m17-q09",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "In Digit DP over a base-10 upper bound string $R$, why must the memoization table only cache states where `tight == false` (or store `tight` carefully if cleared per bound) when a single memo table is shared across `solve(R)` and `solve(L - 1)`?",
      "question": "In Digit DP over a base-10 upper bound string $R$, why must the memoization table only cache states where `tight == false` (or store `tight` carefully if cleared per bound) when a single memo table is shared across `solve(R)` and `solve(L - 1)`?",
      "options": [
        "Because `tight == false` states count suffixes over unconstrained digits $0..9$ and depend only on remaining length and `state`, whereas `tight == true` states depend on the specific digits of the bound string $R$ or $L - 1$",
        "Because `tight == true` states can have infinite cycles in the transition graph",
        "Because `tight == true` states always evaluate to $0$",
        "Because C++ arrays cannot index boolean variables"
      ],
      "answer": 0,
      "explanation": "When `tight == false`, the prefix is already strictly smaller than the bound, so the number of valid $k$-digit completions depends only on $(k, \\text{started}, \\text{state})$ and is identical for any bound string. When `tight == true`, transitions are restricted by `bound[pos]`, which differs between $R$ and $L - 1$."
    },
    {
      "id": "m17-q10",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "In Digit DP for a 18-digit decimal bound $R$, at any fixed position `pos`, how many distinct prefixes of digits `d[0..pos-1]` can arrive at `pos` with `tight == true`?",
      "question": "In Digit DP for a 18-digit decimal bound $R$, at any fixed position `pos`, how many distinct prefixes of digits `d[0..pos-1]` can arrive at `pos` with `tight == true`?",
      "answer": 1,
      "tolerance": 0,
      "explanation": "A prefix has `tight == true` if and only if every single digit chosen at indices $0, 1, \\dots, \\text{pos}-1$ matched $R[0], R[1], \\dots, R[\\text{pos}-1]$ exactly. There is only 1 such prefix!"
    },
    {
      "id": "m17-q11",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "Why is a separate `started` (`is_leading_zero`) boolean flag necessary in Digit DP problems that constrain the digit `0` (such as 'count numbers with no adjacent equal digits' or 'count numbers containing at least one zero')?",
      "question": "Why is a separate `started` (`is_leading_zero`) boolean flag necessary in Digit DP problems that constrain the digit `0` (such as 'count numbers with no adjacent equal digits' or 'count numbers containing at least one zero')?",
      "options": [
        "Because padding shorter numbers with leading zeros (e.g., representing `42` as `0042` against a 4-digit bound) would falsely trigger 'adjacent zeros' or 'contains digit 0' if leading padding zeros were treated as real significant digits",
        "Because `0` is not a valid base-10 digit",
        "Because `tight` cannot be updated when `d == 0`",
        "Because `started` reduces the base $B$ from $10$ to $9$"
      ],
      "answer": 0,
      "explanation": "When matching against an $N$-digit bound $R$, numbers with fewer than $N$ digits are represented with leading zeros. While `started == false`, choosing $d = 0$ extends the leading padding and must not update the automaton state as a real digit `0`."
    },
    {
      "id": "m17-q12",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "You want to count integers $x \\in [1, R]$ ($R \\le 10^{18}$) that are divisible by their own sum of digits ($x \\bmod S(x) == 0$). Since $S(x)$ is only known at the end of the number, how do you design the Digit DP state?",
      "question": "You want to count integers $x \\in [1, R]$ ($R \\le 10^{18}$) that are divisible by their own sum of digits ($x \\bmod S(x) == 0$). Since $S(x)$ is only known at the end of the number, how do you design the Digit DP state?",
      "options": [
        "Observe that $S(x) \\in [1, 9 \\times 18 = 162]$; fix target sum $T \\in [1, 162]$ in an outer loop, and run Digit DP tracking `(pos, cur_sum, rem_mod_T)` Accepting when `cur_sum == T && rem_mod_T == 0`",
        "Store the full 64-bit integer value `x` directly inside the memoization table key",
        "Compute `x mod cur_sum` at each step by updating `rem = (rem * 10 + d) % (cur_sum + d)`",
        "Use SOS DP over the 18 decimal digits"
      ],
      "answer": 0,
      "explanation": "You cannot update `rem % (cur_sum + d)` on the fly because changing the modulus invalidates the modular remainder of previous digits! Because the maximum digit sum for $10^{18}$ is $9 \\times 18 = 162$, fixing the final digit sum $T$ in an outer loop gives a constant modulus $T$ throughout the DP."
    }
  ],
  "broken-profile-dp-grid-tiling": [
    {
      "id": "m17-q13",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "In Broken Profile DP on an $R \\times C$ grid where $R = 8$ and $C = 1000$, why does advancing the DP **cell-by-cell** (`(r, c)` in one step) run in $O(R \\cdot C \\cdot 2^R)$ whereas advancing **column-by-column** via recursive row transitions takes $O(C \\cdot 4^R)$ (or $O(C \\cdot 3^R)$)?",
      "question": "In Broken Profile DP on an $R \\times C$ grid where $R = 8$ and $C = 1000$, why does advancing the DP **cell-by-cell** (`(r, c)` in one step) run in $O(R \\cdot C \\cdot 2^R)$ whereas advancing **column-by-column** via recursive row transitions takes $O(C \\cdot 4^R)$ (or $O(C \\cdot 3^R)$)?",
      "options": [
        "Because moving cell-by-cell changes only 1 boundary bit at a time (at most 2 local choices per `(r, c, mask)`), whereas transitioning a full column at once pairs or enumerates all compatible masks",
        "Because cell-by-cell DP does not use bitmasks at all",
        "Because $R = 8$ is a power of two",
        "Because column-by-column DP requires floating-point arithmetic"
      ],
      "answer": 0,
      "explanation": "In cell-by-cell Broken Profile DP, each of the $R \\times C$ cells processes each of the $2^R$ jagged boundary masks in $O(1)$ time (testing horizontal vs vertical domino placement at cell `(r, c)`), yielding $O(R \\cdot C \\cdot 2^R)$ total operations."
    },
    {
      "id": "m17-q14",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "In how many ways can a $2 \\times 4$ grid be completely tiled using $1 \\times 2$ and $2 \\times 1$ dominoes?",
      "question": "In how many ways can a $2 \\times 4$ grid be completely tiled using $1 \\times 2$ and $2 \\times 1$ dominoes?",
      "answer": 5,
      "tolerance": 0,
      "explanation": "For a $2 \\times n$ grid, the number of domino tilings is the Fibonacci number $F_{n+1}$: $F_1 = 1, F_2 = 1, F_3 = 2, F_4 = 3, F_5 = 5$."
    },
    {
      "id": "m17-q15",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "In Broken Profile domino tiling when processing cell $(r, c)$ with profile `mask`, suppose bit $r$ of `mask` is $0$ (cell $(r, c)$ is not yet covered by a horizontal domino from column $c - 1$). When is placing a **vertical domino** covering $(r, c)$ and $(r+1, c)$ valid, and what is the resulting `next_mask`?",
      "question": "In Broken Profile domino tiling when processing cell $(r, c)$ with profile `mask`, suppose bit $r$ of `mask` is $0$ (cell $(r, c)$ is not yet covered by a horizontal domino from column $c - 1$). When is placing a **vertical domino** covering $(r, c)$ and $(r+1, c)$ valid, and what is the resulting `next_mask`?",
      "options": [
        "Valid when $r + 1 < R$ and bit $(r+1)$ of `mask` is $0$ (meaning $(r+1, c-1)$ did not protrude into $(r+1, c)$); `next_mask = mask | (1 << (r + 1))`",
        "Valid for any $r < R$; `next_mask = mask ^ (1 << r)`",
        "Valid when bit $(r+1)$ of `mask` is $1$; `next_mask = mask & ~(1 << (r + 1))`",
        "Valid only when $c + 1 < C$; `next_mask = mask | (1 << r)`"
      ],
      "answer": 0,
      "explanation": "A vertical domino covers $(r, c)$ and $(r+1, c)$. For $(r+1, c)$ to be free, the horizontal protrusion from $(r+1, c-1)$ (stored in bit $r+1$ of `mask`) must be $0$. Setting bit $r+1$ to $1$ in `next_mask` tells the next step $(r+1, c)$ that cell $(r+1, c)$ is already occupied."
    },
    {
      "id": "m17-q16",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "Why does counting Single-Cycle Hamiltonian Tours on a grid (Plug DP) require a base-3 or base-4 profile encoding (tracking parenthesis matching `(` and `)` of path endpoints) instead of a simple 1-bit boolean mask?",
      "question": "Why does counting Single-Cycle Hamiltonian Tours on a grid (Plug DP) require a base-3 or base-4 profile encoding (tracking parenthesis matching `(` and `)` of path endpoints) instead of a simple 1-bit boolean mask?",
      "options": [
        "Because locally valid degree-2 connections can close premature disjoint sub-cycles unless we track which profile plugs belong to the same connected path component",
        "Because grid edges have weights in $\\{0, 1, 2, 3\\}$",
        "Because Hamiltonian paths can visit each grid cell up to 3 times",
        "Because bitwise XOR does not work on odd grid dimensions"
      ],
      "answer": 0,
      "explanation": "A 1-bit mask only knows whether an edge crosses the profile boundary, not which two boundary edges are connected to each other on the left side of the cut. Because planar paths cannot cross, active path endpoints along the cut form a balanced parenthesis string (`0` = empty, `1` = `(`, `2` = `)`), allowing Plug DP to forbid joining `(` with its matching `)` until the very last cell."
    }
  ],
  "divide-and-conquer-dp-quadrangle": [
    {
      "id": "m17-q17",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "What algebraic property on the cost function $C(j, i)$ is the canonical sufficient condition for decision monotonicity $opt[k][i] \\le opt[k][i+1]$ in Divide-and-Conquer DP ($dp[k][i] = \\min_{j < i} (dp[k-1][j] + C(j, i))$)?",
      "question": "What algebraic property on the cost function $C(j, i)$ is the canonical sufficient condition for decision monotonicity $opt[k][i] \\le opt[k][i+1]$ in Divide-and-Conquer DP ($dp[k][i] = \\min_{j < i} (dp[k-1][j] + C(j, i))$)?",
      "options": [
        "The Quadrangle Inequality (Monge property): $C(a, c) + C(b, d) \\le C(a, d) + C(b, c)$ for all $a \\le b \\le c \\le d$",
        "Subadditivity: $C(a, c) \\le C(a, b) + C(b, c)$",
        "Symmetry: $C(j, i) = C(i, j)$",
        "Periodicity: $C(j + k, i + k) = C(j, i)$"
      ],
      "answer": 0,
      "explanation": "The Quadrangle Inequality states that nested or crossing intervals cost at least as much as separated intervals: $C(a, c) + C(b, d) \\le C(a, d) + C(b, c)$. Summing this with the optimality of $b = opt[k][c]$ proves that no $a < b$ can strictly beat $b$ at $d > c$."
    },
    {
      "id": "m17-q18",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "In one layer of Divide-and-Conquer DP over $N = 8$ indices $[1..8]$ with candidate decision range $[1..8]$, the root call computes `mid = 4` and finds `opt[4] = 3`. What is the sum of the number of candidate decisions evaluated in the immediate left child call `solve(1, 3, ...)` at `mid_left = 2` and the immediate right child call `solve(5, 8, ...)` at `mid_right = 6` (ignoring the $k < i$ clamp)?",
      "question": "In one layer of Divide-and-Conquer DP over $N = 8$ indices $[1..8]$ with candidate decision range $[1..8]$, the root call computes `mid = 4` and finds `opt[4] = 3`. What is the sum of the number of candidate decisions evaluated in the immediate left child call `solve(1, 3, ...)` at `mid_left = 2` and the immediate right child call `solve(5, 8, ...)` at `mid_right = 6` (ignoring the $k < i$ clamp)?",
      "answer": 9,
      "tolerance": 0,
      "explanation": "The left child receives decision bounds $[1, opt[4]] = [1, 3]$ ($3 - 1 + 1 = 3$ candidates), and the right child receives decision bounds $[opt[4], 8] = [3, 8]$ ($8 - 3 + 1 = 6$ candidates). Their sum is $3 + 6 = 9$ (note how only endpoint $opt[4] = 3$ is shared)."
    },
    {
      "id": "m17-q19",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "Suppose the cost function $C(j, i)$ in Divide-and-Conquer DP cannot be queried in $O(1)$ via prefix sums (for example, $C(j, i)$ is the number of pairs of equal elements inside subarray $A[j+1..i]$). How can you still achieve $O(K N \\log N)$ total time without Mo's $O(\\sqrt{N})$ overhead?",
      "question": "Suppose the cost function $C(j, i)$ in Divide-and-Conquer DP cannot be queried in $O(1)$ via prefix sums (for example, $C(j, i)$ is the number of pairs of equal elements inside subarray $A[j+1..i]$). How can you still achieve $O(K N \\log N)$ total time without Mo's $O(\\sqrt{N})$ overhead?",
      "options": [
        "Maintain a global sliding window `[cur_L, cur_R]` inside the D&C recursion; since decision intervals across each recursion depth are nearly disjoint, the endpoints `cur_L` and `cur_R` move at most $O(N)$ times per depth ($O(N \\log N)$ per layer)",
        "Precompute the full $N \\times N$ cost matrix $C[j][i]$ in $O(N^2)$ memory",
        "Use a Fenwick tree inside the inner loop for $O(K N \\log^2 N)$",
        "Replace D&C DP with Matrix Exponentiation"
      ],
      "answer": 0,
      "explanation": "At each of the $\\lceil \\log_2 N \\rceil$ levels of the recursion tree, both the state midpoints `mid` and the decision intervals `[opt_l, opt_r]` partition $[1, N]$. Advancing a two-pointer window `[cur_L, cur_R]` incrementally across the recursion moves the pointers $O(N)$ total steps per depth."
    },
    {
      "id": "m17-q20",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "Why does standard Divide-and-Conquer DP fail if applied directly to a 1D self-dependent recurrence $dp[i] = \\min_{j < i} (dp[j] + C(j, i))$ where `dp` has only a single layer?",
      "question": "Why does standard Divide-and-Conquer DP fail if applied directly to a 1D self-dependent recurrence $dp[i] = \\min_{j < i} (dp[j] + C(j, i))$ where `dp` has only a single layer?",
      "options": [
        "Because `solve(l, r)` evaluates `dp[mid]` first, before `dp[l..mid-1]` have been computed, so transitions from $j \\in [l, mid-1]$ into `dp[mid]` would read uncomputed `INF` values (requires CDQ Divide-and-Conquer instead)",
        "Because 1D arrays cannot satisfy the Quadrangle Inequality",
        "Because `opt[i]` is non-increasing instead of non-decreasing in 1D",
        "Because recursion depth exceeds $O(\\log N)$ in 1D"
      ],
      "answer": 0,
      "explanation": "Standard D&C DP computes `dp_cur[mid]` before recursing on `[l, mid-1]`, which is valid only when `dp_cur[mid]` reads from an already-completed previous layer `dp_prev[j]`. For 1D self-dependent recurrences, CDQ Divide-and-Conquer solves `[l, mid]` completely first, then uses D&C DP to transfer contributions from $j \\in [l, mid]$ to $i \\in [mid+1, r]$."
    }
  ],
  "knuth-optimization-optimal-bst": [
    {
      "id": "m17-q21",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "For the interval DP recurrence $dp[i][j] = C(i, j) + \\min_{i \\le k < j} (dp[i][k] + dp[k+1][j])$, what double inequality bounds the optimal split point $opt[i][j]$ under Knuth-Yao Optimization?",
      "question": "For the interval DP recurrence $dp[i][j] = C(i, j) + \\min_{i \\le k < j} (dp[i][k] + dp[k+1][j])$, what double inequality bounds the optimal split point $opt[i][j]$ under Knuth-Yao Optimization?",
      "options": [
        "$opt[i][j-1] \\le opt[i][j] \\le opt[i+1][j]$",
        "$opt[i+1][j] \\le opt[i][j] \\le opt[i][j-1]$",
        "$opt[i][j/2] \\le opt[i][j] \\le opt[j/2][j]$",
        "$i \\le opt[i][j] \\le (i + j) / 2$"
      ],
      "answer": 0,
      "explanation": "Extending `[i, j-1]` rightward to `[i, j]` cannot move the optimal split left ($opt[i][j-1] \\le opt[i][j]$), and extending `[i+1, j]` leftward to `[i, j]` cannot move the optimal split right ($opt[i][j] \\le opt[i+1][j]$)."
    },
    {
      "id": "m17-q22",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "In Knuth's Optimization for $N = 10$, suppose at interval length $L = 3$ the already-computed optimal split points for length $L - 1 = 2$ are $opt[1][3] = 1, opt[2][4] = 2, opt[3][5] = 4, opt[4][6] = 5$. When computing $dp[1][4], dp[2][5], dp[3][6]$ using the loop `k` from `opt[i][j-1]` to `opt[i+1][j]`, how many total inner-loop iterations of `k` are executed across those three states combined?",
      "question": "In Knuth's Optimization for $N = 10$, suppose at interval length $L = 3$ the already-computed optimal split points for length $L - 1 = 2$ are $opt[1][3] = 1, opt[2][4] = 2, opt[3][5] = 4, opt[4][6] = 5$. When computing $dp[1][4], dp[2][5], dp[3][6]$ using the loop `k` from `opt[i][j-1]` to `opt[i+1][j]`, how many total inner-loop iterations of `k` are executed across those three states combined?",
      "answer": 7,
      "tolerance": 0,
      "explanation": "For `(1, 4)`: $k \\in [opt[1][3], opt[2][4]] = [1, 2]$ (2 iterations). For `(2, 5)`: $k \\in [opt[2][4], opt[3][5]] = [2, 4]$ (3 iterations). For `(3, 6)`: $k \\in [opt[3][5], opt[4][6]] = [4, 5]$ (2 iterations). Total $= 2 + 3 + 2 = 7 = (opt[4][6] - opt[1][3]) + 3$, demonstrating the telescoping sum!"
    },
    {
      "id": "m17-q23",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "Besides the Quadrangle Inequality $C(a, c) + C(b, d) \\le C(a, d) + C(b, c)$, what second condition on $C(i, j)$ is required by Yao's Theorem for Knuth's Optimization to hold?",
      "question": "Besides the Quadrangle Inequality $C(a, c) + C(b, d) \\le C(a, d) + C(b, c)$, what second condition on $C(i, j)$ is required by Yao's Theorem for Knuth's Optimization to hold?",
      "options": [
        "Interval containment monotonicity: $C(b, c) \\le C(a, d)$ whenever $[b, c] \\subseteq [a, d]$ (i.e., $a \\le b \\le c \\le d$)",
        "Strict concavity: $C(a, d) < C(a, b) + C(b, d)$",
        "Zero diagonal derivative: $C(i, i+1) = 0$",
        "Multiplicative separability: $C(i, j) = f(i) \\cdot g(j)$"
      ],
      "answer": 0,
      "explanation": "Yao (1980) proved that when $C(i, j)$ satisfies both the Quadrangle Inequality and interval containment monotonicity ($C(b, c) \\le C(a, d)$ for $[b, c] \\subseteq [a, d]$), the DP table $dp[i][j]$ itself inherits the Quadrangle Inequality, which implies $opt[i][j-1] \\le opt[i][j] \\le opt[i+1][j]$."
    },
    {
      "id": "m17-q24",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "Why does Knuth's Optimization produce wrong answers if applied to the classical Matrix Chain Multiplication recurrence $dp[i][j] = \\min_{i \\le k < j} (dp[i][k] + dp[k+1][j] + p_i p_{k+1} p_{j+1})$?",
      "question": "Why does Knuth's Optimization produce wrong answers if applied to the classical Matrix Chain Multiplication recurrence $dp[i][j] = \\min_{i \\le k < j} (dp[i][k] + dp[k+1][j] + p_i p_{k+1} p_{j+1})$?",
      "options": [
        "Because the merge cost $p_i p_{k+1} p_{j+1}$ depends on the split index $k$ (not solely on the interval endpoints $i, j$) and violates interval monotonicity when inner dimensions fluctuate",
        "Because Matrix Chain Multiplication requires maximizing rather than minimizing",
        "Because matrix multiplication is not associative",
        "Because $p_i p_{k+1} p_{j+1}$ overflows 32-bit integers"
      ],
      "answer": 0,
      "explanation": "Knuth's Optimization requires the merge cost $C(i, j)$ to be independent of $k$ and monotonic under interval inclusion. In Matrix Chain Multiplication, a tiny intermediate dimension $p_{k+1} = 1$ can make a specific split $k$ globally optimal regardless of interval shifts, violating $opt[i][j-1] \\le opt[i][j] \\le opt[i+1][j]$."
    }
  ],
  "convex-hull-trick-li-chao-tree": [
    {
      "id": "m17-q25",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "In a Li Chao Segment Tree covering coordinate interval $[L, R]$ with midpoint $M = \\lfloor(L+R)/2\\rfloor$, why does inserting a new line `nw` against the current node's line `seg` recurse into **at most one** child?",
      "question": "In a Li Chao Segment Tree covering coordinate interval $[L, R]$ with midpoint $M = \\lfloor(L+R)/2\\rfloor$, why does inserting a new line `nw` against the current node's line `seg` recurse into **at most one** child?",
      "options": [
        "After ensuring `seg` is the better line at midpoint $M$, the two distinct lines `nw` and `seg` can intersect at most once, so `nw` can beat `seg` on either $[L, M]$ or $[M+1, R]$, never both",
        "Because lines with negative slopes always go to the left child and positive slopes go to the right child",
        "Because a Li Chao Tree only answers queries at powers of two",
        "Because the right child is deleted whenever a swap occurs at $M$"
      ],
      "answer": 0,
      "explanation": "Two linear functions $y = m_1 x + b_1$ and $y = m_2 x + b_2$ cross at most once. Since `seg` wins at $M$, `nw` can cross and beat `seg` either to the left of $M$ (detected by `nw(L) < seg(L)`) or to the right of $M$ (detected by `nw(R) < seg(R)`), never on both sides!"
    },
    {
      "id": "m17-q26",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "Consider the DP transition $dp[i] = \\min_{j < i} (dp[j] + (h_i - h_j)^2) + C$. When factored into the Convex Hull Trick form $dp[i] = h_i^2 + C + \\min_{j < i} (m_j \\cdot h_i + b_j)$, what is the slope $m_j$ of the line corresponding to state $j$ when $h_j = 7$?",
      "question": "Consider the DP transition $dp[i] = \\min_{j < i} (dp[j] + (h_i - h_j)^2) + C$. When factored into the Convex Hull Trick form $dp[i] = h_i^2 + C + \\min_{j < i} (m_j \\cdot h_i + b_j)$, what is the slope $m_j$ of the line corresponding to state $j$ when $h_j = 7$?",
      "answer": -14,
      "tolerance": 0,
      "explanation": "Expanding $(h_i - h_j)^2 = h_i^2 - 2 h_j h_i + h_j^2$ gives $m_j = -2 h_j$ and $b_j = dp[j] + h_j^2$. For $h_j = 7$, the slope is $m_j = -2(7) = -14$."
    },
    {
      "id": "m17-q27",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "In a Monotonic Deque Convex Hull Trick with strictly decreasing slopes $m_1 > m_2 > m_3$ (for minimum queries), what is the exact division-free condition under which middle line $L_2$ is redundant and popped from the back of the hull?",
      "question": "In a Monotonic Deque Convex Hull Trick with strictly decreasing slopes $m_1 > m_2 > m_3$ (for minimum queries), what is the exact division-free condition under which middle line $L_2$ is redundant and popped from the back of the hull?",
      "options": [
        "`(__int128)(b3 - b1) * (m1 - m2) <= (__int128)(b2 - b1) * (m1 - m3)`",
        "`(__int128)(b3 - b1) * (m1 - m3) <= (__int128)(b2 - b1) * (m1 - m2)`",
        "`b2 >= b1 && b2 >= b3`",
        "`m2 * b1 == m1 * b2`"
      ],
      "answer": 0,
      "explanation": "Line $L_2$ is redundant iff the intersection $x(L_1, L_3) = \\frac{b_3 - b_1}{m_1 - m_3}$ is $\\le x(L_1, L_2) = \\frac{b_2 - b_1}{m_1 - m_2}$. Since $m_1 - m_3 > 0$ and $m_1 - m_2 > 0$, cross-multiplying preserves the inequality direction: $(b_3 - b_1)(m_1 - m_2) \\le (b_2 - b_1)(m_1 - m_3)$."
    },
    {
      "id": "m17-q28",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "In a Dynamic Implicit Li Chao Tree backed by `std::vector<Node> pool_`, why does the statement `pool_[u].left = new_node();` cause intermittent segmentation faults or silent memory corruption in C++?",
      "question": "In a Dynamic Implicit Li Chao Tree backed by `std::vector<Node> pool_`, why does the statement `pool_[u].left = new_node();` cause intermittent segmentation faults or silent memory corruption in C++?",
      "options": [
        "The reference `pool_[u].left` can be evaluated before `new_node()` calls `pool_.push_back()`, which may reallocate `pool_`'s buffer and leave the LHS writing into freed memory",
        "`std::vector::push_back` zeroes out all existing elements in `pool_`",
        "Implicit segment trees cannot use 0-based root indexing",
        "Bitwise shifts inside `new_node()` overflow 32-bit signed integers"
      ],
      "answer": 0,
      "explanation": "Even in C++17/C++20 (where the RHS of `=` is sequenced before the LHS), if an expression or helper indexes `pool_[u]` before a `push_back()` reallocates the vector buffer, any held reference/pointer into `pool_` dangles. Capturing `int c = new_node(); pool_[u].left = c;` guarantees `pool_[u]` is resolved after reallocation."
    }
  ],
  "aliens-trick-wqs-binary-search": [
    {
      "id": "m17-q29",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "What fundamental mathematical property of $f(k)$ (the optimal cost using exactly $k$ items/groups) is required for WQS Binary Search (Aliens Trick / Lagrangian Relaxation) to find $f(K)$?",
      "question": "What fundamental mathematical property of $f(k)$ (the optimal cost using exactly $k$ items/groups) is required for WQS Binary Search (Aliens Trick / Lagrangian Relaxation) to find $f(K)$?",
      "options": [
        "$f(k)$ must be convex (for minimization: $f(k) - f(k-1) \\le f(k+1) - f(k)$) or concave (for maximization) so that every $(k, f(k))$ lies on the lower/upper convex hull",
        "$f(k)$ must be strictly decreasing and positive for all $k$",
        "$f(k)$ must be a polynomial of degree at most 2",
        "$f(k)$ must be periodic modulo $K$"
      ],
      "answer": 0,
      "explanation": "Lagrangian Relaxation minimizes $f(k) + \\lambda k$, which finds points on the lower convex envelope of $(k, f(k))$ supported by a line of slope $-\\lambda$. This touches $(K, f(K))$ if and only if $f(k)$ is convex."
    },
    {
      "id": "m17-q30",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "Suppose a convex minimization problem has exact costs $f(1) = 20, f(2) = 12, f(3) = 9, f(4) = 6, f(5) = 5$. Notice $(2, 12), (3, 9), (4, 6)$ are collinear with slope $-3$. At penalty $\\lambda^* = 3$, the unconstrained DP with minimum-count tie-breaking returns `cost = f(2) + 3 * 2 = 18` and `count = 2`. If our target is $K = 3$, what value does the WQS reconstruction formula `cost - lambda* * K` produce?",
      "question": "Suppose a convex minimization problem has exact costs $f(1) = 20, f(2) = 12, f(3) = 9, f(4) = 6, f(5) = 5$. Notice $(2, 12), (3, 9), (4, 6)$ are collinear with slope $-3$. At penalty $\\lambda^* = 3$, the unconstrained DP with minimum-count tie-breaking returns `cost = f(2) + 3 * 2 = 18` and `count = 2`. If our target is $K = 3$, what value does the WQS reconstruction formula `cost - lambda* * K` produce?",
      "answer": 9,
      "tolerance": 0,
      "explanation": "Using `cost - lambda* * K` gives $18 - 3 \\times 3 = 9$, which equals the exact value $f(3) = 9$! Had we erroneously subtracted `lambda* * count` ($18 - 3 \\times 2 = 12$), we would have recovered $f(2)$ instead of $f(3)$."
    },
    {
      "id": "m17-q31",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "In WQS Binary Search for a minimization problem where we pay $+\\lambda$ per chosen segment, suppose our unconstrained 1D DP at penalty `mid` uses `res.count > K` segments. How should we adjust the binary search bounds `[lo, hi]`?",
      "question": "In WQS Binary Search for a minimization problem where we pay $+\\lambda$ per chosen segment, suppose our unconstrained 1D DP at penalty `mid` uses `res.count > K` segments. How should we adjust the binary search bounds `[lo, hi]`?",
      "options": [
        "Segments are currently too cheap, so we must increase the penalty: set `lo = mid + 1`",
        "Segments are currently too expensive, so we must decrease the penalty: set `hi = mid - 1`",
        "Terminate immediately because `res.count > K` is impossible",
        "Negate `mid` and restart the DP"
      ],
      "answer": 0,
      "explanation": "As the per-segment toll $\\lambda$ increases, opening additional segments becomes less attractive, so the optimal segment count $k(\\lambda)$ is monotonically non-increasing in $\\lambda$. When `res.count > K`, we need a larger toll $\\lambda$, so `lo = mid + 1`."
    },
    {
      "id": "m17-q32",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "When all input weights in a WQS Binary Search problem are integers, why is it always sufficient to binary search $\\lambda$ over **integers** (`int64_t`) rather than floating-point numbers (`double` / `long double`)?",
      "question": "When all input weights in a WQS Binary Search problem are integers, why is it always sufficient to binary search $\\lambda$ over **integers** (`int64_t`) rather than floating-point numbers (`double` / `long double`)?",
      "options": [
        "Because the discrete slopes $\\Delta(k) = f(k) - f(k-1)$ between adjacent integer points $(k-1, f(k-1))$ and $(k, f(k))$ on the convex hull are always integers: $f(k)$ is an integer for every integer $k$",
        "Because IEEE-754 `double` cannot represent negative slopes",
        "Because `int64_t` division automatically rounds to the nearest convex hull vertex",
        "Because collinear points cannot occur when weights are integers"
      ],
      "answer": 0,
      "explanation": "For any discrete convex function $f: \\mathbb{Z} \\to \\mathbb{Z}$, the marginal difference $\\Delta(k) = f(k) - f(k-1)$ is an integer minus an integer, hence an integer! Thus the supporting slope $-\\lambda^* = \\Delta(K)$ separating $K-1$ and $K$ is always an integer."
    }
  ],
  "matrix-exponentiation-linear-recurrences": [
    {
      "id": "m17-q33",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "In the Tropical Min-Plus Semiring $(\\min, +)$ used for finding minimum-weight walks of exactly $N$ edges via matrix exponentiation, how must the $K \\times K$ identity matrix $I$ be initialized?",
      "question": "In the Tropical Min-Plus Semiring $(\\min, +)$ used for finding minimum-weight walks of exactly $N$ edges via matrix exponentiation, how must the $K \\times K$ identity matrix $I$ be initialized?",
      "options": [
        "$I_{i,i} = 0$ on the main diagonal and $I_{i,j} = +\\infty$ for all $i \\ne j$",
        "$I_{i,i} = 1$ on the main diagonal and $I_{i,j} = 0$ for all $i \\ne j$",
        "$I_{i,j} = 0$ for all $(i, j)$",
        "$I_{i,i} = +\\infty$ on the main diagonal and $I_{i,j} = 0$ for all $i \\ne j$"
      ],
      "answer": 0,
      "explanation": "In $(\\min, +)$, the additive operation is $\\min$ (identity $+\\infty$) and the multiplicative operation is $+$ (identity $0$). A walk of $0$ edges has cost $0$ to stay at the same vertex ($i = j$) and $+\\infty$ (impossible) to reach any other vertex ($i \\ne j$)."
    },
    {
      "id": "m17-q34",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "To accelerate the recurrence $f(n) = 2 f(n-1) + 3 f(n-2) + 5 f(n-3) + 7 n + 11$ using matrix exponentiation, what is the minimum dimension $K$ of the state vector $[f(n-1), f(n-2), f(n-3), n, 1]^T$?",
      "question": "To accelerate the recurrence $f(n) = 2 f(n-1) + 3 f(n-2) + 5 f(n-3) + 7 n + 11$ using matrix exponentiation, what is the minimum dimension $K$ of the state vector $[f(n-1), f(n-2), f(n-3), n, 1]^T$?",
      "answer": 5,
      "tolerance": 0,
      "explanation": "We need 3 states for the order-3 homogeneous terms $f(n-1), f(n-2), f(n-3)$ plus 2 states for the degree-1 polynomial inhomogeneous terms $n$ and $1$, giving $K = 3 + 2 = 5$."
    },
    {
      "id": "m17-q35",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "You have a fixed transition matrix $T$ of size $K \\times K$ ($K = 100$) and need to answer $Q = 10{,}000$ independent queries, where query $q$ asks for the DP state after $N_q \\le 10^{18}$ steps. Computing $T^{N_q}$ per query takes $O(Q K^3 \\log N)$ ($\\approx 6 \\times 10^{11}$ ops, TLE). How do you reduce this to $O((K^3 + Q K^2) \\log N)$?",
      "question": "You have a fixed transition matrix $T$ of size $K \\times K$ ($K = 100$) and need to answer $Q = 10{,}000$ independent queries, where query $q$ asks for the DP state after $N_q \\le 10^{18}$ steps. Computing $T^{N_q}$ per query takes $O(Q K^3 \\log N)$ ($\\approx 6 \\times 10^{11}$ ops, TLE). How do you reduce this to $O((K^3 + Q K^2) \\log N)$?",
      "options": [
        "Precompute the 60 power-of-two matrices $P_b = T^{2^b}$ once in $O(K^3 \\log N)$; then for each query $N_q$, multiply the $1 \\times K$ state vector $v$ by $P_b$ for each set bit $b$ of $N_q$, which takes $O(K^2)$ per bit ($O(K^2 \\log N_q)$ per query)",
        "Diagonalize $T$ over `int64_t` using integer eigenvalues",
        "Use Strassen's algorithm down to $1 \\times 1$ matrices",
        "Store all $10^{18}$ powers of $T$ in a hash table"
      ],
      "answer": 0,
      "explanation": "Multiplying two $K \\times K$ matrices takes $O(K^3)$, whereas multiplying a $K \\times K$ matrix by a $K \\times 1$ state vector takes only $O(K^2)$! Precomputing $T^{2^b}$ once lets each query apply at most $60$ matrix-vector products in $60 \\times 100^2 = 6 \\times 10^5$ operations."
    },
    {
      "id": "m17-q36",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "Why does permuting the triple nested loop of matrix multiplication from textbook `i-j-k` to `i-k-j` yield a 4x–8x wall-clock speedup in C++?",
      "question": "Why does permuting the triple nested loop of matrix multiplication from textbook `i-j-k` to `i-k-j` yield a 4x–8x wall-clock speedup in C++?",
      "options": [
        "In `i-k-j`, the inner loop over `j` accesses both `C[i][j]` and `B[k][j]` with unit stride (sequentially across a contiguous row), maximizing L1 cache line utilization and enabling SIMD vectorization",
        "Because `i-k-j` executes $O(K^2)$ iterations instead of $O(K^3)$",
        "Because `i-k-j` avoids integer addition overflow",
        "Because C++ stores arrays in column-major order like Fortran"
      ],
      "answer": 0,
      "explanation": "C++ uses row-major order. In `i-j-k`, `B[k][j]` steps down column `j` with stride $K$, causing a cache miss on almost every read when $K$ is large. In `i-k-j`, `A[i][k]` is invariant across the inner `j` loop, and both `B[k][j]` and `C[i][j]` stream contiguously with stride 1."
    }
  ],
  "build-li-chao-convex-hull-dp": [
    {
      "id": "m17-q37",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "When inserting a domain-restricted line segment $y = m x + b$ valid only on $x \\in [x_L, x_R]$ into a Li Chao Segment Tree over $[-X, X]$, what is the worst-case time complexity of a single segment insertion?",
      "question": "When inserting a domain-restricted line segment $y = m x + b$ valid only on $x \\in [x_L, x_R]$ into a Li Chao Segment Tree over $[-X, X]$, what is the worst-case time complexity of a single segment insertion?",
      "options": [
        "$O(\\log^2 X)$ — the range $[x_L, x_R]$ decomposes into $O(\\log X)$ canonical segment tree nodes, and pushing the line into each canonical node takes $O(\\log X)$",
        "$O(\\log X)$ — identical to global line insertion",
        "$O(X)$ — every leaf in $[x_L, x_R]$ must be visited",
        "$O(1)$ amortized"
      ],
      "answer": 0,
      "explanation": "Standard segment tree range decomposition splits $[x_L, x_R]$ into at most $2 \\lceil \\log_2(2X) \\rceil$ canonical subtrees. At each canonical subtree root, `push_line` descends at most $O(\\log X)$ levels, giving $O(\\log^2 X)$ total time."
    },
    {
      "id": "m17-q38",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "Consider three lines inserted into a minimization Monotonic Deque CHT: $L_1(x) = -2x + 10$, $L_2(x) = -4x + 16$, and $L_3(x) = -6x + 20$. At $x = 3$, what is the minimum value $\\min(L_1(3), L_2(3), L_3(3))$?",
      "question": "Consider three lines inserted into a minimization Monotonic Deque CHT: $L_1(x) = -2x + 10$, $L_2(x) = -4x + 16$, and $L_3(x) = -6x + 20$. At $x = 3$, what is the minimum value $\\min(L_1(3), L_2(3), L_3(3))$?",
      "answer": 2,
      "tolerance": 0,
      "explanation": "$L_1(3) = -2(3) + 10 = 4$; $L_2(3) = -4(3) + 16 = 4$; $L_3(3) = -6(3) + 20 = 2$. Note that $L_1$ and $L_2$ intersect at $x = 3$, whereas $L_1$ and $L_3$ intersect at $x = 2.5 < 3$, making $L_2$ completely redundant on the lower envelope!"
    },
    {
      "id": "m17-q39",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "In `MonotonicDequeCHT::insert_line(m, b)`, what happens if two consecutive inserted lines have the **exact same slope** (`hull_.back().m == m`) and you do NOT handle equal slopes before calling `is_redundant(l1, l2, nw)`?",
      "question": "In `MonotonicDequeCHT::insert_line(m, b)`, what happens if two consecutive inserted lines have the **exact same slope** (`hull_.back().m == m`) and you do NOT handle equal slopes before calling `is_redundant(l1, l2, nw)`?",
      "options": [
        "In `is_redundant(l1, l2, nw)`, `(l1.m - l2.m)` or `(l2.m - nw.m)` equals zero, causing a zero-denominator cross-product that can leave a strictly worse parallel line on the hull or fail to pop a dominated line",
        "The compiler throws a hardware `SIGFPE` divide-by-zero exception inside `__int128` multiplication",
        "The deque automatically sorts equal slopes by intercept",
        "The query complexity degrades to $O(N^2)$"
      ],
      "answer": 0,
      "explanation": "Two parallel lines do not intersect in $\\mathbb{R}$. Cross-multiplying by $(m_2 - m_3) = 0$ collapses one side of the inequality to $0$ regardless of the intercepts. Explicitly checking `hull_.back().m == m` (ignoring if $b \\ge \\text{back.b}$, or popping `back` if $b < \\text{back.b}$) eliminates parallel lines cleanly."
    },
    {
      "id": "m17-q40",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "You are optimizing a tree DP where for each node $u$, $dp[u] = \\min_{v \\in \\text{subtree}(u)} (m_v \\cdot x_u + b_v)$. How can you merge the lower envelopes of $u$'s children to compute $dp[u]$ for all nodes in $O(N \\log N \\log X)$ total time?",
      "question": "You are optimizing a tree DP where for each node $u$, $dp[u] = \\min_{v \\in \\text{subtree}(u)} (m_v \\cdot x_u + b_v)$. How can you merge the lower envelopes of $u$'s children to compute $dp[u]$ for all nodes in $O(N \\log N \\log X)$ total time?",
      "options": [
        "Maintain a Dynamic Implicit Li Chao Tree at each node and apply Small-to-Large (DSU on Tree) merging: swap the largest child's Li Chao Tree into $u$ and insert the lines from all smaller children into it",
        "Rebuild a Monotonic Deque CHT from scratch at every node in $O(N^2)$",
        "Use Knuth's Optimization on the Euler tour of the tree",
        "Run WQS Binary Search on the tree depth"
      ],
      "answer": 0,
      "explanation": "With DSU on Tree (Small-to-Large merging), each node's line $(m_v, b_v)$ is moved into a larger Li Chao Tree at most $O(\\log N)$ times along its path to the root. Since each Li Chao insertion takes $O(\\log X)$, total time across the entire tree is $O(N \\log N \\log X)$."
    }
  ]
});
