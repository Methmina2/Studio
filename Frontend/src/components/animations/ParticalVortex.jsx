// src/components/animations/ParticleVortex.jsx
import React, { useEffect, useRef } from 'react';

const ParticleVortex = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = [];
    const mouse = { x: null, y: null };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.angle = Math.random() * 2 * Math.PI;
        this.baseX = this.x;
        this.baseY = this.y;
        this.dist = Math.random() * 100 + 50;
        this.phase = Math.random() * 2 * Math.PI;
        this.color = `hsl(${Math.random() * 30 + 30}, 80%, 60%)`; // copper/gold
      }
      update() {
        // Orbit slightly
        this.angle += 0.005;
        this.x += Math.cos(this.angle + this.phase) * 0.2;
        this.y += Math.sin(this.angle + this.phase) * 0.2;

        // Mouse attraction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 200) {
            const force = (200 - dist) / 200 * 0.1;
            this.x += dx * force;
            this.y += dy * force;
          }
        }

        // Keep within bounds
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
        ctx.shadowBlur = 10;
        ctx.fill();
      }
    }

    for (let i = 0; i < 200; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouse);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default ParticleVortex;