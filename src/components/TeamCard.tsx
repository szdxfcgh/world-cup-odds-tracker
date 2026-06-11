import Link from 'next/link';
import { Team } from '@/lib/types';
import TeamMark from './TeamMark';
import EditorialIcon from './EditorialIcon';

export default function TeamCard({ team }: { team: Team }) {
  return (
    <article className="wc-card group overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <TeamMark team={team} />
        <span className="font-mono text-[10px] tracking-[.16em] text-[var(--wc-text-muted)]">GROUP {team.group}</span>
      </div>
      <h2 className="mt-6 text-xl font-black tracking-[-.04em]">{team.nameCn}</h2>
      <p className="mt-1 text-xs uppercase tracking-[.08em] text-[var(--wc-text-muted)]">{team.nameEn}</p>
      <dl className="mt-6 grid grid-cols-3 border-y border-[var(--wc-card-border)] py-4 text-center">
        <div><dt className="text-[10px] text-[var(--wc-text-muted)]">FIFA</dt><dd className="mt-1 font-mono font-bold">{team.fifaRank ?? '-'}</dd></div>
        <div className="border-x border-[var(--wc-card-border)]"><dt className="text-[10px] text-[var(--wc-text-muted)]">冠军</dt><dd className="mt-1 font-mono font-bold">{team.worldCupTitles ?? 0}</dd></div>
        <div><dt className="text-[10px] text-[var(--wc-text-muted)]">小组</dt><dd className="mt-1 font-mono font-bold">{team.group}</dd></div>
      </dl>
      <Link href={`/teams/${team.id}`} className="mt-5 flex items-center justify-between text-xs font-black text-[var(--wc-emerald)]">
        球队档案 <EditorialIcon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
