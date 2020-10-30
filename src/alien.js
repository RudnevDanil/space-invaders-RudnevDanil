export default class Alien {
  constructor(x, y, [spriteA, spriteB], alienType) {
    this.x = x;
  	this.y = y;
  	this.isAlive = true;
    this._spriteA = spriteA;
    this._spriteB = spriteB;
    this.blinkTime = 1000;
    this.isInjured = false;
    this.alienType = alienType;
  }

  draw(ctx, time)
  {
    if(this.isAlive)
    {
      let sp = (Math.ceil(time / this.blinkTime) % 2 === 0) ? this._spriteA : this._spriteB;

      ctx.drawImage(
          sp.img,
          sp.x, sp.y, sp.w, sp.h,
          this.x, this.y, sp.w, sp.h
      );
    }
  }
}
