import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const PAPER_BG_HEX = '#FAF9F5';
export const FOREST_GREEN_HEX = '#2D5A43';
export const CHARCOAL_INK_HEX = '#18181B';
export const WARM_BRASS_HEX = '#C29D59';
export const DARK_BRONZE_HEX = '#35322E';
export const MATTE_CERAMIC_HEX = '#F2EFE9';

let cachedSoftwareWebGL: boolean | null = null;

/**
 * Probes WebGL2/WebGL once to detect software rasterizers (SwiftShader, llvmpipe, etc.)
 * and frees the probe context immediately afterwards.
 */
export function detectSoftwareWebGL(): boolean {
  if (cachedSoftwareWebGL !== null) return cachedSoftwareWebGL;
  if (typeof document === 'undefined') {
    cachedSoftwareWebGL = false;
    return false;
  }
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = (probeCanvas.getContext('webgl2') ||
      probeCanvas.getContext('webgl')) as WebGLRenderingContext | WebGL2RenderingContext | null;
    if (!gl) {
      cachedSoftwareWebGL = false;
      return false;
    }
    const debugExt = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugExt) {
      const renderer = String(gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) || '');
      cachedSoftwareWebGL = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(renderer);
    } else {
      cachedSoftwareWebGL = false;
    }
    const loseCtx = gl.getExtension('WEBGL_lose_context');
    if (loseCtx) loseCtx.loseContext();
  } catch {
    cachedSoftwareWebGL = false;
  }
  return cachedSoftwareWebGL;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Deterministic PRNG for procedural ceramic speckles and brushed metal grain.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface CeramicBrassPalette {
  ceramicMatte: THREE.MeshPhysicalMaterial;
  ceramicActive: THREE.MeshPhysicalMaterial;
  ceramicForest: THREE.MeshPhysicalMaterial;
  brushedBrass: THREE.MeshStandardMaterial;
  brassHighlight: THREE.MeshStandardMaterial;
  darkBronze: THREE.MeshStandardMaterial;
  dispose: () => void;
}

function createCeramicSpeckleTextures(maxAnisotropy: number) {
  const size = 256;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const ctx = colorCanvas.getContext('2d');

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');

  const rand = mulberry32(41927);

  if (ctx && rCtx) {
    ctx.fillStyle = MATTE_CERAMIC_HEX;
    ctx.fillRect(0, 0, size, size);

    rCtx.fillStyle = '#B8B8B8'; // ~0.72 base matte stoneware roughness
    rCtx.fillRect(0, 0, size, size);

    // Soft mineral clay mottling
    for (let i = 0; i < 650; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const radius = 0.4 + rand() * 1.1;
      const tone = rand();
      ctx.fillStyle =
        tone > 0.65
          ? 'rgba(255, 253, 248, 0.35)'
          : tone > 0.2
            ? 'rgba(214, 206, 193, 0.28)'
            : 'rgba(130, 118, 102, 0.16)';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      const rShade = Math.floor(165 + rand() * 45);
      rCtx.fillStyle = `rgb(${rShade},${rShade},${rShade})`;
      rCtx.fillRect(x, y, 1.5, 1.5);
    }
  }

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(2, 2);
  colorMap.anisotropy = maxAnisotropy;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(2, 2);
  roughnessMap.anisotropy = maxAnisotropy;

  return { colorMap, roughnessMap };
}

function createBrushedBrassTextures(maxAnisotropy: number) {
  const size = 256;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const ctx = colorCanvas.getContext('2d');

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');

  const rand = mulberry32(99173);

  if (ctx && rCtx) {
    ctx.fillStyle = WARM_BRASS_HEX;
    ctx.fillRect(0, 0, size, size);

    rCtx.fillStyle = '#525252';
    rCtx.fillRect(0, 0, size, size);

    // Fine directional horizontal hairline brushing
    for (let y = 0; y < size; y++) {
      const alpha = 0.04 + rand() * 0.1;
      ctx.fillStyle =
        rand() > 0.5
          ? `rgba(244, 224, 178, ${alpha})`
          : `rgba(128, 96, 44, ${alpha})`;
      ctx.fillRect(0, y, size, 1);

      const rv = Math.floor(66 + rand() * 44);
      rCtx.fillStyle = `rgb(${rv},${rv},${rv})`;
      rCtx.fillRect(0, y, size, 1);
    }
  }

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(2, 1);
  colorMap.anisotropy = maxAnisotropy;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(2, 1);
  roughnessMap.anisotropy = maxAnisotropy;

  return { colorMap, roughnessMap };
}

