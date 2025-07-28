// Simple test script to verify TTS system status
console.log('🧪 Testing TTS System Status...');

// Check if we're in a cloud environment
function isCloudEnvironment() {
    const hostname = window.location.hostname;
    return !(hostname === 'localhost' || 
             hostname === '127.0.0.1' || 
             hostname.startsWith('192.168.') ||
             hostname.startsWith('10.') ||
             hostname.includes('local'));
}

// Test environment detection
const cloudEnv = isCloudEnvironment();
console.log(`Environment: ${cloudEnv ? 'Cloud' : 'Local'}`);
console.log(`Hostname: ${window.location.hostname}`);

// Test TTS engine loading
if (window.AnneTTSEngine) {
    console.log('✅ TTS Engine class available');
    
    try {
        const testEngine = new window.AnneTTSEngine();
        console.log(`✅ TTS Engine instantiated successfully`);
        console.log(`   - Cloud Environment: ${testEngine.isCloudEnvironment}`);
        console.log(`   - Server URL: ${testEngine.serverUrl}`);
        console.log(`   - Enabled: ${testEngine.isEnabled}`);
    } catch (error) {
        console.error('❌ TTS Engine instantiation failed:', error);
    }
} else {
    console.log('⚠️ TTS Engine class not loaded yet');
}

// Test if main functions are available
if (window.showAnneMessage) {
    console.log('✅ showAnneMessage function available');
} else {
    console.log('⚠️ showAnneMessage function not available');
}

console.log('🧪 TTS System Status Test Complete');
