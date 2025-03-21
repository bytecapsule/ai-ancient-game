class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 3 + 2;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
    }

    update() {
        this.velocity.x *= 0.99;
        this.velocity.y *= 0.99;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

class Explosion {
    constructor(x, y, isPlayer = false) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.finished = false;
        
        // 创建爆炸粒子
        const colors = isPlayer ? 
            ['#3498db', '#2980b9', '#e74c3c', '#f1c40f'] : 
            ['#e74c3c', '#c0392b', '#f1c40f', '#f39c12'];
            
        for (let i = 0; i < 50; i++) {
            this.particles.push(
                new Particle(
                    x,
                    y,
                    colors[Math.floor(Math.random() * colors.length)]
                )
            );
        }
    }

    update() {
        this.particles.forEach(particle => particle.update());
        // 当所有粒子都几乎透明时，标记爆炸效果结束
        if (this.particles[0].alpha <= 0) {
            this.finished = true;
        }
    }

    draw(ctx) {
        // 绘制爆炸光晕
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, 50
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 50, 0, Math.PI * 2);
        ctx.fill();

        // 绘制所有粒子
        this.particles.forEach(particle => particle.draw(ctx));
    }
}
