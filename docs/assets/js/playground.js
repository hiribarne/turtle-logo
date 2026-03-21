/**
 * Turtle Logo — Playground
 * Full browser-based interpreter matching the Python/tkinter app.
 */

import { LogoRuntime, LogoTurtle, saveProcedures } from './logo/index.js';
import { ShapeEditor } from './shape-editor.js';

const output = document.getElementById('output');
const input = document.getElementById('cmd-input');
const drawingCanvas = document.getElementById('drawing-canvas');
const spriteCanvas = document.getElementById('sprite-canvas');
const canvasWrap = document.getElementById('canvas-wrap');

function printOutput(text) {
  const line = document.createElement('div');
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

const runtime = new LogoRuntime(drawingCanvas, spriteCanvas, {
  onPrint: printOutput,
  onSetBg(color) {
    canvasWrap.style.backgroundColor = color;
  },
  onEditShape(initial, shapeName) {
    openShapeEditor(initial, shapeName);
  },
  persist: true,
});

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
      printOutput(`Shape ${shapeName} saved!`);
    } else {
      printOutput('Turtle shape updated!');
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

// -- TO...END collection mode --

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

  // TO...END collection
  if (toMode) {
    if (line.toUpperCase() === 'END') {
      const body = toBody.join(' ');
      runtime.procedures[toName] = [toParams, body];
      saveProcedures(runtime.procedures);
      printOutput(`OK! I learned ${toName}.`);
      toMode = false;
    } else {
      toBody.push(line);
      printOutput(`  | ${line}`);
    }
    return;
  }

  if (line.startsWith(';')) return;

  // Start TO definition
  if (line.toUpperCase().startsWith('TO ')) {
    const parts = line.split(/\s+/);
    if (parts.length < 2) {
      printOutput('Oops! TO needs a name. Example: TO SQUARE');
      return;
    }
    toName = parts[1].toUpperCase();
    toParams = parts.slice(2).map(p => p.replace(/^:/, ''));
    toBody = [];
    toMode = true;
    printOutput(`  (Now type the body of ${toName}. Type END when done.)`);
    return;
  }

  // Normal execution
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

// Tell turtle the logical canvas size (CSS pixels, before DPR scaling)
if (window._canvasLogicalWidth) {
  runtime.turtle.setLogicalSize(window._canvasLogicalWidth, window._canvasLogicalHeight);
  runtime.turtle._drawCursor();
}
window._logoRuntime = runtime;

printOutput("Turtle Logo \u2014 Your Turtle is ready.");
printOutput('Type HELP to see commands.');

// Report loaded procedures
const procNames = Object.keys(runtime.procedures);
if (procNames.length > 0) {
  printOutput(`Loaded ${procNames.length} saved procedure${procNames.length !== 1 ? 's' : ''}: ${procNames.join(', ')}`);
}

input.focus();
