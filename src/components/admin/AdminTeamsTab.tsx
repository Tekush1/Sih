import React from 'react';
import { Team, Stage } from '../../types';
import { Search } from 'lucide-react';

interface AdminTeamsTabProps {
  teams: Team[];
  stages: Stage[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedTrackFilter: string;
  setSelectedTrackFilter: (t: string) => void;
  onOpenQR: (team: Team) => void;
}

export const AdminTeamsTab: React.FC<AdminTeamsTabProps> = ({
  teams,
  stages,
  searchQuery,
  setSearchQuery,
  selectedTrackFilter,
  setSelectedTrackFilter,
  onOpenQR
}) => {
  const filtered = teams.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.psId && t.psId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.college.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTrack = selectedTrackFilter === 'ALL' || t.track === selectedTrackFilter;
    return matchSearch && matchTrack;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by team, ID, or PS ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          {['ALL', 'AI & Robotics', 'Web3 & Cloud', 'HealthTech & Bio', 'Smart Cities & IoT'].map((tr) => (
            <button
              key={tr}
              onClick={() => setSelectedTrackFilter(tr)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                selectedTrackFilter === tr ? 'bg-orange-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#faf7f2] border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-3">Team ID</th>
                <th className="py-3 px-3">Team Name</th>
                <th className="py-3 px-3">SIH PS ID</th>
                <th className="py-3 px-3">Track</th>
                <th className="py-3 px-3">PPT Status</th>
                <th className="py-3 px-3">Stage &amp; Time</th>
                <th className="py-3 px-3 text-right">QR Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.slice(0, 50).map((team) => (
                <tr key={team.id} className="hover:bg-orange-50/40">
                  <td className="py-2.5 px-3 text-orange-700 font-bold">{team.id}</td>
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{team.name}</td>
                  <td className="py-2.5 px-3 text-blue-700 font-bold">{team.psId || 'SIH1609'}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-sans">{team.track}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {team.submission?.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {team.scheduledSlot?.startTime || '14:00'} ({stages.find((s) => s.id === team.stageId)?.name || 'Stage A'})
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {team.qrPass ? (
                      <button onClick={() => onOpenQR(team)} className="text-orange-600 hover:underline font-bold cursor-pointer">
                        View Pass
                      </button>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
