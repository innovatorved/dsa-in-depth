window.QUESTION_BANK = window.QUESTION_BANK || {};

window.QUESTION_BANK["tries-radix-trees-patricia"] = [
  {
    "id": "q10-trie-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Radix Tree Node Count Bound",
    "prompt": "A compressed Radix Tree (Patricia Trie) stores $K$ distinct keys over alphabet $\\Sigma$ by merging every unary chain of single-child nodes into a single edge labeled with a substring slice.",
    "question": "What is the tightest upper bound on the total number of internal and leaf nodes in a Radix Tree containing $K \\ge 2$ distinct keys, regardless of how long the keys are?",
    "options": [
      "At most $2K$ nodes (specifically $\\le 2K - 1$), because every internal node other than possibly the root has branching factor $\\ge 2$ and there are at most $K$ terminal key nodes",
      "At most $K \\log_2 K$ nodes, proportional to the height of a balanced binary search tree",
      "At most $\\sum_{i=1}^K |S_i|$ nodes, because path compression only saves edge pointers, not nodes",
      "At most $K \\cdot |\\Sigma|$ nodes, depending on the alphabet size $|\\Sigma|$"
    ],
    "answer": 0,
    "explanation": "In a compressed Radix Tree, every internal node that does not itself hold a terminal key must have at least 2 children (otherwise its single incoming and outgoing edges would be merged). A tree with $L \\le K$ leaves where every non-key internal node has degree $\\ge 2$ has at most $L - 1$ branching internal nodes, giving at most $2K - 1$ nodes in total—completely independent of string lengths."
  },
  {
    "id": "q10-trie-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "PATRICIA Single-Bit Branching Verification",
    "prompt": "In Morrison's PATRICIA tree (or Bernstein's Crit-Bit tree), internal nodes store only the critical bit index $b_u$ where the left and right subtries first differ, without storing the intervening shared prefix bits along edges.",
    "question": "If you search for a query key $Q = \\texttt{0b110100}$ by testing only $Q[b_u]$ at each internal node and land at a leaf storing key $K$, what additional step is mandatory to confirm whether $Q$ is in the tree?",
    "options": [
      "Perform one full key equality comparison $Q == K$ at the leaf, because skipped bits between critical bit indices were never inspected during the descent",
      "Nothing; reaching the leaf proves $Q == K$ because every bit from $0$ to $W-1$ was tested",
      "Walk back up to the root and recompute the XOR of all critical bit indices",
      "Check only the last bit $Q[W-1] == K[W-1]$"
    ],
    "answer": 0,
    "explanation": "Because PATRICIA skips over shared prefix bits between critical bit positions $b_u$, a query $Q$ that differs from every key in the tree on one of those skipped bits will still follow some path to a leaf $K$. A single full equality check $Q == K$ at the leaf verifies all skipped bits at once; if $Q \\neq K$, the most significant bit of $Q \\oplus K$ gives the exact new critical bit where $Q$ must be branched."
  },
  {
    "id": "q10-trie-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Adaptive Radix Tree (ART) Node48 Layout",
    "prompt": "Leis et al.'s Adaptive Radix Tree (ART) uses four adaptive node sizes (`Node4`, `Node16`, `Node48`, `Node256`) to avoid allocating a 256-pointer array (`2 KB`) at every sparse internal node.",
    "question": "How does `Node48` achieve $O(1)$ child lookup for any byte $c \\in [0, 255]$ while storing at most 48 child pointers?",
    "options": [
      "It uses a 256-byte `child_index[256]` array that maps byte $c$ to a 1-based slot index in a compact 48-element `children[48]` pointer array ($256 + 48 \\times 8 = 640$ bytes total)",
      "It hashes byte $c$ into a 48-bucket Robin Hood hash table with linear probing",
      "It stores 48 sorted `(byte, pointer)` pairs and performs binary search in $\\lceil \\log_2 48 \\rceil = 6$ steps",
      "It splits the byte into two 4-bit nibbles and uses a two-level 16-ary trie"
    ],
    "answer": 0,
    "explanation": "`Node48` avoids both binary/SIMD search overhead (once $>16$ children exist) and the $2048$-byte cost of `Node256` by introducing one level of byte indirection: `uint8_t child_index[256]` (256 bytes) indexes directly into `Node* children[48]` (384 bytes), totaling 640 bytes (~3x smaller than `Node256`)."
  },
  {
    "id": "q10-trie-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Pointer Invalidation in Contiguous `std::vector<Node>` Arenas",
    "prompt": "Consider this C++ Trie insertion snippet using a flat `std::vector<Node> arena`:\n```cpp\nint u = 0;\nfor (char ch : word) {\n    int& next_id = arena[u].child[ch - 'a'];\n    if (next_id == 0) {\n        arena.emplace_back();\n        next_id = static_cast<int>(arena.size()) - 1; // <-- BUG!\n    }\n    u = next_id;\n}\n```",
    "question": "Why does this code corrupt heap memory or crash with a segmentation fault when `arena` grows beyond its initial capacity?",
    "options": [
      "`next_id` binds a C++ reference to an element inside `arena`'s buffer BEFORE `arena.emplace_back()` is called; if `emplace_back()` triggers a vector reallocation, `next_id` becomes a dangling reference to freed memory",
      "`std::vector::emplace_back()` initializes `child` with garbage values instead of zeros",
      "`static_cast<int>(arena.size()) - 1` overflows when `arena.size()` is 1",
      "`u = next_id` copies the index by value instead of by reference"
    ],
    "answer": 0,
    "explanation": "Taking `int& next_id = arena[u].child[c]` holds a raw memory address inside `arena.data()`. When `arena.emplace_back()` exceeds `arena.capacity()`, `std::vector` allocates a new buffer, moves existing elements, and frees the old buffer—leaving `next_id` pointing into deallocated memory. Always compute the new index first or assign `arena[u].child[c] = new_idx` after `emplace_back()`."
  }
];

