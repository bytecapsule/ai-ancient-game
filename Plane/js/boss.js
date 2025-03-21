class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 120;
        this.height = 100;
        this.speed = 1;
        this.health = 10;
        this.maxHealth = 10;
        this.bullets = [];
        this.lastShot = 0;
        this.shotDelay = 1000; // 射击间隔（毫秒）
        this.moveDirection = 1; // 1: 右, -1: 左
        this.attackPattern = 0; // 攻击模式
        this.attackTimer = 0;
        this.attackInterval = 5000; // 切换攻击模式的间隔
    }

    update() {
        // 横向移动
        this.x += this.speed * this.moveDirection;
        if (this.x <= 0 || this.x + this.width >= 800) {
            this.moveDirection *= -1;
        }

        // 更新子弹
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update();
            if (this.bullets[i].isOutOfBounds(600)) {
                this.bullets.splice(i, 1);
            }
        }

        // 更新攻击模式
        this.attackTimer += 16; // 假设60fps
        if (this.attackTimer >= this.attackInterval) {
            this.attackTimer = 0;
            this.attackPattern = (this.attackPattern + 1) % 3;
        }

        // 根据攻击模式发射子弹
        this.shoot();
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot >= this.shotDelay) {
            this.lastShot = now;
            switch(this.attackPattern) {
                case 0: // 三发散弹
                    for (let i = -1; i <= 1; i++) {
                        const bullet = new Bullet(
                            this.x + this.width / 2 - 2,
                            this.y + this.height,
                            4,
                            false
                        );
                        bullet.x += i * 20;
                        this.bullets.push(bullet);
                    }
                    break;
                case 1: // 圆形弹幕
                    for (let i = 0; i < 8; i++) {
                        const angle = (Math.PI * 2 / 8) * i;
                        const bullet = new Bullet(
                            this.x + this.width / 2 - 2,
                            this.y + this.height / 2,
                            3,
                            false
                        );
                        bullet.speedX = Math.cos(angle) * 3;
                        bullet.speedY = Math.sin(angle) * 3;
                        this.bullets.push(bullet);
                    }
                    break;
                case 2: // 激光束
                    const bullet = new Bullet(
                        this.x + this.width / 2 - 4,
                        this.y + this.height,
                        6,
                        false
                    );
                    bullet.width = 8;
                    bullet.height = 16;
                    this.bullets.push(bullet);
                    break;
            }
            return true;
        }
        return false;
    }

    draw(ctx) {
        ctx.save();

        // 绘制Boss主体
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#8e44ad');
        gradient.addColorStop(1, '#6c3483');
        
        ctx.fillStyle = gradient;
        ctx.shadowColor = '#8e44ad';
        ctx.shadowBlur = 15;
        
        // 主体装甲
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height / 3);
        ctx.lineTo(this.x + this.width * 0.8, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.2, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height / 3);
        ctx.closePath();
        ctx.fill();

        // 装饰性细节
        ctx.strokeStyle = '#9b59b6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.3, this.y + this.height * 0.4);
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height * 0.4);
        ctx.stroke();

        // 能量核心
        const coreGradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height / 2,
            0,
            this.x + this.width / 2, this.y + this.height / 2,
            20
        );
        coreGradient.addColorStop(0, '#e74c3c');
        coreGradient.addColorStop(0.6, '#c0392b');
        coreGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 20, 0, Math.PI * 2);
        ctx.fill();

        // 生命值条
        const healthBarWidth = this.width;
        const healthBarHeight = 8;
        const healthPercentage = this.health / this.maxHealth;

        // 背景
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(this.x, this.y - 20, healthBarWidth, healthBarHeight);

        // 当前生命值
        const healthGradient = ctx.createLinearGradient(this.x, this.y - 20, this.x + healthBarWidth * healthPercentage, this.y - 20 + healthBarHeight);
        healthGradient.addColorStop(0, '#e74c3c');
        healthGradient.addColorStop(1, '#c0392b');
        ctx.fillStyle = healthGradient;
        ctx.fillRect(this.x, this.y - 20, healthBarWidth * healthPercentage, healthBarHeight);

        ctx.restore();

        // 绘制子弹
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }

    takeDamage() {
        this.health--;
        return this.health <= 0;
    }
}