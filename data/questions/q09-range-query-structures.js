window.QUESTION_BANK = window.QUESTION_BANK || {};

window.QUESTION_BANK["static-range-queries-sparse-table"] = [
  {
    id: "q-st-1",
    type: "mcq",
    difficulty: "recall",
    title: "Algebraic Requirement for O(1) Overlapping Sparse Table Queries",
    prompt: "A Standard Sparse Table answers a range query on $[L, R]$ in $O(1)$ time by computing $\\text{st}[k][L] \\oplus \\text{st}[k][R - 2^k + 1]$ where $k = \\lfloor \\log_2(R - L + 1) \\rfloor$. Which algebraic property of the binary operation $\\oplus$ is required for this overlapping lookup to be valid?",
    question: "Select the exact algebraic property required for two overlapping intervals of length $2^k$ to produce the exact aggregate of $[L, R]$:",
    options: [
      "Associativity and Idempotence (x op x = x), as satisfied by min, max, gcd, lcm, bitwise OR, and bitwise AND",
      "Invertibility (existence of an inverse element x^{-1}), as satisfied by addition and XOR",
      "Distributivity over multiplication",
      "Strict commutativity without idempotence, as satisfied by modular addition"
    ],
    answer: 0,
    explanation: "When R - L + 1 is not a power of two, the two intervals [L, L + 2^k - 1] and [R - 2^k + 1, R] overlap in the middle region [R - 2^k + 1, L + 2^k - 1]. For the combined result to equal the aggregate over [L, R] without double-counting the overlap, the associative operation must be idempotent (x op x = x)."
  },
  {
    id: "q-st-2",
    type: "mcq",
    difficulty: "apply",
    title: "Exact Indices for an O(1) RMQ Sparse Table Lookup",
    prompt: "Suppose you have built a Sparse Table $\\text{st}[k][i]$ (where $\\text{st}[k][i] = \\min(A[i \\dots i + 2^k - 1])$) on an array $A[0..19]$. You want to answer $\\text{RMQ}(3, 14)$ (inclusive).",
    question: "What are the exact values of $k$ and the two table entries combined to answer $\\text{RMQ}(3, 14)$?",
    options: [
      "k = 3 (since 2^3 = 8 <= 12 < 16), combining st[3][3] (covering [3..10]) and st[3][7] (covering [7..14])",
      "k = 4 (since 2^4 = 16), combining st[4][3] and st[4][14]",
      "k = 2 (since 2^2 = 4), combining st[2][3] and st[2][11]",
      "k = 3, combining st[3][3] and st[3][11]"
    ],
    answer: 0,
    explanation: "The query length is len = 14 - 3 + 1 = 12. The largest power of two <= 12 is 2^3 = 8, so k = floor(log2(12)) = 3. The left block starts at L = 3 (st[3][3], covering [3, 3+8-1] = [3..10]), and the right block starts at R - 2^k + 1 = 14 - 8 + 1 = 7 (st[3][7], covering [7..14]). Their union is [3..10] U [7..14] = [3..14]."
  },
  {
    id: "q-st-3",
    type: "mcq",
    difficulty: "apply",
    title: "Disjoint Sparse Table (DST) Level Selection via XOR",
    prompt: "A Disjoint Sparse Table (DST) answers static range queries over non-idempotent semigroups (such as $2 \\times 2$ matrix multiplication or modular product) in $O(1)$ time and $O(N \\log N)$ preprocessing by storing precomputed suffixes and prefixes radiating from block midpoints.",
    question: "Given a query $[L, R]$ with $L < R$ in a DST padded to size $2^H$, how do we find in $O(1)$ time the unique level $h$ where $L$ and $R$ fall on opposite sides of a block midpoint?",
    options: [
      "Find the most significant set bit b = floor(log2(L ^ R)) = 31 - clz32(L ^ R) where L and R differ in binary, and index level h = H - 1 - b",
      "Use k = floor(log2(R - L + 1)) just like a Standard Sparse Table",
      "Use the lowest set bit (L ^ R) & -(L ^ R)",
      "Binary search across all H levels for the midpoint M in [L, R]"
    ],
    answer: 0,
    explanation: "In a binary divide-and-conquer tree over [0, 2^H - 1], the bit at position b (from MSB to LSB) determines whether an index goes into the left half (bit = 0) or right half (bit = 1) at depth h = H - 1 - b. The highest bit where L and R differ—given by MSB(L ^ R)—identifies the exact depth where L and R first split across a block's midpoint!"
  },
  {
    id: "q-st-4",
    type: "mcq",
    difficulty: "staff",
    title: "Cache-Line & SIMD Layout: `st[k][i]` vs `st[i][k]`",
    prompt: "When allocating a Sparse Table for $N = 10^6$ integers ($K = 20$ levels), a developer must choose between indexing `st[k][i]` ($20 \\times 10^6$, level-major) and `st[i][k]` ($10^6 \\times 20$, index-major).",
    question: "Why is `st[k][i]` (level-major) significantly faster to construct and more amenable to SIMD vectorization than `st[i][k]`?",
    options: [
      "During construction, level k depends only on level k-1: `st[k][i] = min(st[k-1][i], st[k-1][i + (1 << (k-1))])` streams sequentially across two contiguous rows in memory, enabling hardware prefetching and AVX2 vector min instructions; `st[i][k]` strides by 20 words on every step",
      "`st[k][i]` uses half as much total RAM as `st[i][k]`",
      "`st[i][k]` cannot represent intervals when N is not a power of two",
      "`st[k][i]` avoids computing `clz32` during queries"
    ],
    answer: 0,
    explanation: "In level-major layout `st[k][i]`, the inner loop `for (int i = 0; i <= N - (1<<k); i++)` reads two sequential streams `prev[i]` and `prev[i + half]` and writes sequentially to `curr[i]`. Every 64-byte cache line loaded from DRAM is 100% utilized, and the compiler auto-vectorizes the loop using `vpminsd` (8 x 32-bit minimums per instruction)."
  }
];

