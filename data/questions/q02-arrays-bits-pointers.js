window.QUESTION_BANK = window.QUESTION_BANK || {};

window.QUESTION_BANK["dynamic-arrays-geometric-resizing"] = [
  {
    id: "q-dagr-1",
    type: "mcq",
    difficulty: "recall",
    title: "Why 2x Growth Prevents In-Arena Coalesced Heap Reuse",
    prompt: "Consider a dynamic array growing geometrically by a factor of $k = 2.0$ inside a contiguous heap arena without external allocations, freeing each previous block of size $1, 2, 4, \\dots, 2^{m-1}$ as it allocates $2^m$. Why can a coalescing allocator never satisfy the $m$-th allocation purely from the sum of previously freed blocks?",
    question: "Which mathematical inequality explains why $k = 2.0$ prevents in-arena reuse of previously freed buffers?",
    options: [
      "The sum of all previously freed blocks is $\\sum_{i=0}^{m-1} 2^i = 2^m - 1$, which is always strictly less than the newly requested size $2^m$; reuse requires $k < \\varphi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.618$.",
      "A $2.0\\times$ growth factor causes $\\Theta(N \\log N)$ amortized element copies, fragmenting the OS page table directory.",
      "Standard allocators cannot coalesce adjacent free blocks if their sizes are powers of two.",
      "The Golden Ratio $\\varphi \\approx 1.618$ is the minimum growth factor required to achieve $O(1)$ amortized append time."
    ],
    answer: 0,
    explanation: "For the $m$-th allocation of size $k^m$ to eventually fit inside the coalesced sum of prior blocks $\\sum_{i=0}^{m-1} k^i = \\frac{k^m - 1}{k - 1}$, we need $k - 1 < 1 - k^{-m}$, or asymptotically $k^2 - k - 1 \\le 0 \\implies k \\le \\varphi \\approx 1.618$. With $k = 2$, $2^m > 2^m - 1$ forever."
  },
  {
    id: "q-dagr-2",
    type: "mcq",
    difficulty: "apply",
    title: "Amortized Element Moves Under 1.5x vs 2.0x Growth",
    prompt: "You are tuning a custom vector implementation for trivially copyable 64-byte structs. You switch the growth factor from $k = 2.0$ to $k = 1.5$ (as used in MSVC `std::vector` and Meta's `folly::fbvector`).",
    question: "In the asymptotic limit over $N$ `push_back` operations (starting from capacity 1), how does the worst-case number of element moves/copies per `push_back` change when switching from $k = 2.0$ to $k = 1.5$?",
    options: [
      "The amortized number of element moves per append increases from $\\frac{1}{2.0 - 1} = 1.0$ move per append to $\\frac{1}{1.5 - 1} = 2.0$ moves per append, while peak slack capacity drops from $50\\%$ to $33.3\\%$.",
      "The amortized number of element moves per append decreases from $2.0$ to $1.5$ because smaller allocations copy fewer elements each time.",
      "The amortized complexity degrades from $O(1)$ to $O(\\log_{1.5} N)$ because $1.5$ is not an integer power of two.",
      "The amortized number of element moves remains identically $1.0$ for any constant $k > 1$."
    ],
    answer: 0,
    explanation: "When a resize occurs at capacity $C = N$, prior resizes copied $C/k + C/k^2 + C/k^3 + \\dots = \\frac{C}{k - 1}$ elements. Dividing by $N = C$ gives $\\frac{1}{k - 1}$ amortized moves per append ($1$ for $k = 2$, $2$ for $k = 1.5$), plus $1$ initial construction."
  },
  {
    id: "q-dagr-3",
    type: "mcq",
    difficulty: "apply",
    title: "C++ std::vector Strong Exception Guarantee & noexcept Move Bug",
    prompt: "A colleague implements a custom `Buffer` class in C++ with a custom move constructor `Buffer(Buffer&& other)` that transfers pointer ownership in $O(1)$ time, but forgets to mark the move constructor `noexcept`. They store `Buffer` objects inside `std::vector<Buffer>` and profile `push_back`.",
    question: "What happens inside `std::vector<Buffer>::push_back` whenever capacity is exceeded and reallocation occurs?",
    options: [
      "Because `std::vector::push_back` provides the Strong Exception Guarantee, `std::move_if_noexcept` refuses to call the non-`noexcept` move constructor and falls back to $O(N)$ deep copy construction of every `Buffer`.",
      "The code fails to compile under C++20 unless `Buffer` is trivially copyable.",
      "`std::vector` still calls the move constructor, but wraps each move in a `try/catch` block that leaks memory if an exception is thrown.",
      "`std::vector` uses `realloc()` to expand the underlying heap block in place without calling either the copy or move constructor."
    ],
    answer: 0,
    explanation: "If a move constructor threw an exception halfway through relocating elements into the new buffer, the already-moved elements in the old buffer would be mutated, making rollback impossible. Thus `std::vector` uses `std::move_if_noexcept`, silently falling back to deep copy construction unless the move constructor is marked `noexcept`."
  },
  {
    id: "q-dagr-4",
    type: "mcq",
    difficulty: "staff",
    title: "Self-Referential Aliasing During v.push_back(v[0])",
    prompt: "You are implementing a custom `Vector<T>::push_back(const T& val)` method. A caller executes `vec.push_back(vec[0])` at the exact moment when `vec.size() == vec.capacity()`.",
    question: "Which implementation sequence inside `push_back(const T& val)` prevents a silent Use-After-Free (dangling reference read) when `val` aliases an element inside `vec` itself?",
    options: [
      "Allocate `new_data`, copy/move existing elements or construct the new copy at `new_data[size_]` from `val` BEFORE destroying the old elements and freeing `data_`.",
      "Free `data_` first to allow the allocator to reuse the same address in place, then construct `new_data[size_]` from `val`.",
      "Pass `val` by `T&&` rvalue reference so the compiler automatically clones `vec[0]` onto the stack.",
      "Call `std::memmove` instead of `std::memcpy` after freeing `data_`."
    ],
    answer: 0,
    explanation: "Because `val` is a `const T&` reference pointing directly to `this->data_[0]`, destroying and deallocating `data_` before reading `val` to construct `new_data[size_]` causes `new_data[size_]` to be copy-constructed from a destroyed, freed object! Production vectors always construct the new element in `new_data` before destroying/freeing `data_`."
  }
];

