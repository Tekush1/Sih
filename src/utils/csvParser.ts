import { CSVTeamRecord, TeamTrack } from '../types';
import { OFFICIAL_SIH_PROBLEM_STATEMENTS } from '../data/sihProblemStatements';
import { detectCSVHeaders } from './csvHeaders';
export { getSampleCSVContent } from './csvSample';

/**
 * Normalizes user-entered track string to one of the 4 strict TeamTrack options
 */
export function normalizeTrack(rawTrack: string): TeamTrack {
  const t = (rawTrack || '').toLowerCase().trim();
  if (t.includes('web3') || t.includes('cloud') || t.includes('block') || t.includes('crypto')) {
    return 'Web3 & Cloud';
  }
  if (t.includes('health') || t.includes('bio') || t.includes('med') || t.includes('life')) {
    return 'HealthTech & Bio';
  }
  if (t.includes('smart') || t.includes('city') || t.includes('cities') || t.includes('iot') || t.includes('sensor')) {
    return 'Smart Cities & IoT';
  }
  return 'AI & Robotics';
}

/**
 * Robust CSV/TSV parser that handles commas, tabs, semicolons, quotes, and newlines
 */
export function parseCSVLine(line: string, delimiter?: string): string[] {
  const delim = delimiter || (line.includes('\t') ? '\t' : (line.includes(';') && !line.includes(',') ? ';' : ','));
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delim && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export interface ParsedCSVOutput {
  records: CSVTeamRecord[];
  errors: string[];
  headers: string[];
  totalRowsFound: number;
}

/**
 * Parses raw CSV/TSV string into typed CSVTeamRecord array
 */
export function parseTeamsCSV(csvContent: string): ParsedCSVOutput {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { records: [], errors: ['Content is empty.'], headers: [], totalRowsFound: 0 };
  }

  const firstSample = lines.slice(0, 3).join('\n');
  const delimiter = firstSample.includes('\t') ? '\t' : (firstSample.includes(';') && !firstSample.includes(',') ? ';' : ',');

  const errors: string[] = [];
  const records: CSVTeamRecord[] = [];

  const firstRow = parseCSVLine(lines[0], delimiter);
  const mapping = detectCSVHeaders(firstRow);

  for (let i = mapping.startIndex; i < lines.length; i++) {
    const rawLine = lines[i];
    const columns = parseCSVLine(rawLine, delimiter);

    if (columns.length === 0 || columns.every((c) => !c)) continue;

    const teamName = (columns[mapping.teamNameColIdx] || '').trim();
    if (!teamName) {
      errors.push(`Row ${i + 1}: Skipped row due to missing Team Name.`);
      continue;
    }

    const leaderName = mapping.leaderNameColIdx !== -1 ? (columns[mapping.leaderNameColIdx] || '').trim() : '';
    const leaderEmail = mapping.leaderEmailColIdx !== -1 ? (columns[mapping.leaderEmailColIdx] || '').trim() : (mapping.emailColIdx !== -1 ? (columns[mapping.emailColIdx] || '').trim() : '');
    const leaderPhone = mapping.leaderPhoneColIdx !== -1 ? (columns[mapping.leaderPhoneColIdx] || '').trim() : '';
    const leaderEnroll = mapping.leaderEnrollColIdx !== -1 ? (columns[mapping.leaderEnrollColIdx] || '').trim() : '';
    const leaderSem = mapping.leaderSemColIdx !== -1 ? (columns[mapping.leaderSemColIdx] || '').trim() : '';
    const timestamp = mapping.timestampColIdx !== -1 ? (columns[mapping.timestampColIdx] || '').trim() : '';

    let driveLink = mapping.driveColIdx !== -1 ? (columns[mapping.driveColIdx] || '').trim() : '';
    if (driveLink && !driveLink.startsWith('http://') && !driveLink.startsWith('https://')) {
      driveLink = `https://${driveLink}`;
    }

    const rawTheme = mapping.themeColIdx !== -1 ? (columns[mapping.themeColIdx] || '').trim() : '';
    const rawPsId = mapping.psIdColIdx !== -1 ? (columns[mapping.psIdColIdx] || '').trim() : '';
    let problemStatement = mapping.problemStmtColIdx !== -1 ? (columns[mapping.problemStmtColIdx] || '').trim() : '';

    if (rawPsId) {
      const cleanPsId = rawPsId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const matchedPs = OFFICIAL_SIH_PROBLEM_STATEMENTS.find(
        (p) => p.id.toUpperCase() === cleanPsId || cleanPsId.includes(p.id.toUpperCase())
      );
      if (matchedPs && !problemStatement) {
        problemStatement = `${matchedPs.title}: ${matchedPs.description}`;
      }
    }

    if (!problemStatement && rawTheme) {
      problemStatement = `SIH 2026 Solution on ${rawTheme}${rawPsId ? ` (${rawPsId})` : ''}`;
    }

    const track = normalizeTrack(rawTheme || problemStatement);
    const college = mapping.collegeColIdx !== -1 ? (columns[mapping.collegeColIdx] || '').trim() : 'Technocrats Institute of Technology (TIT), Bhopal';

    const membersList: { name: string; enrollment?: string; phone?: string; email?: string }[] = [];
    mapping.membersCols.forEach((mCols) => {
      const mName = mCols.nameIdx !== -1 ? (columns[mCols.nameIdx] || '').trim() : '';
      if (mName) {
        membersList.push({
          name: mName,
          enrollment: mCols.enrollIdx !== -1 ? (columns[mCols.enrollIdx] || '').trim() : undefined,
          phone: mCols.phoneIdx !== -1 ? (columns[mCols.phoneIdx] || '').trim() : undefined,
          email: mCols.gmailIdx !== -1 ? (columns[mCols.gmailIdx] || '').trim() : undefined
        });
      }
    });

    records.push({
      teamName,
      track,
      googleDriveLink: driveLink,
      problemStatement: problemStatement || `Innovative ${track} solution by ${teamName}`,
      psId: rawPsId || undefined,
      theme: rawTheme || undefined,
      college,
      leaderName: leaderName || undefined,
      leaderEmail: leaderEmail || undefined,
      leaderPhone: leaderPhone || undefined,
      leaderEnrollment: leaderEnroll,
      leaderSem,
      timestamp,
      membersList
    });
  }

  return {
    records,
    errors,
    headers: firstRow,
    totalRowsFound: lines.length - mapping.startIndex
  };
}
