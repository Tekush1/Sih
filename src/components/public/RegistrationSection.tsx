import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { TeamTrack, Team } from '../../types';
import { 
  FileSpreadsheet, 
  FileCheck, 
  Sparkles, 
  CheckCircle2, 
  FolderSync, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Code2, 
  ExternalLink,
  Globe,
  Building2,
  RefreshCw,
  Search,
  Check,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  fetchSIHProblemStatementById, 
  SIHProblemStatement,
  OFFICIAL_SIH_PROBLEM_STATEMENTS
} from '../../data/sihProblemStatements';
import { SIHProblemModal } from '../sih/SIHProblemModal';

interface RegistrationSectionProps {
  onTeamRegistered: (team: Team) => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({ onTeamRegistered }) => {
  const { registerTeam, teams, syncGoogleSheets } = useHackathon();

  const [activeTab, setActiveTab] = useState<'form' | 'sheets' | 'google-form-embed'>('form');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<Team | null>(null);

  // SIH Live Fetcher State
  const [psIdInput, setPsIdInput] = useState<string>('SIH1609');
  const [isFetchingSIH, setIsFetchingSIH] = useState<boolean>(false);
  const [sihFeedback, setSihFeedback] = useState<{ type: 'success' | 'error'; message: string; data?: SIHProblemStatement } | null>({
    type: 'success',
    message: 'Loaded verified Smart India Hackathon problem statement from sih.gov.in',
    data: OFFICIAL_SIH_PROBLEM_STATEMENTS[1] // SIH1609 default
  });
  const [isSIHModalOpen, setIsSIHModalOpen] = useState<boolean>(false);

  // Form Fields - Defaulted to Technocrats Institute of Technology (TIT), Bhopal
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
  const [m2Spec, setM2Spec] = useState<string>('ML Engineer');

  const [m3Name, setM3Name] = useState<string>('');
  const [m3Email, setM3Email] = useState<string>('');
  const [m3Spec, setM3Spec] = useState<string>('Frontend & UI/UX');

  const [m4Name, setM4Name] = useState<string>('');
  const [m4Email, setM4Email] = useState<string>('');
  const [m4Spec, setM4Spec] = useState<string>('Systems & Testing');

  // Handle live SIH PS ID fetch
  const handleFetchSIH = async (idToFetch?: string) => {
    const targetId = (idToFetch || psIdInput).trim();
    if (!targetId) return;

    setIsFetchingSIH(true);
    setSihFeedback(null);

    const result = await fetchSIHProblemStatementById(targetId);
    setIsFetchingSIH(false);

    if (result.status === 'SUCCESS' && result.data) {
      const ps = result.data;
      setPsId(ps.id);
      setPsIdInput(ps.id);
      setProblemStatement(ps.title);
      setAbstract(ps.description);
      setSihOrg(ps.organization);
      setSihCategory(ps.category);

      // Map track intelligently
      if (ps.theme.toLowerCase().includes('robot') || ps.theme.toLowerCase().includes('ai') || ps.title.toLowerCase().includes('drone')) {
        setTrack('AI & Robotics');
      } else if (ps.theme.toLowerCase().includes('health') || ps.theme.toLowerCase().includes('bio') || ps.theme.toLowerCase().includes('med')) {
        setTrack('HealthTech & Bio');
      } else if (ps.theme.toLowerCase().includes('smart') || ps.theme.toLowerCase().includes('vehicle') || ps.theme.toLowerCase().includes('clean')) {
        setTrack('Smart Cities & IoT');
      } else {
        setTrack('Web3 & Cloud');
      }

      setSihFeedback({
        type: 'success',
        message: `✓ Fetched PS ID ${ps.id} from sih.gov.in (${result.latencyMs}ms) • ${ps.category} Edition • ${ps.organization}`,
        data: ps
      });
    } else {
      setSihFeedback({
        type: 'error',
        message: result.message || `Problem Statement ID "${targetId}" not found on sih.gov.in`
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

    if (ps.theme.toLowerCase().includes('robot') || ps.theme.toLowerCase().includes('ai') || ps.title.toLowerCase().includes('drone')) {
      setTrack('AI & Robotics');
    } else if (ps.theme.toLowerCase().includes('health') || ps.theme.toLowerCase().includes('bio') || ps.theme.toLowerCase().includes('med')) {
      setTrack('HealthTech & Bio');
    } else if (ps.theme.toLowerCase().includes('smart') || ps.theme.toLowerCase().includes('vehicle') || ps.theme.toLowerCase().includes('clean')) {
      setTrack('Smart Cities & IoT');
    } else {
      setTrack('Web3 & Cloud');
    }

    setSihFeedback({
      type: 'success',
      message: `✓ Selected ${ps.id} from official catalog • ${ps.organization}`,
      data: ps
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !leaderName || !leaderEmail) {
      alert('Please fill out all required team and leader details.');
      return;
    }

    const fullCollege = `${campus} (${department})`;

    const createdTeam = registerTeam({
      name: teamName,
      college: fullCollege,
      track,
      psId,
      sihOrganization: sihOrg,
      problemStatement: problemStatement || 'Autonomous decentralized edge intelligence for mission critical pipelines.',
      abstract: abstract || 'End-to-end resilient architecture with microsecond determinism and cryptographic state validation.',
      leaderName,
      leaderEmail,
      leaderPhone: leaderPhone || '+91 98260 12345',
      members: [
        { name: m2Name || 'Aarav Sharma', email: m2Email || 'aarav.sharma@titbhopal.edu.in', phone: '+91 98260 12346', specialization: m2Spec },
        { name: m3Name || 'Sneha Gupta', email: m3Email || 'sneha.gupta@titbhopal.edu.in', phone: '+91 98260 12347', specialization: m3Spec },
        { name: m4Name || 'Rohan Verma', email: m4Email || 'rohan.verma@titbhopal.edu.in', phone: '+91 98260 12348', specialization: m4Spec }
      ]
    });

    setRegisteredSuccess(createdTeam);
  };

  const handleSyncSheets = async () => {
    setIsSyncing(true);
    await syncGoogleSheets();
    setIsSyncing(false);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* SIH Problem Statement Catalog Modal */}
      <SIHProblemModal
        isOpen={isSIHModalOpen}
        onClose={() => setIsSIHModalOpen(false)}
        onSelect={handleSelectFromModal}
        initialSelectedId={psId}
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold mb-2">
          <Globe className="w-3.5 h-3.5 text-orange-600" />
          <span>TECHNOCRATS INSTITUTE OF TECHNOLOGY (TIT), BHOPAL</span>
          <span className="text-orange-300">·</span>
          <span>INTERNAL HACKATHON 2026</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0f172a] tracking-tight">
          Smart Hackathon 2026 Registration
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Internal college screening for nominating TIT Bhopal finalist teams to the{' '}
          <strong className="text-orange-600 font-semibold">Smart India Hackathon (SIH 2026)</strong> national round.
          Fetch your official Problem Statement ID directly from <span className="font-mono text-orange-700 font-bold">sih.gov.in</span>.
        </p>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl max-w-md mx-auto mt-6 shadow-xs">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'form' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct Registration
          </button>
          <button
            onClick={() => setActiveTab('google-form-embed')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'google-form-embed' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Form View
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'sheets' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Sheets Sync
          </button>
        </div>
      </div>

      {/* Success Modal / State */}
      {registeredSuccess ? (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white border border-emerald-300 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">TIT Bhopal Team Enrolled!</h3>
            <p className="text-slate-600 text-sm">
              Your squad has been enrolled for the Internal Hackathon in <span className="text-orange-600 font-bold">{registeredSuccess.track}</span>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-amber-100 font-mono text-xs space-y-2.5 max-w-md mx-auto text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">ASSIGNED TEAM ID:</span>
              <span className="text-orange-600 font-bold text-base">{registeredSuccess.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SIH PROBLEM STATEMENT ID:</span>
              <span className="text-blue-700 font-bold">{registeredSuccess.psId || 'SIH1609'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">MINISTRY / ORG:</span>
              <span className="text-slate-800 font-medium text-right truncate max-w-[200px]">{registeredSuccess.sihOrganization || 'AICTE / MoE'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">COLLEGE / CAMPUS:</span>
              <span className="text-slate-800 font-medium text-right truncate max-w-[200px]">{registeredSuccess.college}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TEAM PASSCODE:</span>
              <span className="text-slate-900 font-bold">{registeredSuccess.passcode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">STAGE ARENA:</span>
              <span className="text-slate-900 font-medium">Stage Alpha (TIT Auditorium)</span>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            A dedicated Google Drive directory has been allocated for your team PPT submissions:
            <br />
            <code className="text-blue-700 text-[11px] font-mono">{registeredSuccess.googleDriveFolder}</code>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => onTeamRegistered(registeredSuccess)}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-md shadow-orange-600/20 cursor-pointer"
            >
              <span>Open Team Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRegisteredSuccess(null)}
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              Register Another Team
            </button>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'form' && (
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
              {/* Card 0: SIH Live Problem Statement Fetcher */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-orange-50/70 via-white to-white border border-orange-200 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <span>sih.gov.in Live Data Fetcher</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-100 text-orange-800 font-bold">
                          Smart India Hackathon
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Query official SIH database by PS ID to auto-populate title, description, and ministry.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSIHModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-orange-50 text-orange-700 text-xs font-mono font-bold border border-orange-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-2xs cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Browse All SIH PS</span>
                  </button>
                </div>

                {/* PS ID input and fetch button */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter SIH PS ID (e.g. SIH1601, SIH1609, SIH1622, SIH1635, SIH1702, SIH1720)..."
                      value={psIdInput}
                      onChange={(e) => setPsIdInput(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 font-mono uppercase shadow-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFetchSIH()}
                    disabled={isFetchingSIH || !psIdInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-orange-600/20 shrink-0 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isFetchingSIH ? 'animate-spin' : ''}`} />
                    <span>{isFetchingSIH ? 'Fetching from sih.gov.in...' : 'Fetch from sih.gov.in'}</span>
                  </button>
                </div>

                {/* Feedback Banner */}
                {sihFeedback && (
                  <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 font-mono ${
                    sihFeedback.type === 'success' 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    {sihFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 leading-relaxed">
                      <span className="font-semibold">{sihFeedback.message}</span>
                      {sihFeedback.data && (
                        <div className="mt-1 text-[11px] text-slate-700 font-sans">
                          <strong>Active PS:</strong> {sihFeedback.data.title}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Card 1: Team & Technocrats Institute of Technology Info */}
              <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    <span>Team &amp; College Information</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200">
                    TIT Internal Edition
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Titan AI Innovators"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                      College Campus (Technocrats Institute of Technology) *
                    </label>
                    <select
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-orange-500 font-sans"
                    >
                      <option value="Technocrats Institute of Technology (Main Campus), Bhopal">
                        Technocrats Institute of Technology (Main Campus), Bhopal
                      </option>
                      <option value="Technocrats Institute of Technology & Science (TIT&S), Bhopal">
                        Technocrats Institute of Technology & Science (TIT&S), Bhopal
                      </option>
                      <option value="Technocrats Institute of Technology - Excellence, Bhopal">
                        Technocrats Institute of Technology - Excellence, Bhopal
                      </option>
                      <option value="Technocrats Institute of Technology - Advance, Bhopal">
                        Technocrats Institute of Technology - Advance, Bhopal
                      </option>
                    </select>
                  </div>
                </div>

                {/* Department Selection */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                    Branch / Department (TIT Bhopal) *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-orange-500 font-sans"
                  >
                    <option value="Department of Computer Science & Engineering (CSE)">Department of Computer Science & Engineering (CSE)</option>
                    <option value="Department of Artificial Intelligence & Machine Learning (AIML)">Department of Artificial Intelligence & Machine Learning (AIML)</option>
                    <option value="Department of Data Science (DS)">Department of Data Science (DS)</option>
                    <option value="Department of Cyber Security">Department of Cyber Security</option>
                    <option value="Department of Information Technology (IT)">Department of Information Technology (IT)</option>
                    <option value="Department of Electronics & Communication Engineering (ECE)">Department of Electronics & Communication Engineering (ECE)</option>
                    <option value="Department of Electrical & Electronics Engineering (EX)">Department of Electrical & Electronics Engineering (EX)</option>
                    <option value="Department of Mechanical Engineering">Department of Mechanical Engineering</option>
                    <option value="Department of Civil Engineering">Department of Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                    Problem Track *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['AI & Robotics', 'Web3 & Cloud', 'HealthTech & Bio', 'Smart Cities & IoT'] as TeamTrack[]).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTrack(t)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                          track === t
                            ? 'bg-orange-50 border-orange-500 text-orange-700 font-extrabold shadow-2xs'
                            : 'bg-[#faf7f2] border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Problem Statement details */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        SIH Problem Statement ID
                      </label>
                      <input
                        type="text"
                        value={psId}
                        onChange={(e) => setPsId(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-orange-700 text-xs font-mono font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Ministry / Organization / Department
                      </label>
                      <input
                        type="text"
                        value={sihOrg}
                        onChange={(e) => setSihOrg(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-slate-900 text-xs font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                      Problem Statement Title (from sih.gov.in) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Title of problem statement..."
                      value={problemStatement}
                      onChange={(e) => setProblemStatement(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                      Proposed Solution Abstract / Architecture *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your solution architecture and technical approach for the TIT judging committee..."
                      value={abstract}
                      onChange={(e) => setAbstract(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Team Members (SIH standard squad of 4-6 members with female inclusion) */}
              <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-600" />
                    <span>Team Members (TIT Bhopal Students)</span>
                  </h3>
                  <span className="text-[11px] font-mono text-orange-800 bg-orange-100 px-2.5 py-1 rounded border border-orange-200 font-bold">
                    ★ SIH Rule: At least 1 Female Member Recommended
                  </span>
                </div>

                {/* Team Leader */}
                <div className="p-4 rounded-2xl bg-[#faf7f2] border border-amber-100 space-y-3">
                  <span className="text-xs font-mono text-orange-700 font-bold">1. TEAM LEADER (TIT STUDENT LEAD)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Leader Full Name *"
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="College Email (@titbhopal.edu.in) *"
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="text"
                      placeholder="WhatsApp Mobile (+91...)"
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Members 2, 3, 4 */}
                <div className="space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-600">ADDITIONAL SQUAD MEMBERS:</span>
                  
                  <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-amber-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Member 2 Name"
                      value={m2Name}
                      onChange={(e) => setM2Name(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400"
                    />
                    <input
                      type="email"
                      placeholder="Member 2 Email"
                      value={m2Email}
                      onChange={(e) => setM2Email(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Specialization (e.g. AI / ML)"
                      value={m2Spec}
                      onChange={(e) => setM2Spec(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-amber-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Member 3 Name (e.g. Female Tech Lead)"
                      value={m3Name}
                      onChange={(e) => setM3Name(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400"
                    />
                    <input
                      type="email"
                      placeholder="Member 3 Email"
                      value={m3Email}
                      onChange={(e) => setM3Email(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Specialization (e.g. Cloud / Backend)"
                      value={m3Spec}
                      onChange={(e) => setM3Spec(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-amber-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Member 4 Name"
                      value={m4Name}
                      onChange={(e) => setM4Name(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400"
                    />
                    <input
                      type="email"
                      placeholder="Member 4 Email"
                      value={m4Email}
                      onChange={(e) => setM4Email(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Specialization (e.g. Embedded / Hardware)"
                      value={m4Spec}
                      onChange={(e) => setM4Spec(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-base tracking-wide transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                  <span>Submit TIT Internal Hackathon Registration &amp; Generate Team ID</span>
                </button>
                <p className="text-xs text-slate-500 mt-2 font-mono">
                  Generates unique ID (e.g. SH26-{String(teams.length + 1).padStart(3, '0')}) and provisions Google Drive PPT folder.
                </p>
              </div>
            </form>
          )}

          {/* Embedded Google Form Simulation */}
          {activeTab === 'google-form-embed' && (
            <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-[#faf7f2] border-b border-slate-200 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-orange-600 font-bold">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>GOOGLE FORMS EMBEDDED CONNECTOR · TIT BHOPAL</span>
                </div>
                <span className="text-slate-500 font-semibold">Auto-Sync Enabled</span>
              </div>
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 mx-auto">
                  <FileCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Technocrats Institute of Technology Official Google Form</h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                  Connected to Google Workspace Form URL: <br />
                  <code className="text-xs text-blue-700 font-mono font-bold">https://docs.google.com/forms/d/e/1FAIpQLSc_TIT_SIH_2026_Internal/viewform</code>
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('form')}
                    className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 transition-colors shadow-xs cursor-pointer"
                  >
                    Switch to In-App Direct Form
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Google Sheets Sync View */}
          {activeTab === 'sheets' && (
            <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm space-y-6 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold mb-1">
                    <FolderSync className="w-4 h-4" />
                    <span>GOOGLE SHEETS TWO-WAY SYNC · TIT DATABASE</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Live Form Responses &amp; Spreadsheet Export</h3>
                </div>

                <button
                  onClick={handleSyncSheets}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs"
                >
                  <FolderSync className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now with Sheets'}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 font-mono">
                  <thead className="bg-[#faf7f2] text-slate-600 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Team ID</th>
                      <th className="p-3">Team Name</th>
                      <th className="p-3">Campus / College</th>
                      <th className="p-3">SIH PS ID</th>
                      <th className="p-3">Track</th>
                      <th className="p-3">Leader</th>
                      <th className="p-3">Drive Folder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teams.slice(0, 8).map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="p-3 text-orange-600 font-bold">{t.id}</td>
                        <td className="p-3 text-slate-900 font-sans font-bold">{t.name}</td>
                        <td className="p-3 text-slate-500 font-sans text-[11px]">{t.college}</td>
                        <td className="p-3 text-blue-700 font-bold">{t.psId || 'SIH1609'}</td>
                        <td className="p-3 text-slate-700">{t.track}</td>
                        <td className="p-3 text-slate-600 font-sans">{t.leaderName}</td>
                        <td className="p-3 text-blue-600 text-[10px] truncate max-w-[140px]">
                          {t.googleDriveFolder}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};
