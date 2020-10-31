import Sprite from './sprite'
import Cannon from './cannon'
import Bunker from './bunker'
import Bullet from './bullet'
import Alien from './alien'
import InputHandler from './input-handler'

import assetPath from '../assets/invaders.png'

let canvasForReplay;

let gs = { // game state. Dont change! It isn't a settings!
    seconds:{
        aShoot: 0,
    },
    level: 1,
    score: 0,
    lives: 3333,
    goToNextLevel: false,
}

let settings = {
    lineW: 6, // width of background line
    headerSize: 50, // top offset in background
    footerSize: 50, // bottom offset in background
    game:{
        nextLevelWait: 2000, // ms waiting time between levels
    },
    alien: {
        alienTypes: [2, 1, 0, 2, 1, 0], // types numbers in each line
        inOneLine: 11, // pcs // amount of alien in one line. It means amount rows
        shootTime: 1, // sec // each shootTime lower of aliens are shoot
        size: 33, // px // size of one alien
        shootProbability: 0.1, // probability of alien shooting
        BulletMult: 300, // amount steps like a speed
        injDist: 33, // distance from center of alien ot point C on line in detecting injuring
        killDist: 15, // distance from center of alien ot point C on line in detecting killing. < injDist
        collisionMaxStepPx: 1, // step on line while detecting collision. <= killDist. This parameter should be == 1 if bunkers intersect by masks
        aliveAfterKilling: 1500, // ms alive time when killing
        shootInterval: 200, // ms between few shootings
        makeNotInjuredTime: 2000, // ms how much time alien will be injured. Injured could shoot only one bullet per time
        blockMovingVx: 1, // moving step in x axis
        blockMovingVy: 1, // moving step in y axis
        blockMovingTime: 100, // ms between moving
    },
    cannon: {
        step: 4, // px // each tep of <- or -> move cannon on step px
        baseBulletSpeed: 8,
        bulletSpeedProbabilityRange: 0.2,
        killDist: 11, // distance from center of alien to point C on line in detecting killing. < injDist
        collisionMaxStepPx: 1, // step on line while detecting collision. <= killDist. This parameter should be == 1 if bunkers intersect by masks
    },
    bunker:{
        amount: 4,
        distanceFromCannon: 50,
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
    bunkers: [],
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

    canvasForReplay = canvas
    setAliens(gs.level)

    objs.cannon = new Cannon(100, canvas.height - settings.footerSize - sprites.cannon.h - Math.floor(settings.lineW / 2), sprites.cannon);

	for(let i = 0; i < settings.bunker.amount; i++)
    {
        objs.bunkers.push(new Bunker(100, canvas.height - settings.footerSize - sprites.bunker.h - Math.floor(settings.lineW / 2) - settings.bunker.distanceFromCannon, sprites.bunker))
    }

    gs.timer = setTimeout(timer_tictoc, 1000);
    setTimerMoving();
}

function setTimerMoving()
{
    if(isAnyAliveAliens())
    {
        moveAliens()
    }
    setTimeout(setTimerMoving, settings.alien.blockMovingTime)
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

export function update(time)
{
    if(gs.lives > 0)
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
            const bulletX = objs.cannon.x + Math.floor(objs.cannon._sprite.h / 2);
            const bulletY = objs.cannon.y;
            const bulletVy = -1 * settings.cannon.baseBulletSpeed * (1 - settings.cannon.bulletSpeedProbabilityRange + Math.random() * settings.cannon.bulletSpeedProbabilityRange * 2)
            objs.bullets.push(new Bullet(bulletX, bulletY, 0, bulletVy, 4, 8, "green"));
        }

        objs.bullets.forEach(b => b.update(time));
        checkBulletIntersection()
        checkAreBulletsInSafeArea()
        if(!isAnyAliveAliens())
        {
            goToNextLevel()
        }
    }
    else if (inputHandler.isPressed(32))
    {
        // replay
        objs.cannon = null
        objs.bullets = []
        objs.aliens = []
        objs.bunkers = []
        gs.lives = 3
        gs.score = 0
        gs.level = 1
        gs.seconds.aShoot = 0

        init(canvasForReplay)
    }
}

function isAnyAliveAliens()
{
    for(let i = 0; i < objs.aliens.length; i++)
    {
        if(objs.aliens[i].isAlive)
        {
            return true
        }
    }
    return false
}

