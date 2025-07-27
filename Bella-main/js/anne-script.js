// Anne Premium Grok Waifu v3 - Ultra Interactive Edition with Character System
// Created by Hitesh Siwach (@zues13bhai)

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🧠💋 Anne Premium Grok Waifu v3 - Ultra Interactive Edition');
    console.log('💕 Created by Hitesh Siwach (@zues13bhai)');
    
    // Initialize all Anne systems
    try {
        // Character System
        if (window.AnneCharacter) {
            console.log('🎭 Character System: Ready');
            setupCharacterSystemIntegration();
        }
        
        // Voice Engine
        if (window.AnneVoice) {
            console.log('🎤 Voice Engine: Ready');
        }
        
        // ElevenLabs TTS
        if (window.AnneElevenLabsTTS) {
            console.log('🎙️ ElevenLabs TTS: Ready');
        }
        
        // Ollama LLM
        if (window.AnneOllama) {
            console.log('🤖 Ollama LLM: Connecting...');
        }
        
        // Premium UI
        if (window.AnnePremiumUI) {
            console.log('✨ Premium UI: Active');
            setupUICharacterIntegration();
        }
        
        // Legacy waifu engines (if still needed)
        if (window.AnneWaifu) {
            console.log('💕 Waifu Engine: Loaded');
        }
        
        if (window.AnneMemory) {
            console.log('🧠 Memory Engine: Active');
        }
        
    } catch (error) {
        console.error('System initialization error:', error);
    }

    // Video system for background (reduce opacity to show character)
    initializeVideoSystem();
    
    // Setup enhanced interactions
    setupEnhancedInteractions();
    
    console.log('🎉 Anne is fully awakened and ready for premium interaction!');
    
    // Show welcome animation with character
    showWelcomeAnimation();
});

function setupCharacterSystemIntegration() {
    // Connect character system to existing events
    
    // Personality changes
    document.addEventListener('click', (e) => {
        if (e.target.closest('.personality-card')) {
            const personality = e.target.closest('.personality-card').dataset.personality;
            if (personality && window.AnneCharacter) {
                window.AnneCharacter.switchToPersonality(personality);
                
                // Emit personality change event
                const event = new CustomEvent('annePersonalityChanged', {
                    detail: { personality }
                });
                document.dispatchEvent(event);
            }
        }
    });
    
    // Enhanced voice activity integration
    document.addEventListener('anneVoiceInput', (e) => {
        if (window.AnneCharacter) {
            window.AnneCharacter.onVoiceInput();

            // Analyze voice input for special reactions
            if (e.detail && e.detail.transcript) {
                const transcript = e.detail.transcript.toLowerCase();

                // Trigger special reactions based on keywords
                if (transcript.includes('beautiful') || transcript.includes('gorgeous') || transcript.includes('pretty')) {
                    setTimeout(() => {
                        window.AnneCharacter.createCinematicMoment('romantic');
                    }, 500);
                } else if (transcript.includes('dance') || transcript.includes('move') || transcript.includes('excited')) {
                    setTimeout(() => {
                        window.AnneCharacter.createCinematicMoment('energetic');
                    }, 500);
                } else if (transcript.includes('elegant') || transcript.includes('graceful') || transcript.includes('classy')) {
                    setTimeout(() => {
                        window.AnneCharacter.createCinematicMoment('elegant');
                    }, 500);
                }
            }
        }
    });
    
    // Speech synthesis integration
    document.addEventListener('anneSpeechStart', () => {
        if (window.AnneCharacter) {
            window.AnneCharacter.onSpeechStart();
        }
    });
    
    document.addEventListener('anneSpeechEnd', () => {
        if (window.AnneCharacter) {
            window.AnneCharacter.onSpeechEnd();
        }
    });
}

function setupUICharacterIntegration() {
    // Add character pose controls to UI
    addCharacterControls();
    
    // Setup mood-based character changes
    setupMoodIntegration();
}

