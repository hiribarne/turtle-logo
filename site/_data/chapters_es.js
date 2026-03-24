const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');

/**
 * Parse books/logo-book-es.md into Spanish chapter objects.
 * Same logic as chapters.js but for the Spanish book.
 */
module.exports = function () {
  const bookPath = path.join(__dirname, '..', '..', 'books', 'logo-book-es.md');
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
    const isToBlock = lines[0].trim().toUpperCase().startsWith('TO ') ||
                      lines[0].trim().toUpperCase().startsWith('PARA ');
    const isMultiLine = lines.length > 1 && !isToBlock;

    if (isMultiLine) {
      let linesHtml = '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        linesHtml += `    <div class="logo-line" data-code="${attr(trimmed)}">
      <code>${esc(trimmed)}</code>
      <button class="logo-run-line" title="Ejecutar esta l\u00ednea">&#9654;</button>
    </div>\n`;
      }
      return `<div class="logo-block logo-block--multi" data-code="${attr(code)}">
  <div class="logo-lines">
${linesHtml}  </div>
  <div class="logo-toolbar">
    <button class="logo-run-btn" title="Ejecutar todo">Ejecutar</button>
  </div>
</div>\n`;
    }

    return `<div class="logo-block" data-code="${attr(code)}">
  <pre><code>${esc(code)}</code></pre>
  <div class="logo-toolbar">
    <button class="logo-run-btn" title="Ejecutar">Ejecutar</button>
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
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents for slugs
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
