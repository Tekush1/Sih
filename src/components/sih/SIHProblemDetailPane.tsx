import React from 'react';
import { SIHProblemStatement } from '../../data/sihProblemStatements';
import { Building2, ExternalLink, Sparkles, Check } from 'lucide-react';

interface SIHProblemDetailPaneProps {
  activeItem?: SIHProblemStatement;
  onSelect?: (ps: SIHProblemStatement) => void;
  onClose: () => void;
}

export const SIHProblemDetailPane: React.FC<SIHProblemDetailPaneProps> = ({
  activeItem,
  onSelect,
  onClose
}) => {
  if (!activeItem) {
    return (
      <div className="text-center text-slate-400 p-8 text-sm">
        Select a problem statement on the left to preview details.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-orange-100 border border-orange-200 text-orange-800 font-mono font-bold text-sm">
            {activeItem.id}
          </span>
          <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${
            activeItem.category === 'Hardware'
              ? 'bg-amber-100 border border-amber-300 text-amber-800'
              : 'bg-blue-100 border border-blue-300 text-blue-800'
          }`}>
            {activeItem.category} Edition
          </span>
        </div>

        <a
          href="https://sih.gov.in/sih2024PS"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono text-orange-600 hover:text-orange-700 flex items-center gap-1 font-bold"
        >
          <span>View on sih.gov.in</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
          {activeItem.title}
        </h3>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Building2 className="w-4 h-4 text-orange-600" />
          <span>{activeItem.organization}</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
        <span className="text-slate-500 font-mono font-bold">DOMAIN THEME:</span>
        <span className="font-extrabold text-orange-700">{activeItem.theme}</span>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">
          Detailed Problem Description &amp; Scope:
        </span>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-700 leading-relaxed font-sans shadow-2xs">
          {activeItem.description}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs space-y-2">
        <div className="flex items-center gap-2 text-orange-800 font-bold">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <span>TIT Bhopal Internal Hackathon 2026 Guidelines</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Teams selecting this problem statement will compete in the 6-minute presentation. Top teams receive institutional sponsorship to national SIH 2026.
        </p>
      </div>

      {onSelect && (
        <div className="pt-2">
          <button
            onClick={() => {
              onSelect(activeItem);
              onClose();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Use this Problem Statement ({activeItem.id})</span>
          </button>
        </div>
      )}
    </div>
  );
};
