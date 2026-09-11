// ---------------------------------------------------------------------------
// 分子结构式数据（25 种初中常见分子）
// atoms: 球棍模型原子坐标（单位约 0.1 nm 量级）；bonds: 原子间化学键
// states: 三态微观动画说明；desc: 原子组成与化学键
// ---------------------------------------------------------------------------

export interface AtomPos {
  el: string;
  x: number;
  y: number;
  z: number;
}

export interface Bond {
  a: number;
  b: number;
  order?: 1 | 2 | 3;
}

export interface Molecule {
  id: string;
  name: string;
  formula: string;
  /** 空间构型 */
  shape: string;
  /** 键角（可选） */
  angle?: string;
  atoms: AtomPos[];
  bonds: Bond[];
  /** 原子组成与化学键说明 */
  desc: string;
  /** 三态微观动画说明 */
  states: { gas: string; liquid: string; solid: string };
  textbook: string;
  /** 是否仅需简单 2D 示意（复杂大分子） */
  simple2d?: boolean;
}

/** CPK 原子着色 */
export const ATOM_COLORS: Record<string, string> = {
  H: "#ffffff",
  C: "#2f2f2f",
  N: "#2b6ae0",
  O: "#e03131",
  F: "#5fd35f",
  Cl: "#2ddb3a",
  Br: "#9b4d96",
  I: "#7d4fd8",
  S: "#f2d648",
  P: "#ff9f43",
  Na: "#7d5fd8",
  Mg: "#4a9a5a",
  Fe: "#d97b5a",
  Cu: "#c98a5a",
  Zn: "#8fa3b0",
};

const M = (el: string, x: number, y: number, z = 0): AtomPos => ({ el, x, y, z });

