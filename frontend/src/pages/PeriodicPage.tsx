import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import {
  ELEMENTS,
  CATEGORIES,
  gridPosition,
  formatConfig,
  type ElementData,
  type ElementCategoryId,
} from "@/modules/data";
import { ThreeViewport } from "@/modules/three/ThreeViewport";
import { buildAtomScene } from "@/modules/three/buildAtom";
import { PageHeader } from "@/components/PageHeader";
import { TagChip, DetailSection } from "@/components/catalog";
import { cn } from "@/lib/utils";

const CAT_EN = {
  alkali: "Alkali metal",
  alkaline: "Alkaline earth metal",
  transition: "Transition metal",
  lanthanide: "Lanthanide",
  actinide: "Actinide",
  post: "Post-transition metal",
  metalloid: "Metalloid",
  nonmetal: "Nonmetal",
  halogen: "Halogen",
  noble: "Noble gas",
} as const;

const STATE_EN: Record<string, string> = { 气: "Gas", 液: "Liquid", 固: "Solid" };

function matchQuery(e: ElementData, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return false;
  return (
    e.sym.toLowerCase() === s ||
    e.name.includes(q) ||
    String(e.n) === s ||
    e.sym.toLowerCase().includes(s) ||
    e.name.includes(q)
  );
}

