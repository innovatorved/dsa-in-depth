window.QUESTION_BANK = window.QUESTION_BANK || {};

window.QUESTION_BANK["tree-representations-traversals"] = [
  {
    id: "tree-representations-traversals-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Exact Count of Null Child Pointers in an N-Node Binary Tree",
    prompt: "In any non-empty binary tree with N nodes where each node stores two child pointers (left and right), how many child pointer fields across the entire tree are null?",
    question: "In any non-empty binary tree with N nodes where each node stores two child pointers (left and right), how many child pointer fields across the entire tree are null?",
    options: [
      "Exactly N + 1, regardless of whether the tree is balanced or skewed",
      "Exactly N - 1, matching the number of tree edges",
      "Between log₂(N) and N depending on the number of leaf nodes",
      "Exactly 2N - 1"
    ],
    answer: 0,
    explanation: "Each of the N nodes provides 2 outgoing pointer slots, for 2N slots total. Every node except the root is pointed to by exactly 1 parent edge, consuming N - 1 non-null pointers. Therefore, 2N - (N - 1) = N + 1 child pointers are strictly null in any binary tree topology."
  },
  {
    id: "tree-representations-traversals-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Single-Stack Iterative Post-Order Disambiguation",
    prompt: "When implementing an iterative Post-Order traversal (Left, Right, Root) using a single explicit stack of ancestor pointers (8 bytes per entry), what additional state is required when peeking at the top node u on the stack?",
    question: "When implementing an iterative Post-Order traversal (Left, Right, Root) using a single explicit stack of ancestor pointers (8 bytes per entry), what additional state is required when peeking at the top node u on the stack?",
    options: [
      "A single pointer `lastVisited` to check whether `u.right == null || lastVisited == u.right` before popping and emitting `u`",
      "A second stack of equal size N to reverse the Pre-Order output sequence",
      "A hash set of all visited nodes to prevent infinite loops on left subtrees",
      "No extra state is needed; peeking at `u` always means both subtrees are complete"
    ],
    answer: 0,
    explanation: "When the downward pointer `curr` becomes null and we inspect `u = stack.top()`, we have finished `u.left`, but we may not yet have visited `u.right`. Checking whether `u.right != null && lastVisited != u.right` tells us in O(1) space whether to descend into `u.right` or emit `u` and set `lastVisited = u`."
  },
  {
    id: "tree-representations-traversals-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Left-Child Right-Sibling (LCRS) Transformation Mapping",
    prompt: "In Knuth's Left-Child Right-Sibling (LCRS) binary encoding of a general k-ary tree, where are all the siblings of a node u located in the transformed binary tree?",
    question: "In Knuth's Left-Child Right-Sibling (LCRS) binary encoding of a general k-ary tree, where are all the siblings of a node u located in the transformed binary tree?",
    options: [
      "Along the right-child spine starting at `u.right` (`u.right`, `u.right.right`, ...)",
      "Along the left-child spine starting at `u.left` (`u.left`, `u.left.left`, ...)",
      "In the left subtree of `u`'s first child",
      "At the same depth level in the binary tree as `u`"
    ],
    answer: 0,
    explanation: "In the LCRS transform, `u.left` (`firstChild`) points to the leftmost child of `u`, while `u.right` (`nextSibling`) chains all siblings of `u` together along a right spine."
  },
  {
    id: "tree-representations-traversals-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Adversarial Space Inversion Between DFS and BFS (Level-Order)",
    prompt: "A service parses untrusted user-supplied JSON ASTs into binary trees of N = 250,000 nodes. How do the peak auxiliary memory requirements of Iterative DFS vs. Queue-based BFS (Level-Order) compare across a perfectly balanced tree versus a degenerate skewed chain?",
    question: "A service parses untrusted user-supplied JSON ASTs into binary trees of N = 250,000 nodes. How do the peak auxiliary memory requirements of Iterative DFS vs. Queue-based BFS (Level-Order) compare across a perfectly balanced tree versus a degenerate skewed chain?",
    options: [
      "Balanced tree: DFS uses Θ(log N) (~18 entries) while BFS uses Θ(N) (~125,000 entries); Skewed chain: DFS uses Θ(N) (250,000 entries) while BFS uses Θ(1) (1 entry)",
      "DFS always uses less auxiliary memory than BFS regardless of tree shape",
      "BFS always uses Θ(log N) memory while DFS uses Θ(N) memory",
      "Both DFS and BFS use Θ(N) memory on balanced trees and Θ(log N) on skewed trees"
    ],
    answer: 0,
    explanation: "DFS stack depth is bounded by tree height O(h), whereas BFS queue size is bounded by maximum level width O(W). On a balanced tree, h = log₂ N and W = (N+1)/2. On a degenerate chain, h = N and W = 1, completely inverting the memory advantage."
  }
];

