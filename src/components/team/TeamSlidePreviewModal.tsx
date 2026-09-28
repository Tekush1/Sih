import React, { useState } from 'react';
import { Team } from '../../types';
import { PresentationRenderer } from '../presentation/PresentationRenderer';

interface TeamSlidePreviewModalProps {
  currentTeam: Team;
  isOpen: boolean;
  onClose: () => void;
}

export const TeamSlidePreviewModal: React.FC<TeamSlidePreviewModalProps> = ({
  currentTeam,
  isOpen,
  onClose
}) => {
  const [previewSlideIdx, setPreviewSlideIdx] = useState<number>(0);

  if (!isOpen || !currentTeam.submission) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>6-Minute Presentation Deck</span>
            <span className="text-xs font-mono text-orange-600 font-bold">
              (Slide {previewSlideIdx + 1} of 6)
            </span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer">
            ✕
          </button>
        </div>

        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
          <PresentationRenderer
            slide={currentTeam.submission.slides[previewSlideIdx]}
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
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-800 hover:bg-slate-200 cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
