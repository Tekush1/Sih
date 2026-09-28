import React from 'react';
import { Team, Stage } from '../../types';
import { Building2, Clock, QrCode, ArrowUpRight } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  stages: Stage[];
  onSelect: (team: Team) => void;
  onOpenQR: (team: Team) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  stages,
  onSelect,
  onOpenQR
}) => {
  const isApproved = team.submission?.status === 'APPROVED';
  const isCompleted = team.scheduledSlot?.status === 'COMPLETED';
  const isPresenting = team.scheduledSlot?.status === 'IN_PROGRESS';
  const assignedStage = stages.find((s) => s.id === team.stageId);

  return (
    <div
      className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer shadow-xs"
      onClick={() => onSelect(team)}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-800 font-mono text-xs font-bold">
              {team.id}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[11px] font-bold">
              {team.psId || 'SIH1609'}
            </span>
          </div>

          <span className="text-xs font-mono font-bold">
            {isPresenting ? (
              <span className="text-orange-600 animate-pulse flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" /> PRESENTING
              </span>
            ) : isCompleted ? (
              <span className="text-emerald-700">COMPLETED</span>
            ) : isApproved ? (
              <span className="text-blue-700">APPROVED</span>
            ) : (
              <span className="text-slate-400">UNDER REVIEW</span>
            )}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
          {team.name}
        </h3>
        <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{team.college}</span>
        </p>

        <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed font-sans">
          {team.problemStatement}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-orange-700 font-bold truncate max-w-[150px]">{team.track}</span>
          <span className="font-mono text-slate-600 flex items-center gap-1 font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {team.scheduledSlot?.startTime || '14:00'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-mono text-slate-500 truncate">
            {assignedStage?.name || 'Stage Alpha'}
          </span>

          <div className="flex items-center gap-2">
            {team.qrPass && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQR(team);
                }}
                title="View Digital QR Pass"
                className="p-1 rounded text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}
            <span className="text-orange-600 text-xs font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Details <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
