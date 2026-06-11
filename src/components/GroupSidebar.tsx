import { Team } from '../lib/types';
import TeamMark from './TeamMark';

export default function GroupSidebar({ teams }: { teams: Team[] }) {
  return (
    <div className="wc-card p-5">
      <p className="wc-kicker">GROUP INDEX</p>
      <h3 className="mt-2 text-lg font-black">小组分区</h3>
      <div className="mt-5 space-y-4">
        {'ABCDEFGHIJKL'.split('').map((group) => (
          <div key={group} className="border-t border-[var(--wc-card-border)] pt-3">
            <div className="mb-2 font-mono text-xs font-black text-[var(--wc-emerald)]">GROUP {group}</div>
            <div className="grid grid-cols-2 gap-2">
              {teams.filter((team) => team.group === group).map((team) => (
                <div key={team.id} className="flex items-center gap-2">
                  <TeamMark team={team} size="sm" />
                  <span className="text-xs text-[var(--wc-text-secondary)]">{team.nameCn}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
