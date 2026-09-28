import React from 'react';
import { Users, CheckCircle2, Layers } from 'lucide-react';
import { HackathonStats } from '../../types';

interface HeroMetricsProps {
  stats: HackathonStats;
}

export const HeroMetrics: React.FC<HeroMetricsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 text-left">
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">TIT SQUADS</span>
          <Users className="w-4 h-4 text-orange-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0f172a] tabular-nums">
          {stats.totalTeams}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">TIT Bhopal Departments</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">TIT STUDENTS</span>
          <Users className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0f172a] tabular-nums">
          {stats.totalParticipants}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">4-6 Engineers per Squad</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">APPROVED PPTS</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 tabular-nums">
          {stats.pptApproved}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Digital QR Passes Generated</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">CAMPUS STAGES</span>
          <Layers className="w-4 h-4 text-[#b47e3a]" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#b47e3a] tabular-nums">
          4 Arenas
        </div>
        <p className="text-[11px] text-slate-500 mt-1">TIT Auditorium &amp; Halls</p>
      </div>
    </div>
  );
};
