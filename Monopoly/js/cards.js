class Cards {
    constructor() {
        this.chanceCards = [
            {
                text: "前进到起点",
                action: (player) => {
                    player.moveTo(0);
                    player.addMoney(200);
                    return "你移动到起点并获得200元";
                }
            },
            {
                text: "银行发放红利，获得50元",
                action: (player) => {
                    player.addMoney(50);
                    return "你获得了50元红利";
                }
            },
            {
                text: "支付学费100元",
                action: (player) => {
                    player.deductMoney(100);
                    return "你支付了100元学费";
                }
            },
            {
                text: "前进3步",
                action: (player) => {
                    player.moveForward(3);
                    return "你前进了3步";
                }
            },
            {
                text: "后退2步",
                action: (player) => {
                    let newPosition = (player.position - 2 + 36) % 36;
                    player.moveTo(newPosition);
                    return "你后退了2步";
                }
            },
            {
                text: "进入监狱",
                action: (player) => {
                    player.goToJail();
                    return "你被关进了监狱";
                }
            },
            {
                text: "获得一张出狱卡",
                action: (player) => {
                    player.getOutOfJailCards++;
                    return "你获得了一张出狱卡";
                }
            },
            {
                text: "房屋维修。每座房屋支付25元",
                action: (player) => {
                    let totalHouses = 0;
                    player.properties.forEach(propertyIndex => {
                        const property = window.game.board.getSquareAtIndex(propertyIndex);
                        totalHouses += property.houses;
                    });
                    const cost = totalHouses * 25;
                    player.deductMoney(cost);
                    return `你支付了${cost}元维修费`;
                }
            }
        ];

        this.chestCards = [
            {
                text: "银行错误，收到200元",
                action: (player) => {
                    player.addMoney(200);
                    return "你收到了200元";
                }
            },
            {
                text: "医疗费，支付50元",
                action: (player) => {
                    player.deductMoney(50);
                    return "你支付了50元医疗费";
                }
            },
            {
                text: "获得遗产300元",
                action: (player) => {
                    player.addMoney(300);
                    return "你获得了300元遗产";
                }
            },
            {
                text: "缴纳所得税100元",
                action: (player) => {
                    player.deductMoney(100);
                    return "你缴纳了100元所得税";
                }
            },
            {
                text: "生日收到礼金，每位玩家给你10元",
                action: (player) => {
                    let total = 0;
                    window.game.players.forEach(otherPlayer => {
                        if (otherPlayer !== player) {
                            otherPlayer.deductMoney(10);
                            total += 10;
                        }
                    });
                    player.addMoney(total);
                    return `你收到了${total}元生日礼金`;
                }
            },
            {
                text: "获得一张出狱卡",
                action: (player) => {
                    player.getOutOfJailCards++;
                    return "你获得了一张出狱卡";
                }
            },
            {
                text: "支付物业费，每座房屋30元",
                action: (player) => {
                    let totalHouses = 0;
                    player.properties.forEach(propertyIndex => {
                        const property = window.game.board.getSquareAtIndex(propertyIndex);
                        totalHouses += property.houses;
                    });
                    const cost = totalHouses * 30;
                    player.deductMoney(cost);
                    return `你支付了${cost}元物业费`;
                }
            },
            {
                text: "前往监狱",
                action: (player) => {
                    player.goToJail();
                    return "你被关进了监狱";
                }
            }
        ];

        // 洗牌
        this.shuffleCards();
    }

    // Fisher-Yates 洗牌算法
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 洗牌
    shuffleCards() {
        this.shuffle(this.chanceCards);
        this.shuffle(this.chestCards);
    }

    // 抽取机会卡
    drawChanceCard(player) {
        const card = this.chanceCards.shift();
        this.chanceCards.push(card); // 将使用过的卡片放到牌堆底部
        return {
            text: card.text,
            result: card.action(player)
        };
    }

    // 抽取命运卡
    drawChestCard(player) {
        const card = this.chestCards.shift();
        this.chestCards.push(card); // 将使用过的卡片放到牌堆底部
        return {
            text: card.text,
            result: card.action(player)
        };
    }

    // 显示卡片效果
    showCard(cardInfo) {
        const eventModal = document.getElementById('eventModal');
        const eventText = document.getElementById('eventText');
        
        eventText.innerHTML = `
            <p><strong>${cardInfo.text}</strong></p>
            <p>${cardInfo.result}</p>
        `;
        
        eventModal.style.display = 'flex';
    }
}
