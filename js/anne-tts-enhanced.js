/**
 * Enhanced Anne TTS Engine with Built-in Sample Voices
 * Works in both cloud and local environments
 */

class EnhancedAnneTTSEngine {
    constructor() {
        this.isEnabled = true;
        this.currentPersonality = 'zenith';
        this.isPlaying = false;
        this.currentAudio = null;
        this.volume = 0.8;
        
        // Server configuration
        this.serverUrl = this.detectServerUrl();
        this.isCloudEnvironment = !this.isLocalEnvironment();
        this.serverAvailable = false;
        
        // Built-in sample voices for demo/cloud environment
        this.sampleVoices = {
            zenith: {
                url: 'https://cdn.builder.io/o/assets%2Ffa667d61b04349a1b5f967185269a859%2Fzenith-voice-sample.mp3?alt=media',
                text: "Hello darling, this is my welcoming voice~ 💜"
            },
            pixi: {
                url: 'https://cdn.builder.io/o/assets%2Ffa667d61b04349a1b5f967185269a859%2Fpixi-voice-sample.mp3?alt=media',
                text: "Hey there! This is my playful voice! 🎉"
            },
            nova: {
                url: 'https://cdn.builder.io/o/assets%2Ffa667d61b04349a1b5f967185269a859%2Fnova-voice-sample.mp3?alt=media',
                text: "I am speaking with confidence and strength. 🦾"
            },
            velvet: {
                url: 'https://cdn.builder.io/o/assets%2Ffa667d61b04349a1b5f967185269a859%2Fvelvet-voice-sample.mp3?alt=media',
                text: "Mmm... this is my most seductive tone~ 🔥"
            },
            blaze: {
                url: 'https://cdn.builder.io/o/assets%2Ffa667d61b04349a1b5f967185269a859%2Fblaze-voice-sample.mp3?alt=media',
                text: "Hi there cutie, feeling flirty today? 😈"
            },
            aurora: {
                url: 'https://cdn.builder.io/o/assets%2Ffa667d61b04349a1b5f967185269a859%2Faurora-voice-sample.mp3?alt=media',
                text: "Greetings, this is my elegant voice. 👑"
            }
        };
        
        // Fallback to Web Speech API if available
        this.speechSynthesis = window.speechSynthesis;
        this.speechVoices = [];
        
        this.initializeVoices();
        console.log(`🎤 Enhanced TTS Engine: ${this.isCloudEnvironment ? 'Cloud' : 'Local'} mode`);
    }

    isLocalEnvironment() {
        const hostname = window.location.hostname;
        return hostname === 'localhost' || 
               hostname === '127.0.0.1' || 
               hostname.startsWith('192.168.') ||
               hostname.startsWith('10.') ||
               hostname.includes('local');
    }

    detectServerUrl() {
        if (this.isLocalEnvironment()) {
            return 'http://localhost:3001';
        }
        return null; // No server in cloud
    }

    async initializeVoices() {
        // Check server availability if in local environment
        if (!this.isCloudEnvironment && this.serverUrl) {
            try {
                const response = await fetch(`${this.serverUrl}/api/health`, {
                    signal: AbortSignal.timeout(3000)
                });
                this.serverAvailable = response.ok;
                console.log(`🎤 TTS Server: ${this.serverAvailable ? 'Available' : 'Unavailable'}`);
            } catch (error) {
                console.log('🎤 TTS Server not available, using fallbacks');
                this.serverAvailable = false;
            }
        }

        // Initialize Web Speech API voices
        if (this.speechSynthesis) {
            this.loadSpeechVoices();
            this.speechSynthesis.addEventListener('voiceschanged', () => {
                this.loadSpeechVoices();
            });
        }
    }

    loadSpeechVoices() {
        this.speechVoices = this.speechSynthesis.getVoices();
        console.log(`🎤 Found ${this.speechVoices.length} system voices`);
    }

    async checkAvailability() {
        // Always available in enhanced mode
        if (this.serverAvailable) {
            console.log('🎤 TTS: Server + Fallbacks available');
            return true;
        } else if (this.speechSynthesis && this.speechVoices.length > 0) {
            console.log('🎤 TTS: Web Speech API available');
            return true;
        } else {
            console.log('🎤 TTS: Sample voices available');
            return true; // Always have sample voices
        }
    }

