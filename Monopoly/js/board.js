class Board {
    constructor(canvas) {
        this.canvas = document.getElementById(canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布大小
        this.canvas.width = 700;
        this.canvas.height = 700;
        
        // 设置画布样式大小
        this.canvas.style.width = '700px';
        this.canvas.style.height = '700px';
        
        this.squares = [];
        this.initializeBoard();
    }

    initializeBoard() {
        
        // 定义棋盘格子的基本属性
        const squareSize = {
            side: 80,  // 边上格子的大小
            corner: 100  // 角落格子的大小
        };

        // 定义棋盘上的所有格子
        this.squares = [
            // 底边（从左到右）
            { type: 'corner', name: '起点', action: 'collect', amount: 200 },
            { type: 'property', name: '第一大道', price: 60, rent: 2, color: 'brown', position: 'bottom' },
            { type: 'chance', name: '机会', action: 'chance', position: 'bottom' },
            { type: 'property', name: '第二大道', price: 60, rent: 4, color: 'brown', position: 'bottom' },
            { type: 'tax', name: '所得税', action: 'tax', amount: 200, position: 'bottom' },
            { type: 'property', name: '第三大道', price: 100, rent: 6, color: 'lightblue', position: 'bottom' },
            { type: 'property', name: '第四大道', price: 100, rent: 6, color: 'lightblue', position: 'bottom' },
            { type: 'chance', name: '命运', action: 'chest', position: 'bottom' },
            { type: 'property', name: '第五大道', price: 120, rent: 8, color: 'lightblue', position: 'bottom' },

            // 右边（从下到上）
            { type: 'corner', name: '监狱', action: 'jail' },
            { type: 'property', name: '第六大道', price: 140, rent: 10, color: 'purple', position: 'right' },
            { type: 'utility', name: '电力公司', price: 150, position: 'right' },
            { type: 'property', name: '第七大道', price: 140, rent: 10, color: 'purple', position: 'right' },
            { type: 'property', name: '第八大道', price: 160, rent: 12, color: 'purple', position: 'right' },
            { type: 'property', name: '第九大道', price: 180, rent: 14, color: 'orange', position: 'right' },
            { type: 'chance', name: '机会', action: 'chance', position: 'right' },
            { type: 'property', name: '第十大道', price: 180, rent: 14, color: 'orange', position: 'right' },
            { type: 'property', name: '第十一大道', price: 200, rent: 16, color: 'orange', position: 'right' },

            // 顶边（从右到左）
            { type: 'corner', name: '免费停车', action: 'free' },
            { type: 'property', name: '第十二大道', price: 220, rent: 18, color: 'red', position: 'top' },
            { type: 'chance', name: '命运', action: 'chest', position: 'top' },
            { type: 'property', name: '第十三大道', price: 220, rent: 18, color: 'red', position: 'top' },
            { type: 'property', name: '第十四大道', price: 240, rent: 20, color: 'red', position: 'top' },
            { type: 'property', name: '第十五大道', price: 260, rent: 22, color: 'yellow', position: 'top' },
            { type: 'property', name: '第十六大道', price: 260, rent: 22, color: 'yellow', position: 'top' },
            { type: 'utility', name: '自来水公司', price: 150, position: 'top' },
            { type: 'property', name: '第十七大道', price: 280, rent: 24, color: 'yellow', position: 'top' },

            // 左边（从上到下）
            { type: 'corner', name: '入狱', action: 'goto_jail' },
            { type: 'property', name: '第十八大道', price: 300, rent: 26, color: 'green', position: 'left' },
            { type: 'property', name: '第十九大道', price: 300, rent: 26, color: 'green', position: 'left' },
            { type: 'chance', name: '机会', action: 'chance', position: 'left' },
            { type: 'property', name: '第二十大道', price: 320, rent: 28, color: 'green', position: 'left' },
            { type: 'tax', name: '奢侈税', action: 'tax', amount: 100, position: 'left' },
            { type: 'chance', name: '命运', action: 'chest', position: 'left' },
            { type: 'property', name: '第二十一大道', price: 350, rent: 35, color: 'blue', position: 'left' },
            { type: 'property', name: '第二十二大道', price: 400, rent: 50, color: 'blue', position: 'left' }
        ];

        // 为每个格子添加索引和位置信息
        this.squares.forEach((square, index) => {
            square.index = index;
            square.houses = 0;
            square.owner = null;
            
            // 计算格子的位置
            if (index <= 9) { // 底边（从右到左）
                square.x = this.canvas.width - (index === 0 ? squareSize.corner : (squareSize.corner + (index - 1) * squareSize.side));
                square.y = this.canvas.height - squareSize.corner;
            } else if (index <= 18) { // 右边（从下到上）
                square.x = 0;
                square.y = this.canvas.height - (squareSize.corner + (index - 10) * squareSize.side);
            } else if (index <= 27) { // 顶边（从左到右）
                square.x = (index - 19) * squareSize.side;
                square.y = 0;
            } else { // 左边（从上到下）
                square.x = this.canvas.width - squareSize.corner;
                square.y = (index - 28) * squareSize.side;
            }
        });
    }

    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制棋盘背景
        this.ctx.fillStyle = '#e9ecef';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制每个格子
        this.squares.forEach(square => {
            this.drawSquare(square);
        });
    }

    drawSquare(square) {
        const size = square.type === 'corner' ? 100 : 80;
        
        // 绘制格子背景
        this.ctx.fillStyle = this.getSquareColor(square);
        this.ctx.fillRect(square.x, square.y, size, size);
        
        // 绘制边框
        this.ctx.strokeStyle = '#000';
        this.ctx.strokeRect(square.x, square.y, size, size);

        // 保存当前上下文状态
        this.ctx.save();
        
        // 设置文字样式
        this.ctx.fillStyle = '#000';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        // 根据格子位置旋转文字
        const centerX = square.x + size/2;
        const centerY = square.y + size/2;
        this.ctx.translate(centerX, centerY);
        
        if (square.position === 'right') {
            this.ctx.rotate(Math.PI/2);
        } else if (square.position === 'left') {
            this.ctx.rotate(-Math.PI/2);
        } else if (square.position === 'top') {
            this.ctx.rotate(Math.PI);
        }
        
        // 根据格子类型绘制不同的内容
        if (square.type === 'property') {
            // 绘制地产名称
            this.ctx.fillText(square.name, 0, -size/4);
            
            // 绘制价格
            this.ctx.fillText(`￥${square.price}`, 0, 0);
            
            // 如果有所有者，绘制所有者标记
            if (square.owner !== null) {
                this.ctx.fillStyle = square.owner === 0 ? '#007bff' : '#dc3545';
                this.ctx.beginPath();
                this.ctx.arc(0, size/4, 5, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // 如果有房屋，绘制房屋标记
            if (square.houses > 0) {
                this.ctx.fillStyle = '#28a745';
                const startX = -size/3;
                for (let i = 0; i < square.houses; i++) {
                    this.ctx.fillRect(startX + i * 15, size/3, 10, 10);
                }
            }
        } else {
            // 绘制其他类型格子的名称
            this.ctx.fillText(square.name, 0, 0);
        }
        
        // 恢复上下文状态
        this.ctx.restore();
    }

    getSquareColor(square) {
        switch (square.type) {
            case 'property':
                return square.color || '#fff';
            case 'chance':
                return '#ffd700';
            case 'corner':
                return '#f8f9fa';
            case 'tax':
                return '#ff6b6b';
            case 'utility':
                return '#74c0fc';
            default:
                return '#fff';
        }
    }

    getSquareAtIndex(index) {
        return this.squares[index];
    }

    updateSquare(index, updates) {
        Object.assign(this.squares[index], updates);
        this.draw();
    }

    // 获取指定位置的格子信息
    getSquarePosition(index) {
        const square = this.squares[index];
        return {
            x: square.x,
            y: square.y
        };
    }

    // 计算玩家棋子的精确位置
    getTokenPosition(index, isSecondPlayer = false) {
        const square = this.squares[index];
        const size = square.type === 'corner' ? 100 : 80;
        
        return {
            x: square.x + (isSecondPlayer ? size/3 : size*2/3),
            y: square.y + size/2
        };
    }
}
