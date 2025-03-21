class WallBuilder {
    constructor() {
        this.BLOCK_SIZE = 40;
    }

    createStraightWall(startX, startY, length, isHorizontal = true) {
        const obstacles = [];
        for (let i = 0; i < length; i++) {
            const x = isHorizontal ? startX + i * this.BLOCK_SIZE : startX;
            const y = isHorizontal ? startY : startY + i * this.BLOCK_SIZE;
            obstacles.push(new Obstacle(x, y));
        }
        return obstacles;
    }

    createLShapedWall(startX, startY, lengthA = 3, lengthB = 3) {
        const obstacles = [];
        
        // 创建水平部分
        obstacles.push(...this.createStraightWall(startX, startY, lengthA, true));
        
        // 创建垂直部分
        obstacles.push(...this.createStraightWall(startX, startY, lengthB, false));
        
        return obstacles;
    }

    createUShapedWall(startX, startY, width = 5, height = 3) {
        const obstacles = [];
        
        // 创建底部
        obstacles.push(...this.createStraightWall(startX, startY, width, true));
        
        // 创建左侧
        obstacles.push(...this.createStraightWall(startX, startY, height, false));
        
        // 创建右侧
        const rightX = startX + (width - 1) * this.BLOCK_SIZE;
        obstacles.push(...this.createStraightWall(rightX, startY, height, false));
        
        return obstacles;
    }

    createRandomWall(startX, startY, maxLength = 5) {
        const length = Math.floor(Math.random() * (maxLength - 2)) + 2;
        const isHorizontal = Math.random() < 0.5;
        return this.createStraightWall(startX, startY, length, isHorizontal);
    }

    createRandomComplexWall(startX, startY) {
        const type = Math.floor(Math.random() * 3);
        switch(type) {
            case 0:
                return this.createStraightWall(
                    startX,
                    startY,
                    Math.floor(Math.random() * 3) + 3,
                    Math.random() < 0.5
                );
            case 1:
                return this.createLShapedWall(
                    startX,
                    startY,
                    Math.floor(Math.random() * 2) + 2,
                    Math.floor(Math.random() * 2) + 2
                );
            case 2:
                return this.createUShapedWall(
                    startX,
                    startY,
                    Math.floor(Math.random() * 2) + 3,
                    Math.floor(Math.random() * 2) + 2
                );
        }
    }
}