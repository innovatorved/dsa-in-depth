/**
 * Module 03 Question Bank: Linked Structures, Stacks, Queues & Eviction
 * 10 Units × 4 Questions = 40 Questions
 * Note: answer is always index 0 before runtime shuffle; options[0] is the canonical correct answer.
 */
window.QUESTION_BANK = window.QUESTION_BANK || {};

Object.assign(window.QUESTION_BANK, {
  "singly-doubly-intrusive-lists": [
    {
      id: "q03-singly-doubly-intrusive-1",
      type: "mcq",
      difficulty: "recall",
      title: "Intrusive List Container Recovery",
      prompt: "In the Linux kernel's intrusive doubly linked list (`struct list_head`), how does the `container_of(ptr, type, member)` macro recover the address of the enclosing struct from a pointer to the embedded list node?",
      question: "How does `container_of` compute the parent structure's address in $O(1)$ without runtime metadata?",
      options: [
        "It subtracts the compile-time byte offset (`offsetof(type, member)`) from the `list_head` pointer address.",
        "It dereferences a hidden parent pointer stored inside `struct list_head` alongside `next` and `prev`.",
        "It performs a binary search on the slab allocator's object directory to find the matching allocation base.",
        "It masks the low 12 bits of the pointer to align down to the nearest 4 KB virtual page boundary."
      ],
      answer: 0,
      explanation: "Because the layout of `type` is fixed at compile time, `offsetof(type, member)` is a constant integer. Subtracting that constant from the char-cast pointer `ptr` yields the exact starting address of the enclosing structure in a single integer subtraction."
    },
    {
      id: "q03-singly-doubly-intrusive-2",
      type: "mcq",
      difficulty: "apply",
      title: "Circular Sentinel Branch Elimination",
      prompt: "A doubly linked list initialized with a circular dummy sentinel head sets `sentinel.next = &sentinel` and `sentinel.prev = &sentinel`. Why does this eliminate conditional branches during node insertion and deletion?",
      question: "What invariant does the circular dummy sentinel preserve across all list states?",
      options: [
        "Every node in the ring (including when the list is logically empty) always has non-NULL `next` and `prev` pointers, so `node->prev->next = node->next` never dereferences NULL.",
        "It forces all nodes to be allocated on consecutive 64-byte cache lines in physical RAM.",
        "It prevents concurrent readers from observing torn 64-bit pointer writes without atomic instructions.",
        "It reduces the memory footprint of each node from two pointers (`next`, `prev`) to a single XOR-encoded pointer."
      ],
      answer: 0,
      explanation: "In a standard NULL-terminated doubly linked list, unlinking or inserting at the head or tail requires checking `if (node->prev != NULL)` and `if (node->next != NULL)`. A circular sentinel acts as a permanent neighbor for both the first and last elements, turning every splice into uniform pointer assignments."
    },
    {
      id: "q03-singly-doubly-intrusive-3",
      type: "mcq",
      difficulty: "apply",
      title: "Allocation and Cache Overhead of Non-Intrusive Lists",
      prompt: "Consider `std::list<uint64_t>` in C++ on a 64-bit system using `ptmalloc2` (which adds a 16-byte allocator header per `malloc` call). What is the total memory consumed per 8-byte integer stored, and why does traversal stall the CPU?",
      question: "How much memory is used per 8-byte payload in a non-intrusive doubly linked list with a 16-byte allocator header?",
      options: [
        "40 bytes per node (16B allocator header + 8B `prev` + 8B `next` + 8B payload), causing dependent pointer-chase loads that defeat hardware L1/L2 prefetchers.",
        "24 bytes per node, because the allocator header is stored in kernel space outside the process virtual address space.",
        "16 bytes per node, because `prev` and `next` are compressed into 32-bit relative offsets on x86-64.",
        "64 bytes per node, because the C++ standard mandates that every `std::list` node occupy a full L1 cache line."
      ],
      answer: 0,
      explanation: "Each `std::list` node contains two 8-byte pointers (`prev`, `next`) plus the 8-byte `uint64_t` payload (24 bytes), plus the 16-byte heap allocator metadata header = 40 bytes (only 20% payload efficiency). Furthermore, obtaining the address of node $i+1$ requires waiting for the load of node $i$ to complete (~4–200 cycles per hop)."
    },
    {
      id: "q03-singly-doubly-intrusive-4",
      type: "mcq",
      difficulty: "staff",
      title: "RCU-Safe List Deletion (`list_del_rcu`)",
      prompt: "In the Linux kernel, `list_del(entry)` overwrites `entry->next = LIST_POISON1` and `entry->prev = LIST_POISON2` after unlinking. However, `list_del_rcu(entry)` leaves `entry->next` intact while poisoning `entry->prev`. Why is leaving `entry->next` unmodified mandatory for Read-Copy-Update (RCU) readers?",
      question: "Why must `list_del_rcu` preserve the deleted node's `next` pointer until the RCU grace period expires?",
      options: [
        "Lockless RCU readers concurrently traversing the list may currently hold a pointer to `entry` in a CPU register; they need `entry->next` to remain valid so they can advance back into the live list.",
        "RCU readers traverse the list backward using `entry->prev`, so `entry->next` is kept as a checksum for ABA detection.",
        "Writing to `entry->next` would invalidate the L1 instruction cache of all cores executing the RCU read-side critical section.",
        "The slab allocator uses `entry->next` to link the freed object into its per-CPU freelist before the RCU grace period ends."
      ],
      answer: 0,
      explanation: "An RCU reader holds no locks and might be preempted or delayed while pointing to `entry`. When the writer unlinks `entry` via `WRITE_ONCE(entry->prev->next, entry->next)`, new readers skip `entry`, but an existing reader on `entry` will still read `entry->next` to step forward. Poisoning `entry->next` immediately would cause that reader to fault."
    }
  ],

  "floyd-brent-cycle-detection": [
    {
      id: "q03-floyd-brent-1",
      type: "mcq",
      difficulty: "recall",
      title: "Floyd's Cycle Entry Mathematical Identity",
      prompt: "In Floyd's Tortoise and Hare algorithm, let $\\mu$ be the distance from the list head to the start of the cycle, $\\lambda$ be the cycle length, and $k$ be the distance from the cycle start to the meeting point of `slow` and `fast`. Why does resetting one pointer to `head` and advancing both by 1 step per iteration guarantee they meet at the cycle entry?",
      question: "Which modular arithmetic relation derived from $2 d_{\\text{slow}} = d_{\\text{fast}}$ proves Phase 2 of Floyd's algorithm?",
      options: [
        "Because $\\mu + k = c \\cdot \\lambda$ for some integer $c \\ge 1$, the remaining distance around the cycle from the meeting point to the cycle entry ($\\lambda - k$) is congruent to $\\mu \\pmod{\\lambda}$.",
        "Because $\\mu$ is always an exact multiple of $\\lambda$, the meeting point $k$ is always $0$ (the cycle entry itself).",
        "Because the fast pointer always completes exactly one full cycle ($c = 1$) before meeting the slow pointer, $\\mu = \\lambda - 2k$.",
        "Because $\\gcd(\\mu, \\lambda) = 1$ for any functional graph, advancing by 1 step visits all nodes via Bézout's identity."
      ],
      answer: 0,
      explanation: "When `slow` has taken $d = \\mu + k$ steps and `fast` has taken $2d$ steps, their difference $d = c\\lambda$ is an exact multiple of the cycle length. Thus $\\mu + k = c\\lambda \\implies \\mu = (c-1)\\lambda + (\\lambda - k)$. Advancing $\\mu$ steps from `head` reaches the entry; advancing $\\mu$ steps from offset $k$ inside the cycle wraps $(c-1)$ times and advances $\\lambda - k$ steps, landing on offset $0$ (the cycle entry)."
    },
    {
      id: "q03-floyd-brent-2",
      type: "mcq",
      difficulty: "apply",
      title: "Brent's Teleporting Turtle Advantage",
      prompt: "Compare Floyd's Tortoise and Hare against Brent's cycle detection algorithm on a linked list where each `node = node->next` step incurs a dependent L3/DRAM cache miss. Why is Brent's algorithm ~36% faster in practice?",
      question: "How does Brent's algorithm reduce the total number of pointer dereferences compared to Floyd's?",
      options: [
        "Brent's algorithm keeps the stationary pointer (`tortoise`) in a CPU register and only advances a single moving pointer (`hare`), teleporting `tortoise = hare` at powers of two ($2^i$) instead of chasing two pointers every iteration.",
        "Brent's algorithm steps `hare` by 3 nodes at a time, cutting the loop iteration count by one third.",
        "Brent's algorithm hashes visited node addresses into a Thread-Local Bloom Filter to detect cycles in $\\mu + 1$ steps.",
        "Brent's algorithm reverses `next` pointers in-place during traversal so it only needs one pointer."
      ],
      answer: 0,
      explanation: "In Floyd's algorithm, every loop iteration performs 3 pointer dereferences (2 for `fast`, 1 for `slow`). In Brent's algorithm, only `hare` moves (1 dereference per step), and `tortoise` is updated via register assignment (`tortoise = hare`) whenever the step count reaches $2^i$. Additionally, Brent's algorithm finds the exact cycle length $\\lambda$ directly during Phase 1."
    },
    {
      id: "q03-floyd-brent-3",
      type: "mcq",
      difficulty: "apply",
      title: "Meeting Position Computation",
      prompt: "A corrupted singly linked list has a non-cyclic tail of length $\\mu = 5$ nodes (indices $0, 1, 2, 3, 4$) leading into a cycle of length $\\lambda = 7$ nodes (cycle offsets $0$ through $6$, where index $5$ is cycle offset $0$). Both `slow` and `fast` start at index $0$. At which cycle offset $k \\in [0, 6]$ do `slow` and `fast` first meet?",
      question: "What is the cycle offset $k$ where `slow` and `fast` first collide for $\\mu = 5, \\lambda = 7$?",
      options: [
        "$k = 2$ (after $7$ total steps, where $\\mu + k = 5 + 2 = 7$, which is a multiple of $\\lambda = 7$).",
        "$k = 0$ (after $5$ total steps, right as `slow` enters the cycle).",
        "$k = 5$ (after $10$ total steps).",
        "$k = 4$ (after $9$ total steps)."
      ],
      answer: 0,
      explanation: "The collision occurs at the smallest non-negative integer $k$ such that $\\mu + k$ is a non-zero multiple of $\\lambda$. With $\\mu = 5$ and $\\lambda = 7$, the smallest multiple of $7$ that is $\\ge 5$ is $7$ itself, giving $5 + k = 7 \\implies k = 2$."
    },
    {
      id: "q03-floyd-brent-4",
      type: "mcq",
      difficulty: "staff",
      title: "Pollard's Rho and Functional Graph Equivalence",
      prompt: "You are given an immutable read-only array `nums` of length $n + 1$ containing integers in $[1, n]$. Treating `f(x) = nums[x]` as a functional graph starting from index $0$, why is index $0$ guaranteed to be outside any cycle, and what happens if you instead start Floyd's algorithm from an index whose value can appear in `nums`?",
      question: "Why must Floyd's duplicate-finding algorithm start at index `0` when values are in `[1, n]`?",
      options: [
        "Index `0` has in-degree $0$ because no element in `nums` has value `0`; starting inside a cycle ($\\mu = 0$) makes Phase 2 ineffective because there is no cycle entry node with in-degree $\\ge 2$ reachable from that component.",
        "Starting at index `0` ensures the cycle length $\\lambda$ is always prime, preventing `fast` from jumping over `slow`.",
        "Index `0` is guaranteed to hold the duplicate value itself.",
        "The hardware prefetcher only tracks array accesses that begin at index `0`."
      ],
      answer: 0,
      explanation: "A duplicate value $v$ means two distinct indices $i \\ne j$ satisfy `nums[i] == nums[j] == v`, giving node $v$ an in-degree $\\ge 2$ (the entry to a rho-shaped cycle). Because values are in $[1, n]$, node $0$ has in-degree $0$ and cannot be part of a cycle ($\\mu \\ge 1$), guaranteeing a path that enters a cycle at the duplicate value $v$."
    }
  ],

  "unrolled-linked-lists-ropes": [
    {
      id: "q03-unrolled-ropes-1",
      type: "mcq",
      difficulty: "recall",
      title: "Unrolled Linked List Block Capacity Sizing",
      prompt: "You are designing an unrolled linked list on x86-64 (64-byte cache lines) to store `uint64_t` elements. Each node has an 8-byte `next` pointer, a 4-byte `count`, and a 4-byte flags field (16 bytes of metadata total). How many `uint64_t` elements fit in a single 64-byte cache-line-sized node?",
      question: "What is the array capacity $B$ of `uint64_t` elements so the entire unrolled node fits in one 64-byte cache line?",
      options: [
        "$B = 6$ elements ($16\\text{ bytes metadata} + 6 \\times 8\\text{ bytes} = 64\\text{ bytes}$).",
        "$B = 8$ elements ($8 \\times 8\\text{ bytes} = 64\\text{ bytes}$, ignoring metadata).",
        "$B = 4$ elements ($16\\text{ bytes metadata} + 4 \\times 8\\text{ bytes} = 48\\text{ bytes}$).",
        "$B = 16$ elements, because x86-64 L1 cache lines are 128 bytes wide."
      ],
      answer: 0,
      explanation: "A single L1/L2/L3 cache line on x86-64 is 64 bytes. Subtracting the 16 bytes of node header (`next` pointer + `count` + `flags`) leaves $64 - 16 = 48$ bytes, which holds exactly $48 / 8 = 6$ `uint64_t` elements per cache line."
    },
    {
      id: "q03-unrolled-ropes-2",
      type: "mcq",
      difficulty: "apply",
      title: "Rope Subtree Weight Invariant",
      prompt: "In a Rope data structure representing a string, an internal node stores a `weight` integer alongside `left` and `right` child pointers. What does `node.weight` represent, and how does `charAt(node, idx)` navigate when `idx >= node.weight`?",
      question: "How is `node.weight` defined and used during Rope index lookup?",
      options: [
        "`node.weight` is the total character length of the `left` subtree; if `idx >= node.weight`, lookup descends into `node.right` with adjusted index `idx - node.weight`.",
        "`node.weight` is the total character length of both `left` and `right` subtrees combined; lookup always divides `idx` by 2.",
        "`node.weight` is the height of the AVL subtree rooted at `node`; lookup compares `idx` against $2^{\\text{weight}}$.",
        "`node.weight` is the UTF-8 byte offset of the node's string from the beginning of the file buffer."
      ],
      answer: 0,
      explanation: "Storing only the `left` subtree's total character count in `node.weight` allows a right-spine insertion or concatenation to avoid updating ancestors along the left subtrees, and allows $O(\\log N)$ rank queries: if `idx < node.weight`, go left with `idx`; otherwise go right with `idx - node.weight`."
    },
    {
      id: "q03-unrolled-ropes-3",
      type: "mcq",
      difficulty: "apply",
      title: "Unrolled List Half-Full Invariant",
      prompt: "Why do production unrolled linked lists enforce the B-tree-like invariant that every non-tail block contains at least $\\lceil B/2 \\rceil$ elements (merging or borrowing from a neighbor on deletion)?",
      question: "What problem arises if an unrolled linked list does not enforce the $\\ge \\lceil B/2 \\rceil$ occupancy invariant on deletion?",
      options: [
        "Adversarial insert/delete sequences can leave $N$ blocks with only 1 element each, degrading memory overhead to $O(N \\cdot B)$ and traversal cache misses back to $O(N)$ instead of $O(N/B)$.",
        "Hardware SIMD instructions (`AVX2`) will throw a `#GP` fault if a block is less than half full.",
        "The `next` pointers between blocks can form a cycle when occupancy drops below 50%.",
        "Splitting a full block during insertion becomes $O(N)$ instead of $O(B)$."
      ],
      answer: 0,
      explanation: "Without the $\\ge \\lceil B/2 \\rceil$ minimum occupancy invariant, inserting $N$ elements and then deleting $B-1$ elements from every block leaves $N/B$ blocks containing 1 element each. Repeating this creates $N$ blocks of 1 element, destroying both space efficiency and cache locality."
    },
    {
      id: "q03-unrolled-ropes-4",
      type: "mcq",
      difficulty: "staff",
      title: "Piece Table B-Tree vs Classic Rope in Text Editors",
      prompt: "Modern text editors like VS Code (after its 2018 buffer rewrite) and Zed use a Piece Tree (a balanced B-tree/Red-Black tree over an append-only buffer table with line-break counts in each node) rather than a classic heap-allocated pointer Rope of small string fragments. Why?",
      question: "What primary architectural advantage does a B-tree Piece Table hold over a classic node-per-substring Rope?",
      options: [
        "It eliminates millions of small heap allocations on file open by referencing two contiguous buffers (original read-only mmap + append-only edit buffer) and aggregates both UTF-16 code units and `\\n` line counts per tree node for $O(\\log P)$ offset-and-line lookup.",
        "It allows $O(1)$ worst-case character insertion without rebalancing any tree nodes.",
        "It stores the entire file in a single contiguous `std::vector<char>` that shifts elements on every keystroke.",
        "It avoids storing any tree metadata by scanning the original file from byte 0 on every cursor movement."
      ],
      answer: 0,
      explanation: "A classic Rope splits strings into many small heap-allocated leaf buffers, causing high memory overhead and GC/allocator pressure when opening large files. A Piece Tree keeps the original file in a single read-only buffer, appends edits to an add-buffer, and stores compact `(bufferIndex, start, length, lineFeedCount)` descriptors in a cache-friendly tree."
    }
  ],

  "skip-lists-probabilistic-indexing": [
    {
      id: "q03-skiplist-1",
      type: "mcq",
      difficulty: "recall",
      title: "Skip List Expected Pointer Overhead",
      prompt: "In Pugh's probabilistic skip list where each node at level $k$ is promoted to level $k+1$ with probability $p$, what is the expected number of forward pointers per node across the entire skip list?",
      question: "What is the expected tower height $\\mathbb{E}[H]$ per node as a function of the promotion probability $p \\in (0, 1)$?",
      options: [
        "$\\frac{1}{1 - p}$ (for example, $2$ pointers per node when $p = 1/2$, and $1.333$ pointers per node when $p = 1/4$).",
        "$\\frac{1}{p}$ (for example, $4$ pointers per node when $p = 1/4$).",
        "$\\log_{1/p}(N)$, because every node's expected height grows logarithmically with the list size $N$.",
        "$2p$, because each level halves the number of pointers."
      ],
      answer: 0,
      explanation: "Every node has at least 1 level-0 pointer, has a level-1 pointer with probability $p$, level-2 with $p^2$, etc. By the geometric series, $\\mathbb{E}[H] = \\sum_{k=0}^{\\infty} p^k = \\frac{1}{1 - p}$. When $p = 1/4$ (used by Redis), each node averages only $4/3 \\approx 1.33$ forward pointers."
    },
    {
      id: "q03-skiplist-2",
      type: "mcq",
      difficulty: "apply",
      title: "Skip List Insertion `update[]` Array",
      prompt: "During `insert(key)` in a skip list of current maximum level $L$, the search phase populates an array `update[0..L-1]` before allocating the new node. Which exact node is stored in `update[i]`?",
      question: "What does `update[i]` hold at the end of the top-down search phase of `insert(key)`?",
      options: [
        "The rightmost node at level $i$ whose key is strictly less than `key` (the predecessor at level $i$ where the new node's level-$i$ pointer must be spliced).",
        "The leftmost node at level $i$ whose key is greater than or equal to `key`.",
        "The head sentinel pointer shifted by $i$ bytes.",
        "The parent node at level $i+1$ directly above the insertion point."
      ],
      answer: 0,
      explanation: "At each level $i$ from top to bottom, the search advances `curr` while `curr->forward[i]->key < key`. When the inner loop terminates, `curr` is the immediate predecessor of `key` at level $i$. Saving `update[i] = curr` lets us splice `newNode->forward[i] = update[i]->forward[i]; update[i]->forward[i] = newNode;` for all $0 \\le i < \\text{newHeight}$."
    },
    {
      id: "q03-skiplist-3",
      type: "mcq",
      difficulty: "apply",
      title: "Bottom-Up Splice Order in Concurrent Skip Lists",
      prompt: "In a lock-free concurrent skip list (such as RocksDB's `InlineSkipList` or Java's `ConcurrentSkipListMap`), when inserting a new node of height $h$, why MUST the forward pointers be spliced from bottom to top (level $0$ first, up to level $h-1$) rather than top to bottom?",
      question: "What correctness violation occurs if a concurrent skip list links level $h-1$ before level $0$?",
      options: [
        "A concurrent reader could encounter the new node at an upper express lane (level $h-1$) and drop down to level $0$ before level $0$ is linked, either missing subsequent keys or following an uninitialized pointer.",
        "Splicing from top to bottom causes a deadlock between CAS instructions on adjacent levels.",
        "Upper-level pointers are stored in read-only memory until level $0$ is linked.",
        "Bottom-to-top linking reduces the number of `compare_exchange` operations from $h$ to $1$."
      ],
      answer: 0,
      explanation: "Level $0$ defines linearizability (membership in the set). Once a node is visible at level $i$, any search that lands on it at level $i$ may immediately descend to levels $i-1, \\dots, 0$. Therefore, all lower levels $0 \\dots i-1$ must already be valid and linked before level $i$ is published."
    },
    {
      id: "q03-skiplist-4",
      type: "mcq",
      difficulty: "staff",
      title: "Flexible Array Member Single-Allocation Layout",
      prompt: "A naive skip list implementation defines `struct Node { int key; Node** forward; }` and performs two `malloc` calls per node (one for `Node`, one for the `forward` array). How do production C/C++ engines eliminate the second allocation and the extra pointer indirection?",
      question: "Which memory layout technique merges the skip list node and its variable-height `forward[]` tower into one contiguous block?",
      options: [
        "Declaring `Node* forward[1]` (or C99 flexible array member `Node* forward[]`) at the end of `struct Node` and allocating `sizeof(Node) + (height - 1) * sizeof(Node*)` bytes in a single arena/heap call.",
        "Always allocating the maximum possible height (`MAX_LEVEL = 32`) inside every node regardless of the random height.",
        "Storing all `forward` pointers in an external `std::unordered_map<Node*, std::vector<Node*>>`.",
        "Packing all 32 64-bit pointers into a single 64-bit integer using XOR compression."
      ],
      answer: 0,
      explanation: "By placing a flexible array member `Node* forward[]` at the tail of `struct Node` and sizing the single allocation to match the randomly chosen tower height $h$, `node->forward[i]` is accessed as a direct fixed offset `*(node + offset + i * 8)` with zero extra pointer indirection and inside the same cache line as `node->key`."
    }
  ],

  "stacks-expression-evaluation": [
    {
      id: "q03-stacks-expr-1",
      type: "mcq",
      difficulty: "recall",
      title: "Shunting-Yard Right-Associative Precedence Rule",
      prompt: "In Dijkstra's Shunting-Yard algorithm (or Pratt parsing), suppose the incoming operator is `^` (exponentiation, precedence 3, right-associative) and the operator at the top of the operator stack is also `^` (precedence 3). Should the stack top be popped before pushing the incoming `^`?",
      question: "How does Shunting-Yard handle an incoming right-associative operator when the stack top has equal precedence?",
      options: [
        "Do NOT pop the stack top; right-associative operators only pop stack operators with strictly higher precedence ($\\text{prec}(\\text{top}) > \\text{prec}(\\text{incoming})$), ensuring `2 ^ 3 ^ 2` evaluates as `2 ^ (3 ^ 2)`.",
        "Pop the stack top immediately, just like left-associative operators (`+`, `-`, `*`, `/`), so `2 ^ 3 ^ 2` evaluates as `(2 ^ 3) ^ 2`.",
        "Discard both operators and push a binary power token.",
        "Reverse the operand stack before pushing the incoming `^`."
      ],
      answer: 0,
      explanation: "For left-associative operators like `a - b - c`, we want `(a - b) - c`, so we pop when $\\text{prec}(\\text{top}) \\ge \\text{prec}(\\text{op})$. For right-associative operators like `a ^ b ^ c`, we want `a ^ (b ^ c)`, so the second `^` must bind first; hence we only pop when $\\text{prec}(\\text{top}) > \\text{prec}(\\text{op})$."
    },
    {
      id: "q03-stacks-expr-2",
      type: "mcq",
      difficulty: "apply",
      title: "x86-64 System V ABI Stack Alignment",
      prompt: "On x86-64 Linux/macOS (System V AMD64 ABI), the hardware `CALL` instruction pushes an 8-byte return address onto the stack, decrementing `%rsp` by 8. Why does a typical function prologue execute `push %rbp` followed by `sub $16, %rsp` (or an odd multiple of 8 bytes total) before calling another function?",
      question: "What hardware requirement does the System V AMD64 ABI enforce on `%rsp` immediately before a `CALL` instruction?",
      options: [
        "`%rsp` must be 16-byte aligned (`%rsp % 16 == 0`) before `CALL` so that SIMD instructions (`movaps`, SSE/AVX) accessing stack-allocated locals do not raise a General Protection Fault (`#GP`).",
        "`%rsp` must be 64-byte aligned before `CALL` to prevent L1 cache line splits on the return address.",
        "`%rsp` must point to the heap segment whenever a recursive call is made.",
        "The `CALL` instruction decrements `%rsp` by 16 bytes, so the prologue must add 8 bytes to compensate."
      ],
      answer: 0,
      explanation: "The System V ABI mandates that `%rsp` is 16-byte aligned immediately prior to a `CALL`. When `CALL` pushes the 8-byte return address, `%rsp` enters the callee misaligned by 8 bytes (`%rsp % 16 == 8`). Pushing the 8-byte `%rbp` restores 16-byte alignment (`%rsp % 16 == 0`), and any further stack allocation must be a multiple of 16 bytes."
    },
    {
      id: "q03-stacks-expr-3",
      type: "mcq",
      difficulty: "apply",
      title: "Tail-Call Elimination (TCO) Requirement",
      prompt: "Consider two implementations of factorial in C/C++: `factA(n) { return n <= 1 ? 1 : n * factA(n - 1); }` and `factB(n, acc) { return n <= 1 ? acc : factB(n - 1, n * acc); }`. At the assembly level, why is `factB` directly eligible for Tail-Call Optimization (`JMP` instead of `CALL`) while `factA` is not (without compiler algebraic rewriting)?",
      question: "What prevents a naive recursive call like `n * factA(n - 1)` from being a true tail call?",
      options: [
        "In `factA`, the caller must retain its stack frame (preserving `n`) to perform the multiplication `n * result` after the recursive call returns, whereas `factB` has zero work remaining after the recursive call.",
        "`factA` uses only one parameter, and the x86-64 ABI requires at least two parameters (`%rdi`, `%rsi`) for `JMP` optimization.",
        "Multiplication instructions cannot be executed before a recursive call in pipelined CPUs.",
        "`factB` allocates its accumulator on the heap rather than in a register."
      ],
      answer: 0,
      explanation: "A call is in tail position only if its return value is immediately returned by the caller with no subsequent operations (and no local variables with non-trivial destructors waiting to run). In `factB`, the current stack frame can be overwritten in place and `CALL` replaced by a direct `JMP` to the start of the function, reducing space from $O(N)$ to $O(1)$."
    },
    {
      id: "q03-stacks-expr-4",
      type: "mcq",
      difficulty: "staff",
      title: "Explicit Iterative DFS vs Recursive Call Stack Footprint",
      prompt: "You need to run Depth-First Search on a directed graph with $2 \\times 10^6$ vertices that may form a single long chain. A recursive `dfs(u)` function crashes with `SIGSEGV` (stack overflow) on a default 8 MB OS thread stack, even though `u` is just a 4-byte `int32_t`. Why does the recursive version overflow 8 MB while an explicit `std::vector<int32_t>` stack uses only 8 MB for the entire $2 \\times 10^6$ vertices?",
      question: "Why does each recursive function call consume 32–64+ bytes of stack space when the logical state is only a 4-byte vertex ID?",
      options: [
        "Every hardware stack frame must store the 8-byte return address, saved frame/callee-saved registers, local iterator state, and padding to maintain 16-byte ABI alignment (minimum 16–48+ bytes per frame), whereas an explicit stack stores only the raw state (`int32_t`).",
        "The OS kernel allocates a separate 4 KB virtual memory page for each individual `CALL` instruction.",
        "C++ compilers automatically copy the entire adjacency list onto the stack on every recursive invocation.",
        "The CPU's Return Stack Buffer (RSB) overflows after 16 entries and spills 1 KB per call to the main stack."
      ],
      answer: 0,
      explanation: "Even the leanest non-tail recursive call pushes an 8-byte return address plus at least 8 bytes for saved registers or 16-byte stack alignment (typically 32–64 bytes when local loop iterators and callee-saved registers are spilled). At 48 bytes/frame, $2 \\times 10^6$ frames require ~96 MB, blowing past the 8 MB `ulimit -s` guard page."
    }
  ],

  "monotonic-stack-next-greater": [
    {
      id: "q03-monotonic-stack-1",
      type: "mcq",
      difficulty: "recall",
      title: "Amortized Complexity of Monotonic Stack",
      prompt: "A monotonic stack algorithm has an outer `for` loop running $N$ times and an inner `while` loop that pops elements from the stack. In the worst case, a single iteration of the outer loop can execute $N - 1$ pops. Why is the total time complexity across all $N$ iterations strictly $O(N)$ rather than $O(N^2)$?",
      question: "Which potential-method argument proves the $O(N)$ amortized bound of a monotonic stack?",
      options: [
        "Each of the $N$ array indices is pushed onto the stack at most once and popped at most once, bounding the total number of `while`-loop pop operations across the entire run to at most $N$.",
        "The inner `while` loop runs in $O(1)$ hardware time because the stack fits inside the CPU's register file.",
        "On average over random permutations, the stack height is $O(\\log N)$, and worst-case inputs are ignored in amortized analysis.",
        "Whenever the `while` loop runs $k$ times, the outer loop skips the next $k$ indices."
      ],
      answer: 0,
      explanation: "Amortized analysis counts the total operations over the entire sequence, not the worst single step multiplied by $N$. Since `pop()` can only remove an element that was previously added by `push()`, and `push()` is called exactly once per outer loop iteration ($N$ times total), the inner `while` loop body executes at most $N$ times in total ($2N$ stack operations overall)."
    },
    {
      id: "q03-monotonic-stack-2",
      type: "mcq",
      difficulty: "apply",
      title: "Two-Sided Boundary Discovery (Largest Rectangle in Histogram)",
      prompt: "In the Largest Rectangle in Histogram problem (monotonic non-decreasing stack), when incoming bar $i$ has height $h[i] < h[\\text{top}]$, we pop index `mid = stack.pop()`. How are the exact left and right boundaries of the widest rectangle of height $h[\\text{mid}]$ determined at the moment `mid` is popped?",
      question: "When `mid` is popped by incoming index `i`, what are the first bar to the right and first bar to the left that are strictly shorter than `h[mid]`?",
      options: [
        "The right boundary is the incoming index `i`, and the left boundary is the new `stack.top()` remaining immediately below `mid` (or `-1` if the stack is now empty), giving width `i - newTop - 1`.",
        "The right boundary is `i + 1`, and the left boundary is `mid - 1`, giving width `i - mid + 1`.",
        "The right boundary is `N - 1`, and the left boundary is `0`, because `mid` is the global minimum.",
        "We must run a binary search on the remaining stack to find the left boundary."
      ],
      answer: 0,
      explanation: "Because the stack is monotonically increasing, the element directly beneath `mid` on the stack (`newTop`) is the last index prior to `mid` with height $< h[\\text{mid}]$ (any bars between `newTop` and `mid` were $\\ge h[\\text{mid}]$ and already popped). The incoming index `i` is the first bar after `mid` with height $< h[\\text{mid}]$. Thus a single pass resolves both left and right spans."
    },
    {
      id: "q03-monotonic-stack-3",
      type: "mcq",
      difficulty: "apply",
      title: "Handling Duplicate Elements in Sum of Subarray Minimums",
      prompt: "You want to compute $\\sum \\min(B)$ over all contiguous subarrays $B$ of an array `arr` that may contain duplicate values (e.g., `[3, 1, 2, 1]`). If you use strict inequality (`<`) for both the previous smaller element and the next smaller element, subarrays containing two `1`s are double-counted; if you use non-strict (`<=`) for both, they are skipped. How do you partition every subarray uniquely?",
      question: "How must the monotonic stack comparisons be paired to count each subarray containing duplicate minimums exactly once?",
      options: [
        "Use strict inequality on one side (e.g., Previous Strictly Smaller `<`) and non-strict inequality on the other side (Next Smaller or Equal `<=`), so ties are broken consistently by attributing the subarray to its leftmost (or rightmost) minimum.",
        "Sort the array first to group duplicate elements together before running the monotonic stack.",
        "Add a random floating-point epsilon to each element before pushing onto the stack.",
        "Divide the final sum by the frequency of each duplicate element."
      ],
      answer: 0,
      explanation: "If a subarray contains multiple copies of its minimum value at indices $i_1 < i_2$, attributing each subarray to the *first* occurrence of its minimum means the range for index $m$ extends left until a strictly smaller element (`arr[L] < arr[m]`) and right until a smaller-or-equal element (`arr[R] <= arr[m]`). This forms a bijection over all $N(N+1)/2$ subarrays."
    },
    {
      id: "q03-monotonic-stack-4",
      type: "mcq",
      difficulty: "staff",
      title: "Cartesian Tree Construction equivalence",
      prompt: "Given an array $A[0..N-1]$, its min-Cartesian Tree is a binary tree that is a min-heap on values $A[i]$ and whose in-order traversal yields the original indices $0, 1, \\dots, N-1$. How can a monotonic increasing stack build the entire Cartesian Tree in $O(N)$ worst-case time?",
      question: "How does maintaining the 'right spine' of the Cartesian Tree in a monotonic increasing stack insert element $A[i]$ in $O(1)$ amortized time?",
      options: [
        "Pop all elements from the stack with value $> A[i]$; the last popped node becomes $i$'s `left` child, and $i$ becomes the `right` child of the new stack top (then push $i$).",
        "Push $A[i]$ and rotate the root of the tree using AVL rotations until the heap property holds.",
        "Recursively find the minimum in $A[0..N-1]$ using a monotonic stack at each level of the tree.",
        "Pair adjacent elements bottom-up like `std::make_heap` (Floyd's heap construction)."
      ],
      answer: 0,
      explanation: "Because index $i$ is larger than all previously seen indices, node $i$ must lie on the rightmost path (right spine) of the Cartesian tree for $A[0..i]$. The right spine is strictly increasing from root to rightmost leaf—identical to a monotonic increasing stack. Popping nodes $> A[i]$ finds the split point where the popped sub-spine becomes $i$'s left subtree, and $i$ attaches as the right child of the remaining stack top."
    }
  ],

  "monotonic-deque-sliding-extrema": [
    {
      id: "q03-monotonic-deque-1",
      type: "mcq",
      difficulty: "recall",
      title: "Why Store Indices Instead of Values in a Monotonic Deque",
      prompt: "In the Sliding Window Maximum algorithm of window size $W$, why does the monotonic deque typically store array indices $i$ (or `(index, timestamp)` pairs) rather than only the raw values `nums[i]`?",
      question: "What operation requires knowing the index of the front element in the monotonic deque?",
      options: [
        "Determining whether the current maximum at the front of the deque has fallen outside the left boundary of the sliding window (`deque.front() <= i - W`) so it can be evicted via `pop_front()`.",
        "Sorting the deque in ascending order of indices whenever a tie occurs.",
        "Allowing the deque to be indexed in $O(1)$ time by value.",
        "Preventing integer overflow when adding `nums[i]` to the window sum."
      ],
      answer: 0,
      explanation: "A monotonic deque must enforce two orthogonal invariants: value monotonicity (via `pop_back` when `nums[back] <= nums[i]`) and window age/liveness (via `pop_front` when the front element's index is $\\le i - W$). Storing the index (or timestamp) allows $O(1)$ expiration checks at the front."
    },
    {
      id: "q03-monotonic-deque-2",
      type: "mcq",
      difficulty: "apply",
      title: "Power-of-Two Circular Ring Buffer Indexing",
      prompt: "You implement a fixed-capacity ring buffer deque for a sliding window of maximum size $W = 1000$. By rounding the buffer capacity up to $C = 1024 = 2^{10}$, how do you advance or wrap an unsigned index `tail` without a conditional branch (`if`) or a slow hardware division (`%`)?",
      question: "Which bitwise expression computes `(tail + 1) mod C` when $C = 2^k$?",
      options: [
        "`(tail + 1) & (C - 1)`",
        "`(tail + 1) ^ C`",
        "`(tail + 1) | (C - 1)`",
        "`(tail + 1) >> k`"
      ],
      answer: 0,
      explanation: "When $C = 2^k$, $C - 1$ has its lowest $k$ bits set to `1` and all higher bits set to `0` (e.g., $1023 = \\text{0x3FF}$). For unsigned integers, `x & (C - 1)` extracts the lowest $k$ bits, which is mathematically identical to `x % C` and executes in 1 CPU cycle (compared to 20–40 cycles for `DIV`/`IDIV`)."
    },
    {
      id: "q03-monotonic-deque-3",
      type: "mcq",
      difficulty: "apply",
      title: "Shortest Subarray with Sum at Least K (Negative Numbers)",
      prompt: "To find the shortest contiguous subarray with sum $\\ge K$ when the array contains negative numbers (LeetCode 862), we build prefix sums $P[0..N]$ and look for the smallest $i - j$ with $P[i] - P[j] \\ge K$. We maintain a monotonic increasing deque of candidate start indices $j$. Why can we safely `pop_front()` index $j$ as soon as we find $P[i] - P[j] \\ge K$, AND why do we `pop_back()` any $j'$ where $P[j'] \\ge P[i]$?",
      question: "Why are both `pop_front` and `pop_back` valid in the prefix-sum monotonic deque?",
      options: [
        "`pop_front` is valid because any future index $i' > i$ paired with the front $j$ would yield a longer subarray ($i' - j > i - j$); `pop_back` is valid because if $j' < i$ and $P[j'] \\ge P[i]$, then index $i$ is both further right (shorter subarray) and has a smaller or equal prefix sum (larger difference $P[i'] - P[i]$) than $j'$.",
        "`pop_front` removes negative array elements, and `pop_back` removes positive array elements.",
        "`pop_front` ensures the subarray sum does not exceed $2K$, and `pop_back` bounds the deque size to $K$.",
        "Prefix sums are always monotonically increasing even when the original array contains negative numbers."
      ],
      answer: 0,
      explanation: "Once $j$ at the front satisfies $P[i] - P[j] \\ge K$, $i$ is the earliest possible right endpoint for $j$; any later $i' > i$ gives length $i' - j > i - j$, so $j$ is never needed again. Conversely, at the back, if an older index $j' < i$ has $P[j'] \\ge P[i]$, then $i$ dominates $j'$ in both position ($i > j'$) and prefix value ($P[i] \\le P[j']$)."
    },
    {
      id: "q03-monotonic-deque-4",
      type: "mcq",
      difficulty: "staff",
      title: "`std::deque` Segmented Block Architecture vs Flat Ring Buffer",
      prompt: "In C++ STL implementations (`libstdc++` and `libc++`), how is `std::deque<T>` implemented internally, and why can a flat power-of-two ring buffer outperform `std::deque` in ultra-low-latency sliding-window telemetry?",
      question: "What is the internal memory layout of C++ `std::deque<T>` compared to a flat ring buffer?",
      options: [
        "`std::deque` is a doubly-indirect structure (a central map array of pointers to fixed-size heap-allocated chunks, e.g., 512 bytes in `libstdc++`), requiring two pointer dereferences per random access and chunk allocations when crossing boundaries, whereas a pre-allocated power-of-two ring buffer is a single contiguous array with 1-cycle bitwise masking.",
        "`std::deque` is implemented as a standard doubly linked list (`std::list`) with a cached size counter.",
        "`std::deque` reallocates and copies all elements on every `push_front()` call just like `std::vector`.",
        "`std::deque` uses kernel `mmap` page tables to remap virtual addresses on every push."
      ],
      answer: 0,
      explanation: "`std::deque` avoids full-array reallocation on growth by maintaining an array of pointers (`map`) to fixed-size blocks (chunks). While this gives $O(1)$ worst-case push at both ends without invalidating references, indexing `d[k]` requires computing chunk index and offset (two memory lookups), and shrinking/growing across chunks can trigger heap traffic unless carefully managed."
    }
  ],

  "lru-lfu-eviction-structures": [
    {
      id: "q03-lru-lfu-1",
      type: "mcq",
      difficulty: "recall",
      title: "$O(1)$ LFU `minFreq` Maintenance Rule",
      prompt: "In the $O(1)$ LFU cache algorithm (Shah, Mitra, & Matani), we maintain a hash map from `key -> Node`, a hash map of frequency buckets `freq -> DoublyLinkedList`, and an integer `minFreq`. When a key currently at frequency $f$ is accessed (`get` or `put` update), it is moved from bucket $f$ to bucket $f + 1$. Under what exact condition does `minFreq` change?",
      question: "How is `minFreq` updated in $O(1)$ time without scanning all frequency buckets?",
      options: [
        "When the accessed key's old frequency $f$ equals `minFreq` AND bucket $f$ becomes empty after removing the key, `minFreq` is incremented to $f + 1$; when a brand-new key is inserted, `minFreq` is reset to $1$.",
        "`minFreq` is decremented by 1 on every cache miss and incremented by 1 on every cache hit.",
        "`minFreq` is recomputed by taking the top of a min-heap of frequencies on every access.",
        "`minFreq` is always equal to the frequency of the MRU node in the most populous bucket."
      ],
      answer: 0,
      explanation: "Because a node's frequency only ever increases by $+1$ per access, if bucket `minFreq` becomes empty due to an access, the node that was just promoted to `minFreq + 1` guarantees that bucket `minFreq + 1` is non-empty and is now the new minimum frequency. On insertion of a new key, its frequency is $1$, which is always the global minimum."
    },
    {
      id: "q03-lru-lfu-2",
      type: "mcq",
      difficulty: "apply",
      title: "Cache Pollution in Pure LRU vs Pure LFU",
      prompt: "Consider two classic production workloads on a cache of capacity $C$: Workload A performs a one-time sequential table scan (`SELECT * FROM huge_table`) of $10C$ unique items. Workload B has a temporary viral event where $C$ items are requested $10^6$ times in the first hour and never requested again for the rest of the week. How do pure LRU and pure LFU fail on these two workloads?",
      question: "Which failure mode corresponds to pure LRU on Workload A and pure LFU on Workload B?",
      options: [
        "Pure LRU suffers 'scan pollution' on Workload A (evicting all hot working-set items in favor of one-hit wonders), while pure LFU suffers 'frequency stagnation' on Workload B (retaining dead viral items forever because new items start at frequency 1).",
        "Pure LRU suffers 'frequency stagnation' on Workload A, while pure LFU suffers 'scan pollution' on Workload B.",
        "Both pure LRU and pure LFU evict the viral items immediately on Workload B.",
        "Pure LFU flushes the entire cache on Workload A because all scanned items have frequency 1."
      ],
      answer: 0,
      explanation: "In pure LRU, a sequential scan of $N > C$ one-time items pushes every existing hot entry out of the tail. In pure LFU without aging, items that accumulated huge historical hit counts remain pinned in the cache indefinitely, forcing all newly inserted items (with initial frequency 1) to compete for a single eviction slot."
    },
    {
      id: "q03-lru-lfu-3",
      type: "mcq",
      difficulty: "apply",
      title: "W-TinyLFU Admission Filter & Periodic Aging",
      prompt: "In Caffeine / W-TinyLFU, how does the Count-Min Sketch track item frequencies across millions of keys in bounded memory, and how does it prevent historical frequency stagnation (Workload B)?",
      question: "What mechanism does W-TinyLFU use to bound sketch memory and age out stale frequencies?",
      options: [
        "It uses a 4-bit Count-Min Sketch (capping counts at 15) and periodically divides all 4-bit counters by 2 in parallel using a single bitwise SIMD/SWAR operation `(word >> 1) & 0x7777777777777777ULL` whenever the total sample count reaches $W_{\\text{sample}}$.",
        "It stores a 64-bit timestamp per key in the sketch and runs a background thread to delete keys older than 60 seconds.",
        "It clears the entire Count-Min Sketch to zero every 1,000 requests.",
        "It uses an unbounded hash table of 64-bit counters that spills to disk when full."
      ],
      answer: 0,
      explanation: "Because the admission filter only needs to know whether a candidate's recent frequency exceeds the victim's frequency in a cache of size $C$, 4-bit counters (0..15) suffice. Packing sixteen 4-bit counters into each `uint64_t` allows halving all counters simultaneously via `(x >> 1) & 0x7777777777777777ULL`, clearing out stale high-frequency items without clearing the sketch."
    },
    {
      id: "q03-lru-lfu-4",
      type: "mcq",
      difficulty: "staff",
      title: "Multi-Core Cache-Line Contention on Strict LRU Head",
      prompt: "In a 64-core server handling 10 million read-heavy cache hits per second, every `get(key)` in a strict textbook LRU cache unlinks the hit node and inserts it at the shared `head` sentinel. Even if you replace the global mutex with lock-free `CAS` operations on `head.next`, throughput collapses as core count increases from 4 to 64. Why, and how do systems like Linux Page Cache, RocksDB Clock-Cache, or Memcached solve this?",
      question: "Why does strict LRU scale poorly on multi-socket/multi-core CPUs even on 100% read hits, and what is the systems fix?",
      options: [
        "Every read hit mutates the same `head` cache line, causing MESI cache-coherency invalidation storms across all 64 cores; production systems avoid per-hit list mutation using CLOCK/FIFO-Reinsertion (setting a 1-bit reference flag only if it was 0) or per-core buffered access ring buffers.",
        "Lock-free CAS instructions flush the CPU's TLB on every execution.",
        "The hash table buckets collide when more than 4 cores read simultaneously.",
        "Strict LRU requires calling `malloc` on every read hit."
      ],
      answer: 0,
      explanation: "In strict LRU, a logical read (`get`) performs a physical write to the global `head` sentinel's `next`/`prev` pointers. Under the MESI protocol, all 64 cores fight for Exclusive/Modified ownership of that single 64-byte cache line. Approximations like CLOCK / S3-FIFO only set an atomic `accessed = 1` bit inside the item's own cache line (if not already 1), turning repeat reads into pure shared (`S`-state) cache hits."
    }
  ],

  "case-redis-skiplist-ziplist": [
    {
      id: "q03-redis-zset-1",
      type: "mcq",
      difficulty: "recall",
      title: "Dual-Indexed `OBJ_ENCODING_SKIPLIST` Architecture",
      prompt: "When a Redis Sorted Set (`ZSET`) exceeds `zset-max-listpack-entries` (default 128), Redis converts it to `OBJ_ENCODING_SKIPLIST`, which contains both a `dict` (hash table) and a `zskiplist`. Why are BOTH data structures required inside the same `zset` struct?",
      question: "What role does each structure play in Redis's `zset` implementation?",
      options: [
        "The `dict` maps `member -> score` in $O(1)$ expected time so `ZSCORE` and score-lookup before `ZADD`/`ZREM` do not require an $O(N)$ scan, while the `zskiplist` orders `(score, member)` pairs to support $O(\\log N)$ range and rank queries (`ZRANGE`, `ZRANK`).",
        "The `dict` serves as an L1 cache for the hot 10% of elements, while the `zskiplist` stores the remaining 90% on disk.",
        "The `dict` stores string members, while the `zskiplist` stores integer members.",
        "The `dict` is used exclusively by master nodes, and the `zskiplist` is used exclusively by read replicas."
      ],
      answer: 0,
      explanation: "A skip list sorted by `(score, member)` cannot locate a member in $O(\\log N)$ time unless its current `score` is already known! The `dict` resolves `member -> score` in $O(1)$ time (sharing the underlying `sds` string pointer with the skip list to avoid duplicating strings), and then the skip list uses `(score, member)` to find, update, or rank the node in $O(\\log N)$."
    },
    {
      id: "q03-redis-zset-2",
      type: "mcq",
      difficulty: "apply",
      title: "Skip List `span` Field and $O(\\log N)$ `ZRANK`",
      prompt: "In Redis's `zskiplistLevel` struct, every forward pointer `level[i].forward` is paired with an `unsigned long span`. How does Redis compute the 0-based rank of a target `(score, member)` in $O(\\log N)$ time during `ZRANK`?",
      question: "How is `level[i].span` used and updated in `zskiplist`?",
      options: [
        "`level[i].span` stores the number of level-0 nodes traversed by that single level-$i$ step; during top-down search, accumulating `rank += x->level[i].span` on every horizontal move yields the exact 1-based rank in $O(\\log N)$ steps.",
        "`level[i].span` stores the difference in floating-point `score` between `x` and `x->level[i].forward`.",
        "`level[i].span` stores the byte offset of the target node inside the `listpack` buffer.",
        "`level[i].span` counts how many times the node has been accessed for LFU eviction."
      ],
      answer: 0,
      explanation: "Augmenting each forward pointer at level $i$ with the count of level-0 nodes it skips (`span`) turns the skip list into an order-statistic structure. Whenever the search moves right along `level[i]`, it adds `level[i].span` to a running `rank` counter, reaching the target node in $O(\\log N)$ pointer hops with its exact rank."
    },
    {
      id: "q03-redis-zset-3",
      type: "mcq",
      difficulty: "apply",
      title: "The `ziplist` Cascade Update Bug vs `listpack` Fix",
      prompt: "In legacy Redis (`ziplist`), every entry started with `[prevlen][encoding][data]`, where `prevlen` used 1 byte if the previous entry was $\\le 253$ bytes, or 5 bytes if the previous entry was $\\ge 254$ bytes. How did this design allow a single insertion to trigger an $O(N^2)$ cascade update, and how did Salvatore Sanfilippo's `listpack` eliminate it?",
      question: "Why did `ziplist` suffer from cascade updates and how does `listpack` avoid them?",
      options: [
        "In `ziplist`, inserting a $\\ge 254$-byte entry before a chain of entries of size 250–253 bytes forced the next entry's `prevlen` to grow from 1 byte to 5 bytes, pushing its total size over 254 bytes and cascading down the entire list; `listpack` replaces `prevlen` with `[encoding][data][backlen]`, where `backlen` at the end of an entry encodes ONLY that entry's own length.",
        "In `ziplist`, every entry stored an absolute 64-bit memory pointer that had to be updated on `realloc`; `listpack` uses 32-bit offsets.",
        "`listpack` pads every entry to a fixed 256-byte boundary so lengths never change.",
        "`listpack` forbids backward traversal altogether so no length headers are needed."
      ],
      answer: 0,
      explanation: "Because `ziplist` stored the *previous* entry's length inside the *next* entry, changing entry $k$'s size could alter entry $k+1$'s size, triggering a domino effect of `memmove` expansions. In `listpack`, each entry ends with `backlen` (the length of *itself*, read right-to-left using MSB continuation bits), so backward traversal still works (jump back by the previous entry's trailing `backlen`), and no entry ever depends on its neighbor's size."
    },
    {
      id: "q03-redis-zset-4",
      type: "mcq",
      difficulty: "staff",
      title: "Why Redis Uses $p = 1/4$ and `ZSKIPLIST_MAXLEVEL = 32`",
      prompt: "In `src/server.h`, Redis defines `#define ZSKIPLIST_MAXLEVEL 32` (64 in older versions) and `#define ZSKIPLIST_P 0.25`. Compared to a textbook skip list with $p = 0.5$, what is the exact quantitative trade-off of setting $p = 0.25$?",
      question: "How does choosing $p = 1/4$ instead of $p = 1/2$ affect memory per node and expected search comparisons?",
      options: [
        "It reduces the average number of level structures per node from $\\frac{1}{1 - 0.5} = 2.0$ down to $\\frac{1}{1 - 0.25} = 1.333$ (saving $0.67 \\times 16\\text{B} \\approx 10.7$ bytes per node, because each level carries both `forward` and `span`), while increasing the expected horizontal steps per level from $1$ to $3$ (keeping asymptotic depth $O(\\log_4 N)$).",
        "It increases the average number of pointers per node from $2.0$ to $4.0$, making searches $2\\times$ faster at the cost of $2\\times$ more RAM.",
        "It bounds the maximum number of elements in a sorted set to $4^4 = 256$.",
        "It eliminates the need for the `backward` pointer at level 0."
      ],
      answer: 0,
      explanation: "In Redis, each `zskiplistLevel` is 16 bytes (8B `forward` pointer + 8B `span`). Lowering $p$ from $1/2$ to $1/4$ shrinks the expected tower height from $2.0$ to $1.333$, saving ~11 bytes per node across millions of sorted set elements. With `MAXLEVEL = 32` and $p = 1/4$, the top level reaches $4^{32} = 2^{64}$ elements, and the flatter fanout of 4 behaves very similarly to a 4-way B-tree."
    }
  ],

  "build-lfu-lru-cache": [
    {
      id: "q03-build-cache-1",
      type: "mcq",
      difficulty: "recall",
      title: "Zero-Allocation Slab Handle vs Heap Pointer",
      prompt: "In our production `FlatO1LfuCache` implementation, all cache nodes live in a pre-allocated contiguous vector `nodes[0..capacity-1]`, and `prev` / `next` / `freeHead` are stored as `int32_t` array indices (`NULL_IDX = -1`) instead of 64-bit `Node*` pointers. Which two major production hazards does this eliminate?",
      question: "What are the two primary benefits of pre-allocated slab indexing with `int32_t` handles?",
      options: [
        "It reduces per-link pointer size by 50% (4 bytes vs 8 bytes) while guaranteeing zero `malloc`/`free` syscalls or heap fragmentation during steady-state cache evictions, and allows the `nodes` vector to be relocated without invalidating internal links.",
        "It allows the cache to hold more than $2^{32}$ items without using 64-bit integers.",
        "It automatically synchronizes access across multiple threads without mutexes or atomics.",
        "It sorts the `nodes` array by key in $O(1)$ time on every insertion."
      ],
      answer: 0,
      explanation: "Using `int32_t` slab indices cuts the link metadata from 16 bytes (`prev*`, `next*`) to 8 bytes (`prev`, `next`), keeps all nodes tightly packed in contiguous virtual memory pages, and completely eliminates heap allocator overhead during high-churn eviction loops."
    },
    {
      id: "q03-build-cache-2",
      type: "mcq",
      difficulty: "apply",
      title: "Eviction Ordering and Bucket Cleanup in `put(key, val)`",
      prompt: "Suppose an LFU cache has `capacity = 2`. We call `put(1, 10)`, `put(2, 20)`, `get(1)` (so key 1 has `freq = 2`, key 2 has `freq = 1`, and `minFreq = 1`), and then `put(3, 30)`. Trace the exact state transitions during `put(3, 30)`.",
      question: "In what order must eviction and `minFreq` updates occur during `put(3, 30)`?",
      options: [
        "First, evict the tail of `freqBuckets[minFreq]` (key 2 at `freq = 1`), removing key 2 from `keyToSlot` and cleaning up bucket 1 if empty; second, allocate that freed slot for key 3 with `freq = 1`, insert it at the head of `freqBuckets[1]`, and set `minFreq = 1`.",
        "First, insert key 3 into `freqBuckets[1]` and set `minFreq = 1`; second, evict the tail of `freqBuckets[1]` (which would immediately evict the newly inserted key 3 if inserted at the tail, or require extra capacity).",
        "Evict key 1 because it was the most recently accessed key, then insert key 3 with `freq = 2`.",
        "Increment `minFreq` to 2, evict key 1, and insert key 3 into bucket 2."
      ],
      answer: 0,
      explanation: "Eviction MUST happen *before* inserting the new key: otherwise, setting `minFreq = 1` and inserting the new key into bucket 1 before evicting could either exceed the fixed slab capacity or corrupt the victim selection in bucket 1. Furthermore, recycling the evicted victim's slab slot directly for the incoming key achieves zero allocation."
    },
    {
      id: "q03-build-cache-3",
      type: "mcq",
      difficulty: "apply",
      title: "Memory Leak Hazard in Frequency Bucket Map",
      prompt: "Consider an LFU cache where a single hot key is accessed $10^7$ times (`get(hotKey)` in a tight loop). On each hit, `hotKey` moves from `freqBuckets[f]` to `freqBuckets[f + 1]`. What happens if `unlinkFromBucket(f, idx)` does NOT call `freqBuckets.erase(f)` when bucket `f` becomes empty?",
      question: "Why is erasing empty frequency buckets from the `freq -> Bucket` hash table mandatory in a long-running LFU cache?",
      options: [
        "Without erasing empty buckets, the `freqBuckets` hash map accumulates $10^7$ empty bucket entries (one for every historical frequency $1, 2, \\dots, 10^7$), causing an unbounded $O(\\text{total hits})$ memory leak even when cache capacity $C = 1$.",
        "Leaving empty buckets causes `get(hotKey)` to return `-1` on the next call.",
        "The C++ standard forbids storing empty structs inside `std::unordered_map`.",
        "Empty buckets cause integer overflow in `minFreq` after 255 hits."
      ],
      answer: 0,
      explanation: "The number of *non-empty* frequency buckets can never exceed the cache capacity $C$ (since each of the $C$ items belongs to exactly one bucket). However, the maximum frequency value $f$ grows unboundedly with the number of hits. Deleting a bucket entry as soon as its head becomes `NULL_IDX` strictly bounds `freqBuckets.size() <= C`."
    },
    {
      id: "q03-build-cache-4",
      type: "mcq",
      difficulty: "staff",
      title: "Why S3-FIFO (SOSP '23) Replaces Doubly Linked Lists with Three FIFO Queues",
      prompt: "Recent systems research (Yang et al., SOSP 2023, *'FIFO queues are all you need for cache eviction'*) introduced **S3-FIFO**, which uses a small FIFO queue (`S`, 10% capacity), a main FIFO queue (`M`, 90% capacity), and a ghost FIFO queue (`G`, storing only evicted key hashes). Why does S3-FIFO achieve both lower miss ratios than LRU/W-TinyLFU on production traces AND up to $6\\times$ higher throughput on 16+ CPU cores?",
      question: "How does S3-FIFO eliminate both multi-core lock contention and single-hit scan pollution without a doubly linked list?",
      options: [
        "Cache hits in S3-FIFO only set an atomic per-object frequency counter (`min(freq + 1, 3)`) without moving nodes in any queue (zero lock/CAS contention on read hits); during eviction from `S`, 80–90% of one-hit wonders (`freq == 0`) are quickly dropped before ever entering `M` ('quick demotion').",
        "S3-FIFO stores all cache entries in CPU L1 registers and disables virtual memory.",
        "S3-FIFO uses a global reader-writer lock that pauses all threads every 10 milliseconds to sort the cache by frequency.",
        "S3-FIFO hashes keys directly to physical DRAM row buffers without an index."
      ],
      answer: 0,
      explanation: "In LRU, every read hit requires unlinking and relinking a doubly linked list node under a lock or CAS loop. In S3-FIFO, queues are pure FIFO: nodes only move during *insert* or *eviction* (cache misses). Read hits merely increment a saturating 2-bit counter inside the object header, making cache hits completely lock-free and scalable across cores while filtering scan pollution via the 10% probationary queue `S`."
    }
  ]
});
