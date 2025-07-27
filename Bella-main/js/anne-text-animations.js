/**
 * Anne Text Animation Components
 * Created by Hitesh Siwach (@zues13bhai)
 * 
 * Beautiful text animations inspired by reactbits.dev
 */

class AnneTextAnimations {
    constructor() {
        this.animationQueue = [];
        this.isPlaying = false;
        this.initializeStyles();
    }

    initializeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .anne-animated-text {
                font-family: 'Segoe UI', 'Arial', sans-serif;
                font-weight: 600;
                line-height: 1.2;
                color: #fff;
            }

            .anne-text-container {
                overflow: hidden;
                display: inline-block;
            }

            /* Slide In Animation */
            .slide-in-text {
                opacity: 0;
                transform: translateY(30px);
                animation: slideInUp 0.8s ease-out forwards;
            }

            @keyframes slideInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Fade In Up Animation */
            .fade-in-up {
                opacity: 0;
                transform: translateY(20px);
                animation: fadeInUp 1s ease-out forwards;
            }

            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Rotating Words Animation */
            .rotating-words-container {
                display: inline-block;
                position: relative;
                height: 1.2em;
                overflow: hidden;
            }

            .rotating-word {
                position: absolute;
                opacity: 0;
                transform: translateY(100%);
                animation: rotateWord 4s infinite;
            }

            .rotating-word:nth-child(1) { animation-delay: 0s; }
            .rotating-word:nth-child(2) { animation-delay: 1.33s; }
            .rotating-word:nth-child(3) { animation-delay: 2.66s; }

            @keyframes rotateWord {
                0%, 22% { opacity: 0; transform: translateY(100%); }
                25%, 47% { opacity: 1; transform: translateY(0); }
                50%, 100% { opacity: 0; transform: translateY(-100%); }
            }

            /* Wavy Text Animation */
            .wavy-text {
                display: inline-block;
            }

            .wavy-char {
                display: inline-block;
                animation: wave 2s ease-in-out infinite;
            }

