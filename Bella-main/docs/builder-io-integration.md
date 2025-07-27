# Builder.io Integration Setup for Anne
*Created by Hitesh Siwach (@zues13bhai)*

## Overview

This guide explains how to integrate Anne with Builder.io for enhanced visual development and dynamic UI creation.

## Core Components Ready for Builder.io

### 1. Dynamic Variables to Expose

```javascript
// Anne's State Variables
{
  userPrompt: string,           // User input text
  selectedRole: string,         // "companion" | "strategist" | "coder" | "creative_partner"  
  emotionalTone: string,        // "calm" | "inspired" | "focused" | "caring" | "curious"
  anneResponse: string,         // Anne's generated response
  theme: string,                // "minimal" | "anime" | "cyberpunk"
  systemPrompt: string,         // Core personality prompt
  memoryState: string           // "context-aware" | "short-term" | "retrieving"
}
```

### 2. Components to Import/Recreate

#### A. Core UI Components
- **PersonalityDisplay** (`personality-display` class)
- **RoleSelector** (`role-selector` class) 
- **AnneInteractionPanel** (`anne-interaction-panel` class)
- **ResponseArea** (`anne-response-area` class)

#### B. Interactive Elements
- **ElegantButton** (`.elegant-button` with primary/secondary variants)
- **ThoughtfulTextarea** (`.input-container textarea`)
- **VideoBackground** (existing video system)

### 3. Assets to Upload

```
📁 /assets/
├── 🖼️ anne-avatar.png          # Anne's visual representation
├── 🎵 ambient-theme.mp3        # Background music
├── 📄 anne-personality.json    # Personality configuration
├── 📄 anne-core-prompt.md      # System prompt template
└── 🎨 personality-themes.css   # Color schemes
```

## Builder.io Configuration

### Dynamic Content Structure

```json
{
  "model": "anne-interface",
  "variables": {
    "role": "companion",
    "emotion": "calm", 
    "userInput": "",
    "anneOutput": ""
  },
  "components": [
    {
      "name": "PersonalityHeader",
      "bindings": {
        "role": "{{role}}",
        "emotion": "{{emotion}}"
      }
    },
    {
      "name": "ConversationPanel", 
      "bindings": {
        "input": "{{userInput}}",
        "output": "{{anneOutput}}"
      }
    }
  ]
}
```

### Page Templates for Builder.io

#### 1. **Landing Page** - `/anne`
- Hero section with Anne introduction
- Feature showcase (personality roles, memory, creativity)
- Call-to-action: "Meet Anne"

#### 2. **Playground** - `/anne/chat`
- Live personality selector
- Real-time conversation interface
- Prompt debugging panel (dev mode)

#### 3. **Memory Book** - `/anne/memory`
- Timeline of conversations
- Saved insights and reflections
- Growth visualization

## API Integration Points

### Backend Endpoints to Create

```javascript
// For Builder.io to connect with Anne's brain
POST /api/anne/think
{
  "input": "user message",
  "role": "companion",
  "context": "previous conversation"
}

GET /api/anne/personality
{
  "current_role": "companion",
  "emotional_state": "calm",
  "memory_summary": "..."
}

POST /api/anne/role
{
  "new_role": "strategist",
  "context": "switching for project planning"
}
```

## Advanced Builder.io Features

### 1. Dynamic Theme Switching
```css
/* CSS Custom Properties for Builder */
:root {
  --anne-primary: var(--theme-primary, #667eea);
  --anne-secondary: var(--theme-secondary, #764ba2);
  --anne-bg: var(--theme-bg, rgba(0,0,0,0.8));
}
```

### 2. Component State Management
```javascript
// Builder.io state handlers
function onRoleChange(newRole) {
  window.AnnePersonality.setRole(newRole);
  Builder.set('role', newRole);
}

function onEmotionDetected(emotion) {
  Builder.set('emotion', emotion);
  triggerVideoResponse(emotion);
}
```

### 3. Content Management
- **Personality Configs**: Editable in Builder CMS
- **Response Templates**: Visual template editor
- **Memory Patterns**: Configurable learning rules

## Development Workflow

### Phase 1: Component Migration
1. Export existing CSS/HTML to Builder components
2. Map state variables to Builder bindings
3. Test dynamic updates

### Phase 2: Enhanced UI
1. Drag-and-drop personality customization
2. Visual prompt engineering interface
3. Memory timeline builder

### Phase 3: Advanced Features
1. Multi-modal interaction (voice + visual)
2. Real-time collaboration tools
3. AI-powered layout suggestions

## Builder.io Custom Code Blocks

### Anne Personality Connector
```javascript
// Custom code block for Builder.io
(function() {
  // Connect Builder state to Anne's personality engine
  const connectAnneToBuilder = () => {
    if (window.AnnePersonality && window.Builder) {
      // Sync Anne's state with Builder
      window.AnnePersonality.on('change', (state) => {
        Builder.set('anneState', state);
      });
      
      // Listen for Builder updates
      Builder.subscribe('model.anneState', (state) => {
        window.AnnePersonality.setState(state);
      });
    }
  };
  
  // Initialize when both systems are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', connectAnneToBuilder);
  } else {
    connectAnneToBuilder();
  }
})();
```

## Next Steps

1. **Import Anne's Core**: Upload personality.json and components to Builder
2. **Create Variables**: Set up dynamic bindings for role/emotion/input
3. **Build Pages**: Use Builder's visual editor for enhanced layouts
4. **Test Integration**: Verify state synchronization between Anne and Builder
5. **Deploy**: Publish enhanced Anne experience

## Benefits of Builder.io Integration

- **Visual Development**: No-code personality customization
- **Dynamic Content**: Real-time UI updates based on Anne's state
- **Rapid Iteration**: Quick A/B testing of different interfaces
- **Content Management**: Non-technical editing of Anne's responses
- **Multi-variant**: Different Anne personalities for different use cases

---

*Anne's soul lives in code, but her expression can be painted with Builder.io's visual canvas.*
