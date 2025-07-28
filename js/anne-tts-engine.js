/**
 * Anne TTS Engine - ElevenLabs Integration
 * Handles text-to-speech with personality-based voice switching
 */

class AnneTTSEngine {
    constructor() {
        this.isEnabled = true;
        this.currentPersonality = 'zenith';
        this.isPlaying = false;
        this.audioQueue = [];
        this.currentAudio = null;
        this.volume = 0.8;

        // Smart server URL detection
        this.serverUrl = this.detectServerUrl();
        this.isCloudEnvironment = !this.isLocalEnvironment();

        // Voice cache for better performance
        this.voiceCache = new Map();
        this.maxCacheSize = 50;

        // Initialize audio context for better control
        this.audioContext = null;
        this.initializeAudioContext();

        console.log(`🌐 Environment: ${this.isCloudEnvironment ? 'Cloud' : 'Local'}, TTS Server: ${this.serverUrl}`);
    }

    /**
     * Detect if running in local environment
     */
    isLocalEnvironment() {
        const hostname = window.location.hostname;
        return hostname === 'localhost' ||
               hostname === '127.0.0.1' ||
               hostname.startsWith('192.168.') ||
               hostname.startsWith('10.') ||
               hostname.includes('local');
    }

    /**
     * Detect appropriate server URL based on environment
     */
    detectServerUrl() {
        if (this.isLocalEnvironment()) {
            return 'http://localhost:3001';
        } else {
            // In cloud environment, TTS server would need to be deployed separately
            // For now, return null to indicate TTS is not available
            return null;
        }
    }

