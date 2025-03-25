// 游戏配置
const GRID_SIZE = 30; // 每个格子的大小
const COLS = 10; // 游戏区域列数
const ROWS = 20; // 游戏区域行数

// 方块形状定义
const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]]  // Z
];

// 颜色定义
const COLORS = [
    '#FF0D72', '#0DC2FF', '#0DFF72',
    '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'
];

class Tetris {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.blocksLeftElement = document.getElementById('blocks-left');
        
        this.reset();
        this.bindEvents();
        this.gameLoop();
    }

    reset() {
        this.grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
        this.score = 0;
        this.blocksLeft = 100;
        this.gameOver = false;
        this.createNewPiece();
        this.updateScore();
    }

    createNewPiece() {
        const shapeIndex = Math.floor(Math.random() * SHAPES.length);
        this.currentPiece = {
            shape: SHAPES[shapeIndex],
            color: COLORS[shapeIndex],
            x: Math.floor(COLS / 2) - Math.floor(SHAPES[shapeIndex][0].length / 2),
            y: 0
        };
    }

    rotate() {
        const rotated = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[row.length - 1 - i])
        );
        if (this.isValidMove(rotated, this.currentPiece.x, this.currentPiece.y)) {
            this.currentPiece.shape = rotated;
        }
    }

    isValidMove(shape, x, y) {
        return shape.every((row, dy) =>
            row.every((value, dx) =>
                value === 0 ||
                (x + dx >= 0 && x + dx < COLS &&
                 y + dy >= 0 && y + dy < ROWS &&
                 this.grid[y + dy][x + dx] === 0)
            )
        );
    }

    merge() {
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.grid[y + this.currentPiece.y][x + this.currentPiece.x] = this.currentPiece.color;
                }
            });
        });
    }

    clearLines() {
        let linesCleared = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== 0)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(COLS).fill(0));
                linesCleared++;
                y++;
            }
        }
        if (linesCleared > 0) {
            this.score += linesCleared * 100;
            this.updateScore();
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        this.blocksLeftElement.textContent = this.blocksLeft;
    }

    checkGameOver() {
        if (this.blocksLeft <= 0) {
            this.gameOver = true;
            alert('恭喜你赢了！最终得分：' + this.score);
            this.reset();
        } else if (this.grid[0].some(cell => cell !== 0)) {
            this.gameOver = true;
            alert('游戏结束！最终得分：' + this.score);
            this.reset();
        }
    }

    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制已固定的方块
        this.grid.forEach((row, y) => {
            row.forEach((color, x) => {
                if (color !== 0) {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
                }
            });
        });

        // 绘制当前方块
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.ctx.fillStyle = this.currentPiece.color;
                    this.ctx.fillRect(
                        (this.currentPiece.x + x) * GRID_SIZE,
                        (this.currentPiece.y + y) * GRID_SIZE,
                        GRID_SIZE - 1,
                        GRID_SIZE - 1
                    );
                }
            });
        });
    }

    moveDown() {
        if (this.isValidMove(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y + 1)) {
            this.currentPiece.y++;
        } else {
            this.merge();
            this.clearLines();
            this.blocksLeft--;
            this.updateScore();
            this.checkGameOver();
            if (!this.gameOver) {
                this.createNewPiece();
            }
        }
    }

    moveLeft() {
        if (this.isValidMove(this.currentPiece.shape, this.currentPiece.x - 1, this.currentPiece.y)) {
            this.currentPiece.x--;
        }
    }

    moveRight() {
        if (this.isValidMove(this.currentPiece.shape, this.currentPiece.x + 1, this.currentPiece.y)) {
            this.currentPiece.x++;
        }
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameOver) {
                switch (e.key) {
                    case 'ArrowLeft':
                        this.moveLeft();
                        break;
                    case 'ArrowRight':
                        this.moveRight();
                        break;
                    case 'ArrowDown':
                        this.moveDown();
                        break;
                    case 'ArrowUp':
                        this.rotate();
                        break;
                }
            }
        });
    }

    gameLoop() {
        if (!this.gameOver) {
            this.moveDown();
        }
        this.draw();
        setTimeout(() => this.gameLoop(), 1000);
    }
}

// 启动游戏
window.onload = () => {
    new Tetris();
};