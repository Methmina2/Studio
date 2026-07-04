import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [showContent, setShowContent] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const progressRef = useRef(0);
  const fontLoadedRef = useRef(false);

  useEffect(() => {
    const font = new FontFace('Fonarto', 'url(/fonts/Fonarto.woff2)');
    font.load()
      .then(() => {
        document.fonts.add(font);
        fontLoadedRef.current = true;
        drawText();
      })
      .catch(() => {
        console.warn('Fonarto font not loaded, using fallback serif');
        drawText('serif');
      });

    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3500);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const drawText = (fontFallback = 'Fonarto') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const width = canvas.width = rect.width;
    const height = canvas.height = rect.height;

    const text = 'HOTMELLO';
    const isMobile = window.innerWidth < 768;
    const divisor = isMobile ? 5.5 : 3.5;
    const maxFont = isMobile ? 60 : 140;
    const fontSize = Math.min(width / divisor, maxFont);
    
    ctx.font = `${fontSize}px "${fontFallback}", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const totalLength = textWidth * 1.2;
    const x = width / 2;
    const y = height / 2;

    let startTime = performance.now();
    const duration = 2000;

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      progressRef.current = progress;

      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = '#C0C0C0';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(192, 192, 192, 0.3)';
      ctx.shadowBlur = 15;
      ctx.setLineDash([totalLength, totalLength]);
      ctx.lineDashOffset = totalLength * (1 - progress);
      ctx.strokeText(text, x, y);

      if (progress > 0.5) {
        const fillProgress = (progress - 0.5) * 2;
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(192, 192, 192, ${fillProgress * 0.7})`);
        gradient.addColorStop(0.5, `rgba(224, 224, 224, ${fillProgress})`);
        gradient.addColorStop(1, `rgba(192, 192, 192, ${fillProgress * 0.7})`);
        ctx.fillStyle = gradient;
        ctx.shadowColor = 'rgba(192, 192, 192, 0.2)';
        ctx.shadowBlur = 10;
        ctx.fillText(text, x, y);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#A8A8A8');
        gradient.addColorStop(0.5, '#E8E8E8');
        gradient.addColorStop(1, '#A8A8A8');
        ctx.fillStyle = gradient;
        ctx.shadowColor = 'rgba(192, 192, 192, 0.2)';
        ctx.shadowBlur = 15;
        ctx.fillText(text, x, y);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) drawText();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-absolute-black flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[90%] h-[85%] md:w-[85%] md:h-[80%] lg:w-[80%] lg:h-[75%] overflow-hidden rounded-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/images/hero-poster.jpg"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
            <img src="/images/hero-bg.jpg" alt="Background" className="w-full h-full object-cover" />
          </video>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#de660e]/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center w-full h-full max-w-4xl mx-auto px-4 pt-16">
        <div className="w-full max-w-full flex items-center justify-center mt-12 h-[20vh] md:h-[25vh] overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full max-w-full max-h-full object-contain"
          />
        </div>

        <div
          className={`flex flex-col items-center text-center mt-2 transition-all duration-1000 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#de660e] mb-3">
            PROFESSIONAL HIGH-END CINEMA
          </p>
          <p className="font-sans text-sm md:text-base max-w-2xl mx-auto text-zinc-400 leading-relaxed">
            Tactile detail. Ultra-detailed textures. Experience the premium, dramatic studio atmosphere where every shot is a masterpiece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link to="/booking" className="btn-gold text-sm sm:text-base">Book a Session</Link>
            {/* View Portfolio now redirects to Production page */}
            <Link to="/production" className="btn-outline-light text-sm sm:text-base">View Portfolio</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
