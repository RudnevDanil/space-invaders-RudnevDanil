export default class Sounds
{
    constructor()
    {
        this.cannonShoot = document.getElementById("cannonShoot");
        this.background = document.getElementById("background");
        this.alienDead = document.getElementById("alienDead");
        this.cannonDead = document.getElementById("cannonDead");
        this.gameOver = document.getElementById("gameOver");

    }

    playBackground()
    {
        this.background.play();
        this.background.loop = true;
    }

    playCannonShoot()
    {
        this.cannonShoot.pause();
        this.cannonShoot.currentTime = 0;
        this.cannonShoot.play();
    }

    playAlienDead()
    {
        this.alienDead.pause();
        this.alienDead.currentTime = 0;
        this.alienDead.play();
    }

    playCannonDead()
    {
        this.cannonDead.pause();
        this.cannonDead.currentTime = 0;
        this.cannonDead.play();
    }

    playGameOver()
    {
        this.background.pause();
        this.background.currentTime = 0;

        this.gameOver.currentTime = 0;
        this.gameOver.play();
        this.gameOver.addEventListener("ended", this.replayBackground.bind(null,this));
    }

    replayBackground(player)
    {
        player.background.play();
        player.background.loop = true;
    }
}