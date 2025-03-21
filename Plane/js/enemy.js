class Enemy {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 30;
        this.height = 40;
        this.speed = 2;
        this.health = 1;
        this.bullets = [];
        this.lastShot = 0;
        this.shotDelay = 2000; // 射击间隔（毫秒）
        this.movePattern = Math.random() < 0.5 ? 'straight' : 'zigzag';
        this.zigzagAmplitude = 100;
        this.zigzagFrequency = 0.02;
        this.initialX = x;
    }

    update() {
        // 更新位置
        this.y += this.speed;

        // 根据移动模式更新x位置
        if (this.movePattern === 'zigzag') {
            this.x = this.initialX + Math.sin(this.y * this.zigzagFrequency) * this.zigzagAmplitude;
        }

        // 更新子弹
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update();
            if (this.bullets[i].isOutOfBounds(600)) {
                this.bullets.splice(i, 1);
            }
        }

        // 随机射击
        if (Math.random() < 0.01) {
            this.shoot();
        }
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot >= this.shotDelay) {
            this.lastShot = now;
            const bullet = new Bullet(
                this.x + this.width / 2 - 2,
                this.y + this.height,
                5,
                false
            );
            this.bullets.push(bullet);
            return true;
        }
        return false;
    }

    draw(ctx) {
        ctx.save();

        // 绘制敌机主体
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#e74c3c');
        gradient.addColorStop(1, '#c0392b');
        
        ctx.fillStyle = gradient;
        ctx.shadowColor = '#e74c3c';
        ctx.shadowBlur = 10;
        
        // 机身
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.fill();

        // 机翼
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height * 2/3);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x, this.y + this.height / 2);
        ctx.closePath();
        ctx.fill();

        // 驾驶舱
        const cockpitGradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height * 2/3,
            0,
            this.x + this.width / 2, this.y + this.height * 2/3,
            5
        );
        cockpitGradient.addColorStop(0, '#f1c40f');
        cockpitGradient.addColorStop(1, '#f39c12');
        
        ctx.fillStyle = cockpitGradient;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height * 2/3, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // 绘制子弹
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }

    takeDamage() {
        this.health--;
        return this.health <= 0;
    }

    isOutOfBounds(canvasHeight) {
        return this.y > canvasHeight;
    }
}