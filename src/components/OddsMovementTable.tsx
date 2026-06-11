'use client';

import { useMemo } from 'react';
import odds2026Data from '../../data/outrightOddsSnapshots.json';
import historicalData from '../../data/historicalOddsSnapshots.json';

interface OddsSnapshot {
  id: string;
  year: number;
  teamId: string;
  teamNameCn: string;
  teamNameEn: string;
  decimalOdds: number;
  impliedProbability: number;
  snapshotStage: string;
  snapshotTime: string;
  afterMatchId: string | null;
  afterMatchLabel: string | null;
  matchesPlayed: number;
  points: number | null;
  groupRank: number | null;
  isEliminated: boolean;
  finalRank?: number;
  source: string;
  notes: string;
}

const STAGE_ORDER = [
  'pre_tournament',
  'after_group_match_1',
  'after_group_match_2',
  'after_group_match_3',
  'after_round_of_32',
  'after_round_of_16',
  'after_quarter_final',
  'after_semi_final',
  'before_final',
  'final_result',
];

type MarketVerdict = '升温' | '降温' | '淘汰' | '待开赛';

interface MovementRow {
  teamId: string;
  teamNameCn: string;
  teamNameEn: string;
  preTournamentOdds: number;
  lastMatchOdds: number;
  lastMatchLabel: string;
  change: number;
  changePercent: number;
  isEliminated: boolean;
  verdict: MarketVerdict;
  finalRank: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize2026Data(snapshots: any[]): OddsSnapshot[] {
  return snapshots.map(s => ({
    ...s,
    teamId: String(s.teamId),
    impliedProbability: s.impliedProbability <= 1 ? s.impliedProbability * 100 : s.impliedProbability,
    points: s.points ?? 0,
    groupRank: s.groupRank ?? 0,
    afterMatchId: s.afterMatchId ?? '',
    afterMatchLabel: s.afterMatchLabel ?? '',
  }));
}

function getSnapshotsForYear(year: number): OddsSnapshot[] {
  if (year === 2026) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return normalize2026Data((odds2026Data as any).snapshots);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (historicalData as any[]).filter((s: any) => s.year === year) as OddsSnapshot[];
}

// Find the snapshot right before the team's elimination match
function getLastMatchPreOdds(sorted: OddsSnapshot[]): { odds: number; label: string } {
  // Only pre_tournament snapshot (2026 - tournament hasn't started)
  if (sorted.length === 1) {
    return { odds: sorted[0].decimalOdds, label: '赛前' };
  }

  // Find the first eliminated snapshot
  const elimIdx = sorted.findIndex(s => s.isEliminated);
  
  if (elimIdx === -1) {
    // Champion / not eliminated - use before_final stage
    const beforeFinal = sorted.find(s => s.snapshotStage === 'before_final');
    if (beforeFinal) return { odds: beforeFinal.decimalOdds, label: '决赛前' };
    // Fallback to last snapshot
    const last = sorted[sorted.length - 1];
    return { odds: last.decimalOdds, label: '最后一场' };
  }
  
  // Return the snapshot right before elimination
  if (elimIdx > 0) {
    const prev = sorted[elimIdx - 1];
    const stageNames: Record<string, string> = {
      pre_tournament: '赛前',
      after_group_match_1: '小组赛第1轮后',
      after_group_match_2: '小组赛第2轮后',
      after_group_match_3: '小组赛第3轮后',
      after_round_of_32: '32强后',
      after_round_of_16: '16强后',
      after_quarter_final: '8强后',
      after_semi_final: '半决赛后',
      before_final: '决赛前',
      final_result: '决赛后',
    };
    return { odds: prev.decimalOdds, label: stageNames[prev.snapshotStage] ?? prev.snapshotStage };
  }
  
  // Eliminated from first match
  const first = sorted[0];
  return { odds: first.decimalOdds, label: '赛前' };
}

// Use finalRank from data if available, otherwise derive from elimination stage
function getFinalRank(sorted: OddsSnapshot[]): number {
  // Use data finalRank if available (historical data has this)
  const rank = sorted[0]?.finalRank;
  if (rank && rank > 0) return rank;

  // Fallback: derive from elimination stage (for 2026 data)
  const last = sorted[sorted.length - 1];
  if (last.snapshotStage === 'final_result' && last.decimalOdds === 1) return 1;

  const elimIdx = sorted.findIndex(s => s.isEliminated);
  if (elimIdx === -1) return 32;

  const elimStage = sorted[elimIdx].snapshotStage;
  if (elimStage === 'final_result') return 2;
  if (elimStage === 'before_final' || elimStage === 'after_semi_final') return 4;
  if (elimStage === 'after_quarter_final') return 8;
  if (elimStage === 'after_round_of_16') return 16;
  if (elimStage === 'after_round_of_32') return 24;
  if (elimStage === 'after_group_match_3') return 28;
  return 32;
}

export default function OddsMovementTable({ year = 2026 }: { year?: number }) {
  const snapshots = useMemo(() => getSnapshotsForYear(year), [year]);

  const movementData = useMemo(() => {
    const teamMap = new Map<string, OddsSnapshot[]>();

    for (const s of snapshots) {
      if (!teamMap.has(s.teamId)) {
        teamMap.set(s.teamId, []);
      }
      teamMap.get(s.teamId)!.push(s);
    }

    const rows: MovementRow[] = [];

    for (const [teamId, teamSnapshots] of teamMap) {
      teamSnapshots.sort(
        (a, b) => STAGE_ORDER.indexOf(a.snapshotStage) - STAGE_ORDER.indexOf(b.snapshotStage)
      );

      const pre = teamSnapshots.find((s) => s.snapshotStage === 'pre_tournament');
      if (!pre) continue;

      const { odds: lastMatchOdds, label: lastMatchLabel } = getLastMatchPreOdds(teamSnapshots);
      const last = teamSnapshots[teamSnapshots.length - 1];
      const isEliminated = last.isEliminated && last.snapshotStage !== 'final_result';

      const change = lastMatchOdds - pre.decimalOdds;
      const changePercent = ((lastMatchOdds - pre.decimalOdds) / pre.decimalOdds) * 100;

      let verdict: MarketVerdict;
      if (teamSnapshots.length === 1) {
        verdict = '待开赛';
      } else if (last.isEliminated && last.snapshotStage !== 'final_result') {
        verdict = '淘汰';
      } else if (change < 0) {
        verdict = '升温';
      } else {
        verdict = '降温';
      }

      rows.push({
        teamId,
        teamNameCn: last.teamNameCn,
        teamNameEn: last.teamNameEn,
        preTournamentOdds: pre.decimalOdds,
        lastMatchOdds,
        lastMatchLabel,
        change,
        changePercent,
        isEliminated,
        verdict,
        finalRank: getFinalRank(teamSnapshots),
      });
    }

    // Sort by pre-tournament odds ascending (most favored first)
    return rows.sort((a, b) => a.preTournamentOdds - b.preTournamentOdds);
  }, [snapshots]);

  const getVerdictStyle = (verdict: MarketVerdict) => {
    switch (verdict) {
      case '升温':
        return 'bg-green-50 text-green-700';
      case '降温':
        return 'bg-orange-50 text-orange-700';
      case '淘汰':
        return 'bg-red-50 text-red-700';
      case '待开赛':
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getChangeStyle = (change: number) => {
    if (change < 0) return 'text-green-600';
    if (change > 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400 text-yellow-900 font-bold text-sm px-3 py-1';
    if (rank === 2) return 'bg-gray-300 text-gray-800 font-bold text-sm px-3 py-1';
    if (rank === 3) return 'bg-orange-300 text-orange-900 font-bold text-sm px-3 py-1';
    if (rank <= 4) return 'bg-blue-200 text-blue-900 font-semibold text-sm px-3 py-1';
    if (rank <= 8) return 'bg-blue-100 text-blue-800 font-medium';
    return 'text-gray-500';
  };

  return (
    <div className="wc-card p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--wc-text)]">{year} 赔率变化榜</h2>
        <p className="text-xs text-[var(--wc-text-secondary)] mt-1">
          按赛前赔率排序 | 末场赔率 = 该队最后一场比赛前的赔率 | 数据来源: sample
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[var(--wc-card-border)]">
              <th className="text-left py-3 px-3 text-xs font-semibold text-[var(--wc-text-secondary)]">#</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-[var(--wc-text-secondary)]">球队</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-[var(--wc-text-secondary)]">赛前赔率</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-[var(--wc-text-secondary)]">末场赔率</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-[var(--wc-text-secondary)]">变化</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-[var(--wc-text-secondary)]">市场判断</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-[var(--wc-text-secondary)]">最终名次</th>
            </tr>
          </thead>
          <tbody>
            {movementData.map((row, idx) => (
              <tr
                key={row.teamId}
                className={`border-b border-slate-100 transition-colors ${
                  row.isEliminated ? 'bg-slate-50 opacity-70' : 'hover:bg-[var(--wc-bg)]'
                }`}
              >
                <td className="py-3 px-3 text-sm text-[var(--wc-text-secondary)]">{idx + 1}</td>

                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--wc-text)] text-sm">{row.teamNameCn}</span>
                    <span className="text-xs text-slate-400">{row.teamNameEn}</span>
                  </div>
                </td>

                <td className="py-3 px-3 text-right">
                  <span className="text-sm font-medium text-[var(--wc-text-secondary)]">
                    {row.preTournamentOdds.toFixed(2)}
                  </span>
                </td>

                <td className="py-3 px-3 text-right">
                  <div>
                    <span className="text-sm font-bold text-[var(--wc-text)]">
                      {row.lastMatchOdds.toFixed(2)}
                    </span>
                    <div className="text-xs text-slate-400">{row.lastMatchLabel}</div>
                  </div>
                </td>

                <td className="py-3 px-3 text-right">
                  <div>
                    <span className={`text-sm font-bold ${getChangeStyle(row.change)}`}>
                      {row.change > 0 ? '+' : ''}
                      {row.change.toFixed(2)}
                    </span>
                    <span className={`text-xs ml-1 ${getChangeStyle(row.change)}`}>
                      ({row.changePercent > 0 ? '+' : ''}
                      {row.changePercent.toFixed(1)}%)
                    </span>
                  </div>
                </td>

                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${getVerdictStyle(
                      row.verdict
                    )}`}
                  >
                    {row.verdict}
                  </span>
                </td>

                <td className="py-3 px-3 text-center">
                  {row.verdict === '待开赛' ? (
                    <span className="text-slate-400 text-sm">待定</span>
                  ) : (
                    <span className={`inline-flex items-center rounded-md ${getRankStyle(row.finalRank)}`}>
                      {row.finalRank === 1 ? '🏆 ' : ''}
                      第{row.finalRank}名
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t border-[var(--wc-card-border)] grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-emerald-50 rounded-lg">
          <div className="text-2xl font-bold text-emerald-600">
            {movementData.filter((r) => r.verdict === '升温').length}
          </div>
          <div className="text-xs text-emerald-700">升温球队</div>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <div className="text-2xl font-bold text-amber-600">
            {movementData.filter((r) => r.verdict === '降温').length}
          </div>
          <div className="text-xs text-amber-700">降温球队</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {movementData.filter((r) => r.verdict === '淘汰').length}
          </div>
          <div className="text-xs text-red-700">已淘汰球队</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 rounded-lg text-xs text-[var(--wc-text-secondary)]" style={{ background: 'var(--wc-bg)' }}>
        <p className="font-medium mb-1">赔率变化说明:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li><strong>末场赔率</strong>: 该队最后一场比赛前的赔率（淘汰赛即为出局那场之前的赔率）</li>
          <li><strong>升温</strong>: 末场赔率低于赛前赔率，市场更看好该队</li>
          <li><strong>降温</strong>: 末场赔率高于赛前赔率，市场信心下降</li>
          <li><strong>淘汰</strong>: 该队已被淘汰</li>
          <li>最终名次根据淘汰阶段推算，冠军由赔率=1.00确认</li>
        </ul>
      </div>
    </div>
  );
}
