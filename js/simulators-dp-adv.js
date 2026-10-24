/* ═══════════════════════════════════════════════════════════════
   DSA In Depth — Track VI Simulators (Backtracking, DP & Advanced)
   29. sim-backtracking-dlx
   30. sim-dp-dag-table
   31. sim-cht-knuth-dp
   32. sim-convex-hull-sweep
   ═══════════════════════════════════════════════════════════════ */

window.SIMULATORS = window.SIMULATORS || {};

(() => {
  const { esc, createStepSimulator, renderArrayCells } = window.Simulators;

  // ───────────────────────────────────────────────────────────────
  // 29. Backtracking Bitmasks & Knuth's Dancing Links (DLX)
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-backtracking-dlx'] = createStepSimulator({
    id: 'sim-backtracking-dlx',
    aliases: ['sim-backtracking-pruning', 'sim-bitmask-tsp'],
    title: 'N-Queens Bitmask Pruning & Knuth Dancing Links (DLX)',
    badge: 'O(1) Bitmask / Exact Cover',
    badgeClass: 'badge-on2',
    blurb: 'Step through O(1) bitmask attack propagation (cols, ld, rd) for N-Queens, Knuth Algorithm X circular doubly-linked cover/uncover, and Meet-in-the-Middle subset search.',
    slugs: [
      'combinatorial-generation-permutations',
      'backtracking-state-space-trees',
      'exact-cover-knuth-algorithm-x',
      'branch-and-bound-admissible-bounds',
      'build-dancing-links-exact-cover'
    ],
    presets: [
      { id: 'nqueens4', label: '4-Queens Bitmask Search (cols | ld | rd)' },
      { id: 'dlx', label: 'Knuth DLX Exact Cover (L[R[x]] = L[x])' },
      { id: 'mitm', label: 'Meet-in-the-Middle (N=40 → 2×2^20)' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'mitm') {
        return [
          {
            stageHtml:
              `<div style="margin-bottom:8px;font-size:12px;color:var(--fg-muted);">Left Subset Sums L (i →) vs Sorted Right Subset Sums R (← j), Target = 12:</div>` +
              renderArrayCells([0, 3, 5, 8], { active: [3], tags: { 3: 'i=3 (L=8)' } }) +
              `<div style="height:8px;"></div>` +
              renderArrayCells([0, 2, 7, 9], { active: [1], tags: { 1: 'j=1 (R=2)' } }),
            invariant: 'L is sorted ascending (i moves right), R is sorted ascending (j moves left): L[i] + R[j] = 8 + 2 = 10 ≤ 12.',
            metrics: [
              { label: 'Naive 2^N', value: '2^40 ≈ 1.1×10¹²' },
              { label: 'MITM 2^(N/2+1)', value: '2×2²⁰ ≈ 2.1×10⁶' },
              { label: 'Candidate Sum', value: '8 + 2 = 10' }
            ],
            log: 'Split array into two halves of size N/2; enumerate and sort subset sums.'
          },
          {
            stageHtml:
              `<div style="margin-bottom:8px;font-size:12px;color:var(--fg-muted);">Exact Target Match Found: L[2]=5 + R[2]=7 == 12</div>` +
              renderArrayCells([0, 3, 5, 8], { match: [2], tags: { 2: 'i=2 (L=5)' } }) +
              `<div style="height:8px;"></div>` +
              renderArrayCells([0, 2, 7, 9], { match: [2], tags: { 2: 'j=2 (R=7)' } }),
            invariant: 'L[2] + R[2] = 5 + 7 = 12 == Target. Exact subset sum found in O(2^(N/2) log 2^(N/2))!',
            metrics: [
              { label: 'Left Choice', value: 'L[2] = 5' },
              { label: 'Right Choice', value: 'R[2] = 7' },
              { label: 'Combined Sum', value: '12 (Exact Match!)' }
            ],
            log: 'Two-pointer scan over L and R hits exact target 12.'
          }
        ];
      }

      if (preset?.id === 'dlx') {
        return [
          {
            stageHtml: renderArrayCells(['C1 (s=2)', 'C2 (s=2)', 'C3 (s=2)', 'C4 (s=2)'], {
              active: [0, 3],
              tags: { 0: 'Cover C1 (Row R1)', 3: 'Cover C4 (Row R1)' }
            }),
            invariant: 'MRV Heuristic picks column C1 with min size s=2. Selecting R1={C1,C4} covers C1, C4 via L[R[x]]=L[x], R[L[x]]=R[x].',
            metrics: [
              { label: 'Selected Row', value: 'R1: {C1, C4}' },
              { label: 'Conflicting Rows Unlinked', value: 'R2, R4' },
              { label: 'Open Columns', value: 'C2, C3' }
            ],
            log: 'Cover(C1) and Cover(C4) unlink conflicting rows R2 and R4 in O(1) per node.'
          },
          {
            stageHtml: renderArrayCells(['C1 (Covered)', 'C2 (Covered)', 'C3 (Covered)', 'C4 (Covered)'], {
              match: [0, 1, 2, 3],
              tags: { 0: 'R1', 1: 'R3', 2: 'R3', 3: 'R1' }
            }),
            invariant: 'Header R[h] == h (all columns covered). Exact Cover solution {R1, R3} found!',
            metrics: [
              { label: 'Selected Row', value: 'R3: {C2, C3}' },
              { label: 'Exact Partition', value: '{R1, R3}' },
              { label: 'Root Check', value: 'R[h] == h (Solved)' }
            ],
            log: 'Selecting R3 covers C2 and C3; exact cover {R1, R3} complete.'
          }
        ];
      }

      const renderBoard = (queens, pruned) => {
        let cells = '';
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const x = 180 + c * 46;
            const y = 12 + r * 40;
            const hasQ = queens.some(q => q[0] === r && q[1] === c);
            const isPruned = pruned.some(p => p[0] === r && p[1] === c);
            const fill = hasQ ? 'rgba(34,197,94,0.35)' : (isPruned ? 'rgba(239,68,68,0.28)' : ((r + c) % 2 === 0 ? '#1e293b' : '#0f172a'));
            const stroke = hasQ ? '#22c55e' : (isPruned ? '#ef4444' : '#334155');
            cells += `<rect x="${x}" y="${y}" width="44" height="38" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>` +
              `<text x="${x + 22}" y="${y + 24}" text-anchor="middle" fill="#f8fafc" font-size="15" font-weight="700">${hasQ ? '♛' : (isPruned ? '✕' : '')}</text>`;
          }
        }
        return `<svg viewBox="0 0 540 185" style="width:100%;height:auto;display:block;">${cells}</svg>`;
      };

      return [
        {
          stageHtml: renderBoard([[0, 1]], [[1, 0], [1, 1], [1, 2]]),
          invariant: 'Row 0 Queen at c=1 sets cols=0100₂, ld=1000₂, rd=0010₂. Row 1 avail = ~(cols|ld|rd) & 1111₂ = 0001₂ (only col 3 safe).',
          metrics: [
            { label: 'cols Mask', value: '0100₂' },
            { label: 'ld / rd Masks', value: '1000₂ / 0010₂' },
            { label: 'Next Row Avail', value: '0001₂ (c=3)' }
          ],
          log: 'Placed Queen at (0, 1); bitwise OR prunes 3 of 4 columns on Row 1 in O(1).'
        },
        {
          stageHtml: renderBoard([[0, 1], [1, 3]], [[2, 1], [2, 2], [2, 3]]),
          invariant: 'p = avail & -avail extracts lowest set bit c=3. Row 2 avail = 1000₂ (only col 0 safe).',
          metrics: [
            { label: 'cols Mask', value: '0101₂' },
            { label: 'Lowest Bit p', value: 'avail & -avail = 0001₂' },
            { label: 'Next Row Avail', value: '1000₂ (c=0)' }
          ],
          log: 'Placed Queen at (1, 3); propagated diagonal masks (ld|p)<<1 and (rd|p)>>1.'
        },
        {
          stageHtml: renderBoard([[0, 1], [1, 3], [2, 0], [3, 2]], []),
          invariant: 'cols == (1<<4)-1 == 1111₂: All 4 Queens placed without conflict [(0,1), (1,3), (2,0), (3,2)]!',
          metrics: [
            { label: 'cols Mask', value: '1111₂ (Complete)' },
            { label: 'Solution Tuple', value: '[1, 3, 0, 2]' },
            { label: 'Backtracks', value: '0 on this branch' }
          ],
          log: 'Row 2 forces (2, 0) and Row 3 forces (3, 2). Valid 4-Queens configuration found!'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 30. DP State DAG, 0/1 Knapsack & Myers Edit Graph
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-dp-dag-table'] = createStepSimulator({
    id: 'sim-dp-dag-table',
    aliases: [
      'sim-dp-dag-knapsack',
      'sim-edit-distance-lcs',
      'sim-knapsack-dp-table',
      'sim-edit-distance-myers-diff'
    ],
    title: 'DP State DAG, 0/1 Knapsack Reverse Sweep & Myers Diff',
    badge: 'O(N·W) / O(N·D) Edit Graph',
    badgeClass: 'badge-on2',
    blurb: 'Observe why 0/1 Knapsack iterates capacity w downwards (preventing item reuse), how Patience Sorting finds LIS in O(N log N), and how Myers Diff slides along diagonal snakes k = x - y.',
    slugs: [
      'dp-optimal-substructure-dag',
      'memoization-tabulation-space-rolling',
      'knapsack-family-01-unbounded-bounded',
      'lis-patience-sorting',
      'dag-dp-longest-path-counting'
    ],
    presets: [
      { id: 'knapsack', label: '0/1 Knapsack 1D Reverse Sweep (W = 7)' },
      { id: 'edit', label: 'Edit Distance & Myers Diff Snake (k = x - y)' },
      { id: 'lis', label: 'Patience Sorting LIS O(N log N)' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'lis') {
        return [
          {
            stageHtml: renderArrayCells([2, 4, 9], {
              active: [1],
              tags: { 0: 'len=1', 1: 'replaced 5→4', 2: 'len=3' }
            }),
            invariant: 'tails[k] holds the smallest tail of any increasing subsequence of length k+1. tails[] is always strictly increasing.',
            metrics: [
              { label: 'Incoming x', value: 'x = 4' },
              { label: 'Binary Search', value: 'lower_bound(tails, 4) → idx 1' },
              { label: 'tails[] State', value: '[2, 4, 9]' }
            ],
            log: 'Element 4 replaces 5 at tails[1], lowering the barrier for future length-3 extensions.'
          },
          {
            stageHtml: renderArrayCells([2, 4, 7, 11], {
              match: [0, 1, 2, 3],
              tags: { 2: 'replaced 9→7', 3: 'appended 11 (LIS=4)' }
            }),
            invariant: 'After replacing 9→7 at tails[2], incoming 11 extends tails[] to length 4: [2, 4, 7, 11].',
            metrics: [
              { label: 'Incoming x', value: 'x = 7, then x = 11' },
              { label: 'Final tails[]', value: '[2, 4, 7, 11]' },
              { label: 'LIS Length', value: '4 in O(N log N)' }
            ],
            log: '11 is larger than tails.back()=7, extending LIS length to 4.'
          }
        ];
      }

      if (preset?.id === 'edit') {
        return [
          {
            stageHtml: renderArrayCells(['dp[0][0]=0 (C==C)', 'dp[1][1]=0', 'dp[2][2]=1 (U→A)', 'dp[3][3]=1 (T==T)'], {
              match: [0, 1, 3],
              active: [2],
              tags: { 0: 'k=0 snake', 2: 'Sub cost +1', 3: 'k=0 snake' }
            }),
            invariant: 'Myers Diff Parameterization: diagonal k = x - y stays constant on matching characters (0-cost diagonal snake).',
            metrics: [
              { label: 'Strings', value: '"CUT" → "CAT"' },
              { label: 'Diagonal k = x - y', value: 'k = 0' },
              { label: 'Edit Distance D', value: '1 (Substitute U → A)' }
            ],
            log: 'Matched C==C, substituted U→A (cost 1), and slid along diagonal T==T (cost 0).'
          }
        ];
      }

      return [
        {
          stageHtml: renderArrayCells([0, 0, 0, 4, 4, 4, 4, 4], {
            active: [3, 4, 5, 6, 7],
            tags: { 0: 'w=0', 3: 'wt=3, val=4', 7: 'dp[7]=4' }
          }),
          invariant: 'Item 1 (wt=3, val=4): Sweep w = 7 downTo 3 so dp[w - 3] always reads the previous item layer.',
          metrics: [
            { label: 'Item 1', value: 'weight=3, value=4' },
            { label: 'Sweep Direction', value: 'w = 7 → 3 (Reverse)' },
            { label: 'Best dp[7]', value: '4' }
          ],
          log: 'Initialized 1D table with Item 1 (wt=3, val=4) across capacities 3..7.'
        },
        {
          stageHtml: renderArrayCells([0, 0, 0, 4, 5, 5, 5, 9], {
            match: [7],
            active: [3],
            tags: { 3: 'source dp[3]=4', 4: 'dp[4]=5', 7: 'dp[3]+5 = 9' }
          }),
          invariant: 'At w=7 with Item 2 (wt=4, val=5): dp[7] = max(dp[7]=4, dp[7-4] + 5) = 4 + 5 = 9.',
          metrics: [
            { label: 'Item 2', value: 'weight=4, value=5' },
            { label: 'Transition at w=7', value: 'dp[3] (4) + 5 = 9' },
            { label: 'Optimal Value dp[7]', value: '9' }
          ],
          log: 'Updated dp[7] = 9 using untouched state dp[3] = 4 from previous row.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 31. Convex Hull Trick (CHT) & Li Chao Tree Lower Envelope
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-cht-knuth-dp'] = createStepSimulator({
    id: 'sim-cht-knuth-dp',
    aliases: ['sim-cht-envelope', 'sim-convex-hull-trick-lichao'],
    title: 'Convex Hull Trick (CHT) & Li Chao Tree Lower Envelope',
    badge: 'O(N) CHT / O(log X) Li Chao',
    badgeClass: 'badge-ologn',
    blurb: 'Visualize linear DP transitions dp[i] = min_j(m_j·x_i + b_j) as a lower envelope of lines, popping dominated middle lines when intersect(L1, L3) ≤ intersect(L1, L2).',
    slugs: [
      'convex-hull-trick-li-chao-tree',
      'aliens-trick-wqs-binary-search',
      'matrix-exponentiation-linear-recurrences',
      'build-li-chao-convex-hull-dp'
    ],
    presets: [
      { id: 'cht', label: 'CHT Lower Envelope Pruning (intersect(L1,L3) ≤ intersect(L1,L2))' },
      { id: 'lichao', label: 'Li Chao Tree O(log X) Midpoint Split' },
      { id: 'knuth', label: 'D&C / Knuth Quadrangle Inequality (opt[i][j] Monotone)' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'knuth') {
        return [
          {
            stageHtml: renderArrayCells(['opt[i][1]=0', 'opt[i][2]=1', 'opt[i][3]=2 (mid)', 'opt[i][4]∈[2..3]', 'opt[i][5]∈[2..4]'], {
              match: [2],
              active: [3, 4],
              tags: { 2: 'Solved mid=3 → opt=2', 3: 'Bounded ≥ 2', 4: 'Bounded ≥ 2' }
            }),
            invariant: 'Quadrangle Inequality C(a,c)+C(b,d) ≤ C(a,d)+C(b,c) implies opt[i][j-1] ≤ opt[i][j] ≤ opt[i+1][j].',
            metrics: [
              { label: 'Midpoint Split', value: 'mid=3 → opt=2' },
              { label: 'Left Subproblem', value: 'Search k ∈ [optL, 2]' },
              { label: 'Right Subproblem', value: 'Search k ∈ [2, optR]' }
            ],
            log: 'Computing opt[i][mid]=2 partitions the search range for left and right subproblems, yielding O(K N log N).'
          }
        ];
      }

      const renderHullSvg = (popped) => `
        <svg viewBox="0 0 540 185" style="width:100%;height:auto;display:block;">
          <line x1="45" y1="168" x2="505" y2="168" stroke="#475569" stroke-width="1.5"/>
          <line x1="45" y1="15" x2="45" y2="168" stroke="#475569" stroke-width="1.5"/>
          <path d="M 50 38 L 495 145" stroke="#3b82f6" stroke-width="2.5" fill="none"/>
          <path d="M 50 24 L 495 162" stroke="${popped ? '#ef4444' : '#f59e0b'}" stroke-width="2" ${popped ? 'stroke-dasharray="6,4" opacity="0.55"' : ''} fill="none"/>
          ${popped ? '<path d="M 50 12 L 495 172" stroke="#22c55e" stroke-width="3" fill="none"/>' : ''}
          <line x1="${popped ? 185 : 225}" y1="18" x2="${popped ? 185 : 225}" y2="168" stroke="#f59e0b" stroke-dasharray="4,4" stroke-width="1.5"/>
          <text x="${popped ? 192 : 232}" y="32" fill="#fbbf24" font-size="11" font-family="monospace">${popped ? 'x(L1,L3)=3.67 ≤ 5.0 (Pop L2!)' : 'x(L1,L2) = 5.0'}</text>
        </svg>
      `;

      return [
        {
          stageHtml: renderHullSvg(false),
          invariant: 'Hull stack [L1(y=-x+14), L2(y=-2x+19)] with decreasing slopes m1=-1 > m2=-2. Crossover at x = 5.0.',
          metrics: [
            { label: 'Active Hull', value: '[L1, L2]' },
            { label: 'Intersection x(L1, L2)', value: '5.0' },
            { label: 'Optimal for x < 5', value: 'L1' }
          ],
          log: 'Pushed L1 and L2 onto lower hull; L2 becomes optimal for queries x > 5.0.'
        },
        {
          stageHtml: renderHullSvg(true),
          invariant: 'Insert L3(y=-4x+25): intersect(L1,L3) = 3.67 ≤ intersect(L1,L2) = 5.0 ⇒ L2 is dominated everywhere and popped!',
          metrics: [
            { label: 'Active Hull', value: '[L1, L3] (L2 popped)' },
            { label: 'New Crossover x(L1, L3)', value: '3.67' },
            { label: 'Amortized Cost', value: 'O(1) per line' }
          ],
          log: 'L3 overtakes L1 at x=3.67 before L2 can overtake L1 at x=5.0; popped L2 from hull.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 32. Andrew Monotone Chain Convex Hull & Sweep Line
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-convex-hull-sweep'] = createStepSimulator({
    id: 'sim-convex-hull-sweep',
    aliases: ['sim-graham-andrew-convex-hull'],
    title: 'Andrew Monotone Chain Convex Hull & Sweep-Line Events',
    badge: 'O(N log N) · CCW Cross Product',
    badgeClass: 'badge-ologn',
    blurb: 'Trace 2D cross-product orientation tests cross(O, A, B) = (Ax-Ox)(By-Oy) - (Ay-Oy)(Bx-Ox) to prune clockwise interior vertices and detect sweep-line segment intersections.',
    slugs: [
      'geometry-primitives-orientation-ccw',
      'convex-hull-graham-andrew',
      'sweep-line-bentley-ottmann',
      'spatial-indexing-kd-quad-rtrees',
      'build-kd-tree-nearest-neighbor'
    ],
    presets: [
      { id: 'hull', label: 'Andrew Monotone Chain (Pop Clockwise Turn cross ≤ 0)' },
      { id: 'sweep', label: 'Shamos-Hoey Sweep-Line Segment Intersection' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'sweep') {
        return [
          {
            stageHtml: `
              <svg viewBox="0 0 540 185" style="width:100%;height:auto;display:block;">
                <line x1="255" y1="12" x2="255" y2="172" stroke="#f59e0b" stroke-dasharray="4,4" stroke-width="1.5"/>
                <line x1="90" y1="50" x2="410" y2="155" stroke="#3b82f6" stroke-width="2.5"/>
                <line x1="110" y1="160" x2="400" y2="48" stroke="#22c55e" stroke-width="2.5"/>
                <circle cx="255" cy="104" r="6.5" fill="#ef4444" stroke="#fff" stroke-width="2"/>
                <text x="268" y="100" fill="#f87171" font-size="11" font-family="monospace">Straddle Test: d1·d2 &lt; 0 &amp;&amp; d3·d4 &lt; 0</text>
              </svg>
            `,
            invariant: 'Active sweep-line BST maintains segments ordered by y-coordinate; adjacent segments S1, S2 straddle each other (opposite CCW signs).',
            metrics: [
              { label: 'Active Status BST', value: '[S1, S2] adjacent' },
              { label: 'Orientation Signs', value: 'd1·d2 < 0 and d3·d4 < 0' },
              { label: 'Intersection Point', value: '(255, 104)' }
            ],
            log: 'Sweep line inserted S2; neighbor check with S1 detected opposite CCW orientations.'
          }
        ];
      }

      return [
        {
          stageHtml: `
            <svg viewBox="0 0 540 185" style="width:100%;height:auto;display:block;">
              <line x1="80" y1="135" x2="180" y2="115" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5,4"/>
              <line x1="180" y1="115" x2="270" y2="160" stroke="#f59e0b" stroke-width="2.5"/>
              <circle cx="80" cy="135" r="5.5" fill="#22c55e"/><text x="68" y="154" fill="#e2e8f0" font-size="11" font-family="monospace">P0</text>
              <circle cx="180" cy="115" r="5.5" fill="#ef4444"/><text x="168" y="103" fill="#fca5a5" font-size="11" font-family="monospace">P1 (Pop!)</text>
              <circle cx="270" cy="160" r="5.5" fill="#f59e0b"/><text x="262" y="176" fill="#fde68a" font-size="11" font-family="monospace">P2</text>
              <circle cx="380" cy="145" r="5" fill="#64748b"/><text x="374" y="164" fill="#94a3b8" font-size="11" font-family="monospace">P3</text>
              <circle cx="450" cy="90" r="5" fill="#64748b"/><text x="444" y="78" fill="#94a3b8" font-size="11" font-family="monospace">P4</text>
              <circle cx="255" cy="40" r="5" fill="#64748b"/><text x="248" y="28" fill="#94a3b8" font-size="11" font-family="monospace">P5</text>
            </svg>
          `,
          invariant: 'cross(P0, P1, P2) < 0 (Clockwise / Right Turn): P1 lies strictly inside the lower hull and is popped from the stack.',
          metrics: [
            { label: 'Inspected Triple', value: 'P0 → P1 → P2' },
            { label: 'Cross Product', value: 'cross < 0 (Right Turn)' },
            { label: 'Stack Action', value: 'Pop P1, Push P2' }
          ],
          log: 'Right turn detected at P1; popped P1 so lower hull edge connects P0 → P2 directly.'
        },
        {
          stageHtml: `
            <svg viewBox="0 0 540 185" style="width:100%;height:auto;display:block;">
              <polygon points="80,135 270,160 380,145 450,90 255,40" fill="rgba(34,197,94,0.12)" stroke="#22c55e" stroke-width="2.5"/>
              <circle cx="80" cy="135" r="5.5" fill="#22c55e"/><text x="68" y="154" fill="#e2e8f0" font-size="11" font-family="monospace">P0</text>
              <circle cx="180" cy="115" r="4.5" fill="#ef4444"/><text x="165" y="105" fill="#94a3b8" font-size="10" font-family="monospace">P1 (Interior)</text>
              <circle cx="270" cy="160" r="5.5" fill="#22c55e"/><text x="262" y="176" fill="#e2e8f0" font-size="11" font-family="monospace">P2</text>
              <circle cx="380" cy="145" r="5.5" fill="#22c55e"/><text x="374" y="164" fill="#e2e8f0" font-size="11" font-family="monospace">P3</text>
              <circle cx="450" cy="90" r="5.5" fill="#22c55e"/><text x="444" y="78" fill="#e2e8f0" font-size="11" font-family="monospace">P4</text>
              <circle cx="255" cy="40" r="5.5" fill="#22c55e"/><text x="248" y="28" fill="#e2e8f0" font-size="11" font-family="monospace">P5</text>
            </svg>
          `,
          invariant: 'All consecutive boundary edges satisfy cross(H[k-2], H[k-1], H[k]) > 0 (strictly counter-clockwise convex polygon).',
          metrics: [
            { label: 'Convex Hull Vertices', value: '[P0, P2, P3, P4, P5]' },
            { label: 'Pruned Interior', value: 'P1' },
            { label: 'Total Stack Ops', value: '≤ 2N pushes + pops' }
          ],
          log: 'Lower hull [P0, P2, P3, P4] and upper hull [P4, P5, P0] concatenated into CCW convex hull.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 33. Minimax Game Tree with Alpha-Beta Pruning Window [α, β]
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-minimax-alpha-beta'] = createStepSimulator({
    id: 'sim-minimax-alpha-beta',
    title: 'Minimax Game Tree & Alpha-Beta [α, β] Pruning Cutoff Visualizer',
    badge: 'O(b^(d/2)) Optimal Ordering',
    badgeClass: 'badge-ologn',
    blurb: 'Step through a 3-ply Minimax game tree tracking [α, β] bounds at MAX and MIN plies, highlighting β ≤ α cutoffs that prune dead subtrees.',
    slugs: ['minimax-alpha-beta-pruning'],
    presets: [
      { id: 'killer', label: 'Optimal Move Ordering (Immediate β ≤ α Cutoffs)' },
      { id: 'naive', label: 'Naive Ordering vs Principal Variation Window' }
    ],
    buildFrames(preset) {
      const renderTree = (step) => `
        <svg viewBox="0 0 560 205" style="width:100%;height:auto;display:block;">
          <!-- Edges -->
          <line x1="280" y1="30" x2="140" y2="95" stroke="#3b82f6" stroke-width="2"/>
          <line x1="280" y1="30" x2="420" y2="95" stroke="${step >= 2 ? '#22c55e' : '#475569'}" stroke-width="2"/>
          <line x1="140" y1="95" x2="80" y2="165" stroke="#3b82f6" stroke-width="2"/>
          <line x1="140" y1="95" x2="200" y2="165" stroke="#3b82f6" stroke-width="2"/>
          <line x1="420" y1="95" x2="360" y2="165" stroke="${step >= 2 ? '#f59e0b' : '#475569'}" stroke-width="2"/>
          <line x1="420" y1="95" x2="480" y2="165" stroke="${step >= 3 ? '#ef4444' : '#475569'}" stroke-width="2" ${step >= 3 ? 'stroke-dasharray="5,4"' : ''}/>
          ${step >= 3 ? `<text x="455" y="132" fill="#ef4444" font-size="14" font-weight="700">✂ PRUNED (β=2 ≤ α=6)</text>` : ''}
          <!-- Root MAX -->
          <rect x="215" y="10" width="130" height="32" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
          <text x="280" y="30" text-anchor="middle" fill="#f8fafc" font-size="11" font-family="monospace">MAX [α=${step >= 1 ? 6 : '-∞'}, β=+∞]</text>
          <!-- Left MIN -->
          <circle cx="140" cy="95" r="24" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <text x="140" y="99" text-anchor="middle" fill="#e2e8f0" font-size="10.5" font-family="monospace">MIN: 6</text>
          <!-- Right MIN -->
          <circle cx="420" cy="95" r="24" fill="#0f172a" stroke="${step >= 3 ? '#ef4444' : '#f59e0b'}" stroke-width="2"/>
          <text x="420" y="99" text-anchor="middle" fill="#e2e8f0" font-size="10.5" font-family="monospace">MIN≤${step >= 2 ? '2' : '+∞'}</text>
          <!-- Leaves -->
          <rect x="55" y="160" width="50" height="28" rx="4" fill="#1e293b" stroke="#22c55e"/><text x="80" y="178" text-anchor="middle" fill="#4ade80" font-size="11" font-family="monospace">6</text>
          <rect x="175" y="160" width="50" height="28" rx="4" fill="#1e293b" stroke="#64748b"/><text x="200" y="178" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="monospace">9</text>
          <rect x="335" y="160" width="50" height="28" rx="4" fill="#1e293b" stroke="#f59e0b"/><text x="360" y="178" text-anchor="middle" fill="#fcd34d" font-size="11" font-family="monospace">2</text>
          <rect x="455" y="160" width="50" height="28" rx="4" fill="${step >= 3 ? 'rgba(239,68,68,0.2)' : '#1e293b'}" stroke="#ef4444"/><text x="480" y="178" text-anchor="middle" fill="#fca5a5" font-size="11" font-family="monospace">${step >= 3 ? 'SKIP' : '?'}</text>
        </svg>
      `;
      return [
        {
          stageHtml: renderTree(1),
          invariant: 'Left MIN node evaluates leaves min(6, 9) = 6; Root MAX updates lower bound α = max(-∞, 6) = 6.',
          metrics: [
            { label: 'Root Window', value: '[α = 6, β = +∞]' },
            { label: 'Left MIN Value', value: 'min(6, 9) = 6' },
            { label: 'Leaves Evaluated', value: '2' }
          ],
          log: 'Evaluated left MIN subtree: min(6, 9) = 6. Root MAX raises α = 6.'
        },
        {
          stageHtml: renderTree(2),
          invariant: 'Right MIN node inherits [α = 6, β = +∞] and inspects first child leaf = 2 ⇒ updates β = min(+∞, 2) = 2.',
          metrics: [
            { label: 'Right MIN Window', value: '[α = 6, β = 2]' },
            { label: 'First Child Value', value: '2' },
            { label: 'Cutoff Check', value: 'β (2) ≤ α (6) TRUE!' }
          ],
          log: 'Right MIN sees leaf 2, lowering β to 2. Since β ≤ α (2 ≤ 6), MAX will never choose this branch.'
        },
        {
          stageHtml: renderTree(3),
          invariant: 'Alpha-Cutoff: Since β = 2 ≤ α = 6, remaining children of Right MIN cannot raise its value above 2 and are pruned!',
          metrics: [
            { label: 'Minimax Root Value', value: '6 (Exact)' },
            { label: 'Pruned Branches', value: '1 subtree skipped' },
            { label: 'Effective Branching', value: '√b ≈ b^(d/2)' }
          ],
          log: 'Pruned right child of Right MIN node; Root MAX locks in optimal value 6.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 34. Greedy Matroid Exchange, Regret-Greedy & CDCL SAT Solver
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-greedy-matroid-cdcl'] = createStepSimulator({
    id: 'sim-greedy-matroid-cdcl',
    title: 'Regret-Greedy Heap Rollback, Matroid Basis & CDCL SAT Implication Graph',
    badge: 'O(N log N) Regret / 1-UIP CDCL',
    badgeClass: 'badge-ologn',
    blurb: 'Trace Moore-Hodgson Regret-Greedy max-heap job eviction, weighted Matroid greedy basis construction, and CDCL SAT unit propagation + 1-UIP conflict clause learning.',
    slugs: [
      'greedy-choice-exchange-arguments',
      'matroids-greedy-foundations',
      'regret-greedy-heap-rollback',
      'case-sat-solvers-cdcl-dpll'
    ],
    presets: [
      { id: 'regret', label: 'Moore-Hodgson Regret-Greedy (Max-Heap Duration Eviction)' },
      { id: 'cdcl', label: 'CDCL SAT Implication Graph & 1-UIP Learned Clause' },
      { id: 'matroid', label: 'Weighted Matroid Greedy Independent Basis' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'cdcl') {
        return [
          {
            stageHtml: `
              <svg viewBox="0 0 560 175" style="width:100%;height:auto;display:block;">
                <rect x="20" y="65" width="105" height="36" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
                <text x="72" y="87" text-anchor="middle" fill="#93c5fd" font-size="11" font-family="monospace">x1=T @ dl=1</text>
                <rect x="165" y="25" width="110" height="36" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
                <text x="220" y="47" text-anchor="middle" fill="#fde68a" font-size="11" font-family="monospace">x2=T @ dl=2 (UIP)</text>
                <rect x="320" y="25" width="105" height="36" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                <text x="372" y="47" text-anchor="middle" fill="#e2e8f0" font-size="11" font-family="monospace">x3=T (Unit)</text>
                <rect x="320" y="105" width="105" height="36" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                <text x="372" y="127" text-anchor="middle" fill="#e2e8f0" font-size="11" font-family="monospace">x4=F (Unit)</text>
                <rect x="455" y="65" width="85" height="36" rx="6" fill="rgba(239,68,68,0.25)" stroke="#ef4444" stroke-width="2"/>
                <text x="497" y="87" text-anchor="middle" fill="#fca5a5" font-size="11" font-weight="700" font-family="monospace">⊥ CONFLICT</text>
                <line x1="275" y1="43" x2="320" y2="43" stroke="#94a3b8" stroke-width="1.8"/>
                <line x1="275" y1="52" x2="320" y2="115" stroke="#94a3b8" stroke-width="1.8"/>
                <line x1="125" y1="83" x2="320" y2="123" stroke="#94a3b8" stroke-width="1.8"/>
                <line x1="425" y1="43" x2="455" y2="75" stroke="#ef4444" stroke-width="2"/>
                <line x1="425" y1="123" x2="455" y2="90" stroke="#ef4444" stroke-width="2"/>
                <line x1="295" y1="10" x2="295" y2="165" stroke="#22c55e" stroke-dasharray="5,4" stroke-width="2"/>
                <text x="295" y="162" text-anchor="middle" fill="#4ade80" font-size="10.5" font-family="monospace">1-UIP Cut ⇒ Learn (¬x1 ∨ ¬x2)</text>
              </svg>
            `,
            invariant: '1-UIP Cut: Node x2@dl=2 dominates all paths from the current decision level to the conflict node κ. Learned clause: (¬x1 ∨ ¬x2).',
            metrics: [
              { label: 'Decision Level', value: 'dl = 2 (x2 = True)' },
              { label: 'Learned Clause', value: '(¬x1 ∨ ¬x2)' },
              { label: 'Backjump Target', value: 'dl = 1 (assert x2 = False)' }
            ],
            log: 'Unit propagation hit conflict via x3=T and x4=F; 1-UIP resolution learns (¬x1 ∨ ¬x2) and backjumps to dl=1.'
          }
        ];
      }
      return [
        {
          stageHtml: renderArrayCells(['J1 (p=4, d=4)', 'J2 (p=3, d=6)', 'J3 (p=2, d=7)'], {
            active: [0, 1],
            warn: [0],
            tags: { 0: 'Max p=4 in Heap', 1: 'Total time=7 > d=6!', 2: 'Next' }
          }),
          invariant: 'Moore-Hodgson Regret Invariant: Accepting J2 pushes total time to 4+3=7 > d2=6. Pop max-duration job J1 (p=4) from heap to restore feasibility!',
          metrics: [
            { label: 'Before Eviction', value: 'Time = 7 > Deadline 6' },
            { label: 'Max-Heap Eviction', value: 'Drop J1 (p=4)' },
            { label: 'After Eviction', value: 'Time = 3 ≤ 6 (Feasible)' }
          ],
          log: 'Deadline overflow at J2; max-heap evicts longest accepted job J1 (p=4), reducing total time from 7 to 3.'
        },
        {
          stageHtml: renderArrayCells(['J1 (Evicted)', 'J2 (p=3, d=6)', 'J3 (p=2, d=7)'], {
            match: [1, 2],
            warn: [0],
            tags: { 0: 'Dropped', 1: 'Kept (t=3)', 2: 'Kept (t=5 ≤ 7)' }
          }),
          invariant: 'Swapping J1 (p=4) for J2 (p=3) kept Schedule cardinality equal while strictly decreasing completion time, allowing J3 (p=2, d=7) to fit!',
          metrics: [
            { label: 'Optimal Set', value: '{J2, J3} (2 jobs on time)' },
            { label: 'Total Elapsed Time', value: '3 + 2 = 5 ≤ 7' },
            { label: 'Complexity', value: 'O(N log N)' }
          ],
          log: 'Appended J3 (p=2, d=7): total time 3+2=5 ≤ 7. Maximum 2 on-time jobs scheduled!'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 35. Sequence DP: Levenshtein, Hirschberg Linear-Space Split & Knuth-Plass
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-edit-distance-myers'] = createStepSimulator({
    id: 'sim-edit-distance-myers',
    title: 'Hirschberg O(min(N,M))-Space Midpoint Split & Levenshtein DP',
    badge: 'O(N·M) Time · O(min(N,M)) Space',
    badgeClass: 'badge-on2',
    blurb: 'Visualize how Hirschberg runs forward 2-row DP on the top half and reverse 2-row DP on the bottom half to locate the optimal midpoint crossing (M/2, k*) in linear memory.',
    slugs: [
      'sequence-dp-lcs-levenshtein',
      'case-pretty-printing-knuth-plass',
      'build-hirschberg-linear-space-diff'
    ],
    presets: [
      { id: 'hirschberg', label: 'Hirschberg Forward + Reverse Midpoint Split (M/2, k*)' },
      { id: 'knuthplass', label: 'Knuth-Plass Badness β³ Paragraph Line-Breaking DP' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'knuthplass') {
        return [
          {
            stageHtml: renderArrayCells(['Line 1: slack=2 (β³=8)', 'Line 2: slack=1 (β³=1)', 'Greedy: slack=0 then 5 (β³=125)'], {
              match: [0, 1],
              warn: [2],
              tags: { 0: 'DP Choice', 1: 'DP Total = 9', 2: 'Greedy Total = 125' }
            }),
            invariant: 'Knuth-Plass minimizes ∑ (slack_k)³ across the entire paragraph: breaking 1 word earlier on Line 1 reduces total cubic badness from 125 to 9.',
            metrics: [
              { label: 'Greedy Cubic Cost', value: '0³ + 5³ = 125' },
              { label: 'Knuth-Plass DP Cost', value: '2³ + 1³ = 9' },
              { label: 'Active Breakpoints', value: 'O(N) via Slack Pruning' }
            ],
            log: 'Evaluated cubic badness transitions dp[j] = min_i (dp[i] + badness(i+1, j)³).'
          }
        ];
      }
      return [
        {
          stageHtml: `
            <svg viewBox="0 0 560 175" style="width:100%;height:auto;display:block;">
              <rect x="60" y="15" width="440" height="65" rx="6" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" stroke-width="1.5"/>
              <text x="80" y="42" fill="#93c5fd" font-size="11" font-family="monospace">Forward 2-Row DP: X[0..M/2] → fwd[k] = [0, 1, 2, 2, 3]</text>
              <rect x="60" y="90" width="440" height="65" rx="6" fill="rgba(168,85,247,0.12)" stroke="#a855f7" stroke-width="1.5"/>
              <text x="80" y="132" fill="#d8b4fe" font-size="11" font-family="monospace">Reverse 2-Row DP: X[M/2..M] ← rev[k] = [4, 3, 2, 1, 0]</text>
              <line x1="60" y1="85" x2="500" y2="85" stroke="#22c55e" stroke-width="2.5" stroke-dasharray="6,4"/>
              <circle cx="280" cy="85" r="8" fill="#22c55e" stroke="#fff" stroke-width="2"/>
              <text x="295" y="76" fill="#4ade80" font-size="11.5" font-weight="700" font-family="monospace">k* = argmax(fwd[k] + rev[k]) = 2 (LCS = 4)</text>
            </svg>
          `,
          invariant: 'Hirschberg Midpoint Theorem: max_k (LCS(X[1..m/2], Y[1..k]) + LCS(rev(X[m/2+1..m]), rev(Y[k+1..n]))) = LCS(X, Y).',
          metrics: [
            { label: 'Midpoint Row', value: 'i = M / 2' },
            { label: 'Optimal Split Column', value: 'k* = 2 (fwd[2]+rev[2] = 4)' },
            { label: 'Work / Space', value: '∑ Area = 2·N·M, Space = O(N)' }
          ],
          log: 'Found midpoint crossing (M/2, k*=2); recursing on top-left (M/2 × k*) and bottom-right (M/2 × (N-k*)) halves.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 36. Interval DP Wavefront & Two-Pass Tree Rerooting DP
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-interval-tree-rerooting-dp'] = createStepSimulator({
    id: 'sim-interval-tree-rerooting-dp',
    title: 'Interval DP Wavefront (Matrix Chain) & Two-Pass Tree Rerooting DP',
    badge: 'O(N³) Interval / O(N) Rerooting',
    badgeClass: 'badge-on2',
    blurb: 'Step through upper-triangular Interval DP diagonal wavefronts dp[i][j] by length L = 2..N, or trace Two-Pass Tree Rerooting (bottom-up subtree down[u] + top-down prefix/suffix up[u]).',
    slugs: [
      'interval-dp-matrix-chain-triangulation',
      'tree-dp-rerooting-technique'
    ],
    presets: [
      { id: 'interval', label: 'Interval DP Diagonal Wavefront (Matrix Chain / Triangulation)' },
      { id: 'reroot', label: 'Two-Pass Tree Rerooting DP (down[u] + up[u] Prefix/Suffix)' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'reroot') {
        return [
          {
            stageHtml: `
              <svg viewBox="0 0 560 175" style="width:100%;height:auto;display:block;">
                <line x1="280" y1="35" x2="160" y2="115" stroke="#22c55e" stroke-width="2.5"/>
                <line x1="280" y1="35" x2="400" y2="115" stroke="#3b82f6" stroke-width="2.5"/>
                <circle cx="280" cy="35" r="24" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
                <text x="280" y="39" text-anchor="middle" fill="#f8fafc" font-size="10.5" font-family="monospace">u=0 (d=8)</text>
                <circle cx="160" cy="115" r="24" fill="#1e293b" stroke="#22c55e" stroke-width="2.5"/>
                <text x="160" y="119" text-anchor="middle" fill="#4ade80" font-size="10.5" font-family="monospace">v=1 (up=5)</text>
                <circle cx="400" cy="115" r="24" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
                <text x="400" y="119" text-anchor="middle" fill="#cbd5e1" font-size="10.5" font-family="monospace">w=2 (d=3)</text>
                <text x="280" y="160" text-anchor="middle" fill="#93c5fd" font-size="11" font-family="monospace">Pass 2: up[v] = combine(up[u], pref[i-1], suff[i+1]) + sz_outside</text>
              </svg>
            `,
            invariant: 'Pass 1 computes down[u] bottom-up; Pass 2 computes up[v] in O(1) using prefix/suffix child aggregates of u without division.',
            metrics: [
              { label: 'Pass 1 (Post-Order)', value: 'down[u] & sz[u] computed' },
              { label: 'Pass 2 (Pre-Order)', value: 'ans[v] = down[v] ⊕ up[v]' },
              { label: 'Total Complexity', value: 'O(N) for all N roots' }
            ],
            log: 'Transferred root from u=0 to child v=1 in O(1) using prefix/suffix sibling aggregates.'
          }
        ];
      }
      return [
        {
          stageHtml: renderArrayCells(['len=1: dp[i][i]=0', 'len=2: dp[1][2]=60, dp[2][3]=150', 'len=3: dp[1][3]=min(k=1, k=2)=90', 'len=4: dp[1][4]=130'], {
            match: [2, 3],
            active: [1],
            tags: { 0: 'Base Diagonal', 1: 'Wavefront L=2', 2: 'Split k*=2', 3: 'Optimal Full Chain' }
          }),
          invariant: 'Interval DP Topological Order: Outer loop MUST iterate interval length L = 2..N so shorter sub-intervals dp[i][k] and dp[k+1][j] are already solved.',
          metrics: [
            { label: 'Outer Loop', value: 'Length L = 2 → N' },
            { label: 'Transition', value: 'min_{i≤k<j} (dp[i][k] + dp[k+1][j] + p_{i-1}p_k p_j)' },
            { label: 'Optimal Cost dp[1][4]', value: '130 scalar multiplies' }
          ],
          log: 'Swept upper-triangular diagonals L=2, 3, 4; optimal parenthesization ((A1·A2)·A3)·A4 = 130.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 37. Bitmask TSP, SOS DP Hypercube & Broken Profile Tiling
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-bitmask-sos-broken-profile'] = createStepSimulator({
    id: 'sim-bitmask-sos-broken-profile',
    title: 'SOS DP (Sum Over Subsets) Hypercube, Digit DP & Broken Profile Tiling',
    badge: 'O(N·2^N) SOS / Broken Profile',
    badgeClass: 'badge-on2',
    blurb: 'Trace dimension-by-dimension SOS DP bit-flips F[mask] += F[mask ^ (1<<i)] without overcounting, Broken Profile staircase wavefront domino tiling, and Digit DP tight-prefix automata.',
    slugs: [
      'bitmask-dp-tsp-hamiltonian',
      'sos-dp-fast-zeta-mobius',
      'digit-dp-lexicographic-automata',
      'broken-profile-dp-grid-tiling'
    ],
    presets: [
      { id: 'sos', label: 'SOS DP Dimension-by-Dimension Hypercube Sweep O(N·2^N)' },
      { id: 'profile', label: 'Broken Profile Domino Tiling Staircase Wavefront' },
      { id: 'digit', label: 'Digit DP Lexicographic Tight-Prefix Automaton (tight=0/1)' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'profile') {
        return [
          {
            stageHtml: `
              <svg viewBox="0 0 560 165" style="width:100%;height:auto;display:block;">
                <rect x="140" y="20" width="60" height="40" fill="rgba(34,197,94,0.25)" stroke="#22c55e" stroke-width="2"/>
                <rect x="200" y="20" width="60" height="40" fill="rgba(34,197,94,0.25)" stroke="#22c55e" stroke-width="2"/>
                <rect x="140" y="60" width="60" height="80" fill="rgba(59,130,246,0.25)" stroke="#3b82f6" stroke-width="2"/>
                <rect x="200" y="60" width="60" height="40" fill="rgba(245,158,11,0.28)" stroke="#f59e0b" stroke-width="2.5"/>
                <polyline points="140,140 200,140 200,100 260,100 260,60" fill="none" stroke="#ef4444" stroke-width="3.5"/>
                <text x="300" y="65" fill="#fde68a" font-size="11.5" font-family="monospace">Active Cell (r, c): Profile Mask = 101₂</text>
                <text x="300" y="95" fill="#93c5fd" font-size="11" font-family="monospace">Bit=0 ⇒ Place Vertical (set bit=1) or Horizontal (set 2 bits)</text>
              </svg>
            `,
            invariant: 'Broken Profile Boundary: Only the M cells along the staircase frontier between processed and unprocessed grid squares are stored in the bitmask.',
            metrics: [
              { label: 'Profile Bitmask', value: 'M bits (2^M states)' },
              { label: 'Cell Transition', value: 'O(1) per (r, c, mask)' },
              { label: 'Total Complexity', value: 'O(N · M · 2^M)' }
            ],
            log: 'Advanced broken-profile staircase past cell (r, c) by shifting mask bits in O(1).'
          }
        ];
      }
      if (preset?.id === 'digit') {
        return [
          {
            stageHtml: renderArrayCells(['pos=0: d=3 (tight=1)', 'pos=1: d<4 → tight=0 (Free 0..9)', 'pos=1: d==4 → tight=1 (Bounded)'], {
              match: [1],
              active: [0, 2],
              tags: { 0: 'Prefix "3"', 1: 'Memoized dp[pos][state]', 2: 'Prefix "34"' }
            }),
            invariant: 'Digit DP State Compression: Once tight == 0 (prefix strictly less than N[0..pos]), all remaining suffixes share the exact same memoized state dp[pos][0][state].',
            metrics: [
              { label: 'Bound N', value: 'N = "3482"' },
              { label: 'State Space', value: 'O(log₁₀(N) · 2 · S)' },
              { label: 'Range [L, R]', value: 'solve(R) - solve(L - 1)' }
            ],
            log: 'Branched on digit d < N[pos] (tight → 0, memoized) vs d == N[pos] (tight stays 1).'
          }
        ];
      }
      return [
        {
          stageHtml: renderArrayCells(['F[00]=a₀', 'F[01]=a₀+a₁ (bit 0)', 'F[10]=a₂', 'F[11]=a₂+a₃ (bit 0) → +F[01] (bit 1)'], {
            match: [1, 3],
            active: [0, 2],
            tags: { 0: '00₂', 1: 'Dim i=0 merged', 2: '10₂', 3: 'Dim i=1 → ∑ all 4' }
          }),
          invariant: 'SOS DP Invariant: After outer loop dimension i, F[mask] aggregates all submasks that may differ from mask only in bits 0..i (zero duplicate paths!).',
          metrics: [
            { label: '3^N Submask Loop', value: 'O(3^N) = 59,049 (N=10)' },
            { label: 'SOS DP N·2^N', value: 'O(N·2^N) = 10,240 (N=10)' },
            { label: 'Update Rule', value: 'if (mask & (1<<i)) F[mask] += F[mask^(1<<i)]' }
          ],
          log: 'Swept dimensions i = 0..N-1; each hypercube edge is traversed once in O(N · 2^N).'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 38. Divide-and-Conquer DP & Knuth Optimization Quadrangle Matrix
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-dc-knuth-quadrangle-dp'] = createStepSimulator({
    id: 'sim-dc-knuth-quadrangle-dp',
    title: 'Quadrangle Inequality: D&C DP & Knuth Optimization Decision Matrix',
    badge: 'O(K·N log N) D&C / O(N²) Knuth',
    badgeClass: 'badge-ologn',
    blurb: 'Inspect how Quadrangle Inequality C(a,c)+C(b,d) ≤ C(a,d)+C(b,c) forces decision monotonicity opt[i][j-1] ≤ opt[i][j] ≤ opt[i+1][j], collapsing O(N³) transitions.',
    slugs: [
      'divide-and-conquer-dp-quadrangle',
      'knuth-optimization-optimal-bst'
    ],
    presets: [
      { id: 'dcdp', label: 'Divide-and-Conquer DP Midpoint Split [optL, optR] O(K·N log N)' },
      { id: 'knuth', label: 'Knuth Optimization Telescoping Sum O(N²) (Optimal BST)' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'knuth') {
        return [
          {
            stageHtml: renderArrayCells(['opt[i][j-1] = 2', 'Search k ∈ [2..5]', 'opt[i+1][j] = 5', 'Telescoping ∑ = O(N)'], {
              match: [1, 3],
              active: [0, 2],
              tags: { 0: 'Lower Bound', 1: '4 candidates (not N!)', 2: 'Upper Bound', 3: 'O(N²) Total' }
            }),
            invariant: 'Knuth Telescoping Bound: Along diagonal length L = j - i, ∑ (opt[i+1][j] - opt[i][j-1]) telescopes to at most 2N operations per diagonal!',
            metrics: [
              { label: 'Search Window', value: 'k ∈ [opt[i][j-1], opt[i+1][j]]' },
              { label: 'Work per Diagonal L', value: 'O(N) via Telescoping Sum' },
              { label: 'Total Complexity', value: 'O(N³) → O(N²)' }
            ],
            log: 'Bounded k between opt[i][j-1]=2 and opt[i+1][j]=5; diagonal sum telescopes to O(N).'
          }
        ];
      }
      return [
        {
          stageHtml: renderArrayCells(['L=0..2: k∈[0, 2]', 'mid=3 → opt*=2', 'R=4..6: k∈[2, 5]'], {
            match: [1],
            active: [0, 2],
            tags: { 0: 'Left Branch ≤ 2', 1: 'Solved Midpoint', 2: 'Right Branch ≥ 2' }
          }),
          invariant: 'D&C DP Recursion Tree: Solving mid=(L+R)/2 finds opt*=2, splitting the transition range into [optL, 2] for left and [2, optR] for right (O(N) work per tree level).',
          metrics: [
            { label: 'Midpoint Solved', value: 'j = mid = 3 → opt* = 2' },
            { label: 'Recursion Depth', value: 'O(log N) levels' },
            { label: 'Layer Complexity', value: 'O(N²) → O(N log N)' }
          ],
          log: 'Evaluated mid=3 over [optL..optR]; partitioned decision intervals for left and right children.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 39. Number Theory: Extended GCD, Miller-Rabin & Pollard's Rho
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-number-theory-miller-pollard'] = createStepSimulator({
    id: 'sim-number-theory-miller-pollard',
    title: 'Extended Euclidean Bézout, Miller-Rabin Witness & Pollard Rho Cycle',
    badge: 'O(log³ n) Primality / O(n^(1/4)) Rho',
    badgeClass: 'badge-ologn',
    blurb: 'Step through Extended GCD Bézout coefficients ax + by = gcd(a,b), Miller-Rabin modular squaring witness chains, and Pollard Rho cycle detection gcd(|x-y|, n) > 1.',
    slugs: [
      'modular-arithmetic-gcd-crt',
      'primality-miller-rabin-pollard-rho'
    ],
    presets: [
      { id: 'pollard', label: 'Pollard Rho Birthday Cycle Factorization (n = 91 = 7 × 13)' },
      { id: 'millerrabin', label: 'Miller-Rabin Witness Squaring Chain (n-1 = 2^s · d)' },
      { id: 'extgcd', label: 'Extended Euclidean Bézout Identity (a·x + b·y = gcd)' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'extgcd') {
        return [
          {
            stageHtml: renderArrayCells(['gcd(30, 12): 30 = 2·12 + 6', 'gcd(12, 6): 12 = 2·6 + 0', 'Back-sub: 6 = 1·30 - 2·12'], {
              match: [2],
              active: [0, 1],
              tags: { 0: 'q=2, r=6', 1: 'Base gcd=6', 2: 'x=1, y=-2' }
            }),
            invariant: 'Bézout Identity: At every Euclidean step, x_prev = y_curr and y_prev = x_curr - ⌊a/b⌋·y_curr maintains a·x + b·y = gcd(a, b).',
            metrics: [
              { label: 'Inputs (a, b)', value: '(30, 12) → gcd = 6' },
              { label: 'Bézout Coefficients', value: 'x = 1, y = -2' },
              { label: 'Verification', value: '30(1) + 12(-2) = 6' }
            ],
            log: 'Unwound Euclidean quotients to compute Bézout coefficients (x=1, y=-2).'
          }
        ];
      }
      if (preset?.id === 'millerrabin') {
        return [
          {
            stageHtml: renderArrayCells(['n=561 (Carmichael): d=35, s=4', 'a^d ≡ 2^35 ≡ 263 (mod 561)', '263² ≡ 166', '166² ≡ 67', '67² ≡ 1 (Witness!)'], {
              warn: [3, 4],
              active: [0, 1, 2],
              tags: { 0: '560 = 2⁴·35', 3: '67 ≢ ±1 (mod 561)', 4: '67² ≡ 1 ⇒ COMPOSITE!' }
            }),
            invariant: 'Non-Trivial Square Root of 1: 67 ≢ ±1 (mod 561), yet 67² ≡ 1 (mod 561). Therefore gcd(67-1, 561) = 33 divides 561 (Carmichael number caught!).',
            metrics: [
              { label: 'Tested n', value: '561 = 3 × 11 × 17' },
              { label: 'Witness Base a', value: 'a = 2' },
              { label: 'Non-Trivial Root', value: '67² ≡ 1 (mod 561)' }
            ],
            log: 'Miller-Rabin caught Carmichael number 561 via non-trivial square root 67 of unity.'
          }
        ];
      }
      return [
        {
          stageHtml: `
            <svg viewBox="0 0 560 165" style="width:100%;height:auto;display:block;">
              <circle cx="110" cy="115" r="22" fill="#1e293b" stroke="#64748b" stroke-width="2"/><text x="110" y="119" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="monospace">x₀=2</text>
              <circle cx="205" cy="115" r="22" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="205" y="119" text-anchor="middle" fill="#93c5fd" font-size="11" font-family="monospace">x₁=5</text>
              <circle cx="310" cy="65" r="24" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/><text x="310" y="69" text-anchor="middle" fill="#fde68a" font-size="11" font-family="monospace">x₂=26</text>
              <circle cx="430" cy="65" r="24" fill="rgba(34,197,94,0.22)" stroke="#22c55e" stroke-width="2.5"/><text x="430" y="69" text-anchor="middle" fill="#4ade80" font-size="11" font-family="monospace">x₃=40</text>
              <line x1="132" y1="115" x2="183" y2="115" stroke="#64748b" stroke-width="2"/>
              <line x1="225" y1="104" x2="288" y2="75" stroke="#3b82f6" stroke-width="2"/>
              <line x1="334" y1="65" x2="406" y2="65" stroke="#22c55e" stroke-width="2"/>
              <text x="280" y="145" text-anchor="middle" fill="#4ade80" font-size="11.5" font-family="monospace">x₂=26 ≡ 5 (mod 7), x₄=53 ≡ 4, gcd(|26 - 5|, 91) = gcd(21, 91) = 7!</text>
            </svg>
          `,
          invariant: 'Pollard Rho Birthday Collision mod p: Even before x_i = x_j (mod n), x_i ≡ x_j (mod p) occurs in O(√p) ≤ O(n^(1/4)) steps, revealed by gcd(|x - y|, n) = p!',
          metrics: [
            { label: 'Polynomial Map', value: 'f(x) = (x² + 1) mod 91' },
            { label: 'Collision Check', value: 'gcd(|26 - 5|, 91) = 7' },
            { label: 'Factorization', value: '91 = 7 × 13' }
          ],
          log: 'Floyd tortoise-hare on f(x)=(x²+1) mod 91 found gcd(|x₂ - x₁|, 91) = 7 in 3 steps.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 40. Karger Randomized Min-Cut, 3-SAT Reduction & Knapsack FPTAS
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-karger-np-reduction-fptas'] = createStepSimulator({
    id: 'sim-karger-np-reduction-fptas',
    title: 'Karger Randomized Edge Contraction, 3-SAT Gadget & Knapsack FPTAS',
    badge: 'Pr ≥ 2/(n(n-1)) · (1-ε) FPTAS',
    badgeClass: 'badge-ologn',
    blurb: 'Simulate Karger random multigraph edge contractions down to 2 supernodes, 3-SAT ≤_p Vertex Cover gadget graphs, and Knapsack FPTAS value-bucket scaling K = εP/n.',
    slugs: [
      'las-vegas-monte-carlo-karger',
      'np-completeness-reductions',
      'approximation-algorithms-fptas'
    ],
    presets: [
      { id: 'karger', label: 'Karger Randomized Edge Contraction Min-Cut (Pr ≥ 1/C(n,2))' },
      { id: 'satvc', label: '3-SAT ≤_p Vertex Cover Gadget (Variable Edges + Clause Triangles)' },
      { id: 'fptas', label: 'Knapsack FPTAS Value Scaling v\' = ⌊v / (εP/n)⌋' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'satvc') {
        return [
          {
            stageHtml: `
              <svg viewBox="0 0 560 165" style="width:100%;height:auto;display:block;">
                <circle cx="95" cy="40" r="18" fill="rgba(34,197,94,0.3)" stroke="#22c55e" stroke-width="2"/><text x="95" y="44" text-anchor="middle" fill="#4ade80" font-size="11" font-family="monospace">x₁</text>
                <circle cx="175" cy="40" r="18" fill="#1e293b" stroke="#64748b" stroke-width="2"/><text x="175" y="44" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="monospace">¬x₁</text>
                <line x1="113" y1="40" x2="157" y2="40" stroke="#94a3b8" stroke-width="2"/>
                <polygon points="350,30 300,120 400,120" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" stroke-width="2"/>
                <circle cx="350" cy="30" r="16" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="350" y="34" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="monospace">c₁</text>
                <circle cx="300" cy="120" r="16" fill="rgba(34,197,94,0.3)" stroke="#22c55e" stroke-width="2"/><text x="300" y="124" text-anchor="middle" fill="#4ade80" font-size="10" font-family="monospace">c₂</text>
                <circle cx="400" cy="120" r="16" fill="rgba(34,197,94,0.3)" stroke="#22c55e" stroke-width="2"/><text x="400" y="124" text-anchor="middle" fill="#4ade80" font-size="10" font-family="monospace">c₃</text>
                <line x1="95" y1="58" x2="334" y2="30" stroke="#22c55e" stroke-dasharray="4,4" stroke-width="2"/>
                <text x="195" y="152" fill="#e2e8f0" font-size="11" font-family="monospace">Target Cover Size k = n_vars + 2·m_clauses (1 per var + 2 per triangle)</text>
              </svg>
            `,
            invariant: '3-SAT ≤_p Vertex Cover: Every variable edge requires ≥1 vertex; every clause triangle requires ≥2 vertices. Cross-edges are covered iff ≥1 literal in each clause is True!',
            metrics: [
              { label: 'Variable Gadget', value: '1 edge (2 vertices) per x_i' },
              { label: 'Clause Gadget', value: 'K₃ triangle (3 vertices) per clause' },
              { label: 'Cover Threshold', value: 'k = n + 2m' }
            ],
            log: 'Picking x₁=True covers cross-edge (x₁, c₁), allowing {c₂, c₃} to cover the clause triangle.'
          }
        ];
      }
      if (preset?.id === 'fptas') {
        return [
          {
            stageHtml: renderArrayCells(['v = [420, 860, 1250]', 'Scale K = ε·P/n = 20', 'v\' = ⌊v/K⌋ = [21, 43, 62]', 'DP State ∑v\' ≤ n²/ε'], {
              match: [2, 3],
              active: [0, 1],
              tags: { 0: 'Large Values', 1: 'Rounding Step K', 2: 'Scaled Integers', 3: 'O(n³ / ε) Time' }
            }),
            invariant: 'FPTAS Error Bound: Each of the ≤ n selected items loses at most K = ε·P/n value from floor rounding, so total loss ≤ n·K = ε·P ≤ ε·OPT!',
            metrics: [
              { label: 'Scale Factor K', value: 'K = (ε · max_v) / n' },
              { label: 'Approximation Ratio', value: '≥ (1 - ε) · OPT' },
              { label: 'Time Complexity', value: 'O(n³ / ε) (Poly in n and 1/ε)' }
            ],
            log: 'Scaled item values by K = εP/n and solved min-weight DP over bounded value sum O(n²/ε).'
          }
        ];
      }
      return [
        {
          stageHtml: `
            <svg viewBox="0 0 560 165" style="width:100%;height:auto;display:block;">
              <circle cx="150" cy="85" r="32" fill="rgba(59,130,246,0.22)" stroke="#3b82f6" stroke-width="2.5"/>
              <text x="150" y="89" text-anchor="middle" fill="#93c5fd" font-size="11.5" font-weight="700" font-family="monospace">{A, B, C}</text>
              <circle cx="410" cy="85" r="32" fill="rgba(168,85,247,0.22)" stroke="#a855f7" stroke-width="2.5"/>
              <text x="410" y="89" text-anchor="middle" fill="#d8b4fe" font-size="11.5" font-weight="700" font-family="monospace">{D}</text>
              <path d="M 182 75 Q 280 45 378 75" fill="none" stroke="#22c55e" stroke-width="2.5"/>
              <path d="M 182 95 Q 280 125 378 95" fill="none" stroke="#22c55e" stroke-width="2.5"/>
              <line x1="280" y1="20" x2="280" y2="150" stroke="#ef4444" stroke-dasharray="5,4" stroke-width="2"/>
              <text x="280" y="158" text-anchor="middle" fill="#4ade80" font-size="11" font-family="monospace">2 Supernodes Remaining ⇒ Cut Value = 2 Parallel Edges</text>
            </svg>
          `,
          invariant: 'Since min-cut c ≤ 2E/V, a random contraction misses C* with probability ≥ 1 - 2/V. Telescoping over V-2 contractions gives Pr[Min-Cut] ≥ 2 / (V(V-1)).',
          metrics: [
            { label: 'Single Run Success', value: 'Pr ≥ 2 / (n(n - 1))' },
            { label: 'Karger-Stein Fast Cut', value: 'O(n² log³ n) w.h.p.' },
            { label: 'Surviving Cut', value: '({A,B,C}, {D}) = 2 edges' }
          ],
          log: 'Contracted non-cut edges (A,B) and (B,C); 2 supernodes {A,B,C} and {D} reveal min-cut of size 2.'
        }
      ];
    }
  });
})();
