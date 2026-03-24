/**
 * Turtle Logo — Interpreter
 * Bilingual command execution engine (English + Spanish).
 */

import { tokenize } from './tokenizer.js';
import {
  PEN_COLORS, BG_COLORS, HELP_TEXT,
  saveProcedures, saveShapes,
} from './state.js';
import { LogoTurtle } from './turtle.js';
import {
  resolveAlias, ALL_KNOWN_COMMANDS, msg,
  HELP_TEXT_ES, saveLanguage,
} from './i18n.js';
import { editDistance } from './state.js';

export class LogoError extends Error {
  constructor(msg) { super(msg); this.name = 'LogoError'; }
}

function evalExpr(tok, localVars, variables, lang) {
  const [kind, val] = tok;
  if (kind === 'W') {
    if (val.startsWith(':')) {
      const name = val.slice(1).toUpperCase();
      if (name in localVars) return localVars[name];
      if (name in variables) return variables[name];
      throw new LogoError(msg('unknownVar', lang, val.slice(1)));
    }
    const n = Number(val);
    if (!isNaN(n)) return n;
    throw new LogoError(msg('notANumber', lang, val));
  }
  throw new LogoError(msg('needNumberHere', lang));
}

/** Find closest known command within edit distance 2. */
function suggestCommand(unknown, procedures) {
  unknown = unknown.toUpperCase();
  const candidates = [...ALL_KNOWN_COMMANDS, ...Object.keys(procedures)];
  let best = null;
  let bestDist = 3;
  for (const cmd of candidates) {
    const d = editDistance(unknown, cmd);
    if (d < bestDist) {
      best = cmd;
      bestDist = d;
    }
  }
  return best;
}

