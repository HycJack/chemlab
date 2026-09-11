import { useState } from "react";
import { FlaskConical, TestTubes, Orbit, Flame, BookOpen, ShieldCheck, ArrowRight } from "lucide-react";
import { MODULE_COUNTS } from "@/modules/data";

export interface TeacherInfo {
  name: string;
  unit: string;
}

const STATS = [
  { value: MODULE_COUNTS.instruments, unit: "件", label: "仪器", icon: FlaskConical, color: "#3b82f6" },
  { value: MODULE_COUNTS.reagents, unit: "种", label: "试剂", icon: TestTubes, color: "#10b981" },
  { value: MODULE_COUNTS.molecules, unit: "种", label: "分子", icon: Orbit, color: "#8b5cf6" },
  { value: MODULE_COUNTS.reactions, unit: "个", label: "反应", icon: Flame, color: "#ef4444" },
];

export function loadTeacherInfo(): TeacherInfo | null {
  try {
    const raw = localStorage.getItem("chemlab-teacher");
    return raw ? (JSON.parse(raw) as TeacherInfo) : null;
  } catch {
    return null;
  }
}

export function saveTeacherInfo(info: TeacherInfo): void {
  try {
    localStorage.setItem("chemlab-teacher", JSON.stringify(info));
  } catch {
    /* ignore */
  }
}

export default function WelcomePage({ onEnter }: { onEnter: (info: TeacherInfo) => void }) {
  const [unit, setUnit] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("请输入真实姓名");
      return;
    }
    const info = { name: name.trim(), unit: unit.trim() };
    saveTeacherInfo(info);
    onEnter(info);
  };

  return (
    <div className="app-drag relative flex h-full flex-col overflow-y-auto">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(900px 420px at 12% -8%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 60%), radial-gradient(700px 380px at 96% 12%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 60%)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-10 pb-6 pt-12">
        {/* 品牌 */}
        <div className="app-no-drag flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-[15px] font-extrabold text-primary-foreground shadow-lg shadow-primary/20">
            C
          </div>
          <div>
            <div className="text-[17px] font-bold leading-tight">初中化学 · 教学助手</div>
            <div className="text-[11px] tracking-wide text-muted-foreground">
              PEP 九年级化学 · 交互教学资源
            </div>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[1.15fr_1fr] items-center gap-10 py-8">
          {/* 左侧宣传 */}
          <div className="app-no-drag">
            <h1 className="text-[34px] font-extrabold leading-[1.2] tracking-tight">
              把实验装置、物质状态、
              <br />
              分子结构与反应现象
              <br />
              放进一个{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                课堂工作台
              </span>
            </h1>
            <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
              可以转动、缩放和检索的 3D 教学资源：实验仪器、试剂、分子结构、原子周期表与化学反应的交互演示。
            </p>

            <div className="mt-7 grid max-w-md grid-cols-4 gap-3">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border/60 bg-card/60 p-3 text-center backdrop-blur"
                >
                  <s.icon className="mx-auto h-4 w-4" style={{ color: s.color }} />
                  <div className="mt-1.5 text-[19px] font-extrabold tabular-nums">
                    {s.value}
                  </div>
                  <div className="text-[10.5px] text-muted-foreground">
                    {s.unit} {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-start gap-2.5 rounded-xl border border-border/50 bg-card/40 p-3.5 text-[11.5px] leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
              <span>
                数据依据：2024 人教版九年级化学全上下册 · 义务教育化学课程标准（2022 年版）。
                教师登录信息仅保存在本机，不上传任何信息。
              </span>
            </div>
          </div>

          {/* 登录卡片 */}
          <div className="app-no-drag mx-auto w-full max-w-sm">
            <form
              onSubmit={submit}
              className="overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-2xl shadow-black/10 backdrop-blur"
            >
              <div className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-[12px] font-extrabold text-primary-foreground">
                    C
                  </div>
                  <div>
                    <div className="text-[15px] font-bold">ChemLab</div>
                    <div className="text-[10.5px] text-muted-foreground">教师登录</div>
                  </div>
                </div>
                <p className="mt-2.5 text-[11px] text-muted-foreground">
                  仅用于本机显示和教学记录，不上传任何信息。
                </p>
              </div>

              <div className="space-y-4 px-6 py-6">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
                    工作单位
                  </span>
                  <input
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="请输入学校或工作单位"
                    className="h-10 w-full rounded-xl border border-input/80 bg-background/60 px-3.5 text-[13px] outline-none transition-all placeholder:text-muted-foreground/50 focus:border-ring focus:ring-2 focus:ring-ring/25"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
                    真实姓名
                  </span>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="请输入真实姓名"
                    className="h-10 w-full rounded-xl border border-input/80 bg-background/60 px-3.5 text-[13px] outline-none transition-all placeholder:text-muted-foreground/50 focus:border-ring focus:ring-2 focus:ring-ring/25"
                  />
                </label>
                {error && <p className="text-[11.5px] text-destructive">{error}</p>}
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[13.5px] font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-92 active:scale-[0.99]"
                >
                  进入教学助手
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="border-t border-border/40 bg-muted/30 px-6 py-3.5 text-[10.5px] leading-relaxed text-muted-foreground/80">
                数据隐私：用户附件、2024 人教版九年级化学全上下册、义务教育化学课程标准（2022 年版）。
              </div>
            </form>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/70">
              <BookOpen className="h-3.5 w-3.5" />
              公众号 · 宏化学
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
