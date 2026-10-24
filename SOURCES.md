# Master Canonical Bibliography & Source Registry (`SOURCES.md`)

> [!CAUTION]
> **Strict Primary-Source Policy**: Every unit, asymptotic proof sketch, hardware latency claim, complexity table, and production case study in **DSA In Depth** must be grounded exclusively in the authoritative sources listed below. SEO content farms (GeeksforGeeks, Medium blogs, W3Schools, Baeldung, Tutorialspoint, Programiz, Javatpoint) are strictly prohibited and rejected by `node tools/validate.js`.

---

## 1. Canonical Textbooks (Tier-1 Primary Foundations)

1. **CLRS** — Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein, *Introduction to Algorithms* (4th Edition, MIT Press, 2022) — <https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/>
   - Primary source for pseudocode conventions, loop invariants, recurrence proofs (Master Theorem, Akra-Bazzi), amortized analysis (aggregate, accounting, and physicist's potential $\Phi$), Red-Black trees, B-Trees, Dynamic Programming, and Graph algorithms.
2. **Sedgewick & Wayne** — Robert Sedgewick & Kevin Wayne, *Algorithms* (4th Edition, Addison-Wesley) — <https://algs4.cs.princeton.edu/home/>
   - Primary source for concrete implementations, Left-Leaning Red-Black (LLRB) trees, 3-way Quicksort, MSD/LSD Radix sorts, Indexed Priority Queues (`IndexMinPQ`), Union-Find, and graph structures.
3. **Knuth TAOCP** — Donald E. Knuth, *The Art of Computer Programming*, Volumes 1–4B (Addison-Wesley) — <https://www-cs-faculty.stanford.edu/~knuth/taocp.html>
   - Primary source for exact mathematical analysis of algorithms, bitwise tricks and combinatorial generation (Vol. 4A), exact cover and Dancing Links (Vol. 4B), open addressing and multiplicative hashing (Vol. 3), and sorting networks (Vol. 3).
4. **Skiena** — Steven S. Skiena, *The Algorithm Design Manual* (3rd Edition, Springer, 2020) — <https://www.algorist.com/>
   - Primary source for combinatorial search, backtracking pruning, heuristic design, and real-world problem reductions ("War Stories").
5. **Dasgupta, Papadimitriou, Vazirani (DPV)** — Sanjoy Dasgupta, Christos H. Papadimitriou, Umesh V. Vazirani, *Algorithms* (McGraw-Hill) — <https://people.eecs.berkeley.edu/~vazirani/algorithms.html>
   - Primary source for clean divide-and-conquer FFT, DAG dynamic programming, linear programming reductions, NP-completeness, and approximation algorithms.
6. **Kleinberg & Tardos** — Jon Kleinberg & Éva Tardos, *Algorithm Design* (Pearson) — <https://www.cs.princeton.edu/~wayne/kleinberg-tardos/>
   - Primary source for exchange arguments in greedy algorithms, network flow / min-cut duality, circulation with demands, and dynamic programming formulation.
7. **CP-Algorithms (e-maxx)** — *Algorithms for Competitive Programming* — <https://cp-algorithms.com/>
   - Primary reference for Segment Trees, Fenwick Trees (BIT), Sparse Tables, Heavy-Light Decomposition, Suffix Automata, Aho-Corasick, Dinic's algorithm, 0-1 BFS, and Convex Hull Trick / Li Chao Trees.
8. **Open Data Structures** — Pat Morin, *Open Data Structures* — <https://opendatastructures.org/>
   - Primary open-access reference for Skiplists, Treaps, Scapegoat trees, B-Trees, `ArrayDeque`, and cache-conscious array structures.
9. **Purely Functional Data Structures** — Chris Okasaki (Cambridge University Press, 1998) — <https://www.cs.cmu.edu/~rwh/theses/okasaki.pdf>
   - Primary source for persistent data structures, path copying, fat nodes, and amortized functional queues/deques.
10. **Erickson** — Jeff Erickson, *Algorithms* (UIUC, 2019) — <https://jeffe.cs.illinois.edu/teaching/algorithms/>
    - Primary open-access textbook for recursion, backtracking, dynamic programming, greedy algorithms, and maximum flow.
11. **Hacker's Delight** — Henry S. Warren Jr., *Hacker's Delight* (2nd Edition, Addison-Wesley, 2012)
    - Primary source for two's-complement identities, SWAR word-level parallelism, popcount, and branchless bitwise manipulation.
12. **Computational Geometry** — Mark de Berg, Otfried Cheong, Marc van Kreveld, Mark Overmars, *Computational Geometry: Algorithms and Applications* (3rd Edition, Springer)
    - Primary source for CCW orientation predicates, monotone chain convex hulls, Bentley-Ottmann sweep-line segment intersection, and $k$-d / R-trees.

---

## 2. Seminal Peer-Reviewed Papers

### Asymptotics, Memory Hierarchy & Amortized Complexity
- **Akra & Bazzi (1998)** — Mohamad Akra & Louay Bazzi, *"On the solution of linear recurrence equations"*, Computational Optimization and Applications — <https://doi.org/10.1023/A:1018373005182>
- **Leighton (1996)** — Tom Leighton, *"Notes on Better Master Theorems for Divide-and-Conquer Recurrences"*, MIT 6.046J Course Notes — <https://courses.csail.mit.edu/6.046/spring02/handouts/akrabazzi.pdf>
- **Tarjan (1985)** — Robert Endre Tarjan, *"Amortized Computational Complexity"*, SIAM Journal on Algebraic and Discrete Methods — <https://doi.org/10.1137/0606031>
- **Frigo, Leiserson, Prokop, Ramachandran (1999)** — *"Cache-Oblivious Algorithms"*, IEEE FOCS — <https://doi.org/10.1109/SFFCS.1999.814600>
- **Drepper (2007)** — Ulrich Drepper, *"What Every Programmer Should Know About Memory"* — <https://people.freebsd.org/~lstewart/articles/cpumemory.pdf>
- **Khuong & Morin (2017)** — Paul-Virak Khuong & Pat Morin, *"Array Layouts for Comparison-Based Searching"*, ACM JEA — <https://arxiv.org/abs/1509.05053>

### Hashing & Probabilistic Data Structures
- **Carter & Wegman (1979)** — J. Lawrence Carter & Mark N. Wegman, *"Universal Classes of Hash Functions"*, JCSS — <https://doi.org/10.1016/0022-0000(79)90044-8>
- **Celis, Larson, Monroe (1985)** — Pedro Celis, Per-Åke Larson, J. Ian Munro, *"Robin Hood Hashing"*, IEEE FOCS — <https://cs.uwaterloo.ca/research/tr/1986/CS-86-14.pdf>
- **Pagh & Rodler (2004)** — Rasmus Pagh & Flemming Friche Rodler, *"Cuckoo Hashing"*, Journal of Algorithms — <https://doi.org/10.1016/j.jalgor.2003.12.002>
- **Crosby & Wallach (2003)** — Scott A. Crosby & Dan S. Wallach, *"Denial of Service via Algorithmic Complexity Attacks"*, USENIX Security — <https://www.usenix.org/conference/12th-usenix-security-symposium/denial-service-algorithmic-complexity-attacks>
- **Aumasson & Bernstein (2012)** — Jean-Philippe Aumasson & Daniel J. Bernstein, *"SipHash: a fast short-input PRF"*, INDOCRYPT — <https://cr.yp.to/siphash/siphash-20120918.pdf>
- **Karger et al. (1997)** — David Karger et al., *"Consistent Hashing and Random Trees"*, ACM STOC — <https://doi.org/10.1145/258533.258660>
- **Bloom (1970)** — Burton H. Bloom, *"Space/Time Trade-offs in Hash Coding with Allowable Errors"*, CACM — <https://doi.org/10.1145/362686.362692>
- **Fan, Andersen, Kaminsky, Mitzenmacher (2014)** — *"Cuckoo Filter: Practically Better Than Bloom"*, ACM CoNEXT — <https://doi.org/10.1145/2674005.2674994>
- **Graf & Lemire (2020)** — Thomas Mueller Graf & Daniel Lemire, *"Xor Filters: Faster and Smaller Than Bloom and Cuckoo Filters"*, ACM JEA — <https://arxiv.org/abs/1912.08258>
- **Cormode & Muthukrishnan (2005)** — Graham Cormode & S. Muthukrishnan, *"An improved data stream summary: the count-min sketch and its applications"*, Journal of Algorithms — <https://doi.org/10.1016/j.jalgor.2003.12.001>
- **Flajolet, Fusy, Gandouet, Meunier (2007)** — *"HyperLogLog: the analysis of a near-optimal cardinality estimation algorithm"*, DMTCS — <https://algo.inria.fr/flajolet/Publications/FlFuGaMe07.pdf>

### Sorting, Selection & Divide-and-Conquer
- **Hoare (1961)** — C. A. R. Hoare, *"Algorithm 64: Quicksort"* & *"Algorithm 65: Find"*, CACM — <https://doi.org/10.1145/366622.366644>
- **Bentley & McIlroy (1993)** — Jon L. Bentley & M. Douglas McIlroy, *"Engineering a Sort Function"*, Software: Practice and Experience — <https://doi.org/10.1002/spe.4380231105>
- **Musser (1997)** — David R. Musser, *"Introspective Sorting and Selection Algorithms"*, Software: Practice and Experience — <https://doi.org/10.1002/(SICI)1097-024X(199708)27:8%3C983::AID-SPE117%3E3.0.CO;2-%23>
- **Peters (2002)** — Tim Peters, *"Timsort Description"*, CPython Repository — <https://github.com/python/cpython/blob/main/Objects/listsort.txt>
- **Peters (2021)** — Orson Peters, *"Pattern-Defeating Quicksort"*, arXiv — <https://arxiv.org/abs/2106.05123>
- **Blum, Floyd, Pratt, Rivest, Tarjan (1973)** — *"Time bounds for selection"* (BFPRT), JCSS — <https://doi.org/10.1016/S0022-0000(73)80033-9>
- **Cooley & Tukey (1965)** — James W. Cooley & John W. Tukey, *"An algorithm for the machine calculation of complex Fourier series"*, Math. Comp. — <https://doi.org/10.1090/S0025-5718-1965-0178586-1>

### Trees, Heaps, Skip Lists & Range Queries
- **Adelson-Velsky & Landis (1962)** — G. M. Adelson-Velsky & E. M. Landis, *"An algorithm for the organization of information"*, Soviet Math. Doklady
- **Bayer & McCreight (1972)** — Rudolf Bayer & Edward M. McCreight, *"Organization and Maintenance of Large Ordered Indexes"*, Acta Informatica — <https://doi.org/10.1007/BF00288683>
- **Guibas & Sedgewick (1978)** — Leo J. Guibas & Robert Sedgewick, *"A Dichromatic Framework for Balanced Trees"*, IEEE FOCS — <https://doi.org/10.1109/SFCS.1978.3>
- **Sedgewick (2008)** — Robert Sedgewick, *"Left-leaning Red-Black Trees"*, Princeton University — <https://sedgewick.io/wp-content/themes/sedgewick/papers/2008LLRB.pdf>
- **Sleator & Tarjan (1985)** — Daniel Dominic Sleator & Robert Endre Tarjan, *"Self-Adjusting Binary Search Trees"* (Splay Trees), JACM — <https://doi.org/10.1145/3828.3835>
- **Seidel & Aragon (1996)** — Raimund Seidel & Cecilia R. Aragon, *"Randomized Search Trees"* (Treaps), Algorithmica — <https://doi.org/10.1007/BF01940876>
- **Pugh (1990)** — William Pugh, *"Skip Lists: A Probabilistic Alternative to Balanced Trees"*, CACM — <https://doi.org/10.1145/78973.78977>
- **Fenwick (1994)** — Peter M. Fenwick, *"A New Data Structure for Cumulative Frequency Tables"*, Software: Practice and Experience — <https://doi.org/10.1002/spe.4380240306>
- **Driscoll, Sarnak, Sleator, Tarjan (1989)** — *"Making Data Structures Persistent"*, JCSS — <https://doi.org/10.1016/0022-0000(89)90034-2>
- **Bender & Farach-Colton (2000)** — Michael A. Bender & Martín Farach-Colton, *"The LCA Problem Revisited"*, LATIN — <https://doi.org/10.1007/10719839_9>
- **Fredman & Tarjan (1987)** — Michael L. Fredman & Robert Endre Tarjan, *"Fibonacci Heaps and Their Uses in Improved Network Optimization Algorithms"*, JACM — <https://doi.org/10.1145/28869.28874>
- **O'Neil, Cheng, Gawlick, O'Neil (1996)** — *"The Log-Structured Merge-Tree (LSM-Tree)"*, Acta Informatica — <https://doi.org/10.1007/s002360050048>

### Strings, Automata & Compression
- **Knuth, Morris, Pratt (1977)** — Donald E. Knuth, James H. Morris Jr., Vaughan R. Pratt, *"Fast Pattern Matching in Strings"*, SIAM J. Comput. — <https://doi.org/10.1137/0206024>
- **Boyer & Moore (1977)** — Robert S. Boyer & J Strother Moore, *"A Fast String Searching Algorithm"*, CACM — <https://doi.org/10.1145/359842.359859>
- **Karp & Rabin (1987)** — Richard M. Karp & Michael O. Rabin, *"Efficient Randomized Pattern-Matching Algorithms"*, IBM J. Res. Dev. — <https://doi.org/10.1147/rd.312.0249>
- **Aho & Corasick (1975)** — Alfred V. Aho & Margaret J. Corasick, *"Efficient String Matching: An Aid to Bibliographic Search"*, CACM — <https://doi.org/10.1145/360825.360855>
- **Manacher (1975)** — Glenn Manacher, *"A New Linear-Time 'On-Line' Algorithm for Finding the Smallest Initial Palindrome of a String"*, JACM — <https://doi.org/10.1145/321892.321896>
- **Ukkonen (1995)** — Esko Ukkonen, *"On-line construction of suffix trees"*, Algorithmica — <https://doi.org/10.1007/BF01206331>
- **Manber & Myers (1993)** — Udi Manber & Gene Myers, *"Suffix Arrays: A New Method for On-Line String Searches"*, SIAM J. Comput. — <https://doi.org/10.1137/0222058>
- **Kasai et al. (2001)** — Toru Kasai et al., *"Linear-Time Longest-Common-Prefix Computation in Suffix Arrays and Its Applications"*, CPM — <https://doi.org/10.1007/3-540-48194-X_17>
- **Blumer et al. (1985)** — Anselm Blumer et al., *"The smallest automaton recognizing the subwords of a text"*, Theoretical Computer Science — <https://doi.org/10.1016/0304-3975(85)90047-7>
- **Thompson (1968)** — Ken Thompson, *"Programming Techniques: Regular expression search algorithm"*, CACM — <https://doi.org/10.1145/363347.363387>
- **Cox (2007)** — Russ Cox, *"Regular Expression Matching Can Be Simple And Fast"* — <https://swtch.com/~rsc/regexp/regexp1.html>
- **Myers (1986)** — Eugene W. Myers, *"An O(ND) Difference Algorithm and Its Variations"*, Algorithmica — <https://doi.org/10.1007/BF01840446>
- **Hirschberg (1975)** — Dan S. Hirschberg, *"A linear space algorithm for computing maximal common subsequences"*, CACM — <https://doi.org/10.1145/360825.360861>

### Graphs, Shortest Paths & Network Flow
- **Tarjan (1972)** — Robert Endre Tarjan, *"Depth-First Search and Linear Graph Algorithms"*, SIAM J. Comput. — <https://doi.org/10.1137/0201010>
- **Tarjan (1975)** — Robert Endre Tarjan, *"Efficiency of a Good But Not Linear Set Union Algorithm"*, JACM — <https://doi.org/10.1145/321879.321884>
- **Dijkstra (1959)** — Edsger W. Dijkstra, *"A Note on Two Problems in Connexion with Graphs"*, Numerische Mathematik — <https://doi.org/10.1007/BF01386390>
- **Hart, Nilsson, Raphael (1968)** — Peter E. Hart, Nils J. Nilsson, Bertram Raphael, *"A Formal Basis for the Heuristic Determination of Minimum Cost Paths"* ($A^*$), IEEE SSC — <https://doi.org/10.1109/TSSC.1968.300136>
- **Ford & Fulkerson (1956)** — L. R. Ford Jr. & D. R. Fulkerson, *"Maximal Flow Through a Network"*, Canadian Journal of Mathematics — <https://doi.org/10.4153/CJM-1956-045-5>
- **Edmonds & Karp (1972)** — Jack Edmonds & Richard M. Karp, *"Theoretical Improvements in Algorithmic Efficiency for Network Flow Problems"*, JACM — <https://doi.org/10.1145/321694.321699>
- **Dinic (1970)** — E. A. Dinic, *"Algorithm for solution of a problem of maximum flow in networks with power estimation"*, Soviet Math. Doklady
- **Goldberg & Tarjan (1988)** — Andrew V. Goldberg & Robert Endre Tarjan, *"A New Approach to the Maximum-Flow Problem"*, JACM — <https://doi.org/10.1145/48014.61051>
- **Hopcroft & Karp (1973)** — John E. Hopcroft & Richard M. Karp, *"An $n^{5/2}$ Algorithm for Maximum Matchings in Bipartite Graphs"*, SIAM J. Comput. — <https://doi.org/10.1137/0202019>

---

## 3. Production Standard Library & Systems Sources

- **V8 JavaScript Engine**: Elements Kinds & Array Sorting — <https://v8.dev/blog/elements-kinds>, <https://v8.dev/blog/array-sort>
- **Rust `hashbrown` & SwissTable**: <https://docs.rs/hashbrown/latest/hashbrown/> & CppCon 2017 Matt Kulukundis
- **Linux Kernel Data Structures**: `rbtree` (`Documentation/core-api/rbtree.rst`) & `list_head` — <https://docs.kernel.org/core-api/rbtree.html>
- **Redis Internals**: `t_zset.c`, `listpack.c`, `rax.c` — <https://github.com/redis/redis>
- **ripgrep & BurntSushi**: Andrew Gallant, *"ripgrep is faster than {grep, ag, git grep, ucg, pt, sift}"* — <https://blog.burntsushi.net/ripgrep/>
- **AtCoder Library (ACL)**: <https://atcoder.github.io/ac-library/production/document_en/>

---

## 4. Curated Video Lecture Channels

All embedded unit videos must come from these authoritative educational sources:
1. **MIT OpenCourseWare** — *6.006 Introduction to Algorithms*, *6.046J Design and Analysis of Algorithms*, *6.851 Advanced Data Structures*, *6.172 Performance Engineering of Software Systems* (<https://ocw.mit.edu/>)
2. **Princeton Algorithms** — Robert Sedgewick & Kevin Wayne lecture series
3. **Stanford Algorithms** — Tim Roughgarden lecture series
4. **3Blue1Brown** — Grant Sanderson visual mathematics & Fourier transform lectures
5. **Reducible** — Visual algorithmic deep dives (FFT, Dijkstra, B-Trees, Dynamic Programming, PNG/LZ77)
6. **William Fiset** — Graph Theory, Network Flow, Fenwick Trees, Balanced Trees, Suffix Arrays
7. **Abdul Bari** — Step-by-step trace walkthroughs of AVL/B-Trees, KMP, Bellman-Ford, Matrix Chain Multiplication
8. **NeetCode / Errichto / Colin Galen** — Applied problem-solving invariants, bit manipulation, and competitive programming optimizations
