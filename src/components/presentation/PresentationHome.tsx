import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Team, TeamTrack, Stage } from '../../types';
import { 
  Rocket, 
  Clock, 
  Users, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Zap,
  Play,
  Globe,
  Building2,
  Cpu,
  ShieldCheck,
  Trophy,
  Search,
  Sparkles,
  QrCode,
  FileText,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { SIHProblemModal } from '../sih/SIHProblemModal';
import { PresentationRenderer } from './PresentationRenderer';

interface PresentationHomeProps {
  onNavigate: (tab: string) => void;
  onLaunchPresentation: (teamId: string, stageId: string) => void;
}

export const PresentationHome: React.FC<PresentationHomeProps> = ({
  onNavigate,
  onLaunchPresentation
}) => {
  const { teams, stages, schedules } = useHackathon();
  const [showSIHModal, setShowSIHModal] = useState<boolean>(false);
  const [searchPSId, setSearchPSId] = useState<string>('');
  const [selectedPreviewTeamId, setSelectedPreviewTeamId] = useState<string>('SH26-001');
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);

  const previewTeam = teams.find((t) => t.id === selectedPreviewTeamId) || teams[0];

  // Map each stage to current presenting and next on-deck teams
  const stageStatuses = stages.map((stage) => {
    const slots = schedules.filter((s) => s.stageId === stage.id);
    const inProgress = slots.find((s) => s.status === 'IN_PROGRESS');
    const scheduled = slots.filter((s) => s.status === 'SCHEDULED');

    const presentingTeam = inProgress
      ? teams.find((t) => t.id === inProgress.teamId)
      : stage.currentTeamId
      ? teams.find((t) => t.id === stage.currentTeamId)
      : teams.find((t) => t.stageId === stage.id);

    const nextTeam = scheduled[0] ? teams.find((t) => t.id === scheduled[0].teamId) : undefined;

    return {
      stage,
      presentingTeam,
      nextTeam,
      slotCount: slots.length
    };
  });

  // Filtered teams for the quick deck search
  const filteredQuickTeams = teams.filter((t) => {
    if (!searchPSId.trim()) return true;
    const query = searchPSId.toLowerCase();
    return (
      t.id.toLowerCase().includes(query) ||
      t.name.toLowerCase().includes(query) ||
      (t.psId && t.psId.toLowerCase().includes(query)) ||
      t.problemStatement.toLowerCase().includes(query) ||
      t.college.toLowerCase().includes(query)
    );
  }).slice(0, 6);

  const PITCH_BLUEPRINT = [
    {
      minute: '0:00 - 1:00',
      title: 'Problem Statement & Root Cause',
      focus: 'SIH PS ID alignment, existing pain points, root cause analysis, target beneficiaries.',
      color: 'border-orange-300 bg-orange-50/60 text-orange-800'
    },
    {
      minute: '1:00 - 2:00',
      title: 'Proposed System Architecture',
      focus: 'End-to-end topology, data flow pipeline, cloud/edge topology, module division.',
      color: 'border-amber-300 bg-amber-50/60 text-amber-800'
    },
    {
      minute: '2:00 - 3:00',
      title: 'Core Innovation & Technical Stack',
      focus: 'Proprietary algorithms, AI models, hardware design, key differentiators vs alternatives.',
      color: 'border-blue-300 bg-blue-50/60 text-blue-800'
    },
    {
      minute: '3:00 - 4:00',
      title: 'Working Prototype & Live Demo',
      focus: 'Live screen recording, physical prototype telemetry, benchmark measurements.',
      color: 'border-emerald-300 bg-emerald-50/60 text-emerald-800'
    },
    {
      minute: '4:00 - 5:00',
      title: 'Feasibility, Scalability & Market Adoption',
      focus: 'Unit economics, deployment roadmap, safety/compliance, institutional scalability.',
      color: 'border-purple-300 bg-purple-50/60 text-purple-800'
    },
    {
      minute: '5:00 - 6:00',
      title: 'Roadmap, Team Execution & Q&A Pitch',
      focus: 'Milestones, team role division, SIH national readiness, final jury defense.',
      color: 'border-rose-300 bg-rose-50/60 text-rose-800'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* SIH Modal */}
      <SIHProblemModal
        isOpen={showSIHModal}
        onClose={() => setShowSIHModal(false)}
        initialSelectedId="SIH1601"
      />

      {/* Hero: 6-Minute Pitch Engine Command */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-gradient-to-b from-[#fffdfa] via-[#faf7f2] to-[#f5efe6]">
        {/* Concentric Golden Orbit Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] rounded-full border border-amber-200/60 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full border border-amber-300/40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-orange-200/50 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 border border-orange-300/80 text-orange-800 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
            <span className="tracking-wide uppercase font-mono">
              SIH 2026 INTERNAL STAGE PITCH &amp; EVALUATION SYSTEM
            </span>
          </div>

          {/* Institutional Two-Line Title */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0f172a]">
              Technocrats Institute of Technology
            </h1>
            <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#b47e3a]">
              6-Minute Stage Pitch &amp; Evaluation Engine
            </div>
          </div>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Automated 6-slide countdown (60s/slide), deterministic 4-stage arena scheduling, live SIH 2026 problem statement validation, digital QR passes, and jury evaluation rubrics for 128 competing TIT squads.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onLaunchPresentation('SH26-001', 'stage-alpha')}
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2 cursor-pointer group"
            >
              <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>Launch Live Stage Presentation</span>
            </button>

            <button
              onClick={() => onNavigate('stage-portal')}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-orange-500/60 text-orange-700 font-bold text-sm sm:text-base transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>Stage Marshal Console</span>
            </button>

            <button
              onClick={() => onNavigate('judges')}
              className="px-5 py-3.5 rounded-2xl bg-[#faf7f2] hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Judge Scoring Room</span>
            </button>

            <button
              onClick={() => setShowSIHModal(true)}
              className="px-5 py-3.5 rounded-2xl bg-[#faf7f2] hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Lookup SIH PS IDs</span>
            </button>
          </div>

          {/* Key Presentation Cadence Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">PER SQUAD CADENCE</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-orange-600">6:00 MIN</span>
              <span className="text-[10px] text-slate-400 block font-mono">Strict 60s per slide</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">ACTIVE STAGE AUDIS</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">4 ARENAS</span>
              <span className="text-[10px] text-slate-400 block font-mono">Simultaneous evaluation</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">TIT SQUADS SCHEDULED</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">128 TEAMS</span>
              <span className="text-[10px] text-slate-400 block font-mono">100% SIH mapped</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">JUDGE RUBRIC</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600">100 PTS</span>
              <span className="text-[10px] text-slate-400 block font-mono">4 SIH core pillars</span>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Stage Arenas Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE TIT CAMPUS PRESENTATION PODS</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Active Stage Arenas &amp; Presentation Queues
            </h2>
          </div>

          <button
            onClick={() => onNavigate('stage-portal')}
            className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Full Marshal Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stageStatuses.map(({ stage, presentingTeam, nextTeam, slotCount }) => (
            <div
              key={stage.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-5 shadow-xs hover:border-orange-300 transition-all"
            >
              {/* Stage Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold">
                    <span className="text-orange-700">{stage.name}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">{stage.location}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">{stage.track}</h3>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-mono font-bold">
                  {slotCount} Teams
                </span>
              </div>

              {/* Presenting Team Box */}
              <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-extrabold text-orange-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                    NOW PRESENTING
                  </span>
                  <span className="font-mono font-bold text-slate-600">
                    Slot: {presentingTeam?.scheduledSlot?.startTime || '14:00'} - {presentingTeam?.scheduledSlot?.endTime || '14:06'}
                  </span>
                </div>

                {presentingTeam ? (
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-orange-800">{presentingTeam.id}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-200 text-blue-800 font-bold">
                        PS: {presentingTeam.psId || 'SIH1609'}
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1">{presentingTeam.name}</h4>
                    <p className="text-xs text-slate-600 font-medium truncate mt-0.5">{presentingTeam.college}</p>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">{presentingTeam.problemStatement}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-mono">Stage idle — awaiting team scan.</p>
                )}
              </div>

              {/* Next Up / On Deck */}
              <div className="p-3 rounded-2xl bg-[#faf7f2] border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-500 font-mono font-bold">ON DECK:</span>
                {nextTeam ? (
                  <span className="font-bold text-slate-800 truncate max-w-xs">
                    {nextTeam.id} - {nextTeam.name} [{nextTeam.psId || 'SIH'}]
                  </span>
                ) : (
                  <span className="text-slate-400 font-mono">Next in line</span>
                )}
              </div>

              {/* Launch & Manage Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {presentingTeam && (
                  <button
                    onClick={() => onLaunchPresentation(presentingTeam.id, stage.id)}
                    className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Projector Mode</span>
                  </button>
                )}

                <button
                  onClick={() => onNavigate('stage-portal')}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Marshal Stage
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6-Minute Pitch Framework Blueprint */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-0.5">
            <Clock className="w-4 h-4 text-orange-600" />
            <span>STANDARDIZED PRESENTATION STRUCTURE</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            The 6-Minute Pitch Blueprint (60s/Slide Cadence)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict deterministic timing enforced by the presentation engine to ensure fair evaluation across all 128 squads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PITCH_BLUEPRINT.map((step, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${step.color} space-y-2 shadow-2xs hover:shadow-sm transition-all`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="px-2 py-0.5 rounded bg-white/80 border border-slate-200">
                  SLIDE 0{idx + 1}
                </span>
                <span className="font-extrabold">{step.minute}</span>
              </div>
              <h4 className="text-sm font-black text-slate-900">{step.title}</h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{step.focus}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Deck Simulator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INTERACTIVE SLIDE ENGINE PREVIEW</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Preview Squad Pitch Deck: {previewTeam.name} ({previewTeam.id})
              </h3>
              <p className="text-xs text-slate-500">
                {previewTeam.college} · PS: <strong className="text-orange-700 font-mono">{previewTeam.psId || 'SIH1609'}</strong> ({previewTeam.sihOrganization || 'AICTE'})
              </p>
            </div>

            {/* Quick Switcher & Launch */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={previewTeam.id}
                onChange={(e) => setSelectedPreviewTeamId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs font-mono font-bold text-orange-700 focus:outline-none"
              >
                {teams.slice(0, 15).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} - {t.name} [{t.psId || 'SIH'}]
                  </option>
                ))}
              </select>

              <button
                onClick={() => onLaunchPresentation(previewTeam.id, previewTeam.stageId || 'stage-alpha')}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Present Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Slide Tab Controls */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlideIdx(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeSlideIdx === idx
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-[#faf7f2] hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                0{idx + 1} {idx === 0 ? 'Problem' : idx === 1 ? 'Solution' : idx === 2 ? 'Tech' : idx === 3 ? 'Demo' : idx === 4 ? 'Feasibility' : 'Roadmap'}
              </button>
            ))}
          </div>

          {/* Embedded Slide Preview */}
          <div className="rounded-2xl bg-slate-950 p-6 md:p-8 min-h-[380px] flex items-center justify-center overflow-hidden border border-slate-800">
            {previewTeam.submission?.slides && (
              <PresentationRenderer
                slide={previewTeam.submission.slides[activeSlideIdx] || previewTeam.submission.slides[0]}
                team={previewTeam}
                slideTimeRemaining={54}
              />
            )}
          </div>
        </div>
      </section>

      {/* Quick Pitch Finder by SIH PS ID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-0.5">
                <Search className="w-3.5 h-3.5" />
                <span>QUICK PRESENTATION DECK FINDER</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Search Team Decks by SIH Problem Statement ID
              </h3>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter PS ID (e.g. SIH1601, SIH1609) or team..."
                value={searchPSId}
                onChange={(e) => setSearchPSId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-mono shadow-2xs"
              />
            </div>
          </div>

          {/* Cards of matching teams */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuickTeams.map((team) => (
              <div
                key={team.id}
                className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/90 hover:border-orange-300 transition-all space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded border border-orange-200">
                    {team.id}
                  </span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    PS: {team.psId || 'SIH1609'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{team.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{team.college}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-medium">{team.problemStatement}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-100 pt-2">
                  <span>Slot: {team.scheduledSlot?.startTime || '14:00'}</span>
                  <span className="text-orange-700 font-bold">{team.stageId?.replace('-', ' ') || 'Stage A'}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onLaunchPresentation(team.id, team.stageId || 'stage-alpha')}
                    className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Present</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPreviewTeamId(team.id);
                      window.scrollTo({ top: 900, behavior: 'smooth' });
                    }}
                    className="px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('teams')}
              className="text-xs font-mono font-bold text-orange-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All 128 Competing Presentation Decks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
