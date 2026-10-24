window.QUESTION_BANK = window.QUESTION_BANK || {};

window.QUESTION_BANK["ram-model-vs-modern-cpu"] = [
  {
    id: "ram-model-vs-modern-cpu-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Standard x86-64 CPU Cache Line Quantum",
    prompt: "On modern x86-64 processors, what is the standard unit of data transfer (cache line size) between main memory (DRAM) and the L1/L2/L3 SRAM caches, and how many 64-bit integers (`int64_t`) fit inside one cache line?",
    question: "On modern x86-64 processors, what is the standard unit of data transfer (cache line size) between main memory (DRAM) and the L1/L2/L3 SRAM caches, and how many 64-bit integers (`int64_t`) fit inside one cache line?",
    options: [
      "64 bytes per cache line, holding 8 contiguous 64-bit integers",
      "8 bytes per cache line, holding 1 single 64-bit integer register word",
      "4096 bytes per cache line, matching the OS virtual memory page size",
      "512 bytes per cache line, holding 64 contiguous 64-bit integers"
    ],
    answer: 0,
    explanation: "Standard x86-64 processors fetch and evict memory in aligned 64-byte cache lines (512 bits). When a program reads a single 8-byte `int64_t` from a contiguous array, the memory controller fetches the entire 64-byte block containing 8 adjacent `int64_t` elements into L1 cache."
  },
  {
    id: "ram-model-vs-modern-cpu-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Cache-Line Miss Ratio: Stride-1 Array vs Pointer-Chasing Linked List",
    prompt: "You traverse N = 64,000 64-bit integers (`8 bytes` each) stored in a contiguous array versus a heap-allocated singly linked list whose nodes are randomly scattered across a 1 GB heap. Ignoring hardware prefetching, how many L1 cache-line fills (64B each) are triggered by the array scan versus the linked list scan?",
    question: "You traverse N = 64,000 64-bit integers (`8 bytes` each) stored in a contiguous array versus a heap-allocated singly linked list whose nodes are randomly scattered across a 1 GB heap. Ignoring hardware prefetching, how many L1 cache-line fills (64B each) are triggered by the array scan versus the linked list scan?",
    options: [
      "8,000 cache-line fills for the contiguous array vs ~64,000 cache-line fills for the linked list",
      "64,000 cache-line fills for both because both perform 64,000 memory reads in the RAM model",
      "1,000 cache-line fills for the array vs 8,000 for the linked list",
      "64,000 cache-line fills for the array vs 32,000 for the linked list"
    ],
    answer: 0,
    explanation: "In the contiguous array, every 64-byte cache line holds B = 64 / 8 = 8 consecutive integers, so scanning 64,000 elements requires 64,000 / 8 = 8,000 cache-line fills (1 miss followed by 7 L1 hits). In a scattered linked list, each node sits in a distinct cache line, incurring ~64,000 cache misses."
  },
  {
    id: "ram-model-vs-modern-cpu-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Serial Load-to-Use Dependency in Pointer Chasing",
    prompt: "Why does `curr = curr->next` in a linked list defeat a modern CPU's Out-of-Order (OoO) Reorder Buffer (ROB) and hardware prefetcher, whereas `sum += a[i]` in an array allows multiple cache misses to overlap in flight?",
    question: "Why does `curr = curr->next` in a linked list defeat a modern CPU's Out-of-Order (OoO) Reorder Buffer (ROB) and hardware prefetcher, whereas `sum += a[i]` in an array allows multiple cache misses to overlap in flight?",
    options: [
      "Because the memory address of node k+1 is stored as data inside node k, creating a serial load-to-use dependency where the next load cannot even be issued until the 200-cycle DRAM read of node k completes",
      "Because CPU instruction decoders cannot decode pointer dereference instructions (`mov reg, [reg]`) speculatively",
      "Because linked list pointers use 128-bit virtual addresses that bypass the L1 and L2 caches entirely",
      "Because `sum += a[i]` executes entirely inside the floating-point unit without reading memory"
    ],
    answer: 0,
    explanation: "In `sum += a[i]`, the address `&a[i+1]` is computed via simple index arithmetic (`base + 8*(i+1)`), allowing the ROB and hardware stream prefetcher to issue 10+ overlapping memory requests (Memory-Level Parallelism > 10). In `curr = curr->next`, the address of the next node is unknown until the current DRAM read finishes, collapsing MLP to 1."
  },
  {
    id: "ram-model-vs-modern-cpu-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Multithreaded False Sharing on Adjacent Array Counters",
    prompt: "Four worker threads pinned to 4 CPU cores increment their own dedicated counter in a shared global array `uint64_t counters[4]` (`Thread t` increments `counters[t]` in a tight loop). Despite having zero lock contention and touching disjoint array indices, throughput drops by 40× compared to local stack variables. What hardware mechanism causes this?",
    question: "Four worker threads pinned to 4 CPU cores increment their own dedicated counter in a shared global array `uint64_t counters[4]` (`Thread t` increments `counters[t]` in a tight loop). Despite having zero lock contention and touching disjoint array indices, throughput drops by 40× compared to local stack variables. What hardware mechanism causes this?",
    options: [
      "False sharing: all four 8-byte counters (32 bytes total) reside inside the exact same 64-byte cache line, forcing the MESI cache-coherence protocol to invalidate and bounce that cache line across L3 interconnects on every core write",
      "TLB shootdowns caused by `counters[4]` spanning across four distinct 4 KB virtual memory pages",
      "L1 instruction cache eviction caused by four cores executing the same instruction address simultaneously",
      "DRAM row-buffer conflicts caused by 64-bit integer overflow"
    ],
    answer: 0,
    explanation: "Cache coherence (MESI/MOESI) tracks ownership at the granularity of a 64-byte cache line, not individual 8-byte words. Because `uint64_t counters[4]` occupies 32 contiguous bytes, all 4 threads fight for Exclusive/Modified ownership of the same 64B line. Aligning each counter to `alignas(64)` places them on separate cache lines and eliminates the stall."
  }
];

