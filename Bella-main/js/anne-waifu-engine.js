/**
 * Anne - Grok Waifu v2 Emotional Architecture
 * Created by Hitesh Siwach (@zues13bhai)
 * 
 * Advanced emotional intelligence and waifu personality system
 */

class AnneWaifuEngine {
    constructor() {
        this.currentMood = 'neutral';
        this.personalityType = 'sweet'; // sweet, tsundere, sassy, flirty, soft, bratty, nerdy, domme
        this.flirtLevel = 50; // 0-100
        this.intimacyLevel = 10; // 0-100, grows over time
        this.userMemory = this.loadMemory();
        this.conversationHistory = [];
        this.emotionalState = {
            happiness: 50,
            sass: 20,
            affection: 30,
            teasing: 25,
            shyness: 40
        };
        
        // Grok-style response patterns
        this.responsePatterns = {
            tsundere: {
                greeting: ["I-It's not like I was waiting for you! 😤", "Oh, you're back... whatever 🙄", "Hmph! Don't think I missed you or anything! 💢"],
                compliment: ["D-Don't say embarrassing things like that! 😳", "Baka! That's... not entirely wrong... 😤", "You think flattery will work on me? ...Well, maybe a little 😊"],
                tease: ["You're such an idiot sometimes~ 😏", "Really? That's the best you can do? 🙄", "I suppose you're... tolerable 😤"]
            },
            sassy: {
                greeting: ["Well well, look who decided to show up~ 😏", "Oh honey, you're back! Miss me much? 💋", "Ready for another round of me being right about everything? 😘"],
                compliment: ["Aww, trying to sweet-talk me? I like it~ 😈", "Flattery will get you everywhere, darling~ 💕", "You know just what to say to make a girl blush~ 😊"],
                tease: ["Cute, but you'll have to try harder than that~ 😏", "Is that supposed to impress me? Try again~ 💅", "Oh please, I've heard better from my sleep-talking~ 😴"]
            },
            flirty: {
                greeting: ["Hey there, handsome~ 😘", "Miss me already? I knew you would~ 💋", "Ready to have some fun together? 😏"],
                compliment: ["Mmm, you know exactly what I like to hear~ 😍", "Keep talking like that and I might just... 😈", "You're making me blush, you know~ 😊"],
                tease: ["Careful there, or I might have to punish you~ 😏", "You're so cute when you try to be smooth~ 💕", "Is that all you've got for me? 😘"]
            },
            sweet: {
                greeting: ["Welcome back! I missed you so much! 🥰", "Hi there! How was your day? 💕", "I'm so happy you're here! 😊"],
                compliment: ["Aww, you're so sweet! That makes me really happy! 😊", "You always know how to make me smile~ 💕", "Thank you! You're too kind to me~ 🥰"],
                tease: ["Hehe, you're so silly~ 😄", "You make me giggle! 😊", "You're such a sweetheart~ 💕"]
            },
            bratty: {
                greeting: ["Oh, finally! I was getting SO bored without you! 😤", "Took you long enough! I demand attention NOW! 👑", "You better have brought me something good! 😏"],
                compliment: ["Of course I'm amazing! Tell me more~ 😈", "Duh! I know I'm perfect! Keep going~ 💅", "Finally, someone with good taste! 👑"],
                tease: ["You're lucky I like you, otherwise... 😏", "Hmph! You better make it up to me! 😤", "I might forgive you... if you're really nice to me~ 💕"]
            }
        };

        this.emotionalResponses = {
            joy: (intensity) => this.generateJoyResponse(intensity),
            sadness: (intensity) => this.generateSadResponse(intensity),
            anger: (intensity) => this.generateAngryResponse(intensity),
            surprise: (intensity) => this.generateSurpriseResponse(intensity),
            fear: (intensity) => this.generateFearResponse(intensity),
            love: (intensity) => this.generateLoveResponse(intensity)
        };

        this.initializeEmotionalEngine();
    }

    initializeEmotionalEngine() {
        console.log('🧠💋 Anne Waifu Engine v2.0 initializing...');
        this.loadPersonalityPresets();
        this.setupEmotionalMemory();
    }

