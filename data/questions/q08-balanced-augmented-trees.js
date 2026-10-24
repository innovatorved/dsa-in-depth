window.QUESTION_BANK = window.QUESTION_BANK || {};

window.QUESTION_BANK["tree-rotations-avl-invariants"] = [
  {
    id: "q-avl-1",
    type: "mcq",
    difficulty: "recall",
    title: "Minimum Nodes in an AVL Tree of Height h",
    prompt: "Which recurrence relation defines $N(h)$, the minimum number of nodes in an AVL tree of height $h$ (where a single node has height $0$ and an empty tree has height $-1$)?",
    question: "Select the exact recurrence for $N(h)$:",
    options: [
      "N(h) = 1 + N(h - 1) + N(h - 2), making N(h) = F_{h+3} - 1",
      "N(h) = 1 + 2 * N(h - 1), making N(h) = 2^{h+1} - 1",
      "N(h) = 2 + N(h - 1) + N(h - 3)",
      "N(h) = N(h - 1) * N(h - 2)"
    ],
    answer: 0,
    explanation: "To minimize nodes at height h while preserving the AVL balance invariant |bf| <= 1, one subtree must have height h - 1 and the other height h - 2. Including the root yields N(h) = 1 + N(h - 1) + N(h - 2), which matches the Fibonacci sequence shifted by 3 minus 1 (F_{h+3} - 1) and bounds h <= 1.4404 log2(N + 2) - 0.328."
  },
  {
    id: "q-avl-2",
    type: "mcq",
    difficulty: "apply",
    title: "Right-Left (RL) Double Rotation Mechanics",
    prompt: "In an AVL tree, node $Z$ has balance factor $h(Z.left) - h(Z.right) = -2$, and its right child $Y$ has balance factor $+1$ (left-heavy). How is the tree rebalanced at $Z$?",
    question: "Which sequence of rotations restores the AVL invariant and reduces the subtree height by 1?",
    options: [
      "First right-rotate at Y (lifting Y's left child X), then left-rotate at Z",
      "First left-rotate at Z, then right-rotate at Y",
      "Perform a single left rotation at Z",
      "First left-rotate at Y, then right-rotate at Z"
    ],
    answer: 0,
    explanation: "When Z has balance factor -2 (right-heavy) and its right child Y has balance factor +1 (left-heavy), the inserted key is in the inner grandchild X = Y.left (the Right-Left zig-zag case). A single left rotation at Z would simply move X to Z's right child without reducing the subtree height. We must first right-rotate at Y to straighten the spine, and then left-rotate at Z so X becomes the new root of the subtree with children Z and Y."
  },
  {
    id: "q-avl-3",
    type: "mcq",
    difficulty: "apply",
    title: "Insertion vs Deletion Rotation Count in AVL Trees",
    prompt: "Compare the worst-case number of structural rotations required after a single key insertion versus a single key deletion in an $N$-node AVL tree.",
    question: "What are the worst-case rotation bounds for AVL insertion and AVL deletion?",
    options: [
      "Insertion requires at most 1 (single or double) rotation; deletion may require Theta(log N) rotations up to the root",
      "Both insertion and deletion require at most 1 (single or double) rotation",
      "Insertion requires Theta(log N) rotations; deletion requires at most 1 rotation",
      "Both insertion and deletion require Theta(log N) rotations in the worst case"
    ],
    answer: 0,
    explanation: "After an AVL insertion increases a subtree's height from h to h+1, rotating at the lowest unbalanced ancestor restores that subtree's height back to h, terminating all further height changes above it. In contrast, after an AVL deletion, rebalancing an unbalanced node reduces the subtree's height from h+1 to h, which can propagate a balance violation to its parent and cascade all the way to the root (Theta(log N) rotations)."
  },
  {
    id: "q-avl-4",
    type: "mcq",
    difficulty: "staff",
    title: "Lock-Coupling Concurrency Bottleneck in AVL vs Red-Black Trees",
    prompt: "A database storage engine team is choosing between an AVL tree and a Red-Black tree for an in-memory index that supports concurrent reader/writer threads using top-down optimistic lock coupling.",
    question: "Why do concurrent in-memory indexes and kernel subsystems overwhelmingly prefer Red-Black trees over AVL trees under write-heavy workloads?",
    options: [
      "AVL deletions can trigger O(log N) structural rotations all the way to the root, whereas Red-Black trees guarantee at most 3 rotations on deletion and 2 on insertion, localizing structural pointer mutations",
      "AVL trees cannot store parent pointers, making concurrent iteration impossible",
      "Red-Black trees have strictly smaller height than AVL trees (1.0 log2 N vs 2.0 log2 N)",
      "AVL trees require dynamic memory allocation during every rotation"
    ],
    answer: 0,
    explanation: "While AVL trees have a tighter height bound (1.44 log2 N vs 2 log2 N), Red-Black trees guarantee O(1) structural rotations (at most 2 for insertion, 3 for deletion; the remaining O(log N) work is purely color bit flips). In concurrent or RCU-read-Copy-Update environments, a rotation invalidates concurrent readers traversing the mutated parent/child links. Bounding structural rotations to O(1) minimizes lock-hold windows and reader retries."
  }
];

