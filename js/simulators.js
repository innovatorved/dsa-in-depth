/* ═══════════════════════════════════════════════════════════════
   DSA In Depth — Interactive Visual Simulator Engine & Registry
   ═══════════════════════════════════════════════════════════════ */

window.SIMULATORS = window.SIMULATORS || {};

window.registerSimulator = function (id, specOrFactory, aliases) {
  const obj = typeof specOrFactory === 'function' ? specOrFactory(id) : specOrFactory;
  if (!obj) return null;
  obj.id = id;
  obj.slugs = Array.isArray(obj.slugs) ? obj.slugs : [];
  if (typeof obj.render !== 'function' && typeof obj.createShell === 'function') {
    obj.render = () => obj.createShell();
  }
  window.SIMULATORS[id] = obj;
  if (Array.isArray(aliases)) {
    aliases.forEach(alias => {
      if (alias && !window.SIMULATORS[alias]) {
        Object.defineProperty(window.SIMULATORS, alias, {
          value: obj,
          enumerable: false,
          configurable: true,
          writable: true
        });
      }
    });
  }
  return obj;
};

window.initSimulator = function (id, container) {
  const sim = window.SIMULATORS?.[id];
  if (!sim || !container) return null;
  if (!container.innerHTML.trim() && typeof sim.render === 'function') {
    container.innerHTML = sim.render();
  }
  if (typeof sim.mount === 'function') {
    sim.mount(container);
  }
  return {
    sim,
    unmount() {
      if (typeof sim.unmount === 'function') sim.unmount(container);
    }
  };
};

