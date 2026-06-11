'use client';

import { useState, useMemo } from 'react';
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
  source: string;
  notes: string;
}

const STAGE_LABELS: Record<string, string> = {
  pre_tournament: '赛前',
  after_group_match_1: '小组赛第1轮后',
  after_group_match_2: '小组赛第2轮后',
  after_group_match_3: '小组赛第3轮后',
  after_round_of_32: '32强后',
  after_round_of_16: '16强后',
  after_quarter_final: '8强后',
  after_semi_final: '半决赛后',
  before_final: '决赛前',
  final_result: '决赛结果',
};

const STAGE_ORDER = Object.keys(STAGE_LABELS);

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

export default function OutrightOddsTimeline({ year = 2026 }: { year?: number }) {
  const snapshots = useMemo(() => getSnapshotsForYear(year), [year]);

  const teams = useMemo(() => {
    const map = new Map<string, { id: string; nameCn: string; nameEn: string }>();
    for (const s of snapshots) {
      if (!map.has(s.teamId)) {
        map.set(s.teamId, { id: s.teamId, nameCn: s.teamNameCn, nameEn: s.teamNameEn });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.nameCn.localeCompare(b.nameCn, 'zh'));
  }, [snapshots]);

  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  // Derive effective team id: use selection if valid, else first team
  const effectiveTeamId = useMemo(() => {
    if (selectedTeamId && teams.find(t => t.id === selectedTeamId)) {
      return selectedTeamId;
    }
    return teams[0]?.id ?? '';
  }, [teams, selectedTeamId]);

  const teamSnapshots = useMemo(() => {
    return snapshots
      .filter((s) => s.teamId === effectiveTeamId)
      .sort((a, b) => STAGE_ORDER.indexOf(a.snapshotStage) - STAGE_ORDER.indexOf(b.snapshotStage));
  }, [snapshots, effectiveTeamId]);

  return (
    <div className="wc-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--wc-text)]">{year} 夺冠赔率时间序列</h2>
          <p className="text-xs text-[var(--wc-text-secondary)] mt-1">
            数据来源: sample (示例数据，非真实赔率)
          </p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-medium text-[var(--wc-text-secondary)] mb-2">选择球队</label>
        <select
          value={effectiveTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border border-[var(--wc-card-border)] rounded-lg focus:ring-2 focus:ring-[var(--wc-emerald)] focus:border-[var(--wc-emerald)] outline-none transition-colors text-[var(--wc-text)] bg-white font-medium text-sm"
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nameCn} ({t.nameEn})
            </option>
          ))}
        </select>
      </div>

      {teamSnapshots.length === 0 ? (
        <p className="text-[var(--wc-text-secondary)] text-center py-8">暂无该球队的赔率数据</p>
      ) : (
        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-6 gap-4 px-4 py-2 rounded-lg text-xs font-semibold text-[var(--wc-text-secondary)]" style={{ background: 'var(--wc-bg)' }}>
            <div>阶段</div>
            <div>赔率</div>
            <div>隐含概率</div>
            <div>比赛/积分</div>
            <div>状态</div>
            <div>备注</div>
          </div>

          {/* Data rows */}
          {teamSnapshots.map((s, idx) => {
            const prev = idx > 0 ? teamSnapshots[idx - 1] : null;
            const oddsChange = prev ? s.decimalOdds - prev.decimalOdds : 0;

            return (
              <div
                key={s.id}
                className={`grid grid-cols-6 gap-4 px-4 py-3 rounded-lg border transition-colors ${
                  s.isEliminated
                    ? 'bg-red-50 border-red-200'
                    : idx === teamSnapshots.length - 1 && s.snapshotStage === 'final_result' && s.decimalOdds === 1
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-white border-[var(--wc-card-border)] hover:bg-[var(--wc-bg)]'
                }`}
              >
                <div>
                  <div className="font-medium text-[var(--wc-text)] text-sm">
                    {STAGE_LABELS[s.snapshotStage] ?? s.snapshotStage}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(s.snapshotTime).toLocaleDateString('zh-CN')}
                  </div>
                </div>

                <div>
                  <span className="text-lg font-bold text-[var(--wc-text)]">{s.decimalOdds.toFixed(2)}</span>
                  {prev && oddsChange !== 0 && (
                    <span
                      className={`ml-2 text-xs font-medium ${
                        oddsChange < 0 ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {oddsChange < 0 ? '↓' : '↑'} {Math.abs(oddsChange).toFixed(2)}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[80px]">
                      <div
                        className="bg-[var(--wc-emerald)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(s.impliedProbability, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[var(--wc-text)]">
                      {s.impliedProbability.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="text-sm text-[var(--wc-text-secondary)]">
                  {s.matchesPlayed > 0 && <div>{s.matchesPlayed} 场</div>}
                  {s.points !== null && s.points > 0 && <div>{s.points} 分</div>}
                  {s.groupRank !== null && s.groupRank > 0 && <div>小组第{s.groupRank}</div>}
                </div>

                <div>
                  {s.isEliminated ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      已淘汰
                    </span>
                  ) : s.snapshotStage === 'final_result' && s.decimalOdds === 1 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      夺冠
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      晋级中
                    </span>
                  )}
                </div>

                <div className="text-xs text-[var(--wc-text-secondary)] truncate" title={s.notes || ''}>
                  {s.notes}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-[var(--wc-card-border)] flex flex-wrap gap-4 text-xs text-[var(--wc-text-secondary)]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>赔率下降 = 被看好</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>赔率上升 = 不被看好</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300" />
          <span>已淘汰</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300" />
          <span>夺冠</span>
        </div>
      </div>
    </div>
  );
}
