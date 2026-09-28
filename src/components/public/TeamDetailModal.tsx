import React from 'react';
import { Team, Stage } from '../../types';
import { X, Building2, ExternalLink } from 'lucide-react';

interface TeamDetailModalProps {
  team: Team | null;
  stages: Stage[];
  onClose: () => void;
  onOpenTeamPortal?: (teamId: string) => void;
}

export const TeamDetailModal: React.FC<TeamDetailModalProps> = ({
  team,
  stages,
  onClose,
  onOpenTeamPortal
}) => {
  if (!team) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-orange-600 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-800 font-bold">
                {team.id}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                PS ID: {team.psId || 'SIH1609'}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-700 font-bold">{team.track}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{team.name}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
              <Building2 className="w-3.5 h-3.5 text-orange-600" />
              <span>{team.college}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Problem Statement Focus */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-orange-700 font-bold">ORGANIZATION:</span>
            <span className="text-slate-800 font-medium">{team.sihOrganization || 'Ministry of Education / AICTE'}</span>
          </div>
          <p className="text-sm text-slate-800 font-medium leading-relaxed bg-[#faf7f2] p-4 rounded-xl border border-amber-100">
            {team.problemStatement}
          </p>
          {(team.submission?.googleDriveFileUrl || team.googleDriveFolder) && (
            <a
              href={team.submission?.googleDriveFileUrl || team.googleDriveFolder}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-mono"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Pitch Deck on Google Drive</span>
            </a>
          )}
        </div>

        {/* Squad Members */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider">
            SQUAD MEMBERS &amp; LEADER
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#faf7f2] border border-amber-100">
              <div className="text-[11px] font-mono text-orange-700 font-bold">LEADER</div>
              <div className="font-bold text-slate-900 mt-1">{team.leaderName}</div>
              <div className="text-slate-500 text-[11px]">{team.leaderEmail}</div>
              {team.leaderPhone && <div className="text-slate-400 text-[10px] font-mono">{team.leaderPhone}</div>}
            </div>

            {team.members.map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#faf7f2] border border-amber-100">
                <div className="text-[11px] font-mono text-slate-500 font-bold">MEMBER {idx + 1}</div>
                <div className="font-bold text-slate-900 mt-1">{m.name}</div>
                <div className="text-slate-500 text-[11px]">{m.email}</div>
                {m.enrollment && <div className="text-slate-400 text-[10px] font-mono">{m.enrollment}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Stage & Slot */}
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-slate-500 block">STAGE VENUE</span>
            <span className="text-slate-900 font-bold">
              {stages.find((s) => s.id === team.stageId)?.name || 'Stage Alpha'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">SLOT TIME</span>
            <span className="text-orange-700 font-bold">{team.scheduledSlot?.startTime || '14:00'} (6 Mins)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          {onOpenTeamPortal && (
            <button
              onClick={() => {
                onOpenTeamPortal(team.id);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer"
            >
              Open Team Portal
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
