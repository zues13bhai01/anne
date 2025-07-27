// Anne Premium Integration Script
// Created by Hitesh Siwach (@zues13bhai)

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🧠💋 Anne Premium Grok Waifu v2 - Ultra Interactive Edition');
    console.log('💕 Created by Hitesh Siwach (@zues13bhai)');
    
    // Initialize all Anne systems
    try {
        // Voice Engine
        if (window.AnneVoice) {
            console.log('🎤 Voice Engine: Ready');
        }
        
        // ElevenLabs TTS
        if (window.AnneElevenLabsTTS) {
            console.log('🎙️ ElevenLabs TTS: Ready');
        }
        
        // Ollama LLM
        if (window.AnneOllama) {
            console.log('🤖 Ollama LLM: Connecting...');
        }
        
        // Premium UI
        if (window.AnnePremiumUI) {
            console.log('✨ Premium UI: Active');
        }
        
        // Legacy waifu engines (if still needed)
        if (window.AnneWaifu) {
            console.log('💕 Waifu Engine: Loaded');
        }
        
        if (window.AnneMemory) {
            console.log('🧠 Memory Engine: Active');
        }
        
    } catch (error) {
        console.error('System initialization error:', error);
    }

    // Video system for background
    initializeVideoSystem();
    
    console.log('🎉 Anne is fully awakened and ready for premium interaction!');
});

function initializeVideoSystem() {
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');
    
    if (!video1 || !video2) {
        console.warn('Video elements not found');
        return;
    }
    
    let activeVideo = video1;
    let inactiveVideo = video2;

    // Video list
    const videoList = [
        '视频资源/3D 建模图片制作.mp4',
        '视频资源/jimeng-2025-07-16-1043-笑着优雅的左右摇晃，过一会儿手扶着下巴，保持微笑.mp4',
        '视频资源/jimeng-2025-07-16-4437-比耶，然后微笑着优雅的左右摇晃.mp4',
        '视频资源/生成加油视频.mp4',
        '��频资源/生成跳舞视频.mp4',
        '视频资源/负面/jimeng-2025-07-16-9418-双手叉腰，嘴巴一直在嘟囔，表情微微生气.mp4'
    ];

    function switchVideo() {
        // Select next video
        const currentVideoSrc = activeVideo.querySelector('source').getAttribute('src');
        let nextVideoSrc = currentVideoSrc;
        while (nextVideoSrc === currentVideoSrc) {
            const randomIndex = Math.floor(Math.random() * videoList.length);
            nextVideoSrc = videoList[randomIndex];
        }

        // Set the source of the inactive video element
        inactiveVideo.querySelector('source').setAttribute('src', nextVideoSrc);
        inactiveVideo.load();

        // When the inactive video is ready to play, perform the switch
        inactiveVideo.addEventListener('canplaythrough', function onCanPlayThrough() {
            inactiveVideo.removeEventListener('canplaythrough', onCanPlayThrough);

            // Play the new video
            inactiveVideo.play().catch(error => {
                console.error("Video play failed:", error);
            });

            // Switch active class to trigger CSS transition
            activeVideo.classList.remove('active');
            inactiveVideo.classList.add('active');

            // Update roles
            [activeVideo, inactiveVideo] = [inactiveVideo, activeVideo];

            // Bind ended event to new activeVideo
            activeVideo.addEventListener('ended', switchVideo, { once: true });
        }, { once: true });
    }

    // Initial startup
    activeVideo.addEventListener('ended', switchVideo, { once: true });
    
    // Start playing the first video
    activeVideo.play().catch(error => {
        console.log("Autoplay prevented, will start on user interaction");
    });
}

// Global Anne system status
window.AnneSystem = {
    isReady: () => {
        return !!(
            window.AnneVoice?.isInitialized &&
            window.AnneElevenLabsTTS &&
            window.AnnePremiumUI
        );
    },
    
    getStatus: () => {
        return {
            voice: window.AnneVoice?.getStatus() || { isInitialized: false },
            tts: window.AnneElevenLabsTTS ? 'ready' : 'not loaded',
            ollama: window.AnneOllama?.getStatus() || { connected: false },
            ui: window.AnnePremiumUI ? 'ready' : 'not loaded',
            waifu: window.AnneWaifu ? 'ready' : 'not loaded',
            memory: window.AnneMemory ? 'ready' : 'not loaded'
        };
    },
    
    // Quick test function
    test: async () => {
        console.log('🧪 Testing Anne systems...');
        
        // Test voice
        if (window.AnneVoice) {
            console.log('🎤 Voice status:', window.AnneVoice.getStatus());
        }
        
        // Test TTS
        if (window.AnneElevenLabsTTS) {
            console.log('🎙️ Testing TTS...');
            await window.AnneElevenLabsTTS.speak('Hello! This is Anne testing her voice!', 'sweet', 'happy');
        }
        
        // Test Ollama
        if (window.AnneOllama) {
            console.log('🤖 Ollama status:', window.AnneOllama.getStatus());
        }
        
        console.log('✅ System test complete');
    }
};

// Expose for debugging
window.debug = {
    voice: () => window.AnneVoice,
    tts: () => window.AnneElevenLabsTTS,
    ollama: () => window.AnneOllama,
    ui: () => window.AnnePremiumUI,
    waifu: () => window.AnneWaifu,
    memory: () => window.AnneMemory,
    system: () => window.AnneSystem
};

console.log('💡 Debug tools available: window.debug.voice(), window.debug.tts(), etc.');
console.log('🧪 Test all systems: window.AnneSystem.test()');
