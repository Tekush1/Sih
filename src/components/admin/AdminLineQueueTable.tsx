import React from 'react';
import { Team } from '../../types';
import { ArrowUp, ArrowDown, Trash2, Play, ExternalLink, HardDrive } from 'lucide-react';

interface AdminLineQueueTableProps {
  queueTeams: Team[];
  screenStateTeamId: string;
  onSendToScreen: (teamId: string) => void;
  onReorder: (teamId: string, direction: 'up' | 'down') => void;
  onRemove: (teamId: string) => void;
  onOpenCSV?: () => void;
}

export const AdminLineQueueTable: React.FC<AdminLineQueueTableProps> = ({
  queueTeams,
  screenStateTeamId,
  onSendToScreen,
  onReorder,
  onRemove,
  onOpenCSV
}) => {
  if (queueTeams.length === 0) {
    return (
      <div className="p-16 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
        <p className="text-base font-bold text-slate-700">No squads in the standings lineup yet.</p>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Upload your CSV file containing team names and presentation links to automatically generate the standings.
        </p>
        {onOpenCSV && (
          <button
            onClick={onOpenCSV}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            Insert Teams via CSV
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
      <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-[#faf7f2]">
        <h3 className="font-black text-slate-900 text-sm tracking-wide uppercase">
          Squad Standings ({queueTeams.length} Teams in Line)
        </h3>
        <span className="text-[11px] font-mono text-slate-500">
          Use ↑ ↓ arrows to adjust presentation order
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] font-mono">
            <tr>
              <th className="py-3.5 px-4 w-24">Standing #</th>
              <th className="py-3.5 px-4">Squad Name</th>
              <th className="py-3.5 px-4">Squad Leader</th>
              <th className="py-3.5 px-4">Track</th>
              <th className="py-3.5 px-4">Presentation Link</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {queueTeams.map((team, idx) => {
              const isLive = team.id === screenStateTeamId;
              const driveLink = team.googleDriveFolder || team.submission?.googleDriveFileUrl;
              const isOffline = driveLink?.startsWith('offline://');

              return (
                <tr
                  key={team.id}
                  className={`transition-colors ${
                    isLive ? 'bg-orange-50/80 font-semibold' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Standings Number & Up/Down Arrows */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-sm ${
                        isLive
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        #{idx + 1}
                      </span>

                      <div className="flex flex-col">
                        <button
                          disabled={idx === 0}
                          onClick={() => onReorder(team.id, 'up')}
                          className="text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer p-0.5"
                          title="Move Up in Standings"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === queueTeams.length - 1}
                          onClick={() => onReorder(team.id, 'down')}
                          className="text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer p-0.5"
                          title="Move Down in Standings"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Team Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{team.name}</span>
                      {isLive && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider animate-pulse">
                          ON SCREEN
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{team.id}</span>
                  </td>

                  {/* Squad Leader */}
                  <td className="py-3 px-4 text-slate-700">
                    <span className="font-medium">{team.leaderName || '—'}</span>
                    {team.leaderEmail && (
                      <span className="block text-[11px] font-mono text-slate-400">{team.leaderEmail}</span>
                    )}
                  </td>

                  {/* Track */}
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold font-mono">
                      {team.track}
                    </span>
                  </td>

                  {/* Presentation Link */}
                  <td className="py-3 px-4">
                    {isOffline ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200">
                        <HardDrive className="w-3 h-3" />
                        <span>Local Offline Deck</span>
                      </span>
                    ) : driveLink ? (
                      <a
                        href={driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-mono text-xs font-bold underline"
                      >
                        <span>Open Deck</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">No link</span>
                    )}
                  </td>

                  {/* Actions: Present on Screen + Remove */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSendToScreen(team.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          isLive
                            ? 'bg-orange-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-800'
                        }`}
                        title="Send this squad to Auditorium Screen"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isLive ? 'Presenting' : 'Present'}</span>
                      </button>

                      <button
                        onClick={() => onRemove(team.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove from Lineup"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
