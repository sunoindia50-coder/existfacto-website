document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Config Data
    document.querySelectorAll('.dynamic-brand').forEach(el => el.textContent = CONFIG.brandName);
    document.getElementById('dynamic-tagline').textContent = CONFIG.tagline;
    document.getElementById('dynamic-about').textContent = CONFIG.aboutText;
    
    // Set Links
    document.getElementById('btn-subscribe').href = CONFIG.youtube;
    document.getElementById('link-yt').href = CONFIG.youtube;
    document.getElementById('link-x').href = CONFIG.twitter;
    document.getElementById('link-tg').href = CONFIG.telegram;
    document.getElementById('link-wa').href = CONFIG.whatsapp;
    document.getElementById('link-em').href = `mailto:${CONFIG.email}`;
    
    // Set Stats
    document.getElementById('stat-subs').textContent = CONFIG.stats.subscribers;
    document.getElementById('stat-views').textContent = CONFIG.stats.views;
    document.getElementById('stat-videos').textContent = CONFIG.stats.videos;

    // Apply Theme Colors to CSS variables
    document.documentElement.style.setProperty('--primary', CONFIG.theme.primary);

    // 2. Loading Screen Logic
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
                initAnimations(); // Start animations after load
            }, 500);
        }, 1000); // 1s fake loading for futuristic feel
    });

    // 3. Simple Particle Background
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = CONFIG.theme.primary;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for(let i=0; i<100; i++) particles.push(new Particle());
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // 4. GSAP Scroll Animations
    gsap.registerPlugin(ScrollTrigger);
    
    function initAnimations() {
        // Hero Typing Effect (Pure JS + CSS)
        const title = document.querySelector('.typing-title');
        const text = title.textContent;
        title.textContent = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        typeWriter();

        // Section Fade Ins
        gsap.utils.toArray('section').forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });

        // Glass Cards stagger
        gsap.utils.toArray('.grid').forEach(grid => {
            gsap.from(grid.children, {
                scrollTrigger: {
                    trigger: grid,
                    start: "top 85%",
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            });
        });
    }

    // 5. FAQ Accordion Logic
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('i');
            
            // Toggle current
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // 6. AI Assistant Fake Logic
    const aiBtn = document.getElementById('ai-btn');
    const aiInput = document.getElementById('ai-input');
    const aiBox = document.getElementById('ai-chat-box');

    const fakeFacts = [
        "Space fact: One million Earths could fit inside the Sun.",
        "Tech fact: The first computer mouse was made of wood.",
        "AI fact: AI can now write code, but it still struggles with drawing hands.",
        "Psychology fact: It takes about 66 days for an average individual to make something a daily habit."
    ];

    aiBtn.addEventListener('click', () => {
        if(aiInput.value.trim() === '') return;
        
        // Add User Message
        aiBox.innerHTML += `<div class="ai-message text-white">> ${aiInput.value}</div>`;
        aiInput.value = '';
        
        // Scroll to bottom
        aiBox.scrollTop = aiBox.scrollHeight;

        // Simulate AI typing delay
        setTimeout(() => {
            const randomFact = fakeFacts[Math.floor(Math.random() * fakeFacts.length)];
            aiBox.innerHTML += `<div class="ai-message">> EXISTFACTO AI: ${randomFact}</div>`;
            aiBox.scrollTop = aiBox.scrollHeight;
        }, 1000);
    });

    // 7. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // 8. Prevent Form Default Submit
    document.querySelector('.contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Transmission Encrypted and Sent successfully!');
    });
});

// 9. Register Service Worker for PWA Support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
