import type { Metadata } from 'next';
import Navigation from '../../components/Navigation';
import TeamCard from '../../components/TeamCard';
import PageHeader from '../../components/PageHeader';
import { Team } from '../../lib/types';
import teamsData from '../../../data/teams.json';

export const metadata: Metadata = {
  title: '球队档案',
  description: '浏览 2026 世界杯 48 支参赛球队的详细资料',
};

export default function TeamsPage() {
  const teams = teamsData as Team[];
  return (
    <div className="min-h-screen">
      <Navigation currentPage="teams" />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PageHeader eyebrow="TEAM DIRECTORY" title="球队档案" description="48 支球队的排名、历史成绩、主教练与关键球员资料。" />
        <div className="space-y-12">
          {'ABCDEFGHIJKL'.split('').map((group) => (
            <section key={group}>
              <div className="mb-4 flex items-center gap-3 border-b border-[var(--wc-card-border)] pb-3">
                <span className="font-mono text-xs font-black text-[var(--wc-emerald)]">GROUP {group}</span>
                <span className="text-xs text-[var(--wc-text-muted)]">4 TEAMS</span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {teams.filter((team) => team.group === group).map((team) => <TeamCard key={team.id} team={team} />)}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
