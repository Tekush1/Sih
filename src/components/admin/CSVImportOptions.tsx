import React from 'react';
import { CSVTeamRecord } from '../../types';
import { Sparkles } from 'lucide-react';

interface CSVImportOptionsProps {
  parsedRecords: CSVTeamRecord[];
  importMode: 'replace' | 'append';
  setImportMode: (mode: 'replace' | 'append') => void;
  autoLaunchFirst: boolean;
  setAutoLaunchFirst: (val: boolean) => void;
}

export const CSVImportOptions: React.FC<CSVImportOptionsProps> = ({
  parsedRecords,
  importMode,
  setImportMode,
  autoLaunchFirst,
  setAutoLaunchFirst
}) => {
  if (parsedRecords.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-3">
      <div className="text-xs font-mono font-bold text-orange-900 uppercase flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-orange-600" />
        <span>Dataset Import Configuration</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <label className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
          importMode === 'replace' ? 'bg-white border-orange-500 shadow-xs ring-1 ring-orange-500' : 'bg-white/60 border-orange-200 hover:bg-white'
        }`}>
          <input
            type="radio"
            name="importMode"
            value="replace"
            checked={importMode === 'replace'}
            onChange={() => setImportMode('replace')}
            className="mt-0.5 text-orange-600 focus:ring-orange-500"
          />
          <div>
            <span className="font-bold text-slate-900 block">Clean Slate (Replace all data)</span>
            <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
              Purges mock data and loads strictly real CSV squads.
            </span>
          </div>
        </label>

        <label className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
          importMode === 'append' ? 'bg-white border-orange-500 shadow-xs ring-1 ring-orange-500' : 'bg-white/60 border-orange-200 hover:bg-white'
        }`}>
          <input
            type="radio"
            name="importMode"
            value="append"
            checked={importMode === 'append'}
            onChange={() => setImportMode('append')}
            className="mt-0.5 text-orange-600 focus:ring-orange-500"
          />
          <div>
            <span className="font-bold text-slate-900 block">Append to Existing Line</span>
            <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
              Updates matching squads and adds new squads to the lineup.
            </span>
          </div>
        </label>
      </div>

      <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 font-medium cursor-pointer">
        <input
          type="checkbox"
          checked={autoLaunchFirst}
          onChange={(e) => setAutoLaunchFirst(e.target.checked)}
          className="rounded text-orange-600 focus:ring-orange-500"
        />
        <span>Immediately send first squad ({parsedRecords[0]?.teamName || 'Squad 1'}) to Projector Screen</span>
      </label>
    </div>
  );
};
