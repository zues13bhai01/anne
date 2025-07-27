/**
 * BELLA Cyberpunk Particle System
 * Advanced particle effects for premium experience
 */

class BellaParticles {
    constructor() {
        this.particlesConfig = {
            "particles": {
                "number": {
                    "value": 50,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": ["#ff1b8d", "#00ffff", "#ff00ff"]
                },
                "shape": {
                    "type": ["circle", "triangle"],
                    "stroke": {
                        "width": 1,
                        "color": "#ff1b8d"
                    }
                },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.5,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ff1b8d",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 100,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        };
        
        this.init();
    }

    init() {
        // Initialize particles when page loads
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', this.particlesConfig);
            this.addCustomStyles();
        } else {
            console.warn('Particles.js not loaded');
        }
    }

    addCustomStyles() {
        // Add glow effects to particle canvas
        const canvas = document.querySelector('#particles-js canvas');
        if (canvas) {
            canvas.style.filter = 'drop-shadow(0 0 10px rgba(255, 27, 141, 0.3))';
        }
    }

    // Method to change particle intensity based on mood
    setMoodParticles(mood) {
        const moods = {
            'cyberpunk': {
                color: ["#ff1b8d", "#00ffff", "#ff00ff"],
                count: 50,
                speed: 1
            },
            'aggressive': {
                color: ["#ff0000", "#ff4500", "#ff1b8d"],
                count: 80,
                speed: 2
            },
            'calm': {
                color: ["#00ffff", "#4169e1", "#ff1b8d"],
                count: 30,
                speed: 0.5
            },
            'mysterious': {
                color: ["#800080", "#4b0082", "#ff1b8d"],
                count: 40,
                speed: 0.8
            }
        };

        if (moods[mood] && window.pJSDom && window.pJSDom[0]) {
            const pJS = window.pJSDom[0].pJS;
            
            // Update particle colors
            pJS.particles.color.value = moods[mood].color;
            pJS.particles.line_linked.color = moods[mood].color[0];
            
            // Update particle count
            pJS.particles.number.value = moods[mood].count;
            
            // Update speed
            pJS.particles.move.speed = moods[mood].speed;
            
            // Refresh particles
            pJS.fn.particlesRefresh();
        }
    }

    // Add burst effect for special moments
    createBurst(x, y) {
        if (window.pJSDom && window.pJSDom[0]) {
            const pJS = window.pJSDom[0].pJS;
            
            // Create temporary burst particles
            for (let i = 0; i < 10; i++) {
                pJS.fn.modes.pushParticles(1, {
                    pos_x: x,
                    pos_y: y
                });
            }
        }
    }

    // Pulse effect for voice recognition
    pulseEffect() {
        const canvas = document.querySelector('#particles-js canvas');
        if (canvas) {
            canvas.style.filter = 'drop-shadow(0 0 20px rgba(255, 27, 141, 0.8))';
            
            setTimeout(() => {
                canvas.style.filter = 'drop-shadow(0 0 10px rgba(255, 27, 141, 0.3))';
            }, 500);
        }
    }
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bellaParticles = new BellaParticles();
});

export default BellaParticles;
