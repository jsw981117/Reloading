class StatusEffect {
    constructor(type, data) {
        this.type = type;
        this.data = data;
        this.timer = data.duration;
        this.tickTimer = 0;
    }

    update(deltaTime, enemy) {
        this.timer -= deltaTime;

        switch (this.type) {
            case 'burn':
                this.tickTimer += deltaTime;
                if (this.tickTimer >= 1) {
                    enemy.takeDamage(this.data.damage);
                    this.tickTimer = 0;
                }
                break;

            case 'freeze':
                enemy.speedMultiplier = this.data.slowFactor;
                break;

            case 'shock':
                enemy.isStunned = true;
                break;
        }

        return this.timer > 0;
    }

    onRemove(enemy) {
        if (this.type === 'freeze') {
            enemy.speedMultiplier = 1;
        }
        if (this.type === 'shock') {
            enemy.isStunned = false;
        }
    }
}
