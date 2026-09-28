import React, { useState, useEffect } from 'react';
import { getGoogleDriveEmbedUrl } from '../../utils/driveEmbed';
import { getLocalDeck, saveLocalDeck } from '../../utils/localDeckStorage';
import { DeckViewerEmpty } from './DeckViewerEmpty';
import { DeckViewerToolbar } from './DeckViewerToolbar';

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
  const [activeViewMode, setActiveViewMode] = useState<'offline' | 'drive'>('offline');

  const { embedUrl, directUrl, isFolder } = getGoogleDriveEmbedUrl(driveUrl);

  // Load local offline deck if previously saved
  useEffect(() => {
    let isMounted = true;
    getLocalDeck(teamId).then((res) => {
      if (isMounted && res) {
        setLocalBlobUrl(res.blobUrl);
        setLocalFileName(res.fileName);
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

  const currentEmbedSrc = activeViewMode === 'offline' && localBlobUrl
    ? `${localBlobUrl}#toolbar=1&navpanes=0`
    : embedUrl;

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
      <div className="flex-1 w-full h-full bg-slate-950 relative">
        <iframe
          key={`${iframeKey}-${activeViewMode}`}
          src={currentEmbedSrc}
          title={`Presentation for ${teamName}`}
          className="w-full h-full border-0 rounded-b-3xl bg-black"
          allow="autoplay; fullscreen; clipboard-write; encrypted-media; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          loading="eager"
        />

        <div className="absolute bottom-2 left-4 right-4 pointer-events-none flex items-center justify-between text-[10px] font-mono text-slate-500/80">
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
