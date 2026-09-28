import React from 'react';
import { Team } from '../../types';
import { Search, Play, ArrowRight } from 'lucide-react';

interface PresentationQuickFinderProps {
  teams: Team[];
  searchPSId: string;
  setSearchPSId: (query: string) => void;
  onLaunchPresentation: (teamId: string, stageId: string) => void;
  onSelectPreview: (teamId: string) => void;
  onNavigate: (tab: string) => void;
}

export const PresentationQuickFinder: React.FC<PresentationQuickFinderProps> = ({
  teams,
  searchPSId,
  setSearchPSId,
  onLaunchPresentation,
  onSelectPreview,
  onNavigate
}) => {
  const filteredQuickTeams = teams.filter((t) => {
    if (!searchPSId.trim()) return true;
    const query = searchPSId.toLowerCase();
    return (
      t.id.toLowerCase().includes(query) ||
      t.name.toLowerCase().includes(query) ||
      (t.psId && t.psId.toLowerCase().includes(query)) ||
      t.problemStatement.toLowerCase().includes(query) ||
      t.college.toLowerCase().includes(query)
    );
  }).slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-0.5">
              <Search className="w-3.5 h-3.5" />
              <span>QUICK PRESENTATION DECK FINDER</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Search Team Decks by SIH Problem Statement ID
            </h3>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Enter PS ID (e.g. SIH1601, SIH1609) or team..."
              value={searchPSId}
              onChange={(e) => setSearchPSId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-mono shadow-2xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuickTeams.map((team) => (
            <div
              key={team.id}
              className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/90 hover:border-orange-300 transition-all space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded border border-orange-200">
                  {team.id}
                </span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  PS: {team.psId || 'SIH1609'}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{team.name}</h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">Leader: {team.leaderName}</p>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-medium">{team.problemStatement}</p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onLaunchPresentation(team.id, team.stageId || 'stage-alpha')}
                  className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Present</span>
                </button>

                <button
                  onClick={() => onSelectPreview(team.id)}
                  className="px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('teams')}
            className="text-xs font-mono font-bold text-orange-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All Competing Teams</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
