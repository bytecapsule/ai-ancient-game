class Obstacle {
    constructor(x, y, width = 40, height = 40) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxHealth = 3;
        this.health = this.maxHealth;
        this.cracks = []; // 存储裂纹数据
    }

    draw(ctx) {
        // 根据生命值设置砖块的基础颜色
        const healthPercent = this.health / this.maxHealth;
        const baseColor = this.getBaseColor(healthPercent);
        ctx.fillStyle = baseColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 添加砖块纹理
        ctx.strokeStyle = this.getDarkerColor(baseColor);
        ctx.lineWidth = 2;
        
        // 横向砖块纹理
        for (let i = 0; i <= this.height; i += 10) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + i);
            ctx.lineTo(this.x + this.width, this.y + i);
            ctx.stroke();
        }
        
        // 纵向砖块纹理
        for (let i = 0; i <= this.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y);
            ctx.lineTo(this.x + i, this.y + this.height);
            ctx.stroke();
        }

        // 根据损坏程度添加裂纹效果
        if (this.health < this.maxHealth) {
            this.drawCracks(ctx, healthPercent);
        }
    }

    getBaseColor(healthPercent) {
        if (healthPercent > 0.66) {
            return '#8B4513';
        } else if (healthPercent > 0.33) {
            return '#A0522D';
        } else {
            return '#B8860B';
        }
    }

    getDarkerColor(baseColor) {
        // 简单的颜色加深处理
        return baseColor === '#8B4513' ? '#654321' :
               baseColor === '#A0522D' ? '#8B4513' :
               '#A0522D';
    }

    drawCracks(ctx, healthPercent) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 1;

        this.cracks.forEach(crack => {
            ctx.beginPath();
            ctx.moveTo(crack.startX, crack.startY);
            
            let currentX = crack.startX;
            let currentY = crack.startY;
            let currentAngle = crack.angle;
            
            crack.segments.forEach(segment => {
                const endX = currentX + Math.cos(currentAngle) * segment.length;
                const endY = currentY + Math.sin(currentAngle) * segment.length;
                
                ctx.lineTo(endX, endY);
                ctx.stroke();
                
                if (segment.hasBranch) {
                    ctx.beginPath();
                    ctx.moveTo(endX, endY);
                    ctx.lineTo(
                        endX + Math.cos(currentAngle + segment.angleOffset) * segment.length,
                        endY + Math.sin(currentAngle + segment.angleOffset) * segment.length
                    );
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.moveTo(endX, endY);
                    ctx.lineTo(
                        endX + Math.cos(currentAngle - segment.angleOffset) * segment.length,
                        endY + Math.sin(currentAngle - segment.angleOffset) * segment.length
                    );
                    ctx.stroke();
                }
                
                currentX = endX;
                currentY = endY;
                currentAngle += segment.angleOffset;
            });
        });
    }

    generateCrackSegments(depth, segments = []) {
        if (depth <= 0) return segments;

        const segment = {
            length: Math.random() * 15 + 5,
            angleOffset: Math.random() * 0.5 - 0.25,
            hasBranch: Math.random() < 0.7
        };
        segments.push(segment);

        if (segment.hasBranch) {
            this.generateCrackSegments(depth - 1, segments);
            this.generateCrackSegments(depth - 1, segments);
        }

        return segments;
    }

    checkCollision(target) {
        return this.x < target.x + target.width &&
               this.x + this.width > target.x &&
               this.y < target.y + target.height &&
               this.y + this.height > target.y;
    }

    takeDamage(damage) {
        const oldHealth = this.health;
        this.health = Math.max(0, this.health - damage);
        
        // 只在受到伤害时更新裂纹
        if (this.health < oldHealth) {
            this.updateCracks();
        }
        
        return this.health <= 0;
    }

    updateCracks() {
        const healthPercent = this.health / this.maxHealth;
        const numNewCracks = Math.floor((1 - healthPercent) * 5) + 1 - this.cracks.length;
        
        for (let i = 0; i < numNewCracks; i++) {
            const crack = {
                startX: this.x + Math.random() * this.width,
                startY: this.y + Math.random() * this.height,
                angle: Math.random() * Math.PI * 2,
                segments: this.generateCrackSegments(3)
            };
            this.cracks.push(crack);
        }
    }
}