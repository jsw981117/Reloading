class Magazine {
    constructor(size, reloadTime) {
        this.size = size;
        this.reloadTime = reloadTime;
        this.bullets = [];
        this.currentIndex = 0;
        this.isReloading = false;
        this.reloadTimer = 0;

        this.initializeMagazine();
    }

    initializeMagazine() {
        this.bullets = [];
        for (let i = 0; i < this.size; i++) {
            this.bullets.push({ type: 'normal' });
        }
        this.currentIndex = 0;
    }

    fire(playerX, playerY, playerStats) {
        if (this.isReloading || this.currentIndex >= this.bullets.length) {
            return null;
        }

        const bulletData = this.bullets[this.currentIndex];
        this.currentIndex++;

        let bullet;
        switch (bulletData.type) {
            case 'normal':
                bullet = new NormalBullet(playerX, playerY, playerStats);
                break;
            case 'piercing':
                bullet = new PiercingBullet(playerX, playerY, playerStats, bulletData.level);
                break;
            case 'explosive':
                bullet = new ExplosiveBullet(playerX, playerY, playerStats, bulletData.level);
                break;
            case 'flame':
                bullet = new FlameBullet(playerX, playerY, playerStats, bulletData.level);
                break;
            case 'freeze':
                bullet = new FreezeBullet(playerX, playerY, playerStats, bulletData.level);
                break;
            case 'shock':
                bullet = new ShockBullet(playerX, playerY, playerStats, bulletData.level);
                break;
            case 'scatter':
                return ScatterBullet.createScatter(playerX, playerY, playerStats, bulletData.level);
        }

        if (this.currentIndex >= this.bullets.length) {
            this.startReload();
        }

        return bullet;
    }

    startReload() {
        this.isReloading = true;
        this.reloadTimer = this.reloadTime;
    }

    update(deltaTime) {
        if (this.isReloading) {
            this.reloadTimer -= deltaTime;
            if (this.reloadTimer <= 0) {
                this.reload();
            }
        }
    }

    reload() {
        this.currentIndex = 0;
        this.isReloading = false;
        this.reloadTimer = 0;
    }

    addSpecialBullet(type, level = 1) {
        this.bullets.push({ type, level });
    }

    increaseSize(amount) {
        this.size += amount;
        for (let i = 0; i < amount; i++) {
            this.bullets.push({ type: 'normal' });
        }
    }

    getRemainingAmmo() {
        return Math.max(0, this.bullets.length - this.currentIndex);
    }

    getTotalAmmo() {
        return this.bullets.length;
    }
}
