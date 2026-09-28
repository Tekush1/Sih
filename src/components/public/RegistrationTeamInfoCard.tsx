import React from 'react';
import { TeamTrack } from '../../types';
import { Sparkles } from 'lucide-react';

interface RegistrationTeamInfoCardProps {
  teamName: string;
  setTeamName: (val: string) => void;
  campus: string;
  setCampus: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  track: TeamTrack;
  setTrack: (val: TeamTrack) => void;
  psId: string;
  setPsId: (val: string) => void;
  sihOrg: string;
  setSihOrg: (val: string) => void;
  sihCategory: 'Software' | 'Hardware';
  setSihCategory: (val: 'Software' | 'Hardware') => void;
  problemStatement: string;
  setProblemStatement: (val: string) => void;
  abstract: string;
  setAbstract: (val: string) => void;
}

export const RegistrationTeamInfoCard: React.FC<RegistrationTeamInfoCardProps> = ({
  teamName,
  setTeamName,
  campus,
  setCampus,
  department,
  setDepartment,
  track,
  setTrack,
  psId,
  setPsId,
  sihOrg,
  setSihOrg,
  sihCategory,
  setSihCategory,
  problemStatement,
  setProblemStatement,
  abstract,
  setAbstract
}) => {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-600" />
          <span>Team &amp; College Information</span>
        </h3>
        <span className="text-xs font-mono font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200">
          TIT Internal Edition
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Team Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Titan AI Innovators"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-orange-500 font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">College Campus *</label>
          <select
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-orange-500 font-sans"
          >
            <option value="Technocrats Institute of Technology (Main Campus), Bhopal">Technocrats Institute of Technology (Main Campus), Bhopal</option>
            <option value="Technocrats Institute of Technology & Science (TIT&S), Bhopal">Technocrats Institute of Technology & Science (TIT&S), Bhopal</option>
            <option value="Technocrats Institute of Technology - Excellence, Bhopal">Technocrats Institute of Technology - Excellence, Bhopal</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">Problem Track *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['AI & Robotics', 'Web3 & Cloud', 'HealthTech & Bio', 'Smart Cities & IoT'] as TeamTrack[]).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTrack(t)}
              className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                track === t
                  ? 'bg-orange-50 border-orange-500 text-orange-700 font-extrabold shadow-2xs'
                  : 'bg-[#faf7f2] border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">SIH PS ID</label>
            <input
              type="text"
              value={psId}
              onChange={(e) => setPsId(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-orange-700 text-xs font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Ministry / Dept</label>
            <input
              type="text"
              value={sihOrg}
              onChange={(e) => setSihOrg(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Category</label>
            <select
              value={sihCategory}
              onChange={(e) => setSihCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs font-mono"
            >
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Problem Statement Title *</label>
          <input
            type="text"
            required
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-700 mb-1">Abstract &amp; Proposed Solution *</label>
          <textarea
            required
            rows={3}
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900"
          />
        </div>
      </div>
    </div>
  );
};