window.QUESTION_BANK["prefix-sums-difference-arrays"] = [
  {
    id: "q-psda-1",
    type: "mcq",
    difficulty: "recall",
    title: "2D Prefix Sum Inclusion-Exclusion Formula",
    prompt: "Given a 1-indexed 2D prefix sum table `P` of size $(R+1) \\times (C+1)$ where `P[r][c]` stores the sum of `A[0..r-1][0..c-1]`, you need to compute the sum of the 0-indexed inclusive subgrid `[r1 .. r2] x [c1 .. c2]` in $O(1)$ time.",
    question: "Which algebraic expression correctly computes the subgrid sum using the Principle of Inclusion-Exclusion?",
    options: [
      "`P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]`",
      "`P[r2 + 1][c2 + 1] - P[r1 - 1][c2] - P[r2][c1 - 1] - P[r1][c1]`",
      "`P[r2][c2] - P[r1][c2] - P[r2][c1] + P[r1][c1]`",
      "`P[r2 + 1][c2 + 1] + P[r1][c2 + 1] + P[r2 + 1][c1] - P[r1][c1]`"
    ],
    answer: 0,
    explanation: "`P[r2+1][c2+1]` covers `[0..r2] x [0..c2]`. Subtracting `P[r1][c2+1]` removes rows `0..r1-1`, and subtracting `P[r2+1][c1]` removes columns `0..c1-1`. Because the top-left corner `[0..r1-1] x [0..c1-1]` was subtracted twice, we add back `P[r1][c1]`."
  },
  {
    id: "q-psda-2",
    type: "mcq",
    difficulty: "apply",
    title: "2D Difference Array 4-Corner Stencil",
    prompt: "You are given an initially zero $R \\times C$ matrix and $Q = 10^6$ offline rectangular update queries, where each query adds $\\Delta$ to all cells $(r, c)$ in the inclusive subgrid $[r_1, r_2] \\times [c_1, c_2]$.",
    question: "How do you apply each update in $O(1)$ time on a 2D difference array `D` before running a single $O(RC)$ 2D prefix-sum sweep at the end?",
    options: [
      "`D[r1][c1] += d; D[r1][c2 + 1] -= d; D[r2 + 1][c1] -= d; D[r2 + 1][c2 + 1] += d;`",
      "`D[r1][c1] += d; D[r2 + 1][c2 + 1] -= d;`",
      "`D[r1][c1] += d; D[r1][c2] -= d; D[r2][c1] -= d; D[r2][c2] += d;`",
      "Add `d` to `D[r][c1]` and `-d` to `D[r][c2 + 1]` for every row `r` from `r1` to `r2`."
    ],
    answer: 0,
    explanation: "In a 2D difference array, `D[r1][c1] += d` adds `d` to the entire quadrant `[r1..R) x [c1..C)` upon 2D prefix integration. `D[r1][c2+1] -= d` and `D[r2+1][c1] -= d` cancel the effect to the right of `c2` and below `r2`, and `D[r2+1][c2+1] += d` restores the bottom-right quadrant that was cancelled twice."
  },
  {
    id: "q-psda-3",
    type: "mcq",
    difficulty: "apply",
    title: "Subarrays with Sum Divisible by K and Negative Modulo Trap",
    prompt: "You are counting the number of contiguous subarrays of $A[0 \\dots N-1]$ whose sum is divisible by $K > 0$, where $A[i]$ can be negative. You maintain a running prefix sum $P$ and count frequencies of remainders modulo $K$.",
    question: "Why does `rem = P % K` fail in C, C++, Java, and JavaScript when $P < 0$, and what is the mathematically correct normalization?",
    options: [
      "In C/C++/Java/JS, the `%` operator is truncated-toward-zero remainder, returning negative values in $[-(K-1), 0]$ when $P < 0$; normalizing via `rem = ((P % K) + K) % K` maps equivalent congruence classes to $[0, K-1]$.",
      "Modulo division by $K$ is undefined when $P < 0$ in IEEE-754 and two's-complement hardware.",
      "Negative prefix sums require resetting the hash map whenever $P < 0$.",
      "Taking `std::abs(P) % K` maps negative numbers to the exact same congruence class as `((P % K) + K) % K`."
    ],
    answer: 0,
    explanation: "Two prefix sums $P_j$ and $P_i$ have $(P_j - P_i)$ divisible by $K$ iff $P_j \\equiv P_i \\pmod K$. In C++, `-2 % 5 == -2` while `3 % 5 == 3`, even though $3 - (-2) = 5$ is divisible by $5$! Note that `abs(-2) % 5 == 2 != 3` is also wrong; `((P % K) + K) % K` correctly maps `-2` to `3`."
  },
  {
    id: "q-psda-4",
    type: "mcq",
    difficulty: "staff",
    title: "Algebraic Prerequisite for Prefix-Array Range Queries",
    prompt: "A developer attempts to answer arbitrary range minimum queries $\\min_{k=L}^R A[k]$ and range bitwise-OR queries $\\bigvee_{k=L}^R A[k]$ in $O(1)$ time by storing a prefix array $P[i] = P[i-1] \\oplus_{\\text{op}} A[i-1]$ and combining $P[R+1]$ and $P[L]$.",
    question: "Why is it mathematically impossible to answer arbitrary interior range `[L, R]` queries ($L > 0$) from a 1D prefix table alone for `min`, `max`, `gcd`, or bitwise `OR`?",
    options: [
      "Prefix range subtraction $P[R+1] \\odot P[L]^{-1}$ requires the binary operation to form an invertible group (every element must have an inverse); idempotent monoids/semilattices like `min`, `max`, `gcd`, and `|` destroy information and lack inverses.",
      "Because `min`, `max`, and `|` are not associative operations.",
      "Because `min` and `|` are not commutative on 64-bit two's-complement integers.",
      "It is possible if you store both a prefix array and a suffix array of length $N$."
    ],
    answer: 0,
    explanation: "Wait: prefix + suffix arrays only answer queries that touch index $0$, touch index $N-1$, or exclude a range; for an interior range $[L, R]$, prefix $P[R+1]$ mixes $A[0 \\dots L-1]$ with $A[L \\dots R]$. Without an inverse operation (like $-$ for $+$ or $\\oplus$ for $\\oplus$), you cannot cancel the influence of $A[0 \\dots L-1]$ (e.g., if $P[L] = 1$ and $P[R+1] = 1$, there is no way to know whether the minimum inside $[L, R]$ was $1$ or $100$)."
  }
];

