class Player {
    constructor(name, index) {
        this.name = name;
        this.index = index; // 0 for player1, 1 for player2
        this.money = 1500;
        this.position = 0;
        this.properties = [];
        this.inJail = false;
        this.jailTurns = 0;
        this.getOutOfJailCards = 0;
    }

    // 移动到指定位置
    moveTo(position) {
        // 如果经过起点，获得200元
        if (position < this.position) {
            this.addMoney(200);
        }
        this.position = position;
    }

    // 向前移动指定步数
    moveForward(steps) {
        let newPosition = (this.position + steps) % 36;
        this.moveTo(newPosition);
        return newPosition;
    }

    // 添加金钱
    addMoney(amount) {
        this.money += amount;
        this.updateDisplay();
        return this.money;
    }

    // 扣除金钱
    deductMoney(amount) {
        this.money -= amount;
        this.updateDisplay();
        return this.money;
    }

    // 检查是否有足够的钱
    canAfford(amount) {
        return this.money >= amount;
    }

    // 购买地产
    buyProperty(property) {
        if (this.canAfford(property.price)) {
            this.deductMoney(property.price);
            this.properties.push(property.index);
            return true;
        }
        return false;
    }

    // 建造房屋
    buildHouse(property) {
        const buildingCost = property.price * 0.5;
        if (this.canAfford(buildingCost) && property.houses < 4) {
            this.deductMoney(buildingCost);
            return true;
        }
        return false;
    }

    // 获取玩家拥有的所有同色地产组
    getPropertyGroups() {
        const groups = {};
        this.properties.forEach(propertyIndex => {
            const property = window.game.board.getSquareAtIndex(propertyIndex);
            if (property.color) {
                if (!groups[property.color]) {
                    groups[property.color] = [];
                }
                groups[property.color].push(propertyIndex);
            }
        });
        return groups;
    }

    // 检查是否拥有完整的颜色组
    hasCompleteColorGroup(color) {
        const groups = this.getPropertyGroups();
        const colorProperties = window.game.board.squares.filter(
            square => square.type === 'property' && square.color === color
        ).length;
        return groups[color] && groups[color].length === colorProperties;
    }

    // 计算总资产
    calculateNetWorth() {
        let total = this.money;
        this.properties.forEach(propertyIndex => {
            const property = window.game.board.getSquareAtIndex(propertyIndex);
            total += property.price;
            total += property.houses * (property.price * 0.5);
        });
        return total;
    }

    // 进入监狱
    goToJail() {
        this.inJail = true;
        this.jailTurns = 0;
        this.position = 9; // 监狱位置
    }

    // 尝试离开监狱
    tryToLeaveJail(diceRoll) {
        this.jailTurns++;
        
        // 使用出狱卡
        if (this.getOutOfJailCards > 0) {
            this.getOutOfJailCards--;
            this.inJail = false;
            return true;
        }
        
        // 掷出双数
        if (diceRoll.isDouble) {
            this.inJail = false;
            return true;
        }
        
        // 已在监狱3回合
        if (this.jailTurns >= 3) {
            if (this.canAfford(50)) {
                this.deductMoney(50);
                this.inJail = false;
                return true;
            }
        }
        
        return false;
    }

    // 更新显示
    updateDisplay() {
        const nameElement = document.getElementById(`player${this.index + 1}Name`);
        const moneyElement = document.getElementById(`player${this.index + 1}Money`);
        
        if (nameElement) nameElement.textContent = this.name;
        if (moneyElement) moneyElement.textContent = this.money;
    }

    // 检查是否破产
    isBankrupt() {
        return this.money < 0 && this.properties.length === 0;
    }

    // 抵押地产
    mortgageProperty(propertyIndex) {
        const property = window.game.board.getSquareAtIndex(propertyIndex);
        if (this.properties.includes(propertyIndex) && !property.isMortgaged) {
            this.addMoney(property.price * 0.5);
            property.isMortgaged = true;
            return true;
        }
        return false;
    }

    // 取消抵押
    unmortgageProperty(propertyIndex) {
        const property = window.game.board.getSquareAtIndex(propertyIndex);
        const unmortgageCost = property.price * 0.6; // 取消抵押需要支付10%的利息
        
        if (this.properties.includes(propertyIndex) && 
            property.isMortgaged && 
            this.canAfford(unmortgageCost)) {
            this.deductMoney(unmortgageCost);
            property.isMortgaged = false;
            return true;
        }
        return false;
    }

    // 出售房屋
    sellHouse(propertyIndex) {
        const property = window.game.board.getSquareAtIndex(propertyIndex);
        if (this.properties.includes(propertyIndex) && property.houses > 0) {
            property.houses--;
            this.addMoney(property.price * 0.25); // 出售房屋返还一半建造成本
            return true;
        }
        return false;
    }

    // 出售地产
    sellProperty(propertyIndex, buyer, price) {
        if (this.properties.includes(propertyIndex) && buyer.canAfford(price)) {
            const propertyIndex = this.properties.indexOf(propertyIndex);
            this.properties.splice(propertyIndex, 1);
            buyer.properties.push(propertyIndex);
            this.addMoney(price);
            buyer.deductMoney(price);
            return true;
        }
        return false;
    }
}
