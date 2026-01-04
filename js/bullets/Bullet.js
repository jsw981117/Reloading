class Bullet {
    constructor(x, y, playerStats) {
        this.x = x;
        this.y = y;
        this.speed = playerStats.bulletSpeed;
        this.range = playerStats.range;
        this.distanceTraveled = 0;

        this.damage = 10;
        this.pierce = 0;
        this.pierceCount = 0;
        this.explosionRadius = 0;
        this.spreadAngle = 0;
        this.splitCount = 0;
        this.statusEffect = null;

        this.width = 6;
        this.height = 12;
        this.color = '#fff';
        this.active = true;
    }

    update(deltaTime) {
        this.y -= this.speed * deltaTime;
        this.distanceTraveled += this.speed * deltaTime;

        if (this.distanceTraveled >= this.range) {
            this.onDestroy();
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    onHit(enemy) {
        this.pierceCount++;
        if (this.pierceCount > this.pierce) {
            this.active = false;
        }

        if (this.statusEffect) {
            enemy.applyStatusEffect(this.statusEffect);
        }

        if (this.explosionRadius > 0) {
            return { type: 'explosion', x: this.x, y: this.y, radius: this.explosionRadius, damage: this.damage };
        }

        return null;
    }

    onKill(enemy) {}

    onDestroy() {}

    clone() {
        const cloned = new this.constructor(this.x, this.y, { bulletSpeed: this.speed, range: this.range });
        Object.assign(cloned, this);
        cloned.pierceCount = 0;
        cloned.distanceTraveled = 0;
        cloned.active = true;
        return cloned;
    }
}