window.QUESTION_BANK["red-black-llrb-isomorphism"] = [
  {
    id: "q-rb-1",
    type: "mcq",
    difficulty: "recall",
    title: "2-3-4 Tree to Red-Black Tree Isomorphism",
    prompt: "Under Guibas and Sedgewick's correspondence between 2-3-4 B-trees and standard Red-Black trees, how is a 4-node (containing 3 keys $a < b < c$ and 4 child links) represented?",
    question: "Which Red-Black subgraph corresponds to a 2-3-4 tree's 4-node?",
    options: [
      "A black parent node holding key b with two red children holding keys a and c",
      "A red parent node holding key b with two black children holding keys a and c",
      "Three consecutive red nodes linked in a right-leaning chain",
      "A black parent holding key a with a red right child b and a red grandchild c"
    ],
    answer: 0,
    explanation: "In the 2-3-4 to Red-Black isomorphism, red edges bind keys that reside inside the same B-tree node. A 4-node with keys (a, b, c) is represented as a black root b connected via red links to its left child a and right child c. Flipping the colors of a and c to black and b to red corresponds exactly to splitting the 4-node and pushing middle key b up into the parent B-tree node."
  },
  {
    id: "q-rb-2",
    type: "mcq",
    difficulty: "apply",
    title: "LLRB Bottom-Up Insertion Fix-Up Sequence",
    prompt: "In Sedgewick's Left-Leaning Red-Black (LLRB) 2-3 tree, three local transformations are checked in exact order on the way up the recursion stack after inserting a node. What is that exact sequence of checks at node `h`?",
    question: "Select the canonical three-step bottom-up fix-up sequence at node `h`:",
    options: [
      "1) If right is red and left is black: rotateLeft(h); 2) If left is red and left.left is red: rotateRight(h); 3) If both left and right are red: flipColors(h)",
      "1) If both left and right are red: flipColors(h); 2) If left is red: rotateRight(h); 3) If right is red: rotateLeft(h)",
      "1) If left is red and right is black: rotateRight(h); 2) If right is red and right.right is red: rotateLeft(h); 3) flipColors(h)",
      "1) flipColors(h); 2) rotateLeft(h); 3) rotateRight(h)"
    ],
    answer: 0,
    explanation: "In an LLRB 2-3 tree: Step 1 (`isRed(h.right) && !isRed(h.left)`) fixes a right-leaning 3-node or turns a zig-zag into two consecutive left red links via `rotateLeft(h)`. Step 2 (`isRed(h.left) && isRed(h.left.left)`) balances two consecutive left-leaning red links into a temporary 4-node via `rotateRight(h)`. Step 3 (`isRed(h.left) && isRed(h.right)`) splits that temporary 4-node by flipping both children to black and `h` to red via `flipColors(h)`."
  },
  {
    id: "q-rb-3",
    type: "mcq",
    difficulty: "apply",
    title: "Black-Height & Maximum Path Length Bound",
    prompt: "Suppose a Red-Black tree has black-height $bh = 6$ (counting black nodes on any root-to-NULL path, excluding the NULL sentinel). What are the minimum possible number of internal nodes $N_{\\min}$ and the maximum possible root-to-leaf path length?",
    question: "Calculate $N_{\\min}$ and the maximum depth of any internal node:",
    options: [
      "N_min = 2^6 - 1 = 63 internal nodes; maximum depth is at most 2 * 6 - 1 = 11 edges",
      "N_min = 2^5 - 1 = 31 internal nodes; maximum depth is at most 6 edges",
      "N_min = 6 internal nodes; maximum depth is at most 12 edges",
      "N_min = 2^{12} - 1 = 4095 internal nodes; maximum depth is at most 6 edges"
    ],
    answer: 0,
    explanation: "Collapsing all red nodes into their black parents yields a 2-3-4 tree where every leaf is at depth bh = 6. The minimum number of internal nodes occurs when every node is a 2-node (all nodes black), forming a complete binary tree of height 6 with 2^6 - 1 = 63 nodes. Because no two red nodes can be adjacent, any path has at most bh black nodes and at most bh red nodes (if root were red, or bh-1 if root is black), giving at most 2*bh = 12 nodes (depth 11)."
  },
  {
    id: "q-rb-4",
    type: "mcq",
    difficulty: "staff",
    title: "Why LLRB Deletion Requires `moveRedLeft` and `moveRedRight`",
    prompt: "In standard Red-Black trees, deletion uses a bottom-up fix-up with 4 symmetric cases. In an LLRB tree, deletion instead pushes a red link down from the root using `moveRedLeft` and `moveRedRight` before deleting, then fixes up on the way back.",
    question: "What invariant do `moveRedLeft` and `moveRedRight` maintain during the top-down descent of LLRB deletion, and what is the trade-off?",
    options: [
      "They guarantee that the current node (or its target child) is not a 2-node (i.e., is red or has a red child) so the leaf removed at the bottom is red, at the cost of performing O(log N) rotations along the search path even when no underflow occurs",
      "They convert all nodes along the path to black so no rotations are needed on return",
      "They guarantee O(1) rotations per deletion, matching standard Red-Black trees",
      "They eliminate the need for color flips during deletion"
    ],
    answer: 0,
    explanation: "Deleting a black leaf (a 2-node) would violate the uniform black-height invariant. LLRB deletion implements top-down 2-3 tree deletion: on the way down, if the target child is a 2-node (`!isRed(h.left) && !isRed(h.left.left)`), `moveRedLeft` borrows from a 3-node sibling or merges with a 2-node sibling so we always land on a 3-node or 4-node leaf. While concise in code, this top-down restructuring performs O(log N) rotations on every deletion, unlike standard RB-trees which perform at most 3 rotations."
  }
];

window.QUESTION_BANK["treaps-split-merge-paradigm"] = [
  {
    id: "q-treap-1",
    type: "mcq",
    difficulty: "recall",
    title: "Dual Invariants & Uniqueness of a Treap",
    prompt: "Given a set of $N$ items where all search keys $k_i$ are distinct and all randomly assigned priorities $p_i$ are distinct, how many valid Treap topologies exist for this exact set of $(k_i, p_i)$ pairs?",
    question: "How many distinct binary tree structures simultaneously satisfy both the BST key invariant and the max-heap priority invariant?",
    options: [
      "Exactly 1 unique tree topology",
      "Up to 2^{N-1} topologies depending on insertion order",
      "Catalan number C_N topologies",
      "O(log N) topologies"
    ],
    answer: 0,
    explanation: "The node with the maximum priority p_max in the entire set MUST be the root (by the max-heap invariant). By the BST key invariant, all items with k_i < k_{root} must go into the left subtree, and all items with k_i > k_{root} must go into the right subtree. Applying this argument inductively to both subtrees uniquely determines every node's position—making the Treap isomorphic to inserting the keys into a standard BST in decreasing order of priority."
  },
  {
    id: "q-treap-2",
    type: "mcq",
    difficulty: "apply",
    title: "Implementing `insert` and `erase` via `split` and `merge`",
    prompt: "Suppose you have implemented `split(T, k) -> (L, R)` (where $L$ has keys $\\le k$ and $R$ has keys $> k$) and `merge(L, R) -> T` (which requires all keys in $L$ to be strictly less than all keys in $R$).",
    question: "How do you insert a new single-node treap `node` with key $x$ into treap $T$ using ONLY `split` and `merge`?",
    options: [
      "let [L, R] = split(T, x); return merge(merge(L, node), R);",
      "let [L, R] = split(T, node.priority); return merge(L, merge(node, R));",
      "return merge(T, node);",
      "let [L, R] = split(T, x); return split(merge(L, R), x);"
    ],
    answer: 0,
    explanation: "`merge(A, B)` is only valid when every key in A is <= every key in B. Therefore, we first partition T around key x using `split(T, x)` into L (keys <= x) and R (keys > x). Now all keys in L are <= x < all keys in R, so we can legally call `merge(merge(L, node), R)` in O(log N) expected time."
  },
  {
    id: "q-treap-3",
    type: "mcq",
    difficulty: "apply",
    title: "Implicit Treap Subarray Reversal",
    prompt: "An Implicit Treap represents a dynamic array $A[0..N-1]$ by replacing explicit keys with subtree sizes (`left.size + 1`). To reverse the subarray $A[l..r]$ in $O(\\log N)$ time, how are `splitBySize`, lazy `rev` tags, and `merge` combined?",
    question: "Which sequence of operations reverses $A[l..r]$ (0-indexed, inclusive) in $O(\\log N)$ expected time?",
    options: [
      "Split T at size l into (T1, T23); split T23 at size (r - l + 1) into (T2, T3); toggle T2.rev ^= 1; return merge(T1, merge(T2, T3))",
      "Split T at size l into (T1, T2); split T1 at size r into (T2, T3); swap T1 and T3",
      "Perform (r - l + 1) individual splits and re-merges in reverse order",
      "Toggle T.rev ^= 1 on the root and adjust l and r offsets"
    ],
    answer: 0,
    explanation: "First, `splitBySize(T, l)` isolates the prefix A[0..l-1] in T1 (size l) and the suffix A[l..N-1] in T23. Second, `splitBySize(T23, r - l + 1)` isolates the exact target range A[l..r] (which has length r - l + 1) as the root of T2. Toggling `T2.rev ^= 1` lazily swaps left and right children whenever nodes of T2 are visited, and `merge(T1, merge(T2, T3))` reassembles the array in O(log N) time."
  },
  {
    id: "q-treap-4",
    type: "mcq",
    difficulty: "staff",
    title: "Expected Rotation Count on Treap Insertion",
    prompt: "Although the expected depth of a newly inserted node in an $N$-node Treap is $\\Theta(\\log N)$, what is the expected number of rotations performed during a single insertion (or deletion)?",
    question: "Evaluate the exact asymptotic expected number of rotations per Treap insertion:",
    options: [
      "Strictly less than 2 rotations in expectation (O(1) expected rotations)",
      "Theta(log N) rotations in expectation",
      "Theta(sqrt(N)) rotations in expectation",
      "Exactly log2(N) rotations in expectation"
    ],
    answer: 0,
    explanation: "In a random Treap, the number of rotations needed to bubble a newly inserted key x up to its priority position equals the sum of the right-spine length of its left subtree and the left-spine length of its right subtree after insertion. By backwards analysis over random permutations, the expected length of each spine is 1 - 1/k + 1/n < 1, so the total expected number of rotations per insertion or deletion is strictly less than 2!"
  }
];