window.QUESTION_BANK["bitwise-tries-max-xor"] = [
  {
    "id": "q10-xortrie-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Bitwise Trie Traversal Order for Maximum XOR",
    "prompt": "You want to find $y \\in S$ maximizing $x \\oplus y$ for a given $W$-bit unsigned integer $x$ using a 0-1 Bitwise Trie.",
    "question": "In what bit order must keys be inserted and queried in the 0-1 Trie so that a single root-to-leaf walk greedily maximizes $x \\oplus y$?",
    "options": [
      "From the Most Significant Bit ($k = W - 1$) down to the Least Significant Bit ($k = 0$), always preferring child $1 - ((x \\gg k) \\mathbin{\\&} 1)$ when non-empty",
      "From the Least Significant Bit ($k = 0$) up to the Most Significant Bit ($k = W - 1$), because carry bits propagate from right to left",
      "In order of bit population count (`__builtin_popcount(x)`)",
      "Either MSB-to-LSB or LSB-to-MSB yields the same greedy maximum"
    ],
    "answer": 0,
    "explanation": "Because $2^k > \\sum_{j=0}^{k-1} 2^j = 2^k - 1$, securing a $1$-bit in $(x \\oplus y)$ at bit position $k$ is worth strictly more than securing $1$-bits at all lower positions $0..k-1$ combined. Therefore, the greedy choice property holds if and only if we branch from MSB ($W-1$) down to LSB ($0$)."
  },
  {
    "id": "q10-xortrie-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Counting Elements With $(x \\oplus y) < K$ on a 0-1 Trie",
    "prompt": "Each node $u$ in a $W$-bit 0-1 Trie maintains `sz[u]`, the count of active integers in its subtrie. We want to count how many $y \\in S$ satisfy $(x \\oplus y) < K$. At bit $i$ (from $W-1$ down to $0$), let $b_x = (x \\gg i) \\mathbin{\\&} 1$ and $b_k = (K \\gg i) \\mathbin{\\&} 1$.",
    "question": "When $b_k == 1$ at level $i$, which action correctly accumulates all valid elements and continues the search in $O(W)$ total time?",
    "options": [
      "Add `sz[child[u][b_x]]` (where bit $i$ of $x \\oplus y$ is $0 < 1$, so all elements in that subtrie are strictly less than $K$) to the answer, and move `u = child[u][1 - b_x]` (where bit $i$ of $x \\oplus y$ equals $1 = b_k$) to continue checking lower bits",
      "Add `sz[child[u][1 - b_x]]` to the answer and move `u = child[u][b_x]`",
      "Recursively visit both `child[u][0]` and `child[u][1]`",
      "Move `u = child[u][b_x]` without adding any subtree size"
    ],
    "answer": 0,
    "explanation": "If $b_k = 1$, any $y$ in `child[u][b_x]` produces $(x \\oplus y)_i = b_x \\oplus b_x = 0 < b_k$, while matching $K$ on all higher bits $W-1..i+1$; hence every such $y$ satisfies $(x \\oplus y) < K$ and we add `sz[child[u][b_x]]` in $O(1)$. The remaining candidates must match $b_k = 1$ at bit $i$, which requires $y_i = 1 - b_x$, so we descend into `child[u][1 - b_x]`."
  },
  {
    "id": "q10-xortrie-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Maximum XOR Subarray Reduction",
    "prompt": "Given an array $A[0..N-1]$ of non-negative 32-bit integers, you need to find a contiguous subarray $A[L..R]$ ($0 \\le L \\le R < N$) maximizing $A[L] \\oplus A[L+1] \\oplus \\dots \\oplus A[R]$ in $O(N \\cdot W)$ time.",
    "question": "How is this subarray problem reduced to point queries on a 0-1 Trie?",
    "options": [
      "Define prefix XORs $P[0] = 0$ and $P[i] = P[i-1] \\oplus A[i-1]$; insert $P[0]$ into the 0-1 Trie, and for each $r = 1..N$, query the Trie for $\\max_{0 \\le l < r} (P[r] \\oplus P[l])$ before inserting $P[r]$",
      "Insert all elements $A[i]$ into the Trie and query the two deepest leaves",
      "Maintain a sliding window of size $\\log_2 N$ in the 0-1 Trie",
      "Sort the array $A$ first and XOR adjacent elements"
    ],
    "answer": 0,
    "explanation": "Because XOR is its own inverse ($z \\oplus z = 0$), the XOR sum of subarray $A[L..R]$ equals $P[R+1] \\oplus P[L]$. Inserting each prefix XOR $P[l]$ into the 0-1 Trie and querying the maximum XOR partner for $P[r]$ finds the optimal $L < r$ in $O(W)$ time per index."
  },
  {
    "id": "q10-xortrie-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Range Maximum XOR via Persistent 0-1 Trie + `max_id`",
    "prompt": "You need to answer $Q$ offline/online queries of the form: given $(L, R, x)$, find $\\max_{L \\le i \\le R} (A[i] \\oplus x)$ in $O(W)$ time per query without modifying the array.",
    "question": "Which augmentation of a Persistent 0-1 Trie allows answering $(L, R, x)$ by traversing only a single root `root[R]` instead of subtracting counts between `root[R]` and `root[L-1]`?",
    "options": [
      "Store in each newly cloned node $u$ of `root[R]` the maximum array index `max_id[u]` of any element inserted into $u$'s subtrie up to time $R$; during a query from `root[R]`, a child branch $v$ contains at least one element in $[L, R]$ if and only if `v != 0 && max_id[v] >= L`",
      "Store the XOR of all array indices in each node",
      "Use lazy propagation to zero out nodes with index $< L$",
      "Link leaf nodes in a doubly linked list and scan from $L$ to $R$"
    ],
    "answer": 0,
    "explanation": "In `root[R]`, every element present in the Trie has index $\\le R$. Therefore, a subtrie $v$ contains at least one element with index $\\in [L, R]$ if and only if the most recently inserted element in $v$'s subtrie has index $\\ge L$, i.e., `max_id[v] >= L`. This replaces two-node subtraction (`sz[v_R] - sz[v_{L-1}] > 0`) with a single node check (`max_id[v_R] >= L`), cutting memory loads during query traversal in half."
  }
];

window.QUESTION_BANK["rabin-karp-polynomial-rolling-hash"] = [
  {
    "id": "q10-rk-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Birthday Paradox Collision Threshold for Single 32-Bit Hash",
    "prompt": "A developer uses a single polynomial hash modulo $M = 10^9 + 7 \\approx 2^{30}$ to deduplicate all substrings of length $L$ in a text of length $N = 10^5$ without verifying matching substrings character-by-character.",
    "question": "Why does this fail with high probability on random inputs even without an adversary?",
    "options": [
      "Comparing $\\binom{N}{2} \\approx 5 \\times 10^9$ pairs of substrings modulo $M = 10^9 + 7$ gives collision probability $1 - \\exp(-N^2 / (2M)) \\approx 1 - e^{-5} > 99.3\\%$ by the Birthday Paradox",
      "$10^9 + 7$ is a composite number",
      "Polynomial hashes always collide on strings of length $\\ge 32$",
      "Modular addition overflows a 64-bit integer when $M = 10^9 + 7$"
    ],
    "answer": 0,
    "explanation": "When hashing $N$ substrings and checking all $\\binom{N}{2} \\approx N^2 / 2$ pairs (e.g., via a hash set or sorting hashes during binary search for Longest Duplicate Substring), collisions become likely as soon as $N \\approx \\sqrt{M}$. For $M \\approx 10^9$, $\\sqrt{M} \\approx 31{,}622$, so $N = 10^5$ is virtually guaranteed to suffer a hash collision unless a 61-bit modulus ($M = 2^{61} - 1$) or double hashing is used."
  },
  {
    "id": "q10-rk-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Fast Mersenne Modular Reduction Modulo $2^{61} - 1$",
    "prompt": "We compute the 128-bit product `unsigned __int128 prod = (unsigned __int128)a * b` where $a, b < M = 2^{61} - 1$, and want to reduce `prod` modulo $M$ without the slow hardware `divq` instruction.",
    "question": "Which bitwise identity forms the basis of $O(1)$ division-free reduction modulo $M = 2^{61} - 1$?",
    "options": [
      "$2^{61} \\equiv 1 \\pmod{2^{61} - 1}$, so `prod = (prod >> 61) + (prod & M)` preserves the residue modulo $M$ while folding the upper bits into the lower 61 bits",
      "$2^{61} \\equiv -1 \\pmod{2^{61} - 1}$, so `prod = (prod & M) - (prod >> 61)`",
      "`prod & (M - 1)` computes the exact remainder modulo $2^{61} - 1$",
      "`(uint64_t)prod >> 3` divides by $2^{61} - 1$"
    ],
    "answer": 0,
    "explanation": "Because $2^{61} = (2^{61} - 1) + 1 \\equiv 1 \\pmod{M}$, writing $\\text{prod} = \\text{hi} \\cdot 2^{61} + \\text{lo}$ where $\\text{lo} = \\text{prod} \\mathbin{\\&} M$ and $\\text{hi} = \\text{prod} \\gg 61$ immediately gives $\\text{prod} \\equiv \\text{hi} + \\text{lo} \\pmod M$. A single conditional subtraction `if (res >= M) res -= M;` then normalizes the result into $[0, M - 1]$."
  },
  {
    "id": "q10-rk-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Substring Hash Extraction Formula",
    "prompt": "Given prefix hashes $H[i] = \\sum_{k=0}^{i-1} S[k] \\cdot B^{i-1-k} \\bmod M$ with $H[0] = 0$ and precomputed powers $P[k] = B^k \\bmod M$.",
    "question": "Which expression computes the exact polynomial hash of the half-open substring $S[l..r)$ ($0 \\le l \\le r \\le N$) in $O(1)$ time?",
    "options": [
      "$(H[r] + M - (H[l] \\cdot P[r - l] \\bmod M)) \\bmod M$",
      "$(H[r] - H[l]) \\cdot P[l] \\bmod M$",
      "$(H[r] \\cdot P[r - l] - H[l]) \\bmod M$",
      "$H[r] \\oplus (H[l] \\ll (r - l))$"
    ],
    "answer": 0,
    "explanation": "In the highest-power-first prefix definition, $H[r] = H[l] \\cdot B^{r - l} + \\text{hash}(S[l..r)) \\pmod M$. Multiplying $H[l]$ by $P[r - l] = B^{r - l} \\bmod M$ aligns the powers of $S[0..l-1]$ with their shifted positions inside $H[r]$, and subtracting modulo $M$ isolates $\\text{hash}(S[l..r))$."
  },
  {
    "id": "q10-rk-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Thue-Morse Universal Collision Attack on `uint64_t` Overflow Hashing",
    "prompt": "Many competitive programmers implement rolling hash using natural `uint64_t` overflow ($M = 2^{64}$) with an odd base $B$. Define the Thue-Morse string sequence by $T_0 = \\texttt{\"a\"}$, $T_0' = \\texttt{\"b\"}$, and $T_k = T_{k-1} + T_{k-1}'$, $T_k' = T_{k-1}' + T_{k-1}$ for $k \\ge 1$.",
    "question": "Why do $T_{11}$ and $T_{11}'$ (of length $2^{11} = 2048$) collide for EVERY possible odd base $B$ modulo $2^{64}$?",
    "options": [
      "The polynomial difference $\\text{hash}(T_k) - \\text{hash}(T_k')$ factors as $(\\texttt{'a'} - \\texttt{'b'}) \\prod_{i=0}^{k-1} (B^{2^i} - 1)$; for any odd $B$, $B^{2^i} - 1$ is divisible by at least $2^{i+2}$, so the product of $2$-adic valuations exceeds $64$ by $k = 10$, making the difference a multiple of $2^{64}$",
      "Because `uint64_t` shifts out the top 11 bits after 2048 multiplications",
      "Because $T_{11}$ and $T_{11}'$ are anagrams of each other and polynomial hashes are commutative",
      "Because $B^{2048} \\equiv 0 \\pmod{2^{64}}$ for every odd integer $B$"
    ],
    "answer": 0,
    "explanation": "By Euler's / Lifting-the-Exponent lemma on $2$-adic valuations, for any odd $B$, $v_2(B - 1) \\ge 1$, $v_2(B^2 - 1) \\ge 3$, and $v_2(B^{2^i} - 1) \\ge i + 2$ for $i \\ge 1$. Thus $v_2(\\prod_{i=0}^{k-1} (B^{2^i} - 1)) \\ge 1 + \\sum_{i=1}^{k-1} (i + 2) = 1 + \\frac{(k-1)(k+4)}{2}$. For $k = 10$, this is $1 + 63 = 64$, so $\\text{hash}(T_{10}) \\equiv \\text{hash}(T_{10}') \\pmod{2^{64}}$ simultaneously for ALL odd bases $B$!"
  }
];

