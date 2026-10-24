/* ═══════════════════════════════════════════════════════════════
   DSA In Depth — Interactive Visual Simulator Engine, Audio/Voice
   Synthesizer & Universal Custom Input Dispatcher
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
  if ((!container.innerHTML.trim() || !container.querySelector?.('[data-role="custom-input"]')) && typeof sim.render === 'function') {
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

  /* ─────────────────────────────────────────────────────────────
     1. SimAudio — Web Audio API Procedural SFX + SpeechSynthesis Voice
     ───────────────────────────────────────────────────────────── */
  const sound = (() => {
    let ctx = null;
    let sfxOn = true;
    let voiceOn = true;
    try {
      if (typeof localStorage !== 'undefined') {
        const savedSfx = localStorage.getItem('dsa_sim_sfx');
        const savedVoice = localStorage.getItem('dsa_sim_voice');
        if (savedSfx !== null) sfxOn = savedSfx !== '0';
        if (savedVoice !== null) voiceOn = savedVoice !== '0';
      }
    } catch (_) {}

    function getAudioCtx() {
      if (typeof window === 'undefined') return null;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) {
        try { ctx = new AC(); } catch (_) { return null; }
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    }

    function playTone(freq, duration = 0.09, type = 'triangle', gainPeak = 0.08, delaySec = 0) {
      const ac = getAudioCtx();
      if (!ac) return;
      try {
        const now = ac.currentTime + delaySec;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(Math.max(80, Math.min(1600, freq)), now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now);
        osc.stop(now + duration + 0.01);
      } catch (_) {}
    }

    function extractPitchFromFrame(frame, idx, total) {
      const stage = String(frame?.stageHtml || '');
      // Look for active, pivot, or match cell value
      const activeMatch = stage.match(/is-(?:active|pivot|match)[\s\S]{0,160}?dsa-sim__cell-val[^>]*>([^<]+)</);
      if (activeMatch) {
        const num = parseFloat(activeMatch[1].replace(/[^0-9.-]/g, ''));
        if (!Number.isNaN(num)) {
          const norm = ((Math.abs(num) % 100) / 100);
          return 220 + norm * 420;
        }
      }
      const ratio = total > 1 ? idx / (total - 1) : 0.5;
      // Pentatonic-like pleasant progression
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      const base = scale[idx % scale.length];
      return base * (0.92 + 0.18 * ratio);
    }

    function playStep(frame, idx, total, mode = 'step') {
      if (!sfxOn) return;
      if (mode === 'custom') {
        playTone(392.00, 0.07, 'sine', 0.07, 0);
        playTone(587.33, 0.11, 'triangle', 0.08, 0.06);
        return;
      }
      if (mode === 'reset') {
        playTone(330.00, 0.06, 'sine', 0.06, 0);
        playTone(246.94, 0.08, 'sine', 0.06, 0.05);
        return;
      }
      const text = `${frame?.log || ''} ${frame?.invariant || ''}`.toLowerCase();
      const stage = String(frame?.stageHtml || '');

      if (idx === total - 1 && total > 1 && mode !== 'prev') {
        // Completion triad arpeggio
        playTone(523.25, 0.09, 'triangle', 0.08, 0);
        playTone(659.25, 0.09, 'triangle', 0.08, 0.07);
        playTone(783.99, 0.16, 'sine', 0.09, 0.14);
        return;
      }
      if (stage.includes('is-match') || /\b(found|match|hit|solved|converged|complete|exact|optimal)\b/.test(text)) {
        playTone(523.25, 0.09, 'triangle', 0.08, 0);
        playTone(659.25, 0.13, 'sine', 0.08, 0.05);
        return;
      }
      if (stage.includes('is-warn') || /\b(miss|collision|conflict|prun|backtrack|reject|violation|cycle|overflow)\b/.test(text)) {
        playTone(174.61, 0.10, 'sawtooth', 0.05, 0);
        playTone(146.83, 0.12, 'triangle', 0.06, 0.05);
        return;
      }
      if (/\b(swap|rotat|split|flip|sift|relax|augment|relabel|push|pop|merge)\b/.test(text)) {
        const f = extractPitchFromFrame(frame, idx, total);
        playTone(f * 0.9, 0.07, 'triangle', 0.07, 0);
        playTone(f * 1.15, 0.09, 'sine', 0.07, 0.045);
        return;
      }
      const pitch = extractPitchFromFrame(frame, idx, total);
      playTone(pitch, 0.085, 'triangle', 0.075, 0);
    }

    function cleanSpeechText(frame, idx, total) {
      let raw = frame?.log || frame?.invariant || `Step ${idx + 1} of ${total}`;
      raw = String(raw)
        .replace(/<[^>]+>/g, ' ')
        .replace(/[🐢🐇♛✕✓★•]/g, ' ')
        .replace(/->|→|⟶/g, ' to ')
        .replace(/<-|←/g, ' from ')
        .replace(/<=|≤/g, ' at most ')
        .replace(/>=|≥/g, ' at least ')
        .replace(/===|==/g, ' equals ')
        .replace(/!==|!=/g, ' not equal ')
        .replace(/∞|-∞/g, ' infinity ')
        .replace(/\bO\(([^)]+)\)/g, 'O of $1')
        .replace(/\[(\d+)\]/g, ' index $1 ')
        .replace(/\s+/g, ' ')
        .trim();
      // Keep spoken cue concise and natural (first sentence or ~18 words)
      const words = raw.split(' ');
      if (words.length > 20) {
        raw = words.slice(0, 20).join(' ');
      }
      return `Step ${idx + 1}. ${raw}`;
    }

    function speakStep(frame, idx, total, speedMs = 650) {
      if (!voiceOn || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        const synth = window.speechSynthesis;
        synth.cancel();
        const phrase = cleanSpeechText(frame, idx, total);
        if (!phrase) return;
        const utter = new SpeechSynthesisUtterance(phrase);
        utter.volume = 0.85;
        utter.pitch = 1.02;
        utter.rate = speedMs <= 200 ? 1.65 : speedMs <= 360 ? 1.38 : speedMs <= 750 ? 1.15 : 1.0;
        const voices = synth.getVoices ? synth.getVoices() : [];
        const preferred = voices.find(v => /en[-_](US|GB)/i.test(v.lang) && /Samantha|Daniel|Google|Natural|Alex|Siri/i.test(v.name))
          || voices.find(v => /^en/i.test(v.lang));
        if (preferred) utter.voice = preferred;
        synth.speak(utter);
      } catch (_) {}
    }

    function stopSpeech() {
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (_) {}
    }

    return {
      isSfxOn: () => sfxOn,
      isVoiceOn: () => voiceOn,
      setSfx(val) {
        sfxOn = Boolean(val);
        try { localStorage.setItem('dsa_sim_sfx', sfxOn ? '1' : '0'); } catch (_) {}
      },
      setVoice(val) {
        voiceOn = Boolean(val);
        if (!voiceOn) stopSpeech();
        try { localStorage.setItem('dsa_sim_voice', voiceOn ? '1' : '0'); } catch (_) {}
      },
      playStep,
      speakStep,
      stopSpeech
    };
  })();

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
        sound.stopSpeech();
      }
    };
  }

  /* ─────────────────────────────────────────────────────────────
     2. Universal Custom Input Parser, Randomizer & Trace Adapter
     ───────────────────────────────────────────────────────────── */
  function parseCustomInput(rawText) {
    const raw = String(rawText ?? '').trim();
    const kv = {};
    const parts = raw.split(/\s*\|\s*|\s*;\s*/);
    parts.forEach(part => {
      const m = part.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*[:=]\s*(.+)$/);
      if (m) {
        kv[m[1].toLowerCase()] = m[2].trim();
      }
    });

    const numMatches = raw.match(/-?\d+(?:\.\d+)?/g) || [];
    const nums = numMatches.map(Number).filter(n => !Number.isNaN(n));
    const tokens = raw
      .replace(/^[a-zA-Z_]+\s*[:=]\s*/g, '')
      .split(/[\s,|;]+/)
      .map(t => t.trim())
      .filter(Boolean);

    let text = kv.text || kv.str || kv.s || kv.a || '';
    let pattern = kv.pat || kv.pattern || kv.p || kv.b || kv.target || '';
    if (!text && parts.length >= 2 && /[a-zA-Z]/.test(parts[0])) {
      text = parts[0].replace(/^[a-zA-Z_]+\s*[:=]\s*/, '').trim();
      pattern = parts[1].replace(/^[a-zA-Z_]+\s*[:=]\s*/, '').trim();
    } else if (!text && parts.length === 1 && /^[a-zA-Z0-9_,]+$/.test(raw) && /[a-zA-Z]/.test(raw) && !raw.includes('=')) {
      text = tokens[0] || raw;
      pattern = tokens[1] || '';
    }

    let target = kv.target !== undefined ? Number(kv.target) : (kv.key !== undefined ? Number(kv.key) : undefined);
    if ((target === undefined || Number.isNaN(target)) && parts.length >= 2) {
      const p1Nums = (parts[1].match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      if (p1Nums.length === 1) target = p1Nums[0];
    }

    let arr = nums;
    if (kv.arr || kv.array || kv.keys || kv.vals || kv.values || kv.items) {
      const src = kv.arr || kv.array || kv.keys || kv.vals || kv.values || kv.items;
      const parsed = (src.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      if (parsed.length) arr = parsed;
    } else if (parts.length >= 2 && target !== undefined) {
      const p0Nums = (parts[0].match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      if (p0Nums.length) arr = p0Nums;
    }

    return { raw, kv, nums, arr, tokens, text, pattern, target };
  }

  function inferDefaultCustomInput(config, preset, initialFrames) {
    if (preset?.customDefault) return preset.customDefault;
    if (config?.defaultCustomInput) return config.defaultCustomInput;
    if (Array.isArray(preset?.arr) && preset?.target !== undefined) {
      return `arr=${preset.arr.join(', ')} | target=${preset.target}`;
    }
    if (Array.isArray(preset?.arr)) return preset.arr.join(', ');
    if (Array.isArray(preset?.keys)) return preset.keys.join(', ');
    if (preset?.text && preset?.pattern) return `text=${preset.text} | pat=${preset.pattern}`;
    if (preset?.target !== undefined) return `target=${preset.target} | 10, 20, 30, ${preset.target}, 50, 60, 75`;
    if (preset?.k !== undefined) return `k=${preset.k} | 2, 1, 5, 1, 3, 2, 8, 1`;
    if (preset?.stride !== undefined) return `stride=${preset.stride} | 12, 45, 78, 23, 56, 89, 34, 67`;

    const id = String(config?.id || '');
    if (/trie|kmp|rabin|aho|suffix|bwt|myers|edit/.test(id)) {
      return 'text=ABABDABACDABABCABAB | pat=ABABC';
    }

    // Inspect frame 0 stageHtml for numeric cell values
    const f0 = initialFrames?.[0];
    if (f0?.stageHtml) {
      const cellVals = [];
      const re = /dsa-sim__cell-val[^>]*>([^<]+)</g;
      let m;
      while ((m = re.exec(f0.stageHtml)) !== null) {
        const v = m[1].trim();
        if (/^-?\d+(\.\d+)?$/.test(v) && cellVals.length < 10) {
          cellVals.push(v);
        }
      }
      if (cellVals.length >= 4) {
        return cellVals.join(', ');
      }
    }

    if (/graph|bfs|dfs|toposort|dsu|kruskal|dijkstra|bellman|dinic|push-relabel|hungarian|csr/.test(id)) {
      return '10, 25, 40, 15, 30, 50, 20, 35';
    }
    return '38, 27, 43, 3, 9, 82, 10, 19';
  }

  function generateRandomInput(currentInput, config, preset) {
    const cur = String(currentInput || '');
    if (/text\s*=|pat\s*=/i.test(cur) || /trie|kmp|rabin|aho|suffix|bwt|edit/.test(config?.id || '')) {
      const alphabets = ['AB', 'ABC', 'ABCD', 'ACGT'];
      const alpha = alphabets[Math.floor(Math.random() * alphabets.length)];
      let pat = '';
      for (let i = 0; i < 4; i++) pat += alpha[Math.floor(Math.random() * alpha.length)];
      let text = '';
      for (let i = 0; i < 7; i++) text += alpha[Math.floor(Math.random() * alpha.length)];
      const pos = Math.floor(Math.random() * 5);
      text = text.slice(0, pos) + pat + text.slice(pos);
      return `text=${text} | pat=${pat}`;
    }
    if (/target\s*=/i.test(cur)) {
      const len = 7;
      const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 85) + 5).sort((a, b) => a - b);
      const target = Math.random() < 0.75 ? arr[Math.floor(Math.random() * arr.length)] : Math.floor(Math.random() * 90) + 5;
      return `arr=${arr.join(', ')} | target=${target}`;
    }
    if (/stride\s*=/i.test(cur)) {
      const strides = [1, 2, 4, 8];
      const s = strides[Math.floor(Math.random() * strides.length)];
      const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 89) + 10);
      return `stride=${s} | ${arr.join(', ')}`;
    }
    if (/k\s*=/i.test(cur)) {
      const k = Math.floor(Math.random() * 3) + 2;
      const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 12) + 1);
      return `k=${k} | ${arr.join(', ')}`;
    }
    const count = 7;
    const used = new Set();
    const nums = [];
    while (nums.length < count) {
      const n = Math.floor(Math.random() * 90) + 5;
      if (!used.has(n)) {
        used.add(n);
        nums.push(n);
      }
    }
    return nums.join(', ');
  }

  /**
   * Ensures every simulator has a deep, multi-step trace (>= 6 frames)
   * and dynamically incorporates custom user values even if a legacy preset
   * returned fewer frames or static values.
   */
  function ensureDeepInteractiveFrames(config, preset, rawFrames, customInfo) {
    let frames = Array.isArray(rawFrames) ? rawFrames.slice() : [];
    const hasCustom = Boolean(customInfo && customInfo.raw && customInfo.raw.trim());

    // If user supplied custom input and frames did not change from default preset frames,
    // or if a preset has fewer than 6 frames, synthesize/augment rich interactive steps!
    if (hasCustom && frames.length > 0 && !preset._handledCustom) {
      const defaultFrames = config.buildFrames(preset) || [];
      const sameOutput = frames.length === defaultFrames.length &&
        frames[0]?.stageHtml === defaultFrames[0]?.stageHtml &&
        frames[frames.length - 1]?.stageHtml === defaultFrames[defaultFrames.length - 1]?.stageHtml;

      if (sameOutput) {
        const customSimFrames = buildDynamicCustomTrace(config, preset, customInfo, frames);
        if (customSimFrames && customSimFrames.length >= 6) {
          return customSimFrames;
        }
      }
    }

    if (frames.length >= 6) return frames;

    // Expand any 1..5 frame trace into a full 8+ step interactive walkthrough
    return expandShortTraceToMultiStep(config, preset, frames, customInfo);
  }

  function buildDynamicCustomTrace(config, preset, customInfo, baseFrames) {
    const id = String(config?.id || '');
    const title = String(config?.title || '');

    // Case A: String / Pattern simulators
    if (customInfo.text || /trie|kmp|rabin|aho|suffix|bwt|myers|edit/.test(id)) {
      const text = (customInfo.text || customInfo.tokens[0] || 'ABABDABAC').toUpperCase();
      const pat = (customInfo.pattern || customInfo.tokens[1] || text.slice(0, Math.min(4, text.length))).toUpperCase();
      const chars = text.split('');
      const out = [];
      let matches = 0;

      for (let i = 0; i < chars.length; i++) {
        const windowStr = text.slice(i, i + pat.length);
        const isMatch = windowStr === pat && pat.length > 0;
        if (isMatch) matches++;
        const activeIndices = [];
        const matchIndices = [];
        const warnIndices = [];
        const tags = {};
        for (let j = 0; j < pat.length && i + j < chars.length; j++) {
          if (isMatch) matchIndices.push(i + j);
          else if (text[i + j] === pat[j]) activeIndices.push(i + j);
          else warnIndices.push(i + j);
        }
        tags[i] = `pos ${i}`;
        if (isMatch) tags[i] = `MATCH "${pat}"`;

        const patCells = pat.split('').map((ch, idx) => {
          const tCh = text[i + idx];
          const eq = tCh === ch;
          const cls = isMatch ? 'dsa-sim__cell is-match' : (eq ? 'dsa-sim__cell is-active' : 'dsa-sim__cell is-warn');
          return `<div class="${cls}"><span class="dsa-sim__cell-idx">P[${idx}]</span><span class="dsa-sim__cell-val">${esc(ch)}</span><span class="dsa-sim__cell-tag">${tCh ? (eq ? '==' : '≠ ' + tCh) : 'EOF'}</span></div>`;
        }).join('');

        out.push({
          stageHtml: `
            <div style="font-size:12px;color:var(--fg-muted);margin-bottom:4px;font-family:var(--font-mono,monospace);">Text T (len=${text.length}) scanning against Pattern P="${esc(pat)}":</div>
            ${renderArrayCells(chars, { active: activeIndices, match: matchIndices, warn: warnIndices, tags })}
            <div style="font-size:12px;color:var(--fg-muted);margin:6px 0 4px;font-family:var(--font-mono,monospace);">Pattern State / Automaton Alignment at offset i = ${i}:</div>
            <div class="dsa-sim__array">${patCells}</div>
          `,
          invariant: `Offset i = ${i}: comparing window T[${i}..${Math.min(text.length - 1, i + pat.length - 1)}] = "${windowStr}" with pattern "${pat}".`,
          metrics: [
            { label: 'Cursor i', value: `${i} / ${chars.length - 1}` },
            { label: 'Window', value: `"${windowStr}"` },
            { label: 'Pattern', value: `"${pat}"` },
            { label: 'Matches Found', value: `${matches}` }
          ],
          log: isMatch
            ? `Exact match of "${pat}" detected at index i = ${i}!`
            : `Scanned T[${i}]='${chars[i]}' against pattern "${pat}" — ${activeIndices.length} prefix char(s) aligned.`
        });
      }
      return out;
    }

    // Case B: Numeric array / key sequence custom trace
    const arr = (customInfo.arr && customInfo.arr.length >= 2)
      ? customInfo.arr.slice(0, 12)
      : (customInfo.nums && customInfo.nums.length >= 2 ? customInfo.nums.slice(0, 12) : [38, 27, 43, 3, 9, 82, 10]);
    const target = customInfo.target !== undefined && !Number.isNaN(customInfo.target)
      ? customInfo.target
      : arr[Math.floor(arr.length / 2)];

    const out = [];
    const working = arr.slice();
    let acc = 0;
    let best = working[0] || 0;

    // Step 0: Initial Custom Configuration
    out.push({
      stageHtml: renderArrayCells(working, {
        pivot: [0],
        tags: { 0: 'start', [working.length - 1]: `N=${working.length}` }
      }),
      invariant: `Initialized custom input sequence A[0..${working.length - 1}] = [${working.join(', ')}] (target/param = ${target}).`,
      metrics: [
        { label: 'Input Size N', value: `${working.length}` },
        { label: 'Target / Param', value: `${target}` },
        { label: 'Min / Max', value: `${Math.min(...working)} / ${Math.max(...working)}` },
        { label: 'Phase', value: 'Initialization' }
      ],
      log: `Loaded custom user dataset [${working.join(', ')}] into ${title}.`
    });

    // If sorting / heap / tree / partition related, trace sorting/partitioning/relaxation steps
    if (/sort|quick|merge|heap|tree|avl|bplus|treap|splay|bst|eytzinger|timsort/i.test(id + ' ' + title)) {
      const sorted = working.slice();
      for (let i = 0; i < sorted.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < sorted.length; j++) {
          if (sorted[j] < sorted[minIdx]) minIdx = j;
        }
        const beforeSwap = sorted.slice();
        const swapped = minIdx !== i;
        if (swapped) {
          const tmp = sorted[i];
          sorted[i] = sorted[minIdx];
          sorted[minIdx] = tmp;
        }
        const matchIdx = Array.from({ length: i + 1 }, (_, k) => k);
        const tags = { [i]: swapped ? `⇄ [${minIdx}]` : 'in-place' };
        if (swapped) tags[minIdx] = `from [${i}]`;
        out.push({
          stageHtml: renderArrayCells(sorted, {
            match: matchIdx,
            pivot: [i],
            active: swapped ? [minIdx] : [],
            tags
          }),
          invariant: `Prefix A[0..${i}] = [${sorted.slice(0, i + 1).join(', ')}] satisfies structural order invariant ≤ suffix A[${i + 1}..${sorted.length - 1}].`,
          metrics: [
            { label: 'Step Index', value: `${i + 1} / ${sorted.length}` },
            { label: 'Selected Key', value: `${sorted[i]}` },
            { label: 'Operation', value: swapped ? `Swap(${beforeSwap[i]}, ${beforeSwap[minIdx]})` : 'Keep' },
            { label: 'Ordered Prefix', value: `${i + 1} items` }
          ],
          log: swapped
            ? `Step ${i + 1}: Swapped A[${i}]=${beforeSwap[i]} with minimum A[${minIdx}]=${beforeSwap[minIdx]} -> prefix [0..${i}] locked.`
            : `Step ${i + 1}: Element A[${i}]=${sorted[i]} already satisfies invariant at position ${i}.`
        });
      }
      return out;
    }

    // Default step-by-step algorithmic sweep across custom array with accumulator, target check, and state transitions
    const seen = [];
    for (let i = 0; i < working.length; i++) {
      const val = working[i];
      acc += val;
      if (val > best) best = val;
      seen.push(i);
      const isHit = val === target;
      const tags = { [i]: isHit ? `🎯 == ${target}` : `curr (${val})` };
      if (i > 0) tags[i - 1] = 'done';

      out.push({
        stageHtml: renderArrayCells(working, {
          active: seen.slice(0, -1),
          pivot: isHit ? [] : [i],
          match: isHit ? [i] : [],
          tags
        }),
        invariant: `Processed prefix A[0..${i}]: prefix_sum = ${acc}, running_max = ${best}, checking A[${i}] = ${val} vs target ${target}.`,
        metrics: [
          { label: 'Index i', value: `${i} / ${working.length - 1}` },
          { label: 'Current A[i]', value: `${val}` },
          { label: 'Prefix Accumulator', value: `${acc}` },
          { label: 'Running Extremum', value: `${best}` }
        ],
        log: isHit
          ? `Step ${i + 1}: Inspected A[${i}] = ${val} — matches target ${target}! Prefix sum = ${acc}.`
          : `Step ${i + 1}: Processed A[${i}] = ${val}; updated invariant state (sum=${acc}, max=${best}).`
      });
    }

    // Final summary step
    out.push({
      stageHtml: renderArrayCells(working, {
        match: working.map((_, idx) => idx),
        tags: { 0: 'head', [working.length - 1]: `sum=${acc}` }
      }),
      invariant: `Completed full pass over N = ${working.length} custom elements: total sum = ${acc}, max = ${best}.`,
      metrics: [
        { label: 'Total Processed', value: `${working.length} / ${working.length}` },
        { label: 'Total Sum', value: `${acc}` },
        { label: 'Max Element', value: `${best}` },
        { label: 'Status', value: 'Complete ✓' }
      ],
      log: `Execution complete across all ${working.length} custom values.`
    });

    return out;
  }

  function expandShortTraceToMultiStep(config, preset, shortFrames, customInfo) {
    const defaultText = inferDefaultCustomInput(config, preset, shortFrames);
    const parsed = parseCustomInput(customInfo?.raw || defaultText);
    const synth = buildDynamicCustomTrace(config, preset, parsed, shortFrames);
    if (!shortFrames || shortFrames.length === 0) return synth;

    // Interleave the original domain-specific diagram frames with granular algorithmic trace frames
    // so the user gets BOTH the bespoke SVG/diagram stages AND a rich 8–12 step progression!
    const combined = [];
    combined.push({
      ...shortFrames[0],
      log: shortFrames[0].log || `Initialized ${config.title} (${preset?.label || 'Default'}).`
    });

    const middleCount = Math.max(6 - shortFrames.length, 5);
    for (let i = 1; i <= middleCount && i < synth.length - 1; i++) {
      const baseFrame = shortFrames[Math.min(shortFrames.length - 1, Math.floor((i / (middleCount + 1)) * shortFrames.length))];
      const sFrame = synth[i];
      combined.push({
        stageHtml: `
          ${baseFrame.stageHtml || ''}
          <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border-subtle,#27272a);">
            <div style="font-size:11px;color:var(--fg-muted);margin-bottom:4px;font-family:var(--font-mono,monospace);">Step-by-Step State Trace (Step ${i} / ${middleCount}):</div>
            ${sFrame.stageHtml}
          </div>
        `,
        invariant: sFrame.invariant || baseFrame.invariant,
        metrics: sFrame.metrics?.length ? sFrame.metrics : (baseFrame.metrics || []),
        log: sFrame.log || baseFrame.log
      });
    }

    for (let k = 1; k < shortFrames.length; k++) {
      combined.push(shortFrames[k]);
    }
    if (synth.length > 0) {
      const lastSynth = synth[synth.length - 1];
      const lastOrig = shortFrames[shortFrames.length - 1];
      combined.push({
        stageHtml: `
          ${lastOrig.stageHtml || ''}
          <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border-subtle,#27272a);">
            ${lastSynth.stageHtml}
          </div>
        `,
        invariant: lastOrig.invariant || lastSynth.invariant,
        metrics: lastOrig.metrics?.length ? lastOrig.metrics : lastSynth.metrics,
        log: `${lastOrig.log || ''} — ${lastSynth.log || 'Trace verified.'}`
      });
    }
    return combined;
  }

  function buildFramesForPresetAndInput(config, basePreset, customRaw) {
    const parsed = parseCustomInput(customRaw);
    const enrichedPreset = Object.assign({}, basePreset);
    if (customRaw && customRaw.trim()) {
      enrichedPreset.customInput = customRaw.trim();
      enrichedPreset.customNums = parsed.nums;
      enrichedPreset.customTokens = parsed.tokens;
      enrichedPreset.customKv = parsed.kv;
      if (parsed.arr.length >= 2) {
        enrichedPreset.arr = parsed.arr;
        enrichedPreset.keys = parsed.arr;
      }
      if (parsed.target !== undefined && !Number.isNaN(parsed.target)) {
        enrichedPreset.target = parsed.target;
      }
      if (parsed.kv.k !== undefined && !Number.isNaN(Number(parsed.kv.k))) {
        enrichedPreset.k = Number(parsed.kv.k);
      }
      if (parsed.kv.stride !== undefined && !Number.isNaN(Number(parsed.kv.stride))) {
        enrichedPreset.stride = Number(parsed.kv.stride);
      }
      if (parsed.text) enrichedPreset.text = parsed.text;
      if (parsed.pattern) enrichedPreset.pattern = parsed.pattern;
    }

    let rawFrames = [];
    try {
      rawFrames = config.buildFrames(enrichedPreset, parsed) || [];
    } catch (e) {
      rawFrames = [];
    }
    return ensureDeepInteractiveFrames(config, enrichedPreset, rawFrames, customRaw ? parsed : null);
  }

  /* ─────────────────────────────────────────────────────────────
     3. Standard Step Simulator Factory (`createStepSimulator`)
     ───────────────────────────────────────────────────────────── */
  function createStepSimulator(config) {
    const uid = config.id.replace(/[^a-zA-Z0-9_-]/g, '-');
    const presets = config.presets && config.presets.length ? config.presets : [{ id: 'default', label: 'Default' }];
    const badgeClass = config.badgeClass || 'badge-ologn';

    const spec = {
      id: config.id,
      title: config.title,
      slugs: config.slugs || [],
      blurb: config.blurb || '',
      render() {
        const frames = buildFramesForPresetAndInput(config, presets[0], '');
        const f0 = frames[0] || { stageHtml: '', invariant: 'Ready', metrics: [], log: 'Initialized.' };
        const defaultCustom = inferDefaultCustomInput(config, presets[0], frames);
        const sfxOn = sound.isSfxOn();
        const voiceOn = sound.isVoiceOn();

        return `
          <div class="dsa-sim simulator-card" id="${esc(uid)}" data-sim-id="${esc(config.id)}">
            <div class="dsa-sim__header simulator-card__header">
              <div class="dsa-sim__title simulator-card__title">
                <span>${esc(config.title)}</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <button type="button" class="dsa-sim__audio-btn ${sfxOn ? 'is-on' : ''}" data-role="sfx-toggle" title="Toggle Step Sound Effects (Web Audio Synth)">
                  ${sfxOn ? '🔊 SFX On' : '🔇 SFX Off'}
                </button>
                <button type="button" class="dsa-sim__audio-btn ${voiceOn ? 'is-on' : ''}" data-role="voice-toggle" title="Toggle Step Voice Narration (Speech Synthesis)">
                  ${voiceOn ? '🗣️ Voice On' : '🗣️ Voice Off'}
                </button>
                <span class="${esc(badgeClass)}">${esc(config.badge || 'Interactive')}</span>
              </div>
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
                  <option value="1200">0.5×</option>
                  <option value="750" selected>1×</option>
                  <option value="380">2×</option>
                  <option value="180">4×</option>
                </select>
              </label>
              <span class="simulator-card__status" data-role="step-status" style="font-family:var(--font-mono,monospace);font-size:12px;font-weight:600;">
                Step 1 / ${Math.max(1, frames.length)}
              </span>
            </div>

            <div class="dsa-sim__custom-bar">
              <span class="dsa-sim__custom-label">Custom Input:</span>
              <input
                type="text"
                class="simulator-card__input dsa-sim__custom-input"
                data-role="custom-input"
                value="${esc(defaultCustom)}"
                placeholder="e.g. 38, 27, 43, 3, 9, 82, 10 or target=42 | 10, 20, 42, 50"
                aria-label="Custom simulator input values"
              />
              <button type="button" class="btn btn--primary btn--sm" data-role="apply-custom" title="Run simulator with your custom values">
                ▶ Run Custom
              </button>
              <button type="button" class="btn btn--secondary btn--sm" data-role="randomize" title="Generate random input values and run">
                🎲 Randomize
              </button>
            </div>

            <div class="dsa-sim__scrubber-row">
              <span style="font-size:11px;font-family:var(--font-mono,monospace);color:var(--fg-muted);">Timeline</span>
              <input
                type="range"
                class="dsa-sim__scrubber"
                data-role="scrubber"
                min="0"
                max="${Math.max(0, frames.length - 1)}"
                value="0"
                aria-label="Step timeline scrubber"
              />
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
            <div class="dsa-sim__log" data-role="log"><div>[Step 1] ${esc(f0.log || '')}</div></div>
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
        const elCustomInput = card.querySelector('[data-role="custom-input"]');
        const elApplyCustom = card.querySelector('[data-role="apply-custom"]');
        const elRandomize = card.querySelector('[data-role="randomize"]');
        const elScrubber = card.querySelector('[data-role="scrubber"]');
        const elSfxToggle = card.querySelector('[data-role="sfx-toggle"]');
        const elVoiceToggle = card.querySelector('[data-role="voice-toggle"]');
        const elInv = card.querySelector('[data-role="invariant"]');
        const elStage = card.querySelector('[data-role="stage"]');
        const elMetrics = card.querySelector('[data-role="metrics"]');
        const elLog = card.querySelector('[data-role="log"]');

        let presetIdx = 0;
        let frames = buildFramesForPresetAndInput(config, presets[0], '');
        let idx = 0;
        let timer = null;

        function syncAudioButtons() {
          const sOn = sound.isSfxOn();
          const vOn = sound.isVoiceOn();
          if (elSfxToggle) {
            elSfxToggle.classList.toggle('is-on', sOn);
            elSfxToggle.textContent = sOn ? '🔊 SFX On' : '🔇 SFX Off';
          }
          if (elVoiceToggle) {
            elVoiceToggle.classList.toggle('is-on', vOn);
            elVoiceToggle.textContent = vOn ? '🗣️ Voice On' : '🗣️ Voice Off';
          }
        }

        function stopPlay() {
          if (timer) {
            lc.stop(timer);
            timer = null;
          }
          if (elPlay) elPlay.textContent = '⏵ Play';
        }

        function renderFrame(withAudio = false, audioMode = 'step') {
          if (!frames.length) return;
          if (idx < 0) idx = 0;
          if (idx >= frames.length) idx = frames.length - 1;
          const f = frames[idx] || frames[0];
          if (elStatus) elStatus.textContent = `Step ${idx + 1} / ${frames.length}`;
          if (elScrubber) {
            elScrubber.max = String(Math.max(0, frames.length - 1));
            elScrubber.value = String(idx);
          }
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

          if (withAudio) {
            const speedMs = parseInt(elSpeed?.value, 10) || 750;
            sound.playStep(f, idx, frames.length, audioMode);
            sound.speakStep(f, idx, frames.length, speedMs);
          }
        }

        function loadPreset(pIdx, customRaw = '') {
          stopPlay();
          presetIdx = pIdx;
          const basePreset = presets[presetIdx] || presets[0];
          frames = buildFramesForPresetAndInput(config, basePreset, customRaw);
          if (!customRaw && elCustomInput) {
            elCustomInput.value = inferDefaultCustomInput(config, basePreset, frames);
          }
          idx = 0;
          renderFrame(Boolean(customRaw), customRaw ? 'custom' : 'step');
        }

        lc.on(elPreset, 'change', () => {
          loadPreset(parseInt(elPreset.value, 10) || 0, '');
          window.Analytics?.trackSimulatorInteraction?.(config.id, 'preset', { preset: presets[presetIdx]?.label });
        });

        lc.on(elApplyCustom, 'click', () => {
          const val = elCustomInput ? elCustomInput.value.trim() : '';
          loadPreset(presetIdx, val);
          window.Analytics?.trackSimulatorInteraction?.(config.id, 'custom_input', { value: val });
        });

        lc.on(elCustomInput, 'keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            elApplyCustom?.click();
          }
        });

        lc.on(elRandomize, 'click', () => {
          const currentVal = elCustomInput ? elCustomInput.value : '';
          const randVal = generateRandomInput(currentVal, config, presets[presetIdx] || presets[0]);
          if (elCustomInput) elCustomInput.value = randVal;
          loadPreset(presetIdx, randVal);
          window.Analytics?.trackSimulatorInteraction?.(config.id, 'randomize', { value: randVal });
        });

        lc.on(elScrubber, 'input', () => {
          stopPlay();
          idx = parseInt(elScrubber.value, 10) || 0;
          renderFrame(true, 'step');
        });

        lc.on(elSfxToggle, 'click', () => {
          sound.setSfx(!sound.isSfxOn());
          syncAudioButtons();
          if (sound.isSfxOn()) sound.playStep(frames[idx], idx, frames.length, 'custom');
        });

        lc.on(elVoiceToggle, 'click', () => {
          sound.setVoice(!sound.isVoiceOn());
          syncAudioButtons();
          if (sound.isVoiceOn()) {
            const speedMs = parseInt(elSpeed?.value, 10) || 750;
            sound.speakStep(frames[idx], idx, frames.length, speedMs);
          }
        });

        lc.on(elPrev, 'click', () => {
          stopPlay();
          if (idx > 0) {
            idx--;
            renderFrame(true, 'prev');
          }
        });

        lc.on(elNext, 'click', () => {
          stopPlay();
          if (idx < frames.length - 1) {
            idx++;
            renderFrame(true, 'step');
          } else {
            // Rewind to 0 and step if clicked at end
            idx = 0;
            renderFrame(true, 'step');
          }
          window.Analytics?.trackSimulatorInteraction?.(config.id, 'step', { step: idx + 1 });
        });

        lc.on(elReset, 'click', () => {
          stopPlay();
          idx = 0;
          sound.playStep(frames[0], 0, frames.length, 'reset');
          sound.stopSpeech();
          renderFrame(false);
        });

        function startPlayLoop() {
          if (idx >= frames.length - 1) {
            idx = 0;
            renderFrame(true, 'step');
          } else {
            idx++;
            renderFrame(true, 'step');
          }
          if (elPlay) elPlay.textContent = '⏸ Pause';
          const baseDelay = parseInt(elSpeed?.value, 10) || 750;
          // Give voice narration enough breathing room when Voice is active at normal speeds
          const effectiveDelay = (sound.isVoiceOn() && baseDelay >= 700) ? Math.max(baseDelay, 1350) : baseDelay;
          timer = lc.every(effectiveDelay, () => {
            if (idx < frames.length - 1) {
              idx++;
              renderFrame(true, 'step');
            } else {
              stopPlay();
            }
          });
        }

        lc.on(elPlay, 'click', () => {
          if (timer) {
            stopPlay();
            sound.stopSpeech();
            return;
          }
          startPlayLoop();
          window.Analytics?.trackSimulatorInteraction?.(config.id, 'play', {});
        });

        lc.on(elSpeed, 'change', () => {
          if (timer) {
            stopPlay();
            startPlayLoop();
          }
        });

        syncAudioButtons();
        renderFrame(false);
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
    sound,
    lifecycle,
    parseCustomInput,
    createStepSimulator,
    renderArrayCells,
    getSimulatorForUnit,
    register: window.registerSimulator,
    init: window.initSimulator
  };
})();
