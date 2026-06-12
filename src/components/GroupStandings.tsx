import { GroupStandings } from '@/lib/standings';
import TeamMark from './TeamMark';

export default function GroupStandingsComponent({ groups }: { groups: GroupStandings[] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {groups.map((group) => {
        const groupHasData = group.standings.some((s) => s.points > 0 || s.played > 0);
        return (
          <section key={group.group} className="standings-card">
            <div className="standings-header flex items-center justify-between px-5 py-4">
              <div>
                <p className="wc-kicker">GROUP TABLE</p>
                <h2 className="mt-1 text-xl font-black">小组 {group.group}</h2>
              </div>
              <span className="font-mono text-3xl font-black" style={{ color: 'rgba(180,140,40,.08)' }}>{group.group}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>球队</th>
                    <th>赛</th>
                    <th>胜</th>
                    <th>平</th>
                    <th>负</th>
                    <th>净胜</th>
                    <th>积分</th>
                  </tr>
                </thead>
                <tbody>
                  {group.standings.map((standing) => {
                    const isTop2 = groupHasData && standing.rank <= 2;
                    return (
                      <tr key={standing.teamId} className={isTop2 ? 'standings-qualify' : ''}>
                        <td>
                          <span className={`standings-rank ${isTop2 ? 'standings-rank-top' : ''}`}>{standing.rank}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <TeamMark team={{ id: standing.teamId, nameCn: standing.teamName }} size="sm" />
                            <span className="font-bold">{standing.teamName}</span>
                          </div>
                        </td>
                        <td className="text-[var(--wc-text-secondary)]">{standing.played}</td>
                        <td className="text-[var(--wc-text-secondary)]">{standing.wins}</td>
                        <td className="text-[var(--wc-text-secondary)]">{standing.draws}</td>
                        <td className="text-[var(--wc-text-secondary)]">{standing.losses}</td>
                        <td className={standing.goalDifference > 0 ? 'standings-gd-pos' : standing.goalDifference < 0 ? 'standings-gd-neg' : 'standings-gd-zero'}>
                          {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                        </td>
                        <td className="standings-points">{standing.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
