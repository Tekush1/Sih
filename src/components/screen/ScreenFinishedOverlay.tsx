import React from 'react';
import { Team } from '../../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ScreenFinishedOverlayProps {
  currentTeam: Team;
  nextTeamInLine?: Team;
  sendTeamToScreen: (teamId: string) => void;
}

export const ScreenFinishedOverlay: React.FC<ScreenFinishedOverlayProps> = ({
  currentTeam,
  nextTeamInLine,
  sendTeamToScreen
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center space-y-4 animate-in fade-in rounded-3xl m-4">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h3 className="text-3xl font-black text-white">6-Minute Presentation Completed!</h3>
      <p className="text-sm text-slate-400 max-w-md">
        Squad <strong className="text-white">{currentTeam?.name}</strong> has completed their pitch cycle.
      </p>

      {nextTeamInLine && (
        <div className="pt-4 flex flex-col items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Next squad in presentation line:</span>
          <button
            onClick={() => sendTeamToScreen(nextTeamInLine.id)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-orange-500/30 cursor-pointer"
          >
            <span>Launch Next: {nextTeamInLine.name} ({nextTeamInLine.id})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
