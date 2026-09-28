import React, { useState, useEffect } from 'react';
import { getGoogleDriveEmbedUrl } from '../../utils/driveEmbed';
import { getLocalDeck, saveLocalDeck } from '../../utils/localDeckStorage';
import { DeckViewerEmpty } from './DeckViewerEmpty';
import { DeckViewerToolbar } from './DeckViewerToolbar';
import { FileText, Download, ExternalLink, HardDrive } from 'lucide-react';

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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [localBlobUrl, setLocalBlobUrl] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string>('');
  const [localFileType, setLocalFileType] = useState<string>('');
  const [activeViewMode, setActiveViewMode] = useState<'offline' | 'drive'>('offline');

  const { embedUrl, directUrl, isFolder } = getGoogleDriveEmbedUrl(driveUrl);

  // Load local offline deck if previously saved
  useEffect(() => {
    let isMounted = true;
    getLocalDeck(teamId).then((res) => {
      if (isMounted && res && res.blobUrl) {
        setLocalBlobUrl(res.blobUrl);
        setLocalFileName(res.fileName);
        setLocalFileType(res.fileType || (res.fileName.endsWith('.pdf') ? 'application/pdf' : 'pptx'));
        setActiveViewMode('offline');
      } else if (isMounted && embedUrl) {
        setActiveViewMode('drive');
      }
    });
    return () => {
      isMounted = false;
    };
  }, [teamId, embedUrl]);

  const handleSelectLocalFile = async (file: File) => {
    try {
      const res = await saveLocalDeck(teamId, file);
      setLocalBlobUrl(res.blobUrl);
      setLocalFileName(res.fileName);
      setLocalFileType(res.fileType);
      setActiveViewMode('offline');
      setIframeKey((k) => k + 1);
    } catch (err) {
      console.error('Failed to save local offline deck:', err);
    }
  };

  const handleAttachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;
    if (onUpdateDriveUrl) {
      onUpdateDriveUrl(customInputUrl.trim());
      setActiveViewMode('drive');
    }
  };

  const hasLocal = !!localBlobUrl;
  const hasDrive = !!embedUrl;

  if (!hasLocal && !hasDrive) {
    return (
      <DeckViewerEmpty
        teamName={teamName}
        teamId={teamId}
        customInputUrl={customInputUrl}
        setCustomInputUrl={setCustomInputUrl}
        handleAttachSubmit={handleAttachSubmit}
        onSelectLocalFile={handleSelectLocalFile}
        onOpenAdmin={onOpenAdmin}
      />
    );
  }

  const isLocalPptx = localFileName.toLowerCase().endsWith('.pptx') || localFileName.toLowerCase().endsWith('.ppt');

  return (
    <div
      className={`w-full flex flex-col rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden transition-all relative ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'h-[68vh] min-h-[460px]'
      }`}
    >
      <DeckViewerToolbar
        teamName={teamName}
        track={track}
        hasLocalOffline={hasLocal}
        activeViewMode={activeViewMode}
        setActiveViewMode={setActiveViewMode}
        hasDriveUrl={hasDrive}
        isFolder={isFolder}
        isFullscreen={isFullscreen}
        toggleFullscreen={() => setIsFullscreen((f) => !f)}
        onReload={() => setIframeKey((k) => k + 1)}
        onOpenDirect={() => {
          if (activeViewMode === 'offline' && localBlobUrl) {
            window.open(localBlobUrl, '_blank');
          } else if (directUrl) {
            window.open(directUrl, '_blank');
          }
        }}
        onLocalFileUpload={(e) => {
          const file = e.target.files?.[0];
          if (file) handleSelectLocalFile(file);
        }}
      />

      {/* Main Presentation Viewport */}
      <div className="flex-1 w-full h-full bg-slate-950 relative flex flex-col justify-center overflow-hidden">
        {activeViewMode === 'offline' && localBlobUrl ? (
          isLocalPptx ? (
            /* PowerPoint (.pptx) Offline Presentation Card */
            <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center space-y-5 bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-xl">
                <FileText className="w-10 h-10" />
              </div>

              <div className="max-w-md space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Local PowerPoint Presentation Loaded</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{teamName}</h3>
                <p className="text-xs font-mono text-slate-400">{localFileName}</p>
                <p className="text-xs text-slate-500">
                  Slide cadence and stage timer are running. You can open or present this PowerPoint file directly on the projector screen.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={localBlobUrl}
                  download={localFileName}
                  className="px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Open PowerPoint File</span>
                </a>
                <button
                  onClick={() => window.open(localBlobUrl, '_blank')}
                  className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Tab</span>
                </button>
              </div>
            </div>
          ) : (
            /* Local PDF Presentation (un-sandboxed to prevent browser PDF blocker) */
            <object
              key={`${iframeKey}-offline-pdf`}
              data={`${localBlobUrl}#toolbar=1&navpanes=0`}
              type="application/pdf"
              className="w-full h-full border-0 rounded-b-3xl bg-black"
            >
              <iframe
                src={`${localBlobUrl}#toolbar=1&navpanes=0`}
                title={`Offline Presentation for ${teamName}`}
                className="w-full h-full border-0 rounded-b-3xl bg-black"
              />
            </object>
          )
        ) : (
          /* Cloud Google Drive Embed */
          <iframe
            key={`${iframeKey}-drive`}
            src={embedUrl}
            title={`Presentation for ${teamName}`}
            className="w-full h-full border-0 rounded-b-3xl bg-black"
            allow="autoplay; fullscreen; clipboard-write; encrypted-media; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            loading="eager"
          />
        )}

        <div className="absolute bottom-2 left-4 right-4 pointer-events-none flex items-center justify-between text-[10px] font-mono text-slate-500/80 bg-slate-950/80 px-2 py-0.5 rounded backdrop-blur-xs">
          <span>
            {activeViewMode === 'offline'
              ? `Local Offline Served: ${localFileName || 'Presentation.pdf'}`
              : `Drive Embed: ${teamName}`}
          </span>
          <span className="pointer-events-auto">
            <button
              onClick={() => {
                const target = activeViewMode === 'offline' ? localBlobUrl : directUrl;
                if (target) window.open(target, '_blank');
              }}
              className="text-orange-400/90 hover:text-orange-300 underline cursor-pointer"
            >
              Open in external window ↗
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};
