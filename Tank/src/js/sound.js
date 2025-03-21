class SoundManager {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = new Map();
        this.initSounds();
    }

    initSounds() {
        // 射击音效
        this.createShootSound();
        // 爆炸音效
        this.createExplosionSound();
    }

    createShootSound() {
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(150, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        this.sounds.set('shoot', {
            setup: () => {
                const osc = this.context.createOscillator();
                const gain = this.context.createGain();
                
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, this.context.currentTime);
                osc.frequency.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
                
                gain.gain.setValueAtTime(0.3, this.context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
                
                osc.connect(gain);
                gain.connect(this.context.destination);
                
                return { oscillator: osc, gainNode: gain };
            }
        });
    }

    createExplosionSound() {
        this.sounds.set('explosion', {
            setup: () => {
                const noise = this.context.createBufferSource();
                const buffer = this.context.createBuffer(1, this.context.sampleRate * 1, this.context.sampleRate);
                const data = buffer.getChannelData(0);
                
                for (let i = 0; i < buffer.length; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                
                const gainNode = this.context.createGain();
                const filter = this.context.createBiquadFilter();
                
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1000, this.context.currentTime);
                filter.frequency.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);
                
                gainNode.gain.setValueAtTime(1, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);
                
                noise.buffer = buffer;
                noise.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(this.context.destination);
                
                return { source: noise, gainNode };
            }
        });
    }

    play(soundName) {
        if (this.sounds.has(soundName)) {
            const sound = this.sounds.get(soundName);
            const nodes = sound.setup();
            
            if (nodes.source) {
                nodes.source.start();
                nodes.source.stop(this.context.currentTime + 0.5);
            } else if (nodes.oscillator) {
                nodes.oscillator.start();
                nodes.oscillator.stop(this.context.currentTime + 0.2);
            }
        }
    }
}
