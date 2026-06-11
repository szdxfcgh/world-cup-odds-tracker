import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readMatches, writeMatches } from '@/lib/dataSource';
import type { Match } from '@/lib/types';

// The Odds API 配置
const ODDS_API_BASE = 'https://api.the-odds-api.com/v4';
const ODDS_API_KEY = process.env.ODDS_API_KEY;

interface OddsMatch {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      last_update: string;
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

interface ScoresMatch {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  completed: boolean;
  home_team: string;
  away_team: string;
  scores: Array<{
    name: string;
    score: string;
  }> | null;
  last_update: string | null;
}

/** 从 The Odds API 获取世界杯赔率 */
async function fetchOddsData(): Promise<OddsMatch[] | null> {
  if (!ODDS_API_KEY) return null;
  
  try {
    const url = `${ODDS_API_BASE}/sports/soccer_fifa_world_cup/odds?regions=eu&markets=h2h&apiKey=${ODDS_API_KEY}`;
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/** 从 The Odds API 获取世界杯比分 */
async function fetchScoresData(): Promise<ScoresMatch[] | null> {
  if (!ODDS_API_KEY) return null;
  
  try {
    const url = `${ODDS_API_BASE}/sports/soccer_fifa_world_cup/scores?daysFrom=3&apiKey=${ODDS_API_KEY}`;
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/** 计算多个博彩公司的平均赔率 */
function calculateAverageOdds(
  bookmakers: OddsMatch['bookmakers'],
  homeTeam: string,
  awayTeam: string
): {
  homeWinOdds: number | null;
  drawOdds: number | null;
  awayWinOdds: number | null;
} {
  if (!bookmakers || bookmakers.length === 0) {
    return { homeWinOdds: null, drawOdds: null, awayWinOdds: null };
  }

  let homeSum = 0, drawSum = 0, awaySum = 0;
  let homeCount = 0, drawCount = 0, awayCount = 0;

  for (const bookmaker of bookmakers) {
    const market = bookmaker.markets?.find(m => m.key === 'h2h');
    if (!market?.outcomes) continue;

    for (const outcome of market.outcomes) {
      if (outcome.name === homeTeam) {
        homeSum += outcome.price;
        homeCount++;
      } else if (outcome.name === 'Draw') {
        drawSum += outcome.price;
        drawCount++;
      } else if (outcome.name === awayTeam) {
        awaySum += outcome.price;
        awayCount++;
      }
    }
  }

  return {
    homeWinOdds: homeCount > 0 ? Math.round((homeSum / homeCount) * 100) / 100 : null,
    drawOdds: drawCount > 0 ? Math.round((drawSum / drawCount) * 100) / 100 : null,
    awayWinOdds: awayCount > 0 ? Math.round((awaySum / awayCount) * 100) / 100 : null,
  };
}

/** 通过球队名匹配找到对应的本地比赛 ID */
function findMatchIdByTeams(
  homeTeam: string,
  awayTeam: string,
  existingMatches: Match[]
): number | null {
  // 球队名映射表（API 英文名 -> 本地 ID）
  // 从 teams.json 提取的完整映射
  const teamNameMap: Record<string, number> = {
    // A 组
    'Mexico': 1, 'South Africa': 2, 'Korea Republic': 3, 'Czechia': 4,
    // B 组
    'Canada': 5, 'Bosnia and Herzegovina': 6, 'Qatar': 7, 'Switzerland': 8,
    // C 组
    'Brazil': 9, 'Morocco': 10, 'Haiti': 11, 'Scotland': 12,
    // D 组
    'United States': 13, 'Paraguay': 14, 'Australia': 15, 'Türkiye': 16,
    // E 组
    'Germany': 17, 'Curaçao': 18, "Côte d'Ivoire": 19, 'Ecuador': 20,
    // F 组
    'Netherlands': 21, 'Japan': 22, 'Argentina': 23, 'Nigeria': 24,
    // G 组
    'France': 25, 'Egypt': 26, 'Spain': 27, 'Norway': 28,
    // H 组
    'England': 29, 'Chile': 30, 'Portugal': 31, 'Saudi Arabia': 32,
    // I 组
    'Belgium': 33, 'New Zealand': 34, 'Colombia': 35, 'Tunisia': 36,
    // J 组
    'Uruguay': 37, 'Ghana': 38, 'Serbia': 39, 'China PR': 40,
    // K 组
    'Denmark': 41, 'Costa Rica': 42, 'Austria': 43, 'Iran': 44,
    // L 组
    'Croatia': 45, 'Cameroon': 46, 'Senegal': 47, 'Poland': 48,
    // 常见别名
    'USA': 13, 'South Korea': 3, 'Czech Republic': 4, 'Bosnia': 6,
    'Türkiye': 16, 'Turkey': 16, 'Ivory Coast': 19, 'Korea': 3,
    'Czechia': 4, 'Bosnia & Herzegovina': 6,
  };

  const homeId = teamNameMap[homeTeam];
  const awayId = teamNameMap[awayTeam];

  if (homeId && awayId) {
    const match = existingMatches.find(
      m => m.homeTeamId === homeId && m.awayTeamId === awayId
    );
    return match?.id ?? null;
  }

  return null;
}

/** 将赔率数据映射到本地比赛格式 */
function mapOddsToMatches(
  oddsData: OddsMatch[],
  existingMatches: Match[]
): Match[] {
  const updatedMatches = [...existingMatches];

  for (const oddsMatch of oddsData) {
    const matchId = findMatchIdByTeams(
      oddsMatch.home_team,
      oddsMatch.away_team,
      existingMatches
    );

    if (!matchId) continue;

    const odds = calculateAverageOdds(oddsMatch.bookmakers, oddsMatch.home_team, oddsMatch.away_team);
    const matchIndex = updatedMatches.findIndex(m => m.id === matchId);

    if (matchIndex !== -1) {
      updatedMatches[matchIndex] = {
        ...updatedMatches[matchIndex],
        homeWinOdds: odds.homeWinOdds ?? updatedMatches[matchIndex].homeWinOdds,
        drawOdds: odds.drawOdds ?? updatedMatches[matchIndex].drawOdds,
        awayWinOdds: odds.awayWinOdds ?? updatedMatches[matchIndex].awayWinOdds,
      };
    }
  }

  return updatedMatches;
}

/** 将比分数据映射到本地比赛格式 */
function mapScoresToMatches(
  scoresData: ScoresMatch[],
  existingMatches: Match[]
): Match[] {
  const updatedMatches = [...existingMatches];

  for (const scoreMatch of scoresData) {
    if (!scoreMatch.completed || !scoreMatch.scores) continue;

    const matchId = findMatchIdByTeams(
      scoreMatch.home_team,
      scoreMatch.away_team,
      existingMatches
    );

    if (!matchId) continue;

    const homeScore = scoreMatch.scores.find(
      s => s.name === scoreMatch.home_team
    )?.score;
    const awayScore = scoreMatch.scores.find(
      s => s.name === scoreMatch.away_team
    )?.score;

    const matchIndex = updatedMatches.findIndex(m => m.id === matchId);

    if (matchIndex !== -1 && homeScore && awayScore) {
      updatedMatches[matchIndex] = {
        ...updatedMatches[matchIndex],
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
        status: 'finished',
      };
    }
  }

  return updatedMatches;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. 读取现有数据
    const existingMatches = await readMatches();
    let updatedMatches = [...existingMatches];
    let oddsUpdated = 0;
    let scoresUpdated = 0;

    // 2. 获取赔率数据
    const oddsData = await fetchOddsData();
    if (oddsData && oddsData.length > 0) {
      updatedMatches = mapOddsToMatches(oddsData, updatedMatches);
      oddsUpdated = oddsData.length;
    }

    // 3. 获取比分数据
    const scoresData = await fetchScoresData();
    if (scoresData && scoresData.length > 0) {
      updatedMatches = mapScoresToMatches(scoresData, updatedMatches);
      scoresUpdated = scoresData.filter(s => s.completed).length;
    }

    // 4. 写入更新后的数据
    await writeMatches(updatedMatches);

    // 5. 刷新前端缓存
    revalidatePath('/');
    revalidatePath('/matches');
    revalidatePath('/standings');
    revalidatePath('/knockout');

    return NextResponse.json({
      success: true,
      message: `Updated ${oddsUpdated} matches with odds, ${scoresUpdated} matches with scores`,
      oddsUpdated,
      scoresUpdated,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
