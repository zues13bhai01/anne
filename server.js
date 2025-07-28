const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json());
app.use(express.static('.'));

// Voice ID mapping for different personalities
const VOICE_MAPPING = {
    zenith: process.env.VOICE_ID_FALLBACK || 'VURZ3kCSkbLjDYld5lne', // Welcoming - gentle voice
    pixi: process.env.VOICE_ID_FALLBACK || 'VURZ3kCSkbLjDYld5lne', // Playful - energetic voice
    nova: process.env.VOICE_ID_FALLBACK || 'VURZ3kCSkbLjDYld5lne', // Confident - strong voice
    velvet: process.env.VOICE_ID_SEDUCTIVE || '6p0P6gezgvY1v6xbLzmU', // Seductive - sultry voice
    blaze: process.env.VOICE_ID_FLIRTY || 'WxqqAhUiswIRQNTBz2a5', // Flirty - teasing voice
    aurora: process.env.VOICE_ID_FALLBACK || 'VURZ3kCSkbLjDYld5lne', // Elegant - refined voice
};

// Voice settings for different personalities
const VOICE_SETTINGS = {
    zenith: { stability: 0.5, similarity_boost: 0.8, style: 'soft' },
    pixi: { stability: 0.7, similarity_boost: 0.9, style: 'excited' },
    nova: { stability: 0.8, similarity_boost: 0.7, style: 'confident' },
    velvet: { stability: 0.3, similarity_boost: 0.9, style: 'seductive' },
    blaze: { stability: 0.6, similarity_boost: 0.8, style: 'playful' },
    aurora: { stability: 0.9, similarity_boost: 0.6, style: 'elegant' }
};

// TTS endpoint
app.post('/api/tts', async (req, res) => {
    try {
        const { text, personality = 'zenith' } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (!process.env.ELEVENLABS_API_KEY) {
            return res.status(500).json({ error: 'ElevenLabs API key not configured' });
        }

        const voiceId = VOICE_MAPPING[personality] || VOICE_MAPPING.zenith;
        const voiceSettings = VOICE_SETTINGS[personality] || VOICE_SETTINGS.zenith;

        console.log(`🎤 TTS Request: "${text}" with ${personality} personality (voice: ${voiceId})`);

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg'
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: voiceSettings
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('ElevenLabs API error:', response.status, errorText);
            return res.status(response.status).json({ 
                error: `ElevenLabs API error: ${response.status}`,
                details: errorText
            });
        }

        // Get the audio buffer
        const audioBuffer = await response.buffer();
        
        // Set appropriate headers for audio streaming
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length,
            'Cache-Control': 'public, max-age=3600',
            'Access-Control-Allow-Origin': '*'
        });

        // Send the audio buffer
        res.send(audioBuffer);
        
        console.log(`✅ TTS Success: Generated ${audioBuffer.length} bytes for ${personality}`);

    } catch (error) {
        console.error('TTS Error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        elevenlabs_configured: !!process.env.ELEVENLABS_API_KEY,
        available_personalities: Object.keys(VOICE_MAPPING)
    });
});

// Get available personalities
app.get('/api/personalities', (req, res) => {
    res.json({
        personalities: Object.keys(VOICE_MAPPING),
        voice_mapping: VOICE_MAPPING,
        voice_settings: VOICE_SETTINGS
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Anne TTS Server running on http://localhost:${PORT}`);
    console.log(`🎤 ElevenLabs API: ${process.env.ELEVENLABS_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`🎭 Available personalities: ${Object.keys(VOICE_MAPPING).join(', ')}`);
});

module.exports = app;
