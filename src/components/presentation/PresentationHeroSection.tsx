import React from 'react';
import { Play, FileSpreadsheet, ShieldCheck, Globe } from 'lucide-react';

interface PresentationHeroSectionProps {
  onLaunchPresentation: (teamId: string, stageId: string) => void;
  onNavigate: (tab: string) => void;
  onOpenSIHModal: () => void;
}

export const PresentationHeroSection: React.FC<PresentationHeroSectionProps> = ({
  onLaunchPresentation,
  onNavigate,
  onOpenSIHModal
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-gradient-to-b from-[#fffdfa] via-[#faf7f2] to-[#f5efe6]">
      <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 border border-orange-300/80 text-orange-800 text-xs font-bold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
          <span className="tracking-wide uppercase font-mono">
            SIH 2026 INTERNAL STAGE PITCH &amp; EVALUATION SYSTEM
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0f172a]">
            Technocrats Institute of Technology
          </h1>
          <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#b47e3a]">
            6-Minute Stage Pitch &amp; Screen Engine
          </div>
        </div>

        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Automated 6-slide countdown (60s/slide), deterministic 4-stage arena scheduling, live SIH 2026 problem statement validation, digital QR passes, and synchronized projector screen displays.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => onLaunchPresentation('SH26-001', 'stage-alpha')}
            className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2 cursor-pointer group"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>Launch Live Stage Presentation</span>
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-orange-500/60 text-orange-700 font-bold text-sm sm:text-base transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-orange-600" />
            <span>Admin Line &amp; CSV Upload</span>
          </button>

          <button
            onClick={() => onNavigate('stage-portal')}
            className="px-5 py-3.5 rounded-2xl bg-[#faf7f2] hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <span>Stage Marshal Console</span>
          </button>

          <button
            onClick={onOpenSIHModal}
            className="px-5 py-3.5 rounded-2xl bg-[#faf7f2] hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Lookup SIH PS IDs</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6">
          <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">CADENCE</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-orange-600">6:00 MIN</span>
            <span className="text-[10px] text-slate-400 block font-mono">Strict 60s per slide</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">STAGES</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">4 ARENAS</span>
            <span className="text-[10px] text-slate-400 block font-mono">Simultaneous evaluation</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">LINEUP</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">SCHEDULED</span>
            <span className="text-[10px] text-slate-400 block font-mono">100% SIH mapped</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">RUBRIC</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600">100 PTS</span>
            <span className="text-[10px] text-slate-400 block font-mono">SIH core pillars</span>
          </div>
        </div>
      </div>
    </section>
  );
};