window.QUESTION_BANK["kmp-prefix-function-automaton"] = [
  {
    "id": "q10-kmp-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Enumeration of All Borders via $\\pi$",
    "prompt": "Let $\\pi[0..M-1]$ be the KMP prefix function array for string $S[0..M-1]$, where $\\pi[i]$ is the length of the longest proper prefix of $S[0..i]$ that is also a suffix of $S[0..i]$.",
    "question": "How are ALL non-empty proper border lengths (both longest and shorter proper prefixes that match suffixes) of the full string $S[0..M-1]$ obtained from $\\pi$?",
    "options": [
      "By starting at $k = \\pi[M - 1]$ and repeatedly iterating $k \\leftarrow \\pi[k - 1]$ while $k > 0$",
      "By collecting all distinct non-zero values that appear anywhere in the array $\\pi[0..M-1]$",
      "By dividing $M$ by $M - \\pi[M - 1]$",
      "By checking all indices $i$ where $\\pi[i] == i$"
    ],
    "answer": 0,
    "explanation": "Any proper border of $S[0..M-1]$ of length $k < \\pi[M-1]$ is a proper prefix and suffix of the longest border $S[0..\\pi[M-1]-1]$. Therefore, the second-longest border of $S[0..M-1]$ has length $\\pi[\\pi[M-1] - 1]$, and iterating $k \\leftarrow \\pi[k - 1]$ until $k = 0$ enumerates every border of $S$ in strictly decreasing order of length."
  },
  {
    "id": "q10-kmp-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Smallest Period of a String from KMP $\\pi[N-1]$",
    "prompt": "A string $S$ of length $N = 12$ has KMP prefix array ending with $\\pi[11] = 8$. You want to know whether $S$ can be formed by repeating a smaller block $S[0..p-1]$ an integer number of times ($N = k \\cdot p$ for $k \\ge 2$).",
    "question": "What is the candidate smallest period length $p$, and does $S$ have an exact repeating period here?",
    "options": [
      "$p = N - \\pi[N - 1] = 12 - 8 = 4$; because $p = 4$ divides $N = 12$ evenly, $S$ is the exact $3$-fold repetition of $S[0..3]$",
      "$p = \\pi[N - 1] = 8$; because $8$ does not divide $12$, $S$ is not periodic",
      "$p = \\gcd(N, \\pi[N - 1]) = \\gcd(12, 8) = 4$, which always works even if $N - \\pi[N - 1]$ does not divide $N$",
      "$p = N / 2 = 6$"
    ],
    "answer": 0,
    "explanation": "By the border-periodicity duality, $S[0..N-1]$ has a border of length $b = \\pi[N-1]$ iff $S[i] = S[i + (N - b)]$ for all $0 \\le i < b$, meaning $p = N - \\pi[N-1]$ is the smallest period of $S$. If $N \\bmod p == 0$ (here $12 \\bmod 4 == 0$), then $S$ is an exact repetition of $S[0..p-1]$."
  },
  {
    "id": "q10-kmp-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Amortized Potential Function of KMP",
    "prompt": "In KMP prefix-function construction, the outer `for` loop runs for $i = 1..N-1$. Inside, a `while (j > 0 && S[i] != S[j]) j = pi[j - 1];` loop decreases $j$, followed by `if (S[i] == S[j]) j++;`.",
    "question": "What is the exact maximum number of times the statement `j = pi[j - 1]` can execute across the entire algorithm on a string of length $N$?",
    "options": [
      "At most $N - 1$ times in total, because $j$ starts at $0$, increases by at most $1$ per outer loop iteration ($N - 1$ increments total), remains $\\ge 0$, and decreases by at least $1$ on every `j = pi[j - 1]` step",
      "At most $N \\log_2 N$ times, because $\\pi[j - 1] \\le j / 2$",
      "At most $2N$ times per character if the alphabet is binary",
      "At most $N^2 / 2$ times on strings like `\"aaaa...ab\"`"
    ],
    "answer": 0,
    "explanation": "Using $j = \\pi[i-1]$ as the potential function $\\Phi$: $\\Phi_0 = 0$, $\\Phi \\ge 0$ always, each outer-loop iteration increments $j$ by at most $1$ (at most $N - 1$ total increments across $i = 1..N-1$), and each fallback `j = pi[j - 1]` strictly decreases $j$ by at least $1$. Thus the fallback cannot execute more than $N - 1$ times in total."
  },
  {
    "id": "q10-kmp-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Why Unfolded KMP Can Take $\\Theta(\\log_\\phi M)$ Steps on a Single Character",
    "prompt": "Although KMP is $O(N)$ amortized across the whole string, a real-time packet stream processor requires worst-case $O(1)$ work per incoming byte. Consider a pattern whose prefixes are Fibonacci words ($F_1 = \\texttt{\"b\"}$, $F_2 = \\texttt{\"a\"}$, $F_k = F_{k-1} F_{k-2}$).",
    "question": "How many fallback steps can the `while (j > 0 && T[i] != P[j]) j = pi[j - 1]` loop take on a SINGLE text character $T[i]$, and how does the KMP Automaton eliminate this latency spike?",
    "options": [
      "Up to $\\Theta(\\log_\\phi M)$ steps on a single character; precomputing the KMP DFA table $\\text{aut}[j][c] = (c == P[j]) \\; ? \\; j + 1 : \\text{aut}[\\pi[j-1]][c]$ resolves every transition in worst-case $O(1)$ time",
      "Up to $\\Theta(M)$ steps on a single character; only Boyer-Moore can fix it",
      "At most $2$ steps on any character by the Periodicity Lemma",
      "Up to $\\Theta(\\sqrt{M})$ steps; hashing the prefix array fixes it"
    ],
    "answer": 0,
    "explanation": "Wait: on $P = \\texttt{\"aaaa...a\"}$, mismatching with $\\texttt{'z'}$ actually takes $\\Theta(M)$ steps in standard KMP, and even with Knuth's strict failure link $\\pi'[j]$ (which skips borders followed by the same character $P[j]$), Fibonacci strings still force $\\Theta(\\log_\\phi M)$ fallback steps on a single character! Materializing the full DFA $\\text{aut}[j][c]$ via dynamic programming on $\\pi[j-1]$ guarantees strict $O(1)$ per-character latency."
  }
];

