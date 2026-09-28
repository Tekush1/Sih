import React from 'react';
import { FileSpreadsheet, ExternalLink, Plus, Trash2, Monitor } from 'lucide-react';

interface AdminLineBannerProps {
  onOpenCSV: () => void;
  onOpenInsert: () => void;
  onOpenOfflineDecks?: () => void;
  onClearData: () => void;
  onOpenPopup: () => void;
  onSwitchToScreen: () => void;
  totalTeamsCount: number;
}

export const AdminLineBanner: React.FC<AdminLineBannerProps> = ({
  onOpenCSV,
  onOpenInsert,
  onClearData,
  onOpenPopup,
  onSwitchToScreen,
  totalTeamsCount
}) => {
  return (
    <div className="p-6 md:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>STAGE LINEUP &amp; STANDINGS ({totalTeamsCount} SQUADS)</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Squad Standings &amp; Presentation Lineup
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage presentation standings, launch teams on screen, or import lineup via CSV.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenCSV}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-orange-600/20 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
          <span>Insert Teams via CSV</span>
        </button>

        <button
          onClick={onOpenPopup}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          title="Open Auditorium Screen in new pop-up window"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Pop Screen ↗</span>
        </button>

        <button
          onClick={onSwitchToScreen}
          className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Monitor className="w-4 h-4 text-slate-600" />
          <span>View Screen</span>
        </button>

        <button
          onClick={onOpenInsert}
          className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-orange-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-orange-600 stroke-[2.5]" />
          <span>Add Team</span>
        </button>

        {totalTeamsCount > 0 && (
          <button
            onClick={onClearData}
            className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-colors cursor-pointer"
            title="Clear all teams"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
