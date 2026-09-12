import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export interface ThreeBuildContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  clock: THREE.Clock;
  /** 模型组（builder 将模型挂到该组上） */
  group: THREE.Group;
  /** 释放 builder 自己创建的几何/材质 */
  dispose?: () => void;
}

export interface ThreeViewportProps {
  /** 构建模型。返回一个可选清理函数。 */
  build?: (ctx: ThreeBuildContext) => void | (() => void);
  /** 每帧动画（t 为累计秒，dt 为与上一帧的间隔秒） */
  animate?: (ctx: ThreeBuildContext, t: number, dt: number) => void;
  /** WebGL 不可用时的降级内容 */
  fallback?: React.ReactNode;
  className?: string;
  cameraPos?: [number, number, number];
  target?: [number, number, number];
  fov?: number;
  /** null → 透明背景（跟随主题） */
  background?: string | null;
  autoRotate?: boolean;
  /** 是否启用拖拽旋转/缩放（默认开启） */
  interactive?: boolean;
}

/**
 * 通用 Three.js 视口：
 * - 自动创建渲染器 / 相机 / 环境光 / 轨道控制
 * - WebGL 不可用时降级为 fallback
 * - 组件卸载时释放全部资源
 *
 * 注意：场景只在挂载时构建一次（build 仅执行一次）。当模型内容随外部
 * 状态变化时，调用方必须通过 key 传入新标识（如选中项 id）强制重建。
 */
export function ThreeViewport({
  build,
  animate,
  fallback,
  className,
  cameraPos = [3.2, 2.2, 3.6],
  target = [0, 0, 0],
  fov = 45,
  background = null,
  autoRotate = false,
  interactive = true,
}: ThreeViewportProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [buildFailed, setBuildFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    // 本实例的环境贴图释放器（卸载时调用）
    let envDisposers: (() => void) | undefined;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    if (background) scene.background = new THREE.Color(background);

    const camera = new THREE.PerspectiveCamera(
      fov,
      host.clientWidth / Math.max(host.clientHeight, 1),
      0.01,
      1000
    );
    camera.position.set(...cameraPos);

    // 环境光 + 定向光 + 补光
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(4, 6, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xbcd4ff, 0.45);
    fill.position.set(-4, -2, -4);
    scene.add(fill);

    // 使用 RoomEnvironment 提供柔和的室内反射（玻璃质感需要）
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new RoomEnvironment();
      const envMap = pmrem.fromScene(envScene, 0.04).texture;
      scene.environment = envMap;
      // 卸载时连同环境贴图一起释放，否则每次挂载都泄漏一份 GPU 资源。
      envDisposers = () => {
        envMap.dispose();
        pmrem.dispose();
        envScene.dispose();
      };
    } catch {
      /* env 生成失败不影响主体渲染 */
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(...target);
    controls.enablePan = interactive;
    controls.enableRotate = interactive;
    controls.enableZoom = interactive;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.6;
    controls.minDistance = 1;
    controls.maxDistance = 40;
    controls.update();

    const group = new THREE.Group();
    scene.add(group);
    const clock = new THREE.Clock();

    const ctx: ThreeBuildContext = {
      scene,
      camera,
      renderer,
      controls,
      clock,
      group,
    };

    let cleanup: (() => void) | undefined;
    try {
      const result = build?.(ctx);
      if (typeof result === "function") cleanup = result;
    } catch (e) {
      console.error("3D build failed", e);
      setBuildFailed(true);
    }

    setReady(true);

    const onResize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    renderer.setAnimationLoop((time) => {
      const t = time / 1000;
      const dt = clock.getDelta();
      animate?.(ctx, t, dt);
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      cleanup?.();
      // 释放场景内几何/材质
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      envDisposers?.();
      envDisposers = undefined;
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={hostRef} className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center">
          {fallback ?? <span className="text-sm text-muted-foreground">当前环境不支持 WebGL</span>}
        </div>
      )}
      {buildFailed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">3D 模型加载失败</span>
        </div>
      )}
      {!ready && !failed && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          加载中…
        </div>
      )}
    </div>
  );
}

/** 构建位于 p1→p2 之间的圆柱键 */
export function buildBond(
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  radius: number,
  color: number,
  parent: THREE.Object3D
): THREE.Mesh {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = dir.length() || 0.001;
  const geo = new THREE.CylinderGeometry(radius, radius, len, 10);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.05 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  parent.add(mesh);
  return mesh;
}
