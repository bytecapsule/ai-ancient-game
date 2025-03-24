class Food {
    constructor(canvas, snake, obstacles = []) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.snake = snake;
        this.obstacles = obstacles;
        this.size = snake.size;
        this.position = { x: 0, y: 0 };
        this.generateNewPosition();
    }

    draw() {
        const x = this.position.x * this.size;
        const y = this.position.y * this.size;
        const size = this.size;

        // 绘制苹果主体（红色）
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.beginPath();
        this.ctx.arc(x + size/2, y + size/2, size/2 - 2, 0, Math.PI * 2);
        this.ctx.fill();

        // 添加高光效果
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(x + size/3, y + size/3, size/6, 0, Math.PI * 2);
        this.ctx.fill();

        // 绘制苹果柄（棕色）
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + size/2, y + 2);
        this.ctx.lineTo(x + size/2 + 3, y - 2);
        this.ctx.stroke();

        // 绘制叶子（绿色）
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.beginPath();
        this.ctx.ellipse(x + size/2 + 4, y, 3, 2, Math.PI/4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    generateNewPosition() {
        const width = this.canvas.width / this.size;
        const height = this.canvas.height / this.size;
        let validPosition = false;

        while (!validPosition) {
            this.position = {
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height)
            };

            validPosition = this.isValidPosition();
        }
    }

    isValidPosition() {
        // 检查是否与蛇身重叠
        const overlapsSnake = this.snake.body.some(segment =>
            segment.x === this.position.x && segment.y === this.position.y
        );

        // 检查是否与障碍物重叠
        const overlapsObstacle = this.obstacles.some(obstacle =>
            obstacle.position.x === this.position.x && obstacle.position.y === this.position.y
        );

        return !overlapsSnake && !overlapsObstacle;
    }
}