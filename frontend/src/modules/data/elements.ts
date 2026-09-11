// ---------------------------------------------------------------------------
// 元素周期表数据（118 个元素）
// - 基础字段（原子序数/符号/名称/相对原子质量/类别/族/周期/状态）手写录入
// - 核外电子排布（壳层分布 + 电子构型）按 Aufbau 规则程序化生成，含少数
//   真实构型例外（Cr/Cu/Ag/Au 等）
// - 初中阶段关键元素的「常见氧化态 / 常见简单离子 / 说明 / 教材出处」
//   手写补充；其余元素按"初中阶段不作要求"处理
// ---------------------------------------------------------------------------

export type ElementCategoryId =
  | "alkali"
  | "alkaline"
  | "transition"
  | "lanthanide"
  | "actinide"
  | "post"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble";

export const CATEGORIES: Record<
  ElementCategoryId,
  { label: string; color: string }
> = {
  alkali: { label: "碱金属", color: "#ffb3b3" },
  alkaline: { label: "碱土金属", color: "#ffe0a3" },
  transition: { label: "过渡金属", color: "#ffd0d0" },
  lanthanide: { label: "镧系元素", color: "#f2c2ff" },
  actinide: { label: "锕系元素", color: "#ffb3d9" },
  post: { label: "主族金属", color: "#d9d9d9" },
  metalloid: { label: "类金属", color: "#e6e6b3" },
  nonmetal: { label: "非金属", color: "#c2f0c2" },
  halogen: { label: "卤素", color: "#f5f5b3" },
  noble: { label: "稀有气体", color: "#c2f0f0" },
};

export type ElementState = "气" | "液" | "固";

export interface ElementData {
  /** 原子序数 1..118 */
  n: number;
  sym: string;
  /** 中文名称 */
  name: string;
  /** 相对原子质量 */
  mass: number;
  cat: ElementCategoryId;
  group: number;
  period: number;
  state: ElementState;
  /** 核外电子分布（按壳层），如 Ti → [2, 8, 10, 2] */
  shells: number[];
  /** 电子构型，如 Ti → [["3d",2],["4s",2]]，含稀有气体内核 [["Ar",1]] 前导 */
  config: Orbital[];
  /** 常见氧化态（文本） */
  oxidation: string;
  /** 常见简单离子（文本） */
  ion: string;
  /** 说明（初中阶段视角） */
  desc: string;
  /** 教材出处 */
  textbook: string;
}

export type Orbital = { o: string; e: number };

// ---------------------------------------------------------------------------
// 基础数据：[序数, 符号, 中文名, 相对原子质量, 类别, 族, 周期, 标准状态]
// ---------------------------------------------------------------------------
type Row = [
  number,
  string,
  string,
  number,
  ElementCategoryId,
  number,
  number,
  ElementState,
];