window.QUESTION_BANK["two-pointers-invariant-proofs"] = [
  {
    id: "q-tpip-1",
    type: "mcq",
    difficulty: "recall",
    title: "Dijkstra's Dutch National Flag 4-Region Invariant",
    prompt: "In Dijkstra's 3-way Dutch National Flag partition around pivot $p$, pointers `low`, `mid`, and `high` partition the array into four regions: $[0 \\dots \\text{low}-1] < p$, $[\\text{low} \\dots \\text{mid}-1] == p$, $[\\text{mid} \\dots \\text{high}]$ unclassified, and $[\\text{high}+1 \\dots N-1] > p$.",
    question: "When inspecting `A[mid]` and finding `A[mid] > p`, why do we execute `swap(A[mid], A[high]); --high;` WITHOUT incrementing `mid`?",
    options: [
      "Because the element swapped into `A[mid]` came from `A[high]`, which was at the right edge of the unclassified region $[\\text{mid} \\dots \\text{high}]$ and has not yet been compared against $p$.",
      "Because `A[high]` is guaranteed to be strictly less than $p$, requiring a second swap with `A[low]`.",
      "Because incrementing `mid` would cause `low` to overtake `mid`.",
      "To keep the number of swaps strictly less than $N / 2$."
    ],
    answer: 0,
    explanation: "When `A[mid] < p`, we swap `A[low]` and `A[mid]` and increment both `low` and `mid` because `A[low]` belonged to the `== p` region (or `low == mid`). By contrast, `A[high]` belonged to the unclassified region $[\\text{mid} \\dots \\text{high}]$, so the newly arrived value at `A[mid]` must be inspected on the next iteration."
  },
  {
    id: "q-tpip-2",
    type: "mcq",
    difficulty: "apply",
    title: "Container With Most Water Pruning Proof",
    prompt: "In the Container With Most Water problem, we start with $L = 0, R = N - 1$ and area $(R - L) \\cdot \\min(H[L], H[R])$. Suppose at the current step $H[L] \\le H[R]$, and we increment $L \\leftarrow L + 1$ without ever testing pairs $(L, R-1), (L, R-2), \\dots, (L, L+1)$.",
    question: "Why is it mathematically impossible for any skipped pair $(L, k)$ with $L < k < R$ to have a strictly larger area than $(L, R)$?",
    options: [
      "For any $k < R$, the width satisfies $(k - L) < (R - L)$, and the height is bounded by the shorter wall $\\min(H[L], H[k]) \\le H[L] = \\min(H[L], H[R])$; thus both width and height are $\\le$ those of $(L, R)$.",
      "Because $H[k]$ is guaranteed to be $\\le H[R]$ in a sorted array.",
      "Because the prefix sum of heights between $L$ and $k$ is smaller than between $L$ and $R$.",
      "Because any optimal container must use the global maximum height in the array."
    ],
    answer: 0,
    explanation: "Since $H[L] \\le H[R]$, the left wall $H[L]$ is the bottleneck limiting the height of $(L, R)$ to $H[L]$. Pairing $L$ with any narrower right endpoint $k < R$ strictly shrinks the width $(k - L < R - L)$ while the height $\\min(H[L], H[k])$ can never exceed $H[L]$. Thus row $L$ of the pair matrix is completely dominated by $(L, R)$."
  },
  {
    id: "q-tpip-3",
    type: "mcq",
    difficulty: "apply",
    title: "O(1)-Space Two-Pointer Trapping Rain Water Invariant",
    prompt: "In the $O(1)$-space two-pointer algorithm for Trapping Rain Water, we maintain `left = 0`, `right = N - 1`, `max_left = H[0]`, and `max_right = H[N - 1]`. Whenever `max_left <= max_right`, we advance `left` and add `max_left - H[left]` to the total water.",
    question: "Why don't we need to know the true suffix maximum to the right of `left` (i.e., $\\max_{k \\ge \\text{left}} H[k]$) when computing the water trapped at `left`?",
    options: [
      "Because water at `left` is determined by $\\min(\\text{max\\_left}, \\text{true\\_max\\_right}) - H[\\text{left}]$; since $\\text{true\\_max\\_right} \\ge \\text{max\\_right} \\ge \\text{max\\_left}$, the minimum of the two walls is guaranteed to be `max_left`!",
      "Because `max_right` is always equal to the global maximum of the entire array.",
      "Because any water above `max_left` overflows to the right boundary and is counted when `right` moves.",
      "Because `H[left]` is monotonically increasing as `left` moves toward `right`."
    ],
    answer: 0,
    explanation: "The true highest wall to the right of `left` is at least as tall as the highest wall seen so far in `[right .. N-1]` (`true_max_right >= max_right`). When `max_left <= max_right`, transitivity gives `max_left <= max_right <= true_max_right`, so $\\min(\\text{max\\_left}, \\text{true\\_max\\_right}) = \\text{max\\_left}$."
  },
  {
    id: "q-tpip-4",
    type: "mcq",
    difficulty: "staff",
    title: "Branch Misprediction Bottleneck in 3-Way Partition & BlockQuicksort",
    prompt: "You profile a 3-way Quicksort partitioning loop on 10 million random 64-bit integers and find that IPC (Instructions Per Cycle) drops below $0.8$ due to CPU pipeline flushes, even though L1 cache hit rate is $99\\%$.",
    question: "What causes the pipeline flushes in standard 2-way/3-way partitioning, and how does BlockQuicksort (used in Rust's `pdqsort`) eliminate them?",
    options: [
      "Data-dependent branches (`if (a[mid] < pivot)`) on random inputs mispredict ~50% of the time (costing 15–20 cycles each); BlockQuicksort evaluates predicate results into small byte buffers using branchless `cmov`/`setcc` instructions and then executes an unbranched permutation loop.",
      "Swapping 64-bit integers invalidates the L1 instruction cache (`L1i`) via self-modifying code detection.",
      "The `std::swap` function issues full memory fences (`MFENCE`) on x86-64.",
      "Converging pointers on the same 4 KB page trigger hardware false sharing across a single thread's ALU ports."
    ],
    answer: 0,
    explanation: "On uniformly distributed keys, comparing each element to the pivot is a coin flip for the hardware branch predictor. Edelkamp and Weiß's BlockQuicksort (integrated into Orson Peters' `pdqsort`) decouples comparison from element movement: it stores branchless comparison results (`a[i] < pivot`) into small 64-element offset buffers, completely eliminating branch mispredictions."
  }
];

window.QUESTION_BANK["sliding-window-monotonicity"] = [
  {
    id: "q-swm-1",
    type: "mcq",
    difficulty: "recall",
    title: "Amortized O(N) Complexity Proof of Variable Sliding Window",
    prompt: "A variable-size sliding window algorithm consists of an outer `for (right = 0; right < N; ++right)` loop and an inner `while (!valid(left, right)) { ++left; }` loop.",
    question: "Why is the worst-case time complexity of this nested `for` + `while` structure $O(N)$ instead of $O(N^2)$ (assuming the inside of the `while` loop does $O(1)$ work)?",
    options: [
      "By the aggregate method, `left` starts at $0$, only increments (`++left`), and never exceeds $N$; therefore the inner `while` loop body can execute at most $N$ times in total across all $N$ iterations of the outer loop ($\\le 2N$ pointer steps).",
      "Because the inner `while` loop runs at most $O(\\log N)$ times on any single iteration of `right`.",
      "Because `left` is reset to $0$ only when the window size exceeds $\\sqrt{N}$.",
      "Because hardware branch prediction skips the `while` loop in $O(1)$ time."
    ],
    answer: 0,
    explanation: "Even though a single iteration of `right` could advance `left` by $O(N)$ steps, those elements are permanently evicted and never re-examined. Since `left` is monotonically non-decreasing in $[0, N]$, $\\sum_{right=0}^{N-1} (\\text{inner iterations}) = \\text{final\\_left} \\le N$."
  },
  {
    id: "q-swm-2",
    type: "mcq",
    difficulty: "apply",
    title: "Counting Subarrays with Exactly K Distinct Elements",
    prompt: "You need to count the total number of contiguous subarrays of $A[0 \\dots N-1]$ that contain <strong>exactly $K$</strong> distinct integers in $O(N)$ time.",
    question: "Why does the decomposition `atMost(K) - atMost(K - 1)` work in $O(N)$ time, and how many valid subarrays ending at `right` are added at each step of `atMost(K)`?",
    options: [
      "The predicate `distinct(L, R) <= K` is monotonic under interval inclusion: once `left` is advanced so `[left .. right]` has $\\le K$ distinct elements, every suffix `[i .. right]` for $i \\in [\\text{left}, \\text{right}]$ also has $\\le K$ distinct elements, contributing `(right - left + 1)` subarrays.",
      "`atMost(K)` adds `1` subarray per step, and subtracting `atMost(K - 1)` multiplies the count by $K$.",
      "The predicate `distinct(L, R) == K` has a unique left endpoint `left` for each `right`, so `atMost(K)` is unnecessary.",
      "`atMost(K)` counts subarrays of length $\\le K$, which equals the number of distinct elements."
    ],
    answer: 0,
    explanation: "For a fixed `right`, the set of left endpoints `i` with `distinct(i, right) <= K` forms a single contiguous interval `[left .. right]` of size `right - left + 1`. Subtracting the count of subarrays with $\\le K - 1$ distinct elements leaves those with *exactly* $K$ distinct elements."
  },
  {
    id: "q-swm-3",
    type: "mcq",
    difficulty: "apply",
    title: "Why Negative Numbers Break Sliding Window Sum Monotonicity",
    prompt: "Consider finding the length of the shortest contiguous subarray of $A[0 \\dots N-1]$ with sum $\\ge K$, where $A$ contains both positive and negative integers (e.g., `A = [3, -2, 5]`, `K = 4`).",
    question: "Why does a standard two-pointer sliding window fail when $A$ contains negative numbers, and what $O(N)$ structure fixes it?",
    options: [
      "Negative numbers destroy monotonicity: advancing `right` across a negative number decreases the window sum, and advancing `left` past a negative number increases it, so $L^*(R)$ is not monotonic; using Prefix Sums with a Monotonic Increasing Deque restores $O(N)$ time.",
      "Negative numbers cause two's-complement underflow when computing `right - left + 1`.",
      "A standard sliding window still works if we run it twice: once left-to-right and once right-to-left.",
      "Negative numbers require sorting the array first before applying the sliding window."
    ],
    answer: 0,
    explanation: "In `[3, -2, 5]` with `K = 4`, at `R = 2` (`sum = 6 >= 4`), shrinking `L` from `0` to `1` drops `3` (`sum = 3 < 4`), causing the standard loop to stop shrinking and miss `[5]` (`L = 2, R = 2, sum = 5 >= 4`)! Maintaining a monotonic increasing deque of candidate prefix sums $P[L]$ solves the problem in $O(N)$."
  },
  {
    id: "q-swm-4",
    type: "mcq",
    difficulty: "staff",
    title: "L1 Cache Footprint: Flat Alphabet Array vs Hash Map in Byte-Stream Windows",
    prompt: "You are optimizing a high-throughput packet inspection filter that runs a sliding window over 10 GB/s of raw byte payloads (`uint8_t`), tracking character frequencies inside the active window.",
    question: "Why is `int32_t freq[256]` ~25x faster per byte than `std::unordered_map<uint8_t, int32_t>` in this loop?",
    options: [
      "`int32_t freq[256]` is a contiguous 1 KB stack buffer (16 cache lines) accessed via direct indexed addressing in 1 cycle with zero hashing or pointer chasing, whereas `std::unordered_map` hashes each byte and chases heap-allocated bucket nodes.",
      "`std::unordered_map` requires acquiring a kernel mutex lock on every `operator[]` access.",
      "`int32_t freq[256]` is stored entirely inside the CPU's 16 general-purpose registers without touching L1 cache.",
      "`std::unordered_map` recomputes the hash of the entire sliding window on every insertion."
    ],
    answer: 0,
    explanation: "16 general-purpose 64-bit registers hold only 128 bytes, so a 1 KB array lives in L1d cache (32 KB–48 KB), where indexed loads/stores (`freq[byte]++`) retire in 1 cycle. By contrast, `std::unordered_map` incurs hash calculation, bucket lookup, and linked-node pointer dereferences."
  }
];

