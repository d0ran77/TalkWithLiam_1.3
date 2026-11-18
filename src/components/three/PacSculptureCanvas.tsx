import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  PacTabId,
  CoreNodeId,
  FunctionalNodeId,
} from '../../data/pacModel.ts';
import {
  createStudioRig,
  createCharcoalPaperPalette,
  createMedallionFaceTexture,
  createHalfMedallionFaceTexture,
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

type InteractivePartKey = 'P' | 'A' | 'C' | 'CP' | 'NP' | 'AC' | 'FC';

interface PartRuntime {
  key: InteractivePartKey;
  group: THREE.Group;
  porcelainMesh: THREE.Mesh;
  inkRimMesh: THREE.Mesh;
  seamMesh?: THREE.Mesh;
  frontFaceMat: THREE.MeshStandardMaterial;
  shadowMesh: THREE.Mesh;
  baseTex: THREE.CanvasTexture;
  activeTex: THREE.CanvasTexture;
  baseX: number;
  baseY: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  targetScale: number;
  curX: number;
  curY: number;
  curZ: number;
  curScale: number;
  isVisibleTarget: boolean;
  useForestOnActive: boolean;
}

function createFullDiscGeometry(radius: number, thickness: number): THREE.LatheGeometry {
  const halfT = thickness / 2;
  const bevel = 0.036;
  const pts: THREE.Vector2[] = [
    new THREE.Vector2(0.001, -halfT),
    new THREE.Vector2(radius - bevel, -halfT),
    new THREE.Vector2(radius, -halfT + bevel),
    new THREE.Vector2(radius, halfT - bevel),
    new THREE.Vector2(radius - bevel, halfT),
    new THREE.Vector2(0.001, halfT),
  ];
  const geo = new THREE.LatheGeometry(pts, 56);
  geo.rotateX(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function createHalfDiscGeometry(
  radius: number,
  thickness: number,
  side: 'left' | 'right'
): THREE.ExtrudeGeometry {
  const innerR = radius - 0.02;
  const shape = new THREE.Shape();
  if (side === 'right') {
    shape.moveTo(0, -innerR);
    shape.absarc(0, 0, innerR, -Math.PI / 2, Math.PI / 2, false);
    shape.lineTo(0, -innerR);
  } else {
    shape.moveTo(0, innerR);
    shape.absarc(0, 0, innerR, Math.PI / 2, Math.PI * 1.5, false);
    shape.lineTo(0, innerR);
  }
  const coreDepth = Math.max(0.04, thickness - 0.04);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: coreDepth,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3,
    curveSegments: 40,
  });
  geo.translate(0, 0, -coreDepth / 2);
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

  const stateRef = useRef<{
    activeTab: PacTabId;
    activeNode: PacActiveNode;
    hoveredKey: InteractivePartKey | null;
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

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let rig: StudioRig;
    try {
      rig = createStudioRig(container, {
        fov: 34,
        cameraPosition: [0, 0, 7.6],
        lookAtTarget: [0, 0, 0],
        onContextLost: () => setWebglUnavailable(true),
        onContextRestored: () => setWebglUnavailable(false),
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    rigRef.current = rig;
    const { scene, camera, renderer, maxAnisotropy } = rig;

    const palette = createCharcoalPaperPalette(maxAnisotropy);
    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const sculptureRoot = new THREE.Group();
    scene.add(sculptureRoot);

    // Floating short charcoal ink dash marks centered cleanly in open air BETWEEN circles (zero touching rims)
    const dashGeo = track(new THREE.CylinderGeometry(0.011, 0.011, 0.14, 12));
    const upperDash = new THREE.Mesh(dashGeo, palette.graphiteInk);
    upperDash.position.set(0, 0.72, -0.02);
    const lowerDash = new THREE.Mesh(dashGeo, palette.graphiteInk);
    lowerDash.position.set(0, -0.72, -0.02);
    sculptureRoot.add(upperDash, lowerDash);

    // Subtle floating neutral drop shadows
    const shadowTex = track(createPaperShadowTexture());
    const fullShadowGeo = track(new THREE.PlaneGeometry(1.42, 1.42));
    const halfShadowGeo = track(new THREE.PlaneGeometry(0.92, 1.32));

    // Shared porcelain & charcoal ink geometries (radius 0.54, centered at y = +1.44, 0, -1.44 -> 0.36 gap)
    const R = 0.54;
    const T = 0.14;
    const fullDiscGeo = track(createFullDiscGeometry(R, T));
    const fullRimGeo = track(new THREE.TorusGeometry(R + 0.004, 0.014, 12, 56));
    const fullFaceGeo = track(new THREE.CircleGeometry(R - 0.04, 56));
    const fullBackGeo = track(new THREE.CircleGeometry(R - 0.06, 40));
    fullBackGeo.rotateY(Math.PI);

    const leftHalfGeo = track(createHalfDiscGeometry(R, T, 'left'));
    const rightHalfGeo = track(createHalfDiscGeometry(R, T, 'right'));
    const halfArcGeo = track(new THREE.TorusGeometry(R + 0.004, 0.014, 12, 40, Math.PI));
    const seamLineGeo = track(new THREE.CylinderGeometry(0.01, 0.01, R * 1.94, 12));
    const leftFaceGeo = track(new THREE.CircleGeometry(R - 0.04, 40, Math.PI / 2, Math.PI));
    const rightFaceGeo = track(new THREE.CircleGeometry(R - 0.04, 40, -Math.PI / 2, Math.PI));

    // Textures
    const texP = track(createMedallionFaceTexture('P', 'Parent', 'cream', maxAnisotropy));
    const texPActive = track(createMedallionFaceTexture('P', 'Parent', 'charcoal', maxAnisotropy));
    const texA = track(createMedallionFaceTexture('A', 'Adult', 'cream', maxAnisotropy));
    const texAActive = track(createMedallionFaceTexture('A', 'Adult', 'forest', maxAnisotropy));
    const texC = track(createMedallionFaceTexture('C', 'Child', 'cream', maxAnisotropy));
    const texCActive = track(createMedallionFaceTexture('C', 'Child', 'charcoal', maxAnisotropy));

    const texCP = track(createHalfMedallionFaceTexture('CP', 'Critical', 'left', 'cream', maxAnisotropy));
    const texCPActive = track(createHalfMedallionFaceTexture('CP', 'Critical', 'left', 'charcoal', maxAnisotropy));
    const texNP = track(createHalfMedallionFaceTexture('NP', 'Nurturing', 'right', 'cream', maxAnisotropy));
    const texNPActive = track(createHalfMedallionFaceTexture('NP', 'Nurturing', 'right', 'forest', maxAnisotropy));
    const texAC = track(createHalfMedallionFaceTexture('AC', 'Adapted', 'left', 'cream', maxAnisotropy));
    const texACActive = track(createHalfMedallionFaceTexture('AC', 'Adapted', 'left', 'charcoal', maxAnisotropy));
    const texFC = track(createHalfMedallionFaceTexture('FC', 'Free', 'right', 'cream', maxAnisotropy));
    const texFCActive = track(createHalfMedallionFaceTexture('FC', 'Free', 'right', 'forest', maxAnisotropy));

    const createFullPart = (
      key: 'P' | 'A' | 'C',
      yPos: number,
      baseTex: THREE.CanvasTexture,
      activeTex: THREE.CanvasTexture,
      useForestOnActive: boolean
    ): PartRuntime => {
      const group = new THREE.Group();
      group.userData.partKey = key;

      const porcelainMesh = new THREE.Mesh(fullDiscGeo, palette.porcelainMatte);
      porcelainMesh.castShadow = !rig.isSoftwareWebGL;
      porcelainMesh.receiveShadow = true;
      porcelainMesh.userData.partKey = key;
      group.add(porcelainMesh);

      const inkRimMesh = new THREE.Mesh(fullRimGeo, palette.charcoalInk);
      inkRimMesh.userData.partKey = key;
      group.add(inkRimMesh);

      const frontFaceMat = track(
        new THREE.MeshStandardMaterial({
          map: baseTex,
          roughness: 0.72,
          metalness: 0.02,
          envMapIntensity: 0.45,
        })
      );
      const frontFace = new THREE.Mesh(fullFaceGeo, frontFaceMat);
      frontFace.position.z = T / 2 + 0.003;
      frontFace.userData.partKey = key;
      group.add(frontFace);

      const backFace = new THREE.Mesh(fullBackGeo, palette.porcelainMatte);
      backFace.position.z = -T / 2 - 0.002;
      group.add(backFace);

      const shadowMat = track(
        new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          opacity: 0.42,
          depthWrite: false,
        })
      );
      const shadowMesh = new THREE.Mesh(fullShadowGeo, shadowMat);
      shadowMesh.position.set(0.02, yPos - 0.07, -0.16);
      sculptureRoot.add(shadowMesh);
      sculptureRoot.add(group);

      return {
        key,
        group,
        porcelainMesh,
        inkRimMesh,
        frontFaceMat,
        shadowMesh,
        baseTex,
        activeTex,
        baseX: 0,
        baseY: yPos,
        targetX: 0,
        targetY: yPos,
        targetZ: 0,
        targetScale: 1,
        curX: 0,
        curY: yPos,
        curZ: 0,
        curScale: 1,
        isVisibleTarget: true,
        useForestOnActive,
      };
    };

    const createHalfPart = (
      key: 'CP' | 'NP' | 'AC' | 'FC',
      side: 'left' | 'right',
      yPos: number,
      baseTex: THREE.CanvasTexture,
      activeTex: THREE.CanvasTexture,
      useForestOnActive: boolean
    ): PartRuntime => {
      const group = new THREE.Group();
      group.userData.partKey = key;

      const porcelainMesh = new THREE.Mesh(
        side === 'left' ? leftHalfGeo : rightHalfGeo,
        palette.porcelainMatte
      );
      porcelainMesh.castShadow = !rig.isSoftwareWebGL;
      porcelainMesh.receiveShadow = true;
      porcelainMesh.userData.partKey = key;
      group.add(porcelainMesh);

      const inkRimMesh = new THREE.Mesh(halfArcGeo, palette.charcoalInk);
      inkRimMesh.rotation.z = side === 'right' ? -Math.PI / 2 : Math.PI / 2;
      inkRimMesh.userData.partKey = key;
      group.add(inkRimMesh);

      const seamMesh = new THREE.Mesh(seamLineGeo, palette.charcoalInk);
      seamMesh.position.set(side === 'left' ? -0.002 : 0.002, 0, T / 2 + 0.002);
      seamMesh.userData.partKey = key;
      group.add(seamMesh);

      const frontFaceMat = track(
        new THREE.MeshStandardMaterial({
          map: baseTex,
          roughness: 0.72,
          metalness: 0.02,
          envMapIntensity: 0.45,
        })
      );
      const frontFace = new THREE.Mesh(
        side === 'left' ? leftFaceGeo : rightFaceGeo,
        frontFaceMat
      );
      frontFace.position.z = T / 2 + 0.004;
      frontFace.userData.partKey = key;
      group.add(frontFace);

      const shadowMat = track(
        new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          opacity: 0.36,
          depthWrite: false,
        })
      );
      const shadowMesh = new THREE.Mesh(halfShadowGeo, shadowMat);
      shadowMesh.position.set(side === 'left' ? -0.22 : 0.22, yPos - 0.07, -0.16);
      sculptureRoot.add(shadowMesh);
      sculptureRoot.add(group);

      const splitX = side === 'left' ? -0.032 : 0.032;

      return {
        key,
        group,
        porcelainMesh,
        inkRimMesh,
        seamMesh,
        frontFaceMat,
        shadowMesh,
        baseTex,
        activeTex,
        baseX: splitX,
        baseY: yPos,
        targetX: splitX,
        targetY: yPos,
        targetZ: 0,
        targetScale: 1,
        curX: splitX,
        curY: yPos,
        curZ: 0,
        curScale: 1,
        isVisibleTarget: false,
        useForestOnActive,
      };
    };

    const parts: Record<InteractivePartKey, PartRuntime> = {
      P: createFullPart('P', 1.44, texP, texPActive, false),
      A: createFullPart('A', 0, texA, texAActive, true),
      C: createFullPart('C', -1.44, texC, texCActive, false),
      CP: createHalfPart('CP', 'left', 1.44, texCP, texCPActive, false),
      NP: createHalfPart('NP', 'right', 1.44, texNP, texNPActive, true),
      AC: createHalfPart('AC', 'left', -1.44, texAC, texACActive, false),
      FC: createHalfPart('FC', 'right', -1.44, texFC, texFCActive, true),
    };

    const partList = Object.values(parts);
    const raycastTargets = partList.map((p) => p.group);

    let targetTiltX = 0;
    let targetTiltY = 0;
    let curTiltX = 0;
    let curTiltY = 0;

    const applyTargets = () => {
      const { activeTab: tab, activeNode: node, hoveredKey } = stateRef.current;
      const isFunc = tab === 'functional';

      parts.P.isVisibleTarget = !isFunc;
      parts.C.isVisibleTarget = !isFunc;
      parts.A.isVisibleTarget = true;

      parts.CP.isVisibleTarget = isFunc;
      parts.NP.isVisibleTarget = isFunc;
      parts.AC.isVisibleTarget = isFunc;
      parts.FC.isVisibleTarget = isFunc;

      partList.forEach((p) => {
        const isActive = p.isVisibleTarget && node === p.key;
        const isHovered = p.isVisibleTarget && hoveredKey === p.key;

        // Functional halves start flush and separate subtly into one crisp split circle
        const splitExtra =
          p.key === 'CP' || p.key === 'AC'
            ? isActive
              ? -0.048
              : -0.026
            : p.key === 'NP' || p.key === 'FC'
              ? isActive
                ? 0.048
                : 0.026
              : 0;

        p.targetX = p.baseX === 0 ? 0 : splitExtra;
        p.targetY = p.baseY;
        p.targetZ = !p.isVisibleTarget
          ? -0.05
          : isActive
            ? 0.3
            : isHovered
              ? 0.09
              : 0;
        p.targetScale = !p.isVisibleTarget
          ? 0.001
          : isActive
            ? 1.05
            : isHovered
              ? 1.02
              : 1.0;

        p.porcelainMesh.material = isActive
          ? p.useForestOnActive
            ? palette.porcelainForest
            : palette.porcelainActive
          : palette.porcelainMatte;

        const rimMat =
          isActive && p.useForestOnActive ? palette.forestInk : palette.charcoalInk;
        p.inkRimMesh.material = rimMat;
        if (p.seamMesh) p.seamMesh.material = rimMat;

        p.frontFaceMat.map = isActive ? p.activeTex : p.baseTex;
        p.frontFaceMat.needsUpdate = true;
      });

      rig.requestRender();
    };

    applyTargetsRef.current = applyTargets;
    applyTargets();

    // Clean initial settle
    partList.forEach((p) => {
      p.curX = p.targetX;
      p.curY = p.targetY;
      p.curZ = p.targetZ;
      p.curScale = p.targetScale;
      p.group.position.set(p.curX, p.curY, p.curZ);
      p.group.scale.setScalar(Math.max(0.001, p.curScale));
      p.group.visible = p.isVisibleTarget;
      p.shadowMesh.visible = p.isVisibleTarget;
    });

    const reduced = prefersReducedMotion();

    rig.setUpdateCallback((dt) => {
      let moving = false;
      const dampLambda = reduced ? 60 : 9.0;
      const tiltLambda = reduced ? 60 : 6.5;

      const ntx = reduced ? 0 : THREE.MathUtils.damp(curTiltX, targetTiltX, tiltLambda, dt);
      const nty = reduced ? 0 : THREE.MathUtils.damp(curTiltY, targetTiltY, tiltLambda, dt);
      if (Math.abs(ntx - targetTiltX) > 0.0005 || Math.abs(nty - targetTiltY) > 0.0005) {
        moving = true;
      }
      curTiltX = Math.abs(ntx - targetTiltX) <= 0.0005 ? targetTiltX : ntx;
      curTiltY = Math.abs(nty - targetTiltY) <= 0.0005 ? targetTiltY : nty;
      sculptureRoot.rotation.x = curTiltX;
      sculptureRoot.rotation.y = curTiltY;

      for (let i = 0; i < partList.length; i++) {
        const p = partList[i];
        const nx = reduced ? p.targetX : THREE.MathUtils.damp(p.curX, p.targetX, dampLambda, dt);
        const ny = reduced ? p.targetY : THREE.MathUtils.damp(p.curY, p.targetY, dampLambda, dt);
        const nz = reduced ? p.targetZ : THREE.MathUtils.damp(p.curZ, p.targetZ, dampLambda, dt);
        const ns = reduced
          ? p.targetScale
          : THREE.MathUtils.damp(p.curScale, p.targetScale, dampLambda, dt);

        if (
          Math.abs(nx - p.targetX) > 0.001 ||
          Math.abs(ny - p.targetY) > 0.001 ||
          Math.abs(nz - p.targetZ) > 0.001 ||
          Math.abs(ns - p.targetScale) > 0.001
        ) {
          moving = true;
        }

        p.curX = Math.abs(nx - p.targetX) <= 0.001 ? p.targetX : nx;
        p.curY = Math.abs(ny - p.targetY) <= 0.001 ? p.targetY : ny;
        p.curZ = Math.abs(nz - p.targetZ) <= 0.001 ? p.targetZ : nz;
        p.curScale = Math.abs(ns - p.targetScale) <= 0.001 ? p.targetScale : ns;

        p.group.position.set(p.curX, p.curY, p.curZ);
        p.group.scale.setScalar(Math.max(0.001, p.curScale));
        p.group.visible = p.curScale > 0.04;

        const shadowOffset = p.key === 'CP' || p.key === 'AC' ? -0.22 : p.key === 'NP' || p.key === 'FC' ? 0.22 : 0.02;
        p.shadowMesh.position.set(p.curX + shadowOffset, p.curY - 0.07, -0.16);
        p.shadowMesh.scale.setScalar(Math.max(0.001, p.curScale) * (1 + p.curZ * 0.22));
        p.shadowMesh.visible = p.group.visible;
      }

      return moving;
    });

    // Raycasting + Desktop Mouse Parallax + Mobile Touch Drag-to-Tilt
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let isDragging = false;
    let downX = 0;
    let downY = 0;
    let totalMoveDist = 0;

    const pickPartKey = (clientX: number, clientY: number): InteractivePartKey | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(raycastTargets, true);
      for (let i = 0; i < hits.length; i++) {
        let obj: THREE.Object3D | null = hits[i].object;
        while (obj) {
          if (obj.userData?.partKey && obj.visible) {
            return obj.userData.partKey as InteractivePartKey;
          }
          obj = obj.parent;
        }
      }
      return null;
    };

    const selectKey = (key: InteractivePartKey) => {
      playSoftThump('bright');
      if (stateRef.current.activeTab === 'core') {
        if (key === 'P' || key === 'A' || key === 'C') {
          callbacksRef.current.onSelectCoreNode(key);
        }
      } else {
        if (key === 'CP' || key === 'NP' || key === 'A' || key === 'AC' || key === 'FC') {
          callbacksRef.current.onSelectFunctionalNode(key);
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      downX = e.clientX;
      downY = e.clientY;
      totalMoveDist = 0;
      try {
        renderer.domElement.setPointerCapture(e.pointerId);
      } catch {
        // ignore if unsupported
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging && !reduced) {
        const dx = e.clientX - downX;
        const dy = e.clientY - downY;
        totalMoveDist = Math.max(totalMoveDist, Math.hypot(dx, dy));
        // Direct tactile drag-to-tilt for touch & mouse (±15 deg)
        targetTiltY = THREE.MathUtils.clamp((dx / 110) * 0.26, -0.26, 0.26);
        targetTiltX = THREE.MathUtils.clamp((dy / 110) * 0.22, -0.22, 0.22);
        rig.requestRender();
        return;
      }

      const hitKey = pickPartKey(e.clientX, e.clientY);
      renderer.domElement.style.cursor = hitKey ? 'pointer' : 'default';
      if (stateRef.current.hoveredKey !== hitKey) {
        stateRef.current.hoveredKey = hitKey;
        applyTargets();
      }

      if (e.pointerType === 'mouse' && !reduced) {
        const rect = renderer.domElement.getBoundingClientRect();
        if (rect.width && rect.height) {
          const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
          targetTiltY = THREE.MathUtils.clamp(nx * 0.085, -0.09, 0.09);
          targetTiltX = THREE.MathUtils.clamp(ny * 0.065, -0.07, 0.07);
          rig.requestRender();
        }
      }
    };

    const endDragAndTap = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      targetTiltX = 0;
      targetTiltY = 0;
      rig.requestRender();
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      if (totalMoveDist <= 10) {
        const hitKey = pickPartKey(e.clientX, e.clientY);
        if (hitKey) selectKey(hitKey);
      }
    };

    const onPointerCancel = () => {
      isDragging = false;
      targetTiltX = 0;
      targetTiltY = 0;
      rig.requestRender();
    };

    const onPointerLeave = () => {
      if (isDragging) return;
      renderer.domElement.style.cursor = 'default';
      targetTiltX = 0;
      targetTiltY = 0;
      if (stateRef.current.hoveredKey !== null) {
        stateRef.current.hoveredKey = null;
        applyTargets();
      } else {
        rig.requestRender();
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', endDragAndTap);
    renderer.domElement.addEventListener('pointercancel', onPointerCancel);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);

    return () => {
      applyTargetsRef.current = null;
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', endDragAndTap);
      renderer.domElement.removeEventListener('pointercancel', onPointerCancel);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      disposables.forEach((d) => d.dispose());
      palette.dispose();
      rig.dispose();
      rigRef.current = null;
    };
  }, []);

  if (webglUnavailable) {
    return (
      <div className="w-full h-[230px] sm:h-[265px] lg:h-[340px] flex flex-col items-center justify-center bg-[#FAF9F5] select-none px-4">
        <div className="flex flex-col items-center gap-3">
          {activeTab === 'core' ? (
            <>
              {(['P', 'A', 'C'] as CoreNodeId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectCoreNode(id)}
                  className={`w-14 h-14 rounded-full border font-serif text-lg cursor-pointer transition-colors ${
                    activeNode === id
                      ? id === 'A'
                        ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#2D5A43]'
                        : 'bg-[#18181B] text-[#FAF9F5] border-[#18181B]'
                      : 'bg-[#FAF9F5] text-[#18181B] border-[#18181B]'
                  }`}
                >
                  {id}
                </button>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="inline-flex rounded-full border border-[#18181B] overflow-hidden">
                {(['CP', 'NP'] as FunctionalNodeId[]).map((id, i) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSelectFunctionalNode(id)}
                    className={`w-10 h-14 font-serif text-xs cursor-pointer ${
                      i === 0 ? 'border-r border-[#18181B]' : ''
                    } ${
                      activeNode === id
                        ? id === 'NP'
                          ? 'bg-[#2D5A43] text-[#FAF9F5]'
                          : 'bg-[#18181B] text-[#FAF9F5]'
                        : 'bg-[#FAF9F5] text-[#18181B]'
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onSelectFunctionalNode('A')}
                className={`w-14 h-14 rounded-full border font-serif text-lg cursor-pointer ${
                  activeNode === 'A'
                    ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#2D5A43]'
                    : 'bg-[#FAF9F5] text-[#18181B] border-[#18181B]'
                }`}
              >
                A
              </button>
              <div className="inline-flex rounded-full border border-[#18181B] overflow-hidden">
                {(['AC', 'FC'] as FunctionalNodeId[]).map((id, i) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSelectFunctionalNode(id)}
                    className={`w-10 h-14 font-serif text-xs cursor-pointer ${
                      i === 0 ? 'border-r border-[#18181B]' : ''
                    } ${
                      activeNode === id
                        ? id === 'FC'
                          ? 'bg-[#2D5A43] text-[#FAF9F5]'
                          : 'bg-[#18181B] text-[#FAF9F5]'
                        : 'bg-[#FAF9F5] text-[#18181B]'
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
    <div className="relative w-full h-[230px] sm:h-[265px] lg:h-[340px] select-none">
      <div
        ref={mountRef}
        className="w-full h-full"
        aria-label="Interactive charcoal ink PAC circles. Drag to tilt or tap any circle or split half."
      />
      <p className="pointer-events-none absolute bottom-1 inset-x-0 text-center text-[9.5px] font-mono uppercase tracking-[0.16em] text-stone-400">
        Drag to tilt · Tap any {activeTab === 'functional' ? 'half' : 'circle'}
      </p>
    </div>
  );
};
