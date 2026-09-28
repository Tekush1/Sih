import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  AuditLog, 
  UserRole, 
  HackathonStats
} from '../types';
import { STAGES_INITIAL } from '../data/seedData';
import { HackathonContextType } from './HackathonContextType';
import { useScreenController } from './useScreenController';
import { useTeamManager } from './useTeamManager';
import { useQueueManager } from './useQueueManager';
import { useScheduleManager } from './useScheduleManager';

const STORAGE_KEY = 'smart_hackathon_2026_tit_real_v6';

const HackathonContext = createContext<HackathonContextType | undefined>(undefined);

export const HackathonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('PUBLIC');
  const [activeTeamId, setActiveTeamId] = useState<string>('');

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_audit`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const addAuditLog = (
    action: string,
    actor: string,
    details: string,
    category: AuditLog['category'],
    teamId?: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      action,
      actor,
      teamId,
      details,
      category
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Compose modular hooks
  const screen = useScreenController(STORAGE_KEY);
  const teamMgr = useTeamManager(STORAGE_KEY, addAuditLog);
  const queueMgr = useQueueManager(
    STORAGE_KEY, 
    teamMgr.teams, 
    teamMgr.setTeams, 
    screen.sendTeamToScreen, 
    addAuditLog
  );
  const scheduleMgr = useScheduleManager(
    STORAGE_KEY, 
    teamMgr.teams, 
    teamMgr.setTeams, 
    addAuditLog
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_teams`, JSON.stringify(teamMgr.teams));
      localStorage.setItem(`${STORAGE_KEY}_stages`, JSON.stringify(scheduleMgr.stages));
      localStorage.setItem(`${STORAGE_KEY}_schedules`, JSON.stringify(scheduleMgr.schedules));
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_screenState`, JSON.stringify(screen.screenState));
      localStorage.setItem(`${STORAGE_KEY}_queueOrder`, JSON.stringify(queueMgr.queueOrder));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [teamMgr.teams, scheduleMgr.stages, scheduleMgr.schedules, auditLogs, screen.screenState, queueMgr.queueOrder]);

  const stats: HackathonStats = useMemo(() => {
    const totalTeams = teamMgr.teams.length;
    const totalParticipants = teamMgr.teams.reduce((acc, t) => acc + (t.members.length + 1), 0);
    const pptSubmissions = teamMgr.teams.filter((t) => t.submission !== undefined).length;
    const pptApproved = teamMgr.teams.filter((t) => t.submission?.status === 'APPROVED').length;
    const qrPassesIssued = teamMgr.teams.filter((t) => t.qrPass?.isValid).length;
    const completedPresentations = scheduleMgr.schedules.filter((s) => s.status === 'COMPLETED').length;
    const inProgressPresentations = scheduleMgr.schedules.filter((s) => s.status === 'IN_PROGRESS').length;
    const activeStages = scheduleMgr.stages.filter((st) => st.status === 'ACTIVE').length;
    const tracksBreakdown = {
      'AI & Robotics': 0,
      'Web3 & Cloud': 0,
      'HealthTech & Bio': 0,
      'Smart Cities & IoT': 0
    };
    teamMgr.teams.forEach((t) => {
      if (t.track in tracksBreakdown) {
        tracksBreakdown[t.track]++;
      }
    });

    return {
      totalTeams,
      totalParticipants,
      pptSubmissions,
      pptApproved,
      qrPassesIssued,
      completedPresentations,
      inProgressPresentations,
      activeStages,
      tracksBreakdown
    };
  }, [teamMgr.teams, scheduleMgr.schedules, scheduleMgr.stages]);

  const syncGoogleSheets = async (): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    addAuditLog('GOOGLE_SHEETS_SYNC', 'System', `Synced ${teamMgr.teams.length} rows from Google Sheets`, 'SYSTEM');
    return teamMgr.teams.length;
  };

  const clearAllTeams = () => {
    teamMgr.setTeams([]);
    queueMgr.setQueueOrder([]);
    scheduleMgr.setSchedules([]);
    scheduleMgr.setStages(STAGES_INITIAL);
    localStorage.removeItem(`${STORAGE_KEY}_teams`);
    localStorage.removeItem(`${STORAGE_KEY}_queueOrder`);
    localStorage.removeItem(`${STORAGE_KEY}_schedules`);
    localStorage.removeItem(`${STORAGE_KEY}_screenState`);
    screen.resetScreenTimer();
    addAuditLog('CLEAR_ALL_TEAMS', 'Admin', 'Purged all mock squads from database', 'SYSTEM');
  };

  const resetToDefaultData = () => {
    clearAllTeams();
  };

  const value: HackathonContextType = {
    role,
    setRole,
    activeTeamId,
    setActiveTeamId,
    activeStageId: scheduleMgr.activeStageId,
    setActiveStageId: scheduleMgr.setActiveStageId,
    teams: teamMgr.teams,
    stages: scheduleMgr.stages,
    schedules: scheduleMgr.schedules,
    auditLogs,
    stats,
    screenState: screen.screenState,
    queueTeams: queueMgr.queueTeams,
    sendTeamToScreen: screen.sendTeamToScreen,
    startScreenTimer: screen.startScreenTimer,
    pauseScreenTimer: screen.pauseScreenTimer,
    resetScreenTimer: screen.resetScreenTimer,
    adjustScreenTimer: screen.adjustScreenTimer,
    setScreenSlideIndex: screen.setScreenSlideIndex,
    nextScreenSlide: screen.nextScreenSlide,
    prevScreenSlide: screen.prevScreenSlide,
    setCustomSlideDurations: screen.setCustomSlideDurations,
    restartCurrentSlideTimer: screen.restartCurrentSlideTimer,
    insertTeamIntoQueue: queueMgr.insertTeamIntoQueue,
    reorderPresentationQueue: queueMgr.reorderPresentationQueue,
    removeTeamFromQueue: queueMgr.removeTeamFromQueue,
    updateTeamSlideData: queueMgr.updateTeamSlideData,
    registerTeam: teamMgr.registerTeam,
    uploadPPT: teamMgr.uploadPPT,
    approvePPT: teamMgr.approvePPT,
    rejectPPT: teamMgr.rejectPPT,
    generateQRPassForTeam: teamMgr.generateQRPassForTeam,
    validateQRScan: scheduleMgr.validateQRScan,
    startPresentation: scheduleMgr.startPresentation,
    completePresentation: scheduleMgr.completePresentation,
    updateStageSlotStatus: scheduleMgr.updateStageSlotStatus,
    reorderScheduleSlots: scheduleMgr.reorderScheduleSlots,
    autoRegenerateSlots: scheduleMgr.autoRegenerateSlots,
    syncGoogleSheets,
    resetToDefaultData,
    clearAllTeams,
    updateTeamDriveUrl: teamMgr.updateTeamDriveUrl,
    updateTeamsFromCSV: queueMgr.updateTeamsFromCSV
  };

  return <HackathonContext.Provider value={value}>{children}</HackathonContext.Provider>;
};

export const useHackathon = () => {
  const context = useContext(HackathonContext);
  if (!context) {
    throw new Error('useHackathon must be used within a HackathonProvider');
  }
  return context;
};
