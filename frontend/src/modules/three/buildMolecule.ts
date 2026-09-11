import * as THREE from "three";
import type { Molecule } from "@/modules/data";
import { ATOM_COLORS } from "@/modules/data";
import { buildBond } from "./ThreeViewport";

const ATOM_RADIUS: Record<string, number> = {
  H: 0.34,
  C: 0.46,
  N: 0.44,
  O: 0.42,
  F: 0.4,
  Cl: 0.56,
  Br: 0.62,
  I: 0.7,
  S: 0.52,
  P: 0.54,
  Na: 0.6,
};

function atomColor(el: string): number {
  return new THREE.Color(ATOM_COLORS[el] ?? "#c0c0c0").getHex();
}

/**
 * 构建分子球棍模型。
 * stateMotion: "gas" | "liquid" | "solid" 决定振动幅度（三态微观动画）。
 * 返回 { group, animate }，animate 在每帧被调用。
 */
export function buildMoleculeScene(
  mol: Molecule,
  stateMotion: "gas" | "liquid" | "solid"
): { group: THREE.Group; animate: (t: number, dt: number) => void } {
  const group = new THREE.Group();

  // 球心
  const centers: THREE.Vector3[] = mol.atoms.map((a) => new THREE.Vector3(a.x, a.y, a.z));

  // 键（多根：双键/三键并排）
  for (const bond of mol.bonds) {
    const p1 = centers[bond.a];
    const p2 = centers[bond.b];
    const order = bond.order ?? 1;
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length() || 1;
    const perp = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize();
    const offset = perp.multiplyScalar(0.11 * (order > 1 ? 1 : 0));
    for (let i = 0; i < order; i++) {
      const off = order === 1 ? new THREE.Vector3(0, 0, 0) : offset.clone().multiplyScalar(i === 0 ? 1 : -1);
      const a = p1.clone().add(off);
      const b = p2.clone().add(off);
      buildBond(a, b, 0.11, 0xc9ccd4, group);
    }
  }

  // 原子球
  const atomMeshes: THREE.Mesh[] = [];
  mol.atoms.forEach((a, i) => {
    const r = ATOM_RADIUS[a.el] ?? 0.5;
    const mat = new THREE.MeshStandardMaterial({
      color: atomColor(a.el),
      roughness: 0.35,
      metalness: 0.08,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 26, 20), mat);
    mesh.position.copy(centers[i]);
    group.add(mesh);
    atomMeshes.push(mesh);
  });

  // 让分子居中
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.position.sub(center);

  const amplitude = stateMotion === "gas" ? 0.14 : stateMotion === "liquid" ? 0.06 : 0.015;
  const speed = stateMotion === "gas" ? 1.6 : stateMotion === "liquid" ? 0.9 : 0.4;

  return {
    group,
    animate: (t, dt) => {
      atomMeshes.forEach((m, i) => {
        const ph = i * 1.7 + t * speed;
        m.position.set(
          centers[i].x + Math.sin(ph) * amplitude * 0.5,
          centers[i].y + Math.cos(ph * 0.8) * amplitude,
          centers[i].z + Math.sin(ph * 1.3) * amplitude * 0.5
        );
      });
    },
  };
}
