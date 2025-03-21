class Bullet {
    constructor(x, y, direction, isPlayerBullet = false) {
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 8;
        this.speed = 5;
        this.direction = direction;
        this.damage = 25;
        this.isPlayerBullet = isPlayerBullet;
    }

    move() {
        switch(this.direction) {
            case 0: // 上
                this.y -= this.speed;
                break;
            case 1: // 右
                this.x += this.speed;
                break;
            case 2: // 下
                this.y += this.speed;
                break;
            case 3: // 左
                this.x -= this.speed;
                break;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 子弹外观
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 子弹尾部特效
        ctx.fillStyle = 'rgba(241, 196, 15, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, this.width, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    checkCollision(target) {
        return this.x < target.x + target.width &&
               this.x + this.width > target.x &&
               this.y < target.y + target.height &&
               this.y + this.height > target.y;
    }

    isOutOfBounds(canvasWidth, canvasHeight) {
        return this.x < 0 || 
               this.x > canvasWidth || 
               this.y < 0 || 
               this.y > canvasHeight;
    }
}
