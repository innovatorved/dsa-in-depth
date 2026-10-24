window.MODULE_CONTENT = window.MODULE_CONTENT || {};

window.MODULE_CONTENT["m18"] = {
  "geometry-primitives-orientation-ccw": {
    title: "Robust Computational Geometry Primitives: 2D Cross/Dot Products, CCW Orientation & Segment Intersection",
    video: {
      youtubeId: "G9QTjWtK_TQ",
      title: "Computational Geometry Primitives: Cross Products, Orientation & Segment Intersection",
      channel: "Errichto Algorithms",
      duration: "39m",
      length: "39:15",
      start: 0,
      why: "Demonstrates why slope-based geometry fails on vertical lines and floating-point rounding, and how exact 64-bit integer cross/dot products solve orientation, segment intersection, and polygon area without division."
    },
    intuition: "In naive geometry code, computing slopes $\\Delta y / \\Delta x$ triggers division-by-zero on vertical segments and catastrophic floating-point cancellation on nearly parallel lines. Every foundational 2D geometric predicate—whether three points turn counter-clockwise (CCW), whether two line segments intersect, whether a point lies inside a polygon, or the area of a non-self-intersecting polygon—reduces to two division-free bilinear forms over exact 64-bit integers: the 2D **Cross Product** $\\vec{u} \\times \\vec{v} = u_x v_y - u_y v_x$ (signed parallelogram area) and the **Dot Product** $\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y$ (signed projection).",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Exact Orientation &amp; Segment Intersection Predicates</h3>
        <div class="invariant-box">
          <h4>Invariant: The CCW Orientation Determinant</h4>
          <p>Given three points $A(x_A, y_A)$, $B(x_B, y_B)$, and $C(x_C, y_C)$ in $\\mathbb{Z}^2$, define the displacement vectors $\\vec{AB} = B - A$ and $\\vec{AC} = C - A$. The 2D cross product (twice the signed area of $\\triangle ABC$) is:</p>
          <p>$$\\text{cross}(A, B, C) = \\det \\begin{pmatrix} x_B - x_A & y_B - y_A \\\\ x_C - x_A & y_C - y_A \\end{pmatrix} = (x_B - x_A)(y_C - y_A) - (y_B - y_A)(x_C - x_A)$$</p>
          <ul>
            <li>$\\text{cross}(A, B, C) > 0 \\iff A \\to B \\to C$ makes a strict <strong>Counter-Clockwise (Left)</strong> turn.</li>
            <li>$\\text{cross}(A, B, C) < 0 \\iff A \\to B \\to C$ makes a strict <strong>Clockwise (Right)</strong> turn.</li>
            <li>$\\text{cross}(A, B, C) = 0 \\iff A, B, C$ are <strong>collinear</strong>. Furthermore, $C$ lies on the closed segment $\\overline{AB}$ iff $\\text{cross}(A, B, C) = 0$ and $(A - C) \\cdot (B - C) \\le 0$.</li>
          </ul>
          <p>By the <strong>Shoelace Theorem (Discrete Green's Theorem)</strong>, twice the signed area of any simple polygon $P_0, P_1, \\dots, P_{N-1}$ is the exact integer sum $\\sum_{i=0}^{N-1} (P_i \\times P_{(i+1) \\bmod N})$.</p>
        </div>

        <h3>2. Exact Segment-Segment Intersection Decision Tree</h3>
        <div class="mermaid">
flowchart TD
    Segs["Segments AB and CD"] --> EvalCCW["Compute s1 = sgn(cross(A, B, C)), s2 = sgn(cross(A, B, D))<br/>s3 = sgn(cross(C, D, A)), s4 = sgn(cross(C, D, B))"]
    EvalCCW --> Proper{"s1 * s2 < 0 AND<br/>s3 * s4 < 0 ?"}
    Proper -->|"Yes"| HitProper["Proper Interior Intersection (True)"]
    Proper -->|"No"| Collinear{"Does any endpoint lie<br/>on the other segment?<br/>(e.g. s1 == 0 && on_seg(A, B, C))"}
    Collinear -->|"Yes"| HitDegenerate["Degenerate / Collinear Intersection (True)"]
    Collinear -->|"No"| Miss["Disjoint Segments (False)"]
        </div>

        <h3>3. Why <code>sgn()</code> Normalization Prevents Overflow</h3>
        <p>If coordinates satisfy $|x|, |y| \\le 10^9$, then $\\text{cross}(A, B, C)$ is bounded by $4 \\times 10^{18}$, which fits inside a signed 64-bit integer (<code>int64_t</code> max $\\approx 9.22 \\times 10^{18}$). However, if you test opposite orientations by multiplying $\\text{cross}(A, B, C) \\times \\text{cross}(A, B, D) < 0$ directly in <code>int64_t</code>, the product reaches $1.6 \\times 10^{37}$ and overflows! Mapping each cross product through $\\text{sgn}(v) \\in \\{-1, 0, +1\\}$ first reduces the product to $\\{-1, 0, +1\\}$ with zero overflow risk.</p>

        <h3>4. Hardware &amp; Floating-Point Realities</h3>
        <div class="hardware-box">
          <h4>IEEE-754 Catastrophic Cancellation vs Exact Integer Predicates</h4>
          <p>In IEEE-754 <code>double</code> (53-bit significand), subtracting two nearly equal products $u_x v_y - u_y v_x$ loses all leading matching bits (catastrophic cancellation), which can flip the sign of <code>cross(A, B, C)</code> from positive to negative and cause Convex Hull or Delaunay Triangulation algorithms to enter infinite loops! Production CAD/GIS kernels (CGAL, Jonathan Shewchuk's Adaptive Precision Floating-Point Predicates) use a fast hardware floating-point filter first and fall back to exact multi-word expansion arithmetic only when $|u_x v_y - u_y v_x|$ is smaller than the rounding error bound.</p>
        </div>

        <h3>5. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-convex-hull-sweep"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Geometric Predicate / Algorithm</th>
              <th>Time Complexity</th>
              <th>Space Complexity</th>
              <th>Arithmetic Requirement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2D CCW / Point-on-Segment / Segment Intersection</td>
              <td><span class="badge-o1">O(1)</span></td>
              <td><span class="badge-o1">O(1)</span></td>
              <td><code>int64_t</code> (for coords $\\le 10^9$)</td>
            </tr>
            <tr>
              <td>Shoelace Polygon Area ($N$ vertices)</td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-o1">O(1)</span></td>
              <td><code>int64_t</code> ($2 \\times \\text{Area}$ is exact integer)</td>
            </tr>
            <tr>
              <td>Point-in-Polygon (Winding Number / Ray Casting)</td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-o1">O(1)</span></td>
              <td><code>int64_t</code> cross products</td>
            </tr>
            <tr>
              <td>Point-in-Convex-Polygon (Binary Search Wedge)</td>
              <td><span class="badge-ologn">O(log N)</span></td>
              <td><span class="badge-o1">O(1)</span></td>
              <td><code>int64_t</code> cross products</td>
            </tr>
          </tbody>
        </table>

        <h3>6. Production-Grade C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;cstdint&gt;
#include &lt;vector&gt;
#include &lt;cmath&gt;

struct Point {
    int64_t x = 0, y = 0;
    Point operator-(const Point&amp; o) const { return {x - o.x, y - o.y}; }
    Point operator+(const Point&amp; o) const { return {x + o.x, y + o.y}; }
};

inline int64_t dot(const Point&amp; u, const Point&amp; v) {
    return u.x * v.x + u.y * v.y;
}

inline int64_t cross(const Point&amp; u, const Point&amp; v) {
    return u.x * v.y - u.y * v.x;
}

// Twice the signed area of triangle ABC (>0: CCW, <0: CW, 0: collinear)
inline int64_t cross(const Point&amp; a, const Point&amp; b, const Point&amp; c) {
    return cross(b - a, c - a);
}

inline int sgn(int64_t val) {
    return (val &gt; 0) - (val &lt; 0);
}

// Returns true iff point p lies on closed segment AB
inline bool on_segment(const Point&amp; a, const Point&amp; b, const Point&amp; p) {
    return cross(a, b, p) == 0 &amp;&amp; dot(a - p, b - p) &lt;= 0;
}

// Exact closed segment intersection between AB and CD
bool segments_intersect(const Point&amp; a, const Point&amp; b,
                        const Point&amp; c, const Point&amp; d) {
    int s1 = sgn(cross(a, b, c));
    int s2 = sgn(cross(a, b, d));
    int s3 = sgn(cross(c, d, a));
    int s4 = sgn(cross(c, d, b));

    // Proper intersection: C,D strictly on opposite sides of AB and vice versa
    if (s1 * s2 &lt; 0 &amp;&amp; s3 * s4 &lt; 0) return true;

    // Collinear / endpoint touching cases
    if (s1 == 0 &amp;&amp; on_segment(a, b, c)) return true;
    if (s2 == 0 &amp;&amp; on_segment(a, b, d)) return true;
    if (s3 == 0 &amp;&amp; on_segment(c, d, a)) return true;
    if (s4 == 0 &amp;&amp; on_segment(c, d, b)) return true;
    return false;
}

// Returns 2 * Area of simple polygon P (always an exact integer!)
int64_t polygon_twice_area(const std::vector&lt;Point&gt;&amp; poly) {
    int64_t sum = 0;
    const std::size_t n = poly.size();
    for (std::size_t i = 0; i &lt; n; ++i) {
        sum += cross(poly[i], poly[(i + 1) % n]);
    }
    return sum &lt; 0 ? -sum : sum;
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Using <code>atan2</code> for Polar Angle Sorting</h4>
          <p>Sorting points or vectors around an origin by calling <code>std::atan2(y, x)</code> is both slow ($\sim 40$ CPU cycles per transcendental evaluation) and inaccurate for integer coordinates near $10^9$ where distinct rays have identical <code>double</code> angles. Instead, partition vectors by half-plane (<code>half(p) = (p.y > 0 || (p.y == 0 && p.x > 0)) ? 0 : 1</code>) and sort within each half-plane using exact cross products <code>cross(u, v) > 0</code>!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "The 2D cross product cross(A, B, C) = (B - A) x (C - A) computes twice the signed area of triangle ABC: positive for CCW (left turn), negative for CW (right turn), and zero for collinear points.",
      "Point P lies on closed segment AB iff cross(A, B, P) == 0 (collinear) and dot(A - P, B - P) <= 0 (between endpoints).",
      "Always pass cross products through sgn(x) in {-1, 0, +1} before multiplying orientation signs so int64_t never overflows.",
      "The Shoelace Formula sums P_i x P_{i+1} around a polygon boundary to compute 2 * Area as an exact integer without floating-point arithmetic."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — Basic Geometry, Cross Products & Segment Intersection",
        url: "https://cp-algorithms.com/geometry/basic-geometry.html"
      },
      {
        title: "Jonathan Richard Shewchuk — Adaptive Precision Floating-Point Arithmetic and Fast Robust Geometric Predicates (1997)",
        url: "https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf"
      }
    ]
  },

  "convex-hull-graham-andrew": {
    title: "2D Convex Hull: Graham Scan vs Andrew's Monotone Chain & Rotating Calipers",
    video: {
      youtubeId: "B2AJoQSZf4M",
      title: "Convex Hull Algorithm — Graham Scan and Jarvis March Tutorial",
      channel: "Stable Sort",
      duration: "24m",
      length: "24:10",
      start: 0,
      why: "Visually compares polar-angle sorting in Graham Scan against coordinate sorting in Andrew's Monotone Chain, showing how right-turn stack pruning builds the lower and upper hulls."
    },
    intuition: "Stretch a rubber band around a scatter of nails on a board and let go—the polygon it snaps into is the **Convex Hull**. While Graham Scan (1972) sorts points by polar angle around the lowest pivot, **Andrew's Monotone Chain** (1979) avoids angle comparisons entirely: it sorts points lexicographically by $(x, y)$ and sweeps left-to-right to build the lower hull, then right-to-left to build the upper hull, popping any penultimate vertex that makes a clockwise (or collinear) turn. Once the convex hull is built, **Shamos's Rotating Calipers** (1978) sweeps two antipodal tangent lines around the hull in $O(H)$ linear time to find the farthest pair of points (polygon diameter) or minimum bounding box!",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Monotone Chain Stack Convexity &amp; Antipodal Pairs</h3>
        <div class="invariant-box">
          <h4>Invariant 1: Andrew's Monotone Chain Stack Property</h4>
          <p>After sorting distinct points $P_0 < P_1 < \\dots < P_{N-1}$ lexicographically by $(x, y)$, both the Lower Hull and Upper Hull stacks satisfy the strict CCW invariant on every consecutive triple $(H_{k-2}, H_{k-1}, H_k)$:</p>
          <p>$$\\text{cross}(H_{k-2},\\; H_{k-1},\\; P_i) > 0$$</p>
          <p>Whenever $\\text{cross}(H_{k-2}, H_{k-1}, P_i) \\le 0$ (a right turn or collinear point), $H_{k-1}$ lies inside or on the boundary of $\\triangle H_{k-2} H_0 P_i$ and is permanently popped from the hull stack.</p>
          <h4>Invariant 2: Rotating Calipers Area Monotonicity</h4>
          <p>On a convex hull $H_0, \\dots, H_{M-1}$ in CCW order, for a directed base edge $\\vec{e}_i = H_{i+1} - H_i$, the triangle area $\\text{cross}(H_i, H_{i+1}, H_j)$ is unimodal as $j$ advances around the hull, allowing the antipodal pointer $j$ to advance monotonically in $O(M)$ total steps.</p>
        </div>

        <div class="simulator-mount" data-sim="sim-convex-hull-sweep"></div>

        <h3>2. Andrew's Monotone Chain &amp; Rotating Calipers Pipeline</h3>
        <div class="mermaid">
flowchart LR
    Input["N Points in 2D"] --> SortLex["Sort Lexicographically by (x, y)<br/>&amp; Deduplicate O(N log N)"]
    SortLex --> Lower["Sweep Left-to-Right:<br/>Pop while cross <= 0<br/>(Builds Lower Hull)"]
    SortLex --> Upper["Sweep Right-to-Left:<br/>Pop while cross <= 0<br/>(Builds Upper Hull)"]
    Lower --> Concat["Concatenate Lower + Upper<br/>Into CCW Convex Hull (Size H)"]
    Upper --> Concat
    Concat --> Calipers["Rotating Calipers Two-Pointer:<br/>Advance j while cross(e_i, H_{j+1}-H_j) > 0<br/>O(H) Diameter"]
        </div>

        <h3>3. Why Andrew's Monotone Chain Beats Graham Scan in Practice</h3>
        <ul>
          <li><strong>Faster Sorting Key:</strong> Comparing two integers <code>a.x < b.x || (a.x == b.x && a.y < b.y)</code> takes 1–2 CPU cycles and branches predictably, whereas Graham Scan's polar comparator requires a 64-bit cross product + distance tie-breaker on every <code>std::sort</code> comparison ($O(N \\log N)$ multiplications).</li>
          <li><strong>Clean Collinear Handling:</strong> In Graham Scan, collinear points along the final closing ray back to the pivot require reversing the suffix of the sorted array if you want all boundary points. In Andrew's Monotone Chain, simply changing <code>< 0</code> vs <code><= 0</code> in the <code>while</code> loop toggles between keeping or discarding collinear boundary vertices!</li>
        </ul>

        <h3>4. Hardware &amp; Cache Reality</h3>
        <div class="hardware-box">
          <h4>Amortized $O(N)$ Stack Scans &amp; SIMD Sorting</h4>
          <p>After the initial $O(N \\log N)$ sort, the lower and upper hull construction loops stream sequentially through <code>pts[0..N-1]</code> and push/pop at the tail of a single contiguous <code>std::vector&lt;Point&gt;</code>. Each point is pushed twice and popped at most twice ($\\le 4N$ stack ops total), executing in sub-millisecond L1 cache time.</p>
        </div>

        <h3>5. Complexity Matrix</h3>
        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Time Complexity</th>
              <th>Space Complexity</th>
              <th>Best Suited When</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Andrew's Monotone Chain</td>
              <td><span class="badge-onlogn">O(N log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>General 2D Convex Hull ($O(N)$ if pre-sorted by $x$)</td>
            </tr>
            <tr>
              <td>Graham Scan</td>
              <td><span class="badge-onlogn">O(N log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Radially sorted point sets</td>
            </tr>
            <tr>
              <td>Jarvis March (Gift Wrapping)</td>
              <td><span class="badge-on2">O(N * H)</span></td>
              <td><span class="badge-on">O(H)</span></td>
              <td>Output-sensitive when hull size $H \\ll \\log N$</td>
            </tr>
            <tr>
              <td>Chan's Algorithm</td>
              <td><span class="badge-onlogn">O(N log H)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Optimal output-sensitive 2D/3D Convex Hull</td>
            </tr>
            <tr>
              <td>Rotating Calipers (Diameter / Width)</td>
              <td><span class="badge-on">O(H)</span> after hull</td>
              <td><span class="badge-o1">O(1)</span></td>
              <td>Farthest pair of points, minimum bounding box</td>
            </tr>
          </tbody>
        </table>

        <h3>6. Production-Grade C++20 Implementation (Monotone Chain + Rotating Calipers Diameter)</h3>
        <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;algorithm&gt;

struct Pt {
    int64_t x = 0, y = 0;
    bool operator&lt;(const Pt&amp; o) const { return x != o.x ? x &lt; o.x : y &lt; o.y; }
    bool operator==(const Pt&amp; o) const { return x == o.x &amp;&amp; y == o.y; }
    Pt operator-(const Pt&amp; o) const { return {x - o.x, y - o.y}; }
};

inline int64_t cross(const Pt&amp; a, const Pt&amp; b, const Pt&amp; c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

inline int64_t dist_sq(const Pt&amp; a, const Pt&amp; b) {
    int64_t dx = a.x - b.x, dy = a.y - b.y;
    return dx * dx + dy * dy;
}

// Returns strictly convex hull in CCW order (no 3 collinear points)
std::vector&lt;Pt&gt; monotone_chain_hull(std::vector&lt;Pt&gt; pts) {
    std::sort(pts.begin(), pts.end());
    pts.erase(std::unique(pts.begin(), pts.end()), pts.end());
    const int n = static_cast&lt;int&gt;(pts.size());
    if (n &lt;= 1) return pts;

    std::vector&lt;Pt&gt; hull;
    hull.reserve(2 * n);

    // Lower hull
    for (int i = 0; i &lt; n; ++i) {
        while (hull.size() &gt;= 2 &amp;&amp;
               cross(hull[hull.size() - 2], hull.back(), pts[i]) &lt;= 0) {
            hull.pop_back();
        }
        hull.push_back(pts[i]);
    }
    // Upper hull
    const std::size_t lower_sz = hull.size();
    for (int i = n - 2; i &gt;= 0; --i) {
        while (hull.size() &gt; lower_sz &amp;&amp;
               cross(hull[hull.size() - 2], hull.back(), pts[i]) &lt;= 0) {
            hull.pop_back();
        }
        hull.push_back(pts[i]);
    }
    hull.pop_back(); // Last point duplicates pts[0]
    return hull;
}

// Rotating Calipers: Returns maximum squared Euclidean distance (Diameter^2) in O(H)
int64_t rotating_calipers_diameter_sq(const std::vector&lt;Pt&gt;&amp; hull) {
    const int h = static_cast&lt;int&gt;(hull.size());
    if (h &lt;= 1) return 0;
    if (h == 2) return dist_sq(hull[0], hull[1]);

    int64_t max_d2 = 0;
    int j = 1;
    for (int i = 0; i &lt; h; ++i) {
        int ni = (i + 1) % h;
        // Advance antipodal vertex j while triangle area increases
        while (cross(hull[i], hull[ni], hull[(j + 1) % h]) &gt;
               cross(hull[i], hull[ni], hull[j])) {
            j = (j + 1) % h;
        }
        max_d2 = std::max({max_d2, dist_sq(hull[i], hull[j]), dist_sq(hull[ni], hull[j])});
    }
    return max_d2;
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Advancing Rotating Calipers by Euclidean Distance Instead of Cross-Product Area</h4>
          <p>When implementing Rotating Calipers for the farthest pair of points, a classic mistake is advancing pointer <code>j</code> while <code>dist_sq(hull[i], hull[j+1]) > dist_sq(hull[i], hull[j])</code>. Squared distance from a single vertex <code>hull[i]</code> is <strong>NOT necessarily unimodal</strong> around an arbitrary convex polygon, and two-pointer advancing on <code>dist_sq</code> fails on elongated polygons! Always advance <code>j</code> by comparing <strong>perpendicular height (triangle area)</strong> <code>cross(hull[i], hull[i+1], hull[j])</code> against the base edge $\\overline{H_i H_{i+1}}$, which is strictly unimodal on any convex hull.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Andrew's Monotone Chain sorts points lexicographically by (x, y) in O(N log N) and constructs the lower and upper convex hulls in O(N) stack operations without polar angle arithmetic.",
      "Using cross(...) <= 0 pops collinear boundary points to yield a minimal vertex hull, whereas cross(...) < 0 retains all boundary points (requiring deduplication of identical points first).",
      "Rotating Calipers finds the diameter (farthest pair of points) of a convex hull in O(H) time by sweeping antipodal pairs around the hull.",
      "Always advance the Rotating Calipers pointer using triangle area cross(H_i, H_{i+1}, H_j) rather than point-to-point distance, because perpendicular distance to an edge is guaranteed unimodal on a convex hull."
    ],
    furtherReading: [
      {
        title: "A. M. Andrew — Another Efficient Algorithm for Convex Hulls in Two Dimensions (IPL, 1979)",
        url: "https://doi.org/10.1016/0020-0190(79)90072-3"
      },
      {
        title: "CP-Algorithms — Convex Hull Construction & Rotating Calipers",
        url: "https://cp-algorithms.com/geometry/convex-hull.html"
      }
    ]
  },

  "sweep-line-bentley-ottmann": {
    title: "Sweep-Line Paradigm: Bentley-Ottmann Segment Intersection & Area of Union of Rectangles",
    video: {
      youtubeId: "dePDHVovJlE",
      title: "Line Segment Intersection — Sweep-Line Algorithm (Robert Sedgewick)",
      channel: "Osiris Salazar (Princeton Algorithms)",
      duration: "50m",
      length: "50:35",
      start: 0,
      why: "Shows how sweeping an imaginary vertical line across 2D space reduces static 2D geometric intersection and measure problems into dynamic 1D data structure updates."
    },
    intuition: "The **Sweep-Line Paradigm** transforms a static 2D geometric problem into a dynamic 1D problem along time $x$: imagine sweeping a vertical line $x = t$ from $-\\infty$ to $+\\infty$. Nothing interesting happens to the 1D cross-section except at discrete **Event Points** (segment endpoints, intersections, or rectangle left/right edges). In **Bentley-Ottmann (1979)**, maintaining active segments ordered by $y$-coordinate in a balanced BST means we only ever test *immediately adjacent* vertical neighbors for intersection! In **Klee's Measure Problem (Area of Union of $N$ Axis-Aligned Rectangles)**, maintaining the active $y$-intervals in a Segment Tree with `cover_count` tags computes the exact covered vertical length in $O(1)$ at the root, solving the entire 2D union area in $O(N \\log N)$ time.",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Sweep-Line Status &amp; No-Pushdown Coverage Segment Tree</h3>
        <div class="invariant-box">
          <h4>Invariant 1: Bentley-Ottmann Local Adjacency Property</h4>
          <p>Suppose two segments $S_a$ and $S_b$ intersect at $x = x^*$. Immediately to the left of $x^*$ (after processing all events with $x < x^*$), $S_a$ and $S_b$ <strong>must be immediately adjacent</strong> in the vertical sweep-line status BST! Therefore, checking only newly adjacent pairs upon segment insertion, deletion, or intersection swap detects all $K$ intersections in $O((N + K) \\log N)$ time.</p>
          <h4>Invariant 2: Klee's Measure Segment Tree (No Lazy Propagation Required!)</h4>
          <p>When sweeping vertical edges of $N$ rectangles $(x_1, +1, [y_1, y_2])$ and $(x_2, -1, [y_1, y_2])$, every $-1$ deletion removes an interval that was previously inserted as $+1$. Each Segment Tree node $u$ stores:</p>
          <ul>
            <li>$\\text{cnt}[u] \\ge 0$: how many active rectangles completely cover node $u$'s canonical $y$-interval.</li>
            <li>$\\text{len}[u]$: total covered length inside $u$'s subtree: if $\\text{cnt}[u] > 0$, then $\\text{len}[u] = Y[r+1] - Y[l]$; otherwise $\\text{len}[u] = \\text{len}[2u] + \\text{len}[2u+1]$.</li>
          </ul>
          <p>Because we only ever query the global root $\\text{len}[1]$, we <strong>never need lazy pushdown</strong>!</p>
        </div>

        <h3>2. Sweep-Line Architecture for Area of Union of Rectangles</h3>
        <div class="mermaid">
flowchart LR
    Rects["N Axis-Aligned Rectangles<br/>[x1, x2] x [y1, y2]"] --> Events["Create 2N Vertical Events:<br/>(x1, +1, y1, y2) and (x2, -1, y1, y2)<br/>+ Coordinate Compress Y"]
    Events --> Sweep["Sweep Events i = 0..2N-1:<br/>Area += segtree.root_len() * (x_i - x_{i-1})"]
    Sweep --> Update["Update Segment Tree on [y1, y2] with +1 / -1<br/>Recalculate len[u] in O(log N)"]
    Update --> Sweep
        </div>

        <h3>3. Closest Pair of Points via Sweep-Line in $O(N \\log N)$</h3>
        <p>Another classic sweep-line application finds the **Closest Pair of Points** among $N$ points without divide-and-conquer: sort points by $x$, maintain a sliding window of points with $x_i - x_j < d$ inside a <code>std::set</code> ordered by $y$, and for each point $P_i$, query the <code>std::set</code> range $[y_i - d, y_i + d]$. By a geometric packing argument, at most **6 points** can exist inside the $d \\times 2d$ bounding box with pairwise distance $\\ge d$, so the inner loop executes at most 6 iterations per point!</p>

        <h3>4. Hardware &amp; Memory Access Reality</h3>
        <div class="hardware-box">
          <h4>Coordinate Compression + Flat Array Segment Tree</h4>
          <p>In Klee's Measure Problem, $y$-coordinates can span $[-10^9, 10^9]$, but at most $2N$ distinct $y$-coordinates exist. Sorting and deduplicating them into a flat array <code>Y[0..M-1]</code> maps every elementary interval $[Y[k], Y[k+1]]$ to leaf $k$ of a static $4M$-element array Segment Tree, running $10\\times$ faster than pointer-based dynamic trees.</p>
        </div>

        <h3>5. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-convex-hull-sweep"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Sweep-Line Problem</th>
              <th>Time Complexity</th>
              <th>Space Complexity</th>
              <th>Sweep-Line Status Structure</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Any Two Segments Intersect (Shamos-Hoey)</td>
              <td><span class="badge-onlogn">O(N log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Balanced BST (<code>std::set</code>) ordered by $y(x)$</td>
            </tr>
            <tr>
              <td>All $K$ Segment Intersections (Bentley-Ottmann)</td>
              <td><span class="badge-onlogn">O((N + K) log N)</span></td>
              <td><span class="badge-on">O(N + K)</span></td>
              <td>Balanced BST + Priority Queue of Events</td>
            </tr>
            <tr>
              <td>Area / Perimeter of Union of $N$ Rectangles</td>
              <td><span class="badge-onlogn">O(N log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Coordinate-Compressed Coverage Segment Tree</td>
            </tr>
            <tr>
              <td>2D Closest Pair of Points</td>
              <td><span class="badge-onlogn">O(N log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Sliding-Window <code>std::set</code> ordered by $y$</td>
            </tr>
          </tbody>
        </table>

        <h3>6. Production-Grade C++20 Implementation (Area of Union of Rectangles)</h3>
        <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;algorithm&gt;

struct Rect {
    int64_t x1, y1, x2, y2; // [x1, x2] x [y1, y2] with x1 < x2, y1 < y2
};

int64_t rectangle_union_area(const std::vector&lt;Rect&gt;&amp; rects) {
    if (rects.empty()) return 0;

    struct Event {
        int64_t x;
        int type; // +1 for entering left edge, -1 for leaving right edge
        int64_t y1, y2;
        bool operator&lt;(const Event&amp; o) const {
            return x != o.x ? x &lt; o.x : type &gt; o.type;
        }
    };

    std::vector&lt;Event&gt; events;
    std::vector&lt;int64_t&gt; coords_y;
    events.reserve(rects.size() * 2);
    coords_y.reserve(rects.size() * 2);

    for (const auto&amp; r : rects) {
        if (r.x1 &gt;= r.x2 || r.y1 &gt;= r.y2) continue;
        events.push_back({r.x1, +1, r.y1, r.y2});
        events.push_back({r.x2, -1, r.y1, r.y2});
        coords_y.push_back(r.y1);
        coords_y.push_back(r.y2);
    }
    if (events.empty()) return 0;

    std::sort(events.begin(), events.end());
    std::sort(coords_y.begin(), coords_y.end());
    coords_y.erase(std::unique(coords_y.begin(), coords_y.end()), coords_y.end());

    const int m = static_cast&lt;int&gt;(coords_y.size()) - 1; // Number of elementary y-intervals
    if (m &lt;= 0) return 0;

    std::vector&lt;int&gt; cnt(4 * m, 0);
    std::vector&lt;int64_t&gt; len(4 * m, 0);

    auto pull = [&amp;](int u, int l, int r) {
        if (cnt[u] &gt; 0) {
            len[u] = coords_y[r + 1] - coords_y[l];
        } else if (l == r) {
            len[u] = 0;
        } else {
            len[u] = len[2 * u] + len[2 * u + 1];
        }
    };

    auto update = [&amp;](auto&amp; self, int u, int l, int r, int ql, int qr, int delta) -&gt; void {
        if (ql &lt;= l &amp;&amp; r &lt;= qr) {
            cnt[u] += delta;
            pull(u, l, r);
            return;
        }
        int mid = l + (r - l) / 2;
        if (ql &lt;= mid) self(self, 2 * u, l, mid, ql, qr, delta);
        if (qr &gt; mid)  self(self, 2 * u + 1, mid + 1, r, ql, qr, delta);
        pull(u, l, r);
    };

    int64_t total_area = 0;
    int64_t prev_x = events[0].x;

    for (const auto&amp; ev : events) {
        total_area += len[1] * (ev.x - prev_x);
        prev_x = ev.x;

        int yl = static_cast&lt;int&gt;(std::lower_bound(coords_y.begin(), coords_y.end(), ev.y1) - coords_y.begin());
        int yr = static_cast&lt;int&gt;(std::lower_bound(coords_y.begin(), coords_y.end(), ev.y2) - coords_y.begin()) - 1;
        if (yl &lt;= yr) {
            update(update, 1, 0, m - 1, yl, yr, ev.type);
        }
    }
    return total_area;
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Point-Based vs Elementary-Interval Indexing in Segment Trees</h4>
          <p>In a standard point Segment Tree, leaf $i$ represents point $Y[i]$, so $[Y[i], Y[i+1]]$ leaves a gap between $Y[i]$ and $Y[i+1]$! In Klee's Measure Problem, leaf $i$ MUST represent the <strong>continuous elementary interval $[Y[i], Y[i+1]]$</strong> of length <code>coords_y[i + 1] - coords_y[i]</code>. Consequently, a rectangle spanning $[y_1, y_2]$ updates leaf indices <code>[idx(y1), idx(y2) - 1]</code>, not <code>[idx(y1), idx(y2)]</code>!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "The Sweep-Line Paradigm replaces static 2D geometry with a 1D status structure advancing across sorted x-event points.",
      "Shamos-Hoey and Bentley-Ottmann rely on the invariant that two segments must become immediately adjacent in the vertical sweep-line status before they can intersect.",
      "Area of Union of N Rectangles (Klee's Measure Problem) runs in O(N log N) using a coverage-count Segment Tree over elementary intervals [Y[i], Y[i+1]] without needing lazy propagation.",
      "Leaf i in a measure Segment Tree represents the continuous span [Y[i], Y[i+1]], so a vertical edge [y1, y2] updates leaf indices [idx(y1), idx(y2) - 1]."
    ],
    furtherReading: [
      {
        title: "Jon L. Bentley & Thomas A. Ottmann — Algorithms for Reporting and Counting Geometric Intersections (IEEE TC, 1979)",
        url: "https://doi.org/10.1109/TC.1979.1675432"
      },
      {
        title: "CP-Algorithms — Search for a Pair of Intersecting Segments & Sweep-Line",
        url: "https://cp-algorithms.com/geometry/intersecting_segments.html"
      }
    ]
  },

  "spatial-indexing-kd-quad-rtrees": {
    title: "Multidimensional Spatial Indexing: k-d Trees, Quadtrees, R-Trees & Z-Order (Morton) Curves",
    video: {
      youtubeId: "BK5x7IUTIyU",
      title: "K-D Trees & Spatial Indexing Data Structures",
      channel: "Computerphile",
      duration: "48m",
      length: "48:20",
      start: 0,
      why: "Compares space-partitioning trees (k-d trees, Quadtrees) against data-partitioning bounding-box hierarchies (R-Trees) and space-filling Z-order curves used in modern GIS and vector databases."
    },
    intuition: "How do PostgreSQL/PostGIS, game engines, and Lidar point-cloud processors find all objects inside a 2D/3D bounding box or the $K$ nearest neighbors to a query point without scanning all $N$ records? **Space-partitioning trees** like **k-d Trees** (Bentley 1975, cycling splitting axes $x, y, z$ at median points) and **Quadtrees/Octrees** recursively bisect space into disjoint cells. **Data-partitioning trees** like **R-Trees** (Guttman 1984) generalize B-Trees by grouping nearby geometric objects into Minimum Bounding Rectangles (MBRs) aligned with disk pages. And **Space-Filling Curves** like the **Z-Order (Morton) Curve** interleave the bits of $(x, y)$ into a single 64-bit integer so standard 1D B-Trees can answer 2D range queries with sequential memory scans!",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Axis-Cycling Partitioning &amp; Bounding-Box Pruning</h3>
        <div class="invariant-box">
          <h4>Invariant 1: k-d Tree Axis-Alternating Median Split</h4>
          <p>In a $k$-dimensional k-d Tree, a node at depth $d$ splits its point set along axis $a = d \\bmod k$ at the median coordinate <code>pivot[a]</code> (selected in $O(m)$ via <code>std::nth_element</code>). Every point in the left subtree has $p[a] \\le \\text{pivot}[a]$, and every point in the right subtree has $p[a] \\ge \\text{pivot}[a]$. Because each point set is halved at every level, the tree is perfectly balanced with height $\\lceil \\log_2 N \\rceil$ and builds in $O(N \\log N)$ time.</p>
          <h4>Invariant 2: Branch-and-Bound Nearest Neighbor Pruning</h4>
          <p>During Nearest Neighbor search for query point $Q$ with current best squared distance $D_{\\text{best}}^2$, let $\\delta = Q[a] - \\text{pivot}[a]$ be the signed perpendicular distance to the splitting hyperplane. We <strong>always search the near child first</strong>, and we prune the far child completely whenever $\\delta^2 \\ge D_{\\text{best}}^2$!</p>
        </div>

        <h3>2. Taxonomy of Multidimensional Spatial Indexes</h3>
        <div class="mermaid">
flowchart TD
    Spatial["Multidimensional Spatial Indexing"] --> SpacePart["Space-Partitioning<br/>(Disjoint Regions)"]
    Spatial --> DataPart["Data-Partitioning<br/>(Bounding Hierarchies)"]
    Spatial --> SpaceFill["Space-Filling Curves<br/>(2D/3D -> 1D Linearization)"]
    SpacePart --> KDTree["k-d Tree<br/>Alternating Axis Median Split<br/>O(N^{1-1/k} + K) Range Query"]
    SpacePart --> Quadtree["Quadtree / Octree<br/>4-way / 8-way Regular Quadrant Split"]
    DataPart --> RTree["R-Tree / R*-Tree<br/>Paged Minimum Bounding Rectangles (MBR)<br/>PostGIS / SQLite R*Tree"]
    SpaceFill --> Morton["Z-Order (Morton) &amp; Hilbert Curves<br/>Bit Interleaving (BMI2 _pdep_u64)"]
        </div>

        <h3>3. Space-Filling Curves &amp; Hardware Bit Interleaving (<code>_pdep_u64</code>)</h3>
        <div class="hardware-box">
          <h4>Single-Cycle Morton Encoding via x86 BMI2 <code>PDEP</code></h4>
          <p>The 2D Z-Order (Morton) code of $(x, y) \\in [0, 2^{32}-1]^2$ places the bits of $x$ at even bit positions ($0, 2, 4, \\dots$) and the bits of $y$ at odd bit positions ($1, 3, 5, \\dots$). On modern x86-64 CPUs with BMI2, <code>_pdep_u64(x, 0x5555555555555555ULL) | _pdep_u64(y, 0xAAAAAAAAAAAAAAAAULL)</code> computes the 64-bit Morton key in <strong>6 CPU cycles</strong>! Sorting an array of points or BVH triangles by their Morton code clusters spatially adjacent objects into the same cache lines and disk pages.</p>
        </div>

        <h3>4. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-convex-hull-sweep"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Spatial Structure</th>
              <th>Build Time</th>
              <th>Orthogonal Range Query</th>
              <th>Nearest Neighbor (Average / Worst)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2D k-d Tree (Static Balanced)</td>
              <td><span class="badge-onlogn">O(N log N)</span></td>
              <td><span class="badge-on">O(sqrt(N) + K)</span></td>
              <td><span class="badge-ologn">O(log N)</span> avg / <span class="badge-on">O(N)</span> worst</td>
            </tr>
            <tr>
              <td>$k$-D k-d Tree ($k$ dimensions)</td>
              <td><span class="badge-onlogn">O(N log N)</span></td>
              <td><span class="badge-on">O(N^{1 - 1/k} + K)</span></td>
              <td><span class="badge-ologn">O(2^k log N)</span> avg</td>
            </tr>
            <tr>
              <td>Quadtree (Depth $D$, Spread $\\Phi$)</td>
              <td><span class="badge-onlogn">O(N * D)</span></td>
              <td><span class="badge-on">O(D + K)</span></td>
              <td><span class="badge-ologn">O(D)</span> avg</td>
            </tr>
            <tr>
              <td>R-Tree (Disk Page Fanout $B$)</td>
              <td><span class="badge-onlogn">O(N log_B N)</span></td>
              <td><span class="badge-ologn">O(log_B N + K/B)</span> avg</td>
              <td><span class="badge-ologn">O(log_B N)</span> avg (Best-First)</td>
            </tr>
          </tbody>
        </table>

        <h3>5. Production-Grade C++20 Implementation (Morton Z-Curve &amp; Static 2D k-d Tree Core)</h3>
        <pre><code class="language-cpp">#include &lt;cstdint&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;limits&gt;

// Portable O(1) 64-bit Morton (Z-Order) bit interleaving for 32-bit x, y
inline uint64_t split_by_1(uint32_t a) {
    uint64_t x = a;
    x = (x | (x &lt;&lt; 16)) &amp; 0x0000FFFF0000FFFFULL;
    x = (x | (x &lt;&lt; 8))  &amp; 0x00FF00FF00FF00FFULL;
    x = (x | (x &lt;&lt; 4))  &amp; 0x0F0F0F0F0F0F0F0FULL;
    x = (x | (x &lt;&lt; 2))  &amp; 0x3333333333333333ULL;
    x = (x | (x &lt;&lt; 1))  &amp; 0x5555555555555555ULL;
    return x;
}

inline uint64_t morton_encode_2d(uint32_t x, uint32_t y) {
    return split_by_1(x) | (split_by_1(y) &lt;&lt; 1);
}

// Why orthogonal range query in a 2D k-d tree takes O(sqrt(N) + K):
// Any axis-aligned vertical or horizontal boundary line of the query box
// intersects at most 2 of the 4 grandchildren at depth + 2:
// T(N) = 2 * T(N / 4) + O(1) ===> T(N) = O(sqrt(N))!</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — The Curse of Dimensionality in High-Dimensional k-d Trees ($k > 20$)</h4>
          <p>In a $k$-dimensional k-d Tree, the orthogonal range query bound $O(N^{1 - 1/k})$ approaches $O(N)$ as $k$ grows, and a hypersphere of radius $r$ touches almost all $2^k$ orthants around a query point! When $k \\ge 20$ (e.g., 768-D or 1536-D LLM vector embeddings), exact k-d Trees visit nearly 100% of the tree and run slower than a brute-force SIMD linear scan. For high-dimensional vectors, always use **Approximate Nearest Neighbor (ANN)** indexes such as **HNSW** (Hierarchical Navigable Small World graphs) or **IVF-PQ** (Inverted File with Product Quantization).</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "A 2D k-d Tree alternates x and y median splits using std::nth_element in O(N log N) build time and answers orthogonal range queries in O(sqrt(N) + K) worst-case time.",
      "The O(sqrt(N)) bound follows from the recurrence T(N) = 2 T(N/4) + O(1), because any axis-aligned line intersects at most 2 of the 4 grandchildren two levels down.",
      "R-Trees group spatial objects into balanced pages of Minimum Bounding Rectangles (MBRs), making them the standard disk-backed index in PostGIS and SQLite.",
      "Z-Order (Morton) curves interleave coordinate bits so 2D/3D points can be sorted and queried with cache-friendly 1D structures, while high-dimensional spaces (k > 20) require ANN indexes like HNSW."
    ],
    furtherReading: [
      {
        title: "Jon L. Bentley — Multidimensional Binary Search Trees Used for Associative Searching (CACM, 1975)",
        url: "https://dl.acm.org/doi/10.1145/361002.361007"
      },
      {
        title: "Antonin Guttman — R-Trees: A Dynamic Index Structure for Spatial Searching (SIGMOD, 1984)",
        url: "https://dl.acm.org/doi/10.1145/602259.602266"
      }
    ]
  },

  "modular-arithmetic-gcd-crt": {
    title: "Algorithmic Number Theory: Extended Euclidean Algorithm, Modular Inverse, CRT & Sieve of Eratosthenes",
    video: {
      youtubeId: "hB34-GSDT3k",
      title: "The Extended Euclidean Algorithm & Bezout Coefficients",
      channel: "GVSUmath",
      duration: "29m",
      length: "29:15",
      start: 0,
      why: "Derives Bezout's Identity, modular inverses for non-prime moduli, and constructive Chinese Remainder Theorem reconstruction step-by-step."
    },
    intuition: "Division does not exist directly in modular arithmetic $\\mathbb{Z}/m\\mathbb{Z}$—to divide by $a \\pmod m$, we must multiply by its **modular inverse** $a^{-1}$ satisfying $a \\cdot a^{-1} \\equiv 1 \\pmod m$. When $m$ is prime, Fermat's Little Theorem gives $a^{-1} \\equiv a^{m-2} \\pmod m$ in $O(\\log m)$ time; when $m$ is composite and $\\gcd(a, m) = 1$, the **Extended Euclidean Algorithm** finds Bézout coefficients $a x + m y = 1$ in $O(\\log(\\min(a, m)))$ time. Extending Bézout's Identity to multiple moduli yields the **Chinese Remainder Theorem (CRT)**, while **Euler's Linear Sieve** factors all integers up to $N$ in strict $O(N)$ time by striking each composite out *exactly once* using its smallest prime factor!",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Bézout's Identity, CRT &amp; Linear Sieve Uniqueness</h3>
        <div class="invariant-box">
          <h4>Invariant 1: Extended Euclidean Algorithm (Bézout's Identity)</h4>
          <p>For any integers $a, b$, <code>ext_gcd(a, b, x, y)</code> maintains $a x + b y = g = \\gcd(a, b)$. From the recursive step $(b, a \\bmod b)$ returning $b x_1 + (a - \\lfloor a/b \\rfloor b) y_1 = g$, rearranging terms yields the exact integer transition:</p>
          <p>$$x = y_1, \\qquad y = x_1 - \\lfloor a / b \\rfloor \\cdot y_1$$</p>
          <h4>Invariant 2: Generalized Chinese Remainder Theorem (Non-Coprime Moduli)</h4>
          <p>Two congruences $X \\equiv r_1 \\pmod{m_1}$ and $X \\equiv r_2 \\pmod{m_2}$ have a common solution if and only if $r_1 \\equiv r_2 \\pmod{g}$ where $g = \\gcd(m_1, m_2)$, in which case the merged congruence is unique modulo $\\text{lcm}(m_1, m_2) = \\frac{m_1}{g} m_2$.</p>
          <h4>Invariant 3: Euler's Linear Sieve</h4>
          <p>Every composite $x = p_{\\min} \\cdot i$ has a unique smallest prime factor $p_{\\min} = \\text{spf}[x]$. In the inner loop over primes $p \\le \\text{spf}[i]$, breaking immediately as soon as <code>i % p == 0</code> guarantees that every composite $x \\le N$ is marked <strong>exactly once</strong> (by $p = \\text{spf}[x]$), achieving true $O(N)$ time!</p>
        </div>

        <h3>2. Chinese Remainder Theorem Congruence Merging Pipeline</h3>
        <div class="mermaid">
flowchart LR
    Cong["Merge X = r1 (mod m1)<br/>and X = r2 (mod m2)"] --> ExtGCD["Run ext_gcd(m1, m2, p, q)<br/>m1*p + m2*q = g"]
    ExtGCD --> Check{"Is (r2 - r1) % g == 0 ?"}
    Check -->|"No"| NoSol["Contradiction: Return {-1, -1}"]
    Check -->|"Yes"| Combine["step = m2 / g<br/>k = ((r2 - r1) / g % step * p) % step<br/>r_new = r1 + m1 * k<br/>m_new = m1 * (m2 / g)"]
        </div>

        <h3>3. Linear-Time Modular Inverse Table in $O(N)$</h3>
        <p>When precomputing factorials and inverse factorials modulo a prime $M$ up to $N$, we can compute all modular inverses $\\text{inv}[1..N]$ in $O(N)$ total time without a single <code>log M</code> binary exponentiation! Writing $M = q \\cdot i + r$ where $q = \\lfloor M / i \\rfloor$ and $r = M \\bmod i < i$, we have $q \\cdot i + r \\equiv 0 \\pmod M$. Multiplying by $i^{-1} r^{-1}$ gives the one-line recurrence:</p>
        <p>$$\\text{inv}[i] = \\left( M - \\lfloor M / i \\rfloor \\right) \\cdot \\text{inv}[M \\bmod i] \\bmod M$$</p>

        <h3>4. Hardware &amp; Cache Reality</h3>
        <div class="hardware-box">
          <h4>Bitset Wheel Sieve vs Linear SPF Sieve</h4>
          <p>While Euler's Linear Sieve does $O(N)$ arithmetic operations vs $O(N \\log \\log N)$ for Eratosthenes, storing <code>int spf[N]</code> requires $4N$ bytes of RAM ($400\\text{ MB}$ for $N = 10^8$), which spills out of L3 cache. If you only need primality bits (not factorization), an odd-only bit-packed <code>std::bitset</code> Sieve of Eratosthenes uses $N / 16$ bytes ($6.25\\text{ MB}$ for $N = 10^8$), fitting completely inside L3 cache and running $3\\times$ faster in wall-clock time!</p>
        </div>

        <h3>5. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-number-theory-miller-pollard"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Number Theory Algorithm</th>
              <th>Time Complexity</th>
              <th>Space Complexity</th>
              <th>Applicability</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Extended Euclidean Algorithm (<code>ext_gcd</code>)</td>
              <td><span class="badge-ologn">O(log(min(a, b)))</span></td>
              <td><span class="badge-o1">O(1)</span></td>
              <td>Bézout coefficients, inverse for any coprime $m$</td>
            </tr>
            <tr>
              <td>Fermat Inverse ($a^{M-2} \\bmod M$)</td>
              <td><span class="badge-ologn">O(log M)</span></td>
              <td><span class="badge-o1">O(1)</span></td>
              <td>Prime modulus $M$ only</td>
            </tr>
            <tr>
              <td>All Inverses $1..N \\pmod M$ Recurrence</td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td>Prime modulus $M > N$</td>
            </tr>
            <tr>
              <td>Sieve of Eratosthenes</td>
              <td><span class="badge-onlogn">O(N log log N)</span></td>
              <td><span class="badge-on">O(N)</span> bits</td>
              <td>Fastest cache-resident primality table</td>
            </tr>
            <tr>
              <td>Euler's Linear Sieve (<code>spf[x]</code>, $\\varphi(x)$, $\\mu(x)$)</td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-on">O(N)</span> ints</td>
              <td>$O(\\log x)$ factorization &amp; multiplicative functions</td>
            </tr>
          </tbody>
        </table>

        <h3>6. Production-Grade C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;utility&gt;

// Iterative Extended GCD: returns g = gcd(a, b) and sets x, y such that a*x + b*y = g
int64_t ext_gcd(int64_t a, int64_t b, int64_t&amp; x, int64_t&amp; y) {
    x = 1; y = 0;
    int64_t x1 = 0, y1 = 1, a1 = a, b1 = b;
    while (b1 != 0) {
        int64_t q = a1 / b1;
        std::tie(x, x1) = std::make_tuple(x1, x - q * x1);
        std::tie(y, y1) = std::make_tuple(y1, y - q * y1);
        std::tie(a1, b1) = std::make_tuple(b1, a1 - q * b1);
    }
    return a1;
}

// Modular inverse of a modulo m (works for ANY m where gcd(a, m) == 1)
int64_t mod_inv(int64_t a, int64_t m) {
    int64_t x, y;
    int64_t g = ext_gcd(a, m, x, y);
    if (g != 1) return -1; // Inverse does not exist
    return (x % m + m) % m;
}

// Generalized Chinese Remainder Theorem for potentially non-coprime moduli:
// Returns {r, lcm} such that X = r (mod lcm), or {-1, -1} if no solution exists
std::pair&lt;int64_t, int64_t&gt; crt_merge(int64_t r1, int64_t m1, int64_t r2, int64_t m2) {
    int64_t p, q;
    int64_t g = ext_gcd(m1, m2, p, q);
    if ((r2 - r1) % g != 0) return {-1, -1};

    int64_t step = m2 / g;
    __int128 diff = (r2 - r1) / g;
    int64_t k = static_cast&lt;int64_t&gt;((diff % step * (p % step)) % step);
    if (k &lt; 0) k += step;

    int64_t lcm = m1 * step;
    int64_t r = static_cast&lt;int64_t&gt;((r1 + static_cast&lt;__int128&gt;(m1) * k) % lcm);
    return {r, lcm};
}

// Euler's O(N) Linear Sieve computing smallest prime factor spf[x] and totient phi[x]
struct LinearSieve {
    std::vector&lt;int&gt; spf;
    std::vector&lt;int&gt; phi;
    std::vector&lt;int&gt; primes;

    explicit LinearSieve(int n) : spf(n + 1, 0), phi(n + 1, 0) {
        phi[1] = 1;
        for (int i = 2; i &lt;= n; ++i) {
            if (spf[i] == 0) {
                spf[i] = i;
                phi[i] = i - 1;
                primes.push_back(i);
            }
            for (int p : primes) {
                if (p &gt; spf[i] || 1LL * i * p &gt; n) break;
                spf[i * p] = p;
                if (i % p == 0) {
                    phi[i * p] = phi[i] * p; // p^2 divides i*p
                    break;
                } else {
                    phi[i * p] = phi[i] * (p - 1); // gcd(i, p) == 1
                }
            }
        }
    }
};</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Using $a^{m-2} \\bmod m$ When $m$ Is Composite</h4>
          <p>Fermat's Little Theorem ($a^{m-2} \\equiv a^{-1} \\pmod m$) holds <strong>only when $m$ is prime</strong>! If $m$ is composite (such as $m = 10^9$ or $m = 2^{64}$), $a^{m-2} \\bmod m$ produces garbage. For composite $m$ with $\\gcd(a, m) = 1$, either use Euler's Totient Theorem $a^{\\varphi(m)-1} \\pmod m$ or—better yet—call <code>ext_gcd(a, m, x, y)</code>, which works in $O(\\log m)$ time without needing to factor $m$ to find $\\varphi(m)$!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "The Extended Euclidean Algorithm finds Bezout coefficients a*x + b*y = gcd(a, b) in O(log(min(a, b))) time and computes modular inverses for any coprime modulus without factoring.",
      "The Generalized Chinese Remainder Theorem merges X = r1 (mod m1) and X = r2 (mod m2) iff r1 == r2 (mod gcd(m1, m2)), yielding a unique residue modulo lcm(m1, m2).",
      "All modular inverses 1..N modulo prime M can be precomputed in O(N) time via inv[i] = (M - M/i) * inv[M % i] % M.",
      "Euler's Linear Sieve breaks its inner loop as soon as i % p == 0, visiting each composite x exactly once via its smallest prime factor spf[x] in O(N) time."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — Extended Euclidean Algorithm, Modular Inverse & Chinese Remainder Theorem",
        url: "https://cp-algorithms.com/algebra/extended-euclid-algorithm.html"
      },
      {
        title: "CP-Algorithms — Linear Sieve for Prime Numbers and Multiplicative Functions",
        url: "https://cp-algorithms.com/algebra/prime-sieve-linear.html"
      }
    ]
  },

  "primality-miller-rabin-pollard-rho": {
    title: "Randomized Number Theory: Miller-Rabin Primality Testing & Pollard's ρ Integer Factorization",
    video: {
      youtubeId: "zmhUlVck3J0",
      title: "How To Tell If A Number Is Prime: The Miller-Rabin Primality Test",
      channel: "William Y. Feng",
      duration: "37m",
      length: "37:25",
      start: 0,
      why: "Explains how non-trivial square roots of 1 modulo N expose composite numbers in Miller-Rabin, and how the Birthday Paradox lets Pollard's Rho factor 64-bit integers in O(N^{1/4}) time."
    },
    intuition: "Trial division up to $\\sqrt{N}$ takes $10^9$ iterations for a 64-bit integer $N \\sim 10^{18}$. **Miller-Rabin** tests primality in $O(k \\log^3 N)$ time by combining Fermat's Little Theorem ($a^{N-1} \\equiv 1 \\pmod N$) with the field property that the only square roots of $1$ modulo a prime $p$ are $\\pm 1$: factoring $N - 1 = 2^s d$ and squaring $a^d \\pmod N$ $s$ times exposes any non-trivial square root of $1$! Even better, testing just **7 deterministic bases** ($\\{2, 325, 9375, 28178, 450775, 9780504, 1795265022\\}$) is **100% deterministic** for all 64-bit integers! When $N$ is composite, **Pollard's $\\rho$ (Rho) algorithm** uses a pseudo-random walk $f(x) = (x^2 + c) \\bmod N$ and the **Birthday Paradox**: if $p$ is the smallest prime factor of $N$, the sequence $x_i \\bmod p$ collides in $O(\\sqrt{p}) = O(N^{1/4})$ steps, revealing $p = \\gcd(|x - y|, N)$ without knowing $p$ in advance!",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Non-Trivial Square Roots of Unity &amp; Birthday Collisions</h3>
        <div class="invariant-box">
          <h4>Invariant 1: Strong Pseudoprimality (Miller-Rabin Witness)</h4>
          <p>For an odd integer $N > 2$, write $N - 1 = 2^s d$ with $d$ odd. If $N$ is prime and $\\gcd(a, N) = 1$, then either:</p>
          <p>$$a^d \\equiv 1 \\pmod N \\quad \\text{or} \\quad \\exists\\, r \\in [0, s-1] \\text{ such that } a^{2^r d} \\equiv -1 \\pmod N$$</p>
          <p>Why? Because if $x = a^{2^r d}$ satisfies $x^2 \\equiv 1 \\pmod N$ for a prime $N$, then $N \\mid (x - 1)(x + 1)$, which forces $x \\equiv \\pm 1 \\pmod N$. Any base $a$ violating this condition is an irrefutable <strong>witness</strong> that $N$ is composite (and overcomes Carmichael numbers like $561 = 3 \\times 11 \\times 17$). For every odd composite $N$, at least $3/4$ of bases $a \\in [1, N-1]$ are witnesses (Rabin 1980).</p>
          <h4>Invariant 2: Pollard's $\\rho$ Implicit Modulo-$p$ Cycle</h4>
          <p>Let $p \\le \\sqrt{N}$ be a prime factor of composite $N$, and iterate $f(x) = (x^2 + c) \\bmod N$. Because $(x^2 + c \\bmod N) \\bmod p = (x^2 + c) \\bmod p$, the sequence implicitly performs a pseudo-random walk in $\\mathbb{Z}/p\\mathbb{Z}$! By the Birthday Paradox, two states $x, y$ satisfy $x \\equiv y \\pmod p$ after expected $O(\\sqrt{p}) \\le O(N^{1/4})$ steps, at which point $\\gcd(|x - y|, N) > 1$ extracts a non-trivial divisor of $N$.</p>
        </div>

        <h3>2. Complete 64-Bit Factorization Pipeline</h3>
        <div class="mermaid">
flowchart TD
    Input["Factor(N) for 64-bit N"] --> BaseCase{"N == 1 ?"}
    BaseCase -->|"Yes"| RetEmpty["Return"]
    BaseCase -->|"No"| CheckPrime{"is_prime_miller_rabin(N) ?"}
    CheckPrime -->|"Yes"| RecordPrime["Record Prime Factor N &amp; Return"]
    CheckPrime -->|"No (Composite)"| RunRho["Run Pollard's Rho + Brent's Cycle Detection<br/>with Batched GCD to find divisor d"]
    RunRho --> Recurse["Recurse Factor(d) and Factor(N / d)"]
        </div>

        <h3>3. Hardware &amp; Algorithmic Optimizations: <code>__int128</code> &amp; Brent's Batched GCD</h3>
        <div class="hardware-box">
          <h4>Avoiding Overflow (<code>__int128_t</code>) &amp; Amortizing <code>gcd</code> via Richard Brent's Batching</h4>
          <p>Multiplying two 64-bit integers $a \\cdot b \\pmod N$ when $N \\sim 10^{18}$ overflows <code>uint64_t</code>! Using GCC/Clang's hardware-backed <code>static_cast&lt;__uint128_t&gt;(a) * b % N</code> compiles directly to a single x86-64 <code>mulq</code> + <code>divq</code> instruction pair. Furthermore, calling <code>std::gcd(|x - y|, N)</code> on every step of Pollard's $\\rho$ adds an $O(\\log N)$ factor. **Brent's optimization** accumulates the product $P = \\prod_{j=1}^{128} |x_j - y| \\bmod N$ across $128$ steps and computes <code>std::gcd(P, N)</code> only once every 128 iterations, accelerating Pollard's $\\rho$ by $6\\times$!</p>
        </div>

        <h3>4. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-number-theory-miller-pollard"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Time Complexity</th>
              <th>Space Complexity</th>
              <th>64-Bit ($N \\le 2^{64}-1$) Guarantee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Trial Division</td>
              <td><span class="badge-on">O(sqrt(N))</span></td>
              <td><span class="badge-o1">O(1)</span></td>
              <td>Up to $4 \\times 10^9$ ops (Too slow for $10^{18}$)</td>
            </tr>
            <tr>
              <td>Deterministic 64-bit Miller-Rabin (7 Bases)</td>
              <td><span class="badge-ologn">O(7 * log^3 N)</span></td>
              <td><span class="badge-o1">O(1)</span></td>
              <td>Exact 100% deterministic for all <code>uint64_t</code></td>
            </tr>
            <tr>
              <td>Pollard's $\\rho$ (Brent + Batched GCD)</td>
              <td><span class="badge-on">O(N^{1/4})</span> expected</td>
              <td><span class="badge-o1">O(1)</span></td>
              <td>$\\sim 10^4$ steps max for $N \\le 10^{18}$ (&lt; 2 ms)</td>
            </tr>
          </tbody>
        </table>

        <h3>5. Production-Grade C++20 Implementation</h3>
        <pre><code class="language-cpp">#include &lt;cstdint&gt;
#include &lt;vector&gt;
#include &lt;numeric&gt;
#include &lt;algorithm&gt;

using u64 = uint64_t;
using u128 = __uint128_t;

inline u64 mul_mod(u64 a, u64 b, u64 m) {
    return static_cast&lt;u64&gt;((static_cast&lt;u128&gt;(a) * b) % m);
}

u64 power_mod(u64 base, u64 exp, u64 mod) {
    u64 res = 1;
    base %= mod;
    while (exp &gt; 0) {
        if (exp &amp; 1) res = mul_mod(res, base, mod);
        base = mul_mod(base, base, mod);
        exp &gt;&gt;= 1;
    }
    return res;
}

// 100% Deterministic Miller-Rabin for all 64-bit unsigned integers
bool is_prime_u64(u64 n) {
    if (n &lt; 2) return false;
    for (u64 p : {2ULL, 3ULL, 5ULL, 7ULL, 11ULL, 13ULL, 17ULL, 19ULL, 23ULL, 29ULL, 31ULL, 37ULL}) {
        if (n == p) return true;
        if (n % p == 0) return false;
    }
    u64 d = n - 1;
    int s = __builtin_ctzll(d);
    d &gt;&gt;= s;

    // Sinclair's 7 bases sufficient for all n < 2^64
    for (u64 a : {2ULL, 325ULL, 9375ULL, 28178ULL, 450775ULL, 9780504ULL, 1795265022ULL}) {
        if (a % n == 0) continue;
        u64 x = power_mod(a, d, n);
        if (x == 1 || x == n - 1) continue;
        bool composite = true;
        for (int r = 1; r &lt; s; ++r) {
            x = mul_mod(x, x, n);
            if (x == n - 1) {
                composite = false;
                break;
            }
        }
        if (composite) return false;
    }
    return true;
}

// Pollard's Rho with Brent's cycle detection and batched GCD
u64 pollard_rho(u64 n) {
    if (n % 2 == 0) return 2;
    auto f = [n](u64 x, u64 c) { return (mul_mod(x, x, n) + c) % n; };

    for (u64 c = 1; ; ++c) {
        u64 x = 2, y = 2, g = 1, q = 1, xs = 2;
        int m = 128;
        for (int r = 1; g == 1; r &lt;&lt;= 1) {
            x = y;
            for (int i = 0; i &lt; r; ++i) y = f(y, c);
            for (int k = 0; k &lt; r &amp;&amp; g == 1; k += m) {
                xs = y;
                int lim = std::min(m, r - k);
                for (int i = 0; i &lt; lim; ++i) {
                    y = f(y, c);
                    u64 diff = x &gt; y ? x - y : y - x;
                    q = mul_mod(q, diff, n);
                }
                g = std::gcd(q, n);
            }
        }
        if (g == n) { // Overshot: backtrack step-by-step from saved xs
            do {
                xs = f(xs, c);
                u64 diff = x &gt; xs ? x - xs : xs - x;
                g = std::gcd(diff, n);
            } while (g == 1);
        }
        if (g &lt; n) return g;
    }
}

void factorize_rec(u64 n, std::vector&lt;u64&gt;&amp; factors) {
    if (n == 1) return;
    if (is_prime_u64(n)) {
        factors.push_back(n);
        return;
    }
    u64 d = pollard_rho(n);
    factorize_rec(d, factors);
    factorize_rec(n / d, factors);
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Choosing $c = 0$ or $c = -2$ in Pollard's $\\rho$ Polynomial</h4>
          <p>In Pollard's $\\rho$, the iteration polynomial $f(x) = (x^2 + c) \\bmod N$ must NEVER use $c = 0$ (which simply powers $x^{2^k}$ and fails to mix residues) or $c = -2$ (which maps $x = 2 \\cos \\theta$ to $2 \\cos 2\\theta$, trapping the walk on a tiny algebraic subset). Start at $c = 1$ and increment $c$ whenever a full cycle lands on the trivial divisor $g = N$.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Miller-Rabin factors N - 1 = 2^s * d and tests whether a^d == 1 (mod N) or a^{2^r d} == -1 (mod N), defeating Carmichael numbers by detecting non-trivial square roots of 1.",
      "Testing the 7 Sinclair bases {2, 325, 9375, 28178, 450775, 9780504, 1795265022} makes Miller-Rabin 100% deterministic for all 64-bit integers.",
      "Pollard's Rho iterates f(x) = (x^2 + c) mod N and exploits the Birthday Paradox to find a collision modulo the smallest prime factor p <= sqrt(N) in O(sqrt(p)) = O(N^{1/4}) expected steps.",
      "Brent's cycle detection with 128-step batched GCD multiplication eliminates 99% of gcd() calls and backtracks only when the batch product overshoots to g == N."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — Primality Tests (Fermat and Miller-Rabin)",
        url: "https://cp-algorithms.com/algebra/primality_tests.html"
      },
      {
        title: "CP-Algorithms — Integer Factorization (Pollard's Rho & Brent's Algorithm)",
        url: "https://cp-algorithms.com/algebra/factorization.html"
      }
    ]
  },

  "las-vegas-monte-carlo-karger": {
    title: "Las Vegas vs Monte Carlo Algorithms: Karger's Randomized Min-Cut & Freivalds' Matrix Verification",
    video: {
      youtubeId: "MMm9PZe1VdA",
      id: "MMm9PZe1VdA",
      url: "https://www.youtube.com/embed/MMm9PZe1VdA",
      title: "Karger's Randomized Edge-Contraction Minimum Cut Algorithm & Probability Analysis",
      channel: "François Schwarzentruber",
      duration: "11:42",
      start: 0,
      length: "11m",
      why: "Proves why randomly contracting edges in Karger's algorithm preserves a global minimum cut with probability at least 2 / (N(N-1)), and contrasts Las Vegas vs Monte Carlo guarantees."
    },
    intuition: "Randomized algorithms split into two paradigms: **Las Vegas** algorithms (like Randomized Quicksort or Randomized Incremental Convex Hull) *always* return the exact correct answer, with only their runtime being a random variable; **Monte Carlo** algorithms (like Miller-Rabin, **Karger's Min-Cut**, or **Freivalds' $O(N^2)$ Matrix Multiplication Verification**) run in deterministic time but have a bounded probability of error that can be amplified to $2^{-k}$ by independent repetition! In Karger's algorithm, repeatedly picking a random edge and contracting its endpoints until only 2 super-vertices remain survives without touching a specific minimum cut $C^*$ with probability $\\ge \\frac{2}{N(N-1)}$—which simultaneously proves that **any undirected multigraph has at most $\\frac{N(N-1)}{2}$ minimum cuts**!",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Karger's Contraction Survival &amp; Freivalds' Witness</h3>
        <div class="invariant-box">
          <h4>Theorem 1: Karger's Contraction Survival Bound (1993)</h4>
          <p>Let $G = (V, E)$ be a connected undirected multigraph with $N$ vertices, and let $C^*$ be any specific global minimum cut of cardinality $k = |C^*|$. Since every vertex in $G$ has degree at least $k$, the total number of edges satisfies $|E| \\ge \\frac{N k}{2}$. Thus, the probability that the first random edge contraction hits $C^*$ is at most $\\frac{k}{N k / 2} = \\frac{2}{N}$. Conditioning across all $N - 2$ contractions down to 2 vertices, the probability that $C^*$ survives untouched is:</p>
          <p>$$\\Pr[C^* \\text{ survives}] \\ge \\prod_{i=0}^{N-3} \\left(1 - \\frac{2}{N - i}\\right) = \\frac{N-2}{N} \\cdot \\frac{N-3}{N-1} \\cdot \\frac{N-4}{N-2} \\cdots \\frac{2}{4} \\cdot \\frac{1}{3} = \\frac{2}{N(N-1)}$$</p>
          <h4>Theorem 2: Freivalds' $O(N^2)$ Matrix Product Verification (1977)</h4>
          <p>To verify whether $A \\cdot B = C$ for $N \\times N$ matrices without $O(N^3)$ multiplication, pick a random binary vector $r \\in \\{0, 1\\}^N$ and check whether $A(Br) = Cr$ in $O(N^2)$ time! If $AB \\ne C$, then $\\Pr[A(Br) = Cr] \\le \\frac{1}{2}$ per trial ($\\le 2^{-k}$ after $k$ trials).</p>
        </div>

        <h3>2. Karger-Stein Recursive Amplification ($O(N^2 \\log^3 N)$)</h3>
        <div class="mermaid">
flowchart TD
    Root["FastCut(G, N vertices)"] --> Base{"N <= 6 ?"}
    Base -->|"Yes"| Brute["Return Exact Min-Cut via Brute Force"]
    Base -->|"No"| Branch["Target t = ceil(1 + N / sqrt(2))"]
    Branch --> T1["G1 = Contract(G, down to t vertices)<br/>(Survival Prob >= 1/2!)"]
    Branch --> T2["G2 = Contract(G, down to t vertices)<br/>(Independent Run, Prob >= 1/2!)"]
    T1 --> R1["c1 = FastCut(G1)"]
    T2 --> R2["c2 = FastCut(G2)"]
    R1 --> Min["Return min(c1, c2)"]
    R2 --> Min
        </div>

        <p>Notice why **Karger-Stein (1996)** is a masterpiece of algorithm design: in Karger's product, the early contractions are very safe (probability $1 - 2/N$), whereas the late contractions when only a few vertices remain are dangerous. By contracting from $N$ down to $t = \\lceil 1 + N / \\sqrt{2} \\rceil$ vertices, the survival probability is $\\approx \\frac{t(t-1)}{N(N-1)} \\ge \\frac{1}{2}$! Branching into **two independent recursive calls** at threshold $t$ satisfies $T(N) = 2 T(N / \\sqrt{2}) + O(N^2) = O(N^2 \\log N)$ per tree with success probability $\\Omega(1 / \\log N)$.</p>

        <h3>3. Converting Between Las Vegas and Monte Carlo</h3>
        <div class="hardware-box">
          <h4>Markov's Inequality &amp; Verification Oracles</h4>
          <ul>
            <li><strong>Monte Carlo $\\to$ Las Vegas:</strong> If you have a Monte Carlo algorithm with success probability $p$ AND a fast deterministic checker that verifies correctness, repeating the Monte Carlo algorithm until the checker accepts yields a Las Vegas algorithm with expected $1/p$ runs.</li>
            <li><strong>Las Vegas $\\to$ Monte Carlo:</strong> If a Las Vegas algorithm has expected runtime $\\mu$, aborting it after $k \\cdot \\mu$ steps and outputting a default answer yields a deterministic-time Monte Carlo algorithm that fails with probability $\\le 1/k$ (by Markov's Inequality).</li>
          </ul>
        </div>

        <h3>4. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-karger-np-reduction-fptas"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Class</th>
              <th>Time Complexity</th>
              <th>Error / Success Bound</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Single Trial Karger Contraction (DSU)</td>
              <td>Monte Carlo</td>
              <td><span class="badge-on">O(M alpha(N))</span></td>
              <td>Success $\\ge \\frac{2}{N(N-1)}$</td>
            </tr>
            <tr>
              <td>Full Karger Min-Cut ($\\binom{N}{2} \\ln N$ trials)</td>
              <td>Monte Carlo</td>
              <td><span class="badge-on3">O(N^2 M log N)</span></td>
              <td>Error $\\le 1 / N$</td>
            </tr>
            <tr>
              <td>Karger-Stein Recursive Min-Cut</td>
              <td>Monte Carlo</td>
              <td><span class="badge-on2">O(N^2 log^3 N)</span></td>
              <td>Error $\\le 1 / N$</td>
            </tr>
            <tr>
              <td>Freivalds' Matrix Product Check ($k$ trials)</td>
              <td>Monte Carlo</td>
              <td><span class="badge-on2">O(k * N^2)</span></td>
              <td>One-sided error $\\le 2^{-k}$</td>
            </tr>
          </tbody>
        </table>

        <h3>5. Production-Grade C++20 Implementation (Karger Contraction + Freivalds' Verifier)</h3>
        <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;numeric&gt;
#include &lt;random&gt;
#include &lt;algorithm&gt;

struct Edge { int u, v; };

// Single contraction trial of Karger's Algorithm using Disjoint Set Union (DSU)
int karger_single_trial(int n, std::vector&lt;Edge&gt; edges, std::mt19937_64&amp; rng) {
    std::shuffle(edges.begin(), edges.end(), rng);
    std::vector&lt;int&gt; parent(n), sz(n, 1);
    std::iota(parent.begin(), parent.end(), 0);

    auto find = [&amp;](auto&amp; self, int x) -&gt; int {
        return parent[x] == x ? x : parent[x] = self(self, parent[x]);
    };

    int components = n;
    for (const auto&amp; e : edges) {
        if (components &lt;= 2) break;
        int ru = find(find, e.u);
        int rv = find(find, e.v);
        if (ru != rv) {
            if (sz[ru] &lt; sz[rv]) std::swap(ru, rv);
            parent[rv] = ru;
            sz[ru] += sz[rv];
            --components;
        }
    }

    int cut_edges = 0;
    for (const auto&amp; e : edges) {
        if (find(find, e.u) != find(find, e.v)) {
            ++cut_edges;
        }
    }
    return cut_edges;
}

// Freivalds' O(k * N^2) Monte Carlo verification of A * B == C
bool freivalds_verify(const std::vector&lt;std::vector&lt;int64_t&gt;&gt;&amp; A,
                      const std::vector&lt;std::vector&lt;int64_t&gt;&gt;&amp; B,
                      const std::vector&lt;std::vector&lt;int64_t&gt;&gt;&amp; C,
                      int trials = 40) {
    const int n = static_cast&lt;int&gt;(A.size());
    std::mt19937_64 rng(1337);
    std::vector&lt;int64_t&gt; r(n), Br(n), ABr(n), Cr(n);

    for (int t = 0; t &lt; trials; ++t) {
        for (int i = 0; i &lt; n; ++i) r[i] = rng() &amp; 1ULL;
        // Compute Br = B * r in O(N^2)
        for (int i = 0; i &lt; n; ++i) {
            int64_t s = 0;
            for (int j = 0; j &lt; n; ++j) if (r[j]) s += B[i][j];
            Br[i] = s;
        }
        // Compute ABr = A * (Br) and Cr = C * r in O(N^2)
        for (int i = 0; i &lt; n; ++i) {
            int64_t sab = 0, sc = 0;
            for (int j = 0; j &lt; n; ++j) {
                sab += A[i][j] * Br[j];
                if (r[j]) sc += C[i][j];
            }
            if (sab != sc) return false; // 100% certain witness that A * B != C
        }
    }
    return true; // Probability of false positive <= 2^{-40}
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Picking Random Vertex Pairs Instead of Random Edges in Karger's Algorithm</h4>
          <p>If you implement Karger's algorithm by picking two <strong>uniformly random super-vertices</strong> $(u, v)$ to merge instead of a <strong>uniformly random remaining edge</strong> $e \\in E$, the algorithm fails exponentially! Why? Consider two $K_n$ cliques joined by a single bridge edge: picking two random vertices almost always merges vertices inside the same clique, except when it picks one vertex from each clique and destroys the bridge with probability $1/2$. Picking a random <em>edge</em> biases selection proportionally to vertex degree, protecting sparse cuts!</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Las Vegas algorithms always output the exact answer with randomized runtime, whereas Monte Carlo algorithms have deterministic runtime with bounded error probability.",
      "Karger's Contraction Algorithm preserves any specific global min-cut C* with probability >= 2 / (N(N-1)), which also proves every undirected graph has at most N(N-1)/2 minimum cuts.",
      "Karger-Stein contracts down to N / sqrt(2) vertices (where survival probability is >= 1/2) and branches twice, reducing global min-cut to O(N^2 log^3 N).",
      "Freivalds' Algorithm verifies whether A * B == C in O(k N^2) time by testing A(Br) == Cr on k random 0/1 vectors, with false-positive probability <= 2^{-k}."
    ],
    furtherReading: [
      {
        title: "David R. Karger & Clifford Stein — A New Approach to the Minimum Cut Problem (JACM, 1996)",
        url: "https://dl.acm.org/doi/10.1145/234533.234534"
      },
      {
        title: "Rajeev Motwani & Prabhakar Raghavan — Randomized Algorithms (Cambridge University Press)",
        url: "https://doi.org/10.1017/CBO9780511814075"
      }
    ]
  },

  "np-completeness-reductions": {
    title: "P, NP, NP-Hardness & Polynomial-Time Reductions (3-SAT ≤p Independent Set ≤p Vertex Cover ≤p Subset Sum)",
    video: {
      youtubeId: "YX40hbAHx3s",
      title: "P vs. NP and the Computational Complexity Zoo",
      channel: "hackerdashery",
      duration: "51m",
      length: "51:20",
      start: 0,
      why: "Clarifies the direction of Karp reductions (A <=_p B), the Cook-Levin theorem, and the canonical gadget chain from 3-SAT to Independent Set, Vertex Cover, Clique, and Subset Sum."
    },
    intuition: "**NP** does *not* stand for 'Non-Polynomial'—it stands for **Nondeterministic Polynomial time**: the class of decision problems where a 'YES' answer has a short certificate (witness) that can be *verified* in polynomial time! By the **Cook-Levin Theorem (1971)**, any NP verification circuit can be encoded as a Boolean satisfiability formula (**SAT**). To prove a new problem $B$ is **NP-Hard**, we must construct a polynomial-time Karp reduction $A \\le_p B$ from a known NP-Hard problem $A$ TO $B$—showing that if someone gave us a magic polynomial-time solver for $B$, we could use it to solve $A$ in polynomial time!",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Complexity Classes &amp; Karp Reduction Direction</h3>
        <div class="invariant-box">
          <h4>Definition: P, NP, NP-Hard, NP-Complete &amp; $A \\le_p B$</h4>
          <ul>
            <li><strong>Class $\\mathbf{P}$:</strong> Decision problems solvable in deterministic time $O(n^c)$ for some constant $c$.</li>
            <li><strong>Class $\\mathbf{NP}$:</strong> Decision problems for which a 'YES' instance $x$ has a polynomial-length certificate $w$ ($|w| = \\text{poly}(|x|)$) verifiable by a deterministic algorithm $V(x, w) = 1$ in polynomial time.</li>
            <li><strong>Karp Reduction ($A \\le_p B$):</strong> A polynomial-time computable transformation $f$ such that for every instance $x$:
              <p>$$x \\in A \\iff f(x) \\in B$$</p>
            </li>
            <li><strong>$\\mathbf{NP}$-Hard:</strong> Every problem $A \\in \\mathbf{NP}$ satisfies $A \\le_p B$.</li>
            <li><strong>$\\mathbf{NP}$-Complete:</strong> $B \\in \\mathbf{NP}$ AND $B$ is $\\mathbf{NP}$-Hard.</li>
          </ul>
        </div>

        <h3>2. Karp's Canonical Reduction Chain (1972)</h3>
        <div class="mermaid">
flowchart LR
    CircuitSAT["Circuit-SAT<br/>(Cook-Levin 1971)"] -->|"Tseitin O(N)"| ThreeSAT["3-SAT<br/>(m Clauses of 3 Literals)"]
    ThreeSAT -->|"Clause Triangles +<br/>Conflict Edges (K = m)"| IndSet["Independent Set<br/>(|I| >= K)"]
    IndSet -->|"Complement S = V \\ I<br/>(K' = |V| - K)"| VertexCover["Vertex Cover<br/>(|S| <= |V| - K)"]
    IndSet -->|"Complement Graph G_bar"| Clique["Clique<br/>(|C| >= K)"]
    VertexCover -->|"Base-4 Incidence Numbers"| SubsetSum["Subset Sum /<br/>0-1 Knapsack"]
        </div>

        <h3>3. Anatomy of the Core Reductions</h3>
        <ol>
          <li><strong>$\\text{3-SAT} \\le_p \\text{Independent Set}$:</strong> Given a 3-CNF formula with $m$ clauses, create a triangle of $3$ vertices for each clause (so any independent set can pick <em>at most $1$</em> vertex per triangle, max $m$ vertices total). Add conflict edges between every literal $x_i$ and its negation $\\neg x_i$ across all clauses. Then the graph has an Independent Set of size $K = m$ <strong>if and only if</strong> one true literal can be chosen from every clause without contradiction!</li>
          <li><strong>$\\text{Independent Set} \\equiv_p \\text{Vertex Cover}$ (Gallai's Identity):</strong> In any graph $G = (V, E)$, a subset $I \\subseteq V$ has no internal edges (Independent Set) <strong>if and only if</strong> its complement $S = V \\setminus I$ touches every edge in $E$ (Vertex Cover)! Thus $\\alpha(G) + \\tau(G) = |V|$.</li>
          <li><strong>$\\text{Vertex Cover} \\le_p \\text{Subset Sum}$:</strong> Encode each vertex $v_i$ and edge $e_j$ as digits in a base-4 number with $|E| + 1$ columns (column $0$ has weight $4^{|E|}$ counting chosen vertices, and column $j$ tracks how many endpoints cover edge $e_j$). Adding a slack number $4^{j}$ per edge allows reaching target sum $K \\cdot 4^{|E|} + \\sum_{j=0}^{|E|-1} 2 \\cdot 4^j$ with zero carry between columns iff a Vertex Cover of size $K$ exists!</li>
        </ol>

        <h3>4. Strong NP-Completeness vs Weak (Pseudo-Polynomial) NP-Completeness</h3>
        <div class="hardware-box">
          <h4>Why $O(N W)$ Knapsack Is NOT a Polynomial-Time Algorithm</h4>
          <p>In complexity theory, input size is measured in <strong>bits</strong>: an integer capacity $W$ requires $b = \\lceil \\log_2 W \\rceil$ bits to write down. Therefore, $O(N W) = O(N \\cdot 2^b)$ is <strong>exponential in the bit-length $b$</strong> (a <em>pseudo-polynomial</em> algorithm)! Problems like Subset Sum, Partition, and 0-1 Knapsack are <strong>Weakly NP-Complete</strong> (solvable in polynomial time if numbers are given in unary), whereas 3-SAT, Clique, TSP, and 3-Partition remain NP-Complete even when all numbers are polynomial in $N$ (<strong>Strongly NP-Complete</strong>).</p>
        </div>

        <h3>5. Complexity Matrix: Tractable Twins vs NP-Complete Counterparts</h3>
        <div class="simulator-mount" data-sim="sim-karger-np-reduction-fptas"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Tractable Problem in $\\mathbf{P}$</th>
              <th>Time Complexity</th>
              <th>NP-Complete Twin</th>
              <th>Why the Twin Jumps to NP-Complete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2-SAT (2 literals/clause)</td>
              <td><span class="badge-on">O(N + M)</span> (Tarjan SCC)</td>
              <td>3-SAT (3 literals/clause)</td>
              <td>$(a \\lor b \\lor c)$ branches into 2 choices on falsification</td>
            </tr>
            <tr>
              <td>Shortest Path (No Neg Cycles)</td>
              <td><span class="badge-onlogn">O(M + N log N)</span></td>
              <td>Longest Simple Path / Hamiltonian</td>
              <td>Simple-path non-repeating vertex constraint</td>
            </tr>
            <tr>
              <td>Eulerian Circuit (Visit Every Edge)</td>
              <td><span class="badge-on">O(N + M)</span> (Hierholzer)</td>
              <td>Hamiltonian Cycle (Visit Every Vertex)</td>
              <td>Local degree parity suffices for edges, not vertices</td>
            </tr>
            <tr>
              <td>Minimum Cut ($s$-$t$ or Global)</td>
              <td><span class="badge-on3">O(V^2 E)</span> (Dinic)</td>
              <td>Maximum Cut (MAX-CUT)</td>
              <td>Submodular (min) vs Supermodular (max) cut function</td>
            </tr>
            <tr>
              <td>Vertex Cover on Bipartite Graphs</td>
              <td><span class="badge-on">O(E sqrt(V))</span> (Kőnig/HK)</td>
              <td>Vertex Cover on General Graphs</td>
              <td>Odd cycles break LP integrality gap</td>
            </tr>
          </tbody>
        </table>

        <h3>6. Production-Grade C++20 Implementation (Karp Reduction $\\text{3-SAT} \\to \\text{Independent Set}$)</h3>
        <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;utility&gt;
#include &lt;cmath&gt;

struct Clause3 {
    // Literals encoded as +var (1..num_vars) or -var (-1..-num_vars)
    int lit[3];
};

struct IndependentSetInstance {
    int num_vertices;
    int target_k;
    std::vector&lt;std::pair&lt;int, int&gt;&gt; edges;
};

// Polynomial-time Karp reduction: 3-SAT (m clauses) <=_p Independent Set (3m vertices, K = m)
IndependentSetInstance reduce_3sat_to_independent_set(const std::vector&lt;Clause3&gt;&amp; clauses) {
    const int m = static_cast&lt;int&gt;(clauses.size());
    IndependentSetInstance out;
    out.num_vertices = 3 * m;
    out.target_k = m;

    // 1. Add triangle edges inside each clause c (at most 1 vertex chosen per clause)
    for (int c = 0; c &lt; m; ++c) {
        int u0 = 3 * c, u1 = 3 * c + 1, u2 = 3 * c + 2;
        out.edges.emplace_back(u0, u1);
        out.edges.emplace_back(u1, u2);
        out.edges.emplace_back(u0, u2);
    }

    // 2. Add conflict edges between complementary literals (x and -x)
    for (int c1 = 0; c1 &lt; m; ++c1) {
        for (int i = 0; i &lt; 3; ++i) {
            for (int c2 = c1 + 1; c2 &lt; m; ++c2) {
                for (int j = 0; j &lt; 3; ++j) {
                    if (clauses[c1].lit[i] == -clauses[c2].lit[j]) {
                        out.edges.emplace_back(3 * c1 + i, 3 * c2 + j);
                    }
                }
            }
        }
    }
    return out;
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Reversing the Reduction Direction ($B \\le_p \\text{3-SAT}$ Instead of $\\text{3-SAT} \\le_p B$)</h4>
          <p>The #1 mistake in algorithms interviews and exams is reducing your target problem $B$ <em>into</em> 3-SAT or an ILP solver to prove $B$ is NP-Hard! Showing $B \\le_p \\text{3-SAT}$ only proves that $B$ is <em>no harder than</em> 3-SAT (which is true even for trivial problems like sorting!). To prove $B$ is NP-Hard, you must reduce a known hard problem <strong>FROM $\\text{3-SAT} \\le_p B$</strong>, embedding any arbitrary 3-SAT formula into an instance of $B$.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "NP is the class of decision problems with polynomial-time verifiable certificates; NP-Completeness requires both membership in NP and NP-Hardness.",
      "To prove problem B is NP-Hard, you must reduce FROM a known NP-Hard problem A TO B (A <=_p B), never the reverse.",
      "In any graph G = (V, E), I is an Independent Set of size K iff V \\ I is a Vertex Cover of size |V| - K, and iff I is a Clique of size K in the complement graph.",
      "Subset Sum and 0-1 Knapsack are Weakly NP-Complete (admitting pseudo-polynomial O(NW) DP), whereas 3-SAT, Clique, and TSP are Strongly NP-Complete."
    ],
    furtherReading: [
      {
        title: "Richard M. Karp — Reducibility Among Combinatorial Problems (1972)",
        url: "https://doi.org/10.1007/978-1-4684-2001-2_9"
      },
      {
        title: "CLRS Introduction to Algorithms — Chapter 34: NP-Completeness",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
      }
    ]
  },

  "approximation-algorithms-fptas": {
    title: "Approximation Algorithms: 2-Approx Vertex Cover, Greedy ln N Set Cover, Metric TSP & Knapsack FPTAS",
    video: {
      youtubeId: "OacQnsvauZs",
      title: "Introduction to Approximation Algorithms (Vertex Cover, TSP, Greedy Set Cover & PTAS)",
      channel: "Tim Roughgarden Lectures",
      duration: "1:19:56",
      start: 0,
      length: "80m",
      why: "Tim Roughgarden establishes relative approximation ratios, LP-relaxation/combinatorial lower bounds, and polynomial-time approximation schemes for NP-hard problems."
    },
    intuition: "When a problem is NP-Hard and inputs are too large for exponential search, we trade exact optimality for a **provable worst-case approximation ratio $\\rho$**. Because we cannot compute the true optimum $OPT$ directly, every approximation proof hinges on finding a **structural lower bound** on $OPT$: the size of any maximal matching lower-bounds Vertex Cover (giving a **2-approximation**), the weight of an MST lower-bounds Metric TSP (giving a **2-approximation**, or **1.5-approximation** via Christofides' minimum-weight perfect matching on odd-degree vertices), harmonic dual prices bound **Greedy Set Cover** within $\\ln N$, and rounding item values turns pseudo-polynomial 0-1 Knapsack DP into a **$(1 - \\varepsilon)$-FPTAS** running in $O(N^3 / \\varepsilon)$ time!",
    content: `
      <div class="lesson-content">
        <h3>1. Formal Invariant — Lower-Bound Certificates &amp; Value Scaling</h3>
        <div class="invariant-box">
          <h4>1. Unweighted Vertex Cover 2-Approximation (Maximal Matching Lower Bound)</h4>
          <p>Greedily pick any uncovered edge $(u, v) \\in E$, add <strong>both</strong> $u$ and $v$ to cover $C$, and delete all edges incident to $u$ or $v$. The chosen edges form a <strong>matching</strong> $M$ (pairwise vertex-disjoint). Since every valid Vertex Cover must pick at least $1$ endpoint from each edge in $M$, we have $OPT \\ge |M|$, while our cover has size $|C| = 2|M| \\le 2 \\cdot OPT$!</p>
          <h4>2. Metric TSP 2-Approximation &amp; Christofides-Serdyukov 1.5-Approximation</h4>
          <p>When edge weights obey the Triangle Inequality $w(u, v) \\le w(u, x) + w(x, v)$:</p>
          <ul>
            <li>Deleting one edge from the optimal tour $OPT$ gives a spanning tree, so $w(\\text{MST}) \\le OPT$. Doubling the MST and shortcutting repeated vertices via the Triangle Inequality gives a tour of cost $\\le 2 \\cdot w(\\text{MST}) \\le 2 \\cdot OPT$.</li>
            <li><strong>Christofides (1976):</strong> Instead of doubling the whole MST, find a Minimum-Weight Perfect Matching $M^*$ on the set $O$ of odd-degree vertices of the MST. By parity, $w(M^*) \\le \\frac{1}{2} OPT$, so the Eulerian tour of $\\text{MST} \\cup M^*$ has cost $\\le w(\\text{MST}) + w(M^*) \\le 1.5 \\cdot OPT$!</li>
          </ul>
          <h4>3. 0-1 Knapsack FPTAS (Fully Polynomial-Time Approximation Scheme)</h4>
          <p>Let $v_{\\max} = \\max_i v_i$ and scale down every item's value by $K = \\frac{\\varepsilon \\cdot v_{\\max}}{N}$: $\\tilde{v}_i = \\lfloor v_i / K \\rfloor$. Now $\\max_i \\tilde{v}_i = \\lfloor N / \\varepsilon \\rfloor$, so the total scaled value of any subset is at most $N \\cdot (N / \\varepsilon) = N^2 / \\varepsilon$. Running minimum-weight DP indexed by scaled value takes $O(N^3 / \\varepsilon)$ time and loses at most $N \\cdot K = \\varepsilon \\cdot v_{\\max} \\le \\varepsilon \\cdot OPT$!</p>
        </div>

        <h3>2. The Inapproximability Spectrum</h3>
        <div class="mermaid">
flowchart LR
    FPTAS["0-1 Knapsack<br/>FPTAS: (1 - eps) in O(N^3 / eps)"] --> ConstApprox["Metric TSP (1.5-Approx)<br/>Vertex Cover (2-Approx)<br/>MAX-3SAT (7/8-Approx)"]
    ConstApprox --> LogApprox["Set Cover<br/>Greedy H_n <= (ln n + 1)-Approx<br/>(Tight under P != NP)"]
    LogApprox --> Inapprox["General TSP (No Triangle Ineq)<br/>&amp; Maximum Clique<br/>Inapproximable within any poly factor!"]
        </div>

        <h3>3. Why General TSP (Without Triangle Inequality) Is Completely Inapproximable</h3>
        <div class="hardware-box">
          <h4>Gap-Introducing Reduction from Hamiltonian Cycle</h4>
          <p>Suppose a polynomial-time algorithm could approximate General TSP within <em>any</em> factor $\\rho \\ge 1$. Given a graph $G = (V, E)$ for Hamiltonian Cycle, assign weight $1$ to every edge in $E$ and weight $\\rho N + 1$ to every non-edge! If $G$ has a Hamiltonian cycle, $OPT = N$, so the $\\rho$-approximation must return a tour of cost $\\le \\rho N$ (using only edges of weight $1$). If $G$ has no Hamiltonian cycle, any tour uses at least one non-edge and costs $\\ge \\rho N + N > \\rho N$. Thus a $\\rho$-approximation for General TSP would solve NP-Complete Hamiltonian Cycle in polynomial time!</p>
        </div>

        <h3>4. Complexity &amp; Approximation Ratio Matrix</h3>
        <div class="simulator-mount" data-sim="sim-karger-np-reduction-fptas"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Optimization Problem</th>
              <th>Approximation Algorithm</th>
              <th>Guarantee Ratio</th>
              <th>Time Complexity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Minimum Vertex Cover</td>
              <td>Maximal Matching / LP Pricing</td>
              <td>$2 \\cdot OPT$</td>
              <td><span class="badge-on">O(V + E)</span></td>
            </tr>
            <tr>
              <td>Metric TSP (Triangle Inequality)</td>
              <td>Twice-Around-the-Tree (MST)</td>
              <td>$2 \\cdot OPT$</td>
              <td><span class="badge-onlogn">O(E log V)</span></td>
            </tr>
            <tr>
              <td>Metric TSP (Triangle Inequality)</td>
              <td>Christofides (MST + Odd MWPM)</td>
              <td>$1.5 \\cdot OPT$</td>
              <td><span class="badge-on3">O(V^3)</span></td>
            </tr>
            <tr>
              <td>Minimum Set Cover ($n$ elements)</td>
              <td>Greedy Min Cost per New Element</td>
              <td>$H_n \\approx (\\ln n + 1) \\cdot OPT$</td>
              <td><span class="badge-on2">O(n * m)</span></td>
            </tr>
            <tr>
              <td>0-1 Knapsack (FPTAS)</td>
              <td>Value Scaling $\\tilde{v}_i = \\lfloor v_i / K \\rfloor$</td>
              <td>$(1 - \\varepsilon) \\cdot OPT$</td>
              <td><span class="badge-on3">O(N^3 / eps)</span></td>
            </tr>
          </tbody>
        </table>

        <h3>5. Production-Grade C++20 Implementation (2-Approx Vertex Cover &amp; Knapsack FPTAS)</h3>
        <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;cmath&gt;
#include &lt;limits&gt;
#include &lt;algorithm&gt;

// 1. Linear-Time 2-Approximation for Minimum Unweighted Vertex Cover via Maximal Matching
std::vector&lt;int&gt; vertex_cover_2approx(int n, const std::vector&lt;std::pair&lt;int, int&gt;&gt;&amp; edges) {
    std::vector&lt;bool&gt; in_cover(n, false);
    std::vector&lt;int&gt; cover;
    for (const auto&amp; [u, v] : edges) {
        if (!in_cover[u] &amp;&amp; !in_cover[v]) {
            in_cover[u] = true;
            in_cover[v] = true;
            cover.push_back(u);
            cover.push_back(v);
        }
    }
    return cover; // Guaranteed: cover.size() <= 2 * OPT
}

// 2. 0-1 Knapsack FPTAS: Returns a subset value >= (1 - eps) * OPT in O(N^3 / eps) time
int64_t knapsack_fptas(const std::vector&lt;int64_t&gt;&amp; weights,
                       const std::vector&lt;int64_t&gt;&amp; values,
                       int64_t capacity,
                       double eps) {
    const int n = static_cast&lt;int&gt;(weights.size());
    int64_t v_max = 0;
    for (int i = 0; i &lt; n; ++i) {
        if (weights[i] &lt;= capacity) v_max = std::max(v_max, values[i]);
    }
    if (v_max == 0) return 0;

    double K = (eps * static_cast&lt;double&gt;(v_max)) / static_cast&lt;double&gt;(n);
    if (K &lt; 1.0) K = 1.0; // Exact DP when K == 1

    std::vector&lt;int&gt; scaled_v(n, 0);
    int max_scaled_sum = 0;
    for (int i = 0; i &lt; n; ++i) {
        if (weights[i] &lt;= capacity) {
            scaled_v[i] = static_cast&lt;int&gt;(std::floor(values[i] / K));
            max_scaled_sum += scaled_v[i];
        }
    }

    constexpr int64_t INF = std::numeric_limits&lt;int64_t&gt;::max() / 4;
    // dp[v] = minimum weight required to achieve scaled value v
    std::vector&lt;int64_t&gt; dp(max_scaled_sum + 1, INF);
    std::vector&lt;int64_t&gt; real_val(max_scaled_sum + 1, 0);
    dp[0] = 0;

    int cur_max_v = 0;
    for (int i = 0; i &lt; n; ++i) {
        if (weights[i] &gt; capacity) continue;
        int sv = scaled_v[i];
        for (int v = cur_max_v; v &gt;= 0; --v) {
            if (dp[v] + weights[i] &lt;= capacity &amp;&amp; dp[v] + weights[i] &lt; dp[v + sv]) {
                dp[v + sv] = dp[v] + weights[i];
                real_val[v + sv] = std::max(real_val[v + sv], real_val[v] + values[i]);
            }
        }
        cur_max_v += sv;
    }

    int64_t best = 0;
    for (int v = 0; v &lt;= max_scaled_sum; ++v) {
        if (dp[v] &lt;= capacity) best = std::max(best, real_val[v]);
    }
    return best;
}</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Why Greedy Max-Degree Vertex Cover Is NOT a 2-Approximation</h4>
          <p>It is tempting to approximate Minimum Vertex Cover by repeatedly picking the vertex of highest remaining degree (just like Greedy Set Cover). Shockingly, Greedy Max-Degree Vertex Cover is <strong>NOT a constant-factor approximation</strong>—on bipartite graphs constructed with degree-harmonic layers, it returns a cover of size $\\Theta(\\log N) \\cdot OPT$! By contrast, the seemingly 'dumber' algorithm that picks <em>both</em> endpoints of any maximal matching is guaranteed to be within $2 \\cdot OPT$.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "Taking both endpoints of every edge in a Maximal Matching gives a linear-time 2-approximation for Minimum Unweighted Vertex Cover because OPT >= |M|.",
      "Greedy Set Cover achieves an H_n <= (ln n + 1) approximation ratio, which is asymptotically optimal unless P = NP.",
      "Metric TSP (with Triangle Inequality) admits a 2-approximation via MST doubling and a 1.5-approximation via Christofides' algorithm, whereas General TSP cannot be approximated within any polynomial factor.",
      "The 0-1 Knapsack FPTAS scales item values by K = (eps * v_max) / N and runs minimum-weight-for-value DP in O(N^3 / eps) time to guarantee >= (1 - eps) * OPT."
    ],
    furtherReading: [
      {
        title: "Vijay V. Vazirani — Approximation Algorithms (Springer)",
        url: "https://doi.org/10.1007/978-3-662-04565-7"
      },
      {
        title: "David P. Williamson & David B. Shmoys — The Design of Approximation Algorithms",
        url: "https://www.designofapproxalgs.com/book.pdf"
      }
    ]
  },

  "build-kd-tree-nearest-neighbor": {
    title: "Build Lab: 2D/3D k-d Tree with Bounding-Box Pruning for K-Nearest Neighbor & Range Search",
    video: {
      youtubeId: "Glp7THUpGow",
      title: "KD-Tree Nearest Neighbor Data Structure & Pruning Search",
      channel: "Stable Sort",
      duration: "27m",
      length: "27:45",
      start: 0,
      why: "Walks through constructing a static pointer-free k-d Tree using std::nth_element and implementing branch-and-bound hypersphere pruning for K-Nearest Neighbor search."
    },
    intuition: "In this capstone Build Lab, we engineer a high-performance, zero-allocation **Static Pointer-Free $K$-Dimensional k-d Tree** in C++20 supporting both **Exact $K$-Nearest Neighbor ($K$-NN) Search** (using a bounded max-heap + tighter Tight Bounding Box distance pruning) and **Orthogonal Axis-Aligned Bounding Box (AABB) Range Search** in $O(N^{1-1/D} + |\\text{output}|)$ time.",
    content: `
      <div class="lesson-content">
        <h3>1. Architecture &amp; Tight Bounding-Box Pruning Invariant</h3>
        <div class="invariant-box">
          <h4>Invariant: Implicit Array Layout &amp; Point-to-AABB Squared Distance Pruning</h4>
          <p>Instead of allocating heap nodes with <code>left</code>/<code>right</code> pointers, we reorder the input array <code>pts[l..r]</code> in-place around <code>mid = (l + r) / 2</code> using <code>std::nth_element</code> along axis <code>depth % D</code>. Furthermore, each subtree precomputes its exact tight **Axis-Aligned Bounding Box (AABB)** $[\\text{lo}_0.. \\text{hi}_0] \\times \\dots \\times [\\text{lo}_{D-1}.. \\text{hi}_{D-1}]$. For a query point $Q$, the minimum squared Euclidean distance from $Q$ to <em>any</em> point inside a subtree's AABB is:</p>
          <p>$$d_{\\min}^2(Q, \\text{AABB}) = \\sum_{a=0}^{D-1} \\Big( \\max(0LL,\\; \\text{lo}[a] - Q[a]) + \\max(0LL,\\; Q[a] - \\text{hi}[a]) \\Big)^2$$</p>
          <p>During $K$-NN search with a max-heap of capacity $K$, if <code>heap.size() == K</code> and $d_{\\min}^2(Q, \\text{AABB}) \\ge \\text{heap.top().dist\_sq}$, the entire subtree cannot improve the $K$-th nearest neighbor and is pruned immediately!</p>
        </div>

        <h3>2. K-NN Branch-and-Bound Execution Flow</h3>
        <div class="mermaid">
flowchart TD
    Query["KNN_Search(Subtree [l, r], Query Q)"] --> Prune{"heap.size() == K AND<br/>box_dist_sq(Q, AABB) >= heap.top() ?"}
    Prune -->|"Yes"| Skip["Prune Entire Subtree O(1)"]
    Prune -->|"No"| EvalMid["Evaluate d2 = dist_sq(Q, pts[mid])<br/>Push to Max-Heap (Pop if size > K)"]
    EvalMid --> Order["Compare Q[axis] vs pts[mid][axis]"]
    Order -->|"Q[axis] < pts[mid][axis]"| LeftFirst["Search Left Child First,<br/>Then Right Child (if not pruned)"]
    Order -->|"Q[axis] >= pts[mid][axis]"| RightFirst["Search Right Child First,<br/>Then Left Child (if not pruned)"]
        </div>

        <h3>3. Why Tight AABB Pruning Beats Single-Axis Hyperplane Pruning</h3>
        <div class="hardware-box">
          <h4>Full $D$-Dimensional Box Distance vs Single-Axis $\\delta^2$</h4>
          <p>Standard textbook k-d trees only check the 1D perpendicular distance $\\delta^2 = (Q[a] - \\text{pivot}[a])^2$ to the current splitting plane. However, a deep subtree may be displaced along <em>multiple</em> axes $(x, y, z)$ simultaneously! Precomputing each node's tight AABB lets us sum squared clamping distances across all $D$ dimensions $\\sum_{a=0}^{D-1} \\delta_a^2$, pruning dead diagonal octants $2\\times$–$4\\times$ earlier while keeping all nodes in a flat contiguous <code>std::vector</code>.</p>
        </div>

        <h3>4. Complexity Matrix</h3>
        <div class="simulator-mount" data-sim="sim-convex-hull-sweep"></div>

        <table class="complexity-matrix">
          <thead>
            <tr>
              <th>Operation ($D$ Dimensions)</th>
              <th>Average / Typical Time</th>
              <th>Worst-Case Time</th>
              <th>Space Overhead</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tree Construction (<code>std::nth_element</code>)</td>
              <td><span class="badge-onlogn">O(D * N log N)</span></td>
              <td><span class="badge-onlogn">O(D * N log N)</span></td>
              <td><span class="badge-on">O(D * N)</span> flat array</td>
            </tr>
            <tr>
              <td>1-Nearest Neighbor ($1$-NN)</td>
              <td><span class="badge-ologn">O(log N)</span></td>
              <td><span class="badge-on">O(N)</span></td>
              <td><span class="badge-ologn">O(log N)</span> stack</td>
            </tr>
            <tr>
              <td>$K$-Nearest Neighbors ($K$-NN)</td>
              <td><span class="badge-ologn">O(K log N)</span></td>
              <td><span class="badge-on">O(N log K)</span></td>
              <td><span class="badge-on">O(K)</span> max-heap</td>
            </tr>
            <tr>
              <td>Orthogonal AABB Range Search</td>
              <td><span class="badge-on">O(N^{1 - 1/D} + M)</span></td>
              <td><span class="badge-on">O(N^{1 - 1/D} + M)</span></td>
              <td><span class="badge-ologn">O(log N)</span> stack</td>
            </tr>
          </tbody>
        </table>

        <h3>5. Complete C++20 Build Lab Implementation</h3>
        <pre><code class="language-cpp">#include &lt;array&gt;
#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;queue&gt;
#include &lt;algorithm&gt;
#include &lt;limits&gt;

template &lt;std::size_t D = 3&gt;
class StaticKDTree {
public:
    using Point = std::array&lt;int64_t, D&gt;;

    struct IndexedPoint {
        Point coords;
        int id;
    };

    struct Neighbor {
        int64_t dist_sq;
        int id;
        // Max-heap comparator: largest dist_sq sits at top() for O(1) threshold check
        bool operator&lt;(const Neighbor&amp; o) const {
            return dist_sq != o.dist_sq ? dist_sq &lt; o.dist_sq : id &lt; o.id;
        }
    };

private:
    struct NodeBox {
        Point lo;
        Point hi;
    };

    std::vector&lt;IndexedPoint&gt; pts_;
    std::vector&lt;NodeBox&gt; boxes_;

    static int64_t point_dist_sq(const Point&amp; a, const Point&amp; b) {
        int64_t sum = 0;
        for (std::size_t i = 0; i &lt; D; ++i) {
            int64_t d = a[i] - b[i];
            sum += d * d;
        }
        return sum;
    }

    static int64_t box_min_dist_sq(const Point&amp; q, const NodeBox&amp; box) {
        int64_t sum = 0;
        for (std::size_t i = 0; i &lt; D; ++i) {
            int64_t d = 0;
            if (q[i] &lt; box.lo[i]) d = box.lo[i] - q[i];
            else if (q[i] &gt; box.hi[i]) d = q[i] - box.hi[i];
            sum += d * d;
        }
        return sum;
    }

    static bool box_disjoint(const NodeBox&amp; a, const NodeBox&amp; b) {
        for (std::size_t i = 0; i &lt; D; ++i) {
            if (a.hi[i] &lt; b.lo[i] || a.lo[i] &gt; b.hi[i]) return true;
        }
        return false;
    }

    static bool point_in_box(const Point&amp; p, const NodeBox&amp; b) {
        for (std::size_t i = 0; i &lt; D; ++i) {
            if (p[i] &lt; b.lo[i] || p[i] &gt; b.hi[i]) return false;
        }
        return true;
    }

    void build(int l, int r, int depth) {
        if (l &gt; r) return;
        int mid = l + (r - l) / 2;
        std::size_t axis = static_cast&lt;std::size_t&gt;(depth) % D;

        std::nth_element(pts_.begin() + l, pts_.begin() + mid, pts_.begin() + r + 1,
                         [axis](const IndexedPoint&amp; a, const IndexedPoint&amp; b) {
                             return a.coords[axis] &lt; b.coords[axis];
                         });

        boxes_[mid] = {pts_[mid].coords, pts_[mid].coords};
        for (int i = l; i &lt;= r; ++i) {
            for (std::size_t a = 0; a &lt; D; ++a) {
                boxes_[mid].lo[a] = std::min(boxes_[mid].lo[a], pts_[i].coords[a]);
                boxes_[mid].hi[a] = std::max(boxes_[mid].hi[a], pts_[i].coords[a]);
            }
        }

        build(l, mid - 1, depth + 1);
        build(mid + 1, r, depth + 1);
    }

    void knn_rec(int l, int r, int depth, const Point&amp; q, std::size_t k,
                 std::priority_queue&lt;Neighbor&gt;&amp; pq) const {
        if (l &gt; r) return;
        int mid = l + (r - l) / 2;

        if (pq.size() == k &amp;&amp; box_min_dist_sq(q, boxes_[mid]) &gt;= pq.top().dist_sq) {
            return; // Tight AABB branch-and-bound prune!
        }

        int64_t d2 = point_dist_sq(q, pts_[mid].coords);
        Neighbor cand{d2, pts_[mid].id};
        if (pq.size() &lt; k) {
            pq.push(cand);
        } else if (cand &lt; pq.top()) {
            pq.pop();
            pq.push(cand);
        }

        std::size_t axis = static_cast&lt;std::size_t&gt;(depth) % D;
        bool go_left_first = q[axis] &lt; pts_[mid].coords[axis];

        if (go_left_first) {
            knn_rec(l, mid - 1, depth + 1, q, k, pq);
            knn_rec(mid + 1, r, depth + 1, q, k, pq);
        } else {
            knn_rec(mid + 1, r, depth + 1, q, k, pq);
            knn_rec(l, mid - 1, depth + 1, q, k, pq);
        }
    }

    void range_rec(int l, int r, const NodeBox&amp; query_box, std::vector&lt;int&gt;&amp; out) const {
        if (l &gt; r) return;
        int mid = l + (r - l) / 2;
        if (box_disjoint(boxes_[mid], query_box)) return;

        if (point_in_box(pts_[mid].coords, query_box)) {
            out.push_back(pts_[mid].id);
        }
        range_rec(l, mid - 1, query_box, out);
        range_rec(mid + 1, r, query_box, out);
    }

public:
    explicit StaticKDTree(std::vector&lt;IndexedPoint&gt; pts)
        : pts_(std::move(pts)), boxes_(pts_.size()) {
        if (!pts_.empty()) {
            build(0, static_cast&lt;int&gt;(pts_.size()) - 1, 0);
        }
    }

    std::vector&lt;Neighbor&gt; query_knn(const Point&amp; q, std::size_t k) const {
        std::priority_queue&lt;Neighbor&gt; pq;
        if (!pts_.empty() &amp;&amp; k &gt; 0) {
            knn_rec(0, static_cast&lt;int&gt;(pts_.size()) - 1, 0, q, k, pq);
        }
        std::vector&lt;Neighbor&gt; res;
        res.reserve(pq.size());
        while (!pq.empty()) {
            res.push_back(pq.top());
            pq.pop();
        }
        std::reverse(res.begin(), res.end()); // Sorted closest to farthest
        return res;
    }

    std::vector&lt;int&gt; query_range(const Point&amp; lo, const Point&amp; hi) const {
        std::vector&lt;int&gt; out;
        if (!pts_.empty()) {
            range_rec(0, static_cast&lt;int&gt;(pts_.size()) - 1, NodeBox{lo, hi}, out);
        }
        return out;
    }
};</code></pre>

        <div class="callout callout-warning">
          <h4>Production Pitfall — Using a Min-Heap Instead of a Max-Heap for $K$-Nearest Neighbors</h4>
          <p>During $K$-NN search, you want to track the $K$ <strong>smallest</strong> distances seen so far and quickly evict the <strong>largest</strong> among those $K$ candidates whenever a closer point is discovered. Therefore, the bounded priority queue of size $K$ must be a <strong>Max-Heap</strong> (<code>std::priority_queue&lt;Neighbor&gt;</code>), where <code>pq.top().dist_sq</code> is the current $K$-th nearest distance (the pruning radius)! Using a Min-Heap puts the 1st nearest neighbor at <code>top()</code>, making it impossible to prune against the $K$-th neighbor in $O(1)$ time.</p>
        </div>
      </div>
    `,
    keyTakeaways: [
      "A pointer-free static k-d Tree partitions pts[l..r] in-place around mid = (l + r) / 2 using std::nth_element in O(D * N log N) time and zero heap allocations per node.",
      "Storing the tight D-dimensional AABB at each subtree node allows pruning against the full Euclidean point-to-box squared distance rather than just a single splitting axis.",
      "Always recurse into the child on the same side of the splitting plane as the query point first, tightening the pruning radius before testing the far child.",
      "K-NN search maintains a bounded Max-Heap of capacity K so the K-th smallest distance sits at pq.top() as the active branch-and-bound pruning radius."
    ],
    furtherReading: [
      {
        title: "Jerome H. Friedman, Jon L. Bentley & Raphael A. Finkel — An Algorithm for Finding Best Matches in Logarithmic Expected Time (ACM TOMS, 1977)",
        url: "https://dl.acm.org/doi/10.1145/355744.355745"
      },
      {
        title: "CP-Algorithms — Nearest Neighbor Search & K-D Trees",
        url: "https://cp-algorithms.com/geometry/nearest_points.html"
      }
    ]
  }
};
