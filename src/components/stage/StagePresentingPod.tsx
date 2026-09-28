import React from 'react';
import { Team } from '../../types';
import { Play, QrCode, Clock, CheckCircle2 } from 'lucide-react';

interface StagePresentingPodProps {
  presentingTeam?: Team;
  onLaunchTeam: (team: Team) => void;
  onOpenScanner: () => void;
}

export const StagePresentingPod: React.FC<StagePresentingPodProps> = ({
  presentingTeam,
  onLaunchTeam,
  onOpenScanner
}) => {
  return (
    <div className="lg:col-span-7 rounded-3xl bg-white border-2 border-orange-300 p-6 md:p-8 space-y-6 relative overflow-hidden shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-orange-700 font-black flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          CURRENT PRESENTING POD
        </span>

        <span className="px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 font-mono font-bold text-xs">
          Presentation Active
        </span>
      </div>

      {presentingTeam ? (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-1 flex-wrap">
              <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                {presentingTeam.id}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-200 text-blue-800 font-bold">
                PS: {presentingTeam.psId || 'SIH1609'}
              </span>
              <span>·</span>
              <span className="text-slate-600 font-medium">{presentingTeam.track}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {presentingTeam.name}
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1">{presentingTeam.college}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-orange-100 space-y-1.5 text-xs">
            <span className="text-slate-500 font-mono block text-[10px] uppercase font-bold">PROJECT FOCUS</span>
            <p className="text-slate-800 font-medium line-clamp-2">{presentingTeam.problemStatement}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold">SCHEDULED SLOT</span>
              <span className="text-orange-700 font-black text-sm">
                {presentingTeam.scheduledSlot?.startTime || '14:00'} - {presentingTeam.scheduledSlot?.endTime || '14:06'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold">PASS STATUS</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 text-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                VERIFIED
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onLaunchTeam(presentingTeam)}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Presentation Engine</span>
            </button>

            <button
              onClick={onOpenScanner}
              className="px-4 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-orange-600" />
              <span>Scan Next Pass</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center space-y-3">
          <Clock className="w-10 h-10 text-orange-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800">Stage Currently Waiting for Next Team</p>
          <button
            onClick={onOpenScanner}
            className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Team QR Pass to Begin</span>
          </button>
        </div>
      )}
    </div>
  );
};
