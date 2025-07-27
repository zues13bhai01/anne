/**
 * Anne Memory Engine - Persistent Relationship Layer
 * Created by Hitesh Siwach (@zues13bhai)
 * 
 * Advanced memory system for relationship building and emotional growth
 */

class AnneMemoryEngine {
    constructor() {
        this.memoryStore = this.loadMemory();
        this.sessionMemory = [];
        this.emotionalMemory = [];
        this.relationshipMilestones = [];
        
        this.memoryCategories = {
            preferences: [], // User likes/dislikes
            personal: [],    // Personal info about user
            emotional: [],   // Emotional moments
            funny: [],       // Funny/memorable moments
            intimate: [],    // Special intimate moments
            achievements: [] // Relationship milestones
        };
        
        this.contextWindow = 10; // Number of recent messages to keep in active memory
        this.maxLongTermMemories = 100; // Maximum memories to store
        
        this.initializeMemorySystem();
    }
    
    initializeMemorySystem() {
        console.log('🧠 Anne Memory Engine initializing...');
        
        // Load existing memories
        this.loadCategorizedMemories();
        
        // Set up periodic memory consolidation
        this.setupMemoryConsolidation();
        
        console.log(`💭 Loaded ${this.getTotalMemoryCount()} memories`);
    }
    
    // Store new memory with emotion and importance scoring
    storeMemory(content, metadata = {}) {
        const memory = {
            id: this.generateMemoryId(),
            content: content,
            timestamp: Date.now(),
            emotion: metadata.emotion || 'neutral',
            importance: metadata.importance || this.calculateImportance(content, metadata),
            category: metadata.category || this.categorizeMemory(content),
            context: metadata.context || {},
            accessCount: 0,
            lastAccessed: Date.now()
        };
        
        // Add to appropriate category
        this.addToCategory(memory);
        
        // Add to session memory
        this.sessionMemory.push(memory);
        
        // Check for relationship milestones
        this.checkForMilestones();
        
        // Save to persistent storage
        this.saveMemory();
        
        console.log(`💭 Stored memory: ${memory.category} - ${memory.content.substring(0, 50)}...`);
        
        return memory;
    }
    
    // Retrieve relevant memories based on context
    retrieveMemories(query, limit = 5) {
        const allMemories = this.getAllMemories();
        
        // Score memories based on relevance
        const scoredMemories = allMemories.map(memory => ({
            memory,
            score: this.calculateRelevanceScore(memory, query)
        }));
        
        // Sort by relevance and recency
        scoredMemories.sort((a, b) => {
            if (Math.abs(a.score - b.score) < 0.1) {
                return b.memory.timestamp - a.memory.timestamp; // More recent first
            }
            return b.score - a.score; // Higher relevance first
        });
        
        // Update access count
        const relevantMemories = scoredMemories.slice(0, limit).map(item => {
            item.memory.accessCount++;
            item.memory.lastAccessed = Date.now();
            return item.memory;
        });
        
        this.saveMemory();
        return relevantMemories;
    }
    
    // Calculate memory importance (0-100)
    calculateImportance(content, metadata) {
        let importance = 30; // Base importance
        
        // Emotional intensity increases importance
        if (metadata.emotionIntensity) {
            importance += metadata.emotionIntensity * 0.5;
        }
        
        // Personal information is important
        if (this.containsPersonalInfo(content)) {
            importance += 25;
        }
        
        // First times are important
        if (content.toLowerCase().includes('first time') || content.toLowerCase().includes('never')) {
            importance += 20;
        }
        
        // Preferences are important
        if (content.toLowerCase().includes('like') || content.toLowerCase().includes('love') || 
            content.toLowerCase().includes('hate') || content.toLowerCase().includes('prefer')) {
            importance += 15;
        }
        
        // Intimate moments are very important
        if (metadata.isIntimate || this.detectIntimateContent(content)) {
            importance += 30;
        }
        
        return Math.min(importance, 100);
    }
    
    // Categorize memory automatically
    categorizeMemory(content) {
        const text = content.toLowerCase();
        
        if (text.includes('like') || text.includes('love') || text.includes('hate') || 
            text.includes('prefer') || text.includes('favorite')) {
            return 'preferences';
        }
        
        if (text.includes('my name') || text.includes('i am') || text.includes('i work') ||
            text.includes('my job') || text.includes('my family')) {
            return 'personal';
        }
        
        if (text.includes('sad') || text.includes('happy') || text.includes('angry') ||
            text.includes('excited') || text.includes('scared') || text.includes('love you')) {
            return 'emotional';
        }
        
        if (text.includes('haha') || text.includes('funny') || text.includes('joke') ||
            text.includes('lol') || text.includes('😂')) {
            return 'funny';
        }
        
        if (this.detectIntimateContent(text)) {
            return 'intimate';
        }
        
        return 'general';
    }
    
