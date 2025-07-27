/**
 * BELLA Cyberpunk Intro Animation System
 * Premium startup experience with holographic effects
 */

class BellaIntro {
    constructor() {
        this.introSteps = [
            { text: "INITIALIZING NEURAL MATRIX", duration: 1000 },
            { text: "ESTABLISHING QUANTUM LINK", duration: 1200 },
            { text: "SYNCHRONIZING CONSCIOUSNESS", duration: 1100 },
            { text: "BELLA SYSTEM ONLINE", duration: 1500 }
        ];
        
        this.currentStep = 0;
        this.loadingElement = null;
        this.loadingText = null;
        
        this.init();
    }

    init() {
        this.loadingElement = document.getElementById('loading-screen');
        this.loadingText = document.getElementById('loading-text');
        
        if (this.loadingElement && this.loadingText) {
            this.startIntroSequence();
        }
    }

    async startIntroSequence() {
        // Add cyberpunk startup sound effect (if audio is available)
        this.playStartupSound();
        
        // Cycle through intro messages
        for (let i = 0; i < this.introSteps.length; i++) {
            await this.showIntroStep(this.introSteps[i]);
        }
        
        // Final neural activation
        await this.neuralActivation();
        
        // Hide loading screen
        this.hideLoadingScreen();
    }

    showIntroStep(step) {
        return new Promise((resolve) => {
            this.loadingText.textContent = step.text;
            this.loadingText.setAttribute('data-text', step.text);
            
            // Add random glitch effect
            if (Math.random() > 0.7) {
                this.loadingText.style.animation = 'glitch 0.3s ease-out';
                setTimeout(() => {
                    this.loadingText.style.animation = 'text-glow 2s ease-in-out infinite alternate';
                }, 300);
            }
            
            setTimeout(resolve, step.duration);
        });
    }

    async neuralActivation() {
        return new Promise((resolve) => {
            // Create neural activation effect
            this.loadingText.textContent = "NEURAL LINK ESTABLISHED";
            this.loadingText.setAttribute('data-text', "NEURAL LINK ESTABLISHED");
            
            // Add pulse effect to entire loading screen
            this.loadingElement.style.background = `
                radial-gradient(circle at center, 
                    rgba(255, 27, 141, 0.2) 0%,
                    rgba(10, 10, 10, 0.95) 70%
                )
            `;
            
            // Particle burst effect
            this.createNeuralBurst();
            
            setTimeout(resolve, 2000);
        });
    }

    createNeuralBurst() {
        const burstContainer = document.createElement('div');
        burstContainer.className = 'neural-burst-container';
        burstContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            pointer-events: none;
            z-index: 1001;
        `;
        
        this.loadingElement.appendChild(burstContainer);
        
        // Create multiple burst particles
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ff1b8d;
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 10px #ff1b8d;
                animation: neural-burst 1.5s ease-out forwards;
                animation-delay: ${i * 0.1}s;
            `;
            
            burstContainer.appendChild(particle);
        }
        
        // Add burst animation keyframes
        if (!document.querySelector('#neural-burst-styles')) {
            const style = document.createElement('style');
            style.id = 'neural-burst-styles';
            style.textContent = `
                @keyframes neural-burst {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(20) rotate(${Math.random() * 360}deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Cleanup after animation
        setTimeout(() => {
            burstContainer.remove();
        }, 2000);
    }

    hideLoadingScreen() {
        this.loadingElement.style.opacity = '0';
        this.loadingElement.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.loadingElement.style.display = 'none';
            this.activateMainSystems();
        }, 800);
    }

    activateMainSystems() {
        // Trigger particle system activation
        if (window.bellaParticles) {
            window.bellaParticles.setMoodParticles('cyberpunk');
        }
        
        // Add entrance animation to main content
        const contentOverlay = document.querySelector('.content-overlay');
        if (contentOverlay) {
            contentOverlay.style.opacity = '0';
            contentOverlay.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                contentOverlay.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                contentOverlay.style.opacity = '1';
                contentOverlay.style.transform = 'translateY(0)';
            }, 100);
        }
        
        // Activate cyber effects
        this.activateCyberEffects();
        
        // Dispatch ready event
        document.dispatchEvent(new CustomEvent('bellaSystemReady'));
    }

    activateCyberEffects() {
        // Add dynamic glow to status indicator
        const statusIndicator = document.getElementById('anne-status');
        if (statusIndicator) {
            statusIndicator.style.animation = 'cyber-pulse 3s ease-in-out infinite';
        }
        
        // Activate progress bar animation
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.transition = 'width 3s cubic-bezier(0.4, 0, 0.2, 1)';
            progressFill.style.width = '75%';
        }
    }

    playStartupSound() {
        // Create a subtle cyberpunk startup beep using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create oscillator for cyberpunk beep
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio context not available');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bellaIntro = new BellaIntro();
});

export default BellaIntro;
