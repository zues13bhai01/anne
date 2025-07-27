/**
 * Anne Cyberpunk Showcase Mode
 * Premium cinematic presentation system
 * Made by Hitesh (@zues13bhai)
 */

class AnneShowcaseMode {
    constructor() {
        this.isActive = false;
        this.currentPoseIndex = 0;
        this.showcaseInterval = null;
        this.grokInterval = null;
        this.currentGrokIndex = 0;
        
        // Anne poses for the showcase
        this.annePoses = [
            {
                id: 'cheerful_hands_up',
                url: 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F43112dedf57d40e1953d5e7cddc797b5?format=webp&width=800',
                name: 'Cheerful Energy',
                duration: 4000
            },
            {
                id: 'elegant_pose',
                url: 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F068f3c88d9f54c2ba1db5fb7859c7c5b?format=webp&width=800',
                name: 'Elegant Grace',
                duration: 4500
            },
            {
                id: 'seductive_finger',
                url: 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F6f0527b420574b6cb43c3193a9621e3e?format=webp&width=800',
                name: 'Seductive Charm',
                duration: 4000
            },
            {
                id: 'dancing_pose',
                url: 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F534af1d379e94678b3adbd688b6b765f?format=webp&width=800',
                name: 'Dynamic Movement',
                duration: 3500
            },
            {
                id: 'flirty_arms_crossed',
                url: 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F73d85e47e5974b32809f1e3a3141d858?format=webp&width=800',
                name: 'Confident Stance',
                duration: 4000
            },
            {
                id: 'portrait_closeup',
                url: 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F924ed09b58cb4ebf98a951b9997ec4cb?format=webp&width=800',
                name: 'Intimate Portrait',
                duration: 5000
            },
            {
                id: 'full_body_standing',
                url: 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F7b9c87ea5c30455b926596719a350862?format=webp&width=800',
                name: 'Full Presence',
                duration: 4000
            }
        ];

        // Grok Ani images for corner display
        this.grokImages = [
            'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F4c51780bac29475388d8e959456a9140?format=webp&width=800',
            'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F1ccdd84de5434994aa1f71f6c187a0ff?format=webp&width=800',
            'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2Fdde23b66eb4044eda55ac28b996c1c32?format=webp&width=800',
            'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2Fe4b27862f6604ca9bd81d8c37c8feccb?format=webp&width=800',
            'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2Fbe5d5c1c3f554750a1be6331dbc0cf95?format=webp&width=800',
            'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F46f8ad8162ee49c689707e191eb762ae?format=webp&width=800',
            'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2Ff02cb12959794736bcb9ec8a4bfa0a54?format=webp&width=800'
        ];

        this.init();
    }

    init() {
        this.createShowcaseUI();
        this.createGrokDisplay();
        this.createBrandingOverlay();
        this.bindEvents();
    }

    createShowcaseUI() {
        // Create showcase control button
        const controlsContainer = document.querySelector('.premium-controls .voice-controls');
        if (controlsContainer) {
            const showcaseBtn = document.createElement('button');
            showcaseBtn.className = 'control-btn showcase-btn';
            showcaseBtn.id = 'showcase-btn';
            showcaseBtn.title = 'Showcase Mode';
            showcaseBtn.innerHTML = '<i class="fas fa-play-circle"></i>';
            controlsContainer.appendChild(showcaseBtn);
        }

        // Create showcase overlay
        const showcaseOverlay = document.createElement('div');
        showcaseOverlay.id = 'showcase-overlay';
        showcaseOverlay.className = 'showcase-overlay';
        showcaseOverlay.innerHTML = `
            <div class="showcase-controls">
                <button class="showcase-control-btn" id="pause-showcase">
                    <i class="fas fa-pause"></i>
                </button>
                <button class="showcase-control-btn" id="stop-showcase">
                    <i class="fas fa-stop"></i>
                </button>
                <div class="showcase-info">
                    <div class="current-pose-name" id="current-pose-name">Showcase Mode</div>
                    <div class="pose-counter" id="pose-counter">1 / ${this.annePoses.length}</div>
                </div>
            </div>
            <div class="showcase-progress-bar">
                <div class="showcase-progress-fill" id="showcase-progress-fill"></div>
            </div>
        `;
        document.body.appendChild(showcaseOverlay);
    }