window.QUESTION_BANK["splay-trees-dynamic-optimality"] = [
  {
    id: "q-splay-1",
    type: "mcq",
    difficulty: "recall",
    title: "Zig-Zig vs Double Rotation on Collinear Nodes",
    prompt: "Suppose node $x$ is the left child of $p$, and $p$ is the left child of $g$ (a left-left collinear configuration). How does Tarjan and Sleator's **Zig-Zig** splay step differ from naive bottom-up single rotations?",
    question: "Which rotation order defines the Zig-Zig splay step when $x = g.left.left$?",
    options: [
      "First right-rotate at the grandparent g (lifting p), then right-rotate at the parent p (lifting x)",
      "First right-rotate at the parent p (lifting x), then right-rotate at the grandparent g (lifting x)",
      "Left-rotate at p, then right-rotate at g",
      "Right-rotate at g only, leaving x as a child of p"
    ],
    answer: 0,
    explanation: "If you naively rotate x over p first and then x over g, splaying the deepest node in a degenerate left-leaning chain of N nodes leaves the remaining N-1 nodes in a chain of height N-2 (yielding O(N) amortized time per access!). By rotating the grandparent g with p FIRST and then p with x (Zig-Zig), splaying the bottom of a chain halves the depth of EVERY node along the access path."
  },
  {
    id: "q-splay-2",
    type: "mcq",
    difficulty: "apply",
    title: "Access Lemma & Potential Function in Splay Tree Analysis",
    prompt: "In Sleator and Tarjan's amortized analysis of Splay Trees, each node $u$ is assigned a positive weight $w(u)$, subtree weight $s(u) = \\sum_{v \\in T_u} w(v)$, and rank $r(u) = \\lfloor \\log_2 s(u) \\rfloor$. The potential of the tree is $\\Phi(T) = \\sum_{u \\in T} r(u)$.",
    question: "According to the Access Lemma, what is the upper bound on the amortized cost of splaying a node $x$ to the root of a tree rooted at $t$?",
    options: [
      "3 * (r(t) - r(x)) + 1 = O(log(s(t) / s(x)))",
      "r(t) + r(x) = O(log N)",
      "2^{r(t) - r(x)}",
      "s(t) - s(x)"
    ],
    answer: 0,
    explanation: "In each Zig-Zig or Zig-Zag step lifting x from rank r(x) to r'(x), the amortized cost (actual rotations + change in potential) is bounded by 3(r'(x) - r(x)), while the final Zig step (at most one) costs at most 3(r'(x) - r(x)) + 1. Summing this telescoping series along the path from x to the root t yields a total amortized cost of at most 3(r(t) - r(x)) + 1."
  },
  {
    id: "q-splay-3",
    type: "mcq",
    difficulty: "apply",
    title: "Static Optimality and Working-Set Theorems via Weight Assignment",
    prompt: "Because Splay Trees store no explicit weights or balance bits in their nodes, the same unweighted algorithm satisfies multiple theorems simultaneously simply by choosing different virtual weights $w(u)$ in the Access Lemma.",
    question: "If key $i$ is accessed with fixed empirical frequency $p_i > 0$ ($\\sum p_i = 1$), what weight assignment $w(i)$ in the Access Lemma proves the Static Optimality Theorem (total cost $O(M + \\sum_{i} p_i M \\log(1/p_i))$)?",
    options: [
      "Assign w(i) = p_i, so s(root) = 1 and r(root) - r(i) = log2(1 / p_i)",
      "Assign w(i) = 1 / N for all keys",
      "Assign w(i) = i^2",
      "Assign w(i) = 2^{-i}"
    ],
    answer: 0,
    explanation: "Because weights are purely analytical (the algorithm never reads w(i)), we can set w(i) = p_i. Then s(root) = sum(p_i) = 1 and s(i) >= w(i) = p_i. By the Access Lemma, the amortized cost of accessing key i is at most 3 log2(1 / p_i) + 1, which matches the Shannon entropy bound of the optimal static BST!"
  },
  {
    id: "q-splay-4",
    type: "mcq",
    difficulty: "staff",
    title: "Why Read-Only Queries in Splay Trees Break Multi-Core Concurrency",
    prompt: "Consider an in-memory cache read by 64 concurrent threads where 99% of operations are `find(key)` lookups on a heavily skewed Zipfian distribution.",
    question: "Why can a Splay Tree suffer catastrophic throughput degradation compared to a Red-Black tree or B-tree in this multi-threaded read-heavy scenario?",
    options: [
      "Every `find(key)` in a Splay Tree mutates pointers all the way to the root via splaying, turning read operations into exclusive root-level writes that cause cache-line invalidation storms and lock contention across all CPU cores",
      "Splay trees use O(N) extra memory per lookup",
      "Splay trees cannot exploit Zipfian skew",
      "Splay trees require hardware transactional memory to execute Zig-Zig steps"
    ],
    answer: 0,
    explanation: "In a Splay Tree, even a pure lookup (`find`) restructures the tree and overwrites the root pointer. On a multi-core machine, mutating shared tree pointers during reads forces exclusive write locks (or causes constant MESI cache-coherency invalidations on the root cache lines), completely serializing concurrent readers."
  }
];

