# The Turtle Book
### Learn to Draw with Turtle Logo

*For David*

---

<div class="copyright">
<p>Turtle Logo — The Turtle Book</p>
<p>Copyright © 2026</p>
<p>For personal and educational use.</p>
<p>Made with <img src="emoji-turtle.svg" style="height:1.4em;vertical-align:-0.25em"> <img src="emoji-heart.svg" style="height:1.4em;vertical-align:-0.25em"> for David.</p>
</div>

## Meet the Turtle

There is a turtle on your screen.
His name is Your Turtle.

The turtle can walk.
The turtle can turn.
When the turtle walks, it draws a line!

You tell the turtle what to do.
You type a command at the bottom of the screen.
Then press **ENTER**.

The turtle listens and moves!

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

Try these one at a time:

```
FD 100
FD 10
FD 200
```

What happens when the number is bigger?
The turtle goes farther!

---

Now try going backward:

```
BK 50
```

**BK** means **back**.

The turtle walks backward, but it still faces the same way.

---

## Chapter 2: Turn the Turtle

The turtle can turn, too.

```
RT 90
```

**RT** means **turn right**.
**90** is a number of degrees.

Do you know what 90 degrees is?
It is a **right angle** — like the corner of a book, or a door, or your desk.

Now try:

```
LT 90
```

**LT** means **turn left**.

Try some other turns:

```
RT 45
```

That is half of a right angle.

```
RT 180
```

That turns the turtle all the way around to face the opposite direction!

---

## Chapter 3: Draw an L

Let's draw a shape.

First, clear the screen:

```
CS
```

**CS** means **clear screen**. It erases everything and sends the turtle back to the middle.

Now type these one at a time:

```
FD 100
RT 90
FD 100
```

You made an **L** shape!

The turtle went up, turned right, and went across.

---

## Chapter 4: A Square

A square has **4 sides**.
All sides are the same length.
Each corner is a **right angle** — that is **90 degrees**.

Clear the screen first:

```
CS
```

Now type these one at a time:

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
**FD 80** then **RT 90** — you did it four times.

---

## Chapter 5: REPEAT

Typing the same thing four times is a lot of work.

Logo has a shortcut called **REPEAT**.

```
CS
REPEAT 4 [FD 80 RT 90]
```

That draws the same square — in one line!

Here is how **REPEAT** works:
- The **number** says how many times.
- The **[ ]** holds the commands to repeat.

Try a big square:

```
CS
REPEAT 4 [FD 150 RT 90]
```

Try a tiny square:

```
CS
REPEAT 4 [FD 30 RT 90]
```

---

## Chapter 6: A Triangle

A triangle has **3 sides**.

How much should the turtle turn at each corner?

Think about it: a full spin is **360 degrees**.
If we turn 3 times, each turn is **360 ÷ 3 = 120 degrees**.

```
CS
REPEAT 3 [FD 80 RT 120]
```

You drew a triangle!

---

## Chapter 7: The Shape Rule

You just learned something important.

To draw any shape, the turtle needs to turn a total of **360 degrees**.

So the turn at each corner is:

**Turn = 360 ÷ number of sides**

Let's test it!

A **pentagon** has 5 sides. 360 ÷ 5 = 72.

```
CS
REPEAT 5 [FD 60 RT 72]
```

A **hexagon** has 6 sides. 360 ÷ 6 = 60.

```
CS
REPEAT 6 [FD 50 RT 60]
```

An **octagon** has 8 sides. 360 ÷ 8 = 45.

```
CS
REPEAT 8 [FD 40 RT 45]
```

Do you see the pattern? More sides = smaller turn = rounder shape!

---

## Chapter 8: A Circle (Almost!)

What if you use a LOT of sides with really tiny turns?

```
CS
REPEAT 36 [FD 10 RT 10]
```

36 turns, 10 degrees each time.
36 × 10 = 360 — a full trip around!

It looks like a circle!

The turtle cannot draw a real circle. But if you use enough tiny steps, it looks just like one.

Want an even smoother circle? Try this:

```
CS
REPEAT 360 [FD 1 RT 1]
```

360 tiny steps, 1 degree each. That is as close to a perfect circle as the turtle can get!

---

## Chapter 9: Change Colors

The turtle always draws in green.
But you can change the color!

```
SETPC 1
```

**SETPC** means **set pen color**.
The number picks a color.

Try these:

- **SETPC 0** — white
- **SETPC 1** — red
- **SETPC 2** — green
- **SETPC 3** — yellow
- **SETPC 4** — cyan (blue-green)
- **SETPC 5** — pink
- **SETPC 6** — orange
- **SETPC 7** — sky blue

Draw a red square:

```
CS
SETPC 1
REPEAT 4 [FD 80 RT 90]
```

Draw a yellow triangle:

```
CS
SETPC 3
REPEAT 3 [FD 80 RT 120]
```

---

## Chapter 10: Background Colors

You can change the background color too!

```
SETBG 1
```

**SETBG** means **set background**.

Try these:

- **SETBG 0** — black (the default)
- **SETBG 9** — blue
- **SETBG 15** — white
- **SETBG 14** — yellow

Draw a white snowflake on a blue background:

```
CS
SETBG 9
SETPC 0
REPEAT 6 [FD 80 BK 80 RT 60]
```

---

## Chapter 11: Thick and Thin Lines

You can make your lines thicker or thinner.

```
SETWIDTH 5
```

**SETWIDTH** sets how thick the pen draws.
The number is the width. 1 is thin, 5 is thick, 10 is very thick!

Try this:

```
CS
SETWIDTH 1
FD 60
RT 90
SETWIDTH 5
FD 60
RT 90
SETWIDTH 10
FD 60
```

