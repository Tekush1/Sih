/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HackathonProvider, useHackathon } from './context/HackathonContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScreenPortal } from './components/screen/ScreenPortal';
import { AdminLinePortal } from './components/admin/AdminLinePortal';
import { PresentationHome } from './components/presentation/PresentationHome';
import { JudgeEvaluationSection } from './components/presentation/JudgeEvaluationSection';
import { TeamsDirectory } from './components/public/TeamsDirectory';
import { ScheduleView } from './components/public/ScheduleView';
import { TeamPortal } from './components/team/TeamPortal';
import { StagePortal } from './components/stage/StagePortal';
import { PresentationEngine } from './components/presentation/PresentationEngine';
import { Team, TeamTrack } from './types';

const MainApp: React.FC = () => {
  const { setActiveTeamId, stages, teams, startPresentation, sendTeamToScreen } = useHackathon();

  // Detect URL parameter for dedicated screen view (e.g. ?portal=screen or ?view=screen)
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const portal = params.get('portal') || params.get('view');
      if (portal === 'screen') return 'screen';
      if (portal === 'admin') return 'admin';
    }
    return 'admin'; // default directly to Admin Portal so user can insert into line right away
  });

  const [filterTrack, setFilterTrack] = useState<TeamTrack | null>(null);

  // Standalone presentation engine overlay
  const [directPresentationTeam, setDirectPresentationTeam] = useState<Team | null>(null);
  const [directPresentationStageId, setDirectPresentationStageId] = useState<string>('stage-alpha');

  const handleLaunchPresentation = (teamId: string, stageId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      startPresentation(team.id, stageId);
      sendTeamToScreen(team.id, 6);
      setDirectPresentationStageId(stageId);
      setDirectPresentationTeam(team);
    }
  };

  const isPureScreenView = currentTab === 'screen';

  return (
    <div className={`min-h-screen flex flex-col justify-between ${isPureScreenView ? 'bg-[#070b14] text-white' : 'bg-[#faf7f2] text-slate-800 selection:bg-orange-500/20 selection:text-orange-950'}`}>
      {/* Top Navbar: Hide on pure screen projector display so ONLY countdown, team name and PPT appear, but show on Admin and other portals */}
      {!isPureScreenView ? (
        <Navbar
          currentTab={currentTab}
          onNavigate={(tab) => setCurrentTab(tab)}
          onLaunchLivePitch={() => {
            sendTeamToScreen(teams[0]?.id || 'SH26-001', 6);
            setCurrentTab('screen');
          }}
        />
      ) : (
        /* Discreet top switch bar for projector operator */
        <div className="bg-slate-950/90 border-b border-slate-900 px-6 py-2 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-200">PROJECTOR SCREEN DISPLAY</span>
            <span className="text-slate-600">·</span>
            <span className="text-orange-400 font-bold">Technocrats Institute of Technology (TIT), Bhopal</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('admin')}
              className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors cursor-pointer text-xs"
            >
              ← Back to Admin Portal
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {/* 1. SCREEN PORTAL: Strictly Countdown, Team Name & PPT */}
        {currentTab === 'screen' && (
          <ScreenPortal onOpenAdmin={() => setCurrentTab('admin')} />
        )}

        {/* 2. ADMIN PORTAL: Insert into Line, Reorder Queue & Screen Controls */}
        {currentTab === 'admin' && (
          <AdminLinePortal onSwitchToScreen={() => setCurrentTab('screen')} />
        )}

        {/* Other auxiliary portals */}
        {currentTab === 'home' && (
          <PresentationHome
            onNavigate={(tab) => setCurrentTab(tab)}
            onLaunchPresentation={handleLaunchPresentation}
          />
        )}

        {currentTab === 'stage-portal' && <StagePortal />}

        {currentTab === 'teams' && (
          <TeamsDirectory
            initialTrack={filterTrack}
            onOpenTeamPortal={(teamId) => {
              setActiveTeamId(teamId);
              setCurrentTab('team-portal');
            }}
          />
        )}

        {currentTab === 'schedule' && (
          <ScheduleView onLaunchPresentation={handleLaunchPresentation} />
        )}

        {currentTab === 'judges' && (
          <JudgeEvaluationSection onLaunchPresentation={handleLaunchPresentation} />
        )}

        {currentTab === 'team-portal' && <TeamPortal />}
      </main>

      {/* Footer: Hide on screen projector view */}
      {!isPureScreenView && <Footer onNavigate={(tab) => setCurrentTab(tab)} />}

      {/* Standalone Presentation Engine modal if launched */}
      {directPresentationTeam && (
        <PresentationEngine
          team={directPresentationTeam}
          stage={stages.find((s) => s.id === directPresentationStageId) || stages[0]}
          onClose={() => setDirectPresentationTeam(null)}
          onNextTeam={(nextTeamId) => {
            const next = teams.find((t) => t.id === nextTeamId);
            if (next) {
              startPresentation(next.id, directPresentationStageId);
              sendTeamToScreen(next.id, 6);
              setDirectPresentationTeam(next);
            } else {
              setDirectPresentationTeam(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <HackathonProvider>
      <MainApp />
    </HackathonProvider>
  );
}