            @keyframes wave {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-10px); }
            }

            /* Text Reveal Animation */
            .text-reveal {
                position: relative;
                overflow: hidden;
            }

            .text-reveal::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--anne-primary);
                animation: reveal 1.5s ease-in-out forwards;
            }

            @keyframes reveal {
                to {
                    width: 0;
                    left: 100%;
                }
            }

            /* Typewriter Animation */
            .typewriter {
                border-right: 2px solid var(--anne-primary);
                animation: blink 1s infinite;
            }

            @keyframes blink {
                0%, 50% { border-color: var(--anne-primary); }
                51%, 100% { border-color: transparent; }
            }

            /* Glitch Effect */
            .glitch-text {
                position: relative;
                color: #fff;
                font-weight: bold;
            }

            .glitch-text::before,
            .glitch-text::after {
                content: attr(data-text);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            .glitch-text::before {
                color: #ff00ff;
                animation: glitch1 0.5s infinite;
            }

            .glitch-text::after {
                color: #00ffff;
                animation: glitch2 0.5s infinite;
            }

            @keyframes glitch1 {
                0%, 100% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
            }

            @keyframes glitch2 {
                0%, 100% { transform: translate(0); }
                20% { transform: translate(2px, 2px); }
                40% { transform: translate(2px, -2px); }
                60% { transform: translate(-2px, 2px); }
                80% { transform: translate(-2px, -2px); }
            }

            /* Gradient Text */
            .gradient-text {
                background: linear-gradient(45deg, var(--anne-primary), var(--anne-secondary), var(--anne-accent));
                background-size: 300% 300%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: gradientShift 3s ease infinite;
            }

            @keyframes gradientShift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }

            /* Loading Dots */
            .loading-dots::after {
                content: '';
                animation: loadingDots 1.5s infinite;
            }

            @keyframes loadingDots {
                0%, 20% { content: ''; }
                40% { content: '.'; }
                60% { content: '..'; }
                80%, 100% { content: '...'; }
            }
        `;
        document.head.appendChild(style);
    }

    // Slide In Animation
    slideIn(text, container, delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const element = document.createElement('div');
                element.className = 'anne-animated-text slide-in-text';
                element.textContent = text;
                container.appendChild(element);
                
                element.addEventListener('animationend', () => resolve(element));
            }, delay);
        });
    }

    // Fade In Up Animation
    fadeInUp(text, container, delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const element = document.createElement('div');
                element.className = 'anne-animated-text fade-in-up';
                element.textContent = text;
                container.appendChild(element);
                
                element.addEventListener('animationend', () => resolve(element));
            }, delay);
        });
    }

    // Rotating Words Animation
    rotatingWords(words, container) {
        const rotatingContainer = document.createElement('div');
        rotatingContainer.className = 'rotating-words-container anne-animated-text';
        
        words.forEach((word, index) => {
            const wordElement = document.createElement('span');
            wordElement.className = 'rotating-word';
            wordElement.textContent = word;
            rotatingContainer.appendChild(wordElement);
        });
        
        container.appendChild(rotatingContainer);
        return rotatingContainer;
    }

    // Wavy Text Animation
    wavyText(text, container, delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const element = document.createElement('div');
                element.className = 'anne-animated-text wavy-text';
                
                text.split('').forEach((char, index) => {
                    const charSpan = document.createElement('span');
                    charSpan.className = 'wavy-char';
                    charSpan.textContent = char === ' ' ? '\u00A0' : char;
                    charSpan.style.animationDelay = `${index * 0.1}s`;
                    element.appendChild(charSpan);
                });
                
                container.appendChild(element);
                resolve(element);
            }, delay);
        });
    }

    // Text Reveal Animation
    textReveal(text, container, delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const element = document.createElement('div');
                element.className = 'anne-animated-text text-reveal';
                element.textContent = text;
                container.appendChild(element);
                
                element.addEventListener('animationend', () => resolve(element));
            }, delay);
        });
    }

    // Typewriter Animation
    typewriter(text, container, speed = 50) {
        return new Promise((resolve) => {
            const element = document.createElement('div');
            element.className = 'anne-animated-text typewriter';
            container.appendChild(element);
            
            let index = 0;
            const typeInterval = setInterval(() => {
                element.textContent = text.slice(0, index + 1);
                index++;
                
                if (index >= text.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                        resolve(element);
                    }, 500);
                }
            }, speed);
        });
    }

    // Glitch Effect
    glitchText(text, container, duration = 2000) {
        const element = document.createElement('div');
        element.className = 'anne-animated-text glitch-text';
        element.textContent = text;
        element.setAttribute('data-text', text);
        container.appendChild(element);
        
        setTimeout(() => {
            element.classList.remove('glitch-text');
        }, duration);
        
        return element;
    }

    // Gradient Text
    gradientText(text, container) {
        const element = document.createElement('div');
        element.className = 'anne-animated-text gradient-text';
        element.textContent = text;
        container.appendChild(element);
        return element;
    }

    // Loading Dots
    loadingDots(text, container) {
        const element = document.createElement('div');
        element.className = 'anne-animated-text loading-dots';
        element.textContent = text;
        container.appendChild(element);
        return element;
    }

    // Combined Animation Sequence
    async animateSequence(animations, container) {
        for (const animation of animations) {
            await this[animation.type](animation.text, container, animation.delay || 0);
            if (animation.pause) {
                await this.delay(animation.pause);
            }
        }
    }

    // Utility: Delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Clear all animations
    clearAnimations(container) {
        container.innerHTML = '';
    }

    // Startup Animation Sequence
    async playStartupSequence(container) {
        this.clearAnimations(container);
        
        // Create welcome container
        const welcomeContainer = document.createElement('div');
        welcomeContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 1000;
            font-size: 2.5rem;
            font-weight: 700;
        `;
        container.appendChild(welcomeContainer);

        // Animated sequence
        await this.glitchText('System Initializing...', welcomeContainer, 1000);
        await this.delay(1200);
        this.clearAnimations(welcomeContainer);
        
        await this.textReveal('Hi, I\'m Anne 💕', welcomeContainer);
        await this.delay(800);
        this.clearAnimations(welcomeContainer);
        
        await this.gradientText('Made with ❤️ by Hitesh', welcomeContainer);
        await this.delay(2000);
        
        // Fade out
        welcomeContainer.style.transition = 'opacity 1s ease';
        welcomeContainer.style.opacity = '0';
        
        setTimeout(() => {
            container.removeChild(welcomeContainer);
        }, 1000);
    }

    // Chat Message Animation
    async animateChatMessage(text, container, personality = 'sweet') {
        const messageElement = document.createElement('div');
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        messageElement.style.transition = 'all 0.5s ease';
        messageElement.textContent = text;
        
        container.appendChild(messageElement);
        
        // Trigger animation
        requestAnimationFrame(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });
        
        return messageElement;
    }

    // Status Text Animation
    animateStatusText(text, container) {
        const element = document.createElement('div');
        element.className = 'anne-animated-text fade-in-up';
        element.textContent = text;
        element.style.fontSize = '0.9rem';
        element.style.color = 'var(--anne-primary)';
        
        container.innerHTML = '';
        container.appendChild(element);
        
        return element;
    }
}

// Global instance
window.AnneTextAnimations = new AnneTextAnimations();

export default AnneTextAnimations;
