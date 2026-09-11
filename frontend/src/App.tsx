import { useState } from "react";
import {
  FlaskConical,
  TestTubes,
  Orbit,
  Table2,
  Flame,
  BookOpen,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  GraduationCap,
} from "lucide-react";
import type { Layout, LayoutChangedMeta } from "react-resizable-panels";
import { cn } from "@/lib/utils";
import { useToasts } from "@/lib/toast";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import {
  TrafficLightSpacer,
  WindowControls,
  isMac,
} from "@/components/WindowControls";
import { SearchBar } from "@/components/SearchBar";
import { useSidebarPanel, SIDEBAR_COLLAPSED_WIDTH } from "@/modules/sidebar";
import { usePreferencesStore } from "@/modules/settings/store";
import { MODULE_COUNTS } from "@/modules/data";
import WelcomePage, {
  loadTeacherInfo,
  type TeacherInfo,
} from "@/pages/WelcomePage";
import InstrumentsPage from "@/pages/InstrumentsPage";
import ReagentsPage from "@/pages/ReagentsPage";
import MoleculesPage from "@/pages/MoleculesPage";
import PeriodicPage from "@/pages/PeriodicPage";
import ReactionsPage from "@/pages/ReactionsPage";
import TextbookPage from "@/pages/TextbookPage";
import SettingsPage from "@/pages/SettingsPage";

const NAV = [
  { key: "instruments", label: "实验仪器", icon: FlaskConical, count: MODULE_COUNTS.instruments },
  { key: "reagents", label: "实验试剂", icon: TestTubes, count: MODULE_COUNTS.reagents },
  { key: "molecules", label: "分子结构式", icon: Orbit, count: MODULE_COUNTS.molecules },
  { key: "periodic", label: "原子和离子", icon: Table2, count: MODULE_COUNTS.elements },
  { key: "reactions", label: "化学反应", icon: Flame, count: MODULE_COUNTS.reactions },
  { key: "textbook", label: "教材数据说明", icon: BookOpen, count: null },
] as const;

type TabKey = (typeof NAV)[number]["key"] | "settings";

const ENTERED_KEY = "chemlab-entered";

