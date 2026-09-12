import { useMemo, useState } from "react";
import { FlaskConical } from "lucide-react";
import { INSTRUMENTS, INSTRUMENT_CATEGORIES, type Instrument } from "@/modules/data";
import { ThreeViewport } from "@/modules/three/ThreeViewport";
import { buildInstrument } from "@/modules/three/buildInstrument";
import {
  CatalogLayout,
  listItemClass,
  TagChip,
  DetailSection,
  BulletList,
} from "@/components/catalog";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

const CATEGORY_COLOR: Record<string, string> = {
  反应容器: "#3b82f6",
  加热仪器: "#ef4444",
  计量仪器: "#8b5cf6",
  夹持工具: "#f59e0b",
  其他: "#10b981",
};

function match(i: Instrument, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return (
    i.name.includes(q) ||
    i.spec.toLowerCase().includes(s) ||
    i.material.includes(q) ||
    i.short.includes(q) ||
    i.experiments.some((e) => e.includes(q)) ||
    i.textbook.includes(q)
  );
}

export default function InstrumentsPage({ query }: { query: string }) {
  const [selectedId, setSelectedId] = useState(INSTRUMENTS[0].id);
  const [category, setCategory] = useState<string>("全部");

  const filtered = useMemo(() => {
    return INSTRUMENTS.filter(
      (i) => (category === "全部" || i.category === category) && match(i, query)
    );
  }, [category, query]);

  const selected =
    filtered.find((i) => i.id === selectedId) ??
    INSTRUMENTS.find((i) => i.id === selectedId) ??
    filtered[0] ??
    INSTRUMENTS[0];

  const listHeader = (
    <div className="shrink-0 space-y-2 px-3 pb-3 pt-1">
      <div className="flex flex-wrap gap-1.5">
        {["全部", ...INSTRUMENT_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11.5px] transition-colors",
              category === c
                ? "border-primary/50 bg-primary/12 text-primary"
                : "border-border/70 text-muted-foreground hover:bg-secondary"
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="text-[11px] text-muted-foreground">
        {filtered.length} 件仪器
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        crumb="实验仪器"
        title="实验仪器"
        english="CATALOG"
        subtitle="初中化学常用实验仪器目录：选择左侧仪器，右侧查看可旋转、缩放的 3D 模型与规格说明。"
      />
      <div className="min-h-0 flex-1">
        <CatalogLayout listHeader={listHeader} right={<InstrumentDetail instrument={selected} />}>
          {filtered.length === 0 ? (
            <EmptyList />
          ) : (
            filtered.map((i) => (
              <button
                key={i.id}
                onClick={() => setSelectedId(i.id)}
                className={cn(listItemClass(i.id === selected.id), "mb-1")}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[13.5px] font-medium">{i.name}</span>
                  <span
                    className="shrink-0 rounded px-1.5 py-px text-[10px]"
                    style={{ color: CATEGORY_COLOR[i.category], background: `${CATEGORY_COLOR[i.category]}1f` }}
                  >
                    {i.category}
                  </span>
                </span>
                <span className="line-clamp-2 text-[11.5px] leading-snug text-muted-foreground">
                  {i.short}
                </span>
              </button>
            ))
          )}
        </CatalogLayout>
      </div>
    </div>
  );
}

function EmptyList() {
  return (
    <div className="px-3 py-10 text-center text-[12px] text-muted-foreground">
      没有匹配的仪器，试试其他关键词。
    </div>
  );
}

function InstrumentDetail({ instrument }: { instrument: Instrument }) {
  return (
    <div className="space-y-4 p-1 pl-5">
      <div className="grid grid-cols-[1fr_300px] gap-4">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/70 to-muted/30 p-1">
            <div className="relative h-[300px] overflow-hidden rounded-xl">
              <ThreeViewport
                key={instrument.id}
                className="h-full w-full"
                cameraPos={[2.6, 1.8, 3.2]}
                build={({ group }) => {
                  group.add(buildInstrument(instrument.shape));
                }}
                autoRotate
              />
              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
                <TagChip color="#3b82f6">3D INSTRUMENT</TagChip>
              </div>
              <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-background/70 px-2 py-1 text-[10.5px] text-muted-foreground backdrop-blur">
                按住鼠标左键旋转 · 滚轮缩放
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailSection index="01" title="仪器名称与规格">
              <div className="text-[14px] font-semibold text-foreground">{instrument.name}</div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-secondary/70 px-2 py-0.5 text-[11.5px]">{instrument.spec}</span>
                <span className="rounded-md bg-secondary/70 px-2 py-0.5 text-[11.5px]">{instrument.material}</span>
              </div>
              <p>{instrument.short}</p>
            </DetailSection>

            <DetailSection index="✓" title="安全使用注意事项">
              <BulletList items={instrument.safety} />
            </DetailSection>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailSection index="02" title="涉及实验">
              <BulletList items={instrument.experiments} />
            </DetailSection>
            <DetailSection index="03" title="教材出处">
              <div className="flex gap-2">
                <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                <span>{instrument.textbook}</span>
              </div>
            </DetailSection>
          </div>
        </div>
      </div>
    </div>
  );
}
