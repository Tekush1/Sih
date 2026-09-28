import React, { useEffect, useState, useRef } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { GoogleDriveDeckViewer } from '../presentation/GoogleDriveDeckViewer';
import { CSVUploadModal } from '../admin/CSVUploadModal';
import { ScreenPortalHeader } from './ScreenPortalHeader';
import { ScreenSlideCadenceStrip } from './ScreenSlideCadenceStrip';
import { ScreenPortalFooter } from './ScreenPortalFooter';
import { ScreenFinishedOverlay } from './ScreenFinishedOverlay';
import { FileSpreadsheet } from 'lucide-react';

interface ScreenPortalProps {
  onOpenAdmin?: () => void;
}

const SLIDE_LABELS = [
  { label: 'Problem & Root Cause', time: '10s' },
  { label: 'System Architecture', time: '1m' },
  { label: 'Core Innovation', time: '1m' },
  { label: 'Live Demo & Prototype', time: '40s' },
  { label: 'Feasibility & ROI', time: '40s' },
  { label: 'Roadmap & Conclusion', time: '20s' }
];

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

  const currentTeam = teams.find((t) => t.id === screenState.teamId) || teams[0];
  const slideDurations = screenState.slideDurations?.length === 6 ? screenState.slideDurations : [10, 60, 60, 40, 40, 20];
  const currentSlideDuration = slideDurations[screenState.slideIndex] || 60;
  const slideRemaining = screenState.slideRemainingSeconds !== undefined ? screenState.slideRemainingSeconds : currentSlideDuration;
  const totalRemaining = screenState.totalRemainingSeconds !== undefined ? screenState.totalRemainingSeconds : (screenState.remainingSeconds || 230);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (prevSlideIndexRef.current !== screenState.slideIndex) {
      prevSlideIndexRef.current = screenState.slideIndex;
    }
  }, [screenState.slideIndex]);

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
        if (screenState.isRunning) pauseScreenTimer();
        else startScreenTimer();
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

  const currentQueueIdx = queueTeams.findIndex((t) => t.id === screenState.teamId);
  const nextTeamInLine = currentQueueIdx !== -1 && currentQueueIdx < queueTeams.length - 1 ? queueTeams[currentQueueIdx + 1] : undefined;
  const isSlideEnding = slideRemaining <= 3;
  const slideProgressPercent = Math.max(0, Math.min(100, (slideRemaining / currentSlideDuration) * 100));

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[92vh] bg-[#070b14] text-white flex flex-col justify-between overflow-hidden select-none relative"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(249, 115, 22, 0.10) 0%, rgba(7, 11, 20, 1) 75%)'
      }}
    >
      <ScreenPortalHeader
        currentTeam={currentTeam}
        isSlideEnding={isSlideEnding}
        slideProgressPercent={slideProgressPercent}
        currentSlideIndex={screenState.slideIndex}
        currentSlideDuration={currentSlideDuration}
        formatTime={formatTime}
        slideRemaining={slideRemaining}
        totalRemaining={totalRemaining}
      />

      <ScreenSlideCadenceStrip
        currentSlideIndex={screenState.slideIndex}
        setScreenSlideIndex={setScreenSlideIndex}
        slideLabels={SLIDE_LABELS}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col justify-center relative z-10">
        {currentTeam ? (
          <div className="w-full flex-1 flex flex-col justify-between space-y-4">
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
          <div className="w-full h-full min-h-[460px] rounded-3xl bg-slate-950/90 border border-slate-800 flex flex-col items-center justify-center text-center p-8 space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <FileSpreadsheet className="w-10 h-10" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">No Squads in Lineup Yet</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Please insert your real CSV file containing Team Name, Leader, and Google Drive links.
              </p>
            </div>
            <button
              onClick={() => setShowCSVModal(true)}
              className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm"
            >
              Insert CSV File Now
            </button>
          </div>
        )}

        {screenState.isFinished && currentTeam && (
          <ScreenFinishedOverlay
            currentTeam={currentTeam}
            nextTeamInLine={nextTeamInLine}
            sendTeamToScreen={sendTeamToScreen}
          />
        )}
      </main>

      <ScreenPortalFooter
        onOpenAdmin={onOpenAdmin}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />

      <CSVUploadModal isOpen={showCSVModal} onClose={() => setShowCSVModal(false)} />
    </div>
  );
};
