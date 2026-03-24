/**
 * Turtle Logo — Playground
 * Full browser-based bilingual interpreter.
 */

import { LogoRuntime, LogoTurtle, saveProcedures, msg } from './logo/index.js';
import { ShapeEditor } from './shape-editor.js';

const output = document.getElementById('output');
const input = document.getElementById('cmd-input');
const drawingCanvas = document.getElementById('drawing-canvas');
const spriteCanvas = document.getElementById('sprite-canvas');
const canvasWrap = document.getElementById('canvas-wrap');
const langBtn = document.getElementById('lang-btn');

function printOutput(text) {
  const line = document.createElement('div');
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function updateLangButton() {
  if (langBtn) {
    langBtn.textContent = runtime.language === 'es' ? 'EN' : 'ES';
    langBtn.title = runtime.language === 'es' ? 'Switch to English' : 'Cambiar a Español';
  }
}

const runtime = new LogoRuntime(drawingCanvas, spriteCanvas, {
  onPrint: printOutput,
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

// -- Shape editor --

let editorOverlay = null;

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
      printOutput(msg('shapeSaved', runtime.language, shapeName));
    } else {
      printOutput(msg('shapeUpdated', runtime.language));
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

// -- Command history --

const history = [];
let historyPos = 0;

// -- TO/PARA...END/FIN collection mode --

let toMode = false;
let toName = '';
let toParams = [];
let toBody = [];

function handleInput() {
  const line = input.value.trim();
  input.value = '';
  if (!line) return;

  history.push(line);
  historyPos = history.length;
  printOutput(`?> ${line}`);

  if (toMode) {
    const upper = line.toUpperCase();
    if (upper === 'END' || upper === 'FIN') {
      const body = toBody.join(' ');
      runtime.procedures[toName] = [toParams, body];
      saveProcedures(runtime.procedures);
      printOutput(msg('toLearned', runtime.language, toName));
      toMode = false;
    } else {
      toBody.push(line);
      printOutput(`  | ${line}`);
    }
    return;
  }

  if (line.startsWith(';')) return;

  const upper = line.toUpperCase();
  if (upper.startsWith('TO ') || upper.startsWith('PARA ')) {
    const parts = line.split(/\s+/);
    if (parts.length < 2) {
      printOutput(msg('toNeedName', runtime.language));
      return;
    }
    toName = parts[1].toUpperCase();
    toParams = parts.slice(2).map(p => p.replace(/^:/, ''));
    toBody = [];
    toMode = true;
    printOutput(msg('toCollecting', runtime.language, toName));
    return;
  }

  const err = runtime.run(line);
  if (err) printOutput(err);
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleInput();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (history.length && historyPos > 0) {
      historyPos--;
      input.value = history[historyPos];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyPos < history.length - 1) {
      historyPos++;
      input.value = history[historyPos];
    } else {
      historyPos = history.length;
      input.value = '';
    }
  }
});

// -- Startup --

if (window._canvasLogicalWidth) {
  runtime.turtle.setLogicalSize(window._canvasLogicalWidth, window._canvasLogicalHeight);
  runtime.turtle._drawCursor();
}
window._logoRuntime = runtime;

printOutput(msg('ready', runtime.language));
printOutput(msg('helpHint', runtime.language));

const procNames = Object.keys(runtime.procedures);
if (procNames.length > 0) {
  printOutput(msg('loadedProcs', runtime.language, procNames.length, procNames.join(', ')));
}

input.focus();
