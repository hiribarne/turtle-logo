/**
 * Turtle Logo — Shape Editor
 * 16x16 bitmap editor on canvas.
 */

export class ShapeEditor {
  static CELL_SIZE = 24;

  /**
   * @param {HTMLElement} container - DOM element to append the canvas to
   * @param {string[]} initialBitmap - 16 strings of '0'/'1'
   */
  constructor(container, initialBitmap) {
    this.grid = [];
    if (initialBitmap) {
      for (const row of initialBitmap) {
        this.grid.push([...row].map(Number));
      }
    } else {
      for (let r = 0; r < 16; r++) this.grid.push(new Array(16).fill(0));
    }

    const cs = ShapeEditor.CELL_SIZE;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 16 * cs + 1;
    this.canvas.height = 16 * cs + 1;
    this.canvas.className = 'shape-editor-canvas';
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this._lastToggled = null;
    this._draw();

    this.canvas.addEventListener('pointerdown', (e) => this._onClick(e));
    this.canvas.addEventListener('pointermove', (e) => {
      if (e.buttons === 1) this._onDrag(e);
    });
  }

  _cellAt(x, y) {
    const cs = ShapeEditor.CELL_SIZE;
    const c = Math.floor(x / cs);
    const r = Math.floor(y / cs);
    if (r >= 0 && r < 16 && c >= 0 && c < 16) return [r, c];
    return null;
  }

  _draw() {
    const cs = ShapeEditor.CELL_SIZE;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        ctx.fillStyle = this.grid[r][c] ? '#32cd32' : '#000000';
        ctx.fillRect(c * cs, r * cs, cs, cs);
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1;
        ctx.strokeRect(c * cs, r * cs, cs, cs);
      }
    }
  }

  _onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cell = this._cellAt(x, y);
    if (!cell) return;
    const [r, c] = cell;
    this.grid[r][c] = 1 - this.grid[r][c];
    this._lastToggled = `${r},${c}`;
    this._draw();
  }

  _onDrag(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cell = this._cellAt(x, y);
    if (!cell) return;
    const [r, c] = cell;
    const key = `${r},${c}`;
    if (key === this._lastToggled) return;
    this.grid[r][c] = 1;
    this._lastToggled = key;
    this._draw();
  }

  clear() {
    for (let r = 0; r < 16; r++)
      for (let c = 0; c < 16; c++)
        this.grid[r][c] = 0;
    this._draw();
  }

  /** Returns the bitmap as an array of 16 strings. */
  getBitmap() {
    return this.grid.map(row => row.join(''));
  }
}
