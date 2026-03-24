#!/usr/bin/env python3
"""
Turtle Logo
A Logo interpreter with turtle graphics — all in one window.
Canvas on top, command line on the bottom, like MSX Logo.
"""

import tkinter as tk
import tkinter.font as tkfont
import os
import sys
import math
import json

# ─── PATHS ───────────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROCS_FILE = os.path.join(SCRIPT_DIR, "david-procs.logo")
SHAPES_FILE = os.path.join(SCRIPT_DIR, "david-shapes.json")

# ─── CUSTOM TURTLE (draws on a tkinter Canvas) ──────────────────────────────

class LogoTurtle:
    """A turtle that draws on a tkinter Canvas, like the real Logo turtle."""

    def __init__(self, canvas):
        self.canvas = canvas
        self.x = 0.0
        self.y = 0.0
        self.heading = 0.0    # Logo convention: 0=north, 90=east, clockwise
        self.pen_down = True
        self.pen_color = "lime green"
        self.pen_width = 2
        self.visible = True
        self.cursor_id = None  # list of canvas items for the turtle shape
        self.bitmap = list(self.DEFAULT_BITMAP)
        self.pixels = self.bitmap_to_pixels(self.bitmap)
        self._draw_cursor()

    # ── Coordinate conversion: Logo (0,0)=center, y-up → Canvas pixels ──

    def _cx(self, x=None):
        """Logo x → canvas x."""
        if x is None: x = self.x
        return self.canvas.winfo_width() / 2 + x

    def _cy(self, y=None):
        """Logo y → canvas y (flip vertical)."""
        if y is None: y = self.y
        return self.canvas.winfo_height() / 2 - y

    # ── Turtle cursor (MSX-style pixel-art turtle seen from above) ──────

    # Default 16x16 turtle bitmap. Row 0 = top, '1' = filled pixel.
    # Head points up (toward row 0). Center of sprite = (7.5, 7.5).
    DEFAULT_BITMAP = [
        "0000000000000000",  # 0
        "0000000110000000",  # 1
        "0000001111000000",  # 2
        "0000001111000000",  # 3
        "0000000110000000",  # 4
        "0011001111001100",  # 5
        "0001111111111000",  # 6
        "0000111111110000",  # 7
        "0001111111111000",  # 8
        "0001111111111000",  # 9
        "0001111111111000",  # 10
        "0001111111111000",  # 11
        "0000111111110000",  # 12
        "0001011111101000",  # 13
        "0011000110001100",  # 14
        "0000000000000000",  # 15
    ]

    PIXEL_SIZE = 2  # size of each pixel block in canvas units

    @staticmethod
    def bitmap_to_pixels(bitmap):
        """Convert a 16x16 bitmap (list of 16 strings) to pixel offsets."""
        pixels = []
        for row_idx, row in enumerate(bitmap):
            for col_idx, ch in enumerate(row):
                if ch == '1':
                    dx = col_idx - 7.5
                    dy = 7.5 - row_idx
                    pixels.append((dx, dy))
        return pixels

    def _draw_cursor(self):
        if self.cursor_id:
            for item in self.cursor_id:
                self.canvas.delete(item)
            self.cursor_id = None
        if not self.visible:
            return

        cx, cy = self._cx(), self._cy()
        a = math.radians(self.heading)
        cos_a, sin_a = math.cos(a), math.sin(a)
        ps = self.PIXEL_SIZE

        parts = []
        for dx, dy in self.pixels:
            # Rotate local (dx=right, dy=forward) to canvas coords
            wx = dx * cos_a + dy * sin_a
            wy = -dx * sin_a + dy * cos_a
            px = cx + wx * ps
            py = cy - wy * ps
            parts.append(self.canvas.create_rectangle(
                px - ps/2, py - ps/2, px + ps/2, py + ps/2,
                fill="lime green", outline="", width=0
            ))
        self.cursor_id = parts

    def _update_cursor(self):
        self._draw_cursor()

    # ── Movement ─────────────────────────────────────────────────────────
    # Logo heading: 0°=north, 90°=east. Forward uses sin for x, cos for y.

    def forward(self, dist):
        a = math.radians(self.heading)
        new_x = self.x + dist * math.sin(a)
        new_y = self.y + dist * math.cos(a)
        if self.pen_down:
            self.canvas.create_line(
                self._cx(), self._cy(),
                self._cx(new_x), self._cy(new_y),
                fill=self.pen_color, width=self.pen_width,
                capstyle=tk.ROUND
            )
        self.x, self.y = new_x, new_y
        self._update_cursor()

    def backward(self, dist):
        self.forward(-dist)

    def right(self, angle):
        self.heading = (self.heading + angle) % 360
        self._update_cursor()

    def left(self, angle):
        self.heading = (self.heading - angle) % 360
        self._update_cursor()

    def goto(self, x, y):
        if self.pen_down:
            self.canvas.create_line(
                self._cx(), self._cy(),
                self._cx(x), self._cy(y),
                fill=self.pen_color, width=self.pen_width,
                capstyle=tk.ROUND
            )
        self.x, self.y = x, y
        self._update_cursor()

    def penup(self):
        self.pen_down = False

    def pendown(self):
        self.pen_down = True

    def setpencolor(self, color):
        self.pen_color = color
        self._update_cursor()

    def setwidth(self, w):
        self.pen_width = max(1, int(w))

    def hideturtle(self):
        self.visible = False
        self._update_cursor()

    def showturtle(self):
        self.visible = True
        self._update_cursor()

    def clear(self):
        """Erase all drawings but keep turtle position."""
        self.canvas.delete("all")
        self._update_cursor()

    def home(self):
        """Go to center, heading up."""
        was_down = self.pen_down
        self.pen_down = False
        self.x, self.y = 0.0, 0.0
        self.heading = 0.0
        self.pen_down = was_down
        self._update_cursor()

    def pos(self):
        return self.x, self.y

    def get_heading(self):
        return self.heading

    def isdown(self):
        return self.pen_down

    def set_bitmap(self, bitmap):
        """Change the turtle sprite to a new 16x16 bitmap."""
        self.bitmap = list(bitmap)
        self.pixels = self.bitmap_to_pixels(self.bitmap)
        self._update_cursor()

