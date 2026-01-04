class Enemy {
    constructor(x, y, size = 1) {
        this.x = x;
        this.y = y;
        this.size = size;

        // 크기별 설정
        switch (size) {
            case 0.5:
                this.width = 20;
                this.height = 20;
                this.maxHP = 20;
                break;
            case 2:
                this.width = 80;
                this.height = 80;
                this.maxHP = 200;
                break;
            default:
                this.width = 40;
                this.height = 40;
                this.maxHP = 50;
        }

        this.hp = this.maxHP;
        this.baseSpeed = 50;
        this.speed = this.baseSpeed;
        this.speedMultiplier = 1;
        this.isStunned = false;

        this.statusEffects = [];
        this.active = true;
    }

    update(deltaTime) {
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
            this.y += this.speed * this.speedMultiplier * deltaTime;
        }
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

        ctx.fillStyle = color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        // HP 바
        const barWidth = this.width;
        const barHeight = 4;
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - barWidth / 2, this.y - this.height / 2 - 8, barWidth, barHeight);
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.x - barWidth / 2, this.y - this.height / 2 - 8, barWidth * (this.hp / this.maxHP), barHeight);
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