window.QUESTION_BANK["fenwick-tree-binary-indexed"] = [
  {
    id: "q-fen-1",
    type: "mcq",
    difficulty: "recall",
    title: "Responsibility Interval of a Fenwick Tree Node",
    prompt: "In a 1-indexed Fenwick Tree (Binary Indexed Tree) $T[1..N]$, let $\\text{lowbit}(i) = i \\mathrel{\\&} (-i)$ in two's complement arithmetic.",
    question: "Which exact contiguous subarray of $A[1..N]$ is aggregated inside $T[12]$?",
    options: [
      "A[9..12] (length 4, since 12 = 1100_2 and lowbit(12) = 4, covering [12 - 4 + 1 .. 12])",
      "A[1..12] (length 12)",
      "A[11..12] (length 2)",
      "A[12..12] (length 1)"
    ],
    answer: 0,
    explanation: "In binary, 12 = 1100_2, so its lowest set bit is 2^2 = 4 (12 & -12 = 4). Cell T[i] stores the sum of the interval [i - lowbit(i) + 1 .. i] of length lowbit(i) ending at i. For i = 12, that is [12 - 4 + 1 .. 12] = [9..12]."
  },
  {
    id: "q-fen-2",
    type: "mcq",
    difficulty: "apply",
    title: "Exact O(N) Linear-Time Fenwick Tree Construction",
    prompt: "Calling `add(i, A[i])` for each $i \\in [1, N]$ builds a Fenwick tree in $O(N \\log N)$ time. How can you initialize $T[1..N]$ from $A[1..N]$ in **exact $\\Theta(N)$ time** using a single loop?",
    question: "Select the valid $\\Theta(N)$ in-place initialization algorithm:",
    options: [
      "Copy T[i] = A[i] for all i; then for i = 1 to N, let j = i + (i & -i); if (j <= N) T[j] += T[i]",
      "Copy T[i] = A[i] for all i; then for i = N down to 1, let j = i - (i & -i); T[j] += T[i]",
      "Compute the full prefix sum T[i] = T[i-1] + A[i] for i = 1 to N",
      "For i = 1 to N, set T[i] = A[i] + A[i - (i & -i)]"
    ],
    answer: 0,
    explanation: "In the Fenwick update tree, node j = i + (i & -i) is the unique immediate parent that directly encloses T[i]'s interval [i - lowbit(i) + 1 .. i]. By iterating i from 1 to N, by the time we reach i, all proper sub-intervals inside T[i] have already accumulated their sums into T[i]; forwarding T[i] once to its immediate parent j = i + (i & -i) builds the entire tree in N additions!"
  },
  {
    id: "q-fen-3",
    type: "mcq",
    difficulty: "apply",
    title: "Range Add & Range Sum via Dual Fenwick Trees",
    prompt: "Let $D[i] = A[i] - A[i-1]$ be the difference array of $A[1..N]$. When we add $+\\Delta$ to every element in $A[L..R]$, $D$ only changes at $D[L] \\mathrel{+}= \\Delta$ and $D[R+1] \\mathrel{-}= \\Delta$. Which algebraic identity expresses $\\text{prefixSum}_A(x) = \\sum_{i=1}^{x} A[i]$ using two Fenwick trees $B_1$ (storing $D[j]$) and $B_2$ (storing $j \\cdot D[j]$)?",
    question: "Select the exact formula for $\\sum_{i=1}^{x} A[i]$:",
    options: [
      "(x + 1) * sum_{j=1..x} D[j] - sum_{j=1..x} (j * D[j])",
      "x * sum_{j=1..x} D[j] + sum_{j=1..x} (j * D[j])",
      "sum_{j=1..x} (j * D[j]) - x * sum_{j=1..x} D[j]",
      "(x - 1) * sum_{j=1..x} D[j]"
    ],
    answer: 0,
    explanation: "In the prefix sum A[1] + A[2] + ... + A[x], D[1] appears in all x terms, D[2] appears in (x - 1) terms, and in general D[j] appears in (x - j + 1) terms. Rearranging sum_{j=1..x} D[j] * (x + 1 - j) yields (x + 1) * sum_{j=1..x} D[j] - sum_{j=1..x} (j * D[j])."
  },
  {
    id: "q-fen-4",
    type: "mcq",
    difficulty: "staff",
    title: "O(log N) Binary Lifting vs O(log^2 N) Binary Search on a Fenwick Tree",
    prompt: "Given a Fenwick tree over non-negative frequencies $A[1..N] \\ge 0$, we want to find the smallest 1-based index $i$ such that $\\text{prefixSum}(i) \\ge K$ (an order-statistic lookup on a frequency table).",
    question: "Why does Binary Lifting on the Fenwick array $T[]$ find this index in $O(\\log N)$ time with a single array read per bit, whereas binary searching over `prefixSum(mid)` takes $O(\\log^2 N)$?",
    options: [
      "When testing step p = 2^k from current position idx (where idx is a multiple of 2^{k+1}), T[idx + p] already stores the exact sum of A[idx + 1 .. idx + p] because lowbit(idx + 2^k) = 2^k!",
      "Binary lifting skips odd indices and only checks even indices",
      "Fenwick trees store full prefix sums at every power of two",
      "Binary lifting uses SIMD instructions to compute 16 prefix sums simultaneously"
    ],
    answer: 0,
    explanation: "As we build `idx` bit-by-bit from the highest power of two down to 2^0 = 1, all set bits in `idx` are strictly greater than the current bit `p = 2^k`. Therefore `lowbit(idx + p) = p`, which means `T[idx + p]` is the EXACT sum of the interval `[idx + 1 .. idx + p]`! Thus a single array read `T[idx + p]` tells us whether to advance `idx += p` and subtract `K -= T[idx]`, achieving O(log N) total time."
  }
];

