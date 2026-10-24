window.QUESTION_BANK = window.QUESTION_BANK || {};

window.QUESTION_BANK["suffix-trees-ukkonen-intuition"] = [
  {
    "id": "q11-ukkonen-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Why Appending a Unique Sentinel `'$'` Is Necessary for an Explicit Suffix Tree",
    "prompt": "Suppose you build a compressed trie of all suffixes of $S = \\texttt{\"abcab\"}$ WITHOUT appending a unique terminal character `'$'`.",
    "question": "Why does the resulting tree have fewer than $|S| = 5$ leaves, and how does appending `'$'` fix this?",
    "options": [
      "Without `'$'`, suffixes `\"ab\"` and `\"b\"` are proper prefixes of longer suffixes (`\"abcab\"` and `\"bcab\"`), so their paths end inside internal nodes or midway along edges (an implicit suffix tree); appending `'$'` (`'$' \\notin \\Sigma`) ensures no suffix is a prefix of another suffix, forcing all $N$ suffixes to terminate at $N$ distinct leaves",
      "Without `'$'`, the tree has $O(N^2)$ nodes because path compression cannot merge unary nodes",
      "Appending `'$'` reduces the alphabet size by $1$",
      "Without `'$'`, Ukkonen's Rule 3 can never trigger"
    ],
    "answer": 0,
    "explanation": "A suffix $S[i..N-1]$ ends at a leaf if and only if it never appears earlier in $S$ followed by another character. If $S$ ends with a repeated substring like `\"ab\"`, those shorter suffixes are prefixes of earlier suffixes and lie inside the tree. Appending `'$'` guarantees every suffix ends with a character that never appeared earlier."
  },
  {
    "id": "q11-ukkonen-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Ukkonen's Rule 3 (Showstopper) & Phase Termination",
    "prompt": "During phase $i$ of Ukkonen's online Suffix Tree construction, the algorithm attempts to append character $c = S[i]$ to the longest unbranched suffix $S[i - \\text{rem} + 1 .. i - 1]$ at the Active Point, and discovers that an outgoing transition starting with $c$ ALREADY exists at the Active Point (Rule 3).",
    "question": "What does Ukkonen's algorithm do when Rule 3 triggers, and why is this sound?",
    "options": [
      "It increments `active_len++` (canonicalizing the Active Point if it reaches the end of the active edge) and immediately breaks out of phase $i$ without decrementing `rem`, because if $S[j..i]$ already occurs in $S[0..i-1]$, every shorter suffix $S[j+1..i], \\dots, S[i..i]$ is a prefix of that occurrence and is also already present in the tree",
      "It splits the active edge, creates a leaf, and continues looping until `rem == 0`",
      "It resets `rem = 0` and jumps the Active Point back to the root",
      "It follows the suffix link of `active_node` and checks all shorter suffixes one by one"
    ],
    "answer": 0,
    "explanation": "If the longest remaining suffix $S[j..i]$ already appears inside the current tree, then every shorter suffix $S[k..i]$ ($k > j$) is a suffix of $S[j..i]$ and therefore already appears inside the tree as well! Leaving `rem` unchanged remembers these implicit suffixes so they will be branched together in a future phase when a mismatching character finally forces Rule 2."
  },
  {
    "id": "q11-ukkonen-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Amortized Cost of Skip/Count Edge Walking",
    "prompt": "When Ukkonen's algorithm follows a suffix link `active_node = link[active_node]` (or decrements `active_len--` at the root), `active_len` may exceed the length `len` of the edge on the new branch, requiring a `while (active_len >= len)` loop (the Skip/Count trick) that hops down internal nodes.",
    "question": "Why does the Skip/Count `while` loop execute at most $O(N)$ times in total across the entire construction of a length-$N$ Suffix Tree?",
    "options": [
      "Every iteration of the Skip/Count loop strictly decreases `active_len` by `len >= 1`, whereas `active_len` only ever increases by $+1$ at the end of a phase (Rule 3, at most $N$ times total) and never increases during Suffix Link hops",
      "Because a Suffix Tree has depth at most $\\log_2 N$",
      "Because each edge in a Suffix Tree has length $1$",
      "Because Skip/Count resets `active_len = 0` on its first iteration"
    ],
    "answer": 0,
    "explanation": "Use `active_len` as a potential function $\\Phi \\ge 0$: across all $N$ phases, `active_len` is incremented by $+1$ at most once per phase ($\\le N$ increments total). Following a suffix link keeps `active_len` unchanged (or decreases it by $1$ at the root), while every Skip/Count hop across an edge of length $\\text{len} \\ge 1$ reduces `active_len` by at least $1$. Thus total Skip/Count hops cannot exceed $N$."
  },
  {
    "id": "q11-ukkonen-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Generalized Suffix Tree for $K$ Strings & Sentinel Pitfall",
    "prompt": "You want to find the longest substring common to all $K$ strings $S_1, S_2, \\dots, S_K$ by concatenating them with separators into $S_1 \\#_1 S_2 \\#_2 \\dots S_K \\#_K$ and building a single Ukkonen Suffix Tree.",
    "question": "If you use the SAME separator character `'#'` between every pair of strings instead of distinct sentinels $\\#_1 \\neq \\#_2 \\neq \\dots \\neq \\#_K$ (or clamping edge right-endpoints to the next `'#'`), what bug occurs?",
    "options": [
      "A single edge or matched prefix can span across `'#'` from $S_a$ into $S_b$, creating false common substrings that contain `'#'`, and suffixes of $S_a$ identical to suffixes of $S_b$ will merge instead of creating distinct leaves per string",
      "Ukkonen's algorithm enters an infinite loop whenever `'#'` appears twice",
      "The tree size blows up to $\\Theta(N^2)$ nodes",
      "Using the same `'#'` works identically without any modification"
    ],
    "answer": 0,
    "explanation": "If the same character `'#'` is reused without clamping leaf edges at their string's terminator, two suffixes ending with the same characters followed by `'#'` will share the `'#'` transition and continue matching into the next string $S_{a+1}$! Either use distinct sentinels $\\#_1, \\dots, \\#_K$ or clamp each leaf's right endpoint to its string's terminator index."
  }
];

