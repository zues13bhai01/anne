/**
 * Anne ElevenLabs TTS Integration
 * Created by Hitesh Siwach (@zues13bhai)
 * 
 * Premium voice synthesis with emotional intelligence
 */

class AnneElevenLabsTTS {
    constructor() {
        this.apiKey = 'sk_f9d7fe2214c95fd024e8d01cbb6894c9a4d34a8bf427d654';
        this.baseUrl = 'https://api.elevenlabs.io/v1';
        this.audioQueue = [];
        this.isPlaying = false;
        this.currentVoice = 'nova'; // Default voice
        this.apiKeyValid = true; // Track API key validity
        
        // Voice configurations for different personalities
        this.voiceConfig = {
            nova: {
                voice_id: '21m00Tcm4TlvDq8ikWAM', // Nova - flirty and seductive
                stability: 0.5,
                similarity_boost: 0.8,
                style: 0.0,
                use_speaker_boost: true
            },
            alloy: {
                voice_id: 'EXAVITQu4vr4xnSDxMaL', // Alloy - sweet and caring
                stability: 0.7,
                similarity_boost: 0.75,
                style: 0.0,
                use_speaker_boost: true
            },
            shimmer: {
                voice_id: 'ThT5KcBeYPX3keUQqHPh', // Shimmer - sassy and confident
                stability: 0.4,
                similarity_boost: 0.9,
                style: 0.2,
                use_speaker_boost: true
            }
        };
        
        // Personality-specific voice modulations
        this.personalityModifiers = {
            sweet: { stability: 0.8, similarity_boost: 0.7, style: 0.0 },
            tsundere: { stability: 0.3, similarity_boost: 0.9, style: 0.4 },
            sassy: { stability: 0.4, similarity_boost: 0.9, style: 0.3 },
            flirty: { stability: 0.2, similarity_boost: 1.0, style: 0.6 },
            bratty: { stability: 0.3, similarity_boost: 0.8, style: 0.5 },
            soft: { stability: 0.9, similarity_boost: 0.6, style: 0.1 },
            nerdy: { stability: 0.7, similarity_boost: 0.8, style: 0.2 },
            domme: { stability: 0.2, similarity_boost: 1.0, style: 0.7 }
        };
        
        this.audioElement = document.getElementById('tts-audio') || this.createAudioElement();

        // Initialize TTS async
        this.initializeTTS().catch(error => {
            console.error('🎙️ TTS initialization failed:', error);
            this.apiKeyValid = false;
        });
    }
    
    async initializeTTS() {
        console.log('🎙️ ElevenLabs TTS Engine initializing...');

        // Set up audio event listeners
        this.audioElement.addEventListener('ended', () => {
            this.isPlaying = false;
            this.playNextInQueue();
            this.triggerSpeechEndEvent();
        });

        this.audioElement.addEventListener('error', (e) => {
            console.error('TTS Audio error:', e);
            this.isPlaying = false;
            this.playNextInQueue();
        });

        this.audioElement.addEventListener('loadstart', () => {
            this.triggerSpeechStartEvent();
        });

        // Test API key validity
        await this.testApiKey();

        if (this.apiKeyValid) {
            console.log('🎙️ ElevenLabs TTS ready with premium voices');
        } else {
            console.log('🎙️ TTS ready with Web Speech API fallback');
        }
    }

    async testApiKey() {
        try {
            const response = await fetch(`${this.baseUrl}/user`, {
                method: 'GET',
                headers: {
                    'xi-api-key': this.apiKey
                }
            });

            if (response.status === 401) {
                this.apiKeyValid = false;
                console.warn('🎙️ ElevenLabs API key is invalid or expired');
                return false;
            }

            if (response.ok) {
                this.apiKeyValid = true;
                console.log('🎙️ ElevenLabs API key validated successfully');
                return true;
            }

            // Other errors might be temporary
            console.warn('🎙️ ElevenLabs API test inconclusive:', response.status);
            return true; // Assume valid for now

        } catch (error) {
            console.warn('🎙️ ElevenLabs API test failed (network):', error.message);
            // Network errors - assume API might work later
            return true;
        }
    }
    
