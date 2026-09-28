import { useState } from 'react';
import { Stage, ScheduleSlot, Team } from '../types';
import { STAGES_INITIAL } from '../data/seedData';

export function useScheduleManager(
  storageKey: string,
  teams: Team[],
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>,
  addAuditLog: (action: string, actor: string, details: string, category: any, teamId?: string) => void
) {
  const [activeStageId, setActiveStageId] = useState<string>('stage-alpha');

  const [stages, setStages] = useState<Stage[]>(() => {
    try {
      const stored = localStorage.getItem(`${storageKey}_stages`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return STAGES_INITIAL;
  });

  const [schedules, setSchedules] = useState<ScheduleSlot[]>(() => {
    try {
      const stored = localStorage.getItem(`${storageKey}_schedules`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const validateQRScan = (
    scannedText: string,
    currentStageId: string
  ): { success: boolean; team?: Team; message: string; slot?: ScheduleSlot } => {
    const cleanToken = scannedText.trim();
    const team = teams.find(
      (t) => t.id === cleanToken || t.qrPass?.token === cleanToken || t.googleFormSubmissionId === cleanToken
    );

    if (!team) {
      return { success: false, message: `No registered team matching pass: "${cleanToken}"` };
    }

    if (!team.submission || team.submission.status !== 'APPROVED') {
      return { success: false, team, message: `Team ${team.name} has not received PPT approval yet.` };
    }

    const slot = schedules.find((s) => s.teamId === team.id && s.stageId === currentStageId);
    return {
      success: true,
      team,
      slot,
      message: `Verified: ${team.name} (${team.id}) authorized on stage.`
    };
  };

  const startPresentation = (teamId: string, stageId: string) => {
    setStages((prev) => prev.map((s) => (s.id === stageId ? { ...s, currentTeamId: teamId, status: 'ACTIVE' } : s)));
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.stageId === stageId && s.teamId === teamId) return { ...s, status: 'IN_PROGRESS' };
        if (s.stageId === stageId && s.status === 'IN_PROGRESS' && s.teamId !== teamId) return { ...s, status: 'COMPLETED' };
        return s;
      })
    );
    addAuditLog('PRESENTATION_STARTED', 'Stage Marshal', `Started pitch for ${teamId} on ${stageId}`, 'STAGE_CHECKIN', teamId);
  };

  const completePresentation = (
    teamId: string,
    stageId: string,
    scores?: { innovation: number; technical: number; feasibility: number; presentation: number; judgeNotes: string }
  ) => {
    setStages((prev) => prev.map((s) => (s.id === stageId && s.currentTeamId === teamId ? { ...s, currentTeamId: undefined, status: 'IDLE' } : s)));
    setSchedules((prev) =>
      prev.map((s) => (s.stageId === stageId && s.teamId === teamId ? { ...s, status: 'COMPLETED' } : s))
    );
    if (scores) {
      const total = scores.innovation + scores.technical + scores.feasibility + scores.presentation;
      setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, scores: { ...scores, total } } : t)));
    }
    addAuditLog('PRESENTATION_COMPLETED', 'Stage Marshal', `Completed pitch for ${teamId}`, 'PRESENTATION', teamId);
  };

  const updateStageSlotStatus = (slotId: string, status: ScheduleSlot['status']) => {
    setSchedules((prev) => prev.map((s) => (s.id === slotId ? { ...s, status } : s)));
  };

  const reorderScheduleSlots = (stageId: string, orderedTeamIds: string[]) => {
    setSchedules((prev) => {
      const stageSlots = prev.filter((s) => s.stageId === stageId).sort((a, b) => a.startTime.localeCompare(b.startTime));
      const otherSlots = prev.filter((s) => s.stageId !== stageId);
      const updatedStageSlots = stageSlots.map((slot, idx) => ({
        ...slot,
        teamId: orderedTeamIds[idx] || slot.teamId
      }));
      return [...otherSlots, ...updatedStageSlots];
    });
  };

  const autoRegenerateSlots = (stageId: string, startHour = 10, startMin = 0) => {
    const stageTeams = teams.filter((t) => t.stageId === stageId);
    let curHour = startHour;
    let curMin = startMin;

    const newSlots: ScheduleSlot[] = stageTeams.map((team, idx) => {
      const startTime = `${String(curHour).padStart(2, '0')}:${String(curMin).padStart(2, '0')}`;
      curMin += 6;
      if (curMin >= 60) {
        curHour += Math.floor(curMin / 60);
        curMin = curMin % 60;
      }
      const endTime = `${String(curHour).padStart(2, '0')}:${String(curMin).padStart(2, '0')}`;

      return {
        id: `slot-${stageId}-${idx}-${Date.now()}`,
        stageId,
        teamId: team.id,
        startTime,
        endTime,
        durationMinutes: 6,
        date: '2026-09-25',
        status: 'SCHEDULED'
      };
    });

    setSchedules((prev) => [...prev.filter((s) => s.stageId !== stageId), ...newSlots]);
  };

  return {
    stages,
    setStages,
    schedules,
    setSchedules,
    activeStageId,
    setActiveStageId,
    validateQRScan,
    startPresentation,
    completePresentation,
    updateStageSlotStatus,
    reorderScheduleSlots,
    autoRegenerateSlots
  };
}
