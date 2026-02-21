/* ============================================================
   audio-manager.js — Non-Modular Synth Engine
   ============================================================ */

window.AudioManager = class {
    constructor() {
        this.ctx = null;
        this.master = null;
        this.ready = false;
    }

    init() {
        if (this.ctx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.5;
        this.master.connect(this.ctx.destination);
        this.ready = true;
        console.log("Audio Engine Ready 🔊");
    }

    pluck({ type = 'sine', freq = 300, strength = 0.5, pan = 0, duration = 0.4 }) {
        if (!this.ready) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        const panner = this.ctx.createStereoPanner();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + duration);
        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(strength * 0.2, now + 0.015);
        env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
        osc.connect(env);
        env.connect(panner);
        panner.connect(this.master);
        osc.start(now);
        osc.stop(now + duration + 0.1);
    }

    playSphere(s, p)   { this.pluck({ type: 'sine',     freq: 220 + s*180, strength: s, pan: p }); }
    playCube(s, p)     { this.pluck({ type: 'square',   freq: 150 + s*100, strength: s*0.6, pan: p, duration: 0.3 }); }
    playStarfish(s, p) { this.pluck({ type: 'triangle', freq: 300 + s*220, strength: s, pan: p }); }
    playTorus(s, p)    { this.pluck({ type: 'sawtooth', freq: 240 + s*120, strength: s*0.5, pan: p, duration: 0.5 }); }
    playBlob(s, p) {
        [220, 277, 330].forEach((f, i) => {
            setTimeout(() => {
                this.pluck({ type: 'sine', freq: f * (1 + s*0.2), strength: s * 0.4, pan: p, duration: 0.6 });
            }, i * 25);
        });
    }
};