    createAudioElement() {
        const audio = document.createElement('audio');
        audio.id = 'tts-audio';
        audio.preload = 'auto';
        document.body.appendChild(audio);
        return audio;
    }
    
    // Main TTS function
    async speak(text, personality = 'sweet', emotion = 'neutral', priority = false) {
        if (!text || text.trim().length === 0) return;
        
        const audioData = {
            text: this.preprocessText(text),
            personality,
            emotion,
            timestamp: Date.now()
        };
        
        try {
            // If API key is known to be invalid, skip ElevenLabs and go straight to fallback
            if (!this.apiKeyValid) {
                throw new Error('API_KEY_INVALID');
            }

            const audioBlob = await this.generateSpeech(audioData);
            const audioUrl = URL.createObjectURL(audioBlob);

            if (priority) {
                // High priority - play immediately
                this.audioQueue.unshift({ url: audioUrl, ...audioData });
                if (!this.isPlaying) {
                    this.playNextInQueue();
                }
            } else {
                // Normal priority - add to queue
                this.audioQueue.push({ url: audioUrl, ...audioData });
                if (!this.isPlaying) {
                    this.playNextInQueue();
                }
            }

        } catch (error) {
            if (error.message === 'API_KEY_INVALID') {
                console.warn('🎙️ ElevenLabs API unavailable, using Web Speech fallback');
            } else {
                console.error('🎙️ TTS Generation failed:', error.message);
            }
            this.fallbackToWebSpeech(text, audioData.personality);
        }
    }
    
