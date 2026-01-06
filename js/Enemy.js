class Enemy {
    constructor(x, y, lane = 0, config = null, size = 1, isBoss = false) {
        this.x = x;
        this.y = y;
        this.lane = lane;
        this.size = size;
        this.isBoss = isBoss;

        // 크기별 설정
        if (size === 2) {
            this.width = 80;
            this.height = 80;
            this.maxHP = 500;
        } else if (size === 3) {
            this.width = 120;
            this.height = 120;
            this.maxHP = 2000;
        } else {
            this.width = 40;
            this.height = 40;
            this.maxHP = config ? config.enemyHP : 50;
        }

        this.hp = this.maxHP;
        this.baseSpeed = config ? config.enemySpeed : 30;
        this.speed = this.baseSpeed;
        this.speedMultiplier = 1;
        this.isStunned = false;
        this.attackPower = 10;
        this.playerCollisionCooldown = 0;

        this.statusEffects = [];
        this.active = true;
    }

    update(deltaTime, enemies) {
        // 플레이어 충돌 쿨다운
        if (this.playerCollisionCooldown > 0) {
            this.playerCollisionCooldown -= deltaTime;
        }

        // 상태이상 업데이트
        this.statusEffects = this.statusEffects.filter(effect => {
            const stillActive = effect.update(deltaTime, this);
            if (!stillActive) {
                effect.onRemove(this);
            }
            return stillActive;
        });

        // 이동
        if (!this.isStunned) {
            const moveDistance = this.speed * this.speedMultiplier * deltaTime;
            const targetY = this.y + moveDistance;

            // 같은 레인의 앞 적 블로킹 체크
            const blockingEnemy = this.findBlockingEnemy(enemies, targetY);

            if (blockingEnemy) {
                // 앞 적과 충돌하지 않는 선까지만 이동
                const maxY = blockingEnemy.y - blockingEnemy.height / 2 - this.height / 2 - 1;
                this.y = Math.min(targetY, maxY);
            } else {
                this.y = targetY;
            }
        }
    }

    findBlockingEnemy(enemies, targetY) {
        for (const enemy of enemies) {
            if (enemy === this || !enemy.active) continue;

            // 같은 레인 체크
            if (enemy.lane === this.lane) {
                // 앞에 있는 적인지 확인
                if (enemy.y < this.y) {
                    const enemyBottom = enemy.y + enemy.height / 2;
                    const myTop = targetY - this.height / 2;

                    // 충돌 예상 체크
                    if (myTop <= enemyBottom) {
                        return enemy;
                    }
                }
            }
        }

        return null;
    }

    draw(ctx) {
        // 상태이상 색상
        let color = '#f00';
        if (this.statusEffects.some(e => e.type === 'burn')) {
            color = '#ff4400';
        } else if (this.statusEffects.some(e => e.type === 'freeze')) {
            color = '#00aaff';
        } else if (this.statusEffects.some(e => e.type === 'shock')) {
            color = '#ffff00';
        }

        // 보스 색상
        if (this.isBoss) {
            color = this.size === 3 ? '#800' : '#a00';
        }

        ctx.fillStyle = color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        // 보스 테두리
        if (this.isBoss) {
            ctx.strokeStyle = this.size === 3 ? '#f00' : '#f80';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }

        // HP 바
        const barWidth = this.width;
        const barHeight = this.isBoss ? 8 : 4;
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - barWidth / 2, this.y - this.height / 2 - 12, barWidth, barHeight);
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.x - barWidth / 2, this.y - this.height / 2 - 12, barWidth * (this.hp / this.maxHP), barHeight);
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.active = false;
            return true; // 처치됨
        }
        return false;
    }

    applyStatusEffect(effectData) {
        // 같은 타입 상태이상은 덮어씀
        this.statusEffects = this.statusEffects.filter(e => e.type !== effectData.type);
        this.statusEffects.push(new StatusEffect(effectData.type, effectData));
    }

    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
}
