import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";

import monalisa from "@/assets/hero-monalisa.jpg";
import statue from "@/assets/hero-statue.jpg";

const vertex = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += sin(p.x * 1.6 + uTime * 0.35) * 0.18 + cos(p.y * 1.9 + uTime * 0.25) * 0.14;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform sampler2D uTex;
  uniform vec2 uMouse;

  float rand(vec2 co) { return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    vec2 uv = vUv;
    float t = uTime;

    // slow breathing zoom
    uv = (uv - 0.5) * (1.0 - 0.04 * sin(t * 0.18)) + 0.5;
    uv += uMouse * 0.02;

    // horizontal glitch bands
    float band = floor(uv.y * 42.0);
    float glitchGate = step(0.965, rand(vec2(band, floor(t * 3.0))));
    float shift = (rand(vec2(band, floor(t * 6.0))) - 0.5) * 0.09 * glitchGate;
    uv.x += shift;

    // chromatic aberration
    float ca = 0.004 + 0.012 * glitchGate;
    float r = texture2D(uTex, uv + vec2(ca, 0.0)).r;
    float g = texture2D(uTex, uv).g;
    float b = texture2D(uTex, uv - vec2(ca, 0.0)).b;
    vec3 col = vec3(r, g, b);

    // neon grading: purple / gold / electric blue
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 purple = vec3(0.55, 0.18, 1.0);
    vec3 gold = vec3(1.0, 0.76, 0.28);
    vec3 electric = vec3(0.24, 0.5, 1.0);
    vec3 graded = mix(purple * lum * 1.4, gold, smoothstep(0.55, 0.95, lum));
    graded = mix(graded, electric, 0.28 + 0.18 * sin(t * 0.3 + uv.y * 3.0));
    col = mix(col, graded, 0.72);

    // scanlines + drifting light sweep
    col *= 0.86 + 0.14 * sin(uv.y * 1400.0);
    float sweep = smoothstep(0.06, 0.0, abs(fract(uv.y * 0.5 - t * 0.05) - 0.5));
    col += electric * sweep * 0.25;

    // vignette into obsidian void
    float v = smoothstep(0.95, 0.25, length(vUv - 0.5));
    col *= v;
    col += vec3(rand(vUv * (t + 1.0))) * 0.035;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ArtPlane({ src, position, scale }: { src: string; position: [number, number, number]; scale: [number, number] }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 20 },
      uTex: { value: tex },
      uMouse: { value: new THREE.Vector2() },
    }),
    [tex],
  );

  useFrame((state, delta) => {
    if (!mat.current) return;
    uniforms.uTime.value += delta;
    uniforms.uMouse.value.set(state.pointer.x, state.pointer.y);
  });

  return (
    <mesh position={position}>
      <planeGeometry args={[scale[0], scale[1], 64, 64]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

function Dust() {
  const points = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 900;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = Math.random() * 6 - 1;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.z += delta * 0.02;
      points.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.4;
    }
  });

  return (
    <points ref={points} geometry={geo}>
      <pointsMaterial size={0.035} color="#f2c46a" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export function CyberBackground({ intensity = 1 }: { intensity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      style={{ opacity: intensity }}
    >
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.6]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <ArtPlane src={monalisa} position={[-3.1, 0.1, 0]} scale={[6.2, 6.2]} />
          <ArtPlane src={statue} position={[3.4, -0.2, -1.2]} scale={[6.6, 6.6]} />
          <Dust />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_10%,oklch(0.13_0.02_285/0.86)_75%)]" />
    </div>
  );
}

export default CyberBackground;