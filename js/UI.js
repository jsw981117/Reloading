class UI {
    constructor(game) {
        this.game = game;

        // Screens
        this.titleScreen = document.getElementById('title-screen');
        this.gameoverScreen = document.getElementById('gameover-screen');
        this.clearScreen = document.getElementById('clear-screen');
        this.hud = document.getElementById('hud');

        // HUD elements
        this.hpDisplay = document.getElementById('hp-display');
        this.ammoCount = document.getElementById('ammo-count');
        this.reloadIndicator = document.getElementById('reload-indicator');
        this.timelineFill = document.getElementById('timeline-fill');
        this.bestScoreDisplay = document.getElementById('best-score');
        this.survivalTimeDisplay = document.getElementById('survival-time');

        // Modals
        this.levelupModal = document.getElementById('levelup-modal');
        this.levelupChoices = document.getElementById('levelup-choices');

        this.currentChoices = null;
        this.onChoiceCallback = null;

        this.setupButtons();
    }

    setupButtons() {
        document.getElementById('start-btn').onclick = () => this.game.startGame();
        document.getElementById('restart-btn').onclick = () => this.game.resetGame();
        document.getElementById('title-btn').onclick = () => this.showTitle();
        document.getElementById('clear-restart-btn').onclick = () => this.game.resetGame();
        document.getElementById('clear-title-btn').onclick = () => this.showTitle();
    }

    showTitle() {
        this.hideAll();
        this.titleScreen.classList.remove('hidden');
        this.game.gameState = 'TITLE';
        if (this.game.bestScore) {
            this.bestScoreDisplay.textContent = `최고 점수: ${this.game.bestScore}`;
        }
    }

    showGameOver(survivalTime) {
        this.hideAll();
        this.gameoverScreen.classList.remove('hidden');
        this.survivalTimeDisplay.textContent = `생존 시간: ${survivalTime}`;
    }

    showClear() {
        this.hideAll();
        this.clearScreen.classList.remove('hidden');
    }

    hideAll() {
        this.titleScreen.classList.add('hidden');
        this.gameoverScreen.classList.add('hidden');
        this.clearScreen.classList.add('hidden');
        this.hud.classList.add('hidden');
    }

    showHUD() {
        this.hud.classList.remove('hidden');
    }

    updateTimeline(gameTime, maxTime) {
        const percent = Math.min((gameTime / maxTime) * 100, 100);
        this.timelineFill.style.width = percent + '%';
    }

    updateHP(currentHP) {
        this.hpDisplay.textContent = `HP: ${currentHP}`;
    }

    updateBestScore(score) {
        this.bestScoreDisplay.textContent = `최고 점수: ${score}`;
    }

    updateAmmo(current, total) {
        this.ammoCount.textContent = `${current}/${total}`;
    }

    showReload(show) {
        if (show) {
            this.reloadIndicator.classList.add('active');
        } else {
            this.reloadIndicator.classList.remove('active');
        }
    }

    showLevelUp(choices, callback) {
        this.currentChoices = choices;
        this.onChoiceCallback = callback;

        this.levelupChoices.innerHTML = '';

        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `<strong>${choice.label}</strong>`;

            if (choice.type === 'stat') {
                btn.innerHTML += `<div>${this.getStatDescription(choice)}</div>`;
            } else {
                btn.innerHTML += `<div>${this.getBulletDescription(choice)}</div>`;
            }

            btn.onclick = () => this.selectChoice(index);
            this.levelupChoices.appendChild(btn);
        });

        this.levelupModal.classList.remove('hidden');
    }

    selectChoice(index) {
        const choice = this.currentChoices[index];
        this.levelupModal.classList.add('hidden');

        if (this.onChoiceCallback) {
            this.onChoiceCallback(choice);
        }
    }

    getStatDescription(choice) {
        switch (choice.stat) {
            case 'attackSpeed':
                return '발사 속도가 빨라집니다';
            case 'magazineSize':
                return '탄창 크기가 늘어납니다';
            case 'reloadTime':
                return '재장전 속도가 빨라집니다';
            case 'bulletSpeed':
                return '총알 속도가 빨라집니다';
            case 'range':
                return '사거리가 늘어납니다';
            case 'maxHP':
                return '최대 체력이 증가합니다';
            case 'moveSpeed':
                return '이동 속도가 빨라집니다';
            default:
                return '';
        }
    }

    getBulletDescription(choice) {
        const descriptions = {
            'piercing': '적을 관통하는 총알',
            'explosive': '명중 시 폭발하는 총알',
            'flame': '화상을 입히는 총알',
            'freeze': '적을 느리게 하는 총알',
            'shock': '적을 기절시키는 총알',
            'scatter': '여러 발로 퍼지는 총알'
        };
        return descriptions[choice.bulletType] || '';
    }
}
