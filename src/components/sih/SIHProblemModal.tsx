import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Building2, 
  Globe, 
  RefreshCw 
} from 'lucide-react';
import { 
  OFFICIAL_SIH_PROBLEM_STATEMENTS, 
  SIHProblemStatement, 
  searchSIHProblemStatements,
  fetchSIHProblemStatementById
} from '../../data/sihProblemStatements';
import { SIHProblemDetailPane } from './SIHProblemDetailPane';

interface SIHProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (ps: SIHProblemStatement) => void;
  initialSelectedId?: string;
}

export const SIHProblemModal: React.FC<SIHProblemModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialSelectedId
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'Software' | 'Hardware'>('ALL');
  const [results, setResults] = useState<SIHProblemStatement[]>(OFFICIAL_SIH_PROBLEM_STATEMENTS);
  const [activeItem, setActiveItem] = useState<SIHProblemStatement>(
    OFFICIAL_SIH_PROBLEM_STATEMENTS.find((p) => p.id === initialSelectedId) || OFFICIAL_SIH_PROBLEM_STATEMENTS[0]
  );
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [liveLookupId, setLiveLookupId] = useState<string>('');
  const [liveStatusMessage, setLiveStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    searchSIHProblemStatements(searchQuery, selectedCategory).then((data) => {
      if (isMounted) setResults(data);
    });
    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleLiveFetch = async () => {
    if (!liveLookupId.trim()) return;
    setIsFetchingLive(true);
    setLiveStatusMessage(null);

    const res = await fetchSIHProblemStatementById(liveLookupId.trim());
    setIsFetchingLive(false);

    if (res.status === 'SUCCESS' && res.data) {
      setActiveItem(res.data);
      setLiveStatusMessage(`✓ Fetched ${res.data.id} (${res.latencyMs}ms)`);
      if (!results.some((r) => r.id === res.data!.id)) {
        setResults((prev) => [res.data!, ...prev]);
      }
    } else {
      setLiveStatusMessage(res.message || 'Problem statement ID not found.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-[#faf7f2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-orange-700 font-bold block">
                OFFICIAL SIH.GOV.IN DIRECTORY
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">
                Smart India Hackathon Problem Statements
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Lookup Bar */}
        <div className="px-5 sm:px-6 py-3 bg-orange-50/50 border-b border-orange-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-slate-700 font-bold font-mono hidden md:inline">PS ID Lookup:</span>
            <input
              type="text"
              placeholder="Enter PS ID (e.g. SIH1601)..."
              value={liveLookupId}
              onChange={(e) => setLiveLookupId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLiveFetch()}
              className="w-full max-w-sm px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-mono uppercase"
            />
            <button
              onClick={handleLiveFetch}
              disabled={isFetchingLive}
              className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingLive ? 'animate-spin' : ''}`} />
              <span>Fetch</span>
            </button>
          </div>
          {liveStatusMessage && <span className="text-xs font-mono font-bold text-emerald-700">{liveStatusMessage}</span>}
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by keywords, theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs sm:text-sm text-slate-900"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#faf7f2] border border-slate-200 rounded-xl text-xs">
            {(['ALL', 'Software', 'Hardware'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                  selectedCategory === cat ? 'bg-orange-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Body Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1 bg-white">
            {results.map((ps) => {
              const isSelected = activeItem?.id === ps.id;
              return (
                <button
                  key={ps.id}
                  onClick={() => setActiveItem(ps)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all flex flex-col gap-1.5 cursor-pointer ${
                    isSelected ? 'bg-orange-50/80 border border-orange-300 text-slate-900' : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded">{ps.id}</span>
                    <span className="text-[10px] text-blue-800 bg-blue-100 px-2 py-0.5 rounded">{ps.category}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">{ps.title}</h4>
                  <span className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{ps.organization}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="md:col-span-7 p-6 overflow-y-auto space-y-6 bg-[#fffdfa]">
            <SIHProblemDetailPane activeItem={activeItem} onSelect={onSelect} onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};
