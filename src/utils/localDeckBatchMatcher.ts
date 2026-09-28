import { Team } from '../types';
import { saveLocalDeck } from './localDeckStorage';

export async function matchAndSaveOfflineDecks(
  files: File[],
  teams: Team[]
): Promise<{ matchedCount: number; matchedTeams: { teamId: string; fileName: string }[] }> {
  let matchedCount = 0;
  const matchedTeams: { teamId: string; fileName: string }[] = [];

  for (const file of files) {
    const rawName = file.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Attempt to match by Team ID (e.g., "sh26001", "sh26002")
    let targetTeam = teams.find((t) => {
      const cleanId = t.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      return rawName.includes(cleanId);
    });

    // If not matched by ID, attempt to match by Team Name
    if (!targetTeam) {
      targetTeam = teams.find((t) => {
        const cleanTeamName = t.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanTeamName.length >= 4 && (rawName.includes(cleanTeamName) || cleanTeamName.includes(rawName));
      });
    }

    if (targetTeam) {
      await saveLocalDeck(targetTeam.id, file);
      matchedCount++;
      matchedTeams.push({ teamId: targetTeam.id, fileName: file.name });
    }
  }

  return { matchedCount, matchedTeams };
}
