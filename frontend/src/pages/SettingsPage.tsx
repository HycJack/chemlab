import { useEffect, useState } from "react";
import { Monitor, Moon, Sun, Palette, Settings2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/modules/settings/store";
import { useTheme, listBuiltinThemes, type ThemeColors } from "@/modules/theme";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GetInfo } from "@bindings/chemlab/internal/app/versionservice";

const MODES: { id: "system" | "light" | "dark"; label: string; icon: typeof Sun }[] = [
  { id: "system", label: "跟随系统", icon: Monitor },
  { id: "light", label: "浅色", icon: Sun },
  { id: "dark", label: "深色", icon: Moon },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">设置</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          外观、主题与应用信息。
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1 gap-1.5">
            <Settings2 className="h-4 w-4" />
            通用
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex-1 gap-1.5">
            <Palette className="h-4 w-4" />
            主题
          </TabsTrigger>
          <TabsTrigger value="about" className="flex-1 gap-1.5">
            <Info className="h-4 w-4" />
            关于
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralSection />
        </TabsContent>
        <TabsContent value="themes" className="mt-6">
          <ThemesSection />
        </TabsContent>
        <TabsContent value="about" className="mt-6">
          <AboutSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GeneralSection() {
  const { mode, setMode } = useTheme();
  const zoomLevel = usePreferencesStore((s) => s.zoomLevel);
  const setZoomLevel = usePreferencesStore((s) => s.setZoomLevel);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Label>外观模式</Label>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((o) => (
            <Button
              key={o.id}
              variant={mode === o.id ? "default" : "outline"}
              onClick={() => setMode(o.id)}
              className="h-16 flex-col gap-1.5"
            >
              <o.icon className="h-5 w-5" />
              <span className="text-xs">{o.label}</span>
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">主题颜色在「主题」页切换。</p>
      </section>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>界面缩放</Label>
          <span className="text-sm tabular-nums text-muted-foreground">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>
        <Slider
          min={0.5}
          max={2}
          step={0.05}
          value={[zoomLevel]}
          onValueChange={(v) => setZoomLevel(v[0])}
        />
        <p className="text-xs text-muted-foreground">
          仅缩放内容区域，侧边栏与标题栏保持 100%。
        </p>
      </section>
    </div>
  );
}

function ThemesSection() {
  const { themeId, setThemeId, resolvedMode } = useTheme();
  const themes = listBuiltinThemes();

  return (
    <div className="space-y-3">
      <Label>主题</Label>
      <p className="text-xs text-muted-foreground">
        点击选择主题并立即应用。当前模式：{resolvedMode === "dark" ? "深色" : "浅色"}。
      </p>
      <div className="grid grid-cols-2 gap-2">
        {themes.map((t) => {
          const variant = t.variants[resolvedMode] ?? t.variants.dark ?? t.variants.light;
          const c: ThemeColors | undefined = variant?.colors;
          const swatchBg = c?.background ?? "var(--background)";
          const swatchFg = c?.foreground ?? "var(--foreground)";
          const swatchAccent = c?.primary ?? c?.accent ?? "var(--primary)";
          const swatchMuted = c?.muted ?? "var(--muted)";
          const selected = themeId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setThemeId(t.id)}
              className={cn(
                "group flex items-center gap-3 rounded-lg border p-2.5 text-left transition-all",
                selected
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div
                className="flex h-9 w-12 shrink-0 items-center gap-1 rounded-md border border-border/40"
                style={{ background: swatchBg }}
              >
                <span className="h-6 w-0 flex-1 rounded-sm" style={{ background: swatchAccent }} />
                <span className="h-6 w-0 flex-1 rounded-sm" style={{ background: swatchFg, opacity: 0.7 }} />
                <span className="h-6 w-0 flex-1 rounded-sm" style={{ background: swatchMuted }} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[12.5px] font-medium">{t.name}</span>
                {t.description ? (
                  <span className="truncate text-[11px] text-muted-foreground">{t.description}</span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AboutSection() {
  const [version, setVersion] = useState("");
  const [commit, setCommit] = useState("…");
  const [buildTime, setBuildTime] = useState("…");

  useEffect(() => {
    GetInfo()
      .then((info) => {
        setVersion(info.version);
        setCommit(info.commit);
        setBuildTime(info.buildTime);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/60 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-extrabold text-primary-foreground">
          C
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-[15px] font-semibold tracking-tight">初中化学 · 教学助手</span>
          <span className="text-[11px] text-muted-foreground">
            基于 Wails3 的初中化学交互教学资源平台
          </span>
          <span className="mt-0.5 font-mono text-[11px] text-muted-foreground">
            v{version || "—"}
          </span>
        </div>
      </div>

      <Separator />

      <section className="space-y-3">
        <Label>构建信息</Label>
        <dl className="grid grid-cols-[110px_1fr] gap-y-2.5 text-[12.5px]">
          <dt className="text-muted-foreground">版本</dt>
          <dd className="font-mono">{version}</dd>
          <dt className="text-muted-foreground">提交</dt>
          <dd className="truncate font-mono text-[11.5px]">{commit}</dd>
          <dt className="text-muted-foreground">构建时间</dt>
          <dd className="font-mono text-[11.5px]">{buildTime}</dd>
        </dl>
      </section>

      <Separator />

      <section className="space-y-3">
        <Label>数据来源</Label>
        <ul className="space-y-2 text-[12.5px] leading-relaxed text-muted-foreground">
          <li>· 实验仪器、试剂、分子、反应数据整理自 2024 人教版九年级化学全上下册。</li>
          <li>· 元素周期表信息参考 IUPAC 标准原子量与 PubChem 开放化学数据库。</li>
          <li>· 教学目标依据《义务教育化学课程标准（2022 年版）》。</li>
          <li>· 3D 模型与动画为教学示意，不用于精确量取。</li>
        </ul>
      </section>

      <Separator />

      <section className="space-y-3">
        <Label>技术栈</Label>
        <ul className="space-y-2 text-[12.5px] leading-relaxed text-muted-foreground">
          <li>· Wails3 (Go) + React 18 + TypeScript + Vite + Tailwind CSS v4</li>
          <li>· three.js 3D 渲染（WebGL，可降级为静态示意）</li>
          <li>· shadcn/ui 组件库 · zustand 状态管理 · 15 套内置主题</li>
        </ul>
      </section>
    </div>
  );
}