Three lines — thin, medium, and thick!

---

## Chapter 12: Lift the Pen

When you type **FD**, the turtle always draws.

But sometimes you want to move without drawing.

**PU** means **pen up** — the turtle moves but does not draw.
**PD** means **pen down** — the turtle draws again.

Try this:

```
CS
FD 50
PU
FD 30
PD
FD 50
```

You get a line, a gap, and another line!

This is how you can draw shapes that are not connected.

---

## Chapter 13: A Star

A star has 5 points.

For a five-pointed star, we turn **144 degrees** each time.
(That is a special number. It works because 144 × 5 = 720, which is two full spins!)

```
CS
SETPC 3
REPEAT 5 [FD 100 RT 144]
```

A beautiful yellow star!

---

## Chapter 14: See the DEMO

Want to see something amazing?

Type:

```
DEMO
```

Watch the turtle draw a colorful pattern!

The turtle uses the same commands you already know.
After you watch it, try making your own pattern.

---

## Chapter 15: Make Your Own Command

This is one of the coolest things about Logo.
You can **teach it new commands**!

Let's teach Logo the word **SQUARE**.

Type this:

```
TO SQUARE
```

Logo will say it is waiting. Now type the body:

```
REPEAT 4 [FD 80 RT 90]
```

Then type:

```
END
```

Now try your new command!

```
SQUARE
```

The turtle draws a square!
You just made a new word that Logo understands.

Logo saves your commands, so next time you start Turtle Logo, **SQUARE** will still work!

---

## Chapter 16: A Command with a Size

What if you want squares of different sizes?

You can give your command a **variable**.
A variable is like a box that holds a number.
We write it with a colon, like **:SIZE**.

Type this:

```
TO SQUARE :SIZE
REPEAT 4 [FD :SIZE RT 90]
END
```

(If Logo says it already knows SQUARE, type **FORGET SQUARE** first, then try again.)

Now try:

```
CS
SQUARE 50
SQUARE 100
SQUARE 150
```

Three squares, three sizes — all from one command!

---

## Chapter 17: A Pattern

Let's put it all together and make something amazing.

First, make sure you have SQUARE:

```
TO SQUARE :SIZE
REPEAT 4 [FD :SIZE RT 90]
END
```

Now draw lots of squares, turning a little each time:

```
CS
REPEAT 36 [SQUARE 80 RT 10]
```

Wow! A beautiful pattern made of 36 squares!

Try changing the colors:

```
CS
SETPC 1
REPEAT 18 [SQUARE 80 RT 20]
SETPC 4
REPEAT 18 [SQUARE 60 RT 20]
```

---

## Chapter 18: Hide and Show the Turtle

Sometimes the turtle gets in the way of your drawing.

```
HT
```

**HT** means **hide turtle**. The turtle is still there — you just cannot see it. It still draws!

```
ST
```

**ST** means **show turtle**. Now you can see it again.

Try this:

```
CS
HT
REPEAT 36 [FD 10 RT 10]
ST
```

The circle appears without the turtle blocking the view!

---

## Chapter 19: Go Home

To send the turtle back to the middle:

```
HOME
```

The turtle goes to the center and points up.
It does not erase anything.

To find out where the turtle is right now, type:

```
POS
```

It will tell you the turtle's position and which way it is pointing.

---

## Chapter 20: Design Your Own Turtle

The turtle is made of tiny squares — a 16 by 16 grid, just like pixel art!

You can design your own shape.

Type:

```
EDITSHAPE ROCKET
```

A window pops up with a grid.
Click on the squares to fill them in.
Drag to paint.
When you are done, click **OK**.

Now the turtle looks like your drawing!

To go back to the normal turtle:

```
SETSHAPE TURTLE
```

To use your rocket shape again later:

```
SETSHAPE ROCKET
```

To see all your saved shapes:

```
SHAPES
```

---

## Quick Guide

| Command | What It Does |
|---|---|
| FD 50 | Forward 50 steps |
| BK 50 | Back 50 steps |
| RT 90 | Turn right 90 degrees |
| LT 90 | Turn left 90 degrees |
| REPEAT 4 [FD 50 RT 90] | Repeat commands |
| CS | Clear screen |
| PU | Pen up (no drawing) |
| PD | Pen down (draw) |
| SETPC 1 | Set pen color (0-11) |
| SETBG 0 | Set background color (0-15) |
| SETWIDTH 3 | Set line thickness |
| HOME | Go to the middle |
| HT / ST | Hide / Show turtle |
| POS | Where is the turtle? |
| TO name ... END | Make a new command |
| FORGET name | Forget a command you made |
| PROCS | List your commands |
| EDITSHAPE name | Design a new turtle shape |
| SETSHAPE name | Use a saved shape |
| SHAPES | List saved shapes |
| DEMO | See a cool pattern |
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
| Octagon | 8 | 45° |
| Circle (almost) | 36 | 10° |

**The rule:** Turn = 360 ÷ number of sides

---

## Things to Try

1. Draw a **house**. (A square with a triangle on top! Hint: after the square, you need to move the turtle to the right spot and turn before drawing the triangle.)
2. Draw the letter **D** — for David!
3. Draw a **rainbow**. (Use PU and PD to move between arcs. Use SETPC to change colors. A rainbow arc is half a circle.)
4. Make a **snowflake**. (Hint: REPEAT 6 with branches that go out and come back.)
5. Design a **spaceship** turtle with EDITSHAPE and fly it around the screen!
6. What does `REPEAT 8 [FD 60 RT 45]` draw?
7. What does `REPEAT 5 [REPEAT 4 [FD 40 RT 90] RT 72]` draw? (A REPEAT inside a REPEAT!)

---

*Happy drawing!*