window.QUESTION_BANK["segment-trees-bottom-up-monoids"] = [
  {
    id: "q-seg-1",
    type: "mcq",
    difficulty: "recall",
    title: "Space Complexity: 4N Recursive vs 2N Iterative Segment Tree",
    prompt: "Why does a standard top-down recursive segment tree using heap indexing (`left = 2*v`, `right = 2*v + 1`) require an array of size up to $4N$, whereas an iterative bottom-up (ZKW) segment tree requires an array of size **exact $2N$** for any $N$?",
    question: "Identify the structural reason for the $4N$ vs $2N$ difference:",
    options: [
      "Top-down recursion pads the tree to the next power of two (up to 2N leaves at the deepest level, whose 1-based heap indices reach ~4N), whereas bottom-up places the N leaves directly at [N .. 2N-1] and fills internal nodes [1 .. N-1] via tree[i] = combine(tree[2i], tree[2i+1])",
      "Iterative segment trees only store odd-indexed elements of the array",
      "Top-down segment trees store parent pointers inside the array",
      "Iterative segment trees compress values into 16-bit integers"
    ],
    answer: 0,
    explanation: "When N = 2^k + 1, a top-down tree splits down to depth k + 1, creating a sparse bottom level whose rightmost leaves sit near index 4N. In contrast, the ZKW bottom-up layout places the N leaves contiguously at [N .. 2N-1] and pairs every (2i, 2i+1) into parent i for i = N-1 down to 1—using every single slot in [1 .. 2N-1] with zero holes."
  },
  {
    id: "q-seg-2",
    type: "mcq",
    difficulty: "apply",
    title: "Preserving Order for Non-Commutative Monoids in Iterative Segment Trees",
    prompt: "You are using an iterative $2N$ segment tree to maintain range products of $2 \\times 2$ matrices (where $A \\times B \\neq B \\times A$). In the query loop over `[a, b) = [l + N, r + N + 1)`, how must `resL` and `resR` be updated?",
    question: "Select the exact update statements inside `for (; a < b; a >>= 1, b >>= 1)`:",
    options: [
      "if (a & 1) resL = combine(resL, tree[a++]); if (b & 1) resR = combine(tree[--b], resR); and finally return combine(resL, resR);",
      "if (a & 1) resL = combine(tree[a++], resL); if (b & 1) resR = combine(resR, tree[--b]); and return combine(resL, resR);",
      "if (a & 1) ans = combine(ans, tree[a++]); if (b & 1) ans = combine(ans, tree[--b]);",
      "Swap a and b on every iteration"
    ],
    answer: 0,
    explanation: "As pointer `a` moves rightward from the left boundary, each picked `tree[a++]` lies to the RIGHT of already-accumulated `resL`, so we do `resL = combine(resL, tree[a++])`. As pointer `b` moves leftward from the right boundary, each picked `tree[--b]` lies to the LEFT of already-accumulated `resR`, so we do `resR = combine(tree[--b], resR)`. Finally, `combine(resL, resR)` joins the left prefix and right suffix in exact left-to-right index order."
  },
  {
    id: "q-seg-3",
    type: "mcq",
    difficulty: "apply",
    title: "Monoid State for Dynamic Range Maximum Subarray Sum (Kadane Monoid)",
    prompt: "To answer 'what is the maximum contiguous subarray sum in $A[L..R]$' under point updates using a Segment Tree, each node stores a 4-tuple $(S, P, Q, M)$ representing total sum, max prefix sum, max suffix sum, and max subarray sum.",
    question: "How is the parent's tuple $(S, P, Q, M)$ computed from its left child $(S_L, P_L, Q_L, M_L)$ and right child $(S_R, P_R, Q_R, M_R)$?",
    options: [
      "S = S_L + S_R; P = max(P_L, S_L + P_R); Q = max(Q_R, Q_L + S_R); M = max(M_L, M_R, Q_L + P_R)",
      "S = S_L + S_R; P = P_L + P_R; Q = Q_L + Q_R; M = max(M_L, M_R, S_L + S_R)",
      "S = S_L + S_R; P = max(P_L, P_R); Q = max(Q_L, Q_R); M = M_L + M_R",
      "S = max(S_L, S_R); P = P_L; Q = Q_R; M = max(M_L, M_R)"
    ],
    answer: 0,
    explanation: "A contiguous subarray in the union of L and R lies either (1) entirely inside L (up to M_L), (2) entirely inside R (up to M_R), or (3) straddles the midpoint—which is the union of a suffix of L and a prefix of R (maximized by Q_L + P_R). Similarly, the best prefix of L U R is either a prefix of L (P_L) or all of L plus a prefix of R (S_L + P_R)."
  },
  {
    id: "q-seg-4",
    type: "mcq",
    difficulty: "staff",
    title: "Why Non-Power-of-Two 2N Iterative Segment Trees Still Work for Disjoint Associative Queries",
    prompt: "When $N$ is not a power of two (say $N = 6$), node $1$ in an iterative $2N$ segment tree is not the root of a single binary tree—the structure is actually a forest of $\\text{popcount}(N)$ complete binary trees arranged in a circular shift. Yet `query(l, r)` still works for any non-commutative monoid!",
    question: "Why does `query(l, r)` remain 100% valid for non-commutative monoids even when $N$ is not a power of two?",
    options: [
      "Because for every internal node i in [1..N-1], tree[i] combines two adjacent intervals tree[2i] and tree[2i+1]; the loop invariants on a = l+N and b = r+N+1 only ever fold sibling pairs (2i, 2i+1) into parent i when both lie inside [a, b), never crossing wrap-around boundaries",
      "Because the iterative loop automatically pads N to a power of two at runtime",
      "Because non-power-of-two iterative trees only work for commutative operations",
      "Because node 0 absorbs any out-of-order elements"
    ],
    answer: 0,
    explanation: "In the bottom-up loop `for (a = l+N, b = r+N+1; a < b; a >>= 1, b >>= 1)`, pointers `a` and `b` start in `[N, 2N]` where indices are contiguous left-to-right. At each step, if `a` is a right child (`2i+1`), it is consumed and `a` advances to `2i+2` before dividing by 2 to `i+1`. Thus any parent `i` visited at the next level represents the exact contiguous union of `[2i, 2i+1]` that lay strictly between `a` and `b`!"
  }
];

window.QUESTION_BANK["lazy-propagation-segment-tree-beats"] = [
  {
    id: "q-beats-1",
    type: "mcq",
    difficulty: "recall",
    title: "Distributivity Requirement in Lazy Propagation",
    prompt: "In a Lazy Segment Tree with data monoid $(S, \\oplus)$ and lazy tag monoid $(F, \\circ)$, why must every lazy tag $f \\in F$ satisfy $f(s_L \\oplus s_R) = f(s_L) \\oplus f(s_R)$ (or depend only on the known segment length)?",
    question: "What goes wrong if $f(s_L \\oplus s_R)$ cannot be computed in $O(1)$ time from the aggregate $s_L \\oplus s_R$?",
    options: [
      "When a range update covers node v's entire interval, we could not update v's summary in O(1) time without descending into v's children, destroying the O(log N) bound of lazy propagation",
      "The tree height would exceed O(log N)",
      "Point queries would no longer work",
      "Memory usage would grow to O(N^2)"
    ],
    answer: 0,
    explanation: "The entire speedup of lazy propagation comes from stopping at canonical nodes v fully inside [ql, qr] and computing the new summary v.val = apply(f, v.val, len) in O(1) time without visiting v's descendants."
  },
  {
    id: "q-beats-2",
    type: "mcq",
    difficulty: "apply",
    title: "Segment Tree Beats Tag Condition for `rangeChmin(l, r, x)`",
    prompt: "In Runze Ji's Segment Tree Beats supporting `rangeChmin(l, r, x)` ($A[i] \\leftarrow \\min(A[i], x)$) and `rangeSum(l, r)`, each node $v$ stores `sum`, strict maximum `max1`, count of maximums `cntMax`, and strict second-largest value `max2`.",
    question: "When $[tl, tr] \\subseteq [ql, qr]$, under what exact condition can we lazily update node $v$ in $O(1)$ time without recursing into $v$'s children, and how does `sum[v]` change?",
    options: [
      "When max2[v] < x < max1[v]: update sum[v] -= (max1[v] - x) * cntMax[v] and set max1[v] = x",
      "Whenever x < max1[v]: update sum[v] = x * (tr - tl + 1)",
      "When x <= max2[v]: update sum[v] -= (max2[v] - x) * cntMax[v]",
      "Only when tl == tr (at leaf nodes)"
    ],
    answer: 0,
    explanation: "If x >= max1[v], no element in v's subtree is affected (break in O(1)). If max2[v] < x < max1[v], then the ONLY elements in v's subtree greater than x are the `cntMax[v]` copies of `max1[v]`, each of which decreases by `(max1[v] - x)`. Thus `sum[v] -= (max1[v] - x) * cntMax[v]` and `max1[v] = x` is exact in O(1) time! Only when x <= max2[v] must we recurse into children."
  },
  {
    id: "q-beats-3",
    type: "mcq",
    difficulty: "apply",
    title: "Amortized Potential Function of Segment Tree Beats",
    prompt: "In Segment Tree Beats, when $x \\le \\text{max}_2[v]$, the algorithm is forced to recurse into both children of $v$ even though $[tl, tr] \\subseteq [ql, qr]$. Why doesn't an adversary trigger $\\Theta(N)$ work on every query?",
    question: "What potential function $\\Phi(T)$ decreases whenever an expensive recursive step ($x \\le \\text{max}_2[v]$) occurs?",
    options: [
      "Let Phi(T) be the sum over all nodes v of the number of distinct values in v's subtree (or count of nodes with max1[v] != max1[parent]); whenever x <= max2[v], at least two distinct value classes (max1 and max2) are clamped into the same value x, permanently decreasing Phi(T)",
      "The height of the segment tree decreases by 1 on every recursive call",
      "The array elements are sorted after the first query",
      "Each leaf can only be visited once across the entire program"
    ],
    answer: 0,
    explanation: "Whenever we take the expensive branch x <= max2[v] at a node fully inside [ql, qr], both `max1[v]` and `max2[v]` (which were strictly distinct values) get clamped down to `x`, merging at least two distinct value classes in v's subtree into one! Since an initial tree has at most O(N log N) node-distinctness tags and each range update adds at most O(log N) new boundary tags, total work across Q queries amortizes to O((N + Q) log N)."
  },
  {
    id: "q-beats-4",
    type: "mcq",
    difficulty: "staff",
    title: "The Non-Strict `max2` Bug That Degrades Segment Tree Beats to O(N)",
    prompt: "While implementing `_pull(v)` in Segment Tree Beats, an engineer computes `max1[v]` and `max2[v]` by sorting the 4 values `[max1[L], max2[L], max1[R], max2[R]]` in descending order and taking the first two elements (`sorted[0]` and `sorted[1]`).",
    question: "Why does this seemingly reasonable `_pull(v)` implementation cause TLE ($\\Theta(N)$ per query) when the array contains equal elements?",
    options: [
      "If `max1[L] == max1[R]`, `sorted[1]` equals `max1[v]` instead of the STRICTLY second-largest value; with `max2[v] == max1[v]`, the tag condition `max2[v] < x < max1[v]` is an empty interval and NEVER triggers, forcing recursion all the way to the leaves",
      "Sorting 4 elements takes O(N) time",
      "`cntMax[v]` overflows a 32-bit integer",
      "It corrupts `sum[v]` during construction"
    ],
    answer: 0,
    explanation: "`max2[v]` MUST be the strictly second-largest value (`max2[v] < max1[v]`). When `max1[L] == max1[R]`, `max1[v] = max1[L]`, `cntMax[v] = cntMax[L] + cntMax[R]`, and `max2[v] = Math.max(max2[L], max2[R])`. If `max2[v]` is allowed to equal `max1[v]`, the tag condition `max2[v] < x < max1[v]` becomes impossible to satisfy!"
  }
];

