class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.maxRadius = 30;
        this.expandSpeed = 2;
        this.particles = [];
        this.alpha = 1;
        this.fadeSpeed = 0.05;
        
        // 创建爆炸粒子
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: this.x,
                y: this.y,
                angle: (Math.PI * 2 / 12) * i,
                speed: Utils.randomInt(2, 5),
                size: Utils.randomInt(2, 4),
                alpha: 1
            });
        }
    }

    update() {
        // 更新爆炸圆圈
        if (this.radius < this.maxRadius) {
            this.radius += this.expandSpeed;
        }
        this.alpha -= this.fadeSpeed;

        // 更新粒子
        this.particles.forEach(particle => {
            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed;
            particle.alpha = this.alpha;
        });

        return this.alpha <= 0;
    }

    draw(ctx) {
        // 绘制爆炸圆圈
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // 外圈
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 内圈
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制粒子
        this.particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = '#ff8833';
            ctx.fill();
        });

        ctx.restore();
    }
}