window.QUESTION_BANK["asymptotic-notations-rigor"] = [
  {
    id: "asymptotic-notations-rigor-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Quantifier Distinction Between Big-O and Little-o",
    prompt: "How does the formal quantifier definition of `f(n) ∈ o(g(n))` (little-o) differ from `f(n) ∈ O(g(n))` (Big-O)?",
    question: "How does the formal quantifier definition of `f(n) ∈ o(g(n))` (little-o) differ from `f(n) ∈ O(g(n))` (Big-O)?",
    options: [
      "Big-O requires the inequality `0 ≤ f(n) ≤ c·g(n)` to hold for SOME constant `c > 0`, whereas little-o requires `0 ≤ f(n) < c·g(n)` to hold for EVERY constant `c > 0` (for sufficiently large `n ≥ n₀`)",
      "Big-O applies only to worst-case inputs, whereas little-o applies only to best-case inputs",
      "Big-O allows `n₀` to depend on `n`, whereas little-o requires `n₀ = 1`",
      "Big-O requires `lim (f(n)/g(n)) = 0`, whereas little-o requires `lim (f(n)/g(n)) = 1`"
    ],
    answer: 0,
    explanation: "`f(n) ∈ O(g(n))` uses an existential quantifier `∃c > 0, ∃n₀ > 0` such that `f(n) ≤ c·g(n)` for all `n ≥ n₀`. By contrast, `f(n) ∈ o(g(n))` uses a universal quantifier `∀c > 0, ∃n₀ > 0` such that `f(n) < c·g(n)` for all `n ≥ n₀`, which means `f(n)/g(n) → 0` as `n → ∞`."
  },
  {
    id: "asymptotic-notations-rigor-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Asymptotic Growth of the Harmonic Divisor Loop",
    prompt: "What is the tight asymptotic time complexity `Θ(...)` of the nested loop `for (int i = 1; i <= n; i++) for (int j = i; j <= n; j += i) work();`?",
    question: "What is the tight asymptotic time complexity `Θ(...)` of the nested loop `for (int i = 1; i <= n; i++) for (int j = i; j <= n; j += i) work();`?",
    options: [
      "Θ(n log n), because the inner loop executes ⌊n/i⌋ times for each i, summing to n · H_n = n(1 + 1/2 + 1/3 + ... + 1/n)",
      "Θ(n²), because there are two nested loops bounded by n",
      "Θ(n log log n), matching the prime harmonic sum over prime steps only",
      "Θ(n √n), because the average step size is √n"
    ],
    answer: 0,
    explanation: "For a fixed outer index `i`, the inner loop increments `j` by `i` until `n`, executing `⌊n/i⌋` times. Summing across `i = 1..n` gives `Σ ⌊n/i⌋ = n · Σ (1/i) - O(n) = n · H_n = Θ(n log n)` by the Harmonic series identity."
  },
  {
    id: "asymptotic-notations-rigor-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Stirling's Approximation & Factorial Asymptotics",
    prompt: "Which of the following statements about `n!` and `log₂(n!)` is mathematically correct for `n → ∞`?",
    question: "Which of the following statements about `n!` and `log₂(n!)` is mathematically correct for `n → ∞`?",
    options: [
      "`log₂(n!) ∈ Θ(n log n)`, while `n! ∈ ω(2^n)` and `n! ∈ o(n^n)`",
      "`log₂(n!) ∈ Θ(n²)`, and `n! ∈ Θ(2^n)`",
      "`log₂(n!) ∈ Θ(n)`, and `n! ∈ Θ(n^n)`",
      "`log₂(n!) ∈ o(n log n)`, because `n! ≤ (n/2)^n`"
    ],
    answer: 0,
    explanation: "By Stirling's formula, `n! = √(2πn) · (n/e)^n · (1 + Θ(1/n))`. Taking base-2 logarithms gives `log₂(n!) = n log₂ n - n log₂ e + Θ(log n) = Θ(n log n)`. Meanwhile, `(n/e)^n` grows strictly faster than `2^n` (for `n ≥ 6`) and strictly slower than `n^n` because of the `e^(-n)` factor."
  },
  {
    id: "asymptotic-notations-rigor-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Exponentiation Fallacy & Failure of Asymptotic Trichotomy",
    prompt: "Evaluate the following two claims: (Claim I) If `f(n) ∈ Θ(n)`, then `2^{f(n)} ∈ Θ(2^n)`. (Claim II) For any two positive functions `f(n)` and `g(n)`, either `f(n) ∈ O(g(n))` or `f(n) ∈ Ω(g(n))`. Which is true?",
    question: "Evaluate the following two claims: (Claim I) If `f(n) ∈ Θ(n)`, then `2^{f(n)} ∈ Θ(2^n)`. (Claim II) For any two positive functions `f(n)` and `g(n)`, either `f(n) ∈ O(g(n))` or `f(n) ∈ Ω(g(n))`. Which is true?",
    options: [
      "Both claims are FALSE: `f(n) = 2n ∈ Θ(n)` gives `2^{2n} = 4^n ∈ ω(2^n)`, and oscillating functions like `f(n) = n^{1 + sin n}` vs `g(n) = n` satisfy neither `O(n)` nor `Ω(n)`",
      "Claim I is TRUE and Claim II is FALSE",
      "Claim I is FALSE and Claim II is TRUE",
      "Both claims are TRUE for all monotonically increasing functions and all oscillating functions"
    ],
    answer: 0,
    explanation: "Constant factors inside an exponent change the base of the exponential (`2^{cn} = (2^c)^n`), so `2^{2n} / 2^n = 2^n → ∞`, refuting Claim I. Claim II (trichotomy) fails because functions can oscillate across infinitely many crossovers (e.g., `n^{1 + sin n}` fluctuates between `1` and `n²`, so its ratio with `n` has `limsup = ∞` and `liminf = 0`)."
  }
];

window.QUESTION_BANK["recurrence-relations-master-theorem"] = [
  {
    id: "recurrence-relations-master-theorem-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Number of Leaves & Watershed Function in a Recursion Tree",
    prompt: "In the divide-and-conquer recurrence `T(n) = a T(n/b) + f(n)` with `a ≥ 1` and `b > 1`, what is the recursion tree depth and how many leaf subproblems exist at the bottom level?",
    question: "In the divide-and-conquer recurrence `T(n) = a T(n/b) + f(n)` with `a ≥ 1` and `b > 1`, what is the recursion tree depth and how many leaf subproblems exist at the bottom level?",
    options: [
      "Depth is `log_b(n)` and the number of leaves is `a^{log_b(n)} = n^{log_b(a)}`",
      "Depth is `log_a(n)` and the number of leaves is `b^{log_a(n)} = n^{log_a(b)}`",
      "Depth is `n/b` and the number of leaves is `a · (n/b)`",
      "Depth is `log₂(n)` and the number of leaves is always `n`"
    ],
    answer: 0,
    explanation: "Each level divides the problem size by `b`, reaching size 1 at depth `d = log_b(n)`. Since the branching factor is `a`, level `d` has `a^d = a^{log_b(n)} = n^{log_b(a)}` leaves."
  },
  {
    id: "recurrence-relations-master-theorem-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Solving Polylogarithmic Gap Recurrences (Generalized Case 2)",
    prompt: "Consider the recurrence `T(n) = 4 T(n/2) + n² / log₂(n)`. Why does Master Theorem Case 1 NOT apply, and what is the tight closed-form solution?",
    question: "Consider the recurrence `T(n) = 4 T(n/2) + n² / log₂(n)`. Why does Master Theorem Case 1 NOT apply, and what is the tight closed-form solution?",
    options: [
      "The watershed is `n^{log₂ 4} = n²`; `f(n) = n² / log n` is smaller than `n²` only by a logarithmic factor (not polynomially smaller `n^{2-ε}`), so generalized Case 2 (`k = -1`) gives `Θ(n² log log n)`",
      "Case 1 applies with `ε = 0.5`, yielding `Θ(n²)`",
      "Standard Case 2 applies with `k = 1`, yielding `Θ(n² log² n)`",
      "Case 3 applies because `n² / log n` dominates at the root, yielding `Θ(n² / log n)`"
    ],
    answer: 0,
    explanation: "Here `n^{log_b a} = n^{log₂ 4} = n²`. Although `f(n) = n² / log n` is asymptotically smaller than `n²`, the ratio `n² / f(n) = log n` is `o(n^ε)` for every `ε > 0`, violating Case 1's polynomial gap requirement. Summing work across `log₂ n` levels yields `n² Σ_{j=1}^{log n} (1/j) = Θ(n² log log n)`."
  },
  {
    id: "recurrence-relations-master-theorem-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Change of Variables for Square-Root Recurrences",
    prompt: "What is the tight asymptotic bound for the recurrence `T(n) = 2 T(√n) + log₂(n)` (which governs helper operations in van Emde Boas trees)?",
    question: "What is the tight asymptotic bound for the recurrence `T(n) = 2 T(√n) + log₂(n)` (which governs helper operations in van Emde Boas trees)?",
    options: [
      "`Θ(log n · log log n)`, obtained by substituting `m = log₂(n)` to get `S(m) = 2 S(m/2) + m = Θ(m log m)`",
      "`Θ(√n log n)`, by Master Theorem Case 2",
      "`Θ(n)`, because `2 · √n` squares at each level",
      "`Θ(log² n)`, because the recursion depth is `log₂(n)`"
    ],
    answer: 0,
    explanation: "Let `m = log₂ n` so `n = 2^m` and `√n = 2^{m/2}`. Defining `S(m) = T(2^m)` transforms the recurrence into `S(m) = 2 S(m/2) + m`. By Master Theorem Case 2 (`a=2, b=2, f(m)=m`), `S(m) = Θ(m log m)`. Substituting back `m = log₂ n` gives `T(n) = Θ(log n · log log n)`."
  },
  {
    id: "recurrence-relations-master-theorem-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Strengthening Inductive Hypotheses in the Substitution Method",
    prompt: "You want to prove by mathematical induction that `T(n) = 2 T(⌊n/2⌋) + 1` satisfies `T(n) ∈ O(n)`. When you test the inductive hypothesis `T(k) ≤ c·k`, the inductive step yields `T(n) ≤ 2(c·(n/2)) + 1 = c·n + 1`, which fails to be `≤ c·n`. How do you fix this proof rigorously?",
    question: "You want to prove by mathematical induction that `T(n) = 2 T(⌊n/2⌋) + 1` satisfies `T(n) ∈ O(n)`. When you test the inductive hypothesis `T(k) ≤ c·k`, the inductive step yields `T(n) ≤ 2(c·(n/2)) + 1 = c·n + 1`, which fails to be `≤ c·n`. How do you fix this proof rigorously?",
    options: [
      "Strengthen the inductive hypothesis by subtracting a lower-order term: assume `T(k) ≤ c·k - d`, which yields `T(n) ≤ 2(c(n/2) - d) + 1 = c·n - 2d + 1 ≤ c·n - d` for `d ≥ 1`",
      "Add a lower-order term `T(k) ≤ c·k + d`, which cancels the `+ 1`",
      "Replace `c·n + 1` with `c'·n` by choosing a slightly larger constant `c' = c + 1/n` at every recursion level",
      "Conclude that `T(n)` cannot be `O(n)` and must instead be `Θ(n log n)`"
    ],
    answer: 0,
    explanation: "Changing the constant `c` between levels is a classic mathematical fallacy (since `Σ (1/n)` across `log n` levels diverges or inflates `c`). Subtracting a lower-order term `T(k) ≤ c·k - d` gets doubled by the `2 T(n/2)` branching factor into `-2d`, easily absorbing the `+1` additive overhead when `d ≥ 1`."
  }
];

