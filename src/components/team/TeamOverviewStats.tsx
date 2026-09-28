import React from 'react';
import { Team, Stage } from '../../types';
import { CheckCircle2, Clock } from 'lucide-react';

interface TeamOverviewStatsProps {
  currentTeam: Team;
  assignedStage?: Stage;
}

export const TeamOverviewStats: React.FC<TeamOverviewStatsProps> = ({
  currentTeam,
  assignedStage
}) => {
  const isApproved = currentTeam.submission?.status === 'APPROVED';
  const isUnderReview = currentTeam.submission?.status === 'UNDER_REVIEW';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
        <span className="text-xs font-mono font-bold text-slate-500 uppercase">INTERNAL NOMINATION</span>
        <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-lg">
          <CheckCircle2 className="w-5 h-5" />
          <span>VERIFIED</span>
        </div>
        <p className="text-[11px] text-slate-500 font-mono">Form ID: {currentTeam.googleFormSubmissionId}</p>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
        <span className="text-xs font-mono font-bold text-slate-500 uppercase">STAGE ARENA</span>
        <div className="text-slate-900 font-extrabold text-lg flex items-center gap-2">
          <span>{assignedStage?.name || 'Stage Alpha'}</span>
        </div>
        <p className="text-[11px] text-orange-700 font-medium">{assignedStage?.location || 'Auditorium Hall A'}</p>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
        <span className="text-xs font-mono font-bold text-slate-500 uppercase">PRESENTATION WINDOW</span>
        <div className="text-[#b47e3a] font-mono font-extrabold text-lg flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{currentTeam.scheduledSlot?.startTime || '14:00'} - {currentTeam.scheduledSlot?.endTime || '14:06'}</span>
        </div>
        <p className="text-[11px] text-slate-500 font-mono">Strict 6:00 min stage cadence</p>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
        <span className="text-xs font-mono font-bold text-slate-500 uppercase">PPT STATUS</span>
        <div className="font-extrabold text-lg">
          {isApproved ? (
            <span className="text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> APPROVED
            </span>
          ) : isUnderReview ? (
            <span className="text-orange-600 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> UNDER REVIEW
            </span>
          ) : (
            <span className="text-slate-400">PENDING UPLOAD</span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 font-mono">
          {currentTeam.submission ? `Version: ${currentTeam.submission.version}` : 'No submission yet'}
        </p>
      </div>
    </div>
  );
};
