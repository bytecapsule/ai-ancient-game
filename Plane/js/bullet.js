class Bullet {
    constructor(x, y, speed, isPlayerBullet = true) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 8;
        this.speed = speed;
        this.isPlayerBullet = isPlayerBullet;
        this.damage = isPlayerBullet ? 1 : 1; // 玩家和敌人子弹伤害
    }

    update() {
        // 玩家子弹向上飞，敌人子弹向下飞
        this.y += this.isPlayerBullet ? -this.speed : this.speed;
    }

    draw(ctx) {
        ctx.save();
        
        // 子弹颜色和发光效果
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        if (this.isPlayerBullet) {
            gradient.addColorStop(0, '#00ffff');
            gradient.addColorStop(1, '#0066ff');
        } else {
            gradient.addColorStop(0, '#ff6600');
            gradient.addColorStop(1, '#ff0000');
        }

        ctx.fillStyle = gradient;
        ctx.shadowColor = this.isPlayerBullet ? '#00ffff' : '#ff0000';
        ctx.shadowBlur = 10;
        
        // 绘制子弹
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 2);
        ctx.fill();
        
        ctx.restore();
    }

    checkCollision(target) {
        return Utils.checkCollision(this, target);
    }

    isOutOfBounds(canvasHeight) {
        return this.isPlayerBullet ? this.y < -this.height : this.y > canvasHeight;
    }
}