window.QUESTION_BANK["morris-threaded-traversal"] = [
  {
    id: "morris-threaded-traversal-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Target of Temporary Thread in Morris Traversal",
    prompt: "During Morris In-Order Traversal at a node `curr` that has a non-null left child, which pointer is temporarily modified to create an upward return thread?",
    question: "During Morris In-Order Traversal at a node `curr` that has a non-null left child, which pointer is temporarily modified to create an upward return thread?",
    options: [
      "The `right` pointer of the rightmost node in `curr`'s left subtree (the in-order predecessor of `curr`) is set to `curr`",
      "The `left` pointer of `curr`'s immediate left child is set to `curr`",
      "The `left` pointer of the leftmost leaf in `curr`'s left subtree is set to `curr`",
      "The `right` pointer of `curr` is set to `curr`'s parent"
    ],
    answer: 0,
    explanation: "The in-order predecessor of `curr` is the rightmost node in `curr.left`, which is visited immediately before `curr` in In-Order and is guaranteed to have `right == null`. Setting `pred.right = curr` creates a zero-overhead return path."
  },
  {
    id: "morris-threaded-traversal-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Adapting Morris In-Order to Morris Pre-Order",
    prompt: "How does the node-emission logic change when converting Morris In-Order Traversal into Morris Pre-Order Traversal?",
    question: "How does the node-emission logic change when converting Morris In-Order Traversal into Morris Pre-Order Traversal?",
    options: [
      "When `curr.left != null`, emit `curr` on the FIRST arrival (`pred.right == null`, when installing the thread) instead of the SECOND arrival (`pred.right == curr`, when severing the thread)",
      "Emit `curr` both when installing the thread and when severing the thread",
      "Find the in-order successor in `curr.right` instead of the predecessor in `curr.left`",
      "Emit `pred` instead of `curr` whenever `pred.right == curr`"
    ],
    answer: 0,
    explanation: "In Morris traversal, a node `curr` with a left subtree is visited twice: once before exploring `curr.left` (`pred.right == null`) and once after finishing `curr.left` (`pred.right == curr`). Emitting on the first visit yields Pre-Order; emitting on the second visit yields In-Order."
  },
  {
    id: "morris-threaded-traversal-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Edge-Disjoint Predecessor Spines & Amortized Time Bound",
    prompt: "Why does repeatedly walking down `pred = pred.right` to locate the in-order predecessor at every node with a left child still result in Θ(N) total time across the entire Morris Traversal?",
    question: "Why does repeatedly walking down `pred = pred.right` to locate the in-order predecessor at every node with a left child still result in Θ(N) total time across the entire Morris Traversal?",
    options: [
      "The right-spine predecessor paths of distinct nodes are strictly edge-disjoint, so each tree edge is walked at most twice by predecessor searches (once to set a thread, once to cut it)",
      "Predecessor searches only occur at leaf nodes, which have height 0",
      "The threads permanently flatten the tree into a linked list on the first pass",
      "It only runs in O(N) on balanced trees; on skewed trees it degrades to O(N²)"
    ],
    answer: 0,
    explanation: "Each predecessor spine begins with a single left edge from `u` to `u.left` followed exclusively by right edges. Consequently, no edge can belong to the predecessor spine of two different ancestors `u₁ ≠ u₂`. Every edge is traversed at most 4 times total (≤ 4(N - 1) steps) regardless of tree balance."
  },
  {
    id: "morris-threaded-traversal-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Production Failure Modes of Morris Traversal",
    prompt: "Why is Morris Traversal hazardous in a multi-threaded read-shared cache or when implementing an early-terminating search (e.g., `findFirstMatchingNode(root)`)?",
    question: "Why is Morris Traversal hazardous in a multi-threaded read-shared cache or when implementing an early-terminating search (e.g., `findFirstMatchingNode(root)`)?",
    options: [
      "It mutates `right` pointers in place—causing data races, MESI cache-line invalidations, and infinite cycles if a thread reads concurrently or if the function returns early before severing active threads",
      "It allocates hidden thread-local storage that leaks on early return",
      "It permanently reorders the keys of the binary tree if duplicates exist",
      "It requires atomic 128-bit compare-and-swap (CAS) instructions on every node"
    ],
    answer: 0,
    explanation: "Morris Traversal temporarily introduces cycles into the tree by setting `pred.right = curr`. Concurrent readers can follow these temporary threads into infinite loops, dirtying cache lines degrades multi-core scaling, and returning early leaves permanent cycles that corrupt the tree and crash destructors."
  }
];

window.QUESTION_BANK["tree-serialization-reconstruction"] = [
  {
    id: "tree-serialization-reconstruction-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Information-Theoretic Minimum Bits to Encode Binary Tree Topology",
    prompt: "By the Catalan number bound C_N = (1/(N+1)) * C(2N, N) ≈ 4^N / (√π N^(3/2)), what is the asymptotic information-theoretic minimum number of bits required to represent the structure of an arbitrary N-node binary tree?",
    question: "By the Catalan number bound C_N = (1/(N+1)) * C(2N, N) ≈ 4^N / (√π N^(3/2)), what is the asymptotic information-theoretic minimum number of bits required to represent the structure of an arbitrary N-node binary tree?",
    options: [
      "2N - Θ(log N) bits (achieved within 1 bit by a 2N + 1 bit Pre-Order node/null bitvector)",
      "N log₂ N bits",
      "N bits",
      "64N bits"
    ],
    answer: 0,
    explanation: "Taking log₂(C_N) = log₂(4^N / (√π N^(3/2))) yields 2N - (3/2)log₂ N - O(1) bits. Encoding each internal node as `1` and each of the N + 1 null child links as `0` in Pre-Order uses 2N + 1 bits, matching the theoretical lower bound."
  },
  {
    id: "tree-serialization-reconstruction-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Subtree Boundary Calculation in Pre-Order + In-Order Reconstruction",
    prompt: "During recursive tree reconstruction from `preorder[preL..preR]` and `inorder[inL..inR]`, suppose the root `preorder[preL]` is found at index `mid` in `inorder`. What are the exact `preorder` index bounds for the left and right recursive calls?",
    question: "During recursive tree reconstruction from `preorder[preL..preR]` and `inorder[inL..inR]`, suppose the root `preorder[preL]` is found at index `mid` in `inorder`. What are the exact `preorder` index bounds for the left and right recursive calls?",
    options: [
      "Left: `[preL + 1 .. preL + (mid - inL)]`, Right: `[preL + (mid - inL) + 1 .. preR]`",
      "Left: `[preL + 1 .. mid]`, Right: `[mid + 1 .. preR]`",
      "Left: `[preL .. mid - 1]`, Right: `[mid + 1 .. preR]`",
      "Left: `[inL .. mid - 1]`, Right: `[mid + 1 .. inR]`"
    ],
    answer: 0,
    explanation: "The number of nodes in the left subtree is `leftSize = mid - inL`. In Pre-Order, those `leftSize` nodes immediately follow the root at `preL`, occupying `[preL + 1 .. preL + leftSize]`, and the right subtree occupies `[preL + leftSize + 1 .. preR]`."
  },
  {
    id: "tree-serialization-reconstruction-q3",
    type: "mcq",
    difficulty: "apply",
    title: "When Does Pre-Order + Post-Order Uniquely Reconstruct a Binary Tree?",
    prompt: "Under what structural condition do the Pre-Order and Post-Order traversal sequences of a binary tree with distinct keys uniquely determine the exact tree topology?",
    question: "Under what structural condition do the Pre-Order and Post-Order traversal sequences of a binary tree with distinct keys uniquely determine the exact tree topology?",
    options: [
      "If and only if the tree is a Full (Strict) Binary Tree where every node has either 0 or 2 children",
      "Always, for any binary tree with distinct keys",
      "Only when the binary tree is a valid Binary Search Tree (BST)",
      "Only when the height of the tree is at most log₂ N"
    ],
    answer: 0,
    explanation: "Ambiguity in Pre-Order + Post-Order arises if and only if a node has exactly 1 child (since Pre `[u, v]` and Post `[v, u]` cannot distinguish `u.left = v` from `u.right = v`). In a Full Binary Tree, every internal node has both a left and right child, making reconstruction unique."
  },
  {
    id: "tree-serialization-reconstruction-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Duplicate Keys Failure Mode in Traversal-Pair Reconstruction",
    prompt: "Why does Pre-Order + In-Order reconstruction fail when a binary tree contains duplicate keys (e.g., two nodes with value 7), and how do production serializers resolve this in O(N) time and minimal space?",
    question: "Why does Pre-Order + In-Order reconstruction fail when a binary tree contains duplicate keys (e.g., two nodes with value 7), and how do production serializers resolve this in O(N) time and minimal space?",
    options: [
      "Duplicate keys make the root's split position in In-Order ambiguous (`[7, 7]` in both Pre and In could be a left child or right child); emitting a single Pre-Order stream with explicit null-child sentinel bits (2N + 1 topology bits) eliminates the need for In-Order and handles duplicates unambiguously",
      "Hash maps cannot store duplicate keys, which can be fixed by always picking the leftmost occurrence in In-Order",
      "Duplicate keys can be resolved by pairing Pre-Order, In-Order, and Post-Order together",
      "Duplicate keys only break Post-Order reconstruction, not Pre-Order reconstruction"
    ],
    answer: 0,
    explanation: "Consider Tree 1 (`root=7, left=7`) and Tree 2 (`root=7, right=7`): both have Pre-Order `[7, 7]`, In-Order `[7, 7]`, and Post-Order `[7, 7]`, so NO combination of sentinel-free traversals can distinguish them! A single Pre-Order traversal with a 2N + 1 bit topology mask (`11000` vs `10100`) uniquely encodes any tree regardless of key duplicates."
  }
];

