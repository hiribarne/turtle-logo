/**
 * Turtle Logo — Internationalization
 * Bilingual messages (English/Spanish) and command aliases.
 */

const LANG_KEY = 'turtlelogo_language';

/** Get saved language preference. */
export function loadLanguage() {
  try { return localStorage.getItem(LANG_KEY) || 'en'; }
  catch (e) { return 'en'; }
}

/** Save language preference. */
export function saveLanguage(lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
}

/**
 * Spanish aliases → canonical English command.
 * Both English and Spanish are always accepted.
 */
export const SPANISH_ALIASES = {
  // Motion
  'AD':             'FD',
  'ADELANTE':       'FD',
  'AT':             'BK',
  'ATRAS':          'BK',
  'DE':             'DE_DIRECTION', // handled specially — conflicts avoided below
  'DERECHA':        'RT',
  'IZ':             'LT',
  'IZQUIERDA':      'LT',
  'CENTRO':         'HOME',
  // Pen
  'SP':             'PU',
  'SINPLUMA':       'PU',
  'CP':             'PD',
  'CONPLUMA':       'PD',
  'FCOLORP':        'SETPC',
  // Screen
  'BP':             'CS',
  'BORRAPANTALLA':  'CS',
  'LIMPIAR':        'CLEAN',
  'OT':             'HT',
  'OCULTARTORTUGA': 'HT',
  'MT':             'ST',
  'MOSTRARTORTUGA': 'ST',
  'FCOLORF':        'SETBG',
  // Control
  'REPETIR':        'REPEAT',
  'REPITE':         'REPEAT',
  'SI':             'IF',
  'SISINO':         'IFELSE',
  'DA':             'MAKE',
  'ALTO':           'STOP',
  'ESCRIBE':        'PRINT',
  'ES':             'PRINT',
  'SUMA':           'SUM',
  // Procedures
  'PARA':           'TO',
  'FIN':            'END',
  'OLVIDAR':        'FORGET',
  // Utility
  'AYUDA':          'HELP',
  'ADIOS':          'BYE',
};

// Fix DE conflict: DE is DERECHA (right turn) in Spanish Logo
// We map it directly to RT
SPANISH_ALIASES['DE'] = 'RT';

/** Resolve a command: return canonical English command, or the original if not an alias. */
export function resolveAlias(cmd) {
  return SPANISH_ALIASES[cmd] || cmd;
}

/** All known commands (English + Spanish) for typo suggestion. */
export const ALL_KNOWN_COMMANDS = [
  'FD', 'FORWARD', 'BK', 'BACK', 'BACKWARD', 'RT', 'RIGHT', 'LT', 'LEFT',
  'HOME', 'SETXY', 'PU', 'PENUP', 'PD', 'PENDOWN', 'SETPC', 'SETPENCOLOR',
  'COLOR', 'SETWIDTH', 'CS', 'CLEARSCREEN', 'CLEAN', 'HT', 'HIDETURTLE',
  'ST', 'SHOWTURTLE', 'SETBG', 'BGCOLOR', 'REPEAT', 'IF', 'IFELSE', 'MAKE',
  'STOP', 'PRINT', 'SUM', 'TO', 'END', 'HELP', 'BYE', 'PROCS', 'POS', 'FORGET',
  'DEMO', 'SETSHAPE', 'EDITSHAPE', 'SHAPES', 'LANGUAGE', 'IDIOMA',
  // Spanish
  'AD', 'ADELANTE', 'AT', 'ATRAS', 'DE', 'DERECHA', 'IZ', 'IZQUIERDA',
  'CENTRO', 'SP', 'SINPLUMA', 'CP', 'CONPLUMA', 'FCOLORP', 'BP',
  'BORRAPANTALLA', 'LIMPIAR', 'OT', 'OCULTARTORTUGA', 'MT', 'MOSTRARTORTUGA',
  'FCOLORF', 'REPETIR', 'REPITE', 'SI', 'SISINO', 'DA', 'ALTO',
  'ESCRIBE', 'ES', 'SUMA', 'PARA', 'FIN', 'OLVIDAR', 'AYUDA', 'ADIOS',
];

// ─── Messages ────────────────────────────────────────────────────────────────