window.QUESTION_BANK["kadane-subarray-invariants"] = [
  {
    id: "q-ksi-1",
    type: "mcq",
    difficulty: "recall",
    title: "All-Negative Edge Case in Maximum Circular Subarray",
    prompt: "To find the maximum non-empty subarray sum in a circular array $A$, you compute `total_sum`, `global_max` (standard Kadane max), and `global_min` (standard Kadane min), and return `max(global_max, total_sum - global_min)`.",
    question: "What happens when every element in $A$ is strictly negative (e.g., `A = [-5, -2, -8]`), and how must the algorithm handle it?",
    options: [
      "When all elements are negative, `global_min == total_sum`, so `total_sum - global_min == 0` (representing an invalid empty subarray); the algorithm must check `if (global_max < 0) return global_max;` (returning `-2`).",
      "When all elements are negative, `global_min` equals the single largest element `-2`, so `total_sum - global_min` returns `-13`.",
      "The formula `max(global_max, total_sum - global_min)` already returns `-2` without any special check.",
      "When all elements are negative, a circular array has no well-defined maximum subarray."
    ],
    answer: 0,
    explanation: "If every element is negative, the minimum-sum contiguous subarray is the entire array (`global_min = -15 = total_sum`). Subtracting it leaves the empty set (`0`), which beats `global_max = -2` unless guarded by `if (global_max < 0) return global_max;`."
  },
  {
    id: "q-ksi-2",
    type: "mcq",
    difficulty: "apply",
    title: "Promoting Kadane's DP to an Associative Monoid for Parallelism & Segment Trees",
    prompt: "Standard Kadane's algorithm (`cur = max(x, cur + x)`) has a serial loop-carried dependency. To parallelize Maximum Subarray across $P$ threads or maintain it dynamically in a Segment Tree, we summarize each contiguous segment $S$ by a tuple of values.",
    question: "What is the minimal tuple of values per segment $S$ required to combine any two adjacent segments $L$ and $R$ in $O(1)$ time?",
    options: [
      "The 4-tuple `(total_sum, max_prefix_sum, max_suffix_sum, max_subarray_sum)`, where `best(L + R) = max({best_L, best_R, max_suffix_L + max_prefix_R})`.",
      "The 2-tuple `(total_sum, max_subarray_sum)`, where `best(L + R) = max(best_L, best_R, sum_L + sum_R)`.",
      "The 3-tuple `(min_element, max_element, max_subarray_sum)`.",
      "Kadane's recurrence cannot be made associative without $O(N)$ work per merge."
    ],
    answer: 0,
    explanation: "A maximum subarray across $L \\cdot R$ lies either entirely in $L$ (`best_L`), entirely in $R$ (`best_R`), or crosses the boundary—in which case it is the sum of the maximum suffix of $L$ (`suff_L`) and the maximum prefix of $R$ (`pref_R`). Updating `pref` and `suff` in turn requires `sum_L` and `sum_R`."
  },
  {
    id: "q-ksi-3",
    type: "mcq",
    difficulty: "apply",
    title: "Maximum Product Subarray Sign-Flip Invariant",
    prompt: "You are adapting Kadane's algorithm to find the Maximum Product Subarray of an integer array $A$ that contains positive numbers, negative numbers, and zeros.",
    question: "Why is tracking a single `cur_max` insufficient for Maximum Product Subarray, and what state transition is required at each element $x = A[i]$?",
    options: [
      "Multiplying by a negative number $x < 0$ reverses the ordering of products (turning a large negative product into a large positive product); you must maintain both `cur_max` and `cur_min`, swapping them when $x < 0$ before setting `cur_max = max(x, cur_max * x)` and `cur_min = min(x, cur_min * x)`.",
      "You only need to take `std::abs(A[i])` before running standard additive Kadane's algorithm.",
      "You must replace `A[i]` with $\\log |A[i]|$ and run standard Kadane's algorithm.",
      "Tracking `cur_max` and resetting to `1` whenever `A[i] < 0` suffices."
    ],
    answer: 0,
    explanation: "In `[-2, 3, -4]`, the minimum product ending at index 1 is `-6`. When multiplied by `A[2] = -4`, that minimum product `-6` becomes the maximum product `+24`! Tracking `(cur_max, cur_min)` captures both extremes across sign inversions."
  },
  {
    id: "q-ksi-4",
    type: "mcq",
    difficulty: "staff",
    title: "Prefix Sum Interpretation of Length-Bounded Maximum Subarray",
    prompt: "You need to find the maximum sum of a contiguous subarray whose length is <strong>at most $K$</strong> ($1 \\le R - L + 1 \\le K$) in $O(N)$ time.",
    question: "Why does standard scalar Kadane (`cur = max(x, cur + x)`) fail when a maximum length $K$ is imposed, and how is $O(N)$ time achieved?",
    options: [
      "When `cur` exceeds length $K$, simply dropping `A[R - K]` does not yield the optimal shorter suffix; instead, rewrite the sum as $P[R+1] - P[L]$ for $R + 1 - K \\le L \\le R$ and maintain the minimum prefix sum $P[L]$ in that sliding window using a Monotonic Increasing Deque.",
      "Standard Kadane works if we reset `cur = 0` every $K$ elements.",
      "Subtracting `A[R - K]` from `cur` whenever length reaches $K$ always yields the exact maximum subarray of length $\\le K$.",
      "Length-bounded maximum subarray requires $O(N \\log K)$ time using a balanced BST."
    ],
    answer: 0,
    explanation: "Maximizing $\\sum_{i=L}^R A[i] = P[R+1] - P[L]$ subject to $1 \\le R - L + 1 \\le K$ means minimizing $P[L]$ over the sliding index window $L \\in [\\max(0, R + 1 - K),\\; R]$. A monotonic increasing deque maintains the minimum $P[L]$ in $O(1)$ amortized time per step."
  }
];

