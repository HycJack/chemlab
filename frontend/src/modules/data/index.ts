export * from "./elements";
export * from "./instruments";
export * from "./reagents";
export * from "./molecules";
export * from "./reactions";
export * from "./textbook";

/** 各模块数据量（用于侧边栏徽标，与真实数据一致） */
export const MODULE_COUNTS = {
  instruments: 26,
  reagents: 36,
  molecules: 25,
  elements: 118,
  reactions: 42,
} as const;