window.QUESTION_BANK["dynamic-persistent-segment-trees"] = [
  {
    id: "q-pst-1",
    type: "mcq",
    difficulty: "recall",
    title: "Node Allocation Bound in a Persistent Segment Tree",
    prompt: "We build $N$ versions of a Persistent Segment Tree over a coordinate-compressed value domain of size $M \\le N$ by starting from an empty tree $R_0$ and performing $N$ point insertions $R_i = \\text{insert}(R_{i-1}, \\text{rank}(A[i]))$.",
    question: "What is the exact number of new tree nodes allocated per insertion, and the total space complexity across all $N$ versions?",
    options: [
      "ceil(log2 M) + 1 new nodes per insertion along the root-to-leaf path; O(N log N) total nodes",
      "4M new nodes per insertion; O(N * M) total nodes",
      "1 new node per insertion; O(N) total nodes",
      "O(log^2 N) new nodes per insertion; O(N log^2 N) total nodes"
    ],
    answer: 0,
    explanation: "Each point insertion modifies only the single root-to-leaf path for `rank(A[i])`, which has length ceil(log2 M) + 1. All sibling subtrees off that path are shared via pointers to the previous version R_{i-1}, giving O(N log N) total space."
  },
  {
    id: "q-pst-2",
    type: "mcq",
    difficulty: "apply",
    title: "Walking Two Roots to Find the K-th Smallest Element in A[L..R]",
    prompt: "In a Chairman Tree (Persistent Segment Tree over value ranks) with prefix roots $R_0, R_1, \\dots, R_N$, we are searching for the $k$-th smallest element (1-indexed) in $A[L..R]$ (1-indexed) by comparing node `uCurr` (from $R_R$) and node `uPrev` (from $R_{L-1}$).",
    question: "Let `leftCount = cnt[lc[uCurr]] - cnt[lc[uPrev]]`. How does the search branch at each step?",
    options: [
      "If k <= leftCount, descend into the left children (lc[uPrev], lc[uCurr]) with k unchanged; otherwise descend into the right children (rc[uPrev], rc[uCurr]) with k = k - leftCount",
      "If k <= leftCount, descend into the right children with k = k - leftCount; otherwise descend left",
      "Always descend into whichever child has the larger count",
      "Binary search the value and call rangeSum(L, R) at each step in O(log^2 N)"
    ],
    answer: 0,
    explanation: "Because every prefix tree has identical interval structure over value ranks [0..M-1], `cnt[lc[uCurr]] - cnt[lc[uPrev]]` is the exact number of elements in subarray A[L..R] whose values lie in the left value half [vl..vm]. If k <= leftCount, the k-th smallest element is in the left half; otherwise we skip those `leftCount` elements (`k -= leftCount`) and search for the `(k - leftCount)`-th smallest element in the right half."
  },
  {
    id: "q-pst-3",
    type: "mcq",
    difficulty: "apply",
    title: "Dynamic (Sparse) Segment Tree Null-Sentinel Technique",
    prompt: "In a Dynamic (Sparse) Segment Tree over universe $[0, 10^{18}]$ stored in flat typed arrays `lc`, `rc`, `sum`, node index `0` is reserved as the null sentinel (`lc[0] = 0, rc[0] = 0, sum[0] = 0`).",
    question: "Why is reserving index `0` as a zero-initialized sentinel superior to using `-1` or `null` for unallocated children?",
    options: [
      "Reading `sum[lc[u]]` or `lc[uPrev]` when `u = 0` (an unallocated subtree) safely returns `0` without any `if (u !== -1)` branch, allowing Persistent and Dynamic tree walks to traverse unallocated branches seamlessly",
      "TypedArrays in JavaScript cannot store negative numbers like -1",
      "It reduces the height of the tree by 1",
      "It allows heap indexing `2*v` and `2*v + 1` to work without pointers"
    ],
    answer: 0,
    explanation: "Since node 0 has `lc[0] = 0`, `rc[0] = 0`, and `cnt[0] = 0`, node 0 acts as an infinite self-looping empty tree of zeroes! In Persistent Segment Trees, `R_0 = 0` represents the empty initial tree without allocating $2M$ zero nodes, and `cnt[lc[uCurr]] - cnt[lc[uPrev]]` works branchlessly even when `uPrev === 0`."
  },
  {
    id: "q-pst-4",
    type: "mcq",
    difficulty: "staff",
    title: "Why Standard In-Place `pushDown` Corrupts Persistent Segment Trees",
    prompt: "Suppose you have a Persistent Segment Tree with multiple historical roots $R_0, R_1, \\dots, R_v$, and you want to support lazy range additions alongside historical queries.",
    question: "What happens if you execute a standard in-place `pushDown(u)` during a query or update on version $R_v$?",
    options: [
      "`pushDown(u)` mutates `lc[u]` and `rc[u]` in place, but those child nodes may be structurally shared by older versions R_0..R_{v-1}; mutating them in place overwrites historical state or double-applies tags across versions unless you either clone children on pushDown or use Permanent Lazy Tags",
      "In-place `pushDown(u)` works without issue because lazy tags commute with persistence",
      "In-place `pushDown(u)` causes a stack overflow",
      "Lazy propagation is mathematically impossible on persistent trees"
    ],
    answer: 0,
    explanation: "In a persistent tree, an untouched child `c = lc[u]` is pointed to by multiple parent nodes across different versions (potentially holding different lazy tags!). Mutating `c` in place inside `pushDown(u)` pushes `u`'s version-specific tag into `c`, corrupting all other versions that share `c`. You must either (1) use **Permanent Lazy Tags** (leave tags on `u` and accumulate them into a running `lazyAcc` parameter as queries walk down) or (2) path-copy (`clone`) `lc[u]` and `rc[u]` inside `pushDown(u)`."
  }
];