window.QUESTION_BANK["bst-operations-hibbard-deletion"] = [
  {
    id: "bst-operations-hibbard-deletion-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Structural Guarantee of the In-Order Successor in Two-Child Deletion",
    prompt: "In Hibbard deletion of a BST node `z` that has two non-null children, we locate `z`'s in-order successor `y = minimum(z.right)`. Which structural property is guaranteed to hold for node `y`?",
    question: "In Hibbard deletion of a BST node `z` that has two non-null children, we locate `z`'s in-order successor `y = minimum(z.right)`. Which structural property is guaranteed to hold for node `y`?",
    options: [
      "`y.left` is guaranteed to be `null` (though `y.right` may be non-null)",
      "Both `y.left` and `y.right` are guaranteed to be `null` (i.e., `y` is always a leaf)",
      "`y.right` is guaranteed to be `null`",
      "`y` is always the immediate right child of `z`"
    ],
    answer: 0,
    explanation: "Because `y` is the minimum node in `z.right`, it is found by walking left pointers until `y.left == null`. If `y.left` were non-null, `y` would not be the minimum of `z.right`. Thus `y` has at most one child (`y.right`), making it trivial to splice out."
  },
  {
    id: "bst-operations-hibbard-deletion-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Finding the In-Order Successor When `x.right == null`",
    prompt: "Suppose node `x` in a BST has `x.right == null`. Where is the in-order successor of `x` located?",
    question: "Suppose node `x` in a BST has `x.right == null`. Where is the in-order successor of `x` located?",
    options: [
      "It is the lowest ancestor of `x` whose left child is also an ancestor of `x` (i.e., the first ancestor encountered when walking up from `x` via a left-child edge)",
      "It is the maximum node in `x.left`",
      "It is always `x.parent`",
      "`x` has no in-order successor whenever `x.right == null`"
    ],
    answer: 0,
    explanation: "When `x.right == null`, we have finished the entire subtree rooted at `x` and every ancestor `p` for which `x` lies in `p.right`. The next node visited in an In-Order walk is the lowest ancestor `y` for which `x` lies in `y.left`."
  },
  {
    id: "bst-operations-hibbard-deletion-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Amortized Cost of Iterating `successor(x)` Across an Entire BST",
    prompt: "Starting at `x = minimum(root)` in an arbitrary unbalanced BST of N nodes and height h (where h could be Θ(N)), what is the total time complexity of calling `x = successor(x)` N - 1 times to visit all keys in sorted order?",
    question: "Starting at `x = minimum(root)` in an arbitrary unbalanced BST of N nodes and height h (where h could be Θ(N)), what is the total time complexity of calling `x = successor(x)` N - 1 times to visit all keys in sorted order?",
    options: [
      "Θ(N) total time (O(1) amortized time per `successor` call), regardless of tree height h",
      "Θ(N · h) total time, which degrades to Θ(N²) on a skewed tree",
      "Θ(N log N) total time",
      "Θ(h²) total time"
    ],
    answer: 0,
    explanation: "Stepping from `minimum(root)` to `maximum(root)` via `N - 1` calls to `successor(x)` traverses each of the `N - 1` tree edges at most twice (once downward and once upward), matching an Euler Tour walk in strict Θ(N) total time."
  },
  {
    id: "bst-operations-hibbard-deletion-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Culberson–Munro Theorem on Asymmetric Hibbard Deletion",
    prompt: "What happens to the expected height and search cost of an initially randomly built N-node BST if it is subjected to Ω(N²) random insertions and standard asymmetric Hibbard deletions (always replacing a two-child node with its in-order successor)?",
    question: "What happens to the expected height and search cost of an initially randomly built N-node BST if it is subjected to Ω(N²) random insertions and standard asymmetric Hibbard deletions (always replacing a two-child node with its in-order successor)?",
    options: [
      "Unconditionally plucking replacements from the right subtree (`min(z.right)`) biases the tree distribution, degrading expected search depth and height from Θ(log N) to Θ(√N)",
      "The tree distribution remains identical to a freshly built random BST with expected height Θ(log N)",
      "The tree degenerates into a strict O(N) linked list after N deletions",
      "The tree becomes more balanced over time, approaching 1.00 log₂ N height"
    ],
    answer: 0,
    explanation: "Jonassen & Knuth (1975) and Culberson & Munro (1989) proved that asymmetric Hibbard deletion destroys the random BST distribution because repeatedly removing the minimum of the right subtree shrinks right subtrees and elongates left subtrees, driving expected internal path length to Θ(N^(3/2)) and expected depth/height to Θ(√N)."
  }
];

