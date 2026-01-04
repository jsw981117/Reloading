let game;
let lastTime = 0;

function init() {
    const canvas = document.getElementById('gameCanvas');
    game = new Game(canvas);
    requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (deltaTime < 0.1) {
        game.update(deltaTime);
        game.draw();
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener('load', init);
