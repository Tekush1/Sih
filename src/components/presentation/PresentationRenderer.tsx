import React from 'react';
import { SlideData, Team } from '../../types';
import { GoogleDriveDeckViewer } from './GoogleDriveDeckViewer';

interface PresentationRendererProps {
  slide?: SlideData;
  team: Team;
  slideTimeRemaining?: number;
}

/**
 * Renders the original Google Drive presentation deck for the squad.
 * Fake mock slides have been replaced by the live Google Drive iframe viewer.
 */
export const PresentationRenderer: React.FC<PresentationRendererProps> = ({ team }) => {
  const driveUrl = team.googleDriveFolder || team.submission?.googleDriveFileUrl;

  return (
    <div className="w-full h-full min-h-[440px] flex flex-col justify-center">
      <GoogleDriveDeckViewer
        driveUrl={driveUrl}
        teamName={team.name}
        teamId={team.id}
        track={team.track}
      />
    </div>
  );
};
