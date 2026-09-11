import type { ReactNode } from "react";

interface Props {
  crumb: string;
  title: string;
  english: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

/** 页面头：面包屑 + 中文大标题 + 英文副标 + 可选徽标/操作 */
export function PageHeader({ crumb, title, english, subtitle, badge, actions }: Props) {
  return (
    <div className="mb-5">
      <div className="mb-1.5 flex items-center gap-1.5 text-[11.5px] text-muted-foreground/80">
        <span>初中化学</span>
        <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-60">
          <path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-foreground/80">{crumb}</span>
        {badge}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[26px] font-bold leading-tight tracking-tight">{title}</h1>
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary/80">
            {english}
          </span>
        </div>
        {actions}
      </div>
      {subtitle && (
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