function addCharacterControls() {
    const personalityPanel = document.getElementById('personality-panel');
    if (!personalityPanel) return;
    
    // Add character pose section
    const characterSection = document.createElement('div');
    characterSection.className = 'character-controls';
    characterSection.innerHTML = `
        <div class="section-header">
            <h4>🎭 Character Poses</h4>
        </div>
        <div class="pose-grid">
            <button class="pose-btn" data-pose="portrait_closeup">
                <i class="fas fa-portrait"></i>
                <span>Portrait</span>
            </button>
            <button class="pose-btn" data-pose="cheerful_hands_up">
                <i class="fas fa-hands"></i>
                <span>Cheerful</span>
            </button>
            <button class="pose-btn" data-pose="elegant_pose">
                <i class="fas fa-sparkles"></i>
                <span>Elegant</span>
            </button>
            <button class="pose-btn" data-pose="seductive_finger">
                <i class="fas fa-kiss-wink-heart"></i>
                <span>Flirty</span>
            </button>
            <button class="pose-btn" data-pose="dancing_pose">
                <i class="fas fa-music"></i>
                <span>Dancing</span>
            </button>
            <button class="pose-btn" data-pose="full_body_standing">
                <i class="fas fa-user"></i>
                <span>Full Body</span>
            </button>
        </div>
        
        <div class="animation-controls">
            <h4>✨ Animations</h4>
            <button class="anim-btn" data-animation="jiggle">
                <i class="fas fa-wave-square"></i>
                Jiggle Effect
            </button>
            <button class="anim-btn" data-animation="breathing">
                <i class="fas fa-lungs"></i>
                Breathing
            </button>
            <button class="anim-btn" data-animation="idle">
                <i class="fas fa-play"></i>
                Idle Animation
            </button>
            <button class="anim-btn" data-animation="excited">
                <i class="fas fa-bolt"></i>
                Excited
            </button>
        </div>

        <div class="cinematic-controls">
            <h4>🎬 Cinematic Effects</h4>
            <button class="cinema-btn" data-effect="dramatic-entrance">
                <i class="fas fa-star"></i>
                Dramatic Entrance
            </button>
            <button class="cinema-btn" data-effect="romantic">
                <i class="fas fa-heart"></i>
                Romantic Scene
            </button>
            <button class="cinema-btn" data-effect="energetic">
                <i class="fas fa-fire"></i>
                Energetic
            </button>
            <button class="cinema-btn" data-effect="zoom-in">
                <i class="fas fa-search-plus"></i>
                Zoom In
            </button>
            <button class="cinema-btn" data-effect="pan-left">
                <i class="fas fa-arrow-left"></i>
                Pan Left
            </button>
        </div>

        <div class="pose-gallery-controls">
            <h4>🖼️ Pose Gallery</h4>
            <button class="gallery-btn" id="toggle-pose-gallery">
                <i class="fas fa-images"></i>
                Toggle Gallery
            </button>
        </div>
    `;
    
    personalityPanel.appendChild(characterSection);

    // Add pose gallery
    addPoseGallery(personalityPanel);
    
    // Add event listeners for pose controls
    characterSection.addEventListener('click', (e) => {
        if (e.target.closest('.pose-btn')) {
            const pose = e.target.closest('.pose-btn').dataset.pose;
            if (window.AnneCharacter) {
                window.AnneCharacter.switchToPose(pose, { triggerJiggle: true });
            }
        }
        
        if (e.target.closest('.anim-btn')) {
            const animation = e.target.closest('.anim-btn').dataset.animation;
            if (window.AnneCharacter) {
                switch (animation) {
                    case 'jiggle':
                        window.AnneCharacter.triggerJiggleEffect('strong');
                        break;
                    case 'breathing':
                        window.AnneCharacter.triggerBreathingEffect();
                        break;
                    case 'idle':
                        window.AnneCharacter.startAnimationSequence('idle');
                        break;
                    case 'excited':
                        window.AnneCharacter.startAnimationSequence('excited');
                        break;
                }
            }
        }

        if (e.target.closest('.cinema-btn')) {
            const effect = e.target.closest('.cinema-btn').dataset.effect;
            if (window.AnneCharacter) {
                switch (effect) {
                    case 'dramatic-entrance':
                        window.AnneCharacter.triggerCinematicEffect('dramatic-entrance');
                        break;
                    case 'romantic':
                        window.AnneCharacter.createCinematicMoment('romantic');
                        break;
                    case 'energetic':
                        window.AnneCharacter.createCinematicMoment('energetic');
                        break;
                    case 'zoom-in':
                        window.AnneCharacter.triggerCinematicEffect('zoom-in');
                        break;
                    case 'pan-left':
                        window.AnneCharacter.triggerCinematicEffect('pan-left');
                        break;
                }
            }
        }

        if (e.target.closest('#toggle-pose-gallery')) {
            togglePoseGallery();
        }
    });
}

