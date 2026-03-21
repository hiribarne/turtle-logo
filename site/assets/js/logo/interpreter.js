/**
 * Turtle Logo — Interpreter
 * Command execution engine. Port of logo.py execute() and eval_expr().
 */

import { tokenize } from './tokenizer.js';
import {
  PEN_COLORS, BG_COLORS, HELP_TEXT,
  suggestCommand, saveProcedures, saveShapes,
} from './state.js';
import { LogoTurtle } from './turtle.js';

export class LogoError extends Error {
  constructor(msg) { super(msg); this.name = 'LogoError'; }
}

/**
 * Evaluate a token as a number. Supports :var references.
 */
function evalExpr(tok, localVars, variables) {
  const [kind, val] = tok;
  if (kind === 'W') {
    if (val.startsWith(':')) {
      const name = val.slice(1).toUpperCase();
      if (name in localVars) return localVars[name];
      if (name in variables) return variables[name];
      throw new LogoError(`I don't know a variable called :${val.slice(1)}. Did you MAKE it first?`);
    }
    const n = Number(val);
    if (!isNaN(n)) return n;
    throw new LogoError(`I need a number, but got '${val}'. Try using a number like 50 or 100.`);
  }
  throw new LogoError('I need a number here. Try something like: FD 50');
}

/**
 * Execute a token list.
 * @param {Array} tokens
 * @param {import('./index.js').LogoRuntime} runtime
 * @param {Object} localVars
 */
