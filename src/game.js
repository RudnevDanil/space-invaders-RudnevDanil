import Sprite from './sprite'
import Cannon from './cannon'
import Bullet from './bullet'
import Alien from './alien'
import InputHandler from './input-handler'

import assetPath from '../assets/invaders.png'

let gs = { // game state. Dont change! It isn't a settings!
    seconds:{
        aShoot: 0,
    },
    level: 1,
    score: 0,
    lives: 3,
}

let settings = {
    lineW: 6, // width of background line
    headerSize: 50, // top offset in background
    footerSize: 50, // bottom offset in background
    alien: {
        alienTypes: [1, 0, 1, 2, 0, 2], // types numbers in each line
        inOneLine: 11, // pcs // amount of alien in one line. It means amount rows
        shootTime: 1, // sec // each shootTime lower of aliens are shoot
        size: 33, // px // size of one alien
        shootProbability: 0.1, // probability of alien shooting
        BulletMult: 300, // amount steps like a speed
    },
    cannon: {
        step: 4, // px // each tep of <- or -> move cannon on step px
        baseBulletSpeed: 8,
        bulletSpeedProbabilityRange: 0.2,
    }
}

let safeArea = { // will be set after
    l: 0,
    t: 0,
    r: 0,
    b: 0,
}

let assets;

const sprites = {
  aliens: [],
  cannon: null,
  bunker: null
};

const objs = {
  bullets: [],
  aliens: [],
  cannon: null,
};
const inputHandler = new InputHandler();

export function preload(onPreloadComplete)
{
    assets = new Image();
    assets.addEventListener("load", () => {
        sprites.cannon = new Sprite(assets, 62, 0, 22, 16);
        sprites.bunker = new Sprite(assets, 84, 8, 36, 24);
        sprites.aliens = [
            [new Sprite(assets,  0, 0, 22, 16), new Sprite(assets,  0, 16, 22, 16)],
            [new Sprite(assets, 22, 0, 16, 16), new Sprite(assets, 22, 16, 16, 16)],
            [new Sprite(assets, 38, 0, 24, 16), new Sprite(assets, 38, 16, 24, 16)]
        ]

        onPreloadComplete();
    });
    assets.src = assetPath;
}

export function init(canvas)
{
	for (let i = 0, len = settings.alien.alienTypes.length; i < len; i++)
	{
        const alienType = settings.alien.alienTypes[i];
		for (let j = 0; j < settings.alien.inOneLine; j++)
        {
            let alienX = settings.alien.size * (j + 1);
            let alienY = settings.alien.size * (i + 1) + settings.headerSize;

            // need to change array to [][]
            objs.aliens.push(new Alien(alienX, alienY, sprites.aliens[alienType]));
        }
	}

    objs.cannon = new Cannon(100, canvas.height - settings.footerSize - sprites.cannon.h - Math.floor(settings.lineW / 2), sprites.cannon);

    gs.timer = setTimeout(timer_tictoc, 1000);
}

function timer_tictoc()
{
    gs.seconds.aShoot += 1;
    if(gs.seconds.aShoot === settings.alien.shootTime && gs.lives > 0)
    {
        aliensStartShoot()
        gs.seconds.aShoot = 0
    }
    gs.timer = setTimeout(timer_tictoc, 1000);
}

export function update(time, stopGame)
{
    // Left
    let potentialX = objs.cannon.x - settings.cannon.step
	if (inputHandler.isDown(37) &&
        potentialX >= safeArea.l)
	{
        objs.cannon.x = potentialX;
	}

    // Right
    potentialX = objs.cannon.x + settings.cannon.step
	if (inputHandler.isDown(39) &&
        potentialX + Math.floor(objs.cannon._sprite.w / 2) <= safeArea.r - safeArea.l)
    {
        objs.cannon.x = potentialX;
	}

    // Space
    if (inputHandler.isPressed(32))
    {
        const bulletX = objs.cannon.x +  Math.floor(objs.cannon._sprite.h / 2);
        const bulletY = objs.cannon.y;
        const bulletVy = -1 * settings.cannon.baseBulletSpeed * (1 - settings.cannon.bulletSpeedProbabilityRange + Math.random() * settings.cannon.bulletSpeedProbabilityRange * 2)
        objs.bullets.push(new Bullet(bulletX, bulletY,0,  bulletVy, 4, 8, "green"));
    }

    objs.bullets.forEach(b => b.update(time));

    checkBulletIntersection()
    checkAreBulletsInSafeArea()
}

function checkAreBulletsInSafeArea()
{
    for(let i = 0; i < objs.bullets.length; i++)
    {
        if (objs.bullets[i].x < safeArea.l ||
            objs.bullets[i].x > safeArea.r ||
            objs.bullets[i].y < safeArea.t ||
            objs.bullets[i].y > safeArea.b + safeArea.t)
        {
            //delete objs.bullets[i];
            objs.bullets.splice(i,1);
        }
    }
}

function checkBulletIntersection()
{
    for(let i = 0; i < objs.bullets.length; i++)
    {
        if (objs.bullets[i].color == "white")
        {
            checkCannonOnLine(objs.bullets[i].x, objs.bullets[i].y,objs.bullets[i].x-objs.bullets[i].vx, objs.bullets[i].y - objs.bullets[i].vy)
        }
        else if(objs.bullets[i].color == "green")
        {
            checkAlienOnLine(objs.bullets[i].x, objs.bullets[i].y,objs.bullets[i].x-objs.bullets[i].vx, objs.bullets[i].y - objs.bullets[i].vy)
        }
    }
}

