import Link from 'next/link';
import Navigation from '../components/Navigation';
import FeaturedMatch from '../components/FeaturedMatch';
import TeamMark from '../components/TeamMark';
import EditorialIcon from '../components/EditorialIcon';
import { readMatches, readTeams } from '../lib/dataSource';
import oddsData from '../../data/outrightOddsSnapshots.json';
import type { Match, Team } from '../lib/types';

const navCards = [
  { href: '/matches', icon: 'calendar' as const, title: '比赛赛程', desc: '完整比赛日、时间和预测分析' },
  { href: '/standings', icon: 'table' as const, title: '小组积分', desc: '12 个小组的实时排名视图' },
  { href: '/teams', icon: 'teams' as const, title: '球队档案', desc: '48 支球队的数据与阵容资料' },
  { href: '/odds', icon: 'chart' as const, title: '夺冠指数', desc: '赔率变化与市场热度曲线' },
  { href: '/knockout', icon: 'bracket' as const, title: '淘汰赛', desc: '32 强至决赛的完整路径' },
];

export default async function HomePage() {
  const teams = await readTeams();
  const matches = await readMatches();
  const featuredMatch = matches[0];
  const getTeam = (id: number) => teams.find((team) => team.id === id) as Team;
  const favorites = (oddsData as any).snapshots
    .filter((snapshot: any) => snapshot.snapshotStage === 'pre_tournament')
    .sort((a: any, b: any) => a.decimalOdds - b.decimalOdds)
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <Navigation currentPage="home" />

      <section className="hero-shell">
        <div className="hero-vignette" />
        <div className="hero-embers">
          <span className="ember" /><span className="ember" /><span className="ember" />
          <span className="ember" /><span className="ember" /><span className="ember" />
          <span className="ember" /><span className="ember" />
        </div>
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-actions">
              <Link href="/matches" className="wc-button-primary">进入比赛中心</Link>
              <Link href="/odds" className="wc-button-secondary">查看夺冠指数</Link>
            </div>
            <div className="hero-stats" aria-label="赛事数据摘要">
              <div className="hero-stat"><strong>{teams.length}</strong><span>参赛球队</span></div>
              <div className="hero-stat"><strong>12</strong><span>小组数量</span></div>
              <div className="hero-stat"><strong>{matches.length}</strong><span>已录入比赛</span></div>
            </div>
            <p className="hero-disclaimer">
              非官方赛事预测项目，人物形象仅用于编辑性展示，不暗示任何代言关系。
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl space-y-14 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section>
          <div className="section-heading">
            <div>
              <p className="wc-kicker">MATCHDAY COVER</p>
              <h2>焦点比赛</h2>
            </div>
            <p>ISSUE 01 / OPENING NIGHT</p>
          </div>
          <FeaturedMatch
            match={featuredMatch}
            homeTeam={getTeam(featuredMatch.homeTeamId)}
            awayTeam={getTeam(featuredMatch.awayTeamId)}
          />
        </section>

        <hr className="section-divider" />

        <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <section>
            <div className="section-heading">
              <div>
                <p className="wc-kicker">TODAY&apos;S FIXTURES</p>
                <h2>今日赛程</h2>
              </div>
              <p>ASIA / SHANGHAI TIME</p>
            </div>
            <div className="data-strip">
              {matches.slice(0, 4).map((match) => {
                const home = getTeam(match.homeTeamId);
                const away = getTeam(match.awayTeamId);
                const [, time = match.displayDateAsia] = match.displayDateAsia.split(' ');
                return (
                  <div className="data-row" key={match.id}>
                    <div className="data-row-time">{time}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <TeamMark team={home} size="sm" />
                        <span className="data-row-title">{home.nameCn}</span>
                        <span className="text-[var(--wc-text-muted)]">vs</span>
                        <span className="data-row-title">{away.nameCn}</span>
                        <TeamMark team={away} size="sm" />
                      </div>
                      <p className="data-row-meta">小组 {match.group} · {match.city}</p>
                    </div>
                    <div className="data-row-value">{match.recommendation}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="section-heading">
              <div>
                <p className="wc-kicker">POWER INDEX</p>
                <h2>夺冠热门</h2>
              </div>
              <p>LOWER ODDS / HIGHER HEAT</p>
            </div>
            <div className="data-strip">
              {favorites.map((favorite, index) => {
                const team = getTeam(Number(favorite.teamId));
                return (
                  <div className="data-row" key={favorite.id}>
                    <div className="data-row-time">0{index + 1}</div>
                    <div className="flex items-center gap-3">
                      <TeamMark team={team} size="sm" />
                      <div>
                        <p className="data-row-title">{favorite.teamNameCn}</p>
                        <p className="data-row-meta">{favorite.teamNameEn}</p>
                      </div>
                    </div>
                    <div className="data-row-value">{favorite.decimalOdds.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <hr className="section-divider" />

        <section>
          <div className="section-heading">
            <div>
              <p className="wc-kicker">DIRECTORY</p>
              <h2>快速目录</h2>
            </div>
            <p>FIVE DATA DESKS</p>
          </div>
          <div className="editorial-index">
            {navCards.map((card) => (
              <Link key={card.href} href={card.href}>
                <EditorialIcon name={card.icon} />
                <strong>{card.title}</strong>
                <span>{card.desc}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(201,148,46,.08)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-[11px] text-[var(--wc-text-muted)] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8" style={{ letterSpacing: '.04em' }}>
          <span>RAGNARÖK · 诸神黄昏数据杂志</span>
          <span>非官方预测项目 · 数据仅供学习与编辑展示</span>
        </div>
      </footer>
      <div className="film-grain" aria-hidden="true" />
    </div>
  );
}