window.QUESTION_BANK["suffix-arrays-prefix-doubling-sais"] = [
  {
    "id": "q11-sa-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Single-Counting-Sort Optimization in Manber-Myers Prefix Doubling",
    "prompt": "At step $h$ of Manber-Myers prefix doubling (transitioning from length $2^h$ to $2^{h+1}$), each cyclic shift $i$ is ranked by the pair $(c[i],\\; c[(i + 2^h) \\bmod N])$. Naive radix sort runs two counting sorts per step (one on the second element, then one on the first).",
    "question": "How does the standard $O(N \\log N)$ implementation avoid the counting sort on the second element?",
    "options": [
      "The array `sa[0..N-1]` from the end of step $h-1$ is ALREADY sorted by $2^h$-prefixes; shifting each entry backward by $2^h$ (`pn[i] = (sa[i] - 2^h + N) % N`) directly yields the indices ordered by their second half $c[(pn[i] + 2^h) \\bmod N] = c[sa[i]]$, requiring only one stable counting sort on $c[pn[i]]$",
      "It sorts only the first element and breaks ties randomly",
      "It packs both 32-bit integers into a 64-bit integer and runs a 64-bit counting sort",
      "It uses `std::sort` on the second half"
    ],
    "answer": 0,
    "explanation": "Since `sa[0..N-1]` lists positions in non-decreasing order of $c[\\text{sa}[i]]$, the shifted index `pn[i] = (sa[i] - 2^h + N) % N` has second-half key $c[(\\text{pn}[i] + 2^h) \\bmod N] = c[\\text{sa}[i]]$. Thus `pn[0..N-1]` is already sorted by the secondary key, cutting the number of counting-sort passes in half!"
  },
  {
    "id": "q11-sa-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "SA-IS L-Type, S-Type, and LMS Classification",
    "prompt": "In the SA-IS ($O(N)$ Induced Sorting) algorithm, suffix $i$ is S-type if $S[i..] < S[i+1..]$ and L-type if $S[i..] > S[i+1..]$, with sentinel $S[N-1] = \\texttt{'\\$'}$ defined as S-type. An index $i > 0$ is an LMS (Leftmost S-type) position if $i$ is S-type and $i - 1$ is L-type.",
    "question": "For $S = \\texttt{\"mmiissiissiippii\\$\"}$ (or any string of length $N$), why can there be at most $\\lfloor N / 2 \\rfloor$ LMS positions?",
    "options": [
      "Because every LMS position $i$ must be immediately preceded by an L-type position $i - 1$, so no two LMS positions can ever be adjacent (and index $0$ can never be LMS)",
      "Because exactly half of all characters in ASCII are vowels",
      "Because S-type suffixes only occur at even indices",
      "Because SA-IS deletes every second character before classifying"
    ],
    "answer": 0,
    "explanation": "By definition, $i$ is LMS iff $\\text{type}[i] == \\text{S}$ and $\\text{type}[i-1] == \\text{L}$. Consequently, if $i$ is LMS, $i-1$ is L-type (not LMS) and $i+1$ has $\\text{type}[(i+1)-1] = \\text{type}[i] = \\text{S}$ (so $i+1$ cannot be LMS either). This guarantees $|\\text{LMS}| \\le \\lfloor N / 2 \\rfloor$, giving the recursive bound $T(N) = T(N/2) + O(N) = O(N)$."
  },
  {
    "id": "q11-sa-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Relative Order of L-Type and S-Type Suffixes Within a Character Bucket",
    "prompt": "Consider all suffixes of $S$ that start with the same character $c \\in \\Sigma$ (the $c$-bucket in the Suffix Array). Some of these suffixes are L-type and some are S-type.",
    "question": "In the sorted Suffix Array, how are the L-type and S-type suffixes arranged inside bucket $c$?",
    "options": [
      "Every L-type suffix starting with $c$ appears strictly BEFORE every S-type suffix starting with $c$ (so the $c$-bucket partitions into `[L-type sub-bucket | S-type sub-bucket]`)",
      "Every S-type suffix starting with $c$ appears strictly BEFORE every L-type suffix starting with $c$",
      "L-type and S-type suffixes alternate at even and odd ranks inside bucket $c$",
      "Their relative order depends on the length of the suffixes"
    ],
    "answer": 0,
    "explanation": "An L-type suffix starting with $c$ has the form $c^k d \\dots$ where $d < c$ (since $S[i..] > S[i+1..]$), whereas an S-type suffix starting with $c$ has the form $c^m e \\dots$ where $e > c$ (since $S[j..] < S[j+1..]$). Comparing $c^k d \\dots$ against $c^m e \\dots$ always resolves as $c^k d \\dots < c^m e \\dots$ at position $\\min(k, m)$! Therefore all L-type suffixes precede all S-type suffixes in every bucket."
  },
  {
    "id": "q11-sa-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Accelerating Suffix Array Pattern Search from $O(M \\log N)$ to $O(M + \\log N)$",
    "prompt": "Standard binary search for pattern $P[0..M-1]$ in a Suffix Array $\\text{SA}[0..N-1]$ takes $O(M \\log N)$ time in the worst case because each of the $\\log_2 N$ binary search probes may compare up to $M$ characters from scratch.",
    "question": "How did Manber and Myers reduce pattern search to $O(M + \\log N)$ time without building a full Suffix Tree or FM-Index?",
    "options": [
      "During binary search on interval $[L, R]$, maintain $l = \\text{LCP}(P, \\text{SA}[L])$ and $r = \\text{LCP}(P, \\text{SA}[R])$, and precompute the midpoint LCPs $\\text{LCP}(\\text{SA}[L], \\text{SA}[M])$ and $\\text{LCP}(\\text{SA}[M], \\text{SA}[R])$ on the binary search tree; comparing the known tree LCP against $\\max(l, r)$ either decides which half to take in $O(1)$ time without touching $P$, or resumes character comparisons starting at index $\\max(l, r)$",
      "Hash the pattern $P$ with CRC32 and binary search the hash values",
      "Only compare the first and last characters of $P$ at each binary search step",
      "Use interpolation search instead of binary search"
    ],
    "answer": 0,
    "explanation": "If $l \\ge r$ and $\\text{LCP}(\\text{SA}[L], \\text{SA}[M]) > l$, then $\\text{SA}[M]$ agrees with $\\text{SA}[L]$ past the point where $P$ mismatched $\\text{SA}[L]$, so $\\text{LCP}(P, \\text{SA}[M]) = l$ and $P$ lies in the other half in $O(1)$ time! Characters of $P$ are only compared when $\\text{LCP}(\\text{SA}[L], \\text{SA}[M]) == l$, in which case every successful character comparison advances $\\max(l, r)$ toward $M$, giving $O(M + \\log N)$ total comparisons."
  }
];

