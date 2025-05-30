class Game {
    constructor() {
        this.board = new Board('gameBoard');
        this.dice = new Dice();
        this.cards = new Cards();
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameStarted = false;
        this.ui = new UI(this);
        this.waitingForAction = false;
        this.hasMoved = false;  // 标记玩家是否已经移动

        // 显示开始游戏对话框
        document.getElementById('startModal').style.display = 'flex';
    }

    // 开始游戏
    startGame(player1Name, player2Name) {
        this.players = [
            new Player(player1Name, 0),
            new Player(player2Name, 1)
        ];
        
        this.gameStarted = true;
        this.currentPlayerIndex = 0;
        this.hasMoved = false;
        this.waitingForAction = false;
        
        // 初始化棋盘
        this.board.draw();
        
        // 更新UI
        this.ui.updateGameState();
        this.ui.updatePlayerTokens();
    }

    // 获取当前玩家
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    // 检查是否可以掷骰子
    canRollDice() {
        return this.gameStarted && 
               !this.waitingForAction && 
               !this.getCurrentPlayer().inJail &&
               !this.hasMoved;  // 每回合只能掷一次骰子
    }

    // 掷骰子
    rollDice() {
        if (!this.canRollDice()) return;

        const result = this.dice.roll();
        this.dice.showResult();

        const currentPlayer = this.getCurrentPlayer();

        // 检查是否掷出三次双数
        if (this.dice.checkTripleDouble()) {
            currentPlayer.goToJail();
            this.ui.updateGameMessage('连续掷出三次双数，进入监狱！');
            this.ui.updatePlayerTokens();
            this.waitingForAction = false;
            this.hasMoved = true;
            return;
        }

        // 移动玩家
        const newPosition = currentPlayer.moveForward(result.total);
        this.ui.updatePlayerTokens();
        this.hasMoved = true;

        // 处理新位置
        this.handleNewPosition(newPosition);
    }

    // 处理玩家新位置
    handleNewPosition(position) {
        const square = this.board.getSquareAtIndex(position);
        const currentPlayer = this.getCurrentPlayer();

        switch (square.type) {
            case 'property':
                if (square.owner === null) {
                    this.waitingForAction = true;
                    this.ui.updateGameMessage('是否购买该地产？');
                } else if (square.owner !== currentPlayer.index) {
                    const property = new Property(square);
                    property.collectRent(currentPlayer);
                }
                break;

            case 'chance':
                const chanceCard = this.cards.drawChanceCard(currentPlayer);
                this.cards.showCard(chanceCard);
                this.waitingForAction = true;
                break;

            case 'chest':
                const chestCard = this.cards.drawChestCard(currentPlayer);
                this.cards.showCard(chestCard);
                this.waitingForAction = true;
                break;

            case 'tax':
                currentPlayer.deductMoney(square.amount);
                this.ui.updateGameMessage(`支付税款 ${square.amount} 元`);
                break;

            case 'corner':
                if (square.action === 'goto_jail') {
                    currentPlayer.goToJail();
                    this.ui.updateGameMessage('进入监狱！');
                }
                break;
        }

        this.ui.updateGameState();
        this.checkGameOver();
    }

    // 购买地产
    canBuyProperty() {
        if (!this.waitingForAction) return false;

        const currentPlayer = this.getCurrentPlayer();
        const square = this.board.getSquareAtIndex(currentPlayer.position);
        
        return square.type === 'property' && 
               square.owner === null && 
               currentPlayer.canAfford(square.price);
    }

    buyProperty() {
        if (!this.canBuyProperty()) return;

        const currentPlayer = this.getCurrentPlayer();
        const square = this.board.getSquareAtIndex(currentPlayer.position);
        const property = new Property(square);

        if (property.purchase(currentPlayer)) {
            this.ui.updateGameMessage('购买成功！');
            this.board.draw();
            this.waitingForAction = false;
        }

        this.ui.updateGameState();
    }

    // 建造房屋
    canBuildHouse() {
        if (!this.hasMoved) return false;
        
        const currentPlayer = this.getCurrentPlayer();
        const square = this.board.getSquareAtIndex(currentPlayer.position);
        
        return square.type === 'property' && 
               square.owner === currentPlayer.index &&
               currentPlayer.hasCompleteColorGroup(square.color) &&
               square.houses < 4;  // 最多4座房子
    }

    buildHouse() {
        if (!this.canBuildHouse()) return;

        const currentPlayer = this.getCurrentPlayer();
        const square = this.board.getSquareAtIndex(currentPlayer.position);
        const property = new Property(square);

        if (property.buildHouse(currentPlayer)) {
            this.ui.updateGameMessage('建造成功！');
            this.board.draw();
        }

        this.ui.updateGameState();
    }

    // 结束回合
    canEndTurn() {
        return this.gameStarted && this.hasMoved && !this.waitingForAction;
    }

    endTurn() {
        if (!this.canEndTurn()) return;

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
        this.dice.resetDoubleCount();
        this.hasMoved = false;  // 重置移动状态
        
        const currentPlayer = this.getCurrentPlayer();
        
        // 如果新玩家在监狱中
        if (currentPlayer.inJail) {
            this.ui.updateGameMessage(`${currentPlayer.name}在监狱中，需要掷出双数或支付50元才能出狱`);
        }
        
        this.ui.updateGameState();
    }


    // 继续游戏（事件卡片处理后）
    continueAfterEvent() {
        this.waitingForAction = false;
        this.ui.updateGameState();
        this.ui.updatePlayerTokens();
        this.checkGameOver();
    }

    // 检查游戏是否结束
    checkGameOver() {
        const bankruptPlayer = this.players.find(player => player.isBankrupt());
        
        if (bankruptPlayer) {
            const winner = this.players.find(player => player !== bankruptPlayer);
            this.gameStarted = false;
            this.ui.showGameOver(winner);
        }
    }

    // 处理监狱中的玩家
    handleJailedPlayer() {
        const currentPlayer = this.getCurrentPlayer();
        
        if (!currentPlayer.inJail) return true;

        const diceResult = this.dice.roll();
        this.dice.showResult();

        if (currentPlayer.tryToLeaveJail(diceResult)) {
            this.ui.updateGameMessage('成功离开监狱！');
            return true;
        }

        this.ui.updateGameMessage('未能离开监狱');
        return false;
    }
}

// 当页面加载完成时初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
