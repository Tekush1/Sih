import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { CheckCircle2, AlertCircle, Globe, ExternalLink } from 'lucide-react';
import { QRPassModal } from '../qr/QRPassModal';
import { SIHProblemModal } from '../sih/SIHProblemModal';
import { TeamPortalHeader } from './TeamPortalHeader';
import { TeamOverviewStats } from './TeamOverviewStats';
import { TeamPPTUploadCard } from './TeamPPTUploadCard';
import { TeamQRPassCard } from './TeamQRPassCard';
import { TeamSlidePreviewModal } from './TeamSlidePreviewModal';

export const TeamPortal: React.FC = () => {
  const { teams, activeTeamId, setActiveTeamId, uploadPPT, stages } = useHackathon();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [showSIHDetailsModal, setShowSIHDetailsModal] = useState<boolean>(false);
  const [showSlidePreviewModal, setShowSlidePreviewModal] = useState<boolean>(false);

  const currentTeam = teams.find((t) => t.id === activeTeamId) || teams[0];
  const assignedStage = stages.find((s) => s.id === currentTeam.stageId);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      await uploadPPT(currentTeam.id, file);
      setUploadSuccess(`Uploaded ${file.name} successfully to team Google Drive folder.`);
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <SIHProblemModal
        isOpen={showSIHDetailsModal}
        onClose={() => setShowSIHDetailsModal(false)}
        initialSelectedId={currentTeam.psId || 'SIH1609'}
      />

      <TeamPortalHeader
        currentTeam={currentTeam}
        teams={teams}
        setActiveTeamId={setActiveTeamId}
      />

      {uploadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {uploadError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-mono font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* SIH Problem Statement Banner */}
      <div className="p-5 rounded-2xl bg-orange-50/80 border border-orange-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-700">
            <Globe className="w-3.5 h-3.5" />
            <span>SMART INDIA HACKATHON 2026 ALLOCATED PROBLEM STATEMENT</span>
          </div>
          <h4 className="text-base font-extrabold text-slate-900">
            [{currentTeam.psId || 'SIH1609'}] {currentTeam.problemStatement}
          </h4>
          <p className="text-xs text-slate-600">
            Organization: <span className="text-orange-700 font-bold">{currentTeam.sihOrganization || 'AICTE / MoE'}</span>
          </p>
        </div>

        <button
          onClick={() => setShowSIHDetailsModal(true)}
          className="px-4 py-2 rounded-xl bg-white hover:bg-orange-100 text-orange-700 border border-orange-300 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View SIH Guidelines</span>
        </button>
      </div>

      <TeamOverviewStats currentTeam={currentTeam} assignedStage={assignedStage} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <TeamPPTUploadCard
            currentTeam={currentTeam}
            isUploading={isUploading}
            handleFileUpload={handleFileUpload}
            onPreviewSlides={() => setShowSlidePreviewModal(true)}
          />
        </div>

        <div className="lg:col-span-5">
          <TeamQRPassCard
            currentTeam={currentTeam}
            assignedStage={assignedStage}
            onOpenQRModal={() => setShowQRModal(true)}
          />
        </div>
      </div>

      {showQRModal && (
        <QRPassModal
          team={currentTeam}
          stage={assignedStage}
          onClose={() => setShowQRModal(false)}
        />
      )}

      <TeamSlidePreviewModal
        currentTeam={currentTeam}
        isOpen={showSlidePreviewModal}
        onClose={() => setShowSlidePreviewModal(false)}
      />
    </div>
  );
};
