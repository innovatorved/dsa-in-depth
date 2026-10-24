window.QUESTION_BANK = window.QUESTION_BANK || {};

window.QUESTION_BANK["universal-k-independent-hashing"] = [
  {
    id: "universal-k-independent-hashing-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Formal Definition of a Carter-Wegman Universal Hash Family",
    prompt: "A family H of hash functions mapping universe U to {0, 1, ..., m - 1} is defined as 'universal' (Carter & Wegman, 1979) if and only if for every pair of distinct keys x != y in U:",
    question: "A family H of hash functions mapping universe U to {0, 1, ..., m - 1} is defined as 'universal' (Carter & Wegman, 1979) if and only if for every pair of distinct keys x != y in U:",
    options: [
      "Pr_{h in H}[h(x) == h(y)] <= 1 / m",
      "h(x) != h(y) for every function h in H",
      "Pr_{h in H}[h(x) == i and h(y) == j] == 1 / m^2 for all buckets i, j",
      "The hash function h can be evaluated in O(1) bit shifts without integer division"
    ],
    answer: 0,
    explanation: "Universal hashing requires only that a randomly chosen h from H collides on any fixed distinct pair x != y with probability at most 1/m. Stronger condition (C) is pairwise independence (2-universality), which implies universality."
  },
  {
    id: "universal-k-independent-hashing-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Why Division Hashing Fails on Power-of-Two Table Sizes",
    prompt: "Suppose a 64-bit C++ program stores heap pointers aligned to 16-byte boundaries as keys in a hash table of size m = 2^12 = 4096 using the unmixed division hash h(k) = k mod m. What happens to the bucket distribution?",
    question: "Suppose a 64-bit C++ program stores heap pointers aligned to 16-byte boundaries as keys in a hash table of size m = 2^12 = 4096 using the unmixed division hash h(k) = k mod m. What happens to the bucket distribution?",
    options: [
      "Because k mod 2^12 extracts only the lowest 12 bits and the lowest 4 bits of every 16-byte-aligned pointer are 0000_2, 15/16 (93.75%) of the buckets remain permanently empty",
      "All keys map to bucket 0 because heap pointers share the same upper 48 virtual address bits",
      "The keys distribute uniformly across all 4096 buckets because 4096 is a multiple of 16",
      "Only the top 16 buckets receive keys while buckets 0..4079 remain empty"
    ],
    answer: 0,
    explanation: "Taking k mod 2^r is equivalent to k & (2^r - 1), which discards bits [63..r]. Because 16-byte aligned pointers have zeros in bits [3..0], only buckets whose index is a multiple of 16 can ever be hit, increasing effective load factor 16x on the remaining 256 buckets."
  },
  {
    id: "universal-k-independent-hashing-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Fast Modulo Reduction Modulo Mersenne Prime p = 2^61 - 1",
    prompt: "When evaluating a k-independent Carter-Wegman polynomial hash modulo the Mersenne prime p = 2^61 - 1, why can a 128-bit product z be reduced modulo p without using a hardware DIV instruction?",
    question: "When evaluating a k-independent Carter-Wegman polynomial hash modulo the Mersenne prime p = 2^61 - 1, why can a 128-bit product z be reduced modulo p without using a hardware DIV instruction?",
    options: [
      "Because 2^61 ≡ 1 (mod 2^61 - 1), so z = (z >> 61) * 2^61 + (z & p) ≡ (z >> 61) + (z & p) (mod p)",
      "Because 2^61 - 1 is a power of two, allowing a single bitwise AND mask",
      "Because integer overflow modulo 2^64 automatically wraps modulo 2^61 - 1",
      "Because any prime p satisfies z mod p = z ^ (z >> 61)"
    ],
    answer: 0,
    explanation: "Since p = 2^61 - 1, 2^61 = p + 1 ≡ 1 (mod p). Splitting z into z_hi = z >> 61 and z_lo = z & p gives z = z_hi * 2^61 + z_lo ≡ z_hi + z_lo (mod p), replacing a 30-cycle division with a shift, mask, and add."
  },
  {
    id: "universal-k-independent-hashing-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Independence Requirements: Chaining vs Linear Probing",
    prompt: "While 2-independence (pairwise independence) suffices to prove O(1) expected operation time in Separate Chaining and Count-Min Sketch, what did Pagh, Pagh, and Ruzic (2007) prove regarding k-independence for Linear Probing?",
    question: "While 2-independence (pairwise independence) suffices to prove O(1) expected operation time in Separate Chaining and Count-Min Sketch, what did Pagh, Pagh, and Ruzic (2007) prove regarding k-independence for Linear Probing?",
    options: [
      "Pairwise (2-independent) hash families can suffer Ω(log N) expected probe lengths in Linear Probing, whereas 5-independent hash families guarantee O(1) expected probe time",
      "Pairwise independence also guarantees O(1) expected time in Linear Probing at any load factor α < 1",
      "Linear Probing requires full N-wise independence (a random oracle) to achieve O(1) expected time",
      "3-independence is necessary and sufficient for both Separate Chaining and Linear Probing"
    ],
    answer: 0,
    explanation: "Linear Probing cost depends on higher-order moments of cluster lengths (not just pairwise collision counts via linearity of expectation). 2-independent families can construct Ω(log N) clusters, whereas 5-independence (or Simple Tabulation Hashing) guarantees O(1) expected probes."
  }
];