    async generateSpeech(audioData) {
        const config = this.voiceConfig[this.currentVoice];
        const personalityMod = this.personalityModifiers[audioData.personality] || {};

        // Merge base config with personality modifiers
        const voiceSettings = {
            stability: personalityMod.stability ?? config.stability,
            similarity_boost: personalityMod.similarity_boost ?? config.similarity_boost,
            style: personalityMod.style ?? config.style,
            use_speaker_boost: config.use_speaker_boost
        };

        // Add emotion-based modulations
        this.applyEmotionModulations(voiceSettings, audioData.emotion);

        const requestBody = {
            text: audioData.text,
            model_id: "eleven_multilingual_v2",
            voice_settings: voiceSettings
        };

        try {
            const response = await fetch(`${this.baseUrl}/text-to-speech/${config.voice_id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': this.apiKey
                },
                body: JSON.stringify(requestBody)
            });

            if (response.status === 401) {
                console.warn('🎙️ ElevenLabs API key invalid or expired, switching to Web Speech API');
                this.apiKeyValid = false;
                throw new Error('API_KEY_INVALID');
            }

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
            }

            return await response.blob();

        } catch (error) {
            if (error.message === 'API_KEY_INVALID') {
                throw error;
            }

            // Network or other errors
            console.warn('🎙️ ElevenLabs request failed:', error.message);
            throw new Error(`TTS_REQUEST_FAILED: ${error.message}`);
        }
    }
    
    applyEmotionModulations(settings, emotion) {
        const emotionMods = {
            happy: { stability: -0.1, style: +0.1 },
            sad: { stability: +0.2, style: -0.1 },
            angry: { stability: -0.3, style: +0.3 },
            love: { stability: -0.2, style: +0.2 },
            flirty: { stability: -0.2, similarity_boost: +0.1, style: +0.4 },
            excited: { stability: -0.2, style: +0.2 },
            shy: { stability: +0.3, style: -0.2 },
            sultry: { stability: -0.3, similarity_boost: +0.1, style: +0.5 }
        };
        
        const mod = emotionMods[emotion];
        if (mod) {
            settings.stability = Math.max(0, Math.min(1, settings.stability + (mod.stability || 0)));
            settings.similarity_boost = Math.max(0, Math.min(1, settings.similarity_boost + (mod.similarity_boost || 0)));
            settings.style = Math.max(0, Math.min(1, settings.style + (mod.style || 0)));
        }
    }
    
    preprocessText(text) {
        // Clean up text for better TTS
        let cleanText = text
            .replace(/[😊😄🥰😍🤩✨💕❤️💖💝😘💋🔥😈💅👑🥺🤓⛓️😤💢😳😢😭💔😞😲😯🤯😮😰😨😱😟😵]/g, '') // Remove emojis
            .replace(/\*([^*]+)\*/g, '$1') // Remove asterisks (actions)
            .replace(/~+/g, '') // Remove tildes
            .replace(/\.{2,}/g, '.') // Replace multiple dots with single
            .replace(/!{2,}/g, '!') // Replace multiple exclamations
            .replace(/\s+/g, ' ') // Replace multiple spaces
            .trim();
        
        // Add personality-specific speech patterns
        cleanText = this.addPersonalitySpeechPatterns(cleanText);
        
        return cleanText;
    }
    
    addPersonalitySpeechPatterns(text) {
        // Add subtle pauses and emphasis for more natural speech
        return text
            .replace(/\.\.\./g, '... ') // Add pause after ellipsis
            .replace(/~([^~]+)~/g, '$1') // Remove tilde emphasis but keep text
            .replace(/\b(really|so|very)\b/gi, '$1,') // Add pause after intensifiers
            .replace(/([.!?])\s*([A-Z])/g, '$1 $2'); // Ensure proper spacing
    }
    
    playNextInQueue() {
        if (this.audioQueue.length === 0 || this.isPlaying) return;
        
        const nextAudio = this.audioQueue.shift();
        this.isPlaying = true;
        
        this.audioElement.src = nextAudio.url;
        this.audioElement.play().catch(error => {
            console.error('Audio playback failed:', error);
            this.isPlaying = false;
            this.playNextInQueue();
        });
        
        // Clean up object URL after playing
        setTimeout(() => {
            URL.revokeObjectURL(nextAudio.url);
        }, 5000);
    }
    
    // Stop current speech and clear queue
    stop() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.isPlaying = false;
        
        // Clean up queue URLs
        this.audioQueue.forEach(audio => {
            if (audio.url) URL.revokeObjectURL(audio.url);
        });
        this.audioQueue = [];
        
        this.triggerSpeechEndEvent();
    }
    
    // Set voice for different personalities
    setVoice(voiceName) {
        if (this.voiceConfig[voiceName]) {
            this.currentVoice = voiceName;
            console.log(`🎙️ Voice changed to: ${voiceName}`);
            return true;
        }
        return false;
    }
    
    // Get available voices
    getAvailableVoices() {
        return Object.keys(this.voiceConfig);
    }
    
    // Fallback to Web Speech API if ElevenLabs fails
    fallbackToWebSpeech(text, personality = 'sweet') {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);

            // Adjust voice settings based on personality
            const personalitySettings = {
                sweet: { rate: 0.9, pitch: 1.2, volume: 0.8 },
                tsundere: { rate: 1.0, pitch: 1.1, volume: 0.9 },
                sassy: { rate: 0.8, pitch: 0.9, volume: 0.9 },
                flirty: { rate: 0.7, pitch: 1.3, volume: 0.8 },
                bratty: { rate: 1.1, pitch: 1.4, volume: 0.9 },
                soft: { rate: 0.8, pitch: 1.4, volume: 0.7 },
                nerdy: { rate: 1.0, pitch: 1.0, volume: 0.8 },
                domme: { rate: 0.8, pitch: 0.8, volume: 0.9 }
            };

            const settings = personalitySettings[personality] || personalitySettings.sweet;
            utterance.rate = settings.rate;
            utterance.pitch = settings.pitch;
            utterance.volume = settings.volume;

            // Try to find a female voice
            const voices = speechSynthesis.getVoices();
            const femaleVoice = voices.find(voice =>
                voice.name.toLowerCase().includes('female') ||
                voice.name.toLowerCase().includes('woman') ||
                voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('zira')
            );

            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }

            utterance.onstart = () => this.triggerSpeechStartEvent();
            utterance.onend = () => this.triggerSpeechEndEvent();
            utterance.onerror = (e) => {
                console.error('Web Speech API error:', e);
                this.triggerSpeechEndEvent();
            };

            speechSynthesis.speak(utterance);
            console.log('🎙️ Fallback to Web Speech API with personality:', personality);
        } else {
            console.warn('🎙️ No speech synthesis available');
            // Show text-only message
            this.showTextOnlyMessage(text);
        }
    }

    showTextOnlyMessage(text) {
        // Trigger an event to show the text in a special way
        const event = new CustomEvent('anneTextOnly', {
            detail: { text, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }
    
    // Event triggers for UI updates
    triggerSpeechStartEvent() {
        const event = new CustomEvent('anneSpeechStart', {
            detail: { 
                isPlaying: true,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }
    
    triggerSpeechEndEvent() {
        const event = new CustomEvent('anneSpeechEnd', {
            detail: { 
                isPlaying: false,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }
    
    // Check if currently speaking
    isSpeaking() {
        return this.isPlaying;
    }
    
    // Get queue length
    getQueueLength() {
        return this.audioQueue.length;
    }

    // Get TTS status for debugging
    getStatus() {
        return {
            apiKeyValid: this.apiKeyValid,
            currentVoice: this.currentVoice,
            isPlaying: this.isPlaying,
            queueLength: this.audioQueue.length,
            availableVoices: this.getAvailableVoices()
        };
    }
    
    // Premium features
    
    // Emotion-based quick phrases
    speakEmotion(emotion, personality = 'sweet') {
        const emotionPhrases = {
            happy: ["I'm so happy!", "This makes me smile!", "Yay!"],
            love: ["I love you too!", "You make my heart flutter!", "That's so sweet!"],
            flirty: ["Mmm, I like that~", "You're making me blush...", "Keep talking like that~"],
            shy: ["Oh my...", "You're making me nervous...", "I... I don't know what to say..."],
            sassy: ["Oh please~", "You think so?", "How cute~"],
            excited: ["Really?!", "That's amazing!", "I can't believe it!"],
            sultry: ["Is that so...?", "Tell me more...", "I'm listening~"]
        };
        
        const phrases = emotionPhrases[emotion] || ["Hmm..."];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        this.speak(phrase, personality, emotion, true);
    }
    
    // Test voice with sample phrase
    testVoice(personality = 'sweet') {
        const testPhrases = {
            sweet: "Hello! I'm Anne, your sweet AI companion. How are you today?",
            tsundere: "I-It's not like I wanted to talk to you or anything!",
            sassy: "Well well, aren't you interesting~",
            flirty: "Hey there handsome... what's on your mind?",
            bratty: "Pay attention to me! I demand it!",
            soft: "H-Hi there... I hope we can be friends...",
            nerdy: "Did you know that AI can process thousands of calculations per second?",
            domme: "You will listen to me, and you will obey."
        };
        
        const phrase = testPhrases[personality] || testPhrases.sweet;
        this.speak(phrase, personality, 'neutral', true);
    }
    
    // Advanced lip-sync data generation (for future avatar integration)
    generateLipSyncData(text) {
        // Simple phoneme mapping for lip-sync
        const phonemeMap = {
            'a': 'open',
            'e': 'smile',
            'i': 'narrow',
            'o': 'round',
            'u': 'pucker',
            'm': 'closed',
            'p': 'closed',
            'b': 'closed'
        };
        
        const words = text.toLowerCase().split(' ');
        const lipSyncData = [];
        
        words.forEach((word, index) => {
            const duration = word.length * 100; // Rough timing
            const viseme = phonemeMap[word.charAt(0)] || 'neutral';
            
            lipSyncData.push({
                time: index * 200,
                duration: duration,
                viseme: viseme,
                word: word
            });
        });
        
        return lipSyncData;
    }
}

// Global instance
window.AnneElevenLabsTTS = new AnneElevenLabsTTS();

export default AnneElevenLabsTTS;