window.QUESTION_BANK["bit-manipulation-twos-complement"] = [
  {
    id: "q-bmtc-1",
    type: "mcq",
    difficulty: "recall",
    title: "Isolating vs Clearing the Lowest Set Bit",
    prompt: "In two's-complement arithmetic, let $x$ be a non-zero integer whose lowest set bit ($1$) is at bit position $k$ (having value $2^k$).",
    question: "Which pair of bitwise expressions respectively (1) clears the lowest set bit of $x$, and (2) isolates the lowest set bit $2^k$ of $x$?",
    options: [
      "(1) `x & (x - 1)` clears the lowest set bit (`BLSR`); (2) `x & -x` (or `x & (~x + 1)`) isolates the lowest set bit $2^k$ (`BLSI`).",
      "(1) `x & -x` clears the lowest set bit; (2) `x & (x - 1)` isolates the lowest set bit.",
      "(1) `x ^ (x - 1)` clears the lowest set bit; (2) `x | (x - 1)` isolates the lowest set bit.",
      "(1) `x >> 1` clears the lowest set bit; (2) `x & 1` isolates the lowest set bit."
    ],
    answer: 0,
    explanation: "Writing $x = [P \\vert 1 \\vert 0\\dots0_k]$, we have $x - 1 = [P \\vert 0 \\vert 1\\dots1_k]$, so $x \\mathrel{\\&} (x - 1) = [P \\vert 0 \\vert 0\\dots0_k]$. Meanwhile $-x = \\sim x + 1 = [\\sim P \\vert 1 \\vert 0\\dots0_k]$, so $x \\mathrel{\\&} -x = [0\\dots0 \\vert 1 \\vert 0\\dots0_k] = 2^k$."
  },
  {
    id: "q-bmtc-2",
    type: "mcq",
    difficulty: "apply",
    title: "Single Number III: Isolating Two Unique Elements via XOR and Lowbit",
    prompt: "In an array of $N$ integers, every integer appears exactly twice except for two distinct integers $u \\neq v$ that appear once. You XOR all elements together to obtain $S = u \\oplus v \\neq 0$.",
    question: "How do you recover $u$ and $v$ individually in a second $O(N)$ pass using $O(1)$ space?",
    options: [
      "Compute `diff_bit = S & (0u - S)` to isolate a bit position where $u$ and $v$ differ ($1$ in one, $0$ in the other); partition the array into two XOR accumulators based on `(x & diff_bit) != 0`, which cancels all duplicate pairs in each half and leaves $u$ and $v$.",
      "Compute `u = S & (S - 1)` and `v = S ^ u` directly without a second pass.",
      "Sum all elements and solve a quadratic equation with $u \\oplus v$.",
      "XOR all elements at even indices to get $u$ and odd indices to get $v$."
    ],
    answer: 0,
    explanation: "Because $u \\neq v$, $S = u \\oplus v \\neq 0$. Any set bit in $S$ (such as the lowest set bit `diff_bit = S & -S`) must be $1$ in either $u$ or $v$ and $0$ in the other. Partitioning all array elements by whether they have `diff_bit` set sends $u$ and $v$ to different buckets while sending every duplicate pair $(y, y)$ to the same bucket where $y \\oplus y = 0$."
  },
  {
    id: "q-bmtc-3",
    type: "mcq",
    difficulty: "apply",
    title: "Exact Complexity of Submask Enumeration",
    prompt: "In Bitmask Dynamic Programming over $n$ items, you iterate over every mask $M \\in [0, 2^n - 1]$ and then iterate over all non-empty submasks $s$ of $M$ using `for (uint32_t s = M; s > 0; s = (s - 1) & M)`.",
    question: "What is the exact total number of inner loop iterations across all $2^n$ masks (including the $s = 0$ empty submask for each $M$)?",
    options: [
      "$3^n$, because a mask $M$ with $k$ set bits has $2^k$ submasks, and by the Binomial Theorem $\\sum_{k=0}^n \\binom{n}{k} 2^k = (1 + 2)^n = 3^n$.",
      "$4^n = 2^n \\cdot 2^n$, because there are $2^n$ outer masks and up to $2^n$ inner submasks.",
      "$n \\cdot 2^n$, because `s = (s - 1) & M` clears one bit at a time.",
      "$2^{n+1} - 1$."
    ],
    answer: 0,
    explanation: "Each element $i \\in \\{0, \\dots, n-1\\}$ has 3 mutually exclusive states across a valid $(M, s)$ pair with $s \\subseteq M$: (1) $i \\notin M$ and $i \\notin s$, (2) $i \\in M$ and $i \\notin s$, or (3) $i \\in M$ and $i \\in s$. By the product rule, there are $3^n$ such pairs!"
  },
  {
    id: "q-bmtc-4",
    type: "mcq",
    difficulty: "staff",
    title: "C/C++ Undefined Behavior Traps in Bit Manipulation",
    prompt: "During a security audit of a C++ cryptography and bitboard library, you encounter the following three expressions on `int32_t x` and `int k` (where $0 \\le k \\le 64$):\n1. `if (x & 1 << k != 0)`\n2. `int32_t lowbit = x & -x;` (when `x == INT32_MIN`)\n3. `uint64_t mask = (1ULL << k) - 1;` (when `k == 64`)",
    question: "Why are all three expressions buggy or Undefined Behavior in C/C++?",
    options: [
      "(1) `!=` has higher precedence than `&` (parsed as `x & (1 << (k != 0))`, plus `1 << k` overflows 32-bit `int` for $k \\ge 31$); (2) `-INT32_MIN` is signed overflow UB; (3) shifting a 64-bit integer by $k = 64$ bits (`>= width`) is UB and evaluates to `1ULL << 0` on x86-64.",
      "Only (1) is a bug; (2) and (3) are well-defined in C++20 because C++20 standardized two's complement.",
      "`1ULL << 64` deterministically evaluates to `0` on all x86-64 and ARM64 processors.",
      "`x & -x` returns `0` when `x == INT32_MIN`."
    ],
    answer: 0,
    explanation: "Even in C++20 (which mandates two's complement), signed arithmetic overflow (`-INT32_MIN`) and shifting by $\\ge$ bit-width (`1ULL << 64`) remain Undefined Behavior! On x86-64, the `SHL` instruction masks the shift count with `0x3F` (`64 & 63 == 0`), so `(1ULL << 64) - 1` produces `0` instead of `UINT64_MAX`!"
  }
];

