import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Clock, MapPin, CheckCircle2, Play, Users, Search } from 'lucide-react';

interface ScheduleViewProps {
  onLaunchPresentation?: (teamId: string, stageId: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ onLaunchPresentation }) => {
  const { stages, schedules, teams } = useHackathon();
  const [selectedStageId, setSelectedStageId] = useState<string>('stage-alpha');
  const [searchSchedule, setSearchSchedule] = useState<string>('');

  const currentStage = stages.find((s) => s.id === selectedStageId) || stages[0];

  const stageSlots = schedules
    .filter((s) => s.stageId === selectedStageId)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const filteredSlots = stageSlots.filter((slot) => {
    const team = teams.find((t) => t.id === slot.teamId);
    if (!team) return false;
    return (
      team.name.toLowerCase().includes(searchSchedule.toLowerCase()) ||
      team.id.toLowerCase().includes(searchSchedule.toLowerCase()) ||
      team.college.toLowerCase().includes(searchSchedule.toLowerCase())
    );
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-600 block mb-2">
            05. STAGE CALENDAR &amp; SLOTS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
            Live Presentation Schedule
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            4 Parallel Stages · 6-Minute Automated Presentation Engine (60s/slide) at TIT Bhopal
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search scheduled squad..."
            value={searchSchedule}
            onChange={(e) => setSearchSchedule(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 shadow-xs"
          />
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stages.map((st) => {
          const isActive = st.id === selectedStageId;
          const slotsCount = schedules.filter((s) => s.stageId === st.id).length;
          const completedCount = schedules.filter((s) => s.stageId === st.id && s.status === 'COMPLETED').length;

          return (
            <button
              key={st.id}
              onClick={() => setSelectedStageId(st.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                isActive
                  ? 'bg-orange-50/80 border-orange-500 shadow-md shadow-orange-500/10'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className={isActive ? 'text-orange-700 font-bold' : 'text-slate-500'}>
                  {st.name}
                </span>
                <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">ACTIVE</span>
              </div>
              <p className="text-sm font-bold text-slate-900 truncate">{st.track}</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{st.location}</p>

              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span>Completed: {completedCount}/{slotsCount}</span>
                <span className="text-orange-600 font-bold">6m / slot</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Slots Queue List */}
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 bg-[#faf7f2] border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-mono font-bold text-sm text-slate-900">
              {currentStage.name} Live Queue
            </span>
            <span className="text-slate-500 text-xs font-mono">({filteredSlots.length} Slots)</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Presenting
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Scheduled
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredSlots.map((slot, idx) => {
            const team = teams.find((t) => t.id === slot.teamId);
            if (!team) return null;

            const isPresenting = slot.status === 'IN_PROGRESS';
            const isCompleted = slot.status === 'COMPLETED';

            return (
              <div
                key={slot.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isPresenting
                    ? 'bg-orange-50/70 border-l-4 border-l-orange-500'
                    : 'hover:bg-slate-50'
                }`}
              >
                {/* Left: Time and Index */}
                <div className="flex items-center gap-4">
                  <div className="w-10 text-center font-mono text-xs text-slate-400">
                    #{String(idx + 1).padStart(2, '0')}
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-mono text-xs font-bold text-slate-800 shrink-0 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>

                  {/* Team details */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-800 font-mono text-xs font-bold">
                        {team.id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {team.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500">
                      {team.college} · Lead: {team.leaderName}
                    </p>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-xs font-mono">
                    {isPresenting ? (
                      <span className="px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-800 font-bold flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                        ON STAGE NOW
                      </span>
                    ) : isCompleted ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        COMPLETED
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                        SCHEDULED
                      </span>
                    )}
                  </span>

                  {onLaunchPresentation && (
                    <button
                      onClick={() => onLaunchPresentation(team.id, currentStage.id)}
                      className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Stage View</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
