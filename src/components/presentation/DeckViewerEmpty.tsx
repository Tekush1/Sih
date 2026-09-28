import React, { useRef } from 'react';
import { UploadCloud, FileSpreadsheet, Plus, HardDrive, Link } from 'lucide-react';

interface DeckViewerEmptyProps {
  teamName: string;
  teamId: string;
  customInputUrl: string;
  setCustomInputUrl: (url: string) => void;
  handleAttachSubmit: (e: React.FormEvent) => void;
  onSelectLocalFile: (file: File) => void;
  onOpenAdmin?: () => void;
}

export const DeckViewerEmpty: React.FC<DeckViewerEmptyProps> = ({
  teamName,
  teamId,
  customInputUrl,
  setCustomInputUrl,
  handleAttachSubmit,
  onSelectLocalFile,
  onOpenAdmin
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onSelectLocalFile(file);
  };

  return (
    <div className="w-full h-full min-h-[440px] rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.pptx,application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelectLocalFile(file);
        }}
        className="hidden"
      />

      <div className="max-w-lg w-full space-y-4 relative z-10">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800/80 text-emerald-400 font-mono text-[11px] font-bold uppercase inline-flex items-center gap-1.5">
            <HardDrive className="w-3 h-3 text-emerald-400" />
            <span>Offline Local PPT Serving Ready</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Present Offline: {teamName} ({teamId})
          </h3>
          <p className="text-xs text-slate-400">
            Upload your PPT/PDF locally to serve presentations without internet, or attach a Google Drive link.
          </p>
        </div>

        {/* Local Offline File Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className="p-6 border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 rounded-2xl bg-emerald-950/20 hover:bg-emerald-950/30 transition-all cursor-pointer space-y-2 group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-300">
              Drop Local PPT / PDF File Here, or Click to Browse
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Stored locally on this device · Zero internet required
            </p>
          </div>
        </div>

        {/* Alternative: Google Drive Link */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-500 font-mono block">OR ATTACH GOOGLE DRIVE LINK:</span>
          <form onSubmit={handleAttachSubmit} className="flex gap-2">
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              value={customInputUrl}
              onChange={(e) => setCustomInputUrl(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Link className="w-3.5 h-3.5" />
              <span>Attach</span>
            </button>
          </form>
        </div>

        {onOpenAdmin && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              Open Admin Line to import CSV lineup ↗
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
