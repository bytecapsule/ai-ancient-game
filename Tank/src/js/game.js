// 使用全局变量访问类

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布大小
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // 初始化游戏对象
        this.player = new Tank(this.canvas.width / 2, this.canvas.height - 60, true);
        this.enemies = [
            new Tank(100, 100),
            new Tank(400, 100),
            new Tank(700, 100)
        ];
        this.bullets = [];
        this.explosions = [];
        this.obstacles = this.generateObstacles();
        
        // 初始化音效管理器
        this.soundManager = new SoundManager();
        
        // 控制状态
        this.keys = {};
        this.gameOver = false;
        this.score = 0;
        this.showInstructions = true;
        this.instructionsTimer = 5000; // 显示说明5秒
        
        // 绑定事件处理
        this.bindEvents();
        
        // 开始游戏循环
        this.lastTime = 0;
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    bindEvents() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') {
                this.playerShoot();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    playerShoot() {
        const bullet = this.player.shoot();
        if (bullet) {
            this.bullets.push(new Bullet(bullet.x, bullet.y, bullet.direction, true));
            this.soundManager.play('shoot');
        }
    }
    
    updatePlayer() {
        // 保存当前位置
        const previousX = this.player.x;
        const previousY = this.player.y;

        if (this.keys['w'] || this.keys['ArrowUp']) this.player.move(0);
        if (this.keys['d'] || this.keys['ArrowRight']) this.player.move(1);
        if (this.keys['s'] || this.keys['ArrowDown']) this.player.move(2);
        if (this.keys['a'] || this.keys['ArrowLeft']) this.player.move(3);
        
        // 边界检查
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
        this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, this.player.y));

        // 与障碍物的碰撞检查
        let collision = false;
        for (const obstacle of this.obstacles) {
            if (this.player.checkCollision(obstacle)) {
                collision = true;
                break;
            }
        }

        // 与敌方坦克的碰撞检查
        for (const enemy of this.enemies) {
            if (this.player.checkCollision(enemy)) {
                collision = true;
                break;
            }
        }

        // 如果发生碰撞，将坦克位置回退
        if (collision) {
            this.player.x = previousX;
            this.player.y = previousY;
        }

        // 更新玩家状态
        this.player.update();
    }
    
    updateEnemies() {
        this.enemies.forEach(enemy => {
            // 保存当前位置
            const previousX = enemy.x;
            const previousY = enemy.y;

            // 改进的AI：追踪玩家并主动攻击
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 根据与玩家的相对位置决定移动方向
            if (distance > 200) { // 如果距离较远，向玩家移动
                if (Math.abs(dx) > Math.abs(dy)) {
                    enemy.move(dx > 0 ? 1 : 3);
                } else {
                    enemy.move(dy > 0 ? 2 : 0);
                }
            } else { // 如果距离较近，随机移动以避免被击中
                if (Math.random() < 0.03) {
                    enemy.move(Math.floor(Math.random() * 4));
                }
            }
            
            // 更积极的射击行为
            if (Math.random() < 0.02) {
                const bullet = enemy.shoot();
                if (bullet) {
                    this.bullets.push(new Bullet(bullet.x, bullet.y, bullet.direction, false));
                    this.soundManager.play('shoot');
                }
            }
            
            // 边界检查
            enemy.x = Math.max(0, Math.min(this.canvas.width - enemy.width, enemy.x));
            enemy.y = Math.max(0, Math.min(this.canvas.height - enemy.height, enemy.y));
            
            // 检查与障碍物的碰撞
            let collision = false;
            for (const obstacle of this.obstacles) {
                if (enemy.checkCollision(obstacle)) {
                    collision = true;
                    break;
                }
            }

            // 检查与其他敌方坦克的碰撞
            for (const otherEnemy of this.enemies) {
                if (otherEnemy !== enemy && enemy.checkCollision(otherEnemy)) {
                    collision = true;
                    break;
                }
            }

            // 检查与玩家的碰撞
            if (enemy.checkCollision(this.player)) {
                collision = true;
            }

            // 如果发生碰撞，恢复到之前的位置
            if (collision) {
                enemy.x = previousX;
                enemy.y = previousY;
            }

            // 更新敌人状态
            enemy.update();
        });
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.move();
            let bulletHit = false;
            
            // 检查子弹是否击中障碍物
            for (let j = this.obstacles.length - 1; j >= 0; j--) {
                const obstacle = this.obstacles[j];
                if (bullet.checkCollision(obstacle)) {
                    bulletHit = true;
                    if (obstacle.takeDamage(25)) {
                        this.obstacles.splice(j, 1);
                        this.explosions.push(new Explosion(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2));
                    }
                    break;
                }
            }
            
            if (!bulletHit) {
                // 玩家子弹只能击中敌人
                if (bullet.isPlayerBullet) {
                    for (let j = this.enemies.length - 1; j >= 0; j--) {
                        const enemy = this.enemies[j];
                        if (bullet.checkCollision(enemy)) {
                            if (enemy.takeDamage(1)) { // 敌人受到1点伤害
                                this.explosions.push(new Explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2));
                                this.soundManager.play('explosion');
                                this.enemies.splice(j, 1);
                                this.score += 100;
                            } else {
                                this.soundManager.play('hit');
                            }
                            bulletHit = true;
                            break;
                        }
                    }
                }
                // 敌人子弹只能击中玩家
                else {
                    if (bullet.checkCollision(this.player)) {
                        if (this.player.takeDamage(1)) { // 玩家受到1点伤害
                            this.explosions.push(new Explosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2));
                            this.soundManager.play('explosion');
                            this.gameOver = true;
                        } else {
                            this.soundManager.play('hit');
                        }
                        bulletHit = true;
                    }
                }
            }
            
            // 如果子弹击中目标或超出边界，则移除子弹
            if (bulletHit || bullet.isOutOfBounds(this.canvas.width, this.canvas.height)) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    generateObstacles() {
        const obstacles = [];
        const wallBuilder = new WallBuilder();
        const numWalls = 4; // 减少墙体数量，因为每个墙体现在由多个砖块组成
        
        for (let i = 0; i < numWalls; i++) {
            let x, y;
            let validPosition = false;
            
            while (!validPosition) {
                x = Math.random() * (this.canvas.width - 200); // 为更大的墙体预留空间
                y = Math.random() * (this.canvas.height - 200);
                
                // 确保墙体不会出现在玩家或敌人的初始位置
                validPosition = true;
                if (Math.abs(x - this.player.x) < 120 && Math.abs(y - this.player.y) < 120) {
                    validPosition = false;
                    continue;
                }
                
                for (const enemy of this.enemies) {
                    if (Math.abs(x - enemy.x) < 120 && Math.abs(y - enemy.y) < 120) {
                        validPosition = false;
                        break;
                    }
                }
            }
            
            // 生成随机的复杂墙体
            const wallObstacles = wallBuilder.createRandomComplexWall(x, y);
            obstacles.push(...wallObstacles);
        }
        
        return obstacles;
    }

    updateExplosions() {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            explosion.update();
            if (explosion.finished) {
                this.explosions.splice(i, 1);
            }
        }
    }
    
    checkGameStatus() {
        if (this.enemies.length === 0) {
            this.gameOver = true;
            this.victory = true;
        }
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 显示游戏说明
        if (this.showInstructions) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 绘制游戏标题
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 64px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = '#f39c12';
            this.ctx.shadowBlur = 10;
            this.ctx.fillText('坦克大战', this.canvas.width / 2, this.canvas.height / 2 - 180);
            this.ctx.shadowBlur = 0;
            
            this.ctx.font = '24px Arial';
            this.ctx.fillText('游戏操作说明', this.canvas.width / 2, this.canvas.height / 2 - 100);
            this.ctx.font = '18px Arial';
            this.ctx.fillText('使用 WASD 或方向键控制坦克移动', this.canvas.width / 2, this.canvas.height / 2 - 40);
            this.ctx.fillText('空格键发射子弹', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('击败所有敌方坦克获得胜利', this.canvas.width / 2, this.canvas.height / 2 + 40);
            this.ctx.fillText('被敌人击中则游戏结束', this.canvas.width / 2, this.canvas.height / 2 + 80);
            
            // 倒计时显示
            const timeLeft = Math.ceil(this.instructionsTimer / 1000);
            this.ctx.fillText(`${timeLeft}秒后开始游戏...`, this.canvas.width / 2, this.canvas.height / 2 + 140);
            return;
        }
        
        // 绘制玩家
        this.player.draw(this.ctx);
        
        // 绘制障碍物
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
        
        // 绘制敌人
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // 绘制子弹
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        
        // 绘制爆炸效果
        this.explosions.forEach(explosion => explosion.draw(this.ctx));
        
        // 绘制分数（使用save和restore避免状态污染）
        this.ctx.save();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`分数: ${this.score}`, 20, 40);
        this.ctx.restore();
        
        // 游戏结束显示
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                this.victory ? '胜利！' : '游戏结束',
                this.canvas.width / 2,
                this.canvas.height / 2
            );
            this.ctx.font = '24px Arial';
            this.ctx.fillText(
                '按空格键重新开始',
                this.canvas.width / 2,
                this.canvas.height / 2 + 50
            );
        }
    }
    
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (this.showInstructions) {
            if (this.showTitle) {
                this.ctx.save();
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = 'bold 64px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.shadowColor = '#f39c12';
                this.ctx.shadowBlur = 10;
                this.ctx.fillText('坦克大战', this.canvas.width / 2, 80);
                this.ctx.restore();
            }
            
            this.instructionsTimer -= deltaTime;
            if (this.instructionsTimer <= 0) {
                this.showInstructions = false;
                this.showTitle = false;
            }
            this.draw();
            requestAnimationFrame(this.gameLoop.bind(this));
            return;
        }
        
        if (!this.gameOver) {
            this.updatePlayer();
            this.updateEnemies();
            this.updateBullets();
            this.updateExplosions();
            this.checkGameStatus();
        } else if (this.keys[' ']) {
            // 重新开始游戏
            location.reload();
        }
        
        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}
