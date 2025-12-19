const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        const colors = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0'];

        for (let i = 0; i < 80; i++) {
            this.particles.push({
                x,
                y,
                angle: Math.random() * 2 * Math.PI,
                speed: Math.random() * 5 + 2,
                radius: 2,
                alpha: 1,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.alpha -= 0.015;
        });
    }

    draw() {
        this.particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${hexToRgb(p.color)},${p.alpha})`;
            ctx.fill();
        });
    }
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
}

let fireworks = [];

function animate() {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((fw, i) => {
        fw.update();
        fw.draw();
        if (fw.particles[0].alpha <= 0) fireworks.splice(i, 1);
    });

    requestAnimationFrame(animate);
}

canvas.addEventListener('click', e => {
    fireworks.push(new Firework(e.clientX, e.clientY));
});

// tự bắn pháo hoa
setInterval(() => {
    fireworks.push(new Firework(
        Math.random() * canvas.width,
        Math.random() * canvas.height / 2
    ));
}, 800);

animate();
