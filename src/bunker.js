export default class Bunker {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this._sprite = sprite;
        this.w = sprite.w
        this.h = sprite.h
        this.mask = new Array(this.h);
        for(let i = 0; i < this.h; i++)
        {
            this.mask[i] = new Array(this.w)
            for(let j = 0; j < this.w; j++)
            {
                this.mask[i][j] = true;
            }
        }
    }

    draw(ctx, time) {
        ctx.drawImage(
            this._sprite.img,
            this._sprite.x, this._sprite.y, this._sprite.w, this._sprite.h,
            this.x, this.y, this._sprite.w, this._sprite.h
        );
        //console.log(this.x, this.y, this.w, this.h)
        let myImage = ctx.getImageData(this.x, this.y, this.w, this.h);
        const imgSize = this.w * this.h
        for (let i = 0; i < imgSize; i++)
        {
            myImage.data[i * 4 + 3] = this.mask[Math.floor(i / this.w)][i - this.w * Math.floor(i / this.w)] ? 255 : 0
        }
        ctx.putImageData(myImage, this.x, this.y)


    }

    hasPoint(x, y)
    {
        console.log("work point")
        if (x >= this.x && x < this.x + this.w &&
            y >= this.y && y < this.y + this.h)
        {
            if(this.mask[x - this.x][y - this.y])
            {
                this.destroyPoint(x, y)
                return true
            }
        }
        return false
    }

    destroyPoint(x, y)
    {
        console.log("DDD")
        this.mask[x - this.x][y - this.y] = false
    }
}
