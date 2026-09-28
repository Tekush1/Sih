import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Team } from '../../types';
import { QRPassModal } from '../qr/QRPassModal';
import { AdminApprovalsTab } from './AdminApprovalsTab';
import { AdminSchedulingTab } from './AdminSchedulingTab';
import { AdminTeamsTab } from './AdminTeamsTab';
import { AdminAuditTab } from './AdminAuditTab';
import { AdminReviewModal } from './AdminReviewModal';
import { AdminDashboardHeader } from './AdminDashboardHeader';

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

  const [reviewTeam, setReviewTeam] = useState<Team | null>(null);
  const [qrPassTeam, setQrPassTeam] = useState<Team | null>(null);

  const [isSyncingSheets, setIsSyncingSheets] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string>('');

  const pendingSubmissions = teams.filter(
    (t) => t.submission && (t.submission.status === 'UNDER_REVIEW' || t.submission.status === 'CHANGES_REQUESTED')
  );
  const approvedSubmissions = teams.filter((t) => t.submission?.status === 'APPROVED');

  const handleSyncSheets = async () => {
    setIsSyncingSheets(true);
    setSyncMessage('');
    await syncGoogleSheets();
    setIsSyncingSheets(false);
    setSyncMessage('Google Sheets synchronization complete.');
    setTimeout(() => setSyncMessage(''), 4000);
  };

  const stageSlots = schedules
    .filter((s) => s.stageId === selectedStageSchedule)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <AdminDashboardHeader
        handleSyncSheets={handleSyncSheets}
        isSyncingSheets={isSyncingSheets}
        resetToDefaultData={resetToDefaultData}
        syncMessage={syncMessage}
        stats={stats}
        pendingCount={pendingSubmissions.length}
      />

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

      {activeTab === 'approvals' && (
        <AdminApprovalsTab
          pendingSubmissions={pendingSubmissions}
          approvedSubmissions={approvedSubmissions}
          onOpenReview={(t) => setReviewTeam(t)}
          onInstantApprove={(id) => approvePPT(id, 'Approved by Admin Committee.')}
          onOpenQR={(t) => setQrPassTeam(t)}
        />
      )}

      {activeTab === 'scheduling' && (
        <AdminSchedulingTab
          stages={stages}
          selectedStageSchedule={selectedStageSchedule}
          setSelectedStageSchedule={setSelectedStageSchedule}
          autoRegenerateSlots={autoRegenerateSlots}
          stageSlots={stageSlots}
          teams={teams}
          updateStageSlotStatus={updateStageSlotStatus}
        />
      )}

      {activeTab === 'teams' && (
        <AdminTeamsTab
          teams={teams}
          stages={stages}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTrackFilter={selectedTrackFilter}
          setSelectedTrackFilter={setSelectedTrackFilter}
          onOpenQR={(t) => setQrPassTeam(t)}
        />
      )}

      {activeTab === 'audit' && <AdminAuditTab auditLogs={auditLogs} />}

      <AdminReviewModal
        reviewTeam={reviewTeam}
        onClose={() => setReviewTeam(null)}
        onApprove={(id, notes) => {
          approvePPT(id, notes || 'Approved by Admin.');
          setReviewTeam(null);
        }}
        onReject={(id, notes) => {
          if (!notes) {
            alert('Please provide feedback notes.');
            return;
          }
          rejectPPT(id, notes);
          setReviewTeam(null);
        }}
      />

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