export function createCeramicAndBrassPalette(maxAnisotropy: number): CeramicBrassPalette {
  const ceramicTex = createCeramicSpeckleTextures(maxAnisotropy);
  const brassTex = createBrushedBrassTextures(maxAnisotropy);

  const ceramicMatte = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFFFFF'),
    map: ceramicTex.colorMap,
    roughnessMap: ceramicTex.roughnessMap,
    roughness: 0.78,
    metalness: 0.02,
    clearcoat: 0.08,
    clearcoatRoughness: 0.65,
    envMapIntensity: 0.85,
  });

  const ceramicActive = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFFDF8'),
    map: ceramicTex.colorMap,
    roughnessMap: ceramicTex.roughnessMap,
    roughness: 0.56,
    metalness: 0.02,
    clearcoat: 0.16,
    clearcoatRoughness: 0.42,
    emissive: new THREE.Color('#F3ECDD'),
    emissiveIntensity: 0.08,
    envMapIntensity: 1.0,
  });

  const ceramicForest = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#E3ECE6'),
    map: ceramicTex.colorMap,
    roughnessMap: ceramicTex.roughnessMap,
    roughness: 0.58,
    metalness: 0.03,
    clearcoat: 0.16,
    clearcoatRoughness: 0.4,
    emissive: new THREE.Color(FOREST_GREEN_HEX),
    emissiveIntensity: 0.06,
    envMapIntensity: 0.95,
  });

  const brushedBrass = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FFFFFF'),
    map: brassTex.colorMap,
    roughnessMap: brassTex.roughnessMap,
    metalness: 0.88,
    roughness: 0.28,
    envMapIntensity: 1.35,
  });

  const brassHighlight = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#E6C987'),
    map: brassTex.colorMap,
    roughnessMap: brassTex.roughnessMap,
    metalness: 0.9,
    roughness: 0.22,
    emissive: new THREE.Color('#8E6B29'),
    emissiveIntensity: 0.16,
    envMapIntensity: 1.45,
  });

  const darkBronze = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#5A534B'),
    roughnessMap: brassTex.roughnessMap,
    metalness: 0.72,
    roughness: 0.42,
    envMapIntensity: 1.05,
  });

  return {
    ceramicMatte,
    ceramicActive,
    ceramicForest,
    brushedBrass,
    brassHighlight,
    darkBronze,
    dispose: () => {
      ceramicTex.colorMap.dispose();
      ceramicTex.roughnessMap.dispose();
      brassTex.colorMap.dispose();
      brassTex.roughnessMap.dispose();
      ceramicMatte.dispose();
      ceramicActive.dispose();
      ceramicForest.dispose();
      brushedBrass.dispose();
      brassHighlight.dispose();
      darkBronze.dispose();
    },
  };
}

/**
 * Generates an inlaid ceramic/brass medallion face texture with crisp typography
 * so letters and station titles sit directly on the physical 3D sculpture.
 */
