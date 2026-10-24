// Data Structures & Algorithms In Depth — Master Curriculum v1.0 (6 Tracks, 18 Modules, 180 Units)
window.CURRICULUM_DATA = {
  "stats": {
    "tracks": 6,
    "units": 180,
    "lessons": 133,
    "systems": 31,
    "builds": 16
  },
  "parts": [
    {
      "id": "track-1",
      "number": 1,
      "title": "Foundations, Memory Hierarchy & Linear Structures",
      "summary": "Master asymptotic proofs, recurrence relations, CPU cache mechanics, contiguous arrays, bitwise parallelism, and pointer invariants.",
      "hours": 30,
      "modules": [
        {
          "id": "m01",
          "number": "1.1",
          "legacyNumber": "01",
          "title": "Asymptotic Analysis, Recurrences & Memory Hierarchy",
          "summary": "Why constant factors and 64-byte cache lines matter alongside O(N), recurrence proofs (Master & Akra-Bazzi), and potential-method amortized analysis.",
          "units": [
            {
              "slug": "ram-model-vs-modern-cpu",
              "title": "The RAM Model vs Modern CPU Cache Hierarchy",
              "kind": "lesson",
              "archive": {
                "slug": "ram-model-vs-modern-cpu",
                "file": "ram-model-vs-modern-cpu.md",
                "title": "The RAM Model vs Modern CPU Cache Hierarchy",
                "displayTitle": "The RAM Model vs Modern CPU Cache Hierarchy",
                "type": "lesson",
                "tags": [
                  "foundations",
                  "memory-hierarchy",
                  "cache-locality"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why an O(N) pointer-chasing traversal can run 20x slower than an O(N log N) contiguous array sort on modern silicon.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "asymptotic-notations-rigor",
              "title": "Asymptotic Notation Rigor: O, Ω, Θ, o, ω & Limit Laws",
              "kind": "lesson",
              "archive": {
                "slug": "asymptotic-notations-rigor",
                "file": "asymptotic-notations-rigor.md",
                "title": "Asymptotic Notation Rigor: O, Ω, Θ, o, ω & Limit Laws",
                "displayTitle": "Asymptotic Notation Rigor: O, Ω, Θ, o, ω & Limit Laws",
                "type": "lesson",
                "tags": [
                  "asymptotics",
                  "proofs",
                  "foundations"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Formal set-theoretic definitions of asymptotic growth rates, limit ratios, L'Hôpital's rule, and common hidden-constant fallacies.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "recurrence-relations-master-theorem",
              "title": "Solving Recurrences: Recursion Trees, Substitution & Master Theorem",
              "kind": "lesson",
              "archive": {
                "slug": "recurrence-relations-master-theorem",
                "file": "recurrence-relations-master-theorem.md",
                "title": "Solving Recurrences: Recursion Trees, Substitution & Master Theorem",
                "displayTitle": "Solving Recurrences: Recursion Trees, Substitution & Master Theorem",
                "type": "lesson",
                "tags": [
                  "recurrences",
                  "master-theorem",
                  "divide-and-conquer"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Deriving tight closed-form bounds via work-per-level recursion trees, inductive substitution, and the three regimes of the Master Theorem.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "akra-bazzi-uneven-divides",
              "title": "Beyond Master Theorem: Akra-Bazzi for Uneven Subproblems",
              "kind": "lesson",
              "archive": {
                "slug": "akra-bazzi-uneven-divides",
                "file": "akra-bazzi-uneven-divides.md",
                "title": "Beyond Master Theorem: Akra-Bazzi for Uneven Subproblems",
                "displayTitle": "Beyond Master Theorem: Akra-Bazzi for Uneven Subproblems",
                "type": "lesson",
                "tags": [
                  "recurrences",
                  "akra-bazzi",
                  "asymptotics"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Solving recurrences with unequal subproblem splits like T(n) = T(n/3) + T(2n/3) + O(n) via the characteristic exponent p and integral formula.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "amortized-analysis-potential",
              "title": "Amortized Analysis: Aggregate, Banker's & Physicist's Potential (Φ)",
              "kind": "lesson",
              "archive": {
                "slug": "amortized-analysis-potential",
                "file": "amortized-analysis-potential.md",
                "title": "Amortized Analysis: Aggregate, Banker's & Physicist's Potential (Φ)",
                "displayTitle": "Amortized Analysis: Aggregate, Banker's & Physicist's Potential (Φ)",
                "type": "lesson",
                "tags": [
                  "amortized-analysis",
                  "potential-method",
                  "proofs"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Proving worst-case sequence bounds without probability using aggregate counting, accounting credits, and Tarjan's potential function Φ.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "space-complexity-stack-frames",
              "title": "Space Complexity: Call Stacks, Tail Recursion & Auxiliary Heap",
              "kind": "lesson",
              "archive": {
                "slug": "space-complexity-stack-frames",
                "file": "space-complexity-stack-frames.md",
                "title": "Space Complexity: Call Stacks, Tail Recursion & Auxiliary Heap",
                "displayTitle": "Space Complexity: Call Stacks, Tail Recursion & Auxiliary Heap",
                "type": "lesson",
                "tags": [
                  "space-complexity",
                  "recursion",
                  "memory"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Accounting for activation records, stack depth overflows, tail-call elimination (TCO), and in-place vs auxiliary heap allocations.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "cache-oblivious-algorithms",
              "title": "Cache-Aware vs Cache-Oblivious Layouts (van Emde Boas Layout)",
              "kind": "lesson",
              "archive": {
                "slug": "cache-oblivious-algorithms",
                "file": "cache-oblivious-algorithms.md",
                "title": "Cache-Aware vs Cache-Oblivious Layouts (van Emde Boas Layout)",
                "displayTitle": "Cache-Aware vs Cache-Oblivious Layouts (van Emde Boas Layout)",
                "type": "lesson",
                "tags": [
                  "cache-oblivious",
                  "memory-hierarchy",
                  "veb-layout"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Achieving optimal I/O transfers across all levels of cache without tuning for block size B or cache capacity M.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "branch-prediction-simd-cost",
              "title": "Branch Misprediction Penalties & Branchless Algorithmic Design",
              "kind": "lesson",
              "archive": {
                "slug": "branch-prediction-simd-cost",
                "file": "branch-prediction-simd-cost.md",
                "title": "Branch Misprediction Penalties & Branchless Algorithmic Design",
                "displayTitle": "Branch Misprediction Penalties & Branchless Algorithmic Design",
                "type": "lesson",
                "tags": [
                  "branch-prediction",
                  "simd",
                  "hardware"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "How speculative execution pipelines stall on random branches (15–20 cycles) and how CMOV/bitwise arithmetic eliminates branch hazards.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "complexity-tradeoff-framework",
              "title": "Time-Space-Precomputation Tradeoff Design Framework",
              "kind": "design",
              "archive": {
                "slug": "complexity-tradeoff-framework",
                "file": "complexity-tradeoff-framework.md",
                "title": "Time-Space-Precomputation Tradeoff Design Framework",
                "displayTitle": "Time-Space-Precomputation Tradeoff Design Framework",
                "type": "design",
                "tags": [
                  "tradeoffs",
                  "algorithm-design",
                  "constraints"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Translating input size N and latency budgets into optimal complexity targets using precomputation, hashing, and space-time duality.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-v8-elements-kinds",
              "title": "Production Case Study: How V8 Optimizes JS Arrays (SMI, Double & Holey Elements)",
              "kind": "case",
              "archive": {
                "slug": "case-v8-elements-kinds",
                "file": "case-v8-elements-kinds.md",
                "title": "Production Case Study: How V8 Optimizes JS Arrays (SMI, Double & Holey Elements)",
                "displayTitle": "Production Case Study: How V8 Optimizes JS Arrays (SMI, Double & Holey Elements)",
                "type": "case",
                "tags": [
                  "v8",
                  "arrays",
                  "production-internals"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Inside V8's Elements Kinds lattice: how PACKED_SMI_ELEMENTS, PACKED_DOUBLE_ELEMENTS, and HOLEY transitions dictate CPU cache efficiency.",
                "mermaidCount": 1
              }
            }
          ]
        },
        {
          "id": "m02",
          "number": "1.2",
          "legacyNumber": "02",
          "title": "Contiguous Arrays, Bit Manipulation & Pointer Idioms",
          "summary": "Geometric array resizing, prefix sums, two-pointer loop invariants, two's-complement bit manipulation, SWAR parallelism, and heavy hitters.",
          "units": [
            {
              "slug": "dynamic-arrays-geometric-resizing",
              "title": "Dynamic Arrays: Geometric Growth Factors (2× vs 1.5×) & Memory Reuse",
              "kind": "lesson",
              "archive": {
                "slug": "dynamic-arrays-geometric-resizing",
                "file": "dynamic-arrays-geometric-resizing.md",
                "title": "Dynamic Arrays: Geometric Growth Factors (2× vs 1.5×) & Memory Reuse",
                "displayTitle": "Dynamic Arrays: Geometric Growth Factors (2× vs 1.5×) & Memory Reuse",
                "type": "lesson",
                "tags": [
                  "dynamic-arrays",
                  "amortized",
                  "memory-allocator"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why growth factor 2× prevents heap address reuse while φ ≈ 1.618 or 1.5× allows subsequent allocations to reclaim previously freed blocks.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "prefix-sums-difference-arrays",
              "title": "1D/2D Prefix Sums & Difference Arrays for O(1) Range Updates",
              "kind": "lesson",
              "archive": {
                "slug": "prefix-sums-difference-arrays",
                "file": "prefix-sums-difference-arrays.md",
                "title": "1D/2D Prefix Sums & Difference Arrays for O(1) Range Updates",
                "displayTitle": "1D/2D Prefix Sums & Difference Arrays for O(1) Range Updates",
                "type": "lesson",
                "tags": [
                  "prefix-sums",
                  "difference-array",
                  "arrays"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Duality between prefix accumulation and discrete differentiation for O(1) static range queries and batch range additions.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "two-pointers-invariant-proofs",
              "title": "Two-Pointer Invariants: Converging, Fast-Slow & Dutch National Flag",
              "kind": "design",
              "archive": {
                "slug": "two-pointers-invariant-proofs",
                "file": "two-pointers-invariant-proofs.md",
                "title": "Two-Pointer Invariants: Converging, Fast-Slow & Dutch National Flag",
                "displayTitle": "Two-Pointer Invariants: Converging, Fast-Slow & Dutch National Flag",
                "type": "design",
                "tags": [
                  "two-pointers",
                  "invariants",
                  "partitioning"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Proving monotonicity and completeness in converging two-pointer scans and Dijkstra's 3-way Dutch National Flag partition.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "sliding-window-monotonicity",
              "title": "Fixed & Variable Sliding Windows: Monotonicity & Two-Pointer Validity",
              "kind": "design",
              "archive": {
                "slug": "sliding-window-monotonicity",
                "file": "sliding-window-monotonicity.md",
                "title": "Fixed & Variable Sliding Windows: Monotonicity & Two-Pointer Validity",
                "displayTitle": "Fixed & Variable Sliding Windows: Monotonicity & Two-Pointer Validity",
                "type": "design",
                "tags": [
                  "sliding-window",
                  "two-pointers",
                  "monotonicity"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "When the two-pointer window invariant holds (non-negative weights / monotonic predicates) and when it breaks down.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "kadane-subarray-invariants",
              "title": "Maximum Subarray (Kadane's Algorithm) & Circular Array Extensions",
              "kind": "lesson",
              "archive": {
                "slug": "kadane-subarray-invariants",
                "file": "kadane-subarray-invariants.md",
                "title": "Maximum Subarray (Kadane's Algorithm) & Circular Array Extensions",
                "displayTitle": "Maximum Subarray (Kadane's Algorithm) & Circular Array Extensions",
                "type": "lesson",
                "tags": [
                  "kadane",
                  "subarray",
                  "invariants"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Deriving Kadane's linear-time optimal substructure invariant and extending it to circular buffers via min-subarray complement.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "bit-manipulation-twos-complement",
              "title": "Twos-Complement Arithmetic, Bitmasks, Brian Kernighan's Trick & XOR",
              "kind": "lesson",
              "archive": {
                "slug": "bit-manipulation-twos-complement",
                "file": "bit-manipulation-twos-complement.md",
                "title": "Twos-Complement Arithmetic, Bitmasks, Brian Kernighan's Trick & XOR",
                "displayTitle": "Twos-Complement Arithmetic, Bitmasks, Brian Kernighan's Trick & XOR",
                "type": "lesson",
                "tags": [
                  "bit-manipulation",
                  "twos-complement",
                  "xor"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Bitwise algebra in two's complement: isolating lowest set bits (x & -x), clearing lowest set bits (x & (x-1)), and XOR linear independence.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "bitsets-word-level-parallelism",
              "title": "Bitsets, Popcount (__builtin_popcount) & O(N/64) Word-Level Parallelism",
              "kind": "lesson",
              "archive": {
                "slug": "bitsets-word-level-parallelism",
                "file": "bitsets-word-level-parallelism.md",
                "title": "Bitsets, Popcount (__builtin_popcount) & O(N/64) Word-Level Parallelism",
                "displayTitle": "Bitsets, Popcount (__builtin_popcount) & O(N/64) Word-Level Parallelism",
                "type": "lesson",
                "tags": [
                  "bitsets",
                  "swar",
                  "popcount"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Packing 64 boolean states into CPU registers for 64× speedups in set intersections, transitive closures, and subset-sum DP.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "in-place-matrix-cyclic-shifts",
              "title": "In-Place Array Rotations (Juggling/Reversal) & Matrix Transposition",
              "kind": "lesson",
              "archive": {
                "slug": "in-place-matrix-cyclic-shifts",
                "file": "in-place-matrix-cyclic-shifts.md",
                "title": "In-Place Array Rotations (Juggling/Reversal) & Matrix Transposition",
                "displayTitle": "In-Place Array Rotations (Juggling/Reversal) & Matrix Transposition",
                "type": "lesson",
                "tags": [
                  "arrays",
                  "in-place",
                  "rotations"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Bentley's three-reversal theorem vs GCD cycle-leader juggling for O(1) auxiliary space array rotation and matrix manipulation.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "boyer-moore-majority-misra-gries",
              "title": "Boyer-Moore Majority Vote & Misra-Gries Heavy Hitters",
              "kind": "lesson",
              "archive": {
                "slug": "boyer-moore-majority-misra-gries",
                "file": "boyer-moore-majority-misra-gries.md",
                "title": "Boyer-Moore Majority Vote & Misra-Gries Heavy Hitters",
                "displayTitle": "Boyer-Moore Majority Vote & Misra-Gries Heavy Hitters",
                "type": "lesson",
                "tags": [
                  "streaming",
                  "majority-vote",
                  "heavy-hitters"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Finding frequent elements in a single O(N) pass and O(k) space via pairwise element cancellation.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-dynamic-circular-deque",
              "title": "Build Lab: Dynamic Circular Buffer & Amortized O(1) Vector",
              "kind": "build",
              "archive": {
                "slug": "build-dynamic-circular-deque",
                "file": "build-dynamic-circular-deque.md",
                "title": "Build Lab: Dynamic Circular Buffer & Amortized O(1) Vector",
                "displayTitle": "Build Lab: Dynamic Circular Buffer & Amortized O(1) Vector",
                "type": "build",
                "tags": [
                  "build-lab",
                  "deque",
                  "ring-buffer"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Implement a power-of-2 bitmasked circular deque and dynamic array with geometric resizing and zero-allocation wrap-around indexing.",
                "mermaidCount": 1
              }
            }
          ]
        },
        {
          "id": "m03",
          "number": "1.3",
          "legacyNumber": "03",
          "title": "Linked Structures, Monotonic Stacks/Queues & Cache-Conscious Lists",
          "summary": "Intrusive linked lists, Floyd/Brent cycle detection, unrolled lists, probabilistic skip lists, monotonic stacks/deques, and O(1) LRU/LFU caches.",
          "units": [
            {
              "slug": "singly-doubly-intrusive-lists",
              "title": "Singly, Doubly & Intrusive Linked Lists (Linux Kernel list_head)",
              "kind": "lesson",
              "archive": {
                "slug": "singly-doubly-intrusive-lists",
                "file": "singly-doubly-intrusive-lists.md",
                "title": "Singly, Doubly & Intrusive Linked Lists (Linux Kernel list_head)",
                "displayTitle": "Singly, Doubly & Intrusive Linked Lists (Linux Kernel list_head)",
                "type": "lesson",
                "tags": [
                  "linked-lists",
                  "intrusive-lists",
                  "linux-kernel"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Sentinel dummy nodes, pointer manipulation invariants, and why the Linux kernel embeds list_head inside structs via container_of.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "floyd-brent-cycle-detection",
              "title": "Pointer Chasing: Floyd's Tortoise-and-Hare vs Brent's Cycle Detection",
              "kind": "lesson",
              "archive": {
                "slug": "floyd-brent-cycle-detection",
                "file": "floyd-brent-cycle-detection.md",
                "title": "Pointer Chasing: Floyd's Tortoise-and-Hare vs Brent's Cycle Detection",
                "displayTitle": "Pointer Chasing: Floyd's Tortoise-and-Hare vs Brent's Cycle Detection",
                "type": "lesson",
                "tags": [
                  "cycle-detection",
                  "floyd",
                  "brent"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Mathematical proof of entry-point convergence μ and period λ in functional graphs, plus Brent's teleporting power-of-2 optimization.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "unrolled-linked-lists-ropes",
              "title": "Unrolled Linked Lists & Gap Buffers: Defeating Pointer Chasing",
              "kind": "lesson",
              "archive": {
                "slug": "unrolled-linked-lists-ropes",
                "file": "unrolled-linked-lists-ropes.md",
                "title": "Unrolled Linked Lists & Gap Buffers: Defeating Pointer Chasing",
                "displayTitle": "Unrolled Linked Lists & Gap Buffers: Defeating Pointer Chasing",
                "type": "lesson",
                "tags": [
                  "unrolled-lists",
                  "gap-buffer",
                  "text-editors"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Storing cache-line-sized arrays inside list nodes and gap buffers to achieve O(1) localized edits without pointer overhead.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "skip-lists-probabilistic-indexing",
              "title": "Skip Lists: Probabilistic Multi-Level Indexing & O(log N) Search Proof",
              "kind": "lesson",
              "archive": {
                "slug": "skip-lists-probabilistic-indexing",
                "file": "skip-lists-probabilistic-indexing.md",
                "title": "Skip Lists: Probabilistic Multi-Level Indexing & O(log N) Search Proof",
                "displayTitle": "Skip Lists: Probabilistic Multi-Level Indexing & O(log N) Search Proof",
                "type": "lesson",
                "tags": [
                  "skip-lists",
                  "probabilistic",
                  "indexing"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Pugh's geometric level promotion via coin flips: proving O(log N) high-probability search and lock-free concurrency advantages over balanced trees.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "stacks-expression-evaluation",
              "title": "Call Stacks, Dijkstra's Shunting-Yard Algorithm & AST Evaluation",
              "kind": "lesson",
              "archive": {
                "slug": "stacks-expression-evaluation",
                "file": "stacks-expression-evaluation.md",
                "title": "Call Stacks, Dijkstra's Shunting-Yard Algorithm & AST Evaluation",
                "displayTitle": "Call Stacks, Dijkstra's Shunting-Yard Algorithm & AST Evaluation",
                "type": "lesson",
                "tags": [
                  "stacks",
                  "shunting-yard",
                  "parsing"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Operator precedence parsing, right-associative exponentiation, and converting infix expressions to RPN/ASTs without recursion.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "monotonic-stack-next-greater",
              "title": "Monotonic Stacks: Next Greater Element, Histogram & Subarray Mins",
              "kind": "design",
              "archive": {
                "slug": "monotonic-stack-next-greater",
                "file": "monotonic-stack-next-greater.md",
                "title": "Monotonic Stacks: Next Greater Element, Histogram & Subarray Mins",
                "displayTitle": "Monotonic Stacks: Next Greater Element, Histogram & Subarray Mins",
                "type": "design",
                "tags": [
                  "monotonic-stack",
                  "amortized",
                  "design-pattern"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Maintaining strictly ordered stack prefixes to compute all-nearest smaller/greater boundaries and sum of subarray minimums in O(N).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "monotonic-deque-sliding-extrema",
              "title": "Monotonic Deques: O(N) Sliding Window Minimum/Maximum",
              "kind": "design",
              "archive": {
                "slug": "monotonic-deque-sliding-extrema",
                "file": "monotonic-deque-sliding-extrema.md",
                "title": "Monotonic Deques: O(N) Sliding Window Minimum/Maximum",
                "displayTitle": "Monotonic Deques: O(N) Sliding Window Minimum/Maximum",
                "type": "design",
                "tags": [
                  "monotonic-deque",
                  "sliding-window",
                  "amortized"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Pruning dominated tail elements and expired head indices to answer sliding window extrema in amortized O(1) per step.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "lru-lfu-eviction-structures",
              "title": "Composing Hash Maps + Doubly Linked Lists: O(1) LRU & LFU Caches",
              "kind": "design",
              "archive": {
                "slug": "lru-lfu-eviction-structures",
                "file": "lru-lfu-eviction-structures.md",
                "title": "Composing Hash Maps + Doubly Linked Lists: O(1) LRU & LFU Caches",
                "displayTitle": "Composing Hash Maps + Doubly Linked Lists: O(1) LRU & LFU Caches",
                "type": "design",
                "tags": [
                  "lru-cache",
                  "lfu-cache",
                  "data-structure-design"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Achieving strict O(1) get and put in LFU caches using a doubly linked list of frequency buckets rather than a O(log N) min-heap.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-redis-skiplist-ziplist",
              "title": "Production Case Study: Redis ZSET (Listpack vs SkipList + Dict Dual Indexing)",
              "kind": "case",
              "archive": {
                "slug": "case-redis-skiplist-ziplist",
                "file": "case-redis-skiplist-ziplist.md",
                "title": "Production Case Study: Redis ZSET (Listpack vs SkipList + Dict Dual Indexing)",
                "displayTitle": "Production Case Study: Redis ZSET (Listpack vs SkipList + Dict Dual Indexing)",
                "type": "case",
                "tags": [
                  "redis",
                  "skiplist",
                  "listpack"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "How Redis dynamically upgrades sorted sets from contiguous listpacks to dual-indexed dict + zskiplist structures for O(1) point and O(log N) range queries.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-lfu-lru-cache",
              "title": "Build Lab: O(1) LRU and Frequency-Bucketed LFU Cache Engine",
              "kind": "build",
              "archive": {
                "slug": "build-lfu-lru-cache",
                "file": "build-lfu-lru-cache.md",
                "title": "Build Lab: O(1) LRU and Frequency-Bucketed LFU Cache Engine",
                "displayTitle": "Build Lab: O(1) LRU and Frequency-Bucketed LFU Cache Engine",
                "type": "build",
                "tags": [
                  "build-lab",
                  "lru",
                  "lfu"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Build zero-dependency O(1) LRU and Shah-Mitra-Matani O(1) frequency-bucketed LFU caches with TTL and eviction telemetry.",
                "mermaidCount": 1
              }
            }
          ]
        }
      ]
    },
    {
      "id": "track-2",
      "number": 2,
      "title": "Hashing, Sorting & Divide-and-Conquer",
      "summary": "Universal hashing, Robin Hood/SwissTable probing, probabilistic sketches, hybrid sorting engines, order statistics, parametric search, and FFT.",
      "hours": 32,
      "modules": [
        {
          "id": "m04",
          "number": "2.1",
          "legacyNumber": "04",
          "title": "Hash Tables, Modern Probing & Probabilistic Sketches",
          "summary": "Universal hash families, Robin Hood & Cuckoo probing, SipHash HashDoS defense, consistent hashing, Bloom/Cuckoo/Xor filters, CMS, and HyperLogLog.",
          "units": [
            {
              "slug": "universal-k-independent-hashing",
              "title": "Hash Functions: Division, Multiplicative, Universal & k-Independent Families",
              "kind": "lesson",
              "archive": {
                "slug": "universal-k-independent-hashing",
                "file": "universal-k-independent-hashing.md",
                "title": "Hash Functions: Division, Multiplicative, Universal & k-Independent Families",
                "displayTitle": "Hash Functions: Division, Multiplicative, Universal & k-Independent Families",
                "type": "lesson",
                "tags": [
                  "hashing",
                  "universal-hashing",
                  "fibonacci-hashing"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Carter-Wegman universal hash families, Knuth multiplicative Fibonacci hashing, and why pairwise independence bounds expected collisions to 1 + α.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "separate-chaining-vs-open-addressing",
              "title": "Collision Resolution: Separate Chaining vs Linear/Quadratic/Double Probing",
              "kind": "lesson",
              "archive": {
                "slug": "separate-chaining-vs-open-addressing",
                "file": "separate-chaining-vs-open-addressing.md",
                "title": "Collision Resolution: Separate Chaining vs Linear/Quadratic/Double Probing",
                "displayTitle": "Collision Resolution: Separate Chaining vs Linear/Quadratic/Double Probing",
                "type": "lesson",
                "tags": [
                  "hash-tables",
                  "open-addressing",
                  "linear-probing"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Primary clustering in linear probing (Knuth's 1/(1-α)^2 bound) vs cache-line locality that outperforms pointer-chased separate chaining.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "robin-hood-cuckoo-hashing",
              "title": "Variance Reduction: Robin Hood Hashing (PSL) & Cuckoo Hashing",
              "kind": "lesson",
              "archive": {
                "slug": "robin-hood-cuckoo-hashing",
                "file": "robin-hood-cuckoo-hashing.md",
                "title": "Variance Reduction: Robin Hood Hashing (PSL) & Cuckoo Hashing",
                "displayTitle": "Variance Reduction: Robin Hood Hashing (PSL) & Cuckoo Hashing",
                "type": "lesson",
                "tags": [
                  "robin-hood-hashing",
                  "cuckoo-hashing",
                  "probing"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Equalizing Probe Sequence Lengths (PSL) with Robin Hood swaps, backward-shift deletion without tombstones, and O(1) worst-case lookup in Cuckoo Hashing.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "hashdos-siphash-random-seeds",
              "title": "Algorithmic Complexity Attacks (HashDoS) & SipHash Defense",
              "kind": "lesson",
              "archive": {
                "slug": "hashdos-siphash-random-seeds",
                "file": "hashdos-siphash-random-seeds.md",
                "title": "Algorithmic Complexity Attacks (HashDoS) & SipHash Defense",
                "displayTitle": "Algorithmic Complexity Attacks (HashDoS) & SipHash Defense",
                "type": "lesson",
                "tags": [
                  "hashdos",
                  "siphash",
                  "security"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "How attackers craft colliding payloads to degrade O(1) hash maps into O(N^2) CPU denial-of-service, and how keyed PRFs (SipHash) prevent it.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "consistent-hashing-rendezvous",
              "title": "Consistent Hashing with Bounded Loads & Rendezvous (HRW) Hashing",
              "kind": "lesson",
              "archive": {
                "slug": "consistent-hashing-rendezvous",
                "file": "consistent-hashing-rendezvous.md",
                "title": "Consistent Hashing with Bounded Loads & Rendezvous (HRW) Hashing",
                "displayTitle": "Consistent Hashing with Bounded Loads & Rendezvous (HRW) Hashing",
                "type": "lesson",
                "tags": [
                  "consistent-hashing",
                  "rendezvous-hashing",
                  "partitioning"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Karger's virtual-node ring vs Highest Random Weight (HRW) hashing and Mirrokni's (1+ε) bounded-load capacity guarantees.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "bloom-filters-counting-xor",
              "title": "Bloom Filters, Counting Bloom Filters, Cuckoo Filters & Xor Filters",
              "kind": "lesson",
              "archive": {
                "slug": "bloom-filters-counting-xor",
                "file": "bloom-filters-counting-xor.md",
                "title": "Bloom Filters, Counting Bloom Filters, Cuckoo Filters & Xor Filters",
                "displayTitle": "Bloom Filters, Counting Bloom Filters, Cuckoo Filters & Xor Filters",
                "type": "lesson",
                "tags": [
                  "bloom-filter",
                  "cuckoo-filter",
                  "xor-filter"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Deriving optimal k = (m/n) ln 2 bits per element, Kirsch-Mitzenmacher double hashing, deletion in Cuckoo filters, and static 1.23n-bit Xor filters.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "count-min-sketch-heavy-hitters",
              "title": "Count-Min Sketch & Streaming Frequency Estimation Error Bounds",
              "kind": "lesson",
              "archive": {
                "slug": "count-min-sketch-heavy-hitters",
                "file": "count-min-sketch-heavy-hitters.md",
                "title": "Count-Min Sketch & Streaming Frequency Estimation Error Bounds",
                "displayTitle": "Count-Min Sketch & Streaming Frequency Estimation Error Bounds",
                "type": "lesson",
                "tags": [
                  "count-min-sketch",
                  "streaming",
                  "probabilistic"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Sublinear frequency tables with (ε, δ) Markov inequality guarantees, conservative updates, and heavy-hitter min-heap tracking.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "hyperloglog-cardinality",
              "title": "HyperLogLog: Harmonic Mean & Stochastic Averaging in 1.5 KB",
              "kind": "lesson",
              "archive": {
                "slug": "hyperloglog-cardinality",
                "file": "hyperloglog-cardinality.md",
                "title": "HyperLogLog: Harmonic Mean & Stochastic Averaging in 1.5 KB",
                "displayTitle": "HyperLogLog: Harmonic Mean & Stochastic Averaging in 1.5 KB",
                "type": "lesson",
                "tags": [
                  "hyperloglog",
                  "cardinality",
                  "streaming"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Counting 10^9 distinct elements with <1% error in 1,6384 6-bit registers using leading-zero bit patterns and harmonic mean bias correction.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-rust-hashbrown-swisstable",
              "title": "Production Case Study: Google Abseil SwissTable & Rust hashbrown SIMD Probing",
              "kind": "case",
              "archive": {
                "slug": "case-rust-hashbrown-swisstable",
                "file": "case-rust-hashbrown-swisstable.md",
                "title": "Production Case Study: Google Abseil SwissTable & Rust hashbrown SIMD Probing",
                "displayTitle": "Production Case Study: Google Abseil SwissTable & Rust hashbrown SIMD Probing",
                "type": "case",
                "tags": [
                  "swisstable",
                  "hashbrown",
                  "simd"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "How 1-byte h2 metadata control bytes and 16-way SSE2/NEON bitmask instructions eliminate cache misses in modern C++ and Rust hash maps.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-robin-hood-hash-map",
              "title": "Build Lab: Open-Addressed Robin Hood Hash Table with Tombstone-Free Backward Shift Deletion",
              "kind": "build",
              "archive": {
                "slug": "build-robin-hood-hash-map",
                "file": "build-robin-hood-hash-map.md",
                "title": "Build Lab: Open-Addressed Robin Hood Hash Table with Tombstone-Free Backward Shift Deletion",
                "displayTitle": "Build Lab: Open-Addressed Robin Hood Hash Table with Tombstone-Free Backward Shift Deletion",
                "type": "build",
                "tags": [
                  "build-lab",
                  "robin-hood",
                  "hash-map"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Implement a high-performance open-addressed hash table tracking Probe Sequence Length (PSL), Robin Hood displacement, and backward-shift deletion.",
                "mermaidCount": 1
              }
            }
          ]
        },
        {
          "id": "m05",
          "number": "2.2",
          "legacyNumber": "05",
          "title": "Sorting Mechanics, Hybrid Sorts & Linear-Time Order Statistics",
          "summary": "Inversions, top-down/bottom-up MergeSort, 3-way QuickSort, Ω(N log N) lower bound, RadixSort, Quickselect/BFPRT, external sorting, and TimSort/pdqsort.",
          "units": [
            {
              "slug": "quadratic-sorts-inversions",
              "title": "Insertion, Selection & Shellsort: Inversions & Diminishing Increments",
              "kind": "lesson",
              "archive": {
                "slug": "quadratic-sorts-inversions",
                "file": "quadratic-sorts-inversions.md",
                "title": "Insertion, Selection & Shellsort: Inversions & Diminishing Increments",
                "displayTitle": "Insertion, Selection & Shellsort: Inversions & Diminishing Increments",
                "type": "lesson",
                "tags": [
                  "sorting",
                  "insertion-sort",
                  "shellsort"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why adjacent swaps remove at most 1 inversion (Ω(N^2)), why Insertion Sort dominates for N ≤ 24, and Sedgewick's Shellsort gap sequences.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "mergesort-bottom-up-inversions",
              "title": "Top-Down vs Bottom-Up Merge Sort & Counting Inversions in O(N log N)",
              "kind": "lesson",
              "archive": {
                "slug": "mergesort-bottom-up-inversions",
                "file": "mergesort-bottom-up-inversions.md",
                "title": "Top-Down vs Bottom-Up Merge Sort & Counting Inversions in O(N log N)",
                "displayTitle": "Top-Down vs Bottom-Up Merge Sort & Counting Inversions in O(N log N)",
                "type": "lesson",
                "tags": [
                  "mergesort",
                  "inversions",
                  "stability"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Stable merging invariants, ping-pong auxiliary buffer optimization, bottom-up iterative passes, and inversion counting.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "quicksort-partition-schemes",
              "title": "Quicksort: Lomuto vs Hoare vs Bentley-McIlroy 3-Way Partitioning",
              "kind": "lesson",
              "archive": {
                "slug": "quicksort-partition-schemes",
                "file": "quicksort-partition-schemes.md",
                "title": "Quicksort: Lomuto vs Hoare vs Bentley-McIlroy 3-Way Partitioning",
                "displayTitle": "Quicksort: Lomuto vs Hoare vs Bentley-McIlroy 3-Way Partitioning",
                "type": "lesson",
                "tags": [
                  "quicksort",
                  "partitioning",
                  "hoare"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why Hoare partitioning performs 3× fewer swaps than Lomuto, and how 3-way Dutch National Flag partitioning defeats duplicate-key O(N^2) traps.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "randomized-quicksort-expectation",
              "title": "Randomized Quicksort: Indicator Random Variables & 1.386 N ln N Proof",
              "kind": "lesson",
              "archive": {
                "slug": "randomized-quicksort-expectation",
                "file": "randomized-quicksort-expectation.md",
                "title": "Randomized Quicksort: Indicator Random Variables & 1.386 N ln N Proof",
                "displayTitle": "Randomized Quicksort: Indicator Random Variables & 1.386 N ln N Proof",
                "type": "lesson",
                "tags": [
                  "quicksort",
                  "randomized-algorithms",
                  "probability"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Using linearity of expectation over indicator variables X_ij to prove 2N ln N expected comparisons regardless of input distribution.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "decision-tree-lower-bound",
              "title": "The Ω(N log N) Comparison Lower Bound via Stirling's Approximation",
              "kind": "lesson",
              "archive": {
                "slug": "decision-tree-lower-bound",
                "file": "decision-tree-lower-bound.md",
                "title": "The Ω(N log N) Comparison Lower Bound via Stirling's Approximation",
                "displayTitle": "The Ω(N log N) Comparison Lower Bound via Stirling's Approximation",
                "type": "lesson",
                "tags": [
                  "lower-bounds",
                  "decision-tree",
                  "information-theory"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Information-theoretic proof that any comparison sort requires at least ⌈log2(N!)⌉ = N log2 N - 1.44N comparisons in the worst case.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "counting-radix-bucket-sorts",
              "title": "Non-Comparison Sorts: Counting Sort, LSD/MSD Radix Sort & Bucket Sort",
              "kind": "lesson",
              "archive": {
                "slug": "counting-radix-bucket-sorts",
                "file": "counting-radix-bucket-sorts.md",
                "title": "Non-Comparison Sorts: Counting Sort, LSD/MSD Radix Sort & Bucket Sort",
                "displayTitle": "Non-Comparison Sorts: Counting Sort, LSD/MSD Radix Sort & Bucket Sort",
                "type": "lesson",
                "tags": [
                  "radix-sort",
                  "counting-sort",
                  "non-comparison"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Bypassing the comparison lower bound via prefix-sum stable bucket offsets, base-256 byte passes, and IEEE-754 float sign-bit flipping.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "quickselect-bfprt-median",
              "title": "Order Statistics: Randomized Quickselect vs Deterministic BFPRT Median-of-Medians",
              "kind": "lesson",
              "archive": {
                "slug": "quickselect-bfprt-median",
                "file": "quickselect-bfprt-median.md",
                "title": "Order Statistics: Randomized Quickselect vs Deterministic BFPRT Median-of-Medians",
                "displayTitle": "Order Statistics: Randomized Quickselect vs Deterministic BFPRT Median-of-Medians",
                "type": "lesson",
                "tags": [
                  "quickselect",
                  "bfprt",
                  "order-statistics"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Finding the k-th smallest element in expected O(N) via Hoare's Quickselect and guaranteed worst-case O(N) via 5-element group medians (T(n) ≤ T(n/5) + T(7n/10) + O(n)).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "external-merge-sort-replacement",
              "title": "External Memory Sorting: K-Way Merge & Replacement Selection",
              "kind": "lesson",
              "archive": {
                "slug": "external-merge-sort-replacement",
                "file": "external-merge-sort-replacement.md",
                "title": "External Memory Sorting: K-Way Merge & Replacement Selection",
                "displayTitle": "External Memory Sorting: K-Way Merge & Replacement Selection",
                "type": "lesson",
                "tags": [
                  "external-sorting",
                  "k-way-merge",
                  "io-complexity"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Sorting 100 TB datasets with 4 GB RAM: tournament loser trees, replacement selection (2M average run length), and multi-pass disk I/O minimization.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-timsort-pdqsort",
              "title": "Production Case Study: Python/V8 TimSort (Galloping & Run Invariants) vs Rust pdqsort",
              "kind": "case",
              "archive": {
                "slug": "case-timsort-pdqsort",
                "file": "case-timsort-pdqsort.md",
                "title": "Production Case Study: Python/V8 TimSort (Galloping & Run Invariants) vs Rust pdqsort",
                "displayTitle": "Production Case Study: Python/V8 TimSort (Galloping & Run Invariants) vs Rust pdqsort",
                "type": "case",
                "tags": [
                  "timsort",
                  "pdqsort",
                  "production-internals"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "How TimSort exploits natural runs and galloping mode for stable sorts while Orson Peters' Pattern-Defeating Quicksort (pdqsort) achieves branchless speed.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-hybrid-introsort-timsort",
              "title": "Build Lab: Hybrid Adaptive Sort (Run Detection + Insertion + Galloping Merge)",
              "kind": "build",
              "archive": {
                "slug": "build-hybrid-introsort-timsort",
                "file": "build-hybrid-introsort-timsort.md",
                "title": "Build Lab: Hybrid Adaptive Sort (Run Detection + Insertion + Galloping Merge)",
                "displayTitle": "Build Lab: Hybrid Adaptive Sort (Run Detection + Insertion + Galloping Merge)",
                "type": "build",
                "tags": [
                  "build-lab",
                  "timsort",
                  "sorting"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Implement an adaptive sorting engine with monotonic run discovery, binary insertion sort for short runs, stack balance invariants, and galloping merge.",
                "mermaidCount": 1
              }
            }
          ]
        },
        {
          "id": "m06",
          "number": "2.3",
          "legacyNumber": "06",
          "title": "Binary Search on Monotonic Spaces & Divide-and-Conquer",
          "summary": "Half-open binary search invariants, Megiddo parametric search, galloping/ternary search, fractional cascading, closest pair, Karatsuba/Strassen, FFT, and CDQ.",
          "units": [
            {
              "slug": "binary-search-boundary-invariants",
              "title": "Closed vs Half-Open Binary Search: Eliminating Off-by-One Infinite Loops",
              "kind": "lesson",
              "archive": {
                "slug": "binary-search-boundary-invariants",
                "file": "binary-search-boundary-invariants.md",
                "title": "Closed vs Half-Open Binary Search: Eliminating Off-by-One Infinite Loops",
                "displayTitle": "Closed vs Half-Open Binary Search: Eliminating Off-by-One Infinite Loops",
                "type": "lesson",
                "tags": [
                  "binary-search",
                  "invariants",
                  "boundary"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Viewing binary search as finding the partition point of a monotonic boolean predicate [F, F, ..., T, T] on a half-open interval [lo, hi).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "parametric-search-answer-space",
              "title": "Parametric Search: Binary Searching the Answer Space & Feasibility Predicates",
              "kind": "design",
              "archive": {
                "slug": "parametric-search-answer-space",
                "file": "parametric-search-answer-space.md",
                "title": "Parametric Search: Binary Searching the Answer Space & Feasibility Predicates",
                "displayTitle": "Parametric Search: Binary Searching the Answer Space & Feasibility Predicates",
                "type": "design",
                "tags": [
                  "parametric-search",
                  "binary-search",
                  "optimization"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Transforming min-max and max-min optimization problems into O(log(Range) · T_check) decision predicates.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "rotated-bitonic-unbounded-search",
              "title": "Exponential (Galloping) Search, Rotated Arrays & Ternary Search on Unimodal Functions",
              "kind": "lesson",
              "archive": {
                "slug": "rotated-bitonic-unbounded-search",
                "file": "rotated-bitonic-unbounded-search.md",
                "title": "Exponential (Galloping) Search, Rotated Arrays & Ternary Search on Unimodal Functions",
                "displayTitle": "Exponential (Galloping) Search, Rotated Arrays & Ternary Search on Unimodal Functions",
                "type": "lesson",
                "tags": [
                  "exponential-search",
                  "ternary-search",
                  "unimodal"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Bentley-Yao O(log i) unbounded search, invariant restoration in cyclically shifted arrays, and continuous/discrete ternary search.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "fractional-cascading",
              "title": "Fractional Cascading: Searching K Sorted Lists in O(log N + K)",
              "kind": "lesson",
              "archive": {
                "slug": "fractional-cascading",
                "file": "fractional-cascading.md",
                "title": "Fractional Cascading: Searching K Sorted Lists in O(log N + K)",
                "displayTitle": "Fractional Cascading: Searching K Sorted Lists in O(log N + K)",
                "type": "lesson",
                "tags": [
                  "fractional-cascading",
                  "search",
                  "data-structures"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Chazelle-Guibas pointer promotion: propagating every second element upward with bridge pointers to eliminate K-1 binary searches.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "divide-and-conquer-closest-pair",
              "title": "Geometric Divide-and-Conquer: Planar Closest Pair of Points in O(N log N)",
              "kind": "lesson",
              "archive": {
                "slug": "divide-and-conquer-closest-pair",
                "file": "divide-and-conquer-closest-pair.md",
                "title": "Geometric Divide-and-Conquer: Planar Closest Pair of Points in O(N log N)",
                "displayTitle": "Geometric Divide-and-Conquer: Planar Closest Pair of Points in O(N log N)",
                "type": "lesson",
                "tags": [
                  "divide-and-conquer",
                  "computational-geometry",
                  "closest-pair"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Shamos-Hoey strip argument: why the 2δ × δ bounding box packing invariant limits inner-loop distance checks to at most 7 neighbors.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "karatsuba-strassen-algebraic-dc",
              "title": "Algebraic Divide-and-Conquer: Karatsuba Multiplication & Strassen's Matrix Product",
              "kind": "lesson",
              "archive": {
                "slug": "karatsuba-strassen-algebraic-dc",
                "file": "karatsuba-strassen-algebraic-dc.md",
                "title": "Algebraic Divide-and-Conquer: Karatsuba Multiplication & Strassen's Matrix Product",
                "displayTitle": "Algebraic Divide-and-Conquer: Karatsuba Multiplication & Strassen's Matrix Product",
                "type": "lesson",
                "tags": [
                  "karatsuba",
                  "strassen",
                  "divide-and-conquer"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Trading expensive multiplications for additions to reduce big-integer multiplication to O(N^1.585) and matrix multiplication to O(N^2.807).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "fast-fourier-transform-polynomials",
              "title": "Fast Fourier Transform (Cooley-Tukey FFT) & O(N log N) Polynomial Convolution",
              "kind": "lesson",
              "archive": {
                "slug": "fast-fourier-transform-polynomials",
                "file": "fast-fourier-transform-polynomials.md",
                "title": "Fast Fourier Transform (Cooley-Tukey FFT) & O(N log N) Polynomial Convolution",
                "displayTitle": "Fast Fourier Transform (Cooley-Tukey FFT) & O(N log N) Polynomial Convolution",
                "type": "lesson",
                "tags": [
                  "fft",
                  "ntt",
                  "convolution"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Evaluating and interpolating polynomials at complex N-th roots of unity via even-odd butterfly symmetries and Number Theoretic Transform (NTT).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "meet-in-the-middle-search",
              "title": "Meet-in-the-Middle: Halving the Exponent from O(2^N) to O(2^(N/2) log(2^(N/2)))",
              "kind": "design",
              "archive": {
                "slug": "meet-in-the-middle-search",
                "file": "meet-in-the-middle-search.md",
                "title": "Meet-in-the-Middle: Halving the Exponent from O(2^N) to O(2^(N/2) log(2^(N/2)))",
                "displayTitle": "Meet-in-the-Middle: Halving the Exponent from O(2^N) to O(2^(N/2) log(2^(N/2)))",
                "type": "design",
                "tags": [
                  "meet-in-the-middle",
                  "subset-sum",
                  "search"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Horowitz-Sahni bidirectional state space decomposition for N ≤ 40 knapsack, 4-SUM, and shortest unweighted bidirectional search.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "cdq-divide-and-conquer",
              "title": "Offline Divide-and-Conquer over Time (CDQ Divide-and-Conquer for 3D Partial Orders)",
              "kind": "design",
              "archive": {
                "slug": "cdq-divide-and-conquer",
                "file": "cdq-divide-and-conquer.md",
                "title": "Offline Divide-and-Conquer over Time (CDQ Divide-and-Conquer for 3D Partial Orders)",
                "displayTitle": "Offline Divide-and-Conquer over Time (CDQ Divide-and-Conquer for 3D Partial Orders)",
                "type": "design",
                "tags": [
                  "cdq",
                  "divide-and-conquer",
                  "offline-queries"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Decoupling dynamic updates from queries by recursively computing how left-half modifications contribute to right-half queries.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-git-bisect-eytzinger",
              "title": "Production Case Study: Cache-Friendly Eytzinger Binary Search Layout vs Standard Binary Search",
              "kind": "case",
              "archive": {
                "slug": "case-git-bisect-eytzinger",
                "file": "case-git-bisect-eytzinger.md",
                "title": "Production Case Study: Cache-Friendly Eytzinger Binary Search Layout vs Standard Binary Search",
                "displayTitle": "Production Case Study: Cache-Friendly Eytzinger Binary Search Layout vs Standard Binary Search",
                "type": "case",
                "tags": [
                  "eytzinger",
                  "cache-locality",
                  "binary-search"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why standard binary search thrashes TLB and L1 caches on large arrays, and how breadth-first Eytzinger (1-indexed heap) layout + prefetching achieves 3× speedups.",
                "mermaidCount": 1
              }
            }
          ]
        }
      ]
    },
    {
      "id": "track-3",
      "number": 3,
      "title": "Trees, Balanced Hierarchies & Range Queries",
      "summary": "Binary trees, Morris threading, priority heaps, AVL/LLRB/Treap/Splay/B+ trees, persistent structures, Fenwick trees, Lazy Segment Trees, LCA, and HLD.",
      "hours": 34,
      "modules": [
        {
          "id": "m07",
          "number": "3.1",
          "legacyNumber": "07",
          "title": "Binary Trees, Traversals, BSTs & Priority Heaps",
          "summary": "Tree representations, Morris O(1)-space threading, succinct serialization, Hibbard BST deletion, d-ary/Fibonacci heaps, and timer wheels.",
          "units": [
            {
              "slug": "tree-representations-traversals",
              "title": "Tree Representations & Recursive vs Iterative Pre/In/Post/Level-Order Traversals",
              "kind": "lesson",
              "archive": {
                "slug": "tree-representations-traversals",
                "file": "tree-representations-traversals.md",
                "title": "Tree Representations & Recursive vs Iterative Pre/In/Post/Level-Order Traversals",
                "displayTitle": "Tree Representations & Recursive vs Iterative Pre/In/Post/Level-Order Traversals",
                "type": "lesson",
                "tags": [
                  "binary-trees",
                  "traversals",
                  "dfs-bfs"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Pointer nodes vs flat arena arrays, explicit stack state machines for single-pass post-order, and Euler tour flattenings.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "morris-threaded-traversal",
              "title": "Morris In-Order Traversal: O(1) Auxiliary Space via Temporary Threading",
              "kind": "lesson",
              "archive": {
                "slug": "morris-threaded-traversal",
                "file": "morris-threaded-traversal.md",
                "title": "Morris In-Order Traversal: O(1) Auxiliary Space via Temporary Threading",
                "displayTitle": "Morris In-Order Traversal: O(1) Auxiliary Space via Temporary Threading",
                "type": "lesson",
                "tags": [
                  "morris-traversal",
                  "threaded-trees",
                  "in-place"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Rewiring inorder predecessor null right pointers as temporary return threads to traverse trees in O(N) time and O(1) extra memory.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "tree-serialization-reconstruction",
              "title": "Unique Tree Reconstruction (Preorder + Inorder) & Succinct Bit-String Serialization",
              "kind": "lesson",
              "archive": {
                "slug": "tree-serialization-reconstruction",
                "file": "tree-serialization-reconstruction.md",
                "title": "Unique Tree Reconstruction (Preorder + Inorder) & Succinct Bit-String Serialization",
                "displayTitle": "Unique Tree Reconstruction (Preorder + Inorder) & Succinct Bit-String Serialization",
                "type": "lesson",
                "tags": [
                  "tree-serialization",
                  "succinct-trees",
                  "reconstruction"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why Preorder+Postorder fails on unary nodes, O(N) hash-indexed Preorder+Inorder reconstruction, and 2N-bit Jacobson LOUDS encoding.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "bst-operations-hibbard-deletion",
              "title": "Binary Search Trees: Search, Insertion, Successor & Hibbard Deletion Asymmetry",
              "kind": "lesson",
              "archive": {
                "slug": "bst-operations-hibbard-deletion",
                "file": "bst-operations-hibbard-deletion.md",
                "title": "Binary Search Trees: Search, Insertion, Successor & Hibbard Deletion Asymmetry",
                "displayTitle": "Binary Search Trees: Search, Insertion, Successor & Hibbard Deletion Asymmetry",
                "type": "lesson",
                "tags": [
                  "bst",
                  "hibbard-deletion",
                  "trees"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Inorder successor replacement mechanics and Eppinger's theorem: why alternating insertions and asymmetric Hibbard deletions degrade BST height to Θ(√N).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "randomly-built-bst-height",
              "title": "Randomly Built BSTs: Expected Height O(log N) via Quicksort Dual Proof",
              "kind": "lesson",
              "archive": {
                "slug": "randomly-built-bst-height",
                "file": "randomly-built-bst-height.md",
                "title": "Randomly Built BSTs: Expected Height O(log N) via Quicksort Dual Proof",
                "displayTitle": "Randomly Built BSTs: Expected Height O(log N) via Quicksort Dual Proof",
                "type": "lesson",
                "tags": [
                  "bst",
                  "randomized-algorithms",
                  "tree-height"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Isomorphism between random BST node depths and Quicksort pivot comparisons, proving expected depth 2 ln N.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "binary-d-ary-heaps",
              "title": "Binary & d-ary Heaps: Floyd's O(N) Bottom-Up Build-Heap Proof",
              "kind": "lesson",
              "archive": {
                "slug": "binary-d-ary-heaps",
                "file": "binary-d-ary-heaps.md",
                "title": "Binary & d-ary Heaps: Floyd's O(N) Bottom-Up Build-Heap Proof",
                "displayTitle": "Binary & d-ary Heaps: Floyd's O(N) Bottom-Up Build-Heap Proof",
                "type": "lesson",
                "tags": [
                  "heaps",
                  "d-ary-heap",
                  "floyd-heapify"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why bottom-up siftDown converges to Σ (h / 2^h) = O(N) work, and why 4-ary heaps outperform binary heaps in cache-bound Dijkstra workloads.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "mergeable-heaps-binomial-fibonacci",
              "title": "Mergeable Priority Queues: Leftist, Skew, Binomial & Fibonacci Heaps (O(1) Decrease-Key)",
              "kind": "lesson",
              "archive": {
                "slug": "mergeable-heaps-binomial-fibonacci",
                "file": "mergeable-heaps-binomial-fibonacci.md",
                "title": "Mergeable Priority Queues: Leftist, Skew, Binomial & Fibonacci Heaps (O(1) Decrease-Key)",
                "displayTitle": "Mergeable Priority Queues: Leftist, Skew, Binomial & Fibonacci Heaps (O(1) Decrease-Key)",
                "type": "lesson",
                "tags": [
                  "fibonacci-heap",
                  "binomial-heap",
                  "leftist-heap"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Lazy consolidation, cascading cuts, and potential function Φ(H) = t(H) + 2m(H) achieving O(1) amortized insert, merge, and decreaseKey.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "two-heaps-k-way-merge-patterns",
              "title": "Priority Queue Patterns: Running Median (Two Heaps), K-Way Merge & Top-K",
              "kind": "design",
              "archive": {
                "slug": "two-heaps-k-way-merge-patterns",
                "file": "two-heaps-k-way-merge-patterns.md",
                "title": "Priority Queue Patterns: Running Median (Two Heaps), K-Way Merge & Top-K",
                "displayTitle": "Priority Queue Patterns: Running Median (Two Heaps), K-Way Merge & Top-K",
                "type": "design",
                "tags": [
                  "heaps",
                  "running-median",
                  "top-k"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Balancing a Max-Heap lower half and Min-Heap upper half for streaming quantiles, lazy deletion tombstones, and O(N log K) selection.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-timer-wheels-vs-heaps",
              "title": "Production Case Study: Hierarchical Hashed Timer Wheels vs Four-Heap Timers (Go runtime, Kafka, Linux)",
              "kind": "case",
              "archive": {
                "slug": "case-timer-wheels-vs-heaps",
                "file": "case-timer-wheels-vs-heaps.md",
                "title": "Production Case Study: Hierarchical Hashed Timer Wheels vs Four-Heap Timers (Go runtime, Kafka, Linux)",
                "displayTitle": "Production Case Study: Hierarchical Hashed Timer Wheels vs Four-Heap Timers (Go runtime, Kafka, Linux)",
                "type": "case",
                "tags": [
                  "timer-wheels",
                  "heaps",
                  "systems-internals"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why Linux, Netty, and Kafka replace O(log N) heap timers with Varghese-Lauck O(1) hierarchical timing wheels for millions of connection timeouts.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-indexed-d-ary-priority-queue",
              "title": "Build Lab: Indexed 4-Ary Min/Max Priority Queue with O(log_d N) decreaseKey",
              "kind": "build",
              "archive": {
                "slug": "build-indexed-d-ary-priority-queue",
                "file": "build-indexed-d-ary-priority-queue.md",
                "title": "Build Lab: Indexed 4-Ary Min/Max Priority Queue with O(log_d N) decreaseKey",
                "displayTitle": "Build Lab: Indexed 4-Ary Min/Max Priority Queue with O(log_d N) decreaseKey",
                "type": "build",
                "tags": [
                  "build-lab",
                  "indexed-heap",
                  "priority-queue"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Implement Sedgewick's IndexMinPQ over a cache-aligned 4-ary heap supporting O(1) key containment checks and O(log_4 N) priority updates.",
                "mermaidCount": 1
              }
            }
          ]
        },
        {
          "id": "m08",
          "number": "3.2",
          "legacyNumber": "08",
          "title": "Self-Balancing, Augmented, Disk-Backed & Persistent Trees",
          "summary": "AVL trees, Red-Black & Sedgewick LLRB trees, randomized Treaps, Splay trees, Order-Statistic/Interval trees, B+ vs LSM trees, and persistence.",
          "units": [
            {
              "slug": "tree-rotations-avl-invariants",
              "title": "Tree Rotations & AVL Trees: Balance Factors, LL/RR/LR/RL Rebalancing & Fibonacci Height Bound",
              "kind": "lesson",
              "archive": {
                "slug": "tree-rotations-avl-invariants",
                "file": "tree-rotations-avl-invariants.md",
                "title": "Tree Rotations & AVL Trees: Balance Factors, LL/RR/LR/RL Rebalancing & Fibonacci Height Bound",
                "displayTitle": "Tree Rotations & AVL Trees: Balance Factors, LL/RR/LR/RL Rebalancing & Fibonacci Height Bound",
                "type": "lesson",
                "tags": [
                  "avl-tree",
                  "rotations",
                  "balanced-bst"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Proving minimum node count N(h) = F_{h+2} - 1 yields h < 1.44 log2 N, and restoring height invariants in at most one single or double rotation on insert.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "red-black-llrb-isomorphism",
              "title": "2-3-4 Trees, Red-Black Trees & Sedgewick's Left-Leaning Red-Black (LLRB) Isomorphism",
              "kind": "lesson",
              "archive": {
                "slug": "red-black-llrb-isomorphism",
                "file": "red-black-llrb-isomorphism.md",
                "title": "2-3-4 Trees, Red-Black Trees & Sedgewick's Left-Leaning Red-Black (LLRB) Isomorphism",
                "displayTitle": "2-3-4 Trees, Red-Black Trees & Sedgewick's Left-Leaning Red-Black (LLRB) Isomorphism",
                "type": "lesson",
                "tags": [
                  "red-black-tree",
                  "llrb",
                  "2-3-trees"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Mapping 2-3-4 B-tree nodes to red-black edges, proving height ≤ 2 log2(N+1), and reducing implementation to 3 lines of rotateLeft/rotateRight/flipColors.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "treaps-split-merge-paradigm",
              "title": "Randomized Treaps & Implicit Treaps: Rebalancing Without Rotations via split and merge",
              "kind": "lesson",
              "archive": {
                "slug": "treaps-split-merge-paradigm",
                "file": "treaps-split-merge-paradigm.md",
                "title": "Randomized Treaps & Implicit Treaps: Rebalancing Without Rotations via split and merge",
                "displayTitle": "Randomized Treaps & Implicit Treaps: Rebalancing Without Rotations via split and merge",
                "type": "lesson",
                "tags": [
                  "treap",
                  "implicit-treap",
                  "randomized-bst"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Cartesian product of BST keys and random heap priorities, plus Implicit Treaps as dynamic arrays supporting O(log N) range reversal and cut-paste.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "splay-trees-dynamic-optimality",
              "title": "Splay Trees: Zig-Zig / Zig-Zag Rotations, Amortized O(log N) Potential Proof & Static Optimality",
              "kind": "lesson",
              "archive": {
                "slug": "splay-trees-dynamic-optimality",
                "file": "splay-trees-dynamic-optimality.md",
                "title": "Splay Trees: Zig-Zig / Zig-Zag Rotations, Amortized O(log N) Potential Proof & Static Optimality",
                "displayTitle": "Splay Trees: Zig-Zig / Zig-Zag Rotations, Amortized O(log N) Potential Proof & Static Optimality",
                "type": "lesson",
                "tags": [
                  "splay-tree",
                  "amortized-analysis",
                  "self-adjusting"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why Zig-Zig rotates the grandparent first, Sleator-Tarjan's rank potential Φ = Σ log2(size(x)) telescopic proof, and the Dynamic Optimality Conjecture.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "augmented-trees-order-intervals",
              "title": "Augmenting BSTs: Order-Statistic Trees (select/rank) & Interval Trees",
              "kind": "lesson",
              "archive": {
                "slug": "augmented-trees-order-intervals",
                "file": "augmented-trees-order-intervals.md",
                "title": "Augmenting BSTs: Order-Statistic Trees (select/rank) & Interval Trees",
                "displayTitle": "Augmenting BSTs: Order-Statistic Trees (select/rank) & Interval Trees",
                "type": "lesson",
                "tags": [
                  "augmented-bst",
                  "order-statistics",
                  "interval-tree"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "CLRS Theorem 14.1 for maintaining subtree aggregates during rotations, k-th order statistics, and 1D overlap queries with max-endpoint augmentation.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "b-trees-bplus-trees-disk-pages",
              "title": "B-Trees & B+ Trees: Page Fanout, Proactive Splitting & Leaf Sibling Chains",
              "kind": "lesson",
              "archive": {
                "slug": "b-trees-bplus-trees-disk-pages",
                "file": "b-trees-bplus-trees-disk-pages.md",
                "title": "B-Trees & B+ Trees: Page Fanout, Proactive Splitting & Leaf Sibling Chains",
                "displayTitle": "B-Trees & B+ Trees: Page Fanout, Proactive Splitting & Leaf Sibling Chains",
                "type": "lesson",
                "tags": [
                  "b-tree",
                  "bplus-tree",
                  "storage-engines"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Matching node size to 4KB–16KB NVMe pages (fanout B ≈ 512) to resolve 10^9 keys in 3 disk reads, proactive top-down splitting, and sequential leaf scans.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "lsm-trees-write-amplification",
              "title": "LSM-Trees vs B+ Trees: MemTables, SSTables, Compaction & RUM Conjecture",
              "kind": "lesson",
              "archive": {
                "slug": "lsm-trees-write-amplification",
                "file": "lsm-trees-write-amplification.md",
                "title": "LSM-Trees vs B+ Trees: MemTables, SSTables, Compaction & RUM Conjecture",
                "displayTitle": "LSM-Trees vs B+ Trees: MemTables, SSTables, Compaction & RUM Conjecture",
                "type": "lesson",
                "tags": [
                  "lsm-tree",
                  "compaction",
                  "rum-conjecture"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Trading read amplification for sequential write throughput via SkipList MemTables, immutable SSTables, Bloom filters, and Size-Tiered vs Leveled compaction.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "persistent-trees-path-copying",
              "title": "Persistent Data Structures: Path Copying, Fat Nodes & Fractional Cascading Time Travel",
              "kind": "lesson",
              "archive": {
                "slug": "persistent-trees-path-copying",
                "file": "persistent-trees-path-copying.md",
                "title": "Persistent Data Structures: Path Copying, Fat Nodes & Fractional Cascading Time Travel",
                "displayTitle": "Persistent Data Structures: Path Copying, Fat Nodes & Fractional Cascading Time Travel",
                "type": "lesson",
                "tags": [
                  "persistent-data-structures",
                  "path-copying",
                  "immutability"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Driscoll-Sarnak-Sleator-Tarjan persistence: creating new version roots in O(log N) time and space by sharing unmodified subtrees.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-linux-rbtree-cfs",
              "title": "Production Case Study: Intrusive Augmented Red-Black Trees in the Linux Kernel CFS & VMA Manager",
              "kind": "case",
              "archive": {
                "slug": "case-linux-rbtree-cfs",
                "file": "case-linux-rbtree-cfs.md",
                "title": "Production Case Study: Intrusive Augmented Red-Black Trees in the Linux Kernel CFS & VMA Manager",
                "displayTitle": "Production Case Study: Intrusive Augmented Red-Black Trees in the Linux Kernel CFS & VMA Manager",
                "type": "case",
                "tags": [
                  "linux-kernel",
                  "rbtree",
                  "cfs-scheduler"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "How Linux's Completely Fair Scheduler (CFS) tracks leftmost min-vruntime in O(1) and how Virtual Memory Areas (VMAs) use augmented gap rbtrees.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-llrb-order-statistic-tree",
              "title": "Build Lab: Left-Leaning Red-Black (LLRB) Order-Statistic Tree with rank and select",
              "kind": "build",
              "archive": {
                "slug": "build-llrb-order-statistic-tree",
                "file": "build-llrb-order-statistic-tree.md",
                "title": "Build Lab: Left-Leaning Red-Black (LLRB) Order-Statistic Tree with rank and select",
                "displayTitle": "Build Lab: Left-Leaning Red-Black (LLRB) Order-Statistic Tree with rank and select",
                "type": "build",
                "tags": [
                  "build-lab",
                  "llrb",
                  "order-statistics"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Implement a complete Sedgewick LLRB tree augmented with subtree sizes supporting insert, Hibbard-free delete, rank(key), select(k), and rangeCount(lo, hi).",
                "mermaidCount": 1
              }
            }
          ]
        },
        {
          "id": "m09",
          "number": "3.3",
          "legacyNumber": "09",
          "title": "Range Query & Sublinear Decomposition Structures",
          "summary": "Sparse Tables, Fenwick Trees (BIT), bottom-up/lazy/beats/persistent Segment Trees, Sqrt Decomposition, Mo's Algorithm, LCA, HLD, and Cartesian Trees.",
          "units": [
            {
              "slug": "static-range-queries-sparse-table",
              "title": "Disjoint & Standard Sparse Tables: O(1) Idempotent Range Minimum Query (RMQ)",
              "kind": "lesson",
              "archive": {
                "slug": "static-range-queries-sparse-table",
                "file": "static-range-queries-sparse-table.md",
                "title": "Disjoint & Standard Sparse Tables: O(1) Idempotent Range Minimum Query (RMQ)",
                "displayTitle": "Disjoint & Standard Sparse Tables: O(1) Idempotent Range Minimum Query (RMQ)",
                "type": "lesson",
                "tags": [
                  "sparse-table",
                  "rmq",
                  "range-queries"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Precomputing power-of-2 intervals in O(N log N) for O(1) overlapping idempotent queries (min/max/gcd) and Disjoint Sparse Tables for non-idempotent monoids.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "fenwick-tree-binary-indexed",
              "title": "Fenwick Trees (Binary Indexed Trees): lowbit Geometry, Point Updates & Range Updates",
              "kind": "lesson",
              "archive": {
                "slug": "fenwick-tree-binary-indexed",
                "file": "fenwick-tree-binary-indexed.md",
                "title": "Fenwick Trees (Binary Indexed Trees): lowbit Geometry, Point Updates & Range Updates",
                "displayTitle": "Fenwick Trees (Binary Indexed Trees): lowbit Geometry, Point Updates & Range Updates",
                "type": "lesson",
                "tags": [
                  "fenwick-tree",
                  "binary-indexed-tree",
                  "range-queries"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "How index bit manipulation (i & -i) encodes a prefix responsibility tree in a flat N-element array, plus dual BITs for range-add / range-sum.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "segment-trees-bottom-up-monoids",
              "title": "Segment Trees over Monoids: Recursive vs Iterative (ZKW) Bottom-Up Implementation",
              "kind": "lesson",
              "archive": {
                "slug": "segment-trees-bottom-up-monoids",
                "file": "segment-trees-bottom-up-monoids.md",
                "title": "Segment Trees over Monoids: Recursive vs Iterative (ZKW) Bottom-Up Implementation",
                "displayTitle": "Segment Trees over Monoids: Recursive vs Iterative (ZKW) Bottom-Up Implementation",
                "type": "lesson",
                "tags": [
                  "segment-tree",
                  "monoid",
                  "zkw-tree"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Decomposing any interval [L, R] into at most 2⌈log2 N⌉ canonical tree nodes, non-commutative monoid merging (max subarray sum), and 2N iterative ZKW layouts.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "lazy-propagation-segment-tree-beats",
              "title": "Lazy Propagation & Segment Tree Beats (Ji Driver Segment Tree for Range Chmin/Chmax)",
              "kind": "lesson",
              "archive": {
                "slug": "lazy-propagation-segment-tree-beats",
                "file": "lazy-propagation-segment-tree-beats.md",
                "title": "Lazy Propagation & Segment Tree Beats (Ji Driver Segment Tree for Range Chmin/Chmax)",
                "displayTitle": "Lazy Propagation & Segment Tree Beats (Ji Driver Segment Tree for Range Chmin/Chmax)",
                "type": "lesson",
                "tags": [
                  "lazy-propagation",
                  "segment-tree-beats",
                  "range-updates"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Composing deferred endomorphism tags in O(log N) and Ji Ruyi's potential-amortized break/tag conditions for range a[i] = min(a[i], x) updates.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "dynamic-persistent-segment-trees",
              "title": "Dynamic (Sparse) & Persistent Segment Trees: K-th Smallest in Subarray in O(log N)",
              "kind": "lesson",
              "archive": {
                "slug": "dynamic-persistent-segment-trees",
                "file": "dynamic-persistent-segment-trees.md",
                "title": "Dynamic (Sparse) & Persistent Segment Trees: K-th Smallest in Subarray in O(log N)",
                "displayTitle": "Dynamic (Sparse) & Persistent Segment Trees: K-th Smallest in Subarray in O(log N)",
                "type": "lesson",
                "tags": [
                  "persistent-segment-tree",
                  "wavelet-tree",
                  "kth-order"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Allocating child pointers lazily over [0, 10^9] and subtracting prefix version trees (root[R] - root[L-1]) to binary search subarray order statistics.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "sqrt-decomposition-mos-algorithm",
              "title": "√N Block Decomposition & Mo's Offline Query Ordering (O((N+Q)√N))",
              "kind": "design",
              "archive": {
                "slug": "sqrt-decomposition-mos-algorithm",
                "file": "sqrt-decomposition-mos-algorithm.md",
                "title": "√N Block Decomposition & Mo's Offline Query Ordering (O((N+Q)√N))",
                "displayTitle": "√N Block Decomposition & Mo's Offline Query Ordering (O((N+Q)√N))",
                "type": "design",
                "tags": [
                  "sqrt-decomposition",
                  "mos-algorithm",
                  "offline-queries"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Balancing block size B = √N for non-associative updates, and Mo's Hilbert/snake block sorting to bound pointer movements across Q range queries.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "lowest-common-ancestor-rmq",
              "title": "Lowest Common Ancestor (LCA): Binary Lifting vs Euler Tour + ±1 RMQ Reduction",
              "kind": "lesson",
              "archive": {
                "slug": "lowest-common-ancestor-rmq",
                "file": "lowest-common-ancestor-rmq.md",
                "title": "Lowest Common Ancestor (LCA): Binary Lifting vs Euler Tour + ±1 RMQ Reduction",
                "displayTitle": "Lowest Common Ancestor (LCA): Binary Lifting vs Euler Tour + ±1 RMQ Reduction",
                "type": "lesson",
                "tags": [
                  "lca",
                  "binary-lifting",
                  "euler-tour"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "O(N log N) jump pointers for k-th ancestor and LCA vs Bender-Farach-Colton Euler tour depth reduction to O(N) build / O(1) query RMQ.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "heavy-light-decomposition",
              "title": "Heavy-Light Decomposition (HLD): Decomposing Trees into O(log N) Heavy Paths",
              "kind": "lesson",
              "archive": {
                "slug": "heavy-light-decomposition",
                "file": "heavy-light-decomposition.md",
                "title": "Heavy-Light Decomposition (HLD): Decomposing Trees into O(log N) Heavy Paths",
                "displayTitle": "Heavy-Light Decomposition (HLD): Decomposing Trees into O(log N) Heavy Paths",
                "type": "lesson",
                "tags": [
                  "hld",
                  "tree-queries",
                  "segment-tree"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Sleator-Tarjan heavy-edge classification: why any root-to-leaf path crosses at most log2 N light edges, enabling Segment Tree operations on tree paths.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "cartesian-trees-treap-duality",
              "title": "Cartesian Trees: Linear-Time Monotonic Stack Construction & RMQ-LCA Duality",
              "kind": "lesson",
              "archive": {
                "slug": "cartesian-trees-treap-duality",
                "file": "cartesian-trees-treap-duality.md",
                "title": "Cartesian Trees: Linear-Time Monotonic Stack Construction & RMQ-LCA Duality",
                "displayTitle": "Cartesian Trees: Linear-Time Monotonic Stack Construction & RMQ-LCA Duality",
                "type": "lesson",
                "tags": [
                  "cartesian-tree",
                  "rmq",
                  "monotonic-stack"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Building the unique heap-ordered inorder binary tree of an array in O(N) via a right-spine monotonic stack and unifying RMQ with Tree LCA.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-lazy-segment-tree",
              "title": "Build Lab: Generic Lazy-Propagating Segment Tree with Range Affine Updates & Queries",
              "kind": "build",
              "archive": {
                "slug": "build-lazy-segment-tree",
                "file": "build-lazy-segment-tree.md",
                "title": "Build Lab: Generic Lazy-Propagating Segment Tree with Range Affine Updates & Queries",
                "displayTitle": "Build Lab: Generic Lazy-Propagating Segment Tree with Range Affine Updates & Queries",
                "type": "build",
                "tags": [
                  "build-lab",
                  "segment-tree",
                  "lazy-propagation"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Build an AtCoder-style generic LazySegmentTree supporting range affine transformations (a[i] ← b·a[i] + c) and range sum/min/max queries.",
                "mermaidCount": 1
              }
            }
          ]
        }
      ]
    },
    {
      "id": "track-4",
      "number": 4,
      "title": "Strings, Automata & Information Retrieval",
      "summary": "Prefix & radix tries, rolling hashes, KMP, Z-algorithm, Boyer-Moore, Aho-Corasick, Manacher, Suffix Arrays/Automata, BWT/FM-Index, Thompson NFA, Myers diff, and compression.",
      "hours": 26,
      "modules": [
        {
          "id": "m10",
          "number": "4.1",
          "legacyNumber": "10",
          "title": "Tries, Exact String Matching & Multi-Pattern Automata",
          "summary": "Radix/PATRICIA tries, bitwise XOR tries, Rabin-Karp 2^61-1 rolling hashes, KMP, Z-algorithm, Boyer-Moore, Aho-Corasick, Manacher, and ripgrep internals.",
          "units": [
            {
              "slug": "tries-radix-trees-patricia",
              "title": "Prefix Tries, Compressed Radix Trees & PATRICIA Trees",
              "kind": "lesson",
              "archive": {
                "slug": "tries-radix-trees-patricia",
                "file": "tries-radix-trees-patricia.md",
                "title": "Prefix Tries, Compressed Radix Trees & PATRICIA Trees",
                "displayTitle": "Prefix Tries, Compressed Radix Trees & PATRICIA Trees",
                "type": "lesson",
                "tags": [
                  "trie",
                  "radix-tree",
                  "patricia"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Alphabet fanout tradeoffs (array vs map vs child-sibling), path compression of single-child chains, and Redis rax / Linux XArray prefix indexing.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "bitwise-tries-max-xor",
              "title": "Bitwise (0-1) Tries: Maximum XOR Subarray & Subtree Queries",
              "kind": "design",
              "archive": {
                "slug": "bitwise-tries-max-xor",
                "file": "bitwise-tries-max-xor.md",
                "title": "Bitwise (0-1) Tries: Maximum XOR Subarray & Subtree Queries",
                "displayTitle": "Bitwise (0-1) Tries: Maximum XOR Subarray & Subtree Queries",
                "type": "design",
                "tags": [
                  "bitwise-trie",
                  "xor",
                  "persistent-trie"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Treating 32/64-bit integers as fixed-depth binary strings to answer maximum XOR pair, XOR < K count, and persistent subarray XOR queries in O(W).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "rabin-karp-polynomial-rolling-hash",
              "title": "Rabin-Karp Rolling Hash: Mersenne Prime Moduli (2^61 - 1) & Birthday Collision Avoidance",
              "kind": "lesson",
              "archive": {
                "slug": "rabin-karp-polynomial-rolling-hash",
                "file": "rabin-karp-polynomial-rolling-hash.md",
                "title": "Rabin-Karp Rolling Hash: Mersenne Prime Moduli (2^61 - 1) & Birthday Collision Avoidance",
                "displayTitle": "Rabin-Karp Rolling Hash: Mersenne Prime Moduli (2^61 - 1) & Birthday Collision Avoidance",
                "type": "lesson",
                "tags": [
                  "rabin-karp",
                  "rolling-hash",
                  "string-matching"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "O(1) sliding window hash updates, fast Mersenne bitshift modular reduction, and why single-modulus 10^9+7 fails above 40,000 strings via the Birthday Paradox.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "kmp-prefix-function-automaton",
              "title": "Knuth-Morris-Pratt (KMP): Prefix Function π[i] Amortized Linearity & DFA View",
              "kind": "lesson",
              "archive": {
                "slug": "kmp-prefix-function-automaton",
                "file": "kmp-prefix-function-automaton.md",
                "title": "Knuth-Morris-Pratt (KMP): Prefix Function π[i] Amortized Linearity & DFA View",
                "displayTitle": "Knuth-Morris-Pratt (KMP): Prefix Function π[i] Amortized Linearity & DFA View",
                "type": "lesson",
                "tags": [
                  "kmp",
                  "prefix-function",
                  "automata"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Computing longest proper prefix-suffix borders π[i] in O(|P|) via potential Φ = π[i-1], and KMP automaton transition tables for streaming text.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "z-algorithm-linear-box",
              "title": "The Z-Algorithm: Linear-Time [L, R] Z-Box Maintenance & Pattern Matching",
              "kind": "lesson",
              "archive": {
                "slug": "z-algorithm-linear-box",
                "file": "z-algorithm-linear-box.md",
                "title": "The Z-Algorithm: Linear-Time [L, R] Z-Box Maintenance & Pattern Matching",
                "displayTitle": "The Z-Algorithm: Linear-Time [L, R] Z-Box Maintenance & Pattern Matching",
                "type": "lesson",
                "tags": [
                  "z-algorithm",
                  "string-matching",
                  "linear-time"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Maintaining the rightmost matched prefix interval [L, R] to bootstrap Z[i] from Z[i - L] without ever re-scanning characters left of R.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "boyer-moore-horspool-simd",
              "title": "Sublinear Average-Case Matching: Boyer-Moore Bad-Character/Good-Suffix & Horspool",
              "kind": "lesson",
              "archive": {
                "slug": "boyer-moore-horspool-simd",
                "file": "boyer-moore-horspool-simd.md",
                "title": "Sublinear Average-Case Matching: Boyer-Moore Bad-Character/Good-Suffix & Horspool",
                "displayTitle": "Sublinear Average-Case Matching: Boyer-Moore Bad-Character/Good-Suffix & Horspool",
                "type": "lesson",
                "tags": [
                  "boyer-moore",
                  "horspool",
                  "string-search"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Right-to-left pattern verification and bad-character skip tables that inspect only O(|T| / |P|) characters on natural language and source code.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "aho-corasick-trie-automaton",
              "title": "Aho-Corasick Automaton: Trie + BFS Failure Links + Dictionary Suffix Links",
              "kind": "lesson",
              "archive": {
                "slug": "aho-corasick-trie-automaton",
                "file": "aho-corasick-trie-automaton.md",
                "title": "Aho-Corasick Automaton: Trie + BFS Failure Links + Dictionary Suffix Links",
                "displayTitle": "Aho-Corasick Automaton: Trie + BFS Failure Links + Dictionary Suffix Links",
                "type": "lesson",
                "tags": [
                  "aho-corasick",
                  "multi-pattern",
                  "automata"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Generalizing KMP to a set of patterns: BFS failure link construction, output link compression to avoid O(N^2) empty-match traversals, and DFA completion.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "manacher-palindromic-tree",
              "title": "Palindromes in O(N): Manacher's Algorithm & Eertree (Palindromic Automaton)",
              "kind": "lesson",
              "archive": {
                "slug": "manacher-palindromic-tree",
                "file": "manacher-palindromic-tree.md",
                "title": "Palindromes in O(N): Manacher's Algorithm & Eertree (Palindromic Automaton)",
                "displayTitle": "Palindromes in O(N): Manacher's Algorithm & Eertree (Palindromic Automaton)",
                "type": "lesson",
                "tags": [
                  "manacher",
                  "palindromes",
                  "eertree"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Exploiting palindrome reflection symmetry across the rightmost center C to find all maximal palindrome radii and all ≤ N+2 distinct palindrome states in O(N).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-ripgrep-teddy-simd",
              "title": "Production Case Study: Why ripgrep Is So Fast (Aho-Corasick, Boyer-Moore & SIMD Teddy)",
              "kind": "case",
              "archive": {
                "slug": "case-ripgrep-teddy-simd",
                "file": "case-ripgrep-teddy-simd.md",
                "title": "Production Case Study: Why ripgrep Is So Fast (Aho-Corasick, Boyer-Moore & SIMD Teddy)",
                "displayTitle": "Production Case Study: Why ripgrep Is So Fast (Aho-Corasick, Boyer-Moore & SIMD Teddy)",
                "type": "case",
                "tags": [
                  "ripgrep",
                  "simd",
                  "string-search"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "How BurntSushi's ripgrep extracts literal prefixes from regexes, uses SIMD memchr/Teddy shuffle masks, and switches to Aho-Corasick without reading every byte.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-aho-corasick-scanner",
              "title": "Build Lab: Multi-Pattern Aho-Corasick Automaton with Overlapping Match Streamer",
              "kind": "build",
              "archive": {
                "slug": "build-aho-corasick-scanner",
                "file": "build-aho-corasick-scanner.md",
                "title": "Build Lab: Multi-Pattern Aho-Corasick Automaton with Overlapping Match Streamer",
                "displayTitle": "Build Lab: Multi-Pattern Aho-Corasick Automaton with Overlapping Match Streamer",
                "type": "build",
                "tags": [
                  "build-lab",
                  "aho-corasick",
                  "automata"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Implement a compiled Aho-Corasick multi-pattern scanner with trie insertion, BFS failure transitions, output suffix links, and streaming match extraction.",
                "mermaidCount": 1
              }
            }
          ]
        },
        {
          "id": "m11",
          "number": "4.2",
          "legacyNumber": "11",
          "title": "Suffix Structures, Sequence Alignment & Data Compression",
          "summary": "Ukkonen Suffix Trees, Manber-Myers/SA-IS Suffix Arrays, Kasai LCP, Suffix Automata (SAM), BWT/FM-Index, Thompson NFA regex, Myers diff, and Huffman/LZ77.",
          "units": [
            {
              "slug": "suffix-trees-ukkonen-intuition",
              "title": "Suffix Trees & Ukkonen's Online O(N) Construction: Active Point & Suffix Links",
              "kind": "lesson",
              "archive": {
                "slug": "suffix-trees-ukkonen-intuition",
                "file": "suffix-trees-ukkonen-intuition.md",
                "title": "Suffix Trees & Ukkonen's Online O(N) Construction: Active Point & Suffix Links",
                "displayTitle": "Suffix Trees & Ukkonen's Online O(N) Construction: Active Point & Suffix Links",
                "type": "lesson",
                "tags": [
                  "suffix-tree",
                  "ukkonen",
                  "strings"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Compressing all N(N+1)/2 substrings into ≤ 2N tree edges via open leaf ends, Rule 2/Rule 3 extensions, skip-count trick, and suffix links.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "suffix-arrays-prefix-doubling-sais",
              "title": "Suffix Arrays: Manber-Myers O(N log N) Prefix Doubling & SA-IS O(N) Overview",
              "kind": "lesson",
              "archive": {
                "slug": "suffix-arrays-prefix-doubling-sais",
                "file": "suffix-arrays-prefix-doubling-sais.md",
                "title": "Suffix Arrays: Manber-Myers O(N log N) Prefix Doubling & SA-IS O(N) Overview",
                "displayTitle": "Suffix Arrays: Manber-Myers O(N log N) Prefix Doubling & SA-IS O(N) Overview",
                "type": "lesson",
                "tags": [
                  "suffix-array",
                  "manber-myers",
                  "sais"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Replacing pointer-heavy suffix trees with a flat sorted permutation of suffix indices via 2^k rank-pair radix doubling and Induced Sorting (S/L types).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "kasai-lcp-array-rmq",
              "title": "Kasai's O(N) LCP Array Algorithm & Counting Distinct Substrings via SA + LCP",
              "kind": "lesson",
              "archive": {
                "slug": "kasai-lcp-array-rmq",
                "file": "kasai-lcp-array-rmq.md",
                "title": "Kasai's O(N) LCP Array Algorithm & Counting Distinct Substrings via SA + LCP",
                "displayTitle": "Kasai's O(N) LCP Array Algorithm & Counting Distinct Substrings via SA + LCP",
                "type": "lesson",
                "tags": [
                  "lcp-array",
                  "kasai",
                  "suffix-array"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why LCP[rank[i]] ≥ LCP[rank[i-1]] - 1 guarantees linear time, reducing substring LCP queries to RMQ, and counting Σ (N - SA[i] - LCP[i]) distinct substrings.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "suffix-automaton-sam-endpos",
              "title": "Suffix Automaton (SAM / DAWG): endpos Equivalence Classes & State Transitions",
              "kind": "lesson",
              "archive": {
                "slug": "suffix-automaton-sam-endpos",
                "file": "suffix-automaton-sam-endpos.md",
                "title": "Suffix Automaton (SAM / DAWG): endpos Equivalence Classes & State Transitions",
                "displayTitle": "Suffix Automaton (SAM / DAWG): endpos Equivalence Classes & State Transitions",
                "type": "lesson",
                "tags": [
                  "suffix-automaton",
                  "sam",
                  "automata"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Blumer's minimal DFA of all substrings: why endpos sets form a laminar tree (suffix link tree) of at most 2N-1 states and 3N-4 transitions.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "burrows-wheeler-transform-fm-index",
              "title": "Burrows-Wheeler Transform (BWT), Last-to-First (LF) Mapping & FM-Index Substring Search",
              "kind": "lesson",
              "archive": {
                "slug": "burrows-wheeler-transform-fm-index",
                "file": "burrows-wheeler-transform-fm-index.md",
                "title": "Burrows-Wheeler Transform (BWT), Last-to-First (LF) Mapping & FM-Index Substring Search",
                "displayTitle": "Burrows-Wheeler Transform (BWT), Last-to-First (LF) Mapping & FM-Index Substring Search",
                "type": "lesson",
                "tags": [
                  "bwt",
                  "fm-index",
                  "compression"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Reversible block-sorting permutation that clusters identical contexts for compression while enabling O(|P|) backward search via Wavelet Tree rank queries.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "thompson-nfa-vs-backtracking-regex",
              "title": "Regular Expression Engines: Thompson's O(NM) NFA Simulation vs Catastrophic ReDoS Backtracking",
              "kind": "lesson",
              "archive": {
                "slug": "thompson-nfa-vs-backtracking-regex",
                "file": "thompson-nfa-vs-backtracking-regex.md",
                "title": "Regular Expression Engines: Thompson's O(NM) NFA Simulation vs Catastrophic ReDoS Backtracking",
                "displayTitle": "Regular Expression Engines: Thompson's O(NM) NFA Simulation vs Catastrophic ReDoS Backtracking",
                "type": "lesson",
                "tags": [
                  "regex",
                  "thompson-nfa",
                  "redos"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Russ Cox's analysis: why PCRE/JS backtracking explodes in O(2^N) on (a+)+b while Thompson's lockstep state-set simulation guarantees O(|R|·|T|) time.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "myers-diff-hirschberg-lcs",
              "title": "Myers O(ND) Shortest Edit Script & Hirschberg's Linear-Space Alignment",
              "kind": "lesson",
              "archive": {
                "slug": "myers-diff-hirschberg-lcs",
                "file": "myers-diff-hirschberg-lcs.md",
                "title": "Myers O(ND) Shortest Edit Script & Hirschberg's Linear-Space Alignment",
                "displayTitle": "Myers O(ND) Shortest Edit Script & Hirschberg's Linear-Space Alignment",
                "type": "lesson",
                "tags": [
                  "myers-diff",
                  "hirschberg",
                  "lcs"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Searching edit graphs along diagonal k = x - y snakes in O((N+M)D) time, and Hirschberg's divide-and-conquer midpoint split for O(min(N,M)) memory.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "huffman-lz77-deflate",
              "title": "Lossless Compression: Huffman Optimality Proof, LZ77 Sliding Window & DEFLATE",
              "kind": "lesson",
              "archive": {
                "slug": "huffman-lz77-deflate",
                "file": "huffman-lz77-deflate.md",
                "title": "Lossless Compression: Huffman Optimality Proof, LZ77 Sliding Window & DEFLATE",
                "displayTitle": "Lossless Compression: Huffman Optimality Proof, LZ77 Sliding Window & DEFLATE",
                "type": "lesson",
                "tags": [
                  "huffman-coding",
                  "lz77",
                  "deflate"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Shannon entropy lower bound H(X), canonical prefix-free Huffman code lengths, LZ77 (distance, length) back-references, and RFC 1951 DEFLATE.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-git-myers-histogram-diff",
              "title": "Production Case Study: Inside git diff (Myers vs Patience vs Histogram Diff)",
              "kind": "case",
              "archive": {
                "slug": "case-git-myers-histogram-diff",
                "file": "case-git-myers-histogram-diff.md",
                "title": "Production Case Study: Inside git diff (Myers vs Patience vs Histogram Diff)",
                "displayTitle": "Production Case Study: Inside git diff (Myers vs Patience vs Histogram Diff)",
                "type": "case",
                "tags": [
                  "git-diff",
                  "myers",
                  "patience-diff"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why standard Myers diff sometimes aligns brace lines poorly and how Patience/Histogram diff anchors on low-frequency unique lines for human-readable patches.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-thompson-nfa-regex-engine",
              "title": "Build Lab: ReDoS-Proof Regular Expression Engine via Thompson's Construction & NFA Step Simulation",
              "kind": "build",
              "archive": {
                "slug": "build-thompson-nfa-regex-engine",
                "file": "build-thompson-nfa-regex-engine.md",
                "title": "Build Lab: ReDoS-Proof Regular Expression Engine via Thompson's Construction & NFA Step Simulation",
                "displayTitle": "Build Lab: ReDoS-Proof Regular Expression Engine via Thompson's Construction & NFA Step Simulation",
                "type": "build",
                "tags": [
                  "build-lab",
                  "regex",
                  "thompson-nfa"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Compile regular expressions (concatenation, alternation |, Kleene *, +, ?, char classes) into Thompson NFA state graphs and execute linear-time lockstep matching.",
                "mermaidCount": 1
              }
            }
          ]
        }
      ]
    },
    {
      "id": "track-5",
      "number": 5,
      "title": "Graph Theory, Shortest Paths & Network Flow",
      "summary": "CSR graph layouts, BFS/DFS, Tarjan SCC & bridges, 2-SAT, DSU α(N), MSTs, Dijkstra, A*, Bellman-Ford, APSP, Dinic Max-Flow, and bipartite matching.",
      "hours": 34,
      "modules": [
        {
          "id": "m12",
          "number": "5.1",
          "legacyNumber": "12",
          "title": "Graph Representations, Traversals, Connectivity & Topological Order",
          "summary": "CSR arrays, 0-1 BFS, DFS parenthesis/edge theorems, Kahn/DFS topological sort, bipartite 2-coloring, Tarjan bridges/cut vertices/SCCs, 2-SAT, and Eulerian trails.",
          "units": [
            {
              "slug": "graph-representations-csr-cache",
              "title": "Graph Representations: Adjacency Lists, Bit Matrices & Compressed Sparse Row (CSR)",
              "kind": "lesson",
              "archive": {
                "slug": "graph-representations-csr-cache",
                "file": "graph-representations-csr-cache.md",
                "title": "Graph Representations: Adjacency Lists, Bit Matrices & Compressed Sparse Row (CSR)",
                "displayTitle": "Graph Representations: Adjacency Lists, Bit Matrices & Compressed Sparse Row (CSR)",
                "type": "lesson",
                "tags": [
                  "graphs",
                  "csr",
                  "cache-locality"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why pointer-of-vectors adjacency lists suffer L3 cache misses and how flat offsets[] + edges[] CSR arrays accelerate graph traversals by 5–10×.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "bfs-01-bfs-multi-source",
              "title": "Breadth-First Search: Multi-Source BFS, 0-1 BFS (Deque) & Bidirectional Search",
              "kind": "lesson",
              "archive": {
                "slug": "bfs-01-bfs-multi-source",
                "file": "bfs-01-bfs-multi-source.md",
                "title": "Breadth-First Search: Multi-Source BFS, 0-1 BFS (Deque) & Bidirectional Search",
                "displayTitle": "Breadth-First Search: Multi-Source BFS, 0-1 BFS (Deque) & Bidirectional Search",
                "type": "lesson",
                "tags": [
                  "bfs",
                  "01-bfs",
                  "shortest-paths"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Two-distance queue invariant in BFS, 0-1 edge weights via front/back deque insertion, multi-source virtual supernodes, and bidirectional frontier intersection.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "dfs-edge-classification-timestamps",
              "title": "Depth-First Search: Parenthesis Theorem, White-Path Theorem & Tree/Back/Forward/Cross Edges",
              "kind": "lesson",
              "archive": {
                "slug": "dfs-edge-classification-timestamps",
                "file": "dfs-edge-classification-timestamps.md",
                "title": "Depth-First Search: Parenthesis Theorem, White-Path Theorem & Tree/Back/Forward/Cross Edges",
                "displayTitle": "Depth-First Search: Parenthesis Theorem, White-Path Theorem & Tree/Back/Forward/Cross Edges",
                "type": "lesson",
                "tags": [
                  "dfs",
                  "edge-classification",
                  "graph-theory"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Entry/exit intervals [tin[u], tout[u]], 3-color cycle detection (WHITE/GRAY/BLACK), and why undirected DFS produces only Tree and Back edges.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "topological-sort-kahn-dfs",
              "title": "Directed Acyclic Graphs (DAGs): Kahn's Indegree Queue vs DFS Post-Order Reversal",
              "kind": "lesson",
              "archive": {
                "slug": "topological-sort-kahn-dfs",
                "file": "topological-sort-kahn-dfs.md",
                "title": "Directed Acyclic Graphs (DAGs): Kahn's Indegree Queue vs DFS Post-Order Reversal",
                "displayTitle": "Directed Acyclic Graphs (DAGs): Kahn's Indegree Queue vs DFS Post-Order Reversal",
                "type": "lesson",
                "tags": [
                  "topological-sort",
                  "dag",
                  "kahn-algorithm"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Equivalence of DAG acyclicity and topological orderings, lexicographically smallest schedules via min-heap Kahn, and critical path scheduling.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "bipartite-graphs-2-coloring",
              "title": "Bipartite Graphs: Odd-Cycle Characterization & 2-Coloring Verification",
              "kind": "lesson",
              "archive": {
                "slug": "bipartite-graphs-2-coloring",
                "file": "bipartite-graphs-2-coloring.md",
                "title": "Bipartite Graphs: Odd-Cycle Characterization & 2-Coloring Verification",
                "displayTitle": "Bipartite Graphs: Odd-Cycle Characterization & 2-Coloring Verification",
                "type": "lesson",
                "tags": [
                  "bipartite",
                  "2-coloring",
                  "odd-cycle"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "König's characterization: proving a graph is 2-colorable iff it contains no odd-length cycle, and extracting odd-cycle witnesses via BFS layer parity.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "bridges-articulation-biconnected",
              "title": "Undirected Connectivity: Tarjan's tin/low Algorithm for Bridges, Cut Vertices & BCCs",
              "kind": "lesson",
              "archive": {
                "slug": "bridges-articulation-biconnected",
                "file": "bridges-articulation-biconnected.md",
                "title": "Undirected Connectivity: Tarjan's tin/low Algorithm for Bridges, Cut Vertices & BCCs",
                "displayTitle": "Undirected Connectivity: Tarjan's tin/low Algorithm for Bridges, Cut Vertices & BCCs",
                "type": "lesson",
                "tags": [
                  "bridges",
                  "articulation-points",
                  "tarjan"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Computing low[u] back-edge reachability to identify critical single points of failure (low[v] > tin[u] for bridges, low[v] ≥ tin[u] for cut vertices) in O(V+E).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "scc-tarjan-kosaraju-2sat",
              "title": "Strongly Connected Components: Kosaraju's Two-Pass vs Tarjan's Single-Pass Stack & 2-SAT",
              "kind": "lesson",
              "archive": {
                "slug": "scc-tarjan-kosaraju-2sat",
                "file": "scc-tarjan-kosaraju-2sat.md",
                "title": "Strongly Connected Components: Kosaraju's Two-Pass vs Tarjan's Single-Pass Stack & 2-SAT",
                "displayTitle": "Strongly Connected Components: Kosaraju's Two-Pass vs Tarjan's Single-Pass Stack & 2-SAT",
                "type": "lesson",
                "tags": [
                  "scc",
                  "tarjan",
                  "2-sat"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Condensing directed cycles into a DAG of SCCs and solving boolean 2-CNF satisfiability (x ∨ y ≡ ¬x → y ∧ ¬y → x) in linear time.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "eulerian-paths-hierholzer",
              "title": "Eulerian Trails & Circuits: Degree Conditions & Hierholzer's O(E) Algorithm",
              "kind": "lesson",
              "archive": {
                "slug": "eulerian-paths-hierholzer",
                "file": "eulerian-paths-hierholzer.md",
                "title": "Eulerian Trails & Circuits: Degree Conditions & Hierholzer's O(E) Algorithm",
                "displayTitle": "Eulerian Trails & Circuits: Degree Conditions & Hierholzer's O(E) Algorithm",
                "type": "lesson",
                "tags": [
                  "eulerian-path",
                  "hierholzer",
                  "de-bruijn"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "In/out-degree parity conditions, splicing cycle detours in O(E) via Hierholzer's stack, and genome assembly on De Bruijn k-mer graphs.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-bundler-build-graph-cycles",
              "title": "Production Case Study: Topological Scheduling & SCC Cycle Reporting in Build Systems (bazel, turborepo, cargo)",
              "kind": "case",
              "archive": {
                "slug": "case-bundler-build-graph-cycles",
                "file": "case-bundler-build-graph-cycles.md",
                "title": "Production Case Study: Topological Scheduling & SCC Cycle Reporting in Build Systems (bazel, turborepo, cargo)",
                "displayTitle": "Production Case Study: Topological Scheduling & SCC Cycle Reporting in Build Systems (bazel, turborepo, cargo)",
                "type": "case",
                "tags": [
                  "build-systems",
                  "topological-sort",
                  "scc"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "How Bazel Skyframe, Cargo, and Turborepo schedule parallel task execution along DAG wavefronts and report minimal circular dependency chains using Tarjan SCCs.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-tarjan-scc-2sat-solver",
              "title": "Build Lab: Tarjan's SCC Condensation DAG & Linear-Time 2-SAT Constraint Solver",
              "kind": "build",
              "archive": {
                "slug": "build-tarjan-scc-2sat-solver",
                "file": "build-tarjan-scc-2sat-solver.md",
                "title": "Build Lab: Tarjan's SCC Condensation DAG & Linear-Time 2-SAT Constraint Solver",
                "displayTitle": "Build Lab: Tarjan's SCC Condensation DAG & Linear-Time 2-SAT Constraint Solver",
                "type": "build",
                "tags": [
                  "build-lab",
                  "tarjan-scc",
                  "2-sat"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Implement single-pass Tarjan SCC extraction, condensation DAG construction, and a complete 2-SAT boolean constraint solver with witness assignment.",
                "mermaidCount": 1
              }
            }
          ]
        },
        {
          "id": "m13",
          "number": "5.2",
          "legacyNumber": "13",
          "title": "Disjoint Sets, Minimum Spanning Trees & Shortest Paths",
          "summary": "DSU α(N) inverse Ackermann, weighted/rollback DSU, Kruskal/Prim/Borůvka MST, Dijkstra, A*, Bellman-Ford difference constraints, Floyd-Warshall/Johnson, and Contraction Hierarchies.",
          "units": [
            {
              "slug": "disjoint-set-union-ackermann",
              "title": "Disjoint Set Union (Union-Find): Union by Rank + Path Compression & O(α(N)) Proof Intuition",
              "kind": "lesson",
              "archive": {
                "slug": "disjoint-set-union-ackermann",
                "file": "disjoint-set-union-ackermann.md",
                "title": "Disjoint Set Union (Union-Find): Union by Rank + Path Compression & O(α(N)) Proof Intuition",
                "displayTitle": "Disjoint Set Union (Union-Find): Union by Rank + Path Compression & O(α(N)) Proof Intuition",
                "type": "lesson",
                "tags": [
                  "dsu",
                  "union-find",
                  "inverse-ackermann"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why Union by Rank alone gives O(log N), Path Compression alone gives O(log N) amortized, and combining both yields Tarjan's O(α(N)) ≤ 4 bound.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "dsu-rollback-weighted-offline",
              "title": "Weighted DSU (Potentials/Parity) & Rollback DSU for Dynamic Connectivity Over Time",
              "kind": "design",
              "archive": {
                "slug": "dsu-rollback-weighted-offline",
                "file": "dsu-rollback-weighted-offline.md",
                "title": "Weighted DSU (Potentials/Parity) & Rollback DSU for Dynamic Connectivity Over Time",
                "displayTitle": "Weighted DSU (Potentials/Parity) & Rollback DSU for Dynamic Connectivity Over Time",
                "type": "design",
                "tags": [
                  "rollback-dsu",
                  "dynamic-connectivity",
                  "offline-queries"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Maintaining edge potentials along parent pointers (bipartite parity / relative offsets) and combining Undo-Stack DSU with a Segment Tree over time.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "mst-cut-cycle-properties",
              "title": "Minimum Spanning Trees: Cut & Cycle Optimality Properties, Kruskal's, Prim's & Borůvka's",
              "kind": "lesson",
              "archive": {
                "slug": "mst-cut-cycle-properties",
                "file": "mst-cut-cycle-properties.md",
                "title": "Minimum Spanning Trees: Cut & Cycle Optimality Properties, Kruskal's, Prim's & Borůvka's",
                "displayTitle": "Minimum Spanning Trees: Cut & Cycle Optimality Properties, Kruskal's, Prim's & Borůvka's",
                "type": "lesson",
                "tags": [
                  "mst",
                  "kruskal",
                  "prim"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Unifying all MST algorithms via the Red-Blue Cut and Cycle rules, dense O(V^2) Prim vs sparse O(E log E) Kruskal, and parallel Borůvka component hookings.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "dijkstra-relaxation-invariants",
              "title": "Dijkstra's Algorithm: Non-Negative Edge Invariant, Priority Queue Tradeoffs & Dial's Bucket Queue",
              "kind": "lesson",
              "archive": {
                "slug": "dijkstra-relaxation-invariants",
                "file": "dijkstra-relaxation-invariants.md",
                "title": "Dijkstra's Algorithm: Non-Negative Edge Invariant, Priority Queue Tradeoffs & Dial's Bucket Queue",
                "displayTitle": "Dijkstra's Algorithm: Non-Negative Edge Invariant, Priority Queue Tradeoffs & Dial's Bucket Queue",
                "type": "lesson",
                "tags": [
                  "dijkstra",
                  "shortest-paths",
                  "priority-queue"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Inductive settled-set proof, lazy deletion vs decreaseKey in 4-ary heaps, and Dial's O(V + E + C) bucket queue for bounded integer weights.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "astar-heuristic-admissibility",
              "title": "A* Search & Bidirectional A*: Admissibility, Consistency (Triangle Inequality) & Optimality Proof",
              "kind": "lesson",
              "archive": {
                "slug": "astar-heuristic-admissibility",
                "file": "astar-heuristic-admissibility.md",
                "title": "A* Search & Bidirectional A*: Admissibility, Consistency (Triangle Inequality) & Optimality Proof",
                "displayTitle": "A* Search & Bidirectional A*: Admissibility, Consistency (Triangle Inequality) & Optimality Proof",
                "type": "lesson",
                "tags": [
                  "astar",
                  "heuristics",
                  "pathfinding"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Potential-reweighted Dijkstra view of A*: why admissibility (h(u) ≤ d*(u,t)) guarantees optimality and consistency (h(u) ≤ w(u,v) + h(v)) prevents re-expansions.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "bellman-ford-spfa-difference-constraints",
              "title": "Negative Weights: Bellman-Ford, Negative Cycle Reconstruction & Systems of Difference Constraints",
              "kind": "lesson",
              "archive": {
                "slug": "bellman-ford-spfa-difference-constraints",
                "file": "bellman-ford-spfa-difference-constraints.md",
                "title": "Negative Weights: Bellman-Ford, Negative Cycle Reconstruction & Systems of Difference Constraints",
                "displayTitle": "Negative Weights: Bellman-Ford, Negative Cycle Reconstruction & Systems of Difference Constraints",
                "type": "lesson",
                "tags": [
                  "bellman-ford",
                  "negative-cycles",
                  "difference-constraints"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Path-length relaxation invariant after k passes, currency arbitrage cycle detection, and solving x_v - x_u ≤ w(u,v) linear feasibility systems.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "floyd-warshall-johnson-apsp",
              "title": "All-Pairs Shortest Paths: Floyd-Warshall DP Transitive Closure & Johnson's Potential Reweighting",
              "kind": "lesson",
              "archive": {
                "slug": "floyd-warshall-johnson-apsp",
                "file": "floyd-warshall-johnson-apsp.md",
                "title": "All-Pairs Shortest Paths: Floyd-Warshall DP Transitive Closure & Johnson's Potential Reweighting",
                "displayTitle": "All-Pairs Shortest Paths: Floyd-Warshall DP Transitive Closure & Johnson's Potential Reweighting",
                "type": "lesson",
                "tags": [
                  "floyd-warshall",
                  "johnson-algorithm",
                  "apsp"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Intermediate vertex set {1..k} DP state compression in O(V^3) vs Johnson's Bellman-Ford potential shift w'(u,v) = w(u,v) + h(u) - h(v) ≥ 0 for O(VE log V).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "state-space-dijkstra-layered-graphs",
              "title": "Modeling Problems as State-Space Graphs: Layered Graphs ((u, k) States) & Bitmask Dijkstra",
              "kind": "design",
              "archive": {
                "slug": "state-space-dijkstra-layered-graphs",
                "file": "state-space-dijkstra-layered-graphs.md",
                "title": "Modeling Problems as State-Space Graphs: Layered Graphs ((u, k) States) & Bitmask Dijkstra",
                "displayTitle": "Modeling Problems as State-Space Graphs: Layered Graphs ((u, k) States) & Bitmask Dijkstra",
                "type": "design",
                "tags": [
                  "state-space-graph",
                  "layered-dijkstra",
                  "modeling"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Encoding fuel capacities, k free edge discounts, and mandatory waypoint bitmasks into product graphs G × S without changing Dijkstra's engine.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-osrm-contraction-hierarchies",
              "title": "Production Case Study: How Continental Road Routing Works in 1 Millisecond (Contraction Hierarchies & Hub Labeling)",
              "kind": "case",
              "archive": {
                "slug": "case-osrm-contraction-hierarchies",
                "file": "case-osrm-contraction-hierarchies.md",
                "title": "Production Case Study: How Continental Road Routing Works in 1 Millisecond (Contraction Hierarchies & Hub Labeling)",
                "displayTitle": "Production Case Study: How Continental Road Routing Works in 1 Millisecond (Contraction Hierarchies & Hub Labeling)",
                "type": "case",
                "tags": [
                  "contraction-hierarchies",
                  "osrm",
                  "road-networks"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why standard Dijkstra takes 2 seconds on 50M road intersections, and how node contraction shortcuts enable sub-millisecond upward-only bidirectional queries.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-astar-bidirectional-router",
              "title": "Build Lab: A* and Bidirectional Dijkstra Pathfinding Engine with Consistent Potentials",
              "kind": "build",
              "archive": {
                "slug": "build-astar-bidirectional-router",
                "file": "build-astar-bidirectional-router.md",
                "title": "Build Lab: A* and Bidirectional Dijkstra Pathfinding Engine with Consistent Potentials",
                "displayTitle": "Build Lab: A* and Bidirectional Dijkstra Pathfinding Engine with Consistent Potentials",
                "type": "build",
                "tags": [
                  "build-lab",
                  "astar",
                  "bidirectional-dijkstra"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Implement a multi-algorithm shortest-path router supporting Dijkstra, A* with pluggable heuristics, and Bidirectional Dijkstra with exact μ stopping criteria.",
                "mermaidCount": 1
              }
            }
          ]
        },
        {
          "id": "m14",
          "number": "5.3",
          "legacyNumber": "14",
          "title": "Network Flow, Min-Cut & Bipartite Matching",
          "summary": "Residual networks, Max-Flow Min-Cut theorem, Edmonds-Karp, Dinic's blocking flow, Push-Relabel, Hopcroft-Karp, Hungarian algorithm, MCMF, and flow reductions.",
          "units": [
            {
              "slug": "flow-networks-residual-graphs",
              "title": "Flow Networks, Residual Capacities, Augmenting Paths & Ford-Fulkerson Method",
              "kind": "lesson",
              "archive": {
                "slug": "flow-networks-residual-graphs",
                "file": "flow-networks-residual-graphs.md",
                "title": "Flow Networks, Residual Capacities, Augmenting Paths & Ford-Fulkerson Method",
                "displayTitle": "Flow Networks, Residual Capacities, Augmenting Paths & Ford-Fulkerson Method",
                "type": "lesson",
                "tags": [
                  "network-flow",
                  "residual-graph",
                  "ford-fulkerson"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Capacity and skew-symmetry invariants, why backward residual edges (f(v,u) = -f(u,v)) enable greedy undo operations, and XOR edge-pair indexing.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "max-flow-min-cut-theorem",
              "title": "The Max-Flow Min-Cut Theorem: Three-Way Equivalence Proof & Integrality Theorem",
              "kind": "lesson",
              "archive": {
                "slug": "max-flow-min-cut-theorem",
                "file": "max-flow-min-cut-theorem.md",
                "title": "The Max-Flow Min-Cut Theorem: Three-Way Equivalence Proof & Integrality Theorem",
                "displayTitle": "The Max-Flow Min-Cut Theorem: Three-Way Equivalence Proof & Integrality Theorem",
                "type": "lesson",
                "tags": [
                  "max-flow-min-cut",
                  "duality",
                  "proofs"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Proving |f| ≤ cap(S, T) for any s-t cut, equivalence of zero augmenting paths and saturated min-cuts, and guaranteed integer flows on integer capacities.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "edmonds-karp-shortest-augmenting",
              "title": "Edmonds-Karp Algorithm: BFS Shortest Augmenting Paths & O(V E^2) Monotonic Distance Proof",
              "kind": "lesson",
              "archive": {
                "slug": "edmonds-karp-shortest-augmenting",
                "file": "edmonds-karp-shortest-augmenting.md",
                "title": "Edmonds-Karp Algorithm: BFS Shortest Augmenting Paths & O(V E^2) Monotonic Distance Proof",
                "displayTitle": "Edmonds-Karp Algorithm: BFS Shortest Augmenting Paths & O(V E^2) Monotonic Distance Proof",
                "type": "lesson",
                "tags": [
                  "edmonds-karp",
                  "max-flow",
                  "bfs"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why augmenting along shortest unweighted paths guarantees residual distances δ_f(s, v) never decrease and each edge saturates at most V/2 times.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "dinic-level-graph-blocking-flow",
              "title": "Dinic's Algorithm: BFS Level Graphs, DFS Blocking Flows with Current-Arc Pointer & O(E√V) Unit Networks",
              "kind": "lesson",
              "archive": {
                "slug": "dinic-level-graph-blocking-flow",
                "file": "dinic-level-graph-blocking-flow.md",
                "title": "Dinic's Algorithm: BFS Level Graphs, DFS Blocking Flows with Current-Arc Pointer & O(E√V) Unit Networks",
                "displayTitle": "Dinic's Algorithm: BFS Level Graphs, DFS Blocking Flows with Current-Arc Pointer & O(E√V) Unit Networks",
                "type": "lesson",
                "tags": [
                  "dinic",
                  "blocking-flow",
                  "max-flow"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Saturating an entire level graph in O(VE) via dead-end pointer pruning (ptr[u]), achieving O(V^2 E) general and O(E√V) on unit-capacity networks.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "push-relabel-preflow",
              "title": "Push-Relabel (Goldberg-Tarjan): Preflows, Height Functions & Highest-Label Selection",
              "kind": "lesson",
              "archive": {
                "slug": "push-relabel-preflow",
                "file": "push-relabel-preflow.md",
                "title": "Push-Relabel (Goldberg-Tarjan): Preflows, Height Functions & Highest-Label Selection",
                "displayTitle": "Push-Relabel (Goldberg-Tarjan): Preflows, Height Functions & Highest-Label Selection",
                "type": "lesson",
                "tags": [
                  "push-relabel",
                  "goldberg-tarjan",
                  "max-flow"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Relaxing flow conservation during execution: excess nodes, valid height labels h(s) = V, admissible pushes, and O(V^2 √E) highest-label discharge.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "bipartite-matching-hopcroft-karp",
              "title": "Maximum Bipartite Matching: König's Theorem, Hall's Marriage Theorem & Hopcroft-Karp O(E√V)",
              "kind": "lesson",
              "archive": {
                "slug": "bipartite-matching-hopcroft-karp",
                "file": "bipartite-matching-hopcroft-karp.md",
                "title": "Maximum Bipartite Matching: König's Theorem, Hall's Marriage Theorem & Hopcroft-Karp O(E√V)",
                "displayTitle": "Maximum Bipartite Matching: König's Theorem, Hall's Marriage Theorem & Hopcroft-Karp O(E√V)",
                "type": "lesson",
                "tags": [
                  "bipartite-matching",
                  "hopcroft-karp",
                  "konig-theorem"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Simultaneous shortest vertex-disjoint augmenting paths, Hall's neighborhood condition |N(S)| ≥ |S|, and deriving Minimum Vertex Cover / Maximum Independent Set.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "weighted-matching-hungarian",
              "title": "Minimum-Weight Bipartite Matching: Kuhn-Munkres (Hungarian Algorithm) & Primal-Dual Potentials",
              "kind": "lesson",
              "archive": {
                "slug": "weighted-matching-hungarian",
                "file": "weighted-matching-hungarian.md",
                "title": "Minimum-Weight Bipartite Matching: Kuhn-Munkres (Hungarian Algorithm) & Primal-Dual Potentials",
                "displayTitle": "Minimum-Weight Bipartite Matching: Kuhn-Munkres (Hungarian Algorithm) & Primal-Dual Potentials",
                "type": "lesson",
                "tags": [
                  "hungarian-algorithm",
                  "assignment-problem",
                  "primal-dual"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Maintaining dual vertex potentials u[i] + v[j] ≤ C[i][j] to augment along tight zero-slack edges in O(N^3) time.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "min-cost-max-flow-mcmf",
              "title": "Minimum-Cost Maximum Flow (MCMF): Successive Shortest Paths with Johnson Potentials",
              "kind": "lesson",
              "archive": {
                "slug": "min-cost-max-flow-mcmf",
                "file": "min-cost-max-flow-mcmf.md",
                "title": "Minimum-Cost Maximum Flow (MCMF): Successive Shortest Paths with Johnson Potentials",
                "displayTitle": "Minimum-Cost Maximum Flow (MCMF): Successive Shortest Paths with Johnson Potentials",
                "type": "lesson",
                "tags": [
                  "mcmf",
                  "min-cost-flow",
                  "johnson-potentials"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Routing flow along minimum-cost augmenting paths without negative-weight Bellman-Ford overhead after the first pass by updating node potentials π(v).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "flow-reductions-project-selection",
              "title": "Network Flow Modeling Patterns: Closure Problem (Project Selection), Circulation with Demands & Image Segmentation",
              "kind": "design",
              "archive": {
                "slug": "flow-reductions-project-selection",
                "file": "flow-reductions-project-selection.md",
                "title": "Network Flow Modeling Patterns: Closure Problem (Project Selection), Circulation with Demands & Image Segmentation",
                "displayTitle": "Network Flow Modeling Patterns: Closure Problem (Project Selection), Circulation with Demands & Image Segmentation",
                "type": "design",
                "tags": [
                  "flow-reductions",
                  "min-cut-modeling",
                  "circulation"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Translating non-obvious optimization problems into s-t min-cuts (open-pit mining / project selection) and lower-bound circulation feasibility.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-dinic-max-flow-engine",
              "title": "Build Lab: Dinic's Maximum Flow, Min-Cut Partitioning & Bipartite Matching Engine",
              "kind": "build",
              "archive": {
                "slug": "build-dinic-max-flow-engine",
                "file": "build-dinic-max-flow-engine.md",
                "title": "Build Lab: Dinic's Maximum Flow, Min-Cut Partitioning & Bipartite Matching Engine",
                "displayTitle": "Build Lab: Dinic's Maximum Flow, Min-Cut Partitioning & Bipartite Matching Engine",
                "type": "build",
                "tags": [
                  "build-lab",
                  "dinic",
                  "max-flow"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Build a production Dinic Max-Flow solver with BFS level graphs, current-arc DFS blocking flows, s-t Min-Cut partition extraction, and bipartite matching.",
                "mermaidCount": 1
              }
            }
          ]
        }
      ]
    },
    {
      "id": "track-6",
      "number": 6,
      "title": "Dynamic Programming, Combinatorial Search & Advanced Paradigms",
      "summary": "Combinatorial generation, backtracking/DLX, greedy exchange & matroid proofs, classical & tree/bitmask/digit DP, CHT/Li Chao/Knuth/WQS optimizations, geometry, number theory, and NP reductions.",
      "hours": 44,
      "modules": [
        {
          "id": "m15",
          "number": "6.1",
          "legacyNumber": "15",
          "title": "Recursion, Backtracking, Pruning & Greedy Exchange Arguments",
          "summary": "Lexicographic permutations, Gray codes, backtracking symmetry pruning, Knuth Algorithm X (DLX), Branch & Bound, Alpha-Beta minimax, greedy exchange proofs, matroids, and SAT solvers.",
          "units": [
            {
              "slug": "combinatorial-generation-permutations",
              "title": "Combinatorial Generation: Subsets, Lexicographic Permutations (Narayana) & Gray Codes",
              "kind": "lesson",
              "archive": {
                "slug": "combinatorial-generation-permutations",
                "file": "combinatorial-generation-permutations.md",
                "title": "Combinatorial Generation: Subsets, Lexicographic Permutations (Narayana) & Gray Codes",
                "displayTitle": "Combinatorial Generation: Subsets, Lexicographic Permutations (Narayana) & Gray Codes",
                "type": "lesson",
                "tags": [
                  "combinatorics",
                  "permutations",
                  "gray-code"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Iterative next_permutation pivot-and-reverse, binary reflected Gray code g = i ^ (i >> 1) single-bit transitions, and Gosper's hack for k-bit subsets.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "backtracking-state-space-trees",
              "title": "Backtracking Architecture: Choice, Constraint, Undo & Symmetry-Breaking Pruning",
              "kind": "lesson",
              "archive": {
                "slug": "backtracking-state-space-trees",
                "file": "backtracking-state-space-trees.md",
                "title": "Backtracking Architecture: Choice, Constraint, Undo & Symmetry-Breaking Pruning",
                "displayTitle": "Backtracking Architecture: Choice, Constraint, Undo & Symmetry-Breaking Pruning",
                "type": "lesson",
                "tags": [
                  "backtracking",
                  "pruning",
                  "constraint-satisfaction"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Structuring exact search trees with O(1) incremental state undo, canonical ordering to eliminate isomorphic permutations, and Minimum Remaining Values (MRV).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "exact-cover-knuth-algorithm-x",
              "title": "Exact Cover & Knuth's Algorithm X with Dancing Links (DLX)",
              "kind": "lesson",
              "archive": {
                "slug": "exact-cover-knuth-algorithm-x",
                "file": "exact-cover-knuth-algorithm-x.md",
                "title": "Exact Cover & Knuth's Algorithm X with Dancing Links (DLX)",
                "displayTitle": "Exact Cover & Knuth's Algorithm X with Dancing Links (DLX)",
                "type": "lesson",
                "tags": [
                  "dancing-links",
                  "exact-cover",
                  "knuth"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Exploiting x.left.right = x in toroidal doubly-linked sparse matrices to cover and uncover rows/columns in exact Cover, Pentominoes, and Sudoku.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "branch-and-bound-admissible-bounds",
              "title": "Branch and Bound: Best-First / DFS Relaxation Bounds for Combinatorial Optimization",
              "kind": "lesson",
              "archive": {
                "slug": "branch-and-bound-admissible-bounds",
                "file": "branch-and-bound-admissible-bounds.md",
                "title": "Branch and Bound: Best-First / DFS Relaxation Bounds for Combinatorial Optimization",
                "displayTitle": "Branch and Bound: Best-First / DFS Relaxation Bounds for Combinatorial Optimization",
                "type": "lesson",
                "tags": [
                  "branch-and-bound",
                  "optimization",
                  "relaxation"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Pruning suboptimal subtrees using LP/fractional knapsack upper bounds and 1-tree lower bounds before expanding exponential branches.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "minimax-alpha-beta-pruning",
              "title": "Game Trees: Minimax, Alpha-Beta Pruning, Move Ordering & Zobrist Transposition Tables",
              "kind": "lesson",
              "archive": {
                "slug": "minimax-alpha-beta-pruning",
                "file": "minimax-alpha-beta-pruning.md",
                "title": "Game Trees: Minimax, Alpha-Beta Pruning, Move Ordering & Zobrist Transposition Tables",
                "displayTitle": "Game Trees: Minimax, Alpha-Beta Pruning, Move Ordering & Zobrist Transposition Tables",
                "type": "lesson",
                "tags": [
                  "minimax",
                  "alpha-beta",
                  "zobrist-hashing"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Zero-sum game evaluation, why optimal move ordering reduces branching factor from b^d to b^(d/2), iterative deepening, and 64-bit XOR Zobrist hashing.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "greedy-choice-exchange-arguments",
              "title": "Proving Greedy Correctness: Greedy Stays Ahead & Exchange Arguments (Interval Scheduling, Minimizing Lateness)",
              "kind": "lesson",
              "archive": {
                "slug": "greedy-choice-exchange-arguments",
                "file": "greedy-choice-exchange-arguments.md",
                "title": "Proving Greedy Correctness: Greedy Stays Ahead & Exchange Arguments (Interval Scheduling, Minimizing Lateness)",
                "displayTitle": "Proving Greedy Correctness: Greedy Stays Ahead & Exchange Arguments (Interval Scheduling, Minimizing Lateness)",
                "type": "lesson",
                "tags": [
                  "greedy",
                  "exchange-argument",
                  "proofs"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Distinguishing valid greedy choices from plausible traps using structural induction ('greedy stays ahead') and inversion-swapping exchange proofs.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "matroids-greedy-foundations",
              "title": "Matroid Theory: Graphic & Linear Matroids and When the Greedy Algorithm Is Guaranteed Optimal",
              "kind": "lesson",
              "archive": {
                "slug": "matroids-greedy-foundations",
                "file": "matroids-greedy-foundations.md",
                "title": "Matroid Theory: Graphic & Linear Matroids and When the Greedy Algorithm Is Guaranteed Optimal",
                "displayTitle": "Matroid Theory: Graphic & Linear Matroids and When the Greedy Algorithm Is Guaranteed Optimal",
                "type": "lesson",
                "tags": [
                  "matroids",
                  "greedy",
                  "combinatorial-optimization"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Edmonds-Rado Theorem: hereditary systems (E, I) with the exchange property characterize the exact family of subsets where weighted greedy is optimal.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "regret-greedy-heap-rollback",
              "title": "Regret Greedy (Undoable Greedy with Priority Queues): Scheduling with Deadlines & Stock Trading",
              "kind": "design",
              "archive": {
                "slug": "regret-greedy-heap-rollback",
                "file": "regret-greedy-heap-rollback.md",
                "title": "Regret Greedy (Undoable Greedy with Priority Queues): Scheduling with Deadlines & Stock Trading",
                "displayTitle": "Regret Greedy (Undoable Greedy with Priority Queues): Scheduling with Deadlines & Stock Trading",
                "type": "design",
                "tags": [
                  "regret-greedy",
                  "priority-queue",
                  "scheduling"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Making greedy choices tentatively and using a min/max heap to retroactively swap out the worst prior commitment (Moore-Hodgson & Buy-Sell matching).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-sat-solvers-cdcl-dpll",
              "title": "Production Case Study: Modern SAT Solvers & Package Dependency Resolution (DPLL, Unit Propagation & Two-Watched Literals)",
              "kind": "case",
              "archive": {
                "slug": "case-sat-solvers-cdcl-dpll",
                "file": "case-sat-solvers-cdcl-dpll.md",
                "title": "Production Case Study: Modern SAT Solvers & Package Dependency Resolution (DPLL, Unit Propagation & Two-Watched Literals)",
                "displayTitle": "Production Case Study: Modern SAT Solvers & Package Dependency Resolution (DPLL, Unit Propagation & Two-Watched Literals)",
                "type": "case",
                "tags": [
                  "sat-solvers",
                  "cdcl",
                  "package-managers"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "How Chaff/MiniSat and Cargo's PubGrub solver resolve millions of boolean/version constraints via Two-Watched Literals, Unit Propagation, and Conflict-Driven Clause Learning.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-dancing-links-exact-cover",
              "title": "Build Lab: Knuth's Dancing Links (DLX) Exact Cover & Constraint Satisfaction Solver",
              "kind": "build",
              "archive": {
                "slug": "build-dancing-links-exact-cover",
                "file": "build-dancing-links-exact-cover.md",
                "title": "Build Lab: Knuth's Dancing Links (DLX) Exact Cover & Constraint Satisfaction Solver",
                "displayTitle": "Build Lab: Knuth's Dancing Links (DLX) Exact Cover & Constraint Satisfaction Solver",
                "type": "build",
                "tags": [
                  "build-lab",
                  "dancing-links",
                  "exact-cover"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Implement Knuth's toroidal doubly-linked Dancing Links matrix with Minimum Remaining Values (MRV) column selection and exact-cover Sudoku/N-Queens reductions.",
                "mermaidCount": 1
              }
            }
          ]
        },
        {
          "id": "m16",
          "number": "6.2",
          "legacyNumber": "16",
          "title": "Dynamic Programming Foundations & Classical Archetypes",
          "summary": "SRTBOT DAG framework, memoization vs tabulation, rolling arrays, 0/1/Unbounded/Bounded Knapsack, LIS patience sorting, LCS/Edit Distance, Interval DP, Tree rerooting DP, and Knuth-Plass.",
          "units": [
            {
              "slug": "dp-optimal-substructure-dag",
              "title": "Dynamic Programming as Shortest Paths on an Implicit DAG: Optimal Substructure & SRTBOT Framework",
              "kind": "lesson",
              "archive": {
                "slug": "dp-optimal-substructure-dag",
                "file": "dp-optimal-substructure-dag.md",
                "title": "Dynamic Programming as Shortest Paths on an Implicit DAG: Optimal Substructure & SRTBOT Framework",
                "displayTitle": "Dynamic Programming as Shortest Paths on an Implicit DAG: Optimal Substructure & SRTBOT Framework",
                "type": "lesson",
                "tags": [
                  "dynamic-programming",
                  "srtbot",
                  "optimal-substructure"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "MIT 6.006 SRTBOT (Subproblem, Relate, Topological order, Base cases, Original, Time) and why DP requires acyclicity and prefix independence.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "memoization-tabulation-space-rolling",
              "title": "Top-Down Memoization vs Bottom-Up Tabulation & Rolling-Array Space Compression",
              "kind": "lesson",
              "archive": {
                "slug": "memoization-tabulation-space-rolling",
                "file": "memoization-tabulation-space-rolling.md",
                "title": "Top-Down Memoization vs Bottom-Up Tabulation & Rolling-Array Space Compression",
                "displayTitle": "Top-Down Memoization vs Bottom-Up Tabulation & Rolling-Array Space Compression",
                "type": "lesson",
                "tags": [
                  "dynamic-programming",
                  "memoization",
                  "space-optimization"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Reachable-state sparsity in top-down DP vs cache-contiguous loop dependency order and 2-row / 1-row reverse-iteration space reduction.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "knapsack-family-01-unbounded-bounded",
              "title": "The Knapsack Family: 0/1, Unbounded, Subset Sum Bitset & Bounded Knapsack (Binary Splitting / Monotonic Queue)",
              "kind": "lesson",
              "archive": {
                "slug": "knapsack-family-01-unbounded-bounded",
                "file": "knapsack-family-01-unbounded-bounded.md",
                "title": "The Knapsack Family: 0/1, Unbounded, Subset Sum Bitset & Bounded Knapsack (Binary Splitting / Monotonic Queue)",
                "displayTitle": "The Knapsack Family: 0/1, Unbounded, Subset Sum Bitset & Bounded Knapsack (Binary Splitting / Monotonic Queue)",
                "type": "lesson",
                "tags": [
                  "knapsack",
                  "dynamic-programming",
                  "monotonic-queue"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why iterating capacity downward prevents item reuse, O(NW/64) bitset shifts, power-of-2 item bundling, and O(NW) residue-class monotonic queue DP.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "lis-patience-sorting",
              "title": "Longest Increasing Subsequence (LIS): O(N^2) DP vs O(N log N) Patience Sorting & Dilworth's Theorem",
              "kind": "lesson",
              "archive": {
                "slug": "lis-patience-sorting",
                "file": "lis-patience-sorting.md",
                "title": "Longest Increasing Subsequence (LIS): O(N^2) DP vs O(N log N) Patience Sorting & Dilworth's Theorem",
                "displayTitle": "Longest Increasing Subsequence (LIS): O(N^2) DP vs O(N log N) Patience Sorting & Dilworth's Theorem",
                "type": "lesson",
                "tags": [
                  "lis",
                  "patience-sorting",
                  "dilworth-theorem"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Maintaining minimal tail values tails[k] of increasing subsequences of length k+1 via binary search, parent pointer reconstruction, and Dilworth's antichain duality.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "sequence-dp-lcs-levenshtein",
              "title": "Sequence Alignment DP: Longest Common Subsequence (LCS) & Wagner-Fischer Edit Distance",
              "kind": "lesson",
              "archive": {
                "slug": "sequence-dp-lcs-levenshtein",
                "file": "sequence-dp-lcs-levenshtein.md",
                "title": "Sequence Alignment DP: Longest Common Subsequence (LCS) & Wagner-Fischer Edit Distance",
                "displayTitle": "Sequence Alignment DP: Longest Common Subsequence (LCS) & Wagner-Fischer Edit Distance",
                "type": "lesson",
                "tags": [
                  "lcs",
                  "edit-distance",
                  "levenshtein"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Prefix alignment transitions, Damerau adjacent transposition extensions, affine gap penalties, and diagonal banded DP when edit distance k ≪ N.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "interval-dp-matrix-chain-triangulation",
              "title": "Interval DP: Matrix Chain Multiplication, Optimal BST & Polygon Triangulation",
              "kind": "lesson",
              "archive": {
                "slug": "interval-dp-matrix-chain-triangulation",
                "file": "interval-dp-matrix-chain-triangulation.md",
                "title": "Interval DP: Matrix Chain Multiplication, Optimal BST & Polygon Triangulation",
                "displayTitle": "Interval DP: Matrix Chain Multiplication, Optimal BST & Polygon Triangulation",
                "type": "lesson",
                "tags": [
                  "interval-dp",
                  "matrix-chain",
                  "optimal-bst"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Iterating by increasing interval length len = r - l + 1 to solve parenthesization, burst-balloons last-action framing, and minimum-weight triangulation.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "tree-dp-rerooting-technique",
              "title": "DP on Trees: Maximum Independent Set, Subtree Knapsack (O(N^2) Amortized Proof) & All-Roots Rerooting",
              "kind": "design",
              "archive": {
                "slug": "tree-dp-rerooting-technique",
                "file": "tree-dp-rerooting-technique.md",
                "title": "DP on Trees: Maximum Independent Set, Subtree Knapsack (O(N^2) Amortized Proof) & All-Roots Rerooting",
                "displayTitle": "DP on Trees: Maximum Independent Set, Subtree Knapsack (O(N^2) Amortized Proof) & All-Roots Rerooting",
                "type": "design",
                "tags": [
                  "tree-dp",
                  "rerooting",
                  "amortized-analysis"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why merging subtree knapsacks bounded by sz[u] costs O(N^2) total (not O(N^3)) via LCA pair counting, and two-pass prefix/suffix rerooting.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "dag-dp-longest-path-counting",
              "title": "DP on DAGs: Longest Path, Path Counting & Topological State Propagation",
              "kind": "lesson",
              "archive": {
                "slug": "dag-dp-longest-path-counting",
                "file": "dag-dp-longest-path-counting.md",
                "title": "DP on DAGs: Longest Path, Path Counting & Topological State Propagation",
                "displayTitle": "DP on DAGs: Longest Path, Path Counting & Topological State Propagation",
                "type": "lesson",
                "tags": [
                  "dag-dp",
                  "topological-sort",
                  "dynamic-programming"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Why Longest Path is NP-hard on general graphs but O(V+E) on DAGs, push vs pull transitions along Kahn's order, and DAG reachability.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "case-pretty-printing-knuth-plass",
              "title": "Production Case Study: Knuth-Plass Line Breaking in TeX & Code Formatters (prettier, rustfmt)",
              "kind": "case",
              "archive": {
                "slug": "case-pretty-printing-knuth-plass",
                "file": "case-pretty-printing-knuth-plass.md",
                "title": "Production Case Study: Knuth-Plass Line Breaking in TeX & Code Formatters (prettier, rustfmt)",
                "displayTitle": "Production Case Study: Knuth-Plass Line Breaking in TeX & Code Formatters (prettier, rustfmt)",
                "type": "case",
                "tags": [
                  "knuth-plass",
                  "line-breaking",
                  "code-formatters"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "How TeX avoids ugly greedy rivers of whitespace by minimizing cubic badness across entire paragraphs via Dynamic Programming.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-hirschberg-linear-space-diff",
              "title": "Build Lab: Hirschberg's O(NM)-Time O(min(N,M))-Space Sequence Alignment & Diff Reconstructor",
              "kind": "build",
              "archive": {
                "slug": "build-hirschberg-linear-space-diff",
                "file": "build-hirschberg-linear-space-diff.md",
                "title": "Build Lab: Hirschberg's O(NM)-Time O(min(N,M))-Space Sequence Alignment & Diff Reconstructor",
                "displayTitle": "Build Lab: Hirschberg's O(NM)-Time O(min(N,M))-Space Sequence Alignment & Diff Reconstructor",
                "type": "build",
                "tags": [
                  "build-lab",
                  "hirschberg",
                  "diff-engine"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Implement Hirschberg's divide-and-conquer optimal sequence aligner using two-row forward and reverse DP passes to reconstruct full diffs in O(min(N,M)) space.",
                "mermaidCount": 1
              }
            }
          ]
        },
        {
          "id": "m17",
          "number": "6.3",
          "legacyNumber": "17",
          "title": "Advanced DP State Spaces & Algebraic Optimizations",
          "summary": "Bitmask Held-Karp & O(3^N) submasks, SOS DP & FWHT, Digit DP, Broken-Profile DP, D&C Quadrangle Inequality, Knuth Optimization, CHT & Li Chao Tree, Aliens Trick (WQS), and Tropical Matrices.",
          "units": [
            {
              "slug": "bitmask-dp-tsp-hamiltonian",
              "title": "Bitmask DP: Held-Karp O(N^2 2^N) Traveling Salesperson & Submask Enumeration (O(3^N) Proof)",
              "kind": "lesson",
              "archive": {
                "slug": "bitmask-dp-tsp-hamiltonian",
                "file": "bitmask-dp-tsp-hamiltonian.md",
                "title": "Bitmask DP: Held-Karp O(N^2 2^N) Traveling Salesperson & Submask Enumeration (O(3^N) Proof)",
                "displayTitle": "Bitmask DP: Held-Karp O(N^2 2^N) Traveling Salesperson & Submask Enumeration (O(3^N) Proof)",
                "type": "lesson",
                "tags": [
                  "bitmask-dp",
                  "tsp",
                  "held-karp"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Encoding visited subsets as N-bit integers, binomial proof that iterating sub = (sub - 1) & mask across all masks takes exactly 3^N steps, and Steiner trees.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "sos-dp-fast-zeta-mobius",
              "title": "Sum Over Subsets (SOS) DP & Fast Walsh-Hadamard Transform (FWHT) for Bitwise Convolutions",
              "kind": "lesson",
              "archive": {
                "slug": "sos-dp-fast-zeta-mobius",
                "file": "sos-dp-fast-zeta-mobius.md",
                "title": "Sum Over Subsets (SOS) DP & Fast Walsh-Hadamard Transform (FWHT) for Bitwise Convolutions",
                "displayTitle": "Sum Over Subsets (SOS) DP & Fast Walsh-Hadamard Transform (FWHT) for Bitwise Convolutions",
                "type": "lesson",
                "tags": [
                  "sos-dp",
                  "zeta-transform",
                  "fwht"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Replacing O(3^N) submask enumeration with O(N 2^N) bit-by-bit prefix dimension accumulation and computing OR/AND/XOR array convolutions via FWHT.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "digit-dp-lexicographic-automata",
              "title": "Digit DP: Counting Constrained Integers in [L, R] via Tight/Leading-Zero State Automata",
              "kind": "design",
              "archive": {
                "slug": "digit-dp-lexicographic-automata",
                "file": "digit-dp-lexicographic-automata.md",
                "title": "Digit DP: Counting Constrained Integers in [L, R] via Tight/Leading-Zero State Automata",
                "displayTitle": "Digit DP: Counting Constrained Integers in [L, R] via Tight/Leading-Zero State Automata",
                "type": "design",
                "tags": [
                  "digit-dp",
                  "automata",
                  "counting"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Evaluating f(R) - f(L-1) digit-by-digit with state (pos, tight, started, customState) to count 10^18-range integers in 18 iterations.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "broken-profile-dp-grid-tiling",
              "title": "Broken Profile (Plug) DP: Domino Tilings & Grid Connectivity in O(N M 2^M)",
              "kind": "lesson",
              "archive": {
                "slug": "broken-profile-dp-grid-tiling",
                "file": "broken-profile-dp-grid-tiling.md",
                "title": "Broken Profile (Plug) DP: Domino Tilings & Grid Connectivity in O(N M 2^M)",
                "displayTitle": "Broken Profile (Plug) DP: Domino Tilings & Grid Connectivity in O(N M 2^M)",
                "type": "lesson",
                "tags": [
                  "broken-profile-dp",
                  "grid-tiling",
                  "dynamic-programming"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Advancing a jagged cell-by-cell boundary frontline of M+1 bits instead of full column-to-column transitions to reduce O(N 4^M) to O(N M 2^M).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "divide-and-conquer-dp-quadrangle",
              "title": "Divide-and-Conquer DP Optimization & Quadrangle Inequality (Monge Matrices)",
              "kind": "lesson",
              "archive": {
                "slug": "divide-and-conquer-dp-quadrangle",
                "file": "divide-and-conquer-dp-quadrangle.md",
                "title": "Divide-and-Conquer DP Optimization & Quadrangle Inequality (Monge Matrices)",
                "displayTitle": "Divide-and-Conquer DP Optimization & Quadrangle Inequality (Monge Matrices)",
                "type": "lesson",
                "tags": [
                  "dc-dp-optimization",
                  "quadrangle-inequality",
                  "monge"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "When cost C(l, r) satisfies C(a, c) + C(b, d) ≤ C(a, d) + C(b, c), optimal split points opt(k, i) ≤ opt(k, i+1) are monotonic, reducing O(K N^2) to O(K N log N).",
                "mermaidCount": 1
              }
            },
            {
              "slug": "knuth-optimization-optimal-bst",
              "title": "Knuth-Yao Optimization: Reducing Interval DP from O(N^3) to O(N^2)",
              "kind": "lesson",
              "archive": {
                "slug": "knuth-optimization-optimal-bst",
                "file": "knuth-optimization-optimal-bst.md",
                "title": "Knuth-Yao Optimization: Reducing Interval DP from O(N^3) to O(N^2)",
                "displayTitle": "Knuth-Yao Optimization: Reducing Interval DP from O(N^3) to O(N^2)",
                "type": "lesson",
                "tags": [
                  "knuth-optimization",
                  "optimal-bst",
                  "interval-dp"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Using opt(l, r-1) ≤ opt(l, r) ≤ opt(l+1, r) telescoping bounds to compute Optimal Binary Search Trees and Order-Preserving Huffman codes in quadratic time.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "convex-hull-trick-li-chao-tree",
              "title": "Convex Hull Trick (CHT) & Li Chao Segment Tree: Optimizing dp[i] = min_j (m_j x_i + b_j)",
              "kind": "lesson",
              "archive": {
                "slug": "convex-hull-trick-li-chao-tree",
                "file": "convex-hull-trick-li-chao-tree.md",
                "title": "Convex Hull Trick (CHT) & Li Chao Segment Tree: Optimizing dp[i] = min_j (m_j x_i + b_j)",
                "displayTitle": "Convex Hull Trick (CHT) & Li Chao Segment Tree: Optimizing dp[i] = min_j (m_j x_i + b_j)",
                "type": "lesson",
                "tags": [
                  "convex-hull-trick",
                  "li-chao-tree",
                  "dp-optimization"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Rewriting quadratic recurrences into linear functions y = m_j x + b_j and querying the lower envelope via monotonic deque slopes or dynamic Li Chao segment trees.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "aliens-trick-wqs-binary-search",
              "title": "Aliens Trick (WQS Binary Search / Lagrangian Relaxation): Removing Cardinality Constraints",
              "kind": "lesson",
              "archive": {
                "slug": "aliens-trick-wqs-binary-search",
                "file": "aliens-trick-wqs-binary-search.md",
                "title": "Aliens Trick (WQS Binary Search / Lagrangian Relaxation): Removing Cardinality Constraints",
                "displayTitle": "Aliens Trick (WQS Binary Search / Lagrangian Relaxation): Removing Cardinality Constraints",
                "type": "lesson",
                "tags": [
                  "aliens-trick",
                  "wqs-binary-search",
                  "lagrangian"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Eliminating the 'choose at most K items' DP dimension on convex/concave objectives by binary searching a per-item penalty λ.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "matrix-exponentiation-linear-recurrences",
              "title": "Matrix Exponentiation & Min-Plus (Tropical) Semiring Matrix Multiplication for Fixed-Length Paths",
              "kind": "lesson",
              "archive": {
                "slug": "matrix-exponentiation-linear-recurrences",
                "file": "matrix-exponentiation-linear-recurrences.md",
                "title": "Matrix Exponentiation & Min-Plus (Tropical) Semiring Matrix Multiplication for Fixed-Length Paths",
                "displayTitle": "Matrix Exponentiation & Min-Plus (Tropical) Semiring Matrix Multiplication for Fixed-Length Paths",
                "type": "lesson",
                "tags": [
                  "matrix-exponentiation",
                  "tropical-semiring",
                  "linear-recurrence"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Accelerating 1D DP transitions from O(N) to O(K^3 log N) via companion matrix binary exponentiation over (+, ×) and (min, +) semirings.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-li-chao-convex-hull-dp",
              "title": "Build Lab: Dynamic Li Chao Tree & Monotonic Convex Hull Trick Optimizer",
              "kind": "build",
              "archive": {
                "slug": "build-li-chao-convex-hull-dp",
                "file": "build-li-chao-convex-hull-dp.md",
                "title": "Build Lab: Dynamic Li Chao Tree & Monotonic Convex Hull Trick Optimizer",
                "displayTitle": "Build Lab: Dynamic Li Chao Tree & Monotonic Convex Hull Trick Optimizer",
                "type": "build",
                "tags": [
                  "build-lab",
                  "li-chao-tree",
                  "convex-hull-trick"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Implement both a monotonic-slope Convex Hull Trick deque and a dynamic Sparse Li Chao Segment Tree over [-10^9, 10^9] for O(N log X) DP optimization.",
                "mermaidCount": 1
              }
            }
          ]
        },
        {
          "id": "m18",
          "number": "6.4",
          "legacyNumber": "18",
          "title": "Computational Geometry, Number Theory, Randomized & Approximation Algorithms",
          "summary": "CCW orientation predicates, Graham/Andrew Convex Hull, Rotating Calipers, Bentley-Ottmann sweep line, k-d/R-trees, Extended GCD/CRT, Miller-Rabin/Pollard-ρ, Karger Min-Cut, NP reductions, and FPTAS.",
          "units": [
            {
              "slug": "geometry-primitives-orientation-ccw",
              "title": "Robust Computational Geometry Primitives: 2D Cross/Dot Products, CCW Orientation & Segment Intersection",
              "kind": "lesson",
              "archive": {
                "slug": "geometry-primitives-orientation-ccw",
                "file": "geometry-primitives-orientation-ccw.md",
                "title": "Robust Computational Geometry Primitives: 2D Cross/Dot Products, CCW Orientation & Segment Intersection",
                "displayTitle": "Robust Computational Geometry Primitives: 2D Cross/Dot Products, CCW Orientation & Segment Intersection",
                "type": "lesson",
                "tags": [
                  "computational-geometry",
                  "cross-product",
                  "ccw"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Exact integer signed area determinants, collinear bounding-box checks, ray-casting point-in-polygon, and avoiding IEEE-754 catastrophic cancellation.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "convex-hull-graham-andrew",
              "title": "2D Convex Hull: Graham Scan vs Andrew's Monotone Chain & Rotating Calipers",
              "kind": "lesson",
              "archive": {
                "slug": "convex-hull-graham-andrew",
                "file": "convex-hull-graham-andrew.md",
                "title": "2D Convex Hull: Graham Scan vs Andrew's Monotone Chain & Rotating Calipers",
                "displayTitle": "2D Convex Hull: Graham Scan vs Andrew's Monotone Chain & Rotating Calipers",
                "type": "lesson",
                "tags": [
                  "convex-hull",
                  "monotone-chain",
                  "rotating-calipers"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Constructing lower and upper convex hulls without trigonometric atan2 via Andrew's lexicographic sort, and finding farthest point pairs in O(N) via Rotating Calipers.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "sweep-line-bentley-ottmann",
              "title": "Sweep-Line Paradigm: Bentley-Ottmann Segment Intersection & Area of Union of Rectangles",
              "kind": "lesson",
              "archive": {
                "slug": "sweep-line-bentley-ottmann",
                "file": "sweep-line-bentley-ottmann.md",
                "title": "Sweep-Line Paradigm: Bentley-Ottmann Segment Intersection & Area of Union of Rectangles",
                "displayTitle": "Sweep-Line Paradigm: Bentley-Ottmann Segment Intersection & Area of Union of Rectangles",
                "type": "lesson",
                "tags": [
                  "sweep-line",
                  "bentley-ottmann",
                  "rectangle-union"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Reducing 2D static geometry to 1D dynamic event processing: active status BSTs for O((N+I) log N) segment intersections and Segment Tree coordinate-compressed rectangle union.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "spatial-indexing-kd-quad-rtrees",
              "title": "Multidimensional Spatial Indexing: k-d Trees, Quadtrees, R-Trees & Z-Order (Morton) Curves",
              "kind": "lesson",
              "archive": {
                "slug": "spatial-indexing-kd-quad-rtrees",
                "file": "spatial-indexing-kd-quad-rtrees.md",
                "title": "Multidimensional Spatial Indexing: k-d Trees, Quadtrees, R-Trees & Z-Order (Morton) Curves",
                "displayTitle": "Multidimensional Spatial Indexing: k-d Trees, Quadtrees, R-Trees & Z-Order (Morton) Curves",
                "type": "lesson",
                "tags": [
                  "kd-tree",
                  "r-tree",
                  "spatial-indexing"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Alternating hyperplane splits in k-d trees, bounding-box branch-and-bound nearest-neighbor pruning, R-tree minimum bounding rectangles, and Morton bit interleaving.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "modular-arithmetic-gcd-crt",
              "title": "Algorithmic Number Theory: Extended Euclidean Algorithm, Modular Inverse, CRT & Sieve of Eratosthenes",
              "kind": "lesson",
              "archive": {
                "slug": "modular-arithmetic-gcd-crt",
                "file": "modular-arithmetic-gcd-crt.md",
                "title": "Algorithmic Number Theory: Extended Euclidean Algorithm, Modular Inverse, CRT & Sieve of Eratosthenes",
                "displayTitle": "Algorithmic Number Theory: Extended Euclidean Algorithm, Modular Inverse, CRT & Sieve of Eratosthenes",
                "type": "lesson",
                "tags": [
                  "number-theory",
                  "extended-gcd",
                  "chinese-remainder-theorem"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Bézout coefficients ax + by = gcd(a,b), Fermat vs Extended GCD modular inverses, Garner's Chinese Remainder reconstruction, and O(N) linear prime sieve.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "primality-miller-rabin-pollard-rho",
              "title": "Randomized Number Theory: Miller-Rabin Primality Testing & Pollard's ρ Integer Factorization",
              "kind": "lesson",
              "archive": {
                "slug": "primality-miller-rabin-pollard-rho",
                "file": "primality-miller-rabin-pollard-rho.md",
                "title": "Randomized Number Theory: Miller-Rabin Primality Testing & Pollard's ρ Integer Factorization",
                "displayTitle": "Randomized Number Theory: Miller-Rabin Primality Testing & Pollard's ρ Integer Factorization",
                "type": "lesson",
                "tags": [
                  "miller-rabin",
                  "pollard-rho",
                  "primality"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Eliminating Carmichael pseudoprimes via non-trivial square roots of unity, deterministic 64-bit witness bases, and Pollard's ρ O(N^(1/4)) Birthday-Paradox cycle detector.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "las-vegas-monte-carlo-karger",
              "title": "Las Vegas vs Monte Carlo Algorithms: Karger's Randomized Min-Cut & Freivalds' Matrix Verification",
              "kind": "lesson",
              "archive": {
                "slug": "las-vegas-monte-carlo-karger",
                "file": "las-vegas-monte-carlo-karger.md",
                "title": "Las Vegas vs Monte Carlo Algorithms: Karger's Randomized Min-Cut & Freivalds' Matrix Verification",
                "displayTitle": "Las Vegas vs Monte Carlo Algorithms: Karger's Randomized Min-Cut & Freivalds' Matrix Verification",
                "type": "lesson",
                "tags": [
                  "randomized-algorithms",
                  "karger-min-cut",
                  "monte-carlo"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Distinguishing zero-error Las Vegas from bounded-error Monte Carlo, probability amplification, Karger's Ω(1/n^2) random edge contraction, and O(N^2) matrix product verification.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "np-completeness-reductions",
              "title": "P, NP, NP-Hardness & Polynomial-Time Reductions (3-SAT ≤p Independent Set ≤p Vertex Cover ≤p Subset Sum)",
              "kind": "lesson",
              "archive": {
                "slug": "np-completeness-reductions",
                "file": "np-completeness-reductions.md",
                "title": "P, NP, NP-Hardness & Polynomial-Time Reductions (3-SAT ≤p Independent Set ≤p Vertex Cover ≤p Subset Sum)",
                "displayTitle": "P, NP, NP-Hardness & Polynomial-Time Reductions (3-SAT ≤p Independent Set ≤p Vertex Cover ≤p Subset Sum)",
                "type": "lesson",
                "tags": [
                  "np-completeness",
                  "reductions",
                  "complexity-theory"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Cook-Levin theorem, Karp's 21 reductions, recognizing disguised NP-hard problems in production, and pseudo-polynomial vs strongly NP-complete bounds.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "approximation-algorithms-fptas",
              "title": "Approximation Algorithms: 2-Approx Vertex Cover, Greedy ln N Set Cover, Metric TSP & Knapsack FPTAS",
              "kind": "lesson",
              "archive": {
                "slug": "approximation-algorithms-fptas",
                "file": "approximation-algorithms-fptas.md",
                "title": "Approximation Algorithms: 2-Approx Vertex Cover, Greedy ln N Set Cover, Metric TSP & Knapsack FPTAS",
                "displayTitle": "Approximation Algorithms: 2-Approx Vertex Cover, Greedy ln N Set Cover, Metric TSP & Knapsack FPTAS",
                "type": "lesson",
                "tags": [
                  "approximation-algorithms",
                  "fptas",
                  "vertex-cover"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Proving worst-case approximation ratios ρ: maximal matching 2-approx Vertex Cover, Christofides 1.5-approx Metric TSP, and value-scaled O(N^3 / ε) Knapsack FPTAS.",
                "mermaidCount": 1
              }
            },
            {
              "slug": "build-kd-tree-nearest-neighbor",
              "title": "Build Lab: 2D/3D k-d Tree with Bounding-Box Pruning for K-Nearest Neighbor & Range Search",
              "kind": "build",
              "archive": {
                "slug": "build-kd-tree-nearest-neighbor",
                "file": "build-kd-tree-nearest-neighbor.md",
                "title": "Build Lab: 2D/3D k-d Tree with Bounding-Box Pruning for K-Nearest Neighbor & Range Search",
                "displayTitle": "Build Lab: 2D/3D k-d Tree with Bounding-Box Pruning for K-Nearest Neighbor & Range Search",
                "type": "build",
                "tags": [
                  "build-lab",
                  "kd-tree",
                  "nearest-neighbor"
                ],
                "sources": [
                  "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
                  "https://algs4.cs.princeton.edu/home/",
                  "https://cp-algorithms.com/"
                ],
                "created": "2026-05-14",
                "updated": "2026-10-23",
                "wordCount": 1400,
                "excerpt": "Implement a balanced static and dynamic k-d Tree supporting orthogonal bounding-box range queries and branch-and-bound K-Nearest Neighbor (k-NN) search.",
                "mermaidCount": 1
              }
            }
          ]
        }
      ]
    }
  ]
};
