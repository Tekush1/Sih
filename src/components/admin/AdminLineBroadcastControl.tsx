import React from 'react';
import { Team, ScreenLiveState } from '../../types';
import { Play, Pause, RotateCcw, Clock, SkipForward, ExternalLink } from 'lucide-react';

interface AdminLineBroadcastControlProps {
  currentScreenTeam?: Team;
  currentStandingNumber?: number;
  screenState: ScreenLiveState;
  formatTime: (sec: number) => string;
  startScreenTimer: () => void;
  pauseScreenTimer: () => void;
  resetScreenTimer: () => void;
  onNextTeam?: () => void;
  onOpenPopup?: () => void;
}

export const AdminLineBroadcastControl: React.FC<AdminLineBroadcastControlProps> = ({
  currentScreenTeam,
  currentStandingNumber,
  screenState,
  formatTime,
  startScreenTimer,
  pauseScreenTimer,
  resetScreenTimer,
  onNextTeam,
  onOpenPopup
}) => {
  const remainingSec = screenState.totalRemainingSeconds !== undefined
    ? screenState.totalRemainingSeconds
    : screenState.remainingSeconds;

  return (
    <div className="p-6 md:p-7 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Left: Squad on Stage */}
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
            LIVE ON AUDITORIUM SCREEN
          </span>
          {currentStandingNumber && (
            <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white font-mono text-xs font-black">
              STANDING #{currentStandingNumber}
            </span>
          )}
        </div>

        {currentScreenTeam ? (
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white truncate">
              {currentScreenTeam.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono mt-1">
              <span className="text-orange-400 font-bold">{currentScreenTeam.id}</span>
              <span>·</span>
              <span>{currentScreenTeam.track}</span>
              {currentScreenTeam.leaderName && (
                <>
                  <span>·</span>
                  <span className="text-slate-300">Lead: {currentScreenTeam.leaderName}</span>
                </>
              )}
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">
            No squad currently on screen. Click "Present" on any team below.
          </p>
        )}
      </div>

      {/* Right: Clean Timer & Simple Controls */}
      <div className="flex items-center gap-4 shrink-0 flex-wrap">
        {/* Countdown Display */}
        <div className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <Clock className="w-5 h-5 text-orange-400" />
          <div className="leading-tight">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">COUNTDOWN</span>
            <span className="text-2xl font-black font-mono tracking-tight text-white tabular-nums">
              {formatTime(remainingSec)}
            </span>
          </div>
        </div>

        {/* Essential Buttons: Play/Pause, Reset, Next Team, Pop Screen */}
        <div className="flex items-center gap-2">
          {screenState.isRunning ? (
            <button
              onClick={pauseScreenTimer}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Pause Timer"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={startScreenTimer}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Start Timer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start</span>
            </button>
          )}

          <button
            onClick={() => resetScreenTimer()}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset Timer to 6:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {onNextTeam && (
            <button
              onClick={onNextTeam}
              className="px-3.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Send Next Squad in Standings to Screen"
            >
              <span>Next Squad</span>
              <SkipForward className="w-4 h-4" />
            </button>
          )}

          {onOpenPopup && (
            <button
              onClick={onOpenPopup}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Pop Screen in New Window"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