window.QUESTION_BANK["z-algorithm-linear-box"] = [
  {
    "id": "q10-zalg-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Definition of $Z[i]$ and the Active Z-Box $[L, R]$",
    "prompt": "In the Z-algorithm on string $S[0..N-1]$, we maintain the interval $[L, R]$ with maximum right endpoint $R$ among all earlier indices $1 \\le k < i$ that had $Z[k] > 0$.",
    "question": "What structural invariant does the active Z-box $[L, R]$ satisfy when processing index $i \\le R$?",
    "options": [
      "The substring $S[L..R]$ is an exact copy of the prefix $S[0..R-L]$, so the suffix starting at $i$ inside the box ($S[i..R]$) equals $S[i - L..R - L]$",
      "The substring $S[L..R]$ is a palindrome centered at $(L + R) / 2$",
      "$Z[i]$ is guaranteed to equal $Z[i - L]$ even when $Z[i - L] > R - i + 1$",
      "No character inside $S[L..R]$ can match $S[0]$"
    ],
    "answer": 0,
    "explanation": "Because $[L, R] = [L, L + Z[L] - 1]$ represents the longest prefix match starting at $L$, $S[L..R] = S[0..R-L]$. Therefore, any position $i \\in [L, R]$ corresponds to position $k = i - L$ inside the prefix $S[0..R-L]$, giving $Z[i] \\ge \\min(R - i + 1, Z[i - L])$."
  },
  {
    "id": "q10-zalg-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Why Explicit Comparisons Only Happen When $Z[i - L] \\ge R - i + 1$",
    "prompt": "Suppose at step $i \\le R$, we look up the mirror index $k = i - L$ and find that $Z[k] < R - i + 1$.",
    "question": "Why does the Z-algorithm know immediately that $Z[i] = Z[k]$ WITHOUT comparing $S[Z[i]]$ against $S[i + Z[i]]$?",
    "options": [
      "Because $Z[k] < R - i + 1$ means the prefix match at $k$ terminated strictly inside $S[0..R-L]$ due to a mismatch $S[Z[k]] \\neq S[k + Z[k]]$; since $S[i..R] = S[k..R-L]$, that exact same mismatch occurs at $S[i + Z[k]] \\neq S[Z[k]]$",
      "Because $Z[i]$ is not allowed to exceed $Z[i - 1]$",
      "Because $R$ is already at the end of the string $N - 1$",
      "It actually DOES need to compare one extra character to confirm"
    ],
    "answer": 0,
    "explanation": "Since $k + Z[k] \\le R - L$, the mismatching character $S[k + Z[k]] \\neq S[Z[k]]$ lies strictly inside the already-verified Z-box! By the box identity $S[i + Z[k]] = S[k + Z[k]]$, we already know $S[i + Z[k]] \\neq S[Z[k]]$, so the while-loop would fail immediately on its first comparison."
  },
  {
    "id": "q10-zalg-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Finding All Shortest Cyclic Shifts / String Borders via $Z$",
    "prompt": "You want to find the shortest suffix of $S[0..N-1]$ that is also a prefix of $S$ (or determine the minimum number of characters to append to $S$ so that a prefix of $S$ covers the suffix).",
    "question": "Which condition on the Z-array $Z[1..N-1]$ identifies every index $i$ where the suffix $S[i..N-1]$ is also a prefix of $S$?",
    "options": [
      "$i + Z[i] == N$",
      "$Z[i] == i$",
      "$Z[i] \\ge N / 2$",
      "$Z[N - 1 - i] == i$"
    ],
    "answer": 0,
    "explanation": "$Z[i]$ is the length of the longest common prefix of $S[0..N-1]$ and $S[i..N-1]$. Because $|S[i..N-1]| = N - i$, the entire suffix $S[i..N-1]$ matches a prefix of $S$ if and only if $Z[i] == N - i$, i.e., $i + Z[i] == N$."
  },
  {
    "id": "q10-zalg-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Converting $Z[0..N-1]$ to $\\pi[0..N-1]$ in $O(N)$ Time",
    "prompt": "Every string's Z-array $Z[0..N-1]$ and KMP prefix array $\\pi[0..N-1]$ encode equivalent border information and can be converted into one another in $O(N)$ time without inspecting the original characters of $S$.",
    "question": "Given only the array $Z[0..N-1]$, how can you construct $\\pi[0..N-1]$ in $O(N)$ time?",
    "options": [
      "Each $Z[i] > 0$ implies that for every $k \\in [0, Z[i] - 1]$, $\\pi[i + k] \\ge k + 1$; set $\\pi[i + Z[i] - 1] = \\max(\\pi[i + Z[i] - 1], Z[i])$ for each $i \\ge 1$, then propagate backwards for $j = N - 2$ down to $0$: $\\pi[j] = \\max(\\pi[j], \\pi[j + 1] - 1)$",
      "Simply set $\\pi[i] = Z[N - 1 - i]$ for all $i$",
      "Compute the prefix sums of $Z[0..i]$ modulo $i$",
      "Set $\\pi[i + Z[i] - 1] = Z[i]$ without backward propagation; intermediate positions are always $0$"
    ],
    "answer": 0,
    "explanation": "If $Z[i] = L$, then $S[i..i+k] = S[0..k]$ for all $0 \\le k < L$, which gives a border of length $k + 1$ ending at $i + k$. Recording the right-endpoint maximum $\\pi[i + L - 1] = \\max(\\pi[i + L - 1], L)$ in $O(1)$ per $i$ and then sweeping right-to-left with $\\pi[j] = \\max(\\pi[j], \\pi[j + 1] - 1)$ fills all interior prefix values in $O(N)$ total time."
  }
];

