import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { SIHProblemModal } from '../sih/SIHProblemModal';
import { PresentationHeroSection } from './PresentationHeroSection';
import { PresentationStagesGrid } from './PresentationStagesGrid';
import { PresentationPitchBlueprint } from './PresentationPitchBlueprint';
import { PresentationDeckPreview } from './PresentationDeckPreview';
import { PresentationQuickFinder } from './PresentationQuickFinder';

interface PresentationHomeProps {
  onNavigate: (tab: string) => void;
  onLaunchPresentation: (teamId: string, stageId: string) => void;
}

export const PresentationHome: React.FC<PresentationHomeProps> = ({
  onNavigate,
  onLaunchPresentation
}) => {
  const { teams, stages, schedules } = useHackathon();
  const [showSIHModal, setShowSIHModal] = useState<boolean>(false);
  const [searchPSId, setSearchPSId] = useState<string>('');
  const [selectedPreviewTeamId, setSelectedPreviewTeamId] = useState<string>(teams[0]?.id || 'SH26-001');

  const previewTeam = teams.find((t) => t.id === selectedPreviewTeamId) || teams[0];

  const handleSelectPreview = (teamId: string) => {
    setSelectedPreviewTeamId(teamId);
    window.scrollTo({ top: 900, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* SIH Lookup Modal */}
      <SIHProblemModal
        isOpen={showSIHModal}
        onClose={() => setShowSIHModal(false)}
        initialSelectedId="SIH1601"
      />

      {/* Hero Section */}
      <PresentationHeroSection
        onLaunchPresentation={onLaunchPresentation}
        onNavigate={onNavigate}
        onOpenSIHModal={() => setShowSIHModal(true)}
      />

      {/* Live Stage Arenas & Queues */}
      <PresentationStagesGrid
        stages={stages}
        teams={teams}
        schedules={schedules}
        onNavigate={onNavigate}
        onLaunchPresentation={onLaunchPresentation}
      />

      {/* Standardized 6-Minute Blueprint */}
      <PresentationPitchBlueprint />

      {/* Original Presentation Deck Preview */}
      <PresentationDeckPreview
        teams={teams}
        previewTeam={previewTeam}
        selectedPreviewTeamId={selectedPreviewTeamId}
        setSelectedPreviewTeamId={setSelectedPreviewTeamId}
        onLaunchPresentation={onLaunchPresentation}
        onNavigate={onNavigate}
      />

      {/* Quick Pitch Finder by SIH PS ID */}
      <PresentationQuickFinder
        teams={teams}
        searchPSId={searchPSId}
        setSearchPSId={setSearchPSId}
        onLaunchPresentation={onLaunchPresentation}
        onSelectPreview={handleSelectPreview}
        onNavigate={onNavigate}
      />
    </div>
  );
};