    createGrokDisplay() {
        // Create Grok Ani corner display
        const grokDisplay = document.createElement('div');
        grokDisplay.id = 'grok-display';
        grokDisplay.className = 'grok-display';
        grokDisplay.innerHTML = `
            <div class="grok-container">
                <div class="grok-label">GROK ANI</div>
                <div class="grok-image-container">
                    <img id="grok-image" class="grok-image" src="${this.grokImages[0]}" alt="Grok Ani">
                    <div class="grok-border"></div>
                </div>
            </div>
        `;
        document.body.appendChild(grokDisplay);
    }

    createBrandingOverlay() {
        // Create Hitesh branding
        const brandingOverlay = document.createElement('div');
        brandingOverlay.id = 'hitesh-branding';
        brandingOverlay.className = 'hitesh-branding';
        brandingOverlay.innerHTML = `
            <div class="brand-text">
                <span class="lightning">⚡</span>
                <span class="made-by">Made by</span>
                <span class="hitesh">Hitesh</span>
            </div>
        `;
        document.body.appendChild(brandingOverlay);
    }

    bindEvents() {
        document.getElementById('showcase-btn')?.addEventListener('click', () => {
            this.toggleShowcase();
        });

        document.getElementById('pause-showcase')?.addEventListener('click', () => {
            this.pauseShowcase();
        });

        document.getElementById('stop-showcase')?.addEventListener('click', () => {
            this.stopShowcase();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11' || (e.key === 's' && e.ctrlKey)) {
                e.preventDefault();
                this.toggleShowcase();
            }
            if (e.key === 'Escape' && this.isActive) {
                this.stopShowcase();
            }
        });
    }

    toggleShowcase() {
        if (this.isActive) {
            this.stopShowcase();
        } else {
            this.startShowcase();
        }
    }

    async startShowcase() {
        this.isActive = true;
        this.currentPoseIndex = 0;

        // Show overlay elements
        document.getElementById('showcase-overlay').classList.add('active');
        document.getElementById('grok-display').classList.add('active');
        document.getElementById('hitesh-branding').classList.add('active');

        // Hide UI elements
        this.hideUIElements();

        // Start background music/ambience (optional)
        this.playShowcaseAudio();

        // Start Anne pose cycling
        this.startPoseCycling();

        // Start Grok Ani cycling
        this.startGrokCycling();

        // Update button
        const btn = document.getElementById('showcase-btn');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-stop-circle"></i>';
            btn.title = 'Stop Showcase';
        }

        // Trigger cinematic entrance
        this.triggerCinematicEntrance();
    }

    stopShowcase() {
        this.isActive = false;

        // Clear intervals
        if (this.showcaseInterval) clearInterval(this.showcaseInterval);
        if (this.grokInterval) clearInterval(this.grokInterval);

        // Hide overlay elements
        document.getElementById('showcase-overlay').classList.remove('active');
        document.getElementById('grok-display').classList.remove('active');
        document.getElementById('hitesh-branding').classList.remove('active');

        // Show UI elements
        this.showUIElements();

        // Update button
        const btn = document.getElementById('showcase-btn');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-play-circle"></i>';
            btn.title = 'Showcase Mode';
        }

        // Reset to default pose
        this.resetToDefaultPose();
    }

    pauseShowcase() {
        if (this.showcaseInterval) {
            clearInterval(this.showcaseInterval);
            this.showcaseInterval = null;
        }
        if (this.grokInterval) {
            clearInterval(this.grokInterval);
            this.grokInterval = null;
        }
    }

    startPoseCycling() {
        this.showCurrentPose();
        
        this.showcaseInterval = setInterval(() => {
            this.currentPoseIndex = (this.currentPoseIndex + 1) % this.annePoses.length;
            this.showCurrentPose();
        }, this.annePoses[this.currentPoseIndex].duration);
    }

    startGrokCycling() {
        this.grokInterval = setInterval(() => {
            this.currentGrokIndex = (this.currentGrokIndex + 1) % this.grokImages.length;
            this.updateGrokImage();
        }, 2500); // Change every 2.5 seconds
    }

    showCurrentPose() {
        const currentPose = this.annePoses[this.currentPoseIndex];
        const anneImg = document.getElementById('anne-character-img');
        
        if (anneImg) {
            // Add transition effect
            anneImg.style.opacity = '0';
            anneImg.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                anneImg.src = currentPose.url;
                anneImg.style.opacity = '1';
                anneImg.style.transform = 'scale(1)';
                
                // Add cinematic effects
                this.addCinematicEffects();
            }, 300);
        }

        // Update UI
        document.getElementById('current-pose-name').textContent = currentPose.name;
        document.getElementById('pose-counter').textContent = `${this.currentPoseIndex + 1} / ${this.annePoses.length}`;

        // Update progress bar
        this.updateProgressBar(currentPose.duration);
    }

    updateGrokImage() {
        const grokImg = document.getElementById('grok-image');
        if (grokImg) {
            grokImg.style.opacity = '0';
            setTimeout(() => {
                grokImg.src = this.grokImages[this.currentGrokIndex];
                grokImg.style.opacity = '1';
            }, 200);
        }
    }

    updateProgressBar(duration) {
        const progressBar = document.getElementById('showcase-progress-fill');
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            
            setTimeout(() => {
                progressBar.style.transition = `width ${duration}ms linear`;
                progressBar.style.width = '100%';
            }, 100);
        }
    }

    addCinematicEffects() {
        // Add particle burst
        if (window.bellaParticles) {
            window.bellaParticles.createBurst(
                window.innerWidth / 2,
                window.innerHeight / 2
            );
        }

        // Add screen flash
        this.addScreenFlash();

        // Trigger jiggle effect
        if (window.anneCharacterSystem) {
            window.anneCharacterSystem.triggerJiggle(600);
        }
    }

    addScreenFlash() {
        const flash = document.createElement('div');
        flash.className = 'cinematic-flash';
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255, 27, 141, 0.3) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            animation: flash-effect 600ms ease-out;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 600);
    }

    triggerCinematicEntrance() {
        const anneContainer = document.getElementById('anne-character-container');
        if (anneContainer) {
            anneContainer.style.transform = 'scale(0.8) translateY(50px)';
            anneContainer.style.opacity = '0';
            
            setTimeout(() => {
                anneContainer.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                anneContainer.style.transform = 'scale(1) translateY(0)';
                anneContainer.style.opacity = '1';
            }, 300);
        }
    }

    hideUIElements() {
        const elementsToHide = [
            '.premium-controls',
            '.anne-status-indicator',
            '.cyber-branding-container'
        ];

        elementsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.pointerEvents = 'none';
            }
        });
    }

    showUIElements() {
        const elementsToShow = [
            '.premium-controls',
            '.anne-status-indicator',
            '.cyber-branding-container'
        ];

        elementsToShow.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '';
                element.style.pointerEvents = '';
            }
        });
    }

    resetToDefaultPose() {
        const anneImg = document.getElementById('anne-character-img');
        if (anneImg) {
            anneImg.src = this.annePoses[0].url;
        }
    }

    playShowcaseAudio() {
        // Create subtle cyberpunk ambience
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createAmbientSound(audioContext);
        } catch (error) {
            console.log('Audio context not available');
        }
    }

    createAmbientSound(audioContext) {
        // Create a low-frequency ambient drone
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 2);
        
        oscillator.start(audioContext.currentTime);
        
        // Stop after showcase ends
        setTimeout(() => {
            if (oscillator) {
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
                oscillator.stop(audioContext.currentTime + 2);
            }
        }, 30000); // 30 seconds max
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.anneShowcase = new AnneShowcaseMode();
});

export default AnneShowcaseMode;
