window.MODULE_CONTENT = window.MODULE_CONTENT || {};
window.MODULE_CONTENT["m11"] = {
  "suffix-trees-ukkonen-intuition": {
    "title": "Suffix Trees & Ukkonen's Online O(N) Construction: Active Point & Suffix Links",
    "video": {
      "youtubeId": "aPRqocoBsFQ",
      "title": "Ukkonen's Suffix Tree Construction in O(N) Time",
      "channel": "Tushar Roy - Coding Made Simple",
      "duration": "37:12",
      "start": 0,
      "length": 2232,
      "why": "Walks through Ukkonen's three extension rules, the (active_node, active_edge, active_length) tuple, suffix links, and open-ended leaf index pointers."
    },
    "intuition": "<p>An uncompressed Trie of all $N$ suffixes of a string $S[0..N-1]$ can have $\\Theta(N^2)$ nodes and characters along its edges (for instance, on $S = \\texttt{\"a\"}^{N/2}\\texttt{\"b\"}^{N/2}$). Yet if we compress every unary path into a single edge labeled by a pair of indices $[l, r]$ into the original string $S$, and append a unique terminal sentinel $\\texttt{'\\$'}$ so no suffix is a prefix of another suffix, the resulting <strong>Suffix Tree</strong> has at most $N$ leaves, at most $N - 1$ internal branching nodes, and $O(N)$ total space!</p><p>Esko Ukkonen (1995) showed how to build this Suffix Tree online in $O(N)$ time by extending all suffixes of prefix $S[0..i-1]$ into suffixes of $S[0..i]$ using three amortization tricks: (1) every leaf edge is stored as $[l, \\infty)$, so Rule 1 (extending an existing leaf) happens automatically in $O(1)$ time just by incrementing $i$; (2) Rule 3 (when character $S[i]$ is already present at the <strong>Active Point</strong>) is a <em>showstopper</em> that immediately ends phase $i$; and (3) Rule 2 (splitting an edge to insert a new leaf) follows a <strong>Suffix Link</strong> from the active internal node to jump directly to the next shorter suffix in $O(1)$ time.</p>",
    "content": `<div class="lesson-content">
<h3>1. Structural Anatomy of a Compressed Suffix Tree</h3>
<p>Given $S[0..N-1]$ terminated by a unique sentinel $S[N-1] = \\texttt{'\\$'}$ ($\\texttt{'\\$'} \\notin \\Sigma$), the Suffix Tree $\\mathcal{T}(S)$ is the compressed Radix Tree of all $N$ non-empty suffixes $S[0..N-1], S[1..N-1], \\dots, S[N-1..N-1]$:</p>
<ul>
  <li><strong>Bounded Vertex Count:</strong> Because $\\texttt{'\\$'}$ is unique to the end of $S$, no non-empty suffix is a prefix of any other suffix. Thus all $N$ suffixes end at $N$ distinct leaves. Every internal node (except possibly the root if $N=1$) has branching degree $\\ge 2$, which implies $\\le N - 1$ internal nodes and $\\le 2N - 1$ total vertices.</li>
  <li><strong>$O(1)$-Space Edge Slices:</strong> Instead of copying substring characters onto edges, each edge $u \\to v$ stores two integers $(l, r)$ representing the half-open or closed substring $S[l..r]$. Thus the entire tree takes $O(N)$ words of memory.</li>
  <li><strong>Universal Substring Property:</strong> Every substring of $S$ is a prefix of some suffix of $S$. Therefore, a pattern $P[0..M-1]$ occurs in $S$ if and only if $P$ can be spelled out from the root of $\\mathcal{T}(S)$ in $O(M)$ time; the leaves in the subtree below the locus of $P$ give all occurrence start positions!</li>
</ul>

<h3>2. Ukkonen's Three Extension Rules &amp; Amortized Linearity</h3>
<p>In Phase $i$ ($i = 0..N-1$), Ukkonen's algorithm implicitly maintains the count $\\text{rem}$ (<code>remainder</code>) of suffixes waiting to be explicitly branched, alongside the <strong>Active Point</strong> $(\\text{active\\_node}, \\text{active\\_edge}, \\text{active\\_len})$ identifying the locus of the longest suffix of $S[0..i-1]$ that already appeared earlier in $S$ (so it sits inside the tree rather than at a leaf):</p>
<ol>
  <li><strong>Rule 1 (Leaf Extension — Free):</strong> Any suffix $S[j..i-1]$ that already ended at a leaf simply appends $S[i]$. By storing leaf right endpoints as $\\infty$ (implicitly the current phase index $i$), all existing leaves extend simultaneously in $O(1)$ time!</li>
  <li><strong>Rule 2 (Branch Creation — New Leaf):</strong> While $\\text{rem} > 0$, if the character $S[i]$ does NOT exist next at the Active Point, we split the active edge (if $\\text{active\\_len} > 0$) to create a new internal node $w$, attach a new leaf $[i, \\infty)$ for $S[i]$, wire the previous internal node created in this phase to $w$ via a <strong>Suffix Link</strong> $\\text{link}[u] = w$, decrement $\\text{rem}$, and advance the Active Point to the next shorter suffix via $\\text{link}[\\text{active\\_node}]$.</li>
  <li><strong>Rule 3 (Already Present — Showstopper):</strong> If character $S[i]$ ALREADY exists at the Active Point, we simply advance $\\text{active\\_len}$ by $1$ (canonicalizing across internal nodes via the <em>skip/count trick</em>) and <strong>break out of phase $i$ immediately</strong>! Why? Because if the longest unbranched suffix $S[j..i]$ is already in the tree, every shorter suffix $S[j+1..i], \\dots, S[i..i]$ is also already in the tree.</li>
</ol>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Operation / Property</th>
      <th>Naive Suffix Trie</th>
      <th>Ukkonen Suffix Tree</th>
      <th>Why Ukkonen Achieves This Bound</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Construction Time</td>
      <td>$\\Theta(N^2)$</td>
      <td>$O(N \\log |\\Sigma|)$ or $O(N)$</td>
      <td>Each Rule 2 step creates 1 leaf ($\\le N$ total); each Rule 3 step ends phase $i$ ($\\le N$ total)</td>
    </tr>
    <tr>
      <td>Nodes &amp; Edges</td>
      <td>$\\Theta(N^2)$</td>
      <td>$\\le 2N - 1$ nodes</td>
      <td>Path compression + $[l, r]$ index slices + $\\texttt{'\\$'}$ sentinel</td>
    </tr>
    <tr>
      <td>Substring Existence $P$</td>
      <td>$O(|P|)$</td>
      <td>$O(|P|)$</td>
      <td>Spell $P$ from root along compressed edge slices</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Ukkonen Remainder &amp; Active-Point Potential Invariant</div>
  <p>At the start of every step in phase $i$, $\\text{rem}$ equals the number of suffixes of $S[0..i]$ that have not yet been given a leaf, and the Active Point spells the longest such suffix $S[i - \\text{rem} + 1 .. i - 1]$. Across all $N$ phases, $\\text{rem}$ increments by $1$ per phase ($N$ times total) and decrements by $1$ on every Rule 2 split ($\\le N$ times total). Similarly, $\\text{active\\_len}$ increases by at most $1$ per phase and decreases by at most $1$ per Suffix Link traversal, bounding total Suffix Link and skip/count hops to $O(N)$.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Why Production Systems Prefer Suffix Arrays + LCP Over Suffix Trees</div>
  <p>Despite its $O(N)$ asymptotic elegance, a Suffix Tree node requires a child map, <code>l</code>, <code>r</code>, <code>parent</code>, and <code>suffix_link</code>—consuming $20\\text{N}$ to $48\\text{N}$ bytes of RAM with pointer-chasing cache misses at every branch. A Suffix Array (<code>4N</code> bytes) plus Kasai's LCP array (<code>4N</code> bytes) encodes the exact same tree topology in $8\\text{N}$ contiguous bytes ($3\\times$ to $6\\times$ less memory) with vastly superior cache locality.</p>
</div>

<h3>3. Visual Trace: Suffix Tree &amp; Suffix Links for $S = \\texttt{\"xabxa\\$\"}$</h3>
<svg viewBox="0 0 760 240" width="100%" height="240" role="img" aria-label="Suffix tree and suffix links for xabxa$">
  <style>
    .st-node { fill: #1e293b; stroke: #64748b; stroke-width: 1.5; }
    .st-leaf { fill: #064e3b; stroke: #34d399; stroke-width: 1.8; rx: 4; }
    .st-txt { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #f8fafc; text-anchor: middle; }
    .st-lbl { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #93c5fd; }
    .st-edge { stroke: #64748b; stroke-width: 1.5; fill: none; }
    .st-link { stroke: #f87171; stroke-width: 1.5; stroke-dasharray: 5,4; fill: none; }
  </style>
  <rect width="760" height="240" fill="#0f172a" rx="8"/>

  <!-- Root -->
  <circle cx="80" cy="120" r="20" class="st-node"/>
  <text x="80" y="124" class="st-txt">root</text>

  <!-- Internal node u1: "xa" -->
  <line x1="100" y1="110" x2="230" y2="55" class="st-edge"/>
  <text x="155" y="72" class="st-lbl">"xa" [0,2)</text>
  <circle cx="250" cy="50" r="20" class="st-node"/>
  <text x="250" y="54" class="st-txt">u1:xa</text>

  <!-- Leaves of u1 -->
  <line x1="270" y1="45" x2="410" y2="25" class="st-edge"/>
  <text x="330" y="25" class="st-lbl">"bxa$" [2,6)</text>
  <rect x="410" y="12" width="60" height="26" class="st-leaf"/>
  <text x="440" y="29" class="st-txt">idx 0</text>

  <line x1="270" y1="55" x2="410" y2="75" class="st-edge"/>
  <text x="330" y="80" class="st-lbl">"$" [5,6)</text>
  <rect x="410" y="62" width="60" height="26" class="st-leaf"/>
  <text x="440" y="79" class="st-txt">idx 3</text>

  <!-- Internal node u2: "a" -->
  <line x1="100" y1="120" x2="230" y2="135" class="st-edge"/>
  <text x="160" y="122" class="st-lbl">"a" [1,2)</text>
  <circle cx="250" cy="138" r="20" class="st-node"/>
  <text x="250" y="142" class="st-txt">u2:a</text>

  <!-- Leaves of u2 -->
  <line x1="270" y1="133" x2="410" y2="118" class="st-edge"/>
  <text x="330" y="118" class="st-lbl">"bxa$" [2,6)</text>
  <rect x="410" y="105" width="60" height="26" class="st-leaf"/>
  <text x="440" y="122" class="st-txt">idx 1</text>

  <line x1="270" y1="143" x2="410" y2="160" class="st-edge"/>
  <text x="330" y="165" class="st-lbl">"$" [5,6)</text>
  <rect x="410" y="148" width="60" height="26" class="st-leaf"/>
  <text x="440" y="165" class="st-txt">idx 4</text>

  <!-- Direct leaves from root: "bxa$" and "$" -->
  <line x1="96" y1="132" x2="230" y2="195" class="st-edge"/>
  <text x="145" y="182" class="st-lbl">"bxa$" [2,6)</text>
  <rect x="230" y="184" width="60" height="26" class="st-leaf"/>
  <text x="260" y="201" class="st-txt">idx 2</text>

  <line x1="90" y1="138" x2="160" y2="218" class="st-edge"/>
  <text x="105" y="205" class="st-lbl">"$" [5,6)</text>
  <rect x="160" y="206" width="60" height="26" class="st-leaf"/>
  <text x="190" y="223" class="st-txt">idx 5</text>

  <!-- Suffix Links: u1 ("xa") -> u2 ("a") -> root ("") -->
  <path d="M 250 70 L 250 118" class="st-link"/>
  <path d="M 232 146 Q 150 165 98 130" class="st-link"/>
  <text x="530" y="100" class="st-lbl" fill="#f87171">--- Suffix Links:</text>
  <text x="530" y="122" class="st-lbl" fill="#f87171">link("xa") = "a"</text>
  <text x="530" y="144" class="st-lbl" fill="#f87171">link("a")  = root</text>
</svg>

<div class="mermaid">
flowchart TD
  A["Phase i: append S[i], increment rem++"] --> B{"rem &gt; 0?"}
  B -- "No" --> H["Advance to Phase i+1"]
  B -- "Yes" --> C{"Does S[i] exist at Active Point?"}
  C -- "Yes (Rule 3: Showstopper)" --> D["Wire pending suffix link; active_len++; canonicalize"]
  D --> H
  C -- "No (Rule 2: Split/Branch)" --> E["Split edge if active_len &gt; 0; attach leaf [i, inf)"]
  E --> F["Wire pending suffix link to new internal node; rem--"]
  F --> G["Advance Active Point via suffix link or root edge shift"]
  G --> B
</div>

<div class="simulator-mount" data-sim="sim-suffix-array-sam"></div>

<h3>4. Production Implementation: Ukkonen's Online $O(N)$ Suffix Tree</h3>
<pre><code class="language-cpp">#include &lt;map&gt;
#include &lt;string&gt;
#include &lt;string_view&gt;
#include &lt;vector&gt;

class UkkonenSuffixTree {
public:
    static constexpr int INF = 1e9;
    struct Node {
        int l = 0, r = 0; // Edge label S[l .. min(r, current_end)]
        int link = 0;     // Suffix link to shorter suffix internal node
        std::map&lt;char, int&gt; next;
        int edge_len(int pos) const { return std::min(r, pos + 1) - l; }
    };

    explicit UkkonenSuffixTree(std::string_view str) : s_(str) {
        nodes_.emplace_back(); // Node 0 = root
        for (int i = 0; i &lt; static_cast&lt;int&gt;(s_.size()); ++i) {
            extend(i);
        }
    }

    // Returns true iff pattern P is a substring of S in O(|P| log |Sigma|) time
    bool contains(std::string_view pat) const {
        int u = 0, n = static_cast&lt;int&gt;(s_.size());
        size_t idx = 0;
        while (idx &lt; pat.size()) {
            auto it = nodes_[u].next.find(pat[idx]);
            if (it == nodes_[u].next.end()) return false;
            int v = it-&gt;second;
            int len = nodes_[v].edge_len(n - 1);
            for (int k = 0; k &lt; len &amp;&amp; idx &lt; pat.size(); ++k, ++idx) {
                if (s_[nodes_[v].l + k] != pat[idx]) return false;
            }
            u = v;
        }
        return true;
    }

private:
    std::string s_;
    std::vector&lt;Node&gt; nodes_;
    int active_node_ = 0, active_edge_ = 0, active_len_ = 0, rem_ = 0;

    int new_node(int l, int r) {
        nodes_.push_back(Node{l, r, 0, {}});
        return static_cast&lt;int&gt;(nodes_.size()) - 1;
    }

    void extend(int pos) {
        ++rem_;
        int last_created = 0;
        while (rem_ &gt; 0) {
            if (active_len_ == 0) active_edge_ = pos;
            auto it = nodes_[active_node_].next.find(s_[active_edge_]);
            if (it == nodes_[active_node_].next.end()) {
                // Rule 2 at an explicit node: attach leaf directly
                nodes_[active_node_].next[s_[active_edge_]] = new_node(pos, INF);
                if (last_created != 0) {
                    nodes_[last_created].link = active_node_;
                    last_created = 0;
                }
            } else {
                int nxt = it-&gt;second;
                int len = nodes_[nxt].edge_len(pos);
                // Skip/Count Trick: hop across entire edge if active_len_ &gt;= len
                if (active_len_ &gt;= len) {
                    active_edge_ += len;
                    active_len_ -= len;
                    active_node_ = nxt;
                    continue;
                }
                // Rule 3 (Showstopper): character s_[pos] already on edge
                if (s_[nodes_[nxt].l + active_len_] == s_[pos]) {
                    if (last_created != 0 &amp;&amp; active_node_ != 0) {
                        nodes_[last_created].link = active_node_;
                    }
                    ++active_len_;
                    break;
                }
                // Rule 2 inside an edge: split edge at <code>split</code> and attach leaf
                int split = new_node(nodes_[nxt].l, nodes_[nxt].l + active_len_);
                nodes_[active_node_].next[s_[active_edge_]] = split;
                nodes_[split].next[s_[pos]] = new_node(pos, INF);
                nodes_[nxt].l += active_len_;
                nodes_[split].next[s_[nodes_[nxt].l]] = nxt;
                if (last_created != 0) nodes_[last_created].link = split;
                last_created = split;
            }
            --rem_;
            if (active_node_ == 0 &amp;&amp; active_len_ &gt; 0) {
                --active_len_;
                active_edge_ = pos - rem_ + 1;
            } else if (active_node_ != 0) {
                active_node_ = nodes_[active_node_].link;
            }
        }
    }
};</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Always Append a Unique Terminal Sentinel (<code>'$'</code>) When Counting Leaves</div>
  <p>Without a unique terminal character $\\texttt{'\\$'}$ at the end of $S$, a suffix of $S$ that is also a prefix of another suffix (for example, suffix $\\texttt{\"xa\"}$ in $\\texttt{\"xabxa\"}$) will end inside an internal node or midway along an edge (an <em>implicit suffix tree</em>) rather than at a dedicated leaf! Appending $\\texttt{'\\$'}$ forces one final phase where Rule 2 branches every remaining suffix in $\\text{rem}$, turning the implicit suffix tree into a true Suffix Tree with exactly $N$ leaves.</p>
</div>
</div>`,
    "keyTakeaways": [
      "A Suffix Tree compresses all N suffixes of S + '$' into at most 2N - 1 nodes by labeling edges with [l, r] index slices into S.",
      "Ukkonen's algorithm achieves O(N) online construction via open leaf intervals [l, inf) (Rule 1), suffix links between internal nodes created by edge splits (Rule 2), and immediate phase termination when S[i] already exists at the Active Point (Rule 3).",
      "Appending a unique sentinel '$' guarantees that no suffix is a prefix of another suffix, converting an implicit suffix tree into an explicit Suffix Tree with N leaves."
    ],
    "furtherReading": [
      {
        "title": "Ukkonen (1995) — On-Line Construction of Suffix Trees (Algorithmica)",
        "url": "https://doi.org/10.1007/BF01206331"
      },
      {
        "title": "CP-Algorithms — Suffix Tree and Ukkonen's Linear-Time Algorithm",
        "url": "https://cp-algorithms.com/string/suffix-tree-ukkonen.html"
      }
    ]
  },
  "suffix-arrays-prefix-doubling-sais": {
    "title": "Suffix Arrays: Manber-Myers O(N log N) Prefix Doubling & SA-IS O(N) Overview",
    "video": {
      "youtubeId": "zqKlL3ZpTqs",
      "title": "Suffix Array Construction via Prefix Doubling and Radix Sort",
      "channel": "Pavel Mavrin",
      "duration": "29:45",
      "start": 0,
      "length": 1785,
      "why": "Explains Manber-Myers 2^k prefix doubling, equivalence classes, cyclic shift sorting, and how counting sort on the second component reduces O(N log^2 N) to O(N log N)."
    },
    "intuition": "<p>Udi Manber and Gene Myers (1990) asked: what if we discard all the nodes, child maps, and suffix links of a Suffix Tree and keep only the lexicographically sorted array of suffix starting indices $\\text{SA}[0..N-1]$? This <strong>Suffix Array</strong> occupies just $4N$ bytes (<code>int32_t SA[N]</code>) and corresponds to the left-to-right leaf order of the Suffix Tree. Because every occurrence of a pattern $P[0..M-1]$ is a prefix of a suffix, all occurrences of $P$ form a single contiguous range in $\\text{SA}$ that can be found via binary search!</p><p>To sort all $N$ suffixes without spending $O(N^2 \\log N)$ time comparing $O(N)$-length strings, Manber-Myers <strong>Prefix Doubling</strong> sorts suffixes by their prefixes of length $2^k$ in step $k$: since a prefix of length $2^{k+1}$ is the concatenation of two already-ranked prefixes of length $2^k$ at indices $i$ and $i + 2^k$, each doubling step sorts pairs of integers $(\\text{rank}_k[i],\\; \\text{rank}_k[i + 2^k])$ via stable counting sort in $O(N)$ time, completing in $O(N \\log N)$ time—or $O(N)$ time via Nong, Zhang &amp; Chan's <strong>SA-IS (Induced Sorting, 2009)</strong>.</p>",
    "content": `<div class="lesson-content">
<h3>1. Manber-Myers $O(N \\log N)$ Prefix Doubling</h3>
<p>Append a sentinel $\\texttt{'\\$'}$ (smaller than any alphabet character) to $S$ so its length is $N$, and sort all cyclic shifts of $S$ (which is identical to sorting all suffixes because $\\texttt{'\\$'}$ breaks ties before wrapping around). At iteration $k = 0, 1, \\dots, \\lceil \\log_2 N \\rceil$:</p>
<ul>
  <li>Maintain the array $\\text{sa}[0..N-1]$ of starting indices sorted by their $2^k$-length prefixes, and the equivalence class array $c[i] \\in [0, N-1]$ giving the lexicographical rank of $S[i .. i + 2^k - 1]$.</li>
  <li>To transition from length $2^k$ to $2^{k+1}$, each position $i$ is represented by the 2-tuple of ranks $(c[i],\\; c[(i + 2^k) \\bmod N])$.</li>
  <li><strong>Single-Pass Counting Sort Trick:</strong> We do NOT need two counting sorts per step! Because $\\text{sa}[0..N-1]$ is <em>already</em> sorted by the second component if we shift each index backward by $2^k$ ($\\text{sa}'[j] = (\\text{sa}[j] - 2^k + N) \\bmod N$), we only need <strong>one</strong> stable counting sort on the first component $c[\\text{sa}'[j]]$!</li>
  <li><strong>Early Exit Optimization:</strong> As soon as the number of distinct equivalence classes reaches $N$, all suffixes are strictly ordered and we terminate immediately without running remaining doubling steps.</li>
</ul>

<h3>2. SA-IS ($O(N)$ Suffix Array via Induced Sorting)</h3>
<p>How does SA-IS (Nong, Zhang, Chan 2009) eliminate the $\\log N$ factor? It classifies every suffix $i$ into one of two types in a single right-to-left scan:</p>
<ul>
  <li><strong>S-type (Smaller):</strong> Suffix $S[i..]$ is lexicographically strictly smaller than the next suffix $S[i+1..]$, i.e., $S[i] < S[i+1]$ or ($S[i] == S[i+1]$ and $i+1$ is S-type). The sentinel $S[N-1] = \\texttt{'\\$'}$ is S-type by definition.</li>
  <li><strong>L-type (Larger):</strong> Suffix $S[i..]$ is strictly larger than $S[i+1..]$.</li>
  <li><strong>LMS (Leftmost S-type) Positions:</strong> An index $i > 0$ is an LMS position if $i$ is S-type and $i - 1$ is L-type. Notice that two adjacent indices can never both be LMS, so there are <strong>at most $N / 2$ LMS positions</strong>!</li>
</ul>
<p>SA-IS sorts only the LMS substrings (recursively if LMS substrings have ties, on a string of length $\\le N / 2$), places the sorted LMS suffixes at the ends of their character buckets, and then <strong>induces</strong> the sorted order of all L-type suffixes in one left-to-right pass (scanning $\\text{SA}$ left-to-right: if $\\text{SA}[j] - 1$ is L-type, place it at the front of bucket $S[\\text{SA}[j] - 1]$) followed by all S-type suffixes in one right-to-left pass! By the recurrence $T(N) = T(N/2) + O(N) = O(N)$, SA-IS runs in linear time.</p>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Construction Algorithm</th>
      <th>Time Complexity</th>
      <th>Working Space</th>
      <th>Practical Performance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Naive <code>std::sort</code> on String Slices</td>
      <td>$O(N^2 \\log N)$</td>
      <td>$O(N)$</td>
      <td>Degrades catastrophically on long common prefixes</td>
    </tr>
    <tr>
      <td>Doubling + <code>std::sort</code> on Pairs</td>
      <td>$O(N \\log^2 N)$</td>
      <td>$O(N)$</td>
      <td>Short code (~20 lines), ~$80\\text{ ms}$ for $N = 10^5$</td>
    </tr>
    <tr>
      <td>Manber-Myers Doubling + Counting Sort</td>
      <td>$O(N \\log N)$</td>
      <td>$O(N)$</td>
      <td>Fast (~$25\\text{ ms}$ for $N = 5 \\times 10^5$), early exits when ranks unique</td>
    </tr>
    <tr>
      <td>SA-IS (Induced Sorting) / DivSufSort</td>
      <td>$O(N)$</td>
      <td>$O(N)$</td>
      <td>Fastest in practice (~$5\\text{ ms}$ for $N = 5 \\times 10^5$)</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Bucket Partitioning &amp; Induced Sorting Invariant</div>
  <p>Within any first-character bucket $c \\in \\Sigma$, every L-type suffix starting with $c$ is strictly smaller than every S-type suffix starting with $c$! Why? An L-type suffix starting with $c$ is followed by $c \\dots c d$ with $d < c$, whereas an S-type suffix starting with $c$ is followed by $c \\dots c e$ with $e > c$. Thus every character bucket $[B_{\\text{start}}(c), B_{\\text{end}}(c))$ partitions cleanly into an L-sub-bucket at the head and an S-sub-bucket at the tail.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Cache Locality of Shift-By-2^k Counting Sort</div>
  <p>In Manber-Myers doubling, computing <code>pn[i] = sa[i] - (1 &lt;&lt; k)</code> and incrementing <code>cnt[c[pn[i]]]++</code> performs sequential reads over <code>sa</code>. To maximize L1 cache hits during the bucket-distribution loop, keep the equivalence class array <code>c[0..N-1]</code> as a flat <code>std::vector&lt;int32_t&gt;</code> and terminate the outer loop the instant the number of equivalence classes <code>classes == N</code>.</p>
</div>

<h3>3. Visual Trace: Suffix Array &amp; L/S/LMS Classification on $S = \\texttt{\"banana\\$\"}$</h3>
<svg viewBox="0 0 760 225" width="100%" height="225" role="img" aria-label="Suffix Array and SA-IS L/S/LMS classification for banana$">
  <style>
    .sa-cell { fill: #1e293b; stroke: #475569; stroke-width: 1.2; }
    .sa-lms { fill: #064e3b; stroke: #34d399; stroke-width: 1.8; }
    .sa-txt { font-family: 'JetBrains Mono', monospace; font-size: 13px; fill: #f8fafc; text-anchor: middle; }
    .sa-lbl { font-family: 'Inter', sans-serif; font-size: 12px; fill: #94a3b8; }
    .sa-row { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #cbd5e1; }
  </style>
  <rect width="760" height="225" fill="#0f172a" rx="8"/>

  <!-- Left panel: L/S/LMS classification -->
  <text x="20" y="30" class="sa-lbl" font-weight="bold">SA-IS Type Classification on "banana$":</text>
  <g transform="translate(20, 42)">
    <text x="0" y="20" class="sa-lbl">Idx:</text>
    <text x="0" y="52" class="sa-lbl">Char:</text>
    <text x="0" y="84" class="sa-lbl">Type:</text>
    <text x="0" y="114" class="sa-lbl">LMS:</text>

    <!-- 0:b(L), 1:a(S*), 2:n(L), 3:a(S*), 4:n(L), 5:a(L), 6:$(S*) -->
    <g transform="translate(45, 0)">
      <text x="20" y="20" class="sa-txt">0</text><rect x="2" y="32" width="36" height="28" class="sa-cell"/><text x="20" y="51" class="sa-txt">b</text><text x="20" y="84" class="sa-txt" fill="#fbbf24">L</text>
      <text x="62" y="20" class="sa-txt">1</text><rect x="44" y="32" width="36" height="28" class="sa-lms"/><text x="62" y="51" class="sa-txt">a</text><text x="62" y="84" class="sa-txt" fill="#34d399">S</text><text x="62" y="114" class="sa-txt" fill="#34d399">*</text>
      <text x="104" y="20" class="sa-txt">2</text><rect x="86" y="32" width="36" height="28" class="sa-cell"/><text x="104" y="51" class="sa-txt">n</text><text x="104" y="84" class="sa-txt" fill="#fbbf24">L</text>
      <text x="146" y="20" class="sa-txt">3</text><rect x="128" y="32" width="36" height="28" class="sa-lms"/><text x="146" y="51" class="sa-txt">a</text><text x="146" y="84" class="sa-txt" fill="#34d399">S</text><text x="146" y="114" class="sa-txt" fill="#34d399">*</text>
      <text x="188" y="20" class="sa-txt">4</text><rect x="170" y="32" width="36" height="28" class="sa-cell"/><text x="188" y="51" class="sa-txt">n</text><text x="188" y="84" class="sa-txt" fill="#fbbf24">L</text>
      <text x="230" y="20" class="sa-txt">5</text><rect x="212" y="32" width="36" height="28" class="sa-cell"/><text x="230" y="51" class="sa-txt">a</text><text x="230" y="84" class="sa-txt" fill="#fbbf24">L</text>
      <text x="272" y="20" class="sa-txt">6</text><rect x="254" y="32" width="36" height="28" class="sa-lms"/><text x="272" y="51" class="sa-txt">$</text><text x="272" y="84" class="sa-txt" fill="#34d399">S</text><text x="272" y="114" class="sa-txt" fill="#34d399">*</text>
    </g>
    <text x="0" y="150" class="sa-lbl">Note: i=5 ('a$') is L-type because 'a' &gt; '$'!</text>
  </g>

  <!-- Right panel: Final Sorted Suffix Array -->
  <text x="415" y="30" class="sa-lbl" font-weight="bold">Sorted Suffix Array SA[0..6]:</text>
  <g transform="translate(415, 52)">
    <text x="0" y="0" class="sa-row" fill="#93c5fd">Rank   SA[r]   Suffix S[SA[r]..]</text>
    <text x="0" y="22" class="sa-row"> 0       6     $</text>
    <text x="0" y="42" class="sa-row"> 1       5     a$</text>
    <text x="0" y="62" class="sa-row"> 2       3     ana$</text>
    <text x="0" y="82" class="sa-row"> 3       1     anana$</text>
    <text x="0" y="102" class="sa-row"> 4       0     banana$</text>
    <text x="0" y="122" class="sa-row"> 5       4     na$</text>
    <text x="0" y="142" class="sa-row"> 6       2     nana$</text>
  </g>
</svg>

<div class="mermaid">
flowchart LR
  A["Init k=0: Counting Sort 1-char prefixes into SA[0..N-1] and classes c[0..N-1]"] --> B{"(1 &lt;&lt; k) &lt; N and classes &lt; N?"}
  B -- "Yes" --> C["Shift second halves: pn[i] = (SA[i] - 2^k + N) mod N"]
  C --> D["Stable Counting Sort pn[] by primary key c[pn[i]] into SA[]"]
  D --> E["Recompute new equivalence classes cn[] from pairs (c[i], c[i + 2^k])"]
  E --> F["c = cn; k++"]
  F --> B
  B -- "No" --> G["Return SA[1..N-1] (drop sentinel '$')"]
</div>

<div class="simulator-mount" data-sim="sim-suffix-array-sam"></div>

<h3>4. Production Implementation: $O(N \\log N)$ Prefix Doubling + Pattern Binary Search</h3>
<pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;string&gt;
#include &lt;string_view&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

// Builds Suffix Array in O(N log N) time using Manber-Myers Prefix Doubling
std::vector&lt;int&gt; build_suffix_array(std::string_view str) {
    // Append '\0' sentinel (strictly smaller than any printable char)
    const int n = static_cast&lt;int&gt;(str.size()) + 1;
    const int alpha = 256;
    std::vector&lt;int&gt; p(n), c(n), cnt(std::max(alpha, n), 0);

    for (int i = 0; i &lt; n - 1; ++i) cnt[static_cast&lt;uint8_t&gt;(str[i])]++;
    cnt[0]++; // Sentinel at n - 1
    for (int i = 1; i &lt; alpha; ++i) cnt[i] += cnt[i - 1];
    for (int i = 0; i &lt; n; ++i) {
        uint8_t ch = (i == n - 1) ? 0 : static_cast&lt;uint8_t&gt;(str[i]);
        p[--cnt[ch]] = i;
    }

    c[p[0]] = 0;
    int classes = 1;
    for (int i = 1; i &lt; n; ++i) {
        uint8_t ch_cur = (p[i] == n - 1) ? 0 : static_cast&lt;uint8_t&gt;(str[p[i]]);
        uint8_t ch_prv = (p[i - 1] == n - 1) ? 0 : static_cast&lt;uint8_t&gt;(str[p[i - 1]]);
        if (ch_cur != ch_prv) ++classes;
        c[p[i]] = classes - 1;
    }

    std::vector&lt;int&gt; pn(n), cn(n);
    for (int h = 0; (1 &lt;&lt; h) &lt; n &amp;&amp; classes &lt; n; ++h) {
        int step = 1 &lt;&lt; h;
        for (int i = 0; i &lt; n; ++i) {
            pn[i] = p[i] - step;
            if (pn[i] &lt; 0) pn[i] += n;
        }
        std::fill(cnt.begin(), cnt.begin() + classes, 0);
        for (int i = 0; i &lt; n; ++i) cnt[c[pn[i]]]++;
        for (int i = 1; i &lt; classes; ++i) cnt[i] += cnt[i - 1];
        for (int i = n - 1; i &gt;= 0; --i) p[--cnt[c[pn[i]]]] = pn[i];

        cn[p[0]] = 0;
        classes = 1;
        for (int i = 1; i &lt; n; ++i) {
            std::pair&lt;int, int&gt; cur = {c[p[i]], c[(p[i] + step) % n]};
            std::pair&lt;int, int&gt; prv = {c[p[i - 1]], c[(p[i - 1] + step) % n]};
            if (cur != prv) ++classes;
            cn[p[i]] = classes - 1;
        }
        c.swap(cn);
    }

    p.erase(p.begin()); // Remove the '\0' sentinel suffix at p[0] == n - 1
    return p;
}

// Returns half-open range [L, R) in SA where pattern P occurs as a prefix
std::pair&lt;int, int&gt; suffix_array_search(std::string_view text,
                                        const std::vector&lt;int&gt;&amp; sa,
                                        std::string_view pat) {
    auto cmp_lower = [&amp;](int idx, std::string_view q) {
        return text.substr(idx, q.size()) &lt; q;
    };
    auto cmp_upper = [&amp;](std::string_view q, int idx) {
        return q &lt; text.substr(idx, q.size());
    };
    auto l = std::lower_bound(sa.begin(), sa.end(), pat, cmp_lower);
    auto r = std::upper_bound(l, sa.end(), pat, cmp_upper);
    return {static_cast&lt;int&gt;(l - sa.begin()), static_cast&lt;int&gt;(r - sa.begin())};
}</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Cyclic Shift Sorting vs. Suffix Sorting Without a Sentinel</div>
  <p>Manber-Myers prefix doubling sorts <strong>cyclic shifts</strong> modulo $N$ via <code>(p[i] + step) % n</code>. If you forget to append a sentinel character strictly smaller than every character in $S$, sorting cyclic shifts is NOT equivalent to sorting suffixes! For example, on $S = \\texttt{\"ab\"}$, suffix $1$ is $\\texttt{\"b\"}$ and suffix $0$ is $\\texttt{\"ab\"}$ ($\\texttt{\"ab\"} < \\texttt{\"b\"}$), but on $S = \\texttt{\"ba\"}$, cyclic shift $1$ wraps around to $\\texttt{\"ab\"}$ whereas suffix $1$ is $\\texttt{\"a\"}$. Appending $\\texttt{'\\0'}$ ensures every comparison hits the unique smallest sentinel at index $N - 1$ before wrapping around.</p>
</div>
</div>`,
    "keyTakeaways": [
      "A Suffix Array SA[0..N-1] stores the starting indices of all suffixes of S in lexicographical order, using 4N bytes instead of a Suffix Tree's 20N-48N bytes.",
      "Manber-Myers prefix doubling sorts suffixes by 2^k-length prefixes in O(N log N) time by shifting SA by -2^k and running one stable counting sort on the primary rank c[pn[i]] per doubling step.",
      "SA-IS achieves O(N) suffix array construction by partitioning suffixes into L-type and S-type, recursively sorting at most N/2 Leftmost-S (LMS) positions, and inducing the full order in two linear sweeps."
    ],
    "furtherReading": [
      {
        "title": "Manber & Myers (1993) — Suffix Arrays: A New Method for On-Line String Searches (SIAM J. Comput.)",
        "url": "https://doi.org/10.1137/0222058"
      },
      {
        "title": "Nong, Zhang & Chan (2009) — Linear Suffix Array Construction by Almost Pure Induced-Sorting (DCC)",
        "url": "https://doi.org/10.1109/DCC.2009.42"
      },
      {
        "title": "CP-Algorithms — Suffix Array Construction in O(N log N)",
        "url": "https://cp-algorithms.com/string/suffix-array.html"
      }
    ]
  },
  "kasai-lcp-array-rmq": {
    "title": "Kasai's O(N) LCP Array Algorithm & Counting Distinct Substrings via SA + LCP",
    "video": {
      "youtubeId": "VpEumOuakOU",
      "title": "Kasai's LCP Array Algorithm and Suffix Array Applications",
      "channel": "WilliamFiset",
      "duration": "16:28",
      "start": 0,
      "length": 988,
      "why": "Demonstrates Kasai's h >= lcp - 1 invariant in text order and shows how SA + LCP immediately counts distinct substrings and finds longest repeated substrings."
    },
    "intuition": "<p>A Suffix Array $\\text{SA}[0..N-1]$ by itself loses the internal branching depth information of a Suffix Tree. We restore all of that power by computing the <strong>Longest Common Prefix (LCP) Array</strong> $\\text{lcp}[0..N-2]$, where $\\text{lcp}[r]$ is the length of the longest common prefix between adjacent sorted suffixes $\\text{SA}[r]$ and $\\text{SA}[r+1]$. Computing $\\text{lcp}[r]$ naively in sorted rank order $r = 0..N-2$ takes $O(N^2)$ time because two adjacent suffixes in $\\text{SA}$ can come from completely unrelated positions in the text.</p><p>Toru Kasai et al. (2001) discovered that if you compute LCP values in <strong>text order</strong> ($i = 0, 1, \\dots, N-1$) instead of rank order, dropping the first character of suffix $S[i..]$ and its predecessor in $\\text{SA}$ moves you to suffix $S[i+1..]$ while reducing their shared common prefix by <strong>at most $1$ character</strong>: $\\text{lcp}[\\text{rank}[i+1]] \\ge \\text{lcp}[\\text{rank}[i]] - 1$! Just like KMP and the Z-algorithm, the matched length $h$ decreases at most $N$ times and increases at most $N$ times, constructing the entire LCP array in $O(N)$ time.</p>",
    "content": `<div class="lesson-content">
<h3>1. Kasai's Theorem: Why $\\text{LCP}$ Drops by at Most $1$ in Text Order</h3>
<p>Let $\\text{rank}[i] \\in [0, N-1]$ be the inverse permutation of $\\text{SA}$, so $\\text{SA}[\\text{rank}[i]] = i$. Suppose suffix $i$ at rank $r = \\text{rank}[i] < N - 1$ shares a longest common prefix of length $h > 0$ with the next suffix in sorted order, $j = \\text{SA}[r + 1]$:</p>
$$\\text{LCP}(S[i..],\\; S[j..]) = h > 0 \\implies S[i..i+h-1] = S[j..j+h-1]$$
<p>Now delete the first character $S[i] = S[j]$ from both suffixes! We obtain suffix $S[i+1..]$ and suffix $S[j+1..]$:</p>
<ol>
  <li>Because $S[i..]$ is lexicographically smaller than $S[j..]$ and their first characters are identical ($h \\ge 1$), suffix $S[i+1..]$ MUST still be lexicographically smaller than $S[j+1..]$, so $\\text{rank}[i+1] < \\text{rank}[j+1]$.</li>
  <li>Moreover, $S[i+1..]$ and $S[j+1..]$ share a common prefix of length exactly $h - 1$: $S[i+1..i+h-1] = S[j+1..j+h-1]$.</li>
  <li>By the <strong>LCP Range Minimum Property</strong>, any suffix lying lexicographically between $\\text{rank}[i+1]$ and $\\text{rank}[j+1]$ in $\\text{SA}$ (specifically the immediate neighbor $\\text{SA}[\\text{rank}[i+1] + 1]$) must ALSO share a common prefix of length <strong>at least $h - 1$</strong> with $S[i+1..]$!</li>
</ol>
<p>Therefore, when moving from text index $i$ to $i + 1$, we simply set <code>if (h &gt; 0) --h;</code> and start comparing characters from offset $h$ onward!</p>

<h3>2. Three Classic Applications of $\\text{SA} + \\text{LCP}$</h3>
<ul>
  <li><strong>Arbitrary Suffix LCP via RMQ:</strong> For any two suffixes at ranks $r_1 < r_2$ in $\\text{SA}$, the length of their longest common prefix is the minimum of adjacent LCPs between them:
  $$\\text{LCP}(\\text{SA}[r_1],\\; \\text{SA}[r_2]) = \\min_{r_1 \\le k < r_2} \\text{lcp}[k]$$
  Building a Sparse Table over $\\text{lcp}[0..N-2]$ answers $\\text{LCP}(i, j)$ for any two text positions in $O(1)$ time!</li>
  <li><strong>Counting Distinct Substrings in $O(N)$:</strong> Every substring of $S$ is a prefix of some suffix $\\text{SA}[r]$. Suffix $\\text{SA}[r]$ has length $N - \\text{SA}[r]$, so it contributes $N - \\text{SA}[r]$ prefixes in total, of which $\\text{lcp}[r-1]$ were already counted as prefixes of the preceding suffix $\\text{SA}[r-1]$. Summing the newly introduced prefixes across all ranks gives:
  $$\\text{Distinct Substrings}(S) = \\frac{N(N + 1)}{2} - \\sum_{r=0}^{N-2} \\text{lcp}[r]$$</li>
  <li><strong>Longest Repeated Substring:</strong> The maximum value $\\max_{0 \\le r < N-1} \\text{lcp}[r]$ is the exact length of the longest substring that appears at least twice in $S$.</li>
</ul>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Problem / Query</th>
      <th>With Suffix Tree</th>
      <th>With Suffix Array + LCP (+ Sparse Table)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Build Structure + LCP</td>
      <td>$O(N \\log |\\Sigma|)$ ($40N$ bytes)</td>
      <td>$O(N \\log N)$ or $O(N)$ ($8N$ bytes)</td>
    </tr>
    <tr>
      <td>Number of Distinct Substrings</td>
      <td>Sum edge lengths $\\sum (r_e - l_e)$ in $O(N)$</td>
      <td>$\\frac{N(N+1)}{2} - \\sum \\text{lcp}[r]$ in $O(N)$</td>
    </tr>
    <tr>
      <td>Longest Common Prefix of $S[i..]$ and $S[j..]$</td>
      <td>Lowest Common Ancestor (LCA) in $O(1)$</td>
      <td>Range Minimum Query (RMQ) on $\\text{lcp}$ in $O(1)$</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Kasai Lower-Bound &amp; LCP-RMQ Duality Invariant</div>
  <p>For every text position $i \\in [0, N-2]$ with $\\text{rank}[i] < N - 1$, $\\text{lcp}[\\text{rank}[i + 1]] \\ge \\text{lcp}[\\text{rank}[i]] - 1$. Furthermore, for any sorted ranks $0 \\le l < r < N$, $\\text{LCP}(\\text{SA}[l], \\text{SA}[r]) = \\min_{l \\le k < r} \\text{lcp}[k]$, which is the exact array-based dual of the Lowest Common Ancestor (LCA) depth of leaves $l$ and $r$ in the Suffix Tree.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">64-Bit Overflow in N(N + 1) / 2 Distinct Substring Counts</div>
  <p>For a string of length $N = 10^5$, the total number of substrings $\\frac{N(N + 1)}{2}$ is approximately $5 \\times 10^9$, which overflows a signed 32-bit <code>int</code> (max $\\approx 2.14 \\times 10^9$). Always accumulate $\\frac{N(N+1)}{2} - \\sum \\text{lcp}[r]$ in a 64-bit integer (<code>int64_t</code> / <code>long long</code>).</p>
</div>

<h3>3. Visual Trace: Kasai LCP &amp; Distinct Substrings on $S = \\texttt{\"banana\"}$</h3>
<svg viewBox="0 0 760 210" width="100%" height="210" role="img" aria-label="LCP histogram and distinct substring calculation for banana">
  <style>
    .lcp-hdr { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: bold; fill: #93c5fd; }
    .lcp-row { font-family: 'JetBrains Mono', monospace; font-size: 13px; fill: #e2e8f0; }
    .lcp-dup { fill: #f87171; }
    .lcp-new { fill: #34d399; }
  </style>
  <rect width="760" height="210" fill="#0f172a" rx="8"/>

  <text x="25" y="30" class="lcp-hdr">Rank r   SA[r]   lcp[r-1]   Suffix (Red = Shared w/ Prev, Green = New Distinct Prefixes)   New Count</text>

  <g transform="translate(25, 55)">
    <text x="0" y="0" class="lcp-row">  0        5        -       </text>
    <text x="230" y="0" class="lcp-row lcp-new">a</text>
    <text x="640" y="0" class="lcp-row">1 - 0 = 1</text>

    <text x="0" y="24" class="lcp-row">  1        3        1       </text>
    <text x="230" y="24" class="lcp-row"><tspan class="lcp-dup">a</tspan><tspan class="lcp-new">na</tspan></text>
    <text x="640" y="24" class="lcp-row">3 - 1 = 2</text>

    <text x="0" y="48" class="lcp-row">  2        1        3       </text>
    <text x="230" y="48" class="lcp-row"><tspan class="lcp-dup">ana</tspan><tspan class="lcp-new">na</tspan></text>
    <text x="640" y="48" class="lcp-row">5 - 3 = 2</text>

    <text x="0" y="72" class="lcp-row">  3        0        0       </text>
    <text x="230" y="72" class="lcp-row lcp-new">banana</text>
    <text x="640" y="72" class="lcp-row">6 - 0 = 6</text>

    <text x="0" y="96" class="lcp-row">  4        4        0       </text>
    <text x="230" y="96" class="lcp-row lcp-new">na</text>
    <text x="640" y="96" class="lcp-row">2 - 0 = 2</text>

    <text x="0" y="120" class="lcp-row">  5        2        2       </text>
    <text x="230" y="120" class="lcp-row"><tspan class="lcp-dup">na</tspan><tspan class="lcp-new">na</tspan></text>
    <text x="640" y="120" class="lcp-row">4 - 2 = 2</text>

    <text x="0" y="146" class="lcp-hdr" fill="#fbbf24">Total Distinct Substrings = 6*7/2 - (1 + 3 + 0 + 0 + 2) = 21 - 6 = 15</text>
  </g>
</svg>

<div class="mermaid">
flowchart LR
  A["Invert SA: rank[SA[r]] = r; init h = 0"] --> B["Loop text index i = 0 .. N-1"]
  B --> C{"rank[i] == N - 1?"}
  C -- "Yes (last suffix in SA)" --> D["h = 0; continue"]
  C -- "No" --> E["Let j = SA[rank[i] + 1]"]
  E --> F["While S[i + h] == S[j + h]: h++"]
  F --> G["lcp[rank[i]] = h; if (h &gt; 0) h--"]
  G --> B
  D --> B
</div>

<div class="simulator-mount" data-sim="sim-suffix-array-sam"></div>

<h3>4. Production Implementation: Kasai's $O(N)$ LCP &amp; Distinct Substring Counter</h3>
<pre><code class="language-cpp">#include &lt;cstdint&gt;
#include &lt;numeric&gt;
#include &lt;string_view&gt;
#include &lt;vector&gt;

// Kasai's O(N) Algorithm: returns lcp[0..N-2] where lcp[r] = LCP(SA[r], SA[r+1])
std::vector&lt;int&gt; build_lcp_kasai(std::string_view s, const std::vector&lt;int&gt;&amp; sa) {
    const int n = static_cast&lt;int&gt;(s.size());
    if (n &lt;= 1) return {};

    std::vector&lt;int&gt; rank(n, 0);
    for (int r = 0; r &lt; n; ++r) {
        rank[sa[r]] = r;
    }

    std::vector&lt;int&gt; lcp(n - 1, 0);
    int h = 0;
    for (int i = 0; i &lt; n; ++i) {
        if (rank[i] == n - 1) {
            h = 0;
            continue;
        }
        int j = sa[rank[i] + 1];
        while (i + h &lt; n &amp;&amp; j + h &lt; n &amp;&amp; s[i + h] == s[j + h]) {
            ++h;
        }
        lcp[rank[i]] = h;
        if (h &gt; 0) --h;
    }
    return lcp;
}

// Counts total distinct non-empty substrings of S in O(N) after SA + LCP construction
int64_t count_distinct_substrings(int64_t n, const std::vector&lt;int&gt;&amp; lcp) {
    int64_t total_substrings = n * (n + 1) / 2;
    int64_t duplicate_prefixes = std::accumulate(lcp.begin(), lcp.end(), int64_t{0});
    return total_substrings - duplicate_prefixes;
}</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Off-By-One Convention in LCP Indexing</div>
  <p>Two conventions exist in textbooks and competitive programming libraries: some define $\\text{lcp}[r] = \\text{LCP}(\\text{SA}[r], \\text{SA}[r+1])$ of length $N - 1$ (so $\\text{LCP}(\\text{SA}[l], \\text{SA}[r]) = \\min_{l \\le k < r} \\text{lcp}[k]$), while others define $\\text{lcp}[r] = \\text{LCP}(\\text{SA}[r-1], \\text{SA}[r])$ of length $N$ with $\\text{lcp}[0] = 0$ (so $\\text{LCP}(\\text{SA}[l], \\text{SA}[r]) = \\min_{l + 1 \\le k \\le r} \\text{lcp}[k]$). Notice that in both conventions the RMQ interval spans $r - l$ elements, NOT $r - l + 1$! Querying $\\min_{l \\le k \\le r} \\text{lcp}[k]$ accidentally includes the boundary with $\\text{SA}[r+1]$ (or $\\text{SA}[l-1]$) and corrupts the LCP query.</p>
</div>
</div>`,
    "keyTakeaways": [
      "Kasai's algorithm computes the LCP array in O(N) time by iterating in text order i = 0..N-1 and exploiting the inequality lcp[rank[i+1]] >= lcp[rank[i]] - 1.",
      "The LCP of any two arbitrary suffixes at sorted ranks l < r equals the range minimum min_{l <= k < r} lcp[k], turning SuffixTree LCA queries into O(1) Sparse Table RMQ queries.",
      "The number of distinct non-empty substrings in a string of length N is exactly N(N + 1)/2 - sum_{r=0}^{N-2} lcp[r]."
    ],
    "furtherReading": [
      {
        "title": "Kasai et al. (2001) — Linear-Time Longest-Common-Prefix Computation in Suffix Arrays and Its Applications (CPM)",
        "url": "https://doi.org/10.1007/3-540-48194-X_17"
      },
      {
        "title": "CP-Algorithms — Suffix Array and Kasai's Linear-Time LCP Construction",
        "url": "https://cp-algorithms.com/string/suffix-array.html"
      }
    ]
  },
  "suffix-automaton-sam-endpos": {
    "title": "Suffix Automaton (SAM / DAWG): endpos Equivalence Classes & State Transitions",
    video: {
      youtubeId: "-QgNAkzOm7g",
      id: "-QgNAkzOm7g",
      url: "https://www.youtube.com/embed/-QgNAkzOm7g",
      title: "Suffix Automaton (SAM): endpos Equivalence Classes, Suffix Links & State Cloning",
      channel: "TeKisH",
      duration: "24:35",
      start: 0,
      length: "24m",
      why: "Derives the endpos equivalence relation, suffix link tree, state cloning rule when len[q] > len[p] + 1, and proves the 2N - 1 state bound and 3N - 4 transition bound."
    },
    "intuition": "<p>A Suffix Automaton (SAM, or Directed Acyclic Word Graph / DAWG, Blumer et al. 1985) is the smallest deterministic finite automaton that recognizes all substrings of a string $S[0..N-1]$. How can a DFA that accepts up to $\\Theta(N^2)$ distinct substrings have at most $2N - 1$ states and $3N - 4$ transitions? By grouping substrings that always finish at the exact same set of text positions into a single state!</p><p>Formally, for any non-empty substring $t$ of $S$, let $\\text{endpos}(t) \\subseteq \\{0, 1, \\dots, N-1\\}$ be the set of 0-based indices in $S$ where occurrences of $t$ end. Two substrings $u$ and $v$ are <strong>$\\text{endpos}$-equivalent</strong> ($u \\sim v$) if and only if $\\text{endpos}(u) = \\text{endpos}(v)$. Every state $q$ in the Suffix Automaton corresponds bijectively to one $\\text{endpos}$ equivalence class, representing a contiguous interval of suffix lengths $[\\text{minlen}(q),\\; \\text{len}(q)]$, where $\\text{minlen}(q) = \\text{len}(\\text{link}(q)) + 1$!</p>",
    "content": `<div class="lesson-content">
<h3>1. The Four Fundamental Lemmas of $\\text{endpos}(t)$</h3>
<p>Every property of the Suffix Automaton follows from four elementary facts about $\\text{endpos}(t)$:</p>
<ol>
  <li><strong>Nested Suffix Inclusion:</strong> If $|u| \\le |w|$ and $\\text{endpos}(u) \\cap \\text{endpos}(w) \\neq \\emptyset$, then $u$ MUST be a suffix of $w$, which implies $\\text{endpos}(w) \\subseteq \\text{endpos}(u)$. Thus any two $\\text{endpos}$ sets are either <strong>completely disjoint</strong> or <strong>one is a subset of the other</strong>!</li>
  <li><strong>Contiguous Suffix Interval per State:</strong> All substrings inside a single equivalence class $q$ are suffixes of the longest substring $W(q)$ in $q$ (of length $\\text{len}[q]$), and they consist of all suffixes of $W(q)$ of lengths in the contiguous range $[\\text{minlen}[q],\\; \\text{len}[q]]$.</li>
  <li><strong>The Suffix Link Tree ($\\text{link}[q]$):</strong> As you shorten $W(q)$ one character at a time from the left, the set of ending positions stays equal to $\\text{endpos}(q)$ down to length $\\text{minlen}[q]$, and at length $\\text{minlen}[q] - 1$ it strictly expands into a larger $\\text{endpos}$ set! That state is defined as $\\text{link}[q]$, so:
  $$\\text{minlen}[q] = \\text{len}[\\text{link}[q]] + 1$$
  Because $\\text{endpos}$ sets are either disjoint or nested, the links $\\text{link}[q]$ form a rooted tree (the <strong>Link Tree</strong>) with at most $N$ leaves, proving the automaton has <strong>at most $2N - 1$ states</strong> (and at most $3N - 4$ edges).</li>
  <li><strong>Instant Substring Count:</strong> Since state $q$ represents exactly $\\text{len}[q] - \\text{len}[\\text{link}[q]]$ distinct substrings and states partition all non-empty substrings of $S$, the total number of distinct substrings of $S$ is simply $\\sum_{q > 0} (\\text{len}[q] - \\text{len}[\\text{link}[q]])$.</li>
</ol>

<h3>2. Online $O(N)$ Extension &amp; State Cloning</h3>
<p>When we append character $c = S[i]$ to the string processed so far (whose full prefix state is $\\text{last}$), we create a new state $\\text{cur}$ with $\\text{len}[\\text{cur}] = \\text{len}[\\text{last}] + 1$, walk up the suffix link chain $p = \\text{last}, \\text{link}[\\text{last}], \\dots$ adding transition $\\text{next}[p][c] = \\text{cur}$ while $\\text{next}[p][c]$ is absent, and then handle three cases:</p>
<ul>
  <li><strong>Case 1 (Reached root with no existing $c$-edge):</strong> Set $\\text{link}[\\text{cur}] = 0$ (the root).</li>
  <li><strong>Case 2 ($q = \\text{next}[p][c]$ exists and $\\text{len}[q] == \\text{len}[p] + 1$):</strong> State $q$ contains ONLY suffixes of the new string, so we simply set $\\text{link}[\\text{cur}] = q$.</li>
  <li><strong>Case 3 ($q = \\text{next}[p][c]$ exists and $\\text{len}[q] > \\text{len}[p] + 1$):</strong> State $q$ contains strings longer than $\\text{len}[p] + 1$ that do NOT end at index $i$, so their $\\text{endpos}$ set has split from the shorter suffixes of length $\\le \\text{len}[p] + 1$! We <strong>clone</strong> $q$ into a new state $\\text{clone}$ with $\\text{len}[\\text{clone}] = \\text{len}[p] + 1$, copy $q$'s outgoing transitions and suffix link to $\\text{clone}$, redirect transitions $\\text{next}[p][c] == q$ along $p$'s link chain to $\\text{clone}$, and set $\\text{link}[q] = \\text{link}[\\text{cur}] = \\text{clone}$.</li>
</ul>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>SAM Metric / Operation</th>
      <th>Worst-Case Bound</th>
      <th>Key Structural Reason</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Number of States $|V|$</td>
      <td>$\\le 2N - 1$ (for $N \\ge 2$)</td>
      <td>Each <code>extend</code> adds $1$ primary state + at most $1$ clone; tree of disjoint $\\text{endpos}$ sets</td>
    </tr>
    <tr>
      <td>Number of Transitions $|E|$</td>
      <td>$\\le 3N - 4$ (for $N \\ge 3$)</td>
      <td>Spanning tree of longest paths ($|V| - 1$) + at most $N + 1$ non-tree shortcuts</td>
    </tr>
    <tr>
      <td>Distinct Substrings of $S$</td>
      <td>$O(N)$</td>
      <td>$\\sum_{u > 0} (\\text{len}[u] - \\text{len}[\\text{link}[u]])$</td>
    </tr>
    <tr>
      <td>Longest Common Substring of $S$ and $T$</td>
      <td>$O(|S| + |T|)$</td>
      <td>Feed $T$ through SAM of $S$, falling back via $\\text{link}[u]$ on mismatch</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">SAM Partition &amp; Clone-Occurrence Invariant</div>
  <p>Every non-empty substring of $S$ belongs to a unique state $u$ of the SAM, and $|\\text{endpos}(u)|$ equals the number of non-cloned primary states in the subtree of $u$ in the Suffix Link Tree. When a state $q$ is cloned into $\\text{clone}$, the primary state receives initial count $\\text{cnt}[\\text{cur}] = 1$ while $\\text{cnt}[\\text{clone}] = 0$ so that bottom-up link-tree aggregation never double-counts occurrences.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Preallocating 2N States &amp; Length-Bucket Topological Sort</div>
  <p>Because $|V| \\le 2N$, calling <code>st.reserve(2 * n)</code> up front avoids all vector reallocations during construction. Furthermore, to aggregate occurrence counts bottom-up on the Link Tree ($\text{cnt}[\text{link}[u]] \mathrel{+}= \text{cnt}[u]$), you do NOT need to build adjacency lists or run recursion: simply counting-sort states by $\text{len}[u]$ in $O(N)$ time and iterate from longest $\text{len}[u]$ down to $1$!</p>
</div>

<h3>3. Visual Trace: SAM States &amp; Suffix Links for $S = \\texttt{\"abcbc\"}$</h3>
<svg viewBox="0 0 760 225" width="100%" height="225" role="img" aria-label="Suffix Automaton DAWG transitions and suffix links for abcbc">
  <style>
    .sam-node { fill: #1e293b; stroke: #64748b; stroke-width: 1.5; rx: 6; }
    .sam-clone { fill: #1e1b4b; stroke: #818cf8; stroke-width: 1.8; rx: 6; }
    .sam-txt { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #f8fafc; text-anchor: middle; }
    .sam-sub { font-family: 'Inter', sans-serif; font-size: 11px; fill: #94a3b8; text-anchor: middle; }
    .sam-edge { stroke: #34d399; stroke-width: 1.5; fill: none; }
    .sam-link { stroke: #f87171; stroke-width: 1.5; stroke-dasharray: 4,4; fill: none; }
  </style>
  <rect width="760" height="225" fill="#0f172a" rx="8"/>

  <!-- Spine states: 0("") -> 1("a") -> 2("ab") -> 3("abc") -> 4("abcb") -> 6("abcbc") -->
  <rect x="20" y="35" width="82" height="52" class="sam-node"/>
  <text x="61" y="57" class="sam-txt">0: ""</text>
  <text x="61" y="75" class="sam-sub">len=0</text>

  <rect x="145" y="35" width="88" height="52" class="sam-node"/>
  <text x="189" y="57" class="sam-txt">1: {"a"}</text>
  <text x="189" y="75" class="sam-sub">len=1, lk=0</text>

  <rect x="275" y="35" width="95" height="52" class="sam-node"/>
  <text x="322" y="57" class="sam-txt">2:{"ab"}</text>
  <text x="322" y="75" class="sam-sub">len=2, lk=5</text>

  <rect x="415" y="35" width="100" height="52" class="sam-node"/>
  <text x="465" y="57" class="sam-txt">3:{"abc"}</text>
  <text x="465" y="75" class="sam-sub">len=3, lk=7</text>

  <rect x="555" y="35" width="90" height="52" class="sam-node"/>
  <text x="600" y="57" class="sam-txt">4:"abcb"</text>
  <text x="600" y="75" class="sam-sub">len=4, lk=5</text>

  <rect x="665" y="35" width="80" height="52" class="sam-node"/>
  <text x="705" y="57" class="sam-txt">6:"..bc"</text>
  <text x="705" y="75" class="sam-sub">len=5, lk=7</text>

  <!-- Cloned states below: 5({"b"}, len=1, lk=0) and 7({"bc","c"}, len=2, lk=0) -->
  <rect x="275" y="140" width="120" height="55" class="sam-clone"/>
  <text x="335" y="162" class="sam-txt">5 (Clone): {"b"}</text>
  <text x="335" y="182" class="sam-sub">endpos={1,3}, lk=0</text>

  <rect x="460" y="140" width="150" height="55" class="sam-clone"/>
  <text x="535" y="162" class="sam-txt">7 (Clone): {"bc","c"}</text>
  <text x="535" y="182" class="sam-sub">endpos={2,4}, lk=0</text>

  <!-- Spine transitions -->
  <line x1="102" y1="61" x2="145" y2="61" class="sam-edge"/>
  <line x1="233" y1="61" x2="275" y2="61" class="sam-edge"/>
  <line x1="370" y1="61" x2="415" y2="61" class="sam-edge"/>
  <line x1="515" y1="61" x2="555" y2="61" class="sam-edge"/>
  <line x1="645" y1="61" x2="665" y2="61" class="sam-edge"/>

  <!-- Clone transitions & suffix links -->
  <line x1="85" y1="87" x2="275" y2="160" class="sam-edge"/>
  <line x1="395" y1="167" x2="460" y2="167" class="sam-edge"/>
  <line x1="322" y1="87" x2="322" y2="140" class="sam-link"/>
  <line x1="465" y1="87" x2="510" y2="140" class="sam-link"/>
  <line x1="600" y1="87" x2="365" y2="140" class="sam-link"/>
  <line x1="705" y1="87" x2="565" y2="140" class="sam-link"/>
</svg>

<div class="mermaid">
flowchart TD
  A["Extend SAM with char c: create cur (len = len[last] + 1)"] --> B["Walk p = last via link[p] while next[p][c] == -1: set next[p][c] = cur"]
  B --> C{"Did p reach -1?"}
  C -- "Yes" --> D["link[cur] = 0 (root)"]
  C -- "No: let q = next[p][c]" --> E{"Is len[q] == len[p] + 1?"}
  E -- "Yes" --> F["link[cur] = q"]
  E -- "No (len[q] &gt; len[p] + 1)" --> G["Create clone of q with len = len[p] + 1; redirect next[p][c] == q to clone"]
  G --> H["link[q] = link[cur] = clone"]
  D --> I["last = cur"]
  F --> I
  H --> I
</div>

<div class="simulator-mount" data-sim="sim-suffix-array-sam"></div>

<h3>4. Production Implementation: Suffix Automaton + LCS of Two Strings</h3>
<pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;array&gt;
#include &lt;cstdint&gt;
#include &lt;string_view&gt;
#include &lt;vector&gt;

class SuffixAutomaton {
public:
    struct State {
        std::array&lt;int, 26&gt; next;
        int len = 0;
        int link = -1;
        State() { next.fill(-1); }
    };

    explicit SuffixAutomaton(std::string_view s) {
        st_.reserve(2 * s.size() + 1);
        st_.emplace_back(); // State 0 = root
        for (char ch : s) extend(ch - 'a');
    }

    void extend(int c) {
        int cur = static_cast&lt;int&gt;(st_.size());
        st_.emplace_back();
        st_[cur].len = st_[last_].len + 1;

        int p = last_;
        while (p != -1 &amp;&amp; st_[p].next[c] == -1) {
            st_[p].next[c] = cur;
            p = st_[p].link;
        }
        if (p == -1) {
            st_[cur].link = 0;
        } else {
            int q = st_[p].next[c];
            if (st_[p].len + 1 == st_[q].len) {
                st_[cur].link = q;
            } else {
                int clone = static_cast&lt;int&gt;(st_.size());
                st_.push_back(st_[q]); // Copies next[] and link
                st_[clone].len = st_[p].len + 1;
                while (p != -1 &amp;&amp; st_[p].next[c] == q) {
                    st_[p].next[c] = clone;
                    p = st_[p].link;
                }
                st_[q].link = st_[cur].link = clone;
            }
        }
        last_ = cur;
    }

    int64_t count_distinct_substrings() const {
        int64_t total = 0;
        for (size_t u = 1; u &lt; st_.size(); ++u) {
            total += st_[u].len - st_[st_[u].link].len;
        }
        return total;
    }

    // Returns length of Longest Common Substring with T in O(|T|) time
    int longest_common_substring(std::string_view t) const {
        int u = 0, cur_len = 0, best = 0;
        for (char ch : t) {
            int c = ch - 'a';
            while (u != 0 &amp;&amp; st_[u].next[c] == -1) {
                u = st_[u].link;
                cur_len = st_[u].len;
            }
            if (st_[u].next[c] != -1) {
                u = st_[u].next[c];
                ++cur_len;
            }
            best = std::max(best, cur_len);
        }
        return best;
    }

private:
    std::vector&lt;State&gt; st_;
    int last_ = 0;
};</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Resetting Matched Length <code>cur_len = st_[u].len</code> on SAM Fallback</div>
  <p>When matching a query string $T$ against a Suffix Automaton to find the Longest Common Substring, if state $u$ lacks transition $c$ and you follow $u \\leftarrow \\text{link}[u]$, your matched length <code>cur_len</code> MUST be reset to $\\text{len}[u]$ (the maximum length in the new state)! A frequent bug is decrementing <code>cur_len--</code> by $1$ on each suffix-link hop; because a single suffix-link hop can drop $\\text{len}[u]$ by many characters at once, <code>cur_len--</code> grossly overestimates the match length.</p>
</div>
</div>`,
    "keyTakeaways": [
      "A Suffix Automaton (SAM) groups substrings with identical endpos sets into a single state covering suffix lengths [len[link[u]] + 1, len[u]], using at most 2N - 1 states and 3N - 4 transitions.",
      "Whenever extending along p -> q encounters len[q] > len[p] + 1, state q must be cloned into a state of length len[p] + 1 because longer strings in q do not share the new end position.",
      "The total number of distinct substrings in S is simply sum_{u > 0} (len[u] - len[link[u]]), and the Longest Common Substring with T is found in O(|S| + |T|) time."
    ],
    "furtherReading": [
      {
        "title": "Blumer et al. (1985) — The Smallest Automaton Recognizing the Subwords of a Text (Theoretical Computer Science)",
        "url": "https://doi.org/10.1016/0304-3975(85)90047-7"
      },
      {
        "title": "CP-Algorithms — Suffix Automaton (SAM) Theory, Proof of Linearity, and Applications",
        "url": "https://cp-algorithms.com/string/suffix-automaton.html"
      }
    ]
  },
  "burrows-wheeler-transform-fm-index": {
    "title": "Burrows-Wheeler Transform (BWT), Last-to-First (LF) Mapping & FM-Index Substring Search",
    "video": {
      "youtubeId": "4n7NPk5lwbI",
      "title": "Burrows-Wheeler Transform and FM-Index Backward Search",
      "channel": "Ben Langmead",
      "duration": "22:40",
      "start": 0,
      "length": 1360,
      "why": "Ben Langmead clearly illustrates the BWT matrix, why the k-th occurrence of c in L is the exact same text character as the k-th occurrence of c in F, and how FM-Index backward search works."
    },
    "intuition": "<p>How does <code>bzip2</code> permute a text so that identical characters cluster into long runs without losing a single bit of information, and how do genomics aligners (<code>Bowtie2</code>, <code>BWA</code>) index the 3-billion-base-pair human genome in under 2 GB of RAM while still counting exact occurrences of a length-$M$ DNA read in $O(M)$ time? Both feats rely on the <strong>Burrows-Wheeler Transform (BWT, 1994)</strong> and Paolo Ferragina and Giovanni Manzini's <strong>FM-Index (2000)</strong>.</p><p>If we write down all $N$ cyclic rotations of $S\\texttt{\\$}$ sorted lexicographically into an $N \\times N$ matrix $\\mathcal{M}$, the first column $F$ is just the sorted characters of $S\\texttt{\\$}$, while the last column $L$ is the <strong>Burrows-Wheeler Transform</strong>: $L[r] = S[(\\text{SA}[r] - 1 + N) \\bmod N]$, the character immediately preceding suffix $\\text{SA}[r]$! Because rotation shifts the last column into the first column while preserving the relative order of suffixes following identical characters, the $k$-th occurrence of character $c$ in $L$ corresponds to the <strong>exact same text position</strong> as the $k$-th occurrence of $c$ in $F$—the celebrated <strong>Last-to-First (LF) Mapping</strong>.</p>",
    "content": `<div class="lesson-content">
<h3>1. Constructing the BWT from the Suffix Array &amp; Why It Compresses</h3>
<p>Given $S[0..N-1]$ with unique smallest sentinel $S[N-1] = \\texttt{'\\$'}$ and its Suffix Array $\\text{SA}[0..N-1]$, we never materialize the $N \\times N$ rotation matrix $\\mathcal{M}$. Row $r$ of $\\mathcal{M}$ starts at $\\text{SA}[r]$ and ends at $(\\text{SA}[r] - 1 + N) \\bmod N$, so the BWT string $L[0..N-1]$ is computed in one linear pass:</p>
$$L[r] = \\begin{cases} S[\\text{SA}[r] - 1] & \\text{if } \\text{SA}[r] > 0 \\\\ S[N - 1] = \\texttt{'\\$'} & \\text{if } \\text{SA}[r] = 0 \\end{cases}$$
<p>Why does $L$ have long runs of identical characters? In English text, suffixes starting with $\\texttt{\"he \"}$ are all grouped adjacently in $\\text{SA}$; in almost every one of those suffixes, the character immediately preceding $\\texttt{\"he \"}$ is $\\texttt{'t'}$, producing a long contiguous run $\\texttt{\"tttt...t\"}$ inside $L$! Applying Move-to-Front (MTF) coding, Run-Length Encoding (RLE), and Huffman/Arithmetic coding to $L$ is the entire pipeline of <code>bzip2</code>.</p>

<h3>2. The Last-to-First (LF) Mapping &amp; $O(N)$ Inversion</h3>
<p>Why is the BWT reversible? Consider all rows in $\\mathcal{M}$ whose last column $L[r]$ equals a specific character $c$. In those rows, the rest of the row $F[r..] $ spells the suffix immediately following that $c$. Since the rows of $\\mathcal{M}$ are sorted by those suffixes $F[r..]$, the relative top-to-bottom order of all $c$'s in $L$ is identical to the relative top-to-bottom order of all rows starting with $c$ in $F$ (where $c$ is followed by the exact same sorted suffixes)!</p>
<p>Let $C[c]$ be the total number of characters in $S$ strictly smaller than $c$ (so the bucket for character $c$ in $F$ starts at row $C[c]$), and let $\\text{Occ}(c, r)$ be the number of times character $c$ appears in the prefix $L[0..r-1]$ ($0$-indexed exclusive rank). Then row $r$ in $L$ maps to row $\\text{LF}(r)$ in $F$:</p>
$$\\text{LF}(r) = C[L[r]] + \\text{Occ}(L[r],\\; r)$$
<p>Starting from the row $r_0$ where $L[r_0] = \\texttt{'\\$'}$ (or the row corresponding to $\\texttt{'\\$'}$ in $F$, which is row $0$), repeatedly stepping $r \\leftarrow \\text{LF}(r)$ reconstructs $S$ backwards from right to left in $O(N)$ time!</p>

<h3>3. FM-Index Backward Search in $O(M)$ Time</h3>
<p>Even better, $C[c]$ and $\\text{Occ}(c, r)$ allow us to count how many times a pattern $P[0..M-1]$ occurs in $S$ in $O(M)$ steps (faster than binary searching a Suffix Array, which takes $O(M \\log N)$)! We process $P$ <strong>backwards</strong> from $j = M - 1$ down to $0$, maintaining the half-open Suffix Array interval $[sp, ep)$ of suffixes prefixed by $P[j..M-1]$:</p>
$$sp_{\\text{new}} = C[c] + \\text{Occ}(c, sp), \\qquad ep_{\\text{new}} = C[c] + \\text{Occ}(c, ep) \\quad \\text{where } c = P[j]$$
<p>After $M$ steps, $ep - sp$ is the exact number of occurrences of $P$ in $S$!</p>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Index Structure</th>
      <th>Index Space</th>
      <th>Count Occurrences of $P[0..M-1]$</th>
      <th>Locate Each Match Offset</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Suffix Tree</td>
      <td>$20N\\text{–}48N$ bytes</td>
      <td>$O(M \\log |\\Sigma|)$</td>
      <td>$O(1)$ per match</td>
    </tr>
    <tr>
      <td>Suffix Array</td>
      <td>$4N$ bytes</td>
      <td>$O(M \\log N)$ (or $O(M + \\log N)$ w/ LCP)</td>
      <td>$O(1)$ per match</td>
    </tr>
    <tr>
      <td>FM-Index (Wavelet Tree + Sampled SA)</td>
      <td>$0.5N\\text{–}1.5N$ bytes</td>
      <td>$O(M \\log |\\Sigma|)$ ($O(M)$ for DNA/ASCII bitvectors)</td>
      <td>$O(\\text{sample\\_rate})$ via LF walks</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">LF-Mapping Rank Preservation &amp; Backward-Search Invariant</div>
  <p><strong>LF Rank Preservation:</strong> For every character $c \\in \\Sigma$ and $k \\ge 1$, the $k$-th occurrence of $c$ in the last column $L$ and the $k$-th occurrence of $c$ in the first column $F$ refer to the exact same index in the original text $S$.<br/><strong>FM-Index Interval:</strong> If $[sp, ep)$ is the exact contiguous range of rows in $\\text{SA}$ prefixed by suffix $Q$, then $[C[c] + \\text{Occ}(c, sp),\\; C[c] + \\text{Occ}(c, ep))$ is the exact range of rows prefixed by $cQ$.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Popcount Rank Bitvectors in Production FM-Indexes</div>
  <p>Storing a full 2D table $\\text{Occ}[|\\Sigma|][N]$ would take $|\\Sigma| \\cdot 4N$ bytes. Instead, production genomics aligners (<code>Bowtie2</code>, <code>BWA</code>) store 64-bit bitmasks for each nucleotide ($\\{\\texttt{A}, \\texttt{C}, \\texttt{G}, \\texttt{T}\\}$) inside 64-byte cache-line blocks alongside a single checkpoint counter per block. Computing $\\text{Occ}(c, r)$ then reduces to 1 memory load + 1 hardware <code>__builtin_popcountll</code> instruction!</p>
</div>

<h3>4. Visual Trace: BWT Matrix &amp; LF Mapping on $S = \\texttt{\"banana\\$\"}$</h3>
<svg viewBox="0 0 760 220" width="100%" height="220" role="img" aria-label="BWT rotation matrix, F and L columns, and LF mapping for banana$">
  <style>
    .bwt-hdr { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: bold; fill: #93c5fd; }
    .bwt-row { font-family: 'JetBrains Mono', monospace; font-size: 13px; fill: #e2e8f0; }
    .bwt-f { fill: #34d399; font-weight: bold; }
    .bwt-l { fill: #fbbf24; font-weight: bold; }
    .bwt-dim { fill: #64748b; }
  </style>
  <rect width="760" height="220" fill="#0f172a" rx="8"/>

  <text x="25" y="28" class="bwt-hdr">Row r   SA[r]   F   Middle Rotated Chars   L (BWT)   LF(r) = C[L[r]] + Occ(L[r], r)</text>

  <g transform="translate(25, 52)">
    <text x="0" y="0" class="bwt-row">  0       6     <tspan class="bwt-f">$</tspan>   <tspan class="bwt-dim">b  a  n  a  n</tspan>          <tspan class="bwt-l">a_1</tspan>       C['a'](1) + 0 = 1</text>
    <text x="0" y="22" class="bwt-row">  1       5     <tspan class="bwt-f">a_1</tspan> <tspan class="bwt-dim">$  b  a  n  a</tspan>          <tspan class="bwt-l">n_1</tspan>       C['n'](5) + 0 = 5</text>
    <text x="0" y="44" class="bwt-row">  2       3     <tspan class="bwt-f">a_2</tspan> <tspan class="bwt-dim">n  a  $  b  a</tspan>          <tspan class="bwt-l">n_2</tspan>       C['n'](5) + 1 = 6</text>
    <text x="0" y="66" class="bwt-row">  3       1     <tspan class="bwt-f">a_3</tspan> <tspan class="bwt-dim">n  a  n  a  $</tspan>          <tspan class="bwt-l">b_1</tspan>       C['b'](4) + 0 = 4</text>
    <text x="0" y="88" class="bwt-row">  4       0     <tspan class="bwt-f">b_1</tspan> <tspan class="bwt-dim">a  n  a  n  a</tspan>          <tspan class="bwt-l">$</tspan>         C['$'](0) + 0 = 0</text>
    <text x="0" y="110" class="bwt-row">  5       4     <tspan class="bwt-f">n_1</tspan> <tspan class="bwt-dim">a  $  b  a  n</tspan>          <tspan class="bwt-l">a_2</tspan>       C['a'](1) + 1 = 2</text>
    <text x="0" y="132" class="bwt-row">  6       2     <tspan class="bwt-f">n_2</tspan> <tspan class="bwt-dim">a  n  a  $  b</tspan>          <tspan class="bwt-l">a_3</tspan>       C['a'](1) + 2 = 3</text>
    <text x="0" y="158" class="bwt-hdr" fill="#34d399">BWT = "annb$aa" (Notice how the two 'n's and two 'a's cluster together!)</text>
  </g>
</svg>

<div class="mermaid">
flowchart LR
  A["Init [sp, ep) = [0, N) and j = M - 1"] --> B{"j &gt;= 0 and sp &lt; ep?"}
  B -- "Yes: let c = P[j]" --> C["sp = C[c] + Occ(c, sp)"]
  C --> D["ep = C[c] + Occ(c, ep); j--"]
  D --> B
  B -- "No" --> E["Return max(0, ep - sp) matches in SA[sp..ep)"]
</div>

<div class="simulator-mount" data-sim="sim-bwt-fm-index"></div>

<h3>5. Production Implementation: BWT Inversion &amp; FM-Index Backward Search</h3>
<pre><code class="language-cpp">#include &lt;array&gt;
#include &lt;cstdint&gt;
#include &lt;string&gt;
#include &lt;string_view&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

class FMIndex {
public:
    // Builds BWT and FM-Index from string <code>s</code> (terminated by '\0' at s.back()) and its SA
    FMIndex(std::string_view s_with_null, const std::vector&lt;int&gt;&amp; sa)
        : n_(static_cast&lt;int&gt;(s_with_null.size())), bwt_(n_, '\0'), occ_(n_ + 1) {
        c_.fill(0);
        occ_[0].fill(0);
        for (int r = 0; r &lt; n_; ++r) {
            int prev_idx = (sa[r] == 0) ? (n_ - 1) : (sa[r] - 1);
            uint8_t ch = static_cast&lt;uint8_t&gt;(s_with_null[prev_idx]);
            bwt_[r] = static_cast&lt;char&gt;(ch);
            c_[ch]++;
            occ_[r + 1] = occ_[r];
            occ_[r + 1][ch]++;
        }
        // Convert c_ into exclusive prefix sums (bucket start offsets in F)
        int sum = 0;
        for (int ch = 0; ch &lt; 256; ++ch) {
            int cnt = c_[ch];
            c_[ch] = sum;
            sum += cnt;
        }
    }

    // Reconstructs the original string (excluding trailing '\0') in O(N) via LF-mapping
    std::string invert_bwt() const {
        std::string out(n_ - 1, '\0');
        int r = 0; // Row 0 in F starts with '\0', so L[0] is the last char of S
        for (int i = n_ - 2; i &gt;= 0; --i) {
            uint8_t ch = static_cast&lt;uint8_t&gt;(bwt_[r]);
            out[i] = static_cast&lt;char&gt;(ch);
            r = c_[ch] + occ_[r][ch];
        }
        return out;
    }

    // Counts exact occurrences of <code>pat</code> in O(|pat|) time via FM-Index Backward Search
    int count_matches(std::string_view pat) const {
        int sp = 0, ep = n_;
        for (int j = static_cast&lt;int&gt;(pat.size()) - 1; j &gt;= 0 &amp;&amp; sp &lt; ep; --j) {
            uint8_t ch = static_cast&lt;uint8_t&gt;(pat[j]);
            sp = c_[ch] + occ_[sp][ch];
            ep = c_[ch] + occ_[ep][ch];
        }
        return std::max(0, ep - sp);
    }

private:
    int n_;
    std::string bwt_;
    std::array&lt;int, 256&gt; c_{};
    std::vector&lt;std::array&lt;int, 256&gt;&gt; occ_;
};</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Inclusive vs. Exclusive <code>Occ(c, r)</code> Indexing in FM-Index</div>
  <p>The single most common bug when implementing FM-Index backward search is mixing up inclusive vs. exclusive rank queries $\\text{Occ}(c, r)$. When maintaining a <strong>half-open</strong> Suffix Array interval $[sp, ep)$, $\\text{Occ}(c, r)$ MUST count occurrences of $c$ in the <strong>prefix of length $r$</strong> ($L[0..r-1]$, exclusive of index $r$), so that BOTH boundary updates use the exact same formula: $sp' = C[c] + \\text{Occ}(c, sp)$ and $ep' = C[c] + \\text{Occ}(c, ep)$!</p>
</div>
</div>`,
    "keyTakeaways": [
      "The Burrows-Wheeler Transform L[r] = S[(SA[r] - 1 + N) mod N] groups characters that precede identical contexts into long homogeneous runs ideal for Move-to-Front and Run-Length compression.",
      "The Last-to-First (LF) property guarantees that the k-th occurrence of character c in L is the exact same text character as the k-th occurrence of c in F, enabling O(N) inversion via LF(r) = C[L[r]] + Occ(L[r], r).",
      "FM-Index backward search processes pattern P from right to left (j = M - 1 down to 0) updating [sp, ep) = [C[c] + Occ(c, sp), C[c] + Occ(c, ep)) to count occurrences in O(M) time."
    ],
    "furtherReading": [
      {
        "title": "Burrows & Wheeler (1994) — A Block-Sorting Lossless Data Compression Algorithm (SRC Research Report 124)",
        "url": "https://www.hpl.hp.com/techreports/Compaq-DEC/SRC-RR-124.pdf"
      },
      {
        "title": "Ferragina & Manzini (2000) — Opportunistic Data Structures with Applications (FOCS — The FM-Index Paper)",
        "url": "https://doi.org/10.1109/SFCS.2000.892127"
      }
    ]
  },
  "thompson-nfa-vs-backtracking-regex": {
    "title": "Regular Expression Engines: Thompson's O(NM) NFA Simulation vs Catastrophic ReDoS Backtracking",
    video: {
      youtubeId: "528Jc3q86F8",
      id: "528Jc3q86F8",
      url: "https://www.youtube.com/embed/528Jc3q86F8",
      title: "Regular Expressions & Finite Automata (Ken Thompson's NFA Construction)",
      channel: "Computerphile",
      duration: "15:40",
      start: 0,
      length: "15m",
      why: "Contrasts recursive PCRE-style backtracking against Ken Thompson's 1968 lockstep multi-state NFA simulation and explains how Cloudflare and StackOverflow suffered ReDoS outages."
    },
    "intuition": "<p>Why does matching the regular expression <code>(a+)+b</code> against a 35-character string <code>\"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac\"</code> freeze Python's <code>re</code>, JavaScript's <code>RegExp</code>, Java's <code>java.util.regex</code>, and PCRE for tens of seconds, whereas Go's <code>regexp</code>, Rust's <code>regex</code>, and Google's <code>RE2</code> finish in 2 microseconds? Because most mainstream languages implement regexes via <strong>recursive depth-first backtracking</strong>, which tries all $2^N$ ways to partition $\\texttt{\"a\"}^N$ among the inner and outer <code>+</code> quantifiers before concluding that no path reaches <code>'b'</code>!</p><p>In 1968, Ken Thompson published a 4-page paper showing how to compile any regular expression of length $M$ into a Nondeterministic Finite Automaton (NFA) with at most $2M$ states and simulate <strong>all active states in lockstep</strong> as a deduplicated set (<code>clist</code> $\\to$ <code>nlist</code>). Because there are at most $M$ states in the entire NFA, tracking which states are active at text position $i$ does at most $O(M)$ work per character—guaranteeing $O(N \\cdot M)$ worst-case time and making <strong>Regular Expression Denial of Service (ReDoS)</strong> mathematically impossible.</p>",
    "content": `<div class="lesson-content">
<h3>1. Why Recursive Backtracking Explodes to $\\Omega(2^N)$</h3>
<p>Consider an NFA state with an $\\varepsilon$-split (created by alternation <code>e1|e2</code> or quantifiers <code>e*</code>, <code>e+</code>, <code>e?</code>). A <strong>backtracking engine</strong> treats the NFA like a maze and runs Depth-First Search (DFS) on a call stack: at each split, it guesses Branch 1 and explores all the way to the end of the text; if that fails, it pops the stack and tries Branch 2 from the same text index. On <code>(a+)+b</code> with input $\\texttt{\"a\"}^N\\texttt{\"c\"}$, every character $i \\in [0, N-1]$ offers two choices (stay in the inner <code>a+</code> or loop through the outer <code>(...)+</code>), creating a binary recursion tree of $2^N$ leaves—all of which fail at $\\texttt{'c'}$!</p>

<h3>2. Thompson's Construction &amp; Lockstep Subset Simulation</h3>
<p>Ken Thompson's algorithm replaces DFS over paths with <strong>Breadth-First Lockstep Simulation</strong> over states:</p>
<ol>
  <li><strong>Bounded Out-Degree NFA Fragments:</strong> Using postfix regex conversion (or AST traversal), every operator compiles into a tiny fragment with at most 2 outgoing arrows per state:
    <ul>
      <li><strong>Literal $c$:</strong> A state <code>Char(c)</code> with 1 outgoing arrow <code>out</code>.</li>
      <li><strong>Concatenation $e_1 e_2$:</strong> Wire <code>e1</code>'s dangling arrows to <code>e2.start</code>.</li>
      <li><strong>Alternation $e_1 | e_2$:</strong> A state <code>Split(e1.start, e2.start)</code> with two $\\varepsilon$-arrows.</li>
      <li><strong>Zero-or-More $e^*$:</strong> A state <code>Split(e.start, out)</code> where <code>e</code>'s end loops back to the <code>Split</code>.</li>
    </ul>
  </li>
  <li><strong>Deduplicated State Lists (<code>clist</code>, <code>nlist</code>) via <code>list_id</code>:</strong> At text index $i$, we maintain <code>clist</code>, the set of currently active NFA states (already closed under $\\varepsilon$-transitions). For character $T[i]$, every <code>Char(T[i])</code> state in <code>clist</code> steps along its outgoing arrow and recursively follows any <code>Split</code> ($\\varepsilon$) transitions into <code>nlist</code>. To ensure each NFA state is added to <code>nlist</code> <strong>at most once per step</strong> in $O(1)$ time, each state $s$ stores <code>last_step[s]</code>: if <code>last_step[s] == step_id</code>, we immediately return without re-visiting $s$!</li>
</ol>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Regex Engine Architecture</th>
      <th>Worst-Case Time</th>
      <th>Memory Overhead</th>
      <th>Production Examples</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Recursive Backtracking (DFS)</td>
      <td>$\\Theta(2^N)$ exponential (ReDoS!)</td>
      <td>$O(N)$ call stack</td>
      <td>PCRE, Python <code>re</code>, JS <code>RegExp</code>, Java, .NET</td>
    </tr>
    <tr>
      <td>Thompson NFA Lockstep Simulation</td>
      <td>$O(N \\cdot M)$ strict polynomial</td>
      <td>$O(M)$ states</td>
      <td>Go <code>regexp</code>, Pike VM, <code>grep</code> fallback</td>
    </tr>
    <tr>
      <td>Lazy DFA (On-the-Fly Subset Cache)</td>
      <td>$O(N)$ typical, $O(N \\cdot M)$ fallback</td>
      <td>Bounded DFA cache (e.g., 2 MB)</td>
      <td>Google <code>RE2</code>, Rust <code>regex</code>, <code>ripgrep</code></td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Thompson Lockstep Active-Set Invariant</div>
  <p>After processing prefix $T[0..i-1]$ at step <code>step_id</code>, <code>clist</code> contains the exact $\\varepsilon$-closure of all NFA states reachable from $q_0$ by spelling $T[0..i-1]$. Because <code>last_step[s] == step_id</code> prevents any state $s \\in [0, |V|-1]$ from being inserted or $\\varepsilon$-expanded more than once per character, and each state has out-degree $\\le 2$, processing $T[i]$ performs at most $2|V| = O(M)$ operations regardless of path ambiguity.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Lazy DFA (On-the-Fly Powerset Caching in RE2 and Rust regex)</div>
  <p>Full DFA compilation of an $M$-state NFA can blow up to $2^M$ states in memory, whereas Thompson NFA simulation does $O(M)$ work per byte. Google's <code>RE2</code> and Rust's <code>regex</code> combine the best of both worlds with a <strong>Lazy DFA</strong>: each visited subset of NFA states <code>clist</code> is hashed into a single DFA state ID, and its transition <code>dfa[u][c]</code> is cached on first use! On normal inputs, after a few dozen bytes the hot DFA transitions are cached and the engine runs at $1$ table lookup per byte ($O(N)$); if an adversarial regex causes the DFA cache to hit its memory cap (e.g., 2 MB), the engine flushes the cache or falls back seamlessly to Thompson's $O(N \\cdot M)$ NFA.</p>
</div>

<h3>3. Visual Trace: Backtracking Tree vs. Thompson Lockstep on <code>(a+)+b</code></h3>
<svg viewBox="0 0 760 215" width="100%" height="215" role="img" aria-label="Comparison of exponential backtracking tree versus bounded Thompson NFA state set">
  <style>
    .rx-box { fill: #1e293b; stroke: #64748b; stroke-width: 1.5; rx: 6; }
    .rx-bad { fill: #7f1d1d; stroke: #f87171; stroke-width: 1.5; rx: 6; }
    .rx-good { fill: #064e3b; stroke: #34d399; stroke-width: 1.5; rx: 6; }
    .rx-txt { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #f8fafc; text-anchor: middle; }
    .rx-sub { font-family: 'Inter', sans-serif; font-size: 11px; fill: #cbd5e1; text-anchor: middle; }
  </style>
  <rect width="760" height="215" fill="#0f172a" rx="8"/>

  <!-- Left: Backtracking -->
  <rect x="20" y="20" width="340" height="175" class="rx-bad" fill-opacity="0.25"/>
  <text x="190" y="44" class="rx-txt" fill="#f87171">Backtracking DFS on (a+)+b ("aaaa...c")</text>
  <text x="190" y="72" class="rx-sub">Each 'a' branches into 2 stack frames:</text>
  <text x="190" y="96" class="rx-txt">i=0 (1) -&gt; i=1 (2) -&gt; i=2 (4) -&gt; ... -&gt; 2^N</text>
  <text x="190" y="126" class="rx-sub">Deduplication: NONE (re-explores same state</text>
  <text x="190" y="144" class="rx-sub">at same text index millions of times)</text>
  <text x="190" y="174" class="rx-txt" fill="#f87171">N = 35 =&gt; 34,359,738,368 steps (HANG!)</text>

  <!-- Right: Thompson NFA -->
  <rect x="400" y="20" width="340" height="175" class="rx-good" fill-opacity="0.25"/>
  <text x="570" y="44" class="rx-txt" fill="#34d399">Thompson Lockstep NFA on (a+)+b</text>
  <text x="570" y="72" class="rx-sub">Maintains deduplicated active set clist:</text>
  <text x="570" y="96" class="rx-txt">i=0 {s1,s3} -&gt; i=1 {s1,s3} -&gt; ... -&gt; {s1,s3}</text>
  <text x="570" y="126" class="rx-sub">Deduplication: last_step[s] == step_id</text>
  <text x="570" y="144" class="rx-sub">guarantees |clist| &lt;= M states at all times</text>
  <text x="570" y="174" class="rx-txt" fill="#34d399">N = 35 =&gt; 35 * 4 = 140 steps (0.002 ms!)</text>
</svg>

<div class="mermaid">
flowchart LR
  A["Init step_id = 1; add_state(clist, start_state)"] --> B["For each char c in Text T"]
  B --> C["step_id++; clear nlist"]
  C --> D["For each state u in clist: if u.c == c, add_state(nlist, u.out)"]
  D --> E["swap(clist, nlist)"]
  E --> B
</div>

<div class="simulator-mount" data-sim="sim-bwt-fm-index"></div>

<h3>4. Production Implementation: Thompson NFA Lockstep Simulator</h3>
<pre><code class="language-cpp">#include &lt;string_view&gt;
#include &lt;vector&gt;

class ThompsonNFA {
public:
    enum Op { CHAR, SPLIT, MATCH };
    struct State {
        Op op;
        char ch = 0;
        int out = -1;
        int out1 = -1;
    };

    explicit ThompsonNFA(std::vector&lt;State&gt; states, int start)
        : states_(std::move(states)), start_(start) {}

    // Simulates the NFA in strict O(N * M) time with zero backtracking
    bool full_match(std::string_view text) const {
        const int m = static_cast&lt;int&gt;(states_.size());
        std::vector&lt;int&gt; clist, nlist, last_step(m, 0);
        clist.reserve(m);
        nlist.reserve(m);

        int step_id = 1;
        add_state( start_, clist, last_step, step_id);

        for (char c : text) {
            ++step_id;
            nlist.clear();
            for (int u : clist) {
                if (states_[u].op == CHAR &amp;&amp; (states_[u].ch == c || states_[u].ch == '.')) {
                    add_state(states_[u].out, nlist, last_step, step_id);
                }
            }
            clist.swap(nlist);
            if (clist.empty()) return false;
        }

        for (int u : clist) {
            if (states_[u].op == MATCH) return true;
        }
        return false;
    }

private:
    std::vector&lt;State&gt; states_;
    int start_;

    void add_state(int u, std::vector&lt;int&gt;&amp; list,
                   std::vector&lt;int&gt;&amp; last_step, int step_id) const {
        if (u &lt; 0 || last_step[u] == step_id) return;
        last_step[u] = step_id;
        if (states_[u].op == SPLIT) {
            add_state(states_[u].out, list, last_step, step_id);
            add_state(states_[u].out1, list, last_step, step_id);
            return;
        }
        list.push_back(u);
    }
};</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Why Backreferences (<code>\\1</code>, <code>\\2</code>) Break Linear-Time Automata</div>
  <p>Why didn't Python, JavaScript, and PCRE simply switch to Thompson NFAs decades ago? Because POSIX/Perl backreferences (like <code>([a-z]+)_\\1</code>, matching any repeated word) are <strong>not regular expressions</strong> in the formal Chomsky hierarchy—in fact, matching regexes with backreferences is <strong>NP-complete</strong> (reducible from 3-SAT)! Engines like Google's <code>RE2</code> and Rust's <code>regex</code> deliberately omit backreferences and arbitrary lookaround assertions from their syntax so they can guarantee $O(N \\cdot M)$ worst-case execution on untrusted user inputs.</p>
</div>
</div>`,
    "keyTakeaways": [
      "Backtracking regex engines (PCRE, Python re, JS RegExp) explore paths via DFS without state deduplication, degrading to O(2^N) time (ReDoS) on ambiguous patterns like (a+)+b.",
      "Thompson's construction compiles a regex of length M into an NFA with at most 2M states (each of out-degree <= 2) and simulates all active states in lockstep in O(N * M) worst-case time.",
      "Using a generation counter last_step[u] == step_id during epsilon-closure expansion guarantees each NFA state is visited at most once per input character."
    ],
    "furtherReading": [
      {
        "title": "Ken Thompson (1968) — Regular Expression Search Algorithm (Communications of the ACM)",
        "url": "https://doi.org/10.1145/363347.363387"
      },
      {
        "title": "Russ Cox (2007) — Regular Expression Matching Can Be Simple And Fast (swtch.com)",
        "url": "https://swtch.com/~rsc/regexp/regexp1.html"
      }
    ]
  },
  "myers-diff-hirschberg-lcs": {
    "title": "Myers O(ND) Shortest Edit Script & Hirschberg's Linear-Space Alignment",
    video: {
      youtubeId: "cPQeJt-2Y1Q",
      id: "cPQeJt-2Y1Q",
      url: "https://www.youtube.com/embed/cPQeJt-2Y1Q",
      title: "Hirschberg's Divide-and-Conquer Linear-Space Sequence Alignment & LCS",
      channel: "David Powell",
      duration: "14:50",
      start: 0,
      length: "14m",
      why: "Derives the edit graph, k = x - y diagonals, greedy snakes, and how Myers explores D = 0, 1, 2... edits in O((N + M)D) time."
    },
    "intuition": "<p>When you run <code>git diff</code> on two 10,000-line source files that differ by only $D = 5$ edited lines, standard dynamic programming for Longest Common Subsequence (LCS) allocates a $10{,}000 \\times 10{,}000$ table ($400\\text{ MB}$) and executes $10^8$ operations regardless of how similar the files are. Eugene Myers (1986) reframed diffing as a shortest-path search on an <strong>Edit Graph</strong> where horizontal edges delete from $A$ (cost $1$), vertical edges insert from $B$ (cost $1$), and diagonal edges match $A[x] == B[y]$ for <strong>cost $0$</strong>.</p><p>By parameterizing the search by the number of non-diagonal edits $d = 0, 1, \\dots, D$ and tracking only the furthest-reaching $x$-coordinate $V[k]$ on each diagonal $k = x - y$, Myers finds the Shortest Edit Script in $O((N + M)D)$ time—which is $O(N + M)$ when $D$ is small! And when $D$ is large and we need the full alignment path in $O(N + M)$ memory instead of $O(N \\cdot D)$ memory, <strong>Hirschberg's Divide-and-Conquer Algorithm (1975)</strong> runs a forward DP from the top-left and a reverse DP from the bottom-right to find the exact midpoint split in $O(N + M)$ space.</p>",
    "content": `<div class="lesson-content">
<h3>1. Myers Edit Graph: Diagonals $k = x - y$ &amp; Greedy Snakes</h3>
<p>Given sequences $A[0..N-1]$ and $B[0..M-1]$, consider the grid of vertices $(x, y) \\in [0, N] \\times [0, M]$. Define <strong>diagonal $k$</strong> as the set of grid points satisfying $k = x - y$:</p>
<ul>
  <li><strong>Deletion from $A$ ($(x, y) \\to (x + 1, y)$):</strong> Increases $x$ by $1$, moving from diagonal $k - 1$ to diagonal $k$.</li>
  <li><strong>Insertion from $B$ ($(x, y) \\to (x, y + 1)$):</strong> Increases $y$ by $1$, moving from diagonal $k + 1$ to diagonal $k$.</li>
  <li><strong>Match / Snake ($(x, y) \\to (x + 1, y + 1)$ when $A[x] == B[y]$):</strong> Increases both $x$ and $y$ by $1$, sliding down the <em>same</em> diagonal $k = x - y$ at $0$ edit cost!</li>
</ul>
<p>Let $V_d[k]$ be the maximum $x$-coordinate reachable on diagonal $k$ using at most $d$ edits. Because $d$ edits starting from $(0, 0)$ (diagonal $0$) change the diagonal by $\\pm 1$ on each edit, after $d$ edits only diagonals $k \\in [-d, +d]$ with $k \\equiv d \\pmod 2$ are reachable! To reach diagonal $k$ at step $d$, we must have taken either a vertical insertion from diagonal $k + 1$ (preserving $x = V_{d-1}[k + 1]$) or a horizontal deletion from diagonal $k - 1$ (advancing $x = V_{d-1}[k - 1] + 1$), followed by a greedy diagonal slide (<em>snake</em>) while $A[x] == B[y]$:</p>
$$x_{\\text{start}} = \\begin{cases} V_{d-1}[k + 1] & \\text{if } k = -d \\text{ or } (k \\neq d \\text{ and } V_{d-1}[k - 1] < V_{d-1}[k + 1]) \\\\ V_{d-1}[k - 1] + 1 & \\text{otherwise} \\end{cases}$$

<h3>2. Hirschberg's Linear-Space Divide-and-Conquer ($O(N + M)$ Memory)</h3>
<p>Whether using classical LCS DP or Myers diff, reconstructing the actual edit script naively requires storing the history of DP rows ($O(N \\cdot M)$ or $O((N + M)D)$ space). Dan Hirschberg (1975) showed how to reconstruct the exact optimal alignment in <strong>$O(N + M)$ space</strong> while only doubling the runtime constant:</p>
<ol>
  <li>Split $A$ at its midpoint $x_{\\text{mid}} = \\lfloor N / 2 \\rfloor$.</li>
  <li>Run 2-row space-optimized LCS/edit-distance forward on $A[0..x_{\\text{mid}}-1]$ against $B[0..M-1]$ to obtain row $L_1[0..M]$.</li>
  <li>Run 2-row space-optimized LCS/edit-distance backwards on the reversed suffix $A[x_{\\text{mid}}..N-1]$ against $B[0..M-1]$ to obtain row $L_2[0..M]$.</li>
  <li>Find $y^* = \\arg\\max_{0 \\le y \\le M} (L_1[y] + L_2[y])$ (or $\\arg\\min$ for edit distance). Then $(x_{\\text{mid}}, y^*)$ is guaranteed to lie on an optimal alignment path! Recurse on $(A[0..x_{\\text{mid}}-1],\\; B[0..y^*-1])$ and $(A[x_{\\text{mid}}..N-1],\\; B[y^*..M-1])$.</li>
</ol>
<p>Because the subproblem areas sum to $\\frac{N}{2} y^* + \\frac{N}{2}(M - y^*) = \\frac{1}{2} NM$, the geometric series of work across all recursion levels is $NM(1 + \\frac{1}{2} + \\frac{1}{4} + \\dots) = 2NM = O(NM)$ time in $O(N + M)$ space!</p>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Diff / Alignment Algorithm</th>
      <th>Time Complexity</th>
      <th>Space Complexity</th>
      <th>Best Use Case</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Standard Wagner-Fischer / LCS DP</td>
      <td>$\\Theta(N \\cdot M)$</td>
      <td>$\\Theta(N \\cdot M)$</td>
      <td>Short strings ($N, M \\le 2000$)</td>
    </tr>
    <tr>
      <td>Hirschberg Divide-and-Conquer LCS</td>
      <td>$\\Theta(N \\cdot M)$ ($2\\times$ work)</td>
      <td>$\\Theta(N + M)$ linear space!</td>
      <td>Long sequences with high divergence ($D \\approx N$)</td>
    </tr>
    <tr>
      <td>Myers Shortest Edit Script (Greedy)</td>
      <td>$O((N + M)D)$</td>
      <td>$O(D^2)$ trace or $O(D)$ w/ Hirschberg</td>
      <td>Source code &amp; document diffs where $D \\ll N$</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Myers Parity &amp; Furthest-Reaching Point Invariant</div>
  <p>Every edit step $(x, y) \\to (x+1, y)$ or $(x, y) \\to (x, y+1)$ changes $k = x - y$ by $+1$ or $-1$, while diagonal snake steps $(x, y) \\to (x+1, y+1)$ leave $k = x - y$ unchanged. Consequently, after $d$ edits, only diagonals $k \\in \\{-d, -d+2, \\dots, d\\}$ are reachable, and maximizing $x$ on diagonal $k$ simultaneously maximizes $y = x - k$ and $x + y = 2x - k$ (total progress toward $(N, M)$).</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Single-Array Overwrite Enabled by Parity Alternation</div>
  <p>Because step $d$ only writes to diagonals $k \\equiv d \\pmod 2$ and only reads from diagonals $k \\pm 1 \\equiv d - 1 \\pmod 2$, the even and odd diagonals never collide! Thus $V_d[k]$ can overwrite a single flat array <code>V[k + offset]</code> in-place without needing separate <code>V_prev</code> and <code>V_curr</code> buffers.</p>
</div>

<h3>3. Visual Trace: Myers Edit Graph &amp; Hirschberg Midpoint Split</h3>
<svg viewBox="0 0 760 215" width="100%" height="215" role="img" aria-label="Myers edit graph diagonals and Hirschberg midpoint divide-and-conquer">
  <style>
    .my-grid { stroke: #334155; stroke-width: 1; }
    .my-snake { stroke: #34d399; stroke-width: 3; }
    .my-edit { stroke: #f87171; stroke-width: 2.5; stroke-dasharray: 4,3; }
    .my-txt { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #f8fafc; }
    .my-sub { font-family: 'Inter', sans-serif; font-size: 11px; fill: #94a3b8; }
  </style>
  <rect width="760" height="215" fill="#0f172a" rx="8"/>

  <!-- Left: Myers Edit Graph -->
  <text x="30" y="26" class="my-txt" fill="#93c5fd">Myers Edit Graph (k = x - y Diagonals)</text>
  <g transform="translate(45, 45)">
    <!-- 4x3 grid -->
    <line x1="0" y1="0" x2="240" y2="0" class="my-grid"/>
    <line x1="0" y1="45" x2="240" y2="45" class="my-grid"/>
    <line x1="0" y1="90" x2="240" y2="90" class="my-grid"/>
    <line x1="0" y1="135" x2="240" y2="135" class="my-grid"/>
    <line x1="0" y1="0" x2="0" y2="135" class="my-grid"/>
    <line x1="60" y1="0" x2="60" y2="135" class="my-grid"/>
    <line x1="120" y1="0" x2="120" y2="135" class="my-grid"/>
    <line x1="180" y1="0" x2="180" y2="135" class="my-grid"/>
    <line x1="240" y1="0" x2="240" y2="135" class="my-grid"/>

    <!-- Path: (0,0)->(1,0)[del] -> (2,1)[snake] -> (2,2)[ins] -> (4,3)[snake] -->
    <line x1="0" y1="0" x2="60" y2="0" class="my-edit"/>
    <line x1="60" y1="0" x2="120" y2="45" class="my-snake"/>
    <line x1="120" y1="45" x2="120" y2="90" class="my-edit"/>
    <line x1="120" y1="90" x2="180" y2="90" class="my-edit"/>
    <line x1="180" y1="90" x2="240" y2="135" class="my-snake"/>

    <circle cx="0" cy="0" r="4" fill="#f8fafc"/>
    <circle cx="120" cy="45" r="4" fill="#34d399"/>
    <circle cx="240" cy="135" r="5" fill="#34d399"/>
    <text x="0" y="155" class="my-sub">Red = 1-cost Ins/Del; Green = 0-cost Snake</text>
  </g>

  <!-- Right: Hirschberg Midpoint Split -->
  <text x="410" y="26" class="my-txt" fill="#93c5fd">Hirschberg O(N+M) Space Midpoint Split</text>
  <g transform="translate(410, 45)">
    <rect x="0" y="0" width="310" height="135" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <!-- Top-left quadrant -->
    <rect x="0" y="0" width="155" height="67" fill="#064e3b" fill-opacity="0.55" stroke="#34d399"/>
    <text x="30" y="38" class="my-txt" fill="#34d399">Subproblem 1</text>
    <!-- Bottom-right quadrant -->
    <rect x="155" y="67" width="155" height="68" fill="#064e3b" fill-opacity="0.55" stroke="#34d399"/>
    <text x="185" y="106" class="my-txt" fill="#34d399">Subproblem 2</text>
    <!-- Midpoint line -->
    <line x1="155" y1="0" x2="155" y2="135" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,3"/>
    <circle cx="155" cy="67" r="6" fill="#fbbf24"/>
    <text x="165" y="62" class="my-txt" fill="#fbbf24">(N/2, y*)</text>
    <text x="0" y="155" class="my-sub">Area halves each level: NM + NM/2 + NM/4... = 2NM</text>
  </g>
</svg>

<div class="mermaid">
flowchart TD
  A["Init V[1] = 0; offset = N + M"] --> B["For d = 0 .. N + M"]
  B --> C["For k = -d to +d step 2"]
  C --> D{"k == -d or (k != d and V[k-1] &lt; V[k+1])?"}
  D -- "Yes (Down / Insert)" --> E["x = V[k + 1]"]
  D -- "No (Right / Delete)" --> F["x = V[k - 1] + 1"]
  E --> G["y = x - k; while x &lt; N and y &lt; M and A[x] == B[y]: x++, y++"]
  F --> G
  G --> H["V[k] = x; if x &gt;= N and y &gt;= M return d"]
  H --> C
</div>

<div class="simulator-mount" data-sim="sim-myers-diff-huffman-lz77"></div>

<h3>4. Production Implementation: Myers $O(ND)$ Shortest Edit Distance &amp; Hirschberg LCS</h3>
<pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;string&gt;
#include &lt;string_view&gt;
#include &lt;vector&gt;

// 1. Myers O((N + M) * D) Shortest Edit Script Distance (Ins + Del, where Match = 0)
int myers_edit_distance(std::string_view a, std::string_view b) {
    const int n = static_cast&lt;int&gt;(a.size());
    const int m = static_cast&lt;int&gt;(b.size());
    const int max_d = n + m;
    if (max_d == 0) return 0;

    std::vector&lt;int&gt; v(2 * max_d + 3, 0);
    const int offset = max_d + 1;

    for (int d = 0; d &lt;= max_d; ++d) {
        for (int k = -d; k &lt;= d; k += 2) {
            int x;
            if (k == -d || (k != d &amp;&amp; v[offset + k - 1] &lt; v[offset + k + 1])) {
                x = v[offset + k + 1];     // Vertical step (Insert from B)
            } else {
                x = v[offset + k - 1] + 1; // Horizontal step (Delete from A)
            }
            int y = x - k;
            while (x &lt; n &amp;&amp; y &lt; m &amp;&amp; a[x] == b[y]) {
                ++x;
                ++y;
            }
            v[offset + k] = x;
            if (x &gt;= n &amp;&amp; y &gt;= m) return d;
        }
    }
    return max_d;
}

// 2. Hirschberg's O(N * M) Time, O(N + M) Space LCS String Reconstruction
std::vector&lt;int&gt; lcs_row(std::string_view a, std::string_view b, bool rev) {
    const int n = static_cast&lt;int&gt;(a.size());
    const int m = static_cast&lt;int&gt;(b.size());
    std::vector&lt;int&gt; dp(m + 1, 0), nxt(m + 1, 0);
    for (int i = 0; i &lt; n; ++i) {
        char ca = rev ? a[n - 1 - i] : a[i];
        for (int j = 0; j &lt; m; ++j) {
            char cb = rev ? b[m - 1 - j] : b[j];
            nxt[j + 1] = (ca == cb) ? (dp[j] + 1) : std::max(dp[j + 1], nxt[j]);
        }
        dp.swap(nxt);
    }
    return dp;
}

std::string hirschberg_lcs(std::string_view a, std::string_view b) {
    if (a.empty() || b.empty()) return "";
    if (a.size() == 1) {
        return (b.find(a[0]) != std::string_view::npos) ? std::string(a) : "";
    }
    size_t mid = a.size() / 2;
    auto l1 = lcs_row(a.substr(0, mid), b, false);
    auto l2 = lcs_row(a.substr(mid), b, true);

    size_t best_k = 0;
    int best_val = -1;
    for (size_t k = 0; k &lt;= b.size(); ++k) {
        int val = l1[k] + l2[b.size() - k];
        if (val &gt; best_val) {
            best_val = val;
            best_k = k;
        }
    }
    return hirschberg_lcs(a.substr(0, mid), b.substr(0, best_k)) +
           hirschberg_lcs(a.substr(mid), b.substr(best_k));
}</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Initializing <code>V[offset + 1] = 0</code> for $d = 0$ in Myers Diff</div>
  <p>At $d = 0$, $k = 0$ satisfies $k == -d$, so the branch <code>if (k == -d || ...)</code> reads <code>x = V[offset + 1]</code>. Because <code>V</code> is zero-initialized, <code>V[offset + 1] == 0</code> starts the $d = 0$ snake at $(x, y) = (0, 0)$ without any special-case code! However, make sure your array <code>V</code> is sized at least <code>2 * (N + M) + 3</code> so that reading <code>V[offset + k + 1]</code> at $k = +d$ or <code>V[offset + k - 1]</code> at $k = -d$ never indexes out of bounds.</p>
</div>
</div>`,
    "keyTakeaways": [
      "Myers' algorithm finds the Shortest Edit Script in O((N + M)D) time by expanding edit count d = 0..D and sliding greedily along 0-cost match diagonals k = x - y.",
      "Because each insertion or deletion changes k = x - y by +-1 while matches keep k constant, step d only visits diagonals with k === d (mod 2), allowing in-place updates of V[k].",
      "Hirschberg's divide-and-conquer algorithm reconstructs optimal alignments in O(N + M) linear memory by meeting a forward 2-row DP and a reverse 2-row DP at the midpoint row N/2."
    ],
    "furtherReading": [
      {
        "title": "Eugene W. Myers (1986) — An O(ND) Difference Algorithm and Its Variations (Algorithmica)",
        "url": "https://doi.org/10.1007/BF01840446"
      },
      {
        "title": "Dan S. Hirschberg (1975) — A Linear Space Algorithm for Computing Maximal Common Subsequences (CACM)",
        "url": "https://doi.org/10.1145/360825.360861"
      }
    ]
  },
  "huffman-lz77-deflate": {
    "title": "Lossless Compression: Huffman Optimality Proof, LZ77 Sliding Window & DEFLATE",
    "video": {
      "youtubeId": "JsTptu56GM8",
      "title": "How DEFLATE (gzip / PNG / ZIP) Combines LZ77 and Huffman Coding",
      "channel": "Reducible",
      "duration": "19:42",
      "start": 0,
      "length": 1182,
      "why": "Visualizes prefix-free Huffman trees, Kraft's inequality, Canonical Huffman bit-length tables, and how LZ77 (distance, length) back-references feed into DEFLATE."
    },
    "intuition": "<p>Every <code>.zip</code> archive, <code>gzip</code> HTTP response, and <code>PNG</code> image relies on Phil Katz's <strong>DEFLATE (RFC 1951)</strong> pipeline, which marries two orthogonal compression paradigms: <strong>LZ77</strong> (Abraham Lempel and Jacob Ziv, 1977) eliminates <em>structural substring redundancy</em> by replacing repeated phrases with $(\\text{distance}, \\text{length})$ sliding-window back-references, and <strong>Huffman Coding</strong> (David Huffman, 1952) eliminates <em>statistical symbol redundancy</em> by assigning shorter prefix-free bitstrings to higher-frequency literals and match lengths.</p><p>Why is a prefix-free binary code guaranteed to decode unambiguously without delimiters, and why does Huffman's greedy bottom-up min-heap merge produce an optimal prefix-free code? Because in any binary tree where codeword symbols sit exclusively at the leaves, no leaf is an ancestor of another leaf—satisfying <strong>Kraft's Inequality</strong> $\\sum_{c \\in \\Sigma} 2^{-\\ell_c} \\le 1$—and an exchange argument proves that the two lowest-frequency symbols can always be placed as sibling leaves at the deepest level of an optimal tree.</p>",
    "content": `<div class="lesson-content">
<h3>1. Prefix-Free Codes, Kraft's Inequality &amp; Huffman Optimality Proof</h3>
<p>Given an alphabet $\\Sigma$ with symbol frequencies $f_c > 0$, a <strong>prefix-free code</strong> assigns each $c \\in \\Sigma$ a bitstring of length $\\ell_c$ such that no codeword is a prefix of another codeword. Equivalently, symbols correspond to <strong>leaves</strong> of a binary tree where left edges are $0$ and right edges are $1$. We want to minimize the weighted path length $L(T) = \\sum_{c \\in \\Sigma} f_c \\cdot \\ell_c$. Huffman's algorithm repeatedly extracts the two minimum-frequency nodes $(x, y)$ from a min-heap and replaces them with a parent node of frequency $f_x + f_y$. Its optimality rests on two lemmas:</p>
<ol>
  <li><strong>Greedy Choice Property (Sibling Exchange):</strong> Let $x, y \\in \\Sigma$ have the two smallest frequencies ($f_x \\le f_y \\le f_z$ for all other $z$), and let $T^*$ be any optimal full binary tree with two sibling leaves $a, b$ at maximum depth $d_{\\max}$. Swapping $x \\leftrightarrow a$ and $y \\leftrightarrow b$ changes the total cost by:
  $$\\Delta L = (f_a - f_x)(d_{\\max} - d_a) + (f_b - f_y)(d_{\\max} - d_b) \\ge 0$$
  because $f_a \\ge f_x$, $f_b \\ge f_y$, and $d_{\\max} \\ge d_a, d_b$. Since $T^*$ was already optimal, $\\Delta L = 0$, so placing $x, y$ as deepest siblings is optimal!</li>
  <li><strong>Optimal Substructure (Merged Meta-Symbol):</strong> Once $x, y$ are fixed as sibling leaves under parent $p$ at depth $d_p$, their contribution to $L(T)$ is $(f_x + f_y)(d_p + 1) = (f_x + f_y)d_p + (f_x + f_y)$. Since $(f_x + f_y)$ is a constant additive term, minimizing $L(T)$ is identical to minimizing the tree cost over $\\Sigma' = (\\Sigma \\setminus \\{x, y\\}) \\cup \\{p\\}$ with $f_p = f_x + f_y$.</li>
</ol>

<h3>2. Canonical Huffman Codes &amp; The DEFLATE (LZ77 + Huffman) Pipeline</h3>
<p>How does a <code>gzip</code> file transmit the Huffman tree in its header without wasting bytes encoding tree pointers? Via <strong>Canonical Huffman Coding</strong>: if we sort symbols primarily by bit-length $\\ell_c$ and secondarily by alphabet value $c$, and assign sequential binary integers (left-shifted whenever $\\ell_c$ increases), the decoder can reconstruct the exact bitstring of every symbol from the array of lengths $\\ell_c$ alone!</p>
<p>In <strong>DEFLATE (RFC 1951)</strong>, the compressor scans the input with a <strong>32 KB LZ77 sliding window</strong> (using a chained hash table keyed on 3-byte prefixes to find the longest match of length $3..258$ at distance $1..32768$), emitting a unified stream of Literal bytes ($0..255$), End-of-Block ($256$), and Length codes ($257..285$) followed by Distance codes ($0..29$), all compressed with Canonical Huffman trees.</p>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Algorithm / Stage</th>
      <th>Encoding Time</th>
      <th>Decoding Time</th>
      <th>Key Mathematical Bound / Property</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Huffman Tree Construction</td>
      <td>$O(|\\Sigma| \\log |\\Sigma|)$ ($O(|\\Sigma|)$ if sorted)</td>
      <td>$O(1)$ per symbol via LUT</td>
      <td>$H(X) \\le \\bar{\\ell} < H(X) + 1$ bits/symbol (Shannon Entropy)</td>
    </tr>
    <tr>
      <td>Canonical Code Reconstruction</td>
      <td>$O(|\\Sigma| \\log |\\Sigma|)$</td>
      <td>$O(|\\Sigma|)$ from bit-lengths $\\ell_c$</td>
      <td>Header transmits only $\\ell_c$ (4–8 bits per symbol)</td>
    </tr>
    <tr>
      <td>LZ77 Sliding Window (Hash Chain)</td>
      <td>$O(N \\cdot \\text{chain\\_limit})$</td>
      <td>$O(N)$ (<code>memcpy</code> from window)</td>
      <td>32 KB back-reference window, match length $3..258$</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Kraft-McMillan Prefix-Free Inequality Invariant</div>
  <p>A multiset of codeword lengths $\\{\\ell_1, \\ell_2, \\dots, \\ell_k\\}$ can be realized as a binary prefix-free code if and only if $\\sum_{i=1}^k 2^{-\\ell_i} \\le 1$. Equality ($\\sum 2^{-\\ell_i} = 1$) holds if and only if the binary code tree is <strong>full</strong> (every internal node has exactly two children)—which is always true for an optimal Huffman tree with $|\\Sigma| \\ge 2$.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Two-Queues O(|Sigma|) Huffman &amp; Fast Table-Driven Decoding</div>
  <p>If symbol frequencies are already sorted, you can build a Huffman tree in strict $O(|\\Sigma|)$ time without a heap using <strong>two FIFO queues</strong>: Queue $Q_1$ holds initial sorted leaves, and Queue $Q_2$ holds merged internal nodes (which are produced in monotonically non-decreasing order of weight!). At decompression time, production decoders (<code>zlib</code>, <code>libdeflate</code>, <code>zstd</code>) never walk the Huffman tree bit-by-bit; instead, they peek 9–11 bits from a 64-bit bitbuffer and index a flat <code>table[1 &lt;&lt; 10]</code> entry containing <code>(symbol, bit_length)</code> to decode each token in 1 array lookup!</p>
</div>

<h3>3. Visual Trace: DEFLATE Pipeline &amp; Canonical Huffman Assignment</h3>
<svg viewBox="0 0 760 205" width="100%" height="205" role="img" aria-label="DEFLATE compression pipeline from LZ77 sliding window to Canonical Huffman bitstream">
  <style>
    .df-box { fill: #1e293b; stroke: #64748b; stroke-width: 1.5; rx: 6; }
    .df-lz { fill: #1e1b4b; stroke: #818cf8; stroke-width: 1.5; rx: 6; }
    .df-hf { fill: #064e3b; stroke: #34d399; stroke-width: 1.5; rx: 6; }
    .df-txt { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #f8fafc; text-anchor: middle; }
    .df-sub { font-family: 'Inter', sans-serif; font-size: 11px; fill: #94a3b8; text-anchor: middle; }
  </style>
  <rect width="760" height="205" fill="#0f172a" rx="8"/>

  <rect x="20" y="55" width="160" height="90" class="df-box"/>
  <text x="100" y="85" class="df-txt">Raw Byte Stream</text>
  <text x="100" y="108" class="df-sub">"abracadabra"</text>
  <text x="100" y="128" class="df-sub">11 bytes (88 bits)</text>

  <rect x="220" y="45" width="235" height="110" class="df-lz"/>
  <text x="337" y="72" class="df-txt" fill="#93c5fd">1. LZ77 32KB Sliding Window</text>
  <text x="337" y="96" class="df-txt">'a','b','r','a','c','a','d',</text>
  <text x="337" y="116" class="df-txt" fill="#fbbf24">&lt;dist=7, len=4&gt;</text>
  <text x="337" y="138" class="df-sub">3-byte hash chain finds "abra"</text>

  <rect x="495" y="45" width="245" height="110" class="df-hf"/>
  <text x="617" y="72" class="df-txt" fill="#34d399">2. Canonical Huffman Coder</text>
  <text x="617" y="96" class="df-txt">'a'(f=4)-&gt;0, 'b'-&gt;100</text>
  <text x="617" y="116" class="df-txt">len=4-&gt;101, dist=7-&gt;01</text>
  <text x="617" y="138" class="df-sub">Outputs packed prefix-free bits</text>

  <line x1="180" y1="100" x2="220" y2="100" stroke="#94a3b8" stroke-width="1.8"/>
  <line x1="455" y1="100" x2="495" y2="100" stroke="#34d399" stroke-width="1.8"/>
</svg>

<div class="mermaid">
flowchart LR
  A["Count symbol frequencies f[c]"] --> B["Push leaves (f[c], c) into Min-Heap"]
  B --> C{"Heap size &gt; 1?"}
  C -- "Yes" --> D["Pop two smallest x, y; push parent (f[x]+f[y])"]
  D --> C
  C -- "No" --> E["Compute leaf depths ell[c]"]
  E --> F["Sort by (ell[c], c) and assign Canonical bitstrings"]
</div>

<div class="simulator-mount" data-sim="sim-myers-diff-huffman-lz77"></div>

<h3>4. Production Implementation: Huffman Code Lengths, Canonical Bit-Assignment &amp; LZ77 Tokenizer</h3>
<pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;cstdint&gt;
#include &lt;queue&gt;
#include &lt;string_view&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

struct CanonicalCode {
    uint8_t sym;
    uint8_t bit_len;
    uint32_t bits; // MSB-first canonical codeword in lower <code>bit_len</code> bits
};

// 1. Computes Optimal Huffman Lengths &amp; Canonical Prefix-Free Bitstrings
std::vector&lt;CanonicalCode&gt; build_canonical_huffman(const std::vector&lt;uint64_t&gt;&amp; freq) {
    struct Node {
        uint64_t w;
        int left, right, sym;
        bool operator&gt;(const Node&amp; o) const { return w &gt; o.w; }
    };
    std::vector&lt;Node&gt; pool;
    std::priority_queue&lt;std::pair&lt;uint64_t, int&gt;,
                        std::vector&lt;std::pair&lt;uint64_t, int&gt;&gt;,
                        std::greater&lt;&gt;&gt; pq;

    for (int c = 0; c &lt; static_cast&lt;int&gt;(freq.size()); ++c) {
        if (freq[c] &gt; 0) {
            int id = static_cast&lt;int&gt;(pool.size());
            pool.push_back({freq[c], -1, -1, c});
            pq.push({freq[c], id});
        }
    }
    if (pq.empty()) return {};
    if (pq.size() == 1) {
        return {{static_cast&lt;uint8_t&gt;(pool[0].sym), 1, 0}};
    }

    while (pq.size() &gt; 1) {
        auto [w1, u] = pq.top(); pq.pop();
        auto [w2, v] = pq.top(); pq.pop();
        int p = static_cast&lt;int&gt;(pool.size());
        pool.push_back({w1 + w2, u, v, -1});
        pq.push({w1 + w2, p});
    }

    std::vector&lt;CanonicalCode&gt; codes;
    auto dfs = [&amp;](auto&amp; self, int u, uint8_t d) -&gt; void {
        if (pool[u].sym != -1) {
            codes.push_back({static_cast&lt;uint8_t&gt;(pool[u].sym), d, 0});
            return;
        }
        self(self, pool[u].left, d + 1);
        self(self, pool[u].right, d + 1);
    };
    dfs(dfs, pq.top().second, 0);

    // Sort by (bit_len, sym) and assign Canonical codewords
    std::sort(codes.begin(), codes.end(), [](const CanonicalCode&amp; a, const CanonicalCode&amp; b) {
        return (a.bit_len != b.bit_len) ? (a.bit_len &lt; b.bit_len) : (a.sym &lt; b.sym);
    });
    uint32_t cur_bits = 0;
    for (size_t i = 0; i &lt; codes.size(); ++i) {
        if (i &gt; 0) {
            cur_bits = (cur_bits + 1) &lt;&lt; (codes[i].bit_len - codes[i - 1].bit_len);
        }
        codes[i].bits = cur_bits;
    }
    return codes;
}

// 2. LZ77 Sliding-Window Tokenizer with Overlap Support (e.g., dist=1, len=10 RLE)
struct LZ77Token {
    uint16_t dist; // 0 if literal
    uint16_t len;  // 0 if literal, else match length &gt;= 3
    uint8_t lit;   // valid if dist == 0
};

std::vector&lt;LZ77Token&gt; lz77_encode(std::string_view src, size_t window_size = 32768) {
    std::vector&lt;LZ77Token&gt; out;
    const size_t n = src.size();
    size_t i = 0;
    while (i &lt; n) {
        size_t best_dist = 0, best_len = 0;
        size_t start_j = (i &gt; window_size) ? (i - window_size) : 0;
        for (size_t j = start_j; j &lt; i; ++j) {
            size_t len = 0;
            while (i + len &lt; n &amp;&amp; len &lt; 258 &amp;&amp; src[j + len] == src[i + len]) {
                ++len;
            }
            if (len &gt;= 3 &amp;&amp; len &gt; best_len) {
                best_len = len;
                best_dist = i - j;
            }
        }
        if (best_len &gt;= 3) {
            out.push_back({static_cast&lt;uint16_t&gt;(best_dist), static_cast&lt;uint16_t&gt;(best_len), 0});
            i += best_len;
        } else {
            out.push_back({0, 0, static_cast&lt;uint8_t&gt;(src[i])});
            ++i;
        }
    }
    return out;
}</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Overlapping LZ77 Copy (<code>len &gt; dist</code>) Breaks <code>memcpy</code>!</div>
  <p>In LZ77 and DEFLATE, a match's length <code>len</code> is allowed to exceed its backward distance <code>dist</code>! For example, encoding $\\texttt{\"aaaaaaaaaa\"}$ ($10$ $\\texttt{'a'}$'s) emits literal $\\texttt{'a'}$ followed by $\\langle \\text{dist}=1, \\text{len}=9 \\rangle$, which copies each newly written byte into the next position (run-length encoding). If your decompressor calls <code>std::memcpy(dst, dst - dist, len)</code> when <code>len > dist</code>, overlapping source and destination buffers trigger <strong>undefined behavior</strong> (and corrupt multi-byte SIMD copies)! You must either copy byte-by-byte or replicate the period <code>dist</code> until <code>dist >= len</code>.</p>
</div>
</div>`,
    "keyTakeaways": [
      "Huffman coding builds an optimal prefix-free binary tree in O(|Sigma| log |Sigma|) time (or O(|Sigma|) from sorted frequencies via two queues), proved optimal by the deepest-sibling exchange argument.",
      "Canonical Huffman coding sorts symbols by (bit_length, symbol) so codewords are assigned sequentially via (code + 1) << delta_len, allowing headers to transmit only bit lengths.",
      "DEFLATE (RFC 1951) pairs a 32 KB LZ77 sliding window (matching lengths 3..258 via 3-byte hash chains) with Canonical Huffman coding over literals, lengths, and distances."
    ],
    "furtherReading": [
      {
        "title": "David A. Huffman (1952) — A Method for the Construction of Minimum-Redundancy Codes (Proc. IRE)",
        "url": "https://doi.org/10.1109/JRPROC.1952.273898"
      },
      {
        "title": "Ziv & Lempel (1977) — A Universal Algorithm for Sequential Data Compression (IEEE Trans. Inf. Theory)",
        "url": "https://doi.org/10.1109/TIT.1977.1055714"
      },
      {
        "title": "RFC 1951 — DEFLATE Compressed Data Format Specification version 1.3",
        "url": "https://datatracker.ietf.org/doc/html/rfc1951"
      }
    ]
  },
  "case-git-myers-histogram-diff": {
    "title": "Production Case Study: Inside git diff (Myers vs Patience vs Histogram Diff)",
    video: {
      youtubeId: "MGdlTzVyyrE",
      id: "MGdlTzVyyrE",
      url: "https://www.youtube.com/embed/MGdlTzVyyrE",
      title: "Visualizing Eugene Myers' O(ND) Diff Algorithm & Edit Graphs",
      channel: "sphaerophoria",
      duration: "31:15",
      start: 0,
      length: "31m",
      why: "Compares git diff --myers, --patience, and --histogram on real C/Rust refactoring commits to show how low-frequency anchor lines prevent misaligned closing braces."
    },
    "intuition": "<p>Have you ever added a new function to a source file, run <code>git diff</code>, and seen Git claim that you deleted the closing brace <code>}</code> of the previous function and inserted the closing brace of the new function inside the old one? Mathematically, Eugene Myers' $O(ND)$ algorithm found a valid <strong>Shortest Edit Script</strong>—because every line has weight $1$, matching two boilerplate <code>}</code> or blank lines is worth the exact same score as matching two unique function signatures!</p><p>To produce human-readable diffs that respect semantic code structure, Bram Cohen invented <strong>Patience Diff</strong> and <code>JGit</code> / <code>git diff --histogram</code> refined it into <strong>Histogram Diff</strong>: before running Myers, anchor the diff on the <strong>lowest-frequency matching lines</strong> (such as unique function headers <code>fn parse_header() {</code> that occur $1$ time in both files) via Longest Increasing Subsequence (LIS), and recursively diff the regions between those anchors!</p>",
    "content": `<div class="lesson-content">
<h3>1. The Boilerplate Misalignment Problem in Pure Myers Diff</h3>
<p>Suppose File $A$ and File $B$ differ because a developer rewrote the body of <code>func_one()</code> while adding <code>func_two()</code>. Inside those functions sit dozens of identical boilerplate lines (<code>}</code>, <code>return err;</code>, blank lines). Because pure Myers diff treats every line as an unweighted token and greedily slides along the first available diagonal snake, it readily matches the closing <code>}</code> of <code>func_one()</code> in File $A$ with the closing <code>}</code> of <code>func_two()</code> in File $B$, producing a tangled, unreadable diff hunk that splits across function boundaries.</p>

<h3>2. Git's Three Production Diff Engines</h3>
<ol>
  <li><strong><code>git diff --myers</code> (Default / <code>xdl_do_diff</code>):</strong> Hashes each line into an integer token ID, strips common prefix/suffix lines, and runs Bidirectional Myers $O(ND)$ with Hirschberg's linear-space midpoint split (<code>find_snake</code>). Fast when $D$ is small, but includes heuristic cutoffs (<code>max_chain_length</code>) when $D$ is huge so it doesn't stall in $\\Theta(N^2)$ time on completely rewritten files.</li>
  <li><strong><code>git diff --patience</code> (Bram Cohen):</strong>
    <ul>
      <li>Identify all lines that occur <strong>exactly once</strong> in File $A$ AND <strong>exactly once</strong> in File $B$.</li>
      <li>Find the <strong>Longest Increasing Subsequence (LIS)</strong> of their line positions in $O(U \\log U)$ time via Patience Sorting (hence the name!).</li>
      <li>Use those matched unique lines as immovable structural anchors, and recursively diff the sub-slices between consecutive anchors (falling back to Myers when no unique common lines remain in a slice).</li>
    </ul>
  </li>
  <li><strong><code>git diff --histogram</code> (JGit / Git 1.7.7+):</strong> What if a slice has <em>no</em> lines with count $== 1$ (e.g., a file with two similar classes where every header appears twice)? Patience Diff immediately falls back to Myers. <strong>Histogram Diff</strong> generalizes Patience Diff: it builds a frequency histogram of all lines in $A$, scans for the common line with the <strong>lowest occurrence count</strong> (up to a threshold of 64 occurrences) that forms the longest contiguous matching block, splits both files around that anchor block, and recurses on the prefix and suffix!</li>
</ol>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Git Algorithm Flag</th>
      <th>Anchor Selection Strategy</th>
      <th>Worst-Case / Typical Speed</th>
      <th>Human Readability on Code</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>--myers</code> (default)</td>
      <td>None (all lines weighted equally)</td>
      <td>$O((N + M)D)$ (needs cutoffs if $D \\approx N$)</td>
      <td>Can misalign braces <code>{</code>, <code>}</code>, blank lines</td>
    </tr>
    <tr>
      <td><code>--patience</code></td>
      <td>LIS of lines with $\\text{freq}_A = \\text{freq}_B = 1$</td>
      <td>$O(N \\log N)$ on unique anchors + Myers</td>
      <td>Excellent on unique function/struct headers</td>
    </tr>
    <tr>
      <td><code>--histogram</code></td>
      <td>Longest block anchored on lowest-frequency line</td>
      <td>Often <strong>faster</strong> than Myers on large diffs!</td>
      <td>Best overall; handles repeated blocks cleanly</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Patience Anchor Order-Preservation Invariant</div>
  <p>Let $(a_1, b_1), (a_2, b_2), \\dots, (a_k, b_k)$ be the pairs of line indices for lines occurring uniquely in both $A$ and $B$, sorted by $a_1 < a_2 < \\dots < a_k$. A subset of these unique matches can appear together in a valid non-crossing diff alignment if and only if their $B$-indices form a strictly increasing subsequence $b_{i_1} < b_{i_2} < \\dots < b_{i_m}$. Finding the Longest Increasing Subsequence (LIS) in $O(k \\log k)$ time maximizes the number of preserved structural anchors.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Line Hashing &amp; Post-Diff Slider Heuristics in libxdiff</div>
  <p>Before running any diff algorithm, Git's <code>libxdiff</code> hashes every line (using a fast multiplicative hash) into a 32-bit bucket ID so the inner diff loop compares <code>uint32_t</code> integers in registers rather than calling <code>memcmp</code> on line strings. After computing the edit script, Git runs a <strong>slider post-processing pass</strong> (<code>xdl_change_compact</code>) that shifts ambiguous deletion/insertion hunks up or down when surrounded by identical lines (such as <code>}</code>) so the hunk aligns cleanly with blank lines and indentation boundaries.</p>
</div>

<h3>3. Visual Trace: Myers Brace Misalignment vs. Patience/Histogram Anchor</h3>
<svg viewBox="0 0 760 220" width="100%" height="220" role="img" aria-label="Comparison of Myers diff brace misalignment versus Patience diff unique-line anchoring">
  <style>
    .gd-box { fill: #1e293b; stroke: #475569; stroke-width: 1.5; rx: 6; }
    .gd-txt { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #e2e8f0; }
    .gd-del { fill: #f87171; }
    .gd-ins { fill: #34d399; }
    .gd-hdr { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: bold; }
  </style>
  <rect width="760" height="220" fill="#0f172a" rx="8"/>

  <!-- Left: Myers Misaligned Output -->
  <rect x="20" y="20" width="345" height="180" class="gd-box"/>
  <text x="35" y="42" class="gd-hdr" fill="#f87171">git diff --myers (Matches wrong '}' brace)</text>
  <g transform="translate(35, 65)">
    <text x="0" y="0" class="gd-txt"> fn first() {</text>
    <text x="0" y="20" class="gd-txt gd-ins">+    return 1;</text>
    <text x="0" y="40" class="gd-txt gd-ins">+}</text>
    <text x="0" y="60" class="gd-txt gd-ins">+fn second() {</text>
    <text x="0" y="80" class="gd-txt">     return 2;</text>
    <text x="0" y="100" class="gd-txt"> }   &lt;-- Myers matched old '}' to second()!</text>
  </g>

  <!-- Right: Patience / Histogram Output -->
  <rect x="395" y="20" width="345" height="180" class="gd-box"/>
  <text x="410" y="42" class="gd-hdr" fill="#34d399">git diff --patience / --histogram</text>
  <g transform="translate(410, 65)">
    <text x="0" y="0" class="gd-txt" fill="#93c5fd"> fn first() {     [Unique Anchor #1]</text>
    <text x="0" y="20" class="gd-txt gd-del">-    return 2;</text>
    <text x="0" y="40" class="gd-txt gd-ins">+    return 1;</text>
    <text x="0" y="60" class="gd-txt"> }</text>
    <text x="0" y="80" class="gd-txt gd-ins">+fn second() {</text>
    <text x="0" y="100" class="gd-txt gd-ins">+    return 2;</text>
    <text x="0" y="120" class="gd-txt gd-ins">+}</text>
  </g>
</svg>

<div class="mermaid">
flowchart TD
  A["Input Slice A[a0..a1], B[b0..b1]"] --> B["Strip matching prefix and suffix lines"]
  B --> C["Build frequency histogram of remaining lines in A"]
  C --> D{"Found common line with count &lt;= 64?"}
  D -- "No (all lines absent or ultra-repetitive)" --> E["Fallback to Myers O(ND) on slice"]
  D -- "Yes" --> F["Pick longest contiguous match block anchored on lowest-frequency line"]
  F --> G["Recurse on Prefix Slice (before block) and Suffix Slice (after block)"]
</div>

<div class="simulator-mount" data-sim="sim-myers-diff-huffman-lz77"></div>

<h3>4. Reference Implementation: Patience Diff Unique-Line LIS Anchor Finder</h3>
<pre><code class="language-cpp">#include &lt;algorithm&gt;
#include &lt;string_view&gt;
#include &lt;unordered_map&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;

struct AnchorMatch {
    int line_a;
    int line_b;
};

// Finds Patience Diff structural anchors: Longest Increasing Subsequence of unique common lines
std::vector&lt;AnchorMatch&gt; find_patience_anchors(const std::vector&lt;std::string_view&gt;&amp; a,
                                               const std::vector&lt;std::string_view&gt;&amp; b) {
    std::unordered_map&lt;std::string_view, int&gt; count_a, count_b, pos_b;
    for (int i = 0; i &lt; static_cast&lt;int&gt;(a.size()); ++i) count_a[a[i]]++;
    for (int j = 0; j &lt; static_cast&lt;int&gt;(b.size()); ++j) {
        count_b[b[j]]++;
        pos_b[b[j]] = j;
    }

    // Collect pairs (i, j) for lines occurring exactly once in A and once in B
    std::vector&lt;AnchorMatch&gt; uniques;
    for (int i = 0; i &lt; static_cast&lt;int&gt;(a.size()); ++i) {
        if (count_a[a[i]] == 1 &amp;&amp; count_b[a[i]] == 1) {
            uniques.push_back({i, pos_b[a[i]]});
        }
    }
    if (uniques.empty()) return {};

    // Patience Sorting O(U log U) Longest Increasing Subsequence on <code>line_b</code>
    const int u = static_cast&lt;int&gt;(uniques.size());
    std::vector&lt;int&gt; tails, tail_idx, parent(u, -1);
    for (int k = 0; k &lt; u; ++k) {
        int y = uniques[k].line_b;
        auto it = std::lower_bound(tails.begin(), tails.end(), y);
        int idx = static_cast&lt;int&gt;(it - tails.begin());
        if (it == tails.end()) {
            tails.push_back(y);
            tail_idx.push_back(k);
        } else {
            *it = y;
            tail_idx[idx] = k;
        }
        if (idx &gt; 0) parent[k] = tail_idx[idx - 1];
    }

    std::vector&lt;AnchorMatch&gt; anchors;
    for (int cur = tail_idx.back(); cur != -1; cur = parent[cur]) {
        anchors.push_back(uniques[cur]);
    }
    std::reverse(anchors.begin(), anchors.end());
    return anchors;
}</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Patience and Histogram Diff Do Not Guarantee Minimum Edit Distance</div>
  <p>By forcing the alignment path to pass through low-frequency structural anchors (like function declarations), Patience Diff and Histogram Diff deliberately sacrifice mathematical shortest-edit-script optimality when matching a dozen <code>}</code> braces across functions would save 2 lines in the diff! In version control and code review, <strong>semantic alignment of unique lines</strong> is far more valuable than saving 2 lines by scrambling function boundaries.</p>
</div>
</div>`,
    "keyTakeaways": [
      "Pure Myers diff weights every line equally, so high-frequency boilerplate lines ('}', blank lines) can hijack diagonal snakes and misalign function boundaries.",
      "Patience Diff finds the Longest Increasing Subsequence (LIS) of lines occurring exactly once in both files in O(U log U) time and recursively diffs the intervals between those anchors.",
      "Histogram Diff generalizes Patience Diff by anchoring on the longest contiguous match containing the lowest-frequency line (up to 64 occurrences), often running faster than Myers on large diffs."
    ],
    "furtherReading": [
      {
        "title": "Lupien (2020) — How Different Are Different Diff Algorithms in Git? (Empirical Software Engineering)",
        "url": "https://doi.org/10.1007/s10664-019-09772-z"
      },
      {
        "title": "Git Source Code — xdiff/xpatience.c and xdiff/xhistogram.c",
        "url": "https://github.com/git/git/tree/master/xdiff"
      }
    ]
  },
  "build-thompson-nfa-regex-engine": {
    "title": "Build Lab: ReDoS-Proof Regular Expression Engine via Thompson's Construction & NFA Step Simulation",
    video: {
      youtubeId: "LT3wwkpt7ak",
      id: "LT3wwkpt7ak",
      url: "https://www.youtube.com/embed/LT3wwkpt7ak",
      title: "Thompson's Construction Algorithm: Compiling Regular Expressions to Epsilon-NFAs",
      channel: "CSE Concepts with Parinita",
      duration: "17:25",
      start: 0,
      length: "17m",
      why: "Walks through explicit concatenation insertion, Shunting-Yard postfix compilation, fragment stack patching, and the generation-stamped NFA step simulator."
    },
    "intuition": "<p>In this final Build Lab of Track 4, we build a complete, self-contained, <strong>ReDoS-proof Regular Expression Compiler and Virtual Machine</strong> supporting concatenation, alternation (<code>|</code>), grouping parentheses <code>(...)</code>, wildcard dot (<code>.</code>), and the three Kleene quantifiers (<code>*</code>, <code>+</code>, <code>?</code>) in strict $O(N \\cdot M)$ worst-case time.</p><p>Follow Russ Cox and Ken Thompson's classic three-stage compiler architecture: (1) a <strong>Lexer/Concatenation Inserter</strong> that inserts explicit concatenation operators (<code>\\x08</code>) between adjacent atoms (e.g., turning <code>a(b|c)*d</code> into <code>a·(b|c)*·d</code>) and converts the infix expression to postfix (Reverse Polish Notation) via Dijkstra's Shunting-Yard algorithm; (2) a <strong>Stack-Based NFA Fragment Compiler</strong> that patches dangling arrow indices without heap pointers; and (3) a <strong>Lockstep Subset Simulator</strong> using <code>step_id</code> generation counters.</p>",
    "content": `<div class="lesson-content">
<h3>1. The Three-Stage Thompson Regex Pipeline</h3>
<p>To compile a raw regex string $R$ of length $M$ into a linear-time automaton with zero pointer chasing, we execute three linear passes:</p>
<ol>
  <li><strong>Explicit Concatenation &amp; Shunting-Yard (<code>re2post</code>):</strong> Standard regex syntax omits the concatenation operator (writing <code>ab</code> instead of <code>a·b</code>). An explicit concatenation operator <code>CONCAT</code> must be inserted between token $T_1$ and token $T_2$ whenever $T_1$ can <em>end</em> a subexpression (a literal, <code>.</code>, <code>)</code>, <code>*</code>, <code>+</code>, or <code>?</code>) AND $T_2$ can <em>begin</em> a subexpression (a literal, <code>.</code>, or <code>(</code>). We then run Shunting-Yard with operator precedence $\\{*, +, ?\\} > \\text{CONCAT} > |$.</li>
  <li><strong>Fragment Stack Compilation (<code>post2nfa</code>):</strong> Each item on the compiler stack is a <code>Frag { int start; std::vector<int> out_patches; }</code> where each integer in <code>out_patches</code> encodes <code>(state_idx << 1) | which_arrow</code> identifying an unpatched outgoing slot (<code>out</code> or <code>out1</code>) in our contiguous <code>std::vector<State></code> arena.</li>
  <li><strong>Generation-Stamped Lockstep Simulation (<code>match</code>):</strong> At each text byte, we step all active states in <code>clist</code> into <code>nlist</code> using <code>last_step[u] == step_id</code> to deduplicate $\\varepsilon$-closures in $O(1)$ time.</li>
</ol>

<table class="complexity-matrix">
  <thead>
    <tr>
      <th>Compiler / VM Stage</th>
      <th>Time Complexity</th>
      <th>Space Complexity</th>
      <th>Key Invariant</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>to_postfix(pattern)</code></td>
      <td>$O(M)$</td>
      <td>$O(M)$</td>
      <td>Precedence: Unary (<code>*</code>,<code>+</code>,<code>?</code>) $3$ &gt; Concat $2$ &gt; Alt (<code>|</code>) $1$</td>
    </tr>
    <tr>
      <td><code>compile_postfix(post)</code></td>
      <td>$O(M)$</td>
      <td>$\\le 2M$ NFA states</td>
      <td>Every <code>Frag</code> patches dangling arrows into contiguous arena</td>
    </tr>
    <tr>
      <td><code>full_match(text)</code></td>
      <td>$O(N \\cdot M)$ worst-case</td>
      <td>$O(M)$ (<code>clist</code>, <code>nlist</code>)</td>
      <td>Immune to ReDoS on <code>(a+)+b</code>, <code>(a|a)*b</code>, etc.</td>
    </tr>
  </tbody>
</table>

<div class="invariant-box">
  <div class="invariant-title">Fragment Dangling-Arrow Patching Invariant</div>
  <p>Every compiled subexpression fragment $F$ has a single entry state <code>F.start</code> and a list of dangling outgoing arrow slots <code>F.dangling</code> that are reached when $F$ finishes matching. Calling <code>patch(F.dangling, target_state)</code> wires every exit path of $F$ directly to <code>target_state</code>. Because each postfix operator creates at most $1$ new <code>SPLIT</code> or <code>CHAR</code> state and merges at most two <code>dangling</code> lists, the total number of states and patched arrows is bounded by $2M$.</p>
</div>

<div class="hardware-box">
  <div class="hardware-title">Encoding Dangling Pointers as Packed Arena Indices</div>
  <p>In C, Russ Cox's reference implementation represents dangling arrows as <code>Ptrlist*</code> unions overlaid inside <code>State*</code> pointers—a trick that triggers strict-aliasing UB in modern C++ and breaks if states live in a resizable <code>std::vector&lt;State&gt;</code>. Packing a dangling slot as <code>(state_id &lt;&lt; 1) | is_out1</code> (<code>int32_t</code>) is 100% standards-compliant, survives <code>std::vector</code> reallocation, and keeps the entire NFA inside a single cache-hot array.</p>
</div>

<h3>2. Visual Trace: Thompson NFA Fragments (<code>CONCAT</code>, <code>|</code>, <code>*</code>, <code>+</code>, <code>?</code>)</h3>
<svg viewBox="0 0 760 220" width="100%" height="220" role="img" aria-label="Thompson NFA fragment wiring for concatenation, alternation, star, plus, and question mark">
  <style>
    .nf-box { fill: #1e293b; stroke: #64748b; stroke-width: 1.5; rx: 6; }
    .nf-sp { fill: #1e1b4b; stroke: #818cf8; stroke-width: 1.5; }
    .nf-txt { font-family: 'JetBrains Mono', monospace; font-size: 12px; fill: #f8fafc; text-anchor: middle; }
    .nf-lbl { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: bold; fill: #93c5fd; }
    .nf-arr { stroke: #34d399; stroke-width: 1.5; fill: none; }
  </style>
  <rect width="760" height="220" fill="#0f172a" rx="8"/>

  <!-- Panel 1: Alternation e1 | e2 -->
  <text x="30" y="30" class="nf-lbl">1. Alternation (e1 | e2)</text>
  <g transform="translate(30, 45)">
    <circle cx="30" cy="65" r="18" class="nf-sp"/><text x="30" y="69" class="nf-txt">sp</text>
    <rect x="85" y="15" width="70" height="34" class="nf-box"/><text x="120" y="36" class="nf-txt">e1</text>
    <rect x="85" y="80" width="70" height="34" class="nf-box"/><text x="120" y="101" class="nf-txt">e2</text>
    <line x1="46" y1="56" x2="85" y2="32" class="nf-arr"/>
    <line x1="46" y1="74" x2="85" y2="97" class="nf-arr"/>
    <line x1="155" y1="32" x2="195" y2="32" class="nf-arr"/>
    <line x1="155" y1="97" x2="195" y2="97" class="nf-arr"/>
  </g>

  <!-- Panel 2: Kleene Star e* -->
  <text x="280" y="30" class="nf-lbl">2. Kleene Star (e*)</text>
  <g transform="translate(280, 45)">
    <circle cx="40" cy="65" r="18" class="nf-sp"/><text x="40" y="69" class="nf-txt">sp</text>
    <rect x="95" y="20" width="75" height="36" class="nf-box"/><text x="132" y="42" class="nf-txt">e</text>
    <line x1="56" y1="55" x2="95" y2="38" class="nf-arr"/>
    <path d="M 170 38 Q 200 38 190 10 Q 115 -10 40 47" class="nf-arr"/>
    <line x1="56" y1="75" x2="185" y2="105" class="nf-arr"/>
    <text x="140" y="122" class="nf-txt" fill="#34d399">dangling exit</text>
  </g>

  <!-- Panel 3: Plus e+ -->
  <text x="530" y="30" class="nf-lbl">3. One-or-More (e+)</text>
  <g transform="translate(530, 45)">
    <rect x="15" y="47" width="75" height="36" class="nf-box"/><text x="52" y="69" class="nf-txt">e</text>
    <circle cx="135" cy="65" r="18" class="nf-sp"/><text x="135" y="69" class="nf-txt">sp</text>
    <line x1="90" y1="65" x2="117" y2="65" class="nf-arr"/>
    <path d="M 135 47 Q 85 5 35 47" class="nf-arr"/>
    <line x1="153" y1="65" x2="200" y2="65" class="nf-arr"/>
    <text x="170" y="95" class="nf-txt" fill="#34d399">exit</text>
  </g>
</svg>

<div class="mermaid">
flowchart LR
  A["Infix Regex: a(b|c)*d"] --> B["Insert Explicit CONCAT: a·(b|c)*·d"]
  B --> C["Shunting-Yard Postfix: a b c | * · d ·"]
  C --> D["Fragment Stack Compiler -&gt; NFA Arena"]
  D --> E["Lockstep Subset Simulator O(N * M)"]
</div>

<div class="simulator-mount" data-sim="sim-bwt-fm-index"></div>

<h3>3. Complete Build Implementation: End-to-End Thompson Regex Engine</h3>
<pre><code class="language-cpp">#include &lt;cstdint&gt;
#include &lt;string&gt;
#include &lt;string_view&gt;
#include &lt;vector&gt;

class ReDoSProofRegex {
public:
    static constexpr char OP_CONCAT = '\x08';

    explicit ReDoSProofRegex(std::string_view pattern) {
        std::string post = to_postfix(pattern);
        compile_postfix(post);
    }

    bool full_match(std::string_view text) const {
        if (start_ &lt; 0) return false;
        const int m = static_cast&lt;int&gt;(states_.size());
        std::vector&lt;int&gt; clist, nlist, last_step(m, 0);
        int step_id = 1;
        add_state(start_, clist, last_step, step_id);

        for (char c : text) {
            ++step_id;
            nlist.clear();
            for (int u : clist) {
                if (states_[u].op == CHAR &amp;&amp; (states_[u].ch == c || states_[u].ch == '.')) {
                    add_state(states_[u].out, nlist, last_step, step_id);
                }
            }
            clist.swap(nlist);
            if (clist.empty()) return false;
        }
        for (int u : clist) {
            if (states_[u].op == MATCH) return true;
        }
        return false;
    }

private:
    enum Op { CHAR, SPLIT, MATCH };
    struct State {
        Op op;
        char ch = 0;
        int out = -1;
        int out1 = -1;
    };
    struct Frag {
        int start;
        std::vector&lt;int&gt; dangling; // Packed: (state_idx &lt;&lt; 1) | is_out1
    };

    std::vector&lt;State&gt; states_;
    int start_ = -1;

    static int precedence(char op) {
        if (op == '*' || op == '+' || op == '?') return 3;
        if (op == OP_CONCAT) return 2;
        if (op == '|') return 1;
        return 0;
    }

    static std::string to_postfix(std::string_view re) {
        // 1. Insert explicit concatenation OP_CONCAT ('\x08')
        std::string exp;
        bool prev_can_end = false;
        for (char c : re) {
            bool cur_can_start = (c != '|' &amp;&amp; c != ')' &amp;&amp; c != '*' &amp;&amp; c != '+' &amp;&amp; c != '?');
            if (prev_can_end &amp;&amp; cur_can_start) exp.push_back(OP_CONCAT);
            exp.push_back(c);
            prev_can_end = (c != '|' &amp;&amp; c != '(');
        }
        // 2. Dijkstra's Shunting-Yard to Postfix
        std::string post, ops;
        for (char c : exp) {
            if (c == '(') {
                ops.push_back(c);
            } else if (c == ')') {
                while (!ops.empty() &amp;&amp; ops.back() != '(') {
                    post.push_back(ops.back());
                    ops.pop_back();
                }
                if (!ops.empty()) ops.pop_back();
            } else if (c == '|' || c == OP_CONCAT || c == '*' || c == '+' || c == '?') {
                while (!ops.empty() &amp;&amp; ops.back() != '(' &amp;&amp;
                       precedence(ops.back()) &gt;= precedence(c)) {
                    post.push_back(ops.back());
                    ops.pop_back();
                }
                ops.push_back(c);
            } else {
                post.push_back(c);
            }
        }
        while (!ops.empty()) {
            post.push_back(ops.back());
            ops.pop_back();
        }
        return post;
    }

    int add_nfa_state(Op op, char ch, int out, int out1) {
        states_.push_back({op, ch, out, out1});
        return static_cast&lt;int&gt;(states_.size()) - 1;
    }

    void patch(const std::vector&lt;int&gt;&amp; list, int target) {
        for (int p : list) {
            int idx = p &gt;&gt; 1;
            if (p &amp; 1) states_[idx].out1 = target;
            else       states_[idx].out  = target;
        }
    }

    static std::vector&lt;int&gt; append(std::vector&lt;int&gt; a, const std::vector&lt;int&gt;&amp; b) {
        a.insert(a.end(), b.begin(), b.end());
        return a;
    }

    void compile_postfix(std::string_view post) {
        std::vector&lt;Frag&gt; st;
        for (char c : post) {
            if (c == OP_CONCAT) {
                Frag e2 = std::move(st.back()); st.pop_back();
                Frag e1 = std::move(st.back()); st.pop_back();
                patch(e1.dangling, e2.start);
                st.push_back({e1.start, std::move(e2.dangling)});
            } else if (c == '|') {
                Frag e2 = std::move(st.back()); st.pop_back();
                Frag e1 = std::move(st.back()); st.pop_back();
                int s = add_nfa_state(SPLIT, 0, e1.start, e2.start);
                st.push_back({s, append(std::move(e1.dangling), e2.dangling)});
            } else if (c == '?') {
                Frag e = std::move(st.back()); st.pop_back();
                int s = add_nfa_state(SPLIT, 0, e.start, -1);
                e.dangling.push_back((s &lt;&lt; 1) | 1);
                st.push_back({s, std::move(e.dangling)});
            } else if (c == '*') {
                Frag e = std::move(st.back()); st.pop_back();
                int s = add_nfa_state(SPLIT, 0, e.start, -1);
                patch(e.dangling, s);
                st.push_back({s, {(s &lt;&lt; 1) | 1}});
            } else if (c == '+') {
                Frag e = std::move(st.back()); st.pop_back();
                int s = add_nfa_state(SPLIT, 0, e.start, -1);
                patch(e.dangling, s);
                st.push_back({e.start, {(s &lt;&lt; 1) | 1}});
            } else {
                int s = add_nfa_state(CHAR, c, -1, -1);
                st.push_back({s, {(s &lt;&lt; 1) | 0}});
            }
        }
        if (st.empty()) {
            start_ = add_nfa_state(MATCH, 0, -1, -1);
            return;
        }
        Frag root = std::move(st.back());
        int match_state = add_nfa_state(MATCH, 0, -1, -1);
        patch(root.dangling, match_state);
        start_ = root.start;
    }

    void add_state(int u, std::vector&lt;int&gt;&amp; list,
                   std::vector&lt;int&gt;&amp; last_step, int step_id) const {
        if (u &lt; 0 || last_step[u] == step_id) return;
        last_step[u] = step_id;
        if (states_[u].op == SPLIT) {
            add_state(states_[u].out, list, last_step, step_id);
            add_state(states_[u].out1, list, last_step, step_id);
            return;
        }
        list.push_back(u);
    }
};</code></pre>

<div class="callout callout-warning">
  <div class="callout-title">Empty-Loop Cycles (<code>(a*)*</code>) and Why <code>last_step[u] == step_id</code> Saves <code>add_state</code></div>
  <p>Consider compiling <code>(a*)*</code> or <code>(|a)*</code>. The two nested <code>SPLIT</code> nodes form a directed cycle of $\\varepsilon$-transitions! If <code>add_state</code> set <code>last_step[u] = step_id</code> <em>after</em> recursing on <code>SPLIT</code> children (or only set it for <code>CHAR</code> states), an $\\varepsilon$-cycle would cause infinite recursion and a stack overflow on the very first character! Setting <code>last_step[u] = step_id</code> at the <strong>very top of <code>add_state</code> before recursing on <code>SPLIT</code></strong> breaks every $\\varepsilon$-cycle in $O(1)$ time.</p>
</div>
</div>`,
    "keyTakeaways": [
      "Inserting an explicit concatenation operator before Shunting-Yard converts any infix regular expression into postfix notation in O(M) time.",
      "Packing dangling outgoing transitions as (state_idx << 1) | is_out1 allows stack-based Thompson fragment patching inside a contiguous std::vector<State> arena without raw pointer aliasing.",
      "Marking last_step[u] = step_id at entry to add_state (before expanding SPLIT children) both guarantees O(N * M) runtime and prevents infinite recursion on nullable epsilon cycles like (a*)*."
    ],
    "furtherReading": [
      {
        "title": "Russ Cox (2007) — Regular Expression Matching Can Be Simple And Fast (Full C Implementation)",
        "url": "https://swtch.com/~rsc/regexp/regexp1.html"
      },
      {
        "title": "Google RE2 — Production C++ Thompson NFA and Lazy DFA Regular Expression Library",
        "url": "https://github.com/google/re2"
      }
    ]
  }
};