function moveAliens()
{
    if(gs.lives > 0 && gs.goToNextLevel == false)
    {
        // Y axis
        settings.alien.blockMovingVy *= (Math.random() < 0.1) ? -1 : 1

        if (settings.alien.blockMovingVy > 0) {
            // check if bottom of block will not touch top of bunkers
            let touch = false
            // first let's find bottom alive alien
            let founded = false
            let bottom = -1
            for (let i = settings.alien.alienTypes.length - 1; i >= 0 && !founded; i--) {
                for (let j = 0; j < settings.alien.inOneLine; j++) {
                    if (objs.aliens[i * settings.alien.inOneLine + j].isAlive) {
                        founded = true
                        bottom = objs.aliens[i * settings.alien.inOneLine + j].y + settings.alien.size;
                    }
                }
            }
            if (!founded) {
                return
            }
            touch = bottom + settings.alien.blockMovingVy + 0.5 >= objs.bunkers[0].y
            settings.alien.blockMovingVy = (touch ? -1 : 1) * Math.abs(settings.alien.blockMovingVy)
        } else {
            // check if top of block will not touch top of safe area
            let touch = false
            // first let's find top alive alien
            let founded = false
            let top = -1
            for (let i = 0; i < settings.alien.alienTypes.length && !founded; i++) {
                for (let j = 0; j < settings.alien.inOneLine; j++) {
                    if (objs.aliens[i * settings.alien.inOneLine + j].isAlive) {
                        founded = true
                        top = objs.aliens[i * settings.alien.inOneLine + j].y;
                    }
                }
            }
            if (!founded) {
                return
            }
            touch = top + settings.alien.blockMovingVy - 0.5 < safeArea.t
            settings.alien.blockMovingVy = touch ? Math.abs(settings.alien.blockMovingVy) : settings.alien.blockMovingVy
        }
        objs.aliens.forEach(a => a.y += settings.alien.blockMovingVy);

        // X axis
        //settings.alien.blockMovingVx *= (Math.random() < 0.05)? -1: 1

        if (settings.alien.blockMovingVx > 0) {
            // check if bottom of block will not touch top of bunkers
            let touch = false
            // first let's find right alive alien
            let founded = false
            let right = -1
            for (let j = settings.alien.inOneLine - 1; j >= 0; j--) {
                for (let i = 0; i < settings.alien.alienTypes.length && !founded; i++) {
                    if (objs.aliens[i * settings.alien.inOneLine + j].isAlive) {
                        founded = true
                        right = objs.aliens[i * settings.alien.inOneLine + j].x + settings.alien.size;
                    }
                }
            }
            if (!founded) {
                return
            }
            touch = right + settings.alien.blockMovingVx + 5 >= safeArea.r
            settings.alien.blockMovingVx = touch ? -1 * Math.abs(settings.alien.blockMovingVx) : settings.alien.blockMovingVx
        } else {
            // check if top of block will not touch top of safe area
            let touch = false
            // first let's find left alive alien
            let founded = false
            let left = -1
            for (let j = 0; j <= settings.alien.inOneLine; j++) {
                for (let i = 0; i < settings.alien.alienTypes.length && !founded; i++) {
                    if (objs.aliens[i * settings.alien.inOneLine + j].isAlive) {
                        founded = true
                        left = objs.aliens[i * settings.alien.inOneLine + j].x;
                    }
                }
            }
            if (!founded) {
                return
            }
            touch = left + settings.alien.blockMovingVx - 5 < safeArea.l
            settings.alien.blockMovingVx = touch ? Math.abs(settings.alien.blockMovingVx) : settings.alien.blockMovingVx
        }
        objs.aliens.forEach(a => a.x += settings.alien.blockMovingVx);
    }
}

function setAliens(lvl)
{
    if(lvl === 1)
    {
        settings.alien.alienTypes = [2, 1, 0, 2, 1, 0] // types numbers in each line
        settings.alien.inOneLine = 11 // pcs // amount of alien in one line. It means amount rows
        settings.alien.shootProbability = 0.1
        settings.alien.blockMovingTime = 100
    }
    else if(lvl === 2)
    {
        settings.alien.alienTypes = [2, 1, 2, 1] // types numbers in each line
        settings.alien.inOneLine = 5 // pcs // amount of alien in one line. It means amount rows
        settings.alien.shootProbability = 0.5
        settings.alien.blockMovingTime = 70
    }
    else
    {
        settings.alien.alienTypes = [2, 1, 0] // types numbers in each line
        settings.alien.inOneLine = 5 // pcs // amount of alien in one line. It means amount rows
        settings.alien.shootProbability = 0.75
        settings.alien.blockMovingTime = 50
    }

    objs.aliens = []
    for (let i = 0, len = settings.alien.alienTypes.length; i < len; i++)
    {
        const alienType = settings.alien.alienTypes[i];
        for (let j = 0; j < settings.alien.inOneLine; j++)
        {
            let alienX = settings.alien.size * (j + 1);
            let alienY = settings.alien.size * (i + 1) + settings.headerSize;

            objs.aliens.push(new Alien(alienX, alienY, sprites.aliens[alienType], alienType));
        }
    }
}

