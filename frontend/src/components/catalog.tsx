import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CatalogLayoutProps {
  /** 左侧列表列宽（px），默认 300 */
  listWidth?: number;
  listHeader?: ReactNode;
  children: ReactNode;
  right: ReactNode;
}

/**
 * 目录页通用双栏布局：
 * 左侧固定宽滚动列表，右侧自适应详情区。
 */
export function CatalogLayout({
  listWidth = 300,
  listHeader,
  children,
  right,
}: CatalogLayoutProps) {
  return (
    <div className="flex h-full min-h-0 gap-0">
      <div
        className="flex h-full min-h-0 shrink-0 flex-col border-r border-border/60 bg-card/30"
        style={{ width: listWidth }}
      >
        {listHeader}
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">{children}</div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{right}</div>
    </div>
  );
}

/** 列表项按钮样式 */
export function listItemClass(active: boolean): string {
  return cn(
    "flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors",
    active
      ? "bg-primary/10 ring-1 ring-inset ring-primary/30"
      : "hover:bg-secondary/70"
  );
}

/** 英文标题徽标（如 3D INSTRUMENT） */
export function TagChip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.14em]"
      style={{
        color: color ?? "var(--primary)",
        background: color ? `${color}22` : "color-mix(in srgb, var(--primary) 12%, transparent)",
      }}
    >
      {children}
    </span>
  );
}

/** 详情区块（01 仪器名称与规格 等） */
export function DetailSection({
  index,
  title,
  children,
  className,
}: {
  index?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border/60 bg-card/50 p-4", className)}>
      <h3 className="mb-2.5 flex items-center gap-2 text-[13.5px] font-semibold">
        {index && (
          <span className="rounded-md bg-primary/12 px-1.5 py-0.5 font-mono text-[11px] font-bold text-primary">
            {index}
          </span>
        )}
        {title}
      </h3>
      <div className="space-y-2 text-[12.5px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/70" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
