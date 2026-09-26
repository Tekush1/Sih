export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAGE_OPERATOR' | 'TEAM' | 'PUBLIC';

export type TeamTrack = 'AI & Robotics' | 'Web3 & Cloud' | 'HealthTech & Bio' | 'Smart Cities & IoT';

export type SubmissionStatus = 'NOT_SUBMITTED' | 'UNDER_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'REJECTED';

export type PresentationStatus = 'NOT_SCHEDULED' | 'SCHEDULED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'ABSENT';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'LEADER' | 'MEMBER';
  college: string;
  phone: string;
  github?: string;
  specialization?: string;
}

export interface SlideData {
  slideNumber: number;
  durationSeconds: number; // 60s
  title: string;
  subtitle: string;
  category: 'Problem Statement' | 'Architecture & Solution' | 'Core Innovation & Tech Stack' | 'Live Prototype & Demo' | 'Business Impact & Feasibility' | 'Roadmap, Team & Conclusion';
  bulletPoints: string[];
  metrics?: { label: string; value: string }[];
  codeSnippet?: string;
  diagramType?: 'pipeline' | 'architecture' | 'network' | 'metrics' | 'stats';
  speakerNotes?: string;
}

export interface PPTSubmission {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: 'PPTX' | 'PDF';
  uploadedAt: string;
  version: string;
  googleDriveFolderUrl: string;
  googleDriveFileUrl: string;
  status: SubmissionStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  slidesCount: number;
  slides: SlideData[];
}

export interface QRPass {
  token: string;
  teamId: string;
  issuedAt: string;
  qrPayload: string;
  verificationHash: string;
  isValid: boolean;
}

export interface Stage {
  id: string;
  name: string;
  track: TeamTrack;
  location: string;
  currentTeamId?: string;
  status: 'ACTIVE' | 'IDLE' | 'BREAK';
  operatorName: string;
}

export interface ScheduleSlot {
  id: string;
  stageId: string;
  teamId: string;
  startTime: string; // e.g., "14:00"
  endTime: string;   // e.g., "14:06"
  durationMinutes: number;
  date: string;
  status: PresentationStatus;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  teamId?: string;
  details: string;
  category: 'REGISTRATION' | 'PPT_UPLOAD' | 'APPROVAL' | 'QR_PASS' | 'STAGE_CHECKIN' | 'PRESENTATION' | 'SYSTEM';
}

export interface Team {
  id: string; // e.g. "SH26-001"
  name: string;
  college: string;
  track: TeamTrack;
  psId?: string; // e.g. "SIH1601", "SIH1609" from sih.gov.in
  sihOrganization?: string;
  problemStatement: string;
  abstract: string;
  leaderName: string;
  leaderEmail: string;
  members: TeamMember[];
  createdAt: string;
  passcode: string;
  googleFormSubmissionId: string;
  googleDriveFolder: string;
  submission?: PPTSubmission;
  qrPass?: QRPass;
  stageId?: string;
  scheduledSlot?: ScheduleSlot;
  scores?: {
    innovation: number;
    technical: number;
    feasibility: number;
    presentation: number;
    total: number;
    judgeNotes: string;
  };
}

export interface HackathonStats {
  totalTeams: number;
  totalParticipants: number;
  pptSubmissions: number;
  pptApproved: number;
  completedPresentations: number;
  activeStages: number;
  tracksBreakdown: Record<TeamTrack, number>;
}

export const DEFAULT_SLIDE_DURATIONS = [10, 60, 60, 40, 40, 20]; // 1st: 10s, 2nd: 60s (1m), 3rd: 60s (1m), 4th: 40s, 5th: 40s, 6th: 20s

export interface ScreenLiveState {
  teamId: string;
  slideIndex: number;
  slideRemainingSeconds: number; // Remaining time on active slide (e.g. 10s for slide 1)
  slideDurations: number[]; // [10, 60, 60, 40, 40, 20]
  totalRemainingSeconds: number; // Total pitch countdown (sum of remaining time)
  totalPitchSeconds: number; // 230 seconds
  remainingSeconds: number; // backwards compatibility alias for totalRemainingSeconds
  totalSeconds: number; // backwards compatibility alias for totalPitchSeconds
  isRunning: boolean;
  autoAdvance: boolean;
  isFinished?: boolean;
  lastUpdated: number;
  announcedMessage?: string;
}

export interface QueueItem {
  id: string;
  teamId: string;
  customDurationMinutes?: number;
  status: 'NOW_PRESENTING' | 'NEXT_UP' | 'QUEUED' | 'COMPLETED';
  orderIndex: number;
}
