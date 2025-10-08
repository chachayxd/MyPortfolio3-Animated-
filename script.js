// Canvas setup
const canvas = document.getElementById('dotsCanvas');
const ctx = canvas.getContext('2d');
let animationFrameId;

// Set canvas to full window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// --- Dot Animation ---
class Dot {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 3 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.originalColor = this.color;
    }
    
    update() {
        // Move the dot
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off walls
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        
        // Keep within bounds
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
        
        // Mouse interaction - dots follow cursor
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius && mouse.active) {
            // Move away from mouse
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
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Variables
let dots = [];
let colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 150,
    active: false
};

// Create initial dots
function createDots(count) {
    for (let i = 0; i < count; i++) {
        dots.push(new Dot());
    }
}

// Draw lines between close dots
function drawLines() {
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance/100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw dots
    dots.forEach(dot => {
        dot.update();
        dot.draw();
    });
    
    // Draw connecting lines
    drawLines();
    
    animationFrameId = requestAnimationFrame(animate);
}

// Mouse event listeners
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
});

canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
});

// Performance: Pause animation when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
    } else {
        animate();
    }
});

// Initialize
createDots(100);
animate();

// --- Mobile Menu ---
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const menuIcon = mobileMenuBtn.querySelector('i');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Toggle icon between bars and times (close)
    if (navLinks.classList.contains('active')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    });
});

// Scroll Fade-In Animation
const sections = document.querySelectorAll('.fade-in-section');

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    root: null, // observes intersections relative to the viewport
    threshold: 0.1 // trigger when 10% of the element is visible
});

sections.forEach(section => {
    sectionObserver.observe(section);
});


// --- Scroll to Top Button ---
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
};

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Project Modals ---
const modal = document.getElementById('projectModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalTech = document.getElementById('modalTech');
const modalDetails = document.getElementById('modalDetails');
const modalLiveLink = document.getElementById('modalLiveLink');
const modalRepoLink = document.getElementById('modalRepoLink');
const closeBtn = document.querySelector('.close-btn');

document.querySelectorAll('.view-details-btn').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.project-card');
        
        modalTitle.textContent = card.dataset.title;
        modalImg.src = card.dataset.img;
        modalImg.alt = `Image of ${card.dataset.title}`;
        modalDetails.textContent = card.dataset.details;
        modalLiveLink.href = card.dataset.liveLink;
        modalRepoLink.href = card.dataset.repoLink;

        // Populate tech tags
        modalTech.innerHTML = '';
        const techs = card.dataset.tech.split(',');
        techs.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = tech;
            modalTech.appendChild(span);
        });

        modal.style.display = 'block';
    });
});

// Populate tech tags on the main page cards
document.querySelectorAll('.project-card').forEach(card => {
    const techContainer = card.querySelector('.project-tech');
    const techs = card.dataset.tech.split(',');
    techs.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = tech;
        techContainer.appendChild(span);
    });
});

function closeModal() {
    modal.style.display = 'none';
}

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        closeModal();
    }
});