function goToNextLevel()
{
    if(gs.goToNextLevel === false)
    {
        stopGame()
        gs.goToNextLevel = true
        setTimeout(startNextLevel, settings.game.nextLevelWait)
    }
}

function startNextLevel()
{
    gs.goToNextLevel = false
    objs.aliens = []
    objs.bullets = []
    gs.level += 1
    setAliens(gs.level)
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
            objs.bullets.splice(i,1);
        }
    }
}

function checkBulletIntersection()
{
    for(let i = 0; i < objs.bullets.length; i++)
    {
        if (objs.bullets[i].color === "white")
        {
            checkCannonOnLine(objs.bullets[i].x, objs.bullets[i].y,objs.bullets[i].x-objs.bullets[i].vx, objs.bullets[i].y - objs.bullets[i].vy, i)
        }
        else if(objs.bullets[i].color === "green")
        {
            checkAlienOnLine(objs.bullets[i].x, objs.bullets[i].y,objs.bullets[i].x-objs.bullets[i].vx, objs.bullets[i].y - objs.bullets[i].vy, i)
        }
    }
}

function checkAlienOnLine(ax, ay, bx ,by,indBullet)
{
    const vxFull = ax - bx
    const vyFull = ay - by
    const steps = Math.floor(Math.max(Math.abs(vxFull), Math.abs(vyFull)) / settings.alien.collisionMaxStepPx)

    // check for boxes between a and b
    let xStep = 0
    let yStep = 0
    let stepCounter = 1 // not 0 because we don't need to check point b
    let killed = false
    let toPointA = false
    let c = {
        x: bx,
        y: by,
    }

    if (steps !== 0)
    {
        xStep = vxFull / steps
        yStep = vyFull / steps
        c.x += xStep
        c.y += yStep
    }
    else
    {
        stepCounter = steps + 1
        toPointA = true
        c.x = ax
        c.y = ay
    }

    while ((stepCounter <= steps  || toPointA) && !killed)
    {
        for(let i = 0; i < objs.aliens.length; i++)
        {
            if(objs.aliens[i].isAlive)
            {
                let xDist = Math.abs(c.x - (objs.aliens[i].x + settings.alien.size / 2))
                if(xDist <= settings.alien.injDist / 2)
                {
                    let yDist = Math.abs((c.y - (objs.aliens[i].y + settings.alien.size / 2)))
                    if(yDist <= settings.alien.injDist / 2)
                    {
                        injureAlien(i)
                        if(xDist <= settings.alien.killDist / 2 && yDist <= settings.alien.killDist / 2)
                        {
                            killAlien(i)
                            killed = true
                            // destroyBullet
                            objs.bullets.splice(indBullet,1)
                        }
                    }
                }
            }
        }

        // check is here bunker
        for(let i = 0; i < objs.bunkers.length && !killed; i++)
        {
            if(objs.bunkers[i].hasPoint(Math.floor(c.x), Math.floor(c.y)))
            {
                objs.bullets.splice(indBullet,1)
                killed = true
            }
        }

        if(toPointA)
        {
            toPointA = false
        }
        else if (steps !== 0)
        {
            c.x += xStep
            c.y += yStep
            stepCounter += 1

            if (stepCounter > steps)
            {
                toPointA = true
                c.x = ax
                c.y = ay
            }
        }
    }
}

function injureAlien(index)
{
    if(!objs.aliens[index].isInjured)
    {
        objs.aliens[index].blinkTime = 350
        objs.aliens[index].isInjured = true
    }
    setTimeout(makeNotInjured, settings.alien.makeNotInjuredTime, index)
}

function makeNotInjured(index)
{
    objs.aliens[index].blinkTime = 1000
    objs.aliens[index].isInjured = false
}

function killAlien(index)
{
    if(objs.aliens[index].blinkTime !== 100)
    {
        gs.score += gs.level
        objs.aliens[index].blinkTime = 100
        setTimeout(makeAlienIsNotAlive, settings.alien.aliveAfterKilling, index)
    }
}

