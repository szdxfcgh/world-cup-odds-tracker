import { KnockoutMatch, seedLabel } from '../lib/knockoutBracket2026';

function getSeedColor(seed: string): string {
  if (/^1[A-L]$/.test(seed)) return 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200';
  if (/^2[A-L]$/.test(seed)) return 'border-sky-300/25 bg-sky-300/10 text-sky-200';
  if (/^3[A-L]+/.test(seed)) return 'border-violet-300/25 bg-violet-300/10 text-violet-200';
  return 'border-white/10 bg-white/[.035] text-[var(--wc-text-secondary)]';
}

export default function BracketMatchCard({ match }: { match: KnockoutMatch }) {
  return (
    <div className="wc-card min-w-[160px] w-full p-2">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="font-mono text-[9px] tracking-[.12em] text-[var(--wc-text-muted)]">{match.id}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--wc-emerald)]" />
      </div>
      {[match.homeSeed, match.awaySeed].map((seed, index) => (
        <div key={seed}>
          {index === 1 && <div className="py-1 text-center font-mono text-[8px] text-[var(--wc-text-muted)]">VS</div>}
          <div className={`rounded-lg border px-2 py-2 text-xs font-black ${getSeedColor(seed)}`}>{seed}</div>
          <div className="truncate px-1 pt-1 text-[9px] text-[var(--wc-text-muted)]">{seedLabel(seed)}</div>
        </div>
      ))}
    </div>
  );
}