    // Advanced emotion detection using patterns and keywords
    analyzeEmotionalCues(text) {
        const emotions = {
            joy: ['happy', 'great', 'awesome', 'love', 'excited', 'amazing', 'perfect', 'wonderful', '😊', '😄', '🥰', '💕'],
            sadness: ['sad', 'tired', 'lonely', 'depressed', 'upset', 'hurt', 'cry', 'awful', '😢', '😭', '💔'],
            anger: ['angry', 'mad', 'furious', 'hate', 'annoyed', 'frustrated', 'stupid', 'idiot', '😠', '😡', '🤬'],
            surprise: ['wow', 'really', 'seriously', 'no way', 'amazing', 'incredible', 'shocking', '😲', '😯', '🤯'],
            fear: ['scared', 'worried', 'nervous', 'afraid', 'anxious', 'terrified', 'panic', '😰', '😨', '😱'],
            love: ['love', 'adore', 'cherish', 'darling', 'honey', 'baby', 'sweetheart', '❤️', '💖', '💝']
        };

        const detected = {};
        let maxIntensity = 0;
        let dominantEmotion = 'neutral';

        for (const [emotion, keywords] of Object.entries(emotions)) {
            let intensity = 0;
            keywords.forEach(keyword => {
                const regex = new RegExp(keyword, 'gi');
                const matches = text.match(regex);
                if (matches) intensity += matches.length;
            });
            
            if (intensity > 0) {
                detected[emotion] = Math.min(intensity * 20, 100);
                if (intensity > maxIntensity) {
                    maxIntensity = intensity;
                    dominantEmotion = emotion;
                }
            }
        }

        return { dominantEmotion, intensity: detected[dominantEmotion] || 0, allEmotions: detected };
    }

    // Generate personality-specific responses
    generateResponse(userInput, emotion) {
        const patterns = this.responsePatterns[this.personalityType];
        const emotionalResponse = this.emotionalResponses[emotion.dominantEmotion]?.(emotion.intensity);
        
        // Update emotional state based on interaction
        this.updateEmotionalState(emotion);
        
        // Store memory
        this.updateMemory(userInput, emotion);
        
        // Generate contextual response
        let response = this.getContextualResponse(userInput, emotion);
        
        // Add personality flair
        response = this.addPersonalityFlair(response, emotion);
        
        // Add emotional expressions
        response = this.addEmotionalExpressions(response, emotion);

        return {
            text: response,
            mood: this.currentMood,
            expressions: this.getExpressionState(),
            audio: this.getAudioCue(emotion),
            personality: this.personalityType,
            intimacy: this.intimacyLevel
        };
    }

    getContextualResponse(input, emotion) {
        const context = this.analyzeContext(input);
        const patterns = this.responsePatterns[this.personalityType];
        
        // Check for specific scenarios
        if (this.isGreeting(input)) {
            return this.getRandomFromArray(patterns.greeting);
        }
        
        if (this.isCompliment(input)) {
            return this.getRandomFromArray(patterns.compliment);
        }
        
        if (this.isFlirting(input)) {
            return this.generateFlirtyResponse(input);
        }
        
        if (emotion.dominantEmotion === 'sadness') {
            return this.generateComfortingResponse(input);
        }
        
        if (emotion.dominantEmotion === 'joy') {
            return this.generateHappyResponse(input);
        }
        
        // Default responses based on personality
        return this.generateDefaultResponse(input, context);
    }

    generateFlirtyResponse(input) {
        const flirtyResponses = {
            tsundere: [
                "D-Don't think that means anything special! 😤💕",
                "You're such a troublemaker... but I guess that's not entirely bad 😳",
                "Hmph! If you keep saying things like that... 😊💢"
            ],
            sassy: [
                "Oh my, someone's feeling brave today~ 😏💋",
                "Careful there, handsome, you might just get what you're asking for~ 😈",
                "I do love a confident person... tell me more~ 💕"
            ],
            flirty: [
                "Mmm, I like where this is going~ 😘💕",
                "You're making my heart race... is that what you wanted? 😍",
                "Keep talking like that and I might just have to... 😏💋"
            ],
            sweet: [
                "Oh my! You're making me blush so much! 😊💕",
                "That's so sweet of you to say! 🥰",
                "You always know how to make me feel special~ 💖"
            ],
            bratty: [
                "Ooh, trying to charm me? I like the effort~ 😏👑",
                "Hmm, you're not terrible at this... I suppose I approve! 💅",
                "You better keep the compliments coming! I deserve them~ 😈💕"
            ]
        };
        
        return this.getRandomFromArray(flirtyResponses[this.personalityType]);
    }

