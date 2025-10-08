// ===== PORTFOLIO APPLICATION =====
class PortfolioApp {
    constructor() {
        this.canvas = document.getElementById('dotsCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationFrameId = null;
        this.dots = [];
        this.mouse = { x: 0, y: 0, radius: 150, active: false };
        this.colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupProjectModals();
        this.setupProfileEffects();
        this.setupAnimations();
    }

    // ===== CANVAS BACKGROUND =====
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.createDots(80);
        this.animate();
        
        // Mouse interactions
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.active = true;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });

        // Performance optimization
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(this.animationFrameId);
            } else {
                this.animate();
            }
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createDots(count) {
        for (let i = 0; i < count; i++) {
            this.dots.push(new Dot(this.canvas, this.colors));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw dots
        this.dots.forEach(dot => {
            dot.update(this.mouse);
            dot.draw(this.ctx);
        });
        
        this.drawLines();
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    drawLines() {
        for (let i = 0; i < this.dots.length; i++) {
            for (let j = i + 1; j < this.dots.length; j++) {
                const dx = this.dots[i].x - this.dots[j].x;
                const dy = this.dots[i].y - this.dots[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance/100})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.dots[i].x, this.dots[i].y);
                    this.ctx.lineTo(this.dots[j].x, this.dots[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    // ===== NAVIGATION =====
    setupNavigation() {
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelector('.nav-links');
        this.menuIcon = this.mobileMenuBtn.querySelector('i');

        this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    toggleMobileMenu() {
        this.navLinks.classList.toggle('active');
        const isActive = this.navLinks.classList.contains('active');
        
        this.menuIcon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.navLinks.classList.remove('active');
        this.menuIcon.className = 'fas fa-bars';
        document.body.style.overflow = '';
    }

    // ===== SCROLL EFFECTS =====
    setupScrollEffects() {
        // Scroll to top button
        this.scrollToTopBtn = document.getElementById('scrollToTopBtn');
        
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveNavLink();
        });

        this.scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Scroll to top button
        if (scrollY > 100) {
            this.scrollToTopBtn.classList.add('visible');
        } else {
            this.scrollToTopBtn.classList.remove('visible');
        }

        // Header background
        const header = document.querySelector('header');
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // ===== PROJECT MODALS =====
    setupProjectModals() {
        this.modal = document.getElementById('projectModal');
        this.modalImg = document.getElementById('modalImg');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalTech = document.getElementById('modalTech');
        this.modalDetails = document.getElementById('modalDetails');
        this.modalLiveLink = document.getElementById('modalLiveLink');
        this.modalRepoLink = document.getElementById('modalRepoLink');
        this.closeBtn = document.querySelector('.close-btn');

        // Populate tech tags on project cards
        this.populateProjectTechTags();
        
        // Setup modal event listeners
        this.setupModalEvents();
    }

    populateProjectTechTags() {
        document.querySelectorAll('.project-card').forEach(card => {
            const techContainer = card.querySelector('.project-tech');
            const techs = card.dataset.tech.split(',');
            
            techContainer.innerHTML = '';
            techs.forEach(tech => {
                const span = document.createElement('span');
                span.className = 'tech-tag';
                span.textContent = tech.trim();
                techContainer.appendChild(span);
            });
        });
    }

    setupModalEvents() {
        // View details buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.project-card');
                this.openProjectModal(card);
            });
        });

        // Close modal events
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    openProjectModal(card) {
        this.modalTitle.textContent = card.dataset.title;
        this.modalImg.src = card.dataset.img;
        this.modalImg.alt = `Image of ${card.dataset.title}`;
        this.modalDetails.textContent = card.dataset.details;
        this.modalLiveLink.href = card.dataset.liveLink;
        this.modalRepoLink.href = card.dataset.repoLink;

        // Populate tech tags in modal
        this.modalTech.innerHTML = '';
        const techs = card.dataset.tech.split(',');
        techs.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = tech.trim();
            this.modalTech.appendChild(span);
        });

        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // ===== PROFILE EFFECTS =====
    setupProfileEffects() {
        this.profileContainer = document.querySelector('.profile-container');
        this.profileImage = document.querySelector('.profile-image');
        
        if (this.profileContainer && this.profileImage) {
            this.setupProfileHoverEffects();
            this.setupProfileClickEffects();
        }
    }

    setupProfileHoverEffects() {
        this.profileContainer.addEventListener('mouseenter', () => {
            this.enhanceGlow();
        });
        
        this.profileContainer.addEventListener('mouseleave', () => {
            this.reduceGlow();
        });
    }

    setupProfileClickEffects() {
        this.profileImage.addEventListener('click', () => {
            this.createRippleEffect();
        });
    }

    enhanceGlow() {
        const outerGlow = document.querySelector('.profile-outer-glow');
        const innerGlow = document.querySelector('.profile-inner-glow');
        
        if (outerGlow) outerGlow.style.opacity = '0.6';
        if (innerGlow) innerGlow.style.opacity = '0.5';
    }

    reduceGlow() {
        const outerGlow = document.querySelector('.profile-outer-glow');
        const innerGlow = document.querySelector('.profile-inner-glow');
        
        if (outerGlow) outerGlow.style.opacity = '0.4';
        if (innerGlow) innerGlow.style.opacity = '0.3';
    }

    createRippleEffect() {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            border: 2px solid rgba(59, 130, 246, 0.8);
            border-radius: 50%;
            animation: rippleExpand 1s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;
        
        this.profileContainer.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }

    // ===== ANIMATIONS =====
    setupAnimations() {
        // Intersection Observer for fade-in animations
        this.sections = document.querySelectorAll('.fade-in-section');
        
        this.sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        this.sections.forEach(section => this.sectionObserver.observe(section));

        // Add ripple animation to CSS
        this.addRippleAnimation();
    }

    addRippleAnimation() {
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes rippleExpand {
                0% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(1.2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }
}

// ===== DOT CLASS =====
class Dot {
    constructor(canvas, colors) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 3 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.originalColor = this.color;
    }
    
    update(mouse) {
        // Move the dot
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off walls
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
        
        // Keep within bounds
        this.x = Math.max(0, Math.min(this.canvas.width, this.x));
        this.y = Math.max(0, Math.min(this.canvas.height, this.y));
        
        // Mouse interaction
        this.handleMouseInteraction(mouse);
    }
    
    handleMouseInteraction(mouse) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius && mouse.active) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.vx += (dx / distance) * force * 0.5;
            this.vy += (dy / distance) * force * 0.5;
            
            // Limit velocity
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 3) {
                this.vx = (this.vx / speed) * 3;
                this.vy = (this.vy / speed) * 3;
            }
            
            this.color = '#ffffff';
        } else {
            this.color = this.originalColor;
            
            // Gradually return to normal movement
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 1) {
                this.vx *= 0.98;
                this.vy *= 0.98;
            }
        }
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio error:', e.error);
});