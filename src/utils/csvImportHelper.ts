import { Team, CSVTeamRecord, CSVImportResult } from '../types';
import { normalizeTrack } from './csvParser';
import { generateSlideDeck } from '../data/seedData';

export function processCSVTeamRecords(
  records: CSVTeamRecord[],
  currentTeams: Team[],
  replaceAll = false
): { importResult: CSVImportResult; newQueueTeamIds: string[] } {
  if (!records || records.length === 0) {
    return {
      importResult: { added: 0, updated: 0, total: 0, teams: currentTeams },
      newQueueTeamIds: []
    };
  }

  let addedCount = 0;
  let updatedCount = 0;
  const existingByName = new Map<string, Team>();

  if (!replaceAll) {
    currentTeams.forEach((t) => existingByName.set(t.name.trim().toLowerCase(), t));
  }

  let maxIdNum = replaceAll
    ? 0
    : currentTeams.reduce((max, t) => {
        const num = parseInt(t.id.replace('SH26-', ''), 10);
        return !isNaN(num) && num > max ? num : max;
      }, 0);

  const updatedTeamsList: Team[] = [];
  const newQueueTeamIds: string[] = [];

  records.forEach((rec) => {
    const key = rec.teamName.trim().toLowerCase();
    const existing = existingByName.get(key);
    const validTrack = normalizeTrack(rec.track);

    if (existing && !replaceAll) {
      updatedCount++;
      const updated: Team = {
        ...existing,
        track: validTrack,
        college: rec.college || existing.college,
        psId: rec.psId || existing.psId,
        problemStatement: rec.problemStatement || existing.problemStatement,
        leaderName: rec.leaderName || existing.leaderName,
        googleDriveFolder: rec.googleDriveLink || existing.googleDriveFolder,
        submission: existing.submission
          ? {
              ...existing.submission,
              googleDriveFileUrl: rec.googleDriveLink || existing.submission.googleDriveFileUrl
            }
          : undefined
      };
      existingByName.set(key, updated);
    } else {
      addedCount++;
      maxIdNum++;
      const teamId = `SH26-${String(maxIdNum).padStart(3, '0')}`;
      const driveFolder =
        rec.googleDriveLink || `https://drive.google.com/drive/folders/smart26_team_${teamId.toLowerCase()}`;
      const slides = generateSlideDeck(rec.teamName, validTrack, rec.problemStatement, rec.psId);

      const newTeam: Team = {
        id: teamId,
        name: rec.teamName,
        college: rec.college || 'TIT Bhopal',
        track: validTrack,
        psId: rec.psId || 'SIH1601',
        sihOrganization: 'Ministry of Education / AICTE',
        problemStatement: rec.problemStatement || 'SIH 2026 Project',
        abstract: rec.problemStatement || 'Solution description',
        leaderName: rec.leaderName || 'Squad Leader',
        leaderEmail: rec.leaderEmail || 'leader@technocrats.org',
        leaderPhone: rec.leaderPhone,
        leaderEnrollment: rec.leaderEnrollment,
        leaderSem: rec.leaderSem,
        members: (rec.membersList || rec.members || []).map((m: { name: string; email?: string; phone?: string; enrollment?: string }, mIdx: number) => ({
            id: `m-${teamId}-${mIdx + 2}`,
            name: m.name,
            email: m.email || 'member@technocrats.org',
            phone: m.phone || '9827000000',
            role: 'MEMBER' as const,
            college: rec.college || 'TIT Bhopal',
            enrollment: m.enrollment,
            specialization: 'Fullstack'
          })),
        createdAt: new Date().toISOString(),
        passcode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        googleFormSubmissionId: `CSV-${Date.now().toString().slice(-6)}`,
        googleDriveFolder: driveFolder,
        submission: {
          id: `sub-${Date.now()}-${teamId}`,
          fileName: `${rec.teamName.replace(/[^a-zA-Z0-9]/g, '_')}_Deck.pdf`,
          fileSize: '3.8 MB',
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

      if (replaceAll) {
        updatedTeamsList.push(newTeam);
      } else {
        existingByName.set(key, newTeam);
      }
      newQueueTeamIds.push(teamId);
    }
  });

  const finalTeams = replaceAll ? updatedTeamsList : Array.from(existingByName.values());
  return {
    importResult: { added: addedCount, updated: updatedCount, total: records.length, teams: finalTeams },
    newQueueTeamIds
  };
}
