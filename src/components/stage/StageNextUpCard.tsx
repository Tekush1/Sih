import React from 'react';
import { ScheduleSlot, Team } from '../../types';
import { QrCode } from 'lucide-react';

interface StageNextUpCardProps {
  nextTeam?: Team;
  nextSlot?: ScheduleSlot;
  onOpenScanner: () => void;
}

export const StageNextUpCard: React.FC<StageNextUpCardProps> = ({
  nextTeam,
  nextSlot,
  onOpenScanner
}) => {
  return (
    <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200/90 p-6 md:p-8 space-y-6 flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">
            NEXT UP IN QUEUE
          </span>
          <span className="text-orange-700 text-xs font-mono font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
            ON DECK
          </span>
        </div>

        {nextTeam ? (
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
              <span className="px-2 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-800 font-bold">
                {nextTeam.id}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-200 text-blue-800 font-bold">
                PS: {nextTeam.psId || 'SIH1609'}
              </span>
              <span className="text-slate-500">{nextTeam.college}</span>
            </div>

            <h4 className="text-xl font-bold text-slate-900">{nextTeam.name}</h4>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {nextTeam.problemStatement}
            </p>

            <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs font-mono space-y-1">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Scheduled Window:</span>
                <span className="text-slate-900 font-bold">{nextSlot?.startTime} - {nextSlot?.endTime}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Status:</span>
                <span className="text-emerald-700 font-bold">Approved &amp; Ready</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-8 text-center text-xs text-slate-500 font-mono">
            No subsequent teams currently scheduled in this stage queue.
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={onOpenScanner}
          className="w-full py-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <QrCode className="w-4 h-4 text-orange-600" />
          <span>Verify &amp; Check-In Team via QR</span>
        </button>
      </div>
    </div>
  );
};
