import React from 'react';
import { Team } from '../../types';
import { Lock, Building2 } from 'lucide-react';

interface TeamPortalHeaderProps {
  currentTeam: Team;
  teams: Team[];
  setActiveTeamId: (id: string) => void;
}

export const TeamPortalHeader: React.FC<TeamPortalHeaderProps> = ({
  currentTeam,
  teams,
  setActiveTeamId
}) => {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-1">
          <Lock className="w-3.5 h-3.5" />
          <span>TEAM PORTAL</span>
          <span className="text-orange-300">·</span>
          <span className="text-[#b47e3a]">SIH 2026 INTERNAL</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <span>{currentTeam.name}</span>
          <span className="text-orange-600 font-mono text-lg font-bold">({currentTeam.id})</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 font-mono font-bold">
            PS: {currentTeam.psId || 'SIH1609'}
          </span>
        </h2>
        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentTeam.college}</span>
          <span>·</span>
          <span className="text-orange-700 font-bold">{currentTeam.track}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs font-mono font-bold text-slate-500">Switch Squad:</label>
        <select
          value={currentTeam.id}
          onChange={(e) => setActiveTeamId(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs font-mono font-bold text-orange-700 focus:outline-none focus:border-orange-500 shadow-2xs"
        >
          {teams.slice(0, 25).map((t) => (
            <option key={t.id} value={t.id}>
              {t.id} - {t.name} [{t.psId || 'SIH'}]
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
