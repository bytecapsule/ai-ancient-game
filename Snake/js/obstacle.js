class Obstacle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = 20; // 与蛇身大小相同
        this.position = { x: 0, y: 0 };
    }

    draw() {
        // 绘制砖块背景
        this.ctx.fillStyle = '#8B4513'; // 深棕色
        this.ctx.fillRect(
            this.position.x * this.size,
            this.position.y * this.size,
            this.size - 1,
            this.size - 1
        );

        // 添加砖块纹理
        this.ctx.strokeStyle = '#A0522D'; // 浅棕色
        this.ctx.lineWidth = 1;

        // 水平纹理线
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x * this.size, this.position.y * this.size + this.size/2);
        this.ctx.lineTo(this.position.x * this.size + this.size, this.position.y * this.size + this.size/2);
        this.ctx.stroke();

        // 垂直纹理线
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x * this.size + this.size/2, this.position.y * this.size);
        this.ctx.lineTo(this.position.x * this.size + this.size/2, this.position.y * this.size + this.size);
        this.ctx.stroke();
    }

    setPosition(x, y) {
        this.position = { x, y };
    }

    generatePosition(snake, food, obstacles) {
        const width = this.canvas.width / this.size;
        const height = this.canvas.height / this.size;
        let validPosition = false;

        while (!validPosition) {
            this.position = {
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height)
            };

            validPosition = this.isValidPosition(snake, food, obstacles);
        }
    }

    isValidPosition(snake, food, obstacles) {
        // 检查是否与蛇身重叠
        const overlapsSnake = snake.body.some(segment =>
            segment.x === this.position.x && segment.y === this.position.y
        );

        // 检查是否与食物重叠
        const overlapsFood = food.position.x === this.position.x &&
                           food.position.y === this.position.y;

        // 检查是否与其他障碍物重叠
        const overlapsObstacles = obstacles.some(obstacle =>
            obstacle !== this && // 排除自身
            obstacle.position.x === this.position.x &&
            obstacle.position.y === this.position.y
        );

        return !overlapsSnake && !overlapsFood && !overlapsObstacles;
    }
}