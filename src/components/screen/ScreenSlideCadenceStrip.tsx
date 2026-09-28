import React from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';

interface ScreenSlideCadenceStripProps {
  currentSlideIndex: number;
  setScreenSlideIndex: (idx: number) => void;
  slideLabels: { label: string; time: string }[];
}

export const ScreenSlideCadenceStrip: React.FC<ScreenSlideCadenceStripProps> = ({
  currentSlideIndex,
  setScreenSlideIndex,
  slideLabels
}) => {
  return (
    <div className="px-6 sm:px-10 py-2 bg-slate-950/60 border-b border-slate-900 flex items-center justify-between text-xs font-mono overflow-x-auto gap-3 scrollbar-none">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] text-orange-400 font-bold uppercase mr-1 flex items-center gap-1">
          <Zap className="w-3 h-3 text-orange-500 animate-pulse" />
          AUTO-CADENCE:
        </span>
        {slideLabels.map((item, idx) => {
          const isActive = idx === currentSlideIndex;
          const isCompleted = idx < currentSlideIndex;
          return (
            <button
              key={idx}
              onClick={() => setScreenSlideIndex(idx)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-400/50 scale-105'
                  : isCompleted
                  ? 'bg-slate-900 border border-emerald-800/60 text-emerald-400'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              <span>0{idx + 1}</span>
              <span className="hidden md:inline font-sans font-medium text-[10px] opacity-90">{item.label}</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-black ${isActive ? 'bg-orange-950 text-orange-200' : 'bg-slate-800 text-slate-400'}`}>
                {item.time}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Auto-advance: <strong>Active</strong></span>
      </div>
    </div>
  );
};
