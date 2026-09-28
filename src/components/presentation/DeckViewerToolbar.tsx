import React, { useRef } from 'react';
import { 
  FolderOpen, 
  Upload, 
  RefreshCw, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  HardDrive, 
  Globe 
} from 'lucide-react';

interface DeckViewerToolbarProps {
  teamName: string;
  track?: string;
  hasLocalOffline: boolean;
  activeViewMode: 'offline' | 'drive';
  setActiveViewMode: (mode: 'offline' | 'drive') => void;
  hasDriveUrl: boolean;
  isFolder: boolean;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  onReload: () => void;
  onOpenDirect: () => void;
  onLocalFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DeckViewerToolbar: React.FC<DeckViewerToolbarProps> = ({
  teamName,
  track,
  hasLocalOffline,
  activeViewMode,
  setActiveViewMode,
  hasDriveUrl,
  isFolder,
  isFullscreen,
  toggleFullscreen,
  onReload,
  onOpenDirect,
  onLocalFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="px-4 py-2.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-3 text-xs shrink-0 select-none">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.pptx,application/pdf"
        onChange={onLocalFileUpload}
        className="hidden"
      />

      {/* Left: Origin indicator & Switcher */}
      <div className="flex items-center gap-2 min-w-0">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${activeViewMode === 'offline' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
        
        <span className="font-mono text-slate-400 font-bold hidden sm:inline">DECK:</span>
        <span className="font-bold text-white truncate max-w-[180px] sm:max-w-xs">{teamName}</span>
        {track && <span className="text-slate-500 text-[11px] hidden md:inline">({track})</span>}

        {/* View Mode Toggle Pill */}
        {hasLocalOffline && hasDriveUrl && (
          <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-700 text-[10px] font-mono">
            <button
              onClick={() => setActiveViewMode('offline')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
                activeViewMode === 'offline' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Offline PDF
            </button>
            <button
              onClick={() => setActiveViewMode('drive')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
                activeViewMode === 'drive' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cloud Drive
            </button>
          </div>
        )}

        {activeViewMode === 'offline' && (
          <span className="px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Offline Served</span>
          </span>
        )}

        {activeViewMode === 'drive' && isFolder && (
          <span className="px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700/60 text-blue-300 font-mono text-[10px] font-bold flex items-center gap-1">
            <FolderOpen className="w-3 h-3 text-blue-400" />
            <span>Drive Folder</span>
          </span>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
          title="Upload or change local offline presentation file (PDF)"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload Offline PPT</span>
        </button>

        <button
          onClick={onReload}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Reload Presentation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {activeViewMode === 'drive' && (
          <button
            onClick={onOpenDirect}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
            title="Open in Google Drive"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open Drive</span>
          </button>
        )}

        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Full Deck View' : 'Full Deck View'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-orange-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