export const MSG = {
  // Startup
  ready:          { en: "Turtle Logo \u2014 Your Turtle is ready.",
                    es: "Turtle Logo \u2014 Tu Tortuga est\u00e1 lista." },
  helpHint:       { en: "Type HELP to see commands.",
                    es: "Escribe AYUDA para ver los comandos." },
  loadedProcs:    { en: (n, names) => `Loaded ${n} saved procedure${n !== 1 ? 's' : ''}: ${names}`,
                    es: (n, names) => `${n} procedimiento${n !== 1 ? 's' : ''} cargado${n !== 1 ? 's' : ''}: ${names}` },

  // Errors
  oops:           { en: 'Oops!', es: '\u00a1Ups!' },
  genericError:   { en: "Hmm, something didn't work. Check your command and try again!",
                    es: "\u00a1Hmm, algo no funcion\u00f3! Revisa tu comando e int\u00e9ntalo de nuevo." },
  needNumber:     { en: (cmd) => `${cmd} needs a number after it. Try: ${cmd} 50`,
                    es: (cmd) => `${cmd} necesita un n\u00famero. Prueba: ${cmd} 50` },
  needBlock:      { en: (cmd) => `${cmd} needs a [ list ] after it. Example: REPEAT 4 [FD 50 RT 90]`,
                    es: (cmd) => `${cmd} necesita una [ lista ]. Ejemplo: REPETIR 4 [AD 50 DE 90]` },
  needName:       { en: (cmd) => `${cmd} needs a name after it.`,
                    es: (cmd) => `${cmd} necesita un nombre.` },
  unknownVar:     { en: (v) => `I don't know a variable called :${v}. Did you MAKE it first?`,
                    es: (v) => `No conozco una variable llamada :${v}. \u00bfLa creaste con DA?` },
  notANumber:     { en: (v) => `I need a number, but got '${v}'. Try using a number like 50 or 100.`,
                    es: (v) => `Necesito un n\u00famero, pero recib\u00ed '${v}'. Prueba con un n\u00famero como 50 o 100.` },
  needNumberHere: { en: "I need a number here. Try something like: FD 50",
                    es: "Necesito un n\u00famero aqu\u00ed. Prueba algo como: AD 50" },
  useToAlone:     { en: "Use TO at the start of a line by itself. See HELP TO.",
                    es: "Usa PARA al inicio de una l\u00ednea. Escribe AYUDA PARA." },

  // Unknown command
  unknownMean:    { en: (w, s) => `I don't know ${w} \u2014 did you mean ${s}? Try HELP to see commands.`,
                    es: (w, s) => `No conozco ${w} \u2014 \u00bfquisiste decir ${s}? Escribe AYUDA para ver los comandos.` },
  unknownCmd:     { en: (w) => `I don't know '${w}'. Try HELP to see all the commands you can use!`,
                    es: (w) => `No conozco '${w}'. \u00a1Escribe AYUDA para ver todos los comandos!` },

  // Procedure
  forgot:         { en: (n) => `OK, I forgot ${n}.`,
                    es: (n) => `OK, olvid\u00e9 ${n}.` },
  noProc:         { en: (n) => `I don't know a procedure called ${n}.`,
                    es: (n) => `No conozco un procedimiento llamado ${n}.` },
  procsTitle:     { en: 'Procedures you have made:',
                    es: 'Procedimientos que has creado:' },
  noProcs:        { en: 'No procedures yet. Try making one with TO!',
                    es: '\u00a1A\u00fan no hay procedimientos! Prueba crear uno con PARA.' },

  // Shapes
  shapeSet:       { en: (n) => `Shape set to ${n}.`,
                    es: (n) => `Forma cambiada a ${n}.` },
  noShape:        { en: (n) => `I don't know a shape called ${n}. Try SHAPES to see saved shapes.`,
                    es: (n) => `No conozco una forma llamada ${n}. Escribe SHAPES para ver las formas guardadas.` },
  shapesTitle:    { en: 'Saved shapes:',
                    es: 'Formas guardadas:' },
  shapesUse:      { en: 'Use SETSHAPE name to change the turtle.',
                    es: 'Usa SETSHAPE nombre para cambiar la tortuga.' },
  noShapes:       { en: 'No saved shapes yet. Try EDITSHAPE STAR to make one!',
                    es: '\u00a1A\u00fan no hay formas! Prueba EDITSHAPE STAR para crear una.' },
  shapeNoEditor:  { en: 'Shape editor is not available here.',
                    es: 'El editor de formas no est\u00e1 disponible aqu\u00ed.' },
  shapeSaved:     { en: (n) => `Shape ${n} saved!`,
                    es: (n) => `\u00a1Forma ${n} guardada!` },
  shapeUpdated:   { en: 'Turtle shape updated!',
                    es: '\u00a1Forma de la tortuga actualizada!' },

  // Position
  posMsg:         { en: (x, y, h) => `Turtle is at X=${x}, Y=${y}, heading=${h}`,
                    es: (x, y, h) => `La tortuga est\u00e1 en X=${x}, Y=${y}, rumbo=${h}` },

  // Demo
  demoWatch:      { en: 'Watch this!', es: '\u00a1Mira esto!' },
  demoDone:       { en: "Cool, right? Try making your own patterns!",
                    es: "\u00bfGenial, verdad? \u00a1Intenta hacer tus propios patrones!" },

  // Bye
  bye:            { en: 'Bye! Great drawing!',
                    es: '\u00a1Adi\u00f3s! \u00a1Gran dibujo!' },

  // TO mode
  toNeedName:     { en: 'Oops! TO needs a name. Example: TO SQUARE',
                    es: '\u00a1Ups! PARA necesita un nombre. Ejemplo: PARA CUADRADO' },
  toCollecting:   { en: (n) => `  (Now type the body of ${n}. Type END when done.)`,
                    es: (n) => `  (Ahora escribe el cuerpo de ${n}. Escribe FIN cuando termines.)` },
  toLearned:      { en: (n) => `OK! I learned ${n}.`,
                    es: (n) => `\u00a1OK! Aprend\u00ed ${n}.` },

  // Language
  langSet:        { en: 'Language set to English.',
                    es: 'Idioma cambiado a espa\u00f1ol.' },
  langUsage:      { en: "LANGUAGE EN or IDIOMA ES",
                    es: "LANGUAGE EN o IDIOMA ES" },
};

