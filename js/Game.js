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

        this.player = new Player(this.width, this.height);
        this.bullets = [];
        this.enemies = [];
        this.explosions = [];

        this.levelUpSystem = new LevelUpSystem();
        this.ui = new UI();
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
        if (this.isPaused) return;

        deltaTime *= this.timeScale;

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
        this.enemies = this.enemies.filter(enemy => enemy.active && enemy.y < this.height + 50);

        // 충돌 감지
        this.checkCollisions();

        // 적 생성
        this.enemySpawnTimer += deltaTime;
        if (this.enemySpawnTimer >= this.enemySpawnInterval) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }

        // UI 업데이트
        this.ui.updateHP(this.player.hp, this.player.stats.maxHP);
        this.ui.updateAmmo(this.player.magazine.getRemainingAmmo(), this.player.magazine.getTotalAmmo());
        this.ui.showReload(this.player.magazine.isReloading);
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
                        this.addExp(10);
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

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.player.draw(this.ctx);

        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
    }
}
