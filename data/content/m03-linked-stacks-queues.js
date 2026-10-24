window.MODULE_CONTENT = window.MODULE_CONTENT || {};
window.MODULE_CONTENT["m03"] = {
  "singly-doubly-intrusive-lists": {
    title: "Singly, Doubly & Intrusive Linked Lists (Linux Kernel list_head)",
    video: {
      youtubeId: "8hswwLiZNkY",
      id: "8hswwLiZNkY",
      url: "https://www.youtube.com/embed/8hswwLiZNkY",
      title: "Intrusive Circular Doubly Linked Lists (Linux Kernel list_head Architecture)",
      channel: "Codotaku",
      duration: "22:40",
      start: 0,
      length: "22m",
      why: "Deep-dive lecture covering Singly, Doubly & Intrusive Linked Lists (Linux Kernel list_head)."
    },
    intuition: "Standard library linked lists (<code>std::list<T></code>) invert ownership by wrapping every payload inside a separately heap-allocated node—doubling allocator traffic, fragmenting L1 cache lines, and restricting an object to one list at a time. Intrusive linked lists (like the Linux kernel's <code>struct list_head</code>) embed the <code>next</code>/<code>prev</code> hooks directly inside the domain struct, recovering the parent struct via compile-time <code>offsetof</code> pointer arithmetic (<code>container_of</code>) with zero dynamic allocations.",
    content: `
      <h3>Pointer-to-Pointer (<code>Node**</code>) &amp; Circular Sentinel Elimination</h3>
      <p>In a naive singly or doubly linked list, every insertion or deletion checks a special-case branch: <code>if (prev == nullptr) head = curr-&gt;next; else prev-&gt;next = curr-&gt;next;</code>. As Linus Torvalds famously demonstrated, there are two complementary techniques that completely eliminate special-case boundary branches:</p>
      <ol>
        <li><strong>Indirect Pointer-to-Pointer (<code>Node** pp = &amp;head</code>) for Singly Linked Lists:</strong> Instead of tracking a predecessor node pointer <code>Node* prev</code>, track the <em>address of the pointer field</em> that points to the current node: <code>Node** indirect = &amp;head</code>. Advancing moves to <code>indirect = &amp;((*indirect)-&gt;next)</code>, and unlinking the target node executes <code>*indirect = (*indirect)-&gt;next</code> uniformly—whether the node is the head of the list or in the middle!</li>
        <li><strong>Circular Dummy Sentinel Node for Doubly Linked Lists:</strong> By maintaining a permanent sentinel node <code>sentinel</code> initialized to point to itself (<code>sentinel.next = sentinel.prev = &amp;sentinel</code>), the list is never physically empty. Every real node sits strictly between two valid <code>Node</code> structs (<code>sentinel.next</code> is <code>front()</code>, <code>sentinel.prev</code> is <code>back()</code>), reducing <code>insert_between(prev, next, node)</code> and <code>unlink(node)</code> to 4 and 2 unconditional pointer stores respectively.</li>
      </ol>

      <div class="invariant-box">
        <div class="invariant-title">Systems Invariant: Intrusive <code>list_head</code> &amp; The <code>container_of</code> Offset Identity</div>
        <p>In a non-intrusive list (<code>std::list&lt;Task&gt;</code>), inserting a <code>Task</code> allocates a separate heap node containing <code>{prev, next, Task}</code>, and removing a <code>Task*</code> given only its address is $O(N)$ unless you also store a <code>std::list::iterator</code> alongside it. In the Linux kernel's <strong>intrusive</strong> design, the 16-byte hook <code>struct list_head { list_head *next, *prev; }</code> is embedded directly as a member inside <code>struct Task</code>:</p>
        <p>$$\\text{addr}(\\text{Task}) = \\text{addr}(\\text{member\\_ptr}) - \\text{offsetof}(\\text{Task},\\; \\text{member})$$</p>
        <p>Because the byte offset of a struct field is a compile-time constant known to the compiler, <code>container_of(ptr, Task, run_list)</code> subtracts that constant integer offset from the <code>list_head*</code> address—recovering the enclosing <code>Task*</code> in <strong>zero memory dereferences</strong>! Even better, a single <code>Task</code> struct can embed <em>multiple</em> <code>list_head</code> fields (<code>run_queue</code>, <code>all_tasks</code>, <code>wait_list</code>), participating in three doubly linked lists simultaneously with zero heap allocations.</p>
      </div>

      <h3>Non-Intrusive vs. Intrusive vs. Arena-Indexed Linked Lists</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>List Architecture</th>
            <th>Heap Allocations per Insert</th>
            <th>Unlink Given <code>T*</code> Pointer</th>
            <th>Multi-List Membership</th>
            <th>Cache / Memory Overhead</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Non-Intrusive (<code>std::list&lt;T&gt;</code>)</td>
            <td>1 <code>malloc</code> per node</td>
            <td>$O(N)$ (unless iterator stored)</td>
            <td>Requires extra wrapper nodes + pointer indirection</td>
            <td>16B links + 16B allocator header per node</td>
          </tr>
          <tr>
            <td>Intrusive (Linux <code>list_head</code> / Boost.Intrusive)</td>
            <td><strong>0</strong> (embedded in <code>T</code>)</td>
            <td><strong>$O(1)$</strong> direct unlink</td>
            <td>Embed $k$ <code>list_head</code> fields in single <code>T</code></td>
            <td>16B per embedded hook, 0 allocator headers</td>
          </tr>
          <tr>
            <td>32-Bit Index Pool (<code>int32_t next, prev</code>)</td>
            <td><strong>0</strong> (contiguous flat vector)</td>
            <td><strong>$O(1)$</strong> by index</td>
            <td>Multiple index pairs</td>
            <td>8B links ($50\\%$ pointer savings), high L1/TLB locality</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing Non-Intrusive Heap Scattering vs. Intrusive <code>container_of</code></h3>
      <svg viewBox="0 0 760 210" width="100%" height="auto" role="img" aria-label="Intrusive list_head and container_of offset arithmetic">
        <style>
          .ll-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .ll-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .ll-struct { fill: rgba(59, 130, 246, 0.14); stroke: #3b82f6; stroke-width: 1.5; }
          .ll-hook { fill: rgba(16, 185, 129, 0.28); stroke: #10b981; stroke-width: 2; }
          .ll-hook2 { fill: rgba(245, 158, 11, 0.25); stroke: #f59e0b; stroke-width: 1.5; }
        </style>
        <text x="15" y="22" class="ll-title">Intrusive Struct Layout: One Allocation Participates in Multiple Lists Simultaneously</text>

        <rect x="20" y="38" width="310" height="135" rx="5" class="ll-struct"/>
        <text x="35" y="58" class="ll-txt">0x1000: struct task_struct {</text>
        <text x="45" y="78" class="ll-txt">  uint64_t pid;       // +0B</text>
        <text x="45" y="96" class="ll-txt">  uint64_t vruntime;  // +8B</text>
        <rect x="40" y="105" width="275" height="26" rx="3" class="ll-hook"/>
        <text x="50" y="122" class="ll-txt">  list_head run_node; // +16B (ptr)</text>
        <rect x="40" y="137" width="275" height="26" rx="3" class="ll-hook2"/>
        <text x="50" y="154" class="ll-txt">  list_head wait_node;// +32B</text>

        <rect x="420" y="38" width="310" height="135" rx="5" class="ll-struct"/>
        <text x="435" y="58" class="ll-txt">0x2080: struct task_struct {</text>
        <text x="445" y="78" class="ll-txt">  uint64_t pid;       // +0B</text>
        <text x="445" y="96" class="ll-txt">  uint64_t vruntime;  // +8B</text>
        <rect x="440" y="105" width="275" height="26" rx="3" class="ll-hook"/>
        <text x="450" y="122" class="ll-txt">  list_head run_node; // +16B (ptr)</text>
        <rect x="440" y="137" width="275" height="26" rx="3" class="ll-hook2"/>
        <text x="450" y="154" class="ll-txt">  list_head wait_node;// +32B</text>

        <line x1="315" y1="118" x2="440" y2="118" stroke="#10b981" stroke-width="2.5"/>
        <text x="377" y="110" text-anchor="middle" class="ll-txt">&lt;-- next / prev --&gt;</text>

        <text x="20" y="196" class="ll-txt">container_of(ptr, task_struct, run_node) = (task_struct*)((char*)ptr - 16) --&gt; 0x1000 (1 ALU sub, 0 loads!)</text>
      </svg>

      <h3>Circular Sentinel Doubly Linked List Splice &amp; Unlink</h3>
      <div class="mermaid">
      flowchart LR
        A["Sentinel Head<br/>(head.next = first,<br/>head.prev = last)"] <--> B["Node 1<br/>list_head"]
        B <--> C["Node 2<br/>list_head"]
        C <--> A
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Dependent Load Chains &amp; Out-of-Order Execution Paralysis</div>
        <p>Why is traversing a linked list of $N$ nodes across the heap $20\\times$ to $50\\times$ slower than scanning an array of $N$ elements? On a modern out-of-order CPU (with a 512-entry Reorder Buffer and 12 execution ports), an array loop computes address <code>base + i * sizeof(T)</code> independently for iterations $i, i+1, \\dots, i+15$, issuing up to 10–12 L1/L2 memory loads in parallel (Memory-Level Parallelism, MLP). In a linked list, the address of node $k+1$ (<code>curr = curr->next</code>) is <strong>stored inside the payload of node $k$</strong>. The CPU cannot even know the virtual address of node $k+1$ until the load for node $k$ returns from L3/DRAM (50–250 cycles later), serializing execution to a strict MLP $= 1$ pointer-chasing stall!</p>
      </div>

      <div class="simulator-mount" data-sim="sim-linked-list-floyd"></div>

      <h3>Production Implementation: Intrusive Circular Doubly Linked List &amp; Torvalds Indirect Unlink</h3>
      <pre><code class="language-cpp">#include &lt;cstddef&gt;
#include &lt;cstdint&gt;

// Linux-kernel style intrusive circular doubly-linked list hook
struct IntrusiveListNode {
  IntrusiveListNode* next = this;
  IntrusiveListNode* prev = this;

  void init() noexcept { next = prev = this; }
  bool empty() const noexcept { return next == this; }

  static void link_between(IntrusiveListNode* prev_node,
                           IntrusiveListNode* next_node,
                           IntrusiveListNode* new_node) noexcept {
    new_node-&gt;next = next_node;
    new_node-&gt;prev = prev_node;
    next_node-&gt;prev = new_node;
    prev_node-&gt;next = new_node;
  }

  // Insert new_node right before this (if this is sentinel head, this is push_back!)
  void push_back(IntrusiveListNode* new_node) noexcept {
    link_between(this-&gt;prev, this, new_node);
  }

  // Insert new_node right after this (if this is sentinel head, this is push_front!)
  void push_front(IntrusiveListNode* new_node) noexcept {
    link_between(this, this-&gt;next, new_node);
  }

  // Branchless O(1) self-unlink!
  void unlink() noexcept {
    next-&gt;prev = prev;
    prev-&gt;next = next;
    next = prev = this;
  }
};

// Compile-time offset arithmetic (C++ equivalent of Linux kernel container_of)
#define CONTAINER_OF(ptr, Type, member) \
  reinterpret_cast&lt;Type*&gt;(reinterpret_cast&lt;char*&gt;(ptr) - offsetof(Type, member))

// Linus Torvalds's branchless pointer-to-pointer singly linked list removal
struct SinglyNode {
  int val;
  SinglyNode* next;
};

void remove_first_matching(SinglyNode** head_ref, int target) noexcept {
  SinglyNode** indirect = head_ref;
  while (*indirect != nullptr) {
    if ((*indirect)-&gt;val == target) {
      *indirect = (*indirect)-&gt;next; // Works identically for head node and interior nodes!
      return;
    }
    indirect = &amp;((*indirect)-&gt;next);
  }
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Mutating Links While Iterating Without Saving <code>next</code> (<code>list_for_each_safe</code>)</div>
        <p>When iterating over an intrusive or manual linked list and unlinking or freeing nodes inside the loop body, writing <code>for (auto* pos = head.next; pos != &amp;head; pos = pos-&gt;next) { pos-&gt;unlink(); }</code> causes an immediate infinite loop or Use-After-Free because <code>pos-&gt;unlink()</code> overwrites <code>pos-&gt;next = pos</code> (or <code>free(pos)</code> poisons <code>pos->next</code>) before the loop increment expression reads <code>pos-&gt;next</code>! Always use the Linux kernel's <code>list_for_each_safe(pos, tmp, head)</code> idiom: cache <code>auto* next_node = pos-&gt;next;</code> at the very top of the loop body before mutating or freeing <code>pos</code>.</p>
      </div>
    `,
    keyTakeaways: [
      "Intrusive linked lists (like Linux's struct list_head) embed link pointers directly inside the domain object, eliminating per-node heap allocations and enabling O(1) unlinking from an object pointer.",
      "The container_of macro recovers the enclosing struct pointer from a member pointer in zero memory reads by subtracting compile-time offsetof(Type, member).",
      "Using a circular dummy sentinel node in a doubly linked list—or a Node** pointer-to-pointer in a singly linked list—eliminates all null-check boundary branches on head/tail updates.",
      "Always cache next = curr->next before unlinking, moving, or freeing curr during list traversal (the list_for_each_safe pattern)."
    ],
    furtherReading: [
      {
        title: "Linux Kernel Documentation: Circular Doubly Linked Lists (include/linux/list.h & container_of)",
        url: "https://docs.kernel.org/core-api/kernel-api.html",
        type: "Systems Documentation"
      },
      {
        title: "Boost C++ Libraries: Boost.Intrusive vs. Non-Intrusive Containers Performance & Design",
        url: "https://www.boost.org/doc/libs/release/doc/html/intrusive.html",
        type: "Library Documentation"
      }
    ]
  },

  "floyd-brent-cycle-detection": {
    title: "Pointer Chasing: Floyd's Tortoise-and-Hare vs Brent's Cycle Detection",
    video: {
      youtubeId: "PvrxZaH_eZ4",
      id: "PvrxZaH_eZ4",
      url: "https://www.youtube.com/embed/PvrxZaH_eZ4",
      id: "PvrxZaH_eZ4",
      url: "https://www.youtube.com/embed/PvrxZaH_eZ4",
      title: "Floyd's Tortoise and Hare Cycle Detection & Mathematical Proof",
      channel: "WilliamFiset / Algorithms",
      duration: "14 min"
    },
    intuition: "Any deterministic sequence $x_{k+1} = f(x_k)$ over a finite state space eventually enters a cycle (forming a Greek letter $\\rho$ with tail length $\\mu$ and cycle length $\\lambda$). Floyd's Tortoise-and-Hare detects the cycle and locates its exact entrance in $O(\\mu + \\lambda)$ time and $O(1)$ space via modular congruence, while Richard Brent's teleporting-turtle algorithm finds $\\lambda$ directly with $36\\%$ fewer step evaluations.",
    content: `
      <h3>The $\\rho$ (Rho) Topology &amp; Floyd's Modular Congruence Proof</h3>
      <p>Consider a singly linked list (or iterated function $x_{i+1} = f(x_i)$ in Pollard's rho integer factorization and PRNG period testing) that has a non-cyclic prefix (tail) of $\\mu$ edges leading to a cycle entrance node $E$, followed by a directed cycle of $\\lambda$ edges. In <strong>Floyd's Cycle-Finding Algorithm</strong> (attributed to Robert W. Floyd, 1967, in Knuth TAOCP Vol. 2), a slow pointer $T$ (Tortoise) advances 1 step per iteration ($t_k = k$) and a fast pointer $H$ (Hare) advances 2 steps per iteration ($h_k = 2k$):</p>
      <ul>
        <li><strong>Phase 1 (Cycle Detection &amp; Meeting Point):</strong> Once $k \\ge \\mu$, both pointers are inside the cycle of length $\\lambda$. Since $H$ closes the gap to $T$ by exactly $2 - 1 = 1$ edge per iteration, $H$ cannot jump over $T$ without landing on it. They meet at the smallest step $k \\ge \\mu$ where the distance between them $2k - k = k$ is an exact multiple of the cycle length $\\lambda$:
        $$k = m \\cdot \\lambda \\quad \\text{for some integer } m \\ge 1$$</li>
        <li><strong>Phase 2 (Finding the Exact Cycle Entrance $\\mu$):</strong> At the meeting step $k = m \\lambda$, the Tortoise is at position $\\mu + (k - \\mu) \\bmod \\lambda$—meaning it has traveled $(k - \\mu) \\equiv -\\mu \\pmod \\lambda$ steps past the cycle entrance $E$. Therefore, advancing a further $\\mu$ steps along the cycle reaches offset $(k - \\mu) + \\mu = k = m \\lambda \\equiv 0 \\pmod \\lambda$, which is <strong>precisely the cycle entrance $E$</strong>! Resetting one pointer to <code>head</code> (distance $\\mu$ from $E$) and advancing both pointers at speed 1 causes them to collide at $E$ after exactly $\\mu$ steps.</li>
      </ul>

      <div class="invariant-box">
        <div class="invariant-title">Algorithmic Invariant: Brent's Power-of-Two Teleporting Turtle (1980)</div>
        <p>In Floyd's algorithm, every iteration advances $T$ by 1 step and $H$ by 2 steps—costing <strong>3 pointer dereferences (or $f(x)$ evaluations) per step</strong>, and requiring a post-processing loop to count the cycle length $\\lambda$. Richard P. Brent (1980) asked: why move both pointers continuously when we can keep the Tortoise stationary and teleport it to the Hare's position at exponentially growing powers of two ($2^0, 2^1, 2^2, \\dots, 2^i$)?</p>
        <p>In Brent's algorithm, the Hare advances 1 step at a time while incrementing the current segment length $\\lambda$. Whenever $H == T$, the exact cycle length $\\lambda$ is already known! Whenever $\\lambda$ reaches the current power-of-two limit $P = 2^i$, we teleport $T \\leftarrow H$, reset $\\lambda \\leftarrow 0$, and double $P \\leftarrow 2P$. Once the first power of two $2^i \\ge \\max(\\mu, \\lambda)$ is reached, $T$ is parked inside the cycle and $H$ is guaranteed to collide with $T$ in exactly $\\lambda$ steps—performing only <strong>1 function evaluation per step</strong> and directly yielding $\\lambda$!</p>
      </div>

      <h3>Comparative Analysis of Cycle Detection Algorithms</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Time Complexity</th>
            <th>Auxiliary Space</th>
            <th>Pointer Chases per Step</th>
            <th>Directly Yields Cycle Length $\\lambda$?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hash Set (Visited Addresses)</td>
            <td>$O(\\mu + \\lambda)$</td>
            <td>$\\Theta(\\mu + \\lambda)$</td>
            <td>1 chase + 1 hash insert</td>
            <td>Yes (if storing step index in map)</td>
          </tr>
          <tr>
            <td>Floyd's Tortoise &amp; Hare</td>
            <td>$O(\\mu + \\lambda)$</td>
            <td>$O(1)$ (2 pointers)</td>
            <td><strong>3 chases</strong> (1 slow + 2 fast)</td>
            <td>No (requires extra $\\lambda$-step loop)</td>
          </tr>
          <tr>
            <td>Brent's Teleporting Turtle</td>
            <td>$O(\\mu + \\lambda)$</td>
            <td>$O(1)$ (2 pointers + 2 scalars)</td>
            <td><strong>1 chase</strong> ($\\approx 36\\%$ faster than Floyd)</td>
            <td><strong>Yes!</strong> Counter equals $\\lambda$ upon collision</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing the $\\rho$ (Rho) Cycle Geometry &amp; Phase 2 Entrance Alignment</h3>
      <svg viewBox="0 0 760 205" width="100%" height="auto" role="img" aria-label="Floyd and Brent cycle detection rho geometry">
        <style>
          .cy-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .cy-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .cy-node { fill: rgba(59, 130, 246, 0.2); stroke: #3b82f6; stroke-width: 1.5; }
          .cy-ent { fill: rgba(16, 185, 129, 0.3); stroke: #10b981; stroke-width: 2; }
          .cy-meet { fill: rgba(245, 158, 11, 0.3); stroke: #f59e0b; stroke-width: 2; }
        </style>
        <text x="15" y="22" class="cy-title">Rho Topology: Tail Length mu = 3, Cycle Length lambda = 5. Meeting at k = m * lambda</text>

        <circle cx="45" cy="95" r="20" class="cy-node"/>
        <text x="45" y="99" text-anchor="middle" class="cy-txt">H0</text>
        <circle cx="115" cy="95" r="20" class="cy-node"/>
        <text x="115" y="99" text-anchor="middle" class="cy-txt">N1</text>
        <circle cx="185" cy="95" r="20" class="cy-node"/>
        <text x="185" y="99" text-anchor="middle" class="cy-txt">N2</text>

        <circle cx="265" cy="95" r="22" class="cy-ent"/>
        <text x="265" y="99" text-anchor="middle" class="cy-txt">E (mu)</text>

        <circle cx="345" cy="48" r="20" class="cy-node"/>
        <text x="345" y="52" text-anchor="middle" class="cy-txt">C1</text>
        <circle cx="430" cy="65" r="22" class="cy-meet"/>
        <text x="430" y="69" text-anchor="middle" class="cy-txt">Meet</text>
        <circle cx="415" cy="142" r="20" class="cy-node"/>
        <text x="415" y="146" text-anchor="middle" class="cy-txt">C3</text>
        <circle cx="330" cy="148" r="20" class="cy-node"/>
        <text x="330" y="152" text-anchor="middle" class="cy-txt">C4</text>

        <text x="150" y="65" text-anchor="middle" class="cy-txt">&lt;--- Tail mu = 3 ---&gt;</text>
        <text x="475" y="62" class="cy-txt">At Meeting Point (k = m * lambda):</text>
        <text x="475" y="84" class="cy-txt">1. Offset from E is (k - mu) mod lambda</text>
        <text x="475" y="106" class="cy-txt">2. Remaining arc back to E is mu mod lambda!</text>
        <text x="475" y="128" class="cy-txt">3. Start P1 at H0, P2 at Meet; step 1x each</text>
        <text x="475" y="150" class="cy-txt">   --&gt; P1 and P2 collide at E after mu steps!</text>

        <text x="15" y="190" class="cy-txt">Array Index Encoding (Find Duplicate in [1..N]): Treat i -&gt; nums[i] as a functional graph; index 0 has in-degree 0!</text>
      </svg>

      <h3>Functional Graph Reduction: Finding Duplicates in $O(1)$ Space Without Mutating Array</h3>
      <div class="mermaid">
      flowchart LR
        A["Array nums[0..N]<br/>Values in [1..N]"] --> B["Implicit Directed Graph:<br/>Edge i -> nums[i]"]
        B --> C["Index 0 has in-degree 0<br/>(Since all values >= 1)"]
        C --> D["Duplicate value v has<br/>in-degree >= 2 (Cycle Entrance E!)"]
        D --> E["Run Floyd or Brent from 0<br/>Return E in O(N) time, O(1) space"]
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Why Brent's Algorithm Dominates Pollard's Rho &amp; Pointer Chasing</div>
        <p>In pointer-chasing workloads where nodes do not fit in L1/L2 cache, every pointer dereference stalls the CPU for ~60–100 ns waiting on DRAM. In Floyd's algorithm, the Tortoise lags behind the Hare by $k / 2$ nodes; if the cycle exceeds L2 cache capacity, the Hare's cache lines are evicted before the Tortoise reaches them, so <strong>all 3 pointer dereferences per iteration miss cache</strong>! In Brent's algorithm, the Tortoise sits completely stationary in a CPU register while only the Hare advances 1 step per iteration—cutting DRAM traffic and ALU evaluations by up to $3\\times$ per step.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-linked-list-floyd"></div>

      <h3>Production Implementation: Floyd's Entrance Finder &amp; Brent's Cycle Detector</h3>
      <pre><code class="language-cpp">#include &lt;cstddef&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

struct ListNode {
  int val;
  ListNode* next;
};

// Floyd's Tortoise and Hare: Returns cycle entrance node (or nullptr if acyclic)
ListNode* floyd_find_cycle_entrance(ListNode* head) noexcept {
  ListNode* slow = head;
  ListNode* fast = head;

  // Phase 1: Find meeting point inside cycle
  while (fast != nullptr &amp;&amp; fast-&gt;next != nullptr) {
    slow = slow-&gt;next;
    fast = fast-&gt;next-&gt;next;
    if (slow == fast) {
      // Phase 2: Reset one pointer to head; advance both at speed 1
      ListNode* finder = head;
      while (finder != slow) {
        finder = finder-&gt;next;
        slow = slow-&gt;next;
      }
      return finder; // Exact cycle entrance!
    }
  }
  return nullptr;
}

// Brent's Teleporting Turtle: Returns {cycle_entrance, cycle_length_lambda}
std::pair&lt;ListNode*, std::size_t&gt; brent_find_cycle(ListNode* head) noexcept {
  if (head == nullptr) return {nullptr, 0};

  std::size_t power = 1;
  std::size_t lambda = 1;
  ListNode* tortoise = head;
  ListNode* hare = head-&gt;next;

  // Phase 1: Find cycle length lambda with 1 pointer chase per iteration!
  while (hare != nullptr &amp;&amp; tortoise != hare) {
    if (power == lambda) {
      tortoise = hare; // Teleport tortoise to hare
      power *= 2;
      lambda = 0;
    }
    hare = hare-&gt;next;
    ++lambda;
  }
  if (hare == nullptr) return {nullptr, 0};

  // Phase 2: Advance hare lambda steps ahead of head, then move both at speed 1
  tortoise = head;
  hare = head;
  for (std::size_t i = 0; i &lt; lambda; ++i) {
    hare = hare-&gt;next;
  }
  while (tortoise != hare) {
    tortoise = tortoise-&gt;next;
    hare = hare-&gt;next;
  }
  return {tortoise, lambda};
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Starting <code>slow = head</code> and <code>fast = head-&gt;next</code> Breaks Phase 2 Entrance Math!</div>
        <p>A frequent bug in Floyd's cycle entrance implementation is initializing <code>slow = head; fast = head-&gt;next;</code> in Phase 1 (to make a <code>while (slow != fast)</code> loop condition work) and then running standard Phase 2 (<code>finder = head; while (finder != slow) ...</code>). If <code>fast</code> starts at <code>head->next</code> (1 step ahead at $k = 0$), then after $k$ steps <code>fast</code> is at $2k + 1$ while <code>slow</code> is at $k$, so their meeting satisfies $k + 1 = m \\lambda$, shifting the meeting point backward by 1 node and causing Phase 2 to spin forever or return the wrong node! Always initialize <strong>both</strong> <code>slow = head</code> and <code>fast = head</code> at step $0$ and step them <em>before</em> testing <code>if (slow == fast)</code>.</p>
      </div>
    `,
    keyTakeaways: [
      "In Floyd's Tortoise and Hare, the pointers meet at step k = m * lambda inside the cycle, leaving the slow pointer exactly (-mu mod lambda) steps past the cycle entrance E.",
      "Resetting one pointer to head and stepping both pointers by 1 causes them to collide at the exact cycle entrance E after mu steps.",
      "Brent's cycle detection keeps the Tortoise stationary and teleports it to the Hare at powers of two (2^i), performing only 1 pointer chase per step and yielding the cycle length lambda directly.",
      "Any read-only array of N + 1 integers with values in [1..N] forms an implicit functional graph i -> nums[i] rooted at 0, where the duplicate value is the cycle entrance."
    ],
    furtherReading: [
      {
        title: "Richard P. Brent — An Improved Monte Carlo Factorization Algorithm (BIT Numerical Mathematics, 1980)",
        url: "https://maths-people.anu.edu.au/~brent/pd/rpb051i.pdf",
        type: "Seminal Paper"
      },
      {
        title: "Donald E. Knuth — The Art of Computer Programming, Vol. 2: Seminumerical Algorithms (Section 3.1, Exercise 6: Floyd's Cycle Detection)",
        url: "https://www-cs-faculty.stanford.edu/~knuth/taocp.html",
        type: "Seminal Book"
      }
    ]
  },

  "unrolled-linked-lists-ropes": {
    title: "Unrolled Linked Lists & Gap Buffers: Defeating Pointer Chasing",
    video: {
      youtubeId: "34ky600VTN0",
      id: "34ky600VTN0",
      url: "https://www.youtube.com/embed/34ky600VTN0",
      title: "Why Linked Lists vs Contiguous Arrays Isn't a Real Choice (CPU Cache Locality)",
      channel: "SimonDev",
      duration: "14:52",
      start: 0,
      length: "14m",
      why: "Deep-dive lecture covering Unrolled Linked Lists & Gap Buffers: Defeating Pointer Chasing."
    },
    intuition: "A standard linked list pays 16 bytes of pointer overhead and a full 64-byte cache-line miss for every single element. Packing $B$ elements into each node's inline array (an Unrolled Linked List, sized so each node equals 1–2 cache lines) amortizes pointer overhead by $B\\times$ and turns pointer chasing into sequential SIMD/cache-line streaming—while Gap Buffers and Ropes apply the same cache-locality principle to text editors.",
    content: `
      <h3>Defeating the Pointer Tax: Unrolled Linked Lists</h3>
      <p>Consider storing 4-byte <code>int32_t</code> integers in a 64-bit doubly linked list (<code>std::list&lt;int32_t&gt;</code>). Each node contains 8B <code>prev</code> + 8B <code>next</code> + 4B <code>val</code> + 4B alignment padding + 8B–16B <code>malloc</code> chunk header = <strong>32 to 40 bytes per 4-byte integer</strong> ($800\\% - 1000\\%$ memory bloat!), and traversing $N$ elements incurs $N$ dependent pointer-chasing cache misses.</p>
      <p>An <strong>Unrolled Linked List</strong> replaces the single element in each node with a small inline array <code>T elements[B]</code> and an occupancy counter <code>uint16_t count</code>. When we size the node to match a single 64-byte CPU cache line (e.g., 8B <code>prev</code> + 8B <code>next</code> + 4B <code>count</code> + eleven 4-byte integers = 64 bytes):</p>
      <ul>
        <li><strong>Cache Miss Reduction:</strong> Fetching a single node into L1d brings in up to $B$ consecutive elements simultaneously, reducing cache misses during sequential traversal from $N$ to $\\approx N / B$.</li>
        <li><strong>B-Tree Split/Merge Occupancy Invariant:</strong> Every interior node maintains occupancy $count \\in [\\lceil B / 2 \\rceil, B]$. Inserting into a full node ($count == B$) allocates a new sibling node and moves the upper $B / 2$ elements into it in a single cache-line register write ($O(B) = O(1)$ time), guaranteeing at least $50\\%$ space utilization across all nodes!</li>
      </ul>

      <div class="invariant-box">
        <div class="invariant-title">Architectural Invariant: Gap Buffers vs. Ropes / Piece Tables in Text Editors</div>
        <p>Why does GNU Emacs use a <strong>Gap Buffer</strong> while Zed and Xi-Editor use a <strong>Rope</strong> (or B-Tree Piece Table in VS Code)?
        <ul>
          <li><strong>Gap Buffer:</strong> Stores the document as a single contiguous array with an empty "gap" <code>[gap_start .. gap_end)</code> located right at the user's cursor: <code>[Prefix Text: 0 .. gap_start) [ FREE GAP ] [Suffix Text: gap_end .. cap)</code>. Typing or backspacing at the cursor simply increments or decrements <code>gap_start</code> in <strong>$O(1)$ worst-case time with 100% contiguous array locality</strong>! Moving the cursor by $k$ characters shifts $k$ bytes across the gap via <code>std::memmove</code> in $O(k)$ time.</li>
          <li><strong>Rope (Weight-Balanced Tree of String Leaves):</strong> Represents a large document as a balanced tree where each leaf holds a short flat string chunk (e.g., 512–1024 bytes) and each internal node caches the total byte/UTF-8/line length of its left subtree. Splitting, concatenating, or inserting anywhere in a 1 GB file takes $O(\\log N)$ time without ever moving megabytes of memory!</li>
        </ul>
        </p>
      </div>

      <h3>Sequence Data Structure Trade-Off Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Data Structure</th>
            <th>Index Lookup $A[i]$</th>
            <th>Insert at Cursor</th>
            <th>Move Cursor by $\\Delta$</th>
            <th>Cache Misses (Scan $N$)</th>
            <th>Production Adopters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Doubly Linked List</td>
            <td>$O(N)$</td>
            <td>$O(1)$</td>
            <td>$O(\\Delta)$ chases</td>
            <td>$\\Theta(N)$</td>
            <td>Intrusive kernel queues only</td>
          </tr>
          <tr>
            <td>Unrolled Linked List (Block $B$)</td>
            <td>$O(N / B)$</td>
            <td>$O(B)$</td>
            <td>$O(1 + \\Delta / B)$</td>
            <td>$\\Theta(N / B)$</td>
            <td>SkipList/B+Tree leaves, Slab queues</td>
          </tr>
          <tr>
            <td>Gap Buffer</td>
            <td>$O(1)$ (1 branch: $i &lt; \\text{gap\\_start}$)</td>
            <td>$O(1)$ amortized</td>
            <td>$O(\\Delta)$ (<code>memmove</code>)</td>
            <td>$\\Theta(N / L_{\\text{line}})$ (Optimal)</td>
            <td>GNU Emacs, Scintilla (Notepad++)</td>
          </tr>
          <tr>
            <td>Rope / B-Tree Piece Table</td>
            <td>$O(\\log N)$</td>
            <td>$O(\\log N)$</td>
            <td>$O(\\log N)$</td>
            <td>$\\Theta(N / B_{\\text{leaf}})$</td>
            <td>VS Code (Piece Tree), Zed (SumTree Rope)</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing Cache-Line-Sized Unrolled Nodes &amp; The Gap Buffer Split</h3>
      <svg viewBox="0 0 760 205" width="100%" height="auto" role="img" aria-label="64-byte cache-line unrolled linked list node and Gap Buffer cursor">
        <style>
          .ul-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .ul-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .ul-hdr { fill: rgba(245, 158, 11, 0.22); stroke: #f59e0b; stroke-width: 1.5; }
          .ul-elem { fill: rgba(16, 185, 129, 0.22); stroke: #10b981; stroke-width: 1.5; }
          .ul-gap { fill: rgba(148, 163, 184, 0.14); stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 4 2; }
          .ul-suf { fill: rgba(59, 130, 246, 0.22); stroke: #3b82f6; stroke-width: 1.5; }
        </style>
        <text x="15" y="22" class="ul-title">Unrolled Linked List Node: Exact 64-Byte CPU Cache Line (B = 11 x int32_t + 20B Metadata)</text>

        <rect x="15" y="36" width="85" height="42" rx="3" class="ul-hdr"/>
        <text x="57" y="61" text-anchor="middle" class="ul-txt">prev (8B)</text>
        <rect x="104" y="36" width="85" height="42" rx="3" class="ul-hdr"/>
        <text x="146" y="61" text-anchor="middle" class="ul-txt">next (8B)</text>
        <rect x="193" y="36" width="75" height="42" rx="3" class="ul-hdr"/>
        <text x="230" y="61" text-anchor="middle" class="ul-txt">cnt (4B)</text>
        <rect x="272" y="36" width="470" height="42" rx="3" class="ul-elem"/>
        <text x="507" y="55" text-anchor="middle" class="ul-txt">elements[0 .. 10]: Eleven Contiguous int32_t (44 Bytes)</text>
        <text x="507" y="71" text-anchor="middle" class="ul-txt">--&gt; 1 Cache Miss Loads 11 Elements; Pointer Overhead Drops from 400% to 36%!</text>

        <text x="15" y="112" class="ul-title">Gap Buffer Layout: O(1) Cursor Insertions &amp; O(1) Branch-Offset Random Access</text>
        <rect x="15" y="126" width="240" height="42" rx="3" class="ul-elem"/>
        <text x="135" y="151" text-anchor="middle" class="ul-txt">Prefix [0 .. gap_start)</text>

        <rect x="259" y="126" width="210" height="42" rx="3" class="ul-gap"/>
        <text x="364" y="145" text-anchor="middle" class="ul-txt">FREE GAP [gap_start .. gap_end)</text>
        <text x="364" y="161" text-anchor="middle" class="ul-txt">^ Cursor Inserts Here in O(1)</text>

        <rect x="473" y="126" width="269" height="42" rx="3" class="ul-suf"/>
        <text x="607" y="151" text-anchor="middle" class="ul-txt">Suffix [gap_end .. cap)</text>

        <text x="15" y="192" class="ul-txt">Logical Index i Lookup: buf[i + (i &gt;= gap_start ? (gap_end - gap_start) : 0)] --&gt; O(1) time!</text>
      </svg>

      <h3>Unrolled Node Overflow &amp; Half-Split Lifecycle</h3>
      <div class="mermaid">
      flowchart LR
        A["Insert val into Node u<br/>at local index idx"] --> B{"u.count == B?<br/>(Node Full)"}
        B -- "No (< B)" --> C["memmove u.elems[idx..count]<br/>Write val, u.count++"]
        B -- "Yes (== B)" --> D["Allocate sibling Node v<br/>Move upper B/2 elems to v<br/>Link u <-> v"]
        D --> E["Insert val into u or v<br/>Both nodes >= B/2 full!"]
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Why Moving 32 Bytes Inside a Cache Line Is Virtually Free</div>
        <p>Beginners often worry that inserting into the middle of an Unrolled Linked List node (or shifting a local Gap Buffer) requires shifting up to $B$ elements. On modern CPUs, an entire 64-byte cache line fits inside a <strong>single 512-bit ZMM register</strong> (or two 256-bit YMM registers). Shifting 32–44 bytes within an already-fetched L1 cache line executes in <strong>1 to 2 clock cycles (~0.5 nanoseconds)</strong>, whereas chasing a single pointer to a cold heap node in DRAM costs <strong>~200 clock cycles (~70 nanoseconds)</strong>. Trading intra-cache-line shifts for fewer pointer hops is the fundamental design law of modern in-memory data structures (B+Trees, SwissTable, Abseil <code>inlined_vector</code>, Unrolled Lists).</p>
      </div>

      <div class="simulator-mount" data-sim="sim-unrolled-rope-blocks"></div>

      <h3>Production Implementation: Generic Gap Buffer Engine</h3>
      <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cassert&gt;
#include &lt;cstddef&gt;
#include &lt;cstring&gt;
#include &lt;vector&gt;

class GapBuffer {
  std::vector&lt;char&gt; buf_;
  std::size_t gap_start_ = 0;
  std::size_t gap_end_;

  std::size_t gap_size() const noexcept { return gap_end_ - gap_start_; }

  void expand_gap(std::size_t min_gap) {
    const std::size_t old_size = size();
    const std::size_t new_cap = std::max(buf_.size() * 2, old_size + min_gap + 64);
    std::vector&lt;char&gt; next_buf(new_cap);

    // Copy prefix [0 .. gap_start_) to start of next_buf
    std::memcpy(next_buf.data(), buf_.data(), gap_start_);
    // Copy suffix [gap_end_ .. buf_.size()) to end of next_buf
    const std::size_t suffix_len = buf_.size() - gap_end_;
    const std::size_t new_gap_end = new_cap - suffix_len;
    std::memcpy(next_buf.data() + new_gap_end, buf_.data() + gap_end_, suffix_len);

    buf_ = std::move(next_buf);
    gap_end_ = new_gap_end;
  }

public:
  explicit GapBuffer(std::size_t initial_cap = 64)
      : buf_(initial_cap), gap_start_(0), gap_end_(initial_cap) {}

  std::size_t size() const noexcept { return buf_.size() - gap_size(); }

  // Move cursor (gap_start_) to logical position pos via overlapping-safe memmove
  void move_cursor(std::size_t pos) noexcept {
    assert(pos &lt;= size());
    if (pos &lt; gap_start_) {
      const std::size_t delta = gap_start_ - pos;
      std::memmove(buf_.data() + gap_end_ - delta, buf_.data() + pos, delta);
      gap_start_ -= delta;
      gap_end_ -= delta;
    } else if (pos &gt; gap_start_) {
      const std::size_t delta = pos - gap_start_;
      std::memmove(buf_.data() + gap_start_, buf_.data() + gap_end_, delta);
      gap_start_ += delta;
      gap_end_ += delta;
    }
  }

  // O(1) amortized insertion at cursor
  void insert_char(char c) {
    if (gap_start_ == gap_end_) expand_gap(1);
    buf_[gap_start_++] = c;
  }

  // O(1) backspace deletion before cursor
  void backspace() noexcept {
    if (gap_start_ &gt; 0) --gap_start_;
  }

  // O(1) branchless random access to logical index i
  char operator[](std::size_t i) const noexcept {
    const std::size_t offset = (i &gt;= gap_start_) ? gap_size() : 0;
    return buf_[i + offset];
  }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Using <code>memcpy</code> Instead of <code>memmove</code> When Sliding the Gap</div>
        <p>When moving the cursor in a Gap Buffer by a small distance $\\Delta &lt; \\text{gap\\_size()}$, the source range and destination range do not overlap; however, when $\\Delta &gt; \\text{gap\\_size()}$, the source range <code>[pos .. gap_start_)</code> and destination range <code>[gap_end_ - delta .. gap_end_)</code> <strong>physically overlap in memory</strong>! Calling <code>std::memcpy</code> on overlapping memory regions is Undefined Behavior in C/C++ and corrupts text when vectorized AVX backwards/forwards copies overwrite bytes before reading them. Always use <code>std::memmove</code> when sliding a gap buffer or shifting elements inside an unrolled list node.</p>
      </div>
    `,
    keyTakeaways: [
      "Unrolled linked lists pack B elements into each 64-byte cache-line node, cutting pointer overhead by B times and reducing sequential scan cache misses from Theta(N) to Theta(N / B).",
      "Splitting full unrolled nodes into two half-full nodes (B/2 elements each) guarantees at least 50% memory utilization and O(1) intra-cache-line insertion.",
      "A Gap Buffer places spare array capacity directly at the active cursor [gap_start .. gap_end), enabling O(1) cursor insertions/deletions and O(1) random access via buf[i + (i >= gap_start ? gap_len : 0)].",
      "For large multi-megabyte documents with non-local edits or multi-cursor editing, Ropes and B-Tree Piece Tables provide O(log N) splits and inserts at arbitrary offsets."
    ],
    furtherReading: [
      {
        title: "Hans-J. Boehm, Russ Atkinson, Michael Plass — Ropes: An Alternative to Strings (Software: Practice and Experience, 1995)",
        url: "https://dl.acm.org/doi/10.1002/spe.4380251203",
        type: "Seminal Paper"
      },
      {
        title: "Pat Morin — Open Data Structures, Chapter 3.3: SEList (A Space-Efficient Unrolled Linked List)",
        url: "https://opendatastructures.org/ods-cpp/3_3_SEList_Space_Efficient_.html",
        type: "Textbook"
      }
    ]
  },

  "skip-lists-probabilistic-indexing": {
    title: "Skip Lists: Probabilistic Multi-Level Indexing & O(log N) Search Proof",
    video: {
      youtubeId: "kBwUoWpeH_Q",
      id: "kBwUoWpeH_Q",
      url: "https://www.youtube.com/embed/kBwUoWpeH_Q",
      id: "kBwUoWpeH_Q",
      url: "https://www.youtube.com/embed/kBwUoWpeH_Q",
      title: "MIT 6.046J Lecture 12: Skip Lists (Erik Demaine)",
      channel: "MIT OpenCourseWare",
      duration: "1 hr 19 min"
    },
    intuition: "William Pugh invented the Skip List in 1989 as a probabilistic alternative to complex self-balancing BST rotations. By promoting each inserted node to level $h+1$ with independent coin-flip probability $p$, a Skip List builds a hierarchy of express lanes where the reverse search path climbs $O(\\log N)$ levels in expectation with high probability—and supports lock-free <code>CAS</code> concurrency far more easily than Red-Black Trees.",
    content: `
      <h3>Probabilistic Express Lanes &amp; The Backwards Search Proof</h3>
      <p>In a sorted singly linked list, even though the keys are ordered, binary search is impossible because we lack random access. Suppose we construct a hierarchy of linked lists $L_0, L_1, \\dots, L_{H}$: level $L_0$ contains all $N$ elements, and each element present in level $L_k$ is independently promoted to level $L_{k+1}$ with probability $p \\in (0, 1)$ (typically $p = 1/2$ or $p = 1/4$). Search starts at the highest level of the sentinel head node: at the current node $u$ and level $k$, we advance horizontally (<code>u = u-&gt;forward[k]</code>) as long as <code>u-&gt;forward[k]-&gt;key &lt; target</code>; when the next key would overshoot <code>target</code> (or is <code>nullptr</code>), we drop down vertically to level $k - 1$.</p>
      <p>How do we prove that the expected search cost is $O(\\log N)$? Follow Pugh's elegant <strong>Backwards Analysis</strong>: trace the search path <em>in reverse</em>, starting from the found node at level $0$ and climbing up and left back to the sentinel head at level $H$. At any node on the reverse path at level $k$:</p>
      <ul>
        <li>Did we arrive at this node by dropping down from level $k+1$? That happens if and only if this node's tower was promoted to level $k+1$, which occurs with probability $p$ (we climb <strong>UP</strong> 1 level).</li>
        <li>Otherwise, with probability $1 - p$, this node's tower stopped at level $k$, so the forward search must have reached it horizontally from the left (we step <strong>LEFT</strong> 1 node at level $k$).</li>
      </ul>

      <div class="invariant-box">
        <div class="invariant-title">Probabilistic Invariant: Expected Pointers per Node $= \\frac{1}{1 - p}$ &amp; Expected Search Cost $= \\frac{\\log_{1/p} N}{p}$</div>
        <p>Let $C(K)$ be the expected number of reverse steps required to climb $K$ levels. In one step ($+1$), with probability $p$ we climb up to $K - 1$ remaining levels, and with probability $1 - p$ we move left and still have $K$ levels to climb:</p>
        <p>$$C(K) = 1 + p \\cdot C(K - 1) + (1 - p) \\cdot C(K) \\implies p \\cdot C(K) = 1 + p \\cdot C(K - 1) \\implies C(K) = \\frac{K}{p}$$</p>
        <p>Since the expected number of nodes at level $L = \\log_{1/p} N$ is $N \\cdot p^L = 1$, setting $K = \\log_{1/p} N$ yields an expected search path length of $\\frac{\\log_{1/p} N}{p} = O(\\log N)$! Meanwhile, the number of forward pointers in a node's tower follows a Geometric($1 - p$) distribution with expected height:</p>
        <p>$$\\mathbb{E}[\\text{height}] = \\sum_{k=0}^{\\infty} p^k = \\frac{1}{1 - p}$$</p>
        <p>For $p = 1/2$, each node stores on average $\\frac{1}{1 - 1/2} = 2.0$ pointers. For $p = 1/4$ (used by <strong>Redis <code>zskiplist</code></strong> and <strong>LevelDB / RocksDB <code>MemTable</code></strong>), each node stores on average only $\\frac{1}{1 - 1/4} = 1.333$ pointers—less pointer overhead than a binary tree ($2.0$ pointers/node)!</p>
      </div>

      <h3>Skip List Parameter Trade-Offs ($p = 1/2$ vs. $p = 1/4$ vs. Balanced BSTs)</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Structure</th>
            <th>Avg Pointers / Node</th>
            <th>Expected Comparisons</th>
            <th>Insert Rebalancing</th>
            <th>Lock-Free Concurrent Insert</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Skip List ($p = 1/2$)</td>
            <td>$2.00$ pointers</td>
            <td>$2 \\log_2 N$</td>
            <td>Local pointer splice (0 rotations)</td>
            <td><strong>Trivial</strong> bottom-up atomic <code>CAS</code></td>
          </tr>
          <tr>
            <td>Skip List ($p = 1/4$, Redis / RocksDB)</td>
            <td><strong>$1.33$ pointers</strong></td>
            <td>$4 \\log_4 N = 2 \\log_2 N$</td>
            <td>Local pointer splice (0 rotations)</td>
            <td><strong>Trivial</strong> bottom-up atomic <code>CAS</code></td>
          </tr>
          <tr>
            <td>Red-Black / AVL Tree</td>
            <td>$2.00 - 3.00$ pointers (+ color/parent)</td>
            <td>$\\approx 1.0 - 1.44 \\log_2 N$</td>
            <td>Up to $O(\\log N)$ tree rotations</td>
            <td>Extremely hard (multi-word rotation locks)</td>
          </tr>
          <tr>
            <td>B+Tree (Fanout $B = 16$)</td>
            <td>$\\approx 1.1$ per key</td>
            <td>$\\log_2 N$ (in-cache)</td>
            <td>Node split/merge</td>
            <td>Latch crabbing / Bw-Tree</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing Express Lanes &amp; The <code>update[0..level]</code> Predecessor Splice Vector</h3>
      <svg viewBox="0 0 760 210" width="100%" height="auto" role="img" aria-label="Skip list multi-level indexing and update vector splice">
        <style>
          .sk-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .sk-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .sk-node { fill: rgba(59, 130, 246, 0.18); stroke: #3b82f6; stroke-width: 1.5; }
          .sk-upd { fill: rgba(245, 158, 11, 0.28); stroke: #f59e0b; stroke-width: 2; }
          .sk-new { fill: rgba(16, 185, 129, 0.28); stroke: #10b981; stroke-width: 2; }
        </style>
        <text x="15" y="22" class="sk-title">Skip List Search &amp; Insert for Key 42 (Highlighted Orange = update[k] Predecessors Where Search Drops Down)</text>

        <rect x="20" y="42" width="68" height="30" rx="3" class="sk-upd"/>
        <text x="54" y="61" text-anchor="middle" class="sk-txt">HEAD L2</text>
        <rect x="20" y="76" width="68" height="30" rx="3" class="sk-node"/>
        <text x="54" y="95" text-anchor="middle" class="sk-txt">HEAD L1</text>
        <rect x="20" y="110" width="68" height="30" rx="3" class="sk-node"/>
        <text x="54" y="129" text-anchor="middle" class="sk-txt">HEAD L0</text>

        <rect x="155" y="76" width="65" height="30" rx="3" class="sk-upd"/>
        <text x="187" y="95" text-anchor="middle" class="sk-txt">17 L1</text>
        <rect x="155" y="110" width="65" height="30" rx="3" class="sk-node"/>
        <text x="187" y="129" text-anchor="middle" class="sk-txt">17 L0</text>

        <rect x="290" y="110" width="65" height="30" rx="3" class="sk-upd"/>
        <text x="322" y="129" text-anchor="middle" class="sk-txt">31 L0</text>

        <rect x="425" y="76" width="75" height="30" rx="3" class="sk-new"/>
        <text x="462" y="95" text-anchor="middle" class="sk-txt">NEW 42 L1</text>
        <rect x="425" y="110" width="75" height="30" rx="3" class="sk-new"/>
        <text x="462" y="129" text-anchor="middle" class="sk-txt">NEW 42 L0</text>

        <rect x="575" y="42" width="65" height="30" rx="3" class="sk-node"/>
        <text x="607" y="61" text-anchor="middle" class="sk-txt">55 L2</text>
        <rect x="575" y="76" width="65" height="30" rx="3" class="sk-node"/>
        <text x="607" y="95" text-anchor="middle" class="sk-txt">55 L1</text>
        <rect x="575" y="110" width="65" height="30" rx="3" class="sk-node"/>
        <text x="607" y="129" text-anchor="middle" class="sk-txt">55 L0</text>

        <text x="20" y="166" class="sk-txt">update[] captures rightmost node &lt; 42 at each level: update[2]=HEAD, update[1]=17, update[0]=31</text>
        <text x="20" y="188" class="sk-txt">Rank / Order Statistics: Storing span[k] (number of L0 nodes skipped by forward[k]) gives O(log N) k-th element lookup!</text>
      </svg>

      <h3>Why RocksDB &amp; Java <code>ConcurrentSkipListMap</code> Use Skip Lists Over Red-Black Trees</h3>
      <div class="mermaid">
      flowchart LR
        A["Concurrent Writers in<br/>RocksDB MemTable"] --> B["Red-Black Tree:<br/>Insert triggers bottom-up rotations<br/>Mutates root/grandparent pointers<br/>Requires coarse subtree locks"]
        A --> C["Lock-Free Skip List:<br/>Node height chosen via PRNG<br/>Link Level 0 via atomic CAS first!<br/>Then link higher levels 1..h via CAS"]
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Flexible Array Members (<code>forward[]</code>) &amp; Single-Allocation Towers</div>
        <p>A naive Skip List implementation defines <code>struct Node { int key; std::vector&lt;Node*&gt; forward; }</code>. That design is a cache disaster: every node incurs <strong>two</strong> separate heap allocations (one for the <code>Node</code> and one for the <code>std::vector</code>'s dynamic buffer), and stepping <code>u->forward[k]</code> requires an extra pointer dereference to reach the vector's heap array! Production Skip Lists (such as Redis's <code>zskiplistNode</code> and LevelDB's <code>SkipList::Node</code>) allocate the <code>Node</code> header and its exact $h$-element <code>Node* forward[h]</code> array in a <strong>single contiguous block of memory</strong> of size <code>sizeof(Node) + h * sizeof(Node*)</code> using a C99 flexible array member (or placement <code>new</code>), keeping the key and its tower pointers in the same 64-byte cache line.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-skiplist-lanes"></div>

      <h3>Production Implementation: Single-Allocation Skip List with $p = 1/4$ Geometric PRNG</h3>
      <pre><code class="language-cpp">#include &lt;array&gt;
#include &lt;cstdint&gt;
#include &lt;cstdlib&gt;
#include &lt;new&gt;

class SkipList {
  static constexpr int MAX_LEVEL = 16; // Supports up to 4^16 = 4.29B elements

  struct Node {
    int key;
    int value;
    int top_level;
    Node* forward[1]; // Flexible trailing array allocated to size <code>top_level + 1</code>
  };

  Node* head_;
  int cur_max_level_ = 0;
  std::uint64_t rng_state_ = 0x853c49e6748fea9bULL;

  static Node* allocate_node(int key, int val, int level) {
    const std::size_t bytes = sizeof(Node) + static_cast&lt;std::size_t&gt;(level) * sizeof(Node*);
    void* raw = ::operator new(bytes);
    Node* node = static_cast&lt;Node*&gt;(raw);
    node-&gt;key = key;
    node-&gt;value = val;
    node-&gt;top_level = level;
    for (int i = 0; i &lt;= level; ++i) node-&gt;forward[i] = nullptr;
    return node;
  }

  // Fast xorshift64* PRNG sampling Geometric(p = 1/4) height
  int random_level() noexcept {
    int lvl = 0;
    while (lvl &lt; MAX_LEVEL - 1) {
      rng_state_ ^= rng_state_ &gt;&gt; 12;
      rng_state_ ^= rng_state_ &lt;&lt; 25;
      rng_state_ ^= rng_state_ &gt;&gt; 27;
      if (((rng_state_ * 0x2545F4914F6CDD1DULL) &gt;&gt; 62) != 0) break; // 1/4 probability
      ++lvl;
    }
    return lvl;
  }

public:
  SkipList() {
    head_ = allocate_node(-2147483648, 0, MAX_LEVEL - 1);
  }

  const int* find(int target) const noexcept {
    const Node* curr = head_;
    for (int i = cur_max_level_; i &gt;= 0; --i) {
      while (curr-&gt;forward[i] != nullptr &amp;&amp; curr-&gt;forward[i]-&gt;key &lt; target) {
        curr = curr-&gt;forward[i];
      }
    }
    curr = curr-&gt;forward[0];
    if (curr != nullptr &amp;&amp; curr-&gt;key == target) return &amp;curr-&gt;value;
    return nullptr;
  }

  void insert(int key, int value) {
    std::array&lt;Node*, MAX_LEVEL&gt; update{};
    Node* curr = head_;

    for (int i = cur_max_level_; i &gt;= 0; --i) {
      while (curr-&gt;forward[i] != nullptr &amp;&amp; curr-&gt;forward[i]-&gt;key &lt; key) {
        curr = curr-&gt;forward[i];
      }
      update[i] = curr;
    }

    curr = curr-&gt;forward[0];
    if (curr != nullptr &amp;&amp; curr-&gt;key == key) {
      curr-&gt;value = value;
      return;
    }

    const int new_lvl = random_level();
    if (new_lvl &gt; cur_max_level_) {
      for (int i = cur_max_level_ + 1; i &lt;= new_lvl; ++i) {
        update[i] = head_;
      }
      cur_max_level_ = new_lvl;
    }

    Node* inserted = allocate_node(key, value, new_lvl);
    for (int i = 0; i &lt;= new_lvl; ++i) {
      inserted-&gt;forward[i] = update[i]-&gt;forward[i];
      update[i]-&gt;forward[i] = inserted;
    }
  }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Unbounded <code>MAX_LEVEL</code> &amp; Adversarial Seed Attacks</div>
        <p>Never allow <code>random_level()</code> to grow unboundedly without a hard cap <code>MAX_LEVEL</code> (e.g., 16 or 32), or a lucky streak of coin flips on a 10-element list can create a 25-level tower where 20 levels contain only a single node—wasting vertical steps on every query. Furthermore, if you use a fixed deterministic PRNG seed while exposing a Skip List to untrusted external keys, an adversary who knows your PRNG sequence can time insertions so that high towers are assigned to useless keys and level-0 towers are assigned to hot keys; always seed the level generator from hardware entropy (<code>getrandom</code> / <code>std::random_device</code>).</p>
      </div>
    `,
    keyTakeaways: [
      "Skip Lists replace complex deterministic tree rotations with probabilistic multi-level express lanes, achieving O(log N) search, insert, and delete with high probability.",
      "Tracing the search path backwards from level 0 to the top of the head sentinel proves that climbing K levels takes K / p expected steps.",
      "With promotion probability p = 1/4 (used by Redis and RocksDB), the expected number of pointers per node is 1 / (1 - 1/4) = 1.33, using less memory than a binary search tree.",
      "In concurrent systems (RocksDB MemTable, Java ConcurrentSkipListMap), Skip Lists enable lock-free atomic CAS insertions because inserting a node only splices local forward pointers without global tree rotations."
    ],
    furtherReading: [
      {
        title: "William Pugh — Skip Lists: A Probabilistic Alternative to Balanced Trees (Communications of the ACM, 1990)",
        url: "https://15721.courses.cs.cmu.edu/spring2018/papers/08-oltpindexes1/pugh-skiplists-cacm1990.pdf",
        type: "Seminal Paper"
      },
      {
        title: "Pat Morin — Open Data Structures, Chapter 4: Skiplists (SkiplistSSet & SkiplistList)",
        url: "https://opendatastructures.org/ods-cpp/4_Skiplists.html",
        type: "Textbook"
      }
    ]
  },

  "stacks-expression-evaluation": {
    title: "Call Stacks, Dijkstra's Shunting-Yard Algorithm & AST Evaluation",
    video: {
      youtubeId: "Wz85Hiwi5MY",
      id: "Wz85Hiwi5MY",
      url: "https://www.youtube.com/embed/Wz85Hiwi5MY",
      id: "Wz85Hiwi5MY",
      url: "https://www.youtube.com/embed/Wz85Hiwi5MY",
      title: "Dijkstra's Shunting-Yard Algorithm & Stack Machines",
      channel: "Computerphile / University of Nottingham",
      duration: "12 min"
    },
    intuition: "Every recursive grammar or nested expression is evaluated by a Last-In-First-Out (LIFO) stack. While compilers lower recursive functions into hardware stack frames (<code>RSP</code>/<code>RBP</code>), Edsger Dijkstra's 1961 Shunting-Yard algorithm parses arbitrary infix expressions with precedence, parenthesization, and left/right associativity into Reverse Polish Notation (RPN) or evaluates them on the fly in $O(N)$ time using a single operator stack.",
    content: `
      <h3>Infix Ambiguity vs. Reverse Polish Notation (Postfix)</h3>
      <p>Why is an infix expression like $3 + 4 \\times 2 \\uparrow 3 \\uparrow 2$ ambiguous without precedence and associativity rules, whereas its Reverse Polish Notation (postfix) equivalent <code>3 4 2 3 2 ^ ^ * +</code> requires <strong>zero parentheses and zero precedence rules</strong>? Because in postfix notation, every operator appears immediately after its operands, encoding the exact post-order traversal of the Abstract Syntax Tree (AST)!</p>
      <p>Evaluating an RPN token stream is a single branch-free stack machine pass: scan tokens left to right; push numbers onto an operand stack; when a binary operator $\\circ$ arrives, pop the right operand $b$, pop the left operand $a$, and push $(a \\circ b)$.</p>

      <div class="invariant-box">
        <div class="invariant-title">Parsing Invariant: Dijkstra's Shunting-Yard Precedence &amp; Associativity Condition</div>
        <p>When converting an infix token stream into RPN using an operator stack <code>op_stack</code>, incoming operators must wait on the stack until their right operand has been completely parsed. When a new binary operator $o_1$ arrives and the top of <code>op_stack</code> is a non-parenthesis operator $o_2$, under what exact condition must $o_2$ be popped and emitted <em>before</em> pushing $o_1$?</p>
        <p>$$\\text{pop } o_2 \\iff \\text{prec}(o_2) &gt; \\text{prec}(o_1) \\;\\lor\\; \\big(\\text{prec}(o_2) == \\text{prec}(o_1) \\land \\text{isLeftAssociative}(o_1)\\big)$$</p>
        <p>Notice how a single boolean flip handles associativity: for left-associative subtraction $a - b - c = (a - b) - c$, the second $-$ sees $\\text{prec}(-) == \\text{prec}(-)$ with left-associativity and pops the first $-$, emitting <code>a b - c -</code>. For right-associative exponentiation $2 \\uparrow 3 \\uparrow 2 = 2^{(3^2)} = 512$, the second $\\uparrow$ sees $\\text{prec}(\\uparrow) == \\text{prec}(\\uparrow)$ with <strong>right-associativity</strong> and <em>does not pop</em> the first $\\uparrow$, pushing onto the stack to emit <code>2 3 2 ^ ^</code>!</p>
      </div>

      <h3>Operator Precedence, Associativity &amp; Unary Disambiguation</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Operator Token</th>
            <th>Precedence Level</th>
            <th>Associativity</th>
            <th>Arity</th>
            <th>Shunting-Yard Pop Condition against Stack Top $o_2$</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Unary <code>-</code> (negation) / <code>!</code></td>
            <td>4 (Highest)</td>
            <td>Right-to-Left</td>
            <td>1 (Unary)</td>
            <td>Pop $o_2$ only if $\\text{prec}(o_2) &gt; 4$</td>
          </tr>
          <tr>
            <td>Exponentiation <code>^</code></td>
            <td>3</td>
            <td>Right-to-Left</td>
            <td>2 (Binary)</td>
            <td>Pop $o_2$ if $\\text{prec}(o_2) &gt; 3$ (strictly greater!)</td>
          </tr>
          <tr>
            <td>Multiply / Divide <code>*</code>, <code>/</code>, <code>%</code></td>
            <td>2</td>
            <td>Left-to-Right</td>
            <td>2 (Binary)</td>
            <td>Pop $o_2$ if $\\text{prec}(o_2) \\ge 2$</td>
          </tr>
          <tr>
            <td>Add / Subtract <code>+</code>, <code>-</code></td>
            <td>1 (Lowest)</td>
            <td>Left-to-Right</td>
            <td>2 (Binary)</td>
            <td>Pop $o_2$ if $\\text{prec}(o_2) \\ge 1$</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing AST Post-Order Equivalence &amp; Two-Stack On-the-Fly Evaluation</h3>
      <svg viewBox="0 0 760 200" width="100%" height="auto" role="img" aria-label="Shunting yard AST post-order and two-stack evaluation">
        <style>
          .sy-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .sy-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .sy-op { fill: rgba(245, 158, 11, 0.25); stroke: #f59e0b; stroke-width: 1.5; }
          .sy-num { fill: rgba(59, 130, 246, 0.22); stroke: #3b82f6; stroke-width: 1.5; }
          .sy-out { fill: rgba(16, 185, 129, 0.22); stroke: #10b981; stroke-width: 1.5; }
        </style>
        <text x="15" y="22" class="sy-title">Expression: 3 + 4 * 2 ^ 3 ^ 2  ===  3 + (4 * (2 ^ (3 ^ 2))) = 2051</text>

        <text x="15" y="54" class="sy-txt">Operand Stack (vals)</text>
        <rect x="20" y="66" width="110" height="28" rx="3" class="sy-num"/>
        <text x="75" y="84" text-anchor="middle" class="sy-txt">2 (top)</text>
        <rect x="20" y="96" width="110" height="28" rx="3" class="sy-num"/>
        <text x="75" y="114" text-anchor="middle" class="sy-txt">3</text>
        <rect x="20" y="126" width="110" height="28" rx="3" class="sy-num"/>
        <text x="75" y="144" text-anchor="middle" class="sy-txt">2</text>
        <rect x="20" y="156" width="110" height="28" rx="3" class="sy-num"/>
        <text x="75" y="174" text-anchor="middle" class="sy-txt">4, 3</text>

        <text x="180" y="54" class="sy-txt">Operator Stack (ops)</text>
        <rect x="185" y="66" width="120" height="28" rx="3" class="sy-op"/>
        <text x="245" y="84" text-anchor="middle" class="sy-txt">^ (right-assoc)</text>
        <rect x="185" y="96" width="120" height="28" rx="3" class="sy-op"/>
        <text x="245" y="114" text-anchor="middle" class="sy-txt">^ (not popped!)</text>
        <rect x="185" y="126" width="120" height="28" rx="3" class="sy-op"/>
        <text x="245" y="144" text-anchor="middle" class="sy-txt">*</text>
        <rect x="185" y="156" width="120" height="28" rx="3" class="sy-op"/>
        <text x="245" y="174" text-anchor="middle" class="sy-txt">+</text>

        <rect x="355" y="62" width="385" height="122" rx="5" class="sy-out"/>
        <text x="370" y="86" class="sy-txt">Unary vs Binary '-' Detection Rule:</text>
        <text x="370" y="108" class="sy-txt">A '-' token is UNARY negation iff it occurs:</text>
        <text x="370" y="128" class="sy-txt">  1. At the very beginning of the expression, OR</text>
        <text x="370" y="148" class="sy-txt">  2. Immediately after '(' or another operator!</text>
        <text x="370" y="172" class="sy-txt">Pop Order Note: rhs = vals.pop(); lhs = vals.pop();</text>
      </svg>

      <h3>Shunting-Yard Token Dispatch &amp; Reduction Pipeline</h3>
      <div class="mermaid">
      flowchart TD
        A["Read Next Token T"] --> B{"Token Type?"}
        B -- "Number" --> C["vals.push(T)"]
        B -- "'('" --> D["ops.push('(')"]
        B -- "')'" --> E["While ops.top() != '('<br/>apply_top_op(vals, ops)<br/>Then pop '('"]
        B -- "Operator o1" --> F["While ops not empty &amp;&amp; ops.top() != '('<br/>&amp;&amp; (prec(o2) > prec(o1) || (prec== &amp;&amp; left_assoc))<br/>apply_top_op(vals, ops)"]
        F --> G["ops.push(o1)"]
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: The Hardware Return Stack Buffer (RSB) &amp; Explicit Heap Stacks</div>
        <p>When a program executes a machine <code>CALL</code> instruction, x86-64 and ARM64 CPUs push the return address not only onto the architectural stack in L1d (<code>[RSP]</code>), but also into a dedicated 16-to-32 entry hardware cache inside the branch predictor called the <strong>Return Stack Buffer (RSB)</strong>—allowing <code>RET</code> instructions to predict their jump target in 0 cycles! However, each OS thread's call stack is fixed to a contiguous 1 MB–8 MB virtual memory guard region. Recursive AST evaluation or DFS on a degenerate tree of depth $D = 200,000$ overflows the OS thread stack (<code>SIGSEGV</code> stack overflow), whereas an explicit <code>std::vector</code>-backed state stack grows dynamically on the heap up to available RAM and uses $4\\times$ less memory per frame than an ABI function call frame.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-monotonic-stack-queue"></div>

      <h3>Production Implementation: Shunting-Yard Evaluator with Unary Negation &amp; Exponentiation</h3>
      <pre><code class="language-cpp">#include &lt;cctype&gt;
#include &lt;cstdint&gt;
#include &lt;string_view&gt;
#include &lt;vector&gt;

class ExpressionEvaluator {
  enum class Op : char { Add = '+', Sub = '-', Mul = '*', Div = '/', Pow = '^', Neg = '~', LParen = '(' };

  static int precedence(Op op) noexcept {
    switch (op) {
      case Op::Add: case Op::Sub: return 1;
      case Op::Mul: case Op::Div: return 2;
      case Op::Pow:               return 3;
      case Op::Neg:               return 4;
      default:                    return 0;
    }
  }

  static bool is_right_assoc(Op op) noexcept {
    return op == Op::Pow || op == Op::Neg;
  }

  static std::int64_t ipow(std::int64_t base, std::int64_t exp) noexcept {
    if (exp &lt; 0) return 0;
    std::int64_t res = 1;
    while (exp &gt; 0) {
      if (exp &amp; 1) res *= base;
      base *= base;
      exp &gt;&gt;= 1;
    }
    return res;
  }

  static void apply_op(std::vector&lt;std::int64_t&gt;&amp; vals, Op op) noexcept {
    if (op == Op::Neg) {
      vals.back() = -vals.back();
      return;
    }
    // CRITICAL: First popped is RIGHT operand, second popped is LEFT operand!
    const std::int64_t rhs = vals.back(); vals.pop_back();
    const std::int64_t lhs = vals.back(); vals.pop_back();
    switch (op) {
      case Op::Add: vals.push_back(lhs + rhs); break;
      case Op::Sub: vals.push_back(lhs - rhs); break;
      case Op::Mul: vals.push_back(lhs * rhs); break;
      case Op::Div: vals.push_back(lhs / rhs); break;
      case Op::Pow: vals.push_back(ipow(lhs, rhs)); break;
      default: break;
    }
  }

public:
  static std::int64_t evaluate(std::string_view expr) {
    std::vector&lt;std::int64_t&gt; vals;
    std::vector&lt;Op&gt; ops;
    bool expect_unary = true; // True at start, after '(', or after any operator

    for (std::size_t i = 0; i &lt; expr.size();) {
      if (std::isspace(static_cast&lt;unsigned char&gt;(expr[i]))) {
        ++i;
        continue;
      }
      if (std::isdigit(static_cast&lt;unsigned char&gt;(expr[i]))) {
        std::int64_t num = 0;
        while (i &lt; expr.size() &amp;&amp; std::isdigit(static_cast&lt;unsigned char&gt;(expr[i]))) {
          num = num * 10 + (expr[i] - '0');
          ++i;
        }
        vals.push_back(num);
        expect_unary = false;
      } else if (expr[i] == '(') {
        ops.push_back(Op::LParen);
        expect_unary = true;
        ++i;
      } else if (expr[i] == ')') {
        while (!ops.empty() &amp;&amp; ops.back() != Op::LParen) {
          apply_op(vals, ops.back());
          ops.pop_back();
        }
        if (!ops.empty()) ops.pop_back(); // Pop '('
        expect_unary = false;
        ++i;
      } else {
        Op cur_op = static_cast&lt;Op&gt;(expr[i]);
        if (cur_op == Op::Sub &amp;&amp; expect_unary) {
          cur_op = Op::Neg;
        }
        while (!ops.empty() &amp;&amp; ops.back() != Op::LParen) {
          const int p_top = precedence(ops.back());
          const int p_cur = precedence(cur_op);
          if (p_top &gt; p_cur || (p_top == p_cur &amp;&amp; !is_right_assoc(cur_op))) {
            apply_op(vals, ops.back());
            ops.pop_back();
          } else {
            break;
          }
        }
        ops.push_back(cur_op);
        expect_unary = true;
        ++i;
      }
    }

    while (!ops.empty()) {
      apply_op(vals, ops.back());
      ops.pop_back();
    }
    return vals.empty() ? 0 : vals.back();
  }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Reversed Operand Pop Order &amp; Unary Minus Precedence</div>
        <p>Two classic bugs break stack-based expression evaluators:</p>
        <ol>
          <li><strong>Reversed Pop Order on Non-Commutative Operators:</strong> Because operands are pushed left-to-right onto the LIFO <code>vals</code> stack, the <strong>first</strong> value popped (<code>vals.back()</code>) is the <strong>right-hand operand (<code>rhs</code>)</strong>, and the second value popped is the <strong>left-hand operand (<code>lhs</code>)</strong>! Reversing them leaves <code>+</code> and <code>*</code> unaffected but computes <code>rhs - lhs</code> and <code>rhs / lhs</code> for subtraction, division, and exponentiation.</li>
          <li><strong>Replacing Unary <code>-x</code> with <code>0 - x</code> When Exponentiation Is Present:</strong> Pushing a dummy <code>0</code> before <code>-</code> works if only <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> exist, but fails on <code>2 ^ -3</code> or <code>-2 ^ 2</code> because binary <code>-</code> has precedence 1 while unary negation has higher precedence. Track a boolean state <code>expect_unary</code> (true at start of string, after <code>(</code>, or after any operator) to dispatch <code>-</code> as a dedicated unary operator <code>Op::Neg</code>.</li>
        </ol>
      </div>
    `,
    keyTakeaways: [
      "Reverse Polish Notation (postfix) encodes the exact post-order traversal of an Abstract Syntax Tree, eliminating parentheses and precedence rules during stack evaluation.",
      "In Dijkstra's Shunting-Yard algorithm, an incoming operator o1 pops stack-top operator o2 iff prec(o2) > prec(o1) OR (prec(o2) == prec(o1) and o1 is left-associative).",
      "When evaluating a binary operator from an operand stack, the first pop yields the right-hand operand (rhs) and the second pop yields the left-hand operand (lhs).",
      "Unary operators (such as unary minus) are disambiguated in O(1) by checking whether the previous token was the start of input, '(', or another operator."
    ],
    furtherReading: [
      {
        title: "Edsger W. Dijkstra — Algol 60 Translation: An Algol 60 Translator for the X1 (Mathematisch Centrum, 1961 — Original Shunting-Yard Paper)",
        url: "https://www.cs.utexas.edu/~EWD/MCReps/MR35.PDF",
        type: "Seminal Paper"
      },
      {
        title: "Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman — Compilers: Principles, Techniques, and Tools (Dragon Book, Chapter 2)",
        url: "https://suif.stanford.edu/dragonbook/",
        type: "Textbook"
      }
    ]
  },

  "monotonic-stack-next-greater": {
    title: "Monotonic Stacks: Next Greater Element, Histogram & Subarray Mins",
    video: {
      youtubeId: "zx5Sw9130L0",
      id: "zx5Sw9130L0",
      url: "https://www.youtube.com/embed/zx5Sw9130L0",
      title: "Largest Rectangle in Histogram — Monotonic Stack Invariants in O(N)",
      channel: "NeetCode",
      duration: "14:42",
      start: 0,
      length: "14m",
      why: "Deep-dive lecture covering Monotonic Stacks: Next Greater Element, Histogram & Subarray Mins."
    },
    intuition: "A monotonic stack maintains indices whose values are strictly ordered from bottom to top by evicting every dominated index as soon as a new element arrives. When an index $m$ is popped by incoming index $R$, $R$ is provably the first element to the right that breaks $m$'s dominance, while the element sitting immediately below $m$ on the stack ($L$) is the first element to the left that breaks $m$'s dominance—yielding both nearest-smaller/greater boundaries $[L+1, R-1]$ in a single $O(N)$ pass!",
    content: `
      <h3>Dominance Pruning &amp; Two-Sided Boundary Discovery</h3>
      <p>Suppose we want to find, for every bar $H[m]$ in a histogram $H[0 \\dots N-1]$, the largest rectangle of height $H[m]$ that can be formed using $m$ as the shortest (limiting) bar. That rectangle extends left to the nearest index $L &lt; m$ with $H[L] &lt; H[m]$, and extends right to the nearest index $R &gt; m$ with $H[R] &lt; H[m]$, giving width $(R - L - 1)$ and area $H[m] \\cdot (R - L - 1)$.</p>
      <p>How does a <strong>Monotonic Increasing Stack</strong> find both $L$ and $R$ for every $m \\in [0, N-1]$ in a single left-to-right scan? Maintain a stack of indices $i_0 &lt; i_1 &lt; \\dots &lt; i_k$ such that $H[i_0] \\le H[i_1] \\le \\dots \\le H[i_k]$. When scanning index $R$:</p>
      <ul>
        <li>While the stack is non-empty and $H[\\text{stack.top()}] &gt; H[R]$, let $m = \\text{stack.pop()}$.</li>
        <li><strong>Right Boundary ($R$):</strong> Because $m$ survived on the stack until $R$ arrived, no index in $(m, R)$ had height $&lt; H[m]$; thus $R$ is the exact <em>Next Smaller Element</em> to the right of $m$!</li>
        <li><strong>Left Boundary ($L$):</strong> What is the new <code>stack.top()</code> sitting immediately below $m$? Every element originally between $L = \\text{stack.top()}$ and $m$ was already popped before $m$ was pushed, meaning all of them were $\\ge H[m]$ while $H[L] \\le H[m]$. Thus $L$ is the exact <em>Previous Smaller Element</em> to the left of $m$!</li>
      </ul>
      <p>By the aggregate amortized method, each of the $N$ indices is pushed onto the stack <strong>exactly once</strong> and popped at most <strong>once</strong>, bounding total stack operations to $\\le 2N = O(N)$ time.</p>

      <div class="invariant-box">
        <div class="invariant-title">Combinatorial Invariant: Asymmetric Strict/Non-Strict Tie-Breaking for Duplicate Elements</div>
        <p>Consider computing the <strong>Sum of Subarray Minimums</strong>: $\\sum_{0 \\le i \\le j &lt; N} \\min(A[i \\dots j])$. Instead of iterating over $O(N^2)$ subarrays, count how many subarrays have $A[m]$ as their minimum: if $L$ is the previous smaller index and $R$ is the next smaller index, there are $(m - L)$ choices for the subarray start and $(R - m)$ choices for the subarray end, so $A[m]$ contributes $A[m] \\cdot (m - L) \\cdot (R - m)$ to the total sum.</p>
        <p><strong>What if $A$ contains duplicate values (e.g., <code>[2, 5, 2]</code>)?</strong></p>
        <ul>
          <li>If both left and right searches stop at <em>strictly smaller</em> ($&lt; A[m]$), then for <code>[2, 5, 2]</code> both <code>2</code>s claim the full subarray <code>[2, 5, 2]</code>, <strong>double-counting</strong> it!</li>
          <li>If both stop at <em>smaller-or-equal</em> ($\\le A[m]$), neither <code>2</code> claims <code>[2, 5, 2]</code>, <strong>under-counting</strong> it!</li>
          <li><strong>The Asymmetric Tie-Break Law:</strong> Define the left boundary as <strong>strictly smaller</strong> ($A[L] &lt; A[m]$) and the right boundary as <strong>smaller or equal</strong> ($A[R] \\le A[m]$), attributing every tied subarray uniquely to its <em>leftmost</em> minimum occurrence!</li>
        </ul>
      </div>

      <h3>Monotonic Stack Variants &amp; Boundary Semantics</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Stack Order (Bottom $\\to$ Top)</th>
            <th>Pop Condition at Incoming $A[R]$</th>
            <th>When $m$ is Popped by $R$</th>
            <th>New <code>stack.top()</code> ($L$) Below $m$</th>
            <th>Canonical Applications</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monotonic Decreasing ($&gt;$)</td>
            <td><code>A[top] &lt; A[R]</code></td>
            <td>$R$ is Next Greater of $m$</td>
            <td>$L$ is Previous Greater-or-Equal of $m$</td>
            <td>Next Greater Element, Daily Temperatures, Stock Span</td>
          </tr>
          <tr>
            <td>Monotonic Increasing ($&lt;$)</td>
            <td><code>A[top] &gt; A[R]</code></td>
            <td>$R$ is Next Smaller of $m$</td>
            <td>$L$ is Previous Smaller-or-Equal of $m$</td>
            <td>Largest Rectangle in Histogram, Maximal 0-1 Rectangle</td>
          </tr>
          <tr>
            <td>Asymmetric Increasing ($&lt;$)</td>
            <td><code>A[top] &gt;= A[R]</code></td>
            <td>$R$ is Next Smaller-or-Equal of $m$</td>
            <td>$L$ is Strictly Smaller ($A[L] &lt; A[m]$)</td>
            <td>Sum of Subarray Minimums / Ranges (Exact Dedup)</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing Histogram Rectangle Expansion $[L+1 \\dots R-1]$ Upon Pop</h3>
      <svg viewBox="0 0 760 205" width="100%" height="auto" role="img" aria-label="Monotonic stack histogram rectangle expansion between L and R">
        <style>
          .ms-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .ms-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .ms-bar { fill: rgba(59, 130, 246, 0.2); stroke: #3b82f6; stroke-width: 1.5; }
          .ms-rect { fill: rgba(16, 185, 129, 0.28); stroke: #10b981; stroke-width: 2; stroke-dasharray: 4 2; }
          .ms-bound { fill: rgba(239, 68, 68, 0.22); stroke: #ef4444; stroke-width: 1.5; }
        </style>
        <text x="15" y="22" class="ms-title">When R=5 (height 2) Arrives, m=3 (height 5) &amp; m=2 (height 5) Are Popped; L=1 (height 1) Bounds Left</text>

        <rect x="40" y="130" width="55" height="35" class="ms-bar"/>
        <text x="67" y="152" text-anchor="middle" class="ms-txt">i=0: 2</text>

        <rect x="105" y="148" width="55" height="17" class="ms-bound"/>
        <text x="132" y="161" text-anchor="middle" class="ms-txt">L=1: 1</text>

        <rect x="170" y="60" width="55" height="105" class="ms-bar"/>
        <text x="197" y="115" text-anchor="middle" class="ms-txt">m=2: 5</text>

        <rect x="235" y="42" width="55" height="123" class="ms-bar"/>
        <text x="262" y="105" text-anchor="middle" class="ms-txt">i=3: 6</text>

        <rect x="300" y="60" width="55" height="105" class="ms-bar"/>
        <text x="327" y="115" text-anchor="middle" class="ms-txt">i=4: 5</text>

        <rect x="365" y="130" width="55" height="35" class="ms-bound"/>
        <text x="392" y="152" text-anchor="middle" class="ms-txt">R=5: 2</text>

        <rect x="170" y="60" width="185" height="105" class="ms-rect"/>

        <text x="445" y="58" class="ms-txt">Popped m (height 5):</text>
        <text x="445" y="80" class="ms-txt">- Right bound R = 5 (first bar &lt; 5)</text>
        <text x="445" y="100" class="ms-txt">- Left bound L = 1 (new stack.top() below m)</text>
        <text x="445" y="120" class="ms-txt">- Valid Span = [L+1 .. R-1] = [2 .. 4]</text>
        <text x="445" y="140" class="ms-txt">- Width = R - L - 1 = 5 - 1 - 1 = 3</text>
        <text x="445" y="160" class="ms-txt">- Area = 5 * 3 = 15</text>

        <text x="15" y="190" class="ms-txt">Sentinel Trick: Append virtual height 0 at index R = N to flush all remaining bars from the stack in 1 loop!</text>
      </svg>

      <h3>Single-Pass Sentinel-Flushed Histogram Algorithm</h3>
      <div class="mermaid">
      flowchart LR
        A["For R = 0 .. N<br/>cur_h = (R == N ? 0 : H[R])"] --> B{"!st.empty() &amp;&amp;<br/>H[st.back()] >= cur_h"}
        B -- "Yes (Dominated)" --> C["h = H[st.back()]; st.pop_back()<br/>L = st.empty() ? -1 : st.back()<br/>max_area = max(max_area, h * (R - L - 1))"]
        C --> B
        B -- "No" --> D["st.push_back(R)"]
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Why You Should Never Use <code>std::stack&lt;int&gt;</code> in Hot Loops</div>
        <p>In the C++ Standard Template Library, <code>std::stack&lt;T&gt;</code> is a container adapter whose default underlying container is <code>std::deque&lt;T&gt;</code>—not <code>std::vector&lt;T&gt;</code>! As we saw in Module 2, <code>std::deque</code> allocates segmented heap chunks through a pointer-map directory. In a monotonic stack where indices are pushed and popped millions of times inside a tight $O(N)$ loop, using <code>std::vector&lt;int&gt; st; st.reserve(N);</code> (with <code>st.back()</code>, <code>st.push_back()</code>, and <code>st.pop_back()</code>) keeps the entire stack in a single L1-resident contiguous buffer with zero allocations and single-cycle register indexing.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-monotonic-stack-queue"></div>

      <h3>Production Implementation: Largest Histogram Rectangle &amp; Subarray Minimums Sum</h3>
      <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;vector&gt;

// O(N) Single-Pass Largest Rectangle in Histogram with virtual R = N sentinel (height 0)
std::int64_t largest_rectangle_area(const std::vector&lt;int&gt;&amp; heights) {
  const std::size_t n = heights.size();
  std::vector&lt;std::size_t&gt; st;
  st.reserve(n + 1);
  std::int64_t max_area = 0;

  for (std::size_t r = 0; r &lt;= n; ++r) {
    const int cur_h = (r == n) ? 0 : heights[r];
    while (!st.empty() &amp;&amp; heights[st.back()] &gt;= cur_h) {
      const std::int64_t h = heights[st.back()];
      st.pop_back();
      const std::size_t width = st.empty() ? r : (r - st.back() - 1);
      max_area = std::max(max_area, h * static_cast&lt;std::int64_t&gt;(width));
    }
    st.push_back(r);
  }
  return max_area;
}

// O(N) Single-Pass Sum of Subarray Minimums using Asymmetric Tie-Breaking
// Pop condition arr[st.back()] &gt;= cur means:
//   - Right boundary r is the first element &lt;= arr[m]
//   - Left boundary l (new st.back()) is strictly &lt; arr[m]
std::int64_t sum_of_subarray_minimums(const std::vector&lt;int&gt;&amp; arr) {
  const std::size_t n = arr.size();
  std::vector&lt;std::size_t&gt; st;
  st.reserve(n + 1);
  std::int64_t total_sum = 0;

  for (std::size_t r = 0; r &lt;= n; ++r) {
    const int cur = (r == n) ? -2147483648 : arr[r];
    while (!st.empty() &amp;&amp; (r == n || arr[st.back()] &gt;= cur)) {
      const std::size_t m = st.back();
      st.pop_back();
      const std::size_t left_count = st.empty() ? (m + 1) : (m - st.back());
      const std::size_t right_count = r - m;
      const std::int64_t ways = static_cast&lt;std::int64_t&gt;(left_count) * static_cast&lt;std::int64_t&gt;(right_count);
      total_sum += static_cast&lt;std::int64_t&gt;(arr[m]) * ways;
    }
    st.push_back(r);
  }
  return total_sum;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Using Width <code>r - m</code> Instead of <code>r - st.back() - 1</code> After Popping</div>
        <p>In Largest Rectangle in Histogram, a classic mistake is computing the rectangle width for popped bar $m$ as <code>r - m</code>. Why is that wrong? Because taller bars located <em>to the left of $m$</em> (between the new <code>st.back()</code> and $m$) were already popped earlier when $m$ (or an intermediate bar) arrived! Those popped left bars were all $\\ge H[m]$, so $m$'s rectangle extends leftward all the way to <code>st.back() + 1</code> (or index <code>0</code> if the stack is now empty), making the true width <code>st.empty() ? r : (r - st.back() - 1)</code>.</p>
      </div>
    `,
    keyTakeaways: [
      "A monotonic stack runs in O(N) time because each of the N indices is pushed once and popped at most once across the entire scan (<= 2N operations).",
      "When incoming index R pops index m from a monotonic stack, R is m's nearest dominating boundary on the right, and the new stack top L below m is m's nearest dominating boundary on the left.",
      "To count subarray minimums or maximums without double-counting duplicate values, use asymmetric comparisons: strictly smaller (<) on the left and smaller-or-equal (<=) on the right.",
      "Appending a virtual sentinel at index R = N flushes all remaining unpopped elements from the monotonic stack in a single unified loop."
    ],
    furtherReading: [
      {
        title: "Antti Laaksonen — Competitive Programmer's Handbook, Chapter 8: Nearest Smaller Elements & Histogram Area",
        url: "https://cses.fi/book/book.pdf",
        type: "Textbook"
      },
      {
        title: "CP-Algorithms: Finding the Largest Zero Submatrix & Monotonic Stack Applications",
        url: "https://cp-algorithms.com/others/maximum_average_segment.html",
        type: "Algorithm Reference"
      }
    ]
  },

  "monotonic-deque-sliding-extrema": {
    title: "Monotonic Deques: O(N) Sliding Window Minimum/Maximum",
    video: {
      youtubeId: "DfljaUwZsOk",
      id: "DfljaUwZsOk",
      url: "https://www.youtube.com/embed/DfljaUwZsOk",
      id: "DfljaUwZsOk",
      url: "https://www.youtube.com/embed/DfljaUwZsOk",
      title: "Sliding Window Maximum — Monotonic Queue / Deque",
      channel: "NeetCode",
      duration: "14 min"
    },
    intuition: "A Monotonic Deque is a Monotonic Stack with an expiration door at the front: when a new element $A[R]$ enters the sliding window $[R - K + 1, R]$, it pops all older, worse elements from the back (because $A[R]$ is both better and lives longer than them), while expired indices $< R - K + 1$ are evicted from the front—keeping the current window's exact extremum pinned at <code>deque.front()</code> in $O(1)$ time.",
    content: `
      <h3>The Pareto Dominance Invariant: Value vs. Expiration Time</h3>
      <p>Consider computing the maximum of every contiguous window of length $K$ across $A[0 \\dots N-1]$. A balanced BST (<code>std::multiset</code>) or Binary Heap takes $O(N \\log K)$ time because it retains every element in the window. Why is retaining all $K$ elements wasteful? Suppose index $i &lt; R$ is currently inside the window, and the newly arriving element at index $R$ satisfies $A[i] \\le A[R]$.</p>
      <p>Compare $i$ and $R$ across two dimensions: (1) <strong>Value:</strong> $A[R] \\ge A[i]$, and (2) <strong>Lifetime:</strong> $R &gt; i$, so $R$ will remain inside all future sliding windows strictly longer than $i$ will! In optimization theory, $R$ <strong>Pareto-dominates</strong> $i$: $i$ can never be the maximum of the current window or any future window. Therefore, we can permanently discard $i$ from the back of our candidate list before pushing $R$!</p>

      <div class="invariant-box">
        <div class="invariant-title">Dual-Ordering Invariant of a Monotonic Decreasing Deque</div>
        <p>At the end of step $R$ (for window $[R - K + 1, R]$), the indices $d_0, d_1, \\dots, d_m$ stored in the deque from front to back simultaneously satisfy two strict invariants:</p>
        <ol>
          <li><strong>Strictly Increasing Indices (Timestamps):</strong> $R - K + 1 \\le d_0 &lt; d_1 &lt; \\dots &lt; d_m = R$.</li>
          <li><strong>Strictly Decreasing Values:</strong> $A[d_0] &gt; A[d_1] &gt; \\dots &gt; A[d_m]$.</li>
        </ol>
        <p>Consequently, $d_0 = \\text{deque.front()}$ is guaranteed to be a valid in-window index holding the <strong>maximum value</strong> of $A[R - K + 1 \\dots R]$ in $O(1)$ time! Each index $0 \\dots N-1$ is pushed to the back once and popped from either the back (by dominance) or the front (by window expiration) at most once, proving $O(1)$ amortized work per step ($\\le 2N$ deque operations total).</p>
      </div>

      <h3>Sliding Window Extremum &amp; Constrained DP Techniques Compared</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Method</th>
            <th>Total Time (Length $N$)</th>
            <th>Worst-Case Latency per Step</th>
            <th>Auxiliary Space</th>
            <th>Supports Dynamic Window Bounds $[L(R), R]$?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Naive Window Scan</td>
            <td>$O(N K)$</td>
            <td>$O(K)$</td>
            <td>$O(1)$</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Balanced BST / Heap</td>
            <td>$O(N \\log K)$</td>
            <td>$O(\\log K)$</td>
            <td>$O(K)$</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Monotonic Deque</td>
            <td><strong>$O(N)$</strong></td>
            <td>$O(1)$ amortized ($O(K)$ worst step)</td>
            <td>$O(K)$</td>
            <td><strong>Yes!</strong> Any monotonic $[L(R), R]$</td>
          </tr>
          <tr>
            <td>Two-Stack Queue (Min-Stacks)</td>
            <td><strong>$O(N)$</strong></td>
            <td>$O(1)$ amortized</td>
            <td>$O(K)$</td>
            <td>Yes (works for ANY associative monoid!)</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing Back-Dominance Pruning &amp; Front-Expiration</h3>
      <svg viewBox="0 0 760 190" width="100%" height="auto" role="img" aria-label="Monotonic deque front expiration and back dominance pruning">
        <style>
          .md-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .md-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .md-exp { fill: rgba(239, 68, 68, 0.2); stroke: #ef4444; stroke-width: 1.5; stroke-dasharray: 4 2; }
          .md-max { fill: rgba(16, 185, 129, 0.28); stroke: #10b981; stroke-width: 2; }
          .md-mid { fill: rgba(59, 130, 246, 0.2); stroke: #3b82f6; stroke-width: 1.5; }
          .md-dom { fill: rgba(245, 158, 11, 0.22); stroke: #f59e0b; stroke-width: 1.5; stroke-dasharray: 4 2; }
        </style>
        <text x="15" y="24" class="md-title">Monotonic Decreasing Deque Architecture (Window [R - K + 1 .. R])</text>

        <rect x="20" y="45" width="145" height="58" rx="4" class="md-exp"/>
        <text x="92" y="69" text-anchor="middle" class="md-txt">pop_front()</text>
        <text x="92" y="87" text-anchor="middle" class="md-txt">if d.front() &lt;= R-K</text>

        <rect x="180" y="45" width="160" height="58" rx="4" class="md-max"/>
        <text x="260" y="69" text-anchor="middle" class="md-txt">FRONT (d_0)</text>
        <text x="260" y="87" text-anchor="middle" class="md-txt">Window MAX (O(1))</text>

        <rect x="355" y="45" width="160" height="58" rx="4" class="md-mid"/>
        <text x="435" y="69" text-anchor="middle" class="md-txt">MIDDLE (d_1 ..)</text>
        <text x="435" y="87" text-anchor="middle" class="md-txt">Strictly Decreasing</text>

        <rect x="530" y="45" width="210" height="58" rx="4" class="md-dom"/>
        <text x="635" y="69" text-anchor="middle" class="md-txt">BACK: pop_back()</text>
        <text x="635" y="87" text-anchor="middle" class="md-txt">while A[back] &lt;= A[R]</text>

        <text x="20" y="136" class="md-txt">Dual Monotonicity: From Front to Back, Indices Strictly INCREASE (d_0 &lt; d_1 &lt; d_2) while Values DECREASE!</text>
        <text x="20" y="162" class="md-txt">Prefix-Sum + Deque Pattern (Shortest Subarray &gt;= K): Pop front while P[R] - P[d.front()] &gt;= K; pop back while P[d.back()] &gt;= P[R]</text>
      </svg>

      <h3>Monotonic Deque Optimization of DP &amp; Negative-Weight Prefix Sums</h3>
      <div class="mermaid">
      flowchart LR
        A["Step R: Advance right endpoint"] --> B["1. Expire Front:<br/>while !dq.empty() &amp;&amp; dq.front() < R - K + 1<br/>dq.pop_front()"]
        B --> C["2. Prune Dominated Back:<br/>while !dq.empty() &amp;&amp; A[dq.back()] <= A[R]<br/>dq.pop_back()"]
        C --> D["3. Insert &amp; Query:<br/>dq.push_back(R)<br/>window_max = A[dq.front()]"]
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Flat Array Ring or Two-Index Vector Beats <code>std::deque</code> by $4\\times$</div>
        <p>When implementing a Monotonic Deque over an array of length $N$, since at most $N$ pushes ever occur across the entire algorithm, you don't even need a circular buffer! Allocating a flat <code>std::vector&lt;int&gt; q(N)</code> with two integer cursors <code>int head = 0, tail = 0;</code> implements <code>pop_front()</code> as <code>++head</code>, <code>pop_back()</code> as <code>--tail</code>, and <code>push_back(r)</code> as <code>q[tail++] = r</code>. This reduces the entire monotonic deque to a single contiguous L1-cached array and two CPU registers.</p>
      </div>

      <div class="simulator-mount" data-sim="sim-monotonic-stack-queue"></div>

      <h3>Production Implementation: Sliding Window Maximum &amp; Shortest Subarray with Sum $\ge K$</h3>
      <pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;vector&gt;

// O(N) Sliding Window Maximum using a register-indexed flat array deque
std::vector&lt;int&gt; sliding_window_maximum(const std::vector&lt;int&gt;&amp; nums, std::size_t k) {
  const std::size_t n = nums.size();
  if (n == 0 || k == 0) return {};

  std::vector&lt;std::size_t&gt; dq(n); // Flat array deque: at most N pushes total!
  std::size_t head = 0, tail = 0;
  std::vector&lt;int&gt; result;
  result.reserve(n - k + 1);

  for (std::size_t r = 0; r &lt; n; ++r) {
    // 1. Evict expired front index outside [r - k + 1 .. r]
    if (head &lt; tail &amp;&amp; dq[head] + k &lt;= r) {
      ++head;
    }
    // 2. Evict dominated back indices with value &lt;= nums[r]
    while (head &lt; tail &amp;&amp; nums[dq[tail - 1]] &lt;= nums[r]) {
      --tail;
    }
    dq[tail++] = r;

    if (r + 1 &gt;= k) {
      result.push_back(nums[dq[head]]);
    }
  }
  return result;
}

// LeetCode 862: Shortest Subarray with Sum &gt;= K (handles negative numbers in O(N)!)
int shortest_subarray_sum_at_least_k(const std::vector&lt;int&gt;&amp; nums, std::int64_t k) {
  const std::size_t n = nums.size();
  std::vector&lt;std::int64_t&gt; pref(n + 1, 0);
  for (std::size_t i = 0; i &lt; n; ++i) {
    pref[i + 1] = pref[i] + nums[i];
  }

  std::vector&lt;std::size_t&gt; dq(n + 1);
  std::size_t head = 0, tail = 0;
  std::size_t min_len = n + 1;

  for (std::size_t r = 0; r &lt;= n; ++r) {
    // 1. Pop front while valid sum &gt;= k is achieved; once L is paired with current R,
    //    no future R' &gt; R can form a shorter subarray with L, so L is permanently retired!
    while (head &lt; tail &amp;&amp; pref[r] - pref[dq[head]] &gt;= k) {
      min_len = std::min(min_len, r - dq[head]);
      ++head;
    }
    // 2. Maintain strictly increasing prefix sums in deque: if pref[back] &gt;= pref[r],
    //    then r is both further right (shorter subarray) AND has a smaller prefix sum!
    while (head &lt; tail &amp;&amp; pref[dq[tail - 1]] &gt;= pref[r]) {
      --tail;
    }
    dq[tail++] = r;
  }
  return (min_len &lt;= n) ? static_cast&lt;int&gt;(min_len) : -1;
}</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Storing Values Instead of Indices in the Monotonic Deque</div>
        <p>A frequent bug is pushing values <code>nums[r]</code> into the deque instead of indices <code>r</code>. If you only store values, you cannot tell whether <code>dq.front()</code> has slid outside the left boundary $R - K + 1$ when duplicate values exist in the array! Always store <strong>array indices</strong> inside the monotonic deque (which gives you both the timestamp <code>idx</code> and the value <code>nums[idx]</code>). Also note the unsigned-safe expiration test: write <code>dq[head] + k &lt;= r</code> instead of <code>dq[head] &lt;= r - k</code> so <code>r - k</code> never underflows when <code>r < k</code>.</p>
      </div>
    `,
    keyTakeaways: [
      "A Monotonic Deque maintains indices that are strictly increasing in position and strictly monotonic in value from front to back.",
      "Each element is pushed once and popped at most once (either from the back via Pareto dominance or from the front via expiration), guaranteeing O(N) total time.",
      "Combining Prefix Sums with a Monotonic Increasing Deque solves Shortest Subarray with Sum >= K in O(N) time even when the array contains negative numbers.",
      "Always store indices (not raw values) in the deque to accurately expire out-of-window elements, and use a flat pre-allocated array with head/tail cursors for maximum L1 speed."
    ],
    furtherReading: [
      {
        title: "Antti Laaksonen — Competitive Programmer's Handbook, Chapter 8: Sliding Window Minimum (Monotonic Queue)",
        url: "https://cses.fi/book/book.pdf",
        type: "Textbook"
      },
      {
        title: "CP-Algorithms: Minimum Stack / Minimum Queue in O(1) Amortized Time",
        url: "https://cp-algorithms.com/data_structures/stack_queue_modification.html",
        type: "Algorithm Reference"
      }
    ]
  },

  "lru-lfu-eviction-structures": {
    title: "Composing Hash Maps + Doubly Linked Lists: O(1) LRU & LFU Caches",
    video: {
      youtubeId: "7ABFKPK2hD4",
      id: "7ABFKPK2hD4",
      url: "https://www.youtube.com/embed/7ABFKPK2hD4",
      id: "7ABFKPK2hD4",
      url: "https://www.youtube.com/embed/7ABFKPK2hD4",
      title: "LRU & LFU Cache Design: Hash Maps + Doubly Linked Lists",
      channel: "NeetCode",
      duration: "22 min"
    },
    intuition: "No single primitive data structure supports both $O(1)$ key lookup and $O(1)$ recency/frequency reordering: a hash table has no ordering, and a linked list requires $O(N)$ search. By cross-linking a Hash Map (<code>key -> Node*</code>) directly into an intrusive Circular Doubly Linked List (for LRU) or a Hash Map of Frequency-Bucket Lists tracking <code>min_freq</code> (for LFU), every <code>get</code>, <code>put</code>, promotion, and eviction executes in worst-case $O(1)$ time.",
    content: `
      <h3>Data Structure Composition: Why Hash Map + Doubly Linked List?</h3>
      <p>In an <strong>LRU (Least Recently Used)</strong> cache of capacity $C$:
      <ul>
        <li><code>get(key)</code> must look up the key in $O(1)$ time and move its entry to the Most Recently Used (MRU) head of the recency order in $O(1)$ time.</li>
        <li><code>put(key, val)</code> must insert or update the key at the MRU head in $O(1)$ time, and if size exceeds $C$, evict the Least Recently Used (LRU) tail entry in $O(1)$ time.</li>
      </ul>
      Why must the recency list be <em>doubly</em> linked rather than singly linked? Because when a cache hit occurs on an arbitrary interior node $u$ via the hash map (<code>map[key] -> u</code>), unlinking $u$ from its current position requires modifying $u$'s predecessor (<code>u->prev->next = u->next</code>). Without a <code>prev</code> pointer, finding $u$'s predecessor would take $O(N)$ time!</p>

      <div class="invariant-box">
        <div class="invariant-title">Algorithmic Invariant: Why O(1) LFU Cache Tracks <code>min_freq</code> Without a Min-Heap</div>
        <p>In an <strong>LFU (Least Frequently Used)</strong> cache, eviction removes the item with the smallest access count <code>freq</code> (breaking ties by Least Recently Used among items of that same <code>freq</code>). Using a Min-Heap of frequencies would cost $O(\\log C)$ per access. In 2010, Shah, Mitra, and Matani proved how to achieve <strong>strictly $O(1)$ LFU</strong> by grouping nodes into a hash map of doubly linked lists indexed by frequency (<code>freq_lists[f]</code>) and maintaining a single scalar integer <code>min_freq</code>:</p>
        <ol>
          <li><strong>On <code>put(new_key)</code> (after evicting <code>freq_lists[min_freq].back()</code> if full):</strong> The new key starts with frequency $1$, so we insert it into <code>freq_lists[1]</code> and set <code>min_freq = 1</code> in $O(1)$ time!</li>
          <li><strong>On <code>get(key)</code> or updating an existing key of frequency $f$:</strong> We unlink the node from <code>freq_lists[f]</code> and push it to the MRU front of <code>freq_lists[f + 1]</code>. What if $f == \\text{min\\_freq}$ and <code>freq_lists[f]</code> just became empty? Then the node we just promoted was the <em>last</em> item at <code>min_freq</code>, and its new frequency is $f + 1$—so we simply increment <code>++min_freq</code> in $O(1)$ time!</li>
        </ol>
        <p>Because frequency only ever jumps to $1$ (on new insert) or increments by $+1$ (on access), <code>min_freq</code> <strong>never needs to search for the next minimum</strong>!</p>
      </div>

      <h3>Cache Eviction Policies &amp; Production Systems Comparison</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Eviction Policy</th>
            <th><code>get</code> / <code>put</code> Time</th>
            <th>Metadata per Entry</th>
            <th>Scan Resistance (One-Hit Wonders)</th>
            <th>Production Adopters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Strict LRU (Hash + DLL)</td>
            <td>$O(1)$</td>
            <td>2 pointers (<code>prev</code>, <code>next</code>) + key/val</td>
            <td><strong>Poor:</strong> A sequential scan of $C$ items flushes the entire cache!</td>
            <td>Local in-memory caches, Guava</td>
          </tr>
          <tr>
            <td>Strict LFU (Freq Lists + <code>min_freq</code>)</td>
            <td>$O(1)$</td>
            <td>2 pointers + <code>freq</code> + list bucket</td>
            <td><strong>High</strong>, but suffers from <em>frequency pollution</em> (old stale items never decay)</td>
            <td>CDN static asset caches</td>
          </tr>
          <tr>
            <td>CLOCK / Second-Chance (Ring + 1 Bit)</td>
            <td>$O(1)$ amortized</td>
            <td>1 reference bit (no pointer chasing on hit!)</td>
            <td>Moderate</td>
            <td>Linux VM Page Cache, Postgres Buffer Pool</td>
          </tr>
          <tr>
            <td>W-TinyLFU (Window LRU + Count-Min Sketch)</td>
            <td>$O(1)$</td>
            <td>4-bit decaying frequency counter</td>
            <td><strong>Near-Optimal</strong> (blocks scan pollution &amp; decays old frequencies)</td>
            <td>Java <strong>Caffeine</strong>, RocksDB, Cloudflare</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing O(1) LFU Frequency-Bucketed Doubly Linked Lists</h3>
      <svg viewBox="0 0 760 215" width="100%" height="auto" role="img" aria-label="O(1) LFU cache frequency bucketed doubly linked lists">
        <style>
          .lf-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .lf-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .lf-bkt { fill: rgba(245, 158, 11, 0.22); stroke: #f59e0b; stroke-width: 1.5; }
          .lf-node { fill: rgba(59, 130, 246, 0.2); stroke: #3b82f6; stroke-width: 1.5; }
          .lf-evict { fill: rgba(239, 68, 68, 0.25); stroke: #ef4444; stroke-width: 2; }
          .lf-mru { fill: rgba(16, 185, 129, 0.25); stroke: #10b981; stroke-width: 1.5; }
        </style>
        <text x="15" y="22" class="lf-title">LFU Architecture: key_map[key] --&gt; Node*, Grouped by Frequency Bucket Lists (min_freq = 1)</text>

        <rect x="20" y="42" width="135" height="36" rx="3" class="lf-bkt"/>
        <text x="87" y="64" text-anchor="middle" class="lf-txt">freq = 1 (min)</text>
        <rect x="180" y="42" width="165" height="36" rx="3" class="lf-mru"/>
        <text x="262" y="64" text-anchor="middle" class="lf-txt">MRU: Key C (f=1)</text>
        <rect x="370" y="42" width="215" height="36" rx="3" class="lf-evict"/>
        <text x="477" y="64" text-anchor="middle" class="lf-txt">LRU Victim: Key A (f=1)</text>

        <rect x="20" y="92" width="135" height="36" rx="3" class="lf-bkt"/>
        <text x="87" y="114" text-anchor="middle" class="lf-txt">freq = 2</text>
        <rect x="180" y="92" width="165" height="36" rx="3" class="lf-node"/>
        <text x="262" y="114" text-anchor="middle" class="lf-txt">MRU: Key D (f=2)</text>
        <rect x="370" y="92" width="165" height="36" rx="3" class="lf-node"/>
        <text x="452" y="114" text-anchor="middle" class="lf-txt">LRU: Key B (f=2)</text>

        <rect x="20" y="142" width="135" height="36" rx="3" class="lf-bkt"/>
        <text x="87" y="164" text-anchor="middle" class="lf-txt">freq = 5</text>
        <rect x="180" y="142" width="165" height="36" rx="3" class="lf-node"/>
        <text x="262" y="164" text-anchor="middle" class="lf-txt">MRU: Key E (f=5)</text>

        <text x="20" y="200" class="lf-txt">Invariant: Eviction ALWAYS pops the LRU tail of freq_lists[min_freq] in O(1) time!</text>
      </svg>

      <h3>LFU Promotion &amp; <code>min_freq</code> State Transition Diagram</h3>
      <div class="mermaid">
      flowchart LR
        A["Access Node u<br/>with f = u.freq"] --> B["Unlink u from<br/>freq_lists[f]"]
        B --> C{"Is freq_lists[f] empty<br/>AND f == min_freq?"}
        C -- "Yes" --> D["min_freq = f + 1"]
        C -- "No" --> E["Keep min_freq"]
        D --> F["u.freq = f + 1<br/>Push u to MRU front of freq_lists[f + 1]"]
        E --> F
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Multi-Core Lock Contention on the LRU Head Pointer</div>
        <p>In a multi-threaded server with 64 CPU cores, textbook strict LRU is a scalability disaster: even on a <strong>100% read-only workload</strong>, every <code>get(key)</code> cache hit mutates the doubly linked list's <code>head</code> pointers—requiring an exclusive mutex lock and causing L1 cache-line bouncing (MESI invalidation storms) on the sentinel node across all 64 cores! Production systems solve this in three ways:
        <ol>
          <li><strong>Sharded Caches (RocksDB BlockCache):</strong> Partition keys by hash prefix into 64 independent LRU shards, reducing lock contention by $64\\times$.</li>
          <li><strong>CLOCK / Approximate LRU (Linux Page Cache, Redis):</strong> Only set an atomic 1-bit reference flag on read hits (or sample 5 random keys at eviction time in Redis) so read hits never mutate linked list pointers.</li>
          <li><strong>Deferred Ring-Buffer Replay (Java Caffeine):</strong> Record read hits into lock-free per-thread ring buffers and replay promotions asynchronously in batches.</li>
        </ol>
        </p>
      </div>

      <div class="simulator-mount" data-sim="sim-lru-lfu-cache"></div>

      <h3>Production Implementation: Contiguous Arena-Backed O(1) LRU Cache</h3>
      <pre><code class="language-cpp">#include &lt;cstdint&gt;
#include &lt;unordered_map&gt;
#include &lt;vector&gt;

// High-locality O(1) LRU Cache using a pre-allocated Node pool (0 mallocs after construction!)
class FastLRUCache {
  struct Node {
    int key = 0;
    int value = 0;
    int prev = 0;
    int next = 0;
  };

  int cap_;
  std::vector&lt;Node&gt; pool_; // Index 0 is the circular dummy sentinel!
  std::vector&lt;int&gt; free_list_;
  std::unordered_map&lt;int, int&gt; index_map_;

  void unlink(int u) noexcept {
    const int p = pool_[u].prev;
    const int n = pool_[u].next;
    pool_[p].next = n;
    pool_[n].prev = p;
  }

  void push_mru_front(int u) noexcept {
    const int first = pool_[0].next;
    pool_[u].prev = 0;
    pool_[u].next = first;
    pool_[first].prev = u;
    pool_[0].next = u;
  }

public:
  explicit FastLRUCache(int capacity) : cap_(capacity), pool_(capacity + 1) {
    pool_[0].prev = 0;
    pool_[0].next = 0;
    free_list_.reserve(capacity);
    for (int i = capacity; i &gt;= 1; --i) {
      free_list_.push_back(i);
    }
    index_map_.reserve(capacity * 2);
  }

  int get(int key) noexcept {
    auto it = index_map_.find(key);
    if (it == index_map_.end()) return -1;
    const int u = it-&gt;second;
    unlink(u);
    push_mru_front(u);
    return pool_[u].value;
  }

  void put(int key, int value) {
    if (cap_ &lt;= 0) return;
    auto it = index_map_.find(key);
    if (it != index_map_.end()) {
      const int u = it-&gt;second;
      pool_[u].value = value;
      unlink(u);
      push_mru_front(u);
      return;
    }

    int u = 0;
    if (!free_list_.empty()) {
      u = free_list_.back();
      free_list_.pop_back();
    } else {
      // Reuse the LRU victim node at pool_[0].prev directly without freeing!
      u = pool_[0].prev;
      unlink(u);
      index_map_.erase(pool_[u].key);
    }

    pool_[u].key = key;
    pool_[u].value = value;
    push_mru_front(u);
    index_map_[key] = u;
  }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Forgetting to Store <code>key</code> Inside the Doubly Linked List Node</div>
        <p>When designing an LRU or LFU cache, developers frequently store only <code>value</code> inside the doubly linked list <code>Node</code> (since <code>key</code> is already stored in the hash map). Then, when the cache reaches capacity and selects the LRU tail node <code>Node* victim = sentinel.prev</code> for eviction, they realize they have <strong>no way to remove the victim from <code>index_map_</code> in $O(1)$ time</strong> without knowing <code>victim-&gt;key</code>! Every doubly linked list node in an LRU/LFU cache must store both <code>key</code> and <code>value</code>.</p>
      </div>
    `,
    keyTakeaways: [
      "An O(1) LRU Cache composes a Hash Map (key -> Node*) with a Circular Sentinel Doubly Linked List ordered from Most Recently Used (head) to Least Recently Used (tail).",
      "Every doubly linked list Node must store its own key alongside its value so that evicting the tail node can erase the corresponding hash map entry in O(1) time.",
      "An O(1) LFU Cache replaces the single LRU list with a Hash Map of Doubly Linked Lists keyed by frequency, plus a scalar min_freq that resets to 1 on new inserts and increments by 1 when freq_lists[min_freq] empties.",
      "In multi-threaded systems, strict LRU suffers from severe cache-line lock contention on read hits; production systems use sharded LRU, CLOCK bits, or W-TinyLFU with buffered replay."
    ],
    furtherReading: [
      {
        title: "Ketan Shah, Anirban Mitra, Dhruv Matani — An O(1) Algorithm for Implementing the LFU Cache Eviction Scheme (2010)",
        url: "https://dhruvbird.com/lfu.pdf",
        type: "Seminal Paper"
      },
      {
        title: "Gil Einziger, Roy Friedman, Ben Manes — TinyLFU: A Highly Efficient Cache Admission Policy (ACM Transactions on Storage, 2017)",
        url: "https://arxiv.org/abs/1512.00727",
        type: "Research Paper"
      }
    ]
  },

  "case-redis-skiplist-ziplist": {
    title: "Production Case Study: Redis ZSET (Listpack vs SkipList + Dict Dual Indexing)",
    video: {
      youtubeId: "MUKlxdBQZ7g",
      id: "MUKlxdBQZ7g",
      url: "https://www.youtube.com/embed/MUKlxdBQZ7g",
      title: "Redis Sorted Sets (ZSET) Internals: Listpack vs SkipList + Hash Table Dual Indexing",
      channel: "Redis",
      duration: "08:35",
      start: 0,
      length: "8m",
      why: "Deep-dive lecture covering Production Case Study: Redis ZSET (Listpack vs SkipList + Dict Dual Indexing)."
    },
    intuition: "How does a Redis Sorted Set (<code>ZSET</code>) support <code>ZSCORE member</code> (point lookup by string key) in $O(1)$ time, <code>ZRANGEBYSCORE min max</code> (1D range query by floating-point score) in $O(\\log N + M)$ time, AND <code>ZRANK member</code> / <code>ZRANGE start stop</code> (positional rank queries) in $O(\\log N + M)$ time? By adaptively switching from a flat cache-local <code>listpack</code> for small sets ($\\le 128$ items) to a dual-indexed <code>dict</code> + rank-augmented <code>zskiplist</code> for large sets.",
    content: `
      <h3>Dual-Indexing Architecture: Why Redis Combines a Hash Table + Augmented Skip List</h3>
      <p>Consider the API contract of a Redis Sorted Set (<code>ZSET</code>, implemented in <code>src/t_zset.c</code> by Salvatore Sanfilippo): every element is a unique string <code>ele</code> paired with a 64-bit IEEE-754 floating-point <code>double score</code>, ordered primarily by <code>score</code> ascending and secondarily by lexicographical <code>ele</code> ascending. Look at the conflicting access patterns required:</p>
      <ul>
        <li><code>ZSCORE key member</code> asks: <em>"What is the score of member $X$?"</em> A pure Skip List or B-Tree ordered by <code>(score, ele)</code> cannot search by <code>ele</code> alone without scanning all $N$ nodes in $O(N)$ time!</li>
        <li><code>ZRANGEBYSCORE key min max</code> asks: <em>"Return all members with score $\\in [\\text{min}, \\text{max}]$."</em> A hash table keyed by <code>ele</code> cannot answer ordered range queries without an $O(N \\log N)$ sort!</li>
        <li><code>ZRANK key member</code> and <code>ZRANGE key 100 150</code> ask: <em>"What is the 0-based positional index of member $X$?"</em> and <em>"Return the 100th through 150th elements."</em></li>
      </ul>
      <p>Redis solves all three simultaneously inside <code>struct zset</code> by composing two structures that share the exact same underlying string allocations (<code>sds</code>):</p>
      <ol>
        <li><strong>A Hash Table (<code>dict *dict</code>):</strong> Maps <code>ele -&gt; score</code> in $O(1)$ time.</li>
        <li><strong>An Order-Statistic Skip List (<code>zskiplist *zsl</code>):</strong> Indexes <code>(score, ele)</code> in sorted order, augmented with <strong>level span counters</strong> and a level-0 <code>backward</code> pointer.</li>
      </ol>

      <div class="invariant-box">
        <div class="invariant-title">Structural Invariant: Skip List <code>span</code> Augmentation for $O(\\log N)$ Rank Queries</div>
        <p>Inside Redis's <code>zskiplistNode</code>, each level $k$ in the tower stores not just a forward pointer <code>zskiplistNode *forward</code>, but also an unsigned integer <code>unsigned long span</code>:</p>
        <p>$$\\text{level}[k].\\text{span} = \\text{number of level-0 nodes traversed from } u \\text{ to } u.\\text{level}[k].\\text{forward}$$</p>
        <p>How does <code>ZRANK key member</code> compute the exact 0-based rank of <code>member</code> in $O(\\log N)$ time?</p>
        <ol>
          <li>First, look up <code>score = dictFind(zset->dict, member)</code> in <strong>$O(1)$ time</strong>!</li>
          <li>Second, search the Skip List for the composite key <code>(score, member)</code> from top level down to level 0. Every time we step horizontally across <code>curr-&gt;level[k].forward</code>, we add <code>rank += curr-&gt;level[k].span</code>! When we reach the target node at level 0, the accumulated <code>rank</code> is its exact 1-based position in the sorted set!</li>
        </ol>
      </div>

      <h3>Adaptive Representation: Small <code>OBJ_ENCODING_LISTPACK</code> vs. Large <code>OBJ_ENCODING_SKIPLIST</code></h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Encoding Mode</th>
            <th>Activation Threshold (Default)</th>
            <th>Memory Overhead per Item</th>
            <th><code>ZADD</code> / <code>ZSCORE</code></th>
            <th>Why It Wins in Its Regime</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>OBJ_ENCODING_LISTPACK</code> (formerly <code>ziplist</code>)</td>
            <td>$\\le 128$ elements AND all strings $\\le 64$ bytes</td>
            <td>$\\approx 2 - 4$ bytes header (1 contiguous buffer)</td>
            <td>$O(N)$ linear scan + <code>memmove</code></td>
            <td>For $N \\le 128$, scanning a contiguous 2 KB buffer in L1d is faster than chasing pointers and uses $10\\times$ less RAM!</td>
          </tr>
          <tr>
            <td><code>OBJ_ENCODING_SKIPLIST</code> (<code>dict</code> + <code>zskiplist</code>)</td>
            <td>$&gt; 128$ elements OR any string $&gt; 64$ bytes</td>
            <td>$\\approx 64 - 80$ bytes (dict entry + skiplist node)</td>
            <td>$O(\\log N)$ / $O(1)$</td>
            <td>Asymptotic $O(\\log N)$ scaling for thousands to millions of items.</td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing Redis <code>zskiplistNode</code> Layout &amp; <code>span</code> Rank Accumulation</h3>
      <svg viewBox="0 0 760 215" width="100%" height="auto" role="img" aria-label="Redis zset dual dict and zskiplist with span counters">
        <style>
          .rz-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .rz-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .rz-node { fill: rgba(59, 130, 246, 0.18); stroke: #3b82f6; stroke-width: 1.5; }
          .rz-path { fill: rgba(16, 185, 129, 0.28); stroke: #10b981; stroke-width: 2; }
          .rz-dict { fill: rgba(245, 158, 11, 0.22); stroke: #f59e0b; stroke-width: 1.5; }
        </style>
        <text x="15" y="22" class="rz-title">ZRANK "u4": Step 1: dict["u4"] -&gt; score 40 (O(1)). Step 2: Sum span Along SkipList Path (2 + 1 + 1 = Rank 4)</text>

        <rect x="20" y="42" width="105" height="32" rx="3" class="rz-path"/>
        <text x="72" y="62" text-anchor="middle" class="rz-txt">HEAD L1: sp=2</text>
        <rect x="20" y="78" width="105" height="32" rx="3" class="rz-node"/>
        <text x="72" y="98" text-anchor="middle" class="rz-txt">HEAD L0: sp=1</text>

        <rect x="165" y="78" width="105" height="32" rx="3" class="rz-node"/>
        <text x="217" y="98" text-anchor="middle" class="rz-txt">"u1" (10) L0</text>

        <rect x="310" y="42" width="105" height="32" rx="3" class="rz-path"/>
        <text x="362" y="62" text-anchor="middle" class="rz-txt">"u2" L1: sp=3</text>
        <rect x="310" y="78" width="105" height="32" rx="3" class="rz-path"/>
        <text x="362" y="98" text-anchor="middle" class="rz-txt">"u2" (20) sp=1</text>

        <rect x="455" y="78" width="105" height="32" rx="3" class="rz-path"/>
        <text x="507" y="98" text-anchor="middle" class="rz-txt">"u3" (30) sp=1</text>

        <rect x="600" y="78" width="115" height="32" rx="3" class="rz-path"/>
        <text x="657" y="98" text-anchor="middle" class="rz-txt">"u4" (40) HIT!</text>

        <rect x="20" y="128" width="700" height="72" rx="4" class="rz-dict"/>
        <text x="35" y="148" class="rz-txt">Why Redis Replaced ziplist with listpack (Redis 7.0):</text>
        <text x="35" y="168" class="rz-txt">- Old ziplist stored <code>prevlen</code> (1B or 5B) of the PREVIOUS entry; inserting a &gt;=254B entry could trigger</text>
        <text x="35" y="186" class="rz-txt">  an O(N^2) "Cascade Update" as every subsequent 250-253B entry expanded from 1B to 5B prevlen!</text>
      </svg>

      <h3>Redis ZSET Command Dispatch &amp; Encoding Promotion Flow</h3>
      <div class="mermaid">
      flowchart LR
        A["ZADD key score member"] --> B{"Current Encoding?"}
        B -- "LISTPACK" --> C{"len > 128 OR<br/>strlen(member) > 64?"}
        C -- "No" --> D["Insert into flat<br/>listpack buffer"]
        C -- "Yes (Promote)" --> E["Convert listpack to<br/>dict + zskiplist"]
        B -- "SKIPLIST" --> F["Look up old score in dict<br/>If exists, update zskiplist<br/>Else insert into dict &amp; zskiplist"]
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Why Redis Eliminated <code>ziplist</code> Cascade Updates with <code>listpack</code></div>
        <p>To support reverse iteration (<code>ZREVRANGE</code>), Redis's original compact format (<code>ziplist</code>) stored a variable-length field <code>prevrawlen</code> at the start of each entry: 1 byte if the previous entry was $&lt; 254$ bytes, or 5 bytes if $\\ge 254$ bytes. Imagine a <code>ziplist</code> where thousands of consecutive entries are each 253 bytes long. Inserting a single 300-byte entry before them forced the next entry's <code>prevrawlen</code> to expand from 1 byte to 5 bytes—growing that entry from 253 bytes to 257 bytes ($\ge 254$), which forced the <em>next</em> entry to expand to 5 bytes, triggering a catastrophic <strong>$O(N^2)$ cascading reallocation storm</strong>! Salvatore Sanfilippo solved this in <code>listpack</code>: each entry stores <em>its own</em> length at the <strong>end</strong> of the entry (<code>[encoding | data | backlen]</code>), so forward scans read left-to-right and backward scans read <code>backlen</code> right-to-left, making every entry's byte size 100% independent of its neighbors!</p>
      </div>

      <div class="simulator-mount" data-sim="sim-skiplist-lanes"></div>

      <h3>Production Implementation: Order-Statistic Skip List Node with <code>rank</code> &amp; <code>get_by_rank</code></h3>
      <pre><code class="language-cpp">#include &lt;array&gt;
#include &lt;cstddef&gt;
#include &lt;cstdint&gt;
#include &lt;string&gt;

// Simplified Redis-style Order-Statistic Skip List supporting O(log N) Rank &amp; Select
class RankedSkipList {
  static constexpr int MAX_LEVEL = 16;

  struct LevelLink {
    int next_idx = 0;       // 0 = nullptr sentinel
    std::size_t span = 0;   // Number of level-0 nodes skipped by this link
  };

  struct Node {
    double score = 0.0;
    int member_id = 0;
    int backward = 0;
    std::array&lt;LevelLink, MAX_LEVEL&gt; level{};
  };

  std::array&lt;Node, 4096&gt; pool_{}; // Contiguous pool; index 0 is head sentinel
  int pool_used_ = 1;
  int max_lvl_ = 1;

  static bool less_than(double s1, int m1, double s2, int m2) noexcept {
    return (s1 &lt; s2) || (s1 == s2 &amp;&amp; m1 &lt; m2);
  }

public:
  // O(log N) ZRANK: Returns 1-based rank of (score, member_id), or 0 if not found
  std::size_t get_rank(double score, int member_id) const noexcept {
    std::size_t rank = 0;
    int x = 0; // Start at head (index 0)
    for (int i = max_lvl_ - 1; i &gt;= 0; --i) {
      while (pool_[x].level[i].next_idx != 0) {
        const int nxt = pool_[x].level[i].next_idx;
        if (less_than(pool_[nxt].score, pool_[nxt].member_id, score, member_id) ||
            (pool_[nxt].score == score &amp;&amp; pool_[nxt].member_id == member_id)) {
          rank += pool_[x].level[i].span;
          x = nxt;
        } else {
          break;
        }
      }
      if (x != 0 &amp;&amp; pool_[x].score == score &amp;&amp; pool_[x].member_id == member_id) {
        return rank;
      }
    }
    return 0;
  }

  // O(log N) ZRANGE by Rank: Retrieve node at 1-based positional rank target_rank
  const Node* get_element_by_rank(std::size_t target_rank) const noexcept {
    std::size_t traversed = 0;
    int x = 0;
    for (int i = max_lvl_ - 1; i &gt;= 0; --i) {
      while (pool_[x].level[i].next_idx != 0 &amp;&amp;
             traversed + pool_[x].level[i].span &lt;= target_rank) {
        traversed += pool_[x].level[i].span;
        x = pool_[x].level[i].next_idx;
      }
      if (traversed == target_rank) return &amp;pool_[x];
    }
    return nullptr;
  }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Updating a Member's Score in a Skip List Without Deleting and Reinserting</div>
        <p>When a user executes <code>ZADD key new_score existing_member</code> in Redis, can you simply look up the node via the hash table and overwrite <code>node-&gt;score = new_score</code> in place? <strong>Only if the node's relative sorted position between its level-0 predecessor and successor does not change!</strong> If <code>new_score</code> moves the node past even a single neighbor, overwriting <code>score</code> in place corrupts the sorted invariant of every Skip List level and breaks all <code>span</code> counters. Redis explicitly checks whether the new score still lies strictly between <code>node->backward->score</code> and <code>node->level[0].forward->score</code>; if not, it deletes the node (decrementing <code>span</code> on untouched upper levels) and reinserts it at its new position.</p>
      </div>
    `,
    keyTakeaways: [
      "Redis ZSETs combine a hash table (dict: member -> score) for O(1) point lookups with an order-statistic Skip List (zskiplist: (score, member)) for O(log N) range and rank queries.",
      "Augmenting each Skip List forward pointer with a <code>span</code> counter (number of level-0 nodes skipped) enables O(log N) positional rank lookup (ZRANK) and k-th element selection (ZRANGE).",
      "For small ZSETs (<= 128 elements, <= 64B strings), Redis uses a single contiguous <code>listpack</code> array instead of a Skip List + Dict, saving 10x memory and exploiting L1 cache locality.",
      "Redis 7.0 replaced <code>ziplist</code> with <code>listpack</code> by moving each entry's length field (<code>backlen</code>) to the end of the entry itself, eliminating O(N^2) cascading length-expansion updates."
    ],
    furtherReading: [
      {
        title: "Redis Open Source Implementation: src/t_zset.c & src/server.h (zskiplist & zset Dual Index)",
        url: "https://github.com/redis/redis/blob/unstable/src/t_zset.c",
        type: "Production Source Code"
      },
      {
        title: "Salvatore Sanfilippo (antirez) — Listpack Specification: A Binary Serialized List Format Replacing Ziplist",
        url: "https://github.com/antirez/listpack/blob/master/listpack.md",
        type: "Design Specification"
      }
    ]
  },

  "build-lfu-lru-cache": {
    title: "Build Lab: O(1) LRU and Frequency-Bucketed LFU Cache Engine",
    video: {
      youtubeId: "bLEIHn-DgoA",
      id: "bLEIHn-DgoA",
      url: "https://www.youtube.com/embed/bLEIHn-DgoA",
      title: "Designing an O(1) LFU Cache with Frequency-Bucketed Doubly Linked Lists",
      channel: "NeetCodeIO",
      duration: "21:15",
      start: 0,
      length: "21m",
      why: "Deep-dive lecture covering Build Lab: O(1) LRU and Frequency-Bucketed LFU Cache Engine."
    },
    intuition: "Building a production-grade $O(1)$ LFU Cache requires orchestrating three invariants simultaneously without a single memory leak or dangling iterator: (1) a key lookup table <code>key -> Node</code>, (2) per-frequency circular doubly linked lists <code>freq -> List</code> that preserve LRU tie-breaking within each frequency tier, and (3) a deterministic <code>min_freq</code> cursor that tracks the lowest populated frequency bucket in $O(1)$ time.",
    content: `
      <h3>End-to-End State Machine of the $O(1)$ LFU Engine</h3>
      <p>Let us trace every edge case required to implement a zero-allocation, bug-free $O(1)$ LFU Cache of capacity $C$. Every cached item is represented by a <code>Node</code> containing <code>{key, value, freq, prev, next}</code>. We maintain:</p>
      <ul>
        <li><code>key_table</code>: Maps <code>key -&gt; Node*</code> (or arena slot index).</li>
        <li><code>freq_table</code>: Maps <code>freq -&gt; DoublyLinkedList</code>, where each list orders nodes of that exact frequency from Most Recently Used (front) to Least Recently Used (back).</li>
        <li><code>min_freq</code>: An integer tracking the smallest frequency $f \\ge 1$ such that <code>freq_table[f]</code> is non-empty.</li>
      </ul>

      <div class="invariant-box">
        <div class="invariant-title">Verification Checklist: The 4 Invariant Transitions of O(1) LFU</div>
        <ol>
          <li><strong>Transition 1 — Cache Hit on <code>get(key)</code>:</strong> Find node $u$ with frequency $f = u.\\text{freq}$. Unlink $u$ from <code>freq_table[f]</code>. If <code>freq_table[f].empty()</code> and $f == \\text{min\\_freq}$, set $\\text{min\\_freq} = f + 1$. Set $u.\\text{freq} = f + 1$ and push $u$ to the MRU front of <code>freq_table[f + 1]</code>. Return $u.\\text{value}$.</li>
          <li><strong>Transition 2 — Cache Hit on <code>put(key, new_val)</code>:</strong> Overwrite $u.\\text{value} = \\text{new\\_val}$, and execute the <strong>exact same frequency promotion logic</strong> as Transition 1!</li>
          <li><strong>Transition 3 — Cache Miss on <code>put(key, val)</code> when Full (<code>size == capacity</code>):</strong> Look up bucket <code>freq_table[min_freq]</code>. Pop its <strong>LRU tail node</strong> $v$, and erase $v.\\text{key}$ from <code>key_table</code>. (Note: we do NOT need to update <code>min_freq</code> based on $v$'s removal because we are about to reset <code>min_freq = 1</code> in Transition 4!)</li>
          <li><strong>Transition 4 — Inserting the New Node on <code>put(key, val)</code>:</strong> Initialize node $w$ with $\\text{freq} = 1$, push $w$ to the MRU front of <code>freq_table[1]</code>, insert <code>key_table[key] = w</code>, and unconditionally set <code>min_freq = 1</code>.</li>
        </ol>
      </div>

      <h3>Operation Complexity &amp; Edge-Case Matrix</h3>
      <table class="complexity-matrix">
        <thead>
          <tr>
            <th>Operation / Edge Case</th>
            <th><code>min_freq</code> Mutation</th>
            <th>Bucket Lists Touched</th>
            <th>Time Complexity</th>
            <th>Common Implementation Bug</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>get(key)</code> (Hit at $f == \\text{min\\_freq}$, last item in bucket)</td>
            <td><code>min_freq = f + 1</code></td>
            <td>Unlink from $f$, push front $f+1$</td>
            <td>$O(1)$</td>
            <td>Forgetting to check if bucket $f$ became empty</td>
          </tr>
          <tr>
            <td><code>get(key)</code> (Hit at $f &gt; \\text{min\\_freq}$)</td>
            <td>Unchanged</td>
            <td>Unlink from $f$, push front $f+1$</td>
            <td>$O(1)$</td>
            <td>Incrementing <code>min_freq</code> when $f \\neq \\text{min\\_freq}$!</td>
          </tr>
          <tr>
            <td><code>put(key, val)</code> (New key when full)</td>
            <td>Reset <code>min_freq = 1</code></td>
            <td>Pop tail of <code>min_freq</code>, push front of $1$</td>
            <td>$O(1)$</td>
            <td>Evicting AFTER setting <code>min_freq = 1</code>!</td>
          </tr>
          <tr>
            <td><code>capacity == 0</code></td>
            <td>N/A (No-op)</td>
            <td>None</td>
            <td>$O(1)$</td>
            <td>Attempting to evict from an empty <code>freq_table[0]</code></td>
          </tr>
        </tbody>
      </table>

      <h3>Visualizing Eviction + Insertion Order on Cache-Full Miss</h3>
      <svg viewBox="0 0 760 195" width="100%" height="auto" role="img" aria-label="LFU cache full miss eviction before min_freq reset">
        <style>
          .bl-txt { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: currentColor; }
          .bl-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; fill: currentColor; }
          .bl-step1 { fill: rgba(239, 68, 68, 0.22); stroke: #ef4444; stroke-width: 1.5; }
          .bl-step2 { fill: rgba(16, 185, 129, 0.24); stroke: #10b981; stroke-width: 1.5; }
          .bl-warn { fill: rgba(245, 158, 11, 0.2); stroke: #f59e0b; stroke-width: 1.5; }
        </style>
        <text x="15" y="24" class="bl-title">Critical Ordering When Cache Is Full (Suppose min_freq = 3 Before New Key X Arrives)</text>

        <rect x="20" y="42" width="340" height="62" rx="4" class="bl-step1"/>
        <text x="190" y="64" text-anchor="middle" class="bl-txt">Step 1: Evict FIRST Using OLD min_freq (3)</text>
        <text x="190" y="84" text-anchor="middle" class="bl-txt">victim = freq_lists[3].pop_lru_back()</text>

        <text x="372" y="77" class="bl-txt">--&gt;</text>

        <rect x="400" y="42" width="340" height="62" rx="4" class="bl-step2"/>
        <text x="570" y="64" text-anchor="middle" class="bl-txt">Step 2: Insert New Key X &amp; Reset min_freq = 1</text>
        <text x="570" y="84" text-anchor="middle" class="bl-txt">freq_lists[1].push_mru_front(X); min_freq = 1;</text>

        <rect x="20" y="122" width="720" height="54" rx="4" class="bl-warn"/>
        <text x="35" y="144" class="bl-txt">Fatal Bug: If you insert X (or set min_freq = 1) BEFORE evicting, you will evict from freq_lists[1]</text>
        <text x="35" y="162" class="bl-txt">           (immediately evicting X itself!) instead of evicting the true victim from freq_lists[3]!</text>
      </svg>

      <h3>Complete Control Flow of <code>LFUCache::put(key, value)</code></h3>
      <div class="mermaid">
      flowchart TD
        A["put(key, val)"] --> B{"capacity == 0?"}
        B -- "Yes" --> C["Return immediately"]
        B -- "No" --> D{"Is key in key_table?"}
        D -- "Yes (Update)" --> E["Update node.val = val<br/>Call touch(node) to promote freq"]
        D -- "No (Miss)" --> F{"size == capacity?"}
        F -- "Yes (Full)" --> G["Evict LRU tail of freq_table[min_freq]<br/>Erase victim.key from key_table"]
        F -- "No" --> H["Allocate/Reuse Node(key, val, freq=1)<br/>Push to MRU front of freq_table[1]<br/>Set min_freq = 1"]
        G --> H
      </div>

      <div class="hardware-box">
        <div class="hardware-title">Hardware Reality: Eliminating Empty Bucket Bloat &amp; <code>std::list</code> Allocator Thrashing</div>
        <p>A textbook C++ LFU implementation using <code>std::unordered_map&lt;int, std::list&lt;Node&gt;&gt; freq_table</code> suffers from two performance hazards in long-running services:</p>
        <ol>
          <li><strong>Per-Promotion Heap Allocations:</strong> Calling <code>freq_table[f].erase(it)</code> and <code>freq_table[f+1].push_front(...)</code> deallocates a heap node and allocates a brand-new heap node on <em>every single cache hit</em>! Using <code>std::list::splice</code> (or intrusive doubly linked list nodes) moves the existing node between frequency buckets by rewiring 4 pointers with <strong>zero heap allocations</strong>.</li>
          <li><strong>Unbounded Empty Frequency Buckets:</strong> If a hot item is accessed $10^7$ times, a naive <code>freq_table</code> creates $10^7$ empty <code>std::list</code> entries for frequencies $1, 2, \\dots, 10^7 - 1$, exhausting gigabytes of RAM! In production, either erase empty buckets from <code>freq_table</code> when their size hits 0, or store frequency buckets as an intrusive doubly linked list of active frequency headers.</li>
        </ol>
      </div>

      <div class="simulator-mount" data-sim="sim-lru-lfu-cache"></div>

      <h3>Production Implementation: Zero-Allocation Intrusive O(1) LFU Cache Engine</h3>
      <pre><code class="language-cpp">#include &lt;cstdint&gt;
#include &lt;unordered_map&gt;
#include &lt;vector&gt;

class LFUCache {
  struct Node {
    int key = 0;
    int value = 0;
    int freq = 1;
    int prev = -1;
    int next = -1;
  };

  struct FreqList {
    int head = -1; // MRU front
    int tail = -1; // LRU back
    int count = 0;
  };

  int capacity_;
  int size_ = 0;
  int min_freq_ = 0;
  std::vector&lt;Node&gt; pool_;
  std::vector&lt;int&gt; free_slots_;
  std::unordered_map&lt;int, int&gt; key_to_slot_;
  std::unordered_map&lt;int, FreqList&gt; freq_lists_;

  void remove_from_list(int slot, int freq) {
    auto it = freq_lists_.find(freq);
    FreqList&amp; list = it-&gt;second;
    const int p = pool_[slot].prev;
    const int n = pool_[slot].next;

    if (p != -1) pool_[p].next = n;
    else list.head = n;

    if (n != -1) pool_[n].prev = p;
    else list.tail = p;

    pool_[slot].prev = pool_[slot].next = -1;
    if (--list.count == 0) {
      freq_lists_.erase(it); // Prevent unbounded empty bucket memory leak!
      if (min_freq_ == freq) {
        ++min_freq_;
      }
    }
  }

  void push_front_list(int slot, int freq) {
    FreqList&amp; list = freq_lists_[freq];
    pool_[slot].prev = -1;
    pool_[slot].next = list.head;
    if (list.head != -1) pool_[list.head].prev = slot;
    else list.tail = slot;
    list.head = slot;
    ++list.count;
  }

  void touch(int slot) {
    const int f = pool_[slot].freq;
    remove_from_list(slot, f);
    pool_[slot].freq = f + 1;
    push_front_list(slot, f + 1);
  }

public:
  explicit LFUCache(int capacity) : capacity_(capacity), pool_(capacity &gt; 0 ? capacity : 0) {
    for (int i = capacity - 1; i &gt;= 0; --i) {
      free_slots_.push_back(i);
    }
  }

  int get(int key) {
    auto it = key_to_slot_.find(key);
    if (it == key_to_slot_.end()) return -1;
    const int slot = it-&gt;second;
    touch(slot);
    return pool_[slot].value;
  }

  void put(int key, int value) {
    if (capacity_ &lt;= 0) return;

    auto it = key_to_slot_.find(key);
    if (it != key_to_slot_.end()) {
      const int slot = it-&gt;second;
      pool_[slot].value = value;
      touch(slot);
      return;
    }

    int slot = -1;
    if (size_ == capacity_) {
      // Evict LRU tail of min_freq_ BEFORE resetting min_freq_ = 1!
      const int victim = freq_lists_[min_freq_].tail;
      remove_from_list(victim, min_freq_);
      key_to_slot_.erase(pool_[victim].key);
      slot = victim; // Reuse evicted slot in place!
    } else {
      slot = free_slots_.back();
      free_slots_.pop_back();
      ++size_;
    }

    pool_[slot].key = key;
    pool_[slot].value = value;
    pool_[slot].freq = 1;
    push_front_list(slot, 1);
    key_to_slot_[key] = slot;
    min_freq_ = 1;
  }
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Production Pitfall: Evicting After Inserting &amp; Leaking Empty Frequency Buckets</div>
        <p>When implementing <code>LFUCache::put</code> on a cache miss when <code>size == capacity</code>, you must <strong>always evict the victim from <code>freq_lists_[min_freq_]</code> BEFORE inserting the new key and resetting <code>min_freq_ = 1</code></strong>. If you insert the new key first (or set <code>min_freq_ = 1</code> first), and the old <code>min_freq_</code> was $&gt; 1$, then evicting from <code>min_freq_ == 1</code> will immediately evict the brand-new item you just inserted! Additionally, always erase a frequency bucket from <code>freq_lists_</code> when its count drops to 0 so long-running caches do not leak millones of empty hash entries as item frequencies climb.</p>
      </div>
    `,
    keyTakeaways: [
      "In an O(1) LFU cache, updating an existing key via put(key, val) must increment its frequency and promote it just like get(key).",
      "When the cache is full on a miss, always evict the LRU tail of freq_lists[min_freq] BEFORE inserting the new key at freq = 1 and setting min_freq = 1.",
      "Reusing pre-allocated node slots (or using std::list::splice) moves nodes across frequency tiers in O(1) time with zero heap allocations.",
      "Erasing empty frequency buckets from freq_lists when their count reaches 0 prevents unbounded memory growth when items are accessed millions of times."
    ],
    furtherReading: [
      {
        title: "Ketan Shah, Anirban Mitra, Dhruv Matani — An O(1) Algorithm for Implementing the LFU Cache Eviction Scheme",
        url: "https://dhruvbird.com/lfu.pdf",
        type: "Seminal Paper"
      },
      {
        title: "Ben Manes — Design of a Modern Cache (Java Caffeine & W-TinyLFU Architecture)",
        url: "https://highscalability.com/design-of-a-modern-cache/",
        type: "Engineering Article"
      }
    ]
  }
};