export const MOLECULES: Molecule[] = [
  {
    id: "h2",
    name: "氢气分子",
    formula: "H₂",
    shape: "直线形",
    atoms: [M("H", -0.6, 0), M("H", 0.6, 0)],
    bonds: [{ a: 0, b: 1 }],
    desc: "由 2 个氢原子构成，1 个 H—H 单键。同种原子构成的分子（单质）。",
    states: {
      gas: "氢分子间隔大，运动速度快，充满整个容器",
      liquid: "分子间隔变小，无规则运动减慢",
      solid: "分子有序排列，仅在平衡位置振动",
    },
    textbook: "上册 第四单元课题2（化学式）；下册 第三单元课题1（分子）",
  },
  {
    id: "o2",
    name: "氧气分子",
    formula: "O₂",
    shape: "直线形",
    atoms: [M("O", -0.55, 0), M("O", 0.55, 0)],
    bonds: [{ a: 0, b: 1, order: 2 }],
    desc: "由 2 个氧原子通过双键结合，是支持燃烧、供给呼吸的气体。",
    states: {
      gas: "氧分子间隔大，运动速度快",
      liquid: "氧分子间隔变小，液态氧呈淡蓝色",
      solid: "氧分子有序排列，固态氧呈淡蓝色",
    },
    textbook: "上册 第二单元课题2；第四单元课题2",
  },
  {
    id: "n2",
    name: "氮气分子",
    formula: "N₂",
    shape: "直线形",
    atoms: [M("N", -0.55, 0), M("N", 0.55, 0)],
    bonds: [{ a: 0, b: 1, order: 3 }],
    desc: "两个氮原子间形成稳定的三键（N≡N），键能大，故氮气化学性质稳定。",
    states: {
      gas: "氮分子间隔大，运动速度快",
      liquid: "分子间隔变小，液态氮用于冷冻",
      solid: "分子有序排列，固态氮温度极低",
    },
    textbook: "上册 第二单元课题1；第四单元课题2",
  },
  {
    id: "cl2",
    name: "氯气分子",
    formula: "Cl₂",
    shape: "直线形",
    atoms: [M("Cl", -0.95, 0), M("Cl", 0.95, 0)],
    bonds: [{ a: 0, b: 1 }],
    desc: "两个氯原子以单键结合，黄绿色有毒气体。",
    states: {
      gas: "氯分子间隔大，呈黄绿色",
      liquid: "液态氯呈黄绿色",
      solid: "固态氯为黄色晶体",
    },
    textbook: "下册 第十单元课题1（延伸）",
  },
  {
    id: "i2",
    name: "碘分子",
    formula: "I₂",
    shape: "直线形",
    atoms: [M("I", -1.2, 0), M("I", 1.2, 0)],
    bonds: [{ a: 0, b: 1 }],
    desc: "两个碘原子以单键结合。碘单质紫黑色，易升华，遇淀粉变蓝。",
    states: {
      gas: "碘蒸气为紫红色，分子间隔大",
      liquid: "液态碘呈紫红色",
      solid: "碘晶体紫黑色，易升华",
    },
    textbook: "上册 第一单元课题2；第十一单元（延伸）",
  },
  {
    id: "hcl",
    name: "氯化氢分子",
    formula: "HCl",
    shape: "直线形",
    atoms: [M("H", -0.55, 0), M("Cl", 0.85, 0)],
    bonds: [{ a: 0, b: 1 }],
    desc: "氢原子与氯原子以共价单键结合，其水溶液是盐酸。",
    states: {
      gas: "氯化氢为无色气体，有刺激性气味",
      liquid: "液态氯化氢不导电（无离子）",
      solid: "固态氯化氢为分子晶体",
    },
    textbook: "下册 第十单元课题1",
  },
  {
    id: "hf",
    name: "氟化氢分子",
    formula: "HF",
    shape: "直线形",
    atoms: [M("H", -0.5, 0), M("F", 0.65, 0)],
    bonds: [{ a: 0, b: 1 }],
    desc: "氢原子与氟原子以极性共价键结合，初中阶段了解即可。",
    states: { gas: "常温下为无色气体", liquid: "液态氟化氢能腐蚀玻璃", solid: "固态为分子晶体" },
    textbook: "—",
  },
  {
    id: "h2o",
    name: "水分子",
    formula: "H₂O",
    shape: "V 形",
    angle: "键角约 104.5°",
    atoms: [M("O", 0, 0), M("H", 0.757, 0.586), M("H", 0.757, -0.586)],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }],
    desc: "1 个氧原子与 2 个氢原子形成 2 个 O—H 键，V 形结构。水是生活中最常见的溶剂。",
    states: {
      gas: "水蒸气：分子间隔大，无规则运动",
      liquid: "液态水：分子间隔较小，不断运动",
      solid: "冰：分子有序排列，体积膨胀（密度变小）",
    },
    textbook: "上册 第三单元课题2（水的组成）；第四单元课题1",
  },
  {
    id: "h2o2",
    name: "过氧化氢分子",
    formula: "H₂O₂",
    shape: "折线形（非平面）",
    atoms: [M("H", -1.05, 0.72), M("O", -0.38, 0.35), M("O", 0.38, -0.35), M("H", 1.05, -0.72)],
    bonds: [{ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }],
    desc: "两个氧原子通过 O—O 单键相连，每个氧再连一个氢。过氧化氢不稳定，易分解。",
    states: {
      gas: "过氧化氢蒸气少见，分子间隔大",
      liquid: "双氧水：无色溶液",
      solid: "固态过氧化氢为白色晶体",
    },
    textbook: "上册 第二单元课题3",
  },
  {
    id: "co",
    name: "一氧化碳分子",
    formula: "CO",
    shape: "直线形",
    atoms: [M("C", -0.55, 0), M("O", 0.55, 0)],
    bonds: [{ a: 0, b: 1, order: 3 }],
    desc: "碳氧间形成三键。CO 有毒、可燃、有还原性。",
    states: {
      gas: "一氧化碳为无色无味有毒气体",
      liquid: "液态一氧化碳少见",
      solid: "固态一氧化碳为分子晶体",
    },
    textbook: "上册 第六单元课题3",
  },
  {
    id: "co2",
    name: "二氧化碳分子",
    formula: "CO₂",
    shape: "直线形",
    angle: "键角 180°",
    atoms: [M("O", -1.15, 0), M("C", 0, 0), M("O", 1.15, 0)],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 1, b: 2, order: 2 }],
    desc: "碳原子居中，两侧各以双键连接氧原子，直线形非极性分子。",
    states: {
      gas: "二氧化碳气体：分子间隔大",
      liquid: "液态 CO₂：加压液化",
      solid: "干冰：固态 CO₂，易升华吸热",
    },
    textbook: "上册 第六单元课题2",
  },
  {
    id: "so2",
    name: "二氧化硫分子",
    formula: "SO₂",
    shape: "V 形",
    angle: "键角约 119°",
    atoms: [M("S", 0, 0), M("O", 0.92, 0.68), M("O", 0.92, -0.68)],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 0, b: 2, order: 2 }],
    desc: "硫原子居中，与两个氧原子形成双键，V 形结构。SO₂ 有刺激性气味，是大气污染物。",
    states: {
      gas: "二氧化硫为无色有刺激性气味气体",
      liquid: "液态 SO₂ 可作制冷剂",
      solid: "固态 SO₂ 为无色晶体",
    },
    textbook: "上册 第二单元课题2；下册 第十单元（延伸）",
  },
  {
    id: "so3",
    name: "三氧化硫分子",
    formula: "SO₃",
    shape: "平面三角形",
    angle: "键角 120°",
    atoms: [M("S", 0, 0), M("O", 1.1, 0), M("O", -0.55, 0.95), M("O", -0.55, -0.95)],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 2 },
      { a: 0, b: 3, order: 2 },
    ],
    desc: "硫原子居中与三个氧原子双键结合，平面三角形。SO₃ 与水反应生成硫酸。",
    states: {
      gas: "三氧化硫为无色气体",
      liquid: "液态 SO₃ 与水剧烈反应",
      solid: "固态 SO₃ 有多种晶型",
    },
    textbook: "下册 第十单元课题1（延伸）",
  },
  {
    id: "ch4",
    name: "甲烷分子",
    formula: "CH₄",
    shape: "正四面体",
    angle: "键角约 109.5°",
    atoms: [
      M("C", 0, 0),
      M("H", 0.9, 0.63, 0.63),
      M("H", 0.9, -0.63, -0.63),
      M("H", -0.9, 0.63, -0.63),
      M("H", -0.9, -0.63, 0.63),
    ],
    bonds: [
      { a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 },
    ],
    desc: "碳原子居中，四个氢原子位于正四面体顶点，是最简单的有机物。",
    states: {
      gas: "甲烷为无色无味气体，密度小于空气",
      liquid: "加压可液化",
      solid: "固态甲烷为分子晶体",
    },
    textbook: "下册 第三单元课题1；第十一单元课题4",
  },
  {
    id: "nh3",
    name: "氨分子",
    formula: "NH₃",
    shape: "三角锥形",
    angle: "键角约 107°",
    atoms: [M("N", 0, 0), M("H", 0.94, 0, 0), M("H", -0.47, 0.81, 0), M("H", -0.47, -0.81, 0)],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }],
    desc: "氮原子居中，三个氢原子成三角锥分布，有孤对电子，故氨气显碱性。",
    states: {
      gas: "氨气有刺激性气味，极易溶于水",
      liquid: "液态氨可作制冷剂",
      solid: "固态氨为分子晶体",
    },
    textbook: "下册 第三单元课题1；第十一单元课题2（化肥）",
  },
  {
    id: "ch2o",
    name: "甲醛分子",
    formula: "CH₂O",
    shape: "平面三角形",
    atoms: [M("C", 0, 0), M("O", 0, 1.1), M("H", -1.0, -0.62), M("H", 1.0, -0.62)],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2 },
      { a: 0, b: 3 },
    ],
    desc: "碳原子与氧原子双键结合，与两个氢原子单键结合。甲醛有毒，室内装修污染源之一。",
    states: { gas: "常温下为无色气体", liquid: "福尔马林为甲醛水溶液", solid: "固态少见" },
    textbook: "—（生活常识延伸）",
  },
  {
    id: "c2h4",
    name: "乙烯分子",
    formula: "C₂H₄",
    shape: "平面形",
    atoms: [
      M("C", -0.7, 0),
      M("C", 0.7, 0),
      M("H", -1.62, 0.92),
      M("H", -1.62, -0.92),
      M("H", 1.62, 0.92),
      M("H", 1.62, -0.92),
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2 }, { a: 0, b: 3 },
      { a: 1, b: 4 }, { a: 1, b: 5 },
    ],
    desc: "两个碳原子间以双键相连（碳碳双键），是植物生长调节剂，也是重要化工原料。",
    states: { gas: "常温下为无色气体", liquid: "加压液化", solid: "固态为分子晶体" },
    textbook: "—（高中延伸）",
  },
  {
    id: "ch3oh",
    name: "甲醇分子",
    formula: "CH₃OH",
    shape: "四面体（近似）",
    atoms: [
      M("C", 0, 0, 0),
      M("O", 1.05, 0.1, 0),
      M("H", -0.62, -0.72, 0),
      M("H", -0.62, 0.72, 0),
      M("H", -0.3, 0, 0.95),
      M("H", 1.95, 0.1, 0),
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 },
      { a: 1, b: 5 },
    ],
    desc: "甲醇（CH₃OH）是最简单的醇。工业酒精中含甲醇，有毒，不能饮用。",
    states: { gas: "甲醇蒸气有毒", liquid: "无色液体，易挥发", solid: "固态少见" },
    textbook: "下册 第十一单元课题1（延伸：工业酒精）",
  },
  {
    id: "c2h5oh",
    name: "乙醇分子",
    formula: "C₂H₅OH",
    shape: "链状",
    atoms: [
      M("C", -0.85, 0, 0),
      M("C", 0.85, 0, 0),
      M("O", 1.75, 0.1, 0),
      M("H", -1.62, -0.72, 0),
      M("H", -1.62, 0.72, 0),
      M("H", -0.62, 0, 0.92),
      M("H", 0.62, 0, 0.92),
      M("H", 0.85, -0.75, 0),
      M("H", 2.66, 0.1, 0),
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 1, b: 2 },
      { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 0, b: 5 },
      { a: 1, b: 6 }, { a: 1, b: 7 },
      { a: 2, b: 8 },
    ],
    desc: "乙醇由乙基（C₂H₅—）和羟基（—OH）组成，是酒精的主要成分，可作燃料和消毒剂。",
    states: {
      gas: "乙醇蒸气易燃",
      liquid: "无色液体，易挥发，与水任意比互溶",
      solid: "固态少见",
    },
    textbook: "上册 第一单元课题3（酒精灯）；下册 第十一单元课题1",
  },
  {
    id: "ch3cooh",
    name: "醋酸分子",
    formula: "CH₃COOH",
    shape: "链状",
    atoms: [
      M("C", -1.0, 0, 0),
      M("C", 0.8, 0, 0),
      M("O", 0.85, 0.95, 0),
      M("O", 1.85, -0.35, 0),
      M("H", -1.75, -0.7, 0),
      M("H", -1.75, 0.7, 0),
      M("H", -0.75, 0, 0.9),
      M("H", 2.7, -0.55, 0),
    ],
    bonds: [
      { a: 0, b: 1 },
      { a: 1, b: 2, order: 2 },
      { a: 1, b: 3 },
      { a: 0, b: 4 }, { a: 0, b: 5 }, { a: 0, b: 6 },
      { a: 3, b: 7 },
    ],
    desc: "醋酸（乙酸）分子中含羧基（—COOH），是食醋的主要成分，显酸性。",
    states: {
      gas: "醋酸蒸气有刺激性气味",
      liquid: "无色液体，有酸味",
      solid: "熔点 16.6℃，低于此温度凝为冰状（冰醋酸）",
    },
    textbook: "下册 第十单元课题1（生活中的酸）",
  },
  {
    id: "h2s",
    name: "硫化氢分子",
    formula: "H₂S",
    shape: "V 形",
    atoms: [M("S", 0, 0), M("H", 0.88, 0.7), M("H", 0.88, -0.7)],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }],
    desc: "硫原子与两个氢原子形成 V 形结构。硫化氢有臭鸡蛋气味，有毒。",
    states: { gas: "有臭鸡蛋气味的有毒气体", liquid: "液态少见", solid: "固态少见" },
    textbook: "—（延伸）",
  },
  {
    id: "no",
    name: "一氧化氮分子",
    formula: "NO",
    shape: "直线形",
    atoms: [M("N", -0.5, 0), M("O", 0.5, 0)],
    bonds: [{ a: 0, b: 1, order: 2 }],
    desc: "氮氧双键结合。NO 是大气污染物，也是生物体内信号分子。",
    states: { gas: "无色有毒气体", liquid: "液态 NO 呈蓝色", solid: "固态少见" },
    textbook: "—（延伸）",
  },
  {
    id: "no2",
    name: "二氧化氮分子",
    formula: "NO₂",
    shape: "V 形",
    atoms: [M("N", 0, 0), M("O", 0.9, 0.68), M("O", 0.9, -0.68)],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 0, b: 2, order: 2 }],
    desc: "红棕色有刺激性气味气体，是大气污染物（酸雨成因之一）。",
    states: { gas: "红棕色气体", liquid: "液态 NO₂ 呈黄色", solid: "固态无色" },
    textbook: "下册 第十单元（延伸：酸雨）",
  },
  {
    id: "hno3",
    name: "硝酸分子",
    formula: "HNO₃",
    shape: "平面形",
    atoms: [
      M("N", 0, 0),
      M("O", 0, 1.1),
      M("O", -1.02, -0.42),
      M("O", 1.02, -0.42),
      M("H", 1.75, -0.95),
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 2 },
      { a: 0, b: 3 },
      { a: 3, b: 4 },
    ],
    desc: "硝酸分子中氮原子与三个氧原子结合，其中—OH 可电离出 H⁺，是强酸。",
    states: { gas: "硝酸蒸气有刺激性气味", liquid: "无色液体，见光分解", solid: "固态少见" },
    textbook: "下册 第十单元课题1（延伸）",
  },
  {
    id: "h2so4",
    name: "硫酸分子",
    formula: "H₂SO₄",
    shape: "四面体（近似）",
    atoms: [
      M("S", 0, 0, 0),
      M("O", 0, 1.15, 0),
      M("O", 0, -1.15, 0),
      M("O", -1.05, 0.2, 0),
      M("O", 1.05, 0.2, 0),
      M("H", -1.8, 0.55, 0),
      M("H", 1.8, 0.55, 0),
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 2 },
      { a: 0, b: 3 },
      { a: 0, b: 4 },
      { a: 3, b: 5 },
      { a: 4, b: 6 },
    ],
    desc: "硫酸分子中硫原子与四个氧原子结合（两个双键、两个—OH），是重要的化工原料。",
    states: {
      gas: "硫酸蒸气少见",
      liquid: "无色黏稠状液体，浓硫酸有吸水性",
      solid: "固态硫酸熔点 10.4℃",
    },
    textbook: "下册 第十单元课题1（常见的酸）",
  },
];
