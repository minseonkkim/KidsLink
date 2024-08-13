import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { MeshStandardMaterial, Group, Vector2 } from 'three';
import { useSpring, animated, SpringValue } from '@react-spring/three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

function Model(props: JSX.IntrinsicElements['group'] & { mousePosition: Vector2 }) {
  const { scene } = useGLTF('/holding-camera-daramgi.glb') as unknown as { scene: Group; materials: { [key: string]: MeshStandardMaterial } };
  const groupRef = useRef<Group>(null);
  const [clicked, setClicked] = useState(false);

  const springs = useSpring({
    scale: clicked ? [1.1, 1.1, 1.1] : [1, 1, 1],
    position: clicked ? [0, 0.5, 0] : [0, 0, 0],
    config: { duration: 300 },
    onRest: () => setClicked(false),
  });

  useEffect(() => {
    scene.scale.set(1.5, 1.5, 1.5); // 초기 스케일 설정
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.PI / 18; // 캐릭터가 처음부터 살짝 아래를 보도록 설정 (약 5도)
    }
  }, [scene]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const x = props.mousePosition.x * Math.PI;
      groupRef.current.rotation.y = Math.max(0, Math.min(Math.PI / 4.5, x * 0.1)); // 좌우 회전 각도 제한
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.05; // 몸을 좌우로 흔들리는 애니메이션 추가
    }
  });

  const handleClick = () => {
    setClicked(true);
  };

  const animatedScale = springs.scale as unknown as SpringValue<number[]>;
  const animatedPosition = springs.position as unknown as SpringValue<number[]>;

  return (
    <animated.group
      ref={groupRef}
      scale={animatedScale.to((x, y, z) => [x, y, z])}
      position={animatedPosition.to((x, y, z) => [x, y, z])}
      onClick={handleClick}
      {...props}
    >
      <primitive object={scene} />
    </animated.group>
  );
}

useGLTF.preload('/holding-camera-daramgi.glb');

export default function ThreeModel({ mousePosition }: { mousePosition: Vector2 }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <Canvas style={{ height: '400px', width: '300px' }} camera={{ position: [0.3, 1, 5], fov: 50 }}>
      <ambientLight intensity={1.0} />
      <directionalLight position={[10, 10, 10]} intensity={1.0} />
      <Model mousePosition={mousePosition} />
      <OrbitControls
        ref={controlsRef}
        enableZoom={false} // 확대 비활성화
        minDistance={4.5}
        maxDistance={5.5}
        maxPolarAngle={Math.PI / 2} // 상하 회전 각도 제한
        minPolarAngle={Math.PI / 2} // 상하 회전 각도 제한
      />
      <Environment preset="sunset" />
    </Canvas>
  );
}
