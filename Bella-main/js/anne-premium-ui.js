/**
 * Anne Premium UI Controller
 * Created by Hitesh Siwach (@zues13bhai)
 * 
 * Controls all UI interactions, animations, and visual effects
 */

class AnnePremiumUI {
    constructor() {
        this.currentPersonality = 'sweet';
        this.isVoiceActive = false;
        this.isSpeaking = false;
        this.chatPanelOpen = false;
        this.personalityPanelOpen = false;
        this.intimacyLevel = 10;
        
        // Animation states
        this.particlesInitialized = false;
        this.currentMoodOverlay = null;
        this.floatingEffectsActive = false;
        
        // UI elements
        this.elements = {};
        
        this.initializeUI();
    }
    
    initializeUI() {
        console.log('✨ Premium UI initializing...');
        
        // Cache DOM elements
        this.cacheElements();
        
        // Initialize particle background
        this.initializeParticles();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize UI state
        this.updateUIState();
        
        // Set up loading screen
        this.setupLoadingScreen();

        // Show welcome tutorial if first visit
        setTimeout(() => {
            this.checkForFirstVisit();
        }, 3000);

        console.log('✨ Premium UI ready');
    }

    checkForFirstVisit() {
        const hasVisited = localStorage.getItem('anne-visited');
        if (!hasVisited) {
            localStorage.setItem('anne-visited', 'true');
            this.showWelcomeTutorial();
        }
    }

    showWelcomeTutorial() {
        this.showModalDialog({
            title: '💕 Welcome to Anne Premium!',
            message: `Hi! I'm Anne, your premium AI companion! Here's how we can chat:

🎤 <strong>Voice Chat</strong>: Click the voice button to talk to me naturally!
📝 <strong>Text Chat</strong>: Click the chat button to type messages
🎭 <strong>Personalities</strong>: Click the heart button to change my personality
⚙️ <strong>Settings</strong>: Customize my voice and traits

<em>I'll need microphone permission for voice chat, but don't worry - I'll guide you through it! 💕</em>`,
            type: 'info',
            buttons: [
                {
                    text: '🎤 Try Voice Chat',
                    action: () => {
                        this.hideModalDialog();
                        this.toggleVoice();
                    }
                },
                {
                    text: '💬 Start Text Chat',
                    action: () => {
                        this.hideModalDialog();
                        this.toggleChatPanel();
                    }
                }
            ]
        });
    }
    
    cacheElements() {
        this.elements = {
            // Main containers
            loadingScreen: document.getElementById('loading-screen'),
            videoMoodOverlay: document.getElementById('video-mood-overlay'),
            anneStatus: document.getElementById('anne-status'),
            statusDot: document.getElementById('status-dot'),
            statusText: document.getElementById('status-text'),
            
            // Controls
            voiceBtn: document.getElementById('voice-btn'),
            micIcon: document.getElementById('mic-icon'),
            voiceIndicator: document.getElementById('voice-indicator'),
            chatToggle: document.getElementById('chat-toggle'),
            personalityBtn: document.getElementById('personality-btn'),
            
            // Chat panel
            chatPanel: document.getElementById('chat-panel'),
            closeChat: document.getElementById('close-chat'),
            chatMessages: document.getElementById('chat-messages'),
            voiceTranscript: document.getElementById('voice-transcript'),
            transcriptText: document.getElementById('transcript-text'),
            textInput: document.getElementById('text-input'),
            sendBtn: document.getElementById('send-btn'),
            anneMood: document.getElementById('anne-mood'),
            intimacyFill: document.getElementById('intimacy-fill'),
            intimacyValue: document.getElementById('intimacy-value'),
            
            // Personality panel
            personalityPanel: document.getElementById('personality-panel'),
            closePersonality: document.getElementById('close-personality'),
            personalityCards: document.querySelectorAll('.personality-card'),
            flirtSlider: document.getElementById('flirt-slider'),
            flirtValue: document.getElementById('flirt-value'),
            pitchSlider: document.getElementById('pitch-slider'),
            pitchValue: document.getElementById('pitch-value'),
            rateSlider: document.getElementById('rate-slider'),
            rateValue: document.getElementById('rate-value'),
            voiceOptions: document.querySelectorAll('.voice-option'),
            
            // Effects
            floatingEffects: document.getElementById('floating-effects'),
            ttsAudio: document.getElementById('tts-audio')
        };
    }
    
