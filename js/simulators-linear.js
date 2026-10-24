/* ═══════════════════════════════════════════════════════════════
   DSA In Depth — Track I Simulators (Linear & Memory Hierarchy)
   1. sim-memory-cache-stride
   2. sim-dynamic-array-amortized
   3. sim-two-pointers-window
   4. sim-monotonic-stack-queue
   5. sim-linked-list-floyd
   6. sim-skiplist-lanes
   ═══════════════════════════════════════════════════════════════ */

window.SIMULATORS = window.SIMULATORS || {};

(() => {
  const { esc, createStepSimulator, renderArrayCells } = window.Simulators;

  // ───────────────────────────────────────────────────────────────
  // 1. CPU Cache Line (64B) & Stride / Pointer-Chasing Simulator
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-memory-cache-stride'] = createStepSimulator({
    id: 'sim-memory-cache-stride',
    aliases: ['sim-memory-hierarchy', 'sim-cache-line-traversal'],
    title: 'CPU 64-Byte Cache Line & Stride Locality Simulator',
    badge: '64B Cache Line (8 × 8B)',
    badgeClass: 'badge-o1',
    blurb: 'Compare contiguous stride-1 traversal (1 cache miss per 8 elements, ~4 cycles L1 hit) against stride-8 and heap pointer-chasing (100% cache misses, ~200 cycles RAM stall).',
    slugs: [
      'ram-model-vs-modern-cpu',
      'cache-oblivious-algorithms',
      'case-v8-elements-kinds'
    ],
    presets: [
      { id: 'stride1', label: 'Contiguous Array (Stride = 1)', mode: 'stride1' },
      { id: 'stride4', label: 'Strided Access (Stride = 4)', mode: 'stride4' },
      { id: 'pointer', label: 'Linked List Pointer Chasing (Random Heap)', mode: 'pointer' }
    ],
    buildFrames(preset) {
      const frames = [];
      const totalCells = 16; // Two 64B cache lines of eight 8-byte int64s
      const vals = [12, 45, 78, 23, 56, 89, 34, 67, 91, 14, 29, 63, 82, 37, 50, 74];
      const order = preset.mode === 'stride1'
        ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        : preset.mode === 'stride4'
          ? [0, 4, 8, 12, 1, 5, 9, 13]
          : [0, 11, 3, 14, 7, 9, 2, 15];

      let hits = 0;
      let misses = 0;
      let cycles = 0;
      let loadedLine = -1;
      const visited = new Set();

      for (let step = 0; step < order.length; step++) {
        const idx = order[step];
        const line = Math.floor(idx / 8); // 0 or 1
        const isHit = (preset.mode !== 'pointer' && loadedLine === line) || (preset.mode === 'pointer' && loadedLine === line && Math.random() < 0);
        const actualHit = loadedLine === line && preset.mode !== 'pointer';

        if (actualHit) {
          hits++;
          cycles += 4;
        } else {
          misses++;
          cycles += preset.mode === 'pointer' ? 200 : 60;
          loadedLine = line;
        }
        visited.add(idx);

        const renderLine = (lineIdx) => {
          const isCached = loadedLine === lineIdx;
          const cellsHtml = [];
          for (let i = lineIdx * 8; i < (lineIdx + 1) * 8; i++) {
            const isCurr = i === idx;
            const isVis = visited.has(i) && !isCurr;
            const cls = [
              'dsa-sim__cell',
              isCurr ? (actualHit ? 'is-match' : 'is-warn') : (isVis ? 'is-active' : '')
            ].filter(Boolean).join(' ');
            const tag = isCurr ? (actualHit ? 'L1 HIT (4cy)' : 'MISS (DRAM)') : (isCached ? 'In L1' : 'Cold');
            cellsHtml.push(`
              <div class="${cls}">
                <span class="dsa-sim__cell-idx">0x${(0x1000 + i * 8).toString(16)}</span>
                <span class="dsa-sim__cell-val">${vals[i]}</span>
                <span class="dsa-sim__cell-tag">${tag}</span>
              </div>
            `);
          }
          return `
            <div style="border:1px dashed ${isCached ? '#10b981' : '#3f3f46'};border-radius:8px;padding:8px;margin-bottom:6px;background:${isCached ? 'rgba(16,185,129,0.05)' : 'transparent'};">
              <div style="font-size:11px;font-family:var(--font-mono,monospace);color:${isCached ? '#34d399' : '#71717a'};margin-bottom:6px;">
                Cache Line #${lineIdx} (64 Bytes = 8 × int64) — ${isCached ? 'RESIDENT IN L1 CACHE' : 'NOT IN L1'}
              </div>
              <div class="dsa-sim__array" style="min-height:auto;padding:2px;">${cellsHtml.join('')}</div>
            </div>
          `;
        };

        frames.push({
          stageHtml: renderLine(0) + renderLine(1),
          invariant: `Access index [${idx}] (Cache Line #${line}): ${actualHit ? 'Spatial locality L1 Hit (+4 cycles)' : 'Cold Cache Line Miss (+DRAM stall)'}`,
          metrics: [
            { label: 'Accesses', value: `${step + 1} / ${order.length}` },
            { label: 'L1 Cache Hits', value: `${hits}` },
            { label: 'Cache Misses', value: `${misses}` },
            { label: 'Cumulative Cycles', value: `${cycles} cy (~${(cycles / (step + 1)).toFixed(1)} cy/op)` }
          ],
          log: `Read A[${idx}] = ${vals[idx]} at 0x${(0x1000 + idx * 8).toString(16)} -> ${actualHit ? 'L1 HIT (4 cycles)' : 'CACHE LINE FILL (fetched 64B block)'}`
        });
      }
      return frames;
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 2. Dynamic Array Doubling & Potential Function Φ = 2n - m
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-dynamic-array-amortized'] = createStepSimulator({
    id: 'sim-dynamic-array-amortized',
    aliases: [],
    title: 'Dynamic Array Geometric Doubling & Potential Φ = 2n − m',
    badge: 'Amortized O(1)',
    badgeClass: 'badge-o1',
    blurb: 'Step through push(x) operations as capacity doubles (1 → 2 → 4 → 8 → 16). Watch Tarjan’s potential function Φ = 2n − m bank 2 credits on cheap inserts to pay for O(n) reallocation copies.',
    slugs: [
      'amortized-analysis-potential',
      'dynamic-arrays-geometric-resizing',
      'space-complexity-stack-frames',
      'complexity-tradeoff-framework',
      'build-dynamic-circular-deque'
    ],
    presets: [
      { id: 'double', label: 'push(x) × 10 with 2× Growth (Φ = 2n − m)', count: 10 },
      { id: 'burst', label: 'Resize Boundary Burst (n = 1..16)', count: 16 }
    ],
    buildFrames(preset) {
      const frames = [];
      let n = 0;
      let m = 1;
      let totalActual = 0;
      const items = [];

      for (let step = 1; step <= preset.count; step++) {
        const val = step * 10;
        const prevPhi = Math.max(0, 2 * n - m);
        let resized = false;
        let copied = 0;

        if (n === m) {
          copied = n;
          m *= 2;
          resized = true;
        }
        items.push(val);
        n++;

        const actualCost = 1 + copied;
        totalActual += actualCost;
        const newPhi = 2 * n - m;
        const amortizedCost = actualCost + (newPhi - prevPhi);

        const slots = [];
        for (let i = 0; i < m; i++) {
          const hasVal = i < n;
          const isNew = i === n - 1;
          const cls = [
            'dsa-sim__cell',
            isNew ? 'is-match' : (resized && hasVal ? 'is-pivot' : (hasVal ? 'is-active' : ''))
          ].filter(Boolean).join(' ');
          const tag = isNew ? 'NEW (+1)' : (resized && hasVal ? 'COPIED' : (hasVal ? 'USED' : 'FREE'));
          slots.push(`
            <div class="${cls}">
              <span class="dsa-sim__cell-idx">[${i}]</span>
              <span class="dsa-sim__cell-val">${hasVal ? items[i] : '·'}</span>
              <span class="dsa-sim__cell-tag">${tag}</span>
            </div>
          `);
        }

        frames.push({
          stageHtml: `
            <div style="font-size:12px;color:var(--fg-muted);text-align:center;">
              Buffer Capacity <code>m = ${m}</code> | Size <code>n = ${n}</code> | Load Factor <code>α = ${(n / m * 100).toFixed(0)}%</code>
            </div>
            <div class="dsa-sim__array">${slots.join('')}</div>
          `,
          invariant: `Φ(D_i) = 2n − m = 2(${n}) − ${m} = ${newPhi} ≥ 0 | ĉ_i = c_i + ΔΦ = ${actualCost} + (${newPhi} − ${prevPhi}) = ${amortizedCost}`,
          metrics: [
            { label: 'Size / Cap (n / m)', value: `${n} / ${m}` },
            { label: 'Actual Cost c_i', value: `${actualCost} (${copied ? `${copied} copies + 1` : '1 write'})` },
            { label: 'Potential Φ = 2n−m', value: `${newPhi}` },
            { label: 'Amortized Cost ĉ_i', value: `${amortizedCost} (Avg ${(totalActual / n).toFixed(2)})` }
          ],
          log: resized
            ? `Capacity full (${copied}/${copied})! Doubled m: ${copied} -> ${m}, copied ${copied} elements, inserted ${val}. Actual cost = ${actualCost}, ΔΦ = ${newPhi - prevPhi}, Amortized = ${amortizedCost}.`
            : `Inserted ${val} at index ${n - 1}. Actual cost = 1, banked +2 potential (Φ = ${newPhi}), Amortized cost = ${amortizedCost}.`
        });
      }
      return frames;
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 3. Two-Pointers & Sliding Window Stepper
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-two-pointers-window'] = createStepSimulator({
    id: 'sim-two-pointers-window',
    aliases: ['sim-two-pointers-dutch-flag'],
    title: 'Two-Pointers & Variable Sliding Window Invariant Stepper',
    badge: 'O(N) Amortized 2N Steps',
    badgeClass: 'badge-on',
    blurb: 'Trace variable-length sliding window [L..R] and Dutch National Flag 3-way partitioning. Both L and R advance monotonically, guaranteeing at most 2N pointer movements.',
    slugs: [
      'two-pointers-invariant-proofs',
      'sliding-window-monotonicity'
    ],
    presets: [
      { id: 'window', label: 'Shortest Subarray with Sum ≥ 15', mode: 'window' },
      { id: 'dutch', label: 'Dijkstra 3-Way Dutch National Flag (0, 1, 2)', mode: 'dutch' }
    ],
    buildFrames(preset) {
      const frames = [];
      if (preset.mode === 'dutch') {
        const arr = [2, 0, 2, 1, 1, 0, 2, 0, 1];
        let low = 0, mid = 0, high = arr.length - 1;
        let swaps = 0;

        while (mid <= high) {
          const v = arr[mid];
          const tags = {};
          tags[low] = (tags[low] ? tags[low] + ' ' : '') + 'low';
          tags[mid] = (tags[mid] ? tags[mid] + ' ' : '') + 'mid';
          tags[high] = (tags[high] ? tags[high] + ' ' : '') + 'high';

          let action = '';
          if (v === 0) {
            [arr[low], arr[mid]] = [arr[mid], arr[low]];
            action = `A[mid]=0: swap(low=${low}, mid=${mid}), low++, mid++`;
            low++; mid++; swaps++;
          } else if (v === 1) {
            action = `A[mid]=1: already in middle band, mid++`;
            mid++;
          } else {
            [arr[mid], arr[high]] = [arr[high], arr[mid]];
            action = `A[mid]=2: swap(mid=${mid}, high=${high}), high--`;
            high--; swaps++;
          }

          const match = [];
          const active = [];
          const pivot = [];
          for (let i = 0; i < arr.length; i++) {
            if (i < low) match.push(i);
            else if (i < mid) active.push(i);
            else if (i > high) pivot.push(i);
          }

          frames.push({
            stageHtml: renderArrayCells([...arr], { match, active, pivot, tags }),
            invariant: `A[0..${low - 1}] = 0s | A[${low}..${mid - 1}] = 1s | A[${mid}..${high}] = Unknown | A[${high + 1}..${arr.length - 1}] = 2s`,
            metrics: [
              { label: 'Pointers (low,mid,high)', value: `(${low}, ${mid}, ${high})` },
              { label: 'Unknown Region', value: `${Math.max(0, high - mid + 1)} elements` },
              { label: 'Swaps', value: `${swaps}` }
            ],
            log: action
          });
        }
        return frames;
      }

      const arr = [2, 3, 1, 2, 4, 3, 7, 2];
      const target = 8;
      let L = 0, sum = 0, bestLen = Infinity, bestPair = [-1, -1], ops = 0;

      for (let R = 0; R < arr.length; R++) {
        sum += arr[R];
        ops++;
        const recordStep = (note) => {
          const active = [];
          const match = [];
          for (let i = L; i <= R; i++) {
            if (sum >= target) match.push(i);
            else active.push(i);
          }
          const tags = { [L]: 'L', [R]: L === R ? 'L,R' : 'R' };
          frames.push({
            stageHtml: renderArrayCells(arr, { active, match, tags }),
            invariant: `Window [${L}..${R}] sum = ${sum} (Target ≥ ${target}) | Monotonic L=${L}, R=${R} never move left`,
            metrics: [
              { label: 'Window [L..R]', value: `[${L}..${R}] (len ${R - L + 1})` },
              { label: 'Window Sum', value: `${sum}` },
              { label: 'Best Valid Len', value: bestLen === Infinity ? '∞' : `${bestLen} ([${bestPair[0]}..${bestPair[1]}])` },
              { label: 'Pointer Ops (≤ 2N)', value: `${ops}` }
            ],
            log: note
          });
        };

        recordStep(`Expand R -> ${R} (added A[${R}]=${arr[R]}), window sum = ${sum}`);
        while (sum >= target) {
          if (R - L + 1 < bestLen) {
            bestLen = R - L + 1;
            bestPair = [L, R];
          }
          const removed = arr[L];
          sum -= removed;
          L++;
          ops++;
          recordStep(`Valid window! Updated bestLen=${bestLen}, then contracted L -> ${L} (removed ${removed}), sum = ${sum}`);
        }
      }
      return frames;
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 4. Monotonic Stack & Monotonic Queue Visualizer
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-monotonic-stack-queue'] = createStepSimulator({
    id: 'sim-monotonic-stack-queue',
    aliases: ['sim-monotonic-stack', 'sim-monotonic-stack-histogram', 'sim-sliding-window-monotonic-deque'],
    title: 'Monotonic Stack (Histogram) & Monotonic Queue (Sliding Window Max)',
    badge: 'O(N) Single Pass',
    badgeClass: 'badge-on',
    blurb: 'Every index is pushed once and popped at most once. Inspect how maintaining a strict monotonic invariant resolves Next Greater/Smaller boundaries and sliding window extrema in O(N) time.',
    slugs: [
      'monotonic-stack-next-greater',
      'monotonic-deque-sliding-extrema',
      'stacks-expression-evaluation'
    ],
    presets: [
      { id: 'hist', label: 'Largest Rectangle in Histogram (Monotonic Stack)', mode: 'hist' },
      { id: 'deque', label: 'Sliding Window Maximum k = 3 (Monotonic Deque)', mode: 'deque' }
    ],
    buildFrames(preset) {
      const frames = [];
      if (preset.mode === 'deque') {
        const arr = [1, 3, -1, -3, 5, 3, 6, 7];
        const k = 3;
        const dq = [];
        const out = [];

        for (let i = 0; i < arr.length; i++) {
          let evictedOld = false;
          if (dq.length && dq[0] <= i - k) {
            dq.shift();
            evictedOld = true;
          }
          let poppedSmaller = 0;
          while (dq.length && arr[dq[dq.length - 1]] <= arr[i]) {
            dq.pop();
            poppedSmaller++;
          }
          dq.push(i);
          if (i >= k - 1) out.push(arr[dq[0]]);

          const active = [];
          for (let j = Math.max(0, i - k + 1); j <= i; j++) active.push(j);
          const match = [dq[0]];
          const tags = {};
          dq.forEach((idx, pos) => { tags[idx] = pos === 0 ? 'MAX (Front)' : `dq[${pos}]`; });

          frames.push({
            stageHtml: `
              ${renderArrayCells(arr, { active, match, tags })}
              <div style="font-size:12px;font-family:var(--font-mono,monospace);color:var(--fg-muted);text-align:center;">
                Monotonic Decreasing Deque (indices): [${dq.map(idx => `${idx}:${arr[idx]}`).join(' > ')}]
              </div>
            `,
            invariant: `Deque values strictly decreasing: [${dq.map(x => arr[x]).join(' > ')}] & indices within [${Math.max(0, i - k + 1)}..${i}]`,
            metrics: [
              { label: 'Current Index i', value: `${i} (val ${arr[i]})` },
              { label: 'Popped Dominated', value: `${poppedSmaller}` },
              { label: 'Deque Front (Max)', value: `${arr[dq[0]]} (at [${dq[0]}])` },
              { label: 'Window Maxima', value: `[${out.join(', ')}]` }
            ],
            log: `i=${i} (val=${arr[i]}): ${evictedOld ? 'Evicted expired front; ' : ''}Popped ${poppedSmaller} smaller back elements; Pushed [${i}]. Window max = ${arr[dq[0]]}.`
          });
        }
        return frames;
      }

      const heights = [2, 1, 5, 6, 2, 3, 0];
      const st = [];
      let maxArea = 0;
      let bestDesc = '0';

      for (let i = 0; i < heights.length; i++) {
        const h = heights[i];
        let poppedInfo = [];
        while (st.length && heights[st[st.length - 1]] > h) {
          const top = st.pop();
          const leftBound = st.length ? st[st.length - 1] : -1;
          const width = i - leftBound - 1;
          const area = heights[top] * width;
          if (area > maxArea) {
            maxArea = area;
            bestDesc = `${heights[top]}×${width} = ${area}`;
          }
          poppedInfo.push(`h[${top}]=${heights[top]} -> area ${area}`);
        }
        st.push(i);

        const tags = { [i]: 'curr' };
        st.forEach((idx) => { if (idx !== i) tags[idx] = 'in-stack'; });

        frames.push({
          stageHtml: `
            ${renderArrayCells(heights.slice(0, -1), { active: st.filter(x => x < heights.length - 1), pivot: [i], tags })}
            <div style="font-size:12px;font-family:var(--font-mono,monospace);color:var(--fg-muted);text-align:center;">
              Monotonic Increasing Stack: [${st.map(idx => `${idx}(h=${heights[idx]})`).join(' ≤ ')}]
            </div>
          `,
          invariant: `Stack heights strictly non-decreasing: [${st.map(idx => heights[idx]).join(' ≤ ')}]`,
          metrics: [
            { label: 'Scan Index i', value: `${i} (h = ${h})` },
            { label: 'Stack Depth', value: `${st.length}` },
            { label: 'Popped Rectangles', value: `${poppedInfo.length}` },
            { label: 'Max Rectangle Area', value: `${maxArea} (${bestDesc})` }
          ],
          log: poppedInfo.length
            ? `h[${i}]=${h} broke monotonicity! Popped: ${poppedInfo.join(', ')}. Max area = ${maxArea}.`
            : `h[${i}]=${h} maintains increasing order; pushed index ${i} onto stack.`
        });
      }
      return frames;
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 5. Linked List Pointer Reversal & Floyd Cycle Tortoise-Hare
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-linked-list-floyd'] = createStepSimulator({
    id: 'sim-linked-list-floyd',
    aliases: [],
    title: 'Floyd Tortoise-and-Hare Cycle Detection & Pointer Reversal',
    badge: 'O(N) Time · O(1) Space',
    badgeClass: 'badge-o1',
    blurb: 'Visualize Phase 1 (Tortoise 1× vs Hare 2× meeting inside cycle of length λ) and Phase 2 (resetting one pointer to head to locate cycle entry μ via x ≡ −c (mod λ)).',
    slugs: [
      'singly-doubly-intrusive-lists',
      'floyd-brent-cycle-detection'
    ],
    presets: [
      { id: 'floyd', label: 'Floyd Tortoise & Hare Cycle Entry (μ = 3, λ = 5)', mode: 'floyd' },
      { id: 'reverse', label: 'In-Place Singly Linked List 3-Pointer Reversal', mode: 'reverse' }
    ],
    buildFrames(preset) {
      const frames = [];
      if (preset.mode === 'reverse') {
        const nodes = [10, 20, 30, 40, 50];
        const arrows = ['→', '→', '→', '→', '→ NULL'];
        for (let i = 0; i <= nodes.length; i++) {
          const cells = nodes.map((v, idx) => {
            const cls = idx === i ? 'dsa-sim__cell is-pivot' : (idx < i ? 'dsa-sim__cell is-match' : 'dsa-sim__cell is-active');
            const dir = idx < i ? (idx === 0 ? '← NULL' : '← prev') : '→ next';
            const tag = idx === i - 1 ? 'prev' : idx === i ? 'curr' : idx === i + 1 ? 'next' : dir;
            return `<div class="${cls}"><span class="dsa-sim__cell-idx">Node ${idx}</span><span class="dsa-sim__cell-val">${v}</span><span class="dsa-sim__cell-tag">${tag}</span></div>`;
          }).join('');
          frames.push({
            stageHtml: `<div class="dsa-sim__array">${cells}</div>`,
            invariant: `Reversed prefix [0..${i - 1}] | Unreversed suffix [${i}..${nodes.length - 1}]`,
            metrics: [
              { label: 'prev', value: i > 0 ? `Node(${nodes[i - 1]})` : 'NULL' },
              { label: 'curr', value: i < nodes.length ? `Node(${nodes[i]})` : 'NULL (Done)' },
              { label: 'Links Flipped', value: `${i} / ${nodes.length}` }
            ],
            log: i < nodes.length
              ? `Saved next=curr.next; flipped curr.next (${nodes[i]}) -> prev (${i > 0 ? nodes[i - 1] : 'NULL'}); advanced prev & curr.`
              : `curr reached NULL! New list head is prev = Node(${nodes[nodes.length - 1]}).`
          });
        }
        return frames;
      }

      // Cycle graph: 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> (back to 3)
      const vals = [11, 22, 33, 44, 55, 66, 77, 88];
      const nextOf = [1, 2, 3, 4, 5, 6, 7, 3];
      let slow = 0, fast = 0, step = 0;

      // Phase 1
      do {
        slow = nextOf[slow];
        fast = nextOf[nextOf[fast]];
        step++;
        const met = slow === fast;
        const tags = {};
        if (met) tags[slow] = '🐢=🐇 MEET!';
        else {
          tags[slow] = '🐢 slow';
          tags[fast] = '🐇 fast';
        }
        tags[3] = (tags[3] ? tags[3] + ' · ' : '') + 'μ=3 (entry)';

        frames.push({
          stageHtml: `
            ${renderArrayCells(vals, {
              active: [3, 4, 5, 6, 7],
              match: met ? [slow] : [],
              pivot: met ? [] : [slow, fast],
              tags
            })}
            <div style="font-size:12px;color:var(--fg-muted);text-align:center;font-family:var(--font-mono,monospace);">
              Tail: [0]→[1]→[2]→[3] | Cycle (λ=5): [3]→[4]→[5]→[6]→[7]↩[3]
            </div>
          `,
          invariant: `Phase 1 (Cycle Detection): dist(fast) = 2·dist(slow) = ${2 * step} vs ${step}`,
          metrics: [
            { label: 'Phase', value: met ? 'Phase 1 Collision!' : 'Phase 1 Chase' },
            { label: 'Tortoise (slow)', value: `[${slow}] (val ${vals[slow]})` },
            { label: 'Hare (fast)', value: `[${fast}] (val ${vals[fast]})` },
            { label: 'Steps', value: `${step}` }
          ],
          log: met
            ? `Collision at index [${slow}] after ${step} steps! Cycle confirmed.`
            : `Tortoise moved to [${slow}], Hare jumped 2 steps to [${fast}].`
        });
      } while (slow !== fast);

      // Phase 2: Find entry μ
      let p1 = 0;
      let p2 = slow;
      while (p1 !== p2) {
        p1 = nextOf[p1];
        p2 = nextOf[p2];
        step++;
        const found = p1 === p2;
        const tags = found ? { [p1]: 'ENTRY μ=3!' } : { [p1]: 'p1 (head)', [p2]: 'p2 (meet)' };
        frames.push({
          stageHtml: renderArrayCells(vals, {
            active: [3, 4, 5, 6, 7],
            match: found ? [p1] : [],
            pivot: found ? [] : [p1, p2],
            tags
          }),
          invariant: `Phase 2 (Entry Finder): p1 and p2 both advance at 1× speed; meet at μ = 3`,
          metrics: [
            { label: 'Phase', value: found ? 'Entry μ Found!' : 'Phase 2 Lockstep' },
            { label: 'Pointer p1', value: `[${p1}]` },
            { label: 'Pointer p2', value: `[${p2}]` },
            { label: 'Cycle Params', value: 'μ = 3, λ = 5' }
          ],
          log: found
            ? `p1 and p2 converged at index [${p1}] (val ${vals[p1]}) — exact cycle entry μ = 3!`
            : `Both pointers stepped 1×: p1 -> [${p1}], p2 -> [${p2}].`
        });
      }
      return frames;
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 6. Probabilistic Skip List Multi-Level Express Lanes
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-skiplist-lanes'] = createStepSimulator({
    id: 'sim-skiplist-lanes',
    aliases: ['sim-skip-list-lanes'],
    title: 'Skip List Multi-Level Express Lane Search & Insertion',
    badge: 'Expected O(log N)',
    badgeClass: 'badge-ologn',
    blurb: 'Traverse multi-level express towers from top level L_max down to L_0. Move right while next.key < target, otherwise drop down one level — achieving O(log N) search without tree rotations.',
    slugs: [
      'skip-lists-probabilistic-indexing',
      'case-redis-skiplist-ziplist'
    ],
    presets: [
      { id: 'search42', label: 'Search key = 42 across 4 Express Levels', target: 42 },
      { id: 'search55', label: 'Search & Insert key = 55 (Coin Flip Tower)', target: 55 }
    ],
    buildFrames(preset) {
      const keys = [-Infinity, 10, 20, 30, 42, 50, 60, 75];
      const heights = [4, 1, 3, 1, 2, 4, 1, 2]; // tower heights
      const target = preset.target;
      const frames = [];

      const trace = target === 42
        ? [
            { lvl: 3, idx: 0, note: 'Start at L3 header (-∞). Next at L3 is 50 > 42 → drop to L2.' },
            { lvl: 2, idx: 0, note: 'At L2 (-∞). Next at L2 is 20 ≤ 42 → advance right to 20.' },
            { lvl: 2, idx: 2, note: 'At L2 (20). Next at L2 is 50 > 42 → drop to L1.' },
            { lvl: 1, idx: 2, note: 'At L1 (20). Next at L1 is 42 ≤ 42 → advance right to 42!' },
            { lvl: 0, idx: 4, note: 'Matched key = 42 at L1/L0 in 4 pointer hops (vs 5 linear hops).' }
          ]
        : [
            { lvl: 3, idx: 0, note: 'Start at L3 (-∞). Next at L3 is 50 ≤ 55 → express jump to 50!' },
            { lvl: 3, idx: 5, note: 'At L3 (50). Next at L3 is NIL > 55 → drop to L2.' },
            { lvl: 2, idx: 5, note: 'At L2 (50). Next at L2 is NIL > 55 → drop to L1.' },
            { lvl: 1, idx: 5, note: 'At L1 (50). Next at L1 is 75 > 55 → drop to L0.' },
            { lvl: 0, idx: 5, note: 'At L0 (50). Next is 60 > 55. Splice new node 55 after 50 with random tower height = 2!' }
          ];

      const visited = new Set();
      trace.forEach((st, sIdx) => {
        visited.add(`${st.lvl}:${st.idx}`);
        let gridHtml = '<div style="display:flex;flex-direction:column;gap:4px;">';
        for (let lvl = 3; lvl >= 0; lvl--) {
          gridHtml += `<div style="display:flex;gap:6px;align-items:center;"><span style="width:36px;font-size:11px;font-family:var(--font-mono,monospace);color:var(--fg-muted);">L${lvl}</span>`;
          for (let i = 0; i < keys.length; i++) {
            const present = heights[i] > lvl;
            const isCurr = st.lvl === lvl && st.idx === i;
            const isMatch = isCurr && (keys[i] === target || sIdx === trace.length - 1);
            const isVis = visited.has(`${lvl}:${i}`);
            const cls = [
              'dsa-sim__cell',
              isMatch ? 'is-match' : isCurr ? 'is-pivot' : isVis ? 'is-active' : ''
            ].filter(Boolean).join(' ');
            const label = keys[i] === -Infinity ? 'HEAD' : keys[i];
            gridHtml += `<div class="${cls}" style="min-width:52px;padding:5px;opacity:${present ? 1 : 0.18};">
              <span class="dsa-sim__cell-val">${present ? label : '───'}</span>
            </div>`;
          }
          gridHtml += '</div>';
        }
        gridHtml += '</div>';

        frames.push({
          stageHtml: gridHtml,
          invariant: `At Level L${st.lvl}, Node(${keys[st.idx] === -Infinity ? '-∞' : keys[st.idx]}): invariant key(curr) ≤ ${target} < key(curr.next[L${st.lvl}])`,
          metrics: [
            { label: 'Target Key', value: `${target}` },
            { label: 'Current Level', value: `L${st.lvl}` },
            { label: 'Current Node', value: `${keys[st.idx] === -Infinity ? 'HEAD (-∞)' : keys[st.idx]}` },
            { label: 'Pointer Hops', value: `${sIdx + 1}` }
          ],
          log: st.note
        });
      });

      return frames;
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 7. Recursion Tree, Master Theorem & Akra-Bazzi Visualizer
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-recurrence-master-tree'] = createStepSimulator({
    id: 'sim-recurrence-master-tree',
    title: 'Recursion Tree, Master Theorem & Akra-Bazzi Level-Work Visualizer',
    badge: 'n^(log_b a) vs f(n)',
    badgeClass: 'badge-ologn',
    blurb: 'Compare per-level work a^d · f(n/b^d) across Balanced Case 2 (Merge Sort), Leaf-Heavy Case 1 (Karatsuba/Strassen), and uneven Akra-Bazzi T(n) = T(n/3) + T(2n/3) + Θ(n).',
    slugs: [
      'asymptotic-notations-rigor',
      'recurrence-relations-master-theorem',
      'akra-bazzi-uneven-divides'
    ],
    presets: [
      { id: 'balanced', label: 'Master Case 2 Balanced: T(n) = 2T(n/2) + n → Θ(n log n)' },
      { id: 'leafheavy', label: 'Master Case 1 Leaf-Heavy: T(n) = 3T(n/2) + n → Θ(n^1.585)' },
      { id: 'akrabazzi', label: 'Akra-Bazzi Uneven Split: T(n) = T(n/3) + T(2n/3) + n' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'leafheavy') {
        return [
          {
            stageHtml: `
              <svg viewBox="0 0 560 170" style="width:100%;height:auto;display:block;">
                <rect x="235" y="12" width="90" height="28" rx="5" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="280" y="30" text-anchor="middle" fill="#93c5fd" font-size="11" font-family="monospace">d=0: c·n</text>
                <rect x="75" y="65" width="90" height="28" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/><text x="120" y="83" text-anchor="middle" fill="#fde68a" font-size="11" font-family="monospace">n/2</text>
                <rect x="235" y="65" width="90" height="28" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/><text x="280" y="83" text-anchor="middle" fill="#fde68a" font-size="11" font-family="monospace">3×(n/2)=1.5n</text>
                <rect x="395" y="65" width="90" height="28" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/><text x="440" y="83" text-anchor="middle" fill="#fde68a" font-size="11" font-family="monospace">n/2</text>
                <rect x="40" y="122" width="480" height="32" rx="6" fill="rgba(34,197,94,0.22)" stroke="#22c55e" stroke-width="2"/>
                <text x="280" y="142" text-anchor="middle" fill="#4ade80" font-size="11.5" font-weight="700" font-family="monospace">Leaves d=log₂n: 3^(log₂n) = n^(log₂3) ≈ n^1.585 (Geometric Ratio r = 3/2 &gt; 1)</text>
              </svg>
            `,
            invariant: 'Case 1 (Leaf-Heavy): Critical exponent c_crit = log_2(3) ≈ 1.585 > 1. Work grows geometrically by r = 3/2 per level, dominated by the leaves Θ(n^(log_2 3)).',
            metrics: [
              { label: 'Critical Exponent', value: 'log₂(3) ≈ 1.585' },
              { label: 'Per-Level Ratio r', value: 'a/b = 3/2 = 1.5 > 1' },
              { label: 'Total Complexity', value: 'Θ(n^1.585)' }
            ],
            log: 'Karatsuba recurrence T(n)=3T(n/2)+O(n): leaf layer dominates geometric sum.'
          }
        ];
      }
      if (preset?.id === 'akrabazzi') {
        return [
          {
            stageHtml: `
              <svg viewBox="0 0 560 170" style="width:100%;height:auto;display:block;">
                <rect x="220" y="12" width="120" height="28" rx="5" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="280" y="30" text-anchor="middle" fill="#93c5fd" font-size="11" font-family="monospace">Root: n</text>
                <line x1="250" y1="40" x2="145" y2="75" stroke="#38bdf8" stroke-width="2"/>
                <line x1="310" y1="40" x2="415" y2="75" stroke="#22c55e" stroke-width="2.5"/>
                <rect x="85" y="75" width="120" height="28" rx="5" fill="#1e293b" stroke="#38bdf8"/><text x="145" y="93" text-anchor="middle" fill="#e2e8f0" font-size="11" font-family="monospace">Left: n/3 (Short)</text>
                <rect x="355" y="75" width="130" height="28" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="420" y="93" text-anchor="middle" fill="#4ade80" font-size="11" font-family="monospace">Right: 2n/3 (Deep)</text>
                <text x="280" y="142" text-anchor="middle" fill="#fde68a" font-size="11.5" font-family="monospace">Akra-Bazzi Exponent: (1/3)^p + (2/3)^p = 1 ⇒ p = 1 ⇒ T(n) = Θ(n log n)</text>
              </svg>
            `,
            invariant: 'Akra-Bazzi Theorem: Solve ∑ a_i · b_i^p = (1/3)^p + (2/3)^p = 1 ⇒ p = 1. Integral ∫ (u / u^(p+1)) du = ln(n) gives Θ(n log n).',
            metrics: [
              { label: 'Density Exponent p', value: '(1/3)¹ + (2/3)¹ = 1 ⇒ p=1' },
              { label: 'Shortest / Longest Depth', value: 'log₃(n) vs log_{3/2}(n)' },
              { label: 'Asymptotic Bound', value: 'Θ(n log n)' }
            ],
            log: 'Every complete level sums to (1/3 + 2/3)n = n; Akra-Bazzi integral yields Θ(n log n).'
          }
        ];
      }
      return [
        {
          stageHtml: `
            <svg viewBox="0 0 560 170" style="width:100%;height:auto;display:block;">
              <rect x="190" y="14" width="180" height="28" rx="5" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="280" y="32" text-anchor="middle" fill="#93c5fd" font-size="11" font-family="monospace">d=0: 1 × c·n = c·n</text>
              <rect x="105" y="65" width="150" height="28" rx="5" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="180" y="83" text-anchor="middle" fill="#4ade80" font-size="11" font-family="monospace">d=1: c·(n/2)</text>
              <rect x="305" y="65" width="150" height="28" rx="5" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="380" y="83" text-anchor="middle" fill="#4ade80" font-size="11" font-family="monospace">d=1: c·(n/2) (∑=c·n)</text>
              <rect x="70" y="118" width="420" height="30" rx="5" fill="rgba(59,130,246,0.16)" stroke="#38bdf8" stroke-width="1.5"/>
              <text x="280" y="138" text-anchor="middle" fill="#e2e8f0" font-size="11.5" font-family="monospace">All log₂(n)+1 levels do exactly c·n work ⇒ Total = Θ(n log n)</text>
            </svg>
          `,
          invariant: 'Master Theorem Case 2: n^(log_b a) = n^(log_2 2) = n == Θ(f(n)). Work per level is invariant at c·n across log_2(n) levels.',
          metrics: [
            { label: 'Branching / Shrink', value: 'a = 2, b = 2' },
            { label: 'Work per Level d', value: '2^d · c(n/2^d) = c·n' },
            { label: 'Total Work', value: 'Θ(n log n)' }
          ],
          log: 'Balanced recursion tree: 2^d subproblems of size n/2^d sum to c·n at every depth d.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 8. Branch Predictor BTB Pipeline & 256-Bit SIMD Vector Lanes
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-branch-predictor-simd'] = createStepSimulator({
    id: 'sim-branch-predictor-simd',
    title: 'CPU Branch Predictor Pipeline Flush vs Branchless cmov & AVX2 SIMD',
    badge: '15-Cycle Mispredict vs 8-Lane SIMD',
    badgeClass: 'badge-o1',
    blurb: 'Compare 2-bit saturating BTB branch mispredictions on unsorted data (~15-cycle pipeline flush) against sorted branch prediction and branchless AVX2 8-lane SIMD masking.',
    slugs: ['branch-prediction-simd-cost'],
    presets: [
      { id: 'unsorted', label: 'Unsorted Input: 50% Branch Misprediction (15-Cycle Flush)' },
      { id: 'simd', label: 'Branchless cmov & AVX2 8-Lane _mm256_cmpgt_epi32 Mask' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'simd') {
        return [
          {
            stageHtml: renderArrayCells(
              ['190 (>128)', '42 (≤128)', '215 (>128)', '88 (≤128)', '164 (>128)', '12 (≤128)', '250 (>128)', '99 (≤128)'],
              {
                match: [0, 2, 4, 6],
                tags: { 0: 'Mask=0xFF', 1: 'Mask=0x00', 2: 'Mask=0xFF', 4: 'Mask=0xFF', 6: 'Mask=0xFF' }
              }
            ),
            invariant: 'Branchless SIMD Predication: _mm256_cmpgt_epi32 + _mm256_and_si256 processes 8 × 32-bit integers per cycle with 0 control-flow branches!',
            metrics: [
              { label: 'Instruction', value: 'vpcmpgtd + vpand + vpaddd' },
              { label: 'Pipeline Flushes', value: '0 (Data-Independent)' },
              { label: 'Throughput', value: '8 ints / cycle (~12× speedup)' }
            ],
            log: 'Computed predicate mask across 8 AVX2 lanes and accumulated matching lanes without branching.'
          }
        ];
      }
      return [
        {
          stageHtml: renderArrayCells(
            ['x=190 (T)', 'x=42 (NT - FLUSH!)', 'x=215 (T - FLUSH!)', 'x=88 (NT - FLUSH!)'],
            {
              match: [0],
              warn: [1, 2, 3],
              tags: { 0: 'BTB Hit (1 cy)', 1: 'Mispredict (15 cy)', 2: 'Mispredict (15 cy)', 3: 'Mispredict (15 cy)' }
            }
          ),
          invariant: 'On uniform random data around threshold 128, P(branch taken) = 0.5: the 2-bit saturating BTB counter mispredicts 50% of iterations, flushing ~15–20 ROB stages.',
          metrics: [
            { label: 'BTB Mispredict Rate', value: '~50% on Unsorted Array' },
            { label: 'Penalty per Flush', value: '~15–20 CPU Cycles' },
            { label: 'Fix', value: 'Use cmov or SIMD mask' }
          ],
          log: 'Speculative execution guessed Taken on x=42; pipeline flushed 15 in-flight instructions.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 9. Two's Complement Bit Tricks & 64-Bit SWAR Bitsets
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-bit-manipulation-swar'] = createStepSimulator({
    id: 'sim-bit-manipulation-swar',
    title: "Two's Complement Bit Tricks (x & -x, x & (x-1)) & 64-Bit SWAR Bitset",
    badge: 'O(1) ALU / O(N/64) Bitset',
    badgeClass: 'badge-o1',
    blurb: "Inspect register-level bit patterns for Two's complement negation -x = ~x + 1, lowest set bit isolation x & -x, Kernighan's popcount loop, and 64-bit word-parallel bitsets.",
    slugs: [
      'bit-manipulation-twos-complement',
      'bitsets-word-level-parallelism'
    ],
    presets: [
      { id: 'lsb', label: "Isolate Lowest Set Bit: x & -x (Two's Complement ~x + 1)" },
      { id: 'kernighan', label: "Brian Kernighan's Clear Lowest Set Bit: x &= (x - 1)" },
      { id: 'swar', label: '64-Bit Bitset Word-Parallel Intersection (A[w] & B[w])' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'swar') {
        return [
          {
            stageHtml: renderArrayCells(
              ['Word A: 0b10110100', 'Word B: 0b11100101', 'A & B:  0b10100100', 'popcnt(A & B) = 3'],
              {
                active: [0, 1],
                match: [2, 3],
                tags: { 0: '64-bit limb', 1: '64-bit limb', 2: '1-cycle bitwise AND', 3: 'POPCNT instruction' }
              }
            ),
            invariant: 'Word-Level Parallelism: A single 64-bit ALU AND + POPCNT intersects 64 set elements simultaneously in O(N / 64) machine words.',
            metrics: [
              { label: 'Word Size W', value: '64 bits (uint64_t)' },
              { label: 'Speedup Factor', value: '64× fewer loop iterations' },
              { label: 'Common Elements', value: 'popcnt(0b10100100) = 3' }
            ],
            log: 'Executed 64-bit word intersection and hardware POPCNT in 2 clock cycles.'
          }
        ];
      }
      if (preset?.id === 'kernighan') {
        return [
          {
            stageHtml: renderArrayCells(
              ['x     = 01011000₂ (88)', 'x - 1 = 01010111₂ (87)', 'x&(x-1) = 01010000₂ (80)'],
              {
                active: [0, 1],
                match: [2],
                tags: { 0: '3 set bits', 1: 'Flips trailing 1000→0111', 2: 'Cleared bit 3!' }
              }
            ),
            invariant: 'Subtracting 1 borrows from the lowest set 1-bit, flipping it to 0 and all lower 0s to 1s. Therefore x & (x - 1) zeroes the lowest set bit in O(1).',
            metrics: [
              { label: 'Input x', value: '88 (01011000₂)' },
              { label: 'After 1 Step', value: '80 (01010000₂)' },
              { label: 'Total Loop Steps', value: 'popcount(x) = 3 steps' }
            ],
            log: 'x & (x - 1) cleared bit index 3 in 1 ALU cycle; loop runs only popcount(x) times.'
          }
        ];
      }
      return [
        {
          stageHtml: renderArrayCells(
            ['x      = 01011000₂ (+88)', '~x     = 10100111₂', '-x=~x+1= 10101000₂ (-88)', 'x & -x = 00001000₂ (8)'],
            {
              active: [0, 1, 2],
              match: [3],
              tags: { 0: 'Trailing 1000₂', 1: 'Bitwise NOT', 2: 'Carry stops at bit 3', 3: 'LSB = 2³ = 8' }
            }
          ),
          invariant: 'In Two\'s Complement, -x = ~x + 1 inverts all bits left of the lowest set bit and preserves the lowest set bit 2^k, so x & -x = 2^k.',
          metrics: [
            { label: 'Input x', value: '88 (01011000₂)' },
            { label: 'Negation -x', value: '-88 (10101000₂)' },
            { label: 'Isolated LSB (x & -x)', value: '8 (00001000₂)' }
          ],
          log: 'Isolated lowest set bit 2³ = 8 via x & -x (used in Fenwick Trees and bitmask enumeration).'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 10. Prefix Sums, 2D Inclusion-Exclusion, Difference Array & Kadane
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-prefix-diff-kadane'] = createStepSimulator({
    id: 'sim-prefix-diff-kadane',
    title: '2D Prefix Inclusion-Exclusion, Difference Array & Kadane Subarray',
    badge: 'O(1) Range Query / O(N) Kadane',
    badgeClass: 'badge-o1',
    blurb: 'Trace 2D prefix-sum inclusion-exclusion P[r2][c2] - P[r1-1][c2] - P[r2][c1-1] + P[r1-1][c1-1], O(1) difference-array range updates, and Kadane circular max subarray.',
    slugs: [
      'prefix-sums-difference-arrays',
      'kadane-subarray-invariants',
      'in-place-matrix-cyclic-shifts'
    ],
    presets: [
      { id: 'kadane', label: "Kadane's Max Subarray & Circular Total - MinSubarray Duality" },
      { id: 'diff', label: '1D/2D Difference Array O(1) Range Add (D[L]+=v, D[R+1]-=v)' },
      { id: 'prefix2d', label: '2D Prefix Sum Submatrix Inclusion-Exclusion' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'diff') {
        return [
          {
            stageHtml: renderArrayCells(['D[0]=0', 'D[1]=+5 (L=1)', 'D[2]=0', 'D[3]=0', 'D[4]=-5 (R+1=4)', 'Prefix ⇒ [0, 5, 5, 5, 0]'], {
              active: [1],
              warn: [4],
              match: [5],
              tags: { 1: 'D[L] += 5', 4: 'D[R+1] -= 5', 5: 'Reconstructed Array' }
            }),
            invariant: 'Difference Array Duality: PrefixSum(Difference(A)) == A. Adding +v to [L, R] requires only 2 point writes: D[L] += v and D[R+1] -= v.',
            metrics: [
              { label: 'Range Update [1..3]', value: 'O(1) (2 point writes)' },
              { label: 'Final Reconstruction', value: 'O(N) single prefix pass' },
              { label: 'Resulting Array', value: '[0, 5, 5, 5, 0]' }
            ],
            log: 'Applied +5 to range [1..3] via D[1]+=5 and D[4]-=5; prefix sum propagates +5 across indices 1..3.'
          }
        ];
      }
      if (preset?.id === 'prefix2d') {
        return [
          {
            stageHtml: renderArrayCells(
              ['+ P[r2][c2] (48)', '- P[r1-1][c2] (14)', '- P[r2][c1-1] (18)', '+ P[r1-1][c1-1] (6)', '= Submatrix Sum (22)'],
              {
                active: [0, 3],
                warn: [1, 2],
                match: [4],
                tags: { 0: 'Full Box', 1: 'Strip Top', 2: 'Strip Left', 3: 'Restore Corner', 4: '48-14-18+6 = 22' }
              }
            ),
            invariant: '2D Inclusion-Exclusion: The top-left corner P[r1-1][c1-1] is subtracted twice (once in top strip, once in left strip) and must be added back once.',
            metrics: [
              { label: 'Precomputation', value: 'O(R · C)' },
              { label: 'Submatrix Query', value: 'O(1) (4 array lookups)' },
              { label: 'Exact Sum', value: '48 - 14 - 18 + 6 = 22' }
            ],
            log: 'Evaluated 2D submatrix sum in O(1) via 4-term inclusion-exclusion.'
          }
        ];
      }
      return [
        {
          stageHtml: renderArrayCells(['5', '-3', '5', 'Circular Wrap: [5] + [5] = 10'], {
            active: [0, 2],
            warn: [1],
            match: [3],
            tags: { 0: 'Prefix', 1: 'Min Subarray = -3', 2: 'Suffix', 3: 'Total(7) - Min(-3) = 10' }
          }),
          invariant: 'Kadane Circular Duality: A wrapping subarray equals the complement of a contiguous middle subarray, so max_wrap = TotalSum - minSubarray.',
          metrics: [
            { label: 'Standard Kadane Max', value: '7 ([5, -3, 5])' },
            { label: 'Minimum Subarray', value: '-3 ([-3])' },
            { label: 'Circular Max (Total - Min)', value: '7 - (-3) = 10' }
          ],
          log: 'Computed both maxSubarray=7 and minSubarray=-3; circular wrap achieves Total - Min = 10.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 11. Boyer-Moore Majority Vote & Misra-Gries Heavy Hitters
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-boyer-moore-misra-gries'] = createStepSimulator({
    id: 'sim-boyer-moore-misra-gries',
    title: 'Boyer-Moore Majority Pairing Cancellation & Misra-Gries Heavy Hitters',
    badge: 'O(N) Time · O(1) / O(k) Space',
    badgeClass: 'badge-o1',
    blurb: 'Watch distinct stream elements mutually annihilate each other: any element occurring > N/2 times (or > N/k in Misra-Gries) is mathematically guaranteed to survive.',
    slugs: ['boyer-moore-majority-misra-gries'],
    presets: [
      { id: 'majority', label: 'Boyer-Moore Majority Vote (Pair Cancellation on [A, A, B, A, C, B, A])' },
      { id: 'misragries', label: 'Misra-Gries k-1 Counter Buckets (Heavy Hitters > N/k)' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'misragries') {
        return [
          {
            stageHtml: renderArrayCells(['Bucket 1: A (cnt=2)', 'Bucket 2: B (cnt=1)', 'Incoming C ⇒ Decrement All!', 'After C: A(1), B(0)'], {
              active: [0, 1],
              warn: [2],
              match: [3],
              tags: { 0: 'Heavy Hitter', 1: 'Candidate', 2: 'k=3 Distinct Tuple {A,B,C}', 3: 'A survives!' }
            }),
            invariant: 'Misra-Gries Invariant: Each Simultaneous Decrement destroys k distinct elements (at most N/k times), so any item with frequency > N/k retains count > 0.',
            metrics: [
              { label: 'Threshold k = 3', value: 'k - 1 = 2 Counters' },
              { label: 'Decrements Triggered', value: '≤ N / k times' },
              { label: 'Surviving Candidate', value: 'A (Verified in Pass 2)' }
            ],
            log: 'Incoming C found 2 full buckets {A, B}; decremented all buckets simultaneously (forming a 3-tuple cancellation).'
          }
        ];
      }
      return [
        {
          stageHtml: renderArrayCells(['A (cand=A, c=1)', 'A (c=2)', 'B (cancel→c=1)', 'A (c=2)', 'C (cancel→c=1)', 'B (cancel→c=0)', 'A (cand=A, c=1)'], {
            match: [0, 1, 3, 6],
            warn: [2, 4, 5],
            tags: { 1: 'count=2', 2: 'Pair (A,B)', 4: 'Pair (A,C)', 5: 'Pair (A,B)', 6: 'Survivor = A!' }
          }),
          invariant: 'Every decrement pairs 1 copy of candidate with 1 distinct non-candidate. Since > N/2 copies of A exist, at least 1 copy of A cannot be paired and survives!',
          metrics: [
            { label: 'Pairs Cancelled', value: '3 pairs (6 elements)' },
            { label: 'Surviving Candidate', value: 'A (count = 1)' },
            { label: 'Pass 2 Verification', value: 'freq(A) = 4 > 7/2' }
          ],
          log: 'Cancelled 3 distinct pairs (A,B), (A,C), (A,B); final survivor A is verified as majority element.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 12. Unrolled Linked List Cache Blocks & Rope Weight-Balanced Tree
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-unrolled-rope-blocks'] = createStepSimulator({
    id: 'sim-unrolled-rope-blocks',
    title: 'Unrolled Linked List Cache-Block Split & Rope Weight-Balanced Tree',
    badge: 'O(N/B) Scan · O(log N) Rope Split',
    badgeClass: 'badge-ologn',
    blurb: 'Visualize cache-line-aligned Unrolled Linked List node splits (B elements per block) and Rope binary tree weight-guided index(i), split(k), and concat operations.',
    slugs: ['unrolled-linked-lists-ropes'],
    presets: [
      { id: 'rope', label: 'Rope Weight-Balanced Tree: index(i) & O(log N) split(k)' },
      { id: 'unrolled', label: 'Unrolled Linked List Cache Block Split (B = 4)' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'unrolled') {
        return [
          {
            stageHtml: renderArrayCells(['Block 0: [10, 20, 30, 40] (Full B=4)', 'Insert 25 ⇒ Split into 2 Half-Full Blocks!', 'Block 0a: [10, 20, 25, _]', 'Block 0b: [30, 40, _, _]'], {
              warn: [0, 1],
              match: [2, 3],
              tags: { 0: '64B Cache Line Full', 2: '3/4 Occupancy', 3: '2/4 Occupancy' }
            }),
            invariant: 'Unrolled Block Invariant: Every node stores [B/2, B] contiguous elements in a single cache line, reducing pointer overhead and L1 cache misses by factor B.',
            metrics: [
              { label: 'Block Capacity B', value: '4 elements / node' },
              { label: 'Cache Misses', value: 'O(N / B) vs O(N)' },
              { label: 'Split Cost', value: 'O(B) local shift' }
            ],
            log: 'Split overflowing block into two half-full cache-aligned blocks of capacity B=4.'
          }
        ];
      }
      return [
        {
          stageHtml: `
            <svg viewBox="0 0 560 165" style="width:100%;height:auto;display:block;">
              <line x1="280" y1="35" x2="155" y2="105" stroke="#3b82f6" stroke-width="2.2"/>
              <line x1="280" y1="35" x2="405" y2="105" stroke="#22c55e" stroke-width="2.5"/>
              <rect x="210" y="12" width="140" height="32" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
              <text x="280" y="32" text-anchor="middle" fill="#93c5fd" font-size="11" font-family="monospace">Root (leftWeight = 6)</text>
              <rect x="85" y="100" width="140" height="34" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
              <text x="155" y="121" text-anchor="middle" fill="#e2e8f0" font-size="11" font-family="monospace">Leaf: "Hello_" (len=6)</text>
              <rect x="335" y="100" width="140" height="34" rx="6" fill="rgba(34,197,94,0.22)" stroke="#22c55e" stroke-width="2.5"/>
              <text x="405" y="121" text-anchor="middle" fill="#4ade80" font-size="11" font-family="monospace">Leaf: "World!" (i'=8-6=2 → 'r')</text>
            </svg>
          `,
          invariant: 'Rope Weight Navigation: Each internal node stores weight = length(leftSubtree). For index i = 8 ≥ weight(6), go right and subtract i ← i - 6 = 2.',
          metrics: [
            { label: 'Query Index', value: 'i = 8 ("Hello_World!"[8])' },
            { label: 'Root Comparison', value: '8 ≥ leftWeight(6) ⇒ Go Right (i=2)' },
            { label: 'Concat / Split Cost', value: 'O(1) / O(log N)' }
          ],
          log: 'Navigated Rope tree: i=8 ≥ 6 branched right with adjusted offset i=2, landing on "World!"[2] = \'r\'.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 13. Quickselect & BFPRT Median-of-Medians 5-Column Grid
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-quickselect-bfprt'] = createStepSimulator({
    id: 'sim-quickselect-bfprt',
    title: 'Quickselect & BFPRT Median-of-Medians 3n/10 Elimination Grid',
    badge: 'Expected O(N) / Worst-Case O(N)',
    badgeClass: 'badge-on',
    blurb: 'Inspect the 5-column BFPRT Median-of-Medians grid: the quadrant of elements ≤ Median-of-Medians M (and ≥ M) contains at least 3n/10 elements, guaranteeing T(n) ≤ T(n/5) + T(7n/10) + O(n) = O(n).',
    slugs: ['quickselect-bfprt-median'],
    presets: [
      { id: 'bfprt', label: 'BFPRT 5-Element Columns: ≥ 3n/10 Guaranteed Elimination' },
      { id: 'quickselect', label: 'Randomized Quickselect Prune-and-Search (One-Sided Recursion)' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'quickselect') {
        return [
          {
            stageHtml: renderArrayCells(['8', '12', '15', 'Pivot=21 (rank 3)', '34', '42', '55', '68'], {
              match: [0, 1, 2],
              pivot: [3],
              warn: [4, 5, 6, 7],
              tags: { 0: 'Keep Left', 3: 'Pivot=21', 4: 'Discard Right Half!' }
            }),
            invariant: 'Prune-and-Search: Quickselect recurses on ONLY ONE side containing target rank k, yielding geometric work n + n/2 + n/4 + ... = 2n = O(n).',
            metrics: [
              { label: 'Target Rank', value: 'k = 1 (2nd smallest)' },
              { label: 'Discarded Subarray', value: '[34, 42, 55, 68] (Never sorted!)' },
              { label: 'Expected Comparisons', value: '≤ 2N' }
            ],
            log: 'Partitioned around 21 (rank 3 > k=1); pruned right half [4..7] and recursed only on [0..2].'
          }
        ];
      }
      return [
        {
          stageHtml: renderArrayCells(
            ['Col 1 Med: 14 (≤M)', 'Col 2 Med: 22 (≤M)', 'Pivot M = 29', 'Col 4 Med: 41 (≥M)', 'Col 5 Med: 53 (≥M)'],
            {
              active: [0, 1],
              pivot: [2],
              warn: [3, 4],
              tags: { 0: '3 of 5 ≤ 29', 1: '3 of 5 ≤ 29', 2: 'Median-of-Medians', 3: '3 of 5 ≥ 29', 4: '3 of 5 ≥ 29' }
            }
          ),
          invariant: 'BFPRT Recurrence: At least ⌈n/10⌉ column medians are ≤ M, and each contributes 3 elements ≤ M ⇒ ≥ 3n/10 elements eliminated! Since 1/5 + 7/10 = 9/10 < 1, T(n) = O(n).',
          metrics: [
            { label: 'Guaranteed Eliminated', value: '≥ 3n / 10 elements' },
            { label: 'Worst-Case Subproblem', value: '≤ 7n / 10 elements' },
            { label: 'Work Sum Ratio', value: '1/5 + 7/10 = 9/10 < 1 ⇒ Θ(n)' }
          ],
          log: 'Selected Median-of-Medians M=29; guaranteed at least 30% of elements lie on each side of M.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 14. External k-Way Merge Sort, Loser Tree & Snowplow Runs
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-external-loser-tree'] = createStepSimulator({
    id: 'sim-external-loser-tree',
    title: 'External k-Way Merge Tournament Loser Tree & Snowplow Run Generation',
    badge: 'O((N/B) log_{M/B}(N/B)) I/Os',
    badgeClass: 'badge-onlogn',
    blurb: 'Trace a k-way Tournament Loser Tree (only 1 comparison per level on replay, no sibling reads!) and Knuth’s Replacement Selection "Snowplow" generating 2M-length runs.',
    slugs: ['external-merge-sort-replacement'],
    presets: [
      { id: 'loser', label: 'k-Way Tournament Loser Tree (Root Winner + Loser Internal Nodes)' },
      { id: 'snowplow', label: 'Replacement Selection Snowplow (Expected Run Length = 2M)' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'snowplow') {
        return [
          {
            stageHtml: renderArrayCells(['Out: 12, 18', 'Heap Active: [24, 31, 40]', 'Incoming: 29 (>18 ⇒ Active!)', 'Incoming: 09 (<18 ⇒ Frozen Next Run)'], {
              match: [0, 2],
              active: [1],
              warn: [3],
              tags: { 0: 'Last Emitted=18', 1: 'Min-Heap M=4', 2: 'Joins Run #1', 3: 'Frozen for Run #2' }
            }),
            invariant: 'Knuth Snowplow Theorem: Incoming elements ≥ last_emitted join the current run; smaller elements freeze for the next run, yielding expected run length 2M.',
            metrics: [
              { label: 'RAM Buffer M', value: 'M pages' },
              { label: 'Standard Sort-Merge Run', value: '1.0 × M' },
              { label: 'Snowplow Expected Run', value: '2.0 × M (Halves initial runs!)' }
            ],
            log: 'Replacement selection appended 29 ≥ 18 to current run and froze 09 < 18 for the next run.'
          }
        ];
      }
      return [
        {
          stageHtml: `
            <svg viewBox="0 0 560 165" style="width:100%;height:auto;display:block;">
              <rect x="220" y="8" width="120" height="28" rx="5" fill="rgba(34,197,94,0.2)" stroke="#22c55e" stroke-width="2"/><text x="280" y="26" text-anchor="middle" fill="#4ade80" font-size="11" font-family="monospace">Champ: 11 (R2)</text>
              <rect x="220" y="52" width="120" height="26" rx="5" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/><text x="280" y="69" text-anchor="middle" fill="#fde68a" font-size="11" font-family="monospace">Loser L0: 15 (R3)</text>
              <rect x="95" y="96" width="120" height="26" rx="5" fill="#1e293b" stroke="#3b82f6"/><text x="155" y="113" text-anchor="middle" fill="#93c5fd" font-size="11" font-family="monospace">Loser L1: 24 (R0)</text>
              <rect x="345" y="96" width="120" height="26" rx="5" fill="#1e293b" stroke="#3b82f6"/><text x="405" y="113" text-anchor="middle" fill="#93c5fd" font-size="11" font-family="monospace">Loser L1: 30 (R1)</text>
              <text x="280" y="148" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="monospace">Replay Path from R2 compares ONLY against stored parent losers (1 cmp/level vs 2 in heap)</text>
            </svg>
          `,
          invariant: 'Loser Tree Invariant: Every internal node caches the LOSER of its match, while the winner advances up. Replaying leaf R2 requires exactly log₂(k) comparisons with zero sibling fetches.',
          metrics: [
            { label: 'Merge Fan-In k', value: 'k = 4 sorted disk runs' },
            { label: 'Comparisons / Output', value: 'log₂(k) (1 per level)' },
            { label: 'Sibling Memory Reads', value: '0 (Stored in parent node)' }
          ],
          log: 'Emitted champion 11 from Run 2; replayed replacement up leaf-to-root path against stored losers.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 15. TimSort Run Stack Invariants, Galloping & pdqsort
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-timsort-pdqsort-runs'] = createStepSimulator({
    id: 'sim-timsort-pdqsort-runs',
    title: 'TimSort Natural Run Stack (A > B+C), Galloping & pdqsort BlockQuicksort',
    badge: 'O(N) Adaptive · O(N log N) Worst',
    badgeClass: 'badge-onlogn',
    blurb: 'Explore TimSort natural run detection, Fibonacci-bounded run stack invariants (|Z| > |Y|+|X| ∧ |Y| > |X|), exponential galloping merge, and Rust pdqsort branchless offsets.',
    slugs: [
      'case-timsort-pdqsort',
      'build-hybrid-introsort-timsort'
    ],
    presets: [
      { id: 'timsort', label: 'TimSort Run Stack Invariant (|Z| > |Y| + |X| ∧ |Y| > |X|) & Galloping' },
      { id: 'pdqsort', label: 'Rust pdqsort: Branchless BlockQuicksort Offset Buffers' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'pdqsort') {
        return [
          {
            stageHtml: renderArrayCells(['OffsetsL: [0, 3, 4, 7]', 'OffsetsR: [1, 2, 5, 6]', 'Cyclic Permutation Swap!', '0 Branch Mispredictions'], {
              active: [0, 1],
              match: [2, 3],
              tags: { 0: 'A[i] > Pivot', 1: 'A[j] < Pivot', 2: 'Batch Swap', 3: 'Branchless Partition' }
            }),
            invariant: 'BlockQuicksort (pdqsort): Decouples predicate evaluation from element movement by filling 64-byte offset buffersbranchlessly (`offset[num++] = i`), then permuting misplaced elements in batch.',
            metrics: [
              { label: 'Branch Mispredictions', value: '0 inside inner scan loop' },
              { label: 'Bad Partition Limit', value: 'log₂(N) before HeapSort fallback' },
              { label: 'Already-Sorted Check', value: 'O(N) when 0 swaps in partition' }
            ],
            log: 'Populated left/right misplaced offset buffers branchlessly and executed cyclic batch swaps.'
          }
        ];
      }
      return [
        {
          stageHtml: renderArrayCells(['Run Z: len=64', 'Run Y: len=32', 'Run X: len=40 (Violates |Y| > |X|!)', 'Merge(Y, Z) or Merge(Y, X) ⇒ Balanced!'], {
            active: [0, 1],
            warn: [2],
            match: [3],
            tags: { 0: '|Z|=64', 1: '|Y|=32', 2: '|Y| ≤ |X| Violation!', 3: 'Fibonacci Stack Bound' }
          }),
          invariant: 'TimSort Stack Invariant: For top 3 runs Z, Y, X: (1) |Z| > |Y| + |X| and (2) |Y| > |X|. This forces run lengths to grow at least as fast as Fibonacci numbers (stack height ≤ 85 for 2⁶⁴).',
          metrics: [
            { label: 'MinRun Length', value: '32..64 (chosen so N/minrun ≈ 2^k)' },
            { label: 'Gallop Threshold', value: 'MIN_GALLOP = 7 consecutive wins' },
            { label: 'Adaptive Best Case', value: 'O(N) comparisons' }
          ],
          log: 'Detected |Y|=32 ≤ |X|=40 violation on run stack; merged Y with smaller neighbor to restore Fibonacci invariant.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 16. Fractional Cascading Bridges & Eytzinger BFS Array Layout
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-fractional-cascading-eytzinger'] = createStepSimulator({
    id: 'sim-fractional-cascading-eytzinger',
    title: 'Fractional Cascading O(log N + k) Bridges & Eytzinger Cache-Line Search',
    badge: 'O(log N + k) / Branchless BFS Layout',
    badgeClass: 'badge-ologn',
    blurb: 'Compare Chazelle-Guibas Fractional Cascading (propagating every 2nd element from L_{i+1} into L_i to replace k binary searches with O(1) bridge pointers) and Eytzinger 1-indexed BFS layout.',
    slugs: [
      'fractional-cascading',
      'case-git-bisect-eytzinger'
    ],
    presets: [
      { id: 'cascading', label: 'Fractional Cascading: O(log N + k) Cross-Catalog Bridge Pointers' },
      { id: 'eytzinger', label: 'Eytzinger BFS Layout + __builtin_prefetch(&B[16*k])' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'eytzinger') {
        return [
          {
            stageHtml: renderArrayCells(['B[1]=40 (Root)', 'B[2]=20 (L)', 'B[3]=60 (R)', 'B[4]=10', 'B[5]=30', 'B[6]=50', 'B[7]=70'], {
              pivot: [0],
              active: [1, 2],
              match: [3, 4, 5, 6],
              tags: { 0: 'Depth 0', 1: '2k (Depth 1)', 2: '2k+1 (Depth 1)', 3: 'All in 1 Cache Line!' }
            }),
            invariant: 'Eytzinger (1-Indexed BFS) Layout: Top levels of the binary search tree are packed contiguously at the front of array B[1..N], and k ← 2*k + (B[k] < x) advances branchlessly.',
            metrics: [
              { label: 'Index Update', value: 'k = 2*k + (B[k] < x) (cmov)' },
              { label: 'Prefetch Horizon', value: '__builtin_prefetch(&B[16 * k])' },
              { label: 'Answer Extraction', value: 'k >>= __builtin_ffs(~k)' }
            ],
            log: 'Traversed Eytzinger BFS array branchlessly while prefetching 4 levels ahead in a single 64B cache line.'
          }
        ];
      }
      return [
        {
          stageHtml: renderArrayCells(
            ['L₁ Augmented: [10, *18, 25, *42, 60]', 'Binary Search L₁(x=22) ⇒ 25 (bridge→idx 2)', 'L₂: [12, 18, 30, 42] (Check idx 1..2 in O(1)!)'],
            {
              active: [0],
              pivot: [1],
              match: [2],
              tags: { 0: '* = Promoted from L₂', 1: 'O(log N) once at L₁', 2: 'O(1) Bridge Hop!' }
            }
          ),
          invariant: 'Fractional Cascading Invariant: Promoting every 2nd element of M_{i+1} into M_i ensures at most 1 unpromoted element lies between consecutive bridges, so each lower level requires at most 1 comparison!',
          metrics: [
            { label: 'Naive k Catalogs', value: 'O(k log N)' },
            { label: 'Fractional Cascading', value: 'O(log N + k)' },
            { label: 'Space Overhead', value: '∑ N_i · (1 + 1/2 + 1/4 + ...) ≤ 2N' }
          ],
          log: 'Binary searched L₁ once for x=22, then followed O(1) bridge pointer into L₂ and checked 1 neighbor.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 17. Planar Closest Pair 2δ × δ Packing Strip
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-closest-pair-strip'] = createStepSimulator({
    id: 'sim-closest-pair-strip',
    title: 'Planar Closest Pair Divide-and-Conquer & 7-Neighbor 2δ × δ Strip',
    badge: 'O(N log N) · ≤ 7 Strip Checks',
    badgeClass: 'badge-onlogn',
    blurb: 'See why the y-sorted strip [x_mid - δ, x_mid + δ] requires checking at most 7 subsequent points per point: a 2δ × δ box splits into eight (δ/2) × (δ/2) squares of diameter δ/√2 < δ.',
    slugs: ['divide-and-conquer-closest-pair'],
    presets: [
      { id: 'strip', label: 'Pigeonhole 2δ × δ Box Packing (Why ≤ 7 Neighbors Suffice)' }
    ],
    buildFrames() {
      return [
        {
          stageHtml: `
            <svg viewBox="0 0 560 175" style="width:100%;height:auto;display:block;">
              <rect x="160" y="15" width="240" height="120" fill="rgba(59,130,246,0.08)" stroke="#3b82f6" stroke-width="2"/>
              <line x1="280" y1="10" x2="280" y2="145" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="5 3"/>
              <line x1="220" y1="15" x2="220" y2="135" stroke="#475569" stroke-dasharray="3 3"/>
              <line x1="340" y1="15" x2="340" y2="135" stroke="#475569" stroke-dasharray="3 3"/>
              <line x1="160" y1="75" x2="400" y2="75" stroke="#475569" stroke-dasharray="3 3"/>
              <circle cx="265" cy="120" r="6" fill="#22c55e"/><text x="245" y="132" fill="#4ade80" font-size="10" font-family="monospace">p_i</text>
              <circle cx="298" cy="95" r="6" fill="#38bdf8"/><text x="312" y="98" fill="#38bdf8" font-size="10" font-family="monospace">p_j (d &lt; δ!)</text>
              <circle cx="190" cy="45" r="5" fill="#94a3b8"/>
              <circle cx="370" cy="42" r="5" fill="#94a3b8"/>
              <text x="280" y="162" text-anchor="middle" fill="#fde68a" font-size="11" font-family="monospace">8 Sub-Squares of size (δ/2)×(δ/2): Diagonal = δ/√2 &lt; δ ⇒ At most 1 point per square (≤ 7 others)</text>
            </svg>
          `,
          invariant: 'Pigeonhole Packing Lemma: Each (δ/2) × (δ/2) cell lies entirely within L or R and has diagonal δ/√2 < δ. Since min distance within L and R is δ, each of the 8 cells holds ≤ 1 point!',
          metrics: [
            { label: 'Strip Width / Height', value: '2δ × δ (8 cells of δ/2 × δ/2)' },
            { label: 'Cell Diagonal', value: 'δ / √2 ≈ 0.707δ < δ' },
            { label: 'Inner Loop Bound', value: '≤ 7 comparisons per point ⇒ O(N)' }
          ],
          log: 'Filtered y-sorted points within |x - x_mid| < δ and checked at most 7 neighbors per point in O(N) total time.'
        }
      ];
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 18. Cooley-Tukey FFT Butterfly, Karatsuba & CDQ 3D Partial Order
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-fft-butterfly-karatsuba'] = createStepSimulator({
    id: 'sim-fft-butterfly-karatsuba',
    title: 'Cooley-Tukey Radix-2 FFT Butterfly, Karatsuba & CDQ Divide-and-Conquer',
    badge: 'O(N log N) FFT / O(N log² N) CDQ',
    badgeClass: 'badge-onlogn',
    blurb: 'Inspect the Radix-2 Cooley-Tukey FFT butterfly y_k = E_k + ω_n^k O_k, Karatsuba 3-multiplication algebraic identity, and CDQ Divide-and-Conquer left-to-right contribution transfer.',
    slugs: [
      'karatsuba-strassen-algebraic-dc',
      'fast-fourier-transform-polynomials',
      'cdq-divide-and-conquer'
    ],
    presets: [
      { id: 'fft', label: 'Cooley-Tukey Radix-2 FFT Butterfly (y_k = E_k ± ω_n^k · O_k)' },
      { id: 'karatsuba', label: 'Karatsuba 3-Multiply Split (z₁ = (x₁+x₀)(y₁+y₀) - z₂ - z₀)' },
      { id: 'cdq', label: 'CDQ Divide-and-Conquer: Left Half [L..M] Updates Right Half [M+1..R]' }
    ],
    buildFrames(preset) {
      if (preset?.id === 'karatsuba') {
        return [
          {
            stageHtml: renderArrayCells(
              ['z₂ = x₁·y₁ (Mult #1)', 'z₀ = x₀·y₀ (Mult #2)', 'z₃ = (x₁+x₀)(y₁+y₀) (Mult #3)', 'z₁ = z₃ - z₂ - z₀ (0 extra mults!)'],
              {
                active: [0, 1, 2],
                match: [3],
                tags: { 0: 'High×High', 1: 'Low×Low', 2: 'Sum×Sum', 3: 'T(n)=3T(n/2)+O(n) ⇒ O(n^1.585)' }
              }
            ),
            invariant: 'Gauss/Karatsuba Identity: x₁y₀ + x₀y₁ = (x₁ + x₀)(y₁ + y₀) - x₁y₁ - x₀y₀ replaces 4 half-size multiplications with 3, dropping exponent from 2 to log₂(3) ≈ 1.585.',
            metrics: [
              { label: 'Multiplications per Split', value: '3 (down from 4)' },
              { label: 'Karatsuba Exponent', value: 'log₂(3) ≈ 1.585' },
              { label: 'Strassen 2×2 Matrix', value: '7 mults ⇒ O(n^2.807)' }
            ],
            log: 'Computed cross-term z₁ = (x₁+x₀)(y₁+y₀) - z₂ - z₀ using additions instead of a 4th multiplication.'
          }
        ];
      }
      if (preset?.id === 'cdq') {
        return [
          {
            stageHtml: renderArrayCells(
              ['1. Sort All by x', '2. Sort [L..M] and [M+1..R] by y', '3. Two-Pointer Sweep: Insert L into Fenwick(z), Query R'],
              {
                active: [0, 1],
                match: [2],
                tags: { 0: ' guarantees x_L ≤ x_R', 1: 'Two-pointer y-order', 2: 'Fenwick counts z_L ≤ z_R' }
              }
            ),
            invariant: 'CDQ Invariant: At split M, every element in Left [L..M] has x_L ≤ x_R for all R. Sorting both halves by y and querying a Fenwick tree on z resolves 3D dominance in O(N log² N).',
            metrics: [
              { label: 'Dimension 1 (x)', value: 'Eliminated by D&C L→R split' },
              { label: 'Dimension 2 (y)', value: 'Eliminated by Merge two-pointer' },
              { label: 'Dimension 3 (z)', value: 'Counted in O(log N) via Fenwick BIT' }
            ],
            log: 'Transferred 3D partial-order contributions from Left half [L..M] to Right half [M+1..R] in O(N log N) per level.'
          }
        ];
      }
      return [
        {
          stageHtml: `
            <svg viewBox="0 0 560 165" style="width:100%;height:auto;display:block;">
              <circle cx="130" cy="45" r="18" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="130" y="49" text-anchor="middle" fill="#93c5fd" font-size="11" font-family="monospace">E_k</text>
              <circle cx="130" cy="120" r="18" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/><text x="130" y="124" text-anchor="middle" fill="#fde68a" font-size="11" font-family="monospace">O_k</text>
              <line x1="148" y1="45" x2="380" y2="45" stroke="#3b82f6" stroke-width="2.2"/>
              <line x1="148" y1="120" x2="380" y2="45" stroke="#22c55e" stroke-width="2.2"/>
              <line x1="148" y1="45" x2="380" y2="120" stroke="#3b82f6" stroke-width="2.2"/>
              <line x1="148" y1="120" x2="380" y2="120" stroke="#ef4444" stroke-width="2.2" stroke-dasharray="4 3"/>
              <text x="235" y="112" fill="#fde68a" font-size="11" font-family="monospace">× ω_n^k</text>
              <rect x="380" y="29" width="150" height="30" rx="6" fill="rgba(34,197,94,0.18)" stroke="#22c55e" stroke-width="2"/>
              <text x="455" y="48" text-anchor="middle" fill="#4ade80" font-size="11" font-family="monospace">y_k = E_k + ω_n^k·O_k</text>
              <rect x="380" y="105" width="150" height="30" rx="6" fill="rgba(245,158,11,0.18)" stroke="#f59e0b" stroke-width="2"/>
              <text x="455" y="124" text-anchor="middle" fill="#fde68a" font-size="11" font-family="monospace">y_{k+n/2} = E_k − ω_n^k·O_k</text>
            </svg>
          `,
          invariant: 'Halving Lemma: Because ω_n^(k + n/2) = −ω_n^k and (ω_n^k)² = ω_{n/2}^k, a single product t = ω_n^k · O_k yields both y_k = E_k + t and y_{k+n/2} = E_k − t.',
          metrics: [
            { label: 'Butterfly Operations', value: '1 Complex Multiply + 2 Adds' },
            { label: 'Stages / Width', value: 'log₂(N) stages × (N/2) butterflies' },
            { label: 'Polynomial Multiply', value: 'O(N log N) (vs O(N²) naive)' }
          ],
          log: 'Combined even DFT E_k and twiddle-multiplied odd DFT ω_n^k·O_k across Radix-2 butterfly.'
        }
      ];
    }
  });
})();
