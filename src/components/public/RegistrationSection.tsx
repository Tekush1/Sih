import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Team } from '../../types';
import { SIHProblemModal } from '../sih/SIHProblemModal';
import { RegistrationSIHCard } from './RegistrationSIHCard';
import { RegistrationTeamInfoCard } from './RegistrationTeamInfoCard';
import { RegistrationMembersCard } from './RegistrationMembersCard';
import { RegistrationSuccessView } from './RegistrationSuccessView';
import { RegistrationSheetsSyncView } from './RegistrationSheetsSyncView';
import { RegistrationGoogleFormEmbedView } from './RegistrationGoogleFormEmbedView';
import { useRegistrationForm } from './useRegistrationForm';

interface RegistrationSectionProps {
  onTeamRegistered: (team: Team) => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({ onTeamRegistered }) => {
  const { teams, syncGoogleSheets } = useHackathon();

  const [activeTab, setActiveTab] = useState<'form' | 'sheets' | 'google-form-embed'>('form');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<Team | null>(null);

  const form = useRegistrationForm({ onTeamRegistered, setRegisteredSuccess });

  const handleSyncSheets = async () => {
    setIsSyncing(true);
    await syncGoogleSheets();
    setIsSyncing(false);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <SIHProblemModal
        isOpen={form.isSIHModalOpen}
        onClose={() => form.setIsSIHModalOpen(false)}
        onSelect={form.handleSelectFromModal}
        initialSelectedId={form.psId}
      />

      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-mono font-bold uppercase">
          <span>03. INTERNAL REGISTRATION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Squad Registration &amp; Google Form Ingestion
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Register your TIT squad or connect with our synchronized Google Forms / Sheets response database.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="flex p-1 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'form' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct Registration Form
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'sheets' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Sheets Sync
          </button>
          <button
            onClick={() => setActiveTab('google-form-embed')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'google-form-embed' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Form Preview
          </button>
        </div>
      </div>

      {registeredSuccess ? (
        <RegistrationSuccessView
          team={registeredSuccess}
          onOpenTeamPortal={(team) => onTeamRegistered(team)}
          onRegisterAnother={() => setRegisteredSuccess(null)}
        />
      ) : activeTab === 'form' ? (
        <form onSubmit={form.handleSubmit} className="max-w-3xl mx-auto space-y-8">
          <RegistrationSIHCard
            psIdInput={form.psIdInput}
            setPsIdInput={form.setPsIdInput}
            isFetchingSIH={form.isFetchingSIH}
            handleFetchSIH={form.handleFetchSIH}
            setIsSIHModalOpen={form.setIsSIHModalOpen}
            sihFeedback={form.sihFeedback}
          />

          <RegistrationTeamInfoCard
            teamName={form.teamName}
            setTeamName={form.setTeamName}
            campus={form.campus}
            setCampus={form.setCampus}
            department={form.department}
            setDepartment={form.setDepartment}
            track={form.track}
            setTrack={form.setTrack}
            psId={form.psId}
            setPsId={form.setPsId}
            sihOrg={form.sihOrg}
            setSihOrg={form.setSihOrg}
            sihCategory={form.sihCategory}
            setSihCategory={form.setSihCategory}
            problemStatement={form.problemStatement}
            setProblemStatement={form.setProblemStatement}
            abstract={form.abstract}
            setAbstract={form.setAbstract}
          />

          <RegistrationMembersCard
            leaderName={form.leaderName}
            setLeaderName={form.setLeaderName}
            leaderEmail={form.leaderEmail}
            setLeaderEmail={form.setLeaderEmail}
            leaderPhone={form.leaderPhone}
            setLeaderPhone={form.setLeaderPhone}
            m2Name={form.m2Name}
            setM2Name={form.setM2Name}
            m2Email={form.m2Email}
            setM2Email={form.setM2Email}
            m3Name={form.m3Name}
            setM3Name={form.setM3Name}
            m3Email={form.m3Email}
            setM3Email={form.setM3Email}
            m4Name={form.m4Name}
            setM4Name={form.setM4Name}
            m4Email={form.m4Email}
            setM4Email={form.setM4Email}
          />

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white font-extrabold text-base shadow-xl shadow-orange-500/25 cursor-pointer"
            >
              Complete Registration &amp; Generate Drive Folder
            </button>
          </div>
        </form>
      ) : activeTab === 'sheets' ? (
        <RegistrationSheetsSyncView
          isSyncing={isSyncing}
          onSync={handleSyncSheets}
          teamsCount={teams.length}
        />
      ) : (
        <RegistrationGoogleFormEmbedView />
      )}
    </section>
  );
};