window.QUESTION_BANK["boyer-moore-horspool-simd"] = [
  {
    "id": "q10-bmh-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Why Horspool Excludes $P[M - 1]$ from the Shift Table",
    "prompt": "When building the 256-entry Bad-Character shift table for Boyer-Moore-Horspool on pattern $P[0..M-1]$, we initialize `shift[c] = M` for all $c$ and then loop `for (size_t k = 0; k < M - 1; ++k) shift[P[k]] = M - 1 - k;`.",
    "question": "Why does the loop stop at $k = M - 2$ instead of including $k = M - 1$?",
    "options": [
      "If $k = M - 1$ were included, `shift[P[M - 1]]` would be set to $M - 1 - (M - 1) = 0$; whenever a mismatch occurred inside $P[0..M-2]$ while $T[s + M - 1] == P[M - 1]$, `s += shift[T[s + M - 1]]` would add $0$ and hang in an infinite loop",
      "Because $P[M - 1]$ is always the null terminator `'\\0'`",
      "Because $P[M - 1]$ is never compared against the text in Horspool's algorithm",
      "To save one iteration during preprocessing"
    ],
    "answer": 0,
    "explanation": "Horspool always indexes the shift table by $c_{\\text{end}} = T[s + M - 1]$. If the last character matches ($T[s + M - 1] == P[M - 1]$) and a mismatch occurs earlier at some $j < M - 1$ (or after a full match), we need to shift $P$ so that an *earlier* occurrence of $P[M - 1]$ in $P[0..M-2]$ aligns with $T[s + M - 1]$ (or shift by $M$ if $P[M - 1]$ never appears earlier). Including $k = M - 1$ would overwrite `shift[P[M - 1]]` with $0$."
  },
  {
    "id": "q10-bmh-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Tracing Boyer-Moore-Horspool Shifts",
    "prompt": "Consider searching for pattern $P = \\texttt{\"ABCB\"}$ ($M = 4$) in text $T = \\texttt{\"ABXBCBABCB\"}$. First compute Horspool's `shift` table over $P[0..2] = \\texttt{\"ABC\"}$: `shift['A'] = 3`, `shift['B'] = 2`, `shift['C'] = 1`, and `shift[other] = 4`.",
    "question": "Starting at alignment $s = 0$ ($T[0..3] = \\texttt{\"ABXB\"}$), what sequence of alignment offsets $s$ does Boyer-Moore-Horspool visit until finding the match at $s = 6$?",
    "options": [
      "$s = 0 \\to s = 2 \\to s = 4 \\to s = 6$",
      "$s = 0 \\to s = 4 \\to s = 6$",
      "$s = 0 \\to s = 1 \\to s = 2 \\to s = 3 \\to s = 4 \\to s = 5 \\to s = 6$",
      "$s = 0 \\to s = 3 \\to s = 6$"
    ],
    "answer": 0,
    "explanation": "At $s = 0$, $T[3] = \\texttt{'B'}$ matches $P[3]$, $T[2] = \\texttt{'X'} \\neq P[2]$; Horspool shifts by `shift[T[3]] = shift['B'] = 2` to $s = 2$. At $s = 2$, $T[2..5] = \\texttt{\"XBCB\"}$, so $T[5] = \\texttt{'B'}$ and we shift by `shift['B'] = 2` to $s = 4$. At $s = 4$, $T[4..7] = \\texttt{\"CBAB\"}$, so $T[7] = \\texttt{'B'}$ and we shift by `shift['B'] = 2` to $s = 6$, where $T[6..9] = \\texttt{\"ABCB\"}$ matches!"
  },
  {
    "id": "q10-bmh-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Worst-Case Pathological Input for Boyer-Moore-Horspool",
    "prompt": "Unlike full Boyer-Moore with the strong Good-Suffix and Galil rules, Boyer-Moore-Horspool uses only the Bad-Character shift of $T[s + M - 1]$.",
    "question": "Which pair of text $T$ (length $N$) and pattern $P$ (length $M$) forces Boyer-Moore-Horspool to perform $\\Theta(N \\cdot M)$ character comparisons?",
    "options": [
      "$T = \\texttt{\"aaaa...aaaa\"}$ and $P = \\texttt{\"baaa...aaa\"}$, where every alignment compares $M$ characters from right to left before mismatching at $P[0] = \\texttt{'b'}$ and shifting by `shift['a'] = 1`",
      "$T = \\texttt{\"aaaa...aaaa\"}$ and $P = \\texttt{\"aaaa...aab\"}$, where the last character mismatches immediately",
      "$T = \\texttt{\"abcdef...\"}$ and $P = \\texttt{\"xyz\"}$",
      "Any text and pattern where $M > \\sqrt{N}$"
    ],
    "answer": 0,
    "explanation": "When $P = \\texttt{\"baaa...a\"}$ and $T = \\texttt{\"aaaa...a\"}$, `shift['a'] = 1` because $\\texttt{'a'}$ appears at $P[M - 2]$. At every alignment $s$, $P[M-1]$ down to $P[1]$ match $\\texttt{'a'}$, $P[0] = \\texttt{'b'}$ mismatches after $M$ comparisons, and $s$ advances by only $1$—resulting in $(N - M + 1) \\cdot M = \\Theta(N \\cdot M)$ comparisons."
  },
  {
    "id": "q10-bmh-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Packed-Pair SIMD Guard Selection (`memchr::memmem`)",
    "prompt": "In Rust's `memchr::memmem` (used by `ripgrep`), single-substring search on AVX2 selects two pattern positions $k_1, k_2 \\in [0, M-1]$ (`PackedPair`) and runs `_mm256_cmpeq_epi8` on 32-byte slices $T[s + k_1..s + k_1 + 31]$ and $T[s + k_2..s + k_2 + 31]$ before calling `memcmp`.",
    "question": "How should $k_1$ and $k_2$ be chosen from $P[0..M-1]$ to maximize throughput on natural-language or source-code corpora?",
    "options": [
      "Choose $k_1$ and $k_2$ with the lowest empirical background byte frequencies (e.g., `'q'`, `'z'`, punctuation, or uppercase bytes rather than `'e'` or `' '`), because minimizing the joint probability $\\Pr[T[s+k_1]=P[k_1] \\land T[s+k_2]=P[k_2]]$ minimizes false-positive `memcmp` calls",
      "Always choose $k_1 = 0$ and $k_2 = 1$ for cache locality",
      "Choose the two most frequent characters in English so the SIMD registers stay warm",
      "Choose $k_1 = k_2 = M - 1$"
    ],
    "answer": 0,
    "explanation": "In a SIMD guard filter, the outer vectorized loop ALWAYS scans 32 bytes per step regardless of shift distance; its speed is bottlenecked only by how often the bitwise AND of the two `_mm256_cmpeq_epi8` masks produces a non-zero bit that triggers scalar verification. Selecting the two rarest bytes in $P$ minimizes false-positive hits."
  }
];

