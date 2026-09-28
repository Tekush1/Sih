import React from 'react';
import { Team } from '../../types';
import { X, Maximize2, Minimize2, Clock } from 'lucide-react';

interface PresentationEngineHeaderProps {
  team: Team;
  timeFormatted: string;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  onClose: () => void;
}

export const PresentationEngineHeader: React.FC<PresentationEngineHeaderProps> = ({
  team,
  timeFormatted,
  isFullscreen,
  toggleFullscreen,
  onClose
}) => {
  const membersList = team.members && team.members.length > 0 ? team.members : [];

  return (
    <header className="px-4 py-2.5 bg-slate-950/95 border-b border-slate-800 text-white shrink-0 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Team Name, Team Leader, PS ID */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-2.5 py-1 rounded-lg bg-orange-600/20 border border-orange-500/40 text-orange-400 font-bold text-sm tracking-wide">
            {team.name}
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs">
            <span className="text-slate-400 font-medium">Leader: </span>
            <span className="font-semibold text-white">{team.leaderName || 'N/A'}</span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-600/50 text-blue-300 font-mono text-xs font-bold">
            PS ID: {team.psId || 'SIH1609'}
          </div>

          {team.theme && (
            <div className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-700/50 text-purple-300 text-xs truncate max-w-xs">
              <span className="text-purple-400 font-medium">Theme: </span>
              {team.theme}
            </div>
          )}
        </div>

        {/* Right Controls: Timer, Fullscreen, Close */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-200">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>{timeFormatted}</span>
          </div>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            title="Exit Presentation"
            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Second Row: Problem Statement & Team Members */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-2 text-xs">
        {/* Problem Statement */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-mono text-[11px] font-semibold shrink-0">
            Problem Statement
          </span>
          <p className="text-slate-300 truncate text-[12px] font-medium" title={team.problemStatement}>
            {team.problemStatement || 'SIH 2026 Problem Statement description'}
          </p>
        </div>

        {/* Team Members */}
        {membersList.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <span className="text-slate-400 font-semibold text-[11px]">Members:</span>
            {membersList.map((m, idx) => (
              <span
                key={m.id || idx}
                className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/70 text-slate-200 text-[11px]"
              >
                {m.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
