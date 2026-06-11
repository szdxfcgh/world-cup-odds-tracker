import { Match, Team } from '@/lib/types';
import headToHeadData from '../../data/headToHead.json';
import TeamMark from './TeamMark';

interface HeadToHeadRecord {
  date: string;
  competition: string;
  venue: string;
  score: string;
  winner: string;
}

function getHeadToHeadRecords(team1Id: number, team2Id: number): HeadToHeadRecord[] {
  const record = headToHeadData.matches.find(
    (item) =>
      (item.team1Id === team1Id && item.team2Id === team2Id) ||
      (item.team1Id === team2Id && item.team2Id === team1Id)
  );
  return record?.history || [];
}

export default function MatchCard({
  match,
  homeTeam,
  awayTeam,
}: {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
}) {
  const hasOdds = match.homeWinOdds !== null && match.drawOdds !== null && match.awayWinOdds !== null;
  const history = getHeadToHeadRecords(homeTeam.id, awayTeam.id).slice(0, 3);

  return (
    <article className="wc-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--wc-card-border)] px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[var(--wc-emerald)] px-3 py-1 font-mono text-[10px] font-black text-[#04110a]">
            GROUP {match.group}
          </span>
          <span className="text-xs text-[var(--wc-text-muted)]">风险 {match.riskLevel}</span>
        </div>
        <span className="font-mono text-xs text-[var(--wc-text-secondary)]">{match.displayDateAsia}</span>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center gap-4 sm:flex-col sm:text-center">
            <TeamMark team={homeTeam} size="lg" />
            <div>
              <h2 className="text-xl font-black">{homeTeam.nameCn}</h2>
              <p className="mt-1 text-xs text-[var(--wc-text-muted)]">FIFA #{homeTeam.fifaRank ?? '-'}</p>
            </div>
          </div>
          <div className="text-center">
            <span className="font-mono text-[10px] tracking-[.18em] text-[var(--wc-text-muted)]">MODEL SCORE</span>
            <div className="mt-2 text-4xl font-black tracking-[-.08em]">{match.predictedScore}</div>
          </div>
          <div className="flex items-center justify-end gap-4 sm:flex-col sm:text-center">
            <TeamMark team={awayTeam} size="lg" />
            <div>
              <h2 className="text-xl font-black">{awayTeam.nameCn}</h2>
              <p className="mt-1 text-xs text-[var(--wc-text-muted)]">FIFA #{awayTeam.fifaRank ?? '-'}</p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-3 border-y border-[var(--wc-card-border)]">
          {[
            ['主胜', hasOdds ? match.homeWinOdds : '-'],
            ['平局', hasOdds ? match.drawOdds : '-'],
            ['客胜', hasOdds ? match.awayWinOdds : '-'],
          ].map(([label, value], index) => (
            <div key={label} className={`py-4 text-center ${index === 1 ? 'border-x border-[var(--wc-card-border)]' : ''}`}>
              <p className="text-[10px] tracking-[.1em] text-[var(--wc-text-muted)]">{label}</p>
              <p className="mt-1 font-mono text-lg font-black text-[var(--wc-gold)]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-[1.25fr_.75fr]">
          <div>
            <p className="wc-kicker">EDITORIAL READ</p>
            <p className="mt-3 text-sm leading-7 text-[var(--wc-text-secondary)]">{match.analysis}</p>
            <p className="mt-3 text-xs text-[var(--wc-text-muted)]">{match.venue} · {match.city}</p>
          </div>
          <div className="rounded-xl bg-[var(--wc-surface-muted)] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">推荐方向</span>
              <span className="text-xs font-black text-[var(--wc-emerald)]">{match.recommendation}</span>
            </div>
            {history.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-[var(--wc-card-border)] pt-3">
                {history.map((record) => (
                  <div key={`${record.date}-${record.score}`} className="flex justify-between gap-3 text-[10px] text-[var(--wc-text-muted)]">
                    <span>{record.date}</span>
                    <span>{record.competition}</span>
                    <strong className="text-[var(--wc-text-secondary)]">{record.score}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
