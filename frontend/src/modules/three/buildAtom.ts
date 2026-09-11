import * as THREE from "three";
import type { ElementData } from "@/modules/data";

/**
 * 原子结构 3D 模型：
 * - 原子核：红色质子 + 灰蓝色中子按高斯球分布
 * - 核外电子：按壳层分布，蓝色电子沿倾斜轨道环高速运动
 */
export function buildAtomScene(e: ElementData): {
  group: THREE.Group;
  animate: (t: number, dt: number) => void;
} {
  const group = new THREE.Group();

  // ---------- 原子核 ----------
  const protons = e.n;
  const neutrons = Math.max(Math.round(e.mass) - e.n, 0);
  const nucleusGroup = new THREE.Group();
  const count = protons + neutrons;
  const coreR = Math.min(0.55, 0.26 + Math.pow(count, 1 / 3) * 0.09);

  // 简单随机撒点（固定种子保证稳定形状）
  let seed = 12345;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const pMat = new THREE.MeshStandardMaterial({ color: 0xe5484d, roughness: 0.4 });
  const nMat = new THREE.MeshStandardMaterial({ color: 0x7d8fb3, roughness: 0.4 });
  const r = 0.13;
  for (let i = 0; i < count; i++) {
    // 高斯球分布
    const u = rand() * 2 - 1;
    const phi = rand() * Math.PI * 2;
    const rr = coreR * Math.pow(Math.abs(u), 1 / 3);
    const x = rr * Math.sqrt(1 - u * u) * Math.cos(phi);
    const y = rr * u;
    const z = rr * Math.sqrt(1 - u * u) * Math.sin(phi);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), i < protons ? pMat : nMat);
    mesh.position.set(x, y, z);
    nucleusGroup.add(mesh);
  }
  group.add(nucleusGroup);

  // ---------- 电子轨道 ----------
  const shells = e.shells;
  const electronMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    roughness: 0.25,
    emissive: 0x2563eb,
    emissiveIntensity: 0.35,
  });

  const shellData: {
    ring: THREE.Object3D;
    electrons: THREE.Mesh[];
    radius: number;
    count: number;
    angle: number;
    speed: number;
    tilt: THREE.Vector3;
  }[] = [];

  shells.forEach((count, idx) => {
    if (count <= 0) return;
    const i = idx + 1;
    const radius = 1.05 + i * 0.85;
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.018, 8, 48), ringMat);
    const tilt = new THREE.Vector3(i * 0.55, i * 0.4, i * 0.25).normalize();
    ring.rotation.set(tilt.x, tilt.y, tilt.z);
    group.add(ring);

    const electrons: THREE.Mesh[] = [];
    for (let k = 0; k < count; k++) {
      const el = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), electronMat);
      electrons.push(el);
      group.add(el);
    }
    shellData.push({
      ring,
      electrons,
      radius,
      count,
      angle: i * 1.3,
      speed: 1.1 + i * 0.3,
      tilt,
    });
  });

  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.position.sub(center);

  return {
    group,
    animate: (t, dt) => {
      for (const s of shellData) {
        s.angle += dt * s.speed;
        const quat = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(s.tilt.x, s.tilt.y, s.tilt.z)
        );
        for (let k = 0; k < s.count; k++) {
          const theta = s.angle + (k * Math.PI * 2) / s.count;
          const pos = new THREE.Vector3(Math.cos(theta) * s.radius, 0, Math.sin(theta) * s.radius);
          pos.applyQuaternion(quat);
          s.electrons[k].position.copy(pos);
        }
      }
    },
  };
}
