import React, { useState, useRef } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { X, HardDrive, UploadCloud, CheckCircle2 } from 'lucide-react';
import { matchAndSaveOfflineDecks } from '../../utils/localDeckBatchMatcher';

interface OfflineDeckBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineDeckBatchModal: React.FC<OfflineDeckBatchModalProps> = ({
  isOpen,
  onClose
}) => {
  const { teams } = useHackathon();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<{
    matchedCount: number;
    matchedTeams: { teamId: string; fileName: string }[];
  } | null>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      const fileArr = Array.from(files);
      const res = await matchAndSaveOfflineDecks(fileArr, teams);
      setMatchResult(res);
    } catch (err) {
      console.error(err);
      alert('Error saving offline presentation files.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-800">
        <div className="p-5 border-b border-slate-200 bg-[#faf7f2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white font-mono text-[10px] font-black uppercase">
                Zero Internet Serving
              </span>
              <h3 className="font-black text-slate-900 text-lg">Batch Import Offline PPT/PDF Files</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Select or drag all team presentation files (.pdf / .pptx). The app will automatically match files to teams based on Team ID (e.g. <code>SH26-001.pdf</code>) or Team Name, and store them locally on this machine for offline presentation.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.pptx,application/pdf"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            className="p-8 border-2 border-dashed border-emerald-500/60 rounded-2xl text-center cursor-pointer bg-emerald-50/30 hover:bg-emerald-50/60 transition-all space-y-2"
          >
            <UploadCloud className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-slate-900">
              {isProcessing ? 'Processing & Storing in Local Storage...' : 'Click to select multiple PDF files, or drop folder here'}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Files are saved to browser local database · No internet needed
            </p>
          </div>

          {matchResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Successfully stored {matchResult.matchedCount} offline decks locally!</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 font-mono text-[11px]">
                {matchResult.matchedTeams.map((m, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span className="font-bold text-orange-700">{m.teamId}</span>
                    <span className="truncate max-w-xs">{m.fileName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-[#faf7f2] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
