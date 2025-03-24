class Snake {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
    }

    reset() {
        this.size = 20; // 蛇身每一节的大小
        this.speed = 5; // 初始速度
        this.direction = 'right'; // 初始方向
        this.nextDirection = 'right';
        this.body = [
            { x: 3, y: 1 }, // 头部
            { x: 2, y: 1 },
            { x: 1, y: 1 }  // 尾部
        ];
        this.growing = false;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    draw() {
        this.ctx.fillStyle = '#2ecc71'; // 蛇身颜色
        this.body.forEach((segment, index) => {
            if (index === 0) {
                // 蛇头使用不同的颜色
                this.ctx.fillStyle = '#27ae60';
            } else {
                this.ctx.fillStyle = '#2ecc71';
            }
            this.ctx.fillRect(
                segment.x * this.size,
                segment.y * this.size,
                this.size - 2,
                this.size - 2
            );

            // 绘制蛇眼睛
            if (index === 0) {
                this.ctx.fillStyle = '#fff';
                const eyeSize = 4;
                const eyeOffset = 5;
                
                // 根据方向调整眼睛位置
                switch(this.direction) {
                    case 'right':
                        this.drawEyes(segment, eyeOffset, this.size/2 - eyeSize, 0);
                        break;
                    case 'left':
                        this.drawEyes(segment, this.size - eyeOffset, this.size/2 - eyeSize, 0);
                        break;
                    case 'up':
                        this.drawEyes(segment, this.size/2 - eyeSize, this.size - eyeOffset, 1);
                        break;
                    case 'down':
                        this.drawEyes(segment, this.size/2 - eyeSize, eyeOffset, 1);
                        break;
                }
            }
        });
    }

    drawEyes(segment, offsetX, offsetY, orientation) {
        const eyeSize = 4;
        const eyeSpacing = 8;
        if (orientation === 0) { // 水平方向
            this.ctx.fillRect(
                segment.x * this.size + offsetX,
                segment.y * this.size + offsetY - eyeSpacing/2,
                eyeSize,
                eyeSize
            );
            this.ctx.fillRect(
                segment.x * this.size + offsetX,
                segment.y * this.size + offsetY + eyeSpacing/2,
                eyeSize,
                eyeSize
            );
        } else { // 垂直方向
            this.ctx.fillRect(
                segment.x * this.size + offsetX - eyeSpacing/2,
                segment.y * this.size + offsetY,
                eyeSize,
                eyeSize
            );
            this.ctx.fillRect(
                segment.x * this.size + offsetX + eyeSpacing/2,
                segment.y * this.size + offsetY,
                eyeSize,
                eyeSize
            );
        }
    }

    move() {
        // 更新方向
        this.direction = this.nextDirection;

        // 获取头部位置
        const head = { ...this.body[0] };

        // 根据方向移动头部
        switch(this.direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }

        // 将新头部添加到身体数组的开头
        this.body.unshift(head);

        // 如果没有在生长，则移除尾部
        if (!this.growing) {
            this.body.pop();
        } else {
            this.growing = false;
        }
    }

    grow() {
        this.growing = true;
    }

    changeDirection(newDirection) {
        // 防止180度转向
        const invalidMoves = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        if (invalidMoves[this.direction] !== newDirection) {
            this.nextDirection = newDirection;
        }
    }

    checkCollision(width, height) {
        const head = this.body[0];

        // 检查是否撞墙
        if (head.x < 0 || head.x >= width/this.size ||
            head.y < 0 || head.y >= height/this.size) {
            return true;
        }

        // 检查是否撞到自己
        return this.body.slice(1).some(segment =>
            segment.x === head.x && segment.y === head.y
        );
    }

    checkCollisionWithObstacle(obstacle) {
        const head = this.body[0];
        return obstacle.position.x === head.x && obstacle.position.y === head.y;
    }

    checkFoodCollision(food) {
        const head = this.body[0];
        return food.position.x === head.x && food.position.y === head.y;
    }
}