# ─── SHAPE STORAGE ───────────────────────────────────────────────────────────

# Named shapes that persist between sessions (saved to david-shapes.json)
saved_shapes = {}

def load_shapes():
    """Load saved shapes from david-shapes.json."""
    global saved_shapes
    if not os.path.exists(SHAPES_FILE):
        return
    try:
        with open(SHAPES_FILE, 'r') as f:
            saved_shapes = json.load(f)
    except Exception:
        pass

def save_shapes():
    """Save all named shapes to david-shapes.json."""
    with open(SHAPES_FILE, 'w') as f:
        json.dump(saved_shapes, f, indent=2)

# ─── BITMAP EDITOR (pop-up 16x16 grid) ──────────────────────────────────────

class BitmapEditor:
    """A 16x16 pixel grid editor for designing turtle sprites.
    Click cells to toggle them. Like the MSX Logo shape editor."""

    CELL_SIZE = 24  # pixels per grid cell

    def __init__(self, parent_app, initial_bitmap=None, shape_name=None):
        self.app = parent_app
        self.shape_name = shape_name
        self.grid = []
        # Initialize grid from bitmap or blank
        if initial_bitmap:
            for row in initial_bitmap:
                self.grid.append([int(ch) for ch in row])
        else:
            self.grid = [[0]*16 for _ in range(16)]

        self.win = tk.Toplevel(parent_app.root)
        self.win.title(f"Shape Editor{' — ' + shape_name if shape_name else ''}")
        self.win.configure(bg="#1a1a2e")
        self.win.resizable(False, False)

        cs = self.CELL_SIZE

        # Canvas for the grid
        self.canvas = tk.Canvas(
            self.win, width=16*cs+1, height=16*cs+1,
            bg="black", highlightthickness=0
        )
        self.canvas.pack(padx=10, pady=(10, 5))

        # Draw grid and cells
        self.rects = [[None]*16 for _ in range(16)]
        for r in range(16):
            for c in range(16):
                x1, y1 = c*cs, r*cs
                x2, y2 = x1+cs, y1+cs
                fill = "lime green" if self.grid[r][c] else "black"
                rect = self.canvas.create_rectangle(
                    x1, y1, x2, y2,
                    fill=fill, outline="#333333", width=1
                )
                self.rects[r][c] = rect

        self.canvas.bind("<Button-1>", self._on_click)
        self.canvas.bind("<B1-Motion>", self._on_drag)
        self._last_toggled = None  # track drag to avoid double-toggle

        # Buttons
        btn_frame = tk.Frame(self.win, bg="#1a1a2e")
        btn_frame.pack(pady=(5, 10))

        btn_style = dict(bg="#333333", fg="lime green", font=("Menlo", 12),
                         activebackground="#555555", activeforeground="white",
                         borderwidth=1, relief=tk.RAISED, padx=8, pady=2)

        tk.Button(btn_frame, text="OK", command=self._ok, **btn_style).pack(side=tk.LEFT, padx=4)
        tk.Button(btn_frame, text="Clear", command=self._clear, **btn_style).pack(side=tk.LEFT, padx=4)
        tk.Button(btn_frame, text="Cancel", command=self.win.destroy, **btn_style).pack(side=tk.LEFT, padx=4)

        # Grab focus
        self.win.grab_set()
        self.win.focus_set()

    def _cell_at(self, x, y):
        """Return (row, col) for canvas coordinates, or None."""
        cs = self.CELL_SIZE
        c = int(x // cs)
        r = int(y // cs)
        if 0 <= r < 16 and 0 <= c < 16:
            return r, c
        return None

    def _on_click(self, event):
        """Toggle a cell on click."""
        cell = self._cell_at(event.x, event.y)
        if cell is None:
            return
        r, c = cell
        self.grid[r][c] = 1 - self.grid[r][c]
        fill = "lime green" if self.grid[r][c] else "black"
        self.canvas.itemconfigure(self.rects[r][c], fill=fill)
        self._last_toggled = (r, c)

    def _on_drag(self, event):
        """Paint cells while dragging (set to filled)."""
        cell = self._cell_at(event.x, event.y)
        if cell is None or cell == self._last_toggled:
            return
        r, c = cell
        self.grid[r][c] = 1
        self.canvas.itemconfigure(self.rects[r][c], fill="lime green")
        self._last_toggled = (r, c)

    def _clear(self):
        """Clear all cells."""
        for r in range(16):
            for c in range(16):
                self.grid[r][c] = 0
                self.canvas.itemconfigure(self.rects[r][c], fill="black")

    def _ok(self):
        """Apply the bitmap to the turtle and optionally save it."""
        bitmap = [''.join(str(cell) for cell in row) for row in self.grid]
        self.app.turtle.set_bitmap(bitmap)
        if self.shape_name:
            saved_shapes[self.shape_name.upper()] = bitmap
            save_shapes()
            self.app.print_output(f"Shape {self.shape_name.upper()} saved!")
        else:
            self.app.print_output("Turtle shape updated!")
        self.win.destroy()

# ─── INTERPRETER STATE ───────────────────────────────────────────────────────

procedures = {}   # name -> (param_names, body_string)
variables  = {}   # name -> value

PEN_COLORS = [
    "white", "red", "lime green", "yellow",
    "cyan", "magenta", "orange", "sky blue",
    "hot pink", "coral", "gold", "violet",
]

BG_COLORS = [
    "black", "navy", "dark green", "teal",
    "dark red", "purple", "brown", "gray",
    "dark gray", "blue", "green", "cyan",
    "red", "magenta", "yellow", "white",
]

KNOWN_COMMANDS = [
    'FD', 'FORWARD', 'BK', 'BACK', 'BACKWARD', 'RT', 'RIGHT', 'LT', 'LEFT',
    'HOME', 'SETXY', 'PU', 'PENUP', 'PD', 'PENDOWN', 'SETPC', 'SETPENCOLOR',
    'COLOR', 'SETWIDTH', 'CS', 'CLEARSCREEN', 'CLEAN', 'HT', 'HIDETURTLE',
    'ST', 'SHOWTURTLE', 'SETBG', 'BGCOLOR', 'REPEAT', 'IF', 'IFELSE', 'MAKE',
    'STOP', 'PRINT', 'SUM', 'TO', 'HELP', 'BYE', 'PROCS', 'POS', 'FORGET',
    'DEMO', 'SETSHAPE', 'EDITSHAPE', 'SHAPES', 'LANGUAGE', 'IDIOMA',
    # Spanish aliases
    'AD', 'ADELANTE', 'AT', 'ATRAS', 'DE', 'DERECHA', 'IZ', 'IZQUIERDA',
    'CENTRO', 'SP', 'SINPLUMA', 'CP', 'CONPLUMA', 'FCOLORP',
    'BP', 'BORRAPANTALLA', 'LIMPIAR', 'OT', 'OCULTARTORTUGA',
    'MT', 'MOSTRARTORTUGA', 'FCOLORF', 'REPETIR', 'REPITE',
    'SI', 'SISINO', 'DA', 'ALTO', 'ESCRIBE', 'ES', 'SUMA',
    'PARA', 'FIN', 'OLVIDAR', 'AYUDA', 'ADIOS',
]

# Spanish command aliases → canonical English command
SPANISH_ALIASES = {
    'AD': 'FD', 'ADELANTE': 'FD', 'AT': 'BK', 'ATRAS': 'BK',
    'DE': 'RT', 'DERECHA': 'RT', 'IZ': 'LT', 'IZQUIERDA': 'LT',
    'CENTRO': 'HOME', 'SP': 'PU', 'SINPLUMA': 'PU',
    'CP': 'PD', 'CONPLUMA': 'PD', 'FCOLORP': 'SETPC',
    'BP': 'CS', 'BORRAPANTALLA': 'CS', 'LIMPIAR': 'CLEAN',
    'OT': 'HT', 'OCULTARTORTUGA': 'HT', 'MT': 'ST', 'MOSTRARTORTUGA': 'ST',
    'FCOLORF': 'SETBG', 'REPETIR': 'REPEAT', 'REPITE': 'REPEAT',
    'SI': 'IF', 'SISINO': 'IFELSE', 'DA': 'MAKE', 'ALTO': 'STOP',
    'ESCRIBE': 'PRINT', 'ES': 'PRINT', 'SUMA': 'SUM',
    'PARA': 'TO', 'FIN': 'END', 'OLVIDAR': 'FORGET',
    'AYUDA': 'HELP', 'ADIOS': 'BYE',
}

# ─── TYPO SUGGESTION ────────────────────────────────────────────────────────

def edit_distance(a, b):
    """Simple Levenshtein distance between two strings."""
    if len(a) < len(b):
        return edit_distance(b, a)
    if len(b) == 0:
        return len(a)
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a):
        curr = [i + 1]
        for j, cb in enumerate(b):
            cost = 0 if ca == cb else 1
            curr.append(min(curr[j] + 1, prev[j + 1] + 1, prev[j] + cost))
        prev = curr
    return prev[-1]

def suggest_command(unknown):
    """Find the closest known command within edit distance 2, or None."""
    unknown = unknown.upper()
    candidates = KNOWN_COMMANDS + list(procedures.keys())
    best, best_dist = None, 3
    for cmd in candidates:
        d = edit_distance(unknown, cmd)
        if d < best_dist:
            best, best_dist = cmd, d
    return best

# ─── PERSISTENT PROCEDURES ──────────────────────────────────────────────────

def save_procedures():
    """Save all user procedures to david-procs.logo."""
    with open(PROCS_FILE, 'w') as f:
        for name, (params, body) in procedures.items():
            param_str = ' '.join(f':{p}' for p in params)
            if param_str:
                f.write(f"TO {name} {param_str}\n")
            else:
                f.write(f"TO {name}\n")
            f.write(f"{body}\n")
            f.write("END\n\n")

def load_procedures():
    """Load saved procedures from david-procs.logo on startup."""
    if not os.path.exists(PROCS_FILE):
        return []
    messages = []
    try:
        with open(PROCS_FILE, 'r') as f:
            lines = f.readlines()
        i = 0
        count = 0
        while i < len(lines):
            line = lines[i].strip()
            if line.upper().startswith('TO '):
                parts = line.split()
                name = parts[1].upper()
                params = [p.lstrip(':') for p in parts[2:]]
                body_lines = []
                i += 1
                while i < len(lines) and lines[i].strip().upper() != 'END':
                    body_lines.append(lines[i].strip())
                    i += 1
                procedures[name] = (params, ' '.join(body_lines))
                count += 1
            i += 1
        if count > 0:
            names = ', '.join(procedures.keys())
            messages.append(f"Loaded {count} saved procedure{'s' if count != 1 else ''}: {names}")
    except Exception:
        pass
    return messages

# ─── TOKENIZER ───────────────────────────────────────────────────────────────

def tokenize(text):
    """Split a line into a flat list of tokens, with [...] as block strings."""
    tokens = []
    i = 0
    text = text.strip()
    while i < len(text):
        if text[i] in (' ', '\t'):
            i += 1
        elif text[i] == '[':
            depth, j = 1, i + 1
            while j < len(text) and depth > 0:
                if text[j] == '[': depth += 1
                elif text[j] == ']': depth -= 1
                j += 1
            tokens.append(('[', text[i+1:j-1].strip()))
            i = j
        elif text[i] == ']':
            i += 1
        elif text[i] == ';':
            break
        else:
            j = i
            while j < len(text) and text[j] not in (' ', '\t', '[', ']', ';'):
                j += 1
            tokens.append(('W', text[i:j]))
            i = j
    return tokens

# ─── EXPRESSION EVALUATOR ────────────────────────────────────────────────────

def eval_expr(tok, local_vars):
    """Evaluate a token as a number. Supports :var references."""
    kind, val = tok
    if kind == 'W':
        if val.startswith(':'):
            name = val[1:].upper()
            if name in local_vars:  return local_vars[name]
            if name in variables:   return variables[name]
            raise LogoError(f"I don't know a variable called :{val[1:]}. Did you MAKE it first?")
        try:
            return float(val)
        except ValueError:
            raise LogoError(f"I need a number, but got '{val}'. Try using a number like 50 or 100.")
    raise LogoError(f"I need a number here. Try something like: FD 50")

# ─── EXECUTOR ────────────────────────────────────────────────────────────────

class LogoError(Exception):
    pass

def execute(tokens, app, local_vars=None):
    """Execute a token list. Uses app.turtle for drawing, app.print_output for text."""
    if local_vars is None:
        local_vars = {}
    t = app.turtle
    i = 0

    def consume():
        nonlocal i
        tok = tokens[i]; i += 1; return tok

    def need_num(cmd):
        if i >= len(tokens):
            raise LogoError(f"{cmd} needs a number after it. Try: {cmd} 50")
        return eval_expr(consume(), local_vars)

    def need_block(cmd):
        if i >= len(tokens) or tokens[i][0] != '[':
            raise LogoError(f"{cmd} needs a [ list ] after it. Example: REPEAT 4 [FD 50 RT 90]")
        return consume()[1]

    def need_word(cmd):
        if i >= len(tokens) or tokens[i][0] != 'W':
            raise LogoError(f"{cmd} needs a name after it.")
        return consume()[1]

    while i < len(tokens):
        tok = consume()
        if tok[0] != 'W':
            continue
        raw_cmd = tok[1].upper()
        cmd = SPANISH_ALIASES.get(raw_cmd, raw_cmd)

        # ── MOTION ──────────────────────────────────────────────────────────
        if cmd in ('FD', 'FORWARD'):
            t.forward(need_num('FD'))

        elif cmd in ('BK', 'BACK', 'BACKWARD'):
            t.backward(need_num('BK'))

        elif cmd in ('RT', 'RIGHT'):
            t.right(need_num('RT'))

        elif cmd in ('LT', 'LEFT'):
            t.left(need_num('LT'))

        elif cmd == 'HOME':
            t.home()

        elif cmd == 'SETXY':
            x = need_num('SETXY')
            y = need_num('SETXY')
            was_down = t.isdown()
            t.penup(); t.goto(x, y)
            if was_down: t.pendown()

        # ── PEN ─────────────────────────────────────────────────────────────
        elif cmd in ('PU', 'PENUP'):
            t.penup()

        elif cmd in ('PD', 'PENDOWN'):
            t.pendown()

        elif cmd in ('SETPC', 'SETPENCOLOR', 'COLOR'):
            n = int(need_num('SETPC'))
            t.setpencolor(PEN_COLORS[n % len(PEN_COLORS)])

        elif cmd == 'SETWIDTH':
            t.setwidth(need_num('SETWIDTH'))

        # ── SCREEN ──────────────────────────────────────────────────────────
        elif cmd in ('CS', 'CLEARSCREEN'):
            t.clear()
            t.pen_down = True
            t.x, t.y = 0.0, 0.0
            t.heading = 0.0
            t.setpencolor("lime green")
            t.setwidth(2)
            t._update_cursor()

        elif cmd in ('CLEAN',):
            t.clear()

        elif cmd in ('HT', 'HIDETURTLE'):
            t.hideturtle()

        elif cmd in ('ST', 'SHOWTURTLE'):
            t.showturtle()

        elif cmd in ('SETBG', 'BGCOLOR'):
            n = int(need_num('SETBG'))
            app.canvas.configure(bg=BG_COLORS[n % len(BG_COLORS)])

        # ── CONTROL ─────────────────────────────────────────────────────────
        elif cmd == 'REPEAT':
            count = int(need_num('REPEAT'))
            body  = need_block('REPEAT')
            body_tokens = tokenize(body)
            for _ in range(count):
                execute(body_tokens, app, dict(local_vars))

        elif cmd in ('IF', 'IFELSE'):
            cond = need_num('IF')
            true_block  = need_block('IF')
            false_block = None
            if i < len(tokens) and tokens[i][0] == '[':
                false_block = consume()[1]
            if cond != 0:
                execute(tokenize(true_block), app, dict(local_vars))
            elif false_block:
                execute(tokenize(false_block), app, dict(local_vars))

        elif cmd == 'MAKE':
            name = need_word('MAKE').upper().lstrip('"')
            val  = need_num('MAKE')
            variables[name] = val

        elif cmd == 'STOP':
            return

        elif cmd == 'PRINT':
            if i < len(tokens):
                tok2 = consume()
                if tok2[0] == '[':
                    app.print_output(tok2[1])
                else:
                    try:
                        app.print_output(str(eval_expr(tok2, local_vars)))
                    except LogoError:
                        app.print_output(tok2[1])

        elif cmd == 'SUM':
            a = need_num('SUM'); b = need_num('SUM')
            app.print_output(f"= {a + b}")

        elif cmd == 'TO':
            raise LogoError("Use TO at the start of a line by itself. See HELP TO.")

        elif cmd == 'FORGET':
            name = need_word('FORGET').upper()
            if name in procedures:
                del procedures[name]
                save_procedures()
                app.print_output(f"OK, I forgot {name}.")
            else:
                app.print_output(f"I don't know a procedure called {name}.")

        # ── SHAPE COMMANDS ──────────────────────────────────────────────────
        elif cmd == 'SETSHAPE':
            name = need_word('SETSHAPE').upper()
            if name in ('TURTLE', 'TORTUGA'):
                # Reset to default turtle
                t.set_bitmap(LogoTurtle.DEFAULT_BITMAP)
                app.print_output("Shape set to TURTLE.")
            elif name in saved_shapes:
                t.set_bitmap(saved_shapes[name])
                app.print_output(f"Shape set to {name}.")
            else:
                app.print_output(f"I don't know a shape called {name}. Try SHAPES to see saved shapes.")

        elif cmd == 'EDITSHAPE':
            # EDITSHAPE or EDITSHAPE NAME
            shape_name = None
            if i < len(tokens) and tokens[i][0] == 'W':
                shape_name = consume()[1].upper()
            # Start from current bitmap, or the named shape if it exists
            if shape_name and shape_name in saved_shapes:
                initial = saved_shapes[shape_name]
            else:
                initial = t.bitmap
            BitmapEditor(app, initial_bitmap=initial, shape_name=shape_name)

        elif cmd == 'SHAPES':
            if saved_shapes:
                app.print_output("Saved shapes:")
                for name in saved_shapes:
                    app.print_output(f"  {name}")
                app.print_output("Use SETSHAPE name to change the turtle.")
            else:
                app.print_output("No saved shapes yet. Try EDITSHAPE STAR to make one!")

        elif cmd == 'DEMO':
            run_demo(app)

        elif cmd in ('LANGUAGE', 'IDIOMA') or raw_cmd in ('LANGUAGE', 'IDIOMA'):
            if i < len(tokens) and tokens[i][0] == 'W':
                choice = consume()[1].upper()
                app.print_output("Language/Idioma: both English and Spanish commands always work.")
            else:
                app.print_output("Both English and Spanish commands always work. / Los comandos en inglés y español siempre funcionan.")

        elif cmd in procedures:
            param_names, body = procedures[cmd]
            call_vars = dict(local_vars)
            for p in param_names:
                call_vars[p.upper()] = need_num(cmd)
            execute(tokenize(body), app, call_vars)

        elif cmd == 'HELP':
            if i < len(tokens) and tokens[i][0] == 'W':
                show_help(consume()[1].upper(), app)
            else:
                show_help(None, app)

        elif cmd == 'BYE':
            app.print_output("Bye! Great drawing!")
            app.root.after(800, app.root.destroy)
            return

        elif cmd == 'PROCS':
            if procedures:
                app.print_output("Procedures you have made:")
                for name, (params, _) in procedures.items():
                    args = ' '.join(f':{p}' for p in params)
                    app.print_output(f"  {name} {args}")
            else:
                app.print_output("No procedures yet. Try making one with TO!")

        elif cmd == 'POS':
            x, y = t.pos()
            h = t.get_heading()
            app.print_output(f"Turtle is at X={x:.0f}, Y={y:.0f}, heading={h:.0f}")

        elif cmd == '':
            pass

        else:
            suggestion = suggest_command(tok[1])
            if suggestion:
                raise LogoError(
                    f"I don't know {tok[1]} \u2014 did you mean {suggestion}? "
                    f"Try HELP to see commands."
                )
            else:
                raise LogoError(
                    f"I don't know '{tok[1]}'. "
                    f"Try HELP to see all the commands you can use!"
                )

# ─── DEMO ────────────────────────────────────────────────────────────────────

def run_demo(app):
    """Draw a colorful spiral-of-squares pattern using Logo commands."""
    app.print_output("Watch this!")
    demo = "CS HT "
    for step in range(36):
        color_num = (step % 11) + 1
        size = 60 + step * 3
        demo += f"SETPC {color_num} "
        demo += f"REPEAT 4 [FD {size} RT 90] "
        demo += "RT 10 "
    demo += "ST HOME"
    execute(tokenize(demo), app)
    app.print_output("Cool, right? Try making your own patterns!")

# ─── TO ... END (multi-line procedure input) ─────────────────────────────────

# In the GUI version, TO...END is handled by the App class which collects
# lines until END is typed, then registers the procedure.

# ─── HELP SYSTEM ─────────────────────────────────────────────────────────────

HELP_TEXT = {
    None: """\
COMMANDS YOU CAN USE:
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
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500""",
    'FD': "FD (or FORWARD) n \u2014 move forward n steps.\nExample: FD 100",
    'BK': "BK (or BACK) n \u2014 move backward n steps.\nExample: BK 50",
    'RT': "RT (or RIGHT) n \u2014 turn right n degrees.\nA full circle = 360. A square corner = 90.\nExample: RT 90",
    'LT': "LT (or LEFT) n \u2014 turn left n degrees.\nExample: LT 45",
    'REPEAT': "REPEAT n [ commands ] \u2014 do the commands n times.\nExample: REPEAT 4 [FD 50 RT 90]  draws a square.",
    'TO': "TO name :param1 :param2\n  body commands\nEND\nMakes a new command you can use later.\nExample:\n  TO SQUARE :SIZE\n  REPEAT 4 [FD :SIZE RT 90]\n  END\nThen type: SQUARE 80",
    'SETPC': "SETPC n \u2014 change the pen color.\n0=white  1=red  2=green  3=yellow\n4=cyan   5=pink 6=orange 7=sky blue\nExample: SETPC 3",
    'SETBG': "SETBG n \u2014 change the background color.\n0=black  1=navy  2=dark green  3=teal\n4=dark red  5=purple  6=brown  7=gray\n8=dark gray  9=blue  10=green  11=cyan\n12=red  13=magenta  14=yellow  15=white\nExample: SETBG 1",
    'CS': "CS (CLEARSCREEN) \u2014 erase everything and send turtle home.",
    'PU': "PU (PENUP) \u2014 lift the pen so moving does not draw.",
    'PD': "PD (PENDOWN) \u2014 put the pen down so moving draws a line.",
    'HOME': "HOME \u2014 send the turtle back to the center, pointing up.",
    'MAKE': "MAKE \"NAME value \u2014 store a number in a name.\nExample: MAKE \"SIZE 100\nThen use :SIZE in commands.",
    'FORGET': "FORGET name \u2014 forget a procedure you made with TO.\nExample: FORGET SQUARE",
    'DEMO': "DEMO \u2014 watch the turtle draw a cool pattern!",
    'EDITSHAPE': "EDITSHAPE or EDITSHAPE name \u2014 open the pixel editor.\nClick squares to draw your own turtle shape!\nExample: EDITSHAPE STAR",
    'SETSHAPE': "SETSHAPE name \u2014 change the turtle to a saved shape.\nSETSHAPE TURTLE goes back to the default.\nExample: SETSHAPE STAR",
    'SHAPES': "SHAPES \u2014 list all your saved shapes.",
}

def show_help(topic, app):
    if topic in HELP_TEXT:
        app.print_output(HELP_TEXT[topic])
    else:
        app.print_output(HELP_TEXT[None])

# ─── THE APP (single-window GUI) ────────────────────────────────────────────

class LogoApp:
    """Single-window Logo environment: canvas on top, command line on bottom."""

    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Turtle Logo")
        self.root.configure(bg="#1a1a2e")
        self.root.geometry("800x700")

        # Allow resize — canvas gets most of the space
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=5)   # canvas gets most space
        self.root.rowconfigure(1, weight=0)   # separator
        self.root.rowconfigure(2, weight=1)   # output area (compact)

        # ── Canvas (drawing area) ───────────────────────────────────────
        self.canvas = tk.Canvas(
            self.root, bg="black",
            highlightthickness=1, highlightbackground="#333333"
        )
        self.canvas.grid(row=0, column=0, sticky="nsew", padx=4, pady=(4, 0))

        # ── Separator line ──────────────────────────────────────────────
        sep = tk.Frame(self.root, height=2, bg="#444444")
        sep.grid(row=1, column=0, sticky="ew", padx=4, pady=2)

        # ── Bottom frame: output text + input ───────────────────────────
        bottom = tk.Frame(self.root, bg="#1a1a2e")
        bottom.grid(row=2, column=0, sticky="nsew", padx=4, pady=(0, 4))
        bottom.columnconfigure(0, weight=1)
        bottom.rowconfigure(0, weight=1)

        # Choose a nice monospace font
        self.font = tkfont.Font(family="Menlo", size=13)
        # Fallback if Menlo isn't available
        if "Menlo" not in tkfont.families():
            self.font = tkfont.Font(family="Courier", size=13)

        # Output area (scrollable text, compact height)
        self.output = tk.Text(
            bottom, bg="#0a0a1a", fg="lime green",
            font=self.font, wrap=tk.WORD,
            insertbackground="lime green",
            highlightthickness=0, borderwidth=0,
            state=tk.DISABLED, cursor="arrow",
            height=6
        )
        scrollbar = tk.Scrollbar(bottom, command=self.output.yview, bg="#333333")
        self.output.configure(yscrollcommand=scrollbar.set)
        self.output.grid(row=0, column=0, sticky="nsew")
        scrollbar.grid(row=0, column=1, sticky="ns")

        # Input line
        input_frame = tk.Frame(bottom, bg="#1a1a2e")
        input_frame.grid(row=1, column=0, columnspan=2, sticky="ew", pady=(2, 0))
        input_frame.columnconfigure(1, weight=1)

        prompt_label = tk.Label(
            input_frame, text="?> ", bg="#1a1a2e", fg="lime green",
            font=self.font
        )
        prompt_label.grid(row=0, column=0)

        self.entry = tk.Entry(
            input_frame, bg="#0a0a1a", fg="white",
            font=self.font, insertbackground="white",
            highlightthickness=1, highlightcolor="lime green",
            highlightbackground="#333333", borderwidth=0
        )
        self.entry.grid(row=0, column=1, sticky="ew")
        self.entry.bind("<Return>", self._on_enter)
        self.entry.bind("<Up>", self._history_up)
        self.entry.bind("<Down>", self._history_down)
        self.entry.focus_set()

        # ── State ───────────────────────────────────────────────────────
        self.turtle = None  # created after canvas is mapped
        self.history = []
        self.history_pos = 0
        self.to_mode = False      # True while collecting TO...END body lines
        self.to_name = ""
        self.to_params = []
        self.to_body = []

        # Wait for canvas to be drawn so we know its size, then create turtle
        self.canvas.bind("<Configure>", self._on_canvas_configure)
        self._turtle_ready = False

    def _on_canvas_configure(self, event):
        """Called when canvas is resized. Redraw turtle cursor at correct position."""
        if not self._turtle_ready:
            self.turtle = LogoTurtle(self.canvas)
            self._turtle_ready = True
            self._startup()
        else:
            self.turtle._update_cursor()

    def _startup(self):
        """Print banner and load saved procedures."""
        self.print_output("Turtle Logo \u2014 Your Turtle is ready.")
        self.print_output("Type HELP to see commands. Type BYE to quit.")
        load_shapes()
        messages = load_procedures()
        for msg in messages:
            self.print_output(msg)

    def print_output(self, text):
        """Print a line to the output area."""
        self.output.configure(state=tk.NORMAL)
        self.output.insert(tk.END, text + "\n")
        self.output.see(tk.END)
        self.output.configure(state=tk.DISABLED)

    def _on_enter(self, event):
        """Handle ENTER key in the command entry."""
        line = self.entry.get().strip()
        self.entry.delete(0, tk.END)

        if not line:
            return

        # Add to history
        self.history.append(line)
        self.history_pos = len(self.history)

        # Echo the command
        self.print_output(f"?> {line}")

        # ── TO/PARA...END/FIN collection mode ─────────────────────────
        if self.to_mode:
            if line.upper() in ('END', 'FIN'):
                body = ' '.join(self.to_body)
                procedures[self.to_name] = (self.to_params, body)
                save_procedures()
                self.print_output(f"OK! I learned {self.to_name}.")
                self.to_mode = False
            else:
                self.to_body.append(line)
                self.print_output(f"  | {line}")
            return

        if line.startswith(';'):
            return

        # ── Start TO/PARA definition ──────────────────────────────────
        if line.upper().startswith('TO ') or line.upper().startswith('PARA '):
            parts = line.split()
            if len(parts) < 2:
                self.print_output("Oops! TO/PARA needs a name. Example: TO SQUARE")
                return
            self.to_name = parts[1].upper()
            self.to_params = [p.lstrip(':') for p in parts[2:]]
            self.to_body = []
            self.to_mode = True
            self.print_output(f"  (Now type the body of {self.to_name}. Type END/FIN when done.)")
            return

        # ── Normal command execution ────────────────────────────────────
        try:
            tokens = tokenize(line)
            execute(tokens, self)
        except LogoError as e:
            self.print_output(f"Oops! {e}")
        except Exception:
            self.print_output("Hmm, something didn't work. Check your command and try again!")

    def _history_up(self, event):
        """Navigate command history with up arrow."""
        if self.history and self.history_pos > 0:
            self.history_pos -= 1
            self.entry.delete(0, tk.END)
            self.entry.insert(0, self.history[self.history_pos])

    def _history_down(self, event):
        """Navigate command history with down arrow."""
        if self.history_pos < len(self.history) - 1:
            self.history_pos += 1
            self.entry.delete(0, tk.END)
            self.entry.insert(0, self.history[self.history_pos])
        else:
            self.history_pos = len(self.history)
            self.entry.delete(0, tk.END)

    def run(self):
        self.root.mainloop()

# ─── MAIN ────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    app = LogoApp()
    app.run()
