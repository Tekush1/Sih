import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { CSVUploadModal } from './CSVUploadModal';
import { AdminLineBanner } from './AdminLineBanner';
import { AdminLineBroadcastControl } from './AdminLineBroadcastControl';
import { AdminLineQueueTable } from './AdminLineQueueTable';
import { AdminInsertTeamModal } from './AdminInsertTeamModal';

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
    insertTeamIntoQueue, 
    reorderPresentationQueue, 
    removeTeamFromQueue,
    clearAllTeams
  } = useHackathon();

  const [showInsertModal, setShowInsertModal] = useState<boolean>(false);
  const [showCSVModal, setShowCSVModal] = useState<boolean>(false);

  const currentScreenTeam = teams.find((t) => t.id === screenState.teamId) || queueTeams[0] || teams[0];
  const currentStandingIndex = queueTeams.findIndex((t) => t.id === (currentScreenTeam?.id));
  const currentStandingNumber = currentStandingIndex !== -1 ? currentStandingIndex + 1 : undefined;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const openProjectorPopup = () => {
    const url = `${window.location.origin}${window.location.pathname}?portal=screen`;
    window.open(url, 'AuditoriumScreen', 'width=1280,height=720,menubar=no,toolbar=no');
  };

  const handleNextTeam = () => {
    if (queueTeams.length === 0) return;
    if (currentStandingIndex !== -1 && currentStandingIndex < queueTeams.length - 1) {
      sendTeamToScreen(queueTeams[currentStandingIndex + 1].id, 6);
    } else {
      sendTeamToScreen(queueTeams[0].id, 6);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Banner with Insert CSV & Pop Screen */}
      <AdminLineBanner
        onOpenCSV={() => setShowCSVModal(true)}
        onOpenInsert={() => setShowInsertModal(true)}
        onClearData={() => {
          if (window.confirm('Clear all squads and reset lineup?')) {
            clearAllTeams();
          }
        }}
        onOpenPopup={openProjectorPopup}
        onSwitchToScreen={onSwitchToScreen}
        totalTeamsCount={queueTeams.length}
      />

      {/* 2. Live on Auditorium Screen Controller (Clean & Simple) */}
      <AdminLineBroadcastControl
        currentScreenTeam={currentScreenTeam}
        currentStandingNumber={currentStandingNumber}
        screenState={screenState}
        formatTime={formatTime}
        startScreenTimer={startScreenTimer}
        pauseScreenTimer={pauseScreenTimer}
        resetScreenTimer={resetScreenTimer}
        onNextTeam={queueTeams.length > 1 ? handleNextTeam : undefined}
        onOpenPopup={openProjectorPopup}
      />

      {/* 3. Standings & Numbers Table */}
      <AdminLineQueueTable
        queueTeams={queueTeams}
        screenStateTeamId={screenState.teamId}
        onSendToScreen={(teamId) => sendTeamToScreen(teamId, 6)}
        onReorder={(teamId, dir) => reorderPresentationQueue(teamId, dir)}
        onRemove={(teamId) => removeTeamFromQueue(teamId)}
        onOpenCSV={() => setShowCSVModal(true)}
      />

      {/* CSV Import Modal (Primary squad insertion tool) */}
      <CSVUploadModal isOpen={showCSVModal} onClose={() => setShowCSVModal(false)} />

      {/* Optional Manual Squad Insert Modal */}
      <AdminInsertTeamModal
        isOpen={showInsertModal}
        onClose={() => setShowInsertModal(false)}
        onOpenSIHModal={() => {}}
        onInsert={(data) => {
          insertTeamIntoQueue({
            name: data.name,
            college: data.college,
            psId: data.psId,
            problemStatement: data.problemStatement,
            track: data.track,
            googleDriveFolder: data.googleDriveFolder,
            localFile: data.localFile,
            members: []
          }, {
            position: data.position,
            sendImmediately: data.sendImmediately
          });
        }}
        newPSId="SIH1601"
        newProblemStatement="Smart India Hackathon 2026 Project"
      />
    </div>
  );
};
