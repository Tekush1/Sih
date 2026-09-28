import { Team, Stage, ScheduleSlot, AuditLog, TeamTrack, SlideData } from '../types';

export const STAGES_INITIAL: Stage[] = [
  {
    id: 'stage-alpha',
    name: 'Stage Alpha',
    track: 'AI & Robotics',
    location: 'TIT Main Auditorium · Quantum Arena',
    status: 'ACTIVE',
    operatorName: 'Dr. Sarah Vance (TIT CSE)',
    currentTeamId: ''
  },
  {
    id: 'stage-beta',
    name: 'Stage Beta',
    track: 'Web3 & Cloud',
    location: 'TIT Cyber Block · Pavilion B',
    status: 'ACTIVE',
    operatorName: 'Prof. Alex Mercer (TIT IT)',
    currentTeamId: ''
  },
  {
    id: 'stage-gamma',
    name: 'Stage Gamma',
    track: 'HealthTech & Bio',
    location: 'TIT BioTech Wing · Hall C',
    status: 'ACTIVE',
    operatorName: 'Dr. Elena Rostova (TIT EC)',
    currentTeamId: ''
  },
  {
    id: 'stage-delta',
    name: 'Stage Delta',
    track: 'Smart Cities & IoT',
    location: 'TIT Central Innovation Hub · Hall D',
    status: 'ACTIVE',
    operatorName: 'Prof. Marcus Thorne (TIT ME/IoT)',
    currentTeamId: ''
  }
];

export function generateSlideDeck(teamName: string, track: TeamTrack, problemStatement?: string, psId?: string): SlideData[] {
  const titles = [
    '01. Problem Statement & Root Cause',
    '02. Proposed System Architecture',
    '03. Innovation & Tech Stack',
    '04. Live Prototype Demonstration',
    '05. Impact & Feasibility',
    '06. Roadmap & Team Conclusion'
  ];
  const categories: SlideData['category'][] = [
    'Problem Statement',
    'Architecture & Solution',
    'Core Innovation & Tech Stack',
    'Live Prototype & Demo',
    'Business Impact & Feasibility',
    'Roadmap, Team & Conclusion'
  ];
  const durations = [10, 60, 60, 40, 40, 20];

  return titles.map((title, i) => ({
    slideNumber: i + 1,
    durationSeconds: durations[i],
    title,
    subtitle: problemStatement || `${track} Solution by ${teamName}${psId ? ` (${psId})` : ''}`,
    category: categories[i],
    bulletPoints: [
      `Key pitch objective for ${teamName} (${track})`,
      'Demonstrated alignment with Smart India Hackathon 2026 guidelines'
    ],
    speakerNotes: `Slide ${i + 1} presentation guidance`
  }));
}

export function generateSeedTeams(): { teams: Team[]; schedules: ScheduleSlot[]; auditLogs: AuditLog[] } {
  // Clean initial state: zero fake dummy squads, ready for user's CSV data
  return { teams: [], schedules: [], auditLogs: [] };
}
