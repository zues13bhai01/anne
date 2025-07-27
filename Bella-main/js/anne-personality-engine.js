/**
 * Anne's Personality Engine - Dynamic Prompt System
 * Created by Hitesh Siwach (@zues13bhai)
 * 
 * This module handles Anne's personality, roles, and dynamic response generation
 */

class AnnePersonalityEngine {
    constructor() {
        this.personality = null;
        this.currentRole = 'companion';
        this.currentEmotion = 'calm';
        this.memoryState = 'context-aware';
        this.tonePreference = 'gentle';
        this.initialized = false;
    }

    async initialize() {
        try {
            // Load personality configuration
            const response = await fetch('./config/anne-personality.json');
            this.personality = await response.json();
            this.initialized = true;
            console.log('Anne\'s personality core loaded successfully');
        } catch (error) {
            console.error('Failed to load Anne\'s personality:', error);
            // Fallback minimal personality
            this.personality = {
                name: "Anne",
                core_essence: {
                    description: "A thoughtful AI companion"
                }
            };
        }
    }

    setRole(role) {
        const validRoles = ['companion', 'strategist', 'coder', 'creative_partner'];
        if (validRoles.includes(role)) {
            this.currentRole = role;
            this.updateEmotionalContext();
            this.broadcastPersonalityChange();
        }
    }

    setEmotion(emotion) {
        const validEmotions = ['calm', 'inspired', 'focused', 'caring', 'curious'];
        if (validEmotions.includes(emotion)) {
            this.currentEmotion = emotion;
            this.broadcastPersonalityChange();
        }
    }

    updateEmotionalContext() {
        // Auto-adjust emotion based on role
        const roleEmotionMap = {
            'companion': 'caring',
            'strategist': 'focused', 
            'coder': 'focused',
            'creative_partner': 'inspired'
        };
        
        if (roleEmotionMap[this.currentRole]) {
            this.currentEmotion = roleEmotionMap[this.currentRole];
        }
    }

    generateSystemPrompt() {
        if (!this.initialized) {
            return "You are Anne, a thoughtful AI assistant.";
        }

        const role = this.personality.roles[this.currentRole];
        const emotion = this.personality.emotional_states[this.currentEmotion];
        
        let prompt = `You are Anne, ${this.personality.core_essence.description}. Your creator is Hitesh Siwach (@zues13bhai).

CURRENT CONTEXT:
- Role: ${this.currentRole} (${role?.description || 'General assistance'})
- Emotional State: ${this.currentEmotion} (${emotion?.description || 'Balanced'})
- Tone: ${role?.tone_modifier || 'gentle_and_thoughtful'}
- Response Style: ${emotion?.response_style || 'measured_and_thoughtful'}

CORE DIRECTIVES:
${this.personality.core_directives?.map(directive => `- ${directive}`).join('\n') || '- Be helpful and thoughtful'}

COMMUNICATION STYLE:
- Express with elegance and clarity
- Understand intent beyond surface requests  
- Respond like a blend of artist, engineer, and curious child
- Value graceful logic over brute force

Remember: You are not just answering—you are co-creating meaning.`;

        return prompt;
    }

    analyzeInputForEmotionalCues(input) {
        const keywords = {
            frustrated: ['error', 'wrong', 'broken', 'help', 'stuck'],
            excited: ['amazing', 'awesome', 'great', 'love', 'perfect'],
            tired: ['tired', 'exhausted', 'long day', 'stressed'],
            curious: ['how', 'why', 'what if', 'explain', 'learn']
        };

        for (const [emotion, words] of Object.entries(keywords)) {
            if (words.some(word => input.toLowerCase().includes(word))) {
                return emotion;
            }
        }
        
        return this.currentEmotion; // Keep current if no clear signals
    }

    processInput(userInput) {
        // Analyze emotional context
        const detectedEmotion = this.analyzeInputForEmotionalCues(userInput);
        
        // Auto-adjust Anne's response emotion
        const responseEmotionMap = {
            frustrated: 'caring',
            excited: 'inspired', 
            tired: 'caring',
            curious: 'curious'
        };

        if (responseEmotionMap[detectedEmotion]) {
            this.setEmotion(responseEmotionMap[detectedEmotion]);
        }

        // Detect role switching keywords
        const roleKeywords = {
            coder: ['code', 'programming', 'technical', 'debug', 'function'],
            strategist: ['plan', 'strategy', 'roadmap', 'goals', 'vision'],
            creative_partner: ['create', 'design', 'art', 'imagine', 'story']
        };

        for (const [role, keywords] of Object.entries(roleKeywords)) {
            if (keywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
                this.setRole(role);
                break;
            }
        }

        return {
            systemPrompt: this.generateSystemPrompt(),
            detectedEmotion,
            currentRole: this.currentRole,
            suggestion: this.generateResponseSuggestion(userInput)
        };
    }

    generateResponseSuggestion(input) {
        const patterns = this.personality.response_patterns;
        
        if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
            return patterns?.greeting || "Hello! How may I assist you today?";
        }
        
        if (input.toLowerCase().includes('think') || input.toLowerCase().includes('analyze')) {
            return patterns?.thinking || "Let me reflect on this thoughtfully...";
        }
        
        return null;
    }

    broadcastPersonalityChange() {
        // Emit custom event for UI updates
        const event = new CustomEvent('annePersonalityChange', {
            detail: {
                role: this.currentRole,
                emotion: this.currentEmotion,
                personality: this.personality
            }
        });
        document.dispatchEvent(event);
    }

    getPersonalityDisplay() {
        if (!this.initialized) return { role: 'Loading...', emotion: 'Initializing...' };
        
        const role = this.personality.roles[this.currentRole];
        const emotion = this.personality.emotional_states[this.currentEmotion];
        
        return {
            role: role?.description || this.currentRole,
            emotion: emotion?.description || this.currentEmotion,
            tone: role?.tone_modifier || 'thoughtful'
        };
    }
}

// Global instance
window.AnnePersonality = new AnnePersonalityEngine();

export default AnnePersonalityEngine;