window.QUESTION_BANK["kasai-lcp-array-rmq"] = [
  {
    "id": "q11-kasai-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Kasai's Core Inequality",
    "prompt": "In Kasai's $O(N)$ LCP construction algorithm, we iterate through suffixes in text order $i = 0, 1, \\dots, N-1$ rather than sorted Suffix Array order $r = 0, 1, \\dots, N-1$.",
    "question": "If suffix $S[i..]$ at rank $r = \\text{rank}[i] < N - 1$ has $\\text{lcp}[r] = h > 0$ with its immediate successor $j = \\text{SA}[r + 1]$, what lower bound holds for the next text suffix $S[i + 1..]$ at rank $r' = \\text{rank}[i + 1]$?",
    "options": [
      "$\\text{lcp}[\\text{rank}[i + 1]] \\ge h - 1$, because $S[i + 1..]$ and $S[j + 1..]$ still share at least $h - 1$ characters and $S[i + 1..] < S[j + 1..]$, so the immediate neighbor $\\text{SA}[\\text{rank}[i + 1] + 1]$ must share at least $h - 1$ characters with $S[i + 1..]$",
      "$\\text{lcp}[\\text{rank}[i + 1]] = h + 1$",
      "$\\text{lcp}[\\text{rank}[i + 1]] \\le h - 1$",
      "$\\text{lcp}[r + 1] \\ge h - 1$ in sorted rank order"
    ],
    "answer": 0,
    "explanation": "Deleting the first matched character $S[i] = S[j]$ leaves a common prefix of length $h - 1$ between $S[i+1..]$ and $S[j+1..]$ while preserving their lexicographical order ($\\text{rank}[i+1] < \\text{rank}[j+1]$). Since LCP between two suffixes is the minimum of adjacent LCPs between their ranks, the first adjacent LCP $\\text{lcp}[\\text{rank}[i+1]]$ must be $\\ge \\text{LCP}(S[i+1..], S[j+1..]) = h - 1$."
  },
  {
    "id": "q11-kasai-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Counting Distinct Substrings from SA and LCP",
    "prompt": "For $S = \\texttt{\"abab\"}$ ($N = 4$), the sorted suffixes are:\n- Rank 0: `\"ab\"` ($\\text{SA}[0] = 2$)\n- Rank 1: `\"abab\"` ($\\text{SA}[1] = 0$), with $\\text{lcp}[0] = \\text{LCP}(\\texttt{\"ab\"}, \\texttt{\"abab\"}) = 2$\n- Rank 2: `\"b\"` ($\\text{SA}[2] = 3$), with $\\text{lcp}[1] = \\text{LCP}(\\texttt{\"abab\"}, \\texttt{\"b\"}) = 0$\n- Rank 3: `\"bab\"` ($\\text{SA}[3] = 1$), with $\\text{lcp}[2] = \\text{LCP}(\\texttt{\"b\"}, \\texttt{\"bab\"}) = 1$",
    "question": "Using the formula $\\frac{N(N+1)}{2} - \\sum_{r=0}^{N-2} \\text{lcp}[r]$, how many distinct non-empty substrings does `\"abab\"` have?",
    "options": [
      "$\\frac{4 \\times 5}{2} - (2 + 0 + 1) = 10 - 3 = 7$ (`\"a\"`, `\"ab\"`, `\"aba\"`, `\"abab\"`, `\"b\"`, `\"ba\"`, `\"bab\"`)",
      "$10 + 3 = 13$",
      "$4^2 - 3 = 13$",
      "$10 - 2 = 8$"
    ],
    "answer": 0,
    "explanation": "Out of the $\\frac{4 \\times 5}{2} = 10$ total non-empty substrings (prefixes of all suffixes), $\\text{lcp}[0] = 2$ (`\"a\"`, `\"ab\"`) and $\\text{lcp}[2] = 1$ (`\"b\"`) are duplicate prefixes already counted in the preceding sorted suffix. Subtracting $2 + 0 + 1 = 3$ leaves $7$ distinct substrings."
  },
  {
    "id": "q11-kasai-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "RMQ Range Bounds for Arbitrary Suffix LCP",
    "prompt": "We define $\\text{lcp}[k] = \\text{LCP}(\\text{SA}[k], \\text{SA}[k + 1])$ for $0 \\le k \\le N - 2$. Suppose two suffixes $S[i..]$ and $S[j..]$ have sorted ranks $r_1 = \\text{rank}[i] = 2$ and $r_2 = \\text{rank}[j] = 5$.",
    "question": "Which Range Minimum Query on `lcp[]` computes $\\text{LCP}(S[i..], S[j..])$?",
    "options": [
      "$\\min(\\text{lcp}[2],\\; \\text{lcp}[3],\\; \\text{lcp}[4])$, i.e., the half-open index range $[r_1,\\; r_2) = [2, 5)$",
      "$\\min(\\text{lcp}[2],\\; \\text{lcp}[3],\\; \\text{lcp}[4],\\; \\text{lcp}[5])$, i.e., the closed range $[2, 5]$",
      "$\\min(\\text{lcp}[1],\\; \\text{lcp}[2],\\; \\text{lcp}[3],\\; \\text{lcp}[4])$",
      "$\\text{lcp}[2] + \\text{lcp}[5]$"
    ],
    "answer": 0,
    "explanation": "Between ranks $2$ and $5$ there are $5 - 2 = 3$ adjacent steps: $(2, 3)$ stored at $\\text{lcp}[2]$, $(3, 4)$ stored at $\\text{lcp}[3]$, and $(4, 5)$ stored at $\\text{lcp}[4]$. Including $\\text{lcp}[5] = \\text{LCP}(\\text{SA}[5], \\text{SA}[6])$ is an off-by-one error that leaks information from rank $6$."
  },
  {
    "id": "q11-kasai-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Sum of $\\text{LCP}(S[i..], S[j..])$ Over All Pairs $0 \\le i < j < N$",
    "prompt": "You are asked to compute $\\sum_{0 \\le i < j < N} \\text{LCP}(S[i..], S[j..])$ for a string of length $N = 2 \\times 10^5$ in $O(N \\log N)$ or $O(N)$ time.",
    "question": "How is this all-pairs LCP sum reduced to a classic linear-time problem on Kasai's `lcp[0..N-2]` array?",
    "options": [
      "Since $\\text{LCP}(\\text{SA}[r_1], \\text{SA}[r_2]) = \\min_{r_1 \\le k < r_2} \\text{lcp}[k]$, the problem is identical to finding the sum of minimums of all contiguous subarrays of `lcp[0..N-2]`, which is solved in $O(N)$ time using a monotonic stack (finding previous smaller and next smaller-or-equal elements)",
      "It equals $(N - 1) \\sum_{k=0}^{N-2} \\text{lcp}[k]$",
      "It requires $O(N^2)$ Sparse Table queries",
      "It equals the maximum element in `lcp[]` multiplied by $\\binom{N}{2}$"
    ],
    "answer": 0,
    "explanation": "Reindexing pairs $(i, j)$ by their sorted Suffix Array ranks $(r_1, r_2)$ with $0 \\le r_1 < r_2 < N$ shows that every pair $(r_1, r_2)$ corresponds bijectively to a contiguous subarray $\\text{lcp}[r_1 .. r_2 - 1]$ of the LCP array, and its value is the subarray minimum! A standard monotonic stack computes the sum of minimums of all subarrays of `lcp[0..N-2]` in $O(N)$ time."
  }
];

window.QUESTION_BANK["suffix-automaton-sam-endpos"] = [
  {
    "id": "q11-sam-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Structure of Substrings Within a Single SAM State",
    "prompt": "Each state $u > 0$ in a Suffix Automaton (SAM) corresponds to an equivalence class of non-empty substrings of $S$ that have the exact same set of ending positions $\\text{endpos}(u)$.",
    "question": "If $\\text{len}[u]$ is the length of the longest substring in state $u$ and $\\text{link}[u]$ is $u$'s suffix link, which strings belong to state $u$?",
    "options": [
      "All suffixes of $u$'s longest string $W(u)$ whose lengths fall in the contiguous interval $[\\text{len}[\\text{link}[u]] + 1,\\; \\text{len}[u]]$, giving exactly $\\text{len}[u] - \\text{len}[\\text{link}[u]]$ distinct substrings",
      "All prefixes of $W(u)$ of length at most $\\text{len}[u]$",
      "Only a single string of length $\\text{len}[u]$",
      "All anagrams of $W(u)$ that appear in $S$"
    ],
    "answer": 0,
    "explanation": "If two substrings $x$ and $y$ ($|x| \\le |y|$) share the same $\\text{endpos}$ set, $x$ must be a suffix of $y$, and every suffix $z$ of $y$ with $|x| \\le |z| \\le |y|$ satisfies $\\text{endpos}(y) \\subseteq \\text{endpos}(z) \\subseteq \\text{endpos}(x) = \\text{endpos}(y)$. The suffix link $\\text{link}[u]$ points to the longest suffix of $W(u)$ whose $\\text{endpos}$ set is strictly larger, so state $u$ holds all lengths in $[\\text{len}[\\text{link}[u]] + 1,\\; \\text{len}[u]]$."
  },
  {
    "id": "q11-sam-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Why State Cloning Happens When $\\text{len}[q] > \\text{len}[p] + 1$",
    "prompt": "During `extend(c)` at index $i$, we walk up the suffix link chain from `last` and stop at the first state $p$ that already has a transition $q = \\text{next}[p][c]$. Suppose $\\text{len}[q] > \\text{len}[p] + 1$.",
    "question": "Why can't we simply set $\\text{link}[\\text{cur}] = q$, and why must we clone state $q$ into a new state `clone` with $\\text{len}[\\text{clone}] = \\text{len}[p] + 1$?",
    "options": [
      "Because suffixes of $S[0..i]$ passing through $p \\xrightarrow{c} q$ have length at most $\\text{len}[p] + 1$; strings in $q$ of length $> \\text{len}[p] + 1$ are NOT suffixes of $S[0..i]$ and do NOT gain the new ending position $i$, splitting $q$'s equivalence class into two!",
      "Because a state in a SAM is not allowed to have more than 2 incoming edges",
      "Because $q$ is always the root state $0$",
      "To balance the height of the Suffix Link Tree like an AVL rotation"
    ],
    "answer": 0,
    "explanation": "Before index $i$, all strings in $q$ of lengths $[\\text{minlen}[q], \\text{len}[q]]$ shared the same $\\text{endpos}$ set. At index $i$, the suffix of length $\\text{len}[p] + 1$ (and shorter suffixes in $q$) just occurred again at position $i$, whereas strings in $q$ of length $> \\text{len}[p] + 1$ did NOT occur at position $i$. Cloning $q$ separates $q$ into `clone` (lengths $\\le \\text{len}[p] + 1$, which gain $i$ in $\\text{endpos}$) and $q$ (lengths $> \\text{len}[p] + 1$, whose $\\text{endpos}$ is unchanged)."
  },
  {
    "id": "q11-sam-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Computing $|\\text{endpos}(u)|$ (Substring Occurrence Frequency) on a SAM",
    "prompt": "You want to answer queries of the form: given pattern $P$, how many times does $P$ appear in $S$? After walking $P$ from the root of the SAM to state $u$, the answer is $|\\text{endpos}(u)|$.",
    "question": "How is `cnt[u] = |endpos(u)|` initialized during SAM construction and aggregated in $O(N)$ time afterward?",
    "options": [
      "Initialize `cnt[cur] = 1` for every primary state created by `extend(c)` and `cnt[clone] = 0` for every cloned state; after construction, sort states in decreasing order of `len[u]` and accumulate `cnt[link[u]] += cnt[u]`",
      "Initialize `cnt[u] = 1` for both primary and cloned states and accumulate `cnt[link[u]] += cnt[u]`",
      "Count the number of incoming DAG transitions to state $u$",
      "Compute `len[u] - len[link[u]]`"
    ],
    "answer": 0,
    "explanation": "Each prefix $S[0..i]$ ends at a unique primary state `cur_i`, corresponding to the ending position $i \\in \\{0, \\dots, N-1\\}$. A substring in state $u$ ends at position $i$ if and only if $u$ is an ancestor of `cur_i` in the Suffix Link Tree! Giving primary states weight $1$ and cloned states weight $0$ ensures that summing weights bottom-up on the Link Tree counts the exact number of ending positions in $\\text{endpos}(u)$."
  },
  {
    "id": "q11-sam-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Exact Worst-Case State and Transition Bounds of a Suffix Automaton",
    "prompt": "For any string $S$ of length $N \\ge 3$, what are the tightest worst-case upper bounds on the number of states $|V|$ and directed transitions $|E|$ in its Suffix Automaton, and what string families achieve them?",
    "options": [
      "$|V| \\le 2N - 1$ (achieved by $S = \\texttt{\"abbb...b\"}$) and $|E| \\le 3N - 4$ (achieved by $S = \\texttt{\"abbb...bc\"}$)",
      "$|V| \\le N + 1$ and $|E| \\le 2N$",
      "$|V| \\le 4N$ and $|E| \\le N \\log_2 N$",
      "$|V| \\le 2N - 1$ and $|E| \\le 2N - 2$"
    ],
    "answer": 0,
    "explanation": "The first two characters create at most 3 states without clones, and each of the remaining $N - 2$ characters creates 1 primary state and at most 1 clone: $3 + 2(N - 2) = 2N - 1$ states (achieved on $\\texttt{\"ab\"}^{N-1}$ or $\\texttt{\"abbb...b\"}$). For transitions, a spanning tree of longest paths from the root uses $|V| - 1 \\le 2N - 2$ edges, and each suffix $S[i..N-1]$ contributes at most 1 non-tree shortcut edge along the path before merging, yielding $|E| \\le (2N - 2) + (N - 2) = 3N - 4$ (achieved on $\\texttt{\"ab\"}^{N-2}\\texttt{\"c\"}$)."
  }
];

