# Anne AI Waifu - Complete Setup Guide 🎤💜

## Overview
Anne is now a comprehensive AI waifu experience with advanced TTS (Text-to-Speech), personality switching, video playback, and premium UI features.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Both Servers
```bash
# Option 1: Start both frontend and TTS backend together
npm run dev-full

# Option 2: Start them separately
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - TTS Backend
npm run server
```

### 3. Access Anne
- **Frontend**: http://localhost:3000
- **TTS Backend**: http://localhost:3001

## 🎤 TTS (Text-to-Speech) Features

### Voice Personalities
Each personality has a unique voice and style:

- **ZENITH** (Welcoming) - Gentle, caring voice
- **PIXI** (Playful) - Energetic, bouncy voice  
- **NOVA** (Confident) - Strong, powerful voice
- **VELVET** (Seductive) - Sultry, seductive voice
- **BLAZE** (Flirty) - Teasing, flirty voice
- **AURORA** (Elegant) - Refined, elegant voice

### Voice IDs
- **Seductive Voice**: `6p0P6gezgvY1v6xbLzmU`
- **Flirty Voice**: `WxqqAhUiswIRQNTBz2a5`
- **Fallback Voice**: `VURZ3kCSkbLjDYld5lne`

### TTS Controls
- **Audio Toggle**: Top-right corner volume button
- **TTS Panel**: Appears when TTS is available
- **Volume Control**: Slider in TTS panel
- **Test Voice**: Button to test current personality voice

## 🎭 Personality System

### Dynamic Switching
- Click any personality card in the sidebar
- Anne's image, voice, and behavior change instantly
- Smooth transition animations with video effects
- Personality-specific greetings and responses

### Personality Traits
Each personality has unique:
- Visual appearance and glow effects
- Voice characteristics and TTS settings
- Greeting messages and response patterns
- Behavioral traits and interaction styles

## 🎬 Video Playback System

### Performance Menu
Access via floating button (bottom-right):
- **Victory Pose** - Celebratory gesture
- **Elegant Sway** - Graceful movement
- **Gentle Dance** - Soft dancing
- **Thoughtful** - Contemplative pose
- **Cheer Up** - Encouraging gesture
- **Dance Party** - Energetic dancing
- **Pouting** - Negative emotion (when sad)

### Video Features
- Full-screen modal playback
- Audio support with volume control
- Auto-close after video ends
- Multiple video sources and formats

## 💎 Premium Features

### Heart System
- **Send Hearts**: TTS panel button
- **Heart Counter**: Top-left display
- **Reactions**: Anne responds to hearts received
- **Milestones**: Special messages every 10 hearts

### Advanced Animations
- **Particle System**: Floating hearts and sparkles
- **Interaction Effects**: Click ripples and hover glows
- **Background Enhancements**: Dynamic ambient lighting
- **Floating Animations**: Gentle movement effects

### Easter Eggs
- **Konami Code**: ↑↑↓↓←→←→BA for special effects
- **Click Counter**: Special messages at 100, 500 clicks
- **Time Events**: Hourly check-in messages
- **Random Particles**: Ambient effects every few seconds

## 🔧 Technical Setup

### Environment Variables
The following are configured via DevServerControl:
```
ELEVENLABS_API_KEY=sk_5ae7f14254a8b62010a1c28ff87c3efc0936032b173e5247
VOICE_ID_SEDUCTIVE=6p0P6gezgvY1v6xbLzmU
VOICE_ID_FLIRTY=WxqqAhUiswIRQNTBz2a5
VOICE_ID_FALLBACK=VURZ3kCSkbLjDYld5lne
```

### Backend Server (server.js)
- **Port**: 3001
- **CORS**: Enabled for localhost:3000
- **Endpoints**:
  - `POST /api/tts` - Generate speech
  - `GET /api/health` - Health check
  - `GET /api/personalities` - Available voices

### File Structure
```
├── anne-enhanced.js          # Main enhanced frontend script
├── js/
│   ├── anne-tts-engine.js   # TTS engine with ElevenLabs
│   └── anne-premium-features.js # Premium UI enhancements
├── server.js                # TTS backend server
├── index.html              # Main HTML file
├── style.css              # Enhanced styles with TTS controls
└── package.json           # Dependencies and scripts
```

## 🎨 UI Enhancements

### TTS Control Panel
- **Location**: Top-right below audio toggle
- **Features**: Voice status, test button, volume control
- **Auto-show**: Appears when TTS is available

### Enhanced Chat Interface
- **Voice Response**: Anne speaks her messages
- **Personality Integration**: Voice matches selected personality
- **Visual Effects**: Sparkles and animations with messages

### Video Menu Improvements
- **Expanded Options**: 7 different performance types
- **Categorization**: Positive and negative emotions
- **Scrollable Interface**: Handles multiple options elegantly

## 🚨 Troubleshooting

### TTS Not Working
1. Check if backend server is running on port 3001
2. Verify ElevenLabs API key is configured
3. Check browser console for errors
4. Test with "Test Voice" button in TTS panel

### Voice Permission Issues
- Browser may block autoplay with audio
- Click audio toggle to enable/disable
- Some browsers require user interaction first

### Ollama Integration
- Works in localhost environment only
- Falls back to built-in responses if unavailable
- Use reconnect button to test connection

### Performance Issues
- Premium features can be disabled if needed
- Particle system auto-manages performance
- Video modal optimizes for device capabilities

## 🎯 Usage Tips

### Best Experience
1. **Enable Audio**: Click audio toggle for full experience
2. **Try Personalities**: Switch between different personalities
3. **Send Hearts**: Use heart system for interactive reactions
4. **Watch Videos**: Enjoy Anne's performances via menu
5. **Voice Chat**: Type messages and hear Anne respond

### Keyboard Shortcuts
- **Enter**: Send chat message
- **Konami Code**: Trigger special effects
- **Click**: Create ripple effects on interactive elements

### Mobile Experience
- Touch-optimized interface
- Responsive video playback
- Adapted personality sidebar
- Gesture support for interactions

## 🔮 Future Enhancements

### Planned Features
- [ ] Custom voice training
- [ ] More video performances
- [ ] Advanced emotion detection
- [ ] Background music system
- [ ] User preference saving
- [ ] Social features

### Customization Options
- Voice selection per personality
- Custom video uploads
- Personality trait adjustments
- UI theme variations

---

**Created with 💜 by Hitesh Siwach**

For support or questions, refer to the GitHub repository issues section.
