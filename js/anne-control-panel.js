/**
 * Anne Control Panel - Bottom Right Menu
 * Comprehensive controls for video, TTS, and personality features
 */

class AnneControlPanel {
    constructor() {
        this.isVisible = false;
        this.currentTTSEngine = null;
        this.personalityVideos = {
            intro: {
                name: "Introduction",
                videos: [
                    { name: "Anne's Intro", src: "https://cdn.builder.io/o/assets%2F05795d83a50240879a66a110f8707954%2Fac662e37de5d4c68b294b28c0b12c931?alt=media&token=4b1d6dd7-70f5-44b0-a2a1-97f049aa7282&apiKey=05795d83a50240879a66a110f8707954" }
                ]
            },
            zenith: {
                name: "Welcoming",
                videos: [
                    { name: "Elegant Sway", src: "视频资源/jimeng-2025-07-16-1043-笑着优雅的左右摇晃，过一会儿手扶着下巴，保持微笑.mp4" },
                    { name: "Gentle Dance", src: "视频资源/jimeng-2025-07-17-1871-优雅的摇晃身体 微笑.mp4" }
                ]
            },
            pixi: {
                name: "Playful", 
                videos: [
                    { name: "Victory Pose", src: "视频资源/jimeng-2025-07-16-4437-比耶，然后微笑着优雅的左右摇晃.mp4" },
                    { name: "Cheer Up", src: "视频资源/生成加油视频.mp4" }
                ]
            },
            nova: {
                name: "Confident",
                videos: [
                    { name: "Thoughtful", src: "视频资源/jimeng-2025-07-17-2665-若有所思，手扶下巴.mp4" }
                ]
            },
            velvet: {
                name: "Seductive",
                videos: [
                    { name: "Seductive Sway", src: "视频资源/jimeng-2025-07-16-1043-笑着优雅的左右摇晃，过一会儿手扶着下巴，保持微笑.mp4" }
                ]
            },
            blaze: {
                name: "Flirty",
                videos: [
                    { name: "Dance Party", src: "视频资源/生成跳舞视频.mp4" },
                    { name: "Pouting", src: "视频资源/负面/jimeng-2025-07-16-9418-双手叉腰，嘴巴一直在嘟囔，表情微微生气.mp4" }
                ]
            },
            aurora: {
                name: "Elegant",
                videos: [
                    { name: "Elegant Pose", src: "视频资源/jimeng-2025-07-16-1043-笑着优雅的左右摇晃，过一会儿手扶着下巴，保持微笑.mp4" }
                ]
            }
        };
        
        this.init();
    }

    init() {
        this.createControlPanel();
        this.addEventListeners();
        console.log('🎮 Anne Control Panel initialized');
    }