window.QUESTION_BANK["burrows-wheeler-transform-fm-index"] = [
  {
    "id": "q11-bwt-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Relationship Between BWT and the Suffix Array",
    "prompt": "Let $S[0..N-1]$ be a string terminated by a unique smallest sentinel $S[N-1] = \\texttt{'\\$'}$, and let $\\text{SA}[0..N-1]$ be its Suffix Array.",
    "question": "How is the $r$-th character $L[r]$ of the Burrows-Wheeler Transform defined directly from $S$ and $\\text{SA}[r]$?",
    "options": [
      "$L[r] = S[(\\text{SA}[r] - 1 + N) \\bmod N]$, i.e., $S[\\text{SA}[r] - 1]$ when $\\text{SA}[r] > 0$ and $S[N - 1] = \\texttt{'\\$'}$ when $\\text{SA}[r] == 0$",
      "$L[r] = S[\\text{SA}[r]]$, the first character of suffix $\\text{SA}[r]$",
      "$L[r] = S[N - 1 - \\text{SA}[r]]$",
      "$L[r] = S[(\\text{SA}[r] + 1) \\bmod N]$"
    ],
    "answer": 0,
    "explanation": "Row $r$ of the sorted cyclic rotation matrix starts with suffix $S[\\text{SA}[r]..N-1]$ followed by the wrapped-around prefix $S[0..\\text{SA}[r]-1]$. Therefore, the last character of row $r$ is the character immediately preceding index $\\text{SA}[r]$ in cyclic order: $S[(\\text{SA}[r] - 1 + N) \\bmod N]$."
  },
  {
    "id": "q11-bwt-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Why the Last-to-First (LF) Property Holds",
    "prompt": "The LF-Mapping theorem states that the $k$-th occurrence of character $c$ in the last column $L$ corresponds to the exact same text character as the $k$-th occurrence of $c$ in the first column $F$.",
    "question": "What mathematical property of cyclic rotations guarantees that the relative top-to-bottom order of all $c$'s in $L$ equals their relative top-to-bottom order in $F$?",
    "options": [
      "Every row in $L$ ending with $c$ is sorted by its prefix (the suffix following $c$), and every row in $F$ starting with $c$ is ALSO sorted by the exact same suffix following $c$; prepending the identical character $c$ to two suffixes preserves their lexicographical order",
      "Because all occurrences of $c$ in $L$ are always contiguous",
      "Because `std::stable_sort` is used to sort the BWT",
      "Because the sentinel `'$'` sits at row $0$"
    ],
    "answer": 0,
    "explanation": "Consider two rows ending with $c$ in $L$, representing cyclic shifts $X c$ and $Y c$ ($X < Y$). When rotated right by 1 character, they become rows $c X$ and $c Y$ in $F$. Since $X < Y \\iff c X < c Y$, their top-to-bottom order in $L$ is identical to their top-to-bottom order in $F$!"
  },
  {
    "id": "q11-bwt-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Tracing FM-Index Backward Search",
    "prompt": "On $S = \\texttt{\"banana\\$\"}$ ($N = 7$), the first column $F$ has bucket starts $C[\\texttt{'\\$'}] = 0$, $C[\\texttt{'a'}] = 1$, $C[\\texttt{'b'}] = 4$, $C[\\texttt{'n'}] = 5$, and the BWT is $L = \\texttt{\"annb\\$aa\"}$. Suppose we search for $P = \\texttt{\"na\"}$. After processing the last character $\\texttt{'a'}$, the active half-open interval of $\\texttt{'a'}$-suffixes is $[sp, ep) = [1, 4)$.",
    "question": "In the next backward step for character $c = \\texttt{'n'}$, what are $\\text{Occ}(\\texttt{'n'}, 1)$ (count of `'n'` in $L[0..0]$) and $\\text{Occ}(\\texttt{'n'}, 4)$ (count of `'n'` in $L[0..3]$), and what is the resulting interval $[sp_{\\text{new}}, ep_{\\text{new}})$ for `\"na\"`?",
    "options": [
      "$\\text{Occ}(\\texttt{'n'}, 1) = 0$ and $\\text{Occ}(\\texttt{'n'}, 4) = 2$, giving $[sp_{\\text{new}}, ep_{\\text{new}}) = [5 + 0,\\; 5 + 2) = [5, 7)$ ($7 - 5 = 2$ occurrences of `\"na\"`)",
      "$\\text{Occ}(\\texttt{'n'}, 1) = 1$ and $\\text{Occ}(\\texttt{'n'}, 4) = 2$, giving $[6, 7)$ ($1$ occurrence)",
      "$\\text{Occ}(\\texttt{'n'}, 1) = 0$ and $\\text{Occ}(\\texttt{'n'}, 4) = 3$, giving $[5, 8)$",
      "$[1, 3)$"
    ],
    "answer": 0,
    "explanation": "In $L = \\texttt{\"annb\\$aa\"}$, the prefix of length $1$ is $L[0..0] = \\texttt{\"a\"}$ ($0$ `'n'`s), and the prefix of length $4$ is $L[0..3] = \\texttt{\"annb\"}$ ($2$ `'n'`s at indices 1 and 2). Adding $C[\\texttt{'n'}] = 5$ gives $[5 + 0, 5 + 2) = [5, 7)$, corresponding to rows 5 (`\"na$\"`) and 6 (`\"nana$\"`)."
  },
  {
    "id": "q11-bwt-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Locating Text Offsets in a Compressed FM-Index via Sampled Suffix Array",
    "prompt": "To keep an FM-Index of the human genome under 2 GB, we do NOT store the full $12\\text{ GB}$ Suffix Array $\\text{SA}[0..N-1]$. Instead, we only store $\\text{SA}[r]$ at rows where $\\text{SA}[r]$ is a multiple of $K = 32$ (consuming $1/32$ of the space).",
    "question": "Given a match row $r$ in $[sp, ep)$ whose $\\text{SA}[r]$ was NOT sampled, how does the FM-Index recover the exact text index $\\text{SA}[r]$?",
    "options": [
      "Repeatedly step $r \\leftarrow \\text{LF}(r)$ (counting the number of steps $t = 0, 1, 2, \\dots$) until landing on a row $r'$ that has a sampled Suffix Array value $\\text{SA}[r']$ (or reaches `'$'`); then the original text position is $\\text{SA}[r] = \\text{SA}[r'] + t$",
      "Interpolate linearly between the two nearest sampled rows in $[sp, ep)$",
      "Run binary search on the original text",
      "Multiply $r$ by $32$"
    ],
    "answer": 0,
    "explanation": "Each application of $r \\leftarrow \\text{LF}(r)$ moves backward by exactly $1$ character in the original text $S$: $\\text{SA}[\\text{LF}(r)] = \\text{SA}[r] - 1$. Because every $K$-th text position ($0, K, 2K, \\dots$) is sampled in $\\text{SA}$, at most $K$ LF-steps are needed before hitting a sampled position $\\text{SA}[r']$, from which $\\text{SA}[r] = \\text{SA}[r'] + t$!"
  }
];

