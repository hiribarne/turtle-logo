/**
 * Turtle Logo — Runtime
 * Public API wiring turtle + interpreter + state.
 */

import { LogoTurtle } from './turtle.js';
import { tokenize } from './tokenizer.js';
import { execute, LogoError } from './interpreter.js';
import { loadProcedures, loadShapes, saveProcedures, saveShapes } from './state.js';

export { LogoTurtle } from './turtle.js';
export { tokenize } from './tokenizer.js';
export { execute, LogoError, runDemo } from './interpreter.js';
export {
  PEN_COLORS, BG_COLORS, KNOWN_COMMANDS, HELP_TEXT,
  saveProcedures, loadProcedures, saveShapes, loadShapes,
} from './state.js';

export class LogoRuntime {
  /**
   * @param {HTMLCanvasElement} drawingCanvas
   * @param {HTMLCanvasElement} spriteCanvas
   * @param {Object} opts
   * @param {function(string):void} opts.onPrint - called for output text
   * @param {function(string):void} [opts.onSetBg] - called for SETBG
   * @param {function(string[], string|null):void} [opts.onEditShape] - called for EDITSHAPE
   * @param {boolean} [opts.persist=false] - use localStorage for procedures/shapes
   */
  constructor(drawingCanvas, spriteCanvas, opts = {}) {
    this.turtle = new LogoTurtle(drawingCanvas, spriteCanvas);
    this.onPrint = opts.onPrint || (() => {});
    this.onSetBg = opts.onSetBg || null;
    this.onEditShape = opts.onEditShape || null;
    this.persist = opts.persist || false;

    this.variables = {};
    this.procedures = this.persist ? loadProcedures() : {};
    this.shapes = this.persist ? loadShapes() : {};
  }

  /** Print a message to the output. */
  print(text) {
    this.onPrint(text);
  }

  /**
   * Run a Logo command string. Handles TO...END definitions inline.
   * Returns null on success, error message on failure.
   */
  run(text) {
    try {
      // Pre-process: extract TO...END definitions from multi-line input
      const lines = text.split('\n');
      const toRun = [];
      let i = 0;
      while (i < lines.length) {
        const line = lines[i].trim();
        if (line.toUpperCase().startsWith('TO ')) {
          const parts = line.split(/\s+/);
          const name = parts[1].toUpperCase();
          const params = parts.slice(2).map(p => p.replace(/^:/, ''));
          const bodyLines = [];
          i++;
          while (i < lines.length && lines[i].trim().toUpperCase() !== 'END') {
            bodyLines.push(lines[i].trim());
            i++;
          }
          this.procedures[name] = [params, bodyLines.join(' ')];
          if (this.persist) saveProcedures(this.procedures);
          i++; // skip END
        } else {
          if (line) toRun.push(line);
          i++;
        }
      }

      // Execute remaining non-TO lines
      for (const line of toRun) {
        const tokens = tokenize(line);
        execute(tokens, this);
      }
      return null;
    } catch (e) {
      if (e instanceof LogoError) {
        return `Oops! ${e.message}`;
      }
      return 'Hmm, something didn\'t work. Check your command and try again!';
    }
  }

  /** Define a procedure directly (used for loading deps in code blocks). */
  defineProc(name, params, body) {
    this.procedures[name.toUpperCase()] = [params, body];
  }

  /** Reset turtle, clear canvas, reset state. */
  reset() {
    this.turtle.clear();
    this.turtle.penDown = true;
    this.turtle.x = 0;
    this.turtle.y = 0;
    this.turtle.heading = 0;
    this.turtle.penColor = '#32cd32';
    this.turtle.penWidth = 2;
    this.turtle.visible = true;
    this.turtle.bitmap = [...LogoTurtle.DEFAULT_BITMAP];
    this.turtle.pixels = LogoTurtle.bitmapToPixels(this.turtle.bitmap);
    this.turtle._drawCursor();
    this.variables = {};
  }

  /** Save a shape and persist. */
  saveShape(name, bitmap) {
    this.shapes[name.toUpperCase()] = bitmap;
    if (this.persist) saveShapes(this.shapes);
  }

  /** Save procedures and persist. */
  saveProcedures() {
    if (this.persist) saveProcedures(this.procedures);
  }
}
