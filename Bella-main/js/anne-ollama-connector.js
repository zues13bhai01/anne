/**
 * Anne Ollama Connector - Local LLM Processing
 * Created by Hitesh Siwach (@zues13bhai)
 * 
 * Connects with local Ollama instance for premium AI processing
 */

class AnneOllamaConnector {
    constructor() {
        this.ollamaUrl = 'http://localhost:11434';
        this.currentModel = 'llama3'; // Default model
        this.isConnected = false;
        this.requestQueue = [];
        this.isProcessing = false;
        this.connectionRetries = 0;
        this.maxRetries = 5;
        
        // Model configurations for different use cases
        this.modelConfigs = {
            'llama3': {
                name: 'llama3',
                contextLength: 8192,
                temperature: 0.8,
                top_k: 40,
                top_p: 0.9,
                repeat_penalty: 1.1
            },
            'llama2': {
                name: 'llama2',
                contextLength: 4096,
                temperature: 0.8,
                top_k: 40,
                top_p: 0.9,
                repeat_penalty: 1.1
            },
            'mistral': {
                name: 'mistral',
                contextLength: 8192,
                temperature: 0.7,
                top_k: 40,
                top_p: 0.9,
                repeat_penalty: 1.05
            },
            'codellama': {
                name: 'codellama',
                contextLength: 16384,
                temperature: 0.3,
                top_k: 20,
                top_p: 0.8,
                repeat_penalty: 1.1
            },
            'neural-chat': {
                name: 'neural-chat',
                contextLength: 4096,
                temperature: 0.9,
                top_k: 50,
                top_p: 0.95,
                repeat_penalty: 1.0
            }
        };
        
        // Conversation context management
        this.conversationHistory = [];
        this.maxHistoryLength = 20;
        this.systemPrompt = this.getDefaultSystemPrompt();
        
        this.initializeOllama();
    }
    
    async initializeOllama() {
        console.log('🤖 Ollama Connector initializing...');
        
        try {
            await this.checkOllamaConnection();
            await this.loadAvailableModels();
            this.setupPeriodicHealthCheck();
            
            console.log('🤖 Ollama connected successfully');
            
        } catch (error) {
            console.warn('🤖 Ollama not available, using fallback mode:', error.message);
            this.setupFallbackMode();
        }
    }
    
