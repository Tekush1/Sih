import React from 'react';
import { Team } from '../../types';
import { Sparkles, Play } from 'lucide-react';
import { GoogleDriveDeckViewer } from './GoogleDriveDeckViewer';

interface PresentationDeckPreviewProps {
  teams: Team[];
  previewTeam?: Team;
  selectedPreviewTeamId: string;
  setSelectedPreviewTeamId: (id: string) => void;
  onLaunchPresentation: (teamId: string, stageId: string) => void;
  onNavigate: (tab: string) => void;
}

export const PresentationDeckPreview: React.FC<PresentationDeckPreviewProps> = ({
  teams,
  previewTeam,
  selectedPreviewTeamId,
  setSelectedPreviewTeamId,
  onLaunchPresentation,
  onNavigate
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
        {previewTeam ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ORIGINAL GOOGLE DRIVE DECK PREVIEW</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Preview Squad Pitch Deck: {previewTeam.name} ({previewTeam.id})
                </h3>
                <p className="text-xs text-slate-500">
                  Leader: <strong className="text-slate-800">{previewTeam.leaderName}</strong> · PS: <strong className="text-orange-700 font-mono">{previewTeam.psId || 'SIH1609'}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedPreviewTeamId}
                  onChange={(e) => setSelectedPreviewTeamId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs font-mono font-bold text-orange-700 focus:outline-none"
                >
                  {teams.slice(0, 20).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} - {t.name} [{t.psId || 'SIH'}]
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => onLaunchPresentation(previewTeam.id, previewTeam.stageId || 'stage-alpha')}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Present Fullscreen</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 sm:p-4">
              <GoogleDriveDeckViewer
                driveUrl={previewTeam.googleDriveFolder || previewTeam.submission?.googleDriveFileUrl}
                teamName={previewTeam.name}
                teamId={previewTeam.id}
                track={previewTeam.track}
              />
            </div>
          </>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-black text-slate-900">No Squads in Lineup Yet</h3>
              <p className="text-xs text-slate-500">
                Insert your CSV file or form entries containing Team Name, Leader, and Google Drive links.
              </p>
            </div>
            <button
              onClick={() => onNavigate('admin')}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Go to Admin Line &amp; Insert CSV</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