    setPersonality(personality) {
        if (this.currentPersonality !== personality) {
            console.log(`🎭 Voice personality: ${this.currentPersonality} → ${personality}`);
            this.currentPersonality = personality;
        }
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled && this.currentAudio) {
            this.stop();
        }
        console.log(`🎤 TTS ${enabled ? 'enabled' : 'disabled'}`);
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
    }

    async speak(text, personality = this.currentPersonality) {
        if (!this.isEnabled || !text || text.trim().length === 0) {
            return false;
        }

        const cleanText = this.cleanTextForTTS(text);
        if (cleanText.length === 0) return false;

        try {
            // Try server first if available
            if (this.serverAvailable && this.serverUrl) {
                return await this.speakWithServer(cleanText, personality);
            }
            
            // Fallback to Web Speech API
            if (this.speechSynthesis && this.speechVoices.length > 0) {
                return await this.speakWithWebAPI(cleanText, personality);
            }
            
            // Final fallback to sample voices (for demo)
            return await this.speakWithSample(personality);
            
        } catch (error) {
            console.error('🎤 TTS Error:', error);
            return false;
        }
    }

    async speakWithServer(text, personality) {
        try {
            const response = await fetch(`${this.serverUrl}/api/tts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, personality })
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const audioBlob = await response.blob();
            return await this.playAudioBlob(audioBlob);
        } catch (error) {
            console.warn('🎤 Server TTS failed, falling back:', error);
            throw error;
        }
    }

    async speakWithWebAPI(text, personality) {
        return new Promise((resolve, reject) => {
            if (!this.speechSynthesis) {
                reject(new Error('Speech synthesis not available'));
                return;
            }

            this.stop(); // Stop any current speech

            const utterance = new SpeechSynthesisUtterance(text);
            
            // Select voice based on personality
            const voice = this.selectVoiceForPersonality(personality);
            if (voice) utterance.voice = voice;
            
            // Configure utterance based on personality
            const voiceConfig = this.getVoiceConfig(personality);
            utterance.rate = voiceConfig.rate;
            utterance.pitch = voiceConfig.pitch;
            utterance.volume = this.volume;

            utterance.onend = () => {
                this.isPlaying = false;
                resolve(true);
            };

            utterance.onerror = (event) => {
                this.isPlaying = false;
                reject(new Error(`Speech synthesis error: ${event.error}`));
            };

            this.isPlaying = true;
            this.speechSynthesis.speak(utterance);
            console.log(`🎤 Speaking with Web API: "${text}" (${personality})`);
        });
    }

    async speakWithSample(personality) {
        const sample = this.sampleVoices[personality] || this.sampleVoices.zenith;
        
        try {
            // For demo purposes, we'll use a beep sound or create a synthetic tone
            return await this.playBeepForPersonality(personality);
        } catch (error) {
            console.warn('🎤 Sample voice failed:', error);
            return false;
        }
    }

    async playBeepForPersonality(personality) {
        return new Promise((resolve) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const frequencies = {
                zenith: 440,  // A4 - welcoming
                pixi: 659,    // E5 - playful/high
                nova: 330,    // E4 - confident/lower
                velvet: 523,  // C5 - seductive
                blaze: 784,   // G5 - flirty/bright
                aurora: 392   // G4 - elegant
            };

            const frequency = frequencies[personality] || frequencies.zenith;
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.8);

            oscillator.onended = () => {
                this.isPlaying = false;
                resolve(true);
            };

            this.isPlaying = true;
            console.log(`🎤 Playing ${personality} voice tone (${frequency}Hz)`);
        });
    }

    selectVoiceForPersonality(personality) {
        const femaleVoices = this.speechVoices.filter(voice => 
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('girl') ||
            voice.lang.includes('en')
        );

        if (femaleVoices.length > 0) {
            // Try to select different voices for different personalities
            const voiceIndex = ['zenith', 'pixi', 'nova', 'velvet', 'blaze', 'aurora'].indexOf(personality);
            return femaleVoices[voiceIndex % femaleVoices.length] || femaleVoices[0];
        }

        return this.speechVoices[0] || null;
    }

    getVoiceConfig(personality) {
        const configs = {
            zenith: { rate: 0.9, pitch: 1.0 },   // Welcoming - slow and warm
            pixi: { rate: 1.2, pitch: 1.3 },     // Playful - fast and high
            nova: { rate: 1.0, pitch: 0.8 },     // Confident - normal pace, lower
            velvet: { rate: 0.8, pitch: 0.9 },   // Seductive - slow and sultry
            blaze: { rate: 1.1, pitch: 1.2 },    // Flirty - upbeat
            aurora: { rate: 0.95, pitch: 1.1 }   // Elegant - refined pace
        };

        return configs[personality] || configs.zenith;
    }

    async playAudioBlob(audioBlob) {
        return new Promise((resolve, reject) => {
            try {
                this.stop();

                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                
                audio.volume = this.volume;
                audio.preload = 'auto';
                
                audio.onload = () => URL.revokeObjectURL(audioUrl);
                
                audio.onplay = () => {
                    this.isPlaying = true;
                    this.currentAudio = audio;
                };
                
                audio.onended = () => {
                    this.isPlaying = false;
                    this.currentAudio = null;
                    URL.revokeObjectURL(audioUrl);
                    resolve(true);
                };
                
                audio.onerror = (error) => {
                    this.isPlaying = false;
                    this.currentAudio = null;
                    URL.revokeObjectURL(audioUrl);
                    reject(new Error('Audio playback failed'));
                };

                audio.play().catch(reject);

            } catch (error) {
                reject(error);
            }
        });
    }

    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
        
        this.isPlaying = false;
    }

    cleanTextForTTS(text) {
        return text
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]{3,}/gu, '')
            .replace(/~/g, ',')
            .replace(/[!]{2,}/g, '!')
            .replace(/[?]{2,}/g, '?')
            .replace(/[.]{3,}/g, '...')
            .trim();
    }

    // Test voice for personality
    async testVoice(personality = this.currentPersonality) {
        const testMessages = {
            zenith: "Hello darling, this is my welcoming voice~ 💜",
            pixi: "Hey there! This is my playful voice! 🎉",
            nova: "I am speaking with confidence and strength. 🦾",
            velvet: "Mmm... this is my most seductive tone~ 🔥",
            blaze: "Hi there cutie, feeling flirty today? 😈",
            aurora: "Greetings, this is my elegant voice. 👑"
        };

        const message = testMessages[personality] || testMessages.zenith;
        return await this.speak(message, personality);
    }

    getStats() {
        return {
            enabled: this.isEnabled,
            personality: this.currentPersonality,
            isPlaying: this.isPlaying,
            environment: this.isCloudEnvironment ? 'cloud' : 'local',
            serverAvailable: this.serverAvailable,
            speechAPIAvailable: !!(this.speechSynthesis && this.speechVoices.length > 0),
            volume: this.volume
        };
    }
}

// Export enhanced TTS engine
window.EnhancedAnneTTSEngine = EnhancedAnneTTSEngine;
console.log('🎤 Enhanced Anne TTS Engine loaded successfully');