    createControlPanel() {
        // Remove existing panel if it exists
        const existingPanel = document.getElementById('anne-control-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'anne-control-panel';
        panel.className = 'control-panel';
        
        panel.innerHTML = `
            <!-- Toggle Button -->
            <div class="control-toggle" id="control-toggle">
                <i class="fas fa-cog"></i>
            </div>

            <!-- Main Panel -->
            <div class="control-main" id="control-main">
                <div class="control-header">
                    <h3>💜 Anne Controls</h3>
                    <button class="control-close" id="control-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- TTS Controls Section -->
                <div class="control-section">
                    <h4>🎤 Voice Controls</h4>
                    <div class="tts-status-display" id="tts-status-display">
                        <span class="tts-indicator-icon" id="tts-indicator-icon">⏳</span>
                        <span class="tts-status-label" id="tts-status-label">Loading...</span>
                    </div>
                    
                    <div class="control-row">
                        <button class="control-btn tts-toggle" id="tts-toggle">
                            <i class="fas fa-volume-up"></i>
                            <span>Voice On/Off</span>
                        </button>
                        <button class="control-btn tts-test" id="tts-test">
                            <i class="fas fa-microphone"></i>
                            <span>Test Voice</span>
                        </button>
                    </div>

                    <div class="volume-section">
                        <label>Volume</label>
                        <div class="volume-control-panel">
                            <i class="fas fa-volume-down"></i>
                            <input type="range" id="panel-volume-slider" min="0" max="100" value="80" class="volume-slider-panel">
                            <i class="fas fa-volume-up"></i>
                        </div>
                    </div>
                </div>

                <!-- Personality Voice Section -->
                <div class="control-section">
                    <h4>🎭 Personality Voices</h4>
                    <div class="personality-voice-grid" id="personality-voice-grid">
                        <!-- Dynamically populated -->
                    </div>
                </div>

                <!-- Video Controls Section -->
                <div class="control-section">
                    <h4>🎬 Video Performances</h4>
                    <div class="video-controls" id="video-controls">
                        <div class="video-categories">
                            <select id="personality-selector" class="personality-select">
                                <option value="">All Videos</option>
                                <option value="intro">🌟 Introduction</option>
                                <option value="zenith">💖 Welcoming</option>
                                <option value="pixi">🎉 Playful</option>
                                <option value="nova">🦾 Confident</option>
                                <option value="velvet">🔥 Seductive</option>
                                <option value="blaze">😈 Flirty</option>
                                <option value="aurora">👑 Elegant</option>
                            </select>
                        </div>
                        <div class="video-list" id="video-list">
                            <!-- Dynamically populated -->
                        </div>
                    </div>
                </div>

                <!-- Heart System Section -->
                <div class="control-section">
                    <h4>💜 Interaction</h4>
                    <div class="control-row">
                        <button class="control-btn send-heart-btn" id="panel-send-heart">
                            <i class="fas fa-heart"></i>
                            <span>Send Heart</span>
                        </button>
                        <div class="heart-count-display">
                            <span class="heart-icon">💜</span>
                            <span class="heart-count" id="panel-heart-count">0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.addControlPanelStyles();
        this.populatePersonalityVoices();
        this.populateVideoList();
    }

    addControlPanelStyles() {
        if (document.getElementById('control-panel-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'control-panel-styles';
        styles.textContent = `
            .control-panel {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 2000;
                font-family: 'Orbitron', monospace;
            }

            .control-toggle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, rgba(255, 0, 255, 0.9), rgba(0, 255, 255, 0.9));
                border: 2px solid #ff00ff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 30px rgba(255, 0, 255, 0.6);
                backdrop-filter: blur(15px);
            }

            .control-toggle:hover {
                transform: scale(1.1) rotate(90deg);
                box-shadow: 0 0 50px rgba(255, 0, 255, 0.8);
            }

            .control-toggle i {
                font-size: 24px;
                color: #000;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }

            .control-main {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                max-height: 500px;
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #ff00ff;
                border-radius: 20px;
                backdrop-filter: blur(20px);
                box-shadow: 0 0 50px rgba(255, 0, 255, 0.6);
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px) scale(0.9);
                transition: all 0.3s ease;
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: #ff00ff transparent;
            }