function checkAlienOnLine(ax, ay, bx ,by)
{
    
}

function checkCannonOnLine(ax, ay, bx ,by)
{
    // if cannon on line player shouted
    if(gs.lives <= 0)
    {
        stopGame()
    }
    else
    {
        gs.lives -= 1
    }
}

function stopGame()
{
    objs.bullets.forEach(b => {
        b.vx = 0;
        b.vy = 0;
    });

    objs.aliens.forEach(a =>  {
        a.vx = 0;
        a.vy = 0;
    });

    objs.cannon.vx = 0;
    objs.cannon.vy = 0;
}

function showSafeAreaZone(ctx) // debug
{
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red"
    ctx.strokeRect(safeArea.l, safeArea.t, safeArea.r, safeArea.b);
    ctx.closePath();
}

function drawBackground(ctx, w, h)
{
    // border
    ctx.beginPath();
    let halfLineW = Math.floor(settings.lineW / 2)
    ctx.lineWidth = settings.lineW;
    ctx.strokeStyle = "green"
    ctx.strokeRect(halfLineW, halfLineW, w - settings.lineW, h - settings.lineW);
    ctx.strokeRect(halfLineW, settings.headerSize, w, h - settings.footerSize - settings.headerSize);
    ctx.closePath();

    safeArea.l = settings.lineW
    safeArea.t = Math.floor(settings.lineW / 2) + settings.headerSize
    safeArea.r = w - 2 * settings.lineW
    safeArea.b = h - settings.footerSize - settings.headerSize - settings.lineW

    showSafeAreaZone(ctx) // debug

    // text settings
    ctx.font = "30px Verdana";
    ctx.fillStyle = "green";
    ctx.textAlign = "center";
    ctx.lineWidth = 2;
    ctx.textBaseline="middle";

    // header
    ctx.fillText("LEVEL: " + gs.level, Math.floor(w * 0.2), Math.floor((settings.headerSize + settings.lineW) / 2));
    //ctx.fillText("TextC", Math.floor(w * 0.5), Math.floor((settings.headerSize + settings.lineW) / 2));
    ctx.fillText("SCORE: " + gs.score, Math.floor(w * 0.8), Math.floor((settings.headerSize + settings.lineW) / 2));

    // footer
    let lives = "";
    for (let i = 0; i < gs.lives; i++)
        lives += "❤ "
    ctx.textAlign = "left";
    ctx.fillText("LIVES: " + lives, Math.floor(w * 0.1), Math.floor(h - (settings.headerSize + settings.lineW) / 2));

}

function drawGameOver(ctx, w, h)
{
    const sqrWPart = Math.floor(w / 10)
    const sqrHPart = Math.floor(h / 10)

    ctx.clearRect(sqrWPart*3, sqrHPart*3, sqrWPart*4, sqrHPart*4);
    ctx.beginPath();
    ctx.lineWidth = settings.lineW;
    ctx.strokeStyle = "green"
    ctx.strokeRect(sqrWPart*3, sqrHPart*3, sqrWPart*4, sqrHPart*3);
    ctx.closePath();

    ctx.textBaseline="top";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", w / 2, sqrHPart*3 + settings.lineW + 80);

    ctx.font = "15px Verdana";
    ctx.fillText("tap space to replay", w / 2, sqrHPart*3 + settings.lineW + 80 * 2);


}

export function draw(canvas, time) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground(ctx, canvas.width, canvas.height);
    objs.aliens.forEach(a => a.draw(ctx, time));
    objs.cannon.draw(ctx);
    objs.bullets.forEach(b => b.draw(ctx));
    if(gs.lives <= 0)
    {
        drawGameOver(ctx, canvas.width, canvas.height)
    }
}

function aliensStartShoot()
{
    let maxI = settings.alien.alienTypes.length;
    let maxJ = settings.alien.inOneLine;
    for(let j = 0; j < maxJ; j++)
    {
        for(let i = maxI - 1; i >= 0; i--)
        {
            if (objs.aliens[maxJ * i + j].isAlive)
            {
                 if(Math.random() < settings.alien.shootProbability)
                 {
                     setTimeout(alienMakeShoot, Math.floor(Math.random() * settings.alien.shootTime * 1000), maxJ * i + j);
                 }
                i = -1;
            }
        }
    }
}

function alienMakeShoot(ind)
{
    if(objs.aliens[ind].y < objs.cannon.y)
    {
        const bulletX = objs.aliens[ind].x + settings.alien.size / 2;
        const bulletY = objs.aliens[ind].y + settings.alien.size / 2;
        const bulletVx = ((objs.cannon.x + objs.cannon._sprite.w / 2) - bulletX) / settings.alien.BulletMult
        const bulletVy = ((objs.cannon.y + objs.cannon._sprite.h / 2) - bulletY) / settings.alien.BulletMult

        objs.bullets.push(new Bullet(bulletX, bulletY, bulletVx, bulletVy, 4, 8, "white"));
    }
}
