/**
 * Turtle Logo — Interactive Code Block Controller
 * One shared bilingual LogoRuntime across the entire book.
 * Supports TO/PARA...END/FIN collection across separate code blocks.
 */

import { LogoRuntime, saveProcedures, msg } from './logo/index.js';
import { ShapeEditor } from './shape-editor.js';

const drawingCanvas = document.getElementById('chapter-drawing');
const spriteCanvas = document.getElementById('chapter-sprite');
const canvasWrap = document.getElementById('chapter-canvas-wrap');
const outputEl = document.getElementById('chapter-output');
const resetBtn = document.getElementById('chapter-reset');
const langBtn = document.getElementById('chapter-lang-btn');

if (drawingCanvas && spriteCanvas) {
  let editorOverlay = null;

  function print(text) {
    outputEl.textContent += text + '\n';
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function updateLangButton() {
    if (langBtn) {
      langBtn.textContent = runtime.language === 'es' ? 'EN' : 'ES';
      langBtn.title = runtime.language === 'es' ? 'Switch to English' : 'Cambiar a Español';
    }
  }

  function openShapeEditor(initialBitmap, shapeName) {
    if (editorOverlay) editorOverlay.remove();
    editorOverlay = document.createElement('div');
    editorOverlay.className = 'shape-editor-overlay';

    const panel = document.createElement('div');
    panel.className = 'shape-editor-panel';
    editorOverlay.appendChild(panel);

    const title = document.createElement('h3');
    title.textContent = shapeName ? `Shape Editor \u2014 ${shapeName}` : 'Shape Editor';
    panel.appendChild(title);

    const editor = new ShapeEditor(panel, initialBitmap);

    const btnRow = document.createElement('div');
    btnRow.className = 'shape-editor-buttons';

    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.addEventListener('click', () => {
      const bitmap = editor.getBitmap();
      runtime.turtle.setBitmap(bitmap);
      if (shapeName) {
        runtime.saveShape(shapeName, bitmap);
        print(msg('shapeSaved', runtime.language, shapeName));
      } else {
        print(msg('shapeUpdated', runtime.language));
      }
      editorOverlay.remove();
      editorOverlay = null;
    });

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.addEventListener('click', () => editor.clear());

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
      editorOverlay.remove();
      editorOverlay = null;
    });

    btnRow.append(okBtn, clearBtn, cancelBtn);
    panel.appendChild(btnRow);
    document.body.appendChild(editorOverlay);
  }

  const runtime = new LogoRuntime(drawingCanvas, spriteCanvas, {
    onPrint: print,
    onSetBg(color) {
      canvasWrap.style.backgroundColor = color;
    },
    onEditShape(initial, shapeName) {
      openShapeEditor(initial, shapeName);
    },
    onLanguageChange() {
      updateLangButton();
    },
    persist: true,
  });

  // Language button
  if (langBtn) {
    updateLangButton();
    langBtn.addEventListener('click', () => {
      const newLang = runtime.language === 'es' ? 'en' : 'es';
      runtime.run(newLang === 'es' ? 'IDIOMA ESPAÑOL' : 'LANGUAGE ENGLISH');
    });
  }

  // -- TO/PARA...END/FIN collection mode --
  let toMode = false;
  let toName = '';
  let toParams = [];
  let toBody = [];

  // Reset button
  resetBtn.addEventListener('click', () => {
    runtime.reset();
    canvasWrap.style.backgroundColor = '#000';
    outputEl.textContent = '';
    toMode = false;
  });

  function runCode(code, sourceEl) {
    const rect = canvasWrap.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      canvasWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (sourceEl) {
      sourceEl.classList.add('logo-block--active');
      setTimeout(() => sourceEl.classList.remove('logo-block--active'), 600);
    }

    const lines = code.split('\n');
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;

      if (toMode) {
        const upper = line.toUpperCase();
        if (upper === 'END' || upper === 'FIN') {
          const body = toBody.join(' ');
          runtime.procedures[toName] = [toParams, body];
          saveProcedures(runtime.procedures);
          print(msg('toLearned', runtime.language, toName));
          toMode = false;
        } else {
          toBody.push(line);
          print(`  | ${line}`);
        }
        continue;
      }

      const upper = line.toUpperCase();
      if (upper.startsWith('TO ') || upper.startsWith('PARA ')) {
        const parts = line.split(/\s+/);
        if (parts.length < 2) {
          print(msg('toNeedName', runtime.language));
          continue;
        }
        toName = parts[1].toUpperCase();
        toParams = parts.slice(2).map(p => p.replace(/^:/, ''));
        toBody = [];
        toMode = true;
        print(msg('toCollecting', runtime.language, toName));
        continue;
      }

      const err = runtime.run(line);
      if (err) print(err);
    }
  }

  document.querySelectorAll('.logo-block').forEach(block => {
    const code = block.dataset.code;
    const btn = block.querySelector('.logo-run-btn');
    if (btn && code) {
      btn.addEventListener('click', () => runCode(code, block));
    }
  });

  document.querySelectorAll('.logo-line').forEach(line => {
    const code = line.dataset.code;
    const btn = line.querySelector('.logo-run-line');
    if (btn && code) {
      btn.addEventListener('click', () => runCode(code, line));
    }
  });
}
