import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Team } from '../../types';
import { QRScannerModal } from '../qr/QRScannerModal';
import { PresentationEngine } from '../presentation/PresentationEngine';
import { StageHeaderSelector } from './StageHeaderSelector';
import { StagePresentingPod } from './StagePresentingPod';
import { StageNextUpCard } from './StageNextUpCard';
import { StageQueueList } from './StageQueueList';

export const StagePortal: React.FC = () => {
  const { 
    stages, 
    activeStageId, 
    setActiveStageId, 
    schedules, 
    teams, 
    startPresentation 
  } = useHackathon();

  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [activePresentationTeam, setActivePresentationTeam] = useState<Team | null>(null);

  const currentStage = stages.find((s) => s.id === activeStageId) || stages[0];

  const stageSlots = schedules
    .filter((s) => s.stageId === currentStage.id)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const inProgressSlot = stageSlots.find((s) => s.status === 'IN_PROGRESS');
  const presentingTeam = inProgressSlot
    ? teams.find((t) => t.id === inProgressSlot.teamId)
    : currentStage.currentTeamId
    ? teams.find((t) => t.id === currentStage.currentTeamId)
    : undefined;

  const upcomingSlots = stageSlots.filter(
    (s) => s.status === 'SCHEDULED' && (!presentingTeam || s.teamId !== presentingTeam.id)
  );
  const nextSlot = upcomingSlots[0];
  const nextTeam = nextSlot ? teams.find((t) => t.id === nextSlot.teamId) : undefined;

  const handleLaunchTeam = (team: Team) => {
    setShowScanner(false);
    startPresentation(team.id, currentStage.id);
    setActivePresentationTeam(team);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <StageHeaderSelector
        stages={stages}
        currentStage={currentStage}
        activeStageId={activeStageId}
        setActiveStageId={setActiveStageId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <StagePresentingPod
          presentingTeam={presentingTeam}
          onLaunchTeam={handleLaunchTeam}
          onOpenScanner={() => setShowScanner(true)}
        />

        <StageNextUpCard
          nextTeam={nextTeam}
          nextSlot={nextSlot}
          onOpenScanner={() => setShowScanner(true)}
        />
      </div>

      <StageQueueList
        stageName={currentStage.name}
        stageSlots={stageSlots}
        teams={teams}
        onLaunchTeam={handleLaunchTeam}
      />

      {showScanner && (
        <QRScannerModal
          stage={currentStage}
          onClose={() => setShowScanner(false)}
          onLaunchPresentation={handleLaunchTeam}
        />
      )}

      {activePresentationTeam && (
        <PresentationEngine
          team={activePresentationTeam}
          stage={currentStage}
          onClose={() => setActivePresentationTeam(null)}
          onNextTeam={(nextTeamId) => {
            const next = teams.find((t) => t.id === nextTeamId);
            if (next) {
              startPresentation(next.id, currentStage.id);
              setActivePresentationTeam(next);
            } else {
              setActivePresentationTeam(null);
            }
          }}
        />
      )}
    </div>
  );
};