window.QUESTION_BANK["augmented-trees-order-intervals"] = [
  {
    id: "q-aug-1",
    type: "mcq",
    difficulty: "recall",
    title: "The Augmentation Theorem for Balanced BSTs",
    prompt: "According to the CLRS Augmentation Theorem, when can an auxiliary field $f(x)$ stored at every node $x$ of a balanced BST be maintained in $O(\\log N)$ time during insertions, deletions, and rotations without changing the asymptotic complexity?",
    question: "What structural property must $f(x)$ satisfy?",
    options: [
      "f(x) can be computed in O(1) time solely from the information in x, x.left, and x.right (e.g., an associative combine over subtree values)",
      "f(x) must depend only on the depth of x from the root",
      "f(x) must be a monotonically increasing integer across inorder traversal",
      "f(x) can only be maintained if rotations are disabled"
    ],
    answer: 0,
    explanation: "When a rotation occurs between parent x and child y, only the subtrees rooted at x and y change their immediate child pointers; all subtrees below them remain intact, and the combined set of nodes under the rotated pair is unchanged. If f(u) depends only on u.key, f(u.left), and f(u.right), then recomputing f(x) and f(y) after a rotation takes O(1) time, and propagating updates up to the root takes O(log N) time."
  },
  {
    id: "q-aug-2",
    type: "mcq",
    difficulty: "apply",
    title: "Order-Statistic Tree `rank(key)` Calculation",
    prompt: "In an Order-Statistic Tree where each node stores `u.size = 1 + size(u.left) + size(u.right)`, you are searching for the 0-based rank (number of keys strictly less than `q`) of query key `q`.",
    question: "As you walk down from the root, how do you update the running rank accumulator `r` when comparing `q` against the current node `u`?",
    options: [
      "When q <= u.key, move to u.left without changing r; when q > u.key, add (size(u.left) + 1) to r and move to u.right",
      "When q < u.key, subtract size(u.right) from r; when q > u.key, add size(u.right) to r",
      "Add u.size to r at every node visited along the path",
      "Add size(u.left) to r regardless of whether moving left or right"
    ],
    answer: 0,
    explanation: "If q <= u.key, neither u nor any node in u.right is strictly less than q, so all keys < q within u's subtree must lie inside u.left; we descend left with r unchanged. If q > u.key, then u itself AND every node in u.left are strictly less than q, so we add `size(u.left) + 1` to r and descend into u.right to count any remaining keys < q."
  },
  {
    id: "q-aug-3",
    type: "mcq",
    difficulty: "apply",
    title: "Interval Tree Single-Path Overlap Search Proof",
    prompt: "In CLRS Interval Trees, each node stores an interval $[low, high]$, is keyed by $low$, and maintains $max = \\max(high, left.max, right.max)$. During `overlapSearch([ql, qr])` at node $u$, if $u$ does not overlap $[ql, qr]$, the algorithm checks `if (u.left != null && u.left.max >= ql)` and goes left ONLY, never backtracking to the right subtree.",
    question: "Why is it guaranteed safe to never backtrack to `u.right` if `u.left.max >= ql` fails to find an overlap in the left subtree?",
    options: [
      "Because u.left.max >= ql guarantees there is some interval [l*, r*] in u.left with r* >= ql; if no interval in u.left overlaps [ql, qr], then l* must be > qr, and since all intervals in u.right have low >= u.low >= l* > qr, no interval in u.right can overlap [ql, qr] either",
      "Because all intervals in u.right have high < u.left.max",
      "Because Interval Trees do not allow overlapping intervals to be inserted",
      "Because u.right is always empty when u.left.max >= ql"
    ],
    answer: 0,
    explanation: "Let [l*, r*] be the interval in u.left that achieves r* = u.left.max >= ql. Either [l*, r*] overlaps [ql, qr] (in which case moving left finds an overlap), OR [l*, r*] does not overlap [ql, qr]. Since r* >= ql is already true, the only way [l*, r*] fails to overlap [ql, qr] is if l* > qr. By the BST property on `low` endpoints, every interval in u.right has low >= u.low >= l* > qr, so it is impossible for ANY interval in u.right to overlap [ql, qr]!"
  },
  {
    id: "q-aug-4",
    type: "mcq",
    difficulty: "staff",
    title: "Why Storing Explicit `rank` Breaks the Augmentation Theorem",
    prompt: "A developer proposes storing `u.globalRank` (the node's index in the sorted order of the entire tree) directly inside every BST node instead of `u.size` (the subtree node count) so that `rank(u)` takes $O(1)$ pointer lookup.",
    question: "Why does storing `u.globalRank` violate the Augmentation Theorem and degrade insertion/deletion to $\\Omega(N)$?",
    options: [
      "Inserting a new minimum key increments the `globalRank` of all N existing nodes in the tree, because `globalRank` depends on ancestors and cousins outside u's subtree rather than just u.left and u.right",
      "Storing `globalRank` requires 64-bit integers instead of 32-bit integers",
      "Rotations invert the inorder traversal of a BST",
      "`globalRank` cannot be defined when keys are strings"
    ],
    answer: 0,
    explanation: "The Augmentation Theorem requires that a node's augmented attribute be a function solely of its own subtree (`u`, `u.left`, `u.right`). `u.size` satisfies this local subtree property; `u.globalRank` depends on the number of nodes to the left of `u` across the entire tree. Inserting a single element smaller than the minimum shifts the global rank of all N nodes, forcing O(N) updates."
  }
];

