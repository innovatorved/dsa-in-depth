/* ═══════════════════════════════════════════════════════════════
   Theme Manager — Dark/Light mode toggle, icon sync & Mermaid theme
   ═══════════════════════════════════════════════════════════════ */

window.ThemeManager = (() => {
  function getMermaidThemeVariables(theme) {
    const isDark = theme === 'dark';
    return {
      darkMode: isDark,
      background: isDark ? '#0a0a0a' : '#ffffff',
      primaryColor: isDark ? '#171717' : '#fafafa',
      primaryTextColor: isDark ? '#ffffff' : '#0a0a0a',
      primaryBorderColor: isDark ? '#404040' : '#d4d4d4',
      lineColor: isDark ? '#737373' : '#a1a1a1',
      secondaryColor: isDark ? '#0a0a0a' : '#f5f5f5',
      tertiaryColor: isDark ? '#262626' : '#e5e5e5',
      mainBkg: isDark ? '#171717' : '#fafafa',
      nodeBorder: isDark ? '#404040' : '#d4d4d4',
      clusterBkg: isDark ? '#0a0a0a' : '#ffffff',
      clusterBorder: isDark ? '#262626' : '#e5e5e5',
      textColor: isDark ? '#e5e5e5' : '#262626',
      edgeLabelBackground: isDark ? '#0a0a0a' : '#ffffff',
      actorBkg: isDark ? '#171717' : '#fafafa',
      actorBorder: isDark ? '#404040' : '#d4d4d4',
      actorTextColor: isDark ? '#ffffff' : '#0a0a0a',
      signalColor: isDark ? '#a1a1a1' : '#525252',
      signalTextColor: isDark ? '#e5e5e5' : '#262626',
      noteBkgColor: isDark ? '#262626' : '#f5f5f5',
      noteBorderColor: isDark ? '#404040' : '#d4d4d4',
      noteTextColor: isDark ? '#e5e5e5' : '#262626',
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
    if (meta) meta.setAttribute('content', next === 'dark' ? '#000000' : '#ffffff');

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