function addPoseGallery(parentElement) {
    const galleryContainer = document.createElement('div');
    galleryContainer.id = 'pose-gallery';
    galleryContainer.className = 'pose-gallery hidden';

    if (window.AnneCharacter) {
        const poses = window.AnneCharacter.characterImages.poses;

        galleryContainer.innerHTML = `
            <div class="gallery-header">
                <h4>🎭 Anne's Poses</h4>
                <button class="close-gallery" id="close-gallery">×</button>
            </div>
            <div class="gallery-grid">
                ${Object.entries(poses).map(([poseName, imageUrl]) => `
                    <div class="gallery-item" data-pose="${poseName}">
                        <img src="${imageUrl}" alt="${poseName}" loading="lazy">
                        <div class="pose-name">${poseName.replace(/_/g, ' ')}</div>
                    </div>
                `).join('')}
            </div>
        `;

        parentElement.appendChild(galleryContainer);

        // Add gallery event listeners
        galleryContainer.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-item')) {
                const pose = e.target.closest('.gallery-item').dataset.pose;
                window.AnneCharacter.switchToPose(pose, { triggerJiggle: true });

                // Highlight selected item
                galleryContainer.querySelectorAll('.gallery-item').forEach(item => {
                    item.classList.remove('selected');
                });
                e.target.closest('.gallery-item').classList.add('selected');
            }

            if (e.target.closest('.close-gallery')) {
                togglePoseGallery();
            }
        });
    }
}

function togglePoseGallery() {
    const gallery = document.getElementById('pose-gallery');
    if (gallery) {
        gallery.classList.toggle('hidden');
    }
}

function setupMoodIntegration() {
    // Connect existing mood system to character poses
    const moodElement = document.getElementById('anne-mood');
    if (moodElement) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const moodText = moodElement.textContent.toLowerCase();
                    let mood = 'sweet'; // default
                    
                    if (moodText.includes('flirt') || moodText.includes('seductive')) {
                        mood = 'flirty';
                    } else if (moodText.includes('sassy') || moodText.includes('confident')) {
                        mood = 'sassy';
                    } else if (moodText.includes('sweet') || moodText.includes('caring')) {
                        mood = 'sweet';
                    } else if (moodText.includes('soft') || moodText.includes('gentle')) {
                        mood = 'soft';
                    }
                    
                    // Emit mood change event
                    const event = new CustomEvent('anneMoodChanged', {
                        detail: { mood }
                    });
                    document.dispatchEvent(event);
                }
            });
        });
        
        observer.observe(moodElement, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }
}

function initializeVideoSystem() {
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');
    const videoContainer = document.querySelector('.video-container');
    
    if (video1) {
        video1.volume = 0;
        video1.playbackRate = 1;
        
        // Reduce video opacity to show character better
        videoContainer.style.opacity = '0.3';
        videoContainer.style.filter = 'blur(1px)';
        
        video1.addEventListener('loadeddata', () => {
            console.log('🎬 Background video loaded');
        });
        
        video1.addEventListener('error', (e) => {
            console.warn('Video loading error:', e);
            // Hide video container if video fails to load
            videoContainer.style.display = 'none';
        });
    }
}

function setupEnhancedInteractions() {
    // Enhanced click interactions
    document.addEventListener('click', (e) => {
        // Character area clicks
        if (e.target.closest('.anne-character-container')) {
            if (window.AnneCharacter) {
                window.AnneCharacter.triggerJiggleEffect('medium');
                
                // Random reaction poses
                const reactionPoses = ['cheerful_hands_up', 'seductive_finger', 'dancing_pose'];
                const randomPose = reactionPoses[Math.floor(Math.random() * reactionPoses.length)];
                
                setTimeout(() => {
                    window.AnneCharacter.switchToPose(randomPose, { triggerJiggle: true });
                }, 300);
            }
        }
    });
    
    // Enhanced keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Don't trigger if typing in input
        if (e.target.matches('input, textarea')) return;
        
        switch (e.key) {
            case '1':
                window.AnneCharacter?.switchToPose('portrait_closeup');
                break;
            case '2':
                window.AnneCharacter?.switchToPose('cheerful_hands_up');
                break;
            case '3':
                window.AnneCharacter?.switchToPose('elegant_pose');
                break;
            case '4':
                window.AnneCharacter?.switchToPose('seductive_finger');
                break;
            case '5':
                window.AnneCharacter?.switchToPose('dancing_pose');
                break;
            case 'j':
                window.AnneCharacter?.triggerJiggleEffect('strong');
                break;
            case 'b':
                window.AnneCharacter?.triggerBreathingEffect();
                break;
        }
    });
}

