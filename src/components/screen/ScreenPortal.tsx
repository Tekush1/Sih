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
  Trophy,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Play,
  Pause
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
    nextScreenSlide, 
    prevScreenSlide, 
    startScreenTimer, 
    pauseScreenTimer,
    setScreenSlideIndex
  } = useHackathon();

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
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

          <p className="text-xs sm:text-sm text-slate-400 font-medium flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="truncate">{currentTeam?.college || 'Technocrats Institute of Technology (TIT), Bhopal'}</span>
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
      {/* 3. CENTER: PPT / PRESENTATION SLIDE ONLY (Requested strictly)   */}
      {/* ============================================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 flex items-center justify-center relative z-10">
        <div className="w-full h-full min-h-[520px] rounded-3xl bg-slate-950/90 border border-slate-800/90 shadow-2xl overflow-hidden flex flex-col justify-between p-6 sm:p-10 relative">
          {/* Subtle Ambient Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

          {/* Active PPT Slide Render */}
          {currentSlide ? (
            <div className="h-full flex flex-col justify-between space-y-6 relative z-10 transition-opacity duration-300">
              {/* Slide Meta & Title */}
              <div className="border-b border-slate-800/80 pb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-orange-400 mb-1">
                    <span className="px-2.5 py-0.5 rounded bg-orange-950/80 border border-orange-700/60 text-orange-300 font-black">
                      SLIDE 0{screenState.slideIndex + 1} / 0{slides.length || 6}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-300 font-medium">{currentSlide.category}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-orange-400 font-bold font-mono">Window: {currentSlideDuration} Seconds</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                    {currentSlide.title}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-400 mt-1 font-light">
                    {currentSlide.subtitle}
                  </p>
                </div>

                {/* Per-slide live time gauge */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] font-mono text-slate-400">SLIDE WINDOW</span>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className={`text-xl font-bold tabular-nums ${isSlideEnding ? 'text-rose-400 animate-pulse' : 'text-orange-400'}`}>
                      {slideRemaining}s
                    </span>
                    <span className="text-xs text-slate-500">/ {currentSlideDuration}s</span>
                  </div>
                  <div className="w-28 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${isSlideEnding ? 'bg-rose-500' : 'bg-orange-500'}`}
                      style={{ width: `${slideProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Slide Body: Bullets & Visuals */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 py-2">
                {/* Left: Key Bullet Points */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-3">
                    {currentSlide.bulletPoints?.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-slate-200 text-sm sm:text-base leading-relaxed"
                      >
                        <div className="w-7 h-7 rounded-xl bg-orange-950 border border-orange-800/60 text-orange-400 flex items-center justify-center font-mono font-black text-xs shrink-0 mt-0.5">
                          0{idx + 1}
                        </div>
                        <p>{point}</p>
                      </div>
                    ))}
                  </div>

                  {/* Metrics Strip if present */}
                  {currentSlide.metrics && currentSlide.metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {currentSlide.metrics.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800"
                        >
                          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">{m.label}</p>
                          <p className="text-xl sm:text-2xl font-black font-mono text-orange-400 mt-1">{m.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Problem / Architecture / Prototype Visual Box */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-orange-400">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-orange-500" />
                        <span>SIH STAGE ARCHITECTURE</span>
                      </span>
                      <span className="text-emerald-400">VERIFIED DECK</span>
                    </div>

                    <div className="space-y-2.5 text-xs font-mono text-slate-300">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                        <span className="text-slate-400">SIH PS ID</span>
                        <span className="text-orange-400 font-bold">{currentTeam?.psId || 'SIH1601'}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                        <span className="text-slate-400">Ministry / Dept</span>
                        <span className="text-slate-200 truncate max-w-[180px]">{currentTeam?.sihOrganization || 'AICTE / MoE'}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                        <span className="text-slate-400">Track Clearance</span>
                        <span className="text-emerald-400 font-bold">100% Authorized</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 text-[11px] text-slate-400 border border-slate-800/60 leading-relaxed">
                      <span className="text-slate-200 font-bold">Project Focus: </span>
                      {currentTeam?.problemStatement || 'Smart India Hackathon Prototype'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Progress Dots with allocated seconds label */}
              <div className="pt-2 flex items-center justify-center gap-2">
                {slideDurations.map((duration, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === screenState.slideIndex
                        ? 'w-12 bg-orange-500'
                        : idx < screenState.slideIndex
                        ? 'w-3 bg-emerald-600'
                        : 'w-3 bg-slate-800'
                    }`}
                    title={`Slide 0${idx + 1} (${duration}s)`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <Clock className="w-16 h-16 text-orange-500/80 animate-pulse" />
              <h3 className="text-2xl font-bold text-slate-200">Awaiting Presentation Launch</h3>
              <p className="text-xs text-slate-500 font-mono">Use Admin Line Portal to push squad deck to this screen.</p>
            </div>
          )}

          {/* Presentation Finished Overlay Banner */}
          {screenState.isFinished && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-white">6-Minute Presentation Completed!</h3>
              <p className="text-sm text-slate-400 max-w-md">
                Squad <strong>{currentTeam?.name}</strong> has completed their pitch across all 6 slides.
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
        </div>
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
    </div>
  );
};
