import React from 'react';
import { ScheduleSlot, Team } from '../../types';
import { Clock, Play } from 'lucide-react';

interface StageQueueListProps {
  stageName: string;
  stageSlots: ScheduleSlot[];
  teams: Team[];
  onLaunchTeam: (team: Team) => void;
}

export const StageQueueList: React.FC<StageQueueListProps> = ({
  stageName,
  stageSlots,
  teams,
  onLaunchTeam
}) => {
  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 bg-[#faf7f2] border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-600" />
          <h3 className="font-extrabold text-slate-900 text-sm">
            {stageName} · Full Queue ({stageSlots.length} Slots)
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">6 min interval</span>
      </div>

      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {stageSlots.map((slot, idx) => {
          const team = teams.find((t) => t.id === slot.teamId);
          if (!team) return null;

          const isPresenting = slot.status === 'IN_PROGRESS';
          const isCompleted = slot.status === 'COMPLETED';

          return (
            <div
              key={slot.id}
              className={`p-3.5 px-4 sm:px-6 flex items-center justify-between text-xs transition-colors ${
                isPresenting ? 'bg-orange-50/60' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400 w-8">#{idx + 1}</span>
                <span className="font-mono font-bold text-slate-900 w-24">
                  {slot.startTime} - {slot.endTime}
                </span>
                <span className="font-mono text-orange-700 font-bold">{team.id}</span>
                <span className="text-slate-900 font-bold">{team.name}</span>
                <span className="text-slate-500 hidden md:inline truncate max-w-[160px]">{team.college}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isPresenting
                      ? 'bg-orange-100 text-orange-800 border border-orange-300 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {slot.status}
                </span>

                <button
                  onClick={() => onLaunchTeam(team)}
                  className="p-1 text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"
                  title="Launch Presentation"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
