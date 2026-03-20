# David Logo

> A Python Logo interpreter inspired by MSX Logo, built for a first grader learning geometry.

## About

I grew up with MSX Logo in the 1980s — typing `FD 100 RT 90` and watching a turtle draw squares on the screen. It's how I first understood what an angle was.

My son David is in first grade, learning geometry. He already loves Scratch and Minecraft, so he's comfortable with a computer. I wanted to give him the same experience I had: a simple command line, a turtle that listens, and the thrill of making shapes appear on screen by typing code.

David Logo is my attempt to recreate that. It's a single Python script that opens one window — drawing canvas on top, command line on the bottom — just like the original MSX Logo. The turtle sprite is a 16x16 pixel bitmap, the heading convention is classic Logo (0° = north), and the error messages are kid-friendly. Everything runs on a Raspberry Pi, a Mac, or any machine with Python 3.

![David Logo](screenshot.jpeg)

## How to Run

```bash
python3 logo.py
```

Or use the launch script:

```bash
./logo.sh
```

Requires Python 3 with tkinter. On Raspberry Pi OS and most Linux distributions this is included by default. On macOS with Homebrew: `brew install python-tk@3.14` (match your Python version).

## Commands

| Command | What It Does |
|---|---|
| FD 50 | Forward 50 steps |
| BK 50 | Back 50 steps |
| RT 90 | Turn right 90° |
| LT 90 | Turn left 90° |
| REPEAT 4 [FD 50 RT 90] | Repeat commands |
| CS | Clear screen |
| PU / PD | Pen up / Pen down |
| SETPC 1 | Set pen color (0–11) |
| SETBG 0 | Set background color (0–15) |
| SETWIDTH 3 | Set line thickness |
| HOME | Go to center |
| HT / ST | Hide / Show turtle |
| POS | Show turtle position and heading |
| TO name ... END | Define a procedure |
| FORGET name | Delete a procedure |
| PROCS | List saved procedures |
| EDITSHAPE | Open the 16x16 pixel shape editor |
| EDITSHAPE name | Create/edit a named shape |
| SETSHAPE name | Switch to a saved shape |
| SETSHAPE TURTLE | Back to the default turtle |
| SHAPES | List saved shapes |
| DEMO | Watch a colorful pattern |
| HELP | See all commands |
| BYE | Quit |

## Turtle Sprite

The turtle is a 16x16 pixel bitmap rendered as small squares, in the style of MSX Logo. You can design your own sprites with the `EDITSHAPE` command — it opens a visual grid editor where you click cells to toggle pixels and drag to paint. Shapes are saved to `david-shapes.json` and persist between sessions. Type `SETSHAPE TURTLE` to go back to the default.

## Persistent Procedures

When David defines a procedure with `TO ... END`, it's automatically saved to `david-procs.logo` and reloaded next time he starts the program. No work is lost between sessions. `PROCS` lists them, `FORGET` deletes one.

## The Turtle Book

I wrote a 20-chapter tutorial for David in `books/logo-book.md` (also available as [a PDF](books/logo-book.pdf)). It starts with "Meet the Turtle" and builds up through squares, triangles, the shape rule (turn = 360 / sides), colors, procedures with variables, and designing custom turtle sprites. The language is written for a first grader who reads well.

To regenerate the PDF:

```bash
pandoc books/logo-book.md -o /tmp/turtle-book.html --standalone
weasyprint /tmp/turtle-book.html books/logo-book.pdf --stylesheet books/book-style.css
```

The PDF is formatted for [Lulu](https://www.lulu.com/) coil-bound printing at US Letter (8.5 × 11 in).

## Example Programs

The `examples/` folder has a few Logo programs to type in:

- `square.logo` — rotating colored squares
- `star.logo` — five-pointed stars
- `snowflake.logo` — a six-armed snowflake

## Credits

- **Logo language** — Seymour Papert, Wally Feurzeig, Cynthia Solomon (MIT, 1967)
- **MSX Logo** — Logo Computer Systems Inc. / LCSI (Microsoft/ASCII Corporation, 1980s)
- **David Logo** — Roberto Hiribarne, 2026

## License

MIT License. See [LICENSE](LICENSE).