window.QUESTION_BANK["aho-corasick-trie-automaton"] = [
  {
    "id": "q10-ac-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Why Aho-Corasick Failure Links Require Breadth-First Search (BFS)",
    "prompt": "In KMP for a single pattern, we compute $\\pi[i]$ in a simple left-to-right loop (which is a Depth-First traversal of the single branch). In Aho-Corasick for multiple patterns, however, we MUST compute $\\text{fail}[u]$ and $\\text{go}[u][c]$ in Breadth-First Search (level-order) order rather than Depth-First Search (DFS) order.",
    "question": "Why would computing $\\text{fail}[u]$ during a standard Depth-First Search (DFS) of the Trie fail?",
    "options": [
      "Because $\\text{fail}[u]$ points to a proper suffix $S(v)$ on a DIFFERENT branch of the Trie whose depth is strictly less than $\\text{depth}(u)$; DFS explores one entire branch to its leaves before visiting shallow nodes on other branches, so $\\text{fail}[\\text{parent}(u)]$ would point to unvisited nodes",
      "Because DFS uses $O(M)$ recursion stack space while BFS uses $O(1)$ space",
      "Because Trie edges are undirected",
      "DFS actually works identically to BFS for Aho-Corasick"
    ],
    "answer": 0,
    "explanation": "The transition recurrence $\\text{fail}[\\text{child}(u, c)] = \\text{go}[\\text{fail}[u]][c]$ relies on $\\text{go}[v][c]$ already being known for $v = \\text{fail}[u]$. Since $|S(v)| < |S(u)|$, node $v$ lies at a strictly smaller depth on another branch of the Trie. Level-order (BFS) traversal guarantees that all states of depth $< d$ (across all branches) are finalized before any state of depth $d$ is processed."
  },
  {
    "id": "q10-ac-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Tracing Completed DFA Transitions $\\text{go}[u][c]$",
    "prompt": "Suppose an Aho-Corasick automaton is built for $\\{\\texttt{\"ab\"}, \\texttt{\"bc\"}, \\texttt{\"bab\"}\\}$. State $u$ corresponds to the prefix $\\texttt{\"bab\"}$ and has NO outgoing Trie child for character $\\texttt{'c'}$. Its failure link is $\\text{fail}[\\texttt{\"bab\"}] = \\texttt{\"ab\"}$, and $\\text{fail}[\\texttt{\"ab\"}] = \\texttt{\"b\"}$, which HAS a Trie child $\\texttt{\"bc\"}$ on character $\\texttt{'c'}$.",
    "question": "In the completed DFA table, what state does $\\text{go}[\\texttt{\"bab\"}][\\texttt{'c'}]$ point to, and how many array lookups does it take at query time?",
    "options": [
      "It points directly to state $\\texttt{\"bc\"}$ in a single $O(1)$ array lookup, because during BFS $\\text{go}[\\texttt{\"ab\"}][\\texttt{'c'}]$ was already wired to $\\text{go}[\\texttt{\"b\"}][\\texttt{'c'}] = \\texttt{\"bc\"}$, and $\\text{go}[\\texttt{\"bab\"}][\\texttt{'c'}]$ copied $\\text{go}[\\texttt{\"ab\"}][\\texttt{'c'}]$",
      "It points to the root $\\varepsilon$ because $\\texttt{\"ab\"}$ has no child $\\texttt{'c'}$",
      "It requires walking two failure links at query time ($\\texttt{\"bab\"} \\to \\texttt{\"ab\"} \\to \\texttt{\"b\"} \\to \\texttt{\"bc\"}$)",
      "It points to state $\\texttt{\"ab\"}$"
    ],
    "answer": 0,
    "explanation": "Because BFS processes nodes by increasing depth: at depth 1 ($\\texttt{\"b\"}$), $\\text{go}[\\texttt{\"b\"}][\\texttt{'c'}] = \\texttt{\"bc\"}$; at depth 2 ($\\texttt{\"ab\"}$), since child $\\texttt{'c'}$ is absent, $\\text{go}[\\texttt{\"ab\"}][\\texttt{'c'}] = \\text{go}[\\text{fail}[\\texttt{\"ab\"}]][\\texttt{'c'}] = \\text{go}[\\texttt{\"b\"}][\\texttt{'c'}] = \\texttt{\"bc\"}$; then at depth 3 ($\\texttt{\"bab\"}$), $\\text{go}[\\texttt{\"bab\"}][\\texttt{'c'}] = \\text{go}[\\texttt{\"ab\"}][\\texttt{'c'}] = \\texttt{\"bc\"}$. Every arbitrarily long failure chain collapses into 1 lookup."
  },
  {
    "id": "q10-ac-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Role of Dictionary Suffix Links ($\\text{exit}[u]$)",
    "prompt": "Consider a dictionary with two patterns: $P_1 = \\texttt{\"a\"}^M \\texttt{\"b\"}$ (length $M + 1$) and $P_2 = \\texttt{\"a\"}$ (length $1$), and a text $T = \\texttt{\"a\"}^N$ of length $N$.",
    "question": "If the query loop walks raw failure links (`for (int v = u; v != 0; v = fail[v])`) instead of compressed dictionary suffix links (`exit[v]`), what is the time complexity of scanning $T$, and how does `exit[v]` fix it?",
    "options": [
      "Walking raw `fail` links takes $\\Theta(N \\cdot M)$ time because at each index $i \\ge M$, $u$ is at depth $M$ and traverses $M - 1$ non-terminal intermediate states `$\\texttt{\"a\"}^{M-1}, \\dots, \\texttt{\"aa\"}$` before reaching terminal state `$\\texttt{\"a\"}$`; `exit[u]` jumps directly from depth $M$ to depth $1$ in $O(1)$ time, restoring $\\Theta(N + Z) = \\Theta(N)$ time",
      "Both take $\\Theta(N)$ time by amortized analysis, just like the state transition loop",
      "Walking raw `fail` links misses matches of $P_2 = \\texttt{\"a\"}$",
      "`exit[u]` reduces the memory of the transition table from $O(M |\\Sigma|)$ to $O(M)$"
    ],
    "answer": 0,
    "explanation": "Amortized analysis does NOT save raw failure-link traversal for match reporting because reporting does not reset the active state $u$! At every step, $u$ stays at depth $M$ while the reporting loop re-walks the same $M - 1$ non-terminal states. Compressing the chain via $\\text{exit}[u]$ ensures every pointer hop lands on a terminal state that emits at least one match."
  },
  {
    "id": "q10-ac-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Counting Total Pattern Occurrences in $O(N + M)$ Even When $Z = \\Theta(N \\cdot K)$",
    "prompt": "Suppose you only need to compute for EACH pattern $P_k$ ($1 \\le k \\le K$) how many times $P_k$ appears in $T$, without listing the individual match offsets. Note that if $P_k = \\texttt{\"a\"}^k$ and $T = \\texttt{\"a\"}^N$, the total number of matches is $Z = \\Theta(N \\cdot K)$, so even walking `exit_link` at each character takes $\\Theta(N \\cdot K)$ time.",
    "question": "How can you compute the exact occurrence count of every pattern $P_1, \\dots, P_K$ in strict $O(N + M)$ time, independent of $Z$?",
    "options": [
      "During the scan of $T$, only increment `vis[u]++` at the active state $u$ in $O(1)$ per text character (never walking `exit_link`); after scanning $T$, propagate `vis[fail[u]] += vis[u]` in reverse BFS order (deepest states to root) on the Failure Tree",
      "Stop scanning as soon as `vis[u]` exceeds $1$",
      "Run binary search on the length of the longest matching pattern at each text index",
      "Multiply `vis[u]` by the depth of $u$"
    ],
    "answer": 0,
    "explanation": "The failure links $\\text{fail}[u]$ form a rooted tree (the Failure Link Tree) rooted at $0$, and pattern $P_k$ ending at node $v$ occurs at text index $i$ if and only if the active state $u_i$ lies in the subtree of $v$ in the Failure Link Tree! Recording `vis[u_i]++` in $O(N)$ time and then doing a single bottom-up subtree sum `vis[fail[u]] += vis[u]` in reverse BFS order ($O(M)$ time) computes all pattern frequencies in $O(N + M)$ even when $Z = \\Theta(N \\cdot K)$."
  }
];