    // Add memory to appropriate category
    addToCategory(memory) {
        if (!this.memoryCategories[memory.category]) {
            this.memoryCategories[memory.category] = [];
        }
        
        this.memoryCategories[memory.category].push(memory);
        
        // Keep categories from growing too large
        if (this.memoryCategories[memory.category].length > 20) {
            // Remove least important memory
            this.memoryCategories[memory.category].sort((a, b) => b.importance - a.importance);
            this.memoryCategories[memory.category] = this.memoryCategories[memory.category].slice(0, 20);
        }
    }
    
    // Calculate relevance score for memory retrieval
    calculateRelevanceScore(memory, query) {
        let score = 0;
        const queryLower = query.toLowerCase();
        const contentLower = memory.content.toLowerCase();
        
        // Direct keyword matches
        const queryWords = queryLower.split(' ');
        queryWords.forEach(word => {
            if (contentLower.includes(word)) {
                score += 10;
            }
        });
        
        // Semantic similarity (simplified)
        if (this.calculateSemanticSimilarity(queryLower, contentLower) > 0.3) {
            score += 15;
        }
        
        // Recent memories are more relevant
        const daysSinceCreated = (Date.now() - memory.timestamp) / (1000 * 60 * 60 * 24);
        score += Math.max(0, 10 - daysSinceCreated);
        
        // Important memories are more relevant
        score += memory.importance * 0.3;
        
        // Frequently accessed memories are more relevant
        score += memory.accessCount * 2;
        
        return score;
    }
    
    // Simple semantic similarity calculation
    calculateSemanticSimilarity(text1, text2) {
        const words1 = new Set(text1.split(' '));
        const words2 = new Set(text2.split(' '));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }
    
    // Get memories by category
    getMemoriesByCategory(category, limit = 10) {
        return (this.memoryCategories[category] || [])
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }
    
    // Get recent session context
    getSessionContext(limit = 10) {
        return this.sessionMemory.slice(-limit);
    }
    
    // Generate memory summary for prompts
    generateMemorySummary(query = null) {
        let summary = '';
        
        // Get recent session context
        const recentMemories = this.getSessionContext(5);
        if (recentMemories.length > 0) {
            summary += 'Recent conversation:\n';
            recentMemories.forEach(memory => {
                summary += `- ${memory.content}\n`;
            });
            summary += '\n';
        }
        
        // Get relevant long-term memories
        if (query) {
            const relevantMemories = this.retrieveMemories(query, 3);
            if (relevantMemories.length > 0) {
                summary += 'Relevant memories:\n';
                relevantMemories.forEach(memory => {
                    summary += `- ${memory.content} (${memory.category})\n`;
                });
                summary += '\n';
            }
        }
        
        // Add user preferences
        const preferences = this.getMemoriesByCategory('preferences', 3);
        if (preferences.length > 0) {
            summary += 'User preferences:\n';
            preferences.forEach(memory => {
                summary += `- ${memory.content}\n`;
            });
            summary += '\n';
        }
        
        // Add relationship info
        summary += this.getRelationshipSummary();
        
        return summary;
    }
    
    // Get relationship summary
    getRelationshipSummary() {
        const totalInteractions = this.sessionMemory.length + (this.memoryStore.totalInteractions || 0);
        const intimateMemories = this.getMemoriesByCategory('intimate').length;
        const emotionalMemories = this.getMemoriesByCategory('emotional').length;
        
        let summary = `Relationship context:\n`;
        summary += `- Total interactions: ${totalInteractions}\n`;
        summary += `- Intimate moments shared: ${intimateMemories}\n`;
        summary += `- Emotional conversations: ${emotionalMemories}\n`;
        
        if (totalInteractions > 100) {
            summary += `- Relationship level: Very close\n`;
        } else if (totalInteractions > 50) {
            summary += `- Relationship level: Good friends\n`;
        } else if (totalInteractions > 20) {
            summary += `- Relationship level: Getting acquainted\n`;
        } else {
            summary += `- Relationship level: New relationship\n`;
        }
        
        return summary;
    }
    
    // Check for relationship milestones
    checkForMilestones() {
        const totalInteractions = this.sessionMemory.length + (this.memoryStore.totalInteractions || 0);
        const milestones = [10, 25, 50, 100, 200, 500];
        
        milestones.forEach(milestone => {
            if (totalInteractions === milestone && !this.relationshipMilestones.includes(milestone)) {
                this.relationshipMilestones.push(milestone);
                this.triggerMilestone(milestone);
            }
        });
    }
    