window.QUESTION_BANK["b-trees-bplus-trees-disk-pages"] = [
  {
    id: "q-btree-1",
    type: "mcq",
    difficulty: "recall",
    title: "B-Tree vs B+ Tree Structural Difference",
    prompt: "Database storage engines (PostgreSQL, MySQL InnoDB, SQLite table B-trees) use **B+ Trees** rather than classic Bayer-McCreight **B-Trees**. What are the two defining structural differences of a B+ Tree?",
    question: "Select the accurate characterization of a B+ Tree:",
    options: [
      "Internal nodes store only routing separator keys (no row payloads) to maximize branching factor B, and all data records reside in leaf pages linked sequentially into a doubly linked list",
      "Internal nodes store full row payloads while leaf nodes store only pointers",
      "B+ Trees have a branching factor of 2, whereas B-Trees have a branching factor of B",
      "B+ Trees grow downward from the leaves instead of upward from the root"
    ],
    answer: 0,
    explanation: "By stripping bulky row values or tuple pointers out of internal pages, an internal 16 KB B+ tree page can pack hundreds of separator keys (branching factor B ~ 500–1000), keeping a 1-billion-row table at height 3–4. Furthermore, linking all leaf pages horizontally allows a range query `WHERE k BETWEEN a AND b` to perform one root-to-leaf descent followed by a sequential scan across sibling leaf pages."
  },
  {
    id: "q-btree-2",
    type: "mcq",
    difficulty: "apply",
    title: "Page Capacity & Tree Height Calculation",
    prompt: "A database uses $16\\text{ KB}$ ($16{,}384$-byte) pages. Each internal B+ tree page has a $64$-byte header, stores $8$-byte `int64` separator keys and $8$-byte child page IDs. Leaf pages hold up to $64$ full row records each. Assuming pages are at least $70\\%$ full on average, how many disk page reads are needed to fetch a record in a $100{,}000{,}000$-row ($10^8$) table if the top 2 levels of the B+ tree are pinned in the RAM buffer pool?",
    question: "Compute the branching factor and resulting uncached disk I/Os:",
    options: [
      "Internal branching factor is ~1,020 (70% fill ~ 714); tree height is 4 levels (root -> L1 -> L2 -> leaf), requiring 2 disk I/Os since root and L1 are cached",
      "Internal branching factor is 16; tree height is 10 levels, requiring 8 disk I/Os",
      "Tree height is 25 levels, requiring 23 disk I/Os",
      "Internal branching factor is 100,000, requiring 0 disk I/Os"
    ],
    answer: 0,
    explanation: "An internal page holds (16384 - 64) / (8 + 8) = 1020 child pointers at 100% capacity, or ~714 at 70% occupancy. Leaf pages at 70% occupancy hold ~45 rows. Thus 1 root * 714 L1 pages * 714 L2 pages = 509,796 L2 pages, pointing to 509,796 * 714 = 364M leaf pages (> 1.6 * 10^{10} rows). For 10^8 rows (~2.2M leaf pages), a 4-level B+ tree (Root -> L1 -> L2 -> Leaf) easily suffices. With Root and L1 cached in RAM, only L2 and the target Leaf require disk reads (2 I/Os)."
  },
  {
    id: "q-btree-3",
    type: "mcq",
    difficulty: "apply",
    title: "Proactive Top-Down Splitting in B-Trees",
    prompt: "In CLRS proactive (top-down) B-tree insertion with minimum degree $t$ (where each node holds between $t-1$ and $2t-1$ keys), what does the algorithm do whenever it encounters a full node with $2t-1$ keys on its way down from the root?",
    question: "Why does top-down B-tree insertion split every full ($2t-1$ key) node immediately upon visiting it?",
    options: [
      "It guarantees that whenever we step into a child node, its parent has at most 2t - 2 keys (is non-full), so splitting that child never requires backtracking up the tree or holding write locks on ancestors",
      "It reduces the space occupancy of the B-tree to 100%",
      "It prevents the root from ever splitting",
      "It ensures that all keys are inserted into internal nodes rather than leaves"
    ],
    answer: 0,
    explanation: "If we wait until reaching a full leaf to split, the median key promoted to the parent might overflow the parent, cascading splits all the way to the root and requiring us to hold exclusive locks on the entire root-to-leaf path. By splitting any full (2t - 1 key) node into two (t - 1 key) nodes as we descend, the parent is guaranteed to have spare capacity (< 2t - 1 keys), allowing single-pass top-down insertion with lock crabbing."
  },
  {
    id: "q-btree-4",
    type: "mcq",
    difficulty: "staff",
    title: "Lehman-Yao B-Link Trees and High-Keys for Lock-Free/Latch-Free Reads",
    prompt: "In PostgreSQL's `nbtree` implementation (based on Lehman & Yao's B-link tree), what could happen if a reader thread reads a parent page's child pointer $P$, and before the reader latches child page $P$, a concurrent writer splits $P$ into $P$ and $P_{\\text{right}}$?",
    question: "How does a Lehman-Yao B-link tree allow the reader to recover without holding parent-to-child lock coupling?",
    options: [
      "Each page stores a `high_key` (the upper bound of keys currently on that page) and a `right_link` pointer to its right sibling; if the reader's search key exceeds `P.high_key`, the reader simply follows `P.right_link` horizontally",
      "The reader aborts the SQL transaction and restarts from the root",
      "The writer is blocked until all readers across the entire B+ tree finish",
      "Every page stores a back-pointer to its parent so the reader can climb back up"
    ],
    answer: 0,
    explanation: "Lehman and Yao's B-link tree adds a `high_key` and a `right_link` to every internal and leaf page, and ensures a page split writes the new right sibling `P_right` and updates `P`'s `high_key` and `right_link` BEFORE inserting the separator into the parent. If a reader lands on `P` after `P` was split and the target key migrated to `P_right`, the reader sees `search_key > P.high_key` and follows `P.right_link` rightwards without ever needing to hold simultaneous latches on parent and child!"
  }
];

