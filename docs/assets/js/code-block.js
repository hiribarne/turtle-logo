/**
 * Turtle Logo — Interactive Code Block Controller
 * One shared LogoRuntime across the entire book (persists procedures via localStorage).
 * Multi-line blocks have per-line Run buttons.
 * Supports TO...END collection across separate code blocks (Chapter 15 pattern).
 */

import { LogoRuntime, saveProcedures } from './logo/index.js';
import { ShapeEditor } from './shape-editor.js';

const drawingCanvas = document.getElementById('chapter-drawing');
const spriteCanvas = document.getElementById('chapter-sprite');
const canvasWrap = document.getElementById('chapter-canvas-wrap');
const outputEl = document.getElementById('chapter-output');
const resetBtn = document.getElementById('chapter-reset');

if (drawingCanvas && spriteCanvas) {
  let editorOverlay = null;

  function print(text) {
    outputEl.textContent += text + '\n';
    outputEl.scrollTop = outputEl.scrollHeight;
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
        print(`Shape ${shapeName} saved!`);
      } else {
        print('Turtle shape updated!');
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
    persist: true,
  });

  // -- TO...END collection mode (mirrors playground behavior) --
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
    // Scroll canvas into view if not visible
    const rect = canvasWrap.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      canvasWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Highlight briefly
    if (sourceEl) {
      sourceEl.classList.add('logo-block--active');
      setTimeout(() => sourceEl.classList.remove('logo-block--active'), 600);
    }

    // Process each line (supports TO...END across blocks)
    const lines = code.split('\n');
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;

      if (toMode) {
        if (line.toUpperCase() === 'END') {
          const body = toBody.join(' ');
          runtime.procedures[toName] = [toParams, body];
          saveProcedures(runtime.procedures);
          print(`OK! I learned ${toName}.`);
          toMode = false;
        } else {
          toBody.push(line);
          print(`  | ${line}`);
        }
        continue;
      }

      if (line.toUpperCase().startsWith('TO ')) {
        const parts = line.split(/\s+/);
        if (parts.length < 2) {
          print('Oops! TO needs a name. Example: TO SQUARE');
          continue;
        }
        toName = parts[1].toUpperCase();
        toParams = parts.slice(2).map(p => p.replace(/^:/, ''));
        toBody = [];
        toMode = true;
        print(`  (Now type the body of ${toName}. Type END when done.)`);
        continue;
      }

      const err = runtime.run(line);
      if (err) print(err);
    }
  }

  // Wire up block-level Run / Run All buttons
  document.querySelectorAll('.logo-block').forEach(block => {
    const code = block.dataset.code;
    const btn = block.querySelector('.logo-run-btn');
    if (btn && code) {
      btn.addEventListener('click', () => runCode(code, block));
    }
  });

  // Wire up per-line Run buttons
  document.querySelectorAll('.logo-line').forEach(line => {
    const code = line.dataset.code;
    const btn = line.querySelector('.logo-run-line');
    if (btn && code) {
      btn.addEventListener('click', () => runCode(code, line));
    }
  });
}
