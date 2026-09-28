import React from 'react';
import { Team } from '../../types';
import { Tv, ArrowUp, ArrowDown, Trash2, Edit3, ExternalLink } from 'lucide-react';

interface AdminLineQueueTableProps {
  queueTeams: Team[];
  screenStateTeamId: string;
  onSendToScreen: (teamId: string) => void;
  onReorder: (teamId: string, direction: 'up' | 'down') => void;
  onRemove: (teamId: string) => void;
  onEditSlide: (team: Team) => void;
}

export const AdminLineQueueTable: React.FC<AdminLineQueueTableProps> = ({
  queueTeams,
  screenStateTeamId,
  onSendToScreen,
  onReorder,
  onRemove,
  onEditSlide
}) => {
  if (queueTeams.length === 0) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 font-mono border border-dashed border-slate-300 rounded-3xl bg-white">
        No squads currently in the lineup queue. Insert squads above or import a CSV file.
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#faf7f2] border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="py-3 px-3">Order</th>
              <th className="py-3 px-3">Team ID</th>
              <th className="py-3 px-3">Squad Name</th>
              <th className="py-3 px-3">Leader</th>
              <th className="py-3 px-3">SIH PS ID</th>
              <th className="py-3 px-3">Google Drive Link</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {queueTeams.map((team, idx) => {
              const isLive = team.id === screenStateTeamId;
              const driveLink = team.googleDriveFolder || team.submission?.googleDriveFileUrl;

              return (
                <tr key={team.id} className={isLive ? 'bg-orange-50/70 font-semibold' : 'hover:bg-slate-50'}>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-900 w-6">#{idx + 1}</span>
                      <div className="flex flex-col">
                        <button
                          disabled={idx === 0}
                          onClick={() => onReorder(team.id, 'up')}
                          className="text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer p-0.5"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={idx === queueTeams.length - 1}
                          onClick={() => onReorder(team.id, 'down')}
                          className="text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer p-0.5"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-orange-700 font-bold">{team.id}</td>

                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span>{team.name}</span>
                      {isLive && (
                        <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white text-[9px] font-mono uppercase">
                          ON SCREEN
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-2.5 px-3 font-sans text-slate-600">
                    {team.leaderName || 'N/A'}
                  </td>

                  <td className="py-2.5 px-3 text-blue-700 font-bold">{team.psId || 'SIH1601'}</td>

                  <td className="py-2.5 px-3 truncate max-w-[180px]">
                    {driveLink ? (
                      <a
                        href={driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{driveLink}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">No Drive link</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSendToScreen(team.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          isLive
                            ? 'bg-orange-600 text-white'
                            : 'bg-orange-100 hover:bg-orange-200 text-orange-800'
                        }`}
                        title="Broadcast on Projector Screen"
                      >
                        <Tv className="w-3 h-3" />
                        <span>{isLive ? 'Live' : 'Send to Screen'}</span>
                      </button>

                      <button
                        onClick={() => onEditSlide(team)}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                        title="Edit Presentation Slides"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onRemove(team.id)}
                        className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Remove from Line"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
