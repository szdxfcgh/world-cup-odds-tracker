import Link from 'next/link';
import { Team } from '@/lib/types';
import TeamMark from './TeamMark';
import EditorialIcon from './EditorialIcon';

export default function TeamCard({ team }: { team: Team }) {
  return (
    <article className="team-card group overflow-hidden rounded-[18px] p-6">
      <div className="flex items-start justify-between">
        <TeamMark team={team} />
        <span className="font-mono text-[10px] tracking-[.16em] text-[var(--wc-text-muted)]">GROUP {team.group}</span>
      </div>
      <h2 className="mt-6 text-xl font-black tracking-[-.04em]">{team.nameCn}</h2>
      <p className="mt-1.5 text-xs uppercase tracking-[.08em] text-[var(--wc-text-muted)]">{team.nameEn}</p>
      <dl className="team-card-data mt-6">
        <div><dt>FIFA</dt><dd>{team.fifaRank ?? '-'}</dd></div>
        <div style={{ borderLeft: '1px solid rgba(180,140,40,.14)', borderRight: '1px solid rgba(180,140,40,.14)' }}><dt>冠军</dt><dd>{team.worldCupTitles ?? 0}</dd></div>
        <div><dt>小组</dt><dd>{team.group}</dd></div>
      </dl>
      <Link href={`/teams/${team.id}`} className="mt-6 flex items-center justify-between text-xs font-black text-[var(--wc-emerald)]">
        球队档案 <EditorialIcon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
