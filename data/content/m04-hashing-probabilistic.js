window.MODULE_CONTENT = window.MODULE_CONTENT || {};
window.MODULE_CONTENT["m04"] = {
  "universal-k-independent-hashing": {
    title: "Hash Functions: Division, Multiplicative, Universal & k-Independent Families",
    video: {
      youtubeId: "BRO7mVIFt08",
      title: "MIT 6.006 Lecture 8: Hashing with Chaining",
      channel: "MIT OpenCourseWare",
      duration: "50:48",
      start: 0,
      length: "50m",
      why: "Erik Demaine derives the Simple Uniform Hashing Assumption (SUHA), exposes why deterministic hash functions fail against adversarial inputs, and proves Carter-Wegman universal hashing collision bounds."
    },
    intuition: "<p>No single deterministic hash function $h: \\mathcal{U} \\to \\{0, 1, \\dots, m-1\\}$ can perform well on all inputs: by the <strong>Pigeonhole Principle</strong>, whenever the universe size $|\\mathcal{U}| \\ge N \\cdot m + 1$, there exists a subset of $N$ keys that all map to the exact same bucket, degrading lookup from $O(1)$ to $\\Theta(N)$. Moving randomness from the input distribution (which an adversary or structured workload controls) into the <strong>algorithm's runtime choice of hash function</strong> (via a random seed chosen at startup) restores provable $O(1)$ expected performance on <em>every</em> input sequence.</p><p>While Carter-Wegman prime-field universal hashing ($h_{a,b}(x) = ((ax + b) \\bmod p) \\bmod m$) guarantees pairwise collision probability $\\le 1/m$, modern 64-bit hardware avoids slow <code>DIV</code> instructions via <strong>multiply-shift hashing</strong> and <strong>Fibonacci multiplicative hashing</strong>, achieving 2-universal or near-universal bit dispersion in 3 CPU cycles.</p>",
    content: `<div class="lesson-content">
      <h2>Deterministic Hashing vs Carter-Wegman Universal Families</h2>
      <p>Classical textbooks begin with the <strong>Simple Uniform Hashing Assumption (SUHA)</strong>, which posits that keys are drawn independently and uniformly from the universe $\\mathcal{U}$. In production systems, keys are never uniform: memory addresses are aligned multiples of $8$ or $16$, IPv4 subnets cluster in high bits, and sequential database IDs exhibit arithmetic progressions.</p>
      <ul>
        <li><strong>Division Method ($h(k) = k \\bmod m$):</strong> If $m = 2^r$, $k \\bmod 2^r$ simply extracts the lowest $r$ bits of $k$, ignoring the upper $w - r$ bits completely. For pointer keys aligned to 16-byte heap boundaries, the lowest 4 bits are always $0000_2$, leaving $15/16$ of buckets permanently empty. Choosing a prime $m$ not close to a power of $2$ mixes bits better, but 64-bit integer division (<code>DIV r64</code>) costs 20–40 cycles on modern x86-64 cores.</li>
        <li><strong>Fibonacci Multiplicative &amp; Multiply-Shift Hashing:</strong> Given word size $w = 64$ and table size $m = 2^r$, Knuth's multiplicative method multiplies $k$ by an odd constant $A \\approx \\phi^{-1} \\cdot 2^{64} = \\text{0x9E3779B97F4A7C15}$ (derived from the golden ratio $\\phi = (1+\\sqrt{5})/2$) and extracts the top $r$ bits: $h(k) = (k \\cdot A) \\gg (64 - r)$. Dietzfelbinger et al. proved that selecting a random odd 64-bit multiplier $a$ at startup makes $h_a(k) = (a \\cdot k) \\gg (64 - r)$ a <strong>2-approximate universal family</strong> with collision probability $\\le 2/m$.</li>
        <li><strong>Carter-Wegman Universal Family ($\\mathcal{H}_{p,m}$):</strong> Choose a prime $p > |\\mathcal{U}|$ (e.g., Mersenne prime $p = 2^{61} - 1$), and draw random $a \\in \\{1, \\dots, p-1\\}$, $b \\in \\{0, \\dots, p-1\\}$. Then $h_{a,b}(k) = ((ak + b) \\bmod p) \\bmod m$ satisfies strict universality: $\\Pr_{h \\in \\mathcal{H}}[h(x) = h(y)] \\le 1/m$ for all $x \\ne y$.</li>
      </ul>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Hash Family</th>
            <th>Formula ($m = 2^r$ or prime)</th>
            <th>Independence</th>
            <th>Collision Bound ($x \\ne y$)</th>
            <th>CPU Latency (x86-64)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Division Method</td>
            <td>$k \\bmod m$</td>
            <td>Deterministic (0)</td>
            <td>Adversarial $1$</td>
            <td>20–40 cycles (<code>DIV</code>)</td>
          </tr>
          <tr>
            <td>Multiply-Shift (Dietzfelbinger)</td>
            <td>$(a \\cdot k) \\gg (w - r)$, odd $a$</td>
            <td>Near 2-Universal</td>
            <td>$\\le 2 / m$</td>
            <td>3–4 cycles (<code>IMUL</code> + <code>SHR</code>)</td>
          </tr>
          <tr>
            <td>Multiply-Add-Shift (Strong)</td>
            <td>$((a \\cdot k + b) \\bmod 2^{2w}) \\gg (2w - r)$</td>
            <td>Pairwise (2-Indep.)</td>
            <td>$= 1 / m$</td>
            <td>5–6 cycles (128-bit product)</td>
          </tr>
          <tr>
            <td>Carter-Wegman Polynomial</td>
            <td>$\\left(\\sum_{i=0}^{k-1} a_i x^i \\bmod p\\right) \\bmod m$</td>
            <td>$k$-Wise Independent</td>
            <td>$= 1 / m^k$ ($k$-tuple)</td>
            <td>$O(k)$ Mul-Add + Mersenne fold</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Formal Proof: Expected Chain Length Under Universal Hashing</h4>
        <p><strong>Definition (Universal Family):</strong> A family $\\mathcal{H}$ of hash functions mapping $\\mathcal{U} \\to \\{0, \\dots, m-1\\}$ is <em>universal</em> if for every distinct pair $x, y \\in \\mathcal{U}$ ($x \\ne y$):</p>
        <p>$$\\Pr_{h \\sim \\mathcal{H}}[h(x) = h(y)] \\le \\frac{1}{m}$$</p>
        <p><strong>Theorem:</strong> For any fixed set $S \\subseteq \\mathcal{U}$ of $n$ keys and any query key $q$, let $C_{q,x} = \\mathbb{I}[h(q) = h(x)]$ be the indicator random variable for a collision between $q$ and $x \\in S \\setminus \\{q\\}$. By <strong>linearity of expectation</strong> (which requires <em>no</em> higher-order independence beyond pairwise):</p>
        <p>$$\\mathbb{E}_{h}\\left[\\sum_{x \\in S \\setminus \\{q\\}} C_{q,x}\\right] = \\sum_{x \\in S \\setminus \\{q\\}} \\Pr[h(q) = h(x)] \\le \\sum_{x \\in S \\setminus \\{q\\}} \\frac{1}{m} \\le \\frac{n}{m} = \\alpha$$</p>
        <p>Thus expected lookup cost is bounded by $1 + \\alpha = O(1)$ even if an adversary selects $S$ and $q$, provided the adversary does not know the random seed $(a, b)$ chosen from $\\mathcal{H}$.</p>
      </div>

      <h2>Visualizing Multiply-Shift &amp; Carter-Wegman Bit Dispersion</h2>
      <p>The SVG diagram below contrasts naive modulo masking against 64-bit Multiply-Shift hashing, where low-entropy key bits are diffused upward into the top $r$ index bits via multiplication by an odd 64-bit random seed.</p>

      <svg viewBox="0 0 740 240" width="100%" height="240" role="img" aria-label="Multiply-Shift and Universal Hashing bit mixing pipeline">
        <defs>
          <style>
            .uh-box { fill: #0f172a; stroke: #334155; stroke-width: 1.8; rx: 6; }
            .uh-hi { fill: #1e293b; stroke: #38bdf8; stroke-width: 2; rx: 6; }
            .uh-good { fill: #052e16; stroke: #22c55e; stroke-width: 2; rx: 6; }
            .uh-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; }
            .uh-sub { fill: #94a3b8; font-family: monospace; font-size: 11px; }
            .uh-arr { stroke: #38bdf8; stroke-width: 2; fill: none; }
          </style>
        </defs>
        <rect class="uh-box" x="20" y="25" width="210" height="58"/>
        <text class="uh-txt" x="32" y="48">64-bit Key k (Aligned Ptr)</text>
        <text class="uh-sub" x="32" y="68">0x00007F9A_004210_00 (low 4b=0)</text>

        <rect class="uh-hi" x="270" y="25" width="215" height="58"/>
        <text class="uh-txt" x="282" y="48">× Odd Seed a (64-bit)</text>
        <text class="uh-sub" x="282" y="68">0x9E3779B97F4A7C15 | 1</text>

        <rect class="uh-good" x="525" y="25" width="195" height="58"/>
        <text class="uh-txt" x="537" y="48">Top r Bits: (a·k) &gt;&gt; (64-r)</text>
        <text class="uh-sub" x="537" y="68" fill="#4ade80">Bucket ∈ [0, 2^r - 1]</text>

        <line class="uh-arr" x1="230" y1="54" x2="270" y2="54"/>
        <line class="uh-arr" x1="485" y1="54" x2="525" y2="54"/>

        <rect class="uh-box" x="20" y="115" width="700" height="105"/>
        <text class="uh-txt" x="35" y="140" fill="#fbbf24">k-Independent Polynomial Family over Mersenne Prime p = 2^61 - 1:</text>
        <text class="uh-txt" x="35" y="168">h(x) = ( (a_{k-1}·x^{k-1} + ... + a_1·x + a_0) mod (2^61 - 1) ) mod m</text>
        <text class="uh-sub" x="35" y="195">• k=2 (Pairwise): Chaining, Count-Min Sketch   • k=5: Linear Probing O(1)   • k=O(log n): Cuckoo Hashing</text>
      </svg>

      <div class="mermaid">
flowchart LR
  K["Input Key x ∈ U"] --> P{"Key Width?"}
  P -- "64-bit Integer" --> MS["Multiply-Add-Shift\n((a·x + b) >> (64 - r))"]
  P -- "Variable String / Bytes" --> POLY["Polynomial Rolling / WyHash\n Fold 64-bit blocks mod 2^61-1"]
  MS --> F["Final Mixing (Murmur3 / SplitMix64 Avalanche)"]
  POLY --> F
  F --> B["Bucket Index h(x) ∈ [0, m-1]"]
      </div>

      <div class="simulator-mount" data-sim="sim-universal-siphash-dos"></div>

      <div class="hardware-box">
        <h4>Hardware Reality: Fast Mersenne Modulo ($2^{61}-1$) &amp; Lemire's FastRange</h4>
        <p>Executing <code>x % p</code> via hardware <code>DIV</code> takes 20–40 cycles and blocks the execution port. However, when $p = 2^{61} - 1$ is a Mersenne prime, $2^{61} \\equiv 1 \\pmod p$. Any 128-bit product $z = a \\cdot x$ can be reduced modulo $2^{61}-1$ using <strong>zero divisions</strong>: split $z$ into its low 61 bits ($z \\mathbin{\\&} p$) and upper bits ($z \\gg 61$), add them together, and subtract $p$ if the sum $\\ge p$. Similarly, mapping a 32-bit hash $h$ into an arbitrary non-power-of-two bucket count $m$ without <code>DIV</code> uses <strong>Lemire's FastRange</strong>: $\\lfloor (h \\cdot m) / 2^{32} \\rfloor = (\\text{uint64\\_t}(h) \\cdot m) \\gg 32$.</p>
      </div>

      <h2>Production C++20 Implementation: Pairwise-Independent &amp; Mersenne $k$-Independent Hashers</h2>
      <pre><code class="language-cpp">// C++20: Dietzfelbinger Multiply-Add-Shift (2-Independent) &amp; Carter-Wegman mod (2^61 - 1)
#include &lt;cstdint&gt;
#include &lt;array&gt;

// 1. Strongly 2-Universal (Pairwise Independent) Multiply-Add-Shift from 64-bit to r bits
struct MultiplyAddShiftHash {
    __uint128_t a; // Random odd 128-bit multiplier
    __uint128_t b; // Random 128-bit additive offset
    uint32_t r;    // log2(table_size)

    uint64_t operator()(uint64_t key) const noexcept {
        // Full 128-bit arithmetic modulo 2^128, then extract top r bits of low 64-bit half
        uint64_t mixed = static_cast&lt;uint64_t&gt;((a * key + b) &gt;&gt; 64);
        return mixed &gt;&gt; (64 - r);
    }
};

// 2. Branchless Mersenne Prime (p = 2^61 - 1) k-Independent Polynomial Hash
template &lt;size_t K&gt;
class MersenneKIndependentHash {
    static constexpr uint64_t P = (1ULL &lt;&lt; 61) - 1;
    std::array&lt;uint64_t, K&gt; coeff_; // Random seeds in [0, P - 1]

    static uint64_t modMersenne(__uint128_t z) noexcept {
        uint64_t res = static_cast&lt;uint64_t&gt;(z &amp; P) + static_cast&lt;uint64_t&gt;(z &gt;&gt; 61);
        return (res &gt;= P) ? (res - P) : res;
    }

public:
    explicit constexpr MersenneKIndependentHash(std::array&lt;uint64_t, K&gt; seeds) noexcept
        : coeff_(seeds) {}

    uint64_t evaluate(uint64_t x) const noexcept {
        x = modMersenne(x);
        uint64_t acc = coeff_[K - 1];
        for (size_t i = K - 1; i-- &gt; 0; ) {
            acc = modMersenne(static_cast&lt;__uint128_t&gt;(acc) * x + coeff_[i]);
        }
        return acc; // Uniformly distributed in [0, 2^61 - 2]
    }

    // Lemire's FastRange reduction to [0, m - 1] without integer division
    uint32_t bucket(uint64_t x, uint32_t m) const noexcept {
        uint64_t h32 = evaluate(x) &amp; 0xFFFFFFFFULL;
        return static_cast&lt;uint32_t&gt;((h32 * static_cast&lt;uint64_t&gt;(m)) &gt;&gt; 32);
    }
};</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>C++ <code>std::hash&lt;uint64_t&gt;</code> Identity Function Trap:</strong> In <code>libstdc++</code> (GCC) and <code>libc++</code> (Clang), <code>std::hash&lt;uint64_t&gt;</code> is implemented as the <strong>identity function</strong> <code>return x;</code>! Passing pointer keys or multiples of $2^k$ into a power-of-two table without a finalizer (like SplitMix64 or Fibonacci multiplication) causes catastrophic $O(N)$ bucket collisions.</li>
          <li><strong>Insufficient Independence for Linear Probing:</strong> While 2-independence (pairwise independence) suffices for Separate Chaining and Count-Min Sketch, Pagh et al. proved that 2-independent families can suffer $\\Omega(\\log N)$ expected probe lengths in Linear Probing; <strong>5-independence</strong> (or Practical Tabulation Hashing) is required to guarantee $O(1)$ expected probes in Linear Probing.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "Deterministic hash functions always admit worst-case O(N) collision sets when |U| > N·m; Universal Hashing randomizes the function choice h ∈ H at runtime so every input achieves O(1 + α) expected lookups.",
      "Linearity of expectation requires only pairwise collision bounds Pr[h(x) = h(y)] ≤ 1/m to prove that expected chain length is at most 1 + α.",
      "Dietzfelbinger's Multiply-Shift hashing (a·k >> (64-r) with random odd a) achieves 2/m collision bounds in 3 CPU cycles without slow hardware DIV instructions.",
      "Mersenne primes (p = 2^61 - 1) allow k-wise independent polynomial evaluation using bitwise shifts and additions instead of 128-bit division."
    ],
    furtherReading: [
      { title: "Carter & Wegman (1979): Universal Classes of Hash Functions (JCSS)", url: "https://doi.org/10.1016/0022-0000(79)90044-8" },
      { title: "CLRS (4th Ed.), Chapter 11.3–11.5: Hash Functions & Universal Hashing", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "Knuth TAOCP Vol. 3, Section 6.4: Multiplicative & Fibonacci Hashing", url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html" }
    ]
  },

  "separate-chaining-vs-open-addressing": {
    title: "Collision Resolution: Separate Chaining vs Linear/Quadratic/Double Probing",
    video: {
      youtubeId: "rvdJDijO2Ro",
      title: "MIT 6.006 Lecture 10: Open Addressing, Cryptographic Hashing",
      channel: "MIT OpenCourseWare",
      duration: "49:05",
      start: 0,
      length: "49m",
      why: "Srini Devadas derives the probe sequence invariants of open addressing, explains why deletions require tombstones, and contrasts primary clustering in linear probing against double hashing."
    },
    intuition: "<p>When two distinct keys collide at bucket $h(k)$, a hash table must choose between two memory topologies: <strong>Separate Chaining</strong> allocates auxiliary linked nodes outside the bucket array, whereas <strong>Open Addressing</strong> stores all keys directly inside a flat contiguous array and probes alternative slots $h(k, i)$ for $i = 0, 1, \\dots, m-1$ until an empty slot is found.</p><p>In the theoretical RAM model, Double Hashing ($1/(1-\\alpha)$ probes) strictly dominates Linear Probing ($\\frac{1}{2}(1 + 1/(1-\\alpha)^2)$ probes) because Linear Probing suffers from <strong>primary clustering</strong>—long runs of occupied slots snow-ball as wider targets for new insertions. On physical CPUs, however, Linear Probing scans 8 consecutive 8-byte slots inside a single <strong>64-byte L1 cache line</strong> up to $\\alpha \\le 0.75$, outperforming pointer-chased Separate Chaining and cache-missing Double Hashing by $3\\times$ to $8\\times$.</p>",
    content: `<div class="lesson-content">
      <h2>Separate Chaining vs Open Addressing Probe Sequences</h2>
      <p>Define the <strong>load factor</strong> $\\alpha = n / m$, where $n$ is the number of stored elements and $m$ is the number of bucket slots:</p>
      <ul>
        <li><strong>Separate Chaining ($\alpha$ can exceed $1$):</strong> Each slot stores a pointer to a linked list (or small inline vector) of colliding entries. Under uniform hashing, an unsuccessful search inspects $\\alpha$ nodes and a successful search inspects $1 + \\alpha/2$ nodes on average. However, every node allocation incurs <code>malloc</code> overhead (16 bytes) + an 8-byte <code>next</code> pointer, and traversing a chain dereferences non-contiguous heap addresses (L3/DRAM cache misses).</li>
        <li><strong>Linear Probing ($h(k, i) = (h(k) + i) \\bmod m$):</strong> Probes adjacent slots sequentially. Maximizes spatial locality and hardware stream prefetching, but suffers from <strong>primary clustering</strong>: any key hashing anywhere inside a contiguous cluster of length $L$ extends that cluster to $L + 1$ with probability $(L + 1)/m$.</li>
        <li><strong>Quadratic Probing ($h(k, i) = (h(k) + c_1 i + c_2 i^2) \\bmod m$):</strong> Eliminates primary clustering by jumping quadratically, leaving only milder <em>secondary clustering</em> (keys with the exact same initial $h(k)$ follow the same trajectory). When $m = 2^r$ and $c_1 = c_2 = 1/2$, the triangular numbers $h(k, i) = (h(k) + i(i+1)/2) \\bmod 2^r$ are guaranteed to visit <strong>every</strong> slot in $\\{0, \\dots, 2^r - 1\\}$ exactly once!</li>
        <li><strong>Double Hashing ($h(k, i) = (h_1(k) + i \\cdot h_2(k)) \\bmod m$):</strong> Uses a second independent hash $h_2(k)$ coprime to $m$ (e.g., $h_2(k)$ odd when $m = 2^r$, or $h_2(k) \\in [1, m-1]$ when $m$ is prime). Generates $m^2$ distinct probe sequences, eliminating both primary and secondary clustering at the cost of a new cache miss on nearly every probe step.</li>
      </ul>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Collision Strategy</th>
            <th>Expected Probes (Successful)</th>
            <th>Expected Probes (Unsuccessful)</th>
            <th>Probes at $\\alpha = 0.75$ (Miss)</th>
            <th>Cache Line Locality</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Separate Chaining</td>
            <td>$1 + \\frac{\\alpha}{2}$</td>
            <td>$1 + \\alpha$</td>
            <td>$1.75$</td>
            <td>Poor (Pointer chasing across heap)</td>
          </tr>
          <tr>
            <td>Linear Probing (Knuth)</td>
            <td>$\\frac{1}{2}\\left(1 + \\frac{1}{1 - \\alpha}\\right)$</td>
            <td>$\\frac{1}{2}\\left(1 + \\frac{1}{(1 - \\alpha)^2}\\right)$</td>
            <td>$8.50$</td>
            <td>Optimal (Stride-1 within 64B line)</td>
          </tr>
          <tr>
            <td>Quadratic / Triangular</td>
            <td>$1 - \\ln(1 - \\alpha) - \\frac{\\alpha}{2}$</td>
            <td>$\\frac{1}{1 - \\alpha} - \\alpha - \\ln(1 - \\alpha)$</td>
            <td>$4.64$</td>
            <td>Moderate (First 3 steps in 1–2 lines)</td>
          </tr>
          <tr>
            <td>Double Hashing (Uniform)</td>
            <td>$\\frac{1}{\\alpha} \\ln\\left(\\frac{1}{1 - \\alpha}\\right)$</td>
            <td>$\\frac{1}{1 - \\alpha}$</td>
            <td>$4.00$</td>
            <td>Poor (Random jump per probe)</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Formal Specification:Probe Chain Continuity &amp; The Tombstone Invariant</h4>
        <p><strong>Probe Chain Invariant:</strong> For every key $k$ present at slot $h(k, j)$ in an open-addressed table, every preceding probe slot $h(k, 0), h(k, 1), \\dots, h(k, j-1)$ must be strictly <strong>non-empty</strong> (either <code>OCCUPIED</code> or <code>TOMBSTONE</code>).</p>
        <p><strong>Why Naive Deletion Corrupts Open Addressing:</strong> Suppose $k_1$ and $k_2$ both hash to slot $4$, so $k_1$ sits at slot $4$ and $k_2$ probes to slot $5$. If <code>erase(k1)</code> resets slot $4$ to <code>EMPTY</code>, a subsequent <code>find(k2)</code> starts at slot $4$, sees <code>EMPTY</code>, and falsely returns <code>NOT_FOUND</code>! Therefore, standard open addressing replaces deleted entries with a <code>TOMBSTONE</code> sentinel: <code>find</code> treats <code>TOMBSTONE</code> as occupied (keep probing), whereas <code>insert</code> records the first <code>TOMBSTONE</code> seen and reuses it once it verifies $k$ does not already exist further down the probe chain.</p>
      </div>

      <h2>Visualizing Primary Clustering &amp; Tombstone Accumulation</h2>
      <p>The SVG diagram below illustrates how a contiguous cluster of 4 elements in Linear Probing captures any hash landing in slots $[2..6]$ (probability $5/m$), and how replacing slot $3$ with a <code>TOMBSTONE</code> preserves the search bridge to keys shifted to slots $4$ and $5$.</p>

      <svg viewBox="0 0 740 220" width="100%" height="220" role="img" aria-label="Linear Probing Primary Clustering and Tombstone Bridge">
        <defs>
          <style>
            .lp-empty { fill: #0f172a; stroke: #334155; stroke-width: 1.8; rx: 5; }
            .lp-occ { fill: #1e293b; stroke: #38bdf8; stroke-width: 2; rx: 5; }
            .lp-tomb { fill: #3b0764; stroke: #c084fc; stroke-width: 2; stroke-dasharray: 4 3; rx: 5; }
            .lp-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; text-anchor: middle; }
            .lp-sub { fill: #94a3b8; font-family: monospace; font-size: 11px; text-anchor: middle; }
            .lp-arc { fill: none; stroke: #f59e0b; stroke-width: 2; stroke-dasharray: 4 3; }
          </style>
        </defs>
        <text x="20" y="25" fill="#cbd5e1" font-family="monospace" font-size="12">Linear Probing Array (m = 8): Keys K1(h=2), K2(h=2), K3(h=3), K4(h=2) after erase(K2 at [3])</text>

        <rect class="lp-empty" x="20" y="50" width="80" height="65"/><text class="lp-txt" x="60" y="78">EMPTY</text><text class="lp-sub" x="60" y="100">[0]</text>
        <rect class="lp-empty" x="108" y="50" width="80" height="65"/><text class="lp-txt" x="148" y="78">EMPTY</text><text class="lp-sub" x="148" y="100">[1]</text>
        <rect class="lp-occ" x="196" y="50" width="80" height="65"/><text class="lp-txt" x="236" y="78">K1 (h=2)</text><text class="lp-sub" x="236" y="100">[2]</text>
        <rect class="lp-tomb" x="284" y="50" width="80" height="65"/><text class="lp-txt" x="324" y="78" fill="#e9d5ff">TOMB</text><text class="lp-sub" x="324" y="100">[3] del K2</text>
        <rect class="lp-occ" x="372" y="50" width="80" height="65"/><text class="lp-txt" x="412" y="78">K3 (h=3)</text><text class="lp-sub" x="412" y="100">[4]</text>
        <rect class="lp-occ" x="460" y="50" width="80" height="65"/><text class="lp-txt" x="500" y="78">K4 (h=2)</text><text class="lp-sub" x="500" y="100">[5]</text>
        <rect class="lp-empty" x="548" y="50" width="80" height="65"/><text class="lp-txt" x="588" y="78">EMPTY</text><text class="lp-sub" x="588" y="100">[6]</text>
        <rect class="lp-empty" x="636" y="50" width="80" height="65"/><text class="lp-txt" x="676" y="78">EMPTY</text><text class="lp-sub" x="676" y="100">[7]</text>

        <path class="lp-arc" d="M 236 125 Q 368 185 500 125"/>
        <text x="370" y="175" fill="#fbbf24" font-family="monospace" font-size="11.5" text-anchor="middle">find(K4): starts at [2] → crosses TOMB at [3] → skips [4] → finds K4 at [5]</text>
        <text x="370" y="198" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">Note: Effective Miss Load Factor α_eff = (n_live + n_tombstones) / m</text>
      </svg>

      <div class="mermaid">
flowchart TD
  Start["insert(key, val): i = 0, firstTomb = -1"] --> Probe["idx = (h(key) + (i + i*i)/2) & (m - 1)"]
  Probe --> State{"Slot[idx] State?"}
  State -- "OCCUPIED & key matches" --> Update["Overwrite Slot[idx].val = val\nReturn (Existing Key)"]
  State -- "OCCUPIED & key differs" --> Next["i++"] --> Probe
  State -- "TOMBSTONE" --> SaveTomb["if (firstTomb == -1) firstTomb = idx\ni++ (Must keep checking for duplicate key!)"] --> Probe
  State -- "EMPTY" --> Place["target = (firstTomb != -1) ? firstTomb : idx\nWrite (key, val) at Slot[target]"]
      </div>

      <div class="simulator-mount" data-sim="sim-robin-hood-swisstable"></div>

      <div class="hardware-box">
        <h4>Hardware Reality: Why Tombstones Silently Degrade $O(1)$ Tables</h4>
        <p>In workloads with heavy churn (frequent <code>insert</code> and <code>erase</code> keeping live count $n$ constant), <code>TOMBSTONE</code> slots accumulate. Because unsuccessful lookups (<code>find</code> for missing keys) can only stop at a true <code>EMPTY</code> slot, the effective load factor for misses is $\\alpha_{\\text{eff}} = (n_{\\text{live}} + n_{\\text{tomb}}) / m$. Even if $n_{\\text{live}} / m = 0.25$, once $n_{\\text{tomb}} / m$ reaches $0.70$, every cache-miss lookup scans $\\frac{1}{2}(1 + 1/(1 - 0.95)^2) \\approx 200$ slots! Production open-addressed tables track <code>n_live + n_tomb</code> and trigger a <strong>same-capacity tombstone-purging rehash</strong> when <code>n_live + n_tomb > 0.75 * m</code> while <code>n_live < 0.50 * m</code>.</p>
      </div>

      <h2>Production C++20 Implementation: Power-of-Two Triangular Quadratic Probing</h2>
      <pre><code class="language-cpp">// C++20: Open-Addressed Hash Table with Triangular Quadratic Probing &amp; Tombstone Rehash
#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;optional&gt;

template &lt;typename K, typename V&gt;
class TriangularProbeMap {
    enum class State : uint8_t { EMPTY = 0, OCCUPIED = 1, TOMBSTONE = 2 };
    struct Slot {
        K key{};
        V val{};
        State state = State::EMPTY;
    };

    std::vector&lt;Slot&gt; table_;
    size_t live_ = 0;
    size_t tombs_ = 0;

    static uint64_t hash64(uint64_t x) noexcept {
        x = (x ^ (x &gt;&gt; 30)) * 0xbf58476d1ce4e5b9ULL;
        x = (x ^ (x &gt;&gt; 27)) * 0x94d049bb133111ebULL;
        return x ^ (x &gt;&gt; 31);
    }

    void rehash(size_t newCap) {
        std::vector&lt;Slot&gt; old = std::move(table_);
        table_.assign(newCap, Slot{});
        live_ = 0;
        tombs_ = 0;
        for (auto&amp; s : old) {
            if (s.state == State::OCCUPIED) insert(std::move(s.key), std::move(s.val));
        }
    }

public:
    explicit TriangularProbeMap(size_t pow2Cap = 16) : table_(pow2Cap) {}

    bool insert(K key, V val) {
        // Trigger resize or same-size tombstone cleanup when occupied + tombstones &gt;= 75%
        if ((live_ + tombs_) * 4 &gt;= table_.size() * 3) {
            size_t nextCap = (live_ * 2 &gt;= table_.size()) ? table_.size() * 2 : table_.size();
            rehash(nextCap);
        }
        const size_t mask = table_.size() - 1;
        size_t idx = hash64(static_cast&lt;uint64_t&gt;(key)) &amp; mask;
        size_t firstTomb = static_cast&lt;size_t&gt;(-1);

        for (size_t step = 1; ; ++step) {
            Slot&amp; s = table_[idx];
            if (s.state == State::EMPTY) {
                Slot&amp; target = (firstTomb != static_cast&lt;size_t&gt;(-1))
                               ? (--tombs_, table_[firstTomb]) : s;
                target.key = std::move(key);
                target.val = std::move(val);
                target.state = State::OCCUPIED;
                ++live_;
                return true;
            }
            if (s.state == State::TOMBSTONE) {
                if (firstTomb == static_cast&lt;size_t&gt;(-1)) firstTomb = idx;
            } else if (s.key == key) {
                s.val = std::move(val);
                return false;
            }
            // Triangular step: idx_{i} = (idx_{i-1} + step) mod 2^r visits all 2^r slots!
            idx = (idx + step) &amp; mask;
        }
    }

    std::optional&lt;V&gt; find(const K&amp; key) const {
        const size_t mask = table_.size() - 1;
        size_t idx = hash64(static_cast&lt;uint64_t&gt;(key)) &amp; mask;
        for (size_t step = 1; ; ++step) {
            const Slot&amp; s = table_[idx];
            if (s.state == State::EMPTY) return std::nullopt;
            if (s.state == State::OCCUPIED &amp;&amp; s.key == key) return s.val;
            idx = (idx + step) &amp; mask;
        }
    }
};</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Inserting Immediately at the First Tombstone Without Checking Remainder of Probe Chain:</strong> If <code>insert(k, v)</code> stops immediately upon seeing a <code>TOMBSTONE</code> and writes <code>k</code> there without continuing until <code>EMPTY</code> or <code>k</code>, a key <code>k</code> that already exists later in the probe chain will be duplicated in the table! Always record <code>firstTomb</code> and continue probing until <code>EMPTY</code> or an existing match.</li>
          <li><strong>Non-Coprime Step Size in Double Hashing:</strong> If $h_2(k)$ shares a common factor $g = \\gcd(h_2(k), m) > 1$ with table size $m$, the probe sequence visits only $m / g$ slots before cycling infinitely. With $m = 2^r$, always enforce <code>h2 = (raw_h2 * 2) | 1</code> so $h_2$ is strictly odd.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "Linear Probing suffers from primary clustering with expected miss cost 1/2 (1 + 1/(1-α)^2), yet outperforms Separate Chaining for α ≤ 0.75 due to 64-byte L1 cache line spatial locality.",
      "Triangular quadratic probing h(k, i) = (h(k) + i(i+1)/2) mod 2^r visits every slot of a power-of-two table exactly once while eliminating primary clustering.",
      "Open-addressed deletion requires TOMBSTONE sentinels so existing probe chains are not severed; insert must still scan past tombstones to prevent duplicate keys.",
      "Rehashing thresholds must monitor (n_live + n_tombstones) / m, running a same-capacity compaction rehash when tombstones bloat unsuccessful lookup latency."
    ],
    furtherReading: [
      { title: "Knuth TAOCP Vol. 3, Section 6.4: Linear Probing & Primary Clustering Derivation", url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html" },
      { title: "CLRS (4th Ed.), Chapter 11.4: Open Addressing", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "Sedgewick & Wayne, Algorithms (4th Ed.), Section 3.4: Hash Tables", url: "https://algs4.cs.princeton.edu/34hash/" }
    ]
  },

  "robin-hood-cuckoo-hashing": {
    title: "Variance Reduction: Robin Hood Hashing (PSL) & Cuckoo Hashing",
    video: {
      youtubeId: "M2-PXRHS2_w",
      id: "M2-PXRHS2_w",
      url: "https://www.youtube.com/embed/M2-PXRHS2_w",
      title: "Cuckoo Hashing & Open-Addressed Displacement Probing Explained",
      channel: "VividCode",
      duration: "12:18",
      start: 0,
      length: "12m",
      why: "Erik Demaine analyzes the bipartite cuckoo graph structure, proves why load factor α < 0.5 prevents bicyclic component overflow with high probability, and bounds worst-case lookups to 2 probes."
    },
    intuition: "<p>Standard Linear Probing is a \"first-come, first-served\" collision scheme: a key inserted early sits at its home bucket with <strong>Probe Sequence Length ($\\text{PSL} = 0$)</strong>, while a key inserted later into the same cluster may be pushed $40$ slots away ($\\text{PSL} = 40$). <strong>Robin Hood Hashing</strong> (Celis, Larson, Munro, 1985) leaves the <em>mean</em> probe length unchanged at $\\frac{1}{2}(1 + \\frac{1}{1-\\alpha})$, but crushes the <strong>variance</strong> from $O(1/(1-\\alpha)^3)$ down to $O(\\ln(1/(1-\\alpha)))$ by enforcing a simple rule: if the probing key has traveled further from its home bucket ($\\text{PSL}_{\\text{curr}} > \\text{PSL}_{\\text{occupant}}$), it steals the slot and the displaced \"rich\" occupant continues probing.</p><p><strong>Cuckoo Hashing</strong> (Pagh &amp; Rodler, 2004) goes even further: by giving every key two independent candidate locations $h_1(x)$ and $h_2(x)$ and evicting occupants along alternating Cuckoo paths during insertion, it guarantees <strong>strict worst-case $O(1)$ lookups (at most 2 memory reads)</strong>.</p>",
    content: `<div class="lesson-content">
      <h2>Robin Hood Hashing: PSL Monotonicity &amp; Tombstone-Free Deletion</h2>
      <p>For any key $k$ currently stored at index $i$ in a linear-probed table of size $m$, define its <strong>Probe Sequence Length (PSL)</strong> (also called <em>Displacement Ideal Distance</em>, DIB) as its modular distance from its home bucket:</p>
      <p>$$\\text{PSL}(k, i) = (i - h(k)) \\bmod m$$</p>
      <p>During <code>insert(k)</code>, we track <code>curr_psl = 0</code> starting at <code>idx = h(k)</code>. At each occupied slot <code>idx</code>, we compare <code>curr_psl</code> against <code>occupant_psl</code>. Whenever <code>curr_psl > occupant_psl</code>, we <strong>swap</strong> the incoming key with the occupant and continue probing with the displaced occupant. This maintains two powerful invariants:</p>
      <ul>
        <li><strong>Early-Exit Lookup Bound:</strong> Because keys along any contiguous cluster are ordered monotonically by their home buckets, if a lookup for <code>target</code> reaches a slot where <code>search_psl > occupant_psl</code>, <code>target</code> <strong>cannot exist anywhere further in the table</strong>—if it did, it would have stolen <code>occupant</code>'s slot during insertion! Thus unsuccessful searches terminate early without scanning to an <code>EMPTY</code> slot.</li>
        <li><strong>Tombstone-Free Backward-Shift Deletion:</strong> Instead of leaving a <code>TOMBSTONE</code> when deleting slot <code>idx</code>, Robin Hood inspects <code>next = (idx + 1) % m</code>. While <code>table[next]</code> is occupied and has <code>PSL > 0</code>, it shifts <code>table[next]</code> backward into <code>table[idx]</code> (decrementing its <code>PSL</code> by 1) and advances <code>idx = next</code>. Once it encounters an <code>EMPTY</code> slot or a key sitting at its home bucket (<code>PSL == 0</code>), it marks <code>table[idx] = EMPTY</code>, keeping the table 100% free of tombstones forever.</li>
      </ul>

      <h2>Cuckoo Hashing: Bipartite Eviction Graphs</h2>
      <p>In Cuckoo Hashing, two tables $T_1, T_2$ of size $m$ (or one table of size $2m$) use independent hash functions $h_1, h_2$. Every key $x$ resides <strong>exclusively</strong> at $T_1[h_1(x)]$ or $T_2[h_2(x)]$. Lookups and deletions check only those two slots in parallel—requiring at most 2 cache line reads in the worst case.</p>
      <p>To insert $x$, if $T_1[h_1(x)]$ is occupied by $y$, we place $x$ at $T_1[h_1(x)]$ and evict $y$ to its alternate home $T_2[h_2(y)]$, chaining evictions up to $\\text{MaxLoop} = \lceil 6 \\log_{1/(2\\alpha)} n \\rceil$ steps before triggering a rehash with fresh hash seeds.</p>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Open Addressing Scheme</th>
            <th>Expected Lookup</th>
            <th>Worst-Case Lookup (w.h.p.)</th>
            <th>Probe Variance</th>
            <th>Deletion Strategy &amp; Max Load $\\alpha$</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Standard Linear Probing</td>
            <td><span class="badge-o1">O(1)</span></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td>$\\Theta((1-\\alpha)^{-3})$</td>
            <td>Tombstones ($\\alpha \\le 0.75$)</td>
          </tr>
          <tr>
            <td>Robin Hood Linear Probing</td>
            <td><span class="badge-o1">O(1)</span></td>
            <td><span class="badge-ologn">O(log log N)</span> (Random)</td>
            <td>$\\Theta(\\ln((1-\\alpha)^{-1}))$</td>
            <td>Backward-Shift, 0 Tombstones ($\\alpha \\le 0.90$)</td>
          </tr>
          <tr>
            <td>2-Way Cuckoo ($d=2, b=1$)</td>
            <td><span class="badge-o1">O(1)</span></td>
            <td><span class="badge-o1">Strict 2 Probes</span></td>
            <td>$0$ (1 or 2 probes)</td>
            <td>Direct clear ($\\alpha < 0.50$)</td>
          </tr>
          <tr>
            <td>Bucketized Cuckoo ($d=2, b=4$)</td>
            <td><span class="badge-o1">O(1)</span></td>
            <td><span class="badge-o1">Strict 2 Cache Lines</span></td>
            <td>$0$ (2 buckets of 4)</td>
            <td>Direct clear ($\\alpha \\le 0.95$)</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Formal Specification: Robin Hood Early-Exit &amp; Cuckoo Graph Thresholds</h4>
        <p><strong>Robin Hood Ordering Invariant:</strong> In any contiguous block of occupied slots, keys appear in non-decreasing order of their home bucket $h(k)$. Consequently, for two adjacent slots $i$ and $i+1 = (i+1) \\bmod m$ in the same cluster, $\\text{PSL}(i+1) \\le \\text{PSL}(i) + 1$. During <code>find(q)</code>, if at probe step $d = (i - h(q)) \\bmod m$ the slot occupant has $\\text{PSL}(i) < d$, then $h(\\text{occupant}) > h(q)$ along the cluster, proving $q \\notin T$.</p>
        <p><strong>Cuckoo Graph Theorem (Pagh &amp; Rodler):</strong> Define the <em>Cuckoo Graph</em> $G = (V, E)$ with $2m$ vertices (table slots) and $n$ undirected edges $e_x = (h_1(x), h_2(x))$ for each key $x$. An insertion succeeds without rehash iff every connected component of $G$ is <strong>unicyclic or a tree</strong> (contains at most one cycle, so edges can be oriented with out-degree $\\le 1$). At load factor $\\alpha = n / (2m) = (1 - \\epsilon)/2 < 0.5$, random graph theory (Erdős–Rényi phase transition) guarantees no bicyclic component exists with probability $1 - O(1/n)$.</p>
      </div>

      <h2>Visualizing Robin Hood PSL Swapping &amp; Cuckoo Eviction Cycles</h2>
      <svg viewBox="0 0 740 245" width="100%" height="245" role="img" aria-label="Robin Hood PSL slot stealing and Cuckoo bipartite eviction">
        <defs>
          <style>
            .rh-cell { fill: #0f172a; stroke: #38bdf8; stroke-width: 1.8; rx: 5; }
            .rh-swap { fill: #052e16; stroke: #22c55e; stroke-width: 2.2; rx: 5; }
            .rh-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; text-anchor: middle; }
            .rh-sub { fill: #94a3b8; font-family: monospace; font-size: 10.5px; text-anchor: middle; }
            .ck-edge { stroke: #f59e0b; stroke-width: 2; fill: none; }
          </style>
        </defs>
        <text x="20" y="24" fill="#cbd5e1" font-family="monospace" font-size="12" font-weight="700">1. Robin Hood Swap: Inserting D (h=1) into [A(h=1), B(h=1), C(h=2)]</text>
        <rect class="rh-cell" x="20" y="40" width="95" height="62"/><text class="rh-txt" x="67" y="65">Key A</text><text class="rh-sub" x="67" y="88">[1] h=1 PSL=0</text>
        <rect class="rh-cell" x="125" y="40" width="95" height="62"/><text class="rh-txt" x="172" y="65">Key B</text><text class="rh-sub" x="172" y="88">[2] h=1 PSL=1</text>
        <rect class="rh-swap" x="230" y="40" width="125" height="62"/><text class="rh-txt" x="292" y="65" fill="#4ade80">D steals C!</text><text class="rh-sub" x="292" y="88" fill="#86efac">[3] D(PSL=2)&gt;C(PSL=1)</text>
        <rect class="rh-cell" x="365" y="40" width="95" height="62"/><text class="rh-txt" x="412" y="65">Key C</text><text class="rh-sub" x="412" y="88">[4] h=2 PSL=2</text>

        <text x="20" y="136" fill="#cbd5e1" font-family="monospace" font-size="12" font-weight="700">2. Cuckoo Hashing Bipartite Eviction &amp; Backward-Shift Deletion</text>
        <rect class="rh-cell" x="20" y="152" width="335" height="75"/>
        <text class="rh-txt" x="187" y="176" fill="#38bdf8">Backward-Shift Erase at [2]:</text>
        <text class="rh-sub" x="187" y="198">Shift [3]→[2] (PSL--), [4]→[3] (PSL--) until PSL==0 or EMPTY</text>
        <text class="rh-sub" x="187" y="216" fill="#4ade80">Zero Tombstones! Cluster shrinks cleanly.</text>

        <rect class="rh-cell" x="375" y="152" width="345" height="75"/>
        <text class="rh-txt" x="547" y="176" fill="#fbbf24">Cuckoo Bipartite Lookup (Worst-Case O(1)):</text>
        <text class="rh-sub" x="547" y="198">return T1[h1(x)] == x || T2[h2(x)] == x;</text>
        <text class="rh-sub" x="547" y="216">2 independent memory reads issued in parallel via MLP</text>
      </svg>

      <div class="mermaid">
flowchart LR
  subgraph BackwardShift["Robin Hood Tombstone-Free Erase(idx)"]
    A["Locate key at slot idx"] --> B["next = (idx + 1) & mask"]
    B --> C{"table[next] OCCUPIED\nAND table[next].psl > 0?"}
    C -- "Yes" --> D["table[idx] = table[next]\ntable[idx].psl--\nidx = next"] --> B
    C -- "No (EMPTY or PSL == 0)" --> E["table[idx] = EMPTY\nDone!"]
  end
      </div>

      <div class="simulator-mount" data-sim="sim-cuckoo-hashing"></div>

      <div class="hardware-box">
        <h4>Hardware Reality: Memory-Level Parallelism (MLP) in Cuckoo Hashing vs Cache Locality</h4>
        <p>In Cuckoo Hashing, <code>T1[h1(x)]</code> and <code>T2[h2(x)]</code> have no data dependency between them! An out-of-order CPU core issues both memory loads simultaneously into its Load-Store Queue (<strong>Memory-Level Parallelism, MLP</strong>), hiding the second DRAM latency completely behind the first. Furthermore, while classic 2-way Cuckoo caps load factor at $\\alpha < 0.50$, <strong>Bucketized Cuckoo Hashing</strong> (storing $b = 4$ slots per bucket so each bucket fits inside one 64-byte cache line, as used in <code>libcuckoo</code>) raises the phase-transition threshold from $49\\%$ to **$95\\%$ load factor** while still touching at most 2 cache lines per lookup!</p>
      </div>

      <h2>Production C++20 Implementation: Cuckoo Hash Table with Unicyclic Eviction Loop</h2>
      <pre><code class="language-cpp">// C++20: 2-Table Cuckoo Hash Map with Worst-Case 2-Probe Lookup &amp; Cycle Detection
#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;optional&gt;
#include &lt;utility&gt;

template &lt;typename V&gt;
class CuckooHashMap {
    struct Entry {
        uint64_t key = 0;
        V val{};
        bool occupied = false;
    };

    std::vector&lt;Entry&gt; t1_, t2_;
    size_t count_ = 0;
    uint64_t seed1_ = 0x9e3779b97f4a7c15ULL;
    uint64_t seed2_ = 0xbf58476d1ce4e5b9ULL;
    static constexpr size_t MAX_KICKS = 64;

    size_t h1(uint64_t k) const noexcept {
        k ^= seed1_; k *= 0xff51afd7ed558ccdULL;
        return (k ^ (k &gt;&gt; 33)) &amp; (t1_.size() - 1);
    }
    size_t h2(uint64_t k) const noexcept {
        k ^= seed2_; k *= 0xc4ceb9fe1a85ec53ULL;
        return (k ^ (k &gt;&gt; 33)) &amp; (t2_.size() - 1);
    }

    void rehash(size_t newHalfCap) {
        auto old1 = std::move(t1_);
        auto old2 = std::move(t2_);
        t1_.assign(newHalfCap, Entry{});
        t2_.assign(newHalfCap, Entry{});
        seed1_ = seed1_ * 6364136223846793005ULL + 1442695040888963407ULL;
        seed2_ = seed2_ * 2862933555777941757ULL + 3037000493ULL;
        count_ = 0;
        for (auto&amp; e : old1) if (e.occupied) insert(e.key, std::move(e.val));
        for (auto&amp; e : old2) if (e.occupied) insert(e.key, std::move(e.val));
    }

public:
    explicit CuckooHashMap(size_t pow2HalfCap = 16) : t1_(pow2HalfCap), t2_(pow2HalfCap) {}

    // Strict O(1) Worst-Case Lookup: Exactly 2 independent array reads
    std::optional&lt;V&gt; find(uint64_t key) const noexcept {
        const Entry&amp; e1 = t1_[h1(key)];
        const Entry&amp; e2 = t2_[h2(key)];
        if (e1.occupied &amp;&amp; e1.key == key) return e1.val;
        if (e2.occupied &amp;&amp; e2.key == key) return e2.val;
        return std::nullopt;
    }

    void insert(uint64_t key, V val) {
        if (Entry&amp; e1 = t1_[h1(key)]; e1.occupied &amp;&amp; e1.key == key) { e1.val = std::move(val); return; }
        if (Entry&amp; e2 = t2_[h2(key)]; e2.occupied &amp;&amp; e2.key == key) { e2.val = std::move(val); return; }

        if ((count_ + 1) * 5 &gt;= (t1_.size() + t2_.size()) * 2) { // Keep load factor &lt; 0.40
            rehash(t1_.size() * 2);
        }

        Entry cur{key, std::move(val), true};
        for (size_t kick = 0; kick &lt; MAX_KICKS; ++kick) {
            Entry&amp; slot1 = t1_[h1(cur.key)];
            if (!slot1.occupied) { slot1 = std::move(cur); ++count_; return; }
            std::swap(cur, slot1);

            Entry&amp; slot2 = t2_[h2(cur.key)];
            if (!slot2.occupied) { slot2 = std::move(cur); ++count_; return; }
            std::swap(cur, slot2);
        }
        // Bicyclic component detected: rehash with new seeds and re-insert displaced cur
        rehash(t1_.size() * 2);
        insert(cur.key, std::move(cur.val));
    }
};</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Shifting <code>PSL == 0</code> Keys During Robin Hood Backward-Shift Deletion:</strong> If <code>erase</code> shifts an adjacent key whose <code>PSL == 0</code> backward by 1 slot, that key moves <em>before</em> its home bucket $h(k)$ (giving it a wrapped <code>PSL = m - 1</code>) and renders it permanently unreachable by <code>find(k)</code>! Backward shift must stop immediately when <code>table[next].psl == 0</code>.</li>
          <li><strong>Single-Table Cuckoo Self-Loop ($h_1(x) == h_2(x)$):</strong> If both hash functions map into the same shared array of size $m$ and $h_1(x) = h_2(x)$ for some key $x$, a second key $y$ with $h_1(y) = h_2(y) = h_1(x)$ forms an immediate 2-element bicyclic crash. Either use two disjoint tables $T_1, T_2$ or force $h_2(x) \\ne h_1(x)$.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "Robin Hood Hashing swaps the probing key with an occupant whenever curr_psl > occupant_psl, leaving mean probe count unchanged while reducing probe length variance exponentially.",
      "Because keys in a Robin Hood cluster are ordered by home bucket, find(q) can terminate early as soon as search_psl > occupant_psl, and erase(q) uses backward-shift deletion to eliminate tombstones.",
      "Cuckoo Hashing stores each key x at either T1[h1(x)] or T2[h2(x)], guaranteeing strict worst-case O(1) lookups (at most 2 parallel memory reads).",
      "Standard 2-way Cuckoo Hashing requires load factor α < 0.50 to avoid bicyclic components in the bipartite cuckoo graph, while 4-slot Bucketized Cuckoo reaches α = 0.95."
    ],
    furtherReading: [
      { title: "Celis, Larson & Munro (1985): Robin Hood Hashing (IEEE FOCS / Waterloo TR)", url: "https://cs.uwaterloo.ca/research/tr/1986/CS-86-14.pdf" },
      { title: "Pagh & Rodler (2004): Cuckoo Hashing (Journal of Algorithms)", url: "https://doi.org/10.1016/j.jalgor.2003.12.002" },
      { title: "CLRS (4th Ed.), Chapter 11: Hash Tables", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
    ]
  },

  "hashdos-siphash-random-seeds": {
    title: "Algorithmic Complexity Attacks (HashDoS) & SipHash Defense",
    video: {
      youtubeId: "Vdrab3sB7MU",
      id: "Vdrab3sB7MU",
      url: "https://www.youtube.com/embed/Vdrab3sB7MU",
      title: "29C3: Hash-Flooding DoS Reloaded — Algorithmic Complexity Attacks & SipHash Defense",
      channel: "CCC (29C3)",
      duration: "57:10",
      start: 0,
      length: "57m",
      why: "Srini Devadas explains preimage resistance, second-preimage resistance, and collision resistance, establishing why unkeyed non-cryptographic hashes fail against adversarial inputs."
    },
    intuition: "<p>In December 2011 (28C3, Klink &amp; Wälde, building on Crosby &amp; Wallach 2003), security researchers demonstrated that a single <strong>2 MB HTTP POST request</strong> containing $65{,}536$ crafted form parameter names could peg a multi-core web server's CPU at $100\\%$ for <strong>15 to 90 minutes</strong> across Java, Python, PHP, Ruby, and V8 Node.js. When a server inserts $N$ untrusted keys into a hash map whose hash function is deterministic and unkeyed (such as DJB2 <code>h = h * 33 + c</code>, Java <code>String.hashCode()</code> <code>h = h * 31 + c</code>, or unseeded MurmurHash), an attacker can precompute $N$ strings that all hash to the exact same bucket.</p><p>Each insertion traverses a chain (or probe cluster) of length $0, 1, 2, \\dots, N-1$, executing $\\sum_{i=0}^{N-1} i = \\frac{N(N-1)}{2} = \\Theta(N^2)$ string comparisons! Worse yet, simply adding a random seed to MurmurHash2/3 or CityHash fails because differential cryptanalysis recovers the seed or constructs <strong>universal multicollisions</strong> independent of the seed. Defeating HashDoS requires either a <strong>Cryptographic Pseudorandom Function (PRF)</strong> like <strong>SipHash-2-4</strong> (Aumasson &amp; Bernstein, 2012) keyed with 128 bits of CSPRNG entropy, or <strong>Treeified Chaining</strong> (Java 8+ converting chains of length $\\ge 8$ into Red-Black Trees).</p>",
    content: `<div class="lesson-content">
      <h2>Anatomy of a HashDoS Attack: Equivalent Substrings &amp; Meet-in-the-Middle</h2>
      <p>How does an attacker generate $2^{16} = 65{,}536$ colliding strings in milliseconds?</p>
      <ul>
        <li><strong>Equivalent Two-Char Blocks (Java <code>hashCode</code> / DJB2):</strong> In Java's polynomial hash $h(s) = \\sum s[i] \\cdot 31^{L-1-i} \\bmod 2^{32}$, any two-character block $c_1 c_2$ contributes $31 c_1 + c_2$. Since <code>'A' * 31 + 'a' = 65 * 31 + 97 = 2112</code> and <code>'B' * 31 + 'B' = 66 * 31 + 66 = 2112</code>, the substrings <code>"Aa"</code> and <code>"BB"</code> have the <strong>exact same hash value</strong>! Concatenating $k = 16$ choices of <code>{"Aa", "BB"}</code> produces $2^{16} = 65{,}536$ distinct 32-byte strings with identical hash codes in $O(1)$ effort—and because every character comparison checks the full string prefix before failing, total comparison work reaches $\\Theta(N^2 \\cdot L)$!</li>
        <li><strong>Seed-Independent Differential Multicollisions (MurmurHash / CityHash):</strong> Non-cryptographic hashes like MurmurHash3 and CityHash64 were designed for statistical uniformity (passing SMHasher avalanche tests), not adversarial preimage resistance. Using internal state differentials, attackers construct pairs of blocks $(\\Delta_1, \\Delta_2)$ that cancel each other inside the mixing rounds <strong>regardless of the 32-bit/64-bit startup seed</strong>.</li>
      </ul>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Defense Mechanism</th>
            <th>Worst-Case $N$ Insertions</th>
            <th>Short-Key Latency (16B)</th>
            <th>Adversarial Security Guarantee</th>
            <th>Production Adoption</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Unkeyed Polynomial (DJB2 / FNV-1a)</td>
            <td><span class="badge-on2">Θ(N²)</span></td>
            <td>~3 ns</td>
            <td>None (Trivial 2-char collisions)</td>
            <td>Legacy C / Pre-2012 runtimes</td>
          </tr>
          <tr>
            <td>Seeded Non-Crypto (Murmur3 / WyHash)</td>
            <td><span class="badge-on2">Θ(N²)</span> (Differential)</td>
            <td>~4 ns</td>
            <td>Breaks under differential/seed-recovery</td>
            <td>Internal trusted keys / C++ Abseil</td>
          </tr>
          <tr>
            <td>Keyed ARX PRF (SipHash-1-3 / 2-4)</td>
            <td><span class="badge-on">O(N)</span> Expected w.h.p.</td>
            <td>~9–14 ns</td>
            <td>128-bit cryptographic PRF security</td>
            <td>Rust <code>std::collections::HashMap</code>, Python, Linux, Redis</td>
          </tr>
          <tr>
            <td>Treeified Buckets (Red-Black Chain)</td>
            <td><span class="badge-onlogn">O(N log N)</span> Deterministic</td>
            <td>~5 ns (Normal)</td>
            <td>Deterministic $O(\\log N)$ per bucket</td>
            <td>Java 8+ <code>java.util.HashMap</code> (<code>TREEIFY_THRESHOLD=8</code>)</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Formal Specification: SipHash ARX State Machine &amp; PRF Indistinguishability</h4>
        <p><strong>SipHash-$c$-$d$ Architecture (Aumasson &amp; Bernstein, 2012):</strong> Initializes four 64-bit internal state lanes $(v_0, v_1, v_2, v_3)$ by XORing a 128-bit secret key $(k_0, k_1)$ obtained from OS entropy (<code>getrandom</code> / <code>/dev/urandom</code>) with four ASCII constant words (<code>"somepseudorandomlygeneratedbytes"</code>). For each 8-byte message block $m_i$: set $v_3 \\gets v_3 \\oplus m_i$, execute $c$ compression <strong>SipRounds</strong>, and set $v_0 \\gets v_0 \\oplus m_i$. After the final length-padded block, set $v_2 \\gets v_2 \\oplus \\text{0xff}$, execute $d$ finalization SipRounds, and output $v_0 \\oplus v_1 \\oplus v_2 \\oplus v_3$.</p>
        <p><strong>PRF Bound:</strong> Without knowing $(k_0, k_1)$, no probabilistic polynomial-time adversary (even with adaptive timing oracle access) can distinguish SipHash-2-4 outputs from a truly random oracle, bounding $N$-key insertion cost to $O(N)$ with probability $1 - 2^{-64}$.</p>
      </div>

      <h2>Visualizing the SipRound Add-Rotate-XOR (ARX) Butterfly</h2>
      <svg viewBox="0 0 740 230" width="100%" height="230" role="img" aria-label="SipHash-2-4 ARX SipRound state permutation and HashDoS comparison">
        <defs>
          <style>
            .sh-lane { fill: #0f172a; stroke: #38bdf8; stroke-width: 1.8; rx: 5; }
            .sh-op { fill: #1e293b; stroke: #22c55e; stroke-width: 1.8; rx: 5; }
            .sh-warn { fill: #450a0a; stroke: #ef4444; stroke-width: 1.8; rx: 5; }
            .sh-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; text-anchor: middle; }
            .sh-sub { fill: #94a3b8; font-family: monospace; font-size: 11px; text-anchor: middle; }
          </style>
        </defs>
        <rect class="sh-warn" x="20" y="20" width="335" height="90"/>
        <text class="sh-txt" x="187" y="45" fill="#fca5a5">Unkeyed HashDoS (N = 65,536 keys)</text>
        <text class="sh-sub" x="187" y="68">"AaAa...", "AaBB...", "BBAa..." → Same Bucket [b]</text>
        <text class="sh-sub" x="187" y="92" fill="#f87171">Comparisons: N(N-1)/2 = 2,147,450,880 (CPU Frozen!)</text>

        <rect class="sh-op" x="380" y="20" width="340" height="90"/>
        <text class="sh-txt" x="550" y="45" fill="#4ade80">SipHash-2-4 (128-bit Per-Process Key k0, k1)</text>
        <text class="sh-sub" x="550" y="68">c=2 Compression Rounds/8B, d=4 Finalization Rounds</text>
        <text class="sh-sub" x="550" y="92" fill="#86efac">Comparisons: ~N = 65,536 (~6 ms total execution!)</text>

        <rect class="sh-lane" x="20" y="130" width="700" height="82"/>
        <text class="sh-txt" x="370" y="154" fill="#38bdf8">Single SipRound ARX Permutation (Zero Lookup Tables, Constant-Time):</text>
        <text class="sh-sub" x="370" y="178">Half-Round 1: v0 += v1; v1 = rotl(v1,13) ^ v0; v0 = rotl(v0,32);  v2 += v3; v3 = rotl(v3,16) ^ v2;</text>
        <text class="sh-sub" x="370" y="198">Half-Round 2: v0 += v3; v3 = rotl(v3,21) ^ v0;  v2 += v1; v1 = rotl(v1,17) ^ v2; v2 = rotl(v2,32);</text>
      </svg>

      <div class="mermaid">
flowchart LR
  Init["128-bit CSPRNG Key (k0, k1)\nInitialize v0..v3"] --> Block["Read 8-byte word m_i\nv3 ^= m_i"]
  Block --> Comp["Run c=2 SipRounds\n(ARX: +, rotl, ^)"]
  Comp --> Xor0["v0 ^= m_i"]
  Xor0 --> More{"More 8B blocks?"}
  More -- "Yes" --> Block
  More -- "No (Pad length << 56)" --> Fin["v2 ^= 0xff\nRun d=4 SipRounds"]
  Fin --> Out["Return v0 ^ v1 ^ v2 ^ v3"]
      </div>

      <div class="simulator-mount" data-sim="sim-universal-siphash-dos"></div>

      <div class="hardware-box">
        <h4>Hardware Reality: ARX Instructions vs SHA-256 on Short Strings</h4>
        <p>Why didn't language runtimes simply use <code>HMAC-SHA256</code> for hash tables? SHA-256 processes 64-byte (512-bit) blocks with 64 rounds per block, meaning a typical 12-byte map key (<code>"user_id_4921"</code>) wastes $80\\%$ of its block capacity on padding and takes ~150 CPU cycles. <strong>SipHash-2-4</strong> operates on 8-byte words using pure 64-bit <strong>Add-Rotate-XOR (ARX)</strong> instructions (<code>ADD</code>, <code>ROL</code>, <code>XOR</code>) that execute in 4 cycles per SipRound on superscalar 64-bit pipelines, completing a 16-byte string hash in ~30 cycles with zero S-box cache-timing side channels.</p>
      </div>

      <h2>Production C++20 Implementation: RFC-Compliant SipHash-2-4</h2>
      <pre><code class="language-cpp">// C++20: Reference SipHash-2-4 (Aumasson &amp; Bernstein) for HashDoS-Resistant Tables
#include &lt;cstdint&gt;
#include &lt;cstddef&gt;
#include &lt;bit&gt;
#include &lt;cstring&gt;

class SipHash24 {
    uint64_t k0_, k1_;

    static constexpr void sipRound(uint64_t&amp; v0, uint64_t&amp; v1, uint64_t&amp; v2, uint64_t&amp; v3) noexcept {
        v0 += v1; v1 = std::rotl(v1, 13) ^ v0; v0 = std::rotl(v0, 32);
        v2 += v3; v3 = std::rotl(v3, 16) ^ v2;
        v0 += v3; v3 = std::rotl(v3, 21) ^ v0;
        v2 += v1; v1 = std::rotl(v1, 17) ^ v2; v2 = std::rotl(v2, 32);
    }

public:
    constexpr SipHash24(uint64_t k0, uint64_t k1) noexcept : k0_(k0), k1_(k1) {}

    uint64_t operator()(const uint8_t* data, size_t len) const noexcept {
        uint64_t v0 = k0_ ^ 0x736f6d6570736575ULL;
        uint64_t v1 = k1_ ^ 0x646f72616e646f6dULL;
        uint64_t v2 = k0_ ^ 0x6c7967656e657261ULL;
        uint64_t v3 = k1_ ^ 0x7465646279746573ULL;

        const size_t blocks = len / 8;
        for (size_t i = 0; i &lt; blocks; ++i) {
            uint64_t m = 0;
            std::memcpy(&amp;m, data + i * 8, sizeof(uint64_t));
            v3 ^= m;
            sipRound(v0, v1, v2, v3);
            sipRound(v0, v1, v2, v3); // c = 2 compression rounds
            v0 ^= m;
        }

        // Pack remaining 0..7 bytes in little-endian + (len mod 256) in top byte [56..63]
        uint64_t last = static_cast&lt;uint64_t&gt;(len &amp; 0xff) &lt;&lt; 56;
        const uint8_t* tail = data + blocks * 8;
        for (size_t r = 0; r &lt; (len &amp; 7); ++r) {
            last |= static_cast&lt;uint64_t&gt;(tail[r]) &lt;&lt; (r * 8);
        }

        v3 ^= last;
        sipRound(v0, v1, v2, v3);
        sipRound(v0, v1, v2, v3);
        v0 ^= last;

        v2 ^= 0xffULL;
        for (int d = 0; d &lt; 4; ++d) sipRound(v0, v1, v2, v3); // d = 4 finalization rounds
        return v0 ^ v1 ^ v2 ^ v3;
    }
};</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Exposing Hash Iteration Order to Untrusted Clients:</strong> Even if a server uses SipHash with a random 128-bit secret key, if an API serializes hash map keys in bucket iteration order and returns them to the user, an attacker can mount a <strong>timing/ordering side-channel attack</strong> to learn which keys share buckets or recover the secret key. Keep seeds private or randomize per-table state.</li>
          <li><strong>Using Unkeyed <code>fxhash</code> / <code>fnv</code> on Network-Facing Maps:</strong> Rust's <code>rustc-hash</code> (<code>FxHashMap</code>) and C++'s <code>std::unordered_map</code> use fast unkeyed hashes. While <code>FxHashMap</code> is $2\\times$ faster on integer keys inside a compiler AST, exposing it to HTTP headers, JSON keys, or query parameters invites immediate $\\Theta(N^2)$ HashDoS.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "HashDoS attacks exploit unkeyed or weak hash functions by injecting N colliding keys, turning O(N) batch insertion into Θ(N^2) comparisons and freezing server CPUs.",
      "Simply adding a random seed to non-cryptographic hashes like MurmurHash3 or CityHash fails because differential multicollisions bypass the seed.",
      "SipHash-2-4 is a keyed ARX Pseudorandom Function (PRF) using a 128-bit CSPRNG key, 2 compression rounds per 8-byte block, and 4 finalization rounds to guarantee O(1) expected lookups against any adversary.",
      "Java 8+ HashMap mitigates HashDoS deterministically by converting separate chains of length ≥ 8 (when capacity ≥ 64) into Red-Black Trees with O(log N) worst-case lookup."
    ],
    furtherReading: [
      { title: "Crosby & Wallach (2003): Denial of Service via Algorithmic Complexity Attacks (USENIX Security)", url: "https://www.usenix.org/conference/12th-usenix-security-symposium/denial-service-algorithmic-complexity-attacks" },
      { title: "Aumasson & Bernstein (2012): SipHash: a fast short-input PRF (INDOCRYPT)", url: "https://cr.yp.to/siphash/siphash-20120918.pdf" },
      { title: "Rust std::collections::HashMap Documentation — SipHash-1-3 & DoS Resistance", url: "https://docs.rs/hashbrown/latest/hashbrown/" }
    ]
  },

  "consistent-hashing-rendezvous": {
    title: "Consistent Hashing with Bounded Loads & Rendezvous (HRW) Hashing",
    video: {
      youtubeId: "UF9Iqmg94tk",
      title: "MIT 6.824 Distributed Systems: Consistent Hashing & Chord",
      channel: "MIT OpenCourseWare",
      duration: "1:18:10",
      start: 0,
      length: "1h 18m",
      why: "Robert Morris and Frans Kaashoek explain how Karger's consistent hashing ring bounds key migration to O(K/N) during node churn and why virtual nodes are essential for load balance."
    },
    intuition: "<p>In a distributed cache or sharded database with $N$ storage nodes, naive modular sharding $\\text{node} = \\text{hash}(k) \\bmod N$ fails catastrophically whenever a node joins or leaves: changing $N \\to N \\pm 1$ alters $\\text{hash}(k) \\bmod N$ for <strong>$\\frac{N-1}{N} \\approx 99\\%$ of all keys</strong>, triggering a thundering herd of cache misses against the origin database. <strong>Consistent Hashing</strong> (Karger et al., STOC 1997) and <strong>Rendezvous / Highest Random Weight (HRW) Hashing</strong> (Thaler &amp; Ravishankar, 1996) solve this by guaranteeing <strong>monotonicity</strong> and <strong>minimal disruption</strong>: when 1 of $N$ nodes is added or removed, only an optimal fraction $1/N$ of keys move.</p><p>Even with $V = O(\\log N)$ virtual nodes per physical server, traffic spikes (hot keys) can overload a single ring segment. <strong>Consistent Hashing with Bounded Loads</strong> (Mirrokni et al., Google 2017, deployed in Vimeo/HAProxy) enforces a strict capacity cap $C = \\lceil (1 + \\epsilon) \\frac{W}{N} \\rceil$ per node, forwarding overflow keys clockwise along the ring while preserving $O(1/\\epsilon^2)$ expected probe hops.</p>",
    content: `<div class="lesson-content">
      <h2>Ring-Based Consistent Hashing vs Rendezvous (HRW) Hashing</h2>
      <p>Three algorithms dominate production traffic routing and shard assignment:</p>
      <ul>
        <li><strong>Karger's Ring with Virtual Nodes (VNodes):</strong> Map both keys and server replicas onto the 64-bit cyclic integer ring $[0, 2^{64}-1]$. Each physical server $s_i$ places $V$ virtual tokens $h(s_i \\mathbin{\\|} 0), \\dots, h(s_i \\mathbin{\\|} V-1)$ onto a sorted array or balanced BST (<code>std::map</code>). A key $k$ routes to the first token clockwise with $\\text{token} \\ge h(k)$ via <code>std::lower_bound</code> in $O(\\log(N V))$ time (wrapping around to index $0$ if $h(k)$ exceeds all tokens). Using $V = 150$ VNodes reduces load standard deviation to $\\sigma / \\mu \\approx 1/\\sqrt{150} \\approx 8\\%$.</li>
        <li><strong>Consistent Hashing with Bounded Loads (Mirrokni et al., 2017):</strong> Given total active load $W$, number of nodes $N$, and slack parameter $\\epsilon \\in (0, 1]$ (typically $\\epsilon = 0.25$), each server is assigned a hard maximum capacity $C = \\lceil (1 + \\epsilon) W / N \\rceil$. When a key hashes to its primary clockwise server, if that server's current load is $< C$, it accepts the key; otherwise the key walks clockwise to the next server with spare capacity.</li>
        <li><strong>Rendezvous / Highest Random Weight (HRW) Hashing:</strong> Requires <strong>zero ring state or VNode tables</strong>. To route key $k$ across nodes $\\{s_1, \\dots, s_N\\}$, compute a joint score $w_i = \\text{hash}(k, s_i)$ for each node and select $s^* = \\arg\\max_i w_i$. Achieving perfect $1/N$ uniform distribution without VNodes, HRW costs $O(N)$ per lookup (or $O(\\log N)$ using a hierarchical skeleton tree), making it ideal for cluster sizes $N \\le 64$ or weighted multi-replica selection (picking top-$R$ replicas in one pass).</li>
      </ul>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Sharding Strategy</th>
            <th>Lookup Time</th>
            <th>Routing Table Memory</th>
            <th>Keys Moved on Node Churn</th>
            <th>Max Load Ratio (Hot Workload)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Modulo Hashing ($h(k) \\bmod N$)</td>
            <td><span class="badge-o1">O(1)</span></td>
            <td><span class="badge-o1">O(1)</span></td>
            <td>$\\frac{N-1}{N} \\approx 100\\%$ (Catastrophic)</td>
            <td>Unbounded on skew</td>
          </tr>
          <tr>
            <td>Ring Consistent Hashing ($V$ VNodes)</td>
            <td><span class="badge-ologn">O(log(NV))</span></td>
            <td><span class="badge-on">O(N · V)</span></td>
            <td>$\\frac{1}{N}$ (Optimal)</td>
            <td>$1 + O\\left(\\sqrt{\\frac{\\log N}{V}}\\right)$ (Uniform keys)</td>
          </tr>
          <tr>
            <td>Bounded-Load Ring ($1 + \\epsilon$)</td>
            <td><span class="badge-ologn">O(log(NV) + 1/ε²)</span></td>
            <td><span class="badge-on">O(N · V)</span></td>
            <td>$\\le \\frac{1 + O(\\epsilon)}{N}$</td>
            <td>Strict Cap $\\lceil(1 + \\epsilon) W/N\\rceil$</td>
          </tr>
          <tr>
            <td>Rendezvous / HRW Hashing</td>
            <td><span class="badge-on">O(N)</span></td>
            <td><span class="badge-on">O(N)</span> (Zero VNodes)</td>
            <td>$\\frac{1}{N}$ (Optimal, 0 variance bias)</td>
            <td>Uniform $1/N$ across nodes</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Formal Specification: Karger Monotonicity &amp; Bounded-Load Probe Theorem</h4>
        <p><strong>Minimal Disruption Invariant:</strong> Let $S$ be the set of active nodes and $S' = S \\cup \\{s_{\\text{new}}\\}$. Under both Virtual-Node Ring Hashing and HRW Hashing, a key $k$ changes assignment ($f_{S'}(k) \\ne f_S(k)$) <em>if and only if</em> $f_{S'}(k) = s_{\\text{new}}$. No key ever migrates between two existing nodes $s_i, s_j \\in S$. By symmetry under a uniform hash function, $\\Pr[f_{S'}(k) = s_{\\text{new}}] = \\frac{1}{|S| + 1}$.</p>
        <p><strong>Bounded-Load Forwarding Bound (Mirrokni et al., 2017):</strong> For any arrival sequence of $W$ balls (even with arbitrary duplicate/hot keys), if each of the $N$ bins has capacity $C = \\lceil (1 + \\epsilon) W / N \\rceil$, the expected number of clockwise forwarding hops to locate a non-full bin is bounded by $O(1 / \\epsilon^2)$, independent of $N$ and $W$.</p>
      </div>

      <h2>Visualizing the $2^{64}$ Ring, VNode Arcs &amp; $(1+\\epsilon)$ Bounded-Load Overflow</h2>
      <svg viewBox="0 0 740 245" width="100%" height="245" role="img" aria-label="Consistent Hashing Ring with Virtual Nodes and Bounded-Load Overflow">
        <defs>
          <style>
            .ch-ring { fill: none; stroke: #334155; stroke-width: 4; }
            .ch-arc { fill: none; stroke: #f59e0b; stroke-width: 2.5; stroke-dasharray: 5 4; }
            .ch-node { fill: #0f172a; stroke: #38bdf8; stroke-width: 2.5; }
            .ch-full { fill: #450a0a; stroke: #ef4444; stroke-width: 2.5; }
            .ch-ok { fill: #052e16; stroke: #22c55e; stroke-width: 2.5; }
            .ch-txt { fill: #f8fafc; font-family: monospace; font-size: 11.5px; }
            .ch-sub { fill: #94a3b8; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <circle class="ch-ring" cx="145" cy="122" r="86"/>
        <path class="ch-arc" d="M 145 36 A 86 86 0 0 1 231 122"/>
        <path class="ch-arc" d="M 231 122 A 86 86 0 0 1 145 208"/>
        <circle cx="195" cy="52" r="6" fill="#fbbf24"/>
        <text class="ch-txt" x="208" y="48" fill="#fbbf24">h(k)</text>

        <circle class="ch-full" cx="231" cy="122" r="16"/>
        <text class="ch-txt" x="231" y="126" text-anchor="middle">N1</text>

        <circle class="ch-ok" cx="145" cy="208" r="16"/>
        <text class="ch-txt" x="145" y="212" text-anchor="middle">N2</text>

        <circle class="ch-node" cx="59" cy="122" r="16"/>
        <text class="ch-txt" x="59" y="126" text-anchor="middle">N3</text>

        <circle class="ch-node" cx="145" cy="36" r="16"/>
        <text class="ch-txt" x="145" y="40" text-anchor="middle">N0</text>

        <rect x="305" y="25" width="415" height="92" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.8"/>
        <text class="ch-txt" x="320" y="48" fill="#38bdf8">1. Bounded-Load Overflow Routing (ε = 0.25):</text>
        <text class="ch-sub" x="320" y="70">• Key k hashes to arc (N0, N1] → Primary target = N1</text>
        <text class="ch-sub" x="320" y="90" fill="#fca5a5">• N1 is at cap C = ⌈1.25 · W/N⌉ (FULL) → Forward clockwise</text>
        <text class="ch-sub" x="320" y="108" fill="#4ade80">• N2 has load &lt; C → Key k assigned to N2!</text>

        <rect x="305" y="132" width="415" height="92" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.8"/>
        <text class="ch-txt" x="320" y="155" fill="#fbbf24">2. Rendezvous (HRW) Weight Comparison:</text>
        <text class="ch-sub" x="320" y="177">w(k, N0)=0.41, w(k, N1)=0.92, w(k, N2)=0.87, w(k, N3)=0.19</text>
        <text class="ch-sub" x="320" y="197">Sorted ranking [N1, N2, N0, N3] gives primary + failover list</text>
        <text class="ch-sub" x="320" y="215">without storing any VNode ring in memory!</text>
      </svg>

      <div class="mermaid">
flowchart LR
  K["Incoming Key k"] --> H["pos = hash64(k)"]
  H --> LB["idx = lower_bound(ring, pos)\nif idx == ring.size(): idx = 0"]
  LB --> Check{"node_load[ring[idx].node]\n< ceil((1 + ε) · W / N) ?"}
  Check -- "Yes (Capacity Available)" --> Assign["Increment node_load\nReturn ring[idx].node"]
  Check -- "No (Node at Bounded Cap)" --> Step["idx = (idx + 1) % ring.size()"] --> Check
      </div>

      <div class="simulator-mount" data-sim="sim-consistent-hashing-ring"></div>

      <div class="hardware-box">
        <h4>Hardware Reality: Contiguous Sorted Array vs <code>std::map</code> for VNode Rings</h4>
        <p>With $N = 1{,}000$ backend servers and $V = 160$ virtual nodes per server, the ring contains $160{,}000$ tokens. Storing the ring in a pointer-based <code>std::map</code> (Red-Black Tree) incurs $\\approx 18$ pointer-chasing hops across 7.6 MB of heap memory, costing ~1,200 ns per packet routed. Storing the $160{,}000$ <code>(token_u64, node_id_u32)</code> pairs in a <strong>flat contiguous sorted <code>std::vector</code></strong> (1.9 MB, fitting entirely inside L3 cache) allows <code>std::lower_bound</code> (or Eytzinger binary search) to route packets in ~45 ns—a $25\\times$ speedup in L4/L7 load balancers like Envoy and Katran.</p>
      </div>

      <h2>Production C++20 Implementation: Bounded-Load Consistent Ring &amp; Rendezvous (HRW) Router</h2>
      <pre><code class="language-cpp">// C++20: Consistent Hashing with (1 + eps) Bounded Loads &amp; Rendezvous (HRW) Hashing
#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;algorithm&gt;
#include &lt;cmath&gt;

class BoundedConsistentHashRing {
    struct VNode {
        uint64_t token;
        uint32_t nodeId;
        bool operator&lt;(const VNode&amp; o) const noexcept { return token &lt; o.token; }
    };

    std::vector&lt;VNode&gt; ring_;
    std::vector&lt;uint32_t&gt; loads_;
    uint32_t totalLoad_ = 0;
    double epsilon_;

    static uint64_t mix64(uint64_t x) noexcept {
        x = (x ^ (x &gt;&gt; 30)) * 0xbf58476d1ce4e5b9ULL;
        x = (x ^ (x &gt;&gt; 27)) * 0x94d049bb133111ebULL;
        return x ^ (x &gt;&gt; 31);
    }

public:
    BoundedConsistentHashRing(uint32_t numNodes, uint32_t vnodesPerNode = 128, double eps = 0.25)
        : loads_(numNodes, 0), epsilon_(eps) {
        ring_.reserve(numNodes * vnodesPerNode);
        for (uint32_t n = 0; n &lt; numNodes; ++n) {
            for (uint32_t v = 0; v &lt; vnodesPerNode; ++v) {
                uint64_t seed = (static_cast&lt;uint64_t&gt;(n) &lt;&lt; 32) | v;
                ring_.push_back({mix64(seed), n});
            }
        }
        std::sort(ring_.begin(), ring_.end());
    }

    uint32_t acquireRoute(uint64_t key) {
        const uint32_t N = static_cast&lt;uint32_t&gt;(loads_.size());
        const uint32_t cap = static_cast&lt;uint32_t&gt;(
            std::ceil((1.0 + epsilon_) * static_cast&lt;double&gt;(totalLoad_ + 1) / N)
        );

        uint64_t h = mix64(key);
        auto it = std::lower_bound(ring_.begin(), ring_.end(), VNode{h, 0});
        size_t idx = (it == ring_.end()) ? 0 : static_cast&lt;size_t&gt;(it - ring_.begin());

        for (size_t probes = 0; probes &lt; ring_.size(); ++probes) {
            uint32_t candidate = ring_[idx].nodeId;
            if (loads_[candidate] &lt; cap) {
                ++loads_[candidate];
                ++totalLoad_;
                return candidate;
            }
            idx = (idx + 1 == ring_.size()) ? 0 : idx + 1;
        }
        return ring_[idx].nodeId;
    }

    // Stateless Rendezvous (HRW) Hashing: O(N) time, O(1) auxiliary space
    static uint32_t rendezvousSelect(uint64_t key, const std::vector&lt;uint32_t&gt;&amp; activeNodes) noexcept {
        uint32_t bestNode = 0;
        uint64_t maxWeight = 0;
        for (uint32_t nodeId : activeNodes) {
            uint64_t w = mix64(key ^ mix64(nodeId));
            if (w &gt;= maxWeight) {
                maxWeight = w;
                bestNode = nodeId;
            }
        }
        return bestNode;
    }
};</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Correlated Key Hash and VNode Hash Functions:</strong> If you use the exact same unseeded hash function to map keys onto the ring AND to shard keys inside the local hash table on the target server, every key assigned to virtual node $v$ falls into a narrow sub-interval of the 64-bit hash space—causing severe clustering inside the server's local hash table! Always use independent seeds for ring routing vs local bucket indexing.</li>
          <li><strong>Forgetting Wrap-Around when <code>lower_bound</code> Returns <code>ring.end()</code>:</strong> Any key whose hash exceeds the largest token on the ring belongs to <code>ring[0]</code>, closing the circle $[0, 2^{64}-1]$.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "Modular sharding hash(k) mod N remaps (N-1)/N of all keys when N changes by 1; Consistent Hashing and Rendezvous Hashing move only an optimal 1/N fraction of keys.",
      "Placing V = Θ(log N) virtual nodes per physical server on the 2^64 ring reduces partition size variance to σ/μ ≈ 1/√V and enables heterogeneous hardware weighting.",
      "Consistent Hashing with Bounded Loads caps every node at ⌈(1 + ε)W/N⌉ active requests and spills overflow keys clockwise in O(1/ε^2) expected steps.",
      "Rendezvous (HRW) Hashing computes argmax_i hash(key, node_i) to achieve zero-VNode uniform load distribution and natural top-k replica ordering in O(N) time."
    ],
    furtherReading: [
      { title: "Karger et al. (1997): Consistent Hashing and Random Trees (ACM STOC)", url: "https://doi.org/10.1145/258533.258660" },
      { title: "Mirrokni, Thorup & Zadimoghaddam (2018): Consistent Hashing with Bounded Loads (ACM-SIAM SODA)", url: "https://arxiv.org/abs/1608.01350" }
    ]
  },

  "bloom-filters-counting-xor": {
    title: "Bloom Filters, Counting Bloom Filters, Cuckoo Filters & Xor Filters",
    video: {
      youtubeId: "kfFacplFY4Y",
      title: "MIT 6.046J Design and Analysis of Algorithms: Bloom Filters & Universal Hashing",
      channel: "MIT OpenCourseWare",
      duration: "1:19:45",
      start: 0,
      length: "1h 19m",
      why: "Srini Devadas derives the false positive probability (1 - e^{-kn/m})^k, solves for the optimal number of hash functions k = (m/n) ln 2, and analyzes space-error tradeoffs."
    },
    intuition: "<p>Suppose an LSM-tree storage engine (RocksDB / Cassandra) must check whether a key $q$ exists across $20$ immutable on-disk SSTables. Storing an exact key index in RAM for $10^9$ keys requires $\\ge 16\\text{ GB}$, whereas reading disk costs milliseconds per SSTable. A <strong>Bloom Filter</strong> (Burton Bloom, 1970) sacrifices a tiny, tunable <strong>one-sided error</strong> (false positive rate $\\varepsilon$, zero false negatives) to compress set membership down to $1.44 \\log_2(1/\\varepsilon)$ bits per element—requiring just <strong>9.6 bits per key</strong> ($1.2\\text{ GB}$ for $10^9$ keys) for a $1\\%$ false positive rate!</p><p>Modern filter engineering pushes past classic Bloom filters in two directions: <strong>Cuckoo Filters</strong> (Fan et al., 2014) store compact $f$-bit fingerprints inside a bucketized Cuckoo table to support <strong>$O(1)$ deletions</strong> and 2-cache-line locality, while <strong>Xor Filters</strong> (Graf &amp; Lemire, 2020) solve a random 3-hypergraph peeling system over static sets to reach $1.23 \\log_2(1/\\varepsilon)$ bits per key with <strong>strictly 3 parallel memory reads</strong>.</p>",
    content: `<div class="lesson-content">
      <h2>Deriving the Optimal Bloom Filter Parameters ($m, n, k, \\varepsilon$)</h2>
      <p>A standard Bloom filter consists of a bit array $B[0..m-1]$ initialized to $0$ and $k$ hash functions $h_1, \\dots, h_k: \\mathcal{U} \\to \\{0, \\dots, m-1\\}$. To insert $x$, set $B[h_i(x)] \\gets 1$ for all $1 \\le i \\le k$. To query $q$, return <code>PossiblyInSet</code> iff $\\bigwedge_{i=1}^k B[h_i(q)] == 1$; if any bit is $0$, $q$ is <strong>definitely not in the set</strong>.</p>
      <p>After inserting $n$ elements, the probability that a specific bit remains $0$ is:</p>
      <p>$$p_0 = \\left(1 - \\frac{1}{m}\\right)^{kn} \\approx e^{-kn/m}$$</p>
      <p>The probability of a false positive for a query $q \\notin S$ is the probability that all $k$ probed bits are $1$:</p>
      <p>$$\\varepsilon = (1 - p_0)^k \\approx \\left(1 - e^{-kn/m}\\right)^k$$</p>
      <p>Taking the derivative with respect to $k$ shows that $\\varepsilon$ is minimized when exactly <strong>half the bits in the array are $1$ ($p_0 = 1/2$)</strong>, giving the optimal hash count and bit budget:</p>
      <p>$$k^* = \\frac{m}{n} \\ln 2 \\approx 0.693 \\frac{m}{n}, \\qquad \\frac{m}{n} = \\frac{-\\ln \\varepsilon}{(\\ln 2)^2} \\approx 1.4427 \\log_2\\left(\\frac{1}{\\varepsilon}\\right)\\text{ bits/key}$$</p>

      <h2>Cuckoo Filters (Partial-Key Cuckoo Hashing) &amp; Static Xor Filters</h2>
      <ul>
        <li><strong>Why You Cannot Naive-Clear Bits in a Bloom Filter:</strong> Clearing $B[h_i(x)] \\gets 0$ on delete can clear a bit shared with another live key $y$, introducing illegal <strong>false negatives</strong>! <em>Counting Bloom Filters</em> replace each bit with a 4-bit saturating counter, but this $4\\times$ memory bloat ($38.4$ bits/key at $\\varepsilon = 1\\%$) is prohibitive.</li>
        <li><strong>Cuckoo Filters (Fan et al., 2014):</strong> Store only a short $f$-bit fingerprint $\\text{fp}(x)$ inside a 4-slot-per-bucket Cuckoo table ($\alpha = 0.95$). To relocate an existing fingerprint during Cuckoo eviction without having the original key $x$, Cuckoo Filters use <strong>Partial-Key Cuckoo Hashing</strong>:
          <p>$$i_1 = h_1(x), \\qquad i_2 = i_1 \\oplus h_2(\\text{fp}(x))$$</p>
          Because XOR is its own inverse ($i_1 = i_2 \\oplus h_2(\\text{fp}(x))$), the alternate bucket $i_2$ can be computed purely from the current bucket index $i_1$ and the stored fingerprint $\\text{fp}(x)$! Deletions simply remove one copy of $\\text{fp}(x)$ from bucket $i_1$ or $i_2$.</li>
        <li><strong>Xor Filters (Graf &amp; Lemire, 2020):</strong> For immutable sets (such as LSM SSTables), an Xor Filter constructs an array $B$ of $m = \\lfloor 1.23 n \\rfloor + 32$ $f$-bit fingerprints via 3-hypergraph peeling so that for every key $x \\in S$, $B[h_0(x)] \\oplus B[h_1(x)] \\oplus B[h_2(x)] == \\text{fp}(x)$, achieving false positive rate $2^{-f}$ using only $1.23 f$ bits per key.</li>
      </ul>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Filter Architecture</th>
            <th>Bits per Key ($\varepsilon = 1\\%$)</th>
            <th>Supports Deletion?</th>
            <th>Cache Line Reads per Query</th>
            <th>Information-Theoretic Overhead</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Information-Theoretic Lower Bound</td>
            <td>$6.64$ bits</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>$1.00\\times \\log_2(1/\\varepsilon)$</td>
          </tr>
          <tr>
            <td>Standard Bloom Filter ($k=7$)</td>
            <td>$9.58$ bits</td>
            <td>No (False negatives)</td>
            <td>Up to $k=7$ lines (1 if Blocked)</td>
            <td>$1.44\\times \\log_2(1/\\varepsilon)$</td>
          </tr>
          <tr>
            <td>4-Bit Counting Bloom Filter</td>
            <td>$38.3$ bits</td>
            <td>Yes (Decrement 4b counters)</td>
            <td>Up to $k=7$ lines</td>
            <td>$5.77\\times \\log_2(1/\\varepsilon)$</td>
          </tr>
          <tr>
            <td>Cuckoo Filter ($b=4, \\alpha=0.95$)</td>
            <td>$~9.5$ bits</td>
            <td>Yes ($O(1)$ fingerprint erase)</td>
            <td>Strict $\\le 2$ cache lines</td>
            <td>$((\log_2(1/\\varepsilon) + 2) / 0.95)$</td>
          </tr>
          <tr>
            <td>Static Xor Filter ($f$-bit)</td>
            <td>$8.6$ bits ($f=7$)</td>
            <td>No (Immutable SSTables)</td>
            <td>Strict $3$ parallel loads</td>
            <td>$1.23\\times \\log_2(1/\\varepsilon)$</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Formal Specification: Kirsch-Mitzenmacher Double Hashing &amp; XOR Dual-Bucket Identity</h4>
        <p><strong>Kirsch-Mitzenmacher Optimization (2006):</strong> Computing $k$ independent hashes is unnecessary. Given just <strong>two</strong> 32-bit halves $(h_a(x), h_b(x))$ of a single 64-bit hash, generating $k$ indices via:</p>
        <p>$$g_i(x) = (h_a(x) + i \\cdot h_b(x)) \\bmod m \\quad \\text{for } i = 0, \\dots, k-1$$</p>
        <p>achieves the <strong>exact same asymptotic false positive probability</strong> $(1 - e^{-kn/m})^k$ as $k$ mutually independent hash functions!</p>
        <p><strong>Cuckoo Filter Involutory Bucket Invariant:</strong> Setting $i_2 = i_1 \\oplus h(\\text{fp}(x))$ ensures that for whichever bucket $i \\in \\{i_1, i_2\\}$ currently holds $\\text{fp}(x)$, its sibling bucket is always $i_{\\text{alt}} = i \\oplus h(\\text{fp}(x))$.</p>
      </div>

      <h2>Visualizing Blocked Bloom Filters vs Cuckoo Fingerprint Duality</h2>
      <svg viewBox="0 0 740 230" width="100%" height="230" role="img" aria-label="Bloom Filter Kirsch-Mitzenmacher bit setting and Cuckoo Filter XOR bucket duality">
        <defs>
          <style>
            .bf-box { fill: #0f172a; stroke: #334155; stroke-width: 1.8; rx: 6; }
            .bf-bit1 { fill: #052e16; stroke: #22c55e; stroke-width: 2; rx: 4; }
            .bf-bit0 { fill: #1e293b; stroke: #475569; stroke-width: 1.5; rx: 4; }
            .bf-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; text-anchor: middle; }
            .bf-sub { fill: #94a3b8; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <rect class="bf-box" x="20" y="20" width="700" height="92"/>
        <text class="bf-sub" x="35" y="42" fill="#38bdf8">1. Cache-Line Blocked Bloom Filter (512-bit / 64-Byte L1 Block selected by h_high(x)):</text>
        <rect class="bf-bit0" x="35" y="55" width="42" height="38"/><text class="bf-txt" x="56" y="79">0</text>
        <rect class="bf-bit1" x="85" y="55" width="42" height="38"/><text class="bf-txt" x="106" y="79" fill="#4ade80">1</text>
        <rect class="bf-bit0" x="135" y="55" width="42" height="38"/><text class="bf-txt" x="156" y="79">0</text>
        <rect class="bf-bit1" x="185" y="55" width="42" height="38"/><text class="bf-txt" x="206" y="79" fill="#4ade80">1</text>
        <rect class="bf-bit0" x="235" y="55" width="42" height="38"/><text class="bf-txt" x="256" y="79">0</text>
        <rect class="bf-bit0" x="285" y="55" width="42" height="38"/><text class="bf-txt" x="306" y="79">0</text>
        <rect class="bf-bit1" x="335" y="55" width="42" height="38"/><text class="bf-txt" x="356" y="79" fill="#4ade80">1</text>
        <rect class="bf-bit0" x="385" y="55" width="42" height="38"/><text class="bf-txt" x="406" y="79">0</text>
        <text class="bf-sub" x="445" y="72">All k=7 probes stay inside ONE 64B cache line!</text>
        <text class="bf-sub" x="445" y="92" fill="#4ade80">1 DRAM access instead of k=7 random misses.</text>

        <rect class="bf-box" x="20" y="128" width="700" height="86"/>
        <text class="bf-sub" x="35" y="150" fill="#fbbf24">2. Cuckoo Filter Partial-Key Eviction (No full key stored, only 8-bit fp):</text>
        <text class="bf-sub" x="35" y="174">Bucket i1 = h1(x) = 0b011010   |   Fingerprint fp = tag(x) = 0x7A   |   h2(fp) = 0b101101</text>
        <text class="bf-sub" x="35" y="196" fill="#86efac">Alternate Bucket i2 = i1 ^ h2(fp) = 0b110111   ⇔   i1 = i2 ^ h2(fp) = 0b011010 (Self-Inverse!)</text>
      </svg>

      <div class="mermaid">
flowchart LR
  subgraph CuckooFilterOps["Cuckoo Filter Insert / Lookup / Delete"]
    X["Key x"] --> FP["fp = nonzero_tag(x)\ni1 = h1(x)\ni2 = i1 ^ h2(fp)"]
    FP --> Q{"Operation?"}
    Q -- "Lookup(x)" --> L["Check if fp ∈ Bucket[i1]\nOR fp ∈ Bucket[i2]"]
    Q -- "Delete(x)" --> D["Remove 1 copy of fp\nfrom Bucket[i1] or Bucket[i2]"]
    Q -- "Insert(x)" --> I["Place fp in Bucket[i1] or [i2]\nElse evict random slot e via i = i ^ h2(e)"]
  end
      </div>

      <div class="simulator-mount" data-sim="sim-bloom-cuckoo-filter"></div>

      <div class="hardware-box">
        <h4>Hardware Reality: Cache-Line Blocked Bloom Filters &amp; AVX2 Register Masks</h4>
        <p>A textbook Bloom filter spanning $128\\text{ MB}$ with $k = 7$ hash functions performs up to <strong>7 independent DRAM cache misses</strong> (~450 ns) on every positive query. Production storage engines (RocksDB, Apache Parquet, DuckDB) use <strong>Cache-Line Blocked (or Register-Blocked) Bloom Filters</strong> (Putze et al.): the first hash selects a single 64-byte (512-bit) cache line, and all $k$ bits are set/tested inside that single 512-bit block! Even better, Parquet's <strong>Split Block Bloom Filter</strong> tests $k=8$ bits across eight 32-bit lanes in a single <strong>AVX2 <code>_mm256_testc_si256</code></strong> instruction (1 cache miss + 3 CPU cycles total).</p>
      </div>

      <h2>Production C++20 Implementation: Cache-Line Blocked Bloom Filter &amp; Cuckoo Filter</h2>
      <pre><code class="language-cpp">// C++20: 64-Byte Cache-Line Blocked Bloom Filter (1 Cache Miss per Query)
#include &lt;vector&gt;
#include &lt;array&gt;
#include &lt;cstdint&gt;

class BlockedBloomFilter {
    struct alignas(64) CacheLineBlock {
        std::array&lt;uint64_t, 8&gt; words{}; // 512 bits = 64 bytes (1 L1 cache line)
    };

    std::vector&lt;CacheLineBlock&gt; blocks_;
    uint32_t k_;

    static uint64_t mix64(uint64_t x) noexcept {
        x = (x ^ (x &gt;&gt; 30)) * 0xbf58476d1ce4e5b9ULL;
        x = (x ^ (x &gt;&gt; 27)) * 0x94d049bb133111ebULL;
        return x ^ (x &gt;&gt; 31);
    }

public:
    explicit BlockedBloomFilter(size_t numElements, uint32_t bitsPerKey = 10)
        : blocks_((numElements * bitsPerKey + 511) / 512),
          k_(static_cast&lt;uint32_t&gt;(bitsPerKey * 0.693147)) {
        if (blocks_.empty()) blocks_.resize(1);
        if (k_ &lt; 1) k_ = 1;
    }

    void insert(uint64_t key) noexcept {
        uint64_t h = mix64(key);
        size_t blkIdx = ((h &gt;&gt; 32) * blocks_.size()) &gt;&gt; 32; // Lemire FastRange block select
        uint32_t h1 = static_cast&lt;uint32_t&gt;(h);
        uint32_t h2 = static_cast&lt;uint32_t&gt;(mix64(h));

        auto&amp; blk = blocks_[blkIdx];
        for (uint32_t i = 0; i &lt; k_; ++i) {
            uint32_t bit = (h1 + i * h2) &amp; 511U;
            blk.words[bit &gt;&gt; 6] |= (1ULL &lt;&lt; (bit &amp; 63U));
        }
    }

    bool possiblyContains(uint64_t key) const noexcept {
        uint64_t h = mix64(key);
        size_t blkIdx = ((h &gt;&gt; 32) * blocks_.size()) &gt;&gt; 32;
        uint32_t h1 = static_cast&lt;uint32_t&gt;(h);
        uint32_t h2 = static_cast&lt;uint32_t&gt;(mix64(h));

        const auto&amp; blk = blocks_[blkIdx];
        for (uint32_t i = 0; i &lt; k_; ++i) {
            uint32_t bit = (h1 + i * h2) &amp; 511U;
            if ((blk.words[bit &gt;&gt; 6] &amp; (1ULL &lt;&lt; (bit &amp; 63U))) == 0) {
                return false; // 100% Guaranteed Negative!
            }
        }
        return true;
    }
};</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Deleting a Non-Existent Key from a Cuckoo Filter or Counting Bloom Filter:</strong> Calling <code>delete(x)</code> on a key $x$ that was <strong>never inserted</strong> into the filter will corrupt the filter by deleting a colliding key's fingerprint (or decrementing a shared counter to $0$), causing **false negatives** for legitimate keys! Only delete keys confirmed to exist in the backing store.</li>
          <li><strong>Zero Fingerprint Trap in Cuckoo Filters:</strong> If <code>fp == 0</code> is used as the <code>EMPTY</code> slot sentinel in a Cuckoo Filter, the fingerprint function must remap <code>0</code> to <code>1</code> (<code>fp = raw_fp ? raw_fp : 1</code>), and $h_2(\\text{fp})$ must be hashed before XORing so that <code>h2(fp) != 0</code> (otherwise $i_1 \\oplus 0 = i_1$, collapsing both candidate buckets into one).</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "A Bloom filter achieves false positive rate ε using m/n = 1.44 log₂(1/ε) bits per element (~9.6 bits/key for 1% FPR) with k = (m/n) ln 2 hash functions and zero false negatives.",
      "Kirsch-Mitzenmacher double hashing generates all k probe indices as (h1(x) + i·h2(x)) mod m from a single 64-bit hash with zero loss in asymptotic accuracy.",
      "Cache-Line Blocked Bloom Filters confine all k bit probes to a single 64-byte L1 cache line, reducing query cost from k DRAM misses to 1 DRAM miss.",
      "Cuckoo Filters support O(1) deletion via partial-key XOR relocation (i2 = i1 ^ h2(fp)), while static Xor Filters achieve 1.23 log₂(1/ε) bits per key with 3 parallel memory reads."
    ],
    furtherReading: [
      { title: "Bloom, B. H. (1970): Space/Time Trade-offs in Hash Coding with Allowable Errors (CACM)", url: "https://doi.org/10.1145/362686.362692" },
      { title: "Fan, Andersen, Kaminsky & Mitzenmacher (2014): Cuckoo Filter: Practically Better Than Bloom (ACM CoNEXT)", url: "https://doi.org/10.1145/2674005.2674994" },
      { title: "Graf & Lemire (2020): Xor Filters: Faster and Smaller Than Bloom and Cuckoo Filters (ACM JEA)", url: "https://arxiv.org/abs/1912.08258" }
    ]
  },

  "count-min-sketch-heavy-hitters": {
    title: "Count-Min Sketch & Streaming Frequency Estimation Error Bounds",
    video: {
      youtubeId: "hJitoHv4rAU",
      id: "hJitoHv4rAU",
      url: "https://www.youtube.com/embed/hJitoHv4rAU",
      title: "Count-Min Sketch: Streaming Frequency Estimation & Error Bounds",
      channel: "Ben Langmead",
      duration: "16:22",
      start: 0,
      length: "16m",
      why: "Erik Demaine proves the (ε, δ) Markov inequality bound for Count-Min Sketch, shows why pairwise independence suffices, and demonstrates dyadic range heavy-hitter queries."
    },
    intuition: "<p>Imagine monitoring a core network router processing $N = 10^{10}$ packets per minute across billions of distinct <code>(src_ip, dst_ip)</code> flows. Maintaining an exact hash table of flow frequencies requires gigabytes of DRAM, whereas high-speed SRAM on an ASIC switch is measured in megabytes. The <strong>Count-Min Sketch (CMS)</strong> (Cormode &amp; Muthukrishnan, 2005) maintains a compact 2D matrix of $d \\times w$ counters Whose size is <strong>completely independent of the number of distinct keys</strong>, depending only on the desired additive error $\\varepsilon$ and failure probability $\\delta$!</p><p>By choosing width $w = \\lceil e / \\varepsilon \\rceil$ and depth $d = \\lceil \\ln(1/\\delta) \\rceil$ with $d$ pairwise-independent hash functions, taking the minimum across the $d$ rows ($\\hat{f}_x = \\min_{j} C[j][h_j(x)]$) guarantees via Markov's inequality that $f_x \\le \\hat{f}_x \\le f_x + \\varepsilon N$ with probability at least $1 - \\delta$.</p>",
    content: `<div class="lesson-content">
      <h2>Architecture &amp; $(\\varepsilon, \\delta)$ Markov Proof of the Count-Min Sketch</h2>
      <p>Given a stream of updates $(x_t, c_t)$ with non-negative increments $c_t > 0$ and total stream weight $N = \\sum_t c_t$, a Count-Min Sketch allocates a 2D array $C[0..d-1][0..w-1]$ of integer counters initialized to $0$, paired with $d$ hash functions $h_0, \\dots, h_{d-1}: \\mathcal{U} \\to \\{0, \\dots, w-1\\}$ chosen independently from a <strong>pairwise-independent (2-universal)</strong> family.</p>
      <ul>
        <li><strong><code>update(x, c)</code>:</strong> For each row $j \\in \\{0, \\dots, d-1\\}$, increment $C[j][h_j(x)] \\mathrel{+}= c$.</li>
        <li><strong><code>estimate(x)</code>:</strong> Return $\\hat{f}_x = \\min_{0 \\le j < d} C[j][h_j(x)]$. Because all increments are non-negative, every row $C[j][h_j(x)]$ equals the true frequency $f_x$ plus colliding traffic from other keys, so $\\hat{f}_x \\ge f_x$ always holds (one-sided overestimation error).</li>
        <li><strong>Conservative Update (Estan &amp; Varghese, 2002):</strong> For positive-only streams, instead of blindly incrementing all $d$ rows, first compute the current estimate $\\hat{f}_x = \\min_j C[j][h_j(x)]$, set the new target $\\text{new\\_val} = \\hat{f}_x + c$, and update each row to $C[j][h_j(x)] \\gets \\max(C[j][h_j(x)], \\text{new\\_val})$. This strictly preserves $\\hat{f}_x \\ge f_x$ while cutting empirical overestimation error by $2\\times$ to $5\\times$!</li>
      </ul>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Streaming Algorithm</th>
            <th>Space Complexity</th>
            <th>Update / Query Time</th>
            <th>Error Guarantee ($N = \\|f\\|_1$)</th>
            <th>Supports Negative Updates?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Count-Min Sketch (CMS)</td>
            <td>$O\\left(\\frac{1}{\\varepsilon} \\ln \\frac{1}{\\delta}\\right)$ counters</td>
            <td><span class="badge-o1">O(d) = O(ln(1/δ))</span></td>
            <td>$f_x \\le \\hat{f}_x \\le f_x + \\varepsilon N$ (w.p. $1-\\delta$)</td>
            <td>Yes (Median query if negative)</td>
          </tr>
          <tr>
            <td>CMS + Conservative Update</td>
            <td>$O\\left(\\frac{1}{\\varepsilon} \\ln \\frac{1}{\\delta}\\right)$ counters</td>
            <td><span class="badge-o1">O(d) = O(ln(1/δ))</span></td>
            <td>Strictly tighter $\\hat{f}_x$ in practice</td>
            <td>No (Positive increments only)</td>
          </tr>
          <tr>
            <td>Count Sketch (Charikar et al.)</td>
            <td>$O\\left(\\frac{1}{\\varepsilon^2} \\ln \\frac{1}{\\delta}\\right)$ counters</td>
            <td><span class="badge-o1">O(d) = O(ln(1/δ))</span></td>
            <td>$|\\hat{f}_x - f_x| \\le \\varepsilon \\|f\\|_2$ (Unbiased $\\ell_2$)</td>
            <td>Yes (Uses $\\pm 1$ sign hashes)</td>
          </tr>
          <tr>
            <td>Misra-Gries / Space-Saving</td>
            <td>$O(1/\\varepsilon)$ exact slots</td>
            <td><span class="badge-o1">O(1)</span> (Hash + Bucket)</td>
            <td>Deterministic heavy hitters $\\ge \\varepsilon N$</td>
            <td>No (Insertion-only streams)</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Formal Proof: Why $w = \\lceil e / \\varepsilon \\rceil$ and $d = \\lceil \\ln(1/\\delta) \\rceil$ Bound Error</h4>
        <p>Fix a query key $x$ and a single row $j$. Let $X_j = C[j][h_j(x)] - f_x = \\sum_{y \\ne x} f_y \\cdot \\mathbb{I}[h_j(y) = h_j(x)]$ be the excess noise in row $j$ caused by collisions. Because $h_j$ is chosen from a 2-universal family, $\\Pr[h_j(y) = h_j(x)] \\le 1/w$. By linearity of expectation:</p>
        <p>$$\\mathbb{E}[X_j] = \\sum_{y \\ne x} f_y \\Pr[h_j(y) = h_j(x)] \\le \\frac{1}{w} \\sum_{y \\ne x} f_y \\le \\frac{N}{w} = \\frac{\\varepsilon N}{e}$$</p>
        <p>Since $X_j \\ge 0$ (all frequencies are non-negative), <strong>Markov's Inequality</strong> yields for row $j$:</p>
        <p>$$\\Pr[X_j > \\varepsilon N] \\le \\frac{\\mathbb{E}[X_j]}{\\varepsilon N} \\le \\frac{\\varepsilon N / e}{\\varepsilon N} = \\frac{1}{e}$$</p>
        <p>Because the $d$ rows use mutually independent hash seeds, $\\hat{f}_x - f_x = \\min_j X_j > \\varepsilon N$ occurs <em>if and only if</em> every single row $j \\in \\{0, \\dots, d-1\\}$ exceeds $\\varepsilon N$ simultaneously:</p>
        <p>$$\\Pr[\\hat{f}_x > f_x + \\varepsilon N] = \\prod_{j=0}^{d-1} \\Pr[X_j > \\varepsilon N] \\le \\left(\\frac{1}{e}\\right)^d = e^{-\\lceil \\ln(1/\\delta) \\rceil} \\le \\delta$$</p>
      </div>

      <h2>Visualizing the $d \\times w$ Count-Min Matrix &amp; Conservative Update</h2>
      <svg viewBox="0 0 740 230" width="100%" height="230" role="img" aria-label="Count-Min Sketch 2D matrix min-aggregation and Conservative Update">
        <defs>
          <style>
            .cm-cell { fill: #0f172a; stroke: #334155; stroke-width: 1.6; rx: 4; }
            .cm-hit { fill: #1e293b; stroke: #38bdf8; stroke-width: 2; rx: 4; }
            .cm-min { fill: #052e16; stroke: #22c55e; stroke-width: 2.2; rx: 4; }
            .cm-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; text-anchor: middle; }
            .cm-sub { fill: #94a3b8; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <text class="cm-sub" x="20" y="24" fill="#cbd5e1">Count-Min Matrix (d = 3 rows, w = 6 columns) querying key x:</text>
        <text class="cm-sub" x="20" y="58">Row h0(x)=1:</text>
        <rect class="cm-cell" x="115" y="38" width="52" height="32"/><text class="cm-txt" x="141" y="59">4</text>
        <rect class="cm-hit" x="173" y="38" width="52" height="32"/><text class="cm-txt" x="199" y="59" fill="#38bdf8">19</text>
        <rect class="cm-cell" x="231" y="38" width="52" height="32"/><text class="cm-txt" x="257" y="59">2</text>
        <rect class="cm-cell" x="289" y="38" width="52" height="32"/><text class="cm-txt" x="315" y="59">8</text>
        <rect class="cm-cell" x="347" y="38" width="52" height="32"/><text class="cm-txt" x="373" y="59">0</text>
        <rect class="cm-cell" x="405" y="38" width="52" height="32"/><text class="cm-txt" x="431" y="59">5</text>

        <text class="cm-sub" x="20" y="100">Row h1(x)=4:</text>
        <rect class="cm-cell" x="115" y="80" width="52" height="32"/><text class="cm-txt" x="141" y="101">7</text>
        <rect class="cm-cell" x="173" y="80" width="52" height="32"/><text class="cm-txt" x="199" y="101">3</text>
        <rect class="cm-cell" x="231" y="80" width="52" height="32"/><text class="cm-txt" x="257" y="101">11</text>
        <rect class="cm-cell" x="289" y="80" width="52" height="32"/><text class="cm-txt" x="315" y="101">1</text>
        <rect class="cm-min" x="347" y="80" width="52" height="32"/><text class="cm-txt" x="373" y="101" fill="#4ade80">12</text>
        <rect class="cm-cell" x="405" y="80" width="52" height="32"/><text class="cm-txt" x="431" y="101">6</text>

        <text class="cm-sub" x="20" y="142">Row h2(x)=2:</text>
        <rect class="cm-cell" x="115" y="122" width="52" height="32"/><text class="cm-txt" x="141" y="143">9</text>
        <rect class="cm-cell" x="173" y="122" width="52" height="32"/><text class="cm-txt" x="199" y="143">2</text>
        <rect class="cm-hit" x="231" y="122" width="52" height="32"/><text class="cm-txt" x="257" y="143" fill="#38bdf8">15</text>
        <rect class="cm-cell" x="289" y="122" width="52" height="32"/><text class="cm-txt" x="315" y="143">5</text>
        <rect class="cm-cell" x="347" y="122" width="52" height="32"/><text class="cm-txt" x="373" y="143">4</text>
        <rect class="cm-cell" x="405" y="122" width="52" height="32"/><text class="cm-txt" x="431" y="143">1</text>

        <rect class="cm-cell" x="480" y="38" width="245" height="116"/>
        <text class="cm-sub" x="492" y="62" fill="#4ade80">Query Estimate:</text>
        <text class="cm-sub" x="492" y="82">min(19, 12, 15) = 12</text>
        <text class="cm-sub" x="492" y="110" fill="#fbbf24">Conservative Update (+1):</text>
        <text class="cm-sub" x="492" y="130">target = 12 + 1 = 13</text>
        <text class="cm-sub" x="492" y="146">Only Row 1 (12→13) increments!</text>

        <text class="cm-sub" x="20" y="192">Heavy-Hitter Tracking (Top-K Flows ≥ φ·N): Pair CMS with a bounded Min-Heap of size K.</text>
        <text class="cm-sub" x="20" y="212">On update(x, c), if est(x) &gt; heap.min().count, update or replace min-heap root in O(log K).</text>
      </svg>

      <div class="mermaid">
flowchart LR
  Stream["Stream Item (x, c)"] --> CMS["Conservative Update CMS\nnew_est = min_j C[j][h_j(x)] + c\nC[j][h_j(x)] = max(C[j][h_j(x)], new_est)"]
  CMS --> HH{"x in Top-K Heap?"}
  HH -- "Yes" --> Upd["Update x.est = new_est\nsiftDown(pos[x])"]
  HH -- "No & new_est > heap.min()" --> Rep["Replace heap.min() with (x, new_est)"]
      </div>

      <div class="simulator-mount" data-sim="sim-cms-hyperloglog"></div>

      <div class="hardware-box">
        <h4>Hardware Reality: Flat Power-of-Two Row Alignment &amp; Linear Mergeability</h4>
        <p>When implementing Count-Min Sketch in C++ or Rust, rounding the width $w = \\lceil e / \\varepsilon \\rceil$ up to the next power of two $W = 2^r$ replaces slow modulo arithmetic with a single bitwise mask <code>h & (W - 1)</code> and allows all $d$ rows to be stored in a <strong>single contiguous 1D allocation</strong> <code>table[(j << r) | (h & (W - 1))]</code>. Furthermore, standard CMS (without conservative update) is a <strong>linear sketch</strong>: two sketches $C^{(A)}$ and $C^{(B)}$ computed on separate CPU cores or data centers with the same seeds can be merged in-place via vectorized SIMD addition $C^{(A+B)} = C^{(A)} + C^{(B)}$ (<code>_mm256_add_epi64</code>).</p>
      </div>

      <h2>Production C++20 Implementation: Count-Min Sketch with Conservative Update &amp; Heavy-Hitter Heap</h2>
      <pre><code class="language-cpp">// C++20: Count-Min Sketch with Power-of-2 Width, Conservative Update &amp; Distributed Merge
#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;algorithm&gt;
#include &lt;limits&gt;
#include &lt;bit&gt;
#include &lt;cmath&gt;

class CountMinSketch {
    uint32_t depth_;
    uint32_t width_;      // Power of 2 &gt;= ceil(e / eps)
    uint32_t widthMask_;
    uint32_t widthShift_;
    std::vector&lt;uint64_t&gt; table_;
    std::vector&lt;uint64_t&gt; seeds_;

    uint32_t hashRow(uint64_t key, uint32_t row) const noexcept {
        uint64_t x = key ^ seeds_[row];
        x = (x ^ (x &gt;&gt; 30)) * 0xbf58476d1ce4e5b9ULL;
        x = (x ^ (x &gt;&gt; 27)) * 0x94d049bb133111ebULL;
        return static_cast&lt;uint32_t&gt;(x ^ (x &gt;&gt; 31)) &amp; widthMask_;
    }

public:
    CountMinSketch(double epsilon, double delta) {
        uint32_t rawW = static_cast&lt;uint32_t&gt;(std::ceil(2.718281828459045 / epsilon));
        width_ = std::bit_ceil(std::max(16U, rawW));
        widthMask_ = width_ - 1;
        widthShift_ = std::countr_zero(width_);
        depth_ = std::max(1U, static_cast&lt;uint32_t&gt;(std::ceil(std::log(1.0 / delta))));
        table_.assign(static_cast&lt;size_t&gt;(depth_) * width_, 0ULL);
        seeds_.resize(depth_);
        for (uint32_t j = 0; j &lt; depth_; ++j) {
            seeds_[j] = 0x9e3779b97f4a7c15ULL * (j + 1) + 0x6a09e667f3bcc908ULL;
        }
    }

    // Standard linear update (supports distributed sketch addition &amp; deletions)
    void updateLinear(uint64_t key, uint64_t count = 1) noexcept {
        for (uint32_t j = 0; j &lt; depth_; ++j) {
            uint32_t col = hashRow(key, j);
            table_[(static_cast&lt;size_t&gt;(j) &lt;&lt; widthShift_) | col] += count;
        }
    }

    // Conservative update: tightens accuracy by only raising counters to min_est + count
    uint64_t updateConservative(uint64_t key, uint64_t count = 1) noexcept {
        uint64_t target = estimate(key) + count;
        for (uint32_t j = 0; j &lt; depth_; ++j) {
            uint32_t col = hashRow(key, j);
            uint64_t&amp; cell = table_[(static_cast&lt;size_t&gt;(j) &lt;&lt; widthShift_) | col];
            if (cell &lt; target) cell = target;
        }
        return target;
    }

    uint64_t estimate(uint64_t key) const noexcept {
        uint64_t ans = std::numeric_limits&lt;uint64_t&gt;::max();
        for (uint32_t j = 0; j &lt; depth_; ++j) {
            uint32_t col = hashRow(key, j);
            ans = std::min(ans, table_[(static_cast&lt;size_t&gt;(j) &lt;&lt; widthShift_) | col]);
        }
        return ans;
    }
};</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Using Conservative Update When Deletions or Linear Sketch Merging Are Required:</strong> Conservative update is non-linear: if you apply conservative updates and later subtract counts on deletion, or add two conservatively updated sketches from two servers together, the invariant $\\hat{f}_x \\ge f_x$ is violated and you can suffer <strong>underestimation errors</strong>! Use standard <code>updateLinear</code> whenever deletions or distributed sketch merges are required.</li>
          <li><strong>Taking the Minimum When Negative Updates (Turnstile Model) Are Present:</strong> In turnstile streams where keys can be both incremented and decremented ($c_t \\in \\mathbb{Z}$) with bounded negative noise, taking the <code>min</code> fails if a colliding key had a net negative update. In the general turnstile model, query the <strong>median</strong> across rows (or use Charikar's Count Sketch with $\\pm 1$ Rademacher sign hashes).</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "Count-Min Sketch estimates point frequencies within additive error +εN with probability ≥ 1 - δ using w = ⌈e/ε⌉ columns and d = ⌈ln(1/δ)⌉ pairwise-independent rows.",
      "The error proof relies only on linearity of expectation (pairwise independence) to bound expected row collision noise by εN/e, followed by Markov's inequality and row independence.",
      "Conservative Update only increments counters up to min_j C[j][h_j(x)] + c, dramatically reducing overestimation on positive-only streams at the cost of losing linearity.",
      "Pairing a Count-Min Sketch with an O(K)-sized Min-Heap identifies streaming φ-heavy hitters in O(d + log K) time per packet."
    ],
    furtherReading: [
      { title: "Cormode & Muthukrishnan (2005): An Improved Data Stream Summary: The Count-Min Sketch and Its Applications (Journal of Algorithms)", url: "https://doi.org/10.1016/j.jalgor.2003.12.001" },
      { title: "MIT 6.851 Lecture Notes: Streaming & Sketching Algorithms", url: "https://courses.csail.mit.edu/6.851/spring21/lectures/" }
    ]
  },

  "hyperloglog-cardinality": {
    title: "HyperLogLog: Harmonic Mean & Stochastic Averaging in 1.5 KB",
    video: {
      youtubeId: "tOsb-tFoPCg",
      id: "tOsb-tFoPCg",
      url: "https://www.youtube.com/embed/tOsb-tFoPCg",
      title: "HyperLogLog & Stochastic Cardinality Estimation Internals",
      channel: "Arpit Bhayani",
      duration: "23:45",
      start: 0,
      length: "23m",
      why: "Erik Demaine explains the Flajolet-Martin leading-zero bit-pattern estimator, stochastic averaging across m buckets, and why the harmonic mean suppresses outlier variance."
    },
    intuition: "<p>How does Redis (<code>PFADD</code> / <code>PFCOUNT</code>), BigQuery (<code>APPROX_COUNT_DISTINCT</code>), or DuckDB count $10^9$ distinct user IDs (<code>COUNT(DISTINCT user_id)</code>) using only <strong>1.5 KB to 12 KB of memory</strong> with $< 0.81\\%$ standard error? If we hash every element uniformly to a 64-bit integer, a pattern of $\\rho - 1$ leading zeros followed by a <code>1</code> (e.g., <code>00001...</code>, where $\\rho = 5$) occurs with probability $2^{-\\rho}$. Thus, if the maximum position of the leftmost <code>1</code>-bit seen across a stream of distinct hashes is $R = \\max_x \\rho(h(x))$, then $2^R$ is a rough order-of-magnitude estimate of the cardinality $n$.</p><p>A single register $R$ has huge variance (powers of 2) and is easily skewed by a single lucky hash (<code>000000000001...</code>). <strong>HyperLogLog</strong> (Flajolet, Fusy, Gandouet, Meunier, 2007) uses the top $p$ bits of each 64-bit hash to partition the stream into $m = 2^p$ substreams (e.g., $p = 14 \\implies m = 16{,}384$ registers of 6 bits each = $12\\text{ KB}$) and combines the $m$ register maxima via the <strong>Harmonic Mean</strong>, achieving a tight standard error of $\\sigma \\approx \\frac{1.04}{\\sqrt{m}}$.</p>",
    content: `<div class="lesson-content">
      <h2>From Flajolet-Martin to HyperLogLog Harmonic Mean</h2>
      <p>Given a 64-bit uniform hash $h(x)$ and precision parameter $p \\in [4, 18]$ (so $m = 2^p$ registers $M[0..m-1]$ initialized to $0$):</p>
      <ol>
        <li><strong>Substream Bucketing (Stochastic Averaging):</strong> Extract the top $p$ bits of $h(x)$ as the register index $j = h(x) \\gg (64 - p) \\in [0, m-1]$.</li>
        <li><strong>Leading-Zero Rank $\\rho(w)$:</strong> Let $w$ be the remaining $64 - p$ bits of $h(x)$. Define $\\rho(w) = \\text{clz}(w) + 1 \\in [1, 64 - p + 1]$ as the 1-based position of the most significant <code>1</code>-bit in $w$. Update register $M[j] \\gets \\max(M[j], \\rho(w))$.</li>
        <li><strong>Harmonic Mean Estimator:</strong> Why did earlier LogLog (2003) use the geometric mean ($1.30 / \\sqrt{m}$ error) while HyperLogLog (2007) uses the <strong>harmonic mean</strong> ($1.04 / \\sqrt{m}$ error)? Because $2^{M[j]}$ has a heavy right-skewed tail ($\\mathbb{E}[2^{M[j]}] = \\infty$), an arithmetic mean explodes if a single register hits $\\rho = 40$. The harmonic mean averages $2^{-M[j]}$, completely neutralizing large outlier registers:
          <p>$$E_{\\text{raw}} = \\alpha_m \\cdot m^2 \\cdot \\left( \\sum_{j=0}^{m-1} 2^{-M[j]} \\right)^{-1}$$</p>
          where $\\alpha_m = \\left(m \\int_0^\\infty \\left(\\log_2\\left(\\frac{2+u}{1+u}\\right)\\right)^m du\\right)^{-1} \\approx \\frac{0.7213}{1 + 1.079/m}$ corrects asymptotic multiplicative bias.</li>
        <li><strong>Small-Range LinearCounting &amp; Sparse Representations:</strong> When $n$ is small and $V > 0$ registers are still $0$, and $E_{\\text{raw}} \\le \\frac{5}{2} m$, HLL switches to <strong>LinearCounting</strong> (Whang et al., 1990) based on the coupon-collector occupancy rate: $E = m \\ln(m / V)$.</li>
      </ol>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Cardinality Algorithm</th>
            <th>Register Count $m = 2^p$</th>
            <th>Memory Footprint (6b/reg)</th>
            <th>Relative Error $\\sigma$</th>
            <th>Distributed Merge (<code>PFMERGE</code>)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Exact <code>std::unordered_set&lt;u64&gt;</code></td>
            <td>$N$ heap nodes</td>
            <td>$\\ge 24\\text{ GB}$ (for $10^9$ keys)</td>
            <td>$0\\%$ (Exact)</td>
            <td>$O(N)$ set union</td>
          </tr>
          <tr>
            <td>LinearCounting (Bitset)</td>
            <td>$m \\approx N / 10$ bits</td>
            <td>$~12.5\\text{ MB}$ (for $10^9$ keys)</td>
            <td>Saturates when $N \\gg m \\ln m$</td>
            <td>Bitwise <code>OR</code> in $O(m/64)$</td>
          </tr>
          <tr>
            <td>HyperLogLog ($p = 11$, Redis compact)</td>
            <td>$m = 2{,}048$</td>
            <td>$1.5\\text{ KB}$</td>
            <td>$1.04 / \\sqrt{2048} \\approx 2.30\\%$</td>
            <td>Elementwise $\\max(M_A[j], M_B[j])$</td>
          </tr>
          <tr>
            <td>HyperLogLog ($p = 14$, Redis standard)</td>
            <td>$m = 16{,}384$</td>
            <td>$12.0\\text{ KB}$</td>
            <td>$1.04 / \\sqrt{16384} \\approx 0.81\\%$</td>
            <td>Elementwise $\\max(M_A[j], M_B[j])$</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Formal Specification: Commutative-Idempotent Semilattice Merge</h4>
        <p><strong>Monotonic Register Semilattice:</strong> For any multiset $S$, the state of a HyperLogLog sketch is uniquely determined by $M_S[j] = \\max_{x \\in S,\\, \\text{bucket}(x)=j} \\rho(x)$. Because $\\max$ is associative, commutative, and idempotent:</p>
        <p>$$M_{A \\cup B}[j] = \\max(M_A[j], M_B[j]) \\quad \\forall j \\in \\{0, \\dots, m-1\\}$$</p>
        <p>Consequently, merging two HLL sketches from different shards produces the <strong>exact same register state and cardinality estimate</strong> as if all items in $A \\cup B$ had been fed into a single HLL in any order, with zero loss of accuracy regardless of how many times sketches are merged!</p>
      </div>

      <h2>Visualizing 64-Bit Hash Splitting ($p = 14$) &amp; Harmonic Mean Aggregation</h2>
      <svg viewBox="0 0 740 225" width="100%" height="225" role="img" aria-label="HyperLogLog 64-bit hash splitting into 14-bit bucket index and 50-bit clz rank">
        <defs>
          <style>
            .hll-idx { fill: #1e293b; stroke: #38bdf8; stroke-width: 2; rx: 5; }
            .hll-rem { fill: #052e16; stroke: #22c55e; stroke-width: 2; rx: 5; }
            .hll-reg { fill: #0f172a; stroke: #94a3b8; stroke-width: 1.6; rx: 4; }
            .hll-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; }
            .hll-sub { fill: #94a3b8; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <text class="hll-sub" x="20" y="24" fill="#cbd5e1">64-Bit Uniform Hash h(x) Decomposition (Precision p = 14 → m = 16,384 Registers):</text>
        <rect class="hll-idx" x="20" y="36" width="235" height="54"/>
        <text class="hll-txt" x="32" y="58" fill="#38bdf8">Top p = 14 Bits [63..50]</text>
        <text class="hll-sub" x="32" y="78">j = 0b01011001001011 = 5707</text>

        <rect class="hll-rem" x="265" y="36" width="455" height="54"/>
        <text class="hll-txt" x="278" y="58" fill="#4ade80">Remaining 50 Bits w [49..0]: 0000010110110...</text>
        <text class="hll-sub" x="278" y="78" fill="#86efac">ρ(w) = clz(w) + 1 = 5 + 1 = 6  (Fits in 6-bit register ∈ [0..51])</text>

        <rect class="hll-reg" x="20" y="110" width="700" height="96"/>
        <text class="hll-txt" x="35" y="135" fill="#fbbf24">Register Update &amp; Harmonic Mean (16,384 × 6 bits = 12 KB Total):</text>
        <text class="hll-sub" x="35" y="158">• Update: M[5707] = max(M[5707], 6)   (Branchless single-instruction update)</text>
        <text class="hll-sub" x="35" y="178">• Harmonic Sum: Z = ∑_{j=0}^{16383} 2^{-M[j]}   →   E = α_m · m² / Z</text>
        <text class="hll-sub" x="35" y="196">• If E ≤ 2.5·m and V = count(M[j] == 0) &gt; 0: Return LinearCounting m · ln(m / V)</text>
      </svg>

      <div class="mermaid">
flowchart LR
  Item["Element x"] --> H["h = hash64(x)"]
  H --> Split["j = h >> (64 - p)\nw = (h << p) | (1 << (p - 1))"]
  Split --> Rank["rho = countl_zero(w) + 1\nM[j] = max(M[j], rho)"]
  Rank --> Est["Query: Z = sum(2^-M[j])\nE = alpha_m * m^2 / Z"]
  Est --> LC{"E <= 2.5m AND\nZeroRegs V > 0?"}
  LC -- "Yes" --> OutLC["Return m * ln(m / V)"]
  LC -- "No" --> OutHLL["Return E"]
      </div>

      <div class="simulator-mount" data-sim="sim-cms-hyperloglog"></div>

      <div class="hardware-box">
        <h4>Hardware Reality: Hardware <code>LZCNT</code> / <code>std::countl_zero</code> &amp; Sentinel Bit Trick</h4>
        <p>Every x86-64 (ABM/BMI1 <code>LZCNT</code>) and ARM64 (<code>CLZ</code>) processor computes the number of leading zeros in a 64-bit register in <strong>1 to 3 clock cycles</strong> via <code>std::countl_zero(w)</code>. To prevent $\\rho(w)$ from exceeding $64 - p + 1$ when all $64 - p$ bits of $w$ are zero, shift $w$ left by $p$ bits and bitwise-OR a sentinel <code>1</code> at bit $p - 1$: <code>w_shifted = (h << p) | (1ULL << (p - 1))</code>. Then <code>std::countl_zero(w_shifted) + 1</code> is branchless, well-defined even when $w = 0$, and never invokes undefined behavior on legacy <code>BSR</code> instructions!</p>
      </div>

      <h2>Production C++20 Implementation: 64-Bit HyperLogLog with LinearCounting &amp; Merge</h2>
      <pre><code class="language-cpp">// C++20: HyperLogLog (64-bit hash, p in [4..18]) with Sentinel CLZ &amp; LinearCounting
#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;bit&gt;
#include &lt;cmath&gt;
#include &lt;algorithm&gt;

class HyperLogLog {
    uint32_t p_;
    uint32_t m_;
    double alphaMM_;
    std::vector&lt;uint8_t&gt; regs_;

    static uint64_t hash64(uint64_t x) noexcept {
        x = (x ^ (x &gt;&gt; 30)) * 0xbf58476d1ce4e5b9ULL;
        x = (x ^ (x &gt;&gt; 27)) * 0x94d049bb133111ebULL;
        return x ^ (x &gt;&gt; 31);
    }

public:
    explicit HyperLogLog(uint32_t p = 14)
        : p_(std::clamp(p, 4U, 18U)), m_(1U &lt;&lt; p_), regs_(m_, 0) {
        double alpha = 0.7213 / (1.0 + 1.079 / static_cast&lt;double&gt;(m_));
        if (m_ == 16) alpha = 0.673;
        else if (m_ == 32) alpha = 0.697;
        else if (m_ == 64) alpha = 0.709;
        alphaMM_ = alpha * static_cast&lt;double&gt;(m_) * static_cast&lt;double&gt;(m_);
    }

    void add(uint64_t item) noexcept {
        uint64_t h = hash64(item);
        uint32_t j = static_cast&lt;uint32_t&gt;(h &gt;&gt; (64 - p_));
        // Shift remaining (64 - p) bits to MSB and set sentinel bit at (p - 1)
        uint64_t w = (h &lt;&lt; p_) | (1ULL &lt;&lt; (p_ - 1));
        uint8_t rho = static_cast&lt;uint8_t&gt;(std::countl_zero(w) + 1);
        if (rho &gt; regs_[j]) regs_[j] = rho;
    }

    double count() const noexcept {
        double sumInv = 0.0;
        uint32_t zeroRegs = 0;
        for (uint8_t r : regs_) {
            sumInv += std::ldexp(1.0, -static_cast&lt;int&gt;(r)); // 2^{-r}
            if (r == 0) ++zeroRegs;
        }
        double est = alphaMM_ / sumInv;
        if (est &lt;= 2.5 * static_cast&lt;double&gt;(m_) &amp;&amp; zeroRegs &gt; 0) {
            return static_cast&lt;double&gt;(m_) * std::log(static_cast&lt;double&gt;(m_) / zeroRegs);
        }
        return est;
    }

    // Lossless Commutative Semilattice Merge (Redis PFMERGE)
    void merge(const HyperLogLog&amp; other) noexcept {
        for (uint32_t j = 0; j &lt; m_; ++j) {
            regs_[j] = std::max(regs_[j], other.regs_[j]);
        }
    }
};</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>32-Bit Hash Saturation at $N > 10^8$:</strong> The original 2007 HLL paper used 32-bit hashes, which saturate above $2^{32} \\approx 4.29 \\times 10^9$ and require complex high-range correction formulas. Always use a <strong>64-bit hash function</strong> (HyperLogLog++, Heule et al., Google 2013): with 64-bit hashes and $p = 14$, the remaining $50$ bits measure cardinalities up to $2^{50} \\approx 10^{15}$ with zero high-range saturation!</li>
          <li><strong>Set Intersection Traps ($|A \\cap B| = |A| + |B| - |A \\cup B|$):</strong> While union $|A \\cup B|$ via register-wise <code>max</code> has relative error $\\sigma \\approx 1.04/\\sqrt{m}$, estimating a small intersection $|A \\cap B|$ via Inclusion-Exclusion magnifies the additive error of $|A \\cup B|$ by the ratio $\\frac{|A \\cup B|}{|A \\cap B|}$! For small overlap ratios, use <strong>MinHash</strong> or <strong>Theta Sketches</strong> instead of HLL inclusion-exclusion.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "HyperLogLog partitions a 64-bit hash into a p-bit bucket index (m = 2^p registers) and a (64-p)-bit suffix whose leading-zero rank ρ = clz(w) + 1 estimates log₂(N/m).",
      "Aggregating the m registers via the Harmonic Mean suppresses heavy-tailed outlier variance, achieving standard error σ ≈ 1.04 / √m (0.81% with 16,384 6-bit registers in 12 KB).",
      "For small cardinalities (E ≤ 2.5m with V > 0 empty registers), HLL transitions to LinearCounting E = m ln(m / V) to eliminate small-sample bias.",
      "HLL sketches form a bounded join-semilattice under register-wise max(M_A[j], M_B[j]), enabling lossless O(m) distributed unions across arbitrary shards."
    ],
    furtherReading: [
      { title: "Flajolet, Fusy, Gandouet & Meunier (2007): HyperLogLog: the analysis of a near-optimal cardinality estimation algorithm (DMTCS)", url: "https://algo.inria.fr/flajolet/Publications/FlFuGaMe07.pdf" },
      { title: "Heule, Nunkesser & Hall (2013): HyperLogLog in Practice: Algorithmic Engineering of a State of The Art Cardinality Estimation Algorithm (EDBT / Google)", url: "https://research.google/pubs/hyperloglog-in-practice-algorithmic-engineering-of-a-state-of-the-art-cardinality-estimation-algorithm/" }
    ]
  },

  "case-rust-hashbrown-swisstable": {
    title: "Production Case Study: Google Abseil SwissTable & Rust hashbrown SIMD Probing",
    video: {
      youtubeId: "ncHmEUmJZf4",
      title: "CppCon 2017: Matt Kulukundis — Designing a Fast, Efficient, Cache-friendly Hash Table, Step by Step",
      channel: "CppCon",
      duration: "1:02:18",
      start: 0,
      length: "1h 02m",
      why: "Matt Kulukundis walks through the exact engineering of Google's absl::flat_hash_map (SwissTable), showing how 1-byte H2 metadata control arrays and 16-way SSE2 bitmask instructions replace legacy std::unordered_map."
    },
    intuition: "<p>For a decade, C++'s <code>std::unordered_map</code> was notorious for slow performance because the C++11 standard mandated pointer stability across insertions, forcing implementations into pointer-chased Separate Chaining with <code>malloc</code> per node. Even open-addressed Robin Hood tables (which served as Rust's <code>std::collections::HashMap</code> from 2014 to 2018) had to store an 8-byte hash or PSL alongside every <code>(Key, Value)</code> slot, wasting alignment padding and polluting L1 cache lines during probing.</p><p>In 2017, Google engineers (Matt Kulukundis, Alkis Evlogimenos et al.) introduced <strong>SwissTable</strong> (<code>absl::flat_hash_map</code>), later ported to Rust as <strong><code>hashbrown</code></strong> (the default <code>std::collections::HashMap</code> since Rust 1.36). SwissTable decouples metadata from slots: it stores a contiguous array of <strong>1-byte control bytes</strong> (16 bytes = 1 SSE2/NEON vector register) containing a 7-bit hash fingerprint <code>H2</code>, enabling a single SIMD instruction (<code>_mm_cmpeq_epi8</code>) to probe <strong>16 buckets in parallel in 1 CPU cycle</strong> up to an $87.5\\%$ ($7/8$) load factor!</p>",
    content: `<div class="lesson-content">
      <h2>Inside SwissTable / <code>hashbrown</code>: <code>H1</code>/<code>H2</code> Split &amp; 1-Byte Control Metadata</h2>
      <p>Given a 64-bit hash $h = \\text{hash}(k)$, SwissTable splits $h$ into two components:</p>
      <ul>
        <li><strong><code>H1(h) = h >> 7</code> (57 bits):</strong> Selects the starting 16-slot <strong>Probe Group</strong> index <code>pos = H1(h) & mask</code>.</li>
        <li><strong><code>H2(h) = h & 0x7F</code> (7 bits):</strong> A 7-bit fingerprint stored in the corresponding 1-byte <strong>Control Byte (<code>ctrl[i]</code>)</strong>. Because the top bit (bit 7, the sign bit <code>0x80</code>) of every occupied <code>H2</code> byte is strictly <code>0</code> (<code>0b0xxxxxxx</code>), the top bit <code>1</code> (<code>0b1xxxxxxx</code>) is reserved for special empty/deleted sentinels!</li>
      </ul>
      <p>Look at the cleverness of the three sentinel byte encodings in <code>hashbrown</code> / Abseil:</p>
      <ul>
        <li><strong><code>OCCUPIED</code>:</strong> <code>0b0xxxxxxx</code> (<code>0x00</code> to <code>0x7F</code>) — Bit 7 is <code>0</code>, bits <code>[6..0]</code> hold the 7-bit <code>H2</code> hash tag.</li>
        <li><strong><code>EMPTY</code>:</strong> <code>0b11111111</code> (<code>0xFF</code>, signed <code>-1</code>, or <code>0x80</code> <code>-128</code> in Abseil) — Bit 7 is <code>1</code>.</li>
        <li><strong><code>DELETED</code> (Tombstone):</strong> <code>0b10000000</code> (<code>0x80</code> in <code>hashbrown</code> / <code>0xFE</code> <code>-2</code> in Abseil) — Bit 7 is <code>1</code>.</li>
      </ul>
      <p>Because both <code>EMPTY</code> and <code>DELETED</code> have their sign bit (bit 7) set to <code>1</code>, a single x86 SSE2 instruction <code>_mm_movemask_epi8(ctrl_group)</code> extracts the MSB of all 16 control bytes simultaneously into a 16-bit integer mask of all non-occupied slots!</p>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Hash Map Implementation</th>
            <th>Memory Overhead / Slot</th>
            <th>Max Load Factor $\\alpha$</th>
            <th>Buckets Checked per L1 Line</th>
            <th>Full-Key False Compare Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>C++ <code>std::unordered_map</code></td>
            <td>16–24B (<code>next</code> ptr + heap header)</td>
            <td>$1.00$ (Unbounded chains)</td>
            <td>$1$ (Pointer chase per node)</td>
            <td>Matches in bucket chain</td>
          </tr>
          <tr>
            <td>Legacy Rust Robin Hood Map</td>
            <td>8B hash + alignment padding</td>
            <td>$0.90$</td>
            <td>$2–4$ <code>(hash, K, V)</code> structs</td>
            <td>$2^{-64}$</td>
          </tr>
          <tr>
            <td>Google Abseil <code>flat_hash_map</code></td>
            <td><strong>1 Byte</strong> (<code>ctrl_t</code> H2)</td>
            <td>$7/8 = 87.5\\%$</td>
            <td><strong>64 Control Bytes</strong> (4 SIMD Groups)</td>
            <td>$1 / 128 \\approx 0.78\\%$</td>
          </tr>
          <tr>
            <td>Rust <code>hashbrown::HashMap</code></td>
            <td><strong>1 Byte</strong> (<code>u8</code> H2)</td>
            <td>$7/8 = 87.5\\%$</td>
            <td><strong>64 Control Bytes</strong> (4 SIMD Groups)</td>
            <td>$1 / 128 \\approx 0.78\\%$</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Formal Specification: The 16-Way SIMD Lookup State Machine</h4>
        <p>To find <code>key</code> with <code>(h1, h2)</code>: start at <code>group_idx = h1 & mask</code> and <code>step = 0</code>. In each iteration:</p>
        <ol>
          <li>Load 16 control bytes starting at <code>ctrl + group_idx</code> into a 128-bit SIMD register <code>g = _mm_loadu_si128(...)</code>.</li>
          <li><strong>Match <code>H2</code>:</strong> <code>match_mask = _mm_movemask_epi8(_mm_cmpeq_epi8(g, _mm_set1_epi8(h2)))</code>. Iterate over set bits via <code>tz = countr_zero(match_mask)</code> and <code>match_mask &= match_mask - 1</code>. Only for those rare lanes where the 7-bit <code>H2</code> matches (false positive rate $1/2^7 = 0.78\\%$) do we touch the <code>slots[]</code> data array to compare <code>slots[idx].key == key</code>!</li>
          <li><strong>Check <code>EMPTY</code>:</strong> <code>empty_mask = _mm_movemask_epi8(_mm_cmpeq_epi8(g, _mm_set1_epi8(EMPTY)))</code>. If <code>empty_mask != 0</code>, at least one slot in this 16-slot group has never been occupied, so the probe chain terminates immediately (<code>return NOT_FOUND</code>).</li>
          <li><strong>Triangular Group Advance:</strong> If all 16 slots are <code>OCCUPIED</code> or <code>DELETED</code>, advance to the next group via triangular probing: <code>step += 16; group_idx = (group_idx + step) & mask</code>.</li>
        </ol>
      </div>

      <h2>Visualizing the 16-Byte SIMD Control Group &amp; Bitmask Extraction</h2>
      <svg viewBox="0 0 740 235" width="100%" height="235" role="img" aria-label="SwissTable 16-byte H2 Control Group SIMD _mm_cmpeq_epi8 and _mm_movemask_epi8">
        <defs>
          <style>
            .sw-ctrl { fill: #0f172a; stroke: #334155; stroke-width: 1.6; rx: 4; }
            .sw-hit { fill: #052e16; stroke: #22c55e; stroke-width: 2.2; rx: 4; }
            .sw-emp { fill: #1e293b; stroke: #38bdf8; stroke-width: 1.8; rx: 4; }
            .sw-txt { fill: #f8fafc; font-family: monospace; font-size: 11px; text-anchor: middle; }
            .sw-sub { fill: #94a3b8; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <text class="sw-sub" x="20" y="22" fill="#cbd5e1">16-Byte Control Group (128-bit XMM Register) — Searching for Target H2 = 0x5A:</text>
        <rect class="sw-hit" x="20" y="34" width="40" height="36"/><text class="sw-txt" x="40" y="56" fill="#4ade80">5A</text>
        <rect class="sw-ctrl" x="63" y="34" width="40" height="36"/><text class="sw-txt" x="83" y="56">12</text>
        <rect class="sw-emp" x="106" y="34" width="40" height="36"/><text class="sw-txt" x="126" y="56" fill="#38bdf8">FF</text>
        <rect class="sw-ctrl" x="149" y="34" width="40" height="36"/><text class="sw-txt" x="169" y="56">3F</text>
        <rect class="sw-hit" x="192" y="34" width="40" height="36"/><text class="sw-txt" x="212" y="56" fill="#4ade80">5A</text>
        <rect class="sw-ctrl" x="235" y="34" width="40" height="36"/><text class="sw-txt" x="255" y="56">80</text>
        <rect class="sw-ctrl" x="278" y="34" width="40" height="36"/><text class="sw-txt" x="298" y="56">41</text>
        <rect class="sw-emp" x="321" y="34" width="40" height="36"/><text class="sw-txt" x="341" y="56" fill="#38bdf8">FF</text>
        <rect class="sw-ctrl" x="364" y="34" width="40" height="36"/><text class="sw-txt" x="384" y="56">09</text>
        <rect class="sw-ctrl" x="407" y="34" width="40" height="36"/><text class="sw-txt" x="427" y="56">7C</text>
        <rect class="sw-emp" x="450" y="34" width="40" height="36"/><text class="sw-txt" x="470" y="56" fill="#38bdf8">FF</text>
        <rect class="sw-ctrl" x="493" y="34" width="40" height="36"/><text class="sw-txt" x="513" y="56">2E</text>
        <rect class="sw-ctrl" x="536" y="34" width="40" height="36"/><text class="sw-txt" x="556" y="56">6B</text>
        <rect class="sw-emp" x="579" y="34" width="40" height="36"/><text class="sw-txt" x="599" y="56" fill="#38bdf8">FF</text>
        <rect class="sw-ctrl" x="622" y="34" width="40" height="36"/><text class="sw-txt" x="642" y="56">1D</text>
        <rect class="sw-emp" x="665" y="34" width="40" height="36"/><text class="sw-txt" x="685" y="56" fill="#38bdf8">FF</text>

        <rect class="sw-ctrl" x="20" y="88" width="685" height="130"/>
        <text class="sw-sub" x="35" y="112" fill="#4ade80">Step 1: _mm_movemask_epi8(_mm_cmpeq_epi8(ctrl, 0x5A))  →  match_mask = 0b00000000_00010001 (Lanes 0, 4)</text>
        <text class="sw-sub" x="35" y="136">Step 2: Iterate match_mask via ctz(mask) &amp; (mask &amp;= mask - 1): Compare slots[0].key, then slots[4].key</text>
        <text class="sw-sub" x="35" y="160" fill="#38bdf8">Step 3: _mm_movemask_epi8(_mm_cmpeq_epi8(ctrl, 0xFF))  →  empty_mask = 0b10100100_10000100 != 0</text>
        <text class="sw-sub" x="35" y="184" fill="#fbbf24">Result: Because empty_mask != 0, if neither Lane 0 nor Lane 4 matched, STOP immediately!</text>
        <text class="sw-sub" x="35" y="204">99.2% of non-matching keys NEVER touch the K/V data cache lines at all!</text>
      </svg>

      <div class="mermaid">
flowchart LR
  H["h = hash(key)\nh1 = h >> 7\nh2 = h & 0x7F"] --> Load["Load 16B ctrl[pos..pos+15]\ninto SIMD XMM register"]
  Load --> Match["mask = movemask(cmpeq(ctrl, h2))"]
  Match --> Loop{"mask != 0 ?"}
  Loop -- "Yes (tz = ctz(mask))" --> Cmp{"slots[pos+tz].key\n== key ?"}
  Cmp -- "Hit" --> Ret["Return &slots[pos+tz]"]
  Cmp -- "7-bit Collision" --> Clear["mask &= mask - 1"] --> Loop
  Loop -- "No" --> Emp{"movemask(cmpeq(ctrl, EMPTY))\n!= 0 ?"}
  Emp -- "Yes (Empty seen)" --> Miss["Return NOT_FOUND"]
  Emp -- "No (All 16 full/del)" --> Step["step += 16\npos = (pos + step) & cap_mask"] --> Load
      </div>

      <div class="simulator-mount" data-sim="sim-robin-hood-swisstable"></div>

      <div class="hardware-box">
        <h4>Hardware Reality: Portable 64-Bit SWAR Group Probing &amp; Mirrored Tail Bytes</h4>
        <p>What if an unaligned probe group starts at index $m - 5$ near the end of the capacity-$m$ array? Instead of branching to wrap around the end of the <code>ctrl</code> array, SwissTable allocates <strong>$m + 16$ control bytes</strong> and mirrors the first 16 control bytes <code>ctrl[0..15]</code> at <code>ctrl[m..m+15]</code>! This allows <code>_mm_loadu_si128(&ctrl[pos])</code> to execute an unbranched 16-byte load from <em>any</em> index <code>pos</code> in $[0, m-1]$. On targets without SSE2/NEON, SwissTable falls back to 8-byte <strong>SWAR (SIMD Within A Register)</strong> bit manipulation in a standard <code>uint64_t</code>.</p>
      </div>

      <h2>Production C++20 Implementation: Portable 8-Way SWAR / SSE2 SwissTable Group Matcher</h2>
      <pre><code class="language-cpp">// C++20: SwissTable / hashbrown Control Group Matcher (8-Way SWAR + x86 SSE2)
#include &lt;cstdint&gt;
#include &lt;cstring&gt;
#include &lt;bit&gt;
#if defined(__SSE2__)
#include &lt;emmintrin.h&gt;
#endif

// Portable 8-Byte SWAR Group (Used by hashbrown on 64-bit targets without SIMD)
struct SwarGroup8 {
    uint64_t ctrl; // 8 control bytes: 0x00..0x7F = H2, 0xFF = EMPTY, 0x80 = DELETED

    explicit SwarGroup8(const uint8_t* ptr) noexcept {
        std::memcpy(&amp;ctrl, ptr, sizeof(uint64_t));
    }

    // Returns bitmask with bit (i*8 + 7) set for each byte matching h2 (0..127)
    uint64_t matchByte(uint8_t h2) const noexcept {
        constexpr uint64_t LO_BITS = 0x0101010101010101ULL;
        constexpr uint64_t HI_BITS = 0x8080808080808080ULL;
        uint64_t x = ctrl ^ (LO_BITS * h2);
        return (x - LO_BITS) &amp; ~x &amp; HI_BITS;
    }

    // Returns bitmask with bit (i*8 + 7) set for each EMPTY (0xFF) or DELETED (0x80) byte
    uint64_t matchEmptyOrDeleted() const noexcept {
        return ctrl &amp; 0x8080808080808080ULL;
    }

    static uint32_t trailingMatchedIndex(uint64_t bitmask) noexcept {
        return static_cast&lt;uint32_t&gt;(std::countr_zero(bitmask) &gt;&gt; 3);
    }
};

#if defined(__SSE2__)
struct Sse2Group16 {
    __m128i ctrl;

    explicit Sse2Group16(const uint8_t* ptr) noexcept {
        ctrl = _mm_loadu_si128(reinterpret_cast&lt;const __m128i*&gt;(ptr));
    }

    uint32_t matchH2(uint8_t h2) const noexcept {
        return static_cast&lt;uint32_t&gt;(_mm_movemask_epi8(_mm_cmpeq_epi8(ctrl, _mm_set1_epi8(static_cast&lt;char&gt;(h2)))));
    }

    uint32_t matchEmpty() const noexcept {
        return static_cast&lt;uint32_t&gt;(_mm_movemask_epi8(_mm_cmpeq_epi8(ctrl, _mm_set1_epi8(static_cast&lt;char&gt;(0xFF)))));
    }
};
#endif</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Pointer/Reference Invalidation on <code>flat_hash_map</code> Insert:</strong> Unlike <code>std::unordered_map</code>, where node pointers remain valid across rehashes, <code>absl::flat_hash_map</code> and <code>hashbrown::HashMap</code> store <code>(K, V)</code> inline. Any insertion that triggers a resize invalidates all existing pointers and references! When pointer stability or large value types ($> 64$ bytes) are required, use <code>absl::node_hash_map</code>.</li>
          <li><strong>Poor Low/High Bit Entropy in Custom Hash Functions:</strong> Because SwissTable uses the upper 57 bits (<code>H1</code>) for bucket selection and the lowest 7 bits (<code>H2</code>) for the SIMD control byte, a custom hash function whose lowest 7 bits are constant (e.g., an unmixed aligned pointer <code>reinterpret_cast&lt;uintptr_t&gt;(ptr)</code>) sets <code>H2 = 0</code> for every single key—turning all 16 SIMD lanes into $100\\%$ false positives! Always pass custom hashes through a finalizer mixer.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "SwissTable (absl::flat_hash_map) and Rust hashbrown split a 64-bit hash into a 57-bit H1 probe group index and a 7-bit H2 fingerprint stored in a separate 1-byte control array.",
      "Using SSE2 _mm_cmpeq_epi8 and _mm_movemask_epi8, a single lookup probes 16 control bytes in 1 cycle, sustaining an 87.5% (7/8) max load factor.",
      "Because 7-bit H2 tags collide only 1/128 (0.78%) of the time, 99.2% of non-matching keys never touch the K/V data cache lines during probing.",
      "Mirroring the first 16 control bytes at the end of the control array (ctrl[m..m+15] = ctrl[0..15]) eliminates wrap-around branches during unaligned 16-byte SIMD loads."
    ],
    furtherReading: [
      { title: "Rust hashbrown Documentation — SwissTable Implementation Details", url: "https://docs.rs/hashbrown/latest/hashbrown/" },
      { title: "Abseil C++ Container Documentation — Swiss Tables Design Notes", url: "https://abseil.io/about/design/swisstables" }
    ]
  },

  "build-robin-hood-hash-map": {
    title: "Build Lab: Open-Addressed Robin Hood Hash Table with Tombstone-Free Backward Shift Deletion",
    video: {
      youtubeId: "xIejolxzZS8",
      id: "xIejolxzZS8",
      url: "https://www.youtube.com/embed/xIejolxzZS8",
      title: "Hash Table Open Addressing & Linear Probing Invariants",
      channel: "WilliamFiset",
      duration: "15:04",
      start: 0,
      length: "15m",
      why: "Demonstrates how probe distance tracking and dynamic table resizing combine to provide cache-resident O(1) dictionary operations."
    },
    intuition: "<p>In this Build Lab, we engineer a complete, zero-dependency, production-grade <strong>Open-Addressed Robin Hood Hash Map</strong> in C++20 (<code>RobinHoodMap&lt;K, V&gt;</code>). Unlike naive linear-probing tables that degrade over time as <code>TOMBSTONE</code> markers accumulate from deletions, our engine maintains explicit <strong>Probe Sequence Length (<code>psl</code>)</strong> metadata per slot, enforces the <strong>Robin Hood displacement invariant</strong> on insertion, uses <strong>PSL early-exit</strong> on unsuccessful searches, and executes <strong>Tombstone-Free Backward-Shift Deletion</strong> on <code>erase(key)</code>.</p><p>You can also launch the interactive <a href=\"/build/build-robin-hood-hash-map/\">Robin Hood Hash Map Build Lab</a> in the browser to inspect live PSL histograms and probe telemetry.</p>",
    content: `<div class="lesson-content">
      <h2>Architecture &amp; Invariant Specifications</h2>
      <p>Our implementation guarantees four structural invariants across every <code>insert</code>, <code>find</code>, <code>erase</code>, and <code>rehash</code> operation:</p>
      <ol>
        <li><strong>Power-of-Two Capacity ($m = 2^r$) with SplitMix64 Finalizer:</strong> Every key is mixed through a 64-bit SplitMix64 avalanche permutation so both high and low bits have full entropy, and bucket indexing uses a single bitwise AND <code>idx = hash & (m - 1)</code>.</li>
        <li><strong>1-Based Distance-from-Initial-Bucket (<code>dib</code> = <code>psl + 1</code>):</strong> Instead of storing both a <code>bool occupied</code> flag and a <code>uint32_t psl</code> counter, we store a single integer <code>dib</code> (Distance from Initial Bucket): <code>dib == 0</code> denotes an <code>EMPTY</code> slot, while <code>dib >= 1</code> denotes an occupied slot with $\\text{PSL} = \\text{dib} - 1$.</li>
        <li><strong>Robin Hood Swap Invariant (<code>curr_dib > slot.dib</code>):</strong> During <code>insert</code>, if an occupied slot has the same key, we update its value in-place; otherwise if <code>curr_dib > slot.dib</code>, the incoming entry steals the slot via <code>std::swap</code> and continues probing with the displaced entry.</li>
        <li><strong>Backward-Shift Deletion (<code>erase</code>):</strong> When deleting at <code>idx</code>, we inspect <code>next = (idx + 1) & mask</code>. While <code>table[next].dib > 1</code> (meaning the occupant at <code>next</code> is occupied AND displaced from its home bucket, i.e., $\\text{PSL} > 0$), we shift <code>table[next]</code> backward to <code>table[idx]</code> with <code>dib - 1</code> and advance <code>idx = next</code>. Finally, we clear <code>table[idx].dib = 0</code>.</li>
      </ol>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Engine Method</th>
            <th>Amortized / Expected Time</th>
            <th>Worst-Case Cluster Scan</th>
            <th>Auxiliary Memory</th>
            <th>Tombstone Overhead</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>insert(key, val)</code></td>
            <td><span class="badge-o1">O(1)</span></td>
            <td><span class="badge-ologn">O(log log N)</span> (Random)</td>
            <td><span class="badge-o1">O(1)</span> ($O(N)$ on resize)</td>
            <td>$0$ Tombstones</td>
          </tr>
          <tr>
            <td><code>find(key)</code> (Hit &amp; Miss)</td>
            <td><span class="badge-o1">O(1)</span></td>
            <td>Early-exit when <code>dib > slot.dib</code></td>
            <td><span class="badge-o1">O(1)</span></td>
            <td>$0$ Tombstones</td>
          </tr>
          <tr>
            <td><code>erase(key)</code> (Backward Shift)</td>
            <td><span class="badge-o1">O(1)</span></td>
            <td>Shifts until <code>dib <= 1</code></td>
            <td><span class="badge-o1">O(1)</span></td>
            <td>$0$ Tombstones (Self-healing)</td>
          </tr>
          <tr>
            <td><code>maxPsl()</code> / Telemetry</td>
            <td><span class="badge-on">O(m)</span></td>
            <td>Single linear pass</td>
            <td><span class="badge-o1">O(1)</span></td>
            <td>Tracks variance compression</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Formal Proof: Correctness of Backward-Shift Deletion Without Tombstones</h4>
        <p>Suppose slot $i$ is deleted. Let $C = [i+1, i+2, \\dots, i+L]$ (modulo $m$) be the maximal contiguous run of slots immediately following $i$ whose occupants satisfy $\\text{dib} > 1$ (equivalently $\\text{PSL} \\ge 1$). For every key $k \\in C$, its home bucket $h(k)$ lies at or before $i$ along the cluster, so $k$ originally probed across slot $i$. Shifting every key in $C$ backward by $1$ slot and decrementing its <code>dib</code> by $1$ moves each key $1$ step closer to its home bucket $h(k)$, preserving the Robin Hood ordering invariant $\\text{dib}[j+1] \\le \\text{dib}[j] + 1$ and leaving slot $i + L$ safely <code>EMPTY</code> (<code>dib = 0</code>) because slot $i + L + 1$ either is <code>EMPTY</code> or holds a key at its exact home bucket (<code>dib == 1</code>).</p>
      </div>

      <h2>Visualizing End-to-End Insert, Early-Exit Find &amp; Backward-Shift Erase</h2>
      <svg viewBox="0 0 740 220" width="100%" height="220" role="img" aria-label="Robin Hood Hash Table DIB state transitions during insert and backward-shift delete">
        <defs>
          <style>
            .bl-cell { fill: #0f172a; stroke: #38bdf8; stroke-width: 1.8; rx: 5; }
            .bl-emp { fill: #0f172a; stroke: #334155; stroke-width: 1.5; rx: 5; }
            .bl-shift { fill: #052e16; stroke: #22c55e; stroke-width: 2; rx: 5; }
            .bl-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; text-anchor: middle; }
            .bl-sub { fill: #94a3b8; font-family: monospace; font-size: 10.5px; text-anchor: middle; }
          </style>
        </defs>
        <text x="20" y="24" fill="#cbd5e1" font-family="monospace" font-size="12">Before erase(B at [2]): DIB = PSL + 1 (DIB=0 means EMPTY, DIB=1 means Home Bucket)</text>
        <rect class="bl-cell" x="20" y="36" width="130" height="58"/><text class="bl-txt" x="85" y="60">[1] Key A (h=1)</text><text class="bl-sub" x="85" y="82">DIB=1 (PSL=0)</text>
        <rect class="bl-cell" x="160" y="36" width="130" height="58"/><text class="bl-txt" x="225" y="60" fill="#fca5a5">[2] Key B (h=1)</text><text class="bl-sub" x="225" y="82">DIB=2 (Erase!)</text>
        <rect class="bl-cell" x="300" y="36" width="130" height="58"/><text class="bl-txt" x="365" y="60">[3] Key D (h=1)</text><text class="bl-sub" x="365" y="82">DIB=3 (PSL=2)</text>
        <rect class="bl-cell" x="440" y="36" width="130" height="58"/><text class="bl-txt" x="505" y="60">[4] Key C (h=2)</text><text class="bl-sub" x="505" y="82">DIB=3 (PSL=2)</text>
        <rect class="bl-cell" x="580" y="36" width="130" height="58"/><text class="bl-txt" x="645" y="60">[5] Key E (h=5)</text><text class="bl-sub" x="645" y="82">DIB=1 (Home!)</text>

        <text x="20" y="126" fill="#4ade80" font-family="monospace" font-size="12">After erase(B): [3]→[2] (DIB 3→2), [4]→[3] (DIB 3→2), STOP at [5] (DIB==1), clear [4]!</text>
        <rect class="bl-cell" x="20" y="138" width="130" height="58"/><text class="bl-txt" x="85" y="162">[1] Key A (h=1)</text><text class="bl-sub" x="85" y="184">DIB=1 (PSL=0)</text>
        <rect class="bl-shift" x="160" y="138" width="130" height="58"/><text class="bl-txt" x="225" y="162" fill="#4ade80">[2] Key D (h=1)</text><text class="bl-sub" x="225" y="184" fill="#86efac">DIB=2 (PSL=1)</text>
        <rect class="bl-shift" x="300" y="138" width="130" height="58"/><text class="bl-txt" x="365" y="162" fill="#4ade80">[3] Key C (h=2)</text><text class="bl-sub" x="365" y="184" fill="#86efac">DIB=2 (PSL=1)</text>
        <rect class="bl-emp" x="440" y="138" width="130" height="58"/><text class="bl-txt" x="505" y="162">[4] EMPTY</text><text class="bl-sub" x="505" y="184">DIB=0</text>
        <rect class="bl-cell" x="580" y="138" width="130" height="58"/><text class="bl-txt" x="645" y="162">[5] Key E (h=5)</text><text class="bl-sub" x="645" y="184">DIB=1 (Unmoved)</text>
      </svg>

      <div class="mermaid">
flowchart TD
  Find["find(key): idx = h(key) & mask, dib = 1"] --> Check{"table[idx].dib < dib ?"}
  Check -- "Yes (0 or Richer Occupant)" --> Miss["Early-Exit: Return std::nullopt"]
  Check -- "No" --> Eq{"table[idx].hash == h\nAND table[idx].key == key ?"}
  Eq -- "Yes" --> Hit["Return table[idx].val"]
  Eq -- "No" --> Step["idx = (idx + 1) & mask\n++dib"] --> Check
      </div>

      <div class="simulator-mount" data-sim="sim-robin-hood-swisstable"></div>

      <div class="hardware-box">
        <h4>Hardware Reality: Cached Hash Comparison Before Full Key Equality</h4>
        <p>When keys are strings (<code>std::string</code>) or composite structs, calling <code>slot.key == key</code> dereferences a heap pointer and runs <code>memcmp</code>. By caching the 32-bit or 64-bit hash inside the slot (or comparing <code>slot.dib == dib</code> first, since two keys at the same slot index <code>idx</code> have the exact same home bucket $(idx - (\\text{dib}-1)) \\bmod m$ <em>if and only if</em> their <code>dib</code> values are equal!), we reject $> 99\\%$ of non-matching slots in registers without ever touching the string heap buffer.</p>
      </div>

      <h2>Complete Reference Implementation: <code>RobinHoodMap&lt;K, V&gt;</code> in C++20</h2>
      <pre><code class="language-cpp">// C++20: Complete Open-Addressed Robin Hood Hash Table with Tombstone-Free Backward Shift
#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;optional&gt;
#include &lt;utility&gt;
#include &lt;algorithm&gt;

template &lt;typename K, typename V&gt;
class RobinHoodMap {
    struct Slot {
        K key{};
        V val{};
        uint32_t dib = 0; // 0 = EMPTY, >= 1 means PSL = dib - 1
    };

    std::vector&lt;Slot&gt; table_;
    size_t size_ = 0;

    static uint64_t hashKey(const K&amp; k) noexcept {
        uint64_t x = static_cast&lt;uint64_t&gt;(std::hash&lt;K&gt;{}(k));
        x = (x ^ (x &gt;&gt; 30)) * 0xbf58476d1ce4e5b9ULL;
        x = (x ^ (x &gt;&gt; 27)) * 0x94d049bb133111ebULL;
        return x ^ (x &gt;&gt; 31);
    }

    void rehash(size_t newCap) {
        std::vector&lt;Slot&gt; old = std::move(table_);
        table_.assign(newCap, Slot{});
        size_ = 0;
        for (auto&amp; s : old) {
            if (s.dib &gt; 0) insert(std::move(s.key), std::move(s.val));
        }
    }

public:
    explicit RobinHoodMap(size_t initialPow2Cap = 16) : table_(initialPow2Cap) {}

    size_t size() const noexcept { return size_; }

    bool insert(K key, V val) {
        // Resize at 85% load factor (17/20)
        if ((size_ + 1) * 20 &gt;= table_.size() * 17) {
            rehash(table_.size() * 2);
        }
        const size_t mask = table_.size() - 1;
        size_t idx = hashKey(key) &amp; mask;
        uint32_t curDib = 1;

        while (true) {
            Slot&amp; s = table_[idx];
            if (s.dib == 0) {
                s.key = std::move(key);
                s.val = std::move(val);
                s.dib = curDib;
                ++size_;
                return true;
            }
            if (s.dib == curDib &amp;&amp; s.key == key) {
                s.val = std::move(val); // Update existing key in-place
                return false;
            }
            // Robin Hood Rule: steal slot if incoming key has larger DIB than occupant
            if (curDib &gt; s.dib) {
                std::swap(key, s.key);
                std::swap(val, s.val);
                std::swap(curDib, s.dib);
            }
            idx = (idx + 1) &amp; mask;
            ++curDib;
        }
    }

    std::optional&lt;V&gt; find(const K&amp; key) const {
        const size_t mask = table_.size() - 1;
        size_t idx = hashKey(key) &amp; mask;
        uint32_t curDib = 1;

        while (true) {
            const Slot&amp; s = table_[idx];
            // Early-exit invariant: if slot is empty OR occupant is richer, key cannot exist
            if (s.dib &lt; curDib) return std::nullopt;
            if (s.dib == curDib &amp;&amp; s.key == key) return s.val;
            idx = (idx + 1) &amp; mask;
            ++curDib;
        }
    }

    bool erase(const K&amp; key) {
        const size_t mask = table_.size() - 1;
        size_t idx = hashKey(key) &amp; mask;
        uint32_t curDib = 1;

        while (true) {
            Slot&amp; s = table_[idx];
            if (s.dib &lt; curDib) return false; // Key not found
            if (s.dib == curDib &amp;&amp; s.key == key) break; // Located target at idx
            idx = (idx + 1) &amp; mask;
            ++curDib;
        }

        // Tombstone-free backward shift deletion
        size_t next = (idx + 1) &amp; mask;
        while (table_[next].dib &gt; 1) {
            table_[idx] = std::move(table_[next]);
            --table_[idx].dib;
            idx = next;
            next = (next + 1) &amp; mask;
        }
        table_[idx] = Slot{};
        --size_;
        return true;
    }

    uint32_t maxPsl() const noexcept {
        uint32_t maxD = 1;
        for (const auto&amp; s : table_) maxD = std::max(maxD, s.dib);
        return maxD - 1;
    }
};</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Checking <code>s.key == key</code> After Swapping Before Checking Duplicate Key:</strong> Notice that when <code>s.dib == curDib</code>, both keys share the exact same home bucket (<code>idx - (curDib - 1)</code>). If <code>s.dib < curDib</code>, the incoming key could <em>never</em> be a duplicate of <code>s.key</code> (nor of any key later in the cluster, since later keys have strictly larger home buckets). Thus checking <code>if (s.dib == curDib && s.key == key)</code> before the <code>if (curDib > s.dib)</code> swap guarantees no duplicate key is ever inserted!</li>
          <li><strong>Using Unmixed Identity Hashes with Power-of-Two Masking:</strong> Always pass <code>std::hash&lt;K&gt;</code> through a 64-bit finalizer (SplitMix64) so lower bits used by <code>& (m - 1)</code> reflect all 64 bits of the key.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "Encoding DIB = PSL + 1 (with DIB = 0 for empty slots) unifies occupancy and probe distance in a single integer field.",
      "Two entries at index idx share the same home bucket if and only if their DIB values are equal, enabling a zero-cost integer pre-check (s.dib == curDib) before full key comparison.",
      "Early-exit lookup stops immediately whenever s.dib < curDib, bounding unsuccessful search probes tightly around the mean.",
      "Backward-shift deletion shifts subsequent entries with DIB > 1 left by one slot and decrements their DIB, maintaining 0 tombstones across infinite insert/delete churn."
    ],
    furtherReading: [
      { title: "Celis, Larson & Munro (1985): Robin Hood Hashing (University of Waterloo TR CS-86-14)", url: "https://cs.uwaterloo.ca/research/tr/1986/CS-86-14.pdf" },
      { title: "Pat Morin, Open Data Structures — Chapter 5: Hash Tables", url: "https://opendatastructures.org/" }
    ]
  }
};
