class Utils {
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    static lerp(start, end, t) {
        return start + (end - start) * t;
    }

    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    static radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    }
}