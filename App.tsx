
import React, { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import ChristmasTree from './components/ChristmasTree';
import Ornaments from './components/Ornaments';
import ParticleField from './components/ParticleField';
import UIOverlay from './components/UIOverlay';
import { generateGreeting } from './services/geminiService';

const App: React.FC = () => {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isScattered, setIsScattered] = useState(true);

  const handleInteract = useCallback(async () => {
    setLoading(true);
    try {
      const msg = await generateGreeting();
      setGreeting(msg);
    } catch (err) {
      console.error("AI Greeting error:", err);
      setGreeting("May your season be filled with warmth and light.");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleMorph = () => setIsScattered(prev => !prev);

  return (
    <div className="w-full h-screen relative bg-[#01110a]">
      <Canvas shadows dpr={[1, 2]}>
        <color attach="background" args={['#01110a']} />
        <fog attach="fog" args={['#01110a', 8, 30]} />
        
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={45} />
          <OrbitControls 
            enablePan={false} 
            minDistance={10} 
            maxDistance={28} 
            maxPolarAngle={Math.PI / 1.8} 
            autoRotate 
            autoRotateSpeed={isScattered ? 0.3 : 1.2}
          />

          <ambientLight intensity={0.4} />
          <pointLight position={[10, 15, 10]} intensity={3} color="#ffd700" castShadow />
          <pointLight position={[-15, 5, -5]} intensity={1} color="#50c878" />
          <spotLight 
            position={[0, 20, 0]} 
            angle={0.4} 
            penumbra={1} 
            intensity={4} 
            castShadow 
            color="#ffffff" 
          />

          <group position={[0, -4, 0]}>
            <ChristmasTree isScattered={isScattered} />
            <Ornaments isScattered={isScattered} />
            <ParticleField />
          </group>

          <Stars radius={100} depth={50} count={3000} factor={6} saturation={0} fade speed={0.5} />
          
          <Environment preset="night" />

          <EffectComposer multisampling={4}>
            <Bloom 
                luminanceThreshold={1.0} 
                luminanceSmoothing={0.9} 
                intensity={2.5} 
                mipmapBlur
            />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.3} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <UIOverlay 
        greeting={greeting} 
        onGenerate={handleInteract} 
        isLoading={loading}
        onClear={() => setGreeting(null)}
        isScattered={isScattered}
        onToggleMorph={toggleMorph}
      />

      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-[#c5a059] text-[9px] uppercase tracking-[0.6em] opacity-40 font-light">
          Maison de Noël &bull; Haute Couture Metamorphosis
        </p>
      </div>
    </div>
  );
};

export default App;
