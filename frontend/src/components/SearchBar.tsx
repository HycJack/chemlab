import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

/** 全局搜索框（位于顶栏，需 app-no-drag 保证可交互） */
export function SearchBar({ value, onChange, placeholder, className }: Props) {
  return (
    <div className={`app-no-drag relative ${className ?? ""}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "搜索名称、化学式或课时…"}
        className="h-9 w-full rounded-lg border border-input/70 bg-background/70 pl-9 pr-3 text-[13px] text-foreground outline-none backdrop-blur transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/25"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          title="清空"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