window.QUESTION_BANK["randomly-built-bst-height"] = [
  {
    id: "randomly-built-bst-height-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Expected Depth and Height Constants of a Randomly Built BST",
    prompt: "When N distinct keys are inserted in a uniformly random permutation into an initially empty unbalanced BST, what are the asymptotic expected node depth E[d(x)] and expected tree height E[h(T)]?",
    question: "When N distinct keys are inserted in a uniformly random permutation into an initially empty unbalanced BST, what are the asymptotic expected node depth E[d(x)] and expected tree height E[h(T)]?",
    options: [
      "Expected node depth ≈ 2 ln N ≈ 1.386 log₂ N; Expected tree height ≈ 4.311 ln N ≈ 2.988 log₂ N",
      "Expected node depth ≈ 1.00 log₂ N; Expected tree height ≈ 1.44 log₂ N",
      "Expected node depth ≈ √(π N); Expected tree height ≈ N / 2",
      "Expected node depth ≈ log₂(log₂ N); Expected tree height ≈ log₂ N"
    ],
    answer: 0,
    explanation: "By the QuickSort-BST bijection, average node depth is 2 ln N ≈ 1.386 log₂ N (only 39% deeper than a complete binary tree), and by Reed's theorem (2003), expected maximum height is α ln N ≈ 4.311 ln N ≈ 2.988 log₂ N."
  },
  {
    id: "randomly-built-bst-height-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Ancestor Indicator Probability in a Randomly Built BST",
    prompt: "Let z₁ < z₂ < ... < z_N be the sorted keys inserted in a uniformly random permutation into a BST. What is the exact probability that z₃ is an ancestor of z₉?",
    question: "Let z₁ < z₂ < ... < z_N be the sorted keys inserted in a uniformly random permutation into a BST. What is the exact probability that z₃ is an ancestor of z₉?",
    options: [
      "1 / (9 - 3 + 1) = 1 / 7",
      "2 / (9 - 3 + 1) = 2 / 7",
      "1 / 9",
      "1 / 6"
    ],
    answer: 0,
    explanation: "Node z_i is an ancestor of z_j if and only if z_i is the very first element inserted among the contiguous sorted range {z_min(i,j), ..., z_max(i,j)}. For i=3 and j=9, the range {z₃, z₄, z₅, z₆, z₇, z₈, z₉} contains 9 - 3 + 1 = 7 elements, so z₃ is inserted first among them with probability 1/7."
  },
  {
    id: "randomly-built-bst-height-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Isomorphism Between Randomly Built BSTs and QuickSort",
    prompt: "Why does the total internal path length D(T) = ∑ d(z_i) of a Randomly Built BST equal the exact number of key comparisons executed by Randomized QuickSort using the same permutation of pivots?",
    question: "Why does the total internal path length D(T) = ∑ d(z_i) of a Randomly Built BST equal the exact number of key comparisons executed by Randomized QuickSort using the same permutation of pivots?",
    options: [
      "Because two keys z_i and z_j are compared during QuickSort if and only if one is chosen as a pivot before any key strictly between them—which is the exact condition for one to be an ancestor of the other in the BST",
      "Because QuickSort internally builds a pointer-based BST in memory",
      "Because both algorithms perform exactly N log₂ N comparisons in the worst case",
      "Because both algorithms use median-of-three pivot selection"
    ],
    answer: 0,
    explanation: "Inserting z_j down the BST compares z_j against every ancestor z_i on its search path. In QuickSort, z_j is compared against pivot z_i if and only if z_i is the first pivot selected from Z_{ij}, meaning z_i is an ancestor of z_j in the BST."
  },
  {
    id: "randomly-built-bst-height-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Random Permutation Distribution vs Uniform Catalan Topology Distribution",
    prompt: "For N = 3 keys {1, 2, 3}, there are 3! = 6 input permutations but only C₃ = 5 distinct BST shapes. How does sampling a BST via a uniformly random input permutation differ from sampling uniformly among all C_N Catalan binary tree topologies?",
    question: "For N = 3 keys {1, 2, 3}, there are 3! = 6 input permutations but only C₃ = 5 distinct BST shapes. How does sampling a BST via a uniformly random input permutation differ from sampling uniformly among all C_N Catalan binary tree topologies?",
    options: [
      "Random permutations heavily favor balanced trees (e.g., permutations [2,1,3] and [2,3,1] both map to the same balanced tree, giving E[h] = Θ(log N)), whereas uniform Catalan sampling weights every skinny chain equally with the balanced tree, yielding E[h] = Θ(√N)",
      "Both distributions assign equal probability 1/C_N to every tree topology",
      "Uniform Catalan sampling produces shorter trees with E[h] = Θ(log log N)",
      "Random permutations favor skewed trees more than uniform Catalan sampling"
    ],
    answer: 0,
    explanation: "A balanced tree has many independent subtrees whose insertions can be interleaved in exponentially many ways (producing the same BST), whereas a degenerate chain is produced by only 1 permutation. Thus random permutations concentrate measure on O(log N)-height trees, while uniform Catalan trees have expected height √(π N)."
  }
];

