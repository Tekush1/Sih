import { useState, useMemo } from 'react';
import { Team, TeamTrack, SlideData, CSVTeamRecord, CSVImportResult } from '../types';
import { generateSlideDeck } from '../data/seedData';
import { processCSVTeamRecords } from '../utils/csvImportHelper';

export function useQueueManager(
  storageKey: string,
  teams: Team[],
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>,
  sendTeamToScreen: (teamId: string, duration?: number) => void,
  addAuditLog: (action: string, actor: string, details: string, category: any, teamId?: string) => void
) {
  const [queueOrder, setQueueOrder] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`${storageKey}_queueOrder`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const queueTeams = useMemo(() => {
    const list: Team[] = [];
    queueOrder.forEach((id) => {
      const t = teams.find((item) => item.id === id);
      if (t) list.push(t);
    });
    return list;
  }, [queueOrder, teams]);

  const insertTeamIntoQueue = (
    data: {
      name: string;
      college?: string;
      psId?: string;
      sihOrganization?: string;
      track: TeamTrack;
      problemStatement: string;
      googleDriveFolder?: string;
      members?: any[];
    },
    options?: { position?: 'top' | 'next' | 'end'; sendImmediately?: boolean }
  ): Team => {
    const nextNum = teams.length + 1;
    const teamId = `SH26-${String(nextNum).padStart(3, '0')}`;
    const driveFolder = data.googleDriveFolder || `https://drive.google.com/drive/folders/smart26_team_${teamId.toLowerCase()}`;
    const slides = generateSlideDeck(data.name, data.track, data.problemStatement, data.psId);

    const newTeam: Team = {
      id: teamId,
      name: data.name,
      college: data.college || 'Technocrats Institute of Technology (TIT), Bhopal',
      track: data.track,
      psId: data.psId || 'SIH1601',
      sihOrganization: data.sihOrganization || 'Ministry of Education',
      problemStatement: data.problemStatement,
      abstract: data.problemStatement,
      leaderName: data.members?.[0]?.name || 'Squad Leader',
      leaderEmail: data.members?.[0]?.email || 'leader@technocrats.org',
      members: data.members || [],
      createdAt: new Date().toISOString(),
      passcode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      googleFormSubmissionId: `GF-${Date.now().toString().slice(-6)}`,
      googleDriveFolder: driveFolder,
      submission: {
        id: `sub-${Date.now()}`,
        fileName: `${data.name.replace(/[^a-zA-Z0-9]/g, '_')}_Deck.pdf`,
        fileSize: '4.2 MB',
        fileType: 'PDF',
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        version: 'v1.0',
        googleDriveFolderUrl: driveFolder,
        googleDriveFileUrl: driveFolder,
        status: 'APPROVED',
        slidesCount: slides.length,
        slides
      }
    };

    setTeams((prev) => [newTeam, ...prev]);

    const pos = options?.position || 'end';
    setQueueOrder((prev) => {
      let nextOrder = [...prev];
      if (pos === 'top') nextOrder = [newTeam.id, ...nextOrder];
      else if (pos === 'next') nextOrder = nextOrder.length > 0 ? [nextOrder[0], newTeam.id, ...nextOrder.slice(1)] : [newTeam.id];
      else nextOrder = [...nextOrder, newTeam.id];
      return nextOrder;
    });

    if (options?.sendImmediately) sendTeamToScreen(newTeam.id, 6);
    addAuditLog('INSERT_QUEUE_TEAM', 'Admin', `Inserted ${newTeam.name} into lineup`, 'PRESENTATION', teamId);
    return newTeam;
  };

  const reorderPresentationQueue = (teamIdOrOrderedIds: string | string[], direction?: 'up' | 'down') => {
    if (Array.isArray(teamIdOrOrderedIds)) {
      setQueueOrder(teamIdOrOrderedIds);
      return;
    }
    const teamId = teamIdOrOrderedIds;
    if (!direction) return;

    setQueueOrder((prev) => {
      const idx = prev.indexOf(teamId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const newOrder = [...prev];
      const temp = newOrder[idx];
      newOrder[idx] = newOrder[targetIdx];
      newOrder[targetIdx] = temp;
      return newOrder;
    });
  };

  const removeTeamFromQueue = (teamId: string) => {
    setQueueOrder((prev) => prev.filter((id) => id !== teamId));
  };

  const updateTeamSlideData = (teamId: string, slideIndex: number, updatedFields: Partial<SlideData>) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId || !t.submission) return t;
        const slides = [...t.submission.slides];
        if (slides[slideIndex]) {
          slides[slideIndex] = { ...slides[slideIndex], ...updatedFields };
        }
        return { ...t, submission: { ...t.submission, slides } };
      })
    );
  };

  const updateTeamsFromCSV = (records: CSVTeamRecord[], replaceAll = false): CSVImportResult => {
    const { importResult, newQueueTeamIds } = processCSVTeamRecords(records, teams, replaceAll);
    setTeams(importResult.teams);

    if (replaceAll) {
      const allIds = importResult.teams.map((t) => t.id);
      setQueueOrder(allIds);
    } else if (newQueueTeamIds.length > 0) {
      setQueueOrder((prev) => {
        const set = new Set(prev);
        const toAdd = newQueueTeamIds.filter((id) => !set.has(id));
        return [...prev, ...toAdd];
      });
    }

    addAuditLog('CSV_IMPORT', 'Admin', `Processed ${records.length} records (${importResult.added} added, ${importResult.updated} updated)`, 'SYSTEM');
    return importResult;
  };

  return {
    queueOrder,
    setQueueOrder,
    queueTeams,
    insertTeamIntoQueue,
    reorderPresentationQueue,
    removeTeamFromQueue,
    updateTeamSlideData,
    updateTeamsFromCSV
  };
}
