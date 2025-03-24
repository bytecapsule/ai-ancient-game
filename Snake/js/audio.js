class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {};
        this.initSounds();
    }

    async initSounds() {
        // 创建简单的音效
        this.sounds.eat = await this.createToneBuffer(600, 0.1);
        this.sounds.collision = await this.createToneBuffer(200, 0.3);
        this.sounds.levelUp = await this.createToneBuffer(800, 0.5);
        this.sounds.gameOver = await this.createToneBuffer(300, 0.8);
        this.sounds.victory = await this.createToneBuffer(1000, 1);
    }

    async createToneBuffer(frequency, duration) {
        const sampleRate = this.audioContext.sampleRate;
        const length = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
            data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) *
                     Math.exp(-5 * i / length); // 添加衰减
        }

        return buffer;
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            const source = this.audioContext.createBufferSource();
            source.buffer = this.sounds[soundName];
            source.connect(this.audioContext.destination);
            source.start();
        }
    }

    playEatSound() {
        this.playSound('eat');
    }

    playCollisionSound() {
        this.playSound('collision');
    }

    playLevelUpSound() {
        this.playSound('levelUp');
    }

    playGameOverSound() {
        this.playSound('gameOver');
    }

    playVictorySound() {
        this.playSound('victory');
    }
}

// 创建全局音频管理器实例
const audioManager = new AudioManager();