# David Logo

> A Python Logo interpreter for the Raspberry Pi, built for a first grader learning geometry — inspired by MSX Logo.

## About

A dad recreating his childhood MSX Logo experience for his son David, who is learning geometry in first grade and already uses Scratch. David Logo brings the classic Logo turtle graphics experience to modern hardware in a single Python script, with the same feel as the original MSX Logo from the 1980s — drawing canvas on top, command line on the bottom, all in one window.

## Screenshot

> _TODO: Add a screenshot of the David Logo window here._

## Requirements

- Python 3 with tkinter (standard on Raspberry Pi OS)
- Any Raspberry Pi 3/4/5 (also works on macOS, Linux, Windows)
- HDMI monitor and USB keyboard

## How to Run

```bash
python3 logo.py
```

Or use the launch script:

```bash
./logo.sh
```

## Quick Command Reference

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
| HOME | Go to center |
| HT / ST | Hide / Show turtle |
| TO name ... END | Define a procedure |
| FORGET name | Delete a procedure |
| EDITSHAPE | Open the pixel shape editor |
| SETSHAPE name | Use a saved shape |
| DEMO | Watch a cool pattern |
| HELP | See all commands |
| BYE | Quit |

## Turtle Sprite

The turtle is a 16×16 pixel bitmap in the style of MSX Logo. You can design your own sprites with the `EDITSHAPE` command, which opens a visual grid editor. Click cells to toggle pixels, drag to paint. Saved shapes persist in `david-shapes.json`.

## Persistent Procedures

When you define a procedure with `TO ... END`, it's automatically saved to `david-procs.logo` and reloaded next time you start David Logo. Use `PROCS` to list them, `FORGET` to delete one.

## The Turtle Book

See `books/logo-book.md` for a 16-chapter tutorial written for David, starting from "Meet the Turtle" and building up to stars, circles, and custom procedures.

## Example Programs

The `examples/` folder contains Logo programs you can study and type in:

- `square.logo` — rotating colored squares
- `star.logo` — five-pointed stars
- `snowflake.logo` — a six-armed snowflake

## Credits

- **Logo language** — Seymour Papert, Wally Feurzeig, Cynthia Solomon (MIT, 1967)
- **MSX Logo** — Logo Computer Systems Inc. / LCSI (Microsoft/ASCII Corporation, 1980s)
- **David Logo** — Roberto Hiribarne, 2026

## License

MIT License. See [LICENSE](LICENSE).
