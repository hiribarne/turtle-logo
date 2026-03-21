/**
 * Turtle Logo — State
 * Colors, constants, help text, localStorage persistence.
 * Port of logo.py state/help sections.
 */

/** Pen colors (index 0-11) mapped to CSS hex values. */
export const PEN_COLORS = [
  '#ffffff', // 0 white
  '#ff0000', // 1 red
  '#32cd32', // 2 lime green
  '#ffff00', // 3 yellow
  '#00ffff', // 4 cyan
  '#ff00ff', // 5 magenta
  '#ffa500', // 6 orange
  '#87ceeb', // 7 sky blue
  '#ff69b4', // 8 hot pink
  '#ff7f50', // 9 coral
  '#ffd700', // 10 gold
  '#ee82ee', // 11 violet
];

/** Background colors (index 0-15) mapped to CSS hex values. */
export const BG_COLORS = [
  '#000000', // 0 black
  '#000080', // 1 navy
  '#006400', // 2 dark green
  '#008080', // 3 teal
  '#8b0000', // 4 dark red
  '#800080', // 5 purple
  '#a0522d', // 6 brown (saddle brown)
  '#808080', // 7 gray
  '#a9a9a9', // 8 dark gray
  '#0000ff', // 9 blue
  '#00ff00', // 10 green
  '#00ffff', // 11 cyan
  '#ff0000', // 12 red
  '#ff00ff', // 13 magenta
  '#ffff00', // 14 yellow
  '#ffffff', // 15 white
];

export const KNOWN_COMMANDS = [
  'FD', 'FORWARD', 'BK', 'BACK', 'BACKWARD', 'RT', 'RIGHT', 'LT', 'LEFT',
  'HOME', 'SETXY', 'PU', 'PENUP', 'PD', 'PENDOWN', 'SETPC', 'SETPENCOLOR',
  'COLOR', 'SETWIDTH', 'CS', 'CLEARSCREEN', 'CLEAN', 'HT', 'HIDETURTLE',
  'ST', 'SHOWTURTLE', 'SETBG', 'BGCOLOR', 'REPEAT', 'IF', 'IFELSE', 'MAKE',
  'STOP', 'PRINT', 'SUM', 'TO', 'HELP', 'BYE', 'PROCS', 'POS', 'FORGET',
  'DEMO', 'SETSHAPE', 'EDITSHAPE', 'SHAPES',
];

