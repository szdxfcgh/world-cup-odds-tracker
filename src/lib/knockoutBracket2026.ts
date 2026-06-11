export type KnockoutRound = "R32" | "R16" | "QF" | "SF" | "F" | "TP";

export type QuarterZone = "A" | "B" | "C" | "D";

export type KnockoutMatch = {
  id: string;
  round: KnockoutRound;
  quarter?: QuarterZone;
  order: number;
  homeSeed: string;
  awaySeed: string;
  nextMatchId?: string;
};

export const knockoutMatches2026: KnockoutMatch[] = [
  // ========== 32强 R32 ==========
  // 1/4区 A（上半区1）
  { id: "M74", round: "R32", quarter: "A", order: 1, homeSeed: "1E", awaySeed: "3ABCDF", nextMatchId: "M89" },
  { id: "M77", round: "R32", quarter: "A", order: 2, homeSeed: "1I", awaySeed: "3CDFGH", nextMatchId: "M89" },
  { id: "M73", round: "R32", quarter: "A", order: 3, homeSeed: "2A", awaySeed: "2B", nextMatchId: "M90" },
  { id: "M75", round: "R32", quarter: "A", order: 4, homeSeed: "1F", awaySeed: "2C", nextMatchId: "M90" },

  // 1/4区 B（上半区2）
  { id: "M83", round: "R32", quarter: "B", order: 1, homeSeed: "2K", awaySeed: "2L", nextMatchId: "M93" },
  { id: "M84", round: "R32", quarter: "B", order: 2, homeSeed: "1H", awaySeed: "2J", nextMatchId: "M93" },
  { id: "M81", round: "R32", quarter: "B", order: 3, homeSeed: "1D", awaySeed: "3BEFIJ", nextMatchId: "M94" },
  { id: "M82", round: "R32", quarter: "B", order: 4, homeSeed: "1G", awaySeed: "3AEHIJ", nextMatchId: "M94" },

  // 1/4区 C（下半区1）
  { id: "M76", round: "R32", quarter: "C", order: 1, homeSeed: "1C", awaySeed: "2F", nextMatchId: "M91" },
  { id: "M78", round: "R32", quarter: "C", order: 2, homeSeed: "2E", awaySeed: "2I", nextMatchId: "M91" },
  { id: "M79", round: "R32", quarter: "C", order: 3, homeSeed: "1A", awaySeed: "3CEFHI", nextMatchId: "M92" },
  { id: "M80", round: "R32", quarter: "C", order: 4, homeSeed: "1L", awaySeed: "3EHIJK", nextMatchId: "M92" },

  // 1/4区 D（下半区2）
  { id: "M86", round: "R32", quarter: "D", order: 1, homeSeed: "1J", awaySeed: "2H", nextMatchId: "M95" },
  { id: "M88", round: "R32", quarter: "D", order: 2, homeSeed: "2D", awaySeed: "2G", nextMatchId: "M95" },
  { id: "M85", round: "R32", quarter: "D", order: 3, homeSeed: "1B", awaySeed: "3EFGIJ", nextMatchId: "M96" },
  { id: "M87", round: "R32", quarter: "D", order: 4, homeSeed: "1K", awaySeed: "3DEIJL", nextMatchId: "M96" },

  // ========== 16强 R16 ==========
  // 1/4区 A
  { id: "M89", round: "R16", quarter: "A", order: 1, homeSeed: "M74胜者", awaySeed: "M77胜者", nextMatchId: "M97" },
  { id: "M90", round: "R16", quarter: "A", order: 2, homeSeed: "M73胜者", awaySeed: "M75胜者", nextMatchId: "M97" },

  // 1/4区 B
  { id: "M93", round: "R16", quarter: "B", order: 1, homeSeed: "M83胜者", awaySeed: "M84胜者", nextMatchId: "M98" },
  { id: "M94", round: "R16", quarter: "B", order: 2, homeSeed: "M81胜者", awaySeed: "M82胜者", nextMatchId: "M98" },

  // 1/4区 C
  { id: "M91", round: "R16", quarter: "C", order: 1, homeSeed: "M76胜者", awaySeed: "M78胜者", nextMatchId: "M99" },
  { id: "M92", round: "R16", quarter: "C", order: 2, homeSeed: "M79胜者", awaySeed: "M80胜者", nextMatchId: "M99" },

  // 1/4区 D
  { id: "M95", round: "R16", quarter: "D", order: 1, homeSeed: "M86胜者", awaySeed: "M88胜者", nextMatchId: "M100" },
  { id: "M96", round: "R16", quarter: "D", order: 2, homeSeed: "M85胜者", awaySeed: "M87胜者", nextMatchId: "M100" },

  // ========== 8强 QF ==========
  { id: "M97", round: "QF", quarter: "A", order: 1, homeSeed: "M89胜者", awaySeed: "M90胜者", nextMatchId: "M101" },
  { id: "M98", round: "QF", quarter: "B", order: 1, homeSeed: "M93胜者", awaySeed: "M94胜者", nextMatchId: "M101" },
  { id: "M99", round: "QF", quarter: "C", order: 1, homeSeed: "M91胜者", awaySeed: "M92胜者", nextMatchId: "M102" },
  { id: "M100", round: "QF", quarter: "D", order: 1, homeSeed: "M95胜者", awaySeed: "M96胜者", nextMatchId: "M102" },

  // ========== 半决赛 SF ==========
  { id: "M101", round: "SF", order: 1, homeSeed: "M97胜者", awaySeed: "M98胜者", nextMatchId: "M103" },
  { id: "M102", round: "SF", order: 2, homeSeed: "M99胜者", awaySeed: "M100胜者", nextMatchId: "M103" },

  // ========== 决赛 F ==========
  { id: "M103", round: "F", order: 1, homeSeed: "M101胜者", awaySeed: "M102胜者" },
];

