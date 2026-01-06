class Magazine {
    constructor(size, reloadTime) {
        this.size = size;
        this.reloadTime = reloadTime;
        this.bullets = [];
        this.isReloading = false;
        this.reloadTimer = 0;

        this.initializeMagazine();
    }

    initializeMagazine() {
        this.bullets = [];
        for (let i = 0; i < this.size; i++) {
            this.bullets.push({ type: 'normal' });
        }
    }

    fire(playerX, playerY, playerStats) {
        if (this.isReloading || this.bullets.length === 0) {
            return null;
        }

        // 특수탄 우선 탐색
        let bulletIndex = -1;
        for (let i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].type !== 'normal') {
                bulletIndex = i;
                break;
            }
        }

        // 특수탄 없으면 첫 번째 탄환 (일반탄) 사용
        if (bulletIndex === -1) {
            bulletIndex = 0;
        }

        const bulletData = this.bullets[bulletIndex];

        // 발사한 탄환 제거 및 인덱스 조정
        this.bullets.splice(bulletIndex, 1);

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

        if (this.bullets.length === 0) {
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
        this.initializeMagazine();
        this.isReloading = false;
        this.reloadTimer = 0;
    }

    addSpecialBullet(type, level = 1) {
        this.bullets.push({ type, level });
        this.size++;
    }

    increaseSize(amount) {
        this.size += amount;
        for (let i = 0; i < amount; i++) {
            this.bullets.push({ type: 'normal' });
        }
    }

    getRemainingAmmo() {
        return this.bullets.length;
    }

    getTotalAmmo() {
        return this.size;
    }

    getNextSpecialBullets(count = 5) {
        const specials = [];
        for (let i = 0; i < this.bullets.length && specials.length < count; i++) {
            if (this.bullets[i].type !== 'normal') {
                specials.push(this.bullets[i]);
            }
        }
        return specials;
    }
}
