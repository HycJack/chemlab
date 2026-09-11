import { useEffect, useRef } from "react";
import type { ReactionAnimation } from "@/modules/data";

interface Props {
  kind: ReactionAnimation;
  color: string;
  label: string;
}

/**
 * 化学反应装置示意动画（Canvas 2D）。
 * 每种类型一套简化装置图 + 粒子效果，突出主要实验现象。
 */
export function ReactionAnimationView({ kind, color, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef(label);
  labelRef.current = label;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let last = performance.now();
    const W = 560;
    const H = 340;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // 粒子池
    const sparks: { x: number; y: number; vx: number; vy: number; life: number; r: number }[] = [];
    const bubbles: { x: number; y: number; vy: number; r: number; w: number }[] = [];
    const precip: { x: number; y: number; vy: number; r: number; landed: boolean }[] = [];

    const spawnSpark = () => {
      sparks.push({
        x: W / 2 + (Math.random() - 0.5) * 120,
        y: H / 2 - 20,
        vx: (Math.random() - 0.5) * 60,
        vy: -60 - Math.random() * 60,
        life: 1,
        r: 1.5 + Math.random() * 2,
      });
    };
    const spawnBubble = (x: number, y: number, w = 60) => {
      bubbles.push({ x: x + (Math.random() - 0.5) * w, y, vy: 30 + Math.random() * 40, r: 2 + Math.random() * 3, w });
    };
    const spawnPrecip = () => {
      precip.push({ x: W / 2 + (Math.random() - 0.5) * 120, y: 120, vy: 20 + Math.random() * 20, r: 1.5 + Math.random() * 2, landed: false });
    };

    const drawFlame = (x: number, y: number, h: number, intensity: number) => {
      const flicker = Math.sin(t * 8) * 3 * intensity;
      const g = ctx.createLinearGradient(x, y, x, y - h);
      g.addColorStop(0, "rgba(255,220,120,0.95)");
      g.addColorStop(0.55, "rgba(255,150,40,0.9)");
      g.addColorStop(1, "rgba(255,80,20,0.35)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x - 8 - flicker * 0.5, y);
      ctx.quadraticCurveTo(x - 10, y - h * 0.55, x + flicker, y - h);
      ctx.quadraticCurveTo(x + 12, y - h * 0.55, x + 8 + flicker * 0.5, y);
      ctx.closePath();
      ctx.fill();
      // 内焰
      ctx.fillStyle = "rgba(255,255,220,0.8)";
      ctx.beginPath();
      ctx.moveTo(x - 3, y);
      ctx.quadraticCurveTo(x - 2, y - h * 0.4, x, y - h * 0.62);
      ctx.quadraticCurveTo(x + 3, y - h * 0.4, x + 3, y);
      ctx.closePath();
      ctx.fill();
    };

    const drawBeaker = (cx: number, w: number, h: number, fillPct: number, color: string, opacity: number) => {
      const x0 = cx - w / 2;
      const y0 = H / 2 + 60;
      // 液体
      const fy = y0 - h * fillPct;
      ctx.fillStyle = hexA(color, opacity);
      ctx.fillRect(x0 + 6, fy, w - 12, h * fillPct);
      // 器壁
      ctx.strokeStyle = "rgba(120,150,190,0.9)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0, y0 - h);
      ctx.lineTo(x0 + w, y0 - h);
      ctx.lineTo(x0 + w, y0);
      ctx.stroke();
      // 杯口
      ctx.strokeStyle = "rgba(120,150,190,0.9)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x0 - 4, y0 - h);
      ctx.lineTo(x0 + w + 4, y0 - h);
      ctx.stroke();
    };

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      ctx.clearRect(0, 0, W, H);

      // 背景
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "rgba(10,14,26,0.0)");
      bg.addColorStop(1, "rgba(20,30,50,0.35)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      // 桌面
      ctx.fillStyle = "rgba(90,70,50,0.35)";
      ctx.fillRect(0, H / 2 + 92, W, 10);
      ctx.fillStyle = "rgba(60,45,32,0.3)";
      ctx.fillRect(0, H / 2 + 102, W, 30);

      const cx = W / 2;

      switch (kind) {
        case "combustion": {
          // 集气瓶 + 燃烧匙
          ctx.strokeStyle = "rgba(140,170,210,0.85)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(cx - 70, H / 2 - 70, 140, 165, 8);
          ctx.stroke();
          // 瓶底水/细沙
          ctx.fillStyle = "rgba(150,130,90,0.5)";
          ctx.fillRect(cx - 64, H / 2 + 78, 128, 14);
          // 燃烧匙
          ctx.strokeStyle = "rgba(150,150,160,0.9)";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(cx - 60, H / 2 - 60);
          ctx.lineTo(cx, H / 2 - 10);
          ctx.stroke();
          ctx.fillStyle = hexA(color, 0.9);
          ctx.beginPath();
          ctx.arc(cx, H / 2 - 6, 12, 0, Math.PI * 2);
          ctx.fill();
          // 火焰
          drawFlame(cx, H / 2 - 14, 46, 1);
          // 火星
          if (Math.random() < 0.4) spawnSpark();
          for (const s of sparks) {
            s.x += s.vx * dt;
            s.y += s.vy * dt;
            s.life -= dt * 1.6;
            ctx.fillStyle = `rgba(255,${180 + Math.floor(s.life * 60)},80,${Math.max(s.life, 0)})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
          }
          sparks.length = sparks.filter((s) => s.life > 0).length;
          // 白烟
          if (kind === "combustion" && Math.random() < 0.2) {
            bubbles.push({ x: cx + (Math.random() - 0.5) * 60, y: H / 2 - 40, vy: -20 - Math.random() * 15, r: 4 + Math.random() * 5, w: 60 });
          }
          for (const b of bubbles) {
            b.y += b.vy * dt;
            ctx.fillStyle = `rgba(230,230,240,${Math.max(0.4 - Math.abs(b.y - (H / 2 - 60)) / 300, 0.05)})`;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
          }
          bubbles.length = bubbles.filter((b) => b.y > H / 2 - 160 && b.y < H / 2 + 60).length;
          break;
        }
        case "electrolysis": {
          // 水槽 + 两电极 + 倒置试管
          drawBeaker(cx, 240, 150, 0.8, "rgba(90,140,220,1)", 0.25);
          const yTop = H / 2 + 60 - 150 * 0.8;
          // 电极
          ctx.strokeStyle = "rgba(60,60,70,0.95)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(cx - 70, yTop);
          ctx.lineTo(cx - 70, H / 2 + 45);
          ctx.moveTo(cx + 70, yTop);
          ctx.lineTo(cx + 70, H / 2 + 45);
          ctx.stroke();
          // 倒置试管
          ctx.strokeStyle = "rgba(140,170,210,0.85)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(cx - 100, yTop - 95, 55, 100, 4);
          ctx.roundRect(cx + 45, yTop - 95, 55, 100, 4);
          ctx.stroke();
          // 气泡
          if (Math.random() < 0.5) spawnBubble(cx - 70, yTop, 40);
          if (Math.random() < 0.3) spawnBubble(cx + 70, yTop, 40);
          for (const b of bubbles) {
            b.y -= b.vy * dt;
            ctx.fillStyle = "rgba(180,220,255,0.8)";
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
          }
          bubbles.length = bubbles.filter((b) => b.y > yTop - 80).length;
          // 电源符号
          ctx.strokeStyle = "rgba(200,200,220,0.7)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx - 30, H / 2 + 78);
          ctx.lineTo(cx + 30, H / 2 + 78);
          ctx.moveTo(cx - 10, H / 2 + 70);
          ctx.lineTo(cx - 10, H / 2 + 86);
          ctx.moveTo(cx + 10, H / 2 + 72);
          ctx.lineTo(cx + 10, H / 2 + 84);
          ctx.stroke();
          break;
        }
        case "decomp": {
          // 试管（倾斜）+ 导管 + 水槽集气
          const x0 = cx - 110;
          const y0 = H / 2 + 20;
          ctx.strokeStyle = "rgba(140,170,210,0.85)";
          ctx.lineWidth = 3;
          ctx.save();
          ctx.translate(x0, y0);
          ctx.rotate(-0.5);
          ctx.beginPath();
          ctx.roundRect(0, -14, 180, 28, 10);
          ctx.stroke();
          ctx.restore();
          // 管内固体
          ctx.fillStyle = hexA(color, 0.5);
          ctx.save();
          ctx.translate(x0, y0);
          ctx.rotate(-0.5);
          ctx.fillRect(60, -9, 90, 18);
          ctx.restore();
          // 酒精灯
          drawFlame(cx - 150, H / 2 + 88, 30, 0.9);
          ctx.fillStyle = "rgba(200,170,120,0.7)";
          ctx.fillRect(cx - 158, H / 2 + 88, 16, 14);
          // 导管
          ctx.strokeStyle = "rgba(150,160,180,0.8)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(cx - 40, H / 2 + 2);
          ctx.lineTo(cx + 60, H / 2 + 2);
          ctx.lineTo(cx + 60, H / 2 + 45);
          ctx.stroke();
          // 水槽 + 倒置集气瓶
          drawBeaker(cx + 90, 130, 110, 0.75, "rgba(90,140,220,1)", 0.3);
          ctx.strokeStyle = "rgba(140,170,210,0.85)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(cx + 60, H / 2 + 30 - 80, 60, 82, 4);
          ctx.stroke();
          // 气泡进入
          if (Math.random() < 0.4) spawnBubble(cx + 90, H / 2 + 45, 20);
          for (const b of bubbles) {
            b.y -= b.vy * dt;
            ctx.fillStyle = "rgba(180,220,255,0.75)";
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
          }
          bubbles.length = bubbles.filter((b) => b.y > H / 2 - 60).length;
          break;
        }
        case "displacement": {
          drawBeaker(cx, 190, 150, 0.72, "rgba(120,150,220,1)", 0.28);
          const yTop = H / 2 + 60 - 150 * 0.72;
          // 金属片
          ctx.fillStyle = hexA(color, 0.95);
          ctx.beginPath();
          ctx.roundRect(cx - 22, yTop + 6, 44, 130, 6);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.25)";
          ctx.fillRect(cx - 14, yTop + 16, 6, 100);
          // 气泡
          if (Math.random() < 0.5) spawnBubble(cx, yTop + 20, 36);
          for (const b of bubbles) {
            b.y -= b.vy * dt;
            ctx.fillStyle = "rgba(220,240,255,0.85)";
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
          }
          bubbles.length = bubbles.filter((b) => b.y > yTop - 20).length;
          // 沉积层
          ctx.fillStyle = hexA("#d97b5a", 0.75);
          for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(cx - 40 + i * 18 + Math.sin(t * 2 + i) * 3, H / 2 + 54, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }
        case "precipitation": {
          drawBeaker(cx, 190, 150, 0.7, "rgba(190,210,240,1)", 0.35);
          // 滴管
          ctx.strokeStyle = "rgba(150,160,180,0.85)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx + 20, 30);
          ctx.lineTo(cx + 20, 100);
          ctx.stroke();
          ctx.fillStyle = "rgba(220,60,70,0.85)";
          ctx.beginPath();
          ctx.arc(cx + 20, 108, 8, 0, Math.PI * 2);
          ctx.fill();
          // 液滴
          if (Math.random() < 0.25) {
            precip.push({ x: cx + 20 + (Math.random() - 0.5) * 8, y: 120, vy: 60 + Math.random() * 30, r: 3, landed: false });
          }
          for (const p of precip) {
            if (!p.landed) {
              p.y += p.vy * dt;
              if (p.y > H / 2 + 45) p.landed = true;
            } else {
              p.y = H / 2 + 45 + Math.sin(t * 3 + p.x) * 1.5;
            }
            ctx.fillStyle = hexA(color, 0.9);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          }
          if (precip.length > 60) precip.splice(0, precip.length - 60);
          break;
        }
        case "generic": {
          // 两分子碰撞 → 结合
          const a1x = cx - 80 + Math.sin(t * 1.2) * 12;
          const a2x = cx + 80 - Math.sin(t * 1.2) * 12;
          const ay = H / 2 - 10;
          ctx.fillStyle = hexA(color, 0.9);
          ctx.beginPath();
          ctx.arc(a1x, ay, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(90,140,220,0.9)";
          ctx.beginPath();
          ctx.arc(a2x, ay + Math.sin(t * 1.2) * 14, 16, 0, Math.PI * 2);
          ctx.fill();
          // 结合产物（中间闪烁）
          const phase = (Math.sin(t * 2.4) + 1) / 2;
          if (phase > 0.75) {
            ctx.fillStyle = `rgba(255,220,120,${(phase - 0.75) * 3})`;
            ctx.beginPath();
            ctx.arc(cx, ay, 14 + phase * 6, 0, Math.PI * 2);
            ctx.fill();
          }
          // 轨迹
          ctx.strokeStyle = "rgba(200,210,230,0.3)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.moveTo(a1x, ay);
          ctx.lineTo(a2x, ay);
          ctx.stroke();
          ctx.setLineDash([]);
          break;
        }
      }

      // 标签
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "13px -apple-system, 'PingFang SC', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labelRef.current, W / 2, H - 16);

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [kind, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

function hexA(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, w: number, h: number, r?: number): void;
  }
}