export default function PeriodicPage({
  query,
  onOpenElement,
}: {
  query: string;
  onOpenElement?: (e: ElementData) => void;
}) {
  const [selected, setSelected] = useState<ElementData | null>(null);
  const matches = useMemo(
    () => (query.trim() ? ELEMENTS.filter((e) => matchQuery(e, query)) : []),
    [query]
  );

  // 回车（或唯一匹配）自动打开
  useEffect(() => {
    if (query.trim() && matches.length === 1) {
      setSelected(matches[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const open = (e: ElementData) => {
    setSelected(e);
    onOpenElement?.(e);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        crumb="原子和离子"
        title="原子和离子"
        english="PERIODIC TABLE"
        subtitle="元素周期表：点击元素查看原子结构（质子、中子、电子与核外电子排布）的 3D 模型。"
      />
      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        {selected ? (
          <AtomDetail element={selected} onBack={() => setSelected(null)} />
        ) : (
          <TableGrid query={query} onOpen={open} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 周期表网格
// ---------------------------------------------------------------------------

function TableGrid({ query, onOpen }: { query: string; onOpen: (e: ElementData) => void }) {
  const q = query.trim().toLowerCase();
  const matchIds = new Set(
    q ? ELEMENTS.filter((e) => matchQuery(e, q)).map((e) => e.n) : []
  );
  const showOnlyMatch = q.length > 0;

  // 建立 10 行 × 19 列（0 列占位，1..18 使用）
  const cells: (ElementData | { n: number; label: string } | null)[][] = Array.from(
    { length: 10 },
    () => new Array(19).fill(null)
  );
  for (const e of ELEMENTS) {
    const { row, col } = gridPosition(e);
    if (row <= 7) cells[row][col] = e;
    else cells[row][col] = e; // 镧系/锕系行
  }
  // 主表 group3 占位
  cells[6][3] = { n: 57, label: "57–71" };
  cells[7][3] = { n: 89, label: "89–103" };

  const legend = Object.entries(CATEGORIES) as [ElementCategoryId, { label: string; color: string }][];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-[3px]">
        {Array.from({ length: 9 }, (_, r) => r + 1).map((row) =>
          Array.from({ length: 18 }, (_, c) => c + 1).map((col) => {
            const cell = cells[row]?.[col];
            if (!cell) return <div key={`${row}-${col}`} className="h-9 sm:h-11" />;
            if ("label" in cell) {
              return (
                <button
                  key={`${row}-${col}`}
                  onClick={() => {
                    const target = ELEMENTS.find((e) => e.n === cell.n)!;
                    onOpen(target);
                  }}
                  className="flex h-9 flex-col items-center justify-center rounded-[4px] border border-dashed border-border/70 text-[9px] leading-tight text-muted-foreground transition-colors hover:bg-secondary sm:h-11"
                >
                  <span className="font-semibold">{cell.label}</span>
                  <span className="hidden sm:block opacity-70">La–Lu</span>
                </button>
              );
            }
            const e = cell as ElementData;
            const cat = CATEGORIES[e.cat];
            const matched = matchIds.has(e.n);
            const dim = showOnlyMatch && !matched;
            return (
              <button
                key={e.n}
                onClick={() => onOpen(e)}
                title={`${e.name} (${e.sym}) 原子序数 ${e.n}`}
                className={cn(
                  "group relative flex h-9 flex-col items-center justify-center overflow-hidden rounded-[4px] transition-all sm:h-11",
                  matched && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                  dim && "opacity-20 hover:opacity-60"
                )}
                style={{ background: cat.color }}
              >
                <span className="absolute left-1 top-0.5 text-[7px] leading-none opacity-70 sm:text-[8px]">
                  {e.n}
                </span>
                <span className="text-[11px] font-bold leading-none text-[#1c1e2e] sm:text-[13px]">
                  {e.sym}
                </span>
                <span className="hidden text-[8px] leading-none text-[#1c1e2e]/80 sm:block">
                  {e.name}
                </span>
              </button>
            );
          })
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {legend.map(([id, c]) => (
          <span key={id} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
            {c.label}
          </span>
        ))}
        {q && (
          <span className="rounded-md bg-primary/12 px-2 py-0.5 text-[11px] text-primary">
            匹配 {matchIds.size} 个元素
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 原子结构详情
// ---------------------------------------------------------------------------

function AtomDetail({ element, onBack }: { element: ElementData; onBack: () => void }) {
  const neutrons = Math.max(Math.round(element.mass) - element.n, 0);
  const configText = formatConfig(element.config);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-border/60"
            style={{ background: CATEGORIES[element.cat].color }}
          >
            <span className="text-[20px] font-extrabold leading-none text-[#1c1e2e]">
              {element.sym}
            </span>
            <span className="text-[9px] text-[#1c1e2e]/70">{element.n}</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-[22px] font-bold">{element.name}</h2>
              <span className="font-mono text-[13px] text-primary">
                {element.sym} · {element.n}
              </span>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-muted-foreground">
              <span>相对原子质量 {element.mass}</span>
              <span>·</span>
              <span>{CATEGORIES[element.cat].label}</span>
              <span>·</span>
              <span>
                标准状态 {element.state}（{STATE_EN[element.state]}）
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onBack}
          className="app-no-drag flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          title="返回周期表"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-4">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/70 to-muted/30 p-1">
            <div className="relative h-[300px] overflow-hidden rounded-xl">
              <ThreeViewport
                className="h-full w-full"
                cameraPos={[3.6, 2.2, 3.8]}
                build={({ group }) => {
                  group.add(buildAtomScene(element).group);
                }}
              />
              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
                <TagChip color="#3b82f6">ATOMIC STRUCTURE</TagChip>
              </div>
              <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-background/70 px-2 py-1 text-[10.5px] text-muted-foreground backdrop-blur">
                蓝色电子高速运动；红色质子与灰蓝色中子位于原子核。可拖动、缩放
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <NeutralStat label="质子" value={element.n} color="#e5484d" />
            <NeutralStat label="中子" value={neutrons} color="#7d8fb3" />
            <NeutralStat label="电子" value={element.shells.reduce((a, b) => a + b, 0)} color="#3b82f6" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailSection index="01" title="核外电子分布">
              <div className="flex flex-wrap gap-1 pt-1">
                {element.shells.map((c, i) => (
                  <span key={i} className="rounded-md bg-secondary/70 px-2 py-0.5 text-[11.5px]">
                    第 {i + 1} 层：<span className="font-bold text-foreground">{c}</span>
                  </span>
                ))}
              </div>
              <p className="text-[11.5px]">
                由内向外各电子层电子数之和等于核电荷数（{element.shells.reduce((a, b) => a + b, 0)} 个电子）。
              </p>
            </DetailSection>
            <DetailSection index="02" title="电子排布">
              <p className="font-mono text-[13px] text-foreground">
                <ElectronConfig text={configText} />
              </p>
              <p className="text-[11.5px]">
                中子数按相对原子质量取整后估算，同位素的中子数可以不同。
              </p>
            </DetailSection>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailSection index="03" title="常见简单离子">
              <p>{element.ion}</p>
              {element.ion === "—" && (
                <p className="text-[11.5px] text-muted-foreground/70">
                  教材范围内没有常用的简单离子；不把“氧化”直接等同于自由简单离子。
                </p>
              )}
            </DetailSection>
            <DetailSection index="04" title="常见氧化态">
              <p>{element.oxidation}</p>
              <p className="text-[11.5px]">
                氧化态参考 PubChem 数据，用于辅助判断；当化合物为离子化合物时对应其常见离子。
              </p>
            </DetailSection>
          </div>
        </div>

        <div className="space-y-4">
          <DetailSection index="05" title="元素说明">
            <p className="text-[12.5px] leading-relaxed">{element.desc}</p>
          </DetailSection>
          <DetailSection index="06" title="教材出处">
            <p className="text-[12.5px] leading-relaxed">{element.textbook}</p>
          </DetailSection>
          <div className="rounded-xl border border-border/60 bg-card/50 p-4">
            <h3 className="mb-2 text-[13.5px] font-semibold">周期表位置</h3>
            <div className="grid grid-cols-2 gap-2 text-[12px] text-muted-foreground">
              <div className="rounded-lg bg-secondary/60 px-3 py-2">
                <div className="text-[10.5px] text-muted-foreground/70">周期</div>
                <div className="text-[15px] font-bold text-foreground">{element.period}</div>
              </div>
              <div className="rounded-lg bg-secondary/60 px-3 py-2">
                <div className="text-[10.5px] text-muted-foreground/70">族</div>
                <div className="text-[15px] font-bold text-foreground">{element.group}</div>
              </div>
              <div className="col-span-2 rounded-lg bg-secondary/60 px-3 py-2">
                <div className="text-[10.5px] text-muted-foreground/70">英文类别</div>
                <div className="text-[13px] font-medium text-foreground">{CAT_EN[element.cat]}</div>
              </div>
            </div>
          </div>
          <button
            onClick={onBack}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-border/60 text-[12.5px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            返回元素周期表
          </button>
        </div>
      </div>
    </div>
  );
}

function NeutralStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-3 text-center">
      <div className="flex items-center justify-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        <span className="text-[11.5px] text-muted-foreground">中性原子 · {label}</span>
      </div>
      <div className="mt-1 text-[22px] font-extrabold tabular-nums">{value}</div>
    </div>
  );
}

/** 把 [Ar] 3d² 4s² 中的上标转为 <sup> */
function ElectronConfig({ text }: { text: string }) {
  const parts = text.split(/([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/.test(p) ? (
          <sup key={i}>{p}</sup>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