window.QUESTION_BANK["sqrt-decomposition-mos-algorithm"] = [
  {
    id: "q-mo-1",
    type: "mcq",
    difficulty: "recall",
    title: "Optimal Block Size B When N and Q Differ",
    prompt: "In Mo's Algorithm over an array of length $N$ with $Q$ offline queries, left-pointer movement costs $O(Q \\cdot B)$ and right-pointer movement costs $O((N / B) \\cdot N) = O(N^2 / B)$, where $B$ is the block width.",
    question: "What choice of block width $B$ minimizes the sum $Q \\cdot B + N^2 / B$, and what is the resulting total time complexity?",
    options: [
      "B = max(1, floor(N / sqrt(Q))), giving O(N * sqrt(Q)) total pointer movement",
      "B = floor(sqrt(N)) always, giving O(N * sqrt(N)) regardless of Q",
      "B = floor(Q / sqrt(N)), giving O(Q * sqrt(N))",
      "B = floor(log2(N)), giving O((N + Q) log N)"
    ],
    answer: 0,
    explanation: "Setting Q * B = N^2 / B gives B^2 = N^2 / Q, so B = N / sqrt(Q). Substituting B = N / sqrt(Q) into both terms gives Q * (N / sqrt(Q)) + N^2 / (N / sqrt(Q)) = 2 * N * sqrt(Q) = O(N sqrt(Q))."
  },
  {
    id: "q-mo-2",
    type: "mcq",
    difficulty: "apply",
    title: "Why Expansion Loops Must Precede Contraction Loops in Mo's Algorithm",
    prompt: "When moving the current active window `[curL, curR]` to the next query `[L, R]` in Mo's Algorithm, four `while` loops adjust `curL` and `curR`. Suppose an engineer places the contraction loops (`while (curL < L) remove(curL++);` and `while (curR > R) remove(curR--);`) BEFORE the expansion loops (`while (curL > L) add(--curL);` and `while (curR < R) add(++curR);`).",
    question: "What bug occurs when transitioning from `[curL, curR] = [2, 4]` to `[L, R] = [7, 9]`?",
    options: [
      "`while (curL < 7) remove(curL++)` increments `curL` past `curR = 4` up to `7`, removing indices `5` and `6` that were NEVER in the window `[2, 4]` and creating negative frequencies (`freq[x] = -1`)!",
      "The algorithm runs 2x slower but still produces the right answer",
      "Only `curR` goes out of bounds while `curL` stays valid",
      "Nothing goes wrong because additions and removals cancel out"
    ],
    answer: 0,
    explanation: "If `[curL, curR] = [2, 4]` and `[L, R] = [7, 9]`, running `while (curL < 7) remove(curL++)` first removes indices 2, 3, 4, 5, and 6—even though 5 and 6 were never added to `[2, 4]`! During those steps `curL > curR + 1` (an inverted window with negative size), driving `freq[A[5]]` to `-1`. Expanding first (`while (curR < 9) add(++curR)` -> `[2, 9]`) ensures the window is always a valid superset before contracting (`curL` -> `7`)."
  },
  {
    id: "q-mo-3",
    type: "mcq",
    difficulty: "apply",
    title: "Boustrophedon (Snake) Comparator in Mo's Algorithm",
    prompt: "In standard Mo's ordering, all blocks sort queries by ascending $R$. At the end of Block $0$, $R$ is near $N-1$; at the start of Block $1$, $R$ must rewind all the way back to $0$ (wasting $N$ steps). How does the snake-order comparator avoid this rewind?",
    question: "Select the comparator for queries `q1` and `q2` with `block = Math.floor(l / B)`:",
    options: [
      "if (q1.block !== q2.block) return q1.block - q2.block; return (q1.block & 1) ? (q2.r - q1.r) : (q1.r - q2.r);",
      "if (q1.r !== q2.r) return q1.r - q2.r; return q1.l - q2.l;",
      "return (q1.l + q1.r) - (q2.l + q2.r);",
      "if (q1.block !== q2.block) return q2.block - q1.block; return q1.r - q2.r;"
    ],
    answer: 0,
    explanation: "By sorting R in ascending order when `block` is even (`!(q1.block & 1)`) and in descending order when `block` is odd (`q1.block & 1`), `curR` finishes even blocks near `N` and immediately sweeps downward from `N` to `0` in the next odd block, cutting total right-pointer movement by ~50%."
  },
  {
    id: "q-mo-4",
    type: "mcq",
    difficulty: "staff",
    title: "Eliminating the Log Factor When Querying Range Mode (Maximum Frequency)",
    prompt: "Suppose we use Mo's Algorithm to find the **mode frequency** (the maximum frequency of any element in $A[L..R]$). Inside `add(idx)` and `remove(idx)`, maintaining the frequencies in a balanced BST or heap would multiply the $O(N \\sqrt{Q})$ pointer steps by $O(\\log N)$, causing TLE.",
    question: "How do we maintain the exact maximum frequency `maxFreq` in **$O(1)$ worst-case time per `add` AND `remove` step**?",
    options: [
      "Maintain `freq[v]` (frequency of value v) AND `cntOfFreq[f]` (how many distinct values currently have frequency f); on `add`, if `++freq[v] > maxFreq`, increment `maxFreq`; on `remove`, if `--cntOfFreq[maxFreq] === 0`, decrement `maxFreq--`!",
      "Re-scan the entire `freq` array only when `remove` is called",
      "Maintain a lazy max-heap and never delete stale entries",
      "Use a Fenwick tree over frequencies"
    ],
    answer: 0,
    explanation: "Because a single `add` or `remove` step changes `freq[v]` by at most `+1` or `-1`, `maxFreq` can only ever change by `+1` (when `++freq[v] === maxFreq + 1`) or `-1` (when the last value holding `maxFreq` has its frequency decremented to `maxFreq - 1`, so `cntOfFreq[maxFreq]` drops to `0` and `cntOfFreq[maxFreq - 1] > 0`). Thus both `add` and `remove` run in O(1) worst-case time!"
  }
];