window.QUESTION_BANK["bitsets-word-level-parallelism"] = [
  {
    id: "q-bwlp-1",
    type: "mcq",
    difficulty: "recall",
    title: "Word-Level Parallelism in 0-1 Subset Sum DP",
    prompt: "You are given $N = 2000$ positive integers whose total sum is $S = 2 \\times 10^5$, and you want to determine all reachable subset sums. A standard boolean DP array takes $O(N \\cdot S)$ operations ($4 \\times 10^8$ loop steps).",
    question: "How does packing the DP state into a bitset $B$ of `uint64_t` words reduce the time complexity by a factor of $64\\times$?",
    options: [
      "Representing reachable sums as bits in $B$, each number $v$ updates all $S$ states simultaneously via the word-parallel shift-OR transition `B |= (B << v)`, executing in $O(N \\cdot S / 64)$ 64-bit word operations (~$6.25 \\times 10^6$ ops).",
      "Bitsets automatically prune unreachable sums using binary search in $O(N \\log S)$ time.",
      "`std::bitset` uses hardware hash tables to store only the non-zero bits.",
      "Packing into `uint64_t` reduces the outer loop from $N$ iterations to $N / 64$ iterations."
    ],
    answer: 0,
    explanation: "In the transition `new_dp[s] = dp[s] | dp[s - v]`, shifting the bitset left by $v$ bits (`B << v`) aligns bit $s - v$ with bit $s$ across 64 states per word simultaneously, and `B |= (B << v)` unions them in 1 ALU instruction per 64 sums."
  },
  {
    id: "q-bwlp-2",
    type: "mcq",
    difficulty: "apply",
    title: "SWAR Tree-Reduction Popcount Magic Constants",
    prompt: "In the classic branchless 64-bit SWAR (SIMD Within A Register) `popcount` algorithm, the first step executes:\n`x = x - ((x >> 1) & 0x5555555555555555ULL);`",
    question: "What does this instruction accomplish across the 64-bit register in a single parallel step?",
    options: [
      "`0x5555...` (`0b0101...`) masks the even bits of every 2-bit pair `(b1, b0)`; subtracting `b1` from `2*b1 + b0` leaves `b1 + b0` in each 2-bit lane simultaneously (computing 32 parallel 2-bit popcounts).",
      "It clears every odd bit in `x` so the number can be divided by 3.",
      "It reverses the bit order of `x` prior to multiplication.",
      "It isolates the lowest set bit in each byte of `x`."
    ],
    answer: 0,
    explanation: "Each adjacent 2-bit slice has binary value $2b_1 + b_0$. Shifting right by 1 and masking with `0x5555555555555555ULL` (`0b0101...`) produces $b_1$ in each 2-bit slice. Since $(2b_1 + b_0) - b_1 = b_1 + b_0 \\in \\{0, 1, 2\\}$, no borrow can cross a 2-bit boundary!"
  },
  {
    id: "q-bwlp-3",
    type: "mcq",
    difficulty: "apply",
    title: "Fast Set-Bit Iteration over Sparse-to-Medium Bitsets",
    prompt: "You need to iterate over all set bit indices ($1$-bits) in an array `uint64_t words[M]` representing a bitset of $N = 64M$ elements containing $k$ set bits.",
    question: "Which loop body visits all $k$ set bits in $O(M + k)$ time without testing individual zero bits?",
    options: [
      "For each non-zero word `w = words[block]`, loop `while (w != 0) { yield((block << 6) + std::countr_zero(w)); w &= (w - 1); }`.",
      "Loop `for (size_t i = 0; i < N; ++i)` and test `if ((words[i >> 6] >> (i & 63)) & 1)`.",
      "Use binary search (`std::lower_bound`) on `std::popcount(w)` to locate each set bit in $O(\\log 64)$ steps.",
      "Convert each `uint64_t` word to a 64-character binary string and scan for `'1'`."
    ],
    answer: 0,
    explanation: "When `w == 0`, an entire 64-element block is skipped in 1 cycle. When `w != 0`, `std::countr_zero(w)` (`TZCNT`) finds the index of the lowest set bit in 1–3 cycles, and `w &= (w - 1)` (`BLSR`) clears that exact bit so the next iteration jumps straight to the next set bit."
  },
  {
    id: "q-bwlp-4",
    type: "mcq",
    difficulty: "staff",
    title: "Multi-Word Bitset Shift Boundary & Tail-Masking Bugs",
    prompt: "You are implementing `DynamicBitset64::shift_left_or(size_t shift)` on an array of `uint64_t` words representing a bitset of $N = 100$ bits (stored in 2 words of 64 bits). A caller invokes `shift_left_or(64)` followed by `count()`.",
    question: "Which two bugs will corrupt the result if not explicitly guarded in `shift_left_or`?",
    options: [
      "First, when `bit_shift = shift % 64 == 0`, evaluating `words[i - word_shift - 1] >> (64 - bit_shift)` shifts by 64 bits (C++ UB / x86 no-op); second, bits shifted into positions $100 \\dots 127$ of `words[1]` must be zeroed out via a tail mask `(1ULL << 36) - 1` or `count()` will count out-of-bounds bits.",
      "Left-shifting `words` in descending index order (`for i = M-1 down to word_shift`) overwrites words before they are read.",
      "`std::popcount` only works on 32-bit integers and truncates the upper 32 bits of `words[1]`.",
      "When `shift == 64`, `word_shift` is `0` and `bit_shift` is `64`."
    ],
    answer: 0,
    explanation: "When `shift % 64 == 0`, `64 - bit_shift == 64`, which invokes Undefined Behavior on a 64-bit type (`>> 64`). And because the bitset has logical size $N = 100$ inside physical capacity $128$, any bits shifted into indices $100 \\dots 127$ are logically out-of-bounds and must be masked off immediately."
  }
];