window.QUESTION_BANK["thompson-nfa-vs-backtracking-regex"] = [
  {
    "id": "q11-nfa-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Root Cause of Catastrophic Backtracking (ReDoS)",
    "prompt": "A web server validates user input with the regular expression `^(a+)+$` or `^([a-zA-Z0-9]+)*$` using a PCRE/JavaScript/Python backtracking regex engine, and freezes when sent `\"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!\"` ($30$ `'a'`s followed by `'!'$).",
    "question": "Why does a backtracking engine take $\\Omega(2^N)$ steps on this input while Thompson's NFA simulation takes $O(N \\cdot M)$ steps?",
    "options": [
      "The backtracking engine explores paths via recursive Depth-First Search without remembering visited `(state, text_index)` pairs, re-evaluating the same NFA state at the same text index exponentially many times across $2^N$ ways of partitioning `\"a\"^N`; Thompson's algorithm advances all active states in lockstep as a deduplicated subset of size $\\le M$",
      "Because backtracking engines compile the regex into a full $2^M$-state DFA before reading the input",
      "Because `'!'` is a special metacharacter in PCRE",
      "Because Thompson's algorithm skips over `'a'` characters using Boyer-Moore"
    ],
    "answer": 0,
    "explanation": "At each `'a'` in `\"a\"^N`, the nested quantifier `(a+)+` can either continue the inner `a+` or start a new iteration of the outer `(...)+`. DFS backtracking explores every one of the $2^{N-1}$ partitions of $N$ into positive integers, failing at `'!'` each time. Thompson's lockstep simulation keeps a deduplicated set of active NFA states at index $i$, doing at most $O(M)$ work per character."
  },
  {
    "id": "q11-nfa-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Generation Counter Deduplication (`last_step[u] == step_id`)",
    "prompt": "In Thompson's NFA simulator, `add_state(u, nlist, last_step, step_id)` adds state `u` (and its $\\varepsilon$-closure through `SPLIT` states) to `nlist` for the current character step `step_id`.",
    "question": "Why do we store an integer array `last_step[u]` compared against an incrementing `step_id` instead of using a `std::vector<bool> visited(M, false)` that is cleared at every character?",
    "options": [
      "Incrementing `step_id++` resets membership for the entire array in $O(1)$ time without zeroing $M$ memory locations on steps where `clist` is small, while still providing $O(1)$ deduplication (`if (last_step[u] == step_id) return;`)",
      "Because `std::vector<bool>` cannot store more than 64 elements",
      "Because `step_id` counts how many times the regex matched",
      "Because `last_step[u]` sorts the states in topological order"
    ],
    "answer": 0,
    "explanation": "Using a monotonic generation stamp `step_id` (a classic systems trick also used in graph searches and lazy DFAs) avoids clearing a boolean array on every step and guarantees each state is visited at most once per step."
  },
  {
    "id": "q11-nfa-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Lazy DFA (On-the-Fly Subset Construction) in `RE2` and Rust `regex`",
    "prompt": "Full ahead-of-time NFA-to-DFA powerset construction can take $O(2^M)$ memory (for example, on `.*[01][01]{20}`), while pure Thompson NFA simulation takes $O(M)$ operations per byte.",
    "question": "How does a Lazy DFA achieve $O(1)$-per-byte DFA speed on 99.9% of inputs without risking an $O(2^M)$ memory explosion?",
    "options": [
      "It starts with only the initial DFA state (the $\\varepsilon$-closure of the NFA start state) and computes DFA transitions on demand as text bytes arrive, caching `(subset_of_NFA_states) -> DFA_state_id` up to a fixed memory cap (e.g., 2 MB); if the cache fills up, it flushes the cache or falls back to Thompson NFA simulation",
      "It limits regular expressions to at most 8 characters",
      "It uses a Bloom filter to approximate the DFA transitions",
      "It runs backtracking for the first 1000 steps and then aborts"
    ],
    "answer": 0,
    "explanation": "Even when a regex theoretically has $2^{20}$ reachable subset states, any concrete input text usually visits only a few dozen subsets. Caching subsets lazily in a bounded hash/arena table gives 1-lookup-per-byte speed on real traffic while guaranteeing bounded memory and $O(N \\cdot M)$ worst-case time on adversarial inputs."
  },
  {
    "id": "q11-nfa-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Why Backreferences (`\\1`) Cannot Be Compiled to a Finite Automaton",
    "prompt": "Both Google's `RE2` and Rust's `regex` crate refuse to support backreferences such as `(.*)\\1` (which matches any doubled string $ww$).",
    "question": "From a formal language and complexity theory standpoint, why can't `(.*)\\1` be implemented using a finite-state Thompson NFA or DFA?",
    "options": [
      "The language $L = \\{ww \\mid w \\in \\Sigma^*\\}$ is not regular (not even context-free, by the Pumping Lemma), because recognizing $ww$ requires unbounded memory to remember the arbitrary string $w$; in general, regex matching with backreferences is NP-complete",
      "Because Thompson NFAs only support binary alphabets",
      "Because `\\1` conflicts with ASCII escape sequences",
      "It CAN be compiled to an NFA of size $O(M^2)$, but library authors were too lazy to implement it"
    ],
    "answer": 0,
    "explanation": "A finite automaton with $S$ states can only remember $\\log_2 S$ bits of history, whereas matching $ww$ for an arbitrary length-$N$ string $w$ requires remembering all $N$ characters of $w$ ($\\Omega(N)$ bits). Worse, general backreference matching is NP-complete (via reduction from 3-SAT / Graph 3-Colorability), making polynomial worst-case time impossible unless $\\text{P} = \\text{NP}$."
  }
];

