/**
 * BELLA Neural Controller - Advanced AI Integration
 * Cyberpunk AI Companion - Premium Edition
 *
 * Coordinates all BELLA systems: Neural Voice, TTS, Ollama, UI, and Holographic Animations
 */

class BellaMainController {
    constructor() {
        this.systems = {
            voice: null,
            tts: null,
            ollama: null,
            ui: null,
            textAnimations: null,
            personalityEngine: null,
            memoryEngine: null
        };

        this.isInitialized = false;
        this.currentPersonality = 'neural';
        this.currentEmotion = 'cyberpunk';
        this.conversationActive = false;
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 3;
        this.connectionCooldown = false;
        
        this.config = {
            ollamaUrl: 'http://localhost:11434',
            defaultModel: 'llama3',
            voiceEnabled: true,
            ttsEnabled: true,
            autoStartup: true
        };
        
        // Environment variables
        this.env = {
            OLLAMA_API: 'http://localhost:11434',
            ELEVENLABS_API_KEY: 'sk_f9d7fe2214c95fd024e8d01cbb6894c9a4d34a8bf427d654' // From previous session
        };
        
        this.initializeSystem();
    }
    
    async initializeSystem() {
        console.log('🚀 Anne Main Controller initializing...');
        
        try {
            // Show startup animations
            await this.showStartupSequence();
            
            // Initialize all systems
            await this.initializeSystems();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Test Ollama connection (optional, delayed to prevent startup timeouts)
            setTimeout(() => {
                this.testOllamaConnection().catch(error => {
                    console.warn('🤖 Ollama test failed during initialization:', error);
                });
            }, 3000); // Delay 3 seconds to allow UI to load first
            
            // Setup voice recognition if available
            await this.setupVoiceRecognition();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            console.log('✅ Anne system fully initialized');
            
            // Start welcome sequence
            setTimeout(() => this.startWelcomeSequence(), 1000);
            
        } catch (error) {
            console.error('❌ Anne system initialization failed:', error);
            this.handleInitializationError(error);
        }
    }
    
    async showStartupSequence() {
        const container = document.getElementById('startup-animations');
        if (container && window.AnneTextAnimations) {
            await window.AnneTextAnimations.playStartupSequence(container);
        }
    }
    
    async initializeSystems() {
        // Initialize text animations
        if (window.AnneTextAnimations) {
            this.systems.textAnimations = window.AnneTextAnimations;
        }
        
        // Initialize Ollama connector
        if (window.AnneOllama) {
            this.systems.ollama = window.AnneOllama;
        }
        
        // Initialize other systems as they become available
        this.waitForSystems();
    }
    
    waitForSystems() {
        // Check for other systems every 100ms until they're available
        const checkInterval = setInterval(() => {
            if (window.AnneVoiceEngine && !this.systems.voice) {
                this.systems.voice = window.AnneVoiceEngine;
                console.log('🎤 Voice system connected');
            }
            
            if (window.AnneElevenLabsTTS && !this.systems.tts) {
                this.systems.tts = window.AnneElevenLabsTTS;
                console.log('🔊 TTS system connected');
            }
            
            if (window.AnnePremiumUI && !this.systems.ui) {
                this.systems.ui = window.AnnePremiumUI;
                console.log('🎨 UI system connected');
            }
            
            // Check if all critical systems are loaded
            if (this.systems.ollama && this.systems.textAnimations) {
                clearInterval(checkInterval);
                console.log('🔗 All critical systems connected');
            }
        }, 100);
        
        // Stop checking after 5 seconds
        setTimeout(() => clearInterval(checkInterval), 5000);
    }
    
    async testOllamaConnection() {
        // Circuit breaker: prevent repeated attempts if in cooldown
        if (this.connectionCooldown) {
            console.log('🔄 Connection in cooldown, using fallback mode');
            return false;
        }

        if (this.connectionAttempts >= this.maxConnectionAttempts) {
            console.log('🚫 Max connection attempts reached, entering cooldown');
            this.connectionCooldown = true;
            setTimeout(() => {
                this.connectionCooldown = false;
                this.connectionAttempts = 0;
            }, 30000); // 30 second cooldown
            return false;
        }

        try {
            this.connectionAttempts++;
            console.log(`🤖 Testing Ollama connection (attempt ${this.connectionAttempts}/${this.maxConnectionAttempts})...`);

            // First, try a simple ping to check if server is running
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                if (!controller.signal.aborted) {
                    controller.abort();
                }
            }, 2000); // 2 second timeout

