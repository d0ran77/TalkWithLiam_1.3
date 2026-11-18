import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  TriangleMode,
  DramaRoleId,
  WinnerRoleId,
} from '../../data/dramaTriangle.ts';
import {
  createStudioRig,
  createCharcoalPaperPalette,
  createMedallionFaceTexture,
  createPaperShadowTexture,
  prefersReducedMotion,
  StudioRig,
} from '../../three/studioEngine.ts';
import { playSoftThump } from '../../utils/sound.ts';

type RoleId = DramaRoleId | WinnerRoleId;

interface TriangleSculptureCanvasProps {
  mode: TriangleMode;
  activeRole: RoleId;
  onSelectRole: (roleId: RoleId) => void;
}

interface StationSlotRuntime {
  slotIndex: 0 | 1 | 2;
  dramaId: DramaRoleId;
  winnerId: WinnerRoleId;
  group: THREE.Group;
  porcelainMesh: THREE.Mesh;
  inkRimMesh: THREE.Mesh;
  frontFaceMat: THREE.MeshStandardMaterial;
  shadowMesh: THREE.Mesh;
  dramaTex: THREE.CanvasTexture;
  dramaActiveTex: THREE.CanvasTexture;
  winnerTex: THREE.CanvasTexture;
  winnerActiveTex: THREE.CanvasTexture;
  targetZ: number;
  targetScale: number;
  curZ: number;
  curScale: number;
}

