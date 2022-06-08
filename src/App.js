import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Stats,
  ScrollControls,
  Scroll,
  useScroll,
  RoundedBox
} from '@react-three/drei';
import Content from './Content';
import { Color } from 'three';

function Meshes() {
  const data = useScroll();
  const group = useRef();

  useFrame(() => {
    group.current.children[0].position.y = 1.5 + 2 * data.range(0, 1);
    group.current.children[0].rotation.y = -0.25 + 2 * data.range(0, 1);
    group.current.children[1].position.y = -2 + 2 * data.range(0, 2);
    group.current.children[1].rotation.x = -0.25 + 2 * data.range(0, 1);
    group.current.children[2].position.y = 2 - 3 * data.range(0, 4);
    group.current.children[3].position.y = 3.5 * data.range(0, 2.25);
    group.current.children[3].rotation.y = 0.25 - 2 * data.range(0, 1);
    group.current.children[4].position.y = -1.5 + 2 * data.range(0, 3);
    group.current.children[5].position.y = 2 + 3.5 * data.range(0, 2.25);
    group.current.children[5].rotation.y = -0.25 - 2 * data.range(0, 1);
  });

  return (
    <group ref={group}>
      <mesh rotation={[0, 1, 1]} position={[-2, 2, 0]}>
        <RoundedBox receiveShadow>
          <meshStandardMaterial color={'#111'} />
        </RoundedBox>
      </mesh>
      <mesh rotation={[0, -0.5, -0.5]} position={[2, -2, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} receiveShadow />
        <meshStandardMaterial color={'#111'} />
      </mesh>
      <mesh position={[-0.5, 2, 0]}>
        <sphereGeometry args={[0.4, 32]} receiveShadow />
        <meshStandardMaterial color={'#111'} />
      </mesh>
      <mesh rotation={[-0.5, 0, 0]} position={[2, 0, 0]}>
        <torusGeometry args={[0.4, 0.2, 16, 32]} receiveShadow />
        <meshStandardMaterial color={'#111'} />
      </mesh>
      <mesh position={[-2.5, -1, 0]}>
        <sphereGeometry args={[0.25, 32]} receiveShadow />
        <meshStandardMaterial color={'#111'} />
      </mesh>
      <mesh rotation={[0, 1, 1]} position={[2.8, 2, 0]}>
        <RoundedBox args={[0.7, 0.7, 0.7]} receiveShadow>
          <meshStandardMaterial color={'#111'} />
        </RoundedBox>
      </mesh>
    </group>
  );
}

function Background() {
  const data = useScroll();
  const ref = useRef();

  function getRgb(color) {
    let [r, g, b] = color
      .replace('rgb(', '')
      .replace(')', '')
      .split(',')
      .map((str) => Number(str));
    return { r, g, b };
  }

  function convert(colorA, colorB, value) {
    const rgbA = getRgb(colorA),
      rgbB = getRgb(colorB);
    const colorVal = (prop) =>
      Math.round(rgbA[prop] * (1 - value) + rgbB[prop] * value);
    return {
      r: colorVal('r'),
      g: colorVal('g'),
      b: colorVal('b')
    };
  }

  useFrame(() => {
    const rgb = convert('rgb(0, 60, 255)', 'rgb(17, 17, 17)', data.range(0, 1));
    const color = new Color(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    ref.current.color = color;
  });

  return (
    <mesh rotation={[0, -1.5, 0]} position={[3, 0, -3]}>
      <planeGeometry args={[15, 15]} />
      <meshBasicMaterial ref={ref} color={'#fff'} />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas
      flat
      dpr={[1, 2]}
      camera={{
        fov: 10,
        position: [-20, 10, 20],
        near: 1,
        far: 100
      }}>
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <directionalLight
          position={[-1, 2, -1]}
          intensity={1}
          color={'#1169fe'}
          castShadow
        />
        <directionalLight
          position={[1, 2, -1]}
          intensity={0.8}
          color={'#fff'}
          castShadow
        />
        <ScrollControls distance={2} horizontal={false}>
          <Scroll>
            <Background />
            <Meshes />
          </Scroll>
          <Scroll html>
            <Content />
          </Scroll>
        </ScrollControls>
        <Stats showPanel={0} className="stats" />
      </Suspense>
    </Canvas>
  );
}
