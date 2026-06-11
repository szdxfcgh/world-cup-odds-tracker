import { Team } from '../lib/types';
import {
  getMatchById,
  getMatchesByQuarter,
  roundLabels,
  quarterLabels,
  QuarterZone,
} from '../lib/knockoutBracket2026';
import BracketMatchCard from './BracketMatchCard';
import TeamMark from './TeamMark';

interface KnockoutBracketProps {
  teams: Team[];
}

/* ── 单个 1/4 区 bracket ─────────────────────────── */
function QuarterBracketSection({
  quarter,
  side,
}: {
  quarter: QuarterZone;
  side: 'left' | 'right';
}) {
  const r32 = getMatchesByQuarter('R32', quarter);
  const r16 = getMatchesByQuarter('R16', quarter);
  const qf = getMatchesByQuarter('QF', quarter);
  const h = 'h-[620px]';

  /* 左侧：R32 → R16 → QF → 输出线 */
  if (side === 'left') {
    return (
      <div className="flex items-stretch">
        {/* R32 列 */}
        <div className={`flex flex-col justify-around ${h} gap-1`}>
          {r32.map((m) => (
            <BracketMatchCard key={m.id} match={m} />
          ))}
        </div>
        {/* 连接线 4→2 */}
        <div className={`w-5 ${h} flex flex-col`}>
          <div className="flex-1 border-r-2 border-t-2 border-gray-300" />
          <div className="flex-1 border-r-2 border-b-2 border-gray-300" />
        </div>
        {/* R16 列 */}
        <div className={`flex flex-col justify-around ${h} gap-1`}>
          {r16.map((m) => (
            <BracketMatchCard key={m.id} match={m} />
          ))}
        </div>
        {/* 连接线 2→1 */}
        <div className={`w-5 ${h} flex items-center`}>
          <div className="w-full border-r-2 border-t-2 border-b-2 border-gray-300 h-1/2" />
        </div>
        {/* QF 列 */}
        <div className={`flex items-center ${h}`}>
          <BracketMatchCard match={qf[0]} />
        </div>
        {/* 向右输出线 */}
        <div className={`w-6 ${h} flex items-center`}>
          <div className="w-full border-t-2 border-gray-300" />
        </div>
      </div>
    );
  }

  /* 右侧镜像：输出线 ← QF ← R16 ← R32 */
  return (
    <div className="flex items-stretch">
      {/* 向左输出线 */}
      <div className={`w-6 ${h} flex items-center`}>
        <div className="w-full border-t-2 border-gray-300" />
      </div>
      {/* QF 列 */}
      <div className={`flex items-center ${h}`}>
        <BracketMatchCard match={qf[0]} />
      </div>
      {/* 连接线 1→2（镜像：左边框） */}
      <div className={`w-5 ${h} flex items-center`}>
        <div className="w-full border-l-2 border-t-2 border-b-2 border-gray-300 h-1/2" />
      </div>
      {/* R16 列 */}
      <div className={`flex flex-col justify-around ${h} gap-1`}>
        {r16.map((m) => (
          <BracketMatchCard key={m.id} match={m} />
        ))}
      </div>
      {/* 连接线 2→4（镜像：左边框） */}
      <div className={`w-5 ${h} flex flex-col`}>
        <div className="flex-1 border-l-2 border-t-2 border-gray-300" />
        <div className="flex-1 border-l-2 border-b-2 border-gray-300" />
      </div>
      {/* R32 列 */}
      <div className={`flex flex-col justify-around ${h} gap-1`}>
        {r32.map((m) => (
          <BracketMatchCard key={m.id} match={m} />
        ))}
      </div>
    </div>
  );
}

