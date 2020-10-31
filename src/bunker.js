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
        this.init = false
    }

    draw(ctx, time) {
        ctx.drawImage(
            this._sprite.img,
            this._sprite.x, this._sprite.y, this._sprite.w, this._sprite.h,
            this.x, this.y, this._sprite.w, this._sprite.h
        );

        const imgSize = this.w * this.h
        let indF = 0
        let indS = 0
        if(!this.init)
        {
            let myImage = ctx.getImageData(this.x, this.y, this.w, this.h);
            for (let i = 0; i < imgSize; i++)
            {
                myImage.data[i * 4 + 0] = 0
                indF = Math.floor(i / this.w)
                indS = i - this.w * indF
                if(myImage.data[i * 4 + 1] === 250)
                {
                    this.mask[indF][indS] = true
                }
                else
                {
                    this.mask[indF][indS] = false
                }
            }
            this.init = true
            ctx.putImageData(myImage, this.x, this.y)
        }

        let myImage = ctx.getImageData(this.x, this.y, this.w, this.h);


        for (let i = 0; i < imgSize; i++)
        {
            indF = Math.floor(i / this.w)
            indS = i - this.w * indF
            myImage.data[i * 4 + 3] = this.mask[indF][indS] ? 255 : 0
        }
        ctx.putImageData(myImage, this.x, this.y)
    }

    hasPoint(x, y)
    {
        if (x >= this.x && x < this.x + this.w &&
            y >= this.y && y < this.y + this.h &&
            this.mask[y - this.y][x - this.x])
        {
            this.destroyPoint(x, y)
            return true
        }
        return false
    }

    destroyPoint(x, y)
    {
        let firtsCoord = y - this.y
        let secondCoord = x - this.x
        this.mask[firtsCoord][secondCoord] = false

        const isTop = firtsCoord > 0
        const isBot = firtsCoord < this.h - 1
        const isLeft = secondCoord > 0
        const isRight = secondCoord < this.w - 1

        if (isRight) {this.mask[firtsCoord][secondCoord + 1] = false}
        if (isLeft)  {this.mask[firtsCoord][secondCoord - 1] = false}
        if (isTop)
        {
            {this.mask[firtsCoord - 1][secondCoord + 1] = false}
            {this.mask[firtsCoord - 1][secondCoord    ] = false}
            {this.mask[firtsCoord - 1][secondCoord - 1] = false}
        }
        if (isBot)
        {
            {this.mask[firtsCoord + 1][secondCoord + 1] = false}
            {this.mask[firtsCoord + 1][secondCoord    ] = false}
            {this.mask[firtsCoord + 1][secondCoord - 1] = false}
        }
    }
}