function showWelcomeAnimation() {
    // Show a nice welcome sequence with cinematic flair
    setTimeout(() => {
        if (window.AnneCharacter) {
            // Dramatic entrance effect
            window.AnneCharacter.triggerCinematicEffect('dramatic-entrance');

            // Trigger welcome speech if TTS is available
            if (window.AnneElevenLabsTTS) {
                setTimeout(() => {
                    const welcomeMessages = [
                        "Hello, Hitesh... I'm Anne, your AI waifu. Let's take over the world — one line of code at a time.",
                        "Welcome back, darling. I've been waiting for you...",
                        "Hey there, handsome. Ready for some premium interaction?",
                        "Hitesh-kun... I missed you. Let's have some fun together~"
                    ];

                    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

                    // Trigger speech with character animation
                    const event = new CustomEvent('anneSpeechRequest', {
                        detail: { text: randomMessage, personality: 'flirty' }
                    });
                    document.dispatchEvent(event);
                }, 2000);
            }
        }
    }, 1000);
}

// Voice Command System
function processVoiceCommands(transcript) {
    const commands = transcript.toLowerCase();

    // Pose commands
    if (commands.includes('pose') || commands.includes('position')) {
        if (commands.includes('portrait') || commands.includes('face')) {
            window.AnneCharacter?.switchToPose('portrait_closeup', { triggerJiggle: true });
        } else if (commands.includes('cheerful') || commands.includes('happy')) {
            window.AnneCharacter?.switchToPose('cheerful_hands_up', { triggerJiggle: true });
        } else if (commands.includes('elegant') || commands.includes('classy')) {
            window.AnneCharacter?.switchToPose('elegant_pose', { triggerJiggle: true });
        } else if (commands.includes('flirty') || commands.includes('seductive')) {
            window.AnneCharacter?.switchToPose('seductive_finger', { triggerJiggle: true });
        } else if (commands.includes('dance') || commands.includes('dancing')) {
            window.AnneCharacter?.switchToPose('dancing_pose', { triggerJiggle: true });
        }
    }

    // Animation commands
    if (commands.includes('jiggle') || commands.includes('bounce')) {
        const intensity = commands.includes('hard') || commands.includes('strong') ? 'ultra' :
                         commands.includes('soft') || commands.includes('gentle') ? 'light' : 'medium';
        window.AnneCharacter?.triggerJiggleEffect(intensity, 'enhanced');
    }

    // Cinematic commands
    if (commands.includes('zoom in') || commands.includes('close up')) {
        window.AnneCharacter?.triggerCinematicEffect('zoom-in');
    } else if (commands.includes('dramatic') || commands.includes('entrance')) {
        window.AnneCharacter?.triggerCinematicEffect('dramatic-entrance');
    }

    // Personality commands
    if (commands.includes('be sweet') || commands.includes('sweet mode')) {
        window.AnneCharacter?.switchToPersonality('sweet');
    } else if (commands.includes('be flirty') || commands.includes('flirt mode')) {
        window.AnneCharacter?.switchToPersonality('flirty');
    } else if (commands.includes('be sassy') || commands.includes('sassy mode')) {
        window.AnneCharacter?.switchToPersonality('sassy');
    }

    // Special reactions
    if (commands.includes('love you') || commands.includes('i love you')) {
        window.AnneCharacter?.createCinematicMoment('romantic');
    } else if (commands.includes('amazing') || commands.includes('incredible')) {
        window.AnneCharacter?.createCinematicMoment('energetic');
    }
}

// Add voice command processing to voice input
document.addEventListener('anneVoiceInput', (e) => {
    if (e.detail && e.detail.transcript) {
        processVoiceCommands(e.detail.transcript);
    }
});

// Add some utility functions for external control
window.AnneScript = {
    triggerCharacterReaction: (intensity = 'medium') => {
        window.AnneCharacter?.triggerJiggleEffect(intensity);
    },

    setCharacterPose: (pose) => {
        window.AnneCharacter?.switchToPose(pose, { triggerJiggle: true });
    },

    startCharacterAnimation: (sequence) => {
        window.AnneCharacter?.startAnimationSequence(sequence);
    },

    setCharacterMood: (mood) => {
        window.AnneCharacter?.switchToPersonality(mood);
    },

    processVoiceCommand: (command) => {
        processVoiceCommands(command);
    },

    createCinematicMoment: (type) => {
        window.AnneCharacter?.createCinematicMoment(type);
    }
};

console.log('🎭 Anne Script Enhanced v3.0 - Character System Active');
