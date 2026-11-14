/* ═══════════════════════════════════════════════════════════════
   Theme Manager — Dark/Light mode toggle, icon sync & Mermaid theme
   ═══════════════════════════════════════════════════════════════ */

window.ThemeManager = (() => {
  function getMermaidThemeVariables(theme) {
    const isDark = theme === 'dark';
    return {
      darkMode: isDark,
      background: isDark ? '#141416' : '#ffffff',
      primaryColor: isDark ? '#1c1c1f' : '#f7f7f5',
      primaryTextColor: isDark ? '#f4f4f5' : '#1a1917',
      primaryBorderColor: isDark ? '#3a3a3e' : '#d3d0c9',
      lineColor: isDark ? '#8e8e97' : '#8a857d',
      secondaryColor: isDark ? '#141415' : '#f1f1ee',
      tertiaryColor: isDark ? '#27272a' : '#e6e4df',
      mainBkg: isDark ? '#1c1c1f' : '#f7f7f5',
      nodeBorder: isDark ? '#3a3a3e' : '#d3d0c9',
      clusterBkg: isDark ? '#141416' : '#ffffff',
      clusterBorder: isDark ? '#27272a' : '#e6e4df',
      textColor: isDark ? '#d4d4d8' : '#2e2c29',
      edgeLabelBackground: isDark ? '#141416' : '#ffffff',
      actorBkg: isDark ? '#1c1c1f' : '#f7f7f5',
      actorBorder: isDark ? '#3a3a3e' : '#d3d0c9',
      actorTextColor: isDark ? '#f4f4f5' : '#1a1917',
      signalColor: isDark ? '#a1a1aa' : '#5c5853',
      signalTextColor: isDark ? '#d4d4d8' : '#2e2c29',
      noteBkgColor: isDark ? '#27272a' : '#f1f1ee',
      noteBorderColor: isDark ? '#3a3a3e' : '#d3d0c9',
      noteTextColor: isDark ? '#d4d4d8' : '#2e2c29',
      fontFamily: '"Geist", -apple-system, sans-serif',
      fontSize: '13px'
    };
  }

  function syncThemeIcons() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const sunIcon = document.querySelector('.icon-sun');
    const moonIcon = document.querySelector('.icon-moon');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = isDark ? '' : 'none';
      moonIcon.style.display = isDark ? 'none' : '';
    }
  }

  function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);

    const isDark = next === 'dark';
    const sunIcon = document.querySelector('.icon-sun');
    const moonIcon = document.querySelector('.icon-moon');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = isDark ? '' : 'none';
      moonIcon.style.display = isDark ? 'none' : '';
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#0f0f10' : '#f7f7f5');

    if (window.mermaid) {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: getMermaidThemeVariables(next)
      });
      document.querySelectorAll('.mermaid[data-original-src]').forEach(el => {
        el.textContent = el.getAttribute('data-original-src');
        el.removeAttribute('data-processed');
      });
      if (window.DiagramManager?.initMermaid) {
        window.DiagramManager.initMermaid();
      } else if (window.App?.initMermaid) {
        window.App.initMermaid();
      }
    }

    try { localStorage.setItem('sd-theme', next); } catch {}
    if (window.Analytics?.trackThemeChange) {
      window.Analytics.trackThemeChange(next);
    }
  }

  return {
    getMermaidThemeVariables,
    syncThemeIcons,
    toggleTheme
  };
})();