window.QUESTION_BANK["manacher-palindromic-tree"] = [
  {
    "id": "q10-man-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Manacher Mirror Initialization Formula",
    "prompt": "In Manacher's algorithm on transformed string $T$, we maintain the rightmost palindrome interval $[L, R]$ centered at $c = (L + R) / 2$. We are now at index $i$ with $c < i < R$.",
    "question": "What is the mirror index $i'$ of $i$ across center $c$, and how is the radius $p[i]$ initialized before attempting character comparisons?",
    "options": [
      "$i' = L + R - i$ (equivalently $2c - i$), and $p[i] = \\min(R - i,\\; p[i'])$",
      "$i' = i - L$, and $p[i] = \\min(R - i,\\; p[i - L])$",
      "$i' = R - i$, and $p[i] = p[R - i]$",
      "$i' = i - c$, and $p[i] = \\max(R - i,\\; p[i'])$"
    ],
    "answer": 0,
    "explanation": "Unlike the Z-algorithm (which translates $i$ to $i - L$ because a Z-box is a translated copy of a prefix), a palindrome reflects indices symmetrically across its midpoint $c = (L + R) / 2$: $i' = c - (i - c) = 2c - i = L + R - i$. Because symmetry is only guaranteed inside $[L, R]$, we clamp the copied radius to the distance to the right boundary: $p[i] = \\min(R - i,\\; p[i'])$."
  },
  {
    "id": "q10-man-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Maximum Number of Distinct Palindromes in a String",
    "prompt": "A string $S$ has length $N$. You want to allocate a static buffer of nodes for an Eertree (Palindromic Automaton) that stores every distinct non-empty palindromic substring of $S$ plus the two roots (lengths $-1$ and $0$).",
    "question": "What is the exact maximum number of nodes (including the two roots) that an Eertree can ever create for any string of length $N$, and what string achieves this upper bound?",
    "options": [
      "At most $N + 2$ nodes (i.e., at most $N$ distinct non-empty palindromes), achieved for example by $S = \\texttt{\"aaaa...a\"}$ or $S = \\texttt{\"abcdef...\"}$ where each appended character adds exactly 1 new palindrome",
      "At most $2N + 1$ nodes, because there are $2N + 1$ palindrome centers",
      "At most $N(N + 1) / 2$ nodes, because every substring could be a distinct palindrome",
      "At most $N \\log_2 N$ nodes"
    ],
    "answer": 0,
    "explanation": "When character $S[i]$ is appended, only the LONGEST palindromic suffix ending at $i$ can be a newly seen palindrome; any shorter palindromic suffix ending at $i$ is reflected across the center of the longest one into an earlier occurrence inside $S[0..i-1]$. Hence at most $1$ new node is created per character, giving at most $N$ palindrome nodes plus the $2$ roots = $N + 2$ nodes."
  },
  {
    "id": "q10-man-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Why Eertree Needs Two Roots ($\\text{len} = -1$ and $\\text{len} = 0$)",
    "prompt": "In an Eertree, transitioning along edge $c$ from node $u$ creates a node $v$ with $\\text{len}[v] = \\text{len}[u] + 2$, representing the palindrome $c + S(u) + c$.",
    "question": "How do the two roots (Node 1 with $\\text{len}[1] = -1$ and Node 2 with $\\text{len}[2] = 0$, $\\text{link}[2] = 1$) enable both odd-length and even-length palindromes to use the exact same transition rule $\\text{len}[v] = \\text{len}[u] + 2$?",
    "options": [
      "Node 2 ($\\text{len} = 0$, empty string $\\varepsilon$) produces length-$2$ palindromes $cc$ ($0 + 2 = 2$) and all even-length palindromes, while Node 1 ($\\text{len} = -1$, imaginary root) produces length-$1$ single-character palindromes $c$ ($-1 + 2 = 1$) and all odd-length palindromes, with $S[i - 1 - (-1)] = S[i]$ automatically succeeding at Node 1",
      "Node 1 stores lowercase letters and Node 2 stores uppercase letters",
      "Node 1 is for prefixes and Node 2 is for suffixes",
      "Node 1 is a dummy sentinel that is never visited during `add_char`"
    ],
    "answer": 0,
    "explanation": "With $\\text{len}[1] = -1$, the boundary condition `s[pos - 1 - nodes[u].len] == s[pos]` at $u = 1$ evaluates `s[pos - 1 - (-1)] == s[pos]`, i.e., `s[pos] == s[pos]`, which is ALWAYS true! And $\\text{len}[1] + 2 = -1 + 2 = 1$, cleanly generating single-character palindromes without special-casing odd vs. even transitions."
  },
  {
    "id": "q10-man-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "O(1) Palindrome Substring Check via Manacher Radii",
    "prompt": "You have computed Manacher's radius array $p[0..2N]$ on the interleaved string $T = \\texttt{\"\\#\"} S[0] \\texttt{\"\\#\"} S[1] \\texttt{\"\\#\"} \\dots S[N-1] \\texttt{\"\\#\"}$ (without `^` and `$` sentinels, so $S[k]$ sits at $T[2k + 1]$).",
    "question": "Given an arbitrary substring query $S[l..r]$ ($0 \\le l \\le r < N$) of length $L = r - l + 1$, what is the exact $O(1)$ condition in terms of $p$ that tests whether $S[l..r]$ is a palindrome?",
    "options": [
      "$p[l + r + 1] \\ge r - l + 1$",
      "$p[2l + 1] + p[2r + 1] \\ge r - l + 1$",
      "$p[(l + r) / 2] == r - l$",
      "$p[2r + 1] - p[2l + 1] == 0$"
    ],
    "answer": 0,
    "explanation": "In $T = \\texttt{\"\\#\"} S[0] \\texttt{\"\\#\"} S[1] \\dots$, character $S[l]$ is at index $2l + 1$ and $S[r]$ is at index $2r + 1$. Their midpoint in $T$ is at index $\\frac{(2l + 1) + (2r + 1)}{2} = l + r + 1$ (which is an odd index if $r - l + 1$ is odd, or an even `'#'` index if $r - l + 1$ is even). Since $p[c]$ equals the exact length in $S$ of the longest palindrome centered at $c$, $S[l..r]$ is a palindrome iff $p[l + r + 1] \\ge r - l + 1$."
  }
];

window.QUESTION_BANK["case-ripgrep-teddy-simd"] = [
  {
    "id": "q10-rg-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Role of Literal Extraction in `ripgrep`",
    "prompt": "When searching a codebase for a regular expression like `\"fn\\s+(?:parse|eval)_[a-z0-9_]+\"`, `ripgrep` does not run its regex state machine over every byte of the input files.",
    "question": "How does `ripgrep` use the regex AST to accelerate this search?",
    "options": [
      "It extracts required inner/prefix literal substrings (`{\"parse_\", \"eval_\"}`) from the AST, scans the file at memory-bandwidth speed with a SIMD multi-pattern prefilter (Teddy), and runs the full regex automaton only on lines where a candidate literal matches",
      "It compiles the regex into x86 machine code using LLVM JIT before scanning",
      "It builds a suffix tree of the entire filesystem in RAM first",
      "It splits the regex by whitespace and runs `std::regex` on each word"
    ],
    "answer": 0,
    "explanation": "Even when the prefix of the regex has variable whitespace (`fn\\s+`), `ripgrep`'s literal extractor identifies required internal literals (`\"parse_\"` and `\"eval_\"`). Scanning for two 6-byte literals via SIMD Teddy rejects $>99.9\\%$ of lines at $>10\\text{ GB/s}$, invoking the regex automaton only on candidate hits."
  },
  {
    "id": "q10-rg-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "SIMD Teddy Nibble Decomposition (`vpshufb`)",
    "prompt": "The AVX2 instruction `_mm256_shuffle_epi8(lut, idx)` (`vpshufb`) uses the lower 4 bits ($0..15$) of each byte in `idx` to look up a byte from a 16-entry table `lut` in parallel across all 32 byte lanes.",
    "question": "Why does SIMD Teddy split each input text byte $b$ into a low nibble `b & 0x0F` and a high nibble `(b >> 4) & 0x0F` and take the bitwise AND of two `vpshufb` lookups?",
    "options": [
      "Because a full byte has $2^8 = 256$ possible values (which cannot fit in a 16-entry register LUT), whereas each 4-bit nibble has only $2^4 = 16$ values; intersecting the 8-bit bucket mask of the low nibble with the 8-bit bucket mask of the high nibble identifies which pattern buckets match the full 8-bit byte",
      "Because x86 registers can only store 4-bit integers",
      "To convert UTF-8 characters into ASCII",
      "To compute the CRC32 checksum of each 32-byte chunk"
    ],
    "answer": 0,
    "explanation": "A 128-bit lane in AVX2 holds 16 bytes, so `vpshufb` can only index a 16-entry table ($4$ index bits). By encoding which of the 8 pattern buckets allow low nibble $n_{\\text{lo}} \\in [0, 15]$ in `lut_lo` and which allow high nibble $n_{\\text{hi}} \\in [0, 15]$ in `lut_hi`, `vpshufb(lut_lo, b_lo) & vpshufb(lut_hi, b_hi)` acts as a 256-entry parallel lookup across 32 bytes in just two shuffles and an AND."
  },
  {
    "id": "q10-rg-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Multi-Pattern Bucket False Positives in Teddy",
    "prompt": "Suppose Bucket 0 in a 1-byte SIMD Teddy filter contains both `'A'` (`0x41`: hi=`0x4`, lo=`0x1`) and `'r'` (`0x72`: hi=`0x7`, lo=`0x2`) because 16 patterns were hashed into 8 buckets.",
    "question": "Which unrelated text byte $c$ will cause a false-positive hit in Bucket 0 during the nibble intersection `lut_lo[c & 0x0F] & lut_hi[c >> 4]`?",
    "options": [
      "`'B'` (`0x42`: hi=`0x4` from `'A'`, lo=`0x2` from `'r'`) and `'q'` (`0x71`: hi=`0x7` from `'r'`, lo=`0x1` from `'A'`), because both nibbles have Bucket 0's bit set",
      "Every ASCII character between `'A'` and `'r'`",
      "No false positives can ever occur when intersecting low and high nibbles",
      "Only null bytes `0x00`"
    ],
    "answer": 0,
    "explanation": "When a single bucket represents multiple characters $\\{(\\text{hi}_1, \\text{lo}_1), (\\text{hi}_2, \\text{lo}_2)\\}$, the bucket bit is set for $\\{\\text{hi}_1, \\text{hi}_2\\}$ in `lut_hi` and $\\{\\text{lo}_1, \\text{lo}_2\\}$ in `lut_lo`. Their Cartesian product $\\{\\text{hi}_1, \\text{hi}_2\\} \\times \\{\\text{lo}_1, \\text{lo}_2\\}$ matches the cross-combinations `0x42` (`'B'`) and `0x71` (`'q'`). Using a 2-byte or 3-byte Teddy fingerprint and grouping patterns with shared prefixes into the same bucket drastically reduces these cross-nibble false positives."
  },
  {
    "id": "q10-rg-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Prefilter Degradation & Dynamic Bailout",
    "prompt": "Suppose a regex prefilter extracts the literal `\"the\"` when searching an English novel, or `\"0\"` when searching a hex dump.",
    "question": "Why can enabling a SIMD prefilter on a high-frequency literal make overall search SLOWER than running a pure DFA directly, and how do production engines mitigate this?",
    "options": [
      "Every prefilter hit stops the SIMD loop, computes match offsets, and transitions into the DFA verifier, which immediately fails and re-enters the prefilter a few bytes later; engines mitigate this by scoring literal rarity via background byte-frequency tables and disabling the prefilter at runtime if its false-positive rate exceeds a threshold",
      "SIMD instructions reduce the CPU clock frequency by 90% on modern processors",
      "High-frequency literals cause the Aho-Corasick trie to exceed RAM",
      "Prefilters produce false negatives when literals occur too close together"
    ],
    "answer": 0,
    "explanation": "Entering and exiting the SIMD prefilter every few bytes incurs function-call, state-synchronization, and branch-misprediction overhead that exceeds the cost of a simple 1-lookup-per-byte DFA loop. Both `ripgrep` (`regex-automata`) and Rust's `memchr` weight candidate literals using an empirical byte-frequency heuristic and track runtime effectiveness to bail out of ineffective prefilters."
  }
];

