class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.speed = 5;
        this.health = 10; // 玩家有10点生命值
        this.maxHealth = 10;
        this.bullets = [];
        this.lastShot = 0;
        this.shotDelay = 200; // 射击间隔（毫秒）
        this.invincible = false;
        this.invincibleTime = 2000; // 无敌时间（毫秒）
        this.lastHitTime = 0;
    }

    update() {
        // 更新无敌状态
        if (this.invincible && Date.now() - this.lastHitTime >= this.invincibleTime) {
            this.invincible = false;
        }

        // 更新子弹
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update();
            if (this.bullets[i].isOutOfBounds(0)) {
                this.bullets.splice(i, 1);
            }
        }
    }

    move(dx, dy) {
        this.x = Utils.clamp(this.x + dx * this.speed, 0, 800 - this.width);
        this.y = Utils.clamp(this.y + dy * this.speed, 0, 600 - this.height);
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot >= this.shotDelay) {
            this.lastShot = now;
            const bullet = new Bullet(
                this.x + this.width / 2 - 2,
                this.y,
                8,
                true
            );
            this.bullets.push(bullet);
            return true;
        }
        return false;
    }

    draw(ctx) {
        ctx.save();

        // 如果处于无敌状态，添加闪烁效果
        if (this.invincible) {
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 100) * 0.3;
        }

        // 绘制飞机主体
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#4fc3f7');
        gradient.addColorStop(1, '#0288d1');
        
        ctx.fillStyle = gradient;
        ctx.shadowColor = '#4fc3f7';
        ctx.shadowBlur = 10;
        
        // 机身
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // 机翼
        ctx.fillStyle = '#81d4fa';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height / 3);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x, this.y + this.height / 2);
        ctx.closePath();
        ctx.fill();

        // 驾驶舱
        const cockpitGradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height / 3,
            0,
            this.x + this.width / 2, this.y + this.height / 3,
            10
        );
        cockpitGradient.addColorStop(0, '#e1f5fe');
        cockpitGradient.addColorStop(1, '#4fc3f7');
        
        ctx.fillStyle = cockpitGradient;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 3, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // 绘制子弹
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }

    takeDamage(damage = 1) {
        if (!this.invincible) {
            this.health -= damage;
            this.invincible = true;
            this.lastHitTime = Date.now();
            return this.health <= 0;
        }
        return false;
    }
}