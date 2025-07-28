/**
 * Enhanced Anne Voice Chat System
 * Provides speech-to-text and enhanced voice interaction capabilities
 */

class AnneVoiceChat {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.isSupported = false;
        this.voiceInputBtn = null;
        this.voiceStatusText = null;
        this.chatToggleBtn = null;
        this.chatContent = null;
        this.isMinimized = false;
        
        this.init();
    }

    init() {
        // Initialize speech recognition
        this.initSpeechRecognition();
        
        // Get DOM elements
        this.voiceInputBtn = document.getElementById('voice-input-btn');
        this.voiceStatusText = document.getElementById('voice-status-text');
        this.chatToggleBtn = document.getElementById('chat-toggle-btn');
        this.chatContent = document.getElementById('chat-content');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update UI
        this.updateVoiceStatus();
        
        console.log('🎤 Enhanced Anne Voice Chat System initialized');
    }

    initSpeechRecognition() {
        // Check for speech recognition support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => this.onRecognitionStart();
            this.recognition.onresult = (event) => this.onRecognitionResult(event);
            this.recognition.onend = () => this.onRecognitionEnd();
            this.recognition.onerror = (event) => this.onRecognitionError(event);
            
            this.isSupported = true;
            console.log('🎤 Speech recognition supported and initialized');
        } else {
            this.isSupported = false;
            console.warn('🎤 Speech recognition not supported in this browser');
        }
    }

    setupEventListeners() {
        // Voice input button
        if (this.voiceInputBtn) {
            this.voiceInputBtn.addEventListener('click', () => {
                this.toggleVoiceInput();
            });
            
            // Keyboard support
            this.voiceInputBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleVoiceInput();
                }
            });
        }

        // Chat toggle button
        if (this.chatToggleBtn) {
            this.chatToggleBtn.addEventListener('click', () => {
                this.toggleChatWindow();
            });
        }

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + V to toggle voice input
            if (e.altKey && e.key === 'v') {
                e.preventDefault();
                this.toggleVoiceInput();
            }
            
            // Alt + M to toggle chat window
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                this.toggleChatWindow();
            }
        });
    }

    toggleVoiceInput() {
        if (!this.isSupported) {
            this.showVoiceError('Speech recognition not supported in this browser');
            return;
        }

        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.isSupported || this.isListening) return;

        try {
            this.recognition.start();
            console.log('🎤 Started listening...');
        } catch (error) {
            console.error('🎤 Failed to start speech recognition:', error);
            this.showVoiceError('Failed to start voice recognition');
        }
    }

    stopListening() {
        if (!this.isListening) return;

        try {
            this.recognition.stop();
            console.log('🎤 Stopped listening');
        } catch (error) {
            console.error('🎤 Failed to stop speech recognition:', error);
        }
    }

    onRecognitionStart() {
        this.isListening = true;
        this.updateVoiceButton('recording');
        this.updateVoiceStatus('Listening... Speak now!');
        
        // Add visual feedback
        if (this.voiceInputBtn) {
            this.voiceInputBtn.classList.add('recording', 'listening');
        }
    }

    onRecognitionResult(event) {
        let transcript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            transcript += result[0].transcript;
            
            if (result.isFinal) {
                isFinal = true;
            }
        }

        // Update input field with interim results
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.value = transcript;
        }

        // If final result, process the message
        if (isFinal && transcript.trim()) {
            this.processVoiceMessage(transcript.trim());
        }

        console.log('🎤 Voice transcript:', transcript, 'Final:', isFinal);
    }

    onRecognitionEnd() {
        this.isListening = false;
        this.updateVoiceButton('speak');
        this.updateVoiceStatus('Ready for voice chat');
        
        // Remove visual feedback
        if (this.voiceInputBtn) {
            this.voiceInputBtn.classList.remove('recording', 'listening', 'processing');
        }
    }

    onRecognitionError(event) {
        console.error('🎤 Speech recognition error:', event.error);
        this.isListening = false;
        
        let errorMessage = 'Voice recognition error';
        switch (event.error) {
            case 'no-speech':
                errorMessage = 'No speech detected. Try again!';
                break;
            case 'audio-capture':
                errorMessage = 'Microphone not accessible';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone permission denied';
                break;
            case 'network':
                errorMessage = 'Network error during recognition';
                break;
            default:
                errorMessage = `Recognition error: ${event.error}`;
        }

        this.showVoiceError(errorMessage);
        this.updateVoiceButton('speak');
        this.updateVoiceStatus('Voice recognition error');
        
        // Remove visual feedback
        if (this.voiceInputBtn) {
            this.voiceInputBtn.classList.remove('recording', 'listening', 'processing');
        }
    }

    processVoiceMessage(transcript) {
        console.log('🎤 Processing voice message:', transcript);
        
        // Add processing state
        this.updateVoiceButton('processing');
        this.updateVoiceStatus('Processing voice message...');
        
        // Send the message using existing chat functionality
        if (window.sendMessage || this.sendChatMessage) {
            // Set the input value and trigger send
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                chatInput.value = transcript;
                
                // Trigger send message
                setTimeout(() => {
                    if (window.sendMessage) {
                        window.sendMessage();
                    } else {
                        // Fallback: trigger send button click
                        const sendBtn = document.getElementById('chat-send');
                        if (sendBtn) {
                            sendBtn.click();
                        }
                    }
                }, 100);
            }
        }

        // Show confirmation message
        if (window.showAnneMessage) {
            window.showAnneMessage(`🎤 I heard you say: "${transcript}" - Let me respond to that, darling! 💜`);
        }
    }

    updateVoiceButton(state) {
        if (!this.voiceInputBtn) return;

        const icon = this.voiceInputBtn.querySelector('i');
        const statusSpan = this.voiceInputBtn.querySelector('.voice-status');

        // Reset classes
        this.voiceInputBtn.classList.remove('recording', 'processing', 'listening');

        switch (state) {
            case 'recording':
                this.voiceInputBtn.classList.add('recording');
                if (icon) icon.className = 'fas fa-stop';
                if (statusSpan) statusSpan.textContent = 'Stop';
                break;
            case 'processing':
                this.voiceInputBtn.classList.add('processing');
                if (icon) icon.className = 'fas fa-cog';
                if (statusSpan) statusSpan.textContent = 'Wait';
                break;
            case 'speak':
            default:
                if (icon) icon.className = 'fas fa-microphone';
                if (statusSpan) statusSpan.textContent = 'Speak';
                break;
        }
    }

    updateVoiceStatus(message) {
        if (this.voiceStatusText) {
            this.voiceStatusText.textContent = message;
        }
    }

    showVoiceError(message) {
        console.warn('🎤 Voice error:', message);
        this.updateVoiceStatus(message);
        
        // Show error in chat if available
        if (window.showAnneMessage) {
            window.showAnneMessage(`🎤 Voice Chat: ${message} 💔`);
        }
        
        // Auto-reset status after 3 seconds
        setTimeout(() => {
            this.updateVoiceStatus('Ready for voice chat');
        }, 3000);
    }

    toggleChatWindow() {
        if (!this.chatContent || !this.chatToggleBtn) return;

        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            this.chatContent.classList.add('minimized');
            this.chatToggleBtn.classList.add('minimized');
            this.chatToggleBtn.title = 'Expand Chat Window';
        } else {
            this.chatContent.classList.remove('minimized');
            this.chatToggleBtn.classList.remove('minimized');
            this.chatToggleBtn.title = 'Minimize Chat Window';
        }

        console.log('🎤 Chat window toggled:', this.isMinimized ? 'minimized' : 'expanded');
    }

    // Public API methods
    getVoiceSupport() {
        return {
            supported: this.isSupported,
            listening: this.isListening,
            browser: navigator.userAgent
        };
    }

    forceStopListening() {
        if (this.isListening) {
            this.stopListening();
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.anneVoiceChat = new AnneVoiceChat();
    });
} else {
    window.anneVoiceChat = new AnneVoiceChat();
}

console.log('🎤 Anne Voice Chat module loaded');
