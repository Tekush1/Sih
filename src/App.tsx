/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HackathonProvider, useHackathon } from './context/HackathonContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScreenPortal } from './components/screen/ScreenPortal';
import { AdminLinePortal } from './components/admin/AdminLinePortal';
import { CSVUploadModal } from './components/admin/CSVUploadModal';

const MainApp: React.FC = () => {
  const { teams, sendTeamToScreen } = useHackathon();
  const [showGlobalCSVModal, setShowGlobalCSVModal] = useState<boolean>(false);

  // Detect URL parameter for dedicated projector screen view (e.g. ?portal=screen or ?view=screen)
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const portal = params.get('portal') || params.get('view');
      if (portal === 'screen') return 'screen';
    }
    return 'admin';
  });

  const isPureScreenView = currentTab === 'screen';

  const handlePopScreen = () => {
    const url = `${window.location.origin}${window.location.pathname}?portal=screen`;
    window.open(url, 'AuditoriumScreen', 'width=1280,height=720,menubar=no,toolbar=no');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between ${isPureScreenView ? 'bg-[#070b14] text-white' : 'bg-[#faf7f2] text-slate-800'}`}>
      {/* Top Navbar */}
      {!isPureScreenView ? (
        <Navbar
          currentTab={currentTab}
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenCSVUpload={() => setShowGlobalCSVModal(true)}
          onPopScreen={handlePopScreen}
        />
      ) : (
        /* Minimalist top switch bar for pure projector screen */
        <div className="bg-slate-950/95 border-b border-slate-900 px-6 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-200">AUDITORIUM PROJECTOR SCREEN</span>
            <span className="text-slate-600">·</span>
            <span className="text-orange-400 font-bold">Smart Hackathon 2026 · TIT Bhopal</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('admin')}
              className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors cursor-pointer text-xs"
            >
              ← Back to Standings &amp; Lineup
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'screen' ? (
          <ScreenPortal onOpenAdmin={() => setCurrentTab('admin')} />
        ) : (
          <AdminLinePortal onSwitchToScreen={() => setCurrentTab('screen')} />
        )}
      </main>

      {/* Footer (hidden on screen view) */}
      {!isPureScreenView && <Footer onNavigate={(tab) => setCurrentTab(tab)} />}

      {/* Global CSV Upload Modal */}
      <CSVUploadModal
        isOpen={showGlobalCSVModal}
        onClose={() => setShowGlobalCSVModal(false)}
      />
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
