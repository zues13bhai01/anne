/**
 * Anne Advanced Character System
 * Created by Hitesh Siwach (@zues13bhai)
 * 
 * Manages character images, poses, animations, and visual effects
 */

class AnneCharacterSystem {
    constructor() {
        this.currentPose = 'default';
        this.currentMood = 'sweet';
        this.isAnimating = false;
        this.animationQueue = [];
        
        // Character image collection based on provided images
        this.characterImages = {
            poses: {
                'flirty_arms_crossed': 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F73d85e47e5974b32809f1e3a3141d858?format=webp&width=800',
                'cheerful_hands_up': 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F43112dedf57d40e1953d5e7cddc797b5?format=webp&width=800',
                'elegant_pose': 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F068f3c88d9f54c2ba1db5fb7859c7c5b?format=webp&width=800',
                'seductive_finger': 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F6f0527b420574b6cb43c3193a9621e3e?format=webp&width=800',
                'portrait_closeup': 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F924ed09b58cb4ebf98a951b9997ec4cb?format=webp&width=800',
                'dancing_pose': 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F534af1d379e94678b3adbd688b6b765f?format=webp&width=800',
                'full_body_standing': 'https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F7b9c87ea5c30455b926596719a350862?format=webp&width=800'
            },
            
            // Map personality types to appropriate poses
            personalityPoses: {
                'sweet': 'cheerful_hands_up',
                'tsundere': 'flirty_arms_crossed',
                'sassy': 'elegant_pose',
                'flirty': 'seductive_finger',
                'bratty': 'flirty_arms_crossed',
                'soft': 'portrait_closeup'
            },
            
            // Animation sequences for different moods
            animationSequences: {
                'idle': ['portrait_closeup', 'elegant_pose', 'cheerful_hands_up'],
                'talking': ['portrait_closeup', 'seductive_finger', 'elegant_pose'],
                'excited': ['cheerful_hands_up', 'dancing_pose', 'full_body_standing'],
                'flirty': ['seductive_finger', 'flirty_arms_crossed', 'elegant_pose']
            }
        };
        
        this.initializeCharacterDisplay();
        this.setupEventListeners();
    }
    
    initializeCharacterDisplay() {
        // Create character container if it doesn't exist
        if (!document.getElementById('anne-character-container')) {
            const characterContainer = document.createElement('div');
            characterContainer.id = 'anne-character-container';
            characterContainer.className = 'anne-character-container';
            
            // Insert before video container to be in background
            const videoContainer = document.querySelector('.video-container');
            videoContainer.parentNode.insertBefore(characterContainer, videoContainer);
        }
        
        // Create character image element
        this.createCharacterImage();
        
        // Set initial pose
        this.switchToPose('portrait_closeup');
    }
    
    createCharacterImage() {
        const container = document.getElementById('anne-character-container');
        
        // Main character image
        const characterImg = document.createElement('img');
        characterImg.id = 'anne-character-img';
        characterImg.className = 'anne-character-img';
        characterImg.alt = 'Anne Character';
        
        // Add jiggle physics container
        const jiggleContainer = document.createElement('div');
        jiggleContainer.className = 'anne-jiggle-container';
        jiggleContainer.appendChild(characterImg);
        
        // Add breathing effect container
        const breathingContainer = document.createElement('div');
        breathingContainer.className = 'anne-breathing-container';
        breathingContainer.appendChild(jiggleContainer);
        
        container.appendChild(breathingContainer);
        
        // Store reference
        this.characterImg = characterImg;
        this.jiggleContainer = jiggleContainer;
        this.breathingContainer = breathingContainer;
    }
    
