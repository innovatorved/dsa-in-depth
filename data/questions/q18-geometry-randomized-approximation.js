window.QUESTION_BANK = window.QUESTION_BANK || {};
Object.assign(window.QUESTION_BANK, {
  "geometry-primitives-orientation-ccw": [
    {
      "id": "m18-q01",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "Given three points $A, B, C$ in the 2D plane, what does the sign of the 2D cross product $\\text{cross}(A, B, C) = (x_B - x_A)(y_C - y_A) - (y_B - y_A)(x_C - x_A)$ signify?",
      "question": "Given three points $A, B, C$ in the 2D plane, what does the sign of the 2D cross product $\\text{cross}(A, B, C) = (x_B - x_A)(y_C - y_A) - (y_B - y_A)(x_C - x_A)$ signify?",
      "options": [
        "$> 0$ indicates a strict Counter-Clockwise (left) turn $A \\to B \\to C$, $< 0$ indicates a strict Clockwise (right) turn, and $= 0$ indicates $A, B, C$ are collinear",
        "$> 0$ indicates the angle $\\angle ABC$ is acute, $< 0$ indicates obtuse, and $= 0$ indicates a $90^\\circ$ right angle",
        "$> 0$ indicates $C$ lies closer to $B$ than to $A$",
        "It equals the exact perimeter of $\\triangle ABC$"
      ],
      "answer": 0,
      "explanation": "The 2D cross product $(B - A) \\times (C - A)$ equals $|B - A| |C - A| \\sin \\theta$, which is twice the signed area of $\\triangle ABC$: positive when $C$ lies to the left of directed line $AB$ (CCW), negative when to the right (CW), and zero when collinear."
    },
    {
      "id": "m18-q02",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "Consider the triangle with integer vertices $A(0, 0)$, $B(6, 2)$, and $C(2, 5)$. What is the exact value of $\\text{cross}(A, B, C)$ (which equals twice the signed area of $\\triangle ABC$)?",
      "question": "Consider the triangle with integer vertices $A(0, 0)$, $B(6, 2)$, and $C(2, 5)$. What is the exact value of $\\text{cross}(A, B, C)$ (which equals twice the signed area of $\\triangle ABC$)?",
      "answer": 26,
      "tolerance": 0,
      "explanation": "$\\text{cross}(A, B, C) = (6 - 0)(5 - 0) - (2 - 0)(2 - 0) = 30 - 4 = 26$. Thus the exact area of $\\triangle ABC$ is $26 / 2 = 13$."
    },
    {
      "id": "m18-q03",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "Once you have verified that point $P$ is collinear with segment $\\overline{AB}$ (`cross(A, B, P) == 0`), what single division-free dot-product check determines whether $P$ lies on the closed segment $\\overline{AB}$?",
      "question": "Once you have verified that point $P$ is collinear with segment $\\overline{AB}$ (`cross(A, B, P) == 0`), what single division-free dot-product check determines whether $P$ lies on the closed segment $\\overline{AB}$?",
      "options": [
        "`dot(A - P, B - P) <= 0`",
        "`dot(B - A, P - A) == 0`",
        "`dot(A - P, B - P) > 0`",
        "`cross(A - P, B - P) < 0`"
      ],
      "answer": 0,
      "explanation": "When $P$ is collinear with $A$ and $B$, the vectors $\\vec{PA} = A - P$ and $\\vec{PB} = B - P$ point in opposite directions (angle $180^\\circ$, negative dot product) if $P$ is strictly between $A$ and $B$, or one vector is zero ($\\text{dot} = 0$) if $P = A$ or $P = B$."
    },
    {
      "id": "m18-q04",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "You need to sort $N$ 2D integer vectors around the origin $(0, 0)$ by polar angle in $[0, 2\\pi)$ with exact integer arithmetic ($|x|, |y| \\le 10^9$). Why does `return cross(a, b) > 0;` alone fail as a `std::sort` comparator across the full $360^\\circ$ circle, and how is it fixed?",
      "question": "You need to sort $N$ 2D integer vectors around the origin $(0, 0)$ by polar angle in $[0, 2\\pi)$ with exact integer arithmetic ($|x|, |y| \\le 10^9$). Why does `return cross(a, b) > 0;` alone fail as a `std::sort` comparator across the full $360^\\circ$ circle, and how is it fixed?",
      "options": [
        "Vectors more than $180^\\circ$ apart violate strict weak ordering transitivity (`cross(a, b) > 0`, `cross(b, c) > 0`, and `cross(c, a) > 0` can all hold simultaneously); fix by partitioning vectors into upper half-plane vs lower half-plane first, then comparing `cross(a, b) > 0` within the same half-plane",
        "Because `cross(a, b)` overflows 64-bit integers when $|x|, |y| \\le 10^9$",
        "Because `cross(a, b)` is symmetric (`cross(a, b) == cross(b, a)`)",
        "Because `std::sort` requires floating-point return types"
      ],
      "answer": 0,
      "explanation": "Three vectors spaced $120^\\circ$ apart form a rock-paper-scissors cycle under `cross(a, b) > 0`, violating transitivity and causing undefined behavior (crashes) in `std::sort`! Partitioning by half-plane (`half(p)`) restricts `cross(a, b) > 0` to pairs within $< 180^\\circ$ of each other, where it is a strict total order."
    }
  ],
  "convex-hull-graham-andrew": [
    {
      "id": "m18-q05",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "How does Andrew's Monotone Chain algorithm avoid the polar-angle sorting step required by Graham Scan?",
      "question": "How does Andrew's Monotone Chain algorithm avoid the polar-angle sorting step required by Graham Scan?",
      "options": [
        "It sorts points lexicographically by $(x, y)$ coordinate and sweeps left-to-right to construct the lower hull and right-to-left to construct the upper hull",
        "It uses a hash table of slopes instead of sorting",
        "It builds the hull using a randomized k-d tree in $O(N)$ time",
        "It wraps the hull one vertex at a time in $O(N H)$ without sorting"
      ],
      "answer": 0,
      "explanation": "Sorting by $(x, y)$ uses fast integer comparisons and guarantees the first and last points ($P_0$ and $P_{N-1}$) are global $x$-extrema on both the lower and upper hulls."
    },
    {
      "id": "m18-q06",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "You run Andrew's Monotone Chain (discarding collinear boundary points via `cross <= 0`) on the 6 points: $(0, 0), (2, 0), (4, 0), (4, 4), (2, 2), (0, 4)$. How many vertices are on the resulting strictly convex hull?",
      "question": "You run Andrew's Monotone Chain (discarding collinear boundary points via `cross <= 0`) on the 6 points: $(0, 0), (2, 0), (4, 0), (4, 4), (2, 2), (0, 4)$. How many vertices are on the resulting strictly convex hull?",
      "answer": 4,
      "tolerance": 0,
      "explanation": "The outer bounding square has corners $(0, 0), (4, 0), (4, 4), (0, 4)$. Point $(2, 0)$ is collinear on the bottom edge and $(2, 2)$ lies strictly in the interior; both are popped, leaving the 4 corners."
    },
    {
      "id": "m18-q07",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "In Rotating Calipers on a CCW convex hull $H_0, \\dots, H_{M-1}$ to find the polygon diameter (farthest pair of points), what monotonic condition is used to advance the antipodal pointer $j$ as base edge $\\overline{H_i H_{i+1}}$ steps forward?",
      "question": "In Rotating Calipers on a CCW convex hull $H_0, \\dots, H_{M-1}$ to find the polygon diameter (farthest pair of points), what monotonic condition is used to advance the antipodal pointer $j$ as base edge $\\overline{H_i H_{i+1}}$ steps forward?",
      "options": [
        "Advance $j$ while `cross(H[i], H[i+1], H[j+1]) > cross(H[i], H[i+1], H[j])` (maximizing perpendicular distance / triangle area to base edge $\\overline{H_i H_{i+1}}$)",
        "Advance $j$ while `dist_sq(H[i], H[j+1]) > dist_sq(H[i], H[j])`",
        "Advance $j$ by binary searching the x-coordinate of $H_j$",
        "Advance $j$ by exactly 1 step for every step of $i$"
      ],
      "answer": 0,
      "explanation": "Point-to-point Euclidean distance `dist_sq(H[i], H[j])` can have multiple local maxima around an elongated convex polygon, whereas perpendicular height to a directed hull edge (measured by `cross(H[i], H[i+1], H[j])`) is strictly unimodal!"
    },
    {
      "id": "m18-q08",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "In Andrew's Monotone Chain, suppose you want to retain **all** points that lie on the boundary of the convex hull (including collinear intermediate points on hull edges) by changing the pop condition from `cross(...) <= 0` to `cross(...) < 0`. What edge case arises when all $N$ input points are collinear on a single line, and how do you handle it?",
      "question": "In Andrew's Monotone Chain, suppose you want to retain **all** points that lie on the boundary of the convex hull (including collinear intermediate points on hull edges) by changing the pop condition from `cross(...) <= 0` to `cross(...) < 0`. What edge case arises when all $N$ input points are collinear on a single line, and how do you handle it?",
      "options": [
        "Without adjustment, both the lower hull sweep and upper hull sweep push all $N$ collinear points, duplicating the interior points twice; detect when `cross` is $0$ across all points (or reverse the collinear suffix / return the sorted deduplicated segment directly)",
        "The `while` loop enters an infinite loop when `cross(...) < 0`",
        "The algorithm crashes with division by zero",
        "The complexity degrades from $O(N \\log N)$ to $O(N^2)$"
      ],
      "answer": 0,
      "explanation": "When all points lie on a single line segment and only strict right turns (`< 0`) are popped, the left-to-right pass keeps all $N$ points and the right-to-left pass also keeps all $N$ points, producing a degenerate $2N - 2$ polygon that retraces the line. Checking if all points are collinear (or only keeping endpoints on the return pass) avoids duplicate interior vertices."
    }
  ],
  "sweep-line-bentley-ottmann": [
    {
      "id": "m18-q09",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "Why does the Coverage Segment Tree used in the Sweep-Line algorithm for the Area of Union of $N$ Rectangles (Klee's Measure Problem) **not** require lazy propagation (`push_down`)?",
      "question": "Why does the Coverage Segment Tree used in the Sweep-Line algorithm for the Area of Union of $N$ Rectangles (Klee's Measure Problem) **not** require lazy propagation (`push_down`)?",
      "options": [
        "Because every rectangle's right edge $-1$ removes the exact same $[y_1, y_2]$ interval inserted by its left edge $+1$, and we only ever query the global root `len[1]`",
        "Because rectangles cannot overlap vertically",
        "Because the Segment Tree only updates single leaf nodes",
        "Because coordinate compression reduces the tree height to $1$"
      ],
      "answer": 0,
      "explanation": "When `cnt[u] > 0`, the entire canonical interval of node `u` is covered regardless of its descendants; when `cnt[u]` returns to `0`, `len[u]` is restored from `len[2u] + len[2u+1]`. Because insertions and deletions are paired and only `len[1]` is queried, tags never need to be pushed down."
    },
    {
      "id": "m18-q10",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "Compute the exact Area of the Union of the two axis-aligned rectangles $R_1 = [0, 4] \\times [0, 4]$ and $R_2 = [2, 6] \\times [2, 6]$.",
      "question": "Compute the exact Area of the Union of the two axis-aligned rectangles $R_1 = [0, 4] \\times [0, 4]$ and $R_2 = [2, 6] \\times [2, 6]$.",
      "answer": 28,
      "tolerance": 0,
      "explanation": "Using Sweep-Line (or Inclusion-Exclusion): $\\text{Area}(R_1) = 4 \\times 4 = 16$, $\\text{Area}(R_2) = 4 \\times 4 = 16$, and their intersection is $[2, 4] \\times [2, 4]$ with area $2 \\times 2 = 4$. Union area $= 16 + 16 - 4 = 28$."
    },
    {
      "id": "m18-q11",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "After coordinate-compressing $M$ unique sorted $y$-coordinates $Y[0], Y[1], \\dots, Y[M-1]$ for Klee's Measure Problem, what does leaf index $k \\in [0, M-2]$ of the Segment Tree represent?",
      "question": "After coordinate-compressing $M$ unique sorted $y$-coordinates $Y[0], Y[1], \\dots, Y[M-1]$ for Klee's Measure Problem, what does leaf index $k \\in [0, M-2]$ of the Segment Tree represent?",
      "options": [
        "The continuous elementary interval $[Y[k], Y[k+1]]$ of length $Y[k+1] - Y[k]$",
        "The discrete point $Y[k]$ of length $1$",
        "The interval $[0, Y[k]]$",
        "The midpoint $(Y[k] + Y[k+1]) / 2$"
      ],
      "answer": 0,
      "explanation": "Mapping leaf $k$ to the elementary span $[Y[k], Y[k+1]]$ ensures contiguous intervals share endpoints without gaps or double-counted boundary points; thus a vertical span $[Y[l], Y[r]]$ updates leaves $[l, r - 1]$."
    },
    {
      "id": "m18-q12",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "In the Sweep-Line algorithm for the 2D Closest Pair of Points (maintaining active points within $x$-distance $< d$ in a `std::set` ordered by $y$), why does the inner loop scanning points in $[y_i - d, y_i + d]$ inspect at most **6 points** per step?",
      "question": "In the Sweep-Line algorithm for the 2D Closest Pair of Points (maintaining active points within $x$-distance $< d$ in a `std::set` ordered by $y$), why does the inner loop scanning points in $[y_i - d, y_i + d]$ inspect at most **6 points** per step?",
      "options": [
        "Because all points currently in the `std::set` have pairwise distance $\\ge d$; partitioning the $[x_i - d, x_i] \\times [y_i - d, y_i + d]$ box of size $d \\times 2d$ into six $\\frac{d}{2} \\times \\frac{2d}{3}$ cells shows at most one point can fit in each cell",
        "Because `std::set` automatically deletes nodes with degree greater than 6",
        "Because any planar graph has a vertex of degree at most 5",
        "Because $d$ is always an integer power of 2"
      ],
      "answer": 0,
      "explanation": "Every pair of points in the active window already has distance $\\ge d$. By the Pigeonhole Principle, a $d \\times 2d$ rectangle to the left of $P_i$ can pack at most 6 points at mutual distance $\\ge d$, so the `std::set` range query takes $O(1)$ iterations after an $O(\\log N)$ `lower_bound`."
    }
  ],
  "spatial-indexing-kd-quad-rtrees": [
    {
      "id": "m18-q13",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "In a balanced 2D k-d Tree over $N$ points, why does an orthogonal axis-aligned rectangular range query run in $O(\\sqrt{N} + K)$ worst-case time (where $K$ is the number of reported points)?",
      "question": "In a balanced 2D k-d Tree over $N$ points, why does an orthogonal axis-aligned rectangular range query run in $O(\\sqrt{N} + K)$ worst-case time (where $K$ is the number of reported points)?",
      "options": [
        "Any vertical or horizontal boundary line of the query box intersects at most 2 of the 4 grandchildren two levels down, giving the recurrence $T(N) = 2 T(N / 4) + O(1) = O(\\sqrt{N})$",
        "Because the tree has height $\\sqrt{N}$",
        "Because `std::nth_element` runs in $O(\\sqrt{N})$ time",
        "Because at most $\\sqrt{N}$ points can exist inside any 2D rectangle"
      ],
      "answer": 0,
      "explanation": "Two levels of a 2D k-d tree split a region into 4 quadrants (one vertical split and two horizontal splits). Any single axis-aligned line can stab at most 2 of those 4 quadrants, yielding $T(N) = 2 T(N/4) + O(1) \\implies T(N) = O(2^{\\log_4 N}) = O(\\sqrt{N})$."
    },
    {
      "id": "m18-q14",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "Compute the 2D Morton (Z-Order) code for the coordinate $(x, y) = (3, 5)$, where the bits of $x$ are placed at even bit positions ($0, 2, 4, \\dots$) and the bits of $y$ are placed at odd bit positions ($1, 3, 5, \\dots$).",
      "question": "Compute the 2D Morton (Z-Order) code for the coordinate $(x, y) = (3, 5)$, where the bits of $x$ are placed at even bit positions ($0, 2, 4, \\dots$) and the bits of $y$ are placed at odd bit positions ($1, 3, 5, \\dots$).",
      "answer": 39,
      "tolerance": 0,
      "explanation": "In binary, $x = 3 = 011_2$ ($x_2=0, x_1=1, x_0=1$) and $y = 5 = 101_2$ ($y_2=1, y_1=0, y_0=1$). Interleaving $(y_2 x_2 y_1 x_1 y_0 x_0)_2 = (1\\,0\\,0\\,1\\,1\\,1)_2 = 32 + 0 + 0 + 4 + 2 + 1 = 39$."
    },
    {
      "id": "m18-q15",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "How does an **R-Tree** (used in PostgreSQL/PostGIS and SQLite) fundamentally differ from a **k-d Tree** or **Quadtree**?",
      "question": "How does an **R-Tree** (used in PostgreSQL/PostGIS and SQLite) fundamentally differ from a **k-d Tree** or **Quadtree**?",
      "options": [
        "An R-Tree is a balanced B-Tree-style hierarchy of potentially overlapping Minimum Bounding Rectangles (MBRs) that partitions the data objects rather than partitioning space with disjoint splitting lines",
        "An R-Tree can only index 1D intervals, whereas a k-d Tree indexes $k$ dimensions",
        "An R-Tree is a binary tree of height $O(N)$",
        "An R-Tree requires coordinates to be prime numbers"
      ],
      "answer": 0,
      "explanation": "k-d Trees and Quadtrees partition *space* into disjoint cells (which may split extended polygons across multiple subtrees). R-Trees group nearby *data objects* into disk-page-sized nodes summarized by their Minimum Bounding Rectangle (MBR), guaranteeing every leaf sits at the same depth like a B-Tree."
    },
    {
      "id": "m18-q16",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "Why do exact k-d Trees suffer from the **Curse of Dimensionality** and degrade to $O(N)$ linear scans when indexing high-dimensional vector embeddings ($k \\ge 64$)?",
      "question": "Why do exact k-d Trees suffer from the **Curse of Dimensionality** and degrade to $O(N)$ linear scans when indexing high-dimensional vector embeddings ($k \\ge 64$)?",
      "options": [
        "In $k$ dimensions, a query hypersphere touching the nearest neighbor almost always intersects the splitting hyperplanes along dozens of axes ($2^k$ orthants), preventing branch-and-bound from pruning almost any subtrees",
        "Because `std::nth_element` takes $O(2^k)$ time per split",
        "Because IEEE-754 floats cannot represent more than 3 dimensions",
        "Because tree depth exceeds $N$ when $k > 64$"
      ],
      "answer": 0,
      "explanation": "In high dimensions, the volume of a hypersphere concentrates near its boundary and the distance to the nearest neighbor is larger than the distance to nearly all nearby axis-aligned splitting hyperplanes, forcing exact branch-and-bound to visit almost 100% of nodes."
    }
  ],
  "modular-arithmetic-gcd-crt": [
    {
      "id": "m18-q17",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "In Euler's $O(N)$ Linear Sieve, what single line of code ensures that every composite integer $x \\le N$ is crossed out **exactly once** (by its smallest prime factor $\\text{spf}[x]$)?",
      "question": "In Euler's $O(N)$ Linear Sieve, what single line of code ensures that every composite integer $x \\le N$ is crossed out **exactly once** (by its smallest prime factor $\\text{spf}[x]$)?",
      "options": [
        "`if (i % p == 0) break;` inside the inner loop over primes $p$",
        "`for (int j = p * p; j <= n; j += p)`",
        "`if (p * p > i) break;`",
        "`spf[i] = i - 1;`"
      ],
      "answer": 0,
      "explanation": "When `i % p == 0`, prime $p$ is the smallest prime factor of $i$. Any subsequent prime $q > p$ would form a composite $i \\cdot q$ whose smallest prime factor is $p < q$, not $q$! Breaking immediately when `i % p == 0` guarantees each composite $x$ is generated only when $p = \\text{spf}[x]$."
    },
    {
      "id": "m18-q18",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "Find the smallest non-negative integer $X$ satisfying the system of congruences: $X \\equiv 2 \\pmod 3$, $X \\equiv 3 \\pmod 5$, and $X \\equiv 2 \\pmod 7$.",
      "question": "Find the smallest non-negative integer $X$ satisfying the system of congruences: $X \\equiv 2 \\pmod 3$, $X \\equiv 3 \\pmod 5$, and $X \\equiv 2 \\pmod 7$.",
      "answer": 23,
      "tolerance": 0,
      "explanation": "By the Chinese Remainder Theorem (moduli $3, 5, 7$ with product $105$): $23 \\bmod 3 = 2$, $23 \\bmod 5 = 3$, and $23 \\bmod 7 = 2$."
    },
    {
      "id": "m18-q19",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "Given two congruences $X \\equiv r_1 \\pmod{m_1}$ and $X \\equiv r_2 \\pmod{m_2}$ where $m_1$ and $m_2$ are **not necessarily coprime**, what is the exact necessary and sufficient condition for a solution $X$ to exist?",
      "question": "Given two congruences $X \\equiv r_1 \\pmod{m_1}$ and $X \\equiv r_2 \\pmod{m_2}$ where $m_1$ and $m_2$ are **not necessarily coprime**, what is the exact necessary and sufficient condition for a solution $X$ to exist?",
      "options": [
        "$(r_2 - r_1)$ must be divisible by $g = \\gcd(m_1, m_2)$ (i.e., $r_1 \\equiv r_2 \\pmod{\\gcd(m_1, m_2)}$)",
        "$\\gcd(r_1, r_2) == 1$",
        "$m_1 + m_2$ must be prime",
        "$r_1 \\cdot m_2 == r_2 \\cdot m_1$"
      ],
      "answer": 0,
      "explanation": "$X = r_1 + k_1 m_1 = r_2 + k_2 m_2 \\iff k_1 m_1 - k_2 m_2 = r_2 - r_1$. By Bézout's Identity, this linear Diophantine equation has integer solutions $(k_1, k_2)$ if and only if $\\gcd(m_1, m_2)$ divides $(r_2 - r_1)$."
    },
    {
      "id": "m18-q20",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "Why does the recurrence `inv[i] = (M - M / i) * inv[M % i] % M` compute all modular inverses $1..N$ modulo a prime $M > N$ in $O(N)$ total time?",
      "question": "Why does the recurrence `inv[i] = (M - M / i) * inv[M % i] % M` compute all modular inverses $1..N$ modulo a prime $M > N$ in $O(N)$ total time?",
      "options": [
        "Because Euclidean division $M = \\lfloor M/i \\rfloor \\cdot i + (M \\bmod i)$ implies $\\lfloor M/i \\rfloor \\cdot i \\equiv -(M \\bmod i) \\pmod M$; multiplying by $i^{-1} (M \\bmod i)^{-1}$ expresses `inv[i]` in terms of the already-computed `inv[M % i]` since $M \\bmod i < i$",
        "Because $M \\bmod i$ is always equal to $i - 1$",
        "Because Fermat's Little Theorem reduces to subtraction when $i < M$",
        "Because `M / i` is the modular inverse of `M % i`"
      ],
      "answer": 0,
      "explanation": "Since $0 < M \\bmod i < i$ for every $i \\in [2, N]$ when $M$ is prime, `inv[M % i]` is strictly at an earlier index in the table! Thus a single forward pass computes all $N$ inverses in $O(N)$ time."
    }
  ],
  "primality-miller-rabin-pollard-rho": [
    {
      "id": "m18-q21",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "How does the Miller-Rabin primality test overcome Carmichael numbers (composite numbers like $561 = 3 \\times 11 \\times 17$ that fool the Fermat test $a^{N-1} \\equiv 1 \\pmod N$ for all coprime bases $a$)?",
      "question": "How does the Miller-Rabin primality test overcome Carmichael numbers (composite numbers like $561 = 3 \\times 11 \\times 17$ that fool the Fermat test $a^{N-1} \\equiv 1 \\pmod N$ for all coprime bases $a$)?",
      "options": [
        "By factoring $N - 1 = 2^s d$ and checking the squaring chain $a^d, a^{2d}, \\dots, a^{2^s d} \\pmod N$: if $N$ is prime, the only square roots of $1 \\pmod N$ are $\\pm 1$, so any transition from $x \\not\\equiv \\pm 1$ to $x^2 \\equiv 1 \\pmod N$ exposes $N$ as composite",
        "By testing all prime factors up to $\\sqrt{N}$ before running Fermat's test",
        "By computing $(N - 1)! \\bmod N$ using Wilson's Theorem",
        "By running Pollard's Rho for $O(N)$ iterations"
      ],
      "answer": 0,
      "explanation": "In a field $\\mathbb{Z}/p\\mathbb{Z}$, the polynomial $x^2 - 1 \\equiv (x-1)(x+1) \\equiv 0 \\pmod p$ has only two roots: $1$ and $-1$. In a composite ring $\\mathbb{Z}/N\\mathbb{Z}$ (including Carmichael numbers), non-trivial square roots of $1$ exist and are caught with probability $\\ge 3/4$ per random base."
    },
    {
      "id": "m18-q22",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "In the Miller-Rabin test for $N = 561$ (the smallest Carmichael number), we write $N - 1 = 560 = 2^s \\cdot d$ where $d$ is odd. What is the value of the odd exponent $d$?",
      "question": "In the Miller-Rabin test for $N = 561$ (the smallest Carmichael number), we write $N - 1 = 560 = 2^s \\cdot d$ where $d$ is odd. What is the value of the odd exponent $d$?",
      "answer": 35,
      "tolerance": 0,
      "explanation": "$560 = 16 \\times 35 = 2^4 \\times 35$, so $s = 4$ and $d = 35$."
    },
    {
      "id": "m18-q23",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "Why does Pollard's $\\rho$ (Rho) algorithm find a prime factor $p$ of composite $N$ in $O(\\sqrt{p}) \\le O(N^{1/4})$ expected steps instead of $O(p) \\le O(\\sqrt{N})$ steps?",
      "question": "Why does Pollard's $\\rho$ (Rho) algorithm find a prime factor $p$ of composite $N$ in $O(\\sqrt{p}) \\le O(N^{1/4})$ expected steps instead of $O(p) \\le O(\\sqrt{N})$ steps?",
      "options": [
        "By the Birthday Paradox, a pseudo-random sequence $x_{i+1} = (x_i^2 + c) \\bmod N$ projected modulo $p$ experiences its first collision $x_i \\equiv x_j \\pmod p$ after $O(\\sqrt{p})$ steps, which is detected via $\\gcd(|x_i - x_j|, N) > 1$",
        "Because it binary searches the interval $[2, \\sqrt{N}]$",
        "Because every composite number has a prime factor $\\le N^{1/4}$",
        "Because `std::gcd` runs in $O(N^{-1/4})$ time"
      ],
      "answer": 0,
      "explanation": "Even though we do not know $p$, computing $\\gcd(|x_i - x_j|, N)$ checks whether $x_i \\equiv x_j \\pmod p$ for *any* prime divisor $p \\mid N$. By the Birthday Problem on a set of size $p$, a repeat modulo $p$ occurs after $\\approx \\sqrt{\\pi p / 2} = O(\\sqrt{p}) \\le O(N^{1/4})$ steps."
    },
    {
      "id": "m18-q24",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "In Brent's optimization of Pollard's $\\rho$, we batch 128 consecutive differences into a single product $q = \\prod_{k=1}^{128} |x - y_k| \\bmod N$ and call `g = std::gcd(q, N)` once every 128 steps. What must the algorithm do if `g` jumps straight from `1` to `N` (`g == N`)?",
      "question": "In Brent's optimization of Pollard's $\\rho$, we batch 128 consecutive differences into a single product $q = \\prod_{k=1}^{128} |x - y_k| \\bmod N$ and call `g = std::gcd(q, N)` once every 128 steps. What must the algorithm do if `g` jumps straight from `1` to `N` (`g == N`)?",
      "options": [
        "Rewind `y` to the checkpoint `xs` saved at the start of that 128-step batch and step forward one iteration at a time calling `std::gcd(|x - xs|, N)` until $g > 1$; if $g$ is still $N$, restart with a new constant $c + 1$",
        "Conclude that $N$ is prime and return $N$",
        "Return $N / 2$ as the prime factor",
        "Divide $q$ by $N$ and continue the batch"
      ],
      "answer": 0,
      "explanation": "When the batch product $q \\bmod N$ becomes $0$, `gcd(0, N) == N`, meaning one of the 128 steps inside the batch hit a multiple of $p$ (or all prime factors simultaneously). Backtracking from the saved checkpoint `xs` at the start of the 128-step block isolates the exact step where $\\gcd > 1$."
    }
  ],
  "las-vegas-monte-carlo-karger": [
    {
      "id": "m18-q25",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "What is the defining distinction between a **Las Vegas** randomized algorithm and a **Monte Carlo** randomized algorithm?",
      "question": "What is the defining distinction between a **Las Vegas** randomized algorithm and a **Monte Carlo** randomized algorithm?",
      "options": [
        "A Las Vegas algorithm always produces a 100% correct answer with a randomized running time, whereas a Monte Carlo algorithm has a bounded probability of returning an incorrect answer",
        "A Las Vegas algorithm runs in exponential time, whereas a Monte Carlo algorithm runs in constant time",
        "A Las Vegas algorithm only works on graphs, whereas a Monte Carlo algorithm only works on matrices",
        "A Monte Carlo algorithm never uses random numbers"
      ],
      "answer": 0,
      "explanation": "Randomized Quicksort is Las Vegas (always sorts correctly; runtime is random). Karger's Min-Cut and Freivalds' algorithm are Monte Carlo (runtime is bounded deterministically; output is correct with high probability)."
    },
    {
      "id": "m18-q26",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "According to Karger's Contraction Theorem (which proves any specific minimum cut survives a single contraction run on $N$ vertices with probability $\\ge \\frac{2}{N(N-1)}$), what is the **maximum possible number of distinct global minimum cuts** that an undirected connected graph on $N = 6$ vertices can have?",
      "question": "According to Karger's Contraction Theorem (which proves any specific minimum cut survives a single contraction run on $N$ vertices with probability $\\ge \\frac{2}{N(N-1)}$), what is the **maximum possible number of distinct global minimum cuts** that an undirected connected graph on $N = 6$ vertices can have?",
      "answer": 15,
      "tolerance": 0,
      "explanation": "Since the events that distinct minimum cuts $C_1, \\dots, C_m$ survive down to the final 2 super-vertices are mutually exclusive and each occurs with probability $\\ge \\frac{2}{N(N-1)}$, the sum of their probabilities is $m \\cdot \\frac{2}{N(N-1)} \\le 1 \\implies m \\le \\frac{N(N-1)}{2} = \\binom{6}{2} = 15$ (achieved by the 6-cycle $C_6$!)."
    },
    {
      "id": "m18-q27",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "In Freivalds' algorithm for verifying whether $A \\cdot B = C$ for $N \\times N$ matrices using a random vector $r \\in \\{0, 1\\}^N$, how is $A B r = C r$ evaluated in $O(N^2)$ time instead of $O(N^3)$?",
      "question": "In Freivalds' algorithm for verifying whether $A \\cdot B = C$ for $N \\times N$ matrices using a random vector $r \\in \\{0, 1\\}^N$, how is $A B r = C r$ evaluated in $O(N^2)$ time instead of $O(N^3)$?",
      "options": [
        "By associativity of matrix multiplication, compute the vector $v = B r$ first in $O(N^2)$, then compute the vector $A v = A(Br)$ in $O(N^2)$, and compare it against $C r$ in $O(N^2)$",
        "By multiplying only the main diagonals of $A$, $B$, and $C$",
        "By using the Fast Fourier Transform on the rows of $A$",
        "By choosing $r$ to have at most $\\sqrt{N}$ non-zero entries"
      ],
      "answer": 0,
      "explanation": "Multiplying an $N \\times N$ matrix by an $N \\times 1$ vector takes $O(N^2)$ time. Computing $v = Br$ ($O(N^2)$), $u = Av$ ($O(N^2)$), and $w = Cr$ ($O(N^2)$) avoids ever forming the matrix-matrix product $AB$."
    },
    {
      "id": "m18-q28",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "Why does the Karger-Stein algorithm contract an $N$-vertex graph down to $t = \\lceil 1 + N / \\sqrt{2} \\rceil$ vertices and then branch into **two** independent recursive calls?",
      "question": "Why does the Karger-Stein algorithm contract an $N$-vertex graph down to $t = \\lceil 1 + N / \\sqrt{2} \\rceil$ vertices and then branch into **two** independent recursive calls?",
      "options": [
        "Contracting from $N$ to $N / \\sqrt{2}$ vertices preserves the min-cut with probability $\\approx (N/\\sqrt{2})^2 / N^2 = 1/2$; branching into 2 independent calls at the $1/2$-survival point gives $T(N) = 2 T(N/\\sqrt{2}) + O(N^2) = O(N^2 \\log N)$ time per tree with $\\Omega(1 / \\log N)$ success probability",
        "Because graphs with fewer than $N / \\sqrt{2}$ vertices are always bipartite",
        "Because Disjoint Set Union overflows when $t < N / \\sqrt{2}$",
        "Because two recursive calls make the algorithm 100% deterministic"
      ],
      "answer": 0,
      "explanation": "In Karger's telescopic product, the survival probability from $N$ down to $t$ vertices is $\\frac{t(t-1)}{N(N-1)}$. Setting $t \\approx N / \\sqrt{2}$ makes this survival probability $\\ge 1/2$, which balances the binary branching factor of 2 against the $\\ge 1/2$ survival rate (a critical branching process)."
    }
  ],
  "np-completeness-reductions": [
    {
      "id": "m18-q29",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "To prove that a new decision problem $B$ is **NP-Hard**, what polynomial-time reduction must you construct?",
      "question": "To prove that a new decision problem $B$ is **NP-Hard**, what polynomial-time reduction must you construct?",
      "options": [
        "A polynomial-time reduction FROM a known NP-Hard problem $A$ TO $B$ ($A \\le_p B$), transforming any instance $x$ of $A$ into an instance $f(x)$ of $B$ such that $x \\in A \\iff f(x) \\in B$",
        "A polynomial-time reduction FROM $B$ TO 3-SAT ($B \\le_p \\text{3-SAT}$)",
        "A proof that $B$ has $2^N$ possible candidate solutions",
        "A reduction from 2-SAT or Dijkstra's Shortest Path to $B$"
      ],
      "answer": 0,
      "explanation": "$A \\le_p B$ means 'if $B$ is easy, then $A$ is easy'. Equivalently, by contrapositive, 'since $A$ is NP-Hard, $B$ must also be at least as hard (NP-Hard)'."
    },
    {
      "id": "m18-q30",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "In an undirected graph $G = (V, E)$ with $|V| = 25$ vertices, suppose the size of the Maximum Independent Set is $\\alpha(G) = 9$. By Gallai's Identity ($S$ is a Vertex Cover iff $V \\setminus S$ is an Independent Set), what is the exact size $\\tau(G)$ of the **Minimum Vertex Cover** of $G$?",
      "question": "In an undirected graph $G = (V, E)$ with $|V| = 25$ vertices, suppose the size of the Maximum Independent Set is $\\alpha(G) = 9$. By Gallai's Identity ($S$ is a Vertex Cover iff $V \\setminus S$ is an Independent Set), what is the exact size $\\tau(G)$ of the **Minimum Vertex Cover** of $G$?",
      "answer": 16,
      "tolerance": 0,
      "explanation": "Since $I \\subseteq V$ has no internal edges iff $V \\setminus I$ covers every edge, the maximum independent set and minimum vertex cover are complements: $\\tau(G) = |V| - \\alpha(G) = 25 - 9 = 16$."
    },
    {
      "id": "m18-q31",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "In the standard Karp reduction from $\\text{3-SAT}$ ($m$ clauses, $n$ variables) to $\\text{Independent Set}$ ($G, K$), we create a triangle of 3 vertices for each of the $m$ clauses and add conflict edges between complementary literals $x_i$ and $\\neg x_i$. What is the target Independent Set size $K$?",
      "question": "In the standard Karp reduction from $\\text{3-SAT}$ ($m$ clauses, $n$ variables) to $\\text{Independent Set}$ ($G, K$), we create a triangle of 3 vertices for each of the $m$ clauses and add conflict edges between complementary literals $x_i$ and $\\neg x_i$. What is the target Independent Set size $K$?",
      "options": [
        "$K = m$ (exactly one true literal vertex selected from each of the $m$ clause triangles)",
        "$K = n$ (the number of Boolean variables)",
        "$K = 3m$",
        "$K = m - n$"
      ],
      "answer": 0,
      "explanation": "Because each clause forms a triangle $K_3$, any independent set can pick at most 1 vertex per clause, so $|I| \\le m$. Achieving $|I| = m$ requires picking 1 literal per clause with no two chosen literals being negations of each other—which corresponds to a satisfying truth assignment!"
    },
    {
      "id": "m18-q32",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "Why does the $O(N W)$ dynamic programming algorithm for 0-1 Knapsack NOT prove that $\\mathbf{P} = \\mathbf{NP}$?",
      "question": "Why does the $O(N W)$ dynamic programming algorithm for 0-1 Knapsack NOT prove that $\\mathbf{P} = \\mathbf{NP}$?",
      "options": [
        "Because the capacity $W$ is encoded in binary using $b = \\lceil \\log_2 W \\rceil$ bits in the input, so $O(N W) = O(N \\cdot 2^b)$ is exponential in the bit-length of the input (pseudo-polynomial time)",
        "Because 0-1 Knapsack is in $\\mathbf{P}$, not $\\mathbf{NP}$",
        "Because dynamic programming uses $O(W)$ memory",
        "Because $W$ must be a floating-point number in the NP-Complete version"
      ],
      "answer": 0,
      "explanation": "Polynomial time is defined relative to the length of the input string in bits. An integer $W \\le 10^{18}$ takes only 60 bits to write down, yet $O(N W)$ takes $10^{18}$ operations ($2^{60}$), making it pseudo-polynomial."
    }
  ],
  "approximation-algorithms-fptas": [
    {
      "id": "m18-q33",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "Why does taking **both endpoints** of every edge in any Maximal Matching $M$ guarantee a 2-approximation ($|C| \\le 2 \\cdot OPT$) for Minimum Unweighted Vertex Cover?",
      "question": "Why does taking **both endpoints** of every edge in any Maximal Matching $M$ guarantee a 2-approximation ($|C| \\le 2 \\cdot OPT$) for Minimum Unweighted Vertex Cover?",
      "options": [
        "Because the edges in $M$ are vertex-disjoint, any valid Vertex Cover (including $OPT$) must pick at least 1 vertex from each of the $|M|$ edges ($OPT \\ge |M|$), while taking both endpoints picks $|C| = 2|M| \\le 2 \\cdot OPT$",
        "Because every graph has a Vertex Cover of size at most 2",
        "Because a Maximal Matching always equals a Maximum Matching",
        "Because the complement of a matching is an independent set"
      ],
      "answer": 0,
      "explanation": "No vertex can cover two different edges of a matching $M$ because edges in $M$ share no endpoints. Thus $OPT \\ge |M|$ is an airtight lower bound, and $|C| = 2|M| \\le 2 \\cdot OPT$."
    },
    {
      "id": "m18-q34",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "In the 0-1 Knapsack FPTAS on $N = 10$ items where the maximum single-item value is $v_{\\max} = 2000$ and the desired error tolerance is $\\varepsilon = 0.2$, what is the value-scaling divisor $K = \\frac{\\varepsilon \\cdot v_{\\max}}{N}$?",
      "question": "In the 0-1 Knapsack FPTAS on $N = 10$ items where the maximum single-item value is $v_{\\max} = 2000$ and the desired error tolerance is $\\varepsilon = 0.2$, what is the value-scaling divisor $K = \\frac{\\varepsilon \\cdot v_{\\max}}{N}$?",
      "answer": 40,
      "tolerance": 0,
      "explanation": "$K = \\frac{0.2 \\times 2000}{10} = \\frac{400}{10} = 40$. Scaling each item value to $\\lfloor v_i / 40 \\rfloor$ caps the maximum scaled value per item at $2000 / 40 = 50$ and the total scaled sum across all 10 items at $\\le 500$."
    },
    {
      "id": "m18-q35",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "How does **Christofides' Algorithm** improve the Metric TSP approximation ratio from $2 \\cdot OPT$ (Twice-Around-the-MST) to $1.5 \\cdot OPT$?",
      "question": "How does **Christofides' Algorithm** improve the Metric TSP approximation ratio from $2 \\cdot OPT$ (Twice-Around-the-MST) to $1.5 \\cdot OPT$?",
      "options": [
        "Instead of doubling all edges of the MST ($2 \\cdot OPT$), it finds a Minimum-Weight Perfect Matching $M^*$ on the odd-degree vertices of the MST (cost $\\le 0.5 \\cdot OPT$) and shortcuts the Eulerian tour of $\\text{MST} \\cup M^*$",
        "It runs Bellman-Held-Karp on subsets of size 3",
        "It deletes the heaviest 25% of edges from the MST",
        "It uses a Greedy Nearest-Neighbor heuristic from every starting vertex"
      ],
      "answer": 0,
      "explanation": "In any graph, the number of odd-degree vertices $O$ is even. Partitioning the optimal TSP tour restricted to $O$ into two alternating matchings shows the lighter matching costs $\\le 0.5 \\cdot OPT$. Adding $M^*$ makes every vertex in $\\text{MST} \\cup M^*$ have even degree at total cost $\\le OPT + 0.5 \\cdot OPT = 1.5 \\cdot OPT$."
    },
    {
      "id": "m18-q36",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "Why is **General TSP** (where edge weights are NOT required to obey the Triangle Inequality) impossible to approximate within *any* polynomial-time computable factor $\\rho \\ge 1$ unless $\\mathbf{P} = \\mathbf{NP}$?",
      "question": "Why is **General TSP** (where edge weights are NOT required to obey the Triangle Inequality) impossible to approximate within *any* polynomial-time computable factor $\\rho \\ge 1$ unless $\\mathbf{P} = \\mathbf{NP}$?",
      "options": [
        "Because an instance of NP-Complete Hamiltonian Cycle can be reduced to General TSP by setting edge weights to $1$ for edges in $G$ and $\\rho N + 1$ for non-edges; any $\\rho$-approximation would return cost $\\le \\rho N$ iff $G$ is Hamiltonian",
        "Because negative edge weights create infinite negative cycles",
        "Because General TSP is undecidable (equivalent to the Halting Problem)",
        "Because Minimum Spanning Trees cannot be computed without the Triangle Inequality"
      ],
      "answer": 0,
      "explanation": "Without the Triangle Inequality, shortcutting a repeated vertex $(u \\to x \\to v)$ into a direct edge $(u \\to v)$ can blow up the edge cost arbitrarily (e.g., from $1 + 1 = 2$ to $\\rho N + 1$), creating an insurmountable gap between Hamiltonian and non-Hamiltonian graphs."
    }
  ],
  "build-kd-tree-nearest-neighbor": [
    {
      "id": "m18-q37",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Core Invariant Check",
      "prompt": "When implementing $K$-Nearest Neighbor ($K$-NN) search in a k-d Tree using a bounded priority queue of capacity $K$, why must the priority queue be a **Max-Heap** (ordered by largest distance at `top()`) rather than a Min-Heap?",
      "question": "When implementing $K$-Nearest Neighbor ($K$-NN) search in a k-d Tree using a bounded priority queue of capacity $K$, why must the priority queue be a **Max-Heap** (ordered by largest distance at `top()`) rather than a Min-Heap?",
      "options": [
        "Because we need $O(1)$ access to the $K$-th closest distance seen so far (the largest among the $K$ retained neighbors) both to serve as the branch-and-bound pruning radius and to evict it when a closer point is found",
        "Because `std::priority_queue` in C++ does not support custom comparators",
        "Because we want to find the $K$ farthest points in the dataset",
        "Because a Max-Heap uses half as much memory as a Min-Heap"
      ],
      "answer": 0,
      "explanation": "The pruning threshold during $K$-NN search is the distance to the *worst* ($K$-th) candidate currently in our top-$K$ set. A Max-Heap keeps that $K$-th distance at `pq.top()`, allowing $O(1)$ pruning checks and $O(\\log K)$ replacement."
    },
    {
      "id": "m18-q38",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Exact Algorithmic Calculation",
      "prompt": "In a 3D k-d Tree, a subtree has tight Axis-Aligned Bounding Box (AABB) $[2, 6] \\times [10, 15] \\times [-5, 0]$. For the query point $Q = (0, 12, 3)$, what is the exact minimum squared Euclidean distance $d_{\\min}^2(Q, \\text{AABB})$ from $Q$ to the bounding box?",
      "question": "In a 3D k-d Tree, a subtree has tight Axis-Aligned Bounding Box (AABB) $[2, 6] \\times [10, 15] \\times [-5, 0]$. For the query point $Q = (0, 12, 3)$, what is the exact minimum squared Euclidean distance $d_{\\min}^2(Q, \\text{AABB})$ from $Q$ to the bounding box?",
      "answer": 13,
      "tolerance": 0,
      "explanation": "Clamping $Q = (0, 12, 3)$ to $[2, 6] \\times [10, 15] \\times [-5, 0]$ gives the closest box point $(2, 12, 0)$. The displacement is $(\\Delta x, \\Delta y, \\Delta z) = (2 - 0, 12 - 12, 3 - 0) = (2, 0, 3)$, so $d_{\\min}^2 = 2^2 + 0^2 + 3^2 = 4 + 0 + 9 = 13$."
    },
    {
      "id": "m18-q39",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Core Invariant Check",
      "prompt": "When constructing a static balanced k-d Tree over `pts[l..r]` at depth `d` by splitting at `mid = (l + r) / 2`, why do we use `std::nth_element` instead of `std::sort`?",
      "question": "When constructing a static balanced k-d Tree over `pts[l..r]` at depth `d` by splitting at `mid = (l + r) / 2`, why do we use `std::nth_element` instead of `std::sort`?",
      "options": [
        "`std::nth_element` partitions the subarray around the median in $O(r - l)$ linear time per node, yielding $T(N) = 2 T(N/2) + O(N) = O(N \\log N)$ total build time instead of $O(N \\log^2 N)$",
        "`std::nth_element` preserves the original input order of all elements",
        "`std::sort` does not work on `std::array` coordinates",
        "`std::nth_element` automatically computes the bounding box of the subarray"
      ],
      "answer": 0,
      "explanation": "Calling `std::sort` at every level of the recursion tree costs $O(M \\log M)$ per node ($O(N \\log^2 N)$ total). `std::nth_element` uses Introselect (Quickselect) in $O(M)$ linear time per node, reducing total build time to $O(N \\log N)$."
    },
    {
      "id": "m18-q40",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Staff Systems & Proof Analysis",
      "prompt": "During recursive k-d Tree Nearest Neighbor search at node `mid` (splitting along axis `a`), why is it critical for performance to always recurse into the child on the **same side** of `pts[mid].coords[a]` as the query point `q[a]` **before** recursing into the opposite child?",
      "question": "During recursive k-d Tree Nearest Neighbor search at node `mid` (splitting along axis `a`), why is it critical for performance to always recurse into the child on the **same side** of `pts[mid].coords[a]` as the query point `q[a]` **before** recursing into the opposite child?",
      "options": [
        "Searching the near child first discovers close points early and shrinks `pq.top().dist_sq` (the pruning radius), maximizing the probability that the far child's bounding box fails `box_min_dist_sq < pq.top().dist_sq` and gets pruned completely",
        "Because the nearest neighbor is guaranteed 100% of the time to reside in the near child",
        "Because recursing into the far child first causes stack overflow",
        "Because the far child has not been constructed yet"
      ],
      "answer": 0,
      "explanation": "Branch-and-bound pruning is only as strong as the current best upper bound `pq.top().dist_sq`. Visiting the child subtree that spatially contains `q` first rapidly tightens `pq.top().dist_sq`, allowing the subsequent check on the far child to prune the entire far subtree in $O(1)$."
    }
  ]
});