export function createMedallionFaceTexture(
  primaryText: string,
  secondaryText: string,
  variant: 'cream' | 'charcoal' | 'forest',
  maxAnisotropy: number
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const cx = size / 2;
    const cy = size / 2;

    const bg =
      variant === 'charcoal'
        ? '#1C1C20'
        : variant === 'forest'
          ? '#2D5A43'
          : '#F7F4EC';
    const fg = variant === 'cream' ? '#18181B' : '#FAF9F5';
    const subFg = variant === 'cream' ? '#71717A' : 'rgba(250, 249, 245, 0.78)';
    const ringFg =
      variant === 'cream'
        ? 'rgba(184, 150, 86, 0.65)'
        : 'rgba(218, 190, 132, 0.72)';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    // Subtle hairline brass inlay circle inside disc face
    ctx.strokeStyle = ringFg;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.42, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (secondaryText) {
      ctx.fillStyle = fg;
      const fontSize =
        primaryText.length <= 2
          ? 128
          : primaryText.length <= 6
            ? 72
            : primaryText.length <= 8
              ? 58
              : 46;
      ctx.font = `600 ${fontSize}px Georgia, "Times New Roman", serif`;
      ctx.fillText(primaryText, cx, cy - 18);

      ctx.fillStyle = subFg;
      ctx.font = '600 24px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(secondaryText.toUpperCase(), cx, cy + 56);
    } else {
      ctx.fillStyle = fg;
      ctx.font = '600 132px Georgia, "Times New Roman", serif';
      ctx.fillText(primaryText, cx, cy);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a whisper-soft radial contact shadow texture on #FAF9F5 paper.
 */
export function createPaperShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = size / 2;
    const grad = ctx.createRadialGradient(cx, cx, 8, cx, cx, cx);
    grad.addColorStop(0, 'rgba(24, 24, 27, 0.16)');
    grad.addColorStop(0.45, 'rgba(24, 24, 27, 0.06)');
    grad.addColorStop(1, 'rgba(24, 24, 27, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface StudioRigOptions {
  fov?: number;
  cameraPosition?: [number, number, number];
  controlsTarget?: [number, number, number];
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  afterDraw?: () => void;
  onContextLost?: () => void;
  onContextRestored?: () => void;
}

export interface StudioRig {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  isSoftwareWebGL: boolean;
  maxAnisotropy: number;
  requestRender: () => void;
  setUpdateCallback: (fn: (dt: number) => boolean) => void;
  dispose: () => void;
}

/**
 * Sets up a calm warm-paper Three.js studio rig with RoomEnvironment reflections,
 * warm studio key light, soft shadows, OrbitControls, coalesced on-demand rendering,
 * software-WebGL protection, and ResizeObserver responsiveness.
 */
export function createStudioRig(
  container: HTMLElement,
  options: StudioRigOptions = {}
): StudioRig {
  const isSoftwareWebGL = detectSoftwareWebGL();
  const reducedMotion = prefersReducedMotion();

  const width = Math.max(container.clientWidth || 320, 1);
  const height = Math.max(container.clientHeight || 280, 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAPER_BG_HEX);
  scene.fog = new THREE.Fog(PAPER_BG_HEX, 11, 22);

  const camera = new THREE.PerspectiveCamera(options.fov ?? 36, width / height, 0.1, 40);
  const camPos = options.cameraPosition ?? [0, 0.65, 7.6];
  camera.position.set(camPos[0], camPos[1], camPos[2]);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareWebGL,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareWebGL ? 1 : 2));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = !isSoftwareWebGL;
  if (!isSoftwareWebGL) {
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.outline = 'none';
  renderer.domElement.style.touchAction = 'pan-y';
  container.appendChild(renderer.domElement);

  const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy() || 1);

  // Environment IBL via RoomEnvironment + PMREMGenerator (authentic brass highlights)
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const roomEnv = new RoomEnvironment();
  const envRenderTarget = pmrem.fromScene(roomEnv, 0.04);
  scene.environment = envRenderTarget.texture;
  roomEnv.dispose();
  pmrem.dispose();

  // Studio Lighting (Key, Hemisphere Fill, Subtle Back Rim)
  const hemiLight = new THREE.HemisphereLight('#FFFDF8', '#D8D0C2', 0.85);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight('#FFF8EC', 1.65);
  keyLight.position.set(3.8, 5.4, 4.6);
  if (!isSoftwareWebGL) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 16;
    const d = 3.8;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0006;
    keyLight.shadow.normalBias = 0.02;
  }
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight('#F4EFE4', 0.72);
  rimLight.position.set(-4.0, 2.2, -3.8);
  scene.add(rimLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  const target = options.controlsTarget ?? [0, 0, 0];
  controls.target.set(target[0], target[1], target[2]);
  controls.enablePan = false;
  controls.enableDamping = !isSoftwareWebGL && !reducedMotion;
  controls.dampingFactor = 0.075;
  controls.minDistance = options.minDistance ?? 4.8;
  controls.maxDistance = options.maxDistance ?? 11.0;
  controls.minPolarAngle = options.minPolarAngle ?? Math.PI * 0.24;
  controls.maxPolarAngle = options.maxPolarAngle ?? Math.PI * 0.72;
  controls.rotateSpeed = 0.72;
  controls.zoomSpeed = 0.65;
  controls.update();

  let rafId = 0;
  let dirty = true;
  let lastTime = performance.now();
  let disposed = false;
  let updateCallback: ((dt: number) => boolean) | null = null;
  let afterDrawTimer: number | null = null;

  const drawNow = (now: number) => {
    rafId = 0;
    if (disposed) return;

    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;

    const controlsMoving = controls.update();
    const animRunning = updateCallback ? updateCallback(dt) : false;

    renderer.render(scene, camera);

    if (options.afterDraw) {
      if (isSoftwareWebGL) {
        if (afterDrawTimer !== null) window.clearTimeout(afterDrawTimer);
        afterDrawTimer = window.setTimeout(() => options.afterDraw?.(), 140);
      } else {
        options.afterDraw();
      }
    }

    dirty = Boolean(controlsMoving || animRunning);
    if (dirty && !disposed) {
      rafId = window.requestAnimationFrame(drawNow);
    }
  };

  const requestRender = () => {
    if (disposed) return;
    dirty = true;
    if (!rafId) {
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(drawNow);
    }
  };

  const onControlsChange = () => {
    requestRender();
  };
  controls.addEventListener('change', onControlsChange);

  const handleResize = () => {
    if (disposed) return;
    const w = Math.max(container.clientWidth || 320, 1);
    const h = Math.max(container.clientHeight || 280, 1);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    requestRender();
  };

  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(container);

  const onLost = (e: Event) => {
    e.preventDefault();
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    options.onContextLost?.();
  };
  const onRestored = () => {
    options.onContextRestored?.();
    requestRender();
  };

  renderer.domElement.addEventListener('webglcontextlost', onLost);
  renderer.domElement.addEventListener('webglcontextrestored', onRestored);

  requestRender();

  return {
    scene,
    camera,
    renderer,
    controls,
    isSoftwareWebGL,
    maxAnisotropy,
    requestRender,
    setUpdateCallback: (fn) => {
      updateCallback = fn;
      requestRender();
    },
    dispose: () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      if (afterDrawTimer !== null) window.clearTimeout(afterDrawTimer);
      resizeObserver.disconnect();
      controls.removeEventListener('change', onControlsChange);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
      envRenderTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}