window.QUESTION_BANK["akra-bazzi-uneven-divides"] = [
  {
    id: "akra-bazzi-uneven-divides-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Characteristic Exponent Equation in Akra-Bazzi",
    prompt: "For a general divide-and-conquer recurrence `T(x) = g(x) + Σ_{i=1..k} a_i T(b_i x + h_i(x))` with `a_i > 0` and `0 < b_i < 1`, how is the characteristic exponent `p` defined?",
    question: "For a general divide-and-conquer recurrence `T(x) = g(x) + Σ_{i=1..k} a_i T(b_i x + h_i(x))` with `a_i > 0` and `0 < b_i < 1`, how is the characteristic exponent `p` defined?",
    options: [
      "`p` is the unique real number satisfying `Σ_{i=1..k} a_i · (b_i)^p = 1`",
      "`p` is the maximum of `log_{1/b_i}(a_i)` across all branches `i`",
      "`p` is the arithmetic mean `(b_1 + b_2 + ... + b_k) / k`",
      "`p` is the degree of the polynomial `g(x)`"
    ],
    answer: 0,
    explanation: "In the Akra-Bazzi theorem, `p` is the unique real root of `Σ a_i b_i^p = 1`. When there is only one branch (`k = 1`, `b_1 = 1/b`), this reduces to `a · (1/b)^p = 1 ⟹ p = log_b(a)`, recovering the Master Theorem's watershed exponent."
  },
  {
    id: "akra-bazzi-uneven-divides-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Solving Lopsided Partition Recurrences via Akra-Bazzi",
    prompt: "A randomized or skewed partitioning algorithm satisfies the recurrence `T(n) = T(n/5) + T(4n/5) + Θ(n)`. What are the characteristic exponent `p` and the closed-form asymptotic bound `T(n)`?",
    question: "A randomized or skewed partitioning algorithm satisfies the recurrence `T(n) = T(n/5) + T(4n/5) + Θ(n)`. What are the characteristic exponent `p` and the closed-form asymptotic bound `T(n)`?",
    options: [
      "`p = 1` (since `(1/5)¹ + (4/5)¹ = 1`), and `T(n) = Θ(n¹ · (1 + ∫₁ⁿ u/(u²) du)) = Θ(n log n)`",
      "`p < 1`, and `T(n) = Θ(n)` because the `n/5` branch terminates early",
      "`p = log_{5/4}(2) ≈ 3.1`, and `T(n) = Θ(n^{3.1})`",
      "`p = 1`, and `T(n) = Θ(n²)`"
    ],
    answer: 0,
    explanation: "Here `a₁ = a₂ = 1`, `b₁ = 1/5`, `b₂ = 4/5`, and `g(x) = cx`. Since `(1/5)^p + (4/5)^p = 1` is satisfied at `p = 1`, the Akra-Bazzi integral evaluates `x^1 (1 + ∫₁ˣ (cu / u²) du) = Θ(x log x)`."
  },
  {
    id: "akra-bazzi-uneven-divides-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Why Median-of-Medians (BFPRT) Uses Groups of 5 Instead of Groups of 3",
    prompt: "In the deterministic BFPRT selection algorithm, dividing into groups of 5 yields `T(n) = T(n/5) + T(7n/10) + Θ(n)`, whereas dividing into groups of 3 yields `T(n) = T(n/3) + T(2n/3) + Θ(n)`. How does Akra-Bazzi explain the complexity difference between groups of 5 and groups of 3?",
    question: "In the deterministic BFPRT selection algorithm, dividing into groups of 5 yields `T(n) = T(n/5) + T(7n/10) + Θ(n)`, whereas dividing into groups of 3 yields `T(n) = T(n/3) + T(2n/3) + Θ(n)`. How does Akra-Bazzi explain the complexity difference between groups of 5 and groups of 3?",
    options: [
      "For groups of 5, `b₁ + b₂ = 1/5 + 7/10 = 9/10 < 1` so `p < 1` and the integral yields `Θ(n)`; for groups of 3, `b₁ + b₂ = 1/3 + 2/3 = 1` so `p = 1` and the integral yields `Θ(n log n)`",
      "Groups of 5 yield `p = 1` (`Θ(n)`), whereas groups of 3 yield `p = 2` (`Θ(n²)`)",
      "Both yield `Θ(n)`, but groups of 5 have a smaller constant factor",
      "Groups of 3 violate the Akra-Bazzi regularity condition on `g(x)`"
    ],
    answer: 0,
    explanation: "When `g(x) = Θ(x)` and `a_i = 1`, `Σ b_i < 1` implies `p < 1`, making the integral `∫₁ˣ u^{-p} du = Θ(x^{1-p})` and `T(x) = Θ(x^p · x^{1-p}) = Θ(x)`. For groups of 3, `1/3 + 2/3 = 1` forces `p = 1`, turning the integrand into `1/u` and adding a `ln x` factor (`Θ(n log n)`)."
  },
  {
    id: "akra-bazzi-uneven-divides-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Overlapping Subproblems & Perturbation Validity in Akra-Bazzi",
    prompt: "Consider `T(n) = T(⌊n/2⌋) + T(⌈3n/4⌉) + n`. Does Akra-Bazzi apply in presence of the floor/ceiling rounding, and what can we immediately deduce about `T(n)`?",
    question: "Consider `T(n) = T(⌊n/2⌋) + T(⌈3n/4⌉) + n`. Does Akra-Bazzi apply in presence of the floor/ceiling rounding, and what can we immediately deduce about `T(n)`?",
    options: [
      "Yes: `|h_i(n)| ≤ 1 = O(n / log² n)` absorbs the floor/ceiling, and since `1/2 + 3/4 = 5/4 > 1`, the unique root `p` satisfies `p > 1` (`p ≈ 1.4037`), so the leaves dominate and `T(n) = Θ(n^p)`",
      "No: Akra-Bazzi requires `b₁ + b₂ ≤ 1`",
      "Yes: `p = 1` and `T(n) = Θ(n log n)`",
      "No: floor and ceiling functions violate the Lipschitz condition on `T(n)`"
    ],
    answer: 0,
    explanation: "Akra-Bazzi allows any `b_i ∈ (0, 1)` regardless of whether `Σ b_i` exceeds 1, and floor/ceiling perturbations satisfy `|h_i(x)| ≤ 1 ∈ O(x / log² x)`. Since `(1/2)^1 + (3/4)^1 = 1.25 > 1`, we must increase `p > 1` (`p ≈ 1.4037`) until `(1/2)^p + (3/4)^p = 1`. Because `p > 1`, `∫₁ˣ u / u^{p+1} du = ∫₁ˣ u^{-p} du = O(1)`, giving `T(n) = Θ(n^p)`."
  }
];