    async initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🎤 TTS Audio Context initialized');
        } catch (error) {
            console.warn('Audio Context initialization failed:', error);
        }
    }

    /**
     * Check if TTS service is available
     */
    async checkAvailability() {
        // In cloud environment, TTS is not available by default
        if (this.isCloudEnvironment || !this.serverUrl) {
            console.log('🌐 Cloud environment detected - TTS service disabled');
            return false;
        }

        try {
            // Add timeout for local environment checks
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch(`${this.serverUrl}/api/health`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();
            console.log('🎤 TTS Service Status:', data);
            return data.status === 'ok' && data.elevenlabs_configured;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn('🎤 TTS service connection timeout');
            } else {
                console.warn('���� TTS service not available:', error.message);
            }
            return false;
        }
    }

    /**
     * Set current personality for voice selection
     */
    setPersonality(personality) {
        if (this.currentPersonality !== personality) {
            console.log(`🎭 Voice personality changed: ${this.currentPersonality} → ${personality}`);
            this.currentPersonality = personality;
        }
    }

    /**
     * Enable/disable TTS
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled && this.currentAudio) {
            this.stop();
        }
        console.log(`🎤 TTS ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Set volume (0.0 to 1.0)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
    }

    /**
     * Generate cache key for text and personality
     */
    getCacheKey(text, personality) {
        return `${personality}:${text.substring(0, 100)}`;
    }

    /**
     * Clean cache if it gets too large
     */
    cleanCache() {
        if (this.voiceCache.size > this.maxCacheSize) {
            const keysToDelete = Array.from(this.voiceCache.keys()).slice(0, 10);
            keysToDelete.forEach(key => this.voiceCache.delete(key));
            console.log('🗑️ TTS cache cleaned');
        }
    }

    /**
     * Speak text with current personality
     */
    async speak(text, personality = this.currentPersonality) {
        if (!this.isEnabled || !text || text.trim().length === 0) {
            return false;
        }

        // In cloud environment or when server is unavailable, skip TTS
        if (this.isCloudEnvironment || !this.serverUrl) {
            console.log('🌐 TTS skipped (cloud environment)');
            return false;
        }

        // Clean text for TTS (remove excessive emojis and special chars)
        const cleanText = this.cleanTextForTTS(text);

        if (cleanText.length === 0) {
            return false;
        }

        try {
            // Check cache first
            const cacheKey = this.getCacheKey(cleanText, personality);
            let audioBlob = this.voiceCache.get(cacheKey);

            if (!audioBlob) {
                // Generate new TTS
                console.log(`🎤 Generating TTS for: "${cleanText}" (${personality})`);
                
                const response = await fetch(`${this.serverUrl}/api/tts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: cleanText,
                        personality: personality
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`TTS API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
                }

                audioBlob = await response.blob();
                
                // Cache the audio
                this.voiceCache.set(cacheKey, audioBlob);
                this.cleanCache();
                
                console.log(`✅ TTS generated and cached (${audioBlob.size} bytes)`);
            } else {
                console.log(`📦 Using cached TTS for: "${cleanText}"`);
            }

            // Play the audio
            await this.playAudioBlob(audioBlob);
            return true;

        } catch (error) {
            console.error('TTS Error:', error);
            this.showTTSError(error.message);
            return false;
        }
    }

    /**
     * Clean text for better TTS output
     */
    cleanTextForTTS(text) {
        return text
            // Remove excessive emojis (keep some for emotion)
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]{3,}/gu, '♡')
            // Replace tilde with comma for better speech
            .replace(/~/g, ',')
            // Remove excessive punctuation
            .replace(/[!]{2,}/g, '!')
            .replace(/[?]{2,}/g, '?')
            .replace(/[.]{3,}/g, '...')
            // Trim whitespace
            .trim();
    }

    /**
     * Play audio blob
     */
    async playAudioBlob(audioBlob) {
        return new Promise((resolve, reject) => {
            try {
                // Stop current audio if playing
                this.stop();

                // Create audio URL
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                
                audio.volume = this.volume;
                audio.preload = 'auto';
                
                // Set up event listeners
                audio.onloadeddata = () => {
                    console.log('🎵 Audio loaded, starting playback');
                };
                
                audio.onplay = () => {
                    this.isPlaying = true;
                    this.currentAudio = audio;
                    console.log('🎵 TTS playback started');
                };
                
                audio.onended = () => {
                    this.isPlaying = false;
                    this.currentAudio = null;
                    URL.revokeObjectURL(audioUrl);
                    console.log('🎵 TTS playback finished');
                    resolve();
                };
                
                audio.onerror = (error) => {
                    this.isPlaying = false;
                    this.currentAudio = null;
                    URL.revokeObjectURL(audioUrl);
                    console.error('Audio playback error:', error);
                    reject(new Error('Audio playback failed'));
                };

                // Start playback
                audio.play().catch(error => {
                    console.error('Audio play failed:', error);
                    reject(error);
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Stop current TTS playback
     */
    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        this.isPlaying = false;
    }

    /**
     * Queue text for speaking (useful for multiple messages)
     */
    async queueSpeak(texts, personality = this.currentPersonality) {
        for (const text of texts) {
            if (this.isEnabled) {
                await this.speak(text, personality);
                // Small delay between queued items
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }

    /**
     * Show TTS error to user (integrate with Anne's message system)
     */
    showTTSError(errorMessage) {
        // This will be called from the main script
        if (window.showAnneMessage) {
            window.showAnneMessage("💔 My voice systems are having trouble, darling. I'll speak through text for now!");
        }
        console.error('TTS Error shown to user:', errorMessage);
    }

    /**
     * Test TTS with a sample phrase
     */
    async test() {
        const testPhrases = {
            zenith: "Hello darling, this is my welcoming voice.",
            pixi: "Hey there! This is my playful voice!",
            nova: "I am speaking with confidence and strength.",
            velvet: "Mmm... this is my most seductive tone.",
            blaze: "Hi there cutie, feeling flirty today?",
            aurora: "Greetings, this is my elegant voice."
        };

        for (const [personality, phrase] of Object.entries(testPhrases)) {
            console.log(`Testing ${personality} voice...`);
            await this.speak(phrase, personality);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    /**
     * Get TTS statistics
     */
    getStats() {
        return {
            enabled: this.isEnabled,
            currentPersonality: this.currentPersonality,
            isPlaying: this.isPlaying,
            cacheSize: this.voiceCache.size,
            volume: this.volume
        };
    }
}

// Export for use in main script
window.AnneTTSEngine = AnneTTSEngine;

console.log('🎤 Anne TTS Engine loaded successfully');