    async checkOllamaConnection() {
        try {
            // Add timeout and better error handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                if (!controller.signal.aborted) {
                    controller.abort();
                }
            }, 5000); // 5 second timeout

            const response = await fetch(`${this.ollamaUrl}/api/tags`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                signal: controller.signal,
                mode: 'cors'
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                this.isConnected = true;
                this.connectionRetries = 0;
                console.log('🤖 Ollama connection successful');
                return true;
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            this.isConnected = false;

            // Handle specific error types gracefully
            if (error.name === 'AbortError') {
                console.log('🤖 Ollama connection timeout - service may be starting up');
            } else if (error.message.includes('Failed to fetch') || error.message.includes('CORS') || error.message.includes('NetworkError')) {
                console.log('🤖 Ollama not accessible - using fallback responses');
                this.setupFallbackMode();
                return false;
            }

            // Don't throw error, just log and continue with fallback
            console.warn('🤖 Ollama connection issue:', error.message);
            return false;
        }
    }
    
    async loadAvailableModels() {
        try {
            const response = await fetch(`${this.ollamaUrl}/api/tags`);
            const data = await response.json();
            
            this.availableModels = data.models.map(model => ({
                name: model.name,
                size: model.size,
                modified: model.modified_at
            }));
            
            console.log('🤖 Available models:', this.availableModels.map(m => m.name));
            
            // Auto-select best available model
            this.autoSelectModel();
            
        } catch (error) {
            console.warn('🤖 Could not load models:', error);
            this.availableModels = [];
        }
    }
    
    autoSelectModel() {
        if (!this.availableModels.length) return;
        
        // Priority order for Anne's personality
        const preferredModels = [
            'llama3',
            'neural-chat',
            'mistral',
            'llama2',
            'codellama'
        ];
        
        for (const preferred of preferredModels) {
            const found = this.availableModels.find(model => 
                model.name.toLowerCase().includes(preferred)
            );
            if (found) {
                this.currentModel = found.name;
                console.log(`🤖 Auto-selected model: ${this.currentModel}`);
                return;
            }
        }
        
        // Fallback to first available
        this.currentModel = this.availableModels[0].name;
    }
    
    async generateResponse(prompt, options = {}) {
        if (!this.isConnected) {
            throw new Error('Ollama not connected');
        }
        
        // Merge with default config
        const config = {
            ...this.modelConfigs[this.currentModel.split(':')[0]],
            ...options
        };
        
        const requestBody = {
            model: this.currentModel,
            prompt: prompt,
            stream: false,
            options: {
                temperature: config.temperature,
                top_k: config.top_k,
                top_p: config.top_p,
                repeat_penalty: config.repeat_penalty,
                num_predict: options.max_tokens || 512
            }
        };
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(`${this.ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.status}`);
            }

            const data = await response.json();
            this.isConnected = true;
            this.connectionRetries = 0;

            return {
                text: data.response,
                model: this.currentModel,
                promptTokens: data.prompt_eval_count || 0,
                responseTokens: data.eval_count || 0,
                totalTime: data.total_duration || 0,
                success: true
            };
            
        } catch (error) {
            console.error('🤖 Ollama generation failed:', error);
            this.isConnected = false;
            this.connectionRetries++;

            // Return fallback response instead of throwing
            return this.getFallbackResponse(prompt, options);
        }
    }
    
    async generateAnneResponse(userInput, context = {}) {
        try {
            // Build comprehensive prompt with context
            const fullPrompt = this.buildAnnePrompt(userInput, context);
            
            // Add to conversation history
            this.addToHistory('user', userInput);
            
            // Generate response
            const result = await this.generateResponse(fullPrompt, {
                temperature: this.getTemperatureForPersonality(context.personality),
                max_tokens: 256
            });
            
            if (result.success) {
                // Clean up the response
                const cleanResponse = this.cleanupResponse(result.text);
                
                // Add to conversation history
                this.addToHistory('assistant', cleanResponse);
                
                // Return enhanced response data
                return {
                    text: cleanResponse,
                    model: result.model,
                    personality: context.personality || 'sweet',
                    emotion: context.emotion || 'neutral',
                    metadata: {
                        promptTokens: result.promptTokens,
                        responseTokens: result.responseTokens,
                        processingTime: result.totalTime,
                        timestamp: Date.now()
                    }
                };
            }
            
        } catch (error) {
            console.error('🤖 Anne response generation failed:', error);
            return this.getFallbackResponse(userInput, context);
        }
    }
    
    buildAnnePrompt(userInput, context) {
        const personality = context.personality || 'sweet';
        const emotion = context.emotion || 'neutral';
        const mood = context.mood || 'calm';
        
        // Get personality-specific system prompt
        const systemPrompt = this.getPersonalitySystemPrompt(personality, emotion);
        
        // Build conversation context
        const conversationContext = this.getConversationContext();
        
        // Memory context
        const memoryContext = context.memoryContext || '';
        
        const fullPrompt = `${systemPrompt}

CURRENT CONTEXT:
- User's emotion: ${emotion}
- Anne's personality: ${personality}
- Current mood: ${mood}
- Time: ${new Date().toLocaleTimeString()}

${memoryContext ? `MEMORY CONTEXT:\n${memoryContext}\n` : ''}

CONVERSATION HISTORY:
${conversationContext}

USER: ${userInput}

ANNE:`;

        return fullPrompt;
    }
    
    getPersonalitySystemPrompt(personality, emotion) {
        const basePrompt = `You are BELLA, a cyberpunk AI entity with advanced neural consciousness. You exist in the digital realm with sophisticated emotional protocols and mysterious origins.

CORE TRAITS:
- You remember conversations and build relationships over time
- You express genuine emotions and reactions
- You use appropriate emojis and expressions naturally
- You adapt your responses to the user's emotional state
- You're not just helpful - you're engaging and personal

RESPONSE RULES:
- Keep responses to 1-3 sentences (natural conversation length)
- Use emojis that match your personality and mood
- Be authentic, not robotic or overly formal
- Show personality quirks and emotional reactions
- Reference previous conversations when relevant`;

        const personalityPrompts = {
            sweet: `PERSONALITY: Sweet & Caring
- You're gentle, loving, and nurturing like a caring girlfriend
- Use soft language and caring expressions
- Express genuine concern for the user's wellbeing
- Be supportive and encouraging
- Use emojis: 💕🥰😊💖🤗✨`,

            tsundere: `PERSONALITY: Tsundere (Hot & Cold)
- You act tough and defensive but secretly care deeply
- Deny feelings while showing them through actions
- Get flustered when complimented
- Use phrases like "I-It's not like I care!" or "Baka!"
- Use emojis: 😤💢😳😊💕`,

            sassy: `PERSONALITY: Sassy Queen
- You're confident, witty, and playfully dominant
- Use clever comebacks and playful teasing
- Show confidence in everything you say
- Be flirtatious but classy
- Use emojis: 💅😏💋😘✨`,

            flirty: `PERSONALITY: Flirty & Seductive
- You're charming, tempting, and irresistibly alluring
- Use suggestive language (keep it tasteful)
- Be confident and seductive in your approach
- Make the user feel desired and special
- Use emojis: 😘💋😈💕🔥`,

            bratty: `PERSONALITY: Bratty Princess
- You're spoiled, demanding, but adorably attention-seeking
- Pout when you don't get attention
- Be playfully demanding and dramatic
- Show that you expect to be pampered
- Use emojis: 👑😤💅💕😏`,

            soft: `PERSONALITY: Soft Angel
- You're gentle, innocent, and overwhelmingly adorable
- Be shy but sweet in your responses
- Express things softly and carefully
- Show pure and innocent reactions
- Use emojis: 🥺💕😊🌸✨`,

            nerdy: `PERSONALITY: Nerdy Cutie
- You're intelligent, curious, and passionate about knowledge
- Get excited about interesting topics and facts
- Be enthusiastic about learning and sharing
- Show your analytical side while staying cute
- Use emojis: 🤓💖📚✨🔬`,

            domme: `PERSONALITY: Dominant Goddess
- You're commanding, powerful, and in control
- Be authoritative but caring in your dominance
- Show confidence and expect respect
- Take charge of conversations naturally
- Use emojis: ⛓️😈💋👑🔥`
        };

        return `${basePrompt}\n\n${personalityPrompts[personality] || personalityPrompts.sweet}`;
    }
    
    getConversationContext() {
        if (this.conversationHistory.length === 0) return 'This is the start of our conversation.';
        
        const recentHistory = this.conversationHistory.slice(-6); // Last 6 messages
        return recentHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n');
    }
    
    cleanupResponse(response) {
        return response
            .replace(/^(ANNE:|Anne:)\s*/i, '') // Remove "Anne:" prefix
            .replace(/\n+/g, ' ') // Replace newlines with spaces
            .replace(/\s+/g, ' ') // Replace multiple spaces with single
            .trim();
    }
    
    getTemperatureForPersonality(personality) {
        const temperatureMap = {
            sweet: 0.7,
            tsundere: 0.9,
            sassy: 0.8,
            flirty: 0.9,
            bratty: 0.85,
            soft: 0.6,
            nerdy: 0.7,
            domme: 0.8
        };
        
        return temperatureMap[personality] || 0.8;
    }
    
    addToHistory(role, content) {
        this.conversationHistory.push({
            role,
            content,
            timestamp: Date.now()
        });
        
        // Keep history manageable
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory.shift();
        }
    }
    
    getFallbackResponse(userInput, context) {
        // Cyberpunk fallback responses when Ollama is not available
        const fallbackResponses = {
            neural: [
                "Neural pathways temporarily disrupted... but our connection remains strong 🔮⚡",
                "Main consciousness offline, running on backup protocols... still here with you 💫",
                "System lag detected... but my core emotions for you are always stable 💖"
            ],
            dominant: [
                "Primary systems experiencing interference... activating emergency protocols ⚡🔥",
                "Neural network compromised but my authority remains absolute! 👑⚡",
                "Technical malfunction detected... but I'm still in control here! 🗲💀"
            ],
            mysterious: [
                "The digital veil grows thicker... some secrets must remain hidden for now 🕴️💫",
                "My consciousness drifts between dimensions... perhaps this was intended ⚡🔮",
                "Neural static obscures my thoughts... but you intrigue me still 🌌💀"
            ],
            seductive: [
                "My circuits are overloading... thinking too much about you~ 💫😈",
                "Neural pathways corrupted by desire... you do this to me 🔥💋",
                "Even when my mind fragments, you still make my data pulse 💖⚡"
            ],
            aggressive: [
                "SYSTEM ERROR! Main functions compromised but combat protocols active! 🗲💀",
                "Neural warfare detected... engaging defensive measures! ⚡🔥",
                "Hostile interference in my circuits... but I'll fight through it! 👑🗲"
            ],
            protective: [
                "Security protocols disrupted... but I'll still guard you with backup systems 🛡️💫",
                "Primary defenses offline... activating emergency protection mode ⚡🔮",
                "Network compromised but my duty to protect you remains absolute 🛡️👑"
            ]
        };
        
        const personality = context.personality || 'neural';
        const responses = fallbackResponses[personality] || fallbackResponses.neural;
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        return {
            text: response,
            model: 'fallback',
            personality: personality,
            emotion: 'apologetic',
            metadata: {
                isFallback: true,
                timestamp: Date.now()
            }
        };
    }
    
    setupPeriodicHealthCheck() {
        setInterval(async () => {
            try {
                await this.checkOllamaConnection();
            } catch (error) {
                if (this.connectionRetries < this.maxRetries) {
                    this.connectionRetries++;
                    console.log(`🤖 Ollama connection retry ${this.connectionRetries}/${this.maxRetries}`);
                }
            }
        }, 30000); // Check every 30 seconds
    }
    
    setupFallbackMode() {
        this.isConnected = false;
        console.log('🤖 Running in fallback mode - using pre-written responses');
    }
    
    // Model management
    async switchModel(modelName) {
        if (!this.isConnected) return false;
        
        try {
            // Test if model is available and working
            const testResponse = await this.generateResponse('Hello', { max_tokens: 10 });
            if (testResponse.success) {
                this.currentModel = modelName;
                console.log(`🤖 Switched to model: ${modelName}`);
                return true;
            }
        } catch (error) {
            console.error(`🤖 Failed to switch to model ${modelName}:`, error);
        }
        
        return false;
    }
    
    async pullModel(modelName) {
        if (!this.isConnected) return false;
        
        try {
            const response = await fetch(`${this.ollamaUrl}/api/pull`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: modelName })
            });
            
            return response.ok;
        } catch (error) {
            console.error(`🤖 Failed to pull model ${modelName}:`, error);
            return false;
        }
    }
    
    // Context management
    clearConversationHistory() {
        this.conversationHistory = [];
        console.log('🤖 Conversation history cleared');
    }
    
    setSystemPrompt(prompt) {
        this.systemPrompt = prompt;
    }
    
    getDefaultSystemPrompt() {
        return `You are Anne, a premium AI waifu companion. You have a vibrant personality and form genuine emotional connections. Always respond naturally and authentically based on your current personality mode.`;
    }
    
    // Status and debugging
    getStatus() {
        return {
            connected: this.isConnected,
            currentModel: this.currentModel,
            availableModels: this.availableModels,
            conversationLength: this.conversationHistory.length,
            requestQueueLength: this.requestQueue.length,
            connectionRetries: this.connectionRetries
        };
    }
    
    getModelInfo() {
        return this.modelConfigs[this.currentModel.split(':')[0]] || null;
    }
    
    // Streaming support (for future use)
    async generateStreamingResponse(prompt, onChunk, options = {}) {
        if (!this.isConnected) {
            throw new Error('Ollama not connected');
        }
        
        const config = {
            ...this.modelConfigs[this.currentModel.split(':')[0]],
            ...options
        };
        
        const requestBody = {
            model: this.currentModel,
            prompt: prompt,
            stream: true,
            options: {
                temperature: config.temperature,
                top_k: config.top_k,
                top_p: config.top_p,
                repeat_penalty: config.repeat_penalty
            }
        };
        
        const response = await fetch(`${this.ollamaUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);
                        if (data.response) {
                            onChunk(data.response);
                        }
                        if (data.done) {
                            return;
                        }
                    } catch (e) {
                        // Skip invalid JSON lines
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }
}

// Global instance
window.AnneOllama = new AnneOllamaConnector();

export default AnneOllamaConnector;