export const roundLabels: Record<KnockoutRound, string> = {
  R32: "32强",
  R16: "16强",
  QF: "8强（1/4决赛）",
  SF: "半决赛",
  F: "决赛",
  TP: "季军赛",
};

export const quarterLabels: Record<QuarterZone, string> = {
  A: "1/4区 A（上半区1）",
  B: "1/4区 B（上半区2）",
  C: "1/4区 C（下半区1）",
  D: "1/4区 D（下半区2）",
};

// 种子位标签函数
export function seedLabel(seed: string): string {
  // 1X = X组第1
  if (/^1[A-L]$/.test(seed)) {
    return `${seed[1]}组第1`;
  }
  // 2X = X组第2
  if (/^2[A-L]$/.test(seed)) {
    return `${seed[1]}组第2`;
  }
  // 3XXXX = 最佳第三候选池
  if (/^3[A-L]+$/.test(seed)) {
    const groups = seed.slice(1).split("").join("/");
    return `最佳第三（${groups}之一）`;
  }
  // MXX胜者 = 第XX场胜者
  if (/^M\d+胜者$/.test(seed)) {
    const matchNum = seed.replace("M", "").replace("胜者", "");
    return `第${matchNum}场胜者`;
  }
  return seed;
}

// 获取某轮次某区的比赛
export function getMatchesByQuarter(round: KnockoutRound, quarter: QuarterZone): KnockoutMatch[] {
  return knockoutMatches2026
    .filter((m) => m.round === round && m.quarter === quarter)
    .sort((a, b) => a.order - b.order);
}

// 获取某轮次的所有比赛
export function getMatchesByRound(round: KnockoutRound): KnockoutMatch[] {
  return knockoutMatches2026
    .filter((m) => m.round === round)
    .sort((a, b) => a.order - b.order);
}

// 按ID获取比赛
export function getMatchById(id: string): KnockoutMatch | undefined {
  return knockoutMatches2026.find((m) => m.id === id);
}

// 四个1/4区的比赛分布
export const quarterMatchIds: Record<QuarterZone, { R32: string[]; R16: string[]; QF: string[] }> = {
  A: { R32: ["M74", "M77", "M73", "M75"], R16: ["M89", "M90"], QF: ["M97"] },
  B: { R32: ["M83", "M84", "M81", "M82"], R16: ["M93", "M94"], QF: ["M98"] },
  C: { R32: ["M76", "M78", "M79", "M80"], R16: ["M91", "M92"], QF: ["M99"] },
  D: { R32: ["M86", "M88", "M85", "M87"], R16: ["M95", "M96"], QF: ["M100"] },
};
