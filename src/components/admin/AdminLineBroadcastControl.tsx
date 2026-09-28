import React from 'react';
import { Team, ScreenLiveState } from '../../types';
import { Play, Pause, RotateCcw, Clock, ExternalLink } from 'lucide-react';

interface AdminLineBroadcastControlProps {
  currentScreenTeam?: Team;
  screenState: ScreenLiveState;
  slideDurations: number[];
  currentSlide?: { title: string };
  slidesCount: number;
  formatTime: (sec: number) => string;
  startScreenTimer: () => void;
  pauseScreenTimer: () => void;
  resetScreenTimer: () => void;
  adjustScreenTimer: (delta: number) => void;
  setScreenSlideIndex: (idx: number) => void;
  prevScreenSlide: () => void;
  nextScreenSlide: () => void;
}

export const AdminLineBroadcastControl: React.FC<AdminLineBroadcastControlProps> = ({
  currentScreenTeam,
  screenState,
  slideDurations,
  currentSlide,
  slidesCount,
  formatTime,
  startScreenTimer,
  pauseScreenTimer,
  resetScreenTimer,
  adjustScreenTimer,
  setScreenSlideIndex,
  prevScreenSlide,
  nextScreenSlide
}) => {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-orange-500 animate-ping" />
          <div>
            <span className="text-[10px] font-mono tracking-widest text-orange-400 font-bold uppercase block">
              LIVE ON AUDITORIUM PROJECTOR SCREEN
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 flex-wrap">
              <span>{currentScreenTeam ? currentScreenTeam.name : 'Awaiting Squad Selection'}</span>
              {currentScreenTeam && (
                <span className="text-orange-400 font-mono text-base font-bold">({currentScreenTeam.id})</span>
              )}
              {currentScreenTeam?.psId && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900 border border-blue-500 text-blue-200 font-mono font-bold">
                  PS: {currentScreenTeam.psId}
                </span>
              )}
            </h3>
            {(currentScreenTeam?.googleDriveFolder || currentScreenTeam?.submission?.googleDriveFileUrl) && (
              <div className="pt-1.5">
                <a
                  href={currentScreenTeam.submission?.googleDriveFileUrl || currentScreenTeam.googleDriveFolder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/90 hover:bg-blue-900 border border-blue-500/60 text-blue-300 text-[11px] font-mono transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-blue-400" />
                  <span>Open Drive Link</span>
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="px-4 py-2 rounded-2xl bg-orange-950/80 border border-orange-500/80 text-orange-400 flex items-center gap-2.5 shadow-sm">
            <Clock className="w-5 h-5 text-orange-400 animate-pulse" />
            <div className="leading-tight">
              <span className="text-[10px] text-orange-300 font-mono font-bold block uppercase">
                SLIDE 0{screenState.slideIndex + 1} TIMER ({slideDurations[screenState.slideIndex] || 60}s)
              </span>
              <span className="text-2xl font-black font-mono tracking-tight tabular-nums">
                {formatTime(screenState.slideRemainingSeconds !== undefined ? screenState.slideRemainingSeconds : 10)}
              </span>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-2.5">
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">TOTAL PITCH</span>
              <span className="text-2xl font-black font-mono tracking-tight tabular-nums text-white">
                {formatTime(screenState.totalRemainingSeconds !== undefined ? screenState.totalRemainingSeconds : screenState.remainingSeconds)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Screen Timer Controls
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {screenState.isRunning ? (
              <button
                onClick={pauseScreenTimer}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Timer</span>
              </button>
            ) : (
              <button
                onClick={startScreenTimer}
                className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-600/30 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Countdown</span>
              </button>
            )}

            <button
              onClick={() => resetScreenTimer()}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Pitch</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-xs font-mono flex-wrap">
            <span className="text-slate-500 text-[11px]">Adjust:</span>
            <button onClick={() => adjustScreenTimer(10)} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold cursor-pointer">+10s</button>
            <button onClick={() => adjustScreenTimer(-10)} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold cursor-pointer">-10s</button>
            <button onClick={() => adjustScreenTimer(30)} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold cursor-pointer">+30s</button>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Slide Remote (Current: 0{screenState.slideIndex + 1} / 0{slidesCount || 6})
            </span>
            <span className="text-xs text-orange-400 font-mono font-bold truncate max-w-xs">
              {currentSlide?.title}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: 'Problem', time: '10s' },
              { label: 'Architecture', time: '60s' },
              { label: 'Innovation', time: '60s' },
              { label: 'Demo', time: '40s' },
              { label: 'Feasibility', time: '40s' },
              { label: 'Roadmap', time: '20s' }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => setScreenSlideIndex(idx)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer flex items-center gap-1 ${
                  screenState.slideIndex === idx ? 'bg-orange-500 text-white shadow-sm ring-1 ring-orange-300' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>0{idx + 1}</span>
                <span className="hidden sm:inline font-sans text-[11px] font-normal">{item.label}</span>
                <span className="text-[10px] text-slate-400">({item.time})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button onClick={prevScreenSlide} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono font-bold text-slate-200 cursor-pointer">
              ← Previous Slide
            </button>
            <button onClick={nextScreenSlide} className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-mono font-bold text-white cursor-pointer">
              Next Slide →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