window.QUESTION_BANK["amortized-analysis-potential"] = [
  {
    id: "amortized-analysis-potential-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Telescoping Validity Condition for Tarjan's Potential Function Φ",
    prompt: "In the Physicist's Potential Method, the amortized cost of operation `i` is defined as `ĉ_i = c_i + Φ(D_i) - Φ(D_{i-1})`. What condition on the potential function `Φ` guarantees that the sum of amortized costs `Σ_{i=1..m} ĉ_i` is a valid upper bound on the sum of actual costs `Σ_{i=1..m} c_i` for every prefix of `m` operations?",
    question: "In the Physicist's Potential Method, the amortized cost of operation `i` is defined as `ĉ_i = c_i + Φ(D_i) - Φ(D_{i-1})`. What condition on the potential function `Φ` guarantees that the sum of amortized costs `Σ_{i=1..m} ĉ_i` is a valid upper bound on the sum of actual costs `Σ_{i=1..m} c_i` for every prefix of `m` operations?",
    options: [
      "`Φ(D_m) ≥ Φ(D_0)` for all reachable states `D_m` (customarily normalized so `Φ(D_0) = 0` and `Φ(D_i) ≥ 0` for all `i`)",
      "`Φ(D_i)` must be strictly increasing (`Φ(D_i) > Φ(D_{i-1})`) on every operation `i`",
      "`Φ(D_i)` must equal zero after every operation",
      "`ΔΦ_i` must always be positive"
    ],
    answer: 0,
    explanation: "By telescoping, `Σ_{i=1..m} c_i = Σ_{i=1..m} ĉ_i - (Φ(D_m) - Φ(D_0))`. As long as `Φ(D_m) - Φ(D_0) ≥ 0` for every state `D_m`, subtracting a non-negative quantity ensures `Σ c_i ≤ Σ ĉ_i`."
  },
  {
    id: "amortized-analysis-potential-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Potential Function for Dynamic Array Doubling (Φ = 2n - m)",
    prompt: "A dynamic array with size `n` and capacity `m` uses the potential function `Φ = 2n - m`. Right before an insertion that triggers a capacity doubling, the array is full (`n = m`). When the new element is pushed, the capacity doubles to `m' = 2n`, all `n` old elements are copied, and the new element is written (`n' = n + 1`), for an actual cost of `c_i = n + 1`. What are `ΔΦ` and the amortized cost `ĉ_i` of this resize operation?",
    question: "A dynamic array with size `n` and capacity `m` uses the potential function `Φ = 2n - m`. Right before an insertion that triggers a capacity doubling, the array is full (`n = m`). When the new element is pushed, the capacity doubles to `m' = 2n`, all `n` old elements are copied, and the new element is written (`n' = n + 1`), for an actual cost of `c_i = n + 1`. What are `ΔΦ` and the amortized cost `ĉ_i` of this resize operation?",
    options: [
      "`ΔΦ = 2 - n`, so `ĉ_i = (n + 1) + (2 - n) = 3`",
      "`ΔΦ = +2`, so `ĉ_i = n + 3`",
      "`ΔΦ = -n`, so `ĉ_i = 1`",
      "`ΔΦ = 0`, so `ĉ_i = n + 1`"
    ],
    answer: 0,
    explanation: "Before the operation (`n = m`), `Φ_{i-1} = 2n - n = n`. After doubling (`m' = 2n`, `n' = n + 1`), `Φ_i = 2(n + 1) - 2n = 2`. Thus `ΔΦ = Φ_i - Φ_{i-1} = 2 - n`. Adding the actual cost `c_i = n + 1` gives `ĉ_i = (n + 1) + (2 - n) = 3 = O(1)`."
  },
  {
    id: "amortized-analysis-potential-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Two-Stack FIFO Queue Amortized Complexity",
    prompt: "A FIFO queue is implemented using two LIFO stacks (`inStack` for `enqueue`, `outStack` for `dequeue`). Using the potential function `Φ = 2 · |inStack|` where each stack `push` or `pop` costs 1 actual unit, what is the amortized cost of `dequeue()` when `outStack` is empty and `inStack` contains `k` elements?",
    question: "A FIFO queue is implemented using two LIFO stacks (`inStack` for `enqueue`, `outStack` for `dequeue`). Using the potential function `Φ = 2 · |inStack|` where each stack `push` or `pop` costs 1 actual unit, what is the amortized cost of `dequeue()` when `outStack` is empty and `inStack` contains `k` elements?",
    options: [
      "Actual cost `c_i = 2k + 1` (`k` pops from `inStack`, `k` pushes to `outStack`, 1 final pop) plus `ΔΦ = 0 - 2k = -2k`, giving an amortized cost of `ĉ_i = 1`",
      "Actual cost `c_i = k` plus `ΔΦ = -k`, giving `ĉ_i = 0`",
      "Actual cost `c_i = 2k + 1` plus `ΔΦ = +2k`, giving `ĉ_i = 4k + 1`",
      "Actual cost `c_i = 1` because stack transfers are free in the RAM model"
    ],
    answer: 0,
    explanation: "Pouring `k` elements from `inStack` into `outStack` requires `k` pops and `k` pushes (`2k` operations), plus `1` pop to return the front element, so `c_i = 2k + 1`. Because `inStack` goes from size `k` to `0`, `ΔΦ = 2(0) - 2(k) = -2k`. Thus `ĉ_i = (2k + 1) - 2k = 1`."
  },
  {
    id: "amortized-analysis-potential-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Boundary Thrashing in Dynamic Arrays & Hysteresis (Shrink at m/4)",
    prompt: "Suppose a dynamic array doubles capacity (`m → 2m`) when `n = m` and halves capacity (`m → m/2`) as soon as `n` drops to `m/2`. Why does this policy fail in the worst case, and how does shrinking at `n = m/4` fix it?",
    question: "Suppose a dynamic array doubles capacity (`m → 2m`) when `n = m` and halves capacity (`m → m/2`) as soon as `n` drops to `m/2`. Why does this policy fail in the worst case, and how does shrinking at `n = m/4` fix it?",
    options: [
      "Immediately after doubling at `n = m`, the array is exactly half full (`n = m'/2`), so alternating `push, pop, push, pop` triggers an `Θ(n)` reallocation on EVERY operation (`Φ = 0` has no stored credit); shrinking only at `n = m/4` leaves load factor `α = 1/2` after every resize, requiring at least `n/2` pushes or `n/4` pops before the next resize",
      "Shrinking at `m/2` leaks memory in the OS page table, whereas `m/4` aligns to 4 KB pages",
      "Shrinking at `m/2` takes `O(log n)` amortized time, whereas `m/4` takes `O(1)`",
      "Shrinking at `m/2` only fails for odd values of `m`"
    ],
    answer: 0,
    explanation: "When growing at `α = 1` and shrinking at `α = 1/2`, the post-growth state sits directly on the shrink threshold! Introducing hysteresis (grow at `α = 1`, shrink at `α = 1/4`, with potential `Φ = |2n - m|`) guarantees that every resize resets the array to `α = 1/2` (`Φ = 0`), requiring at least `Θ(n)` cheap operations before another resize can occur."
  }
];

