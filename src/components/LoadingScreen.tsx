import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Text, Environment, Sparkles } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';

// 3D Portal Ring Component
function PortalRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z -= delta * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusGeometry args={[3, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color="#3B82F6" 
          emissive="#60A5FA" 
          emissiveIntensity={2} 
          wireframe
        />
      </mesh>
      <mesh ref={meshRef} scale={1.1}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#A78BFA" 
          emissive="#A78BFA" 
          emissiveIntensity={3} 
        />
      </mesh>
    </Float>
  );
}

// Camera Animation Component
function CameraRig() {
  useFrame((state) => {
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 2, 0.02);
    state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, Math.sin(state.clock.elapsedTime * 0.2) * 0.1, 0.02);
  });
  return null;
}

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing Systems...');

  const onCompleteRef = useRef(onComplete);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const totalDuration = 10000; // 10 seconds total
    const intervalTime = 50;
    const steps = totalDuration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(currentProgress);

      if (currentProgress > 80) setStage('Opening Gateway...');
      else if (currentProgress > 50) setStage('Synchronizing Campus Data...');
      else if (currentProgress > 25) setStage('Establishing Secure Connection...');

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => onCompleteRef.current(), 500); // Small buffer before unmounting
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-[#030712] overflow-hidden flex flex-col items-center justify-center cursor-wait"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* 3D Background Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <Suspense fallback={null}>
            <color attach="background" args={['#030712']} />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#3B82F6" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#A78BFA" />
            
            <PortalRing />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
            <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.5} color="#60A5FA" />
            
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
              <Text
                position={[0, 0, 0]}
                fontSize={0.8}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                DSCE PORTAL
                <meshStandardMaterial emissive="#FFFFFF" emissiveIntensity={0.5} />
              </Text>
            </Float>
            
            <CameraRig />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* 2D Overlay Elements */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-24 w-full px-8 pointer-events-none">
        
        {/* Futuristic Text */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2 
            className="font-display font-black text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 tracking-tighter"
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: '200% auto' }}
          >
            ENTERING THE NEXT ERA
          </motion.h2>
          <p className="mt-2 text-blue-200/60 font-mono text-sm tracking-[0.2em] uppercase">
            {stage}
          </p>
        </motion.div>

        {/* High-tech Progress Bar */}
        <div className="w-full max-w-md">
          <div className="flex justify-between text-[#60A5FA] font-mono text-[10px] mb-2 tracking-widest">
            <span>SYS_BOOT</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-md border border-slate-700/50">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full relative"
              style={{ width: `${progress}%` }}
              layout
            >
              <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 blur-[2px] animate-pulse" />
            </motion.div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
