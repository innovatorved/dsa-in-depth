window.MODULE_CONTENT = window.MODULE_CONTENT || {};
window.MODULE_CONTENT["m02"] = {
  "dynamic-arrays-geometric-resizing": {
    title: "Dynamic Arrays: Geometric Growth Factors (2× vs 1.5×) & Memory Reuse",
    video: {
      youtubeId: "5AllG-i_yto",
      id: "5AllG-i_yto",
      url: "https://www.youtube.com/embed/5AllG-i_yto",
      id: "5AllG-i_yto",
      url: "https://www.youtube.com/embed/5AllG-i_yto",
      title: "What If You Had to Invent a Dynamic Array? (Geometric Resizing & Amortized O(1))",
      channel: "Reducible",
      duration: "51 min"
    },
    intuition: "A dynamic array provides $O(1)$ amortized random access and $O(1)$ amortized append by allocating a contiguous block of heap memory and growing its capacity geometrically by a constant factor $k > 1$. However, choosing $k = 2$ (GCC libstdc++ <code>std::vector</code>) versus $k = 1.5$ (MSVC <code>std::vector</code>, Meta <code>folly::fbvector</code>) determines whether the allocator can ever reuse the sum of previously freed memory chunks.",
    content: `
      <h3>Contiguous Representation and Geometric Growth</h3>
      <p>At the machine level, a dynamic array (such as C++ <code>std::vector&lt;T&gt;</code>, Rust <code>Vec&lt;T&gt;</code>, or Java <code>ArrayList&lt;E&gt;</code>) is a 24-byte header struct stored on the stack or inline within an object: a base pointer <code>T* data</code>, a current element count <code>size_t size</code>, and an allocated slot count <code>size_t capacity</code>. Whenever <code>size &lt; capacity</code>, appending an element writes directly to <code>data[size++]</code> in a single store instruction with zero allocator interaction.</p>
      <p>When <code>size == capacity</code>, the container must allocate a new contiguous region of capacity $\\lceil k \\cdot C \\rceil$, move or copy the existing $C$ elements into the new region, destroy the old elements (if non-trivially destructible), and free the old block. If the array grew arithmetically by a constant $c$ (e.g., adding 100 slots each time), appending $N$ elements would copy $c + 2c + 3c + \\dots + N = \\Theta(N^2)$ elements, yielding $\\Theta(N)$ amortized cost per append. Geometric growth by $k > 1$ ensures that reallocation distances grow exponentially, bounding total copies to a geometric series:</p>
      <p>$$\\sum_{i=0}^{\\lfloor \\log_k N \\rfloor} k^i = \\frac{k^{\\lfloor \\log_k N \\rfloor + 1} - 1}{k - 1} \\le \\frac{k N - 1}{k - 1} = \\Theta(N)$$</p>
      <p>Dividing by $N$ insertions yields $1 + \\frac{k}{k - 1} = O(1)$ amortized work per append. Notice the trade-off embedded in $\\frac{k}{k - 1}$: as $k$ decreases toward $1$, wasted slack memory $(k - 1)N$ shrinks, but the copy multiplier $\\frac{1}{k - 1}$ explodes (for $k = 2$, at most $2N$ copies occur; for $k = 1.5$, at most $3N$ copies occur; for $k = 1.1$, $11N$ copies occur).</p>

      <div class="invariant-box">
        <div class="invariant-title">Architectural Invariant: The Golden Ratio Heap Reuse Bound ($k &lt; \\varphi$)</div>
        <p>Suppose a dynamic array grows consecutively within a contiguous arena without intervening external allocations, freeing each previous block of size $C, kC, k^2C, \\dots, k^{m-1}C$ as it allocates $k^m C$. Can the $m$-th allocation ever fit inside the coalesced sum of all previously freed blocks?</p>
        <p>For the $m$-th block of size $k^m$ to fit into the coalesced sum of the prior blocks $\\sum_{i=0}^{m-1} k^i$, we require:</p>
        <p>$$k^m \\le \\sum_{i=0}^{m-1} k^i = \\frac{k^m - 1}{k - 1}$$</p>
        <p>For $k = 2$, $2^m &gt; 2^m - 1$ for every $m \\ge 1$! A $2\\times$ growth factor guarantees that the newly requested block is <strong>always strictly larger</strong> (by 1 initial unit) than the sum of every block the vector has ever freed in its lifetime. In the asymptotic limit as $m \\to \\infty$, the critical polynomial is $k^2 - k - 1 \\le 0$, whose positive root is the Golden Ratio $\\varphi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.618$. Therefore, any growth factor $1 &lt; k &lt; 1.618$ (such as $k = 1.5$) eventually allows a coalescing allocator to satisfy future reallocations purely from the vector's own previously freed address range.</p>
      </div>

      <h3>Comparative Growth Strategies Across Runtimes</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Runtime / Implementation</th>
            <th>Growth Factor ($k$)</th>
            <th>Amortized Element Moves per Push</th>
            <th>Max Slack Overhead</th>
            <th>In-Arena Coalesced Reuse</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>GCC <code>libstdc++ std::vector</code> / Rust <code>Vec</code></td>
            <td>$2.0\\times$</td>
            <td>$1 / (2 - 1) = 1.0$</td>
            <td>$50\\%$ of capacity</td>
            <td>Never ($2^m &gt; \\sum_{i&lt;m} 2^i$)</td>
          </tr>
          <tr>
            <td>MSVC <code>std::vector</code> / Java <code>ArrayList</code></td>
            <td>$1.5\\times$ (<code>c + (c &gt;&gt; 1)</code>)</td>
            <td>$1 / (1.5 - 1) = 2.0$</td>
            <td>$33.3\\%$ of capacity</td>
            <td>Yes, after 5th resize ($1.5^4 &lt; 1 + 1.5 + 2.25 + 3.375$)</td>
          </tr>
          <tr>
            <td>Meta <code>folly::fbvector</code></td>
            <td>$1.5\\times$ + <code>jemalloc</code> size classes</td>
            <td>$\\approx 2.0$ (zero-copy via <code>xallocx</code> when possible)</td>
            <td>Aligned to jemalloc bin</td>
            <td>Yes + in-place expansion via <code>xallocx</code></td>
          </tr>
          <tr>
            <td>Go <code>slice</code> (<code>runtime.growslice</code>, Go 1.18+)</td>
            <td>$2.0\\times$ ($&lt;256$), smoothly decays to $1.25\\times$</td>
            <td>$1.0 \\to 4.0$ for large slices</td>
            <td>$20\\% - 50\\%$</td>
            <td>Yes for large slices ($k \\le 1.25 &lt; \\varphi$)</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing $k=2.0$ Heap Crawl vs. $k=1.5$ Coalesced Reuse</h3>
      <svg viewBox="0 0 760 220" width="100%" height="auto" role="img" aria-label="Comparison of 2x vs 1.5x heap memory reuse">
        <style>
          .vec-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .vec-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .vec-free { fill: rgba(239, 68, 68, 0.14); stroke: #ef4444; stroke-width: 1.5; stroke-dasharray: 4 2; }
          .vec-used { fill: rgba(16, 185, 129, 0.22); stroke: #10b981; stroke-width: 1.5; }
          .vec-reuse { fill: rgba(59, 130, 246, 0.25); stroke: #3b82f6; stroke-width: 2; }
        </style>
        <text x="15" y="24" class="vec-title">k = 2.0: Monotonic Forward Crawl (Freed sum 1+2+4+8 = 15 &lt; Next allocation 16)</text>
        <rect x="15" y="36" width="22" height="36" rx="3" class="vec-free"/>
        <text x="26" y="58" text-anchor="middle" class="vec-txt">1</text>
        <rect x="41" y="36" width="44" height="36" rx="3" class="vec-free"/>
        <text x="63" y="58" text-anchor="middle" class="vec-txt">2</text>
        <rect x="89" y="36" width="88" height="36" rx="3" class="vec-free"/>
        <text x="133" y="58" text-anchor="middle" class="vec-txt">4</text>
        <rect x="181" y="36" width="176" height="36" rx="3" class="vec-free"/>
        <text x="269" y="58" text-anchor="middle" class="vec-txt">8 (Freed Total = 15)</text>
        <rect x="363" y="36" width="352" height="36" rx="3" class="vec-used"/>
        <text x="539" y="58" text-anchor="middle" class="vec-txt">16 (Active Allocation: Cannot fit in 15!)</text>

        <text x="15" y="114" class="vec-title">k = 1.5: Coalesced Heap Reuse (Freed blocks 16 + 24 + 36 + 54 = 130 &gt;= Next allocation 122)</text>
        <rect x="15" y="126" width="48" height="36" rx="3" class="vec-free"/>
        <text x="39" y="148" text-anchor="middle" class="vec-txt">16</text>
        <rect x="65" y="126" width="72" height="36" rx="3" class="vec-free"/>
        <text x="101" y="148" text-anchor="middle" class="vec-txt">24</text>
        <rect x="139" y="126" width="108" height="36" rx="3" class="vec-free"/>
        <text x="193" y="148" text-anchor="middle" class="vec-txt">36</text>
        <rect x="249" y="126" width="162" height="36" rx="3" class="vec-free"/>
        <text x="330" y="148" text-anchor="middle" class="vec-txt">54 (Freed = 130)</text>
        <rect x="415" y="126" width="243" height="36" rx="3" class="vec-used"/>
        <text x="536" y="148" text-anchor="middle" class="vec-txt">81 (Current Active)</text>

        <rect x="15" y="172" width="366" height="34" rx="3" class="vec-reuse"/>
        <text x="198" y="193" text-anchor="middle" class="vec-txt">Next Resize (122) Reuses Coalesced Freed Region (130)!</text>
      </svg>

      <h3>Reallocation Lifecycle &amp; Exception Safety</h3>
      <div class="mermaid">
      flowchart LR
        A["push_back(val)<br/>size == capacity"] --> B["Compute new_cap =<br/>cap + (cap >> 1)"]
        B --> C["Allocate raw buffer<br/>aligned_alloc(new_cap)"]
        C --> D{"is_nothrow_move<br/>_constructible?"}
        D -- "Yes (Fast Path)" --> E["Move-construct elements<br/>or memcpy if trivial"]
        D -- "No (Strong Guarantee)" --> F["Copy-construct elements<br/>rollback on throw"]
        E --> G["Destroy old elements<br/>&amp; free old buffer"]
        F --> G
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Trivially Relocatable Types, <code>realloc</code>, and Page Table Remapping</div>
        <p>In C++, <code>std::vector</code> cannot blindly call C's <code>realloc()</code> on arbitrary objects because C++ types may contain internal self-referential pointers (such as <code>std::string</code>'s Small String Optimization buffer pointer in <code>libstdc++</code>). However, if a type is <em>trivially copyable</em> (or marked <code>FollyIsRelocatable</code>), expansion uses vectorized AVX-512 <code>memcpy</code> at L1/DRAM bandwidth speeds. Even better, when a dynamic array exceeds the <code>mmap</code> threshold (typically 128 KB in <code>glibc ptmalloc</code>), calling <code>mremap()</code> on Linux grows the allocation in $O(1)$ physical memory operations by simply rewiring virtual page table entries (PTEs) to a new virtual address range without copying a single byte of physical DRAM!</p>
      </div>

      <div class="simulator-mount" data-sim="sim-dynamic-array-amortized"></div>

      <h3>Production Implementation: Aligned 1.5× Vector with Strong Exception Guarantee</h3>
      <pre><code class="language-cpp">#include &lt;cstdlib&gt;
#include &lt;cstring&gt;
#include &lt;memory&gt;
#include &lt;new&gt;
#include &lt;type_traits&gt;
#include &lt;utility&gt;

template &lt;typename T&gt;
class FbStyleVector {
  T* data_ = nullptr;
  std::size_t size_ = 0;
  std::size_t cap_ = 0;

  static std::size_t next_capacity(std::size_t current) noexcept {
    if (current == 0) return 4;
    if (current &lt; 64) return current * 2;
    // 1.5x growth (k = 1.5 &lt; phi) enables coalesced heap reuse
    return current + (current &gt;&gt; 1);
  }

  void grow() {
    const std::size_t new_cap = next_capacity(cap_);
    T* new_data = static_cast&lt;T*&gt;(::operator new(new_cap * sizeof(T), std::align_val_t{alignof(T)}));

    if constexpr (std::is_trivially_copyable_v&lt;T&gt;) {
      if (size_ &gt; 0) {
        std::memcpy(new_data, data_, size_ * sizeof(T));
      }
    } else if constexpr (std::is_nothrow_move_constructible_v&lt;T&gt;) {
      std::uninitialized_move_n(data_, size_, new_data);
      std::destroy_n(data_, size_);
    } else {
      // Strong exception guarantee: copy first; if an exception is thrown,
      // destroy already-copied elements in new_data and leave data_ intact.
      std::size_t constructed = 0;
      try {
        for (; constructed &lt; size_; ++constructed) {
          std::construct_at(new_data + constructed, data_[constructed]);
        }
      } catch (...) {
        std::destroy_n(new_data, constructed);
        ::operator delete(new_data, std::align_val_t{alignof(T)});
        throw;
      }
      std::destroy_n(data_, size_);
    }

    if (data_) {
      ::operator delete(data_, std::align_val_t{alignof(T)});
    }
    data_ = new_data;
    cap_ = new_cap;
  }

public:
  void push_back(const T&amp; value) {
    if (size_ == cap_) grow();
    std::construct_at(data_ + size_, value);
    ++size_;
  }

  std::size_t size() const noexcept { return size_; }
  std::size_t capacity() const noexcept { return cap_; }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Missing <code>noexcept</code> on Move Constructors &amp; Reference Invalidation</div>
        <p>Two bugs routinely cripple C++ <code>std::vector</code> performance and safety in production:</p>
        <ol>
          <li><strong>Missing <code>noexcept</code> on custom Move Constructors:</strong> Because <code>std::vector::push_back</code> guarantees the <em>Strong Exception Guarantee</em> (if reallocation fails partway, the vector remains unchanged), <code>std::move_if_noexcept</code> refuses to call a throwing move constructor during resize—falling back to deep copy construction of every element! Always mark move constructors and move assignment operators <code>noexcept</code>.</li>
          <li><strong>Self-Aliasing in <code>v.push_back(v[0])</code>:</strong> If <code>size == capacity</code>, reallocating must construct the new element <em>before</em> freeing the old buffer, or passing an element reference from inside the vector itself will read from freed memory (use-after-free).</li>
        </ol>
      </div>
    `,
    keyTakeaways: [
      "Geometric growth by factor k > 1 bounds total copies over N appends to kN/(k - 1), achieving O(1) amortized append time.",
      "A 2x growth factor guarantees that the newly requested allocation is strictly larger than the sum of all previously freed buffers (2^m > 2^m - 1), preventing in-arena coalesced reuse.",
      "Any growth factor k < phi (approx 1.618), such as k = 1.5, allows the allocator to satisfy future expansions by coalescing the vector's own previously freed memory chunks.",
      "In C++, std::vector only moves elements during reallocation if the element's move constructor is marked noexcept; otherwise it falls back to O(N) deep copies to preserve the Strong Exception Guarantee."
    ],
    furtherReading: [
      {
        title: "Meta Engineering: folly/docs/FBVector.md — Growth Factor and Memory Reuse Analysis",
        url: "https://github.com/facebook/folly/blob/main/folly/docs/FBVector.md",
        type: "Engineering Documentation"
      },
      {
        title: "MIT 6.006 Introduction to Algorithms: Dynamic Arrays and Amortized Analysis",
        url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
        type: "University Courseware"
      },
      {
        title: "Thomas H. Cormen et al. — Introduction to Algorithms (CLRS), Chapter 17: Amortized Analysis",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
        type: "Textbook"
      }
    ]
  },

  "prefix-sums-difference-arrays": {
    title: "1D/2D Prefix Sums & Difference Arrays for O(1) Range Updates",
    video: {
      youtubeId: "PhgtNY_-CiY",
      id: "PhgtNY_-CiY",
      url: "https://www.youtube.com/embed/PhgtNY_-CiY",
      id: "PhgtNY_-CiY",
      url: "https://www.youtube.com/embed/PhgtNY_-CiY",
      title: "Prefix Sums — Problems, Invariants & Implementation in C++ and Python",
      channel: "Errichto Algorithms",
      duration: "14 min"
    },
    intuition: "Prefix sums and difference arrays are discrete analogs of integration and differentiation. Just as the Fundamental Theorem of Calculus evaluates a definite integral $\\int_a^b f(x)\\,dx = F(b) - F(a)$ in two evaluations at the boundaries, a prefix sum array answers arbitrary contiguous range-sum queries in $O(1)$ time, while its dual—the difference array—transforms $O(N)$ range-addition updates into two $O(1)$ boundary point mutations.",
    content: `
      <h3>The Discrete Fundamental Theorem of Calculus</h3>
      <p>Given an array $A[0 \\dots N-1]$ over an abelian group (such as $(\\mathbb{Z}, +)$ or bitvectors under $\\oplus$), define the 1-indexed prefix sum array $P[0 \\dots N]$ with sentinel $P[0] = 0$ and recurrence $P[i] = P[i-1] + A[i-1]$ for $1 \\le i \\le N$. Any contiguous range sum over the inclusive 0-indexed interval $[L, R]$ reduces to a single subtraction:</p>
      <p>$$\\sum_{k=L}^{R} A[k] = P[R + 1] - P[L]$$</p>
      <p>Notice why the $N+1$ length with sentinel $P[0] = 0$ is mandatory in clean systems code: it eliminates the branch <code>if (L == 0)</code> on every query. Conversely, define the <strong>Difference Array</strong> (discrete derivative) $D[0 \\dots N]$ where $D[0] = A[0]$ and $D[i] = A[i] - A[i-1]$ for $1 \\le i &lt; N$. The prefix sum of $D$ reconstructs $A$:</p>
      <p>$$A[i] = \\sum_{k=0}^{i} D[k]$$</p>
      <p>Because every element $A[i]$ for $i \\in [L, R]$ includes $D[L]$ in its prefix sum, adding a scalar $\\Delta$ to the entire subarray $A[L \\dots R]$ only modifies two adjacent boundaries in $D$: $D[L] \\mathrel{+}= \\Delta$ and $D[R+1] \\mathrel{-}= \\Delta$.</p>

      <div class="invariant-box">
        <div class="invariant-title">Mathematical Invariant: 2D Inclusion-Exclusion &amp; 4-Corner Differential Stencils</div>
        <p>In two dimensions, given matrix $A[0 \\dots R-1][0 \\dots C-1]$, the 1-indexed 2D prefix sum $P[r][c]$ stores the sum of the subgrid $[0 \\dots r-1] \\times [0 \\dots c-1]$. By the Principle of Inclusion-Exclusion:</p>
        <p>$$P[r][c] = A[r-1][c-1] + P[r-1][c] + P[r][c-1] - P[r-1][c-1]$$</p>
        <p>Querying any subrectangle $[r_1, r_2] \\times [c_1, c_2]$ takes $O(1)$ time via four table lookups:</p>
        <p>$$\\text{Sum}(r_1, c_1, r_2, c_2) = P[r_2+1][c_2+1] - P[r_1][c_2+1] - P[r_2+1][c_1] + P[r_1][c_1]$$</p>
        <p>Dually, adding $\\Delta$ to every cell in $[r_1, r_2] \\times [c_1, c_2]$ of a 2D difference array $D$ updates 4 corners in $O(1)$: $D[r_1][c_1] \\mathrel{+}= \\Delta$, $D[r_1][c_2+1] \\mathrel{-}= \\Delta$, $D[r_2+1][c_1] \\mathrel{-}= \\Delta$, and $D[r_2+1][c_2+1] \\mathrel{+}= \\Delta$.</p>
      </div>

      <h3>Trade-off Matrix: Static vs. Batched vs. Dynamic Range Operations</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Structure</th>
            <th>Precomputation</th>
            <th>Range Sum Query $[L, R]$</th>
            <th>Range Add Update $[L, R] + \\Delta$</th>
            <th>Point Query $A[i]$</th>
            <th>Ideal Workload Profile</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Raw Array $A$</td>
            <td>$O(1)$</td>
            <td>$O(N)$</td>
            <td>$O(N)$</td>
            <td>$O(1)$</td>
            <td>Point reads and point writes only</td>
          </tr>
          <tr>
            <td>1D / 2D Prefix Sum $P$</td>
            <td>$O(N)$ / $O(RC)$</td>
            <td>$O(1)$</td>
            <td>$O(N)$ (rebuilds $P$)</td>
            <td>$O(1)$</td>
            <td>Immutable array, millions of range queries</td>
          </tr>
          <tr>
            <td>Difference Array $D$</td>
            <td>$O(N)$ / $O(RC)$</td>
            <td>$O(N)$ (after reconstruction)</td>
            <td>$O(1)$</td>
            <td>$O(N)$ online / $O(1)$ offline</td>
            <td>Batched offline range updates, then readout</td>
          </tr>
          <tr>
            <td>Fenwick Tree (BIT)</td>
            <td>$O(N)$</td>
            <td>$O(\\log N)$</td>
            <td>$O(\\log N)$ (with 2 BITs)</td>
            <td>$O(\\log N)$</td>
            <td>Interleaved online updates and queries</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing 2D Inclusion-Exclusion &amp; Difference Array Boundaries</h3>
      <svg viewBox="0 0 760 225" width="100%" height="auto" role="img" aria-label="2D Prefix Sum Inclusion-Exclusion and 1D Difference Array">
        <style>
          .pf-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .pf-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .pf-grid { fill: none; stroke: currentColor; stroke-opacity: 0.3; stroke-width: 1; }
          .pf-overlap { fill: rgba(245, 158, 11, 0.28); stroke: #f59e0b; stroke-width: 1.5; }
          .pf-sub { fill: rgba(239, 68, 68, 0.2); stroke: #ef4444; stroke-width: 1.5; }
          .pf-target { fill: rgba(16, 185, 129, 0.3); stroke: #10b981; stroke-width: 2; }
          .pf-node { fill: rgba(59, 130, 246, 0.18); stroke: #3b82f6; stroke-width: 1.5; }
        </style>
        <text x="15" y="22" class="pf-title">2D Prefix Sum: Sum(r1,c1, r2,c2) = P[r2+1][c2+1] - Top - Left + Corner</text>
        <rect x="20" y="36" width="110" height="75" class="pf-overlap"/>
        <text x="75" y="76" text-anchor="middle" class="pf-txt">+P[r1][c1]</text>
        <text x="75" y="92" text-anchor="middle" class="pf-txt">(Subtracted 2x)</text>

        <rect x="130" y="36" width="140" height="75" class="pf-sub"/>
        <text x="200" y="78" text-anchor="middle" class="pf-txt">-P[r1][c2+1] (Top)</text>

        <rect x="20" y="111" width="110" height="90" class="pf-sub"/>
        <text x="75" y="160" text-anchor="middle" class="pf-txt">-P[r2+1][c1]</text>

        <rect x="130" y="111" width="140" height="90" class="pf-target"/>
        <text x="200" y="154" text-anchor="middle" class="pf-txt">Target Subgrid</text>
        <text x="200" y="170" text-anchor="middle" class="pf-txt">[r1..r2] x [c1..c2]</text>

        <text x="330" y="22" class="pf-title">1D Difference Array: Add +5 to Range [L=1, R=3]</text>
        <text x="330" y="55" class="pf-txt">Diff D[]:</text>
        <rect x="405" y="36" width="52" height="30" rx="3" class="pf-grid"/>
        <text x="431" y="55" text-anchor="middle" class="pf-txt">0</text>
        <rect x="463" y="36" width="52" height="30" rx="3" class="pf-target"/>
        <text x="489" y="55" text-anchor="middle" class="pf-txt">+5 (L)</text>
        <rect x="521" y="36" width="52" height="30" rx="3" class="pf-grid"/>
        <text x="547" y="55" text-anchor="middle" class="pf-txt">0</text>
        <rect x="579" y="36" width="52" height="30" rx="3" class="pf-grid"/>
        <text x="605" y="55" text-anchor="middle" class="pf-txt">0</text>
        <rect x="637" y="36" width="64" height="30" rx="3" class="pf-sub"/>
        <text x="669" y="55" text-anchor="middle" class="pf-txt">-5 (R+1)</text>

        <text x="330" y="118" class="pf-txt">Prefix(D):</text>
        <rect x="405" y="99" width="52" height="30" rx="3" class="pf-grid"/>
        <text x="431" y="118" text-anchor="middle" class="pf-txt">0</text>
        <rect x="463" y="99" width="52" height="30" rx="3" class="pf-node"/>
        <text x="489" y="118" text-anchor="middle" class="pf-txt">5</text>
        <rect x="521" y="99" width="52" height="30" rx="3" class="pf-node"/>
        <text x="547" y="118" text-anchor="middle" class="pf-txt">5</text>
        <rect x="579" y="99" width="52" height="30" rx="3" class="pf-node"/>
        <text x="605" y="118" text-anchor="middle" class="pf-txt">5</text>
        <rect x="637" y="99" width="64" height="30" rx="3" class="pf-grid"/>
        <text x="669" y="118" text-anchor="middle" class="pf-txt">0</text>

        <text x="330" y="165" class="pf-txt">2D Diff Stencil for [r1..r2, c1..c2]:</text>
        <text x="330" y="185" class="pf-txt">D[r1][c1] += d,  D[r1][c2+1] -= d,  D[r2+1][c1] -= d,  D[r2+1][c2+1] += d</text>
      </svg>

      <h3>Prefix Sum + Hash Map Pattern for Subarray Sum Equals $K$</h3>
      <div class="mermaid">
      flowchart LR
        A["Iterate j = 0 .. N-1<br/>running_sum += A[j]"] --> B["Need P[j+1] - P[i] == K<br/>iff P[i] == running_sum - K"]
        B --> C{"Is (running_sum - K)<br/>in freq_map?"}
        C -- "Yes" --> D["count += freq_map[running_sum - K]"]
        C -- "No" --> E["freq_map[running_sum]++"]
        D --> E
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: SIMD Prefix Sums (Hillis-Steele Scan) &amp; Flat 2D Row-Major Storage</div>
        <p>At first glance, the recurrence $P[i] = P[i-1] + A[i]$ looks inherently serial due to its loop-carried dependency of distance 1. However, because integer addition is associative, modern CPUs and GPUs compute prefix sums using the <strong>Hillis-Steele / Blelloch parallel scan</strong> inside SIMD registers: within a 256-bit AVX2 register holding eight 32-bit integers, three shift-and-add steps (<code>_mm256_slli_si256</code> + <code>_mm256_add_epi32</code> by 1, 2, and 4 lanes) compute the prefix sum of 8 elements in $O(\\log_2 W)$ instructions. Furthermore, in 2D prefix sums, never allocate a jagged <code>std::vector&lt;std::vector&lt;int64_t&gt;&gt;</code>; each row is a separate heap allocation that causes L1 TLB misses when reading $P[r-1][c]$. Flatten the matrix into a single contiguous array of length $(R+1)(C+1)$ indexed via <code>r * (C + 1) + c</code>.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-prefix-diff-kadane"></div>

      <h3>Production Implementation: Contiguous 2D Prefix Sum &amp; 2D Difference Stencil</h3>
      <pre><code class="language-cpp">#include &lt;cstdint&gt;
#include &lt;vector&gt;

class FlatGrid2D {
  std::size_t rows_;
  std::size_t cols_;
  std::vector&lt;std::int64_t&gt; data_; // (rows_ + 1) * (cols_ + 2) for safe sentinel padding

  std::size_t idx(std::size_t r, std::size_t c) const noexcept {
    return r * (cols_ + 2) + c;
  }

public:
  FlatGrid2D(std::size_t rows, std::size_t cols)
      : rows_(rows), cols_(cols), data_((rows + 2) * (cols + 2), 0) {}

  // O(1) 2D Difference Array range update on 0-indexed inclusive [r1..r2] x [c1..c2]
  void range_add(std::size_t r1, std::size_t c1, std::size_t r2, std::size_t c2, std::int64_t delta) noexcept {
    // Shift to 1-indexed internal coordinates
    ++r1; ++c1; ++r2; ++c2;
    data_[idx(r1, c1)]         += delta;
    data_[idx(r1, c2 + 1)]     -= delta;
    data_[idx(r2 + 1, c1)]     -= delta;
    data_[idx(r2 + 1, c2 + 1)] += delta;
  }

  // O(R * C) in-place 2D prefix sum reconstruction (call once to materialize values,
  // or twice to turn a 2D difference array directly into a 2D prefix sum query table!)
  void materialize_prefix_sums() noexcept {
    for (std::size_t r = 1; r &lt;= rows_; ++r) {
      for (std::size_t c = 1; c &lt;= cols_; ++c) {
        data_[idx(r, c)] += data_[idx(r - 1, c)]
                          + data_[idx(r, c - 1)]
                          - data_[idx(r - 1, c - 1)];
      }
    }
  }

  // O(1) subrectangle sum query on 0-indexed inclusive [r1..r2] x [c1..c2]
  // Prerequisite: data_ holds 2D prefix sums
  std::int64_t query_rect(std::size_t r1, std::size_t c1, std::size_t r2, std::size_t c2) const noexcept {
    return data_[idx(r2 + 1, c2 + 1)]
         - data_[idx(r1,     c2 + 1)]
         - data_[idx(r2 + 1, c1)]
         + data_[idx(r1,     c1)];
  }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: 32-Bit Signed Overflow &amp; Non-Invertible Operations</div>
        <p>Even when input array elements fit comfortably inside 32-bit signed integers ($|A[i]| \\le 10^9$), a prefix sum over $N = 10^5$ elements reaches $10^{14}$, overflowing <code>int32_t</code> (max $\\approx 2.14 \\times 10^9$) and invoking Undefined Behavior in C/C++. Always widen prefix sum accumulators to <code>int64_t</code>. Additionally, remember that prefix queries require an <strong>invertible binary operation</strong> (an abelian group like $+$ with inverse $-$, or $\\oplus$ with self-inverse $\\oplus$). You <em>cannot</em> use prefix arrays for range minimum/maximum or $\\gcd$ queries because $\\min$ and $\\gcd$ lack inverse elements—use a Sparse Table or Segment Tree instead.</p>
      </div>
    `,
    keyTakeaways: [
      "Always allocate 1D prefix sums with size N + 1 and sentinel P[0] = 0 (and 2D prefix sums with (R + 1) x (C + 1)) to eliminate boundary branches during range queries.",
      "A difference array turns O(N) range additions on [L, R] into two O(1) point updates: D[L] += delta and D[R + 1] -= delta.",
      "In 2D, subgrid range additions update 4 corners of the 2D difference array in O(1), and subgrid sum queries combine 4 corners of the 2D prefix table via Inclusion-Exclusion.",
      "Prefix queries require an invertible group operation (like addition or XOR); idempotent operations like min, max, or GCD cannot be inverted across prefix boundaries."
    ],
    furtherReading: [
      {
        title: "Guy E. Blelloch — Prefix Sums and Their Applications (CMU Technical Report CMU-CS-90-190)",
        url: "https://www.cs.cmu.edu/~guyb/papers/Ble93.pdf",
        type: "Seminal Paper"
      },
      {
        title: "CP-Algorithms: Prefix Sums and 2D Inclusion-Exclusion",
        url: "https://cp-algorithms.com/",
        type: "Algorithm Reference"
      },
      {
        title: "USACO Guide — Silver: Introduction to Prefix Sums & 2D Prefix Sums",
        url: "https://usaco.guide/silver/prefix-sums",
        type: "Competitive Programming Reference"
      }
    ]
  },

  "two-pointers-invariant-proofs": {
    title: "Two-Pointer Invariants: Converging, Fast-Slow & Dutch National Flag",
    video: {
      youtubeId: "4xbWSRZHqac",
      id: "4xbWSRZHqac",
      url: "https://www.youtube.com/embed/4xbWSRZHqac",
      title: "Dutch National Flag & 3-Way Partitioning Two-Pointer Invariants",
      channel: "NeetCode",
      duration: "11:24",
      start: 0,
      length: "11m",
      why: "Deep-dive lecture covering Two-Pointer Invariants: Converging, Fast-Slow & Dutch National Flag."
    },
    intuition: "A two-pointer algorithm replaces an $O(N^2)$ nested loop over index pairs $(i, j)$ with an $O(N)$ linear progression by exploiting a monotonicity or partitioning invariant: every time a pointer advances by 1 step, it eliminates an entire row or column of the $(i, j)$ search matrix, or narrows the unclassified gap $[\\text{mid} \\dots \\text{high}]$ by exactly one element.",
    content: `
      <h3>Eliminating Rows and Columns in the Pair Search Matrix</h3>
      <p>Why does the converging two-pointer algorithm for sorted 2-Sum ($A[L] + A[R] = T$) never miss a valid pair? Visualize all possible index pairs $(L, R)$ with $0 \\le L &lt; R &lt; N$ as an upper-triangular grid inside an $N \\times N$ matrix, starting at the top-right corner $(L = 0, R = N - 1)$:</p>
      <ul>
        <li>If $A[L] + A[R] &lt; T$, since the array is sorted ($A[k] \\le A[R]$ for all $k &lt; R$), pairing the current $L$ with <em>any</em> smaller right index $k &lt; R$ yields $A[L] + A[k] \\le A[L] + A[R] &lt; T$. Thus the <strong>entire row $L$</strong> is provably invalid, and incrementing $L \\leftarrow L + 1$ safely discards $R - L$ pairs in $O(1)$ time.</li>
        <li>If $A[L] + A[R] &gt; T$, since $A[k] \\ge A[L]$ for all $k &gt; L$, pairing the current $R$ with <em>any</em> larger left index $k &gt; L$ yields $A[k] + A[R] \\ge A[L] + A[R] &gt; T$. Thus the <strong>entire column $R$</strong> is provably invalid, and decrementing $R \\leftarrow R - 1$ safely discards $R - L$ pairs in $O(1)$ time.</li>
      </ul>
      <p>The exact same pruning proof governs the <strong>Container With Most Water</strong> problem ($\\max (R - L) \\cdot \\min(H[L], H[R])$): if $H[L] \\le H[R]$, then for every $k \\in (L, R)$, the width $(k - L) &lt; (R - L)$ and the height $\\min(H[L], H[k]) \\le H[L] = \\min(H[L], H[R])$. Therefore, $L$ can never form a larger container with any $k &lt; R$, justifying $L \\leftarrow L + 1$.</p>

      <div class="invariant-box">
        <div class="invariant-title">Loop Invariant: Edsger Dijkstra's 3-Way Dutch National Flag Partition</div>
        <p>To partition an array $A[0 \\dots N-1]$ around a pivot $p$ into three contiguous regions ($&lt; p$, $== p$, and $&gt; p$) in a single $O(N)$ pass with $O(1)$ auxiliary space, maintain three pointers $\\text{low}$, $\\text{mid}$, and $\\text{high}$ satisfying the four-region loop invariant at the start of every iteration:</p>
        <ol>
          <li>$\\forall k \\in [0, \\text{low} - 1]: A[k] &lt; p$ (strictly less than pivot)</li>
          <li>$\\forall k \\in [\\text{low}, \\text{mid} - 1]: A[k] == p$ (equal to pivot)</li>
          <li>$\\forall k \\in [\\text{mid}, \\text{high}]: A[k]$ is <strong>unclassified / unknown</strong></li>
          <li>$\\forall k \\in [\\text{high} + 1, N - 1]: A[k] &gt; p$ (strictly greater than pivot)</li>
        </ol>
        <p><strong>Potential Function (Termination Proof):</strong> Define $\\Phi = \\text{high} - \\text{mid} + 1$, the size of the unclassified region. Initially $\\text{low} = 0, \\text{mid} = 0, \\text{high} = N - 1$, so $\\Phi = N$ and regions 1, 2, and 4 are vacuously empty. Each step inspects $A[\\text{mid}]$ and either increments $\\text{mid}$ or decrements $\\text{high}$, strictly decreasing $\\Phi$ by 1 until $\\Phi = 0$ ($\\text{mid} &gt; \\text{high}$), terminating in exactly $N$ comparisons.</p>
      </div>

      <h3>Taxonomy of Multi-Pointer Paradigms</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Paradigm</th>
            <th>Pointer Geometry</th>
            <th>Core Loop Invariant</th>
            <th>Time / Space</th>
            <th>Canonical Problems</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Converging Pointers</td>
            <td>$L = 0 \\to \\leftarrow R = N - 1$</td>
            <td>All pairs outside $[L, R]$ have been provably pruned</td>
            <td>$O(N)$ / $O(1)$</td>
            <td>Sorted 2-Sum, 3-Sum, Container With Most Water, Trapping Rain Water</td>
          </tr>
          <tr>
            <td>Reader / Writer Compaction</td>
            <td>$0 \\le \\text{write} \\le \\text{read} &lt; N$</td>
            <td>$A[0 \\dots \\text{write}-1]$ contains compacted valid prefix of $A[0 \\dots \\text{read}-1]$</td>
            <td>$O(N)$ / $O(1)$</td>
            <td><code>std::remove_if</code>, Dedup Sorted Array, Move Zeroes</td>
          </tr>
          <tr>
            <td>3-Way Partition (DNF)</td>
            <td>$0 \\le \\text{low} \\le \\text{mid} \\le \\text{high}+1 \\le N$</td>
            <td>4 regions: $[0..\\text{low}), [\\text{low}..\\text{mid}), [\\text{mid}..\\text{high}], (\\text{high}..N)$</td>
            <td>$O(N)$ / $O(1)$</td>
            <td>Sort Colors (0/1/2), Quicksort 3-Way Partition (duplicate keys)</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing Dijkstra's 4-Region Dutch National Flag State</h3>
      <svg viewBox="0 0 760 175" width="100%" height="auto" role="img" aria-label="Dutch National Flag 4-region loop invariant diagram">
        <style>
          .dnf-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .dnf-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .dnf-lt { fill: rgba(239, 68, 68, 0.22); stroke: #ef4444; stroke-width: 1.5; }
          .dnf-eq { fill: rgba(245, 158, 11, 0.22); stroke: #f59e0b; stroke-width: 1.5; }
          .dnf-unk { fill: rgba(148, 163, 184, 0.16); stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 4 2; }
          .dnf-gt { fill: rgba(59, 130, 246, 0.22); stroke: #3b82f6; stroke-width: 1.5; }
        </style>
        <text x="15" y="24" class="dnf-title">Dutch National Flag Invariant at Start of Every Loop Step (Termination when mid &gt; high)</text>

        <rect x="15" y="42" width="175" height="50" rx="3" class="dnf-lt"/>
        <text x="102" y="64" text-anchor="middle" class="dnf-txt">A[0 .. low-1]</text>
        <text x="102" y="80" text-anchor="middle" class="dnf-txt">Strictly &lt; pivot</text>

        <rect x="194" y="42" width="180" height="50" rx="3" class="dnf-eq"/>
        <text x="284" y="64" text-anchor="middle" class="dnf-txt">A[low .. mid-1]</text>
        <text x="284" y="80" text-anchor="middle" class="dnf-txt">Equal == pivot</text>

        <rect x="378" y="42" width="190" height="50" rx="3" class="dnf-unk"/>
        <text x="473" y="64" text-anchor="middle" class="dnf-txt">A[mid .. high]</text>
        <text x="473" y="80" text-anchor="middle" class="dnf-txt">Unclassified (?)</text>

        <rect x="572" y="42" width="170" height="50" rx="3" class="dnf-gt"/>
        <text x="657" y="64" text-anchor="middle" class="dnf-txt">A[high+1 .. N-1]</text>
        <text x="657" y="80" text-anchor="middle" class="dnf-txt">Strictly &gt; pivot</text>

        <text x="15" y="118" class="dnf-txt">^ 0</text>
        <text x="194" y="118" class="dnf-txt">^ low</text>
        <text x="378" y="118" class="dnf-txt">^ mid (inspect)</text>
        <text x="530" y="118" class="dnf-txt">high ^</text>
        <text x="705" y="118" class="dnf-txt">N-1 ^</text>

        <text x="15" y="152" class="dnf-txt">Why mid++ on swap(low, mid) but NOT on swap(mid, high)? Because A[low] is known (== pivot), whereas A[high] was unclassified!</text>
      </svg>

      <h3>Dutch National Flag State Transitions</h3>
      <div class="mermaid">
      flowchart TD
        A["Inspect A[mid]<br/>while mid <= high"] --> B{"Compare A[mid]<br/>with pivot p"}
        B -- "A[mid] < p" --> C["swap(A[low], A[mid])<br/>low++, mid++"]
        B -- "A[mid] == p" --> D["mid++"]
        B -- "A[mid] > p" --> E["swap(A[mid], A[high])<br/>high-- (DO NOT increment mid!)"]
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Hardware Prefetchers Love Bidirectional Sequential Streams</div>
        <p>Modern x86-64 (Intel Golden Cove / AMD Zen 4) and ARM Neoverse L2 stream prefetchers track both ascending (+1 stride) and descending (-1 stride) memory accesses per 4 KB page independently. Consequently, converging two-pointer scans ($L$ moving up from $0$, $R$ moving down from $N-1$) sustain near-100% L1 data cache hit rates. However, inside the Dutch National Flag loop, the 3-way branch on random data causes ~50% branch misprediction penalties (15–20 cycles per mispredict). High-performance sorting libraries (such as <code>pdqsort</code>, Pattern-Defeating Quicksort in Rust's standard library) eliminate this branch bottleneck using <strong>BlockQuicksort</strong>: evaluating comparisons into small branchless offset buffers via conditional moves (<code>cmov</code>) before executing a tight swap loop.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-two-pointers-window"></div>

      <h3>Production Implementation: Dijkstra's 3-Way Partition &amp; O(1)-Space Trapping Rain Water</h3>
      <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

// Returns {low, high} bounds of the equal-to-pivot range [low .. high]
template &lt;typename T&gt;
std::pair&lt;std::size_t, std::size_t&gt; dutch_flag_partition(std::vector&lt;T&gt;&amp; a, const T&amp; pivot) noexcept {
  if (a.empty()) return {0, 0};
  std::size_t low = 0;
  std::size_t mid = 0;
  std::size_t high = a.size(); // Use half-open [mid, high) to avoid unsigned underflow!

  while (mid &lt; high) {
    if (a[mid] &lt; pivot) {
      std::swap(a[low], a[mid]);
      ++low;
      ++mid;
    } else if (a[mid] == pivot) {
      ++mid;
    } else {
      --high;
      std::swap(a[mid], a[high]);
      // Critical: do NOT increment mid; the element swapped from a[high] is unclassified!
    }
  }
  return {low, high};
}

// O(N) Time, O(1) Space Converging Two-Pointer Trapping Rain Water
// Invariant: if height[left] <= height[right], then max_left <= max_right (or height[right]
// acts as a guaranteed right-hand wall >= height[left]), so water at left is bounded
// exclusively by max_left.
std::int64_t trap_rain_water(const std::vector&lt;int&gt;&amp; height) noexcept {
  if (height.size() &lt; 3) return 0;
  std::size_t left = 0, right = height.size() - 1;
  int max_left = height[left], max_right = height[right];
  std::int64_t trapped = 0;

  while (left &lt; right) {
    if (max_left &lt;= max_right) {
      ++left;
      max_left = std::max(max_left, height[left]);
      trapped += (max_left - height[left]);
    } else {
      --right;
      max_right = std::max(max_right, height[right]);
      trapped += (max_right - height[right]);
    }
  }
  return trapped;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Incrementing <code>mid</code> After Swapping with <code>high</code> &amp; Unsigned Underflow</div>
        <p>In the Dutch National Flag partition, the #1 bug is incrementing <code>mid</code> in the <code>A[mid] &gt; pivot</code> branch after <code>swap(A[mid], A[high])</code>. When you swap <code>A[low]</code> and <code>A[mid]</code>, you already know <code>A[low] == pivot</code> (unless <code>low == mid</code>), so <code>mid</code> can safely advance. When you swap <code>A[mid]</code> and <code>A[high]</code>, the value coming from <code>A[high]</code> was inside the <em>unclassified</em> region—incrementing <code>mid</code> skips inspecting it! Furthermore, if <code>high</code> is a <code>size_t</code> initialized to <code>N - 1</code> and every element exceeds the pivot, <code>--high</code> underflows to <code>SIZE_MAX</code>. Always maintain the unclassified region as a half-open interval <code>[mid, high)</code> where <code>high</code> starts at <code>N</code>.</p>
      </div>
    `,
    keyTakeaways: [
      "Converging two-pointer algorithms run in O(N) by proving that each step eliminates an entire row or column of the N x N pair search matrix.",
      "Dijkstra's 3-way Dutch National Flag partition maintains four contiguous regions: [0..low) < p, [low..mid) == p, [mid..high) unclassified, and [high..N) > p.",
      "When swapping A[mid] with the unclassified element at the high boundary, never increment mid—the incoming element has not yet been compared against the pivot.",
      "Use a half-open unclassified boundary [mid, high) with high initialized to N to prevent unsigned integer underflow when all elements exceed the pivot."
    ],
    furtherReading: [
      {
        title: "Edsger W. Dijkstra — A Discipline of Programming, Chapter 14: The Problem of the Dutch National Flag",
        url: "https://www.cs.utexas.edu/~EWD/",
        type: "Seminal Book"
      },
      {
        title: "Jon Bentley & M. Douglas McIlroy — Engineering a Sort Function (3-Way Partitioning, Software: Practice and Experience, 1993)",
        url: "https://dl.acm.org/doi/10.1002/spe.4380231105",
        type: "Seminal Paper"
      },
      {
        title: "Orson Peters — Pattern-Defeating Quicksort (pdqsort) & BlockQuicksort Branchless Partitioning",
        url: "https://arxiv.org/abs/2106.05123",
        type: "Research Paper"
      }
    ]
  },

  "sliding-window-monotonicity": {
    title: "Fixed & Variable Sliding Windows: Monotonicity & Two-Pointer Validity",
    video: {
      youtubeId: "MK-NZ4hN7rs",
      id: "MK-NZ4hN7rs",
      url: "https://www.youtube.com/embed/MK-NZ4hN7rs",
      id: "MK-NZ4hN7rs",
      url: "https://www.youtube.com/embed/MK-NZ4hN7rs",
      title: "Sliding Window Technique — Algorithmic Mental Models & Monotonicity",
      channel: "Ryan Schachte",
      duration: "45 min"
    },
    intuition: "A variable-size sliding window $[L, R]$ achieves $O(N)$ time if and only if the validity predicate $P(L, R)$ is monotonic with respect to window expansion and contraction—guaranteeing that the optimal left boundary $L^*(R)$ is a non-decreasing function of $R$, so $L$ and $R$ never need to move backward.",
    content: `
      <h3>When Is a Sliding Window Mathematically Valid?</h3>
      <p>Given an array $A[0 \\dots N-1]$ and a validity predicate $P(L, R) \\in \\{\\text{true}, \\text{false}\\}$ defined on contiguous subarrays $A[L \\dots R]$, a variable sliding window advances $R$ from $0$ to $N-1$ and increments $L$ while maintaining validity. For this algorithm to be correct without ever backtracking $L$, the predicate $P$ must be <strong>hereditary (monotonic under inclusion)</strong>:</p>
      <p>$$[L', R'] \\subseteq [L, R] \\text{ and } P(L, R) = \\text{true} \\implies P(L', R') = \\text{true}$$</p>
      <p>Equivalently, by contraposition: if $[L, R]$ violates the constraint ($P(L, R) = \\text{false}$), then any super-interval $[L, R']$ with $R' &gt; R$ also violates the constraint, and any sub-interval $[L', R]$ with $L' &gt; L$ moves closer to satisfying it. Define $L^*(R)$ as the smallest index $L$ (for longest valid window) or largest index $L$ (for shortest valid window) paired with right endpoint $R$. Monotonicity guarantees:</p>
      <p>$$R_1 &lt; R_2 \\implies L^*(R_1) \\le L^*(R_2)$$</p>
      <p>Because both $L$ and $R$ start at $0$, only increment, and never exceed $N$, the inner <code>while</code> loop executes at most $N$ times <strong>across the entire run of the outer loop</strong>, proving an exact bound of at most $2N$ pointer steps ($O(1)$ amortized work per element).</p>

      <div class="invariant-box">
        <div class="invariant-title">Architectural Invariant: The "Exactly $K$" Reduction via $\\text{atMost}(K) - \\text{atMost}(K - 1)$</div>
        <p>Suppose we want to count the number of subarrays with <strong>exactly $K$</strong> distinct elements (or sum $= K$ over binary/non-negative arrays). A naive single sliding window fails because for a fixed $R$, there is not a single boundary $L$, but a whole contiguous range $[L_{\\text{min}}, L_{\\text{max}}]$ of valid left endpoints where the window has exactly $K$ distinct elements.</p>
        <p>However, the predicate $P_K(L, R) \\equiv (\\text{distinct}(A[L \\dots R]) \\le K)$ is strictly monotonic! For each $R$, once we shrink $L$ until $\\text{distinct}(A[L \\dots R]) \\le K$, <strong>every</strong> subarray starting at $i \\in [L, R]$ and ending at $R$ is a subset of $[L, R]$ and therefore also has $\\le K$ distinct elements—contributing exactly $(R - L + 1)$ valid subarrays ending at $R$. By set difference:</p>
        <p>$$\\text{countExactly}(K) = \\text{countAtMost}(K) - \\text{countAtMost}(K - 1)$$</p>
      </div>

      <h3>Sliding Window Archetypes &amp; Validity Conditions</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Window Archetype</th>
            <th>Monotonicity Prerequisite</th>
            <th>Inner Loop Condition</th>
            <th>State Update at Step $R$</th>
            <th>Failure Case (When It Breaks)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fixed Window of Size $K$</td>
            <td>Invertible or rolling aggregator</td>
            <td><code>if (R &gt;= K) remove(A[R - K])</code></td>
            <td><code>ans = best(ans, state)</code></td>
            <td>Non-invertible state without monotonic deque</td>
          </tr>
          <tr>
            <td>Longest Valid Window</td>
            <td>Expanding $R$ can only break validity; shrinking $L$ restores it</td>
            <td><code>while (!valid(L, R)) remove(A[L++])</code></td>
            <td><code>ans = max(ans, R - L + 1)</code> after loop</td>
            <td>Negative numbers in sum $\\le K$ (shrinking $L$ can increase sum!)</td>
          </tr>
          <tr>
            <td>Shortest Valid Window</td>
            <td>Expanding $R$ achieves validity; shrinking $L$ tests minimality</td>
            <td><code>while (valid(L, R)) { ans = min(..); remove(A[L++]); }</code></td>
            <td>Recorded inside inner <code>while</code> loop</td>
            <td>Negative numbers in sum $\\ge K$</td>
          </tr>
          <tr>
            <td>Count Exactly $K$</td>
            <td>Metric $f(L, R)$ is non-decreasing with window length</td>
            <td>Two calls: <code>atMost(K) - atMost(K - 1)</code></td>
            <td><code>total += (R - L + 1)</code> per $R$</td>
            <td>Non-monotonic metric (e.g. arbitrary signed sums)</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing Monotonic Frontier $L^*(R)$ &amp; The $\\text{atMost}(K)$ Counting Wedge</h3>
      <svg viewBox="0 0 760 190" width="100%" height="auto" role="img" aria-label="Sliding window monotonic frontier and atMost(K) subarray counting">
        <style>
          .sw-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .sw-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .sw-cell { fill: rgba(148, 163, 184, 0.12); stroke: currentColor; stroke-opacity: 0.3; stroke-width: 1; }
          .sw-win { fill: rgba(16, 185, 129, 0.22); stroke: #10b981; stroke-width: 2; }
          .sw-sub { fill: rgba(59, 130, 246, 0.2); stroke: #3b82f6; stroke-width: 1.5; }
        </style>
        <text x="15" y="24" class="sw-title">Once [L .. R] has &lt;= K distinct elements, all (R - L + 1) suffixes ending at R are also valid!</text>

        <rect x="15" y="42" width="75" height="36" rx="3" class="sw-cell"/>
        <text x="52" y="64" text-anchor="middle" class="sw-txt">idx 0</text>
        <rect x="95" y="42" width="75" height="36" rx="3" class="sw-cell"/>
        <text x="132" y="64" text-anchor="middle" class="sw-txt">idx 1</text>

        <rect x="175" y="38" width="395" height="44" rx="4" class="sw-win"/>
        <text x="212" y="64" text-anchor="middle" class="sw-txt">idx 2 (L)</text>
        <text x="292" y="64" text-anchor="middle" class="sw-txt">idx 3</text>
        <text x="372" y="64" text-anchor="middle" class="sw-txt">idx 4</text>
        <text x="452" y="64" text-anchor="middle" class="sw-txt">idx 5</text>
        <text x="532" y="64" text-anchor="middle" class="sw-txt">idx 6 (R)</text>

        <rect x="575" y="42" width="75" height="36" rx="3" class="sw-cell"/>
        <text x="612" y="64" text-anchor="middle" class="sw-txt">idx 7</text>

        <rect x="175" y="96" width="395" height="16" rx="2" class="sw-sub"/>
        <rect x="255" y="116" width="315" height="16" rx="2" class="sw-sub"/>
        <rect x="335" y="136" width="235" height="16" rx="2" class="sw-sub"/>
        <rect x="415" y="156" width="155" height="16" rx="2" class="sw-sub"/>
        <text x="582" y="138" class="sw-txt">&lt;-- R - L + 1 = 5 valid subarrays ending at R=6</text>
      </svg>

      <h3>Amortized Execution Flow of Variable Sliding Window</h3>
      <div class="mermaid">
      flowchart LR
        A["Advance R: 0 .. N-1<br/>Insert A[R] into window state"] --> B{"Is window [L..R]<br/>valid?"}
        B -- "No (Invalid)" --> C["Remove A[L] from state<br/>L++ (Monotonic advance)"]
        C --> B
        B -- "Yes (Valid)" --> D["Update optimal answer<br/>or add (R - L + 1) to count"]
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Flat Frequency Arrays vs. <code>std::unordered_map</code> in Sliding Windows</div>
        <p>Inside a sliding window loop, every step increments <code>freq[A[R]]</code> and decrements <code>freq[A[L]]</code>. Using <code>std::unordered_map&lt;char, int&gt;</code> for ASCII/UTF-8 byte streams or bounded integer alphabets performs a hash computation, bucket pointer dereference, and linked-list node chase on every single character—turning a 1-cycle operation into a 40-cycle L1/L2 cache stall. Allocating a stack-resident flat array <code>int32_t freq[256] = {0}</code> occupies exactly 1 KB (16 cache lines), remains permanently pinned in L1d cache, and executes window expansions/contractions in ~1.2 CPU clock cycles per byte.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-two-pointers-window"></div>

      <h3>Production Implementation: Count Subarrays with Exactly K Distinct Integers</h3>
      <pre><code class="language-cpp">#include &lt;cstdint&gt;
#include &lt;vector&gt;

// Prerequisite: 0 &lt;= nums[i] &lt;= max_val (or coordinate-compressed to [0, N))
std::int64_t subarrays_at_most_k_distinct(const std::vector&lt;int&gt;&amp; nums, int k, int max_val) {
  if (k &lt;= 0) return 0;
  std::vector&lt;int&gt; freq(static_cast&lt;std::size_t&gt;(max_val + 1), 0);
  int distinct = 0;
  std::size_t left = 0;
  std::int64_t total_subarrays = 0;

  for (std::size_t right = 0; right &lt; nums.size(); ++right) {
    if (freq[nums[right]]++ == 0) {
      ++distinct;
    }
    while (distinct &gt; k) {
      if (--freq[nums[left]] == 0) {
        --distinct;
      }
      ++left;
    }
    // Every subarray [i .. right] with left &lt;= i &lt;= right has &lt;= k distinct elements
    total_subarrays += static_cast&lt;std::int64_t&gt;(right - left + 1);
  }
  return total_subarrays;
}

std::int64_t subarrays_exactly_k_distinct(const std::vector&lt;int&gt;&amp; nums, int k, int max_val) {
  return subarrays_at_most_k_distinct(nums, k, max_val)
       - subarrays_at_most_k_distinct(nums, k - 1, max_val);
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Applying Two-Pointer Sliding Windows to Arrays with Negative Numbers</div>
        <p>Never use a standard two-pointer sliding window to find the shortest or longest subarray with sum $\\ge K$ or $\\le K$ when the input array can contain <strong>negative numbers</strong>! With negative values, shrinking the window by advancing $L$ past a negative number $A[L] &lt; 0$ <em>increases</em> the window sum, and advancing $R$ across a negative number <em>decreases</em> the window sum. Monotonicity is destroyed, and $L^*(R)$ is no longer non-decreasing. When negative numbers are present:
        <ul>
          <li>For <strong>Subarray Sum Equals $K$</strong>: use Prefix Sums + Hash Map ($O(N)$ time, $O(N)$ space).</li>
          <li>For <strong>Shortest Subarray with Sum $\\ge K$</strong> (LeetCode 862): use Prefix Sums + a Monotonic Increasing Deque ($O(N)$ time, $O(N)$ space).</li>
        </ul>
        </p>
      </div>
    `,
    keyTakeaways: [
      "A two-pointer sliding window is valid if and only if the window predicate P(L, R) is monotonic under interval inclusion, guaranteeing L*(R) is non-decreasing.",
      "Because L and R each start at 0 and increment at most N times without ever backtracking, the inner while loop runs at most N times total across the entire algorithm (O(N) amortized).",
      "Problems asking for 'exactly K' of a monotonic metric (like distinct elements or odd numbers) reduce to countAtMost(K) - countAtMost(K - 1).",
      "Negative numbers destroy sum monotonicity; replace plain sliding windows with Prefix Sums + Hash Map (for exact sum K) or Prefix Sums + Monotonic Deque (for shortest sum >= K)."
    ],
    furtherReading: [
      {
        title: "Antti Laaksonen — Competitive Programmer's Handbook, Chapter 8: Amortized Analysis & Two Pointers",
        url: "https://cses.fi/book/book.pdf",
        type: "Textbook"
      },
      {
        title: "USACO Guide — Silver: Two Pointers & Monotonicity Invariants",
        url: "https://usaco.guide/silver/two-pointers",
        type: "Competitive Programming Reference"
      }
    ]
  },

  "kadane-subarray-invariants": {
    title: "Maximum Subarray (Kadane's Algorithm) & Circular Array Extensions",
    video: {
      youtubeId: "86CQq3pKSUw",
      id: "86CQq3pKSUw",
      url: "https://www.youtube.com/embed/86CQq3pKSUw",
      id: "86CQq3pKSUw",
      url: "https://www.youtube.com/embed/86CQq3pKSUw",
      title: "Maximum Subarray Problem & Kadane's Dynamic Programming Invariant",
      channel: "CS Dojo / MIT 6.006",
      duration: "16 min"
    },
    intuition: "Jay Kadane solved the Maximum Subarray Problem in $O(N)$ time by asking a sharper question: instead of tracking the best subarray anywhere in $A[0 \\dots i]$, track $E[i]$—the maximum subarray <em>constrained to end at index $i$</em>. Because any contiguous subarray ending at $i$ either extends the optimal subarray ending at $i-1$ or starts fresh at $i$, $E[i]$ satisfies the local recurrence $E[i] = \\max(A[i], E[i-1] + A[i])$, which collapses to two scalar registers.",
    content: `
      <h3>From 2D Image Estimation to $O(N)$ 1D Dynamic Programming</h3>
      <p>Originally posed by Ulf Grenander in 1977 for maximum-likelihood pattern detection in 2D digitized images, the Maximum Contiguous Subarray problem originally took $O(N^3)$ brute force, $O(N^2)$ via prefix sums, and $O(N \\log N)$ via divide-and-conquer before Jay Kadane (CMU) discovered the $O(N)$ invariant in 1984. Notice the structural connection to prefix sums:</p>
      <p>$$\\max_{0 \\le L \\le R &lt; N} \\sum_{k=L}^{R} A[k] = \\max_{0 \\le R &lt; N} \\left( P[R+1] - \\min_{0 \\le L \\le R} P[L] \\right)$$</p>
      <p>Maintaining the running minimum prefix sum $\\min_{0 \\le L \\le R} P[L]$ as $R$ scans left-to-right is mathematically identical to Kadane's DP recurrence: let $E[i]$ be the maximum sum of a non-empty contiguous subarray ending at index $i$. Whenever $E[i-1] &lt; 0$, prepending the best suffix of $A[0 \\dots i-1]$ to $A[i]$ strictly reduces $A[i]$'s value, so we discard the negative prefix and start a fresh subarray at $i$:</p>
      <p>$$E[i] = \\max(A[i],\\; E[i-1] + A[i]), \\qquad G[i] = \\max(G[i-1],\\; E[i])$$</p>

      <div class="invariant-box">
        <div class="invariant-title">Duality Theorem: Maximum Circular Subarray = $\\max(\\text{Kadane}_{\\max},\\; \\text{TotalSum} - \\text{Kadane}_{\\min})$</div>
        <p>In a circular array (ring buffer) where index $N-1$ wraps around to index $0$, any valid non-empty contiguous circular subarray falls into one of two mutually exclusive topological cases:</p>
        <ol>
          <li><strong>Non-Wrapping Interval $A[L \\dots R]$:</strong> The optimal subarray does not cross the $N-1 \\to 0$ boundary. Its sum is found by standard $\\text{Kadane}_{\\max}(A)$.</li>
          <li><strong>Wrapping Interval $A[0 \\dots R] \\cup A[L \\dots N-1]$ (with $R + 1 &lt; L$):</strong> The chosen elements wrap around the boundary, which means the <em>excluded</em> middle elements $A[R+1 \\dots L-1]$ form a contiguous non-wrapping subarray! Maximizing the wrapping sum is equivalent to minimizing the excluded middle subarray via $\\text{Kadane}_{\\min}(A)$:
          $$\\text{MaxWrapSum} = \\sum_{i=0}^{N-1} A[i] - \\min_{0 \\le L \\le R &lt; N} \\sum_{k=L}^{R} A[k]$$</li>
        </ol>
        <p><strong>Critical Edge Case:</strong> If <em>all</em> elements in $A$ are negative ($A[i] &lt; 0$), then $\\text{Kadane}_{\\min}(A) = \\text{TotalSum}$, so $\\text{TotalSum} - \\text{Kadane}_{\\min}(A) = 0$, corresponding to an <em>empty</em> wrapping subarray. Therefore, if $\\text{Kadane}_{\\max}(A) &lt; 0$ (or equivalently $\\text{TotalSum} == \\text{Kadane}_{\\min}$), return $\\text{Kadane}_{\\max}(A)$ directly!</p>
      </div>

      <h3>Comparative Algorithmic Approaches to Maximum Subarray</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Algorithm / Formulation</th>
            <th>Time Complexity</th>
            <th>Auxiliary Space</th>
            <th>Parallelizable / Associative?</th>
            <th>Primary Use Case</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kadane's Local DP ($E[i], G[i]$)</td>
            <td>$O(N)$</td>
            <td>$O(1)$</td>
            <td>Serial loop-carried dependency</td>
            <td>Sequential 1D &amp; Circular arrays</td>
          </tr>
          <tr>
            <td>Prefix Sum Running Min ($P[R+1] - \\min P[L]$)</td>
            <td>$O(N)$</td>
            <td>$O(1)$</td>
            <td>Reducible via parallel prefix scan</td>
            <td>Length-constrained subarrays (with Deque)</td>
          </tr>
          <tr>
            <td>Divide &amp; Conquer / Segment Tree Node</td>
            <td>$O(N)$ build, $O(\\log N)$ update</td>
            <td>$O(N)$ tree</td>
            <td><strong>Yes!</strong> Monoid tuple $(sum, pref, suff, best)$</td>
            <td>Dynamic point updates + range max-subarray queries</td>
          </tr>
          <tr>
            <td>2D Kadane (Row-Pair Compression)</td>
            <td>$O(R^2 \\cdot C)$</td>
            <td>$O(C)$</td>
            <td>Outer row pairs embarrassingly parallel</td>
            <td>Maximum sum submatrix in 2D grids</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing Circular Subarray Complement Duality</h3>
      <svg viewBox="0 0 760 185" width="100%" height="auto" role="img" aria-label="Circular subarray wrap-around complement duality">
        <style>
          .kd-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .kd-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .kd-max { fill: rgba(16, 185, 129, 0.25); stroke: #10b981; stroke-width: 2; }
          .kd-min { fill: rgba(239, 68, 68, 0.22); stroke: #ef4444; stroke-width: 1.5; stroke-dasharray: 4 2; }
          .kd-neutral { fill: rgba(148, 163, 184, 0.14); stroke: currentColor; stroke-opacity: 0.3; stroke-width: 1; }
        </style>
        <text x="15" y="24" class="kd-title">Case 1: Non-Wrapping Max Subarray (Standard Kadane_max)</text>
        <rect x="15" y="36" width="130" height="36" rx="3" class="kd-neutral"/>
        <text x="80" y="58" text-anchor="middle" class="kd-txt">Prefix</text>
        <rect x="149" y="36" width="380" height="36" rx="3" class="kd-max"/>
        <text x="339" y="58" text-anchor="middle" class="kd-txt">Max Contiguous Subarray (Kadane_max)</text>
        <rect x="533" y="36" width="210" height="36" rx="3" class="kd-neutral"/>
        <text x="638" y="58" text-anchor="middle" class="kd-txt">Suffix</text>

        <text x="15" y="106" class="kd-title">Case 2: Wrapping Max Subarray = TotalSum - Minimum Contiguous Middle Subarray (Kadane_min)</text>
        <rect x="15" y="118" width="215" height="36" rx="3" class="kd-max"/>
        <text x="122" y="140" text-anchor="middle" class="kd-txt">Wrapped Head [0 .. R]</text>
        <rect x="234" y="118" width="290" height="36" rx="3" class="kd-min"/>
        <text x="379" y="140" text-anchor="middle" class="kd-txt">Excluded Min Subarray (Kadane_min)</text>
        <rect x="528" y="118" width="215" height="36" rx="3" class="kd-max"/>
        <text x="635" y="140" text-anchor="middle" class="kd-txt">Wrapped Tail [L .. N-1]</text>
        <text x="15" y="174" class="kd-txt">Guard: If all A[i] &lt; 0, TotalSum == Kadane_min (empty wrap); return Kadane_max directly!</text>
      </svg>

      <h3>Associative Monoid Promotion for Parallel / Segment-Tree Kadane</h3>
      <div class="mermaid">
      flowchart LR
        L["Left Half Tuple<br/>(sum_L, pref_L, suff_L, best_L)"] --> M["Combine Operator (O(1))<br/>sum = sum_L + sum_R<br/>pref = max(pref_L, sum_L + pref_R)<br/>suff = max(suff_R, suff_L + sum_R)<br/>best = max({best_L, best_R, suff_L + pref_R})"]
        R["Right Half Tuple<br/>(sum_R, pref_R, suff_R, best_R)"] --> M
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Branchless <code>cmov</code> Execution &amp; Parallel Monoid Reduction</div>
        <p>Inside Kadane's inner loop, <code>cur_max = std::max(x, cur_max + x)</code> and <code>global_max = std::max(global_max, cur_max)</code> compile on x86-64 to two additions and two conditional move (<code>cmovg</code>) instructions with <strong>zero branch instructions</strong>—avoiding branch predictor pollution regardless of sign oscillations. However, because <code>cur_max</code> depends on the previous iteration's <code>cur_max</code>, a single scalar Kadane loop is latency-bound by the 2-cycle integer add+cmov dependency chain. To saturate 8-wide AVX2 SIMD lanes or multi-core threads, divide the array into $P$ chunks and compute the 4-tuple monoid $(\\text{sum}, \\text{max\\_prefix}, \\text{max\\_suffix}, \\text{max\\_subarray})$ on each chunk independently in parallel!</p>
      </div>

      <div class="simulator-mount" data-sim="sim-prefix-diff-kadane"></div>

      <h3>Production Implementation: Circular Kadane &amp; Index-Tracking Non-Wrapping Kadane</h3>
      <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;vector&gt;

struct SubarrayResult {
  std::int64_t max_sum;
  std::size_t best_left;
  std::size_t best_right;
};

// Returns maximum non-empty subarray sum along with exact [best_left, best_right] indices
SubarrayResult kadane_with_indices(const std::vector&lt;int&gt;&amp; nums) noexcept {
  std::int64_t cur_sum = nums[0];
  std::int64_t max_sum = nums[0];
  std::size_t cur_left = 0, best_left = 0, best_right = 0;

  for (std::size_t i = 1; i &lt; nums.size(); ++i) {
    if (cur_sum &lt; 0) {
      cur_sum = nums[i];
      cur_left = i;
    } else {
      cur_sum += nums[i];
    }
    if (cur_sum &gt; max_sum) {
      max_sum = cur_sum;
      best_left = cur_left;
      best_right = i;
    }
  }
  return {max_sum, best_left, best_right};
}

// Single-pass O(N) Time, O(1) Space Maximum Circular Subarray
std::int64_t max_subarray_circular(const std::vector&lt;int&gt;&amp; nums) noexcept {
  std::int64_t total_sum = nums[0];
  std::int64_t cur_max = nums[0], global_max = nums[0];
  std::int64_t cur_min = nums[0], global_min = nums[0];

  for (std::size_t i = 1; i &lt; nums.size(); ++i) {
    const std::int64_t x = nums[i];
    total_sum += x;
    cur_max = std::max(x, cur_max + x);
    global_max = std::max(global_max, cur_max);
    cur_min = std::min(x, cur_min + x);
    global_min = std::min(global_min, cur_min);
  }

  // If all numbers are negative, global_max &lt; 0 and total_sum == global_min.
  // Returning total_sum - global_min would erroneously return 0 (the empty subarray).
  if (global_max &lt; 0) {
    return global_max;
  }
  return std::max(global_max, total_sum - global_min);
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Initializing <code>global_max = 0</code> &amp; Maximum Product Subarray Sign Flips</div>
        <p>Two classic bugs arise in Kadane variants:</p>
        <ol>
          <li><strong>Initializing <code>global_max = 0</code>:</strong> When the problem requires a <em>non-empty</em> subarray and all elements are negative (e.g., <code>[-8, -3, -5]</code>), initializing <code>global_max = 0</code> returns <code>0</code> instead of <code>-3</code>. Always initialize <code>cur_max = global_max = A[0]</code> and loop from index <code>i = 1</code>.</li>
          <li><strong>Maximum Product Subarray:</strong> Multiplication is not monotonic under sign flips—multiplying a very negative running product by a negative number $A[i] &lt; 0$ turns it into the <em>largest positive</em> product! For Maximum Product Subarray, you must simultaneously track both <code>cur_max</code> and <code>cur_min</code> at every step: when $A[i] &lt; 0$, <code>std::swap(cur_max, cur_min)</code> before multiplying.</li>
        </ol>
      </div>
    `,
    keyTakeaways: [
      "Kadane's algorithm reduces the O(N^2) subarray search to O(N) by maintaining E[i] = max(A[i], E[i-1] + A[i]), the best subarray constrained to end at index i.",
      "In a circular array, the maximum subarray is max(Kadane_max, TotalSum - Kadane_min), guarded by returning Kadane_max when all elements are negative.",
      "Although standard Kadane has a serial dependency, promoting each segment to the 4-tuple (sum, max_pref, max_suff, max_sub) makes the operator associative for Segment Trees and SIMD/multi-core parallelism.",
      "Always initialize Kadane's accumulators to A[0] (not 0) when non-empty subarrays are required, and track both min and max states for Maximum Product Subarray."
    ],
    furtherReading: [
      {
        title: "Jon Bentley — Programming Pearls, Column 8: Algorithm Design Techniques (History of Grenander's & Kadane's Algorithm)",
        url: "https://dl.acm.org/doi/10.1145/358234.381162",
        type: "Seminal Paper"
      },
      {
        title: "CP-Algorithms: Segment Tree — Finding Subsegments with the Maximal Sum (4-Tuple Monoid)",
        url: "https://cp-algorithms.com/data_structures/segment_tree.html",
        type: "Algorithm Reference"
      }
    ]
  },

  "bit-manipulation-twos-complement": {
    title: "Twos-Complement Arithmetic, Bitmasks, Brian Kernighan's Trick & XOR",
    video: {
      youtubeId: "ZusiKXcz_ac",
      title: "MIT 6.172 Lecture 3: Bit Hacks, Two's Complement & SWAR Word-Level Parallelism",
      channel: "MIT OpenCourseWare (Charles Leiserson)",
      duration: "51:50",
      start: 0,
      length: "52m",
      why: "Charles Leiserson derives two's-complement identities, x & (x - 1) lowest-set-bit clearing, branchless min/max, popcount masks, and De Bruijn O(1) bitscan."
    },
    intuition: "Every $w$-bit signed integer in modern hardware is represented in two's complement, where the most significant bit $b_{w-1}$ carries negative weight $-2^{w-1}$ and negation is defined by the ring identity $-x \\equiv \\sim x + 1 \\pmod{2^w}$. Because $+1$ ripples a carry across all trailing $0$s and flips the lowest set bit $1 \\to 0$, combining $x$ with $-x$ or $x - 1$ isolates or clears the lowest set bit in a single clock cycle.",
    content: `
      <h3>Two's Complement Ring Algebra &amp; Lowest-Bit Identities</h3>
      <p>In a $w$-bit two's-complement register, a bit vector $b_{w-1} b_{w-2} \\dots b_1 b_0$ represents the signed integer value:</p>
      <p>$$x = -b_{w-1} 2^{w-1} + \\sum_{i=0}^{w-2} b_i 2^i$$</p>
      <p>Why did two's complement universally triumph over sign-magnitude and ones' complement? Because addition, subtraction, and multiplication use the <strong>exact same ALU circuitry</strong> for both signed and unsigned integers modulo $2^w$, and zero has a unique representation. Suppose a non-zero integer $x$ has its lowest set bit ($1$) at index $k$, so its binary representation splits into an arbitrary prefix $P$, bit $k$ equal to $1$, and $k$ trailing zeros: $x = [P \\;\\vert\\; 1 \\;\\vert\\; 00\\dots0_k]$. Observe what happens under subtraction of $1$ and under negation ($\\sim x + 1$):</p>
      <ul>
        <li><strong>Subtracting 1 ($x - 1$):</strong> Borrowing from bit $k$ flips bit $k$ to $0$ and turns all $k$ trailing zeros into $1$s, leaving prefix $P$ untouched: $x - 1 = [P \\;\\vert\\; 0 \\;\\vert\\; 11\\dots1_k]$.</li>
        <li><strong>Brian Kernighan's Clear-Lowest-Set-Bit ($x \\mathrel{\\&amp;} (x - 1)$):</strong> ANDing $x$ with $x - 1$ preserves prefix $P$ and zeroes out bit $k$ and everything below it: $x \\mathrel{\\&amp;} (x - 1) = [P \\;\\vert\\; 0 \\;\\vert\\; 00\\dots0_k]$. This clears the lowest set bit in $O(1)$ time, and equals $0$ for $x &gt; 0$ if and only if $x$ is a power of two!</li>
        <li><strong>Isolating the Lowest Set Bit ($x \\mathrel{\\&amp;} -x$):</strong> Bitwise NOT gives $\\sim x = [\\sim P \\;\\vert\\; 0 \\;\\vert\\; 11\\dots1_k]$. Adding $1$ ripples a carry through the $k$ trailing ones and sets bit $k$: $-x = \\sim x + 1 = [\\sim P \\;\\vert\\; 1 \\;\\vert\\; 00\\dots0_k]$. Therefore, $x \\mathrel{\\&amp;} -x = [00\\dots0 \\;\\vert\\; 1 \\;\\vert\\; 00\\dots0_k] = 2^k$, isolating the lowest set bit (the fundamental primitive of Fenwick Trees).</li>
      </ul>

      <div class="invariant-box">
        <div class="invariant-title">Algebraic Invariant: $\\mathbb{F}_2^w$ XOR Vector Space &amp; Submask Enumeration</div>
        <p>Bitwise XOR ($\\oplus$) is addition modulo $2$ in the vector space $\\mathbb{F}_2^w$: it is commutative ($a \\oplus b = b \\oplus a$), associative ($a \\oplus (b \\oplus c) = (a \\oplus b) \\oplus c$), has identity $0$ ($a \\oplus 0 = a$), and every element is its own inverse ($a \\oplus a = 0$). Consequently, XORing a stream where every element appears twice except one cancels all pairs to $0$, leaving the unique element.</p>
        <p>Even more remarkably, if two unique elements $u \\neq v$ appear once while all others appear twice, the total XOR is $S = u \\oplus v \\neq 0$. Extracting the lowest set bit $lowbit = S \\mathrel{\\&amp;} -S$ identifies a bit position where $u$ and $v$ <strong>provably differ</strong>—partitioning the stream into two disjoint subsets (those with $lowbit$ set vs. clear) that isolate $u$ and $v$ in $O(N)$ time and $O(1)$ space!</p>
      </div>

      <h3>Essential Bit Manipulation Primitives &amp; x86 BMI1/BMI2 Instructions</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Operation</th>
            <th>Bitwise Expression</th>
            <th>x86-64 Hardware Instruction</th>
            <th>Latency / Throughput</th>
            <th>Algorithmic Application</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Clear lowest set bit</td>
            <td><code>x &amp; (x - 1)</code></td>
            <td><code>BLSR reg, reg</code> (BMI1)</td>
            <td>1 cycle / 0.5 CPI</td>
            <td>Kernighan popcount, power-of-2 test</td>
          </tr>
          <tr>
            <td>Isolate lowest set bit ($2^k$)</td>
            <td><code>x &amp; -x</code> (or <code>x &amp; (~x + 1)</code>)</td>
            <td><code>BLSI reg, reg</code> (BMI1)</td>
            <td>1 cycle / 0.5 CPI</td>
            <td>Fenwick Tree (BIT), Single Number III</td>
          </tr>
          <tr>
            <td>Mask lowest $1$ and trailing $0$s</td>
            <td><code>x ^ (x - 1)</code></td>
            <td><code>BLSMSK reg, reg</code> (BMI1)</td>
            <td>1 cycle / 0.5 CPI</td>
            <td>Trailing zero mask generation</td>
          </tr>
          <tr>
            <td>Next submask of mask $M$</td>
            <td><code>s = (s - 1) &amp; M</code></td>
            <td><code>DEC</code> + <code>AND</code></td>
            <td>1 cycle</td>
            <td>$O(3^n)$ Subset-of-Subset DP</td>
          </tr>
          <tr>
            <td>Count trailing zeros ($k$)</td>
            <td><code>std::countr_zero(x)</code></td>
            <td><code>TZCNT</code> (BMI1)</td>
            <td>1–3 cycles</td>
            <td>Bitboard bitscan, Gosper's hack</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing Two's-Complement Bit Isolation &amp; $O(3^n)$ Submask Jumping</h3>
      <svg viewBox="0 0 760 205" width="100%" height="auto" role="img" aria-label="Twos complement bit isolation x and -x and x and x-1">
        <style>
          .bm-txt { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: currentColor; }
          .bm-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .bm-pre { fill: rgba(59, 130, 246, 0.2); stroke: #3b82f6; stroke-width: 1.5; }
          .bm-piv { fill: rgba(16, 185, 129, 0.3); stroke: #10b981; stroke-width: 2; }
          .bm-zero { fill: rgba(148, 163, 184, 0.14); stroke: currentColor; stroke-opacity: 0.3; stroke-width: 1; }
          .bm-flip { fill: rgba(245, 158, 11, 0.22); stroke: #f59e0b; stroke-width: 1.5; }
        </style>
        <text x="15" y="22" class="bm-title">Bit Decomposition of x = 0b10110100 (Lowest Set Bit at k = 2)</text>

        <text x="15" y="54" class="bm-txt">x         =</text>
        <rect x="115" y="34" width="220" height="28" rx="3" class="bm-pre"/>
        <text x="225" y="53" text-anchor="middle" class="bm-txt">Prefix P: 1 0 1 1 0</text>
        <rect x="341" y="34" width="80" height="28" rx="3" class="bm-piv"/>
        <text x="381" y="53" text-anchor="middle" class="bm-txt">Bit k: 1</text>
        <rect x="427" y="34" width="160" height="28" rx="3" class="bm-zero"/>
        <text x="507" y="53" text-anchor="middle" class="bm-txt">Trailing: 0 0</text>

        <text x="15" y="92" class="bm-txt">x - 1     =</text>
        <rect x="115" y="72" width="220" height="28" rx="3" class="bm-pre"/>
        <text x="225" y="91" text-anchor="middle" class="bm-txt">Prefix P: 1 0 1 1 0</text>
        <rect x="341" y="72" width="80" height="28" rx="3" class="bm-zero"/>
        <text x="381" y="91" text-anchor="middle" class="bm-txt">Bit k: 0</text>
        <rect x="427" y="72" width="160" height="28" rx="3" class="bm-flip"/>
        <text x="507" y="91" text-anchor="middle" class="bm-txt">Flipped:  1 1</text>

        <text x="15" y="130" class="bm-txt">-x (~x+1) =</text>
        <rect x="115" y="110" width="220" height="28" rx="3" class="bm-flip"/>
        <text x="225" y="129" text-anchor="middle" class="bm-txt">~Prefix:  0 1 0 0 1</text>
        <rect x="341" y="110" width="80" height="28" rx="3" class="bm-piv"/>
        <text x="381" y="129" text-anchor="middle" class="bm-txt">Bit k: 1</text>
        <rect x="427" y="110" width="160" height="28" rx="3" class="bm-zero"/>
        <text x="507" y="129" text-anchor="middle" class="bm-txt">Trailing: 0 0</text>

        <text x="15" y="168" class="bm-txt">x &amp; (x-1) = [Prefix P | 0 | 00] (Clears lowest 1)     x &amp; -x = [00000 | 1 | 00] (Isolates lowest 1)</text>
        <text x="15" y="192" class="bm-txt">Submask jump s = (s - 1) &amp; M clears all bits outside M in 1 step, enumerating all pairs (M, s) in Sum C(n,k)2^k = 3^n!</text>
      </svg>

      <h3>Why Enumerating All Submasks of All Masks Takes $O(3^n)$ Instead of $O(4^n)$</h3>
      <div class="mermaid">
      flowchart LR
        A["Outer Loop:<br/>For mask M = 0 .. 2^n - 1"] --> B["Inner Loop:<br/>For s = M; s > 0; s = (s - 1) & M"]
        B --> C["If M has k set bits,<br/>inner loop runs 2^k times"]
        C --> D["Binomial Theorem:<br/>Sum C(n, k) * 2^k = (1 + 2)^n = 3^n"]
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Signed Overflow UB, <code>INT_MIN</code> Negation, and Shift Width Modulo Traps</div>
        <p>In C and C++, signed integer overflow is <strong>Undefined Behavior (UB)</strong>—even though C++20 standardized two's-complement representation! Specifically:</p>
        <ul>
          <li>Negating <code>INT32_MIN</code> ($-2^{31} = \\text{0x80000000}$) in signed arithmetic overflows because $+2^{31}$ is unrepresentable in 32-bit signed two's complement (its bitwise negation $+1$ wraps back to <code>0x80000000</code>). Always cast to an unsigned type (<code>uint32_t</code> / <code>uint64_t</code>) before applying <code>0u - ux</code> or bit manipulation.</li>
          <li>Shifting a $w$-bit integer by $\\ge w$ bits (e.g., <code>1ULL &lt;&lt; 64</code> or <code>1 &lt;&lt; 32</code>) is Undefined Behavior in C/C++, and on x86-64 the hardware <code>SHL</code> instruction masks the shift count to $63$ (or $31$), turning <code>1ULL &lt;&lt; 64</code> into <code>1ULL &lt;&lt; 0 == 1</code> instead of <code>0</code>!</li>
        </ul>
      </div>

      <div class="simulator-mount" data-sim="sim-bit-manipulation-swar"></div>

      <h3>Production Implementation: Single Number III, Gosper's Hack &amp; $O(3^n)$ Submask DP</h3>
      <pre><code class="language-cpp">#include &lt;bit&gt;
#include &lt;cstdint&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

// Partition an array where two elements appear once and all others appear twice
std::pair&lt;int, int&gt; single_number_two_uniques(const std::vector&lt;int&gt;&amp; nums) noexcept {
  std::uint32_t xor_all = 0;
  for (int x : nums) {
    xor_all ^= static_cast&lt;std::uint32_t&gt;(x);
  }
  // Isolate lowest differing bit using unsigned two's complement negation (safe for INT_MIN!)
  const std::uint32_t diff_bit = xor_all &amp; (0u - xor_all);

  std::uint32_t group_a = 0, group_b = 0;
  for (int x : nums) {
    const auto ux = static_cast&lt;std::uint32_t&gt;(x);
    if ((ux &amp; diff_bit) != 0) {
      group_a ^= ux;
    } else {
      group_b ^= ux;
    }
  }
  return {static_cast&lt;int&gt;(group_a), static_cast&lt;int&gt;(group_b)};
}

// Gosper's Hack: Compute next lexicographical bitmask with the exact same popcount
constexpr std::uint64_t next_combination_mask(std::uint64_t x) noexcept {
  const std::uint64_t c = x &amp; (0ULL - x); // lowest set bit
  const std::uint64_t r = x + c;          // ripple carry through lowest block of 1s
  return (((r ^ x) &gt;&gt; 2) / c) | r;        // shift remaining 1s to the bottom
}

// Enumerate all submasks of all n-bit masks in exactly O(3^n) steps
void enumerate_all_submasks(int n) noexcept {
  const std::uint32_t total = 1u &lt;&lt; n;
  for (std::uint32_t mask = 0; mask &lt; total; ++mask) {
    for (std::uint32_t sub = mask; sub &gt; 0; sub = (sub - 1) &amp; mask) {
      // Process non-empty submask sub of mask
    }
    // Process sub == 0 here if empty submask is needed
  }
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: C Operator Precedence of Bitwise <code>&amp;</code>, <code>^</code>, <code>|</code> vs. <code>==</code> and <code>!=</code></div>
        <p>By a notorious historical accident in early B and C (before <code>&amp;&amp;</code> and <code>||</code> were separated from <code>&amp;</code> and <code>|</code>), Dennis Ritchie gave relational and equality operators (<code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>) <strong>higher operator precedence</strong> than bitwise <code>&amp;</code>, <code>^</code>, and <code>|</code>. As a result, writing <code>if (mask &amp; bit != 0)</code> is parsed by the compiler as <code>if (mask &amp; (bit != 0))</code>—which evaluates <code>mask &amp; 1</code> and silently tests the wrong bit! Always parenthesize bitwise tests: <code>if ((mask &amp; bit) != 0)</code>, and always write <code>1ULL &lt;&lt; k</code> instead of <code>1 &lt;&lt; k</code> when $k \\ge 31$.</p>
      </div>
    `,
    keyTakeaways: [
      "In two's-complement arithmetic (-x == ~x + 1), x & (x - 1) clears the lowest set bit (BLSR) and x & -x isolates the lowest set bit (BLSI) in a single ALU cycle.",
      "To avoid signed integer overflow UB on INT_MIN (-2^31), perform bitwise negation and bit hacks on unsigned types: ux & (0u - ux).",
      "Iterating s = (s - 1) & mask visits only valid submasks of mask; summed over all 2^n masks, this takes sum C(n,k) 2^k = 3^n total operations instead of 4^n.",
      "Always wrap bitwise masks in parentheses before equality comparisons ((x & mask) != 0) and use 1ULL << k to prevent 32-bit shift Undefined Behavior."
    ],
    furtherReading: [
      {
        title: "Henry S. Warren, Jr. — Hacker's Delight (2nd Edition), Chapter 2: Basics",
        url: "https://doc.lagout.org/security/Hackers%20Delight.pdf",
        type: "Seminal Book"
      },
      {
        title: "Sean Eron Anderson — Stanford Bit Twiddling Hacks",
        url: "https://graphics.stanford.edu/~seander/bithacks.html",
        type: "Reference Guide"
      },
      {
        title: "MIT 6.172 Performance Engineering of Software Systems — Lecture 2: Bit Hacks",
        url: "https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/",
        type: "University Courseware"
      }
    ]
  },

  "bitsets-word-level-parallelism": {
    title: "Bitsets, Popcount (__builtin_popcount) & O(N/64) Word-Level Parallelism",
    video: {
      youtubeId: "jqJ5s077OKo",
      id: "jqJ5s077OKo",
      url: "https://www.youtube.com/embed/jqJ5s077OKo",
      title: "C++ Bitsets & O(N/64) Word-Level Parallelism in Competitive Programming",
      channel: "Errichto Algorithms",
      duration: "26:18",
      start: 0,
      length: "26m",
      why: "Deep-dive lecture covering Bitsets, Popcount (__builtin_popcount) & O(N/64) Word-Level Parallelism."
    },
    intuition: "A 64-bit CPU register is not merely a single scalar integer—it is a 64-lane SIMD vector of booleans. Packing boolean states into contiguous <code>uint64_t</code> words compresses memory by $64\\times$ (fitting 524,288 flags inside a single 64 KB L2 cache) and executes set union (<code>|</code>), intersection (<code>&</code>), symmetric difference (<code>^</code>), shift, and cardinality (<code>POPCNT</code>) across 64 elements per clock cycle.",
    content: `
      <h3>SWAR (SIMD Within A Register) &amp; Tree-Reduction Popcount</h3>
      <p>How do you count the number of set bits (Hamming weight / population count) inside a 64-bit word $x$ in $O(\\log_2 64) = 6$ steps without hardware <code>POPCNT</code>? Treat the 64-bit integer as 64 parallel 1-bit accumulators and apply a divide-and-conquer parallel tree reduction:</p>
      <ol>
        <li><strong>Pairwise 2-bit sums:</strong> Subtract the even bits shifted right by 1 from each 2-bit pair: <code>x = x - ((x &gt;&gt; 1) &amp; 0x5555555555555555ULL)</code> (since $2b_1 + b_0 - b_1 = b_1 + b_0$).</li>
        <li><strong>Nibble 4-bit sums:</strong> Add adjacent 2-bit pairs: <code>x = (x &amp; 0x3333333333333333ULL) + ((x &gt;&gt; 2) &amp; 0x3333333333333333ULL)</code>.</li>
        <li><strong>Byte 8-bit sums:</strong> Add adjacent 4-bit nibbles and mask: <code>x = (x + (x &gt;&gt; 4)) &amp; 0x0F0F0F0F0F0F0F0FULL</code> (no overflow can occur since each byte holds at most $8 &lt; 15$).</li>
        <li><strong>Horizontal Multiply Reduction:</strong> Multiply by the magic constant <code>0x0101010101010101ULL</code> ($\\sum_{k=0}^7 2^{8k}$), which sums all 8 byte-lanes into the top byte (bits 56..63), then shift right by 56: <code>(x * 0x0101010101010101ULL) &gt;&gt; 56</code>!</li>
      </ol>

      <div class="invariant-box">
        <div class="invariant-title">Complexity Invariant: Word-RAM $O(N / w)$ Speedup for Subset Sum, Transitive Closure &amp; Set Intersection</div>
        <p>In the Word-RAM model with word size $w = 64$:
        <ul>
          <li><strong>0-1 Subset Sum DP:</strong> Instead of an $O(N \\cdot S)$ loop <code>for (s = S; s &gt;= v; --s) dp[s] |= dp[s - v]</code>, represent all reachable sums as a bitset $B$ and update 64 sums simultaneously via <code>B |= (B &lt;&lt; v)</code> in $O(N \\cdot S / 64)$ operations.</li>
          <li><strong>Graph Transitive Closure / Triangle Counting:</strong> Given bit-packed adjacency rows $\\text{adj}[u]$, the number of common neighbors shared by vertices $u$ and $v$ is $\\sum_{block} \\text{popcount}(\\text{adj}[u][block] \\mathrel{\\&amp;} \\text{adj}[v][block])$, turning $O(N^3)$ triangle counting into $O(N^3 / 64)$ and completing $N = 2000$ in ~15 milliseconds!</li>
        </ul>
        </p>
      </div>

      <h3>Bitset Representations Across Systems &amp; Analytics Engines</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Structure</th>
            <th>Bits per Element</th>
            <th>Union / Intersection</th>
            <th>Set Bit Iteration (Density $d$)</th>
            <th>Best For</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>bool flags[N]</code> (1 byte/bool)</td>
            <td>8 bits ($8\\times$ bloat)</td>
            <td>$O(N)$ scalar or $O(N/32)$ AVX2</td>
            <td>$O(N)$ branchy scan</td>
            <td>Small arrays needing byte addressability</td>
          </tr>
          <tr>
            <td>Flat Bitset (<code>uint64_t[(N+63)/64]</code>)</td>
            <td>1 bit</td>
            <td>$O(N / 64)$ scalar / $O(N / 512)$ AVX-512</td>
            <td>$O(N/64 + k)$ via <code>TZCNT</code> + <code>BLSR</code></td>
            <td>Dense sets ($d &gt; 1\\%$), DP, Graph bitboards</td>
          </tr>
          <tr>
            <td>Roaring Bitmap (Hybrid 16-bit Containers)</td>
            <td>Adaptive ($&lt;1$ to $16$ bits)</td>
            <td>$O(C)$ container ops</td>
            <td>$O(k)$ exact</td>
            <td>Production OLAP / Inverted Indexes (Lucene, ClickHouse)</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing SWAR Parallel Popcount &amp; Multi-Word Bitshift Carry</h3>
      <svg viewBox="0 0 760 200" width="100%" height="auto" role="img" aria-label="SWAR tree reduction popcount and multi-word bitset shift">
        <style>
          .swr-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .swr-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .swr-box { fill: rgba(59, 130, 246, 0.18); stroke: #3b82f6; stroke-width: 1.5; }
          .swr-acc { fill: rgba(16, 185, 129, 0.24); stroke: #10b981; stroke-width: 1.5; }
          .swr-carry { fill: rgba(245, 158, 11, 0.24); stroke: #f59e0b; stroke-width: 1.5; }
        </style>
        <text x="15" y="22" class="swr-title">SWAR Tree-Reduction Popcount on an 8-Bit Byte: 0b10110110 (5 set bits)</text>
        <rect x="15" y="34" width="320" height="26" rx="3" class="swr-box"/>
        <text x="175" y="51" text-anchor="middle" class="swr-txt">1-bit lanes:  1 | 0 | 1 | 1 | 0 | 1 | 1 | 0</text>
        <rect x="15" y="68" width="320" height="26" rx="3" class="swr-box"/>
        <text x="175" y="85" text-anchor="middle" class="swr-txt">2-bit sums:    01 (1) |  10 (2) |  01 (1) |  01 (1)</text>
        <rect x="15" y="102" width="320" height="26" rx="3" class="swr-box"/>
        <text x="175" y="119" text-anchor="middle" class="swr-txt">4-bit sums:      0011 (3)     |      0010 (2)</text>
        <rect x="15" y="136" width="320" height="26" rx="3" class="swr-acc"/>
        <text x="175" y="153" text-anchor="middle" class="swr-txt">8-bit total:           00000101 (5)</text>

        <text x="370" y="22" class="swr-title">Multi-Word Bitset Left Shift (B &lt;&lt;= k, where k = 64*q + r)</text>
        <rect x="370" y="42" width="175" height="44" rx="3" class="swr-box"/>
        <text x="457" y="62" text-anchor="middle" class="swr-txt">words[i - q - 1]</text>
        <text x="457" y="78" text-anchor="middle" class="swr-txt">High r bits --&gt;</text>

        <rect x="565" y="42" width="175" height="44" rx="3" class="swr-carry"/>
        <text x="652" y="62" text-anchor="middle" class="swr-txt">words[i - q]</text>
        <text x="652" y="78" text-anchor="middle" class="swr-txt">Low (64-r) bits</text>

        <rect x="465" y="114" width="275" height="48" rx="4" class="swr-acc"/>
        <text x="602" y="135" text-anchor="middle" class="swr-txt">words[i] = (words[i-q] &lt;&lt; r)</text>
        <text x="602" y="151" text-anchor="middle" class="swr-txt">         | (words[i-q-1] &gt;&gt; (64 - r))</text>
        <text x="15" y="186" class="swr-txt">Fast Set-Bit Iteration: while (w) { idx = base + countr_zero(w); w &amp;= w - 1; } skips all 0-runs in hardware!</text>
      </svg>

      <h3>Fast Set-Bit Iteration via <code>TZCNT</code> + <code>BLSR</code></h3>
      <div class="mermaid">
      flowchart LR
        A["Load 64-bit word<br/>w = words[block]"] --> B{"w != 0?"}
        B -- "No (All 64 bits 0)" --> C["Advance to next word<br/>64 zero bits skipped in 1 cycle!"]
        B -- "Yes" --> D["bit = std::countr_zero(w)<br/>Yield index (block * 64 + bit)"]
        D --> E["w &= (w - 1)<br/>Clear lowest set bit (BLSR)"]
        E --> B
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Intel's <code>POPCNT</code> False Dependency Bug &amp; AVX-512 <code>VPOPCNTDQ</code></div>
        <p>Modern x86-64 CPUs execute <code>__builtin_popcountll(x)</code> (<code>std::popcount(x)</code> in C++20) via the dedicated <code>POPCNT</code> instruction with a 3-cycle latency and 1-cycle throughput. Historically, Intel Sandy Bridge through Skylake processors suffered from an infamous hardware erratum: <code>POPCNT</code> had a <strong>false register dependency on its destination register</strong>, stalling out-of-order execution inside tight loops unless the compiler emitted a dummy <code>xor eax, eax</code> before <code>popcnt rax, rdi</code>! On modern AVX-512 (Ice Lake / Zen 4) and ARM SVE, the <code>VPOPCNTDQ</code> instruction (or Harley-Seal / Wojciech Muła's <code>VPSHUFB</code> 4-bit LUT algorithm on AVX2) computes the popcount of eight 64-bit words (512 bits) in a single clock cycle—achieving over 100 GB/s of bit-counting throughput.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-bit-manipulation-swar"></div>

      <h3>Production Implementation: Dynamic 64-Bit Word-Parallel Bitset Engine</h3>
      <pre><code class="language-cpp">#include &lt;bit&gt;
#include &lt;cstdint&gt;
#include &lt;vector&gt;

class DynamicBitset64 {
  std::size_t num_bits_;
  std::vector&lt;std::uint64_t&gt; words_;

  void mask_tail() noexcept {
    const std::size_t rem = num_bits_ &amp; 63;
    if (rem != 0 &amp;&amp; !words_.empty()) {
      words_.back() &amp;= (1ULL &lt;&lt; rem) - 1ULL;
    }
  }

public:
  explicit DynamicBitset64(std::size_t num_bits)
      : num_bits_(num_bits), words_((num_bits + 63) / 64, 0ULL) {}

  void set(std::size_t i) noexcept {
    words_[i &gt;&gt; 6] |= (1ULL &lt;&lt; (i &amp; 63));
  }

  bool test(std::size_t i) const noexcept {
    return (words_[i &gt;&gt; 6] &amp; (1ULL &lt;&lt; (i &amp; 63))) != 0;
  }

  // O(N / 64) word-parallel shift-OR: this |= (this &lt;&lt; shift)
  // Accelerates 0-1 Subset Sum DP by 64x!
  void shift_left_or(std::size_t shift) noexcept {
    const std::size_t word_shift = shift &gt;&gt; 6;
    const std::size_t bit_shift = shift &amp; 63;
    if (word_shift &gt;= words_.size()) return;

    if (bit_shift == 0) {
      for (std::size_t i = words_.size() - 1; i &gt;= word_shift; --i) {
        words_[i] |= words_[i - word_shift];
        if (i == word_shift) break;
      }
    } else {
      const std::size_t inv_shift = 64 - bit_shift;
      for (std::size_t i = words_.size() - 1; i &gt; word_shift; --i) {
        words_[i] |= (words_[i - word_shift] &lt;&lt; bit_shift)
                   | (words_[i - word_shift - 1] &gt;&gt; inv_shift);
      }
      words_[word_shift] |= (words_[0] &lt;&lt; bit_shift);
    }
    mask_tail();
  }

  // O(N / 64) hardware popcount
  std::size_t count() const noexcept {
    std::size_t total = 0;
    for (std::uint64_t w : words_) {
      total += static_cast&lt;std::size_t&gt;(std::popcount(w));
    }
    return total;
  }

  // Iterate all set bit indices in O(N/64 + k) time using TZCNT + BLSR
  template &lt;typename Callback&gt;
  void for_each_set_bit(Callback&amp;&amp; cb) const {
    for (std::size_t block = 0; block &lt; words_.size(); ++block) {
      std::uint64_t w = words_[block];
      while (w != 0) {
        const int bit = std::countr_zero(w);
        cb((block &lt;&lt; 6) + static_cast&lt;std::size_t&gt;(bit));
        w &amp;= (w - 1);
      }
    }
  }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Unmasked Tail Bits &amp; Shift-by-64 Undefined Behavior in Multi-Word Shifts</div>
        <p>When implementing a custom multi-word bitset of length $N$ where $N$ is not a multiple of $64$, two subtle bugs frequently corrupt results:</p>
        <ol>
          <li><strong>Dirty Tail Bits:</strong> Operations like bitwise NOT (<code>~w</code>) or left shifts (<code>shift_left_or</code>) populate bit positions $\ge N$ in the final word <code>words_.back()</code>. If you do not immediately mask <code>words_.back() &amp;= (1ULL &lt;&lt; (N % 64)) - 1</code>, subsequent calls to <code>count()</code> or <code>any()</code> will count phantom out-of-bounds bits!</li>
          <li><strong>Shift by <code>64 - bit_shift</code> when <code>bit_shift == 0</code>:</strong> When shifting across word boundaries, if <code>shift % 64 == 0</code>, evaluating <code>words_[i - word_shift - 1] &gt;&gt; (64 - 0)</code> shifts a 64-bit integer by 64 bits—which is Undefined Behavior in C++ and acts as a shift-by-0 on x86! Always branch on <code>if (bit_shift == 0)</code> separately.</li>
        </ol>
      </div>
    `,
    keyTakeaways: [
      "Packing boolean arrays into 64-bit words shrinks memory footprint by 64x and turns O(N) bitwise set operations and DP transitions into O(N / 64) word-parallel loops.",
      "SWAR popcount sums 64 bits in 6 parallel reduction steps without branches; modern CPUs execute std::popcount via the 1-cycle throughput POPCNT instruction.",
      "Scanning set bits via std::countr_zero(w) (TZCNT) followed by w &= w - 1 (BLSR) runs in O(N/64 + k) time, jumping directly from one set bit to the next.",
      "In multi-word bitsets, always handle bit_shift == 0 separately to avoid shifting by 64 (UB), and always zero out tail bits >= N in the last word."
    ],
    furtherReading: [
      {
        title: "Wojciech Muła, Nathan Kurz, Daniel Lemire — Faster Population Counts Using AVX2 Instructions (The Computer Journal, 2017)",
        url: "https://arxiv.org/abs/1611.07612",
        type: "Research Paper"
      },
      {
        title: "Samamy et al. / Daniel Lemire — Roaring Bitmaps: Better Compression and Fast Set Operations",
        url: "https://arxiv.org/abs/1603.06549",
        type: "Research Paper"
      },
      {
        title: "Henry S. Warren, Jr. — Hacker's Delight (2nd Edition), Chapter 5: Counting Bits",
        url: "https://doc.lagout.org/security/Hackers%20Delight.pdf",
        type: "Seminal Book"
      }
    ]
  },

  "in-place-matrix-cyclic-shifts": {
    title: "In-Place Array Rotations (Juggling/Reversal) & Matrix Transposition",
    video: {
      youtubeId: "gmu0RA5_zxs",
      id: "gmu0RA5_zxs",
      url: "https://www.youtube.com/embed/gmu0RA5_zxs",
      id: "gmu0RA5_zxs",
      url: "https://www.youtube.com/embed/gmu0RA5_zxs",
      title: "In-Place Array Rotation via Three-Reversal Involution",
      channel: "Nick White",
      duration: "47 min"
    },
    intuition: "Every in-place spatial rearrangement—rotating an array by $k$, rotating an $N \\times N$ image by $90^\\circ$, or transposing a rectangular $R \\times C$ matrix—is a permutation of indices. By decomposing that permutation either into a product of two-or-three involutions (reversals/reflections) or into $\\gcd(N, k)$ disjoint algebraic orbits, we achieve $O(N)$ time with strictly $O(1)$ auxiliary memory.",
    content: `
      <h3>Three-Reversal Involution vs. $\\gcd(N, k)$ Juggling Cycles</h3>
      <p>Consider rotating an array $A = [X \\;\\vert\\; Y]$ so that a prefix $X$ of length $n - k$ and a suffix $Y$ of length $k$ swap positions to become $Y X$ (a right rotation by $k \\equiv k \\bmod n$).In abstract algebra, reversing an array is an <strong>involution</strong> ($R(R(A)) = A$) that reverses the order of concatenated blocks: $(X Y)^R = Y^R X^R$. Therefore, reversing $X$ and $Y$ individually and then reversing the whole array (or reversing the whole array first, then reversing the first $k$ and last $n-k$ elements) yields:</p>
      <p>$$\\left( X^R Y^R \\right)^R = (Y^R)^R (X^R)^R = Y X$$</p>
      <p>Alternatively, consider <strong>Bentley's Juggling Algorithm</strong>: moving each element directly from index $i$ to $(i + k) \\bmod n$ traces out cyclic orbits under the subgroup generated by $+k$ in $\\mathbb{Z}_n$. By elementary group theory (Lagrange's theorem), the subgroup $\\langle k \\rangle \\subseteq \\mathbb{Z}_n$ has size $L = \\frac{n}{\\gcd(n, k)}$ and partitions the $n$ indices into exactly $g = \\gcd(n, k)$ disjoint cycles, each of length $n / g$! Starting at each $s \\in [0, g - 1]$ and chasing the cycle moves every element exactly once ($N$ writes vs. $3N$ reads/writes in 3-Reversal).</p>

      <div class="invariant-box">
        <div class="invariant-title">Dihedral Group $D_4$ Invariant: $90^\\circ$ Matrix Rotation = Transpose $\\circ$ Reflection</div>
        <p>The symmetries of a square $N \\times N$ grid form the dihedral group $D_4$ of order 8, generated by two reflections: diagonal transposition $T(r, c) = (c, r)$ and horizontal row reversal $H(r, c) = (r, N - 1 - c)$. Their composition produces a $90^\\circ$ clockwise rotation:</p>
        <p>$$(H \\circ T)(r, c) = H(c, r) = (c,\\; N - 1 - r)$$</p>
        <p>Conversely, reversing each row first and then transposing ($T \\circ H$) produces a $90^\\circ$ counter-clockwise rotation $(N - 1 - c, r)$. What about transposing a <strong>non-square</strong> $R \\times C$ matrix stored in a 1D row-major buffer of size $R \\cdot C$? An element at $(r, c)$ starts at index $i = rC + c$ and moves to $(c, r)$ at index $i' = cR + r$. Observe that for every $i &lt; RC - 1$:</p>
        <p>$$i' = cR + r = cR + \\lfloor i / C \\rfloor \\equiv R \\cdot i \\pmod{RC - 1}$$</p>
        <p>Thus in-place rectangular transposition is simply cycle-following on the multiplicative permutation $i \\mapsto (R \\cdot i) \\bmod (RC - 1)$!</p>
      </div>

      <h3>Comparison of In-Place Rotation &amp; Transposition Algorithms</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Time Complexity</th>
            <th>Element Moves</th>
            <th>Cache Locality Profile</th>
            <th>Best Use Case</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>3-Reversal Rotation</td>
            <td>$O(N)$</td>
            <td>$\\approx 1.5 N$ swaps ($3N$ writes)</td>
            <td><strong>Sequential stride-1</strong> (L1 prefetcher optimal)</td>
            <td>Contiguous arrays in RAM (<code>std::rotate</code> on random-access)</td>
          </tr>
          <tr>
            <td>Juggling ($\gcd(N, k)$ Cycles)</td>
            <td>$O(N)$</td>
            <td>$N + \\gcd(N, k)$ moves</td>
            <td>Stride-$k$ jumps (TLB/cache thrashing for large $k$)</td>
            <td>Large objects where move construction is expensive</td>
          </tr>
          <tr>
            <td>Gries-Mills Block Swap</td>
            <td>$O(N)$</td>
            <td>$\\approx 2N$ moves</td>
            <td>Sequential block swaps</td>
            <td>Forward iterators without random access</td>
          </tr>
          <tr>
            <td>Cache-Tiled $B \\times B$ Transpose</td>
            <td>$O(N^2)$</td>
            <td>$N^2$ moves</td>
            <td>Zero conflict misses when $2 B^2 \\cdot \\text{sizeof}(T) \\le \\text{L1d}$</td>
            <td>Large matrices ($N \\ge 512$)</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing 3-Reversal Rotation &amp; $D_4$ Matrix Transpose + Reflect</h3>
      <svg viewBox="0 0 760 200" width="100%" height="auto" role="img" aria-label="Three-reversal rotation and D4 matrix rotation via transpose and reflect">
        <style>
          .rot-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .rot-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .rot-a { fill: rgba(59, 130, 246, 0.22); stroke: #3b82f6; stroke-width: 1.5; }
          .rot-b { fill: rgba(16, 185, 129, 0.25); stroke: #10b981; stroke-width: 1.5; }
          .rot-mat { fill: rgba(245, 158, 11, 0.2); stroke: #f59e0b; stroke-width: 1.5; }
        </style>
        <text x="15" y="22" class="rot-title">Right-Rotate by k = 3 via 3 Reversals: [1 2 3 4 | 5 6 7] --&gt; [5 6 7 | 1 2 3 4]</text>

        <text x="15" y="52" class="rot-txt">0. Initial:</text>
        <rect x="115" y="34" width="160" height="26" rx="3" class="rot-a"/>
        <text x="195" y="51" text-anchor="middle" class="rot-txt">X = [1, 2, 3, 4]</text>
        <rect x="281" y="34" width="120" height="26" rx="3" class="rot-b"/>
        <text x="341" y="51" text-anchor="middle" class="rot-txt">Y = [5, 6, 7]</text>

        <text x="15" y="88" class="rot-txt">1. Rev All:</text>
        <rect x="115" y="70" width="120" height="26" rx="3" class="rot-b"/>
        <text x="175" y="87" text-anchor="middle" class="rot-txt">Y^R = [7, 6, 5]</text>
        <rect x="241" y="70" width="160" height="26" rx="3" class="rot-a"/>
        <text x="321" y="87" text-anchor="middle" class="rot-txt">X^R = [4, 3, 2, 1]</text>

        <text x="15" y="124" class="rot-txt">2. Rev Parts:</text>
        <rect x="115" y="106" width="120" height="26" rx="3" class="rot-b"/>
        <text x="175" y="123" text-anchor="middle" class="rot-txt">Y = [5, 6, 7]</text>
        <rect x="241" y="106" width="160" height="26" rx="3" class="rot-a"/>
        <text x="321" y="123" text-anchor="middle" class="rot-txt">X = [1, 2, 3, 4]</text>

        <text x="440" y="22" class="rot-title">90-Deg Clockwise Rotation = Transpose + Reverse Rows</text>
        <rect x="440" y="36" width="90" height="90" rx="4" class="rot-mat"/>
        <text x="485" y="64" text-anchor="middle" class="rot-txt">(r, c)</text>
        <text x="485" y="96" text-anchor="middle" class="rot-txt">Transpose</text>

        <text x="545" y="84" class="rot-txt">--&gt;</text>

        <rect x="575" y="36" width="165" height="90" rx="4" class="rot-b"/>
        <text x="657" y="64" text-anchor="middle" class="rot-txt">1. (c, r)</text>
        <text x="657" y="96" text-anchor="middle" class="rot-txt">2. (c, N - 1 - r)</text>

        <text x="15" y="162" class="rot-txt">Juggling Orbit Decomposition: gcd(N=6, k=4) = 2 disjoint cycles: (0 -&gt; 4 -&gt; 2 -&gt; 0) and (1 -&gt; 5 -&gt; 3 -&gt; 1)</text>
        <text x="15" y="184" class="rot-txt">Cache Warning: For large k, Juggling strides by k across RAM; 3-Reversal streams at stride 1 (~3x faster in L1d)!</text>
      </svg>

      <h3>Juggling Cycle Decomposition ($\gcd(N, k)$ Orbits)</h3>
      <div class="mermaid">
      flowchart LR
        A["Compute k %= N<br/>g = std::gcd(N, k)"] --> B["For start = 0 .. g - 1<br/>tmp = A[start], cur = start"]
        B --> C["next = (cur + N - k) % N<br/>(Pull-chain for right rotate)"]
        C --> D{"next == start?"}
        D -- "No" --> E["A[cur] = move(A[next])<br/>cur = next"]
        E --> C
        D -- "Yes (Cycle closed)" --> F["A[cur] = move(tmp)"]
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Why 3-Reversal Beats Juggling in RAM &amp; Power-of-2 Matrix Cache Thrashing</div>
        <p>Even though Juggling performs $N$ writes while 3-Reversal performs $3N$ writes, benchmarked on $N = 10^7$ <code>int32_t</code> elements in DRAM, <strong>3-Reversal is $2.5\\times$ to $4\\times$ faster than Juggling</strong>! Why? Because 3-Reversal accesses memory strictly sequentially (stride $\pm 1$) and can be vectorized with AVX2 <code>_mm256_permutevar8x32_epi32</code>, utilizing all 64 bytes of every fetched cache line. Juggling jumps by stride $k$; when $k \\ge 16$, every single read/write touches a different 64-byte cache line and different 4 KB virtual page, causing catastrophic L1d and dTLB thrashing. Similarly, naive $N \\times N$ matrix transposition reads column $A[0 \\dots N-1][c]$ at stride $N$: when $N = 1024$ (a power of two), every row is separated by $4096$ bytes, mapping to the <strong>exact same L1d cache set</strong> (8-way set-associative conflict misses). Processing the matrix in $32 \\times 32$ cache-resident tiles completely eliminates these conflict misses.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-prefix-diff-kadane"></div>

      <h3>Production Implementation: 3-Reversal, Juggling &amp; Cache-Tiled Square Transpose</h3>
      <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;numeric&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

// Cache-friendly 3-Reversal Right Rotation by k positions
template &lt;typename T&gt;
void rotate_right_reversal(std::vector&lt;T&gt;&amp; a, std::size_t k) noexcept {
  const std::size_t n = a.size();
  if (n &lt;= 1) return;
  k %= n;
  if (k == 0) return;

  std::reverse(a.begin(), a.end());
  std::reverse(a.begin(), a.begin() + static_cast&lt;std::ptrdiff_t&gt;(k));
  std::reverse(a.begin() + static_cast&lt;std::ptrdiff_t&gt;(k), a.end());
}

// Minimum-Move Juggling Left Rotation by k positions using gcd(n, k) cycles
template &lt;typename T&gt;
void rotate_left_juggling(std::vector&lt;T&gt;&amp; a, std::size_t k) noexcept {
  const std::size_t n = a.size();
  if (n &lt;= 1) return;
  k %= n;
  if (k == 0) return;

  const std::size_t cycles = std::gcd(n, k);
  for (std::size_t start = 0; start &lt; cycles; ++start) {
    T tmp = std::move(a[start]);
    std::size_t cur = start;
    while (true) {
      std::size_t next = cur + k;
      if (next &gt;= n) next -= n; // faster than % n!
      if (next == start) break;
      a[cur] = std::move(a[next]);
      cur = next;
    }
    a[cur] = std::move(tmp);
  }
}

// In-Place 90-Degree Clockwise Matrix Rotation (Cache-Tiled Transpose + Row Reverse)
void rotate_matrix_90_cw(std::vector&lt;int&gt;&amp; mat, std::size_t n) noexcept {
  constexpr std::size_t TILE = 32;
  // Step 1: Tiled In-Place Transpose across upper triangle (r &lt; c)
  for (std::size_t r0 = 0; r0 &lt; n; r0 += TILE) {
    for (std::size_t c0 = r0; c0 &lt; n; c0 += TILE) {
      const std::size_t r_end = std::min(r0 + TILE, n);
      const std::size_t c_end = std::min(c0 + TILE, n);
      for (std::size_t r = r0; r &lt; r_end; ++r) {
        const std::size_t c_start = (r0 == c0) ? (r + 1) : c0;
        for (std::size_t c = c_start; c &lt; c_end; ++c) {
          std::swap(mat[r * n + c], mat[c * n + r]);
        }
      }
    }
  }
  // Step 2: Reverse each row sequentially
  for (std::size_t r = 0; r &lt; n; ++r) {
    auto row_begin = mat.begin() + static_cast&lt;std::ptrdiff_t&gt;(r * n);
    std::reverse(row_begin, row_begin + static_cast&lt;std::ptrdiff_t&gt;(n));
  }
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Swapping the Entire $N \\times N$ Matrix During In-Place Transpose</div>
        <p>When writing an in-place square matrix transpose, iterating <code>for (r = 0; r &lt; N; ++r) for (c = 0; c &lt; N; ++c) swap(M[r][c], M[c][r])</code> swaps every off-diagonal pair <strong>twice</strong>—leaving the matrix completely unchanged! Always restrict the inner loop strictly to the upper triangle <code>for (c = r + 1; c &lt; N; ++c)</code> (or lower triangle <code>c &lt; r</code>). Furthermore, never forget <code>k %= n</code> at the start of array rotation—if $k \\ge n$, computing <code>a.begin() + k</code> dereferences out-of-bounds memory.</p>
      </div>
    `,
    keyTakeaways: [
      "Rotating an array by k positions decomposes into three stride-1 array reversals: reverse(0, n), reverse(0, k), and reverse(k, n) for right rotation.",
      "Bentley's Juggling algorithm decomposes the index permutation into gcd(n, k) disjoint orbits of length n / gcd(n, k), moving each element once.",
      "Despite performing 3x more writes, 3-Reversal outperforms Juggling on primitive arrays in DRAM because sequential stride-1 access saturates cache lines and SIMD.",
      "Every 90-degree square matrix rotation is the composition of an upper-triangle transpose (c > r) and a horizontal or vertical reflection."
    ],
    furtherReading: [
      {
        title: "Jon Bentley — Programming Pearls (2nd Edition), Column 2: Aha! Algorithms (Three Reversals vs. Juggling Benchmarks)",
        url: "https://dl.acm.org/doi/10.1145/358234.381162",
        type: "Seminal Paper"
      },
      {
        title: "Matteo Frigo, Charles E. Leiserson, Harald Prokop, Sridhar Ramachandran — Cache-Oblivious Algorithms (FOCS 1999)",
        url: "https://supertech.csail.mit.edu/papers/FrigoLePr99.pdf",
        type: "Seminal Paper"
      }
    ]
  },

  "boyer-moore-majority-misra-gries": {
    title: "Boyer-Moore Majority Vote & Misra-Gries Heavy Hitters",
    video: {
      youtubeId: "7pnhv842keE",
      id: "7pnhv842keE",
      url: "https://www.youtube.com/embed/7pnhv842keE",
      id: "7pnhv842keE",
      url: "https://www.youtube.com/embed/7pnhv842keE",
      title: "Boyer-Moore Majority Vote Algorithm — O(1) Space Pairwise Cancellation",
      channel: "NeetCode",
      duration: "46 min"
    },
    intuition: "If an element appears strictly more than $\\lfloor N / 2 \\rfloor$ times in a stream, it survives pairwise annihilation against every non-matching element. Generalizing pairwise cancellation to $(k\text{-way})$ tuple cancellation yields the Misra-Gries algorithm: maintaining $k - 1$ counters in $O(k)$ space identifies every 'heavy hitter' occurring strictly more than $N / k$ times.",
    content: `
      <h3>Pairwise Annihilation &amp; The $k$-Tuple Cancellation Invariant</h3>
      <p>Suppose a stream of length $N$ contains a strict majority element $m$ with frequency $f(m) &gt; N / 2$. Imagine pairing each occurrence of $m$ with one distinct element $x \\neq m$ and deleting both from the stream. Because all non-$m$ elements combined total $N - f(m) &lt; N / 2$, they cannot annihilate all occurrences of $m$! Robert S. Boyer and J Strother Moore (1981) turned this observation into an $O(N)$ time, $O(1)$ space streaming algorithm with two variables (<code>candidate</code>, <code>count</code>):</p>
      <ul>
        <li>If <code>count == 0</code>, adopt the current element $x$ as <code>candidate = x</code> and set <code>count = 1</code>.</li>
        <li>Else if <code>x == candidate</code>, increment <code>++count</code>.</li>
        <li>Else (<code>x != candidate</code>), annihilate the pair by decrementing <code>--count</code>.</li>
      </ul>
      <p>In 1982, Jayadev Misra and David Gries generalized this to find all elements occurring strictly more than $\\lfloor N / k \\rfloor$ times using at most $k - 1$ candidate counters: when a new element $x$ arrives and is not among the $k - 1$ tracked keys (and all $k - 1$ slots are non-zero), decrement <strong>all $k - 1$ counters by 1</strong>—forming a cancelled $k$-tuple of $k$ mutually distinct elements!</p>

      <div class="invariant-box">
        <div class="invariant-title">Mathematical Proof: The Misra-Gries Frequency Lower Bound</div>
        <p>Let $f(x)$ be the true frequency of element $x$ in a stream of length $N$, and let $\\hat{f}(x)$ be its surviving counter in a Misra-Gries summary of capacity $k - 1$ ($\\hat{f}(x) = 0$ if $x$ is not tracked). Every decrement step removes $1$ count from $k$ <strong>distinct</strong> elements simultaneously (the incoming element $x$ plus the $k - 1$ active candidates). Let $D$ be the total number of $k$-tuple decrement events across the entire stream. Since each event consumes $k$ elements from the total stream of size $N$:</p>
        <p>$$k \\cdot D \\le N - \\sum_{y} \\hat{f}(y) \\le N \\implies D \\le \\frac{N}{k}$$</p>
        <p>Because element $x$ can lose at most $1$ count per decrement event $D$, its surviving counter satisfies:</p>
        <p>$$f(x) - \\frac{N}{k} \\le f(x) - D \\le \\hat{f}(x) \\le f(x)$$</p>
        <p>Therefore, <strong>every element with $f(x) &gt; N / k$ is guaranteed to have $\\hat{f}(x) &gt; 0$</strong> at the end of Pass 1! Furthermore, Misra-Gries summaries are <em>mergeable</em> across distributed shards by adding counter maps and repeatedly subtracting the $k$-th largest count.</p>
      </div>

      <h3>Streaming Frequency Estimation Algorithms Compared</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Target Threshold</th>
            <th>Space Complexity</th>
            <th>Update Time</th>
            <th>Deterministic Guarantee?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Boyer-Moore ($k = 2$)</td>
            <td>$f(x) &gt; N / 2$</td>
            <td>$O(1)$ (2 scalars)</td>
            <td>$O(1)$</td>
            <td>Deterministic (Pass 2 verifies if majority isn't promised)</td>
          </tr>
          <tr>
            <td>Misra-Gries ($k = 3$, Majority II)</td>
            <td>$f(x) &gt; N / 3$</td>
            <td>$O(1)$ (4 scalars)</td>
            <td>$O(1)$</td>
            <td>Deterministic (at most 2 elements can exceed $N/3$)</td>
          </tr>
          <tr>
            <td>General Misra-Gries / Frequent</td>
            <td>$f(x) &gt; N / k$ (or error $\\varepsilon N$)</td>
            <td>$O(k)$ ($k - 1$ counters)</td>
            <td>$O(1)$ amortized</td>
            <td>Deterministic: $f(x) - N/k \\le \\hat{f}(x) \\le f(x)$</td>
          </tr>
          <tr>
            <td>Count-Min Sketch</td>
            <td>Point query $\\pm \\varepsilon N$ w.p. $1 - \\delta$</td>
            <td>$O(\\frac{1}{\\varepsilon} \\log \\frac{1}{\\delta})$</td>
            <td>$O(\\log \\frac{1}{\\delta})$</td>
            <td>Probabilistic upper bound ($\\hat{f}(x) \\ge f(x)$); supports deletions</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing $k$-Tuple Cancellation ($k = 3$, Finding Elements $&gt; N / 3$)</h3>
      <svg viewBox="0 0 760 185" width="100%" height="auto" role="img" aria-label="Misra-Gries k=3 triplet cancellation diagram">
        <style>
          .mg-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .mg-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .mg-c1 { fill: rgba(59, 130, 246, 0.22); stroke: #3b82f6; stroke-width: 1.5; }
          .mg-c2 { fill: rgba(16, 185, 129, 0.22); stroke: #10b981; stroke-width: 1.5; }
          .mg-in { fill: rgba(239, 68, 68, 0.22); stroke: #ef4444; stroke-width: 1.5; }
          .mg-cancel { fill: rgba(245, 158, 11, 0.18); stroke: #f59e0b; stroke-width: 1.5; stroke-dasharray: 4 2; }
        </style>
        <text x="15" y="24" class="mg-title">Misra-Gries (k = 3): Track k - 1 = 2 Candidates. Incoming 3rd Distinct Key Triggers Triplet Annihilation!</text>

        <rect x="15" y="42" width="180" height="58" rx="4" class="mg-c1"/>
        <text x="105" y="65" text-anchor="middle" class="mg-txt">Candidate 1: Key A</text>
        <text x="105" y="83" text-anchor="middle" class="mg-txt">count_1 = 4 --&gt; 3</text>

        <rect x="210" y="42" width="180" height="58" rx="4" class="mg-c2"/>
        <text x="300" y="65" text-anchor="middle" class="mg-txt">Candidate 2: Key B</text>
        <text x="300" y="83" text-anchor="middle" class="mg-txt">count_2 = 2 --&gt; 1</text>

        <rect x="405" y="42" width="150" height="58" rx="4" class="mg-in"/>
        <text x="480" y="65" text-anchor="middle" class="mg-txt">Incoming: Key C</text>
        <text x="480" y="83" text-anchor="middle" class="mg-txt">(C != A and C != B)</text>

        <rect x="570" y="42" width="175" height="58" rx="4" class="mg-cancel"/>
        <text x="657" y="65" text-anchor="middle" class="mg-txt">Annihilated 3-Tuple</text>
        <text x="657" y="83" text-anchor="middle" class="mg-txt">{A, B, C} Deleted!</text>

        <text x="15" y="132" class="mg-txt">At most N / 3 triplet cancellations can occur across N items. Any item with true count &gt; N / 3 survives!</text>
        <text x="15" y="156" class="mg-txt">Critical Rule: Always check (x == cand1) and (x == cand2) BEFORE checking (count1 == 0) or (count2 == 0)!</text>
      </svg>

      <h3>Two-Pass Verification Pipeline for Heavy Hitters</h3>
      <div class="mermaid">
      flowchart LR
        A["Pass 1: Stream N items<br/>through k-1 Misra-Gries slots"] --> B["Produces <= k-1<br/>surviving candidates"]
        B --> C["Reset counters to 0<br/>(Keep candidate keys)"]
        C --> D["Pass 2: Count exact frequencies<br/>of surviving candidates"]
        D --> E["Filter candidates with<br/>exact_count > N / k"]
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Register-Pinned Counters &amp; Distributed Tree-AllReduce Merging</div>
        <p>For $k = 2$ (Boyer-Moore) and $k = 3$ (2 candidates), the entire state fits inside 2 to 4 general-purpose CPU registers (<code>rax, rbx, rcx, rdx</code>) with zero memory allocations and zero L1 cache traffic during the scan. Even more importantly for distributed telemetry engines (such as Google Monarch or ClickHouse), Boyer-Moore and Misra-Gries summaries form a <strong>commutative monoid approximation</strong>: two worker nodes can scan 1 billion log lines each in parallel and merge their $(cand, count)$ pairs in $O(k)$ time by adding matching candidate counts and subtracting the $k$-th largest count from all survivors.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-boyer-moore-misra-gries"></div>

      <h3>Production Implementation: Boyer-Moore &amp; $k=3$ Misra-Gries with 2-Pass Verification</h3>
      <pre><code class="language-cpp">#include &lt;cstdint&gt;
#include &lt;optional&gt;
#include &lt;vector&gt;

// Boyer-Moore Majority Vote with mandatory verification pass
std::optional&lt;int&gt; find_majority_element(const std::vector&lt;int&gt;&amp; nums) noexcept {
  int candidate = 0;
  std::size_t count = 0;

  for (int x : nums) {
    if (count == 0) {
      candidate = x;
      count = 1;
    } else if (x == candidate) {
      ++count;
    } else {
      --count;
    }
  }

  // Pass 2: Verify that candidate actually occurs &gt; N / 2 times
  std::size_t exact = 0;
  for (int x : nums) {
    if (x == candidate) ++exact;
  }
  if (exact &gt; nums.size() / 2) return candidate;
  return std::nullopt;
}

// Misra-Gries (k = 3): Find all elements appearing strictly more than floor(N / 3) times
std::vector&lt;int&gt; majority_element_n_over_3(const std::vector&lt;int&gt;&amp; nums) {
  int cand1 = 0, cand2 = 1; // Initialize to distinct dummy values
  std::size_t count1 = 0, count2 = 0;

  for (int x : nums) {
    // CRITICAL: Check equality with cand1 and cand2 FIRST before checking count == 0!
    if (count1 &gt; 0 &amp;&amp; x == cand1) {
      ++count1;
    } else if (count2 &gt; 0 &amp;&amp; x == cand2) {
      ++count2;
    } else if (count1 == 0) {
      cand1 = x;
      count1 = 1;
    } else if (count2 == 0) {
      cand2 = x;
      count2 = 1;
    } else {
      // 3 distinct elements {cand1, cand2, x} annihilate each other
      --count1;
      --count2;
    }
  }

  // Pass 2: Verify exact counts of surviving candidates
  std::size_t exact1 = 0, exact2 = 0;
  for (int x : nums) {
    if (count1 &gt; 0 &amp;&amp; x == cand1) ++exact1;
    else if (count2 &gt; 0 &amp;&amp; x == cand2) ++exact2;
  }

  std::vector&lt;int&gt; result;
  const std::size_t threshold = nums.size() / 3;
  if (exact1 &gt; threshold) result.push_back(cand1);
  if (exact2 &gt; threshold) result.push_back(cand2);
  return result;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Omitting Pass 2 Verification &amp; Duplicate Candidate Adoption in $k=3$</div>
        <p>Two subtle bugs break majority-vote implementations in interviews and production:</p>
        <ol>
          <li><strong>Skipping Pass 2 when majority is not guaranteed:</strong> On the input <code>[1, 1, 2, 2, 3]</code>, Boyer-Moore returns <code>candidate = 3</code> with <code>count = 1</code>, even though <code>3</code> appears only once ($20\\%$ of the stream)! Pass 1 only guarantees: <em>if</em> a majority element exists, it is the survivor. Unless the problem statement mathematically guarantees a majority exists, Pass 2 is mandatory.</li>
          <li><strong>Checking <code>count2 == 0</code> before <code>x == cand1</code> in $k = 3$:</strong> If you check <code>if (count1 == 0) ... else if (count2 == 0)</code> before checking <code>if (x == cand1)</code>, then on the input <code>[5, 5, ...]</code>, the second <code>5</code> will be assigned to <code>cand2</code>, placing the same key into both slots! Always test equality against active candidates before claiming an empty slot.</li>
        </ol>
      </div>
    `,
    keyTakeaways: [
      "Boyer-Moore Majority Vote pairs each majority occurrence against a distinct element, finding the > N/2 candidate in O(N) time and O(1) space.",
      "Misra-Gries generalizes pairwise cancellation to k-tuple cancellation using k - 1 counters, guaranteeing f(x) - N/k <= f_hat(x) <= f(x).",
      "Always execute a second linear verification pass when the input is not guaranteed to contain a heavy hitter exceeding N/k.",
      "In multi-candidate Misra-Gries (such as k = 3), always check if the incoming element matches an existing active candidate before assigning it to a zero-count slot."
    ],
    furtherReading: [
      {
        title: "Robert S. Boyer & J Strother Moore — MJRTY: A Fast Majority Vote Algorithm (1981)",
        url: "https://www.cs.utexas.edu/~moore/best-ideas/mjrty/",
        type: "Seminal Paper"
      },
      {
        title: "Jayadev Misra & David Gries — Finding Repeated Elements (Science of Computer Programming, 1982)",
        url: "https://www.cs.utexas.edu/~misra/scannedPdf.dir/FindRepeatedElements.pdf",
        type: "Seminal Paper"
      },
      {
        title: "Graham Cormode & M. Hadjieleftheriou — Finding the Frequent Items in Streams of Data (CACM, 2009)",
        url: "https://dimacs.rutgers.edu/~graham/pubs/papers/cacm-fhh.pdf",
        type: "Survey Paper"
      }
    ]
  },

  "build-dynamic-circular-deque": {
    title: "Build Lab: Dynamic Circular Buffer & Amortized O(1) Vector",
    video: {
      youtubeId: "dn01XST9-bI",
      id: "dn01XST9-bI",
      url: "https://www.youtube.com/embed/dn01XST9-bI",
      title: "Circular Queue & Ring Buffer Array Implementation (Modulo Wrap-Around)",
      channel: "Jenny's Lectures CS IT",
      duration: "24:13",
      start: 0,
      length: "24m",
      why: "Deep-dive lecture covering Build Lab: Dynamic Circular Buffer & Amortized O(1) Vector."
    },
    intuition: "A flat <code>std::vector</code> supports $O(1)$ amortized <code>push_back</code>, but <code>push_front</code> or <code>pop_front</code> shifts all $N$ elements in $\\Theta(N)$ time. By wrapping a contiguous power-of-two array into a ring indexed via bitwise AND masking <code>(head + i) & (cap - 1)</code>—and linearizing the ring during $2\\times$ geometric expansion—a dynamic circular deque achieves $O(1)$ amortized push/pop at both ends AND $O(1)$ random access in a single L1-friendly allocation.",
    content: `
      <h3>Ring Buffer Indexing: Power-of-Two Masking &amp; Full vs. Empty Disambiguation</h3>
      <p>Why do production ring buffers (Rust's <code>std::collections::VecDeque&lt;T&gt;</code>, Java's <code>ArrayDeque&lt;E&gt;</code>, Linux kernel <code>kfifo</code>, and LMAX Disruptor) enforce that capacity $C$ is always a <strong>power of two</strong> ($C = 2^p$)? Because wrapping an index modulo $C$ normally requires an integer division instruction (<code>div</code> on x86-64 takes 14–26 clock cycles and cannot be pipelined), whereas when $C = 2^p$, modulo reduces to a 1-cycle bitwise AND with $M = C - 1$:</p>
      <p>$$\\text{physical\\_index}(i) = (\\text{head} + i) \\bmod 2^p = (\\text{head} + i) \\mathrel{\\&amp;} (C - 1)$$</p>
      <p>How do we distinguish a <strong>completely full</strong> ring buffer from a <strong>completely empty</strong> ring buffer when both states have $\\text{head} \\equiv \\text{tail} \\pmod C$? There are two canonical engineering designs:</p>
      <ol>
        <li><strong>Explicit <code>head_</code> + <code>size_</code> (Rust <code>VecDeque</code> style):</strong> Store the physical index <code>head_</code> $\\in [0, C)$ and element count <code>size_</code> $\\in [0, C]$. The tail index is computed on the fly as <code>(head_ + size_) &amp; (cap_ - 1)</code>,Empty is <code>size_ == 0</code>, and Full is <code>size_ == cap_</code>.</li>
        <li><strong>Unmasked Monotonic <code>read_idx_</code> &amp; <code>write_idx_</code> (Linux <code>kfifo</code> style):</strong> Store monotonically increasing 64-bit unsigned counters <code>read_idx_</code> and <code>write_idx_</code> that are <em>only</em> masked with <code>&amp; (cap_ - 1)</code> at the moment of array indexing! Then <code>size() == write_idx_ - read_idx_</code>, Empty is <code>write_idx_ == read_idx_</code>, and Full is <code>write_idx_ - read_idx_ == cap_</code> (critical for lock-free Single-Producer Single-Consumer queues).</li>
      </ol>

      <div class="invariant-box">
        <div class="invariant-title">Structural Invariant: Two-Span Ring Linearization During Reallocation</div>
        <p>When a circular deque is full (<code>size_ == cap_</code>) and grows to $2C$, we cannot simply <code>memcpy</code> the underlying array of length $C$ directly into the new buffer if the logical sequence wraps around the physical boundary! Specifically, if $\\text{head} &gt; 0$, the logical elements $[0 \\dots C-1]$ are physically split into two contiguous spans:</p>
        <ul>
          <li><strong>First Span (Physical Suffix):</strong> <code>data_[head_ .. C - 1]</code> of length $L_1 = C - \\text{head}_-$ moves to <code>new_data[0 .. L_1 - 1]</code>.</li>
          <li><strong>Second Span (Physical Prefix):</strong> <code>data_[0 .. head_ - 1]</code> of length $L_2 = \\text{head}_-$ moves to <code>new_data[L_1 .. C - 1]</code>.</li>
        </ul>
        <p>After copying both spans, reset <code>head_ = 0</code> in the new buffer so the resized deque starts completely linearized!</p>
      </div>

      <h3>Architectural Comparison of Deque Implementations</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Implementation</th>
            <th><code>push_front</code> / <code>pop_front</code></th>
            <th>Random Access <code>d[i]</code></th>
            <th>Cache Misses per Scan</th>
            <th>Pointer Stability on Push?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>FlatCircularDeque (Rust <code>VecDeque</code> / Java <code>ArrayDeque</code>)</td>
            <td>$O(1)$ amortized</td>
            <td>$O(1)$ via <code>(head + i) &amp; mask</code></td>
            <td>Minimum ($1$ contiguous buffer)</td>
            <td>No (invalidated on $2\\times$ resize)</td>
          </tr>
          <tr>
            <td>Segmented Map Deque (C++ <code>std::deque</code>)</td>
            <td>$O(1)$ amortized</td>
            <td>$O(1)$ (double dereference: map $\to$ chunk)</td>
            <td>Higher (512B–4KB chunks scattered in heap)</td>
            <td>Yes (for push_front / push_back)</td>
          </tr>
          <tr>
            <td>Doubly Linked List (<code>std::list</code>)</td>
            <td>$O(1)$ worst-case</td>
            <td>$O(N)$ pointer chase</td>
            <td>Catastrophic (1 miss per element)</td>
            <td>Yes (all iterators stable)</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing Wrapped Physical Spans &amp; Unwrapping Upon $2\\times$ Growth</h3>
      <svg viewBox="0 0 760 195" width="100%" height="auto" role="img" aria-label="Circular buffer wrapped spans and linearization on resize">
        <style>
          .cb-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .cb-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .cb-s1 { fill: rgba(16, 185, 129, 0.25); stroke: #10b981; stroke-width: 1.5; }
          .cb-s2 { fill: rgba(59, 130, 246, 0.25); stroke: #3b82f6; stroke-width: 1.5; }
          .cb-empty { fill: rgba(148, 163, 184, 0.12); stroke: currentColor; stroke-opacity: 0.3; stroke-width: 1; stroke-dasharray: 4 2; }
        </style>
        <text x="15" y="24" class="cb-title">Before Resize (cap = 8, size = 8, head = 5): Logical [A, B, C, D, E, F, G, H] Wraps Around</text>

        <rect x="15" y="38" width="240" height="38" rx="3" class="cb-s2"/>
        <text x="135" y="61" text-anchor="middle" class="cb-txt">Span 2 [0..4]: D, E, F, G, H (tail)</text>

        <rect x="261" y="38" width="160" height="38" rx="3" class="cb-s1"/>
        <text x="341" y="61" text-anchor="middle" class="cb-txt">Span 1 [5..7]: A, B, C (head)</text>

        <text x="15" y="108" class="cb-title">After 2x Resize (new_cap = 16, head = 0): Unwrapped into Linear Order via Two Block Moves</text>

        <rect x="15" y="122" width="160" height="38" rx="3" class="cb-s1"/>
        <text x="95" y="145" text-anchor="middle" class="cb-txt">[0..2]: A, B, C</text>

        <rect x="179" y="122" width="240" height="38" rx="3" class="cb-s2"/>
        <text x="299" y="145" text-anchor="middle" class="cb-txt">[3..7]: D, E, F, G, H</text>

        <rect x="423" y="122" width="320" height="38" rx="3" class="cb-empty"/>
        <text x="583" y="145" text-anchor="middle" class="cb-txt">[8..15]: Free Slack Capacity (8 slots)</text>

        <text x="15" y="182" class="cb-txt">Bitmask Wrap: push_front decrements head = (head - 1) &amp; (cap - 1); push_back writes at (head + size) &amp; (cap - 1)</text>
      </svg>

      <h3>Circular Deque Operations &amp; Two-Span Reallocation Flow</h3>
      <div class="mermaid">
      flowchart LR
        A["push_front / push_back"] --> B{"size_ == cap_?"}
        B -- "Yes (Full)" --> C["Allocate new_cap = 2 * cap_<br/>Move Span 1 [head..cap)<br/>Move Span 2 [0..head)<br/>Reset head_ = 0"]
        B -- "No" --> D["push_front: head_ = (head_ - 1) & mask<br/>push_back: idx = (head_ + size_) & mask"]
        C --> D
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Why Rust's <code>VecDeque</code> Beats C++ <code>libstdc++ std::deque</code> in Cache Speed</div>
        <p>Because the C++ standard mandates that <code>std::deque::push_back</code> and <code>push_front</code> must never invalidate references to existing elements, <code>std::deque</code> cannot use a single resizable ring buffer. Instead, it uses a pointer-array directory ("map") pointing to fixed-size heap chunks (512 bytes in <code>libstdc++</code>, or absurdly just 16 bytes / 1 element in MSVC!). Every random access <code>dq[i]</code> executes a double pointer dereference, and iterating across chunk boundaries stalls hardware stride prefetchers. A single-buffer power-of-two ring deque (like Rust's <code>VecDeque</code> or the <code>CircularDeque</code> below) keeps all elements in one contiguous allocation, running $2\\times$ to $5\\times$ faster for sliding-window and BFS workloads.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-dynamic-array-amortized"></div>

      <h3>Production Implementation: Power-of-Two Dynamic Circular Deque</h3>
      <pre><code class="language-cpp">#include &lt;cassert&gt;
#include &lt;cstddef&gt;
#include &lt;memory&gt;
#include &lt;new&gt;
#include &lt;utility&gt;

template &lt;typename T&gt;
class CircularDeque {
  T* data_ = nullptr;
  std::size_t head_ = 0;
  std::size_t size_ = 0;
  std::size_t cap_ = 0; // Always a power of 2 when allocated (0 initially)

  std::size_t mask() const noexcept { return cap_ - 1; }

  void grow() {
    const std::size_t new_cap = (cap_ == 0) ? 8 : (cap_ * 2);
    T* new_data = static_cast&lt;T*&gt;(::operator new(new_cap * sizeof(T), std::align_val_t{alignof(T)}));

    if (size_ &gt; 0) {
      // Unwrap the two physical spans [head_ .. cap_) and [0 .. head_) into [0 .. size_)
      const std::size_t span1 = cap_ - head_;
      if (span1 &gt;= size_) {
        std::uninitialized_move_n(data_ + head_, size_, new_data);
      } else {
        std::uninitialized_move_n(data_ + head_, span1, new_data);
        std::uninitialized_move_n(data_, size_ - span1, new_data + span1);
      }
      for (std::size_t i = 0; i &lt; size_; ++i) {
        std::destroy_at(data_ + ((head_ + i) &amp; mask()));
      }
    }
    if (data_) {
      ::operator delete(data_, std::align_val_t{alignof(T)});
    }
    data_ = new_data;
    head_ = 0;
    cap_ = new_cap;
  }

public:
  CircularDeque() = default;

  ~CircularDeque() {
    for (std::size_t i = 0; i &lt; size_; ++i) {
      std::destroy_at(data_ + ((head_ + i) &amp; mask()));
    }
    if (data_) ::operator delete(data_, std::align_val_t{alignof(T)});
  }

  void push_back(T value) {
    if (size_ == cap_) grow();
    const std::size_t tail = (head_ + size_) &amp; mask();
    std::construct_at(data_ + tail, std::move(value));
    ++size_;
  }

  void push_front(T value) {
    if (size_ == cap_) grow();
    // Unsigned wrap-around: (0 - 1) &amp; (cap_ - 1) == cap_ - 1!
    head_ = (head_ - 1) &amp; mask();
    std::construct_at(data_ + head_, std::move(value));
    ++size_;
  }

  void pop_front() noexcept {
    assert(size_ &gt; 0);
    std::destroy_at(data_ + head_);
    head_ = (head_ + 1) &amp; mask();
    --size_;
  }

  void pop_back() noexcept {
    assert(size_ &gt; 0);
    --size_;
    const std::size_t tail = (head_ + size_) &amp; mask();
    std::destroy_at(data_ + tail);
  }

  T&amp; operator[](std::size_t i) noexcept {
    return data_[(head_ + i) &amp; mask()];
  }

  const T&amp; operator[](std::size_t i) const noexcept {
    return data_[(head_ + i) &amp; mask()];
  }

  std::size_t size() const noexcept { return size_; }
  std::size_t capacity() const noexcept { return cap_; }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Bitmasking Non-Power-of-Two Capacities &amp; Naive Copy on Resize</div>
        <p>Two catastrophic bugs plague custom circular buffers:</p>
        <ol>
          <li><strong>Using <code>&amp; (cap - 1)</code> when <code>cap</code> is not a power of two:</strong> Bitwise AND <code>x &amp; (cap - 1)</code> equals <code>x % cap</code> <strong>if and only if</strong> <code>cap</code> is an exact power of 2 ($2^p$). If you grow capacity by $1.5\\times$ (e.g., $C = 12, C - 1 = 11 = \text{0b1011}$), bit 2 is $0$, so <code>(head + i) &amp; 11</code> silently skips indices $4, 5, 6, 7$ and overwrites existing elements!</li>
          <li><strong>Copying <code>data_[0 .. size_]</code> without unwrapping on resize:</strong> When <code>head_ &gt; 0</code> and the buffer wraps around, doubling capacity changes the modulus from $C$ to $2C$. If you leave elements at their old physical indices without unwrapping Span 1 and Span 2 into contiguous order, <code>(head_ + i) &amp; (2C - 1)</code> will read uninitialized garbage slots in $[C, C + \\text{head}_-)$.</li>
        </ol>
      </div>
    `,
    keyTakeaways: [
      "Enforcing a power-of-two capacity C = 2^p replaces slow 20-cycle modulo division (% C) with a single-cycle bitwise AND (& (C - 1)).",
      "Storing explicit (head_, size_) or unmasked monotonic 64-bit (read_idx_, write_idx_) cleanly distinguishes a full ring (size == cap) from an empty ring (size == 0) without wasting a sentinel slot.",
      "When doubling a wrapped circular buffer's capacity, you must linearize the two physical spans [head..cap) and [0..head) into [0..size) and reset head = 0.",
      "A single-buffer circular deque (like Rust's VecDeque) eliminates the double-dereference and chunk-boundary cache misses of C++ std::deque."
    ],
    furtherReading: [
      {
        title: "Rust Standard Library Source & Documentation: std::collections::VecDeque Ring Buffer Implementation",
        url: "https://doc.rust-lang.org/std/collections/struct.VecDeque.html",
        type: "Standard Library Reference"
      },
      {
        title: "Linux Kernel Documentation: kfifo Lockless Power-of-Two Circular Buffer Design",
        url: "https://docs.kernel.org/core-api/kernel-api.html",
        type: "Systems Documentation"
      },
      {
        title: "Pat Morin — Open Data Structures, Chapter 2: Array-Based Lists (ArrayDeque & DualArrayDeque)",
        url: "https://opendatastructures.org/ods-cpp/2_Array_Based_Lists.html",
        type: "Textbook"
      }
    ]
  }
};