window.QUESTION_BANK["myers-diff-hirschberg-lcs"] = [
  {
    "id": "q11-myers-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Myers Edit Graph Diagonal Invariant",
    "prompt": "In Myers' diff algorithm on sequences $A[0..N-1]$ and $B[0..M-1]$, diagonal $k$ is defined as the set of grid vertices $(x, y)$ with $k = x - y$.",
    "question": "How do the three edit operations—Deletion from $A$ ($(x, y) \\to (x+1, y)$), Insertion from $B$ ($(x, y) \\to (x, y+1)$), and Match/Snake ($(x, y) \\to (x+1, y+1)$)—affect the diagonal index $k = x - y$?",
    "options": [
      "Deletion increases $k$ by $+1$ ($k - 1 \\to k$), Insertion decreases $k$ by $-1$ ($k + 1 \\to k$), and a Match/Snake keeps $k$ unchanged while advancing both $x$ and $y$ at $0$ edit cost",
      "Deletion keeps $k$ unchanged, Insertion increases $k$ by $+1$, and Match increases $k$ by $+2$",
      "All three operations change $k$ by $\\pm 1$",
      "Match/Snake moves perpendicular to diagonal $k$"
    ],
    "answer": 0,
    "explanation": "Since $k = x - y$: incrementing $x$ (deletion) changes $k$ to $(x + 1) - y = k + 1$; incrementing $y$ (insertion) changes $k$ to $x - (y + 1) = k - 1$; and incrementing both $x$ and $y$ (matching $A[x] == B[y]$) leaves $(x + 1) - (y + 1) = x - y = k$ invariant."
  },
  {
    "id": "q11-myers-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Parity Alternation and In-Place `V[k]` Updates in Myers Diff",
    "prompt": "At outer loop iteration $d$, Myers' inner loop iterates `for (int k = -d; k <= d; k += 2)` and computes `V[k]` from `V[k - 1]` and `V[k + 1]` in a single flat array `V` without using a separate `V_prev` array.",
    "question": "Why does overwriting `V[k]` in-place during iteration $d$ NEVER corrupt the values `V[k - 1]` and `V[k + 1]` needed by subsequent $k$ steps in the same iteration $d$?",
    "options": [
      "Because iteration $d$ only writes to diagonals $k$ with $k \\equiv d \\pmod 2$, and only reads from diagonals $k \\pm 1$ with $k \\pm 1 \\equiv d - 1 \\pmod 2$; even and odd diagonals occupy disjoint indices in `V`!",
      "Because the loop runs backwards from $k = +d$ to $-d$",
      "Because `V[k - 1]` is always equal to `V[k + 1]`",
      "It actually DOES corrupt `V[k + 1]` unless a second array is used"
    ],
    "answer": 0,
    "explanation": "Every edit step changes $k$ by $\\pm 1$, so after $d$ edits from $k = 0$, only diagonals with the same parity as $d$ ($k \\equiv d \\pmod 2$) are reachable. Thus when $d$ is even, the loop writes to even indices of `V` while reading exclusively from odd indices of `V` (computed during $d - 1$), and vice versa when $d$ is odd."
  },
  {
    "id": "q11-myers-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Hirschberg's Divide-and-Conquer Time and Space Complexity",
    "prompt": "Hirschberg's algorithm computes the full Longest Common Subsequence (or optimal edit alignment) of $A[0..N-1]$ and $B[0..M-1]$ by running a 2-row forward DP on $A[0..N/2-1]$ and a 2-row backward DP on $A[N/2..N-1]$ to find the optimal split point $y^* \\in [0, M]$, then recursing on the top-left $(N/2) \\times y^*$ and bottom-right $(N/2) \\times (M - y^*)$ subproblems.",
    "question": "Why is the total time across all $\\log_2 N$ levels of recursion still $O(N \\cdot M)$ rather than $O(N \\cdot M \\log N)$?",
    "options": [
      "At recursion depth $1$, the two subproblems have sizes $(N/2) \\times y^*$ and $(N/2) \\times (M - y^*)$, whose sum of areas is $(N/2)(y^* + M - y^*) = \\frac{1}{2} NM$; at depth $r$, the subproblem areas sum to $\\frac{1}{2^r} NM$, forming a convergent geometric series $\\sum_{r=0}^\\infty \\frac{NM}{2^r} = 2NM = O(NM)$",
      "Because Hirschberg only recurses on the larger of the two subproblems and discards the smaller one",
      "Because $y^*$ is always equal to $0$ or $M$",
      "Because the inner DP runs in $O(N + M)$ time at the root"
    ],
    "answer": 0,
    "explanation": "Unlike standard Merge Sort (where the work at every level of the recursion tree is $O(N)$, summing to $O(N \\log N)$), in Hirschberg's 2D grid split both the height AND the sum of widths partition across the two recursive calls, halving the total 2D area at every recursion level: $NM(1 + 1/2 + 1/4 + \\dots) = 2NM$."
  },
  {
    "id": "q11-myers-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Duality Between Edit Distance $D$ (Ins + Del) and Longest Common Subsequence (LCS)",
    "prompt": "In Myers' Edit Graph model, only Insertions (cost 1) and Deletions (cost 1) are counted as edits (substitutions cost 2: 1 delete + 1 insert), while matching characters slide along diagonals at cost 0.",
    "question": "If sequences $A$ (length $N$) and $B$ (length $M$) have Longest Common Subsequence length $L = |\\text{LCS}(A, B)|$, what is the exact Myers Shortest Edit Script distance $D$, and on which diagonal must the final path terminate?",
    "options": [
      "$D = N + M - 2L$, and every path from $(0, 0)$ to $(N, M)$ terminates on diagonal $k_{\\text{end}} = N - M$ (which immediately implies $D \\equiv N - M \\pmod 2$)",
      "$D = \\max(N, M) - L$, terminating on diagonal $k = 0$",
      "$D = N + M - L$, terminating on diagonal $k = N + M$",
      "$D = |N - M| + L$"
    ],
    "answer": 0,
    "explanation": "Each of the $L$ matched character pairs in the LCS advances both $x$ and $y$ by $1$ ($2L$ total coordinate progress at cost $0$). The remaining $(N - L)$ characters of $A$ must be deleted (cost $N - L$) and the remaining $(M - L)$ characters of $B$ must be inserted (cost $M - L$), giving $D = (N - L) + (M - L) = N + M - 2L$ and final diagonal $k = N - M$."
  }
];

