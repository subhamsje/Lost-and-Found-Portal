import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Environment } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function AnimatedBlob() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.1;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.15;
      mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, state.pointer.x * 2, 0.05);
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, state.pointer.y * 2, 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} scale={2}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#3B82F6"
          emissive="#1E3A8A"
          emissiveIntensity={0.8}
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.9}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
}

function FloatingGeometry({ position, scale, color, type }: { position: [number, number, number], scale: number, color: string, type: 'box' | 'octa' }) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2} position={position}>
      <mesh ref={mesh} scale={scale}>
        {type === 'box' ? <boxGeometry args={[1, 1, 1]} /> : <octahedronGeometry args={[1]} />}
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-30 dark:opacity-60 transition-opacity duration-500 overflow-hidden mix-blend-plus-lighter">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#3B82F6" />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#A78BFA" />
          
          <AnimatedBlob />
          <FloatingGeometry position={[4, 2, -3]} scale={0.8} color="#A78BFA" type="box" />
          <FloatingGeometry position={[-4, -2, -2]} scale={0.6} color="#3B82F6" type="octa" />
          <FloatingGeometry position={[3, -2, -4]} scale={0.5} color="#60A5FA" type="octa" />
          
          <Sparkles count={80} scale={12} size={3} speed={0.3} opacity={0.4} color="#60A5FA" />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
