/**
 * Turtle Logo — Turtle
 * Canvas-based turtle graphics. Port of logo.py LogoTurtle class.
 * Dual-canvas: drawing surface (bottom) + sprite overlay (top).
 */

export class LogoTurtle {
  /** Default 16x16 turtle bitmap. Head points up (row 0). */
  static DEFAULT_BITMAP = [
    '0000000000000000',
    '0000000110000000',
    '0000001111000000',
    '0000001111000000',
    '0000000110000000',
    '0011001111001100',
    '0001111111111000',
    '0000111111110000',
    '0001111111111000',
    '0001111111111000',
    '0001111111111000',
    '0001111111111000',
    '0000111111110000',
    '0001011111101000',
    '0011000110001100',
    '0000000000000000',
  ];

  static PIXEL_SIZE = 2;

  /**
   * @param {HTMLCanvasElement} drawingCanvas - bottom canvas for lines
   * @param {HTMLCanvasElement} spriteCanvas  - top canvas for turtle sprite
   */
  constructor(drawingCanvas, spriteCanvas) {
    this.drawingCanvas = drawingCanvas;
    this.spriteCanvas = spriteCanvas;
    this.drawCtx = drawingCanvas.getContext('2d');
    this.spriteCtx = spriteCanvas.getContext('2d');

    this.x = 0;
    this.y = 0;
    this.heading = 0; // 0=north, 90=east, clockwise
    this.penDown = true;
    this.penColor = '#32cd32'; // lime green
    this.penWidth = 2;
    this.visible = true;
    this.bitmap = [...LogoTurtle.DEFAULT_BITMAP];
    this.pixels = LogoTurtle.bitmapToPixels(this.bitmap);
    this._drawCursor();
  }

  /** Convert a 16x16 bitmap to pixel offset array. */
  static bitmapToPixels(bitmap) {
    const pixels = [];
    for (let row = 0; row < bitmap.length; row++) {
      for (let col = 0; col < bitmap[row].length; col++) {
        if (bitmap[row][col] === '1') {
          pixels.push([col - 7.5, 7.5 - row]);
        }
      }
    }
    return pixels;
  }

  // -- Coordinate conversion: Logo (0,0)=center, y-up -> Canvas top-left, y-down --
  // Uses the canvas coordinate space (canvas.width/height), not CSS layout size.
  // For DPR-scaled canvases, the caller should set canvas.width to match CSS pixels
  // and apply the DPR scale via ctx.setTransform.

  /** Logical width of the drawing area (canvas coordinate space). */
  get logicalWidth() {
    // If a DPR transform is active, canvas.width is device pixels;
    // use the stored logical size or fall back to CSS size.
    return this._logicalWidth || this.drawingCanvas.width;
  }

  /** Logical height of the drawing area (canvas coordinate space). */
  get logicalHeight() {
    return this._logicalHeight || this.drawingCanvas.height;
  }

  /** Call after resizing to tell the turtle the logical (CSS-pixel) dimensions. */
  setLogicalSize(w, h) {
    this._logicalWidth = w;
    this._logicalHeight = h;
  }

  _cx(x) {
    if (x === undefined) x = this.x;
    return this.logicalWidth / 2 + x;
  }

  _cy(y) {
    if (y === undefined) y = this.y;
    return this.logicalHeight / 2 - y;
  }

  // -- Sprite drawing on the sprite canvas --

  _drawCursor() {
    const ctx = this.spriteCtx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.spriteCanvas.width, this.spriteCanvas.height);
    ctx.restore();
    if (!this.visible) return;

    const cx = this._cx();
    const cy = this._cy();
    const a = this.heading * Math.PI / 180;
    const cosA = Math.cos(a);
    const sinA = Math.sin(a);
    const ps = LogoTurtle.PIXEL_SIZE;

    ctx.fillStyle = this.penColor;
    for (const [dx, dy] of this.pixels) {
      const wx = dx * cosA + dy * sinA;
      const wy = -dx * sinA + dy * cosA;
      const px = cx + wx * ps;
      const py = cy - wy * ps;
      ctx.fillRect(px - ps / 2, py - ps / 2, ps, ps);
    }
  }

  // -- Movement --

  forward(dist) {
    const a = this.heading * Math.PI / 180;
    const newX = this.x + dist * Math.sin(a);
    const newY = this.y + dist * Math.cos(a);
    if (this.penDown) {
      const ctx = this.drawCtx;
      ctx.beginPath();
      ctx.moveTo(this._cx(), this._cy());
      ctx.lineTo(this._cx(newX), this._cy(newY));
      ctx.strokeStyle = this.penColor;
      ctx.lineWidth = this.penWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    this.x = newX;
    this.y = newY;
    this._drawCursor();
  }

  backward(dist) {
    this.forward(-dist);
  }

  right(angle) {
    this.heading = (this.heading + angle) % 360;
    this._drawCursor();
  }

  left(angle) {
    this.heading = ((this.heading - angle) % 360 + 360) % 360;
    this._drawCursor();
  }

  goto(x, y) {
    if (this.penDown) {
      const ctx = this.drawCtx;
      ctx.beginPath();
      ctx.moveTo(this._cx(), this._cy());
      ctx.lineTo(this._cx(x), this._cy(y));
      ctx.strokeStyle = this.penColor;
      ctx.lineWidth = this.penWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    this.x = x;
    this.y = y;
    this._drawCursor();
  }

  penup() { this.penDown = false; }
  pendown() { this.penDown = true; }

  setpencolor(color) {
    this.penColor = color;
    this._drawCursor();
  }

  setwidth(w) {
    this.penWidth = Math.max(1, Math.floor(w));
  }

  hideturtle() {
    this.visible = false;
    this._drawCursor();
  }

  showturtle() {
    this.visible = true;
    this._drawCursor();
  }

  clear() {
    const ctx = this.drawCtx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
    ctx.restore();
    this._drawCursor();
  }

  home() {
    const wasDown = this.penDown;
    this.penDown = false;
    this.x = 0;
    this.y = 0;
    this.heading = 0;
    this.penDown = wasDown;
    this._drawCursor();
  }

  pos() { return [this.x, this.y]; }
  getHeading() { return this.heading; }
  isdown() { return this.penDown; }

  setBitmap(bitmap) {
    this.bitmap = [...bitmap];
    this.pixels = LogoTurtle.bitmapToPixels(this.bitmap);
    this._drawCursor();
  }
}