window.QUESTION_BANK["huffman-lz77-deflate"] = [
  {
    "id": "q11-deflate-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Kraft's Inequality for Prefix-Free Binary Codes",
    "prompt": "You want to design a binary prefix-free code for an alphabet of $5$ symbols with codeword bit-lengths $(\\ell_1, \\ell_2, \\ell_3, \\ell_4, \\ell_5)$.",
    "question": "By Kraft's Inequality ($\\sum_{i=1}^k 2^{-\\ell_i} \\le 1$), which of the following bit-length tuples CANNOT possibly form a valid prefix-free binary code?",
    "options": [
      "$(1, 2, 3, 3, 3)$, because $2^{-1} + 2^{-2} + 3 \\cdot 2^{-3} = \\frac{4 + 2 + 3}{8} = \\frac{9}{8} > 1$",
      "$(2, 2, 2, 3, 3)$, because $3 \\cdot 2^{-2} + 2 \\cdot 2^{-3} = \\frac{6 + 2}{8} = 1$",
      "$(1, 2, 3, 4, 4)$, because $2^{-1} + 2^{-2} + 2^{-3} + 2 \\cdot 2^{-4} = 1$",
      "$(3, 3, 3, 3, 3)$, because $5 \\cdot 2^{-3} = \\frac{5}{8} < 1$"
    ],
    "answer": 0,
    "explanation": "A leaf at depth $\\ell_i$ in a binary tree consumes a $2^{-\\ell_i}$ fraction of the leaf space of a complete binary tree. Since distinct leaves in a prefix-free tree have disjoint subtrees, the sum $\\sum 2^{-\\ell_i}$ cannot exceed $1$. For $(1, 2, 3, 3, 3)$, the sum is $9/8 > 1$, which is impossible."
  },
  {
    "id": "q11-deflate-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Canonical Huffman Code Assignment from Bit-Lengths Alone",
    "prompt": "Four symbols sorted by `(bit_len, symbol)` have Canonical Huffman bit-lengths: `'A': 1`, `'B': 2`, `'C': 3`, `'D': 3`. Canonical assignment starts the first symbol at `0` (of length $\\ell_0$) and computes each subsequent codeword via `code = (code + 1) << (len[i] - len[i - 1])`.",
    "question": "What are the exact binary codewords assigned to `'A'`, `'B'`, `'C'`, and `'D'`?",
    "options": [
      "`'A' = 0`, `'B' = 10`, `'C' = 110`, `'D' = 111`",
      "`'A' = 1`, `'B' = 01`, `'C' = 001`, `'D' = 000`",
      "`'A' = 0`, `'B' = 01`, `'C' = 010`, `'D' = 011`",
      "`'A' = 00`, `'B' = 01`, `'C' = 10`, `'D' = 11`"
    ],
    "answer": 0,
    "explanation": "Start with `'A'` ($\\ell = 1$): `code = 0` (`\"0\"`). For `'B'` ($\\ell = 2$): `(0 + 1) << (2 - 1) = 2` (`\"10\"`). For `'C'` ($\\ell = 3$): `(2 + 1) << (3 - 2) = 6` (`\"110\"`). For `'D'` ($\\ell = 3$): `(6 + 1) << (3 - 3) = 7` (`\"111\"`). Notice that no codeword is a prefix of another!"
  },
  {
    "id": "q11-deflate-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Overlapping LZ77 Back-Reference Decoding (`len > dist`)",
    "prompt": "During DEFLATE decompression, the output buffer currently contains `\"ab\"` (length 2), and the next LZ77 token is `<dist = 2, len = 6>`.",
    "question": "What 8-character string is in the output buffer after decoding `<dist = 2, len = 6>`, and why is a single `memcpy(dst, dst - 2, 6)` unsafe here?",
    "options": [
      "`\"abababab\"`; because `len (6) > dist (2)`, each copied byte is read as source data two iterations later, and calling `memcpy` on overlapping source and destination regions is undefined behavior in C/C++",
      "`\"ab000000\"`; because reading past the current write pointer pads with zeros",
      "`\"abbbbbbb\"`; because only the last character is repeated",
      "DEFLATE forbids `len > dist` and rejects the stream as corrupt"
    ],
    "answer": 0,
    "explanation": "In LZ77 / RFC 1951 Section 3.2.3, the backward distance `dist` is explicitly allowed to be smaller than `len`: copying byte-by-byte `out[i] = out[i - dist]` for $k = 0..5$ copies `'a'`, `'b'`, then the newly written `'a'`, `'b'`, etc., generating periodic run-length patterns like `\"abababab\"` in a single token."
  },
  {
    "id": "q11-deflate-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Length-Limited Huffman Coding (Package-Merge) in DEFLATE",
    "prompt": "In standard Huffman coding on a file of size $N$, if symbol frequencies follow the Fibonacci sequence $1, 1, 2, 3, 5, 8, \\dots$, a tree over 286 symbols can have depth up to $30+$. However, RFC 1951 (DEFLATE) mandates that no Huffman codeword may exceed $L_{\\max} = 15$ bits so that decoders can use fast lookup tables and fit codewords in 16-bit registers.",
    "question": "How is an optimal prefix-free code subject to the hard constraint $\\max_c \\ell_c \\le 15$ constructed?",
    "options": [
      "Using Larmore and Hirschberg's $O(|\\Sigma| \\cdot L_{\\max})$ Package-Merge algorithm (a reduction to the binary Coin Collector's problem across depth levels $15$ down to $1$), or by clamping/redistributing Kraft weights in sorted frequency order",
      "By simply truncating any codeword longer than 15 bits to its first 15 bits",
      "By deleting all symbols whose depth exceeds 15",
      "Standard greedy Huffman is guaranteed never to exceed depth $\\lceil \\log_2 |\\Sigma| \\rceil = 9$"
    ],
    "answer": 0,
    "explanation": "Simply truncating a 17-bit codeword to 15 bits violates Kraft's inequality and destroys the prefix-free property! Length-limited Huffman coding requires choosing $\\ell_c \\in [1, L_{\\max}]$ with $\\sum 2^{-\\ell_c} = 1$ minimizing $\\sum f_c \\ell_c$, solved exactly by the Package-Merge algorithm or approximated in `zlib` by Kraft-sum tree depth redistribution."
  }
];

window.QUESTION_BANK["case-git-myers-histogram-diff"] = [
  {
    "id": "q11-gitdiff-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Why Pure Myers Diff Misaligns Closing Braces `{` / `}`",
    "prompt": "When comparing two versions of a source file where a function was rewritten and another function was added below it, `git diff --myers` frequently pairs the old function's closing `}` with the new function's closing `}`.",
    "question": "Why does Myers' algorithm prefer or allow this misaligned hunk?",
    "options": [
      "Because pure Myers diff assigns every line an identical weight of $1$ regardless of how common the line is; matching two frequent `}` lines yields the exact same edit distance score as matching meaningful lines, and Myers greedily takes the first diagonal snake it encounters",
      "Because Myers diff ignores whitespace and punctuation characters",
      "Because Myers diff only compares the last 10 lines of each function",
      "Because `git diff --myers` runs in $O(N)$ time without dynamic programming"
    ],
    "answer": 0,
    "explanation": "Myers' algorithm optimizes solely for the unweighted Shortest Edit Script ($D = N + M - 2|\\text{LCS}|$). When multiple alignments have the same (or nearly the same) LCS length, greedy diagonal extension latches onto high-frequency boilerplate lines like `}`, `else {`, or blank lines."
  },
  {
    "id": "q11-gitdiff-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Patience Diff's Unique-Line LIS Anchor Step",
    "prompt": "Bram Cohen's Patience Diff (`git diff --patience`) first identifies all lines that appear <strong>exactly once</strong> in File $A$ and <strong>exactly once</strong> in File $B$. Suppose these unique common lines occur at $(a_1, b_1) = (2, 8)$, $(a_2, b_2) = (5, 3)$, $(a_3, b_3) = (9, 6)$, and $(a_4, b_4) = (12, 10)$.",
    "question": "Which subset of these unique common lines does Patience Diff choose as structural anchors before recursing on the gaps between them?",
    "options": [
      "$(5, 3),\\; (9, 6),\\; (12, 10)$, because their $B$-indices $(3, 6, 10)$ form the Longest Increasing Subsequence (LIS) of $(8, 3, 6, 10)$, preserving relative top-to-bottom order in both files",
      "All four lines $(2, 8), (5, 3), (9, 6), (12, 10)$",
      "Only $(2, 8)$ and $(12, 10)$ because $(2, 8)$ comes first in File $A$",
      "None of them, because $(8, 3, 6, 10)$ is not strictly sorted"
    ],
    "answer": 0,
    "explanation": "Since the pairs are already sorted by their File $A$ indices ($2 < 5 < 9 < 12$), any valid non-crossing alignment must select a subsequence whose File $B$ indices are strictly increasing. The LIS of $(8, 3, 6, 10)$ is $(3, 6, 10)$ of length 3."
  },
  {
    "id": "q11-gitdiff-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "How Histogram Diff (`--histogram`) Improves Upon Patience Diff",
    "prompt": "Suppose you diff a file containing two similar test suites where every function header and setup line appears <strong>twice</strong> in File $A$ and <strong>twice</strong> in File $B$, so there are ZERO lines with frequency $== 1$.",
    "question": "What happens in Patience Diff vs. Histogram Diff on this input?",
    "options": [
      "Patience Diff finds no unique lines ($\\text{freq} == 1$) and immediately falls back to pure Myers diff on the entire file, whereas Histogram Diff selects the longest contiguous match anchored on the lowest-frequency common line (here $\\text{freq} == 2 \\le 64$) and splits the problem cleanly",
      "Both Patience Diff and Histogram Diff fail with an error when no unique lines exist",
      "Patience Diff hashes pairs of adjacent lines until all lines become unique",
      "Histogram Diff sorts the lines of both files alphabetically before diffing"
    ],
    "answer": 0,
    "explanation": "Patience Diff's strict $\\text{freq}_A == 1 \\land \\text{freq}_B == 1$ filter makes it brittle whenever code blocks are duplicated even once. Histogram Diff (`xdiff/xhistogram.c`) generalizes the idea to a full frequency histogram, picking the lowest-frequency anchor block with $\\text{freq}_A \\le 64$."
  },
  {
    "id": "q11-gitdiff-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Why Myers Diff Needs Heuristic Cutoffs (`max_chain_length`) in Production",
    "prompt": "Although Myers diff runs in $O((N + M)D)$ time, consider what happens when a user runs `git diff` on two 50,000-line auto-generated JSON or lockfiles that share almost no lines ($D \\approx N + M = 100{,}000$).",
    "question": "What is the asymptotic cost of exact Myers diff when $D = \\Theta(N + M)$, and how does Git's `libxdiff` prevent `git diff` from hanging?",
    "options": [
      "Exact Myers diff degrades to $\\Theta((N + M)^2)$ time (~$10^{10}$ inner-loop steps); `libxdiff` monitors search effort and, once $d$ exceeds a heuristic threshold (`mxc`), switches to greedy snake-Anchor heuristics that trade exact minimal edit length for guaranteed fast termination",
      "Exact Myers diff still runs in $O(N + M)$ time even when $D = N + M$",
      "Git aborts and refuses to print any diff when $D > 1000$",
      "Git automatically switches to `bzip2` compression when $D$ is large"
    ],
    "answer": 0,
    "explanation": "In Myers diff, step $d$ iterates $k$ from $-d$ to $+d$ ($d + 1$ diagonals), so reaching edit distance $D$ takes $\\sum_{d=0}^D (d + 1) = \\Theta(D^2)$ work even without snake comparisons! When $D = \\Theta(N)$, $\\Theta(D^2) = \\Theta(N^2)$, which is why `libxdiff` (and Histogram Diff) use effort cutoffs on highly divergent regions."
  }
];

