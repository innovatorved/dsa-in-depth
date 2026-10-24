window.MODULE_CONTENT = window.MODULE_CONTENT || {};
window.MODULE_CONTENT["m08"] = {
  "tree-rotations-avl-invariants": {
    title: "Tree Rotations & AVL Trees: Balance Factors, LL/RR/LR/RL Rebalancing & Fibonacci Height Bound",
    video: {
      youtubeId: "FNeL18KsWPc",
      title: "MIT 6.006 Lecture 6: AVL Trees and AVL Sort",
      channel: "MIT OpenCourseWare",
      duration: "51:44",
      start: 0,
      length: "52m",
      why: "Erik Demaine derives AVL balance invariants, the 4 rotation cases, and the Fibonacci-tree worst-case height recurrence."
    },
    intuition: "<p>How can you alter the height of a Binary Search Tree in $O(1)$ pointer assignments without ever violating its global sorted In-Order sequence? The universal primitive of all self-balancing binary trees is the <strong>tree rotation</strong> (<code>rotateLeft</code> and <code>rotateRight</code>). For any edge $(x, y)$ where $y = x.\\text{right}$, we can partition the local subtree into $x$, $y$, and three open subtrees $\\alpha &lt; x &lt; \\beta &lt; y &lt; \\gamma$. Promoting $y$ above $x$ and handing the middle subtree $\\beta$ from $y.\\text{left}$ across to $x.\\text{right}$ preserves the exact In-Order sequence $\\alpha, x, \\beta, y, \\gamma$ while decreasing the depth of $\\gamma$ by $1$ and increasing the depth of $\\alpha$ by $1$.</p><p>Invented in 1962 by Georgy Adelson-Velsky and Evgenii Landis, the <strong>AVL Tree</strong> is the oldest self-balancing BST. By enforcing that every node's left and right subtree heights differ by at most $1$ ($|\\text{bf}(u)| = |h(u.\\text{left}) - h(u.\\text{right})| \\le 1$), an AVL tree guarantees a worst-case height of $h &lt; 1.4404 \\log_2(N + 2)$—making it significantly shallower and faster for read-heavy lookup workloads than Red-Black Trees ($h \\le 2 \\log_2(N + 1)$).</p>",
    content: `<div class="lesson-content">
      <h2>Local Algebra of Rotations &amp; The Four AVL Rebalancing Cases</h2>
      <p>Define the height of a <code>null</code> subtree as $-1$ and a leaf as $0$, so $h(u) = 1 + \\max(h(u.\\text{left}), h(u.\\text{right}))$. The <strong>balance factor</strong> is $\\text{bf}(u) = h(u.\\text{left}) - h(u.\\text{right}) \\in \\{-1, 0, +1\\}$. When an insertion or deletion pushes $\\text{bf}(z)$ to $+2$ (left-heavy) or $-2$ (right-heavy) at the lowest unbalanced ancestor $z$, let $y$ be the taller child of $z$ and $x$ be the taller child of $y$:</p>
      <ul>
        <li><strong>Left-Left (LL, Outer):</strong> $\\text{bf}(z) = +2$ and $\\text{bf}(y) \\ge 0$. A single <code>rotateRight(z)</code> restores balance and reduces the subtree height by $1$.</li>
        <li><strong>Right-Right (RR, Outer):</strong> $\\text{bf}(z) = -2$ and $\\text{bf}(y) \\le 0$. A single <code>rotateLeft(z)</code> restores balance.</li>
        <li><strong>Left-Right (LR, Inner Zig-Zag):</strong> $\\text{bf}(z) = +2$ and $\\text{bf}(y) = -1$. A single right rotation on $z$ fails because the heavy grandchild $x = y.\\text{right}$ stays at the same depth! We must perform a <strong>double rotation</strong>: <code>rotateLeft(y)</code> followed by <code>rotateRight(z)</code>, lifting $x$ to the root of the subtree.</li>
        <li><strong>Right-Left (RL, Inner Zig-Zag):</strong> $\\text{bf}(z) = -2$ and $\\text{bf}(y) = +1$. Execute <code>rotateRight(y)</code> followed by <code>rotateLeft(z)</code>.</li>
      </ul>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>AVL Operation</th>
            <th>Time Complexity</th>
            <th>Max Rotations (Worst-Case)</th>
            <th>Height / Comparison Bound</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>search(key)</code></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td>0</td>
            <td>$\\le 1.4404 \\log_2(N + 2) - 0.328$</td>
          </tr>
          <tr>
            <td><code>insert(key)</code></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-o1">≤ 1 Single or 1 Double (2 rots)</span></td>
            <td>Subtree height returns to pre-insert value!</td>
          </tr>
          <tr>
            <td><code>erase(key)</code></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-ologn">O(log N) Rotations Up Spine</span></td>
            <td>At most 1 rotation per ancestor level</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Fibonacci Tree Extremal Proof: Why $h &lt; 1.4404 \\log_2(N + 2)$</h4>
        <p>What is the <em>minimum</em> number of nodes $N_h$ required to construct a valid AVL tree of height $h$? To minimize nodes at height $h$, the root must have one subtree of height $h - 1$ and the other of height $h - 2$ (the maximum legal imbalance). By induction:</p>
        <p>$$N_0 = 1, \\quad N_1 = 2, \\quad N_h = 1 + N_{h-1} + N_{h-2}$$</p>
        <p>Adding $1$ to both sides yields $(N_h + 1) = (N_{h-1} + 1) + (N_{h-2} + 1)$, which is the exact Fibonacci recurrence! Since $N_0 + 1 = 2 = F_3$ and $N_1 + 1 = 3 = F_4$, we have the exact identity:</p>
        <p>$$N \\ge N_h = F_{h+3} - 1 &gt; \\frac{\\phi^{h+3}}{\\sqrt{5}} - 2 \\implies h &lt; \\frac{1}{\\log_2 \\phi} \\log_2(N + 2) - 0.3277 \\approx 1.4404 \\log_2(N + 2)$$</p>
        <p><strong>Crucial Insert vs. Delete Asymmetry:</strong> On AVL <code>insert</code>, the first unbalanced ancestor $z$ had height $k+1$ before insertion, grew to $k+2$, and after 1 single or double rotation shrinks back to $k+1$—so <strong>at most 1 rebalancing event ever occurs on insertion</strong>! On AVL <code>delete</code>, shrinking $z$ from $k+2$ to $k+1$ via rotation reduces the subtree's height as seen by $z$'s parent, which can cascade $O(\\log N)$ rotations all the way to the root.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-avl-red-black-tree"></div>

      <svg viewBox="0 0 720 235" width="100%" height="235" role="img" aria-label="AVL Left-Right (LR) Double Rotation lifting inner grandchild x above y and z">
        <defs>
          <style>
            .av-edge { stroke: #475569; stroke-width: 2; }
            .av-node { fill: #0f172a; stroke: #38bdf8; stroke-width: 2; }
            .av-hot { fill: #064e3b; stroke: #10b981; stroke-width: 2.2; }
            .av-warn { fill: #450a0a; stroke: #ef4444; stroke-width: 2.2; }
            .av-lbl { fill: #f8fafc; font-family: monospace; font-size: 13px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
            .av-txt { fill: #cbd5e1; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <text class="av-txt" x="20" y="24" fill="#f87171">1. LR Imbalance: bf(z)=+2, bf(y)=-1</text>
        <line class="av-edge" x1="130" y1="55" x2="70" y2="115"/>
        <line class="av-edge" x1="70" y1="115" x2="115" y2="175"/>
        <circle class="av-warn" cx="130" cy="55" r="18"/><text class="av-lbl" x="130" y="55">z</text>
        <circle class="av-node" cx="70" cy="115" r="18"/><text class="av-lbl" x="70" y="115">y</text>
        <circle class="av-hot" cx="115" cy="175" r="18"/><text class="av-lbl" x="115" y="175">x</text>

        <text class="av-txt" x="255" y="24" fill="#fbbf24">2. rotateLeft(y) → LL Shape</text>
        <line class="av-edge" x1="360" y1="55" x2="310" y2="115"/>
        <line class="av-edge" x1="310" y1="115" x2="265" y2="175"/>
        <circle class="av-warn" cx="360" cy="55" r="18"/><text class="av-lbl" x="360" y="55">z</text>
        <circle class="av-hot" cx="310" cy="115" r="18"/><text class="av-lbl" x="310" y="115">x</text>
        <circle class="av-node" cx="265" cy="175" r="18"/><text class="av-lbl" x="265" y="175">y</text>

        <text class="av-txt" x="485" y="24" fill="#4ade80">3. rotateRight(z) → Balanced!</text>
        <line class="av-edge" x1="585" y1="70" x2="525" y2="140"/>
        <line class="av-edge" x1="585" y1="70" x2="645" y2="140"/>
        <circle class="av-hot" cx="585" cy="70" r="19"/><text class="av-lbl" x="585" y="70">x</text>
        <circle class="av-node" cx="525" cy="140" r="18"/><text class="av-lbl" x="525" y="140">y</text>
        <circle class="av-node" cx="645" cy="140" r="18"/><text class="av-lbl" x="645" y="140">z</text>
        <text class="av-txt" x="485" y="195">In-Order Preserved: α &lt; y &lt; β₁ &lt; x &lt; β₂ &lt; z &lt; γ</text>
        <text class="av-txt" x="20" y="218" fill="#38bdf8">Extremal Fibonacci Recurrence: N_h = 1 + N_{h-1} + N_{h-2} = F_{h+3} - 1 ⇒ h &lt; 1.4404 log₂(N+2)</text>
      </svg>

      <div class="mermaid">
flowchart TD
  Check["Update height(u); bf = height(u.L) - height(u.R)"] --> Cases{"|bf| <= 1 ?"}
  Cases -- "Yes" --> Done["Balanced: return u"]
  Cases -- "bf == +2 (Left Heavy)" --> LCheck{"bf(u.L) < 0 ?"}
  LCheck -- "No (LL Case)" --> LL["return rotateRight(u)"]
  LCheck -- "Yes (LR Case)" --> LR["u.L = rotateLeft(u.L)\nreturn rotateRight(u)"]
  Cases -- "bf == -2 (Right Heavy)" --> RCheck{"bf(u.R) > 0 ?"}
  RCheck -- "No (RR Case)" --> RR["return rotateLeft(u)"]
  RCheck -- "Yes (RL Case)" --> RL["u.R = rotateRight(u.R)\nreturn rotateLeft(u)"]
      </div>

      <div class="hardware-box">
        <h4>Hardware Reality: Storing <code>uint8_t height</code> vs 2-Bit Balance Factor in Pointer Low Bits</h4>
        <p>Because $h &lt; 1.44 \\log_2(2^{64}) \\approx 92$ for any tree that can ever fit in a 64-bit address space, storing a <code>uint8_t height</code> field requires only 1 byte. Better yet, because 64-bit heap allocations are at least 8-byte aligned, the lowest 3 bits of <code>node->parent</code> are always zero (<code>0b000</code>). Production C libraries (like <code>libavl</code>) pack the 2-bit balance factor $\\text{bf} \\in \\{-1, 0, +1\\}$ directly into the low 2 bits of the parent pointer, achieving <strong>zero bytes of structural alignment padding</strong>!</p>
      </div>

      <h2>Implementation: Clean AVL Rotations &amp; Rebalance Engine</h2>
      <pre><code class="language-cpp">// C++20: Self-Balancing AVL Tree Core with LL, RR, LR, RL Rebalancing
#include &lt;algorithm&gt;
#include &lt;cstdint&gt;

struct AVLNode {
    int key;
    int32_t height = 0; // Leaf has height 0; nullptr has height -1
    AVLNode *left = nullptr, *right = nullptr;
    explicit AVLNode(int k) : key(k) {}
};

inline int32_t h(const AVLNode* n) noexcept { return n ? n-&gt;height : -1; }
inline int32_t bf(const AVLNode* n) noexcept { return n ? (h(n-&gt;left) - h(n-&gt;right)) : 0; }
inline void pullHeight(AVLNode* n) noexcept { n-&gt;height = 1 + std::max(h(n-&gt;left), h(n-&gt;right)); }

AVLNode* rotateRight(AVLNode* z) noexcept {
    AVLNode* y = z-&gt;left;
    z-&gt;left = y-&gt;right;
    y-&gt;right = z;
    pullHeight(z); // Must update lower node z BEFORE new root y!
    pullHeight(y);
    return y;
}

AVLNode* rotateLeft(AVLNode* z) noexcept {
    AVLNode* y = z-&gt;right;
    z-&gt;right = y-&gt;left;
    y-&gt;left = z;
    pullHeight(z);
    pullHeight(y);
    return y;
}

AVLNode* rebalance(AVLNode* u) noexcept {
    pullHeight(u);
    int32_t balance = bf(u);
    if (balance &gt; 1) { // Left-heavy (+2)
        if (bf(u-&gt;left) &lt; 0) u-&gt;left = rotateLeft(u-&gt;left); // LR -> LL
        return rotateRight(u);
    }
    if (balance &lt; -1) { // Right-heavy (-2)
        if (bf(u-&gt;right) &gt; 0) u-&gt;right = rotateRight(u-&gt;right); // RL -> RR
        return rotateLeft(u);
    }
    return u;
}</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Updating Heights in the Wrong Order After Rotation:</strong> Inside <code>rotateRight(z)</code> (which lifts $y = z.\\text{left}$ above $z$), $z$ becomes the child of $y$. If you call <code>pullHeight(y)</code> before <code>pullHeight(z)</code>, $y$ computes its new height using $z$'s stale pre-rotation height, corrupting every ancestor's balance factor! Always recompute the demoted child $z$ first, then the promoted parent $y$.</li>
          <li><strong>Strict Equality Trap on Deletion Rebalancing (<code>bf(u->left) >= 0</code>):</strong> When <code>bf(u) == +2</code> after a deletion in $u.\\text{right}$, <code>bf(u->left)</code> can be $0$ (unlike insertion where it is strictly $+1$ or $-1$). When <code>bf(u->left) == 0</code>, a <strong>single</strong> <code>rotateRight(u)</code> suffices; treating <code>0</code> as an LR double rotation performs unnecessary work.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "Tree rotations (rotateLeft / rotateRight) rearrange local parent-child pointers in O(1) time while strictly preserving the global In-Order sequence α < x < β < y < γ.",
      "AVL Trees enforce |h(left) - h(right)| <= 1 at every node; extremal worst-case AVL trees (Fibonacci Trees) satisfy N_h = 1 + N_{h-1} + N_{h-2} = F_{h+3} - 1, bounding height to < 1.4404 log₂(N + 2).",
      "Outer imbalances (LL, RR) are fixed by a single rotation; inner zig-zag imbalances (LR, RL) require a double rotation that lifts the inner grandchild to the subtree root.",
      "AVL insertion requires at most 1 rebalancing event (≤ 2 rotations total), whereas AVL deletion can cascade O(log N) rotations up to the root."
    ],
    furtherReading: [
      { title: "Adelson-Velsky, G. M. & Landis, E. M. (1962): An Algorithm for the Organization of Information (Soviet Math. Doklady)", url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html" },
      { title: "Knuth, TAOCP Vol. 3 §6.2.3: Balanced Trees (AVL Trees & Fibonacci Height Proof)", url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html" }
    ]
  },

  "red-black-llrb-isomorphism": {
    title: "2-3-4 Trees, Red-Black Trees & Sedgewick's Left-Leaning Red-Black (LLRB) Isomorphism",
    video: {
      youtubeId: "qvZGUFHWChY",
      title: "Left-Leaning Red-Black Trees — Robert Sedgewick (Princeton Lecture)",
      channel: "ComputerHistory / Princeton",
      duration: "54:12",
      start: 0,
      length: "54m",
      why: "Robert Sedgewick explains how Guibas & Sedgewick (1978) derived Red-Black Trees from 2-3-4 B-trees and how LLRB trees reduce implementation to 3 lines of rotation/flip code."
    },
    intuition: "<p>Why do textbook Red-Black Tree implementations span 400 lines of intricate uncle/grandparent case analysis? Because they present Red-Black Trees as an arbitrary set of four color rules divorced from their true origin! In 1978, Leo Guibas and Robert Sedgewick introduced Red-Black Trees as a <strong>binary-tree encoding of a perfectly balanced 2-3-4 B-Tree</strong>: every Red link is simply an <em>internal horizontal glue edge</em> binding 2 or 3 keys together into a single logical 3-node or 4-node, while every Black link is a vertical child edge of the 2-3-4 tree.</p><p>In 2008, Sedgewick perfected this bijection with <strong>Left-Leaning Red-Black (LLRB) 2-3 Trees</strong>: by requiring that every 3-node lean exclusively to the left, there is a <strong>strict $1$-to-$1$ isomorphism</strong> between 2-3 trees and LLRB trees, and the entire insertion rebalancing logic collapses into three 3-line local operations: <code>rotateLeft</code> (fix right-leaning red link), <code>rotateRight</code> (fix two consecutive left red links), and <code>flipColors</code> (split a temporary 4-node)!</p>",
    content: `<div class="lesson-content">
      <h2>The Four Classical Red-Black Invariants &amp; The 2-3-4 B-Tree Bijection</h2>
      <p>In a standard Red-Black Tree (CLRS Chapter 13), every node (or incoming parent link) is colored either <strong>Red</strong> or <strong>Black</strong> subject to four invariants:</p>
      <ol>
        <li><strong>Root Rule:</strong> The root is always Black.</li>
        <li><strong>External Leaf Rule:</strong> Every <code>null</code> leaf sentinel is Black.</li>
        <li><strong>Red Rule (No Red-Red Parent-Child):</strong> If a node is Red, both of its children are Black.</li>
        <li><strong>Black-Height Rule (Perfect 2-3-4 Balance):</strong> Every simple path from any node $u$ down to any descendant <code>null</code> leaf contains the <strong>exact same number of Black nodes</strong>, denoted $\\text{bh}(u)$ (the <em>black-height</em>).</li>
      </ol>
      <p><strong>Sedgewick's Left-Leaning (LLRB 2-3) Simplification:</strong> If we forbid 4-nodes from persisting at rest and force every 3-node's red glue edge to lean left, then right-leaning red links are illegal and two consecutive left-leaning red links represent a temporary 4-node awaiting a split (<code>flipColors</code>). Every LLRB insertion ascending the recursion stack runs the exact same 3 <code>if</code>-statements:</p>
      <ol>
        <li><code>if (isRed(h.right) &amp;&amp; !isRed(h.left)) h = rotateLeft(h);</code> — Lean a right-leaning 3-node to the left.</li>
        <li><code>if (isRed(h.left) &amp;&amp; isRed(h.left.left)) h = rotateRight(h);</code> — Balance a skewed temporary 4-node so its two children are both red.</li>
        <li><code>if (isRed(h.left) &amp;&amp; isRed(h.right)) flipColors(h);</code> — Split the temporary 4-node into two 2-nodes and pass the middle key up to the parent as a red link!</li>
      </ol>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Metric / Operation</th>
            <th>Red-Black Tree (Standard 2-3-4)</th>
            <th>LLRB Tree (2-3 Isomorphism)</th>
            <th>AVL Tree Comparison</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Worst-Case Height $h(T)$</td>
            <td><span class="badge-ologn">≤ 2 log₂(N + 1)</span></td>
            <td><span class="badge-ologn">≤ 2 log₂(N + 1)</span></td>
            <td>AVL is tighter: $\\le 1.44 \\log_2(N+2)$</td>
          </tr>
          <tr>
            <td><code>insert(k)</code> Rotations</td>
            <td><span class="badge-o1">≤ 2 Rotations Worst-Case</span></td>
            <td><span class="badge-ologn">O(log N) Worst / O(1) Avg</span></td>
            <td>AVL: $\\le 2$ rotations worst-case</td>
          </tr>
          <tr>
            <td><code>delete(k)</code> Rotations</td>
            <td><span class="badge-o1">≤ 3 Rotations Worst-Case!</span></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td>AVL: $O(\\log N)$ rotations</td>
          </tr>
          <tr>
            <td>Fixup Complexity (Amortized)</td>
            <td><span class="badge-o1">O(1) Recolors + Rotations</span></td>
            <td><span class="badge-o1">O(1) Amortized Splits</span></td>
            <td>Standard RB wins on write-heavy workloads</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Lemma: Why a Red-Black Tree of $N$ Internal Nodes Has Height $h \\le 2 \\log_2(N + 1)$</h4>
        <p><strong>Step 1 (Subtree Size Lower Bound via Black-Height):</strong> By induction on black-height $\\text{bh}(x)$, the subtree rooted at any node $x$ contains at least $2^{\\text{bh}(x)} - 1$ internal nodes. Base case: if $\\text{bh}(x) = 0$, $x$ is a <code>null</code> leaf with $2^0 - 1 = 0$ internal nodes. Inductive step: for an internal node $x$, each child $c$ has black-height either $\\text{bh}(x)$ (if $c$ is Red) or $\\text{bh}(x) - 1$ (if $c$ is Black). By the Inductive Hypothesis, each child subtree has at least $2^{\\text{bh}(x)-1} - 1$ nodes, so:</p>
        <p>$$\\text{size}(x) \\ge 1 + 2\\left(2^{\\text{bh}(x)-1} - 1\\right) = 2^{\\text{bh}(x)} - 1$$</p>
        <p><strong>Step 2 (Relating $h$ to $\\text{bh}(\\text{root})$):</strong> By the Red Rule (no two consecutive Red nodes on any path), at least half of the nodes along any root-to-leaf path of length $h$ must be Black: $\\text{bh}(\\text{root}) \\ge h / 2$. Substituting into Step 1:</p>
        <p>$$N \\ge 2^{\\text{bh}(\\text{root})} - 1 \\ge 2^{h/2} - 1 \\implies 2^{h/2} \\le N + 1 \\implies h \\le 2 \\log_2(N + 1)$$</p>
      </div>

      <div class="simulator-mount" data-sim="sim-avl-red-black-tree"></div>

      <svg viewBox="0 0 720 225" width="100%" height="225" role="img" aria-label="Bijection between 2-3-4 Tree nodes and LLRB Red-Black links">
        <defs>
          <style>
            .rb-blk { stroke: #94a3b8; stroke-width: 2.2; }
            .rb-red { stroke: #ef4444; stroke-width: 3.2; }
            .rb-nd { fill: #0f172a; stroke: #94a3b8; stroke-width: 2; }
            .rb-rnd { fill: #450a0a; stroke: #ef4444; stroke-width: 2.2; }
            .rb-lbl { fill: #f8fafc; font-family: monospace; font-size: 13px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
            .rb-txt { fill: #cbd5e1; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <text class="rb-txt" x="20" y="24" fill="#38bdf8">1. 2-3 Tree 3-Node [E | M]  ⟷  LLRB Left-Leaning Red Edge:</text>
        <rect x="35" y="45" width="90" height="36" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text class="rb-lbl" x="80" y="63">E  |  M</text>
        <text class="rb-lbl" x="155" y="63">⟷</text>
        <line class="rb-red" x1="255" y1="48" x2="205" y2="95"/>
        <circle class="rb-nd" cx="255" cy="48" r="17"/><text class="rb-lbl" x="255" y="48">M</text>
        <circle class="rb-rnd" cx="205" cy="95" r="17"/><text class="rb-lbl" x="205" y="95">E</text>

        <text class="rb-txt" x="355" y="24" fill="#fbbf24">2. Temporary 4-Node [E | M | S]  →  flipColors(M):</text>
        <line class="rb-red" x1="440" y1="60" x2="395" y2="110"/>
        <line class="rb-red" x1="440" y1="60" x2="485" y2="110"/>
        <circle class="rb-nd" cx="440" cy="60" r="17"/><text class="rb-lbl" x="440" y="60">M</text>
        <circle class="rb-rnd" cx="395" cy="110" r="17"/><text class="rb-lbl" x="395" y="110">E</text>
        <circle class="rb-rnd" cx="485" cy="110" r="17"/><text class="rb-lbl" x="485" y="110">S</text>

        <text class="rb-lbl" x="535" y="85">→</text>
        <line class="rb-red" x1="625" y1="28" x2="625" y2="60"/>
        <line class="rb-blk" x1="625" y1="60" x2="580" y2="110"/>
        <line class="rb-blk" x1="625" y1="60" x2="670" y2="110"/>
        <circle class="rb-rnd" cx="625" cy="60" r="17"/><text class="rb-lbl" x="625" y="60">M</text>
        <circle class="rb-nd" cx="580" cy="110" r="17"/><text class="rb-lbl" x="580" y="110">E</text>
        <circle class="rb-nd" cx="670" cy="110" r="17"/><text class="rb-lbl" x="670" y="110">S</text>

        <text class="rb-txt" x="20" y="160" fill="#4ade80">LLRB 3-Step Bottom-Up Invariant Restoration:</text>
        <text class="rb-txt" x="20" y="183">Step 1: if (red(h.R) &amp;&amp; !red(h.L)) h = rotateLeft(h);    // Fix right-leaning red</text>
        <text class="rb-txt" x="20" y="205">Step 2: if (red(h.L) &amp;&amp; red(h.L.L)) h = rotateRight(h);  // Fix double-left red</text>
        <text class="rb-txt" x="425" y="205">Step 3: if (red(h.L) &amp;&amp; red(h.R)) flipColors(h);</text>
      </svg>

      <div class="mermaid">
flowchart LR
  Ins["Recursive insert into h.L or h.R"] --> S1{"isRed(h.R) AND\n!isRed(h.L) ?"}
  S1 -- "Yes" --> RL["h = rotateLeft(h)"] --> S2
  S1 -- "No" --> S2{"isRed(h.L) AND\nisRed(h.L.L) ?"}
  S2 -- "Yes" --> RR["h = rotateRight(h)"] --> S3
  S2 -- "No" --> S3{"isRed(h.L) AND\nisRed(h.R) ?"}
  S3 -- "Yes" --> Flip["flipColors(h)\n(Split 4-node)"] --> Ret["return h"]
  S3 -- "No" --> Ret
      </div>

      <div class="hardware-box">
        <h4>Hardware Reality: Why <code>std::map</code>, Java <code>TreeMap</code>, and Linux <code>rbtree</code> Choose Red-Black Over AVL</h4>
        <p>If AVL trees are shorter ($1.44 \\log_2 N$ vs $2.00 \\log_2 N$), why do C++ <code>std::map</code>, Java <code>TreeMap</code>, and the Linux kernel use standard Red-Black Trees instead? Because in a standard Red-Black Tree, <strong>insertion requires at most 2 rotations and deletion requires at most 3 rotations in the worst case</strong> (compared to $O(\\log N)$ rotations for AVL deletion!). In concurrent or persistent environments where each rotation modifies cache lines or copies nodes along the spine, bounding structural pointer mutations to $O(1)$ worst-case rotations is decisive.</p>
      </div>

      <h2>Implementation: Complete Sedgewick LLRB Insertion Engine</h2>
      <pre><code class="language-cpp">// C++20: Sedgewick Left-Leaning Red-Black (LLRB) Tree Insertion in 45 Lines
struct LLRBNode {
    int key;
    bool red = true; // New nodes are always inserted with a RED incoming link
    LLRBNode *left = nullptr, *right = nullptr;
    explicit LLRBNode(int k) : key(k) {}
};

inline bool isRed(const LLRBNode* x) noexcept { return x != nullptr &amp;&amp; x-&gt;red; }

LLRBNode* rotateLeft(LLRBNode* h) noexcept {
    LLRBNode* x = h-&gt;right;
    h-&gt;right = x-&gt;left;
    x-&gt;left = h;
    x-&gt;red = h-&gt;red;
    h-&gt;red = true;
    return x;
}

LLRBNode* rotateRight(LLRBNode* h) noexcept {
    LLRBNode* x = h-&gt;left;
    h-&gt;left = x-&gt;right;
    x-&gt;right = h;
    x-&gt;red = h-&gt;red;
    h-&gt;red = true;
    return x;
}

void flipColors(LLRBNode* h) noexcept {
    h-&gt;red = !h-&gt;red;
    h-&gt;left-&gt;red = !h-&gt;left-&gt;red;
    h-&gt;right-&gt;red = !h-&gt;right-&gt;red;
}

LLRBNode* insertNode(LLRBNode* h, int key) {
    if (!h) return new LLRBNode(key);
    if (key &lt; h-&gt;key)      h-&gt;left  = insertNode(h-&gt;left, key);
    else if (key &gt; h-&gt;key) h-&gt;right = insertNode(h-&gt;right, key);

    // The 3-line LLRB invariant restoration pipeline:
    if (isRed(h-&gt;right) &amp;&amp; !isRed(h-&gt;left))     h = rotateLeft(h);
    if (isRed(h-&gt;left)  &amp;&amp; isRed(h-&gt;left-&gt;left)) h = rotateRight(h);
    if (isRed(h-&gt;left)  &amp;&amp; isRed(h-&gt;right))      flipColors(h);
    return h;
}</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Forgetting to Force <code>root->red = false</code> After Insertion:</strong> When <code>flipColors</code> splits the root of the entire tree, <code>root->red</code> flips to <code>true</code> (which corresponds to growing the 2-3 tree upward by 1 black level). Always set <code>root->red = false</code> at the top-level <code>insert(key)</code> wrapper!</li>
          <li><strong>LLRB Deletion Asymmetry vs Standard RB Deletion:</strong> While LLRB insertion is 15 lines of code, LLRB deletion (<code>moveRedLeft</code> / <code>moveRedRight</code>) must push red links downward top-down to guarantee the target leaf is not a 2-node, performing $O(\\log N)$ rotations on the way down and up, whereas classical CLRS Red-Black deletion performs at most 3 rotations.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "Red-Black Trees are an exact binary representation of 2-3-4 B-trees where Red edges glue keys horizontally inside a single 3-node or 4-node and Black edges represent vertical B-tree child links.",
      "Every node x of black-height bh(x) roots a subtree of at least 2^bh(x) - 1 internal nodes; combined with bh(root) >= h/2, this proves height h <= 2 log₂(N + 1).",
      "Classical Red-Black Trees require at most 2 rotations on insert and at most 3 rotations on delete in the worst case.",
      "Sedgewick's Left-Leaning Red-Black (LLRB) Tree enforces a 1-to-1 bijection with 2-3 trees, reducing bottom-up rebalancing to rotateLeft, rotateRight, and flipColors."
    ],
    furtherReading: [
      { title: "Sedgewick, R. (2008): Left-Leaning Red-Black Trees (Princeton University Technical Report)", url: "https://sedgewick.io/wp-content/themes/sedgewick/papers/2008LLRB.pdf" },
      { title: "Guibas, L. J. & Sedgewick, R. (1978): A Dichromatic Framework for Balanced Trees (IEEE FOCS)", url: "https://doi.org/10.1109/SFCS.1978.3" },
      { title: "CLRS Introduction to Algorithms (4th Ed.) — Chapter 13: Red-Black Trees", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
    ]
  },

  "treaps-split-merge-paradigm": {
    title: "Randomized Treaps & Implicit Treaps: Rebalancing Without Rotations via split and merge",
    video: {
      youtubeId: "6x0UlIBLRsc",
      title: "Treaps and Implicit Treaps (Split & Merge Paradigm)",
      channel: "Algorithms Live!",
      duration: "38:24",
      start: 0,
      length: "38m",
      why: "Matt Fontaine demonstrates how split and merge replace rotations and how Implicit Treaps support O(log N) subarray reversal and range cuts."
    },
    intuition: "<p>We proved in Module 07 that if keys are inserted in a uniformly random permutation, a plain BST has expected depth $1.386 \\log_2 N$ and expected height $O(\\log N)$. What if an adversary feeds keys in sorted order online? In 1989, Cecilia Aragon and Raimund Seidel invented the <strong>Treap (Tree + Heap)</strong>: assign each node a 64-bit uniformly random priority $p(u)$ upon creation, and maintain <strong>BST order on keys $k(u)$ simultaneously with Max-Heap order on priorities $p(u)$</strong>!</p><p>By the uniqueness theorem of Cartesian Trees (Vuillemin 1980), for any set of nodes with distinct keys and distinct priorities, there exists <strong>one and only one</strong> binary tree that is simultaneously a BST on keys and a Heap on priorities—namely, the exact BST that would be produced if the keys were inserted in decreasing order of their random priorities! Even better, in 1998 Guy Blelloch and Margaret Reid-Miller showed that we can discard rotations entirely and express every operation using two 10-line functional primitives: <code>split(T, k)</code> and <code>merge(L, R)</code>.</p>",
    content: `<div class="lesson-content">
      <h2>The <code>split</code> and <code>merge</code> Paradigm &amp; Implicit Treaps (Dynamic Rope Arrays)</h2>
      <p>Instead of bottom-up rotations, every Treap operation reduces to two recursive primitives that run in $O(\\log N)$ expected time:</p>
      <ul>
        <li><strong><code>split(T, key) -&gt; (L, R)</code>:</strong> Partitions Treap $T$ into two valid Treaps: $L$ (all nodes with key $\\le \\text{key}$) and $R$ (all nodes with key $&gt; \\text{key}$). If $T.\\text{key} \\le \\text{key}$, then $T$ and all of $T.\\text{left}$ belong to $L$; we recursively split $T.\\text{right}$ into $(T.\\text{right}, R)$ and return $(T, R)$. Symmetric when $T.\\text{key} &gt; \\text{key}$.</li>
        <li><strong><code>merge(L, R) -&gt; T</code>:</strong> Combines two Treaps $L$ and $R$ under the precondition that <strong>every key in $L$ is strictly $\\le$ every key in $R$</strong> ($\max(L) \\le \\min(R)$). Whichever root has the higher random priority ($L.\\text{prio} &gt; R.\\text{prio}$) becomes the combined root, and we recursively merge its right child with $R$ (or $L$ with $R.\\text{left}$).</li>
      </ul>
      <p>With <code>split</code> and <code>merge</code>, every dictionary and sequence operation is a 2-line composition:</p>
      <ul>
        <li><strong><code>insert(T, newNode)</code>:</strong> <code>(L, R) = split(T, newNode.key); return merge(merge(L, newNode), R);</code></li>
        <li><strong><code>erase(T, key)</code>:</strong> <code>(L, M) = split(T, key - 1); (Target, R) = split(M, key); return merge(L, R);</code></li>
        <li><strong>Implicit Treap (Index-Keyed Sequence / Rope):</strong> Drop explicit keys altogether! Maintain only subtree sizes $\\text{sz}(u) = 1 + \\text{sz}(u.\\text{left}) + \\text{sz}(u.\\text{right})$. Now a node's 0-based array index in the current subtree is simply $\\text{sz}(u.\\text{left})$! Calling <code>splitBySize(T, k)</code> cuts an array of length $N$ at position $k$ in $O(\\log N)$ time, enabling $O(\\log N)$ arbitrary range cut-and-paste, range reversal (via a lazy <code>bool rev</code> bit that swaps children), and range sum/min queries!</li>
      </ul>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Treap / Implicit Treap Operation</th>
            <th>Expected Time</th>
            <th>High-Probability Bound</th>
            <th>Equivalent <code>split</code>/<code>merge</code> Composition</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>split(T, k)</code> / <code>merge(L, R)</code></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td>$\\le c \\log_2 N$ w.p. $1 - N^{-c}$</td>
            <td>Fundamental recursive primitives</td>
          </tr>
          <tr>
            <td><code>insert(k)</code> / <code>erase(k)</code></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td>$\\le c \\log_2 N$ w.p. $1 - N^{-c}$</td>
            <td>1 <code>split</code> + 2 <code>merge</code>s (or 2 <code>split</code>s + 1 <code>merge</code>)</td>
          </tr>
          <tr>
            <td>Implicit Array Range Reverse / Cut-Paste $[l, r]$</td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td>$\\le c \\log_2 N$ w.p. $1 - N^{-c}$</td>
            <td>Split into $[0..l-1], [l..r], [r+1..N-1]$, toggle lazy bit, merge!</td>
          </tr>
          <tr>
            <td>Set Union / Intersection of Two Treaps $(M \\le N)$</td>
            <td><span class="badge-onlogn">O(M log(N/M))</span></td>
            <td>Optimal information-theoretic bound</td>
            <td>Divide-and-conquer <code>split</code> by higher-priority root</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Cartesian Tree Uniqueness Theorem (Aragon &amp; Seidel, 1989)</h4>
        <p>Given $N$ nodes $(k_i, p_i)$ with distinct keys $k_i$ and distinct priorities $p_i$, why is the Treap topology <strong>100% independent of insertion order</strong>? Because:</p>
        <ol>
          <li>By the Max-Heap property on priorities, the root of any non-empty subset $S$ <strong>must</strong> be the unique element $u^* = \\arg\\max_{u \\in S} p(u)$.</li>
          <li>By the BST property on keys, the left subtree must contain $S_{&lt;} = \\{u \\in S : k(u) &lt; k(u^*)\\}$ and the right subtree must contain $S_{&gt;} = \\{u \\in S : k(u) &gt; k(u^*)\\}$.</li>
        </ol>
        <p>By induction on $|S|$, the tree is uniquely determined and is identical to inserting the keys in decreasing order of $p_i$. Since $p_i$ are independent uniform random variables, their rank order is a uniformly random permutation $\\pi \\in S_N$—forcing $\\mathbb{E}[\\text{depth}] = 2 \\ln N \\approx 1.386 \\log_2 N$ even when an attacker inserts keys in sorted order $1, 2, \\dots, N$!</p>
      </div>

      <div class="simulator-mount" data-sim="sim-treap-splay-tree"></div>

      <svg viewBox="0 0 720 225" width="100%" height="225" role="img" aria-label="Treap split and merge operations preserving BST key order and Heap priority order">
        <defs>
          <style>
            .tr-edge { stroke: #475569; stroke-width: 2; }
            .tr-cut { stroke: #ef4444; stroke-width: 2.2; stroke-dasharray: 5 4; fill: none; }
            .tr-node { fill: #0f172a; stroke: #38bdf8; stroke-width: 2; }
            .tr-r { fill: #311042; stroke: #a855f7; stroke-width: 2; }
            .tr-lbl { fill: #f8fafc; font-family: monospace; font-size: 11.5px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
            .tr-txt { fill: #cbd5e1; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <text class="tr-txt" x="20" y="24" fill="#38bdf8">Treap Node (Key | Priority): BST on Key, Max-Heap on Priority</text>
        <line class="tr-edge" x1="170" y1="55" x2="95" y2="120"/>
        <line class="tr-edge" x1="170" y1="55" x2="245" y2="120"/>
        <line class="tr-edge" x1="95" y1="120" x2="55" y2="185"/>
        <line class="tr-edge" x1="95" y1="120" x2="140" y2="185"/>
        <path class="tr-cut" d="M 190 35 L 120 120 L 165 205"/>

        <circle class="tr-r" cx="170" cy="55" r="22"/><text class="tr-lbl" x="170" y="55">10|95</text>
        <circle class="tr-node" cx="95" cy="120" r="22"/><text class="tr-lbl" x="95" y="120">4|80</text>
        <circle class="tr-r" cx="245" cy="120" r="22"/><text class="tr-lbl" x="245" y="120">15|72</text>
        <circle class="tr-node" cx="55" cy="185" r="20"/><text class="tr-lbl" x="55" y="185">2|40</text>
        <circle class="tr-r" cx="140" cy="185" r="20"/><text class="tr-lbl" x="140" y="185">7|61</text>

        <text class="tr-txt" x="320" y="45" fill="#f87171">╌╌ split(T, key = 6) → (L: keys ≤ 6, R: keys &gt; 6)</text>
        <text class="tr-txt" x="320" y="75">• At (10|95): 10 &gt; 6 ⇒ (10|95) and right child go to R;</text>
        <text class="tr-txt" x="320" y="98">  recursively split left child (4|80) at key = 6</text>
        <text class="tr-txt" x="320" y="125">• At (4|80):  4 ≤ 6  ⇒ (4|80) and left child go to L;</text>
        <text class="tr-txt" x="320" y="148">  recursively split right child (7|61) at key = 6</text>
        <text class="tr-txt" x="320" y="180" fill="#4ade80">Implicit Treap: replace key with leftSize = sz(u.left)</text>
        <text class="tr-txt" x="320" y="203" fill="#4ade80">⇒ O(log N) Subarray Cut/Paste/Reverse on dynamic arrays!</text>
      </svg>

      <div class="mermaid">
flowchart TD
  M["merge(L, R)\nPrecondition: max(L) <= min(R)"] --> Base{"L == null OR R == null ?"}
  Base -- "Yes" --> RetBase["return L ? L : R"]
  Base -- "No" --> Prio{"L.prio > R.prio ?"}
  Prio -- "Yes (L wins root)" --> LWin["L.right = merge(L.right, R)\npull(L); return L"]
  Prio -- "No (R wins root)" --> RWin["R.left = merge(L, R.left)\npull(R); return R"]
      </div>

      <div class="hardware-box">
        <h4>Hardware Reality: Fast PRNGs (<code>SplitMix64</code> / <code>xorshift64*</code>) Inside Node Constructors</h4>
        <p>Never call <code>std::random_device</code> (which traps into the OS kernel <code>/dev/urandom</code> or <code>RDRAND</code>) or instantiate a $2.5\\text{ KB}$ <code>std::mt19937</code> state object per node! A single static 64-bit <code>SplitMix64</code> or <code>xorshift64*</code> state variable generates uniformly distributed 64-bit priorities in <strong>1.2 nanoseconds (3 ALU instructions: shift, XOR, multiply)</strong> with zero branches and zero probability of priority collisions for $N \le 10^8$.</p>
      </div>

      <h2>Implementation: Implicit Treap with $O(\\log N)$ Range Reversal (<code>split</code> + <code>merge</code>)</h2>
      <pre><code class="language-cpp">// C++20: Implicit Treap supporting O(log N) Subarray Reversal [l, r] via split &amp; merge
#include &lt;cstdint&gt;
#include &lt;utility&gt;

struct ImplicitTreapNode {
    int val;
    uint64_t prio;
    int sz = 1;
    bool rev = false; // Lazy range-reversal tag
    ImplicitTreapNode *l = nullptr, *r = nullptr;

    ImplicitTreapNode(int v, uint64_t p) : val(v), prio(p) {}
};

inline int size(const ImplicitTreapNode* t) noexcept { return t ? t-&gt;sz : 0; }

inline void pull(ImplicitTreapNode* t) noexcept {
    if (t) t-&gt;sz = 1 + size(t-&gt;l) + size(t-&gt;r);
}

inline void pushLazy(ImplicitTreapNode* t) noexcept {
    if (t &amp;&amp; t-&gt;rev) {
        std::swap(t-&gt;l, t-&gt;r);
        if (t-&gt;l) t-&gt;l-&gt;rev ^= true;
        if (t-&gt;r) t-&gt;r-&gt;rev ^= true;
        t-&gt;rev = false;
    }
}

// Splits T into L (first k elements) and R (remaining N - k elements)
std::pair&lt;ImplicitTreapNode*, ImplicitTreapNode*&gt; splitBySize(ImplicitTreapNode* t, int k) {
    if (!t) return {nullptr, nullptr};
    pushLazy(t);
    int leftCount = size(t-&gt;l);
    if (k &lt;= leftCount) {
        auto [L, R] = splitBySize(t-&gt;l, k);
        t-&gt;l = R;
        pull(t);
        return {L, t};
    } else {
        auto [L, R] = splitBySize(t-&gt;r, k - leftCount - 1);
        t-&gt;r = L;
        pull(t);
        return {t, R};
    }
}

ImplicitTreapNode* merge(ImplicitTreapNode* L, ImplicitTreapNode* R) {
    if (!L || !R) return L ? L : R;
    pushLazy(L);
    pushLazy(R);
    if (L-&gt;prio &gt; R-&gt;prio) {
        L-&gt;r = merge(L-&gt;r, R);
        pull(L);
        return L;
    } else {
        R-&gt;l = merge(L, R-&gt;l);
        pull(R);
        return R;
    }
}

// Reverses contiguous subarray [l, r] (0-indexed inclusive) in O(log N) expected time
ImplicitTreapNode* reverseRange(ImplicitTreapNode* root, int l, int r) {
    auto [t1, t23] = splitBySize(root, l);
    auto [t2, t3]  = splitBySize(t23, r - l + 1);
    if (t2) t2-&gt;rev ^= true;
    return merge(t1, merge(t2, t3));
}</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Violating <code>merge(L, R)</code> Precondition ($\max(L) \le \min(R)$):</strong> <code>merge(L, R)</code> is NOT a general set-union operation—it strictly requires that every key in $L$ is $\le$ every key in $R$! Calling <code>merge</code> on overlapping key ranges silently destroys the BST invariant. (To union two overlapping Treaps in $O(M \log(N/M))$, split the lower-priority root's tree by the higher-priority root's key and recursively union both sides.)</li>
          <li><strong>Using 16-Bit <code>std::rand()</code> on Windows (<code>RAND_MAX = 32767</code>):</strong> On MSVC/Windows, C's <code>rand()</code> only returns a 15-bit integer ($0 \dots 32767$). In a Treap of $N = 10^5$ nodes, thousands of nodes collide on the exact same priority, causing subtree degeneration! Always use a 64-bit PRNG (<code>mt19937_64</code> or <code>SplitMix64</code>).</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "A Treap assigns each node a random priority and enforces BST order on keys and Max-Heap order on priorities, guaranteeing the exact distribution of a Randomly Built BST regardless of input order.",
      "Every Treap operation can be implemented without rotations using two O(log N) primitives: split(T, key) and merge(L, R) (where max(L) <= min(R)).",
      "An Implicit Treap replaces explicit keys with dynamic subtree sizes sz(u.left), turning a balanced BST into a dynamic array supporting O(log N) insert, delete, cut-and-paste, and range reversal.",
      "Always generate priorities with a fast 64-bit PRNG (e.g., SplitMix64 or mt19937_64) to prevent birthday-paradox priority collisions."
    ],
    furtherReading: [
      { title: "Seidel, R. & Aragon, C. R. (1996): Randomized Search Trees (Algorithmica, Vol. 16, pp. 464–497)", url: "https://doi.org/10.1007/BF01940876" },
      { title: "CP-Algorithms: Treap and Implicit Treap (Cartesian Tree Split/Merge)", url: "https://cp-algorithms.com/data_structures/treap.html" },
      { title: "Open Data Structures (Pat Morin) — Chapter 7.2: Treap (A Randomized Binary Search Tree)", url: "https://opendatastructures.org/ods-cpp/7_2_Treap_Randomized_Binary.html" }
    ]
  },

  "splay-trees-dynamic-optimality": {
    title: "Splay Trees: Zig-Zig / Zig-Zag Rotations, Amortized O(log N) Potential Proof & Static Optimality",
    video: {
      youtubeId: "G5QIXywcJlY",
      title: "MIT 6.851 Advanced Data Structures Lecture 5: Splay Trees & Dynamic Optimality",
      channel: "MIT OpenCourseWare",
      duration: "1:22:18",
      start: 0,
      length: "82m",
      why: "Erik Demaine proves the Access Lemma using potential Φ = ∑ log₂(size(x)) and explains why naive move-to-root fails while Sleator-Tarjan Zig-Zig succeeds."
    },
    intuition: "<p>Can a Binary Search Tree achieve $O(\\log N)$ amortized time per operation while storing <strong>zero bits of balance metadata</strong> (no AVL heights, no Red-Black color bits, no random Treap priorities) and automatically adapting to skewed temporal/spatial access distributions so that frequently accessed keys sit near the root? In 1985, Daniel Sleator and Robert Tarjan invented the <strong>Splay Tree</strong>, a self-adjusting BST that moves every accessed node $x$ all the way to the root via a sequence of double rotations called <code>splay(x)</code>.</p><p>Why doesn't simply rotating $x$ upward one edge at a time (Alan Allen &amp; Ian Munro's 1978 <em>Move-to-Root</em> heuristic) work? Because rotating $x$ one edge at a time on a skewed chain simply shifts the chain down by 1 without shortening it, leaving worst-case amortized cost at $\\Theta(N)$! Sleator and Tarjan's breakthrough is the <strong>Zig-Zig double rotation</strong>: when $x$ and its parent $p$ are both left children (or both right children) of grandparent $g$, we rotate $p$ with $g$ <em>first</em>, and then $x$ with $p$. This single change halves the depth of every node along the path!</p>",
    content: `<div class="lesson-content">
      <h2>The Three Splaying Steps: Zig, Zig-Zag, and Zig-Zig</h2>
      <p>To splay node $x$ to the root, we repeat two-level steps according to the geometry of $x$, its parent $p$, and its grandparent $g$ until $x$ is the root:</p>
      <ol>
        <li><strong>Zig (Terminal Single Step, $p$ is the root):</strong> Rotate the edge $(p, x)$ once so $x$ becomes the new root. Occurs at most once at the very end of <code>splay(x)</code>.</li>
        <li><strong>Zig-Zag ($x$ and $p$ lean in opposite directions—e.g., $p = g.\\text{left}$ and $x = p.\\text{right}$):</strong> Rotate $x$ above $p$, then rotate $x$ above $g$ (identical to an AVL LR/RL double rotation).</li>
        <li><strong>Zig-Zig ($x$ and $p$ lean in the SAME direction—e.g., $p = g.\\text{left}$ and $x = p.\\text{left}$):</strong> <strong>Rotate $p$ above $g$ FIRST</strong>, and then rotate $x$ above $p$! Notice how this differs from Move-to-Root (which would rotate $x$ above $p$ first and then $x$ above $g$). By rotating $g$ first, $g$ is pushed down two levels, folding the long path in half!</li>
      </ol>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Splay Tree Property / Theorem</th>
            <th>Bound (for $M$ Accesses on $N$ Nodes)</th>
            <th>Physical Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Balance Theorem</strong></td>
            <td><span class="badge-onlogn">O((M + N) log N)</span></td>
            <td>Matches worst-case AVL / Red-Black over any sequence</td>
          </tr>
          <tr>
            <td><strong>Static Optimality Theorem</strong></td>
            <td><span class="badge-ologn">O(M + ∑ q_i log(M / q_i))</span></td>
            <td>Matches optimal static Huffman/Knuth BST (Shannon entropy!)</td>
          </tr>
          <tr>
            <td><strong>Working-Set Theorem</strong></td>
            <td><span class="badge-ologn">O(N log N + ∑ log(t_k + 1))</span></td>
            <td>Accessing the $t$-th most recently used item takes $O(\\log t)$!</td>
          </tr>
          <tr>
            <td><strong>Sequential Access (Tarjan 1985)</strong></td>
            <td><span class="badge-on">O(N) Total (O(1) per item!)</span></td>
            <td>Splaying keys $1, 2, \\dots, N$ in sorted order takes linear time</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Sleator–Tarjan Access Lemma Proof: Why Zig-Zig Releases Potential</h4>
        <p>Define the subtree size $s(u) = |\\text{subtree}(u)|$, the node rank $r(u) = \\lfloor \\log_2 s(u) \\rfloor$, and the tree potential $\\Phi(T) = \\sum_{u \\in T} r(u)$. We prove that the amortized cost of a Zig-Zig or Zig-Zag step lifting $x$ above $p$ and $g$ is bounded by:</p>
        <p>$$\\hat{c}_{\\text{step}} = 2 + r'(x) + r'(p) + r'(g) - r(x) - r(p) - r(g) \\le 3(r'(x) - r(x))$$</p>
        <p>where $r$ and $r'$ denote ranks before and after the double rotation. Observe that after the step, $x$ roots the exact subtree previously rooted at $g$, so $r'(x) = r(g)$, and clearly $r(p) \\ge r(x)$ and $r'(p) \\le r'(x)$. Thus the left side simplifies to $2 + r'(p) + r'(g) - r(x) - r(p) \\le 2 + r'(x) + r'(g) - 2r(x)$. Now comes the magic of <strong>Zig-Zig</strong>: before the step, $x$'s subtree and $g$'s post-rotation subtree are <strong>completely disjoint</strong> inside $g$'s original subtree! Therefore:</p>
        <p>$$s(x) + s'(g) \\le s(g) = s'(x)$$</p>
        <p>By the concavity of $\\log_2$: for any positive $a + b \\le c$, $\\log_2 a + \\log_2 b \\le 2 \\log_2(c/2) = 2 \\log_2 c - 2$. Applying this with $a = s(x), b = s'(g), c = s'(x)$ gives $r(x) + r'(g) \\le 2r'(x) - 2$, so the $+2$ actual rotation cost cancels the $-2$ from concavity:</p>
        <p>$$\\hat{c}_{\\text{step}} \\le 2 + r'(x) + (2r'(x) - 2 - r(x)) - 2r(x) = 3(r'(x) - r(x))!$$</p>
        <p>Telescoping $\\sum 3(r'(x) - r(x))$ across all steps from $x$'s initial rank $r_0(x)$ up to the root rank $r(\\text{root}) = \\log_2 N$ (plus $+1$ for the final Zig) proves the <strong>Access Lemma</strong>: $\\text{Amortized Cost}(\\text{splay}(x)) \\le 3(\\log_2 N - \\log_2 s(x)) + 1 = O(\\log N)$!</p>
      </div>

      <div class="simulator-mount" data-sim="sim-treap-splay-tree"></div>

      <svg viewBox="0 0 720 230" width="100%" height="230" role="img" aria-label="Comparison of Sleator-Tarjan Zig-Zig vs Naive Move-to-Root on a left-leaning path">
        <defs>
          <style>
            .sp-edge { stroke: #475569; stroke-width: 2; }
            .sp-node { fill: #0f172a; stroke: #38bdf8; stroke-width: 2; }
            .sp-x { fill: #064e3b; stroke: #10b981; stroke-width: 2.2; }
            .sp-bad { fill: #450a0a; stroke: #ef4444; stroke-width: 2; }
            .sp-lbl { fill: #f8fafc; font-family: monospace; font-size: 13px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
            .sp-txt { fill: #cbd5e1; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <text class="sp-txt" x="20" y="24" fill="#38bdf8">1. Initial Left-Left Spine (g → p → x):</text>
        <line class="sp-edge" x1="145" y1="55" x2="100" y2="115"/>
        <line class="sp-edge" x1="100" y1="115" x2="55" y2="175"/>
        <circle class="sp-node" cx="145" cy="55" r="18"/><text class="sp-lbl" x="145" y="55">g</text>
        <circle class="sp-node" cx="100" cy="115" r="18"/><text class="sp-lbl" x="100" y="115">p</text>
        <circle class="sp-x" cx="55" cy="175" r="18"/><text class="sp-lbl" x="55" y="175">x</text>

        <text class="sp-txt" x="260" y="24" fill="#4ade80">2. Sleator-Tarjan Zig-Zig (Rotate g FIRST, then p):</text>
        <line class="sp-edge" x1="315" y1="55" x2="365" y2="115"/>
        <line class="sp-edge" x1="365" y1="115" x2="415" y2="175"/>
        <circle class="sp-x" cx="315" cy="55" r="18"/><text class="sp-lbl" x="315" y="55">x</text>
        <circle class="sp-node" cx="365" cy="115" r="18"/><text class="sp-lbl" x="365" y="115">p</text>
        <circle class="sp-node" cx="415" cy="175" r="18"/><text class="sp-lbl" x="415" y="175">g</text>
        <text class="sp-txt" x="260" y="205" fill="#4ade80">Disjoint Subtrees: s(x) + s'(g) ≤ s'(x) ⇒ Halves path depth!</text>

        <text class="sp-txt" x="520" y="24" fill="#f87171">3. Broken Move-to-Root (Rotate p first):</text>
        <line class="sp-edge" x1="575" y1="55" x2="635" y2="115"/>
        <line class="sp-edge" x1="635" y1="115" x2="590" y2="175"/>
        <circle class="sp-x" cx="575" cy="55" r="18"/><text class="sp-lbl" x="575" y="55">x</text>
        <circle class="sp-bad" cx="635" cy="115" r="18"/><text class="sp-lbl" x="635" y="115">g</text>
        <circle class="sp-bad" cx="590" cy="175" r="18"/><text class="sp-lbl" x="590" y="175">p</text>
        <text class="sp-txt" x="520" y="205" fill="#f87171">g stays above p ⇒ O(N) amortized!</text>
      </svg>

      <div class="mermaid">
flowchart TD
  Loop["while x.parent != null"] --> CheckG{"x.parent.parent == null ?"}
  CheckG -- "Yes (Zig)" --> Zig["rotate(x)  // 1 single rotation"]
  CheckG -- "No" --> SameDir{"(p == g.L) == (x == p.L) ?"}
  SameDir -- "Yes (Zig-Zig)" --> ZZ["rotate(p)  // Rotate parent with g FIRST!\nrotate(x)  // Then rotate x with p"]
  SameDir -- "No (Zig-Zag)" --> ZZag["rotate(x)  // Rotate x with p first\nrotate(x)  // Then rotate x with g"]
      </div>

      <div class="hardware-box">
        <h4>Hardware Reality: Splay Trees as Self-Organizing L1 Cache &amp; Link-Cut Tree Auxiliary Paths</h4>
        <p>Because Splay Trees satisfy the <strong>Working-Set Theorem</strong> (re-accessing one of the $k$ most recently touched keys takes $O(\\log k)$ comparisons), they act like a hardware LRU cache embedded inside a search tree, making them popular in network packet classifiers and GCC's <code>libiberty</code> (<code>splay-tree.c</code>). Even more importantly, because <code>splay(x)</code> requires zero balance fields and splits/joins paths at the root, Sleator and Tarjan built <strong>Link-Cut Trees</strong> (supporting $O(\\log N)$ dynamic forest connectivity and path aggregates) using Splay Trees as the auxiliary heavy-path representation!</p>
      </div>

      <h2>Implementation: Sleator-Tarjan Bottom-Up Splay Engine</h2>
      <pre><code class="language-cpp">// C++20: Sleator-Tarjan Bottom-Up Splay Tree (Zero Balance Metadata, O(log N) Amortized)
struct SplayNode {
    int key;
    SplayNode *ch[2] = {nullptr, nullptr}, *p = nullptr;
    explicit SplayNode(int k) : key(k) {}
};

// Returns 0 if x is a left child, 1 if x is a right child
inline int dir(const SplayNode* x) noexcept {
    return x-&gt;p-&gt;ch[1] == x;
}

// Rotates x one step up above its parent p
void rotate(SplayNode* x) noexcept {
    SplayNode* p = x-&gt;p;
    SplayNode* g = p-&gt;p;
    int d = dir(x);
    p-&gt;ch[d] = x-&gt;ch[d ^ 1];
    if (x-&gt;ch[d ^ 1]) x-&gt;ch[d ^ 1]-&gt;p = p;
    x-&gt;ch[d ^ 1] = p;
    p-&gt;p = x;
    x-&gt;p = g;
    if (g) g-&gt;ch[g-&gt;ch[1] == p] = x;
}

// Splays x to the root using Zig, Zig-Zig (rotate p first!), and Zig-Zag
SplayNode* splay(SplayNode* x) noexcept {
    if (!x) return nullptr;
    while (x-&gt;p != nullptr) {
        SplayNode* p = x-&gt;p;
        SplayNode* g = p-&gt;p;
        if (g == nullptr) {
            rotate(x);                          // Zig (p is root)
        } else if (dir(p) == dir(x)) {
            rotate(p);                          // Zig-Zig: rotate p with g FIRST!
            rotate(x);
        } else {
            rotate(x);                          // Zig-Zag: rotate x twice
            rotate(x);
        }
    }
    return x;
}</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Searching for a Non-Existent Key Without Splaying the Last Visited Node:</strong> If <code>find(key)</code> hits a <code>null</code> pointer after walking down a long $O(N)$ chain and returns <code>false</code> <em>without</em> splaying the last non-null node visited before falling off the tree, an attacker can repeatedly query a missing key in $\\Theta(N)$ time forever without paying down the tree's potential! Always splay the last visited node even on an unsuccessful search.</li>
          <li><strong>Multi-Threaded Read Contention:</strong> Because even a read-only <code>find(key)</code> mutates the tree via <code>splay(x)</code> all the way to the root, concurrent readers cannot share a Splay Tree without an exclusive mutex lock.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "Splay Trees store zero balance metadata and move every accessed node x to the root via splay(x) in O(log N) amortized time.",
      "When x and parent p lean in the same direction (Zig-Zig), rotating p with grandparent g FIRST and then x with p ensures s(x) + s'(g) <= s'(x), halving path depth and enabling the 3(r'(x) - r(x)) potential bound.",
      "Unsuccessful searches MUST splay the last visited non-null node to the root, otherwise repeated misses on a deep branch take Θ(N) time without reducing tree potential.",
      "By the Static Optimality and Working-Set Theorems, Splay Trees automatically match optimal static BSTs and access recently used keys in O(log k) amortized time."
    ],
    furtherReading: [
      { title: "Sleator, D. D. & Tarjan, R. E. (1985): Self-Adjusting Binary Search Trees (Journal of the ACM, Vol. 32, Issue 3)", url: "https://doi.org/10.1145/3828.3835" },
      { title: "Erickson, J. / CMU 15-451 Lecture Notes: Splay Trees and Amortized Potential Proof", url: "https://jeffe.cs.illinois.edu/teaching/algorithms/" }
    ]
  },

  "augmented-trees-order-intervals": {
    title: "Augmenting BSTs: Order-Statistic Trees (select/rank) & Interval Trees",
    video: {
      youtubeId: "CF21Z26I13M",
      title: "MIT 6.006 Lecture 7: Augmenting Data Structures (Order Statistics & Interval Trees)",
      channel: "MIT OpenCourseWare",
      duration: "49:18",
      start: 0,
      length: "49m",
      why: "Covers the CLRS Augmentation Theorem, Order-Statistic select/rank algorithms, and Interval Tree max-endpoint invariant proof."
    },
    intuition: "<p>A standard balanced BST only answers predecessor/successor and key membership queries in $O(\\log N)$ time; it cannot directly answer positional array queries like <em>\"what is the $k$-th smallest element?\"</em> (<code>select(k)</code>) or <em>\"how many elements are strictly less than $x$?\"</em> (<code>rank(x)</code>), nor geometric overlap queries like <em>\"which scheduled reservation overlaps $[lo, hi]$?\"</em>. Instead of inventing a brand-new data structure from scratch for every domain, we <strong>augment</strong> an existing balanced BST (AVL, Red-Black, or Treap) by storing extra cached summary fields inside each node.</p><p>By the <strong>CLRS Augmentation Theorem (Theorem 14.1)</strong>, any node attribute $f(u)$ that can be computed in $O(1)$ time solely from $u$'s own key and the attributes of $u$'s immediate children—$f(u) = g(u.\\text{key}, f(u.\\text{left}), f(u.\\text{right}))$—can be maintained across all BST insertions, deletions, and rotations in $O(\\log N)$ time without increasing asymptotic complexity!</p>",
    content: `<div class="lesson-content">
      <h2>The CLRS Augmentation Theorem &amp; Two Canonical Augmented Trees</h2>
      <p>Why do rotations preserve local subtree summaries in $O(1)$ time? Because a rotation (<code>rotateLeft</code> or <code>rotateRight</code>) on edge $(x, y)$ only changes the descendant sets of <strong>two nodes</strong>: $x$ and $y$! The entire subtree rooted at the new top node contains the exact same set of nodes as before the rotation, so no ancestor above the rotated pair needs its associative summary recomputed from scratch (though ancestor updates along the $O(\\log N)$ insertion/deletion path take $O(\\log N)$ total time anyway).</p>

      <h3>1. Order-Statistic Tree (<code>size[u]</code> Augmentation)</h3>
      <p>Augment each node $u$ with its subtree size $\\text{size}(u) = 1 + \\text{size}(u.\\text{left}) + \\text{size}(u.\\text{right})$ (where $\\text{size}(\\text{null}) = 0$). Then:</p>
      <ul>
        <li><strong><code>select(u, k)</code> (0-indexed $k$-th smallest key):</strong> Let $L = \\text{size}(u.\\text{left})$ be the number of nodes in $u$'s left subtree. If $k == L$, return $u$; if $k &lt; L$, recurse into <code>select(u.left, k)</code>; if $k &gt; L$, subtract the $L + 1$ skipped elements and recurse into <code>select(u.right, k - L - 1)</code>!</li>
        <li><strong><code>rank(root, key)</code> (count of keys $&lt; \\text{key}$):</strong> Walk down from the root; every time we branch right (because $u.\\text{key} &lt; \\text{key}$), add $\\text{size}(u.\\text{left}) + 1$ to our running accumulator.</li>
      </ul>

      <h3>2. Interval Tree (<code>maxEnd[u]</code> Augmentation for 1D Overlap Search)</h3>
      <p>Suppose we store closed intervals $I_i = [lo_i, hi_i]$ ordered primarily by their <strong>low endpoint $lo_i$</strong> as the BST key, and augment each node $u$ with the maximum high endpoint anywhere in $u$'s subtree:</p>
      <p>$$\\text{maxEnd}(u) = \\max\\big(u.hi, \\; \\text{maxEnd}(u.\\text{left}), \\; \\text{maxEnd}(u.\\text{right})\\big)$$</p>
      <p>To find <em>any</em> interval in the tree that overlaps query $Q = [q_{lo}, q_{hi}]$ (recall two closed intervals overlap iff $u.lo \\le q_{hi}$ AND $q_{lo} \\le u.hi$), we inspect a **single root-to-leaf path** in $O(\\log N)$ time:</p>
      <ol>
        <li>If $u$ overlaps $Q$, return $u$.</li>
        <li>If $u.\\text{left} \\ne \\text{null}$ and $\\text{maxEnd}(u.\\text{left}) \\ge q_{lo}$, <strong>go left</strong> (<code>u = u.left</code>).</li>
        <li>Otherwise, <strong>go right</strong> (<code>u = u.right</code>).</li>
      </ol>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Augmented Structure &amp; Operation</th>
            <th>Stored Node Field $f(u)$</th>
            <th>Local Maintenance $g(\\cdot)$</th>
            <th>Query / Update Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Order-Statistic <code>select(k)</code> / <code>rank(x)</code></td>
            <td><code>size</code> (subtree count)</td>
            <td>$1 + \\text{size}(L) + \\text{size}(R)$</td>
            <td><span class="badge-ologn">O(log N)</span></td>
          </tr>
          <tr>
            <td>Interval Tree <code>findAnyOverlap(Q)</code></td>
            <td><code>maxEnd</code> (subtree $\\max hi$)</td>
            <td>$\\max(u.hi, \\text{maxEnd}(L), \\text{maxEnd}(R))$</td>
            <td><span class="badge-ologn">O(log N)</span></td>
          </tr>
          <tr>
            <td>Subtree Affine / Hash / Monoid Tree</td>
            <td><code>agg</code> (associative monoid)</td>
            <td>$\\text{agg}(L) \\oplus \\text{val}(u) \\oplus \\text{agg}(R)$</td>
            <td><span class="badge-ologn">O(log N)</span></td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Correctness Proof: Why Interval Tree Search Never Needs to Backtrack When Going Left!</h4>
        <p>Students always ask: <em>\"In Step 2, if $\\text{maxEnd}(u.\\text{left}) \\ge q_{lo}$ and we go left, what if the interval in $u.\\text{left}$ that achieved $\\text{maxEnd} \\ge q_{lo}$ has its low endpoint $&gt; q_{hi}$, so the left subtree has NO overlap while the right subtree DOES have an overlap?\"</em></p>
        <p><strong>Proof that this is impossible:</strong> Let $I^* = [lo^*, hi^*] \\in u.\\text{left}$ be the interval in $u$'s left subtree that achieves $hi^* = \\text{maxEnd}(u.\\text{left}) \\ge q_{lo}$.</p>
        <ul>
          <li>Case A: If $lo^* \\le q_{hi}$, then since we already know $hi^* \\ge q_{lo}$, $I^*$ itself overlaps $Q = [q_{lo}, q_{hi}]$! So an overlapping interval genuinely exists in $u.\\text{left}$.</li>
          <li>Case B: Suppose $lo^* &gt; q_{hi}$. Because $I^*$ lies in the <strong>left subtree</strong> of $u$ and the BST is ordered by low endpoints, every interval $J = [lo_J, hi_J]$ in $u$'s <strong>right subtree</strong> satisfies:
          $$lo_J \\ge u.lo \\ge lo^* &gt; q_{hi}!$$
          Thus <strong>no interval in $u.\\text{right}$ can possibly overlap $Q$ either</strong>! Going left when $\\text{maxEnd}(u.\\text{left}) \\ge q_{lo}$ is 100% safe and never misses a valid match in $u.\\text{right}$.</li>
        </ul>
      </div>

      <div class="simulator-mount" data-sim="sim-interval-order-statistic-tree"></div>

      <svg viewBox="0 0 720 220" width="100%" height="220" role="img" aria-label="Order-Statistic Tree rank/select and Interval Tree maxEnd pruning">
        <defs>
          <style>
            .ag-edge { stroke: #475569; stroke-width: 2; }
            .ag-node { fill: #0f172a; stroke: #38bdf8; stroke-width: 2; }
            .ag-hit { fill: #064e3b; stroke: #10b981; stroke-width: 2.2; }
            .ag-lbl { fill: #f8fafc; font-family: monospace; font-size: 11.5px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
            .ag-txt { fill: #cbd5e1; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <text class="ag-txt" x="20" y="24" fill="#38bdf8">Interval Tree [lo, hi] | maxEnd (BST keyed by lo):</text>
        <line class="ag-edge" x1="175" y1="60" x2="90" y2="135"/>
        <line class="ag-edge" x1="175" y1="60" x2="260" y2="135"/>
        <line class="ag-edge" x1="90" y1="135" x2="45" y2="195"/>
        <line class="ag-edge" x1="90" y1="135" x2="135" y2="195"/>

        <rect class="ag-node" x="115" y="40" width="120" height="36" rx="6"/><text class="ag-lbl" x="175" y="58">[16,21] max=30</text>
        <rect class="ag-hit" x="30" y="115" width="120" height="36" rx="6"/><text class="ag-lbl" x="90" y="133">[8,9] max=23</text>
        <rect class="ag-node" x="200" y="115" width="120" height="36" rx="6"/><text class="ag-lbl" x="260" y="133">[25,30] max=30</text>
        <rect class="ag-node" x="5" y="178" width="82" height="32" rx="5"/><text class="ag-lbl" x="46" y="194">[5,8] m=8</text>
        <rect class="ag-hit" x="95" y="178" width="92" height="32" rx="5"/><text class="ag-lbl" x="141" y="194">[15,23] m=23</text>

        <text class="ag-txt" x="355" y="45" fill="#4ade80">Query Q = [22, 24] — Single-Path O(log N) Trace:</text>
        <text class="ag-txt" x="355" y="72">1. At root [16,21]: no overlap (21 &lt; 22).</text>
        <text class="ag-txt" x="355" y="95">   Check left.maxEnd = 23 ≥ q_lo (22) ⇒ GO LEFT!</text>
        <text class="ag-txt" x="355" y="122">2. At [8,9]: no overlap (9 &lt; 22).</text>
        <text class="ag-txt" x="355" y="145">   Check left.maxEnd = 8 &lt; 22 ⇒ GO RIGHT!</text>
        <text class="ag-txt" x="355" y="172" fill="#4ade80">3. At [15,23]: 15 ≤ 24 AND 22 ≤ 23 ⇒ MATCH FOUND!</text>
      </svg>

      <div class="mermaid">
flowchart TD
  Start["searchOverlap(u, qLo, qHi)"] --> NullCheck{"u == null ?"}
  NullCheck -- "Yes" --> None["return null"]
  NullCheck -- "No" --> Overlap{"u.lo <= qHi AND\nqLo <= u.hi ?"}
  Overlap -- "Yes" --> Hit["return u"]
  Overlap -- "No" --> LeftMax{"u.left != null AND\nu.left.maxEnd >= qLo ?"}
  LeftMax -- "Yes (Guaranteed Safe)" --> GoL["return searchOverlap(u.left, qLo, qHi)"]
  LeftMax -- "No (Left cannot overlap)" --> GoR["return searchOverlap(u.right, qLo, qHi)"]
      </div>

      <div class="hardware-box">
        <h4>Hardware Reality: Linux Kernel VMAs &amp; GCC Policy-Based Data Structures</h4>
        <p>Where do Augmented BSTs appear in production? First, the Linux kernel's Virtual Memory Area manager (<code>mm/mmap.c</code>) uses an <strong>augmented Red-Black Interval Tree (<code>rb_subtree_gap</code>)</strong> to locate free virtual address holes for <code>mmap()</code> in $O(\\log N)$ time. Second, in C++ competitive and systems programming, GNU <code>libstdc++</code> provides <code>__gnu_pbds::tree</code> with <code>tree_order_statistics_node_update</code>, giving a drop-in Red-Black Order-Statistic Tree supporting <code>find_by_order(k)</code> (<code>select</code>) and <code>order_of_key(x)</code> (<code>rank</code>) in $O(\\log N)$ time.</p>
      </div>

      <h2>Implementation: Interval Tree Overlap Search &amp; Order-Statistic Select/Rank</h2>
      <pre><code class="language-cpp">// C++20: Augmented BST Primitives — Interval Overlap Search + Order-Statistic Select &amp; Rank
#include &lt;algorithm&gt;
#include &lt;cstdint&gt;

struct AugmentedNode {
    int64_t lo, hi;      // Interval [lo, hi]; 'lo' acts as the primary BST key
    int64_t maxEnd;      // Max 'hi' in subtree
    int32_t sz = 1;      // Subtree node count for Order-Statistic rank/select
    AugmentedNode *left = nullptr, *right = nullptr;

    AugmentedNode(int64_t l, int64_t h) : lo(l), hi(h), maxEnd(h) {}
};

// O(1) Local Pull called after every child modification or rotation
inline void pullAugmented(AugmentedNode* u) noexcept {
    if (!u) return;
    u-&gt;sz = 1 + (u-&gt;left ? u-&gt;left-&gt;sz : 0) + (u-&gt;right ? u-&gt;right-&gt;sz : 0);
    int64_t m = u-&gt;hi;
    if (u-&gt;left)  m = std::max(m, u-&gt;left-&gt;maxEnd);
    if (u-&gt;right) m = std::max(m, u-&gt;right-&gt;maxEnd);
    u-&gt;maxEnd = m;
}

// 1. O(log N) Interval Overlap Search (Single root-to-leaf walk, zero backtracking!)
const AugmentedNode* findOverlappingInterval(const AugmentedNode* u, int64_t qLo, int64_t qHi) noexcept {
    while (u != nullptr) {
        if (u-&gt;lo &lt;= qHi &amp;&amp; qLo &lt;= u-&gt;hi) return u; // Overlap found!
        if (u-&gt;left != nullptr &amp;&amp; u-&gt;left-&gt;maxEnd &gt;= qLo) {
            u = u-&gt;left;
        } else {
            u = u-&gt;right;
        }
    }
    return nullptr;
}

// 2. O(log N) Order-Statistic Select (0-indexed k-th smallest by 'lo')
const AugmentedNode* selectKth(const AugmentedNode* u, int32_t k) noexcept {
    while (u != nullptr) {
        int32_t leftSz = u-&gt;left ? u-&gt;left-&gt;sz : 0;
        if (k == leftSz) return u;
        if (k &lt; leftSz) {
            u = u-&gt;left;
        } else {
            k -= (leftSz + 1);
            u = u-&gt;right;
        }
    }
    return nullptr;
}</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Augmenting with Global Rank Instead of Local Subtree Size Breaks $O(\\log N)$ Insertion:</strong> If you store each node's <em>global</em> sorted index <code>globalRank[u]</code> inside the node, inserting a new minimum element increments the global rank of all $N$ nodes, forcing $\\Theta(N)$ updates! By storing only <strong>subtree-local</strong> <code>size[u]</code>, inserting a node only increments <code>size</code> on its $O(\\log N)$ ancestors.</li>
          <li><strong>Forgetting to Call <code>pullAugmented</code> Inside Rotations:</strong> Any rotation <code>rotateLeft(x)</code> or <code>rotateRight(x)</code> changes the children of both <code>x</code> and <code>y</code>. Omitting <code>pullAugmented(x); pullAugmented(y);</code> inside the rotation helper leaves stale <code>size</code> and <code>maxEnd</code> values that cause silent out-of-bounds <code>select</code> or missed interval overlaps.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "By the CLRS Augmentation Theorem, any subtree property f(u) = g(u.val, f(u.left), f(u.right)) computable in O(1) from children can be maintained across balanced BST updates and rotations in O(log N) time.",
      "Order-Statistic Trees augment nodes with subtree size sz(u) = 1 + sz(u.left) + sz(u.right) (never global rank!) to answer select(k) and rank(key) in O(log N) time.",
      "Interval Trees order intervals by low endpoint lo and augment each node with maxEnd(u) = max(u.hi, maxEnd(L), maxEnd(R)).",
      "Searching for any overlapping interval follows a single O(log N) path: if maxEnd(u.left) >= q_lo, going left is guaranteed safe because if the left witness lo* > q_hi, then every interval in u.right has lo >= lo* > q_hi and cannot overlap either."
    ],
    furtherReading: [
      { title: "CLRS Introduction to Algorithms (4th Ed.) — Chapter 17 (3rd Ed. Ch. 14): Augmenting Data Structures", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
      { title: "GCC libstdc++ Documentation — Policy-Based Data Structures (tree_order_statistics_node_update)", url: "https://gcc.gnu.org/onlinedocs/libstdc++/ext/pb_ds/tree_based_containers.html" }
    ]
  },
  "b-trees-bplus-trees-disk-pages": {
    title: "B-Trees & B+ Trees: Page Fanout, Proactive Splitting & Leaf Sibling Chains",
    video: {
      youtubeId: "aZjYr87r1b8",
      title: "CMU 15-445 Database Systems Lecture 7: Trees Indexes (B+ Trees)",
      channel: "CMU Database Group (Andy Pavlo)",
      duration: "1:15:30",
      start: 0,
      length: "75m",
      why: "Andy Pavlo explains why every relational database (PostgreSQL, InnoDB, SQLite) uses B+ Trees instead of original B-Trees, plus latch crabbing and page splits."
    },
    intuition: "<p>Why doesn't PostgreSQL or MySQL InnoDB use a Red-Black Tree or AVL Tree for on-disk indexes? Because on $N = 10^9$ rows, a binary tree has height $\\log_2(10^9) \\approx 30$. Chasing 30 random pointers across an NVMe SSD ($\\approx 50\\,\\mu\\text{s}$ per 4 KB / 16 KB page read) costs $1.5\\text{ ms}$ per lookup, and on spinning disks costs $300\\text{ ms}$! In 1970, Rudolf Bayer and Edward McCreight solved this by matching the tree node size to the hardware <strong>OS/Disk Page Size ($4\\text{ KB}$ to $16\\text{ KB}$)</strong>, packing $B \\approx 250\\text{ to }1000$ keys into a single contiguous node to flatten tree height from $\\log_2(10^9) = 30$ down to $\\log_{500}(10^9) \\le 4$ levels!</p><p>Furthermore, virtually every modern database uses Douglas Comer's <strong>B+ Tree</strong> variant rather than Bayer &amp; McCreight's original <strong>B-Tree</strong>: by stripping row values/payloads out of internal nodes (leaving internal nodes as pure routing directories of separator keys) and storing all records in a doubly-linked <strong>leaf sibling chain</strong>, B+ Trees maximize internal node fanout $B$ and turn range queries (<code>WHERE id BETWEEN 100 AND 5000</code>) into linear sequential page scans!</p>",
    content: `<div class="lesson-content">
      <h2>CLRS Minimum Degree $t$ Invariants, Proactive Splitting &amp; B-Tree vs B+ Tree</h2>
      <p>In CLRS notation, a B-Tree of <strong>minimum degree $t \\ge 2$</strong> (maximum branching factor $M = 2t$) satisfies:</p>
      <ol>
        <li>Every node except the root holds at least $t - 1$ keys ($t$ children); the root holds at least $1$ key ($2$ children) if non-empty.</li>
        <li>Every node holds at most $2t - 1$ keys ($2t$ children). A node with $2t - 1$ keys is <strong>full</strong>.</li>
        <li>All leaf nodes reside at the <strong>exact same depth $h$</strong>, bounded by $h \\le \\log_t \\frac{N + 1}{2}$.</li>
      </ol>
      <p><strong>Proactive Top-Down Splitting (Single-Pass Insertion):</strong> In an on-disk B-Tree, if we waited until reaching a full leaf to split and propagate median keys back up, we would have to hold exclusive write locks (latches) on the entire root-to-leaf path or re-read ancestor pages from disk. Instead, CLRS splits <em>every full node ($2t - 1$ keys) encountered on the way down</em> into two nodes of $t - 1$ keys each, promoting the median key into the parent (which is guaranteed not to be full because we would have already split it on the step above!). This guarantees single-pass top-down insertion and enables <strong>latch crabbing</strong> (releasing parent locks as soon as the child is verified safe).</p>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Feature / Operation</th>
            <th>Original B-Tree (Bayer-McCreight)</th>
            <th>B+ Tree (PostgreSQL / InnoDB / SQLite)</th>
            <th>CPU In-Memory B-Tree (<code>rust BTreeMap</code>)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Where Do Row Payloads Live?</td>
            <td>In BOTH internal and leaf nodes</td>
            <td><strong>Exclusively in Leaf Nodes</strong> (Internal = routing keys)</td>
            <td>In all nodes ($B = 6$, max $11$ keys/node)</td>
          </tr>
          <tr>
            <td>Internal Node Fanout ($16\\text{ KB}$ Page)</td>
            <td>Low ($\\approx 50\\text{–}150$, bloated by payloads)</td>
            <td><span class="badge-o1">High (≈ 500–1000 keys/page!)</span></td>
            <td>12-way branching (fits 2–4 cache lines)</td>
          </tr>
          <tr>
            <td>Point Lookup I/Os</td>
            <td><span class="badge-ologn">O(log_B N)</span></td>
            <td><span class="badge-ologn">O(log_B N)</span> ($\le 3\text{–}4$ page reads; upper levels in RAM)</td>
            <td><span class="badge-ologn">O(log₂ N) cmps, O(log_B N) cache misses</span></td>
          </tr>
          <tr>
            <td>Range Scan $[K_1, K_2]$ ($S$ items)</td>
            <td><span class="badge-on">Slow tree up/down traversal</span></td>
            <td><span class="badge-o1">O(log_B N + S/B) Sequential Leaf Walk!</span></td>
            <td>Fast contiguous array slice iteration</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>B-Tree Split vs B+ Tree Split: Push-Up vs Copy-Up</h4>
        <p>When a full node with $2t - 1$ keys splits around its median key $k_{\\text{mid}}$:</p>
        <ul>
          <li><strong>B-Tree Split (Push-Up Everywhere):</strong> Because every node stores actual data records, $k_{\\text{mid}}$ is <em>moved (pushed)</em> up into the parent and removed from the child level, leaving two children of size $t - 1$.</li>
          <li><strong>B+ Tree Leaf Split (Copy-Up) vs Internal Split (Push-Up):</strong> In a B+ Tree, every key-value record <em>must</em> remain present in the leaf level so sequential scans work! Therefore, when a <strong>B+ Tree Leaf</strong> splits, the separator key $k_{\\text{mid}}$ is <strong>copied up</strong> to the parent directory node while remaining in the right leaf! When a <strong>B+ Tree Internal Routing Node</strong> overflows, however, its median routing key is <strong>pushed up</strong> (not duplicated) just like a standard B-Tree.</li>
        </ul>
      </div>

      <div class="simulator-mount" data-sim="sim-bplus-tree-splitting"></div>

      <svg viewBox="0 0 720 225" width="100%" height="225" role="img" aria-label="B+ Tree Internal Routing Directory vs Doubly-Linked Leaf Sibling Chain">
        <defs>
          <style>
            .bp-dir { fill: #0f172a; stroke: #38bdf8; stroke-width: 2; }
            .bp-leaf { fill: #064e3b; stroke: #10b981; stroke-width: 2; }
            .bp-edge { stroke: #475569; stroke-width: 2; }
            .bp-sib { stroke: #f59e0b; stroke-width: 2.2; stroke-dasharray: 5 3; }
            .bp-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
            .bp-lbl { fill: #cbd5e1; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <text class="bp-lbl" x="20" y="22" fill="#38bdf8">Internal Directory Page (Pure Separator Keys + Child Page IDs → High Fanout B ≈ 1000):</text>
        <rect class="bp-dir" x="210" y="36" width="260" height="38" rx="6"/>
        <text class="bp-txt" x="340" y="55">[  P₀  |  K₁=20  |  P₁  |  K₂=50  |  P₂  ]</text>

        <line class="bp-edge" x1="250" y1="74" x2="115" y2="135"/>
        <line class="bp-edge" x1="340" y1="74" x2="340" y2="135"/>
        <line class="bp-edge" x1="430" y1="74" x2="565" y2="135"/>

        <text class="bp-lbl" x="20" y="122" fill="#4ade80">Leaf Pages (All Keys + Row Payloads/TIDs + Doubly-Linked Next/Prev Page Pointers):</text>
        <rect class="bp-leaf" x="20" y="135" width="190" height="44" rx="6"/>
        <text class="bp-txt" x="115" y="157">[ 5:v | 12:v | 18:v ]</text>

        <rect class="bp-leaf" x="245" y="135" width="190" height="44" rx="6"/>
        <text class="bp-txt" x="340" y="157">[ 20:v | 31:v | 44:v ]</text>

        <rect class="bp-leaf" x="470" y="135" width="190" height="44" rx="6"/>
        <text class="bp-txt" x="565" y="157">[ 50:v | 63:v | 89:v ]</text>

        <line class="bp-sib" x1="210" y1="157" x2="245" y2="157"/>
        <line class="bp-sib" x1="435" y1="157" x2="470" y2="157"/>
        <text class="bp-lbl" x="20" y="205" fill="#fbbf24">╌╌ Leaf Sibling Chain: Range Query [12, 63] does 1 tree descent + sequential leaf scan!</text>
      </svg>

      <div class="mermaid">
flowchart TD
  Ins["insert(root, key)"] --> RootFull{"root.numKeys == 2t - 1 ?"}
  RootFull -- "Yes" --> NewRoot["s = new Node(leaf=false)\ns.children[0] = root\nsplitChild(s, 0)\ninsertNonFull(s, key)"]
  RootFull -- "No" --> NonFull["insertNonFull(root, key)"]
  NonFull --> Descend["Find child i for key\nIf children[i] is full (2t-1 keys):\n  splitChild(node, i)\n  if key > node.keys[i]: i++\nRecurse into children[i]"]
      </div>

      <div class="hardware-box">
        <h4>Hardware Reality: Why Rust's <code>std::collections::BTreeMap</code> Replaced Red-Black Trees in RAM</h4>
        <p>B-Trees are not just for disks! Standard C++ <code>std::map</code> allocates every single key in a separate 40-byte Red-Black Tree node on the heap, causing a $60\\text{ ns}$ L3/DRAM cache miss on every comparison and wasting $70\\%$ of memory on pointers. Rust's standard library (<code>std::collections::BTreeMap</code>) and Google's Abseil <code>absl::btree_map</code> use an <strong>in-memory B-Tree with $B = 6$ (up to $2B - 1 = 11$ keys per node)</strong>. Scanning up to 11 contiguous keys inside a node sits in 1–2 CPU cache lines, runs at L1 speed with hardware prefetching and SIMD, reduces pointer overhead by $85\\%$, and beats <code>std::map</code> by $2\\times$ to $4\\times$ on both lookups and iteration!</p>
      </div>

      <h2>Implementation: In-Memory Cache-Aligned B-Tree Node Split (<code>splitChild</code>)</h2>
      <pre><code class="language-cpp">// C++20: Proactive B-Tree Node Split (CLRS Minimum Degree t, Max Keys = 2t - 1)
#include &lt;vector&gt;
#include &lt;algorithm&gt;

template &lt;typename Key, int T = 4&gt; // T=4 =&gt; max 7 keys, 8 children per cache-aligned node
struct BTreeNode {
    bool isLeaf = true;
    std::vector&lt;Key&gt; keys;
    std::vector&lt;BTreeNode*&gt; children;

    explicit BTreeNode(bool leaf) : isLeaf(leaf) {
        keys.reserve(2 * T - 1);
        if (!leaf) children.reserve(2 * T);
    }
};

// Splits full child y = parent->children[idx] (which has 2T - 1 keys) into two nodes of T - 1 keys
template &lt;typename Key, int T&gt;
void splitChild(BTreeNode&lt;Key, T&gt;* parent, int idx) {
    BTreeNode&lt;Key, T&gt;* y = parent-&gt;children[idx];
    auto* z = new BTreeNode&lt;Key, T&gt;(y-&gt;isLeaf);

    Key medianKey = y-&gt;keys[T - 1];
    // Move upper T - 1 keys [T .. 2T-2] from y to z
    z-&gt;keys.assign(y-&gt;keys.begin() + T, y-&gt;keys.end());
    y-&gt;keys.resize(T - 1);

    // If internal node, move upper T children [T .. 2T-1] from y to z
    if (!y-&gt;isLeaf) {
        z-&gt;children.assign(y-&gt;children.begin() + T, y-&gt;children.end());
        y-&gt;children.resize(T);
    }

    // Insert medianKey and new right sibling z into parent
    parent-&gt;keys.insert(parent-&gt;keys.begin() + idx, medianKey);
    parent-&gt;children.insert(parent-&gt;children.begin() + idx + 1, z);
}</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Random-Insertion Page Space Utilisation (~69% = $\ln 2$) vs Right-Edge Sequential Inserts:</strong> Under random insertions, B+ Tree pages split into two $50\\%$ full pages and average $\\ln 2 \\approx 69\\%$ space utilization. If keys are inserted in strictly increasing order (e.g., <code>AUTO_INCREMENT</code> IDs) and pages split $50/50$, the left half is never touched again, wasting $50\\%$ of disk space! Production engines (InnoDB, SQLite) detect right-edge monotonic inserts and perform <strong>fast $90/10$ or $100/0$ right-leaning splits</strong> to achieve $>95\\%$ page packing.</li>
          <li><strong>Write Amplification on Small Random Updates:</strong> Updating a single 8-byte integer inside a $16\\text{ KB}$ B+ Tree leaf page forces the storage engine to flush the entire $16\\text{ KB}$ dirty page (plus WAL record) back to SSD—a $2000\\times$ raw write amplification that motivates LSM-Trees!</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "B-Trees match node sizes to hardware storage units (4KB–16KB disk pages or 64B–256B CPU cache lines), increasing fanout B to 250–1000 so 10^9 keys require only 3–4 tree levels.",
      "Proactive top-down splitting splits every full (2t - 1)-key node encountered on the way down, guaranteeing the parent always has room for a promoted median key in a single pass.",
      "B+ Trees store row payloads exclusively in leaf pages and link leaves into a doubly-linked sibling chain, maximizing internal routing fanout and turning range queries into sequential scans.",
      "When a B+ Tree leaf splits, the separator key is COPIED up to the parent (remaining in the right leaf); when an internal directory node splits, the median key is PUSHED up."
    ],
    furtherReading: [
      { title: "Comer, D. (1979): The Ubiquitous B-Tree (ACM Computing Surveys, Vol. 11, Issue 2)", url: "https://doi.org/10.1145/356770.356776" },
      { title: "Bayer, R. & McCreight, E. M. (1972): Organization and Maintenance of Large Ordered Indexes (Acta Informatica)", url: "https://doi.org/10.1007/BF00288683" },
      { title: "CLRS Introduction to Algorithms (4th Ed.) — Chapter 18: B-Trees", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
    ]
  },

  "lsm-trees-write-amplification": {
    title: "LSM-Trees vs B+ Trees: MemTables, SSTables, Compaction & RUM Conjecture",
    video: {
      youtubeId: "I6jB0nM9SKU",
      title: "CMU 15-445 Database Systems: Log-Structured Merge-Trees (LSM Trees & Compaction)",
      channel: "CMU Database Group (Andy Pavlo)",
      duration: "1:12:40",
      start: 0,
      length: "73m",
      why: "Explains the MemTable + SSTable pipeline, Size-Tiered vs Leveled Compaction in RocksDB/Cassandra, Bloom filters, and write/read/space amplification tradeoffs."
    },
    intuition: "<p>Why do write-intensive distributed databases like RocksDB, LevelDB, Apache Cassandra, ScyllaDB, and Pebble abandon B+ Trees in favor of Patrick O'Neil's <strong>Log-Structured Merge-Tree (LSM-Tree, 1996)</strong>? Because in a B+ Tree, every random key insertion or deletion requires reading and rewriting a random $4\\text{ KB}–16\\text{ KB}$ disk page in place, Bottlenecking on random disk IOPS and wearing out SSD flash cells through high Write Amplification.</p><p>An LSM-Tree turns <strong>every random write, update, and delete into a sequential append</strong>! Incoming writes go into an in-memory balanced structure (the <strong>MemTable</strong>, typically a Skip List or ART) backed by an append-only Write-Ahead Log (WAL). When the MemTable reaches capacity (e.g., $64\\text{ MB}$), it is flushed sequentially to disk as an immutable <strong>Sorted String Table (SSTable)</strong> at Level $L_0$, and background <strong>Compaction</strong> threads $K$-way merge sorted SSTables across levels $L_1, L_2, \\dots, L_k$ just like MergeSort!</p>",
    content: `<div class="lesson-content">
      <h2>The LSM Write/Read Pipeline, Tombstones &amp; Compaction Strategies</h2>
      <p>Because SSTables on disk are <strong>strictly immutable</strong>, an LSM-Tree never modifies an existing file in place:</p>
      <ul>
        <li><strong>Updates &amp; Deletions (Tombstones):</strong> Updating key $K$ simply appends a newer version <code>(K, v_new, seqNo)</code> to the MemTable. Deleting key $K$ appends a special <strong>Tombstone marker</strong> <code>(K, TOMBSTONE, seqNo)</code>. The obsolete older record is only physically reclaimed later when a background compaction merges the SSTable containing the tombstone with the older SSTable at the bottommost level!</li>
        <li><strong>Point Lookups (MemTable $\\to L_0 \\to L_1 \\dots \\to L_k$):</strong> To read key $K$, we search the active MemTable, then immutable MemTables awaiting flush, then <strong>every overlapping $L_0$ SSTable</strong> (because $L_0$ files are raw MemTable flushes whose key ranges overlap!), and finally at most <strong>one SSTable per level $L_1 \\dots L_k$</strong> (since levels $\\ge 1$ are partitioned into non-overlapping key ranges). To avoid reading SSTable blocks from disk for keys that are not present, every SSTable embeds an in-memory <strong>Bloom Filter</strong> (or Ribbon Filter) and fence-pointer sparse index!</li>
      </ul>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Storage Metric</th>
            <th>B+ Tree (In-Place Page Updates)</th>
            <th>LSM: Size-Tiered Compaction (STCS — Cassandra)</th>
            <th>LSM: Leveled Compaction (LCS — RocksDB)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Write Amplification (WA)</strong></td>
            <td><span class="badge-on">High on random small writes (PageSize / RecordSize)</span></td>
            <td><span class="badge-ologn">Low: O(log_T N) (≈ 4–8×)</span></td>
            <td><span class="badge-onlogn">Moderate: O(T · log_T N) (≈ 10–30×)</span></td>
          </tr>
          <tr>
            <td><strong>Read Amplification (RA)</strong></td>
            <td><span class="badge-ologn">Optimal for Range &amp; Point (1 tree path)</span></td>
            <td><span class="badge-on">Higher (Check multiple tiers)</span></td>
            <td><span class="badge-o1">≈ 1 Disk Read (with 10 bits/key Bloom filters)</span></td>
          </tr>
          <tr>
            <td><strong>Space Amplification (SA)</strong></td>
            <td><span class="badge-on">~30–45% fragmentation + internal slack</span></td>
            <td><span class="badge-on2">High: up to 50% temporary disk needed for largest merge!</span></td>
            <td><span class="badge-o1">Very Low: ≤ 10–11% stale data overhead!</span></td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>The RUM Conjecture (Athanassoulis et al., Harvard DASlab 2016) &amp; Leveled WA Math</h4>
        <p>Define the three fundamental amplification factors of any index structure:</p>
        <p>$$\\text{WA} = \\frac{\\text{Bytes Written to Storage}}{\\text{Logical Bytes Inserted}}, \\quad \\text{RA} = \\frac{\\text{Bytes Read from Storage}}{\\text{Logical Bytes Queried}}, \\quad \\text{SA} = \\frac{\\text{Total Storage Footprint}}{\\text{Logical Dataset Size}}$$</p>
        <p><strong>The RUM Conjecture:</strong> No access method can simultaneously optimize <strong>R</strong>ead overhead, <strong>U</strong>pdate (Write) overhead, and <strong>M</strong>emory (Space) overhead—minimizing any two necessarily degrades the third! Specifically, for an LSM-Tree with level size multiplier $T$ (typically $T = 10$, so $L_k = 10^k \\cdot L_0$) and $L = \\log_T(N / M_{\\text{mem}})$ levels:</p>
        <ul>
          <li>In <strong>Size-Tiered Compaction (STCS)</strong>, $T$ runs of equal size are merged together only when all $T$ accumulate: each byte is rewritten once per level, giving $\\text{WA} = O(\\log_T N)$, but up to $T$ overlapping runs exist per level ($\\text{SA} = O(T)$).</li>
          <li>In <strong>Leveled Compaction (LCS)</strong>, each level $L_i$ ($i \\ge 1$) is kept strictly sorted with non-overlapping SSTables. Merging a file from $L_{i-1}$ into $L_i$ rewrites up to $T$ overlapping files in $L_i$, yielding $\\text{WA} = O(T \\log_T N)$, while bounding stale duplicate space to $\\sum_{i=1}^{L-1} T^{-i} \\approx \\frac{1}{T - 1} \\approx 11.1\\%$ for $T=10$!</li>
        </ul>
      </div>

      <div class="simulator-mount" data-sim="sim-bplus-tree-splitting"></div>

      <svg viewBox="0 0 720 235" width="100%" height="235" role="img" aria-label="LSM-Tree Architecture showing MemTable, WAL, L0 overlapping SSTables, and L1/L2 non-overlapping Leveled SSTables">
        <defs>
          <style>
            .ls-mem { fill: #064e3b; stroke: #10b981; stroke-width: 2; }
            .ls-l0 { fill: #451a03; stroke: #f59e0b; stroke-width: 1.8; }
            .ls-lvl { fill: #0f172a; stroke: #38bdf8; stroke-width: 1.8; }
            .ls-bf { fill: #311042; stroke: #a855f7; stroke-width: 1.8; }
            .ls-txt { fill: #f8fafc; font-family: monospace; font-size: 11.5px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
            .ls-lbl { fill: #cbd5e1; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <text class="ls-lbl" x="20" y="22" fill="#4ade80">RAM: MemTable (SkipList) + Fence Pointers &amp; Bloom Filters</text>
        <rect class="ls-mem" x="20" y="34" width="210" height="36" rx="5"/><text class="ls-txt" x="125" y="52">MemTable (64MB SkipList)</text>
        <rect class="ls-bf" x="255" y="34" width="220" height="36" rx="5"/><text class="ls-txt" x="365" y="52">RAM Bloom Filters (10b/key)</text>

        <text class="ls-lbl" x="20" y="96" fill="#fbbf24">Disk L0 (Overlapping Key Ranges — Flushed directly from MemTable):</text>
        <rect class="ls-l0" x="20" y="106" width="140" height="30" rx="4"/><text class="ls-txt" x="90" y="121">SST [A .. Z]</text>
        <rect class="ls-l0" x="170" y="106" width="140" height="30" rx="4"/><text class="ls-txt" x="240" y="121">SST [C .. W]</text>
        <rect class="ls-l0" x="320" y="106" width="140" height="30" rx="4"/><text class="ls-txt" x="390" y="121">SST [B .. M]</text>

        <text class="ls-lbl" x="20" y="162" fill="#38bdf8">Disk L1 &amp; L2 (Leveled Compaction: Strictly Non-Overlapping Key Ranges, 10× Growth):</text>
        <rect class="ls-lvl" x="20" y="172" width="105" height="32" rx="4"/><text class="ls-txt" x="72" y="188">[A .. F]</text>
        <rect class="ls-lvl" x="133" y="172" width="105" height="32" rx="4"/><text class="ls-txt" x="185" y="188">[G .. M]</text>
        <rect class="ls-lvl" x="246" y="172" width="105" height="32" rx="4"/><text class="ls-txt" x="298" y="188">[N .. T]</text>
        <rect class="ls-lvl" x="359" y="172" width="105" height="32" rx="4"/><text class="ls-txt" x="411" y="188">[U .. Z]</text>

        <text class="ls-lbl" x="495" y="52" fill="#f8fafc">RUM Tradeoff Triangle:</text>
        <text class="ls-lbl" x="495" y="78">• B+ Tree: Fast Reads, High Random WA</text>
        <text class="ls-lbl" x="495" y="104">• LSM STCS: Min WA, High Space Amp</text>
        <text class="ls-lbl" x="495" y="130">• LSM LCS: Min Space Amp (≤11%),</text>
        <text class="ls-lbl" x="495" y="152">  Fast Point Reads via Bloom Filters</text>
        <text class="ls-lbl" x="495" y="185" fill="#f87171">Note: Range scans must merge-join</text>
        <text class="ls-lbl" x="495" y="205" fill="#f87171">iterators across ALL levels (no Bloom)!</text>
      </svg>

      <div class="mermaid">
flowchart LR
  Write["put(K, V) / del(K)"] --> WAL["1. Append to Disk WAL\n(Sequential O(1) I/O)"]
  WAL --> Mem["2. Insert into RAM MemTable\n(SkipList O(log N))"]
  Mem -- "MemTable Full (64MB)" --> Flush["3. Flush to L0 SSTable\n+ Build Bloom Filter &amp; Index"]
  Flush -- "L0 Count >= 4" --> Compact["4. K-Way Merge Compaction\ninto L1 → L2 → ... → Lk\n(Purge Tombstones at bottom level)"]
      </div>

      <div class="hardware-box">
        <h4>Hardware Reality: Why Range Queries Bypass Standard Bloom Filters (and How Prefix/SuRF Filters Help)</h4>
        <p>A standard Bloom Filter hashes an exact key $h(K)$, so it can answer <code>get("user:42")</code> by skipping 99% of SSTables, reducing a point lookup to $\\le 1$ disk read. However, for a <strong>short range scan</strong> (<code>SELECT * FROM events WHERE key BETWEEN "user:42:00" AND "user:42:99"</code>), a standard Bloom Filter is completely useless because you cannot hash every possible string in a continuous interval! Consequently, an LSM range iterator must seek into <em>every $L_0$ SSTable and one SSTable at every level $L_1 \\dots L_k$</em>. RocksDB mitigates this with <strong>Prefix Bloom Filters</strong> (hashing a fixed key prefix like <code>"user:42"</code>) or Zhang et al.'s <strong>SuRF (Succinct Range Filter, SIGMOD 2018)</strong> based on Fast Succinct Tries.</p>
      </div>

      <h2>Implementation: LSM Compaction Stream Merger with MVCC Sequence &amp; Tombstone Elision</h2>
      <pre><code class="language-cpp">// C++20: LSM Compaction K-Way Deduplicator &amp; Bottommost-Level Tombstone Elision
#include &lt;vector&gt;
#include &lt;string&gt;

struct LSMRecord {
    std::string key;
    std::string value;
    uint64_t seqNo;     // Monotonically increasing MVCC transaction timestamp
    bool isTombstone;   // True if this record is a DELETE marker
};

// Given sorted records from K merged SSTable runs (ordered by key ASC, then seqNo DESC),
// deduplicates shadowed versions and drops tombstones if compacting into the bottommost level.
std::vector&lt;LSMRecord&gt; compactSortedStream(
    const std::vector&lt;LSMRecord&gt;&amp; mergedStream,
    uint64_t oldestActiveSnapshotSeq,
    bool isBottommostLevel
) {
    std::vector&lt;LSMRecord&gt; output;
    for (size_t i = 0; i &lt; mergedStream.size(); ++i) {
        const auto&amp; rec = mergedStream[i];
        // Skip older versions of the same key if shadowed by a version &lt;= oldestActiveSnapshotSeq
        if (!output.empty() &amp;&amp; output.back().key == rec.key &amp;&amp;
            output.back().seqNo &lt;= oldestActiveSnapshotSeq) {
            continue;
        }
        // Physical deletion: only drop a tombstone when it reaches the bottommost level
        // AND no older snapshot can see past it!
        if (rec.isTombstone &amp;&amp; isBottommostLevel &amp;&amp; rec.seqNo &lt;= oldestActiveSnapshotSeq) {
            continue;
        }
        output.push_back(rec);
    }
    return output;
}</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Dropping Tombstones Above the Bottommost Level Resurrects Deleted Data ("Zombie Keys"):</strong> If Compaction merges $L_1$ and $L_2$ and discards a Tombstone for key $K$ while an older version of $K$ still sits in $L_3$, subsequent reads will fall through $L_1$ and $L_2$ and return the deleted value from $L_3$! A tombstone can <em>only</em> be physically dropped when it reaches the bottommost level (or when Bloom/range metadata proves no SSTable at any deeper level contains $K$).</li>
          <li><strong>RocksDB Tombstone Scan Degradation ("Delete-Heavy Queue Anti-Pattern"):</strong> Using an LSM-Tree as a FIFO queue (<code>insert</code> at tail, <code>delete</code> at head, then <code>seekToFirst()</code>) accumulates millions of consecutive tombstones at the start of the keyspace before compaction catches up—causing <code>seekToFirst()</code> to scan past millions of dead tombstones in $O(N)$ time!</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "LSM-Trees convert random writes, updates, and deletes into sequential appends via an in-memory MemTable + WAL that flushes immutable SSTables to disk.",
      "Deletions write Tombstone markers; a tombstone cannot be garbage-collected until compaction reaches the bottommost level, otherwise older versions in deeper levels resurrect as zombie keys.",
      "Leveled Compaction (RocksDB) minimizes Space Amplification (≤ 11% stale overhead) at the cost of higher Write Amplification O(T log_T N), whereas Size-Tiered Compaction (Cassandra) minimizes Write Amplification O(log_T N) at the cost of higher temporary Space Amplification.",
      "Bloom Filters reduce LSM point-lookup Read Amplification to ~1 disk read, but standard Bloom Filters cannot prune arbitrary range scans unless paired with Prefix Bloom Filters or Succinct Range Filters (SuRF)."
    ],
    furtherReading: [
      { title: "O'Neil, P., Cheng, E., Gawlick, D., & O'Neil, E. (1996): The Log-Structured Merge-Tree (LSM-Tree) (Acta Informatica)", url: "https://doi.org/10.1007/s002360050048" },
      { title: "Athanassoulis, M. et al. (2016): Designing Access Methods: The RUM Conjecture (EDBT / Harvard DASlab)", url: "https://doi.org/10.5441/002/edbt.2016.42" },
      { title: "RocksDB Wiki (Meta Engineering) — Leveled vs Universal / Size-Tiered Compaction", url: "https://github.com/facebook/rocksdb/wiki/Compaction" }
    ]
  },

  "persistent-trees-path-copying": {
    title: "Persistent Data Structures: Path Copying, Fat Nodes & Fractional Cascading Time Travel",
    video: {
      youtubeId: "T0yzrZL1py0",
      title: "MIT 6.851 Advanced Data Structures Lecture 1: Persistent Data Structures",
      channel: "MIT OpenCourseWare",
      duration: "1:22:55",
      start: 0,
      length: "83m",
      why: "Erik Demaine covers Partial, Full, Confluent, and Functional Persistence, Path Copying vs Sleator-Tarjan Node Splitting, and planar point location via persistent BSTs."
    },
    intuition: "<p>An ordinary data structure is <strong>ephemeral</strong>: mutating it destroys the previous version in place. A <strong>persistent data structure</strong> preserves all historical versions simultaneously so you can query any past version $V_t$ (<strong>Partial Persistence</strong>) or even branch and mutate any historical version to form a version tree (<strong>Full Persistence</strong>) or merge two historical branches (<strong>Confluent Persistence</strong>, as in Git commits)!</p><p>How can you modify a balanced BST of $N = 10^6$ nodes and retain the complete old version without copying all $10^6$ nodes ($O(N)$ space per update)? Through <strong>Path Copying (Structural Sharing)</strong>: because a point insertion or update in a tree of height $h = O(\\log N)$ only modifies nodes along a single root-to-leaf spine, we allocate $O(\\log N)$ new nodes along that path and point all their unmodified off-path child pointers directly into the existing subtrees of the previous version!</p>",
    content: `<div class="lesson-content">
      <h2>Path Copying vs Fat Nodes vs Sleator–Tarjan Node-Splitting Method</h2>
      <p>Driscoll, Sarnak, Sleator, and Tarjan (1989) formalized four levels of persistence and three structural implementation techniques:</p>
      <ol>
        <li><strong>Path Copying (Functional / Purely Immutable Persistence — Okasaki 1998):</strong> Every node is strictly immutable. Modifying a leaf allocates a new leaf and recursively allocates a new copy of each ancestor up to a new root <code>roots[version]</code>, sharing all unmodified sibling subtrees. Achieves <strong>Full Persistence</strong> with $O(\\log N)$ time and $O(\\log N)$ space per update, and zero synchronization locks across concurrent reader threads!</li>
        <li><strong>Fat Nodes:</strong> Instead of copying ancestor nodes, allow each node to store an arbitrarily long version-stamped modification history <code>mods = [(v₁, field, val₁), (v₂, field, val₂), ...]</code>. Uses $O(1)$ space per update, but looking up a pointer at version $v$ requires binary searching the node's modification log, slowing down every pointer dereference by $O(\\log M)$!</li>
        <li><strong>Sleator–Tarjan Bounded In-Degree Node Splitting (1989):</strong> Combines the $O(1)$ space of Fat Nodes with the $O(1)$ pointer traversal of Path Copying! For any pointer-based data structure where every node has <strong>bounded in-degree $\\le k$</strong> (for a tree without parent pointers, in-degree is $1$), give each node $2k$ extra modification slots (<code>mods</code>). As long as a node has a free mod slot, updates take $O(1)$ space without copying; when a node overflows its $2k$ slots, split (clone) the node and propagate pointer updates to its $\\le k$ predecessors. By potential analysis with $\\Phi$ proportional to full mod slots, this achieves <strong>$O(1)$ amortized space and $O(1)$ slowdown per pointer step</strong>!</li>
      </ol>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Persistence Technique</th>
            <th>Update Time (BST)</th>
            <th>Space per Update</th>
            <th>Query Time at Version $v$</th>
            <th>Supports Full / Functional Persistence?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Naive Deep Clone</td>
            <td><span class="badge-on">Θ(N)</span></td>
            <td><span class="badge-on">Θ(N) Words</span></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td>Yes</td>
          </tr>
          <tr>
            <td><strong>Path Copying (Structural Sharing)</strong></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-ologn">O(log N) Words</span></td>
            <td><span class="badge-ologn">O(log N) (Zero overhead!)</span></td>
            <td><span class="badge-o1">Yes (Purely Functional &amp; Lock-Free)</span></td>
          </tr>
          <tr>
            <td>Fat Nodes (Unbounded Mod Log)</td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-o1">O(1) Words</span></td>
            <td><span class="badge-onlogn">O(log N · log M)</span></td>
            <td>Partial Only (Full needs Dietz-Sleator order list)</td>
          </tr>
          <tr>
            <td><strong>Sleator–Tarjan Node Splitting</strong></td>
            <td><span class="badge-ologn">O(log N) Amortized</span></td>
            <td><span class="badge-o1">O(1) Amortized!</span></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td>Yes (Partial &amp; Full via Order Maintenance)</td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Why Parent Pointers Break Path Copying (In-Degree Explosion)</h4>
        <p>Why must purely functional persistent trees omit <code>parent</code> pointers? In a downward-directed binary tree, every node has <strong>in-degree $1$</strong> (only its parent points to it), so replacing a node $u$ with $u'$ only requires updating 1 pointer in $u$'s parent (propagating $O(h)$ steps up to the root). If every child also stores a <code>parent</code> pointer back up to $u$, then $u$ has <strong>in-degree $3$</strong> (its parent and both its children point to $u$)! Updating $u$ to $u'$ would force cloning $u$'s children so their <code>parent</code> pointers point to $u'$, which in turn forces cloning their children, cascading across all $\\Theta(N)$ nodes of the entire tree!</p>
      </div>

      <div class="simulator-mount" data-sim="sim-persistent-path-copying"></div>

      <svg viewBox="0 0 720 225" width="100%" height="225" role="img" aria-label="Path Copying in a Persistent Binary Search Tree showing shared subtrees between Root V0 and Root V1">
        <defs>
          <style>
            .ps-old { stroke: #475569; stroke-width: 2; }
            .ps-new { stroke: #10b981; stroke-width: 2.4; }
            .ps-share { stroke: #38bdf8; stroke-width: 2.2; stroke-dasharray: 5 3; }
            .ps-n0 { fill: #0f172a; stroke: #94a3b8; stroke-width: 2; }
            .ps-n1 { fill: #064e3b; stroke: #10b981; stroke-width: 2.2; }
            .ps-lbl { fill: #f8fafc; font-family: monospace; font-size: 12.5px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
            .ps-txt { fill: #cbd5e1; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <text class="ps-txt" x="25" y="24" fill="#94a3b8">Version 0 (Root V₀): Immutable</text>
        <line class="ps-old" x1="130" y1="60" x2="70" y2="125"/>
        <line class="ps-old" x1="130" y1="60" x2="190" y2="125"/>
        <line class="ps-old" x1="70" y1="125" x2="40" y2="190"/>
        <line class="ps-old" x1="70" y1="125" x2="100" y2="190"/>
        <circle class="ps-n0" cx="130" cy="60" r="18"/><text class="ps-lbl" x="130" y="60">8</text>
        <circle class="ps-n0" cx="70" cy="125" r="18"/><text class="ps-lbl" x="70" y="125">4</text>
        <circle class="ps-n0" cx="190" cy="125" r="18"/><text class="ps-lbl" x="190" y="125">12</text>
        <circle class="ps-n0" cx="40" cy="190" r="17"/><text class="ps-lbl" x="40" y="190">2</text>
        <circle class="ps-n0" cx="100" cy="190" r="17"/><text class="ps-lbl" x="100" y="190">6</text>

        <text class="ps-txt" x="265" y="24" fill="#4ade80">Version 1 = insert(V₀, 5): Clones ONLY 3 spine nodes!</text>
        <line class="ps-new" x1="340" y1="60" x2="290" y2="125"/>
        <line class="ps-new" x1="290" y1="125" x2="330" y2="190"/>
        <line class="ps-new" x1="330" y1="190" x2="300" y2="215"/>
        <line class="ps-share" x1="340" y1="60" x2="190" y2="125"/>
        <line class="ps-share" x1="290" y1="125" x2="40" y2="190"/>

        <circle class="ps-n1" cx="340" cy="60" r="18"/><text class="ps-lbl" x="340" y="60">8'</text>
        <circle class="ps-n1" cx="290" cy="125" r="18"/><text class="ps-lbl" x="290" y="125">4'</text>
        <circle class="ps-n1" cx="330" cy="190" r="17"/><text class="ps-lbl" x="330" y="190">6'</text>
        <circle class="ps-n1" cx="300" cy="215" r="14"/><text class="ps-lbl" x="300" y="215">5</text>

        <text class="ps-txt" x="435" y="65" fill="#38bdf8">╌╌ Structural Sharing Edges:</text>
        <text class="ps-txt" x="435" y="90">• 8'.right points directly to V₀'s subtree (12)</text>
        <text class="ps-txt" x="435" y="115">• 4'.left  points directly to V₀'s subtree (2)</text>
        <text class="ps-txt" x="435" y="150" fill="#fbbf24">Applications:</text>
        <text class="ps-txt" x="435" y="175">• Git Commit Trees (Merkle DAG Path Copying)</text>
        <text class="ps-txt" x="435" y="200">• ZFS / Btrfs Copy-on-Write (CoW) B-Trees</text>
      </svg>

      <div class="mermaid">
flowchart LR
  Call["insertPersistent(oldNode, key)"] --> Null{"oldNode == null ?"}
  Null -- "Yes" --> Base["return new Node(key, null, null)"]
  Null -- "No" --> Branch{"key < oldNode.key ?"}
  Branch -- "Yes (Go Left)" --> CloneL["return new Node(oldNode.key,\n  insertPersistent(oldNode.L, key),\n  oldNode.R) // Share oldNode.R!"]
  Branch -- "No (Go Right)" --> CloneR["return new Node(oldNode.key,\n  oldNode.L, // Share oldNode.L!\n  insertPersistent(oldNode.R, key))"]
      </div>

      <div class="hardware-box">
        <h4>Hardware Reality: Copy-on-Write (CoW) Filesystems (ZFS, Btrfs, LMDB) &amp; Bump Arena Allocators</h4>
        <p>Path Copying is the foundational architecture of modern Copy-on-Write filesystems (ZFS, Btrfs, Apple APFS), MVCC embedded databases (LMDB), and functional languages (Clojure/Scala persistent vectors, Git Merkle trees). Because nodes in a Path-Copying tree are immutable once allocated, we never need per-node <code>malloc</code>/<code>free</code> overhead in batch workloads: allocating all version nodes out of a contiguous <strong>bump arena pool</strong> (<code>std::vector&lt;Node&gt; pool</code>) packs each version's $O(\\log N)$ spine nodes side-by-side in a single CPU cache line!</p>
      </div>

      <h2>Implementation: Arena-Backed Persistent Treap with $O(\\log N)$ Path-Copying Split/Merge</h2>
      <pre><code class="language-cpp">// C++20: Purely Functional Persistent Treap using Contiguous Bump-Arena Path Copying
#include &lt;vector&gt;
#include &lt;cstdint&gt;
#include &lt;utility&gt;

class PersistentTreapArena {
    struct Node {
        int key;
        uint64_t prio;
        int left = 0, right = 0; // 0 = null sentinel index in pool
    };
    std::vector&lt;Node&gt; pool;

    int cloneNode(int u) {
        pool.push_back(pool[u]);
        return static_cast&lt;int&gt;(pool.size()) - 1;
    }

public:
    PersistentTreapArena() { pool.push_back({0, 0, 0, 0}); } // Index 0 is null

    int newNode(int key, uint64_t prio) {
        pool.push_back({key, prio, 0, 0});
        return static_cast&lt;int&gt;(pool.size()) - 1;
    }

    // Non-destructively splits version root 'u' into (L, R) by cloning only the O(log N) spine
    std::pair&lt;int, int&gt; splitPersistent(int u, int key) {
        if (u == 0) return {0, 0};
        int copy = cloneNode(u);
        if (pool[copy].key &lt;= key) {
            auto [L, R] = splitPersistent(pool[copy].right, key);
            pool[copy].right = L;
            return {copy, R};
        } else {
            auto [L, R] = splitPersistent(pool[copy].left, key);
            pool[copy].left = R;
            return {L, copy};
        }
    }
};</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Mutating a Shared Child Pointer in Place Corrupts All Historical Versions:</strong> In a persistent tree, a single subtree node may be shared by thousands of historical roots $V_0, V_1, \\dots, V_k$. Writing <code>node->left = ...</code> directly on an existing node instead of on <code>cloneNode(node)</code> silently mutates the past!</li>
          <li><strong>Splay Trees Cannot Be Made Persistently Efficient via Path Copying:</strong> Because <code>splay(x)</code> mutates pointers on every <em>read</em> (<code>find</code>) operation, path-copying a Splay Tree would allocate $O(\\log N)$ new memory on every read query! Always use persistent Treaps, AVL trees, Red-Black trees, or Weight-Balanced trees where reads are 100% non-mutating.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "Partial Persistence allows querying any historical version; Full Persistence allows querying and mutating any historical version (forming a version tree); Confluent Persistence allows merging historical versions (forming a version DAG).",
      "Path Copying clones only the O(log N) nodes along the modified root-to-leaf spine while sharing all unmodified off-path subtrees, achieving Full Persistence with O(log N) time and space per update.",
      "Parent pointers must be omitted in Path-Copying trees because bidirectional edges increase node in-degree to 3, causing pointer updates to cascade across all Θ(N) nodes.",
      "Driscoll, Sarnak, Sleator, and Tarjan's Node-Splitting method achieves O(1) amortized space per update on any pointer structure with bounded in-degree."
    ],
    furtherReading: [
      { title: "Driscoll, J. R., Sarnak, N., Sleator, D. D., & Tarjan, R. E. (1989): Making Data Structures Persistent (JCSS)", url: "https://doi.org/10.1016/0022-0000(89)90034-2" },
      { title: "Okasaki, C. (1998): Purely Functional Data Structures (CMU Ph.D. Thesis / Cambridge University Press)", url: "https://www.cs.cmu.edu/~rwh/students/okasaki.pdf" }
    ]
  },

  "case-linux-rbtree-cfs": {
    title: "Production Case Study: Intrusive Augmented Red-Black Trees in the Linux Kernel CFS & VMA Manager",
    video: {
      youtubeId: "scfDO877bG0",
      title: "Inside the Linux Kernel Scheduler & Red-Black Trees (rbtree)",
      channel: "Linux Foundation / Kernel Recipes",
      duration: "36:40",
      start: 0,
      length: "37m",
      why: "Explains how the Linux kernel embeds struct rb_node intrusively inside task_struct and vm_area_struct with zero dynamic allocations and pointer-colored parent words."
    },
    intuition: "<p>Inside an operating system kernel—specifically inside the CPU scheduler (<code>kernel/sched/fair.c</code>) and the virtual memory allocator (<code>mm/mmap.c</code>)—you <strong>cannot call <code>malloc()</code> or <code>kmalloc()</code> to allocate a tree node wrapper</strong> when scheduling a thread or handling a page fault! Allocating memory inside the scheduler or memory manager itself would trigger circular deadlocks, memory exhaustion panics, and double pointer-indirection cache misses.</p><p>The Linux kernel solves this with <strong>Intrusive Augmented Red-Black Trees (<code>include/linux/rbtree.h</code> and <code>rbtree_augmented.h</code>)</strong>. Instead of a tree node owning a pointer to your struct (<code>Node&lt;Task*&gt;</code>), your <code>struct task_struct</code> or <code>struct vm_area_struct</code> <strong>physically embeds <code>struct rb_node</code> as a member field</strong>, recovers the enclosing struct address at compile time via pointer offset subtraction (<code>container_of</code> / <code>rb_entry</code>), packs the Red/Black color bit into bit 0 of the 8-byte aligned parent pointer (<code>__rb_parent_color</code>), and caches the leftmost node pointer (<code>rb_root_cached</code>) for $O(1)$ minimum retrieval!</p>",
    content: `<div class="lesson-content">
      <h2>Three Kernel Engineering Breakthroughs in Linux <code>rbtree.h</code></h2>
      <h3>1. Intrusive Embedding &amp; <code>container_of(ptr, type, member)</code></h3>
      <p>In C++ <code>std::map</code> or Java <code>TreeMap</code>, inserting an object allocates a heap wrapper containing <code>left</code>, <code>right</code>, <code>parent</code>, <code>color</code>, and a pointer/copy of the payload. In Linux, <code>struct rb_node</code> contains <strong>only three <code>unsigned long</code> words (24 bytes)</strong>: <code>__rb_parent_color</code>, <code>rb_right</code>, and <code>rb_left</code>. It is embedded directly inside the domain struct (and a single domain struct can embed <em>multiple</em> <code>rb_node</code> fields to participate in multiple trees simultaneously with zero heap allocations!). Given a <code>struct rb_node *node</code>, the macro <code>rb_entry(node, struct task_struct, run_node)</code> subtracts the compile-time <code>offsetof(struct task_struct, run_node)</code> in <strong>zero CPU instructions</strong> (folded into the base-displacement addressing mode <code>mov rax, [rdi - 0x48]</code>)!</p>

      <h3>2. <code>rb_root_cached</code>: $O(1)$ <code>rb_first()</code> for the CFS <code>vruntime</code> Scheduler</h3>
      <p>The Linux Completely Fair Scheduler (CFS, introduced in 2.6.23 by Ingo Molnar) orders runnable tasks by their virtual runtime (<code>vruntime</code> in nanoseconds). On every context switch (thousands of times per second per core), CFS must pick the task with the smallest <code>vruntime</code>. Walking down the left spine in $O(\\log N)$ on every context switch would waste precious cycles. Instead, Linux uses <code>struct rb_root_cached</code>, which stores <code>rb_root</code> alongside a cached pointer <code>rb_leftmost</code>. Whenever a new node is inserted and never branches right on its way down, <code>rb_leftmost</code> is updated in $O(1)$—making <code>pick_next_task_fair()</code> a <strong>single $O(1)$ pointer read</strong>!</p>

      <h3>3. Augmented Interval Gap Tree (<code>rb_subtree_gap</code>) in <code>vm_area_struct</code></h3>
      <p>When a process calls <code>mmap()</code> to allocate an unmapped virtual address region of length $L$, the kernel used to scan the linked list of Virtual Memory Areas (VMAs) in $O(N)$ time. Since Linux 3.6, <code>struct vm_area_struct</code> embeds an <strong>Augmented Red-Black Tree</strong> (<code>rbtree_augmented.h</code>) where each VMA node maintains <code>rb_subtree_gap</code>: the maximum contiguous free virtual address gap anywhere in its subtree, computed via custom rotation callbacks (<code>RB_DECLARE_CALLBACKS_MAX</code>) to find a suitable address hole in $O(\\log N)$ time! *(Note: In Linux 6.1+, VMA tracking has also introduced the RCU-safe B-tree-like Maple Tree alongside <code>rbtree_augmented</code> used in DRM/interval-tree subsystems.)*</p>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Feature / Metric</th>
            <th>Standard Non-Intrusive RB-Tree (<code>std::map</code>)</th>
            <th>Linux Kernel Intrusive <code>rb_root_cached</code></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dynamic Heap Allocations on Insert</td>
            <td>1 <code>operator new</code> call per insert</td>
            <td><span class="badge-o1">0 Allocations (Pre-embedded in struct!)</span></td>
          </tr>
          <tr>
            <td>Color Storage Overhead</td>
            <td>4–8 bytes (due to struct alignment padding)</td>
            <td><span class="badge-o1">0 Bytes (Bit 0 of <code>__rb_parent_color</code>)</span></td>
          </tr>
          <tr>
            <td>Minimum Element Lookup (<code>rb_first</code>)</td>
            <td><span class="badge-ologn">O(log N) left-spine walk</span></td>
            <td><span class="badge-o1">O(1) via <code>rb_root_cached.rb_leftmost</code></span></td>
          </tr>
          <tr>
            <td>Cache Lines Touched per Comparison</td>
            <td>2 (Tree node wrapper $\\to$ payload pointer)</td>
            <td><span class="badge-o1">1 (<code>rb_node</code> sits in same cache line as key!)</span></td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Bit-Level Anatomy of <code>__rb_parent_color</code> &amp; <code>container_of</code></h4>
        <p>Because <code>struct rb_node</code> contains <code>unsigned long</code> fields, the C ABI aligns every <code>struct rb_node</code> to at least a 4-byte or 8-byte boundary. Therefore, the least significant 2 bits of any <code>struct rb_node *</code> address are guaranteed to be <code>00</code>:</p>
        <p>$$\\text{rb\\_parent}(r) = (\\text{struct rb\\_node }*)\\big(r\\to\\text{\\_\\_rb\\_parent\\_color} \\;\\&\\; \\sim 3\\text{UL}\\big)$$</p>
        <p>$$\\text{rb\\_color}(r) = r\\to\\text{\\_\\_rb\\_parent\\_color} \\;\\&\\; 1\\text{UL} \\quad (0 = \\text{RB\\_RED}, \\; 1 = \\text{RB\\_BLACK})$$</p>
        <p>And given a pointer <code>ptr</code> to member <code>member</code> inside <code>type</code>, <code>container_of</code> recovers the outer struct pointer via standard byte-pointer arithmetic:</p>
        <p>$$\\text{container\\_of}(\\text{ptr}, \\text{type}, \\text{member}) = (\\text{type }*)\\big((\\text{char }*)\\text{ptr} - \\text{offsetof}(\\text{type}, \\text{member})\\big)$$</p>
      </div>

      <div class="simulator-mount" data-sim="sim-interval-order-statistic-tree"></div>

      <svg viewBox="0 0 720 220" width="100%" height="220" role="img" aria-label="Intrusive struct rb_node embedded inside Linux task_struct with container_of offset and rb_root_cached">
        <defs>
          <style>
            .lk-outer { fill: #0f172a; stroke: #38bdf8; stroke-width: 2; }
            .lk-inner { fill: #064e3b; stroke: #10b981; stroke-width: 2; }
            .lk-cache { fill: #311042; stroke: #a855f7; stroke-width: 2; }
            .lk-txt { fill: #f8fafc; font-family: monospace; font-size: 12px; font-weight: 700; }
            .lk-sub { fill: #cbd5e1; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <rect class="lk-outer" x="20" y="25" width="350" height="175" rx="8"/>
        <text class="lk-txt" x="35" y="48" fill="#38bdf8">struct sched_entity (Base Address = 0x1000)</text>
        <text class="lk-sub" x="35" y="72">+0x00: struct load_weight load;</text>
        <rect class="lk-inner" x="35" y="84" width="320" height="72" rx="5"/>
        <text class="lk-txt" x="48" y="104" fill="#4ade80">+0x18: struct rb_node run_node; (24 Bytes)</text>
        <text class="lk-sub" x="48" y="124">• __rb_parent_color = (parent_ptr | color_bit)</text>
        <text class="lk-sub" x="48" y="143">• rb_right, rb_left</text>
        <text class="lk-txt" x="35" y="180" fill="#fbbf24">+0x30: u64 vruntime; (Same 64B Cache Line!)</text>

        <rect class="lk-cache" x="405" y="25" width="295" height="80" rx="6"/>
        <text class="lk-txt" x="420" y="48" fill="#c084fc">struct rb_root_cached</text>
        <text class="lk-sub" x="420" y="72">• rb_root.rb_node  → Tree Root</text>
        <text class="lk-sub" x="420" y="92">• rb_leftmost      → Min vruntime (O(1)!)</text>

        <text class="lk-sub" x="405" y="135" fill="#4ade80">rb_entry(ptr, struct sched_entity, run_node):</text>
        <text class="lk-sub" x="405" y="158">  (char*)ptr - 0x18 = 0x1000 (Zero extra loads!)</text>
        <text class="lk-sub" x="405" y="188">Zero malloc/free during context switch!</text>
      </svg>

      <div class="mermaid">
flowchart LR
  Insert["cfs_enqueue_entity(cfs_rq, se)"] --> Walk["Walk down rb_root_cached\nTrack bool leftmost = true\n(Set leftmost = false if branching right)"]
  Walk --> Cache{"leftmost == true ?"}
  Cache -- "Yes" --> SetMin["cfs_rq->rb_leftmost = &se->run_node\n(O(1) update of min vruntime!)"]
  Cache -- "No" --> Rebal["rb_insert_color(&se->run_node)"]
  SetMin --> Rebal
      </div>

      <div class="hardware-box">
        <h4>Hardware Reality: Co-Locating <code>rb_node</code> and <code>vruntime</code> in the Same 64-Byte Cache Line</h4>
        <p>Look closely at <code>struct sched_entity</code> in <code>include/linux/sched.h</code>: the kernel developers deliberately placed <code>struct rb_node run_node</code> (24 bytes) immediately adjacent to <code>u64 vruntime</code> (8 bytes) inside the first 64-byte cache line of <code>sched_entity</code>. When the CPU traverses <code>node = node->rb_left</code> and loads the cache line containing <code>run_node</code>, <strong>the comparison key <code>vruntime</code> is already sitting in that exact same 64-byte L1 cache line</strong>! A non-intrusive tree would suffer two dependent cache misses per level (one to load the tree node, a second to chase the pointer to the <code>sched_entity</code>).</p>
      </div>

      <h2>Implementation: Linux-Style Intrusive Augmented RB-Node &amp; <code>container_of</code></h2>
      <pre><code class="language-cpp">// C11 / C++20: Linux Kernel-Style Intrusive RB-Node with Tagged Parent-Color &amp; container_of
#include &lt;cstddef&gt;
#include &lt;cstdint&gt;

struct alignas(8) rb_node {
    uintptr_t __rb_parent_color; // Bit 0: 0 = RED, 1 = BLACK; Bits [63:2] = parent pointer
    rb_node* rb_right = nullptr;
    rb_node* rb_left  = nullptr;

    rb_node* parent() const noexcept {
        return reinterpret_cast&lt;rb_node*&gt;(__rb_parent_color &amp; ~uintptr_t(3));
    }
    bool is_black() const noexcept { return (__rb_parent_color &amp; 1U) != 0; }
    void set_parent_and_color(rb_node* p, int color) noexcept {
        __rb_parent_color = reinterpret_cast&lt;uintptr_t&gt;(p) | (color &amp; 1U);
    }
};

struct rb_root_cached {
    rb_node* rb_node_root = nullptr;
    rb_node* rb_leftmost  = nullptr; // O(1) access to minimum element
};

#define rb_entry(ptr, type, member) \
    reinterpret_cast&lt;type*&gt;(reinterpret_cast&lt;char*&gt;(ptr) - offsetof(type, member))

// Example Domain Object: Runnable Task Entity with Zero-Allocation Intrusive Node
struct TaskEntity {
    uint64_t pid;
    rb_node run_node;      // Co-located in the same cache line as vruntime!
    uint64_t vruntime;
};

inline TaskEntity* pickNextTaskO1(const rb_root_cached&amp; rq) noexcept {
    if (!rq.rb_leftmost) return nullptr;
    return rb_entry(rq.rb_leftmost, TaskEntity, run_node);
}</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Inserting an Already-Linked Intrusive <code>rb_node</code> Into a Second Tree Instance:</strong> Because an intrusive <code>rb_node</code> lives inside the object itself, inserting an object into Tree B while it is still linked inside Tree A overwrites its <code>rb_left</code>/<code>rb_right</code>/<code>__rb_parent_color</code> pointers in place, instantly corrupting Tree A! If an object must belong to two trees simultaneously, it must embed <em>two distinct <code>rb_node</code> fields</em> (e.g., <code>rb_node by_vruntime;</code> and <code>rb_node by_pid;</code>).</li>
          <li><strong>Misaligned <code>rb_node</code> Corrupting the Color Bit:</strong> If a struct containing <code>rb_node</code> is packed with <code>__attribute__((packed))</code> so that <code>&node</code> sits at an odd byte address, bit 0 of the pointer is <code>1</code>, colliding with <code>RB_BLACK</code>! Always enforce <code>alignas(sizeof(long))</code> on <code>struct rb_node</code>.</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "Intrusive trees embed struct rb_node directly inside the domain struct and recover the enclosing object via container_of / rb_entry pointer subtraction with zero dynamic heap allocations.",
      "Co-locating rb_node (24B) and the comparison key (vruntime, 8B) in the same 64B cache line eliminates the second pointer-indirection cache miss at every tree level.",
      "Packing the Red/Black color bit into bit 0 of the 8-byte aligned parent pointer (__rb_parent_color) eliminates 8 bytes of struct alignment padding per node.",
      "Linux's rb_root_cached maintains a direct pointer to rb_leftmost, turning CFS scheduler minimum-vruntime selection into an O(1) pointer read."
    ],
    furtherReading: [
      { title: "Linux Kernel Documentation — Red-Black Trees (rbtree) and Augmented rbtrees in Linux", url: "https://www.kernel.org/doc/html/latest/core-api/rbtree.html" },
      { title: "Linux Kernel Source — include/linux/rbtree_augmented.h (Augmented RB-Tree Rotation Callbacks)", url: "https://github.com/torvalds/linux/blob/master/include/linux/rbtree_augmented.h" }
    ]
  },

  "build-llrb-order-statistic-tree": {
    title: "Build Lab: Left-Leaning Red-Black (LLRB) Order-Statistic Tree with rank and select",
    video: {
      youtubeId: "xA5vP2wW8wI",
      title: "Order Statistic Trees & Left-Leaning Red-Black Augmentation",
      channel: "Princeton Algorithms / Sedgewick",
      duration: "22:18",
      start: 0,
      length: "22m",
      why: "Synthesizes Sedgewick's LLRB 2-3 rotation invariants with subtree size augmentation to support O(log N) rank, select, and range count queries."
    },
    intuition: "<p>Standard C++ (<code>std::set</code>, <code>std::map</code>), Java (<code>TreeSet</code>, <code>TreeMap</code>), and Go/Rust collections share a frustrating limitation: even though their keys are stored in a balanced search tree, they only expose bidirectional iterators—so computing the index of a key (<code>rank(key)</code>), looking up the $k$-th smallest key by index (<code>select(k)</code>), or counting how many elements fall in $[lo, hi]$ (<code>rangeCount(lo, hi)</code>) degrades to an $O(N)$ linear iterator walk!</p><p>In this Build Lab, you will combine Sedgewick's <strong>Left-Leaning Red-Black (LLRB) Tree</strong> with the <strong>CLRS Order-Statistic Augmentation (<code>sz = 1 + sz(left) + sz(right)</code>)</strong>. Because LLRB encapsulates all structural rebalancing into <code>rotateLeft</code>, <code>rotateRight</code>, and <code>flipColors</code>, maintaining exact subtree sizes requires only <strong>two lines of size transfer inside the rotation helpers</strong>—giving you a complete, self-contained $O(\\log N)$ Order-Statistic Set in under 95 lines of production C++!</p>",
    content: `<div class="lesson-content">
      <h2>Architectural Synthesis: LLRB Rebalancing + Subtree Size Invariant</h2>
      <p>Let us trace how <code>sz</code> (subtree node count) interacts with the three LLRB primitive transformations:</p>
      <ol>
        <li><strong><code>rotateLeft(h)</code> (promotes $x = h.\\text{right}$ above $h$):</strong> Before rotation, $h$ was the root of the local subtree; after rotation, $x$ is the root of the exact same set of nodes! Therefore, we set <code>x-&gt;sz = h-&gt;sz</code> and recompute <code>h-&gt;sz = 1 + size(h-&gt;left) + size(h-&gt;right)</code> in $O(1)$ time.</li>
        <li><strong><code>rotateRight(h)</code> (promotes $x = h.\\text{left}$ above $h$):</strong> Symmetric—set <code>x-&gt;sz = h-&gt;sz</code> and recompute <code>h-&gt;sz = 1 + size(h-&gt;left) + size(h-&gt;right)</code>.</li>
        <li><strong><code>flipColors(h)</code>:</strong> Only flips boolean color bits without changing any parent-child links, so all <code>sz</code> fields remain untouched!</li>
      </ol>
      <p>With <code>sz</code> maintained at every node, we unlock three $O(\\log N)$ analytical queries:</p>
      <ul>
        <li><strong><code>rank(key)</code>:</strong> Returns the exact number of elements in the set strictly less than <code>key</code> ($|\\{x \\in S : x &lt; \\text{key}\\}|$).</li>
        <li><strong><code>select(k)</code> ($0 \\le k &lt; N$):</strong> Returns the unique key $x \\in S$ whose <code>rank(x) == k</code>.</li>
        <li><strong><code>rangeCount(lo, hi)</code> ($lo \\le hi$):</strong> Returns the number of keys in the closed interval $[lo, hi]$ in $O(\\log N)$ time via <code>rank(hi) - rank(lo) + (contains(hi) ? 1 : 0)</code>!</li>
      </ul>

      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Order-Statistic Method</th>
            <th>LLRB Order-Statistic Tree</th>
            <th>Unaugmented <code>std::set</code> / <code>TreeMap</code></th>
            <th>Sorted <code>std::vector</code></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>insert(key)</code> / <code>erase(key)</code></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-on">O(N) Shift</span></td>
          </tr>
          <tr>
            <td><code>rank(key)</code> (Count $&lt; \\text{key}$)</td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-on">O(N) <code>std::distance</code></span></td>
            <td><span class="badge-ologn">O(log N) <code>lower_bound</code></span></td>
          </tr>
          <tr>
            <td><code>select(k)</code> ($k$-th Smallest)</td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-on">O(N) <code>std::advance</code></span></td>
            <td><span class="badge-o1">O(1) <code>vec[k]</code></span></td>
          </tr>
          <tr>
            <td><code>rangeCount(lo, hi)</code></td>
            <td><span class="badge-ologn">O(log N)</span></td>
            <td><span class="badge-on">O(N)</span></td>
            <td><span class="badge-ologn">O(log N)</span></td>
          </tr>
        </tbody>
      </table>

      <div class="invariant-box">
        <h4>Exact Dual Identity Between <code>rank</code> and <code>select</code></h4>
        <p>For any Order-Statistic Tree $T$ storing $N$ distinct keys:</p>
        <p>$$\\forall k \\in \\{0, 1, \\dots, N-1\\}: \\quad \\text{rank}(\\text{select}(k)) == k$$</p>
        <p>$$\\forall x \\in T: \\quad \\text{select}(\\text{rank}(x)) == x$$</p>
        <p>Furthermore, for any query key $q$ (even if $q \\notin T$), $\\text{rank}(q)$ satisfies the recursive invariant at node $u$:</p>
        <p>$$\\text{rank}(u, q) = \\begin{cases} 0 &amp; \\text{if } u == \\text{null} \\\\ \\text{rank}(u.\\text{left}, q) &amp; \\text{if } q &lt; u.\\text{key} \\\\ \\text{size}(u.\\text{left}) &amp; \\text{if } q == u.\\text{key} \\\\ 1 + \\text{size}(u.\\text{left}) + \\text{rank}(u.\\text{right}, q) &amp; \\text{if } q &gt; u.\\text{key} \\end{cases}$$</p>
      </div>

      <div class="simulator-mount" data-sim="sim-avl-red-black-tree"></div>

      <svg viewBox="0 0 720 220" width="100%" height="220" role="img" aria-label="LLRB Order-Statistic Tree rotation preserving subtree size sz and answering rank and select">
        <defs>
          <style>
            .os-blk { stroke: #94a3b8; stroke-width: 2; }
            .os-red { stroke: #ef4444; stroke-width: 3; }
            .os-nd { fill: #0f172a; stroke: #38bdf8; stroke-width: 2; }
            .os-rnd { fill: #450a0a; stroke: #ef4444; stroke-width: 2.2; }
            .os-lbl { fill: #f8fafc; font-family: monospace; font-size: 11.5px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
            .os-txt { fill: #cbd5e1; font-family: monospace; font-size: 11px; }
          </style>
        </defs>
        <text class="os-txt" x="20" y="24" fill="#38bdf8">LLRB Order-Statistic Node (Key | sz): Red links lean left</text>
        <line class="os-red" x1="190" y1="55" x2="105" y2="120"/>
        <line class="os-blk" x1="190" y1="55" x2="265" y2="120"/>
        <line class="os-blk" x1="105" y1="120" x2="55" y2="185"/>
        <line class="os-blk" x1="105" y1="120" x2="155" y2="185"/>
        <line class="os-red" x1="265" y1="120" x2="230" y2="185"/>

        <circle class="os-nd" cx="190" cy="55" r="22"/><text class="os-lbl" x="190" y="55">20|6</text>
        <circle class="os-rnd" cx="105" cy="120" r="22"/><text class="os-lbl" x="105" y="120">10|3</text>
        <circle class="os-nd" cx="265" cy="120" r="22"/><text class="os-lbl" x="265" y="120">30|2</text>
        <circle class="os-nd" cx="55" cy="185" r="20"/><text class="os-lbl" x="55" y="185">5|1</text>
        <circle class="os-nd" cx="155" cy="185" r="20"/><text class="os-lbl" x="155" y="185">15|1</text>
        <circle class="os-rnd" cx="230" cy="185" r="20"/><text class="os-lbl" x="230" y="185">25|1</text>

        <text class="os-txt" x="345" y="48" fill="#4ade80">Trace select(k = 4) (0-indexed 5th smallest):</text>
        <text class="os-txt" x="345" y="75">1. At (20|6): leftSz = sz(10|3) = 3. Since k=4 &gt; 3:</text>
        <text class="os-txt" x="345" y="98">   k' = 4 - (3 + 1) = 0; descend right to (30|2)</text>
        <text class="os-txt" x="345" y="125">2. At (30|2): leftSz = sz(25|1) = 1. Since k'=0 &lt; 1:</text>
        <text class="os-txt" x="345" y="148">   descend left to (25|1)</text>
        <text class="os-txt" x="345" y="175" fill="#4ade80">3. At (25|1): leftSz = 0 == k' ⇒ Return 25!</text>
        <text class="os-txt" x="345" y="203" fill="#fbbf24">Rotation Invariant: x.sz = h.sz; h.sz = 1 + sz(h.L) + sz(h.R)</text>
      </svg>

      <div class="mermaid">
flowchart TD
  R["rank(key)"] --> Loop["u = root; count = 0"]
  Loop --> Check{"u != null ?"}
  Check -- "No" --> Ret["return count"]
  Check -- "key < u.key" --> GoL["u = u.left"] --> Check
  Check -- "key == u.key" --> Hit["return count + size(u.left)"]
  Check -- "key > u.key" --> GoR["count += 1 + size(u.left)\nu = u.right"] --> Check
      </div>

      <div class="hardware-box">
        <h4>Hardware Reality: Iterative <code>rank</code> and <code>select</code> Without Recursion</h4>
        <p>While LLRB <code>insert</code> uses bottom-up recursion along the $O(\\log N)$ path so rotations can unwind cleanly, <code>rank(key)</code>, <code>select(k)</code>, and <code>contains(key)</code> are read-only downward walks! Writing <code>rank</code>, <code>select</code>, and <code>contains</code> as tight <code>while (u != nullptr)</code> loops avoids all stack-frame push/pop overhead and executes in $\\le 2 \\log_2 N$ branch-predicted pointer hops.</p>
      </div>

      <h2>Production Reference Implementation: Complete LLRB Order-Statistic Tree</h2>
      <pre><code class="language-cpp">// C++20: Complete Left-Leaning Red-Black (LLRB) Order-Statistic Tree
#include &lt;cstdint&gt;
#include &lt;cassert&gt;

template &lt;typename Key&gt;
class LLRBOrderStatisticTree {
    struct Node {
        Key key;
        int32_t sz = 1;
        bool red = true;
        Node *left = nullptr, *right = nullptr;
        explicit Node(Key k) : key(k) {}
    };

    Node* root = nullptr;

    static bool isRed(const Node* u) noexcept { return u != nullptr &amp;&amp; u-&gt;red; }
    static int32_t size(const Node* u) noexcept { return u ? u-&gt;sz : 0; }
    static void pull(Node* u) noexcept { u-&gt;sz = 1 + size(u-&gt;left) + size(u-&gt;right); }

    static Node* rotateLeft(Node* h) noexcept {
        Node* x = h-&gt;right;
        h-&gt;right = x-&gt;left;
        x-&gt;left = h;
        x-&gt;red = h-&gt;red;
        h-&gt;red = true;
        x-&gt;sz = h-&gt;sz; // x replaces h as root of this exact subtree
        pull(h);        // Recompute demoted node h
        return x;
    }

    static Node* rotateRight(Node* h) noexcept {
        Node* x = h-&gt;left;
        h-&gt;left = x-&gt;right;
        x-&gt;right = h;
        x-&gt;red = h-&gt;red;
        h-&gt;red = true;
        x-&gt;sz = h-&gt;sz;
        pull(h);
        return x;
    }

    static void flipColors(Node* h) noexcept {
        h-&gt;red = !h-&gt;red;
        h-&gt;left-&gt;red = !h-&gt;left-&gt;red;
        h-&gt;right-&gt;red = !h-&gt;right-&gt;red;
    }

    static Node* insertRec(Node* h, const Key&amp; key) {
        if (!h) return new Node(key);
        if (key &lt; h-&gt;key)      h-&gt;left  = insertRec(h-&gt;left, key);
        else if (h-&gt;key &lt; key) h-&gt;right = insertRec(h-&gt;right, key);

        if (isRed(h-&gt;right) &amp;&amp; !isRed(h-&gt;left))      h = rotateLeft(h);
        if (isRed(h-&gt;left)  &amp;&amp; isRed(h-&gt;left-&gt;left))  h = rotateRight(h);
        if (isRed(h-&gt;left)  &amp;&amp; isRed(h-&gt;right))       flipColors(h);

        pull(h);
        return h;
    }

public:
    int32_t size() const noexcept { return size(root); }

    void insert(const Key&amp; key) {
        root = insertRec(root, key);
        root-&gt;red = false; // Root is always Black
    }

    bool contains(const Key&amp; key) const noexcept {
        const Node* u = root;
        while (u) {
            if (key &lt; u-&gt;key)      u = u-&gt;left;
            else if (u-&gt;key &lt; key) u = u-&gt;right;
            else return true;
        }
        return false;
    }

    // Number of keys strictly less than 'key' in O(log N) time
    int32_t rank(const Key&amp; key) const noexcept {
        const Node* u = root;
        int32_t count = 0;
        while (u) {
            if (key &lt; u-&gt;key) {
                u = u-&gt;left;
            } else if (u-&gt;key &lt; key) {
                count += 1 + size(u-&gt;left);
                u = u-&gt;right;
            } else {
                return count + size(u-&gt;left);
            }
        }
        return count;
    }

    // 0-indexed k-th smallest key in O(log N) time
    const Key&amp; select(int32_t k) const noexcept {
        assert(k &gt;= 0 &amp;&amp; k &lt; size(root));
        const Node* u = root;
        while (u) {
            int32_t leftSz = size(u-&gt;left);
            if (k == leftSz) return u-&gt;key;
            if (k &lt; leftSz) {
                u = u-&gt;left;
            } else {
                k -= (leftSz + 1);
                u = u-&gt;right;
            }
        }
        return root-&gt;key;
    }

    // Count of keys in closed interval [lo, hi] in O(log N) time
    int32_t rangeCount(const Key&amp; lo, const Key&amp; hi) const noexcept {
        if (hi &lt; lo) return 0;
        return rank(hi) - rank(lo) + (contains(hi) ? 1 : 0);
    }
};</code></pre>

      <div class="callout callout-warning">
        <h4>Failure Modes &amp; Adversarial Pitfalls</h4>
        <ul>
          <li><strong>Unconditionally Incrementing <code>h->sz++</code> on Descent When Inserting a Duplicate Key:</strong> If <code>insert(key)</code> is called with a <code>key</code> that already exists in the set, no new leaf is created! Incrementing <code>sz</code> on the way down corrupts every ancestor's size whenever a duplicate is inserted. Always recompute <code>h->sz = 1 + size(h->left) + size(h->right)</code> bottom-up on the way back up (<code>pull(h)</code>).</li>
          <li><strong>Off-By-One in <code>rangeCount(lo, hi)</code>:</strong> Because <code>rank(key)</code> counts elements <em>strictly less than</em> <code>key</code>, <code>rank(hi) - rank(lo)</code> counts keys in the half-open interval $[lo, hi)$. To count the closed interval $[lo, hi]$, you must add $+1$ if <code>contains(hi)</code> is true (or compute <code>rank(hi_successor) - rank(lo)</code>).</li>
        </ul>
      </div>
    </div>`,
    keyTakeaways: [
      "Combining Sedgewick's LLRB 2-3 tree with subtree size augmentation sz(u) = 1 + sz(L) + sz(R) yields a self-balancing Order-Statistic Tree in under 95 lines of code.",
      "Inside rotateLeft(h) and rotateRight(h), the promoted node x inherits x.sz = h.sz while the demoted node h recomputes h.sz = 1 + sz(h.left) + sz(h.right); flipColors(h) does not alter sizes.",
      "Always recompute sz bottom-up via pull(h) after recursive insertion so duplicate key insertions never inflate subtree counts.",
      "Using rank(key) (strictly less than key), closed-interval range counts [lo, hi] equal rank(hi) - rank(lo) + (contains(hi) ? 1 : 0) in O(log N) time."
    ],
    furtherReading: [
      { title: "Princeton Algorithms (Sedgewick & Wayne) — §3.3 Balanced Search Trees (RedBlackBST.java with rank & select)", url: "https://algs4.cs.princeton.edu/33balanced/RedBlackBST.java.html" },
      { title: "Sedgewick, R. (2008): Left-Leaning Red-Black Trees", url: "https://sedgewick.io/wp-content/themes/sedgewick/papers/2008LLRB.pdf" }
    ]
  }
};
