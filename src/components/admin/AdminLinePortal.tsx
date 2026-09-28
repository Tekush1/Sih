import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Team } from '../../types';
import { SIHProblemModal } from '../sih/SIHProblemModal';
import { CSVUploadModal } from './CSVUploadModal';
import { OfflineDeckBatchModal } from './OfflineDeckBatchModal';
import { AdminLineBanner } from './AdminLineBanner';
import { AdminLineBroadcastControl } from './AdminLineBroadcastControl';
import { AdminLineQueueTable } from './AdminLineQueueTable';
import { AdminInsertTeamModal } from './AdminInsertTeamModal';
import { AdminEditSlideModal } from './AdminEditSlideModal';

interface AdminLinePortalProps {
  onSwitchToScreen: () => void;
}

export const AdminLinePortal: React.FC<AdminLinePortalProps> = ({ onSwitchToScreen }) => {
  const { 
    screenState, 
    queueTeams, 
    teams, 
    sendTeamToScreen, 
    startScreenTimer, 
    pauseScreenTimer, 
    resetScreenTimer, 
    adjustScreenTimer, 
    setScreenSlideIndex, 
    nextScreenSlide, 
    prevScreenSlide, 
    insertTeamIntoQueue, 
    reorderPresentationQueue, 
    removeTeamFromQueue,
    updateTeamSlideData,
    clearAllTeams
  } = useHackathon();

  const [showInsertModal, setShowInsertModal] = useState<boolean>(false);
  const [showSIHModal, setShowSIHModal] = useState<boolean>(false);
  const [showCSVModal, setShowCSVModal] = useState<boolean>(false);
  const [showOfflineBatchModal, setShowOfflineBatchModal] = useState<boolean>(false);

  const [newPSId, setNewPSId] = useState<string>('SIH1601');
  const [newProblemStatement, setNewProblemStatement] = useState<string>('');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const currentScreenTeam = teams.find((t) => t.id === screenState.teamId) || teams[0];
  const slides = currentScreenTeam?.submission?.slides || [];
  const currentSlide = slides[screenState.slideIndex] || slides[0];

  const slideDurations = screenState.slideDurations?.length === 6
    ? screenState.slideDurations
    : [10, 60, 60, 40, 40, 20];

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const openProjectorPopup = () => {
    const url = `${window.location.origin}${window.location.pathname}?tab=screen`;
    window.open(url, 'ProjectorScreen', 'width=1280,height=720,menubar=no,toolbar=no');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <SIHProblemModal
        isOpen={showSIHModal}
        onClose={() => setShowSIHModal(false)}
        onSelect={(ps) => {
          setNewPSId(ps.id);
          setNewProblemStatement(ps.title);
          setShowSIHModal(false);
        }}
        initialSelectedId={newPSId}
      />

      <CSVUploadModal isOpen={showCSVModal} onClose={() => setShowCSVModal(false)} />
      <OfflineDeckBatchModal isOpen={showOfflineBatchModal} onClose={() => setShowOfflineBatchModal(false)} />

      {/* Top Banner & Action Controls */}
      <AdminLineBanner
        onOpenCSV={() => setShowCSVModal(true)}
        onOpenOfflineDecks={() => setShowOfflineBatchModal(true)}
        onOpenInsert={() => setShowInsertModal(true)}
        onClearData={() => {
          if (window.confirm('Purge all squads and reset to a clean lineup for CSV insertion?')) {
            clearAllTeams();
          }
        }}
        onOpenPopup={openProjectorPopup}
        onSwitchToScreen={onSwitchToScreen}
      />

      {/* Broadcast Controller */}
      <AdminLineBroadcastControl
        currentScreenTeam={currentScreenTeam}
        screenState={screenState}
        slideDurations={slideDurations}
        currentSlide={currentSlide}
        slidesCount={slides.length}
        formatTime={formatTime}
        startScreenTimer={startScreenTimer}
        pauseScreenTimer={pauseScreenTimer}
        resetScreenTimer={resetScreenTimer}
        adjustScreenTimer={adjustScreenTimer}
        setScreenSlideIndex={setScreenSlideIndex}
        prevScreenSlide={prevScreenSlide}
        nextScreenSlide={nextScreenSlide}
      />

      {/* Queue Table */}
      <AdminLineQueueTable
        queueTeams={queueTeams}
        screenStateTeamId={screenState.teamId}
        onSendToScreen={(teamId) => sendTeamToScreen(teamId, 6)}
        onReorder={(teamId, dir) => reorderPresentationQueue(teamId, dir)}
        onRemove={(teamId) => removeTeamFromQueue(teamId)}
        onEditSlide={(team) => setEditingTeam(team)}
      />

      <AdminInsertTeamModal
        isOpen={showInsertModal}
        onClose={() => setShowInsertModal(false)}
        onOpenSIHModal={() => setShowSIHModal(true)}
        onInsert={(data) => {
          insertTeamIntoQueue({
            name: data.name,
            college: data.college,
            psId: data.psId,
            problemStatement: data.problemStatement,
            track: data.track,
            googleDriveFolder: data.googleDriveFolder,
            members: []
          }, {
            position: data.position,
            sendImmediately: data.sendImmediately
          });
        }}
        newPSId={newPSId}
        newProblemStatement={newProblemStatement}
      />

      <AdminEditSlideModal
        editingTeam={editingTeam}
        onClose={() => setEditingTeam(null)}
        onSaveSlide={(teamId, slideIdx, data) => updateTeamSlideData(teamId, slideIdx, data)}
      />
    </div>
  );
};
