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
    <article className="match-card">
      <div className="match-card-header flex flex-wrap items-center justify-between gap-3 px-5 py-2.5">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[var(--wc-emerald)] px-3 py-1 font-mono text-[10px] font-black text-[#100c0a]">
            {match.group} 组
          </span>
          <span className="text-[11px] text-[var(--wc-text-muted)]">风险 {match.riskLevel}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-[var(--wc-text-secondary)]">{match.displayDateAsia}</span>
          <span className="font-mono text-[10px] text-[var(--wc-text-muted)]">#{match.id}</span>
        </div>
      </div>

      <div className="grid items-stretch md:grid-cols-[1.4fr_.6fr]">
        {/* 左侧：双方球队 + 预测 */}
        <div className="flex items-center justify-center gap-6 border-b border-[rgba(180,140,40,.08)] px-6 py-4 md:border-b-0 md:border-r md:px-8 md:py-5">
          <div className="flex min-w-0 flex-col items-center text-center">
            <TeamMark team={homeTeam} size="lg" />
            <h2 className="mt-2 max-w-[120px] truncate text-xl font-black text-[var(--wc-text)]">{homeTeam.nameCn}</h2>
            <p className="mt-0.5 font-mono text-[11px] text-[var(--wc-text-muted)]">FIFA #{homeTeam.fifaRank ?? '-'}</p>
          </div>
          <div className="shrink-0 px-3 text-center">
            {match.status === 'finished' && match.homeScore !== null && match.awayScore !== null ? (
              <>
                <span className="font-mono text-[9px] tracking-[.16em] text-[var(--wc-emerald)]">全场比分</span>
                <div className="mt-1 text-[2.75rem] font-black leading-none tracking-[-.06em]">{match.homeScore} - {match.awayScore}</div>
                <span className="mt-1 inline-flex rounded-full border border-[var(--wc-emerald)] px-2 py-0.5 text-[9px] font-bold text-[var(--wc-emerald)]">
                  已结束
                </span>
              </>
            ) : (
              <>
                <span className="font-mono text-[9px] tracking-[.16em] text-[var(--wc-text-muted)]">预测</span>
                <div className="mt-1 text-[2.75rem] font-black leading-none tracking-[-.06em]">{match.predictedScore}</div>
              </>
            )}
          </div>
          <div className="flex min-w-0 flex-col items-center text-center">
            <TeamMark team={awayTeam} size="lg" />
            <h2 className="mt-2 max-w-[120px] truncate text-xl font-black text-[var(--wc-text)]">{awayTeam.nameCn}</h2>
            <p className="mt-0.5 font-mono text-[11px] text-[var(--wc-text-muted)]">FIFA #{awayTeam.fifaRank ?? '-'}</p>
          </div>
        </div>

        {/* 右侧：赛前分析 + 历史交锋 */}
        <div className="flex flex-col justify-center gap-2 p-3.5 md:px-4 md:py-4">
          <div>
            <p className="wc-kicker">赛前分析</p>
            <p className="mt-1.5 text-[12px] leading-[1.7] text-[var(--wc-text-secondary)]">{match.analysis}</p>
          </div>
          {history.length > 0 && (
            <div className="match-card-history p-2.5">
              <span className="text-[9px] font-bold text-[var(--wc-text-muted)]">历史交锋</span>
              <div className="mt-1.5 space-y-1">
                {history.map((record) => (
                  <div key={`${record.date}-${record.score}`} className="flex items-center justify-between gap-2 text-[9px] text-[var(--wc-text-muted)]">
                    <span className="shrink-0">{record.date}</span>
                    <span className="min-w-0 truncate">{record.competition}</span>
                    <strong className="shrink-0 text-[var(--wc-text-secondary)]">{record.score}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 赔率横向数据条 */}
      <div className="match-card-odds">
        {[
          ['主胜', hasOdds ? match.homeWinOdds : '-'],
          ['平局', hasOdds ? match.drawOdds : '-'],
          ['客胜', hasOdds ? match.awayWinOdds : '-'],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="match-card-odds-label">{label}</p>
            <p className="match-card-odds-value">{value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
