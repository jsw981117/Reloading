// 관통탄
class PiercingBullet extends Bullet {
    constructor(x, y, playerStats, level = 1) {
        super(x, y, playerStats);
        this.level = level;
        this.damage = 12;
        this.pierce = level;
        this.color = '#0ff';
    }
}

// 폭발탄
class ExplosiveBullet extends Bullet {
    constructor(x, y, playerStats, level = 1) {
        super(x, y, playerStats);
        this.level = level;
        this.damage = 8;
        this.explosionRadius = 30 + (level - 1) * 20;
        this.color = '#f80';
    }

    onHit(enemy) {
        const explosionDamage = this.damage + (this.level - 1) * 5;
        this.active = false;
        return { type: 'explosion', x: this.x, y: this.y, radius: this.explosionRadius, damage: explosionDamage };
    }
}

// 화염탄
class FlameBullet extends Bullet {
    constructor(x, y, playerStats, level = 1) {
        super(x, y, playerStats);
        this.level = level;
        this.damage = 8;
        this.statusEffect = {
            type: 'burn',
            damage: 2 + (level - 1) * 2,
            duration: 3 + (level - 1) * 1
        };
        this.color = '#f00';
    }
}

// 냉각탄
class FreezeBullet extends Bullet {
    constructor(x, y, playerStats, level = 1) {
        super(x, y, playerStats);
        this.level = level;
        this.damage = 10;
        this.statusEffect = {
            type: 'freeze',
            slowFactor: 0.5 - (level - 1) * 0.1,
            duration: 2 + (level - 1) * 0.5
        };
        this.color = '#0af';
    }
}

// 전격탄
class ShockBullet extends Bullet {
    constructor(x, y, playerStats, level = 1) {
        super(x, y, playerStats);
        this.level = level;
        this.damage = 10;
        this.statusEffect = {
            type: 'shock',
            duration: 0.5 + (level - 1) * 0.3,
            additionalStun: level >= 3 ? 0.5 : 0
        };
        this.color = '#ff0';
    }
}

// 확산탄
class ScatterBullet extends Bullet {
    constructor(x, y, playerStats, level = 1, angle = 0) {
        super(x, y, playerStats);
        this.level = level;
        this.damage = 6;
        this.bulletCount = 3 + (level - 1);
        this.spreadAngle = 15 + (level === 3 ? 10 : 0);
        this.angle = angle;
        this.color = '#f0f';
    }

    // 확산탄 발사
    static createScatter(x, y, playerStats, level) {
        const bullets = [];
        const count = 3 + (level - 1);
        const spread = 15 + (level === 3 ? 10 : 0);
        const angleStep = spread / (count - 1);
        const startAngle = -spread / 2;

        for (let i = 0; i < count; i++) {
            const angle = startAngle + angleStep * i;
            bullets.push(new ScatterBullet(x, y, playerStats, level, angle));
        }

        return bullets;
    }

    update(deltaTime) {
        const radians = (this.angle * Math.PI) / 180;
        this.x += Math.sin(radians) * this.speed * deltaTime;
        this.y -= Math.cos(radians) * this.speed * deltaTime;
        this.distanceTraveled += this.speed * deltaTime;

        if (this.distanceTraveled >= this.range) {
            this.onDestroy();
            this.active = false;
        }
    }
}
