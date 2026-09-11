import * as THREE from "three";
import type { InstrumentShape } from "@/modules/data";

/**
 * 实验仪器 3D 建模：每种 shape 用 three.js 图元拼装。
 * 几何/材质由 ThreeViewport 卸载时统一释放。
 */

function glassMat(color = 0xcfe4ff, opacity = 0.36): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity,
    roughness: 0.06,
    metalness: 0,
    side: THREE.DoubleSide,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    depthWrite: false,
  });
}

function solidMat(color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05, ...opts });
}

function metalMat(color = 0x8f98a8): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.85 });
}

function rim(r: number, tube = 0.045, mat?: THREE.Material): THREE.Mesh {
  const m = mat ?? glassMat();
  return new THREE.Mesh(new THREE.TorusGeometry(r, tube, 10, 32), m);
}

function lathe(points: [number, number][], mat: THREE.Material, segments = 28): THREE.Mesh {
  const pts = points.map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.Mesh(new THREE.LatheGeometry(pts, segments), mat);
}

function cyl(rTop: number, rBot: number, h: number, mat: THREE.Material, radial = 24, open = false): THREE.Mesh {
  return new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, radial, 1, open), mat);
}

/** 球冠（朝上） */
function capSphere(r: number, mat: THREE.Material, scaleY = 1): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), mat);
  m.scale.y = scaleY;
  return m;
}

