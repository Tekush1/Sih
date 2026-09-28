import React, { useState, useMemo } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Team, TeamTrack } from '../../types';
import { Search, FileSpreadsheet } from 'lucide-react';
import { QRPassModal } from '../qr/QRPassModal';
import { CSVUploadModal } from '../admin/CSVUploadModal';
import { TeamDetailModal } from './TeamDetailModal';
import { TeamCard } from './TeamCard';

interface TeamsDirectoryProps {
  initialTrack?: TeamTrack | null;
  onOpenTeamPortal?: (teamId: string) => void;
}

export const TeamsDirectory: React.FC<TeamsDirectoryProps> = ({ initialTrack, onOpenTeamPortal }) => {
  const { teams, stages } = useHackathon();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrack, setSelectedTrack] = useState<string>(initialTrack || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedTeamModal, setSelectedTeamModal] = useState<Team | null>(null);
  const [qrPassTeam, setQrPassTeam] = useState<Team | null>(null);
  const [showCSVModal, setShowCSVModal] = useState<boolean>(false);

  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.college.toLowerCase().includes(q) ||
        t.leaderName.toLowerCase().includes(q) ||
        (t.psId && t.psId.toLowerCase().includes(q)) ||
        (t.sihOrganization && t.sihOrganization.toLowerCase().includes(q)) ||
        t.problemStatement.toLowerCase().includes(q);

      const matchesTrack = selectedTrack === 'ALL' || t.track === selectedTrack;

      let matchesStatus = true;
      if (selectedStatus === 'APPROVED') {
        matchesStatus = t.submission?.status === 'APPROVED';
      } else if (selectedStatus === 'COMPLETED') {
        matchesStatus = t.scheduledSlot?.status === 'COMPLETED';
      } else if (selectedStatus === 'UNDER_REVIEW') {
        matchesStatus = t.submission?.status === 'UNDER_REVIEW';
      }

      return matchesSearch && matchesTrack && matchesStatus;
    });
  }, [teams, searchQuery, selectedTrack, selectedStatus]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-orange-600 mb-2">
            <span>04. PARTICIPATING SQUADS</span>
            <span className="text-orange-300">·</span>
            <span className="text-[#b47e3a]">TECHNOCRATS INSTITUTE OF TECHNOLOGY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
            Teams Directory ({teams.length} Teams)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Browse registered teams with official SIH Problem Statement IDs.
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by PS ID, Team ID, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-sans shadow-xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl text-xs shadow-xs">
          {['ALL', 'AI & Robotics', 'Web3 & Cloud', 'HealthTech & Bio', 'Smart Cities & IoT'].map((tr) => (
            <button
              key={tr}
              onClick={() => setSelectedTrack(tr)}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                selectedTrack === tr ? 'bg-orange-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 font-semibold">Status:</span>
          {['ALL', 'APPROVED', 'UNDER_REVIEW', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                selectedStatus === st ? 'bg-orange-50 text-orange-700 border border-orange-300' : 'text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border-2 border-dashed border-orange-300/80 space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">No Squads Registered Yet</h3>
            <p className="text-xs text-slate-600">Insert your CSV file or use the registration form to add teams.</p>
          </div>
          <button
            onClick={() => setShowCSVModal(true)}
            className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm flex items-center gap-2 mx-auto cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Insert CSV File Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.slice(0, 48).map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              stages={stages}
              onSelect={setSelectedTeamModal}
              onOpenQR={setQrPassTeam}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <TeamDetailModal
        team={selectedTeamModal}
        stages={stages}
        onClose={() => setSelectedTeamModal(null)}
        onOpenTeamPortal={onOpenTeamPortal}
      />

      {qrPassTeam && (
        <QRPassModal
          team={qrPassTeam}
          stage={stages.find((s) => s.id === qrPassTeam.stageId)}
          onClose={() => setQrPassTeam(null)}
        />
      )}

      <CSVUploadModal isOpen={showCSVModal} onClose={() => setShowCSVModal(false)} />
    </section>
  );
};
