class Fire {
  constructor(
    colours = [[0,0,0], [128,32,0], [128,64,0], [255,128,0], [255,255,0], [255,255,0], [255,255,255]],
    colourSteps = 3,
    fireWidth = 80,
    canvas = document.getElementById("screen"),
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.palette = Fire.generatePalette(colours, colourSteps);
    this.width = canvas.width;
    this.fireWidth = fireWidth;
    this.height = canvas.height;
    this.fireArray = this.getFireArray();
    
    this.sprite = document.createElement("canvas");
    this.spriteCtx = this.sprite.getContext("2d", { alpha: false });
    this.sprite.height = this.height;
    this.sprite.width = this.fireWidth;
    
    
    setInterval(() => {
      this.update();
    }, 25);
  }
  
  getFireArray() {
    const arr = Array.from({length: this.height})
      .map(() => new Array(this.fireWidth).fill(0));
    
    for (let i = 0; i < this.fireWidth; i++) {
        arr[this.height - 1][i] = this.palette.length - 1;
    }
    return arr;
  }
  
  updateFire() {
    for (let x = 0; x < this.fireWidth; x++) {
      for (let y = 1; y < this.height; y++) {
        const idx = this.fireArray[y][x];
        if (idx) {
          const rnd = Math.floor(Math.random() * 3);
          this.fireArray[y - 1][(x - rnd + 1) % this.fireWidth] = idx - rnd % 2;
        }
        else {
          this.fireArray[y - 1][x] = 0;
        }
      }
    }
  }
  
  drawFire() {
    for (let y = 0; y < this.fireArray.length; y++) {
      const row = this.fireArray[y];
      for (let x = 0; x < row.length; x++) {
        const idx = row[x];
        if (idx) {
          const [r, g, b] = this.palette[idx];
          this.spriteCtx.fillStyle = `rgb(${r},${g},${b})`;
          this.spriteCtx.fillRect(x, y, 1, 1);
        }
      }
    }
  }
  
  static generatePalette(colours, steps) {
    const palette = [[0,0,0]];
    for (let i = 0; i < colours.length - 1; i++) {
      const [r1,g1,b1] = colours[i], [r2,g2,b2] = colours[i + 1];
      for (let s = 0; s < steps; s++) {
        const mix = [
          Fire.lerp(r1, r2, (s + .5) / steps),
          Fire.lerp(g1, g2, (s + .5) / steps),
          Fire.lerp(b1, b2, (s + .5) / steps)
        ];
        palette.push(mix);
      }
    }
    return palette;
  }

  update() {
    this.spriteCtx.clearRect(0,0,this.fireWidth,this.height);
    this.ctx.clearRect(0,0,this.width,this.height);
    this.updateFire();
    this.drawFire();
    for (let i = 0; i < this.width; i += this.fireWidth - 1) {
      this.ctx.drawImage(this.sprite, 0 + i, 0);
    }
  }
    
  static lerp(start, end, amt) {
    return Math.round((1-amt)*start+amt*end);
  }
}

new Fire();
/*
new Fire([
  [0,0,0],
  [0,0,255],
  [0,0,255],
  [255,0,0],
  [255,0,0],
  [255,0,255],
  [255,0,255],
  [0,255,0],
  [0,255,0],
  [0,255,255],
  [0,255,255],
  [255,255,0],
  [255,255,0],
  [255,255,255],
  [255,255,255]
],1);
*/