window.QUESTION_BANK["binary-d-ary-heaps"] = [
  {
    id: "binary-d-ary-heaps-q1",
    type: "mcq",
    difficulty: "recall",
    title: "0-Indexed d-Ary Heap Parent and Child Formulas",
    prompt: "In a 0-indexed d-ary heap stored in a flat array `A[0..N-1]`, what are the exact index formulas for the parent of node `i` (`i > 0`) and the `k`-th child of node `i` (`0 <= k < d`)?",
    question: "In a 0-indexed d-ary heap stored in a flat array `A[0..N-1]`, what are the exact index formulas for the parent of node `i` (`i > 0`) and the `k`-th child of node `i` (`0 <= k < d`)?",
    options: [
      "`parent(i) = Math.floor((i - 1) / d)` and `child(i, k) = d * i + 1 + k`",
      "`parent(i) = Math.floor(i / d)` and `child(i, k) = d * i + k`",
      "`parent(i) = (i - 1) >> 1` and `child(i, k) = 2 * i + k`",
      "`parent(i) = Math.floor((i + 1) / d)` and `child(i, k) = d * (i + 1) + k`"
    ],
    answer: 0,
    explanation: "Because index 0 holds the root, the d children of node 0 occupy indices `1..d`, and in general the d children of node `i` occupy `d*i + 1` through `d*i + d`. Inverting `c = d*i + 1 + k` with `0 <= k < d` yields `i = floor((c - 1) / d)`."
  },
  {
    id: "binary-d-ary-heaps-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Exact Swap Bound in Floyd's Bottom-Up Build-Heap",
    prompt: "When Floyd's bottom-up `buildHeap` runs `siftDown` from index `floor(N/2) - 1` down to `0` on an N-element binary array, what is the exact worst-case maximum number of element swaps (or hole shifts) performed as a function of N?",
    question: "When Floyd's bottom-up `buildHeap` runs `siftDown` from index `floor(N/2) - 1` down to `0` on an N-element binary array, what is the exact worst-case maximum number of element swaps (or hole shifts) performed as a function of N?",
    options: [
      "Exactly `N - popcount(N)` swaps (where `popcount(N)` is the number of 1-bits in N's binary representation), requiring at most `2(N - popcount(N)) < 2N` comparisons",
      "Exactly `N log₂ N` swaps",
      "Exactly `N / 2` swaps",
      "Exactly `2N + 1` swaps"
    ],
    answer: 0,
    explanation: "Summing the heights of all nodes in a complete binary tree of size N yields the exact identity ∑ height(u) = N - s₂(N), where s₂(N) is the binary popcount of N. Since each siftDown step descends 1 level and requires at most 2 comparisons, total swaps ≤ N - popcount(N) and total comparisons < 2N."
  },
  {
    id: "binary-d-ary-heaps-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Location of the Maximum Element in a Min-Heap",
    prompt: "In a 0-indexed binary Min-Heap of N distinct elements (`N >= 2`), where must the maximum element reside, and how many elements must be inspected in the worst case to find it?",
    question: "In a 0-indexed binary Min-Heap of N distinct elements (`N >= 2`), where must the maximum element reside, and how many elements must be inspected in the worst case to find it?",
    options: [
      "Among the `ceil(N / 2)` leaf nodes residing at array slice `A[floor(N/2) .. N-1]`, requiring Θ(N) comparisons",
      "At the very last index `A[N - 1]` in O(1) time",
      "Along the rightmost path from the root in O(log N) time",
      "Among the two children of the root `A[1]` and `A[2]`"
    ],
    answer: 0,
    explanation: "Any internal node has at least one child strictly greater than itself, so the maximum element cannot be an internal node—it must be one of the `ceil(N/2)` leaves (`indices floor(N/2) .. N-1`). Because leaves have no mutual ordering constraint, all `ceil(N/2)` leaves must be scanned."
  },
  {
    id: "binary-d-ary-heaps-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Why 4-Ary Heaps Outperform Binary Heaps on Modern CPUs",
    prompt: "Compare a 4-ary heap (`d = 4`) against a binary heap (`d = 2`) of size N. How do their worst-case comparison counts and cache-line misses compare during `siftUp` (insert/decreaseKey) and `siftDown` (extractMin)?",
    question: "Compare a 4-ary heap (`d = 4`) against a binary heap (`d = 2`) of size N. How do their worst-case comparison counts and cache-line misses compare during `siftUp` (insert/decreaseKey) and `siftDown` (extractMin)?",
    options: [
      "Tree height is halved (`log₄ N = ½ log₂ N`): `siftUp` performs 50% fewer comparisons and 50% fewer cache misses; `siftDown` performs the EXACT same `4 · log₄ N = 2 log₂ N` comparisons while halving vertical cache misses because all 4 contiguous children fit in a single 64B cache line",
      "`siftDown` performs twice as many comparisons (`4 log₂ N`) in a 4-ary heap",
      "`siftUp` performs more comparisons in a 4-ary heap because it must check 3 siblings",
      "A 4-ary heap only helps when N < 64"
    ],
    answer: 0,
    explanation: "At d = 4, `d * log_d(N) = 4 * (log₂ N / 2) = 2 log₂ N`, matching the `2 log₂ N` comparisons of a binary heap's `siftDown`! Meanwhile, vertical tree depth drops by 50%, halving dependent memory loads during both `siftUp` and `siftDown`."
  }
];

