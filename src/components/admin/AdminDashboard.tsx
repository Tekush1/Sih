import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Team, SlideData, ScheduleSlot } from '../../types';
import { 
  Users, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye, 
  Calendar, 
  RefreshCw, 
  FolderSync, 
  ShieldCheck, 
  ArrowUpDown, 
  Sliders, 
  Sparkles,
  AlertTriangle,
  Building2,
  Globe
} from 'lucide-react';
import { PresentationRenderer } from '../presentation/PresentationRenderer';
import { QRPassModal } from '../qr/QRPassModal';

export const AdminDashboard: React.FC = () => {
  const { 
    teams, 
    stages, 
    schedules, 
    auditLogs, 
    stats, 
    approvePPT, 
    rejectPPT, 
    autoRegenerateSlots, 
    updateStageSlotStatus,
    syncGoogleSheets,
    resetToDefaultData
  } = useHackathon();

  const [activeTab, setActiveTab] = useState<'approvals' | 'scheduling' | 'teams' | 'audit'>('approvals');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('ALL');
  const [selectedStageSchedule, setSelectedStageSchedule] = useState<string>('stage-alpha');

  // Reviewing PPT Modal
  const [reviewTeam, setReviewTeam] = useState<Team | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [previewSlideIdx, setPreviewSlideIdx] = useState<number>(0);

  // QR Pass preview modal
  const [qrPassTeam, setQrPassTeam] = useState<Team | null>(null);

  // Sync state
  const [isSyncingSheets, setIsSyncingSheets] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string>('');

  const pendingSubmissions = teams.filter(
    (t) => t.submission && (t.submission.status === 'UNDER_REVIEW' || t.submission.status === 'CHANGES_REQUESTED')
  );

  const approvedSubmissions = teams.filter((t) => t.submission?.status === 'APPROVED');

  const handleApprove = (teamId: string) => {
    approvePPT(teamId, reviewNotes || '6-slide structure, timing constraints, and technical design verified.');
    setReviewTeam(null);
    setReviewNotes('');
  };

  const handleReject = (teamId: string) => {
    if (!reviewNotes) {
      alert('Please provide feedback notes explaining the reason for revision.');
      return;
    }
    rejectPPT(teamId, reviewNotes);
    setReviewTeam(null);
    setReviewNotes('');
  };

  const handleSyncSheets = async () => {
    setIsSyncingSheets(true);
    setSyncMessage('');
    await syncGoogleSheets();
    setIsSyncingSheets(false);
    setSyncMessage('Google Sheets synchronization complete. 128 rows updated.');
    setTimeout(() => setSyncMessage(''), 4000);
  };

  const stageSlots = schedules
    .filter((s) => s.stageId === selectedStageSchedule)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header & Overview Bar */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-600 font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>TECHNOCRATS INSTITUTE OF TECHNOLOGY · COMMAND CONSOLE</span>
            <span className="text-orange-300">·</span>
            <span className="text-[#b47e3a]">SIH 2026 INTERNAL</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">Smart Hackathon Operations Panel</h2>
          <p className="text-xs text-slate-500 mt-1">
            TIT Bhopal Internal Screening for Smart India Hackathon: presentation schedules, Drive vaults, and stage governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSyncSheets}
            disabled={isSyncingSheets}
            className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-mono font-bold text-orange-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <FolderSync className={`w-3.5 h-3.5 ${isSyncingSheets ? 'animate-spin' : ''}`} />
            <span>{isSyncingSheets ? 'Syncing...' : 'Sync Google Sheets'}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all teams, schedules, and logs to realistic 128-team defaults?')) {
                resetToDefaultData();
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-mono font-bold text-rose-700 transition-colors"
          >
            Reset Seed Data
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-mono text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* 5-Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">TEAMS REGISTERED</span>
          <span className="text-2xl font-black font-mono text-slate-900 tabular-nums">{stats.totalTeams}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">DEVELOPERS</span>
          <span className="text-2xl font-black font-mono text-orange-600 tabular-nums">{stats.totalParticipants}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">PENDING PPT REVIEW</span>
          <span className="text-2xl font-black font-mono text-amber-600 tabular-nums">{pendingSubmissions.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">APPROVED PPTS</span>
          <span className="text-2xl font-black font-mono text-emerald-600 tabular-nums">{stats.pptApproved}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">COMPLETED PITCHES</span>
          <span className="text-2xl font-black font-mono text-slate-900 tabular-nums">{stats.completedPresentations}</span>
        </div>
      </div>

      {/* Module Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'approvals', label: `PPT Approvals (${pendingSubmissions.length} Pending)` },
          { id: 'scheduling', label: 'Stage Presentation Scheduling' },
          { id: 'teams', label: `Team Management (${teams.length})` },
          { id: 'audit', label: `Audit Trail Logs (${auditLogs.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: PPT Approvals */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 bg-[#faf7f2] border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Submissions Awaiting Admin Review ({pendingSubmissions.length})
              </h3>
              <span className="text-xs text-orange-700 font-mono font-bold">
                Approved PPTs automatically unlock Digital QR Passes
              </span>
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                All uploaded presentation submissions have been reviewed and approved!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingSubmissions.map((team) => (
                  <div key={team.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-800 font-mono text-xs font-bold">
                          {team.id}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm">{team.name}</h4>
                        <span className="text-xs text-slate-500">· {team.college}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold">
                          PS: {team.psId || 'SIH1609'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        File: <span className="font-mono text-slate-900 font-bold">{team.submission?.fileName}</span> ({team.submission?.fileSize}) · <span className="text-orange-700 font-medium">{team.track}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setReviewTeam(team);
                          setReviewNotes('');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review Deck</span>
                      </button>

                      <button
                        onClick={() => approvePPT(team.id, 'Approved by Admin Committee.')}
                        className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Instant Approve</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Already Approved Submissions Preview */}
          <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 bg-[#faf7f2] border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-xs font-mono uppercase text-slate-600">
                Recently Approved Presentations ({approvedSubmissions.length})
              </h4>
            </div>
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {approvedSubmissions.slice(0, 10).map((team) => (
                <div key={team.id} className="p-3 px-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-orange-700 font-bold">{team.id}</span>
                    <span className="text-slate-900 font-bold">{team.name}</span>
                    <span className="text-slate-500 truncate max-w-xs">{team.college}</span>
                    <span className="font-mono text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">{team.psId || 'SIH1609'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-700 font-mono text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS ACTIVE
                    </span>
                    <button
                      onClick={() => setQrPassTeam(team)}
                      className="text-orange-600 hover:underline font-mono text-[11px] font-bold cursor-pointer"
                    >
                      View QR Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scheduling */}
      {activeTab === 'scheduling' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-600">Select Stage:</span>
              <div className="flex gap-1.5">
                {stages.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStageSchedule(st.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                      selectedStageSchedule === st.id
                        ? 'bg-orange-600 text-white shadow-2xs'
                        : 'bg-[#faf7f2] text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => autoRegenerateSlots(selectedStageSchedule, 10, 0)}
              className="px-4 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Auto-Generate 6-Minute Slots (Start 10:00)</span>
            </button>
          </div>

          {/* Slots Table */}
          <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#faf7f2] border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Slot Time (6m)</th>
                    <th className="py-3 px-4">Team ID</th>
                    <th className="py-3 px-4">Team Name</th>
                    <th className="py-3 px-4">Campus / Department</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {stageSlots.slice(0, 32).map((slot, idx) => {
                    const team = teams.find((t) => t.id === slot.teamId);
                    if (!team) return null;

                    return (
                      <tr key={slot.id} className="hover:bg-orange-50/40">
                        <td className="py-2.5 px-4 text-slate-400">#{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {slot.startTime} - {slot.endTime}
                        </td>
                        <td className="py-2.5 px-4 text-orange-700 font-bold">{team.id}</td>
                        <td className="py-2.5 px-4 font-sans font-bold text-slate-900">{team.name}</td>
                        <td className="py-2.5 px-4 text-slate-500 font-sans truncate max-w-[150px]">{team.college}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              slot.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : slot.status === 'IN_PROGRESS'
                                ? 'bg-orange-100 text-orange-800 border border-orange-300 animate-pulse'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {slot.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <select
                            value={slot.status}
                            onChange={(e) => updateStageSlotStatus(slot.id, e.target.value as any)}
                            className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 focus:outline-none focus:border-orange-500 font-sans font-medium"
                          >
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="ABSENT">Absent</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Team Management */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by team, ID, PS ID, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {['ALL', 'AI & Robotics', 'Web3 & Cloud', 'HealthTech & Bio', 'Smart Cities & IoT'].map((tr) => (
                <button
                  key={tr}
                  onClick={() => setSelectedTrackFilter(tr)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    selectedTrackFilter === tr
                      ? 'bg-orange-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#faf7f2] border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-3">Team ID</th>
                    <th className="py-3 px-3">Team Name</th>
                    <th className="py-3 px-3">Campus / College</th>
                    <th className="py-3 px-3">SIH PS ID</th>
                    <th className="py-3 px-3">Track</th>
                    <th className="py-3 px-3">PPT Status</th>
                    <th className="py-3 px-3">Stage &amp; Time</th>
                    <th className="py-3 px-3 text-right">QR Pass</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {teams
                    .filter((t) => {
                      const matchSearch =
                        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (t.psId && t.psId.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        t.college.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchTrack = selectedTrackFilter === 'ALL' || t.track === selectedTrackFilter;
                      return matchSearch && matchTrack;
                    })
                    .slice(0, 50)
                    .map((team) => (
                      <tr key={team.id} className="hover:bg-orange-50/40">
                        <td className="py-2.5 px-3 text-orange-700 font-bold">{team.id}</td>
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{team.name}</td>
                        <td className="py-2.5 px-3 text-slate-500 font-sans truncate max-w-[140px]">{team.college}</td>
                        <td className="py-2.5 px-3 text-blue-700 font-bold">{team.psId || 'SIH1609'}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-sans">{team.track}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              team.submission?.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {team.submission?.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {team.scheduledSlot?.startTime || '14:00'} ({stages.find((s) => s.id === team.stageId)?.name || 'Stage A'})
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {team.qrPass ? (
                            <button
                              onClick={() => setQrPassTeam(team)}
                              className="text-orange-600 hover:underline font-bold cursor-pointer"
                            >
                              View Pass
                            </button>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden space-y-2 shadow-xs">
          <div className="p-4 bg-[#faf7f2] border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">System Audit Trail ({auditLogs.length} Records)</h3>
            <span className="text-xs text-slate-500 font-mono">Immutable chronological event log</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 px-4 text-xs font-mono space-y-1 hover:bg-[#faf7f2]/60">
                <div className="flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold border border-orange-200">
                      {log.action}
                    </span>
                    {log.teamId && (
                      <span className="text-blue-700 font-bold">[{log.teamId}]</span>
                    )}
                    <span className="text-slate-500 font-sans">by {log.actor}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{log.timestamp}</span>
                </div>
                <p className="text-slate-700 font-sans text-xs pt-0.5">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewTeam && reviewTeam.submission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-between p-4 md:p-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-orange-400 font-bold">
                <span>{reviewTeam.id}</span>
                <span>·</span>
                <span>{reviewTeam.track}</span>
                <span>·</span>
                <span>Version: {reviewTeam.submission.version}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{reviewTeam.name} — Review Deck</h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setPreviewSlideIdx(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold cursor-pointer ${
                      previewSlideIdx === idx ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setReviewTeam(null)}
                className="p-1.5 text-slate-400 hover:text-white ml-3 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Slide display */}
          <div className="flex-1 overflow-hidden flex items-center justify-center my-4">
            <PresentationRenderer
              slide={reviewTeam.submission.slides[previewSlideIdx] || reviewTeam.submission.slides[0]}
              team={reviewTeam}
              slideTimeRemaining={60}
            />
          </div>

          {/* Decision bar */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Admin review notes / comments (optional for approval, required for rejection)..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 font-sans"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleReject(reviewTeam.id)}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
              >
                Request Revisions
              </button>
              <button
                onClick={() => handleApprove(reviewTeam.id)}
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-orange-600/30 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Approve &amp; Issue QR Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Pass Preview */}
      {qrPassTeam && (
        <QRPassModal
          team={qrPassTeam}
          stage={stages.find((s) => s.id === qrPassTeam.stageId)}
          onClose={() => setQrPassTeam(null)}
        />
      )}
    </div>
  );
};
