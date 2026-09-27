import React, { useEffect, useState, useRef } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Clock, 
  Layers, 
  Zap, 
  AlertCircle,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Play,
  Pause,
  ExternalLink,
  FileSpreadsheet,
  Plus
} from 'lucide-react';
import { GoogleDriveDeckViewer } from '../presentation/GoogleDriveDeckViewer';
import { CSVUploadModal } from '../admin/CSVUploadModal';

interface ScreenPortalProps {
  onOpenAdmin?: () => void;
}

export const ScreenPortal: React.FC<ScreenPortalProps> = ({ onOpenAdmin }) => {
  const { 
    screenState, 
    teams, 
    queueTeams,
    sendTeamToScreen, 
    nextScreenSlide, 
    prevScreenSlide, 
    startScreenTimer, 
    pauseScreenTimer,
    setScreenSlideIndex,
    updateTeamDriveUrl
  } = useHackathon();

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showCSVModal, setShowCSVModal] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevSlideIndexRef = useRef<number>(screenState.slideIndex);

  // Active team on screen
  const currentTeam = teams.find((t) => t.id === screenState.teamId) || teams[0];
  const slides = currentTeam?.submission?.slides || [];
  const currentSlide = slides[screenState.slideIndex] || slides[0];

  // Slide durations: 1st slide: 10s, 2nd: 60s, 3rd: 60s, 4th: 40s, 5th: 40s, 6th: 20s
  const slideDurations = screenState.slideDurations && screenState.slideDurations.length === 6
    ? screenState.slideDurations
    : [10, 60, 60, 40, 40, 20];

  const currentSlideDuration = slideDurations[screenState.slideIndex] || 60;
  const slideRemaining = screenState.slideRemainingSeconds !== undefined 
    ? screenState.slideRemainingSeconds 
    : currentSlideDuration;

  const totalRemaining = screenState.totalRemainingSeconds !== undefined
    ? screenState.totalRemainingSeconds
    : screenState.remainingSeconds || 230;

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Sound chime when a slide auto-advances
  useEffect(() => {
    if (prevSlideIndexRef.current !== screenState.slideIndex) {
      if (soundEnabled) {
        // High soft double-beep on slide advance
        playBeep(660, 120);
        setTimeout(() => playBeep(880, 150), 140);
      }
      prevSlideIndexRef.current = screenState.slideIndex;
    }
  }, [screenState.slideIndex, soundEnabled]);

  // Audio tone helper
  const playBeep = (freq: number, durationMs: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationMs / 1000);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + durationMs / 1000);
    } catch (e) {
      // AudioContext might be restricted until user interaction
    }
  };

  // Keyboard navigation for projector clickers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextScreenSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevScreenSlide();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'p') {
        if (screenState.isRunning) {
          pauseScreenTimer();
        } else {
          startScreenTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextScreenSlide, prevScreenSlide, screenState.isRunning, startScreenTimer, pauseScreenTimer]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Find next team in line
  const currentQueueIdx = queueTeams.findIndex((t) => t.id === screenState.teamId);
  const nextTeamInLine = currentQueueIdx !== -1 && currentQueueIdx < queueTeams.length - 1
    ? queueTeams[currentQueueIdx + 1]
    : undefined;

  const isSlideEnding = slideRemaining <= 3;
  const slideProgressPercent = Math.max(0, Math.min(100, (slideRemaining / currentSlideDuration) * 100));

  const SLIDE_LABELS = [
    { label: 'Problem & Root Cause', time: '10s' },
    { label: 'System Architecture', time: '1m' },
    { label: 'Core Innovation', time: '1m' },
    { label: 'Live Demo & Prototype', time: '40s' },
    { label: 'Feasibility & ROI', time: '40s' },
    { label: 'Roadmap & Conclusion', time: '20s' }
  ];

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[92vh] bg-[#070b14] text-white flex flex-col justify-between overflow-hidden select-none relative"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(249, 115, 22, 0.10) 0%, rgba(7, 11, 20, 1) 75%)'
      }}
    >
      {/* ============================================================== */}
      {/* 1. TOP BAR: COUNTDOWN TIMER & TEAM NAME (Requested strictly)   */}
      {/* ============================================================== */}
      <header className="px-6 sm:px-10 py-4 sm:py-5 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md flex items-center justify-between gap-6 shrink-0 relative z-20">
        {/* Left: TEAM NAME & SIH PS ID */}
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
              <span className="truncate">{currentTeam?.college || 'Technocrats Institute of Technology (TIT), Bhopal'}</span>
            </span>

            {(currentTeam?.submission?.googleDriveFileUrl || currentTeam?.googleDriveFolder) && (
              <a
                href={currentTeam?.submission?.googleDriveFileUrl || currentTeam?.googleDriveFolder}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/50 text-blue-300 text-[11px] font-mono hover:bg-blue-900 transition-colors"
                title="Open uploaded Google Drive presentation"
              >
                <ExternalLink className="w-3 h-3 text-blue-400" />
                <span>Drive Presentation</span>
              </a>
            )}
          </p>
        </div>

        {/* Right: DUAL TIMERS - ACTIVE SLIDE COUNTDOWN & TOTAL COUNTDOWN */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* PRIMARY: CURRENT SLIDE COUNTDOWN TIMER (10s, 60s, 60s, 40s, 40s, 20s) */}
          <div
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl border transition-all flex items-center gap-3 shadow-2xl relative overflow-hidden ${
              isSlideEnding
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse shadow-rose-500/30'
                : 'bg-orange-950/50 border-orange-500/80 text-orange-400 shadow-orange-500/20'
            }`}
          >
            {/* Progress fill behind */}
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
                SLIDE 0{screenState.slideIndex + 1} TIMER ({currentSlideDuration}s)
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight tabular-nums mt-0.5">
                {formatTime(slideRemaining)}
              </span>
            </div>
          </div>

          {/* SECONDARY: TOTAL PITCH REMAINING TIMER */}
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

      {/* ============================================================== */}
      {/* 2. AUTO-ADVANCING SLIDE SCHEDULE STRIP (10s, 1m, 1m, 40s, 40s, 20s) */}
      {/* ============================================================== */}
      <div className="px-6 sm:px-10 py-2 bg-slate-950/60 border-b border-slate-900 flex items-center justify-between text-xs font-mono overflow-x-auto gap-3 scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-orange-400 font-bold uppercase mr-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-orange-500 animate-pulse" />
            AUTO-CADENCE:
          </span>
          {SLIDE_LABELS.map((item, idx) => {
            const isActive = idx === screenState.slideIndex;
            const isCompleted = idx < screenState.slideIndex;
            return (
              <button
                key={idx}
                onClick={() => setScreenSlideIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-400/50 scale-105'
                    : isCompleted
                    ? 'bg-slate-900 border border-emerald-800/60 text-emerald-400'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                <span>0{idx + 1}</span>
                <span className="hidden md:inline font-sans font-medium text-[10px] opacity-90">{item.label}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-black ${isActive ? 'bg-orange-950 text-orange-200' : 'bg-slate-800 text-slate-400'}`}>
                  {item.time}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Auto-advance: <strong>Active</strong></span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CENTER: ORIGINAL GOOGLE DRIVE PRESENTATION DECK (Real Drive) */}
      {/* ============================================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col justify-center relative z-10">
        {currentTeam ? (
          <div className="w-full flex-1 flex flex-col justify-between space-y-4">
            {/* Real Google Drive Presentation Iframe Viewer */}
            <GoogleDriveDeckViewer
              driveUrl={currentTeam.googleDriveFolder || currentTeam.submission?.googleDriveFileUrl}
              teamName={currentTeam.name}
              teamId={currentTeam.id}
              track={currentTeam.track}
              onUpdateDriveUrl={(newUrl) => updateTeamDriveUrl(currentTeam.id, newUrl)}
              onOpenAdmin={onOpenAdmin}
            />

            {/* Slide Progress Cadence Indicator */}
            <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-900 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-orange-400 font-bold uppercase text-[10px]">Active Window:</span>
                <span className="text-white font-bold">
                  Slide 0{screenState.slideIndex + 1} ({slideDurations[screenState.slideIndex] || 60}s)
                </span>
                <span className="text-slate-600">·</span>
                <span>{SLIDE_LABELS[screenState.slideIndex]?.label}</span>
              </div>

              {/* Slide dots */}
              <div className="flex items-center gap-1.5">
                {slideDurations.map((duration, idx) => (
                  <button
                    key={idx}
                    onClick={() => setScreenSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === screenState.slideIndex
                        ? 'w-10 bg-orange-500 shadow-xs shadow-orange-500/50'
                        : idx < screenState.slideIndex
                        ? 'w-2.5 bg-emerald-600'
                        : 'w-2.5 bg-slate-800'
                    }`}
                    title={`Jump to Slide 0${idx + 1} (${duration}s)`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full min-h-[460px] rounded-3xl bg-slate-950/90 border border-slate-800 flex flex-col items-center justify-center text-center p-8 space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-xl shadow-orange-500/10">
              <FileSpreadsheet className="w-10 h-10" />
            </div>

            <div className="max-w-md space-y-2">
              <span className="px-3 py-1 rounded-full bg-orange-950 border border-orange-800 text-orange-400 text-xs font-mono font-bold uppercase">
                Database Clean · Ready for Real Data
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                No Squads in Lineup Yet
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                The fake data has been purged. Please insert your real CSV file containing Team Name, Track, and Google Drive links to launch presentations on this projector screen.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setShowCSVModal(true)}
                className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm flex items-center gap-2 transition-all shadow-lg shadow-orange-600/25 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
                <span>Insert CSV File Now</span>
              </button>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm transition-colors cursor-pointer"
                >
                  Open Admin Portal
                </button>
              )}
            </div>
          </div>
        )}

        {/* Presentation Finished Overlay Banner */}
        {screenState.isFinished && currentTeam && (
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
          )}
      </main>

      {/* ============================================================== */}
      {/* 4. DISCREET PROJECTOR FOOTER CONTROLS                          */}
      {/* ============================================================== */}
      <footer className="px-6 py-2.5 flex items-center justify-between text-xs text-slate-500 font-mono border-t border-slate-900 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Auditorium Projector Display</span>
          </span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="hidden md:inline text-slate-400">
            Cadence: Slide 1 (10s) → Slide 2 (1m) → Slide 3 (1m) → Slide 4 (40s) → Slide 5 (40s) → Slide 6 (20s)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-[11px]"
            >
              Open Admin Line
            </button>
          )}

          <button
            onClick={() => setSoundEnabled((s) => !s)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Chimes' : 'Unmute Chimes'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle Projector Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-orange-400" /> : <Maximize2 className="w-4 h-4 text-orange-400" />}
          </button>
        </div>
      </footer>

      {/* CSV Upload Modal */}
      <CSVUploadModal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
      />
    </div>
  );
};