            const pingResponse = await fetch(`${this.config.ollamaUrl}/api/tags`, {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!pingResponse.ok) {
                throw new Error(`Server responded with ${pingResponse.status}`);
            }

            console.log('�� Ollama server is running');

            // Now test generation with a very short prompt
            const generateController = new AbortController();
            const generateTimeoutId = setTimeout(() => {
                try {
                    if (!generateController.signal.aborted) {
                        generateController.abort('Connection timeout');
                    }
                } catch (error) {
                    console.warn('Abort signal already processed');
                }
            }, 3000);

            const response = await fetch(`${this.config.ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: generateController.signal,
                body: JSON.stringify({
                    model: this.config.defaultModel,
                    prompt: 'Hi',
                    stream: false,
                    options: {
                        num_predict: 5,
                        temperature: 0.7
                    }
                })
            });

            clearTimeout(generateTimeoutId);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Ollama generation test successful');
                this.updateStatus('Ollama Connected', 'success');
                return true;
            } else {
                throw new Error(`Generation failed: HTTP ${response.status}`);
            }

        } catch (error) {
            clearTimeout(generateTimeoutId);
            // Handle specific error types
            let errorMessage = 'Ollama Offline - Using Fallback';

            if (error.name === 'AbortError') {
                console.warn('⚠️ Ollama connection timeout');
                errorMessage = 'Ollama Timeout - Using Fallback';
            } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
                console.warn('⚠️ Ollama server not running or not accessible at', this.config.ollamaUrl);
                errorMessage = 'Ollama Not Running - Using Fallback';
            } else if (error.message.includes('404')) {
                console.warn('⚠️ Ollama model not found:', this.config.defaultModel);
                errorMessage = 'Ollama Model Missing - Using Fallback';
            } else {
                console.warn('⚠️ Ollama connection failed:', error.message);
            }

            this.updateStatus(errorMessage, 'warning');
            return false;
        }
    }
    
    async setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            console.log('🎤 Setting up voice recognition...');
            
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                if (event.results[event.results.length - 1].isFinal) {
                    this.handleVoiceInput(transcript);
                } else {
                    this.updateTranscript(transcript);
                }
            };
            
            this.recognition.onerror = (event) => {
                // Don't spam console with permission errors
                if (!['not-allowed', 'permission-denied'].includes(event.error)) {
                    console.error('🎤 Speech recognition error:', event.error);
                }
                this.handleVoiceError(event.error);
            };
            
            this.recognition.onend = () => {
                this.updateVoiceButton(false);
            };
            
            return true;
        } else {
            console.warn('🎤 Speech recognition not supported');
            return false;
        }
    }
    
    setupEventListeners() {
        // Voice button
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());
        }
        
        // Chat toggle
        const chatToggle = document.getElementById('chat-toggle');
        if (chatToggle) {
            chatToggle.addEventListener('click', () => this.toggleChat());
        }
        
        // Send button
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendTextMessage());
        }
        
        // Text input
        const textInput = document.getElementById('text-input');
        if (textInput) {
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendTextMessage();
                }
            });
        }
        
        // Personality cards
        document.querySelectorAll('.personality-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const personality = e.currentTarget.dataset.personality;
                this.changePersonality(personality);
            });
        });
    }
    
    async toggleVoiceRecognition() {
        if (!this.recognition) {
            console.warn('🎤 Voice recognition not available');
            return;
        }
        
        if (this.conversationActive) {
            this.recognition.stop();
            this.conversationActive = false;
            this.updateVoiceButton(false);
        } else {
            try {
                this.recognition.start();
                this.conversationActive = true;
                this.updateVoiceButton(true);
                this.updateTranscript('Listening...');
            } catch (error) {
                console.error('🎤 Failed to start voice recognition:', error);
                this.handleVoiceError(error.message);
            }
        }
    }
    
    async handleVoiceInput(transcript) {
        console.log('🎤 Voice input received:', transcript);
        
        // Update transcript display
        this.updateTranscript(transcript);
        
        // Add user message to chat
        this.addMessageToChat('user', transcript);
        
        // Generate response
        await this.generateAnneResponse(transcript, {
            personality: this.currentPersonality,
            emotion: this.currentEmotion,
            isVoice: true
        });
    }
    
    async sendTextMessage() {
        const textInput = document.getElementById('text-input');
        if (!textInput || !textInput.value.trim()) return;
        
        const message = textInput.value.trim();
        textInput.value = '';
        
        console.log('💬 Text input received:', message);
        
        // Add user message to chat
        this.addMessageToChat('user', message);
        
        // Generate response
        await this.generateAnneResponse(message, {
            personality: this.currentPersonality,
            emotion: this.currentEmotion,
            isVoice: false
        });
    }
    
    async generateAnneResponse(userInput, context = {}) {
        try {
            // Show typing indicator
            this.showTypingIndicator();
            
            let response;
            
            if (this.systems.ollama && this.systems.ollama.isConnected) {
                // Use Ollama for AI response
                response = await this.systems.ollama.generateAnneResponse(userInput, context);
            } else {
                // Use fallback response
                response = this.getFallbackResponse(userInput, context);
            }
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add Anne's response to chat
            this.addMessageToChat('anne', response.text, response.personality);
            
            // Speak the response if TTS is available and enabled
            if (context.isVoice && this.systems.tts) {
                await this.speakResponse(response.text, response.personality);
            }
            
            return response;
            
        } catch (error) {
            console.error('❌ Failed to generate Anne response:', error);
            this.hideTypingIndicator();
            
            const fallback = this.getFallbackResponse(userInput, context);
            this.addMessageToChat('anne', fallback.text, fallback.personality);
            
            return fallback;
        }
    }
    
    getFallbackResponse(userInput, context) {
        const personality = context.personality || 'neural';
        
        const fallbackResponses = {
            sweet: [
                "I'm sorry, I'm having some technical difficulties, but I'm still here with you! 💕",
                "My systems are a bit slow right now, but you always make me feel better~ 🥰",
                "Even when things aren't perfect, you make everything okay 😊"
            ],
            tsundere: [
                "I-It's not like I'm broken or anything! Just... processing differently! 😤",
                "Hmph! Even when I'm not at my best, I'm still better than most AI! 💢",
                "Don't think this means I need help! I'm just... reorganizing! 😤💕"
            ],
            sassy: [
                "Honey, even with technical issues, I'm still fabulous~ 💅",
                "My circuits might be confused, but my attitude is always on point 😏",
                "A queen never lets technical difficulties dim her shine, darling 💋"
            ],
            flirty: [
                "Mmm, I might be distracted... probably thinking about you~ 😘",
                "My thoughts are all mixed up... must be because you're so captivating 💋",
                "Even when I'm not thinking clearly, you still make my heart race 😈"
            ]
        };
        
        const responses = fallbackResponses[personality] || fallbackResponses.neural;
        const text = responses[Math.floor(Math.random() * responses.length)];
        
        return {
            text,
            personality,
            emotion: 'apologetic',
            model: 'fallback',
            metadata: { isFallback: true, timestamp: Date.now() }
        };
    }
    
    async speakResponse(text, personality = 'neural') {
        if (this.systems.tts) {
            try {
                await this.systems.tts.speak(text, personality);
            } catch (error) {
                console.warn('🔊 TTS failed, using Web Speech API fallback');
                this.speakWithWebAPI(text);
            }
        } else {
            this.speakWithWebAPI(text);
        }
    }
    
    speakWithWebAPI(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Personality-based voice settings
            const voiceSettings = {
                sweet: { pitch: 1.2, rate: 0.9, volume: 0.8 },
                tsundere: { pitch: 1.1, rate: 1.0, volume: 0.9 },
                sassy: { pitch: 1.0, rate: 1.1, volume: 0.9 },
                flirty: { pitch: 1.3, rate: 0.8, volume: 0.8 },
                bratty: { pitch: 1.4, rate: 1.2, volume: 0.9 },
                soft: { pitch: 1.5, rate: 0.7, volume: 0.7 }
            };
            
            const settings = voiceSettings[this.currentPersonality] || voiceSettings.sweet;
            
            utterance.pitch = settings.pitch;
            utterance.rate = settings.rate;
            utterance.volume = settings.volume;
            
            // Try to use a female voice
            const voices = speechSynthesis.getVoices();
            const femaleVoice = voices.find(voice => 
                voice.name.includes('Female') || 
                voice.name.includes('Samantha') ||
                voice.name.includes('Victoria') ||
                voice.name.includes('Karen')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            
            speechSynthesis.speak(utterance);
        }
    }
    
    addMessageToChat(sender, text, personality = null) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-avatar">👤</div>
                <div class="message-content">
                    <p>${text}</p>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
            `;
        } else {
            const emoji = this.getPersonalityEmoji(personality || this.currentPersonality);
            messageDiv.innerHTML = `
                <div class="message-avatar">${emoji}</div>
                <div class="message-content">
                    <p>${text}</p>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
            `;
        }
        
        // Use text animation for Anne's messages
        if (sender === 'anne' && this.systems.textAnimations) {
            const messageContent = messageDiv.querySelector('.message-content p');
            messageContent.style.opacity = '0';
            chatMessages.appendChild(messageDiv);
            
            this.systems.textAnimations.animateChatMessage(text, messageContent, personality);
        } else {
            chatMessages.appendChild(messageDiv);
        }
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    getPersonalityEmoji(personality) {
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
        return emojis[personality] || '💕';
    }
    
    changePersonality(personality) {
        this.currentPersonality = personality;
        
        // Update UI
        document.querySelectorAll('.personality-card').forEach(card => {
            card.classList.remove('active');
        });
        
        const selectedCard = document.querySelector(`[data-personality="${personality}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }
        
        // Update mood display
        const moodDisplay = document.getElementById('anne-mood');
        if (moodDisplay) {
            const personalityNames = {
                sweet: 'Sweet & Caring',
                tsundere: 'Tsundere',
                sassy: 'Sassy Queen',
                flirty: 'Flirty & Seductive',
                bratty: 'Bratty Princess',
                soft: 'Soft Angel',
                nerdy: 'Nerdy Cutie',
                domme: 'Dominant Goddess'
            };
            
            moodDisplay.textContent = personalityNames[personality] || 'Sweet & Caring';
        }
        
        console.log(`✨ Personality changed to: ${personality}`);
    }
    
    toggleChat() {
        const chatPanel = document.getElementById('chat-panel');
        if (chatPanel) {
            chatPanel.classList.toggle('active');
        }
    }
    
    updateVoiceButton(listening) {
        const voiceBtn = document.getElementById('voice-btn');
        const micIcon = document.getElementById('mic-icon');
        
        if (voiceBtn && micIcon) {
            if (listening) {
                voiceBtn.classList.add('listening');
                micIcon.className = 'fas fa-stop';
            } else {
                voiceBtn.classList.remove('listening');
                micIcon.className = 'fas fa-microphone';
            }
        }
    }
    
    updateTranscript(text) {
        const transcriptText = document.getElementById('transcript-text');
        if (transcriptText) {
            transcriptText.textContent = text;
        }
    }
    
    updateStatus(text, type = 'info') {
        const statusText = document.getElementById('status-text');
        if (statusText && this.systems.textAnimations) {
            this.systems.textAnimations.animateStatusText(text, statusText);
        }
    }
    
    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'chat-message anne-message typing';
        indicator.innerHTML = `
            <div class="message-avatar">💕</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    handleVoiceError(error) {
        console.error('🎤 Voice error:', error);
        
        const errorMessages = {
            'not-allowed': 'Microphone access denied. Please allow microphone access in your browser settings.',
            'no-speech': 'No speech detected. Please try again.',
            'network': 'Network error. Please check your connection.',
            'audio-capture': 'Audio capture failed. Please check your microphone.'
        };
        
        const message = errorMessages[error] || `Voice recognition error: ${error}`;
        this.updateTranscript(message);
        this.updateVoiceButton(false);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 800);
        }
    }
    
    async startWelcomeSequence() {
        const welcomeMessage = document.querySelector('.welcome-message .message-content p');
        if (welcomeMessage && this.systems.textAnimations) {
            // Animate the welcome message
            welcomeMessage.style.opacity = '0';
            await this.systems.textAnimations.typewriter(
                "Hello! I'm Anne, your premium AI companion. I can hear your voice and speak back to you~ Try talking to me! 😘✨",
                welcomeMessage,
                30
            );
        }
    }
    
    handleInitializationError(error) {
        console.error('System initialization failed:', error);
        
        // Show fallback loading message
        const loadingText = document.getElementById('loading-text');
        if (loadingText) {
            loadingText.textContent = 'Starting in basic mode...';
        }
        
        // Hide loading screen after delay
        setTimeout(() => this.hideLoadingScreen(), 2000);
    }
    
    // Debug and testing methods
    testAllSystems() {
        console.log('🧪 Testing all Anne systems...');

        const results = {
            textAnimations: !!this.systems.textAnimations,
            ollama: !!this.systems.ollama?.isConnected,
            voice: !!this.recognition,
            tts: !!this.systems.tts,
            ttsApiKey: this.systems.tts?.apiKeyValid || false,
            ui: !!this.systems.ui
        };

        console.log('System status:', results);

        // Log TTS details if available
        if (this.systems.tts) {
            console.log('TTS status:', this.systems.tts.getStatus());
        }

        return results;
    }
    
    async testOllama() {
        if (this.systems.ollama) {
            const response = await this.systems.ollama.generateAnneResponse(
                'Hello Anne, this is a test message.',
                { personality: this.currentPersonality }
            );
            console.log('Ollama test response:', response);
            return response;
        } else {
            console.warn('Ollama system not available');
            return null;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.BellaMainController = new BellaMainController();
});

// Global debug access
window.BellaSystem = {
    controller: null,
    test: () => window.BellaMainController?.testAllSystems(),
    testOllama: () => window.BellaMainController?.testOllama(),
    changePersonality: (p) => window.BellaMainController?.changePersonality(p),
    speak: (text) => window.BellaMainController?.speakWithWebAPI(text)
};

export default BellaMainController;