window.QUESTION_BANK["separate-chaining-vs-open-addressing"] = [
  {
    id: "separate-chaining-vs-open-addressing-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Knuth's Expected Probe Bound for Linear Probing",
    prompt: "Under the uniform hashing model at load factor α = n / m < 1, what is Knuth's asymptotic expected number of probes for an UNSUCCESSFUL search (miss) in Linear Probing?",
    question: "Under the uniform hashing model at load factor α = n / m < 1, what is Knuth's asymptotic expected number of probes for an UNSUCCESSFUL search (miss) in Linear Probing?",
    options: [
      "1/2 * (1 + 1 / (1 - α)^2)",
      "1 / (1 - α)",
      "1 + α",
      "(1 / α) * ln(1 / (1 - α))"
    ],
    answer: 0,
    explanation: "Because primary clustering causes long contiguous runs to grow faster than short runs, an unsuccessful search in Linear Probing scales quadratically with 1/(1 - α): 0.5 * (1 + 1/(1 - α)^2), compared to 1/(1 - α) in Double Hashing."
  },
  {
    id: "separate-chaining-vs-open-addressing-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Triangular Number Quadratic Probing on Power-of-Two Tables",
    prompt: "In an open-addressed table of size m = 2^r, why is the quadratic probe sequence h(k, i) = (h(k) + i(i + 1)/2) mod 2^r strongly preferred over h(k, i) = (h(k) + i^2) mod 2^r?",
    question: "In an open-addressed table of size m = 2^r, why is the quadratic probe sequence h(k, i) = (h(k) + i(i + 1)/2) mod 2^r strongly preferred over h(k, i) = (h(k) + i^2) mod 2^r?",
    options: [
      "The triangular offsets i(i + 1)/2 mod 2^r generate a full permutation of {0, 1, ..., 2^r - 1}, guaranteeing that every slot is visited before any slot repeats",
      "i(i + 1)/2 requires hardware division whereas i^2 uses bit shifts",
      "i^2 mod 2^r visits every slot twice as fast as i(i + 1)/2",
      "Triangular probing eliminates both primary and secondary clustering"
    ],
    answer: 0,
    explanation: "Squares modulo 2^r visit fewer than 1/4 of the buckets in a power-of-two table, causing insertions to fail even when 75% of the table is empty! By contrast, triangular numbers T_i = i(i+1)/2 (computed iteratively by idx = (idx + step) & mask) visit all 2^r slots."
  },
  {
    id: "separate-chaining-vs-open-addressing-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Duplicate Key Bug When Reusing Tombstones on Insert",
    prompt: "During `insert(k, v)` in an open-addressed table with tombstones, the probe loop encounters a `TOMBSTONE` at index `t`. Why is it a critical correctness bug to immediately write `(k, v)` at `table[t]` and return?",
    question: "During `insert(k, v)` in an open-addressed table with tombstones, the probe loop encounters a `TOMBSTONE` at index `t`. Why is it a critical correctness bug to immediately write `(k, v)` at `table[t]` and return?",
    options: [
      "Key `k` might already reside at a later occupied slot in the same probe chain; inserting at `t` immediately would create a duplicate copy of `k` in the table",
      "Overwriting a tombstone breaks the probe chain for other keys that probed past `t`",
      "A tombstone slot can only be reused after a full table rehash",
      "Writing to `t` violates the load factor calculation"
    ],
    answer: 0,
    explanation: "If `k` was inserted earlier when `t` was occupied by another key, `k` sits past `t` in the probe sequence. `insert` must record `firstTomb = t` and continue probing until it either finds `k` (updating it in place) or hits `EMPTY` (placing the new key at `firstTomb`)."
  },
  {
    id: "separate-chaining-vs-open-addressing-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Tombstone Contamination Under Steady-State Churn",
    prompt: "A cache service stores at most n = 200,000 live keys in an open-addressed table of capacity m = 1,048,576 (live load factor α_live = 0.19). After millions of mixed `insert(new_key)` and `erase(old_key)` operations, p99 latency for cache-miss lookups (`find` on missing keys) spikes by 30x without `size()` ever increasing. Why, and how do production tables fix this?",
    question: "A cache service stores at most n = 200,000 live keys in an open-addressed table of capacity m = 1,048,576 (live load factor α_live = 0.19). After millions of mixed `insert(new_key)` and `erase(old_key)` operations, p99 latency for cache-miss lookups (`find` on missing keys) spikes by 30x without `size()` ever increasing. Why, and how do production tables fix this?",
    options: [
      "Deleted slots become TOMBSTONEs that never terminate unsuccessful searches; once (n_live + n_tomb) / m approaches 1, miss probes degrade toward O(m). Fix: trigger a same-capacity tombstone-clearing rehash when (n_live + n_tomb) / m exceeds 0.75–0.875",
      "Heap fragmentation from tombstone allocations slows down L1 cache hits. Fix: call malloc_trim() after every erase",
      "The hash seed wears out after 2^20 operations. Fix: rotate the SipHash key on every erase",
      "Primary clustering only affects tables when α_live < 0.25. Fix: shrink capacity to 262,144"
    ],
    answer: 0,
    explanation: "Unsuccessful lookups must scan past all OCCUPIED and TOMBSTONE slots until reaching a true EMPTY slot. Thus miss performance is governed by α_eff = (n_live + n_tomb) / m. Rebuilding at the same capacity purges all tombstones when α_live is still low."
  }
];

window.QUESTION_BANK["robin-hood-cuckoo-hashing"] = [
  {
    id: "robin-hood-cuckoo-hashing-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Effect of Robin Hood Hashing on Mean vs Variance of Probe Length",
    prompt: "How does Robin Hood linear probing affect the expected (mean) probe length and the probe length variance compared to standard first-come-first-served linear probing (assuming no early-exit optimization)?",
    question: "How does Robin Hood linear probing affect the expected (mean) probe length and the probe length variance compared to standard first-come-first-served linear probing (assuming no early-exit optimization)?",
    options: [
      "The mean number of probes for successful searches is identical, because swapping two keys inside the same cluster preserves the sum of their PSLs, while the variance is dramatically reduced",
      "Both the mean and the variance of successful searches are reduced by a factor of 1/(1 - α)",
      "The mean probe length increases slightly to pay for lower variance",
      "The worst-case probe length is bounded by 2 probes"
    ],
    answer: 0,
    explanation: "Swapping key A (PSL = d_A) and key B (PSL = d_B) changes their distances by +Δ and -Δ, leaving the sum of PSLs across all keys in the table strictly invariant! Thus the mean successful probe length is unchanged, while variance drops from O((1-α)^-3) to O(ln(1/(1-α)))."
  },
  {
    id: "robin-hood-cuckoo-hashing-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Robin Hood Early-Exit Termination Condition",
    prompt: "During `find(q)` in a Robin Hood hash table, the search is currently at probe distance `search_psl = 3` from `h(q)` and inspects an occupied slot whose occupant has `occupant_psl = 1`. What can `find(q)` conclude?",
    question: "During `find(q)` in a Robin Hood hash table, the search is currently at probe distance `search_psl = 3` from `h(q)` and inspects an occupied slot whose occupant has `occupant_psl = 1`. What can `find(q)` conclude?",
    options: [
      "Key `q` is guaranteed not to be in the table and `find(q)` can return `NOT_FOUND` immediately, because if `q` had been inserted it would have displaced this richer occupant (`3 > 1`)",
      "Key `q` must be located within the next 2 slots",
      "The table invariant is corrupted and a rehash is required",
      "`find(q)` must continue scanning until it encounters an `EMPTY` slot"
    ],
    answer: 0,
    explanation: "By the Robin Hood invariant, if `q` were in the table at or beyond this slot, `q` would have had `psl = 3 > 1` when passing this slot and would have stolen it from the current occupant. Hence `search_psl > occupant_psl` proves `q` is absent."
  },
  {
    id: "robin-hood-cuckoo-hashing-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Stopping Condition for Tombstone-Free Backward-Shift Deletion",
    prompt: "When `erase(k)` removes the element at slot `idx` in a Robin Hood hash table and begins shifting subsequent elements backward (`table[idx] = table[next]; table[idx].psl--`), when MUST the backward-shift loop stop?",
    question: "When `erase(k)` removes the element at slot `idx` in a Robin Hood hash table and begins shifting subsequent elements backward (`table[idx] = table[next]; table[idx].psl--`), when MUST the backward-shift loop stop?",
    options: [
      "As soon as `table[next]` is `EMPTY` OR `table[next].psl == 0` (the occupant at `next` is already at its ideal home bucket)",
      "Only when `table[next]` is `EMPTY`",
      "After shifting at most 2 elements backward",
      "As soon as `table[next].psl > table[idx].psl`"
    ],
    answer: 0,
    explanation: "An occupant with `psl == 0` is sitting at its exact home bucket `h(x) = next`. Shifting it backward to `idx = next - 1` would move it BEFORE its home bucket, making it unreachable by future lookups!"
  },
  {
    id: "robin-hood-cuckoo-hashing-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Bipartite Cuckoo Graph Cycle Condition & Load Factor Phase Transition",
    prompt: "In standard 2-table Cuckoo Hashing (d = 2 hash functions, bucket size b = 1), each key x corresponds to an undirected edge (h1(x), h2(x)) in the bipartite Cuckoo graph G. Under what exact graph-theoretic condition can a set of n keys be validly placed into the Cuckoo table without collision, and what load factor threshold does this impose?",
    question: "In standard 2-table Cuckoo Hashing (d = 2 hash functions, bucket size b = 1), each key x corresponds to an undirected edge (h1(x), h2(x)) in the bipartite Cuckoo graph G. Under what exact graph-theoretic condition can a set of n keys be validly placed into the Cuckoo table without collision, and what load factor threshold does this impose?",
    options: [
      "Every connected component of G must have at most as many edges as vertices (i.e., be a tree or unicyclic—containing at most one cycle), which holds with high probability iff load factor α = n/(2m) < 0.50",
      "G must be completely acyclic (a forest of trees), which requires α < 0.25",
      "G must be Eulerian, which holds up to α < 0.75",
      "G must have maximum vertex degree at most 2, which holds up to α < 0.875"
    ],
    answer: 0,
    explanation: "Assigning each key (edge) to one of its two endpoint slots (vertices) corresponds to orienting every edge toward its chosen vertex such that every vertex has in-degree <= 1. A connected component of V_c vertices and E_c edges can be so oriented iff E_c <= V_c (tree or unicyclic). By Erdős-Rényi random graph theory, bicyclic components (E_c > V_c) emerge at the phase transition α = 0.50."
  }
];

