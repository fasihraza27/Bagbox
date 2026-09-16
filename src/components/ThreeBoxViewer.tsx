import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { BoxConfig3D } from '../types';
import { RotateCw, Eye, Lightbulb, Box, ZoomIn, ZoomOut, Sparkles, Layers } from 'lucide-react';

interface ThreeBoxViewerProps {
  config: BoxConfig3D;
  onConfigChange?: (newConfig: Partial<BoxConfig3D>) => void;
  interactive?: boolean;
  height?: string;
  autoRotateDefault?: boolean;
}

export const ThreeBoxViewer: React.FC<ThreeBoxViewerProps> = ({
  config,
  onConfigChange,
  interactive = true,
  height = '420px',
  autoRotateDefault = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const boxGroupRef = useRef<THREE.Group | null>(null);
  const lidGroupRef = useRef<THREE.Group | null>(null);
  const shelfMeshRef = useRef<THREE.Mesh | null>(null);
  const baseBracketRef = useRef<THREE.Group | null>(null);
  const ledLightMeshRef = useRef<THREE.Mesh | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  const [isRotating, setIsRotating] = useState(autoRotateDefault);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

  // Helper to create dynamic logo texture from brand text
  const createBrandTexture = useCallback((text: string, bgColor: string, textColor: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border accents
      ctx.strokeStyle = '#ffffff22';
      ctx.lineWidth = 6;
      ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

      // Text
      ctx.fillStyle = textColor;
      ctx.font = 'bold 44px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text || 'BAG & BOX KSA', canvas.width / 2, canvas.height / 2 - 15);

      // Subtitle
      ctx.fillStyle = '#ffffffaa';
      ctx.font = '600 20px Outfit, sans-serif';
      ctx.fillText('RIYADH • JEDDAH • DAMMAM', canvas.width / 2, canvas.height / 2 + 35);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Build the 3D model according to config
  const buildBoxModel = useCallback(() => {
    if (!sceneRef.current) return;

    // Clear previous models
    if (boxGroupRef.current) {
      sceneRef.current.remove(boxGroupRef.current);
    }

    const mainGroup = new THREE.Group();
    boxGroupRef.current = mainGroup;

    const brandTexture = createBrandTexture(
      config.customText || 'BAG & BOX KSA',
      config.primaryColor,
      config.accentColor || '#ffffff'
    );

    // Material definitions based on finish
    let boxMaterial: THREE.Material;
    const primaryColor = new THREE.Color(config.primaryColor);

    if (config.materialFinish === 'fiberglass') {
      boxMaterial = new THREE.MeshPhysicalMaterial({
        color: primaryColor,
        roughness: 0.18,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
      });
    } else if (config.materialFinish === 'matte') {
      boxMaterial = new THREE.MeshStandardMaterial({
        color: primaryColor,
        roughness: 0.85,
        metalness: 0.05,
      });
    } else if (config.materialFinish === 'carbon') {
      boxMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1e293b'),
        roughness: 0.35,
        metalness: 0.4,
      });
    } else {
      // gloss
      boxMaterial = new THREE.MeshStandardMaterial({
        color: primaryColor,
        roughness: 0.2,
        metalness: 0.25,
      });
    }

    const innerMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#cbd5e1'), // reflective insulated silver EPS
      roughness: 0.4,
      metalness: 0.5,
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15,
    });

    const blackPlasticMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.1,
    });

    if (config.modelType === 'fiberglass-box') {
      // 1. MOTORCYCLE DELIVERY BOX
      // Main Body Shell
      const bodyWidth = 3.2;
      const bodyHeight = 2.4;
      const bodyDepth = 3.0;

      // Outer Box
      const bodyGeo = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyDepth);
      // Multi-material to put logo on front and sides
      const logoMaterial = new THREE.MeshStandardMaterial({
        map: brandTexture,
        roughness: 0.2,
      });

      const bodyMaterials = [
        logoMaterial, // right
        logoMaterial, // left
        boxMaterial,  // top (covered by lid)
        blackPlasticMaterial, // bottom
        logoMaterial, // front
        boxMaterial,  // back
      ];

      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMaterials);
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      mainGroup.add(bodyMesh);

      // Hinged Top Lid
      const lidGroup = new THREE.Group();
      lidGroupRef.current = lidGroup;
      lidGroup.position.set(0, bodyHeight / 2, -bodyDepth / 2); // pivot at back-top

      const lidThickness = 0.25;
      const lidGeo = new THREE.BoxGeometry(bodyWidth + 0.1, lidThickness, bodyDepth + 0.1);
      const lidMesh = new THREE.Mesh(lidGeo, boxMaterial);
      lidMesh.position.set(0, lidThickness / 2, bodyDepth / 2);
      lidMesh.castShadow = true;
      lidGroup.add(lidMesh);

      // Chrome handle on lid
      const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16);
      const handleMesh = new THREE.Mesh(handleGeo, chromeMaterial);
      handleMesh.rotation.z = Math.PI / 2;
      handleMesh.position.set(0, lidThickness + 0.06, bodyDepth - 0.2);
      lidGroup.add(handleMesh);

      mainGroup.add(lidGroup);

      // Rear LED Illuminated Light Bar / Billboard
      if (config.hasLEDLight) {
        const ledGeo = new THREE.BoxGeometry(bodyWidth * 0.75, 0.35, 0.08);
        const ledMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(config.ledColor || '#f59e0b'),
          emissive: new THREE.Color(config.ledColor || '#f59e0b'),
          emissiveIntensity: 2.2,
          roughness: 0.1,
        });
        const ledMesh = new THREE.Mesh(ledGeo, ledMat);
        ledMesh.position.set(0, bodyHeight / 2 - 0.4, bodyDepth / 2 + 0.05);
        ledLightMeshRef.current = ledMesh;
        mainGroup.add(ledMesh);

        // Point light for illumination glow
        const glowLight = new THREE.PointLight(config.ledColor || '#f59e0b', 2.0, 4);
        glowLight.position.set(0, bodyHeight / 2 - 0.4, bodyDepth / 2 + 0.3);
        pointLightRef.current = glowLight;
        mainGroup.add(glowLight);
      }

      // Front / Back Steel Tension Latches
      if (config.hasLock) {
        const latchGeo = new THREE.BoxGeometry(0.18, 0.3, 0.1);
        const latchMesh = new THREE.Mesh(latchGeo, chromeMaterial);
        latchMesh.position.set(0, bodyHeight / 2 - 0.1, bodyDepth / 2 + 0.05);
        mainGroup.add(latchMesh);
      }

      // Internal Divider Shelf
      if (config.hasShelves) {
        const shelfGeo = new THREE.BoxGeometry(bodyWidth - 0.2, 0.08, bodyDepth - 0.2);
        const shelfMesh = new THREE.Mesh(shelfGeo, innerMaterial);
        shelfMesh.position.set(0, 0, 0);
        shelfMeshRef.current = shelfMesh;
        mainGroup.add(shelfMesh);
      }

      // Heavy-Duty Universal Mounting Rack Underneath
      const bracketGroup = new THREE.Group();
      baseBracketRef.current = bracketGroup;
      bracketGroup.position.set(0, -bodyHeight / 2 - 0.2, 0);

      const railGeo = new THREE.BoxGeometry(bodyWidth * 0.9, 0.1, 0.12);
      const rail1 = new THREE.Mesh(railGeo, blackPlasticMaterial);
      rail1.position.set(0, 0, bodyDepth * 0.3);
      const rail2 = new THREE.Mesh(railGeo, blackPlasticMaterial);
      rail2.position.set(0, 0, -bodyDepth * 0.3);
      bracketGroup.add(rail1);
      bracketGroup.add(rail2);

      const crossRailGeo = new THREE.BoxGeometry(0.12, 0.1, bodyDepth * 0.85);
      const cross1 = new THREE.Mesh(crossRailGeo, blackPlasticMaterial);
      cross1.position.set(bodyWidth * 0.35, 0, 0);
      const cross2 = new THREE.Mesh(crossRailGeo, blackPlasticMaterial);
      cross2.position.set(-bodyWidth * 0.35, 0, 0);
      bracketGroup.add(cross1);
      bracketGroup.add(cross2);

      mainGroup.add(bracketGroup);

    } else if (config.modelType === 'thermal-bag') {
      // 2. THERMAL BACKPACK MODEL
      const bagWidth = 2.4;
      const bagHeight = 3.0;
      const bagDepth = 2.2;

      const bagGeo = new THREE.BoxGeometry(bagWidth, bagHeight, bagDepth);
      const bagMat = new THREE.MeshStandardMaterial({
        color: primaryColor,
        roughness: 0.9,
      });
      const bagMesh = new THREE.Mesh(bagGeo, bagMat);
      mainGroup.add(bagMesh);

      // Front zipper flap
      const flapGroup = new THREE.Group();
      lidGroupRef.current = flapGroup;
      flapGroup.position.set(0, bagHeight / 2, bagDepth / 2);

      const frontFlapGeo = new THREE.BoxGeometry(bagWidth * 0.92, bagHeight * 0.9, 0.08);
      const logoMat = new THREE.MeshStandardMaterial({ map: brandTexture, roughness: 0.7 });
      const flapMesh = new THREE.Mesh(frontFlapGeo, logoMat);
      flapMesh.position.set(0, -bagHeight * 0.45, 0.04);
      flapGroup.add(flapMesh);
      mainGroup.add(flapGroup);

      // Reflective Safety Strip
      const stripGeo = new THREE.BoxGeometry(bagWidth * 0.85, 0.12, 0.12);
      const stripMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xcccccc,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const stripMesh = new THREE.Mesh(stripGeo, stripMat);
      stripMesh.position.set(0, 0, bagDepth / 2 + 0.06);
      mainGroup.add(stripMesh);

      // Side Drink Holders (Cylinders)
      const bottleGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.4, 16);
      const bottleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
      const bottleLeft = new THREE.Mesh(bottleGeo, bottleMat);
      bottleLeft.position.set(-bagWidth / 2 - 0.2, -0.4, 0);
      const bottleRight = new THREE.Mesh(bottleGeo, bottleMat);
      bottleRight.position.set(bagWidth / 2 + 0.2, -0.4, 0);
      mainGroup.add(bottleLeft);
      mainGroup.add(bottleRight);

    } else if (config.modelType === 'rigid-box') {
      // 3. LUXURY RIGID BOX
      const rWidth = 3.2;
      const rHeight = 1.4;
      const rDepth = 2.4;

      const baseGeo = new THREE.BoxGeometry(rWidth, rHeight, rDepth);
      const baseMesh = new THREE.Mesh(baseGeo, boxMaterial);
      mainGroup.add(baseMesh);

      // Magnetic book flap lid
      const lidGroup = new THREE.Group();
      lidGroupRef.current = lidGroup;
      lidGroup.position.set(0, rHeight / 2, -rDepth / 2);

      const lidGeo = new THREE.BoxGeometry(rWidth + 0.08, 0.1, rDepth + 0.08);
      const logoMat = new THREE.MeshStandardMaterial({ map: brandTexture, roughness: 0.15, metalness: 0.2 });
      const lidMesh = new THREE.Mesh(lidGeo, logoMat);
      lidMesh.position.set(0, 0.05, rDepth / 2);
      lidGroup.add(lidMesh);
      mainGroup.add(lidGroup);

      // Gold Ribbon pull tab
      const ribbonGeo = new THREE.BoxGeometry(0.35, 0.04, 0.3);
      const ribbonMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.7,
        roughness: 0.2,
      });
      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbon.position.set(0, 0.05, rDepth + 0.1);
      lidGroup.add(ribbon);

    } else {
      // 4. CORRUGATED MAILER BOX
      const mWidth = 3.0;
      const mHeight = 1.2;
      const mDepth = 2.2;

      const kraftMat = new THREE.MeshStandardMaterial({
        color: primaryColor,
        roughness: 0.95,
        metalness: 0.02,
      });

      const baseGeo = new THREE.BoxGeometry(mWidth, mHeight, mDepth);
      const baseMesh = new THREE.Mesh(baseGeo, kraftMat);
      mainGroup.add(baseMesh);

      const lidGroup = new THREE.Group();
      lidGroupRef.current = lidGroup;
      lidGroup.position.set(0, mHeight / 2, -mDepth / 2);

      const mailerLidGeo = new THREE.BoxGeometry(mWidth + 0.04, 0.06, mDepth + 0.04);
      const logoMat = new THREE.MeshStandardMaterial({ map: brandTexture, roughness: 0.9 });
      const lidMesh = new THREE.Mesh(mailerLidGeo, logoMat);
      lidMesh.position.set(0, 0.03, mDepth / 2);
      lidGroup.add(lidMesh);
      mainGroup.add(lidGroup);
    }

    // Shadow plane underneath
    const planeGeo = new THREE.CircleGeometry(3.5, 32);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.25,
    });
    const shadowPlane = new THREE.Mesh(planeGeo, planeMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.6;
    mainGroup.add(shadowPlane);

    sceneRef.current.add(mainGroup);
  }, [config, createBrandTexture]);

  // Handle Explode and Open Lid animation states
  useEffect(() => {
    if (!lidGroupRef.current) return;

    // Lid open angle
    if (config.openLid) {
      lidGroupRef.current.rotation.x = -Math.PI * 0.65; // open up
    } else {
      lidGroupRef.current.rotation.x = 0;
    }

    // Exploded view
    if (boxGroupRef.current) {
      if (config.explodedView) {
        if (lidGroupRef.current) lidGroupRef.current.position.y = 2.2;
        if (shelfMeshRef.current) shelfMeshRef.current.position.y = 0.8;
        if (baseBracketRef.current) baseBracketRef.current.position.y = -2.3;
      } else {
        if (lidGroupRef.current) {
          const bodyH = config.modelType === 'fiberglass-box' ? 1.2 : 0.7;
          lidGroupRef.current.position.y = bodyH;
        }
        if (shelfMeshRef.current) shelfMeshRef.current.position.y = 0;
        if (baseBracketRef.current) baseBracketRef.current.position.y = -1.4;
      }
    }
  }, [config.openLid, config.explodedView, config.modelType]);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const width = container.clientWidth;
    const heightPx = container.clientHeight || 420;
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(4.5, 3.5, 5.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff8ee, 2.2);
    mainLight.position.set(6, 8, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x88bbff, 1.0);
    fillLight.position.set(-6, 2, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, -5, -4);
    scene.add(rimLight);

    buildBoxModel();

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (isRotating && boxGroupRef.current && !isDraggingRef.current) {
        boxGroupRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [buildBoxModel, isRotating]);

  // Update model when config changes
  useEffect(() => {
    buildBoxModel();
  }, [config.modelType, config.primaryColor, config.materialFinish, config.customText, config.hasLEDLight, config.hasShelves, config.hasLock, config.ledColor, buildBoxModel]);

  // Mouse & Touch interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !boxGroupRef.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    boxGroupRef.current.rotation.y += deltaX * 0.01;
    boxGroupRef.current.rotation.x += deltaY * 0.008;

    // Limit pitch
    boxGroupRef.current.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, boxGroupRef.current.rotation.x));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive || e.touches.length === 0) return;
    isDraggingRef.current = true;
    previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !boxGroupRef.current || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

    boxGroupRef.current.rotation.y += deltaX * 0.012;
    boxGroupRef.current.rotation.x += deltaY * 0.01;
    boxGroupRef.current.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, boxGroupRef.current.rotation.x));

    previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? 0.85 : 1.15;
    cameraRef.current.position.multiplyScalar(factor);
    setZoomLevel((prev) => (direction === 'in' ? prev * 1.15 : prev / 1.15));
  };

  const resetCamera = () => {
    if (!cameraRef.current || !boxGroupRef.current) return;
    cameraRef.current.position.set(4.5, 3.5, 5.5);
    cameraRef.current.lookAt(0, 0, 0);
    boxGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full cursor-grab active:cursor-grabbing select-none"
        style={{ height }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      />

      {/* Floating 3D Badge & Status */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          Interactive 3D View
        </span>
        {config.hasLEDLight && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LED Active
          </span>
        )}
      </div>

      {/* 3D Viewport Controls overlay */}
      {interactive && (
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl pointer-events-auto">
            <button
              id="btn-3d-rotate-toggle"
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              title={isRotating ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                isRotating
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
            </button>

            {onConfigChange && (
              <>
                <button
                  id="btn-3d-lid-toggle"
                  type="button"
                  onClick={() => onConfigChange({ openLid: !config.openLid })}
                  title={config.openLid ? 'Close Lid' : 'Open Lid'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    config.openLid
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  {config.openLid ? 'Close Lid' : 'Open Lid'}
                </button>

                <button
                  id="btn-3d-explode-toggle"
                  type="button"
                  onClick={() => onConfigChange({ explodedView: !config.explodedView })}
                  title="Layer Inspection / Exploded View"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    config.explodedView
                      ? 'bg-indigo-500 text-white font-semibold'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  {config.explodedView ? 'Collapse' : 'Explode'}
                </button>

                {config.modelType === 'fiberglass-box' && (
                  <button
                    id="btn-3d-led-toggle"
                    type="button"
                    onClick={() => onConfigChange({ hasLEDLight: !config.hasLEDLight })}
                    title="Toggle Rear LED Safety Glow"
                    className={`p-2 rounded-lg text-xs transition-colors ${
                      config.hasLEDLight
                        ? 'bg-amber-400 text-slate-950'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Camera controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl pointer-events-auto">
            <button
              id="btn-3d-zoom-in"
              type="button"
              onClick={() => handleZoom('in')}
              title="Zoom In"
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 text-xs transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              id="btn-3d-zoom-out"
              type="button"
              onClick={() => handleZoom('out')}
              title="Zoom Out"
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 text-xs transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              id="btn-3d-reset-cam"
              type="button"
              onClick={resetCamera}
              title="Reset View"
              className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Helpful drag hint */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <span className="text-[11px] text-slate-400 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800/80 flex items-center gap-1">
          <Eye className="w-3 h-3 text-slate-400" />
          Drag 360° to rotate
        </span>
      </div>
    </div>
  );
};
