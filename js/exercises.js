/* ═══════════════════════════════════════════════════════════════
   Exercises & Concept Reinforcement Engine — DSA In Depth
   ═══════════════════════════════════════════════════════════════ */

window.Exercises = (() => {
  const exerciseBank = {
    "computational-models-ram-word-ram": {
      title: "Word-RAM vs Pointer-Machine Complexity",
      difficulty: "Foundational",
      prompt: "In the Word-RAM model with word size w >= log2(n), why can radix sort sort n 64-bit integers in O(n) time without violating the Omega(n log n) comparison-tree lower bound?",
      scenario: "Sorting 10,000,000 64-bit unsigned integer keys in memory.",
      options: [
        "Because Radix Sort uses hardware branch prediction to skip comparisons.",
        "Because the Omega(n log n) bound applies only to decision trees that branch on pairwise comparisons (ai < aj), whereas Word-RAM bit-extraction indexes directly into 2^r buckets per pass.",
        "Because 64-bit integers are always already partially sorted in RAM.",
        "Because Big-O notation ignores logarithmic factors in the Word-RAM model."
      ],
      answer: 1,
      explanation: "The information-theoretic Omega(n log n) lower bound counts binary comparisons in a decision tree with n! leaves. Word-RAM array indexing by an r-bit digit branches 2^r ways in O(1) time, yielding log_{2^r}(n!) = O(n · w/r) operations."
    },
    "cpu-cache-hierarchy-locality": {
      title: "Cache-Line Spatial Locality: B-Tree vs Pointer BST",
      difficulty: "Staff Level",
      prompt: "Why does an in-memory B-Tree (such as Rust's std::collections::BTreeMap with node factor B=6..16) outperform a standard pointer-based Red-Black tree on modern CPUs?",
      scenario: "Lookup-heavy workload over 50 million 64-bit keys in L3/DRAM.",
      options: [
        "B-Trees perform fewer total key comparisons than binary search trees.",
        "Each pointer chase in a binary tree stalls ~50-100ns on a DRAM cache miss for just 1 comparison, whereas a B-Tree node packs 8-15 keys inside 1-2 contiguous 64-byte cache lines, amortizing each cache miss across log2(B) comparisons.",
        "Red-Black trees require O(n) rotations on every read lookup.",
        "B-Trees do not use pointers at all."
      ],
      answer: 1,
      explanation: "Modern CPUs fetch memory in 64-byte cache lines. A pointer-based BST node wastes most of the cache line and triggers a dependent pointer-chase stall at every level (log2 N misses). Packing B keys per node reduces DRAM stalls to log_B(N)."
    }
  };

  function getExercise(slug) {
    if (exerciseBank[slug]) return exerciseBank[slug];
    const qList = window.QUESTION_BANK?.[slug];
    if (Array.isArray(qList) && qList.length > 0) {
      const q = qList[qList.length - 1];
      if (Array.isArray(q.options) && typeof q.answer === 'number') {
        return {
          title: "Algorithmic Design & Complexity Check",
          difficulty: q.difficulty === 'staff' ? 'Staff Level' : (q.difficulty === 'apply' ? 'Intermediate' : 'Foundational'),
          prompt: q.question || q.prompt,
          scenario: "Analyze the invariant, asymptotic bound, and hardware behavior before selecting.",
          options: q.options,
          answer: q.answer,
          explanation: q.explanation
        };
      }
    }
    return null;
  }

  function renderExercise(slug, unitTitle) {
    const ex = getExercise(slug);
    if (!ex) return '';
    const optionsHtml = ex.options.map((opt, idx) => `
      <button type="button" class="exercise-option" data-action="check-exercise" data-slug="${slug}" data-idx="${idx}" data-ans="${ex.answer}">
        <span class="exercise-option__letter">${String.fromCharCode(65 + idx)}</span>
        <span class="exercise-option__text">${opt}</span>
      </button>
    `).join('');

    return `
      <div class="exercise-card" id="exercise-${slug}">
        <div class="exercise-card__header">
          <span class="exercise-card__badge">Interactive Challenge · ${ex.difficulty}</span>
          <h3 class="exercise-card__title">${ex.title || unitTitle}</h3>
        </div>
        ${ex.scenario ? `<div class="exercise-card__scenario">${ex.scenario}</div>` : ''}
        <p class="exercise-card__prompt">${ex.prompt}</p>
        <div class="exercise-card__options" id="exercise-options-${slug}">
          ${optionsHtml}
        </div>
        <div class="exercise-card__feedback" id="exercise-feedback-${slug}" style="display:none;">
          <div class="exercise-card__explanation">${ex.explanation}</div>
        </div>
      </div>
    `;
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="check-exercise"]');
    if (!btn) return;
    const slug = btn.dataset.slug;
    const idx = parseInt(btn.dataset.idx, 10);
    const ans = parseInt(btn.dataset.ans, 10);
    const container = document.getElementById('exercise-options-' + slug);
    const feedback = document.getElementById('exercise-feedback-' + slug);
    if (!container) return;
    container.querySelectorAll('.exercise-option').forEach((b, i) => {
      b.disabled = true;
      if (i === ans) b.classList.add('is-correct');
      else if (i === idx) b.classList.add('is-wrong');
    });
    if (feedback) feedback.style.display = 'block';
  });

  return { renderExercise, getExercise };
})();