window.QUESTION_BANK["lsm-trees-write-amplification"] = [
  {
    id: "q-lsm-1",
    type: "mcq",
    difficulty: "recall",
    title: "The Write Path of an LSM-Tree Storage Engine",
    prompt: "When a client executes `Put(key, value)` in an LSM-tree engine such as RocksDB, LevelDB, or Cassandra, what happens on the synchronous critical path before returning success?",
    question: "Trace the exact write path of an LSM-tree:",
    options: [
      "The mutation is appended sequentially to the on-disk Write-Ahead Log (WAL) for crash durability and inserted into an in-memory sorted MemTable (e.g., a SkipList); no on-disk B-tree page is read or overwritten in place",
      "The engine binary-searches all SSTables on disk and overwrites the matching block in place",
      "The engine immediately triggers a full compaction of Level 0 into Level 1",
      "The key is hashed into an on-disk linear probing table"
    ],
    answer: 0,
    explanation: "LSM-trees convert random logical writes into sequential physical I/O. Every `Put` or `Delete` (tombstone) is appended sequentially to the WAL and inserted into the in-memory MemTable. Only when the MemTable reaches its size limit (e.g., 64 MB) is it frozen as an Immutable MemTable and flushed sequentially to disk as an immutable Level-0 Sorted String Table (SSTable)."
  },
  {
    id: "q-lsm-2",
    type: "mcq",
    difficulty: "apply",
    title: "Tiered vs Leveled Compaction Trade-Offs (Write vs Space Amplification)",
    prompt: "Consider an LSM-tree with growth factor $T = 10$ and $L$ levels. Compare **Size-Tiered Compaction** (used in Cassandra for write-heavy workloads) against **Leveled Compaction** (used in LevelDB/RocksDB).",
    question: "How do Size-Tiered and Leveled Compaction trade off Write Amplification ($WA$), Read Amplification ($RA$), and Space Amplification ($SA$)?",
    options: [
      "Size-Tiered achieves lower Write Amplification O(L) by merging T equal-sized runs at once, but suffers higher Space Amplification (up to ~100% overhead during major compaction) and higher Read Amplification; Leveled keeps Space Amplification low (~10% overhead) at the cost of higher Write Amplification O(T * L)",
      "Leveled Compaction has zero Write Amplification and 10x Space Amplification",
      "Size-Tiered Compaction guarantees at most 1 sorted run per level",
      "Both strategies have identical Write, Read, and Space Amplification"
    ],
    answer: 0,
    explanation: "In Size-Tiered Compaction, a level accumulates T sorted runs before merging them once into the next level, so each byte is rewritten only once per level (WA = O(L)), but up to T overlapping runs exist per level (high RA) and merging the largest level temporarily doubles disk usage (high SA). In Leveled Compaction, each level >= 1 is maintained as a single partitioned sorted run: merging from L_{i-1} into L_i rewrites up to T overlapping SSTables in L_i (WA = O(T * L)), but obsolete keys/tombstones live mainly in the top levels so SA is only ~1/T (~10%)."
  },
  {
    id: "q-lsm-3",
    type: "mcq",
    difficulty: "apply",
    title: "Bloom Filter Bits-Per-Key and Point-Lookup Read Amplification",
    prompt: "Suppose an LSM-tree has $K = 10$ sorted runs on disk, and a point lookup searches for a key that does not exist in the database. Each SSTable has a Bloom filter configured with $b = 10$ bits per key (false positive rate $\\varepsilon \\approx e^{-10 \\ln^2 2} \\approx 0.0082$).",
    question: "What is the expected number of wasted disk I/Os across the $10$ runs for a non-existent key, and why can Bloom filters NOT speed up range scans (`Seek(startKey)`)?",
    options: [
      "About 10 * 0.0082 = 0.082 wasted disk reads; Bloom filters hash full keys, destroying lexicographical order so a range scan must still consult a heap of iterators across all K runs",
      "Zero disk reads even for range scans because Bloom filters preserve key ordering",
      "Exactly 10 disk reads because Bloom filters only work on the MemTable",
      "About 5 disk reads"
    ],
    answer: 0,
    explanation: "By checking the in-memory Bloom filter for each candidate SSTable before reading its data blocks from disk, a point lookup avoids disk I/O with probability 1 - epsilon (~99.18% per run), reducing expected wasted I/Os across 10 runs to 0.082. However, standard Bloom filters hash exact keys; a range query `Seek(prefix)` does not know which exact keys exist in the range, so it must open iterators on all K runs (unless a prefix Bloom filter is configured for fixed-length prefixes)."
  },
  {
    id: "q-lsm-4",
    type: "mcq",
    difficulty: "staff",
    title: "Tombstone Retention & Snapshot Isolation Bugs in Compaction",
    prompt: "In an LSM-tree, deleting a key writes a **tombstone** marker `(key, seq_num, TYPE_DELETE)`. During compaction of Level $i$ into Level $i+1$, when is it legally safe for the compaction thread to garbage-collect (drop) a tombstone so it takes zero space?",
    question: "Identify the exact conditions required before a tombstone can be permanently dropped during compaction:",
    options: [
      "Only when (1) the compaction reaches the bottommost level (or no older SSTable at a deeper level contains key's key range) AND (2) the tombstone's sequence number is strictly older than the oldest active reader snapshot in the system",
      "Immediately as soon as the MemTable is flushed to Level 0",
      "Whenever Level 1 is compacted into Level 2, regardless of Level 3 contents",
      "Tombstones can never be dropped in an LSM-tree"
    ],
    answer: 0,
    explanation: "Dropping a tombstone prematurely causes two classic production bugs: (1) 'Zombie data resurrection': if an older version of `key` still exists in Level i+2 and the tombstone is dropped at Level i+1, future reads will fall through to Level i+2 and resurrect the deleted value! (2) Snapshot isolation violation: if an active transaction holds a snapshot at sequence number S < tombstone.seq, dropping the tombstone and the older value it shadows would hide the value that snapshot S is entitled to see."
  }
];

window.QUESTION_BANK["persistent-trees-path-copying"] = [
  {
    id: "q-pers-1",
    type: "mcq",
    difficulty: "recall",
    title: "Path Copying Time and Space Complexity",
    prompt: "In a purely functional (persistent) balanced binary search tree of height $h = \\Theta(\\log N)$, how does **path copying** produce a new tree version $T_{v+1}$ when updating or inserting a single key into version $T_v$?",
    question: "How many new nodes are allocated per update, and what happens to unmodified subtrees?",
    options: [
      "Exactly h + 1 = Theta(log N) new nodes are allocated along the root-to-target search path; their untouched left/right child pointers share the existing immutable subtrees of T_v",
      "All N nodes are cloned, taking Theta(N) time and space",
      "Only 1 node is allocated by mutating the parent pointer of T_v in place",
      "Theta(log^2 N) nodes are allocated because sibling subtrees must also be copied"
    ],
    answer: 0,
    explanation: "Because existing nodes are strictly immutable, any node whose child pointer changes must be replaced by a newly allocated node. The only nodes whose child pointers change are the ancestors along the root-to-target path (plus at most O(1) rotated nodes). All off-path subtrees are structurally shared via pointers, yielding O(log N) time and O(log N) new space per version."
  },
  {
    id: "q-pers-2",
    type: "mcq",
    difficulty: "apply",
    title: "Why Parent Pointers Break Path Copying",
    prompt: "Standard imperative Red-Black trees (such as Linux `rb_node` or C++ `std::map`) store an explicit `parent` pointer in every node. Why do persistent trees built with path copying omit `parent` pointers?",
    question: "What happens if every node in a tree stores an immutable `parent` pointer and you attempt to path-copy a single leaf update?",
    options: [
      "Allocating a new parent node changes the parent address of both its left and right children, which forces cloning those children, cascading recursively to copy all N nodes in the entire tree",
      "Parent pointers cause infinite loops during inorder traversal",
      "Parent pointers prevent tree rotations from being expressed recursively",
      "Garbage collectors cannot reclaim cycles created by parent pointers"
    ],
    answer: 0,
    explanation: "Structural sharing works because a shared child node `C` can be pointed to by multiple parent versions (`root_v1.left = C` and `root_v2.left = C`) without `C` knowing who points to it. If `C` stored a `parent` pointer, `C` could not simultaneously point back to both `root_v1` and `root_v2`; cloning `C` would then force cloning `C`'s children, collapsing O(log N) path copying into an O(N) full-tree clone."
  },
  {
    id: "q-pers-3",
    type: "mcq",
    difficulty: "apply",
    title: "Driscoll, Sarnak, Sleator, and Tarjan's Fat Node + Node Splitting Method",
    prompt: "Path copying requires $O(\\log N)$ space per update. Driscoll et al. (1989) proved that any pointer-based data structure with bounded in-degree $d$ can be made partially persistent with $O(1)$ amortized space per update and $O(1)$ worst-case query slowdown.",
    question: "How does the **Node Splitting** method achieve $O(1)$ amortized space per update instead of $O(\\log N)$?",
    options: [
      "Each node stores a small fixed number (e.g., 2d) of versioned modification slots ('extra pointers'); an update writes into a free slot in O(1) space, and only splits the node when its slots fill up, which amortizes via a potential function over the bounded in-degree predecessors",
      "It compresses all node pointers using Huffman coding",
      "It stores a global hash table mapping (node_id, version) -> pointer",
      "It rebuilds the entire tree every N updates"
    ],
    answer: 0,
    explanation: "A pure 'Fat Node' stores an unbounded list of versioned edits at each node (O(1) space per update, but O(log M) binary search overhead on every pointer traversal). A pure 'Path Copy' has O(1) traversal overhead, but O(log N) space per update. Driscoll et al.'s Node Splitting gives each node e >= 2d extra versioned pointer slots: traverses remain O(1), and when a node overflows, splitting it consumes e credits that pay for the 1 new node plus d recursive slot updates in its predecessors."
  },
  {
    id: "q-pers-4",
    type: "mcq",
    difficulty: "staff",
    title: "Copy-on-Write (CoW) B-Trees in ZFS, Btrfs, and LMDB",
    prompt: "Modern filesystems (ZFS, Btrfs) and embedded MVCC databases (LMDB) combine B+ trees with **Copy-on-Write (CoW) path copying**: modifying a leaf page writes the modified leaf and its updated ancestor pages to newly allocated disk blocks, culminating in an atomic update of the root pointer in the uberblock/meta-page.",
    question: "What are the three architectural benefits of a CoW B+ Tree compared to an in-place B+ Tree with Write-Ahead Logging (ARIES WAL)?",
    options: [
      "1) Crash recovery is instantaneous (no WAL redo/undo replay needed because the old tree is never overwritten in place); 2) Readers access a historical root page completely lock-free without blocking writers; 3) Point-in-time snapshots / clones cost O(1) by retaining an old root block pointer",
      "1) Zero write amplification; 2) Zero disk fragmentation; 3) O(1) worst-case sorting",
      "CoW B+ Trees never need garbage collection or free-space management",
      "CoW B+ Trees eliminate the need for checksums on disk blocks"
    ],
    answer: 0,
    explanation: "Because a CoW B+ tree writes new pages to free blocks and only commits by atomically flipping the root pointer in the meta-page, an interrupted write leaves the previous root version 100% consistent on disk (no WAL recovery needed). Furthermore, MVCC readers simply read from the root pointer of their snapshot epoch without taking any locks, and creating an instant filesystem snapshot is just pinning that root block from being freed!"
  }
];

