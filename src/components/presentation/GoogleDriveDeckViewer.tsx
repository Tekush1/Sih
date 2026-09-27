import React, { useState } from 'react';
import { getGoogleDriveEmbedUrl } from '../../utils/driveEmbed';
import { 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  FolderOpen, 
  FileSpreadsheet, 
  AlertTriangle,
  FileText,
  Sparkles,
  Link,
  Plus
} from 'lucide-react';

interface GoogleDriveDeckViewerProps {
  driveUrl?: string;
  teamName: string;
  teamId: string;
  track?: string;
  onUpdateDriveUrl?: (newUrl: string) => void;
  onOpenAdmin?: () => void;
}

export const GoogleDriveDeckViewer: React.FC<GoogleDriveDeckViewerProps> = ({
  driveUrl = '',
  teamName,
  teamId,
  track,
  onUpdateDriveUrl,
  onOpenAdmin
}) => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreenIframe, setIsFullscreenIframe] = useState<boolean>(false);
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [showInputForm, setShowInputForm] = useState<boolean>(false);

  const { embedUrl, directUrl, isFolder } = getGoogleDriveEmbedUrl(driveUrl);

  const handleAttachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;
    if (onUpdateDriveUrl) {
      onUpdateDriveUrl(customInputUrl.trim());
      setShowInputForm(false);
    }
  };

  const handleOpenDirect = () => {
    if (directUrl) {
      window.open(directUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // If no Drive URL attached yet
  if (!driveUrl || !embedUrl) {
    return (
      <div className="w-full h-full min-h-[420px] rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-orange-500/5 to-transparent pointer-events-none" />

        <div className="max-w-md w-full space-y-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mx-auto flex items-center justify-center shadow-lg shadow-orange-500/10">
            <FileSpreadsheet className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-950 border border-orange-800/60 text-orange-400 font-mono text-[11px] font-bold uppercase">
              Awaiting Drive Deck
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              No Google Drive Link Attached
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Squad <strong className="text-white">{teamName}</strong> ({teamId}) does not have an original Google Drive link loaded yet.
            </p>
          </div>

          {/* Quick attach form */}
          <form onSubmit={handleAttachSubmit} className="space-y-3 pt-2">
            <div className="relative">
              <input
                type="url"
                required
                placeholder="https://drive.google.com/file/d/... or docs.google.com/..."
                value={customInputUrl}
                onChange={(e) => setCustomInputUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-orange-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Attach Drive Presentation</span>
              </button>

              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Insert CSV File
                </button>
              )}
            </div>
          </form>

          <p className="text-[11px] text-slate-500 font-mono">
            Supported: Google Slides, PowerPoint (.pptx on Drive), PDFs, or Drive Shared Folders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full flex flex-col rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden transition-all relative ${
        isFullscreenIframe
          ? 'fixed inset-0 z-50 rounded-none border-none'
          : 'h-[68vh] min-h-[460px]'
      }`}
    >
      {/* Top Deck Control Toolbar */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 text-xs shrink-0 select-none">
        {/* Left: Origin indicator */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono text-[10px] font-bold uppercase shrink-0">
            {isFolder ? 'Drive Folder' : 'Live Google Drive PPT'}
          </span>
          <span className="font-mono text-slate-400 text-[11px] truncate hidden sm:inline">
            {directUrl}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Attach / change link */}
          {showInputForm ? (
            <form onSubmit={handleAttachSubmit} className="flex items-center gap-1.5">
              <input
                type="url"
                value={customInputUrl}
                onChange={(e) => setCustomInputUrl(e.target.value)}
                placeholder="New Drive URL..."
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-[11px] font-mono text-white focus:outline-none focus:border-orange-500 w-44"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg bg-orange-600 text-white font-bold text-[10px] cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowInputForm(false)}
                className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px] cursor-pointer"
              >
                Cancel
              </button>
            </form>
          ) : (
            onUpdateDriveUrl && (
              <button
                onClick={() => {
                  setCustomInputUrl(driveUrl);
                  setShowInputForm(true);
                }}
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors cursor-pointer"
                title="Update Google Drive URL"
              >
                <Link className="w-3 h-3 text-orange-400" />
                <span>Change URL</span>
              </button>
            )
          )}

          {/* Reload Iframe */}
          <button
            onClick={() => setIframeKey((k) => k + 1)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reload Google Drive Presentation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Open Original Drive in New Window */}
          <button
            onClick={handleOpenDirect}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
            title="Open original presentation in Google Drive / Slides in full new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open in Drive</span>
          </button>

          {/* Expand / Minimize Embed */}
          <button
            onClick={() => setIsFullscreenIframe((f) => !f)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isFullscreenIframe ? 'Exit Full Deck View' : 'Full Deck View'}
          >
            {isFullscreenIframe ? <Minimize2 className="w-3.5 h-3.5 text-orange-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Embedded Google Drive Iframe Viewport */}
      <div className="flex-1 w-full h-full bg-slate-950 relative">
        <iframe
          key={iframeKey}
          src={embedUrl}
          title={`Presentation for ${teamName}`}
          className="w-full h-full border-0 rounded-b-3xl bg-black"
          allow="autoplay; fullscreen; clipboard-write; encrypted-media; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          loading="eager"
        />

        {/* Ambient discreet help banner at bottom of embed */}
        <div className="absolute bottom-2 left-4 right-4 pointer-events-none flex items-center justify-between text-[10px] font-mono text-slate-500/80">
          <span>Drive Deck Embed: {teamName}</span>
          <span className="pointer-events-auto">
            <button
              onClick={handleOpenDirect}
              className="text-orange-400/90 hover:text-orange-300 underline cursor-pointer"
            >
              Pop out to separate monitor if needed ↗
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};
