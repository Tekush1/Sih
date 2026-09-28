import React, { useState } from 'react';
import { Team } from '../../types';
import { X, Check } from 'lucide-react';
import { PresentationRenderer } from '../presentation/PresentationRenderer';

interface AdminReviewModalProps {
  reviewTeam: Team | null;
  onClose: () => void;
  onApprove: (teamId: string, notes: string) => void;
  onReject: (teamId: string, notes: string) => void;
}

export const AdminReviewModal: React.FC<AdminReviewModalProps> = ({
  reviewTeam,
  onClose,
  onApprove,
  onReject
}) => {
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [previewSlideIdx, setPreviewSlideIdx] = useState<number>(0);

  if (!reviewTeam || !reviewTeam.submission) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-between p-4 md:p-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-orange-400 font-bold">
            <span>{reviewTeam.id}</span>
            <span>·</span>
            <span>{reviewTeam.track}</span>
            <span>·</span>
            <span>Version: {reviewTeam.submission.version}</span>
          </div>
          <h3 className="text-xl font-bold text-white">{reviewTeam.name} — Review Deck</h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <button
                key={idx}
                onClick={() => setPreviewSlideIdx(idx)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold cursor-pointer ${
                  previewSlideIdx === idx ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white ml-3 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex items-center justify-center my-4">
        <PresentationRenderer
          slide={reviewTeam.submission.slides[previewSlideIdx] || reviewTeam.submission.slides[0]}
          team={reviewTeam}
          slideTimeRemaining={60}
        />
      </div>

      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Admin review notes / comments..."
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 font-sans"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => onReject(reviewTeam.id, reviewNotes)}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
          >
            Request Revisions
          </button>
          <button
            onClick={() => onApprove(reviewTeam.id, reviewNotes)}
            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-orange-600/30 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Approve &amp; Issue QR Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
