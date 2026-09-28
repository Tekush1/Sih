import React, { useState, useRef } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { X, HardDrive, UploadCloud, CheckCircle2, Play, Users } from 'lucide-react';

interface OfflineDeckBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToScreen?: () => void;
}

export const OfflineDeckBatchModal: React.FC<OfflineDeckBatchModalProps> = ({
  isOpen,
  onClose,
  onSwitchToScreen
}) => {
  const { batchImportOfflineDecks, sendTeamToScreen } = useHackathon();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<{
    matchedCount: number;
    matchedTeams: { teamId: string; teamName: string; fileName: string; isNew: boolean }[];
    newTeamsCount: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      const fileArr = Array.from(files);
      const res = await batchImportOfflineDecks(fileArr);
      setMatchResult({
        matchedCount: res.matchedCount,
        matchedTeams: res.matchedTeams,
        newTeamsCount: res.newTeams.length
      });
    } catch (err) {
      console.error(err);
      alert('Error saving offline presentation files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLaunchFirst = () => {
    if (matchResult && matchResult.matchedTeams.length > 0) {
      sendTeamToScreen(matchResult.matchedTeams[0].teamId, 6);
      onClose();
      if (onSwitchToScreen) {
        onSwitchToScreen();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-200 bg-[#faf7f2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white font-mono text-[10px] font-black uppercase">
                Zero Internet Presentation
              </span>
              <h3 className="font-black text-slate-900 text-lg">Local PPT / PDF Files (Offline)</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Select or drag team presentation files (<code>.pdf</code> or <code>.pptx</code>). Files are stored directly on this device for offline presentation without needing Google Drive. If existing teams match by ID or name, their decks are updated; otherwise new squads are automatically created!
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
            className="p-8 border-2 border-dashed border-emerald-500/60 rounded-2xl text-center cursor-pointer bg-emerald-50/30 hover:bg-emerald-50/60 transition-all space-y-2 group"
          >
            <UploadCloud className="w-10 h-10 text-emerald-600 mx-auto group-hover:scale-110 transition-transform" />
            <p className="text-sm font-bold text-slate-900">
              {isProcessing ? 'Saving & Storing in Device Memory...' : 'Click to select local PDF / PPTX files, or drag & drop here'}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Ready for immediate Projector Screen &amp; Stage presentation
            </p>
          </div>

          {matchResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-3">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Successfully stored {matchResult.matchedCount} local presentation decks!
                  {matchResult.newTeamsCount > 0 && ` (${matchResult.newTeamsCount} new squads added to lineup)`}
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1.5 font-mono text-[11px] bg-white/70 p-2.5 rounded-xl border border-emerald-200/60">
                {matchResult.matchedTeams.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700">
                    <span className="font-bold text-orange-700 flex items-center gap-1">
                      <span>{m.teamId}:</span>
                      <span className="text-slate-800">{m.teamName}</span>
                    </span>
                    <span className="text-slate-500 truncate max-w-[180px] text-[10px]">
                      {m.fileName} {m.isNew && <span className="text-emerald-600 font-bold">(New)</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-[#faf7f2] flex items-center justify-between">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-mono text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
          >
            + Add more files
          </button>

          <div className="flex gap-2">
            {matchResult && matchResult.matchedCount > 0 && (
              <button
                onClick={handleLaunchFirst}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Present First Deck on Screen</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
