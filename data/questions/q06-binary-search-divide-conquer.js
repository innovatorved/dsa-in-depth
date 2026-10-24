// ============================================================================
// Track II — Module m06: Binary Search, Parametric Search & Divide-and-Conquer
// Question Bank: data/questions/q06-binary-search-divide-conquer.js
// 10 Units × 4 MCQs = 40 Questions (recall, apply, apply, staff)
// ============================================================================
window.QUESTION_BANK = window.QUESTION_BANK || {};

Object.assign(window.QUESTION_BANK, {
  "binary-search-boundary-invariants": [
    {
      id: "m06-u01-q01",
      type: "mcq",
      difficulty: "recall",
      title: "Half-Open Invariant in std::lower_bound",
      prompt: "Consider the canonical half-open binary search over [lo, hi) = [0, n) for the first index i where P(i) is true (e.g., a[i] >= target).",
      question: "When mid = lo + (hi - lo) / 2 is evaluated and P(mid) is TRUE, why do we update hi = mid rather than hi = mid - 1?",
      options: [
        "Because mid is still a valid candidate for the first TRUE index, and in a half-open interval [lo, hi), setting hi = mid excludes all indices > mid while keeping mid inside the boundary.",
        "Because integer division rounds up, so mid - 1 could underflow below zero when lo = 0.",
        "Because setting hi = mid - 1 would skip checking lo when hi - lo == 2.",
        "Because hi must always remain strictly greater than mid inside the while (lo < hi) loop."
      ],
      answer: 0,
      explanation: "In the half-open invariant (lo = 0, hi = n), all indices >= hi are known to satisfy P(i) == true, and all indices < lo satisfy P(i) == false. When P(mid) is true, mid itself is now the smallest known index where P holds, so setting hi = mid maintains the invariant that P(hi) is true."
    },
    {
      id: "m06-u01-q02",
      type: "mcq",
      difficulty: "apply",
      title: "Diagnosing the 2-Element Infinite Loop",
      prompt: "An engineer writes a binary search to find the LAST index i in [0, n - 1] where a[i] <= target:\n\nwhile (lo < hi) {\n    size_t mid = lo + (hi - lo) / 2;\n    if (a[mid] <= target) lo = mid;\n    else hi = mid - 1;\n}",
      question: "For which input state does this loop spin forever, and what single change fixes it?",
      options: [
        "When hi == lo + 1 and a[lo] <= target: mid evaluates to lo, so lo = mid makes zero progress; fix by using upper-midpoint rounding mid = lo + (hi - lo + 1) / 2.",
        "When lo == 0 and hi == 0: mid evaluates to 0 and hi = mid - 1 wraps around; fix by changing the loop condition to while (lo <= hi).",
        "When all elements are strictly greater than target: hi decrements past lo; fix by changing else hi = mid - 1 to else hi = mid.",
        "When n is an odd prime: (hi - lo) / 2 truncates the remainder; fix by padding the array to a power of two."
      ],
      answer: 0,
      explanation: "Whenever a binary search updates lo = mid (without +1), a 2-element interval [lo, lo + 1] with floor midpoint mid = lo + (1)/2 = lo will set lo = lo whenever the true branch is taken, looping infinitely. Using upper-midpoint mid = lo + (hi - lo + 1) / 2 ensures mid = lo + 1 on a 2-element range."
    },
    {
      id: "m06-u01-q03",
      type: "mcq",
      difficulty: "apply",
      title: "Midpoint Overflow and Two's Complement Bitwise Shift",
      prompt: "In 32-bit signed integer arithmetic (INT_MAX = 2,147,483,647), an array has lo = 1,500,000,000 and hi = 1,800,000,000.",
      question: "What happens if you compute int mid = (lo + hi) / 2 vs. int mid = ((unsigned int)lo + (unsigned int)hi) >> 1?",
      options: [
        "(lo + hi) overflows 32-bit signed int (3.3 * 10^9 > 2.147 * 10^9), invoking undefined behavior (negative midpoint -497,483,648), whereas casting to unsigned int and shifting right by 1 computes the exact midpoint 1,650,000,000.",
        "Both expressions overflow because 3.3 * 10^9 exceeds UINT32_MAX (4.29 * 10^9).",
        "The compiler automatically promotes (lo + hi) to 64-bit long long before dividing by 2.",
        "((unsigned int)lo + (unsigned int)hi) >> 1 performs an arithmetic shift that preserves the sign bit and produces a negative index."
      ],
      answer: 0,
      explanation: "As Joshua Bloch famously documented in 2006, 1.5e9 + 1.8e9 = 3.3e9 overflows signed 32-bit INT_MAX (2.147e9), wrapping into negative territory, whereas unsigned 32-bit addition handles sums up to 4.29e9 without overflow and logical right shift >> 1 divides by 2."
    },
    {
      id: "m06-u01-q04",
      type: "mcq",
      difficulty: "staff",
      title: "Why 2-Way Branchless Binary Search Beats 3-Way Early-Exit Search",
      prompt: "A colleague argues that adding `if (a[mid] == target) return mid;` inside the binary search loop is always faster than waiting for `lo == hi` because it can return early when it hits the target.",
      question: "Why does a 2-way comparison loop (especially compiled to branchless CMOV) consistently outperform 3-way early-exit binary search on modern out-of-order CPUs?",
      options: [
        "Half of all array elements reside in the bottom leaf level of the decision tree and 75% in the bottom two levels, so early hits save <= 1 step on average while adding an extra branch instruction and preventing branchless CMOV generation at every single level.",
        "The equality operator == on integers takes 4 CPU cycles whereas < takes only 1 cycle.",
        "Modern CPUs cannot execute more than one conditional branch per 64-byte instruction cache line.",
        "Early exit invalidates the L1 data cache line containing a[mid], forcing a main-memory reload."
      ],
      answer: 0,
      explanation: "In a binary tree of depth d, 50% of nodes are at depth d and 25% at depth d-1. Thus, early exit saves fewer than 1 iteration on average across uniform queries, while doubling the branches per iteration and blocking the compiler from emitting a single branchless conditional move (cmov)."
    }
  ],

  "parametric-search-answer-space": [
    {
      id: "m06-u02-q01",
      type: "mcq",
      difficulty: "recall",
      title: "Necessary and Sufficient Condition for Parametric Search",
      prompt: "You want to find the minimum capacity X required to complete a scheduling task within K days by binary searching over X in [lo, hi].",
      question: "What property must the decision oracle feasible(X) satisfy for binary search over the answer space to be valid?",
      options: [
        "Monotonicity (a step-function threshold X*): for all X < X*, feasible(X) is false, and for all X >= X*, feasible(X) is true.",
        "Convexity: feasible(X) must decrease to a local minimum and then increase monotonically.",
        "Linearity: the number of days required must be an exact linear function of X.",
        "Submodularity: adding an extra day must yield diminishing marginal capacity reductions."
      ],
      answer: 0,
      explanation: "Binary search on the answer space requires only that the boolean predicate feasible(X) be monotonic—transitioning at most once from false to true (for minimization) or from true to false (for maximization)."
    },
    {
      id: "m06-u02-q02",
      type: "mcq",
      difficulty: "apply",
      title: "Tight Search Bounds & Negative-Weight Failure in Split Array Largest Sum",
      prompt: "Given an array w of N integers and an integer K, we want to partition w into at most K contiguous subarrays to minimize the maximum subarray sum.",
      question: "Why does the standard O(N log(sum(w))) parametric search with a greedy left-to-right accumulator oracle fail if w contains negative integers?",
      options: [
        "While the global feasibility predicate is still monotonic in X, the greedy O(N) oracle fails because extending a subarray across future negative numbers could reduce a sum that temporarily exceeded X.",
        "Because sum(w) can be negative, causing (lo + hi) / 2 to divide by zero.",
        "Because a contiguous subarray containing negative numbers is no longer contiguous.",
        "Because K contiguous subarrays cannot cover an array when any element is negative."
      ],
      answer: 0,
      explanation: "When all weights are >= 0, prefix sums within a subarray grow monotonically, so the greedy strategy 'pack as many items as possible until cur + w[i] > X' is optimal. With negative weights, a subarray sum could exceed X at index i and later drop below X at index i + 3, invalidating the greedy oracle."
    },
    {
      id: "m06-u02-q03",
      type: "mcq",
      difficulty: "apply",
      title: "0/1 Fractional Programming via Dinkelbach's Transformation",
      prompt: "Each of N items has profit a_i and positive cost b_i > 0. You must select exactly K items to maximize the ratio (sum_{i in S} a_i) / (sum_{i in S} b_i).",
      question: "How do we test in O(N) (or O(N log N)) time whether a candidate ratio lambda is achievable?",
      options: [
        "Transform the condition (sum a_i)/(sum b_i) >= lambda into sum (a_i - lambda * b_i) >= 0, compute the transformed weights d_i = a_i - lambda * b_i, and check if the sum of the K largest d_i values is >= 0.",
        "Sort items by their individual ratios a_i / b_i once and greedily pick the top K items.",
        "Binary search independently on the numerator sum a_i and the denominator sum b_i.",
        "Check if at least K items individually satisfy a_i / b_i >= lambda."
      ],
      answer: 0,
      explanation: "Because b_i > 0, (sum_{i in S} a_i) / (sum_{i in S} b_i) >= lambda is algebraically equivalent to sum_{i in S} (a_i - lambda * b_i) >= 0. Selecting the K items with the largest transformed weights d_i = a_i - lambda * b_i via std::nth_element tests feasibility in O(N) time!"
    },
    {
      id: "m06-u02-q04",
      type: "mcq",
      difficulty: "staff",
      title: "IEEE-754 ULP Starvation in Floating-Point Binary Search",
      prompt: "In a production geometry service, a continuous binary search over `double lo = 0.0, hi = 1e9;` uses the loop `while (hi - lo > 1e-9) { double mid = 0.5 * (lo + hi); ... }`. In production, the service intermittently hangs at 100% CPU.",
      question: "What causes the infinite loop, and what is the mathematically sound fix?",
      options: [
        "Near 10^9, an IEEE-754 double (53-bit significand) has a unit-in-the-last-place (ULP) spacing of 10^9 * 2^{-52} ~= 2.22 * 10^{-7} > 10^{-9}; mid rounds to exact lo or hi when they are adjacent floats. Fix by using a fixed iteration loop (e.g., 64–80 iterations) or std::midpoint.",
        "0.5 * (lo + hi) overflows the 11-bit exponent of IEEE-754 double when hi = 10^9.",
        "The CPU FPU flushes subnormal numbers to zero whenever hi - lo < 10^{-9}.",
        "Floating-point comparisons with > 1e-9 trigger a signaling NaN exception that restarts the loop."
      ],
      answer: 0,
      explanation: "IEEE-754 double has 53 bits of mantissa (~15-17 significant decimal digits). At magnitude 10^9, adjacent representable doubles differ by ~2.22e-7, so `hi - lo` can never shrink below 1e-9 without becoming 0. Running a fixed number of iterations (e.g., 70 iterations) halves the interval 2^70 times and always terminates."
    }
  ],

  "rotated-bitonic-unbounded-search": [
    {
      id: "m06-u03-q01",
      type: "mcq",
      difficulty: "recall",
      title: "Bitonic Peak Search Invariant",
      prompt: "An array A[0..n-1] of distinct integers is strictly increasing up to an unknown peak index p and strictly decreasing from p to n - 1.",
      question: "In a half-open search over [lo, hi) = [0, n - 1), what does the local comparison `A[mid] < A[mid + 1]` tell us?",
      options: [
        "mid lies on the strictly ascending left slope, so the peak index p must lie in [mid + 1, hi]; we update lo = mid + 1.",
        "mid lies on the strictly descending right slope, so the peak index p must lie in [lo, mid]; we update hi = mid.",
        "mid is guaranteed to be the exact global minimum of the array.",
        "We must also compare A[mid] against A[lo] to determine which side the peak is on."
      ],
      answer: 0,
      explanation: "Because a unimodal/bitonic array increases up to p and decreases after p, A[mid] < A[mid + 1] means the sequence is still rising at mid, so mid cannot be the peak and p >= mid + 1. Conversely, A[mid] > A[mid + 1] means p <= mid."
    },
    {
      id: "m06-u03-q02",
      type: "mcq",
      difficulty: "apply",
      title: "Worst-Case Lower Bound for Rotated Sorted Array with Duplicates",
      prompt: "You are searching for a target in a rotated sorted array A[0..n-1] that may contain duplicate values. At step mid, you observe A[lo] == A[mid] && A[mid] == A[hi].",
      question: "Why does the worst-case time complexity degrade from O(log n) to Theta(n)?",
      options: [
        "When A[lo] == A[mid] == A[hi] (e.g., [1, 1, 1, 0, 1, 1, 1]), a single probe at mid cannot distinguish whether the drop-off pivot lies in [lo, mid] or [mid, hi], forcing a linear shrinkage (++lo, --hi) in the worst case.",
        "Because duplicate elements cause integer overflow when computing mid = lo + (hi - lo) / 2.",
        "Because C++ std::lower_bound throws an exception if elements are not strictly increasing.",
        "Because the rotation pivot always moves to index n / 2 when duplicates are present."
      ],
      answer: 0,
      explanation: "An adversary can hide a single distinct element (say 0) at any position among n - 1 copies of 1. Any probe that hits a 1 yields A[lo] == A[mid] == A[hi] == 1, revealing zero information about which half contains the 0 and proving an Omega(n) decision-tree lower bound."
    },
    {
      id: "m06-u03-q03",
      type: "mcq",
      difficulty: "apply",
      title: "Complexity of Exponential (Galloping) Search",
      prompt: "We search for a target in a sorted array of size N = 10^8 starting from a cursor at index 0. The target actually sits at index k = 50.",
      question: "How many comparisons does Exponential (Galloping) Search perform compared to standard binary search over [0, N)?",
      options: [
        "Exponential search doubles step = 1, 2, 4, 8, 16, 32, 64 (~6 probes) to bracket k in [32, 64] and then binary searches that 32-element window (~5 probes) for ~11 probes total (2*log_2(k)), vs. ~27 probes (log_2 N) for full-array binary search.",
        "Exponential search scans linearly one by one up to k = 50, taking 50 comparisons.",
        "Exponential search takes O(log N * log k) ~= 160 comparisons because it runs binary search at every doubling step.",
        "Both take exactly 27 comparisons because binary search cannot start before knowing the upper bound N."
      ],
      answer: 0,
      explanation: "Bentley & Yao's exponential search finds the smallest power of two 2^m >= k in m = ceil(log_2 k) probes, then runs binary search on the bracket [2^{m-1}, 2^m] of size <= k in another ceil(log_2 k) probes, totaling 2 * log_2(k) + O(1) comparisons—AND keeping all memory accesses inside the first few cache lines!"
    },
    {
      id: "m06-u03-q04",
      type: "mcq",
      difficulty: "staff",
      title: "Why TimSort Uses Galloping Mode during Asymmetric Merges",
      prompt: "In Python and Java's TimSort (and database inverted-index intersections), merging a sorted run A of length 1,000 with a sorted run B of length 1,000,000 switches from one-by-one comparison to Exponential (Galloping) Search whenever one run wins 7 times in a row.",
      question: "What is the asymptotic and hardware advantage of switching to Galloping Search during such an asymmetric merge?",
      options: [
        "Each element of the shorter run A skips over a gap of size d_i in B in O(log d_i) probes instead of O(d_i) linear comparisons; by Jensen's inequality on concave log, sum_{i=1}^{|A|} O(log d_i) = O(|A| log(|B| / |A|)) << O(|A| + |B|).",
        "Galloping mode sorts run B in-place using quicksort before merging.",
        "Galloping mode eliminates all comparisons and uses radix hashing to intersect the runs.",
        "Galloping mode reduces auxiliary memory from O(|A|) to O(1) by overwriting run B."
      ],
      answer: 0,
      explanation: "When |A| << |B|, linear merging touches all |B| = 1,000,000 elements. Galloping search from the current cursor in B jumps over gaps d_1, d_2, ..., d_{|A|} (where sum d_i = |B|) in sum O(log d_i) <= O(|A| log(|B|/|A|)) time—matching the information-theoretic optimal bound for sorted set intersection!"
    }
  ],

  "fractional-cascading": [
    {
      id: "m06-u04-q01",
      type: "mcq",
      difficulty: "recall",
      title: "Asymptotic Speedup of Fractional Cascading",
      prompt: "You have a catalog of k sorted lists L_0, L_1, ..., L_{k-1}, each of length n (total N = k * n elements), and need to find the lower_bound of a query value q in all k lists.",
      question: "How does Fractional Cascading improve the query time and what is its total space complexity?",
      options: [
        "Query time drops from O(k log n) to O(log n + k), while total space across all augmented lists remains linear O(k * n) = O(N) (specifically <= 2N elements).",
        "Query time drops to O(1) total across all k lists using O(N^2) precomputed lookup tables.",
        "Query time is O(k log log n) using O(N log k) space via van Emde Boas trees.",
        "Query time remains O(k log n), but cache misses are reduced by storing lists in column-major order."
      ],
      answer: 0,
      explanation: "Chazelle & Guibas (1986) showed that promoting every 2nd element from augmented list M_{i+1} up into M_i lets a query perform one O(log n) binary search in M_0 followed by k - 1 constant-time O(1) pointer hops, while geometric series decay (1 + 1/2 + 1/4 + ... = 2) keeps total space <= 2N."
    },
    {
      id: "m06-u04-q02",
      type: "mcq",
      difficulty: "apply",
      title: "Why Total Augmented Space Is Bounded by 2N",
      prompt: "In Fractional Cascading, we build M_{k-1} = L_{k-1}, and for each i from k - 2 down to 0, we form M_i by merging L_i with every 2nd element of M_{i+1}.",
      question: "Suppose you accidentally promoted every element (fraction alpha = 1) or promoted from M_{i+1} with fraction alpha = 1/2. Why is alpha = 1/2 the sweet spot?",
      options: [
        "With alpha = 1, M_0 contains all k*n elements and total space explodes to Theta(k^2 * n); with alpha = 1/2, an element from L_j contributes at most (1/2)^{j-i} elements to M_i, summing to sum_{d>=0} (1/2)^d = 2x total space while leaving at most 1 unpromoted element between consecutive bridges!",
        "Because 1/2 is the only fraction representable in binary floating-point without rounding error.",
        "Because alpha = 1/2 guarantees that all augmented lists M_i have the exact same length n.",
        "Because promoting more than 1/2 of the elements violates the sorted order of M_i."
      ],
      answer: 0,
      explanation: "With promotion fraction alpha = 1/2, the geometric series 1 + 1/2 + 1/4 + ... <= 2 bounds the total number of elements across all augmented lists to at most 2 * sum |L_i| = 2N, while ensuring every gap in M_{i+1} between promoted bridges has size at most 1."
    },
    {
      id: "m06-u04-q03",
      type: "mcq",
      difficulty: "apply",
      title: "The O(1) Local Refinement Step Across Cascade Bridges",
      prompt: "During a query for q = 27, we know that M_i[cur] (value 34) is the lower_bound of q in M_i. Following its bridge pointer `next_pos = M_i[cur].next_cascade_idx` lands at value 34 in M_{i+1}.",
      question: "Which indices in M_{i+1} could possibly be the true lower_bound of q = 27 in M_{i+1}?",
      options: [
        "Only `next_pos - 1` or `next_pos`: because every 2nd element of M_{i+1} was promoted to M_i, at most one element of M_{i+1} >= q could lie strictly before M_{i+1}[next_pos] without having been promoted into M_i.",
        "Any index in [next_pos - k, next_pos], requiring an O(log k) binary search.",
        "Only `next_pos` or `next_pos + 1`, because promoted elements always round down.",
        "Exactly `next_pos`, with zero comparisons required in M_{i+1}."
      ],
      answer: 0,
      explanation: "Since M_i[cur - 1].val < q <= M_i[cur].val and every second element of M_{i+1} is present in M_i, there can be at most one unpromoted element in M_{i+1} between the predecessor bridge and `next_pos`. Thus a single check `if (next_pos > 0 && M_{i+1}[next_pos - 1].val >= q) --next_pos;` finds the exact lower_bound in O(1)!"
    },
    {
      id: "m06-u04-q04",
      type: "mcq",
      difficulty: "staff",
      title: "Fractional Cascading in 2D Orthogonal Range Trees",
      prompt: "A 2D Orthogonal Range Tree stores N points in a primary balanced BST on X-coordinates, where each internal node v stores a secondary sorted array Y(v) of the Y-coordinates in v's subtree. A 2D range query [x1, x2] x [y1, y2] identifies O(log N) canonical nodes in the primary tree.",
      question: "How does Fractional Cascading accelerate 2D Orthogonal Range Reporting from O(log^2 N + K) to O(log N + K), and why does a Promotion Fraction of 1/2 not even need bottom-up sampling here?",
      options: [
        "Because Y(v) at any parent node v is ALREADY the disjoint union of its children's arrays Y(left(v)) and Y(right(v))! Simply storing 2 bridge pointers from each element of Y(v) into Y(left(v)) and Y(right(v)) lets a single O(log N) binary search at the root cascade down all O(log N) canonical nodes in O(1) per node.",
        "It replaces the primary X-tree with a hash table so only 1 canonical node is visited.",
        "It compresses 2D coordinates into 1D Z-order Morton codes so a single std::lower_bound suffices.",
        "It precomputes the answers to all O(N^4) possible rectangles in O(N log N) space."
      ],
      answer: 0,
      explanation: "In a 2D Range Tree, every element of Y(left(v)) and Y(right(v)) is ALREADY present in the parent's array Y(v) (100% inclusion without extra space!). Thus, storing left_bridge and right_bridge pointers in Y(v) (known as Layered Range Trees) achieves O(log N + K) query time in O(N log N) space immediately."
    }
  ],

  "divide-and-conquer-closest-pair": [
    {
      id: "m06-u05-q01",
      type: "mcq",
      difficulty: "recall",
      title: "The 2-Delta Vertical Strip Filter",
      prompt: "In the Shamos-Hoey planar closest-pair divide-and-conquer algorithm, the left and right recursive calls return minimum distances delta_L and delta_R around dividing line x = x_m, and we set delta = min(delta_L, delta_R).",
      question: "When constructing the candidate strip S for cross-boundary pairs, which points must be included in S?",
      options: [
        "All points p in the current subproblem satisfying |p.x - x_m| < delta, ordered by their Y-coordinates.",
        "All points p satisfying |p.y - y_m| < delta, ordered by their X-coordinates.",
        "Only the single rightmost point of P_L and the single leftmost point of P_R.",
        "All points within Euclidean distance delta of the midpoint (x_m, y_m)."
      ],
      answer: 0,
      explanation: "For a pair (p_L, p_R) with p_L.x <= x_m <= p_R.x to have Euclidean distance < delta, both horizontal distances |p_L.x - x_m| and |p_R.x - x_m| must be strictly less than delta."
    },
    {
      id: "m06-u05-q02",
      type: "mcq",
      difficulty: "apply",
      title: "Why Each Strip Point Checks at Most 7 Subsequent Neighbors",
      prompt: "In the Y-sorted strip S of width 2*delta, for each point S[i] at vertical coordinate y_0, we only inspect subsequent points S[j] (j > i) with S[j].y < y_0 + delta.",
      question: "What geometric packing argument proves that at most 7 subsequent points in S can satisfy S[j].y - S[i].y < delta?",
      options: [
        "The 2*delta x delta bounding box above y_0 partitions into eight squares of side (delta/2) x (delta/2); each square has diagonal delta/sqrt(2) ~= 0.707*delta < delta, so by the pigeonhole principle at most 1 point from P_L (or P_R) can lie in each of the 8 squares (leaving <= 7 others besides S[i]).",
        "Because on a 2D hexagonal lattice, the kissing number of unit circles in the plane is 6, plus 1 center point equals 7.",
        "Because binary search on a strip of size N takes at most 7 steps when N <= 128.",
        "Because any 8 points in the plane always contain 3 collinear points."
      ],
      answer: 0,
      explanation: "Four (delta/2) x (delta/2) squares cover the left [x_m - delta, x_m] x [y_0, y_0 + delta] region (all in P_L) and four cover the right region (all in P_R). Since any two points inside the same half are at distance >= delta and each small square has diameter delta/sqrt(2) < delta, each of the 8 squares holds at most 1 point!"
    },
    {
      id: "m06-u05-q03",
      type: "mcq",
      difficulty: "apply",
      title: "Avoiding O(N log^2 N) by Bottom-Up Y-Merging",
      prompt: "A developer implements the closest-pair divide-and-conquer algorithm and calls `std::sort(strip.begin(), strip.end(), cmp_y)` inside every recursive call before scanning the strip.",
      question: "What is the time complexity of this implementation, and how do we reduce it to O(N log N)?",
      options: [
        "Sorting the strip from scratch at each level gives T(N) = 2T(N/2) + O(N log N) = Theta(N log^2 N); instead, maintain Y-sorted order bottom-up via a linear O(N) std::merge of the two halves (just like Merge Sort) before filtering the strip, yielding T(N) = 2T(N/2) + O(N) = Theta(N log N).",
        "It is already O(N log N) because the strip always contains at most O(sqrt(N)) points.",
        "It degrades to O(N^2); fix by using std::nth_element on the Y-coordinates.",
        "It is O(N log^3 N); fix by using Fractional Cascading on the X-coordinates."
      ],
      answer: 0,
      explanation: "In the worst case, all N points can lie inside the 2*delta strip, so calling std::sort by Y at each recursion level costs O(N log N) work per level across log N levels = O(N log^2 N). Merging the two already-Y-sorted subarrays via std::merge takes O(N) time per level."
    },
    {
      id: "m06-u05-q04",
      type: "mcq",
      difficulty: "staff",
      title: "Degenerate Collinear Points & Top-Down Y-Partitioning Pitfall",
      prompt: "In an alternative top-down implementation, you pass both X-sorted array P_X and Y-sorted array P_Y down the recursion and partition P_Y into P_YL and P_YR using `if (p.x < mid_x) P_YL.push_back(p); else P_YR.push_back(p);`.",
      question: "How can an adversarial point cloud cause this top-down partitioning to crash or degrade to Theta(N^2) time, and how is it prevented?",
      options: [
        "If all N points share the exact same X-coordinate (e.g., x = 0), `p.x < mid_x` is false for every point, putting 0 points in P_YL and all N points in P_YR (infinite recursion or Theta(N^2)); prevent this by breaking ties using (p.x, p.y, p.id) or by merging Y bottom-up by index range [lo, mid) and [mid, hi).",
        "If all N points lie on the line y = x, the strip S becomes empty and returns infinity.",
        "If coordinates are negative, mid_x becomes negative and swaps P_YL with P_YR.",
        "Top-down partitioning fails whenever N is not an exact power of two."
      ],
      answer: 0,
      explanation: "Splitting purely by coordinate inequality `p.x < mid_x` fails when many points lie on the vertical line `x == mid_x`. Either compare the full tuple `(p.x, p.y, p.id) < (mid_p.x, mid_p.y, mid_p.id)` when partitioning top-down, or merge by Y bottom-up over exact index ranges `[lo, mid)` and `[mid, hi)`."
    }
  ],

  "karatsuba-strassen-algebraic-dc": [
    {
      id: "m06-u06-q01",
      type: "mcq",
      difficulty: "recall",
      title: "Karatsuba's Gauss Identity & Master Theorem Exponent",
      prompt: "To multiply two n-limb numbers X = x_1 B^m + x_0 and Y = y_1 B^m + y_0 (where m = n/2), we need z_2 = x_1*y_1, z_0 = x_0*y_0, and the middle cross-term z_1 = x_1*y_0 + x_0*y_1.",
      question: "How does Karatsuba compute z_1 using only ONE additional half-size multiplication, and what asymptotic complexity does this achieve?",
      options: [
        "Compute z_m = (x_1 + x_0)(y_1 + y_0) and recover z_1 = z_m - z_2 - z_0, reducing the recurrence from 4T(n/2) + O(n) to 3T(n/2) + O(n) = Theta(n^{log_2 3}) ~= Theta(n^{1.585}).",
        "Compute z_m = (x_1 - x_0)(y_1 - y_0) and recover z_1 = z_2 + z_0 + z_m, achieving Theta(n log n).",
        "Divide X and Y into 3 thirds and multiply only the diagonal terms, achieving Theta(n^{4/3}).",
        "Use floating-point logarithms log(x_1*y_0) = log(x_1) + log(y_0), achieving Theta(n)."
      ],
      answer: 0,
      explanation: "Since (x_1 + x_0)(y_1 + y_0) = x_1*y_1 + x_1*y_0 + x_0*y_1 + x_0*y_0 = z_2 + z_1 + z_0, subtracting the already-computed z_2 and z_0 yields z_1 at the cost of 1 multiplication and 4 additions/subtractions. By Master Theorem Case 1, T(n) = 3T(n/2) + O(n) = Theta(n^{log_2 3})."
    },
    {
      id: "m06-u06-q02",
      type: "mcq",
      difficulty: "apply",
      title: "Strassen's Matrix Multiplication Recurrence",
      prompt: "Multiplying two n x n matrices by partitioning into four (n/2) x (n/2) blocks normally requires 8 block multiplications and 4 block additions.",
      question: "How many recursive (n/2) x (n/2) matrix multiplications does Strassen's algorithm perform, and why does adding 18 block additions/subtractions still reduce total asymptotic complexity?",
      options: [
        "7 recursive block multiplications; because matrix addition of size n/2 takes Theta(n^2) time and 7 > 2^2, Master Theorem Case 1 shows the complexity is governed purely by the leaf count Theta(n^{log_2 7}) ~= Theta(n^{2.807}) regardless of the constant 18 in front of Theta(n^2).",
        "6 recursive block multiplications; yielding Theta(n^{log_2 6}) ~= Theta(n^{2.585}).",
        "4 recursive block multiplications; yielding Theta(n^2 log n) via Master Theorem Case 2.",
        "7 recursive block multiplications; because matrix addition takes O(n) time instead of O(n^2)."
      ],
      answer: 0,
      explanation: "In T(n) = 7T(n/2) + 18(n/2)^2, the non-recursive combine work is Theta(n^2), which grows by a factor of 4 per level, whereas the 7 recursive subproblems grow by a factor of 7 per level (ratio 7/4 > 1). By Master Theorem Case 1, the leaves dominate and total work is Theta(n^{log_2 7}) ~= Theta(n^{2.807})."
    },
    {
      id: "m06-u06-q03",
      type: "mcq",
      difficulty: "apply",
      title: "Choosing the Base-Case Cutoff Threshold in Leaf-Dominated D&C",
      prompt: "A naïve Karatsuba implementation recurses all the way down to n == 1 and runs 10x slower than schoolbook O(n^2) multiplication for n = 256.",
      question: "Why does recursing down to n == 1 destroy performance, and how much of the recursion tree is eliminated by switching to schoolbook multiplication at n_0 = 32?",
      options: [
        "In a leaf-dominated recurrence (T(n) = 3T(n/2) + O(n)), the number of recursive calls is 3^{log_2 n} = n^{1.585}; stopping at n_0 = 32 prunes the bottom 5 levels of the tree, eliminating 3^5 = 243x of the function call/allocation overhead and replacing them with a single L1-resident SIMD loop!",
        "Because n == 1 triggers integer division by zero when computing m = n / 2.",
        "Stopping at n_0 = 32 changes the asymptotic complexity from Theta(n^{1.585}) to Theta(n log n).",
        "Because CPUs cannot multiply single 64-bit integers without SIMD registers."
      ],
      answer: 0,
      explanation: "Every level deeper in Karatsuba triples the number of active subproblems! The bottom 5 levels (from n = 32 down to n = 1) account for (242 / 243) = 99.6% of all function calls. Cutting off recursion at n_0 = 32 and running a flat nested loop in a pre-allocated scratch arena eliminates almost all call overhead."
    },
    {
      id: "m06-u06-q04",
      type: "mcq",
      difficulty: "staff",
      title: "Numerical Stability Trade-Offs of Strassen's Algorithm in IEEE-754",
      prompt: "High-performance BLAS libraries (such as OpenBLAS and Intel MKL) rarely enable Strassen's algorithm by default for general-purpose IEEE-754 floating-point `dgemm`, even for n = 4096.",
      question: "What fundamental numerical stability property does standard O(n^3) matrix multiplication satisfy that Strassen's algorithm violates?",
      options: [
        "Standard GEMM satisfies a componentwise forward error bound |Delta C_{ij}| <= gamma_n (|A||B|)_{ij}, whereas Strassen's quadrant additions and subtractions (e.g., M_1 + M_4 - M_5 + M_7) can suffer catastrophic cancellation when entries of A and B vary wildly in magnitude, satisfying only a weaker normwise bound ||Delta C|| <= c_n u ||A|| ||B||.",
        "Strassen's algorithm requires complex numbers, which double memory bandwidth requirements.",
        "Strassen's algorithm divides by A_{11}, which throws a division-by-zero NaN whenever A_{11} is singular.",
        "Strassen's algorithm is only mathematically valid over finite fields GF(2) and not over real numbers."
      ],
      answer: 0,
      explanation: "As proved by Higham (Accuracy and Stability of Numerical Algorithms, §23.2), because Strassen adds unrelated submatrix blocks before multiplying and then subtracts products, a huge entry in one quadrant can swamp a tiny entry in another quadrant, losing relative accuracy on small entries of C."
    }
  ],

  "fast-fourier-transform-polynomials": [
    {
      id: "m06-u07-q01",
      type: "mcq",
      difficulty: "recall",
      title: "Why Complex Roots of Unity Collapse Polynomial Evaluation to O(N log N)",
      prompt: "To evaluate a degree-(N-1) polynomial A(x) = A_even(x^2) + x * A_odd(x^2) at N points in O(N log N) time, we need the set of N evaluation points to shrink to N/2 distinct points when squared, recursively across all log_2 N levels.",
      question: "Why does choosing the N complex roots of unity omega_N^k = e^{2*pi*i*k / N} (for k = 0..N-1) satisfy this recursive halving property whereas choosing N real +/- pairs fails after level 1?",
      options: [
        "For real numbers, squaring +/- x produces strictly positive numbers x^2 > 0, which cannot be paired as +/- values at the next recursion level; for complex roots of unity, the Halving Lemma guarantees (omega_N^k)^2 = (omega_N^{k+N/2})^2 = omega_{N/2}^k, which are the exact N/2-th roots of unity with +/- symmetry at every level!",
        "Because complex multiplication is faster than real multiplication on x86 FPU hardware.",
        "Because real polynomials have no roots when their degree is a power of two.",
        "Because e^{2*pi*i*k / N} is always an integer for every k."
      ],
      answer: 0,
      explanation: "Wait—after squaring real numbers +/- x once, all values x^2 are positive, so at depth 2 you can no longer pair points as +u and -u (since u > 0 implies -u < 0 is not a square of a real number). Complex N-th roots of unity are closed under squaring and retain opposite-pair symmetry omega_m^{k + m/2} = -omega_m^k all the way down to m = 2!"
    },
    {
      id: "m06-u07-q02",
      type: "mcq",
      difficulty: "apply",
      title: "Zero-Padding Requirement to Prevent Circular Convolution Aliasing",
      prompt: "You want to multiply a polynomial A(x) of degree 500 (501 coefficients) by a polynomial B(x) of degree 600 (601 coefficients) using a Radix-2 Cooley-Tukey FFT.",
      question: "What is the minimum power-of-two transform size N you must zero-pad both coefficient arrays to before running the forward FFT, and what happens if you use N = 1024?",
      options: [
        "N = 2048; the product C(x) = A(x)B(x) has degree 500 + 600 = 1100 (1101 coefficients). If you use N = 1024, the FFT computes circular convolution modulo (x^{1024} - 1), wrapping coefficients c_{1024}..c_{1100} onto c_0..c_{76} and corrupting them!",
        "N = 1024; because max(501, 601) <= 1024.",
        "N = 512; because the Butterfly halves the array size before multiplying.",
        "N = 4096; because FFT always requires padding to 4x the sum of degrees."
      ],
      answer: 0,
      explanation: "Evaluating at the N-th roots of unity computes C(x) = A(x)B(x) mod (x^N - 1), since (omega_N^k)^N = 1. To avoid wrap-around aliasing (where x^{1024} aliases x^0), N must be strictly greater than deg(A) + deg(B) = 1100, so the smallest power of two is N = 2048."
    },
    {
      id: "m06-u07-q03",
      type: "mcq",
      difficulty: "apply",
      title: "Role of the Bit-Reversal Permutation in Iterative FFT",
      prompt: "In the iterative in-place Cooley-Tukey FFT, before running the bottom-up butterfly stages (len = 2, 4, 8, ..., N), we swap each element a[i] with a[bit_reverse(i)].",
      question: "Why does reversing the log_2(N) binary bits of each index i place the elements in the exact leaf order produced by the top-down recursive even/odd split?",
      options: [
        "The top-down recursion splits by the least significant bit (LSB = 0 even vs LSB = 1 odd) at level 1, the 2nd LSB at level 2, ..., and the MSB at the bottom level; thus, an element's final leaf position has its original LSB as the new MSB, which is the exact binary bit-reversal of its original index!",
        "Bit-reversal sorts the polynomial coefficients in ascending order of their magnitude.",
        "Bit-reversal conjugates complex numbers so the forward FFT can reuse the IFFT code.",
        "Bit-reversal prevents integer overflow in the butterfly loop variables."
      ],
      answer: 0,
      explanation: "At depth 1, all indices with LSB 0 go to the left half (new MSB = 0) and all indices with LSB 1 go to the right half (new MSB = 1). Continuing this across all log_2 N bits maps original index b_{k-1}...b_1 b_0 to leaf position b_0 b_1...b_{k-1}."
    },
    {
      id: "m06-u07-q04",
      type: "mcq",
      difficulty: "staff",
      title: "Number-Theoretic Transform (NTT) vs. Floating-Point FFT Precision Limits",
      prompt: "You need to compute the exact convolution of two integer arrays of length n = 262,144 where each entry is up to 10^8, modulo p = 998,244,353.",
      question: "Why does standard `std::complex<double>` FFT produce wrong answers here, and why does the prime p = 998,244,353 = 119 * 2^{23} + 1 allow an exact integer Number-Theoretic Transform (NTT)?",
      options: [
        "Each convolution sum can reach n * (10^8)^2 ~= 2.6 * 10^{21}, which exceeds the 53-bit exact integer mantissa limit of IEEE-754 double (2^{53} ~= 9 * 10^{15}); in Z_p with p = 119 * 2^{23} + 1, the multiplicative group has order p - 1 = 119 * 2^{23} divisible by 2^{23}, so omega_N = 3^{(p-1)/N} mod p is an exact integer N-th root of unity for any power of two N <= 2^{23}!",
        "std::complex<double> cannot represent negative numbers, whereas NTT uses two's complement.",
        "998,244,353 is a Mersenne prime 2^{30} - 1 that avoids the division instruction.",
        "NTT runs in O(N) time whereas complex FFT runs in O(N log N) time."
      ],
      answer: 0,
      explanation: "IEEE-754 double has only 53 bits of significand (~9e15), so values around 2.6e21 lose their lower 20+ bits before the modulo reduction can even be applied! Because 998244353 - 1 = 119 * 2^{23} is divisible by 2^{23} and g = 3 is a primitive root mod p, g^{(p-1)/N} mod p satisfies all Halving and Reflection lemmas in exact modular arithmetic for N up to 8,388,608."
    }
  ],

  "meet-in-the-middle-search": [
    {
      id: "m06-u08-q01",
      type: "mcq",
      difficulty: "recall",
      title: "Core Principle of Horowitz-Sahni Meet-in-the-Middle",
      prompt: "You are given N = 40 integers with arbitrary 64-bit weights (up to 10^{16}) and need to determine whether any subset sums to exact target T.",
      question: "How does Meet-in-the-Middle solve this problem within a 1-second time limit?",
      options: [
        "Split the 40 items into two halves of 20 items each, enumerate all 2^{20} = 1,048,576 subset sums of each half into sorted lists L and R, and use a two-pointer sweep (or binary search) to check if any l in L and r in R satisfy l + r == T.",
        "Run a 0/1 Knapsack dynamic programming table of size 40 x 10^{16}.",
        "Divide the 40 items into 40 singletons and run binary search on each singleton in O(40 log 40) time.",
        "Sort the 40 items descending and greedily subtract the largest item <= remaining T."
      ],
      answer: 0,
      explanation: "Decomposing N = 40 into two independent halves of size N/2 = 20 replaces a single impossible search space of size 2^{40} ~= 1.1 * 10^{12} with two manageable lists of size 2^{20} ~= 1.05 * 10^6 whose combination reduces to 2-SUM."
    },
    {
      id: "m06-u08-q02",
      type: "mcq",
      difficulty: "apply",
      title: "Eliminating the O(N) Sorting Factor via Incremental Subset-Sum Merging",
      prompt: "Generating 2^{N/2} subset sums and calling `std::sort` takes O(2^{N/2} * log(2^{N/2})) = O(N * 2^{N/2}) time. For N = 44, that extra factor of 22 causes a timeout.",
      question: "How can we generate all 2^{N/2} subset sums in strictly sorted order in O(2^{N/2}) time without calling `std::sort`?",
      options: [
        "Start with sums = {0}; for each new item x, append `sums[i] + x` for all current elements (which forms a second already-sorted run of size 2^k) and call `std::inplace_merge` in O(2^{k+1}) time—summing over k = 0..N/2-1 gives the geometric series 2 + 4 + 8 + ... + 2^{N/2} = Theta(2^{N/2})!",
        "Use Counting Sort or Radix Sort with 2^{64} buckets.",
        "Sort the original N/2 items first; then standard bitmask order 0..2^{N/2}-1 automatically produces subset sums in sorted order.",
        "Insert each subset sum into a std::set<int64_t> as it is generated."
      ],
      answer: 0,
      explanation: "Note the trap in option C: even if input items are sorted (e.g., {1, 10, 11}), bitmask order does NOT produce sorted subset sums (since 1 + 10 = 11 == 11, or {2, 3, 4} where 2+3 = 5 > 4)! Instead, merging the existing sorted list S with the shifted sorted list S + x at each step takes linear time in the current size, summing to 2 * 2^{N/2} = O(2^{N/2})."
    },
    {
      id: "m06-u08-q03",
      type: "mcq",
      difficulty: "apply",
      title: "Dominance Pruning in Meet-in-the-Middle 0/1 Knapsack",
      prompt: "In 0/1 Knapsack with N = 40 and huge capacity W <= 10^{18}, each subset of the right half generates a pair (weight, value). We sort the right-half pairs R by ascending weight.",
      question: "Why can we not immediately run a two-pointer sweep on R to maximize total value for weight_L + weight_R <= W, and what O(|R|) preprocessing step fixes it?",
      options: [
        "Sorted by weight alone, R's values are not monotonic; we must scan R left-to-right and discard any 'dominated' pair (w_j, v_j) whose value v_j <= max_{k < j} v_k (or maintain prefix maximum values), after which R is strictly increasing in both weight and value!",
        "Because 0/1 Knapsack with two coordinates requires splitting into 3 thirds of N/3 instead of 2 halves.",
        "Because weight_L + weight_R can overflow 32-bit integers.",
        "We must sort R by value/weight ratio instead of weight."
      ],
      answer: 0,
      explanation: "If pair A has weight 10, value 100 and pair B has weight 15, value 80, B is strictly dominated by A (heavier yet worth less). Filtering out dominated pairs (or tracking prefix maximum values across weight-sorted R) makes value a monotonically non-decreasing function of weight, restoring the invariant needed for binary search or a two-pointer sweep."
    },
    {
      id: "m06-u08-q04",
      type: "mcq",
      difficulty: "staff",
      title: "Schroeppel-Shamir 4-Way Split: Halving Memory from O(2^{N/2}) to O(2^{N/4})",
      prompt: "At N = 48, standard Meet-in-the-Middle requires storing 2^{24} = 16,777,216 64-bit integers per half, and at N = 56, 2^{28} integers exceed available RAM. Schroeppel & Shamir (1981) showed how to keep time O(N * 2^{N/2}) while slashing memory to O(2^{N/4}).",
      question: "How does the Schroeppel-Shamir algorithm achieve O(2^{N/4}) space while still searching all 2^N subsets in O(N * 2^{N/2}) time?",
      options: [
        "Split the N items into FOUR quarters Q_1, Q_2, Q_3, Q_4 of size N/4 (storing 4 arrays of size 2^{N/4}); use a min-heap of size 2^{N/4} to lazily stream the 2^{N/2} sums of (Q_1 + Q_2) in ascending order and a max-heap of size 2^{N/4} to lazily stream (Q_3 + Q_4) in descending order during a two-pointer sweep!",
        "Compress every 64-bit subset sum into a 2-bit Bloom filter signature.",
        "Write the 2^{N/2} elements to swap disk and run external merge sort.",
        "Randomly sample 2^{N/4} subsets from each half using Monte Carlo hashing."
      ],
      answer: 0,
      explanation: "Given two sorted lists Q_1, Q_2 of size M = 2^{N/4}, we don't need to materialize their Cartesian product Q_1 + Q_2 of size M^2 = 2^{N/2} in RAM! A priority queue of size M = 2^{N/4} yields the sums of Q_1 + Q_2 in sorted order on the fly, reducing space from Theta(2^{N/2}) to Theta(2^{N/4})."
    }
  ],

  "cdq-divide-and-conquer": [
    {
      id: "m06-u09-q01",
      type: "mcq",
      difficulty: "recall",
      title: "How CDQ Divide-and-Conquer Eliminates Three Dimensions",
      prompt: "In the offline 3D Partial Order problem, we want to count for each point j how many points i != j satisfy x_i <= x_j, y_i <= y_j, and z_i <= z_j in O(N log^2 N) time and O(N) space.",
      question: "How are the three coordinates (X, Y, Z) handled across the CDQ algorithm?",
      options: [
        "X is ordered by initial presorting (so all left-half elements [lo, mid) have x_i <= x_j for all right-half elements [mid, hi)); Y is ordered by the two-pointer merge of [lo, mid) and [mid, hi); and Z is queried/updated in a 1D Fenwick Tree (BIT).",
        "X, Y, and Z are each stored in a separate 1D Fenwick Tree and intersected via bitwise AND.",
        "X is handled by binary search, Y by Karatsuba multiplication, and Z by FFT.",
        "A 3D Segment Tree of size O(N^3) is compressed using Fractional Cascading."
      ],
      answer: 0,
      explanation: "Each mechanism strips away one coordinate constraint: (1) presorting by X guarantees x_i <= x_j for any i in the left half and j in the right half; (2) merging by Y guarantees y_i <= y_j for all left-half elements processed before j; and (3) the 1D Fenwick Tree counts how many of those also have z_i <= z_j."
    },
    {
      id: "m06-u09-q02",
      type: "mcq",
      difficulty: "apply",
      title: "The Fenwick Tree Reset Trap in CDQ Divide-and-Conquer",
      prompt: "Inside the CDQ recursive function `cdq(size_t lo, size_t hi)`, after merging `[lo, mid)` and `[mid, hi)` using the shared 1D Fenwick Tree `bit` of size N, an engineer clears the Fenwick tree via `std::fill(bit.begin(), bit.end(), 0);`.",
      question: "What happens to the time complexity of the algorithm, and what is the correct way to reset the Fenwick Tree?",
      options: [
        "Time complexity degrades from Theta(N log^2 N) to Theta(N^2) because `std::fill` spends O(N) time at every one of the O(N) recursive calls! Instead, rollback by looping `i` from `lo` to `pL` and calling `bit.add(P[i].z, -P[i].weight)` in O((hi - lo) log N) time.",
        "Time complexity improves to O(N log N) because std::fill uses AVX-512 memset.",
        "The Fenwick tree does not need to be reset between recursive calls because Z-coordinates are monotonic.",
        "Allocate a brand-new vector<int>(N + 1, 0) inside every recursive call to avoid std::fill."
      ],
      answer: 0,
      explanation: "Note that allocating a vector of size N inside every recursive call (option D) ALSO takes O(N) per call -> Theta(N^2) total time! In CDQ, the work inside `cdq(lo, hi)` MUST be bounded by a function of the subarray length `(hi - lo)`, never the global size `N`."
    },
    {
      id: "m06-u09-q03",
      type: "mcq",
      difficulty: "apply",
      title: "Why Identical (x, y, z) Points Must Be Deduplicated Before CDQ",
      prompt: "Suppose two input points P_a and P_b have the exact same coordinates (5, 5, 5). After sorting, P_a is at index 3 (in the left half) and P_b is at index 4 (in the right half).",
      question: "If we run standard CDQ without deduplicating identical (x, y, z) triples into a single weighted point, why does P_a get the wrong dominance count?",
      options: [
        "In CDQ, left-half elements only update the BIT and right-half elements only query the BIT; thus P_a (at index 3) contributes to P_b (at index 4), but P_b can NEVER contribute back to P_a, causing P_a to undercount P_b!",
        "Because the Fenwick Tree cannot store two elements at the same Z-coordinate.",
        "Because std::merge crashes when two elements have equal Y-coordinates.",
        "Because P_b will count P_a twice during the rollback phase."
      ],
      answer: 0,
      explanation: "CDQ assumes a directed DAG of contributions from smaller indices i < j to larger indices j. When two points are strictly equal in all 3 coordinates, they mutually dominate each other (i dominates j AND j dominates i). Deduplicating identical triples upfront into one node with `weight = k` (and adding `k - 1` at the end) restores strict asymmetry."
    },
    {
      id: "m06-u09-q04",
      type: "mcq",
      difficulty: "staff",
      title: "In-Order vs. Post-Order Traversal in CDQ for Dynamic Programming",
      prompt: "You are using CDQ Divide-and-Conquer to compute a 1D Dynamic Programming array where `dp[j] = max_{i < j, x_i <= x_j, y_i <= y_j} (dp[i] + w_j)`. You write the recursion in standard Merge-Sort post-order:\n\ncdq(lo, mid);\ncdq(mid, hi);\ncross_update(lo, mid, mid, hi);",
      question: "Why does post-order traversal produce incorrect DP values here, and what traversal order is required?",
      options: [
        "In post-order, `cdq(mid, hi)` executes BEFORE `cross_update(lo, mid, mid, hi)`, meaning elements in `[mid, hi)` try to propagate their `dp` values to later elements in `[mid, hi)` before they have even received optimal transitions from `[lo, mid)`! You must use IN-ORDER traversal: `cdq(lo, mid); cross_update(lo, mid, mid, hi); cdq(mid, hi);`.",
        "Post-order traversal works for DP, provided you initialize dp[i] = +infinity.",
        "You must use PRE-ORDER traversal: `cross_update(lo, mid, mid, hi); cdq(lo, mid); cdq(mid, hi);`.",
        "CDQ cannot be used for Dynamic Programming because max is not invertible in a Fenwick Tree."
      ],
      answer: 0,
      explanation: "For non-cumulative counting (like 3D dominance), a point's contribution weight is static and known upfront, so post-order Merge Sort works. For DP, `dp[mid]` is NOT finalized until `[0, mid)` has transferred into `mid`! Running `cdq(lo, mid)`, then transferring `[lo, mid) -> [mid, hi)`, and ONLY THEN recursing `cdq(mid, hi)` guarantees that `dp[k]` is 100% finalized before `k` is ever used as a left-half source."
    }
  ],

  "case-git-bisect-eytzinger": [
    {
      id: "m06-u10-q01",
      type: "mcq",
      difficulty: "recall",
      title: "Indexing Rules of the 1-Indexed Eytzinger (BFS) Array Layout",
      prompt: "A static sorted set of N keys is rearranged into a 1-indexed Eytzinger array B[1..N] (Breadth-First Search level-order of the implicit binary search tree).",
      question: "Where is the overall median stored, and what are the indices of the left and right children of node k?",
      options: [
        "The root median is stored at B[1]; for any node at index k, its left child (< B[k]) is at B[2k] and its right child (>= B[k]) is at B[2k + 1].",
        "The root median is stored at B[N/2]; its children are at B[k - 1] and B[k + 1].",
        "The root median is stored at B[0]; its children are at B[2k] and B[2k + 2].",
        "The root median is stored at B[N]; its children are at B[k / 2] and B[k / 2 + 1]."
      ],
      answer: 0,
      explanation: "Just like a 1-indexed binary heap, Eytzinger layout places the root at index 1, the two quartiles at indices 2 and 3, the four octiles at indices 4..7, and in general maps node k's left and right children to 2k and 2k + 1."
    },
    {
      id: "m06-u10-q02",
      type: "mcq",
      difficulty: "apply",
      title: "Why Eytzinger Layout Enables 4-Levels-Ahead Software Prefetching",
      prompt: "In an Eytzinger array of 32-bit integers (`uint32_t`, 4 bytes each), a search loop at index `k` executes `__builtin_prefetch(&B[16 * k])` before advancing `k = 2 * k + (B[k] < x)`.",
      question: "Why does prefetching the single address `&B[16 * k]` guarantee that the element needed 4 iterations in the future is prefetched, even though we don't know which way the next 4 branches will go?",
      options: [
        "Because all 2^4 = 16 possible great-great-grandchildren of node k occupy the contiguous index range [16k .. 16k + 15], which spans 16 * 4 = 64 bytes—fitting into a single 64-byte CPU cache line!",
        "Because `__builtin_prefetch` automatically follows pointer chains 4 levels deep in hardware.",
        "Because Eytzinger layout duplicates every element 16 times across adjacent cache lines.",
        "Because the branch predictor speculatively executes all 16 paths in parallel."
      ],
      answer: 0,
      explanation: "In a sorted array, the 16 possible probe locations 4 steps ahead are scattered across 16 distant memory regions. In Eytzinger layout, descending 4 levels multiplies k by 2^4 = 16 and adds a 4-bit offset in [0..15], so all 16 candidates sit contiguously in `B[16*k .. 16*k + 15]` (one 64-byte cache line)!"
    },
    {
      id: "m06-u10-q03",
      type: "mcq",
      difficulty: "apply",
      title: "Decoding the Final Eytzinger Index via Trailing One-Bit Count",
      prompt: "After the branchless Eytzinger loop `while (k <= N) k = 2 * k + (B[k] < x);` terminates at an out-of-bounds leaf index `k > N`, we recover the `lower_bound` node using `k >> (std::countr_one(k) + 1)`.",
      question: "Why does stripping the trailing 1-bits of `k` and shifting right by one additional bit recover the exact `lower_bound` ancestor?",
      options: [
        "In the loop, branching right (`B[k] < x`, element too small) appends a 1-bit (`2k + 1`), whereas branching left (`B[k] >= x`, valid lower_bound candidate) appends a 0-bit (`2k`); thus, the trailing 1-bits of `k` represent all consecutive right turns after the last valid left turn, and shifting past those 1-bits plus the 0-bit of that left turn restores the exact node where we last saw `B[node] >= x`!",
        "Because Eytzinger indices are stored in Gray code order.",
        "Because `std::countr_one(k)` computes the base-2 logarithm of N.",
        "Because all valid lower_bound indices in Eytzinger layout are odd numbers."
      ],
      answer: 0,
      explanation: "Every step down the tree shifts `k` left by 1 bit and sets the LSB to `0` (left turn, `B[node] >= x`) or `1` (right turn, `B[node] < x`). The tightest `lower_bound` is the deepest ancestor where we turned left (`0`-bit). Counting trailing `1`s via `std::countr_one(k)` (or `__builtin_ffs(~k)`) and right-shifting by `c + 1` strips all subsequent right turns and the left-turn bit itself, landing directly on that ancestor!"
    },
    {
      id: "m06-u10-q04",
      type: "mcq",
      difficulty: "staff",
      title: "Associative Cache-Set Aliasing on Power-of-Two Sorted Arrays",
      prompt: "Khuong & Morin (2017) observed a dramatic performance cliff when running standard `std::lower_bound` on sorted arrays whose size N is a power of two (e.g., N = 2^{20} ints = 4 MB) compared to N = 2^{20} - 123, whereas Eytzinger layout shows no such cliff.",
      question: "What hardware cache mechanism causes `std::lower_bound` to suffer severe slowdowns specifically when N is a power of two?",
      options: [
        "Set-associative CPU caches select the cache set using middle address bits (e.g., bits 6..11 for a 64-set 8-way L1 cache); when N = 2^{20}, binary search probes at N/2, N/4, 3N/4, N/8... all have identical zeros in bits 6..11, mapping every hot top-of-tree probe to the EXACT SAME cache set and causing conflict-miss thrashing!",
        "When N is a power of two, integer division `(hi - lo) / 2` takes 40 cycles instead of 1 cycle.",
        "Virtual memory page tables cannot map arrays whose byte size is an exact multiple of 4 MB.",
        "The x86 hardware prefetcher disables itself whenever an array starts on a 4 KB page boundary."
      ],
      answer: 0,
      explanation: "In an 8-way set-associative cache with 4 KB per way, addresses that differ by multiples of 4096 bytes collide in the exact same cache set. For N = 2^{20} ints (4 MB), the top 10 levels of standard binary search all probe addresses that are multiples of 4096 bytes, thrashing a single cache set while leaving the other 63 cache sets cold! Eytzinger packs the top 10 levels contiguously into the first 1024 ints (4 KB), spreading evenly across all cache sets."
    }
  ]
});
