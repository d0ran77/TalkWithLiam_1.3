import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCcw } from 'lucide-react';
import {
  PacTabId,
  CoreNodeId,
  FunctionalNodeId,
} from '../../data/pacModel.ts';
import {
  createStudioRig,
  createCeramicAndBrassPalette,
  createMedallionFaceTexture,
  createPaperShadowTexture,
  prefersReducedMotion,
  StudioRig,
} from '../../three/studioEngine.ts';
import { playSoftThump } from '../../utils/sound.ts';

export type PacActiveNode = CoreNodeId | FunctionalNodeId;

interface PacSculptureCanvasProps {
  activeTab: PacTabId;
  activeNode: PacActiveNode;
  onSelectCoreNode: (id: CoreNodeId) => void;
  onSelectFunctionalNode: (id: FunctionalNodeId) => void;
}

interface DiscRuntime {
  key: 'topLeft' | 'topRight' | 'center' | 'bottomLeft' | 'bottomRight';
  group: THREE.Group;
  ceramicMesh: THREE.Mesh;
  brassRimMesh: THREE.Mesh;
  frontFaceMesh: THREE.Mesh;
  frontFaceMat: THREE.MeshStandardMaterial;
  coreTexture: THREE.CanvasTexture | null;
  functionalTexture: THREE.CanvasTexture;
  activeTexture: THREE.CanvasTexture;
  targetX: number;
  targetY: number;
  targetZ: number;
  targetScale: number;
  curX: number;
  curY: number;
  curZ: number;
  curScale: number;
  isVisibleTarget: boolean;
}

function createTurnedPuckGeometry(radius: number, thickness: number): THREE.LatheGeometry {
  const halfT = thickness / 2;
  const bevel = Math.min(0.065, radius * 0.14);
  const pts: THREE.Vector2[] = [
    new THREE.Vector2(0.001, -halfT),
    new THREE.Vector2(radius - bevel, -halfT),
    new THREE.Vector2(radius, -halfT + bevel),
    new THREE.Vector2(radius, halfT - bevel),
    new THREE.Vector2(radius - bevel, halfT),
    new THREE.Vector2(0.001, halfT),
  ];
  const geo = new THREE.LatheGeometry(pts, 48);
  geo.rotateX(Math.PI / 2); // Align disc flat face toward +Z viewer
  geo.computeVertexNormals();
  return geo;
}

