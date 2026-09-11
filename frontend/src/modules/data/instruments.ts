// ---------------------------------------------------------------------------
// 实验仪器目录数据（对照 2024 人教版九年级化学全上下册整理）
// 每条记录包含：名称 / 类别 / 规格 / 材质 / 用途 / 安全注意事项 / 涉及实验 /
// 教材出处，以及用于 3D 建模的 shape 键
// ---------------------------------------------------------------------------

export type InstrumentCategory =
  | "反应容器"
  | "加热仪器"
  | "计量仪器"
  | "夹持工具"
  | "其他";

export type InstrumentShape =
  | "testtube"
  | "beaker"
  | "erlenmeyer"
  | "gasbottle"
  | "cylinder"
  | "dropper"
  | "dropbottle"
  | "reagentbottle"
  | "funnel"
  | "longfunnel"
  | "glassrod"
  | "evaporatingdish"
  | "alcohollamp"
  | "tripod"
  | "wiregauze"
  | "ironstand"
  | "spoon"
  | "tongs"
  | "tubeclamp"
  | "flask"
  | "volumetricflask"
  | "separatingfunnel"
  | "condenser"
  | "watchglass"
  | "mortar"
  | "watertrough"
  | "crucible";

export interface Instrument {
  id: string;
  name: string;
  category: InstrumentCategory;
  /** 常见规格 */
  spec: string;
  /** 材质 */
  material: string;
  shape: InstrumentShape;
  /** 用途（一句话） */
  short: string;
  /** 安全使用注意事项 */
  safety: string[];
  /** 涉及实验 */
  experiments: string[];
  /** 教材出处 */
  textbook: string;
}

