import type { Metadata } from 'next';
import Navigation from '../../components/Navigation';
import TeamCard from '../../components/TeamCard';
import PageHeader from '../../components/PageHeader';
import { readTeams } from '../../lib/dataSource';

export const metadata: Metadata = {
  title: '球队档案',
  description: '浏览 2026 世界杯 48 支参赛球队的详细资料',
};

export default async function TeamsPage() {
  const teams = await readTeams();
  return (
    <div className="min-h-screen">
      <Navigation currentPage="teams" />
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <PageHeader eyebrow="TEAM DIRECTORY" title="球队档案" description="48 支球队的排名、历史成绩、主教练与关键球员资料。" />
        <div className="space-y-12">
          {'ABCDEFGHIJKL'.split('').map((group) => (
            <section key={group}>
              <div className="mb-5 flex items-center gap-3 border-b border-[rgba(180,140,40,.15)] pb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--wc-gold)] text-[#100c0a] font-mono text-[10px] font-black">{group}</span>
                <span className="font-mono text-xs font-black tracking-[.12em] text-[var(--wc-text)]">GROUP {group}</span>
                <span className="text-[10px] text-[var(--wc-text-muted)] tracking-[.08em]">4 TEAMS</span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
                {teams.filter((team) => team.group === group).map((team) => <TeamCard key={team.id} team={team} />)}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
