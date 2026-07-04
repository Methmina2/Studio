// src/components/animations/LensIntro.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Torus, Box, Environment } from '@react-three/drei';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const LensModel = () => {
  const group = useRef();
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (!clicked) {
      group.current.rotation.x += 0.005;
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={group} onClick={() => setClicked(true)}>
      <Torus args={[1.5, 0.2, 16, 100]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#C86432" metalness={0.8} roughness={0.2} />
      </Torus>
      <Torus args={[1.2, 0.1, 16, 100]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#de660e" metalness={0.9} roughness={0.1} />
      </Torus>
      <Box args={[0.5, 0.5, 0.5]} position={[0, 0, 0.5]}>
        <meshStandardMaterial color="#FFFFFF" emissive="#de660e" emissiveIntensity={0.5} />
      </Box>
      <Environment preset="studio" />
    </group>
  );
};

const LensIntro = ({ onComplete }) => {
  const [hasSeen, setHasSeen] = useLocalStorage('hasSeenIntro', false);
  const [visible, setVisible] = useState(!hasSeen);

  useEffect(() => {
    if (!visible) return;
    // Auto transition after 6s
    const timer = setTimeout(() => {
      setVisible(false);
      setHasSeen(true);
      if (onComplete) onComplete();
    }, 6000);
    return () => clearTimeout(timer);
  }, [visible, setHasSeen, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-obsidian flex items-center justify-center">
      <div className="w-full h-full max-w-4xl mx-auto">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <LensModel />
        </Canvas>
        <button
          onClick={() => {
            setVisible(false);
            setHasSeen(true);
            if (onComplete) onComplete();
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition text-sm uppercase tracking-widest"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
};

export default LensIntro;