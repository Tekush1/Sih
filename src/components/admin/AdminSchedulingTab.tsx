import React from 'react';
import { Stage, ScheduleSlot, Team } from '../../types';
import { RefreshCw } from 'lucide-react';

interface AdminSchedulingTabProps {
  stages: Stage[];
  selectedStageSchedule: string;
  setSelectedStageSchedule: (id: string) => void;
  autoRegenerateSlots: (stageId: string, startHour: number, startMinute: number) => void;
  stageSlots: ScheduleSlot[];
  teams: Team[];
  updateStageSlotStatus: (slotId: string, status: any) => void;
}

export const AdminSchedulingTab: React.FC<AdminSchedulingTabProps> = ({
  stages,
  selectedStageSchedule,
  setSelectedStageSchedule,
  autoRegenerateSlots,
  stageSlots,
  teams,
  updateStageSlotStatus
}) => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-600">Select Stage:</span>
          <div className="flex gap-1.5">
            {stages.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStageSchedule(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                  selectedStageSchedule === st.id
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-[#faf7f2] text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => autoRegenerateSlots(selectedStageSchedule, 10, 0)}
          className="px-4 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Auto-Generate 6-Minute Slots (Start 10:00)</span>
        </button>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#faf7f2] border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Slot Time</th>
                <th className="py-3 px-4">Team ID</th>
                <th className="py-3 px-4">Team Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {stageSlots.slice(0, 32).map((slot, idx) => {
                const team = teams.find((t) => t.id === slot.teamId);
                if (!team) return null;

                return (
                  <tr key={slot.id} className="hover:bg-orange-50/40">
                    <td className="py-2.5 px-4 text-slate-400">#{idx + 1}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{slot.startTime} - {slot.endTime}</td>
                    <td className="py-2.5 px-4 text-orange-700 font-bold">{team.id}</td>
                    <td className="py-2.5 px-4 font-sans font-bold text-slate-900">{team.name}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        {slot.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <select
                        value={slot.status}
                        onChange={(e) => updateStageSlotStatus(slot.id, e.target.value as any)}
                        className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px]"
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="ABSENT">Absent</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
