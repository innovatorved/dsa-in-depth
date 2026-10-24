window.QUESTION_BANK = window.QUESTION_BANK || {};
Object.assign(window.QUESTION_BANK, {
  "quadratic-sorts-inversions": [
    {
      id: "m05-quad-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Expected Inversions in a Uniform Random Permutation",
      prompt: "An array $A[0 \\dots n-1]$ contains a uniformly random permutation of $n$ distinct integers.",
      question: "What is the exact expected number of inversions $\\mathbb{E}[I(A)]$, and what lower bound does this impose on any sorting algorithm that only swaps adjacent elements?",
      options: [
        "E[I(A)] = n(n - 1) / 4; since each adjacent swap decreases I(A) by at most 1, any adjacent-swap sort requires at least n(n - 1) / 4 = Ω(n²) swaps on average.",
        "E[I(A)] = n(n - 1) / 2; any adjacent-swap sort requires Ω(n log n) swaps on average.",
        "E[I(A)] = n log₂ n; Insertion Sort removes log₂ n inversions per swap.",
        "E[I(A)] = n / 2; adjacent swaps can remove up to 2 inversions per exchange."
      ],
      answer: 0,
      explanation: "There are C(n, 2) = n(n-1)/2 pairs of indices (i < j). In a uniform random permutation, each pair has probability 1/2 of being inverted (A[i] > A[j]). By linearity of expectation, E[I(A)] = n(n-1)/4. Because swapping adjacent elements A[k] and A[k+1] only changes the relative order of (k, k+1), it reduces I(A) by at most 1."
    },
    {
      id: "m05-quad-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Insertion Sort Complexity on k-Nearly-Sorted Arrays",
      prompt: "In a $k$-nearly-sorted array of length $n$, every element is at most $k$ positions away from its final sorted index (where $k = 8$ is a small constant).",
      question: "How many element shifts and key comparisons does Insertion Sort perform on this array?",
      options: [
        "At most k shifts per element (≤ kn total shifts) and ≤ (k + 1)n comparisons, running in Θ(kn) = Θ(n) linear time.",
        "Θ(n log n) comparisons because Insertion Sort uses binary search on the prefix.",
        "Θ(n²) comparisons because Insertion Sort always scans all the way back to index 0.",
        "Θ(n k²) shifts because each shift creates a new inversion."
      ],
      answer: 0,
      explanation: "Each element A[i] has at most k larger elements to its left (hence I(A) ≤ kn). Since Insertion Sort stops its inner while-loop as soon as A[j - 1] <= val, it performs exactly I(A) ≤ kn shifts and at most I(A) + n ≤ (k + 1)n comparisons."
    },
    {
      id: "m05-quad-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Why Shell's Power-of-Two Increments Degrade to Quadratic Time",
      prompt: "An engineer implements Shellsort using the increment sequence $h = 2^k = \\dots, 16, 8, 4, 2, 1$ on an array where all even positions contain the smallest $n/2$ keys and all odd positions contain the largest $n/2$ keys.",
      question: "Why does this input force $\\Omega(n^2)$ comparisons on the final $h = 1$ pass?",
      options: [
        "Because every increment h > 1 is even, so elements at even indices are never compared or exchanged with elements at odd indices until the final h = 1 pass, leaving Ω(n²) inversions intact.",
        "Because 4-sorting an array undoes the previous 8-sorted order whenever h divides g.",
        "Because power-of-two strides cause cache set-associativity conflict misses that alter comparison counts.",
        "Because Insertion Sort with stride h = 2 is unstable and reverses the order of odd indices."
      ],
      answer: 0,
      explanation: "When all strides h > 1 are multiples of 2, the even-indexed subarray and odd-indexed subarray are completely disjoint throughout every pass before h = 1. Even after both halves are independently sorted, interleaving [1, 1001, 2, 1002, ...] leaves ~n²/8 inversions that must all be removed one-by-one during the h = 1 pass. Coprime increments (Knuth 3^k-1, Hibbard 2^k-1, Ciura) mix parities across passes."
    },
    {
      id: "m05-quad-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Unguarded Insertion Sort Sentinel Invariant in Production Standard Libraries",
      prompt: "In `libstdc++` `std::__unguarded_linear_insert` and `pdqsort`, the inner Insertion Sort loop is written simply as `while (val < *--j) { *(j + 1) = std::move(*j); }` without checking `j > first`.",
      question: "What precondition makes omitting the `j > first` bounds check memory-safe, and how can a buggy user comparator cause an out-of-bounds segfault?",
      options: [
        "Precondition: `*(first)` holds an element `<= val` (a minimum sentinel), guaranteeing `val < *--j` evaluates to `false` at or before `j == first`; however, if a buggy comparator violates irreflexivity (`comp(x, x) == true`, e.g. `<=`), `val < *first` returns `true` on equal keys and walks `j` past `first - 1` into unmapped memory!",
        "Precondition: the OS places an unmapped guard page immediately before every `std::vector` allocation.",
        "Precondition: the subarray length is a power of two; a comparator throwing an exception causes the segfault.",
        "Precondition: `T` is a trivial scalar type; non-trivial destructors cause `j` to underflow."
      ],
      answer: 0,
      explanation: "Unguarded insertion sort relies on `*first <= val` acting as a stopper sentinel so `comp(val, *first)` is guaranteed to be `false` under a valid strict weak ordering. This is the exact reason why passing `std::less_equal` (`<=`) to `std::sort` in C++ is notorious for triggering immediate heap buffer underflow crashes rather than merely sorting incorrectly!"
    }
  ],

  "mergesort-bottom-up-inversions": [
    {
      id: "m05-merge-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Counting Split Inversions During the Merge Step",
      prompt: "While merging sorted left subarray $L[lo \\dots mid-1]$ and sorted right subarray $R[mid \\dots hi-1]$, the merge pointers are at $i \\in [lo, mid)$ and $j \\in [mid, hi)$ and you observe $R[j] < L[i]$.",
      question: "How many split inversions involving $R[j]$ are discovered at the exact moment $R[j]$ is copied to the output buffer?",
      options: [
        "Exactly (mid - i) split inversions, because L[lo .. mid-1] is sorted, so every element in L[i .. mid-1] is >= L[i] > R[j].",
        "Exactly 1 split inversion, namely the pair (L[i], R[j]).",
        "Exactly (j - mid + 1) split inversions.",
        "Exactly (hi - j) split inversions."
      ],
      answer: 0,
      explanation: "Because L is already sorted in non-decreasing order, R[j] < L[i] implies R[j] < L[i] <= L[i+1] <= ... <= L[mid-1]. All (mid - i) remaining elements in L lie to the left of R[j] and are strictly greater than R[j], so advancing j accounts for all (mid - i) inversions with R[j] at once."
    },
    {
      id: "m05-merge-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Tracing Split Inversions on a Concrete Merge",
      prompt: "Suppose $L = [4, 12, 15, 20]$ ($mid = 4$) and $R = [2, 13, 14, 25]$ are merged by the inversion-counting merge procedure.",
      question: "What is the total number of split inversions counted between $L$ and $R$ during this single merge?",
      options: [
        "8 split inversions: R[0]=2 adds 4 (beats 4,12,15,20); R[1]=13 adds 2 (beats 15,20); R[2]=14 adds 2 (beats 15,20); R[3]=25 adds 0.",
        "3 split inversions: one for each element in R that is smaller than L[3]=20.",
        "6 split inversions: R[0]=2 adds 4, R[1]=13 adds 1, R[2]=14 adds 1.",
        "10 split inversions."
      ],
      answer: 0,
      explanation: "Step 1: R[0]=2 < L[0]=4 → inv += (4 - 0) = 4. Step 2: L[0]=4 <= R[1]=13 → advance i to 1 (L[1]=12). Step 3: L[1]=12 <= R[1]=13 → advance i to 2 (L[2]=15). Step 4: R[1]=13 < L[2]=15 → inv += (4 - 2) = 2. Step 5: R[2]=14 < L[2]=15 → inv += (4 - 2) = 2. Step 6: L[2]=15, L[3]=20 <= R[3]=25 → 0 more. Total = 4 + 2 + 2 = 8."
    },
    {
      id: "m05-merge-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Preserving Stability and Exact Inversion Counts with Duplicate Keys",
      prompt: "An array contains duplicate values, e.g., $L = [5_a, 5_b]$ and $R = [5_c, 5_d]$. During the merge step, $L[i] == R[j] == 5$.",
      question: "Which element must be copied to the output buffer first to simultaneously preserve sorting stability and avoid overcounting inversions?",
      options: [
        "L[i] must be copied first (using condition `!(R[j] < L[i])`) with 0 added to the inversion count, because equal elements (A[p] == A[q]) are neither inverted nor allowed to swap relative order.",
        "R[j] must be copied first and (mid - i) added to the inversion count.",
        "R[j] must be copied first, but 0 added to the inversion count.",
        "Either L[i] or R[j] can be copied first without affecting the inversion count."
      ],
      answer: 0,
      explanation: "An inversion requires strict inequality A[p] > A[q] (i.e. R[j] < L[i]). If R[j] were copied when L[i] == R[j], it would both violate stability (placing 5_c before 5_a) and falsely add (mid - i) to the inversion counter, counting pairs where L[k] == R[j] as inversions!"
    },
    {
      id: "m05-merge-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Ping-Pong Buffer Alternation vs Copy-Back in Merge Sort",
      prompt: "A naive Merge Sort merges `a[lo..mid)` and `a[mid..hi)` into `aux[lo..hi)` and immediately executes `std::copy(aux + lo, aux + hi, a + lo)` at the end of every merge call.",
      question: "How does Ping-Pong Merge Sort eliminate the `std::copy` pass, and what subtlety arises in Top-Down vs Bottom-Up implementations when $\\lceil \\log_2 n \\rceil$ is odd?",
      options: [
        "By swapping the role of `src` and `dst` pointers at each level of the recursion/width loop (reducing element moves from 2n log₂ n to n log₂ n); in Bottom-Up, if the number of width passes is odd, one final linear move copies `aux` back to `a` (or in Top-Down, the base case initializes at the appropriate parity depth).",
        "By merging in-place using Shellsort without any `aux` array in O(n log n) time.",
        "By using `realloc` to rename the virtual memory address of `aux` to `a` after every inner merge.",
        "Ping-pong buffering only works when n is an exact power of 2 and corrupts memory otherwise."
      ],
      answer: 0,
      explanation: "Copying back at every merge level doubles memory traffic from n log₂ n writes to 2n log₂ n writes. Alternating `src` and `dst` between `a` and `aux` across passes cuts memory traffic in half; in Bottom-Up Merge Sort, if the loop executes an odd number of passes, the sorted result sits in `aux` and is moved back to `a` in a single O(n) pass."
    }
  ],

  "quicksort-partition-schemes": [
    {
      id: "m05-qs-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Why Hoare Partitioning Stops on Elements Equal to the Pivot",
      prompt: "In Hoare's two-pointer partition scheme with pivot $v$, the inner loops are written `while (A[i] < v) ++i;` and `while (v < A[j]) --j;`—meaning both pointers **stop** and swap whenever $A[i] == v$ and $A[j] == v$.",
      question: "What happens if a developer 'optimizes' the loops to skip equal keys via `while (A[i] <= v) ++i;` on an input where all $n$ keys are identical?",
      options: [
        "First, `i` walks off the end of the array unless guarded; second, even with bounds checks, skipping equal keys produces a maximally unbalanced 1 : (n - 1) split on all-equal inputs, degrading Quicksort from Θ(n log n) to Θ(n²)!",
        "It reduces comparisons by 50% and sorts all-equal arrays in O(n) time.",
        "It makes Quicksort stable on duplicate keys.",
        "It has no effect on partition balance because the median-of-three pivot always sits at the midpoint."
      ],
      answer: 0,
      explanation: "As Bentley and Sedgewick emphasize, stopping on keys equal to the pivot is counterintuitive on the surface (it performs unnecessary swaps of equal elements), but it is what saves 2-way Hoare Quicksort from Θ(n²) collapse on all-equal keys: by stopping on every element, `i` and `j` cross at the exact midpoint `n / 2`, producing a perfectly balanced 50/50 split!"
    },
    {
      id: "m05-qs-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Dijkstra 3-Way Partition (Dutch National Flag) Pointer Transition",
      prompt: "In Dijkstra's 3-way partition with invariant $A[lo \\dots lt-1] < v$, $A[lt \\dots i-1] == v$, $A[i \\dots gt]$ unexamined, and $A[gt+1 \\dots hi] > v$, the scan inspects $A[i]$ and finds $A[i] > v$.",
      question: "Which pointer update is executed after `std::swap(A[i], A[gt])`, and why is `i` NOT incremented in this branch?",
      options: [
        "Decrement `gt--` only (leave `i` unchanged), because the element just swapped into `A[i]` came from the unexamined region `A[gt]` and has not yet been compared against `v`.",
        "Increment `i++` and decrement `gt--`, because both `A[i]` and `A[gt]` are now in their final partitions.",
        "Increment `lt++` and decrement `gt--`.",
        "Increment `i++` only, because `A[gt]` is known to be `<= v`."
      ],
      answer: 0,
      explanation: "When `A[i] < v`, we swap `A[lt++]` with `A[i++]` because `A[lt]` was already known to equal `v`. By contrast, when `A[i] > v`, we swap `A[i]` with `A[gt--]`, where the old value of `A[gt]` was in the unexamined `[i..gt]` window—so the next loop iteration must inspect the new `A[i]` before advancing `i`!"
    },
    {
      id: "m05-qs-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Bounding Worst-Case Quicksort Stack Space to O(log N)",
      prompt: "Even if Quicksort suffers a worst-case sequence of $1 : (n - 1)$ partition splits (taking $\\Theta(n^2)$ time), Sedgewick's tail-call elimination guarantees the call stack never exceeds $\\lfloor \\log_2 n \\rfloor + 1$ stack frames.",
      question: "How must the recursive call and the iterative `while (lo < hi)` loop be ordered after partitioning to guarantee $O(\\log n)$ worst-case stack space?",
      options: [
        "Compare the sizes of the left and right partitions; make the true recursive call ONLY on the smaller partition (which has size ≤ n/2), and update `lo` or `hi` to iterate on the larger partition.",
        "Always recurse on the left partition `[lo, p - 1]` and tail-loop on the right partition `[p + 1, hi]`.",
        "Mark the function `inline` so the C++ compiler automatically flattens both recursive calls.",
        "Allocate a fixed `std::vector` on the heap inside each stack frame."
      ],
      answer: 0,
      explanation: "If you always recurse on the left partition and tail-loop on the right, an adversarial input where the left partition always has size n - 1 and the right has size 0 will still push n - 1 stack frames! By explicitly checking `if (left_size < right_size)` and recursing ONLY on the smaller side, every stack frame shrinks the problem size by at least a factor of 2, bounding stack depth by ≤ log₂ n."
    },
    {
      id: "m05-qs-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Bentley-McIlroy Split-End 3-Way Partition vs Dijkstra Dutch National Flag",
      prompt: "Dijkstra's 3-way partition swaps every element $< v$ across the center $== v$ band (`swap(A[lt++], A[i++])`), even when the input has $n$ distinct keys and only $1$ copy of the pivot.",
      question: "How did Bentley and McIlroy (1993) eliminate this extra swap overhead when keys are distinct while keeping $O(n)$ performance when duplicates are abundant?",
      options: [
        "During the main crossing scan (`i` right, `j` left), keys equal to `v` are swapped to the extreme outer ends `A[lo..p-1]` and `A[q+1..hi]` ONLY when `A[i] == v` or `A[j] == v` is encountered; if keys are distinct, zero extra swaps occur during the scan, and at the end the equal ends are swapped into the center.",
        "Bentley-McIlroy runs a hash table pre-pass to count duplicate frequencies before choosing between Hoare and Dijkstra.",
        "Bentley-McIlroy uses Counting Sort whenever subarray size exceeds 1,024.",
        "Bentley-McIlroy leaves keys equal to `v` scattered randomly across both partitions and removes them during insertion sort."
      ],
      answer: 0,
      explanation: "In Dijkstra's DNF, every element `< v` must be swapped with `A[lt]` even if there are no duplicate keys equal to `v` besides the pivot itself (increasing swaps from n/6 to ~n/2). Bentley-McIlroy's split-end layout parks equal keys at `[lo..p-1]` and `[q+1..hi]` only when an equal key is actually hit, matching Hoare's exact n/6 swap count on distinct keys and swapping the equal ends to the middle once `i` and `j` cross."
    }
  ],

  "randomized-quicksort-expectation": [
    {
      id: "m05-rqs-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Probability That Two Rank-Ordered Elements Are Compared in Randomized Quicksort",
      prompt: "Let $z_1 < z_2 < \\dots < z_n$ be the elements of an array sorted by rank. Consider $z_2$ (the 2nd smallest element) and $z_7$ (the 7th smallest element).",
      question: "What is the exact probability that $z_2$ and $z_7$ are compared to each other during an execution of Randomized Quicksort?",
      options: [
        "2 / (7 - 2 + 1) = 2 / 6 = 1 / 3, because z_2 and z_7 are compared if and only if the first pivot chosen from Z_{2,7} = {z_2, z_3, z_4, z_5, z_6, z_7} is either z_2 or z_7.",
        "2 / n, because either z_2 or z_7 must be chosen as the very first root pivot of the entire array.",
        "1 / 5, because there are 5 intervals between rank 2 and rank 7.",
        "1 / 2, because every pair of elements is compared with probability 50%."
      ],
      answer: 0,
      explanation: "Any pivot chosen outside Z_{2,7} = {z_2, ..., z_7} puts all 6 elements of Z_{2,7} into the same recursive call without comparing z_2 and z_7. The first pivot chosen from inside Z_{2,7} is equally likely to be any of its 7 - 2 + 1 = 6 elements; if it is z_2 or z_7 (2 choices out of 6), they are compared; if it is z_3, z_4, z_5, or z_6, they are separated into different partitions and never compared."
    },
    {
      id: "m05-rqs-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Adjacent-Rank Comparison Probability in Quicksort",
      prompt: "Again let $z_1 < z_2 < \\dots < z_n$ denote the $n$ distinct keys in sorted order.",
      question: "What is the probability that two adjacent-rank elements $z_i$ and $z_{i+1}$ are compared during Randomized Quicksort, and why?",
      options: [
        "100% (Probability = 2 / (i + 1 - i + 1) = 2 / 2 = 1): there is no element strictly between z_i and z_{i+1} that could separate them into different partitions before one of them is chosen as a pivot!",
        "2 / n, because they are only compared if one of them is chosen at the root.",
        "1 / 2, depending on which one appears first in the input array.",
        "1 / log₂ n."
      ],
      answer: 0,
      explanation: "For j = i + 1, the set Z_{i, i+1} = {z_i, z_{i+1}} has size 2 and no interior elements! No pivot can ever fall strictly between z_i and z_{i+1}, so they stay in the same subarray until one of them is inevitably selected as a pivot and compared against the other. In fact, every correct comparison sort must compare every adjacent-rank pair (z_i, z_{i+1}) to certify z_i < z_{i+1}!"
    },
    {
      id: "m05-rqs-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Comparing Constant Factors: Randomized Quicksort vs Merge Sort",
      prompt: "For large $n$, Merge Sort performs $\\approx 1.000\\, n \\log_2 n$ comparisons, whereas Randomized Quicksort performs $\\approx 2n \\ln n = (2\\ln 2)\\,n \\log_2 n \\approx 1.386\\, n \\log_2 n$ comparisons.",
      question: "Despite executing ~38.6% more comparisons, why does in-place Quicksort typically beat Merge Sort in wall-clock speed on primitive integer arrays in RAM?",
      options: [
        "Because Hoare Quicksort performs only ~(1/3 ln 2) n log₂ n ≈ 0.231 n log₂ n element swaps in-place in L1/L2 cache, whereas Merge Sort executes n log₂ n to 2n log₂ n cross-buffer element moves and incurs write-allocate cache pollution on an O(n) auxiliary array.",
        "Because integer comparisons take 0 CPU cycles on x86-64.",
        "Because Randomized Quicksort has a lower worst-case comparison bound than Merge Sort.",
        "Because Quicksort never suffers branch mispredictions during partitioning."
      ],
      answer: 0,
      explanation: "For scalar keys where comparisons are cheap (1 cycle) relative to memory bandwidth, data movement dominates runtime. Hoare Quicksort moves elements only when both pointers stop on out-of-place keys (1/6 n swaps = 1/3 n writes per pass), which is over 4× fewer writes than Merge Sort and requires zero O(n) auxiliary buffer allocations."
    },
    {
      id: "m05-rqs-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Why Linearity of Expectation Applies Despite Correlated Indicator Variables",
      prompt: "In the proof $\\mathbb{E}[X] = \\sum_{i < j} \\mathbb{E}[X_{ij}] = \\sum_{i < j} \\frac{2}{j - i + 1}$, a reviewer objects that the events $X_{1,3}$ and $X_{2,4}$ are NOT independent (if $z_2$ is chosen as the first pivot, $X_{1,3} = 0$ and $X_{2,4} = 1$).",
      question: "How does this correlation affect the derivation of $\\mathbb{E}[X]$ vs. the derivation of high-probability tail bounds $\\Pr[X > 4n \\ln n]$?",
      options: [
        "Linearity of expectation E[∑ X_{ij}] = ∑ E[X_{ij}] holds unconditionally for ANY collection of random variables regardless of correlation; correlation only matters when bounding variance Var(X) or applying Chernoff bounds (which instead bound the number of 'good' 1/4:3/4 splits along each root-to-leaf path).",
        "The reviewer is right: because X_{ij} are correlated, the true expectation is O(n (log n)²).",
        "The indicator variables X_{ij} are actually mutually independent for all pairs (i, j).",
        "Linearity of expectation only holds because the input array is assumed to be pre-shuffled."
      ],
      answer: 0,
      explanation: "Linearity of expectation is an identity of integrals/sums over the sample space and requires zero independence assumptions! Thus E[X] = 2(n+1)H_n - 4n is 100% exact. To prove high-probability tail concentration (since X_{ij} are dependent), we instead analyze the recursion tree depth: along any root-to-leaf path, each step hits the middle 50% of pivots independently with probability 1/2, so a path exceeds 24 ln n depth with probability ≤ n^{-3} by standard binomial Chernoff bounds."
    }
  ],

  "decision-tree-lower-bound": [
    {
      id: "m05-dt-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Why a Comparison Sort Decision Tree Must Have at Least n! Leaves",
      prompt: "Consider a deterministic comparison-based sorting algorithm executed on $n$ distinct keys.",
      question: "Why must its binary decision tree $T_n$ contain at least $n!$ reachable leaves?",
      options: [
        "If two distinct input permutations σ₁ ≠ σ₂ reached the same leaf, the algorithm would execute the exact same sequence of index swaps on both, which cannot simultaneously sort two different initial orders of distinct elements.",
        "Because each internal node of the tree has degree n!.",
        "Because a binary tree of height n always has n! leaves.",
        "Because the algorithm must compare every pair of elements, and there are n! pairs."
      ],
      answer: 0,
      explanation: "At a leaf of the decision tree, all comparisons have completed and the algorithm emits a fixed permutation π of the input indices. Since a permutation π is a bijection, there is only ONE input ordering σ = π⁻¹ that π maps to sorted order. Thus all n! possible input permutations of n distinct elements must terminate at distinct leaves."
    },
    {
      id: "m05-dt-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Exact Minimum Comparisons to Sort 5 Elements",
      prompt: "Standard Insertion Sort takes up to $\\binom{5}{2} = 10$ comparisons to sort $n = 5$ elements, and top-down Merge Sort takes up to $8$ comparisons.",
      question: "What is the information-theoretic lower bound $\\lceil \\log_2(5!) \\rceil$, and can a comparison sort actually achieve it in the worst case?",
      options: [
        "⌈log₂(120)⌉ = 7 comparisons, and yes: Ford-Johnson Merge-Insertion Sort achieves 7 comparisons in the worst case by pairing (a,b) and (c,d), comparing their winners, and binary-inserting the remaining two elements into 3-element chains.",
        "⌈log₂(120)⌉ = 7 comparisons, but no algorithm can sort 5 elements in fewer than 8 comparisons.",
        "⌈log₂(120)⌉ = 8 comparisons, achieved by Merge Sort.",
        "⌈log₂(120)⌉ = 6 comparisons, achieved by Quicksort."
      ],
      answer: 0,
      explanation: "Since 5! = 120 and 2^6 = 64 < 120 ≤ 128 = 2^7, the lower bound is 7 comparisons. Ford-Johnson sorts 5 elements in 7 comparisons: (1) compare a:b, (2) compare c:d, (3) compare winners b:d to form a 3-chain a < b < d with c < d (3 cmps so far), (4-5) binary insert the 5th element e into [a,b,d] (2 cmps), and (6-7) binary insert c into the 3 elements smaller than d (2 cmps) = 7 total!"
    },
    {
      id: "m05-dt-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Information-Theoretic Lower Bound for Sorting a Multiset with Duplicates",
      prompt: "You need to sort an array of length $n$ that is known to contain only $k = 3$ distinct values (e.g., `0`, `1`, `2`), each appearing $n / 3$ times.",
      question: "What does the decision-tree lower bound give for the minimum comparisons required to sort this multiset?",
      options: [
        "log₂(n! / ((n/3)!)³) = n log₂(3) - Θ(log n) ≈ 1.585n = Θ(n) comparisons, matched up to a constant factor by 3-way Dutch National Flag partitioning!",
        "Still Ω(n log n) comparisons, because any comparison sort takes Ω(n log n) regardless of duplicates.",
        "Zero comparisons, because the values are known to be 0, 1, and 2.",
        "Θ(n / 3) comparisons."
      ],
      answer: 0,
      explanation: "When keys have multiplicities f₁, ..., f_k, indistinguishable permutations of identical keys do not need separate leaves (or under 3-way <, =, > comparisons, equal keys collapse). There are only n! / (f₁! ... f_k!) distinct multiset permutations. Taking log₂ via Stirling's approximation gives n H(p₁,...,p_k) = n log₂ k comparisons when frequencies are equal—linear in n for constant k!"
    },
    {
      id: "m05-dt-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Sorting Networks vs Decision Trees on Superscalar CPUs",
      prompt: "To sort $n = 4$ integers, a decision tree requires $\\lceil \\log_2(4!) \\rceil = 5$ branched comparisons, whereas an optimal 4-element Sorting Network executes $5$ unconditional compare-and-swap (`min`/`max`) gates, and for $n = 5$ a sorting network executes $9$ compare-and-swap gates vs. Ford-Johnson's $7$ branched comparisons.",
      question: "Why do `pdqsort` and `libstdc++` use branchless Sorting Networks for small subarrays ($n \\le 8\\text{–}16$) instead of optimal decision trees like Ford-Johnson?",
      options: [
        "Because a single branch misprediction in a decision tree costs ~15 CPU cycles, whereas sorting network gates compile to data-independent `CMOV` or SIMD `min`/`max` instructions with 1-cycle latency and high instruction-level parallelism (3–4 independent gates per cycle).",
        "Because Ford-Johnson requires O(n²) heap allocations.",
        "Because sorting networks use fewer comparisons than ⌈log₂(n!)⌉ for n ≥ 16.",
        "Because CPUs cannot execute nested `if-else` statements deeper than 4 levels."
      ],
      answer: 0,
      explanation: "Decision trees minimize the *number of comparisons*, assuming comparisons are expensive and branches are free. On modern out-of-order CPUs, integer comparisons take 1 cycle while an unpredictable branch misprediction costs ~15 cycles! A 5-element sorting network executes 9 `CMOV` compare-and-swaps across 5 dependency layers in ~5 cycles total with zero branches, beating a 7-branch decision tree by 4–6×."
    }
  ],
  "counting-radix-bucket-sorts": [
    {
      id: "m05-radix-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Why LSD Radix Sort Requires a Stable Digit Sort",
      prompt: "An engineer implements Least-Significant-Digit (LSD) Radix Sort on 2-digit base-10 numbers `[42, 15, 41, 12]`, but replaces the stable Counting Sort pass with an unstable in-place bucket partition.",
      question: "What goes wrong on the final pass (sorting by the tens digit)?",
      options: [
        "After Pass 0 (ones digit), the array is [41, 42, 12, 15]; when Pass 1 groups keys with the same tens digit (41 and 42 both have tens digit 4), an unstable pass can flip their relative order to [42, 41, ...], destroying the ones-digit ordering established by Pass 0!",
        "The algorithm enters an infinite loop whenever two numbers share the same tens digit.",
        "The time complexity degrades from Θ(d(n + b)) to Θ(n²).",
        "Nothing goes wrong as long as all input numbers are distinct."
      ],
      answer: 0,
      explanation: "LSD Radix Sort's inductive invariant relies on Pass j preserving the relative order of all elements that tie on digit j, because their relative order on digits 0..j-1 was already established by the preceding passes. If Pass j is unstable, elements with equal most-significant digits end up arbitrarily ordered on their lower digits."
    },
    {
      id: "m05-radix-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Sorting Signed 64-Bit Two's-Complement Integers with Unsigned Radix Sort",
      prompt: "You have a fast unsigned 64-bit LSD Radix Sort `radix_sort_u64` and need to sort an array of signed `int64_t` values (which include negative numbers like `-1` = `0xFFFFFFFFFFFFFFFF` and `INT64_MIN` = `0x8000000000000000`).",
      question: "How can you transform each `int64_t x` so that standard unsigned 64-bit ordering matches signed `int64_t` ordering?",
      options: [
        "XOR each key with `1ULL << 63` (`uint64_t(x) ^ 0x8000000000000000ULL`) before sorting (and XOR again after): flipping the sign bit maps INT64_MIN to 0, -1 to 2^63 - 1, 0 to 2^63, and INT64_MAX to 2^64 - 1.",
        "Take the two's-complement negation `-x` of all negative numbers before sorting.",
        "Sort the array normally as `uint64_t` and then reverse the entire array.",
        "Radix Sort cannot sort negative integers without splitting into two separate arrays."
      ],
      answer: 0,
      explanation: "In two's-complement representation, negative numbers have MSB = 1 and increase monotonically from INT64_MIN (0x8000...0) to -1 (0xFFFF...F), while non-negative numbers have MSB = 0 and increase from 0 (0x0000...0) to INT64_MAX (0x7FFF...F). Flipping only the MSB (bit 63) shifts non-negative numbers to the upper half [2^63, 2^64-1] and negative numbers to the lower half [0, 2^63-1] while preserving monotonicity within both halves!"
    },
    {
      id: "m05-radix-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Choosing Radix Width r = 8 vs r = 16 on Modern CPU Caches and TLBs",
      prompt: "To sort $n = 10{,}000{,}000$ 32-bit integers, an engineer considers $r = 8$ bits ($256$ buckets, $4$ passes) vs. $r = 16$ bits ($65{,}536$ buckets, $2$ passes).",
      question: "Why does the 4-pass $r = 8$ Radix Sort frequently run faster in wall-clock time than the 2-pass $r = 16$ Radix Sort on modern CPUs?",
      options: [
        "With r = 16, the scatter phase writes simultaneously to 65,536 active bucket pointers spread across thousands of 4 KB virtual memory pages, thrashing the CPU's ~64–128 L1 dTLB entries, write-combining buffers, and 32 KB L1d cache; r = 8 uses only 256 active streams and a 1 KB histogram that stays hot in L1d.",
        "Because extracting a 16-bit slice `(x >> 16) & 0xFFFF` takes 10× more CPU instructions than extracting an 8-bit byte.",
        "Because 65,536-element arrays cannot be allocated on the stack or heap in C++.",
        "Because r = 16 violates sorting stability on 32-bit integers."
      ],
      answer: 0,
      explanation: "In the scatter loop `dst[offset[bucket]++] = x`, each active bucket pointer addresses a different cache line and (for large n) a different 4 KB virtual page. When the number of active buckets b = 65,536 exceeds the L1/L2 TLB capacity (typically 64–1,536 pages) and L1 cache lines (512 lines), almost every scatter write triggers a page-table walk and cache miss. Keeping r = 8 (256 buckets) or r = 11 (2,048 buckets) avoids TLB thrashing."
    },
    {
      id: "m05-radix-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Sorting IEEE-754 Floating-Point Numbers via Herf's FloatFlip Bijection",
      prompt: "IEEE-754 `double` values use sign-magnitude encoding: bit 63 is the sign bit, bits 52..62 are the biased exponent, and bits 0..51 are the mantissa. Positive doubles already sort in exact unsigned integer order (`std::bit_cast<uint64_t>`), but negative doubles have MSB = 1 and grow in unsigned bit value as they become *more negative* (e.g., `-2.0` has a larger bit pattern than `-1.0`).",
      question: "Which bitwise bijection transforms an IEEE-754 `uint64_t u` into an unsigned integer whose ordering matches floating-point `<` across both negative and positive values?",
      options: [
        "If the sign bit (bit 63) is 0 (positive), flip ONLY bit 63 (`u ^ (1ULL << 63)`); if the sign bit is 1 (negative), flip ALL 64 bits (`~u`), implemented branchlessly via `uint64_t mask = -int64_t(u >> 63) | (1ULL << 63); return u ^ mask;`.",
        "Flip only the sign bit `u ^ (1ULL << 63)`, just like two's-complement signed integers.",
        "Byte-swap the 64-bit word using `__builtin_bswap64(u)` so the mantissa precedes the exponent.",
        "XOR the exponent bits with `0x7FF` and leave the sign and mantissa bits unchanged."
      ],
      answer: 0,
      explanation: "Because IEEE-754 is sign-magnitude rather than two's-complement, flipping only bit 63 would place negative numbers in the lower half `[0, 2^63)` in *reverse* order (`-0.0 < -1.0 < -2.0 < -∞`). By flipping ALL 64 bits (`~u`) when bit 63 is 1, negative numbers map to `[0, 2^63)` in proper ascending order (`-∞` near 0 up to `-0.0` at `2^63 - 1`), while flipping only bit 63 when bit 63 is 0 maps positive numbers to `[2^63, 2^64)`."
    }
  ],

  "quickselect-bfprt-median": [
    {
      id: "m05-sel-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Why Quickselect Runs in O(N) Expected Time While Quicksort Takes O(N log N)",
      prompt: "Both Randomized Quicksort and Randomized Quickselect execute the exact same linear-time partition step at the root ($\\Theta(n)$ work).",
      question: "Why does Quickselect achieve $\\Theta(n)$ expected time whereas Quicksort requires $\\Theta(n \\log n)$?",
      options: [
        "Quicksort recurses on BOTH partitions (2 subproblems of average size n/2 → log₂ n levels of O(n) total work each), whereas Quickselect recurses on ONLY the single partition containing target index k (a geometric series n + αn + α²n + ... = Θ(n)).",
        "Quickselect uses a faster O(log n) partitioning algorithm than Quicksort.",
        "Quickselect stops after a constant number of 3 recursive calls on any input.",
        "Quickselect sorts the array using Counting Sort before indexing A[k]."
      ],
      answer: 0,
      explanation: "In Master Theorem / recursion-tree terms, T(n) = 2T(n/2) + cn has work cn at every level across log₂ n levels = cn log₂ n. By contrast, T(n) = T(αn) + cn (with α < 1, e.g., expected α = 3/4) is a geometric series bounded by cn / (1 - α) = O(n) total work."
    },
    {
      id: "m05-sel-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Deriving the 3n/10 Elimination Bound in BFPRT Median-of-Medians",
      prompt: "In the BFPRT algorithm, $n$ elements are divided into $\\lfloor n/5 \\rfloor$ groups of $5$, each group is sorted, and $x$ is chosen recursively as the median of the $\\lfloor n/5 \\rfloor$ group medians.",
      question: "Why are at least $\\frac{3n}{10} - O(1)$ elements guaranteed to be $\\le x$ (and symmetrically $\\ge x$)?",
      options: [
        "Because at least half of the n/5 group medians (n/10 groups) are ≤ x, and in each such sorted group of 5, the group median itself plus the 2 smaller elements in its group (3 elements per group) are all ≤ x: (n/10) × 3 = 3n/10.",
        "Because 3 out of 5 elements in every single group of 5 are ≤ x.",
        "Because x is chosen at random from the middle 40% of the array.",
        "Because sorting groups of 5 eliminates 30% of inversions across the whole array."
      ],
      answer: 0,
      explanation: "In the 2D grid where columns are sorted groups of 5 and columns are ordered by their middle row (the group medians), x sits at the center of the middle row. Every element in the top 3 rows of the left 50% of columns is ≤ its column median ≤ x. That quadrant contains (1/2)(n/5) columns × 3 rows = 3n/10 elements!"
    },
    {
      id: "m05-sel-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Why BFPRT With Groups of 3 Fails to Achieve Linear Time",
      prompt: "Suppose you modify BFPRT to divide the array into $\\lfloor n/3 \\rfloor$ groups of $3$ instead of groups of $5$, finding the median of the $n/3$ group medians.",
      question: "What recurrence does group size $g = 3$ produce, and what is its asymptotic solution?",
      options: [
        "T(n) ≤ T(n/3) + T(2n/3) + Θ(n); because 1/3 + 2/3 = 1, every level of the recursion tree performs Θ(n) work across Θ(log n) levels, degrading to Θ(n log n)!",
        "T(n) ≤ T(n/3) + T(n/2) + Θ(n) = Θ(n), which is even faster than groups of 5.",
        "T(n) ≤ 2T(n/3) + Θ(n) = Θ(n).",
        "T(n) = Θ(n²) because groups of 3 cannot guarantee any elements are smaller than the pivot."
      ],
      answer: 0,
      explanation: "With groups of 3, half the n/3 medians (n/6 groups) are ≤ x, and each group of 3 contributes 2 elements ≤ x (its median and its minimum), totaling (n/6) × 2 = n/3 elements guaranteed ≤ x. Thus the survivor partition can have up to n - n/3 = 2n/3 elements. Since the recursive subproblem sizes n/3 and 2n/3 sum to (1/3 + 2/3)n = 1.0n, there is no geometric decay and T(n) = Θ(n log n)."
    },
    {
      id: "m05-sel-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Finding the Top-K Smallest Elements Unsorted vs Sorted in Optimal Time",
      prompt: "A search backend needs to extract the top $k = 100$ highest-scoring documents from $n = 10{,}000{,}000$ candidate scores stored in an in-memory vector, and then return just those $100$ documents sorted descending by score.",
      question: "Which standard-library pipeline achieves the optimal asymptotic and wall-clock complexity $\\Theta(n + k \\log k)$?",
      options: [
        "Run `std::nth_element(v.begin(), v.begin() + k, v.end(), std::greater<>{})` in Θ(n) time to partition the top k elements into `v[0..k-1]`, then run `std::sort(v.begin(), v.begin() + k, std::greater<>{})` in Θ(k log k) time.",
        "Run `std::sort(v.begin(), v.end(), std::greater<>{})` and slice the first k elements in Θ(n log n) time.",
        "Run `std::partial_sort(v.begin(), v.begin() + k, v.end())`, which always runs in Θ(n) time independent of k.",
        "Insert all n elements one-by-one into a `std::set` and erase the smallest whenever size exceeds k in Θ(n log k) time with 10^7 heap allocations."
      ],
      answer: 0,
      explanation: "While `std::partial_sort` (heap-based) takes O(n log k) comparisons, `std::nth_element` (Introselect) partitions the k largest elements to the front in O(n) time (~3n comparisons, streaming sequentially in cache), after which sorting just `k = 100` elements takes ~600 comparisons (< 1 microsecond), yielding optimal Θ(n + k log k) time!"
    }
  ],

  "external-merge-sort-replacement": [
    {
      id: "m05-ext-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Optimal I/O Complexity in the External-Memory (DAM) Model",
      prompt: "A dataset of $N$ records is sorted on disk using an internal RAM capacity of $M$ records and a disk block transfer size of $B$ records.",
      question: "What is the optimal number of block I/O transfers required by External Multi-Way Merge Sort?",
      options: [
        "Θ((N / B) log_{M/B}(N / B)), achieved by generating initial sorted runs of size Θ(M) and merging K = Θ(M / B) runs per pass.",
        "Θ(N log₂ N), because every comparison requires a disk block read.",
        "Θ((N / B) log₂(N / B)), because only 2 runs can be merged in RAM at a time.",
        "Θ(N / M), regardless of how large N is relative to M."
      ],
      answer: 0,
      explanation: "Each pass over all N records reads and writes N / B blocks. By holding one input block buffer for each of K = ⌊M / B⌋ - 1 runs plus one output block buffer in RAM, each merge pass reduces the number of runs by a factor of Θ(M / B), requiring ⌈log_{M/B}(N / M)⌉ + 1 = Θ(log_{M/B}(N / B)) passes."
    },
    {
      id: "m05-ext-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Sizing Passes for a 100 GB External Sort with 1 GB RAM",
      prompt: "You need to sort $100\\text{ GB}$ of records using $M = 1\\text{ GB}$ of available RAM and $B = 4\\text{ MB}$ block buffers.",
      question: "How many initial sorted runs are created by basic in-memory sort-and-flush, what is the maximum merge fan-in $K$, and how many merge passes are required?",
      options: [
        "100 initial runs of 1 GB each; max fan-in K = (1024 MB / 4 MB) - 1 = 255 runs; since 100 ≤ 255, all 100 runs merge in a SINGLE K-way merge pass (total 2 passes = 400 GB of disk I/O)!",
        "100 initial runs; since binary merge merges 2 at a time, ⌈log₂ 100⌉ = 7 merge passes are required.",
        "25,600 initial runs of 4 MB each, requiring 2 merge passes.",
        "10 initial runs of 10 GB each."
      ],
      answer: 0,
      explanation: "Pass 0 reads 1 GB at a time, sorts in RAM, and writes 100 sorted runs of 1 GB each. In Pass 1, allocating one 4 MB input buffer for each of the 100 runs plus one 4 MB output buffer uses only 101 × 4 MB = 404 MB ≤ 1 GB of RAM! Thus all 100 runs merge into the final sorted 100 GB file in just 1 merge pass."
    },
    {
      id: "m05-ext-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Knuth's Replacement Selection and the 2M Snowplow Phenomenon",
      prompt: "Instead of loading $M$ records into RAM, sorting them, and flushing a run of size $M$, Replacement Selection maintains a min-heap of size $M$ and streams new records $y$ into the current run whenever $y \\ge \\text{last\\_key\\_output}$.",
      question: "For uniformly random input keys, what is the expected length of each sorted run produced by Replacement Selection, and what happens if the input file is already sorted?",
      options: [
        "Expected run length is 2M on random inputs (halving the number of initial runs via Knuth's Snowplow theorem), and a single run of length N (the entire file in 0 merge passes!) if the input is already sorted.",
        "Expected run length is M log₂ M on random inputs, and M on sorted inputs.",
        "Expected run length is 1.5M on random inputs, and M/2 on reverse-sorted inputs.",
        "Expected run length is always exactly 2M regardless of input order."
      ],
      answer: 0,
      explanation: "On random data, roughly half of the incoming keys are ≥ last_key_output and extend the current run before the active heap shrinks to 0, yielding an average run length of 2M. On an already-sorted input, every incoming key satisfies y ≥ last_key_output, so the active heap never shrinks and Replacement Selection outputs the entire N-record file as 1 single sorted run!"
    },
    {
      id: "m05-ext-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Why a Tournament Loser Tree Halves Key Comparisons Compared to a Binary Min-Heap",
      prompt: "During a $K$-way merge with $K = 256$ runs, every output record requires replacing the minimum element at the root of the priority queue with the next record from that same run.",
      question: "Why does a Tournament Loser Tree perform exactly $\\log_2 K = 8$ comparisons per record whereas a standard Binary Min-Heap performs $\\approx 2\\log_2 K = 16$ comparisons?",
      options: [
        "In a Binary Min-Heap, sifting down at each level requires 2 comparisons (first comparing the left and right children against each other, then comparing the smaller child against the new key); in a Loser Tree, internal nodes store the loser of each subtree match, so walking up from the updated leaf to the root compares the rising key against ONLY the single stored loser at each ancestor (1 comparison/level).",
        "Because a Loser Tree has branching factor 4 instead of 2.",
        "Because a Loser Tree skips the top half of the tree using a hash table.",
        "Because a Loser Tree only maintains approximate order and fixes inversions with Insertion Sort afterward."
      ],
      answer: 0,
      explanation: "When updating a tournament tree from a fixed leaf upward, the winner of the sibling subtree from the previous round is invariant! Storing the *loser* of each match in the internal node (rather than the winner) means the sibling subtree's champion is sitting right at the parent node waiting to be compared—requiring just 1 comparison per tree level and deterministic parent-index arithmetic `p >>= 1`."
    }
  ],

  "case-timsort-pdqsort": [
    {
      id: "m05-case-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Why TimSort Only Reverses Strictly Decreasing Natural Runs",
      prompt: "When TimSort scans for natural runs starting at $A[lo]$, it accepts non-decreasing runs ($A[i] \\le A[i+1]$) or <em>strictly</em> decreasing runs ($A[i] > A[i+1]$), reversing the latter in-place.",
      question: "Why must a decreasing run stop as soon as it encounters two equal elements ($A[i] == A[i+1]$)?",
      options: [
        "Because reversing a slice containing equal elements in-place (`std::reverse`) flips the relative order of those equal elements, violating sorting stability!",
        "Because `std::reverse` takes O(n²) time when duplicate elements are present.",
        "Because equal elements cause an integer overflow in `compute_minrun`.",
        "Because TimSort switches to Heapsort whenever duplicate elements are detected."
      ],
      answer: 0,
      explanation: "TimSort is a strictly stable sort (used for `list.sort()` in Python and `Array.prototype.sort` in V8). If a sequence `[10, 8_a, 8_b, 5]` were treated as a weak decreasing run and reversed in-place, it would become `[5, 8_b, 8_a, 10]`, placing `8_b` before `8_a` and breaking stability!"
    },
    {
      id: "m05-case-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Choosing TimSort's `minrun` Parameter in [32, 64)",
      prompt: "Suppose $N = 2{,}112 = 33 \\times 64$ vs. $N = 2{,}050 = 32 \\times 64 + 2$.",
      question: "Why does TimSort's `compute_minrun(N)` choose a minimum run length in $[32, 64]$ such that $N / \\text{minrun}$ is a power of 2 (or slightly less than a power of 2), rather than hardcoding `minrun = 64`?",
      options: [
        "If `minrun` were hardcoded to 64 on N = 2,050, random data would produce 32 runs of size 64 plus 1 tiny leftover run of size 2—forcing an unbalanced final merge of size 2,048 with size 2! Choosing `minrun = 33` yields 62 balanced runs that merge in a nearly complete binary tree.",
        "Because Binary Insertion Sort is only mathematically valid when the array length is a prime number.",
        "Because CPU cache lines are 33 bytes wide on 64-bit architectures.",
        "Because `minrun` must equal the recursion depth limit of Introsort."
      ],
      answer: 0,
      explanation: "When there are no long natural runs, every run gets extended to `minrun`. If `⌈N / minrun⌉` is just slightly above a power of 2 (like 2^k + 1), the perfectly balanced merge of the first 2^k runs has to do one final full-array merge just to absorb the tiny tail run! Shifting N down into [32, 64) keeps `N / minrun` at or just below a power of 2."
    },
    {
      id: "m05-case-q3",
      type: "mcq",
      difficulty: "apply",
      title: "How Rust's `pdqsort` Achieves O(N) Time on All-Equal or Low-Cardinality Slices",
      prompt: "In `pdqsort` (Rust's `slice::sort_unstable`), every recursive call receives `pred`: an optional pointer to the pivot of the closest ancestor partition for which the current subarray was the right-hand ($\\ge \\text{pivot}$) child.",
      question: "When the newly selected pivot for `A[lo..hi]` satisfies `pivot == *pred`, what does `pdqsort` know and what does it do?",
      options: [
        "Since `A[lo..hi]` is in the right subtree of `*pred`, no element in `A[lo..hi]` can be strictly less than `*pred`; thus `pivot == *pred` is the minimum possible value in `A[lo..hi]`, so `pdqsort` runs `partition_equal` to pack all keys `== pivot` to the left and immediately skips them without recursing!",
        "It knows the entire subarray is already sorted and returns immediately in O(1) time.",
        "It knows the pivot is the maximum element and switches to Heapsort.",
        "It reverses the subarray in-place and runs Counting Sort."
      ],
      answer: 0,
      explanation: "This is Orson Peters's elegant insight in `pdqsort`: instead of paying the 3-way Dutch National Flag partition tax on *every* partition (which hurts distinct keys), `pdqsort` uses a fast 2-way partition `(< pivot vs >= pivot)` normally, and detects duplicate pivots on the next level when the chosen pivot equals the lower bound `*pred`. A single 2-way `partition_equal` then isolates all duplicates in O(n) time!"
    },
    {
      id: "m05-case-q4",
      type: "mcq",
      difficulty: "staff",
      title: "The 2015 TimSort `merge_collapse` Formal Verification Bug (De Gouw et al.)",
      prompt: "Original TimSort checked only two conditions on the top 3 runs of the stack ($s-3, s-2, s-1$): `L[s-3] <= L[s-2] + L[s-1]` or `L[s-2] <= L[s-1]`. When the first condition triggered and `L[s-3] < L[s-1]`, it merged `s-3` and `s-2`.",
      question: "Why did this allow an attacker to overflow a fixed-size run stack in Java and Python, and what fourth-element check fixes it?",
      options: [
        "Merging `s-3` and `s-2` replaces `L[s-3]` with `L[s-3] + L[s-2]`, which can become ≥ `L[s-4] - L[s-3]` and violate the Fibonacci invariant one level deeper (`L[s-4] <= L[s-3] + L[s-2]`) without being re-checked! Adding `n > 1 && L[n-2] <= L[n-1] + L[n]` restores the global Fibonacci bound.",
        "Because `L[s-1]` could be 0, causing a division by zero in `gallop_left`.",
        "Because Fibonacci numbers grow slower than log₂ N for N > 2^32.",
        "Because `merge_at` pushed two new runs onto the stack instead of popping one."
      ],
      answer: 0,
      explanation: "For example, if the stack held runs `[120, 80, 25, 20, 30]`, `25 <= 20 + 30` triggers a merge of `80` and `25` into `105`, leaving `[120, 105, 20, 30]`. Now the top 3 runs `[105, 20, 30]` satisfy `105 > 20 + 30` so the loop stops—leaving `120 <= 105 + 20` violated deeper in the stack! Checking `L[s-4] <= L[s-3] + L[s-2]` (or switching to Powersort) permanently eliminates the bug."
    }
  ],

  "build-hybrid-introsort-timsort": [
    {
      id: "m05-build-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Boundary Trimming Before Allocating the Temporary Merge Buffer",
      prompt: "In `HybridAdaptiveSort::merge_at`, Run 1 is `A[base1 .. base1 + len1 - 1]` and Run 2 is `A[base2 .. base2 + len2 - 1]`. Before copying anything to `tmp`, we find `skip_left = upper_bound(Run1, A[base2])` and `len2 = lower_bound(Run2, A[base1 + len1 - 1])`.",
      question: "Why does Run 1 use `upper_bound` (first element strictly `> A[base2]`) while Run 2 uses `lower_bound` (first element `>= A[last_of_Run1]`)?",
      options: [
        "To preserve stability and maximize trimming: any prefix of Run 1 that is `<= A[base2]` (including elements equal to `A[base2]`) is already to the left of all of Run 2 and never needs to move; any suffix of Run 2 that is `>= A[last_of_Run1]` (including elements equal to `A[last_of_Run1]`) is already to the right of all of Run 1 and never needs to move!",
        "Because `upper_bound` is faster than `lower_bound` on left subarrays.",
        "Because Run 1 is sorted ascending while Run 2 is sorted descending.",
        "Using `lower_bound` on both would cause an out-of-bounds read at `A[base2]`."
      ],
      answer: 0,
      explanation: "If an element at the start of Run 1 equals `A[base2]`, stability dictates that Run 1's copy must stay *before* `A[base2]`—so it is already in its final position (`upper_bound` skips `<= A[base2]`). Symmetrically, if an element at the end of Run 2 equals `A[last1]`, stability dictates that Run 2's copy must stay *after* `A[last1]` (`lower_bound` trims from the first element `>= A[last1]` onward)."
    },
    {
      id: "m05-build-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Stability in Right-to-Left Smaller-Half Merging",
      prompt: "When merging Run 1 (`len1 = 500`) and Run 2 (`len2 = 80`), `len2 < len1`, so `merge_at` copies only Run 2 into `tmp[0..79]` and merges backwards from the right end (`dst = base2 + len2 - 1`, `i = base1 + len1 - 1`, `j = len2 - 1`).",
      question: "When `a[i] == tmp[j]` (an element in Run 1 equals an element in Run 2), which element MUST be written to `a[dst--]` first?",
      options: [
        "`tmp[j--]` (the element from Run 2) must be written to the rightmost slot `a[dst--]` first, so that `a[i]` (from Run 1) lands to its left and preserves their original relative order!",
        "`a[i--]` (the element from Run 1) must be written to `a[dst--]` first, just like in a left-to-right merge.",
        "Either one can be written first because `tmp` only holds primitive values.",
        "Both elements must be swapped in-place before decrementing `dst`."
      ],
      answer: 0,
      explanation: "In a left-to-right merge (`dst++`), equal elements take from Run 1 first so Run 1 sits at the smaller index. In a right-to-left merge (`dst--`), we are filling the *largest* indices first! Therefore, on a tie (`!(tmp[j] < a[i])`), the element from Run 2 (`tmp[j]`) must take the larger index (`a[dst--] = std::move(tmp[j--])`), leaving the smaller index for Run 1 (`a[i]`)."
    },
    {
      id: "m05-build-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Why `binary_insertion_sort` Accepts a `start` Offset",
      prompt: "In `HybridAdaptiveSort::sort`, after `count_run_and_make_ascending` finds a natural run of length `run_len = 12` (which is `< minrun = 36`), it calls `binary_insertion_sort(a, lo, lo + 36, lo + 12)`.",
      question: "Why does `binary_insertion_sort` begin its outer loop at `i = lo + 12` instead of `i = lo + 1`?",
      options: [
        "Because `a[lo .. lo + 11]` was just verified (or reversed) into sorted order by `count_run_and_make_ascending`, skipping 11 redundant binary searches and shifts.",
        "Because binary search only works when the sorted prefix has at least 12 elements.",
        "Because the first 12 elements are reserved as the run stack buffer.",
        "Because `compute_minrun` always returns a multiple of 12."
      ],
      answer: 0,
      explanation: "The natural run detector already established that `a[lo .. lo + run_len - 1]` is monotonically non-decreasing. Starting the insertion extension at `lo + run_len` reuses that natural sorted prefix as the initial binary search range for zero extra comparisons."
    },
    {
      id: "m05-build-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Worst-Case Scratch Buffer Allocation Bound in `HybridAdaptiveSort`",
      prompt: "During the execution of `HybridAdaptiveSort::sort` on an array of $N$ elements, `merge_at` resizes `tmp` to `std::min(len1, len2)`.",
      question: "What is the tightest upper bound on the capacity of `tmp` across the entire sort, and when is `tmp` never allocated at all ($0$ bytes)?",
      options: [
        "At most ⌊N / 2⌋ elements (since min(len1, len2) ≤ (len1 + len2)/2 ≤ N/2), and 0 bytes whenever the input has ≤ 1 run after trimming (e.g., already sorted, strictly descending, or two appended runs whose boundary doesn't overlap).",
        "Exactly N elements on every input, allocated upfront in `sort()`.",
        "At most `minrun` (≤ 64) elements regardless of N.",
        "O(N log N) elements across recursive stack frames."
      ],
      answer: 0,
      explanation: "Because `merge_at` only copies the smaller of the two runs being merged (`min(len1, len2)`), even the final top-level merge of two runs summing to N copies at most `⌊N / 2⌋` elements. Moreover, because `tmp` is lazily resized *after* `upper_bound` / `lower_bound` boundary trimming, inputs consisting of concatenated non-overlapping sorted segments never allocate a single byte of heap memory!"
    }
  ]
});
