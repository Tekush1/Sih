import React from 'react';
import { CheckCircle2, Tv, ArrowRight } from 'lucide-react';

interface CSVSuccessBannerProps {
  importResult: {
    added: number;
    updated: number;
    total: number;
    firstTeamId?: string;
  };
  onSendToScreen: (teamId: string) => void;
  onFinish: () => void;
}

export const CSVSuccessBanner: React.FC<CSVSuccessBannerProps> = ({
  importResult,
  onSendToScreen,
  onFinish
}) => {
  return (
    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-extrabold text-emerald-950 text-base">
            Teams Successfully Updated in Context!
          </h4>
          <p className="text-xs text-emerald-800 mt-1">
            Processed <strong>{importResult.total}</strong> records:{' '}
            <strong>{importResult.added}</strong> new squads added,{' '}
            <strong>{importResult.updated}</strong> squads updated with links.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-emerald-200">
        {importResult.firstTeamId && (
          <button
            onClick={() => onSendToScreen(importResult.firstTeamId!)}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Send First Team ({importResult.firstTeamId}) to Projector Screen</span>
          </button>
        )}

        <button
          onClick={onFinish}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Done · View Presentation Line</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