export function buildInstrument(shape: InstrumentShape): THREE.Group {
  const g = new THREE.Group();
  switch (shape) {
    case "testtube": {
      const mat = glassMat();
      const r = 0.5;
      const h = 2.3;
      const body = cyl(r, r, h - 0.4, mat, 24, true);
      body.position.y = -0.1;
      const bottom = capSphere(r, mat, 0.55);
      bottom.position.y = -h / 2 + 0.25;
      const top = rim(r, 0.05, mat);
      top.position.y = h / 2 - 0.25;
      g.add(body, bottom, top);
      break;
    }
    case "beaker": {
      const mat = glassMat();
      const r = 0.8;
      const h = 1.15;
      const body = cyl(r, r, h, mat, 28, true);
      body.position.y = 0;
      const top = rim(r, 0.055, mat);
      top.position.y = h / 2;
      const spout = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.22, 12), mat);
      spout.position.set(0.78, h / 2 + 0.02, 0.55);
      spout.rotation.x = -Math.PI / 2;
      g.add(body, top, spout);
      break;
    }
    case "erlenmeyer": {
      const mat = glassMat();
      const body = lathe(
        [
          [0.02, 1.45], [0.3, 1.45], [0.3, 1.0], [0.5, 0.8], [0.85, 0.3],
          [0.92, 0.0], [0.88, -0.06], [0.6, -0.12], [0.0, -0.14],
        ],
        mat
      );
      const top = rim(0.3, 0.05, mat);
      top.position.y = 1.48;
      g.add(body, top);
      break;
    }
    case "gasbottle": {
      const mat = glassMat();
      const body = lathe(
        [
          [0.02, 1.35], [0.38, 1.35], [0.38, 1.05], [0.5, 0.85], [0.68, 0.5],
          [0.72, 0.0], [0.68, -0.05], [0.0, -0.08],
        ],
        mat
      );
      const cover = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 24), glassMat(0xffffff, 0.5));
      cover.position.y = 1.4;
      const top = rim(0.38, 0.045, mat);
      top.position.y = 1.36;
      g.add(body, cover, top);
      break;
    }
    case "cylinder": {
      const mat = glassMat();
      const body = lathe(
        [
          [0.05, 1.7], [0.4, 1.7], [0.42, 1.62], [0.42, -0.5],
          [0.45, -0.62], [0.38, -0.62], [0.36, -0.5],
        ],
        mat
      );
      const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.08, 24, 1, true), mat);
      lip.position.y = 1.64;
      g.add(body, lip);
      break;
    }
    case "dropper": {
      const tube = cyl(0.09, 0.09, 1.5, glassMat(), 12, true);
      tube.position.y = -0.35;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), solidMat(0xd64550));
      bulb.scale.set(1, 1.5, 1);
      bulb.position.y = 0.62;
      g.add(tube, bulb);
      break;
    }
    case "dropbottle": {
      const mat = glassMat();
      const body = lathe(
        [
          [0.02, 0.95], [0.2, 0.95], [0.2, 0.75], [0.3, 0.6], [0.55, 0.3],
          [0.58, 0.0], [0.55, -0.06], [0.0, -0.08],
        ],
        mat
      );
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 12), solidMat(0xd64550));
      bulb.scale.set(1, 1.4, 1);
      bulb.position.y = 1.28;
      g.add(body, bulb);
      break;
    }
    case "reagentbottle": {
      const mat = glassMat(0xcfe4ff, 0.32);
      const body = lathe(
        [
          [0.02, 1.3], [0.22, 1.3], [0.22, 1.0], [0.35, 0.85], [0.58, 0.5],
          [0.64, 0.0], [0.6, -0.08], [0.5, -0.14], [0.0, -0.16],
        ],
        mat
      );
      const stopper = new THREE.Mesh(new THREE.SphereGeometry(0.26, 18, 12), glassMat(0xffffff, 0.55));
      stopper.scale.set(1, 0.9, 1);
      stopper.position.y = 1.55;
      g.add(body, stopper);
      break;
    }
    case "funnel": {
      const mat = glassMat();
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.8, 28, 1, true), mat);
      cone.position.y = 0.35;
      cone.rotation.z = Math.PI;
      const stem = cyl(0.13, 0.13, 0.6, mat, 16, true);
      stem.position.y = -0.35;
      const top = rim(0.85, 0.05, mat);
      top.position.y = 0.78;
      g.add(cone, stem, top);
      break;
    }
    case "longfunnel": {
      const mat = glassMat();
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.7, 28, 1, true), mat);
      cone.position.y = 0.7;
      cone.rotation.z = Math.PI;
      const stem = cyl(0.14, 0.14, 1.5, mat, 16, true);
      stem.position.y = -0.4;
      const top = rim(0.75, 0.05, mat);
      top.position.y = 1.08;
      g.add(cone, stem, top);
      break;
    }
    case "glassrod": {
      const mat = glassMat(0xeaf4ff, 0.4);
      const rod = cyl(0.07, 0.07, 2.3, mat, 12, true);
      const a = capSphere(0.07, mat, 1.6);
      a.position.y = 1.1;
      const b = capSphere(0.07, mat, 1.6);
      b.position.y = -1.1;
      b.rotation.z = Math.PI;
      g.add(rod, a, b);
      break;
    }
    case "evaporatingdish": {
      const mat = solidMat(0xf3efe6, { roughness: 0.75 });
      const bowl = lathe(
        [
          [0.02, 0.26], [0.3, 0.22], [0.55, 0.1], [0.7, -0.06], [0.72, -0.14], [0.0, -0.16],
        ],
        mat
      );
      const foot = cyl(0.34, 0.42, 0.09, mat);
      foot.position.y = -0.2;
      g.add(bowl, foot);
      break;
    }
    case "alcohollamp": {
      const mat = glassMat(0xf5e9d0, 0.5);
      const body = lathe(
        [
          [0.02, 0.7], [0.3, 0.7], [0.36, 0.62], [0.55, 0.3], [0.6, 0.0],
          [0.56, -0.12], [0.3, -0.2], [0.0, -0.22],
        ],
        mat
      );
      const neck = cyl(0.18, 0.26, 0.25, metalMat(0xc9b458), 16, true);
      neck.position.y = 0.78;
      const wick = cyl(0.06, 0.06, 0.22, solidMat(0x3a3a3a), 8);
      wick.position.y = 1.0;
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 12), solidMat(0xffa502, { emissive: 0xff9f43, emissiveIntensity: 1.6 }));
      flame.position.y = 1.3;
      g.add(body, neck, wick, flame);
      break;
    }
    case "tripod": {
      const m = metalMat(0x6d7686);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.045, 10, 32), m);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.75;
      g.add(ring);
      for (let i = 0; i < 3; i++) {
        const leg = cyl(0.035, 0.055, 0.8, m, 8);
        const a = (i / 3) * Math.PI * 2;
        leg.position.set(Math.cos(a) * 0.45, 0.36, Math.sin(a) * 0.45);
        leg.rotation.z = -Math.cos(a) * 0.12;
        leg.rotation.x = Math.sin(a) * 0.12;
        g.add(leg);
      }
      break;
    }
    case "wiregauze": {
      const m = metalMat(0x9aa0ab);
      const s = 0.62;
      for (let i = -3; i <= 3; i++) {
        const h = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.025, 0.025), m);
        h.position.set(0, 0, (i * s) / 3);
        g.add(h);
        const v = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 1.3), m);
        v.position.set((i * s) / 3, 0, 0);
        g.add(v);
      }
      break;
    }
    case "ironstand": {
      const m = metalMat(0x545c6e);
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 0.55), m);
      base.position.y = -0.75;
      const pole = cyl(0.055, 0.07, 1.7, m, 12);
      pole.position.y = 0.08;
      const arm = cyl(0.04, 0.04, 0.75, m, 10);
      arm.rotation.z = Math.PI / 2;
      arm.position.set(0.35, 0.85, 0);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 8, 24), m);
      ring.position.set(0.72, 0.85, 0);
      g.add(base, pole, arm, ring);
      break;
    }
    case "spoon": {
      const m = solidMat(0xf5f5f5);
      const handle = cyl(0.04, 0.055, 1.15, m, 10);
      handle.rotation.z = Math.PI / 2;
      handle.position.x = 0.25;
      const scoop = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), m);
      scoop.position.set(-0.42, -0.12, 0);
      scoop.rotation.z = Math.PI * 0.28;
      g.add(handle, scoop);
      break;
    }
    case "tongs": {
      const m = metalMat(0x8d95a5);
      const bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.045, 1.5, 0.045), m);
      bar1.rotation.z = 0.18;
      bar1.position.y = 0.1;
      const bar2 = bar1.clone();
      bar2.rotation.z = -0.18;
      const pivot = cyl(0.06, 0.06, 0.1, m, 10);
      pivot.rotation.x = Math.PI / 2;
      pivot.position.set(0, -0.28, 0);
      g.add(bar1, bar2, pivot);
      break;
    }
    case "tubeclamp": {
      const wood = solidMat(0xc9a45c, { roughness: 0.85 });
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.35, 0.03), wood);
      const spring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.028, 8, 20), metalMat(0x9aa0ab));
      spring.position.set(0, -0.35, 0);
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.1), wood);
      pad.position.set(0, 0.72, 0.04);
      g.add(strip, spring, pad);
      break;
    }
    case "flask": {
      const mat = glassMat();
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.85, 30, 20), mat);
      bulb.scale.y = 0.95;
      bulb.position.y = -0.15;
      const neck = cyl(0.27, 0.32, 0.95, mat, 22, true);
      neck.position.y = 0.72;
      const top = rim(0.27, 0.05, mat);
      top.position.y = 1.2;
      g.add(bulb, neck, top);
      break;
    }
    case "volumetricflask": {
      const mat = glassMat();
      const body = lathe(
        [
          [0.02, 1.25], [0.18, 1.25], [0.18, 1.0], [0.28, 0.82], [0.6, 0.35],
          [0.68, 0.1], [0.66, -0.05], [0.55, -0.12], [0.0, -0.14],
        ],
        mat
      );
      const mark = new THREE.Mesh(new THREE.TorusGeometry(0.185, 0.012, 8, 28), solidMat(0xffffff, { transparent: true, opacity: 0.85 }));
      mark.rotation.x = Math.PI / 2;
      mark.position.y = 1.12;
      g.add(body, mark);
      break;
    }
    case "separatingfunnel": {
      const mat = glassMat();
      const body = lathe(
        [
          [0.02, 1.35], [0.26, 1.35], [0.26, 1.1], [0.4, 0.9], [0.58, 0.5],
          [0.62, 0.2], [0.55, 0.0], [0.4, -0.12], [0.28, -0.22], [0.2, -0.3],
        ],
        mat
      );
      const stop = cyl(0.16, 0.16, 0.12, metalMat(0xc0c6d0), 12);
      stop.position.y = -0.42;
      const stem = cyl(0.11, 0.11, 0.55, mat, 14, true);
      stem.position.y = -0.78;
      const plug = new THREE.Mesh(new THREE.SphereGeometry(0.3, 18, 12), glassMat(0xffffff, 0.55));
      plug.position.y = 1.6;
      g.add(body, stop, stem, plug);
      break;
    }
    case "condenser": {
      const mat = glassMat(0xd6e8fa, 0.3);
      const jacket = cyl(0.34, 0.34, 1.7, mat, 24, true);
      const inner = cyl(0.11, 0.11, 1.85, glassMat(0xeef6ff, 0.4), 16, true);
      inner.rotation.x = Math.PI / 2;
      const arm1 = cyl(0.09, 0.09, 0.5, mat, 12, true);
      arm1.position.set(0.3, 0.3, 0.75);
      arm1.rotation.x = Math.PI / 2;
      arm1.rotation.z = -0.6;
      const arm2 = cyl(0.09, 0.09, 0.5, mat, 12, true);
      arm2.position.set(-0.3, 0.3, -0.75);
      arm2.rotation.x = Math.PI / 2;
      arm2.rotation.z = 0.6;
      g.add(jacket, inner, arm1, arm2);
      break;
    }
    case "watchglass": {
      const mat = glassMat();
      const dish = lathe(
        [
          [0.0, 0.16], [0.3, 0.14], [0.6, 0.05], [0.75, -0.08], [0.72, -0.12], [0.0, -0.12],
        ],
        mat
      );
      g.add(dish);
      break;
    }
    case "mortar": {
      const m = solidMat(0xf3efe6, { roughness: 0.75 });
      const bowl = lathe(
        [
          [0.0, 0.3], [0.35, 0.26], [0.65, 0.12], [0.72, -0.05], [0.68, -0.18], [0.0, -0.2],
        ],
        m
      );
      const pestle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.14, 0.85, 12), m);
      pestle.position.set(0.28, 0.42, 0);
      pestle.rotation.z = 0.35;
      const pestleTip = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10), m);
      pestleTip.position.set(0.5, 0.18, 0);
      g.add(bowl, pestle, pestleTip);
      break;
    }
    case "watertrough": {
      const mat = glassMat(0xd6e8fa, 0.28);
      const w = 1.6, d = 0.95, h = 0.55, t = 0.06;
      const wall = (l: number, ht: number, thick: number, pos: [number, number, number]) => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(l, ht, thick), mat);
        box.position.set(...pos);
        return box;
      };
      const bottom = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), mat);
      bottom.position.y = -h / 2;
      g.add(
        bottom,
        wall(w, h, t, [0, 0, -d / 2 + t / 2]),
        wall(w, h, t, [0, 0, d / 2 - t / 2]),
        wall(t, h, d, [-w / 2 + t / 2, 0, 0]),
        wall(t, h, d, [w / 2 - t / 2, 0, 0])
      );
      break;
    }
    case "crucible": {
      const m = solidMat(0xe8e4da, { roughness: 0.7 });
      const cup = lathe(
        [
          [0.0, 0.42], [0.34, 0.4], [0.42, 0.28], [0.42, -0.05], [0.36, -0.14], [0.0, -0.16],
        ],
        m
      );
      const lid = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 12, 0, Math.PI * 2, 0, Math.PI / 3), m);
      lid.position.y = 0.42;
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), m);
      knob.position.y = 0.65;
      g.add(cup, lid, knob);
      break;
    }
    default: {
      // 兜底：试管
      return buildInstrument("testtube");
    }
  }
  return g;
}