window.QUESTION_BANK["in-place-matrix-cyclic-shifts"] = [
  {
    id: "q-imcs-1",
    type: "mcq",
    difficulty: "recall",
    title: "Number of Disjoint Cycles in Bentley's Juggling Rotation",
    prompt: "In Bentley's Juggling algorithm for rotating an array of length $N$ by $k$ positions in place, we move elements along cyclic orbits $i \\mapsto (i + k) \\bmod N$.",
    question: "Into how many disjoint cycles do the $N$ indices decompose, and what is the length of each cycle?",
    options: [
      "Exactly $g = \\gcd(N, k)$ disjoint cycles, each containing exactly $N / \\gcd(N, k)$ elements.",
      "Exactly $k$ disjoint cycles, each containing $N / k$ elements.",
      "Always $1$ single Hamiltonian cycle of length $N$, regardless of $N$ and $k$.",
      "Exactly $N \\bmod k$ cycles of variable length."
    ],
    answer: 0,
    explanation: "By Lagrange's theorem in the cyclic group $\\mathbb{Z}_N$, the subgroup generated by $k$ has order $\\frac{\\text{lcm}(N, k)}{k} = \\frac{N}{\\gcd(N, k)}$. Its cosets partition $\\mathbb{Z}_N$ into $\\gcd(N, k)$ disjoint orbits of equal size."
  },
  {
    id: "q-imcs-2",
    type: "mcq",
    difficulty: "apply",
    title: "Why 3-Reversal Outperforms Juggling in DRAM Despite 3x More Writes",
    prompt: "You benchmark in-place rotation of a 64 MB array of `int32_t` ($N = 1.6 \\times 10^7$) by $k = 10^6 + 3$ (coprime to $N$). Juggling moves each element once ($N$ writes), whereas 3-Reversal swaps elements across three passes ($3N$ writes). Yet 3-Reversal finishes $3.4\\times$ faster than Juggling.",
    question: "What hardware mechanism explains why 3-Reversal is dramatically faster than Juggling on large arrays in RAM?",
    options: [
      "3-Reversal streams sequentially at stride $\\pm 1$, hitting 100% of every 64-byte cache line with hardware L1/L2 prefetching and SIMD vectorization, whereas Juggling jumps by stride $k = 10^6 + 3$, causing an L1 cache miss and dTLB page miss on every single element move!",
      "Juggling computes `std::gcd(N, k)` inside the inner loop on every element.",
      "3-Reversal executes in $O(\\log N)$ time while Juggling is $O(N)$.",
      "Modern CPUs cannot pipeline `std::move` instructions."
    ],
    answer: 0,
    explanation: "When $k$ is large, consecutive accesses in Juggling (`cur` and `(cur + k) % N`) are megabytes apart in virtual memory. Every single read/write fetches a whole 64-byte cache line just to use 4 bytes (6.25% cache-line utilization) and thrashes the TLB. 3-Reversal uses 100% of every cache line sequentially."
  },
  {
    id: "q-imcs-3",
    type: "mcq",
    difficulty: "apply",
    title: "In-Place 90-Degree Clockwise vs Counter-Clockwise Matrix Rotation",
    prompt: "You are given an $N \\times N$ matrix `M` and must rotate it $90^\\circ$ clockwise in place using $O(1)$ extra space via Dihedral Group $D_4$ reflections.",
    question: "Which two-step sequence rotates `M` $90^\\circ$ clockwise in place, and why must the transpose loop restrict `c` to `c > r`?",
    options: [
      "First transpose across the main diagonal (`swap(M[r][c], M[c][r])` for `0 <= r < N` and `r + 1 <= c < N`), then reverse each row horizontally; looping `c` from `0` to `N - 1` during transpose would swap every off-diagonal element twice, restoring the original matrix!",
      "First reverse each row horizontally, then transpose across the main diagonal (which actually produces a $90^\\circ$ counter-clockwise rotation).",
      "Reverse each row horizontally, then reverse each column vertically (which produces a $180^\\circ$ rotation).",
      "Transpose across both the main diagonal and the anti-diagonal."
    ],
    answer: 0,
    explanation: "Transposing maps $(r, c) \\mapsto (c, r)$; then reversing each row maps $(c, r) \\mapsto (c, N - 1 - r)$, which is the exact coordinate transform of a $90^\\circ$ clockwise rotation. Note that the dihedral group $D_4$ is non-abelian: reversing rows first and then transposing yields $(N - 1 - c, r)$ ($90^\\circ$ counter-clockwise)!"
  },
  {
    id: "q-imcs-4",
    type: "mcq",
    difficulty: "staff",
    title: "Power-of-Two Matrix Transpose Cache Conflict Misses",
    prompt: "You benchmark a naive in-place matrix transpose on an $N \\times N$ matrix of `float` (4 bytes) for $N = 1020$, $N = 1024$, and $N = 1028$. At $N = 1024$, execution time suddenly spikes by $7\\times$ compared to $N = 1020$ and $N = 1028$.",
    question: "What causes the $7\\times$ latency spike at $N = 1024$, and how does $B \\times B$ cache tiling solve it?",
    options: [
      "At $N = 1024$, each row is $1024 \\times 4 = 4096$ bytes apart—an exact multiple of the L1d cache set index modulus—so reading a column `M[0..N-1][c]` maps every row to the exact same 8-way L1d cache set (conflict miss thrashing); $32 \\times 32$ cache tiling keeps active working blocks inside distinct cache sets.",
      "At $N = 1024$, the CPU switches from 32-bit addressing to 64-bit addressing.",
      "Compilers disable optimization when loop bounds are powers of two.",
      "At $N = 1024$, `r * N + c` overflows a 32-bit signed integer."
    ],
    answer: 0,
    explanation: "A typical 32 KB 8-way set-associative L1d cache has 64 sets of 64-byte lines (stride $64 \\times 64 = 4096$ bytes). When $N = 1024$ floats, vertically adjacent elements `M[r][c]` and `M[r+1][c]` are separated by exactly $4096$ bytes, colliding into the exact same cache set and evicting each other after just 8 rows!"
  }
];

window.QUESTION_BANK["boyer-moore-majority-misra-gries"] = [
  {
    id: "q-bmmg-1",
    type: "mcq",
    difficulty: "recall",
    title: "Why Boyer-Moore Majority Vote Requires a Second Pass When Majority Is Unproven",
    prompt: "You run Pass 1 of the Boyer-Moore Majority Vote algorithm on the array `nums = [1, 1, 2, 2, 3]`. At termination, `candidate == 3` and `count == 1`.",
    question: "Why does `candidate == 3` have `count > 0` even though `3` appears only once ($20\\%$ of the array), and what does Pass 1 actually guarantee?",
    options: [
      "Pass 1 is an elimination tournament: if a strict majority element ($> N/2$) exists, it is guaranteed to be the surviving `candidate`; if no majority exists, the last uncancelled element survives arbitrarily, making a second $O(N)$ verification pass mandatory.",
      "Because `count` was initialized to `1` instead of `0`.",
      "Because Boyer-Moore only works on sorted arrays.",
      "If `count > 0` at the end of Pass 1, the candidate is guaranteed to appear at least $N / 3$ times."
    ],
    answer: 0,
    explanation: "In `[1, 1, 2, 2, 3]`, the two `1`s and two `2`s mutually annihilate each other (`count` drops back to `0` at index 3), leaving `3` unchallenged at index 4. Thus `count > 0` after Pass 1 never proves majority without Pass 2."
  },
  {
    id: "q-bmmg-2",
    type: "mcq",
    difficulty: "apply",
    title: "Misra-Gries Candidate Slot Ordering Bug (k = 3)",
    prompt: "A developer writes Pass 1 of the $k = 3$ Misra-Gries algorithm (to find all elements appearing $> \\lfloor N / 3 \\rfloor$ times) using the following `if/else` order:\n```cpp\nif (count1 == 0) { cand1 = x; count1 = 1; }\nelse if (count2 == 0) { cand2 = x; count2 = 1; }\nelse if (x == cand1) { ++count1; }\nelse if (x == cand2) { ++count2; }\nelse { --count1; --count2; }\n```",
    question: "On the input `nums = [7, 7, 7, 8, 9]`, what bug does this branch ordering trigger on the second element (`nums[1] == 7`)?",
    options: [
      "Because `count2 == 0` is checked BEFORE `x == cand1`, the second `7` is placed into `cand2` (`cand1 = 7, cand2 = 7`), corrupting the invariant that `cand1` and `cand2` track distinct keys!",
      "It causes `count1` and `count2` to underflow below zero.",
      "It skips the third element `nums[2]`.",
      "The branch order is completely equivalent and produces the right answer on all inputs."
    ],
    answer: 0,
    explanation: "At `nums[0] = 7`, `cand1 = 7, count1 = 1, count2 = 0`. At `nums[1] = 7`, if `else if (count2 == 0)` is evaluated before `else if (x == cand1)`, then `cand2` also becomes `7`! You must ALWAYS check `x == cand1` and `x == cand2` before claiming an empty `count == 0` slot."
  },
  {
    id: "q-bmmg-3",
    type: "mcq",
    difficulty: "apply",
    title: "Misra-Gries Frequency Estimation Bound",
    prompt: "You configure a Misra-Gries heavy-hitters summary with $k - 1 = 99$ counters ($k = 100$) to monitor a stream of $N = 10^8$ packet destination IPs in a router.",
    question: "If an IP address $x$ has true frequency $f(x)$ in the stream and estimated counter $\\hat{f}(x)$ in the Misra-Gries table after 1 pass, what deterministic interval is $\\hat{f}(x)$ guaranteed to satisfy?",
    options: [
      "$f(x) - \\frac{N}{100} \\le \\hat{f}(x) \\le f(x)$, meaning the estimate never overcounts and undercounts by at most $1\\%$ of the stream ($10^6$ packets).",
      "$f(x) \\le \\hat{f}(x) \\le f(x) + \\frac{N}{100}$ (it only overcounts due to hash collisions, like Count-Min Sketch).",
      "$\\hat{f}(x) = f(x)$ exactly for the top 99 most frequent elements.",
      "$f(x) - \\frac{N}{2} \\le \\hat{f}(x) \\le f(x)$."
    ],
    answer: 0,
    explanation: "Every decrement event reduces the count of $k = 100$ distinct elements simultaneously. Since $100$ elements are consumed per decrement event, at most $D \\le N / 100$ decrement events can occur across the entire stream, so any element loses at most $N / 100$ from its true count."
  },
  {
    id: "q-bmmg-4",
    type: "mcq",
    difficulty: "staff",
    title: "Parallel & Distributed Merging of Boyer-Moore / Misra-Gries Summaries",
    prompt: "You need to find the majority element ($> N/2$) of a 100 TB dataset partitioned across 1,000 distributed worker nodes.",
    question: "How can the 1,000 worker nodes combine their local Boyer-Moore `(cand_i, count_i)` results in a single AllReduce pass without shuffling the raw data?",
    options: [
      "The cancellation operator is associative: two summaries `(c1, k1)` and `(c2, k2)` merge in $O(1)$ into `(c1, k1 + k2)` if `c1 == c2`, or `(c1, k1 - k2)` if `k1 >= k2`, else `(c2, k2 - k1)`—preserving the exact pairwise cancellation invariant across a parallel reduction tree!",
      "Each worker returns its local majority candidate with weight `1`, and we take the majority of the 1,000 unweighted votes.",
      "Boyer-Moore cannot be parallelized because candidate replacement depends on element order.",
      "Workers must sort their partitions first before running Boyer-Moore."
    ],
    answer: 0,
    explanation: "A local Boyer-Moore summary `(c1, k1)` represents $k_1$ surviving copies of `c1` after all internal pairwise cancellations in shard 1. Merging shard 1's $k_1$ copies of `c1` with shard 2's $k_2$ copies of `c2` either adds their counts (if `c1 == c2`) or annihilates $\\min(k_1, k_2)$ pairs (leaving $|k_1 - k_2|$ copies of the larger survivor)."
  }
];

