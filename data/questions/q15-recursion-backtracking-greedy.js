window.QUESTION_BANK = window.QUESTION_BANK || {};
Object.assign(window.QUESTION_BANK, {
  "combinatorial-generation-permutations": [
    {
      "id": "m15-q01",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Narayana's Next Permutation Amortized Complexity",
      "prompt": "What are the worst-case single-call time complexity and the amortized time complexity per permutation when generating all $n!$ permutations in lexicographic order using Narayana's algorithm (`std::next_permutation`)?",
      "question": "What are the worst-case single-call time complexity and the amortized time complexity per permutation when generating all $n!$ permutations in lexicographic order using Narayana's algorithm (`std::next_permutation`)?",
      "options": [
        "$O(n)$ worst-case single call, $O(1)$ amortized per permutation",
        "$O(n \\log n)$ worst-case single call, $O(n)$ amortized per permutation",
        "$O(1)$ worst-case single call, $O(1)$ amortized per permutation",
        "$O(n^2)$ worst-case single call, $O(n)$ amortized per permutation"
      ],
      "answer": 0,
      "explanation": "In the worst case (e.g., transitioning from `[1, n, n-1, ..., 2]` to `[2, 1, 3, ..., n]`), `next_permutation` scans and reverses a suffix of length $n-1$ in $O(n)$ time. However, a suffix of length $k$ is reversed only once every $k!$ calls, yielding $\\sum_{k=2}^n O(k)/k! = O(1)$ amortized operations per permutation."
    },
    {
      "id": "m15-q02",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Binary Reflected Gray Code Value",
      "prompt": "Using the standard Binary Reflected Gray Code formula $G(i) = i \\oplus (i \\gg 1)$, what is the base-10 integer value of $G(13)$?",
      "question": "Using the standard Binary Reflected Gray Code formula $G(i) = i \\oplus (i \\gg 1)$, what is the base-10 integer value of $G(13)$?",
      "answer": 11,
      "tolerance": 0,
      "explanation": "In binary, $13 = 1101_2$ and $13 \\gg 1 = 6 = 0110_2$. Their bitwise XOR is $1101_2 \\oplus 0110_2 = 1011_2 = 8 + 2 + 1 = 11$."
    },
    {
      "id": "m15-q03",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Narayana Lexicographic Successor Trace",
      "prompt": "Given the array $A = [2, 4, 6, 5, 3, 1]$, what is the immediate next lexicographic permutation produced by Narayana's algorithm?",
      "question": "Given the array $A = [2, 4, 6, 5, 3, 1]$, what is the immediate next lexicographic permutation produced by Narayana's algorithm?",
      "options": [
        "$[2, 5, 1, 3, 4, 6]$",
        "$[2, 5, 6, 4, 3, 1]$",
        "$[2, 6, 1, 3, 4, 5]$",
        "$[3, 1, 2, 4, 5, 6]$"
      ],
      "answer": 0,
      "explanation": "Scanning from the right, the longest non-increasing suffix is $[6, 5, 3, 1]$, so the pivot is $A[1] = 4$. The smallest element in the suffix strictly greater than $4$ is $5$. Swapping $4$ and $5$ gives $[2, 5, 6, 4, 3, 1]$, and reversing the suffix $[6, 4, 3, 1]$ yields $[2, 5, 1, 3, 4, 6]$."
    },
    {
      "id": "m15-q04",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Gosper's Hack Bitwise Mechanics",
      "prompt": "In Gosper's hack for advancing a bitmask `x` to the next lexicographic integer with the same popcount (`c = x & -x; r = x + c; next_x = (((r ^ x) >> 2) / c) | r;`), what is the exact role of the subexpression `((r ^ x) >> 2) / c`?",
      "question": "In Gosper's hack for advancing a bitmask `x` to the next lexicographic integer with the same popcount (`c = x & -x; r = x + c; next_x = (((r ^ x) >> 2) / c) | r;`), what is the exact role of the subexpression `((r ^ x) >> 2) / c`?",
      "options": [
        "It takes the contiguous block of $m$ ones that were cleared during the carry propagation `r = x + c`, reduces its length to $m - 1$ ones, and right-aligns them to bit position 0",
        "It clears the highest set bit of `x` and shifts the remaining bits left by 2 positions",
        "It computes the Gray code parity of the carry chain to prevent signed integer overflow",
        "It isolates the second-lowest set bit of `x` so that two bits can be swapped in place"
      ],
      "answer": 0,
      "explanation": "Adding the lowest set bit `c` to `x` turns the lowest contiguous run of $m$ ones into zeros and sets the zero bit immediately above that run (in `r`). Thus `r ^ x` contains a mask of $m + 1$ ones spanning from the bit of `c` up to the newly set bit in `r`. Dividing by `c` (right-shifting by `ctz(c)`) and right-shifting by 2 more bits leaves exactly $m - 1$ ones aligned at the least significant bits."
    }
  ],
  "backtracking-state-space-trees": [
    {
      "id": "m15-q05",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Minimum Remaining Values (MRV) Heuristic",
      "prompt": "Why does the Minimum Remaining Values (MRV / Fail-First) variable-ordering heuristic dramatically speed up backtracking search on constraint satisfaction problems?",
      "question": "Why does the Minimum Remaining Values (MRV / Fail-First) variable-ordering heuristic dramatically speed up backtracking search on constraint satisfaction problems?",
      "options": [
        "By branching on the unassigned variable with the fewest legal values first, it minimizes the branching factor near the root and detects dead ends ($0$ legal values) immediately",
        "By branching on the variable with the most legal values first, it maximizes the probability of guessing a valid solution without backtracking",
        "It guarantees that no backtracking will ever occur on any NP-complete problem",
        "It converts depth-first search into breadth-first search without using extra memory"
      ],
      "answer": 0,
      "explanation": "In a state-space tree where node depths have branching factors $b_1, b_2, \\dots, b_d$, the size of the upper levels scales with $b_1 + b_1 b_2 + \\dots$. Choosing the variable with the smallest domain $b_k$ first (especially $b_k = 0$ or $b_k = 1$) prunes dead subtrees before multiplying them by the choices of unconstrained variables."
    },
    {
      "id": "m15-q06",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Knuth's Monte Carlo Tree Size Estimator",
      "prompt": "Using Knuth's Random Walk Estimator $X = 1 + d_0 + d_0 d_1 + d_0 d_1 d_2 + \\dots$ for a backtracking tree, suppose a single random root-to-leaf probe sees $d_0 = 3$ valid choices at the root, $d_1 = 2$ valid choices at depth 1, $d_2 = 4$ valid choices at depth 2, and $d_3 = 0$ valid choices at depth 3 (leaf). What is the estimated total number of nodes $X$ in the tree from this probe?",
      "question": "Using Knuth's Random Walk Estimator $X = 1 + d_0 + d_0 d_1 + d_0 d_1 d_2 + \\dots$ for a backtracking tree, suppose a single random root-to-leaf probe sees $d_0 = 3$ valid choices at the root, $d_1 = 2$ valid choices at depth 1, $d_2 = 4$ valid choices at depth 2, and $d_3 = 0$ valid choices at depth 3 (leaf). What is the estimated total number of nodes $X$ in the tree from this probe?",
      "answer": 34,
      "tolerance": 0,
      "explanation": "Substituting into Knuth's unbiased estimator formula: $X = 1 + 3 + (3 \\times 2) + (3 \\times 2 \\times 4) = 1 + 3 + 6 + 24 = 34$."
    },
    {
      "id": "m15-q07",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Symmetry Breaking in K-Subset Partitioning",
      "prompt": "When partitioning $N$ items into $K$ indistinguishable bins of target sum $T$ via backtracking (`bins[0..K-1]`), why can we immediately `break` out of the bin loop `for (int b = 0; b < K; ++b)` if placing `nums[idx]` into an empty bin (`bins[b] == 0`) fails to find a solution?",
      "question": "When partitioning $N$ items into $K$ indistinguishable bins of target sum $T$ via backtracking (`bins[0..K-1]`), why can we immediately `break` out of the bin loop `for (int b = 0; b < K; ++b)` if placing `nums[idx]` into an empty bin (`bins[b] == 0`) fails to find a solution?",
      "options": [
        "All empty bins have capacity 0 and are pairwise isomorphic; placing `nums[idx]` into any subsequent empty bin `b' > b` produces an identical up-to-permutation state space",
        "Because the items are sorted in ascending order, no subsequent item can fit into `bins[b]`",
        "Because an empty bin can only ever hold a single item of weight equal to $T$",
        "Because the sum of the remaining items is guaranteed to be less than $T$"
      ],
      "answer": 0,
      "explanation": "At any point in the recursion, all currently empty bins have state `0` and are completely indistinguishable. If placing `nums[idx]` into the first empty bin and exploring all possible completions fails, placing `nums[idx]` into the second empty bin explores the exact same subtree with bin labels swapped. Breaking eliminates a $K!$ symmetry factor."
    },
    {
      "id": "m15-q08",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Bitmask N-Queens Diagonal Shift Invariant",
      "prompt": "In the register-based bitmask $N$-Queens solver `dfs(cols, diag1, diag2)`, when transitioning from row $r$ to row $r+1$ after placing a queen at column bit `bit`, we pass `(diag1 | bit) << 1` and `(diag2 | bit) >> 1`. Why does this eliminate all $O(N)$ diagonal array updates and undo steps?",
      "question": "In the register-based bitmask $N$-Queens solver `dfs(cols, diag1, diag2)`, when transitioning from row $r$ to row $r+1$ after placing a queen at column bit `bit`, we pass `(diag1 | bit) << 1` and `(diag2 | bit) >> 1`. Why does this eliminate all $O(N)$ diagonal array updates and undo steps?",
      "options": [
        "Each diagonal ray steps 1 column left or 1 column right per row downward; shifting the accumulated bitmasks by 1 bit projects all prior queens' diagonal attacks onto row $r+1$, and passing by value restores the caller's registers on return",
        "Shifting left and right hashes the queen coordinates into a Zobrist table of size $2N$",
        "It encodes the row index in the upper 16 bits and the column index in the lower 16 bits",
        "It relies on C++ unsigned integer overflow to clear attacks that wrap around the board edges"
      ],
      "answer": 0,
      "explanation": "An anti-diagonal attack $(r + c = \\text{const})$ moves one column left ($c - 1$) each time $r$ increments by $1$, and a main-diagonal attack $(r - c = \\text{const})$ moves one column right ($c + 1$). Bit-shifting the masks by 1 bit per row step projects every ancestor queen's diagonal ray onto the current row in 1 ALU cycle, and pass-by-value semantics make backtracking free."
    }
  ],
  "exact-cover-knuth-algorithm-x": [
    {
      "id": "m15-q09",
      "type": "mcq",
      "difficulty": "recall",
      "title": "The Dancing Links Pointer Property",
      "prompt": "What fundamental property of doubly linked lists allows Knuth's Dancing Links (`DLX`) to restore a removed node `x` via `L[R[x]] = x; R[L[x]] = x;` in $O(1)$ time?",
      "question": "What fundamental property of doubly linked lists allows Knuth's Dancing Links (`DLX`) to restore a removed node `x` via `L[R[x]] = x; R[L[x]] = x;` in $O(1)$ time?",
      "options": [
        "Removing `x` via `L[R[x]] = L[x]; R[L[x]] = R[x];` never modifies `L[x]` or `R[x]` on `x` itself, so `x` still points to its exact neighbors at the moment it was removed",
        "Every node in a doubly linked list is stored at an address equal to the XOR of its neighbors",
        "The column header maintains a stack of dynamically allocated copies of deleted rows",
        "The matrix is symmetric ($A = A^T$), so horizontal links equal vertical links"
      ],
      "answer": 0,
      "explanation": "When `x` is spliced out of a circular doubly linked list, only its neighbors' pointers (`L[R[x]]` and `R[L[x]]`) are mutated. `x` retains its original `L[x]` and `R[x]` values, allowing $O(1)$ re-insertion provided removals are undone in strict LIFO order."
    },
    {
      "id": "m15-q10",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Sudoku Exact Cover Matrix Dimensions",
      "prompt": "When formulating a standard $9 \\times 9$ Sudoku puzzle (with no clues pre-eliminated) as an Exact Cover binary matrix where rows represent $(r, c, d)$ placements and columns represent cell, row-digit, col-digit, and box-digit constraints, how many total 1s (non-zero matrix entries) exist across the entire $729 \\times 324$ matrix?",
      "question": "When formulating a standard $9 \\times 9$ Sudoku puzzle (with no clues pre-eliminated) as an Exact Cover binary matrix where rows represent $(r, c, d)$ placements and columns represent cell, row-digit, col-digit, and box-digit constraints, how many total 1s (non-zero matrix entries) exist across the entire $729 \\times 324$ matrix?",
      "answer": 2916,
      "tolerance": 0,
      "explanation": "There are $9 \\times 9 \\times 9 = 729$ candidate rows. Every candidate placement $(r, c, d)$ satisfies exactly 4 constraints (1 cell, 1 row-digit, 1 col-digit, 1 box-digit), so each row has 4 ones: $729 \\times 4 = 2916$ non-zero entries."
    },
    {
      "id": "m15-q11",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Algorithm X Cover Operation Semantics",
      "prompt": "In Knuth's Algorithm X, when we select a row $r$ to include in our partial solution, we call `cover(j)` for every column $j$ where $A[r, j] = 1$. What does `cover(j)` remove from the active matrix?",
      "question": "In Knuth's Algorithm X, when we select a row $r$ to include in our partial solution, we call `cover(j)` for every column $j$ where $A[r, j] = 1$. What does `cover(j)` remove from the active matrix?",
      "options": [
        "Column header $j$ from the header list, plus every row $i$ that has $A[i, j] = 1$ from all other columns $k \\neq j$ where $A[i, k] = 1$",
        "Only column header $j$ and row $r$; all other rows with a $1$ in column $j$ remain active",
        "Every column $k$ that shares at least one row with column $j$",
        "Only the vertical links inside column $j$, leaving all other columns untouched"
      ],
      "answer": 0,
      "explanation": "Because column $j$ is now satisfied by row $r$, no other row $i$ that also has a $1$ in column $j$ can be chosen without covering column $j$ twice. Therefore, `cover(j)` unlinks column $j$ from the header list and vertically unlinks every row $i$ (where $A[i, j] = 1$) from all of its other columns."
    },
    {
      "id": "m15-q12",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Why Non-LIFO Uncovering Corrupts DLX",
      "prompt": "In Dancing Links, why is it mandatory that `uncover(c)` traverses rows upward (`U`) and row elements leftward (`L`) when `cover(c)` traversed them downward (`D`) and rightward (`R`)?",
      "question": "In Dancing Links, why is it mandatory that `uncover(c)` traverses rows upward (`U`) and row elements leftward (`L`) when `cover(c)` traversed them downward (`D`) and rightward (`R`)?",
      "options": [
        "Two distinct rows $i_1$ and $i_2$ covered by `cover(c)` may both contain a $1$ in some other column $k$; if they are unlinked downward ($i_1$ then $i_2$), $i_2$'s `U` pointer points to $i_1$'s predecessor, so $i_2$ must be restored before $i_1$",
        "Traversing upward and leftward improves CPU hardware prefetcher accuracy by reversing cache lines",
        "Because circular doubly linked lists cannot be traversed in the same direction twice",
        "To ensure that the `col_size` counter does not underflow below zero"
      ],
      "answer": 0,
      "explanation": "Suppose column $k$ contains nodes $A \\leftrightarrow B \\leftrightarrow C \\leftrightarrow D$, and `cover(c)` removes $B$ first (linking $A \\leftrightarrow C$) and then removes $C$ second (linking $A \\leftrightarrow D$, with $C.U = A$). If we tried to restore $B$ before $C$, $B.D$ is $C$ (which is still unlinked!), corrupting the list. Restoring in exact reverse order ($C$ first between $A$ and $D$, then $B$ between $A$ and $C$) guarantees every node's saved neighbors are already back in the list."
    }
  ],
  "branch-and-bound-admissible-bounds": [
    {
      "id": "m15-q13",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Admissibility Condition for Branch and Bound",
      "prompt": "When solving a **maximization** problem using Branch and Bound with current best feasible solution value (incumbent) $z^*$, what property must the bounding function $UB(u)$ satisfy at node $u$ so that pruning whenever $UB(u) \\le z^*$ is guaranteed to preserve global optimality?",
      "question": "When solving a **maximization** problem using Branch and Bound with current best feasible solution value (incumbent) $z^*$, what property must the bounding function $UB(u)$ satisfy at node $u$ so that pruning whenever $UB(u) \\le z^*$ is guaranteed to preserve global optimality?",
      "options": [
        "$UB(u)$ must be an overestimate ($UB(u) \\ge \\max_{x \\in \\mathcal{F}(u)} f(x)$) of the best feasible solution in subtree $u$",
        "$UB(u)$ must be an underestimate ($UB(u) \\le \\max_{x \\in \\mathcal{F}(u)} f(x)$) of the best feasible solution in subtree $u$",
        "$UB(u)$ must equal the exact average of all leaves in subtree $u$",
        "$UB(u)$ must be strictly decreasing along every root-to-leaf path"
      ],
      "answer": 0,
      "explanation": "For maximization, an admissible upper bound $UB(u)$ must never underestimate the true optimal completion of subtree $u$: $\\max_{x \\in \\mathcal{F}(u)} f(x) \\le UB(u)$. Then, if $UB(u) \\le z^*$, we have $\\max_{x \\in \\mathcal{F}(u)} f(x) \\le UB(u) \\le z^*$, proving no leaf in $u$ can strictly beat $z^*$."
    },
    {
      "id": "m15-q14",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Dantzig Fractional Knapsack Upper Bound",
      "prompt": "Consider a 0/1 Knapsack problem with capacity $W = 15$ and 3 items sorted by value/weight ratio: Item 1 ($w_1 = 6, v_1 = 30$), Item 2 ($w_2 = 5, v_2 = 20$), and Item 3 ($w_3 = 8, v_3 = 24$). At the Branch-and-Bound node where we **exclude** Item 1 (`x_1 = 0`), what is the exact Fractional Knapsack LP relaxation upper bound $UB$?",
      "question": "Consider a 0/1 Knapsack problem with capacity $W = 15$ and 3 items sorted by value/weight ratio: Item 1 ($w_1 = 6, v_1 = 30$), Item 2 ($w_2 = 5, v_2 = 20$), and Item 3 ($w_3 = 8, v_3 = 24$). At the Branch-and-Bound node where we **exclude** Item 1 (`x_1 = 0`), what is the exact Fractional Knapsack LP relaxation upper bound $UB$?",
      "answer": 44,
      "tolerance": 0,
      "explanation": "With Item 1 excluded, remaining capacity is $15$. We greedily take all of Item 2 ($w_2 = 5, v_2 = 20$), leaving capacity $15 - 5 = 10$. Next we take all of Item 3 ($w_3 = 8, v_3 = 24$), leaving capacity $2$ and no more items. Total upper bound $UB = 20 + 24 = 44$."
    },
    {
      "id": "m15-q15",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Held-Karp 1-Tree Relaxation for Symmetric TSP",
      "prompt": "Why is the minimum weight of a **1-Tree** (a Minimum Spanning Tree on vertices $\\{2..n\\}$ plus the two minimum-weight edges incident to vertex $1$) a valid admissible lower bound for the Symmetric Traveling Salesperson Problem (TSP)?",
      "question": "Why is the minimum weight of a **1-Tree** (a Minimum Spanning Tree on vertices $\\{2..n\\}$ plus the two minimum-weight edges incident to vertex $1$) a valid admissible lower bound for the Symmetric Traveling Salesperson Problem (TSP)?",
      "options": [
        "Every Hamiltonian cycle (TSP tour) consists of two edges incident to vertex $1$ plus a simple path spanning $\\{2..n\\}$ (which is a spanning tree of $\\{2..n\\}$); thus every TSP tour is a 1-tree, so the minimum 1-tree costs at most $\\text{OPT}_{\\text{TSP}}$",
        "Because a 1-tree always has $n - 1$ edges whereas a TSP tour has $n$ edges",
        "Because Kruskal's algorithm finds the exact shortest Hamiltonian cycle whenever edge weights satisfy the triangle inequality",
        "Because the degree of every vertex in a 1-tree is guaranteed to be exactly 2"
      ],
      "answer": 0,
      "explanation": "Deleting vertex $1$ and its two incident tour edges from any Hamiltonian cycle leaves a spanning path (a tree!) on $\\{2..n\\}$. Hence the set of all Hamiltonian cycles is a subset of the set of all 1-trees, and minimizing over the larger set of 1-trees (in $O(E \\log V)$ or $O(V^2)$ time) yields a valid lower bound."
    },
    {
      "id": "m15-q16",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Plunging DFS vs. Best-First Memory Tradeoff",
      "prompt": "In production Mixed-Integer Programming (MIP) and combinatorial Branch-and-Bound solvers, why is Best-First Search (always expanding the node with the globally best relaxation bound via a priority queue) rarely used in pure form compared to Plunging DFS + Greedy Seeding?",
      "question": "In production Mixed-Integer Programming (MIP) and combinatorial Branch-and-Bound solvers, why is Best-First Search (always expanding the node with the globally best relaxation bound via a priority queue) rarely used in pure form compared to Plunging DFS + Greedy Seeding?",
      "options": [
        "Best-First Search stores the entire unpruned frontier simultaneously in heap memory ($O(b^d)$ space) and delays reaching complete leaf solutions that tighten the incumbent $z^*$, whereas Plunging DFS uses $O(d)$ stack space and rapidly improves $z^*$",
        "Best-First Search cannot use Linear Programming relaxations at internal nodes",
        "Best-First Search expands strictly more nodes with $LB(u) < \\text{OPT}$ than Depth-First Search",
        "Priority queues do not support negative objective values"
      ],
      "answer": 0,
      "explanation": "While Best-First Search is theoretically optimal in terms of never expanding a node with $LB(u) > \\text{OPT}$, it keeps millions of active frontier nodes in memory (exhausting RAM and L3 cache) and spends all its early time near the root before finding any feasible leaf solution $z^*$. Plunging DFS uses $O(d)$ memory and quickly produces tight incumbents."
    }
  ],
  "minimax-alpha-beta-pruning": [
    {
      "id": "m15-q17",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Optimal Move Ordering in Alpha-Beta Pruning",
      "prompt": "For a uniform game tree of branching factor $b$ and depth $d$, how many leaf nodes does Alpha-Beta pruning evaluate when moves are ordered optimally (best move searched first at every node)?",
      "question": "For a uniform game tree of branching factor $b$ and depth $d$, how many leaf nodes does Alpha-Beta pruning evaluate when moves are ordered optimally (best move searched first at every node)?",
      "options": [
        "$b^{\\lceil d/2 \\rceil} + b^{\\lfloor d/2 \\rfloor} - 1 = \\Theta(b^{d/2})$",
        "$\\Theta(b^d / 2)$",
        "$\\Theta(d \\cdot b)$",
        "$\\Theta(b^{\\log_2 d})$"
      ],
      "answer": 0,
      "explanation": "By Knuth and Moore's theorem (1975), perfect move ordering reduces the number of evaluated leaves from $b^d$ to $b^{\\lceil d/2 \\rceil} + b^{\\lfloor d/2 \\rfloor} - 1 = \\Theta(b^{d/2})$, reducing the effective branching factor from $b$ to $\\sqrt{b}$."
    },
    {
      "id": "m15-q18",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Alpha-Beta Cutoff Leaf Count",
      "prompt": "Consider a 2-ply game tree with a MAX root $R$ and two MIN children $M_1, M_2$, each having 3 leaf children. The leaves of $M_1$ (left-to-right) have values $[5, 8, 6]$, and the leaves of $M_2$ (left-to-right) have values $[3, 9, 2]$. How many total leaf nodes (out of 6) are evaluated by left-to-right Alpha-Beta search?",
      "question": "Consider a 2-ply game tree with a MAX root $R$ and two MIN children $M_1, M_2$, each having 3 leaf children. The leaves of $M_1$ (left-to-right) have values $[5, 8, 6]$, and the leaves of $M_2$ (left-to-right) have values $[3, 9, 2]$. How many total leaf nodes (out of 6) are evaluated by left-to-right Alpha-Beta search?",
      "answer": 4,
      "tolerance": 0,
      "explanation": "Under $M_1$, all 3 leaves $[5, 8, 6]$ are evaluated, giving $M_1 = \\min(5, 8, 6) = 5$ and updating the root's lower bound to $\\alpha = 5$. Next, under $M_2$ (with window $\\alpha = 5, \\beta = +\\infty$), the first leaf has value $3$. Since $M_2$ is a MIN node, its value is now at most $3 \\le \\alpha = 5$, triggering an immediate cutoff! The remaining 2 leaves $[9, 2]$ are pruned, so $3 + 1 = 4$ leaves are evaluated."
    },
    {
      "id": "m15-q19",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Zobrist Hash Incremental Update",
      "prompt": "In a chess engine using Zobrist hashing (`Z[piece][square]`), suppose a White Knight (`WN`) moves from square `f3` to capture a Black Pawn (`BP`) on square `d4` (ignoring castling/en-passant/side-to-move flags). How is the board hash `h` updated in $O(1)$ time?",
      "question": "In a chess engine using Zobrist hashing (`Z[piece][square]`), suppose a White Knight (`WN`) moves from square `f3` to capture a Black Pawn (`BP`) on square `d4` (ignoring castling/en-passant/side-to-move flags). How is the board hash `h` updated in $O(1)$ time?",
      "options": [
        "`h ^= Z[WN][f3] ^ Z[BP][d4] ^ Z[WN][d4]`",
        "`h = (h - Z[WN][f3] - Z[BP][d4]) + Z[WN][d4]`",
        "`h ^= Z[WN][f3] & Z[BP][d4] | Z[WN][d4]`",
        "The entire 64-square board must be rescanned because a capture occurred"
      ],
      "answer": 0,
      "explanation": "Because XOR is its own inverse ($x \\oplus x = 0$), XORing `Z[WN][f3]` removes the White Knight from `f3`, XORing `Z[BP][d4]` removes the captured Black Pawn from `d4`, and XORing `Z[WN][d4]` places the White Knight on `d4`."
    },
    {
      "id": "m15-q20",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Transposition Table Bound Classification",
      "prompt": "During a Negamax search of state $s$ with initial window $[\\alpha_{\\text{orig}}, \\beta]$, suppose a move produces score $v \\ge \\beta$, causing an immediate Beta-Cutoff (`break`). Why must the Transposition Table store this entry with `BoundFlag::LOWER` instead of `BoundFlag::EXACT`?",
      "question": "During a Negamax search of state $s$ with initial window $[\\alpha_{\\text{orig}}, \\beta]$, suppose a move produces score $v \\ge \\beta$, causing an immediate Beta-Cutoff (`break`). Why must the Transposition Table store this entry with `BoundFlag::LOWER` instead of `BoundFlag::EXACT`?",
      "options": [
        "Because the search aborted as soon as it found one move scoring $v \\ge \\beta$ without exploring the remaining sibling moves, which could have scored even higher; thus the true minimax value of $s$ is only known to be $\\ge v$",
        "Because Negamax negates all scores at odd depths, turning upper bounds into lower bounds",
        "Because Zobrist hash collisions only affect exact entries and never affect lower-bound entries",
        "Because $v$ is guaranteed to be less than $\\alpha_{\\text{orig}}$"
      ],
      "answer": 0,
      "explanation": "When a Beta-Cutoff occurs at move $m$ with score $v \\ge \\beta$, remaining legal moves at state $s$ are skipped. One of those skipped moves might have achieved $v' > v$. Therefore, $v$ is a proven **lower bound** ($\\text{true\\_value}(s) \\ge v$), not necessarily the exact minimax value."
    }
  ],
  "greedy-choice-exchange-arguments": [
    {
      "id": "m15-q21",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Interval Scheduling Greedy Criterion",
      "prompt": "Which greedy sorting criterion is guaranteed to find a maximum-cardinality subset of mutually non-overlapping intervals $[s_i, f_i)$?",
      "question": "Which greedy sorting criterion is guaranteed to find a maximum-cardinality subset of mutually non-overlapping intervals $[s_i, f_i)$?",
      "options": [
        "Sort by finish time ascending ($f_1 \\le f_2 \\le \\dots \\le f_n$)",
        "Sort by start time ascending ($s_1 \\le s_2 \\le \\dots \\le s_n$)",
        "Sort by duration ascending ($f_i - s_i$ ascending)",
        "Sort by number of overlapping conflicts ascending"
      ],
      "answer": 0,
      "explanation": "Earliest Finish Time (EFT) frees up the resource as early as possible, satisfying the Greedy Stays Ahead invariant $f(i_r) \\le f(j_r)$ for every index $r$ against any valid schedule."
    },
    {
      "id": "m15-q22",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Minimizing Maximum Lateness (EDF Trace)",
      "prompt": "Three jobs have processing times and deadlines $(t_i, d_i)$ as follows: Job A $(t=4, d=6)$, Job B $(t=2, d=4)$, and Job C $(t=3, d=5)$. Starting at time $0$, what is the minimum possible maximum lateness $L_{\\max} = \\max_i \\max(0, C_i - d_i)$ achieved by Earliest Deadline First (EDF)?",
      "question": "Three jobs have processing times and deadlines $(t_i, d_i)$ as follows: Job A $(t=4, d=6)$, Job B $(t=2, d=4)$, and Job C $(t=3, d=5)$. Starting at time $0$, what is the minimum possible maximum lateness $L_{\\max} = \\max_i \\max(0, C_i - d_i)$ achieved by Earliest Deadline First (EDF)?",
      "answer": 3,
      "tolerance": 0,
      "explanation": "EDF sorts jobs by deadline ascending: Job B ($d=4$), Job C ($d=5$), Job A ($d=6$). Completion times: $C_B = 2$ (lateness $\\max(0, 2-4) = 0$), $C_C = 2 + 3 = 5$ (lateness $\\max(0, 5-5) = 0$), $C_A = 5 + 4 = 9$ (lateness $\\max(0, 9-6) = 3$). Thus $L_{\\max} = 3$."
    },
    {
      "id": "m15-q23",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Smith's Rule Exchange Cost Calculation",
      "prompt": "We wish to schedule $n$ jobs with processing times $t_i > 0$ and positive weights $w_i > 0$ on a single machine to **minimize** the weighted sum of completion times $\\sum_{i=1}^n w_i C_i$. By an adjacent exchange argument on jobs $i$ and $j$, in what order should the jobs be sorted?",
      "question": "We wish to schedule $n$ jobs with processing times $t_i > 0$ and positive weights $w_i > 0$ on a single machine to **minimize** the weighted sum of completion times $\\sum_{i=1}^n w_i C_i$. By an adjacent exchange argument on jobs $i$ and $j$, in what order should the jobs be sorted?",
      "options": [
        "Descending order of ratio $w_i / t_i$ (i.e., $w_i t_j > w_j t_i$)",
        "Ascending order of ratio $w_i / t_i$ (i.e., $w_i t_j < w_j t_i$)",
        "Descending order of difference $w_i - t_i$",
        "Ascending order of processing time $t_i$ regardless of $w_i$"
      ],
      "answer": 0,
      "explanation": "If job $i$ immediately precedes job $j$ starting at time $T$, their contribution is $w_i(T + t_i) + w_j(T + t_i + t_j)$. Swapping them changes the cost by $\\Delta = w_i t_j - w_j t_i$. For $i$ before $j$ to be optimal ($\\Delta \\ge 0$), we need $w_i t_j \\ge w_j t_i \\iff w_i / t_i \\ge w_j / t_j$."
    },
    {
      "id": "m15-q24",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Strict Weak Ordering Violation in Custom Comparators",
      "prompt": "In C++, why can passing a comparator `[](const Job& a, const Job& b) { return a.w * b.t >= b.w * a.t; }` (using `>=` instead of `>`) to `std::sort` cause out-of-bounds memory access and segmentation faults?",
      "question": "In C++, why can passing a comparator `[](const Job& a, const Job& b) { return a.w * b.t >= b.w * a.t; }` (using `>=` instead of `>`) to `std::sort` cause out-of-bounds memory access and segmentation faults?",
      "options": [
        "`std::sort` (Introsort) requires a Strict Weak Ordering where `comp(x, x)` is strictly `false`; returning `true` on equal ratios violates irreflexivity, causing the unguarded partition pivot loop `*++first` to scan past the end of the array",
        "Because `>=` is slower than `>` on x86-64 ALU pipelines",
        "Because `std::sort` only supports `<` and cannot compile `>` or `>=`",
        "Because `>=` forces `std::sort` to allocate $O(N^2)$ auxiliary stack frames"
      ],
      "answer": 0,
      "explanation": "Standard library `std::sort` implementations use unguarded insertion sort and Hoare partitioning that rely on the pivot itself acting as a sentinel (`comp(pivot, pivot) == false`). If `comp(a, b)` returns `true` for equal elements, the pointer increments past the pivot and out of bounds of the underlying buffer."
    }
  ],
  "matroids-greedy-foundations": [
    {
      "id": "m15-q25",
      "type": "mcq",
      "difficulty": "recall",
      "title": "The Rado-Edmonds Theorem",
      "prompt": "What does the Rado-Edmonds Theorem state regarding a hereditary independence system $M = (E, \\mathcal{I})$?",
      "question": "What does the Rado-Edmonds Theorem state regarding a hereditary independence system $M = (E, \\mathcal{I})$?",
      "options": [
        "The Best-In Greedy Algorithm finds a maximum-weight independent set for EVERY non-negative weight function $w: E \\to \\mathbb{R}_{\\ge 0}$ if and only if $(E, \\mathcal{I})$ satisfies the Matroid Exchange Axiom",
        "Every NP-hard graph problem can be formulated as a single matroid",
        "Greedy algorithms are optimal if and only if the ground set $E$ has size at most $64$",
        "The intersection of any three matroids can be maximized in $O(N \\log N)$ time by sorting"
      ],
      "answer": 0,
      "explanation": "Rado (1957) and Edmonds (1971) proved the exact equivalence: for any downward-closed family of subsets, the greedy algorithm is universally optimal across all non-negative weight functions iff the family is a matroid."
    },
    {
      "id": "m15-q26",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Maximum Weight XOR Basis (Linear Matroid)",
      "prompt": "You are given 4 vectors over $\\mathbb{F}_2$ (integers under bitwise XOR) with associated weights: $(v_1 = 3, w_1 = 100)$, $(v_2 = 5, w_2 = 90)$, $(v_3 = 6, w_3 = 80)$, and $(v_4 = 7, w_4 = 50)$. What is the maximum total weight of a subset of these integers that is linearly independent under XOR (no non-empty subset XORs to 0)?",
      "question": "You are given 4 vectors over $\\mathbb{F}_2$ (integers under bitwise XOR) with associated weights: $(v_1 = 3, w_1 = 100)$, $(v_2 = 5, w_2 = 90)$, $(v_3 = 6, w_3 = 80)$, and $(v_4 = 7, w_4 = 50)$. What is the maximum total weight of a subset of these integers that is linearly independent under XOR (no non-empty subset XORs to 0)?",
      "answer": 240,
      "tolerance": 0,
      "explanation": "Sort by weight descending: 1) Pick $v_1 = 3$ ($011_2$), weight $100$. 2) Pick $v_2 = 5$ ($101_2$), linearly independent of $3$, weight $+90$. 3) Test $v_3 = 6$ ($110_2$): notice $6 = 3 \\oplus 5$ ($011_2 \\oplus 101_2 = 110_2$), so $v_3$ is linearly dependent and skipped! 4) Test $v_4 = 7$ ($111_2$): linearly independent of $\\{3, 5\\}$, weight $+50$. Total weight $= 100 + 90 + 50 = 240$."
    },
    {
      "id": "m15-q27",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Why Bipartite Matching Fails the Matroid Exchange Axiom",
      "prompt": "Why does the family of valid matchings in a bipartite graph $G = (L \\cup R, E)$ **not** form a matroid on the edge set $E$?",
      "question": "Why does the family of valid matchings in a bipartite graph $G = (L \\cup R, E)$ **not** form a matroid on the edge set $E$?",
      "options": [
        "Given matching $A = \\{(u_2, v_1)\\}$ of size 1 and matching $B = \\{(u_1, v_1), (u_2, v_2)\\}$ of size 2, neither edge in $B$ can be added to $A$ without sharing an endpoint, violating the Matroid Exchange Axiom",
        "Because removing an edge from a valid matching does not leave a valid matching (violating the Hereditary property)",
        "Because the empty set $\\emptyset$ is not a valid matching",
        "Because bipartite graphs can contain odd cycles"
      ],
      "answer": 0,
      "explanation": "In the 3-edge path $u_1 - v_1 - u_2 - v_2$, $A = \\{(u_2, v_1)\\}$ has size 1 and $B = \\{(u_1, v_1), (u_2, v_2)\\}$ has size 2, yet both edges of $B$ are incident to $A$. Instead, bipartite matchings are the *intersection* of two partition matroids (one for $L$-degrees $\\le 1$, one for $R$-degrees $\\le 1$)."
    },
    {
      "id": "m15-q28",
      "type": "mcq",
      "difficulty": "staff",
      "title": "DSU Oracle in Unit-Time Deadline Scheduling",
      "prompt": "In the Unit-Time Deadline Scheduling Matroid ($t_i = 1$, deadline $d_i$, profit $p_i$), we sort jobs by profit descending and assign each job to the latest available time slot $s \\le d_i$ using Disjoint Set Union (`parent[s] = find(s - 1)`). Why does scheduling job $i$ as late as possible ($s \\le d_i$) preserve matroid independence?",
      "question": "In the Unit-Time Deadline Scheduling Matroid ($t_i = 1$, deadline $d_i$, profit $p_i$), we sort jobs by profit descending and assign each job to the latest available time slot $s \\le d_i$ using Disjoint Set Union (`parent[s] = find(s - 1)`). Why does scheduling job $i$ as late as possible ($s \\le d_i$) preserve matroid independence?",
      "options": [
        "A subset of unit-time jobs is independent iff it can be feasibly scheduled; placing each chosen job in the latest free slot $\\le d_i$ leaves the earliest possible slots $[1..s-1]$ open for future jobs with tighter deadlines",
        "Because jobs with higher profit always have larger deadlines",
        "Because DSU requires union-by-rank to merge only adjacent integers",
        "Because occupying slot $s$ also occupies all slots greater than $s$"
      ],
      "answer": 0,
      "explanation": "By an exchange argument within the independence oracle, if a set of jobs $S \\cup \\{i\\}$ is feasible, there exists a canonical schedule where job $i$ is placed in the latest unoccupied slot $\\le d_i$. Using DSU path compression links each occupied slot $s$ to `find(s - 1)`, locating that slot in $O(\\alpha(N))$ time."
    }
  ],
  "regret-greedy-heap-rollback": [
    {
      "id": "m15-q29",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Moore-Hodgson Algorithm Eviction Rule",
      "prompt": "In the Moore-Hodgson algorithm (Course Schedule III) for maximizing the number of variable-duration jobs $(t_i, d_i)$ completed before their deadlines, we sort jobs by deadline $d_i$ ascending. When adding job $i$ causes total duration $T$ to exceed $d_i$, what action does the algorithm take?",
      "question": "In the Moore-Hodgson algorithm (Course Schedule III) for maximizing the number of variable-duration jobs $(t_i, d_i)$ completed before their deadlines, we sort jobs by deadline $d_i$ ascending. When adding job $i$ causes total duration $T$ to exceed $d_i$, what action does the algorithm take?",
      "options": [
        "It pops and removes the job with the maximum duration $t_{\\max}$ among all currently selected jobs (including job $i$) from a max-heap",
        "It pops and removes the job with the earliest deadline from a min-heap",
        "It discards job $i$ without inspecting previously selected jobs",
        "It restarts the schedule from time 0 using Dynamic Programming"
      ],
      "answer": 0,
      "explanation": "Evicting the single job with the largest duration $t_{\\max}$ reduces the current completion time $T$ by the maximum possible amount while losing only $1$ job count, preserving both feasibility ($T - t_{\\max} \\le d_i$) and minimum total duration for that cardinality."
    },
    {
      "id": "m15-q30",
      "type": "numeric",
      "difficulty": "apply",
      "title": "Moore-Hodgson Schedule Trace",
      "prompt": "Given 4 courses with `(duration, deadline)` pairs: `(100, 200)`, `(200, 1300)`, `(1000, 1250)`, and `(2000, 3200)`, what is the maximum number of courses you can complete?",
      "question": "Given 4 courses with `(duration, deadline)` pairs: `(100, 200)`, `(200, 1300)`, `(1000, 1250)`, and `(2000, 3200)`, what is the maximum number of courses you can complete?",
      "answer": 3,
      "tolerance": 0,
      "explanation": "Sort by deadline ascending: `(100, 200)`, `(1000, 1250)`, `(200, 1300)`, `(2000, 3200)`. 1) Take `100` ($T=100 \\le 200$, heap `{100}`). 2) Take `1000` ($T=1100 \\le 1250$, heap `{100, 1000}`). 3) Take `200` ($T=1300 \\le 1300$, heap `{100, 200, 1000}`). 4) Take `2000` ($T=3300 > 3200$): evict max duration `2000` (heap remains `{100, 200, 1000}`). Total courses = 3."
    },
    {
      "id": "m15-q31",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Virtual Undo Telescoping Identity in Stock Trading",
      "prompt": "In the multi-share stock trading problem (at most 1 action per day, unlimited shares held), when today's price $p$ exceeds the minimum historical buy price $b = \\text{min\\_heap.top()}$, we add $p - b$ to our profit, pop $b$, and push $p$ into `min_heap` **twice**. Why are two copies of $p$ pushed?",
      "question": "In the multi-share stock trading problem (at most 1 action per day, unlimited shares held), when today's price $p$ exceeds the minimum historical buy price $b = \\text{min\\_heap.top()}$, we add $p - b$ to our profit, pop $b$, and push $p$ into `min_heap` **twice**. Why are two copies of $p$ pushed?",
      "options": [
        "One copy represents a virtual 'undo' option (if a future price $p' > p$ pops it, $(p - b) + (p' - p) = p' - b$ cancels the sale at $p$), and the second copy represents buying a fresh share at price $p$",
        "Because binary heaps require an even number of elements to maintain the heap property",
        "Because each share must be bought and sold on the exact same day",
        "To prevent the min-heap from becoming empty on the last day"
      ],
      "answer": 0,
      "explanation": "At day $i$ with price $p$, if we did NOT sell $b$ at $p$ and instead sold $b$ at $p'$ AND bought a new share at $p$ to sell later, we would need two items of cost $p$ available relative to the state where we booked $(p - b)$."
    },
    {
      "id": "m15-q32",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Boundary of Regret Greedy vs. Dynamic Programming",
      "prompt": "Why does the $O(N \\log N)$ Moore-Hodgson priority-queue algorithm break down if each course $i$ has an arbitrary duration $t_i$, deadline $d_i$, AND arbitrary profit $v_i$ (where we want to maximize total profit $\\sum v_i$)?",
      "question": "Why does the $O(N \\log N)$ Moore-Hodgson priority-queue algorithm break down if each course $i$ has an arbitrary duration $t_i$, deadline $d_i$, AND arbitrary profit $v_i$ (where we want to maximize total profit $\\sum v_i$)?",
      "options": [
        "With unit profits ($v_i = 1$), subsets of the same size $k$ are totally ordered by their single metric $\\sum t_i$; with arbitrary $v_i$ and $t_i$, a single state must trade off both total time and total profit (Pareto frontier), reducing to NP-hard 0/1 Knapsack",
        "Because `std::priority_queue` cannot store structs with more than two fields",
        "Because sorting by deadline $d_i$ takes $O(N^2)$ time when profits are present",
        "Because negative durations are introduced when profits vary"
      ],
      "answer": 0,
      "explanation": "When all deadlines are equal ($d_i = W$), maximizing $\\sum v_i$ subject to $\\sum t_i \\le W$ is literally the 0/1 Knapsack problem. A single scalar priority queue eviction only works when one dimension (cardinality or profit) is uniform across items."
    }
  ],
  "case-sat-solvers-cdcl-dpll": [
    {
      "id": "m15-q33",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Two-Watched Literals (2WL) Backtrack Complexity",
      "prompt": "In a SAT solver using Chaff's Two-Watched Literals (2WL) scheme, how many watch-list pointer updates are required when backtracking (unassigning $k$ variables on the assignment trail)?",
      "question": "In a SAT solver using Chaff's Two-Watched Literals (2WL) scheme, how many watch-list pointer updates are required when backtracking (unassigning $k$ variables on the assignment trail)?",
      "options": [
        "Zero ($O(1)$ watch-list work)—unassigning variables never falsifies a currently non-falsified watched literal, so all existing watches remain valid",
        "$O(k \\cdot |\\text{clauses}|)$—every clause must be rescanned to restore its original two watched literals",
        "$O(k)$—each unassigned variable must swap its positive and negative watch lists",
        "$O(\\log |\\text{clauses}|)$ per unassigned variable using a balanced BST"
      ],
      "answer": 0,
      "explanation": "The 2WL invariant only requires that the two watched literals of an unsatisfied clause are not assigned `FALSE`. When backtracking unassigns variables from `TRUE`/`FALSE` back to `UNASSIGNED`, no literal becomes `FALSE`, so the invariant remains intact with zero watch-list updates!"
    },
    {
      "id": "m15-q34",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Boolean Constraint Propagation (Unit ClauseCascade)",
      "prompt": "Given the 3CNF formula $(x_1 \\vee x_2) \\wedge (\\neg x_1 \\vee x_3) \\wedge (\\neg x_1 \\vee \\neg x_3 \\vee x_4)$, if the solver branches by assigning $x_2 = \\text{FALSE}$, what assignments are forced immediately by Unit Propagation (BCP) before any further branching?",
      "question": "Given the 3CNF formula $(x_1 \\vee x_2) \\wedge (\\neg x_1 \\vee x_3) \\wedge (\\neg x_1 \\vee \\neg x_3 \\vee x_4)$, if the solver branches by assigning $x_2 = \\text{FALSE}$, what assignments are forced immediately by Unit Propagation (BCP) before any further branching?",
      "options": [
        "$x_1 = \\text{TRUE}$, then $x_3 = \\text{TRUE}$, then $x_4 = \\text{TRUE}$",
        "Only $x_1 = \\text{TRUE}$; the remaining clauses still have 2 or more literals",
        "$x_1 = \\text{FALSE}$ and $x_3 = \\text{FALSE}$",
        "An immediate conflict (UNSAT) is triggered"
      ],
      "answer": 0,
      "explanation": "1) $x_2 = \\text{FALSE}$ makes $(x_1 \\vee x_2)$ unit, forcing $x_1 = \\text{TRUE}$. 2) $x_1 = \\text{TRUE}$ ($\neg x_1 = \\text{FALSE}$) makes $(\\neg x_1 \\vee x_3)$ unit, forcing $x_3 = \\text{TRUE}$. 3) $x_1 = \\text{TRUE}$ and $x_3 = \\text{TRUE}$ make $(\\neg x_1 \\vee \\neg x_3 \\vee x_4)$ unit, forcing $x_4 = \\text{TRUE}$."
    },
    {
      "id": "m15-q35",
      "type": "mcq",
      "difficulty": "apply",
      "title": "2WL Watch Replacement Mechanics",
      "prompt": "Suppose clause $C = (l_0 \\vee l_1 \\vee l_2 \\vee l_3)$ is currently watching $l_0$ and $l_1$. Literal $\\neg l_1$ is assigned `TRUE` (so $l_1$ becomes `FALSE`). During `propagate()`, the solver inspects $C$ and sees $l_0$ is `UNASSIGNED`, $l_2$ is `FALSE`, and $l_3$ is `UNASSIGNED`. What does the 2WL algorithm do?",
      "question": "Suppose clause $C = (l_0 \\vee l_1 \\vee l_2 \\vee l_3)$ is currently watching $l_0$ and $l_1$. Literal $\\neg l_1$ is assigned `TRUE` (so $l_1$ becomes `FALSE`). During `propagate()`, the solver inspects $C$ and sees $l_0$ is `UNASSIGNED`, $l_2$ is `FALSE`, and $l_3$ is `UNASSIGNED`. What does the 2WL algorithm do?",
      "options": [
        "It replaces watch $l_1$ with $l_3$, appends $C$ to `watches[l_3]`, removes $C$ from `watches[l_1]`, and does NOT unit-propagate $l_0$",
        "It immediately unit-propagates $l_0 = \\text{TRUE}$ because $l_1$ became `FALSE`",
        "It declares a conflict because both $l_1$ and $l_2$ are `FALSE`",
        "It swaps $l_0$ with $l_2$ so that both watched literals are `FALSE`"
      ],
      "answer": 0,
      "explanation": "Because $l_3$ is not `FALSE`, the clause still has at least two non-falsified literals ($l_0$ and $l_3$) and is not yet unit. Moving the watch from $l_1$ to $l_3$ restores the two-watched-literal invariant without unit propagation."
    },
    {
      "id": "m15-q36",
      "type": "mcq",
      "difficulty": "staff",
      "title": "Blocker Literal Cache Optimization in Production SAT Solvers",
      "prompt": "Why do industrial CDCL solvers (such as MiniSat and CaDiCaL) store a `blocker` literal directly inside each 8-byte entry `{ clause_id, blocker }` of the `watches[lit]` vector?",
      "question": "Why do industrial CDCL solvers (such as MiniSat and CaDiCaL) store a `blocker` literal directly inside each 8-byte entry `{ clause_id, blocker }` of the `watches[lit]` vector?",
      "options": [
        "If `val[blocker] == TRUE`, the clause is already satisfied, so `propagate()` can skip dereferencing `clauses[clause_id]` in main memory—eliminating a random L3 cache miss",
        "To record which variable caused the conflict when the solver terminates",
        "To compress clauses of length $> 100$ into 8 bytes without storing the remaining literals",
        "To prevent two threads from watching the same clause simultaneously"
      ],
      "answer": 0,
      "explanation": "In large SAT instances with millions of clauses, dereferencing `clauses[clause_id]` chases a pointer into a huge clause arena, incurring an L3/DRAM cache miss. Checking `val[blocker] == TRUE` (where `blocker` is typically the other watched literal $c[0]$) inside the contiguous watch vector avoids touching the clause memory altogether whenever the clause is already satisfied."
    }
  ],
  "build-dancing-links-exact-cover": [
    {
      "id": "m15-q37",
      "type": "mcq",
      "difficulty": "recall",
      "title": "Primary vs. Secondary Columns in Generalized DLX",
      "prompt": "In Knuth's generalized Exact Cover formulation (e.g., for $N$-Queens where rows and columns are Primary and diagonals are Secondary), what is the exact semantic difference between a Primary column and a Secondary column?",
      "question": "In Knuth's generalized Exact Cover formulation (e.g., for $N$-Queens where rows and columns are Primary and diagonals are Secondary), what is the exact semantic difference between a Primary column and a Secondary column?",
      "options": [
        "Every Primary column must be covered **exactly once** ($= 1$), whereas each Secondary column may be covered **at most once** ($\\le 1$)",
        "Primary columns are covered in $O(1)$ time, whereas Secondary columns require $O(N)$ time",
        "Primary columns can be covered multiple times ($\\ge 1$), whereas Secondary columns must be covered0 times",
        "Secondary columns are only checked at leaf nodes after all Primary columns are covered"
      ],
      "answer": 0,
      "explanation": "Primary columns enforce exact partitioning ($\\sum_{r \\in R^*} A[r, c] = 1$), whereas Secondary columns enforce mutual exclusion without requiring coverage ($\\sum_{r \\in R^*} A[r, c] \\le 1$), such as board diagonals that may remain empty."
    },
    {
      "id": "m15-q38",
      "type": "numeric",
      "difficulty": "apply",
      "title": "N-Queens Generalized DLX Column Count",
      "prompt": "When encoding the $8$-Queens puzzle ($N = 8$) as a Generalized Exact Cover instance where each of the $N$ rows and $N$ columns is a Primary column and each of the $2N - 1$ main diagonals and $2N - 1$ anti-diagonals is a Secondary column, what is the total number of columns (Primary + Secondary) in the DLX matrix?",
      "question": "When encoding the $8$-Queens puzzle ($N = 8$) as a Generalized Exact Cover instance where each of the $N$ rows and $N$ columns is a Primary column and each of the $2N - 1$ main diagonals and $2N - 1$ anti-diagonals is a Secondary column, what is the total number of columns (Primary + Secondary) in the DLX matrix?",
      "answer": 46,
      "tolerance": 0,
      "explanation": "There are $2N = 16$ Primary columns (8 rows + 8 cols) and $2(2N - 1) = 2(15) = 30$ Secondary columns (15 main diagonals + 15 anti-diagonals), giving $16 + 30 = 46$ total columns."
    },
    {
      "id": "m15-q39",
      "type": "mcq",
      "difficulty": "apply",
      "title": "Secondary Column Header Initialization in DLX",
      "prompt": "How do we initialize a Secondary column header $c$ in the DLX node table so that `cover()`, `uncover()`, and `search()` require **zero extra `if` branches** to distinguish Primary from Secondary columns?",
      "question": "How do we initialize a Secondary column header $c$ in the DLX node table so that `cover()`, `uncover()`, and `search()` require **zero extra `if` branches** to distinguish Primary from Secondary columns?",
      "options": [
        "Initialize `nodes[c].L = c; nodes[c].R = c;` (a horizontal self-loop not linked into master header `0`), while linking its vertical `U`/`D` list normally",
        "Set `col_size[c] = INT_MAX` so the S-heuristic never selects column $c$",
        "Link Secondary columns to the left of master header `0` with negative indices",
        "Leave `nodes[c].U` and `nodes[c].D` uninitialized"
      ],
      "answer": 0,
      "explanation": "Because `search()` only scans `for (int c = nodes[0].R; c != 0; c = nodes[c].R)`, any column header not linked into `0`'s horizontal ring is never required to be covered. Yet when a row containing a $1$ in secondary column $c$ is chosen, calling `cover(c)` executes `nodes[nodes[c].R].L = nodes[c].L` (a harmless no-op on a self-loop) and proceeds to unlink all conflicting rows in `c`'s vertical list!"
    },
    {
      "id": "m15-q40",
      "type": "mcq",
      "difficulty": "staff",
      "title": "S-Heuristic Unit Propagation Equivalence in Sudoku DLX",
      "prompt": "When a $9 \\times 9$ Sudoku grid with pre-filled clues is compiled into a 324-column DLX matrix by emitting only 1 row for each clue cell $(r, c, d_0)$ and 9 rows for each empty cell, what happens during the very first calls to `solve_one()` under the S-heuristic (`col_size[best_c]` minimum)?",
      "question": "When a $9 \\times 9$ Sudoku grid with pre-filled clues is compiled into a 324-column DLX matrix by emitting only 1 row for each clue cell $(r, c, d_0)$ and 9 rows for each empty cell, what happens during the very first calls to `solve_one()` under the S-heuristic (`col_size[best_c]` minimum)?",
      "options": [
        "Every pre-filled clue cell has `col_size[col_cell] == 1`, so the S-heuristic immediately selects those columns with branching factor $1$, covering their row/col/box digit columns and automatically performing constraint propagation (naked/hidden singles) before any multi-way branching occurs",
        "The solver must branch 9 ways on $(0, 0)$ regardless of whether $(0, 0)$ is a pre-filled clue",
        "Pre-filled clues cause `col_size` to become $0$, forcing an immediate backtrack",
        "The S-heuristic always selects box constraints before cell constraints"
      ],
      "answer": 0,
      "explanation": "In Sudoku DLX, a column with `S[c] == 1` in the `col_cell` range is a Naked Single (only 1 candidate digit fits in that cell), and a column with `S[c] == 1` in `col_row`/`col_col`/`col_box` is a Hidden Single (only 1 position in that unit can hold digit $d$). Thus the S-heuristic naturally unifies Naked Singles, Hidden Singles, and Locked Candidates without a single line of Sudoku-specific logic!"
    }
  ]
});
