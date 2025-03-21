class Tank {
    constructor(x, y, isPlayer = false) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = isPlayer ? 4 : 2;
        this.direction = 0; // 0: 上, 1: 右, 2: 下, 3: 左
        this.isPlayer = isPlayer;
        this.health = 3; // 设置初始生命值为3
        this.bullets = [];
        this.lastShot = 0;
        this.shotDelay = 500; // 射击间隔（毫秒）
        this.invincible = false; // 是否处于无敌状态
        this.invincibleTime = 1000; // 无敌时间（毫秒）
        this.lastHitTime = 0; // 上次被击中的时间
    }

    move(direction) {
        // 保存移动前的位置
        const previousX = this.x;
        const previousY = this.y;

        this.direction = direction;
        switch(direction) {
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

        // 返回移动前的位置，供碰撞检测使用
        return { previousX, previousY };
    }

    checkCollision(obstacle) {
        return this.x < obstacle.x + obstacle.width &&
               this.x + this.width > obstacle.x &&
               this.y < obstacle.y + obstacle.height &&
               this.y + this.height > obstacle.y;
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot >= this.shotDelay) {
            this.lastShot = now;
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                direction: this.direction
            };
        }
        return null;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate((Math.PI / 2) * this.direction);
        
        // 如果处于无敌状态，添加闪烁效果
        if (this.invincible) {
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 100) * 0.3;
        }
        
        // 坦克主体 - 使用渐变色
        const bodyGradient = ctx.createLinearGradient(-this.width/2, -this.height/2, this.width/2, this.height/2);
        if (this.isPlayer) {
            // 根据生命值改变坦克颜色
            const healthPercent = this.health / 3;
            bodyGradient.addColorStop(0, `rgba(41, 128, ${Math.floor(185 * healthPercent)}, 1)`);
            bodyGradient.addColorStop(1, `rgba(52, 152, ${Math.floor(219 * healthPercent)}, 1)`);
        } else {
            bodyGradient.addColorStop(0, '#c0392b');
            bodyGradient.addColorStop(1, '#e74c3c');
        }
        
        // 添加阴影效果
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // 绘制坦克主体
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // 绘制装甲板纹理
        ctx.strokeStyle = this.isPlayer ? '#2c3e50' : '#7f8c8d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-this.width/3, -this.height/2);
        ctx.lineTo(-this.width/3, this.height/2);
        ctx.moveTo(this.width/3, -this.height/2);
        ctx.lineTo(this.width/3, this.height/2);
        ctx.stroke();
        
        // 绘制履带
        ctx.fillStyle = '#34495e';
        ctx.fillRect(-this.width/2 - 5, -this.height/2, 5, this.height);
        ctx.fillRect(this.width/2, -this.height/2, 5, this.height);
        
        // 绘制炮塔
        const turretGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
        turretGradient.addColorStop(0, this.isPlayer ? '#2c3e50' : '#7f8c8d');
        turretGradient.addColorStop(1, this.isPlayer ? '#34495e' : '#95a5a6');
        
        ctx.fillStyle = turretGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // 炮管
        ctx.shadowBlur = 3;
        ctx.fillStyle = this.isPlayer ? '#2c3e50' : '#7f8c8d';
        ctx.fillRect(-5, -this.height/2 - 15, 10, 25);
        
        // 重置阴影和透明度
        ctx.shadowColor = 'transparent';
        ctx.globalAlpha = 1;
        
        ctx.restore();
    }

    takeDamage(damage) {
        const now = Date.now();
        if (!this.invincible) {
            this.health -= damage;
            this.invincible = true;
            this.lastHitTime = now;
            return this.health <= 0;
        }
        return false;
    }

    update() {
        // 更新无敌状态
        if (this.invincible && Date.now() - this.lastHitTime >= this.invincibleTime) {
            this.invincible = false;
        }
    }
}
