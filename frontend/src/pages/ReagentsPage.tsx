import { useMemo, useState } from "react";
import { Box, Droplets, Wind } from "lucide-react";
import { REAGENTS, type Reagent } from "@/modules/data";
import { ThreeViewport } from "@/modules/three/ThreeViewport";
import { buildReagentScene } from "@/modules/three/buildReagent";
import {
  CatalogLayout,
  listItemClass,
  TagChip,
  DetailSection,
  BulletList,
} from "@/components/catalog";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

type ViewState = "气" | "液" | "固";

const STATE_META: { id: ViewState; label: string; icon: typeof Wind }[] = [
  { id: "气", label: "气态", icon: Wind },
  { id: "液", label: "液态", icon: Droplets },
  { id: "固", label: "固态", icon: Box },
];

function match(r: Reagent, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return (
    r.name.includes(q) ||
    r.formula.toLowerCase().includes(s) ||
    r.appearance.includes(q) ||
    r.chemical.some((c) => c.includes(q)) ||
    r.experiments.some((e) => e.includes(q)) ||
    r.textbook.includes(q)
  );
}

export default function ReagentsPage({ query }: { query: string }) {
  const [selectedId, setSelectedId] = useState(REAGENTS[0].id);
  const [viewState, setViewState] = useState<ViewState>("气");

  const filtered = useMemo(() => REAGENTS.filter((r) => match(r, query)), [query]);
  const selected = REAGENTS.find((r) => r.id === selectedId) ?? filtered[0] ?? REAGENTS[0];

  // 当搜索选中项被过滤掉时，自动跟随第一个结果
  const effective = filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? selected;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        crumb="实验试剂"
        title="实验试剂"
        english="CATALOG"
        subtitle="初中化学常见试剂目录：气、液、固三态展示，包含物理性质、化学性质与保存注意事项。"
      />
      <div className="min-h-0 flex-1">
        <CatalogLayout
          listHeader={
            <div className="shrink-0 px-3 pb-3 pt-1 text-[11px] text-muted-foreground">
              {filtered.length} 种试剂
            </div>
          }
          right={
            <ReagentDetail
              reagent={effective}
              viewState={viewState}
              onViewState={setViewState}
            />
          }
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-10 text-center text-[12px] text-muted-foreground">
              没有匹配的试剂，试试其他关键词。
            </div>
          ) : (
            filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={cn(listItemClass(r.id === effective.id), "mb-1")}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[13.5px] font-medium">{r.name}</span>
                  <span className="shrink-0 rounded-md bg-secondary/80 px-1.5 py-px font-mono text-[11px] text-primary">
                    {r.formula}
                  </span>
                </span>
                <span className="line-clamp-1 text-[11.5px] text-muted-foreground">{r.appearance}</span>
              </button>
            ))
          )}
        </CatalogLayout>
      </div>
    </div>
  );
}

function ReagentDetail({
  reagent,
  viewState,
  onViewState,
}: {
  reagent: Reagent;
  viewState: ViewState;
  onViewState: (s: ViewState) => void;
}) {
  return (
    <div className="space-y-4 p-1 pl-5">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/70 to-muted/30 p-1">
        <div className="relative h-[290px] overflow-hidden rounded-xl">
          <ThreeViewport
            key={viewState}
            className="h-full w-full"
            cameraPos={[2.8, 1.9, 3.4]}
            build={({ group }) => {
              group.add(buildReagentScene(reagent, viewState).group);
            }}
          />
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
            <TagChip color="#10b981">REALISTIC STATE</TagChip>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-1.5 rounded-lg bg-background/75 p-1 backdrop-blur">
            {STATE_META.map((s) => (
              <button
                key={s.id}
                onClick={() => onViewState(s.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] font-medium transition-colors",
                  viewState === s.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/50 p-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[17px] font-bold">{reagent.name}</h3>
          <span className="font-mono text-[13px] text-primary">{reagent.formula}</span>
          <span className="rounded-md bg-secondary/70 px-2 py-0.5 text-[11.5px] text-muted-foreground">
            状态：{reagent.state}
          </span>
          <span className="text-[12.5px] text-muted-foreground">{reagent.appearance}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DetailSection index="01" title="物理性质">
          <BulletList items={reagent.physical} />
        </DetailSection>
        <DetailSection index="02" title="化学性质">
          <BulletList items={reagent.chemical} />
        </DetailSection>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DetailSection index="03" title="用途">
          <BulletList items={reagent.use} />
        </DetailSection>
        <DetailSection index="04" title="保存与注意事项">
          <BulletList items={reagent.caution} />
        </DetailSection>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DetailSection index="05" title="涉及实验与课时">
          <BulletList items={reagent.experiments} />
        </DetailSection>
        <DetailSection index="06" title="教材出处">
          <span>{reagent.textbook}</span>
        </DetailSection>
      </div>
    </div>
  );
}