window.QUESTION_BANK["hashdos-siphash-random-seeds"] = [
  {
    id: "hashdos-siphash-random-seeds-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Asymptotic Complexity Degradation in a HashDoS Attack",
    prompt: "When an attacker submits N crafted keys that all collide into the same hash bucket of a hash table, what does the total time complexity of inserting all N keys degrade from and to (assuming key length L = O(1))?",
    question: "When an attacker submits N crafted keys that all collide into the same hash bucket of a hash table, what does the total time complexity of inserting all N keys degrade from and to (assuming key length L = O(1))?",
    options: [
      "From expected O(N) to worst-case Θ(N^2), because the i-th insertion must compare against all i - 1 previously inserted keys to check for duplicates",
      "From O(1) to O(N log N) due to bucket sorting",
      "From O(N) to O(N log N) due to dynamic array resizing",
      "From O(N) to O(2^N) due to recursive rehashing"
    ],
    answer: 0,
    explanation: "Inserting the i-th colliding key scans i - 1 existing entries in that bucket/cluster before appending. Summing i - 1 from i = 1 to N yields N(N - 1)/2 = Θ(N^2) comparisons."
  },
  {
    id: "hashdos-siphash-random-seeds-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Java Polynomial String Hash Equivalent-Substring Multicollisions",
    prompt: "Java's `String.hashCode()` computes h(s) = sum_{i} s[i] * 31^(L-1-i) mod 2^32. Given that ASCII `'A' = 65`, `'B' = 66`, and `'a' = 97`, why do `'Aa'` and `'BB'` allow an attacker to trivially generate 2^k colliding strings of length 2k?",
    question: "Java's `String.hashCode()` computes h(s) = sum_{i} s[i] * 31^(L-1-i) mod 2^32. Given that ASCII `'A' = 65`, `'B' = 66`, and `'a' = 97`, why do `'Aa'` and `'BB'` allow an attacker to trivially generate 2^k colliding strings of length 2k?",
    options: [
      "Because 65 * 31 + 97 = 2112 = 66 * 31 + 66, the 2-char blocks 'Aa' and 'BB' have identical polynomial hash values; any of the 2^k concatenations in {'Aa', 'BB'}^k produces the exact same 32-bit hash",
      "Because 31 is an even integer, shifting out the top bits after 32 characters",
      "Because 'Aa' and 'BB' have XOR sum 0 under CRC32",
      "Because Java only hashes the first 16 characters of any String"
    ],
    answer: 0,
    explanation: "By linearity of the polynomial hash, replacing 'Aa' with 'BB' at any aligned 2-char position contributes the exact same value 2112 * 31^p to the total sum, yielding 2^16 = 65,536 colliding 32-byte strings with zero brute-force search."
  },
  {
    id: "hashdos-siphash-random-seeds-q3",
    type: "mcq",
    difficulty: "apply",
    title: "SipHash-c-d Parameter Meaning (SipHash-2-4 vs SipHash-1-3)",
    prompt: "In the family of keyed ARX pseudorandom functions `SipHash-c-d` (such as `SipHash-2-4` and Rust's default `SipHash-1-3`), what do the parameters `c` and `d` specify?",
    question: "In the family of keyed ARX pseudorandom functions `SipHash-c-d` (such as `SipHash-2-4` and Rust's default `SipHash-1-3`), what do the parameters `c` and `d` specify?",
    options: [
      "`c` is the number of compression SipRounds executed per 8-byte input block, and `d` is the number of finalization SipRounds executed after the message finishes",
      "`c` is the number of 64-bit key words, and `d` is the number of 64-bit internal state lanes",
      "`c` is the collision resistance in bytes, and `d` is the digest output width in bytes",
      "`c` is the cache line width in words, and `d` is the treeification depth threshold"
    ],
    answer: 0,
    explanation: "SipHash-c-d maintains four 64-bit state lanes (v0..v3) keyed by a 128-bit secret (k0, k1). It applies c SipRounds per 8-byte input word and d SipRounds during finalization."
  },
  {
    id: "hashdos-siphash-random-seeds-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Why Seeded Non-Cryptographic Hashes (MurmurHash3 / CityHash) Fail Against HashDoS",
    prompt: "After the 2011 HashDoS disclosures, several runtimes initially attempted to defend `MurmurHash2/3` or `CityHash` simply by initializing the hash function with a random 32-bit or 64-bit seed at process startup. Why did cryptanalysts (Jean-Philippe Aumasson, Daniel J. Bernstein, Martin Boßlet) show that this defense is broken?",
    question: "After the 2011 HashDoS disclosures, several runtimes initially attempted to defend `MurmurHash2/3` or `CityHash` simply by initializing the hash function with a random 32-bit or 64-bit seed at process startup. Why did cryptanalysts (Jean-Philippe Aumasson, Daniel J. Bernstein, Martin Boßlet) show that this defense is broken?",
    options: [
      "Differential cryptanalysis and rotational cancellation allow attackers to construct seed-independent multicollisions (pairs of message blocks that collide inside the mixing step for EVERY possible seed value) without knowing the secret seed",
      "A 64-bit random seed has too much entropy for the CPU random number generator to initialize at startup",
      "MurmurHash3 ignores the seed parameter whenever the input string is shorter than 64 bytes",
      "Non-cryptographic hashes cannot produce 64-bit outputs"
    ],
    answer: 0,
    explanation: "Because MurmurHash and CityHash use invertible multiplication/XOR steps with too few mixing rounds between block injections, an attacker can craft block differences Δm that cancel out the internal state difference regardless of the initial seed, producing universal multicollisions."
  }
];

