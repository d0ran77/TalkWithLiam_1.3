import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const PAPER_BG_HEX = '#FAF9F5';
export const FOREST_GREEN_HEX = '#2D5A43';
export const CHARCOAL_INK_HEX = '#18181B';
export const GRAPHITE_LINE_HEX = '#71717A';
export const MATTE_PORCELAIN_HEX = '#F5F3EC';

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

export interface CharcoalPaperPalette {
  porcelainMatte: THREE.MeshPhysicalMaterial;
  porcelainActive: THREE.MeshPhysicalMaterial;
  porcelainForest: THREE.MeshPhysicalMaterial;
  charcoalInk: THREE.MeshStandardMaterial;
  graphiteInk: THREE.MeshStandardMaterial;
  forestInk: THREE.MeshStandardMaterial;
  dispose: () => void;
}

function createPaperPorcelainTextures(maxAnisotropy: number) {
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
    ctx.fillStyle = MATTE_PORCELAIN_HEX;
    ctx.fillRect(0, 0, size, size);

    rCtx.fillStyle = '#C8C8C8';
    rCtx.fillRect(0, 0, size, size);

    // Subtle fine cotton-paper / matte porcelain grain
    for (let i = 0; i < 520; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const radius = 0.4 + rand() * 0.9;
      const tone = rand();
      ctx.fillStyle =
        tone > 0.65
          ? 'rgba(255, 255, 255, 0.35)'
          : 'rgba(113, 113, 122, 0.08)';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      const rShade = Math.floor(185 + rand() * 35);
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

export function createCharcoalPaperPalette(maxAnisotropy: number): CharcoalPaperPalette {
  const paperTex = createPaperPorcelainTextures(maxAnisotropy);

  const porcelainMatte = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFFFFF'),
    map: paperTex.colorMap,
    roughnessMap: paperTex.roughnessMap,
    roughness: 0.84,
    metalness: 0.0,
    clearcoat: 0.04,
    clearcoatRoughness: 0.78,
    envMapIntensity: 0.55,
  });

  const porcelainActive = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(CHARCOAL_INK_HEX),
    roughness: 0.62,
    metalness: 0.04,
    clearcoat: 0.06,
    clearcoatRoughness: 0.55,
    envMapIntensity: 0.65,
  });

  const porcelainForest = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(FOREST_GREEN_HEX),
    roughness: 0.62,
    metalness: 0.04,
    clearcoat: 0.06,
    clearcoatRoughness: 0.55,
    envMapIntensity: 0.65,
  });

  const charcoalInk = new THREE.MeshStandardMaterial({
    color: new THREE.Color(CHARCOAL_INK_HEX),
    roughness: 0.58,
    metalness: 0.06,
    envMapIntensity: 0.5,
  });

  const graphiteInk = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#A1A1AA'),
    roughness: 0.66,
    metalness: 0.04,
    envMapIntensity: 0.45,
  });

  const forestInk = new THREE.MeshStandardMaterial({
    color: new THREE.Color(FOREST_GREEN_HEX),
    roughness: 0.56,
    metalness: 0.06,
    envMapIntensity: 0.55,
  });

  return {
    porcelainMatte,
    porcelainActive,
    porcelainForest,
    charcoalInk,
    graphiteInk,
    forestInk,
    dispose: () => {
      paperTex.colorMap.dispose();
      paperTex.roughnessMap.dispose();
      porcelainMatte.dispose();
      porcelainActive.dispose();
      porcelainForest.dispose();
      charcoalInk.dispose();
      graphiteInk.dispose();
      forestInk.dispose();
    },
  };
}

/**
 * Crisp charcoal ink & paper medallion face texture (zero brass).
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
        ? CHARCOAL_INK_HEX
        : variant === 'forest'
          ? FOREST_GREEN_HEX
          : '#FAF9F5';
    const fg = variant === 'cream' ? CHARCOAL_INK_HEX : '#FAF9F5';
    const subFg = variant === 'cream' ? GRAPHITE_LINE_HEX : 'rgba(250, 249, 245, 0.78)';
    const ringFg =
      variant === 'cream'
        ? 'rgba(24, 24, 27, 0.22)'
        : 'rgba(250, 249, 245, 0.28)';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = ringFg;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.43, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (secondaryText) {
      ctx.fillStyle = fg;
      const fontSize =
        primaryText.length <= 2
          ? 124
          : primaryText.length <= 6
            ? 70
            : primaryText.length <= 8
              ? 56
              : 44;
      ctx.font = `600 ${fontSize}px Georgia, "Times New Roman", serif`;
      ctx.fillText(primaryText, cx, cy - 18);

      ctx.fillStyle = subFg;
      ctx.font = '600 24px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(secondaryText.toUpperCase(), cx, cy + 56);
    } else {
      ctx.fillStyle = fg;
      ctx.font = '600 128px Georgia, "Times New Roman", serif';
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
 * Generates a split-circle half-face texture mapped cleanly onto Three.js CircleGeometry
 * semicircle UVs (left half samples u in [0, 0.5]; right half samples u in [0.5, 1]).
 */
