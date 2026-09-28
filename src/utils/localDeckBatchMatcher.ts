import { Team, TeamTrack } from '../types';
import { saveLocalDeck } from './localDeckStorage';
import { generateSlideDeck } from '../data/seedData';

function cleanFileNameToTeamName(fileName: string): string {
  // Strip extension
  let base = fileName.replace(/\.[^/.]+$/, '');
  // Replace underscores, dashes with spaces
  base = base.replace(/[-_.]+/g, ' ').trim();
  // Capitalize words
  if (!base) return 'Offline Squad';
  return base
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function detectTrackFromText(text: string): TeamTrack {
  const lower = text.toLowerCase();
  if (lower.includes('cloud') || lower.includes('web3') || lower.includes('crypto') || lower.includes('block')) {
    return 'Web3 & Cloud';
  }
  if (lower.includes('health') || lower.includes('bio') || lower.includes('med') || lower.includes('care')) {
    return 'HealthTech & Bio';
  }
  if (lower.includes('city') || lower.includes('iot') || lower.includes('traffic') || lower.includes('smart')) {
    return 'Smart Cities & IoT';
  }
  return 'AI & Robotics';
}

export async function matchAndSaveOfflineDecks(
  files: File[],
  existingTeams: Team[],
  autoCreateUnmatched: boolean = true
): Promise<{
  matchedCount: number;
  matchedTeams: { teamId: string; teamName: string; fileName: string; isNew: boolean }[];
  newTeams: Team[];
  updatedExistingTeams: Team[];
}> {
  let matchedCount = 0;
  const matchedTeams: { teamId: string; teamName: string; fileName: string; isNew: boolean }[] = [];
  const newTeams: Team[] = [];
  const updatedExistingTeams = [...existingTeams];

  // Keep track of highest ID number for sequential assignment
  let maxIdNum = 0;
  existingTeams.forEach((t) => {
    const match = t.id.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num > maxIdNum) maxIdNum = num;
    }
  });

  for (const file of files) {
    const rawName = file.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    // 1. Attempt to match by Team ID (e.g. "sh26001", "001", "team1")
    let targetIndex = updatedExistingTeams.findIndex((t) => {
      const cleanId = t.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const idDigits = t.id.replace(/\D/g, '');
      return rawName.includes(cleanId) || (idDigits.length >= 2 && rawName.includes(idDigits));
    });

    // 2. If not matched by ID, attempt to match by Team Name
    if (targetIndex === -1) {
      targetIndex = updatedExistingTeams.findIndex((t) => {
        const cleanTeamName = t.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanTeamName.length >= 4 && (rawName.includes(cleanTeamName) || cleanTeamName.includes(rawName));
      });
    }

    if (targetIndex !== -1) {
      // Matched existing team!
      const targetTeam = updatedExistingTeams[targetIndex];
      await saveLocalDeck(targetTeam.id, file);
      
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'PPTX';
      const slides = targetTeam.submission?.slides || generateSlideDeck(targetTeam.name, targetTeam.track, targetTeam.problemStatement, targetTeam.psId);

      updatedExistingTeams[targetIndex] = {
        ...targetTeam,
        submission: {
          id: targetTeam.submission?.id || `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          fileName: file.name,
          fileSize: fileSizeMb,
          fileType,
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          version: 'Local Offline',
          googleDriveFolderUrl: targetTeam.googleDriveFolder || `offline://${targetTeam.id}`,
          googleDriveFileUrl: targetTeam.googleDriveFolder || `offline://${targetTeam.id}/${file.name}`,
          status: 'APPROVED',
          slidesCount: slides.length,
          slides
        }
      };

      matchedCount++;
      matchedTeams.push({
        teamId: targetTeam.id,
        teamName: targetTeam.name,
        fileName: file.name,
        isNew: false
      });
    } else if (autoCreateUnmatched) {
      // Auto-create new squad from local presentation file!
      maxIdNum++;
      const teamId = `SH26-${String(maxIdNum).padStart(3, '0')}`;
      const teamName = cleanFileNameToTeamName(file.name);
      const track = detectTrackFromText(file.name);
      const psId = `SIH16${String(10 + (maxIdNum % 80)).padStart(2, '0')}`;
      const problemStatement = `Local Offline Project: ${teamName}`;
      const slides = generateSlideDeck(teamName, track, problemStatement, psId);
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'PPTX';

      await saveLocalDeck(teamId, file);

      const newTeam: Team = {
        id: teamId,
        name: teamName,
        college: 'Technocrats Institute of Technology (TIT), Bhopal',
        track,
        psId,
        sihOrganization: 'Ministry of Education / AICTE',
        problemStatement,
        abstract: problemStatement,
        leaderName: `${teamName} Lead`,
        leaderEmail: `lead.${teamId.toLowerCase()}@technocrats.org`,
        members: [],
        createdAt: new Date().toISOString(),
        passcode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        googleFormSubmissionId: `GF-${Date.now().toString().slice(-6)}`,
        googleDriveFolder: `offline://${teamId}`,
        submission: {
          id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          fileName: file.name,
          fileSize: fileSizeMb,
          fileType,
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          version: 'Local v1.0',
          googleDriveFolderUrl: `offline://${teamId}`,
          googleDriveFileUrl: `offline://${teamId}/${file.name}`,
          status: 'APPROVED',
          slidesCount: slides.length,
          slides
        }
      };

      newTeams.push(newTeam);
      updatedExistingTeams.push(newTeam);
      matchedCount++;
      matchedTeams.push({
        teamId: newTeam.id,
        teamName: newTeam.name,
        fileName: file.name,
        isNew: true
      });
    }
  }

  return {
    matchedCount,
    matchedTeams,
    newTeams,
    updatedExistingTeams
  };
}
