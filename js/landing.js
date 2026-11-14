/* ═══════════════════════════════════════════════════════════════
   Landing page (home route): split hero with live algorithm trace
   workbench above the fold, flagship systems case studies, 69 step
   simulators, 6-track curriculum map, and 22 C++20/TS builds.
   render() returns static-safe HTML; mount(root) hydrates interactivity.
   ═══════════════════════════════════════════════════════════════ */

window.Landing = (() => {
  const ALGO_PRESETS = [
    {
      label: 'Lower Bound Search',
      lesson: 'binary-search-boundary-invariants',
      invariant: '∀ i < lo: A[i] < 29  ∧  ∀ j ≥ hi: A[j] ≥ 29',
      code: [
        'size_t lower_bound_idx(std::span<const int> a, int target) {',
        '  size_t lo = 0, hi = a.size(); // half-open [lo, hi)',
        '  while (lo < hi) {',
        '    size_t mid = lo + ((hi - lo) >> 1);',
        '    if (a[mid] < target) lo = mid + 1;',
        '    else hi = mid;',
        '  }',
        '  return lo;',
        '}'
      ].join('\n'),
      columns: ['iter', '[lo, hi)', 'mid', 'A[mid] vs 29', 'action'],
      steps: [
        ['0', '[0, 8)', '4', '31 ≥ 29', 'hi ← 4'],
        ['1', '[0, 4)', '2', '19 < 29', 'lo ← 3'],
        ['2', '[3, 4)', '3', '29 ≥ 29', 'hi ← 3'],
        ['done', '[3, 3)', '—', 'lo == hi == 3', 'return index 3']
      ],
      plan: ['O(log₂ N) comparisons', 'O(1) auxiliary space', 'Branchless cmov friendly']
    },
    {
      label: 'Robin Hood Hash',
      lesson: 'robin-hood-cuckoo-hashing',
      invariant: 'Probe sequence length (PSL) variance minimized via rich-poor swap',
      code: [
        'while (slot[idx].occupied) {',
        '  if (slot[idx].psl < incoming.psl) {',
        '    std::swap(slot[idx], incoming); // steal closer slot',
        '  }',
        '  idx = (idx + 1) & mask;',
        '  ++incoming.psl;',
        '}',
        'slot[idx] = incoming;'
      ].join('\n'),
      columns: ['slot', 'resident_key', 'res_psl', 'incoming (k=42)', 'decision'],
      steps: [
        ['h=2', 'k=18', 'PSL 2', 'PSL 0', '0 < 2 → continue'],
        ['h=3', 'k=27', 'PSL 2', 'PSL 1', '1 < 2 → continue'],
        ['h=4', 'k=52', 'PSL 0', 'PSL 2', '2 > 0 → SWAP k=42 ↔ k=52'],
        ['h=5', 'empty', '—', 'k=52 (PSL 1)', 'insert displaced key']
      ],
      plan: ['O(1) expected lookup', '64B cache-line contiguous', 'Backward-shift delete']
    },
    {
      label: 'Dijkstra Frontier',
      lesson: 'dijkstra-relaxation-invariants',
      invariant: 'Popped vertex u with min d[u] has final shortest path when w(e) ≥ 0',
      code: [
        'while (!pq.empty()) {',
        '  auto [du, u] = pq.top(); pq.pop();',
        '  if (du != dist[u]) continue; // lazy stale skip',
        '  for (auto [v, w] : adj[u]) {',
        '    if (du + w < dist[v]) {',
        '      dist[v] = du + w;',
        '      pq.emplace(dist[v], v);',
        '    }',
        '  }',
        '}'
      ].join('\n'),
      columns: ['pop (u, d)', 'edge u→v (w)', 'old dist[v]', 'new dist[v]', 'heap state'],
      steps: [
        ['(S, 0)', 'S→A (4), S→B (2)', '∞, ∞', 'A:4, B:2', '[(B,2), (A,4)]'],
        ['(B, 2)', 'B→A (1), B→C (5)', '4, ∞', 'A:3, C:7', '[(A,3), (A,4*), (C,7)]'],
        ['(A, 3)', 'A→C (2)', '7', 'C:5', '[(A,4*), (C,5), (C,7*)]'],
        ['(C, 5)', 'sink settled', '5', '5 (optimal)', 'stale entries skipped']
      ],
      plan: ['O((V + E) log V) binary heap', 'Non-negative edge invariant', 'CSR adjacency locality']
    }
  ];

  const FLAGSHIP_CASES = [
    {
      slug: 'case-v8-elements-kinds',
      title: 'V8 Array Elements Kinds',
      badge: 'Module 1.1',
      summary: 'How V8 transitions PACKED_SMI_ELEMENTS to dictionary mode and why holey arrays stall CPU prefetchers.'
    },
    {
      slug: 'case-rust-hashbrown-swisstable',
      title: 'Rust hashbrown & SwissTable',
      badge: 'Module 2.1',
      summary: '1-byte H2 control metadata and SSE2/NEON 16-way parallel group probing in modern flat hash maps.'
    },
    {
      slug: 'case-linux-rbtree-cfs',
      title: 'Linux Kernel rbtree & CFS',
      badge: 'Module 3.2',
      summary: 'Intrusive pointer embedding, augmented leftmost caching, and O(log N) virtual runtime scheduling.'
    },
    {
      slug: 'case-ripgrep-teddy-simd',
      title: 'ripgrep & SIMD Teddy Search',
      badge: 'Module 4.1',
      summary: 'Combining AVX2 nibble-mask filtering with Aho-Corasick automata for multi-gigabyte/sec grep.'
    },
    {
      slug: 'case-osrm-contraction-hierarchies',
      title: 'OSRM Contraction Hierarchies',
      badge: 'Module 5.2',
      summary: 'Precomputing shortcut edges to answer continental road-network shortest paths in sub-millisecond time.'
    }
  ];

  const DEMOS = [
    { sim: 'sim-memory-cache-stride', label: 'Cache lines', lesson: 'ram-model-vs-modern-cpu' },
    { sim: 'sim-robin-hood-swisstable', label: 'SwissTable SIMD', lesson: 'case-rust-hashbrown-swisstable' },
    { sim: 'sim-avl-red-black-tree', label: 'Red-Black Tree', lesson: 'red-black-llrb-isomorphism' },
    { sim: 'sim-dijkstra-astar-grid', label: 'Dijkstra & A*', lesson: 'astar-heuristic-admissibility' },
    { sim: 'sim-dinic-max-flow', label: 'Dinic Max-Flow', lesson: 'dinic-level-graph-blocking-flow' }
  ];

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
  const shortTitle = t => String(t || '').replace(/\s*\(.*\)\s*$/, '');

  function allUnits() {
    const out = [];
    for (const part of window.CURRICULUM_DATA?.parts || []) {
      for (const mod of part.modules) {
        for (const u of mod.units) out.push(u);
      }
    }
    return out;
  }

  function findUnit(slug) {
    for (const u of allUnits()) if (u.slug === slug) return u;
    return null;
  }

  function counts() {
    const c = window.SITE_COUNTS || {};
    return {
      topics: allUnits().length || 180,
      simulators: c.simulators || Object.keys(window.SIMULATORS || {}).length || 69,
      builds: Object.keys(window.IMPLEMENTATIONS_DATA || {}).length || 22,
      videos: c.videos || 180,
      questions: c.questions || 720
    };
  }

  function renderTraceOutput(preset, uptoStep) {
    const visibleSteps = preset.steps.slice(0, Math.max(1, Math.min(preset.steps.length, uptoStep)));
    const head = preset.columns.map(col => `<th scope="col">${esc(col)}</th>`).join('');
    const body = visibleSteps.map((row, idx) => {
      const isLatest = idx === visibleSteps.length - 1;
      return `<tr${isLatest ? ' style="background:var(--info-bg);"' : ''}>${row.map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`;
    }).join('');
    const planHtml = `
      <div class="landing-pg__plan" aria-label="Invariant and complexity summary">
        <span class="landing-pg__plan-tag">INVARIANT</span>
        <span class="landing-pg__plan-steps"><code>${esc(preset.invariant)}</code></span>
      </div>
      <div class="landing-pg__plan" aria-label="Hardware and asymptotic bounds">
        <span class="landing-pg__plan-tag">BOUNDS</span>
        <span class="landing-pg__plan-steps">${preset.plan.map(p => `<code>${esc(p)}</code>`).join('<span aria-hidden="true">·</span>')}</span>
      </div>`;
    return `
      <div class="landing-pg__table-wrap">
        <table class="landing-pg__table">
          <thead><tr>${head}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
      ${planHtml}`;
  }

  function renderHero(c) {
    const first = allUnits()[0];
    const preset0 = ALGO_PRESETS[0];

    return `
      <section class="landing-hero">
        <div class="landing-hero__grid">
          <div class="landing-hero__copy">
            <h1 class="landing-hero__title">Data structures &amp; algorithms, from CPU cache lines to graph flows.</h1>
            <p class="landing-hero__subtitle">An open-source, hardware-grounded guide to algorithms. Trace loop invariants, 64-byte cache locality, balanced trees, and network flows — and run C++20 and TypeScript implementations directly in your browser.</p>

            <div class="landing-resume" id="landing-resume" hidden>
              <a class="landing-resume__link" id="landing-resume-link" href="/topic/${esc(first?.slug || 'ram-model-vs-modern-cpu')}/">
                <span class="landing-resume__label">Continue where you left off</span>
                <strong class="landing-resume__unit" id="landing-resume-title">${esc(first?.title || 'The RAM Model vs Modern CPU Cache Hierarchy')}</strong>
                <span class="landing-resume__meta" id="landing-resume-meta">Resume →</span>
              </a>
            </div>

            <div class="landing-hero__actions">
              <a class="btn btn--primary landing-btn" id="landing-primary-cta" href="/topic/${esc(first?.slug || 'ram-model-vs-modern-cpu')}/">Start learning →</a>
              <button class="btn btn--outline landing-btn" type="button" data-landing-scroll="landing-demos">Explore Simulators</button>
              <button class="landing-search" type="button" data-landing-search>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Search ${c.topics} topics <kbd>⌘K</kbd>
              </button>
            </div>

            <p class="landing-hero__scope">6 engineering tracks · ${c.topics} interactive lessons · ${c.simulators} step simulators · ${c.builds} from-scratch C++20/TS builds · Free &amp; open source</p>
          </div>

          <div class="landing-pg" id="landing-playground" aria-label="Live algorithm trace workbench">
            <div class="landing-pg__header">
              <span class="landing-pg__engine"><span class="landing-pg__dot" aria-hidden="true"></span>C++20 Invariant Trace</span>
              <div class="landing-pg__presets" role="tablist" aria-label="Sample algorithm traces">
                ${ALGO_PRESETS.map((p, i) => `<button type="button" class="landing-pg__preset${i === 0 ? ' is-active' : ''}" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}" data-algo-preset="${i}">${esc(p.label)}</button>`).join('')}
              </div>
            </div>

            <div class="landing-pg__editor-wrap">
              <label class="sr-only" for="landing-algo-code">Reference C++20 implementation</label>
              <textarea id="landing-algo-code" class="landing-pg__editor" rows="8" readonly spellcheck="false">${esc(preset0.code)}</textarea>
            </div>

            <div class="landing-pg__toolbar">
              <button type="button" class="btn btn--primary btn--sm landing-pg__run" id="landing-algo-step">Step Trace →</button>
              <span class="landing-pg__status" id="landing-algo-meta" role="status" aria-live="polite">Step ${preset0.steps.length} of ${preset0.steps.length} · Verified</span>
              <div class="landing-pg__links">
                <button type="button" class="landing-pg__link-btn" id="landing-algo-reset">Reset</button>
                <a class="landing-pg__open" id="landing-algo-open" href="/topic/${esc(preset0.lesson)}/">Open Lesson ↗</a>
              </div>
            </div>

            <div class="landing-pg__output" id="landing-algo-output">
              ${renderTraceOutput(preset0, preset0.steps.length)}
            </div>
          </div>
        </div>
      </section>`;
  }

  function renderFlagshipCases() {
    return `
      <section class="landing-section ds-below-fold" id="landing-cases">
        <div class="landing-section__head">
          <h2 class="landing-section__title">Production systems case studies</h2>
          <p class="landing-section__desc">See how theoretical data structures are engineered inside real compilers, kernels, search tools, and routing engines.</p>
        </div>
        <div class="landing-videos">
          ${FLAGSHIP_CASES.map(v => `
            <a class="landing-video-card" href="/topic/${esc(v.slug)}/">
              <div class="landing-video-card__top">
                <span class="landing-video-card__mod">${esc(v.badge)}</span>
                <span class="landing-video-card__dur">Case Study</span>
              </div>
              <h3 class="landing-video-card__title">${esc(v.title)}</h3>
              <p class="landing-video-card__desc">${esc(v.summary)}</p>
            </a>`).join('')}
        </div>
      </section>`;
  }

  function renderDemos() {
    const demos = DEMOS.filter(d => window.SIMULATORS?.[d.sim]);
    if (!demos.length) return '';
    return `
      <section class="landing-section ds-below-fold" id="landing-demos">
        <div class="landing-section__head">
          <h2 class="landing-section__title">Step through data structures live</h2>
          <p class="landing-section__desc">Every module pairs formal proofs with interactive visualizers for cache lines, SIMD hash tables, balanced trees, and network flows.</p>
        </div>
        <div class="landing-tabs" role="tablist" aria-label="Interactive algorithm simulators">
          ${demos.map((d, i) => `<button type="button" class="landing-tab${i ? '' : ' is-active'}" role="tab" aria-selected="${i ? 'false' : 'true'}" data-demo="${i}">${esc(d.label)}</button>`).join('')}
        </div>
        <div class="landing-demo" id="landing-demo-stage">${typeof window.SIMULATORS?.[demos[0].sim]?.render === 'function' ? window.SIMULATORS[demos[0].sim].render() : ''}</div>
        <a class="landing-link" id="landing-demo-lesson" href="/topic/${esc(demos[0].lesson)}/">Open full lesson &amp; C++20 lab →</a>
      </section>`;
  }

  function renderCurriculum() {
    const data = window.CURRICULUM_DATA;
    if (!data) return '';
    let html = `
      <section class="landing-section ds-below-fold" id="landing-curriculum">
        <div class="landing-section__head">
          <h2 class="landing-section__title">6-track engineering curriculum</h2>
          <p class="landing-section__desc">Structured from 64-byte cache lines and contiguous arrays through balanced trees, string automata, graph flows, and algebraic DP.</p>
        </div>`;
    for (const part of data.parts) {
      html += `<h3 class="landing-part">${esc(part.title)}</h3><div class="landing-modules">`;
      for (const mod of part.modules) {
        const prog = window.Progress?.getModuleProgress ? window.Progress.getModuleProgress(mod.id) : { completed: 0, total: mod.units.length };
        const pct = prog.total ? Math.round((prog.completed / prog.total) * 100) : 0;
        const firstUnitSlug = mod.units[0]?.slug || '';
        html += `
          <a class="landing-module" href="/topic/${esc(firstUnitSlug)}/" data-module="${esc(mod.id)}" data-units="${mod.units.map(u => esc(u.slug)).join(' ')}">
            <span class="landing-module__num">${esc(mod.number)}</span>
            <span class="landing-module__title">${esc(mod.title)}</span>
            <span class="landing-module__meta" data-module-meta="${esc(mod.id)}">${mod.units.length} topics</span>
            <span class="landing-module__bar"><span data-module-bar="${esc(mod.id)}" style="width:${pct}%"></span></span>
          </a>`;
      }
      html += '</div>';
    }
    return html + '</section>';
  }

  function renderBuilds(c) {
    const builds = Object.entries(window.IMPLEMENTATIONS_DATA || {});
    if (!builds.length) return '';
    return `
      <section class="landing-section ds-below-fold" id="landing-builds">
        <div class="landing-section__head">
          <h2 class="landing-section__title">${c.builds} from-scratch algorithm builds</h2>
          <p class="landing-section__desc">Implement Robin Hood hash maps, LLRB trees, lazy segment trees, Aho-Corasick scanners, and Dinic flow solvers step by step.</p>
        </div>
        <div class="landing-builds">
          ${builds.map(([id, b]) => `<a class="landing-build" href="/build/${esc(id)}/" data-action="navigate-build" data-build-id="${esc(id)}">${esc(shortTitle(b.title) || id)}<span aria-hidden="true">→</span></a>`).join('')}
        </div>
      </section>`;
  }

  function renderClosing() {
    const first = allUnits()[0];
    return `
      <section class="landing-closing ds-below-fold">
        <h2 class="landing-closing__title">Ready to trace how algorithms actually run on hardware?</h2>
        <p class="landing-closing__desc">Start at Module 1.1 with zero setup, or explore the prerequisite dependency roadmap.</p>
        <div class="landing-closing__actions">
          <a class="btn btn--primary landing-btn" href="/topic/${esc(first?.slug || 'ram-model-vs-modern-cpu')}/">Start Module 1.1 →</a>
          <a class="btn btn--outline landing-btn" href="/roadmap/" data-nav="roadmap">View Topic Roadmap</a>
        </div>
      </section>`;
  }

  function render() {
    if (!window.CURRICULUM_DATA) return '<p>Loading curriculum data...</p>';
    const c = counts();
    return `<div class="landing">${renderHero(c)}${renderFlagshipCases()}${renderDemos()}${renderCurriculum()}${renderBuilds(c)}${renderClosing()}</div>`;
  }

  function hydrateProgress(root) {
    const last = window.Progress?.getLastVisited?.();
    const lastUnit = last && findUnit(last);
    const resumeWrap = root.querySelector('#landing-resume');
    const resumeLink = root.querySelector('#landing-resume-link');
    const resumeTitle = root.querySelector('#landing-resume-title');
    const resumeMeta = root.querySelector('#landing-resume-meta');
    const primaryCta = root.querySelector('#landing-primary-cta');

    if (lastUnit && resumeWrap && resumeLink && resumeTitle) {
      const href = `/topic/${last}/`;
      resumeLink.setAttribute('href', href);
      resumeTitle.textContent = lastUnit.title;
      const pct = window.Progress?.getPercentage ? window.Progress.getPercentage() : 0;
      if (resumeMeta) resumeMeta.textContent = `${pct}% complete · Resume →`;
      resumeWrap.hidden = false;
      if (primaryCta) {
        primaryCta.textContent = 'Continue learning →';
        primaryCta.setAttribute('href', href);
      }
    }

    const data = window.CURRICULUM_DATA;
    if (data && window.Progress?.getModuleProgress) {
      for (const part of data.parts) {
        for (const mod of part.modules) {
          const prog = window.Progress.getModuleProgress(mod.id);
          const pct = prog.total ? Math.round((prog.completed / prog.total) * 100) : 0;
          const bar = root.querySelector(`[data-module-bar="${mod.id}"]`);
          const meta = root.querySelector(`[data-module-meta="${mod.id}"]`);
          if (bar) bar.style.width = `${pct}%`;
          if (meta && prog.completed > 0) meta.textContent = `${prog.completed}/${prog.total} completed`;
        }
      }
    }
  }

  function mount(root) {
    const offs = [];
    const on = (el, ev, fn) => {
      if (!el) return;
      el.addEventListener(ev, fn);
      offs.push(() => el.removeEventListener(ev, fn));
    };

    hydrateProgress(root);

    // 1. Hero Algorithm Trace Workbench
    let activePresetIdx = 0;
    let activeStepCount = ALGO_PRESETS[0].steps.length;
    const codeEl = root.querySelector('#landing-algo-code');
    const outEl = root.querySelector('#landing-algo-output');
    const metaEl = root.querySelector('#landing-algo-meta');
    const openEl = root.querySelector('#landing-algo-open');
    const stepBtn = root.querySelector('#landing-algo-step');
    const resetBtn = root.querySelector('#landing-algo-reset');
    const presetsWrap = root.querySelector('.landing-pg__presets');

    const syncWorkbench = () => {
      const p = ALGO_PRESETS[activePresetIdx];
      if (!p) return;
      if (codeEl) codeEl.value = p.code;
      if (outEl) outEl.innerHTML = renderTraceOutput(p, activeStepCount);
      if (metaEl) metaEl.textContent = `Step ${activeStepCount} of ${p.steps.length}${activeStepCount === p.steps.length ? ' · Verified' : ''}`;
      if (openEl) openEl.setAttribute('href', `/topic/${p.lesson}/`);
      root.querySelectorAll('[data-algo-preset]').forEach((btn, idx) => {
        const active = idx === activePresetIdx;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });
    };

    on(presetsWrap, 'click', e => {
      const btn = e.target.closest('[data-algo-preset]');
      if (!btn) return;
      const idx = Number(btn.dataset.algoPreset);
      if (!ALGO_PRESETS[idx]) return;
      activePresetIdx = idx;
      activeStepCount = 1;
      syncWorkbench();
    });

    on(stepBtn, 'click', () => {
      const p = ALGO_PRESETS[activePresetIdx];
      if (!p) return;
      activeStepCount = activeStepCount >= p.steps.length ? 1 : activeStepCount + 1;
      syncWorkbench();
    });

    on(resetBtn, 'click', () => {
      activeStepCount = 1;
      syncWorkbench();
    });

    // 2. Below-the-fold course simulators
    const demos = DEMOS.filter(d => window.SIMULATORS?.[d.sim]);
    const stage = root.querySelector('#landing-demo-stage');
    let activeSim = null;

    const showDemo = i => {
      if (!stage || !demos[i]) return;
      if (activeSim) {
        try { activeSim.unmount(stage); } catch (_) {}
        activeSim = null;
      }
      const sim = window.SIMULATORS[demos[i].sim];
      if (!sim) return;
      stage.innerHTML = sim.render();
      sim.mount(stage);
      activeSim = sim;
      root.querySelectorAll('.landing-tab').forEach((t, j) => {
        t.classList.toggle('is-active', j === i);
        t.setAttribute('aria-selected', String(j === i));
      });
      root.querySelector('#landing-demo-lesson')?.setAttribute('href', '/topic/' + demos[i].lesson + '/');
    };

    on(root.querySelector('.landing-tabs'), 'click', e => {
      const tab = e.target.closest('.landing-tab');
      if (tab) showDemo(Number(tab.dataset.demo));
    });

    on(root.querySelector('#landing-curriculum'), 'click', e => {
      const card = e.target.closest('[data-module]');
      if (!card) return;
      e.preventDefault();
      window.App?.navigateToModule?.(card.dataset.module);
    });

    root.querySelectorAll('[data-landing-scroll]').forEach(b => on(b, 'click', () => {
      document.getElementById(b.dataset.landingScroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    root.querySelectorAll('[data-landing-search]').forEach(b => on(b, 'click', () => window.Search?.open?.()));

    showDemo(0);

    return () => {
      if (activeSim) {
        try { activeSim.unmount(stage); } catch (_) {}
        activeSim = null;
      }
      offs.splice(0).forEach(f => f());
    };
  }

  return { render, mount };
})();