export function createHalfMedallionFaceTexture(
  letter: string,
  subLabel: string,
  side: 'left' | 'right',
  variant: 'cream' | 'charcoal' | 'forest',
  maxAnisotropy: number
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const bg =
      variant === 'charcoal'
        ? CHARCOAL_INK_HEX
        : variant === 'forest'
          ? FOREST_GREEN_HEX
          : '#FAF9F5';
    const fg = variant === 'cream' ? CHARCOAL_INK_HEX : '#FAF9F5';
    const subFg = variant === 'cream' ? GRAPHITE_LINE_HEX : 'rgba(250, 249, 245, 0.8)';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    // Center each label cleanly inside the semicircular quadrant centroid
    const xCenter = side === 'left' ? size * 0.28 : size * 0.72;
    const yCenter = size * 0.5;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = fg;
    ctx.font = '600 74px Georgia, "Times New Roman", serif';
    ctx.fillText(letter, xCenter, yCenter - 20);

    ctx.fillStyle = subFg;
    ctx.font = '600 20px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(subLabel.toUpperCase(), xCenter, yCenter + 40);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a soft neutral contact shadow gradient for #FAF9F5 paper.
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
    grad.addColorStop(0, 'rgba(24, 24, 27, 0.14)');
    grad.addColorStop(0.5, 'rgba(24, 24, 27, 0.05)');
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
  lookAtTarget?: [number, number, number];
  afterDraw?: () => void;
  onContextLost?: () => void;
  onContextRestored?: () => void;
}

export interface StudioRig {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  isSoftwareWebGL: boolean;
  maxAnisotropy: number;
  requestRender: () => void;
  setUpdateCallback: (fn: (dt: number) => boolean) => void;
  dispose: () => void;
}

/**
 * Sets up a clean paper-and-ink Three.js studio rig with RoomEnvironment reflections,
 * soft studio light, fixed architectural framing, touch-ready coalesced rendering,
 * software-WebGL protection, and ResizeObserver responsiveness.
 */
export function createStudioRig(
  container: HTMLElement,
  options: StudioRigOptions = {}
): StudioRig {
  const isSoftwareWebGL = detectSoftwareWebGL();

  const width = Math.max(container.clientWidth || 320, 1);
  const height = Math.max(container.clientHeight || 240, 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAPER_BG_HEX);
  scene.fog = new THREE.Fog(PAPER_BG_HEX, 11, 22);

  const camera = new THREE.PerspectiveCamera(options.fov ?? 34, width / height, 0.1, 40);
  const camPos = options.cameraPosition ?? [0, 0, 7.1];
  const lookAt = options.lookAtTarget ?? [0, 0, 0];
  camera.position.set(camPos[0], camPos[1], camPos[2]);
  camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareWebGL,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareWebGL ? 1 : 2));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = !isSoftwareWebGL;
  if (!isSoftwareWebGL) {
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.outline = 'none';
  // Allow smooth single-finger interactive tilt directly on canvas while keeping outside page scroll
  renderer.domElement.style.touchAction = 'none';
  container.appendChild(renderer.domElement);

  const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy() || 1);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const roomEnv = new RoomEnvironment();
  const envRenderTarget = pmrem.fromScene(roomEnv, 0.04);
  scene.environment = envRenderTarget.texture;
  roomEnv.dispose();
  pmrem.dispose();

  const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#E4E0D8', 0.95);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight('#FFFDF9', 1.35);
  keyLight.position.set(2.8, 4.4, 5.6);
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

  const rimLight = new THREE.DirectionalLight('#F4F4F5', 0.52);
  rimLight.position.set(-3.4, 1.8, -3.5);
  scene.add(rimLight);

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

    dirty = Boolean(animRunning);
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

  const handleResize = () => {
    if (disposed) return;
    const w = Math.max(container.clientWidth || 320, 1);
    const h = Math.max(container.clientHeight || 240, 1);
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