window.QUESTION_BANK["build-dynamic-circular-deque"] = [
  {
    id: "q-bdcd-1",
    type: "mcq",
    difficulty: "recall",
    title: "Bitwise Masking Prerequisite in Power-of-Two Ring Buffers",
    prompt: "In a circular deque of capacity `cap_`, we replace the modulo operator `(head_ + i) % cap_` with the bitwise AND expression `(head_ + i) & (cap_ - 1)`.",
    question: "Under what exact mathematical condition on `cap_` is `x & (cap_ - 1)` guaranteed to equal `x % cap_` for all unsigned integers `x`?",
    options: [
      "If and only if `cap_` is an exact power of two ($\\text{cap\\_} = 2^p$ for some integer $p \\ge 0$), so that `cap_ - 1` is a contiguous mask of $p$ low-order $1$-bits.",
      "Whenever `cap_` is an even integer.",
      "Whenever `cap_` is a prime number.",
      "For any capacity `cap_` as long as `head_ + i < 2 * cap_`."
    ],
    answer: 0,
    explanation: "In binary, division by $2^p$ has remainder equal to the lowest $p$ bits of $x$. Only when $\\text{cap\\_} = 2^p$ does $\\text{cap\\_} - 1 = 2^p - 1 = \\text{0b00..011..1}_p$ have $1$s in all $p$ low bit positions and $0$s everywhere else."
  },
  {
    id: "q-bdcd-2",
    type: "mcq",
    difficulty: "apply",
    title: "Unsigned Decrement Wrap-Around in push_front",
    prompt: "In a circular buffer with power-of-two capacity `cap_ = 8` (`mask = 7 = 0b0111`) and `std::size_t head_ = 0`, a caller invokes `push_front(val)`, which executes:\n`head_ = (head_ - 1) & (cap_ - 1);`",
    question: "What happens when `head_ == 0` and `head_ - 1` is evaluated in unsigned `std::size_t` arithmetic before `& (cap_ - 1)`?",
    options: [
      "Unsigned subtraction wraps `0ULL - 1ULL` around modulo $2^{64}$ to `UINT64_MAX` (`0xFFFFFFFFFFFFFFFF`), and bitwise AND with `cap_ - 1` (`0b111`) cleanly extracts `7` (`cap_ - 1`) in 1 cycle with zero branches!",
      "Unsigned underflow is Undefined Behavior in C++ and crashes under UBSan.",
      "`(0 - 1) & 7` evaluates to `0`.",
      "It requires a branch `if (head_ == 0) head_ = cap_ - 1; else --head_;` because two's complement corrupts the low bits on underflow."
    ],
    answer: 0,
    explanation: "In C and C++, unsigned integer arithmetic is defined as modular arithmetic modulo $2^w$. Since $2^w$ is divisible by $2^p = \\text{cap\\_}$, $(0 - 1) \\bmod 2^w = 2^w - 1 \\equiv -1 \\equiv \\text{cap\\_} - 1 \\pmod{\\text{cap\\_}}$. Masking with `cap_ - 1` yields `7` branchlessly."
  },
  {
    id: "q-bdcd-3",
    type: "mcq",
    difficulty: "apply",
    title: "Why Doubling a Wrapped Ring Buffer Requires Unwrapping Two Spans",
    prompt: "Suppose a circular deque of capacity $C = 8$ is full (`size_ = 8`) with `head_ = 5`, so logical elements $0, 1, 2$ live at physical indices $5, 6, 7$ and logical elements $3, 4, 5, 6, 7$ wrap around to physical indices $0, 1, 2, 3, 4$. Now `push_back` triggers a resize to `new_cap = 16`.",
    question: "What goes wrong if `grow()` simply copies `data_[0 .. 7]` to `new_data[0 .. 7]` and keeps `head_ = 5`?",
    options: [
      "Under `new_cap = 16` (`mask = 15`), logical index $3$ maps to `(5 + 3) & 15 == 8` (uninitialized memory!) instead of wrapping to index $0$, splitting the ring; `grow()` must unwrap `[head_ .. C)` and `[0 .. head_)` into `new_data[0 .. size_)` and reset `head_ = 0`.",
      "Nothing goes wrong; keeping `head_ = 5` preserves all elements in their exact logical order.",
      "Only `push_front` breaks, while `operator[]` and `push_back` continue to work.",
      "`new_cap` must be $15$ instead of $16$ to preserve the modulo ring."
    ],
    answer: 0,
    explanation: "The physical wrap at index $8 \\to 0$ depended on the modulus being $C = 8$. Once the modulus changes to $2C = 16$, index $5 + 3 = 8$ no longer wraps to $0$! Unwrapping the two contiguous spans into `new_data[0 .. size_)` and setting `head_ = 0` restores a contiguous layout."
  },
  {
    id: "q-bdcd-4",
    type: "mcq",
    difficulty: "staff",
    title: "C++ std::deque Segmented Map vs Rust VecDeque Flat Ring Buffer",
    prompt: "Why does the C++ standard library implement `std::deque<T>` as an array of pointers to fixed-size heap chunks (e.g., 512-byte blocks in `libstdc++`) rather than a single geometrically resizing circular buffer like Rust's `VecDeque<T>` or Java's `ArrayDeque<E>`?",
    question: "Which C++ Standard specification requirement forces `std::deque` to use a segmented chunk directory instead of a single flat ring buffer?",
    options: [
      "The C++ Standard mandates that `std::deque::push_front` and `std::deque::push_back` must NEVER invalidate pointers or references (`T&`) to existing elements in the deque—forbidding reallocating and moving existing elements to a new buffer.",
      "C++ does not support bitwise AND masking on unsigned types.",
      "A segmented chunk directory has fewer L1 cache misses than a single contiguous ring buffer.",
      "The C++ Standard requires `std::deque::operator[]` to take $O(\\log N)$ time."
    ],
    answer: 0,
    explanation: "In C++, `std::deque` guarantees reference stability across `push_front` and `push_back` (though iterators are invalidated). To keep existing elements at fixed memory addresses during growth, `std::deque` allocates new fixed-size chunks and only resizes the outer pointer-map array—trading away L1 cache locality and single-indirection indexing."
  }
];
