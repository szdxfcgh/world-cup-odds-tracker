import { GroupStandings } from '@/lib/standings';
import TeamMark from './TeamMark';

export default function GroupStandingsComponent({ groups }: { groups: GroupStandings[] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {groups.map((group) => (
        <section key={group.group} className="wc-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--wc-card-border)] px-5 py-4">
            <div>
              <p className="wc-kicker">GROUP TABLE</p>
              <h2 className="mt-1 text-xl font-black">小组 {group.group}</h2>
            </div>
            <span className="font-mono text-3xl font-black text-[var(--wc-card-border)]">{group.group}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-[var(--wc-surface-muted)] text-[10px] uppercase tracking-[.12em] text-[var(--wc-text-muted)]">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">球队</th>
                  <th className="px-3 py-3">赛</th>
                  <th className="px-3 py-3">胜</th>
                  <th className="px-3 py-3">平</th>
                  <th className="px-3 py-3">负</th>
                  <th className="px-3 py-3">净胜</th>
                  <th className="px-3 py-3">积分</th>
                </tr>
              </thead>
              <tbody>
                {group.standings.map((standing) => (
                  <tr key={standing.teamId} className="border-t border-[var(--wc-card-border)] hover:bg-white/[.025]">
                    <td className="px-4 py-3 font-mono text-[var(--wc-text-muted)]">{standing.rank}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <TeamMark team={{ id: standing.teamId, nameCn: standing.teamName }} size="sm" />
                        <span className="font-bold">{standing.teamName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-[var(--wc-text-secondary)]">{standing.played}</td>
                    <td className="px-3 py-3 text-center text-[var(--wc-text-secondary)]">{standing.wins}</td>
                    <td className="px-3 py-3 text-center text-[var(--wc-text-secondary)]">{standing.draws}</td>
                    <td className="px-3 py-3 text-center text-[var(--wc-text-secondary)]">{standing.losses}</td>
                    <td className="px-3 py-3 text-center font-mono text-[var(--wc-emerald)]">
                      {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                    </td>
                    <td className="px-3 py-3 text-center font-mono font-black">{standing.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
