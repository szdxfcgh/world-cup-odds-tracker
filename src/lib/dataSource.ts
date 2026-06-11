import fs from 'fs/promises';
import path from 'path';
import type { Match, Team } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function readMatches(): Promise<Match[]> {
  const raw = await fs.readFile(path.join(DATA_DIR, 'matches.json'), 'utf-8');
  return JSON.parse(raw);
}

export async function writeMatches(matches: Match[]): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, 'matches.json'),
    JSON.stringify(matches, null, 2)
  );
}

export async function readTeams(): Promise<Team[]> {
  const raw = await fs.readFile(path.join(DATA_DIR, 'teams.json'), 'utf-8');
  return JSON.parse(raw);
}

/** 用 API 返回的实时数据更新现有比赛记录（仅覆盖比分和状态） */
export function mergeLiveScores(existing: Match[], live: Match[]): Match[] {
  const liveMap = new Map(live.map((m) => [m.id, m]));
  return existing.map((match) => {
    const liveMatch = liveMap.get(match.id);
    if (!liveMatch) return match;
    return {
      ...match,
      homeScore: liveMatch.homeScore ?? match.homeScore,
      awayScore: liveMatch.awayScore ?? match.awayScore,
      status: liveMatch.status ?? match.status,
      homeWinOdds: liveMatch.homeWinOdds ?? match.homeWinOdds,
      drawOdds: liveMatch.drawOdds ?? match.drawOdds,
      awayWinOdds: liveMatch.awayWinOdds ?? match.awayWinOdds,
    };
  });
}