function createSlimStationDisc(radius: number, thickness: number): THREE.LatheGeometry {
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

/**
 * Builds an inset charcoal-ink connecting segment floating strictly in the open space
 * BETWEEN two vertex discs, leaving generous breathing space so lines never touch a circle rim.
 */
function createInsetTriangleLine(
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  circleRadius: number,
  gapClearance: number,
  lineRadius: number
): THREE.CylinderGeometry {
  const totalDist = p1.distanceTo(p2);
  const trim = circleRadius + gapClearance;
  const lineLen = Math.max(0.2, totalDist - trim * 2);
  const geo = new THREE.CylinderGeometry(lineRadius, lineRadius, lineLen, 12);
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  geo.applyQuaternion(quat);
  geo.translate(mid.x, mid.y, mid.z);
  return geo;
}

export const TriangleSculptureCanvas: React.FC<TriangleSculptureCanvasProps> = ({
  mode,
  activeRole,
  onSelectRole,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<StudioRig | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const stateRef = useRef<{
    mode: TriangleMode;
    activeRole: RoleId;
    hoveredSlot: number | null;
  }>({
    mode,
    activeRole,
    hoveredSlot: null,
  });

  const onSelectRef = useRef(onSelectRole);
  onSelectRef.current = onSelectRole;

  const applyTargetsRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    stateRef.current.mode = mode;
    stateRef.current.activeRole = activeRole;
    applyTargetsRef.current?.();
  }, [mode, activeRole]);

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

    const parallaxRoot = new THREE.Group();
    scene.add(parallaxRoot);

    const chassis = new THREE.Group();
    parallaxRoot.add(chassis);

    // Equilateral triangle vertices with generous spacing so inset lines leave crisp gaps
    const triRadius = 1.62;
    const circleR = 0.54;
    const v0 = new THREE.Vector3(Math.cos((150 * Math.PI) / 180) * triRadius, Math.sin((150 * Math.PI) / 180) * triRadius, 0);
    const v1 = new THREE.Vector3(Math.cos((30 * Math.PI) / 180) * triRadius, Math.sin((30 * Math.PI) / 180) * triRadius, 0);
    const v2 = new THREE.Vector3(0, -triRadius, 0);

    // Crisp charcoal-ink edges strictly inset BETWEEN circles (never touching any circle rim)
    const edge01Geo = track(createInsetTriangleLine(v0, v1, circleR, 0.24, 0.012));
    const edge12Geo = track(createInsetTriangleLine(v1, v2, circleR, 0.24, 0.012));
    const edge20Geo = track(createInsetTriangleLine(v2, v0, circleR, 0.24, 0.012));

    const edge01 = new THREE.Mesh(edge01Geo, palette.charcoalInk);
    const edge12 = new THREE.Mesh(edge12Geo, palette.charcoalInk);
    const edge20 = new THREE.Mesh(edge20Geo, palette.charcoalInk);
    chassis.add(edge01, edge12, edge20);

    const shadowTex = track(createPaperShadowTexture());
    const shadowPlaneGeo = track(new THREE.PlaneGeometry(1.44, 1.44));

    const T = 0.14;
    const puckGeo = track(createSlimStationDisc(circleR, T));
    const rimGeo = track(new THREE.TorusGeometry(circleR + 0.004, 0.014, 12, 56));
    const faceGeo = track(new THREE.CircleGeometry(circleR - 0.04, 56));
    const backCapGeo = track(new THREE.CircleGeometry(circleR - 0.06, 40));
    backCapGeo.rotateY(Math.PI);

    const slotSpecs: {
      slotIndex: 0 | 1 | 2;
      dramaId: DramaRoleId;
      winnerId: WinnerRoleId;
      pos: THREE.Vector3;
      dramaTitle: string;
      dramaSub: string;
      winnerTitle: string;
      winnerSub: string;
    }[] = [
      {
        slotIndex: 0,
        dramaId: 'persecutor',
        winnerId: 'assertive',
        pos: v0,
        dramaTitle: 'Persecutor',
        dramaSub: 'Blaming',
        winnerTitle: 'Assertive',
        winnerSub: 'Boundaries',
      },
      {
        slotIndex: 1,
        dramaId: 'rescuer',
        winnerId: 'caring',
        pos: v1,
        dramaTitle: 'Rescuer',
        dramaSub: 'Fixing',
        winnerTitle: 'Caring',
        winnerSub: 'Support',
      },
      {
        slotIndex: 2,
        dramaId: 'victim',
        winnerId: 'vulnerable',
        pos: v2,
        dramaTitle: 'Victim',
        dramaSub: 'Trapped',
        winnerTitle: 'Vulnerable',
        winnerSub: 'Honest',
      },
    ];

    const stations: StationSlotRuntime[] = slotSpecs.map((spec) => {
      const dramaTex = track(
        createMedallionFaceTexture(spec.dramaTitle, spec.dramaSub, 'cream', maxAnisotropy)
      );
      const dramaActiveTex = track(
        createMedallionFaceTexture(spec.dramaTitle, spec.dramaSub, 'charcoal', maxAnisotropy)
      );
      const winnerTex = track(
        createMedallionFaceTexture(spec.winnerTitle, spec.winnerSub, 'cream', maxAnisotropy)
      );
      const winnerActiveTex = track(
        createMedallionFaceTexture(spec.winnerTitle, spec.winnerSub, 'forest', maxAnisotropy)
      );

      const group = new THREE.Group();
      group.position.set(spec.pos.x, spec.pos.y, 0);
      group.userData.slotIndex = spec.slotIndex;

      const porcelainMesh = new THREE.Mesh(puckGeo, palette.porcelainMatte);
      porcelainMesh.castShadow = !rig.isSoftwareWebGL;
      porcelainMesh.receiveShadow = true;
      porcelainMesh.userData.slotIndex = spec.slotIndex;
      group.add(porcelainMesh);

      const inkRimMesh = new THREE.Mesh(rimGeo, palette.charcoalInk);
      inkRimMesh.userData.slotIndex = spec.slotIndex;
      group.add(inkRimMesh);

      const frontFaceMat = track(
        new THREE.MeshStandardMaterial({
          map: dramaTex,
          roughness: 0.72,
          metalness: 0.02,
          envMapIntensity: 0.45,
        })
      );
      const frontFace = new THREE.Mesh(faceGeo, frontFaceMat);
      frontFace.position.z = T / 2 + 0.003;
      frontFace.userData.slotIndex = spec.slotIndex;
      group.add(frontFace);

      const backCap = new THREE.Mesh(backCapGeo, palette.porcelainMatte);
      backCap.position.z = -T / 2 - 0.002;
      group.add(backCap);

      const shadowMat = track(
        new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
        })
      );
      const shadowMesh = new THREE.Mesh(shadowPlaneGeo, shadowMat);
      shadowMesh.position.set(spec.pos.x + 0.02, spec.pos.y - 0.07, -0.16);
      chassis.add(shadowMesh);

      chassis.add(group);

      return {
        slotIndex: spec.slotIndex,
        dramaId: spec.dramaId,
        winnerId: spec.winnerId,
        group,
        porcelainMesh,
        inkRimMesh,
        frontFaceMat,
        shadowMesh,
        dramaTex,
        dramaActiveTex,
        winnerTex,
        winnerActiveTex,
        targetZ: 0,
        targetScale: 1,
        curZ: 0,
        curScale: 1,
      };
    });

    const raycastTargets = stations.map((s) => s.group);

    let targetRotZ = 0;
    let curRotZ = 0;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let curTiltX = 0;
    let curTiltY = 0;

    const applyTargets = () => {
      const { mode: m, activeRole: role, hoveredSlot } = stateRef.current;
      const isWinner = m === 'winner';

      targetRotZ = isWinner ? Math.PI : 0;

      const edgeMat = isWinner ? palette.forestInk : palette.charcoalInk;
      edge01.material = edgeMat;
      edge12.material = edgeMat;
      edge20.material = edgeMat;

      stations.forEach((s) => {
        const expectedRole = isWinner ? s.winnerId : s.dramaId;
        const isActive = role === expectedRole;
        const isHovered = hoveredSlot === s.slotIndex;

        s.targetZ = isActive ? 0.3 : isHovered ? 0.09 : 0;
        s.targetScale = isActive ? 1.05 : isHovered ? 1.02 : 1.0;

        s.porcelainMesh.material = isActive
          ? isWinner
            ? palette.porcelainForest
            : palette.porcelainActive
          : palette.porcelainMatte;

        s.inkRimMesh.material = isWinner ? palette.forestInk : palette.charcoalInk;

        s.frontFaceMat.map = isWinner
          ? isActive
            ? s.winnerActiveTex
            : s.winnerTex
          : isActive
            ? s.dramaActiveTex
            : s.dramaTex;
        s.frontFaceMat.needsUpdate = true;
      });

      rig.requestRender();
    };

    applyTargetsRef.current = applyTargets;
    applyTargets();

    // Clean initial settle
    curRotZ = targetRotZ;
    chassis.rotation.z = curRotZ;
    stations.forEach((s) => {
      s.curZ = s.targetZ;
      s.curScale = s.targetScale;
      s.group.position.z = s.curZ;
      s.group.scale.setScalar(s.curScale);
      s.group.rotation.z = -curRotZ;
      s.shadowMesh.scale.setScalar(s.curScale * (1 + s.curZ * 0.22));
    });

    const reduced = prefersReducedMotion();

    rig.setUpdateCallback((dt) => {
      let moving = false;
      const rotLambda = reduced ? 60 : 6.4;
      const posLambda = reduced ? 60 : 9.0;
      const tiltLambda = reduced ? 60 : 6.5;

      const ntx = reduced ? 0 : THREE.MathUtils.damp(curTiltX, targetTiltX, tiltLambda, dt);
      const nty = reduced ? 0 : THREE.MathUtils.damp(curTiltY, targetTiltY, tiltLambda, dt);
      if (Math.abs(ntx - targetTiltX) > 0.0005 || Math.abs(nty - targetTiltY) > 0.0005) {
        moving = true;
      }
      curTiltX = Math.abs(ntx - targetTiltX) <= 0.0005 ? targetTiltX : ntx;
      curTiltY = Math.abs(nty - targetTiltY) <= 0.0005 ? targetTiltY : nty;
      parallaxRoot.rotation.x = curTiltX;
      parallaxRoot.rotation.y = curTiltY;

      const nextRot = reduced
        ? targetRotZ
        : THREE.MathUtils.damp(curRotZ, targetRotZ, rotLambda, dt);
      if (Math.abs(nextRot - targetRotZ) > 0.001) moving = true;
      curRotZ = Math.abs(nextRot - targetRotZ) <= 0.001 ? targetRotZ : nextRot;

      chassis.rotation.z = curRotZ;
      const normProgress = curRotZ / Math.PI;
      chassis.rotation.y = reduced ? 0 : Math.sin(normProgress * Math.PI) * 0.16;

      for (let i = 0; i < stations.length; i++) {
        const s = stations[i];
        s.group.rotation.z = -curRotZ;

        const nz = reduced ? s.targetZ : THREE.MathUtils.damp(s.curZ, s.targetZ, posLambda, dt);
        const ns = reduced
          ? s.targetScale
          : THREE.MathUtils.damp(s.curScale, s.targetScale, posLambda, dt);

        if (Math.abs(nz - s.targetZ) > 0.001 || Math.abs(ns - s.targetScale) > 0.001) {
          moving = true;
        }
        s.curZ = Math.abs(nz - s.targetZ) <= 0.001 ? s.targetZ : nz;
        s.curScale = Math.abs(ns - s.targetScale) <= 0.001 ? s.targetScale : ns;

        s.group.position.z = s.curZ;
        s.group.scale.setScalar(s.curScale);
        s.shadowMesh.scale.setScalar(s.curScale * (1 + s.curZ * 0.22));
      }

      return moving;
    });

    // Raycasting + Mouse Parallax + Mobile Touch Drag-to-Tilt
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let isDragging = false;
    let downX = 0;
    let downY = 0;
    let totalMoveDist = 0;

    const pickSlotIndex = (clientX: number, clientY: number): number | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(raycastTargets, true);
      for (let i = 0; i < hits.length; i++) {
        let obj: THREE.Object3D | null = hits[i].object;
        while (obj) {
          if (typeof obj.userData?.slotIndex === 'number') {
            return obj.userData.slotIndex as number;
          }
          obj = obj.parent;
        }
      }
      return null;
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      downX = e.clientX;
      downY = e.clientY;
      totalMoveDist = 0;
      try {
        renderer.domElement.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging && !reduced) {
        const dx = e.clientX - downX;
        const dy = e.clientY - downY;
        totalMoveDist = Math.max(totalMoveDist, Math.hypot(dx, dy));
        targetTiltY = THREE.MathUtils.clamp((dx / 110) * 0.26, -0.26, 0.26);
        targetTiltX = THREE.MathUtils.clamp((dy / 110) * 0.22, -0.22, 0.22);
        rig.requestRender();
        return;
      }

      const hitSlot = pickSlotIndex(e.clientX, e.clientY);
      renderer.domElement.style.cursor = hitSlot !== null ? 'pointer' : 'default';
      if (stateRef.current.hoveredSlot !== hitSlot) {
        stateRef.current.hoveredSlot = hitSlot;
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
        const hitSlot = pickSlotIndex(e.clientX, e.clientY);
        if (hitSlot !== null) {
          const station = stations[hitSlot];
          if (station) {
            playSoftThump('bright');
            onSelectRef.current(
              stateRef.current.mode === 'winner' ? station.winnerId : station.dramaId
            );
          }
        }
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
      if (stateRef.current.hoveredSlot !== null) {
        stateRef.current.hoveredSlot = null;
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
    const fallbackRoles: { id: RoleId; label: string }[] =
      mode === 'drama'
        ? [
            { id: 'persecutor', label: 'Persecutor' },
            { id: 'rescuer', label: 'Rescuer' },
            { id: 'victim', label: 'Victim' },
          ]
        : [
            { id: 'vulnerable', label: 'Vulnerable' },
            { id: 'caring', label: 'Caring' },
            { id: 'assertive', label: 'Assertive' },
          ];

    return (
      <div className="w-full h-[230px] sm:h-[265px] lg:h-[340px] flex items-center justify-center bg-[#FAF9F5] select-none px-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {fallbackRoles.map((r) => {
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRole(r.id)}
                className={`px-4 py-2 rounded-full border font-serif text-sm cursor-pointer transition-colors ${
                  isActive
                    ? mode === 'winner'
                      ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#2D5A43]'
                      : 'bg-[#18181B] text-[#FAF9F5] border-[#18181B]'
                    : 'bg-[#FAF9F5] text-[#18181B] border-[#18181B]'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[230px] sm:h-[265px] lg:h-[340px] select-none">
      <div
        ref={mountRef}
        className="w-full h-full"
        aria-label="Interactive charcoal ink Drama and Winner's Triangle. Drag to tilt or tap any station."
      />
      <p className="pointer-events-none absolute bottom-1 inset-x-0 text-center text-[9.5px] font-mono uppercase tracking-[0.16em] text-stone-400">
        Drag to tilt · Tap any station
      </p>
    </div>
  );
};