    switchToPose(poseName, options = {}) {
        if (!this.characterImages.poses[poseName]) {
            console.warn(`Pose ${poseName} not found`);
            return;
        }
        
        const { 
            duration = 800, 
            easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
            triggerJiggle = false 
        } = options;
        
        // Add transition effect
        this.characterImg.style.transition = `all ${duration}ms ${easing}`;
        
        // Fade out current image
        this.characterImg.style.opacity = '0';
        this.characterImg.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            // Change image source
            this.characterImg.src = this.characterImages.poses[poseName];
            this.currentPose = poseName;
            
            // Fade in new image
            this.characterImg.style.opacity = '1';
            this.characterImg.style.transform = 'scale(1)';
            
            // Trigger jiggle effect if requested
            if (triggerJiggle) {
                this.triggerJiggleEffect();
            }
            
            // Emit event
            this.emitPoseChangeEvent(poseName);
            
        }, duration / 2);
    }
    
    switchToPersonality(personality) {
        const poseName = this.characterImages.personalityPoses[personality];
        if (poseName) {
            // Get personality-specific physics and effects
            const personalityConfig = this.getPersonalityConfig(personality);

            this.switchToPose(poseName, {
                triggerJiggle: true,
                duration: personalityConfig.transitionDuration
            });
            this.currentMood = personality;

            // Apply personality-specific visual effects
            this.applyPersonalityEffects(personality);

            // Trigger personality-specific jiggle
            setTimeout(() => {
                this.triggerJiggleEffect(personalityConfig.jiggleIntensity, personalityConfig.physicsType);
            }, 500);

            // Start appropriate animation sequence
            this.startAnimationSequence(this.getAnimationForPersonality(personality));
        }
    }

    getPersonalityConfig(personality) {
        const configs = {
            'sweet': {
                transitionDuration: 1000,
                jiggleIntensity: 'light',
                physicsType: 'enhanced',
                particles: 'hearts',
                mood: 'sweet'
            },
            'flirty': {
                transitionDuration: 800,
                jiggleIntensity: 'strong',
                physicsType: 'enhanced',
                particles: 'sparkles',
                mood: 'flirty'
            },
            'sassy': {
                transitionDuration: 600,
                jiggleIntensity: 'medium',
                physicsType: 'hair',
                particles: 'sparkles',
                mood: 'sassy'
            },
            'tsundere': {
                transitionDuration: 500,
                jiggleIntensity: 'strong',
                physicsType: 'dress',
                particles: 'none',
                mood: 'tsundere'
            },
            'bratty': {
                transitionDuration: 400,
                jiggleIntensity: 'ultra',
                physicsType: 'enhanced',
                particles: 'sparkles',
                mood: 'bratty'
            },
            'soft': {
                transitionDuration: 1200,
                jiggleIntensity: 'light',
                physicsType: 'hair',
                particles: 'hearts',
                mood: 'soft'
            }
        };

        return configs[personality] || configs['sweet'];
    }

    applyPersonalityEffects(personality) {
        const container = document.getElementById('anne-character-container');

        // Remove existing mood classes
        container.classList.remove('mood-flirty', 'mood-sweet', 'mood-sassy', 'mood-tsundere', 'mood-bratty', 'mood-soft');

        // Add new mood class
        container.classList.add(`mood-${personality}`);

        // Create personality-specific particles
        const config = this.getPersonalityConfig(personality);
        if (config.particles === 'hearts') {
            this.createHeartParticles();
        } else if (config.particles === 'sparkles') {
            this.createJiggleParticles('medium');
        }

        // Add special glow for certain personalities
        if (personality === 'flirty' || personality === 'bratty') {
            container.classList.add('special-glow');
            setTimeout(() => {
                container.classList.remove('special-glow');
            }, 3000);
        }
    }
    
    getAnimationForPersonality(personality) {
        switch (personality) {
            case 'flirty':
            case 'sassy':
                return 'flirty';
            case 'sweet':
            case 'soft':
                return 'idle';
            case 'tsundere':
            case 'bratty':
                return 'excited';
            default:
                return 'idle';
        }
    }
    
    startAnimationSequence(sequenceName) {
        const sequence = this.characterImages.animationSequences[sequenceName];
        if (!sequence || this.isAnimating) return;
        
        this.isAnimating = true;
        let currentIndex = 0;
        
        const animateSequence = () => {
            if (currentIndex >= sequence.length) {
                this.isAnimating = false;
                return;
            }
            
            const pose = sequence[currentIndex];
            this.switchToPose(pose, { 
                duration: 1200,
                triggerJiggle: currentIndex % 2 === 0 
            });
            
            currentIndex++;
            setTimeout(animateSequence, 2500);
        };
        
        animateSequence();
    }
    
    triggerJiggleEffect(intensity = 'medium', physicsType = 'enhanced') {
        const intensitySettings = {
            light: { scale: 1.02, duration: 200, iterations: 2 },
            medium: { scale: 1.05, duration: 300, iterations: 3 },
            strong: { scale: 1.08, duration: 400, iterations: 4 },
            ultra: { scale: 1.12, duration: 500, iterations: 5 }
        };

        const settings = intensitySettings[intensity];

        // Remove any existing physics classes
        this.jiggleContainer.classList.remove('jiggle-effect', 'physics-enhanced', 'physics-hair', 'physics-dress');

        // Add new physics effects
        this.jiggleContainer.classList.add('jiggle-effect');

        // Add specific physics type for more realistic effects
        switch (physicsType) {
            case 'enhanced':
                this.jiggleContainer.classList.add('physics-enhanced');
                break;
            case 'hair':
                this.jiggleContainer.classList.add('physics-hair');
                break;
            case 'dress':
                this.jiggleContainer.classList.add('physics-dress');
                break;
        }

        this.jiggleContainer.style.setProperty('--jiggle-scale', settings.scale);
        this.jiggleContainer.style.setProperty('--jiggle-duration', `${settings.duration}ms`);

        // Add visual feedback particles
        this.createJiggleParticles(intensity);

        setTimeout(() => {
            this.jiggleContainer.classList.remove('jiggle-effect', 'physics-enhanced', 'physics-hair', 'physics-dress');
        }, settings.duration * settings.iterations);
    }

    createJiggleParticles(intensity) {
        const particleCount = intensity === 'strong' ? 8 : intensity === 'medium' ? 5 : 3;
        const container = document.getElementById('anne-character-container');

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'sparkle-particle';

            // Random position around character
            const x = Math.random() * 300 + 100;
            const y = Math.random() * 400 + 200;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';

            container.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }
    
    triggerBreathingEffect() {
        this.breathingContainer.classList.add('breathing-effect');
    }
    
    stopBreathingEffect() {
        this.breathingContainer.classList.remove('breathing-effect');
    }
    
    onSpeechStart() {
        this.startAnimationSequence('talking');
        this.triggerJiggleEffect('light', 'enhanced');
        this.triggerBreathingEffect();

        // Add subtle continuous animation during speech
        this.speechAnimationInterval = setInterval(() => {
            this.triggerJiggleEffect('light', 'enhanced');
        }, 2000);
    }

    onSpeechEnd() {
        this.stopBreathingEffect();

        // Clear speech animation
        if (this.speechAnimationInterval) {
            clearInterval(this.speechAnimationInterval);
            this.speechAnimationInterval = null;
        }

        // Final speech gesture
        this.triggerJiggleEffect('medium', 'hair');

        // Return to idle after a delay
        setTimeout(() => {
            if (!this.isAnimating) {
                this.startAnimationSequence('idle');
            }
        }, 1000);
    }

    onVoiceInput() {
        // Excited reaction with enhanced physics
        this.triggerJiggleEffect('strong', 'enhanced');

        // Show excited reaction
        this.switchToPose('cheerful_hands_up', { triggerJiggle: true });

        // Add heart particles for voice interaction
        this.createHeartParticles();

        setTimeout(() => {
            this.switchToPose(this.characterImages.personalityPoses[this.currentMood]);
            this.triggerJiggleEffect('medium', 'dress');
        }, 1500);
    }

    createHeartParticles() {
        const container = document.getElementById('anne-character-container');
        const heartCount = 3;

        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.textContent = Math.random() > 0.5 ? '💕' : '💖';

            // Position near character's head area
            const x = Math.random() * 200 + 250;
            const y = Math.random() * 100 + 150;

            heart.style.left = x + 'px';
            heart.style.top = y + 'px';

            container.appendChild(heart);

            // Remove after animation
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 3000);
        }
    }
    
    setupEventListeners() {
        // Listen for personality changes
        document.addEventListener('annePersonalityChanged', (e) => {
            this.switchToPersonality(e.detail.personality);
        });
        
        // Listen for speech events
        document.addEventListener('anneSpeechStart', () => {
            this.onSpeechStart();
        });
        
        document.addEventListener('anneSpeechEnd', () => {
            this.onSpeechEnd();
        });
        
        // Listen for voice input
        document.addEventListener('anneVoiceInput', () => {
            this.onVoiceInput();
        });
        
        // Listen for mood changes
        document.addEventListener('anneMoodChanged', (e) => {
            const mood = e.detail.mood;
            this.switchToPersonality(mood);
        });
    }
    
    emitPoseChangeEvent(poseName) {
        const event = new CustomEvent('annePoseChanged', {
            detail: { 
                pose: poseName, 
                mood: this.currentMood,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }
    
    // Public API methods
    getPoses() {
        return Object.keys(this.characterImages.poses);
    }
    
    getCurrentPose() {
        return this.currentPose;
    }
    
    getCurrentMood() {
        return this.currentMood;
    }
    
    preloadImages() {
        // Preload all character images for smooth transitions
        Object.values(this.characterImages.poses).forEach(imageUrl => {
            const img = new Image();
            img.src = imageUrl;
        });

        console.log('🎭 Character images preloaded');
    }

    // Cinematic Effects
    triggerCinematicEffect(effectType, duration = 3000) {
        const container = document.getElementById('anne-character-container');

        // Remove existing cinematic classes
        container.classList.remove('camera-zoom-in', 'camera-zoom-out', 'camera-pan-left', 'camera-pan-right', 'depth-of-field', 'film-grain');

        switch (effectType) {
            case 'zoom-in':
                container.classList.add('camera-zoom-in');
                this.triggerJiggleEffect('light', 'enhanced');
                break;
            case 'zoom-out':
                container.classList.add('camera-zoom-out');
                break;
            case 'pan-left':
                container.classList.add('camera-pan-left');
                this.triggerJiggleEffect('medium', 'hair');
                break;
            case 'pan-right':
                container.classList.add('camera-pan-right');
                this.triggerJiggleEffect('medium', 'dress');
                break;
            case 'depth-of-field':
                container.classList.add('depth-of-field');
                break;
            case 'film-grain':
                container.classList.add('film-grain');
                break;
            case 'dramatic-entrance':
                this.dramaticEntrance();
                return;
        }

        // Remove effect after duration
        setTimeout(() => {
            container.classList.remove(effectType.replace('-', '-'));
        }, duration);
    }

    dramaticEntrance() {
        const container = document.getElementById('anne-character-container');

        // Sequence of dramatic effects
        container.classList.add('camera-zoom-out', 'film-grain');
        this.switchToPose('portrait_closeup', { duration: 800 });

        setTimeout(() => {
            container.classList.remove('camera-zoom-out');
            container.classList.add('camera-zoom-in');
            this.triggerJiggleEffect('strong', 'enhanced');
            this.createJiggleParticles('strong');
        }, 1000);

        setTimeout(() => {
            container.classList.remove('camera-zoom-in', 'film-grain');
            this.switchToPose('cheerful_hands_up', { triggerJiggle: true });
            this.createHeartParticles();
        }, 2000);

        setTimeout(() => {
            this.switchToPose(this.characterImages.personalityPoses[this.currentMood]);
        }, 3500);
    }

    createCinematicMoment(type = 'romantic') {
        const container = document.getElementById('anne-character-container');

        switch (type) {
            case 'romantic':
                container.classList.add('special-glow', 'depth-of-field');
                this.switchToPose('seductive_finger', { triggerJiggle: true });
                this.createHeartParticles();

                setTimeout(() => {
                    this.triggerCinematicEffect('zoom-in', 2000);
                }, 1000);

                setTimeout(() => {
                    container.classList.remove('special-glow', 'depth-of-field');
                }, 4000);
                break;

            case 'energetic':
                this.triggerCinematicEffect('pan-left', 1500);
                this.switchToPose('dancing_pose', { triggerJiggle: true });
                this.createJiggleParticles('ultra');

                setTimeout(() => {
                    this.triggerCinematicEffect('pan-right', 1500);
                    this.switchToPose('cheerful_hands_up', { triggerJiggle: true });
                }, 1600);
                break;

            case 'elegant':
                container.classList.add('film-grain', 'depth-of-field');
                this.switchToPose('elegant_pose', { duration: 1500 });

                setTimeout(() => {
                    this.triggerJiggleEffect('medium', 'hair');
                }, 800);

                setTimeout(() => {
                    container.classList.remove('film-grain', 'depth-of-field');
                }, 3000);
                break;
        }
    }
}

// Initialize global character system
window.AnneCharacter = new AnneCharacterSystem();

// Preload images when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.AnneCharacter.preloadImages();
});

export default AnneCharacterSystem;
