// Canvas setup
const canvas = document.getElementById('dotsCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Dot class
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
    
    requestAnimationFrame(animate);
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

// Initialize
createDots(100);
animate();