window.QUESTION_BANK["mergeable-heaps-binomial-fibonacci"] = [
  {
    id: "mergeable-heaps-binomial-fibonacci-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Structural Properties of an Order-k Binomial Tree B_k",
    prompt: "A Binomial Heap represents a priority queue as a forest of Binomial Trees. Which set of properties holds for a Binomial Tree B_k of order k?",
    question: "A Binomial Heap represents a priority queue as a forest of Binomial Trees. Which set of properties holds for a Binomial Tree B_k of order k?",
    options: [
      "It contains exactly 2^k nodes, has height k, its root has degree k (with children B_{k-1}, B_{k-2}, ..., B_0), and has C(k, d) nodes at depth d",
      "It contains 2^(k+1) - 1 nodes and every internal node has degree 2",
      "It contains Fibonacci F_{k+2} nodes and has height ≤ 1.44 k",
      "It is stored in a flat array without pointers"
    ],
    answer: 0,
    explanation: "By recursive construction, B_k links two B_{k-1} trees, doubling the node count to 2^k, increasing height to k, giving the root degree k, and producing binomial coefficient C(k, d) nodes at depth d."
  },
  {
    id: "mergeable-heaps-binomial-fibonacci-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Role of the Coefficient 2 in the Fibonacci Heap Potential Φ(H) = t(H) + 2m(H)",
    prompt: "In Fredman and Tarjan's Fibonacci Heap amortized analysis, the potential function is defined as `Φ(H) = t(H) + 2m(H)`, where `t(H)` is the number of root-list trees and `m(H)` is the number of marked nodes. Why must `m(H)` be multiplied by 2 rather than 1?",
    question: "In Fredman and Tarjan's Fibonacci Heap amortized analysis, the potential function is defined as `Φ(H) = t(H) + 2m(H)`, where `t(H)` is the number of root-list trees and `m(H)` is the number of marked nodes. Why must `m(H)` be multiplied by 2 rather than 1?",
    options: [
      "When a cascading cut unmarks a node `p`, 1 unit of potential pays for cutting `p` and inserting `p` into the root list (`Δt = +1`), while the 2nd unit pays for the actual work of the cut and for potentially marking the final ancestor at the top of the cascade",
      "Because each marked node has already lost 2 children",
      "Because each tree in the root list has at least 2 marked children",
      "To bound the maximum degree by 2 log₂ N instead of log_φ N"
    ],
    answer: 0,
    explanation: "When a marked ancestor `p` is cut in a cascade, `t(H)` increases by +1 (because `p` becomes a new root) while `m(H)` decreases by -1 (`p` is cleared of its mark). If the weight on `m(H)` were 1, `Δt + Δm = +1 - 1 = 0` would leave zero net potential release to pay for the O(1) actual pointer work of cutting `p`! With weight 2, `Δt + 2Δm = +1 - 2 = -1`, releasing 1 net unit per cascading step."
  },
  {
    id: "mergeable-heaps-binomial-fibonacci-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Leftist Heap vs Skew Heap Spine Merging",
    prompt: "How does a Skew Heap achieve O(log N) amortized `meld(H₁, H₂)` without storing the null-path length (`npl`) field required by a Leftist Heap?",
    question: "How does a Skew Heap achieve O(log N) amortized `meld(H₁, H₂)` without storing the null-path length (`npl`) field required by a Leftist Heap?",
    options: [
      "It recursively merges along the right spines of H₁ and H₂ and unconditionally swaps the left and right children of every node along the merged path",
      "It uses a random number generator to choose whether to merge into the left or right child",
      "It rebuilds a complete binary tree after every √N merges",
      "It performs AVL rotations based on subtree size"
    ],
    answer: 0,
    explanation: "Sleator and Tarjan proved that unconditionally swapping `left` and `right` children at every node visited along the right-spine merge converts any heavy right subtrees into light left subtrees, releasing potential and guaranteeing O(log N) amortized time with zero balance metadata."
  },
  {
    id: "mergeable-heaps-binomial-fibonacci-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Why Fibonacci Heaps Rarely Beat 4-Ary Heaps in Practice for Dijkstra",
    prompt: "Asymptotically, Dijkstra's algorithm runs in O(E + V log V) with a Fibonacci Heap versus O((E + V) log_4 V) with an Indexed 4-Ary Heap. Why do production routing engines (e.g., OSRM, GraphHopper) strongly prefer 4-ary heaps over Fibonacci Heaps?",
    question: "Asymptotically, Dijkstra's algorithm runs in O(E + V log V) with a Fibonacci Heap versus O((E + V) log_4 V) with an Indexed 4-Ary Heap. Why do production routing engines (e.g., OSRM, GraphHopper) strongly prefer 4-ary heaps over Fibonacci Heaps?",
    options: [
      "Fibonacci Heap nodes carry 4 pointers + metadata (48–64 bytes/node) and chase non-contiguous circular doubly-linked lists across L3/DRAM, whereas a flat 4-ary heap fits 4 contiguous children per 64B cache line and road graphs are sparse (`E ≈ 2.5 V`) with very few `decreaseKey` calls",
      "Fibonacci Heaps do not support 64-bit integer edge weights",
      "Fibonacci Heaps have O(V²) worst-case total time across a full Dijkstra run",
      "4-ary heaps have O(1) worst-case `extractMin`"
    ],
    answer: 0,
    explanation: "Constant factors and memory hierarchy dominate: pointer-chasing 4 doubly-linked pointers per node in a Fibonacci Heap incurs ~60–100ns DRAM cache misses, while a flat 4-ary heap executes inside L1/L2 cache with hardware prefetching and `log₄ V ≤ 10` levels."
  }
];

window.QUESTION_BANK["two-heaps-k-way-merge-patterns"] = [
  {
    id: "two-heaps-k-way-merge-patterns-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Dual-Heap Invariants for Streaming Median",
    prompt: "In the Two-Heaps Streaming Median algorithm using a Max-Heap `lo` and a Min-Heap `hi`, what two invariants must hold after every `addNum(x)` operation?",
    question: "In the Two-Heaps Streaming Median algorithm using a Max-Heap `lo` and a Min-Heap `hi`, what two invariants must hold after every `addNum(x)` operation?",
    options: [
      "All keys in `lo` are ≤ all keys in `hi` (`lo.top() <= hi.top()`), and `0 <= lo.size() - hi.size() <= 1`",
      "All keys in `lo` are ≥ all keys in `hi`, and `lo.size() == 2 * hi.size()`",
      "Both `lo` and `hi` are Min-Heaps of equal size",
      "`lo` stores odd numbers and `hi` stores even numbers"
    ],
    answer: 0,
    explanation: "Partitioning the lower half into Max-Heap `lo` and the upper half into Min-Heap `hi` with `0 <= |lo| - |hi| <= 1` places the exact median at `lo.top()` when N is odd and `(lo.top() + hi.top()) / 2` when N is even."
  },
  {
    id: "two-heaps-k-way-merge-patterns-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Sliding Window Median with Lazy Deletion Balance Tracking",
    prompt: "When extending the Two-Heaps pattern to compute the median over a sliding window of width W (where elements enter and leave the window), why do we track `int balance` (count of valid non-expired elements in `lo` minus `hi`) alongside a hash map `delayed[val]`?",
    question: "When extending the Two-Heaps pattern to compute the median over a sliding window of width W (where elements enter and leave the window), why do we track `int balance` (count of valid non-expired elements in `lo` minus `hi`) alongside a hash map `delayed[val]`?",
    options: [
      "Because an expired element buried deep inside `lo` or `hi` cannot be removed in O(log W) without indexed handles; decrementing `balance` immediately accounts for its logical removal while physical popping is deferred until it surfaces at `lo.top()` or `hi.top()`",
      "To avoid using any heaps at all",
      "Because `lo.size()` is O(N) to query in standard library heaps",
      "To sort the hash map in O(W log W) time on every window shift"
    ],
    answer: 0,
    explanation: "Standard heaps only expose their root in O(1). By tracking the logical `balance` of active elements in `lo` vs `hi` and pruning expired elements whenever they reach `lo.top()` or `hi.top()`, each element is pushed once and popped once in O(log W) amortized time."
  },
  {
    id: "two-heaps-k-way-merge-patterns-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Generalizing Two Heaps to the 99th Percentile (p99 Latency)",
    prompt: "How do you modify the Two-Heaps Streaming Median structure (`lo` Max-Heap, `hi` Min-Heap) to continuously track the exact 99th percentile (`p99`) of N streaming request latencies in O(log N) update and O(1) query time?",
    question: "How do you modify the Two-Heaps Streaming Median structure (`lo` Max-Heap, `hi` Min-Heap) to continuously track the exact 99th percentile (`p99`) of N streaming request latencies in O(log N) update and O(1) query time?",
    options: [
      "Maintain the same ordering invariant `lo.top() <= hi.top()`, but rebalance sizes after each insertion so that `lo.size() == ceil(0.99 * N)` and `hi.size() == N - ceil(0.99 * N)`; then `lo.top()` is the exact p99 latency",
      "Use 100 separate heaps, one for each percentile bucket",
      "Keep `lo.size() == hi.size()` and multiply `lo.top()` by 1.98",
      "Two heaps can only track the 50th percentile (median), not arbitrary quantiles"
    ],
    answer: 0,
    explanation: "The Two-Heaps boundary tracks whatever order statistic corresponds to the target size of `lo`. Maintaining `|lo| = ceil(q * N)` ensures `lo` holds the smallest `ceil(q * N)` items, so `lo.top()` is the exact q-quantile in O(1) time."
  },
  {
    id: "two-heaps-k-way-merge-patterns-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Tournament Loser Tree vs Binary Heap in RocksDB K-Way Merge",
    prompt: "When RocksDB merges K sorted SSTable iterators during compaction, why does it use Knuth's Tournament Loser Tree instead of a standard binary Min-Heap of size K?",
    question: "When RocksDB merges K sorted SSTable iterators during compaction, why does it use Knuth's Tournament Loser Tree instead of a standard binary Min-Heap of size K?",
    options: [
      "A binary Min-Heap performs `2 log₂ K` expensive string/slice key comparisons per emitted record during `siftDown` (comparing two children, then child vs parent), whereas a Loser Tree walks bottom-up from the leaf and compares the new key only against the stored match loser at each level (`1 · log₂ K` comparisons)",
      "A Loser Tree uses O(1) memory instead of O(K) memory",
      "A Loser Tree merges K streams in O(N) time independent of K",
      "A binary Min-Heap cannot handle duplicate keys across SSTables"
    ],
    answer: 0,
    explanation: "In database engines, key comparisons compare variable-length byte slices with MVCC sequence numbers. Halving comparisons from `2 log₂ K` to `log₂ K` and replacing top-down data-dependent child branches with a deterministic bottom-up leaf-to-root walk significantly accelerates compaction throughput."
  }
];