window.QUESTION_BANK["consistent-hashing-rendezvous"] = [
  {
    id: "consistent-hashing-rendezvous-q1",
    type: "mcq",
    difficulty: "recall",
    title: "Key Disruption Fraction in Consistent Hashing vs Modulo Sharding",
    prompt: "When a cluster of N cache servers scales from N to N + 1 nodes, approximately what fraction of keys must be remapped to a different server under naive `hash(k) mod N` sharding versus Karger's Consistent Hashing?",
    question: "When a cluster of N cache servers scales from N to N + 1 nodes, approximately what fraction of keys must be remapped to a different server under naive `hash(k) mod N` sharding versus Karger's Consistent Hashing?",
    options: [
      "Naive modulo remaps N / (N + 1) ≈ 100% of keys, whereas Consistent Hashing remaps only 1 / (N + 1) of keys",
      "Naive modulo remaps 50% of keys, whereas Consistent Hashing remaps 0% of keys",
      "Both remap 1 / (N + 1) of keys, but Consistent Hashing uses less memory",
      "Naive modulo remaps 1 / N of keys, whereas Consistent Hashing remaps (log N) / N of keys"
    ],
    answer: 0,
    explanation: "Under `hash(k) mod N`, changing the modulus to N+1 shifts the remainder for almost all keys (only ~1/(N+1) happen to stay on the same index). Consistent Hashing preserves monotonicity: only keys landing in the new node's ring arcs (1/(N+1) of the ring) move."
  },
  {
    id: "consistent-hashing-rendezvous-q2",
    type: "mcq",
    difficulty: "apply",
    title: "Role of Virtual Nodes (VNodes) on the Consistent Hashing Ring",
    prompt: "If each of the N physical servers is placed at only a single random point (V = 1) on the 2^64 Consistent Hashing ring, what problem occurs, and how does assigning V = Θ(log N) virtual tokens per server resolve it?",
    question: "If each of the N physical servers is placed at only a single random point (V = 1) on the 2^64 Consistent Hashing ring, what problem occurs, and how does assigning V = Θ(log N) virtual tokens per server resolve it?",
    options: [
      "With V = 1, random spacing between adjacent points follows an exponential/Dirichlet distribution where the largest arc can be Θ(log N / N) (up to O(log N)x average load); V virtual nodes average V independent arcs per server, reducing load standard deviation to ~1/√V",
      "With V = 1, binary search on the ring takes O(N) time instead of O(log N) time",
      "With V = 1, keys with hash values greater than the largest server token cannot be routed",
      "With V = 1, more than 50% of keys move when a node leaves the cluster"
    ],
    answer: 0,
    explanation: "Placing N random points on a circle creates highly uneven arc lengths (the max arc is Θ(log N / N) w.h.p.). Assigning V = 100–200 virtual tokens per physical server sums V small random arcs per server, concentrating each server's share tightly around 1/N by the Central Limit Theorem."
  },
  {
    id: "consistent-hashing-rendezvous-q3",
    type: "mcq",
    difficulty: "apply",
    title: "Rendezvous (Highest Random Weight / HRW) Hashing Mechanics",
    prompt: "How does Rendezvous (Highest Random Weight) Hashing route a key `k` across a set of active servers `{s_1, s_2, ..., s_N}` without maintaining a ring of virtual nodes?",
    question: "How does Rendezvous (Highest Random Weight) Hashing route a key `k` across a set of active servers `{s_1, s_2, ..., s_N}` without maintaining a ring of virtual nodes?",
    options: [
      "It computes a combined hash weight `w_i = hash(k, s_i)` for every server `s_i` and routes `k` to the server `s*` that maximizes `w_i` in O(N) time",
      "It queries a centralized coordinator table storing the current owner of every key `k`",
      "It hashes `k` twice using Cuckoo hashing to pick between two fixed servers",
      "It sorts the keys alphabetically and divides them into N equal ranges"
    ],
    answer: 0,
    explanation: "In HRW hashing, `argmax_{i} hash(k, s_i)` is uniformly distributed over the N servers with zero VNode tables, and sorting the weights gives a natural deterministic primary/secondary/tertiary replica preference list."
  },
  {
    id: "consistent-hashing-rendezvous-q4",
    type: "mcq",
    difficulty: "staff",
    title: "Consistent Hashing with Bounded Loads under Zipfian / Hot-Key Skew",
    prompt: "Why do Virtual Nodes (VNodes) alone fail to prevent server overload when a single 'celebrity' key receives 30% of all cluster requests, and how does Consistent Hashing with Bounded Loads (Mirrokni et al., 2017) handle capacity enforcement?",
    question: "Why do Virtual Nodes (VNodes) alone fail to prevent server overload when a single 'celebrity' key receives 30% of all cluster requests, and how does Consistent Hashing with Bounded Loads (Mirrokni et al., 2017) handle capacity enforcement?",
    options: [
      "All requests for an identical key `k` always hash to the exact same point `h(k)` on the ring regardless of how many VNodes exist; Bounded Loads enforces a per-node cap `C = ceil((1 + ε)W/N)` and forwards excess requests clockwise to the first non-full server in O(1/ε^2) expected hops",
      "VNodes merge together when traffic is skewed; Bounded Loads splits the hot key by modifying the client's TCP port number",
      "VNodes only balance memory usage, not request rate; Bounded Loads dynamically adds 1,000 new VNodes to the overloaded server",
      "Bounded Loads switches the cluster to round-robin routing whenever any server exceeds 50% CPU utilization"
    ],
    answer: 0,
    explanation: "VNodes only make the ring *arcs* uniform in length; they cannot split a point mass (hot key) that hashes to a single coordinate `h(k)`. Bounded-load consistent hashing caps each node at `⌈(1+ε)W/N⌉` and spills excess load clockwise along the ring."
  }
];

