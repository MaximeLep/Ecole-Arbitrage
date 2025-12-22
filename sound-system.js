// ========================================
// SYSTÈME DE SONS - B.C.B (VERSION FIABLE)
// ========================================

const SOUND_SYSTEM = {
    enabled: false,
    volume: 0.5,
    
    // Sons depuis des CDN fiables - PAS DE MIAULEMENT ! 😺❌
    sounds: {
        // Utilisation de sons générés par code (Web Audio API)
        success: null, // Sera généré
        click: null,
        points: null,
        unlock: null,
        fail: null,
        notification: null
    },
    
    // Context audio
    audioContext: null,
    
    // Initialiser le système
    init() {
        const savedEnabled = localStorage.getItem('soundEnabled');
        const savedVolume = localStorage.getItem('soundVolume');
        
        this.enabled = savedEnabled === 'true';
        this.volume = savedVolume ? parseFloat(savedVolume) : 0.5;
        
        // Initialiser Web Audio API
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.createSoundControl();
        console.log('🔊 Système de sons initialisé (Web Audio API)');
    },
    
    // Générer un son de succès
    playSuccess() {
        if (!this.enabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // Mélodie ascendante joyeuse
        [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(this.volume * 0.3, now + i * 0.1 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.2);
        });
        
        console.log('🔊 Son: success');
    },
    
    // Générer un son de clic
    playClick() {
        if (!this.enabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 800;
        
        gain.gain.setValueAtTime(this.volume * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.05);
        
        console.log('🔊 Son: click');
    },
    
    // Générer un son de points (pièce)
    playPoints() {
        if (!this.enabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        [1046.5, 1318.5].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'square';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(this.volume * 0.15, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.1);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.15);
        });
        
        console.log('🔊 Son: points');
    },
    
    // Générer un son de déblocage
    playUnlock() {
        if (!this.enabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
        
        gain.gain.setValueAtTime(this.volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.4);
        
        console.log('🔊 Son: unlock');
    },
    
    // Générer un son d'échec (doux)
    playFail() {
        if (!this.enabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        [392, 349.23].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(this.volume * 0.2, now + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.2);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.25);
        });
        
        console.log('🔊 Son: fail');
    },
    
    // Générer un son de notification
    playNotification() {
        if (!this.enabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        [659.25, 783.99].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(this.volume * 0.25, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.2);
        });
        
        console.log('🔊 Son: notification');
    },
    
    // Jouer un son
    play(soundName) {
        if (!this.enabled) {
            console.log(`🔇 Son désactivé: ${soundName}`);
            return;
        }
        
        // Reprendre le contexte audio si suspendu
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Appeler la méthode correspondante
        const methodName = 'play' + soundName.charAt(0).toUpperCase() + soundName.slice(1);
        if (typeof this[methodName] === 'function') {
            this[methodName]();
        }
    },
    
    // Activer/désactiver les sons
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled);
        this.updateControlUI();
        
        console.log(this.enabled ? '🔊 Sons activés' : '🔇 Sons désactivés');
        
        if (this.enabled) {
            setTimeout(() => {
                this.play('notification');
            }, 100);
        }
    },
    
    // Changer le volume
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        localStorage.setItem('soundVolume', this.volume);
        console.log(`🎚️ Volume: ${Math.round(this.volume * 100)}%`);
    },
    
    // Créer le contrôle de son dans le header
    createSoundControl() {
        const authSection = document.querySelector('.auth-section');
        if (!authSection) {
            console.warn('⚠️ .auth-section introuvable');
            return;
        }
        
        const soundControl = document.createElement('div');
        soundControl.id = 'soundControl';
        soundControl.className = 'sound-control';
        soundControl.innerHTML = `
            <button onclick="SOUND_SYSTEM.toggle()" class="sound-toggle-btn" id="soundToggleBtn" title="${this.enabled ? 'Désactiver les sons' : 'Activer les sons'}">
                ${this.enabled ? '🔊' : '🔇'}
            </button>
        `;
        
        authSection.insertBefore(soundControl, authSection.firstChild);
        console.log('✅ Contrôle de son créé');
    },
    
    // Mettre à jour l'interface du contrôle
    updateControlUI() {
        const btn = document.getElementById('soundToggleBtn');
        if (btn) {
            btn.textContent = this.enabled ? '🔊' : '🔇';
            btn.title = this.enabled ? 'Désactiver les sons' : 'Activer les sons';
        }
    }
};

// Initialiser au chargement
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        SOUND_SYSTEM.init();
    }, 500);
});

// ========================================
// FONCTIONS HELPER POUR JOUER LES SONS
// ========================================

function playSoundSuccess() {
    SOUND_SYSTEM.play('success');
}

function playSoundClick() {
    SOUND_SYSTEM.play('click');
}

function playSoundPoints() {
    SOUND_SYSTEM.play('points');
}

function playSoundUnlock() {
    SOUND_SYSTEM.play('unlock');
}

function playSoundFail() {
    SOUND_SYSTEM.play('fail');
}

function playSoundNotification() {
    SOUND_SYSTEM.play('notification');
}

// Export global pour debug
window.SOUND_SYSTEM = SOUND_SYSTEM;
console.log('🎵 sound-system.js chargé (PAS DE CHAT! 🐱❌)');