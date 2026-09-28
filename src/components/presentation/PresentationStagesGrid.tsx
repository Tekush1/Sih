import React from 'react';
import { Stage, Team, ScheduleSlot } from '../../types';
import { ArrowRight, Play } from 'lucide-react';

interface StageStatusItem {
  stage: Stage;
  presentingTeam?: Team;
  nextTeam?: Team;
  slotCount: number;
}

interface PresentationStagesGridProps {
  stages: Stage[];
  teams: Team[];
  schedules: ScheduleSlot[];
  onNavigate: (tab: string) => void;
  onLaunchPresentation: (teamId: string, stageId: string) => void;
}

export const PresentationStagesGrid: React.FC<PresentationStagesGridProps> = ({
  stages,
  teams,
  schedules,
  onNavigate,
  onLaunchPresentation
}) => {
  const stageStatuses: StageStatusItem[] = stages.map((stage) => {
    const slots = schedules.filter((s) => s.stageId === stage.id);
    const inProgress = slots.find((s) => s.status === 'IN_PROGRESS');
    const scheduled = slots.filter((s) => s.status === 'SCHEDULED');

    const presentingTeam = inProgress
      ? teams.find((t) => t.id === inProgress.teamId)
      : stage.currentTeamId
      ? teams.find((t) => t.id === stage.currentTeamId)
      : teams.find((t) => t.stageId === stage.id);

    const nextTeam = scheduled[0] ? teams.find((t) => t.id === scheduled[0].teamId) : undefined;

    return { stage, presentingTeam, nextTeam, slotCount: slots.length };
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE CAMPUS PRESENTATION PODS</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Active Stage Arenas &amp; Presentation Queues
          </h2>
        </div>

        <button
          onClick={() => onNavigate('stage-portal')}
          className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>Full Marshal Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stageStatuses.map(({ stage, presentingTeam, nextTeam, slotCount }) => (
          <div
            key={stage.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-5 shadow-xs hover:border-orange-300 transition-all"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  <span className="text-orange-700">{stage.name}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">{stage.location}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{stage.track}</h3>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-mono font-bold">
                {slotCount} Teams
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-extrabold text-orange-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                  NOW PRESENTING
                </span>
                <span className="font-mono font-bold text-slate-600">
                  Slot: {presentingTeam?.scheduledSlot?.startTime || '14:00'} - {presentingTeam?.scheduledSlot?.endTime || '14:06'}
                </span>
              </div>

              {presentingTeam ? (
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-orange-800">{presentingTeam.id}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-200 text-blue-800 font-bold">
                      PS: {presentingTeam.psId || 'SIH1609'}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1">{presentingTeam.name}</h4>
                  <p className="text-xs text-slate-600 font-medium truncate mt-0.5">{presentingTeam.college}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-mono">Stage idle — awaiting team scan.</p>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-[#faf7f2] border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-500 font-mono font-bold">ON DECK:</span>
              <span className="font-bold text-slate-800 truncate max-w-xs">
                {nextTeam ? `${nextTeam.id} - ${nextTeam.name}` : 'Next in line'}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {presentingTeam && (
                <button
                  onClick={() => onLaunchPresentation(presentingTeam.id, stage.id)}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Projector Mode</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('stage-portal')}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Marshal Stage
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