export function execute(tokens, runtime, localVars) {
  if (!localVars) localVars = {};
  const t = runtime.turtle;
  let i = 0;

  function consume() {
    return tokens[i++];
  }
  function needNum(cmd) {
    if (i >= tokens.length)
      throw new LogoError(`${cmd} needs a number after it. Try: ${cmd} 50`);
    return evalExpr(consume(), localVars, runtime.variables);
  }
  function needBlock(cmd) {
    if (i >= tokens.length || tokens[i][0] !== '[')
      throw new LogoError(`${cmd} needs a [ list ] after it. Example: REPEAT 4 [FD 50 RT 90]`);
    return consume()[1];
  }
  function needWord(cmd) {
    if (i >= tokens.length || tokens[i][0] !== 'W')
      throw new LogoError(`${cmd} needs a name after it.`);
    return consume()[1];
  }

  while (i < tokens.length) {
    const tok = consume();
    if (tok[0] !== 'W') continue;
    const cmd = tok[1].toUpperCase();

    // -- MOTION --
    if (cmd === 'FD' || cmd === 'FORWARD') {
      t.forward(needNum('FD'));
    } else if (cmd === 'BK' || cmd === 'BACK' || cmd === 'BACKWARD') {
      t.backward(needNum('BK'));
    } else if (cmd === 'RT' || cmd === 'RIGHT') {
      t.right(needNum('RT'));
    } else if (cmd === 'LT' || cmd === 'LEFT') {
      t.left(needNum('LT'));
    } else if (cmd === 'HOME') {
      t.home();
    } else if (cmd === 'SETXY') {
      const x = needNum('SETXY');
      const y = needNum('SETXY');
      const wasDown = t.isdown();
      t.penup();
      t.goto(x, y);
      if (wasDown) t.pendown();

    // -- PEN --
    } else if (cmd === 'PU' || cmd === 'PENUP') {
      t.penup();
    } else if (cmd === 'PD' || cmd === 'PENDOWN') {
      t.pendown();
    } else if (cmd === 'SETPC' || cmd === 'SETPENCOLOR' || cmd === 'COLOR') {
      const n = Math.floor(needNum('SETPC'));
      t.setpencolor(PEN_COLORS[((n % PEN_COLORS.length) + PEN_COLORS.length) % PEN_COLORS.length]);
    } else if (cmd === 'SETWIDTH') {
      t.setwidth(needNum('SETWIDTH'));

    // -- SCREEN --
    } else if (cmd === 'CS' || cmd === 'CLEARSCREEN') {
      t.clear();
      t.penDown = true;
      t.x = 0;
      t.y = 0;
      t.heading = 0;
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
      const n = Math.floor(needNum('SETBG'));
      const color = BG_COLORS[((n % BG_COLORS.length) + BG_COLORS.length) % BG_COLORS.length];
      if (runtime.onSetBg) runtime.onSetBg(color);

    // -- CONTROL --
    } else if (cmd === 'REPEAT') {
      const count = Math.floor(needNum('REPEAT'));
      const body = needBlock('REPEAT');
      const bodyTokens = tokenize(body);
      for (let r = 0; r < count; r++) {
        execute(bodyTokens, runtime, { ...localVars });
      }
    } else if (cmd === 'IF' || cmd === 'IFELSE') {
      const cond = needNum('IF');
      const trueBlock = needBlock('IF');
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
      const name = needWord('MAKE').toUpperCase().replace(/^"/, '');
      const val = needNum('MAKE');
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
            runtime.print(String(evalExpr(tok2, localVars, runtime.variables)));
          } catch (e) {
            runtime.print(tok2[1]);
          }
        }
      }
    } else if (cmd === 'SUM') {
      const a = needNum('SUM');
      const b = needNum('SUM');
      runtime.print(`= ${a + b}`);
    } else if (cmd === 'TO') {
      throw new LogoError('Use TO at the start of a line by itself. See HELP TO.');

    } else if (cmd === 'FORGET') {
      const name = needWord('FORGET').toUpperCase();
      if (name in runtime.procedures) {
        delete runtime.procedures[name];
        saveProcedures(runtime.procedures);
        runtime.print(`OK, I forgot ${name}.`);
      } else {
        runtime.print(`I don't know a procedure called ${name}.`);
      }

    // -- SHAPE COMMANDS --
    } else if (cmd === 'SETSHAPE') {
      const name = needWord('SETSHAPE').toUpperCase();
      if (name === 'TURTLE') {
        t.setBitmap(LogoTurtle.DEFAULT_BITMAP);
        runtime.print('Shape set to TURTLE.');
      } else if (name in runtime.shapes) {
        t.setBitmap(runtime.shapes[name]);
        runtime.print(`Shape set to ${name}.`);
      } else {
        runtime.print(`I don't know a shape called ${name}. Try SHAPES to see saved shapes.`);
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
        runtime.print('Shape editor is not available here.');
      }
    } else if (cmd === 'SHAPES') {
      const names = Object.keys(runtime.shapes);
      if (names.length > 0) {
        runtime.print('Saved shapes:');
        for (const name of names) runtime.print(`  ${name}`);
        runtime.print('Use SETSHAPE name to change the turtle.');
      } else {
        runtime.print('No saved shapes yet. Try EDITSHAPE STAR to make one!');
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

    } else if (cmd === 'HELP') {
      if (i < tokens.length && tokens[i][0] === 'W') {
        const topic = consume()[1].toUpperCase();
        runtime.print(HELP_TEXT[topic] || HELP_TEXT['']);
      } else {
        runtime.print(HELP_TEXT['']);
      }
    } else if (cmd === 'BYE') {
      runtime.print("Bye! Great drawing!");
      return;
    } else if (cmd === 'PROCS') {
      const names = Object.keys(runtime.procedures);
      if (names.length > 0) {
        runtime.print('Procedures you have made:');
        for (const name of names) {
          const [params] = runtime.procedures[name];
          const args = params.map(p => `:${p}`).join(' ');
          runtime.print(`  ${name} ${args}`);
        }
      } else {
        runtime.print('No procedures yet. Try making one with TO!');
      }
    } else if (cmd === 'POS') {
      const [x, y] = t.pos();
      const h = t.getHeading();
      runtime.print(`Turtle is at X=${Math.round(x)}, Y=${Math.round(y)}, heading=${Math.round(h)}`);
    } else if (cmd === '') {
      // skip
    } else {
      const suggestion = suggestCommand(tok[1], runtime.procedures);
      if (suggestion) {
        throw new LogoError(
          `I don't know ${tok[1]} \u2014 did you mean ${suggestion}? Try HELP to see commands.`
        );
      } else {
        throw new LogoError(
          `I don't know '${tok[1]}'. Try HELP to see all the commands you can use!`
        );
      }
    }
  }
}

/** Draw a colorful spiral-of-squares pattern. */
export function runDemo(runtime) {
  runtime.print('Watch this!');
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
  runtime.print("Cool, right? Try making your own patterns!");
}
