import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import TeamMark from '../../../components/TeamMark';
import { Team } from '../../../lib/types';
import teamsData from '../../../../data/teams.json';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const team = teamsData.find((item) => item.id === Number(id));
  return {
    title: team ? team.nameCn : '球队详情',
    description: team ? `${team.nameCn} (${team.nameEn}) 的 2026 世界杯球队资料` : '球队详情',
  };
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = teamsData.find((item) => item.id === Number(id)) as Team | undefined;
  if (!team) notFound();

  const keyPlayers = team.keyPlayers?.split(',').map((player) => player.trim()).filter(Boolean) ?? [];
  const resultSections = team.recentResults?.split(';').map((section) => section.trim()).filter(Boolean) ?? [];

  return (
    <div className="min-h-screen">
      <Navigation currentPage="teams" />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <article className="wc-card overflow-hidden">
          <header className="relative overflow-hidden border-b border-[var(--wc-card-border)] p-7 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(111,242,173,.16),transparent_35%),linear-gradient(135deg,rgba(47,109,246,.12),transparent_48%)]" />
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <div className="flex items-center gap-5">
                <TeamMark team={team} size="lg" />
                <div>
                  <p className="wc-kicker">GROUP {team.group} / TEAM FILE</p>
                  <h1 className="mt-2 text-4xl font-black tracking-[-.055em] md:text-6xl">{team.nameCn}</h1>
                  <p className="mt-2 uppercase tracking-[.12em] text-[var(--wc-text-muted)]">{team.nameEn}</p>
                </div>
              </div>
              <span className="font-mono text-6xl font-black text-white/[.055]">{team.group}</span>
            </div>
          </header>

          <div className="p-6 md:p-9">
            <dl className="grid grid-cols-2 border-y border-[var(--wc-card-border)] md:grid-cols-4">
              {[
                ['FIFA 排名', team.fifaRank ?? '-'],
                ['世界杯冠军', team.worldCupTitles ?? 0],
                ['最佳成绩', team.bestResult ?? '-'],
                ['所属小组', team.group],
              ].map(([label, value], index) => (
                <div key={label} className={`p-4 text-center ${index > 0 ? 'border-l border-[var(--wc-card-border)]' : ''}`}>
                  <dt className="text-[10px] tracking-[.1em] text-[var(--wc-text-muted)]">{label}</dt>
                  <dd className="mt-2 font-mono text-lg font-black text-[var(--wc-emerald)]">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
              <aside>
                <p className="wc-kicker">TECHNICAL STAFF</p>
                <h2 className="mt-2 text-lg font-black">主教练</h2>
                <p className="mt-3 rounded-xl bg-[var(--wc-surface-muted)] p-4 text-sm text-[var(--wc-text-secondary)]">
                  {team.coach ?? '待补充'}
                </p>
                <p className="wc-kicker mt-8">KEY PLAYERS</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {keyPlayers.map((player) => (
                    <span key={player} className="rounded-full border border-[var(--wc-card-border)] px-3 py-1.5 text-xs text-[var(--wc-text-secondary)]">
                      {player}
                    </span>
                  ))}
                </div>
              </aside>

              <section>
                <p className="wc-kicker">RECENT RECORD</p>
                <h2 className="mt-2 text-lg font-black">近年战绩</h2>
                <div className="mt-4 space-y-3">
                  {resultSections.map((section) => (
                    <p key={section} className="border-l border-[var(--wc-emerald)] pl-4 text-sm leading-7 text-[var(--wc-text-secondary)]">
                      {section}
                    </p>
                  ))}
                </div>
              </section>
            </div>

            <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--wc-card-border)] pt-6 text-xs text-[var(--wc-text-muted)]">
              <span>数据来源：{team.source}</span>
              <Link href="/teams" className="font-black text-[var(--wc-emerald)]">返回球队目录 →</Link>
            </footer>
          </div>
        </article>
      </main>
    </div>
  );
}