window.Simulators = (() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[c]));

  function lifecycle() {
    const offs = [];
    const timers = new Set();
    return {
      on(el, ev, fn) {
        if (!el) return;
        el.addEventListener(ev, fn);
        offs.push(() => el.removeEventListener(ev, fn));
      },
      every(ms, fn) {
        const t = setInterval(fn, ms);
        timers.add(t);
        return t;
      },
      stop(t) {
        clearInterval(t);
        timers.delete(t);
      },
      dispose() {
        offs.splice(0).forEach(f => f());
        timers.forEach(t => clearInterval(t));
        timers.clear();
      }
    };
  }

  /**
   * Build a standard step-based DSA simulator from a deterministic trace generator.
   * config: {
   *   id, title, badge, badgeClass, blurb, slugs, aliases,
   *   presets: [{ id, label, ... }],
   *   buildFrames(preset): [{ stageHtml, invariant, metrics: [{label, value}], log }]
   * }
   */
  function createStepSimulator(config) {
    const uid = config.id.replace(/[^a-zA-Z0-9_-]/g, '-');
    const presets = config.presets || [{ id: 'default', label: 'Default' }];
    const badgeClass = config.badgeClass || 'badge-ologn';

    const spec = {
      id: config.id,
      title: config.title,
      slugs: config.slugs || [],
      blurb: config.blurb || '',
      render() {
        const frames = config.buildFrames(presets[0]) || [];
        const f0 = frames[0] || { stageHtml: '', invariant: 'Ready', metrics: [], log: 'Initialized.' };
        return `
          <div class="dsa-sim simulator-card" id="${esc(uid)}" data-sim-id="${esc(config.id)}">
            <div class="dsa-sim__header simulator-card__header">
              <div class="dsa-sim__title simulator-card__title">
                <span>${esc(config.title)}</span>
              </div>
              <span class="${esc(badgeClass)}">${esc(config.badge || 'Interactive')}</span>
            </div>
            <p class="dsa-sim__subtitle simulator-card__description">${esc(config.blurb)}</p>
            <div class="dsa-sim__controls simulator-card__controls">
              <label style="font-size:12px;color:var(--fg-muted);display:inline-flex;align-items:center;gap:6px;">
                Preset
                <select class="simulator-card__input sim-select" data-role="preset" style="padding:4px 8px;font-size:12px;">
                  ${presets.map((p, idx) => `<option value="${idx}">${esc(p.label)}</option>`).join('')}
                </select>
              </label>
              <button type="button" class="btn btn--secondary btn--sm" data-role="prev" title="Step Back">◀ Prev</button>
              <button type="button" class="btn btn--primary btn--sm" data-role="next" title="Step Forward">Step ▶</button>
              <button type="button" class="btn btn--secondary btn--sm" data-role="play" title="Play / Pause">⏵ Play</button>
              <button type="button" class="btn btn--sm" data-role="reset" title="Reset">↺ Reset</button>
              <label style="font-size:12px;color:var(--fg-muted);display:inline-flex;align-items:center;gap:4px;margin-left:auto;">
                Speed
                <select class="simulator-card__input sim-select" data-role="speed" style="padding:3px 6px;font-size:11.5px;">
                  <option value="1100">0.5×</option>
                  <option value="650" selected>1×</option>
                  <option value="320">2×</option>
                  <option value="150">4×</option>
                </select>
              </label>
              <span class="simulator-card__status" data-role="step-status" style="font-family:var(--font-mono,monospace);font-size:12px;">
                Step 1 / ${Math.max(1, frames.length)}
              </span>
            </div>
            <div class="invariant-box" style="margin:0 0 0.75rem 0;padding:0.6rem 0.9rem;">
              <h4 style="margin:0 0 0.25rem 0;font-size:12px;">Invariant &amp; State</h4>
              <div data-role="invariant" style="font-size:12.5px;font-family:var(--font-mono,monospace);color:var(--fg-primary);">${f0.invariant || 'Invariant holds.'}</div>
            </div>
            <div class="dsa-sim__stage" data-role="stage">${f0.stageHtml}</div>
            <div class="dsa-sim__metrics" data-role="metrics">
              ${(f0.metrics || []).map(m => `
                <div class="dsa-sim__metric">
                  <div class="dsa-sim__metric-label">${esc(m.label)}</div>
                  <div class="dsa-sim__metric-value">${esc(m.value)}</div>
                </div>
              `).join('')}
            </div>
            <div class="dsa-sim__log" data-role="log">${esc(f0.log || '')}</div>
          </div>
        `;
      },
      mount(root) {
        const card = root.querySelector(`[data-sim-id="${config.id}"]`) || root.querySelector('.dsa-sim') || root;
        if (!card) return;
        if (card._simLc) card._simLc.dispose();
        const lc = lifecycle();
        card._simLc = lc;

        const elPreset = card.querySelector('[data-role="preset"]');
        const elPrev = card.querySelector('[data-role="prev"]');
        const elNext = card.querySelector('[data-role="next"]');
        const elPlay = card.querySelector('[data-role="play"]');
        const elReset = card.querySelector('[data-role="reset"]');
        const elSpeed = card.querySelector('[data-role="speed"]');
        const elStatus = card.querySelector('[data-role="step-status"]');
        const elInv = card.querySelector('[data-role="invariant"]');
        const elStage = card.querySelector('[data-role="stage"]');
        const elMetrics = card.querySelector('[data-role="metrics"]');
        const elLog = card.querySelector('[data-role="log"]');

        let presetIdx = 0;
        let frames = config.buildFrames(presets[0]) || [];
        let idx = 0;
        let timer = null;
        let historyLogs = [];

        function stopPlay() {
          if (timer) {
            lc.stop(timer);
            timer = null;
          }
          if (elPlay) elPlay.textContent = '⏵ Play';
        }

        function renderFrame() {
          if (!frames.length) return;
          const f = frames[idx] || frames[0];
          if (elStatus) elStatus.textContent = `Step ${idx + 1} / ${frames.length}`;
          if (elInv) elInv.innerHTML = f.invariant || 'Invariant holds.';
          if (elStage) elStage.innerHTML = f.stageHtml || '';
          if (elMetrics && Array.isArray(f.metrics)) {
            elMetrics.innerHTML = f.metrics.map(m => `
              <div class="dsa-sim__metric">
                <div class="dsa-sim__metric-label">${esc(m.label)}</div>
                <div class="dsa-sim__metric-value">${esc(m.value)}</div>
              </div>
            `).join('');
          }
          if (elLog) {
            const logsUpToNow = frames.slice(0, idx + 1).map((fr, i) => `[Step ${i + 1}] ${fr.log || ''}`);
            elLog.innerHTML = logsUpToNow.map(l => `<div>${esc(l)}</div>`).join('');
            elLog.scrollTop = elLog.scrollHeight;
          }
          if (elPrev) elPrev.disabled = idx <= 0;
          if (elNext) elNext.disabled = idx >= frames.length - 1;
        }

        function loadPreset(pIdx) {
          stopPlay();
          presetIdx = pIdx;
          frames = config.buildFrames(presets[presetIdx] || presets[0]) || [];
          idx = 0;
          historyLogs = [];
          renderFrame();
        }

        lc.on(elPreset, 'change', () => {
          loadPreset(parseInt(elPreset.value, 10) || 0);
          window.Analytics?.trackSimulatorInteraction?.(config.id, 'preset', { preset: presets[presetIdx]?.label });
        });

        lc.on(elPrev, 'click', () => {
          stopPlay();
          if (idx > 0) {
            idx--;
            renderFrame();
          }
        });

        lc.on(elNext, 'click', () => {
          stopPlay();
          if (idx < frames.length - 1) {
            idx++;
            renderFrame();
          }
          window.Analytics?.trackSimulatorInteraction?.(config.id, 'step', { step: idx + 1 });
        });

        lc.on(elReset, 'click', () => {
          stopPlay();
          idx = 0;
          renderFrame();
        });

        lc.on(elPlay, 'click', () => {
          if (timer) {
            stopPlay();
            return;
          }
          if (idx >= frames.length - 1) idx = 0;
          if (elPlay) elPlay.textContent = '⏸ Pause';
          const delay = parseInt(elSpeed?.value, 10) || 650;
          timer = lc.every(delay, () => {
            if (idx < frames.length - 1) {
              idx++;
              renderFrame();
            } else {
              stopPlay();
            }
          });
          window.Analytics?.trackSimulatorInteraction?.(config.id, 'play', {});
        });

        lc.on(elSpeed, 'change', () => {
          if (timer) {
            stopPlay();
            elPlay.click();
          }
        });

        renderFrame();
      },
      unmount(root) {
        const card = root?.querySelector?.(`[data-sim-id="${config.id}"]`) || root?.querySelector?.('.dsa-sim') || root;
        if (card && card._simLc) {
          card._simLc.dispose();
          card._simLc = null;
        }
      }
    };

    return window.registerSimulator(config.id, spec, config.aliases);
  }

  function renderArrayCells(arr, opts = {}) {
    const active = new Set(opts.active || []);
    const match = new Set(opts.match || []);
    const warn = new Set(opts.warn || []);
    const pivot = new Set(opts.pivot || []);
    const tags = opts.tags || {};
    return `<div class="dsa-sim__array">${arr.map((v, i) => {
      const cls = [
        'dsa-sim__cell',
        active.has(i) ? 'is-active' : '',
        match.has(i) ? 'is-match' : '',
        warn.has(i) ? 'is-warn' : '',
        pivot.has(i) ? 'is-pivot' : ''
      ].filter(Boolean).join(' ');
      const tag = tags[i] ? `<span class="dsa-sim__cell-tag">${esc(tags[i])}</span>` : '';
      return `<div class="${cls}"><span class="dsa-sim__cell-idx">[${i}]</span><span class="dsa-sim__cell-val">${esc(v)}</span>${tag}</div>`;
    }).join('')}</div>`;
  }

  function getSimulatorForUnit(slug) {
    for (const sim of Object.values(window.SIMULATORS)) {
      if (Array.isArray(sim.slugs) && sim.slugs.includes(slug)) {
        return { html: sim.render(), sim };
      }
    }
    return null;
  }

  return {
    esc,
    lifecycle,
    createStepSimulator,
    renderArrayCells,
    getSimulatorForUnit,
    register: window.registerSimulator,
    init: window.initSimulator
  };
})();
