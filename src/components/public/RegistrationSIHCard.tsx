import React from 'react';
import { Globe, Search, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { SIHProblemStatement } from '../../data/sihProblemStatements';

interface RegistrationSIHCardProps {
  psIdInput: string;
  setPsIdInput: (val: string) => void;
  isFetchingSIH: boolean;
  handleFetchSIH: () => void;
  setIsSIHModalOpen: (val: boolean) => void;
  sihFeedback: { type: 'success' | 'error'; message: string; data?: SIHProblemStatement } | null;
}

export const RegistrationSIHCard: React.FC<RegistrationSIHCardProps> = ({
  psIdInput,
  setPsIdInput,
  isFetchingSIH,
  handleFetchSIH,
  setIsSIHModalOpen,
  sihFeedback
}) => {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-orange-50/70 via-white to-white border border-orange-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>sih.gov.in Live Data Fetcher</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-100 text-orange-800 font-bold">
                Smart India Hackathon
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Query official SIH database by PS ID to auto-populate title, description, and ministry.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSIHModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-orange-50 text-orange-700 text-xs font-mono font-bold border border-orange-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-2xs cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Browse All SIH PS</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <input
          type="text"
          placeholder="Enter SIH PS ID (e.g. SIH1601, SIH1609)..."
          value={psIdInput}
          onChange={(e) => setPsIdInput(e.target.value.toUpperCase())}
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 font-mono uppercase shadow-xs flex-1"
        />

        <button
          type="button"
          onClick={handleFetchSIH}
          disabled={isFetchingSIH || !psIdInput.trim()}
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-orange-600/20 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isFetchingSIH ? 'animate-spin' : ''}`} />
          <span>{isFetchingSIH ? 'Fetching...' : 'Fetch from sih.gov.in'}</span>
        </button>
      </div>

      {sihFeedback && (
        <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 font-mono ${
          sihFeedback.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {sihFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 leading-relaxed">
            <span className="font-semibold">{sihFeedback.message}</span>
            {sihFeedback.data && (
              <div className="mt-1 text-[11px] text-slate-700 font-sans">
                <strong>Active PS:</strong> {sihFeedback.data.title}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
