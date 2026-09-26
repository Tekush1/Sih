import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Team, Stage } from '../../types';
import { PresentationRenderer } from './PresentationRenderer';
import { useHackathon } from '../../context/HackathonContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Award,
  ArrowRight
} from 'lucide-react';

interface PresentationEngineProps {
  team: Team;
  stage: Stage;
  onClose: () => void;
  onNextTeam?: (nextTeamId: string) => void;
}

export const PresentationEngine: React.FC<PresentationEngineProps> = ({
  team,
  stage,
  onClose,
  onNextTeam
}) => {
  const { completePresentation, schedules } = useHackathon();

  // 3, 2, 1 Countdown state
  const [countdown, setCountdown] = useState<number>(3);
  const [isPreStart, setIsPreStart] = useState<boolean>(true);

  // 6 minutes = 360 seconds
  const TOTAL_DURATION = 360;
  const SLIDE_DURATION = 60; // 60s per slide
  const TOTAL_SLIDES = 6;

  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Judging scoring input upon completion
  const [innovationScore, setInnovationScore] = useState<number>(24);
  const [technicalScore, setTechnicalScore] = useState<number>(23);
  const [feasibilityScore, setFeasibilityScore] = useState<number>(24);
  const [presentationScore, setPresentationScore] = useState<number>(24);
  const [judgeNotes, setJudgeNotes] = useState<string>('Strong technical architecture and smooth automated demonstration.');

  const containerRef = useRef<HTMLDivElement>(null);

  // Pre-start countdown (3, 2, 1, START)
  useEffect(() => {
    if (!isPreStart) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsPreStart(false);
      setIsRunning(true);
    }
  }, [countdown, isPreStart]);

  // Main 6-minute clock
  useEffect(() => {
    if (!isRunning || isCompleted) return;

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => {
        const next = prev + 1;

        // Auto advance slide every 60s
        const calculatedSlide = Math.min(Math.floor(next / SLIDE_DURATION), TOTAL_SLIDES - 1);
        if (calculatedSlide !== currentSlideIndex && next < TOTAL_DURATION) {
          setCurrentSlideIndex(calculatedSlide);
        }

        // Completion at 360 seconds (6 minutes)
        if (next >= TOTAL_DURATION) {
          clearInterval(interval);
          setIsRunning(false);
          setIsCompleted(true);
          try {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 }
            });
          } catch (e) {
            console.warn(e);
          }
          return TOTAL_DURATION;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isCompleted, currentSlideIndex]);

  // Keyboard navigation shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Space: Pause / Resume
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((r) => !r);
      }
      // Arrow Right: Next slide
      else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setCurrentSlideIndex((curr) => {
          const next = Math.min(curr + 1, TOTAL_SLIDES - 1);
          setSecondsElapsed(next * SLIDE_DURATION);
          return next;
        });
      }
      // Arrow Left: Previous slide
      else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideIndex((curr) => {
          const prev = Math.max(curr - 1, 0);
          setSecondsElapsed(prev * SLIDE_DURATION);
          return prev;
        });
      }
      // 'R' / 'r': Restart
      else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setSecondsElapsed(0);
        setCurrentSlideIndex(0);
        setIsCompleted(false);
        setIsRunning(true);
      }
      // Escape: Exit fullscreen or close if not fullscreen
      else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(console.error);
        }
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  const jumpToSlide = (idx: number) => {
    setCurrentSlideIndex(idx);
    setSecondsElapsed(idx * SLIDE_DURATION);
  };

  const handleFinishAndSave = () => {
    completePresentation(team.id, stage.id, {
      innovation: innovationScore,
      technical: technicalScore,
      feasibility: feasibilityScore,
      presentation: presentationScore,
      judgeNotes
    });

    // Check next team
    const nextSlot = schedules
      .filter((s) => s.stageId === stage.id && s.status === 'SCHEDULED' && s.teamId !== team.id)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

    if (nextSlot && onNextTeam) {
      onNextTeam(nextSlot.teamId);
    } else {
      onClose();
    }
  };

  // Calculations
  const remainingSeconds = TOTAL_DURATION - secondsElapsed;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentSlideSecondsElapsed = secondsElapsed % SLIDE_DURATION;
  const currentSlideTimeRemaining = SLIDE_DURATION - currentSlideSecondsElapsed;

  // Slide data
  const slides = team.submission?.slides || [];
  const currentSlide = slides[currentSlideIndex] || {
    slideNumber: currentSlideIndex + 1,
    durationSeconds: 60,
    title: `0${currentSlideIndex + 1}. Pitch Section`,
    subtitle: `${team.name} · ${team.track}`,
    category: 'Architecture & Solution' as const,
    bulletPoints: [
      'Comprehensive system design aligned with Smart Hackathon 2026 guidelines.',
      'High-throughput real-time pipeline verified on stage testbed.',
      'Optimized memory footprint and high resilience.'
    ]
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#070b14] flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* 3, 2, 1 Countdown Sequence Overlay */}
      {isPreStart && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center text-white">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono text-sm tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>TIT Bhopal · Smart India Hackathon 2026 Internal Stage</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-300">
              Readying Presentation for <span className="text-white font-bold">{team.name}</span>
            </h1>

            <div className="inline-block px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-mono text-xs">
              SIH Problem Statement: {team.psId || 'SIH1609'} ({team.sihOrganization || 'Ministry of Education'})
            </div>

            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Stage: {stage.name} · Slot: {team.scheduledSlot?.startTime || '14:00'} · Strict 6-minute auto progression (60s/slide)
            </p>

            {/* Huge Number Countdown */}
            <div className="py-8">
              <span className="text-8xl md:text-9xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-orange-200 to-orange-500 animate-pulse">
                {countdown > 0 ? countdown : 'START!'}
              </span>
            </div>

            <button
              onClick={() => {
                setIsPreStart(false);
                setIsRunning(true);
              }}
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              Skip Countdown &amp; Launch
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex items-center justify-between shrink-0">
        {/* Left: Team and Stage branding */}
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono text-xs font-bold">
            {team.id}
          </div>
          <div className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-700/60 text-blue-300 font-mono text-xs font-bold">
            PS: {team.psId || 'SIH1609'}
          </div>
          <div className="leading-tight">
            <h1 className="font-bold text-white text-sm md:text-base flex items-center gap-2">
              {team.name}
              <span className="text-xs text-slate-400 font-normal hidden sm:inline">({team.college})</span>
            </h1>
            <p className="text-xs text-slate-400">
              {stage.name} · {team.track} · {team.sihOrganization || 'AICTE / MoE'}
            </p>
          </div>
        </div>

        {/* Center: Big 6-Minute Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
            <Clock className={`w-4 h-4 ${remainingSeconds <= 30 ? 'text-rose-400 animate-spin' : remainingSeconds <= 60 ? 'text-amber-400 animate-pulse' : 'text-orange-400'}`} />
            <span className={`text-2xl md:text-3xl font-mono font-bold tabular-nums tracking-tight ${remainingSeconds <= 30 ? 'text-rose-400' : remainingSeconds <= 60 ? 'text-amber-400' : 'text-white'}`}>
              {timeFormatted}
            </span>
            <span className="text-[11px] font-mono text-slate-500">/ 06:00</span>
          </div>

          {!isRunning && !isCompleted && !isPreStart && (
            <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium animate-pulse">
              PAUSED
            </div>
          )}
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled((s) => !s)}
            title={soundEnabled ? 'Mute Chimes' : 'Unmute Chimes'}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors hidden sm:flex"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to end the presentation early?')) {
                setIsRunning(false);
                setIsCompleted(true);
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition-colors"
          >
            End Pitch
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Slide Content Canvas */}
      <main className="flex-1 overflow-hidden relative flex items-center justify-center">
        <PresentationRenderer
          slide={currentSlide}
          team={team}
          slideTimeRemaining={currentSlideTimeRemaining}
        />
      </main>

      {/* Bottom Sticky Control Strip */}
      <footer className="px-6 py-3 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex flex-col gap-2 shrink-0">
        {/* Full 6-Minute Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
          <div
            className={`h-full transition-all duration-1000 ${
              remainingSeconds <= 30
                ? 'bg-rose-500'
                : remainingSeconds <= 60
                ? 'bg-amber-400'
                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500'
            }`}
            style={{ width: `${(secondsElapsed / TOTAL_DURATION) * 100}%` }}
          />
          {/* Slide partition markers at 1m, 2m, 3m, 4m, 5m */}
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className="absolute top-0 bottom-0 w-0.5 bg-slate-950"
              style={{ left: `${(s / 6) * 100}%` }}
            />
          ))}
        </div>

        {/* Action Controls & Slide Selectors */}
        <div className="flex items-center justify-between">
          {/* Slide Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const active = idx === currentSlideIndex;
              const completed = idx < currentSlideIndex;
              return (
                <button
                  key={idx}
                  onClick={() => jumpToSlide(idx)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-orange-500 text-white font-bold shadow-sm'
                      : completed
                      ? 'bg-slate-900 border border-slate-700/80 text-orange-300'
                      : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span>0{idx + 1}</span>
                  <span className="hidden md:inline font-sans text-[11px] opacity-80">
                    {idx === 0
                      ? 'Problem'
                      : idx === 1
                      ? 'Architecture'
                      : idx === 2
                      ? 'Innovation'
                      : idx === 3
                      ? 'Demo'
                      : idx === 4
                      ? 'Impact'
                      : 'Roadmap'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Center Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const prev = Math.max(currentSlideIndex - 1, 0);
                jumpToSlide(prev);
              }}
              disabled={currentSlideIndex === 0}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Previous Slide (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsRunning((r) => !r)}
              className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Pause / Resume (Space)"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isRunning ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={() => {
                const next = Math.min(currentSlideIndex + 1, TOTAL_SLIDES - 1);
                jumpToSlide(next);
              }}
              disabled={currentSlideIndex === TOTAL_SLIDES - 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next Slide (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSecondsElapsed(0);
                setCurrentSlideIndex(0);
                setIsCompleted(false);
                setIsRunning(true);
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Restart (R)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span>Space: Pause</span>
            <span>·</span>
            <span>←/→: Slides</span>
            <span>·</span>
            <span>R: Restart</span>
            <span>·</span>
            <span>Esc: Exit</span>
          </div>
        </div>
      </footer>

      {/* Presentation Completed Modal */}
      {isCompleted && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Presentation Completed!</h2>
              <p className="text-slate-400 text-sm">
                Team <span className="text-cyan-300 font-semibold">{team.name} ({team.id})</span> has successfully completed their 6-minute pitch on {stage.name}.
              </p>
            </div>

            {/* Judging Evaluation Sliders */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5 font-mono text-cyan-400">
                  <Award className="w-4 h-4" />
                  EVALUATION RUBRIC (OUT OF 100)
                </span>
                <span className="font-mono text-base font-bold text-white tabular-nums">
                  {innovationScore + technicalScore + feasibilityScore + presentationScore}/100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Innovation (25)</span>
                    <span className="font-mono text-cyan-300">{innovationScore}</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="25"
                    value={innovationScore}
                    onChange={(e) => setInnovationScore(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Technical Rigor (25)</span>
                    <span className="font-mono text-cyan-300">{technicalScore}</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="25"
                    value={technicalScore}
                    onChange={(e) => setTechnicalScore(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Feasibility &amp; ROI (25)</span>
                    <span className="font-mono text-orange-400 font-bold">{feasibilityScore}</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="25"
                    value={feasibilityScore}
                    onChange={(e) => setFeasibilityScore(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Presentation &amp; Demo (25)</span>
                    <span className="font-mono text-orange-400 font-bold">{presentationScore}</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="25"
                    value={presentationScore}
                    onChange={(e) => setPresentationScore(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-mono">Judge Feedback Notes</label>
                <input
                  type="text"
                  value={judgeNotes}
                  onChange={(e) => setJudgeNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleFinishAndSave}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                <span>Save Evaluation &amp; Advance Next Team</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                Exit to Stage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
