import type { Metadata } from 'next';
import Navigation from '../../components/Navigation';
import GroupStandingsComponent from '../../components/GroupStandings';
import PageHeader from '../../components/PageHeader';
import { calculateGroupStandings } from '../../lib/standings';
import { readMatches, readTeams } from '../../lib/dataSource';

export const metadata: Metadata = {
  title: '小组积分',
  description: '追踪 2026 世界杯各小组排名与积分变化',
};

export default async function StandingsPage() {
  const teams = await readTeams();
  const matches = await readMatches();
  const groups = calculateGroupStandings(teams, matches);
  return (
    <div className="min-h-screen">
      <Navigation currentPage="standings" />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PageHeader eyebrow="GROUP TABLES" title="小组积分" description="12 个小组的实时排名、净胜球和晋级位置总览。" />
        <GroupStandingsComponent groups={groups} />
      </main>
    </div>
  );
}
