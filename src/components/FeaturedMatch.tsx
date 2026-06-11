import Link from 'next/link';
import { Match, Team } from '@/lib/types';
import TeamMark from './TeamMark';
import EditorialIcon from './EditorialIcon';

interface FeaturedMatchProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
}

export default function FeaturedMatch({ match, homeTeam, awayTeam }: FeaturedMatchProps) {
  return (
    <article className="wc-card relative overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-2/5 bg-[radial-gradient(circle_at_center,rgba(111,242,173,.13),transparent_68%)]" />
      <div className="relative grid min-h-[320px] gap-8 p-6 md:grid-cols-[.8fr_1.4fr_.8fr] md:items-center md:p-9">
        <div>
          <p className="wc-kicker">GROUP {match.group} / MATCH 001</p>
          <p className="mt-4 font-mono text-xs text-[var(--wc-text-secondary)]">{match.displayDateAsia}</p>
          <p className="mt-1 text-sm text-[var(--wc-text-muted)]">{match.venue} · {match.city}</p>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <div className="text-center">
            <TeamMark team={homeTeam} size="lg" />
            <h3 className="mt-3 text-xl font-black">{homeTeam.nameCn}</h3>
            <p className="mt-1 text-xs text-[var(--wc-text-muted)]">FIFA #{homeTeam.fifaRank ?? '-'}</p>
          </div>
          <div className="text-center">
            <span className="font-mono text-[10px] tracking-[.2em] text-[var(--wc-text-muted)]">PREDICTION</span>
            <div className="mt-2 text-4xl font-black tracking-[-.07em]">{match.predictedScore}</div>
            <span className="mt-2 inline-flex rounded-full border border-[var(--wc-card-border)] px-3 py-1 text-[10px] text-[var(--wc-text-secondary)]">
              风险 {match.riskLevel}
            </span>
          </div>
          <div className="text-center">
            <TeamMark team={awayTeam} size="lg" />
            <h3 className="mt-3 text-xl font-black">{awayTeam.nameCn}</h3>
            <p className="mt-1 text-xs text-[var(--wc-text-muted)]">FIFA #{awayTeam.fifaRank ?? '-'}</p>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-sm leading-7 text-[var(--wc-text-secondary)]">{match.analysis}</p>
          <Link href="/matches" className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[var(--wc-emerald)]">
            完整比赛日 <EditorialIcon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