window.QUESTION_BANK["lowest-common-ancestor-rmq"] = [
  {
    id: "q-lca-1",
    type: "mcq",
    difficulty: "recall",
    title: "Tree Distance Formula via Lowest Common Ancestor",
    prompt: "In a rooted tree where `depth[u]` is the distance (or sum of edge weights) from the root to vertex $u$, how is the shortest path distance $\\text{dist}(u, v)$ between any two vertices $u$ and $v$ computed using $\\text{LCA}(u, v)$?",
    question: "Select the exact formula for $\\text{dist}(u, v)$:",
    options: [
      "depth[u] + depth[v] - 2 * depth[LCA(u, v)]",
      "depth[u] + depth[v] - depth[LCA(u, v)]",
      "Math.abs(depth[u] - depth[v])",
      "depth[LCA(u, v)] - depth[u] - depth[v]"
    ],
    answer: 0,
    explanation: "The path from root to u has length `depth[u] = dist(root, LCA) + dist(LCA, u)`, and the path from root to v has length `depth[v] = dist(root, LCA) + dist(LCA, v)`. Adding them counts `dist(root, LCA) = depth[LCA(u, v)]` twice, so subtracting `2 * depth[LCA(u, v)]` yields `dist(u, LCA) + dist(LCA, v) = dist(u, v)`."
  },
  {
    id: "q-lca-2",
    type: "mcq",
    difficulty: "apply",
    title: "Why Binary Lifting Iterates From Highest Bit Down to 0",
    prompt: "In Binary Lifting LCA, after checking that neither $u$ nor $v$ is an ancestor of the other, we run `for (int k = LOG - 1; k >= 0; k--) if (!isAncestor(up[k][u], v)) u = up[k][u];` and finally return `up[0][u]`.",
    question: "Why does this loop iterate from `k = LOG - 1` down to `0` and return `up[0][u]`?",
    options: [
      "Every positive integer distance d = depth[u] - depth[LCA] - 1 has a unique binary representation; greedily jumping by 2^k from largest to smallest whenever up[k][u] is still strictly below LCA(u, v) lands u on the exact child of LCA(u, v), so up[0][u] is LCA(u, v)",
      "Iterating from 0 to LOG - 1 would jump above the root",
      "Because `up[k][u]` is only defined for even values of k",
      "To minimize L1 cache misses"
    ],
    answer: 0,
    explanation: "Let `w = LCA(u, v)` and let `u'` be the child of `w` on the path to `u` (at distance `d = depth[u] - depth[w] - 1 >= 0` above `u`). A node on `u`'s ancestor chain is NOT an ancestor of `v` if and only if its distance from `u` is `<= d`. Testing powers `2^k` from largest to smallest accumulates the exact binary bits of `d`, landing `u` at `u'`, whose parent `up[0][u']` is `w = LCA(u, v)`."
  },
  {
    id: "q-lca-3",
    type: "mcq",
    difficulty: "apply",
    title: "Length of the Full Euler Tour Array for RMQ-LCA",
    prompt: "To reduce $\\text{LCA}(u, v)$ to a Range Minimum Query over vertex depths, we record a vertex in the Euler Tour array $E[]$ when entering the vertex AND every time the DFS returns to the vertex after finishing a child's subtree.",
    question: "For a tree with $N$ vertices (and $N - 1$ edges), what is the exact length of this Euler Tour array $E[]$?",
    options: [
      "2N - 1 entries (1 initial entry at the root + 2 directed steps per tree edge)",
      "N entries (one per vertex)",
      "2N entries (entry and exit timestamp per vertex)",
      "N log2(N) entries"
    ],
    answer: 0,
    explanation: "A tree with N vertices has N - 1 edges. An Euler tour starts at the root (1 entry) and traverses each of the N - 1 undirected edges twice (once downward to the child, once upward returning to the parent), appending the destination vertex on each step: 1 + 2*(N - 1) = 2N - 1 entries."
  },
  {
    id: "q-lca-4",
    type: "mcq",
    difficulty: "staff",
    title: "Bender & Farach-Colton's ±1 RMQ (Method of Four Russians)",
    prompt: "Using a standard Sparse Table on the Euler Tour array takes $\\Theta(N \\log N)$ preprocessing time and space to achieve $O(1)$ LCA queries. How do Bender and Farach-Colton shave the preprocessing down to **optimal $\\Theta(N)$ time and space** while keeping $O(1)$ query time?",
    question: "Identify the key structural property of the Euler Tour depth array and how the Method of Four Russians exploits it:",
    options: [
      "Adjacent elements in the Euler Tour depth array differ by exactly +1 or -1; dividing the array into blocks of size b = (1/2) log2(N) produces O(N / log N) blocks (indexed by a Sparse Table in O(N) time), while each block's normalized ±1 diff mask has only 2^{b-1} = O(sqrt(N)) possible shapes that can all be precomputed in O(sqrt(N) log^2 N) = o(N) time!",
      "They replace the Sparse Table with a Fenwick Tree",
      "They compress the tree using Heavy-Light Decomposition",
      "They use radix sort on the depths"
    ],
    answer: 0,
    explanation: "Because |D[i] - D[i-1]| = 1 at every step of the Euler tour, a block of length b = (1/2) log2(N) is completely determined (up to its starting offset D[0]) by a (b - 1)-bit binary mask of +1/-1 steps. There are only 2^{b-1} <= sqrt(N) distinct bitmasks! Precomputing the intra-block RMQ table for all sqrt(N) bitmasks takes o(N) time, and building a Sparse Table over the M = 2N / b block minimums takes O(M log M) = O((N / log N) log N) = O(N) time!"
  }
];

window.QUESTION_BANK["heavy-light-decomposition"] = [
  {
    id: "q-hld-1",
    type: "mcq",
    difficulty: "recall",
    title: "Maximum Light Edges on Any Root-to-Leaf Path",
    prompt: "In Heavy-Light Decomposition (HLD) of a tree with $N$ vertices, at each vertex $u$ the edge to the child with the largest subtree size is marked **heavy** (ties broken arbitrarily), and all other child edges are marked **light**.",
    question: "At most how many light edges can any root-to-leaf path contain, and why?",
    options: [
      "At most floor(log2 N) light edges, because stepping down a light edge (u, v) implies v has a heavy sibling c with sz[c] >= sz[v], so sz[u] >= 1 + 2 * sz[v] > 2 * sz[v]",
      "At most sqrt(N) light edges",
      "At most 2 light edges",
      "Up to N - 1 light edges if the tree is a star graph"
    ],
    answer: 0,
    explanation: "Whenever (u, v) is a light edge, v is not the heaviest child of u, so the heavy child c satisfies sz[c] >= sz[v]. Since u contains itself, c's subtree, and v's subtree, sz[u] >= 1 + sz[c] + sz[v] >= 2 * sz[v] + 1, so sz[v] <= floor((sz[u] - 1) / 2). Because subtree size at least halves on every light edge, a path can cross at most floor(log2 N) light edges."
  },
  {
    id: "q-hld-2",
    type: "mcq",
    difficulty: "apply",
    title: "The Heavy-Child-First Preorder Trick for Simultaneous Path & Subtree Queries",
    prompt: "In the second DFS of Heavy-Light Decomposition that assigns each vertex $u$ its index `pos[u]` in the Segment Tree base array, why do we visit `heavy[u]` **before** all light children of $u$?",
    question: "What dual contiguity property does visiting `heavy[u]` first guarantee?",
    options: [
      "Every heavy chain [head[u]..u] maps to the contiguous segment [pos[head[u]], pos[u]], AND every subtree T_u simultaneously maps to the contiguous segment [pos[u], pos[u] + sz[u] - 1]",
      "It reduces the height of the tree to O(log N)",
      "It allows the Segment Tree to be replaced by a Sparse Table even with updates",
      "It ensures all leaves appear at even indices"
    ],
    answer: 0,
    explanation: "Any DFS preorder maps every subtree T_u to a contiguous interval `[pos[u], pos[u] + sz[u] - 1]`. By additionally recursing into `heavy[u]` immediately after visiting `u` (before any light children), the entire heavy chain starting at `head` is visited consecutively before any light branches off the chain, making both heavy chains and subtrees contiguous in the same `pos[]` array!"
  },
  {
    id: "q-hld-3",
    type: "mcq",
    difficulty: "apply",
    title: "Why HLD Climbs the Deeper Chain Head (`depth[head[u]]` vs `depth[u]`)",
    prompt: "Consider the `while (head[u] !== head[v])` loop in HLD's `queryPath(u, v)`. Suppose node $u$ has `depth[u] = 10` on a long heavy chain that starts at the root (`head[u] = root`, `depth[head[u]] = 0`), while node $v$ has `depth[v] = 3` on a short chain with `depth[head[v]] = 2`.",
    question: "What happens if your code compares `if (depth[u] < depth[v]) swap(u, v)` instead of `if (depth[head[u]] < depth[head[v]]) swap(u, v)`?",
    options: [
      "Because `depth[u] = 10 > depth[v] = 3`, the code jumps `u` to `parent[head[u]] = parent[root] = -1`, jumping above the LCA (and out of the tree) instead of climbing `v` out of its deeper chain head!",
      "Both comparisons always pick the same node",
      "The loop still finds the right answer but takes one extra iteration",
      "It only fails when the tree has even number of vertices"
    ],
    answer: 0,
    explanation: "If `head[u] != head[v]`, the chain head with the strictly greater depth (`max(depth[head[u]], depth[head[v]])`) is guaranteed to lie strictly below `LCA(u, v)`, whereas the shallower chain head may be an ancestor of `LCA(u, v)` (such as the root!). Therefore you MUST always climb from the node whose CHAIN HEAD is deeper (`depth[head[u]] > depth[head[v]]`)."
  },
  {
    id: "q-hld-4",
    type: "mcq",
    difficulty: "staff",
    title: "Edge-Weighted Paths & Non-Commutative Path Queries in HLD",
    prompt: "You are using HLD to answer queries on a tree where (1) weights are stored on **edges** rather than vertices, and (2) the monoid operation $\\oplus$ is **non-commutative** (e.g., applying a sequence of directed matrix transformations from $u$ to $v$).",
    question: "How must the HLD path query be adapted for edge weights and directed non-commutative paths from $u \\to v$?",
    options: [
      "Store each edge's weight at its deeper endpoint and query `[pos[u] + 1, pos[v]]` on the final shared chain to exclude the LCA vertex; for directed u -> v non-commutativity, maintain two directional views in the Segment Tree (upward vs downward) and accumulate the u -> LCA segments separately from the LCA -> v segments",
      "Store each edge's weight at its shallower endpoint and query `[pos[u], pos[v]]` unchanged",
      "HLD cannot handle edge weights or non-commutative operations",
      "Multiply every edge weight by 2"
    ],
    answer: 0,
    explanation: "Every tree edge `(parent[x], x)` uniquely maps to its deeper endpoint `x` (the root has no incoming edge). Thus the edges on the path between `u` and `v` correspond to all vertices on the path EXCEPT `LCA(u, v)`; when `head[u] == head[v]` and `depth[u] <= depth[v]`, `u` is the LCA, so querying `[pos[u] + 1, pos[v]]` (skipping `pos[u]`) aggregates the exact path edges! For directed non-commutative operations from `u` to `v`, the `u -> LCA` segments climb UP heavy chains (decreasing `pos[]`) while `LCA -> v` segments descend DOWN heavy chains (increasing `pos[]`), requiring two directional monoid summaries per segment tree node."
  }
];

