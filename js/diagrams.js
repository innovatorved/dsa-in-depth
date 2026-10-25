/* ═══════════════════════════════════════════════════════════════
   Diagram Manager — Mermaid rendering, accessibility & pan/zoom modal
   ═══════════════════════════════════════════════════════════════ */

window.DiagramManager = (() => {
  const lightboxState = {
    isOpen: false,
    scale: 1,
    translateX: 0,
    translateY: 0,
    isDragging: false,
    startX: 0,
    startY: 0
  };

  function updateLightboxTransform() {
    const stage = document.getElementById('diagram-lightbox-stage');
    const zoomLevel = document.getElementById('diagram-zoom-level');
    if (!stage) return;
    stage.style.transform = `translate(${lightboxState.translateX}px, ${lightboxState.translateY}px) scale(${lightboxState.scale})`;
    if (zoomLevel) {
      zoomLevel.textContent = Math.round(lightboxState.scale * 100) + '%';
    }
  }

  function openDiagramLightbox(mermaidEl) {
    const modal = document.getElementById('diagram-lightbox');
    const stage = document.getElementById('diagram-lightbox-stage');
    const body = document.getElementById('diagram-lightbox-body');
    if (!modal || !stage || !mermaidEl) return;

    if (window.Analytics?.trackDiagramOpen) {
      window.Analytics.trackDiagramOpen();
    }

    const svg = mermaidEl.querySelector('svg');
    if (!svg) return;

    modal.classList.add('open');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    lightboxState.isOpen = true;
    lightboxState.scale = 1.0;
    lightboxState.translateX = 0;
    lightboxState.translateY = 0;
    updateLightboxTransform();

    const originalId = svg.getAttribute('id');
    const newId = originalId ? (originalId + '-lightbox') : ('mermaid-lb-' + Date.now());

    let svgHtml = svg.outerHTML;
    if (originalId) {
      svgHtml = svgHtml.replaceAll(originalId, newId);
    }

    stage.innerHTML = svgHtml;

    const lbSvg = stage.querySelector('svg');
    if (lbSvg) {
      lbSvg.removeAttribute('style');

      let vbW = 0, vbH = 0;
      const vb = lbSvg.getAttribute('viewBox');
      if (vb) {
        const parts = vb.trim().split(/[\s,]+/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          vbW = parts[2];
          vbH = parts[3];
        }
      }

      if (!vbW || !vbH) {
        const rect = svg.getBoundingClientRect();
        vbW = rect.width || 800;
        vbH = rect.height || 500;
      }

      const bodyW = (body && body.clientWidth) || (body ? body.getBoundingClientRect().width : 0) || (window.innerWidth * 0.92);
      const bodyH = (body && body.clientHeight) || (body ? body.getBoundingClientRect().height : 0) || (window.innerHeight * 0.82);
      const availW = Math.max(320, bodyW - 48);
      const availH = Math.max(240, bodyH - 48);

      const scaleX = availW / vbW;
      const scaleY = availH / vbH;
      let fitScale = Math.min(scaleX, scaleY);
      if (fitScale > 1.8) fitScale = 1.8;
      if (fitScale < 0.2) fitScale = 0.2;

      const renderW = Math.round(vbW * fitScale);
      const renderH = Math.round(vbH * fitScale);

      lbSvg.setAttribute('width', renderW);
      lbSvg.setAttribute('height', renderH);
      lbSvg.style.width = renderW + 'px';
      lbSvg.style.height = renderH + 'px';
      lbSvg.style.maxWidth = 'none';
      lbSvg.style.maxHeight = 'none';
      lbSvg.style.display = 'block';
    }
  }

  function closeDiagramLightbox() {
    const modal = document.getElementById('diagram-lightbox');
    if (!modal) return;
    modal.classList.remove('open');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    lightboxState.isOpen = false;
    if (window.Analytics?.trackDiagramClose) {
      window.Analytics.trackDiagramClose();
    }
  }

  function attachMermaidAccessibility() {
    const diagrams = document.querySelectorAll('.mermaid');
    const topicTitleEl = document.querySelector('.lesson-header__title');
    const topicTitle = topicTitleEl ? topicTitleEl.textContent.trim() : 'Algorithm & Data Structure';
    diagrams.forEach(el => {
      const svg = el.querySelector('svg');
      if (svg) {
        if (!svg.hasAttribute('role')) {
          svg.setAttribute('role', 'img');
        }
        if (!svg.hasAttribute('aria-label')) {
          svg.setAttribute('aria-label', `Algorithm & Data Structure Diagram for ${topicTitle}`);
        }
      }
    });
  }

  function attachMermaidZoomControls() {
    attachMermaidAccessibility();
    const diagrams = document.querySelectorAll('.mermaid');
    diagrams.forEach(el => {
      const svg = el.querySelector('svg');
      if (!svg) return;

      if (!el.querySelector('.mermaid-expand-btn')) {
        const btn = document.createElement('button');
        btn.className = 'mermaid-expand-btn';
        btn.setAttribute('type', 'button');
        btn.setAttribute('title', 'View diagram full size');
        btn.setAttribute('aria-label', 'Expand diagram');
        btn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 3 21 3 21 9"/>
            <polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/>
            <line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
          <span>Expand</span>
        `;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openDiagramLightbox(el);
        });
        el.appendChild(btn);
      }

      if (!el._zoomClickAttached) {
        el._zoomClickAttached = true;
        el.addEventListener('click', () => {
          openDiagramLightbox(el);
        });
      }
    });
  }

  function initMermaid() {
    const diagrams = document.querySelectorAll('.mermaid:not([data-processed])');
    if (diagrams.length === 0) {
      attachMermaidZoomControls();
      return;
    }

    if (typeof window.loadMermaid !== 'function') return;
    window.loadMermaid().then(() => {
      diagrams.forEach(el => {
        if (!el.getAttribute('data-original-src')) {
          el.setAttribute('data-original-src', el.textContent.trim());
        }
      });
      window.mermaid.run({ nodes: Array.from(diagrams) }).then(() => {
        attachMermaidZoomControls();
      }).catch(err => {
        console.warn('Mermaid render warning:', err);
        attachMermaidZoomControls();
      });
    }).catch(err => {
      console.warn('Failed to load Mermaid:', err);
    });
  }

  function setupDiagramLightboxEvents() {
    const modal = document.getElementById('diagram-lightbox');
    const backdrop = document.getElementById('diagram-lightbox-backdrop');
    const closeBtn = document.getElementById('diagram-lightbox-close');
    const zoomInBtn = document.getElementById('diagram-zoom-in');
    const zoomOutBtn = document.getElementById('diagram-zoom-out');
    const zoomResetBtn = document.getElementById('diagram-zoom-reset');
    const body = document.getElementById('diagram-lightbox-body');

    if (!modal || modal._lightboxBound) return;
    modal._lightboxBound = true;

    if (backdrop) backdrop.addEventListener('click', closeDiagramLightbox);
    if (closeBtn) closeBtn.addEventListener('click', closeDiagramLightbox);

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        lightboxState.scale = Math.min(lightboxState.scale * 1.25, 4.0);
        updateLightboxTransform();
        if (window.Analytics?.trackDiagramZoom) {
          window.Analytics.trackDiagramZoom('zoom_in', lightboxState.scale);
        }
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        lightboxState.scale = Math.max(lightboxState.scale / 1.25, 0.35);
        updateLightboxTransform();
        if (window.Analytics?.trackDiagramZoom) {
          window.Analytics.trackDiagramZoom('zoom_out', lightboxState.scale);
        }
      });
    }

    if (zoomResetBtn) {
      zoomResetBtn.addEventListener('click', () => {
        lightboxState.scale = 1.0;
        lightboxState.translateX = 0;
        lightboxState.translateY = 0;
        updateLightboxTransform();
        if (window.Analytics?.trackDiagramZoom) {
          window.Analytics.trackDiagramZoom('zoom_reset', lightboxState.scale);
        }
      });
    }

    if (body) {
      body.addEventListener('wheel', (e) => {
        if (!lightboxState.isOpen) return;
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.15 : 0.85;
        lightboxState.scale = Math.max(0.35, Math.min(4.0, lightboxState.scale * factor));
        updateLightboxTransform();
      }, { passive: false });

      body.addEventListener('mousedown', (e) => {
        if (e.target.closest('.diagram-lightbox__actions')) return;
        lightboxState.isDragging = true;
        lightboxState.startX = e.clientX - lightboxState.translateX;
        lightboxState.startY = e.clientY - lightboxState.translateY;
        body.classList.add('panning');
      });

      window.addEventListener('mousemove', (e) => {
        if (!lightboxState.isDragging || !lightboxState.isOpen) return;
        lightboxState.translateX = e.clientX - lightboxState.startX;
        lightboxState.translateY = e.clientY - lightboxState.startY;
        updateLightboxTransform();
      });

      window.addEventListener('mouseup', () => {
        if (lightboxState.isDragging) {
          lightboxState.isDragging = false;
          body.classList.remove('panning');
        }
      });

      let touchStartX = 0, touchStartY = 0;
      body.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX - lightboxState.translateX;
          touchStartY = e.touches[0].clientY - lightboxState.translateY;
        }
      }, { passive: true });

      body.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && lightboxState.isOpen) {
          lightboxState.translateX = e.touches[0].clientX - touchStartX;
          lightboxState.translateY = e.touches[0].clientY - touchStartY;
          updateLightboxTransform();
        }
      }, { passive: true });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxState.isOpen) {
        closeDiagramLightbox();
      }
    });
  }

  window.openDiagramLightbox = openDiagramLightbox;
  window.closeDiagramLightbox = closeDiagramLightbox;

  return {
    initMermaid,
    openDiagramLightbox,
    closeDiagramLightbox,
    attachMermaidZoomControls,
    setupDiagramLightboxEvents
  };
})();
