import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { 
  Folder, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  QrCode, 
  ExternalLink, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  LogIn,
  Eye,
  RefreshCw,
  Globe,
  Building2
} from 'lucide-react';
import { QRPassModal } from '../qr/QRPassModal';
import { PresentationRenderer } from '../presentation/PresentationRenderer';
import { SIHProblemModal } from '../sih/SIHProblemModal';

export const TeamPortal: React.FC = () => {
  const { 
    teams, 
    activeTeamId, 
    setActiveTeamId, 
    uploadPPT, 
    stages 
  } = useHackathon();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [showSIHDetailsModal, setShowSIHDetailsModal] = useState<boolean>(false);
  const [previewSlideIdx, setPreviewSlideIdx] = useState<number>(0);
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
      setUploadSuccess(`Uploaded ${file.name} successfully to team Google Drive folder. Transformed into 6-minute engine slides.`);
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const isApproved = currentTeam.submission?.status === 'APPROVED';
  const isUnderReview = currentTeam.submission?.status === 'UNDER_REVIEW';

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* SIH Modal */}
      <SIHProblemModal
        isOpen={showSIHDetailsModal}
        onClose={() => setShowSIHDetailsModal(false)}
        initialSelectedId={currentTeam.psId || 'SIH1609'}
      />

      {/* Top Banner & Quick Team Switcher */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>TECHNOCRATS INSTITUTE OF TECHNOLOGY · TEAM PORTAL</span>
            <span className="text-orange-300">·</span>
            <span className="text-[#b47e3a]">SIH 2026 INTERNAL</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>{currentTeam.name}</span>
            <span className="text-orange-600 font-mono text-lg font-bold">({currentTeam.id})</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 font-mono font-bold">
              PS: {currentTeam.psId || 'SIH1609'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTeam.college}</span>
            <span>·</span>
            <span className="text-orange-700 font-bold">{currentTeam.track}</span>
          </p>
        </div>

        {/* Demo Fast Team Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-mono font-bold text-slate-500">Switch TIT Squad:</label>
          <select
            value={currentTeam.id}
            onChange={(e) => setActiveTeamId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs font-mono font-bold text-orange-700 focus:outline-none focus:border-orange-500 shadow-2xs"
          >
            {teams.slice(0, 20).map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} - {t.name} [{t.psId || 'SIH'}] ({t.submission?.status || 'NOT_SUBMITTED'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
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

      {/* SIH Problem Statement Focus Banner */}
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
            Ministry / Dept: <span className="text-orange-700 font-bold">{currentTeam.sihOrganization || 'Ministry of Education / AICTE'}</span>
          </p>
        </div>

        <button
          onClick={() => setShowSIHDetailsModal(true)}
          className="px-4 py-2 rounded-xl bg-white hover:bg-orange-100 text-orange-700 border border-orange-300 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 self-start md:self-auto cursor-pointer shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View SIH Guidelines</span>
        </button>
      </div>

      {/* Grid: Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Verification Status */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">INTERNAL NOMINATION</span>
          <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span>TIT VERIFIED</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">Form ID: {currentTeam.googleFormSubmissionId}</p>
        </div>

        {/* Assigned Stage */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">STAGE ARENA</span>
          <div className="text-slate-900 font-extrabold text-lg flex items-center gap-2">
            <span>{assignedStage?.name || 'Stage Alpha'}</span>
          </div>
          <p className="text-[11px] text-orange-700 font-medium">{assignedStage?.location || 'Auditorium Hall A · TIT Campus'}</p>
        </div>

        {/* Scheduled Presentation Time */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">PRESENTATION WINDOW</span>
          <div className="text-[#b47e3a] font-mono font-extrabold text-lg flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{currentTeam.scheduledSlot?.startTime || '14:00'} - {currentTeam.scheduledSlot?.endTime || '14:06'}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">Strict 6:00 min stage cadence</p>
        </div>

        {/* PPT Approval Status */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">PPT STATUS</span>
          <div className="font-extrabold text-lg">
            {isApproved ? (
              <span className="text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> APPROVED
              </span>
            ) : isUnderReview ? (
              <span className="text-orange-600 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> UNDER REVIEW
              </span>
            ) : (
              <span className="text-slate-400">PENDING UPLOAD</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            {currentTeam.submission ? `Version: ${currentTeam.submission.version}` : 'No submission yet'}
          </p>
        </div>
      </div>

      {/* Main Section: PPT Submission & QR Pass */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: PPT Upload & Google Drive info */}
        <div className="lg:col-span-7 space-y-6">
          {/* PPT Upload Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-orange-600" />
                  <span>PPTX / PDF Presentation Submission</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated parsing into 6-slide engine. Uploads directly into your secure TIT Google Drive vault.
                </p>
              </div>

              {currentTeam.submission && (
                <span className="px-2.5 py-1 rounded bg-orange-100 border border-orange-200 text-orange-800 font-mono text-xs font-bold">
                  {currentTeam.submission.version}
                </span>
              )}
            </div>

            {/* Drop Zone */}
            <div className="relative border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-2xl p-8 text-center bg-[#faf7f2] transition-colors group">
              <input
                type="file"
                accept=".pptx,.pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 mx-auto group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {isUploading ? 'Uploading to Drive & Converting Slides...' : 'Drop your .PPTX or .PDF file here, or browse'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Maximum size: 25MB · Standard 6 slides mapped to SIH rubric
                  </p>
                </div>
              </div>
            </div>

            {/* Google Drive Folder Sync Card */}
            <div className="p-4 rounded-2xl bg-[#faf7f2] border border-amber-100 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <Folder className="w-4 h-4 text-orange-600" />
                  <span>TIT GOOGLE DRIVE TEAM VAULT</span>
                </span>
                <span className="text-emerald-700 font-bold">SERVER-SIDE SECURE</span>
              </div>
              <div className="text-slate-800 font-semibold truncate">
                {currentTeam.googleDriveFolder}
              </div>
              <div className="pt-2 border-t border-amber-200/60 flex justify-between items-center text-[11px]">
                <span className="text-slate-500">TIT Campus Cloud Directory</span>
                <a
                  href={currentTeam.googleDriveFolder}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-600 hover:text-orange-700 flex items-center gap-1 underline font-bold"
                >
                  <span>Open in Google Drive</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Current Submission Record Details */}
            {currentTeam.submission && (
              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-900 font-bold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span>{currentTeam.submission.fileName}</span>
                  </span>
                  <span className="text-slate-500">
                    {currentTeam.submission.fileSize}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px] font-bold">ADMIN JURY STATUS:</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-orange-100 text-orange-800 border border-orange-300'
                    }`}>
                      {currentTeam.submission.status}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowSlidePreviewModal(true)}
                    className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 font-mono font-bold cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview 6 Slides</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Digital QR Presentation Pass */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-orange-600" />
                <span>Digital QR Stage Pass</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-orange-800 px-2 py-0.5 rounded bg-orange-100 border border-orange-200">
                STAGE READY
              </span>
            </div>

            {isApproved ? (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  ✓ PPT Approved by TIT Reviewers. Your QR Presentation Pass is active.
                </div>

                <div className="p-6 rounded-2xl bg-[#faf7f2] border border-slate-200 text-center space-y-4">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-md border border-slate-200">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        currentTeam.qrPass?.token || `QR-${currentTeam.id}`
                      )}`} 
                      alt="Digital QR Pass" 
                      className="w-full h-full"
                    />
                  </div>

                  <div className="font-mono text-xs space-y-1">
                    <div className="text-orange-700 font-extrabold">{currentTeam.id}</div>
                    <div className="text-slate-600">{assignedStage?.name || 'Stage Alpha'} (TIT Campus)</div>
                    <div className="text-[#b47e3a] font-bold">{currentTeam.scheduledSlot?.startTime || '14:00'}</div>
                  </div>

                  <button
                    onClick={() => setShowQRModal(true)}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Full Presentation Pass</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-[#faf7f2] border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">QR Pass Locked</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your Digital Stage Pass will unlock automatically once the TIT Faculty Evaluation Committee reviews and approves your uploaded presentation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Pass Modal */}
      {showQRModal && (
        <QRPassModal
          team={currentTeam}
          stage={assignedStage}
          onClose={() => setShowQRModal(false)}
        />
      )}

      {/* Slide Preview Modal */}
      {showSlidePreviewModal && currentTeam.submission && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Transformed 6-Minute Presentation Deck</span>
                <span className="text-xs font-mono text-orange-600 font-bold">
                  (Slide {previewSlideIdx + 1} of 6)
                </span>
              </h3>
              <button
                onClick={() => setShowSlidePreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <PresentationRenderer
                slide={currentTeam.submission.slides[previewSlideIdx] || {
                  id: `slide-preview-${previewSlideIdx}`,
                  slideNumber: previewSlideIdx + 1,
                  category: 'Problem Statement & Context',
                  title: 'Problem Statement & Context',
                  subtitle: currentTeam.problemStatement,
                  bulletPoints: ['Quantified operational bottlenecks', 'Stakeholder impact and pain points']
                }}
                team={currentTeam}
                slideTimeRemaining={60}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setPreviewSlideIdx(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      previewSlideIdx === idx
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowSlidePreviewModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-800 hover:bg-slate-200 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
