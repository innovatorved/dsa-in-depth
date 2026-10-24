/* ═══════════════════════════════════════════════════════════════
   DSA In Depth — Track II Simulators (Hashing, Sketches & Caches)
   1. sim-universal-siphash-dos
   2. sim-robin-hood-swisstable (alias: sim-open-addressing-swisstable)
   3. sim-cuckoo-hashing
   4. sim-consistent-hashing-ring
   5. sim-bloom-cuckoo-filter
   6. sim-cms-hyperloglog
   7. sim-lru-lfu-cache
   ═══════════════════════════════════════════════════════════════ */

window.SIMULATORS = window.SIMULATORS || {};

(() => {
  const { esc, createStepSimulator, renderArrayCells } = window.Simulators;

  // ───────────────────────────────────────────────────────────────
  // 1. Universal Hashing, Birthday Collision Curve & HashDoS vs SipHash
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-universal-siphash-dos'] = createStepSimulator({
    id: 'sim-universal-siphash-dos',
    aliases: ['sim-hashdos-siphash'],
    title: 'Universal Hashing, Birthday Collision Curve & HashDoS vs Keyed SipHash',
    badge: 'Pr[h(x)=h(y)] ≤ 1/M · SipHash-2-4',
    badgeClass: 'badge-o1',
    blurb: 'Witness how an unkeyed polynomial hash (h = 31·h + c) degenerates to O(N²) under an adversarial HashDoS collision payload, how keyed SipHash-2-4 ARX rounds & Carter-Wegman universal families enforce Pr[collision] ≤ 1/M, and how the Birthday Paradox curve 1 − e^(−k(k−1)/2M) crosses 50% at k ≈ 1.177√M.',
    slugs: [
      'hash-functions-universal-siphash',
      'separate-chaining-hashdos-defense',
      'universal-k-independent-hashing',
      'hashdos-siphash-random-seeds'
    ],
    presets: [
      { id: 'hashdos', label: 'Adversarial HashDoS Attack on Unkeyed Polynomial Hash (O(N²) Single-Bucket Degeneration)', mode: 'hashdos' },
      { id: 'siphash', label: 'Keyed SipHash-2-4 ARX Mixing & Universal 1/M Collision Bound', mode: 'siphash' },
      { id: 'birthday', label: 'Birthday Paradox Collision Probability Curve 1 − e^(−k(k−1)/2M)', mode: 'birthday' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'birthday') {
        const steps = [
          {
            k: 10,
            prob: 11.7,
            pairs: 45,
            inv: 'M = 365 buckets, k = 10 keys → k(k−1)/2 = 45 pairs. P(collision) ≈ 1 − e^(−45/365) = 11.7%.',
            log: 'With k = 10 keys in M = 365 buckets, 45 distinct key pairs exist; collision chance is still low (11.7%).'
          },
          {
            k: 23,
            prob: 50.7,
            pairs: 253,
            inv: 'Birthday Threshold k ≈ √(2M ln 2) ≈ 1.177√M = 23! 253 pairs cross 50.7% collision probability!',
            log: 'At k = 23 keys (only 6.3% load factor!), 253 pairs make a collision more likely than not (50.7%).'
          },
          {
            k: 50,
            prob: 97.0,
            pairs: 1225,
            inv: 'At k = 50 keys, k(k−1)/2 = 1,225 pairs > 3M → P(collision) ≈ 1 − e^(−3.356) = 97.0%!',
            log: 'At k = 50 keys, collision probability reaches 97.0%. For 64-bit hashes (M = 2⁶⁴), 50% occurs at k ≈ 5.1 × 10⁹.'
          },
          {
            k: 75,
            prob: 99.97,
            pairs: 2775,
            inv: 'At k = 75 keys, P(collision) = 99.97% (near certainty). Unkeyed 32-bit hashes collide at just k = 77,163!',
            log: 'At k = 75 keys in M = 365, collisions are virtually guaranteed (99.97%).'
          }
        ];

        return steps.map((st) => {
          const cx = 60 + (st.k / 80) * 520;
          const cy = 155 - (st.prob / 100) * 125;
          const svg = `
            <svg viewBox="0 0 640 190" style="width:100%;max-height:195px;display:block;background:rgba(15,23,42,0.45);border:1px solid var(--border-subtle,#334155);border-radius:8px;padding:4px;">
              <line x1="60" y1="155" x2="590" y2="155" stroke="#475569" stroke-width="1.5"/>
              <line x1="60" y1="25" x2="60" y2="155" stroke="#475569" stroke-width="1.5"/>
              <line x1="60" y1="92" x2="590" y2="92" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 4"/>
              <text x="66" y="88" fill="#fbbf24" font-size="10" font-family="monospace">50% Collision Threshold (k = 23 ≈ 1.177√M)</text>
              <path d="M 60 155 Q 140 150, 210 91 T 385 34 L 580 30" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
              <line x1="${cx}" y1="155" x2="${cx}" y2="${cy}" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 3"/>
              <circle cx="${cx}" cy="${cy}" r="6" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
              <text x="${Math.min(460, cx + 10)}" y="${Math.max(42, cy - 6)}" fill="#e2e8f0" font-size="11" font-family="monospace" font-weight="bold">k=${st.k}: P=${st.prob}%</text>
              <text x="300" y="178" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">Number of Keys k (M = 365 Buckets) · Pairs = k(k−1)/2 = ${st.pairs}</text>
              <text x="16" y="95" fill="#94a3b8" font-size="10" font-family="monospace">Pr</text>
            </svg>
          `;
          return {
            stageHtml: svg,
            invariant: st.inv,
            metrics: [
              { label: 'Keys Inserted (k)', value: `${st.k} (M = 365)` },
              { label: 'Distinct Pairs C(k,2)', value: `${st.pairs}` },
              { label: 'Collision Prob.', value: `${st.prob}%` },
              { label: '64-Bit 50% Bound', value: 'k ≈ 5.1 × 10⁹' }
            ],
            log: st.log
          };
        });
      }

      if (preset.mode === 'siphash') {
        const steps = [
          {
            round: 'Init: v0..v3 ⊕ Secret 128-bit OS Key (k0, k1)',
            v: ['v0 = k0 ⊕ 0x736f6d65..', 'v1 = k1 ⊕ 0x646f7261..', 'v2 = k0 ⊕ 0x6c796765..', 'v3 = k1 ⊕ m₀'],
            buckets: ['"Aa"', '·', '"BB"', '·', '·', '"C#"', '·', '"D$"'],
            match: [0, 2, 5, 7],
            inv: 'Keyed PRF / 2-Universal Family: Secret seed (k0, k1) sampled from OS CSPRNG at startup is unknown to remote attacker!',
            log: 'Initialize SipHash-2-4 256-bit state (v0..v3) mixed with secret 128-bit key (k0, k1) and message block m₀.'
          },
          {
            round: '2 Compression SipRounds (ARX: Add + Rotate + XOR)',
            v: ['v0 += v1; rotl(v1,13)', 'v1 ^= v0; rotl(v0,32)', 'v2 += v3; rotl(v3,16)', 'v3 ^= v2; v0 += v3'],
            buckets: ['"Aa"', '"E%"', '"BB"', '·', '·', '"C#"', '·', '"D$"'],
            match: [0, 1, 2, 5, 7],
            inv: 'Each SipRound applies branchless 64-bit ADD (⊞), ROTL (≪), and XOR (⊕) — achieving full avalanche in ~1.5 cycles/byte.',
            log: 'Execute 2 compression SipRounds per 8-byte block: adversarial collider strings scatter across independent buckets!'
          },
          {
            round: '4 Finalization SipRounds → v0 ⊕ v1 ⊕ v2 ⊕ v3',
            v: ['v2 ^= 0xff (Final)', '4 × SipRound(v0..v3)', 'h = v0 ^ v1 ^ v2 ^ v3', 'idx = h & (M - 1)'],
            buckets: ['"Aa"', '"E%"', '"BB"', '·', '"F&"', '"C#"', '·', '"D$"'],
            match: [0, 1, 2, 4, 5, 7],
            inv: 'Carter-Wegman / SipHash Guarantee: ∀ x ≠ y, Pr_{k}[h_k(x) == h_k(y)] ≤ 1/M → Expected chain length = 1 + α = O(1)!',
            log: '4 finalization SipRounds prevent state-recovery attacks; all 6 adversarial strings land in distinct buckets (max chain = 1).'
          }
        ];

        return steps.map((st) => {
          const svg = `
            <svg viewBox="0 0 640 120" style="width:100%;max-height:125px;display:block;margin-bottom:8px;background:rgba(15,23,42,0.45);border:1px solid var(--border-subtle,#334155);border-radius:8px;">
              <text x="14" y="20" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold">SipHash-2-4 ARX Pipeline — ${esc(st.round)}</text>
              ${st.v.map((reg, i) => `
                <rect x="${14 + i * 154}" y="32" width="144" height="36" rx="6" fill="rgba(16,185,129,0.12)" stroke="#10b981" stroke-width="1.2"/>
                <text x="${86 + i * 154}" y="54" fill="#e2e8f0" font-size="10.5" font-family="monospace" text-anchor="middle">${esc(reg)}</text>
              `).join('')}
              <text x="320" y="98" fill="#a7f3d0" font-size="11" font-family="monospace" text-anchor="middle">64-bit ARX (Add ⊞ · Rotate ≪ · XOR ⊕) → Uniform Bucket Distribution (Max Chain = 1)</text>
            </svg>
          `;
          return {
            stageHtml: svg + renderArrayCells(st.buckets, { match: st.match }),
            invariant: st.inv,
            metrics: [
              { label: 'Hash Family', value: 'Keyed SipHash-2-4' },
              { label: 'Pairwise Collision Pr', value: '≤ 1 / M (12.5%)' },
              { label: 'Max Bucket Chain', value: '1 (O(1) Lookup)' },
              { label: 'Total Probes (6 Keys)', value: '6 (Linear Θ(N))' }
            ],
            log: st.log
          };
        });
      }

      // Default preset: Adversarial HashDoS Attack on Unkeyed Polynomial Hash
      const trace = [
        {
          key: '"Aa"',
          chain: ['"Aa"'],
          probes: 1,
          totalProbes: 1,
          inv: 'Unkeyed Java/DJB2 Hash: h("Aa") = 31·65 + 97 = 2112 ≡ 3 (mod 8). Placed at Bucket[3].',
          log: 'Insert #1 ("Aa"): unkeyed hash h("Aa") = 2112 maps to Bucket[3] (1 probe).'
        },
        {
          key: '"BB"',
          chain: ['"Aa"', '"BB"'],
          probes: 2,
          totalProbes: 3,
          inv: 'Algebraic Collision: \'A\'+1 == \'B\' (+31) and \'a\'−31 == \'B\' (−31) → h("BB") = 31·66 + 66 = 2112 ≡ 3!',
          log: 'Insert #2 ("BB"): attacker crafts 2-char delta (+1, −31) so h("BB") == h("Aa") == 2112! Collides into Bucket[3].'
        },
        {
          key: '"C#"',
          chain: ['"Aa"', '"BB"', '"C#"'],
          probes: 3,
          totalProbes: 6,
          inv: 'k = 3 colliding keys in Bucket[3]: every insertion traverses the entire linked chain to check key equality.',
          log: 'Insert #3 ("C#"): h("C#") = 31·67 + 35 = 2112 -> Bucket[3] chain length grows to 3 (cumulative probes = 6).'
        },
        {
          key: '"D$" + "E%"',
          chain: ['"Aa"', '"BB"', '"C#"', '"D$"', '"E%"'],
          probes: 5,
          totalProbes: 15,
          inv: 'HashDoS Degeneration: N colliding keys in Bucket[3] force ∑_{i=1}^N i = N(N+1)/2 = Θ(N²) comparisons!',
          log: 'Insert #4–#5 ("D$", "E%"): all 5 keys pile into Bucket[3] while 7/8 buckets sit empty! 64 KB HTTP POST stalls CPU for minutes.'
        }
      ];

      return trace.map((st) => {
        const buckets = ['·', '·', '·', `Chain(${st.chain.length})`, '·', '·', '·', '·'];
        const svg = `
          <svg viewBox="0 0 640 105" style="width:100%;max-height:110px;display:block;margin-bottom:8px;background:rgba(15,23,42,0.45);border:1px solid var(--border-subtle,#334155);border-radius:8px;">
            <text x="14" y="22" fill="#f87171" font-size="11" font-family="monospace" font-weight="bold">Bucket[3]Degenerate Collision Chain (h = 2112 mod 8 = 3):</text>
            ${st.chain.map((k, idx) => `
              <rect x="${16 + idx * 120}" y="36" width="92" height="34" rx="6" fill="rgba(239,68,68,0.16)" stroke="#ef4444" stroke-width="1.5"/>
              <text x="${62 + idx * 120}" y="57" fill="#fecaca" font-size="11.5" font-family="monospace" text-anchor="middle">${esc(k)}</text>
              ${idx < st.chain.length - 1 ? `<text x="${114 + idx * 120}" y="57" fill="#f87171" font-size="13" font-family="monospace">→</text>` : ''}
            `).join('')}
            <text x="14" y="90" fill="#fca5a5" font-size="10.5" font-family="monospace">Cumulative Comparisons = 1 + 2 + … + ${st.chain.length} = ${st.totalProbes} = N(N+1)/2 = Θ(N²)</text>
          </svg>
        `;
        return {
          stageHtml: svg + renderArrayCells(buckets, { warn: [3], tags: { 3: `len=${st.chain.length} (Hotspot!)` } }),
          invariant: st.inv,
          metrics: [
            { label: 'Payload Key', value: st.key },
            { label: 'Unkeyed Hash', value: '2112 → Bucket[3]' },
            { label: 'Bucket[3] Length', value: `${st.chain.length} / ${st.chain.length} keys` },
            { label: 'Total Comparisons', value: `${st.totalProbes} (Θ(N²))` }
          ],
          log: st.log
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 2. Open Addressing: Robin Hood PSL & SwissTable 16-Way SIMD
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-robin-hood-swisstable'] = createStepSimulator({
    id: 'sim-robin-hood-swisstable',
    aliases: ['sim-open-addressing-swisstable', 'sim-open-addressing-robin-hood', 'sim-swisstable-simd'],
    title: 'Open Addressing: Robin Hood PSL & SwissTable 16-Way SIMD Probe',
    badge: 'Expected O(1) · SIMD H2',
    badgeClass: 'badge-o1',
    blurb: 'Compare Robin Hood Hashing (stealing slots from rich keys with lower Probe Sequence Length PSL to crush variance) and Google SwissTable / Rust hashbrown 16-byte H2 metadata SIMD bitmask probing.',
    slugs: [
      'open-addressing-robin-hood',
      'swisstable-simd-metadata-probing',
      'case-rust-hashbrown-swisstable',
      'build-robin-hood-hash-map',
      'separate-chaining-vs-open-addressing'
    ],
    presets: [
      { id: 'robinhood', label: 'Robin Hood Hashing (PSL Variance Reduction)', mode: 'robinhood' },
      { id: 'swisstable', label: 'SwissTable 16-Way SIMD Control Byte Match (_mm_cmpeq_epi8)', mode: 'swisstable' }
    ],
    buildFrames(preset) {
      const frames = [];
      if (preset.mode === 'swisstable') {
        const ctrl = ['0x5A', '0x12', '0x80', '0x3F', '0x5A', '0xFF', '0x41', '0x80'];
        const keys = ['k10', 'k22', 'EMPTY', 'k39', 'k42', 'DEL', 'k77', 'EMPTY'];
        const steps = [
          {
            active: [0, 1, 2, 3, 4, 5, 6, 7],
            match: [],
            inv: 'Hash("k42") = 0x9F3B_5A -> H1 (57-bit group index) = 0, H2 (7-bit fingerprint) = 0x5A',
            log: 'Split 64-bit hash into 57-bit H1 probe group index and 7-bit H2 metadata tag (0x5A).'
          },
          {
            active: [],
            match: [0, 4],
            inv: '_mm_cmpeq_epi8(ctrl_group, 0x5A) -> bitmask 0b00010001 (lanes 0 and 4 match H2!)',
            log: 'Single-instruction SIMD compare across all control bytes yields candidate bitmask 0b00010001.'
          },
          {
            active: [0],
            match: [],
            warn: [0],
            inv: 'Verify candidate lane [0] (ctz=0): key "k10" != "k42" (7-bit H2 collision, ~0.78% rate); clear lowest bit mask &= mask - 1',
            log: 'Checked slot [0]: H2 matched 0x5A but full key "k10" != "k42". Cleared bit via mask &= (mask - 1).'
          },
          {
            active: [],
            match: [4],
            inv: 'Verify candidate lane [4] (ctz=4): key "k42" == "k42" -> EXACT HIT in 1 SIMD instruction!',
            log: 'Checked slot [4]: full key "k42" matches! Returned value in O(1) without sequential linear scanning.'
          }
        ];

        steps.forEach((st, i) => {
          const tags = {};
          ctrl.forEach((c, idx) => { tags[idx] = `H2=${c}`; });
          frames.push({
            stageHtml: renderArrayCells(keys, { active: st.active, match: st.match, warn: st.warn, tags }),
            invariant: st.inv,
            metrics: [
              { label: 'Target Key / H2', value: 'k42 / 0x5A' },
              { label: 'SIMD Bitmask', value: i >= 1 ? (i === 3 ? '0b00010000' : '0b00010001') : 'Pending' },
              { label: 'Full Key Comparisons', value: `${Math.max(0, i - 1)}` },
              { label: 'SIMD Instructions', value: '1 (_mm_cmpeq_epi8)' }
            ],
            log: st.log
          });
        });
        return frames;
      }

      // Robin Hood Hashing trace
      const table = Array(8).fill(null);
      const inserts = [
        { k: 'A', h: 1 },
        { k: 'B', h: 1 },
        { k: 'C', h: 2 },
        { k: 'D', h: 1 }
      ];

      for (const item of inserts) {
        let cur = { k: item.k, h: item.h, psl: 0 };
        let idx = cur.h;
        while (true) {
          if (!table[idx]) {
            table[idx] = cur;
            const cells = table.map(x => x ? `${x.k}` : '·');
            const tags = {};
            table.forEach((x, i) => { if (x) tags[i] = `h=${x.h},PSL=${x.psl}`; });
            frames.push({
              stageHtml: renderArrayCells(cells, { match: [idx], tags }),
              invariant: `Robin Hood Invariant: ∀ slot i, PSL variance minimized; placed ${cur.k} at [${idx}] with PSL=${cur.psl}`,
              metrics: [
                { label: 'Inserting', value: `${item.k} (home=${item.h})` },
                { label: 'Slot Index', value: `[${idx}]` },
                { label: 'Placed PSL', value: `${cur.psl}` },
                { label: 'Max PSL in Table', value: `${Math.max(0, ...table.filter(Boolean).map(x => x.psl))}` }
              ],
              log: `Slot [${idx}] was empty -> placed key ${cur.k} (home=${cur.h}, PSL=${cur.psl}).`
            });
            break;
          } else {
            const occupant = table[idx];
            let swapped = false;
            if (cur.psl > occupant.psl) {
              table[idx] = { ...cur };
              cur = { ...occupant };
              swapped = true;
            }
            const cells = table.map(x => x ? `${x.k}` : '·');
            const tags = {};
            table.forEach((x, i) => { if (x) tags[i] = `h=${x.h},PSL=${x.psl}`; });
            frames.push({
              stageHtml: renderArrayCells(cells, { pivot: [idx], tags }),
              invariant: swapped
                ? `ROBIN HOOD SWAP at [${idx}]! Incoming PSL > Occupant PSL (${table[idx].psl} > ${cur.psl}) -> Displaced ${cur.k}`
                : `Probe [${idx}]: Incoming ${cur.k} (PSL=${cur.psl}) <= Occupant ${occupant.k} (PSL=${occupant.psl}) -> Continue probing`,
              metrics: [
                { label: 'Active Key', value: `${cur.k} (PSL=${cur.psl})` },
                { label: 'Probed Slot', value: `[${idx}]` },
                { label: 'Action', value: swapped ? 'Robin Hood Steal!' : 'Advance idx+1' },
                { label: 'Max PSL', value: `${Math.max(0, ...table.filter(Boolean).map(x => x.psl))}` }
              ],
              log: swapped
                ? `Key ${table[idx].k} (PSL=${table[idx].psl}) stole slot [${idx}] from rich key ${cur.k} (PSL=${cur.psl})!`
                : `Collision at [${idx}] with ${occupant.k} (PSL=${occupant.psl}); advancing ${cur.k} to slot [${(idx + 1) % 8}].`
            });
            cur.psl++;
            idx = (idx + 1) % 8;
          }
        }
      }
      return frames;
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 3. Cuckoo Hashing 2-Table Displacement & FKS Perfect Hashing
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-cuckoo-hashing'] = createStepSimulator({
    id: 'sim-cuckoo-hashing',
    aliases: ['sim-cuckoo-perfect-hashing'],
    title: 'Cuckoo Hashing 2-Table Kick Graph & FKS Perfect Hashing',
    badge: 'Worst-Case O(1) Lookup · ≤ 2 Probes',
    badgeClass: 'badge-o1',
    blurb: 'Trace Pagh & Rodler Cuckoo Hashing where every key x resides exclusively at T₁[h₁(x)] or T₂[h₂(x)] (guaranteeing worst-case O(1) lookup in 2 parallel cache-line reads) and FKS two-level static perfect hashing.',
    slugs: [
      'cuckoo-hashing-perfect-hashing',
      'robin-hood-cuckoo-hashing'
    ],
    presets: [
      { id: 'cuckoo', label: 'Cuckoo 2-Table Kick Displacement Chain (T₁[h₁(x)] ↔ T₂[h₂(x)])', mode: 'cuckoo' },
      { id: 'fks', label: 'FKS Two-Level Perfect Hashing (Secondary Size sᵢ² → 0 Collisions)', mode: 'fks' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'fks') {
        const steps = [
          {
            b: ['B0: {k1, k9} (s₀=2)', 'B1: ∅ (s₁=0)', 'B2: {k3, k7, k8} (s₂=3)', 'B3: {k5} (s₃=1)'],
            sec: 'Level-1 Universal Hash h splits N=6 keys into bucket sizes s = [2, 0, 3, 1]; ∑ sᵢ² = 4 + 0 + 9 + 1 = 14 < 2N.',
            log: 'Level 1: Choose universal h₁ so ∑ sᵢ² < 2N (here 4 + 0 + 9 + 1 = 14). Allocate secondary tables of size mᵢ = sᵢ².'
          },
          {
            b: ['T₀ (m₀=4): [k1, ·, k9, ·]', 'T₁ (m₁=0): []', 'T₂ (m₂=9): [·,k3,·,·,k7,·,·,k8,·]', 'T₃ (m₃=1): [k5]'],
            sec: 'By Birthday Bound, sizing secondary table mᵢ = sᵢ² guarantees Pr[collision in Tᵢ] ≤ C(sᵢ,2)/sᵢ² < 1/2!',
            log: 'Level 2: For each bucket i, pick universal seed h₂,ᵢ until 0 collisions occur (expected ≤ 2 trials). Worst-case 2 memory accesses!'
          },
          {
            b: ['T₀ (m₀=4): [k1, ·, k9, ·]', 'T₁ (m₁=0): []', 'T₂[h₂,₂(k7)=4] → HIT k7!', 'T₃ (m₃=1): [k5]'],
            sec: 'Query(k7): Step 1 computes i = h₁(k7) = 2; Step 2 reads T₂[h₂,₂(k7) = 4] = k7 in worst-case O(1) (2 array reads, 0 loops)!',
            log: 'Lookup(k7): Read header bucket 2, then index directly into T₂[4] -> exact match k7 in 2 deterministic memory accesses!'
          }
        ];
        return steps.map((st, idx) => ({
          stageHtml: renderArrayCells(st.b, { match: idx >= 1 ? [2] : [], active: idx === 0 ? [0, 2, 3] : [2] }),
          invariant: st.sec,
          metrics: [
            { label: 'Total Keys (N)', value: '6' },
            { label: 'Total Secondary Space', value: '∑ sᵢ² = 14 slots (O(N))' },
            { label: 'Secondary Collisions', value: '0 (Guaranteed)' },
            { label: 'Worst-Case Lookup', value: '2 Table Reads O(1)' }
          ],
          log: st.log
        }));
      }

      const steps = [
        {
          t1: ['·', 'A (1,0)', 'B (2,2)', '·'],
          t2: ['·', '·', '·', '·'],
          kick: 'Insert A(1,0) → T₁[1], Insert B(2,2) → T₁[2] (No conflict)',
          inv: 'Cuckoo Invariant: Every key x is at T₁[h₁(x)] OR T₂[h₂(x)]. Lookup inspects 2 independent cache lines in parallel.'
        },
        {
          t1: ['·', 'C (1,2)', 'B (2,2)', '·'],
          t2: ['A (1,0)', '·', '·', '·'],
          kick: 'Insert C(1,2): T₁[1] occupied by A! C kicks A out of T₁[1] → A relocates to T₂[h₂(A)=0].',
          inv: 'Displacement #1: C takes T₁[1]; evicted key A moves to its alternate home T₂[h₂(A) = 0].'
        },
        {
          t1: ['D (0,0)', 'C (1,2)', 'A (1,0)', '·'],
          t2: ['·', '·', 'C (1,2)', '·'],
          kick: 'Insert E(1,0): E → T₁[1] kicks C → T₂[2] (empty)! Chain terminates in 2 kicks (< MAX_KICKS).',
          inv: 'When load factor α < 0.5, the random cuckoo bipartite graph has O(1) expected kick-path length!'
        }
      ];

      return steps.map((st, idx) => {
        const svg = `
          <svg viewBox="0 0 620 120" style="width:100%;max-height:125px;display:block;background:rgba(15,23,42,0.45);border:1px solid var(--border-subtle,#334155);border-radius:8px;">
            <text x="16" y="22" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold">Table T₁[0..3] (h₁)</text>
            <text x="336" y="22" fill="#a78bfa" font-size="11" font-family="monospace" font-weight="bold">Table T₂[0..3] (h₂)</text>
            ${st.t1.map((v, i) => `
              <rect x="${16 + i * 68}" y="34" width="62" height="40" rx="6" fill="${v !== '·' ? 'rgba(56,189,248,0.16)' : 'rgba(30,41,59,0.5)'}" stroke="${v !== '·' ? '#38bdf8' : '#475569'}" stroke-width="1.3"/>
              <text x="${47 + i * 68}" y="58" fill="#e2e8f0" font-size="10.5" font-family="monospace" text-anchor="middle">${esc(v)}</text>
            `).join('')}
            ${st.t2.map((v, i) => `
              <rect x="${336 + i * 68}" y="34" width="62" height="40" rx="6" fill="${v !== '·' ? 'rgba(167,139,250,0.16)' : 'rgba(30,41,59,0.5)'}" stroke="${v !== '·' ? '#a78bfa' : '#475569'}" stroke-width="1.3"/>
              <text x="${367 + i * 68}" y="58" fill="#e2e8f0" font-size="10.5" font-family="monospace" text-anchor="middle">${esc(v)}</text>
            `).join('')}
            <text x="310" y="100" fill="#fbbf24" font-size="11" font-family="monospace" text-anchor="middle">${esc(st.kick)}</text>
          </svg>
        `;
        return {
          stageHtml: svg,
          invariant: st.inv,
          metrics: [
            { label: 'Lookup Locations', value: 'T₁[h₁(x)], T₂[h₂(x)]' },
            { label: 'Worst-Case Comparisons', value: '2 (Strict O(1))' },
            { label: '2-Table Load Threshold', value: 'α < 50% (4-way: 91%)' },
            { label: 'Step', value: `${idx + 1} / ${steps.length}` }
          ],
          log: st.kick
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 4. Consistent Hashing Ring with Virtual Nodes & Bounded Load
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-consistent-hashing-ring'] = createStepSimulator({
    id: 'sim-consistent-hashing-ring',
    aliases: ['sim-consistent-hashing'],
    title: 'Consistent Hashing Ring with Virtual Nodes & Bounded Loads',
    badge: 'O(log(N·V)) Lookup · 1/N Churn',
    badgeClass: 'badge-ologn',
    blurb: 'Map nodes and keys onto the [0, 2^32 − 1] unit circle via binary search (upper_bound). Observe how adding or removing a node migrates only O(K/N) keys and how bounded load caps node capacity at ⌈c · K/N⌉.',
    slugs: [
      'consistent-hashing-jump-rendezvous',
      'consistent-hashing-rendezvous'
    ],
    presets: [
      { id: 'ring', label: 'Clockwise Successor Routing & Node Join', mode: 'join' },
      { id: 'bounded', label: 'Bounded-Load Overflow Spillover (c = 1.25)', mode: 'bounded' }
    ],
    buildFrames(preset) {
      const frames = [];
      const ringSlots = [
        { deg: 30, label: 'NodeA#0', kind: 'node' },
        { deg: 75, label: 'key_41→A#1', kind: 'key' },
        { deg: 110, label: 'NodeA#1', kind: 'node' },
        { deg: 165, label: 'NodeB#0', kind: 'node' },
        { deg: 210, label: 'key_88→C#0', kind: 'key' },
        { deg: 250, label: 'NodeC#0', kind: 'node' },
        { deg: 315, label: 'NodeB#1', kind: 'node' },
        { deg: 350, label: 'key_19→A#0', kind: 'key' }
      ];

      const steps = preset.mode === 'bounded'
        ? [
            { active: [1, 2], match: [2], log: 'Route key_41 (hash 75°): clockwise upper_bound hits NodeA#1 at 110° (Load A: 1/2).', inv: 'Load(NodeA) = 1 ≤ Cap ⌈1.25 × 4/3⌉ = 2' },
            { active: [7, 0], match: [0], log: 'Route key_19 (hash 350°): wraps around 360° -> 0° to hit NodeA#0 at 30° (Load A: 2/2 FULL).', inv: 'Load(NodeA) = 2 == Cap 2 (Saturated!)' },
            { active: [0, 1, 2, 3], match: [3], warn: [2], log: 'Hotspot key_55 (hash 95°): primary successor NodeA#1 is at capacity (2/2)! Bounded-load skips to NodeB#0 (165°).', inv: 'Bounded-Load Invariant: max_load ≤ (1 + ε) · (K / N)' }
          ]
        : [
            { active: [0, 2, 3, 5, 6], match: [], log: 'Initialized 3 physical nodes × 2 vnodes sorted on ring [0°, 360°).', inv: 'Ring sorted array of V·N points; lookup via std::upper_bound in O(log(VN))' },
            { active: [1], match: [2], log: 'Lookup key_41 (75°): binary search finds first ring point ≥ 75° -> NodeA#1 (110°).', inv: 'succ(75°) = 110° (NodeA#1)' },
            { active: [4], match: [5], log: 'Lookup key_88 (210°): binary search finds first ring point ≥ 210° -> NodeC#0 (250°).', inv: 'succ(210°) = 250° (NodeC#0)' },
            { active: [4], match: [4], warn: [5], log: 'NodeD#0 joins at 225°! Only keys in arc (165°, 225°] (key_88 at 210°) migrate from NodeC to NodeD (~1/N keys moved).', inv: 'Monotonicity: inserting NodeD only steals keys from immediate clockwise successor' }
          ];

      steps.forEach((st, idx) => {
        const vals = ringSlots.map(s => `${s.deg}°`);
        const tags = {};
        ringSlots.forEach((s, i) => { tags[i] = s.label; });
        frames.push({
          stageHtml: renderArrayCells(vals, { active: st.active, match: st.match, warn: st.warn || [], tags }),
          invariant: st.inv,
          metrics: [
            { label: 'Ring Space', value: '[0, 2^32 - 1]' },
            { label: 'Lookup Complexity', value: 'O(log(N·V))' },
            { label: 'Key Churn on Join', value: '~1 / N keys' },
            { label: 'Step', value: `${idx + 1} / ${steps.length}` }
          ],
          log: st.log
        });
      });
      return frames;
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 5. Bloom Filter & Cuckoo Filter Bit-Array Visualizer
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-bloom-cuckoo-filter'] = createStepSimulator({
    id: 'sim-bloom-cuckoo-filter',
    aliases: ['sim-bloom-filter'],
    title: 'Bloom Filter k-Hash Bit Array & Cuckoo Fingerprint Kicks',
    badge: '0% False Negatives · ~1.44 log₂(1/ε) bits',
    badgeClass: 'badge-o1',
    blurb: 'Trace k=3 independent hash probes setting bits in an m=12 bit vector (and observe how overlapping bits cause a false positive), or inspect Cuckoo Filter XOR alternate-bucket displacement.',
    slugs: [
      'bloom-counting-cuckoo-filters',
      'bloom-filters-counting-xor',
      'build-bloom-cuckoo-filter'
    ],
    presets: [
      { id: 'bloom', label: 'Bloom Filter (m = 12 bits, k = 3 hashes)', mode: 'bloom' },
      { id: 'cuckoo', label: 'Cuckoo Filter (i₂ = i₁ ⊕ hash(fp) Deletion-Safe)', mode: 'cuckoo' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'cuckoo') {
        const steps = [
          {
            buckets: ['[fp=0x3B, ·]', '[·, ·]', '[fp=0x7A, ·]', '[·, ·]'],
            match: [0],
            inv: 'Insert("tcp"): fp = 0x3B, i₁ = h₁("tcp") = 0, i₂ = i₁ ⊕ h(0x3B) = 0 ⊕ 2 = 2. Stored fp=0x3B in Bucket[0].',
            log: 'Insert("tcp"): computed 8-bit fingerprint 0x3B and placed in primary bucket i₁ = 0.'
          },
          {
            buckets: ['[fp=0x3B, fp=0x9C]', '[·, ·]', '[fp=0x7A, fp=0x3B]', '[·, ·]'],
            match: [2],
            inv: 'XOR Partial-Key Symmetry: i₂ = i₁ ⊕ h(fp) ⟺ i₁ = i₂ ⊕ h(fp)! Relocated fp=0x3B without storing full key!',
            log: 'Bucket[0] full on new insert: kicked fp=0x3B to i₂ = 0 ⊕ h(0x3B) = 2 using ONLY the fingerprint!'
          },
          {
            buckets: ['[fp=0x9C, ·]', '[·, ·]', '[fp=0x7A, ·]', '[·, ·]'],
            match: [2],
            inv: 'Safe O(1) Deletion: delete("tcp") checks i₁=0 and i₂=2, removes one copy of fp=0x3B with 0 false negatives!',
            log: 'Delete("tcp"): found fp=0x3B in alternate bucket i₂ = 2 and cleared slot safely.'
          }
        ];
        return steps.map((st, idx) => ({
          stageHtml: renderArrayCells(st.buckets, { match: st.match }),
          invariant: st.inv,
          metrics: [
            { label: 'Fingerprint Size', value: '8 bits (fp)' },
            { label: 'Alternate Bucket', value: 'i₂ = i₁ ⊕ hash(fp)' },
            { label: 'Supports Delete?', value: 'Yes (O(1) Safe)' },
            { label: 'Step', value: `${idx + 1} / ${steps.length}` }
          ],
          log: st.log
        }));
      }

      const frames = [];
      const bits = Array(12).fill(0);
      const ops = [
        { op: 'ADD "tcp"', idx: [1, 5, 9], note: 'insert("tcp"): h₁=1, h₂=5, h₃=9 -> set bits [1, 5, 9] = 1.' },
        { op: 'ADD "udp"', idx: [2, 5, 10], note: 'insert("udp"): h₁=2, h₂=5, h₃=10 -> set bits [2, 5, 10] = 1 (bit 5 shared).' },
        { op: 'QUERY "tcp"', idx: [1, 5, 9], query: true, res: 'PROBABLY PRESENT (True Positive)', note: 'query("tcp"): bits [1, 5, 9] are all 1 -> returns TRUE.' },
        { op: 'QUERY "ssh"', idx: [1, 4, 10], query: true, res: 'DEFINITELY ABSENT (True Negative)', note: 'query("ssh"): bit [4] is 0 -> returns FALSE with 100% certainty!' },
        { op: 'QUERY "quic"', idx: [1, 2, 10], query: true, fp: true, res: 'FALSE POSITIVE (Collision)', note: 'query("quic"): h₁=1 (from tcp), h₂=2 (from udp), h₃=10 (from udp) are all 1 -> False Positive!' }
      ];

      ops.forEach((st) => {
        if (!st.query) {
          st.idx.forEach(i => { bits[i] = 1; });
        }
        const ones = bits.reduce((a, b) => a + b, 0);
        const fpr = Math.pow(ones / 12, 3) * 100;
        const tags = {};
        st.idx.forEach((idx, k) => { tags[idx] = `h_${k + 1}`; });

        frames.push({
          stageHtml: renderArrayCells(bits, {
            active: bits.map((b, i) => b ? i : -1).filter(i => i >= 0),
            match: st.query && !st.fp && st.res.includes('PRESENT') ? st.idx : (!st.query ? st.idx : []),
            warn: st.fp || st.res?.includes('ABSENT') ? st.idx : [],
            tags
          }),
          invariant: `p ≈ (1 − e^(−kn/m))^k | Bits set: ${ones}/12 (${(ones / 12 * 100).toFixed(0)}%) | Est. FPR ≈ ${fpr.toFixed(1)}%`,
          metrics: [
            { label: 'Operation', value: st.op },
            { label: 'Probed Indices', value: `[${st.idx.join(', ')}]` },
            { label: 'Bits Set (m=12)', value: `${ones} / 12` },
            { label: 'Verdict', value: st.res || 'Inserted' }
          ],
          log: st.note
        });
      });
      return frames;
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 6. Count-Min Sketch d × w Matrix & HyperLogLog Harmonic Mean
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-cms-hyperloglog'] = createStepSimulator({
    id: 'sim-cms-hyperloglog',
    aliases: ['sim-count-min-sketch', 'sim-hyperloglog'],
    title: 'Count-Min Sketch d × w Matrix & HyperLogLog Register Harmonic Mean',
    badge: 'O(1) Stream Sketch · 1.5 KB HLL',
    badgeClass: 'badge-o1',
    blurb: 'Step through Count-Min Sketch d × w counter updates and point query f̂(x) = min_j C[j, h_j(x)] (eliminating additive collision noise), or trace HyperLogLog leading-zero registers M[j] = max ρ(w) and Harmonic Mean cardinality estimation.',
    slugs: [
      'count-min-sketch-heavy-hitters',
      'hyperloglog-cardinality-estimation',
      'hyperloglog-cardinality'
    ],
    presets: [
      { id: 'cms', label: 'Count-Min Sketch 4 × 8 Counter Matrix Update & Point Query min_j C[j, h_j(x)]', mode: 'cms' },
      { id: 'hll', label: 'HyperLogLog Buckets Tracking Max Leading Zeros ρ(w) & Harmonic Mean Z', mode: 'hll' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'hll') {
        const steps = [
          {
            item: 'stream("user_101")',
            bits: '010 | 0001101... (bucket j=2, ρ=4)',
            regs: [1, 2, 4, 1, 2, 1, 2, 1],
            focus: 2,
            harm: '14.2',
            arith: '22.0',
            inv: 'Split 64-bit hash: top b=3 bits select register j = 010₂ = 2; remaining bits have ρ(w) = 4 leading zeros (+1). M[2] = max(1, 4) = 4.',
            log: 'Hash("user_101") = 010_0001101...₂ -> Register M[2] updated to ρ = 4.'
          },
          {
            item: 'stream("user_202") — Freak Outlier!',
            bits: '101 | 0000000001... (bucket j=5, ρ=10!)',
            regs: [1, 2, 4, 1, 2, 10, 2, 1],
            focus: 5,
            harm: '15.9',
            arith: '138.5 (Blown up!)',
            inv: 'Outlier Resilience: A freak hash with 9 leading zeros (ρ=10, 2^10=1024) explodes arithmetic mean to 138.5, but Harmonic Mean 2^(−10) = 1/1024 barely moves Z!',
            log: 'Outlier hash in bucket j=5 sets M[5] = 10. In harmonic mean ∑ 2^(−M[j]), 2^(−10) contributes only 0.00097!'
          },
          {
            item: 'Final HLL Estimate E = α_m · m² / ∑ 2^(−M[j])',
            bits: 'm = 8 registers, σ ≈ 1.04 / √m',
            regs: [2, 3, 4, 2, 3, 10, 2, 3],
            focus: -1,
            harm: '21.4 (True N = 21)',
            arith: '141.0',
            inv: 'HyperLogLog Formula: E = α_m · m² · (∑_{j=0}^{m-1} 2^(−M[j]))^(−1). With m = 16,384 (12 KB), relative error is ±0.81%!',
            log: 'Harmonic mean suppresses coin-flip outliers; estimate E = 21.4 matches true cardinality N = 21.'
          }
        ];

        return steps.map((st) => {
          const tags = {};
          st.regs.forEach((r, j) => { tags[j] = `2^-${r}=1/${1 << r}`; });
          return {
            stageHtml:
              `<div style="margin-bottom:6px;font-family:var(--font-mono,monospace);font-size:11.5px;color:#38bdf8;">64-Bit Hash Split: <strong>${esc(st.bits)}</strong></div>` +
              renderArrayCells(st.regs.map((r, j) => `M[${j}]=${r}`), {
                match: st.focus >= 0 ? [st.focus] : [0, 1, 2, 3, 4, 5, 6, 7],
                warn: st.focus === 5 ? [5] : [],
                tags
              }),
            invariant: st.inv,
            metrics: [
              { label: 'Stream Event', value: st.item },
              { label: 'HLL Harmonic Est.', value: st.harm },
              { label: 'Naive Arithmetic Est.', value: st.arith },
              { label: 'Std Error Bound', value: '1.04 / √m' }
            ],
            log: st.log
          };
        });
      }

      // Count-Min Sketch 4 x 8 matrix
      const steps = [
        {
          op: 'ADD("ip_A", +5)',
          cols: [2, 5, 1, 6],
          grid: [
            [0, 0, 5, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 5, 0, 0],
            [0, 5, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 5, 0]
          ],
          est: '5 (Exact = 5)',
          inv: 'Update("ip_A", 5): increment C[j, h_j("ip_A")] += 5 across all d = 4 pairwise-independent hash rows.',
          log: 'Added +5 for "ip_A" at cells (0,2), (1,5), (2,1), (3,6).'
        },
        {
          op: 'ADD("ip_B", +3) & ADD("ip_C", +4) [Collisions!]',
          cols: [2, 5, 4, 6],
          grid: [
            [0, 0, 8, 0, 4, 0, 0, 0],
            [0, 4, 0, 0, 0, 8, 0, 0],
            [0, 5, 0, 3, 4, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 12, 0]
          ],
          est: 'Row vals for ip_A: [8, 8, 5, 12]',
          inv: 'One-Sided Error Invariant: ∀ j, C[j, h_j(x)] ≥ f(x) because counters are non-negative and collisions only ADD.',
          log: '"ip_B" and "ip_C" collided with "ip_A" in rows 0, 1, and 3, inflating those cells to 8, 8, and 12!'
        },
        {
          op: 'QUERY("ip_A") = min_j C[j, h_j("ip_A")]',
          cols: [2, 5, 1, 6],
          minRow: 2,
          grid: [
            [0, 0, 8, 0, 4, 0, 0, 0],
            [0, 4, 0, 0, 0, 8, 0, 0],
            [0, 5, 0, 3, 4, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 12, 0]
          ],
          est: 'min(8, 8, 5, 12) = 5!',
          inv: 'Markov + Independence Bound: With w = ⌈e/ε⌉ and d = ⌈ln(1/δ)⌉, Pr[f̂(x) ≤ f(x) + ε‖f‖₁] ≥ 1 − δ. Row 2 avoided collisions -> exact 5!',
          log: 'Point query inspects C[0,2]=8, C[1,5]=8, C[2,1]=5, C[3,6]=12 -> minimum is 5 (exact true frequency!).'
        }
      ];

      return steps.map((st) => {
        const svg = `
          <svg viewBox="0 0 620 155" style="width:100%;max-height:160px;display:block;background:rgba(15,23,42,0.45);border:1px solid var(--border-subtle,#334155);border-radius:8px;">
            ${st.grid.map((row, r) => `
              <text x="14" y="${34 + r * 32}" fill="#94a3b8" font-size="11" font-family="monospace">h_${r + 1}(x)</text>
              ${row.map((val, c) => {
                const isTarget = st.cols[r] === c;
                const isMin = st.minRow === r && isTarget;
                const fill = isMin
                  ? 'rgba(16,185,129,0.32)'
                  : isTarget
                    ? 'rgba(245,158,11,0.24)'
                    : val > 0 ? 'rgba(56,189,248,0.12)' : 'rgba(30,41,59,0.5)';
                const stroke = isMin ? '#10b981' : isTarget ? '#f59e0b' : '#334155';
                return `
                  <rect x="${72 + c * 65}" y="${16 + r * 32}" width="58" height="26" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${isTarget ? '1.8' : '1'}"/>
                  <text x="${101 + c * 65}" y="${33 + r * 32}" fill="#e2e8f0" font-size="11" font-family="monospace" text-anchor="middle">${val}</text>
                `;
              }).join('')}
            `).join('')}
            <text x="310" y="147" fill="#a7f3d0" font-size="11" font-family="monospace" text-anchor="middle">f̂("ip_A") = min(C[0,2], C[1,5], C[2,1], C[3,6]) = ${esc(st.est)}</text>
          </svg>
        `;
        return {
          stageHtml: svg,
          invariant: st.inv,
          metrics: [
            { label: 'Operation', value: st.op },
            { label: 'Dimensions (d × w)', value: '4 × 8 Counters' },
            { label: 'Probed Cells', value: `[(0,2), (1,5), (2,1), (3,6)]` },
            { label: 'Query Estimate f̂(x)', value: st.est }
          ],
          log: st.log
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 7. O(1) LRU & Frequency-Bucketed LFU Cache Eviction
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-lru-lfu-cache'] = createStepSimulator({
    id: 'sim-lru-lfu-cache',
    aliases: [],
    title: 'O(1) HashMap + Doubly-Linked List LRU & LFU Cache Eviction',
    badge: 'O(1) Get & Put',
    badgeClass: 'badge-o1',
    blurb: 'Step through O(1) cache hits (splicing nodes to MRU head or promoting to freq+1 bucket list) and O(1) capacity evictions from the LRU tail / minFreq bucket.',
    slugs: [
      'lru-lfu-eviction-structures',
      'build-lfu-lru-cache'
    ],
    presets: [
      { id: 'lru', label: 'LRU Cache (Capacity = 3, MRU → LRU Doubly Linked List)', mode: 'lru' },
      { id: 'lfu', label: 'LFU Cache (Capacity = 3, minFreq Bucket Lists)', mode: 'lfu' }
    ],
    buildFrames(preset) {
      const frames = [];
      const stream = [
        { op: 'PUT(A, 1)', key: 'A' },
        { op: 'PUT(B, 2)', key: 'B' },
        { op: 'PUT(C, 3)', key: 'C' },
        { op: 'GET(A) -> Hit!', key: 'A', hit: true },
        { op: 'PUT(D, 4) -> Evict!', key: 'D', evict: true },
        { op: 'GET(B) -> Miss!', key: 'B', miss: true }
      ];

      let order = []; // MRU at index 0, LRU at end
      const freq = { A: 0, B: 0, C: 0, D: 0 };
      let hits = 0, misses = 0;

      stream.forEach((st) => {
        let evicted = null;
        if (st.miss) {
          misses++;
        } else if (st.hit) {
          hits++;
          freq[st.key]++;
          order = [st.key, ...order.filter(k => k !== st.key)];
        } else {
          if (order.length === 3 && !order.includes(st.key)) {
            if (preset.mode === 'lfu') {
              evicted = 'B';
              order = order.filter(k => k !== 'B');
            } else {
              evicted = order.pop();
            }
          }
          freq[st.key] = 1;
          order = [st.key, ...order.filter(k => k !== st.key)];
        }

        const tags = {};
        order.forEach((k, i) => {
          tags[i] = `${i === 0 ? 'MRU' : i === order.length - 1 ? 'LRU' : 'MID'} · f=${freq[k]}`;
        });

        frames.push({
          stageHtml: renderArrayCells(order.map(k => `Key ${k}`), {
            match: st.hit ? [0] : [],
            pivot: (!st.hit && !st.miss) ? [0] : [],
            warn: st.miss ? [order.length - 1] : [],
            tags
          }),
          invariant: `HashMap + Intrusive DLL: size = ${order.length}/3 | Order (MRU → LRU): [${order.join(' ⇄ ')}]${evicted ? ` | Evicted: ${evicted}` : ''}`,
          metrics: [
            { label: 'Operation', value: st.op },
            { label: 'MRU / LRU', value: `${order[0] || '-'} / ${order[order.length - 1] || '-'}` },
            { label: 'Hits / Misses', value: `${hits} / ${misses}` },
            { label: 'Evicted Key', value: evicted || 'None' }
          ],
          log: st.hit
            ? `${st.op}: O(1) HashMap lookup + O(1) DLL splice of ${st.key} to MRU head (freq=${freq[st.key]}).`
            : st.miss
              ? `${st.op}: Key B not in HashMap -> Cache Miss (-1).`
              : `${st.op}: Inserted ${st.key} at MRU head.${evicted ? ` Capacity 3 exceeded -> evicted ${evicted} in O(1)!` : ''}`
        });
      });

      return frames;
    }
  });
})();