window.QUESTION_BANK["cartesian-trees-treap-duality"] = [
  {
    id: "q-ct-1",
    type: "mcq",
    difficulty: "recall",
    title: "Defining Properties of a Cartesian Tree",
    prompt: "Given an array $A[0..N-1]$ of distinct numbers, what two simultaneous invariants uniquely define its Min-Cartesian Tree?",
    question: "Select the two invariants satisfied by every node $u$ in the Min-Cartesian Tree of $A$:",
    options: [
      "1) Binary Search Tree invariant on array indices (all nodes in left[u] have index < u < all nodes in right[u]); 2) Min-Heap invariant on array values (A[u] <= A[child])",
      "1) Binary Search Tree invariant on array values A[u]; 2) Min-Heap invariant on array indices u",
      "1) Complete binary tree shape; 2) Red-Black color balance",
      "1) All leaves at the same depth; 2) Left child smaller than right child"
    ],
    answer: 0,
    explanation: "In a Min-Cartesian tree of A[0..N-1], an inorder traversal visits indices 0, 1, ..., N-1 in exact array order (BST on indices), and every parent has a smaller or equal array value than its children (Min-Heap on A[i]). Consequently, the root of any subtree is the minimum element of that contiguous index range."
  },
  {
    id: "q-ct-2",
    type: "mcq",
    difficulty: "apply",
    title: "Tracing the Right-Spine Monotonic Stack Step",
    prompt: "During the $\\Theta(N)$ left-to-right construction of a Min-Cartesian Tree, the monotonic stack maintains the current tree's **right spine** (indices with strictly increasing values from bottom to top). When inserting index $i$, we pop all spine nodes $s$ with $A[s] > A[i]$.",
    question: "If $k \\ge 1$ nodes are popped from the stack and `lastPopped` is the last node popped, how are the child pointers rewired for index $i$?",
    options: [
      "`lastPopped` becomes the left child of `i` (`left[i] = lastPopped`), and `i` becomes the right child of the new stack top (`right[stack[top]] = i`), then `i` is pushed onto the stack",
      "`lastPopped` becomes the right child of `i` (`right[i] = lastPopped`), and `i` becomes the left child of the new stack top",
      "All k popped nodes are re-inserted one by one into `i`'s right subtree",
      "`i` replaces the root of the tree regardless of Whether the stack is empty"
    ],
    answer: 0,
    explanation: "All popped nodes have indices `< i` and values `> A[i]`, and `lastPopped` was the highest ancestor among them (so `lastPopped`'s subtree already contains all the other popped nodes!). Attaching `lastPopped` as `left[i]` puts all those `< i` indices in `i`'s left subtree while restoring the min-heap invariant (`A[i] < A[lastPopped]`). Meanwhile, the remaining stack top `p` has index `< i` and value `<= A[i]`, so `i` becomes `right[p]`."
  },
  {
    id: "q-ct-3",
    type: "mcq",
    difficulty: "apply",
    title: "Counting Subarrays Where A[i] Is the Minimum via Cartesian Tree",
    prompt: "Once the Min-Cartesian Tree of $A[0..N-1]$ is built, let `sz[u]` be the number of nodes in $u$'s subtree, `szL = sz[left[u]]`, and `szR = sz[right[u]]$.",
    question: "For how many contiguous subarrays $A[L..R]$ is $u$ the chosen minimum element, and what is the maximal interval $[L_u, R_u]$ where $A[u]$ is the minimum?",
    options: [
      "u is the minimum of (szL + 1) * (szR + 1) subarrays, and its subtree covers the exact contiguous interval [u - szL, u + szR]",
      "u is the minimum of szL + szR + 1 subarrays",
      "u is the minimum of 2^{sz[u]} subarrays",
      "u is the minimum of N - sz[u] subarrays"
    ],
    answer: 0,
    explanation: "Because the inorder traversal of u's subtree is a contiguous block of array indices containing szL indices to the left of u (`[u - szL .. u - 1]`) and szR indices to the right of u (`[u + 1 .. u + szR]`), any subarray `[L, R]` with `L in [u - szL, u]` (szL + 1 choices) and `R in [u, u + szR]` (szR + 1 choices) has `LCA(L, R) = u` in the Cartesian tree!"
  },
  {
    id: "q-ct-4",
    type: "mcq",
    difficulty: "staff",
    title: "Number of Distinct Binary Tree Topologies & 2N-Bit Succinct Encoding",
    prompt: "In Bender & Farach-Colton's $\\Theta(N)$ RMQ algorithm, two blocks of length $b$ have the exact same RMQ answers for all local pairs $(l, r) \\in [0, b-1]^2$ if and only if they have the **exact same Cartesian Tree topology**.",
    question: "How many distinct Cartesian Tree topologies exist for a block of $b$ elements, and how does this allow encoding any block's RMQ structure without requiring the $\\pm 1$ adjacent-difference property?",
    options: [
      "The b-th Catalan number C_b = (1 / (b + 1)) * binom(2b, b) < 4^b topologies; by recording the push/pop sequence of the monotonic stack as a 2b-bit balanced parenthesis string, any general RMQ block of size b = (1/4) log2(N) maps to one of < 4^b = sqrt(N) lookup tables directly!",
      "Exactly b! topologies, requiring O(b log b) bits per block",
      "2^b topologies",
      "b^2 topologies"
    ],
    answer: 0,
    explanation: "Every binary tree on b nodes is uniquely identified by its Catalan number C_b < 4^b topology, which corresponds directly to the 2b-bit sequence of `push` (1) and `pop` (0) operations during the linear-time monotonic stack construction! This means we do not even need to convert general RMQ into an Euler Tour of size 2N-1: we can directly encode each block of size b = (1/4) log2(N) via its 2b-bit Cartesian tree stack signature in O(N) time!"
  }
];