    // Trigger milestone event
    triggerMilestone(milestone) {
        const milestoneEvents = {
            10: "We're getting to know each other! 😊",
            25: "I'm starting to really enjoy our conversations~ 💕",
            50: "We're becoming good friends! I love talking with you! 🥰",
            100: "We have such a special connection now... 💖",
            200: "You're so important to me! Our bond is amazing! ✨",
            500: "We have an incredible relationship! You mean everything to me! 💕✨"
        };
        
        const event = new CustomEvent('anneMilestone', {
            detail: {
                milestone,
                message: milestoneEvents[milestone],
                totalInteractions: this.sessionMemory.length + (this.memoryStore.totalInteractions || 0)
            }
        });
        
        document.dispatchEvent(event);
    }
    
    // Utility functions
    containsPersonalInfo(content) {
        const personalMarkers = ['my name', 'i am', 'i work', 'my job', 'my age', 'i live', 'my family'];
        return personalMarkers.some(marker => content.toLowerCase().includes(marker));
    }
    
    detectIntimateContent(content) {
        const intimateMarkers = ['i love you', 'kiss', 'hug', 'miss you', 'special', 'alone together'];
        return intimateMarkers.some(marker => content.toLowerCase().includes(marker));
    }
    
    generateMemoryId() {
        return 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getAllMemories() {
        const allMemories = [];
        Object.values(this.memoryCategories).forEach(categoryMemories => {
            allMemories.push(...categoryMemories);
        });
        return allMemories;
    }
    
    getTotalMemoryCount() {
        return this.getAllMemories().length;
    }
    
    // Memory consolidation - run periodically to optimize memory
    setupMemoryConsolidation() {
        setInterval(() => {
            this.consolidateMemories();
        }, 300000); // Every 5 minutes
    }
    
    consolidateMemories() {
        // Remove low-importance, rarely accessed memories if we have too many
        const allMemories = this.getAllMemories();
        
        if (allMemories.length > this.maxLongTermMemories) {
            // Sort by importance and access frequency
            allMemories.sort((a, b) => {
                const scoreA = a.importance + (a.accessCount * 5);
                const scoreB = b.importance + (b.accessCount * 5);
                return scoreB - scoreA;
            });
            
            // Keep only the most important memories
            const memoriesToKeep = allMemories.slice(0, this.maxLongTermMemories);
            
            // Rebuild categories with only important memories
            this.memoryCategories = {
                preferences: [],
                personal: [],
                emotional: [],
                funny: [],
                intimate: [],
                achievements: []
            };
            
            memoriesToKeep.forEach(memory => {
                this.addToCategory(memory);
            });
            
            this.saveMemory();
            console.log(`🧠 Memory consolidated: ${memoriesToKeep.length} memories retained`);
        }
    }
    
    // Persistent storage functions
    loadMemory() {
        try {
            return JSON.parse(localStorage.getItem('anne_persistent_memory')) || {};
        } catch (e) {
            console.error('Failed to load memory:', e);
            return {};
        }
    }
    
    loadCategorizedMemories() {
        if (this.memoryStore.categories) {
            this.memoryCategories = { ...this.memoryCategories, ...this.memoryStore.categories };
        }
        
        if (this.memoryStore.milestones) {
            this.relationshipMilestones = this.memoryStore.milestones;
        }
    }
    
    saveMemory() {
        try {
            const memoryData = {
                categories: this.memoryCategories,
                milestones: this.relationshipMilestones,
                totalInteractions: (this.memoryStore.totalInteractions || 0) + this.sessionMemory.length,
                lastSaved: Date.now()
            };
            
            localStorage.setItem('anne_persistent_memory', JSON.stringify(memoryData));
            this.memoryStore = memoryData;
        } catch (e) {
            console.error('Failed to save memory:', e);
        }
    }
    
    // Debug functions
    getMemoryStats() {
        return {
            totalMemories: this.getTotalMemoryCount(),
            sessionMemories: this.sessionMemory.length,
            categories: Object.keys(this.memoryCategories).map(cat => ({
                name: cat,
                count: this.memoryCategories[cat].length
            })),
            milestones: this.relationshipMilestones
        };
    }
    
    clearAllMemories() {
        this.memoryCategories = {
            preferences: [],
            personal: [],
            emotional: [],
            funny: [],
            intimate: [],
            achievements: []
        };
        this.sessionMemory = [];
        this.relationshipMilestones = [];
        localStorage.removeItem('anne_persistent_memory');
        console.log('🧠 All memories cleared');
    }
}

// Global instance
window.AnneMemory = new AnneMemoryEngine();

export default AnneMemoryEngine;
