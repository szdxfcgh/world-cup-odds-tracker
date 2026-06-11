export interface Team {
  id: number;
  nameCn: string;
  nameEn: string;
  group: string;
  fifaRank: number | null;
  worldCupTitles: number | null;
  bestResult: string | null;
  flag: string;
  coach: string | null;
  keyPlayers: string | null;
  recentResults: string | null;
  source: string;
}

export interface Match {
  id: number;
  officialDateUtc: string;
  displayDateAsia: string;
  group: string;
  homeTeamId: number;
  awayTeamId: number;
  venue: string;
  city: string;
  source: string;
  homeWinOdds: number | null;
  drawOdds: number | null;
  awayWinOdds: number | null;
  predictedScore: string;
  riskLevel: string;
  recommendation: string;
  analysis: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "scheduled" | "finished";
}