window.QUESTION_BANK["space-complexity-stack-frames"] = [
  {
    id: "space-complexity-stack-frames-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Auxiliary Space of Naive Recursive Fibonacci",
    prompt: "Consider the naive recursive function `int fib(int n) { return n <= 1 ? n : fib(n-1) + fib(n-2); }`. What are its time complexity and auxiliary call-stack space complexity?",
    question: "Consider the naive recursive function `int fib(int n) { return n <= 1 ? n : fib(n-1) + fib(n-2); }`. What are its time complexity and auxiliary call-stack space complexity?",
    options: [
      "Time is `Θ(φ^n)` (`≈ 1.618^n`), while auxiliary stack space is `Θ(n)` because stack frames are popped and reused as each left branch returns before the right branch starts",
      "Time is `Θ(2^n)` and auxiliary stack space is `Θ(2^n)` because every call allocates a permanent stack frame",
      "Time is `Θ(n)` and auxiliary stack space is `Θ(log n)`",
      "Time is `Θ(φ^n)` and auxiliary stack space is `Θ(1)` due to automatic tail-call optimization"
    ],
    answer: 0,
    explanation: "Although the recursion tree has `Θ(φ^n)` total nodes, the CPU executes the tree depth-first: `fib(n-1)` finishes and unwinds its stack frames before `fib(n-2)` is called. Thus at most `n` activation records coexist on the call stack at any instant."
  },
  {
    id: "space-complexity-stack-frames-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Sedgewick's Smaller-Half Quicksort Stack Bound",
    prompt: "Naive Quicksort can overflow the call stack (`Θ(N)` frames) when partitioning produces 1-to-(N-1) splits. How does Sedgewick's implementation guarantee worst-case `O(log N)` auxiliary stack space even when every pivot is the minimum element?",
    question: "Naive Quicksort can overflow the call stack (`Θ(N)` frames) when partitioning produces 1-to-(N-1) splits. How does Sedgewick's implementation guarantee worst-case `O(log N)` auxiliary stack space even when every pivot is the minimum element?",
    options: [
      "After partitioning into `[lo..p-1]` and `[p+1..hi]`, it recurses ONLY on the smaller subarray (size `≤ N/2`) and handles the larger subarray iteratively via a `while` loop (tail-call elimination)",
      "It allocates the recursion stack on the heap using `std::vector` so it never overflows",
      "It switches to Bubble Sort whenever the recursion depth exceeds 10",
      "It recurses on the larger subarray first so the smaller subarray fits in registers"
    ],
    answer: 0,
    explanation: "Because the smaller of the two partitions has size at most `⌊N/2⌋`, recursing strictly on the smaller half guarantees that every pushed stack frame halves the problem size (`N → N/2 → N/4 ...`), bounding call stack depth to `≤ log₂ N` regardless of pivot quality."
  },
  {
    id: "space-complexity-stack-frames-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Identifying True Tail Position for Tail-Call Optimization (TCO)",
    prompt: "Which of the following C/C++ functions has its recursive call in true tail position so that a compiler can eliminate the stack frame in `O(1)` space?",
    question: "Which of the following C/C++ functions has its recursive call in true tail position so that a compiler can eliminate the stack frame in `O(1)` space?",
    options: [
      "`uint64_t factTail(uint64_t n, uint64_t acc) { return n <= 1 ? acc : factTail(n - 1, n * acc); }`",
      "`uint64_t fact(uint64_t n) { return n <= 1 ? 1 : n * fact(n - 1); }`",
      "`int treeHeight(Node* u) { return !u ? 0 : 1 + std::max(treeHeight(u->left), treeHeight(u->right)); }`",
      "`int sumWithVector(int n) { std::vector<int> tmp(4); return n <= 0 ? 0 : sumWithVector(n - 1); }`"
    ],
    answer: 0,
    explanation: "In `factTail(n - 1, n * acc)`, the multiplication happens *before* the call and the callee's return value is returned directly without further computation or local RAII destructors. In `sumWithVector`, `tmp.~vector()` must run *after* the recursive call returns, blocking TCO."
  },
  {
    id: "space-complexity-stack-frames-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Diagnosing Production SIGSEGV on Deep Recursive DFS",
    prompt: "A C++ backend service runs a recursive DFS over a directed graph of `V = 120,000` vertices. It passes all unit tests on a developer's Linux workstation (`ulimit -s = 8 MB`), but crashes immediately with `SIGSEGV` inside a production worker thread pool where threads are spawned with 512 KB stacks. Assuming each DFS stack frame is 48 bytes, why did it crash and what is the most memory-efficient fix?",
    question: "A C++ backend service runs a recursive DFS over a directed graph of `V = 120,000` vertices. It passes all unit tests on a developer's Linux workstation (`ulimit -s = 8 MB`), but crashes immediately with `SIGSEGV` inside a production worker thread pool where threads are spawned with 512 KB stacks. Assuming each DFS stack frame is 48 bytes, why did it crash and what is the most memory-efficient fix?",
    options: [
      "A 120,000-vertex chain requires `120,000 × 48 B ≈ 5.76 MB` of call stack, hitting the 512 KB thread guard page; replacing recursion with an explicit heap `std::vector<int32_t>` stack uses only `480 KB` on the heap and zero OS stack growth",
      "The C++ heap ran out of memory at 512 KB; adding `inline` to the recursive `dfs()` function eliminates the stack frames",
      "The compiler failed to vectorize `dfs()`; switching from `std::vector` adjacency lists to `std::list` fixes the stack overflow",
      "Linux kernel threads cannot recurse deeper than 1,024 frames regardless of stack size"
    ],
    answer: 0,
    explanation: "`inline` cannot eliminate unbounded recursion, and `120,000 × 48 B = 5.76 MB` overflows the 512 KB worker thread stack (`< 8 MB` main thread stack). Rewriting the DFS using an explicit `std::vector` on the heap stores only the 4-byte vertex ID (plus current neighbor iterator) and allocates from the multi-gigabyte process heap."
  }
];

