import { useMemo, useState } from "react";
import { FlaskConical, Play } from "lucide-react";
import {
  REACTIONS,
  REACTION_CATEGORIES,
  type Reaction,
  type ReactionCategory,
} from "@/modules/data";
import { ReactionAnimationView } from "@/modules/three/ReactionAnimationView";
import {
  CatalogLayout,
  listItemClass,
  TagChip,
  DetailSection,
  BulletList,
} from "@/components/catalog";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

function match(r: Reaction, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return (
    r.name.includes(q) ||
    r.equation.toLowerCase().includes(s) ||
    r.condition.includes(q) ||
    r.phenomena.some((p) => p.includes(q)) ||
    r.reagents.some((x) => x.includes(q)) ||
    r.textbook.includes(q)
  );
}

export default function ReactionsPage({ query }: { query: string }) {
  const [category, setCategory] = useState<ReactionCategory | "全部">("化合反应");
  const [selectedId, setSelectedId] = useState<string>(REACTIONS[0].id);

  const filtered = useMemo(
    () =>
      REACTIONS.filter(
        (r) => (category === "全部" || r.category === category) && match(r, query)
      ),
    [category, query]
  );

  const all = useMemo(() => REACTIONS.filter((r) => match(r, query)), [query]);
  const selected =
    all.find((r) => r.id === selectedId) ?? filtered[0] ?? all[0] ?? REACTIONS[0];
  const effective = filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? selected;

  const countBy = useMemo(() => {
    const m: Record<string, number> = { 全部: all.length };
    for (const c of REACTION_CATEGORIES) {
      m[c] = REACTIONS.filter((r) => r.category === c && match(r, query)).length;
    }
    return m;
  }, [query, all.length]);

  const listHeader = (
    <div className="shrink-0 space-y-2 px-3 pb-3 pt-1">
      <div className="flex flex-wrap gap-1.5">
        {(["全部", ...REACTION_CATEGORIES] as (ReactionCategory | "全部")[]).map((c) => (
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
            {c} <span className="opacity-70">{countBy[c]}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        crumb="化学反应"
        title="化学反应"
        english="REACTIONS"
        subtitle="初中化学核心反应：按化合、分解、置换、复分解与其他重要反应分类，附实验现象、步骤与装置示意动画。"
      />
      <div className="min-h-0 flex-1">
        <CatalogLayout
          listHeader={listHeader}
          right={<ReactionDetail reaction={effective} />}
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-10 text-center text-[12px] text-muted-foreground">
              没有匹配的反应，试试其他关键词。
            </div>
          ) : (
            filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={cn(listItemClass(r.id === effective.id), "mb-1")}
              >
                <span className="text-[13.5px] font-medium">{r.name}</span>
                <span className="mt-0.5 font-mono text-[12px] text-primary">{r.equation}</span>
                <span className="mt-0.5 text-[11px] text-muted-foreground">
                  {r.condition}
                </span>
              </button>
            ))
          )}
        </CatalogLayout>
      </div>
    </div>
  );
}

function ReactionDetail({ reaction }: { reaction: Reaction }) {
  return (
    <div className="space-y-4 p-1 pl-5">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/70 to-muted/30 p-1">
        <div className="relative h-[330px] overflow-hidden rounded-xl">
          <ReactionAnimationView kind={reaction.animation} color={reaction.color} label={reaction.equation} />
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
            <TagChip color="#ef4444">ANIMATED REACTION</TagChip>
          </div>
          <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-background/70 px-2 py-1 text-[10.5px] text-muted-foreground backdrop-blur">
            <Play className="h-3 w-3" />
            装置示意动画
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/50 p-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[17px] font-bold">{reaction.name}</h3>
          <span className="font-mono text-[14px] text-primary">{reaction.equation}</span>
          <span className="rounded-md bg-secondary/70 px-2 py-0.5 text-[11.5px] text-muted-foreground">
            {reaction.condition}
          </span>
          <span className="rounded-md bg-primary/12 px-2 py-0.5 text-[11.5px] font-medium text-primary">
            {reaction.type}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DetailSection index="01" title="实验现象">
          <BulletList items={reaction.phenomena} />
        </DetailSection>
        <DetailSection index="02" title="所需试剂">
          <BulletList items={reaction.reagents} />
        </DetailSection>
      </div>

      <DetailSection index="03" title="实验步骤">
        <ol className="space-y-1.5">
          {reaction.steps.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-[10.5px] font-bold text-primary">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </DetailSection>

      <div className="grid grid-cols-2 gap-4">
        <DetailSection index="04" title="装置要点">
          <div className="flex gap-2">
            <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
            <span>{reaction.apparatus}</span>
          </div>
        </DetailSection>
        <DetailSection index="05" title="教材出处">
          <span>{reaction.textbook}</span>
        </DetailSection>
      </div>
    </div>
  );
}
