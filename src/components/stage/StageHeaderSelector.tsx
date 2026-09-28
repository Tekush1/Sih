import React from 'react';
import { Stage } from '../../types';
import { MapPin } from 'lucide-react';

interface StageHeaderSelectorProps {
  stages: Stage[];
  currentStage: Stage;
  activeStageId: string;
  setActiveStageId: (id: string) => void;
}

export const StageHeaderSelector: React.FC<StageHeaderSelectorProps> = ({
  stages,
  currentStage,
  activeStageId,
  setActiveStageId
}) => {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-orange-600 font-bold mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>STAGE MARSHAL CONSOLE</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <span>{currentStage.name}</span>
          <span className="text-xs px-2.5 py-1 rounded bg-orange-100 border border-orange-200 text-orange-800 font-mono font-bold">
            {currentStage.track}
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          <span>{currentStage.location}</span>
          <span>·</span>
          <span className="font-medium text-slate-700">Marshal: {currentStage.operatorName}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {stages.map((st) => (
          <button
            key={st.id}
            onClick={() => setActiveStageId(st.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeStageId === st.id
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'bg-[#faf7f2] text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {st.name}
          </button>
        ))}
      </div>
    </div>
  );
};