Object.assign(window.QUESTION_BANK, {
  "bloom-filters-counting-xor": [
    {
      id: "m04-bloom-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Optimal Hash Function Count in Standard Bloom Filters",
      prompt: "You allocate a standard Bloom filter with $m$ bits to store $n$ expected distinct keys ($m/n$ bits per key).",
      question: "Which value of $k$ (the number of independent hash probes per element) minimizes the false positive rate $\\varepsilon \\approx (1 - e^{-kn/m})^k$, and what is the resulting bit density after all $n$ keys are inserted?",
      options: [
        "k = (m / n) ln 2 ≈ 0.693(m / n), which leaves exactly 50% of the bit array set to 1 and 50% set to 0 at capacity.",
        "k = m / n, which sets approximately 63.2% (1 - 1/e) of the bit array to 1.",
        "k = 1, because adding more hash functions sets more bits to 1 and strictly increases collision probability.",
        "k = log₂(m / n), which minimizes both memory bandwidth and false positive probability."
      ],
      answer: 0,
      explanation: "Taking the derivative of ln((1 - e^{-kn/m})^k) with respect to k shows the global minimum occurs when e^{-kn/m} = 1/2, i.e., exactly half the bits in the filter are set to 1. Solving for k gives k = (m/n) ln 2, yielding the optimal false positive rate (1/2)^k ≈ (0.6185)^{m/n}."
    },
    {
      id: "m04-bloom-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Sizing a LSM-Tree SSTable Bloom Filter for 1% False Positives",
      prompt: "A storage engine compacts an SSTable containing $n = 1{,}000{,}000$ keys and requires a Bloom filter false positive rate $\\varepsilon \\le 0.01$ (1%).",
      question: "Using the lower-bound formula $m/n = -\\frac{\\ln \\varepsilon}{(\\ln 2)^2} \\approx 1.44 \\log_2(1/\\varepsilon)$, approximately how many bits per key ($m/n$) and how many hash probes ($k$) should be configured?",
      options: [
        "Approximately 9.6 bits per key (~1.2 MB total) with k = 7 hash functions.",
        "Approximately 4.8 bits per key (~600 KB total) with k = 3 hash functions.",
        "Approximately 14.4 bits per key (~1.8 MB total) with k = 10 hash functions.",
        "Approximately 1.44 bits per key (~180 KB total) with k = 1 hash function."
      ],
      answer: 0,
      explanation: "For ε = 0.01, log₂(100) ≈ 6.644. Multiplying by 1.44 gives 1.44 × 6.644 ≈ 9.58 bits per key (conventionally rounded to 10 bits/key in RocksDB/LevelDB). The optimal number of hash functions is k = 9.58 × ln(2) ≈ 6.64 → 7 probes."
    },
    {
      id: "m04-bloom-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Why Deleting from a Standard Bloom Filter is Unsound",
      prompt: "An engineer attempts to support key deletion in a standard bit-array Bloom filter by clearing the $k$ bit positions $h_1(x), \\dots, h_k(x)$ back to `0` when key $x$ is removed.",
      question: "Which critical invariant of the Bloom filter does this operation violate?",
      options: [
        "The zero-false-negative invariant: another live key y may share one or more of those k bit positions, causing future lookups for y to falsely return 'definitely not present'.",
        "The independence invariant: clearing bits introduces statistical correlation between the k universal hash functions.",
        "The space complexity invariant: clearing bits prevents kirsch-mitzenmacher double hashing from cycling through all m indices.",
        "It does not violate any invariant as long as the load factor α = n/m is below 0.5."
      ],
      answer: 0,
      explanation: "Multiple inserted keys can set the same bit index to 1. If deleting x resets bit h_i(x) to 0 while another inserted element y also hashed to h_i(y) = h_i(x), subsequent queries for y will see a 0 at that index and falsely report that y is absent (a false negative). Supporting deletion requires Counting Bloom Filters (4-bit counters), Cuckoo filters, or ribbon/XOR filters rebuilt on immutable snapshots."
    },
    {
      id: "m04-bloom-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Cache-Line Blocked Bloom Filters vs Xor Filters in Production",
      prompt: "A standard Bloom filter with $k = 7$ probes into a $16\\text{ MB}$ bit array suffers up to $7$ L3/DRAM cache misses on a positive lookup.",
      question: "How do Cache-Blocked Bloom Filters (Putze et al.) and Static Xor Filters (Graf & Lemire) address this hardware bottleneck, and what is their trade-off?",
      options: [
        "Blocked Bloom filters confine all k probes to a single 512-bit (64-byte) CPU cache line (1 cache miss, SIMD testable via AVX2) at the cost of ~30% more bits for the same ε; Xor filters solve a sparse peeling system over GF(2) for static sets using only 1.23 log₂(1/ε) bits/key and exactly 3 parallel array reads.",
        "Blocked Bloom filters use cryptographic SHA-256 to compress all 7 probes into 1 bit; Xor filters support dynamic insertions and deletions in O(1) worst-case time.",
        "Blocked Bloom filters eliminate false positives entirely within a single cache line; Xor filters require k = 10 sequential pointer chases.",
        "Both designs require 64-bit counters per bucket, increasing memory usage by 8× over standard Bloom filters."
      ],
      answer: 0,
      explanation: "A cache-line Blocked Bloom filter uses the first hash to select a 64-byte cache line and sets all k bits within that single cache line (checkable in 1 memory access and a single AVX2 _mm256_testc_si256 instruction), trading slightly higher variance in bucket load (~20-30% space overhead). Xor filters store L-bit fingerprints in an array of size 1.23n via hypergraph peeling and check membership via B[h₀(x)] ^ B[h₁(x)] ^ B[h₂(x)] == fingerprint(x) in 3 independent memory reads, but are immutable after construction."
    }
  ],

  "count-min-sketch-heavy-hitters": [
    {
      id: "m04-cms-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Count-Min Sketch Error Guarantee and Direction of Bias",
      prompt: "A Count-Min Sketch (Cormode & Muthukrishnan) is initialized with $d = \\lceil \\ln(1/\\delta) \\rceil$ rows and $w = \\lceil e / \\varepsilon \\rceil$ counters per row, processing a non-negative insertion-only stream of total weight $N = \\sum_i f_i$.",
      question: "Why does the point estimator $\\hat{f}_x = \\min_{1 \\le j \\le d} C[j][h_j(x)]$ take the minimum across the $d$ rows, and what is its probabilistic error bound?",
      options: [
        "Because hash collisions with other positive frequencies only add to a counter (one-sided overestimation error); taking the minimum yields the tightest upper bound, guaranteeing f_x ≤ f̂_x ≤ f_x + εN with probability at least 1 - δ.",
        "Because hash collisions can both increment and decrement counters; taking the minimum cancels negative bias.",
        "Because taking the mean across rows would overflow 64-bit integers when N > 10^9.",
        "Because the minimum estimator guarantees relative error f̂_x ≤ (1 + ε)f_x for every tail element regardless of N."
      ],
      answer: 0,
      explanation: "In a non-negative stream, every counter C[j][h_j(x)] equals the true frequency f_x plus the sum of frequencies of other items colliding in row j. Since every row is an upper bound (C[j][h_j(x)] ≥ f_x), the minimum over all d rows is also ≥ f_x and fails to beat f_x + εN only if EVERY one of the d independent rows suffers collision mass > εN, which by Markov's inequality happens with probability at most (1/e)^d = δ."
    },
    {
      id: "m04-cms-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Dimensioning a Count-Min Sketch for Network Telemetry",
      prompt: "You want to track per-flow packet counts on a router such that the additive error is at most $\\varepsilon = 0.001$ ($0.1\\%$ of total traffic $N$) with failure probability at most $\\delta = 0.01$ ($99\\%$ confidence) using 32-bit (4-byte) counters.",
      question: "Using $w = \\lceil e / \\varepsilon \\rceil$ and $d = \\lceil \\ln(1/\\delta) \\rceil$, what are the dimensions $(d, w)$ and total memory footprint of the sketch?",
      options: [
        "d = 5 rows, w = 2719 columns → 13,595 counters ≈ 54.4 KB of SRAM, completely independent of the number of distinct flows.",
        "d = 100 rows, w = 1000 columns → 100,000 counters ≈ 400 KB per million active flows.",
        "d = 2 rows, w = 1000 columns → 2,000 counters ≈ 8 KB.",
        "d = 7 rows, w = 2^20 columns → 28 MB."
      ],
      answer: 0,
      explanation: "With ε = 0.001, w = ⌈2.71828 / 0.001⌉ = 2719 columns. With δ = 0.01, d = ⌈ln(100)⌉ = ⌈4.605⌉ = 5 rows. Total counters = 5 × 2719 = 13,595, which at 4 bytes per counter occupies just 54,380 bytes (~54.4 KB), Fitting easily in L1/L2 cache regardless of whether the stream contains 10^5 or 10^10 distinct flows."
    },
    {
      id: "m04-cms-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Conservative Update (Count-Min-CU) Optimization",
      prompt: "When a packet for key $x$ arrives with weight $1$, the five counters for $x$ in a Count-Min Sketch currently hold values `[12, 19, 12, 45, 23]`.",
      question: "Under Estan and Varghese's Conservative Update (CU) rule for non-negative streams, which counters are modified and to what values?",
      options: [
        "Only the two minimal counters holding 12 are incremented to 13, producing [13, 19, 13, 45, 23], because f_x cannot exceed 13 and the rows at 19, 45, and 23 already exceed that bound.",
        "All five counters are incremented by 1 to [13, 20, 13, 46, 24] to preserve linear sketch mergeability.",
        "The maximum counter 45 is decremented toward the minimum 12 to reduce collision noise.",
        "Only the first row is incremented to 13 while the remaining rows are left unchanged."
      ],
      answer: 0,
      explanation: "Before the update, we know f_x ≤ min(12, 19, 12, 45, 23) = 12. After adding 1 to x's frequency, the new true frequency is at most 13. Setting C[j][h_j(x)] = max(C[j][h_j(x)], 13) maintains the exact invariant C[j][h_j(x)] ≥ f_x while avoiding unnecessary inflation of counters that already suffered collisions, cutting average estimation error by up to 2–5× in skewed Zipfian streams."
    },
    {
      id: "m04-cms-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Why Count Sketch Uses Median of Signed Counters vs Count-Min's Minimum",
      prompt: "Charikar, Chen, and Farach-Colton's Count Sketch adds a second pairwise-independent sign hash $s_j(x) \\in \\{-1, +1\\}$ per row, updating $C[j][h_j(x)] \\mathrel{+}= s_j(x) \\cdot c$ and estimating row $j$ as $s_j(x) \\cdot C[j][h_j(x)]$.",
      question: "Why must Count Sketch aggregate across its $d$ rows using the **median** rather than the **minimum**, and what theoretical advantage does it gain?",
      options: [
        "Because colliding items are multiplied by random ±1 signs, making the error in each row zero-mean but two-sided (can both overestimate and underestimate f_x); the median concentrates around the unbiased expectation with L₂ error O(‖f‖₂ / √w) rather than L₁ error ε‖f‖₁.",
        "Because the median can be computed in O(1) time without branches, whereas the minimum requires O(d log d) sorting.",
        "Because Count Sketch cannot handle negative turnstile updates (deletions), whereas Count-Min with Conservative Update can.",
        "Because the minimum of signed counters always equals the largest negative bucket in the sketch."
      ],
      answer: 0,
      explanation: "In Count Sketch, E[s_j(x) C[j][h_j(x)]] = f_x because E[s_j(x)s_j(y)] = 0 for y ≠ x. However, the noise sum ∑_{y≠x} s_j(x)s_j(y)f_y can be negative as well as positive, so taking the minimum would select the most negatively biased row! By Chebyshev + Chernoff concentration across d rows, the median of bounded-variance unbiased estimators gives ±ε‖f_{-k}‖₂ error, which is dramatically tighter than ε‖f‖₁ on heavy-tailed Zipfian distributions."
    }
  ],

  "hyperloglog-cardinality": [
    {
      id: "m04-hll-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Why HyperLogLog Uses the Harmonic Mean Instead of the Arithmetic or Geometric Mean",
      prompt: "Flajolet's original LogLog algorithm aggregated $m = 2^p$ register values $M[j]$ (tracking the maximum position of the leftmost `1`-bit, $\\rho(w)$) using the geometric mean $2^{\\frac{1}{m}\\sum M[j]}$, achieving standard error $1.30 / \\sqrt{m}$.",
      question: "How did HyperLogLog (Flajolet et al., 2007) tighten the asymptotic standard error to $\\approx 1.04 / \\sqrt{m}$ using the exact same 5-bit/6-bit registers?",
      options: [
        "By replacing the geometric mean of 2^{M[j]} with the harmonic mean Z = (∑_{j=0}^{m-1} 2^{-M[j]})^{-1}, which dampens the extreme right-tail outliers of the geometric distribution Pr[ρ(w) = k] = 2^{-k}.",
        "By replacing the geometric mean with the arithmetic mean (1/m) ∑ 2^{M[j]}, which is an unbiased minimum-variance estimator.",
        "By using SHA-256 instead of MurmurHash3 to eliminate hash collisions across registers.",
        "By doubling the register width from 6 bits to 12 bits per bucket."
      ],
      answer: 0,
      explanation: "The random variable 2^{M[j]} has infinite variance, and even the geometric mean 2^{(1/m)∑ M[j]} is heavily skewed by rare lucky coin flips where a single register observes ρ(w) = 40+. The harmonic mean averages 2^{-M[j]}, where a freakishly large M[j] contributes nearly 0 to the denominator rather than exploding the sum, lowering the constant factor in the standard error from 1.30/√m down to √(3 ln(2) - 1)/√m ≈ 1.04/√m."
    },
    {
      id: "m04-hll-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Redis HyperLogLog Precision and Memory Calculation",
      prompt: "Redis implements `PFADD` and `PFCOUNT` using a HyperLogLog with precision parameter $p = 14$ ($m = 2^{14} = 16{,}384$ registers) and 6-bit registers ( tracking leading zeros up to $64 - 14 = 50$).",
      question: "What are the dense memory footprint and standard error ($\\sigma \\approx 1.04 / \\sqrt{m}$) of a single Redis HyperLogLog structure?",
      options: [
        "16,384 × 6 bits = 98,304 bits = 12 KB of memory, with a standard error of 1.04 / 128 ≈ 0.8125%.",
        "16,384 × 8 bytes = 128 KB of memory, with a standard error of 0.01%.",
        "16,384 × 1 bit = 2 KB of memory, with a standard error of 1.04%.",
        "1.2 MB of memory per million unique keys, scaling linearly with cardinality."
      ],
      answer: 0,
      explanation: "With m = 2^{14} = 16,384 registers and 6 bits per register, the bit-packed array uses exactly 16,384 × 6 / 8 = 12,288 bytes (12 KB), regardless of whether 100 or 10^{12} distinct keys are inserted. Since √16384 = 128, the relative standard error is 1.04 / 128 ≈ 0.008125 (0.81%)."
    },
    {
      id: "m04-hll-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Small-Range LinearCounting Correction in HyperLogLog",
      prompt: "When only $n = 500$ distinct elements have been inserted into a HyperLogLog with $m = 16{,}384$ registers, the raw harmonic mean estimator $E = \\alpha_m m^2 / \\sum 2^{-M[j]}$ exhibits a large positive bias because over $96\\%$ of the registers are still `0`.",
      question: "When $E \\le \\frac{5}{2}m$ and the number of zero registers $V > 0$, how does standard HyperLogLog correct this small-cardinality bias?",
      options: [
        "It switches to the LinearCounting (balls-and-bins) estimator E* = m ln(m / V), which models the fraction V/m ≈ e^{-n/m} of empty buckets.",
        "It switches to an exact std::unordered_set and hashes all raw keys on disk.",
        "It multiplies the raw estimate E by V / m to scale down the empty registers.",
        "It discards all registers with M[j] = 0 from the harmonic mean denominator and divides m² by (m - V)."
      ],
      answer: 0,
      explanation: "When n is small relative to m, each register acts like a bin in a classical occupancy problem where the probability a bin remains empty (M[j] = 0) after n balls is (1 - 1/m)^n ≈ e^{-n/m}. Solving V/m = e^{-n/m} yields Whang's LinearCounting estimator n̂ = m ln(m/V), which is vastly more accurate than the HLL harmonic mean when E ≤ 2.5m."
    },
    {
      id: "m04-hll-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Set Intersection Pitfalls with Inclusion-Exclusion on HyperLogLog",
      prompt: "Two distributed shards maintain HyperLogLog sketches $A$ and $B$ with $|A| = 10{,}000{,}000$ and $|B| = 10{,}000{,}000$, and true intersection $|A \\cap B| = 50{,}000$ (Jaccard similarity $J \\approx 0.0025$). An engineer merges $A \\cup B$ via $M_{A \\cup B}[j] = \\max(M_A[j], M_B[j])$ and estimates $|A \\cap B| = \\hat{E}(A) + \\hat{E}(B) - \\hat{E}(A \\cup B)$.",
      question: "Why does this inclusion-exclusion intersection estimate fail catastrophically in production, and what should be used instead?",
      options: [
        "Because the absolute error of HLL on |A ∪ B| ≈ 2×10^7 at 0.81% standard error is ~162,000, which is 3× larger than the true intersection (50,000), swamping the signal in noise (and often returning negative numbers); Theta Sketches or MinHash + HLL should be used for low-Jaccard intersections.",
        "Because taking the register-wise maximum max(M_A[j], M_B[j]) is not a valid lossless union operation for HyperLogLog.",
        "Because 64-bit hash functions begin suffering birthday-paradox collisions at n = 2×10^7, requiring 128-bit hashes.",
        "Because LinearCounting must be applied to |A ∪ B| whenever |A ∩ B| < m."
      ],
      answer: 0,
      explanation: "While register-wise max(M_A[j], M_B[j]) produces an exact HLL sketch for the union A ∪ B, the relative error of ~0.81% applies to the magnitude of the union (~20M), producing ±160K standard deviation. Subtracting two ~10M estimates and a ~20M estimate transfers the variance of the large sets onto the tiny 50K intersection (error magnifies by 1/J). MinHash/Theta Sketches estimate Jaccard similarity directly with error proportional to 1/√(k·J)."
    }
  ],

  "case-rust-hashbrown-swisstable": [
    {
      id: "m04-swiss-q1",
      type: "mcq",
      difficulty: "recall",
      title: "SwissTable 1-Byte Control Metadata and H1/H2 Hash Split",
      prompt: "In Abseil's `flat_hash_map` and Rust's `hashbrown` (SwissTable), a 64-bit hash is split into a 57-bit $H_1$ (probe position) and a 7-bit $H_2$ (fingerprint stored in the control byte).",
      question: "How are the 8 bits of each control byte encoded so that a single SSE2 instruction (`_mm_movemask_epi8`) can classify Empty, Deleted, and Full slots simultaneously?",
      options: [
        "Full slots have their most significant bit (MSB) cleared to 0 and store the 7-bit H2 fingerprint (0b0xxxxxxx); special states have MSB = 1: EMPTY = 0b11111111 (-1 / 0xFF) and DELETED = 0b10000000 (-128 / 0x80).",
        "Full slots set MSB = 1, while EMPTY and DELETED slots both use 0x00 and are distinguished by a secondary bit vector.",
        "The control byte stores the 8-bit Robin Hood probe distance (PSL), with 0xFF reserved for empty slots.",
        "The control byte stores a 4-bit H2 fingerprint and a 4-bit hopscotch displacement offset."
      ],
      answer: 0,
      explanation: "By encoding Full slots as 0b0xxxxxxx (non-negative signed int8, 0..127) and Empty/Deleted/Sentinel with the top bit set (negative signed int8: EMPTY = -128 or -1 depending on Abseil vs hashbrown variant, where MSB=1), _mm_movemask_epi8(ctrl) directly extracts a 16-bit mask of all Empty-or-Deleted slots in 1 cycle, while _mm_cmpeq_epi8(ctrl, _mm_set1_epi8(h2)) matches all slots with the 7-bit fingerprint!"
    },
    {
      id: "m04-swiss-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Bitmask Iteration with Trailing Zeros in SwissTable Lookup",
      prompt: "During a SwissTable lookup, `_mm_movemask_epi8(_mm_cmpeq_epi8(ctrl_group, h2_vec))` returns the 16-bit integer `mask = 0b00000100_00100000` (`0x0420`).",
      question: "How does the lookup loop iterate over the candidate slots within the 16-slot group without branching through all 16 indices?",
      options: [
        "It uses __builtin_ctz(mask) (TZCNT) to jump directly to bit 5, checks slots[pos], and clears the lowest set bit via mask &= (mask - 1) (BLSR) to jump next to bit 10 in exactly 2 iterations.",
        "It executes a 16-iteration for-loop testing (mask >> i) & 1 for i = 0..15.",
        "It binary-searches the 16-bit mask in 4 steps to locate the set bits.",
        "It knows both slots 5 and 10 are guaranteed key matches without calling operator== because 7-bit H2 fingerprints are collision-free within a group."
      ],
      answer: 0,
      explanation: "__builtin_ctz(0x0420) compiles to a single x86 TZCNT instruction returning 5. After testing key equality at offset 5, `mask &= mask - 1` (BLSR instruction) clears bit 5, leaving 0x0400. The next TZCNT returns 10, and the next BLSR yields 0, terminating the inner loop in just 2 iterations. And because 7-bit H2 has a 1/128 false-positive rate, full key equality must still be verified on match."
    },
    {
      id: "m04-swiss-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Why SwissTable Can Operate at 87.5% Load Factor Without Throughput Collapse",
      prompt: "Classical scalar linear probing degrades noticeably above $\\alpha = 0.70$, yet `hashbrown` and `absl::flat_hash_map` default to a maximum load factor of $7/8 = 87.5\\%$.",
      question: "What architectural property of SwissTable makes $\\alpha = 87.5\\%$ fast in practice?",
      options: [
        "Probing happens in units of 16-slot SIMD groups (fitting in a single 16-byte control read) rather than individual scalar slots, and the 1-byte metadata decouples probing from loading large sizeof(K)+sizeof(V) payloads until a 1-in-128 H2 match occurs.",
        "SwissTable uses Robin Hood backward-shift deletion inside each 16-slot group to keep keys sorted by H2.",
        "SwissTable uses 4-way Cuckoo hashing across 4 independent SIMD groups, guaranteeing at most 1 group probe per lookup.",
        "SwissTable allocates a secondary overflow red-black tree whenever a 16-slot group reaches 14 full elements."
      ],
      answer: 0,
      explanation: "At α = 7/8, an average 16-slot group still contains 2 empty slots, so most searches terminate within the very first 16-byte control group! Even when a group is completely full, scanning an entire 16-slot group costs only a single 16-byte SIMD comparison against the contiguous `ctrl_` array—zero cache lines of the actual `Slot { K, V }` array are touched unless the 7-bit H2 fingerprint matches."
    },
    {
      id: "m04-swiss-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Purpose of the Cloned Trailing Control Group (Mirror Bytes)",
      prompt: "When a SwissTable allocates a table of capacity $C = 2^k$ slots, it allocates $C + 16$ bytes for the `ctrl_` array, where `ctrl_[C ... C + 15]` mirrors `ctrl_[0 ... 15]`.",
      question: "Why are the first 15–16 control bytes duplicated at the end of the `ctrl_` array, and what invariant must `set_ctrl(index, h2)` maintain?",
      options: [
        "So an unaligned 16-byte SIMD load `_mm_loadu_si128(&ctrl_[pos])` starting near the end of the table (e.g., pos = C - 3) can seamlessly wrap around and inspect slots [C-3..C-1] and [0..12] in a single instruction; `set_ctrl` must mirror writes to index < 16 into `ctrl_[index + C]`.",
        "To store 16 backup tombstones in case the primary table runs out of deleted-slot markers before a rehash.",
        "To align the `Slot*` payload array to a 4 KB virtual memory page boundary.",
        "To detect buffer overflow attacks via a constant 16-byte stack canary."
      ],
      answer: 0,
      explanation: "SwissTable starts probing at any slot `pos = H1(hash) & mask`, not just multiples of 16. If `pos` is in `[C - 15, C - 1]`, a 16-byte SIMD load starting at `&ctrl_[pos]` reads past index `C - 1`. By mirroring `ctrl_[0..15]` into `ctrl_[C..C+15]` (with a branchless mirror update `ctrl[(i - 16) & mask + (16 & mask)] = h2`), every probe performs a single unaligned 16-byte load without splitting into two loads at the wrap-around boundary!"
    }
  ],

  "build-robin-hood-hash-map": [
    {
      id: "m04-build-q1",
      type: "mcq",
      difficulty: "recall",
      title: "Swapping All State During a Robin Hood Eviction",
      prompt: "In your `RobinHoodMap::insert` loop, the incoming candidate has `dist = 3` and encounters an occupied slot at `idx` whose resident element has `slots_[idx].psl = 1`.",
      question: "After swapping `key` with `slots_[idx].key` and `val` with `slots_[idx].value`, how must `dist` and `slots_[idx].psl` be updated before advancing `idx = (idx + 1) & mask_`?",
      options: [
        "`std::swap(dist, slots_[idx].psl)` so the newly seated key records PSL = 3, and the displaced key resumes probing with its prior PSL = 1 (which is then incremented to 2 as it advances to the next slot).",
        "Set `slots_[idx].psl = 3` and reset `dist = 0`, because the displaced element starts a brand-new probe sequence from `idx`.",
        "Leave `slots_[idx].psl = 1` unchanged and increment `dist` to 4.",
        "Increment both `slots_[idx].psl` and `dist` by 1 without swapping them."
      ],
      answer: 0,
      explanation: "The displaced key is ALREADY `slots_[idx].psl` steps away from its own home bucket! When it gets evicted to `idx + 1`, its distance from its home bucket becomes `old_psl + 1`. Therefore you must swap `dist` with `slots_[idx].psl` (storing the incoming element's `dist = 3` into the slot and loading the displaced element's `1` into `dist`), and then increment `dist++` as `idx` advances."
    },
    {
      id: "m04-build-q2",
      type: "mcq",
      difficulty: "apply",
      title: "Tracing Backward-Shift Deletion Across Cluster Boundaries",
      prompt: "Consider a 8-slot Robin Hood table (`mask_ = 7`) where indices 2, 3, 4, and 5 are occupied with `(key, home, psl)` equal to: Slot 2: `(A, 2, 0)`, Slot 3: `(B, 2, 1)`, Slot 4: `(C, 4, 0)`, Slot 5: `(D, 3, 2)`.",
      question: "If `erase(A)` is called (removing Slot 2), what is the exact state of Slots 2, 3, 4, and 5 after backward-shift deletion completes?",
      options: [
        "Slot 2 holds (B, home=2, psl=0); Slot 3 becomes EMPTY (psl=0) because Slot 4's C has psl=0 (at its home bucket) and stops the backward shift; Slots 4 and 5 remain (C, 4, 0) and (D, 3, 2).",
        "Slots 3, 4, and 5 all shift left by one position so Slot 2=(B,2,0), Slot 3=(C,4,-1), Slot 4=(D,3,1), and Slot 5=EMPTY.",
        "Slot 2 is marked with a TOMBSTONE sentinel and no elements move.",
        "Slot 2 holds (D, 3, 0) because D had the largest PSL in the cluster."
      ],
      answer: 0,
      explanation: " Wait—let's check the Robin Hood invariant on the initial state! In a valid Robin Hood table, could Slot 4 have (C,4,0) while Slot 5 has (D,3,2)? No! Because when D (home=3) probed through Slot 4 (where D had dist=1 and C had psl=0), D would have evicted C from Slot 4! Thus in a valid Robin Hood table, if Slot 4 has psl=0, no element at Slot 5 can have a home ≤ 4. Consequently, backward shift at `erase(A)` shifts Slot 3 (B, psl=1 → 0) into Slot 2, then inspects Slot 4 (`C.psl == 0`), and immediately terminates, marking Slot 3 empty."
    },
    {
      id: "m04-build-q3",
      type: "mcq",
      difficulty: "apply",
      title: "Early-Exit Lookup Condition in Robin Hood Hashing",
      prompt: "You call `find(k)` on a `RobinHoodMap`. The key hashes to home index `idx = 10` (`dist = 0`). Slot 10 is occupied by another key with `psl = 2`. Slot 11 is occupied by another key with `psl = 3`. Slot 12 is occupied by another key with `psl = 1`.",
      question: "At which slot does `find(k)` terminate and why?",
      options: [
        "At Slot 12: at that step `dist == 2`, which is strictly greater than `slots_[12].psl == 1`; if `k` had been in the table, it would have stolen Slot 12 from that resident during insertion.",
        "At Slot 10: because `dist == 0 < slots_[10].psl == 2`, `find` immediately returns `nullptr`.",
        "It must continue scanning after Slot 12 until it hits an empty slot (`psl == 0`), because backward-shift deletion can temporarily break PSL monotonicity.",
        "At Slot 11: because `slots_[11].psl == 3` exceeds the maximum allowed PSL of 2."
      ],
      answer: 0,
      explanation: "At Slot 10, `dist = 0 ≤ psl = 2` (continue). At Slot 11, `dist = 1 ≤ psl = 3` (continue). At Slot 12, our search candidate is at `dist = 2` from its home (10), whereas the resident of Slot 12 is only at `psl = 1` from its home (11). By the Robin Hood invariant, a key with `dist = 2` would have evicted a key with `psl = 1` at Slot 12. Hence `k` cannot exist anywhere in the table, and `find` returns `nullptr` without scanning the rest of the cluster."
    },
    {
      id: "m04-build-q4",
      type: "mcq",
      difficulty: "staff",
      title: "Why Store 1-Indexed PSL (0 = Empty) Instead of a Separate `bool occupied` + `uint32_t psl`",
      prompt: "In the build lab, each `Slot` stores `uint8_t psl` where `0` means empty and `d >= 1` means occupied with Probe Sequence Length $d - 1$, rather than `bool occupied; size_t psl;`.",
      question: "How does this representation impact struct padding, cache-line density, and probing loops for `RobinHoodMap<uint64_t, uint64_t>`?",
      options: [
        "A separate `bool` + `size_t` adds 16 bytes of metadata+padding (making each slot 32 bytes, 2 slots/cache line), whereas packing `uint8_t psl` (or packing it into key/control metadata) fuses the emptiness check and Robin Hood comparison (`dist > slot.psl`) into a single integer comparison (`0` naturally fails `dist > 0` only after replacement).",
        "Storing `0` for empty prevents the table from storing keys at their home bucket (`PSL = 0`), forcing every key to shift by 1 slot.",
        "Using `uint8_t` causes undefined behavior whenever the table capacity exceeds 256 elements.",
        "A separate `bool` and `size_t` uses less memory on 64-bit architectures due to register alignment."
      ],
      answer: 0,
      explanation: "With `dist` starting at `1` (1-indexed PSL) and `psl == 0` representing an empty slot, the condition `dist > slots_[idx].psl` is simultaneously true for BOTH an empty slot (`dist >= 1 > 0`) AND a wealthier resident (`dist > resident_psl`)! This eliminates a separate branch for `if (!slot.occupied)` in the lookup early-exit and cuts metadata footprint from 16 bytes down to 1 byte."
    }
  ]
});
