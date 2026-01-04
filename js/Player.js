class Player {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.x = canvasWidth / 2;
        this.y = canvasHeight - 100;
        this.width = 30;
        this.height = 40;

        this.stats = {
            attackSpeed: 0.2,      // 탄 발사 간격 (초)
            magazineSize: 10,      // 탄창 크기
            reloadTime: 2,         // 재장전 시간 (초)
            bulletSpeed: 500,      // 탄속
            range: 800,            // 사거리
            maxHP: 100             // 최대 체력
        };

        this.hp = this.stats.maxHP;
        this.moveSpeed = 300;

        this.magazine = new Magazine(this.stats.magazineSize, this.stats.reloadTime);
        this.fireTimer = 0;
    }

    update(deltaTime, inputX, inputY) {
        // 이동
        if (inputX !== null && inputY !== null) {
            this.x = Math.max(this.width / 2, Math.min(this.canvasWidth - this.width / 2, inputX));
            this.y = Math.max(this.height / 2, Math.min(this.canvasHeight - this.height / 2, inputY));
        }

        // 탄창 업데이트
        this.magazine.update(deltaTime);

        // 자동 사격
        this.fireTimer += deltaTime;
        if (this.fireTimer >= this.stats.attackSpeed && !this.magazine.isReloading) {
            this.fireTimer = 0;
            return this.fire();
        }

        return null;
    }

    fire() {
        return this.magazine.fire(this.x, this.y - this.height / 2, this.stats);
    }

    draw(ctx) {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        // 플레이어 방향 표시
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x - 5, this.y - this.height / 2 - 10, 10, 10);
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
    }

    upgradeStat(stat, value) {
        switch (stat) {
            case 'attackSpeed':
                this.stats.attackSpeed = Math.max(0.05, this.stats.attackSpeed - value);
                break;
            case 'magazineSize':
                this.stats.magazineSize += value;
                this.magazine.increaseSize(value);
                break;
            case 'reloadTime':
                this.stats.reloadTime = Math.max(0.5, this.stats.reloadTime - value);
                this.magazine.reloadTime = this.stats.reloadTime;
                break;
            case 'bulletSpeed':
                this.stats.bulletSpeed += value;
                break;
            case 'range':
                this.stats.range += value;
                break;
            case 'maxHP':
                this.stats.maxHP += value;
                this.hp += value;
                break;
        }
    }

    addSpecialBullet(type, level) {
        this.magazine.addSpecialBullet(type, level);
    }
}
