// src/components/ui/AudioVisualizer.jsx
import React, { useEffect, useRef } from 'react';

const AudioVisualizer = ({ audioUrl, barColor = '#F97316', height = 200 }) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const initAudio = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        const source = audioContext.createBufferSource();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        source.buffer = audioBuffer;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        source.start();
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        drawVisualizer();
      } catch (error) {
        console.warn('Audio not available, using fallback animation.');
        drawFallback();
      }
    };

    const drawVisualizer = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = (width / dataArrayRef.current.length) * 2.5;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const value = dataArrayRef.current[i] / 255;
        const barHeight = value * height;
        const x = i * barWidth;
        ctx.fillStyle = barColor;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
        ctx.shadowBlur = 10;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
      }
      animationId = requestAnimationFrame(drawVisualizer);
    };

    const drawFallback = () => {
      // If no audio, draw random bars for demo
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < 60; i++) {
        const barHeight = Math.random() * height;
        const x = i * (width / 60);
        ctx.fillStyle = barColor;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.2)';
        ctx.shadowBlur = 8;
        ctx.fillRect(x, height - barHeight, 4, barHeight);
      }
      animationId = requestAnimationFrame(drawFallback);
    };

    initAudio();

    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [audioUrl, barColor]);

  return <canvas ref={canvasRef} width={800} height={height} className="w-full" />;
};

export default AudioVisualizer;