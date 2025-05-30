class UI {
    constructor(game) {
        this.game = game;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 开始游戏按钮
        document.getElementById('startGame').addEventListener('click', () => {
            const player1Name = document.getElementById('player1Input').value.trim() || '玩家1';
            const player2Name = document.getElementById('player2Input').value.trim() || '玩家2';
            
            this.game.startGame(player1Name, player2Name);
            document.getElementById('startModal').style.display = 'none';
        });

        // 掷骰子按钮
        document.getElementById('rollDice').addEventListener('click', () => {
            if (this.game.canRollDice()) {
                this.game.rollDice();
            }
        });

        // 购买地产按钮
        document.getElementById('buyProperty').addEventListener('click', () => {
            if (this.game.canBuyProperty()) {
                this.game.buyProperty();
            }
        });

        // 建造房屋按钮
        document.getElementById('buildHouse').addEventListener('click', () => {
            if (this.game.canBuildHouse()) {
                this.game.buildHouse();
            }
        });

        // 结束回合按钮
        document.getElementById('endTurn').addEventListener('click', () => {
            if (this.game.canEndTurn()) {
                this.game.endTurn();
            }
        });

        // 确认事件按钮
        document.getElementById('confirmEvent').addEventListener('click', () => {
            document.getElementById('eventModal').style.display = 'none';
            this.game.continueAfterEvent();
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') { // 空格键掷骰子
                if (this.game.canRollDice()) {
                    this.game.rollDice();
                }
            } else if (e.code === 'Enter') { // 回车键购买地产
                if (this.game.canBuyProperty()) {
                    this.game.buyProperty();
                }
            }
        });

        // 棋盘点击事件
        const canvas = document.getElementById('gameBoard');
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            
            // 检查点击的格子
            const clickedSquare = this.game.board.squares.find(square => {
                return x >= square.x && x <= square.x + (square.type === 'corner' ? 100 : 80) &&
                       y >= square.y && y <= square.y + (square.type === 'corner' ? 100 : 80);
            });

            if (clickedSquare && clickedSquare.type === 'property') {
                this.showPropertyDetails(clickedSquare);
            }
        });

        // 点击其他区域隐藏地产信息
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#gameBoard') && !e.target.closest('#propertyInfo')) {
                document.getElementById('propertyInfo').style.display = 'none';
            }
        });
    }

    // 更新游戏状态显示
    updateGameState() {
        const currentPlayer = this.game.getCurrentPlayer();
        
        // 更新玩家信息
        document.getElementById('player1Name').textContent = this.game.players[0].name;
        document.getElementById('player2Name').textContent = this.game.players[1].name;
        document.getElementById('player1Money').textContent = this.game.players[0].money;
        document.getElementById('player2Money').textContent = this.game.players[1].money;

        // 更新按钮状态
        document.getElementById('rollDice').disabled = !this.game.canRollDice();
        document.getElementById('buyProperty').disabled = !this.game.canBuyProperty();
        document.getElementById('buildHouse').disabled = !this.game.canBuildHouse();
        document.getElementById('endTurn').disabled = !this.game.canEndTurn();

        // 高亮显示当前玩家
        document.getElementById('player1Info').style.backgroundColor = 
            currentPlayer.index === 0 ? 'rgba(0, 123, 255, 0.1)' : 'transparent';
        document.getElementById('player2Info').style.backgroundColor = 
            currentPlayer.index === 1 ? 'rgba(220, 53, 69, 0.1)' : 'transparent';

        // 更新游戏消息
        this.updateGameMessage();
    }

    // 更新游戏消息
    updateGameMessage(message = '') {
        const currentPlayer = this.game.getCurrentPlayer();
        const defaultMessage = `${currentPlayer.name}的回合`;
        
        document.getElementById('gameMessages').textContent = message || defaultMessage;
    }

    // 显示地产详细信息
    showPropertyDetails(square) {
        if (square.type !== 'property') return;

        const property = new Property(square);
        property.showDetails();
    }

    // 显示游戏结束
    showGameOver(winner) {
        const eventModal = document.getElementById('eventModal');
        const eventText = document.getElementById('eventText');
        
        eventText.innerHTML = `
            <h3>游戏结束!</h3>
            <p>${winner.name} 获胜!</p>
            <p>最终资产: ￥${winner.calculateNetWorth()}</p>
            <button onclick="location.reload()">重新开始</button>
        `;
        
        eventModal.style.display = 'flex';
    }

    // 显示错误消息
    showError(message) {
        const gameMessages = document.getElementById('gameMessages');
        gameMessages.textContent = message;
        gameMessages.style.color = '#dc3545';
        
        setTimeout(() => {
            gameMessages.style.color = '#495057';
            this.updateGameMessage();
        }, 3000);
    }

    // 更新玩家棋子位置
    updatePlayerTokens() {
        if (!this.game.players.length) return;

        const player1Token = document.getElementById('player1Token');
        const player2Token = document.getElementById('player2Token');
        const canvas = document.getElementById('gameBoard');
        const rect = canvas.getBoundingClientRect();
        
        const pos1 = this.game.board.getTokenPosition(this.game.players[0].position, false);
        const pos2 = this.game.board.getTokenPosition(this.game.players[1].position, true);
        
        // 计算相对于游戏容器的位置
        const containerRect = document.getElementById('gameContainer').getBoundingClientRect();
        const canvasLeft = rect.left - containerRect.left;
        const canvasTop = rect.top - containerRect.top;
        
        player1Token.style.left = (canvasLeft + pos1.x) + 'px';
        player1Token.style.top = (canvasTop + pos1.y) + 'px';
        player2Token.style.left = (canvasLeft + pos2.x) + 'px';
        player2Token.style.top = (canvasTop + pos2.y) + 'px';
    }

    // 显示确认对话框
    showConfirmDialog(message, onConfirm) {
        const eventModal = document.getElementById('eventModal');
        const eventText = document.getElementById('eventText');
        
        eventText.innerHTML = `
            <p>${message}</p>
            <button onclick="handleConfirm(true)">确定</button>
            <button onclick="handleConfirm(false)">取消</button>
        `;
        
        eventModal.style.display = 'flex';
        
        window.handleConfirm = (confirmed) => {
            eventModal.style.display = 'none';
            if (confirmed) {
                onConfirm();
            }
            delete window.handleConfirm;
        };
    }
}
