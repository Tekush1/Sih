import React from 'react';
import { Team } from '../../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface RegistrationSuccessViewProps {
  team: Team;
  onOpenTeamPortal: (team: Team) => void;
  onRegisterAnother: () => void;
}

export const RegistrationSuccessView: React.FC<RegistrationSuccessViewProps> = ({
  team,
  onOpenTeamPortal,
  onRegisterAnother
}) => {
  return (
    <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-mono font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase">
          Team Registered Successfully
        </span>
        <h3 className="text-2xl font-black text-slate-900 mt-2">{team.name}</h3>
        <p className="text-sm font-mono text-slate-500">
          ID: <strong className="text-orange-700">{team.id}</strong> · Passcode: <strong className="text-slate-800">{team.passcode}</strong>
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#faf7f2] border border-slate-200 text-xs text-left font-mono space-y-1.5">
        <div><strong>Campus:</strong> {team.college}</div>
        <div><strong>Track:</strong> {team.track}</div>
        <div><strong>PS ID:</strong> {team.psId || 'SIH1609'}</div>
        <div><strong>Google Drive Folder:</strong> {team.googleDriveFolder}</div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => onOpenTeamPortal(team)}
          className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span>Open Team Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onRegisterAnother}
          className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold cursor-pointer"
        >
          Register Another Team
        </button>
      </div>
    </div>
  );
};
