import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCcw } from 'lucide-react';
import {
  TriangleMode,
  DramaRoleId,
  WinnerRoleId,
} from '../../data/dramaTriangle.ts';
import {
  createStudioRig,
  createCeramicAndBrassPalette,
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
  ceramicMesh: THREE.Mesh;
  brassRimMesh: THREE.Mesh;
  frontFaceMat: THREE.MeshStandardMaterial;
  dramaTex: THREE.CanvasTexture;
  dramaActiveTex: THREE.CanvasTexture;
  winnerTex: THREE.CanvasTexture;
  winnerActiveTex: THREE.CanvasTexture;
  baseX: number;
  baseY: number;
  targetZ: number;
  targetScale: number;
  curZ: number;
  curScale: number;
}

function createBeveledStationPuck(radius: number, thickness: number): THREE.LatheGeometry {
  const halfT = thickness / 2;
  const bevel = Math.min(0.068, radius * 0.14);
  const pts: THREE.Vector2[] = [
    new THREE.Vector2(0.001, -halfT),
    new THREE.Vector2(radius - bevel, -halfT),
    new THREE.Vector2(radius, -halfT + bevel),
    new THREE.Vector2(radius, halfT - bevel),
    new THREE.Vector2(radius - bevel, halfT),
    new THREE.Vector2(0.001, halfT),
  ];
  const geo = new THREE.LatheGeometry(pts, 48);
  geo.rotateX(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function createConnectingRod(
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  radius: number
): THREE.CylinderGeometry {
  const dist = p1.distanceTo(p2);
  const geo = new THREE.CylinderGeometry(radius, radius, dist, 20);
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
  const [hasOrbited, setHasOrbited] = useState(false);

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

  const handleResetView = useCallback(() => {
    const rig = rigRef.current;
    if (!rig) return;
    playSoftThump('default');
    rig.camera.position.set(0, 0.28, 7.2);
    rig.controls.target.set(0, 0, 0);
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
        cameraPosition: [0, 0.28, 7.2],
        controlsTarget: [0, 0, 0],
        minDistance: 5.0,
        maxDistance: 10.5,
        minPolarAngle: Math.PI * 0.24,
        maxPolarAngle: Math.PI * 0.72,
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

    // Subtle radial paper contact shadow
    const shadowTex = track(createPaperShadowTexture());
    const shadowGeo = track(new THREE.PlaneGeometry(5.2, 2.5));
    const shadowMat = track(
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      })
    );
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -1.96, 0);
    scene.add(shadowPlane);

    // Kinetic rotating chassis (flips cleanly 180 deg between Drama point-down and Winner upright)
    const chassis = new THREE.Group();
    scene.add(chassis);

    // Equilateral vertex positions (in Drama point-down local coords)
    const R = 1.56;
    const v0 = new THREE.Vector3(Math.cos((150 * Math.PI) / 180) * R, Math.sin((150 * Math.PI) / 180) * R, -0.06);
    const v1 = new THREE.Vector3(Math.cos((30 * Math.PI) / 180) * R, Math.sin((30 * Math.PI) / 180) * R, -0.06);
    const v2 = new THREE.Vector3(0, -R, -0.06);

    // Three brushed-brass connecting rods
    const rod01Geo = track(createConnectingRod(v0, v1, 0.038));
    const rod12Geo = track(createConnectingRod(v1, v2, 0.038));
    const rod20Geo = track(createConnectingRod(v2, v0, 0.038));

    const rod01 = new THREE.Mesh(rod01Geo, palette.darkBronze);
    const rod12 = new THREE.Mesh(rod12Geo, palette.darkBronze);
    const rod20 = new THREE.Mesh(rod20Geo, palette.darkBronze);
    rod01.castShadow = !rig.isSoftwareWebGL;
    rod12.castShadow = !rig.isSoftwareWebGL;
    rod20.castShadow = !rig.isSoftwareWebGL;
    chassis.add(rod01, rod12, rod20);

    // Delicate concentric brass compass ring inside triangle
    const innerRingGeo = track(new THREE.TorusGeometry(0.66, 0.02, 16, 64));
    const innerRing = new THREE.Mesh(innerRingGeo, palette.brushedBrass);
    innerRing.position.set(0, 0, -0.09);
    chassis.add(innerRing);

    const centerPinGeo = track(new THREE.CylinderGeometry(0.085, 0.085, 0.14, 28));
    centerPinGeo.rotateX(Math.PI / 2);
    const centerPin = new THREE.Mesh(centerPinGeo, palette.brushedBrass);
    centerPin.position.set(0, 0, -0.09);
    chassis.add(centerPin);

    // Shared ceramic station geometry
    const puckGeo = track(createBeveledStationPuck(0.56, 0.25));
    const rimGeo = track(new THREE.TorusGeometry(0.562, 0.025, 16, 48));
    const faceGeo = track(new THREE.CircleGeometry(0.465, 48));
    const backCapGeo = track(new THREE.CircleGeometry(0.32, 32));
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

      const ceramicMesh = new THREE.Mesh(puckGeo, palette.ceramicMatte);
      ceramicMesh.castShadow = !rig.isSoftwareWebGL;
      ceramicMesh.receiveShadow = true;
      ceramicMesh.userData.slotIndex = spec.slotIndex;
      group.add(ceramicMesh);

      const brassRimMesh = new THREE.Mesh(rimGeo, palette.brushedBrass);
      brassRimMesh.userData.slotIndex = spec.slotIndex;
      group.add(brassRimMesh);

      const frontFaceMat = track(
        new THREE.MeshStandardMaterial({
          map: dramaTex,
          roughness: 0.62,
          metalness: 0.04,
          envMapIntensity: 0.78,
        })
      );
      const frontFace = new THREE.Mesh(faceGeo, frontFaceMat);
      frontFace.position.z = 0.128;
      frontFace.userData.slotIndex = spec.slotIndex;
      group.add(frontFace);

      const backCap = new THREE.Mesh(backCapGeo, palette.brushedBrass);
      backCap.position.z = -0.128;
      group.add(backCap);

      chassis.add(group);

      return {
        slotIndex: spec.slotIndex,
        dramaId: spec.dramaId,
        winnerId: spec.winnerId,
        group,
        ceramicMesh,
        brassRimMesh,
        frontFaceMat,
        dramaTex,
        dramaActiveTex,
        winnerTex,
        winnerActiveTex,
        baseX: spec.pos.x,
        baseY: spec.pos.y,
        targetZ: 0,
        targetScale: 1,
        curZ: 0,
        curScale: 1,
      };
    });

    const raycastTargets = stations.map((s) => s.group);

    let targetRotZ = 0;
    let curRotZ = 0;

    const applyTargets = () => {
      const { mode: m, activeRole: role, hoveredSlot } = stateRef.current;
      const isWinner = m === 'winner';

      targetRotZ = isWinner ? Math.PI : 0;

      // Update structural brass/bronze finish for mode
      const rodMat = isWinner ? palette.brushedBrass : palette.darkBronze;
      rod01.material = rodMat;
      rod12.material = rodMat;
      rod20.material = rodMat;
      innerRing.material = isWinner ? palette.brassHighlight : palette.brushedBrass;

      stations.forEach((s) => {
        const expectedRole = isWinner ? s.winnerId : s.dramaId;
        const isActive = role === expectedRole;
        const isHovered = hoveredSlot === s.slotIndex;

        s.targetZ = isActive ? 0.36 : isHovered ? 0.12 : 0;
        s.targetScale = isActive ? 1.08 : isHovered ? 1.02 : 0.96;

        s.ceramicMesh.material = isActive
          ? isWinner
            ? palette.ceramicForest
            : palette.ceramicActive
          : palette.ceramicMatte;

        s.brassRimMesh.material = isActive || isHovered
          ? palette.brassHighlight
          : palette.brushedBrass;

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

    // Initialize clean rest state immediately
    curRotZ = targetRotZ;
    chassis.rotation.z = curRotZ;
    stations.forEach((s) => {
      s.curZ = s.targetZ;
      s.curScale = s.targetScale;
      s.group.position.z = s.curZ;
      s.group.scale.setScalar(s.curScale);
      s.group.rotation.z = -curRotZ;
    });

    const reduced = prefersReducedMotion();

    rig.setUpdateCallback((dt) => {
      let moving = false;
      const rotLambda = reduced ? 60 : 6.2;
      const posLambda = reduced ? 60 : 8.5;

      const nextRot = reduced
        ? targetRotZ
        : THREE.MathUtils.damp(curRotZ, targetRotZ, rotLambda, dt);
      if (Math.abs(nextRot - targetRotZ) > 0.001) moving = true;
      curRotZ = Math.abs(nextRot - targetRotZ) <= 0.001 ? targetRotZ : nextRot;

      chassis.rotation.z = curRotZ;
      // Subtle 3D architectural yaw during inversion so brass bevels catch studio light
      const normProgress = curRotZ / Math.PI;
      chassis.rotation.y = reduced ? 0 : Math.sin(normProgress * Math.PI) * 0.24;

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
      }

      return moving;
    });

    // Raycast station picking (zero-GC)
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

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

    const onPointerMove = (e: PointerEvent) => {
      const hitSlot = pickSlotIndex(e.clientX, e.clientY);
      renderer.domElement.style.cursor = hitSlot !== null ? 'pointer' : 'grab';
      if (stateRef.current.hoveredSlot !== hitSlot) {
        stateRef.current.hoveredSlot = hitSlot;
        applyTargets();
      }
    };

    const onPointerLeave = () => {
      renderer.domElement.style.cursor = 'grab';
      if (stateRef.current.hoveredSlot !== null) {
        stateRef.current.hoveredSlot = null;
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
      const hitSlot = pickSlotIndex(e.clientX, e.clientY);
      if (hitSlot === null) return;
      const station = stations[hitSlot];
      if (!station) return;
      playSoftThump('bright');
      onSelectRef.current(
        stateRef.current.mode === 'winner' ? station.winnerId : station.dramaId
      );
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
      <div className="w-full h-[260px] sm:h-[310px] flex items-center justify-center bg-[#FAF9F5] select-none px-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {fallbackRoles.map((r) => {
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRole(r.id)}
                className={`px-4 py-2.5 rounded-full border font-serif text-sm cursor-pointer transition-all ${
                  isActive
                    ? mode === 'winner'
                      ? 'bg-[#2D5A43] text-[#FAF9F5] border-[#B89656]'
                      : 'bg-[#18181B] text-[#FAF9F5] border-[#B89656]'
                    : 'bg-[#F2EFE9] text-[#18181B] border-[#C29D59]/60'
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
    <div className="relative w-full h-[270px] sm:h-[330px] lg:h-[360px] select-none">
      <div
        ref={mountRef}
        className="w-full h-full"
        aria-label="Interactive 3D ceramic and brushed brass Drama and Winner's Triangle sculpture. Drag to rotate or click a station to inspect."
      />

      {/* Quiet solid-paper reset button (no backdrop-filter over WebGL) */}
      <div className="absolute bottom-2 right-2 flex items-center gap-2 pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-stone-400">
          Drag to orbit · Click station
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
