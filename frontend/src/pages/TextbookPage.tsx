import { BookOpen, Scale, Shield, Lightbulb, Link2 } from "lucide-react";
import { TEXTBOOK_SECTIONS, COVERAGE_ROWS } from "@/modules/data";
import { PageHeader } from "@/components/PageHeader";
import { TagChip } from "@/components/catalog";

const ICONS = {
  book: BookOpen,
  scale: Scale,
  shield: Shield,
  link: Link2,
  lightbulb: Lightbulb,
} as const;

export default function TextbookPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-8">
      <PageHeader
        crumb="教材数据说明"
        title="教材数据说明"
        english="TEXTBOOK NOTES"
        subtitle="本应用全部教学数据的来源、组织方式与使用说明。"
      />

      {/* 数据覆盖 */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
        <div className="mb-3 flex items-center gap-2">
          <TagChip color="#3b82f6">DATA COVERAGE</TagChip>
          <h2 className="text-[15px] font-semibold">数据覆盖</h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="bg-secondary/60 text-left text-[11.5px] text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">模块</th>
                <th className="px-4 py-2.5 font-medium">数量</th>
                <th className="px-4 py-2.5 font-medium">覆盖范围</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {COVERAGE_ROWS.map((r) => (
                <tr key={r.module}>
                  <td className="px-4 py-2.5 font-medium">{r.module}</td>
                  <td className="px-4 py-2.5 tabular-nums text-primary">
                    {r.count}
                    <span className="ml-0.5 text-muted-foreground">{r.unit}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.coverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 说明区块 */}
      {TEXTBOOK_SECTIONS.map((s, i) => {
        const Icon = ICONS[s.icon];
        return (
          <section
            key={s.title}
            className="rounded-2xl border border-border/60 bg-card/50 p-5"
          >
            <h2 className="mb-3 flex items-center gap-2.5 text-[15px] font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              {s.title}
              <span className="ml-auto font-mono text-[10.5px] text-muted-foreground/50">
                {String(i + 1).padStart(2, "0")}
              </span>
            </h2>
            <ul className="space-y-2.5">
              {s.body.map((b, j) => (
                <li key={j} className="flex gap-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
                  <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
