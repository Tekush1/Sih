import React from 'react';
import { ShieldCheck, FolderSync, CheckCircle2 } from 'lucide-react';

interface AdminDashboardHeaderProps {
  handleSyncSheets: () => void;
  isSyncingSheets: boolean;
  resetToDefaultData: () => void;
  syncMessage: string;
  stats: {
    totalTeams: number;
    totalParticipants: number;
    pptApproved: number;
    completedPresentations: number;
  };
  pendingCount: number;
}

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  handleSyncSheets,
  isSyncingSheets,
  resetToDefaultData,
  syncMessage,
  stats,
  pendingCount
}) => {
  return (
    <>
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-600 font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>COMMAND CONSOLE · SIH 2026 INTERNAL</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">Smart Hackathon Operations Panel</h2>
          <p className="text-xs text-slate-500 mt-1">Presentation schedules, Drive vaults, and stage governance.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSyncSheets}
            disabled={isSyncingSheets}
            className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-mono font-bold text-orange-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <FolderSync className={`w-3.5 h-3.5 ${isSyncingSheets ? 'animate-spin' : ''}`} />
            <span>{isSyncingSheets ? 'Syncing...' : 'Sync Google Sheets'}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all teams, schedules, and logs to clean state?')) {
                resetToDefaultData();
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-mono font-bold text-rose-700 transition-colors"
          >
            Reset Seed Data
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-mono text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* 5-Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">TEAMS REGISTERED</span>
          <span className="text-2xl font-black font-mono text-slate-900 tabular-nums">{stats.totalTeams}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">DEVELOPERS</span>
          <span className="text-2xl font-black font-mono text-orange-600 tabular-nums">{stats.totalParticipants}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">PENDING PPT REVIEW</span>
          <span className="text-2xl font-black font-mono text-amber-600 tabular-nums">{pendingCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">APPROVED PPTS</span>
          <span className="text-2xl font-black font-mono text-emerald-600 tabular-nums">{stats.pptApproved}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">COMPLETED PITCHES</span>
          <span className="text-2xl font-black font-mono text-slate-900 tabular-nums">{stats.completedPresentations}</span>
        </div>
      </div>
    </>
  );
};
