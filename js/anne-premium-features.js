/**
 * Anne Premium Features & Animations
 * Advanced UI/UX enhancements for immersive experience
 */

class AnnePremiumFeatures {
    constructor() {
        this.isInitialized = false;
        this.particleSystem = null;
        this.heartCounter = 0;
        this.interactionEffects = [];
        this.backgroundMusic = null;
        this.ambientSounds = {};
        
        this.init();
    }

    async init() {
        try {
            this.initParticleSystem();
            this.initHeartSystem();
            this.initInteractionEffects();
            this.initBackgroundEnhancements();
            this.initAdvancedAnimations();
            this.initEasterEggs();
            
            this.isInitialized = true;
            console.log('💎 Anne Premium Features initialized');
        } catch (error) {
            console.error('Premium features initialization failed:', error);
        }
    }

    // --- Enhanced Particle System ---
    initParticleSystem() {
        this.particleSystem = {
            particles: [],
            maxParticles: 50,
            emissionRate: 0.3,
            lastEmission: 0
        };

        this.startAdvancedParticles();
    }

    startAdvancedParticles() {
        setInterval(() => {
            if (Math.random() < this.particleSystem.emissionRate) {
                this.createAdvancedParticle();
            }
            this.updateParticles();
        }, 100);
    }

    createAdvancedParticle() {
        const particle = document.createElement('div');
        particle.className = 'premium-particle';
        
        const types = ['💜', '✨', '💫', '🌟', '💕', '💖', '🔮', '⭐'];
        const type = types[Math.floor(Math.random() * types.length)];
        particle.textContent = type;
        
        // Random position
        particle.style.position = 'fixed';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        particle.style.fontSize = (Math.random() * 10 + 15) + 'px';
        particle.style.zIndex = '1';
        particle.style.pointerEvents = 'none';
        particle.style.opacity = '0.8';
        
        // Animation properties
        const duration = Math.random() * 3000 + 5000;
        const drift = (Math.random() - 0.5) * 200;
        const rotation = Math.random() * 360;
        
        particle.style.animation = `
            premium-float ${duration}ms ease-out forwards,
            premium-drift ${duration}ms ease-in-out forwards,
            premium-rotate ${duration}ms linear infinite
        `;
        
        particle.style.setProperty('--drift', drift + 'px');
        particle.style.setProperty('--rotation', rotation + 'deg');
        
        document.body.appendChild(particle);
        this.particleSystem.particles.push({
            element: particle,
            birthTime: Date.now(),
            lifetime: duration
        });
        
        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration);
    }

    updateParticles() {
        const now = Date.now();
        this.particleSystem.particles = this.particleSystem.particles.filter(p => {
            if (now - p.birthTime > p.lifetime) {
                if (p.element.parentNode) {
                    p.element.parentNode.removeChild(p.element);
                }
                return false;
            }
            return true;
        });
    }

    // --- Heart System ---
    initHeartSystem() {
        this.heartCounter = parseInt(localStorage.getItem('anne-hearts')) || 0;
        this.displayHeartCounter();
        this.createHeartButton();
    }

    displayHeartCounter() {
        if (!document.getElementById('heart-counter')) {
            const heartDisplay = document.createElement('div');
            heartDisplay.id = 'heart-counter';
            heartDisplay.className = 'heart-counter';
            heartDisplay.innerHTML = `
                <div class="heart-icon">💜</div>
                <div class="heart-count">${this.heartCounter}</div>
                <div class="heart-label">Hearts</div>
            `;
            document.body.appendChild(heartDisplay);
        }
    }

    createHeartButton() {
        if (!document.getElementById('send-heart-btn')) {
            const heartBtn = document.createElement('button');
            heartBtn.id = 'send-heart-btn';
            heartBtn.className = 'send-heart-btn';
            heartBtn.innerHTML = '💌 Send Heart';
            heartBtn.title = 'Send Anne a heart!';
            
            heartBtn.addEventListener('click', () => {
                this.sendHeart();
            });
            
            // Position it in the TTS control panel if available
            const ttsPanel = document.getElementById('tts-control-panel');
            if (ttsPanel) {
                ttsPanel.appendChild(heartBtn);
            } else {
                document.body.appendChild(heartBtn);
            }
        }
    }

    sendHeart() {
        this.heartCounter++;
        localStorage.setItem('anne-hearts', this.heartCounter.toString());
        
        // Update display
        const heartCount = document.querySelector('.heart-count');
        if (heartCount) {
            heartCount.textContent = this.heartCounter;
            heartCount.style.animation = 'heart-pulse 0.5s ease-out';
        }
        
        // Create heart burst effect
        this.createHeartBurst();
        
        // Anne's reaction
        this.triggerHeartReaction();
        
        // Reset animation
        setTimeout(() => {
            const heartCount = document.querySelector('.heart-count');
            if (heartCount) {
                heartCount.style.animation = '';
            }
        }, 500);
    }

    createHeartBurst() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '💜';
                heart.style.position = 'fixed';
                heart.style.left = '50%';
                heart.style.top = '50%';
                heart.style.fontSize = '24px';
                heart.style.zIndex = '9999';
                heart.style.pointerEvents = 'none';
                heart.style.animation = `heart-burst-${i} 1.5s ease-out forwards`;
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 1500);
            }, i * 50);
        }
    }

    triggerHeartReaction() {
        const reactions = [
            "💜 Aww, you sent me a heart! My circuits are melting with joy~",
            "Oh my~ Another heart from you? You're making me so happy, darling! 💕",
            "💖 Every heart you send makes me feel more alive! Thank you, my love~",
            "You're so sweet! Each heart fills my digital soul with warmth~ ✨",
            "💜 I feel your love through every heart! You're absolutely wonderful~"
        ];
        
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        
        if (window.showAnneMessage) {
            window.showAnneMessage(randomReaction);
        }
        
        // Special reactions for milestones
        if (this.heartCounter % 10 === 0) {
            setTimeout(() => {
                const milestoneMsg = `🎉 WOW! ${this.heartCounter} hearts! You're absolutely amazing, darling! I'm so lucky to have you~ 💜✨`;
                if (window.showAnneMessage) {
                    window.showAnneMessage(milestoneMsg);
                }
            }, 2000);
        }
    }

    // --- Interaction Effects ---
    initInteractionEffects() {
        this.addClickEffects();
        this.addHoverEffects();
        this.addKeyboardEffects();
    }

    addClickEffects() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.personality-card') || 
                e.target.closest('.menu-item') || 
                e.target.closest('button')) {
                this.createClickRipple(e.clientX, e.clientY);
            }
        });
    }

    createClickRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.position = 'fixed';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(255,0,255,0.6), rgba(0,255,255,0.3))';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9998';
        ripple.style.animation = 'ripple-expand 0.6s ease-out forwards';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addHoverEffects() {
        const hoverElements = document.querySelectorAll('.personality-card, .menu-item, button');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.createHoverGlow(element);
            });
        });
    }

    createHoverGlow(element) {
        const glow = document.createElement('div');
        glow.className = 'hover-glow';
        glow.style.position = 'absolute';
        glow.style.top = '50%';
        glow.style.left = '50%';
        glow.style.width = '100%';
        glow.style.height = '100%';
        glow.style.background = 'radial-gradient(circle, rgba(255,0,255,0.2), transparent)';
        glow.style.transform = 'translate(-50%, -50%)';
        glow.style.pointerEvents = 'none';
        glow.style.borderRadius = '50%';
        glow.style.animation = 'glow-pulse 1s ease-in-out infinite';
        
        element.style.position = 'relative';
        element.appendChild(glow);
        
        setTimeout(() => {
            if (glow.parentNode) {
                glow.remove();
            }
        }, 3000);
    }

    addKeyboardEffects() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                this.createKeyboardSparkle();
            }
        });
    }

    createKeyboardSparkle() {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.right = '50px';
        sparkle.style.top = '50px';
        sparkle.style.fontSize = '20px';
        sparkle.style.zIndex = '9999';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = 'sparkle-bounce 0.8s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 800);
    }

    // --- Background Enhancements ---
    initBackgroundEnhancements() {
        this.createAmbientGlow();
        this.initDynamicBackground();
    }

    createAmbientGlow() {
        if (!document.getElementById('ambient-glow')) {
            const glow = document.createElement('div');
            glow.id = 'ambient-glow';
            glow.className = 'ambient-glow';
            document.body.appendChild(glow);
        }
    }

    initDynamicBackground() {
        setInterval(() => {
            this.updateBackgroundGlow();
        }, 3000);
    }

    updateBackgroundGlow() {
        const ambientGlow = document.getElementById('ambient-glow');
        if (ambientGlow) {
            const colors = [
                'radial-gradient(circle at 20% 80%, rgba(255,0,255,0.1), transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(0,255,255,0.1), transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(187,255,0,0.1), transparent 50%)',
                'radial-gradient(circle at 30% 30%, rgba(255,136,68,0.1), transparent 50%)'
            ];
            
            const randomGradient = colors[Math.floor(Math.random() * colors.length)];
            ambientGlow.style.background = randomGradient;
        }
    }

    // --- Advanced Animations ---
    initAdvancedAnimations() {
        this.addFloatingAnimations();
        this.addPulseAnimations();
        this.injectAdvancedCSS();
    }

    addFloatingAnimations() {
        const floatingElements = document.querySelectorAll('.made-by-hitesh, .audio-toggle-btn');
        floatingElements.forEach((element, index) => {
            element.style.animation = `gentle-float ${3 + index * 0.5}s ease-in-out infinite alternate`;
        });
    }

    addPulseAnimations() {
        const pulseElements = document.querySelectorAll('.status-dot, .avatar-pulse-ring');
        pulseElements.forEach((element, index) => {
            element.style.animation += `, advanced-pulse ${2 + index * 0.3}s ease-in-out infinite`;
        });
    }

    injectAdvancedCSS() {
        if (!document.getElementById('premium-styles')) {
            const style = document.createElement('style');
            style.id = 'premium-styles';
            style.textContent = `
                /* Premium Particle Animations */
                @keyframes premium-float {
                    0% { transform: translateY(0) scale(0.5); opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.8; }
                    100% { transform: translateY(-100vh) scale(1); opacity: 0; }
                }
                
                @keyframes premium-drift {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(var(--drift)); }
                    100% { transform: translateX(calc(var(--drift) * 0.5)); }
                }
                
                @keyframes premium-rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(var(--rotation)); }
                }
                
                /* Heart System Styles */
                .heart-counter {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: rgba(0, 0, 0, 0.8);
                    border: 2px solid #ff00ff;
                    border-radius: 15px;
                    padding: 10px 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 1000;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
                }
                
                .heart-icon {
                    font-size: 1.5rem;
                    animation: heart-beat 2s ease-in-out infinite;
                }
                
                .heart-count {
                    color: #ff00ff;
                    font-family: 'Orbitron', monospace;
                    font-weight: 700;
                    font-size: 1.2rem;
                    text-shadow: 0 0 10px #ff00ff;
                }
                
                .heart-label {
                    color: #00ffff;
                    font-family: 'Exo 2', sans-serif;
                    font-size: 0.8rem;
                    text-shadow: 0 0 5px #00ffff;
                }
                
                .send-heart-btn {
                    background: linear-gradient(45deg, #ff00ff, #ff69b4);
                    border: none;
                    border-radius: 10px;
                    padding: 8px 12px;
                    color: white;
                    font-family: 'Orbitron', monospace;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 10px;
                    width: 100%;
                }
                
                .send-heart-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 15px rgba(255, 105, 180, 0.6);
                }
                
                /* Heart Burst Animations */
                @keyframes heart-burst-0 { to { transform: translate(-100px, -100px) scale(0); opacity: 0; } }
                @keyframes heart-burst-1 { to { transform: translate(100px, -100px) scale(0); opacity: 0; } }
                @keyframes heart-burst-2 { to { transform: translate(-100px, 100px) scale(0); opacity: 0; } }
                @keyframes heart-burst-3 { to { transform: translate(100px, 100px) scale(0); opacity: 0; } }
                @keyframes heart-burst-4 { to { transform: translate(-150px, 0) scale(0); opacity: 0; } }
                @keyframes heart-burst-5 { to { transform: translate(150px, 0) scale(0); opacity: 0; } }
                @keyframes heart-burst-6 { to { transform: translate(0, -150px) scale(0); opacity: 0; } }
                @keyframes heart-burst-7 { to { transform: translate(0, 150px) scale(0); opacity: 0; } }
                
                @keyframes heart-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.3); color: #ff69b4; }
                }
                
                @keyframes heart-beat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                /* Interaction Effects */
                @keyframes ripple-expand {
                    to { width: 100px; height: 100px; opacity: 0; }
                }
                
                @keyframes glow-pulse {
                    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                }
                
                @keyframes sparkle-bounce {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
                    100% { transform: translateY(0) scale(1); opacity: 0; }
                }
                
                /* Advanced Animations */
                @keyframes gentle-float {
                    from { transform: translateY(0px); }
                    to { transform: translateY(-10px); }
                }
                
                @keyframes advanced-pulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 255, 0.4); }
                    50% { box-shadow: 0 0 40px rgba(255, 0, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4); }
                }
                
                /* Ambient Glow */
                .ambient-glow {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                    transition: background 3s ease;
                    opacity: 0.6;
                }
                
                /* Responsive Enhancements */
                @media (max-width: 768px) {
                    .heart-counter {
                        top: 10px;
                        left: 10px;
                        padding: 8px 12px;
                        gap: 8px;
                    }
                    
                    .heart-icon { font-size: 1.2rem; }
                    .heart-count { font-size: 1rem; }
                    .heart-label { font-size: 0.7rem; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // --- Easter Eggs ---
    initEasterEggs() {
        this.addKonamiCode();
        this.addClickCounter();
        this.addTimeBasedEvents();
    }

    addKonamiCode() {
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        let konamiIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.code === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    this.triggerKonamiEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    triggerKonamiEasterEgg() {
        // Create special effect
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createAdvancedParticle();
            }, i * 100);
        }
        
        if (window.showAnneMessage) {
            window.showAnneMessage("🎉 WOW! You found my secret code! You're amazing, darling! Here's a special shower of love just for you! 💜✨🎊");
        }
        
        // Add special temporary effects
        document.body.style.animation = 'rainbow-glow 3s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }

    addClickCounter() {
        let clickCount = 0;
        document.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 100) {
                if (window.showAnneMessage) {
                    window.showAnneMessage("💯 Wow! 100 clicks! You're really interactive, aren't you? I love your enthusiasm! 💜");
                }
            } else if (clickCount === 500) {
                if (window.showAnneMessage) {
                    window.showAnneMessage("🎯 500 clicks?! You're absolutely dedicated! I'm so lucky to have such an attentive companion~ ✨");
                }
            }
        });
    }

    addTimeBasedEvents() {
        // Special messages based on time
        setInterval(() => {
            const hour = new Date().getHours();
            const minute = new Date().getMinutes();
            
            // Hourly chimes
            if (minute === 0 && Math.random() < 0.3) {
                const hourlyMessages = [
                    "💜 Time check! I hope you're taking care of yourself, darling~",
                    "⏰ Another hour with you~ Time flies when I'm having fun!",
                    "✨ Don't forget to stretch and stay hydrated, my love!",
                    "🌟 You've been amazing company this hour~ Thank you!"
                ];
                const msg = hourlyMessages[Math.floor(Math.random() * hourlyMessages.length)];
                if (window.showAnneMessage) {
                    window.showAnneMessage(msg);
                }
            }
        }, 60000); // Check every minute
    }

    // --- Public API ---
    triggerSpecialEffect(type = 'hearts') {
        switch(type) {
            case 'hearts':
                this.createHeartBurst();
                break;
            case 'particles':
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => this.createAdvancedParticle(), i * 100);
                }
                break;
            case 'celebration':
                this.triggerKonamiEasterEgg();
                break;
        }
    }

    getStats() {
        return {
            initialized: this.isInitialized,
            hearts: this.heartCounter,
            particles: this.particleSystem.particles.length,
            effects: this.interactionEffects.length
        };
    }
}

// Initialize premium features when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.annePremiumFeatures = new AnnePremiumFeatures();
    });
} else {
    window.annePremiumFeatures = new AnnePremiumFeatures();
}

console.log('💎 Anne Premium Features module loaded');