const BASE: Row[] = [
  [1, "H", "氢", 1.008, "nonmetal", 1, 1, "气"],
  [2, "He", "氦", 4.0026, "noble", 18, 1, "气"],
  [3, "Li", "锂", 6.94, "alkali", 1, 2, "固"],
  [4, "Be", "铍", 9.0122, "alkaline", 2, 2, "固"],
  [5, "B", "硼", 10.81, "metalloid", 13, 2, "固"],
  [6, "C", "碳", 12.011, "nonmetal", 14, 2, "固"],
  [7, "N", "氮", 14.007, "nonmetal", 15, 2, "气"],
  [8, "O", "氧", 15.999, "nonmetal", 16, 2, "气"],
  [9, "F", "氟", 18.998, "halogen", 17, 2, "气"],
  [10, "Ne", "氖", 20.18, "noble", 18, 2, "气"],
  [11, "Na", "钠", 22.99, "alkali", 1, 3, "固"],
  [12, "Mg", "镁", 24.305, "alkaline", 2, 3, "固"],
  [13, "Al", "铝", 26.982, "post", 13, 3, "固"],
  [14, "Si", "硅", 28.085, "metalloid", 14, 3, "固"],
  [15, "P", "磷", 30.974, "nonmetal", 15, 3, "固"],
  [16, "S", "硫", 32.06, "nonmetal", 16, 3, "固"],
  [17, "Cl", "氯", 35.45, "halogen", 17, 3, "气"],
  [18, "Ar", "氩", 39.948, "noble", 18, 3, "气"],
  [19, "K", "钾", 39.098, "alkali", 1, 4, "固"],
  [20, "Ca", "钙", 40.078, "alkaline", 2, 4, "固"],
  [21, "Sc", "钪", 44.956, "transition", 3, 4, "固"],
  [22, "Ti", "钛", 47.867, "transition", 4, 4, "固"],
  [23, "V", "钒", 50.942, "transition", 5, 4, "固"],
  [24, "Cr", "铬", 51.996, "transition", 6, 4, "固"],
  [25, "Mn", "锰", 54.938, "transition", 7, 4, "固"],
  [26, "Fe", "铁", 55.845, "transition", 8, 4, "固"],
  [27, "Co", "钴", 58.933, "transition", 9, 4, "固"],
  [28, "Ni", "镍", 58.693, "transition", 10, 4, "固"],
  [29, "Cu", "铜", 63.546, "transition", 11, 4, "固"],
  [30, "Zn", "锌", 65.38, "transition", 12, 4, "固"],
  [31, "Ga", "镓", 69.723, "post", 13, 4, "固"],
  [32, "Ge", "锗", 72.63, "metalloid", 14, 4, "固"],
  [33, "As", "砷", 74.922, "metalloid", 15, 4, "固"],
  [34, "Se", "硒", 78.971, "nonmetal", 16, 4, "固"],
  [35, "Br", "溴", 79.904, "halogen", 17, 4, "液"],
  [36, "Kr", "氪", 83.798, "noble", 18, 4, "气"],
  [37, "Rb", "铷", 85.468, "alkali", 1, 5, "固"],
  [38, "Sr", "锶", 87.62, "alkaline", 2, 5, "固"],
  [39, "Y", "钇", 88.906, "transition", 3, 5, "固"],
  [40, "Zr", "锆", 91.224, "transition", 4, 5, "固"],
  [41, "Nb", "铌", 92.906, "transition", 5, 5, "固"],
  [42, "Mo", "钼", 95.95, "transition", 6, 5, "固"],
  [43, "Tc", "锝", 98, "transition", 7, 5, "固"],
  [44, "Ru", "钌", 101.07, "transition", 8, 5, "固"],
  [45, "Rh", "铑", 102.91, "transition", 9, 5, "固"],
  [46, "Pd", "钯", 106.42, "transition", 10, 5, "固"],
  [47, "Ag", "银", 107.87, "transition", 11, 5, "固"],
  [48, "Cd", "镉", 112.41, "transition", 12, 5, "固"],
  [49, "In", "铟", 114.82, "post", 13, 5, "固"],
  [50, "Sn", "锡", 118.71, "post", 14, 5, "固"],
  [51, "Sb", "锑", 121.76, "metalloid", 15, 5, "固"],
  [52, "Te", "碲", 127.6, "metalloid", 16, 5, "固"],
  [53, "I", "碘", 126.9, "halogen", 17, 5, "固"],
  [54, "Xe", "氙", 131.29, "noble", 18, 5, "气"],
  [55, "Cs", "铯", 132.91, "alkali", 1, 6, "固"],
  [56, "Ba", "钡", 137.33, "alkaline", 2, 6, "固"],
  [57, "La", "镧", 138.91, "lanthanide", 3, 6, "固"],
  [58, "Ce", "铈", 140.12, "lanthanide", 3, 6, "固"],
  [59, "Pr", "镨", 140.91, "lanthanide", 3, 6, "固"],
  [60, "Nd", "钕", 144.24, "lanthanide", 3, 6, "固"],
  [61, "Pm", "钷", 145, "lanthanide", 3, 6, "固"],
  [62, "Sm", "钐", 150.36, "lanthanide", 3, 6, "固"],
  [63, "Eu", "铕", 151.96, "lanthanide", 3, 6, "固"],
  [64, "Gd", "钆", 157.25, "lanthanide", 3, 6, "固"],
  [65, "Tb", "铽", 158.93, "lanthanide", 3, 6, "固"],
  [66, "Dy", "镝", 162.5, "lanthanide", 3, 6, "固"],
  [67, "Ho", "钬", 164.93, "lanthanide", 3, 6, "固"],
  [68, "Er", "铒", 167.26, "lanthanide", 3, 6, "固"],
  [69, "Tm", "铥", 168.93, "lanthanide", 3, 6, "固"],
  [70, "Yb", "镱", 173.05, "lanthanide", 3, 6, "固"],
  [71, "Lu", "镥", 174.97, "lanthanide", 3, 6, "固"],
  [72, "Hf", "铪", 178.49, "transition", 4, 6, "固"],
  [73, "Ta", "钽", 180.95, "transition", 5, 6, "固"],
  [74, "W", "钨", 183.84, "transition", 6, 6, "固"],
  [75, "Re", "铼", 186.21, "transition", 7, 6, "固"],
  [76, "Os", "锇", 190.23, "transition", 8, 6, "固"],
  [77, "Ir", "铱", 192.22, "transition", 9, 6, "固"],
  [78, "Pt", "铂", 195.08, "transition", 10, 6, "固"],
  [79, "Au", "金", 196.97, "transition", 11, 6, "固"],
  [80, "Hg", "汞", 200.59, "transition", 12, 6, "液"],
  [81, "Tl", "铊", 204.38, "post", 13, 6, "固"],
  [82, "Pb", "铅", 207.2, "post", 14, 6, "固"],
  [83, "Bi", "铋", 208.98, "post", 15, 6, "固"],
  [84, "Po", "钋", 209, "metalloid", 16, 6, "固"],
  [85, "At", "砹", 210, "halogen", 17, 6, "固"],
  [86, "Rn", "氡", 222, "noble", 18, 6, "气"],
  [87, "Fr", "钫", 223, "alkali", 1, 7, "固"],
  [88, "Ra", "镭", 226, "alkaline", 2, 7, "固"],
  [89, "Ac", "锕", 227, "actinide", 3, 7, "固"],
  [90, "Th", "钍", 232.04, "actinide", 3, 7, "固"],
  [91, "Pa", "镤", 231.04, "actinide", 3, 7, "固"],
  [92, "U", "铀", 238.03, "actinide", 3, 7, "固"],
  [93, "Np", "镎", 237, "actinide", 3, 7, "固"],
  [94, "Pu", "钚", 244, "actinide", 3, 7, "固"],
  [95, "Am", "镅", 243, "actinide", 3, 7, "固"],
  [96, "Cm", "锔", 247, "actinide", 3, 7, "固"],
  [97, "Bk", "锫", 247, "actinide", 3, 7, "固"],
  [98, "Cf", "锎", 251, "actinide", 3, 7, "固"],
  [99, "Es", "锿", 252, "actinide", 3, 7, "固"],
  [100, "Fm", "镄", 257, "actinide", 3, 7, "固"],
  [101, "Md", "钔", 258, "actinide", 3, 7, "固"],
  [102, "No", "锘", 259, "actinide", 3, 7, "固"],
  [103, "Lr", "铹", 266, "actinide", 3, 7, "固"],
  [104, "Rf", "𬬻", 267, "transition", 4, 7, "固"],
  [105, "Db", "𬭊", 268, "transition", 5, 7, "固"],
  [106, "Sg", "𬭳", 269, "transition", 6, 7, "固"],
  [107, "Bh", "𬭛", 270, "transition", 7, 7, "固"],
  [108, "Hs", "𬭶", 277, "transition", 8, 7, "固"],
  [109, "Mt", "鿏", 278, "transition", 9, 7, "固"],
  [110, "Ds", "𫟼", 281, "transition", 10, 7, "固"],
  [111, "Rg", "𬬭", 282, "transition", 11, 7, "固"],
  [112, "Cn", "鎶", 285, "transition", 12, 7, "固"],
  [113, "Nh", "鉨", 286, "post", 13, 7, "固"],
  [114, "Fl", "𫓧", 289, "post", 14, 7, "固"],
  [115, "Mc", "镆", 290, "post", 15, 7, "固"],
  [116, "Lv", "𫟷", 293, "post", 16, 7, "固"],
  [117, "Ts", "鿬", 294, "halogen", 17, 7, "固"],
  [118, "Og", "鿫", 294, "noble", 18, 7, "固"],
];