window.QUESTION_BANK["case-linux-rbtree-cfs"] = [
  {
    id: "q-cfs-1",
    type: "mcq",
    difficulty: "recall",
    title: "Intrusive `struct rb_node` vs Standard Pointer-Wrapper Nodes",
    prompt: "In the Linux kernel (`<linux/rbtree.h>`), `struct rb_node` contains no `key` or `value` fields—only `unsigned long __rb_parent_color; struct rb_node *rb_right; struct rb_node *rb_left;`.",
    question: "How does kernel code embed a `struct sched_entity` into an `rb_root` and recover the enclosing `struct sched_entity *` from a `struct rb_node *` pointer?",
    options: [
      "The `struct rb_node run_node` is embedded directly inside `struct sched_entity`, and `rb_entry(ptr, struct sched_entity, run_node)` subtracts `offsetof(struct sched_entity, run_node)` at compile time via `container_of`",
      "The kernel stores a `void *` pointer in a global hash table mapping `rb_node *` to `sched_entity *`",
      "The kernel allocates a separate wrapper struct via `kmalloc` on every scheduler tick",
      "C's `dynamic_cast` operator recovers the outer struct at runtime"
    ],
    answer: 0,
    explanation: "Intrusive data structures invert ownership: instead of a tree node pointing to a heap-allocated payload, the payload (`struct sched_entity`) embeds `struct rb_node run_node` directly inside itself. This guarantees zero `kmalloc()` calls during scheduler enqueue/dequeue (which cannot sleep or fail) and eliminates an extra pointer indirection (`container_of` is a compile-time constant byte-offset subtraction)."
  },
  {
    id: "q-cfs-2",
    type: "mcq",
    difficulty: "apply",
    title: "Bit-Packing the Color Bit into `__rb_parent_color`",
    prompt: "In `struct rb_node`, the parent pointer and node color (`RB_RED = 0`, `RB_BLACK = 1`) are combined into a single word `unsigned long __rb_parent_color`.",
    question: "Why is the lowest bit (bit 0) of the parent pointer guaranteed to be available for storing the Red-Black color bit on 32-bit and 64-bit architectures?",
    options: [
      "Because `struct rb_node` contains pointer fields (4-byte or 8-byte aligned), its memory address is always a multiple of 4 or 8 (`__aligned(sizeof(long))`), meaning bits 0 and 1 of any valid `struct rb_node *` address are always zero",
      "Because kernel virtual addresses always start at 0x00000000",
      "Because the CPU hardware automatically masks out bit 0 when dereferencing any pointer",
      "Because the parent pointer only uses the lower 16 bits of the register"
    ],
    answer: 0,
    explanation: "Since `struct rb_node` is aligned to `sizeof(long)` (4 bytes on 32-bit, 8 bytes on 64-bit), the least significant 2 (or 3) bits of every `struct rb_node *` pointer are guaranteed to be `0`. The kernel packs the color into bit 0 (`__rb_parent_color & 1`) and extracts the parent pointer via `(struct rb_node *)(__rb_parent_color & ~3UL)`, shrinking `struct rb_node` from 32 bytes to 24 bytes so it fits cleanly inside a single 64-byte L1 cache line alongside surrounding fields."
  },
  {
    id: "q-cfs-3",
    type: "mcq",
    difficulty: "apply",
    title: "`rb_root_cached` and $O(1)$ Minimum Lookup in CFS",
    prompt: "The Completely Fair Scheduler (CFS) orders runnable tasks by `vruntime` and calls `pick_next_task_fair()` on every context switch to select the task with the smallest `vruntime`. Why does Linux use `struct rb_root_cached` (which adds a `struct rb_node *rb_leftmost` pointer) instead of walking `node = node->rb_left` from the root?",
    question: "How is `rb_leftmost` maintained in $O(1)$ additional overhead during insertion and deletion?",
    options: [
      "On insertion, a boolean `leftmost` tracks whether the descent stayed exclusively on left links (if true, the new node becomes `rb_leftmost`); on deletion of `rb_leftmost`, it is updated to `rb_next(node)` before removal",
      "On every insertion and deletion, the kernel walks from the root down the left spine in O(log N) time",
      "The kernel maintains a separate binary min-heap alongside the Red-Black tree",
      "`rb_leftmost` is recomputed by scanning all tasks in the runqueue"
    ],
    answer: 0,
    explanation: "`pick_next_task_fair()` is executed far more frequently than task wakeups/sleeps, and walking `O(log N)` pointer hops down the left spine on every context switch would incur L1/L2 cache misses. By maintaining a `bool leftmost = true` flag during insert descent (set to `false` the first time we branch right) and updating `rb_leftmost = rb_next(node)` when the minimum is dequeued, `rb_first_cached()` becomes a single $O(1)$ pointer read!"
  },
  {
    id: "q-cfs-4",
    type: "mcq",
    difficulty: "staff",
    title: "From CFS (`vruntime`) to EEVDF (`RB_DECLARE_CALLBACKS_MAX` Augmented Tree)",
    prompt: "In Linux 6.6+, the CFS scheduler was replaced by **EEVDF** (Earliest Eligible Virtual Deadline First). EEVDF must pick the task with the earliest virtual deadline $d_i$ among only those tasks that are currently **eligible** ($\\text{lag}_i \\ge 0$, which corresponds to $v_i \\le V(t)$).",
    question: "How does EEVDF find an eligible task with the minimum virtual deadline in $O(\\log N)$ time using a single intrusive Red-Black tree?",
    options: [
      "It keys the Red-Black tree by virtual deadline `deadline`, and augments each node using `RB_DECLARE_CALLBACKS_MAX` to store `min_vruntime` (the minimum `vruntime` in its subtree), enabling an O(log N) binary search down subtrees where `min_vruntime <= V(t)`",
      "It maintains two separate Red-Black trees and intersects them in O(N) time on every context switch",
      "It keys the Red-Black tree by PID and scans linearly for eligible tasks",
      "It uses a Fenwick tree over fixed priority buckets"
    ],
    answer: 0,
    explanation: "Searching a 2D condition (`vruntime <= V(t)` AND minimize `deadline`) in O(log N) time is a classic augmented tree problem! EEVDF orders the RB-tree by `deadline` (so left subtrees always have earlier deadlines) and augments each node with `min_vruntime` across its subtree. To pick the next task, EEVDF checks if `left->min_vruntime <= V(t)` (meaning at least one eligible task with an earlier deadline exists in the left subtree); if so, it goes left, otherwise checks the current node, or goes right—finding the earliest eligible deadline in a single O(log N) descent!"
  }
];

