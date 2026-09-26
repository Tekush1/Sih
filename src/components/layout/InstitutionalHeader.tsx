import React from 'react';
import { Sparkles, ArrowRight, Play, Trophy, Sliders, Tv } from 'lucide-react';

interface InstitutionalHeaderProps {
  onScreenClick: () => void;
  onAdminClick: () => void;
}

export const InstitutionalHeader: React.FC<InstitutionalHeaderProps> = ({
  onScreenClick,
  onAdminClick,
}) => {
  return (
    <div className="bg-white border-b border-slate-200/90 text-slate-800">
      {/* Top 3px Indian saffron orange line */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 w-full" />

      {/* Main logo strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Official Government & Institutional Logos */}
        <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto py-1 scrollbar-none">
          {/* Logo 1: Ministry of Education */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-9 flex flex-col items-center justify-center">
              <svg viewBox="0 0 24 28" className="w-7 h-7 text-slate-800 fill-current" aria-label="National Emblem of India">
                <path d="M12 1L10 4H14L12 1Z" />
                <circle cx="12" cy="7" r="3" />
                <path d="M7 11C7 9.5 9 8 12 8C15 8 17 9.5 17 11V16H7V11Z" />
                <rect x="5" y="16" width="14" height="2" rx="0.5" />
                <circle cx="12" cy="17" r="1" className="fill-orange-600" />
                <path d="M6 18L4 24H20L18 18H6Z" />
                <rect x="3" y="24" width="18" height="2" rx="0.5" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-[10px] font-semibold text-slate-600 tracking-tight">शिक्षा मंत्रालय</div>
              <div className="text-[11px] font-bold text-slate-900 tracking-tight uppercase">MINISTRY OF</div>
              <div className="text-[11px] font-black text-slate-900 tracking-wider uppercase">EDUCATION</div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block shrink-0" />

          {/* Logo 2: MoE's Innovation Cell */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center p-0.5 shadow-xs">
              <svg viewBox="0 0 32 32" className="w-6 h-6">
                <circle cx="16" cy="16" r="14" fill="#1e3a8a" opacity="0.1" />
                <path d="M16 6A10 10 0 0 0 6 16C6 21.5 10.5 26 16 26A10 10 0 0 0 26 16" fill="none" stroke="#ea580c" strokeWidth="3" strokeDasharray="4 2" />
                <circle cx="16" cy="16" r="6" fill="#1e40af" />
                <path d="M14 13L19 16L14 19Z" fill="#ffffff" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-[10px] font-bold text-slate-800">
                MoE's
              </div>
              <div className="text-[10px] font-extrabold text-blue-900 tracking-tight uppercase">
                INNOVATION CELL
              </div>
              <div className="text-[8px] text-slate-500 uppercase tracking-tight">
                (GOVERNMENT OF INDIA)
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden md:block shrink-0" />

          {/* Logo 3: Institution's Innovation Council (IIC) */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-7 h-7">
                <circle cx="10" cy="12" r="3" fill="#ea580c" />
                <circle cx="22" cy="12" r="3" fill="#0284c7" />
                <circle cx="16" cy="8" r="3.5" fill="#f59e0b" />
                <path d="M8 24C8 18 16 18 16 24" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M16 24C16 18 24 18 24 24" stroke="#0284c7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="text-[9px] font-bold text-orange-600 tracking-tight uppercase">
                INSTITUTION'S
              </div>
              <div className="text-[10px] font-extrabold text-blue-900 tracking-tight uppercase">
                INNOVATION COUNCIL
              </div>
              <div className="text-[8px] text-slate-500 uppercase">
                (Ministry of Education Initiative)
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden lg:block shrink-0" />

          {/* Logo 4: INCUBATION TITE */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-900 to-cyan-500 flex items-center justify-center text-white shadow-xs">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-[11px] font-extrabold text-blue-950 tracking-tight">
                INCUBATION <span className="text-orange-600">TITE</span>
              </div>
              <div className="text-[8px] font-bold text-slate-500 tracking-widest uppercase">
                PRESENTATION HUB
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden xl:block shrink-0" />

          {/* Logo 5: TIT EXCELLENCE Crest */}
          <div className="flex items-center gap-2 shrink-0 hidden md:flex">
            <div className="w-8 h-8 rounded-full bg-red-900/10 border border-red-900/30 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-5 h-5 text-red-800 fill-current">
                <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 6L18 11H23L19 14L21 19L16 16L11 19L13 14L9 11H14L16 6Z" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-[10px] font-extrabold text-red-900 tracking-tight">
                TIT EXCELLENCE
              </div>
              <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                BHOPAL · ESTD 2007
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Two Requested Portals Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onAdminClick}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 border-orange-500 hover:border-orange-600 text-orange-600 hover:text-orange-700 bg-white hover:bg-orange-50 font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Admin Line Portal</span>
          </button>

          <button
            onClick={onScreenClick}
            className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Screen Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