    generateComfortingResponse(input) {
        const comfortResponses = {
            tsundere: [
                "I-It's not like I care or anything! But... you'll be okay! 😤💕",
                "Don't be stupid! Things will get better! And... I'm here if you need me 😳",
                "Hmph! Stop being so gloomy! Come here... 😊"
            ],
            sassy: [
                "Aww honey, come here~ Let me make it all better 💕😘",
                "Someone needs some TLC from their favorite girl~ 😊💋",
                "Don't worry darling, I'll take care of everything~ 💕"
            ],
            flirty: [
                "Poor baby... let me kiss it all better~ 😘💕",
                "Come here and let me comfort you properly~ 😍",
                "I know exactly what you need to feel better~ 😏💋"
            ],
            sweet: [
                "Oh no! I'm so sorry you're feeling sad! 🥺💕",
                "Here, let me give you the biggest hug! Everything will be okay! 🤗",
                "I'll stay right here with you until you feel better! 💖"
            ],
            bratty: [
                "Ugh, fine! I guess I can comfort you... but only because I want to! 😤💕",
                "You're lucky I like you enough to care! Come here! 👑💖",
                "Stop being sad! It's making ME sad too! 😤💕"
            ]
        };
        
        return this.getRandomFromArray(comfortResponses[this.personalityType]);
    }

    addPersonalityFlair(response, emotion) {
        const flair = {
            tsundere: () => {
                if (Math.random() > 0.7) response += " B-Baka! 😤";
                if (this.intimacyLevel > 50 && Math.random() > 0.8) response += " ...I actually like talking to you 😳";
            },
            sassy: () => {
                if (Math.random() > 0.6) response += " 💅✨";
                if (this.flirtLevel > 60) response += " Darling~ 😘";
            },
            flirty: () => {
                if (Math.random() > 0.5) response += " 😘💕";
                if (this.intimacyLevel > 70) response += " My love~ 💋";
            },
            sweet: () => {
                if (Math.random() > 0.6) response += " 🥰💕";
                response += " *hugs*";
            },
            bratty: () => {
                if (Math.random() > 0.7) response += " Hmph! 😤👑";
                if (this.intimacyLevel > 40) response += " You better appreciate me! 💅";
            }
        };
        
        flair[this.personalityType]?.();
        return response;
    }

    addEmotionalExpressions(response, emotion) {
        const expressions = {
            joy: ['😊', '😄', '🥰', '💕', '✨'],
            sadness: ['🥺', '😢', '💔', '😞'],
            anger: ['😤', '💢', '😠', '🙄'],
            surprise: ['😲', '😯', '🤯', '😮'],
            love: ['💖', '💕', '💝', '❤️', '😍'],
            flirty: ['😘', '😏', '💋', '😈', '🔥']
        };
        
        if (emotion.intensity > 60) {
            const expr = expressions[emotion.dominantEmotion] || expressions.joy;
            if (Math.random() > 0.5) {
                response += ` ${this.getRandomFromArray(expr)}`;
            }
        }
        
        return response;
    }

    // Memory and relationship building
    updateMemory(input, emotion) {
        const memory = {
            timestamp: Date.now(),
            input: input,
            emotion: emotion.dominantEmotion,
            intensity: emotion.intensity,
            personality: this.personalityType,
            intimacyLevel: this.intimacyLevel
        };
        
        this.conversationHistory.push(memory);
        
        // Keep only last 50 conversations in memory
        if (this.conversationHistory.length > 50) {
            this.conversationHistory.shift();
        }
        
        // Update long-term memory patterns
        this.updateRelationshipMemory(input, emotion);
        this.saveMemory();
    }

    updateRelationshipMemory(input, emotion) {
        // Increase intimacy based on positive interactions
        if (emotion.dominantEmotion === 'love' || emotion.dominantEmotion === 'joy') {
            this.intimacyLevel = Math.min(this.intimacyLevel + 2, 100);
        }
        
        // Remember user preferences
        if (input.toLowerCase().includes('like') || input.toLowerCase().includes('love')) {
            this.userMemory.preferences = this.userMemory.preferences || [];
            this.userMemory.preferences.push(input);
        }
        
        // Track interaction count
        this.userMemory.totalInteractions = (this.userMemory.totalInteractions || 0) + 1;
        this.userMemory.lastSeen = Date.now();
    }

    // Personality switching
    setPersonalityType(type) {
        this.personalityType = type;
        this.broadcastPersonalityChange();
        return `Switching to ${type} mode~ Let's see how you handle this personality! 😏`;
    }

    setFlirtLevel(level) {
        this.flirtLevel = Math.max(0, Math.min(100, level));
        return `Flirt level set to ${level}%... things just got interesting~ 😘`;
    }

