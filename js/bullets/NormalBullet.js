class NormalBullet extends Bullet {
    constructor(x, y, playerStats) {
        super(x, y, playerStats);
        this.damage = 10;
        this.color = '#fff';
    }
}