export const INSTRUMENTS: Instrument[] = [
  {
    id: "testtube",
    name: "试管",
    category: "反应容器",
    spec: "常用 Φ10–20 mm，长度 75–200 mm",
    material: "硼硅玻璃",
    shape: "testtube",
    short: "少量试剂的反应容器，可直接加热",
    safety: [
      "加热时先擦干试管外壁，防止受热不均炸裂",
      "液体不超过试管容积的 1/3",
      "加热时先预热，再集中加热；试管口不得朝向人",
      "加热后不能骤冷，防止炸裂",
    ],
    experiments: [
      "少量试剂加热（加热固体或液体）",
      "用于氧气、二氧化碳制取及金属与酸、酸碱盐反应",
      "镁条、硫、铁丝等在氧气中燃烧的承接容器",
    ],
    textbook: "上册 第一单元课题2、第二单元课题3、第五至第七单元；下册 第八至第十单元多处",
  },
  {
    id: "beaker",
    name: "烧杯",
    category: "反应容器",
    spec: "常用 50、100、250、500 mL",
    material: "玻璃",
    shape: "beaker",
    short: "配制溶液和大量试剂的反应容器",
    safety: [
      "加热时需垫石棉网，不能直接加热",
      "外壁有水需擦干后再加热",
      "溶解固体时用玻璃棒搅拌，防止局部过热",
    ],
    experiments: [
      "配制溶液（如氯化钠溶液、硫酸铜溶液）",
      "酸碱中和反应、沉淀反应",
      "二氧化碳使石灰水变浑浊等检验实验",
    ],
    textbook: "上册 第一单元课题2；下册 第九单元课题3、第十单元多处",
  },
  {
    id: "erlenmeyer",
    name: "锥形瓶",
    category: "反应容器",
    spec: "常用 100、150、250 mL",
    material: "玻璃",
    shape: "erlenmeyer",
    short: "反应容器，可加热；振荡方便，常用于滴定",
    safety: [
      "加热时需垫石棉网",
      "装配气体发生装置时注意气密性检查",
    ],
    experiments: [
      "实验室制取二氧化碳的发生装置",
      "白磷燃烧测定空气中氧气含量实验",
      "中和反应（滴加指示剂）",
    ],
    textbook: "上册 第二单元课题1、第六单元课题2",
  },
  {
    id: "gasbottle",
    name: "集气瓶",
    category: "反应容器",
    spec: "常用 125、250 mL",
    material: "玻璃",
    shape: "gasbottle",
    short: "用于收集或贮存少量气体",
    safety: [
      "燃烧实验（铁丝等）前瓶底要留少量水或铺细沙",
      "排水集气法收集时先装满水并盖好玻璃片",
    ],
    experiments: [
      "排水法 / 向上排空气法收集氧气、二氧化碳",
      "铁丝在氧气中燃烧（瓶底放水或细沙）",
      "硫、木炭在氧气中燃烧的集气实验",
    ],
    textbook: "上册 第二单元课题2、课题3；第六单元课题2",
  },
  {
    id: "cylinder",
    name: "量筒",
    category: "计量仪器",
    spec: "常用 10、50、100 mL",
    material: "玻璃",
    shape: "cylinder",
    short: "量度液体体积",
    safety: [
      "不能加热，不能用于配制溶液或作反应容器",
      "读数时视线要与液体凹液面最低处保持水平",
      "量程选择要略大于所量液体体积",
    ],
    experiments: [
      "量取一定体积的水或溶液",
      "配制一定溶质质量分数的溶液",
    ],
    textbook: "上册 第一单元课题2；下册 第九单元课题3",
  },
  {
    id: "dropper",
    name: "胶头滴管",
    category: "其他",
    spec: "常用 2–5 mL",
    material: "玻璃 / 橡胶",
    shape: "dropper",
    short: "用于吸取和滴加少量液体",
    safety: [
      "胶帽在上，不能倒置或平放，防止液体流入胶帽",
      "使用后立即清洗，不能不经清洗再吸取其他试剂",
      "不能伸入容器内滴加，应悬空滴加",
    ],
    experiments: [
      "滴加指示剂（酚酞、石蕊）",
      "滴加少量稀盐酸、稀硫酸等",
    ],
    textbook: "上册 第一单元课题2、第十单元多处",
  },
  {
    id: "dropbottle",
    name: "滴瓶",
    category: "其他",
    spec: "常用 30、60、125 mL",
    material: "玻璃 / 橡胶",
    shape: "dropbottle",
    short: "盛放液体药品，配合滴管滴加",
    safety: [
      "滴瓶上的滴管与滴瓶配套，不能混用",
      "盛碱液时不能用磨口玻璃塞（用胶塞）",
    ],
    experiments: ["盛放石蕊试液、酚酞试液等少量液体试剂"],
    textbook: "上册 第一单元课题2",
  },
  {
    id: "reagentbottle",
    name: "试剂瓶",
    category: "其他",
    spec: "广口瓶 / 细口瓶",
    material: "玻璃",
    shape: "reagentbottle",
    short: "盛放药品：广口瓶放固体，细口瓶放液体",
    safety: [
      "取用药品后立即盖好瓶塞",
      "标签朝向手心，防止残留药液腐蚀标签",
      "固体药品用广口瓶，液体药品用细口瓶",
    ],
    experiments: ["实验室药品的分类存放与取用"],
    textbook: "上册 第一单元课题2、课题3",
  },
  {
    id: "funnel",
    name: "漏斗",
    category: "其他",
    spec: "常用口径 40–100 mm",
    material: "玻璃",
    shape: "funnel",
    short: "过滤、向小口容器倾倒液体",
    safety: [
      "过滤时滤纸边缘低于漏斗口，液面低于滤纸边缘",
      "漏斗下端管口紧靠烧杯内壁",
    ],
    experiments: [
      "过滤浑浊的河水 / 除去不溶性杂质",
      "向细口瓶转移液体",
    ],
    textbook: "上册 第四单元课题2（水的净化）",
  },
  {
    id: "longfunnel",
    name: "长颈漏斗",
    category: "其他",
    spec: "漏斗口径 30–50 mm",
    material: "玻璃",
    shape: "longfunnel",
    short: "向反应装置中加液体，可控制加液",
    safety: [
      "长颈漏斗下端管口必须伸入液面以下（液封）",
      "用于制取气体时防止气体逸出",
    ],
    experiments: ["实验室制取二氧化碳、氢气的发生装置加液"],
    textbook: "上册 第六单元课题2（二氧化碳制取）",
  },
  {
    id: "glassrod",
    name: "玻璃棒",
    category: "其他",
    spec: "常用 Φ5–8 mm，长 150–300 mm",
    material: "玻璃",
    shape: "glassrod",
    short: "搅拌、引流、蘸取液体",
    safety: [
      "搅拌时不能碰撞容器壁，防止打碎",
      "引流时下端紧靠接收容器内壁",
    ],
    experiments: [
      "溶解时搅拌加速",
      "过滤时引流",
      "蘸取溶液测 pH 或做焰色观察",
    ],
    textbook: "上册 第一单元课题2、第四单元课题2",
  },
  {
    id: "evaporatingdish",
    name: "蒸发皿",
    category: "加热仪器",
    spec: "常用口径 75、90 mm",
    material: "瓷",
    shape: "evaporatingdish",
    short: "蒸发浓缩溶液",
    safety: [
      "可直接加热，液体不超过容积的 2/3",
      "蒸发时用玻璃棒不断搅拌，防止液滴飞溅",
      "接近蒸干时停止加热，利用余热蒸干",
    ],
    experiments: [
      "蒸发氯化钠溶液获得食盐晶体",
      "海水晒盐原理演示",
    ],
    textbook: "上册 第四单元课题2（水的净化）；下册 第十一单元课题1（粗盐提纯）",
  },
  {
    id: "alcohollamp",
    name: "酒精灯",
    category: "加热仪器",
    spec: "常用 150、250 mL",
    material: "玻璃 / 金属",
    shape: "alcohollamp",
    short: "实验室常用热源",
    safety: [
      "禁止向燃着的酒精灯添加酒精",
      "禁止用嘴吹灭，应用灯帽盖灭",
      "禁止用燃着的酒精灯点燃另一盏",
      "失火时用湿抹布盖灭",
    ],
    experiments: ["几乎所有加热类实验的热源（给试管、烧杯、蒸发皿加热）"],
    textbook: "上册 第一单元课题3（走进化学实验室）",
  },
  {
    id: "ironstand",
    name: "铁架台",
    category: "夹持工具",
    spec: "配铁圈、铁夹",
    material: "铸铁",
    shape: "ironstand",
    short: "固定和支持反应容器",
    safety: [
      "夹持试管时不要过紧，防止夹碎",
      "固定烧瓶等容器时要垫石棉网",
      "重心要稳，防止倾倒",
    ],
    experiments: [
      "固定试管、烧瓶进行加热或制气",
      "过滤装置的固定",
    ],
    textbook: "上册 第一单元课题3、第二单元课题3",
  },
  {
    id: "wiregauze",
    name: "石棉网",
    category: "加热仪器",
    spec: "常用 100×100、125×125 mm",
    material: "铁丝网 + 石棉",
    shape: "wiregauze",
    short: "垫在烧杯、烧瓶下方使受热均匀",
    safety: ["不能直接接触明火太长时间，石棉会脱落"],
    experiments: ["烧杯、烧瓶、锥形瓶加热时作衬垫"],
    textbook: "上册 第一单元课题3",
  },
  {
    id: "tongs",
    name: "坩埚钳",
    category: "夹持工具",
    spec: "长 200–300 mm",
    material: "铁 / 不锈钢",
    shape: "tongs",
    short: "夹持坩埚、蒸发皿等高温容器",
    safety: ["夹取高温容器时防止烫伤，放置于石棉网上"],
    experiments: ["移动坩埚、蒸发皿；夹取燃烧物（木炭等）"],
    textbook: "上册 第一单元课题3",
  },
  {
    id: "spoon",
    name: "药匙",
    category: "其他",
    spec: "大小两端",
    material: "塑料 / 不锈钢",
    shape: "spoon",
    short: "取用粉末状或颗粒状固体药品",
    safety: ["取用后擦净，一匙多用需清洗", "用药匙取粉末后剩余的药品不能放回原瓶"],
    experiments: ["取用高锰酸钾、氯酸钾、碳酸钙粉末等固体"],
    textbook: "上册 第一单元课题3",
  },
  {
    id: "tubeclamp",
    name: "试管夹",
    category: "夹持工具",
    spec: "木质 / 竹质",
    material: "木材",
    shape: "tubeclamp",
    short: "夹持试管进行加热",
    safety: ["夹在试管中上部，防止烧焦", "夹持时不能太紧，防止夹碎试管"],
    experiments: ["夹持试管加热液体或固体"],
    textbook: "上册 第一单元课题3",
  },
  {
    id: "flask",
    name: "圆底烧瓶",
    category: "反应容器",
    spec: "常用 250、500 mL",
    material: "玻璃",
    shape: "flask",
    short: "可加热的反应容器，常用于制气或蒸馏",
    safety: ["加热时垫石棉网，不能干烧", "瓶壁较薄，防止碰撞"],
    experiments: ["加热制取气体（需均匀受热）、蒸馏实验"],
    textbook: "上册 第二单元课题3；下册 第十一单元多处",
  },
  {
    id: "volumetricflask",
    name: "容量瓶",
    category: "计量仪器",
    spec: "常用 100、250、500 mL",
    material: "玻璃",
    shape: "volumetricflask",
    short: "配制一定体积、一定物质的量浓度的溶液",
    safety: ["不能加热，不能长期存放溶液", "刻度线以下不能有气泡"],
    experiments: ["配制精确浓度的溶液（高中延伸，初中了解）"],
    textbook: "下册 第九单元课题3（溶液配制，延伸）",
  },
  {
    id: "separatingfunnel",
    name: "分液漏斗",
    category: "其他",
    spec: "常用 60、125、250 mL",
    material: "玻璃",
    shape: "separatingfunnel",
    short: "分离不相溶的液体或控制滴加速度",
    safety: ["使用前检查活塞与瓶塞是否严密", "分液时下层液体从下口流出，上层液体从上口倒出"],
    experiments: ["分离水和植物油等互不相溶的液体"],
    textbook: "下册 第九单元课题1",
  },
  {
    id: "condenser",
    name: "冷凝管",
    category: "其他",
    spec: "直形，长 200–400 mm",
    material: "玻璃",
    shape: "condenser",
    short: "蒸馏时冷却蒸气为液体",
    safety: ["冷却水从下口进、上口出", "不能骤冷骤热"],
    experiments: ["蒸馏水的制取（蒸馏实验）"],
    textbook: "上册 第四单元课题2（水的净化）",
  },
  {
    id: "watchglass",
    name: "表面皿",
    category: "其他",
    spec: "常用口径 60–100 mm",
    material: "玻璃",
    shape: "watchglass",
    short: "观察反应、承接少量固体",
    safety: ["不能加热"],
    experiments: ["观察晶体、承接少量固体药品"],
    textbook: "上册 第一单元课题2",
  },
  {
    id: "mortar",
    name: "研钵",
    category: "其他",
    spec: "配研杵",
    material: "瓷",
    shape: "mortar",
    short: "研碎固体药品",
    safety: ["研磨时不得用力过猛", "用后及时清洗干净"],
    experiments: ["研碎高锰酸钾、硫酸铜等固体"],
    textbook: "上册 第一单元课题2",
  },
  {
    id: "watertrough",
    name: "水槽",
    category: "其他",
    spec: "玻璃 / 塑料",
    material: "玻璃",
    shape: "watertrough",
    short: "盛水，用于排水集气法收集气体",
    safety: ["水面与瓶口齐平，防止气体逸出"],
    experiments: ["排水法收集氧气、氢气等难溶于水的气体"],
    textbook: "上册 第二单元课题3",
  },
  {
    id: "crucible",
    name: "坩埚",
    category: "加热仪器",
    spec: "配坩埚钳、泥三角",
    material: "瓷",
    shape: "crucible",
    short: "高温灼烧固体",
    safety: ["灼烧后的坩埚放在石棉网上冷却，不能直接放桌上"],
    experiments: ["灼烧碳酸钙、木炭等固体"],
    textbook: "上册 第一单元课题3（延伸）",
  },
];

export const INSTRUMENT_CATEGORIES: InstrumentCategory[] = [
  "反应容器",
  "加热仪器",
  "计量仪器",
  "夹持工具",
  "其他",
];
