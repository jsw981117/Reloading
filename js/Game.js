class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.width = 480;
        this.height = 854;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.config = {
            enemySpeed: 30,
            enemyHP: 50,
            lanes: 5
        };

        this.timeScale = 1;
        this.godMode = false;

        this.gameState = 'TITLE';
        this.gameTime = 0;
        this.maxGameTime = 540;
        this.boss3minSpawned = false;
        this.boss6minSpawned = false;
        this.boss9minSpawned = false;
        this.bestScore = localStorage.getItem('bestScore') || null;

        this.player = new Player(this.width, this.height);
        this.bullets = [];
        this.enemies = [];
        this.explosions = [];

        this.levelUpSystem = new LevelUpSystem();
        this.ui = new UI(this);
        this.debugMenu = new DebugMenu(this);

        this.exp = 0;
        this.level = 0;
        this.expToNextLevel = 10;

        this.enemySpawnTimer = 0;
        this.enemySpawnInterval = 2;

        this.isPaused = false;
        this.inputX = null;
        this.inputY = null;

        this.setupInput();
        this.ui.showTitle();
    }

    setupInput() {
        // 터치 입력
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.inputX = ((touch.clientX - rect.left) / rect.width) * this.width;
            this.inputY = ((touch.clientY - rect.top) / rect.height) * this.height;
        });

        this.canvas.addEventListener('touchend', () => {
            this.inputX = null;
            this.inputY = null;
        });

        // 마우스 입력
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.inputX = ((e.clientX - rect.left) / rect.width) * this.width;
            this.inputY = ((e.clientY - rect.top) / rect.height) * this.height;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.inputX = null;
            this.inputY = null;
        });
    }

    update(deltaTime) {
        if (this.gameState !== 'PLAYING' || this.isPaused) return;

        deltaTime *= this.timeScale;

        // 게임 타이머
        this.gameTime += deltaTime;

        // 보스 스폰 체크
        this.checkBossSpawn();

        // 플레이어 업데이트 & 사격
        const newBullets = this.player.update(deltaTime, this.inputX, this.inputY);
        if (newBullets) {
            if (Array.isArray(newBullets)) {
                this.bullets.push(...newBullets);
            } else {
                this.bullets.push(newBullets);
            }
        }

        // 총알 업데이트
        this.bullets = this.bullets.filter(bullet => {
            bullet.update(deltaTime);
            return bullet.active && !isOffScreen(bullet.x, bullet.y, bullet.width, bullet.height, this.width, this.height);
        });

        // 적 업데이트
        this.enemies.forEach(enemy => enemy.update(deltaTime, this.enemies));

        // 적 화면 하단 도달 체크
        this.checkEnemyReachBottom();

        // 충돌 감지
        this.checkCollisions();
        this.checkPlayerEnemyCollision();

        // 적 생성
        this.enemySpawnTimer += deltaTime;
        if (this.enemySpawnTimer >= this.enemySpawnInterval) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }

        // 게임 오버/클리어 체크
        this.checkGameOver();

        // UI 업데이트
        this.ui.updateHP(this.player.hp);
        this.ui.updateAmmo(this.player.magazine.getRemainingAmmo(), this.player.magazine.getTotalAmmo());
        this.ui.showReload(this.player.magazine.isReloading);
        this.ui.updateTimeline(this.gameTime, this.maxGameTime);
    }

    checkCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                const bounds = enemy.getBounds();

                if (checkCollision(
                    { x: bullet.x - bullet.width / 2, y: bullet.y - bullet.height / 2, width: bullet.width, height: bullet.height },
                    bounds
                )) {
                    const killed = enemy.takeDamage(bullet.damage);
                    const effect = bullet.onHit(enemy);

                    if (effect && effect.type === 'explosion') {
                        this.createExplosion(effect.x, effect.y, effect.radius, effect.damage);
                    }

                    if (killed) {
                        bullet.onKill(enemy);
                        if (enemy.isBoss) {
                            if (enemy.size === 3) {
                                this.gameClear();
                            } else {
                                this.levelUp();
                            }
                        } else {
                            this.addExp(10);
                        }
                    }

                    break;
                }
            }
        }
    }

    createExplosion(x, y, radius, damage) {
        this.enemies.forEach(enemy => {
            const dist = getDistance(x, y, enemy.x, enemy.y);
            if (dist < radius) {
                const killed = enemy.takeDamage(damage);
                if (killed) {
                    this.addExp(10);
                }
            }
        });
    }

    spawnEnemy() {
        const lanes = this.config.lanes;
        const laneWidth = this.width / lanes;
        const y = -40;

        for (let i = 0; i < lanes; i++) {
            const x = laneWidth * i + laneWidth / 2;
            this.enemies.push(new Enemy(x, y, i, this.config));
        }
    }

    addExp(amount) {
        this.exp += amount;
        if (this.exp >= this.expToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.exp = 0;
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);

        this.isPaused = true;
        const choices = this.levelUpSystem.generateChoices();
        this.ui.showLevelUp(choices, (choice) => {
            this.levelUpSystem.applyChoice(choice, this.player);
            this.isPaused = false;
        });
    }

    checkBossSpawn() {
        if (!this.boss3minSpawned && this.gameTime >= 180) {
            this.spawnBoss(2);
            this.boss3minSpawned = true;
        }
        if (!this.boss6minSpawned && this.gameTime >= 360) {
            this.spawnBoss(2);
            this.boss6minSpawned = true;
        }
        if (!this.boss9minSpawned && this.gameTime >= 540) {
            this.spawnBoss(3);
            this.boss9minSpawned = true;
        }
    }

    spawnBoss(size) {
        const laneWidth = this.width / this.config.lanes;
        const centerLane = Math.floor(this.config.lanes / 2);
        const x = laneWidth * centerLane + laneWidth / 2;
        const y = -100;
        this.enemies.push(new Enemy(x, y, centerLane, this.config, size, true));
    }

    checkEnemyReachBottom() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (enemy.y >= this.height) {
                if (!this.godMode) {
                    this.player.takeDamage(10);
                }
                enemy.active = false;
            }
        }
        this.enemies = this.enemies.filter(enemy => enemy.active);
    }

    checkPlayerEnemyCollision() {
        const playerBounds = {
            x: this.player.x - this.player.width / 2,
            y: this.player.y - this.player.height / 2,
            width: this.player.width,
            height: this.player.height
        };

        this.enemies.forEach(enemy => {
            if (enemy.playerCollisionCooldown <= 0) {
                const bounds = enemy.getBounds();
                if (checkCollision(playerBounds, bounds)) {
                    if (!this.godMode) {
                        this.player.takeDamage(enemy.attackPower);
                    }
                    enemy.playerCollisionCooldown = 1.0;
                    enemy.applyStatusEffect({ type: 'shock', duration: 1 });
                }
            }
        });
    }

    checkGameOver() {
        if (this.player.hp <= 0 && !this.godMode) {
            this.gameOver();
        }
    }

    startGame() {
        this.gameState = 'PLAYING';
        this.gameTime = 0;
        this.boss3minSpawned = false;
        this.boss6minSpawned = false;
        this.boss9minSpawned = false;

        this.player = new Player(this.width, this.height);
        this.bullets = [];
        this.enemies = [];
        this.exp = 0;
        this.level = 0;
        this.expToNextLevel = 10;
        this.enemySpawnTimer = 0;

        this.levelUpSystem = new LevelUpSystem();

        this.ui.hideAll();
        this.ui.showHUD();
    }

    resetGame() {
        this.startGame();
    }

    gameOver() {
        this.gameState = 'GAMEOVER';
        const survivalTime = this.formatTime(this.gameTime);
        this.ui.showGameOver(survivalTime);
        this.saveBestScore(survivalTime);
    }

    gameClear() {
        this.gameState = 'CLEAR';
        this.ui.showClear();
        this.saveBestScore('게임 클리어!');
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}분 ${secs}초`;
    }

    saveBestScore(score) {
        if (!this.bestScore || score === '게임 클리어!') {
            this.bestScore = score;
            localStorage.setItem('bestScore', score);
            this.ui.updateBestScore(score);
        } else if (score !== '게임 클리어!') {
            const currentSeconds = this.gameTime;
            const bestSeconds = this.parseBestScore(this.bestScore);
            if (currentSeconds > bestSeconds) {
                this.bestScore = score;
                localStorage.setItem('bestScore', score);
                this.ui.updateBestScore(score);
            }
        }
    }

    parseBestScore(scoreString) {
        if (scoreString === '게임 클리어!') return Infinity;
        const match = scoreString.match(/(\d+)분 (\d+)초/);
        if (match) {
            return parseInt(match[1]) * 60 + parseInt(match[2]);
        }
        return 0;
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.gameState === 'PLAYING') {
            this.player.draw(this.ctx);
            this.bullets.forEach(bullet => bullet.draw(this.ctx));
            this.enemies.forEach(enemy => enemy.draw(this.ctx));
        }
    }
}
