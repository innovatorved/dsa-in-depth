window.MODULE_CONTENT = window.MODULE_CONTENT || {};
window.MODULE_CONTENT["m10"] = {
  "tries-radix-trees-patricia": {
    title: "Prefix Tries, Compressed Radix Trees & PATRICIA Trees",
    video: {
      youtubeId: "zIjfhVPRZCg",
      title: "Tries, Radix Trees & Adaptive Radix Trees (ART) Explained",
      channel: "Hussein Nasser",
      duration: "16:28",
      start: 0,
      length: 988,
      why: "Explains how prefix sharing works in standard Tries and why path-compressed Radix Trees and Adaptive Radix Trees (ART) dominate production databases and routers."
    },
    intuition: `<p>A balanced binary search tree comparing string keys of length $L$ across $N$ entries requires $O(L \\log N)$ character comparisons because each of the $O(\\log N)$ node visits re-scans shared prefixes. A <strong>Prefix Trie</strong> (named by Edward Fredkin from Info<em>trie</em>val) eliminates key-to-key comparisons entirely: edges are labeled by alphabet symbols $\\Sigma$, so looking up a string of length $L$ walks a path of length $L$ in <strong>$O(L)$ time independent of $N$</strong>, while automatically clustering all keys that share a common prefix into a single subtree.</p>
    <p>However, a naive pointer-per-character Trie has two fatal flaws in production: (1) a long unique suffix of length $L$ creates $L$ unary (single-child) nodes, and (2) an alphabet of size $|\\Sigma| = 256$ wastes $256 \\times 8 = 2\\text{ KB}$ per node even when only 1 child pointer is non-null. <strong>Compressed Radix Trees</strong> coalesce every chain of single-child nodes into a single edge labeled with a substring slice; Donald Morrison's <strong>PATRICIA Tree</strong> stores only the <em>index of the first differing bit/byte</em> at each internal node, bounding internal nodes to <strong>exact $N - 1$</strong> regardless of key length $L$; and Viktor Leis's <strong>Adaptive Radix Tree (ART)</strong> dynamically resizes node fanout across 4 compact classes (<code>Node4</code>, <code>Node16</code>, <code>Node48</code>, <code>Node256</code>) to match L1 cache lines and SIMD registers.</p>`,
    content: `<div class="lesson-content">
      <h3>1. From Uncompressed Tries to Compressed Radix Trees &amp; PATRICIA</h3>
      <p>Let $\\mathcal{S} = \\{s_1, s_2, \\dots, s_N\\}$ be a set of $N$ distinct strings of total length $M = \\sum |s_i|$. Compare the three structural representations:</p>
      <ul>
        <li><strong>Uncompressed Trie:</strong> Up to $M + 1$ nodes. Every character transition is an explicit node. Long unique keys create deep chains of degree-1 nodes that cause $L$ sequential L3/DRAM cache misses.</li>
        <li><strong>Compressed Radix Tree (Compact Prefix Tree):</strong> Every internal node must have branching degree $\\ge 2$ (unless it marks the end of a key). Any unary chain is collapsed into a single edge storing a string slice $(k, \\text{offset}, \\text{len})$. Because every internal node branches at least two ways, a Radix Tree over $N$ keys has <strong>at most $2N$ nodes</strong> ($N$ leaves and $\\le N - 1$ branching nodes)!</li>
        <li><strong>PATRICIA Tree (Practical Algorithm To Retrieve Information Coded In Alphanumeric):</strong> Stores keys only at the leaves; each internal node stores only the critical bit/byte position $d$ where its subtrees diverge. During <code>search(q)</code>, the traversal skips intermediary bytes completely and only inspects <code>q[d]</code> at each internal node, performing a <strong>single full key comparison at the reached leaf</strong> to verify whether the skipped prefix segments actually match!</li>
      </ul>

      <div class="invariant-box">
        <strong>Radix / PATRICIA Node-Count Invariant:</strong> In a compressed Radix or PATRICIA tree storing $N \\ge 2$ prefix-free keys (or keys terminated with a unique <code>$</code> sentinel), every internal node has at least $2$ children. By induction on full trees, the total number of internal nodes is <strong>at most $N - 1$</strong> and total edges at most $2N - 2$—completely independent of string length $L$!
      </div>

      <svg viewBox="0 0 760 235" class="lesson-svg" role="img" aria-label="Comparison of Uncompressed Trie, Compressed Radix Tree, and Adaptive Radix Tree Node Classes">
        <style>
          .tr-bg { fill: #0f172a; rx: 10px; }
          .tr-node { fill: #1e293b; stroke: #38bdf8; stroke-width: 2px; rx: 6px; }
          .tr-rad { fill: rgba(52, 211, 153, 0.2); stroke: #34d399; stroke-width: 2px; rx: 6px; }
          .tr-art { fill: rgba(244, 114, 182, 0.18); stroke: #f472b6; stroke-width: 2px; rx: 6px; }
          .tr-edge { stroke: #94a3b8; stroke-width: 1.8px; }
          .tr-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .tr-sub { fill: #94a3b8; font-family: sans-serif; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="235" class="tr-bg"/>
        <!-- Panel 1: Uncompressed Trie -->
        <text x="20" y="25" class="tr-txt" fill="#38bdf8">1. Uncompressed Trie</text>
        <text x="20" y="42" class="tr-sub">Keys: "romane", "romanus"</text>
        <circle cx="95" cy="62" r="10" class="tr-node"/>
        <line x1="95" y1="72" x2="95" y2="95" class="tr-edge"/><text x="105" y="88" class="tr-txt">"r..m..a..n"</text>
        <circle cx="95" cy="105" r="10" class="tr-node"/>
        <line x1="95" y1="115" x2="55" y2="155" class="tr-edge"/><text x="52" y="138" class="tr-txt">e</text>
        <line x1="95" y1="115" x2="135" y2="155" class="tr-edge"/><text x="125" y="138" class="tr-txt">u</text>
        <circle cx="55" cy="165" r="10" class="tr-node"/>
        <circle cx="135" cy="165" r="10" class="tr-node"/>
        <line x1="135" y1="175" x2="135" y2="200" class="tr-edge"/><text x="145" y="192" class="tr-txt">s</text>
        <circle cx="135" cy="210" r="10" class="tr-node"/>

        <!-- Panel 2: Compressed Radix Tree -->
        <text x="245" y="25" class="tr-txt" fill="#34d399">2. Compressed Radix Tree</text>
        <text x="245" y="42" class="tr-sub">Unary chain collapsed to 1 edge</text>
        <rect x="295" y="55" width="70" height="26" class="tr-rad"/>
        <text x="330" y="72" text-anchor="middle" class="tr-txt">root</text>
        <line x1="330" y1="81" x2="330" y2="120" class="tr-edge"/>
        <text x="372" y="105" class="tr-txt" fill="#facc15">"roman"</text>
        <rect x="295" y="120" width="70" height="26" class="tr-rad"/>
        <text x="330" y="137" text-anchor="middle" class="tr-txt">branch</text>
        <line x1="315" y1="146" x2="275" y2="185" class="tr-edge"/><text x="270" y="168" class="tr-txt">"e"</text>
        <line x1="345" y1="146" x2="385" y2="185" class="tr-edge"/><text x="385" y="168" class="tr-txt">"us"</text>
        <rect x="245" y="185" width="60" height="26" class="tr-rad"/><text x="275" y="202" text-anchor="middle" class="tr-txt">leaf 1</text>
        <rect x="355" y="185" width="60" height="26" class="tr-rad"/><text x="385" y="202" text-anchor="middle" class="tr-txt">leaf 2</text>

        <!-- Panel 3: Adaptive Radix Tree (ART) -->
        <text x="485" y="25" class="tr-txt" fill="#f472b6">3. Adaptive Radix Tree (ART) Nodes</text>
        <rect x="485" y="45" width="250" height="36" class="tr-art"/>
        <text x="498" y="67" class="tr-txt">Node4:   4 keys + 4 ptrs (sorted)</text>
        <rect x="485" y="89" width="250" height="36" class="tr-art"/>
        <text x="498" y="111" class="tr-txt">Node16:  16 keys (SIMD _mm_cmpeq)</text>
        <rect x="485" y="133" width="250" height="36" class="tr-art"/>
        <text x="498" y="155" class="tr-txt">Node48:  256B idx[byte] -&gt; 48 ptrs</text>
        <rect x="485" y="177" width="250" height="36" class="tr-art"/>
        <text x="498" y="199" class="tr-txt">Node256: Direct ptr[256] array</text>
      </svg>

      <div class="mermaid">
flowchart LR
  N4["Node4\n(1..4 children)"] <-->|"Grow > 4 / Shrink < 4"| N16["Node16\n(5..16 children, SIMD)"]
  N16 <-->|"Grow > 16 / Shrink < 13"| N48["Node48\n(17..48 children, 256B LUT)"]
  N48 <-->|"Grow > 48 / Shrink < 37"| N256["Node256\n(49..256 children, Direct)"]
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Adaptive Radix Tree (ART) in Modern In-Memory Databases (DuckDB, HyPer, Umbra):</strong> Why does ART beat both Hash Tables (on range scans) and B+ Trees (on point lookups)? Instead of allocating a 256-pointer array at every byte level, ART dynamically selects:
        <ul>
          <li><code>Node4</code> (1–4 children): 4 byte keys + 4 child pointers (fits in a single 64-byte L1 cache line).</li>
          <li><code>Node16</code> (5–16 children): 16 byte keys packed into a single 128-bit SSE register; <code>findChild(byte)</code> broadcasts <code>byte</code> via <code>_mm_set1_epi8</code> and finds the matching lane in 1 clock cycle via <code>_mm_cmpeq_epi8</code> + <code>_mm_movemask_epi8</code> + <code>ctz</code>!</li>
          <li><code>Node48</code> (17–48 children): A 256-byte direct byte-to-slot index table pointing into a 48-element pointer array (saving 80% of the pointer space of <code>Node256</code> while keeping $O(1)$ lookup).</li>
          <li><code>Node256</code> (49–256 children): Direct 256-pointer array for dense nodes near the root.</li>
        </ul>
      </div>

      <div class="simulator-mount" data-sim="sim-trie-radix-bitwise"></div>

      <h3>2. Production Implementation: Compressed Radix Tree (Insert, Exact Lookup &amp; Prefix Enumeration)</h3>
      <pre><code class="language-javascript">class RadixNode {
  constructor(edgeLabel = "", value = undefined) {
    this.edgeLabel = edgeLabel;
    this.value = value; // !== undefined if a key terminates at this node
    this.children = new Map(); // firstChar -&gt; RadixNode
  }
}

/**
 * Compressed Radix Tree (Compact Prefix Tree)
 * Guarantees at most 2N nodes regardless of string length L.
 */
class RadixTree {
  constructor() {
    this.root = new RadixNode("");
    this.size = 0;
  }

  _lcpLength(a, b) {
    const len = Math.min(a.length, b.length);
    let i = 0;
    while (i &lt; len &amp;&amp; a.charCodeAt(i) === b.charCodeAt(i)) i++;
    return i;
  }

  insert(key, value = true) {
    let curr = this.root;
    let i = 0;
    while (i &lt; key.length) {
      const ch = key[i];
      const child = curr.children.get(ch);
      if (!child) {
        curr.children.set(ch, new RadixNode(key.slice(i), value));
        this.size++;
        return;
      }
      const rem = key.slice(i);
      const lcp = this._lcpLength(rem, child.edgeLabel);
      if (lcp === child.edgeLabel.length) {
        // Consumed entire child edge; continue descending
        curr = child;
        i += lcp;
      } else {
        // Split child edge at index <code>lcp</code>
        const splitNode = new RadixNode(child.edgeLabel.slice(0, lcp));
        curr.children.set(ch, splitNode);

        child.edgeLabel = child.edgeLabel.slice(lcp);
        splitNode.children.set(child.edgeLabel[0], child);

        if (lcp === rem.length) {
          splitNode.value = value;
        } else {
          const newLeaf = new RadixNode(rem.slice(lcp), value);
          splitNode.children.set(newLeaf.edgeLabel[0], newLeaf);
        }
        this.size++;
        return;
      }
    }
    if (curr.value === undefined) this.size++;
    curr.value = value;
  }

  get(key) {
    let curr = this.root;
    let i = 0;
    while (i &lt; key.length) {
      const child = curr.children.get(key[i]);
      if (!child) return undefined;
      const label = child.edgeLabel;
      if (key.length - i &lt; label.length) return undefined;
      for (let j = 0; j &lt; label.length; j++) {
        if (key.charCodeAt(i + j) !== label.charCodeAt(j)) return undefined;
      }
      curr = child;
      i += label.length;
    }
    return curr.value;
  }

  keysWithPrefix(prefix) {
    let curr = this.root;
    let i = 0;
    let accumulated = "";
    while (i &lt; prefix.length) {
      const child = curr.children.get(prefix[i]);
      if (!child) return [];
      const rem = prefix.slice(i);
      const lcp = this._lcpLength(rem, child.edgeLabel);
      if (lcp &lt; rem.length &amp;&amp; lcp &lt; child.edgeLabel.length) return [];
      accumulated += child.edgeLabel;
      curr = child;
      i += lcp;
    }
    const results = [];
    const dfs = (node, path) =&gt; {
      if (node.value !== undefined) results.push(path);
      for (const child of node.children.values()) {
        dfs(child, path + child.edgeLabel);
      }
    };
    dfs(curr, accumulated);
    return results;
  }
}</code></pre>

      <h3>3. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Structure</th>
            <th>Worst-Case Node Count ($N$ keys, length $L$)</th>
            <th>Exact Lookup Time</th>
            <th>Prefix Search (<code>startsWith(P)</code>)</th>
            <th>Space Overhead per Node</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Uncompressed Array Trie ($|\\Sigma| = 256$)</td>
            <td>$O(N \\cdot L)$ nodes</td>
            <td>$\\Theta(L)$</td>
            <td>$\\Theta(|P| + K)$</td>
            <td>$256$ pointers ($2\\text{ KB}$)</td>
          </tr>
          <tr>
            <td>Compressed Radix Tree / PATRICIA</td>
            <td>$\\le 2N$ nodes (exact $N-1$ internal)</td>
            <td>$O(L)$</td>
            <td>$O(|P| + K)$</td>
            <td>Edge slice + compact map</td>
          </tr>
          <tr>
            <td>Adaptive Radix Tree (ART)</td>
            <td>$O(N)$ adaptive internal nodes</td>
            <td>$O(L)$ (SIMD accelerated)</td>
            <td>$O(|P| + K)$</td>
            <td>$~8\\text{–}16$ bytes per child</td>
          </tr>
          <tr>
            <td>Balanced BST (<code>std::map&lt;string&gt;</code>)</td>
            <td>$N$ nodes</td>
            <td>$O(L \\log N)$</td>
            <td>$O(L \\log N + K)$</td>
            <td>$3$ pointers + color</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Skipping One-Way Edge Verification in PATRICIA Lookups:</strong> In a PATRICIA tree (or an ART using optimistic path compression where only the edge length <code>prefixLen</code> is stored instead of the full substring), internal nodes skip non-branching bytes and only branch on critical differing bytes. If you return <code>true</code> upon reaching a leaf without comparing the full search key <code>q</code> against the leaf's stored key, any query string that matches at the critical branch bytes but differs at the skipped positions will produce a <strong>false positive match</strong>! Always perform one full key comparison at the reached leaf.
      </div>
    </div>`,
    keyTakeaways: [
      "Uncompressed Tries achieve O(L) lookup independent of N, but suffer O(N * L) worst-case node count on long unique strings and high pointer overhead on large alphabets.",
      "Compressed Radix Trees collapse unary paths into single edges labeled with substring slices, bounding total nodes to at most 2N (<= N - 1 internal branching nodes).",
      "PATRICIA trees store only the critical bit/byte offset at internal nodes and perform a single full-key verification at the leaf.",
      "Adaptive Radix Trees (ART) dynamically transition nodes between Node4, Node16 (SIMD), Node48 (256B LUT), and Node256 to combine trie speed with B-tree cache density."
    ],
    furtherReading: [
      {
        title: "Leis, Kemper, & Neumann (2013) — The Adaptive Radix Tree: ARTful Indexing for Main-Memory Databases (ICDE)",
        url: "https://db.in.tum.de/~leis/papers/ART.pdf"
      },
      {
        title: "Morrison (1968) — PATRICIA: Practical Algorithm To Retrieve Information Coded in Alphanumeric (JACM)",
        url: "https://doi.org/10.1145/321479.321481"
      }
    ]
  },

  "bitwise-tries-max-xor": {
    title: "Bitwise (0-1) Tries: Maximum XOR Subarray & Subtree Queries",
    video: {
      youtubeId: "y4K6n6w8kG0",
      title: "Bitwise Trie (0-1 Binary Trie) — Maximum XOR Pair & Subarray",
      channel: "take U forward",
      duration: "18:40",
      start: 0,
      length: 1120,
      why: "Shows how inserting fixed-width integers from MSB to LSB into a binary trie turns maximum XOR queries into a greedy O(W) bit-flip walk."
    },
    intuition: `<p>When keys are fixed-width $W$-bit integers (e.g., $W = 30$ or $64$), viewing each integer as a binary string from <strong>Most Significant Bit (MSB, bit $W-1$) down to Least Significant Bit (LSB, bit $0$)</strong> turns a Prefix Trie into a <strong>Bitwise (0-1) Trie</strong> of fixed depth $W$. Because $2^{k} > \\sum_{j=0}^{k-1} 2^{j}$, gaining a $1$ at bit position $k$ is strictly more valuable than gaining $1$s at <em>all lower bit positions combined</em>!</p>
    <p>This greedy dominance makes Bitwise Tries the natural engine for XOR problems: to maximize $x \\oplus y$ for a query $x$ over a set $S$, walk down the trie from bit $W-1$ to $0$, and at each bit $b = (x \\gg i) \\mathrel{\\&} 1$, greedily take the <strong>opposite child $b \\oplus 1$</strong> if it exists (setting bit $i$ of the XOR result to $1$), or fall back to child $b$ otherwise. Combining this $O(W)$ query with the prefix-XOR identity $\\text{XOR}(L..R) = P[R] \\oplus P[L-1]$ solves Maximum XOR Subarray in $O(N \\cdot W)$ time; adding a <code> + "</code>cnt<code>" + </code> field supports dynamic deletions; and storing the maximum insertion index <code> + "</code>maxIdx[u]<code>" + </code> at each trie node answers offline subarray XOR queries $[L, R]$ without even needing persistence!</p>`,
    content: `<div class="lesson-content">
      <h3>1. MSB-to-LSB Greedy Dominance &amp; Dynamic Deletion via <code>cnt[u]</code></h3>
      <p>Why must a Bitwise Trie for XOR maximization or order-statistic comparison be rooted at the <strong>Most Significant Bit ($W - 1$)</strong> rather than bit $0$? Because binary value order is lexicographical from MSB to LSB: every number in the <code>1</code>-branch at depth $k$ is strictly greater than every number in the <code>0</code>-branch, since $2^k > 2^k - 1 = \\sum_{j=0}^{k-1} 2^j$.</p>
      <p>To support dynamic <code>insert(x)</code> and <code>remove(x)</code> (such as sliding-window XOR or multiset queries), we store an integer counter <code>cnt[u]</code> at every trie node recording how many active numbers pass through node $u$. Instead of physically freeing nodes on <code>remove(x)</code>, we simply decrement <code>cnt[u]--</code> along $x$'s path, and treat any child $c$ with <code>c === 0 || cnt[c] === 0</code> as empty!</p>

      <div class="invariant-box">
        <strong>Three Canonical Bitwise Trie Augmentations:</strong>
        <ol>
          <li><strong>Maximum XOR Subarray / Tree Path:</strong> Since $\\bigoplus_{k=L}^{R} A[k] = P[R] \\oplus P[L-1]$ where $P[i] = P[i-1] \\oplus A[i]$ (with $P[0] = 0$), insert $P[0]$ first, then for each $R = 1 \\dots N$, query <code>maxXor(P[R])</code> and insert $P[R]$. (On a tree, replace $P[i]$ with the root-to-node path XOR!)</li>
          <li><strong>Count of $y \\in S$ with $(x \\oplus y) < K$:</strong> At bit $i$, let $b_x = (x \\gg i) \\mathrel{\\&} 1$ and $b_k = (K \\gg i) \\mathrel{\\&} 1$. If $b_k = 1$, then any $y$ in child $b_x$ produces $0 < 1$ at bit $i$ and is <em>guaranteed</em> $< K$, so we add <code>cnt[child[u][b_x]]</code> in $O(1)$ and continue down child $b_x \\oplus 1$ (where bit $i$ of $x \\oplus y$ equals $1 = b_k$). If $b_k = 0$, we are forced to descend into child $b_x$.</li>
          <li><strong>Range XOR Query $\\max_{L \\le i \\le R} (x \\oplus A[i])$ via <code>maxIdx[u]</code>:</strong> Insert $A[0], \\dots, A[R]$ in order, updating <code>maxIdx[u] = i</code> along each path. A branch $c$ contains at least one element from $[L, R]$ if and only if <code>maxIdx[c] >= L</code>!</li>
        </ol>
      </div>

      <svg viewBox="0 0 760 235" class="lesson-svg" role="img" aria-label="Bitwise 0-1 Trie Greedy Opposite-Bit Walk and Count XOR Less Than K">
        <style>
          .bt-bg { fill: #0f172a; rx: 10px; }
          .bt-node { fill: #1e293b; stroke: #475569; stroke-width: 2px; }
          .bt-active { fill: rgba(56, 189, 248, 0.28); stroke: #38bdf8; stroke-width: 2.5px; }
          .bt-add { fill: rgba(52, 211, 153, 0.25); stroke: #34d399; stroke-width: 2.5px; }
          .bt-edge { stroke: #64748b; stroke-width: 1.8px; }
          .bt-path { stroke: #38bdf8; stroke-width: 3px; }
          .bt-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .bt-sub { fill: #94a3b8; font-family: sans-serif; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="235" class="bt-bg"/>
        <!-- Left Panel: Max XOR Greedy Path -->
        <text x="24" y="25" class="bt-txt" fill="#38bdf8">1. maxXor(x = 010₂ = 2) on S = {1(001), 5(101), 6(110)}</text>
        <line x1="175" y1="52" x2="105" y2="95" class="bt-edge"/><text x="125" y="72" class="bt-txt">0</text>
        <line x1="175" y1="52" x2="245" y2="95" class="bt-path"/><text x="220" y="72" class="bt-txt" fill="#38bdf8">1 (flip!)</text>
        <line x1="245" y1="95" x2="205" y2="145" class="bt-path"/><text x="200" y="122" class="bt-txt" fill="#38bdf8">0 (flip!)</text>
        <line x1="245" y1="95" x2="285" y2="145" class="bt-edge"/><text x="275" y="122" class="bt-txt">1</text>
        <line x1="205" y1="145" x2="225" y2="195" class="bt-path"/><text x="225" y="175" class="bt-txt" fill="#38bdf8">1 (flip!)</text>

        <circle cx="175" cy="52" r="13" class="bt-active"/><text x="175" y="56" text-anchor="middle" class="bt-txt">R</text>
        <circle cx="105" cy="95" r="13" class="bt-node"/>
        <circle cx="245" cy="95" r="13" class="bt-active"/>
        <circle cx="205" cy="145" r="13" class="bt-active"/>
        <circle cx="285" cy="145" r="13" class="bt-node"/>
        <circle cx="225" cy="195" r="14" class="bt-active"/><text x="225" y="199" text-anchor="middle" class="bt-txt">5</text>
        <text x="175" y="222" text-anchor="middle" class="bt-sub" fill="#facc15">Picks y = 101₂ (5) -&gt; 010 ^ 101 = 111₂ = 7</text>

        <!-- Right Panel: Count (x ^ y) < K -->
        <text x="415" y="25" class="bt-txt" fill="#34d399">2. countXorLess(x, K): At bit i where K_i = 1</text>
        <circle cx="560" cy="62" r="15" class="bt-active"/><text x="560" y="66" text-anchor="middle" class="bt-txt">u</text>
        <line x1="560" y1="77" x2="485" y2="135" class="bt-edge" stroke="#34d399"/>
        <line x1="560" y1="77" x2="635" y2="135" class="bt-path"/>
        <rect x="425" y="135" width="120" height="52" rx="6" class="bt-add"/>
        <text x="485" y="156" text-anchor="middle" class="bt-txt">child[b_x]</text>
        <text x="485" y="174" text-anchor="middle" class="bt-sub">(x^y)_i = 0 &lt; K_i</text>
        <rect x="575" y="135" width="120" height="52" rx="6" class="bt-active"/>
        <text x="635" y="156" text-anchor="middle" class="bt-txt">child[b_x ^ 1]</text>
        <text x="635" y="174" text-anchor="middle" class="bt-sub">(x^y)_i = 1 == K_i</text>
        <text x="560" y="215" text-anchor="middle" class="bt-sub" fill="#facc15">ans += cnt[child[b_x]] in O(1); descend into child[b_x ^ 1]</text>
      </svg>

      <div class="mermaid">
flowchart TD
  Step["At bit i (from W-1 down to 0):\nbx = (x >> i) & 1, bk = (K >> i) & 1"] --> Check{"bk == 1?"}
  Check -- Yes --> Add["ans += cnt[ch[u][bx]] (all have bit i = 0 < 1)\nu = ch[u][bx ^ 1] (continue where bit i == 1)"]
  Check -- No --> Force["u = ch[u][bx] (must match bit i == 0)"]
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Flat TypedArray Pool for 0-1 Tries:</strong> In a 30-bit Binary Trie with $N = 10^5$ integers, at most $30 N + 2 \\approx 3 \\times 10^6$ nodes are created. Instead of allocating JS objects with <code>{ left, right, cnt }</code>, allocate a single <code>Int32Array(2 * maxNodes)</code> for transitions (<code>ch[(u &lt;&lt; 1) | bit]</code>) and <code>Int32Array(maxNodes)</code> for <code>cnt[u]</code>. Because <code>(u &lt;&lt; 1) | 0</code> and <code>(u &lt;&lt; 1) | 1</code> sit in adjacent 4-byte words in the same 64-byte cache line, testing <code>ch[(u &lt;&lt; 1) | (b ^ 1)]</code> and falling back to <code>ch[(u &lt;&lt; 1) | b]</code> never incurs a second cache miss!
      </div>

      <div class="simulator-mount" data-sim="sim-trie-radix-bitwise"></div>

      <h3>2. Production Implementation: Flat-Pool Bitwise Trie (<code>insert</code>, <code>remove</code>, <code>maxXor</code>, <code>countXorLess</code>, <code>maxSubarrayXor</code>)</h3>
      <pre><code class="language-javascript">/**
 * High-Performance 30-Bit Binary Trie using a Flat TypedArray Pool
 * Supports dynamic insert, remove, maxXor(x), and countXorLess(x, K) in O(W) time.
 */
class BitwiseTrie {
  constructor(maxInsertions = 100005, bitWidth = 30) {
    this.W = bitWidth;
    const maxNodes = maxInsertions * this.W + 2;
    this.ch = new Int32Array(maxNodes * 2); // ch[(u &lt;&lt; 1) | bit]
    this.cnt = new Int32Array(maxNodes);
    this.ptr = 1; // Node 1 is root; Node 0 is null sentinel
  }

  insert(x, delta = 1) {
    let u = 1;
    this.cnt[u] += delta;
    for (let i = this.W - 1; i &gt;= 0; i--) {
      const b = (x &gt;&gt;&gt; i) &amp; 1;
      const edgeIdx = (u &lt;&lt; 1) | b;
      let next = this.ch[edgeIdx];
      if (next === 0) {
        next = ++this.ptr;
        this.ch[edgeIdx] = next;
      }
      u = next;
      this.cnt[u] += delta;
    }
  }

  remove(x) {
    this.insert(x, -1);
  }

  maxXor(x) {
    let u = 1;
    if (this.cnt[u] === 0) return 0;
    let ans = 0;
    for (let i = this.W - 1; i &gt;= 0; i--) {
      const b = (x &gt;&gt;&gt; i) &amp; 1;
      const want = b ^ 1;
      const desiredChild = this.ch[(u &lt;&lt; 1) | want];
      if (desiredChild !== 0 &amp;&amp; this.cnt[desiredChild] &gt; 0) {
        ans |= (1 &lt;&lt; i);
        u = desiredChild;
      } else {
        u = this.ch[(u &lt;&lt; 1) | b];
      }
    }
    return ans &gt;&gt;&gt; 0;
  }

  /**
   * Returns count of active elements y in the trie such that (x ^ y) &lt; k
   */
  countXorLess(x, k) {
    let u = 1;
    let total = 0;
    for (let i = this.W - 1; i &gt;= 0 &amp;&amp; u !== 0; i--) {
      const bx = (x &gt;&gt;&gt; i) &amp; 1;
      const bk = (k &gt;&gt;&gt; i) &amp; 1;
      if (bk === 1) {
        const sameChild = this.ch[(u &lt;&lt; 1) | bx];
        if (sameChild !== 0) total += this.cnt[sameChild];
        u = this.ch[(u &lt;&lt; 1) | (bx ^ 1)];
      } else {
        u = this.ch[(u &lt;&lt; 1) | bx];
      }
    }
    return total;
  }
}

/**
 * Maximum XOR of any contiguous subarray A[L..R] in O(N * W) time
 */
function maxXorSubarray(arr, bitWidth = 30) {
  const trie = new BitwiseTrie(arr.length + 1, bitWidth);
  trie.insert(0); // Prefix XOR P[0] = 0 so subarrays starting at index 0 are included!
  let pref = 0;
  let best = 0;
  for (let i = 0; i &lt; arr.length; i++) {
    pref ^= arr[i];
    best = Math.max(best, trie.maxXor(pref));
    trie.insert(pref);
  }
  return best;
}</code></pre>

      <h3>3. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Problem ($N$ integers of $W$ bits)</th>
            <th>Brute Force</th>
            <th>Bitwise (0-1) Trie</th>
            <th>Space Complexity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Max XOR Pair / Max XOR Subarray</td>
            <td>$\\Theta(N^2)$</td>
            <td>$\\Theta(N \\cdot W)$</td>
            <td>$O(N \\cdot W)$ integers</td>
          </tr>
          <tr>
            <td>Count Subarrays with $\\text{XOR}(L..R) < K$</td>
            <td>$\\Theta(N^2)$</td>
            <td>$\\Theta(N \\cdot W)$</td>
            <td>$O(N \\cdot W)$ integers</td>
          </tr>
          <tr>
            <td>Offline Subarray $\\max_{i \\in [L, R]} (x \\oplus A[i])$ (<code>maxIdx</code>)</td>
            <td>$O(Q \\cdot N)$</td>
            <td>$O((N + Q) \\cdot W)$</td>
            <td>$O(N \\cdot W)$ integers</td>
          </tr>
          <tr>
            <td>Online Subarray $\\max_{i \\in [L, R]} (x \\oplus A[i])$ (Persistent 0-1 Trie)</td>
            <td>$O(Q \\cdot N)$</td>
            <td>$O((N + Q) \\cdot W)$</td>
            <td>$O(N \\cdot W)$ nodes</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Forgetting to Insert Prefix <code>P[0] = 0</code> Before the Loop in Subarray XOR Problems:</strong> Every subarray XOR $\\bigoplus_{k=L}^{R} A[k]$ equals $P[R] \\oplus P[L-1]$. When $L = 1$ (a subarray that starts at the very first element of the array), the required partner is $P[0] = 0$. If you forget <code>trie.insert(0)</code> before iterating over $R = 1 \\dots N$, your algorithm will never consider subarrays starting at index $0$ (unless some later prefix happens to XOR to $0$)!
      </div>
    </div>`,
    keyTakeaways: [
      "A Bitwise (0-1) Trie inserts W-bit integers from MSB (bit W-1) down to LSB (bit 0) because 2^k exceeds the sum of all lower powers of two.",
      "Maximizing x ^ y greedily chooses child (b ^ 1) at each bit i if available (cnt > 0), falling back to child b in O(W) time.",
      "Counting y with (x ^ y) < K adds cnt[child[bx]] whenever bit i of K is 1, then descends into child[bx ^ 1] where the prefix of (x ^ y) matches K.",
      "Subarray XOR problems reduce to Pair XOR on the prefix array P[i] = P[i-1] ^ A[i], provided P[0] = 0 is inserted into the trie first."
    ],
    furtherReading: [
      {
        title: "CP-Algorithms — Trie & Bitwise XOR Applications",
        url: "https://cp-algorithms.com/string/aho_corasick.html"
      },
      {
        title: "Codeforces Educational Tutorial — Binary Trie for XOR & Mex Queries (Global Set XOR Toggle)",
        url: "https://codeforces.com/blog/entry/68953"
      }
    ]
  },

  "rabin-karp-polynomial-rolling-hash": {
    title: "Rabin-Karp Rolling Hash: Mersenne Prime Moduli (2^61 - 1) & Birthday Collision Avoidance",
    video: {
      youtubeId: "qQ8vS2btsxI",
      title: "Rabin-Karp Algorithm & Polynomial Rolling Hash",
      channel: "Abdul Bari",
      duration: "18:22",
      start: 0,
      length: 1102,
      why: "Explains the polynomial view of strings and how sliding a window updates the hash in O(1) arithmetic operations."
    },
    intuition: `<p>Karp and Rabin (1987) turned string comparison into modular arithmetic by treating a string $S[0..N-1]$ as a polynomial evaluated at a random base $B$ modulo a prime $M$: $H(S) = \\left(\\sum_{i=0}^{N-1} S[i] \\cdot B^{N-1-i}\\right) \\bmod M$. By precomputing prefix hashes $P[i] = (P[i-1] \\cdot B + S[i]) \\bmod M$ and base powers $B^k \\bmod M$ in $O(N)$ time, the hash of <strong>any arbitrary substring $S[L..R]$</strong> can be extracted in <strong>$O(1)$ time</strong> via $(P[R+1] - P[L] \\cdot B^{R - L + 1}) \\bmod M$! This unlocks algorithms that deterministic automata cannot easily express, such as $O(\\log N)$ Longest Common Prefix (LCP) of any two substrings via binary search, or $O(N \\log N)$ Longest Duplicate Substring.</p>
    <p>However, naive 32-bit rolling hashes (<code> + "</code>M = 10^9 + 7<code>" + </code>) fail catastrophically whenever a problem compares $\\Theta(N)$ substring hashes: by the <strong>Birthday Paradox</strong>, comparing $K = 10^5$ hashes has collision probability $\\approx 1 - e^{-K^2 / (2M)} \\approx 99.3\\%$! Using the 61-bit <strong>Mersenne prime $M = 2^{61} - 1$</strong> with fast bit-shift modular reduction (<code> + "</code>(x & M) + (x >> 61)<code>" + </code>) and a runtime-randomized base $B$ shrinks the collision probability for $10^5$ substrings down to $\\approx 2 \\times 10^{-9}$.</p>`,
    content: `<div class="lesson-content">
      <h3>1. Polynomial Prefix Hashing &amp; $O(1)$ Substring Extraction</h3>
      <p>Define the 1-indexed prefix hash array $P[0..N]$ with $P[0] = 0$ and recurrence $P[i] = (P[i-1] \\cdot B + S[i-1]) \\bmod M$, alongside power table $\\text{powB}[k] = B^k \\bmod M$. Notice that $P[R+1]$ contains $P[L]$ shifted left by $R - L + 1$ powers of $B$, plus the polynomial of $S[L..R]$:</p>
      <p>$$P[R+1] = P[L] \\cdot B^{R - L + 1} + \\sum_{j=L}^{R} S[j] \\cdot B^{R - j} \\pmod M$$</p>
      <p>Subtracting $P[L] \\cdot \\text{powB}[R - L + 1]$ modulo $M$ isolates the exact canonical hash of $S[L..R]$ in $O(1)$ time!</p>

      <div class="invariant-box">
        <strong>Schwartz-Zippel Lemma &amp; Birthday Paradox Bound:</strong>
        <ul>
          <li><strong>Single Pair Comparison:</strong> Two distinct strings of length $L$ define a non-zero difference polynomial of degree $< L$. By the Schwartz-Zippel Lemma (Lagrange's Theorem), if base $B$ is chosen uniformly at random from $[1, M-1]$, the probability that $H(S_1) \\equiv H(S_2) \\pmod M$ is at most $\\frac{L - 1}{M - 1}$.</li>
          <li><strong>All-Pairs / Set of $K$ Substrings (Birthday Paradox):</strong> When inserting $K$ substring hashes of length $L$ into a hash set (or sorting them), there are $\\binom{K}{2} \\approx \\frac{K^2}{2}$ pairs. By the union bound, the failure probability is bounded by $\\frac{K^2 \\cdot L}{2M}$. With $M = 10^9 + 7$ and $K = 10^5$, $\\frac{K^2}{2M} \\approx 5 > 1$ (guaranteed collision!). With $M = 2^{61} - 1 \\approx 2.3 \\times 10^{18}$ (or a Double Hash $(M_1, M_2)$), $\\frac{K^2}{2M} \\approx 2.1 \\times 10^{-9}$.</li>
        </ul>
      </div>

      <svg viewBox="0 0 760 225" class="lesson-svg" role="img" aria-label="Prefix Polynomial Rolling Hash Substring Extraction and Mersenne 2^61-1 Reduction">
        <style>
          .rk-bg { fill: #0f172a; rx: 10px; }
          .rk-preL { fill: rgba(244, 114, 182, 0.22); stroke: #f472b6; stroke-width: 2px; rx: 4px; }
          .rk-sub { fill: rgba(52, 211, 153, 0.24); stroke: #34d399; stroke-width: 2px; rx: 4px; }
          .rk-card { fill: #1e293b; stroke: #38bdf8; stroke-width: 1.8px; rx: 6px; }
          .rk-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .rk-lbl { fill: #94a3b8; font-family: sans-serif; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="225" class="rk-bg"/>
        <text x="24" y="26" class="rk-txt" fill="#38bdf8">O(1) Substring Hash: hash(L..R) = (P[R+1] - P[L] * B^(R-L+1)) mod (2^61 - 1)</text>

        <!-- P[R+1] bar -->
        <text x="24" y="60" class="rk-txt">P[R+1]:</text>
        <rect x="95" y="42" width="210" height="28" class="rk-preL"/>
        <text x="200" y="60" text-anchor="middle" class="rk-txt">S[0..L-1] * B^(R-L+1)</text>
        <rect x="305" y="42" width="230" height="28" class="rk-sub"/>
        <text x="420" y="60" text-anchor="middle" class="rk-txt">+  S[L..R] (Target Hash!)</text>

        <!-- P[L] * B^(R-L+1) bar -->
        <text x="24" y="102" class="rk-txt">P[L]*B^k:</text>
        <rect x="95" y="84" width="210" height="28" class="rk-preL"/>
        <text x="200" y="102" text-anchor="middle" class="rk-txt">S[0..L-1] * B^(R-L+1)</text>
        <text x="320" y="102" class="rk-lbl" fill="#facc15">&lt;-- Exact cancellation via subtraction mod M!</text>

        <!-- Mersenne 2^61 - 1 box -->
        <rect x="24" y="130" width="712" height="76" class="rk-card"/>
        <text x="38" y="152" class="rk-txt" fill="#facc15">Division-Free Mod 2^61 - 1: Because 2^61 ≡ 1 (mod 2^61 - 1), for any 122-bit product x:</text>
        <text x="38" y="174" class="rk-txt" fill="#34d399">modMersenne(x) = (x &amp; ((1n &lt;&lt; 61n) - 1n)) + (x &gt;&gt; 61n);  if (res &gt;= M) res -= M;</text>
        <text x="38" y="194" class="rk-lbl">Replaces 40-cycle hardware DIV instruction with 1-cycle bit shift + mask + add!</text>
      </svg>

      <div class="mermaid">
flowchart LR
  LCP["lcp(i, j): Binary Search len in [0 .. minLen]"] --> Mid["mid = (lo + hi + 1) >> 1"]
  Mid --> Eq{"hash(i, i+mid-1) ==\nhash(j, j+mid-1)?"}
  Eq -- Yes --> GoHi["lo = mid (prefix matches!)"]
  Eq -- No --> GoLo["hi = mid - 1 (mismatch inside)"]
  GoHi & GoLo --> Lex["Compare S[i + lo] vs S[j + lo]\nfor O(log N) Substring Lexicographical Compare!"]
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Why $M = 2^{61} - 1$ Avoids Hardware <code>DIV</code> Bottlenecks and Anti-Hash Tests:</strong> Integer division (<code>idiv</code> on x86-64) has a latency of 25–45 CPU clock cycles and cannot be pipelined well. For the Mersenne prime $M = 2^{61} - 1$, $2^{61} \\equiv 1 \\pmod M$, so any product $x = \\text{hi} \\cdot 2^{61} + \\text{lo}$ satisfies $x \\equiv \\text{hi} + \\text{lo} \\pmod M$—computable using only bit shifts, bitwise AND, and addition! Furthermore, never use <code>unsigned int64</code> overflow ($M = 2^{64}$) with a fixed base: the <strong>Thue-Morse sequence</strong> ($T_0 = \\text{'a'}, T_1 = \\text{'ab'}, T_2 = \\text{'abba'}, \\dots$) has degree-$12$ root collisions at $2^{64}$ for <em>every</em> odd base $B$! Choosing $M = 2^{61} - 1$ with a runtime-randomized base $B$ is immune to Thue-Morse anti-hash tests.
      </div>

      <div class="simulator-mount" data-sim="sim-rabin-karp-rolling-hash"></div>

      <h3>2. Production Implementation: Mersenne $2^{61}-1$ Rolling Hash with $O(1)$ Substring Hash &amp; $O(\\log N)$ LCP</h3>
      <pre><code class="language-javascript">const MOD61 = (1n &lt;&lt; 61n) - 1n;
// Random odd base chosen per process startup in [257 .. 10^9] to defeat adversarial inputs
const RANDOM_BASE = BigInt(257 + Math.floor(Math.random() * 1000000000));

function mod61(x) {
  let res = (x &amp; MOD61) + (x &gt;&gt; 61n);
  if (res &gt;= MOD61) res -= MOD61;
  return res;
}

function mul61(a, b) {
  return mod61(a * b);
}

/**
 * RollingHash61: O(N) build, O(1) arbitrary substring hash, O(log N) substring LCP &amp; compare
 */
class RollingHash61 {
  constructor(str, base = RANDOM_BASE) {
    this.str = str;
    this.n = str.length;
    this.pref = new BigUint64Array(this.n + 1);
    this.pow = new BigUint64Array(this.n + 1);
    this.pow[0] = 1n;

    for (let i = 0; i &lt; this.n; i++) {
      const code = BigInt(str.charCodeAt(i));
      this.pref[i + 1] = mod61(this.pref[i] * base + code);
      this.pow[i + 1] = mul61(this.pow[i], base);
    }
  }

  // O(1) hash of closed substring str[l..r] (0-indexed); returns 0n for empty range l &gt; r
  getHash(l, r) {
    if (l &gt; r) return 0n;
    const sub = this.pref[r + 1] + MOD61 - mul61(this.pref[l], this.pow[r - l + 1]);
    return sub &gt;= MOD61 ? sub - MOD61 : sub;
  }

  // O(log N) Longest Common Prefix of suffixes str[i..] and str[j..]
  lcp(i, j) {
    let lo = 0;
    let hi = this.n - Math.max(i, j);
    while (lo &lt; hi) {
      const mid = (lo + hi + 1) &gt;&gt; 1;
      if (this.getHash(i, i + mid - 1) === this.getHash(j, j + mid - 1)) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    return lo;
  }

  // O(log N) lexicographical comparison of substrings str[l1..r1] and str[l2..r2]
  compareSubstrings(l1, r1, l2, r2) {
    const len1 = r1 - l1 + 1, len2 = r2 - l2 + 1;
    const common = Math.min(len1, len2, this.lcp(l1, l2));
    if (common &gt;= Math.min(len1, len2)) return len1 - len2;
    return this.str.charCodeAt(l1 + common) - this.str.charCodeAt(l2 + common);
  }
}</code></pre>

      <h3>3. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Operation / Modulus Choice</th>
            <th>Preprocessing</th>
            <th>Operation Time</th>
            <th>Collision Risk for $K = 10^5$ Substrings</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Single 32-bit Prime ($M = 10^9 + 7$)</td>
            <td>$\\Theta(N)$</td>
            <td>$O(1)$ substring hash</td>
            <td>$\\approx 99.3\\%$ (Broken by Birthday Paradox!)</td>
          </tr>
          <tr>
            <td>Unsigned 64-bit Overflow ($M = 2^{64}$, fixed base)</td>
            <td>$\\Theta(N)$</td>
            <td>$O(1)$ substring hash</td>
            <td>$100\\%$ on Thue-Morse string of length $2048$</td>
          </tr>
          <tr>
            <td>Mersenne Prime $M = 2^{61} - 1$ + Random Base $B$</td>
            <td>$\\Theta(N)$</td>
            <td>$O(1)$ hash, $O(\\log N)$ LCP</td>
            <td>$\\le \\frac{K^2 L}{2(2^{61}-1)} \\approx 2 \\times 10^{-9}$</td>
          </tr>
          <tr>
            <td>Rabin-Karp Pattern Search ($|T| = N, |P| = M$)</td>
            <td>$\\Theta(N + M)$</td>
            <td>$\\Theta(N + M)$ expected</td>
            <td>$0$ (if verified on hash hit)</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Mapping the First Character to <code>0</code> (<code>'a' -&gt; 0</code>):</strong> Never map <code>'a'</code> to <code>0</code> (<code>str.charCodeAt(i) - 97</code>) in a polynomial rolling hash! If <code>'a'</code> maps to <code>0</code>, then <code>"a"</code>, <code>"aa"</code>, <code>"aaa"</code>, and <code>""</code> all evaluate to the exact same polynomial hash <code>0</code>! Always map characters to strictly positive integers $\\ge 1$ (<code>str.charCodeAt(i) - 96</code> or raw UTF-16 <code>str.charCodeAt(i)</code>), and choose base $B > \\max_c(\\text{charCode}(c))$.
      </div>
    </div>`,
    keyTakeaways: [
      "Precomputing prefix polynomial hashes P[i] = (P[i-1]*B + S[i-1]) mod M allows O(1) hash extraction of any substring S[L..R] via (P[R+1] - P[L]*B^(R-L+1)) mod M.",
      "By the Birthday Paradox, comparing K = 10^5 substrings requires a modulus M >> K^2; a single 32-bit prime (10^9 + 7) collides with >99% probability.",
      "The Mersenne prime M = 2^61 - 1 with a runtime-randomized base supports division-free reduction (x & M) + (x >> 61) and defeats both Birthday collisions and Thue-Morse anti-hash strings.",
      "Combining O(1) substring hashing with binary search computes the Longest Common Prefix (LCP) and lexicographical order of any two substrings in O(log N) time."
    ],
    furtherReading: [
      {
        title: "Karp & Rabin (1987) — Efficient Randomized Pattern-Matching Algorithms (IBM Journal of Research and Development)",
        url: "https://doi.org/10.1147/rd.312.0249"
      },
      {
        title: "CP-Algorithms — String Hashing & Anti-Hash Collision Probability Analysis",
        url: "https://cp-algorithms.com/string/string-hashing.html"
      }
    ]
  },

  "kmp-prefix-function-automaton": {
    title: "Knuth-Morris-Pratt (KMP): Prefix Function π[i] Amortized Linearity & DFA View",
    video: {
      youtubeId: "GTJr8OvyEVQ",
      title: "Knuth-Morris-Pratt (KMP) Pattern Matching & Prefix Function LPS",
      channel: "Tushar Roy - Coding Made Simple",
      duration: "19:53",
      start: 0,
      length: 1193,
      why: "Step-by-step trace of why KMP never re-scans text characters by falling back along the prefix function pi[j - 1]."
    },
    intuition: `<p>When a naive substring search matches the first $j$ characters of pattern $P[0..M-1]$ against text $T$ and then mismatches at $T[i] \\neq P[j]$, shifting the pattern by 1 and restarting at $T[i - j + 1]$ discards something we already know! We <em>know</em> that the last $j$ characters of the text just before $T[i]$ are literally equal to the pattern prefix $P[0..j-1]$. Therefore, the longest shift that could possibly remain aligned at $T[i]$ is the <strong>longest proper prefix of $P[0..j-1]$ that is also a suffix of $P[0..j-1]$</strong>!</p>
    <p>Knuth, Morris, and Pratt (1977) formalized this as the <strong>Prefix Function $\\pi[i]$</strong> (often called the LPS array): $\\pi[i] = \\max\\{k < i + 1 : P[0..k-1] = P[i-k+1..i]\\}$. Because the second-longest border of a string $X$ is simply the longest border of the longest border of $X$ ($\\pi[\\pi[i]-1]$), $\\pi$ forms a failure tree where we can compute all $\\pi[0..M-1]$ in <strong>exact $\\Theta(M)$ time</strong>: the current border length $j$ increases by at most $+1$ per outer loop iteration, so the inner <code> + "</code>while (j > 0 && P[i] !== P[j]) j = pi[j - 1]<code>" + </code> loop can decrease $j$ at most $M$ times across the entire algorithm!</p>`,
    content: `<div class="lesson-content">
      <h3>1. The Prefix Function $\\pi[i]$ &amp; Potential-Function Proof of $\\Theta(N)$ Linearity</h3>
      <p>For a string $S[0..n-1]$, a <strong>border</strong> of prefix $S[0..i]$ is any proper substring (length $k \\le i$) that is simultaneously a prefix and a suffix of $S[0..i]$. The prefix function $\\pi[i]$ stores the length of the longest border of $S[0..i]$.</p>

      <div class="invariant-box">
        <strong>Border-Iteration Lemma &amp; Amortized Linearity Proof:</strong>
        <ol>
          <li><strong>All Borders via $\\pi$ Chain:</strong> Every border of $S[0..i]$ of length $k > 0$ other than $\\pi[i]$ itself is a proper border of $S[0..\\pi[i]-1]$. Thus iterating $k \\leftarrow \\pi[k - 1]$ visits <em>all</em> border lengths of $S[0..i]$ in strictly decreasing order!</li>
          <li><strong>Potential Function $\\Phi = j$:</strong> Let $j = \\pi[i-1] \\ge 0$ be the current matched border length entering step $i$. Each <code>while</code> fallback step sets $j \\leftarrow \\pi[j - 1] \\le j - 1$, decreasing $\\Phi$ by at least $1$, while the <code>if (S[i] === S[j]) j++</code> statement at the end of step $i$ increases $\\Phi$ by at most $+1$. Since $\\Phi = j \\ge 0$ always, the total number of <code>while</code>-loop iterations across all $i = 1 \\dots n-1$ is <strong>strictly less than $n$</strong>, proving $\\Theta(n)$ worst-case time!</li>
        </ol>
      </div>

      <svg viewBox="0 0 760 225" class="lesson-svg" role="img" aria-label="KMP Prefix Function Border Overlap and Failure Transition">
        <style>
          .kmp-bg { fill: #0f172a; rx: 10px; }
          .kmp-box { fill: #1e293b; stroke: #475569; stroke-width: 1.8px; rx: 4px; }
          .kmp-brd { fill: rgba(56, 189, 248, 0.25); stroke: #38bdf8; stroke-width: 2px; rx: 4px; }
          .kmp-mis { fill: rgba(244, 114, 182, 0.28); stroke: #f472b6; stroke-width: 2px; rx: 4px; }
          .kmp-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .kmp-sub { fill: #94a3b8; font-family: sans-serif; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="225" class="kmp-bg"/>
        <text x="24" y="26" class="kmp-txt" fill="#38bdf8">KMP Border Fallback on Mismatch at j = 5 in Pattern P = "ABABAC" (pi = [0, 0, 1, 2, 3, 0])</text>

        <!-- Text alignment before fallback -->
        <text x="24" y="60" class="kmp-txt">Text T:      ...  A    B    A    B    A    B ...</text>
        <text x="24" y="95" class="kmp-txt">Pattern P:        A    B    A    B    A    C</text>
        <rect x="148" y="76" width="132" height="26" class="kmp-brd"/>
        <rect x="236" y="76" width="132" height="26" class="kmp-brd"/>
        <rect x="368" y="76" width="44" height="26" class="kmp-mis"/>
        <text x="260" y="120" text-anchor="middle" class="kmp-sub" fill="#38bdf8">Matched j = 5 ("ABABA"); border pi[4] = 3 ("ABA")</text>
        <text x="390" y="120" class="kmp-sub" fill="#f472b6">Mismatch: T[i]='B' != P[5]='C'</text>

        <!-- Shifted pattern after j = pi[4] = 3 -->
        <text x="24" y="162" class="kmp-txt" fill="#34d399">Fallback j=3:              A    B    A    B    A    C</text>
        <rect x="236" y="143" width="132" height="26" class="kmp-brd"/>
        <rect x="368" y="143" width="44" height="26" fill="rgba(52, 211, 153, 0.28)" stroke="#34d399" stroke-width="2" rx="4"/>
        <text x="390" y="196" text-anchor="middle" class="kmp-txt" fill="#facc15">Now P[0..2]="ABA" is already matched, and T[i]='B' == P[3]='B' -&gt; j becomes 4!</text>
      </svg>

      <h3>2. Building the Explicit KMP Automaton (DFA) for Worst-Case $O(1)$ Per-Character Streaming</h3>
      <p>In standard KMP, a single character step can take up to $O(M)$ <code>while</code>-loop hops in the worst case (e.g., on <code>"aaaaab"</code>), even though it is $O(1)$ <em>amortized</em>. What if we are building a real-time network packet scanner, or running Dynamic Programming over strings where we branch into multiple states and <em>cannot</em> rely on amortization? We can precompute the <strong>KMP Deterministic Finite Automaton $\\text{aut}[j][c]$</strong> in $O(M \\cdot |\\Sigma|)$ time using a single line:</p>
      <p>$$\\text{aut}[j][c] = \\begin{cases} j + 1 & \\text{if } j < M \\text{ and } P[j] = c \\\\ \\text{aut}[\\pi[j - 1]][c] & \\text{if } j > 0 \\text{ and } P[j] \\neq c \\\\ 0 & \\text{if } j = 0 \\text{ and } P[0] \\neq c \\end{cases}$$</p>
      <p>Notice that because $\\pi[j - 1] < j$, row $\\text{aut}[\\pi[j - 1]]$ has <em>already been computed</em>! This eliminates the <code>while</code> loop completely and gives <strong>strict worst-case $O(1)$ per character</strong>!</p>

      <div class="mermaid">
flowchart LR
  S0(("0")) -->|"A"| S1(("1"))
  S1 -->|"B"| S2(("2"))
  S2 -->|"A"| S3(("3"))
  S3 -->|"B"| S4(("4"))
  S4 -->|"A"| S5(("5"))
  S5 -->|"C"| S6((("6 (Match)")))
  S5 -.->|"pi[4]=3 (on 'B' -> 4)"| S3
  S3 -.->|"pi[2]=1"| S1
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Zero Extra Allocation via $P + \\text{'\\#'} + T$ vs Streaming Pointer:</strong> A popular textbook trick computes $\\pi$ on the concatenated string $S = P + \\text{'\\#'} + T$, which allocates an $O(N + M)$ string and an $O(N + M)$ integer array. In production, allocate $\\pi$ <strong>only on the pattern $P$ ($O(M)$ integers, typically fitting in L1 cache)</strong> and stream a single integer state $j \\in [0, M]$ across $T$ using $O(1)$ extra workspace!
      </div>

      <div class="simulator-mount" data-sim="sim-kmp-z-automaton"></div>

      <h3>3. Production Implementation: Prefix Function, KMP Stream Matcher, Smallest Period &amp; KMP Automaton</h3>
      <pre><code class="language-javascript">/**
 * Computes the KMP Prefix Function pi[0..M-1] in exact Theta(M) time and space.
 * pi[i] = length of longest proper prefix of P[0..i] that is also a suffix of P[0..i].
 */
function computePrefixFunction(pattern) {
  const m = pattern.length;
  const pi = new Int32Array(m);
  let j = 0;
  for (let i = 1; i &lt; m; i++) {
    while (j &gt; 0 &amp;&amp; pattern.charCodeAt(i) !== pattern.charCodeAt(j)) {
      j = pi[j - 1];
    }
    if (pattern.charCodeAt(i) === pattern.charCodeAt(j)) {
      j++;
    }
    pi[i] = j;
  }
  return pi;
}

/**
 * Finds all starting indices in <code>text</code> where <code>pattern</code> occurs in Theta(N + M) time and O(M) space.
 */
function kmpSearch(text, pattern) {
  const n = text.length, m = pattern.length;
  if (m === 0) return [];
  const pi = computePrefixFunction(pattern);
  const matches = [];
  let j = 0;

  for (let i = 0; i &lt; n; i++) {
    while (j &gt; 0 &amp;&amp; text.charCodeAt(i) !== pattern.charCodeAt(j)) {
      j = pi[j - 1];
    }
    if (text.charCodeAt(i) === pattern.charCodeAt(j)) {
      j++;
    }
    if (j === m) {
      matches.push(i - m + 1);
      j = pi[j - 1]; // Fallback to find overlapping matches!
    }
  }
  return matches;
}

/**
 * Periodicity Theorem: The smallest period length of S is p = N - pi[N - 1].
 * S is a exact repetition of S[0..p-1] iff p divides N.
 */
function smallestExactPeriod(str) {
  const n = str.length;
  const pi = computePrefixFunction(str);
  const p = n - pi[n - 1];
  return n % p === 0 ? str.slice(0, p) : str;
}

/**
 * Builds the explicit KMP DFA Automaton aut[state][charCode] for strict O(1) worst-case transitions
 */
function buildKmpAutomaton(pattern, alphabetSize = 26, baseCharCode = 97) {
  const m = pattern.length;
  const pi = computePrefixFunction(pattern);
  const aut = Array.from({ length: m + 1 }, () =&gt; new Int32Array(alphabetSize));

  for (let state = 0; state &lt;= m; state++) {
    for (let c = 0; c &lt; alphabetSize; c++) {
      if (state &lt; m &amp;&amp; pattern.charCodeAt(state) - baseCharCode === c) {
        aut[state][c] = state + 1;
      } else if (state &gt; 0) {
        aut[state][c] = aut[pi[state - 1]][c];
      } else {
        aut[state][c] = 0;
      }
    }
  }
  return aut;
}</code></pre>

      <h3>4. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Algorithm / Representation</th>
            <th>Preprocessing Time</th>
            <th>Space Complexity</th>
            <th>Per-Character Step</th>
            <th>Total Search Time ($|T| = N$)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Naive Sliding Window</td>
            <td>$O(1)$</td>
            <td>$O(1)$</td>
            <td>$O(M)$</td>
            <td>$\\Theta(N \\cdot M)$ worst-case</td>
          </tr>
          <tr>
            <td>Standard KMP ($\pi[0..M-1]$)</td>
            <td>$\\Theta(M)$</td>
            <td>$\\Theta(M)$</td>
            <td>$O(1)$ amortized ($O(M)$ worst-case)</td>
            <td>$\\Theta(N + M)$ worst-case</td>
          </tr>
          <tr>
            <td>KMP DFA Automaton (<code>aut[M+1][|Sigma|]</code>)</td>
            <td>$\\Theta(M \\cdot |\\Sigma|)$</td>
            <td>$\\Theta(M \\cdot |\\Sigma|)$</td>
            <td><strong>$\\Theta(1)$ strict worst-case</strong></td>
            <td>$\\Theta(N + M \\cdot |\\Sigma|)$</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Jumping to <code>j = pi[j]</code> Instead of <code>j = pi[j - 1]</code> on Mismatch:</strong> When comparing <code>text[i]</code> against <code>pattern[j]</code> fails, the prefix that has <em>already matched</em> is <code>pattern[0 .. j - 1]</code> (of length $j$, ending at index $j - 1$). Therefore its longest proper border has length <code>pi[j - 1]</code>. Writing <code>j = pi[j]</code> reads the border of <code>pattern[0 .. j]</code> (which includes the mismatched character <code>pattern[j]</code> and can even equal $j + 1$!), causing infinite loops or out-of-bounds reads when <code>j === m</code>.
      </div>
    </div>`,
    keyTakeaways: [
      "The prefix function pi[i] stores the length of the longest proper prefix of P[0..i] that is also a suffix of P[0..i].",
      "Because j = pi[i-1] increases by at most +1 per outer step i and decreases by at least -1 per inner while step (j = pi[j-1]), KMP runs in strict Theta(N + M) worst-case time.",
      "The smallest period candidate of a string S of length N is N - pi[N - 1]; S is a repetition of that period iff (N - pi[N - 1]) divides N.",
      "Precomputing aut[state][c] = (P[state] == c ? state + 1 : aut[pi[state - 1]][c]) upgrades KMP from O(1) amortized to O(1) strict worst-case time per character."
    ],
    furtherReading: [
      {
        title: "Knuth, Morris, & Pratt (1977) — Fast Pattern Matching in Strings (SIAM Journal on Computing)",
        url: "https://doi.org/10.1137/0206024"
      },
      {
        title: "CP-Algorithms — Prefix Function, KMP, String Periodicity & Automaton Construction",
        url: "https://cp-algorithms.com/string/prefix-function.html"
      }
    ]
  },

  "z-algorithm-linear-box": {
    title: "The Z-Algorithm: Linear-Time [L, R] Z-Box Maintenance & Pattern Matching",
    video: {
      youtubeId: "CpZh4eF8QBw",
      title: "Z Algorithm — Linear Time Pattern Searching & Z-Box Intuition",
      channel: "Tushar Roy - Coding Made Simple",
      duration: "17:38",
      start: 0,
      length: 1058,
      why: "Clear visual walkthrough of how the rightmost matched Z-box [L, R] lets us copy previous Z-values in O(1) before extending R monotonically."
    },
    intuition: `<p>Whereas KMP's prefix function $\\pi[i]$ asks <em>"what is the longest prefix of $S$ that ends at $i$?"</em>, Gusfield's <strong>Z-Array $Z[i]$</strong> asks the dual question: <em>"what is the length of the longest substring starting at $i$ that matches a prefix of $S$?"</em>—that is, $Z[i] = \\text{LCP}(S[0..], S[i..])$. For many string problems (finding all occurrences of $P$ in $T$ via $P + \\text{'\\$'} + T$, finding all tandem repeats, or matching with wildcards), $Z[i]$ is far more direct to reason about than $\\pi[i]$.</p>
    <p>How do we compute $Z[1..N-1]$ in $\\Theta(N)$ time without $O(N^2)$ character comparisons? Maintain the interval <strong>$[L, R]$ (the Z-Box)</strong> with the maximum right endpoint $R$ among all prefix-matching intervals $[k, k + Z[k] - 1]$ discovered so far. Because $S[L..R] = S[0..R-L]$, whenever the current index $i$ lies inside $[L, R]$, the substring starting at $i$ is an exact copy of the substring starting at the <strong>mirror index $k = i - L$</strong>! If $Z[i - L]$ is strictly shorter than the remaining box length $R - i + 1$, then $Z[i] = Z[i - L]$ immediately with <strong>zero character comparisons</strong>; otherwise we start comparing from $R + 1$ onward, advancing $R$ monotonically at most $N$ times across the entire algorithm!</p>`,
    content: `<div class="lesson-content">
      <h3>1. The $[L, R]$ Z-Box Invariant &amp; Mirror Index $k = i - L$</h3>
      <p>At iteration $i \\in [1, N-1]$, let $[L, R]$ be the rightmost interval discovered so far ($L < i$) such that $S[L..R] = S[0..R-L]$. There are two possibilities for $i$:</p>
      <ol>
        <li><strong>Case 1 ($i > R$):</strong> Index $i$ lies strictly outside the current Z-Box. We have no prior information about $S[i]$, so we compare $S[0..]$ with $S[i..]$ character by character to find $Z[i]$, and if $Z[i] > 0$, set $L = i, R = i + Z[i] - 1$.</li>
        <li><strong>Case 2 ($i \\le R$):</strong> Index $i$ lies inside $[L, R]$. By the Z-Box invariant, $S[i..R] = S[i-L .. R-L]$. Therefore, the first $R - i + 1$ characters starting at $i$ are identical to the characters starting at $k = i - L$:
          <ul>
            <li><strong>Subcase 2a ($Z[i - L] < R - i + 1$):</strong> The prefix match at $i - L$ terminated strictly before reaching $R - L$. Thus the match at $i$ MUST also terminate at the exact same offset: $Z[i] = Z[i - L]$ in $O(1)$ time with zero character comparisons!</li>
            <li><strong>Subcase 2b ($Z[i - L] \\ge R - i + 1$):</strong> We know at least the first $R - i + 1$ characters match ($Z[i] \\ge R - i + 1$), and the match might extend past $R$. We initialize $Z[i] = R - i + 1$, extend character-by-character starting at $R + 1$, and update $[L, R] = [i, i + Z[i] - 1]$.</li>
          </ul>
        </li>
      </ol>

      <div class="invariant-box">
        <strong>One-Line Z-Initialization &amp; Monotonicity of $R$:</strong> Both Case 1 and Case 2 unify into a single initialization:
        $$Z[i] = (i \\le R) \\;\\text{?}\\; \\min(R - i + 1, Z[i - L]) : 0$$
        Followed by <code>while (i + Z[i] &lt; N &amp;&amp; S[Z[i]] === S[i + Z[i]]) Z[i]++;</code>. Notice that whenever the <code>while</code> loop executes even a single successful comparison, $i + Z[i] - 1$ strictly exceeds $R$, which immediately increments $R$! Since $R < N$ never decreases, the <code>while</code> loop makes at most $N$ successful character comparisons across the entire algorithm ($\Theta(N)$ time).
      </div>

      <svg viewBox="0 0 760 225" class="lesson-svg" role="img" aria-label="Z-Algorithm Z-Box [L, R] and Mirror Index i - L">
        <style>
          .z-bg { fill: #0f172a; rx: 10px; }
          .z-pref { fill: rgba(52, 211, 153, 0.22); stroke: #34d399; stroke-width: 2px; rx: 4px; }
          .z-box { fill: rgba(56, 189, 248, 0.22); stroke: #38bdf8; stroke-width: 2px; rx: 4px; }
          .z-mir { fill: rgba(250, 204, 21, 0.28); stroke: #facc15; stroke-width: 2px; rx: 4px; }
          .z-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 600; }
          .z-sub { fill: #94a3b8; font-family: sans-serif; font-size: 11px; }
        </style>
        <rect x="0" y="0" width="760" height="225" class="z-bg"/>
        <text x="24" y="26" class="z-txt" fill="#38bdf8">Z-Box Geometry: S[L..R] == S[0..R-L] Mirrors Index i to k = i - L</text>

        <!-- Full string bar -->
        <rect x="35" y="65" width="690" height="36" fill="#1e293b" stroke="#475569" rx="4"/>
        <!-- Prefix [0 .. R-L] -->
        <rect x="35" y="65" width="250" height="36" class="z-pref"/>
        <text x="160" y="55" text-anchor="middle" class="z-txt" fill="#34d399">Prefix S[0 .. R-L]</text>
        <!-- Mirror sub-box at k = i - L -->
        <rect x="125" y="70" width="90" height="26" class="z-mir"/>
        <text x="170" y="87" text-anchor="middle" class="z-txt">Z[i - L]</text>
        <text x="125" y="118" text-anchor="middle" class="z-sub" fill="#facc15">k = i - L</text>

        <!-- Z-box [L .. R] -->
        <rect x="385" y="65" width="250" height="36" class="z-box"/>
        <text x="510" y="55" text-anchor="middle" class="z-txt" fill="#38bdf8">Active Z-Box S[L .. R]</text>
        <!-- Copied sub-box at i -->
        <rect x="475" y="70" width="90" height="26" class="z-mir"/>
        <text x="520" y="87" text-anchor="middle" class="z-txt">min(R-i+1, Z[k])</text>
        <text x="385" y="118" text-anchor="middle" class="z-sub">L</text>
        <text x="475" y="118" text-anchor="middle" class="z-sub" fill="#facc15">i</text>
        <text x="635" y="118" text-anchor="middle" class="z-sub">R</text>

        <text x="380" y="160" text-anchor="middle" class="z-txt">1) Initialize z[i] = (i &lt;= R) ? Math.min(R - i + 1, z[i - L]) : 0</text>
        <text x="380" y="184" text-anchor="middle" class="z-txt">2) Extend while S[z[i]] == S[i + z[i]]; if (i + z[i] - 1 &gt; R) update [L, R]</text>
        <text x="380" y="206" text-anchor="middle" class="z-sub" fill="#34d399">Because every successful while-step increments R, total character comparisons &lt;= 2N!</text>
      </svg>

      <div class="mermaid">
flowchart TD
  Loop["For i = 1 to N - 1"] --> Init["If i <= R: z[i] = min(R - i + 1, z[i - L])\nElse: z[i] = 0"]
  Init --> Ext["While i + z[i] < N and S[z[i]] == S[i + z[i]]:\nz[i]++"]
  Ext --> Upd{"i + z[i] - 1 > R?"}
  Upd -- Yes --> SetLR["L = i\nR = i + z[i] - 1"]
  Upd -- No --> Next["Next i"]
  SetLR --> Next
      </div>

      <div class="hardware-box">
        <strong>Hardware &amp; Cache Reality — Duality Between $Z[]$ and $\\pi[]$:</strong> The Z-array and KMP prefix function carry equivalent structural information and can be converted into one another in $\\Theta(N)$ time! Specifically, given $Z[1..N-1]$, every index $i$ sets $\\pi[i + Z[i] - 1] = \\max(\\pi[i + Z[i] - 1], Z[i])$, followed by a backward pass $\\pi[i] = \\max(\\pi[i], \\pi[i+1] - 1)$. In practice, the Z-algorithm is often faster than KMP when you need the LCP of every suffix $S[i..]$ against $S[0..]$ directly.
      </div>

      <div class="simulator-mount" data-sim="sim-kmp-z-automaton"></div>

      <h3>2. Production Implementation: Z-Algorithm &amp; $O(N + M)$ Pattern Matching</h3>
      <pre><code class="language-javascript">/**
 * Computes the Z-Array z[0..N-1] in exact Theta(N) time and space.
 * z[i] = length of the longest common prefix between S and the suffix S[i..N-1].
 */
function computeZArray(str) {
  const n = str.length;
  const z = new Int32Array(n);
  if (n === 0) return z;
  z[0] = n;

  let l = 0, r = 0;
  for (let i = 1; i &lt; n; i++) {
    if (i &lt;= r) {
      const k = i - l;
      const rem = r - i + 1;
      z[i] = z[k] &lt; rem ? z[k] : rem;
    }
    while (i + z[i] &lt; n &amp;&amp; str.charCodeAt(z[i]) === str.charCodeAt(i + z[i])) {
      z[i]++;
    }
    if (i + z[i] - 1 &gt; r) {
      l = i;
      r = i + z[i] - 1;
    }
  }
  return z;
}

/**
 * Finds all occurrences of <code>pattern</code> in <code>text</code> using the Z-Algorithm without
 * allocating a concatenated string P + '$' + T! Uses only O(M) extra memory.
 */
function zPatternSearch(text, pattern) {
  const n = text.length, m = pattern.length;
  if (m === 0) return [];
  const zPat = computeZArray(pattern);
  const matches = [];

  let l = -1, r = -1;
  for (let i = 0; i &lt; n; i++) {
    let matchLen = 0;
    if (i &lt;= r) {
      const k = i - l;
      const rem = r - i + 1;
      matchLen = zPat[k] &lt; rem ? zPat[k] : rem;
    }
    while (
      matchLen &lt; m &amp;&amp;
      i + matchLen &lt; n &amp;&amp;
      pattern.charCodeAt(matchLen) === text.charCodeAt(i + matchLen)
    ) {
      matchLen++;
    }
    if (i + matchLen - 1 &gt; r) {
      l = i;
      r = i + matchLen - 1;
    }
    if (matchLen === m) {
      matches.push(i);
    }
  }
  return matches;
}</code></pre>

      <h3>3. Complexity Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Task</th>
            <th>Concatenated Z-Array ($P + \\text{'\\$'} + T$)</th>
            <th>Streaming Z-Search ($z_{\\text{pat}}$ only)</th>
            <th>Binary Search + Rolling Hash</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Compute $\\text{LCP}(S[0..], S[i..])$ for all $i$</td>
            <td>$\\Theta(N)$ time, $\\Theta(N)$ space</td>
            <td>—</td>
            <td>$\\Theta(N \\log N)$ time, $\\Theta(N)$ space</td>
          </tr>
          <tr>
            <td>Exact Pattern Matching ($|T|=N, |P|=M$)</td>
            <td>$\\Theta(N + M)$ time, $\\Theta(N + M)$ space</td>
            <td>$\\Theta(N + M)$ time, $\\Theta(M)$ space</td>
            <td>$\\Theta(N + M)$ time (probabilistic)</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <strong>Common Pitfall — Forgetting to Clamp <code>Z[i - L]</code> by <code>R - i + 1</code> or Omitting a Unique Separator:</strong>
        <ol>
          <li>When $i \\le R$, we only know that $S[i..R]$ matches $S[i-L .. R-L]$—we know <em>nothing</em> about characters beyond index $R$! If $Z[i - L] > R - i + 1$, copying <code>z[i] = z[i - L]</code> without clamping by <code>Math.min(R - i + 1, z[i - L])</code> assumes characters past $R$ matched without ever inspecting them!</li>
          <li>When using the $P + \\text{sep} + T$ trick, if <code>sep</code> can appear inside $P$ or $T$ (and you don't cap matches at $M$), $Z[i]$ can exceed $M$. Using the streaming <code>zPatternSearch(text, pattern)</code> above avoids choosing a separator character altogether and uses only $O(M)$ memory.</li>
        </ol>
      </div>
    </div>`,
    keyTakeaways: [
      "The Z-array entry Z[i] is the length of the longest common prefix between S and the suffix S[i..N-1].",
      "Maintaining the rightmost Z-box [L, R] where S[L..R] = S[0..R-L] allows initializing Z[i] = min(R - i + 1, Z[i - L]) whenever i <= R.",
      "Every character comparison that succeeds inside the while loop advances R by +1, proving that the Z-algorithm performs at most 2N character comparisons in the worst case.",
      "Precomputing Z[] on the pattern alone allows streaming Z-box matching across text T in Theta(N + M) time and Theta(M) memory without a separator character."
    ],
    furtherReading: [
      {
        title: "Gusfield (1997) — Algorithms on Strings, Trees, and Sequences (Cambridge University Press — Chapter 1: Exact Matching & Z-Boxes)",
        url: "https://doi.org/10.1017/CBO9780511574931"
      },
      {
        title: "CP-Algorithms — Z-Function and Its Calculation in Linear Time",
        url: "https://cp-algorithms.com/string/z-function.html"
      }
    ]
  },

  "boyer-moore-horspool-simd": {
    "title": "Sublinear Average-Case Matching: Boyer-Moore Bad-Character/Good-Suffix & Horspool",
    "video": {
      "youtubeId": "4Xyhb72LCX4",
      "title": "Boyer-Moore String Search Algorithm",
      "channel": "Ben Langmead",
      "duration": "16:12",
      "start": 0,
      "length": 972,
      "why": "Ben Langmead explains how scanning the pattern right-to-left while shifting the alignment window left-to-right yields O(N/M) average-case character comparisons."
    },
    "intuition": "<p>Both KMP and the Z-algorithm inspect every single text byte at least once because they scan the pattern from left to right; if the last byte of an $M$-byte window does not even appear in the pattern, they still must read the preceding $M - 1$ bytes before discovering that fact. Boyer-Moore (1977) flips the inner comparison direction: it aligns the pattern at text offset $s$, compares characters from right to left ($j = M - 1$ down to $0$), and uses a mismatch at the rightmost end to leap the entire alignment window forward by up to $M$ bytes at once, achieving sublinear $O(N / M)$ average-case work on large alphabets.</p><p>In modern production code, full Boyer-Moore's complex Good-Suffix table is rarely worth its branch overhead. Instead, Boyer-Moore-Horspool (1980) drops the Good-Suffix table and indexes the Bad-Character shift exclusively by the text byte aligned with the last character of the pattern ($T[s + M - 1]$), which in turn enables vectorized SIMD pre-filters (<code>memchr</code> / AVX2 rare-byte scanning) that check 32 alignments per clock cycle.</p>",
    "content": `<div class="lesson-content">
<h3>1. Right-to-Left Comparison &amp; The Two Shift Rules</h3>
<p>Suppose pattern $P[0..M-1]$ is aligned at text offset $s$, so $P[j]$ sits above $T[s + j]$. We compare from $j = M - 1$ down to $0$. When a mismatch occurs at pattern index $j$ ($P[j] \\neq T[s + j]$), we have already verified that the suffix $P[j+1..M-1]$ matches $T[s+j+1..s+M-1]$. Boyer-Moore takes the maximum shift proposed by two independent rules:</p>
<ul>
  <li><strong>Bad-Character Rule:</strong> Let $c = T[s + j]$ be the mismatched text byte, and let $\\text{last}[c]$ be the rightmost index in $P[0..M-2]$ where byte $c$ appears ($-1$ if absent). To align $T[s + j]$ with that occurrence in $P$, we shift the window right by $\\Delta_{\\text{bad}} = \\max(1,\\; j - \\text{last}[c])$. If $c$ does not appear in $P$ at all, $\\Delta_{\\text{bad}} = j - (-1) = j + 1$; when the mismatch happens immediately at $j = M - 1$, the window leaps by a full $M$ bytes!</li>
  <li><strong>Good-Suffix Rule:</strong> Let $t = P[j+1..M-1]$ be the matched suffix before the mismatch. We shift $P$ right to align $T[s+j+1..s+M-1]$ with the rightmost earlier occurrence of $t$ in $P$ that is not preceded by the same mismatched character $P[j]$ (the <em>strong</em> good-suffix rule), or, if no full copy of $t$ exists inside $P$, with the longest prefix of $P$ that matches a suffix of $t$.</li>
</ul>
<p>Combined with the Galil rule (which remembers matched prefixes across shifts so characters are never re-compared), full Boyer-Moore runs in $O(N + M)$ worst-case time (at most $3N$ comparisons on non-periodic patterns) and $O(N / M)$ average time.</p>

<h3>2. Boyer-Moore-Horspool (BMH): Simplifying the Inner Loop</h3>
<p>Nigel Horspool observed in 1980 that on natural alphabets ($|\\Sigma| = 256$), the Bad-Character shift dominates the Good-Suffix shift almost everywhere, while computing and branching on two tables slows down the CPU pipeline. Horspool's algorithm always computes the shift using the text byte aligned with the <em>last</em> position of the pattern, $c_{\\text{end}} = T[s + M - 1]$, regardless of where the mismatch occurred inside the window:</p>
$$\\text{shift}[c] = \\begin{cases} M & \\text{if } c \\notin P[0..M-2] \\\\ M - 1 - \\max\\{k < M - 1 : P[k] = c\\} & \\text{otherwise} \\end{cases}$$
<p>Note that $P[M - 1]$ itself is deliberately excluded when building $\\text{shift}[c]$ so that $\\text{shift}[c] \\ge 1$ is strictly guaranteed, preventing zero-length infinite loops.</p>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Algorithm Variant</th>
      <th>Preprocessing Time</th>
      <th>Lookup Space</th>
      <th>Average Text Comparisons</th>
      <th>Worst-Case Time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Full Boyer-Moore (+ Galil)</td>
      <td>$O(M + |\\Sigma|)$</td>
      <td>$O(M + |\\Sigma|)$</td>
      <td>$O(N / M)$</td>
      <td>$O(N + M)$</td>
    </tr>
    <tr>
      <td>Boyer-Moore-Horspool (BMH)</td>
      <td>$O(M + |\\Sigma|)$</td>
      <td>$O(|\\Sigma|) = 256\\text{ ints}$</td>
      <td>$O(N / M)$</td>
      <td>$O(N \\cdot M)$</td>
    </tr>
    <tr>
      <td>BMH + SIMD Guard-Byte Filter</td>
      <td>$O(M + |\\Sigma|)$</td>
      <td>$O(|\\Sigma|)$</td>
      <td>$O(N / 32)$ vector ops</td>
      <td>$O(N \\cdot M)$ (or $O(N)$ w/ Two-Way fallback)</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Boyer-Moore-Horspool Safe-Shift Invariant</div>
  <p>For any alignment offset $s$, let $c = T[s + M - 1]$. Every occurrence of $P$ in $T$ at any offset $s' > s$ must align some character $P[k] = c$ with $T[s + M - 1]$ whenever $s' \\le s + M - 1$. Because $\\text{shift}[c] = M - 1 - k_{\\max}$ picks the largest index $k_{\\max} < M - 1$ with $P[k_{\\max}] = c$ (or $k_{\\max} = -1$ if none exists), no valid match can exist in the open interval $(s,\\; s + \\text{shift}[c])$, and $\\text{shift}[c] \\ge 1$ ensures strict forward progress.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">SIMD Two-Byte Guard Filter (AVX2 _mm256_cmpeq_epi8)</div>
  <p>Even Horspool's $O(N / M)$ scalar skip loop suffers from a data-dependent branch and unpredicted memory load <code>s += shift[T[s + M - 1]]</code> every iteration. Modern standard libraries (<code>glibc memmem</code>, Rust <code>memchr::memmem</code>) select the two rarest bytes in $P$ at offsets $k_1, k_2$ (based on an empirical frequency table of English/UTF-8 bytes) and load 32 bytes at $T[i + k_1..i + k_1 + 31]$ and $T[i + k_2..i + k_2 + 31]$ into AVX2 registers. A single <code>_mm256_cmpeq_epi8</code> + bitwise AND + <code>_mm256_movemask_epi8</code> checks 32 candidate alignments simultaneously without branches, calling <code>memcmp</code> only when both rare bytes match.</p>
</div>

<h3>3. Visual Trace: BMH Shift Table &amp; Window Leaps</h3>
<p>Below we search for $P = \\texttt{\"NEEDLE\"}$ ($M = 6$). Notice that $P[0..4] = \\texttt{\"NEEDL\"}$ has rightmost indices $\\text{last}[\\texttt{'N'}] = 0$, $\\text{last}[\\texttt{'E'}] = 2$, $\\text{last}[\\texttt{'D'}] = 3$, $\\text{last}[\\texttt{'L'}] = 4$, giving shifts $M - 1 - \\text{last}[c]$: $\\text{shift}[\\texttt{'N'}] = 5$, $\\text{shift}[\\texttt{'E'}] = 3$, $\\text{shift}[\\texttt{'D'}] = 2$, $\\text{shift}[\\texttt{'L'}] = 1$, and $\\text{shift}[\\text{other}] = 6$ (including $\\texttt{'E'}$ at $P[5]$ being ignored so $\\text{shift}[\\texttt{'E'}] = 3$, not $0$).</p>

<svg viewBox="0 0 760 220" width="100%" height="220" role="img" aria-label="Boyer-Moore-Horspool window leaps on pattern NEEDLE">
  <style>
    .bm-txt { font-family: 'JetBrains Mono', monospace; font-size: 13px; fill: #e2e8f0; text-anchor: middle; }
    .bm-lbl { font-family: 'Inter', sans-serif; font-size: 12px; fill: #94a3b8; }
    .bm-cell { fill: #1e293b; stroke: #475569; stroke-width: 1.2; }
    .bm-skip { fill: #7f1d1d; stroke: #f87171; stroke-width: 1.5; }
    .bm-hit { fill: #064e3b; stroke: #34d399; stroke-width: 1.5; }
  </style>
  <rect width="760" height="220" fill="#0f172a" rx="8"/>
  <text x="20" y="34" class="bm-lbl" font-weight="bold">Text T:</text>
  <!-- Text: F I N D _ A _ N E E D L E (13 chars) -->
  <g transform="translate(110, 14)">
    <rect x="0" y="0" width="38" height="28" class="bm-cell"/><text x="19" y="19" class="bm-txt">F</text>
    <rect x="40" y="0" width="38" height="28" class="bm-cell"/><text x="59" y="19" class="bm-txt">I</text>
    <rect x="80" y="0" width="38" height="28" class="bm-cell"/><text x="99" y="19" class="bm-txt">N</text>
    <rect x="120" y="0" width="38" height="28" class="bm-cell"/><text x="139" y="19" class="bm-txt">D</text>
    <rect x="160" y="0" width="38" height="28" class="bm-cell"/><text x="179" y="19" class="bm-txt">_</text>
    <rect x="200" y="0" width="38" height="28" class="bm-skip"/><text x="219" y="19" class="bm-txt">A</text>
    <rect x="240" y="0" width="38" height="28" class="bm-cell"/><text x="259" y="19" class="bm-txt">_</text>
    <rect x="280" y="0" width="38" height="28" class="bm-hit"/><text x="299" y="19" class="bm-txt">N</text>
    <rect x="320" y="0" width="38" height="28" class="bm-hit"/><text x="339" y="19" class="bm-txt">E</text>
    <rect x="360" y="0" width="38" height="28" class="bm-hit"/><text x="379" y="19" class="bm-txt">E</text>
    <rect x="400" y="0" width="38" height="28" class="bm-hit"/><text x="419" y="19" class="bm-txt">D</text>
    <rect x="440" y="0" width="38" height="28" class="bm-skip"/><text x="459" y="19" class="bm-txt">L</text>
    <rect x="480" y="0" width="38" height="28" class="bm-hit"/><text x="499" y="19" class="bm-txt">E</text>
  </g>

  <!-- Step 1: s = 0 -->
  <text x="20" y="78" class="bm-lbl">s = 0:</text>
  <g transform="translate(110, 58)">
    <rect x="0" y="0" width="238" height="28" fill="#1e1b4b" stroke="#818cf8" rx="4"/>
    <text x="119" y="19" class="bm-txt">N   E   E   D   L   E</text>
    <text x="260" y="19" class="bm-lbl" fill="#f87171">T[5]='A' != 'E' → shift['A'] = 6</text>
  </g>

  <!-- Step 2: s = 6 -->
  <text x="20" y="126" class="bm-lbl">s = 6:</text>
  <g transform="translate(350, 106)">
    <rect x="0" y="0" width="238" height="28" fill="#1e1b4b" stroke="#818cf8" rx="4"/>
    <text x="119" y="19" class="bm-txt">N   E   E   D   L   E</text>
    <text x="255" y="19" class="bm-lbl" fill="#fbbf24">T[11]='L' != 'E' → shift['L'] = 1</text>
  </g>

  <!-- Step 3: s = 7 -->
  <text x="20" y="174" class="bm-lbl">s = 7:</text>
  <g transform="translate(390, 154)">
    <rect x="0" y="0" width="238" height="28" fill="#064e3b" stroke="#34d399" rx="4"/>
    <text x="119" y="19" class="bm-txt">N   E   E   D   L   E</text>
    <text x="255" y="19" class="bm-lbl" fill="#34d399">Match at s = 7! (only 8 comparisons)</text>
  </g>
</svg>

<div class="mermaid">
flowchart LR
  A["Align P at offset s"] --> B{"Compare P[M-1] == T[s+M-1]?"}
  B -- "No" --> C["s += shift[T[s+M-1]]"]
  B -- "Yes" --> D{"Compare P[0..M-2] == T[s..s+M-2]?"}
  D -- "Yes" --> E["Record match at s; s += shift[T[s+M-1]]"]
  D -- "No" --> C
  C --> A
  E --> A
</div>

<div class="simulator-mount" data-sim="sim-rabin-karp-rolling-hash"></div>

<h3>4. Production Implementation: BMH with Rare-Byte Guard</h3>
<pre><code class="language-cpp">#include &lt;array&gt;
#include &lt;cstdint&gt;
#include &lt;cstring&gt;
#include &lt;string_view&gt;
#include &lt;vector&gt;

// Boyer-Moore-Horspool with First+Last Character Guard before memcmp
std::vector&lt;size_t&gt; bmh_search(std::string_view text, std::string_view pat) {
    std::vector&lt;size_t&gt; matches;
    const size_t n = text.size(), m = pat.size();
    if (m == 0 || n &lt; m) return matches;

    // 1. Precompute 256-entry Bad-Character shift table for pat[0 .. m-2]
    std::array&lt;size_t, 256&gt; shift;
    shift.fill(m);
    for (size_t k = 0; k + 1 &lt; m; ++k) {
        shift[static_cast&lt;uint8_t&gt;(pat[k])] = m - 1 - k;
    }

    const uint8_t last_byte = static_cast&lt;uint8_t&gt;(pat[m - 1]);
    const uint8_t first_byte = static_cast&lt;uint8_t&gt;(pat[0]);

    // 2. Scan alignment windows with sublinear skips
    size_t s = 0;
    while (s &lt;= n - m) {
        const uint8_t c_end = static_cast&lt;uint8_t&gt;(text[s + m - 1]);
        if (c_end == last_byte &amp;&amp; static_cast&lt;uint8_t&gt;(text[s]) == first_byte) {
            if (m &lt;= 2 || std::memcmp(text.data() + s + 1, pat.data() + 1, m - 2) == 0) {
                matches.push_back(s);
            }
        }
        s += shift[c_end];
    }
    return matches;
}</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Adversarial Periodic Inputs &amp; The $O(N \\cdot M)$ Horspool Trap</div>
  <p>Because Horspool drops the Good-Suffix and Galil rules, searching for $P = \\texttt{\"BAAAAA\"}$ inside $T = \\texttt{\"AAAAAAAAAAAA...\"}$ compares $M$ characters at every offset and then shifts by $\\text{shift}[\\texttt{'A'}] = 1$, degrading to $\\Theta(N \\cdot M)$ time! If input texts or patterns are untrusted (e.g., network packet inspection or web-exposed search endpoints), either track how many characters have been compared and fall back to a linear-time algorithm (like KMP or Two-Way string matching) whenever the ratio of comparisons to shift progress exceeds a constant threshold, or use full Boyer-Moore with Galil's rule.</p>
</div>
</div>`,
    "keyTakeaways": [
      "Boyer-Moore scans the pattern from right to left (j = M - 1 down to 0) so a mismatch at the end of the window can skip up to M text positions at once, yielding O(N / M) average-case comparisons.",
      "Boyer-Moore-Horspool indexes the Bad-Character shift exclusively by T[s + M - 1] and deliberately excludes P[M - 1] when building the shift table so that shift[c] >= 1 is always guaranteed.",
      "Modern substring searchers combine Horspool's skip logic with SIMD 2-byte guard filters (_mm256_cmpeq_epi8) to inspect 32 candidate alignments per cycle, with a linear-time fallback to prevent O(N * M) periodic degradation."
    ],
    "furtherReading": [
      {
        "title": "Boyer & Moore (1977) — A Fast String Searching Algorithm (CACM)",
        "url": "https://doi.org/10.1145/359842.359859"
      },
      {
        "title": "Horspool (1980) — Practical Fast Searching in Strings (Software: Practice and Experience)",
        "url": "https://doi.org/10.1002/spe.4380100608"
      },
      {
        "title": "Rust memchr::memmem — Packed Pair SIMD & Two-Way Implementation",
        "url": "https://github.com/BurntSushi/memchr"
      }
    ]
  },
  "aho-corasick-trie-automaton": {
    "title": "Aho-Corasick Automaton: Trie + BFS Failure Links + Dictionary Suffix Links",
    "video": {
      "youtubeId": "O7_w001f58c",
      "title": "Aho-Corasick Algorithm for Multi-Pattern String Matching",
      "channel": "Pavel Mavrin",
      "duration": "24:10",
      "start": 0,
      "length": 1450,
      "why": "Pavel Mavrin constructs the Aho-Corasick trie, BFS failure links, and completed DFA transition table step-by-step."
    },
    "intuition": "<p>Running KMP separately for $K$ patterns of total length $M = \\sum |P_i|$ over a text of length $N$ costs $O(K \\cdot N + M)$ time—unacceptable when a virus scanner, intrusion detection system (Snort/Suricata), or log filter holds $K = 50{,}000$ signatures. Alfred Aho and Margaret Corasick (1975) generalized KMP's prefix function from a single string to an entire Trie of patterns, processing the text in a single pass in $O(N + M + Z)$ time (where $Z$ is the number of matches) completely independent of $K$.</p><p>Just as KMP's $\\pi[i]$ points to the longest proper prefix of the pattern that is a suffix of the current match, each state $u$ in an Aho-Corasick Trie represents a prefix string $S(u)$ and maintains a <strong>failure link</strong> $\\text{fail}[u]$ pointing to the deepest node in the Trie whose string is a proper suffix of $S(u)$. By wiring missing Trie edges directly to $\\text{go}[\\text{fail}[u]][c]$ during a breadth-first traversal, the entire Trie becomes a deterministic finite automaton (DFA) that processes one text byte per array lookup with zero backtracking loops.</p>",
    "content": `<div class="lesson-content">
<h3>1. The Three Structural Pillars of Aho-Corasick</h3>
<p>Given a dictionary $\\mathcal{P} = \\{P_1, P_2, \\dots, P_K\\}$ of total length $M = \\sum_{i=1}^K |P_i|$, we first insert all $P_i$ into a standard rooted Trie where the root is state $0$. Each node $u$ corresponds to a unique prefix string $S(u)$ of one or more patterns. We augment the Trie with three structures computed in a single Breadth-First Search (BFS) over the nodes by depth:</p>
<ol>
  <li><strong>Failure Link ($\\text{fail}[u]$):</strong> The unique Trie node $v \\neq u$ maximizing $|S(v)|$ such that $S(v)$ is a proper suffix of $S(u)$. For the root and all depth-1 children of the root, $\\text{fail}[u] = 0$.</li>
  <li><strong>Completed DFA Transition Table ($\\text{go}[u][c]$):</strong> Instead of walking up failure links at query time with a \<code>while\</code> loop (which adds branch mispredictions and requires amortized analysis), we materialize the full transition table during BFS:
  $$\\text{go}[u][c] = \\begin{cases} \\text{trie}[u][c] & \\text{if child } c \\text{ exists at } u \\\\ 0 & \\text{if } u = 0 \\text{ and child } c \\text{ is absent} \\\\ \\text{go}[\\text{fail}[u]][c] & \\text{if } u > 0 \\text{ and child } c \\text{ is absent} \\end{cases}$$
  Because $\\text{depth}(\\text{fail}[u]) < \\text{depth}(u)$, when BFS visits node $u$, $\\text{go}[\\text{fail}[u]][c]$ has already been completely computed for all characters $c \\in \\Sigma$!</li>
  <li><strong>Dictionary Suffix Link ($\\text{exit}[u]$ / Output Link):</strong> A pattern $P_j$ might be a proper substring of another pattern (e.g., $\\texttt{\"she\"}$ and $\\texttt{\"he\"}$ inside $\\texttt{\"ushers\"}$). When the automaton reaches state $u = \\texttt{\"she\"}$, we must also report $\\texttt{\"he\"}$ at $\\text{fail}[u]$. However, walking the entire $\\text{fail}$ chain at every text position takes $O(\\text{depth}(u))$ even when no pattern ends on that chain, degrading worst-case runtime to $O(N \\cdot \\max |P_i|)$. We fix this by computing $\\text{exit}[u]$ during BFS:
  $$\\text{exit}[u] = \\begin{cases} \\text{fail}[u] & \\text{if } \\text{is\\_terminal}[\\text{fail}[u]] = \\text{true} \\\\ \\text{exit}[\\text{fail}[u]] & \\text{otherwise} \\end{cases}$$
  Traversing $\\text{exit}[u]$ jumps exclusively between terminal states that actually emit matches, guaranteeing $O(1)$ work per reported match $Z$.</li>
</ol>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Automaton Variant</th>
      <th>Construction Time</th>
      <th>Memory Footprint</th>
      <th>Text Scan Time (for $Z$ matches)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Lazy Failure Chain + Raw Fail Output Walk</td>
      <td>$O(M)$</td>
      <td>$O(M)$ (hash/list edges)</td>
      <td>$O(N \\cdot \\max |P_i|)$ (degrades on empty fail chains!)</td>
    </tr>
    <tr>
      <td>Lazy Failure Chain + Compressed $\\text{exit}[u]$ Links</td>
      <td>$O(M \\log |\\Sigma|)$</td>
      <td>$O(M)$</td>
      <td>$O(N \\log |\\Sigma| + Z)$ amortized</td>
    </tr>
    <tr>
      <td>Completed DFA ($\\text{go}[u][c]$) + $\\text{exit}[u]$ Links</td>
      <td>$O(M \\cdot |\\Sigma|)$</td>
      <td>$O(M \\cdot |\\Sigma|)$</td>
      <td>$O(N + Z)$ worst-case ($1$ table lookup / byte)</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Aho-Corasick Longest-Suffix State Invariant</div>
  <p>After processing prefix $T[0..i]$ through $u_{i+1} = \\text{go}[u_i][T[i]]$ starting from $u_0 = 0$, the active state $u_{i+1}$ is the unique node in the Trie whose path string $S(u_{i+1})$ is the longest suffix of $T[0..i]$ that appears as a prefix of at least one pattern in $\\mathcal{P}$. Every pattern $P_k \\in \\mathcal{P}$ ending at index $i$ corresponds bijectively to a terminal node reachable from $u_{i+1}$ via zero or more $\\text{exit}[\\cdot]$ hops.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Contiguous Flat Arena vs. Pointer-Based Nodes</div>
  <p>Representing each Aho-Corasick state as a struct inside a single contiguous <code>std::vector&lt;Node&gt;</code> arena indexed by <code>int32_t</code> state IDs ensures that <code>go[u][c]</code> is a single base+offset calculation <code>arena[u].go[c]</code>. For ASCII alphabets ($|\\Sigma| = 256$), a node with <code>int32_t go[256]</code> occupies 1 KB; if only lowercase English letters ($|\\Sigma| = 26$) are needed, <code>int32_t go[26]</code> + <code>fail</code> + <code>exit</code> fits inside 128 bytes (exactly two 64-byte cache lines), allowing hot states near the root to stay permanently resident in L1d cache.</p>
</div>

<h3>2. Visual Trace: Dictionary $\\{\\texttt{\"he\"}, \\texttt{\"she\"}, \\texttt{\"his\"}, \\texttt{\"hers\"}\\}$</h3>
<p>In the classic Aho-Corasick paper example below, solid arrows show Trie edges, dashed red arrows show non-root failure links $\\text{fail}[u]$, and green double-bordered circles denote terminal states. Notice that state $5$ ($\\texttt{\"she\"}$) has $\\text{fail}[5] = 2$ ($\\texttt{\"he\"}$), which is itself terminal, so $\\text{exit}[5] = 2$: matching $\\texttt{\"she\"}$ immediately emits both $\\texttt{\"she\"}$ and $\\texttt{\"he\"}$.</p>

<svg viewBox="0 0 760 280" width="100%" height="280" role="img" aria-label="Aho-Corasick Trie with BFS failure links and terminal exit links">
  <style>
    .ac-node { fill: #1e293b; stroke: #64748b; stroke-width: 1.5; }
    .ac-term { fill: #064e3b; stroke: #34d399; stroke-width: 2.5; }
    .ac-txt { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #f8fafc; text-anchor: middle; }
    .ac-edge-lbl { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #93c5fd; }
    .ac-edge { stroke: #64748b; stroke-width: 1.5; fill: none; }
    .ac-fail { stroke: #f87171; stroke-width: 1.5; stroke-dasharray: 5,4; fill: none; }
    .ac-exit { stroke: #34d399; stroke-width: 1.8; stroke-dasharray: 2,3; fill: none; }
  </style>
  <defs>
    <marker id="ac-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b"/>
    </marker>
    <marker id="ac-farr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171"/>
    </marker>
  </defs>
  <rect width="760" height="280" fill="#0f172a" rx="8"/>

  <!-- Root 0 -->
  <circle cx="80" cy="140" r="20" class="ac-node"/>
  <text x="80" y="144" class="ac-txt">0:ε</text>

  <!-- Upper branch: h (1) -> e (2: "he") -> r (8) -> s (9: "hers") -->
  <line x1="98" y1="130" x2="182" y2="78" class="ac-edge" marker-end="url(#ac-arr)"/>
  <text x="135" y="95" class="ac-edge-lbl">h</text>
  <circle cx="200" cy="70" r="20" class="ac-node"/>
  <text x="200" y="74" class="ac-txt">1:h</text>

  <line x1="220" y1="70" x2="310" y2="50" class="ac-edge" marker-end="url(#ac-arr)"/>
  <text x="262" y="52" class="ac-edge-lbl">e</text>
  <circle cx="330" cy="46" r="21" class="ac-term"/>
  <text x="330" y="50" class="ac-txt">2:he</text>

  <line x1="351" y1="46" x2="450" y2="46" class="ac-edge" marker-end="url(#ac-arr)"/>
  <text x="400" y="38" class="ac-edge-lbl">r</text>
  <circle cx="470" cy="46" r="21" class="ac-node"/>
  <text x="470" y="50" class="ac-txt">8:her</text>

  <line x1="491" y1="46" x2="590" y2="46" class="ac-edge" marker-end="url(#ac-arr)"/>
  <text x="540" y="38" class="ac-edge-lbl">s</text>
  <circle cx="614" cy="46" r="23" class="ac-term"/>
  <text x="614" y="50" class="ac-txt">9:hers</text>

  <!-- Middle branch: 1 (h) -> i (6) -> s (7: "his") -->
  <line x1="220" y1="78" x2="310" y2="122" class="ac-edge" marker-end="url(#ac-arr)"/>
  <text x="262" y="114" class="ac-edge-lbl">i</text>
  <circle cx="330" cy="130" r="21" class="ac-node"/>
  <text x="330" y="134" class="ac-txt">6:hi</text>

  <line x1="351" y1="130" x2="450" y2="130" class="ac-edge" marker-end="url(#ac-arr)"/>
  <text x="400" y="122" class="ac-edge-lbl">s</text>
  <circle cx="470" cy="130" r="21" class="ac-term"/>
  <text x="470" y="134" class="ac-txt">7:his</text>

  <!-- Lower branch: 0 -> s (3) -> h (4) -> e (5: "she") -->
  <line x1="98" y1="150" x2="182" y2="202" class="ac-edge" marker-end="url(#ac-arr)"/>
  <text x="135" y="192" class="ac-edge-lbl">s</text>
  <circle cx="200" cy="210" r="20" class="ac-node"/>
  <text x="200" y="214" class="ac-txt">3:s</text>

  <line x1="220" y1="210" x2="310" y2="210" class="ac-edge" marker-end="url(#ac-arr)"/>
  <text x="262" y="202" class="ac-edge-lbl">h</text>
  <circle cx="330" cy="210" r="21" class="ac-node"/>
  <text x="330" y="214" class="ac-txt">4:sh</text>

  <line x1="351" y1="210" x2="450" y2="210" class="ac-edge" marker-end="url(#ac-arr)"/>
  <text x="400" y="202" class="ac-edge-lbl">e</text>
  <circle cx="470" cy="210" r="21" class="ac-term"/>
  <text x="470" y="214" class="ac-txt">5:she</text>

  <!-- Key non-root failure links -->
  <!-- fail[4 ("sh")] = 1 ("h") -->
  <path d="M 318 192 Q 250 140 212 87" class="ac-fail" marker-end="url(#ac-farr)"/>
  <!-- fail[5 ("she")] = 2 ("he") (also exit[5] = 2) -->
  <path d="M 458 192 Q 395 120 344 64" class="ac-fail" marker-end="url(#ac-farr)"/>
  <!-- fail[7 ("his")] = 3 ("s") -->
  <path d="M 452 142 Q 330 185 220 206" class="ac-fail" marker-end="url(#ac-farr)"/>
  <!-- fail[9 ("hers")] = 3 ("s") -->
  <path d="M 604 68 Q 520 265 218 220" class="ac-fail" marker-end="url(#ac-farr)"/>

  <!-- Legend -->
  <text x="530" y="235" class="ac-edge-lbl" fill="#f87171">--- fail[u] (longest suffix)</text>
  <text x="530" y="255" class="ac-edge-lbl" fill="#34d399">=== Terminal state (exit[5] = 2)</text>
</svg>

<div class="mermaid">
flowchart TD
  A["Insert all patterns P_1..P_K into Trie (root = 0)"] --> B["Init BFS Queue with existing depth-1 children of root (fail = 0)"]
  B --> C{"Queue empty?"}
  C -- "No: pop u" --> D["Compute exit[u] = is_term[fail[u]] ? fail[u] : exit[fail[u]]"]
  D --> E["For each symbol c in Sigma"]
  E --> F{"Child v = trie[u][c] exists?"}
  F -- "Yes" --> G["fail[v] = go[fail[u]][c]; push v to Queue"]
  F -- "No" --> H["Wire shortcut go[u][c] = go[fail[u]][c]"]
  G --> C
  H --> C
  C -- "Yes" --> I["DFA Ready: Scan T in O(N + Z) time"]
</div>

<div class="simulator-mount" data-sim="sim-aho-corasick-trie"></div>

<h3>3. Production Implementation: Completed-DFA Aho-Corasick</h3>
<pre><code class="language-cpp">#include &lt;array&gt;
#include &lt;queue&gt;
#include &lt;string&gt;
#include &lt;string_view&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

class AhoCorasick {
public:
    static constexpr int ALPHA = 26;
    struct Node {
        std::array&lt;int, ALPHA&gt; go{};
        int fail = 0;
        int exit_link = 0;      // Nearest terminal ancestor on fail chain
        std::vector&lt;int&gt; pat_ids; // Pattern IDs ending exactly at this node
    };

    AhoCorasick() { nodes_.emplace_back(); }

    void insert(std::string_view pat, int id) {
        int u = 0;
        for (char ch : pat) {
            int c = ch - 'a';
            if (nodes_[u].go[c] == 0) {
                nodes_[u].go[c] = static_cast&lt;int&gt;(nodes_.size());
                nodes_.emplace_back();
            }
            u = nodes_[u].go[c];
        }
        nodes_[u].pat_ids.push_back(id);
    }

    void build() {
        std::queue&lt;int&gt; q;
        for (int c = 0; c &lt; ALPHA; ++c) {
            int v = nodes_[0].go[c];
            if (v != 0) {
                nodes_[v].fail = 0;
                q.push(v);
            }
        }
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            int f = nodes_[u].fail;
            nodes_[u].exit_link = !nodes_[f].pat_ids.empty() ? f : nodes_[f].exit_link;

            for (int c = 0; c &lt; ALPHA; ++c) {
                int v = nodes_[u].go[c];
                if (v != 0) {
                    nodes_[v].fail = nodes_[f].go[c];
                    q.push(v);
                } else {
                    nodes_[u].go[c] = nodes_[f].go[c];
                }
            }
        }
    }

    // Returns (end_index_in_text, pattern_id) for all occurrences in O(N + Z)
    std::vector&lt;std::pair&lt;int, int&gt;&gt; search(std::string_view text) const {
        std::vector&lt;std::pair&lt;int, int&gt;&gt; matches;
        int u = 0;
        for (int i = 0; i &lt; static_cast&lt;int&gt;(text.size()); ++i) {
            u = nodes_[u].go[text[i] - 'a'];
            for (int cur = u; cur != 0; cur = nodes_[cur].exit_link) {
                for (int pid : nodes_[cur].pat_ids) {
                    matches.emplace_back(i, pid);
                }
            }
        }
        return matches;
    }

private:
    std::vector&lt;Node&gt; nodes_;
};</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Never Walk Raw Failure Links to Collect Matches</div>
  <p>A common implementation bug is writing <code>for (int cur = u; cur != 0; cur = nodes_[cur].fail)</code> inside the text loop to emit matches. Consider a dictionary containing a single long pattern $\\texttt{\"aaaaaaaaaa...ab\"}$ of length $M$ and a text $T = \\texttt{\"aaaaaaaaaa...a\"}$ of length $N$. At every character, $u$ sits at depth $M - 1$ and the raw <code>fail</code> chain steps through $M - 1$ non-terminal nodes before reaching root $0$, turning an $O(N + Z)$ algorithm with $Z = 0$ matches into $\\Theta(N \\cdot M)$ time! Always compress the output chain via $\\text{exit\\_link}$ (or propagate pattern counts if only counting total matches).</p>
</div>
</div>`,
    "keyTakeaways": [
      "Aho-Corasick augments a multi-pattern Trie with BFS failure links fail[u], completed DFA transitions go[u][c], and dictionary suffix links exit[u] to match K patterns in O(N + M + Z) time.",
      "Because fail[u] always has strictly smaller depth than u, computing go[u][c] = go[fail[u]][c] in Breadth-First Search order resolves all failure chains into O(1) table lookups without recursion.",
      "Dictionary suffix links exit[u] skip over non-terminal states on the failure path so reporting Z overlapping matches takes O(Z) work instead of O(N * max|P_i|)."
    ],
    "furtherReading": [
      {
        "title": "Aho & Corasick (1975) — Efficient String Matching: An Aid to Bibliographic Search (CACM)",
        "url": "https://doi.org/10.1145/360825.360855"
      },
      {
        "title": "CP-Algorithms — Aho-Corasick Algorithm and DFA Automaton Construction",
        "url": "https://cp-algorithms.com/string/aho_corasick.html"
      },
      {
        "title": "BurntSushi/aho-corasick — Production Rust Aho-Corasick Library with NFA/DFA Representations",
        "url": "https://github.com/BurntSushi/aho-corasick"
      }
    ]
  },
  "manacher-palindromic-tree": {
    "title": "Palindromes in O(N): Manacher's Algorithm & Eertree (Palindromic Automaton)",
    "video": {
      "youtubeId": "V-sEwsca1ak",
      "title": "Manacher's Algorithm - Longest Palindromic Substring in O(N)",
      "channel": "Tushar Roy - Coding Made Simple",
      "duration": "19:33",
      "start": 0,
      "length": 1173,
      "why": "Walks through center reflection across the rightmost palindrome boundary [L, R] and proves why the outer boundary R advances at most 2N times."
    },
    "intuition": "<p>Expanding around every possible palindrome center in a string of length $N$ takes $O(N^2)$ time on inputs like $\\texttt{\"aaaa...a\"}$ because each center re-discovers symmetry that was already proved by an enclosing palindrome. Glenn Manacher (1975) noticed that if you maintain the palindrome $[L, R]$ with the rightmost right boundary $R$ seen so far, any new center $i < R$ has a mirror center $i' = L + (R - i)$ across the midpoint of $[L, R]$. Exactly like the Z-algorithm's $[L, R]$ Z-box, you can copy $P[i']$ as a free lower bound for $P[i]$ and only perform character comparisons when the palindrome around $i$ pushes strictly past $R$.</p><p>When a problem asks not just for the longest palindrome at each center, but for the <em>distinct</em> palindromic substrings, their occurrence frequencies, or palindromic factorizations, Mikhail Rubinchik and Arseny Shur's <strong>Eertree (Palindromic Tree / Palindromic Automaton, 2015)</strong> provides the exact structural dual of a Trie: a graph with two roots (lengths $-1$ and $0$) where every edge $u \\xrightarrow{c} c\\,S(u)\\,c$ wraps a character symmetrically around both ends of a palindrome, proving constructively that a string of length $N$ contains at most $N$ distinct non-empty palindromic substrings.</p>",
    "content": `<div class="lesson-content">
<h3>1. Manacher's Algorithm: Odd/Even Unification &amp; Mirror Reflection</h3>
<p>Palindromes come in two parities: odd-length (centered on a character, like $\\texttt{\"aba\"}$) and even-length (centered between two characters, like $\\texttt{\"abba\"}$). To avoid writing two separate passes, we transform $S[0..N-1]$ into $T[0..2N]$ of length $2N + 1$ by interleaving a separator $\\texttt{'\\#'}$: for $S = \\texttt{\"abba\"}$, $T = \\texttt{\"\\#a\\#b\\#b\\#a\\#\"}$. Every odd or even palindrome in $S$ now maps bijectively to an <strong>odd-length</strong> palindrome in $T$, and the radius $p[i]$ (number of matching characters strictly to one side of $T[i]$) equals the exact length of the corresponding palindrome in $S$!</p>
<p>We maintain the active palindrome interval $[L, R] = [c - p[c],\\; c + p[c]]$ with maximum right endpoint $R$. For index $i$ from $0$ to $2N$:</p>
<ol>
  <li>If $i < R$, let $i' = L + R - i$ be the reflection of $i$ across center $c$. Because $T[L..R]$ is a palindrome, the neighborhood around $i$ is the reverse of the neighborhood around $i'$ up to the boundary $R - i$. Thus we initialize:
  $$p[i] = \\min(R - i,\\; p[i'])$$</li>
  <li>We then attempt to expand $p[i]$ greedily while $T[i - p[i] - 1] = T[i + p[i] + 1]$. Note that if $p[i'] < R - i$, the palindrome at $i'$ stopped strictly inside $[L, R]$ due to a mismatch $T[i' - p[i'] - 1] \\neq T[i' + p[i'] + 1]$; by symmetry, the characters at $i \\pm (p[i'] + 1)$ also mismatch, so the expansion loop terminates on its first check!</li>
  <li>Whenever $i + p[i] > R$, we update $(L, R) \\leftarrow (i - p[i],\\; i + p[i])$. Since every successful character comparison increments $R$, and $R \\le 2N$, Manacher's algorithm performs at most $2N + 1$ successful comparisons in total: $O(N)$ worst-case time.</li>
</ol>

<h3>2. Eertree (Palindromic Automaton): At Most $N$ Distinct Palindromes</h3>
<p>How many distinct palindromic substrings can $S[0..N-1]$ contain? Consider appending $c = S[i]$ to prefix $S[0..i-1]$. Suppose two new palindromes $P_{\\text{long}}$ and $P_{\\text{short}}$ both end at index $i$ ($|P_{\\text{short}}| < |P_{\\text{long}}|$). Because $P_{\\text{short}}$ is a suffix of $P_{\\text{long}}$ and $P_{\\text{long}}$ is a palindrome, $P_{\\text{short}}$ must also appear as a <em>prefix</em> of $P_{\\text{long}}$—meaning $P_{\\text{short}}$ already occurred earlier inside $S[0..i-1]$! Thus appending $S[i]$ can create <strong>at most one</strong> new distinct palindrome (the longest palindromic suffix of $S[0..i]$), so a string of length $N$ has $\\le N$ distinct non-empty palindromes.</p>
<p>An <strong>Eertree</strong> stores each distinct palindrome as a node $u$ with length $\\text{len}[u]$, transition $\\text{next}[u][c]$ representing the palindrome $c + S(u) + c$ of length $\\text{len}[u] + 2$, and suffix link $\\text{link}[u]$ pointing to the longest proper palindromic suffix of $S(u)$:</p>
<ul>
  <li><strong>Two Roots:</strong> Node $1$ is the <em>imaginary odd root</em> with $\\text{len}[1] = -1$ (so wrapping $c$ around node $1$ gives $\\text{len} = -1 + 2 = 1$, a single character $c$), and Node $2$ is the <em>even empty root</em> with $\\text{len}[2] = 0$ and $\\text{link}[2] = 1$ (so wrapping $c$ around node $2$ gives $cc$ of length $2$).</li>
  <li><strong>Online Extension:</strong> From the longest palindromic suffix $u$ of $S[0..i-1]$, we follow $u \\leftarrow \\text{link}[u]$ until $S[i - 1 - \\text{len}[u]] = S[i]$. Then $\\text{next}[u][S[i]]$ is the longest palindromic suffix of $S[0..i]$.</li>
</ul>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Algorithm / Structure</th>
      <th>Time Complexity</th>
      <th>Space Complexity</th>
      <th>Capabilities</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Manacher's Algorithm</td>
      <td>$O(N)$</td>
      <td>$O(N)$</td>
      <td>Longest palindrome centered at every half-integer position; $O(1)$ palindrome radius queries</td>
    </tr>
    <tr>
      <td>Eertree (Palindromic Tree)</td>
      <td>$O(N \\log |\\Sigma|)$ or $O(N)$</td>
      <td>$\\le N + 2$ states</td>
      <td>Enumerates all distinct palindromes, exact occurrence counts (via reverse link DP), palindromic factorizations</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Manacher Rightmost-Boundary &amp; Eertree Uniqueness Invariants</div>
  <p><strong>Manacher:</strong> At iteration $i$, $R = \\max_{j < i}(j + p[j])$ is non-decreasing. Any character comparison that succeeds during the \<code>while\</code> loop strictly increases $i + p[i]$ beyond $R$, advancing $R$ by $1$ toward $2N$.<br/><strong>Eertree:</strong> Adding character $S[i]$ creates at most $1$ new node because every shorter palindromic suffix of $S[0..i]$ is reflected across the center of the longest palindromic suffix of $S[0..i]$ into an earlier occurrence in $S[0..i-1]$.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Sentinel Boundary Padding in Manacher</div>
  <p>Adding distinct sentinel characters at both ends of the transformed string—e.g., $T = \\texttt{\"^\\#a\\#b\\#a\\#\\$\"}$ where $\\texttt{'^'}$, $\\texttt{'\\$'}$, and $\\texttt{'\\#'}$ do not appear in $S$—eliminates the bounds checks <code>i - p[i] - 1 &gt;= 0 &amp;&amp; i + p[i] + 1 &lt; m</code> from the inner expansion loop. The loop condition simplifies to a single character comparison <code>T[i - p[i] - 1] == T[i + p[i] + 1]</code>, cutting inner-loop branch instructions in half.</p>
</div>

<h3>3. Visual Trace: Manacher Mirror Reflection Across $[L, R]$</h3>
<svg viewBox="0 0 760 200" width="100%" height="200" role="img" aria-label="Manacher mirror reflection of i across center c inside palindrome L..R">
  <style>
    .mn-lbl { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #e2e8f0; text-anchor: middle; }
    .mn-sub { font-family: 'Inter', sans-serif; font-size: 12px; fill: #94a3b8; text-anchor: middle; }
  </style>
  <rect width="760" height="200" fill="#0f172a" rx="8"/>
  <!-- Outer palindrome [L, R] -->
  <line x1="80" y1="100" x2="680" y2="100" stroke="#475569" stroke-width="3"/>
  <rect x="120" y="76" width="520" height="48" fill="#1e1b4b" fill-opacity="0.7" stroke="#818cf8" stroke-width="2" rx="6"/>

  <!-- Mirror palindrome around i' -->
  <rect x="170" y="84" width="120" height="32" fill="#064e3b" stroke="#34d399" stroke-width="1.5" rx="4"/>
  <circle cx="230" cy="100" r="5" fill="#34d399"/>
  <text x="230" y="65" class="mn-lbl" fill="#34d399">i' = L + R - i</text>
  <text x="230" y="140" class="mn-sub">Known radius p[i']</text>

  <!-- Center c -->
  <line x1="380" y1="60" x2="380" y2="140" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,3"/>
  <text x="380" y="50" class="mn-lbl" fill="#fbbf24">Center c</text>

  <!-- Current center i -->
  <rect x="470" y="84" width="120" height="32" fill="#064e3b" stroke="#34d399" stroke-width="1.5" rx="4"/>
  <circle cx="530" cy="100" r="5" fill="#34d399"/>
  <text x="530" y="65" class="mn-lbl" fill="#34d399">Current i</text>
  <text x="530" y="140" class="mn-sub">p[i] &gt;= min(R - i, p[i'])</text>

  <!-- L and R markers -->
  <text x="120" y="145" class="mn-lbl" fill="#818cf8">L = c - p[c]</text>
  <text x="640" y="145" class="mn-lbl" fill="#818cf8">R = c + p[c]</text>
  <text x="380" y="180" class="mn-sub">Comparisons only happen beyond R, so R advances at most 2N times!</text>
</svg>

<div class="mermaid">
flowchart LR
  subgraph Eertree["Eertree Dual-Root Structure for S = 'aba'"]
    R1["Node 1: len = -1 (Odd Root)"]
    R2["Node 2: len = 0 (Even Root)"]
    N3["Node 3: 'a' (len = 1)"]
    N4["Node 4: 'b' (len = 1)"]
    N5["Node 5: 'aba' (len = 3)"]
    R2 -. "link" .-> R1
    R1 -- "'a'" --> N3
    R1 -- "'b'" --> N4
    N4 -- "'a'" --> N5
    N3 -. "link" .-> R2
    N4 -. "link" .-> R2
    N5 -. "link" .-> N3
  end
</div>

<div class="simulator-mount" data-sim="sim-aho-corasick-trie"></div>

<h3>4. Production Implementation: Manacher + Online Eertree</h3>
<pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;array&gt;
#include &lt;string&gt;
#include &lt;string_view&gt;
#include &lt;vector&gt;

// 1. Manacher's Algorithm with Sentinel Padding: returns p[i] on "^#s0#s1#...#$"
std::vector&lt;int&gt; manacher_radii(std::string_view s) {
    std::string t = "^#";
    t.reserve(2 * s.size() + 4);
    for (char c : s) {
        t.push_back(c);
        t.push_back('#');
    }
    t.push_back('$');

    const int m = static_cast&lt;int&gt;(t.size());
    std::vector&lt;int&gt; p(m, 0);
    int l = 1, r = 1;
    for (int i = 1; i &lt; m - 1; ++i) {
        if (i &lt; r) {
            p[i] = std::min(r - i, p[l + r - i]);
        }
        while (t[i - p[i] - 1] == t[i + p[i] + 1]) {
            ++p[i];
        }
        if (i + p[i] &gt; r) {
            l = i - p[i];
            r = i + p[i];
        }
    }
    return p; // Max value in p equals length of longest palindromic substring of s
}

// 2. Eertree (Palindromic Automaton): counts distinct palindromes &amp; total occurrences
struct Eertree {
    struct Node {
        std::array&lt;int, 26&gt; next{};
        int len = 0;
        int link = 0;
        long long occ = 0; // Occurrence count (accumulated bottom-up)
    };
    std::vector&lt;Node&gt; nodes;
    std::string s;
    int last = 2;

    Eertree() {
        nodes.resize(3);
        nodes[1].len = -1; nodes[1].link = 1; // Odd root
        nodes[2].len = 0;  nodes[2].link = 1; // Even root
    }

    int get_fail(int u, int pos) const {
        while (pos - 1 - nodes[u].len &lt; 0 || s[pos - 1 - nodes[u].len] != s[pos]) {
            u = nodes[u].link;
        }
        return u;
    }

    void add_char(char ch) {
        int pos = static_cast&lt;int&gt;(s.size());
        s.push_back(ch);
        int c = ch - 'a';
        int cur = get_fail(last, pos);
        if (nodes[cur].next[c] == 0) {
            int now = static_cast&lt;int&gt;(nodes.size());
            nodes.emplace_back();
            nodes[now].len = nodes[cur].len + 2;
            if (nodes[now].len == 1) {
                nodes[now].link = 2; // Single char links to Even Root (len 0)
            } else {
                nodes[now].link = nodes[get_fail(nodes[cur].link, pos)].next[c];
            }
            nodes[cur].next[c] = now;
        }
        last = nodes[cur].next[c];
        nodes[last].occ++;
    }

    // Call after adding all characters to propagate occurrence counts up suffix links
    long long total_palindromic_substrings() {
        long long total = 0;
        for (int i = static_cast&lt;int&gt;(nodes.size()) - 1; i &gt;= 3; --i) {
            nodes[nodes[i].link].occ += nodes[i].occ;
            total += nodes[i].occ;
        }
        return total;
    }
};</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Eertree Evaluation Order When Computing Link Before Attaching Child</div>
  <p>In Eertree's <code>add_char</code>, you MUST compute <code>nodes[now].link</code> BEFORE setting <code>nodes[cur].next[c] = now</code> (or explicitly handle <code>nodes[now].len == 1</code> first). When <code>cur == 1</code> (the odd root of length $-1$), <code>nodes[cur].link</code> is also $1$; if you assign <code>nodes[1].next[c] = now</code> before computing <code>nodes[now].link</code>, then <code>nodes[get_fail(nodes[1].link, pos)].next[c]</code> will find <code>now</code> itself and create a self-loop <code>nodes[now].link = now</code> instead of linking to the even root $2$!</p>
</div>
</div>`,
    "keyTakeaways": [
      "Manacher's algorithm interleaves '#' separators so every odd and even palindrome becomes odd-length, and reflects i across the center of the rightmost palindrome [L, R] to run in O(N) time.",
      "Every string of length N contains at most N distinct non-empty palindromic substrings because any shorter palindromic suffix at index i is reflected into an earlier occurrence by the longest palindromic suffix.",
      "An Eertree (Palindromic Automaton) uses two roots (len = -1 and len = 0) and suffix links between palindromes to count distinct palindromes and their exact frequencies in O(N) time."
    ],
    "furtherReading": [
      {
        "title": "Manacher (1975) — A New Linear-Time 'On-Line' Algorithm for Finding the Smallest Initial Palindrome (JACM)",
        "url": "https://doi.org/10.1145/321892.321896"
      },
      {
        "title": "Rubinchik & Shur (2015) — EERTREE: An Efficient Data Structure for Processing Palindromes in Strings",
        "url": "https://arxiv.org/abs/1506.04862"
      },
      {
        "title": "CP-Algorithms — Manacher's Algorithm & Palindromic Tree (Eertree)",
        "url": "https://cp-algorithms.com/string/manacher.html"
      }
    ]
  },
  "case-ripgrep-teddy-simd": {
    "title": "Production Case Study: Why ripgrep Is So Fast (Aho-Corasick, Boyer-Moore & SIMD Teddy)",
    "video": {
      "youtubeId": "3da43227b6w",
      "title": "Why ripgrep Is Fast — Regex Literal Extraction & SIMD Acceleration",
      "channel": "Systems Engineering Lectures",
      "duration": "21:15",
      "start": 0,
      "length": 1275,
      "why": "Examines how Andrew Gallant's ripgrep extracts literal prefixes from ASTs and dispatches them to AVX2 packed-pair and Teddy shuffle masks before running the regex automaton."
    },
    "intuition": "<p>When you run <code>rg \"(ERR|WARN|FATAL)_SOCKET_[0-9]{4}\"</code> over a 10 GB log directory, why does Andrew Gallant's <code>ripgrep</code> finish in 80 milliseconds while naive regular expression engines take several seconds? Because <code>ripgrep</code> refuses to feed 10 GB of raw bytes through a finite automaton one byte at a time. Instead, its regex compiler parses the abstract syntax tree (AST), extracts required literal prefixes ($\\{\\texttt{\"ERR\\_SOCKET\\_\"}, \\texttt{\"WARN\\_SOCKET\\_\"}, \\texttt{\"FATAL\\_SOCKET\\_\"}\\}$), and hands those literals to a vectorized SIMD prefilter that rejects 99.99% of the file at memory-bandwidth speeds ($> 15\\text{ GB/s}$ per core).</p><p>Depending on whether the literal set contains one string, a small set of 2–64 strings, or thousands of strings, <code>ripgrep</code> dynamically selects between Packed-Pair SIMD (<code>memchr::memmem</code>), the <strong>SIMD Teddy</strong> nibble-lookup multi-pattern algorithm (originally invented for Intel's Hyperscan), or a contiguous DFA Aho-Corasick automaton— invoking the full Thompson/DFA regex verifier only on the rare lines where a literal candidate hits.</p>",
    "content": `<div class="lesson-content">
<h3>1. Architecture of a High-Throughput Search Pipeline</h3>
<p>A production code/log search tool (<code>ripgrep</code>, <code>GNU grep</code>, Intel <code>Hyperscan</code>) is structured as a multi-stage funnel designed to keep the inner loop purely vectorized and branch-free:</p>
<ol>
  <li><strong>AST Literal Extraction:</strong> Given a regex $R$, the compiler analyzes the syntax tree to extract a small set of required prefix or inner literals $L(R)$. For example, <code>\\b(?:foo|bar)_baz\\d+</code> yields the exact prefix set $\\{\\texttt{\"foo\\_baz\"}, \\texttt{\"bar\\_baz\"}\\}$ (or their common suffix $\\texttt{\"\\_baz\"}$).</li>
  <li><strong>Prefilter Selection:</strong>
    <ul>
      <li><strong>$|L| = 1$ (Single Literal):</strong> Dispatches to Packed-Pair SIMD (<code>_mm256_cmpeq_epi8</code> on the two rarest bytes in the literal, inspired by Horspool's guard byte) with a Two-Way linear-time verifier.</li>
      <li><strong>$2 \\le |L| \\le 64$ (Small Multi-Pattern):</strong> Dispatches to <strong>SIMD Teddy</strong>, which uses the SSSE3/AVX2 in-register parallel table lookup instruction <code>pshufb</code> / <code>vpshufb</code> (<code>_mm256_shuffle_epi8</code>) on the low and high 4-bit nibbles of each text byte to test up to 8 pattern buckets across 32 byte positions simultaneously.</li>
      <li><strong>$|L| > 64$ (Large Multi-Pattern):</strong> Dispatches to an <strong>Aho-Corasick</strong> automaton (using a contiguous precomputed byte-transition table near the root and compact transitions deeper in the trie).</li>
    </ul>
  </li>
  <li><strong>Line-Boundary Expansion &amp; Regex Verification:</strong> Only when the SIMD prefilter flags a match at byte offset $k$ does <code>ripgrep</code> scan backward/forward for the enclosing <code>'\\n'</code> bytes and run the full lazy-DFA / Thompson NFA on that single line.</li>
</ol>

<h3>2. Inside SIMD Teddy: Nibble Bitmasks via <code>vpshufb</code></h3>
<p>How can a CPU test whether 32 text bytes match <em>any</em> of 8 arbitrary characters in just a few instructions? An AVX2 <code>_mm256_cmpeq_epi8</code> only compares against <em>one</em> broadcast byte. Teddy exploits the fact that <code>_mm256_shuffle_epi8(table, index)</code> treats each half of a 256-bit register as a 16-entry lookup table indexed by the lower 4 bits ($0..15$) of each byte in <code>index</code>!</p>
<ul>
  <li>Each byte $b \\in [0, 255]$ is split into its low nibble $b_{\\text{lo}} = b \\mathbin{\\&} \\text{0x0F} \\in [0, 15]$ and high nibble $b_{\\text{hi}} = (b \\gg 4) \\mathbin{\\&} \\text{0x0F} \\in [0, 15]$.</li>
  <li>We group our patterns into 8 buckets $0..7$ (one bit per bucket in a uint8 mask). For pattern prefix byte $p$ in bucket $k$, we set bit $k$ in <code>table_lo[p &amp; 0x0F]</code> and bit $k$ in <code>table_hi[p &gt;&gt; 4]</code>.</li>
  <li>At runtime, for 32 input bytes $T[i..i+31]$, two parallel shuffles compute <code>res = _mm256_and_si256(shuffle(table_lo, T_lo), shuffle(table_hi, T_hi))</code>. Byte lane $j$ of <code>res</code> has bit $k$ set if and only if $T[i+j]$ matches both the low nibble and high nibble of a pattern in bucket $k$! Doing this across the first 2 or 3 bytes of each pattern (with shifted alignment <code>alignr</code>) eliminates almost all false positives before leaving SIMD registers.</li>
</ul>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Prefilter Engine</th>
      <th>Sweet Spot ($K$ Patterns)</th>
      <th>Throughput (AVX2 Core)</th>
      <th>Worst-Case Guarantee</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Packed-Pair SIMD + Two-Way</td>
      <td>$K = 1$</td>
      <td>$15\\text{–}25\\text{ GB/s}$</td>
      <td>$O(N + M)$ strict linear</td>
    </tr>
    <tr>
      <td>SIMD Teddy (1–3 byte fingerprint)</td>
      <td>$2 \\le K \\le 64$</td>
      <td>$8\\text{–}16\\text{ GB/s}$</td>
      <td>$O(N / 32)$ scan + bucket verify</td>
    </tr>
    <tr>
      <td>Aho-Corasick Contiguous DFA</td>
      <td>$K > 64$ (up to $10^5$)</td>
      <td>$0.8\\text{–}1.5\\text{ GB/s}$</td>
      <td>$O(N + Z)$ strict linear</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Prefilter Zero-False-Negative Soundness Invariant</div>
  <p>A literal prefilter $F$ for regex $R$ must satisfy a one-sided soundness contract: every text substring matching $R$ MUST contain at least one occurrence of some literal $w \\in L(R)$ (zero false negatives). False positives (where a literal $w \\in L(R)$ appears on a line that does not match the full regex $R$) are permissible for correctness and affect only performance; the full DFA/NFA verifier filters them out.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Why Boyer-Moore Loop Skips Lose to SIMD on Short Patterns</div>
  <p>Wait—doesn't Boyer-Moore skip $M$ bytes at a time? On a 6-character pattern ($M = 6$), scalar Boyer-Moore skips ~5 bytes per iteration, but each iteration executes a data-dependent memory load and branch (<code>s += shift[T[s + M - 1]]</code>), limiting throughput to ~1 iteration per 2–3 clock cycles (~2 bytes/cycle). AVX2 Packed-Pair or Teddy inspects <strong>32 bytes every 1–2 cycles</strong> (~16–32 bytes/cycle) with predictable linear hardware prefetching and zero data-dependent branches until a match occurs. Scalar Boyer-Moore only beats SIMD when $M$ is very large ($M > 64$) and the rare guard bytes occur frequently.</p>
</div>

<h3>3. Visual Trace: SIMD Teddy Nibble-Mask Lookup (<code>vpshufb</code>)</h3>
<svg viewBox="0 0 760 215" width="100%" height="215" role="img" aria-label="SIMD Teddy low and high nibble parallel lookup via vpshufb">
  <style>
    .td-box { fill: #1e293b; stroke: #64748b; stroke-width: 1.5; rx: 6; }
    .td-hi { fill: #1e1b4b; stroke: #818cf8; stroke-width: 1.5; rx: 6; }
    .td-hit { fill: #064e3b; stroke: #34d399; stroke-width: 1.5; rx: 6; }
    .td-txt { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #f8fafc; text-anchor: middle; }
    .td-sub { font-family: 'Inter', sans-serif; font-size: 11px; fill: #94a3b8; text-anchor: middle; }
    .td-arr { stroke: #94a3b8; stroke-width: 1.5; fill: none; }
  </style>
  <rect width="760" height="215" fill="#0f172a" rx="8"/>

  <!-- Input 32 bytes -->
  <rect x="20" y="75" width="150" height="60" class="td-box"/>
  <text x="95" y="100" class="td-txt">32 Text Bytes T</text>
  <text x="95" y="120" class="td-sub">e.g. 'E' = 0x45</text>

  <!-- Low and High Nibble Split -->
  <rect x="215" y="25" width="165" height="55" class="td-hi"/>
  <text x="297" y="48" class="td-txt">Lo Nibble (T &amp; 0x0F)</text>
  <text x="297" y="66" class="td-sub">0x05 -&gt; vpshufb(LUT_lo)</text>

  <rect x="215" y="130" width="165" height="55" class="td-hi"/>
  <text x="297" y="153" class="td-txt">Hi Nibble (T &gt;&gt; 4)</text>
  <text x="297" y="171" class="td-sub">0x04 -&gt; vpshufb(LUT_hi)</text>

  <line x1="170" y1="95" x2="215" y2="52" class="td-arr"/>
  <line x1="170" y1="115" x2="215" y2="157" class="td-arr"/>

  <!-- Bitwise AND of Bucket Masks -->
  <rect x="425" y="75" width="145" height="60" class="td-box"/>
  <text x="497" y="100" class="td-txt">vpand (Lo &amp; Hi)</text>
  <text x="497" y="120" class="td-sub">32x 8-bit Bucket Masks</text>

  <line x1="380" y1="52" x2="425" y2="95" class="td-arr"/>
  <line x1="380" y1="157" x2="425" y2="115" class="td-arr"/>

  <!-- Multi-byte shift & movemask -->
  <rect x="605" y="65" width="135" height="80" class="td-hit"/>
  <text x="672" y="92" class="td-txt">pos0 &amp; pos1</text>
  <text x="672" y="112" class="td-txt">vpmovmskb</text>
  <text x="672" y="132" class="td-sub">Verify Buckets</text>

  <line x1="570" y1="105" x2="605" y2="105" class="td-arr"/>
</svg>

<div class="mermaid">
flowchart LR
  A["Regex AST: (ERR|WARN|FATAL)_SOCKET_[0-9]{4}"] --> B["Literal Extractor: 3 Prefixes"]
  B --> C{"Count &amp; Length Heuristic"}
  C -- "K = 1" --> D["Packed-Pair SIMD"]
  C -- "2 &lt;= K &lt;= 64" --> E["SIMD Teddy (vpshufb)"]
  C -- "K &gt; 64" --> F["Aho-Corasick DFA"]
  D --> G{"Candidate Byte Offset Hit?"}
  E --> G
  F --> G
  G -- "99.99% No" --> H["Advance 32B Vector Window"]
  G -- "Rare Yes" --> I["Find Line Bounds &amp; Run Lazy DFA Verifier"]
</div>

<div class="simulator-mount" data-sim="sim-rabin-karp-rolling-hash"></div>

<h3>4. Reference Implementation: Teddy Nibble-Mask Matcher</h3>
<pre><code class="language-cpp">#include &lt;array&gt;
#include &lt;cstdint&gt;
#include &lt;cstring&gt;
#include &lt;string_view&gt;
#include &lt;vector&gt;

// Portable 2-byte Teddy Nibble Fingerprint Engine (models vpshufb bucket filtering)
class Teddy2BytePrefilter {
public:
    // Up to 8 patterns (1 bit per pattern bucket in uint8_t mask)
    explicit Teddy2BytePrefilter(const std::vector&lt;std::string_view&gt;&amp; patterns)
        : patterns_(patterns) {
        lut_lo_[0].fill(0); lut_hi_[0].fill(0);
        lut_lo_[1].fill(0); lut_hi_[1].fill(0);
        for (size_t b = 0; b &lt; patterns.size() &amp;&amp; b &lt; 8; ++b) {
            uint8_t bit = static_cast&lt;uint8_t&gt;(1u &lt;&lt; b);
            for (size_t pos = 0; pos &lt; 2; ++pos) {
                uint8_t ch = static_cast&lt;uint8_t&gt;(patterns[b][pos]);
                lut_lo_[pos][ch &amp; 0x0F] |= bit;
                lut_hi_[pos][ch &gt;&gt; 4]   |= bit;
            }
        }
    }

    // Scans text and returns (offset, pattern_id) matches
    std::vector&lt;std::pair&lt;size_t, size_t&gt;&gt; find_all(std::string_view text) const {
        std::vector&lt;std::pair&lt;size_t, size_t&gt;&gt; hits;
        if (text.size() &lt; 2) return hits;

        uint8_t prev_m0 = 0;
        for (size_t i = 0; i &lt; text.size(); ++i) {
            uint8_t b = static_cast&lt;uint8_t&gt;(text[i]);
            // Parallel nibble table lookup (in AVX2: 2x _mm256_shuffle_epi8 + _mm256_and_si256)
            uint8_t m0 = lut_lo_[0][b &amp; 0x0F] &amp; lut_hi_[0][b &gt;&gt; 4];
            uint8_t m1 = lut_lo_[1][b &amp; 0x0F] &amp; lut_hi_[1][b &gt;&gt; 4];

            // Bucket bit k is set in <code>cand</code> iff text[i-1] matched pos 0 AND text[i] matched pos 1
            uint8_t cand = prev_m0 &amp; m1;
            prev_m0 = m0;

            while (cand != 0) {
                int bucket = __builtin_ctz(cand);
                cand &amp;= static_cast&lt;uint8_t&gt;(cand - 1);
                size_t start = i - 1;
                std::string_view pat = patterns_[bucket];
                if (start + pat.size() &lt;= text.size() &amp;&amp;
                    std::memcmp(text.data() + start, pat.data(), pat.size()) == 0) {
                    hits.emplace_back(start, static_cast&lt;size_t&gt;(bucket));
                }
            }
        }
        return hits;
    }

private:
    std::vector&lt;std::string_view&gt; patterns_;
    std::array&lt;std::array&lt;uint8_t, 16&gt;, 2&gt; lut_lo_{};
    std::array&lt;std::array&lt;uint8_t, 16&gt;, 2&gt; lut_hi_{};
};</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">When Literal Prefilters Backfire: Common Prefixes &amp; High Hit Rates</div>
  <p>Suppose a user searches for <code>\"e[0-9]{6}\"</code> in English prose. The literal extractor extracts the single-byte prefix <code>\"e\"</code>, which occurs roughly every 8 bytes in English text! Entering and exiting the SIMD prefilter only to fail inside the DFA verifier every 8 bytes is <em>slower</em> than running the DFA directly due to function-call and state-reload overhead. Production engines like <code>ripgrep</code> and <code>regex</code> track the empirical false-positive rate of the prefilter at runtime (or score literals by byte rarity at compile time) and dynamically disable the prefilter if it triggers too frequently.</p>
</div>
</div>`,
    "keyTakeaways": [
      "ripgrep achieves multi-gigabyte-per-second search speeds by extracting required literal prefixes/substrings from the regex AST and scanning with SIMD prefilters before invoking the regex automaton.",
      "SIMD Teddy splits each text byte into low and high 4-bit nibbles and uses vpshufb (_mm256_shuffle_epi8) as a 16-entry parallel lookup table to test 8 pattern buckets across 32 bytes per cycle.",
      "Prefilters must guarantee zero false negatives and monitor false-positive rates so common literals (like 'e' or ' ') do not thrash between the SIMD scanner and the regex verifier."
    ],
    "furtherReading": [
      {
        "title": "Andrew Gallant (BurntSushi) — ripgrep is faster than {grep, ag, git grep, ucg, pt, sift}",
        "url": "https://blog.burntsushi.net/ripgrep/"
      },
      {
        "title": "Wang et al. (2019) — Hyperscan: A Fast Multi-Pattern Regex Matcher for Modern CPUs (NSDI)",
        "url": "https://github.com/intel/hyperscan"
      },
      {
        "title": "BurntSushi/aho-corasick — Teddy SIMD Multi-Substring Implementation Notes",
        "url": "https://github.com/BurntSushi/aho-corasick/tree/master/src/packed/teddy"
      }
    ]
  },
  "build-aho-corasick-scanner": {
    "title": "Build Lab: Multi-Pattern Aho-Corasick Automaton with Overlapping Match Streamer",
    "video": {
      "youtubeId": "O7_w001f58c",
      "title": "Implementing the Aho-Corasick Automaton from Scratch",
      "channel": "Pavel Mavrin",
      "duration": "24:10",
      "start": 600,
      "length": 850,
      "why": "Covers the exact arena implementation details for wiring go[u][c], fail[u], and terminal exit links in a single BFS pass."
    },
    "intuition": "<p>In this Build Lab, we assemble a production-grade, streaming <strong>Multi-Pattern Aho-Corasick Scanner</strong> capable of ingesting arbitrary 64 KB network chunks or log buffers and emitting every overlapping match $(i_{\\text{start}},\\; i_{\\text{end}},\\; \\text{pattern\\_id})$ in strict $O(N + Z)$ worst-case time. Unlike textbook snippets that require the entire text to sit in a single contiguous string or restrict the alphabet to 26 lowercase letters, a real scanner must preserve automaton state $u$ and global byte offset across chunk boundaries.</p><p>We will also solve the <strong>duplicate-pattern and substring-shadowing problem</strong>: when a ruleset contains identical patterns with different rule IDs or patterns that are suffixes of longer patterns (such as $\\texttt{\"sql\"}$, $\\texttt{\"psql\"}$, and $\\texttt{\"mysql\"}$), we chain same-node pattern IDs via a compact linked list inside the pattern table so each node stores only three 32-bit integers alongside its transition table.</p>",
    "content": `<div class="lesson-content">
<h3>1. Engineering Specifications for a Streaming Scanner</h3>
<p>To make our Aho-Corasick engine suitable for intrusion detection, log redaction, or DLP (Data Loss Prevention) pipelines, we enforce four architectural invariants:</p>
<ol>
  <li><strong>Zero-Allocation Streaming State (<code>ScannerCursor</code>):</strong> The compiled <code>AhoCorasickAutomaton</code> is immutable and thread-safe (<code>const</code>), so 64 worker threads can share a single compiled dictionary while each stream maintains a tiny 16-byte <code>ScannerCursor { int32_t state; uint64_t bytes_seen; }</code>.</li>
  <li><strong>Constant-Size Node Layout via Intrusive Pattern Lists:</strong> Storing a <code>std::vector&lt;int&gt;</code> inside every Trie node wastes 24 bytes of heap-vector header per state even when 95% of states are non-terminal. Instead, each node stores a single <code>int32_t first_pat = -1</code>, and we store <code>next_pat_at_same_node[pat_id]</code> in a flat array of size $K$.</li>
  <li><strong>Exact Start &amp; End Offset Calculation:</strong> Because matches can span across chunk boundaries (e.g., $\\texttt{\" Drop\"}$ at the end of Chunk 1 and $\\texttt{\"Table\"}$ at the start of Chunk 2), the cursor tracks <code>bytes_seen</code>, and when pattern <code>pid</code> of length $L_{\\text{pid}}$ matches at global byte index <code>pos</code>, its exact start offset is <code>pos + 1 - L_pid</code>.</li>
  <li><strong>Compressed Output Links (<code>exit_link</code>):</strong> During BFS, we set <code>exit_link[u]</code> to <code>fail[u]</code> if <code>nodes[fail[u]].first_pat != -1</code>, and to <code>exit_link[fail[u]]</code> otherwise.</li>
</ol>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Component / Operation</th>
      <th>Time Complexity</th>
      <th>Space Overhead</th>
      <th>Thread-Safety / Streaming</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>add_pattern(pat)</code></td>
      <td>$O(|P_i|)$</td>
      <td>$1$ int per pattern in linked list</td>
      <td>Builder phase (mutable)</td>
    </tr>
    <tr>
      <td><code>freeze()</code> (BFS DFA Build)</td>
      <td>$O(\\text{states} \\cdot |\\Sigma|)$</td>
      <td>Zero heap pointers per node</td>
      <td>Produces immutable DFA</td>
    </tr>
    <tr>
      <td><code>scan_chunk(cursor, bytes, cb)</code></td>
      <td>$O(|\\text{chunk}| + Z_{\\text{chunk}})$</td>
      <td>$O(1)$ ($16$-byte cursor)</td>
      <td>Lock-free across threads &amp; chunks</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Cross-Chunk State Continuity Invariant</div>
  <p>Let $T = C_1 \\mathbin{\\|} C_2 \\mathbin{\\|} \\dots \\mathbin{\\|} C_m$ be a stream partitioned into arbitrary byte chunks. Because $u_{i+1} = \\text{go}[u_i][T[i]]$ depends only on $u_i$ and $T[i]$, carrying <code>cursor.state</code> and <code>cursor.bytes_seen</code> from the end of $C_k$ into the start of $C_{k+1}$ visits the exact same sequence of states $u_1, u_2, \\dots, u_N$ and emits the exact same set of matches $(i_{\\text{start}}, i_{\\text{end}}, \\text{pid})$ as scanning the concatenated string $T$ in one buffer.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Replacing Per-Node std::vector with Intrusive Pattern Chains</div>
  <p>A <code>std::vector&lt;int&gt;</code> inside every <code>Node</code> adds 24 bytes of struct overhead plus a separate heap allocation for every terminal state, scattering terminal pattern lists across memory pages. Storing <code>int32_t first_pat</code> in <code>Node</code> (4 bytes) and <code>int32_t next_pat[K]</code> in a single flat array of length $K$ eliminates all per-node heap allocations and cuts terminal match traversal to sequential array reads.</p>
</div>

<h3>2. Architecture Diagram: Immutable DFA + Streaming Cursor</h3>
<svg viewBox="0 0 760 195" width="100%" height="195" role="img" aria-label="Streaming Aho-Corasick architecture across chunk boundaries">
  <style>
    .sc-box { fill: #1e293b; stroke: #64748b; stroke-width: 1.5; rx: 6; }
    .sc-dfa { fill: #1e1b4b; stroke: #818cf8; stroke-width: 1.5; rx: 6; }
    .sc-hit { fill: #064e3b; stroke: #34d399; stroke-width: 1.5; rx: 6; }
    .sc-txt { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #f8fafc; text-anchor: middle; }
    .sc-sub { font-family: 'Inter', sans-serif; font-size: 11px; fill: #94a3b8; text-anchor: middle; }
  </style>
  <rect width="760" height="195" fill="#0f172a" rx="8"/>

  <rect x="20" y="30" width="210" height="58" class="sc-box"/>
  <text x="125" y="54" class="sc-txt">Chunk 1: "GET /admin/p"</text>
  <text x="125" y="74" class="sc-sub">Ends in state u = "p" (offset 12)</text>

  <rect x="20" y="110" width="210" height="58" class="sc-box"/>
  <text x="125" y="134" class="sc-txt">Chunk 2: "sql?id=1"</text>
  <text x="125" y="154" class="sc-sub">Resumes from cursor.state = u</text>

  <rect x="275" y="55" width="220" height="90" class="sc-dfa"/>
  <text x="385" y="82" class="sc-txt">Immutable DFA Arena</text>
  <text x="385" y="104" class="sc-sub">go[u][c] + exit_link[u]</text>
  <text x="385" y="124" class="sc-sub">first_pat[u] -&gt; next_pat[pid]</text>

  <rect x="540" y="55" width="200" height="90" class="sc-hit"/>
  <text x="640" y="82" class="sc-txt">Overlapping Emissions</text>
  <text x="640" y="104" class="sc-sub">Match "psql" [11..15)</text>
  <text x="640" y="124" class="sc-sub">Match "sql"  [12..15)</text>

  <line x1="230" y1="60" x2="275" y2="85" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="230" y1="138" x2="275" y2="115" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="495" y1="100" x2="540" y2="100" stroke="#34d399" stroke-width="1.8"/>
</svg>

<div class="mermaid">
flowchart LR
  A["Read byte b = chunk[i]"] --> B["cursor.state = go[cursor.state][b]"]
  B --> C["cur = (first_pat[state] != -1) ? state : exit_link[state]"]
  C --> D{"cur != 0?"}
  D -- "Yes" --> E["Walk pid = first_pat[cur] via next_pat[pid]; emit (end - len[pid], end, pid)"]
  E --> F["cur = exit_link[cur]"]
  F --> D
  D -- "No" --> G["cursor.bytes_seen++; advance i"]
</div>

<div class="simulator-mount" data-sim="sim-aho-corasick-trie"></div>

<h3>3. Complete Build Implementation: Streaming Aho-Corasick Engine</h3>
<pre><code class="language-cpp">#include &lt;array&gt;
#include &lt;cstdint&gt;
#include &lt;queue&gt;
#include &lt;string_view&gt;
#include &lt;vector&gt;

struct MatchEvent {
    uint64_t start_offset; // Inclusive global byte offset
    uint64_t end_offset;   // Exclusive global byte offset
    int32_t pattern_id;
};

struct ScannerCursor {
    int32_t state = 0;
    uint64_t bytes_seen = 0;
};

class StreamingAhoCorasick {
public:
    struct Node {
        std::array&lt;int32_t, 256&gt; go{};
        int32_t fail = 0;
        int32_t exit_link = 0;
        int32_t first_pat = -1; // Head of intrusive linked list of pattern IDs
    };

    StreamingAhoCorasick() { nodes_.emplace_back(); }

    int32_t add_pattern(std::string_view pat) {
        int32_t pid = static_cast&lt;int32_t&gt;(pat_len_.size());
        pat_len_.push_back(static_cast&lt;uint32_t&gt;(pat.size()));

        int32_t u = 0;
        for (unsigned char c : pat) {
            if (nodes_[u].go[c] == 0) {
                nodes_[u].go[c] = static_cast&lt;int32_t&gt;(nodes_.size());
                nodes_.emplace_back();
            }
            u = nodes_[u].go[c];
        }
        // Prepend <code>pid</code> to node u's intrusive pattern list
        next_pat_.push_back(nodes_[u].first_pat);
        nodes_[u].first_pat = pid;
        return pid;
    }

    void freeze() {
        std::queue&lt;int32_t&gt; q;
        for (int c = 0; c &lt; 256; ++c) {
            int32_t v = nodes_[0].go[c];
            if (v != 0) {
                nodes_[v].fail = 0;
                q.push(v);
            }
        }
        while (!q.empty()) {
            int32_t u = q.front();
            q.pop();
            int32_t f = nodes_[u].fail;
            nodes_[u].exit_link = (nodes_[f].first_pat != -1) ? f : nodes_[f].exit_link;

            for (int c = 0; c &lt; 256; ++c) {
                int32_t v = nodes_[u].go[c];
                if (v != 0) {
                    nodes_[v].fail = nodes_[f].go[c];
                    q.push(v);
                } else {
                    nodes_[u].go[c] = nodes_[f].go[c];
                }
            }
        }
        frozen_ = true;
    }

    template &lt;typename Callback&gt;
    void scan_chunk(ScannerCursor&amp; cursor, std::string_view chunk, Callback&amp;&amp; on_match) const {
        int32_t u = cursor.state;
        uint64_t pos = cursor.bytes_seen;

        for (unsigned char c : chunk) {
            u = nodes_[u].go[c];
            ++pos; // <code>pos</code> is now the exclusive end offset of any match ending here

            int32_t term = (nodes_[u].first_pat != -1) ? u : nodes_[u].exit_link;
            while (term != 0) {
                for (int32_t pid = nodes_[term].first_pat; pid != -1; pid = next_pat_[pid]) {
                    on_match(MatchEvent{pos - pat_len_[pid], pos, pid});
                }
                term = nodes_[term].exit_link;
            }
        }
        cursor.state = u;
        cursor.bytes_seen = pos;
    }

private:
    std::vector&lt;Node&gt; nodes_;
    std::vector&lt;uint32_t&gt; pat_len_;
    std::vector&lt;int32_t&gt; next_pat_;
    bool frozen_ = false;
};</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Unsigned Byte Casting &amp; Empty-Pattern Guards</div>
  <p>In C and C++, <code>char</code> is signed on x86_64 and ARM Linux/macOS targets ($-128..127$). Indexing <code>nodes_[u].go[ch]</code> directly with a signed <code>char</code> on UTF-8 or binary payloads causes out-of-bounds negative array indexing whenever a byte has its high bit set ($\ge \text{0x80}$)! Always cast to <code>unsigned char</code> or <code>uint8_t</code> before indexing the transition table, and reject or handle empty patterns ($|P_i| = 0$) before insertion so root state $0$ never becomes a terminal state (since our output loop terminates on <code>term != 0</code>).</p>
</div>
</div>`,
    "keyTakeaways": [
      "Decoupling the immutable Aho-Corasick DFA arena from a 16-byte ScannerCursor (state + bytes_seen) allows thread-safe, zero-allocation streaming across arbitrary chunk boundaries.",
      "Replacing per-node std::vector<int> pattern lists with an intrusive linked list (first_pat[u] + next_pat[pid]) eliminates heap allocations inside states and handles duplicate patterns cleanly.",
      "Always index 256-entry transition tables using uint8_t / unsigned char and keep root state 0 non-terminal so the exit_link loop terminates at 0."
    ],
    "furtherReading": [
      {
        "title": "Aho & Corasick (1975) — Efficient String Matching: An Aid to Bibliographic Search (CACM)",
        "url": "https://doi.org/10.1145/360825.360855"
      },
      {
        "title": "BurntSushi/aho-corasick — Streaming Search and Contiguous DFA Design in Rust",
        "url": "https://github.com/BurntSushi/aho-corasick"
      }
    ]
  }
};
