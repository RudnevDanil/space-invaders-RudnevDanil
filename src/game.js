import Sprite from './sprite'
import Cannon from './cannon'
import Bullet from './bullet'
import Alien from './alien'
import InputHandler from './input-handler'

import assetPath from '../assets/invaders.png'

let gs = {
    secondsLeft: 0,
}

let settings = {
    lineW: 6,
    headerSize: 50,
    footerSize: 50,
    alien: {
        shootTime: 1,
    },
}

let safeArea = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
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

export function preload(onPreloadComplete) {
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

export function init(canvas) {
  const alienTypes = [1, 0, 1, 2, 0, 2];
	for (var i = 0, len = alienTypes.length; i < len; i++) {
		for (var j = 0; j < 10; j++) {
      const alienType = alienTypes[i];

      let alienX = 30 + j*30;
      let alienY = settings.headerSize + 30 + i*30;

      if (alienType === 1) {
        alienX += 3; // (kostyl) aliens of this type is a bit thinner
      }

            objs.aliens.push(
        new Alien(alienX, alienY, sprites.aliens[alienType])
			);
		}
	}

    objs.cannon = new Cannon(
    100, canvas.height - 100 - settings.footerSize,
    sprites.cannon
  );

    gs.timer = setTimeout(timer_tictoc, 1000);
}

function timer_tictoc()
{
    gs.secondsLeft += 1;
    if(gs.secondsLeft == settings.alien.shootTime)
    {
        aliensStartShoot()
        gs.secondsLeft = 0
    }
    gs.timer = setTimeout(timer_tictoc, 1000);
}

export function update(time, stopGame) {
	if (inputHandler.isDown(37)) { // Left
        objs.cannon.x -= 4;
	}

	if (inputHandler.isDown(39)) { // Right
        objs.cannon.x += 4;
	}

  if (inputHandler.isPressed(32)) { // Space
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
    ctx.strokeRect(safeArea.x, safeArea.y, safeArea.w, safeArea.h);
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

    safeArea.x = settings.lineW
    safeArea.y = Math.floor(settings.lineW / 2) + settings.headerSize
    safeArea.w = w - 2 * settings.lineW
    safeArea.h = h - settings.footerSize - settings.headerSize - settings.lineW

    showSafeAreaZone(ctx) // debug
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
    });
}
