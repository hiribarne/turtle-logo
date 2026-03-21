const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');

/**
 * Parse books/logo-book.md into chapter objects.
 * Code blocks become Run-able blocks. Multi-line blocks get per-line Run
 * buttons so commands can be executed one at a time.
 */
module.exports = function () {
  const bookPath = path.join(__dirname, '..', '..', 'books', 'logo-book.md');
  const raw = fs.readFileSync(bookPath, 'utf-8');

  const md = markdownIt({ html: true });

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function attr(s) {
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  md.renderer.rules.fence = function (tokens, idx) {
    const token = tokens[idx];
    const code = token.content.trim();
    const info = token.info.trim();
    if (info && info !== 'logo') return '';
    if (!code) return '';

    const lines = code.split('\n');
    const isToBlock = lines[0].trim().toUpperCase().startsWith('TO ');
    const isMultiLine = lines.length > 1 && !isToBlock;

    if (isMultiLine) {
      // Per-line Run buttons + Run All
      let linesHtml = '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        linesHtml += `    <div class="logo-line" data-code="${attr(trimmed)}">
      <code>${esc(trimmed)}</code>
      <button class="logo-run-line" title="Run this line">&#9654;</button>
    </div>\n`;
      }
      return `<div class="logo-block logo-block--multi" data-code="${attr(code)}">
  <div class="logo-lines">
${linesHtml}  </div>
  <div class="logo-toolbar">
    <button class="logo-run-btn" title="Run all lines">Run All</button>
  </div>
</div>\n`;
    }

    // Single-line or TO block — one Run button
    return `<div class="logo-block" data-code="${attr(code)}">
  <pre><code>${esc(code)}</code></pre>
  <div class="logo-toolbar">
    <button class="logo-run-btn" title="Run this block">Run</button>
  </div>
</div>\n`;
  };

  const sections = raw.split(/^## /m).slice(1);

  const chapters = [];
  for (const section of sections) {
    const newlineIdx = section.indexOf('\n');
    const title = section.slice(0, newlineIdx).trim();
    const body = section.slice(newlineIdx + 1).trim();

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const html = md.render(body);
    const hasCode = html.includes('class="logo-block');
    chapters.push({ title, slug, html, hasCode });
  }

  for (let i = 0; i < chapters.length; i++) {
    chapters[i].prev = i > 0 ? { title: chapters[i - 1].title, slug: chapters[i - 1].slug } : null;
    chapters[i].next = i < chapters.length - 1 ? { title: chapters[i + 1].title, slug: chapters[i + 1].slug } : null;
  }

  return chapters;
};
