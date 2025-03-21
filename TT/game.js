class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.words = [];
        this.explosions = [];
        this.hits = 0;
        this.misses = 0;
        this.totalWords = 20;
        this.currentInput = '';
        this.isGameRunning = false;
        this.lastTime = 0;
        this.spawnInterval = 2000; // 生成新单词的间隔（毫秒）
        this.lastSpawnTime = 0;
        this.animationFrameId = null;

        // 设置canvas尺寸
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // 初始化事件监听
        this.initEventListeners();
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    initEventListeners() {
        const input = document.getElementById('userInput');
        const startButton = document.getElementById('startButton');

        input.addEventListener('input', (e) => {
            this.currentInput = e.target.value.toLowerCase();
            this.checkInput();
        });

        startButton.addEventListener('click', () => {
            if (!this.isGameRunning) {
                this.startGame();
            }
        });
    }

    startGame() {
        this.resetGame();
        this.isGameRunning = true;
        document.getElementById('startButton').textContent = '游戏进行中';
        document.getElementById('gameStatus').textContent = '游戏开始！';
        document.getElementById('userInput').focus();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    resetGame() {
        this.words = [];
        this.explosions = [];
        this.hits = 0;
        this.misses = 0;
        this.updateScore();
        document.getElementById('userInput').value = '';
        document.getElementById('gameMessage').textContent = '';
    }

    updateScore() {
        document.getElementById('hits').textContent = this.hits;
        document.getElementById('misses').textContent = this.misses;
    }

    spawnWord() {
        const wordObj = getRandomWord();
        const x = Math.random() * (this.canvas.width - 100) + 50;
        this.words.push({
            text: wordObj.en,
            translation: wordObj.cn,
            x: x,
            y: 0,
            speed: Math.random() * 1 + 1 // 1-2 像素/帧
        });
    }

    checkInput() {
        const input = this.currentInput;
        for (let i = 0; i < this.words.length; i++) {
            if (this.words[i].text === input) {
                // 创建爆炸效果
                this.explosions.push(new Explosion(
                    this.words[i].x,
                    this.words[i].y,
                    this.words[i].text,
                    this.words[i].translation
                ));
                
                // 移除匹配的单词并清空输入
                this.words.splice(i, 1);
                document.getElementById('userInput').value = '';
                this.currentInput = '';
                this.hits++;
                this.updateScore();
                
                // 检查游戏是否结束
                if (this.hits + this.misses >= this.totalWords) {
                    this.endGame();
                }
                break;
            }
        }
    }

    update(deltaTime) {
        // 更新单词位置
        for (let i = this.words.length - 1; i >= 0; i--) {
            this.words[i].y += this.words[i].speed;
            
            // 检查是否触底
            if (this.words[i].y > this.canvas.height) {
                this.words.splice(i, 1);
                this.misses++;
                this.updateScore();
                
                // 检查游戏是否结束
                if (this.hits + this.misses >= this.totalWords) {
                    this.endGame();
                }
            }
        }

        // 更新爆炸效果
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            if (!this.explosions[i].update()) {
                this.explosions.splice(i, 1);
            }
        }

        // 生成新单词
        if (this.isGameRunning && 
            this.hits + this.misses < this.totalWords && 
            Date.now() - this.lastSpawnTime > this.spawnInterval) {
            this.spawnWord();
            this.lastSpawnTime = Date.now();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制单词
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        for (const word of this.words) {
            this.ctx.fillStyle = '#333';
            this.ctx.fillText(word.text, word.x, word.y);
        }

        // 绘制爆炸效果
        for (const explosion of this.explosions) {
            explosion.draw(this.ctx);
        }
    }

    gameLoop(timestamp) {
        if (!this.isGameRunning) {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            return;
        }

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    endGame() {
        this.isGameRunning = false;
        this.words = [];
        this.explosions = [];
        document.getElementById('startButton').textContent = '重新开始';
        
        let message = '';
        if (this.misses === 0) {
            message = '太棒了！你完美地完成了所有单词！';
        } else if (this.misses <= 10) {
            message = `做得不错！你击中了 ${this.hits} 个单词，继续努力！`;
        } else {
            message = '游戏结束。再接再厉，继续练习！';
        }
        
        document.getElementById('gameStatus').textContent = '游戏结束';
        document.getElementById('gameMessage').textContent = message;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    cleanup() {
        this.isGameRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.words = [];
        this.explosions = [];
        this.currentInput = '';
        this.hits = 0;
        this.misses = 0;
        this.lastSpawnTime = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// 当页面加载完成后启动游戏
window.addEventListener('load', () => {
    new Game();
});
