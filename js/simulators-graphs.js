/* ═══════════════════════════════════════════════════════════════
   DSA In Depth — Track V Simulators (Graphs, Shortest Paths, MST & Flow)
   1. sim-csr-eulerian-hierholzer
   2. sim-bfs-dfs-tarjan-scc
   3. sim-toposort-kahn-2sat
   4. sim-dsu-rollback-timeline
   5. sim-kruskal-dsu-mst
   6. sim-dijkstra-astar-grid
   7. sim-bellman-ford-floyd-johnson
   8. sim-dinic-max-flow
   9. sim-push-relabel-preflow
   10. sim-hungarian-mcmf
   ═══════════════════════════════════════════════════════════════ */

window.SIMULATORS = window.SIMULATORS || {};

(() => {
  const { esc, createStepSimulator, renderArrayCells } = window.Simulators;

  function svgGraphBox(innerSvg, w = 680, h = 230) {
    return `
      <div style="width:100%;overflow-x:auto;margin-bottom:10px;border:1px solid var(--border-subtle,rgba(148,163,184,0.2));border-radius:10px;background:var(--bg-elevated,rgba(15,23,42,0.45));padding:8px;">
        <svg viewBox="0 0 ${w} ${h}" style="width:100%;max-height:${h}px;display:block;font-family:var(--font-mono,monospace);">
          <defs>
            <marker id="sim-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#94a3b8"/>
            </marker>
            <marker id="sim-arr-act" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/>
            </marker>
            <marker id="sim-arr-ok" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981"/>
            </marker>
            <marker id="sim-arr-warn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444"/>
            </marker>
          </defs>
          ${innerSvg}
        </svg>
      </div>
    `;
  }

  function drawNode(x, y, label, sub = '', state = 'default', r = 21) {
    const palette = {
      default: { fill: '#1e293b', stroke: '#64748b', text: '#f8fafc', sub: '#94a3b8' },
      active:  { fill: 'rgba(56,189,248,0.22)', stroke: '#38bdf8', text: '#e0f2fe', sub: '#7dd3fc' },
      match:   { fill: 'rgba(16,185,129,0.22)', stroke: '#10b981', text: '#d1fae5', sub: '#6ee7b7' },
      warn:    { fill: 'rgba(239,68,68,0.24)', stroke: '#ef4444', text: '#fee2e2', sub: '#fca5a5' },
      pivot:   { fill: 'rgba(245,158,11,0.24)', stroke: '#f59e0b', text: '#fef3c7', sub: '#fcd34d' }
    }[state] || { fill: '#1e293b', stroke: '#64748b', text: '#f8fafc', sub: '#94a3b8' };

    return `
      <g>
        <circle cx="${x}" cy="${y}" r="${r}" fill="${palette.fill}" stroke="${palette.stroke}" stroke-width="2.4"/>
        <text x="${x}" y="${sub ? y - 3 : y + 4}" text-anchor="middle" fill="${palette.text}" font-size="12" font-weight="700">${esc(label)}</text>
        ${sub ? `<text x="${x}" y="${y + 11}" text-anchor="middle" fill="${palette.sub}" font-size="9.5">${esc(sub)}</text>` : ''}
      </g>
    `;
  }

  function drawEdge(x1, y1, x2, y2, label = '', state = 'default', directed = true, r = 22) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const sx = x1 + (dx / len) * r;
    const sy = y1 + (dy / len) * r;
    const ex = x2 - (dx / len) * (r + (directed ? 4 : 0));
    const ey = y2 - (dy / len) * (r + (directed ? 4 : 0));
    const mx = (sx + ex) / 2 - (dy / len) * 11;
    const my = (sy + ey) / 2 + (dx / len) * 11;

    const styles = {
      default: { stroke: '#64748b', width: 1.8, dash: '', marker: 'url(#sim-arr)', text: '#94a3b8' },
      active:  { stroke: '#38bdf8', width: 2.8, dash: '', marker: 'url(#sim-arr-act)', text: '#38bdf8' },
      match:   { stroke: '#10b981', width: 2.8, dash: '', marker: 'url(#sim-arr-ok)', text: '#34d399' },
      warn:    { stroke: '#ef4444', width: 2.8, dash: '5,3', marker: 'url(#sim-arr-warn)', text: '#f87171' },
      faint:   { stroke: '#334155', width: 1.4, dash: '3,3', marker: 'url(#sim-arr)', text: '#64748b' }
    }[state] || { stroke: '#64748b', width: 1.8, dash: '', marker: 'url(#sim-arr)', text: '#94a3b8' };

    return `
      <g>
        <line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}"
              stroke="${styles.stroke}" stroke-width="${styles.width}"
              ${styles.dash ? `stroke-dasharray="${styles.dash}"` : ''}
              ${directed ? `marker-end="${styles.marker}"` : ''}/>
        ${label ? `<text x="${mx.toFixed(1)}" y="${my.toFixed(1)}" text-anchor="middle" fill="${styles.text}" font-size="10.5" font-weight="600">${esc(label)}</text>` : ''}
      </g>
    `;
  }

  // ───────────────────────────────────────────────────────────────
  // 1. CSR Memory Layout & Hierholzer Eulerian Circuit Visualizer
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-csr-eulerian-hierholzer'] = createStepSimulator({
    id: 'sim-csr-eulerian-hierholzer',
    aliases: ['sim-csr-graph', 'sim-hierholzer-eulerian'],
    title: 'CSR (offsets/edges) Memory Layout & Hierholzer Eulerian Circuit Visualizer',
    badge: 'O(V + E) Contiguous CSR · O(E) Hierholzer',
    badgeClass: 'badge-on',
    blurb: 'Inspect how Compressed Sparse Row (CSR) packs all adjacency lists into two flat arrays offsets[V+1] and edges[E] so vertex u’s neighbors live in slice edges[offsets[u]..offsets[u+1]), and trace Hierholzer’s O(E) stack splice for Eulerian circuits.',
    slugs: [
      'graph-representations-csr-packing',
      'eulerian-paths-hierholzer-de-bruijn',
      'graph-representations-csr-cache',
      'eulerian-paths-hierholzer'
    ],
    presets: [
      { id: 'csr', label: 'CSR Contiguous offsets[V+1] & edges[E] Slice Inspection', mode: 'csr' },
      { id: 'hierholzer', label: 'Hierholzer’s O(E) Stack Walk & Sub-Cycle Splice (Eulerian Circuit)', mode: 'hierholzer' }
    ],
    buildFrames(preset) {
      const coords = [
        { x: 110, y: 65, label: 'u0' },
        { x: 290, y: 55, label: 'u1' },
        { x: 480, y: 65, label: 'u2' },
        { x: 200, y: 175, label: 'u3' },
        { x: 390, y: 175, label: 'u4' }
      ];

      if (preset.mode === 'hierholzer') {
        const eulerEdges = [
          [0, 1, 'e0'], [1, 2, 'e1'], [2, 0, 'e2'],
          [1, 3, 'e3'], [3, 4, 'e4'], [4, 1, 'e5']
        ];
        const steps = [
          {
            used: [0, 1, 2],
            curr: 0,
            stack: ['u0', 'u1', 'u2', 'u0'],
            tour: '[]',
            inv: 'Phase 1 Walk from u0: exhausts edges u0→u1→u2→u0 and closes initial cycle at u0 while u1 still has unused outgoing edge u1→u3.'
          },
          {
            used: [0, 1, 2],
            curr: 1,
            stack: ['u0', 'u1'],
            tour: '[u0, u2]',
            inv: 'Backtrack from stuck u0 & u2 (out_ptr == deg): pop u0, u2 into output tour until reaching u1 which still has unused edge (u1→u3)!'
          },
          {
            used: [0, 1, 2, 3, 4, 5],
            curr: 1,
            stack: ['u0', 'u1', 'u3', 'u4', 'u1'],
            tour: '[u0, u2]',
            inv: 'Sub-cycle Detour from u1: walks u1→u3→u4→u1 in O(1) per edge using per-vertex head pointer head[u]++ without re-scanning used edges.'
          },
          {
            used: [0, 1, 2, 3, 4, 5],
            curr: 0,
            stack: [],
            tour: '[u0, u1, u3, u4, u1, u2, u0]',
            inv: 'Pop remaining stack & reverse: Sub-cycle (u1→u3→u4→u1) is seamlessly spliced into main circuit → Eulerian circuit of all E=6 edges!'
          }
        ];

        return steps.map(st => {
          const edgesSvg = eulerEdges.map(([u, v, lbl], idx) =>
            drawEdge(coords[u].x, coords[u].y, coords[v].x, coords[v].y, lbl, st.used.includes(idx) ? 'match' : 'default', true)
          ).join('');
          const nodesSvg = coords.map((c, idx) =>
            drawNode(c.x, c.y, c.label, idx === st.curr ? 'curr' : '', idx === st.curr ? 'active' : 'default')
          ).join('');
          return {
            stageHtml: svgGraphBox(edgesSvg + nodesSvg, 600, 225) +
              `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-family:var(--font-mono,monospace);font-size:12px;">
                <div style="padding:8px;border-radius:8px;border:1px solid rgba(56,189,248,0.3);background:rgba(56,189,248,0.06);">
                  <strong style="color:#38bdf8;">Active Walk Stack:</strong> ${esc(st.stack.join(' → ') || '(empty)')}
                </div>
                <div style="padding:8px;border-radius:8px;border:1px solid rgba(16,185,129,0.3);background:rgba(16,185,129,0.06);">
                  <strong style="color:#34d399;">Spliced Circuit:</strong> ${esc(st.tour)}
                </div>
              </div>`,
            invariant: st.inv,
            metrics: [
              { label: 'Used Edges', value: `${st.used.length} / 6` },
              { label: 'Active Stack Depth', value: `${st.stack.length}` },
              { label: 'Degree Invariant', value: 'in(v) == out(v) ∀v' }
            ],
            log: st.inv
          };
        });
      }

      // CSR Mode
      const offsets = [0, 3, 5, 6, 8, 8];
      const edges = ['u1', 'u2', 'u3', 'u2', 'u4', 'u4', 'u1', 'u4'];
      const graphEdges = [
        [0, 1], [0, 2], [0, 3],
        [1, 2], [1, 4],
        [2, 4],
        [3, 1], [3, 4]
      ];
      const steps = [0, 1, 2, 3, 4].map(u => {
        const start = offsets[u];
        const end = offsets[u + 1];
        const sliceIndices = [];
        for (let i = start; i < end; i++) sliceIndices.push(i);
        const edgesSvg = graphEdges.map(([a, b], idx) =>
          drawEdge(coords[a].x, coords[a].y, coords[b].x, coords[b].y, `e[${idx}]`, a === u ? 'active' : 'default', true)
        ).join('');
        const nodesSvg = coords.map((c, idx) =>
          drawNode(c.x, c.y, c.label, `[${offsets[idx]}..${offsets[idx + 1]})`, idx === u ? 'active' : (sliceIndices.some(k => edges[k] === `u${idx}`) ? 'match' : 'default'))
        ).join('');

        return {
          stageHtml: svgGraphBox(edgesSvg + nodesSvg, 600, 220) +
            `<div style="margin-bottom:6px;font-size:11.5px;font-family:var(--font-mono,monospace);color:var(--fg-muted);">offsets[0..5] (V+1 = 6 entries; slice for u${u} is [offsets[${u}]=${start}, offsets[${u + 1}]=${end})):</div>` +
            renderArrayCells(offsets, { active: [u, u + 1], tags: { [u]: `start=${start}`, [u + 1]: `end=${end}` } }) +
            `<div style="margin:6px 0;font-size:11.5px;font-family:var(--font-mono,monospace);color:var(--fg-muted);">edges[0..7] (Contiguous E = 8 target IDs in single cache-line allocation):</div>` +
            renderArrayCells(edges, { match: sliceIndices, tags: Object.fromEntries(sliceIndices.map(k => [k, `u${u}→${edges[k]}`])) }),
          invariant: `CSR Slice Invariant: N_out(u${u}) = edges[offsets[${u}] .. offsets[${u + 1}]) = edges[${start}..${end}) (${end - start} contiguous neighbors).`,
          metrics: [
            { label: 'Inspected Vertex', value: `u${u}` },
            { label: 'CSR Slice [L, R)', value: `[${start}, ${end})` },
            { label: 'Out-Degree', value: `offsets[${u + 1}] - offsets[${u}] = ${end - start}` },
            { label: 'Cache Locality', value: 'Stride-1 (0 heap ptrs)' }
          ],
          log: `Inspecting u${u}: offsets[${u}]=${start}, offsets[${u + 1}]=${end} -> neighbors [${sliceIndices.map(i => edges[i]).join(', ') || 'none'}].`
        };
      });

      return steps;
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 2. BFS / 0-1 BFS, DFS Edge Classifier & Tarjan Bridges / SCCs
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-bfs-dfs-tarjan-scc'] = createStepSimulator({
    id: 'sim-bfs-dfs-tarjan-scc',
    aliases: [
      'sim-bfs-dfs-Classification',
      'sim-bfs-dfs-classification',
      'sim-graph-bfs-dfs',
      'sim-tarjan-scc-bridges',
      'sim-dfs-tarjan-scc'
    ],
    title: '0-1 BFS Deque, DFS Edge Classification & Tarjan tin/low Bridges & SCCs',
    badge: 'O(V + E) Single-Pass Traversal',
    badgeClass: 'badge-on',
    blurb: 'Step through 0-1 BFS deque relaxation (push_front for w=0, push_back for w=1), Tarjan’s undirected bridge/articulation criterion (low[v] > tin[u] / low[v] ≥ tin[u]), and Tarjan’s single-pass SCC condensation.',
    slugs: [
      'bfs-01bfs-multi-source-bidirectional',
      'dfs-edge-classification-cycles',
      'biconnected-bridges-articulation-points',
      'scc-kosaraju-tarjan-condensation',
      'build-tarjan-scc-2sat',
      'bfs-01-bfs-multi-source',
      'dfs-edge-classification-timestamps',
      'bipartite-graphs-2-coloring',
      'bridges-articulation-biconnected',
      'scc-tarjan-kosaraju-2sat',
      'build-tarjan-scc-2sat-solver'
    ],
    presets: [
      { id: 'scc', label: 'Tarjan SCC Extraction (low[u] == tin[u] Stack Root)', mode: 'scc' },
      { id: 'bridge', label: 'Tarjan Bridges & Articulation Points (low[v] >= tin[u])', mode: 'bridge' },
      { id: 'bfs01', label: '0-1 BFS Deque Relaxation (w=0 Front, w=1 Back)', mode: 'bfs01' }
    ],
    buildFrames(preset) {
      const coords = [
        { x: 95, y: 65, id: 'v0' },
        { x: 245, y: 50, id: 'v1' },
        { x: 245, y: 175, id: 'v2' },
        { x: 410, y: 115, id: 'v3' },
        { x: 565, y: 55, id: 'v4' },
        { x: 565, y: 175, id: 'v5' }
      ];

      if (preset.mode === 'bfs01') {
        const wEdges = [
          [0, 1, 'w=1', 'default'], [0, 2, 'w=0', 'match'],
          [2, 1, 'w=0', 'match'], [1, 3, 'w=1', 'active'],
          [3, 4, 'w=0', 'match'], [3, 5, 'w=1', 'default']
        ];
        const steps = [
          {
            d: ['d=0', 'd=1', 'd=0', 'd=∞', 'd=∞', 'd=∞'],
            deque: '[v2(0), v1(1)]',
            active: [0, 2],
            inv: 'Pop v0(0): edge v0→v2 has w=0 ⇒ push_front(v2, d=0); edge v0→v1 has w=1 ⇒ push_back(v1, d=1). Two-level deque invariant holds!'
          },
          {
            d: ['d=0', 'd=0', 'd=0', 'd=∞', 'd=∞', 'd=∞'],
            deque: '[v1(0), v1(1-stale)]',
            active: [2, 1],
            inv: 'Pop front v2(0): 0-weight edge v2→v1 lowers d[v1] from 1 to 0 ⇒ push_front(v1, d=0)!'
          },
          {
            d: ['d=0', 'd=0', 'd=0', 'd=1', 'd=1', 'd=2'],
            deque: '[v4(1), v5(2)]',
            active: [3, 4, 5],
            inv: 'Pop v1(0) → push_back v3(1); pop v3(1) → push_front v4(1) (w=0) and push_back v5(2) (w=1). Solved in O(V + E) without log V heap!'
          }
        ];
        return steps.map(st => {
          const eSvg = wEdges.map(([u, v, lbl, col]) => drawEdge(coords[u].x, coords[u].y, coords[v].x, coords[v].y, lbl, col, true)).join('');
          const nSvg = coords.map((c, i) => drawNode(c.x, c.y, c.id, st.d[i], st.active.includes(i) ? 'active' : 'match')).join('');
          return {
            stageHtml: svgGraphBox(eSvg + nSvg, 660, 225),
            invariant: st.inv,
            metrics: [
              { label: '0-1 Deque State', value: st.deque },
              { label: 'Deque Monotonicity', value: 'At most 2 distinct dists {k, k+1}' },
              { label: 'Time Complexity', value: 'O(V + E)' }
            ],
            log: st.inv
          };
        });
      }

      if (preset.mode === 'bridge') {
        const uEdges = [
          [0, 1, 'tree', 'default'], [1, 2, 'tree', 'default'], [2, 0, 'back', 'match'],
          [2, 3, 'BRIDGE!', 'warn'], [3, 4, 'tree', 'default'], [4, 5, 'tree', 'default'], [5, 3, 'back', 'match']
        ];
        const steps = [
          {
            sub: ['1/1', '2/1', '3/1', '4/4', '5/4', '6/4'],
            cut: [2, 3],
            inv: 'Back-edge (v2,v0) sets low[2]=1; back-edge (v5,v3) sets low[5]=low[4]=4. But subtree of v3 cannot reach above tin[3]=4!'
          },
          {
            sub: ['1/1', '2/1', 'ARTIC 3/1', 'ARTIC 4/4', '5/4', '6/4'],
            cut: [2, 3],
            inv: 'Bridge & Cut-Vertex Theorem: For tree edge (v2, v3), low[v3]=4 > tin[v2]=3 ⇒ (v2,v3) is a BRIDGE, and v2, v3 are Articulation Points (low[v] ≥ tin[u])!'
          }
        ];
        return steps.map(st => {
          const eSvg = uEdges.map(([u, v, lbl, col]) => drawEdge(coords[u].x, coords[u].y, coords[v].x, coords[v].y, lbl, col, false)).join('');
          const nSvg = coords.map((c, i) => drawNode(c.x, c.y, c.id, st.sub[i], st.cut.includes(i) ? 'warn' : 'match')).join('');
          return {
            stageHtml: svgGraphBox(eSvg + nSvg, 660, 225),
            invariant: st.inv,
            metrics: [
              { label: 'Bridge Criterion', value: 'low[v] > tin[u] (v2—v3: 4 > 3)' },
              { label: 'Articulation Criterion', value: 'low[v] ≥ tin[u] (v2, v3)' },
              { label: 'Biconnected Comps', value: '2 BCCs: {v0,v1,v2} & {v3,v4,v5}' }
            ],
            log: st.inv
          };
        });
      }

      // Default: Tarjan SCC
      const sccEdges = [
        [0, 1, '', 'active'], [1, 2, '', 'active'], [2, 0, 'back', 'match'],
        [2, 3, 'cross-SCC', 'default'], [3, 4, '', 'active'], [4, 3, 'back', 'match'], [4, 5, '', 'default']
      ];
      const steps = [
        {
          sub: ['1/1', '2/1', '3/1', '4/4', '5/4', '6/6 ROOT'],
          states: ['active', 'active', 'active', 'active', 'active', 'match'],
          stack: '[v0, v1, v2, v3, v4]',
          scc: 'SCC #1: {v5}',
          inv: 'DFS reaches sink v5 (tin=6, low=6). Since low[v5] == tin[v5], pop v5 as SCC #1 = {v5} in reverse topological order.'
        },
        {
          sub: ['1/1', '2/1', '3/1', '4/4 ROOT', '5/4', 'SCC#1'],
          states: ['active', 'active', 'active', 'match', 'match', 'match'],
          stack: '[v0, v1, v2]',
          scc: 'SCC #1: {v5}, SCC #2: {v3, v4}',
          inv: 'Back-edge v4→v3 gives low[v4]=4. At v3, low[v3] == tin[v3] == 4 ⇒ pop stack through v3 as SCC #2 = {v4, v3}.'
        },
        {
          sub: ['1/1 ROOT', '2/1', '3/1', 'SCC#2', 'SCC#2', 'SCC#1'],
          states: ['match', 'match', 'match', 'match', 'match', 'match'],
          stack: '[] (Empty)',
          scc: 'SCC #1:{v5}, SCC #2:{v3,v4}, SCC #3:{v0,v1,v2}',
          inv: 'At root v0, low[v0] == tin[v0] == 1 ⇒ pop {v2, v1, v0} as SCC #3! Condensation DAG is SCC#3 → SCC#2 → SCC#1.'
        }
      ];

      return steps.map(st => {
        const eSvg = sccEdges.map(([u, v, lbl, col]) => drawEdge(coords[u].x, coords[u].y, coords[v].x, coords[v].y, lbl, col, true)).join('');
        const nSvg = coords.map((c, i) => drawNode(c.x, c.y, c.id, st.sub[i], st.states[i])).join('');
        return {
          stageHtml: svgGraphBox(eSvg + nSvg, 660, 225),
          invariant: st.inv,
          metrics: [
            { label: 'Active Tarjan Stack', value: st.stack },
            { label: 'Extracted SCCs', value: st.scc },
            { label: 'Root Invariant', value: 'low[u] == tin[u]' }
          ],
          log: st.inv
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 3. Kahn's Indegree Queue Topological Sort, Bazel Cycles & 2-SAT
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-toposort-kahn-2sat'] = createStepSimulator({
    id: 'sim-toposort-kahn-2sat',
    aliases: ['sim-kahn-toposort', 'sim-2sat-implication'],
    title: 'Kahn’s Indegree Queue Topological Sort, Bazel Cycle Detection & 2-SAT Solver',
    badge: 'O(V + E) TopoSort · 2-SAT Implication SCC',
    badgeClass: 'badge-on',
    blurb: 'Peel indegree-0 vertices with Kahn’s queue while relaxing longest-path DAG DP, detect unpeeled cyclic cores in Bazel/Cargo build graphs, or solve 2-SAT via implication graph (¬a → b) SCC topological order.',
    slugs: [
      'topological-sort-kahn-dag-dp',
      'two-sat-implication-graphs',
      'case-build-systems-bazel-cycle-detection',
      'topological-sort-kahn-dfs',
      'case-bundler-build-graph-cycles',
      'scc-tarjan-kosaraju-2sat',
      'build-tarjan-scc-2sat-solver'
    ],
    presets: [
      { id: 'kahn', label: 'Kahn’s Indegree Queue Peeling & Critical-Path DAG DP', mode: 'kahn' },
      { id: 'twosat', label: '2-SAT Implication Graph (a ∨ b) & SCC Truth Assignment (comp[x] > comp[¬x])', mode: 'twosat' },
      { id: 'bazel', label: 'Incremental Build Graph Cycle Detection (Unpeeled Indegree > 0 Core)', mode: 'bazel' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'twosat') {
        const nodes = [
          { x: 120, y: 55, lbl: '¬x₁' },
          { x: 120, y: 170, lbl: 'x₁' },
          { x: 340, y: 55, lbl: 'x₂' },
          { x: 340, y: 170, lbl: '¬x₂' },
          { x: 550, y: 115, lbl: 'x₃ / ¬x₃' }
        ];
        const steps = [
          {
            states: ['active', 'default', 'active', 'default', 'default'],
            subs: ['comp=1', 'comp=4', 'comp=2', 'comp=3', 'comp=2,3'],
            assign: 'Building (x₁ ∨ x₂) ∧ (¬x₂ ∨ x₁)',
            inv: 'Clause (x₁ ∨ x₂) adds skew-symmetric implication arcs (¬x₁ → x₂) and (¬x₂ → x₁). Clause (x₁ ∨ ¬x₂) adds (¬x₁ → ¬x₂) and (x₂ → x₁).'
          },
          {
            states: ['warn', 'match', 'pivot', 'active', 'match'],
            subs: ['comp=1 (F)', 'comp=4 (T)', 'comp=2 (F)', 'comp=3 (T)', 'SAT!'],
            assign: 'x₁ = TRUE, x₂ = FALSE',
            inv: 'Satisfiability Check: ∀i, comp[xᵢ] ≠ comp[¬xᵢ]! Setting xᵢ = (comp[xᵢ] > comp[¬xᵢ]) in topological order guarantees TRUE never implies FALSE!'
          }
        ];
        return steps.map(st => {
          const eSvg = [
            drawEdge(120, 55, 340, 55, '¬x₁→x₂', 'active', true),
            drawEdge(340, 170, 120, 170, '¬x₂→x₁', 'match', true),
            drawEdge(340, 55, 340, 170, 'x₂→¬x₂', 'warn', true),
            drawEdge(340, 170, 550, 115, 'impl', 'default', true)
          ].join('');
          const nSvg = nodes.map((n, i) => drawNode(n.x, n.y, n.lbl, st.subs[i], st.states[i], 23)).join('');
          return {
            stageHtml: svgGraphBox(eSvg + nSvg, 660, 225),
            invariant: st.inv,
            metrics: [
              { label: '2-SAT Criterion', value: '∀x: comp[x] != comp[¬x]' },
              { label: 'Truth Rule', value: 'val(x) = (comp[x] > comp[¬x])' },
              { label: 'Assignment', value: st.assign }
            ],
            log: st.inv
          };
        });
      }

      const nodes = [
        { x: 95, y: 115, lbl: 'core' },
        { x: 255, y: 55, lbl: 'auth' },
        { x: 255, y: 175, lbl: 'db' },
        { x: 435, y: 115, lbl: 'api' },
        { x: 585, y: 115, lbl: 'app' }
      ];

      if (preset.mode === 'bazel') {
        const eSvg = [
          drawEdge(95, 115, 255, 55, '', 'match', true),
          drawEdge(255, 55, 255, 175, 'cycle', 'warn', true),
          drawEdge(255, 175, 435, 115, 'cycle', 'warn', true),
          drawEdge(435, 115, 255, 55, 'back!', 'warn', true),
          drawEdge(435, 115, 585, 115, '', 'default', true)
        ].join('');
        const nSvg = [
          drawNode(95, 115, 'core', 'in=0 ✓', 'match', 22),
          drawNode(255, 55, 'auth', 'in=1 CYCLE', 'warn', 22),
          drawNode(255, 175, 'db', 'in=1 CYCLE', 'warn', 22),
          drawNode(435, 115, 'api', 'in=1 CYCLE', 'warn', 22),
          drawNode(585, 115, 'app', 'in=1 blocked', 'default', 22)
        ].join('');
        return [
          {
            stageHtml: svgGraphBox(eSvg + nSvg, 660, 225),
            invariant: 'Kahn’s Cycle Theorem: Queue empties after peeling only 1/5 targets (core). Targets {auth, db, api} retain indegree > 0 ⟺ Cyclic Dependency SCC!',
            metrics: [
              { label: 'Peeled Count', value: '1 / 5 (< V ⇒ CYCLE!)' },
              { label: 'Cyclic SCC Witness', value: 'auth → db → api → auth' },
              { label: 'Bazel SkyKey Status', value: 'Cycle reported & pruned' }
            ],
            log: 'Kahn queue exhausted with peeled=1 < V=5. Extracted cycle auth → db → api → auth.'
          }
        ];
      }

      // Kahn Topological Sort & DAG DP
      const steps = [
        {
          indeg: ['in=0,dp=0', 'in=1,dp=0', 'in=1,dp=0', 'in=2,dp=0', 'in=1,dp=0'],
          states: ['active', 'default', 'default', 'default', 'default'],
          q: '[core]',
          order: '[]',
          inv: 'Initialize Kahn queue with all indegree-0 vertices: Q = [core]. Critical path dp[core] = 0ms.'
        },
        {
          indeg: ['DONE,dp=0', 'in=0,dp=4', 'in=0,dp=7', 'in=2,dp=0', 'in=1,dp=0'],
          states: ['match', 'active', 'active', 'default', 'default'],
          q: '[auth, db]',
          order: '[core]',
          inv: 'Pop core: decrement indeg[auth]→0 (push, dp=4) and indeg[db]→0 (push, dp=7).'
        },
        {
          indeg: ['DONE,dp=0', 'DONE,dp=4', 'DONE,dp=7', 'in=0,dp=12', 'DONE,dp=15'],
          states: ['match', 'match', 'match', 'match', 'match'],
          q: '[] (All 5 peeled!)',
          order: '[core, auth, db, api, app]',
          inv: 'Pop auth & db → relax api: dp[api] = max(4+3, 7+5) = 12ms; pop api → dp[app] = 15ms. All V=5 vertices emitted ⇒ Valid DAG!'
        }
      ];

      return steps.map(st => {
        const eSvg = [
          drawEdge(95, 115, 255, 55, '+4ms', 'match', true),
          drawEdge(95, 115, 255, 175, '+7ms', 'match', true),
          drawEdge(255, 55, 435, 115, '+3ms', 'default', true),
          drawEdge(255, 175, 435, 115, '+5ms', 'active', true),
          drawEdge(435, 115, 585, 115, '+3ms', 'active', true)
        ].join('');
        const nSvg = nodes.map((n, i) => drawNode(n.x, n.y, n.lbl, st.indeg[i], st.states[i], 22)).join('');
        return {
          stageHtml: svgGraphBox(eSvg + nSvg, 660, 225),
          invariant: st.inv,
          metrics: [
            { label: 'Indegree-0 Queue', value: st.q },
            { label: 'Topological Order', value: st.order },
            { label: 'Critical Path DP', value: '15 ms (core→db→api→app)' }
          ],
          log: st.inv
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 4. DSU Path Compression vs Rollback Undo-Stack & Offline Timeline
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-dsu-rollback-timeline'] = createStepSimulator({
    id: 'sim-dsu-rollback-timeline',
    aliases: ['sim-dsu-path-compression', 'sim-dsu-rollback'],
    title: 'DSU Path Compression vs Undo-Stack Rollback & Dynamic Connectivity Tree',
    badge: 'O(α(N)) Amortized vs O(log N) Rollback',
    badgeClass: 'badge-o1',
    blurb: 'Contrast standard Disjoint Set Union (Union-by-Rank + Path Compression flattening trees in O(α(N))) against Rollback DSU (Union-by-Rank ONLY + explicit undo stack [(child, oldParent, oldRank)]) walking an offline edge-lifespan segment tree.',
    slugs: [
      'dsu-rank-compression-ackermann',
      'dsu-rollback-dynamic-connectivity',
      'disjoint-set-union-ackermann',
      'dsu-rollback-weighted-offline'
    ],
    presets: [
      { id: 'compress', label: 'DSU Union-by-Rank + Path Compression (O(α(N)) Flatten)', mode: 'compress' },
      { id: 'rollback', label: 'Rollback DSU Undo-Stack & Offline Time-Segment Tree [t_add, t_del]', mode: 'rollback' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'rollback') {
        const steps = [
          {
            seg: 'Enter SegTree Node [t=1..4]: add edge (1,2) & (2,3)',
            undo: '[(child=2, p=2, rk=0), (child=3, p=3, rk=1)]',
            comps: '3 components: {0}, {1,2,3}, {4}',
            activeSeg: 'match',
            inv: 'At segment node [1..4], union(1,2) and union(2,3) by rank WITHOUT path compression so tree links can be reversed in O(1)!'
          },
          {
            seg: 'Enter Left Child [t=1..2]: add edge (0,1) -> Query connectivity',
            undo: '[(2,2,0), (3,3,1), (0,0,0)] (checkpoint=2)',
            comps: '2 components: {0,1,2,3}, {4}',
            activeSeg: 'active',
            inv: 'Saved checkpoint=2, pushed (0, oldP=0, oldRk=0) onto undo stack. Answer query at t=1..2: connected(0,3) == TRUE!'
          },
          {
            seg: 'Exit [t=1..2] -> rollback(checkpoint=2): pop undo stack!',
            undo: '[(child=2, p=2, rk=0), (child=3, p=3, rk=1)]',
            comps: 'Restored 3 components: {0}, {1,2,3}, {4}',
            activeSeg: 'pivot',
            inv: 'Rollback(2) pops (child=0, oldP=0, oldRk=0), restoring parent[0]=0 and rank[1] in exact O(1) before recursing into right child [t=3..4]!'
          }
        ];
        return steps.map(st => {
          const svg = `
            <text x="165" y="24" text-anchor="middle" fill="#94a3b8" font-size="11">DSU Forest (Rank-Only, No Compression)</text>
            ${drawEdge(165, 65, 95, 155, 'p[2]=1', 'match', true)}
            ${drawEdge(165, 65, 235, 155, 'p[3]=1', 'match', true)}
            ${st.activeSeg === 'active' ? drawEdge(165, 65, 35, 155, 'p[0]=1', 'active', true) : ''}
            ${drawNode(35, 155, '0', st.activeSeg === 'active' ? 'p=1' : 'root', st.activeSeg === 'active' ? 'active' : 'default', 20)}
            ${drawNode(165, 65, '1', 'root,rk=1', 'match', 20)}
            ${drawNode(95, 155, '2', 'p=1', 'match', 20)}
            ${drawNode(235, 155, '3', 'p=1', 'match', 20)}
            <line x1="330" y1="15" x2="330" y2="205" stroke="#334155" stroke-dasharray="4,4"/>
            <text x="500" y="24" text-anchor="middle" fill="#94a3b8" font-size="11">Offline Time-Segment Tree [t_add, t_del]</text>
            ${drawEdge(500, 65, 420, 155, 'left', st.activeSeg === 'active' ? 'active' : 'default', true)}
            ${drawEdge(500, 65, 580, 155, 'right', 'default', true)}
            ${drawNode(500, 65, '[1..4]', 'e:(1,2),(2,3)', 'match', 24)}
            ${drawNode(420, 155, '[1..2]', 'e:(0,1)', st.activeSeg, 24)}
            ${drawNode(580, 155, '[3..4]', 'e:(3,4)', 'default', 24)}
          `;
          return {
            stageHtml: svgGraphBox(svg, 660, 215),
            invariant: st.inv,
            metrics: [
              { label: 'Active Time Node', value: st.seg },
              { label: 'Undo Stack', value: st.undo },
              { label: 'Current Partition', value: st.comps }
            ],
            log: st.inv
          };
        });
      }

      // Path compression preset
      const steps = [
        {
          chain: true,
          parent: '[0, 0, 1, 2, 3]',
          inv: 'Before find(4): Skewed chain 4 → 3 → 2 → 1 → 0 (depth 4). Calling find(4) walks up to root 0.'
        },
        {
          chain: false,
          parent: '[0, 0, 0, 0, 0]',
          inv: 'After find(4) Path Compression: parent[x] = find(parent[x]) rewires 4, 3, 2 directly to root 0! Future queries on {1,2,3,4} take O(1)!'
        }
      ];
      return steps.map(st => {
        const svg = st.chain
          ? `${drawEdge(540, 115, 415, 115, 'p[4]=3', 'active', true)}
             ${drawEdge(415, 115, 290, 115, 'p[3]=2', 'active', true)}
             ${drawEdge(290, 115, 165, 115, 'p[2]=1', 'active', true)}
             ${drawEdge(165, 115, 65, 115, 'p[1]=0', 'active', true)}
             ${[0, 1, 2, 3, 4].map((v, i) => drawNode(65 + i * 118, 115, `v${v}`, i === 0 ? 'ROOT' : `depth=${i}`, i === 4 ? 'active' : 'default')).join('')}`
          : `${[1, 2, 3, 4].map((v, i) => drawEdge(140 + i * 120, 165, 320, 55, 'p=0', 'match', true)).join('')}
             ${drawNode(320, 55, 'v0', 'ROOT (rk=2)', 'match')}
             ${[1, 2, 3, 4].map((v, i) => drawNode(140 + i * 120, 165, `v${v}`, 'p=0 (depth 1)', 'match')).join('')}`;
        return {
          stageHtml: svgGraphBox(svg, 660, 215) + renderArrayCells(JSON.parse(st.parent), { match: [0, 1, 2, 3, 4] }),
          invariant: st.inv,
          metrics: [
            { label: 'parent[] Array', value: st.parent },
            { label: 'Tree Depth', value: st.chain ? '4 hops' : '1 hop (Flattened!)' },
            { label: 'Amortized Cost', value: 'O(α(N)) ≤ 4' }
          ],
          log: st.inv
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 5. Kruskal / Prim / Boruvka MST & Cut / Cycle Optimality
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-kruskal-dsu-mst'] = createStepSimulator({
    id: 'sim-kruskal-dsu-mst',
    aliases: ['sim-kruskal-prim-dsu', 'sim-dsu-kruskal', 'sim-kruskal-prim-mst'],
    title: 'Minimum Spanning Tree: Kruskal’s DSU Scan, Cut & Cycle Optimality',
    badge: 'O(E log E) · Cut & Cycle Properties',
    badgeClass: 'badge-onlogn',
    blurb: 'Trace Kruskal’s weight-sorted edge scan alongside DSU component merging: accept every light edge crossing a cut (find(u) != find(v)) and reject any cycle-closing heaviest edge (find(u) == find(v)).',
    slugs: [
      'mst-cut-cycle-kruskal-prim-boruvka',
      'mst-variants-bottleneck-steiner-arborescence',
      'mst-cut-cycle-properties'
    ],
    presets: [
      { id: 'kruskal', label: 'Kruskal’s Sorted Edge Scan + Cut/Cycle Property Verification', mode: 'kruskal' },
      { id: 'boruvka', label: 'Borůvka’s Parallel Component Hook Round (O(log V) Rounds)', mode: 'boruvka' }
    ],
    buildFrames(preset) {
      const coords = [
        { x: 100, y: 65, id: 'v0' },
        { x: 270, y: 50, id: 'v1' },
        { x: 185, y: 175, id: 'v2' },
        { x: 430, y: 115, id: 'v3' },
        { x: 580, y: 115, id: 'v4' }
      ];
      const allEdges = [
        [0, 1, 'w=1'], [1, 2, 'w=2'], [0, 2, 'w=3'], [2, 3, 'w=4'], [3, 4, 'w=5'], [1, 3, 'w=6']
      ];

      if (preset.mode === 'boruvka') {
        const eSvg = allEdges.map(([u, v, w], idx) =>
          drawEdge(coords[u].x, coords[u].y, coords[v].x, coords[v].y, w, [0, 1, 3, 4].includes(idx) ? 'match' : 'faint', false)
        ).join('');
        const nSvg = coords.map(c => drawNode(c.x, c.y, c.id, 'comp=0', 'match')).join('');
        return [
          {
            stageHtml: svgGraphBox(eSvg + nSvg, 660, 220),
            invariant: 'Borůvka Round 1: Each vertex simultaneously selects its minimum incident edge: v0→(0,1,w=1), v2→(1,2,w=2), v3→(2,3,w=4), v4→(3,4,w=5) ⇒ All 5 vertices merge in 1 parallel round!',
            metrics: [
              { label: 'Borůvka Rounds', value: '1 (≤ log₂ V)' },
              { label: 'Selected MST Weight', value: '1 + 2 + 4 + 5 = 12' },
              { label: 'Bottleneck Max Edge', value: 'w = 5 (Minimax Path)' }
            ],
            log: 'Borůvka parallel hook selected 4 safe cut edges in Round 1, completing MST of weight 12.'
          }
        ];
      }

      const steps = [
        {
          eState: ['match', 'match', 'default', 'default', 'default', 'default'],
          parent: '[0, 0, 0, 3, 4]',
          cost: 3,
          comps: 3,
          inv: 'Accepted (v0—v1, w=1) and (v1—v2, w=2) by Cut Property (find(u) != find(v)). Merged {v0,v1,v2} into root 0.'
        },
        {
          eState: ['match', 'match', 'warn', 'default', 'default', 'default'],
          parent: '[0, 0, 0, 3, 4]',
          cost: 3,
          comps: 3,
          inv: 'Inspect (v0—v2, w=3): find(0) == find(2) == 0! By Cycle Property, (v0—v2, w=3) is the heaviest edge on cycle v0-v1-v2 ⇒ REJECTED!'
        },
        {
          eState: ['match', 'match', 'warn', 'match', 'match', 'warn'],
          parent: '[0, 0, 0, 0, 0]',
          cost: 12,
          comps: 1,
          inv: 'Accepted (v2—v3, w=4) and (v3—v4, w=5); rejected (v1—v3, w=6). V-1 = 4 edges chosen ⇒ Unique MST of total weight 12!'
        }
      ];

      return steps.map(st => {
        const eSvg = allEdges.map(([u, v, w], idx) =>
          drawEdge(coords[u].x, coords[u].y, coords[v].x, coords[v].y, w, st.eState[idx], false)
        ).join('');
        const nSvg = coords.map((c, idx) => drawNode(c.x, c.y, c.id, `p=${JSON.parse(st.parent)[idx]}`, 'match')).join('');
        return {
          stageHtml: svgGraphBox(eSvg + nSvg, 660, 220),
          invariant: st.inv,
          metrics: [
            { label: 'DSU parent[]', value: st.parent },
            { label: 'Connected Comps', value: `${st.comps}` },
            { label: 'Total MST Weight', value: `${st.cost}` }
          ],
          log: st.inv
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 6. Dijkstra, A* Heuristic Frontier & Contraction Hierarchies (OSRM)
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-dijkstra-astar-grid'] = createStepSimulator({
    id: 'sim-dijkstra-astar-grid',
    aliases: ['sim-dijkstra-astar-bellman', 'sim-dijkstra-astar'],
    title: 'Shortest Paths: Dijkstra, A* Consistent Potentials & OSRM Contraction Hierarchies',
    badge: 'O((V+E) log V) · A* f=g+h · CH Shortcuts',
    badgeClass: 'badge-onlogn',
    blurb: 'Compare Dijkstra’s uniform radial frontier against A* directional pruning f(u) = g(u) + h(u) and OSRM Contraction Hierarchies (shortcut insertion w(u,w)=w(u,v)+w(v,w) + upward rank-monotonic bidirectional search).',
    slugs: [
      'dijkstra-radix-dial-buckets',
      'astar-heuristic-admissibility',
      'case-osrm-contraction-hierarchies',
      'build-astar-bidirectional-pathfinder',
      'dijkstra-relaxation-invariants',
      'state-space-dijkstra-layered-graphs',
      'build-astar-bidirectional-router'
    ],
    presets: [
      { id: 'astar', label: 'A* Search f(u) = g(u) + h(u) vs Dijkstra Frontier Pruning', mode: 'astar' },
      { id: 'ch', label: 'OSRM Contraction Hierarchies: Node Contraction Shortcuts & Upward Meet', mode: 'ch' },
      { id: 'bidir', label: 'Bidirectional Stopping Criterion: topF + topB ≥ μ (Not First Overlap!)', mode: 'bidir' }
    ],
    buildFrames(preset) {
      const coords = [
        { x: 90, y: 115, id: 'S' },
        { x: 245, y: 50, id: 'B' },
        { x: 245, y: 180, id: 'C' },
        { x: 420, y: 50, id: 'D' },
        { x: 575, y: 115, id: 'T' }
      ];

      if (preset.mode === 'ch') {
        const steps = [
          {
            shortcut: false,
            inv: 'Contraction Phase: Contract low-rank node B (rank 1) between S (rank 3) and D (rank 4). Witness search finds shortest S→D path goes through B (2 + 2 = 4)!'
          },
          {
            shortcut: true,
            inv: 'Shortcut Insertion & Upward Query: Insert shortcut S → D (w=4) bypassing B! During query, forward upward search S→D (rank 3→4) meets backward upward search T→D (rank 2→4) at apex D!'
          }
        ];
        return steps.map(st => {
          const eSvg = [
            drawEdge(90, 115, 245, 50, 'w=2', st.shortcut ? 'faint' : 'active', true),
            drawEdge(245, 50, 420, 50, 'w=2', st.shortcut ? 'faint' : 'active', true),
            st.shortcut ? drawEdge(90, 115, 420, 50, 'SHORTCUT w=4', 'match', true) : '',
            drawEdge(575, 115, 420, 50, 'upward w=2', st.shortcut ? 'match' : 'default', true),
            drawEdge(90, 115, 245, 180, 'w=5', 'faint', true)
          ].join('');
          const nSvg = [
            drawNode(90, 115, 'S', 'rk=3,dF=0', 'match'),
            drawNode(245, 50, 'B', 'rk=1 (contracted)', st.shortcut ? 'default' : 'pivot'),
            drawNode(245, 180, 'C', 'rk=2', 'default'),
            drawNode(420, 50, 'D (Apex)', 'rk=4,dF=4,dB=2', st.shortcut ? 'match' : 'active', 24),
            drawNode(575, 115, 'T', 'rk=2,dB=0', 'match')
          ].join('');
          return {
            stageHtml: svgGraphBox(eSvg + nSvg, 660, 225),
            invariant: st.inv,
            metrics: [
              { label: 'Inserted Shortcut', value: st.shortcut ? 'S → D (w = 2+2 = 4)' : 'Witnessing S→B→D' },
              { label: 'Upward Apex Meet', value: 'Node D (rank 4): d_F(4) + d_B(2) = 6' },
              { label: 'Visited Nodes', value: '3 / 20,000,000 (~0.8 ms)' }
            ],
            log: st.inv
          };
        });
      }

      if (preset.mode === 'bidir') {
        const eSvg = [
          drawEdge(90, 115, 245, 180, 'w=5', 'warn', true),
          drawEdge(575, 115, 245, 180, 'w=5', 'warn', true),
          drawEdge(90, 115, 245, 50, 'w=2', 'match', true),
          drawEdge(245, 50, 420, 50, 'w=2', 'match', true),
          drawEdge(420, 50, 575, 115, 'w=2', 'match', true)
        ].join('');
        const nSvg = [
          drawNode(90, 115, 'S', 'dF=0', 'match'),
          drawNode(245, 50, 'B', 'dF=2', 'match'),
          drawNode(245, 180, 'C (Trap)', 'dF+dB=10', 'warn', 23),
          drawNode(420, 50, 'D', 'dF=4,dB=2', 'match'),
          drawNode(575, 115, 'T', 'dB=0', 'match')
        ].join('');
        return [
          {
            stageHtml: svgGraphBox(eSvg + nSvg, 660, 225),
            invariant: 'Bidirectional Stopping Theorem: First overlap at C gives μ = 5+5 = 10, NOT optimal! Search continues until topF + topB ≥ μ, discovering S→B→D→T of cost 6!',
            metrics: [
              { label: 'First Overlap (C)', value: 'dF(5) + dB(5) = 10 (Suboptimal!)' },
              { label: 'True Best Path μ', value: 'S→B→D→T = 6' },
              { label: 'Termination Rule', value: 'pqF.top() + pqB.top() ≥ μ' }
            ],
            log: 'Continued past first overlap C (μ=10) until topF + topB >= 6; verified optimal path S→B→D→T (cost 6).'
          }
        ];
      }

      // Default A*
      const steps = [
        {
          tags: ['g=0,f=6', 'g=2,f=6', 'g=5,f=9', 'g=∞', 'g=∞'],
          states: ['match', 'active', 'pivot', 'default', 'default'],
          pq: '[(B, f=6), (C, f=9)]',
          inv: 'Pop S (g=0, h=6): relax B (g=2, h=4 ⇒ f=6) and C (g=5, h=4 ⇒ f=9). Admissible heuristic h(u) ≤ d(u,T) pulls B ahead of C!'
        },
        {
          tags: ['g=0,f=6', 'g=2,f=6', 'g=5,f=9 (SKIP)', 'g=4,f=6', 'g=6,f=6'],
          states: ['match', 'match', 'default', 'match', 'match'],
          pq: '[(T, f=6), (C, f=9)]',
          inv: 'Pop B → relax D (g=4, h=2 ⇒ f=6) → relax T (g=6, h=0 ⇒ f=6)! T is popped before C (f=9) is ever expanded!'
        }
      ];

      return steps.map(st => {
        const eSvg = [
          drawEdge(90, 115, 245, 50, 'w=2', 'match', true),
          drawEdge(90, 115, 245, 180, 'w=5', 'default', true),
          drawEdge(245, 50, 420, 50, 'w=2', 'match', true),
          drawEdge(420, 50, 575, 115, 'w=2', 'match', true),
          drawEdge(245, 180, 575, 115, 'w=4', 'faint', true)
        ].join('');
        const nSvg = coords.map((c, i) => drawNode(c.x, c.y, c.id, st.tags[i], st.states[i], 22)).join('');
        return {
          stageHtml: svgGraphBox(eSvg + nSvg, 660, 225),
          invariant: st.inv,
          metrics: [
            { label: 'Priority Queue', value: st.pq },
            { label: 'Pruned Detour', value: 'Vertex C (f=9 > d*(T)=6)' },
            { label: 'Consistency', value: 'w_h(u,v) = w(u,v) + h(v) - h(u) ≥ 0' }
          ],
          log: st.inv
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 7. Bellman-Ford Negative Cycle, Floyd-Warshall & Johnson APSP
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-bellman-ford-floyd-johnson'] = createStepSimulator({
    id: 'sim-bellman-ford-floyd-johnson',
    aliases: ['sim-bellman-ford-floyd', 'sim-bellman-ford-negative-cycle', 'sim-floyd-warshall-johnson'],
    title: 'Bellman-Ford Negative-Cycle Witness, Floyd-Warshall k-Pivot & Johnson Reweighting',
    badge: 'O(VE) Bellman-Ford · O(V³) Floyd · O(VE log V) Johnson',
    badgeClass: 'badge-on2',
    blurb: 'Witness negative cycles on the V-th relaxation round of Bellman-Ford, inspect Floyd-Warshall’s in-place DP matrix D^(k)[i][j] = min(D[i][j], D[i][k]+D[k][j]), and reweight negative edges to non-negative via Johnson potentials w_hat(u,v) = w(u,v) + h(u) - h(v) ≥ 0.',
    slugs: [
      'bellman-ford-spfa-negative-cycles',
      'floyd-warshall-johnson-apsp',
      'bellman-ford-spfa-difference-constraints'
    ],
    presets: [
      { id: 'bellman', label: 'Bellman-Ford V-th Round Negative Cycle Detection & Parent Traceback', mode: 'bellman' },
      { id: 'floyd', label: 'Floyd-Warshall k-Pivot Matrix Update D^(k)[i][j]', mode: 'floyd' },
      { id: 'johnson', label: 'Johnson’s Potential Reweighting w_hat(u,v) = w(u,v) + h(u) - h(v) ≥ 0', mode: 'johnson' }
    ],
    buildFrames(preset) {
      const coords = [
        { x: 100, y: 115, id: 'v0' },
        { x: 280, y: 45, id: 'v1' },
        { x: 280, y: 185, id: 'v2' },
        { x: 495, y: 115, id: 'v3' }
      ];

      if (preset.mode === 'johnson') {
        const eSvg = [
          drawEdge(100, 115, 280, 45, 'w=-2 ⇒ ŵ=0', 'match', true),
          drawEdge(280, 45, 280, 185, 'w=-1 ⇒ ŵ=0', 'match', true),
          drawEdge(100, 115, 280, 185, 'w=4 ⇒ ŵ=7', 'active', true),
          drawEdge(280, 185, 495, 115, 'w=2 ⇒ ŵ=0', 'match', true)
        ].join('');
        const nSvg = [
          drawNode(100, 115, 'v0', 'h=0', 'match', 22),
          drawNode(280, 45, 'v1', 'h=-2', 'match', 22),
          drawNode(280, 185, 'v2', 'h=-3', 'match', 22),
          drawNode(495, 115, 'v3', 'h=-1', 'match', 22)
        ].join('');
        return [
          {
            stageHtml: svgGraphBox(eSvg + nSvg, 620, 225),
            invariant: 'Johnson’s Telescoping Theorem: Bellman-Ford from super-source q computes h(v) = d(q,v) = [0, -2, -3, -1]. Every reweighted edge ŵ(u,v) = w(u,v) + h(u) - h(v) ≥ 0, enabling V fast Dijkstra runs!',
            metrics: [
              { label: 'Potentials h(v)', value: '[0, -2, -3, -1]' },
              { label: 'Reweighted ŵ(u,v)', value: 'All ≥ 0 (Triangle Inequality)' },
              { label: 'Path Telescoping', value: 'ŵ(P) = w(P) + h(s) - h(t)' }
            ],
            log: 'Reweighted negative edges (v0→v1: -2+0-(-2)=0, v1→v2: -1+(-2)-(-3)=0) so all ŵ >= 0.'
          }
        ];
      }

      if (preset.mode === 'floyd') {
        const mat = [
          ['0', '-2', '-3 (via v1)', '-1'],
          ['∞', '0', '-1', '1 (via v2)'],
          ['∞', '∞', '0', '2'],
          ['∞', '∞', '∞', '0']
        ];
        const tableHtml = `
          <table class="complexity-matrix" style="margin:6px 0;font-family:var(--font-mono,monospace);font-size:12px;">
            <thead><tr><th>D^(k=2)</th><th>to v0</th><th>to v1</th><th>to v2</th><th>to v3</th></tr></thead>
            <tbody>
              ${mat.map((row, i) => `<tr><td><strong>from v${i}</strong></td>${row.map(c => `<td style="${c.includes('via') ? 'color:#34d399;font-weight:700;' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        `;
        return [
          {
            stageHtml: tableHtml,
            invariant: 'Floyd-Warshall Outer Loop k=2: D^(2)[i][j] = min(D^(1)[i][j], D^(1)[i][2] + D^(1)[2][j]). Relaxed D[1][3] = D[1][2](-1) + D[2][3](2) = 1!',
            metrics: [
              { label: 'Outer Pivot k', value: 'k = 2 (Intermediate vertex v2)' },
              { label: 'Neg-Cycle Diagonal', value: '∀i: D[i][i] == 0 (No neg cycle)' },
              { label: 'Space Complexity', value: 'O(V²) In-Place Matrix' }
            ],
            log: 'Completed pivot k=2 in Floyd-Warshall matrix; updated D[0][2]=-3 and D[1][3]=1.'
          }
        ];
      }

      // Bellman-Ford Negative Cycle
      const steps = [
        {
          d: ['d=0', 'd=1', 'd=2', 'd=-1'],
          warn: false,
          inv: 'Rounds 1..V-1 (1..3): Relaxed all edges. Current distances d = [0, 1, 2, -1]. If no negative cycle exists, all shortest paths are settled.'
        },
        {
          d: ['d=0', 'd=-1!', 'd=0!', 'd=-3!'],
          warn: true,
          inv: 'Round V (4-th Pass): Edge v2→v1 (w=-2) STILL relaxes d[v1]! Walking parent[] V=4 steps back lands inside Negative Cycle v1 → v3 → v2 → v1 (sum = -2 < 0)!'
        }
      ];

      return steps.map(st => {
        const eSvg = [
          drawEdge(100, 115, 280, 45, 'w=4', 'default', true),
          drawEdge(280, 45, 495, 115, 'w=-2', st.warn ? 'warn' : 'active', true),
          drawEdge(495, 115, 280, 185, 'w=1', st.warn ? 'warn' : 'active', true),
          drawEdge(280, 185, 280, 45, 'w=-1', st.warn ? 'warn' : 'active', true)
        ].join('');
        const nSvg = coords.map((c, i) => drawNode(c.x, c.y, c.id, st.d[i], st.warn && i > 0 ? 'warn' : 'match', 22)).join('');
        return {
          stageHtml: svgGraphBox(eSvg + nSvg, 620, 225),
          invariant: st.inv,
          metrics: [
            { label: 'Bellman-Ford Pass', value: st.warn ? 'Round V = 4 (Cycle Witness!)' : 'Round V-1 = 3' },
            { label: 'Negative Cycle', value: st.warn ? 'v1 → v3 → v2 → v1 (sum = -2)' : 'Checking...' },
            { label: 'Diff Constraints', value: st.warn ? 'UNSATISFIABLE (Neg Cycle)' : 'Feasible so far' }
          ],
          log: st.inv
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 8. Dinic's Max-Flow, S-T Min-Cut & Hopcroft-Karp Matching
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-dinic-max-flow'] = createStepSimulator({
    id: 'sim-dinic-max-flow',
    aliases: ['sim-dinic-maxflow', 'sim-bipartite-hopcroft-karp'],
    title: 'Dinic’s Max-Flow: BFS Level Graph, Blocking Flow, S-T Min-Cut & Hopcroft-Karp',
    badge: 'O(V²E) Dinic · O(E√V) Unit / Matching',
    badgeClass: 'badge-on2',
    blurb: 'Visualize Dinic’s BFS level graph L_G and current-arc DFS blocking flows alongside backward residual arcs (v→u), extract the saturated S-T minimum cut, or step through Hopcroft-Karp disjoint shortest augmenting paths.',
    slugs: [
      'flow-networks-residual-ford-fulkerson',
      'edmonds-karp-capacity-scaling',
      'dinic-level-graph-blocking-flow',
      'hopcroft-karp-bipartite-matching',
      'build-dinic-max-flow',
      'flow-networks-residual-graphs',
      'max-flow-min-cut-theorem',
      'edmonds-karp-shortest-augmenting',
      'bipartite-matching-hopcroft-karp',
      'build-dinic-max-flow-engine'
    ],
    presets: [
      { id: 'dinic', label: 'Dinic Blocking Flow Phases & S-T Min-Cut Extraction (Max-Flow = 19)', mode: 'dinic' },
      { id: 'hopcroft', label: 'Hopcroft-Karp Bipartite Matching & König Minimum Vertex Cover', mode: 'hopcroft' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'hopcroft') {
        const svg = `
          ${drawEdge(140, 50, 480, 50, 'M', 'match', false)}
          ${drawEdge(140, 115, 480, 180, 'M (flipped)', 'match', false)}
          ${drawEdge(140, 180, 480, 115, 'M (flipped)', 'match', false)}
          ${drawEdge(140, 115, 480, 115, 'unmatched', 'faint', false)}
          ${drawNode(140, 50, 'L1', 'matched R1', 'match')}
          ${drawNode(140, 115, 'L2', 'matched R3', 'match')}
          ${drawNode(140, 180, 'L3', 'matched R2', 'match')}
          ${drawNode(480, 50, 'R1', 'matched L1', 'match')}
          ${drawNode(480, 115, 'R2', 'matched L3', 'match')}
          ${drawNode(480, 180, 'R3', 'matched L2', 'match')}
        `;
        return [
          {
            stageHtml: svgGraphBox(svg, 640, 225),
            invariant: 'Hopcroft-Karp Augmentation: Alternating path L3 (free) → R2 ══ L2 → R3 (free) flipped via symmetric difference M ⊕ P, increasing |M| from 2 to 3 in O(E√V)!',
            metrics: [
              { label: 'Matching Size |M|', value: '3 / 3 (Perfect Matching)' },
              { label: 'König Min Vertex Cover', value: '|MVC| == |M| = 3' },
              { label: 'Phase Bound', value: '≤ 2√V Phases' }
            ],
            log: 'Augmented along shortest alternating path L3→R2→L2→R3; |M| = 3.'
          }
        ];
      }

      const coords = [
        { x: 75, y: 115, id: 'S' },
        { x: 235, y: 50, id: 'A' },
        { x: 235, y: 180, id: 'B' },
        { x: 425, y: 50, id: 'C' },
        { x: 425, y: 180, id: 'D' },
        { x: 585, y: 115, id: 'T' }
      ];
      const steps = [
        {
          flows: ['10/10', '4/10', '4/4', '6/8', '4/9', '4/10', '0/6', '10/10'],
          eStates: ['warn', 'active', 'warn', 'active', 'active', 'active', 'default', 'warn'],
          nSub: ['lvl=0', 'lvl=1', 'lvl=1', 'lvl=2', 'lvl=2', 'lvl=3'],
          nState: ['match', 'active', 'active', 'active', 'active', 'match'],
          total: 14,
          phase: 'Phase 1 Blocking Flow (level[T] = 3)',
          inv: 'Phase 1 Blocking Flow: Pushed 4 along S→A→C→T and 10 along S→{A,B}→D→T. Edges S→A, A→C, D→T saturated! Total flow = 14.'
        },
        {
          flows: ['10/10', '9/10', '4/4', '6/8', '9/9', '9/10', '5/6', '10/10'],
          eStates: ['warn', 'match', 'warn', 'match', 'warn', 'match', 'match', 'warn'],
          nSub: ['S-side', 'S-side', 'S-side', 'T-side', 'T-side', 'T-side'],
          nState: ['match', 'match', 'match', 'pivot', 'pivot', 'pivot'],
          total: 19,
          phase: 'Phase 2 Blocking Flow (level[T] = 4) → Min-Cut!',
          inv: 'Phase 2: Pushed +5 along S→B→D→C→T! Next BFS reaches only S={S, B}; saturated cut edges S→A(10) + B→D(9) = 19 == Max-Flow!'
        }
      ];

      const ePairs = [
        [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [3, 5], [4, 3], [4, 5]
      ];
      return steps.map(st => {
        const eSvg = ePairs.map(([u, v], i) =>
          drawEdge(coords[u].x, coords[u].y, coords[v].x, coords[v].y, st.flows[i], st.eStates[i], true)
        ).join('');
        const nSvg = coords.map((c, i) => drawNode(c.x, c.y, c.id, st.nSub[i], st.nState[i], 22)).join('');
        return {
          stageHtml: svgGraphBox(eSvg + nSvg, 660, 225),
          invariant: st.inv,
          metrics: [
            { label: 'Total Max-Flow |f|', value: `${st.total}` },
            { label: 'Dinic Phase', value: st.phase },
            { label: 'S-T Min-Cut Capacity', value: 'c(S→A)=10 + c(B→D)=9 = 19' }
          ],
          log: st.inv
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 9. Push-Relabel Vertex Heights h(u), Excess e(u) & Edmonds Blossom
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-push-relabel-preflow'] = createStepSimulator({
    id: 'sim-push-relabel-preflow',
    aliases: ['sim-push-relabel', 'sim-edmonds-blossom'],
    title: 'Push-Relabel Vertex Heights h(u), Excess e(u) & Edmonds Blossom Contraction',
    badge: 'O(V²√E) HLPP · Gap Heuristic · Odd Blossom',
    badgeClass: 'badge-on2',
    blurb: 'Watch Push-Relabel initialize h(s)=V, saturate source arcs to create excess e(u)>0, push flow strictly downhill along admissible arcs (h(u) == h(v)+1), relabel stuck vertices, and contract odd-length blossoms in general matching.',
    slugs: [
      'push-relabel-hlpp-gap-heuristic',
      'general-matching-blossom-edmonds',
      'push-relabel-preflow'
    ],
    presets: [
      { id: 'preflow', label: 'Push-Relabel Preflow Initialize (h(s)=V), Downward Push & Relabel', mode: 'preflow' },
      { id: 'blossom', label: 'Edmonds Blossom Algorithm: Odd-Cycle Contraction & Lifting', mode: 'blossom' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'blossom') {
        const svg = `
          <text x="175" y="22" text-anchor="middle" fill="#94a3b8" font-size="11">1. Odd Cycle C₅ Witnessed (dist even-even edge)</text>
          ${drawEdge(60, 120, 135, 120, 'free', 'active', false)}
          ${drawEdge(135, 120, 200, 60, 'M', 'match', false)}
          ${drawEdge(135, 120, 200, 180, 'free', 'active', false)}
          ${drawEdge(200, 60, 275, 90, 'free', 'active', false)}
          ${drawEdge(200, 180, 275, 150, 'M', 'match', false)}
          ${drawEdge(275, 90, 275, 150, 'ODD!', 'warn', false)}
          ${drawNode(60, 120, 'r', 'root(E)', 'active', 18)}
          ${drawNode(135, 120, 'b', 'base(O)', 'pivot', 18)}
          ${drawNode(200, 60, 'v1', 'even', 'match', 18)}
          ${drawNode(200, 180, 'v2', 'even', 'match', 18)}
          ${drawNode(275, 90, 'v3', 'even', 'warn', 18)}
          ${drawNode(275, 150, 'v4', 'even', 'warn', 18)}
          <line x1="340" y1="15" x2="340" y2="210" stroke="#334155" stroke-dasharray="4,4"/>
          <text x="500" y="22" text-anchor="middle" fill="#94a3b8" font-size="11">2. Contracted Super-Vertex B & Lifted Path</text>
          ${drawEdge(390, 120, 495, 120, 'to base b', 'match', false)}
          ${drawEdge(495, 120, 600, 120, 'to free w!', 'match', false)}
          ${drawNode(390, 120, 'r', 'free', 'match', 20)}
          ${drawNode(495, 120, 'Blossom B', '2k+1=5', 'pivot', 30)}
          ${drawNode(600, 120, 'w', 'free', 'match', 20)}
        `;
        return [
          {
            stageHtml: svgGraphBox(svg, 660, 225),
            invariant: 'Edmonds Blossom Theorem: Contracting odd cycle B (size 2k+1=5, base b) into super-vertex B preserves augmenting paths! Augmenting r → B → w lifts through the even/odd arc of B to increase |M| by +1.',
            metrics: [
              { label: 'Blossom Base', value: 'Vertex b (LCA in alternating tree)' },
              { label: 'Odd Cycle Size', value: '2k + 1 = 5 vertices' },
              { label: 'Lifted Matching', value: '|M| increases by +1' }
            ],
            log: 'Contracted 5-cycle blossom B into super-vertex, found augmenting path r→B→w, and lifted matching around odd cycle.'
          }
        ];
      }

      // Push-Relabel Height Layer Graph
      const steps = [
        {
          heights: [4, 0, 0, 0],
          excess: ['e=0', 'e=8 (active)', 'e=4 (active)', 'e=0'],
          inv: 'Initialize Preflow: Set h(S) = V = 4 and saturate all outgoing arcs from S ⇒ e(A)=8, e(B)=4. Since h(A)=0 == h(T)=0, A cannot push to T yet!'
        },
        {
          heights: [4, 1, 1, 0],
          excess: ['e=0', 'e=3 (relabel)', 'e=0', 'e=9 (sink)'],
          inv: 'Relabel & Push: relabel(A) raises h(A) from 0 to 1 + h(T) = 1, making A→T (cap 5) admissible (h(A)=1 == h(T)+1)! Pushed 5 from A→T and 4 from B→T.'
        },
        {
          heights: [4, 5, 1, 0],
          excess: ['e=3 (returned)', 'e=0', 'e=0', 'e=9 (MAX FLOW)'],
          inv: 'Bottleneck Return & Gap Heuristic: Remaining excess e(A)=3 cannot reach T; relabel(A) raises h(A) = h(S)+1 = 5 and pushes 3 back to S! Max-Flow = 9.'
        }
      ];

      return steps.map(st => {
        const yOf = h => 185 - Math.min(h, 5) * 26;
        const coords = [
          { x: 110, y: yOf(st.heights[0]), id: 'S' },
          { x: 280, y: yOf(st.heights[1]), id: 'A' },
          { x: 430, y: yOf(st.heights[2]), id: 'B' },
          { x: 580, y: yOf(st.heights[3]), id: 'T' }
        ];
        const gridLines = [0, 1, 2, 3, 4, 5].map(h =>
          `<line x1="40" y1="${yOf(h)}" x2="630" y2="${yOf(h)}" stroke="rgba(148,163,184,0.12)" stroke-dasharray="3,3"/>
           <text x="22" y="${yOf(h) + 4}" fill="#64748b" font-size="9.5">h=${h}</text>`
        ).join('');
        const eSvg = [
          drawEdge(coords[0].x, coords[0].y, coords[1].x, coords[1].y, '8/8', 'match', true),
          drawEdge(coords[0].x, coords[0].y, coords[2].x, coords[2].y, '4/4', 'match', true),
          drawEdge(coords[1].x, coords[1].y, coords[3].x, coords[3].y, '5/5', 'active', true),
          drawEdge(coords[2].x, coords[2].y, coords[3].x, coords[3].y, '4/4', 'active', true)
        ].join('');
        const nSvg = coords.map((c, i) =>
          drawNode(c.x, c.y, `${c.id} (h=${st.heights[i]})`, st.excess[i], st.excess[i].includes('active') || st.excess[i].includes('relabel') ? 'pivot' : 'match', 23)
        ).join('');
        return {
          stageHtml: svgGraphBox(gridLines + eSvg + nSvg, 660, 225),
          invariant: st.inv,
          metrics: [
            { label: 'Vertex Heights h(u)', value: `[S:${st.heights[0]}, A:${st.heights[1]}, B:${st.heights[2]}, T:${st.heights[3]}]` },
            { label: 'Admissible Rule', value: 'push(u,v) iff h(u) == h(v) + 1' },
            { label: 'Height Invariant', value: 'h(u) ≤ h(v) + 1 ∀residual (u,v)' }
          ],
          log: st.inv
        };
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 10. Min-Cut Project Selection, Hungarian Potentials & MCMF
  // ───────────────────────────────────────────────────────────────
  window.SIMULATORS['sim-hungarian-mcmf'] = createStepSimulator({
    id: 'sim-hungarian-mcmf',
    aliases: ['sim-min-cost-max-flow', 'sim-hungarian-matching', 'sim-project-selection-closure'],
    title: 'Min-Cut Project Selection Closure, Hungarian (u_i + v_j = c_ij) & Min-Cost Max-Flow',
    badge: 'O(V³) Hungarian · O(F·E log V) MCMF',
    badgeClass: 'badge-on2',
    blurb: 'Model Max-Weight Closure (Project Selection) as S-T Min-Cut with ∞ prerequisite arcs, tighten Hungarian dual potentials u_i + v_j = c_ij on the equality subgraph, or route Min-Cost Max-Flow via Johnson reduced costs.',
    slugs: [
      'min-cut-closure-project-selection',
      'konic-dilworth-chain-decompositions',
      'min-cost-max-flow-hungarian',
      'weighted-matching-hungarian',
      'min-cost-max-flow-mcmf',
      'flow-reductions-project-selection'
    ],
    presets: [
      { id: 'closure', label: 'Max-Weight Closure Project Selection (S → +Profit, -Cost → T, ∞ Prereq)', mode: 'closure' },
      { id: 'hungarian', label: 'Hungarian Kuhn-Munkres Dual Potentials u_i + v_j = c_ij Tightening', mode: 'hungarian' },
      { id: 'mcmf', label: 'Min-Cost Max-Flow (MCMF) Successive Shortest Path & Reduced Costs', mode: 'mcmf' }
    ],
    buildFrames(preset) {
      if (preset.mode === 'closure') {
        const svg = `
          ${drawEdge(85, 115, 255, 55, 'cap=12 (+rev)', 'match', true)}
          ${drawEdge(85, 115, 255, 175, 'cap=8 (+rev)', 'warn', true)}
          ${drawEdge(255, 55, 435, 55, 'cap=∞ (prereq)', 'active', true)}
          ${drawEdge(255, 175, 435, 175, 'cap=∞ (prereq)', 'active', true)}
          ${drawEdge(435, 55, 585, 115, 'cap=5 (cost)', 'warn', true)}
          ${drawEdge(435, 175, 585, 115, 'cap=11 (cost)', 'default', true)}
          ${drawNode(85, 115, 'S', 'Source', 'match', 22)}
          ${drawNode(255, 55, 'P1 (+12)', 'IN S (Keep!)', 'match', 23)}
          ${drawNode(255, 175, 'P2 (+8)', 'IN T (Drop)', 'default', 23)}
          ${drawNode(435, 55, 'D1 (-5)', 'IN S (Pay 5)', 'match', 23)}
          ${drawNode(435, 175, 'D2 (-11)', 'IN T (Skip)', 'default', 23)}
          ${drawNode(585, 115, 'T', 'Sink', 'pivot', 22)}
        `;
        return [
          {
            stageHtml: svgGraphBox(svg, 660, 225),
            invariant: 'Max-Weight Closure Theorem: Prerequisite arcs (P1→D1, P2→D2) have capacity ∞ so no finite S-T cut can sever them! Min-Cut = 5 (pay D1) + 8 (drop P2) = 13 ⇒ Max Net Profit = (12+8) - 13 = +7 (select {P1, D1})!',
            metrics: [
              { label: 'Gross Positive Sum W⁺', value: '12 + 8 = 20' },
              { label: 'S-T Min-Cut Capacity', value: '5 (buy D1) + 8 (forgo P2) = 13' },
              { label: 'Optimal Net Profit', value: 'W⁺ - MinCut = 20 - 13 = +7' }
            ],
            log: 'S-T Min-Cut capacity 13 selects closed project set {P1, D1} for optimal profit 12 - 5 = +7.'
          }
        ];
      }

      if (preset.mode === 'hungarian') {
        const html = `
          <table class="complexity-matrix" style="margin:6px 0;font-family:var(--font-mono,monospace);font-size:12px;">
            <thead>
              <tr><th>Cost c_ij (Slack c_ij - u_i - v_j)</th><th>Job 1 (v₁=0)</th><th>Job 2 (v₂=1)</th><th>Job 3 (v₃=2)</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Worker 1 (u₁=4)</strong></td><td style="color:#34d399;font-weight:700;">c=4 (slack=0 ★)</td><td>c=7 (slack=2)</td><td>c=6 (slack=0)</td></tr>
              <tr><td><strong>Worker 2 (u₂=2)</strong></td><td>c=2 (slack=0)</td><td style="color:#34d399;font-weight:700;">c=3 (slack=0 ★)</td><td>c=5 (slack=1)</td></tr>
              <tr><td><strong>Worker 3 (u₃=3)</strong></td><td>c=5 (slack=2)</td><td>c=6 (slack=2)</td><td style="color:#34d399;font-weight:700;">c=5 (slack=0 ★)</td></tr>
            </tbody>
          </table>
        `;
        return [
          {
            stageHtml: html,
            invariant: 'Hungarian Complementary Slackness: ∀(i,j), u_i + v_j ≤ c_ij. After Δ-shift (u_i += Δ for i ∈ S, v_j -= Δ for j ∈ T), tight zero-slack edges form a Perfect Matching of cost ∑u_i + ∑v_j = (4+2+3) + (0+1+2) = 12!',
            metrics: [
              { label: 'Row Potentials u_i', value: '[4, 2, 3] (sum = 9)' },
              { label: 'Col Potentials v_j', value: '[0, 1, 2] (sum = 3)' },
              { label: 'Optimal Assignment Cost', value: '4 + 3 + 5 = 12 == ∑u_i + ∑v_j' }
            ],
            log: 'Tightened equality subgraph via Δ = min slack(S, J\\T); extracted optimal assignment cost 12.'
          }
        ];
      }

      // MCMF
      const svg = `
        ${drawEdge(90, 115, 280, 50, 'f=2/2, c=1', 'match', true)}
        ${drawEdge(90, 115, 280, 180, 'f=1/2, c=3', 'active', true)}
        ${drawEdge(280, 50, 280, 180, 'f=1/2, c=1', 'match', true)}
        ${drawEdge(280, 50, 510, 115, 'f=1/1, c=4', 'match', true)}
        ${drawEdge(280, 180, 510, 115, 'f=2/2, c=1', 'match', true)}
        ${drawNode(90, 115, 'S', 'π=0', 'match', 22)}
        ${drawNode(280, 50, 'A', 'π=1', 'match', 22)}
        ${drawNode(280, 180, 'B', 'π=2', 'match', 22)}
        ${drawNode(510, 115, 'T', 'π=3', 'match', 22)}
      `;
      return [
        {
          stageHtml: svgGraphBox(svg, 620, 225),
          invariant: 'Successive Shortest Paths (MCMF): Updating vertex potentials π(v) += dist(v) keeps every residual edge reduced cost c_π(u,v) = c(u,v) + π(u) - π(v) ≥ 0 (and -c(u,v) on reverse arcs!). No negative-cost cycles in G_f!',
          metrics: [
            { label: 'Total Flow |f|', value: '3 / 3 (Max Flow)' },
            { label: 'Minimum Total Cost', value: '1×(1+4) + 1×(1+1+1) + 1×(3+1) = 12' },
            { label: 'Optimality Criterion', value: 'No negative-cost cycle in G_f' }
          ],
          log: 'Augmented 3 flow units along shortest reduced-cost paths; final min-cost max-flow = (flow 3, cost 12).'
        }
      ];
    }
  });
})();