window.QUESTION_BANK["cache-oblivious-algorithms"] = [
  {
    id: "cache-oblivious-algorithms-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Defining Property of a Cache-Oblivious Algorithm",
    prompt: "What distinguishes a cache-oblivious algorithm (in the Frigo-Leiserson-Prokop-Ramachandran Ideal-Cache model) from a cache-aware algorithm?",
    question: "What distinguishes a cache-oblivious algorithm (in the Frigo-Leiserson-Prokop-Ramachandran Ideal-Cache model) from a cache-aware algorithm?",
    options: [
      "It contains no hardware tuning parameters for cache line block size `B` or cache capacity `M`, yet achieves asymptotically optimal cache misses across all levels of a multi-level memory hierarchy simultaneously",
      "It bypasses the CPU cache entirely using non-temporal streaming stores (`_mm_stream_si128`)",
      "It assumes that every memory access is a cache miss (`B = 1`)",
      "It requires the programmer to pass the L1 and L3 cache sizes at compile time via template parameters"
    ],
    answer: 0,
    explanation: "By using recursive divide-and-conquer down to `O(1)` base cases rather than fixed block tiles of size `B`, a cache-oblivious algorithm automatically fits subproblems into L1, L2, L3, TLB, and disk pages at the respective recursion depths where subproblem size drops below each tier's `M_i` and `B_i`."
  },
  {
    id: "cache-oblivious-algorithms-q2",
    type: "mcq",
    difficulty: "apply",
    title: "van Emde Boas (vEB) Tree Layout Construction & Cache Bound",
    prompt: "How does the cache-oblivious van Emde Boas (vEB) layout arrange a complete binary search tree of height `h` (`N ≈ 2^h` nodes) in a contiguous array, and how many cache-line transfers does a root-to-leaf search incur?",
    question: "How does the cache-oblivious van Emde Boas (vEB) layout arrange a complete binary search tree of height `h` (`N ≈ 2^h` nodes) in a contiguous array, and how many cache-line transfers does a root-to-leaf search incur?",
    options: [
      "It recursively splits the tree at mid-height `h/2` into a top subtree `T₀` of size `≈ √N` followed contiguously by `≈ √N` bottom subtrees `T₁..T_k` of size `≈ √N`, achieving `O(log_B N)` cache misses",
      "It stores nodes in level-order (BFS) so children of `i` are at `2i` and `2i+1`, achieving `O(1)` cache misses",
      "It stores nodes in sorted In-Order so binary search can use `A[mid]`, achieving `O(log_B N)` cache misses",
      "It stores all leaves in the first half of the array and all internal nodes in the second half"
    ],
    answer: 0,
    explanation: "At the recursion depth where subtree size drops to `≤ B`, each contiguous mini-subtree has height `≈ (1/2) log₂ B` and fits in at most 2 cache lines. Thus a search path of length `log₂ N` crosses `O((log₂ N) / (log₂ B)) = O(log_B N)` cache lines."
  },
  {
    id: "cache-oblivious-algorithms-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Cache-Oblivious Matrix Transposition",
    prompt: "In a naive row-major `N × N` matrix transpose `B[j][i] = A[i][j]`, how many cache misses occur when `N ≫ M`, and how does the cache-oblivious recursive transpose reduce this?",
    question: "In a naive row-major `N × N` matrix transpose `B[j][i] = A[i][j]`, how many cache misses occur when `N ≫ M`, and how does the cache-oblivious recursive transpose reduce this?",
    options: [
      "Naive transpose incurs `Θ(N²)` cache misses because column writes `B[j][i]` jump by stride `N` (evicting lines before reuse); recursively splitting the larger dimension until tiles fit in cache reduces misses to the optimal `Θ(1 + N² / B)`",
      "Naive transpose incurs `Θ(N³)` cache misses, which recursive transposition reduces to `Θ(N²)`",
      "Naive transpose incurs `Θ(N² / B)` misses on both `A` and `B` because hardware prefetchers prefetch任意 stride `N`",
      "Recursive transposition reduces both work and cache misses to `O(N log N)`"
    ],
    answer: 0,
    explanation: "Reading `A[i][j]` sequentially incurs `N² / B` misses, but writing `B[j][i]` with stride `N` touches a different cache line on every step (`N²` misses) when a column exceeds cache capacity `M`. Recursive splitting processes `b × b` sub-blocks that fit entirely in L1 (`b² ≤ M`), utilizing all `B` words of every loaded cache line (`Θ(N² / B)` misses)."
  },
  {
    id: "cache-oblivious-algorithms-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Khuong-Morin Eytzinger Layout & Software Prefetching",
    prompt: "In a 1-indexed Eytzinger (BFS) search array where `left(k) = 2k` and `right(k) = 2k + 1`, why does issuing `__builtin_prefetch(a + k * 16)` inside the search loop `k = 2*k + (a[k] < target)` dramatically accelerate searches for `N = 10^7` `int32_t` keys?",
    question: "In a 1-indexed Eytzinger (BFS) search array where `left(k) = 2k` and `right(k) = 2k + 1`, why does issuing `__builtin_prefetch(a + k * 16)` inside the search loop `k = 2*k + (a[k] < target)` dramatically accelerate searches for `N = 10^7` `int32_t` keys?",
    options: [
      "All 16 descendants of node `k` four levels deeper (`16k .. 16k + 15`) are stored contiguously in a single 64-byte cache line (`16 × 4B = 64B`), allowing the CPU to prefetch the exact cache line needed 4 iterations in the future and overlap 4 DRAM fetches in parallel",
      "Because `k * 16` precomputes the van Emde Boas index without bit manipulation",
      "Because `__builtin_prefetch` locks the cache line in L1 permanently so it can never be evicted",
      "Because Eytzinger arrays store keys in sorted In-Order, allowing linear stream prefetching"
    ],
    answer: 0,
    explanation: "In a 1-indexed BFS layout, the 2 children of `k` are at `2k..2k+1`, the 4 grandchildren are at `4k..4k+3`, and the 16 great-great-grandchildren (4 levels down) occupy `16k..16k+15`. For 4-byte `int32_t` keys, those 16 nodes occupy `16 × 4 = 64` contiguous bytes—one exact cache line! Prefetching `a + 16*k` hides DRAM latency across 4 levels of the tree."
  }
];

