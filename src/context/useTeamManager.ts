import { useState } from 'react';
import { Team, TeamTrack, PPTSubmission, QRPass, SlideData } from '../types';
import { generateSlideDeck } from '../data/seedData';

export function useTeamManager(
  storageKey: string,
  addAuditLog: (action: string, actor: string, details: string, category: any, teamId?: string) => void
) {
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const stored = localStorage.getItem(`${storageKey}_teams`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const registerTeam = (data: {
    name: string;
    college: string;
    track: TeamTrack;
    psId?: string;
    sihOrganization?: string;
    problemStatement: string;
    abstract: string;
    leaderName: string;
    leaderEmail: string;
    leaderPhone: string;
    members: any[];
  }): Team => {
    const nextNum = teams.length + 1;
    const teamId = `SH26-${String(nextNum).padStart(3, '0')}`;
    const stageId = data.track === 'AI & Robotics' ? 'stage-alpha' : data.track === 'Web3 & Cloud' ? 'stage-beta' : data.track === 'HealthTech & Bio' ? 'stage-gamma' : 'stage-delta';
    const driveFolder = `https://drive.google.com/drive/folders/smart26_team_${teamId.toLowerCase()}`;

    const newTeam: Team = {
      id: teamId,
      name: data.name,
      college: data.college || 'Technocrats Institute of Technology (TIT), Bhopal',
      track: data.track,
      psId: data.psId,
      sihOrganization: data.sihOrganization,
      problemStatement: data.problemStatement,
      abstract: data.abstract,
      leaderName: data.leaderName,
      leaderEmail: data.leaderEmail,
      leaderPhone: data.leaderPhone,
      members: data.members.map((m: any, idx: number) => ({
        id: `m-${teamId}-${idx + 2}`,
        name: m.name,
        email: m.email,
        phone: m.phone || '9827000000',
        role: 'MEMBER' as const,
        college: data.college || 'TIT Bhopal',
        specialization: m.specialization || 'Fullstack'
      })),
      createdAt: new Date().toISOString(),
      passcode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      googleFormSubmissionId: `GF-${Math.floor(100000 + Math.random() * 900000)}`,
      googleDriveFolder: driveFolder,
      stageId
    };

    setTeams((prev) => [newTeam, ...prev]);
    addAuditLog('NEW_TEAM_REGISTERED', data.leaderName, `Registered ${newTeam.name} (${newTeam.id})`, 'REGISTRATION', teamId);
    return newTeam;
  };

  const uploadPPT = async (teamId: string, file: File, customSlides?: SlideData[]): Promise<PPTSubmission> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const team = teams.find((t) => t.id === teamId);
    if (!team) throw new Error('Team not found');

    const slides = customSlides || generateSlideDeck(team.name, team.track, team.problemStatement, team.psId);
    const submission: PPTSubmission = {
      id: `sub-${Date.now()}`,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: file.name.endsWith('.pdf') ? 'PDF' : 'PPTX',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      version: 'v1.0',
      googleDriveFolderUrl: team.googleDriveFolder,
      googleDriveFileUrl: `${team.googleDriveFolder}/${encodeURIComponent(file.name)}`,
      status: 'APPROVED',
      slidesCount: slides.length,
      slides
    };

    setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, submission } : t)));
    addAuditLog('PPT_UPLOADED', team.leaderName, `Uploaded ${file.name}`, 'PPT_UPLOAD', teamId);
    return submission;
  };

  const approvePPT = (teamId: string, notes?: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId || !t.submission) return t;
        const updatedSub: PPTSubmission = {
          ...t.submission,
          status: 'APPROVED',
          reviewedBy: 'Admin Committee',
          reviewedAt: new Date().toISOString(),
          reviewNotes: notes || 'Approved'
        };
        const qrPass: QRPass = {
          token: `QR-TIT-${teamId}-${Date.now().toString(36).toUpperCase()}`,
          teamId,
          issuedAt: new Date().toISOString(),
          qrPayload: JSON.stringify({ teamId, name: t.name, stage: t.stageId }),
          verificationHash: `SHA256-${Math.random().toString(36).substring(2, 10)}`,
          isValid: true
        };
        return { ...t, submission: updatedSub, qrPass };
      })
    );
    addAuditLog('PPT_APPROVED', 'Admin Committee', `Approved PPT for ${teamId}`, 'APPROVAL', teamId);
  };

  const rejectPPT = (teamId: string, notes: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId || !t.submission) return t;
        return { ...t, submission: { ...t.submission, status: 'CHANGES_REQUESTED', reviewNotes: notes } };
      })
    );
    addAuditLog('PPT_REJECTED', 'Admin Committee', `Requested revisions: ${notes}`, 'APPROVAL', teamId);
  };

  const generateQRPassForTeam = (teamId: string): QRPass => {
    const team = teams.find((t) => t.id === teamId);
    const pass: QRPass = {
      token: `QR-TIT-${teamId}-${Date.now().toString(36).toUpperCase()}`,
      teamId,
      issuedAt: new Date().toISOString(),
      qrPayload: JSON.stringify({ teamId, name: team?.name, stage: team?.stageId }),
      verificationHash: `SHA256-${Math.random().toString(36).substring(2, 10)}`,
      isValid: true
    };
    setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, qrPass: pass } : t)));
    return pass;
  };

  const updateTeamDriveUrl = (teamId: string, driveUrl: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        const sub = t.submission ? { ...t.submission, googleDriveFileUrl: driveUrl } : undefined;
        return { ...t, googleDriveFolder: driveUrl, submission: sub };
      })
    );
  };

  return {
    teams,
    setTeams,
    registerTeam,
    uploadPPT,
    approvePPT,
    rejectPPT,
    generateQRPassForTeam,
    updateTeamDriveUrl
  };
}