window.QUESTION_BANK["build-llrb-order-statistic-tree"] = [
  {
    id: "q-build-ost-1",
    type: "mcq",
    difficulty: "recall",
    title: "Order of Size Recomputations During a Left Rotation",
    prompt: "In your augmented LLRB Order-Statistic Tree, `rotateLeft(h)` promotes `x = h.right` to be the new root of the subtree, with `h` becoming `x.left`.",
    question: "In what exact order must the `size` fields of `h` and `x` be updated inside `rotateLeft(h)`?",
    options: [
      "Update `h.size = 1 + size(h.left) + size(h.right)` FIRST (or set `x.size = h.size` and recompute `h.size`), because `x` becomes the parent of `h` and `x.size` depends on the updated `h.size`",
      "Update `x.size` from `h.size` BEFORE reassigning `h.right` and leave `h.size` unchanged",
      "Neither `h.size` nor `x.size` changes during a rotation",
      "Swap `h.size` and `x.size` without examining their children"
    ],
    answer: 0,
    explanation: "After `h.right = x.left; x.left = h;`, `h` is now the left child of `x`. Therefore `h`'s subtree has shrunk (it lost `x` and `x.right`), while `x`'s subtree now encompasses the entire set of nodes that `h` previously rooted. Thus we must recompute `h.size = 1 + size(h.left) + size(h.right)` first, and then set `x.size = 1 + size(x.left) + size(x.right)` (which equals the old `h.size`)."
  },
  {
    id: "q-build-ost-2",
    type: "mcq",
    difficulty: "apply",
    title: "Duplicate Key Insertion Bug if Size Is Incremented Top-Down",
    prompt: "Suppose an engineer tries to optimize `insert(h, key)` in an Order-Statistic Tree by incrementing `h.size++` at the top of the recursive function before descending into `h.left` or `h.right`, instead of recomputing `h.size = 1 + size(h.left) + size(h.right)` on the way back up.",
    question: "What subtle bug occurs when `insert(key)` is called with a key that already exists in the set?",
    options: [
      "Every ancestor along the search path has its `size` incremented by 1 even though no new node was created, corrupting all future `select(k)` and `rank(key)` queries",
      "The tree becomes unbalanced and degrades to height O(N)",
      "Color flips stop working",
      "Only the root's `size` is corrupted while internal nodes remain accurate"
    ],
    answer: 0,
    explanation: "When inserting into a set (unique keys), we do not know until reaching the bottom of the search path whether `key` is already present. Moreover, rotations on the way back up rearrange parent-child relationships. Recomputing `h.size = 1 + size(h.left) + size(h.right)` bottom-up inside `fixUp(h)` (and inside `rotateLeft`/`rotateRight`) guarantees `size` is always exact regardless of duplicate keys or rotations."
  },
  {
    id: "q-build-ost-3",
    type: "mcq",
    difficulty: "apply",
    title: "`rangeCount(lo, hi)` Boundary Handling for Absent Endpoints",
    prompt: "In an Order-Statistic Tree where `rank(k)` returns the exact count of keys in the tree strictly less than `k` ($|\\{x \\in T : x < k\\}|$), we want `rangeCount(lo, hi)` to return the count of keys in the closed interval $[lo, hi]$ ($|\\{x \\in T : lo \\le x \\le hi\\}|$). Note that `lo` and `hi` themselves might or might not be present in the tree.",
    question: "Which formula correctly computes `rangeCount(lo, hi)` for all cases (assuming $lo \\le hi$)?",
    options: [
      "rank(hi) - rank(lo) + (contains(hi) ? 1 : 0)",
      "rank(hi) - rank(lo) + 1",
      "rank(hi) - rank(lo)",
      "rank(hi + 1) - rank(lo - 1)"
    ],
    answer: 0,
    explanation: "By definition, `rank(hi) - rank(lo)` counts keys satisfying `lo <= x < hi` (the half-open interval `[lo, hi)`), whether or not `lo` is in the tree! To convert `[lo, hi)` into the closed interval `[lo, hi]`, we simply need to include `hi` itself if and only if `hi` is actually present in the tree: `rank(hi) - rank(lo) + (contains(hi) ? 1 : 0)`. Note that `rank(hi + 1)` only works for integers and fails for floating-point or string keys."
  },
  {
    id: "q-build-ost-4",
    type: "mcq",
    difficulty: "staff",
    title: "Checking Both Structural and Order-Statistic Invariants in Unit Tests",
    prompt: "When writing a property-based test (`checkInvariants(root)`) to verify a production LLRB Order-Statistic Tree after 10,000 random insertions and deletions, which combination of assertions completely verifies correctness?",
    question: "Select the complete invariant verification suite for a 2-3 LLRB Order-Statistic Tree:",
    options: [
      "1) Strict BST key ordering; 2) No right-leaning red links and no two consecutive left red links; 3) Equal black-height on all root-to-null paths; 4) `u.size == 1 + size(u.left) + size(u.right)` at every node; 5) `select(rank(k)) == k` for all keys and `rank(select(i)) == i` for all 0 <= i < size()",
      "Checking that `root.size` equals the number of inserted elements and `root.color == BLACK`",
      "Checking that the tree height is <= 2 log2(N)",
      "Checking that an inorder traversal yields sorted keys"
    ],
    answer: 0,
    explanation: "A comprehensive structural verifier for an augmented LLRB tree must check: (1) BST ordering (`min < u.key < max`), (2) 2-3 LLRB color invariants (`!isRed(u.right)` and `!(isRed(u) && isRed(u.left))`), (3) uniform black-height across all paths, (4) local subtree size consistency (`u.size == 1 + size(u.left) + size(u.right)`), and (5) the bijection identity between `rank` and `select` across all indices."
  }
];
