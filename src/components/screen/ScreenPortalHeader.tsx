import React from 'react';
import { Team } from '../../types';
import { Building2, Clock, ExternalLink } from 'lucide-react';

interface ScreenPortalHeaderProps {
  currentTeam?: Team;
  isSlideEnding: boolean;
  slideProgressPercent: number;
  currentSlideIndex: number;
  currentSlideDuration: number;
  formatTime: (sec: number) => string;
  slideRemaining: number;
  totalRemaining: number;
}

export const ScreenPortalHeader: React.FC<ScreenPortalHeaderProps> = ({
  currentTeam,
  isSlideEnding,
  slideProgressPercent,
  currentSlideIndex,
  currentSlideDuration,
  formatTime,
  slideRemaining,
  totalRemaining
}) => {
  return (
    <header className="px-6 sm:px-10 py-4 sm:py-5 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md flex items-center justify-between gap-6 shrink-0 relative z-20">
      {/* Left: TEAM NAME, LEADER, SIH PS ID */}
      <div className="space-y-1 max-w-2xl min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 font-mono text-xs sm:text-sm font-black">
            {currentTeam?.id || 'SH26-001'}
          </span>

          {currentTeam?.psId && (
            <span className="px-3 py-0.5 rounded-lg bg-blue-950/90 border border-blue-500/60 text-blue-300 font-mono text-xs sm:text-sm font-black tracking-wider">
              PS: {currentTeam.psId}
            </span>
          )}

          {currentTeam?.leaderName && (
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
              Leader: {currentTeam.leaderName}
            </span>
          )}

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            · {currentTeam?.track}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight line-clamp-1">
          {currentTeam?.name || 'Squad Name'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 font-medium flex items-center gap-2 truncate">
          <span className="flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="truncate">{currentTeam?.college || 'TIT Bhopal'}</span>
          </span>

          {(currentTeam?.submission?.googleDriveFileUrl || currentTeam?.googleDriveFolder) && (
            <a
              href={currentTeam?.submission?.googleDriveFileUrl || currentTeam?.googleDriveFolder}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/50 text-blue-300 text-[11px] font-mono hover:bg-blue-900 transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-blue-400" />
              <span>Drive Link</span>
            </a>
          )}
        </p>
      </div>

      {/* Right: Dual Countdown Timers */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div
          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl border transition-all flex items-center gap-3 shadow-2xl relative overflow-hidden ${
            isSlideEnding
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse shadow-rose-500/30'
              : 'bg-orange-950/50 border-orange-500/80 text-orange-400 shadow-orange-500/20'
          }`}
        >
          <div
            className="absolute left-0 top-0 bottom-0 bg-orange-500/10 pointer-events-none transition-all duration-1000"
            style={{ width: `${slideProgressPercent}%` }}
          />

          <Clock
            className={`w-6 h-6 sm:w-8 sm:h-8 shrink-0 relative z-10 ${
              isSlideEnding ? 'text-rose-400 animate-spin' : 'text-orange-400'
            }`}
          />
          <div className="flex flex-col items-start leading-none relative z-10">
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-orange-300 font-black uppercase">
              SLIDE 0{currentSlideIndex + 1} ({currentSlideDuration}s)
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight tabular-nums mt-0.5">
              {formatTime(slideRemaining)}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-end px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300">
          <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">
            TOTAL PITCH
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono text-white tabular-nums">
            {formatTime(totalRemaining)}
          </span>
        </div>
      </div>
    </header>
  );
};