window.QUESTION_BANK["case-timer-wheels-vs-heaps"] = [
  {
    id: "case-timer-wheels-vs-heaps-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Workload Asymmetry of Network Request Timers",
    prompt: "According to Varghese & Lauck's SOSP '87 study and production telemetry in Netty/Envoy/Kafka, which timer operations dominate CPU cost in high-throughput network servers?",
    question: "According to Varghese & Lauck's SOSP '87 study and production telemetry in Netty/Envoy/Kafka, which timer operations dominate CPU cost in high-throughput network servers?",
    options: [
      "`startTimer` and `cancelTimer` (because >99% of RPC/TCP timeout timers are cancelled upon normal response arrival before they ever expire)",
      "`expireTimer` callback execution",
      "Sorting all expired timers in chronological order after they fire",
      "Merging two timer queues across machines"
    ],
    answer: 0,
    explanation: "Every in-flight RPC arms a defensive timeout timer and cancels it milliseconds later when the RPC succeeds. Consequently, O(1) start and O(1) cancellation are far more important than expiration ordering."
  },
  {
    id: "case-timer-wheels-vs-heaps-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Apache Kafka Purgatory: Hybrid Hierarchical Wheel + DelayQueue",
    prompt: "How does Apache Kafka's `SystemTimer` / `HierarchicalTimingWheel` achieve O(1) timer insertion and cancellation for 1,000,000 delayed operations WITHOUT waking up a background thread on every empty 1ms tick?",
    question: "How does Apache Kafka's `SystemTimer` / `HierarchicalTimingWheel` achieve O(1) timer insertion and cancellation for 1,000,000 delayed operations WITHOUT waking up a background thread on every empty 1ms tick?",
    options: [
      "Individual timers are inserted/cancelled in O(1) inside doubly-linked wheel buckets, while only the non-empty `TimerTaskList` buckets themselves (at most ~80 buckets across 4 wheels) are pushed into a single `DelayQueue` (Min-Heap) that sleeps until the next non-empty bucket expires",
      "It uses a busy-wait `while(true)` spinloop on a dedicated CPU core",
      "It inserts all 1,000,000 timers directly into Java's `DelayQueue`",
      "It rounds all timeouts up to the nearest 10 seconds"
    ],
    answer: 0,
    explanation: "By decoupling per-timer management (handled in O(1) by intrusive doubly-linked lists inside wheel buckets) from sleep scheduling (handled by a `DelayQueue` over at most `L * W` bucket objects), Kafka reduces heap size from N = 1,000,000 to B ≤ 80."
  },
  {
    id: "case-timer-wheels-vs-heaps-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Go Runtime Per-P 4-Ary Heap & Lazy Atomic Cancellation",
    prompt: "In Go's runtime (`runtime/time.go`), why is each scheduler processor `P` equipped with a 4-ary Min-Heap using atomic status flags (`timerDeleted`, `timerModified`) rather than a single global binary heap?",
    question: "In Go's runtime (`runtime/time.go`), why is each scheduler processor `P` equipped with a 4-ary Min-Heap using atomic status flags (`timerDeleted`, `timerModified`) rather than a single global binary heap?",
    options: [
      "Per-P sharding eliminates global mutex contention, the 4-ary layout halves cache-line misses while providing exact nanosecond sleep deadlines, and atomic lazy deletion lets any goroutine cancel a timer in O(1) without locking the owning P's heap",
      "Because Go does not support doubly-linked lists in the runtime package",
      "Because a 4-ary heap uses 4x less memory than a binary heap",
      "Because Go timers only support resolutions of 100ms or coarser"
    ],
    answer: 0,
    explanation: "Go requires nanosecond sleep accuracy (ruling out coarse tick wheels) and zero idle CPU wakeups. Combining per-P 4-ary heaps with atomic status flags gives O(1) lock-free cross-core cancellation and cache-friendly O(log₄ N) heap maintenance."
  },
  {
    id: "case-timer-wheels-vs-heaps-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Linux Kernel 4.8 Timer Wheel Redesign (Eliminating Cascade Spikes)",
    prompt: "Why did Linux kernel 4.8 replace the classic 2.6 cascading hierarchical timer wheel (`tv1..tv5`) with a non-cascading multi-level wheel for `timer_list` timeouts?",
    question: "Why did Linux kernel 4.8 replace the classic 2.6 cascading hierarchical timer wheel (`tv1..tv5`) with a non-cascading multi-level wheel for `timer_list` timeouts?",
    options: [
      "Because periodically re-hashing thousands of long-horizon timeouts from upper wheel levels down to lower levels caused unpredictable latency spikes in softirq processing for timers that were almost always cancelled before firing anyway; trading ~12.5% slack on distant timeouts eliminated downward cascades entirely",
      "Because the classic wheel required O(N log N) time to insert a timer",
      "Because 64-bit CPUs cannot perform bitmask modulo indexing",
      "Because `timer_list` was replaced globally by Fibonacci Heaps"
    ],
    answer: 0,
    explanation: "In the classic odometer cascade, every 256 ticks `tv2` spilled into `tv1` (and every 256² ticks `tv3` spilled into `tv2`), moving thousands of network timeouts that would be cancelled milliseconds later. Accepting bounded slack on distant timeouts allowed Linux 4.8+ to expire buckets in place with zero downward cascades."
  }
];

