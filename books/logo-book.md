# The Turtle Book
### Learn to Draw with Logo

*For David*

---

## Meet the Turtle

There is a turtle on your screen.

The turtle can walk.
The turtle can turn.
When the turtle walks, it draws a line!

You tell the turtle what to do.
You type a command.
Then press **ENTER**.

Let's try it.

---

## Chapter 1: Your First Steps

Type this and press ENTER:

```
FD 50
```

The turtle went forward 50 steps!

**FD** means **forward**.
The number tells the turtle how far to go.

Try these:

```
FD 100
FD 10
FD 200
```

What happens when the number is bigger?

---

Now try going backward:

```
BK 50
```

**BK** means **back**.

---

## Chapter 2: Turn the Turtle

The turtle can turn, too.

```
RT 90
```

**RT** means **right**.
**90** is 90 degrees.
A corner is 90 degrees.

Now try:

```
LT 90
```

**LT** means **left**.

---

## Chapter 3: Draw a Line

Let's draw a line.

Type this:

```
FD 100
```

Now turn:

```
RT 90
```

Now go forward again:

```
FD 100
```

You made an L shape!

---

## Chapter 4: A Square

A square has 4 sides.
All sides are the same.
Each corner is 90 degrees.

Type these one at a time:

```
FD 80
RT 90
FD 80
RT 90
FD 80
RT 90
FD 80
RT 90
```

You drew a square!

Did you see the pattern?
**FD 80** and **RT 90** — four times!

---

## Chapter 5: REPEAT

Typing the same thing four times is a lot of work.

Logo has a shortcut: **REPEAT**.

```
REPEAT 4 [FD 80 RT 90]
```

That draws the same square!

**REPEAT** says: do this many times.
The number says how many.
The **[ ]** holds the commands to repeat.

Try a big square:

```
REPEAT 4 [FD 150 RT 90]
```

Try a small square:

```
REPEAT 4 [FD 30 RT 90]
```

---

## Chapter 6: Clear the Screen

To erase everything, type:

```
CS
```

**CS** means **clear screen**.

The turtle goes back to the middle, too.

---

## Chapter 7: A Triangle

A triangle has 3 sides.

How much do we turn for a triangle?

A full circle is **360 degrees**.
Divide 360 by 3.
That is **120**.

```
REPEAT 3 [FD 80 RT 120]
```

You drew a triangle!

---

## Chapter 8: Change Colors

You can change the color of the lines!

```
SETPC 1
```

**SETPC** means **set pen color**.

Try these numbers:

- **SETPC 1** — red
- **SETPC 2** — green
- **SETPC 3** — yellow
- **SETPC 4** — cyan (blue-green)
- **SETPC 5** — pink
- **SETPC 6** — orange
- **SETPC 7** — sky blue

Draw a red square:

```
SETPC 1
REPEAT 4 [FD 80 RT 90]
```

---

## Chapter 9: Lift the Pen

When you type **FD**, the turtle always draws.

But sometimes you want to move without drawing.

**PU** means **pen up** — no drawing.
**PD** means **pen down** — draw again.

Try this:

```
FD 50
PU
FD 50
PD
FD 50
```

You get a line, a gap, and another line!

---

## Chapter 10: Make Your Own Command

You can teach Logo a new command!

Let's teach it **SQUARE**.

Type this:

```
TO SQUARE
```

Logo will wait. Now type the body:

```
REPEAT 4 [FD 80 RT 90]
```

Then type:

```
END
```

Now try it!

```
SQUARE
```

You made a new command!

---

## Chapter 11: A Command with a Size

What if you want squares of different sizes?

You can give your command a number.
We call the number a **:SIZE**.

Type this:

```
TO SQUARE :SIZE
```

Then:

```
REPEAT 4 [FD :SIZE RT 90]
```

Then:

```
END
```

Now try:

```
SQUARE 50
SQUARE 100
SQUARE 150
```

Three squares, three sizes!

---

## Chapter 12: A Hexagon

A hexagon has 6 sides.

360 ÷ 6 = 60

```
REPEAT 6 [FD 60 RT 60]
```

A hexagon!

---

## Chapter 13: A Circle (Almost!)

What if you repeat many tiny turns?

Try this:

```
REPEAT 36 [FD 10 RT 10]
```

36 times, 10 degrees each time.
36 × 10 = 360 — a full circle!

It looks like a circle!

---

## Chapter 14: A Star

A star has 5 points.

For a star, we turn **144 degrees** each time.

```
REPEAT 5 [FD 100 RT 144]
```

A five-point star!

---

## Chapter 15: A Pattern

Let's draw something cool.

First, make a square command:

```
TO SQUARE :SIZE
REPEAT 4 [FD :SIZE RT 90]
END
```

Now draw lots of squares, turning a little each time:

```
REPEAT 36 [SQUARE 80 RT 10]
```

Wow!

---

## Chapter 16: Go Home

To send the turtle back to the middle:

```
HOME
```

---

## Quick Guide

| Command | What It Does |
|---|---|
| FD 50 | Forward 50 steps |
| BK 50 | Back 50 steps |
| RT 90 | Turn right 90 degrees |
| LT 90 | Turn left 90 degrees |
| REPEAT 4 [ ] | Repeat commands |
| CS | Clear screen |
| PU | Pen up (no drawing) |
| PD | Pen down (draw) |
| SETPC 1 | Change color |
| HOME | Go to the middle |
| TO name ... END | Make a new command |
| HELP | See all commands |
| BYE | Quit |

---

## Shape Guide

| Shape | Sides | Turn |
|---|---|---|
| Triangle | 3 | 120° |
| Square | 4 | 90° |
| Pentagon | 5 | 72° |
| Hexagon | 6 | 60° |
| Circle (almost) | 36 | 10° |

**The rule:** Turn = 360 ÷ number of sides

---

## Things to Try

1. Draw a house. (A square with a triangle on top!)
2. Draw the letter E.
3. Draw a rainbow. (Use SETPC to change colors!)
4. Make a snowflake. (Hint: Use REPEAT 6.)
5. What does `REPEAT 8 [FD 60 RT 45]` draw?

---

*Happy drawing!*
