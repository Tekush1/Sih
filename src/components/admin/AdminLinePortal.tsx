import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Team, TeamTrack, SlideData } from '../../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  ExternalLink, 
  Tv, 
  Clock, 
  Edit3, 
  Check, 
  X, 
  Layers, 
  Search, 
  Sparkles, 
  Sliders,
  Building2,
  Globe,
  MonitorPlay,
  CheckCircle2,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { SIHProblemModal } from '../sih/SIHProblemModal';
import { CSVUploadModal } from './CSVUploadModal';

interface AdminLinePortalProps {
  onSwitchToScreen: () => void;
}

export const AdminLinePortal: React.FC<AdminLinePortalProps> = ({ onSwitchToScreen }) => {
  const { 
    screenState, 
    queueTeams, 
    teams, 
    sendTeamToScreen, 
    startScreenTimer, 
    pauseScreenTimer, 
    resetScreenTimer, 
    adjustScreenTimer, 
    setScreenSlideIndex, 
    nextScreenSlide, 
    prevScreenSlide, 
    insertTeamIntoQueue, 
    reorderPresentationQueue, 
    removeTeamFromQueue,
    updateTeamSlideData,
    clearAllTeams,
    updateTeamDriveUrl
  } = useHackathon();

  // Modal for inserting a team into the line
  const [showInsertModal, setShowInsertModal] = useState<boolean>(false);
  const [showSIHModal, setShowSIHModal] = useState<boolean>(false);
  const [showCSVModal, setShowCSVModal] = useState<boolean>(false);

  // Form states for inserting team
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [newDriveLink, setNewDriveLink] = useState<string>('');
  const [newPSId, setNewPSId] = useState<string>('SIH1601');
  const [newCollege, setNewCollege] = useState<string>('Technocrats Institute of Technology (TIT), Bhopal');
  const [newTrack, setNewTrack] = useState<TeamTrack>('AI & Robotics');
  const [newProblemStatement, setNewProblemStatement] = useState<string>('');
  const [newDurationMinutes, setNewDurationMinutes] = useState<number>(6);
  const [insertPosition, setInsertPosition] = useState<'top' | 'next' | 'end'>('next');
  const [sendImmediately, setSendImmediately] = useState<boolean>(false);

  // Edit slide modal
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editSlideIdx, setEditSlideIdx] = useState<number>(0);
  const [editSlideTitle, setEditSlideTitle] = useState<string>('');
  const [editBullet1, setEditBullet1] = useState<string>('');
  const [editBullet2, setEditBullet2] = useState<string>('');
  const [editBullet3, setEditBullet3] = useState<string>('');

  // Quick search in queue
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Current team on screen
  const currentScreenTeam = teams.find((t) => t.id === screenState.teamId) || teams[0];
  const slides = currentScreenTeam?.submission?.slides || [];
  const currentSlide = slides[screenState.slideIndex] || slides[0];

  const slideDurations = screenState.slideDurations && screenState.slideDurations.length === 6
    ? screenState.slideDurations
    : [10, 60, 60, 40, 40, 20];

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleOpenInsertModal = () => {
    setNewTeamName('');
    setNewDriveLink('');
    setNewPSId('SIH1601');
    setNewProblemStatement('');
    setNewDurationMinutes(6);
    setInsertPosition('next');
    setSendImmediately(false);
    setShowInsertModal(true);
  };

  const handleInsertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      alert('Please enter a squad/team name');
      return;
    }

    const createdTeam = insertTeamIntoQueue({
      name: newTeamName.trim(),
      college: newCollege.trim(),
      psId: newPSId.trim(),
      track: newTrack,
      problemStatement: newProblemStatement.trim() || `Smart India Hackathon project on ${newPSId}`,
      durationMinutes: newDurationMinutes,
      insertPosition
    });

    if (newDriveLink.trim()) {
      updateTeamDriveUrl(createdTeam.id, newDriveLink.trim());
    }

    if (sendImmediately) {
      sendTeamToScreen(createdTeam.id, newDurationMinutes);
    }

    setShowInsertModal(false);
  };

  // Reorder queue functions
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const currentOrder = queueTeams.map((t) => t.id);
    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[index - 1];
    currentOrder[index - 1] = temp;
    reorderPresentationQueue(currentOrder);
  };

  const handleMoveDown = (index: number) => {
    if (index === queueTeams.length - 1) return;
    const currentOrder = queueTeams.map((t) => t.id);
    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[index + 1];
    currentOrder[index + 1] = temp;
    reorderPresentationQueue(currentOrder);
  };

  // Open slide editor
  const handleOpenSlideEditor = (team: Team) => {
    setEditingTeam(team);
    setEditSlideIdx(0);
    const slide = team.submission?.slides?.[0];
    if (slide) {
      setEditSlideTitle(slide.title);
      setEditBullet1(slide.bulletPoints[0] || '');
      setEditBullet2(slide.bulletPoints[1] || '');
      setEditBullet3(slide.bulletPoints[2] || '');
    }
  };

  const handleSaveSlideChanges = () => {
    if (!editingTeam) return;
    const updatedBullets = [editBullet1, editBullet2, editBullet3].filter((b) => b.trim().length > 0);
    updateTeamSlideData(editingTeam.id, editSlideIdx, {
      title: editSlideTitle,
      bulletPoints: updatedBullets
    });
    setEditingTeam(null);
  };

  const filteredQueue = queueTeams.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      (t.psId && t.psId.toLowerCase().includes(q)) ||
      t.college.toLowerCase().includes(q)
    );
  });

  const openProjectorPopup = () => {
    window.open('?portal=screen', '_blank', 'width=1280,height=720,menubar=no,toolbar=no,location=no');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* SIH Modal */}
      <SIHProblemModal
        isOpen={showSIHModal}
        onClose={() => setShowSIHModal(false)}
        onSelect={(ps) => {
          setNewPSId(ps.id);
          setNewProblemStatement(ps.title);
          setShowSIHModal(false);
        }}
        initialSelectedId={newPSId}
      />

      {/* CSV Lineup Uploader Modal */}
      <CSVUploadModal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
      />

      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-1">
            <Sliders className="w-4 h-4 text-orange-600" />
            <span>TECHNOCRATS INSTITUTE OF TECHNOLOGY · STAGE CONTROLLER</span>
            <span className="text-orange-300">·</span>
            <span className="text-[#b47e3a]">ADMIN QUEUE MANAGER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Presentation Line &amp; Projector Screen Controller
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Insert teams into the stage lineup, reorder the presentation line, trigger the live screen remotely, and control the big screen countdown timer &amp; PPT slides.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowCSVModal(true)}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-orange-600/25 cursor-pointer ring-2 ring-orange-400/30"
            title="Insert real squads from CSV (Team Name, Track, Google Drive Link)"
          >
            <FileSpreadsheet className="w-4 h-4 stroke-[3]" />
            <span>Insert CSV File</span>
          </button>

          <button
            onClick={handleOpenInsertModal}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-orange-50 border-2 border-orange-500/60 text-orange-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-orange-600 stroke-[3]" />
            <span>Insert Team into Line</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Purge all squads and reset to a clean lineup for CSV insertion?')) {
                clearAllTeams();
              }
            }}
            className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Purge all dummy squads and start clean with real CSV data"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Data</span>
          </button>

          <button
            onClick={openProjectorPopup}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title="Open projector screen in separate window for second monitor"
          >
            <Tv className="w-4 h-4 text-slate-600" />
            <span>Popup Screen</span>
          </button>

          <button
            onClick={onSwitchToScreen}
            className="px-4 py-2.5 rounded-xl bg-[#faf7f2] hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MonitorPlay className="w-4 h-4 text-slate-700" />
            <span>Switch to Screen View</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. LIVE SCREEN CONTROLLER (Controls what is on Projector)       */}
      {/* ============================================================== */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-ping" />
            <div>
              <span className="text-[10px] font-mono tracking-widest text-orange-400 font-bold uppercase block">
                LIVE ON AUDITORIUM PROJECTOR SCREEN
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 flex-wrap">
                <span>{currentScreenTeam ? currentScreenTeam.name : 'Awaiting Squad Selection'}</span>
                {currentScreenTeam && (
                  <span className="text-orange-400 font-mono text-base font-bold">({currentScreenTeam.id})</span>
                )}
                {currentScreenTeam?.psId && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900 border border-blue-500 text-blue-200 font-mono font-bold">
                    PS: {currentScreenTeam.psId}
                  </span>
                )}
              </h3>
              {(currentScreenTeam?.googleDriveFolder || currentScreenTeam?.submission?.googleDriveFileUrl) && (
                <div className="pt-1.5">
                  <a
                    href={currentScreenTeam.submission?.googleDriveFileUrl || currentScreenTeam.googleDriveFolder}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/90 hover:bg-blue-900 border border-blue-500/60 text-blue-300 text-[11px] font-mono transition-colors"
                    title="Open original presentation deck on Google Drive"
                  >
                    <ExternalLink className="w-3 h-3 text-blue-400" />
                    <span>Open Drive Presentation: {currentScreenTeam.submission?.googleDriveFileUrl || currentScreenTeam.googleDriveFolder}</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Screen Timer Badge with Dual Clocks */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Active Slide Timer */}
            <div className="px-4 py-2 rounded-2xl bg-orange-950/80 border border-orange-500/80 text-orange-400 flex items-center gap-2.5 shadow-sm">
              <Clock className="w-5 h-5 text-orange-400 animate-pulse" />
              <div className="leading-tight">
                <span className="text-[10px] text-orange-300 font-mono font-bold block uppercase">
                  SLIDE 0{screenState.slideIndex + 1} TIMER ({slideDurations[screenState.slideIndex] || 60}s)
                </span>
                <span className="text-2xl font-black font-mono tracking-tight tabular-nums">
                  {formatTime(screenState.slideRemainingSeconds !== undefined ? screenState.slideRemainingSeconds : 10)}
                </span>
              </div>
            </div>

            {/* Total Pitch Timer */}
            <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-2.5">
              <div className="leading-tight">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">TOTAL PITCH</span>
                <span className="text-2xl font-black font-mono tracking-tight tabular-nums text-white">
                  {formatTime(screenState.totalRemainingSeconds !== undefined ? screenState.totalRemainingSeconds : screenState.remainingSeconds)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Auto Cadence Notice Banner */}
        <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between text-xs font-mono text-orange-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span className="font-bold">CADENCE:</span>
            <span>Slide 1 (10s) → Slide 2 (60s) → Slide 3 (60s) → Slide 4 (40s) → Slide 5 (40s) → Slide 6 (20s)</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold hidden sm:inline">Auto-Advance Active</span>
        </div>

        {/* Remote Control Buttons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          {/* Left: Timer Remote Controls */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Screen Timer Controls
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {screenState.isRunning ? (
                <button
                  onClick={pauseScreenTimer}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Timer</span>
                </button>
              ) : (
                <button
                  onClick={startScreenTimer}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-600/30 cursor-pointer transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Countdown</span>
                </button>
              )}

              <button
                onClick={() => resetScreenTimer()}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset pitch to start (Slide 1, 10s)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Pitch</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 pt-1 text-xs font-mono flex-wrap">
              <span className="text-slate-500 text-[11px]">Slide Timer:</span>
              <button
                onClick={() => adjustScreenTimer(10)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                +10s
              </button>
              <button
                onClick={() => adjustScreenTimer(-10)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                -10s
              </button>
              <button
                onClick={() => adjustScreenTimer(30)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                +30s
              </button>
            </div>
          </div>

          {/* Right: Slide Remote Controls */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                PPT Slide Remote (Current: Slide 0{screenState.slideIndex + 1} / 0{slides.length || 6})
              </span>
              <span className="text-xs text-orange-400 font-mono font-bold truncate max-w-xs">
                {currentSlide?.title}
              </span>
            </div>

            {/* Direct Jump Buttons with Exact Slide Durations */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: 'Problem', time: '10s' },
                { label: 'Architecture', time: '60s' },
                { label: 'Innovation', time: '60s' },
                { label: 'Demo', time: '40s' },
                { label: 'Feasibility', time: '40s' },
                { label: 'Roadmap', time: '20s' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setScreenSlideIndex(idx)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    screenState.slideIndex === idx
                      ? 'bg-orange-500 text-white shadow-sm ring-1 ring-orange-300'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span>0{idx + 1} {item.label}</span>
                  <span className={`text-[10px] px-1 rounded font-black ${screenState.slideIndex === idx ? 'bg-orange-950 text-orange-200' : 'bg-slate-900 text-slate-400'}`}>
                    {item.time}
                  </span>
                </button>
              ))}
            </div>

            {/* Prev / Next / Edit */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={prevScreenSlide}
                disabled={screenState.slideIndex === 0}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-white transition-colors cursor-pointer"
              >
                ← Previous Slide
              </button>

              <button
                onClick={nextScreenSlide}
                disabled={screenState.slideIndex >= (slides.length - 1)}
                className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
              >
                Next Slide →
              </button>

              <button
                onClick={() => currentScreenTeam && handleOpenSlideEditor(currentScreenTeam)}
                className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-orange-300 flex items-center gap-1 cursor-pointer"
                title="Edit slide text live"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Slide Text</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PRESENTATION LINE / QUEUE MANAGER ("line wagera insert")    */}
      {/* ============================================================== */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden space-y-0">
        {/* Queue Header */}
        <div className="p-6 bg-[#faf7f2] border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-0.5">
              <Layers className="w-4 h-4 text-orange-600" />
              <span>PRESENTATION LINEUP SEQUENCE</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Presentation Queue ({queueTeams.length} Teams in Line)
            </h3>
            <p className="text-xs text-slate-500">
              Order of teams scheduled to present on stage. Click "Send to Screen" to switch the active projector deck.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter line by team or PS ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-mono shadow-2xs"
              />
            </div>

            <button
              onClick={() => setShowCSVModal(true)}
              className="px-3.5 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 border border-orange-300 text-orange-800 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Insert CSV File containing real squads"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />
              <span>Insert CSV</span>
            </button>

            <button
              onClick={handleOpenInsertModal}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Insert Team</span>
            </button>
          </div>
        </div>

        {/* Queue List Table */}
        <div className="divide-y divide-slate-100">
          {filteredQueue.length === 0 ? (
            <div className="p-8 sm:p-12 text-center space-y-5 bg-[#faf7f2]/60 m-4 rounded-3xl border-2 border-dashed border-orange-300/80">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto shadow-sm">
                <FileSpreadsheet className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="max-w-md mx-auto space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-mono text-[11px] font-bold uppercase">
                  Clean Lineup · Ready for Real Data
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                  No Squads in Lineup Yet
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The fake data has been purged. Insert your real CSV file containing <strong>Team Name</strong>, <strong>Track</strong>, and <strong>Google Drive Link</strong> to populate the live stage presentation line.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowCSVModal(true)}
                  className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-orange-600/25 cursor-pointer ring-2 ring-orange-400/40"
                >
                  <FileSpreadsheet className="w-4 h-4 stroke-[3]" />
                  <span>Insert CSV File Now</span>
                </button>

                <button
                  onClick={handleOpenInsertModal}
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Squad Manually</span>
                </button>
              </div>
            </div>
          ) : (
            filteredQueue.map((team, idx) => {
              const isCurrentlyOnScreen = team.id === screenState.teamId;
              const isOnDeck = idx === 1 && !isCurrentlyOnScreen;

            return (
              <div
                key={team.id}
                className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  isCurrentlyOnScreen ? 'bg-orange-50/70 border-l-4 border-l-orange-500' : 'hover:bg-[#fffdfa]'
                }`}
              >
                {/* Left: Position & Team info */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#faf7f2] border border-slate-200 flex items-center justify-center font-mono font-black text-xs text-slate-500 shrink-0">
                    #{idx + 1}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-extrabold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded border border-orange-200">
                        {team.id}
                      </span>

                      {team.psId && (
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          PS: {team.psId}
                        </span>
                      )}

                      {isCurrentlyOnScreen && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white font-mono text-[10px] font-black uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          LIVE ON SCREEN
                        </span>
                      )}

                      {isOnDeck && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-mono text-[10px] font-bold uppercase">
                          ON DECK NEXT
                        </span>
                      )}

                      <span className="text-xs text-slate-400 font-medium truncate">
                        · {team.track}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 truncate">
                      {team.name}
                    </h4>

                    <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{team.college}</span>
                      <span>·</span>
                      <span className="text-slate-600 truncate">{team.problemStatement}</span>
                    </p>

                    {/* Google Drive Link if provided via CSV or submission */}
                    {(team.googleDriveFolder || team.submission?.googleDriveFileUrl) && (
                      <div className="pt-0.5">
                        <a
                          href={team.submission?.googleDriveFileUrl || team.googleDriveFolder}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[11px] font-mono font-medium transition-colors max-w-full"
                          title="Open presentation in Google Drive"
                        >
                          <ExternalLink className="w-3 h-3 text-blue-600 shrink-0" />
                          <span className="truncate">Google Drive: {team.submission?.googleDriveFileUrl || team.googleDriveFolder}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  {/* Send to screen button */}
                  {isCurrentlyOnScreen ? (
                    <span className="px-4 py-2 rounded-xl bg-orange-100 text-orange-800 font-bold text-xs font-mono flex items-center gap-1.5 border border-orange-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                      <span>Active on Screen</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => sendTeamToScreen(team.id, 6)}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>Send to Screen</span>
                    </button>
                  )}

                  {/* Move Up */}
                  <button
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="p-2 rounded-xl bg-[#faf7f2] hover:bg-slate-100 disabled:opacity-25 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                    title="Move up in lineup"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === queueTeams.length - 1}
                    className="p-2 rounded-xl bg-[#faf7f2] hover:bg-slate-100 disabled:opacity-25 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                    title="Move down in lineup"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit Slides */}
                  <button
                    onClick={() => handleOpenSlideEditor(team)}
                    className="p-2 rounded-xl bg-[#faf7f2] hover:bg-slate-100 text-slate-600 hover:text-orange-600 border border-slate-200 transition-colors cursor-pointer"
                    title="Edit team slides"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Remove ${team.name} (${team.id}) from the line?`)) {
                        removeTeamFromQueue(team.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                    title="Remove from presentation line"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MODAL: INSERT TEAM INTO LINE ("line wagera insert krr ske")   */}
      {/* ============================================================== */}
      {showInsertModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-800">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-[#faf7f2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Insert Squad into Presentation Line</h3>
                  <p className="text-xs text-slate-500">Add team to the stage queue for big-screen presentation.</p>
                </div>
              </div>

              <button
                onClick={() => setShowInsertModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleInsertSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-600 mb-1">
                  Team / Squad Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AeroVision TIT, CyberForge AI, QuantumLogic..."
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-600 mb-1 flex items-center justify-between">
                    <span>SIH Problem Statement ID</span>
                    <button
                      type="button"
                      onClick={() => setShowSIHModal(true)}
                      className="text-[10px] text-orange-600 hover:underline cursor-pointer"
                    >
                      Browse sih.gov.in
                    </button>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SIH1601, SIH1609..."
                    value={newPSId}
                    onChange={(e) => setNewPSId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-sm text-slate-900 font-mono uppercase focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-600 mb-1">
                    Hackathon Track
                  </label>
                  <select
                    value={newTrack}
                    onChange={(e) => setNewTrack(e.target.value as TeamTrack)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500 font-sans"
                  >
                    <option value="AI & Robotics">AI &amp; Robotics</option>
                    <option value="Web3 & Cloud">Web3 &amp; Cloud</option>
                    <option value="HealthTech & Bio">HealthTech &amp; Bio</option>
                    <option value="Smart Cities & IoT">Smart Cities &amp; IoT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-600 mb-1 flex items-center justify-between">
                  <span>Google Drive Presentation Link (Real Drive Deck) *</span>
                  <span className="text-[10px] text-orange-600 font-normal">Slides, PPTX or Folder</span>
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/... or docs.google.com/presentation/d/..."
                  value={newDriveLink}
                  onChange={(e) => setNewDriveLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  This original presentation will be loaded and displayed directly on the auditorium projector screen.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-600 mb-1">
                  College / Institute
                </label>
                <input
                  type="text"
                  value={newCollege}
                  onChange={(e) => setNewCollege(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-600 mb-1">
                  Problem Statement Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of the solution or prototype to be pitched..."
                  value={newProblemStatement}
                  onChange={(e) => setNewProblemStatement(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-600 mb-1">
                    Pitch Duration
                  </label>
                  <select
                    value={newDurationMinutes}
                    onChange={(e) => setNewDurationMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                  >
                    <option value={3}>3 Minutes Pitch</option>
                    <option value={5}>5 Minutes Pitch</option>
                    <option value={6}>6 Minutes (Standard SIH)</option>
                    <option value={8}>8 Minutes Extended</option>
                    <option value={10}>10 Minutes Comprehensive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-600 mb-1">
                    Insert Position in Line
                  </label>
                  <select
                    value={insertPosition}
                    onChange={(e) => setInsertPosition(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-sans"
                  >
                    <option value="next">Next (Immediate On Deck)</option>
                    <option value="top">Top (First in Line)</option>
                    <option value="end">End of Line</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 p-3 rounded-xl bg-orange-50 border border-orange-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendImmediately}
                  onChange={(e) => setSendImmediately(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
                <span>Send Directly to Projector Screen Right Now!</span>
              </label>

              {/* Submit button */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowInsertModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs shadow-md shadow-orange-600/20 cursor-pointer"
                >
                  Insert into Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MODAL: EDIT SLIDE CONTENT LIVE                              */}
      {/* ============================================================== */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-800">
            <div className="p-5 border-b border-slate-200 bg-[#faf7f2] flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Edit Slides for {editingTeam.name} ({editingTeam.id})
                </h3>
                <p className="text-xs text-slate-500">Changes reflect on Projector Screen live.</p>
              </div>

              <button
                onClick={() => setEditingTeam(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Slide Switcher */}
              <div className="flex gap-1 overflow-x-auto pb-2 border-b border-slate-100">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setEditSlideIdx(idx);
                      const slide = editingTeam.submission?.slides?.[idx];
                      if (slide) {
                        setEditSlideTitle(slide.title);
                        setEditBullet1(slide.bulletPoints[0] || '');
                        setEditBullet2(slide.bulletPoints[1] || '');
                        setEditBullet3(slide.bulletPoints[2] || '');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                      editSlideIdx === idx ? 'bg-orange-600 text-white' : 'bg-[#faf7f2] text-slate-700 border border-slate-200'
                    }`}
                  >
                    Slide 0{idx + 1}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-600 mb-1">
                  Slide Title
                </label>
                <input
                  type="text"
                  value={editSlideTitle}
                  onChange={(e) => setEditSlideTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-600">
                  Key Bullet Points
                </label>
                <input
                  type="text"
                  placeholder="Bullet Point 1..."
                  value={editBullet1}
                  onChange={(e) => setEditBullet1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  placeholder="Bullet Point 2..."
                  value={editBullet2}
                  onChange={(e) => setEditBullet2(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  placeholder="Bullet Point 3..."
                  value={editBullet3}
                  onChange={(e) => setEditBullet3(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setEditingTeam(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSlideChanges}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Save Slide Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