window.QUESTION_BANK["build-thompson-nfa-regex-engine"] = [
  {
    "id": "q11-build-rx-1",
    "type": "mcq",
    "difficulty": "recall",
    "title": "Rules for Inserting Explicit Concatenation (`OP_CONCAT`) in Infix Regexes",
    "prompt": "Before running Dijkstra's Shunting-Yard algorithm to convert an infix regular expression into postfix notation, our compiler inserts an explicit concatenation operator `·` (`OP_CONCAT`) between adjacent tokens.",
    "question": "For the regular expression `a(b|c)*d+e`, where must explicit concatenation operators `·` be inserted?",
    "options": [
      "`a · (b|c)* · d+ · e` (after `'a'` before `'('`, after `'*'` before `'d'`, and after `'+'` before `'e'`)",
      "`a · (b · | · c) · * · d · + · e`",
      "`a(b · |c)* · de`",
      "Only between adjacent literal letters (`d+ · e`)"
    ],
    "answer": 0,
    "explanation": "An explicit concatenation operator goes between token $T_1$ and token $T_2$ iff $T_1$ can end an atom (literal, `.`, `)`, `*`, `+`, `?`) and $T_2$ can start an atom (literal, `.`, `(`). Thus `'a'` and `'('`, `'*'` and `'d'`, and `'+'` and `'e'` all receive `·`."
  },
  {
    "id": "q11-build-rx-2",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Operator Precedence in Regex Shunting-Yard",
    "prompt": "In regular expression syntax, the expression `ab|cd*` means `(a · b) | (c · (d*))` rather than `((a · (b | c)) · d)*`.",
    "question": "What strict precedence ordering must the Shunting-Yard parser assign to the three operator classes—Alternation (`|`), Concatenation (`·`), and Unary Quantifiers (`*`, `+`, `?`)?",
    "options": [
      "Unary Quantifiers (`*`, `+`, `?`) [Highest: 3] $>$ Concatenation (`·`) [Middle: 2] $>$ Alternation (`|`) [Lowest: 1]",
      "Alternation (`|`) $>$ Concatenation (`·`) $>$ Unary Quantifiers (`*`, `+`, `?`)",
      "Concatenation (`·`) $>$ Unary Quantifiers (`*`, `+`, `?`) $>$ Alternation (`|`)",
      "All three operators have equal precedence and associate left-to-right"
    ],
    "answer": 0,
    "explanation": "In standard regex grammar, `d*` binds tighter than concatenation `cd*` (so `*` has higher precedence than `·`), and concatenation `ab` binds tighter than alternation `ab|cd*` (so `·` has higher precedence than `|`)."
  },
  {
    "id": "q11-build-rx-3",
    "type": "mcq",
    "difficulty": "apply",
    "title": "Compiling `+` (One-or-More) vs. `*` (Zero-or-More) on the Fragment Stack",
    "prompt": "When compiling postfix operator `+` (`e+`) vs. `*` (`e*`), both pop fragment `e` from the stack, create a `SPLIT` state `s = add_nfa_state(SPLIT, 0, e.start, -1)`, and patch `e.dangling` to `s`.",
    "question": "What is the ONLY difference between the new `Frag` pushed back onto the stack for `e+` versus `e*`?",
    "options": [
      "For `e*`, the new fragment's entry state is `s` (the `SPLIT` state, allowing 0 repetitions via `s.out1`); for `e+`, the new fragment's entry state is `e.start` (forcing at least 1 pass through `e` before reaching the `SPLIT` state `s`)",
      "For `e+`, `e` must be cloned twice in the NFA arena",
      "For `e+`, `s.out` points to `-1` instead of `e.start`",
      "There is no difference; `e+` and `e*` produce identical NFAs"
    ],
    "answer": 0,
    "explanation": "Both `e*` and `e+` loop `e`'s exit arrows into `s = SPLIT(e.start, exit)`. Starting at `s` allows skipping `e` immediately (`e*`), whereas starting at `e.start` requires matching `e` once before reaching `s` (`e+`)—requiring only 1 `SPLIT` node and zero cloning!"
  },
  {
    "id": "q11-build-rx-4",
    "type": "mcq",
    "difficulty": "staff",
    "title": "Preventing Infinite Recursion on Nullable $\\varepsilon$-Cycles (`(a*)*`)",
    "prompt": "A user compiles the regex `(a*)*b` (or `(a?)*b`), where an inner nullable expression sits inside a `*` loop, creating a directed cycle of `SPLIT` ($\\varepsilon$) states in the Thompson NFA.",
    "question": "In `add_state(int u, ...)`, what exact placement of `last_step[u] = step_id` prevents infinite recursion on this $\\varepsilon$-cycle?",
    "options": [
      "Checking `if (last_step[u] == step_id) return;` and setting `last_step[u] = step_id;` at the VERY BEGINNING of `add_state` for ALL state types (including `SPLIT` states) BEFORE recursing on `states_[u].out` and `states_[u].out1`",
      "Setting `last_step[u] = step_id` only after pushing `CHAR` states into `list`",
      "Setting `last_step[u] = step_id` after the two recursive calls on `SPLIT` children return",
      "Counting recursion depth and throwing an exception when depth exceeds 100"
    ],
    "answer": 0,
    "explanation": "If `last_step[u] = step_id` is only set for `CHAR` states or is set *after* recursing on `SPLIT` children, any cycle of `SPLIT` states ($s_1 \\to s_2 \\to s_1$) will recurse infinitely before ever reaching a `CHAR` state or returning! Marking `last_step[u] = step_id` immediately upon entering `add_state` turns $\\varepsilon$-closure into a standard cycle-safe DFS."
  }
];
