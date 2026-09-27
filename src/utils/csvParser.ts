import { CSVTeamRecord, TeamTrack } from '../types';
import { OFFICIAL_SIH_PROBLEM_STATEMENTS } from '../data/sihProblemStatements';

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
 * Robust CSV/TSV parser that handles commas, tabs (Google Sheets copy-paste), semicolons, quotes, and newlines
 */
export function parseCSVLine(line: string, delimiter?: string): string[] {
  // Auto-detect delimiter if not provided
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
        i++; // skip escaped quote
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
 * Parses raw CSV/TSV string containing Google Form / Sheet submission rows:
 * Timestamp, Email, Team Leader Name, Email, Team Name, Sem, Phone, Enrollment,
 * Members 1-5 (Name, Enrollment, Phone, Gmail),
 * SIH PPT Link, Problem Statement Theme, PS ID
 */
export function parseTeamsCSV(csvContent: string): ParsedCSVOutput {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { records: [], errors: ['Content is empty.'], headers: [], totalRowsFound: 0 };
  }

  // Detect delimiter across first few lines
  const firstSample = lines.slice(0, 3).join('\n');
  const delimiter = firstSample.includes('\t') ? '\t' : (firstSample.includes(';') && !firstSample.includes(',') ? ';' : ',');

  const errors: string[] = [];
  const records: CSVTeamRecord[] = [];

  // Parse first row to identify headers
  const firstRow = parseCSVLine(lines[0], delimiter);
  const lowerFirstRow = firstRow.map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  let timestampColIdx = -1;
  let emailColIdx = -1;
  let leaderNameColIdx = -1;
  let leaderEmailColIdx = -1;
  let teamNameColIdx = -1;
  let leaderSemColIdx = -1;
  let leaderPhoneColIdx = -1;
  let leaderEnrollColIdx = -1;

  // Members 1 to 5 indices
  interface MemberColIndices {
    nameIdx: number;
    enrollIdx: number;
    phoneIdx: number;
    gmailIdx: number;
  }
  const membersCols: MemberColIndices[] = [
    { nameIdx: -1, enrollIdx: -1, phoneIdx: -1, gmailIdx: -1 },
    { nameIdx: -1, enrollIdx: -1, phoneIdx: -1, gmailIdx: -1 },
    { nameIdx: -1, enrollIdx: -1, phoneIdx: -1, gmailIdx: -1 },
    { nameIdx: -1, enrollIdx: -1, phoneIdx: -1, gmailIdx: -1 },
    { nameIdx: -1, enrollIdx: -1, phoneIdx: -1, gmailIdx: -1 }
  ];

  let driveColIdx = -1;
  let themeColIdx = -1;
  let psIdColIdx = -1;
  let problemStmtColIdx = -1;
  let collegeColIdx = -1;

  // Header detection loop
  lowerFirstRow.forEach((h, idx) => {
    if (h.includes('timestamp')) {
      timestampColIdx = idx;
    } else if (h.includes('teamleadername') || (h.includes('leader') && h.includes('name'))) {
      leaderNameColIdx = idx;
    } else if (h.includes('teamleaderemail') || (h.includes('leader') && h.includes('email'))) {
      leaderEmailColIdx = idx;
    } else if (h.includes('teamleaderphone') || (h.includes('leader') && h.includes('phone'))) {
      leaderPhoneColIdx = idx;
    } else if (h.includes('teamleaderenrol') || (h.includes('leader') && h.includes('enrol'))) {
      leaderEnrollColIdx = idx;
    } else if (h.includes('teamleadersem') || (h.includes('leader') && h.includes('sem'))) {
      leaderSemColIdx = idx;
    } else if (h.includes('teamname') || (h.includes('squad') && h.includes('name')) || (h === 'team') || (h === 'squad')) {
      teamNameColIdx = idx;
    } else if (h.includes('emailaddress') || (h === 'email' && emailColIdx === -1)) {
      emailColIdx = idx;
    } else if (h.includes('uploadyoursih') || h.includes('ppt') || h.includes('pdf') || (h.includes('drive') && !h.includes('theme'))) {
      driveColIdx = idx;
    } else if (h.includes('psid') || h.includes('problemid') || h.includes('sihid') || h.includes('problemstatementid')) {
      psIdColIdx = idx;
    } else if (h.includes('theme') || h.includes('track') || h.includes('domain')) {
      themeColIdx = idx;
    } else if (h.includes('statement') || h.includes('description') || h.includes('abstract')) {
      problemStmtColIdx = idx;
    } else if (h.includes('college') || h.includes('institute')) {
      collegeColIdx = idx;
    }

    // Check member 1 to 5 columns
    for (let m = 1; m <= 5; m++) {
      const mStr = `${m}`;
      if (h.includes(`member${mStr}`) || h.includes(`member ${mStr}`)) {
        if (h.includes('enrol')) {
          membersCols[m - 1].enrollIdx = idx;
        } else if (h.includes('phone') || h.includes('mobile')) {
          membersCols[m - 1].phoneIdx = idx;
        } else if (h.includes('gmail') || h.includes('email') || h.includes('mail')) {
          membersCols[m - 1].gmailIdx = idx;
        } else if (h.includes('name') || h === `teammember${mStr}` || h === `member${mStr}`) {
          membersCols[m - 1].nameIdx = idx;
        }
      } else if (h.includes('enrol') && h.includes(`${mStr}`)) {
        membersCols[m - 1].enrollIdx = idx;
      } else if ((h.includes('phone') || h.includes('mobile')) && h.includes(`${mStr}`)) {
        membersCols[m - 1].phoneIdx = idx;
      } else if ((h.includes('gmail') || h.includes('email')) && h.includes(`${mStr}`)) {
        membersCols[m - 1].gmailIdx = idx;
      }
    }
  });

  const hasHeader = teamNameColIdx !== -1 || driveColIdx !== -1 || psIdColIdx !== -1 || leaderNameColIdx !== -1;
  const startIndex = hasHeader ? 1 : 0;

  // Fallbacks if columns not identified
  if (!hasHeader) {
    teamNameColIdx = 0;
    themeColIdx = 1;
    driveColIdx = 2;
  } else {
    if (teamNameColIdx === -1) teamNameColIdx = 4; // in user's structure: column 4 is Team Name
    if (driveColIdx === -1) driveColIdx = firstRow.length - 3;
    if (themeColIdx === -1) themeColIdx = firstRow.length - 2;
    if (psIdColIdx === -1) psIdColIdx = firstRow.length - 1;
  }

  for (let i = startIndex; i < lines.length; i++) {
    const rawLine = lines[i];
    const columns = parseCSVLine(rawLine, delimiter);

    if (columns.length === 0 || columns.every((c) => !c)) {
      continue;
    }

    const teamName = (columns[teamNameColIdx] || '').trim();
    if (!teamName) {
      errors.push(`Row ${i + 1}: Skipped row due to missing Team Name.`);
      continue;
    }

    const leaderName = leaderNameColIdx !== -1 ? (columns[leaderNameColIdx] || '').trim() : '';
    const leaderEmail = leaderEmailColIdx !== -1 ? (columns[leaderEmailColIdx] || '').trim() : (emailColIdx !== -1 ? (columns[emailColIdx] || '').trim() : '');
    const leaderPhone = leaderPhoneColIdx !== -1 ? (columns[leaderPhoneColIdx] || '').trim() : '';
    const leaderEnroll = leaderEnrollColIdx !== -1 ? (columns[leaderEnrollColIdx] || '').trim() : '';
    const leaderSem = leaderSemColIdx !== -1 ? (columns[leaderSemColIdx] || '').trim() : '';
    const timestamp = timestampColIdx !== -1 ? (columns[timestampColIdx] || '').trim() : '';

    let driveLink = driveColIdx !== -1 ? (columns[driveColIdx] || '').trim() : '';
    if (driveLink && !driveLink.startsWith('http://') && !driveLink.startsWith('https://')) {
      driveLink = `https://${driveLink}`;
    }

    const rawTheme = themeColIdx !== -1 ? (columns[themeColIdx] || '').trim() : '';
    const rawPsId = psIdColIdx !== -1 ? (columns[psIdColIdx] || '').trim() : '';
    let problemStatement = problemStmtColIdx !== -1 ? (columns[problemStmtColIdx] || '').trim() : '';

    // If official PS ID provided, look up problem statement title & description
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
    const college = collegeColIdx !== -1 ? (columns[collegeColIdx] || '').trim() : 'Technocrats Institute of Technology (TIT), Bhopal';

    // Parse team members 1 to 5
    const membersList: { name: string; enrollment?: string; phone?: string; email?: string }[] = [];
    membersCols.forEach((mCols, mIdx) => {
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
    totalRowsFound: lines.length - startIndex
  };
}

/**
 * Returns sample CSV content in the exact Google Form format provided by the user
 */
export function getSampleCSVContent(): string {
  const headers = [
    'Timestamp',
    'Email address',
    'Team Leader name',
    'Team Leader Email',
    'Team Name',
    'Team Leader Sem',
    'Team Leader Phone number',
    'Team leader Enrollement',
    'Team member 1 name',
    'Enrollement Team member 1',
    'Team member 1 phone number',
    'Team member 1 gmail id',
    'Team member 2 name',
    'Enrollement Team member 2',
    'Team member 2  phone number',
    'Team member 2 gmail',
    'Team member 3 name',
    'Enrollement Team member 3',
    'Team member 3 phone number',
    'Team member 3 gmail',
    'Team member 4',
    'Enrollement Team member 4',
    'Team member 4 phone number',
    'Team member 4 gmail',
    'Team member 5',
    'Enrollement Team member 5',
    'Team member 5 phone number',
    'Team member 5 gmail',
    'Upload your SIH 2026 PPT in pdf format ( carefully note : only 6 slide are allowed)',
    'Mention you SIH2026 Problem statement theme',
    'Mention you SIH2026 Problem statement ID (PS ID)'
  ].join('\t');

  const row1 = [
    '2026-09-27 10:15:00',
    'cyberhexofficial@gmail.com',
    'Aarav Sharma',
    'aarav.sharma@titbhopal.ac.in',
    'CyberHex Titans',
    '7th',
    '+91 98260 12345',
    '0191CS221001',
    'Priya Verma',
    '0191CS221045',
    '+91 98260 12346',
    'priya.verma@gmail.com',
    'Rohan Gupta',
    '0191IT221012',
    '+91 98260 12347',
    'rohan.gupta@gmail.com',
    'Sneha Patel',
    '0191EC221034',
    '+91 98260 12348',
    'sneha.patel@gmail.com',
    'Aditya Joshi',
    '0191CS221089',
    '+91 98260 12349',
    'aditya.joshi@gmail.com',
    'Ananya Mishra',
    '0191CS221015',
    '+91 98260 12350',
    'ananya.mishra@gmail.com',
    'https://drive.google.com/file/d/1TIT_SIH_Presentation_CyberHex/preview',
    'AI & Robotics',
    'SIH1601'
  ].join('\t');

  return `${headers}\n${row1}`;
}
