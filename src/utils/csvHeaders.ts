export interface MemberColIndices {
  nameIdx: number;
  enrollIdx: number;
  phoneIdx: number;
  gmailIdx: number;
}

export interface CSVHeaderMapping {
  timestampColIdx: number;
  emailColIdx: number;
  leaderNameColIdx: number;
  leaderEmailColIdx: number;
  teamNameColIdx: number;
  leaderSemColIdx: number;
  leaderPhoneColIdx: number;
  leaderEnrollColIdx: number;
  driveColIdx: number;
  themeColIdx: number;
  psIdColIdx: number;
  problemStmtColIdx: number;
  collegeColIdx: number;
  membersCols: MemberColIndices[];
  hasHeader: boolean;
  startIndex: number;
}

export function detectCSVHeaders(firstRow: string[]): CSVHeaderMapping {
  const lowerFirstRow = firstRow.map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  let timestampColIdx = -1;
  let emailColIdx = -1;
  let leaderNameColIdx = -1;
  let leaderEmailColIdx = -1;
  let teamNameColIdx = -1;
  let leaderSemColIdx = -1;
  let leaderPhoneColIdx = -1;
  let leaderEnrollColIdx = -1;
  let driveColIdx = -1;
  let themeColIdx = -1;
  let psIdColIdx = -1;
  let problemStmtColIdx = -1;
  let collegeColIdx = -1;

  const membersCols: MemberColIndices[] = [
    { nameIdx: -1, enrollIdx: -1, phoneIdx: -1, gmailIdx: -1 },
    { nameIdx: -1, enrollIdx: -1, phoneIdx: -1, gmailIdx: -1 },
    { nameIdx: -1, enrollIdx: -1, phoneIdx: -1, gmailIdx: -1 },
    { nameIdx: -1, enrollIdx: -1, phoneIdx: -1, gmailIdx: -1 },
    { nameIdx: -1, enrollIdx: -1, phoneIdx: -1, gmailIdx: -1 }
  ];

  lowerFirstRow.forEach((h, idx) => {
    if (h.includes('timestamp')) timestampColIdx = idx;
    else if (h.includes('teamleadername') || (h.includes('leader') && h.includes('name'))) leaderNameColIdx = idx;
    else if (h.includes('teamleaderemail') || (h.includes('leader') && h.includes('email'))) leaderEmailColIdx = idx;
    else if (h.includes('teamleaderphone') || (h.includes('leader') && h.includes('phone'))) leaderPhoneColIdx = idx;
    else if (h.includes('teamleaderenrol') || (h.includes('leader') && h.includes('enrol'))) leaderEnrollColIdx = idx;
    else if (h.includes('teamleadersem') || (h.includes('leader') && h.includes('sem'))) leaderSemColIdx = idx;
    else if (h.includes('teamname') || (h.includes('squad') && h.includes('name')) || h === 'team' || h === 'squad') teamNameColIdx = idx;
    else if (h.includes('emailaddress') || (h === 'email' && emailColIdx === -1)) emailColIdx = idx;
    else if (h.includes('uploadyoursih') || h.includes('ppt') || h.includes('pdf') || (h.includes('drive') && !h.includes('theme'))) driveColIdx = idx;
    else if (h.includes('psid') || h.includes('problemid') || h.includes('sihid') || h.includes('problemstatementid')) psIdColIdx = idx;
    else if (h.includes('theme') || h.includes('track') || h.includes('domain')) themeColIdx = idx;
    else if (h.includes('statement') || h.includes('description') || h.includes('abstract')) problemStmtColIdx = idx;
    else if (h.includes('college') || h.includes('institute')) collegeColIdx = idx;

    for (let m = 1; m <= 5; m++) {
      const mStr = `${m}`;
      if (h.includes(`member${mStr}`) || h.includes(`member ${mStr}`)) {
        if (h.includes('enrol')) membersCols[m - 1].enrollIdx = idx;
        else if (h.includes('phone') || h.includes('mobile')) membersCols[m - 1].phoneIdx = idx;
        else if (h.includes('gmail') || h.includes('email') || h.includes('mail')) membersCols[m - 1].gmailIdx = idx;
        else if (h.includes('name') || h === `teammember${mStr}` || h === `member${mStr}`) membersCols[m - 1].nameIdx = idx;
      } else if (h.includes('enrol') && h.includes(mStr)) {
        membersCols[m - 1].enrollIdx = idx;
      } else if ((h.includes('phone') || h.includes('mobile')) && h.includes(mStr)) {
        membersCols[m - 1].phoneIdx = idx;
      } else if ((h.includes('gmail') || h.includes('email')) && h.includes(mStr)) {
        membersCols[m - 1].gmailIdx = idx;
      }
    }
  });

  const hasHeader = teamNameColIdx !== -1 || driveColIdx !== -1 || psIdColIdx !== -1 || leaderNameColIdx !== -1;
  const startIndex = hasHeader ? 1 : 0;

  if (!hasHeader) {
    teamNameColIdx = 0;
    themeColIdx = 1;
    driveColIdx = 2;
  } else {
    if (teamNameColIdx === -1) teamNameColIdx = 4;
    if (driveColIdx === -1) driveColIdx = firstRow.length - 3;
    if (themeColIdx === -1) themeColIdx = firstRow.length - 2;
    if (psIdColIdx === -1) psIdColIdx = firstRow.length - 1;
  }

  return {
    timestampColIdx,
    emailColIdx,
    leaderNameColIdx,
    leaderEmailColIdx,
    teamNameColIdx,
    leaderSemColIdx,
    leaderPhoneColIdx,
    leaderEnrollColIdx,
    driveColIdx,
    themeColIdx,
    psIdColIdx,
    problemStmtColIdx,
    collegeColIdx,
    membersCols,
    hasHeader,
    startIndex
  };
}