window.QUESTION_BANK["branch-prediction-simd-cost"] = [
  {
    id: "branch-prediction-simd-cost-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Hardware Cause of the Sorted vs Unsorted Array Filtering Mystery",
    prompt: "Why does `if (a[i] >= 128) sum += a[i];` run ~5× faster on a sorted array than on a randomly shuffled array containing the exact same integers?",
    question: "Why does `if (a[i] >= 128) sum += a[i];` run ~5× faster on a sorted array than on a randomly shuffled array containing the exact same integers?",
    options: [
      "On the unsorted array, `a[i] >= 128` is a 50/50 coin flip that causes ~50% hardware branch mispredictions, flushing the 14–20 stage CPU pipeline (15–20 wasted cycles per mispredict); on the sorted array, the branch transitions only once",
      "On the sorted array, the L1 cache line size automatically doubles from 64 bytes to 128 bytes",
      "On the unsorted array, integer addition `sum += a[i]` takes 20 cycles instead of 1 cycle",
      "The compiler automatically deletes the loop when the array is sorted at runtime"
    ],
    answer: 0,
    explanation: "Both arrays have identical spatial cache locality (stride-1 scan). The entire 5× difference comes from the CPU's branch predictor: random data has maximum Shannon entropy (1 bit per comparison), causing a ~18-cycle speculative pipeline flush on half of all iterations."
  },
  {
    id: "branch-prediction-simd-cost-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Branchless Offset Filtering in BlockQuicksort / pdqsort",
    prompt: "In Edelkamp-Weiss BlockQuicksort (and Rust/C++ `pdqsort`), how does the partitioning loop `offsets[count] = i; count += (block[i] < pivot);` avoid branch mispredictions when partitioning random data?",
    question: "In Edelkamp-Weiss BlockQuicksort (and Rust/C++ `pdqsort`), how does the partitioning loop `offsets[count] = i; count += (block[i] < pivot);` avoid branch mispredictions when partitioning random data?",
    options: [
      "It unconditionally writes index `i` to `offsets[count]` and increments `count` by the boolean `0` or `1` (`setl` + `add`), overwriting `offsets[count]` on the next iteration if the predicate was false—executing zero conditional jumps",
      "It sorts the 64-element block using Bubble Sort before comparing with `pivot`",
      "It uses hardware transactional memory (`RTM`) to roll back mispredicted swaps",
      "It skips elements that are larger than `pivot` using a `goto` statement"
    ],
    answer: 0,
    explanation: "By unconditionally writing `offsets[count] = i` and advancing `count` via data-dependent arithmetic `count += (block[i] < pivot)`, the control dependency is completely eliminated. False elements simply have their slot overwritten on the very next iteration."
  },
  {
    id: "branch-prediction-simd-cost-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Branchless Binary Search via Conditional Move (CMOV)",
    prompt: "In branchless binary search (`base += (base[half] < target) ? half : 0; n -= half;`), what is the primary performance trade-off compared to branchy binary search across small (`N = 1,000`) versus huge (`N = 50,000,000`) arrays?",
    question: "In branchless binary search (`base += (base[half] < target) ? half : 0; n -= half;`), what is the primary performance trade-off compared to branchy binary search across small (`N = 1,000`) versus huge (`N = 50,000,000`) arrays?",
    options: [
      "For L1/L2-resident arrays (`N ≤ 10⁵`), branchless `CMOV` is 2–3× faster because it eliminates 18-cycle branch mispredictions; for huge DRAM-bound arrays without software prefetching, `CMOV` prevents speculative execution from prefetching down the predicted branch path",
      "Branchless `CMOV` is slower for small arrays and only faster when `N > 10⁹`",
      "Branchless binary search performs `O(N)` comparisons instead of `O(log N)`",
      "Branchy binary search has 0% branch mispredictions on random queries"
    ],
    answer: 0,
    explanation: "When the array fits in L1/L2 cache, the 15–20 cycle branch misprediction penalty dominates the 4-cycle load latency, so `CMOV` wins handily. When the array exceeds L3 cache, each step waits ~200 cycles for DRAM unless software prefetching (`__builtin_prefetch`) is added to the branchless loop."
  },
  {
    id: "branch-prediction-simd-cost-q4",
    type: "mcq",
    difficulty: "staff",
    title: "When Branchy Code Beats Branchless CMOV (Predictable Branches)",
    prompt: "A hot kernel loop checks an error/overflow condition that triggers on only `0.01%` of iterations (`if (unlikely(x > MAX_LIMIT)) handleRareCase(x);`). Why is a conditional branch (`jle`) FASTER here than a branchless `CMOV` transformation that computes both paths and selects the result?",
    question: "A hot kernel loop checks an error/overflow condition that triggers on only `0.01%` of iterations (`if (unlikely(x > MAX_LIMIT)) handleRareCase(x);`). Why is a conditional branch (`jle`) FASTER here than a branchless `CMOV` transformation that computes both paths and selects the result?",
    options: [
      "At 99.99% predictability, the branch predictor is almost never wrong (~0 flush cost) and speculative execution breaks the data dependency chain; `CMOV` forces the CPU to execute both paths and serializes the critical data dependency path on the condition register",
      "Because `CMOV` flushes the L1 instruction cache on every iteration",
      "Because `CMOV` requires a ring-0 kernel syscall on x86-64",
      "Because the branch target buffer (BTB) cannot store addresses of functions called less than 1% of the time"
    ],
    answer: 0,
    explanation: "Branchless `CMOV` converts a control dependency into a strict data dependency: the destination register cannot be used by downstream instructions until both inputs and the comparison flag are ready. When a branch is >98% predictable, speculative execution skips the cold path and breaks the dependency chain with near-zero misprediction penalty."
  }
];

window.QUESTION_BANK["complexity-tradeoff-framework"] = [
  {
    id: "complexity-tradeoff-framework-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Constraint Inversion: Maximum Feasible Complexity for N = 200,000",
    prompt: "In an algorithmic problem or low-latency service with an operation budget of `~5 × 10⁷` operations and maximum input size `N = 200,000`, which worst-case time complexity class is the highest feasible target?",
    question: "In an algorithmic problem or low-latency service with an operation budget of `~5 × 10⁷` operations and maximum input size `N = 200,000`, which worst-case time complexity class is the highest feasible target?",
    options: [
      "`O(N log N)` or `O(N log² N)` (`2×10⁵ × 18 ≈ 3.6×10⁶` ops), whereas `O(N²)` (`4×10¹⁰` ops) will time out by 3 orders of magnitude",
      "`O(N²)` (`4 × 10¹⁰` operations)",
      "`O(2^{N/2})` via Meet-in-the-Middle",
      "`O(N³)` via dynamic programming"
    ],
    answer: 0,
    explanation: "At `N = 2 × 10⁵`, `N log₂ N ≈ 3.5 × 10⁶` operations (~10 ms), and `N log₂² N ≈ 6.3 × 10⁷` operations. By contrast, `N² = 4 × 10¹⁰` operations takes ~100 seconds on a single CPU core."
  },
  {
    id: "complexity-tradeoff-framework-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Meet-in-the-Middle Space-Time Tradeoff for N = 40",
    prompt: "You need to solve the exact Subset-Sum problem for `N = 40` 64-bit integers. Exhaustive search takes `2⁴⁰ ≈ 1.1 × 10¹²` operations. How does Meet-in-the-Middle solve this in `~2 × 10⁷` operations?",
    question: "You need to solve the exact Subset-Sum problem for `N = 40` 64-bit integers. Exhaustive search takes `2⁴⁰ ≈ 1.1 × 10¹²` operations. How does Meet-in-the-Middle solve this in `~2 × 10⁷` operations?",
    options: [
      "Split the array into two halves of 20 elements, generate all `2²⁰ = 1,048,576` subset sums of each half in sorted order (via merge-extension in `O(2²⁰)`), and run a converging two-pointer scan `L + R == target` in `O(2²⁰)` time and space",
      "Use 0/1 Knapsack dynamic programming in `O(N · target)` time",
      "Divide the 40 elements into 4 groups of 10 and sum each group independently without combining",
      "Run randomized Quicksort on the 40 elements in `O(N log N)` time"
    ],
    answer: 0,
    explanation: "Splitting `N = 40` into two halves of `N/2 = 20` reduces the state space from `2⁴⁰ ≈ 10¹²` to `2 × 2²⁰ ≈ 2.1 × 10⁶` states. Using merge-based subset generation produces both sorted lists in `O(2^{N/2})` time, and two pointers find a matching pair `left[i] + right[j] == target` in linear time in the list size."
  },
  {
    id: "complexity-tradeoff-framework-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Selecting Along the Range-Query Precomputation Frontier",
    prompt: "You have a static array of `N = 10⁶` integers and must answer `Q = 10⁷` Range Minimum Queries (`min(A[L..R])`) with zero updates. Which data structure achieves the optimal total time `P(N) + Q · Query(N)`?",
    question: "You have a static array of `N = 10⁶` integers and must answer `Q = 10⁷` Range Minimum Queries (`min(A[L..R])`) with zero updates. Which data structure achieves the optimal total time `P(N) + Q · Query(N)`?",
    options: [
      "Sparse Table: `O(N log N)` precomputation and `O(1)` per query via two overlapping power-of-2 intervals (since `min` is idempotent), totaling `~2×10⁷ + 10⁷` ops",
      "1D Prefix Sum Array: `O(N)` precomputation and `O(1)` per query via `prefixMin[R] - prefixMin[L-1]`",
      "Segment Tree: `O(N)` build and `O(log N)` per query (`~2×10⁸` ops)",
      "Sqrt Decomposition: `O(N)` build and `O(√N)` per query (`~10¹⁰` ops)"
    ],
    answer: 0,
    explanation: "Prefix sums do NOT work for `min` because `min` is not invertible (you cannot subtract `min(A[0..L-1])`). Because `min` is idempotent (`min(x, x) = x`) and the array is static, a Sparse Table answers every query in `O(1)` time by taking `min(st[k][L], st[k][R - 2^k + 1])`."
  },
  {
    id: "complexity-tradeoff-framework-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Asymptotic vs Hardware Crossover: `std::sort` vs `std::unordered_map`",
    prompt: "To check if an array of `N = 50,000` 64-bit integers contains any duplicates, an engineer compares `std::sort` (`O(N log N)` time, `O(1)` auxiliary space) against inserting into `std::unordered_map` (`O(N)` expected time, `O(N)` space). In production benchmarks, `std::sort` runs 7× faster. Why?",
    question: "To check if an array of `N = 50,000` 64-bit integers contains any duplicates, an engineer compares `std::sort` (`O(N log N)` time, `O(1)` auxiliary space) against inserting into `std::unordered_map` (`O(N)` expected time, `O(N)` space). In production benchmarks, `std::sort` runs 7× faster. Why?",
    options: [
      "`std::sort` operates in-place on a single 400 KB contiguous buffer resident in L2 cache with zero heap allocations, whereas C++ `std::unordered_map` mandates node-based separate chaining that performs up to 50,000 individual `malloc` calls and random pointer chases",
      "Because `std::unordered_map` has `O(N²)` expected time complexity on random integers",
      "Because `log₂(50,000)` is less than `1`",
      "Because `std::sort` uses Radix Sort in `O(N)` time for 64-bit integers"
    ],
    answer: 0,
    explanation: "For `N = 50,000`, `log₂ N ≈ 15.6` register comparisons in L1/L2 cache (~15 cycles) is vastly cheaper than a single heap allocation (`malloc` ~50–100 cycles) plus a cache-missing pointer chase (~100–200 cycles) in `std::unordered_map`."
  }
];

