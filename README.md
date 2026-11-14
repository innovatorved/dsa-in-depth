# DSA In Depth

Open-source interactive curriculum for data structures, hardware cache hierarchy, and algorithmic invariants — running entirely in the browser with 69 visual simulators and a WebAssembly C++20/TypeScript coding workbench, zero backend servers, and zero sign-ups.

**Live site:** [https://dsa-in-depth.vedgupta.in](https://dsa-in-depth.vedgupta.in)

---

## Highlights

- **Hardware-Grounded First Principles**: Connects asymptotic analysis (`O`, `Ω`, `Θ`, Akra-Bazzi, amortized potential `Φ`) to actual 64-byte CPU cache lines, branch mispredictions, SIMD probing, and pointer-chasing latency.
- **69 Interactive Step Simulators**: Step through Robin Hood & SwissTable probing, Red-Black / LLRB rotations, segment tree lazy propagation, Aho-Corasick failure links, Dijkstra/A* frontiers, and Dinic blocking flows.
- **180 Guided Algorithm Labs & 22 From-Scratch Builds**: Progressive 3-step C++20 coding practice on every topic, plus 22 multi-file capstone data structure and algorithm implementations powered by [`@innovatorved/code-lab`](https://github.com/innovatorved/code-lab) (`v0.4.0`).
- **Primary-Source Citations**: Every unit cites peer-reviewed papers, canonical textbooks (CLRS, Knuth TAOCP, Sedgewick, Erickson, Tarjan), and production systems (`hashbrown`, Linux `rbtree`, V8, `ripgrep`, Git Myers diff).

---

## Curriculum Overview

| Track | Modules | Focus |
| :--- | :--- | :--- |
| **1. Foundations, Memory Hierarchy & Linear Structures** | 1.1 – 1.3 | CPU cache hierarchy, recurrences, amortized potential, dynamic arrays, bit manipulation, skip lists, and LRU/LFU |
| **2. Hashing, Sorting & Divide-and-Conquer** | 2.1 – 2.3 | Universal hashing, Robin Hood & SwissTable, probabilistic sketches, hybrid TimSort/IntroSort, binary search invariants, and FFT |
| **3. Trees, Balanced Hierarchies & Range Queries** | 3.1 – 3.3 | Traversals, d-ary/mergeable heaps, AVL/LLRB/treaps/splay/B+Trees, Fenwick, lazy/persistent segment trees, and HLD |
| **4. Strings, Automata & Information Retrieval** | 4.1 – 4.2 | Radix tries, KMP, Z-box, SIMD Boyer-Moore, Aho-Corasick, suffix arrays/automata, FM-index, Thompson NFA, and Myers diff |
| **5. Graph Theory, Shortest Paths & Network Flow** | 5.1 – 5.3 | CSR cache layout, Tarjan SCC & 2-SAT, DSU rollback, Dijkstra/A*/Johnson, Dinic max-flow, Hopcroft-Karp, and MCMF |
| **6. Dynamic Programming, Search & Advanced Paradigms** | 6.1 – 6.4 | Knuth DLX, matroids, classical/tree/SOS/digit DP, Convex Hull Trick / Li Chao, WQS Aliens trick, geometry, and randomized algorithms |

---

## Local Development

```bash
npm install
npm run serve              # Serve locally at http://localhost:8000
```

### Verification & Static Build Commands

```bash
npm run og                 # Generate 1200x630 Open Graph PNG social cards
npm run prerender          # Regenerate static HTML pages and sitemap.xml
npm run stamp              # Update content-addressed ?v= asset hashes and js/manifest.js
npm test                   # Validate curriculum schema, citations, links, and rendered HTML
npm run build              # Minify and assemble production output into dist/
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design details and [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

---

## Related Projects

- **[SQL In Depth](https://sql-in-depth.vedgupta.in)** — Relational algebra, query execution plans, B+Tree storage internals, and browser WASM SQLite 3 + PostgreSQL 18 studio ([repo](https://github.com/innovatorved/sql-in-depth))
- **[System Design In Depth](https://system-design-in-depth.vedgupta.in)** — Interactive distributed systems curriculum, architecture canvas, and failure simulations ([repo](https://github.com/innovatorved/system-design-in-depth))
- **[@innovatorved/code-lab](https://code-lab.vedgupta.in)** — Browser-native IDE workbench, Web Worker runtime, and POSIX shell ([repo](https://github.com/innovatorved/code-lab))

---

## License

- **Code, Simulators & Tooling**: [MIT License](./LICENSE)
- **Written Curriculum & Guides**: [Creative Commons Attribution 4.0 International (CC BY 4.0)](./LICENSE)

© [Ved Gupta](https://vedgupta.in)
