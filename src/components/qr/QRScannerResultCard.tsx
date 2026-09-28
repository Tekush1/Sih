import React from 'react';
import { Team } from '../../types';
import { CheckCircle2, AlertCircle, Play, ArrowRight } from 'lucide-react';

interface QRScannerResultCardProps {
  scanResult: {
    success: boolean;
    team?: Team;
    message: string;
  };
  onLaunchPresentation: (team: Team) => void;
}

export const QRScannerResultCard: React.FC<QRScannerResultCardProps> = ({
  scanResult,
  onLaunchPresentation
}) => {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        scanResult.success
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
          : 'bg-rose-50 border-rose-300 text-rose-900'
      }`}
    >
      <div className="flex items-start gap-3">
        {scanResult.success ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 space-y-1">
          <h4 className="font-bold text-sm">
            {scanResult.success ? 'Pass Verified Successfully' : 'Validation Failed'}
          </h4>
          <p className="text-xs opacity-90">{scanResult.message}</p>

          {scanResult.success && scanResult.team && (
            <div className="mt-3 p-3 rounded-xl bg-white border border-emerald-200 text-xs text-slate-700 space-y-1 font-mono">
              <div className="flex justify-between text-slate-900 font-bold">
                <span>{scanResult.team.name} ({scanResult.team.id})</span>
                <span className="text-orange-700">{scanResult.team.track}</span>
              </div>
              <div className="text-slate-500 font-sans">{scanResult.team.college}</div>
              <div className="text-emerald-700 font-bold pt-1">
                Slot: {scanResult.team.scheduledSlot?.startTime || '14:00'} - {scanResult.team.scheduledSlot?.endTime || '14:06'}
              </div>
            </div>
          )}
        </div>
      </div>

      {scanResult.success && scanResult.team && (
        <div className="mt-4 pt-3 border-t border-emerald-200 flex justify-end">
          <button
            onClick={() => onLaunchPresentation(scanResult.team!)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Presentation Engine</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