export const PacSculptureCanvas: React.FC<PacSculptureCanvasProps> = ({
  activeTab,
  activeNode,
  onSelectCoreNode,
  onSelectFunctionalNode,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<StudioRig | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const [hasOrbited, setHasOrbited] = useState(false);

  const stateRef = useRef<{
    activeTab: PacTabId;
    activeNode: PacActiveNode;
    hoveredKey: DiscRuntime['key'] | null;
  }>({
    activeTab,
    activeNode,
    hoveredKey: null,
  });

  const callbacksRef = useRef({
    onSelectCoreNode,
    onSelectFunctionalNode,
  });
  callbacksRef.current = { onSelectCoreNode, onSelectFunctionalNode };

  const applyTargetsRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    stateRef.current.activeTab = activeTab;
    stateRef.current.activeNode = activeNode;
    applyTargetsRef.current?.();
  }, [activeTab, activeNode]);

  const handleResetView = useCallback(() => {
    const rig = rigRef.current;
    if (!rig) return;
    playSoftThump('default');
    rig.camera.position.set(0, 0.35, 7.3);
    rig.controls.target.set(0, -0.05, 0);
    rig.controls.update();
    rig.requestRender();
    setHasOrbited(false);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let rig: StudioRig;
    try {
      rig = createStudioRig(container, {
        fov: 35,
        cameraPosition: [0, 0.35, 7.3],
        controlsTarget: [0, -0.05, 0],
        minDistance: 5.2,
        maxDistance: 10.5,
        minPolarAngle: Math.PI * 0.25,
        maxPolarAngle: Math.PI * 0.68,
        onContextLost: () => setWebglUnavailable(true),
        onContextRestored: () => setWebglUnavailable(false),
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    rigRef.current = rig;
    const { scene, camera, renderer, controls, maxAnisotropy } = rig;

    const palette = createCeramicAndBrassPalette(maxAnisotropy);
    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const sculptureRoot = new THREE.Group();
    scene.add(sculptureRoot);

    // 1. Subtle radial contact shadow on paper plane
    const shadowTex = track(createPaperShadowTexture());
    const shadowGeo = track(new THREE.PlaneGeometry(4.6, 2.3));
    const shadowMat = track(
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      })
    );
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -2.36, 0);
    sculptureRoot.add(shadowPlane);

    // 2. Sculpted ceramic & brass base plinth + vertical brushed brass spine
    const plinthCeramicGeo = track(new THREE.CylinderGeometry(0.95, 1.08, 0.14, 48));
    const plinthCeramic = new THREE.Mesh(plinthCeramicGeo, palette.ceramicMatte);
    plinthCeramic.position.set(0, -2.28, 0);
    plinthCeramic.receiveShadow = true;
    plinthCeramic.castShadow = !rig.isSoftwareWebGL;
    sculptureRoot.add(plinthCeramic);

    const plinthCollarGeo = track(new THREE.CylinderGeometry(0.46, 0.56, 0.08, 40));
    const plinthCollar = new THREE.Mesh(plinthCollarGeo, palette.brushedBrass);
    plinthCollar.position.set(0, -2.18, 0);
    sculptureRoot.add(plinthCollar);

    const spineGeo = track(new THREE.CylinderGeometry(0.055, 0.068, 4.02, 24));
    const spine = new THREE.Mesh(spineGeo, palette.brushedBrass);
    spine.position.set(0, -0.22, -0.14);
    spine.castShadow = !rig.isSoftwareWebGL;
    sculptureRoot.add(spine);

    const finialGeo = track(new THREE.SphereGeometry(0.09, 24, 16));
    const finial = new THREE.Mesh(finialGeo, palette.brushedBrass);
    finial.position.set(0, 1.82, -0.14);
    sculptureRoot.add(finial);

    // 3. Horizontal telescoping brass yokes for Functional split (Parent & Child)
    const yokeGeo = track(new THREE.CylinderGeometry(0.036, 0.036, 2.1, 20));
    yokeGeo.rotateZ(Math.PI / 2);

    const topYoke = new THREE.Mesh(yokeGeo, palette.brushedBrass);
    topYoke.position.set(0, 1.24, -0.12);
    topYoke.scale.set(0.01, 1, 1);
    sculptureRoot.add(topYoke);

    const bottomYoke = new THREE.Mesh(yokeGeo, palette.brushedBrass);
    bottomYoke.position.set(0, -1.24, -0.12);
    bottomYoke.scale.set(0.01, 1, 1);
    sculptureRoot.add(bottomYoke);

    // 4. Shared disc geometries (chamfered ceramic puck + brass rim + face medallion)
    const puckGeo = track(createTurnedPuckGeometry(0.54, 0.24));
    const rimGeo = track(new THREE.TorusGeometry(0.542, 0.024, 16, 48));
    const faceGeo = track(new THREE.CircleGeometry(0.445, 48));
    const backCapGeo = track(new THREE.CircleGeometry(0.32, 32));
    backCapGeo.rotateY(Math.PI);

    // Pre-generate all medallion textures cleanly once
    const texP = track(createMedallionFaceTexture('P', 'Parent', 'cream', maxAnisotropy));
    const texPActive = track(createMedallionFaceTexture('P', 'Parent', 'charcoal', maxAnisotropy));

    const texA = track(createMedallionFaceTexture('A', 'Adult', 'cream', maxAnisotropy));
    const texAActive = track(createMedallionFaceTexture('A', 'Adult', 'forest', maxAnisotropy));

    const texC = track(createMedallionFaceTexture('C', 'Child', 'cream', maxAnisotropy));
    const texCActive = track(createMedallionFaceTexture('C', 'Child', 'charcoal', maxAnisotropy));

    const texCP = track(createMedallionFaceTexture('CP', 'Critical', 'cream', maxAnisotropy));
    const texCPActive = track(createMedallionFaceTexture('CP', 'Critical', 'charcoal', maxAnisotropy));

    const texNP = track(createMedallionFaceTexture('NP', 'Nurturing', 'cream', maxAnisotropy));
    const texNPActive = track(createMedallionFaceTexture('NP', 'Nurturing', 'forest', maxAnisotropy));

    const texAC = track(createMedallionFaceTexture('AC', 'Adapted', 'cream', maxAnisotropy));
    const texACActive = track(createMedallionFaceTexture('AC', 'Adapted', 'charcoal', maxAnisotropy));

    const texFC = track(createMedallionFaceTexture('FC', 'Free Child', 'cream', maxAnisotropy));
    const texFCActive = track(createMedallionFaceTexture('FC', 'Free Child', 'forest', maxAnisotropy));

    const createDisc = (
      key: DiscRuntime['key'],
      coreTexture: THREE.CanvasTexture | null,
      functionalTexture: THREE.CanvasTexture,
      activeTexture: THREE.CanvasTexture
    ): DiscRuntime => {
      const group = new THREE.Group();
      group.userData.discKey = key;

      const ceramicMesh = new THREE.Mesh(puckGeo, palette.ceramicMatte);
      ceramicMesh.castShadow = !rig.isSoftwareWebGL;
      ceramicMesh.receiveShadow = true;
      ceramicMesh.userData.discKey = key;
      group.add(ceramicMesh);

      const brassRimMesh = new THREE.Mesh(rimGeo, palette.brushedBrass);
      brassRimMesh.userData.discKey = key;
      group.add(brassRimMesh);

      const frontFaceMat = track(
        new THREE.MeshStandardMaterial({
          map: coreTexture ?? functionalTexture,
          roughness: 0.62,
          metalness: 0.04,
          envMapIntensity: 0.75,
        })
      );
      const frontFaceMesh = new THREE.Mesh(faceGeo, frontFaceMat);
      frontFaceMesh.position.z = 0.123;
      frontFaceMesh.userData.discKey = key;
      group.add(frontFaceMesh);

      const backCap = new THREE.Mesh(backCapGeo, palette.brushedBrass);
      backCap.position.z = -0.122;
      group.add(backCap);

      sculptureRoot.add(group);

      return {
        key,
        group,
        ceramicMesh,
        brassRimMesh,
        frontFaceMesh,
        frontFaceMat,
        coreTexture,
        functionalTexture,
        activeTexture,
        targetX: 0,
        targetY: 0,
        targetZ: 0,
        targetScale: 1,
        curX: 0,
        curY: 0,
        curZ: 0,
        curScale: 1,
        isVisibleTarget: true,
      };
    };

    const discs: Record<DiscRuntime['key'], DiscRuntime> = {
      topLeft: createDisc('topLeft', texP, texCP, texCPActive),
      topRight: createDisc('topRight', null, texNP, texNPActive),
      center: createDisc('center', texA, texA, texAActive),
      bottomLeft: createDisc('bottomLeft', texC, texAC, texACActive),
      bottomRight: createDisc('bottomRight', null, texFC, texFCActive),
    };

    const discList = Object.values(discs);
    const raycastTargets = discList.map((d) => d.group);

    let targetYokeScale = 0.01;
    let curYokeScale = 0.01;

    const applyTargets = () => {
      const { activeTab: tab, activeNode: node, hoveredKey } = stateRef.current;
      const isFunc = tab === 'functional';

      targetYokeScale = isFunc ? 1 : 0.01;

      if (!isFunc) {
        // Core Mode: P, A, C stacked cleanly on central column
        discs.topLeft.targetX = 0;
        discs.topLeft.targetY = 1.24;
        discs.topLeft.isVisibleTarget = true;

        discs.topRight.targetX = 0;
        discs.topRight.targetY = 1.24;
        discs.topRight.isVisibleTarget = false;

        discs.center.targetX = 0;
        discs.center.targetY = 0;
        discs.center.isVisibleTarget = true;

        discs.bottomLeft.targetX = 0;
        discs.bottomLeft.targetY = -1.24;
        discs.bottomLeft.isVisibleTarget = true;

        discs.bottomRight.targetX = 0;
        discs.bottomRight.targetY = -1.24;
        discs.bottomRight.isVisibleTarget = false;
      } else {
        // Functional Mode: P splits to CP/NP, C splits to AC/FC
        discs.topLeft.targetX = -0.98;
        discs.topLeft.targetY = 1.24;
        discs.topLeft.isVisibleTarget = true;

        discs.topRight.targetX = 0.98;
        discs.topRight.targetY = 1.24;
        discs.topRight.isVisibleTarget = true;

        discs.center.targetX = 0;
        discs.center.targetY = 0;
        discs.center.isVisibleTarget = true;

        discs.bottomLeft.targetX = -0.98;
        discs.bottomLeft.targetY = -1.24;
        discs.bottomLeft.isVisibleTarget = true;

        discs.bottomRight.targetX = 0.98;
        discs.bottomRight.targetY = -1.24;
        discs.bottomRight.isVisibleTarget = true;
      }

      const activeKey: DiscRuntime['key'] =
        !isFunc
          ? node === 'P'
            ? 'topLeft'
            : node === 'C'
              ? 'bottomLeft'
              : 'center'
          : node === 'CP'
            ? 'topLeft'
            : node === 'NP'
              ? 'topRight'
              : node === 'AC'
                ? 'bottomLeft'
                : node === 'FC'
                  ? 'bottomRight'
                  : 'center';

      discList.forEach((d) => {
        const isActive = d.key === activeKey && d.isVisibleTarget;
        const isHovered = d.key === hoveredKey && d.isVisibleTarget;

        d.targetZ = !d.isVisibleTarget
          ? -0.18
          : isActive
            ? 0.42
            : isHovered
              ? 0.14
              : 0;

        d.targetScale = !d.isVisibleTarget
          ? 0.001
          : isActive
            ? 1.07
            : isHovered
              ? 1.02
              : 0.97;

        // Material & texture update
        d.ceramicMesh.material = isActive
          ? palette.ceramicActive
          : palette.ceramicMatte;
        d.brassRimMesh.material = isActive || isHovered
          ? palette.brassHighlight
          : palette.brushedBrass;

        if (!isFunc) {
          if (d.key === 'topLeft') {
            d.frontFaceMat.map = isActive ? texPActive : texP;
          } else if (d.key === 'center') {
            d.frontFaceMat.map = isActive ? texAActive : texA;
          } else if (d.key === 'bottomLeft') {
            d.frontFaceMat.map = isActive ? texCActive : texC;
          }
        } else {
          d.frontFaceMat.map = isActive ? d.activeTexture : d.functionalTexture;
        }
        d.frontFaceMat.needsUpdate = true;
      });

      rig.requestRender();
    };

    applyTargetsRef.current = applyTargets;
    applyTargets();

    // Initialize current state immediately on first mount so it renders clean without initial jump
    discList.forEach((d) => {
      d.curX = d.targetX;
      d.curY = d.targetY;
      d.curZ = d.targetZ;
      d.curScale = d.targetScale;
      d.group.position.set(d.curX, d.curY, d.curZ);
      d.group.scale.setScalar(d.curScale);
      d.group.visible = d.curScale > 0.02;
    });
    curYokeScale = targetYokeScale;
    topYoke.scale.x = curYokeScale;
    bottomYoke.scale.x = curYokeScale;
    topYoke.visible = curYokeScale > 0.05;
    bottomYoke.visible = curYokeScale > 0.05;

    const reduced = prefersReducedMotion();

    rig.setUpdateCallback((dt) => {
      let moving = false;
      const dampLambda = reduced ? 60 : 8.5;

      const nextYoke = reduced
        ? targetYokeScale
        : THREE.MathUtils.damp(curYokeScale, targetYokeScale, dampLambda, dt);
      if (Math.abs(nextYoke - targetYokeScale) > 0.001) moving = true;
      curYokeScale = Math.abs(nextYoke - targetYokeScale) <= 0.001 ? targetYokeScale : nextYoke;

      topYoke.scale.x = Math.max(0.001, curYokeScale);
      bottomYoke.scale.x = Math.max(0.001, curYokeScale);
      topYoke.visible = curYokeScale > 0.03;
      bottomYoke.visible = curYokeScale > 0.03;

      for (let i = 0; i < discList.length; i++) {
        const d = discList[i];
        const nx = reduced ? d.targetX : THREE.MathUtils.damp(d.curX, d.targetX, dampLambda, dt);
        const ny = reduced ? d.targetY : THREE.MathUtils.damp(d.curY, d.targetY, dampLambda, dt);
        const nz = reduced ? d.targetZ : THREE.MathUtils.damp(d.curZ, d.targetZ, dampLambda, dt);
        const ns = reduced
          ? d.targetScale
          : THREE.MathUtils.damp(d.curScale, d.targetScale, dampLambda, dt);

        if (
          Math.abs(nx - d.targetX) > 0.001 ||
          Math.abs(ny - d.targetY) > 0.001 ||
          Math.abs(nz - d.targetZ) > 0.001 ||
          Math.abs(ns - d.targetScale) > 0.001
        ) {
          moving = true;
        }

        d.curX = Math.abs(nx - d.targetX) <= 0.001 ? d.targetX : nx;
        d.curY = Math.abs(ny - d.targetY) <= 0.001 ? d.targetY : ny;
        d.curZ = Math.abs(nz - d.targetZ) <= 0.001 ? d.targetZ : nz;
        d.curScale = Math.abs(ns - d.targetScale) <= 0.001 ? d.targetScale : ns;

        d.group.position.set(d.curX, d.curY, d.curZ);
        d.group.scale.setScalar(Math.max(0.001, d.curScale));
        d.group.visible = d.curScale > 0.03;
      }

      return moving;
    });

    // Raycasting & Pointer Selection (pre-allocated zero-GC)
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

    const pickDiscKey = (clientX: number, clientY: number): DiscRuntime['key'] | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(raycastTargets, true);
      for (let i = 0; i < hits.length; i++) {
        let obj: THREE.Object3D | null = hits[i].object;
        while (obj) {
          if (obj.userData?.discKey && obj.visible) {
            return obj.userData.discKey as DiscRuntime['key'];
          }
          obj = obj.parent;
        }
      }
      return null;
    };

    const onPointerMove = (e: PointerEvent) => {
      const hitKey = pickDiscKey(e.clientX, e.clientY);
      renderer.domElement.style.cursor = hitKey ? 'pointer' : 'grab';
      if (stateRef.current.hoveredKey !== hitKey) {
        stateRef.current.hoveredKey = hitKey;
        applyTargets();
      }
    };

    const onPointerLeave = () => {
      renderer.domElement.style.cursor = 'grab';
      if (stateRef.current.hoveredKey !== null) {
        stateRef.current.hoveredKey = null;
        applyTargets();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dist > 6) {
        setHasOrbited(true);
        return;
      }
      const hitKey = pickDiscKey(e.clientX, e.clientY);
      if (!hitKey) return;

      playSoftThump('bright');
      if (stateRef.current.activeTab === 'core') {
        if (hitKey === 'topLeft') callbacksRef.current.onSelectCoreNode('P');
        else if (hitKey === 'center') callbacksRef.current.onSelectCoreNode('A');
        else if (hitKey === 'bottomLeft') callbacksRef.current.onSelectCoreNode('C');
      } else {
        if (hitKey === 'topLeft') callbacksRef.current.onSelectFunctionalNode('CP');
        else if (hitKey === 'topRight') callbacksRef.current.onSelectFunctionalNode('NP');
        else if (hitKey === 'center') callbacksRef.current.onSelectFunctionalNode('A');
        else if (hitKey === 'bottomLeft') callbacksRef.current.onSelectFunctionalNode('AC');
        else if (hitKey === 'bottomRight') callbacksRef.current.onSelectFunctionalNode('FC');
      }
    };

    const onControlsStart = () => setHasOrbited(true);

    controls.addEventListener('start', onControlsStart);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    return () => {
      applyTargetsRef.current = null;
      controls.removeEventListener('start', onControlsStart);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      disposables.forEach((d) => d.dispose());
      palette.dispose();
      rig.dispose();
      rigRef.current = null;
    };
  }, []);

  if (webglUnavailable) {
    return (
      <div className="w-full h-[260px] sm:h-[310px] flex flex-col items-center justify-center bg-[#FAF9F5] select-none px-4">
        <div className="flex flex-col items-center gap-3">
          {activeTab === 'core' ? (
            <>
              <button
                type="button"
                onClick={() => onSelectCoreNode('P')}
                className={`w-16 h-16 rounded-full border transition-all font-serif text-xl cursor-pointer ${
                  activeNode === 'P'
                    ? 'bg-[#18181B] text-[#FAF9F5] border-[#B89656]'
                    : 'bg-[#F2EFE9] text-[#18181B] border-[#C29D59]/60'
                }`}
              >
                P
              </button>
              <button
                type="button"
                onClick={() => onSelectCoreNode('A')}
                className={`w-16 h-16 rounded-full border transition-all font-serif text-xl cursor-pointer ${
                  activeNode === 'A'
                    ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#B89656]'
                    : 'bg-[#F2EFE9] text-[#18181B] border-[#C29D59]/60'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onSelectCoreNode('C')}
                className={`w-16 h-16 rounded-full border transition-all font-serif text-xl cursor-pointer ${
                  activeNode === 'C'
                    ? 'bg-[#18181B] text-[#FAF9F5] border-[#B89656]'
                    : 'bg-[#F2EFE9] text-[#18181B] border-[#C29D59]/60'
                }`}
              >
                C
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-6">
                {(['CP', 'NP'] as FunctionalNodeId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSelectFunctionalNode(id)}
                    className={`w-15 h-15 rounded-full border font-serif text-base cursor-pointer ${
                      activeNode === id
                        ? 'bg-[#18181B] text-[#FAF9F5] border-[#B89656]'
                        : 'bg-[#F2EFE9] text-[#18181B] border-[#C29D59]/60'
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onSelectFunctionalNode('A')}
                className={`w-15 h-15 rounded-full border font-serif text-base cursor-pointer ${
                  activeNode === 'A'
                    ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#B89656]'
                    : 'bg-[#F2EFE9] text-[#18181B] border-[#C29D59]/60'
                }`}
              >
                A
              </button>
              <div className="flex items-center gap-6">
                {(['AC', 'FC'] as FunctionalNodeId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSelectFunctionalNode(id)}
                    className={`w-15 h-15 rounded-full border font-serif text-base cursor-pointer ${
                      activeNode === id
                        ? 'bg-[#18181B] text-[#FAF9F5] border-[#B89656]'
                        : 'bg-[#F2EFE9] text-[#18181B] border-[#C29D59]/60'
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[270px] sm:h-[330px] lg:h-[360px] select-none">
      <div
        ref={mountRef}
        className="w-full h-full"
        aria-label="Interactive 3D ceramic and brushed brass PAC Model sculpture. Drag to rotate or click a disc to inspect."
      />

      {/* Quiet solid-paper reset button (no backdrop-filter over WebGL) */}
      <div className="absolute bottom-2 right-2 flex items-center gap-2 pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-stone-400">
          Drag to orbit · Click disc
        </span>
        {hasOrbited && (
          <button
            type="button"
            onClick={handleResetView}
            className="pointer-events-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF9F5] border border-stone-200 text-[10px] font-mono uppercase tracking-[0.14em] text-stone-600 hover:text-stone-950 hover:border-stone-400 transition-colors cursor-pointer"
            aria-label="Reset 3D camera angle"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