export default function App() {
  const [entered, setEntered] = useState<boolean>(
    () => localStorage.getItem(ENTERED_KEY) === "1"
  );
  const [teacher, setTeacher] = useState<TeacherInfo | null>(() => loadTeacherInfo());
  const [tab, setTab] = useState<TabKey>("instruments");
  const [query, setQuery] = useState("");
  const toasts = useToasts();

  const {
    sidebarRef,
    sidebarWidthRef,
    collapsed,
    setCollapsed,
    persistCollapsed,
    persistWidth,
    toggleSidebar,
  } = useSidebarPanel();

  const zoomLevel = usePreferencesStore((s) => s.zoomLevel);

  const select = (key: TabKey) => {
    setTab(key);
    setQuery("");
  };

  const handleEnter = (info: TeacherInfo) => {
    setTeacher(info);
    setEntered(true);
    localStorage.setItem(ENTERED_KEY, "1");
  };

  if (!entered) {
    return <WelcomePage onEnter={handleEnter} />;
  }

  const currentLabel =
    tab === "settings" ? "设置" : NAV.find((n) => n.key === tab)?.label ?? "";

  return (
    <div className="relative flex h-full">
      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-0 flex-1"
        onLayoutChanged={(_: Layout, meta: LayoutChangedMeta) => {
          const width = sidebarRef.current?.getSize().inPixels ?? 0;
          if (meta.isUserInteraction && width > 0) persistWidth(width);
        }}
      >
        <ResizablePanel
          id="sidebar"
          panelRef={sidebarRef}
          defaultSize={collapsed ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${sidebarWidthRef.current}px`}
          minSize={`180px`}
          maxSize={`380px`}
          collapsible
          collapsedSize={SIDEBAR_COLLAPSED_WIDTH}
          onResize={(size) => {
            const isCollapsed = size.inPixels <= SIDEBAR_COLLAPSED_WIDTH;
            setCollapsed(isCollapsed);
            persistCollapsed(isCollapsed);
          }}
        >
          <aside className="flex h-full min-h-0 flex-col border-r border-border/60 bg-sidebar/70">
            {collapsed ? (
              <div className="app-drag flex h-full min-h-0 flex-col items-center px-2 pt-3">
                <button
                  type="button"
                  title="展开侧边栏"
                  onClick={toggleSidebar}
                  className="app-no-drag flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </button>
                <Separator className="my-3 w-8" />
                <div className="flex flex-col items-center gap-1">
                  {NAV.map(({ key, icon: Icon }) => (
                    <IconButton
                      key={key}
                      active={tab === key}
                      icon={Icon}
                      label={NAV.find((n) => n.key === key)!.label}
                      onClick={() => select(key)}
                    />
                  ))}
                </div>
                <div className="mt-auto flex flex-col items-center gap-1 pb-4">
                  <IconButton
                    active={tab === "settings"}
                    icon={Settings}
                    label="设置"
                    onClick={() => select("settings")}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="app-drag flex h-14 shrink-0 items-center justify-between px-3 pt-2">
                  <div className="app-no-drag flex min-w-0 items-center gap-2.5">
                    <TrafficLightSpacer />
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent text-xs font-extrabold text-primary-foreground">
                      C
                    </div>
                    <span className="truncate text-[13.5px] font-semibold">
                      初中化学 · 教学助手
                    </span>
                  </div>
                  <button
                    type="button"
                    title="收起侧边栏"
                    onClick={toggleSidebar}
                    className="app-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
                  <nav className="flex flex-col gap-1">
                    {NAV.map(({ key, label, icon: Icon, count }) => (
                      <NavButton
                        key={key}
                        active={tab === key}
                        icon={Icon}
                        label={label}
                        count={count}
                        onClick={() => select(key)}
                      />
                    ))}
                  </nav>

                  <Separator className="my-3" />

                  <div className="mt-auto flex flex-col gap-1">
                    {teacher && (
                      <div className="mb-2 flex items-center gap-2.5 rounded-lg bg-sidebar-accent/80 px-3 py-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <GraduationCap className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[12px] font-medium">
                            {teacher.name || "教师"}
                          </div>
                          {teacher.unit && (
                            <div className="truncate text-[10.5px] text-muted-foreground">
                              {teacher.unit}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <NavButton
                      active={tab === "settings"}
                      icon={Settings}
                      label="设置"
                      count={null}
                      onClick={() => select("settings")}
                    />
                  </div>
                </div>
              </>
            )}
          </aside>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel>
          <div className="relative flex h-full min-h-0 flex-col">
            {/* 顶栏：拖拽区 + 搜索 + 教材链接 */}
            <div className="app-drag flex h-12 shrink-0 items-center gap-3 bg-background px-4">
              <div className="app-no-drag flex min-w-0 items-center gap-2 text-[12px] text-muted-foreground">
                <span className="font-medium text-foreground/85">{currentLabel}</span>
                <span className="hidden text-[10.5px] sm:inline">
                  {tab === "textbook" ? "数据来源与说明" : "初中化学 · 教学助手"}
                </span>
              </div>
              <div className="ml-auto w-full max-w-[340px]">
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  placeholder="搜索名称、化学式或课时…"
                />
              </div>
              <button
                type="button"
                onClick={() => select("textbook")}
                className={cn(
                  "app-no-drag flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-border/70 px-3 text-[12px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  tab === "textbook" && "border-primary/40 bg-primary/8 text-primary"
                )}
                title="教材数据说明"
              >
                <BookOpen className="h-3.5 w-3.5" />
                教材链接
              </button>
            </div>

            <main
              className={cn(
                "min-h-0 flex-1 overflow-y-auto px-7 py-6",
                !isMac && "pr-24"
              )}
              style={{
                zoom:
                  Number.isFinite(zoomLevel) && zoomLevel > 0
                    ? `${zoomLevel * 100}%`
                    : "100%",
              }}
            >
              {tab === "instruments" && <InstrumentsPage query={query} />}
              {tab === "reagents" && <ReagentsPage query={query} />}
              {tab === "molecules" && <MoleculesPage query={query} />}
              {tab === "periodic" && <PeriodicPage query={query} />}
              {tab === "reactions" && <ReactionsPage query={query} />}
              {tab === "textbook" && <TextbookPage />}
              {tab === "settings" && <SettingsPage />}
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="absolute right-0 top-0 z-40 flex h-12 items-center pr-1">
        <WindowControls />
      </div>

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto rounded-lg border bg-popover px-4 py-2.5 text-sm shadow-lg",
              t.error ? "border-destructive text-destructive" : "border-border"
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function NavButton({
  active,
  icon: Icon,
  label,
  count,
  onClick,
}: {
  active: boolean;
  icon: typeof FlaskConical;
  label: string;
  count: number | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex h-9 items-center gap-2.5 rounded-lg px-3 text-[13px] text-muted-foreground transition-colors hover:bg-sidebar-accent/70 hover:text-foreground",
        active &&
          "bg-sidebar-accent font-medium text-foreground shadow-[inset_2px_0_0_0_var(--primary)]"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
      {count !== null && (
        <span
          className={cn(
            "shrink-0 rounded-md px-1.5 py-px font-mono text-[10px] tabular-nums",
            active ? "bg-primary/15 text-primary" : "bg-secondary/80 text-muted-foreground"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function IconButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof FlaskConical;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={cn(
        "group relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
        active && "bg-secondary text-foreground shadow-[inset_2px_0_0_0_var(--primary)]"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
