class SimpleGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentWord = null;
        this.explosions = [];
        this.hits = 0;
        this.misses = 0;
        this.totalWords = 20;
        this.currentInput = '';
        this.isGameRunning = false;
        this.lastTime = 0;
        this.translationTimer = null;
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
            // 一旦开始输入就清空placeholder
            if (e.target.value) {
                e.target.placeholder = '';
            }
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
        document.getElementById('gameStatus').textContent = '';  // 清空状态提示
        document.getElementById('userInput').focus();
        this.showNewWord();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    resetGame() {
        this.currentWord = null;
        this.explosions = [];
        this.hits = 0;
        this.misses = 0;
        this.updateScore();
        const input = document.getElementById('userInput');
        input.value = '';
        input.placeholder = '在此输入...';  // 重置placeholder
        document.getElementById('gameMessage').textContent = '';
        document.getElementById('gameStatus').textContent = '准备开始，输入单词后将显示中文含义';
        if (this.translationTimer) {
            clearTimeout(this.translationTimer);
        }
    }

    updateScore() {
        document.getElementById('hits').textContent = this.hits;
        document.getElementById('misses').textContent = this.misses;
    }

    showNewWord() {
        if (this.hits + this.misses >= this.totalWords) {
            this.endGame();
            return;
        }
        const wordObj = getRandomWord();
        this.currentWord = {
            text: wordObj.en,
            translation: wordObj.cn,
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            showEnglish: true,
            showTranslation: false
        };
    }

    checkInput() {
        const input = this.currentInput;
        if (this.currentWord && input === this.currentWord.text) {
            // 创建爆炸效果
            this.explosions.push(new Explosion(
                this.currentWord.x,
                this.currentWord.y,
                this.currentWord.text,
                this.currentWord.translation
            ));
            
            // 清空输入并隐藏英文单词
            document.getElementById('userInput').value = '';
            this.currentInput = '';
            this.hits++;
            this.updateScore();
            
            // 隐藏英文单词，显示中文
            this.currentWord.showEnglish = false;
            this.currentWord.showTranslation = true;

            // 等待爆炸动画完成后再显示1秒中文
            if (this.translationTimer) {
                clearTimeout(this.translationTimer);
            }

            this.translationTimer = setTimeout(() => {
                this.showNewWord();
            }, 2000); // 爆炸动画约1秒 + 额外显示中文1秒
        }
    }

    update(deltaTime) {
        // 更新爆炸效果
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            if (!this.explosions[i].update()) {
                this.explosions.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.currentWord) {
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            // 绘制英文单词
            if (this.currentWord.showEnglish) {
                this.ctx.font = '48px Arial';
                this.ctx.fillStyle = '#333';
                this.ctx.fillText(this.currentWord.text, this.currentWord.x, this.currentWord.y);
            }

            // 绘制中文翻译
            if (this.currentWord.showTranslation) {
                this.ctx.font = 'bold 36px Arial';
                this.ctx.fillStyle = '#2196F3';
                this.ctx.fillText(this.currentWord.translation, this.currentWord.x, this.currentWord.y);
            }
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
        this.currentWord = null;
        this.explosions = [];
        if (this.translationTimer) {
            clearTimeout(this.translationTimer);
            this.translationTimer = null;
        }
        document.getElementById('startButton').textContent = '重新开始';
        
        let message = '';
        if (this.hits === this.totalWords) {
            message = '太棒了！你完美地完成了所有单词！';
        } else if (this.hits >= this.totalWords * 0.8) {
            message = `做得很好！你正确输入了 ${this.hits} 个单词！`;
        } else {
            message = `游戏结束。你正确输入了 ${this.hits} 个单词，继续加油！`;
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
        if (this.translationTimer) {
            clearTimeout(this.translationTimer);
            this.translationTimer = null;
        }
        this.currentWord = null;
        this.explosions = [];
        this.currentInput = '';
        this.hits = 0;
        this.misses = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
