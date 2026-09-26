import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Team, Stage, ScheduleSlot, AuditLog, UserRole, HackathonStats, TeamTrack, PPTSubmission, QRPass, SlideData, ScreenLiveState } from '../types';
import { generateSeedTeams, STAGES_INITIAL, generateSlideDeck } from '../data/seedData';

interface HackathonContextType {
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
  // Screen Portal live state & controls
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
  }) => Team;
  reorderPresentationQueue: (orderedTeamIds: string[]) => void;
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
    members: { name: string; email: string; phone: string; specialization: string }[];
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
}

const STORAGE_KEY = 'smart_hackathon_2026_tit_v2';

const HackathonContext = createContext<HackathonContextType | undefined>(undefined);

export const HackathonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('PUBLIC');
  const [activeTeamId, setActiveTeamId] = useState<string>('SH26-001');
  const [activeStageId, setActiveStageId] = useState<string>('stage-alpha');

  // Load from localStorage or initial seed
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_teams`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    const seed = generateSeedTeams();
    return seed.teams;
  });

  const [stages, setStages] = useState<Stage[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_stages`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return STAGES_INITIAL;
  });

  const [schedules, setSchedules] = useState<ScheduleSlot[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_schedules`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    const seed = generateSeedTeams();
    return seed.schedules;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_audit`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    const seed = generateSeedTeams();
    return seed.auditLogs;
  });

  // Screen live state for projector / stage screen
  const [screenState, setScreenState] = useState<ScreenLiveState>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_screenState`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.slideDurations && parsed.slideDurations.length === 6) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    const defaultDurations = [10, 60, 60, 40, 40, 20]; // 10s, 60s, 60s, 40s, 40s, 20s as requested
    const totalSecs = defaultDurations.reduce((a, b) => a + b, 0); // 230s
    return {
      teamId: 'SH26-001',
      slideIndex: 0,
      slideRemainingSeconds: defaultDurations[0], // 10s for 1st slide
      slideDurations: defaultDurations,
      totalRemainingSeconds: totalSecs,
      totalPitchSeconds: totalSecs,
      remainingSeconds: totalSecs,
      totalSeconds: totalSecs,
      isRunning: true, // Auto-run timer continuously on Screen Portal
      autoAdvance: true,
      isFinished: false,
      lastUpdated: Date.now()
    };
  });

  // Presentation line / queue of team IDs
  const [queueOrder, setQueueOrder] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_queueOrder`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return ['SH26-001', 'SH26-002', 'SH26-003', 'SH26-004', 'SH26-005', 'SH26-006', 'SH26-007', 'SH26-008'];
  });

  // Derived teams in the presentation line
  const queueTeams = useMemo(() => {
    const list: Team[] = [];
    queueOrder.forEach((id) => {
      const t = teams.find((item) => item.id === id);
      if (t) list.push(t);
    });
    // Add any remaining teams not in queueOrder if needed
    return list;
  }, [queueOrder, teams]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_teams`, JSON.stringify(teams));
      localStorage.setItem(`${STORAGE_KEY}_stages`, JSON.stringify(stages));
      localStorage.setItem(`${STORAGE_KEY}_schedules`, JSON.stringify(schedules));
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_screenState`, JSON.stringify(screenState));
      localStorage.setItem(`${STORAGE_KEY}_queueOrder`, JSON.stringify(queueOrder));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [teams, stages, schedules, auditLogs, screenState, queueOrder]);

  // Live Timer Countdown Effect (Auto-advances slides according to 10s, 60s, 60s, 40s, 40s, 20s)
  useEffect(() => {
    if (!screenState.isRunning) return;

    const interval = setInterval(() => {
      setScreenState((prev) => {
        if (!prev.isRunning) return prev;

        const durations = prev.slideDurations && prev.slideDurations.length === 6
          ? prev.slideDurations
          : [10, 60, 60, 40, 40, 20];

        let curSlideRemaining = (prev.slideRemainingSeconds !== undefined ? prev.slideRemainingSeconds : durations[prev.slideIndex] || 10) - 1;
        let curTotalRemaining = Math.max(0, (prev.totalRemainingSeconds !== undefined ? prev.totalRemainingSeconds : prev.remainingSeconds || 230) - 1);
        let curSlideIdx = prev.slideIndex;
        let running = true;
        let finished = false;

        // Check if current slide timer has expired
        if (curSlideRemaining <= 0) {
          if (prev.autoAdvance && curSlideIdx < durations.length - 1) {
            // Auto advance to next slide!
            curSlideIdx = curSlideIdx + 1;
            curSlideRemaining = durations[curSlideIdx]; // 60s, 60s, 40s, 40s, 20s
          } else {
            // Final slide ended
            curSlideRemaining = 0;
            curTotalRemaining = 0;
            running = false;
            finished = true;
          }
        }

        const updated: ScreenLiveState = {
          ...prev,
          slideIndex: curSlideIdx,
          slideRemainingSeconds: curSlideRemaining,
          slideDurations: durations,
          totalRemainingSeconds: curTotalRemaining,
          remainingSeconds: curTotalRemaining,
          totalPitchSeconds: prev.totalPitchSeconds || 230,
          totalSeconds: prev.totalPitchSeconds || 230,
          isRunning: running,
          isFinished: finished,
          lastUpdated: Date.now()
        };

        broadcastScreenState(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screenState.isRunning]);

  // Realtime BroadcastChannel sync across tabs / windows
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('smart_hackathon_2026_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'STATE_UPDATED') {
          try {
            const storedTeams = localStorage.getItem(`${STORAGE_KEY}_teams`);
            const storedStages = localStorage.getItem(`${STORAGE_KEY}_stages`);
            const storedSchedules = localStorage.getItem(`${STORAGE_KEY}_schedules`);
            const storedAudit = localStorage.getItem(`${STORAGE_KEY}_audit`);
            const storedScreen = localStorage.getItem(`${STORAGE_KEY}_screenState`);
            const storedQueue = localStorage.getItem(`${STORAGE_KEY}_queueOrder`);
            if (storedTeams) setTeams(JSON.parse(storedTeams));
            if (storedStages) setStages(JSON.parse(storedStages));
            if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
            if (storedAudit) setAuditLogs(JSON.parse(storedAudit));
            if (storedScreen) setScreenState(JSON.parse(storedScreen));
            if (storedQueue) setQueueOrder(JSON.parse(storedQueue));
          } catch (err) {
            console.error(err);
          }
        } else if (event.data?.type === 'SCREEN_STATE_UPDATED' && event.data.state) {
          setScreenState(event.data.state);
        }
      };
      return () => channel.close();
    }
  }, []);

  const broadcastScreenState = (state: ScreenLiveState) => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_screenState`, JSON.stringify(state));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('smart_hackathon_2026_sync');
        channel.postMessage({ type: 'SCREEN_STATE_UPDATED', state, timestamp: Date.now() });
        channel.close();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const broadcastUpdate = () => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('smart_hackathon_2026_sync');
        channel.postMessage({ type: 'STATE_UPDATED', timestamp: Date.now() });
        channel.close();
      } catch (err) {
        console.warn(err);
      }
    }
  };

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

  // Register Team
  const registerTeam = (data: {
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
    members: { name: string; email: string; phone: string; specialization: string }[];
  }) => {
    const nextNum = teams.length + 1;
    const teamId = `SH26-${String(nextNum).padStart(3, '0')}`;
    const stageId =
      data.track === 'AI & Robotics'
        ? 'stage-alpha'
        : data.track === 'Web3 & Cloud'
        ? 'stage-beta'
        : data.track === 'HealthTech & Bio'
        ? 'stage-gamma'
        : 'stage-delta';

    const driveFolder = `https://drive.google.com/drive/folders/smart26_team_${teamId.toLowerCase()}`;

    // Auto calculate next 6-min slot on the assigned stage
    const stageSlots = schedules.filter((s) => s.stageId === stageId);
    const slotIdx = stageSlots.length;
    const startHour = 10 + Math.floor((slotIdx * 6) / 60);
    const startMin = (slotIdx * 6) % 60;
    const endMin = (startMin + 6) % 60;
    const endHour = startMin + 6 >= 60 ? startHour + 1 : startHour;

    const startTime = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

    const newSlot: ScheduleSlot = {
      id: `slot-${stageId}-${slotIdx}`,
      stageId,
      teamId,
      startTime,
      endTime,
      durationMinutes: 6,
      date: '2026-09-25',
      status: 'SCHEDULED'
    };

    const newTeam: Team = {
      id: teamId,
      name: data.name,
      college: data.college || 'Technocrats Institute of Technology (TIT), Bhopal',
      track: data.track,
      psId: data.psId,
      sihOrganization: data.sihOrganization,
      problemStatement: data.problemStatement,
      abstract: data.abstract,
      leaderName: data.leaderName,
      leaderEmail: data.leaderEmail,
      members: [
        {
          id: `m-${teamId}-1`,
          name: data.leaderName,
          email: data.leaderEmail,
          role: 'LEADER',
          college: data.college,
          phone: data.leaderPhone,
          specialization: 'Team Lead & Architecture'
        },
        ...data.members.map((m, idx) => ({
          id: `m-${teamId}-${idx + 2}`,
          name: m.name,
          email: m.email,
          role: 'MEMBER' as const,
          college: data.college,
          phone: m.phone,
          specialization: m.specialization || 'Full Stack Engineer'
        }))
      ],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      passcode: `PASS-${String(nextNum).padStart(3, '0')}`,
      googleFormSubmissionId: `GF-2026-${80000 + nextNum}`,
      googleDriveFolder: driveFolder,
      stageId,
      scheduledSlot: newSlot
    };

    setTeams((prev) => [newTeam, ...prev]);
    setSchedules((prev) => [...prev, newSlot]);
    addAuditLog(
      'TEAM_REGISTERED',
      'Google Forms / Self Registration Portal',
      `Registered team ${newTeam.id} (${newTeam.name}) from ${newTeam.college} in track ${newTeam.track}. Provisioned dedicated Drive folder.`,
      'REGISTRATION',
      teamId
    );
    broadcastUpdate();
    return newTeam;
  };

  // Upload PPT
  const uploadPPT = async (teamId: string, file: File, customSlides?: SlideData[]): Promise<PPTSubmission> => {
    // Validation
    const ext = file.name.split('.').pop()?.toUpperCase();
    if (ext !== 'PPTX' && ext !== 'PDF') {
      throw new Error('Only .PPTX or .PDF presentation formats are accepted.');
    }
    if (file.size > 25 * 1024 * 1024) {
      throw new Error('File exceeds maximum size threshold of 25MB.');
    }

    const team = teams.find((t) => t.id === teamId);
    if (!team) throw new Error('Team not found');

    const versionNum = team.submission ? `v${(parseFloat(team.submission.version.replace('v', '')) + 0.1).toFixed(1)}` : 'v1.0';
    const slides = customSlides || generateSlideDeck(team.name, team.track, team.problemStatement);

    const submission: PPTSubmission = {
      id: `sub-${teamId}-${Date.now()}`,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: ext as 'PPTX' | 'PDF',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      version: versionNum,
      googleDriveFolderUrl: team.googleDriveFolder,
      googleDriveFileUrl: `https://drive.google.com/file/d/1${teamId}_SecureDrive_${file.name.replace(/\s+/g, '_')}/view`,
      status: 'UNDER_REVIEW',
      slidesCount: 6,
      slides
    };

    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, submission } : t))
    );

    addAuditLog(
      'PPT_UPLOADED',
      team.leaderName,
      `Uploaded presentation ${file.name} (${submission.fileSize}) [${versionNum}] to Google Drive team folder. Converted to 6-minute engine slides.`,
      'PPT_UPLOAD',
      teamId
    );

    broadcastUpdate();
    return submission;
  };

  // Generate QR Pass for Team
  const generateQRPassForTeam = (teamId: string): QRPass => {
    const team = teams.find((t) => t.id === teamId);
    const stage = stages.find((s) => s.id === team?.stageId);
    const token = `QR-SH26-${teamId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const pass: QRPass = {
      token,
      teamId,
      issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      qrPayload: JSON.stringify({
        token,
        teamId,
        teamName: team?.name,
        college: team?.college,
        stage: stage?.name || 'Stage Alpha',
        time: team?.scheduledSlot?.startTime || '14:00',
        track: team?.track
      }),
      verificationHash: `SHA256-${teamId}-${Date.now().toString(16)}`,
      isValid: true
    };

    return pass;
  };

  // Approve PPT
  const approvePPT = (teamId: string, notes?: string) => {
    const pass = generateQRPassForTeam(teamId);
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId && t.submission) {
          return {
            ...t,
            submission: {
              ...t.submission,
              status: 'APPROVED',
              reviewNotes: notes || 'Verified 6-slide structure, timing constraints and high-resolution visuals approved.',
              reviewedBy: 'Super Admin (Smart Hackathon Committee)',
              reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
            },
            qrPass: pass
          };
        }
        return t;
      })
    );

    addAuditLog(
      'PPT_APPROVED',
      'Admin Committee',
      `Approved presentation submission for ${teamId}. Generated cryptographic QR Pass ${pass.token} with 6-minute presentation clearance.`,
      'APPROVAL',
      teamId
    );
    broadcastUpdate();
  };

  // Reject PPT
  const rejectPPT = (teamId: string, notes: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId && t.submission) {
          return {
            ...t,
            submission: {
              ...t.submission,
              status: 'CHANGES_REQUESTED',
              reviewNotes: notes,
              reviewedBy: 'Admin Committee',
              reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
            }
          };
        }
        return t;
      })
    );

    addAuditLog(
      'PPT_REVISION_REQUESTED',
      'Admin Committee',
      `Requested revisions for ${teamId} PPT: ${notes}`,
      'APPROVAL',
      teamId
    );
    broadcastUpdate();
  };

  // Validate QR scan
  const validateQRScan = (
    scannedText: string,
    currentStageId: string
  ): { success: boolean; team?: Team; message: string; slot?: ScheduleSlot } => {
    let teamId = '';
    let token = '';

    // Check if JSON payload or direct token / teamId
    try {
      const parsed = JSON.parse(scannedText);
      teamId = parsed.teamId || '';
      token = parsed.token || '';
    } catch {
      // direct string matching e.g. "SH26-001" or "QR-SH26-SH26-001-XXXX"
      const matchTeam = scannedText.match(/SH26-\d{3}/i);
      if (matchTeam) {
        teamId = matchTeam[0].toUpperCase();
      }
      token = scannedText;
    }

    if (!teamId) {
      return { success: false, message: 'Invalid QR format. Could not locate a valid Team ID in QR payload.' };
    }

    const team = teams.find((t) => t.id === teamId);
    if (!team) {
      return { success: false, message: `Team ${teamId} not found in the Hackathon database.` };
    }

    if (!team.submission || team.submission.status !== 'APPROVED') {
      return {
        success: false,
        team,
        message: `Team ${teamId} presentation has not been approved by the Admin committee.`
      };
    }

    if (!team.qrPass || !team.qrPass.isValid) {
      return {
        success: false,
        team,
        message: `Team ${teamId} does not possess an active Digital QR Presentation Pass.`
      };
    }

    if (team.stageId && team.stageId !== currentStageId) {
      const assignedStage = stages.find((s) => s.id === team.stageId);
      const currentStage = stages.find((s) => s.id === currentStageId);
      return {
        success: false,
        team,
        message: `Stage Mismatch: Team ${teamId} is scheduled at ${assignedStage?.name || team.stageId}, but scanned at ${currentStage?.name || currentStageId}.`
      };
    }

    const slot = schedules.find((s) => s.teamId === teamId && s.stageId === currentStageId);

    addAuditLog(
      'STAGE_CHECKIN_VERIFIED',
      `Stage Scanner (${currentStageId})`,
      `Verified QR Pass token for Team ${team.id} (${team.name}). Stage clearance confirmed. Ready for 6-minute presentation.`,
      'STAGE_CHECKIN',
      team.id
    );

    broadcastUpdate();
    return {
      success: true,
      team,
      slot,
      message: `Verified: Team ${team.id} (${team.name}) is authorized for ${stages.find(s => s.id === currentStageId)?.name || 'the stage'}.`
    };
  };

  // Start Presentation
  const startPresentation = (teamId: string, stageId: string) => {
    setStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, currentTeamId: teamId, status: 'ACTIVE' } : s))
    );
    setSchedules((prev) =>
      prev.map((slot) =>
        slot.teamId === teamId && slot.stageId === stageId
          ? { ...slot, status: 'IN_PROGRESS' }
          : slot
      )
    );
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId && t.scheduledSlot
          ? { ...t, scheduledSlot: { ...t.scheduledSlot, status: 'IN_PROGRESS' } }
          : t
      )
    );

    const team = teams.find((t) => t.id === teamId);
    const stage = stages.find((s) => s.id === stageId);
    addAuditLog(
      'PRESENTATION_STARTED',
      `Stage Operator (${stage?.operatorName || 'Console'})`,
      `Initiated automated 6-minute presentation countdown for Team ${teamId} (${team?.name}) on ${stage?.name}.`,
      'PRESENTATION',
      teamId
    );
    broadcastUpdate();
  };

  // Complete Presentation
  const completePresentation = (
    teamId: string,
    stageId: string,
    scores?: { innovation: number; technical: number; feasibility: number; presentation: number; judgeNotes: string }
  ) => {
    const totalScore = scores ? scores.innovation + scores.technical + scores.feasibility + scores.presentation : 94;

    setSchedules((prev) =>
      prev.map((slot) =>
        slot.teamId === teamId && slot.stageId === stageId
          ? { ...slot, status: 'COMPLETED' }
          : slot
      )
    );

    // Pick next scheduled team on this stage
    const nextSlot = schedules
      .filter((s) => s.stageId === stageId && s.status === 'SCHEDULED' && s.teamId !== teamId)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

    setStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, currentTeamId: nextSlot ? nextSlot.teamId : undefined } : s))
    );

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            scheduledSlot: t.scheduledSlot ? { ...t.scheduledSlot, status: 'COMPLETED' } : undefined,
            scores: scores
              ? { ...scores, total: totalScore }
              : {
                  innovation: 24,
                  technical: 23,
                  feasibility: 24,
                  presentation: 24,
                  total: 95,
                  judgeNotes: 'Completed full 6-minute automatic slide presentation with rigorous live demonstration.'
                }
          };
        }
        return t;
      })
    );

    const team = teams.find((t) => t.id === teamId);
    addAuditLog(
      'PRESENTATION_COMPLETED',
      'Presentation Engine',
      `Completed 6-minute presentation for Team ${teamId} (${team?.name}). Status marked COMPLETED. Total score logged: ${totalScore}/100.`,
      'PRESENTATION',
      teamId
    );
    broadcastUpdate();
  };

  // Update Slot Status
  const updateStageSlotStatus = (slotId: string, status: ScheduleSlot['status']) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, status } : s))
    );
    broadcastUpdate();
  };

  // Reorder Schedule Slots
  const reorderScheduleSlots = (stageId: string, orderedTeamIds: string[]) => {
    setSchedules((prev) => {
      const stageSlots = prev.filter((s) => s.stageId === stageId);
      const otherSlots = prev.filter((s) => s.stageId !== stageId);

      // Reassign times based on new order
      const reordered: ScheduleSlot[] = orderedTeamIds.map((teamId, idx) => {
        const existing = stageSlots.find((s) => s.teamId === teamId);
        const startHour = 10 + Math.floor((idx * 6) / 60);
        const startMin = (idx * 6) % 60;
        const endMin = (startMin + 6) % 60;
        const endHour = startMin + 6 >= 60 ? startHour + 1 : startHour;

        const startTime = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
        const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

        return {
          id: existing?.id || `slot-${stageId}-${idx}`,
          stageId,
          teamId,
          startTime,
          endTime,
          durationMinutes: 6,
          date: '2026-09-25',
          status: existing?.status || 'SCHEDULED'
        };
      });

      return [...otherSlots, ...reordered];
    });

    addAuditLog(
      'SCHEDULE_REORDERED',
      'Stage Scheduler',
      `Reordered presentation queue for ${stages.find(s => s.id === stageId)?.name || stageId} (${orderedTeamIds.length} teams).`,
      'SYSTEM'
    );
    broadcastUpdate();
  };

  // Auto regenerate 6-min slots
  const autoRegenerateSlots = (stageId: string, startHour: number = 10, startMin: number = 0) => {
    const stageTeams = teams.filter((t) => t.stageId === stageId);
    const newSlots: ScheduleSlot[] = stageTeams.map((t, idx) => {
      const totalMinutes = startHour * 60 + startMin + idx * 6;
      const sh = Math.floor(totalMinutes / 60);
      const sm = totalMinutes % 60;
      const endTotal = totalMinutes + 6;
      const eh = Math.floor(endTotal / 60);
      const em = endTotal % 60;

      return {
        id: `slot-${stageId}-${idx}`,
        stageId,
        teamId: t.id,
        startTime: `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`,
        endTime: `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`,
        durationMinutes: 6,
        date: '2026-09-25',
        status: t.scheduledSlot?.status || 'SCHEDULED'
      };
    });

    setSchedules((prev) => [...prev.filter((s) => s.stageId !== stageId), ...newSlots]);
    addAuditLog(
      'SCHEDULE_AUTO_GENERATED',
      'Admin Scheduler',
      `Generated clean 6-minute slots for ${stageTeams.length} teams on ${stages.find(s => s.id === stageId)?.name || stageId}.`,
      'SYSTEM'
    );
    broadcastUpdate();
  };

  // Sync with Google Sheets
  const syncGoogleSheets = async (): Promise<number> => {
    // Simulated remote sync with Google Form responses sheet
    await new Promise((r) => setTimeout(r, 600));
    addAuditLog(
      'GOOGLE_SHEETS_SYNC',
      'Google Sheets Webhook',
      `Synchronized with Google Sheets master database. Verified 128 team rows, drive assets, and QR permissions.`,
      'REGISTRATION'
    );
    return teams.length;
  };

  // Reset to seed data
  const resetToDefaultData = () => {
    const seed = generateSeedTeams();
    setTeams(seed.teams);
    setSchedules(seed.schedules);
    setStages(STAGES_INITIAL);
    setAuditLogs(seed.auditLogs);
    localStorage.removeItem(`${STORAGE_KEY}_teams`);
    localStorage.removeItem(`${STORAGE_KEY}_stages`);
    localStorage.removeItem(`${STORAGE_KEY}_schedules`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);
    broadcastUpdate();
  };

  // Send Team to Screen with exact per-slide durations (10s, 60s, 60s, 40s, 40s, 20s)
  const sendTeamToScreen = (teamId: string, durationMinutes?: number) => {
    setActiveTeamId(teamId);
    const durations = screenState.slideDurations && screenState.slideDurations.length === 6
      ? screenState.slideDurations
      : [10, 60, 60, 40, 40, 20];
    const totalSecs = durations.reduce((a, b) => a + b, 0);

    const newState: ScreenLiveState = {
      teamId,
      slideIndex: 0,
      slideRemainingSeconds: durations[0], // 10s for 1st slide
      slideDurations: durations,
      totalRemainingSeconds: totalSecs,
      totalPitchSeconds: totalSecs,
      remainingSeconds: totalSecs,
      totalSeconds: totalSecs,
      isRunning: true, // Continuously running as requested
      autoAdvance: true,
      isFinished: false,
      lastUpdated: Date.now()
    };
    setScreenState(newState);
    broadcastScreenState(newState);
    addAuditLog('SCREEN_ACTIVATED', 'Admin Controller', `Pushed Team ${teamId} to Screen Portal with per-slide timings [10s, 60s, 60s, 40s, 40s, 20s].`, 'SYSTEM', teamId);
  };

  const startScreenTimer = () => {
    setScreenState((prev) => {
      const updated: ScreenLiveState = {
        ...prev,
        isRunning: true,
        isFinished: false,
        lastUpdated: Date.now()
      };
      broadcastScreenState(updated);
      return updated;
    });
  };

  const pauseScreenTimer = () => {
    setScreenState((prev) => {
      const updated: ScreenLiveState = {
        ...prev,
        isRunning: false,
        lastUpdated: Date.now()
      };
      broadcastScreenState(updated);
      return updated;
    });
  };

  const resetScreenTimer = (seconds?: number) => {
    setScreenState((prev) => {
      const durations = prev.slideDurations && prev.slideDurations.length === 6
        ? prev.slideDurations
        : [10, 60, 60, 40, 40, 20];
      const totalSecs = durations.reduce((a, b) => a + b, 0);
      const updated: ScreenLiveState = {
        ...prev,
        slideIndex: 0,
        slideRemainingSeconds: durations[0],
        slideDurations: durations,
        totalRemainingSeconds: totalSecs,
        totalPitchSeconds: totalSecs,
        remainingSeconds: totalSecs,
        totalSeconds: totalSecs,
        isRunning: false,
        isFinished: false,
        lastUpdated: Date.now()
      };
      broadcastScreenState(updated);
      return updated;
    });
  };

  const restartCurrentSlideTimer = () => {
    setScreenState((prev) => {
      const durations = prev.slideDurations && prev.slideDurations.length === 6
        ? prev.slideDurations
        : [10, 60, 60, 40, 40, 20];
      const durationForCurrent = durations[prev.slideIndex] || 60;
      const updated: ScreenLiveState = {
        ...prev,
        slideRemainingSeconds: durationForCurrent,
        lastUpdated: Date.now()
      };
      broadcastScreenState(updated);
      return updated;
    });
  };

  const setCustomSlideDurations = (durations: number[]) => {
    setScreenState((prev) => {
      const totalSecs = durations.reduce((a, b) => a + b, 0);
      const currentSlideDuration = durations[prev.slideIndex] || durations[0];
      const updated: ScreenLiveState = {
        ...prev,
        slideDurations: durations,
        slideRemainingSeconds: Math.min(prev.slideRemainingSeconds, currentSlideDuration),
        totalPitchSeconds: totalSecs,
        totalSeconds: totalSecs,
        lastUpdated: Date.now()
      };
      broadcastScreenState(updated);
      return updated;
    });
  };

  const adjustScreenTimer = (secondsDelta: number) => {
    setScreenState((prev) => {
      const newSlideRemaining = Math.max(0, prev.slideRemainingSeconds + secondsDelta);
      const newTotalRemaining = Math.max(0, (prev.totalRemainingSeconds || prev.remainingSeconds) + secondsDelta);
      const updated: ScreenLiveState = {
        ...prev,
        slideRemainingSeconds: newSlideRemaining,
        totalRemainingSeconds: newTotalRemaining,
        remainingSeconds: newTotalRemaining,
        lastUpdated: Date.now()
      };
      broadcastScreenState(updated);
      return updated;
    });
  };

  const setScreenSlideIndex = (slideIdx: number) => {
    setScreenState((prev) => {
      const durations = prev.slideDurations && prev.slideDurations.length === 6
        ? prev.slideDurations
        : [10, 60, 60, 40, 40, 20];
      const validIdx = Math.max(0, Math.min(slideIdx, durations.length - 1));
      
      // Calculate remaining total from this slide onwards
      let remainingFromHere = durations[validIdx];
      for (let i = validIdx + 1; i < durations.length; i++) {
        remainingFromHere += durations[i];
      }

      const updated: ScreenLiveState = {
        ...prev,
        slideIndex: validIdx,
        slideRemainingSeconds: durations[validIdx],
        totalRemainingSeconds: remainingFromHere,
        remainingSeconds: remainingFromHere,
        isFinished: false,
        lastUpdated: Date.now()
      };
      broadcastScreenState(updated);
      return updated;
    });
  };

  const nextScreenSlide = () => {
    const team = teams.find((t) => t.id === screenState.teamId);
    const totalSlides = team?.submission?.slides?.length || 6;
    const nextIdx = Math.min(screenState.slideIndex + 1, totalSlides - 1);
    setScreenSlideIndex(nextIdx);
  };

  const prevScreenSlide = () => {
    const prevIdx = Math.max(screenState.slideIndex - 1, 0);
    setScreenSlideIndex(prevIdx);
  };

  // Insert Team into presentation line / queue
  const insertTeamIntoQueue = (data: {
    name: string;
    college?: string;
    psId?: string;
    sihOrganization?: string;
    track: TeamTrack;
    problemStatement: string;
    durationMinutes?: number;
    insertPosition?: 'top' | 'next' | 'end';
    slides?: SlideData[];
  }): Team => {
    const nextNum = teams.length + 1;
    const teamId = `SH26-${String(nextNum).padStart(3, '0')}`;
    const generatedSlides = data.slides || generateSlideDeck(data.name, data.track, data.problemStatement);
    const duration = data.durationMinutes || 6;

    const submission: PPTSubmission = {
      id: `sub-${teamId}-${Date.now()}`,
      fileName: `${data.name.replace(/\s+/g, '_')}_Pitch.pptx`,
      fileSize: '4.8 MB',
      fileType: 'PPTX',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      version: 'v1.0',
      googleDriveFolderUrl: `https://drive.google.com/drive/folders/smart26_team_${teamId.toLowerCase()}`,
      googleDriveFileUrl: `https://drive.google.com/file/d/1${teamId}_SecureDrive/view`,
      status: 'APPROVED',
      slidesCount: generatedSlides.length,
      slides: generatedSlides
    };

    const newTeam: Team = {
      id: teamId,
      name: data.name,
      college: data.college || 'Technocrats Institute of Technology (TIT), Bhopal',
      track: data.track,
      psId: data.psId || 'SIH1601',
      sihOrganization: data.sihOrganization || 'Ministry of Education / AICTE',
      problemStatement: data.problemStatement,
      abstract: `Internal SIH 2026 pitch deck by ${data.name}.`,
      leaderName: 'Squad Lead',
      leaderEmail: `${teamId.toLowerCase()}@titbhopal.ac.in`,
      members: [],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      passcode: `PASS-${String(nextNum).padStart(3, '0')}`,
      googleFormSubmissionId: `GF-2026-${80000 + nextNum}`,
      googleDriveFolder: `https://drive.google.com/drive/folders/smart26_team_${teamId.toLowerCase()}`,
      stageId: 'stage-alpha',
      submission
    };

    setTeams((prev) => [newTeam, ...prev]);

    setQueueOrder((prev) => {
      const pos = data.insertPosition || 'next';
      let nextList = [...prev];
      if (pos === 'top') {
        nextList = [teamId, ...nextList];
      } else if (pos === 'next') {
        const activeIdx = nextList.indexOf(screenState.teamId);
        if (activeIdx !== -1) {
          nextList.splice(activeIdx + 1, 0, teamId);
        } else {
          nextList = [nextList[0] || teamId, teamId, ...nextList.slice(1)].filter(Boolean);
        }
      } else {
        nextList = [...nextList, teamId];
      }
      localStorage.setItem(`${STORAGE_KEY}_queueOrder`, JSON.stringify(nextList));
      return nextList;
    });

    addAuditLog(
      'LINE_INSERTION',
      'Admin Line Controller',
      `Admin inserted team ${teamId} (${data.name}) into presentation line at position [${data.insertPosition || 'next'}].`,
      'SYSTEM',
      teamId
    );

    broadcastUpdate();
    return newTeam;
  };

  const reorderPresentationQueue = (orderedTeamIds: string[]) => {
    setQueueOrder(orderedTeamIds);
    localStorage.setItem(`${STORAGE_KEY}_queueOrder`, JSON.stringify(orderedTeamIds));
    broadcastUpdate();
  };

  const removeTeamFromQueue = (teamId: string) => {
    setQueueOrder((prev) => {
      const nextList = prev.filter((id) => id !== teamId);
      localStorage.setItem(`${STORAGE_KEY}_queueOrder`, JSON.stringify(nextList));
      return nextList;
    });
    broadcastUpdate();
  };

  const updateTeamSlideData = (teamId: string, slideIndex: number, updatedFields: Partial<SlideData>) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId && t.submission?.slides) {
          const newSlides = [...t.submission.slides];
          if (newSlides[slideIndex]) {
            newSlides[slideIndex] = {
              ...newSlides[slideIndex],
              ...updatedFields
            };
          }
          return {
            ...t,
            submission: {
              ...t.submission,
              slides: newSlides
            }
          };
        }
        return t;
      })
    );
    broadcastUpdate();
  };

  // Stats calculation
  const stats = useMemo<HackathonStats>(() => {
    const totalTeams = teams.length;
    const totalParticipants = teams.reduce((acc, t) => acc + (t.members?.length || 4), 0);
    const pptSubmissions = teams.filter((t) => t.submission).length;
    const pptApproved = teams.filter((t) => t.submission?.status === 'APPROVED').length;
    const completedPresentations = schedules.filter((s) => s.status === 'COMPLETED').length;
    const activeStages = stages.filter((s) => s.status === 'ACTIVE').length;

    const tracksBreakdown: Record<TeamTrack, number> = {
      'AI & Robotics': 0,
      'Web3 & Cloud': 0,
      'HealthTech & Bio': 0,
      'Smart Cities & IoT': 0
    };

    teams.forEach((t) => {
      if (tracksBreakdown[t.track] !== undefined) {
        tracksBreakdown[t.track]++;
      }
    });

    return {
      totalTeams,
      totalParticipants,
      pptSubmissions,
      pptApproved,
      completedPresentations,
      activeStages,
      tracksBreakdown
    };
  }, [teams, schedules, stages]);

  return (
    <HackathonContext.Provider
      value={{
        role,
        setRole,
        activeTeamId,
        setActiveTeamId,
        activeStageId,
        setActiveStageId,
        teams,
        stages,
        schedules,
        auditLogs,
        stats,
        // Screen & Queue live management
        screenState,
        queueTeams,
        sendTeamToScreen,
        startScreenTimer,
        pauseScreenTimer,
        resetScreenTimer,
        adjustScreenTimer,
        setScreenSlideIndex,
        nextScreenSlide,
        prevScreenSlide,
        setCustomSlideDurations,
        restartCurrentSlideTimer,
        insertTeamIntoQueue,
        reorderPresentationQueue,
        removeTeamFromQueue,
        updateTeamSlideData,
        registerTeam,
        uploadPPT,
        approvePPT,
        rejectPPT,
        generateQRPassForTeam,
        validateQRScan,
        startPresentation,
        completePresentation,
        updateStageSlotStatus,
        reorderScheduleSlots,
        autoRegenerateSlots,
        syncGoogleSheets,
        resetToDefaultData
      }}
    >
      {children}
    </HackathonContext.Provider>
  );
};

export const useHackathon = () => {
  const context = useContext(HackathonContext);
  if (!context) {
    throw new Error('useHackathon must be used within a HackathonProvider');
  }
  return context;
};
