/* ═══════════════════════════════════════════════════════════════
   Markdown Renderer — Lesson Markdown-to-HTML, Code Blocks & Copy
   ═══════════════════════════════════════════════════════════════ */

window.MarkdownRenderer = (() => {
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const RUNNABLE_LANGS = new Set([
    'js', 'javascript', 'ts', 'typescript',
    'cpp', 'c++', 'cc', 'cxx', 'c', 'hpp',
    'py', 'python',
    'node', 'sh', 'bash'
  ]);

  function convertMarkdownToHTML(md) {
    if (!md) return '';

    const codeBlocks = [];
    const inlineCodes = [];
    let html = md
      // Mermaid blocks MUST be replaced before generic code blocks
      .replace(/```mermaid\s*\n([\s\S]*?)```/g, (_, diagram) => {
        const idx = codeBlocks.length;
        codeBlocks.push('<div class="mermaid">' + diagram.trim() + '</div>');
        return '\x00CODEBLOCK_' + idx + '\x00';
      })
      // Code blocks (``` blocks) - handle info strings like title="terminal"
      .replace(/```(\S+)?[^\n]*\n([\s\S]*?)```/g, (_, lang, code) => {
        const idx = codeBlocks.length;
        const cleanLang = (lang || 'text').toLowerCase();
        const isRunnable = RUNNABLE_LANGS.has(cleanLang);
        const runBtn = isRunnable
          ? `<button type="button" class="code-block__copy" data-action="run-snippet-codelab" data-lang="${escapeHtml(cleanLang)}" title="Execute this snippet in the in-browser CodeLab IDE (Node.js v22, TypeScript, C++20 WASI &amp; Python 3.12)">⚡ Run in CodeLab</button>`
          : '';
        codeBlocks.push(
          '<div class="code-block">' +
            '<div class="code-block__header">' +
              '<span class="code-block__lang">' + escapeHtml(cleanLang) + '</span>' +
              '<div style="display:flex;align-items:center;gap:6px;">' +
                runBtn +
                '<button type="button" class="code-block__copy" data-action="copy-code">Copy</button>' +
              '</div>' +
            '</div>' +
            '<pre><code class="language-' + escapeHtml(cleanLang) + '">' + escapeHtml(code.trim()) + '</code></pre>' +
          '</div>'
        );
        return '\x00CODEBLOCK_' + idx + '\x00';
      })
      // Inline code (`...`) - escape HTML entities inside backticks & protect from markdown regexes
      .replace(/`([^`\n]+)`/g, (_, code) => {
        const idx = inlineCodes.length;
        inlineCodes.push('<code>' + escapeHtml(code) + '</code>');
        return '\x00INLINECODE_' + idx + '\x00';
      });

    // Phase 2: Process block-level markdown syntax
    html = html
      .replace(/^>\s*\[!NOTE\]\s*(.*)$/gm, '<div class="callout callout--note"><div class="callout__title">ℹ️ Note</div><p>$1</p></div>')
      .replace(/^>\s*\[!TIP\]\s*(.*)$/gm, '<div class="callout callout--tip"><div class="callout__title">💡 Tip</div><p>$1</p></div>')
      .replace(/^>\s*\[!WARNING\]\s*(.*)$/gm, '<div class="callout callout--warn"><div class="callout__title">⚠️ Warning</div><p>$1</p></div>')
      .replace(/^>\s*\[!IMPORTANT\]\s*(.*)$/gm, '<div class="callout callout--danger"><div class="callout__title">❗ Important</div><p>$1</p></div>')
      .replace(/^>\s*(.*)$/gm, '<blockquote><p>$1</p></blockquote>')
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h2>$1</h2>')
      .replace(/^---$/gm, '<hr>')
      .replace(/^\|(.+)\|[ \t]*\n\|[-| :]+\|[ \t]*\n((?:\|.+\|[ \t]*(?:\n|$))*)/gm, (_, header, body) => {
        const ths = header.split('|').map(h => '<th>' + h.trim() + '</th>').join('');
        const rows = body.trim().split('\n').map(row => {
          const tds = row.trim().replace(/^\||\|$/g, '').split('|').map(c => '<td>' + c.trim() + '</td>').join('');
          return '<tr>' + tds + '</tr>';
        }).join('');
        return '<table><thead><tr>' + ths + '</tr></thead><tbody>' + rows + '</tbody></table>\n';
      });

    // Phase 3: Process paragraphs and lists
    const lines = html.split('\n');
    const processed = [];
    let inList = false;
    let listType = '';
    let openLi = false;
    let paraLines = [];

    function flushPara() {
      if (paraLines.length > 0) {
        processed.push('<p>' + paraLines.join(' ') + '</p>');
        paraLines = [];
      }
    }

    function closeList() {
      if (openLi) {
        processed[processed.length - 1] += '</li>';
        openLi = false;
      }
      if (inList) {
        processed.push('</' + listType + '>');
        inList = false;
        listType = '';
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().match(/^\x00CODEBLOCK_\d+\x00$/)) {
        flushPara();
        closeList();
        processed.push(line.trim());
        continue;
      }

      if (line.match(/^<(h[1-6]|table|thead|tbody|tr|th|td|div|pre|hr|ul|ol|li|blockquote)\b/)) {
        flushPara();
        closeList();
        processed.push(line);
        continue;
      }

      if (line.match(/^[-*] /)) {
        flushPara();
        if (!inList || listType !== 'ul') {
          closeList();
          processed.push('<ul>');
          inList = true; listType = 'ul';
        } else if (openLi) {
          processed[processed.length - 1] += '</li>';
          openLi = false;
        }
        processed.push('<li>' + line.replace(/^[-*] /, ''));
        openLi = true;
        continue;
      }

      if (line.match(/^\d+\. /)) {
        flushPara();
        if (!inList || listType !== 'ol') {
          closeList();
          processed.push('<ol>');
          inList = true; listType = 'ol';
        } else if (openLi) {
          processed[processed.length - 1] += '</li>';
          openLi = false;
        }
        processed.push('<li>' + line.replace(/^\d+\. /, ''));
        openLi = true;
        continue;
      }

      if (line.trim() === '') {
        flushPara();
        closeList();
        continue;
      }

      if (inList && openLi) {
        if (line.match(/^\s+[-*] /)) {
          processed[processed.length - 1] += '<br>• ' + line.replace(/^\s+[-*] /, '').trim();
        } else {
          processed[processed.length - 1] += ' ' + line.trim();
        }
        continue;
      }

      paraLines.push(line.trim());
    }

    flushPara();
    closeList();

    // Phase 4: Inline formatting & code restoration
    let out = processed.join('\n')
      .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\[\[wiki\/([^\]|]+)\|([^\]]+)\]\]/g, '<a href="#" data-nav="topic" data-slug="$1">$2</a>')
      .replace(/\[\[wiki\/([^\]]+)\]\]/g, (_, slug) => '<a href="#" data-nav="topic" data-slug="' + slug + '">' + slug.replace(/-/g, ' ') + '</a>');

    out = out
      .replace(/\x00CODEBLOCK_(\d+)\x00/g, (_, idx) => codeBlocks[parseInt(idx)])
      .replace(/\x00INLINECODE_(\d+)\x00/g, (_, idx) => inlineCodes[parseInt(idx)]);

    return out;
  }

  function copyCode(btn) {
    const block = btn.closest('.code-block');
    const code = block?.querySelector('code');
    const filename = block?.querySelector('.code-block__lang')?.textContent || '';
    if (code) {
      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        if (window.Analytics?.trackCodeCopy) {
          window.Analytics.trackCodeCopy(filename, '', code.textContent.length);
        }
      });
    }
  }

  window.copyCode = copyCode;

  return {
    escapeHtml,
    convertMarkdownToHTML,
    copyCode
  };
})();
