import { Team, Match } from './types';

export interface TeamStanding {
  teamId: number;
  teamName: string;
  teamFlag: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  rank: number;
}

export interface GroupStandings {
  group: string;
  standings: TeamStanding[];
}

export function calculateGroupStandings(teams: Team[], matches: Match[]): GroupStandings[] {
  const groups = new Map<string, Map<number, TeamStanding>>();

  // 初始化每个球队的积分榜数据
  teams.forEach(team => {
    if (!groups.has(team.group)) {
      groups.set(team.group, new Map());
    }
    groups.get(team.group)!.set(team.id, {
      teamId: team.id,
      teamName: team.nameCn,
      teamFlag: team.flag,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      rank: 0
    });
  });

  // 统计已完成的比赛
  matches.forEach(match => {
    if (match.status === 'finished' && match.homeScore !== null && match.awayScore !== null) {
      const homeStanding = groups.get(match.group)?.get(match.homeTeamId);
      const awayStanding = groups.get(match.group)?.get(match.awayTeamId);

      if (homeStanding && awayStanding) {
        homeStanding.played++;
        awayStanding.played++;
        homeStanding.goalsFor += match.homeScore;
        homeStanding.goalsAgainst += match.awayScore;
        awayStanding.goalsFor += match.awayScore;
        awayStanding.goalsAgainst += match.homeScore;

        if (match.homeScore > match.awayScore) {
          homeStanding.wins++;
          homeStanding.points += 3;
          awayStanding.losses++;
        } else if (match.homeScore < match.awayScore) {
          awayStanding.wins++;
          awayStanding.points += 3;
          homeStanding.losses++;
        } else {
          homeStanding.draws++;
          awayStanding.draws++;
          homeStanding.points += 1;
          awayStanding.points += 1;
        }
      }
    }
  });

  // 计算净胜球并排序
  const result: GroupStandings[] = [];
  groups.forEach((standingsMap, group) => {
    const standings = Array.from(standingsMap.values());
    standings.forEach(standing => {
      standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
    });

    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    standings.forEach((standing, index) => {
      standing.rank = index + 1;
    });

    result.push({ group, standings });
  });

  return result.sort((a, b) => a.group.localeCompare(b.group));
}