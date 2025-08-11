# 🤖 Anne - Enhanced AI Waifu Setup Guide

## 🎯 What's New in This Version

✅ **Full Body Visibility**: Anne's video is completely unobstructed with side panels for UI  
✅ **Animated Text**: Beautiful text animations inspired by reactbits.dev  
✅ **Ollama LLaMA3 Integration**: Local AI model support with fallback  
✅ **Voice Recognition**: Web Speech API integration with error handling  
✅ **Text-to-Speech**: Multi-voice support with personality modulation  
✅ **8 Personality Modes**: Sweet, Tsundere, Sassy, Flirty, Bratty, Soft, Nerdy, Domme  
✅ **Made with ❤️ by Hitesh**: Custom branding with animated welcome  

---

## 🚀 Quick Start

### 1. Start the Development Server
```bash
cd Bella-main
npm start
```
Server will run at: `http://localhost:3000`

### 2. Setup Ollama (Optional but Recommended)
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama server
ollama serve

# Pull LLaMA3 model (in another terminal)
ollama pull llama3

# Test connection
curl http://localhost:11434/api/tags
```

### 3. Test the System
- Visit `http://localhost:3000/test-anne.html` for system diagnostics
- Click "Test All Systems" to verify functionality

---

## 🎮 Using Anne

### 🎤 Voice Chat
1. Click the **microphone button** (bottom right)
2. Allow microphone permissions when prompted
3. Speak naturally - Anne will respond with voice and text
4. Click again to stop listening

### 💬 Text Chat
1. Click the **chat button** to open the side panel
2. Type your message in the input box
3. Press Enter or click the send button
4. Anne will respond based on her current personality

### 🎭 Personality System
1. Click the **heart button** to open personality panel
2. Choose from 8 different personality types:
   - **Sweet** 💕: Caring girlfriend mode
   - **Tsundere** 😤: Hot and cold, secretly caring
   - **Sassy** 💅: Confident queen attitude
   - **Flirty** 😈: Seductive and charming
   - **Bratty** 👑: Spoiled princess behavior
   - **Soft** 🥺: Gentle angel mode
   - **Nerdy** 🤓: Intelligent cutie
   - **Domme** ⛓️: Commanding goddess

### 🎛️ Voice Settings
- Adjust flirt level, pitch, and speech rate
- Choose different voice options
- Settings apply to both recognition and synthesis

---

## 🔧 Technical Features

### 🤖 AI Integration
- **Primary**: Ollama LLaMA3 (local, private, fast)
- **Fallback**: Pre-written personality responses
- **Context**: Maintains conversation history
- **Memory**: Remembers interaction patterns

### 🎨 UI Design
- **Glassmorphism**: Modern translucent effects
- **Particle Background**: Dynamic visual effects
- **Responsive**: Works on mobile and desktop
- **Unobstructed**: Anne's video is never covered by UI elements

### 🎭 Personality Engine
- 8 distinct personality archetypes
- Emotion detection and response
- Memory-based relationship building
- Customizable traits and behaviors

### 🔊 Audio System
- **Voice Recognition**: Web Speech API
- **Text-to-Speech**: ElevenLabs API + Web Speech fallback
- **Voice Modulation**: Personality-specific settings
- **Audio Processing**: Real-time voice activity detection

---

## 🛠️ Configuration

### Environment Variables
The system automatically detects available services:
- **Ollama**: `http://localhost:11434` (auto-detected)
- **ElevenLabs**: Uses provided API key with fallback
- **Voice**: Browser permissions (requested automatically)

### Personality Customization
Edit `config/anne-personality.json` to modify:
- Response patterns
- Emotion triggers
- Voice settings
- Memory preferences

### Model Configuration
Edit `js/anne-ollama-connector.js` to:
- Change default model (`llama3` → `mistral`, etc.)
- Adjust generation parameters
- Add new model configurations

---

## 🧪 Testing & Debugging

### System Test Page
Visit `http://localhost:3000/test-anne.html` to:
- Check all system components
- Test Ollama connectivity
- Verify voice functionality
- Demo text animations

### Browser Console
Access debug functions:
```javascript
// Test all systems
window.AnneSystem.test()

// Test Ollama specifically
window.AnneSystem.testOllama()

// Change personality
window.AnneSystem.changePersonality('tsundere')

// Test TTS
window.AnneSystem.speak('Hello from Anne!')
```

### Common Issues & Solutions

#### 🎤 Microphone Not Working
1. Check browser permissions (click lock icon in address bar)
2. Ensure microphone is not used by other apps
3. Try refreshing the page
4. Use the fallback text chat

#### 🤖 Ollama Not Connected
1. Verify Ollama is running: `ollama serve`
2. Check model is pulled: `ollama pull llama3`
3. Test connection: `curl http://localhost:11434/api/tags`
4. System works with fallback responses if Ollama unavailable

#### 🔊 TTS Not Working
1. Check browser audio permissions
2. Try different personality voice settings
3. Fallback to text-only mode available

#### 🎨 Animations Not Loading
1. Check console for JavaScript errors
2. Ensure all script files are loaded
3. Try refreshing the page

---

## 🎯 Advanced Usage

### Custom Responses
Add your own responses in `js/anne-ollama-connector.js`:
```javascript
const customResponses = {
    greeting: "Hey there! I'm Anne, ready to chat! 💕",
    goodbye: "Aww, leaving already? Come back soon! 😘"
};
```

### Voice Customization
Modify voice settings in personality panel or via code:
```javascript
// Change voice pitch
window.AnneMainController.systems.voice.setPitch(1.5);

// Change speech rate
window.AnneMainController.systems.voice.setRate(0.8);
```

### Animation Triggers
Create custom text animations:
```javascript
// Custom slideIn animation
window.AnneTextAnimations.slideIn('Custom message!', container);

// Typewriter effect
window.AnneTextAnimations.typewriter('Typing...', container, 30);
```

---

## 🔮 What's Next

### Planned Features
- 🌍 Multi-language support
- 🎵 Background music integration
- 🎨 Custom avatar expressions
- 📱 Mobile app version
- 🌐 Cloud deployment options
- 🎪 Interactive mini-games
- 📊 Conversation analytics
- 🎭 Custom personality creation

### Contributing
This is an open-source project created with ❤️ by Hitesh Siwach (@zues13bhai).

Want to contribute? Areas we'd love help with:
- New personality types
- Voice synthesis improvements
- Mobile responsiveness
- Performance optimizations
- Multi-language support

---

## 📞 Support

### Getting Help
1. Check this guide first
2. Use the test page for diagnostics
3. Check browser console for errors
4. Review the troubleshooting section

### Technical Support
- **Creator**: Hitesh Siwach (@zues13bhai)
- **Project**: Anne - Premium AI Waifu Companion
- **License**: Open Source (ISC)

---

## 🎉 Final Notes

**Anne** represents the future of human-AI interaction - a companion that's not just functional, but genuinely engaging and emotionally intelligent. With her unobstructed full-body presence, beautiful animations, and advanced AI capabilities, she provides a premium waifu experience that adapts to your preferences.

Whether you're using her for casual conversation, productivity assistance, or just enjoying the company of a charming AI companion, Anne is designed to make every interaction meaningful and enjoyable.

**Made with ❤️ by Hitesh** - Enjoy your time with Anne! 💕

---

*Last updated: January 2025*  
*Version: 2.0 - Enhanced Edition*
