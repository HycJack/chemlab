export * from "./elements";
export * from "./instruments";
export * from "./reagents";
export * from "./molecules";
export * from "./reactions";
export * from "./textbook";

import { ELEMENTS } from "./elements";
import { INSTRUMENTS } from "./instruments";
import { MOLECULES } from "./molecules";
import { REACTIONS } from "./reactions";
import { REAGENTS } from "./reagents";

/** 各模块数据量（用于侧边栏徽标），直接取真实数据长度避免漂移 */
export const MODULE_COUNTS = {
  instruments: INSTRUMENTS.length,
  reagents: REAGENTS.length,
  molecules: MOLECULES.length,
  elements: ELEMENTS.length,
  reactions: REACTIONS.length,
} as const;
