import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

interface ScreenPortalFooterProps {
  onOpenAdmin?: () => void;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const ScreenPortalFooter: React.FC<ScreenPortalFooterProps> = ({
  onOpenAdmin,
  soundEnabled,
  setSoundEnabled,
  isFullscreen,
  toggleFullscreen
}) => {
  return (
    <footer className="px-6 py-2.5 flex items-center justify-between text-xs text-slate-500 font-mono border-t border-slate-900 bg-slate-950/40">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">Auditorium Projector Display</span>
        </span>
        <span className="hidden md:inline text-slate-700">|</span>
        <span className="hidden md:inline text-slate-400">
          Cadence: Slide 1 (10s) → Slide 2 (1m) → Slide 3 (1m) → Slide 4 (40s) → Slide 5 (40s) → Slide 6 (20s)
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-[11px]"
          >
            Open Admin Line
          </button>
        )}

        <button
          onClick={() => setSoundEnabled((s) => !s)}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title={soundEnabled ? 'Mute Chimes' : 'Unmute Chimes'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Toggle Projector Fullscreen (F)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-orange-400" /> : <Maximize2 className="w-4 h-4 text-orange-400" />}
        </button>
      </div>
    </footer>
  );
};
