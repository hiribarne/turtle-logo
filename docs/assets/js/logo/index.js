/**
 * Turtle Logo — Runtime
 * Public API wiring turtle + interpreter + state.
 */

import { LogoTurtle } from './turtle.js';
import { tokenize } from './tokenizer.js';
import { execute, LogoError } from './interpreter.js';
import { loadProcedures, loadShapes, saveProcedures, saveShapes } from './state.js';
import { loadLanguage, saveLanguage, resolveAlias, msg } from './i18n.js';

export { LogoTurtle } from './turtle.js';
export { tokenize } from './tokenizer.js';
export { execute, LogoError, runDemo } from './interpreter.js';
export {
  PEN_COLORS, BG_COLORS, KNOWN_COMMANDS, HELP_TEXT,
  saveProcedures, loadProcedures, saveShapes, loadShapes,
} from './state.js';
export { msg, loadLanguage, saveLanguage } from './i18n.js';

export class LogoRuntime {
  /**
   * @param {HTMLCanvasElement} drawingCanvas
   * @param {HTMLCanvasElement} spriteCanvas
   * @param {Object} opts
   * @param {function(string):void} opts.onPrint
   * @param {function(string):void} [opts.onSetBg]
   * @param {function(string[], string|null):void} [opts.onEditShape]
   * @param {function(string):void} [opts.onLanguageChange] - called when IDIOMA/LANGUAGE switches
   * @param {boolean} [opts.persist=false]
   */
  constructor(drawingCanvas, spriteCanvas, opts = {}) {
    this.turtle = new LogoTurtle(drawingCanvas, spriteCanvas);
    this.onPrint = opts.onPrint || (() => {});
    this.onSetBg = opts.onSetBg || null;
    this.onEditShape = opts.onEditShape || null;
    this.onLanguageChange = opts.onLanguageChange || null;
    this.persist = opts.persist || false;

    this.language = this.persist ? loadLanguage() : 'en';
    this.variables = {};
    this.procedures = this.persist ? loadProcedures() : {};
    this.shapes = this.persist ? loadShapes() : {};
  }

  print(text) { this.onPrint(text); }

  /**
   * Run a Logo command string. Handles TO/PARA...END/FIN definitions inline.
   */
  run(text) {
    try {
      const lines = text.split('\n');
      const toRun = [];
      let i = 0;
      while (i < lines.length) {
        const line = lines[i].trim();
        const upper = line.toUpperCase();
        // Match both TO and PARA
        if (upper.startsWith('TO ') || upper.startsWith('PARA ')) {
          const parts = line.split(/\s+/);
          const name = parts[1].toUpperCase();
          const params = parts.slice(2).map(p => p.replace(/^:/, ''));
          const bodyLines = [];
          i++;
          while (i < lines.length) {
            const endCheck = lines[i].trim().toUpperCase();
            if (endCheck === 'END' || endCheck === 'FIN') break;
            bodyLines.push(lines[i].trim());
            i++;
          }
          this.procedures[name] = [params, bodyLines.join(' ')];
          if (this.persist) saveProcedures(this.procedures);
          i++; // skip END/FIN
        } else {
          if (line) toRun.push(line);
          i++;
        }
      }
      for (const line of toRun) {
        execute(tokenize(line), this);
      }
      return null;
    } catch (e) {
      if (e instanceof LogoError) {
        return `${msg('oops', this.language)} ${e.message}`;
      }
      return msg('genericError', this.language);
    }
  }

  defineProc(name, params, body) {
    this.procedures[name.toUpperCase()] = [params, body];
  }

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

  saveShape(name, bitmap) {
    this.shapes[name.toUpperCase()] = bitmap;
    if (this.persist) saveShapes(this.shapes);
  }

  saveProcedures() {
    if (this.persist) saveProcedures(this.procedures);
  }
}
