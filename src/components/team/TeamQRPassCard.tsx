import React from 'react';
import { Team, Stage } from '../../types';
import { QrCode, Lock, Eye } from 'lucide-react';

interface TeamQRPassCardProps {
  currentTeam: Team;
  assignedStage?: Stage;
  onOpenQRModal: () => void;
}

export const TeamQRPassCard: React.FC<TeamQRPassCardProps> = ({
  currentTeam,
  assignedStage,
  onOpenQRModal
}) => {
  const isApproved = currentTeam.submission?.status === 'APPROVED';

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-orange-600" />
          <span>Digital QR Stage Pass</span>
        </h3>
        <span className="text-[10px] font-mono font-bold text-orange-800 px-2 py-0.5 rounded bg-orange-100 border border-orange-200">
          STAGE READY
        </span>
      </div>

      {isApproved ? (
        <div className="text-center space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            ✓ PPT Approved. Your QR Presentation Pass is active.
          </div>

          <div className="p-6 rounded-2xl bg-[#faf7f2] border border-slate-200 text-center space-y-4">
            <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-md border border-slate-200">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  currentTeam.qrPass?.token || `QR-${currentTeam.id}`
                )}`} 
                alt="Digital QR Pass" 
                className="w-full h-full"
              />
            </div>

            <div className="font-mono text-xs space-y-1">
              <div className="text-orange-700 font-extrabold">{currentTeam.id}</div>
              <div className="text-slate-600">{assignedStage?.name || 'Stage Alpha'}</div>
              <div className="text-[#b47e3a] font-bold">{currentTeam.scheduledSlot?.startTime || '14:00'}</div>
            </div>

            <button
              onClick={onOpenQRModal}
              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Eye className="w-4 h-4" />
              <span>View Full Presentation Pass</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[#faf7f2] border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">QR Pass Locked</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Your Digital Stage Pass will unlock automatically once your PPT is reviewed and approved.
          </p>
        </div>
      )}
    </div>
  );
};