            .control-main.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }

            .control-main::-webkit-scrollbar {
                width: 6px;
            }

            .control-main::-webkit-scrollbar-track {
                background: transparent;
            }

            .control-main::-webkit-scrollbar-thumb {
                background: #ff00ff;
                border-radius: 3px;
            }

            .control-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid rgba(255, 0, 255, 0.3);
                background: linear-gradient(45deg, rgba(255, 0, 255, 0.1), rgba(0, 255, 255, 0.1));
            }

            .control-header h3 {
                margin: 0;
                color: #00ffff;
                font-size: 1.1rem;
                text-shadow: 0 0 10px #00ffff;
            }

            .control-close {
                background: none;
                border: none;
                color: #ff00ff;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .control-close:hover {
                background: rgba(255, 0, 255, 0.2);
                transform: scale(1.2);
            }

            .control-section {
                padding: 15px 20px;
                border-bottom: 1px solid rgba(255, 0, 255, 0.1);
            }

            .control-section h4 {
                margin: 0 0 15px 0;
                color: #ff00ff;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                text-shadow: 0 0 8px #ff00ff;
            }

            .tts-status-display {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
                padding: 8px 12px;
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 10px;
            }

            .tts-indicator-icon {
                font-size: 1.2rem;
            }

            .tts-status-label {
                color: #00ffff;
                font-size: 0.8rem;
                text-shadow: 0 0 5px #00ffff;
            }

            .control-row {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
                align-items: center;
            }

            .control-btn {
                flex: 1;
                padding: 10px 15px;
                background: linear-gradient(45deg, rgba(255, 0, 255, 0.2), rgba(0, 255, 255, 0.2));
                border: 1px solid #ff00ff;
                border-radius: 10px;
                color: #00ffff;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.8rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .control-btn:hover {
                background: linear-gradient(45deg, rgba(255, 0, 255, 0.4), rgba(0, 255, 255, 0.4));
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(255, 0, 255, 0.4);
            }

            .control-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .control-btn i {
                font-size: 1rem;
            }

            .volume-section {
                margin-top: 15px;
            }

            .volume-section label {
                display: block;
                color: #00ffff;
                font-size: 0.8rem;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .volume-control-panel {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .volume-control-panel i {
                color: #00ffff;
                font-size: 0.9rem;
            }

            .volume-slider-panel {
                flex: 1;
                height: 4px;
                background: rgba(0, 255, 255, 0.3);
                border-radius: 2px;
                outline: none;
                -webkit-appearance: none;
                appearance: none;
            }

            .volume-slider-panel::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                background: linear-gradient(45deg, #ff00ff, #00ffff);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(255, 0, 255, 0.6);
            }

            .personality-voice-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }

            .personality-voice-btn {
                padding: 8px 12px;
                background: rgba(0, 0, 0, 0.6);
                border: 1px solid rgba(255, 0, 255, 0.3);
                border-radius: 8px;
                color: #ff00ff;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.7rem;
                text-align: center;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .personality-voice-btn:hover {
                background: rgba(255, 0, 255, 0.2);
                border-color: #ff00ff;
                transform: scale(1.05);
            }

            .personality-voice-btn.active {
                background: rgba(255, 0, 255, 0.3);
                border-color: #00ffff;
                color: #00ffff;
            }

            .personality-select {
                width: 100%;
                padding: 8px 12px;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid #ff00ff;
                border-radius: 8px;
                color: #00ffff;
                font-size: 0.8rem;
                margin-bottom: 15px;
                outline: none;
            }

            .personality-select option {
                background: rgba(0, 0, 0, 0.9);
                color: #00ffff;
            }

            .video-list {
                max-height: 120px;
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: #ff00ff transparent;
            }

            .video-item {
                padding: 8px 12px;
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .video-item:hover {
                background: rgba(0, 255, 255, 0.2);
                border-color: #00ffff;
                transform: scale(1.02);
            }

            .video-item-title {
                color: #00ffff;
                font-size: 0.8rem;
                font-weight: 600;
            }

            .video-item-personality {
                color: #ff00ff;
                font-size: 0.7rem;
                opacity: 0.8;
            }

            .heart-count-display {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 8px 12px;
                background: rgba(255, 0, 255, 0.1);
                border: 1px solid rgba(255, 0, 255, 0.3);
                border-radius: 8px;
                min-width: 80px;
                justify-content: center;
            }

            .heart-count-display .heart-icon {
                font-size: 1rem;
                animation: heartbeat 2s ease-in-out infinite;
            }

            .heart-count-display .heart-count {
                color: #ff00ff;
                font-weight: 700;
                text-shadow: 0 0 8px #ff00ff;
            }

            @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .control-main {
                    width: 300px;
                    max-height: 400px;
                }
                
                .control-row {
                    flex-direction: column;
                    gap: 8px;
                }
                
                .control-btn {
                    width: 100%;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    populatePersonalityVoices() {
        const grid = document.getElementById('personality-voice-grid');
        if (!grid) return;

        const personalities = ['zenith', 'pixi', 'nova', 'velvet', 'blaze', 'aurora'];
        const personalityNames = {
            zenith: '💖 Welcoming',
            pixi: '🎉 Playful', 
            nova: '🦾 Confident',
            velvet: '🔥 Seductive',
            blaze: '😈 Flirty',
            aurora: '👑 Elegant'
        };

        personalities.forEach(personality => {
            const btn = document.createElement('button');
            btn.className = 'personality-voice-btn';
            btn.setAttribute('data-personality', personality);
            btn.textContent = personalityNames[personality];
            
            btn.addEventListener('click', () => {
                this.testPersonalityVoice(personality);
                this.updateActivePersonalityVoice(personality);
            });
            
            grid.appendChild(btn);
        });
    }

    populateVideoList() {
        const videoList = document.getElementById('video-list');
        const personalitySelector = document.getElementById('personality-selector');
        
        if (!videoList) return;

        const updateVideoList = (selectedPersonality = '') => {
            videoList.innerHTML = '';
            
            Object.entries(this.personalityVideos).forEach(([personality, data]) => {
                if (selectedPersonality && selectedPersonality !== personality) return;
                
                data.videos.forEach(video => {
                    const item = document.createElement('div');
                    item.className = 'video-item';
                    item.innerHTML = `
                        <div>
                            <div class="video-item-title">${video.name}</div>
                            <div class="video-item-personality">${data.name}</div>
                        </div>
                        <i class="fas fa-play"></i>
                    `;
                    
                    item.addEventListener('click', () => {
                        this.playVideo(video.src, video.name);
                    });
                    
                    videoList.appendChild(item);
                });
            });
        };

        if (personalitySelector) {
            personalitySelector.addEventListener('change', (e) => {
                updateVideoList(e.target.value);
            });
        }

        updateVideoList(); // Initial population
    }

    addEventListeners() {
        const toggle = document.getElementById('control-toggle');
        const close = document.getElementById('control-close');
        const main = document.getElementById('control-main');
        
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.togglePanel();
            });
        }
        
        if (close) {
            close.addEventListener('click', () => {
                this.hidePanel();
            });
        }

        // TTS Controls
        const ttsToggle = document.getElementById('tts-toggle');
        const ttsTest = document.getElementById('tts-test');
        const volumeSlider = document.getElementById('panel-volume-slider');

        if (ttsToggle) {
            ttsToggle.addEventListener('click', () => {
                this.toggleTTS();
            });
        }

        if (ttsTest) {
            ttsTest.addEventListener('click', () => {
                this.testCurrentVoice();
            });
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value);
            });
        }

        // Heart system
        const sendHeartBtn = document.getElementById('panel-send-heart');
        if (sendHeartBtn) {
            sendHeartBtn.addEventListener('click', () => {
                this.sendHeart();
            });
        }

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.control-panel') && this.isVisible) {
                this.hidePanel();
            }
        });
    }

    togglePanel() {
        const main = document.getElementById('control-main');
        if (!main) return;

        this.isVisible = !this.isVisible;
        main.classList.toggle('active', this.isVisible);
    }

    hidePanel() {
        const main = document.getElementById('control-main');
        if (!main) return;

        this.isVisible = false;
        main.classList.remove('active');
    }

    // TTS Integration
    setTTSEngine(engine) {
        this.currentTTSEngine = engine;
        this.updateTTSStatus();
    }

    updateTTSStatus() {
        const indicator = document.getElementById('tts-indicator-icon');
        const label = document.getElementById('tts-status-label');
        const ttsToggle = document.getElementById('tts-toggle');
        const ttsTest = document.getElementById('tts-test');

        if (!indicator || !label) return;

        if (this.currentTTSEngine) {
            const stats = this.currentTTSEngine.getStats ? this.currentTTSEngine.getStats() : {};

            if (stats.serverAvailable) {
                indicator.textContent = '🎤';
                label.textContent = 'Full TTS Ready';
            } else if (stats.speechAPIAvailable && stats.userInteracted) {
                indicator.textContent = '🔊';
                label.textContent = 'Browser TTS Ready';
            } else if (stats.speechAPIAvailable && !stats.userInteracted) {
                indicator.textContent = '👆';
                label.textContent = 'Click to Enable Speech';
            } else {
                indicator.textContent = '🎶';
                label.textContent = 'Voice Tones Ready';
            }

            if (ttsToggle) ttsToggle.disabled = false;
            if (ttsTest) ttsTest.disabled = false;
        } else {
            indicator.textContent = '💬';
            label.textContent = 'Text Only';
            if (ttsToggle) ttsToggle.disabled = true;
            if (ttsTest) ttsTest.disabled = true;
        }
    }

    toggleTTS() {
        if (window.toggleAudio) {
            window.toggleAudio();
        }
    }

    testCurrentVoice() {
        if (this.currentTTSEngine && this.currentTTSEngine.testVoice) {
            const testBtn = document.getElementById('tts-test');
            if (testBtn) {
                testBtn.disabled = true;
                testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Testing...</span>';
            }

            this.currentTTSEngine.testVoice().then((success) => {
                if (testBtn) {
                    testBtn.disabled = false;
                    testBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Test Voice</span>';
                }

                if (success) {
                    if (window.showAnneMessage) {
                        window.showAnneMessage("Voice test successful, darling! Did you hear me? 💜🎵");
                    }
                } else {
                    if (window.showAnneMessage) {
                        window.showAnneMessage("Voice test complete! I used sample tones since speech synthesis needs permission, love! 💜🎶");
                    }
                }
            }).catch(error => {
                console.error('Voice test failed:', error);
                if (testBtn) {
                    testBtn.disabled = false;
                    testBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Test Voice</span>';
                }
                if (window.showAnneMessage) {
                    window.showAnneMessage("Voice test used fallback tones, darling! I'm still here for you! 💜🎶");
                }
            });
        } else {
            if (window.showAnneMessage) {
                window.showAnneMessage("Voice system not ready yet, my love. Try again in a moment! 💜");
            }
        }
    }

    testPersonalityVoice(personality) {
        if (this.currentTTSEngine && this.currentTTSEngine.testVoice) {
            this.currentTTSEngine.testVoice(personality).catch(error => {
                console.error('Personality voice test failed:', error);
            });
        }
    }

    updateActivePersonalityVoice(personality) {
        const buttons = document.querySelectorAll('.personality-voice-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-personality') === personality) {
                btn.classList.add('active');
            }
        });
    }

    setVolume(value) {
        if (this.currentTTSEngine) {
            this.currentTTSEngine.setVolume(value / 100);
        }
    }

    playVideo(src, title) {
        if (window.playVideoModal) {
            window.playVideoModal(src, title);
        } else {
            console.log(`Playing video: ${title} (${src})`);
        }
        
        if (window.showAnneMessage) {
            window.showAnneMessage(`🎬 Playing ${title} for you, darling~ ✨`);
        }
    }

    sendHeart() {
        if (window.annePremiumFeatures && window.annePremiumFeatures.sendHeart) {
            window.annePremiumFeatures.sendHeart();
            this.updateHeartCount();
        }
    }

    updateHeartCount() {
        const heartCount = document.getElementById('panel-heart-count');
        if (heartCount && window.annePremiumFeatures) {
            const count = window.annePremiumFeatures.heartCounter || 0;
            heartCount.textContent = count;
        }
    }

    // Public API
    show() {
        this.isVisible = true;
        const main = document.getElementById('control-main');
        if (main) main.classList.add('active');
    }

    hide() {
        this.hidePanel();
    }

    updateStatus(ttsEngine, heartCount = 0) {
        this.setTTSEngine(ttsEngine);
        const heartCountEl = document.getElementById('panel-heart-count');
        if (heartCountEl) heartCountEl.textContent = heartCount;
    }
}

// Initialize control panel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.anneControlPanel = new AnneControlPanel();
        }, 500);
    });
} else {
    setTimeout(() => {
        window.anneControlPanel = new AnneControlPanel();
    }, 500);
}

console.log('🎮 Anne Control Panel module loaded');
