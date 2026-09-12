import { useMemo, useRef, useState } from "react";
import { Orbit } from "lucide-react";
import { MOLECULES, type Molecule } from "@/modules/data";
import { ThreeViewport } from "@/modules/three/ThreeViewport";
import { buildMoleculeScene } from "@/modules/three/buildMolecule";
import {
  CatalogLayout,
  listItemClass,
  TagChip,
  DetailSection,
} from "@/components/catalog";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

type Motion = "gas" | "liquid" | "solid";

const MOTION_META: { id: Motion; label: string; desc: string }[] = [
  { id: "gas", label: "气态", desc: "分子间隔大，运动速度快" },
  { id: "liquid", label: "液态", desc: "分子间隔较小，无规则运动" },
  { id: "solid", label: "固态", desc: "分子有序排列，仅在平衡位置振动" },
];

function match(m: Molecule, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return (
    m.name.includes(q) ||
    m.formula.toLowerCase().includes(s) ||
    m.shape.includes(q) ||
    m.desc.includes(q) ||
    m.textbook.includes(q)
  );
}

export default function MoleculesPage({ query }: { query: string }) {
  const [selectedId, setSelectedId] = useState(MOLECULES[0].id);
  const [motion, setMotion] = useState<Motion>("gas");

  const filtered = useMemo(() => MOLECULES.filter((m) => match(m, query)), [query]);
  const selected = MOLECULES.find((m) => m.id === selectedId) ?? filtered[0] ?? MOLECULES[0];
  const effective = filtered.find((m) => m.id === selectedId) ?? filtered[0] ?? selected;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        crumb="分子结构式"
        title="分子结构式"
        english="MOLECULAR MODEL"
        subtitle="初中常见分子的空间构型与化学键：切换三态观察微观粒子运动差异。"
      />
      <div className="min-h-0 flex-1">
        <CatalogLayout
          listHeader={
            <div className="shrink-0 px-3 pb-3 pt-1 text-[11px] text-muted-foreground">
              {filtered.length} 种分子
            </div>
          }
          right={
            <MoleculeDetail molecule={effective} motion={motion} onMotion={setMotion} />
          }
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-10 text-center text-[12px] text-muted-foreground">
              没有匹配的分子，试试其他关键词。
            </div>
          ) : (
            filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={cn(listItemClass(m.id === effective.id), "mb-1")}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[13.5px] font-medium">{m.name}</span>
                  <span className="shrink-0 rounded-md bg-secondary/80 px-1.5 py-px font-mono text-[11px] text-primary">
                    {m.formula}
                  </span>
                </span>
                <span className="line-clamp-1 text-[11.5px] text-muted-foreground">
                  {m.shape}
                  {m.angle ? ` · ${m.angle}` : ""}
                </span>
              </button>
            ))
          )}
        </CatalogLayout>
      </div>
    </div>
  );
}

function MoleculeDetail({
  molecule,
  motion,
  onMotion,
}: {
  molecule: Molecule;
  motion: Motion;
  onMotion: (m: Motion) => void;
}) {
  // buildMoleculeScene 的三态振动动画：viewport 每帧回调时驱动。
  const animatorRef = useRef<((t: number, dt: number) => void) | null>(null);
  return (
    <div className="space-y-4 p-1 pl-5">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/70 to-muted/30 p-1">
        <div className="relative h-[300px] overflow-hidden rounded-xl">
          <ThreeViewport
            key={`${molecule.id}-${motion}`}
            className="h-full w-full"
            cameraPos={[3.4, 2.0, 3.6]}
            build={({ group }) => {
              const s = buildMoleculeScene(molecule, motion);
              group.add(s.group);
              animatorRef.current = s.animate;
            }}
            animate={(_, t, dt) => animatorRef.current?.(t, dt)}
            autoRotate={motion === "gas"}
          />
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
            <TagChip color="#8b5cf6">MOLECULAR MODEL</TagChip>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-1.5 rounded-lg bg-background/75 p-1 backdrop-blur">
            {MOTION_META.map((s) => (
              <button
                key={s.id}
                onClick={() => onMotion(s.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] font-medium transition-colors",
                  motion === s.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <Orbit className="h-3.5 w-3.5" />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/50 p-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[17px] font-bold">{molecule.name}</h3>
          <span className="font-mono text-[13px] text-primary">{molecule.formula}</span>
          <span className="rounded-md bg-secondary/70 px-2 py-0.5 text-[11.5px] text-muted-foreground">
            {molecule.shape}
          </span>
          {molecule.angle && (
            <span className="text-[12.5px] text-muted-foreground">{molecule.angle}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DetailSection index="01" title="原子组成与化学键">
          <p>{molecule.desc}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {molecule.atoms
              .map((a) => a.el)
              .filter((el, i, arr) => arr.indexOf(el) === i)
              .map((el) => (
                <span
                  key={el}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border/70 px-2 py-0.5 text-[11px]"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: getAtomColor(el) }}
                  />
                  {el}
                </span>
              ))}
          </div>
        </DetailSection>
        <DetailSection index="02" title="三态微观动画">
          <ul className="space-y-2">
            {MOTION_META.map((s) => (
              <li key={s.id} className="flex gap-2 text-[12.5px]">
                <span
                  className={cn(
                    "shrink-0 rounded px-1.5 py-px text-[11px] font-medium",
                    motion === s.id ? "bg-primary/15 text-primary" : "bg-secondary/70 text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
                <span>{s.desc}</span>
              </li>
            ))}
          </ul>
        </DetailSection>
      </div>

      <DetailSection index="03" title="教材出处">
        <span>{molecule.textbook}</span>
      </DetailSection>
    </div>
  );
}

function getAtomColor(el: string): string {
  const map: Record<string, string> = {
    H: "#ffffff", C: "#2f2f2f", N: "#2b6ae0", O: "#e03131", F: "#5fd35f",
    Cl: "#2ddb3a", Br: "#9b4d96", I: "#7d4fd8", S: "#f2d648", P: "#ff9f43",
  };
  return map[el] ?? "#c0c0c0";
}