/* ── 主组件 ───────────────────────────────────────── */
export default function KnockoutBracket({ teams }: KnockoutBracketProps) {
  const sf101 = getMatchById('M101')!;
  const sf102 = getMatchById('M102')!;
  const final103 = getMatchById('M103')!;

  const groups = 'ABCDEFGHIJKL'.split('');

  return (
    <div className="wc-card p-6">
      {/* ── Title ── */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--wc-text)] mb-2">
          2026 世界杯淘汰赛对阵图
        </h2>
        <p className="text-sm text-[var(--wc-text-secondary)]">官方种子位结构｜32强至决赛</p>
      </div>

      {/* ── Bracket 区域 ── */}
      <div className="overflow-x-auto pb-6">
        <div className="flex justify-center gap-0 min-w-[1400px]">
          {/* 左侧：1/4区 A + C */}
          <div className="flex flex-col gap-8">
            <div>
              <div className="text-xs font-bold text-blue-600 mb-2 text-center">
                {quarterLabels.A}
              </div>
              <QuarterBracketSection quarter="A" side="left" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-600 mb-2 text-center">
                {quarterLabels.C}
              </div>
              <QuarterBracketSection quarter="C" side="left" />
            </div>
          </div>

          {/* 中间：半决赛 + 决赛 */}
          <div className="flex flex-col items-center justify-around" style={{ minHeight: '1280px' }}>
            {/* M101 半决赛 */}
            <div className="flex items-center">
              <div className="w-6 border-t-2 border-gray-300" />
              <BracketMatchCard match={sf101} />
              <div className="w-6 border-t-2 border-gray-300" />
            </div>

            {/* 竖线 M101 → M103 */}
            <div className="flex flex-col items-center gap-0">
              <div className="w-0.5 h-8 bg-gray-300" />
              <div className="text-[10px] text-gray-400 font-medium">↓</div>
            </div>

            {/* M103 决赛 */}
            <div className="relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-600 whitespace-nowrap">
                {roundLabels.F}
              </div>
              <div className="rounded-xl border-2 border-amber-300/40 bg-amber-300/10 p-1 shadow-lg shadow-amber-950/30">
                <BracketMatchCard match={final103} />
              </div>
            </div>

            {/* 竖线 M103 → M102 */}
            <div className="flex flex-col items-center gap-0">
              <div className="text-[10px] text-gray-400 font-medium">↓</div>
              <div className="w-0.5 h-8 bg-gray-300" />
            </div>

            {/* M102 半决赛 */}
            <div className="flex items-center">
              <div className="w-6 border-t-2 border-gray-300" />
              <BracketMatchCard match={sf102} />
              <div className="w-6 border-t-2 border-gray-300" />
            </div>
          </div>

          {/* 右侧：1/4区 B + D（镜像） */}
          <div className="flex flex-col gap-8">
            <div>
              <div className="text-xs font-bold text-blue-600 mb-2 text-center">
                {quarterLabels.B}
              </div>
              <QuarterBracketSection quarter="B" side="right" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-600 mb-2 text-center">
                {quarterLabels.D}
              </div>
              <QuarterBracketSection quarter="D" side="right" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Group overview ── */}
      <div className="mt-8 pt-8 border-t border-[var(--wc-card-border)]">
        <h3 className="text-lg font-bold text-[var(--wc-text)] mb-4">小组球队一览</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {groups.map((g) => {
            const groupTeams = teams.filter((t) => t.group === g);
            return (
              <div key={g} className="rounded-lg p-3" style={{ background: 'var(--wc-bg)' }}>
                <div className="font-bold text-[var(--wc-blue)] mb-2 text-sm flex items-center gap-1">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--wc-blue)] text-white text-[10px]">{g}</span>
                  {g}组
                </div>
                <div className="space-y-1">
                  {groupTeams.map((t) => (
                    <div key={t.id} className="flex items-center gap-1.5">
                      <TeamMark team={t} size="sm" />
                      <span className="text-xs text-[var(--wc-text-secondary)]">{t.nameCn}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="mt-6 pt-6 border-t border-[var(--wc-card-border)]">
        <h4 className="font-semibold text-[var(--wc-text)] mb-3">图例</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm text-[var(--wc-text-secondary)]">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300 shrink-0" />
            <span>1A = A组第1</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-sky-100 border border-sky-300 shrink-0" />
            <span>2B = B组第2</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-purple-100 border border-purple-300 shrink-0" />
            <span>3ABCDF = 最佳第三（A/B/C/D/F之一）</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gray-100 border border-gray-300 shrink-0" />
            <span>M74胜者 = 第74场胜者</span>
          </div>
        </div>
      </div>
    </div>
  );
}