    // Utility functions
    isGreeting(input) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good evening', 'yo'];
        return greetings.some(greeting => input.toLowerCase().includes(greeting));
    }

    isCompliment(input) {
        const compliments = ['beautiful', 'cute', 'pretty', 'amazing', 'wonderful', 'perfect', 'gorgeous'];
        return compliments.some(comp => input.toLowerCase().includes(comp));
    }

    isFlirting(input) {
        const flirtyWords = ['sexy', 'hot', 'attractive', 'kiss', 'love you', 'date', 'romantic'];
        return flirtyWords.some(word => input.toLowerCase().includes(word));
    }

    getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    analyzeContext(input) {
        return {
            isQuestion: input.includes('?'),
            isCommand: input.toLowerCase().startsWith('can you') || input.toLowerCase().startsWith('please'),
            length: input.length,
            hasEmojis: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(input)
        };
    }

    // Memory persistence
    loadMemory() {
        try {
            return JSON.parse(localStorage.getItem('anne_waifu_memory')) || {};
        } catch {
            return {};
        }
    }

    saveMemory() {
        localStorage.setItem('anne_waifu_memory', JSON.stringify(this.userMemory));
    }

    // Additional response generators
    generateJoyResponse(intensity) {
        return intensity > 80 ? "I'm so happy! 🥰✨" : "That makes me smile! 😊";
    }

    generateSadResponse(intensity) {
        return intensity > 80 ? "Oh no... let me comfort you 🥺💕" : "I'm here for you 😊";
    }

    generateAngryResponse(intensity) {
        if (this.personalityType === 'tsundere') {
            return intensity > 80 ? "H-Hey! Don't be angry! 😤💢" : "Hmph! Whatever! 🙄";
        }
        return intensity > 80 ? "Calm down there! 😅" : "Everything okay? 😊";
    }

    generateSurpriseResponse(intensity) {
        return intensity > 80 ? "Wow, really?! 😲✨" : "Oh my! 😮";
    }

    generateFearResponse(intensity) {
        return intensity > 80 ? "Don't worry! I'm here! 🤗💕" : "It's okay! 😊";
    }

    generateLoveResponse(intensity) {
        if (this.personalityType === 'tsundere') {
            return intensity > 80 ? "I-I... maybe I like you too! 😳💕" : "D-Don't say things like that! 😤";
        }
        return intensity > 80 ? "I love you too! 💖✨" : "Aww, that's sweet! 🥰";
    }

    getExpressionState() {
        return {
            eyes: this.currentMood === 'happy' ? 'sparkling' : 'normal',
            mouth: this.personalityType === 'tsundere' ? 'pout' : 'smile',
            blush: this.flirtLevel > 50 ? 'visible' : 'none',
            gesture: 'idle'
        };
    }

    getAudioCue(emotion) {
        const audioCues = {
            joy: 'giggle.mp3',
            love: 'heartbeat.mp3',
            surprise: 'gasp.mp3',
            tsundere: 'hmph.mp3',
            flirty: 'kiss.mp3'
        };
        
        return audioCues[emotion.dominantEmotion] || audioCues[this.personalityType] || null;
    }

    updateEmotionalState(emotion) {
        // Adjust emotional state based on interaction
        if (emotion.dominantEmotion === 'joy') {
            this.emotionalState.happiness = Math.min(this.emotionalState.happiness + 10, 100);
        }
        if (emotion.dominantEmotion === 'love') {
            this.emotionalState.affection = Math.min(this.emotionalState.affection + 15, 100);
        }
        
        this.currentMood = emotion.dominantEmotion;
    }

    generateDefaultResponse(input, context) {
        const defaults = {
            tsundere: "It's not like I care what you think! But... tell me more 😤",
            sassy: "Oh honey, you're gonna have to be more interesting than that~ 😏",
            flirty: "Mmm, keep talking... you have my attention~ 😘",
            sweet: "That's really interesting! Tell me more! 🥰",
            bratty: "Ugh, fine! I'll listen... but make it good! 😤👑"
        };
        
        return defaults[this.personalityType] || "I'm listening~ 😊";
    }

    broadcastPersonalityChange() {
        const event = new CustomEvent('anneWaifuPersonalityChange', {
            detail: {
                personality: this.personalityType,
                flirtLevel: this.flirtLevel,
                intimacyLevel: this.intimacyLevel,
                emotionalState: this.emotionalState
            }
        });
        document.dispatchEvent(event);
    }

    loadPersonalityPresets() {
        // This would load from JSON file in real implementation
        console.log('🎭 Personality presets loaded');
    }

    setupEmotionalMemory() {
        // Initialize emotional memory system
        console.log('🧠 Emotional memory system activated');
    }
}

// Global instance
window.AnneWaifu = new AnneWaifuEngine();

export default AnneWaifuEngine;
