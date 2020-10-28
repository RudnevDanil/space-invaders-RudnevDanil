import Sprite from './sprite'
import Cannon from './cannon'
import Bullet from './bullet'
import Alien from './alien'
import InputHandler from './input-handler'

import assetPath from '../assets/invaders.png'

let gs = {
    seconds:{
        aShoot: 0,
    },
    level: 1,
    score: 0,
    lives: 3,
}

let settings = {
    lineW: 6,
    headerSize: 50,
    footerSize: 50,
    alien: {
        alienTypes: [1, 0, 1, 2, 0, 2],
        inOneLine: 11,
        shootTime: 1,
        size: 33
    },
    cannon: {
        step: 4,
    }
}

let safeArea = {
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
    if(gs.seconds.aShoot === settings.alien.shootTime)
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
        potentialX + Math.floor(objs.cannon._sprite.w / 2) <= safeArea.r)
    {
        objs.cannon.x = potentialX;
	}

    // Space
    if (inputHandler.isPressed(32))
    {
        const bulletX = objs.cannon.x + 10;
        const bulletY = objs.cannon.y;
        objs.bullets.push(new Bullet(bulletX, bulletY,0,  -8, 4, 8, "green"));
    }

    objs.bullets.forEach(b => b.update(time));
}

function showSafeAreaZone(ctx) // debug
{
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red"
    ctx.strokeRect(safeArea.l, safeArea.t, safeArea.r + safeArea.l, safeArea.b + safeArea.t);
    ctx.closePath();
}

function draw_background(ctx, w, h)
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
    safeArea.r = w - 2 * settings.lineW - safeArea.l
    safeArea.b = h - settings.footerSize - settings.headerSize - settings.lineW - safeArea.t

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

export function draw(canvas, time) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  draw_background(ctx, canvas.width, canvas.height);
    objs.aliens.forEach(a => a.draw(ctx, time));
    objs.cannon.draw(ctx);
    objs.bullets.forEach(b => b.draw(ctx));
}

function aliensStartShoot()
{
    objs.aliens.forEach(a =>
    {
        // rand a.shoot . it means generate white bullet
        // take lows shooters. rand(0.4) to shoot.
    });
}
