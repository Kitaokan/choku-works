'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface GlowbieEffectProps {
  containerRef: React.RefObject<HTMLDivElement>;
  faceImageUrl?: string;
}

const GlowbieEffect: React.FC<GlowbieEffectProps> = ({ containerRef, faceImageUrl }) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const faceTextureRef = useRef<THREE.Texture | null>(null);
  const faceMeshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number>(0);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Store a reference to the container element to fix ESLint warning
    const container = containerRef.current;

    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create firefly particles
    createFireflies();

    // Set up animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (particlesRef.current) {
        const particles = particlesRef.current;
        const positions = particles.geometry.attributes.position;
        const count = positions.count;

        for (let i = 0; i < count; i++) {
          // Update particle positions with gentle random motion
          const x = positions.getX(i);
          const y = positions.getY(i);
          const z = positions.getZ(i);

          positions.setX(i, x + (Math.random() - 0.5) * 0.01);
          positions.setY(i, y + (Math.random() - 0.5) * 0.01);
          positions.setZ(i, z + (Math.random() - 0.5) * 0.01);
        }

        positions.needsUpdate = true;
      }

      if (faceMeshRef.current) {
        // Rotate the face mesh slightly
        faceMeshRef.current.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
      }
      
      if (particlesRef.current && sceneRef.current) {
        sceneRef.current.remove(particlesRef.current);
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }
      
      if (faceMeshRef.current && sceneRef.current) {
        sceneRef.current.remove(faceMeshRef.current);
        faceMeshRef.current.geometry.dispose();
        (faceMeshRef.current.material as THREE.Material).dispose();
      }
      
      if (faceTextureRef.current) {
        faceTextureRef.current.dispose();
      }
    };
  }, [containerRef]); // Added containerRef to dependency array

  // Effect for handling face image changes
  useEffect(() => {
    if (!faceImageUrl || !sceneRef.current) return;

    // Load face texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(faceImageUrl, (texture) => {
      faceTextureRef.current = texture;
      createFaceMesh(texture);
    });
  }, [faceImageUrl]);

  // Create firefly particles
  const createFireflies = () => {
    if (!sceneRef.current) return;

    // Clean up existing particles
    if (particlesRef.current) {
      sceneRef.current.remove(particlesRef.current);
      particlesRef.current.geometry.dispose();
      (particlesRef.current.material as THREE.Material).dispose();
    }

    // Create new particles
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const geometry = new THREE.BufferGeometry();
    
    // Set random positions for each particle
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      positions[i3] = (Math.random() - 0.5) * 10; // x
      positions[i3 + 1] = (Math.random() - 0.5) * 10; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 10; // z
      
      // Color (yellow-green for fireflies)
      colors[i3] = 0.9 + Math.random() * 0.1; // R
      colors[i3 + 1] = 0.9 + Math.random() * 0.1; // G
      colors[i3 + 2] = 0.4 + Math.random() * 0.2; // B
      
      // Size (random variations)
      sizes[i] = 0.1 + Math.random() * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    sceneRef.current.add(particles);
    particlesRef.current = particles;
  };

  // Create a face mesh with the provided texture
  const createFaceMesh = (texture: THREE.Texture) => {
    if (!sceneRef.current) return;

    // Clean up existing face mesh
    if (faceMeshRef.current) {
      sceneRef.current.remove(faceMeshRef.current);
      faceMeshRef.current.geometry.dispose();
      (faceMeshRef.current.material as THREE.Material).dispose();
    }

    // Create face mesh with the texture
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.7,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -0.5; // Position behind the particles
    sceneRef.current.add(mesh);
    faceMeshRef.current = mesh;
  };

  return null; // This component doesn't render any JSX elements
};

export default GlowbieEffect;
