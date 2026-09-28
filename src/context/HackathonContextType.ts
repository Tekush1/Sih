import { 
  Team, 
  Stage, 
  ScheduleSlot, 
  AuditLog, 
  UserRole, 
  HackathonStats, 
  TeamTrack, 
  PPTSubmission, 
  QRPass, 
  SlideData, 
  ScreenLiveState,
  CSVTeamRecord,
  CSVImportResult
} from '../types';

export interface HackathonContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTeamId: string;
  setActiveTeamId: (teamId: string) => void;
  activeStageId: string;
  setActiveStageId: (stageId: string) => void;
  teams: Team[];
  stages: Stage[];
  schedules: ScheduleSlot[];
  auditLogs: AuditLog[];
  stats: HackathonStats;
  screenState: ScreenLiveState;
  queueTeams: Team[];
  sendTeamToScreen: (teamId: string, durationMinutes?: number) => void;
  startScreenTimer: () => void;
  pauseScreenTimer: () => void;
  resetScreenTimer: (seconds?: number) => void;
  adjustScreenTimer: (secondsDelta: number) => void;
  setScreenSlideIndex: (slideIdx: number) => void;
  nextScreenSlide: () => void;
  prevScreenSlide: () => void;
  setCustomSlideDurations: (durations: number[]) => void;
  restartCurrentSlideTimer: () => void;
  insertTeamIntoQueue: (data: {
    name: string;
    college?: string;
    psId?: string;
    sihOrganization?: string;
    track: TeamTrack;
    problemStatement: string;
    durationMinutes?: number;
    insertPosition?: 'top' | 'next' | 'end';
    slides?: SlideData[];
    googleDriveFolder?: string;
    members?: any[];
  }, options?: { position?: 'top' | 'next' | 'end'; sendImmediately?: boolean }) => Team;
  reorderPresentationQueue: (teamIdOrOrderedIds: string | string[], direction?: 'up' | 'down') => void;
  removeTeamFromQueue: (teamId: string) => void;
  updateTeamSlideData: (teamId: string, slideIndex: number, updatedFields: Partial<SlideData>) => void;
  registerTeam: (data: {
    name: string;
    college: string;
    track: TeamTrack;
    psId?: string;
    sihOrganization?: string;
    problemStatement: string;
    abstract: string;
    leaderName: string;
    leaderEmail: string;
    leaderPhone: string;
    members: any[];
  }) => Team;
  uploadPPT: (teamId: string, file: File, customSlides?: SlideData[]) => Promise<PPTSubmission>;
  approvePPT: (teamId: string, notes?: string) => void;
  rejectPPT: (teamId: string, notes: string) => void;
  generateQRPassForTeam: (teamId: string) => QRPass;
  validateQRScan: (scannedText: string, currentStageId: string) => {
    success: boolean;
    team?: Team;
    message: string;
    slot?: ScheduleSlot;
  };
  startPresentation: (teamId: string, stageId: string) => void;
  completePresentation: (
    teamId: string,
    stageId: string,
    scores?: { innovation: number; technical: number; feasibility: number; presentation: number; judgeNotes: string }
  ) => void;
  updateStageSlotStatus: (slotId: string, status: ScheduleSlot['status']) => void;
  reorderScheduleSlots: (stageId: string, orderedTeamIds: string[]) => void;
  autoRegenerateSlots: (stageId: string, startHour?: number, startMin?: number) => void;
  syncGoogleSheets: () => Promise<number>;
  resetToDefaultData: () => void;
  clearAllTeams: () => void;
  updateTeamDriveUrl: (teamId: string, driveUrl: string) => void;
  updateTeamsFromCSV: (records: CSVTeamRecord[], replaceAll?: boolean) => CSVImportResult;
}
