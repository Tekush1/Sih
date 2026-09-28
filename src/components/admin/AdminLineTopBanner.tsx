import React from 'react';
import { Sliders, FileSpreadsheet, Plus, Trash2, Tv, MonitorPlay } from 'lucide-react';

interface AdminLineTopBannerProps {
  onOpenCSV: () => void;
  onOpenInsert: () => void;
  onClearAll: () => void;
  onOpenProjectorPopup: () => void;
  onSwitchToScreen: () => void;
}

export const AdminLineTopBanner: React.FC<AdminLineTopBannerProps> = ({
  onOpenCSV,
  onOpenInsert,
  onClearAll,
  onOpenProjectorPopup,
  onSwitchToScreen
}) => {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-1">
          <Sliders className="w-4 h-4 text-orange-600" />
          <span>STAGE CONTROLLER · ADMIN QUEUE MANAGER</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Presentation Line &amp; Projector Controller
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Insert teams into the lineup, reorder the line, and control the screen countdown timer &amp; PPT slides.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenCSV}
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-orange-600/25 cursor-pointer ring-2 ring-orange-400/30"
        >
          <FileSpreadsheet className="w-4 h-4 stroke-[3]" />
          <span>Insert CSV File</span>
        </button>

        <button
          onClick={onOpenInsert}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-orange-50 border-2 border-orange-500/60 text-orange-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-orange-600 stroke-[3]" />
          <span>Insert Team into Line</span>
        </button>

        <button
          onClick={onClearAll}
          className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear Data</span>
        </button>

        <button
          onClick={onOpenProjectorPopup}
          className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Tv className="w-4 h-4 text-slate-600" />
          <span>Popup Screen</span>
        </button>

        <button
          onClick={onSwitchToScreen}
          className="px-4 py-2.5 rounded-xl bg-[#faf7f2] hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <MonitorPlay className="w-4 h-4 text-slate-700" />
          <span>Switch to Screen View</span>
        </button>
      </div>
    </div>
  );
};
