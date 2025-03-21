class Explosion {
    constructor(x, y, word, translation) {
        this.x = x;
        this.y = y;
        this.word = word;
        this.translation = translation;
        this.particles = [];
        this.lifetime = 0;
        this.maxLifetime = 30; // 动画持续帧数
        this.init();
    }

    init() {
        // 为每个字母创建粒子
        for (let i = 0; i < this.word.length; i++) {
            const angle = (Math.PI * 2 / this.word.length) * i;
            this.particles.push({
                x: this.x,
                y: this.y,
                char: this.word[i],
                velocity: {
                    x: Math.cos(angle) * 5,
                    y: Math.sin(angle) * 5
                },
                alpha: 1
            });
        }
    }

    update() {
        this.lifetime++;
        
        for (let particle of this.particles) {
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.alpha = 1 - (this.lifetime / this.maxLifetime);
        }

        return this.lifetime < this.maxLifetime;
    }

    draw(ctx) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 绘制爆炸粒子
        ctx.font = '20px Arial';
        for (let particle of this.particles) {
            ctx.fillStyle = `rgba(255, 100, 100, ${particle.alpha})`;
            ctx.fillText(particle.char, particle.x, particle.y);
        }

        // 绘制中文翻译
        if (this.lifetime < this.maxLifetime / 2) {
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = `rgba(50, 50, 50, ${1 - this.lifetime / this.maxLifetime * 2})`;
            ctx.fillText(this.translation, this.x, this.y + 30);
        }

        ctx.restore();
    }
}

// 导出类供其他文件使用
window.Explosion = Explosion;