export function execute(tokens, runtime, localVars) {
  if (!localVars) localVars = {};
  const t = runtime.turtle;
  let i = 0;

  // Use a getter so language changes mid-execution (IDIOMA) take effect immediately
  function L() { return runtime.language || 'en'; }

  function consume() { return tokens[i++]; }
  function needNum(cmd) {
    if (i >= tokens.length)
      throw new LogoError(msg('needNumber', L(), cmd));
    return evalExpr(consume(), localVars, runtime.variables, L());
  }
  function needBlock(cmd) {
    if (i >= tokens.length || tokens[i][0] !== '[')
      throw new LogoError(msg('needBlock', L(), cmd));
    return consume()[1];
  }
  function needWord(cmd) {
    if (i >= tokens.length || tokens[i][0] !== 'W')
      throw new LogoError(msg('needName', L(), cmd));
    return consume()[1];
  }

  while (i < tokens.length) {
    const tok = consume();
    if (tok[0] !== 'W') continue;
    const rawCmd = tok[1].toUpperCase();
    const cmd = resolveAlias(rawCmd);

    // -- MOTION --
    if (cmd === 'FD' || cmd === 'FORWARD') {
      t.forward(needNum(rawCmd));
    } else if (cmd === 'BK' || cmd === 'BACK' || cmd === 'BACKWARD') {
      t.backward(needNum(rawCmd));
    } else if (cmd === 'RT' || cmd === 'RIGHT') {
      t.right(needNum(rawCmd));
    } else if (cmd === 'LT' || cmd === 'LEFT') {
      t.left(needNum(rawCmd));
    } else if (cmd === 'HOME') {
      t.home();
    } else if (cmd === 'SETXY') {
      const x = needNum('SETXY');
      const y = needNum('SETXY');
      const wasDown = t.isdown();
      t.penup(); t.goto(x, y);
      if (wasDown) t.pendown();

    // -- PEN --
    } else if (cmd === 'PU' || cmd === 'PENUP') {
      t.penup();
    } else if (cmd === 'PD' || cmd === 'PENDOWN') {
      t.pendown();
    } else if (cmd === 'SETPC' || cmd === 'SETPENCOLOR' || cmd === 'COLOR') {
      const n = Math.floor(needNum(rawCmd));
      t.setpencolor(PEN_COLORS[((n % PEN_COLORS.length) + PEN_COLORS.length) % PEN_COLORS.length]);
    } else if (cmd === 'SETWIDTH') {
      t.setwidth(needNum('SETWIDTH'));

    // -- SCREEN --
    } else if (cmd === 'CS' || cmd === 'CLEARSCREEN') {
      t.clear();
      t.penDown = true;
      t.x = 0; t.y = 0; t.heading = 0;
      t.setpencolor('#32cd32');
      t.setwidth(2);
      t._drawCursor();
      if (runtime.onSetBg) runtime.onSetBg('#000000');
    } else if (cmd === 'CLEAN') {
      t.clear();
    } else if (cmd === 'HT' || cmd === 'HIDETURTLE') {
      t.hideturtle();
    } else if (cmd === 'ST' || cmd === 'SHOWTURTLE') {
      t.showturtle();
    } else if (cmd === 'SETBG' || cmd === 'BGCOLOR') {
      const n = Math.floor(needNum(rawCmd));
      const color = BG_COLORS[((n % BG_COLORS.length) + BG_COLORS.length) % BG_COLORS.length];
      if (runtime.onSetBg) runtime.onSetBg(color);

    // -- CONTROL --
    } else if (cmd === 'REPEAT') {
      const count = Math.floor(needNum(rawCmd));
      const body = needBlock(rawCmd);
      const bodyTokens = tokenize(body);
      for (let r = 0; r < count; r++) {
        execute(bodyTokens, runtime, { ...localVars });
      }
    } else if (cmd === 'IF' || cmd === 'IFELSE') {
      const cond = needNum(rawCmd);
      const trueBlock = needBlock(rawCmd);
      let falseBlock = null;
      if (i < tokens.length && tokens[i][0] === '[') {
        falseBlock = consume()[1];
      }
      if (cond !== 0) {
        execute(tokenize(trueBlock), runtime, { ...localVars });
      } else if (falseBlock) {
        execute(tokenize(falseBlock), runtime, { ...localVars });
      }
    } else if (cmd === 'MAKE') {
      const name = needWord(rawCmd).toUpperCase().replace(/^"/, '');
      const val = needNum(rawCmd);
      runtime.variables[name] = val;
    } else if (cmd === 'STOP') {
      return;

    } else if (cmd === 'PRINT') {
      if (i < tokens.length) {
        const tok2 = consume();
        if (tok2[0] === '[') {
          runtime.print(tok2[1]);
        } else {
          try {
            runtime.print(String(evalExpr(tok2, localVars, runtime.variables, L())));
          } catch (e) {
            runtime.print(tok2[1]);
          }
        }
      }
    } else if (cmd === 'SUM') {
      const a = needNum(rawCmd);
      const b = needNum(rawCmd);
      runtime.print(`= ${a + b}`);
    } else if (cmd === 'TO') {
      throw new LogoError(msg('useToAlone', L()));

    } else if (cmd === 'FORGET') {
      const name = needWord(rawCmd).toUpperCase();
      if (name in runtime.procedures) {
        delete runtime.procedures[name];
        saveProcedures(runtime.procedures);
        runtime.print(msg('forgot', L(), name));
      } else {
        runtime.print(msg('noProc', L(), name));
      }

    // -- LANGUAGE --
    } else if (cmd === 'LANGUAGE' || rawCmd === 'IDIOMA') {
      if (i < tokens.length && tokens[i][0] === 'W') {
        const choice = consume()[1].toUpperCase();
        if (choice === 'ESPAÑOL' || choice === 'ESPANOL' || choice === 'ES' || choice === 'SPANISH') {
          runtime.language = 'es';
          saveLanguage('es');
          runtime.print(msg('langSet', 'es'));
        } else if (choice === 'ENGLISH' || choice === 'EN' || choice === 'INGLES' || choice === 'INGLÉS') {
          runtime.language = 'en';
          saveLanguage('en');
          runtime.print(msg('langSet', 'en'));
        } else {
          runtime.print(msg('langUsage', L()));
        }
      } else {
        runtime.print(msg('langUsage', L()));
      }
      if (runtime.onLanguageChange) runtime.onLanguageChange(runtime.language);

    // -- SHAPE COMMANDS --
    } else if (cmd === 'SETSHAPE') {
      const name = needWord('SETSHAPE').toUpperCase();
      if (name === 'TURTLE' || name === 'TORTUGA') {
        t.setBitmap(LogoTurtle.DEFAULT_BITMAP);
        runtime.print(msg('shapeSet', L(), 'TURTLE'));
      } else if (name in runtime.shapes) {
        t.setBitmap(runtime.shapes[name]);
        runtime.print(msg('shapeSet', L(), name));
      } else {
        runtime.print(msg('noShape', L(), name));
      }
    } else if (cmd === 'EDITSHAPE') {
      let shapeName = null;
      if (i < tokens.length && tokens[i][0] === 'W') {
        shapeName = consume()[1].toUpperCase();
      }
      let initial;
      if (shapeName && shapeName in runtime.shapes) {
        initial = runtime.shapes[shapeName];
      } else {
        initial = t.bitmap;
      }
      if (runtime.onEditShape) {
        runtime.onEditShape(initial, shapeName);
      } else {
        runtime.print(msg('shapeNoEditor', L()));
      }
    } else if (cmd === 'SHAPES') {
      const names = Object.keys(runtime.shapes);
      if (names.length > 0) {
        runtime.print(msg('shapesTitle', L()));
        for (const name of names) runtime.print(`  ${name}`);
        runtime.print(msg('shapesUse', L()));
      } else {
        runtime.print(msg('noShapes', L()));
      }
    } else if (cmd === 'DEMO') {
      runDemo(runtime);

    } else if (cmd in runtime.procedures) {
      const [paramNames, body] = runtime.procedures[cmd];
      const callVars = { ...localVars };
      for (const p of paramNames) {
        callVars[p.toUpperCase()] = needNum(cmd);
      }
      execute(tokenize(body), runtime, callVars);
    } else if (rawCmd in runtime.procedures) {
      // Also check the raw (un-aliased) command for user procedures
      const [paramNames, body] = runtime.procedures[rawCmd];
      const callVars = { ...localVars };
      for (const p of paramNames) {
        callVars[p.toUpperCase()] = needNum(rawCmd);
      }
      execute(tokenize(body), runtime, callVars);

    } else if (cmd === 'HELP') {
      if (i < tokens.length && tokens[i][0] === 'W') {
        const topic = consume()[1].toUpperCase();
        const helpMap = L() === 'es' ? HELP_TEXT_ES : HELP_TEXT;
        runtime.print(helpMap[topic] || helpMap['']);
      } else {
        const helpMap = L() === 'es' ? HELP_TEXT_ES : HELP_TEXT;
        runtime.print(helpMap['']);
      }
    } else if (cmd === 'BYE') {
      runtime.print(msg('bye', L()));
      return;
    } else if (cmd === 'PROCS') {
      const names = Object.keys(runtime.procedures);
      if (names.length > 0) {
        runtime.print(msg('procsTitle', L()));
        for (const name of names) {
          const [params] = runtime.procedures[name];
          const args = params.map(p => `:${p}`).join(' ');
          runtime.print(`  ${name} ${args}`);
        }
      } else {
        runtime.print(msg('noProcs', L()));
      }
    } else if (cmd === 'POS') {
      const [x, y] = t.pos();
      const h = t.getHeading();
      runtime.print(msg('posMsg', L(), Math.round(x), Math.round(y), Math.round(h)));
    } else if (cmd === '' || cmd === 'END') {
      // skip
    } else {
      const suggestion = suggestCommand(tok[1], runtime.procedures);
      if (suggestion) {
        throw new LogoError(msg('unknownMean', L(), tok[1], suggestion));
      } else {
        throw new LogoError(msg('unknownCmd', L(), tok[1]));
      }
    }
  }
}

/** Draw a colorful spiral-of-squares pattern. */
export function runDemo(runtime) {
  runtime.print(msg('demoWatch', runtime.language || 'en'));
  let demo = 'CS HT ';
  for (let step = 0; step < 36; step++) {
    const colorNum = (step % 11) + 1;
    const size = 60 + step * 3;
    demo += `SETPC ${colorNum} `;
    demo += `REPEAT 4 [FD ${size} RT 90] `;
    demo += 'RT 10 ';
  }
  demo += 'ST HOME';
  execute(tokenize(demo), runtime);
  runtime.print(msg('demoDone', runtime.language || 'en'));
}