export const HELP_TEXT = {
  '': `COMMANDS YOU CAN USE:
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
MOVING THE TURTLE:
  FD 50        go forward 50 steps
  BK 50        go back 50 steps
  RT 90        turn right 90 degrees
  LT 90        turn left 90 degrees
  HOME         go back to the middle
  SETXY 0 0    go to any spot

PEN:
  PD           pen down (draw)
  PU           pen up (move without drawing)
  SETPC 3      set pen color (0\u201311)
  SETWIDTH 3   make lines thicker

SCREEN:
  CS           clear screen
  SETBG 5      set background color (0\u201315)
  HT           hide turtle
  ST           show turtle

REPEATING:
  REPEAT 4 [FD 50 RT 90]

MAKING PROCEDURES:
  TO SQUARE
  REPEAT 4 [FD 50 RT 90]
  END
  FORGET SQUARE  \u2014 forget a procedure

SHAPES:
  EDITSHAPE      open the shape editor
  EDITSHAPE STAR edit/create a named shape
  SETSHAPE STAR  use a saved shape
  SETSHAPE TURTLE  back to the turtle
  SHAPES       list saved shapes

OTHER:
  DEMO         see a cool pattern!
  PROCS        list your procedures
  POS          where is the turtle?
  HELP FD      help for one command
  BYE          quit
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`,
  'FD': 'FD (or FORWARD) n \u2014 move forward n steps.\nExample: FD 100',
  'FORWARD': 'FD (or FORWARD) n \u2014 move forward n steps.\nExample: FD 100',
  'BK': 'BK (or BACK) n \u2014 move backward n steps.\nExample: BK 50',
  'BACK': 'BK (or BACK) n \u2014 move backward n steps.\nExample: BK 50',
  'BACKWARD': 'BK (or BACK) n \u2014 move backward n steps.\nExample: BK 50',
  'RT': 'RT (or RIGHT) n \u2014 turn right n degrees.\nA full circle = 360. A square corner = 90.\nExample: RT 90',
  'RIGHT': 'RT (or RIGHT) n \u2014 turn right n degrees.\nA full circle = 360. A square corner = 90.\nExample: RT 90',
  'LT': 'LT (or LEFT) n \u2014 turn left n degrees.\nExample: LT 45',
  'LEFT': 'LT (or LEFT) n \u2014 turn left n degrees.\nExample: LT 45',
  'REPEAT': 'REPEAT n [ commands ] \u2014 do the commands n times.\nExample: REPEAT 4 [FD 50 RT 90]  draws a square.',
  'TO': 'TO name :param1 :param2\n  body commands\nEND\nMakes a new command you can use later.\nExample:\n  TO SQUARE :SIZE\n  REPEAT 4 [FD :SIZE RT 90]\n  END\nThen type: SQUARE 80',
  'SETPC': 'SETPC n \u2014 change the pen color.\n0=white  1=red  2=green  3=yellow\n4=cyan   5=pink 6=orange 7=sky blue\nExample: SETPC 3',
  'SETPENCOLOR': 'SETPC n \u2014 change the pen color.\n0=white  1=red  2=green  3=yellow\n4=cyan   5=pink 6=orange 7=sky blue\nExample: SETPC 3',
  'SETBG': 'SETBG n \u2014 change the background color.\n0=black  1=navy  2=dark green  3=teal\n4=dark red  5=purple  6=brown  7=gray\n8=dark gray  9=blue  10=green  11=cyan\n12=red  13=magenta  14=yellow  15=white\nExample: SETBG 1',
  'BGCOLOR': 'SETBG n \u2014 change the background color.\nExample: SETBG 1',
  'CS': 'CS (CLEARSCREEN) \u2014 erase everything and send turtle home.',
  'CLEARSCREEN': 'CS (CLEARSCREEN) \u2014 erase everything and send turtle home.',
  'PU': 'PU (PENUP) \u2014 lift the pen so moving does not draw.',
  'PENUP': 'PU (PENUP) \u2014 lift the pen so moving does not draw.',
  'PD': 'PD (PENDOWN) \u2014 put the pen down so moving draws a line.',
  'PENDOWN': 'PD (PENDOWN) \u2014 put the pen down so moving draws a line.',
  'HOME': 'HOME \u2014 send the turtle back to the center, pointing up.',
  'MAKE': 'MAKE "NAME value \u2014 store a number in a name.\nExample: MAKE "SIZE 100\nThen use :SIZE in commands.',
  'FORGET': 'FORGET name \u2014 forget a procedure you made with TO.\nExample: FORGET SQUARE',
  'DEMO': 'DEMO \u2014 watch the turtle draw a cool pattern!',
  'EDITSHAPE': 'EDITSHAPE or EDITSHAPE name \u2014 open the pixel editor.\nClick squares to draw your own turtle shape!\nExample: EDITSHAPE STAR',
  'SETSHAPE': 'SETSHAPE name \u2014 change the turtle to a saved shape.\nSETSHAPE TURTLE goes back to the default.\nExample: SETSHAPE STAR',
  'SHAPES': 'SHAPES \u2014 list all your saved shapes.',
  'HT': 'HT (HIDETURTLE) \u2014 hide the turtle. It still draws!',
  'HIDETURTLE': 'HT (HIDETURTLE) \u2014 hide the turtle. It still draws!',
  'ST': 'ST (SHOWTURTLE) \u2014 show the turtle again.',
  'SHOWTURTLE': 'ST (SHOWTURTLE) \u2014 show the turtle again.',
  'SETWIDTH': 'SETWIDTH n \u2014 set the pen thickness.\nExample: SETWIDTH 5',
  'SETXY': 'SETXY x y \u2014 move the turtle to position x, y.\nExample: SETXY 100 50',
  'POS': 'POS \u2014 shows the turtle position and heading.',
  'PROCS': 'PROCS \u2014 list all procedures you have made with TO.',
  'PRINT': 'PRINT value \u2014 print a value or [text] to the output.',
  'SUM': 'SUM a b \u2014 add two numbers and print the result.',
  'IF': 'IF condition [commands] \u2014 run commands if condition is not 0.',
  'IFELSE': 'IFELSE condition [true-commands] [false-commands]',
  'STOP': 'STOP \u2014 stop the current procedure.',
  'BYE': 'BYE \u2014 quit Turtle Logo.',
  'CLEAN': 'CLEAN \u2014 erase all drawings but keep the turtle where it is.',
};

/** Levenshtein edit distance. */
export function editDistance(a, b) {
  if (a.length < b.length) return editDistance(b, a);
  if (b.length === 0) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    const curr = [i + 1];
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      curr.push(Math.min(curr[j] + 1, prev[j + 1] + 1, prev[j] + cost));
    }
    prev = curr;
  }
  return prev[b.length];
}

/** Find closest known command within edit distance 2. */
export function suggestCommand(unknown, procedures) {
  unknown = unknown.toUpperCase();
  const candidates = [...KNOWN_COMMANDS, ...Object.keys(procedures)];
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

// -- localStorage persistence --

const PROCS_KEY = 'turtlelogo_procedures';
const SHAPES_KEY = 'turtlelogo_shapes';

export function saveProcedures(procedures) {
  try {
    localStorage.setItem(PROCS_KEY, JSON.stringify(procedures));
  } catch (e) { /* quota exceeded or unavailable */ }
}

export function loadProcedures() {
  try {
    const data = localStorage.getItem(PROCS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export function saveShapes(shapes) {
  try {
    localStorage.setItem(SHAPES_KEY, JSON.stringify(shapes));
  } catch (e) { /* quota exceeded or unavailable */ }
}

export function loadShapes() {
  try {
    const data = localStorage.getItem(SHAPES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}
