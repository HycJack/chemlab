import * as THREE from "three";
import type { Reagent } from "@/modules/data";

/**
 * 试剂「真实状态」3D 展示：
 * - 玻璃容器（密封瓶/烧杯）
 * - 气态：容器内为半透明气体 + 运动粒子
 * - 液态：容器内液面 + 上升气泡
 * - 固态：容器底部晶体堆
 */
export function buildReagentScene(
  reagent: Reagent,
  state: "固" | "液" | "气"
): { group: THREE.Group; animate: (t: number, dt: number) => void } {
  const group = new THREE.Group();
  const color = new THREE.Color(reagent.color);

  // ---------- 玻璃容器（广口瓶 + 塞子） ----------
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xcfe4ff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.05,
    metalness: 0,
    side: THREE.DoubleSide,
    clearcoat: 1,
    depthWrite: false,
  });
  const glassBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.95, 1.5, 32, 1, true),
    glassMat
  );
  glassBody.position.y = 0;
  const glassBottom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.95, 0.08, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xcfe4ff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      depthWrite: false,
    })
  );
  glassBottom.position.y = -0.75;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.35, 24, 1, true), glassMat);
  neck.position.y = 0.92;
  const stopper = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 20, 14),
    new THREE.MeshStandardMaterial({ color: 0x6d7686, roughness: 0.5, metalness: 0.2 })
  );
  stopper.scale.set(1, 0.85, 1);
  stopper.position.y = 1.22;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.035, 10, 28), glassMat);
  rim.position.y = 1.05;
  group.add(glassBody, glassBottom, neck, stopper, rim);

  const particles: { mesh: THREE.Mesh; vx: number; vy: number; vz: number; baseY: number }[] = [];

  // ---------- 内容物 ----------
  if (state === "气") {
    // 半透明气体云 + 飘动粒子
    const cloudMat = new THREE.MeshStandardMaterial({
      color: reagent.color,
      transparent: true,
      opacity: 0.28,
      roughness: 0.9,
      depthWrite: false,
    });
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 18), cloudMat);
    cloud.scale.set(1, 0.8, 0.95);
    cloud.position.y = -0.1;
    group.add(cloud);

    const dotMat = new THREE.MeshStandardMaterial({
      color: color.clone().multiplyScalar(0.7),
      emissive: color,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.85,
    });
    for (let i = 0; i < 14; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), dotMat);
      const a = (i / 14) * Math.PI * 2;
      const r = 0.25 + (i % 5) * 0.12;
      p.position.set(Math.cos(a) * r, (i % 7) * 0.16 - 0.42, Math.sin(a) * r * 0.9);
      group.add(p);
      particles.push({ mesh: p, vx: 0.3 + Math.random() * 0.5, vy: 0.25 + Math.random() * 0.4, vz: 0.2 + Math.random() * 0.4, baseY: 0 });
    }
  } else if (state === "液") {
    const fill = 0.62;
    const liquidMat = new THREE.MeshStandardMaterial({
      color: reagent.color,
      transparent: true,
      opacity: 0.62,
      roughness: 0.15,
      metalness: 0,
    });
    const liquid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.88, fill, 32),
      liquidMat
    );
    liquid.position.y = -0.75 + fill / 2;
    const surface = new THREE.Mesh(
      new THREE.CircleGeometry(0.82, 32),
      new THREE.MeshStandardMaterial({
        color: reagent.color,
        transparent: true,
        opacity: 0.75,
        roughness: 0.05,
      })
    );
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = -0.75 + fill;
    group.add(liquid, surface);

    // 上升气泡
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
    });
    for (let i = 0; i < 10; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.04 + Math.random() * 0.05, 8, 6), bubbleMat);
      const r = Math.random() * 0.6;
      const a = Math.random() * Math.PI * 2;
      b.position.set(Math.cos(a) * r, -0.7 + Math.random() * 0.5, Math.sin(a) * r);
      group.add(b);
      particles.push({ mesh: b, vx: Math.cos(a) * 0.01, vy: 0.5 + Math.random() * 0.5, vz: Math.sin(a) * 0.01, baseY: 0 });
    }
  } else {
    // 固态：底部晶体堆
    const crystalMat = new THREE.MeshStandardMaterial({
      color: reagent.color,
      roughness: 0.3,
      metalness: 0.05,
      emissive: color.clone().multiplyScalar(0.15),
    });
    const xs = [-0.55, -0.2, 0.15, 0.5, -0.38, 0.05, 0.42, -0.12, 0.3, -0.55, 0.2, 0.0];
    const zs = [-0.2, 0.35, -0.3, 0.1, -0.45, 0.4, -0.1, -0.4, 0.3, 0.25, -0.5, 0.5];
    const sizes = [0.42, 0.3, 0.36, 0.28, 0.3, 0.24, 0.3, 0.26, 0.24, 0.26, 0.3, 0.28];
    for (let i = 0; i < xs.length; i++) {
      const s = sizes[i];
      const cube = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), crystalMat);
      cube.position.set(xs[i] * 0.85, -0.75 + s / 2 + 0.04, zs[i] * 0.6);
      cube.rotation.set(i * 0.4, i * 0.3, 0);
      group.add(cube);
      particles.push({ mesh: cube, vx: 0, vy: 0, vz: 0, baseY: cube.position.y });
    }
  }

  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.position.sub(center);

  return {
    group,
    animate: (t, dt) => {
      for (const p of particles) {
        if (state === "气") {
          p.mesh.position.x += Math.sin(t * p.vx + p.mesh.position.y) * dt * 0.2;
          p.mesh.position.y += Math.cos(t * p.vy + p.mesh.position.x) * dt * 0.2;
          p.mesh.rotation.y += dt * 0.4;
        } else if (state === "液") {
          p.mesh.position.y += p.vy * dt;
          if (p.mesh.position.y > -0.1) p.mesh.position.y = -0.7;
        }
        // 固态：轻微呼吸感
        if (state === "固") {
          p.mesh.rotation.y += dt * 0.05;
        }
      }
    },
  };
}