function makeAlienIsNotAlive(index)
{
    objs.aliens[index].isAlive = false
}

function checkCannonOnLine(ax, ay, bx ,by, indBullet)
{
    const vxFull = ax - bx
    const vyFull = ay - by
    const steps = Math.floor(Math.max(Math.abs(vxFull), Math.abs(vyFull)) / settings.cannon.collisionMaxStepPx)

    // check for boxes between a and b
    let xStep = 0
    let yStep = 0
    let stepCounter = 1 // not 0 because we don't need to check point b
    let killed = false
    let toPointA = false
    let c = {
        x: bx,
        y: by,
    }

    if (steps !== 0)
    {
        xStep = vxFull / steps
        yStep = vyFull / steps
        c.x += xStep
        c.y += yStep
    }
    else
    {
        stepCounter = steps + 1
        toPointA = true
        c.x = ax
        c.y = ay
    }

    while ((stepCounter <= steps  || toPointA) && !killed)
    {
        let yDist = Math.abs((c.y - (objs.cannon.y + objs.cannon._sprite.h / 2)))

        if(yDist <= settings.cannon.killDist / 2)
        {
            let xDist = Math.abs(c.x - (objs.cannon.x + objs.cannon._sprite.w / 2))
            if(xDist <= settings.cannon.killDist / 2)
            {
                killCannon()
                killed = true
                // destroyBullet
                objs.bullets.splice(indBullet,1);
            }
        }

        // check is here bunker
        for(let i = 0; i < objs.bunkers.length && !killed; i++)
        {
            if(objs.bunkers[i].hasPoint(Math.floor(c.x), Math.floor(c.y)))
            {
                objs.bullets.splice(indBullet,1)
                killed = true
            }
        }

        if(toPointA)
        {
            toPointA = false
        }
        else if (steps !== 0)
        {
            c.x += xStep
            c.y += yStep
            stepCounter += 1

            if (stepCounter > steps)
            {
                toPointA = true
                c.x = ax
                c.y = ay
            }
        }
    }
}

function killCannon()
{
    gs.lives -= 1
    if(gs.lives <= 0)
    {
        stopGame()
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

    // locate bunkers
    for(let i = 1; i <= objs.bunkers.length; i++)
    {
        objs.bunkers[i - 1].x = i * Math.floor(safeArea.r / (settings.bunker.amount + 1))
    }

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

function drawNextLevel(ctx, w, h)
{
    const sqrWPart = Math.floor(w / 10)
    const sqrHPart = Math.floor(h / 10)

    ctx.clearRect(sqrWPart*3, sqrHPart*3, sqrWPart*4, sqrHPart*4);
    ctx.beginPath();
    ctx.lineWidth = settings.lineW;
    ctx.strokeStyle = "green"
    ctx.strokeRect(sqrWPart*3, sqrHPart*3, sqrWPart*4, sqrHPart*3);
    ctx.closePath();

    ctx.font = "30px Verdana";
    ctx.textBaseline="top";
    ctx.textAlign = "center";
    ctx.strokeStyle = "white"
    ctx.fillText("NEXT LEVEL", w / 2, sqrHPart*3 + settings.lineW + 80);

    ctx.font = "15px Verdana";
    ctx.fillText("you are not bad", w / 2, sqrHPart*3 + settings.lineW + 80 * 2);
}

export function draw(canvas, time) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground(ctx, canvas.width, canvas.height);
    objs.aliens.forEach(a => a.draw(ctx, time));
    objs.cannon.draw(ctx);
    objs.bullets.forEach(b => b.draw(ctx));
    objs.bunkers.forEach(b => b.draw(ctx));
    if(gs.lives <= 0)
    {
        drawGameOver(ctx, canvas.width, canvas.height)
    }
    if(gs.goToNextLevel)
    {
        drawNextLevel(ctx, canvas.width, canvas.height)
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
                     let timeout = Math.floor(Math.random() * settings.alien.shootTime * 1000)
                     setTimeout(alienMakeShoot, timeout, maxJ * i + j);
                     if(!objs.aliens[maxJ * i + j].isInjured)
                     {
                         for (let k = 1; k <= objs.aliens[maxJ * i + j].alienType; k++)
                         {
                             setTimeout(alienMakeShoot, timeout + k * settings.alien.shootInterval, maxJ * i + j);
                         }
                     }
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
