import React from 'react';
import { Team } from '../../types';
import { UploadCloud, Folder, FileText, ExternalLink, Eye } from 'lucide-react';

interface TeamPPTUploadCardProps {
  currentTeam: Team;
  isUploading: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPreviewSlides: () => void;
}

export const TeamPPTUploadCard: React.FC<TeamPPTUploadCardProps> = ({
  currentTeam,
  isUploading,
  handleFileUpload,
  onPreviewSlides
}) => {
  const isApproved = currentTeam.submission?.status === 'APPROVED';

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-orange-600" />
            <span>PPTX / PDF Presentation Submission</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated parsing into 6-slide engine. Uploads into team Google Drive folder.
          </p>
        </div>
        {currentTeam.submission && (
          <span className="px-2.5 py-1 rounded bg-orange-100 border border-orange-200 text-orange-800 font-mono text-xs font-bold">
            {currentTeam.submission.version}
          </span>
        )}
      </div>

      <div className="relative border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-2xl p-8 text-center bg-[#faf7f2] transition-colors group">
        <input
          type="file"
          accept=".pptx,.pdf"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="space-y-3 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 mx-auto">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {isUploading ? 'Uploading to Drive & Processing...' : 'Drop your .PPTX or .PDF file here, or browse'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Maximum size: 25MB · Exactly 6 slides allowed</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#faf7f2] border border-amber-100 space-y-3 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="text-slate-700 font-bold flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-orange-600" />
            <span>GOOGLE DRIVE FOLDER</span>
          </span>
          <span className="text-emerald-700 font-bold">SECURE</span>
        </div>
        <div className="text-slate-800 font-semibold truncate">{currentTeam.googleDriveFolder}</div>
        <div className="pt-2 border-t border-amber-200/60 flex justify-between items-center text-[11px]">
          <span className="text-slate-500">Cloud Directory</span>
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

      {currentTeam.submission && (
        <div className="p-4 rounded-2xl bg-[#faf7f2] border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-900 font-bold flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-orange-600" />
              <span>{currentTeam.submission.fileName}</span>
            </span>
            <span className="text-slate-500">{currentTeam.submission.fileSize}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
              isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
            }`}>
              Status: {currentTeam.submission.status}
            </span>

            <button
              onClick={onPreviewSlides}
              className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 font-mono font-bold cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview 6 Slides</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
