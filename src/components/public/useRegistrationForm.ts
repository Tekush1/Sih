import { useState } from 'react';
import { TeamTrack, Team } from '../../types';
import { 
  fetchSIHProblemStatementById, 
  SIHProblemStatement,
  OFFICIAL_SIH_PROBLEM_STATEMENTS
} from '../../data/sihProblemStatements';
import { useHackathon } from '../../context/HackathonContext';

interface UseRegistrationFormProps {
  onTeamRegistered: (team: Team) => void;
  setRegisteredSuccess: (team: Team | null) => void;
}

export function useRegistrationForm({ onTeamRegistered, setRegisteredSuccess }: UseRegistrationFormProps) {
  const { registerTeam } = useHackathon();

  // SIH Live Fetcher State
  const [psIdInput, setPsIdInput] = useState<string>('SIH1609');
  const [isFetchingSIH, setIsFetchingSIH] = useState<boolean>(false);
  const [sihFeedback, setSihFeedback] = useState<{ type: 'success' | 'error'; message: string; data?: SIHProblemStatement } | null>({
    type: 'success',
    message: 'Loaded verified Smart India Hackathon problem statement from sih.gov.in',
    data: OFFICIAL_SIH_PROBLEM_STATEMENTS[1]
  });
  const [isSIHModalOpen, setIsSIHModalOpen] = useState<boolean>(false);

  // Form Fields
  const [teamName, setTeamName] = useState<string>('');
  const [campus, setCampus] = useState<string>('Technocrats Institute of Technology (Main Campus), Bhopal');
  const [department, setDepartment] = useState<string>('Department of Computer Science & Engineering (CSE)');
  const [track, setTrack] = useState<TeamTrack>('AI & Robotics');
  const [psId, setPsId] = useState<string>('SIH1609');
  const [sihOrg, setSihOrg] = useState<string>('Ministry of Education / AICTE');
  const [sihCategory, setSihCategory] = useState<'Software' | 'Hardware'>('Software');
  const [problemStatement, setProblemStatement] = useState<string>(
    'Next-Gen University Alumni Engagement, Mentorship & Micro-Endowment Platform'
  );
  const [abstract, setAbstract] = useState<string>(
    'An intelligent portal enabling verified alumni tracking, automated student-alumni micro-mentoring matching, career path analytics, and transparent project-based micro-endowments.'
  );

  // Leader
  const [leaderName, setLeaderName] = useState<string>('');
  const [leaderEmail, setLeaderEmail] = useState<string>('');
  const [leaderPhone, setLeaderPhone] = useState<string>('');

  // Members 2, 3, 4
  const [m2Name, setM2Name] = useState<string>('');
  const [m2Email, setM2Email] = useState<string>('');
  const [m3Name, setM3Name] = useState<string>('');
  const [m3Email, setM3Email] = useState<string>('');
  const [m4Name, setM4Name] = useState<string>('');
  const [m4Email, setM4Email] = useState<string>('');

  const handleFetchSIH = async () => {
    const targetId = psIdInput.trim();
    if (!targetId) return;

    setIsFetchingSIH(true);
    setSihFeedback(null);

    const result = await fetchSIHProblemStatementById(targetId);
    setIsFetchingSIH(false);

    if (result.status === 'SUCCESS' && result.data) {
      const ps = result.data;
      setPsId(ps.id);
      setProblemStatement(ps.title);
      setAbstract(ps.description);
      setSihOrg(ps.organization);
      setSihCategory(ps.category);

      setSihFeedback({
        type: 'success',
        message: `✓ Fetched PS ID ${ps.id} from sih.gov.in (${result.latencyMs}ms)`,
        data: ps
      });
    } else {
      setSihFeedback({
        type: 'error',
        message: result.message || `Problem Statement ID "${targetId}" not found.`
      });
    }
  };

  const handleSelectFromModal = (ps: SIHProblemStatement) => {
    setPsId(ps.id);
    setPsIdInput(ps.id);
    setProblemStatement(ps.title);
    setAbstract(ps.description);
    setSihOrg(ps.organization);
    setSihCategory(ps.category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !leaderName.trim() || !leaderEmail.trim()) {
      alert('Please fill out all required team and leader fields.');
      return;
    }

    const members = [
      { id: 'm-2', name: m2Name || 'Co-Developer', email: m2Email || 'dev2@technocrats.org', role: 'MEMBER' as const, college: campus, phone: '9827000000', specialization: 'ML Engineer' },
      { id: 'm-3', name: m3Name || 'Fullstack Engineer', email: m3Email || 'dev3@technocrats.org', role: 'MEMBER' as const, college: campus, phone: '9827000000', specialization: 'Frontend & UI' },
      { id: 'm-4', name: m4Name || 'QA & Systems', email: m4Email || 'dev4@technocrats.org', role: 'MEMBER' as const, college: campus, phone: '9827000000', specialization: 'QA & Systems' }
    ].filter((m) => m.name.trim() !== '');

    const newTeam = registerTeam({
      name: teamName.trim(),
      college: campus,
      track,
      psId: psId.trim(),
      sihOrganization: sihOrg.trim(),
      problemStatement: problemStatement.trim(),
      abstract: abstract.trim(),
      leaderName: leaderName.trim(),
      leaderEmail: leaderEmail.trim(),
      leaderPhone: leaderPhone.trim(),
      members
    });

    setRegisteredSuccess(newTeam);
    onTeamRegistered(newTeam);
  };

  return {
    psIdInput,
    setPsIdInput,
    isFetchingSIH,
    sihFeedback,
    isSIHModalOpen,
    setIsSIHModalOpen,
    teamName,
    setTeamName,
    campus,
    setCampus,
    department,
    setDepartment,
    track,
    setTrack,
    psId,
    setPsId,
    sihOrg,
    setSihOrg,
    sihCategory,
    setSihCategory,
    problemStatement,
    setProblemStatement,
    abstract,
    setAbstract,
    leaderName,
    setLeaderName,
    leaderEmail,
    setLeaderEmail,
    leaderPhone,
    setLeaderPhone,
    m2Name,
    setM2Name,
    m2Email,
    setM2Email,
    m3Name,
    setM3Name,
    m3Email,
    setM3Email,
    m4Name,
    setM4Name,
    m4Email,
    setM4Email,
    handleFetchSIH,
    handleSelectFromModal,
    handleSubmit
  };
}
