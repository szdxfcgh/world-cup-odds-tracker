import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import TeamMark from '../../../components/TeamMark';
import { readTeams } from '../../../lib/dataSource';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const teams = await readTeams();
  const team = teams.find((item) => item.id === Number(id));
  return {
    title: team ? team.nameCn : '球队详情',
    description: team ? `${team.nameCn} (${team.nameEn}) 的 2026 世界杯球队资料` : '球队详情',
  };
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teams = await readTeams();
  const team = teams.find((item) => item.id === Number(id));
  if (!team) notFound();

  const keyPlayers = team.keyPlayers?.split(',').map((player) => player.trim()).filter(Boolean) ?? [];
  const resultSections = team.recentResults?.split(';').map((section) => section.trim()).filter(Boolean) ?? [];

  return (
    <div className="min-h-screen">
      <Navigation currentPage="teams" />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <article className="wc-card overflow-hidden">
          <header className="relative overflow-hidden border-b border-[var(--wc-card-border)] p-7 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgba(180,140,40,.08),transparent_40%),radial-gradient(ellipse_at_20%_85%,rgba(160,50,30,.06),transparent_35%),linear-gradient(145deg,rgba(31,23,18,.6),transparent_55%)]" />
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <div className="flex items-center gap-5">
                <TeamMark team={team} size="lg" />
                <div>
                  <p className="wc-kicker">{team.group} 组 / 球队资料</p>
                  <h1 className="mt-2 text-4xl font-black tracking-[-.055em] md:text-6xl">{team.nameCn}</h1>
                  <p className="mt-2 uppercase tracking-[.12em] text-[var(--wc-text-muted)]">{team.nameEn}</p>
                </div>
              </div>
              <span className="font-mono text-6xl font-black text-[rgba(180,140,40,.06)]">{team.group}</span>
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
                <p className="wc-kicker">技术团队</p>
                <h2 className="mt-2 text-lg font-black">主教练</h2>
                <p className="mt-3 rounded-xl bg-[var(--wc-surface-muted)] p-4 text-sm text-[var(--wc-text-secondary)]">
                  {team.coach ?? '待补充'}
                </p>
                <p className="wc-kicker mt-8">核心球员</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {keyPlayers.map((player) => (
                    <span key={player} className="rounded-full border border-[var(--wc-card-border)] px-3 py-1.5 text-xs text-[var(--wc-text-secondary)]">
                      {player}
                    </span>
                  ))}
                </div>
              </aside>

              <section>
                <p className="wc-kicker">近年记录</p>
                <h2 className="mt-2 text-lg font-black">近年战绩</h2>
                <div className="mt-4 space-y-4">
                  {resultSections.map((section) => (
                    <p key={section} className="border-l-2 border-[var(--wc-emerald)] py-1 pl-4 text-sm leading-8 text-[var(--wc-text-secondary)]">
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
