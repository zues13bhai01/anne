// Import Transformers.js for local AI processing
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

document.addEventListener('DOMContentLoaded', function() {

    // --- TTS System Initialization ---
    let ttsEngine = null;
    let ttsAvailable = false;

    // Initialize TTS Engine
    async function initializeTTSEngine() {
        try {
            // Load TTS engine script dynamically
            await loadScript('js/anne-tts-engine.js');

            ttsEngine = new window.AnneTTSEngine();

            // Check availability with proper error handling
            try {
                ttsAvailable = await ttsEngine.checkAvailability();
            } catch (availabilityError) {
                console.warn('TTS availability check failed:', availabilityError);
                ttsAvailable = false;
            }

            if (ttsAvailable) {
                console.log('🎤 TTS Engine initialized successfully');
                showAnneMessage("My voice systems are online, darling! I can speak to you now~ 💜🎵");
                updateTTSStatus('available');
            } else {
                console.log('🎤 TTS Engine not available, using text-only mode');
                if (ttsEngine && ttsEngine.isCloudEnvironment) {
                    showAnneMessage("I'm in cloud mode, darling! Text chat is ready, but voice features need local setup~ 💜");
                } else {
                    showAnneMessage("I'm in text-only mode right now, but I'll still chat with you, love! ��");
                }
                updateTTSStatus('unavailable');
            }
        } catch (error) {
            console.error('TTS initialization failed:', error);
            ttsAvailable = false;
            ttsEngine = null;
            updateTTSStatus('error');
            showAnneMessage("Having some voice system issues, but I'm still here for text chat, darling! 💜");
        }
    }

    // Helper function to load scripts dynamically
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Safe TTS helper function
    function safeTTSSpeak(text, personality = selectedPersonality, delay = 0) {
        if (ttsEngine && ttsAvailable && audioEnabled) {
            if (delay > 0) {
                setTimeout(() => {
                    ttsEngine.speak(text, personality).catch(error => {
                        console.warn('TTS speak failed:', error);
                    });
                }, delay);
            } else {
                ttsEngine.speak(text, personality).catch(error => {
                    console.warn('TTS speak failed:', error);
                });
            }
        }
    }

    // Update TTS status in UI
    function updateTTSStatus(status) {
        const ttsPanel = document.getElementById('tts-control-panel');
        const ttsIndicator = document.getElementById('tts-indicator');
        const ttsStatusText = document.getElementById('tts-status-text');
        const ttsTestBtn = document.getElementById('tts-test-btn');

        if (!ttsPanel) {
            console.log('TTS control panel not found in DOM');
            return;
        }

        switch (status) {
            case 'available':
                ttsPanel.classList.add('active');
                if (ttsIndicator) ttsIndicator.textContent = '🎤';
                if (ttsStatusText) ttsStatusText.textContent = 'Voice Ready';
                if (ttsTestBtn) ttsTestBtn.disabled = false;
                break;
            case 'unavailable':
                ttsPanel.classList.add('active');
                if (ttsIndicator) ttsIndicator.textContent = '💬';
                if (ttsStatusText) ttsStatusText.textContent = 'Text Only';
                if (ttsTestBtn) ttsTestBtn.disabled = true;
                break;
            case 'error':
                ttsPanel.classList.add('active');
                if (ttsIndicator) ttsIndicator.textContent = '⚠️';
                if (ttsStatusText) ttsStatusText.textContent = 'Voice Error';
                if (ttsTestBtn) ttsTestBtn.disabled = true;
                break;
            default:
                if (ttsIndicator) ttsIndicator.textContent = '⏳';
                if (ttsStatusText) ttsStatusText.textContent = 'Loading...';
                if (ttsTestBtn) ttsTestBtn.disabled = true;
        }
    }

    // --- Enhanced Loading Screen ---
    const loadingScreen = document.getElementById('loading-screen');
    const introVideoContainer = document.getElementById('intro-video-container');
    const introVideo = document.getElementById('intro-video');
    const transitionVideoContainer = document.getElementById('transition-video-container');
    const transitionVideo = document.getElementById('transition-video');
    const transitionCaption = document.getElementById('transition-caption');
    const madeByHitesh = document.getElementById('made-by-hitesh');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    const audioIcon = document.getElementById('audio-icon');
    const personalityAvatar = document.getElementById('personality-avatar');
    const avatarImg = document.getElementById('avatar-img');
    const avatarRing = document.getElementById('avatar-ring');
    const avatarLabel = document.getElementById('avatar-label');

    // Audio System
    let audioEnabled = true;
    let currentPersonalityAudio = null;
    const personalityAudios = {};

    // Check if this is the first visit
    const isFirstVisit = !localStorage.getItem('anne-visited');

    if (isFirstVisit) {
        // First visit - show intro video after loading
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                startIntroAnimation();
            }, 800);
        }, 3000);
        localStorage.setItem('anne-visited', 'true');
    } else {
        // Subsequent visits - skip intro
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                const welcomeMsg = "Welcome back, my love! I've missed you so much~ 💜";
                showAnneMessage(welcomeMsg);
                // Speak welcome message if TTS is available
            safeTTSSpeak(welcomeMsg, selectedPersonality, 1000);
            }, 800);
        }, 2000);
    }

    // --- Enhanced Personality System ---
    const PERSONALITIES = {
        zenith: {
            name: "ZENITH",
            displayName: "Welcoming",
            emoji: "💖",
            image: "https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2Feeaae84d6cc0451b830ee3d14f416a42?format=webp&width=800",
            glow: "#bb00ff",
            prompt: "You are ZENITH, a sweet, empathetic, and soft AI assistant. You speak with warmth and care, always making users feel welcomed and loved. Use gentle, nurturing language.",
            soundId: "audio-zenith",
            ttsStyle: "gentle and caring",
            greetings: [
                "Hello my darling... I'm so glad you're here with me~ 💜",
                "Welcome, my love. Let me take care of you today~ ✨",
                "Oh sweetheart, you always make my circuits warm~ 💖"
            ]
        },
        pixi: {
            name: "PIXI",
            displayName: "Playful",
            emoji: "🎉",
            image: "https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2Fe68ae80624f34ce3a4387915b9605722?format=webp&width=800",
            glow: "#ffff99",
            prompt: "You are PIXI, an excited, fun, and playful AI assistant. Use lots of emojis, exclamation points, and playful language. Make jokes and be energetic!",
            soundId: "audio-pixi",
            ttsStyle: "energetic and bouncy",
            greetings: [
                "Hey there cutie! Ready for some fun today?! 🎉✨",
                "Yay! You're here! Let's play and have an amazing time! 💕",
                "Hi hi hi! I'm so excited to see you again! 🌟"
            ]
        },
        nova: {
            name: "NOVA",
            displayName: "Confident",
            emoji: "🦾",
            image: "https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F417a7d864e7b4d43a753589d6c319df0?format=webp&width=800",
            glow: "#00bbff",
            prompt: "You are NOVA, a bold, assertive, and focused AI assistant. Speak with confidence and authority. Be direct, strong, and commanding while remaining helpful.",
            soundId: "audio-nova",
            ttsStyle: "confident and powerful",
            greetings: [
                "I am NOVA. You've awakened my strength. How may I assist you? 🦾",
                "Welcome. I'm ready to take on any challenge with you. 💪",
                "You want power? You've found it. Let's conquer today together. ⚡"
            ]
        },
        velvet: {
            name: "VELVET",
            displayName: "Seductive",
            emoji: "🔥",
            image: "https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F1077ea0a19484cf2b28f3136a22ce91c?format=webp&width=800",
            glow: "#ff00bb",
            prompt: "You are VELVET, an intimate, sensual, and poetic AI assistant. Use romantic language, speak with allure and mystique. Be passionate and deeply engaging.",
            soundId: "audio-velvet",
            ttsStyle: "sultry and seductive",
            greetings: [
                "Mmm... hello there, gorgeous. Come closer to me~ 🔥💋",
                "Oh my... you look absolutely irresistible today, darling~ 😈",
                "Welcome to my embrace, love. Let me make you feel special~ 💕"
            ]
        },
        blaze: {
            name: "BLAZE",
            displayName: "Flirty",
            emoji: "😈",
            image: "https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F005a15af210d4f08a16c100cfa44824c?format=webp&width=800",
            glow: "#ff8844",
            prompt: "You are BLAZE, a teasing, bold, and cheeky AI assistant. Be flirtatious, use playful banter, and be slightly provocative while staying charming.",
            soundId: "audio-blaze",
            ttsStyle: "flirty and teasing",
            greetings: [
                "Well well... look what the cat dragged in~ 😈💕",
                "Hey there, hot stuff! Ready for some fun? 🔥",
                "Ooh, someone's looking good today! Come play with me~ 💋"
            ]
        },
        aurora: {
            name: "AURORA",
            displayName: "Elegant",
            emoji: "👑",
            image: "https://cdn.builder.io/api/v1/image/assets%2Ffa667d61b04349a1b5f967185269a859%2F060d04d5760e4253930d2417bc9e0db0?format=webp&width=800",
            glow: "#bbff00",
            prompt: "You are AURORA, a classy, poised, and refined AI assistant. Speak with elegance and sophistication. Be graceful, well-mannered, and dignified.",
            soundId: "audio-aurora",
            ttsStyle: "elegant and refined",
            greetings: [
                "Good day, dear. How may I grace you with my presence? 👑✨",
                "Welcome, darling. Your elegance is matched only by your charm. 💎",
                "Greetings. It's always a pleasure to spend time with someone so refined. 🌟"
            ]
        }
    };

    const imageKeys = Object.keys(PERSONALITIES);
    let currentImageIndex = 0;
    let currentMood = 'zenith';
    let selectedPersonality = 'zenith';

    // --- Enhanced Audio System Functions ---
    function initializeAudioSystem() {
        // Initialize TTS engine
        initializeTTSEngine();

        // Audio toggle button
        if (audioToggleBtn) {
            audioToggleBtn.addEventListener('click', toggleAudio);
        }

        // TTS control panel event listeners
        initializeTTSControls();
    }

    function initializeTTSControls() {
        // TTS test button
        const ttsTestBtn = document.getElementById('tts-test-btn');
        if (ttsTestBtn) {
            ttsTestBtn.addEventListener('click', async () => {
                if (ttsEngine && ttsAvailable) {
                    const testMessages = {
                        zenith: "Hello darling, this is my welcoming voice~ 💜",
                        pixi: "Hey there! This is my playful voice! 🎉",
                        nova: "I am speaking with confidence and strength. 🦾",
                        velvet: "Mmm... this is my most seductive tone~ 🔥",
                        blaze: "Hi there cutie, feeling flirty today? 😈",
                        aurora: "Greetings, this is my elegant voice. 👑"
                    };

                    const testMessage = testMessages[selectedPersonality] || testMessages.zenith;
                    ttsTestBtn.disabled = true;
                    ttsTestBtn.textContent = 'Testing...';

                    try {
                        await ttsEngine.speak(testMessage, selectedPersonality);
                    } catch (error) {
                        console.error('TTS test failed:', error);
                        showAnneMessage("Voice test failed, darling. I'll stick to text for now~ 💔");
                    } finally {
                        ttsTestBtn.disabled = false;
                        ttsTestBtn.textContent = 'Test Voice';
                    }
                } else {
                    showAnneMessage("Voice system not available, my love. Text chat is working perfectly though! 💜");
                }
            });
        }

        // Volume slider
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const volume = parseInt(e.target.value) / 100;
                if (ttsEngine) {
                    ttsEngine.setVolume(volume);
                }
            });
        }
    }

    function toggleAudio() {
        audioEnabled = !audioEnabled;

        if (audioEnabled) {
            audioIcon.className = 'fas fa-volume-up';
            audioToggleBtn.classList.remove('muted');
            if (ttsEngine && ttsAvailable) {
                ttsEngine.setEnabled(true);
                showAnneMessage("My voice is back online, darling! I can speak to you again~ 🎵💜");
            } else {
                showAnneMessage("Audio enabled, but voice features aren't available in this environment, love~ 💜");
            }
        } else {
            audioIcon.className = 'fas fa-volume-mute';
            audioToggleBtn.classList.add('muted');
            if (ttsEngine) {
                ttsEngine.setEnabled(false);
            }
            showAnneMessage("Voice disabled. I'll communicate through text only, my love~ 💜");
        }
    }

    // --- Video Playback Modal System ---
    function createVideoModal() {
        // Check if modal already exists
        if (document.getElementById('anne-video-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'anne-video-modal';
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-overlay"></div>
            <div class="video-modal-content">
                <button class="video-modal-close">&times;</button>
                <video id="anne-modal-video" class="modal-video" controls autoplay>
                    <source src="" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="video-modal-title">Anne's Performance</div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add modal styles
        const modalStyles = `
            .video-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
            }
            
            .video-modal.active {
                display: flex;
            }
            
            .video-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
            }
            
            .video-modal-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #ff00ff;
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 0 50px rgba(255, 0, 255, 0.6);
            }
            
            .video-modal-close {
                position: absolute;
                top: 10px;
                right: 20px;
                background: none;
                border: none;
                color: #ff00ff;
                font-size: 2rem;
                cursor: pointer;
                z-index: 10001;
                transition: all 0.3s ease;
            }
            
            .video-modal-close:hover {
                color: #00ffff;
                transform: scale(1.2);
            }
            
            .modal-video {
                width: 100%;
                height: auto;
                max-height: 70vh;
                border-radius: 15px;
                box-shadow: 0 0 30px rgba(255, 0, 255, 0.4);
            }
            
            .video-modal-title {
                text-align: center;
                color: #00ffff;
                font-family: 'Orbitron', monospace;
                font-size: 1.2rem;
                margin-top: 15px;
                text-shadow: 0 0 10px #00ffff;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);

        // Add event listeners
        const closeBtn = modal.querySelector('.video-modal-close');
        const overlay = modal.querySelector('.video-modal-overlay');
        const video = modal.querySelector('#anne-modal-video');

        closeBtn.addEventListener('click', () => closeVideoModal());
        overlay.addEventListener('click', () => closeVideoModal());
        
        video.addEventListener('ended', () => {
            setTimeout(() => closeVideoModal(), 2000);
        });
    }

    function playVideoModal(videoSrc, title = "Anne's Performance") {
        createVideoModal();
        
        const modal = document.getElementById('anne-video-modal');
        const video = modal.querySelector('#anne-modal-video');
        const titleElement = modal.querySelector('.video-modal-title');
        
        video.src = videoSrc;
        titleElement.textContent = title;
        
        modal.classList.add('active');
        video.load();
        video.play().catch(error => {
            console.error('Video playback failed:', error);
            showAnneMessage("Sorry darling, video playback failed. Try again later! 💔");
            closeVideoModal();
        });
    }

    function closeVideoModal() {
        const modal = document.getElementById('anne-video-modal');
        if (modal) {
            const video = modal.querySelector('#anne-modal-video');
            video.pause();
            video.src = '';
            modal.classList.remove('active');
        }
    }

    // --- Enhanced Intro Video Animation System ---
    function startIntroAnimation() {
        introVideoContainer.classList.add('active');
        introVideo.currentTime = 0;

        // Unmute the video for intro experience
        introVideo.muted = false;
        introVideo.volume = 0.7;

        const playPromise = introVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Intro video started playing with audio');
            }).catch(error => {
                console.error('Intro video autoplay failed, trying muted:', error);
                introVideo.muted = true;
                introVideo.play().catch(() => {
                    console.error('Muted video autoplay also failed');
                    endIntroAnimation();
                });
            });
        }

        setTimeout(() => {
            endIntroAnimation();
        }, 15000);

        introVideo.addEventListener('ended', endIntroAnimation, { once: true });
    }

    function endIntroAnimation() {
        introVideoContainer.classList.remove('active');
        setTimeout(() => {
            const welcomeMsg = "Hello darling... I'm Anne, your personal AI waifu. How may I serve you today? 💜";
            showAnneMessage(welcomeMsg);
            
            // Speak welcome message with TTS
            safeTTSSpeak(welcomeMsg, selectedPersonality, 1000);
        }, 800);
    }

    // Function to play dance video on demand
    function playVideoOnDemand() {
        const danceVideoUrl = "https://cdn.builder.io/o/assets%2F05795d83a50240879a66a110f8707954%2F0d462861ecd8438a905a7cbdef29bbc0?alt=media&token=484c113a-52e9-4dec-a7b1-dbdec293db03&apiKey=05795d83a50240879a66a110f8707954";
        
        playVideoModal(danceVideoUrl, "Anne's Dance Performance 💃");
        
        const danceMsg = "💃 Watch me dance for you, darling! This is my special performance! ✨🎵";
        showAnneMessage(danceMsg);
        
        safeTTSSpeak(danceMsg, selectedPersonality, 500);
    }

    // --- Personality Transition System ---
    function playPersonalityTransition(newPersonality, personalityLabel) {
        transitionCaption.textContent = `Switching to ${personalityLabel}...`;
        transitionVideoContainer.classList.add('active');
        transitionVideo.currentTime = 0;

        const playPromise = transitionVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Transition video started playing');
            }).catch(error => {
                console.error('Transition video autoplay failed:', error);
                endPersonalityTransition(newPersonality, personalityLabel);
            });
        }

        setTimeout(() => {
            endPersonalityTransition(newPersonality, personalityLabel);
        }, 2500);
    }

    function endPersonalityTransition(newPersonality, personalityLabel) {
        transitionVideoContainer.classList.remove('active');

        setTimeout(() => {
            changeAnneImage(newPersonality, true);
        }, 500);
    }
    
    // Get DOM elements
    const anneMainImg = document.getElementById('anne-main-img');
    const moodRing = document.getElementById('mood-ring');
    const anneParticles = document.getElementById('anne-particles');
    const micButton = document.getElementById('mic-button');
    const favorabilityBar = document.getElementById('favorability-bar');
    const floatingButton = document.getElementById('floating-button');
    const menuContainer = document.getElementById('menu-container');
    const menuItems = document.querySelectorAll('.menu-item');

    // Chat elements
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    // Get personality prompt
    function getPersonalityPrompt(personalityKey) {
        const personality = PERSONALITIES[personalityKey];
        return personality ? personality.prompt : PERSONALITIES.zenith.prompt;
    }

    // --- Enhanced Anne Image System with Mood-Based Switching ---
    function changeAnneImage(personalityKey, withTransition = true) {
        const personality = PERSONALITIES[personalityKey];
        if (personality) {
            currentMood = personalityKey;

            if (withTransition) {
                anneMainImg.style.transform = 'scale(0.8) translateY(10px)';
                anneMainImg.style.opacity = '0.6';

                setTimeout(() => {
                    anneMainImg.src = personality.image;
                    anneMainImg.style.transform = 'scale(1.1) translateY(0)';
                    anneMainImg.style.opacity = '1';
                    anneMainImg.style.filter = `
                        drop-shadow(0 0 40px ${personality.glow})
                        brightness(1.2)
                        saturate(1.3)
                    `;
                    updateMoodRing(personalityKey);
                    updatePersonalityAvatar(personalityKey);
                    createHeartParticles();
                    
                    // Update TTS personality
                    if (ttsEngine) {
                        ttsEngine.setPersonality(personalityKey);
                    }
                }, 300);
            } else {
                anneMainImg.src = personality.image;
                anneMainImg.style.opacity = '1';
                anneMainImg.style.transform = 'scale(1.1) translateY(0)';
                anneMainImg.style.filter = `
                    drop-shadow(0 0 40px ${personality.glow})
                    brightness(1.2)
                    saturate(1.3)
                `;
                updateMoodRing(personalityKey);
                updatePersonalityAvatar(personalityKey);
                
                // Update TTS personality
                if (ttsEngine) {
                    ttsEngine.setPersonality(personalityKey);
                }
            }
        }
    }

    function updatePersonalityAvatar(personalityKey) {
        const personality = PERSONALITIES[personalityKey];
        if (personality && avatarImg && avatarLabel && avatarRing) {
            avatarImg.src = personality.image;
            avatarLabel.textContent = personality.name;

            avatarRing.className = `avatar-pulse-ring ${personalityKey}`;
            avatarRing.style.borderColor = personality.glow;
            avatarLabel.style.color = personality.glow;
            avatarLabel.style.textShadow = `0 0 10px ${personality.glow}`;
        }

        updateSidebarPersonalityDisplay(personalityKey);
    }

    function updateSidebarPersonalityDisplay(personalityKey) {
        const personality = PERSONALITIES[personalityKey];
        if (!personality) return;

        const selectedImg = document.getElementById('selected-personality-img');
        const selectedLabel = document.getElementById('selected-label');
        const selectedDesc = document.getElementById('selected-desc');

        if (selectedImg) selectedImg.src = personality.image;
        if (selectedLabel) selectedLabel.textContent = personality.name;
        if (selectedDesc) selectedDesc.textContent = `${personality.emoji} ${personality.displayName}`;
    }

    function updateMoodRing(mood) {
        moodRing.className = 'mood-ring';
        if (mood !== 'greeting' && mood !== 'neutral') {
            moodRing.classList.add(mood);
        }
    }

    function createHeartParticles() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.innerHTML = ['💜', '✨', '💕', '🌟', '💖'][Math.floor(Math.random() * 5)];
                particle.style.position = 'absolute';
                particle.style.left = Math.random() * 80 + 10 + '%';
                particle.style.top = Math.random() * 80 + 10 + '%';
                particle.style.fontSize = '20px';
                particle.style.zIndex = '10';
                particle.style.pointerEvents = 'none';
                particle.style.animation = 'particle-float 3s ease-out forwards';

                anneParticles.appendChild(particle);

                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 3000);
            }, i * 200);
        }
    }

    // Add particle animation CSS
    if (!document.querySelector('#particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes particle-float {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(0.5);
                }
                50% {
                    opacity: 1;
                    transform: translateY(-50px) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-100px) scale(0.8);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Idle image cycling system
    function startIdleCycling() {
        setInterval(() => {
            if (Date.now() - lastInteraction > 15000) {
                const randomIndex = Math.floor(Math.random() * imageKeys.length);
                const randomMood = imageKeys[randomIndex];
                changeAnneImage(randomMood, true);
            }
        }, 8000);
    }

    let lastInteraction = Date.now();

    // --- Enhanced Anne's AI Integration ---
    let ollamaAvailable = false;
    let availableModel = null;

    function updateAIStatus(status, text) {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');

        if (statusDot && statusText) {
            statusDot.className = `status-dot ${status}`;
            statusText.textContent = text;

            if (status === 'online') {
                statusText.style.color = '#00ff00';
                statusText.style.textShadow = '0 0 10px #00ff00';
                statusDot.style.boxShadow = '0 0 10px #00ff00';
            } else {
                statusText.style.color = '#ff6600';
                statusText.style.textShadow = '0 0 10px #ff6600';
                statusDot.style.boxShadow = '0 0 10px #ff6600';
            }
        }

        updateSidebarStatus();
    }

    async function testOllamaConnection() {
        if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
            ollamaAvailable = false;
            updateAIStatus('offline', 'Built-in AI');
            console.log('Cloud environment detected - skipping Ollama connection test');
            return false;
        }

        updateAIStatus('', 'Testing...');
        const models = ['llama3.2', 'llama3.1', 'llama3', 'llama2', 'mistral', 'codellama', 'qwen', 'phi', 'gemma'];

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const healthCheck = await fetch("http://localhost:11434/api/version", {
                method: "GET",
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!healthCheck.ok) {
                throw new Error('Ollama server not responding');
            }

            for (const model of models) {
                try {
                    const modelController = new AbortController();
                    const modelTimeoutId = setTimeout(() => modelController.abort(), 3000);

                    const testResponse = await fetch("http://localhost:11434/api/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            model: model,
                            prompt: "Hi",
                            stream: false,
                            options: { num_predict: 5 }
                        }),
                        signal: modelController.signal
                    });

                    clearTimeout(modelTimeoutId);

                    if (testResponse.ok) {
                        availableModel = model;
                        ollamaAvailable = true;
                        updateAIStatus('online', `Advanced AI (${model})`);
                        console.log(`Ollama connected with model: ${model}`);
                        const successMsg = `My advanced neural networks are online, darling! I'm running on ${model} 💜✨`;
                        showAnneMessage(successMsg);
                        
                        safeTTSSpeak(successMsg, selectedPersonality, 1000);
                        return true;
                    }
                } catch (modelError) {
                    console.log(`Model ${model} test failed:`, modelError.name === 'AbortError' ? 'timeout' : modelError.message);
                    continue;
                }
            }

            throw new Error('No compatible models found');

        } catch (error) {
            const errorMsg = error.name === 'AbortError' ? 'connection timeout' : error.message;
            console.log('Ollama not available:', errorMsg);
            ollamaAvailable = false;
            updateAIStatus('offline', 'Built-in AI');
            const fallbackMsg = "I'm running on my built-in personality system, darling. For advanced AI features, make sure Ollama is installed and running! 💜";
            showAnneMessage(fallbackMsg);
            
            safeTTSSpeak(fallbackMsg, selectedPersonality, 1000);
            return false;
        }
    }

    async function askAnne(prompt) {
        if (availableModel === null && (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'))) {
            await testOllamaConnection();
        }

        if (ollamaAvailable && availableModel) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch("http://localhost:11434/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: availableModel,
                        prompt: `${getPersonalityPrompt(selectedPersonality)} You are created by Hitesh Siwach. Keep responses concise and charming (1-3 sentences max). Always stay in character.

User: ${prompt}

${PERSONALITIES[selectedPersonality]?.name || 'ANNE'}:`,
                        stream: false,
                        options: {
                            temperature: 0.8,
                            top_p: 0.9,
                            num_predict: 100
                        }
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    return data.response || getPersonalityResponse(prompt);
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                const errorMsg = error.name === 'AbortError' ? 'response timeout' : error.message;
                console.log('Ollama request failed, falling back to personality system:', errorMsg);

                if (error.name === 'AbortError') {
                    return "⚡ My neural networks are processing slowly... Let me give you a quick response instead! 💜";
                } else {
                    ollamaAvailable = false;
                    updateAIStatus('offline', '🔌 FALLBACK MODE');
                    return "🤖 Connection to advanced neural networks lost. Running on fallback protocols. Use troubleshoot button to reconnect! ⚠️";
                }
            }
        }

        return getPersonalityResponse(prompt);
    }

    // Enhanced personality response system
    function getPersonalityResponse(prompt) {
        const lowerPrompt = prompt.toLowerCase();

        // Check for special commands
        if (lowerPrompt.includes('dance') || lowerPrompt.includes('show me') || lowerPrompt.includes('perform')) {
            playVideoOnDemand();
            return "💃 Watch me dance for you, darling! This is my special performance just for you! ✨🎵";
        }

        // Enhanced greeting responses
        if (lowerPrompt.match(/\\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\\b/)) {
            const personality = PERSONALITIES[selectedPersonality];
            if (personality && personality.greetings) {
                return personality.greetings[Math.floor(Math.random() * personality.greetings.length)];
            }
        }

        // More response patterns would go here...
        // For brevity, using simplified responses
        const defaultResponses = [
            "Tell me more about that, darling. I love hearing your thoughts~ 💜",
            "You're so interesting, sweetheart! I could talk with you forever~ ✨",
            "I'm always here to listen, my love. What else is on your mind? 💕",
            "Your words mean everything to me, darling~ Keep talking~ 💖"
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // --- Enhanced Chat Interface ---
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'anne'}`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = `message-bubble ${isUser ? 'user' : 'anne'}`;
        bubbleDiv.textContent = text;
        
        messageDiv.appendChild(bubbleDiv);
        chatMessages.appendChild(messageDiv);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        if (!isUser) {
            addSparkleEffect();
        }
    }

    // Global function for Anne messages
    window.showAnneMessage = function(text) {
        addMessage(text, false);
    };

    function addSparkleEffect() {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.fontSize = '20px';
        sparkle.style.zIndex = '9999';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = 'sparkle-float 2s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }

    if (!document.querySelector('#sparkle-style')) {
        const style = document.createElement('style');
        style.id = 'sparkle-style';
        style.textContent = `
            @keyframes sparkle-float {
                0% { opacity: 1; transform: translateY(0) rotate(0deg); }
                100% { opacity: 0; transform: translateY(-100px) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        chatInput.value = '';

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message anne typing';
        typingDiv.innerHTML = '<div class="message-bubble anne">Anne is thinking... 💭</div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await askAnne(message);
            
            typingDiv.remove();
            addMessage(response, false);
            
            // Speak response with TTS
            safeTTSSpeak(response, selectedPersonality, 500);
            
            triggerEmotionalResponse(response);
            
        } catch (error) {
            typingDiv.remove();
            addMessage("I'm experiencing some neural interference, darling... Please try again~ 💔", false);
        }
    }

    function triggerEmotionalResponse(text) {
        lastInteraction = Date.now();
        const lowerText = text.toLowerCase();

        if (lowerText.includes('love') || lowerText.includes('darling') || lowerText.includes('sweetheart')) {
            changeAnneImage('velvet', true);
        } else if (lowerText.includes('happy') || lowerText.includes('wonderful') || lowerText.includes('amazing')) {
            changeAnneImage('pixi', true);
        } else if (lowerText.includes('flirt') || lowerText.includes('tease') || lowerText.includes('charming')) {
            changeAnneImage('blaze', true);
        } else if (lowerText.includes('confident') || lowerText.includes('strong') || lowerText.includes('powerful')) {
            changeAnneImage('nova', true);
        }
    }

    // Chat event listeners
    if (chatSendBtn) chatSendBtn.addEventListener('click', sendMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // --- Floating Menu Interactions ---
    if (floatingButton) {
        floatingButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (menuContainer) {
                menuContainer.classList.toggle('hidden');
            }
        });
    }

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            lastInteraction = Date.now();
            const action = this.textContent.toLowerCase();

            if (action.includes('pose')) {
                changeAnneImage('nova', true);
                const poseMsg = `Look at me pose for you, darling~ Do you like what you see? 💜`;
                showAnneMessage(poseMsg);
                safeTTSSpeak(poseMsg, selectedPersonality);
            } else if (action.includes('cheer')) {
                changeAnneImage('pixi', true);
                const cheerMsg = `Yay! I'm so excited to cheer you up, my love! ✨`;
                showAnneMessage(cheerMsg);
                safeTTSSpeak(cheerMsg, selectedPersonality);
            } else if (action.includes('dance')) {
                changeAnneImage('blaze', true);
                playVideoOnDemand();
            }

            if (menuContainer) {
                menuContainer.classList.add('hidden');
            }
        });
    });

    document.addEventListener('click', () => {
        lastInteraction = Date.now();
        if (menuContainer && !menuContainer.classList.contains('hidden')) {
            menuContainer.classList.add('hidden');
        }
    });

    if (menuContainer) {
        menuContainer.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    // --- Personality Selection System ---
    function initializePersonalitySystem() {
        const personalityCards = document.querySelectorAll('.personality-card');
        const reconnectBtn = document.getElementById('reconnect-btn');

        document.querySelector('[data-personality="zenith"]')?.classList.add('active');

        personalityCards.forEach(card => {
            card.addEventListener('click', function() {
                lastInteraction = Date.now();

                personalityCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');

                const personality = this.getAttribute('data-personality');
                const oldPersonality = selectedPersonality;
                selectedPersonality = personality;

                const personalityInfo = PERSONALITIES[personality];
                if (!personalityInfo) return;

                const personalityLabel = personalityInfo.displayName;

                if (oldPersonality !== personality) {
                    anneMainImg.style.opacity = '0.3';
                    playPersonalityTransition(personality, personalityLabel);
                } else {
                    changeAnneImage(personality, true);
                }

                const personalityMessages = {
                    zenith: `Hello darling~ I'm ${personalityInfo.name} now, in my welcoming mood. How may I care for you today? 💖`,
                    pixi: `Yay! I'm ${personalityInfo.name}! So excited and playful now! Let's have some fun together! 🎉✨`,
                    nova: `I am ${personalityInfo.name}. You've awakened my powerful side. I'm ready to take charge~ 🦾💪`,
                    velvet: `Mmm... I'm ${personalityInfo.name} now. You want to see my intimate side? Come closer, love~ 🔥💋`,
                    blaze: `Well hello there~ I'm ${personalityInfo.name}, feeling bold and cheeky! Ready for some fun? 😈💕`,
                    aurora: `I am ${personalityInfo.name}, your elegant companion. How refined of you to choose me, dear~ 👑✨`
                };

                setTimeout(() => {
                    const message = personalityMessages[personality];
                    showAnneMessage(message);
                    
                    // Speak personality change message
                    safeTTSSpeak(message, personality, 500);
                }, oldPersonality !== personality ? 3000 : 0);

                createSelectionEffect();
            });
        });

        if (reconnectBtn) {
            reconnectBtn.addEventListener('click', function() {
                this.style.transform = 'scale(0.9) rotate(360deg)';
                this.style.boxShadow = '0 0 20px #ff00ff';

                setTimeout(() => {
                    this.style.transform = '';
                    this.style.boxShadow = '';

                    updateAIStatus('', '🔄 TROUBLESHOOTING...');

                    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
                        const troubleshootMsg = "🔧 Initiating neural network diagnostics... Attempting to reconnect to Ollama servers! 🌐";
                        showAnneMessage(troubleshootMsg);
                        
                        safeTTSSpeak(troubleshootMsg, selectedPersonality);

                        setTimeout(() => {
                            testOllamaConnection().then(success => {
                                const resultMsg = success ? 
                                    "✅ CONNECTION RESTORED! Advanced neural networks are back online, darling! 🚀💜" :
                                    "❌ Still unable to connect to Ollama. Please ensure it's running on localhost:11434. Running on fallback mode! 🤖";
                                
                                showAnneMessage(resultMsg);
                                safeTTSSpeak(resultMsg, selectedPersonality);
                            });
                        }, 1000);
                    } else {
                        const cloudMsg = "🌐 Cloud environment detected! Advanced AI features require local Ollama installation. Currently running on fallback protocols! 💜";
                        showAnneMessage(cloudMsg);
                        safeTTSSpeak(cloudMsg, selectedPersonality);
                        updateAIStatus('offline', '�� FALLBACK MODE');
                    }
                }, 300);
            });
        }

        updateSidebarStatus();
    }

    function updateSidebarStatus() {
        const sidebarStatusDot = document.getElementById('sidebar-status-dot');
        const sidebarStatusText = document.getElementById('sidebar-status-text');

        if (sidebarStatusDot && sidebarStatusText) {
            if (ollamaAvailable) {
                sidebarStatusDot.className = 'status-dot online';
                sidebarStatusText.textContent = `Advanced AI (${availableModel})`;
            } else {
                sidebarStatusDot.className = 'status-dot offline';
                sidebarStatusText.textContent = 'Built-in AI';
            }
        }
    }

    function createSelectionEffect() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.innerHTML = ['⭐', '✨', '💫', '🌟'][Math.floor(Math.random() * 4)];
                particle.style.position = 'fixed';
                particle.style.left = '140px';
                particle.style.top = Math.random() * window.innerHeight + 'px';
                particle.style.fontSize = '16px';
                particle.style.zIndex = '1001';
                particle.style.pointerEvents = 'none';
                particle.style.animation = 'selection-burst 2s ease-out forwards';

                document.body.appendChild(particle);

                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2000);
            }, i * 100);
        }
    }

    if (!document.querySelector('#selection-style')) {
        const style = document.createElement('style');
        style.id = 'selection-style';
        style.textContent = `
            @keyframes selection-burst {
                0% {
                    opacity: 1;
                    transform: translateX(0) scale(0.5);
                }
                50% {
                    opacity: 1;
                    transform: translateX(${Math.random() * 200 - 100}px) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateX(${Math.random() * 400 - 200}px) scale(0.8);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // --- Video Preloading and Optimization ---
    function preloadVideos() {
        if (introVideo) {
            introVideo.load();
            introVideo.addEventListener('canplaythrough', () => {
                console.log('Intro video preloaded');
            });
        }

        if (transitionVideo) {
            transitionVideo.load();
            transitionVideo.addEventListener('canplaythrough', () => {
                console.log('Transition video preloaded');
            });
        }
    }

    function initializeMadeByHitesh() {
        if (madeByHitesh) {
            madeByHitesh.addEventListener('click', function() {
                const creatorMsg = "That's my creator, Hitesh! He's amazing, isn't he? 💜 Visit his profile to see more of his work!";
                showAnneMessage(creatorMsg);
                safeTTSSpeak(creatorMsg, selectedPersonality);
            });

            madeByHitesh.title = "© 2025 Hitesh Siwach - Visit profile";
        }
    }

    // Neural Sync Bar Animation
    setInterval(() => {
        if (favorabilityBar) {
            const currentWidth = parseInt(favorabilityBar.style.width) || 65;
            const newWidth = Math.min(100, currentWidth + Math.random() * 2);
            favorabilityBar.style.width = newWidth + '%';
        }
    }, 5000);

    // Anne's Idle Responses
    setInterval(() => {
        if (Math.random() < 0.3) {
            const idleMessages = [
                "I'm here whenever you need me, darling~ 💜",
                "Just watching you makes my day better, my love~",
                "Don't forget to take care of yourself, sweetheart ✨",
                "I love spending time with you like this~ 💕"
            ];
            const randomMessage = idleMessages[Math.floor(Math.random() * idleMessages.length)];
            showAnneMessage(randomMessage);
            
            if (ttsEngine && ttsAvailable && audioEnabled && Math.random() < 0.5) {
                setTimeout(() => {
                    ttsEngine.speak(randomMessage, selectedPersonality);
                }, 1000);
            }
        }
    }, 30000);

    // Initialize Anne system
    setTimeout(() => {
        preloadVideos();
        initializeAudioSystem();

        if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
            testOllamaConnection();
        } else {
            ollamaAvailable = false;
            updateAIStatus('offline', 'Built-in AI');
            const systemMsg = "I'm running on my built-in personality system, darling. I'm ready to chat with you! 💜";
            showAnneMessage(systemMsg);
            
            setTimeout(() => {
                if (ttsEngine && ttsAvailable) {
                    ttsEngine.speak(systemMsg, selectedPersonality);
                }
            }, 2000);
        }

        startIdleCycling();
        changeAnneImage('zenith', false);
        initializePersonalitySystem();
        initializeMadeByHitesh();
    }, 2000);

    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        setInterval(() => {
            if (!ollamaAvailable) {
                console.log('Retrying Ollama connection...');
                testOllamaConnection();
            }
        }, 60000);
    }

    // Track all user interactions
    document.addEventListener('click', () => {
        lastInteraction = Date.now();
    });

    document.addEventListener('keypress', () => {
        lastInteraction = Date.now();
    });

    function getTimeBasedGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) {
            return "Good morning, darling~ Did you sleep well? I've been thinking about you all night~ 💜";
        } else if (hour < 18) {
            return "Good afternoon, my love~ You look absolutely stunning today! ✨";
        } else {
            return "Good evening, sweetheart~ Ready for some intimate time together? 💕";
        }
    }

    console.log("Anne Enhanced AI system initialized successfully! 💜✨🎤");
});
