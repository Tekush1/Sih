import React, { useState, useMemo } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Team, TeamTrack } from '../../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Clock3, 
  Folder, 
  QrCode, 
  X, 
  ArrowUpRight,
  ExternalLink,
  Users,
  Globe,
  Building2,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { QRPassModal } from '../qr/QRPassModal';
import { CSVUploadModal } from '../admin/CSVUploadModal';

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
            TIT Bhopal Teams Directory ({teams.length} Teams)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Browse through 128 registered teams from Technocrats Institute of Technology with official SIH Problem Statement IDs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by PS ID (SIH1601), Team ID, name, branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-sans shadow-xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        {/* Track Filter */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl text-xs shadow-xs">
          {['ALL', 'AI & Robotics', 'Web3 & Cloud', 'HealthTech & Bio', 'Smart Cities & IoT'].map((tr) => (
            <button
              key={tr}
              onClick={() => setSelectedTrack(tr)}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold whitespace-nowrap cursor-pointer ${
                selectedTrack === tr
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 font-semibold">Status:</span>
          {['ALL', 'APPROVED', 'UNDER_REVIEW', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-bold ${
                selectedStatus === st
                  ? 'bg-orange-50 text-orange-700 border border-orange-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Teams Grid or Empty State */}
      {filteredTeams.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border-2 border-dashed border-orange-300/80 space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto shadow-sm">
            <FileSpreadsheet className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">No Squads Registered Yet</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dummy data has been cleared. Insert your real CSV file containing <strong>Team Name</strong>, <strong>Track</strong>, and <strong>Google Drive Link</strong> to populate the directory.
            </p>
          </div>

          <button
            onClick={() => setShowCSVModal(true)}
            className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm flex items-center gap-2 mx-auto shadow-lg shadow-orange-600/25 cursor-pointer ring-2 ring-orange-400/40"
          >
            <FileSpreadsheet className="w-4 h-4 stroke-[3]" />
            <span>Insert CSV File Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.slice(0, 48).map((team) => {
            const isApproved = team.submission?.status === 'APPROVED';
            const isCompleted = team.scheduledSlot?.status === 'COMPLETED';
            const isPresenting = team.scheduledSlot?.status === 'IN_PROGRESS';
            const assignedStage = stages.find((s) => s.id === team.stageId);

            return (
              <div
                key={team.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer shadow-xs"
                onClick={() => setSelectedTeamModal(team)}
              >
                <div>
                  {/* Card Top: ID and Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-800 font-mono text-xs font-bold">
                        {team.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[11px] font-bold">
                        {team.psId || 'SIH1609'}
                      </span>
                    </div>

                    <span className="text-xs font-mono">
                      {isPresenting ? (
                        <span className="text-orange-600 font-bold animate-pulse flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" /> PRESENTING
                        </span>
                      ) : isCompleted ? (
                        <span className="text-emerald-700 font-bold">COMPLETED</span>
                      ) : isApproved ? (
                        <span className="text-blue-700 font-bold">APPROVED</span>
                      ) : (
                        <span className="text-slate-400">UNDER REVIEW</span>
                      )}
                    </span>
                  </div>

                  {/* Team Name & College */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                    {team.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{team.college}</span>
                  </p>

                  {/* Ministry / Org Tag */}
                  {team.sihOrganization && (
                    <p className="text-[11px] text-orange-700 font-mono font-medium mt-1.5 truncate">
                      🏛 {team.sihOrganization}
                    </p>
                  )}

                  {/* Problem Statement Snippet */}
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed font-sans">
                    {team.problemStatement}
                  </p>
                </div>

                {/* Card Bottom Meta */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-orange-700 font-bold truncate max-w-[150px]">{team.track}</span>
                    <span className="font-mono text-slate-600 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {team.scheduledSlot?.startTime || '14:00'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-slate-500 truncate">
                      {assignedStage?.name || 'Stage Alpha'}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {team.qrPass && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQrPassTeam(team);
                          }}
                          title="View Digital QR Pass"
                          className="p-1 rounded text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-colors cursor-pointer"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      )}
                      <span className="text-orange-600 text-xs font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Details <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredTeams.length > 48 && (
        <div className="text-center text-xs text-slate-500 font-mono pt-4">
          Showing 48 of {filteredTeams.length} matching teams. Use search to filter specific squads or SIH PS IDs.
        </div>
      )}

      {/* Team Detail Modal with SIH & TIT metadata */}
      {selectedTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-orange-600 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-800 font-bold">
                    {selectedTeamModal.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                    PS ID: {selectedTeamModal.psId || 'SIH1609'}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-700 font-bold">{selectedTeamModal.track}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedTeamModal.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-orange-600" />
                  <span>{selectedTeamModal.college}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedTeamModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ministry & Problem Statement */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-orange-700 font-bold">
                  GOVERNMENT MINISTRY / ORGANIZATION:
                </span>
                <span className="text-slate-800 font-medium">
                  {selectedTeamModal.sihOrganization || 'Ministry of Education / AICTE'}
                </span>
              </div>

              <h4 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider">
                SIH PROBLEM STATEMENT FOCUS
              </h4>
              <p className="text-sm text-slate-800 font-medium leading-relaxed bg-[#faf7f2] p-4 rounded-xl border border-amber-100">
                {selectedTeamModal.problemStatement}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedTeamModal.abstract}
              </p>

              {(selectedTeamModal.submission?.googleDriveFileUrl || selectedTeamModal.googleDriveFolder) && (
                <div className="pt-1">
                  <a
                    href={selectedTeamModal.submission?.googleDriveFileUrl || selectedTeamModal.googleDriveFolder}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-mono font-medium transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Pitch Deck on Google Drive</span>
                  </a>
                </div>
              )}
            </div>

            {/* Squad Members */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider">
                TIT BHOPAL SQUAD MEMBERS (4-6 STUDENTS)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#faf7f2] border border-amber-100">
                  <div className="flex items-center justify-between font-mono text-[11px] text-orange-700 font-bold">
                    <span>LEADER</span>
                    <span>PRIMARY</span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{selectedTeamModal.leaderName}</div>
                  <div className="text-slate-500 text-[11px]">{selectedTeamModal.leaderEmail}</div>
                </div>

                {selectedTeamModal.members.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#faf7f2] border border-amber-100">
                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 font-bold">
                      <span>MEMBER {idx + 2}</span>
                      <span className="text-blue-700">{m.specialization}</span>
                    </div>
                    <div className="font-bold text-slate-900 mt-1">{m.name}</div>
                    <div className="text-slate-500 text-[11px]">{m.email}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Presentation Slot info */}
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-500 block font-medium">STAGE VENUE</span>
                <span className="text-slate-900 font-bold">
                  {stages.find((s) => s.id === selectedTeamModal.stageId)?.name || 'Stage Alpha'} (TIT Campus)
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block font-medium">SLOT TIME</span>
                <span className="text-orange-700 font-bold">
                  {selectedTeamModal.scheduledSlot?.startTime || '14:00'} (6 Mins)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              {onOpenTeamPortal && (
                <button
                  onClick={() => {
                    onOpenTeamPortal(selectedTeamModal.id);
                    setSelectedTeamModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Open Team Portal
                </button>
              )}
              <button
                onClick={() => setSelectedTeamModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Pass Modal */}
      {qrPassTeam && (
        <QRPassModal
          team={qrPassTeam}
          stage={stages.find((s) => s.id === qrPassTeam.stageId)}
          onClose={() => setQrPassTeam(null)}
        />
      )}

      {/* CSV Upload Modal */}
      <CSVUploadModal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
      />
    </section>
  );
};