// ---------------------------------------------------------------------------
// Aufbau 填充：由原子序数得到壳层分布与电子构型
// ---------------------------------------------------------------------------

/** 填充顺序：轨道名 → 容量 */
const AUFBAU: [string, number][] = [
  ["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6], ["4s", 2],
  ["3d", 10], ["4p", 6], ["5s", 2], ["4d", 10], ["5p", 6], ["6s", 2],
  ["4f", 14], ["5d", 10], ["6p", 6], ["7s", 2], ["5f", 14], ["6d", 10],
  ["7p", 6],
];

/**
 * 真实构型例外（与简单 Aufbau 规则不同）。
 * key: 元素符号；value: [ns 电子数, (n-1)d 电子数, ...] 特殊处理的轨道对
 * 这里只记录 d 轨道“少 1 个 s 电子”的例外，格式：ns 电子数 与 d 电子数。
 */
const CONFIG_EXCEPTIONS: Record<string, { s: number; d: number }> = {
  Cr: { s: 1, d: 5 },
  Cu: { s: 1, d: 10 },
  Nb: { s: 1, d: 4 },
  Mo: { s: 1, d: 5 },
  Ru: { s: 1, d: 7 },
  Rh: { s: 1, d: 8 },
  Pd: { s: 0, d: 10 },
  Ag: { s: 1, d: 10 },
  Pt: { s: 1, d: 9 },
  Au: { s: 1, d: 10 },
};

/** 原子序数 → 稀有气体内核序数 */
const NOBLE_CORES: [number, string][] = [
  [2, "He"], [10, "Ne"], [18, "Ar"], [36, "Kr"], [54, "Xe"], [86, "Rn"],
];

function orbitalShell(o: string): number {
  return parseInt(o[0], 10);
}

/** 生成填充后的轨道列表 [轨道名, 电子数]（按 Aufbau 顺序，空轨道省略） */
export function computeConfig(z: number): Orbital[] {
  const filled: Orbital[] = [];
  let electrons = z;
  for (const [orb, cap] of AUFBAU) {
    if (electrons <= 0) break;
    const n = Math.min(electrons, cap);
    filled.push({ o: orb, e: n });
    electrons -= n;
  }

  // 应用 d 轨道例外：修改最近出现的 (n-1)d 与 ns
  const sym = symbolOf(z);
  const ex = CONFIG_EXCEPTIONS[sym];
  if (ex) {
    const sOrb = filled.find((f) => f.o.endsWith("s") && f.e === 2);
    const dOrb = [...filled]
      .reverse()
      .find((f) => /^[1-7]d$/.test(f.o) && f.e === 9) // 找被截断的 d
      ?? [...filled].reverse().find((f) => /^[1-7]d$/.test(f.o));
    if (sOrb && dOrb) {
      const sLevel = orbitalShell(sOrb.o);
      const dLevel = orbitalShell(dOrb.o);
      if (dLevel === sLevel - 1) {
        sOrb.e = ex.s;
        dOrb.e = ex.d;
      }
    }
    // 特例：Pd 4d10（s 壳层为 0）已在上面处理
    if (sym === "Pd") {
      filled.splice(
        filled.findIndex((f) => f.o === "5s"),
        1
      );
    }
  }

  return filled.filter((f) => f.e > 0);
}

/** 壳层分布：由构型累加每层电子数 */
export function computeShells(config: Orbital[]): number[] {
  const maxShell = Math.max(...config.map((c) => orbitalShell(c.o)), 0);
  const shells = new Array(maxShell).fill(0);
  for (const { o, e } of config) shells[orbitalShell(o) - 1] += e;
  return shells;
}

/** 电子构型展示串（带稀有气体内核缩写），如 [Ar] 3d² 4s² */
export function formatConfig(config: Orbital[]): string {
  const z = config.reduce((acc, c) => acc + c.e, 0);
  let core: [number, string] | null = null;
  for (const [n, s] of NOBLE_CORES) if (n <= z) core = [n, s];
  if (!core) {
    return config.map((c) => `${c.o}${sup(c.e)}`).join(" ");
  }
  const coreZ = core[0];
  const rest = config.filter((c) => {
    // 保留稀有气体内核之外的轨道（含同层 s/p）
    const shellOf = (o: string) => parseInt(o[0], 10);
    const coreShell = NOBLE_CORES.find(([n]) => n === coreZ)![0];
    return !(shellOf(c.o) <= coreShell && ["s", "p"].includes(c.o[1]));
  });
  return `[${core[1]}] ${rest.map((c) => `${c.o}${sup(c.e)}`).join(" ")}`.trim();
}

function sup(e: number): string {
  const map: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵",
    "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  };
  return String(e)
    .split("")
    .map((d) => map[d] ?? d)
    .join("");
}

function symbolOf(z: number): string {
  return BASE.find((r) => r[0] === z)![1];
}

// ---------------------------------------------------------------------------
// 初中关键元素的补充说明
// ---------------------------------------------------------------------------

const GENERIC_DESC =
  "该元素在初中化学教材中不作重点要求，了解其在周期表中的位置与基本性质即可。";

interface Detail {
  oxidation?: string;
  ion?: string;
  desc?: string;
  textbook?: string;
}

const DETAILS: Record<string, Detail> = {
  H: {
    oxidation: "+1",
    ion: "H⁺（氢离子）",
    desc: "最轻的元素，标准状况下为无色无味气体，难溶于水。在化合物中通常显 +1 价，是初中阶段最常见的元素之一。",
    textbook: "上册 第三单元课题2（水的组成）、第四单元课题3（化学式）",
  },
  He: {
    oxidation: "0",
    ion: "—",
    desc: "稀有气体，化学性质极不活泼，可用于填充气球、保护气等。",
    textbook: "上册 第三单元课题1",
  },
  C: {
    oxidation: "+4、+2",
    ion: "CO₃²⁻、HCO₃⁻ 等含碳原子团",
    desc: "金刚石、石墨、C₆₀ 等单质形态不同但均由碳原子构成。一氧化碳、二氧化碳、碳酸盐是初中重点化合物。",
    textbook: "上册 第六单元课题1（碳的单质）、课题2（二氧化碳）",
  },
  N: {
    oxidation: "-3、+5 等",
    ion: "NH₄⁺（铵根离子）",
    desc: "空气中含量最多的元素。氮气化学性质稳定，可用作保护气；氮肥是初中化学肥料的重要内容。",
    textbook: "上册 第二单元课题1（空气）、下册 第十一单元课题2（化肥）",
  },
  O: {
    oxidation: "-2（化合物中通常）",
    ion: "O²⁻",
    desc: "地壳中含量最多的元素，也是生物体内含量最多的元素。氧气能支持燃烧，是初中实验的核心气体。",
    textbook: "上册 第二单元课题2（氧气）、课题3（制取氧气）",
  },
  F: {
    oxidation: "-1",
    ion: "F⁻",
    desc: "最活泼的非金属元素，初中阶段了解其性质即可。",
    textbook: "下册 第九单元课题1",
  },
  Ne: {
    oxidation: "0",
    ion: "—",
    desc: "稀有气体，通电时能发出有色光，用于霓虹灯。",
    textbook: "上册 第三单元课题1",
  },
  Na: {
    oxidation: "+1",
    ion: "Na⁺",
    desc: "银白色金属，质软。钠的化合物（氯化钠、碳酸钠、氢氧化钠等）是初中化学的重要物质。",
    textbook: "下册 第十单元课题1（常见的酸和碱）、第十一单元课题1（盐）",
  },
  Mg: {
    oxidation: "+2",
    ion: "Mg²⁺",
    desc: "银白色金属，在空气中燃烧发出耀眼白光，生成白色氧化镁。镁条是初中燃烧实验的常用材料。",
    textbook: "上册 第二单元课题2（氧气）、下册 第八单元课题2（金属的化学性质）",
  },
  Al: {
    oxidation: "+3",
    ion: "Al³⁺",
    desc: "地壳中含量最多的金属元素，密度小、抗腐蚀（表面致密氧化膜），广泛用于航天与建筑。",
    textbook: "下册 第八单元课题1（金属材料）",
  },
  Si: {
    oxidation: "+4",
    ion: "SiO₃²⁻ 等",
    desc: "地壳中含量仅次于氧的元素，是制造半导体芯片和光纤的重要材料。",
    textbook: "下册 第八单元课题1",
  },
  P: {
    oxidation: "+5、+3",
    ion: "PO₄³⁻（磷酸根离子）",
    desc: "红磷、白磷是磷的单质。红磷燃烧测定空气中氧气含量是初中重要实验；磷酸盐是常见肥料成分。",
    textbook: "上册 第二单元课题1（空气）、第十一单元课题2（化肥）",
  },
  S: {
    oxidation: "-2、+4、+6",
    ion: "S²⁻、SO₄²⁻（硫酸根离子）",
    desc: "黄色固体，在空气中燃烧产生淡蓝色火焰、生成有刺激性气味的二氧化硫。硫酸盐（硫酸铜等）为初中常见盐。",
    textbook: "上册 第二单元课题2（氧气）、下册 第十单元课题1（硫酸）",
  },
  Cl: {
    oxidation: "-1",
    ion: "Cl⁻",
    desc: "黄绿色气体，有刺激性气味。氯化钠、盐酸（氯化氢水溶液）是初中化学的核心物质。",
    textbook: "下册 第十单元课题1（常见的酸）、第十一单元课题1（盐）",
  },
  Ar: {
    oxidation: "0",
    ion: "—",
    desc: "稀有气体，可用作焊接保护气和填充灯泡。",
    textbook: "上册 第三单元课题1",
  },
  K: {
    oxidation: "+1",
    ion: "K⁺",
    desc: "钾的化合物（氯化钾、硝酸钾、硫酸钾等）是常用钾肥，植物生长必需元素。",
    textbook: "下册 第十一单元课题2（化肥）",
  },
  Ca: {
    oxidation: "+2",
    ion: "Ca²⁺",
    desc: "人体必需元素，钙的化合物（氧化钙、氢氧化钙、碳酸钙）是初中重点：生石灰、熟石灰与石灰石。",
    textbook: "上册 第六单元课题2（二氧化碳制取）、下册 第十单元课题1（碱）",
  },
  Sc: { desc: "过渡金属，初中阶段不作要求。" },
  Ti: {
    oxidation: "+4、+3",
    ion: "Ti⁴⁺",
    desc: "银白色金属，密度小、强度高、耐腐蚀，被称为“未来金属”，广泛用于航空航天与医用材料。",
    textbook: "下册 第八单元课题1（金属材料）",
  },
  Cr: {
    oxidation: "+6、+3",
    ion: "Cr³⁺",
    desc: "硬度最大的金属，常用于电镀与不锈钢（含铬铁合金）。",
    textbook: "下册 第八单元课题1",
  },
  Mn: {
    oxidation: "+7、+2",
    ion: "MnO₄⁻（高锰酸根离子）",
    desc: "高锰酸钾（KMnO₄）是初中实验室制取氧气的常用药品，暗紫色固体。",
    textbook: "上册 第二单元课题3（制取氧气）",
  },
  Fe: {
    oxidation: "+2、+3",
    ion: "Fe²⁺（亚铁离子）、Fe³⁺（铁离子）",
    desc: "年产量最高的金属。铁与酸、盐溶液反应是初中重点；铁锈的主要成分是氧化铁（Fe₂O₃）。",
    textbook: "上册 第二单元课题2（铁丝燃烧）、下册 第八单元课题2（金属的化学性质）、课题3（金属资源的利用和保护）",
  },
  Co: { desc: "过渡金属，初中阶段不作要求。" },
  Ni: { desc: "过渡金属，初中阶段不作要求。" },
  Cu: {
    oxidation: "+2、+1",
    ion: "Cu²⁺（铜离子）",
    desc: "紫红色金属，导电导热性好。铜与硝酸银溶液等盐溶液的反应是初中置换反应的重要例子；硫酸铜溶液呈蓝色。",
    textbook: "下册 第八单元课题2（金属的化学性质）、第十单元课题1（硫酸铜）",
  },
  Zn: {
    oxidation: "+2",
    ion: "Zn²⁺",
    desc: "银白色金属，锌粒与稀盐酸/稀硫酸反应制取氢气是初中经典实验；金属活动性顺序中排在氢前。",
    textbook: "下册 第八单元课题2（金属的化学性质）、课题3（金属资源的利用）",
  },
  Ag: {
    oxidation: "+1",
    ion: "Ag⁺",
    desc: "导电性最好的金属。硝酸银溶液与铜、铁的反应是初中置换反应的重要实验。",
    textbook: "下册 第八单元课题2",
  },
  Ba: {
    oxidation: "+2",
    ion: "Ba²⁺",
    desc: "氯化钡溶液与硫酸盐反应生成不溶于稀硝酸的白色沉淀（硫酸钡），用于检验硫酸根离子。",
    textbook: "下册 第十一单元课题1（盐）",
  },
  Br: {
    oxidation: "-1",
    ion: "Br⁻",
    desc: "常温下唯一的液态非金属单质，深红棕色，初中阶段了解即可。",
    textbook: "下册 第九单元课题1",
  },
  I: {
    oxidation: "-1、+5",
    ion: "I⁻",
    desc: "紫黑色固体，易升华。碘遇淀粉变蓝，是初中重要的检验方法；食盐中添加碘酸钾预防甲状腺疾病。",
    textbook: "上册 第一单元课题2（化学实验）、下册 第十一单元课题1（盐）",
  },
  Hg: {
    oxidation: "+2",
    ion: "Hg²⁺",
    desc: "常温下唯一的液态金属（俗称水银），有毒，使用时需谨慎。",
    textbook: "下册 第八单元课题1",
  },
  Pb: {
    oxidation: "+2、+4",
    ion: "Pb²⁺",
    desc: "重金属，铅污染对人体有害；了解其在金属活动性顺序中的位置即可。",
    textbook: "下册 第八单元课题2",
  },
  Au: {
    oxidation: "+3、+1",
    ion: "Au³⁺",
    desc: "金黄色金属，化学性质极不活泼，在空气中不易被腐蚀，“真金不怕火炼”。",
    textbook: "下册 第八单元课题2",
  },
};

// ---------------------------------------------------------------------------
// 组装最终数据
// ---------------------------------------------------------------------------

export const ELEMENTS: ElementData[] = BASE.map((row) => {
  const [n, sym, name, mass, cat, group, period, state] = row;
  const config = computeConfig(n);
  const shells = computeShells(config);
  const detail = DETAILS[sym] ?? {};
  return {
    n,
    sym,
    name,
    mass,
    cat,
    group,
    period,
    state,
    shells,
    config,
    oxidation: detail.oxidation ?? "—",
    ion: detail.ion ?? "—",
    desc: detail.desc ?? GENERIC_DESC,
    textbook: detail.textbook ?? "—",
  };
});

const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.sym, e]));
const BY_NUMBER = new Map(ELEMENTS.map((e) => [e.n, e]));

export function elementBySymbol(sym: string): ElementData | undefined {
  return BY_SYMBOL.get(sym);
}

export function elementByNumber(n: number): ElementData | undefined {
  return BY_NUMBER.get(n);
}

/** 周期表网格坐标（18 列 × 9 行；第 8/9 行为镧系/锕系） */
export function gridPosition(e: ElementData): { row: number; col: number } {
  if (e.cat === "lanthanide") return { row: 8, col: 3 + (e.n - 57) };
  if (e.cat === "actinide") return { row: 9, col: 3 + (e.n - 89) };
  return { row: e.period, col: e.group };
}
