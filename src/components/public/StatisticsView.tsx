import React from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { 
  Users, 
  FileCheck, 
  CheckCircle2, 
  Layers, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Award,
  Zap
} from 'lucide-react';

export const StatisticsView: React.FC = () => {
  const { stats, stages, schedules } = useHackathon();

  const approvalRate = Math.round((stats.pptApproved / Math.max(stats.pptSubmissions, 1)) * 100);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-600 block">
          06. LIVE TELEMETRY &amp; ANALYTICS
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0f172a] tracking-tight">
          Hackathon Operations At Scale
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Real-time metrics measuring team submissions, Google Drive storage synchronization, stage presentation throughput, and judging approvals at Technocrats Institute of Technology.
        </p>
      </div>

      {/* Top 4 Primary Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2 hover:border-orange-300 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">TOTAL SQUADS</span>
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-4xl font-extrabold font-mono text-[#0f172a] tabular-nums">
            {stats.totalTeams}
          </div>
          <p className="text-xs text-slate-500">
            TIT Bhopal Engineering Departments
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2 hover:border-orange-300 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">STUDENT PARTICIPANTS</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-4xl font-extrabold font-mono text-blue-700 tabular-nums">
            {stats.totalParticipants}
          </div>
          <p className="text-xs text-slate-500">
            4-6 engineers per squad (100% verified)
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2 hover:border-orange-300 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">APPROVAL RATE</span>
            <FileCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-4xl font-extrabold font-mono text-emerald-600 tabular-nums">
            {approvalRate}%
          </div>
          <p className="text-xs text-slate-500">
            {stats.pptApproved} approved of {stats.pptSubmissions} submissions
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2 hover:border-orange-300 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">COMPLETED PITCHES</span>
            <CheckCircle2 className="w-5 h-5 text-[#b47e3a]" />
          </div>
          <div className="text-4xl font-extrabold font-mono text-[#b47e3a] tabular-nums">
            {stats.completedPresentations}
          </div>
          <p className="text-xs text-slate-500">
            6.0 min avg / presentation cycle
          </p>
        </div>
      </div>

      {/* Track Distribution & Stage Load */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Track Breakdown Card */}
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Innovation Track Distribution</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">32 Teams / Arena</span>
          </div>

          <div className="space-y-4">
            {Object.entries(stats.tracksBreakdown).map(([track, count]) => {
              const pct = Math.round((count / Math.max(stats.totalTeams, 1)) * 100);
              return (
                <div key={track} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-800 font-bold">{track}</span>
                    <span className="text-orange-600 font-bold tabular-nums">
                      {count} Teams ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage Operations & Throughput */}
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Stage Presentation Throughput</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">100% ON SCHEDULE</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {stages.map((st) => {
              const stageSlots = schedules.filter((s) => s.stageId === st.id);
              const comp = stageSlots.filter((s) => s.status === 'COMPLETED').length;
              const pct = Math.round((comp / Math.max(stageSlots.length, 1)) * 100);

              return (
                <div key={st.id} className="p-3.5 rounded-xl bg-[#faf7f2] border border-amber-100 space-y-2">
                  <div className="flex items-center justify-between text-slate-800 font-bold">
                    <span>{st.name} ({st.track})</span>
                    <span className="text-orange-600 tabular-nums">{comp} / {stageSlots.length} Done</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-sans">
                    <span>Operator: {st.operatorName}</span>
                    <span>Arena: {st.location.split('·')[0].trim()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