window.QUESTION_BANK["build-aho-corasick-scanner"] = [
  {
    "id": "q10-build-ac-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "State Preservation Across Streaming Chunk Boundaries",
    "prompt": "A streaming Aho-Corasick scanner processes a 10 GB network stream in 64 KB chunks $C_1, C_2, \\dots$. Pattern $P_0 = \\texttt{\"DROP TABLE\"}$ starts 4 bytes before the end of $C_1$ (`\"...DROP\"`) and finishes 6 bytes into $C_2$ (`\" TABLE...\"`).",
    "question": "What state must `ScannerCursor` carry from the end of `scan_chunk(C_1)` into the start of `scan_chunk(C_2)` so that $P_0$ is detected with its exact global byte interval `[start_offset, end_offset)` without copying bytes between chunks?",
    "options": [
      "Only two integers: the current DFA state ID `int32_t state` (which is at the node for `\"DROP\"` after $C_1$) and the cumulative byte counter `uint64_t bytes_seen` (from which `start_offset = pos - pat_len[pid]` is computed when `\"DROP TABLE\"` completes in $C_2$)",
      "The last $\\max |P_i|$ raw bytes of $C_1$ must be prepended to $C_2$",
      "A stack of all previously visited DFA states in $C_1$",
      "The entire BFS queue from `freeze()`"
    ],
    "answer": 0,
    "explanation": "Because the Aho-Corasick completed DFA is a Markovian state machine where state $u$ already encodes the longest matching prefix of $\\mathcal{P}$ that is a suffix of the stream seen so far, carrying `cursor.state` and `cursor.bytes_seen` across chunks requires zero byte buffering and zero re-scanning."
  },
  {
    "id": "q10-build-ac-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Intrusive Pattern Linked List for Duplicate & Co-Terminal Patterns",
    "prompt": "In our `StreamingAhoCorasick` implementation, two different security rules register the exact same pattern string (e.g., Rule 10 and Rule 42 both add `\"eval(\"`). Instead of storing `std::vector<int32_t> pat_ids` in every `Node`, each `Node` stores a single `int32_t first_pat = -1` alongside a flat array `next_pat_[K]`.",
    "question": "When `add_pattern(\"eval(\")` is called for `pid = 42` and lands on state `u` where `nodes_[u].first_pat` is already `10`, how does the intrusive list record both rules in $O(1)$ space?",
    "options": [
      "`next_pat_.push_back(nodes_[u].first_pat)` sets `next_pat_[42] = 10`, and `nodes_[u].first_pat = 42` makes `42` the new head; during match emission, `for (int pid = nodes_[term].first_pat; pid != -1; pid = next_pat_[pid])` emits both `42` and `10`",
      "It overwrites `nodes_[u].first_pat = 42` and discards Rule 10",
      "It creates a duplicate Trie node $u'$ and links $u \\to u'$ via `exit_link`",
      "It sorts `next_pat_` after every insertion"
    ],
    "answer": 0,
    "explanation": "Each pattern ID `pid` belongs to exactly one terminal node `u` in the Trie. Therefore, a single flat array `next_pat_[pid]` of size $K$ (initialized during `add_pattern`) chains all patterns ending at the same node `u` into a singly linked list headed by `nodes_[u].first_pat`, eliminating all per-node heap allocations."
  },
  {
    "id": "q10-build-ac-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Signed `char` Indexing Bug on Binary / UTF-8 Streams",
    "prompt": "Suppose a developer writes `u = nodes_[u].go[chunk[i]];` in C++ where `chunk` is a `std::string_view` (`const char*`), and tests the scanner on a UTF-8 file containing `'é'` (`0xC3 0xA9`).",
    "question": "What happens on x86_64 / ARM64 macOS and Linux where `char` is a signed 8-bit integer (`-128..127`)?",
    "options": [
      "Bytes `0xC3` and `0xA9` have their sign bit set and convert to negative integers `-61` and `-87`, indexing `nodes_[u].go[-61]` out of bounds before the start of the `go` array and reading corrupted state IDs",
      "The compiler automatically masks `chunk[i] & 0xFF` for `std::array` indexing",
      "`std::string_view` throws `std::out_of_range` on non-ASCII bytes",
      "The state machine simply resets `u = 0` on negative indices"
    ],
    "answer": 0,
    "explanation": "`std::array<int32_t, 256>::operator[]` performs unchecked pointer arithmetic `*(data() + idx)`. Passing a negative `char` value (`-128..-1`) reads memory located up to $128 \\times 4 = 512$ bytes BEFORE the start of `nodes_[u].go`, causing immediate undefined behavior and wild state jumps. Always cast to `unsigned char` or `uint8_t`."
  },
  {
    "id": "q10-build-ac-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Memory Optimization for Large-Dictionary Aho-Corasick (`NFA-to-DFA` Hybrid)",
    "prompt": "When compiling $K = 100{,}000$ patterns of total length $M = 2 \\times 10^6$ bytes over the full 256-byte alphabet, a naive completed DFA table `int32_t go[256]` per node requires $2 \\times 10^6 \\times 1024\\text{ B} \\approx 2\\text{ GB}$ of RAM, blowing out the CPU's L3 cache.",
    "question": "Which hybrid layout (used in `BurntSushi/aho-corasick` and Snort/Hyperscan) drastically shrinks memory while keeping 99% of state transitions in $O(1)$ L1/L2 cache?",
    "options": [
      "Materialize the full 256-entry `go[256]` table ONLY for shallow states near the root (e.g., depth $\\le 2$ or the hottest 256 states where the automaton spends >95% of its time), and store deep, rarely visited states as compact sorted `(byte, state_id)` edge lists with `fail[u]` fallback",
      "Hash all $2 \\times 10^6$ states into a single 256-entry array using modulo 256",
      "Store `go[256]` on disk and `mmap` each transition over the network",
      "Truncate all patterns to length 4 during compilation"
    ],
    "answer": 0,
    "explanation": "In almost any real workload, the Aho-Corasick automaton spends $>95\\%$ of its time at depth $0$, $1$, or $2$. Materializing the dense `int32_t go[256]` table only for the root and shallowest layers (fitting in a few hundred kilobytes of L2 cache) while keeping deep states in a sparse representation gives near-DFA throughput at a fraction of the memory footprint."
  }
];
