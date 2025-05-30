class Property {
    constructor(square) {
        this.index = square.index;
        this.name = square.name;
        this.price = square.price;
        this.baseRent = square.rent;
        this.color = square.color;
        this.owner = null;
        this.houses = 0;
        this.isMortgaged = false;
    }

    // 计算当前租金
    calculateRent() {
        if (this.isMortgaged) {
            return 0;
        }

        let rent = this.baseRent;

        // 如果有房屋，租金随房屋数量增加
        if (this.houses > 0) {
            rent = this.baseRent * Math.pow(2, this.houses);
        } else if (this.owner !== null) {
            // 检查是否拥有同色地产组
            const player = window.game.players[this.owner];
            if (player && player.hasCompleteColorGroup(this.color)) {
                rent *= 2;
            }
        }

        return rent;
    }

    // 购买地产
    purchase(player) {
        if (this.owner === null && player.canAfford(this.price)) {
            player.deductMoney(this.price);
            this.owner = player.index;
            player.properties.push(this.index);
            return true;
        }
        return false;
    }

    // 建造房屋
    buildHouse(player) {
        if (this.owner !== player.index || this.houses >= 4 || this.isMortgaged) {
            return false;
        }

        // 检查是否拥有同色地产组
        if (!player.hasCompleteColorGroup(this.color)) {
            return false;
        }

        const buildingCost = this.price * 0.5;
        if (player.canAfford(buildingCost)) {
            player.deductMoney(buildingCost);
            this.houses++;
            return true;
        }

        return false;
    }

    // 抵押地产
    mortgage(player) {
        if (this.owner !== player.index || this.isMortgaged || this.houses > 0) {
            return false;
        }

        player.addMoney(this.price * 0.5);
        this.isMortgaged = true;
        return true;
    }

    // 取消抵押
    unmortgage(player) {
        if (this.owner !== player.index || !this.isMortgaged) {
            return false;
        }

        const unmortgageCost = this.price * 0.6; // 包含10%利息
        if (player.canAfford(unmortgageCost)) {
            player.deductMoney(unmortgageCost);
            this.isMortgaged = false;
            return true;
        }

        return false;
    }

    // 收取租金
    collectRent(fromPlayer) {
        if (this.owner === null || this.owner === fromPlayer.index || this.isMortgaged) {
            return false;
        }

        const rent = this.calculateRent();
        if (fromPlayer.canAfford(rent)) {
            fromPlayer.deductMoney(rent);
            window.game.players[this.owner].addMoney(rent);
            return true;
        }

        return false;
    }

    // 获取地产信息
    getInfo() {
        const info = {
            name: this.name,
            price: this.price,
            rent: this.calculateRent(),
            owner: this.owner !== null ? window.game.players[this.owner].name : '无',
            houses: this.houses,
            isMortgaged: this.isMortgaged,
            color: this.color
        };

        return info;
    }

    // 显示地产详细信息
    showDetails() {
        const propertyInfo = document.getElementById('propertyInfo');
        const propertyDetails = document.getElementById('propertyDetails');
        
        const info = this.getInfo();
        
        let detailsHTML = `
            <h4>${info.name}</h4>
            <p>价格: ￥${info.price}</p>
            <p>当前租金: ￥${info.rent}</p>
            <p>所有者: ${info.owner}</p>
            <p>房屋数量: ${info.houses}</p>
        `;

        if (info.isMortgaged) {
            detailsHTML += '<p class="text-danger">已抵押</p>';
        }

        propertyDetails.innerHTML = detailsHTML;
        propertyInfo.style.display = 'block';
    }

    // 隐藏地产详细信息
    hideDetails() {
        const propertyInfo = document.getElementById('propertyInfo');
        propertyInfo.style.display = 'none';
    }

    // 更新地产显示
    updateDisplay() {
        // 通知棋盘重新绘制这个格子
        window.game.board.updateSquare(this.index, {
            owner: this.owner,
            houses: this.houses,
            isMortgaged: this.isMortgaged
        });
    }
}
