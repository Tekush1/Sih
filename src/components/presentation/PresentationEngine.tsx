import React, { useState, useEffect, useRef } from 'react';
import { Team, Stage } from '../../types';
import { GoogleDriveDeckViewer } from './GoogleDriveDeckViewer';
import { PresentationEngineHeader } from './PresentationEngineHeader';
import { useHackathon } from '../../context/HackathonContext';

interface PresentationEngineProps {
  team: Team;
  stage: Stage;
  onClose: () => void;
  onNextTeam?: (nextTeamId: string) => void;
}

export const PresentationEngine: React.FC<PresentationEngineProps> = ({
  team,
  onClose
}) => {
  const { updateTeamDriveUrl } = useHackathon();
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simple Presentation Timer (counts up)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Keyboard shortcut: Escape exits
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const driveUrl = team.googleDriveFolder || team.submission?.googleDriveFileUrl || '';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#070b14] flex flex-col overflow-hidden select-none font-sans"
    >
      {/* Presentation Header: Leader name, Team name, PS ID, Problem Statement, Members */}
      <PresentationEngineHeader
        team={team}
        timeFormatted={timeFormatted}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        onClose={onClose}
      />

      {/* Main PPT Display: Google Drive / PDF Embed */}
      <main className="flex-1 overflow-hidden relative flex flex-col p-2 sm:p-4 bg-slate-950">
        <GoogleDriveDeckViewer
          driveUrl={driveUrl}
          teamName={team.name}
          teamId={team.id}
          track={team.track}
          onUpdateDriveUrl={(newUrl) => updateTeamDriveUrl(team.id, newUrl)}
        />
      </main>
    </div>
  );
};
