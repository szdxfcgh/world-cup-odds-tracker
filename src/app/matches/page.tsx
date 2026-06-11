import type { Metadata } from 'next';
import Navigation from '../../components/Navigation';
import MatchCard from '../../components/MatchCard';
import PageHeader from '../../components/PageHeader';
import { readMatches, readTeams } from '../../lib/dataSource';

export const metadata: Metadata = {
  title: '比赛赛程',
  description: '查看 2026 世界杯比赛安排、开赛时间与预测分析',
};

export default async function MatchesPage() {
  const teams = await readTeams();
  const matches = await readMatches();
  const getTeamById = (id: number) => teams.find((team) => team.id === id)!;

  return (
    <div className="min-h-screen">
      <Navigation currentPage="matches" />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PageHeader eyebrow="MATCHDAY ARCHIVE" title="比赛赛程" description="按比赛日浏览完整赛程、模型预测、赔率与编辑分析。" />
        <div className="space-y-6">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              homeTeam={getTeamById(match.homeTeamId)}
              awayTeam={getTeamById(match.awayTeamId)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
