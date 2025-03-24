class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 600;
        this.canvas.height = 400;

        this.snake = new Snake(this.canvas);
        this.obstacles = [];
        this.food = new Food(this.canvas, this.snake, this.obstacles);

        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.level = 1;
        this.levelGoal = 5; // 每关需要吃到的食物数量
        this.foodCount = 0;

        this.gameLoop = null;
        this.isGameOver = false;
        this.isPaused = false;

        this.initializeLevel();
        this.setupEventListeners();
    }

    initializeLevel() {
        // 清空现有障碍物
        this.obstacles = [];

        // 根据关卡设置障碍物数量和蛇的速度
        const levelConfig = {
            1: { obstacles: 3, speed: 5 },
            2: { obstacles: 6, speed: 7 },
            3: { obstacles: 9, speed: 9 }
        };

        const config = levelConfig[this.level];
        this.snake.setSpeed(config.speed);

        // 生成障碍物
        for (let i = 0; i < config.obstacles; i++) {
            const obstacle = new Obstacle(this.canvas);
            obstacle.generatePosition(this.snake, this.food, this.obstacles);
            this.obstacles.push(obstacle);
        }

        // 确保食物不会生成在新的障碍物上
        this.food.obstacles = this.obstacles;
        this.food.generateNewPosition();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (this.isGameOver) return;

            switch(event.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.snake.changeDirection('up');
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.snake.changeDirection('down');
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.snake.changeDirection('left');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.snake.changeDirection('right');
                    break;
                case ' ':
                    this.togglePause();
                    break;
            }
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused && !this.gameLoop) {
            this.gameLoop = setInterval(() => this.update(), 1000 / this.snake.speed);
        }
    }

    start() {
        if (!this.gameLoop) {
            this.gameLoop = setInterval(() => this.update(), 1000 / this.snake.speed);
        }
        this.hideAllMessages();
    }

    update() {
        if (this.isGameOver || this.isPaused) return;

        this.snake.move();

        // 检查碰撞
        if (this.snake.checkCollision(this.canvas.width, this.canvas.height)) {
            this.handleGameOver();
            return;
        }

        // 检查是否撞到障碍物
        for (const obstacle of this.obstacles) {
            if (this.snake.checkCollisionWithObstacle(obstacle)) {
                this.handleGameOver();
                return;
            }
        }

        // 检查是否吃到食物
        if (this.snake.checkFoodCollision(this.food)) {
            this.handleFoodCollision();
        }

        this.draw();
    }

    handleFoodCollision() {
        this.snake.grow();
        this.score += 10 * this.level;
        this.foodCount++;
        this.food.generateNewPosition();
        audioManager.playEatSound();

        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
        }

        // 更新显示
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;

        // 检查是否完成当前关卡
        if (this.foodCount >= this.levelGoal) {
            this.handleLevelComplete();
        }
    }

    handleLevelComplete() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        audioManager.playLevelUpSound();

        if (this.level < 3) {
            document.getElementById('levelComplete').style.display = 'block';
        } else {
            document.getElementById('gameComplete').style.display = 'block';
            audioManager.playVictorySound();
        }
    }

    handleGameOver() {
        this.isGameOver = true;
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        audioManager.playGameOverSound();

        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
    }

    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格背景
        this.drawGrid();

        // 绘制游戏元素
        this.snake.draw();
        this.food.draw();
        this.obstacles.forEach(obstacle => obstacle.draw());
    }

    drawGrid() {
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x < this.canvas.width; x += this.snake.size) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += this.snake.size) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    hideAllMessages() {
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('levelComplete').style.display = 'none';
        document.getElementById('gameComplete').style.display = 'none';
    }

    reset() {
        this.score = 0;
        this.level = 1;
        this.foodCount = 0;
        this.isGameOver = false;
        this.isPaused = false;

        document.getElementById('score').textContent = '0';
        document.getElementById('level').textContent = '1';

        this.snake.reset();
        this.initializeLevel();
        this.hideAllMessages();
    }
}

// 游戏控制函数
function startGame() {
    window.game = new Game();
    game.reset();
    game.start();
}

function nextLevel() {
    if (game.level < 3) {
        game.level++;
        game.foodCount = 0;
        document.getElementById('level').textContent = game.level;
        game.snake.reset();
        game.initializeLevel();
        game.start();
    }
}

// 页面加载完成后启动游戏
window.addEventListener('load', startGame);