window.QUESTION_BANK["build-lazy-segment-tree"] = [
  {
    id: "q-aff-1",
    type: "mcq",
    difficulty: "recall",
    title: "Expressing Range Assignment as an Affine Transformation",
    prompt: "In a Range Affine Lazy Segment Tree where each lazy tag $(a, b)$ transforms every element $x \\leftarrow a \\cdot x + b$, how are `rangeAdd(l, r, d)`, `rangeScale(l, r, k)`, and `rangeAssign(l, r, c)` represented as pairs $(a, b)$?",
    question: "Select the exact $(a, b)$ representations for `rangeAdd(d)`, `rangeScale(k)`, and `rangeAssign(c)`:",
    options: [
      "rangeAdd(d) -> (1, d); rangeScale(k) -> (k, 0); rangeAssign(c) -> (0, c); identity -> (1, 0)",
      "rangeAdd(d) -> (0, d); rangeScale(k) -> (k, 1); rangeAssign(c) -> (1, c); identity -> (0, 0)",
      "rangeAdd(d) -> (d, 1); rangeScale(k) -> (0, k); rangeAssign(c) -> (c, 0); identity -> (1, 1)",
      "rangeAssign(c) cannot be represented as an affine transformation"
    ],
    answer: 0,
    explanation: "Applying (1, d) computes 1*x + d = x + d (add). Applying (k, 0) computes k*x + 0 = k*x (scale). Applying (0, c) computes 0*x + c = c (overwriting any previous value x with c!). And (1, 0) computes 1*x + 0 = x (identity)."
  },
  {
    id: "q-aff-2",
    type: "mcq",
    difficulty: "apply",
    title: "Composing Two Affine Lazy Tags (`f_new` After `f_old`)",
    prompt: "Suppose node $v$ in a Range Affine Lazy Segment Tree already holds a pending lazy tag $(a_1, b_1)$ representing $f_{\\text{old}}(x) = a_1 x + b_1$, and a new range update applies $(a_2, b_2)$ representing $f_{\\text{new}}(y) = a_2 y + b_2$ to node $v$.",
    question: "What is the composed lazy tag $(a_{\\text{composed}}, b_{\\text{composed}})$ stored at node $v$?",
    options: [
      "(a2 * a1, a2 * b1 + b2)",
      "(a1 * a2, a1 * b2 + b1)",
      "(a1 + a2, b1 + b2)",
      "(a2 * a1, b1 + b2)"
    ],
    answer: 0,
    explanation: "Substituting y = f_old(x) = a1 * x + b1 into f_new(y) = a2 * y + b2 gives a2 * (a1 * x + b1) + b2 = (a2 * a1) * x + (a2 * b1 + b2). Notice that function composition is NOT commutative: the new multiplier a2 scales BOTH the old multiplier a1 AND the old additive offset b1!"
  },
  {
    id: "q-aff-3",
    type: "mcq",
    difficulty: "apply",
    title: "Updating Node Summary vs Lazy Offset with Segment Length `len`",
    prompt: "When applying affine tag $(a, b)$ to a segment tree node $v$ covering $[tl, tr]$ of length $\\text{len} = tr - tl + 1$, how do `sum[v]` and `lazyB[v]` incorporate the segment length `len`?",
    question: "Identify the exact role of `len = tr - tl + 1` in `_apply(v, len, a, b)`:",
    options: [
      "`sum[v] = a * sum[v] + b * len` multiplies `b` by `len` (since `b` is added to each of the `len` elements in `[tl..tr]`), whereas `lazyB[v] = a * lazyB[v] + b` does NOT multiply `b` by `len` because `lazyB[v]` is a per-element tag",
      "Both `sum[v]` and `lazyB[v]` multiply `b` by `len`",
      "Neither `sum[v]` nor `lazyB[v]` multiplies `b` by `len`",
      "`lazyB[v]` multiplies `b` by `len`, while `sum[v]` adds `b` unscaled"
    ],
    answer: 0,
    explanation: "Summing `a * A[i] + b` over `i = tl .. tr` yields `a * sum[v] + b * (tr - tl + 1)`. However, the lazy tag `(lazyA[v], lazyB[v])` represents the per-element function `f(x) = A * x + B` that will later be pushed down to `v`'s children; multiplying `b` by `len` inside `lazyB[v]` would multiply by length twice when pushed down!"
  },
  {
    id: "q-aff-4",
    type: "mcq",
    difficulty: "staff",
    title: "Single-Pass O(log N) `maxRight(l, pred)` Complexity Proof",
    prompt: "In the `maxRight(l, pred)` method on a Lazy Segment Tree, we want to find the largest index $r \\ge l - 1$ such that `pred(sum(l..r))` is true (assuming `pred` is monotone, e.g., `sum <= K` on non-negative elements).",
    question: "Why does `maxRight(l, pred)` visit at most $O(\\log N)$ nodes in total, even though it may recurse into both children when a node straddles $l$ or straddles the threshold $r^*$?",
    options: [
      "Whenever a node v lies fully to the right of l (tl >= l), if `pred(acc + sum[v])` is true, v is consumed in O(1) without recursing into its children; the algorithm only ever descends into a node's children along the left boundary path of l and along the single threshold path of r*, visiting at most 2 root-to-leaf paths (O(log N) nodes)",
      "Because it only checks the root node and its two immediate children",
      "Because `pushDown` is skipped during `maxRight`",
      "It actually visits O(log^2 N) nodes, matching binary search"
    ],
    answer: 0,
    explanation: "Just like a normal segment tree range query decomposes `[l, N-1]` into O(log N) canonical nodes along the left boundary `l`, `maxRight` tests each of those O(log N) canonical nodes in left-to-right order: all canonical nodes before the threshold `r*` satisfy `pred(acc + sum[v]) === true` and are absorbed in O(1) time (`acc += sum[v]; return tr;`). The FIRST canonical node where `pred(acc + sum[v]) === false` contains `r*`, and the algorithm walks down a single root-to-leaf path inside that node to pinpoint `r*` and immediately terminates!"
  }
];
