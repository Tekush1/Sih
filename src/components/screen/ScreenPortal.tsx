import React, { useState, useRef, useEffect } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { GoogleDriveDeckViewer } from '../presentation/GoogleDriveDeckViewer';
import { CSVUploadModal } from '../admin/CSVUploadModal';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  Clock, 
  FileSpreadsheet,
  ArrowLeft
} from 'lucide-react';

interface ScreenPortalProps {
  onOpenAdmin?: () => void;
}

export const ScreenPortal: React.FC<ScreenPortalProps> = ({ onOpenAdmin }) => {
  const { 
    screenState, 
    teams, 
    queueTeams,
    sendTeamToScreen, 
    startScreenTimer, 
    pauseScreenTimer,
    resetScreenTimer,
    updateTeamDriveUrl
  } = useHackathon();

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCSVModal, setShowCSVModal] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTeam = teams.find((t) => t.id === screenState.teamId) || queueTeams[0] || teams[0];
  const currentStandingIndex = queueTeams.findIndex((t) => t.id === (currentTeam?.id));
  const currentStandingNumber = currentStandingIndex !== -1 ? currentStandingIndex + 1 : 1;

  const totalRemaining = screenState.totalRemainingSeconds !== undefined 
    ? screenState.totalRemainingSeconds 
    : (screenState.remainingSeconds || 360);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleNextTeam = () => {
    if (queueTeams.length === 0) return;
    if (currentStandingIndex !== -1 && currentStandingIndex < queueTeams.length - 1) {
      sendTeamToScreen(queueTeams[currentStandingIndex + 1].id, 6);
    } else {
      sendTeamToScreen(queueTeams[0].id, 6);
    }
  };

  const handlePrevTeam = () => {
    if (queueTeams.length === 0) return;
    if (currentStandingIndex > 0) {
      sendTeamToScreen(queueTeams[currentStandingIndex - 1].id, 6);
    }
  };

  const openPopup = () => {
    const url = `${window.location.origin}${window.location.pathname}?portal=screen`;
    window.open(url, 'AuditoriumScreen', 'width=1280,height=720,menubar=no,toolbar=no');
  };

  // Keyboard navigation for presentation operator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        if (screenState.isRunning) pauseScreenTimer();
        else startScreenTimer();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screenState.isRunning, startScreenTimer, pauseScreenTimer]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-[#070b14] text-white flex flex-col justify-between overflow-hidden select-none"
    >
      {/* 1. Clean Top Bar: Standing Number, Squad Name & Timer */}
      <header className="px-6 py-3.5 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between gap-4">
        {/* Squad Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="px-2.5 py-1 rounded-xl bg-orange-600 text-white font-mono text-xs font-black shadow-xs">
              STANDING #{currentStandingNumber}
            </span>
          </div>

          {currentTeam ? (
            <div className="truncate">
              <h2 className="text-lg sm:text-xl font-black text-white truncate">
                {currentTeam.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="text-orange-400 font-bold">{currentTeam.id}</span>
                <span>·</span>
                <span>{currentTeam.track}</span>
                {currentTeam.college && (
                  <>
                    <span className="hidden sm:inline">·</span>
                    <span className="text-slate-400 truncate hidden sm:inline">{currentTeam.college}</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <span className="text-slate-400 text-sm">No squad loaded</span>
          )}
        </div>

        {/* Clean Timer Display & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white tabular-nums">
              {formatTime(totalRemaining)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {screenState.isRunning ? (
              <button
                onClick={pauseScreenTimer}
                className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer"
                title="Pause Countdown (P)"
              >
                <Pause className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                onClick={startScreenTimer}
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors cursor-pointer"
                title="Start Countdown (P)"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            )}

            <button
              onClick={() => resetScreenTimer()}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Reset Timer to 6:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Center: Full-View Presentation Deck */}
      <main className="flex-1 w-full p-3 sm:p-4 flex flex-col justify-center">
        {currentTeam ? (
          <div className="w-full flex-1 flex flex-col justify-between">
            <GoogleDriveDeckViewer
              driveUrl={currentTeam.googleDriveFolder || currentTeam.submission?.googleDriveFileUrl}
              teamName={currentTeam.name}
              teamId={currentTeam.id}
              track={currentTeam.track}
              onUpdateDriveUrl={(newUrl) => updateTeamDriveUrl(currentTeam.id, newUrl)}
              onOpenAdmin={onOpenAdmin}
            />
          </div>
        ) : (
          <div className="w-full h-full min-h-[440px] rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center p-8 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-white">No Squads in Lineup</h3>
              <p className="text-xs text-slate-400">
                Upload your CSV file containing team names and presentation links to start the auditorium session.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCSVModal(true)}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Insert Teams via CSV
              </button>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                >
                  Go to Standings Table
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 3. Simple Bottom Controller Bar */}
      <footer className="px-6 py-2.5 bg-slate-950/95 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-slate-400">
        {/* Navigation: Previous / Next Squad */}
        <div className="flex items-center gap-2">
          {queueTeams.length > 1 && (
            <>
              <button
                onClick={handlePrevTeam}
                disabled={currentStandingIndex <= 0}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <SkipBack className="w-3.5 h-3.5" />
                <span>Prev Squad</span>
              </button>
              <button
                onClick={handleNextTeam}
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span>Next Squad</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <span className="text-[11px] text-slate-500 ml-2 hidden sm:inline">
            Auditorium Projector · Smart Hackathon 2026
          </span>
        </div>

        {/* Right Tools: Pop Screen, Fullscreen, Back to Standings */}
        <div className="flex items-center gap-2">
          <button
            onClick={openPopup}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="Pop out in separate projector window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Pop Screen ↗</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-orange-400" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Standings</span>
            </button>
          )}
        </div>
      </footer>

      <CSVUploadModal isOpen={showCSVModal} onClose={() => setShowCSVModal(false)} />
    </div>
  );
};
