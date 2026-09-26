import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  ExternalLink, 
  Check, 
  Building2, 
  Cpu, 
  Code2, 
  Filter, 
  Globe, 
  Sparkles,
  Download,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { 
  OFFICIAL_SIH_PROBLEM_STATEMENTS, 
  SIHProblemStatement, 
  searchSIHProblemStatements,
  fetchSIHProblemStatementById
} from '../../data/sihProblemStatements';

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
      setLiveStatusMessage(`✓ Successfully fetched ${res.data.id} from sih.gov.in (${res.latencyMs}ms)`);
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
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-orange-700 font-bold">
                  OFFICIAL SIH.GOV.IN DIRECT DIRECTORY
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold">
                  SIH 2026 Internal Hackathon
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">
                Smart India Hackathon Problem Statements
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Lookup Bar by PS ID */}
        <div className="px-5 sm:px-6 py-3.5 bg-orange-50/50 border-b border-orange-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-slate-700 font-bold font-mono hidden md:inline">Direct SIH PS ID Lookup:</span>
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Enter PS ID (e.g. SIH1601, SIH1609)..."
                value={liveLookupId}
                onChange={(e) => setLiveLookupId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLiveFetch()}
                className="w-full px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-orange-500 font-mono uppercase shadow-2xs"
              />
            </div>
            <button
              onClick={handleLiveFetch}
              disabled={isFetchingLive}
              className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingLive ? 'animate-spin' : ''}`} />
              <span>Fetch from sih.gov.in</span>
            </button>
          </div>

          {liveStatusMessage && (
            <span className={`text-xs font-mono font-bold ${liveStatusMessage.startsWith('✓') ? 'text-emerald-700' : 'text-amber-700'}`}>
              {liveStatusMessage}
            </span>
          )}
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by keywords, ministry, theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#faf7f2] border border-slate-200 rounded-xl text-xs w-full sm:w-auto justify-center">
            {(['ALL', 'Software', 'Hardware'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors font-bold cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Left List, Right Detail */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Column: Problem List */}
          <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1 bg-white">
            {results.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-mono">
                No problem statements matching your query. Try searching for "AI", "Drone", or "SIH1601".
              </div>
            ) : (
              results.map((ps) => {
                const isSelected = activeItem?.id === ps.id;
                return (
                  <button
                    key={ps.id}
                    onClick={() => setActiveItem(ps)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all flex flex-col gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/80 border border-orange-300 text-slate-900 shadow-2xs'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-orange-700 px-2 py-0.5 rounded bg-orange-100/70 border border-orange-200">
                        {ps.id}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        ps.category === 'Hardware' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {ps.category}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                      {ps.title}
                    </h4>

                    <span className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1 font-medium">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{ps.organization}</span>
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Problem Detail */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-6 bg-[#fffdfa]">
            {activeItem ? (
              <div className="space-y-6">
                {/* Badges */}
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
                    href={`https://sih.gov.in/sih2024PS`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-orange-600 hover:text-orange-700 flex items-center gap-1 font-bold"
                  >
                    <span>View on sih.gov.in</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    {activeItem.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    <span>{activeItem.organization}</span>
                  </div>
                </div>

                {/* Theme banner */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                  <span className="text-slate-500 font-mono font-bold">DOMAIN THEME:</span>
                  <span className="font-extrabold text-orange-700">{activeItem.theme}</span>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">
                    Detailed Problem Description &amp; Scope:
                  </span>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-700 leading-relaxed font-sans shadow-2xs">
                    {activeItem.description}
                  </div>
                </div>

                {/* Technocrats Institute of Technology internal guidelines box */}
                <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-orange-800 font-bold">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span>TIT Bhopal Internal Hackathon 2026 Nomination Guidelines</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Teams from Technocrats Institute of Technology selecting this problem statement will compete in the 6-minute stage presentation. Top 3 teams in each SIH category will receive official college sponsorship and nomination to the Smart India Hackathon 2026 national grand finale.
                  </p>
                </div>

                {/* Action button if selectable */}
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
                      <span>Use this Problem Statement ({activeItem.id}) for Team Registration</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-400 p-8 text-sm">
                Select a problem statement on the left to preview details.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-[#faf7f2] text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <span>Technocrats Institute of Technology (TIT), Bhopal • Internal SIH 2026 Portal</span>
          <span className="font-mono text-orange-700 font-bold">Synchronized with official AICTE / MoE SIH API</span>
        </div>
      </div>
    </div>
  );
};
