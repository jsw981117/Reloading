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
            maxHP: 100,            // 최대 체력
            moveSpeed: 300         // 이동 속도
        };

        this.hp = this.stats.maxHP;

        this.magazine = new Magazine(this.stats.magazineSize, this.stats.reloadTime);
        this.fireTimer = 0;
    }

    update(deltaTime, keys, mouseDown, mouseX, mouseY) {
        // 입력 방향 벡터 계산
        let dx = 0;
        let dy = 0;

        // 키보드 입력
        if (keys['w'] || keys['arrowup']) dy -= 1;
        if (keys['s'] || keys['arrowdown']) dy += 1;
        if (keys['a'] || keys['arrowleft']) dx -= 1;
        if (keys['d'] || keys['arrowright']) dx += 1;

        // 마우스/터치 드래그
        if (mouseDown && mouseX !== null && mouseY !== null) {
            const dirX = mouseX - this.x;
            const dirY = mouseY - this.y;
            const distance = Math.sqrt(dirX * dirX + dirY * dirY);

            if (distance > 5) {
                dx = dirX / distance;
                dy = dirY / distance;
            }
        }

        // 벡터 정규화 (8방향 이동 시 속도 일정하게)
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length > 0) {
            dx /= length;
            dy /= length;

            // 이동
            this.x += dx * this.stats.moveSpeed * deltaTime;
            this.y += dy * this.stats.moveSpeed * deltaTime;

            // 화면 경계 제한
            this.x = Math.max(this.width / 2, Math.min(this.canvasWidth - this.width / 2, this.x));
            this.y = Math.max(this.height / 2, Math.min(this.canvasHeight - this.height / 2, this.y));
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
            case 'moveSpeed':
                this.stats.moveSpeed += value;
                break;
        }
    }

    addSpecialBullet(type, level) {
        this.magazine.addSpecialBullet(type, level);
    }
}
