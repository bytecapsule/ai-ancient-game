class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布大小
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // 游戏状态
        this.gameOver = false;
        this.victory = false;
        this.score = 0;
        this.distance = 0;
        this.bossSpawned = false;
        this.showInstructions = true;
        this.instructionsTimer = 5000; // 显示说明5秒
        
        // 游戏对象
        this.player = new Player(this.canvas.width / 2 - 20, this.canvas.height - 100);
        this.enemies = [];
        this.boss = null;
        this.explosions = [];
        
        // 游戏控制
        this.keys = {};
        this.lastEnemySpawn = 0;
        this.enemySpawnDelay = 1500;
        
        // 绑定事件
        this.bindEvents();
        
        // 开始游戏循环
        this.lastTime = 0;
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    bindEvents() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') {
                e.preventDefault();
                if (this.gameOver) {
                    this.restart();
                }
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    restart() {
        this.gameOver = false;
        this.victory = false;
        this.score = 0;
        this.distance = 0;
        this.bossSpawned = false;
        this.player = new Player(this.canvas.width / 2 - 20, this.canvas.height - 100);
        this.enemies = [];
        this.boss = null;
        this.explosions = [];
        this.showInstructions = true;
        this.instructionsTimer = 5000;
    }
    
    spawnEnemy() {
        const now = Date.now();
        if (now - this.lastEnemySpawn >= this.enemySpawnDelay && !this.bossSpawned) {
            this.lastEnemySpawn = now;
            const x = Math.random() * (this.canvas.width - 30);
            this.enemies.push(new Enemy(x, -40));
        }
    }
    
    spawnBoss() {
        if (!this.bossSpawned && this.distance >= 1000) {
            this.bossSpawned = true;
            this.boss = new Boss(this.canvas.width / 2 - 60, 50);
        }
    }
    
    update() {
        if (this.showInstructions) {
            this.instructionsTimer -= 16;
            if (this.instructionsTimer <= 0) {
                this.showInstructions = false;
            }
            return;
        }
        
        if (this.gameOver) return;
        
        // 更新距离和难度
        this.distance += 0.5;
        this.enemySpawnDelay = Math.max(500, 1500 - this.distance / 10);
        
        // 更新玩家
        if (this.keys['ArrowLeft'] || this.keys['a']) this.player.move(-1, 0);
        if (this.keys['ArrowRight'] || this.keys['d']) this.player.move(1, 0);
        if (this.keys['ArrowUp'] || this.keys['w']) this.player.move(0, -1);
        if (this.keys['ArrowDown'] || this.keys['s']) this.player.move(0, 1);
        if (this.keys[' ']) this.player.shoot();
        
        this.player.update();
        
        // 生成敌人和Boss
        this.spawnEnemy();
        this.spawnBoss();
        
        // 更新敌人
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update();
            
            // 检查敌人是否超出边界
            if (enemy.isOutOfBounds(this.canvas.height)) {
                this.enemies.splice(i, 1);
                continue;
            }
            
            // 检查玩家子弹是否击中敌人
            for (let j = this.player.bullets.length - 1; j >= 0; j--) {
                const bullet = this.player.bullets[j];
                if (bullet.checkCollision(enemy)) {
                    if (enemy.takeDamage()) {
                        this.explosions.push(new Explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2));
                        this.enemies.splice(i, 1);
                        this.score += 100;
                    }
                    this.player.bullets.splice(j, 1);
                    break;
                }
            }
            
            // 检查敌人子弹是否击中玩家
            for (let j = enemy.bullets.length - 1; j >= 0; j--) {
                const bullet = enemy.bullets[j];
                if (bullet.checkCollision(this.player)) {
                    if (this.player.takeDamage()) {
                        this.gameOver = true;
                    }
                    enemy.bullets.splice(j, 1);
                    break;
                }
            }
            
            // 检查敌人是否撞击玩家
            if (enemy.checkCollision && enemy.checkCollision(this.player)) {
                // 先创建爆炸效果
                this.explosions.push(new Explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2));
                // 如果玩家受到伤害且生命值归零，则游戏结束
                if (this.player.takeDamage(2)) { // 碰撞造成2点伤害
                    this.gameOver = true;
                }
                this.enemies.splice(i, 1);
            }
        }
        
        // 更新Boss
        if (this.boss) {
            this.boss.update();
            
            // 检查玩家子弹是否击中Boss
            for (let i = this.player.bullets.length - 1; i >= 0; i--) {
                const bullet = this.player.bullets[i];
                if (bullet.checkCollision(this.boss)) {
                    if (this.boss.takeDamage()) {
                        this.explosions.push(new Explosion(this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height / 2));
                        this.boss = null;
                        this.victory = true;
                        this.gameOver = true;
                        this.score += 1000;
                    }
                    this.player.bullets.splice(i, 1);
                    break;
                }
            }
            
            // 检查Boss子弹是否击中玩家
            if (this.boss) {
                for (let i = this.boss.bullets.length - 1; i >= 0; i--) {
                    const bullet = this.boss.bullets[i];
                    if (bullet.checkCollision(this.player)) {
                        if (this.player.takeDamage()) {
                            this.gameOver = true;
                        }
                        this.boss.bullets.splice(i, 1);
                        break;
                    }
                }
            }
        }
        
        // 更新爆炸效果
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            if (this.explosions[i].update()) {
                this.explosions.splice(i, 1);
            }
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
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('飞机大战', this.canvas.width / 2, this.canvas.height / 2 - 100);
            
            this.ctx.font = '24px Arial';
            this.ctx.fillText('使用方向键或WASD移动', this.canvas.width / 2, this.canvas.height / 2 - 20);
            this.ctx.fillText('空格键发射子弹', this.canvas.width / 2, this.canvas.height / 2 + 20);
            this.ctx.fillText('击败Boss获得胜利', this.canvas.width / 2, this.canvas.height / 2 + 60);
            
            const timeLeft = Math.ceil(this.instructionsTimer / 1000);
            this.ctx.fillText(`${timeLeft}秒后开始游戏...`, this.canvas.width / 2, this.canvas.height / 2 + 120);
            return;
        }
        
        // 绘制玩家
        this.player.draw(this.ctx);
        
        // 绘制敌人
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // 绘制Boss
        if (this.boss) {
            this.boss.draw(this.ctx);
        }
        
        // 绘制爆炸效果
        this.explosions.forEach(explosion => explosion.draw(this.ctx));
        
        // 绘制UI
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`分数: ${this.score}`, 20, 30);
        this.ctx.fillText(`生命: ${this.player.health}`, 20, 60);
        
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
                `最终得分: ${this.score}`,
                this.canvas.width / 2,
                this.canvas.height / 2 + 50
            );
            
            this.ctx.fillText(
                '按空格键重新开始',
                this.canvas.width / 2,
                this.canvas.height / 2 + 100
            );
        }
    }
    
    gameLoop(timestamp) {
        // 计算帧时间
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// 启动游戏
window.onload = () => {
    new Game();
};