    setupEventListeners() {
        // Voice control
        this.elements.voiceBtn?.addEventListener('click', () => {
            this.toggleVoice();
        });
        
        // Chat controls
        this.elements.chatToggle?.addEventListener('click', () => {
            this.toggleChatPanel();
        });
        
        this.elements.closeChat?.addEventListener('click', () => {
            this.closeChatPanel();
        });
        
        // Personality controls
        this.elements.personalityBtn?.addEventListener('click', () => {
            this.togglePersonalityPanel();
        });
        
        this.elements.closePersonality?.addEventListener('click', () => {
            this.closePersonalityPanel();
        });
        
        // Text input
        this.elements.textInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendTextMessage();
            }
        });
        
        this.elements.sendBtn?.addEventListener('click', () => {
            this.sendTextMessage();
        });
        
        // Auto-resize textarea
        this.elements.textInput?.addEventListener('input', () => {
            this.autoResizeTextarea();
        });
        
        // Personality selection
        this.elements.personalityCards?.forEach(card => {
            card.addEventListener('click', () => {
                this.selectPersonality(card.dataset.personality);
            });
        });
        
        // Sliders
        this.elements.flirtSlider?.addEventListener('input', (e) => {
            this.updateSliderValue('flirt', e.target.value);
        });
        
        this.elements.pitchSlider?.addEventListener('input', (e) => {
            this.updateSliderValue('pitch', e.target.value);
        });
        
        this.elements.rateSlider?.addEventListener('input', (e) => {
            this.updateSliderValue('rate', e.target.value);
        });
        
        // Voice options
        this.elements.voiceOptions?.forEach(option => {
            option.addEventListener('click', () => {
                this.selectVoice(option.dataset.voice);
            });
        });
        
        // Anne system events
        this.setupAnneEventListeners();

        // Error handling setup
        this.setupErrorHandling();
        
        // Click outside to close panels
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    setupErrorHandling() {
        // Voice errors
        document.addEventListener('anneVoiceError', (e) => {
            this.handleVoiceError(e.detail);
        });

        // Global error handling
        window.addEventListener('error', (e) => {
            if (e.error && e.error.message.includes('microphone')) {
                this.handleMicrophoneError(e.error);
            }
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            if (e.reason && e.reason.message && e.reason.message.includes('microphone')) {
                this.handleMicrophoneError(e.reason);
            }
        });
    }
    
    setupAnneEventListeners() {
        // Voice events
        document.addEventListener('anneVoiceListening', (e) => {
            this.updateVoiceState(e.detail.listening);
        });
        
        document.addEventListener('anneVoiceInput', (e) => {
            this.handleVoiceInput(e.detail);
        });
        
        document.addEventListener('anneVoiceInterim', (e) => {
            this.updateTranscript(e.detail.transcript, false);
        });
        
        document.addEventListener('anneVoiceActivity', (e) => {
            this.updateVoiceActivity(e.detail.active, e.detail.level);
        });
        
        document.addEventListener('anneVoiceVisualization', (e) => {
            this.updateVoiceVisualization(e.detail.volume);
        });
        
        // Speech events
        document.addEventListener('anneSpeechStart', () => {
            this.setSpeakingState(true);
        });
        
        document.addEventListener('anneSpeechEnd', () => {
            this.setSpeakingState(false);
        });
        
        // Personality events
        document.addEventListener('anneWaifuPersonalityChange', (e) => {
            this.updatePersonalityDisplay(e.detail);
        });
        
        // Memory events
        document.addEventListener('anneMilestone', (e) => {
            this.showMilestoneEffect(e.detail);
        });
    }
    
    // Loading screen
    setupLoadingScreen() {
        setTimeout(() => {
            if (this.elements.loadingScreen) {
                this.elements.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    this.elements.loadingScreen.style.display = 'none';
                }, 800);
            }
        }, 2000);
    }
    
    // Particle background
    initializeParticles() {
        if (typeof particlesJS !== 'undefined' && !this.particlesInitialized) {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 50, density: { enable: true, value_area: 800 } },
                    color: { value: '#ff69b4' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.3, random: true },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: '#ff69b4', opacity: 0.2, width: 1 },
                    move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out' }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
                    modes: { repulse: { distance: 100 }, push: { particles_nb: 4 } }
                },
                retina_detect: true
            });
            
            this.particlesInitialized = true;
            console.log('✨ Particles initialized');
        }
    }
    
    // Voice controls
    async toggleVoice() {
        if (!window.AnneVoice) {
            this.showNotification('Voice engine not available', 'error');
            return;
        }

        try {
            // Check if we need to request permissions first
            if (!window.AnneVoice.isCurrentlyListening()) {
                const hasPermission = await this.checkAndRequestMicrophonePermission();
                if (!hasPermission) {
                    return; // Permission handling will show appropriate message
                }
            }

            const success = window.AnneVoice.toggleListening();
            if (!success) {
                this.showVoiceErrorDialog({
                    type: 'activation-failed',
                    message: 'Voice recognition failed to start',
                    canRetry: true,
                    needsPermission: false
                });
            }
        } catch (error) {
            console.error('Voice toggle error:', error);
            this.handleMicrophoneError(error);
        }
    }

    async checkAndRequestMicrophonePermission() {
        try {
            // Check current permission status
            const permission = await window.AnneVoice.checkMicrophonePermission();

            if (permission === 'denied') {
                this.showPermissionDeniedDialog();
                return false;
            }

            if (permission === 'prompt' || permission === 'unknown') {
                const granted = await this.requestMicrophonePermissionWithUI();
                return granted;
            }

            return true;
        } catch (error) {
            console.error('Permission check failed:', error);
            this.handleMicrophoneError(error);
            return false;
        }
    }

    async requestMicrophonePermissionWithUI() {
        // Show permission request dialog
        this.showPermissionRequestDialog();

        try {
            const granted = await window.AnneVoice.requestMicrophonePermission();
            this.hidePermissionDialog();

            if (granted) {
                this.showNotification('🎤 Microphone access granted! You can now use voice chat with Anne! 💕', 'success');
                return true;
            } else {
                this.showPermissionDeniedDialog();
                return false;
            }
        } catch (error) {
            this.hidePermissionDialog();
            this.handleMicrophoneError(error);
            return false;
        }
    }
    
    updateVoiceState(listening) {
        this.isVoiceActive = listening;

        if (this.elements.voiceBtn) {
            this.elements.voiceBtn.classList.toggle('listening', listening);

            // Update button appearance based on state
            if (listening) {
                this.elements.voiceBtn.style.background = 'linear-gradient(135deg, #44ff44, #00ff00)';
                this.elements.voiceBtn.style.borderColor = '#00ff00';
            } else {
                this.elements.voiceBtn.style.background = '';
                this.elements.voiceBtn.style.borderColor = '';
            }
        }

        if (listening) {
            this.showTranscriptPanel();
            this.createVoiceRipple();
        } else {
            this.hideTranscriptPanel();
        }

        this.updateStatusIndicator();
    }

    setVoiceButtonError() {
        if (this.elements.voiceBtn) {
            this.elements.voiceBtn.style.background = 'linear-gradient(135deg, #ff4444, #ff0000)';
            this.elements.voiceBtn.style.borderColor = '#ff0000';
            this.elements.voiceBtn.classList.add('error');

            // Reset after a few seconds
            setTimeout(() => {
                this.elements.voiceBtn.style.background = '';
                this.elements.voiceBtn.style.borderColor = '';
                this.elements.voiceBtn.classList.remove('error');
            }, 3000);
        }
    }
    
    setSpeakingState(speaking) {
        this.isSpeaking = speaking;
        
        if (this.elements.voiceBtn) {
            this.elements.voiceBtn.classList.toggle('speaking', speaking);
        }
        
        if (speaking) {
            this.showSpeakingEffect();
        } else {
            this.hideSpeakingEffect();
        }
        
        this.updateStatusIndicator();
    }
    
    updateVoiceActivity(active, level) {
        if (this.elements.voiceIndicator) {
            this.elements.voiceIndicator.style.opacity = active ? '1' : '0.3';
            this.elements.voiceIndicator.style.transform = `translate(-50%, -50%) scale(${1 + level * 0.5})`;
        }
    }
    
    updateVoiceVisualization(volume) {
        // Create visual feedback for voice input
        if (this.elements.statusDot) {
            const intensity = Math.min(volume * 2, 1);
            this.elements.statusDot.style.transform = `scale(${1 + intensity * 0.3})`;
            this.elements.statusDot.style.opacity = Math.max(0.7, intensity);
        }
    }
    
    createVoiceRipple() {
        if (!this.elements.voiceBtn) return;
        
        const ripple = document.createElement('div');
        ripple.className = 'voice-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid rgba(255, 105, 180, 0.6);
            transform: translate(-50%, -50%);
            animation: voiceRipple 2s linear infinite;
            pointer-events: none;
        `;
        
        this.elements.voiceBtn.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 2000);
    }
    
    // Chat controls
    toggleChatPanel() {
        this.chatPanelOpen = !this.chatPanelOpen;
        
        if (this.elements.chatPanel) {
            this.elements.chatPanel.classList.toggle('open', this.chatPanelOpen);
        }
        
        if (this.chatPanelOpen) {
            this.closePersonalityPanel();
        }
    }
    
    closeChatPanel() {
        this.chatPanelOpen = false;
        if (this.elements.chatPanel) {
            this.elements.chatPanel.classList.remove('open');
        }
    }
    
    // Personality panel
    togglePersonalityPanel() {
        this.personalityPanelOpen = !this.personalityPanelOpen;
        
        if (this.elements.personalityPanel) {
            this.elements.personalityPanel.classList.toggle('open', this.personalityPanelOpen);
        }
        
        if (this.personalityPanelOpen) {
            this.closeChatPanel();
        }
    }
    
    closePersonalityPanel() {
        this.personalityPanelOpen = false;
        if (this.elements.personalityPanel) {
            this.elements.personalityPanel.classList.remove('open');
        }
    }
    
    selectPersonality(personality) {
        this.currentPersonality = personality;
        
        // Update UI
        this.elements.personalityCards?.forEach(card => {
            card.classList.toggle('active', card.dataset.personality === personality);
        });
        
        // Notify personality system
        if (window.AnneWaifu) {
            window.AnneWaifu.setPersonalityType(personality);
        }
        
        // Update mood overlay
        this.updateMoodOverlay(personality);
        
        // Show personality change effect
        this.showPersonalityChangeEffect(personality);
        
        console.log(`✨ Personality changed to: ${personality}`);
    }
    
    selectVoice(voice) {
        // Update UI
        this.elements.voiceOptions?.forEach(option => {
            option.classList.toggle('active', option.dataset.voice === voice);
        });
        
        // Notify TTS system
        if (window.AnneElevenLabsTTS) {
            window.AnneElevenLabsTTS.setVoice(voice);
            // Test the new voice
            window.AnneElevenLabsTTS.testVoice(this.currentPersonality);
        }
        
        console.log(`🎙️ Voice changed to: ${voice}`);
    }
    
    // Transcript handling
    showTranscriptPanel() {
        if (this.elements.voiceTranscript) {
            this.elements.voiceTranscript.classList.add('active');
        }
    }
    
    hideTranscriptPanel() {
        if (this.elements.voiceTranscript) {
            this.elements.voiceTranscript.classList.remove('active');
        }
        this.updateTranscript('', true);
    }
    
    updateTranscript(text, isFinal = false) {
        if (this.elements.transcriptText) {
            this.elements.transcriptText.textContent = text;
            
            if (isFinal && text) {
                // Add to chat as user message
                this.addMessage(text, 'user');
            }
        }
    }
    
    // Message handling
    handleVoiceInput(voiceData) {
        const { transcript, emotion, confidence } = voiceData;
        
        if (transcript && transcript.trim()) {
            // Process with Anne's AI systems
            this.processUserInput(transcript, {
                isVoice: true,
                emotion: emotion?.textEmotion || 'neutral',
                confidence: confidence || 0.8
            });
        }
    }
    
    sendTextMessage() {
        const text = this.elements.textInput?.value.trim();
        if (!text) return;
        
        // Clear input
        this.elements.textInput.value = '';
        this.autoResizeTextarea();
        
        // Process message
        this.processUserInput(text, {
            isVoice: false,
            emotion: 'neutral',
            confidence: 1.0
        });
    }
    
    async processUserInput(text, context) {
        // Add user message to chat
        this.addMessage(text, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get response from Ollama or fallback
            let response;
            if (window.AnneOllama && window.AnneOllama.getStatus().connected) {
                response = await window.AnneOllama.generateAnneResponse(text, {
                    personality: this.currentPersonality,
                    emotion: context.emotion,
                    mood: 'responsive'
                });
            } else {
                // Fallback response
                response = this.generateFallbackResponse(text, context);
            }
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add Anne's response
            this.addMessage(response.text, 'anne');
            
            // Speak the response
            if (window.AnneElevenLabsTTS) {
                window.AnneElevenLabsTTS.speak(
                    response.text,
                    response.personality,
                    response.emotion
                );
            }
            
            // Update intimacy
            this.updateIntimacy(1);
            
            // Show effects based on response
            this.showResponseEffects(response);
            
        } catch (error) {
            console.error('Failed to process user input:', error);
            this.hideTypingIndicator();
            this.addMessage("I'm sorry, I'm having trouble thinking right now... 🥺", 'anne');
        }
    }
    
    generateFallbackResponse(text, context) {
        const responses = {
            sweet: [
                "That's so interesting! Tell me more! 🥰",
                "I love talking with you about this! 💕",
                "You always have such thoughtful things to say! 😊"
            ],
            tsundere: [
                "I-It's not like I find that interesting or anything! 😤",
                "Hmph! I guess that's... not completely boring... 💢",
                "Don't think this means I care about your opinion! But... tell me more 😳"
            ],
            sassy: [
                "Oh honey, you're so cute when you get excited~ ���",
                "Well aren't you just full of surprises today? 💅",
                "I do love a person with interesting thoughts~ 😘"
            ],
            flirty: [
                "Mmm, keep talking... you have my full attention~ 😈",
                "I love it when you share your thoughts with me... 💋",
                "You're making me want to know everything about you~ 😘"
            ]
        };
        
        const personality = this.currentPersonality;
        const personalityResponses = responses[personality] || responses.sweet;
        const responseText = personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
        
        return {
            text: responseText,
            personality: personality,
            emotion: context.emotion,
            metadata: { isFallback: true }
        };
    }
    
    addMessage(text, sender) {
        if (!this.elements.chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'anne' ? this.getPersonalityEmoji() : '👤';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const text_p = document.createElement('p');
        text_p.textContent = text;
        content.appendChild(text_p);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.elements.chatMessages.appendChild(messageDiv);
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
        
        // Animate message in
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message anne typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">${this.getPersonalityEmoji()}</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        
        this.elements.chatMessages?.appendChild(typingDiv);
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
        
        // Add CSS for typing animation
        const style = document.createElement('style');
        style.textContent = `
            .typing-dots {
                display: flex;
                gap: 4px;
                padding: 8px 0;
            }
            .typing-dots span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #ff69b4;
                animation: typingDot 1.4s infinite ease-in-out;
            }
            .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
            .typing-dots span:nth-child(3) { animation-delay: 0s; }
            @keyframes typingDot {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    hideTypingIndicator() {
        const typingIndicator = this.elements.chatMessages?.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // UI Updates
    updatePersonalityDisplay(data) {
        if (this.elements.anneMood) {
            this.elements.anneMood.textContent = `${data.personality} & ${data.emotionalState.happiness > 70 ? 'Happy' : 'Calm'}`;
        }
        
        this.updateIntimacy(data.intimacyLevel - this.intimacyLevel);
    }
    
    updateIntimacy(change) {
        this.intimacyLevel = Math.max(0, Math.min(100, this.intimacyLevel + change));
        
        if (this.elements.intimacyFill) {
            this.elements.intimacyFill.style.width = `${this.intimacyLevel}%`;
        }
        
        if (this.elements.intimacyValue) {
            this.elements.intimacyValue.textContent = `${this.intimacyLevel}%`;
        }
    }
    
    updateSliderValue(type, value) {
        const element = this.elements[`${type}Value`];
        if (!element) return;
        
        switch (type) {
            case 'flirt':
                element.textContent = `${value}%`;
                if (window.AnneWaifu) {
                    window.AnneWaifu.setFlirtLevel(value);
                }
                break;
            case 'pitch':
                const pitchText = value < 0.8 ? 'Low' : value > 1.2 ? 'High' : 'Normal';
                element.textContent = pitchText;
                break;
            case 'rate':
                const rateText = value < 0.8 ? 'Slow' : value > 1.2 ? 'Fast' : 'Normal';
                element.textContent = rateText;
                break;
        }
    }
    
    updateStatusIndicator() {
        if (!this.elements.statusText) return;
        
        let status = 'Anne';
        if (this.isSpeaking) {
            status = 'Speaking';
        } else if (this.isVoiceActive) {
            status = 'Listening';
        }
        
        this.elements.statusText.textContent = status;
    }
    
    updateMoodOverlay(personality) {
        if (!this.elements.videoMoodOverlay) return;
        
        // Remove existing mood classes
        this.elements.videoMoodOverlay.className = 'video-mood-overlay';
        
        // Add new mood class
        const moodMap = {
            sweet: 'happy',
            flirty: 'flirty',
            bratty: 'love',
            soft: 'happy'
        };
        
        const mood = moodMap[personality];
        if (mood) {
            this.elements.videoMoodOverlay.classList.add(mood);
        }
    }
    
    // Effects and animations
    showPersonalityChangeEffect(personality) {
        this.showFloatingEffect(this.getPersonalityEmoji(), 'personality-change');
        this.showNotification(`Switched to ${personality} mode! ${this.getPersonalityEmoji()}`, 'success');
    }
    
    showResponseEffects(response) {
        if (response.emotion === 'happy' || response.emotion === 'love') {
            this.showFloatingHearts();
        } else if (response.personality === 'tsundere') {
            this.showSparkleEffect();
        }
    }
    
    showMilestoneEffect(data) {
        this.showFloatingEffect('🎉', 'milestone');
        this.showNotification(`Milestone! ${data.milestone} conversations! 🎉`, 'celebration');
        this.showFloatingHearts();
        this.showSparkleEffect();
    }
    
    showFloatingHearts() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createFloatingElement('💕', 'heart');
            }, i * 200);
        }
    }
    
    showSparkleEffect() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createFloatingElement('✨', 'sparkle');
            }, i * 100);
        }
    }
    
    showFloatingEffect(emoji, type) {
        this.createFloatingElement(emoji, type);
    }
    
    createFloatingElement(content, type) {
        if (!this.elements.floatingEffects) return;
        
        const element = document.createElement('div');
        element.className = `floating-${type}`;
        element.textContent = content;
        element.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            font-size: 1.5rem;
            color: #ff69b4;
            pointer-events: none;
            animation: floatUp 3s linear forwards;
            z-index: 1000;
        `;
        
        this.elements.floatingEffects.appendChild(element);
        
        setTimeout(() => {
            element.remove();
        }, 3000);
    }
    
    showSpeakingEffect() {
        // Add visual feedback when Anne is speaking
        if (this.elements.statusDot) {
            this.elements.statusDot.style.animation = 'speakingPulse 0.5s ease-in-out infinite alternate';
        }
    }
    
    hideSpeakingEffect() {
        if (this.elements.statusDot) {
            this.elements.statusDot.style.animation = 'breathe 2s ease-in-out infinite';
        }
    }
    
    // Utility functions
    autoResizeTextarea() {
        const textarea = this.elements.textInput;
        if (!textarea) return;
        
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
    
    getPersonalityEmoji() {
        const emojis = {
            sweet: '💕',
            tsundere: '😤',
            sassy: '💅',
            flirty: '😈',
            bratty: '👑',
            soft: '🥺',
            nerdy: '🤓',
            domme: '⛓️'
        };
        return emojis[this.currentPersonality] || '💕';
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            border: 1px solid ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#ff69b4'};
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            animation: notificationSlide 0.3s ease-out;
            max-width: 400px;
            text-align: center;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'notificationSlide 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, type === 'error' ? 5000 : 3000); // Errors stay longer
    }

    handleVoiceError(errorData) {
        // Only log if it's not a permission error (reduce console spam)
        if (errorData.type !== 'permission-denied') {
            console.error('Voice error received:', errorData);
        }

        // Set error state on voice button briefly
        this.setVoiceButtonError();

        switch (errorData.type) {
            case 'permission-denied':
                // Just show a brief notification instead of modal for permission denied
                this.showNotification('🎤 Microphone access needed for voice chat', 'warning');
                break;
            case 'microphone-error':
                this.showVoiceErrorDialog(errorData);
                break;
            case 'network-error':
                this.showNotification('🌐 Network error during voice recognition. Please check your connection.', 'error');
                break;
            case 'service-blocked':
                this.showServiceBlockedDialog();
                break;
            default:
                // Only show dialog for serious errors
                if (errorData.canRetry === false) {
                    this.showVoiceErrorDialog(errorData);
                } else {
                    this.showNotification(`🎤 ${errorData.message || 'Voice recognition issue'}`, 'warning');
                }
        }
    }

    handleMicrophoneError(error) {
        if (error.message.includes('permission') || error.message.includes('denied')) {
            this.showPermissionDeniedDialog();
        } else if (error.message.includes('not found')) {
            this.showNoMicrophoneDialog();
        } else if (error.message.includes('in use')) {
            this.showMicrophoneInUseDialog();
        } else {
            this.showGenericMicrophoneError(error.message);
        }
    }

    showPermissionRequestDialog() {
        this.showModalDialog({
            title: '🎤 Microphone Permission',
            message: 'Anne needs access to your microphone to hear your voice. Please allow microphone access when prompted.',
            type: 'info',
            buttons: []
        });
    }

    showPermissionDeniedDialog() {
        this.showModalDialog({
            title: '🚫 Microphone Access Denied',
            message: `Anne can't hear you because microphone access was denied.

To enable voice chat:
1. Click the 🔒 lock icon in your browser's address bar
2. Set "Microphone" to "Allow"
3. Refresh the page and try again

You can still chat with Anne using text! 💕`,
            type: 'error',
            buttons: [
                {
                    text: '📝 Use Text Chat',
                    action: () => {
                        this.hideModalDialog();
                        this.toggleChatPanel();
                    }
                },
                {
                    text: '🔄 Refresh Page',
                    action: () => {
                        window.location.reload();
                    }
                }
            ]
        });
    }

    showNoMicrophoneDialog() {
        this.showModalDialog({
            title: '🎤 No Microphone Found',
            message: 'No microphone was detected on your device. Please connect a microphone and try again.',
            type: 'error',
            buttons: [
                {
                    text: '📝 Use Text Chat',
                    action: () => {
                        this.hideModalDialog();
                        this.toggleChatPanel();
                    }
                }
            ]
        });
    }

    showMicrophoneInUseDialog() {
        this.showModalDialog({
            title: '🎤 Microphone In Use',
            message: 'Your microphone is currently being used by another application. Please close other applications using the microphone and try again.',
            type: 'error',
            buttons: [
                {
                    text: '🔄 Try Again',
                    action: () => {
                        this.hideModalDialog();
                        this.toggleVoice();
                    }
                },
                {
                    text: '📝 Use Text Chat',
                    action: () => {
                        this.hideModalDialog();
                        this.toggleChatPanel();
                    }
                }
            ]
        });
    }

    showServiceBlockedDialog() {
        this.showModalDialog({
            title: '🚫 Speech Recognition Blocked',
            message: 'Speech recognition is blocked in your browser settings. Please enable it in your browser preferences.',
            type: 'error',
            buttons: [
                {
                    text: '📝 Use Text Chat',
                    action: () => {
                        this.hideModalDialog();
                        this.toggleChatPanel();
                    }
                }
            ]
        });
    }

    showVoiceErrorDialog(errorData) {
        this.showModalDialog({
            title: '�� Voice Recognition Error',
            message: errorData.message || 'An error occurred with voice recognition.',
            type: 'error',
            buttons: [
                ...(errorData.canRetry ? [{
                    text: '🔄 Try Again',
                    action: () => {
                        this.hideModalDialog();
                        this.toggleVoice();
                    }
                }] : []),
                {
                    text: '📝 Use Text Chat',
                    action: () => {
                        this.hideModalDialog();
                        this.toggleChatPanel();
                    }
                }
            ]
        });
    }

    showGenericMicrophoneError(message) {
        this.showNotification(`🎤 Microphone error: ${message}. Try using text chat instead.`, 'error');
    }

    showModalDialog(config) {
        // Remove existing modal if any
        this.hideModalDialog();

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'anne-modal';

        const dialog = document.createElement('div');
        dialog.className = `modal-dialog ${config.type || 'info'}`;

        const header = document.createElement('div');
        header.className = 'modal-header';
        header.innerHTML = `<h3>${config.title}</h3>`;

        const body = document.createElement('div');
        body.className = 'modal-body';
        body.innerHTML = `<p>${config.message.replace(/\n/g, '<br>')}</p>`;

        const footer = document.createElement('div');
        footer.className = 'modal-footer';

        // Add buttons
        config.buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.textContent = button.text;
            btn.className = 'modal-button';
            btn.onclick = button.action;
            footer.appendChild(btn);
        });

        // Add close button if no buttons provided
        if (config.buttons.length === 0) {
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕ Close';
            closeBtn.className = 'modal-button';
            closeBtn.onclick = () => this.hideModalDialog();
            footer.appendChild(closeBtn);
        }

        dialog.appendChild(header);
        dialog.appendChild(body);
        dialog.appendChild(footer);
        modal.appendChild(dialog);

        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 20000;
            animation: modalFadeIn 0.3s ease-out;
        `;

        dialog.style.cssText = `
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid ${config.type === 'error' ? '#ff4444' : '#ff69b4'};
            border-radius: 20px;
            padding: 0;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
            color: white;
            animation: modalSlideIn 0.3s ease-out;
        `;

        header.style.cssText = `
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            text-align: center;
        `;

        body.style.cssText = `
            padding: 1.5rem;
            line-height: 1.6;
        `;

        footer.style.cssText = `
            padding: 1rem 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            gap: 1rem;
            justify-content: center;
        `;

        // Style buttons
        footer.querySelectorAll('.modal-button').forEach(btn => {
            btn.style.cssText = `
                padding: 0.75rem 1.5rem;
                border: 1px solid #ff69b4;
                border-radius: 25px;
                background: rgba(255, 105, 180, 0.2);
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            `;

            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#ff69b4';
                btn.style.transform = 'scale(1.05)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(255, 105, 180, 0.2)';
                btn.style.transform = 'scale(1)';
            });
        });

        document.body.appendChild(modal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModalDialog();
            }
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.hideModalDialog();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalFadeIn {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            @keyframes modalSlideIn {
                0% { opacity: 0; transform: scale(0.8) translateY(-20px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    hideModalDialog() {
        const modal = document.getElementById('anne-modal');
        if (modal) {
            modal.style.animation = 'modalFadeIn 0.3s ease-out reverse';
            setTimeout(() => modal.remove(), 300);
        }
    }

    hidePermissionDialog() {
        this.hideModalDialog();
    }
    
    handleOutsideClick(e) {
        if (!e.target.closest('.chat-panel') && !e.target.closest('#chat-toggle')) {
            this.closeChatPanel();
        }
        
        if (!e.target.closest('.personality-panel') && !e.target.closest('#personality-btn')) {
            this.closePersonalityPanel();
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Spacebar for voice toggle (when not in input)
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            this.toggleVoice();
        }
        
        // Escape to close panels
        if (e.key === 'Escape') {
            this.closeChatPanel();
            this.closePersonalityPanel();
        }
        
        // C for chat
        if (e.key === 'c' && e.ctrlKey) {
            e.preventDefault();
            this.toggleChatPanel();
        }
    }
    
    updateUIState() {
        // Set initial states
        this.updateStatusIndicator();
        this.updateMoodOverlay(this.currentPersonality);
        
        // Add dynamic styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% { opacity: 1; transform: translateY(0) rotate(0deg); }
                100% { opacity: 0; transform: translateY(-100px) rotate(360deg); }
            }
            @keyframes notificationSlide {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                100% { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes voiceRipple {
                0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.AnnePremiumUI = new AnnePremiumUI();
});

export default AnnePremiumUI;