window.QUESTION_BANK["case-v8-elements-kinds"] = [
  {
    id: "case-v8-elements-kinds-q1",
    type: "mcq",
    difficulty: "recall",
    title: "V8 Elements Kind Monotonic Lattice Invariant",
    prompt: "In Chrome V8's JavaScript engine, what happens to an array's internal `Elements Kind` when you execute `const a = [1, 2, 3]; a.push(3.14); a.pop();`?",
    question: "In Chrome V8's JavaScript engine, what happens to an array's internal `Elements Kind` when you execute `const a = [1, 2, 3]; a.push(3.14); a.pop();`?",
    options: [
      "It starts as `PACKED_SMI_ELEMENTS`, transitions to `PACKED_DOUBLE_ELEMENTS` on `a.push(3.14)`, and REMAINS `PACKED_DOUBLE_ELEMENTS` after `a.pop()` because lattice transitions are strictly one-way",
      "It transitions back to `PACKED_SMI_ELEMENTS` as soon as `3.14` is popped",
      "It starts as `HOLEY_ELEMENTS` and becomes `PACKED_SMI_ELEMENTS` after `a.pop()`",
      "It immediately transitions to `DICTIONARY_ELEMENTS` (hash table mode) when a float is pushed"
    ],
    answer: 0,
    explanation: "V8's Elements Kind lattice never transitions backwards from a more general type (`DOUBLE`) to a more specific type (`SMI`), nor from `HOLEY` to `PACKED`, because scanning the array on pop/mutation would cost `O(N)` and cause JIT deoptimization loops."
  },
  {
    id: "case-v8-elements-kinds-q2",
    type: "mcq",
    difficulty: "apply",
    title: "The `new Array(N)` Holey Trap in V8",
    prompt: "Why does `const a = new Array(1000); for (let i = 0; i < 1000; i++) a[i] = i;` result in a slower array backing kind in V8 than pushing 1,000 integers into `const a = []` or using `new Int32Array(1000)`?",
    question: "Why does `const a = new Array(1000); for (let i = 0; i < 1000; i++) a[i] = i;` result in a slower array backing kind in V8 than pushing 1,000 integers into `const a = []` or using `new Int32Array(1000)`?",
    options: [
      "`new Array(1000)` creates 1,000 uninitialized holes (`HOLEY_SMI_ELEMENTS`), and because V8 never transitions from `HOLEY` back to `PACKED`, the array remains `HOLEY_SMI_ELEMENTS` forever even after all 1,000 slots are filled",
      "`new Array(1000)` allocates a linked list instead of a contiguous buffer",
      "`new Array(1000)` boxes every integer as a string on the heap",
      "`new Array(1000)` limits the maximum integer value to 8 bits"
    ],
    answer: 0,
    explanation: "Allocating `new Array(1000)` initializes the array with `the_hole` sentinels, marking its Hidden Class as `HOLEY_SMI_ELEMENTS`. Filling every index `0..999` does not upgrade the Elements Kind back to `PACKED_SMI_ELEMENTS`."
  },
  {
    id: "case-v8-elements-kinds-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Hidden `O(N)` Heap Boxing Cost on `PACKED_DOUBLE` → `PACKED_ELEMENTS`",
    prompt: "An array `arr` of `N = 1,000,000` floating-point numbers currently has V8 kind `PACKED_DOUBLE_ELEMENTS` (stored as an unboxed 8 MB `double[]` buffer). What physical memory work must V8 perform if you execute `arr.push(null)`?",
    question: "An array `arr` of `N = 1,000,000` floating-point numbers currently has V8 kind `PACKED_DOUBLE_ELEMENTS` (stored as an unboxed 8 MB `double[]` buffer). What physical memory work must V8 perform if you execute `arr.push(null)`?",
    options: [
      "Because `null` cannot be represented as an IEEE-754 double, V8 transitions to `PACKED_ELEMENTS`, allocates 1,000,000 separate boxed `HeapNumber` objects on the heap, and copies all 1,000,000 floats into tagged pointers (`O(N)` work)",
      "V8 stores `null` as `0.0` in `O(1)` time without changing the backing buffer",
      "V8 stores `null` using a quiet `NaN` bit-pattern in `O(1)` time",
      "V8 throws a `TypeError` because `PACKED_DOUBLE_ELEMENTS` arrays are immutable"
    ],
    answer: 0,
    explanation: "`PACKED_DOUBLE_ELEMENTS` stores raw 64-bit IEEE-754 floats (using one special signaling `NaN` bit-pattern only for `the_hole` in `HOLEY_DOUBLE_ELEMENTS`). Pushing an object reference or `null`/`undefined` forces V8 to convert the entire array into tagged pointers (`PACKED_ELEMENTS`), boxing every existing float on the heap."
  },
  {
    id: "case-v8-elements-kinds-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Global `Array.prototype` Poisoning & V8's `NoElementsProtector`",
    prompt: "Why does reading an element from a `HOLEY` array in V8 normally avoid walking `Array.prototype` and `Object.prototype`, and what happens across the entire V8 Isolate if any script executes `Array.prototype[0] = 'fallback'`?",
    question: "Why does reading an element from a `HOLEY` array in V8 normally avoid walking `Array.prototype` and `Object.prototype`, and what happens across the entire V8 Isolate if any script executes `Array.prototype[0] = 'fallback'`?",
    options: [
      "V8 relies on a global speculation cell (`NoElementsProtector`) asserting no indexed properties exist on `Array.prototype` or `Object.prototype`; setting `Array.prototype[0]` permanently invalidates this protector, forcing every `HOLEY` array read to check the prototype chain on `the_hole`",
      "V8 freezes `Array.prototype` at startup so `Array.prototype[0] = 'fallback'` is a syntax error",
      "Setting `Array.prototype[0]` only affects the single array created on the next line",
      "V8 copies `Array.prototype` into every `PACKED_SMI_ELEMENTS` array"
    ],
    answer: 0,
    explanation: "By ECMAScript rules, if `arr[i]` is a hole (`!(i in arr)`), property lookup must consult `Array.prototype[i]` and `Object.prototype[i]`. V8 elides this expensive prototype chain walk via the global `NoElementsProtector` cell—until any code defines an indexed property on `Array.prototype` or `Object.prototype`, which deoptimizes all `HOLEY` array fast paths."
  }
];
