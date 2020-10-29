export default class Bullet {
  constructor(x, y, vx, vy, w, h, color) {
    this.x = x;
  	this.y = y;
  	this.vx = vx;
  	this.vy = vy;
  	this.w = w;
  	this.h = h;
  	this.color = color;
  }

  update(time) {
     // this.x = Math.floor(this.x + this.vx);
      //this.y = Math.floor(this.y + this.vy);
      this.x += this.vx;
      this.y += this.vy;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
  	ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}
