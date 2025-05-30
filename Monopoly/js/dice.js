class Dice {
    constructor() {
        this.values = [0, 0];
        this.isDouble = false;
        this.doubleCount = 0;
    }

    // 掷骰子
    roll() {
        // 生成两个1-6的随机数
        this.values = [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ];

        // 检查是否掷出双数
        this.isDouble = this.values[0] === this.values[1];
        
        // 如果是双数，增加双数计数
        if (this.isDouble) {
            this.doubleCount++;
        } else {
            this.doubleCount = 0;
        }

        return {
            values: this.values,
            total: this.getTotal(),
            isDouble: this.isDouble,
            doubleCount: this.doubleCount
        };
    }

    // 获取骰子点数总和
    getTotal() {
        return this.values[0] + this.values[1];
    }

    // 显示骰子结果
    showResult() {
        const diceResult = document.getElementById('diceResult');
        const total = this.getTotal();
        
        // 使用 Unicode 骰子符号
        const diceUnicode = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        const dice1 = diceUnicode[this.values[0] - 1];
        const dice2 = diceUnicode[this.values[1] - 1];
        
        diceResult.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 10px;">
                ${dice1} ${dice2}
            </div>
            <div>
                点数：${total}
                ${this.isDouble ? '<br>(双数!)' : ''}
            </div>
        `;
        
        diceResult.style.display = 'block';
        
        // 3秒后隐藏结果
        setTimeout(() => {
            diceResult.style.display = 'none';
        }, 3000);
    }

    // 重置双数计数
    resetDoubleCount() {
        this.doubleCount = 0;
    }

    // 检查是否因为连续掷出三次双数而需要入狱
    checkTripleDouble() {
        return this.doubleCount >= 3;
    }
}