window.QUESTION_BANK["build-indexed-d-ary-priority-queue"] = [
  {
    id: "build-indexed-d-ary-priority-queue-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Bijection Invariant of an Indexed Priority Queue",
    prompt: "In an Indexed Priority Queue storing external handles `u ∈ [0, M)` across `N` active heap slots, what invariant relates the heap array `heap[0..N-1]` and the position map `pos[0..M-1]`?",
    question: "In an Indexed Priority Queue storing external handles `u ∈ [0, M)` across `N` active heap slots, what invariant relates the heap array `heap[0..N-1]` and the position map `pos[0..M-1]`?",
    options: [
      "For every heap slot `i ∈ [0, N)`, `pos[heap[i]] == i`, and for every active handle `u`, `heap[pos[u]] == u` (with `pos[u] == -1` when `u` is absent)",
      "`heap[i]` stores the priority key and `pos[i]` stores the parent index",
      "`pos[u]` stores the key of handle `u`",
      "`heap` is sorted in ascending order of external handle `u`"
    ],
    answer: 0,
    explanation: "`heap` and `pos` are inverse permutations of each other: `heap[i]` maps heap slot `i` to handle `u`, and `pos[u]` maps handle `u` back to heap slot `i` in O(1) time."
  },
  {
    id: "build-indexed-d-ary-priority-queue-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Why Arbitrary `erase(u)` Requires Both `siftUp` and `siftDown`",
    prompt: "When deleting an arbitrary internal handle `u` at heap slot `i = pos[u]` (`i < N - 1`) in an Indexed Min-Heap by moving the last leaf `v = heap[N - 1]` into slot `i`, why must we call BOTH `siftUp(i)` and `siftDown(i)`?",
    question: "When deleting an arbitrary internal handle `u` at heap slot `i = pos[u]` (`i < N - 1`) in an Indexed Min-Heap by moving the last leaf `v = heap[N - 1]` into slot `i`, why must we call BOTH `siftUp(i)` and `siftDown(i)`?",
    options: [
      "Because heap order only relates ancestors and descendants within the same branch; the last leaf `v` comes from a different branch and its key can be strictly smaller than `parent(i)`'s key (requiring `siftUp`) OR strictly larger than `children(i)`'s keys (requiring `siftDown`)",
      "Because `siftUp` updates `pos[]` while `siftDown` updates `heap[]`",
      "Because in a 4-ary heap a single `siftDown` only moves an element halfway down",
      "Calling `siftUp(i)` is redundant; `siftDown(i)` alone is always sufficient for arbitrary deletion"
    ],
    answer: 0,
    explanation: "In a Min-Heap, branch A can have values `1 -> 100 -> 200` while branch B has values `1 -> 2 -> 5`. Deleting `100` in branch A and replacing it with leaf `5` from branch B places `5` below `1` and above `200`, or if `100`'s parent was `50`, places `5` below `50` (`5 < 50`), requiring `siftUp`!"
  },
  {
    id: "build-indexed-d-ary-priority-queue-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Boundary Bug When Erasing the Final Element `heap.back()`",
    prompt: "In `erase(u)`, suppose `i = pos[u]` happens to be the very last slot of the heap (`i == heap.size() - 1`). What bug occurs if you unconditionally assign `heap[i] = lastHandle` and call `siftUp(i); siftDown(i);` after `heap.pop_back()`?",
    question: "In `erase(u)`, suppose `i = pos[u]` happens to be the very last slot of the heap (`i == heap.size() - 1`). What bug occurs if you unconditionally assign `heap[i] = lastHandle` and call `siftUp(i); siftDown(i);` after `heap.pop_back()`?",
    options: [
      "After `heap.pop_back()`, index `i` is out of bounds (`i == heap.size()`), causing out-of-bounds memory corruption and resurrected `pos[u] = i` state for the deleted handle `u`!",
      "It causes an infinite loop inside `siftDown`",
      "It deletes the minimum element at index 0 instead",
      "No bug occurs because `siftUp` checks `i > 0`"
    ],
    answer: 0,
    explanation: "When `u` was already at `heap.back()`, `lastHandle == u`. Executing `heap[i] = lastHandle; pos[lastHandle] = i;` after `pop_back()` writes one past the end of `heap` and marks the deleted handle `u` as still present at slot `i`! Always guard with `if (i < heap.size())`."
  },
  {
    id: "build-indexed-d-ary-priority-queue-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Memory Footprint & Cache Residency: Indexed 4-Ary PQ vs Lazy Duplicate Heap in Dijkstra",
    prompt: "On a dense graph with V = 100,000 vertices and E = 10,000,000 edges, how does an Indexed 4-Ary Min-PQ compare against a standard `std::priority_queue` using lazy duplicate pushes during Dijkstra's algorithm?",
    question: "On a dense graph with V = 100,000 vertices and E = 10,000,000 edges, how does an Indexed 4-Ary Min-PQ compare against a standard `std::priority_queue` using lazy duplicate pushes during Dijkstra's algorithm?",
    options: [
      "The Indexed 4-Ary PQ bounds heap capacity strictly to V = 100,000 entries (~1.6 MB, fitting entirely inside CPU L3 cache) and updates priorities in-place in ≤ 9 steps (`log₄ V`), whereas lazy pushing grows the heap up to E = 10,000,000 entries (~160 MB, thrashing DRAM) and suffers O(E log E) pops",
      "Lazy duplicate pushing uses less memory because it omits the `pos[]` array",
      "Both approaches allocate O(E) heap elements in the worst case",
      "The Indexed 4-Ary PQ requires O(V²) time to initialize `pos[]`"
    ],
    answer: 0,
    explanation: "An Indexed 4-Ary PQ requires fixed 3V arrays (`heap`, `pos`, `keys`), capping working memory at ~1.6 MB for V = 100k regardless of how many tens of millions of edges relax, keeping all heap operations L2/L3 cache-resident."
  }
];
