/**
 * Anne Premium Voice Recognition Engine
 * Created by Hitesh Siwach (@zues13bhai)
 * 
 * Advanced voice input with emotion detection and context awareness
 */

class AnneVoiceEngine {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.mediaRecorder = null;
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.isInitialized = false;
        
        // Voice recognition settings
        this.language = 'en-US';
        this.continuous = true;
        this.interimResults = true;
        this.maxAlternatives = 3;
        
        // Audio processing
        this.audioChunks = [];
        this.silenceThreshold = 0.01;
        this.silenceDelay = 2000; // 2 seconds of silence before processing
        this.silenceTimer = null;
        
        // Hotword detection
        this.hotwords = ['hey anne', 'anne', 'hello anne'];
        this.isHotwordActive = true;
        
        // Voice activity detection
        this.vadThreshold = 0.02;
        this.vadConsecutiveFrames = 10;
        this.vadCurrentFrames = 0;
        
        // Emotion detection in voice
        this.emotionAnalysis = {
            enabled: true,
            features: ['pitch', 'energy', 'tempo', 'formants']
        };
        
        this.initializeVoiceEngine();
    }
    
    async initializeVoiceEngine() {
        console.log('🎤 Anne Voice Engine initializing...');

        try {
            // Initialize Web Speech API first
            await this.initializeWebSpeech();

            // Check permissions without requesting microphone access yet
            const permission = await this.checkMicrophonePermission();

            if (permission === 'granted') {
                // Only initialize audio context if we have permission
                await this.initializeAudioContext();
            } else {
                console.log('🎤 Microphone access not granted yet - will request when needed');
            }

            // Set up event listeners
            this.setupEventListeners();

            this.isInitialized = true;
            console.log('🎤 Voice Engine ready');

        } catch (error) {
            console.error('Voice Engine initialization failed:', error);
            this.fallbackToBasicMode();
        }
    }
    
    async initializeWebSpeech() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            throw new Error('Speech Recognition not supported');
        }
        
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = this.continuous;
        this.recognition.lang = this.language;
        this.recognition.interimResults = this.interimResults;
        this.recognition.maxAlternatives = this.maxAlternatives;
        
        // Event handlers
        this.recognition.onstart = () => {
            console.log('🎤 Voice recognition started');
            this.triggerListeningEvent(true);
        };
        
        this.recognition.onend = () => {
            console.log('���� Voice recognition ended');
            this.isListening = false;
            this.triggerListeningEvent(false);
            
            // Auto-restart if still supposed to be listening
            if (this.shouldRestart) {
                setTimeout(() => this.startListening(), 100);
            }
        };
        
        this.recognition.onresult = (event) => {
            this.handleSpeechResult(event);
        };
        
        this.recognition.onerror = (event) => {
            // Don't spam console with permission errors
            if (!['not-allowed', 'permission-denied'].includes(event.error)) {
                console.error('🎤 Speech recognition error:', event.error);
            }
            this.handleSpeechError(event.error);

            // Auto-restart on certain errors (but not permission errors)
            if (this.shouldRestart && !['not-allowed', 'permission-denied'].includes(event.error)) {
                setTimeout(() => {
                    if (this.shouldRestart) {
                        this.startListening();
                    }
                }, 1000);
            }
        };
        
        this.recognition.onspeechstart = () => {
            this.triggerSpeechDetectedEvent(true);
        };
        
        this.recognition.onspeechend = () => {
            this.triggerSpeechDetectedEvent(false);
        };
    }
    
    async initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Check if getUserMedia is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia not supported in this browser');
            }

            // First check current permission status
            const permission = await this.checkMicrophonePermission();
            console.log('🎤 Microphone permission status:', permission);

            if (permission === 'denied') {
                console.log('🎤 Microphone access was previously denied - will request when needed');
                return; // Don't throw error, just skip audio context setup
            }

            // Only request microphone access if permission is already granted
            if (permission === 'granted') {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        sampleRate: 44100
                    }
                }).catch(error => {
                    console.error('getUserMedia failed:', error);
                    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                        throw new Error('microphone-permission-denied');
                    } else if (error.name === 'NotFoundError') {
                        throw new Error('microphone-not-found');
                    } else if (error.name === 'NotReadableError') {
                        throw new Error('microphone-in-use');
                    } else {
                        throw new Error('microphone-access-failed');
                    }
                });

                // Set up audio analysis
                this.microphone = this.audioContext.createMediaStreamSource(stream);
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 2048;
                this.analyser.smoothingTimeConstant = 0.8;

                this.microphone.connect(this.analyser);

                // Set up media recorder for advanced processing
                this.mediaRecorder = new MediaRecorder(stream, {
                    mimeType: MediaRecorder.isTypeSupported('audio/webm; codecs=opus')
                        ? 'audio/webm; codecs=opus'
                        : 'audio/webm'
                });

                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        this.audioChunks.push(event.data);
                    }
                };

                this.mediaRecorder.onstop = () => {
                    this.processAudioChunks();
                };

                console.log('🎤 Audio context initialized with advanced features');
            } else {
                console.log('🎤 Microphone permission pending - audio features will be limited');
            }
            
        } catch (error) {
            console.warn('Advanced audio features not available:', error);
            // Re-throw permission errors for proper handling
            if (error.message.includes('permission') || error.message.includes('denied')) {
                throw error;
            }
        }
    }

    async checkMicrophonePermission() {
        try {
            if ('permissions' in navigator) {
                const permission = await navigator.permissions.query({ name: 'microphone' });
                return permission.state; // 'granted', 'denied', or 'prompt'
            }
            return 'unknown';
        } catch (error) {
            console.warn('Permission API not available:', error);
            return 'unknown';
        }
    }

    async requestMicrophonePermission() {
        try {
            // This will trigger a permission prompt
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Stop the stream immediately, we just wanted to get permission
            stream.getTracks().forEach(track => track.stop());

            console.log('🎤 Microphone permission granted');
            return true;
        } catch (error) {
            console.error('🎤 Microphone permission request failed:', error);
            return false;
        }
    }
    
    setupEventListeners() {
        // Listen for Anne's speech events to pause voice recognition
        document.addEventListener('anneSpeechStart', () => {
            if (this.isListening) {
                this.pauseListening();
            }
        });
        
        document.addEventListener('anneSpeechEnd', () => {
            if (!this.isListening && this.shouldRestart) {
                setTimeout(() => this.resumeListening(), 1000);
            }
        });
        
        // Browser visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isListening) {
                this.pauseListening();
            }
        });
    }
    
    // Method to request microphone permission
    async requestMicrophonePermissionIfNeeded() {
        try {
            const permission = await this.checkMicrophonePermission();

            if (permission === 'granted') {
                return true;
            } else if (permission === 'prompt') {
                // Request permission
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    // Stop the stream immediately, we just needed permission
                    stream.getTracks().forEach(track => track.stop());
                    return true;
                } catch (error) {
                    console.log('🎤 Microphone permission denied by user');
                    return false;
                }
            } else {
                console.log('🎤 Microphone permission was previously denied');
                return false;
            }
        } catch (error) {
            console.error('Error checking microphone permission:', error);
            return false;
        }
    }

    // Main voice recognition controls
    async startListening() {
        if (!this.isInitialized || this.isListening) return false;

        // Check microphone permission before starting
        const hasPermission = await this.requestMicrophonePermissionIfNeeded();
        if (!hasPermission) {
            this.triggerErrorEvent({
                type: 'permission-denied',
                message: 'Microphone access needed for voice chat',
                canRetry: true,
                needsPermission: true
            });
            return false;
        }

        try {
            this.shouldRestart = true;
            this.isListening = true;
            this.audioChunks = [];

            // Start Web Speech Recognition
            this.recognition.start();
            
            // Start audio recording for advanced analysis
            if (this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
                this.mediaRecorder.start(100); // Collect data every 100ms
            }
            
            // Start audio analysis loop
            this.startAudioAnalysis();
            
            console.log('🎤 Started listening with advanced features');
            return true;
            
        } catch (error) {
            console.error('Failed to start listening:', error);
            this.isListening = false;
            return false;
        }
    }
    
    stopListening() {
        this.shouldRestart = false;
        this.isListening = false;
        
        if (this.recognition) {
            this.recognition.stop();
        }
        
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
        }
        
        this.stopAudioAnalysis();
        console.log('🎤 Stopped listening');
    }
    
    pauseListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
        console.log('🎤 Paused listening');
    }
    
    resumeListening() {
        if (this.shouldRestart && !this.isListening) {
            this.startListening();
            console.log('🎤 Resumed listening');
        }
    }
    
    toggleListening() {
        if (this.isListening) {
            this.stopListening();
            return false;
        } else {
            return this.startListening();
        }
    }
    
    // Speech result processing
    handleSpeechResult(event) {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            
            if (result.isFinal) {
                finalTranscript += transcript;
                
                // Analyze confidence and alternatives
                const confidence = result[0].confidence;
                const alternatives = Array.from(result).map(alt => ({
                    transcript: alt.transcript,
                    confidence: alt.confidence
                }));
                
                this.processFinalTranscript(finalTranscript, confidence, alternatives);
                
            } else {
                interimTranscript += transcript;
                this.processInterimTranscript(interimTranscript);
            }
        }
    }
    
    processFinalTranscript(transcript, confidence, alternatives) {
        console.log('🎤 Final transcript:', transcript, 'Confidence:', confidence);
        
        // Check for hotwords
        if (this.isHotwordActive && this.detectHotword(transcript)) {
            console.log('🎤 Hotword detected!');
            this.triggerHotwordEvent(transcript);
        }
        
        // Analyze emotion in speech
        const emotionData = this.analyzeVoiceEmotion(transcript);
        
        // Create comprehensive voice input data
        const voiceData = {
            transcript: transcript.trim(),
            confidence: confidence,
            alternatives: alternatives,
            emotion: emotionData,
            timestamp: Date.now(),
            audioFeatures: this.getAudioFeatures(),
            language: this.language
        };
        
        // Trigger voice input event
        this.triggerVoiceInputEvent(voiceData);
        
        // Clear interim transcript
        this.triggerInterimTranscriptEvent('');
    }
    
    processInterimTranscript(transcript) {
        this.triggerInterimTranscriptEvent(transcript);
    }
    
    // Hotword detection
    detectHotword(transcript) {
        const lowerTranscript = transcript.toLowerCase();
        return this.hotwords.some(hotword => 
            lowerTranscript.includes(hotword.toLowerCase())
        );
    }
    
    // Voice emotion analysis
    analyzeVoiceEmotion(transcript) {
        // Simple text-based emotion detection
        const emotionKeywords = {
            happy: ['great', 'awesome', 'amazing', 'wonderful', 'fantastic', 'love', 'excited'],
            sad: ['sad', 'terrible', 'awful', 'depressed', 'upset', 'hurt', 'crying'],
            angry: ['angry', 'mad', 'furious', 'hate', 'annoyed', 'frustrated', 'pissed'],
            surprised: ['wow', 'amazing', 'incredible', 'unbelievable', 'shocking'],
            flirty: ['sexy', 'beautiful', 'gorgeous', 'hot', 'attractive', 'kiss', 'love you'],
            excited: ['excited', 'thrilled', 'pumped', 'hyped', 'energetic']
        };
        
        const lowerTranscript = transcript.toLowerCase();
        const detectedEmotions = {};
        
        for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
            const matches = keywords.filter(keyword => lowerTranscript.includes(keyword));
            if (matches.length > 0) {
                detectedEmotions[emotion] = matches.length;
            }
        }
        
        // Find dominant emotion
        let dominantEmotion = 'neutral';
        let maxScore = 0;
        
        for (const [emotion, score] of Object.entries(detectedEmotions)) {
            if (score > maxScore) {
                maxScore = score;
                dominantEmotion = emotion;
            }
        }
        
        // Add audio-based emotion analysis if available
        const audioEmotion = this.analyzeAudioEmotion();
        
        return {
            textEmotion: dominantEmotion,
            textScore: maxScore,
            audioEmotion: audioEmotion,
            allEmotions: detectedEmotions,
            confidence: maxScore > 0 ? 0.7 : 0.3
        };
    }
    
    // Audio-based emotion analysis
    analyzeAudioEmotion() {
        if (!this.analyser) return { emotion: 'neutral', confidence: 0 };
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        
        // Calculate basic audio features
        const avgFrequency = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
        const maxFrequency = Math.max(...dataArray);
        const energy = Math.sqrt(dataArray.reduce((sum, val) => sum + val * val, 0) / bufferLength);
        
        // Simple emotion mapping based on audio features
        let emotion = 'neutral';
        let confidence = 0.3;
        
        if (energy > 80 && maxFrequency > 200) {
            emotion = 'excited';
            confidence = 0.6;
        } else if (energy < 30) {
            emotion = 'sad';
            confidence = 0.5;
        } else if (avgFrequency > 100) {
            emotion = 'happy';
            confidence = 0.5;
        }
        
        return { emotion, confidence, features: { avgFrequency, maxFrequency, energy } };
    }
    
    // Audio analysis loop
    startAudioAnalysis() {
        if (!this.analyser) return;
        
        this.audioAnalysisLoop = () => {
            if (!this.isListening) return;
            
            // Voice Activity Detection
            const vadResult = this.detectVoiceActivity();
            
            // Update audio visualization
            this.updateAudioVisualization();
            
            // Continue loop
            requestAnimationFrame(this.audioAnalysisLoop);
        };
        
        this.audioAnalysisLoop();
    }
    
    stopAudioAnalysis() {
        if (this.audioAnalysisLoop) {
            this.audioAnalysisLoop = null;
        }
    }
    
    // Voice Activity Detection
    detectVoiceActivity() {
        if (!this.analyser) return false;
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteTimeDomainData(dataArray);
        
        // Calculate RMS (Root Mean Square) for voice activity
        let rms = 0;
        for (let i = 0; i < bufferLength; i++) {
            const normalized = (dataArray[i] - 128) / 128;
            rms += normalized * normalized;
        }
        rms = Math.sqrt(rms / bufferLength);
        
        const isVoiceActive = rms > this.vadThreshold;
        
        if (isVoiceActive) {
            this.vadCurrentFrames++;
        } else {
            this.vadCurrentFrames = 0;
        }
        
        const voiceDetected = this.vadCurrentFrames >= this.vadConsecutiveFrames;
        
        // Trigger voice activity events
        if (voiceDetected !== this.lastVoiceDetected) {
            this.triggerVoiceActivityEvent(voiceDetected, rms);
            this.lastVoiceDetected = voiceDetected;
        }
        
        return voiceDetected;
    }
    
    // Audio visualization update
    updateAudioVisualization() {
        if (!this.analyser) return;
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        
        // Calculate volume level for UI
        const avgVolume = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
        const normalizedVolume = Math.min(avgVolume / 128, 1);
        
        // Trigger visualization event
        this.triggerAudioVisualizationEvent(normalizedVolume, dataArray);
    }
    
    // Get audio features for analysis
    getAudioFeatures() {
        if (!this.analyser) return {};
        
        const bufferLength = this.analyser.frequencyBinCount;
        const freqData = new Uint8Array(bufferLength);
        const timeData = new Uint8Array(bufferLength);
        
        this.analyser.getByteFrequencyData(freqData);
        this.analyser.getByteTimeDomainData(timeData);
        
        // Calculate various audio features
        const avgFrequency = freqData.reduce((sum, val) => sum + val, 0) / bufferLength;
        const maxFrequency = Math.max(...freqData);
        const spectralCentroid = this.calculateSpectralCentroid(freqData);
        const zeroCrossingRate = this.calculateZeroCrossingRate(timeData);
        
        return {
            avgFrequency,
            maxFrequency,
            spectralCentroid,
            zeroCrossingRate,
            timestamp: Date.now()
        };
    }
    
    calculateSpectralCentroid(freqData) {
        let numerator = 0;
        let denominator = 0;
        
        for (let i = 0; i < freqData.length; i++) {
            numerator += i * freqData[i];
            denominator += freqData[i];
        }
        
        return denominator > 0 ? numerator / denominator : 0;
    }
    
    calculateZeroCrossingRate(timeData) {
        let crossings = 0;
        for (let i = 1; i < timeData.length; i++) {
            if ((timeData[i] >= 128) !== (timeData[i - 1] >= 128)) {
                crossings++;
            }
        }
        return crossings / timeData.length;
    }
    
    // Process recorded audio chunks
    processAudioChunks() {
        if (this.audioChunks.length === 0) return;
        
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = [];
        
        // Could send to Whisper API for high-accuracy transcription
        // or perform additional audio analysis
        
        console.log('🎤 Processed audio chunk:', audioBlob.size, 'bytes');
    }
    
    // Error handling
    handleSpeechError(error) {
        this.isListening = false;

        switch (error) {
            case 'no-speech':
                console.log('🎤 No speech detected');
                // Don't trigger error event for this, it's normal
                break;
            case 'audio-capture':
                console.error('🎤 Audio capture error');
                this.triggerErrorEvent({
                    type: 'microphone-error',
                    message: 'Failed to capture audio from microphone',
                    canRetry: true,
                    needsPermission: false
                });
                break;
            case 'not-allowed':
            case 'permission-denied':
                // Don't spam console - user just denied permission
                this.triggerErrorEvent({
                    type: 'permission-denied',
                    message: 'Microphone access needed. Click the voice button to try again.',
                    canRetry: true,
                    needsPermission: true
                });
                break;
            case 'network':
                console.error('🎤 Network error');
                this.triggerErrorEvent({
                    type: 'network-error',
                    message: 'Network error occurred during speech recognition',
                    canRetry: true,
                    needsPermission: false
                });
                break;
            case 'service-not-allowed':
                console.error('🎤 Speech recognition service not allowed');
                this.triggerErrorEvent({
                    type: 'service-blocked',
                    message: 'Speech recognition is blocked. Please check browser settings.',
                    canRetry: false,
                    needsPermission: false
                });
                break;
            default:
                console.error('🎤 Speech recognition error:', error);
                this.triggerErrorEvent({
                    type: 'unknown-error',
                    message: `Speech recognition error: ${error}`,
                    canRetry: true,
                    needsPermission: false
                });
        }
    }
    
    // Fallback mode
    fallbackToBasicMode() {
        console.warn('🎤 Using basic voice recognition mode');
        this.emotionAnalysis.enabled = false;
        // Simplified initialization without advanced features
    }
    
    // Settings
    setLanguage(language) {
        this.language = language;
        if (this.recognition) {
            this.recognition.lang = language;
        }
    }
    
    setHotwordActive(active) {
        this.isHotwordActive = active;
    }
    
    addHotword(hotword) {
        if (!this.hotwords.includes(hotword.toLowerCase())) {
            this.hotwords.push(hotword.toLowerCase());
        }
    }
    
    // Event triggers
    triggerListeningEvent(listening) {
        const event = new CustomEvent('anneVoiceListening', {
            detail: { listening, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }
    
    triggerVoiceInputEvent(voiceData) {
        const event = new CustomEvent('anneVoiceInput', {
            detail: voiceData
        });
        document.dispatchEvent(event);
    }
    
    triggerInterimTranscriptEvent(transcript) {
        const event = new CustomEvent('anneVoiceInterim', {
            detail: { transcript, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }
    
    triggerHotwordEvent(transcript) {
        const event = new CustomEvent('anneVoiceHotword', {
            detail: { transcript, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }
    
    triggerSpeechDetectedEvent(detected) {
        const event = new CustomEvent('anneVoiceSpeechDetected', {
            detail: { detected, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }
    
    triggerVoiceActivityEvent(active, level) {
        const event = new CustomEvent('anneVoiceActivity', {
            detail: { active, level, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }
    
    triggerAudioVisualizationEvent(volume, frequencyData) {
        const event = new CustomEvent('anneVoiceVisualization', {
            detail: { volume, frequencyData, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }
    
    triggerErrorEvent(errorData) {
        const event = new CustomEvent('anneVoiceError', {
            detail: {
                ...errorData,
                timestamp: Date.now(),
                voiceEngineStatus: this.getStatus()
            }
        });
        document.dispatchEvent(event);
    }
    
    // Status getters
    isCurrentlyListening() {
        return this.isListening;
    }
    
    getStatus() {
        return {
            isListening: this.isListening,
            isInitialized: this.isInitialized,
            language: this.language,
            hotwordActive: this.isHotwordActive,
            audioContext: !!this.audioContext,
            mediaRecorder: !!this.mediaRecorder
        };
    }
}

// Global instance
window.AnneVoice = new AnneVoiceEngine();

export default AnneVoiceEngine;
