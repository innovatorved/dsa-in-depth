/* ═══════════════════════════════════════════════════════════════
   DSA In Depth — Track IV Simulators (Strings, Automata, Suffix & Compression)
   1. sim-trie-radix-bitwise (aliases: sim-trie-radix, sim-trie-radix-art)
   2. sim-rabin-karp-rolling-hash
   3. sim-kmp-z-automaton (alias: sim-kmp-z-rabin-karp)
   4. sim-aho-corasick-trie (aliases: sim-aho-corasick-automaton, sim-aho-corasick)
   5. sim-suffix-array-sam (alias: sim-suffix-array-lcp)
   6. sim-bwt-fm-index
   7. sim-myers-diff-huffman-lz77
   ═══════════════════════════════════════════════════════════════ */

window.SIMULATORS = window.SIMULATORS || {};

(() => {
  const { esc, createStepSimulator, renderArrayCells } = window.Simulators;

  // ───────────────────────────────────────────────────────────────
  // 1. Radix Tree (rax), Succinct Trie & Bitwise 0/1 XOR Trie
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-trie-radix-bitwise'] = createStepSimulator({
    id: 'sim-trie-radix-bitwise',
    aliases: ['sim-trie-radix', 'sim-trie-radix-art'],
    title: 'Radix Tree (rax), Succinct Trie & Bitwise 0/1 XOR Trie Maximum-XOR Visualizer',
    badge: 'O(W) Bitwise XOR · ≤ 2K−1 Radix Nodes',
    badgeClass: 'badge-on',
    blurb: 'Walk a Bitwise 0/1 Binary Trie greedily taking the opposite bit (1 − b) from MSB to LSB to maximize x ⊕ y, inspect Path-Compressed Radix/PATRICIA edge splits ("romane" / "romanus" / "rubens"), and examine UTF-8 / 24-byte SSO memory layouts.',
    slugs: [
      'string-encodings-utf8-sso-ropes',
      'tries-radix-patricia-succinct',
      'bitwise-xor-tries',
      'tries-radix-trees-patricia',
      'bitwise-tries-max-xor'
    ],
    presets: [
      { id: 'xortrie', label: 'Bitwise 0/1 Binary Trie Greedy Opposite-Bit Walk for max_y (x ⊕ y)', mode: 'xortrie' },
      { id: 'radix', label: 'Compressed Radix/Patricia Tree Edge Split ("romane" / "romanus" / "rubens")', mode: 'radix' },
      { id: 'utf8', label: 'UTF-8 Variable-Width Byte Prefix & 24-Byte SSO Layout', mode: 'utf8' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'utf8') {
        const steps = [
          {
            cells: ['0xF0 (11110_000)', '0x9F (10_011111)', '0x9A (10_011010)', '0x80 (10_000000)'],
            match: [0, 1, 2, 3],
            inv: 'UTF-8 Self-Synchronizing Prefix Code: Leading byte 11110xxx signals 4-byte scalar; continuation bytes MUST match 10xxxxxx.',
            log: 'Encode U+1F680 (🚀 = 0x1F680): 21 payload bits pack into 4 UTF-8 bytes [0xF0, 0x9F, 0x9A, 0x80]. ASCII bytes (0xxxxxxx) never appear inside multi-byte sequences!'
          },
          {
            cells: ['inline buf[0..22] = "hello_world_sso_23bytes"', 'len/tag = 23 (MSB=0 → Inline!)'],
            match: [0, 1],
            inv: '24-Byte Small String Optimization (SSO): When len ≤ 23, characters live directly inside the 24-byte stack struct with 0 heap allocations!',
            log: 'SSO Layout (libc++ / Rust CompactString): 24-byte union stores up to 23 inline bytes on the stack, avoiding malloc() and pointer-chasing cache misses.'
          },
          {
            cells: ['ptr = 0x7ff8a400 (8B)', 'size = 64 (8B)', 'cap = 128 | MSB=1 (8B)'],
            match: [0, 1, 2],
            inv: 'Heap Promotion (> 23 bytes): Setting the capacity MSB tag bit switches the 24-byte union to {ptr, size, cap} pointing to a heap buffer.',
            log: 'When string grows past 23 bytes, SSO transitions seamlessly to a 24-byte {ptr, len, cap} descriptor.'
          }
        ];
        return steps.map((st, idx) => ({
          stageHtml: renderArrayCells(st.cells, { match: st.match }),
          invariant: st.inv,
          metrics: [
            { label: 'Representation', value: idx === 0 ? 'UTF-8 4-Byte Code Point' : '24-Byte Inline SSO' },
            { label: 'Heap Allocations', value: '0 (Inline Stack)' },
            { label: 'Self-Synchronizing?', value: 'Yes (10xxxxxx continuation)' }
          ],
          log: st.log
        }));
      }

      if (preset.mode === 'radix') {
        const steps = [
          {
            nodes: ['(root)', '--"romane"--> [★]', '--"romanus"--> [★]'],
            active: [0, 1, 2],
            edgeSplit: 'roman',
            inv: 'Uncompressed Trie would allocate 13 unary nodes; Compressed Radix Tree shares prefix "roman" in 1 internal node!',
            cnt: '3 Radix Nodes (vs 9 Trie Nodes)',
            log: 'Radix Tree holding {"romane", "romanus"}: root --"roman"--> internal node --{"e", "us"}--> leaves.'
          },
          {
            nodes: ['(root)', '--"r"--> (split #1)', '--"oman"--> {"e","us"}', '--"ubens"--> [★]'],
            match: [1, 3],
            active: [0, 2],
            edgeSplit: 'r',
            inv: 'Insert("rubens"): LCP("roman", "rubens") = "r". Split edge "roman" into "r" → "oman" and attach new leaf edge "ubens"!',
            cnt: '5 Radix Nodes (≤ 2K − 1 = 5)',
            log: 'Split edge "roman" after common prefix "r": created internal node with branches "oman" and "ubens".'
          },
          {
            nodes: ['(root)', '--"r"--> (Node4)', '--"om"--> {"ane","anus","ulus"}', '--"ubens"--> [★]'],
            match: [2],
            active: [0, 1, 3],
            edgeSplit: 'r → om',
            inv: 'Insert("romulus"): LCP("oman", "omulus") = "om". Split "oman" into "om" → {"ane","anus"} and attach "ulus"! Total nodes ≤ 2K − 1.',
            cnt: '7 Radix Nodes (for K=4 keys)',
            log: 'Insert("romulus"): split edge "oman" at "om" and add leaf "ulus".'
          }
        ];

        return steps.map((st, idx) => {
          const svg = `
            <svg viewBox="0 0 620 115" style="width:100%;max-height:120px;display:block;margin-bottom:8px;background:rgba(15,23,42,0.45);border:1px solid var(--border-subtle,#334155);border-radius:8px;">
              <circle cx="60" cy="58" r="18" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1.5"/>
              <text x="60" y="62" fill="#e2e8f0" font-size="10" font-family="monospace" text-anchor="middle">root</text>
              <line x1="78" y1="58" x2="210" y2="58" stroke="#10b981" stroke-width="2"/>
              <text x="144" y="48" fill="#6ee7b7" font-size="11" font-family="monospace" text-anchor="middle">"${st.edgeSplit}"</text>
              <circle cx="228" cy="58" r="18" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1.5"/>
              <text x="228" y="62" fill="#e2e8f0" font-size="10" font-family="monospace" text-anchor="middle">split</text>
              <line x1="246" y1="50" x2="410" y2="28" stroke="#38bdf8" stroke-width="1.6"/>
              <text x="328" y="28" fill="#bae6fd" font-size="10.5" font-family="monospace" text-anchor="middle">${idx === 0 ? '"e" → ★' : '"oman" → {"e","us"} ★'}</text>
              <line x1="246" y1="66" x2="410" y2="88" stroke="#f59e0b" stroke-width="1.6"/>
              <text x="328" y="96" fill="#fde68a" font-size="10.5" font-family="monospace" text-anchor="middle">${idx === 0 ? '"us" → ★' : '"ubens" → ★'}</text>
            </svg>
          `;
          return {
            stageHtml: svg + renderArrayCells(st.nodes, { active: st.active, match: st.match }),
            invariant: st.inv,
            metrics: [
              { label: 'Keys Stored (K)', value: `${idx + 2}` },
              { label: 'Node Count', value: st.cnt },
              { label: 'Max Nodes Bound', value: '≤ 2K − 1 (Independent of |S|!)' }
            ],
            log: st.log
          };
        });
      }

      // Default preset: Bitwise 0/1 Binary Trie Greedy Opposite-Bit Walk
      const steps = [
        { bit: 3, qBit: 0, want: 1, got: 1, path: '1___₂', xor: '1___₂ (≥ 8)', note: 'MSB b=3: Query x=5 (0101₂) has bit 0. Greedy opposite bit 1 exists in Trie! Take branch 1.' },
        { bit: 2, qBit: 1, want: 0, got: 1, path: '11__₂', xor: '10__₂', note: 'Bit b=2: Query has bit 1, wants 0, but only branch 1 exists under [1*]. Forced to take 1 (XOR bit = 0).' },
        { bit: 1, qBit: 0, want: 1, got: 0, path: '110_₂', xor: '100_₂', note: 'Bit b=1: Query has bit 0, wants 1, takes available branch 0 -> prefix 110_₂.' },
        { bit: 0, qBit: 1, want: 0, got: 0, path: '1100₂ (12)', xor: '1001₂ (9)', note: 'LSB b=0: Query has bit 1, opposite bit 0 exists! Matched y=12 (1100₂), max XOR = 5 ⊕ 12 = 9.' }
      ];
      return steps.map((st, idx) => {
        const svg = `
          <svg viewBox="0 0 620 110" style="width:100%;max-height:115px;display:block;margin-bottom:8px;background:rgba(15,23,42,0.45);border:1px solid var(--border-subtle,#334155);border-radius:8px;">
            <text x="16" y="22" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold">Bitwise 0/1 Trie Path for Query x = 0101₂ (5) vs Set {0010₂(2), 0111₂(7), 1100₂(12)}:</text>
            ${['root', 'b3=1', 'b2=1', 'b1=0', 'b0=0 (y=12)'].map((lbl, k) => {
              const activeNode = k <= idx + 1;
              return `
                <rect x="${20 + k * 116}" y="42" width="96" height="36" rx="18" fill="${activeNode ? 'rgba(16,185,129,0.22)' : 'rgba(30,41,59,0.5)'}" stroke="${activeNode ? '#10b981' : '#475569'}" stroke-width="1.5"/>
                <text x="${68 + k * 116}" y="64" fill="#e2e8f0" font-size="10.5" font-family="monospace" text-anchor="middle">${lbl}</text>
                ${k < 4 ? `<text x="${122 + k * 116}" y="64" fill="${k <= idx ? '#10b981' : '#64748b'}" font-size="12" font-family="monospace">→</text>` : ''}
              `;
            }).join('')}
            <text x="310" y="98" fill="#a7f3d0" font-size="11" font-family="monospace" text-anchor="middle">Step b=${st.bit}: x_b=${st.qBit} wants opposite bit ${st.want} → took ${st.got} (XOR bit = ${st.qBit ^ st.got})</text>
          </svg>
        `;
        return {
          stageHtml: svg + renderArrayCells(['b3: 0', 'b2: 1', 'b1: 0', 'b0: 1'], {
            match: [3 - st.bit],
            tags: { [3 - st.bit]: `want=${st.want}, got=${st.got}` }
          }),
          invariant: `Greedy MSB-First Choice: 2^b > ∑_{i=0}^{b-1} 2^i -> winning bit b dominates all lower bits combined!`,
          metrics: [
            { label: 'Query x', value: '5 (0101₂)' },
            { label: 'Bit Level b', value: `b = ${st.bit}` },
            { label: 'Chosen Path y', value: st.path },
            { label: 'Accumulated x ⊕ y', value: st.xor }
          ],
          log: st.note
        };
      });
    }
  });
  window.SIMULATORS['sim-trie-radix'] = window.SIMULATORS['sim-trie-radix-bitwise'];

  // ───────────────────────────────────────────────────────────────
  // 2. Rabin-Karp Rolling Hash Ring & Boyer-Moore-Horspool / Teddy SIMD
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-rabin-karp-rolling-hash'] = createStepSimulator({
    id: 'sim-rabin-karp-rolling-hash',
    aliases: ['sim-boyer-moore-horspool', 'sim-teddy-simd'],
    title: 'Rabin-Karp Polynomial Rolling Hash Ring & Boyer-Moore-Horspool / Teddy SIMD Skip',
    badge: 'O(1) Rolling Hash · O(N/M) Horspool Skip',
    badgeClass: 'badge-on',
    blurb: 'Trace Rabin-Karp O(1) modular window slides H_{i+1} = ((H_i − T[i]·B^{m−1})·B + T[i+m]) mod P, Boyer-Moore-Horspool right-to-left bad-character skips, and ripgrep Teddy 16-byte SIMD nybble-mask filtering.',
    slugs: [
      'rabin-karp-polynomial-rolling-hash',
      'boyer-moore-horspool-fast-skip',
      'case-ripgrep-teddy-simd-aho-corasick',
      'boyer-moore-horspool-simd',
      'case-ripgrep-teddy-simd'
    ],
    presets: [
      { id: 'rk', label: 'Rabin-Karp O(1) Rolling Hash Slide H_{i+1} = ((H_i − T[i]B^{m−1})B + T[i+m]) mod P', mode: 'rk' },
      { id: 'bmh', label: 'Boyer-Moore-Horspool Bad-Character Table Jump (skip = m − 1 − last[c])', mode: 'bmh' },
      { id: 'teddy', label: 'ripgrep Teddy SIMD 16-Byte Nybble Mask Fingerprint Filter', mode: 'teddy' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'bmh') {
        const T = ['T', 'H', 'E', '_', 'N', 'E', 'E', 'D', 'L', 'E'];
        const steps = [
          {
            pos: 0,
            win: [0, 1, 2, 3, 4, 5],
            warn: [5],
            skip: 'last[\'E\'] = 4 → skip = 5 − 4 = 1',
            inv: 'Align P="NEEDLE" (m=6) at i=0..5: compare right-to-left T[5]=\'E\' != P[5]=\'E\'? Wait: T[5]=\'E\' == P[5]=\'E\', T[4]=\'N\' != P[4]=\'L\'! Horspool shifts by T[5]=\'E\' (skip = 5 − 4 = 1).',
            log: 'Window [0..5] ("THE_NE"): mismatch inside window; Horspool consults last[T[5]=\'E\'] = 4 -> shifts window by 5 − 4 = 1.'
          },
          {
            pos: 1,
            win: [1, 2, 3, 4, 5, 6],
            warn: [6],
            skip: 'T[6]=\'E\' → shift to i=4 (full skip over non-pattern chars)',
            inv: 'Horspool Bad-Character Rule: shift[c] = m − 1 − last_index_in_P_prefix(c) (or m if c ∉ P[0..m−2]).',
            log: 'Window advances to i=4 where T[4..9] = "NEEDLE" aligns with pattern.'
          },
          {
            pos: 4,
            win: [4, 5, 6, 7, 8, 9],
            match: [4, 5, 6, 7, 8, 9],
            skip: 'EXACT MATCH at i=4!',
            inv: 'Right-to-Left Verification: P[5..0] == T[9..4] ("NEEDLE") matched in sublinear O(N/M) average comparisons!',
            log: 'Window [4..9]: right-to-left check E-L-D-E-E-N matches all 6 characters! Match reported at index 4.'
          }
        ];

        return steps.map((st) => ({
          stageHtml: renderArrayCells(T, {
            active: st.win,
            match: st.match || [],
            warn: st.warn || [],
            tags: { [st.pos]: 'P[0]', [st.pos + 5]: 'P[5] ( anchor )' }
          }),
          invariant: st.inv,
          metrics: [
            { label: 'Pattern P (m=6)', value: '"NEEDLE"' },
            { label: 'Window Range', value: `[${st.pos}..${st.pos + 5}]` },
            { label: 'Bad-Char Shift', value: st.skip },
            { label: 'Avg Complexity', value: 'O(N / M) Sublinear' }
          ],
          log: st.log
        }));
      }

      if (preset.mode === 'teddy') {
        const steps = [
          {
            stage: 'Step 1: Load 16 Text Bytes into XMM Register & Split Low/High 4-Bit Nybbles',
            lanes: ['u', 's', 'r', '/', 'b', 'i', 'n', '/', 'b', 'a', 's', 'h', ' ', '-', 'c', ' '],
            active: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            inv: 'SIMD Parallelism: _mm_shuffle_epi8 (pshufb) acts as a 16-way parallel 16-entry lookup table on 4-bit nybbles in 1 CPU cycle!',
            log: 'Load 16 text bytes at once; extract lo_nybble = chunk & 0x0F and hi_nybble = (chunk >> 4) & 0x0F.'
          },
          {
            stage: 'Step 2: Intersect Nybble Masks across 3 Fingerprint Positions (pos 0, 1, 2)',
            lanes: ['0', '0', '0', '0', '0', '0', '0', '0', 'HIT!', '0', '0', '0', '0', '0', '0', '0'],
            match: [8, 9, 10, 11],
            inv: 'Candidate Bitmask: res = mask0 & (mask1 >> 1) & (mask2 >> 2) isolates lane 8 ("bash") -> verify in Aho-Corasick!',
            log: '_mm_movemask_epi8 produces non-zero candidate bit only at lane 8 ("bash"); 15 non-matching positions skipped in 1 SIMD pass!'
          },
          {
            stage: 'Step 3: Extract Lane via tzcnt(mask) & Confirm Exact Literal Match',
            lanes: ['·', '·', '·', '·', '·', '·', '·', '·', 'b', 'a', 's', 'h', '·', '·', '·', '·'],
            match: [8, 9, 10, 11],
            inv: 'Verification: tzcnt(0x0100) = 8 jumps straight to T[8..11] = "bash", confirming exact match and advancing the 16-byte SIMD window!',
            log: 'Verified candidate at offset 8 ("bash") in 1 branchless check; advance SIMD pointer by 16 bytes.'
          }
        ];
        return steps.map((st) => ({
          stageHtml: renderArrayCells(st.lanes, { active: st.active || [], match: st.match || [] }),
          invariant: st.inv,
          metrics: [
            { label: 'SIMD Register Width', value: '128-bit SSE / 256-bit AVX2' },
            { label: 'Instruction', value: '_mm_shuffle_epi8 (pshufb)' },
            { label: 'Candidate Lanes', value: st.match ? 'Lane [8] ("bash")' : 'Scanning 16B' },
            { label: 'Throughput', value: '> 10 GB/s' }
          ],
          log: st.log
        }));
      }

      // Default preset: Rabin-Karp Rolling Hash
      const T = ['3', '1', '4', '1', '5', '9', '2'];
      const steps = [
        {
          i: 0,
          win: '314',
          h: '314 mod 97 = 23',
          formula: 'H₀ = (3·10² + 1·10¹ + 4) mod 97 = 23 (Target H("159") = 159 mod 97 = 62)',
          match: false,
          log: 'Initial window T[0..2] = "314": polynomial hash H₀ = 314 mod 97 = 23 != H("159") = 62.'
        },
        {
          i: 1,
          win: '141',
          h: '141 mod 97 = 44',
          formula: 'H₁ = ((23 − 3·100) · 10 + 1) mod 97 = 141 mod 97 = 44 != 62',
          match: false,
          log: 'Slide i=0→1 ("141"): subtract leading 3·10², multiply by base 10, add trailing 1 -> H₁ = 44 in O(1) ops!'
        },
        {
          i: 2,
          win: '415',
          h: '415 mod 97 = 27',
          formula: 'H₂ = ((44 − 1·100) · 10 + 5) mod 97 = 415 mod 97 = 27 != 62',
          match: false,
          log: 'Slide i=1→2 ("415"): evict \'1\', shift ×10, append \'5\' -> H₂ = 27 != 62.'
        },
        {
          i: 3,
          win: '159',
          h: '159 mod 97 = 62 == H(P)!',
          formula: 'H₃ = ((27 − 4·100) · 10 + 9) mod 97 = 159 mod 97 = 62 == H("159") → MATCH!',
          match: true,
          log: 'Slide i=2→3 ("159"): rolling hash H₃ = 62 matches target H(P) = 62! Exact substring verified at index 3.'
        }
      ];

      return steps.map((st) => ({
        stageHtml: renderArrayCells(T, {
          active: st.match ? [] : [st.i, st.i + 1, st.i + 2],
          match: st.match ? [st.i, st.i + 1, st.i + 2] : [],
          tags: { [st.i]: 'evict next', [st.i + 2]: `H=${st.h.split(' ')[0]}` }
        }),
        invariant: `Rolling Hash Recurrence: ${st.formula}`,
        metrics: [
          { label: 'Target Pattern P', value: '"159" (H(P) = 62)' },
          { label: 'Active Window', value: `T[${st.i}..${st.i + 2}] = "${st.win}"` },
          { label: 'Window Hash H_i', value: st.h },
          { label: 'Update Cost', value: 'O(1) Modular Ops' }
        ],
        log: st.log
      }));
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 3. KMP Prefix Function π[i] & Z-Algorithm [L, R] Z-Box
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-kmp-z-automaton'] = createStepSimulator({
    id: 'sim-kmp-z-automaton',
    aliases: ['sim-kmp-z-rabin-karp'],
    title: 'KMP Prefix Function π[i], Z-Box [L, R] & Linear Automaton Stepper',
    badge: 'Guaranteed O(N + M) Linear Time',
    badgeClass: 'badge-on',
    blurb: 'Trace how KMP never backs up the text pointer (using π[j−1] fallback borders with potential Φ = j ≤ i) and how the Z-Algorithm reuses previously matched [L, R] Z-boxes.',
    slugs: [
      'kmp-prefix-function-automaton',
      'z-algorithm-zbox-linear-time',
      'z-algorithm-linear-box'
    ],
    presets: [
      { id: 'kmp', label: 'KMP Prefix Table π[i] on P = "ABABCABAB"', mode: 'kmp' },
      { id: 'zbox', label: 'Z-Algorithm [L, R] Box Reuse on S = "aabcaabxaaaz"', mode: 'zbox' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'zbox') {
        const S = ['a', 'a', 'b', 'c', 'a', 'a', 'b', 'x', 'a', 'a', 'a', 'z'];
        const zSteps = [
          {
            i: 1, L: 1, R: 1, z: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            note: 'i=1: outside Z-box -> naive match S[1..1]="a" == S[0..0]="a" -> Z[1]=1, update Z-box [L,R] = [1,1].'
          },
          {
            i: 4, L: 4, R: 6, z: [0, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
            note: 'i=4: S[4..6]="aab" matches prefix S[0..2]="aab" -> Z[4]=3! New rightmost Z-box [L,R] = [4,6].'
          },
          {
            i: 5, L: 4, R: 6, z: [0, 1, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0],
            note: 'i=5 ≤ R=6 (Inside Z-box!): mirror index k = i − L = 1 has Z[1] = 1 < R − i + 1 = 2 -> copy Z[5] = Z[1] = 1 in O(1) without character comparisons!'
          },
          {
            i: 8, L: 8, R: 10, z: [0, 1, 0, 0, 3, 1, 0, 0, 3, 2, 1, 0],
            note: 'i=8..10 ("aaaz"): Z[8]=3 opens Z-box [8,10]; i=9 and i=10 reuse Z-box values. Right endpoint R advances ≤ N times -> O(N) total!'
          }
        ];

        return zSteps.map((st) => {
          const boxIndices = [];
          for (let k = st.L; k <= st.R; k++) boxIndices.push(k);
          const tags = {};
          st.z.forEach((v, k) => { if (k <= st.i || v > 0) tags[k] = `Z=${v}`; });
          return {
            stageHtml: renderArrayCells(S, {
              active: boxIndices,
              pivot: [st.i],
              match: [0, 1, 2],
              tags
            }),
            invariant: `Z-Box Invariant: S[L..R] = S[${st.L}..${st.R}] equals prefix S[0..${st.R - st.L}]. For i ∈ [L, R], Z[i] ≥ min(Z[i − L], R − i + 1).`,
            metrics: [
              { label: 'Current Index i', value: `i = ${st.i} ('${S[st.i]}')` },
              { label: 'Active Z-Box [L, R]', value: `[${st.L}, ${st.R}]` },
              { label: 'Mirror k = i − L', value: `k = ${st.i - st.L}` },
              { label: 'Computed Z[i]', value: `${st.z[st.i]}` }
            ],
            log: st.note
          };
        });
      }

      const P = ['A', 'B', 'A', 'B', 'C', 'A', 'B', 'A', 'B'];
      const pi = [0, 0, 1, 2, 0, 1, 2, 3, 4];
      const notes = [
        'i=0 ("A"): base case π[0] = 0.',
        'i=1 ("AB"): P[1]="B" != P[0]="A" -> π[1] = 0.',
        'i=2 ("ABA"): P[2]="A" == P[0]="A" -> border "A", π[2] = 1.',
        'i=3 ("ABAB"): P[3]="B" == P[1]="B" -> border "AB", π[3] = 2.',
        'i=4 ("ABABC"): P[4]="C" != P[2]="A"; fallback j = π[1] = 0; P[4] != P[0] -> π[4] = 0.',
        'i=5 ("ABABCA"): P[5]="A" == P[0]="A" -> π[5] = 1.',
        'i=6 ("ABABCAB"): P[6]="B" == P[1]="B" -> π[6] = 2.',
        'i=7 ("ABABCABA"): P[7]="A" == P[2]="A" -> π[7] = 3.',
        'i=8 ("ABABCABAB"): P[8]="B" == P[3]="B" -> border "ABAB" of length 4! π[8] = 4.'
      ];

      return P.map((_, i) => {
        const curPi = pi[i];
        const match = [];
        for (let k = 0; k < curPi; k++) match.push(k);
        const tags = {};
        for (let k = 0; k <= i; k++) tags[k] = `π=${pi[k]}`;
        return {
          stageHtml: renderArrayCells(P, {
            match,
            pivot: [i],
            active: Array.from({ length: i }, (_, k) => k),
            tags
          }),
          invariant: `Amortized Potential Φ = j = ${curPi} ≥ 0 | j increments at most once per step i, so fallback j = π[j−1] runs ≤ N times total!`,
          metrics: [
            { label: 'Index i / Char', value: `i = ${i} ('${P[i]}')` },
            { label: 'Border Length π[i]', value: `${curPi}` },
            { label: 'Matched Prefix', value: curPi ? `"${P.slice(0, curPi).join('')}"` : 'ε (empty)' },
            { label: 'Total Work', value: 'O(M) Linear' }
          ],
          log: notes[i]
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 4. Aho-Corasick Multi-Pattern Automaton & Manacher / Eertree
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-aho-corasick-trie'] = createStepSimulator({
    id: 'sim-aho-corasick-trie',
    aliases: ['sim-aho-corasick-automaton', 'sim-aho-corasick', 'sim-thompson-nfa-vs-backtrack'],
    title: 'Aho-Corasick Multi-Pattern DFA (Failure + Output Links) & Manacher / Eertree',
    badge: 'O(N + ∑|P_i| + Z) Multi-Pattern · O(N) Palindromes',
    badgeClass: 'badge-on',
    blurb: 'Scan text T = "ushers" in a single pass against dictionary {"he", "she", "his", "hers"} using BFS failure links and output links, or trace Manacher’s O(N) palindrome radius mirroring & Eertree dual roots.',
    slugs: [
      'aho-corasick-multi-pattern-dfa',
      'manacher-palindromic-tree-eertree',
      'build-aho-corasick-matcher',
      'aho-corasick-trie-automaton',
      'manacher-palindromic-tree',
      'build-aho-corasick-scanner'
    ],
    presets: [
      { id: 'ac', label: 'Aho-Corasick Scan T = "ushers" on {"he", "she", "his", "hers"}', mode: 'ac' },
      { id: 'manacher', label: 'Manacher Palindrome Radius p[i] Mirroring & Eertree Dual Roots', mode: 'manacher' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'manacher') {
        const T = ['#', 'a', '#', 'b', '#', 'a', '#', 'b', '#', 'a', '#'];
        const steps = [
          {
            i: 3, C: 3, R: 6, p: [0, 1, 0, 3, 0, 0, 0, 0, 0, 0, 0],
            inv: 'Center i=3 (\'b\'): expands to "#a#b#a#" (radius p[3]=3), establishing rightmost palindrome bounding box [L, R] = [0, 6].',
            log: 'Expand around i=3 ("aba"): radius p[3] = 3 sets center C = 3, right boundary R = 6.'
          },
          {
            i: 5, C: 5, R: 10, p: [0, 1, 0, 3, 0, 5, 0, 0, 0, 0, 0],
            inv: 'Center i=5 (\'a\') ≤ R=6: initialize p[5] ≥ min(R − i, p[2C − i]) = min(1, p[1]=1) = 1, then expand beyond R to radius 5 ("ababa")!',
            log: 'Mirror i\' = 2(3) − 5 = 1 gives seed p[5] ≥ 1; character comparisons only occur past R=6, advancing R to 10!'
          },
          {
            i: 7, C: 5, R: 10, p: [0, 1, 0, 3, 0, 5, 0, 3, 0, 1, 0],
            inv: 'Center i=7 (\'b\'): mirror i\' = 2(5) − 7 = 3 has p[3] = 3 == R − i -> p[7] = 3 ("aba"). Eertree stores all distinct palindromes in ≤ N+2 states!',
            log: 'Mirror i\'=3 gives p[7]=3 in O(1); Eertree links "ababa" --suffix_link--> "aba" --suffix_link--> "a" -> root(0) -> root(-1).'
          }
        ];

        return steps.map((st) => {
          const span = [];
          for (let k = st.i - st.p[st.i]; k <= st.i + st.p[st.i]; k++) {
            if (k >= 0 && k < T.length) span.push(k);
          }
          const tags = {};
          st.p.forEach((v, k) => { if (v > 0) tags[k] = `p=${v}`; });
          return {
            stageHtml: renderArrayCells(T, {
              active: span,
              pivot: [st.i],
              match: [st.C],
              tags
            }),
            invariant: st.inv,
            metrics: [
              { label: 'Center i / Mirror i\'', value: `i = ${st.i} / i' = ${2 * st.C - st.i}` },
              { label: 'Bounding Box [C, R]', value: `C = ${st.C}, R = ${st.R}` },
              { label: 'Radius p[i]', value: `p[${st.i}] = ${st.p[st.i]}` },
              { label: 'Eertree States', value: '≤ N + 2 States' }
            ],
            log: st.log
          };
        });
      }

      const T = ['u', 's', 'h', 'e', 'r', 's'];
      const trace = [
        { i: 0, state: 'root ("")', fail: 'root', out: '∅', log: 'Read "u": no "u" edge from root -> stay at root.' },
        { i: 1, state: '"s"', fail: 'root', out: '∅', log: 'Read "s": transition root --s--> state("s").' },
        { i: 2, state: '"sh"', fail: '"h"', out: '∅', log: 'Read "h": transition "s" --h--> state("sh"). Failure link points to state("h")!' },
        { i: 3, state: '"she"', fail: '"he"', out: '{"she", "he"}!', log: 'Read "e": transition "sh" --e--> state("she")! Output link chains to "he" -> emits BOTH "she" and "he" at i=3!' },
        { i: 4, state: '"her"', fail: 'root', out: '∅', log: 'Read "r": state("she") has no "r" edge -> follow fail("she") = state("he"), then transition "he" --r--> state("her")!' },
        { i: 5, state: '"hers"', fail: '"s"', out: '{"hers"}!', log: 'Read "s": transition "her" --s--> state("hers")! Emits match "hers" at i=5.' }
      ];

      return trace.map((st) => ({
        stageHtml: renderArrayCells(T, {
          active: Array.from({ length: st.i }, (_, k) => k),
          match: st.out !== '∅' ? [st.i] : [],
          pivot: [st.i],
          tags: { [st.i]: `state=${st.state}` }
        }),
        invariant: `Active Trie State = ${st.state} | Failure Suffix Link fail(u) = ${st.fail} | Emitted Matches = ${st.out}`,
        metrics: [
          { label: 'Text Index i', value: `i = ${st.i} ('${T[st.i]}')` },
          { label: 'Automaton State', value: st.state },
          { label: 'fail(state)', value: st.fail },
          { label: 'Output Matches', value: st.out }
        ],
        log: st.log
      }));
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 5. Suffix Array + Kasai LCP & Suffix Automaton (SAM)
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-suffix-array-sam'] = createStepSimulator({
    id: 'sim-suffix-array-sam',
    aliases: ['sim-suffix-array-lcp'],
    title: 'Suffix Array, Kasai O(N) LCP Array & Suffix Automaton (SAM)',
    badge: 'SA + Kasai LCP O(N) · ≤ 2N−1 SAM States',
    badgeClass: 'badge-on',
    blurb: 'Inspect the sorted Suffix Array and Kasai’s LCP[i] invariant (h ≥ LCP[rank[i]−1] − 1) on S = "banana$", or step through Suffix Automaton (SAM) endpos equivalence classes and state-splitting on "abcbc".',
    slugs: [
      'suffix-array-prefix-doubling-sais',
      'lcp-array-kasai-lce-queries',
      'ukkonen-suffix-tree-linear',
      'suffix-automaton-sam-endpos',
      'generalized-suffix-structures',
      'build-suffix-automaton',
      'suffix-trees-ukkonen-intuition',
      'suffix-arrays-prefix-doubling-sais',
      'kasai-lcp-array-rmq'
    ],
    presets: [
      { id: 'banana', label: 'Suffix Array + Kasai LCP on "banana$"', mode: 'sa' },
      { id: 'sam', label: 'Suffix Automaton endpos Equivalence Classes & State-Split on "abcbc"', mode: 'sam' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'sam') {
        const steps = [
          {
            states: ['q0: ε (len=0)', 'q1: "a" (len=1)', 'q2: "ab" (len=2)', 'q3: "abc" (len=3)'],
            match: [3],
            inv: 'Extend "abc": each prefix creates state cur with len(cur) = len(last)+1 and link(cur) = q0 (since "a","b","c" are distinct).',
            log: 'After reading "abc": 4 SAM states q0..q3; endpos("abc") = {2}, link(q3) = q0.'
          },
          {
            states: ['q0: ε', 'q2: "ab" (endpos={1,3})', 'q3: "abc"', 'q4: "abcb" (len=4, link=q2)'],
            match: [1, 3],
            inv: 'Extend \'b\' ("abcb"): q0 has transition --b--> q2 ("ab", len=2), but len(q0)+1 = 1 != len(q2) = 2! Must CLONE q2 into q_clone!',
            log: 'Reading second \'b\': state q2 represents {"ab", "b"}, but only "b" occurs at endpos {1, 3} while "ab" only occurs at {1}!'
          },
          {
            states: ['q_clone: "b" (len=1, end={1,3})', 'q2: "ab" (len=2, link=clone)', 'q4: "abcb" (link=clone)', 'q5: "abcbc" (len=5)'],
            match: [0, 3],
            inv: 'SAM State-Split Theorem: Cloning q into q_clone (len = len(p)+1) separates shortest substrings from longer ones; total states ≤ 2N − 1!',
            log: 'Created q_clone for {"b"} (len=1), redirected suffix links of q2 and q4 to q_clone, then extended \'c\' to complete SAM for "abcbc".'
          }
        ];

        return steps.map((st, idx) => ({
          stageHtml: renderArrayCells(st.states, { match: st.match, active: [0, 1, 2, 3] }),
          invariant: st.inv,
          metrics: [
            { label: 'Input String', value: '"abcbc" (N = 5)' },
            { label: 'Max SAM States', value: '≤ 2N − 1 = 9' },
            { label: 'Max SAM Edges', value: '≤ 3N − 4 = 11' },
            { label: 'Phase', value: `${idx + 1} / ${steps.length}` }
          ],
          log: st.log
        }));
      }

      const sa = [
        { idx: 6, suf: '$', lcp: 0 },
        { idx: 5, suf: 'a$', lcp: 0 },
        { idx: 3, suf: 'ana$', lcp: 1 },
        { idx: 1, suf: 'anana$', lcp: 3 },
        { idx: 0, suf: 'banana$', lcp: 0 },
        { idx: 4, suf: 'na$', lcp: 0 },
        { idx: 2, suf: 'nana$', lcp: 2 }
      ];

      const steps = [
        { focus: 3, note: 'Kasai at i=0 ("banana$"): rank=4, predecessor is "anana$" -> LCP = 0.' },
        { focus: 3, match: [2, 3], note: 'Kasai at i=1 ("anana$"): rank=3, predecessor is "ana$" -> matches "ana", LCP[3] = 3!' },
        { focus: 6, match: [5, 6], note: 'Kasai at i=2 ("nana$"): by Kasai theorem, LCP ≥ prev_LCP − 1 = 3 − 1 = 2 ("na" already guaranteed to match without re-comparing!).' },
        { focus: 2, match: [1, 2], note: 'Distinct Substrings of "banana" (N=6): N(N+1)/2 − ∑ LCP = 21 − (0+1+3+0+0+2) = 15 distinct substrings!' }
      ];

      return steps.map((st, idx) => {
        const vals = sa.map(r => `SA=${r.idx} "${r.suf}"`);
        const tags = {};
        sa.forEach((r, i) => { tags[i] = `LCP=${r.lcp}`; });
        return {
          stageHtml: renderArrayCells(vals, {
            active: [0, 1, 2, 3, 4, 5, 6],
            match: st.match || [st.focus],
            tags
          }),
          invariant: `Kasai Invariant: LCP[rank[i]] ≥ LCP[rank[i−1]] − 1 (h decrements ≤ N times, increments ≤ N times -> O(N) total!)`,
          metrics: [
            { label: 'String S', value: '"banana$" (N = 6)' },
            { label: '∑ LCP[i]', value: '0 + 1 + 3 + 0 + 0 + 2 = 6' },
            { label: 'Distinct Substrings', value: '21 − 6 = 15' },
            { label: 'Step', value: `${idx + 1} / ${steps.length}` }
          ],
          log: st.note
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 6. Burrows-Wheeler Transform (BWT), FM-Index & Thompson NFA
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-bwt-fm-index'] = createStepSimulator({
    id: 'sim-bwt-fm-index',
    aliases: ['sim-fm-index', 'sim-thompson-nfa'],
    title: 'Burrows-Wheeler Transform (BWT) Rotation Matrix, FM-Index LF-Mapping & Thompson NFA',
    badge: 'O(|P|) FM-Index Backward Search · O(NM) Thompson NFA',
    badgeClass: 'badge-on',
    blurb: 'Trace the sorted cyclic rotation matrix of "banana$", LF-mapping rank queries shrinking [sp, ep] backward for P = "ana", and Ken Thompson’s lockstep NFA state-set simulation O(NM) vs O(2^N) backtracking ReDoS.',
    slugs: [
      'bwt-fm-index-wavelet-trees',
      'thompson-nfa-regex-engine',
      'burrows-wheeler-transform-fm-index',
      'thompson-nfa-vs-backtracking-regex',
      'build-thompson-nfa-regex-engine'
    ],
    presets: [
      { id: 'bwt', label: 'BWT Sorted Cyclic Rotations & FM-Index Backward Search [sp, ep] on "banana$"', mode: 'bwt' },
      { id: 'nfa', label: 'Thompson NFA Lockstep State-Set Simulation O(NM) vs Backtracking O(2^N) on "a?a?a?aaa"', mode: 'nfa' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'nfa') {
        const steps = [
          {
            step: 'Read T[0] = \'a\'',
            clist: ['q0 (a?)', 'q1 (a?)', 'q2 (a?)', 'q3 (a)'],
            active: [0, 1, 2, 3],
            btOps: '8 paths',
            nfaOps: '4 states',
            inv: 'Thompson Lockstep Invariant: Deduplicate active NFA states via step_id generation counter -> |clist| ≤ M states at all times!',
            log: 'Initial ε-closure of (a?)(a?)(a?)aaa holds 4 states {q0, q1, q2, q3}; consuming \'a\' advances all 4 in parallel.'
          },
          {
            step: 'Read T[1] = \'a\'',
            clist: ['q1 (a?)', 'q2 (a?)', 'q3 (a)', 'q4 (a)', 'q5 (a)'],
            active: [0, 1, 2, 3, 4],
            btOps: '16 paths',
            nfaOps: '5 states',
            inv: 'State-Set Deduplication: Multiple ε-paths reaching q3 or q4 collapse into a single entry in nlist because last_list[s] == list_id!',
            log: 'Consuming second \'a\' transitions {q0..q3} -> deduplicated set {q1, q2, q3, q4, q5} (5 states).'
          },
          {
            step: 'Read T[2] = \'a\' (Accept!)',
            clist: ['q2 (a?)', 'q3 (a)', 'q4 (a)', 'q5 (a)', 'q6 (MATCH!)'],
            active: [0, 1, 2, 3],
            match: [4],
            btOps: '2^N (Catastrophic ReDoS on mismatch!)',
            nfaOps: '≤ 6 states / char (Strict O(N·M))',
            inv: 'Guarantee: Even on adversarial input (a?)^{30}a^{30} where PCRE backtracking hangs in 2³⁰ ≈ 10⁹ steps, Thompson NFA finishes in 30 × 60 = 1,800 steps!',
            log: 'After reading "aaa", state q6 (MATCH) is in clist -> accept immediately in linear O(NM) time!'
          }
        ];

        return steps.map((st) => ({
          stageHtml: renderArrayCells(st.clist, { active: st.active, match: st.match || [] }),
          invariant: st.inv,
          metrics: [
            { label: 'Regex / Input', value: 'a?a?a?aaa on "aaa"' },
            { label: 'Active NFA States', value: st.nfaOps },
            { label: 'Backtracking Paths', value: st.btOps },
            { label: 'ReDoS Vulnerable?', value: 'No (Guaranteed O(NM))' }
          ],
          log: st.log
        }));
      }

      // BWT & FM-Index Backward Search on "banana$"
      const rows = [
        '0: $banan [a]',
        '1: a$bana [n]',
        '2: ana$ba [n]',
        '3: anana$ [b]',
        '4: banana [$]',
        '5: na$ban [a]',
        '6: nana$b [a]'
      ];
      const steps = [
        {
          sp: 0, ep: 6, pat: '"a" (P[2])',
          match: [1, 2, 3],
          inv: 'BWT(banana$) = L = "annb$aa" (runs of "nn" and "aa" compress via RLE/MTF!). Backward search starts at P[2]=\'a\': C[\'a\']=1, range [sp, ep] = [1, 3].',
          log: 'Step 1 (char \'a\'): C[\'a\'] = 1, Occ(\'a\', 7) = 3 -> all suffixes starting with "a" sit in SA range [1..3].'
        },
        {
          sp: 5, ep: 6, pat: '"na" (P[1..2])',
          match: [5, 6],
          inv: 'LF-Mapping Theorem: The k-th occurrence of char c in L corresponds to the exact same text character as the k-th occurrence of c in F!',
          log: 'Step 2 (prepend \'n\'): sp = C[\'n\'] + Occ(\'n\', 1) = 5 + 0 = 5; ep = C[\'n\'] + Occ(\'n\', 4) − 1 = 5 + 2 − 1 = 6 -> range [5..6] ("na$..", "nana$..").'
        },
        {
          sp: 2, ep: 3, pat: '"ana" (P[0..2]) — 2 Matches!',
          match: [2, 3],
          inv: 'Prepend \'a\': sp = C[\'a\'] + Occ(\'a\', 5) = 1 + 1 = 2; ep = C[\'a\'] + Occ(\'a\', 7) − 1 = 1 + 3 − 1 = 3. Count = ep − sp + 1 = 2 matches (SA[2]=3, SA[3]=1)!',
          log: 'Step 3 (prepend \'a\'): range narrows to [2..3] ("ana$ba", "anana$"). Found 2 occurrences in O(|P|) = 3 steps independent of text length N!'
        }
      ];

      return steps.map((st) => ({
        stageHtml: renderArrayCells(rows, { match: st.match }),
        invariant: st.inv,
        metrics: [
          { label: 'BWT Last Column L', value: '"annb$aa"' },
          { label: 'Matched Suffix of P', value: st.pat },
          { label: 'SA Interval [sp, ep]', value: `[${st.sp}, ${st.ep}] (${st.ep - st.sp + 1} rows)` },
          { label: 'Query Time', value: 'O(|P|) Backward Steps' }
        ],
        log: st.log
      }));
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 7. Myers O(ND) Edit Graph & Huffman / LZ77 Deflate Visualizer
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-myers-diff-huffman-lz77'] = createStepSimulator({
    id: 'sim-myers-diff-huffman-lz77',
    aliases: ['sim-myers-diff', 'sim-huffman-lz77'],
    title: 'Myers O(ND) Edit Graph (k-Diagonals) & Huffman Tree / LZ77 Sliding-Window Deflate',
    badge: 'O((N+M)D) Myers Diff · Huffman + LZ77',
    badgeClass: 'badge-on',
    blurb: 'Explore Eugene Myers’ k = x − y diagonal edit graph with zero-cost diagonal snakes (used by git diff), bottom-up min-heap Huffman optimal prefix code trees, and LZ77 sliding-window (distance, length) back-references.',
    slugs: [
      'huffman-arithmetic-lz77-zstd',
      'case-git-myers-histogram-diff',
      'myers-diff-hirschberg-lcs',
      'huffman-lz77-deflate'
    ],
    presets: [
      { id: 'myers', label: 'Git Myers Diff Edit Graph k = x − y Diagonals & Snake Extensions', mode: 'myers' },
      { id: 'huffman', label: 'Huffman Optimal Prefix Tree Construction from Min-Heap Frequencies', mode: 'huffman' },
      { id: 'lz77', label: 'LZ77 Sliding Window emitting (distance, length, nextChar) Triples', mode: 'lz77' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'huffman') {
        const steps = [
          {
            heap: ['\'D\':1', '\'C\':2', '\'B\':3', '\'A\':6'],
            match: [0, 1],
            inv: 'Greedy Exchange Lemma: The two lowest-frequency symbols (\'D\':1, \'C\':2) MUST be sibling leaves at the deepest level of an optimal prefix tree.',
            log: 'Pop two minimum nodes \'D\'(1) and \'C\'(2) from min-heap; merge into internal node DC(3).'
          },
          {
            heap: ['DC:3', '\'B\':3', '\'A\':6'],
            match: [0, 1],
            inv: 'Pop DC(3) and \'B\'(3) -> merge into internal node B_DC(6). Push back into min-heap.',
            log: 'Merged DC(3) and \'B\'(3) into subtree of weight 6.'
          },
          {
            heap: ['\'A\' = "0" (1b)', '\'B\' = "10" (2b)', '\'C\' = "110" (3b)', '\'D\' = "111" (3b)'],
            match: [0, 1, 2, 3],
            inv: 'Kraft’s Inequality: ∑ 2^(−ℓ_c) = 2⁻¹ + 2⁻² + 2⁻³ + 2⁻³ = 0.5 + 0.25 + 0.125 + 0.125 = 1.0! Weighted cost = 6(1)+3(2)+2(3)+1(3) = 21 bits (vs 24 bits fixed).',
            log: 'Optimal prefix-free codes assigned: A="0", B="10", C="110", D="111". Zero ambiguity without delimiters!'
          }
        ];

        return steps.map((st) => ({
          stageHtml: renderArrayCells(st.heap, { match: st.match }),
          invariant: st.inv,
          metrics: [
            { label: 'Symbol Frequencies', value: 'A:6, B:3, C:2, D:1' },
            { label: 'Kraft Sum ∑ 2^(−ℓ)', value: '1.0 (Complete Tree)' },
            { label: 'Total Encoded Bits', value: '21 bits (1.75 bits/sym)' }
          ],
          log: st.log
        }));
      }

      if (preset.mode === 'lz77') {
        const tape = ['A', 'B', 'R', 'A', 'C', 'A', 'D', 'A', 'B', 'R', 'A'];
        const steps = [
          {
            active: [0, 1, 2, 3, 4, 5, 6],
            match: [],
            tok: 'Literals: (0,0,\'A\'), (0,0,\'B\'), (0,0,\'R\'), (3,1,\'C\'), (5,1,\'D\')',
            inv: 'Search Buffer [0..6] = "ABRACAD": single-char repeats at dist=3 ("A") and dist=5 ("A").',
            log: 'Scan "ABRACAD": emit literals and short back-references into sliding search window.'
          },
          {
            active: [0, 1, 2, 3],
            match: [7, 8, 9, 10],
            tok: 'Back-Reference Token: (distance = 7, length = 4) → "ABRA"!',
            inv: 'LZ77 Sliding Window Match: Lookahead T[7..10] = "ABRA" matches T[0..3] at distance = 7, length = 4 -> 4 bytes compressed into 1 token!',
            log: 'At i=7, longest prefix match in search buffer is T[0..3]="ABRA" (distance=7, length=4).'
          },
          {
            active: [],
            match: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            tok: 'DEFLATE Stream: Canonical Huffman encodes {Literals + Length + Dist} -> 31 bits total!',
            inv: 'DEFLATE Pipeline (RFC 1951): LZ77 eliminates duplicate substrings via (dist, len) pairs; Canonical Huffman entropy-codes the token stream.',
            log: 'DEFLATE combines LZ77 back-references with Canonical Huffman trees for fast O(N) decompression.'
          }
        ];
        return steps.map((st) => ({
          stageHtml: renderArrayCells(tape, { active: st.active, match: st.match }),
          invariant: st.inv,
          metrics: [
            { label: 'Input Stream', value: '"ABRACADABRA" (11B)' },
            { label: 'Emitted Token', value: st.tok },
            { label: 'Window Size (DEFLATE)', value: '32 KB Sliding Window' }
          ],
          log: st.log
        }));
      }

      // Myers O(ND) Edit Graph preset
      const steps = [
        {
          d: 0, k: 0, xy: '(0,0) → (0,0)',
          diag: ['k=-1: —', 'k=0: V[0]=0', 'k=+1: —'],
          match: [1],
          inv: 'Myers Edit Graph (A="ABCABBA", B="CBABAC"): diagonal k = x − y. At d=0 edits, start at (0,0); A[0]=\'A\' != B[0]=\'C\' so snake length = 0.',
          log: 'd = 0: start at (0,0) on diagonal k = 0. No immediate diagonal match.'
        },
        {
          d: 1, k: -1, xy: '(0,0) ↓ (0,1) ↘ (2,3)',
          diag: ['k=-1: V[-1]=2 (snake!)', 'k=0: V[0]=0', 'k=+1: V[1]=1'],
          match: [0],
          inv: 'd = 1: Step down to k = −1 at (0,1) (insert \'C\'), then slide down FREE diagonal snake (0,1) → (1,2) → (2,3) matching "BA"!',
          log: 'd = 1, k = −1: 1 vertical edit reaches (0,1), unlocking a 2-char zero-cost diagonal snake ("BA") to (x=2, y=3)!'
        },
        {
          d: 5, k: 1, xy: 'Reached Sink (N=7, M=6) at d = D = 5!',
          diag: ['Shortest Edit Script D = 5', 'LCS Length = (7+6−5)/2 = 4 ("CBAB")', 'Time: O((N+M)D)'],
          match: [0, 1, 2],
          inv: 'Optimality: Because diagonal snakes cost 0 and horizontal/vertical moves cost 1, the first d that reaches (N, M) is the exact Shortest Edit Script D = 5!',
          log: 'd = 5 reaches bottom-right corner (7, 6)! Myers explored only diagonals k ∈ [−d, +d] in O((N+M)D) time.'
        }
      ];

      return steps.map((st) => {
        const svg = `
          <svg viewBox="0 0 620 110" style="width:100%;max-height:115px;display:block;margin-bottom:8px;background:rgba(15,23,42,0.45);border:1px solid var(--border-subtle,#334155);border-radius:8px;">
            <text x="16" y="22" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold">Myers Edit Graph (k = x − y Diagonals) — Edit Distance Budget d = ${st.d}</text>
            <line x1="60" y1="38" x2="140" y2="38" stroke="#64748b" stroke-width="1.5"/>
            <line x1="60" y1="38" x2="60" y2="85" stroke="#f59e0b" stroke-width="2"/>
            <line x1="60" y1="85" x2="220" y2="85" stroke="#10b981" stroke-width="2.5" stroke-dasharray="4 2"/>
            <circle cx="60" cy="38" r="5" fill="#38bdf8"/>
            <circle cx="60" cy="85" r="5" fill="#f59e0b"/>
            <circle cx="220" cy="85" r="6" fill="#10b981"/>
            <text x="235" y="65" fill="#e2e8f0" font-size="11" font-family="monospace">Path: ${esc(st.xy)}</text>
            <text x="235" y="85" fill="#6ee7b7" font-size="10.5" font-family="monospace">Diagonal Snake: while A[x]==B[y] → (x+1, y+1) at Cost 0!</text>
          </svg>
        `;
        return {
          stageHtml: svg + renderArrayCells(st.diag, { match: st.match }),
          invariant: st.inv,
          metrics: [
            { label: 'Edit Budget d', value: `d = ${st.d}` },
            { label: 'Active Diagonal k', value: `k = x − y = ${st.k}` },
            { label: 'Furthest Reach', value: st.xy },
            { label: 'Complexity', value: 'O((N + M) · D)' }
          ],
          log: st.log
        };
      });
    }
  });
})();
