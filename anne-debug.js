// Debug version of Anne enhanced script with better error handling
console.log('🐛 Anne Debug Script Loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🐛 DOM Content Loaded');

    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('🚨 Global Error:', event.error);
        console.error('🚨 Error details:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    });

    // TTS System with error handling
    let ttsEngine = null;
    let ttsAvailable = false;

    // Safe TTS helper function
    function safeTTSSpeak(text, personality = 'zenith', delay = 0) {
        console.log(`🎤 TTS Request: "${text}" (${personality})`);
        if (ttsEngine && ttsAvailable) {
            if (delay > 0) {
                setTimeout(() => {
                    ttsEngine.speak(text, personality).catch(error => {
                        console.warn('🎤 TTS speak failed:', error);
                    });
                }, delay);
            } else {
                ttsEngine.speak(text, personality).catch(error => {
                    console.warn('🎤 TTS speak failed:', error);
                });
            }
        } else {
            console.log('🎤 TTS not available, skipping speech');
        }
    }

    // Initialize TTS Engine with extensive error handling
    async function initializeTTSEngine() {
        console.log('🎤 Initializing TTS Engine...');
        
        try {
            // Check if TTS engine script is loaded
            if (!window.AnneTTSEngine) {
                console.log('🎤 TTS Engine class not found, attempting to load...');
                await loadScript('js/anne-tts-engine.js');
            }
            
            if (!window.AnneTTSEngine) {
                throw new Error('TTS Engine class still not available after loading script');
            }
            
            console.log('🎤 Creating TTS Engine instance...');
            ttsEngine = new window.AnneTTSEngine();
            console.log('🎤 TTS Engine instance created successfully');
            
            // Check availability with timeout
            console.log('🎤 Checking TTS availability...');
            try {
                const checkPromise = ttsEngine.checkAvailability();
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Availability check timeout')), 5000)
                );
                
                ttsAvailable = await Promise.race([checkPromise, timeoutPromise]);
                console.log(`🎤 TTS Availability check result: ${ttsAvailable}`);
            } catch (availabilityError) {
                console.warn('🎤 TTS availability check failed:', availabilityError);
                ttsAvailable = false;
            }
            
            if (ttsAvailable) {
                console.log('✅ TTS Engine initialized successfully');
                showAnneMessage("My voice systems are online, darling! I can speak to you now~ 💜🎵");
                updateTTSStatus('available');
            } else {
                console.log('⚠️ TTS Engine not available, using text-only mode');
                if (ttsEngine && ttsEngine.isCloudEnvironment) {
                    showAnneMessage("I'm in cloud mode, darling! Text chat is ready~ 💜");
                } else {
                    showAnneMessage("I'm in text-only mode right now, but I'll still chat with you, love! 💜");
                }
                updateTTSStatus('unavailable');
            }
            
        } catch (error) {
            console.error('🚨 TTS initialization failed:', error);
            ttsAvailable = false;
            ttsEngine = null;
            updateTTSStatus('error');
            showAnneMessage("Having some voice system issues, but I'm still here for text chat, darling! 💜");
        }
    }

    // Helper function to load scripts
    function loadScript(src) {
        console.log(`📜 Loading script: ${src}`);
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                console.log(`✅ Script loaded: ${src}`);
                resolve();
            };
            script.onerror = (error) => {
                console.error(`❌ Script load failed: ${src}`, error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    }

    // Update TTS status in UI
    function updateTTSStatus(status) {
        console.log(`🎤 Updating TTS status: ${status}`);
        
        const ttsPanel = document.getElementById('tts-control-panel');
        const ttsIndicator = document.getElementById('tts-indicator');
        const ttsStatusText = document.getElementById('tts-status-text');
        const ttsTestBtn = document.getElementById('tts-test-btn');

        if (!ttsPanel) {
            console.log('⚠️ TTS control panel not found in DOM');
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
                if (ttsIndicator) ttsIndicator.textContent = '⚠���';
                if (ttsStatusText) ttsStatusText.textContent = 'Voice Error';
                if (ttsTestBtn) ttsTestBtn.disabled = true;
                break;
            default:
                if (ttsIndicator) ttsIndicator.textContent = '⏳';
                if (ttsStatusText) ttsStatusText.textContent = 'Loading...';
                if (ttsTestBtn) ttsTestBtn.disabled = true;
        }
    }

    // Simple chat interface
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send');

    // Global function for Anne messages
    window.showAnneMessage = function(text) {
        console.log(`💜 Anne says: ${text}`);
        addMessage(text, false);
    };

    function addMessage(text, isUser = false) {
        if (!chatMessages) {
            console.log('Chat messages container not found');
            return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'anne'}`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = `message-bubble ${isUser ? 'user' : 'anne'}`;
        bubbleDiv.textContent = text;
        
        messageDiv.appendChild(bubbleDiv);
        chatMessages.appendChild(messageDiv);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        chatInput.value = '';

        // Simple response
        const responses = [
            "Thank you for your message, darling! 💜",
            "I love chatting with you, sweetheart~ ✨",
            "You're so wonderful to talk to, my love! 💕",
            "I'm always here for you, darling~ 💖"
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        setTimeout(() => {
            showAnneMessage(response);
            safeTTSSpeak(response, 'zenith', 500);
        }, 1000);
    }

    // Event listeners
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Initialize everything
    console.log('🚀 Starting Anne initialization...');
    
    setTimeout(() => {
        initializeTTSEngine();
        showAnneMessage("Hello darling! I'm Anne, ready to chat with you~ 💜");
    }, 1000);

    console.log('🐛 Anne Debug Script Loaded Successfully');
});