/**
 * Get a message in the current language.
 * @param {string} key - message key
 * @param {string} lang - 'en' or 'es'
 * @param {...any} args - arguments if the message is a function
 */
export function msg(key, lang, ...args) {
  const m = MSG[key];
  if (!m) return key;
  const val = m[lang] || m.en;
  return typeof val === 'function' ? val(...args) : val;
}

// ─── Help text (bilingual) ───────────────────────────────────────────────────

export const HELP_TEXT_ES = {
  '': `COMANDOS QUE PUEDES USAR:
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
MOVER LA TORTUGA:
  AD 50 (FD)     avanzar 50 pasos
  AT 50 (BK)     retroceder 50 pasos
  DE 90 (RT)     girar a la derecha 90 grados
  IZ 90 (LT)     girar a la izquierda 90 grados
  CENTRO (HOME)  volver al centro
  SETXY 0 0      ir a cualquier punto

PLUMA:
  CP (PD)        pluma abajo (dibuja)
  SP (PU)        pluma arriba (no dibuja)
  FCOLORP 3 (SETPC)  color de pluma (0\u201311)
  SETWIDTH 3     grosor de l\u00ednea

PANTALLA:
  BP (CS)        borrar pantalla
  FCOLORF 5 (SETBG)  color de fondo (0\u201315)
  OT (HT)        ocultar tortuga
  MT (ST)        mostrar tortuga

REPETIR:
  REPETIR 4 [AD 50 DE 90]

CREAR PROCEDIMIENTOS:
  PARA CUADRADO
  REPETIR 4 [AD 50 DE 90]
  FIN
  OLVIDAR CUADRADO  \u2014 olvidar un procedimiento

FORMAS:
  EDITSHAPE      abrir el editor de formas
  EDITSHAPE STAR editar/crear una forma
  SETSHAPE STAR  usar una forma guardada
  SETSHAPE TURTLE  volver a la tortuga
  SHAPES         listar formas guardadas

OTROS:
  DEMO           \u00a1ver un patr\u00f3n genial!
  PROCS          listar tus procedimientos
  POS            \u00bfd\u00f3nde est\u00e1 la tortuga?
  AYUDA AD       ayuda de un comando
  ADIOS          salir
  IDIOMA         cambiar idioma
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`,
  'FD': 'AD (ADELANTE) / FD (FORWARD) n \u2014 avanzar n pasos.\nEjemplo: AD 100',
  'AD': 'AD (ADELANTE) / FD (FORWARD) n \u2014 avanzar n pasos.\nEjemplo: AD 100',
  'BK': 'AT (ATRAS) / BK (BACK) n \u2014 retroceder n pasos.\nEjemplo: AT 50',
  'AT': 'AT (ATRAS) / BK (BACK) n \u2014 retroceder n pasos.\nEjemplo: AT 50',
  'RT': 'DE (DERECHA) / RT (RIGHT) n \u2014 girar a la derecha n grados.\nUn c\u00edrculo completo = 360. Una esquina = 90.\nEjemplo: DE 90',
  'DE': 'DE (DERECHA) / RT (RIGHT) n \u2014 girar a la derecha n grados.\nUn c\u00edrculo completo = 360. Una esquina = 90.\nEjemplo: DE 90',
  'LT': 'IZ (IZQUIERDA) / LT (LEFT) n \u2014 girar a la izquierda n grados.\nEjemplo: IZ 45',
  'IZ': 'IZ (IZQUIERDA) / LT (LEFT) n \u2014 girar a la izquierda n grados.\nEjemplo: IZ 45',
  'REPEAT': 'REPETIR n [ comandos ] \u2014 hacer los comandos n veces.\nEjemplo: REPETIR 4 [AD 50 DE 90]  dibuja un cuadrado.',
  'REPETIR': 'REPETIR n [ comandos ] \u2014 hacer los comandos n veces.\nEjemplo: REPETIR 4 [AD 50 DE 90]  dibuja un cuadrado.',
  'TO': 'PARA nombre :param1 :param2\n  comandos del cuerpo\nFIN\nCrea un nuevo comando.\nEjemplo:\n  PARA CUADRADO :TAMANO\n  REPETIR 4 [AD :TAMANO DE 90]\n  FIN\nLuego escribe: CUADRADO 80',
  'PARA': 'PARA nombre :param1 :param2\n  comandos del cuerpo\nFIN\nCrea un nuevo comando.\nEjemplo:\n  PARA CUADRADO :TAMANO\n  REPETIR 4 [AD :TAMANO DE 90]\n  FIN\nLuego escribe: CUADRADO 80',
  'SETPC': 'FCOLORP n (SETPC) \u2014 cambiar el color de la pluma.\n0=blanco  1=rojo  2=verde  3=amarillo\n4=cian  5=rosa  6=naranja  7=celeste\nEjemplo: FCOLORP 3',
  'FCOLORP': 'FCOLORP n (SETPC) \u2014 cambiar el color de la pluma.\n0=blanco  1=rojo  2=verde  3=amarillo\n4=cian  5=rosa  6=naranja  7=celeste\nEjemplo: FCOLORP 3',
  'SETBG': 'FCOLORF n (SETBG) \u2014 cambiar el color de fondo.\n0=negro  1=azul marino  2=verde oscuro  3=verde azulado\n4=rojo oscuro  5=morado  6=marr\u00f3n  7=gris\n8=gris oscuro  9=azul  10=verde  11=cian\n12=rojo  13=magenta  14=amarillo  15=blanco\nEjemplo: FCOLORF 1',
  'FCOLORF': 'FCOLORF n (SETBG) \u2014 cambiar el color de fondo.\nEjemplo: FCOLORF 1',
  'CS': 'BP (BORRAPANTALLA) / CS \u2014 borrar todo y enviar la tortuga al centro.',
  'BP': 'BP (BORRAPANTALLA) / CS \u2014 borrar todo y enviar la tortuga al centro.',
  'PU': 'SP (SINPLUMA) / PU \u2014 levantar la pluma para moverse sin dibujar.',
  'SP': 'SP (SINPLUMA) / PU \u2014 levantar la pluma para moverse sin dibujar.',
  'PD': 'CP (CONPLUMA) / PD \u2014 bajar la pluma para dibujar.',
  'CP': 'CP (CONPLUMA) / PD \u2014 bajar la pluma para dibujar.',
  'HOME': 'CENTRO / HOME \u2014 enviar la tortuga al centro, mirando arriba.',
  'CENTRO': 'CENTRO / HOME \u2014 enviar la tortuga al centro, mirando arriba.',
  'MAKE': 'DA "NOMBRE valor (MAKE) \u2014 guardar un n\u00famero en un nombre.\nEjemplo: DA "TAMANO 100\nLuego usa :TAMANO en los comandos.',
  'DA': 'DA "NOMBRE valor (MAKE) \u2014 guardar un n\u00famero en un nombre.\nEjemplo: DA "TAMANO 100\nLuego usa :TAMANO en los comandos.',
  'FORGET': 'OLVIDAR nombre (FORGET) \u2014 olvidar un procedimiento.\nEjemplo: OLVIDAR CUADRADO',
  'OLVIDAR': 'OLVIDAR nombre (FORGET) \u2014 olvidar un procedimiento.\nEjemplo: OLVIDAR CUADRADO',
  'HT': 'OT (OCULTARTORTUGA) / HT \u2014 ocultar la tortuga. \u00a1Sigue dibujando!',
  'OT': 'OT (OCULTARTORTUGA) / HT \u2014 ocultar la tortuga. \u00a1Sigue dibujando!',
  'ST': 'MT (MOSTRARTORTUGA) / ST \u2014 mostrar la tortuga de nuevo.',
  'MT': 'MT (MOSTRARTORTUGA) / ST \u2014 mostrar la tortuga de nuevo.',
  'STOP': 'ALTO / STOP \u2014 detener el procedimiento actual.',
  'ALTO': 'ALTO / STOP \u2014 detener el procedimiento actual.',
  'PRINT': 'ESCRIBE valor (PRINT) \u2014 imprimir un valor o [texto].',
  'ESCRIBE': 'ESCRIBE valor (PRINT) \u2014 imprimir un valor o [texto].',
  'BYE': 'ADIOS / BYE \u2014 salir de Turtle Logo.',
  'ADIOS': 'ADIOS / BYE \u2014 salir de Turtle Logo.',
  'HELP': 'AYUDA / HELP \u2014 ver todos los comandos.',
  'AYUDA': 'AYUDA / HELP \u2014 ver todos los comandos.',
  'DEMO': 'DEMO \u2014 \u00a1mira a la tortuga dibujar un patr\u00f3n genial!',
  'SETWIDTH': 'SETWIDTH n \u2014 establecer el grosor de la l\u00ednea.\nEjemplo: SETWIDTH 5',
  'SETXY': 'SETXY x y \u2014 mover la tortuga a la posici\u00f3n x, y.\nEjemplo: SETXY 100 50',
  'POS': 'POS \u2014 muestra la posici\u00f3n y el rumbo de la tortuga.',
  'PROCS': 'PROCS \u2014 listar todos los procedimientos creados con PARA/TO.',
  'SUM': 'SUMA a b (SUM) \u2014 sumar dos n\u00fameros e imprimir el resultado.',
  'SUMA': 'SUMA a b (SUM) \u2014 sumar dos n\u00fameros e imprimir el resultado.',
  'IF': 'SI condici\u00f3n [comandos] (IF) \u2014 ejecutar si la condici\u00f3n no es 0.',
  'SI': 'SI condici\u00f3n [comandos] (IF) \u2014 ejecutar si la condici\u00f3n no es 0.',
  'IFELSE': 'SISINO condici\u00f3n [s\u00ed] [no] (IFELSE)',
  'SISINO': 'SISINO condici\u00f3n [s\u00ed] [no] (IFELSE)',
  'CLEAN': 'LIMPIAR / CLEAN \u2014 borrar los dibujos pero dejar la tortuga donde est\u00e1.',
  'LIMPIAR': 'LIMPIAR / CLEAN \u2014 borrar los dibujos pero dejar la tortuga donde est\u00e1.',
  'EDITSHAPE': 'EDITSHAPE o EDITSHAPE nombre \u2014 abrir el editor de formas.\n\u00a1Haz clic en los cuadrados para dibujar tu propia tortuga!\nEjemplo: EDITSHAPE STAR',
  'SETSHAPE': 'SETSHAPE nombre \u2014 cambiar la tortuga a una forma guardada.\nSETSHAPE TURTLE vuelve a la tortuga normal.\nEjemplo: SETSHAPE STAR',
  'SHAPES': 'SHAPES \u2014 listar todas las formas guardadas.',
  'IDIOMA': 'IDIOMA ES / LANGUAGE EN \u2014 cambiar el idioma.',
  'LANGUAGE': 'IDIOMA ES / LANGUAGE EN \u2014 cambiar el idioma.',
};
