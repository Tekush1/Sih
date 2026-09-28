import React from 'react';
import { FileSpreadsheet, ExternalLink, Sliders, Monitor } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenCSVUpload?: () => void;
  onPopScreen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenCSVUpload,
  onPopScreen
}) => {
  const handlePopScreen = () => {
    if (onPopScreen) {
      onPopScreen();
    } else {
      const url = `${window.location.origin}${window.location.pathname}?portal=screen`;
      window.open(url, 'AuditoriumScreen', 'width=1280,height=720,menubar=no,toolbar=no');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-slate-900 uppercase leading-none">
              Smart Hackathon 2026
            </span>
            <span className="text-[11px] font-bold text-orange-600 tracking-wide mt-0.5">
              Technocrats Institute of Technology (TIT), Bhopal
            </span>
          </div>
        </div>

        {/* View Switcher: Standings & Lineup vs Live Auditorium */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            onClick={() => onNavigate('admin')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'admin'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Standings &amp; Lineup</span>
          </button>
          <button
            onClick={() => onNavigate('screen')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'screen'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Live on Auditorium</span>
          </button>
        </div>

        {/* Action Buttons: Pop Screen & Insert CSV */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCSVUpload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white transition-all cursor-pointer shadow-xs"
            title="Upload squads using CSV"
          >
            <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
            <span>Insert CSV</span>
          </button>

          <button
            onClick={handlePopScreen}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all cursor-pointer shadow-xs"
            title="Open Auditorium Screen in Pop-up Window"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Pop Screen ↗</span>
          </button>
        </div>
      </div>
    </header>
  );
};
