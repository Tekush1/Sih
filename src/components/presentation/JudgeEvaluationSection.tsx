import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Team } from '../../types';
import { 
  Award, 
  Search, 
  CheckCircle2, 
  Star, 
  Play, 
  FileText, 
  Sliders, 
  Building2, 
  ShieldCheck, 
  Trophy, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
  AlertCircle
} from 'lucide-react';
import { PresentationRenderer } from './PresentationRenderer';
import { SIHProblemModal } from '../sih/SIHProblemModal';

interface JudgeEvaluationSectionProps {
  onLaunchPresentation: (teamId: string, stageId: string) => void;
}

export const JudgeEvaluationSection: React.FC<JudgeEvaluationSectionProps> = ({
  onLaunchPresentation
}) => {
  const { teams, stages } = useHackathon();

  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || 'SH26-001');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTrack, setFilterTrack] = useState<string>('ALL');
  const [showDeckPreview, setShowDeckPreview] = useState<boolean>(false);
  const [previewSlideIdx, setPreviewSlideIdx] = useState<number>(0);
  const [showSIHModal, setShowSIHModal] = useState<boolean>(false);

  // Scoring state
  const [noveltyScore, setNoveltyScore] = useState<number>(23);
  const [techScore, setTechScore] = useState<number>(22);
  const [feasibilityScore, setFeasibilityScore] = useState<number>(21);
  const [presentationScore, setPresentationScore] = useState<number>(24);
  const [feedbackNotes, setFeedbackNotes] = useState<string>(
    'Strong architectural clarity, realistic 6-minute stage delivery, and direct alignment with official SIH problem statement.'
  );
  const [isNominated, setIsNominated] = useState<boolean>(true);
  const [evaluationSuccess, setEvaluationSuccess] = useState<string | null>(null);

  // Saved evaluation records (simulated in state for judge session)
  const [evaluations, setEvaluations] = useState<Record<string, {
    total: number;
    novelty: number;
    tech: number;
    feasibility: number;
    presentation: number;
    feedback: string;
    nominated: boolean;
    evaluatedAt: string;
  }>>({
    'SH26-001': {
      total: 90,
      novelty: 23,
      tech: 22,
      feasibility: 21,
      presentation: 24,
      feedback: 'Excellent AI edge architecture and rigorous multi-agent demo.',
      nominated: true,
      evaluatedAt: '10:06 AM'
    },
    'SH26-009': {
      total: 88,
      novelty: 22,
      tech: 23,
      feasibility: 21,
      presentation: 22,
      feedback: 'Good compliance with AICTE drone telemetry requirements.',
      nominated: true,
      evaluatedAt: '10:12 AM'
    },
    'SH26-015': {
      total: 92,
      novelty: 24,
      tech: 23,
      feasibility: 22,
      presentation: 23,
      feedback: 'Impressive live model inference under 10ms with zero latency.',
      nominated: true,
      evaluatedAt: '10:18 AM'
    }
  });

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];
  const totalScore = noveltyScore + techScore + feasibilityScore + presentationScore;

  const handleSaveEvaluation = () => {
    if (!selectedTeam) return;

    setEvaluations((prev) => ({
      ...prev,
      [selectedTeam.id]: {
        total: totalScore,
        novelty: noveltyScore,
        tech: techScore,
        feasibility: feasibilityScore,
        presentation: presentationScore,
        feedback: feedbackNotes,
        nominated: isNominated,
        evaluatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }));

    setEvaluationSuccess(`Evaluation recorded for ${selectedTeam.name} (${selectedTeam.id}) — Total Score: ${totalScore}/100`);
    setTimeout(() => setEvaluationSuccess(null), 4000);
  };

  const getTier = (score: number) => {
    if (score >= 90) return { label: 'A+ SIH Prime Candidate', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= 80) return { label: 'A Strong Contender', bg: 'bg-orange-100 text-orange-800 border-orange-300' };
    if (score >= 70) return { label: 'B+ Qualified Screening', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
    return { label: 'Revision Advised', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
  };

  const filteredTeams = teams.filter((t) => {
    const matchSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.psId && t.psId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.problemStatement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTrack = filterTrack === 'ALL' || t.track === filterTrack;
    return matchSearch && matchTrack;
  });

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* SIH Modal */}
      <SIHProblemModal
        isOpen={showSIHModal}
        onClose={() => setShowSIHModal(false)}
        initialSelectedId={selectedTeam?.psId || 'SIH1601'}
      />

      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 mb-1">
            <Trophy className="w-4 h-4 text-orange-600" />
            <span>TECHNOCRATS INSTITUTE OF TECHNOLOGY · EVALUATION CHAMBER</span>
            <span className="text-orange-300">·</span>
            <span className="text-[#b47e3a]">SIH 2026 JURY PANEL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Stage Presentation Scoring &amp; SIH Nomination Jury
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Official 4-pillar rubrics for Technocrats Institute of Technology (TIT) Bhopal. Evaluate live 6-minute pitches, score solutions out of 100, and recommend squads for national SIH elimination.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onLaunchPresentation(selectedTeam.id, selectedTeam.stageId || 'stage-alpha')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Pitch for {selectedTeam.id}</span>
          </button>
        </div>
      </div>

      {evaluationSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{evaluationSuccess}</span>
        </div>
      )}

      {/* Main Grid: Left Selector, Center Scoring Sheet, Right Evaluation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Squad Selector */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/90 p-5 space-y-4 shadow-xs flex flex-col max-h-[720px]">
          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
              <span>Select Presenting Squad</span>
              <span className="text-xs font-mono text-orange-600 font-bold">{filteredTeams.length} Teams</span>
            </h3>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search team or PS ID (e.g. SIH1601)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
              {['ALL', 'AI & Robotics', 'Web3 & Cloud', 'HealthTech & Bio', 'Smart Cities & IoT'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterTrack(t)}
                  className={`px-2 py-1 rounded-lg shrink-0 font-bold transition-colors cursor-pointer ${
                    filterTrack === t ? 'bg-orange-600 text-white' : 'bg-[#faf7f2] text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {t === 'ALL' ? 'All' : t.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Teams List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
            {filteredTeams.map((team) => {
              const isSelected = team.id === selectedTeam.id;
              const hasEvaluation = evaluations[team.id];

              return (
                <button
                  key={team.id}
                  onClick={() => {
                    setSelectedTeamId(team.id);
                    if (hasEvaluation) {
                      setNoveltyScore(hasEvaluation.novelty);
                      setTechScore(hasEvaluation.tech);
                      setFeasibilityScore(hasEvaluation.feasibility);
                      setPresentationScore(hasEvaluation.presentation);
                      setFeedbackNotes(hasEvaluation.feedback);
                      setIsNominated(hasEvaluation.nominated);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex flex-col gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50/90 border border-orange-300 shadow-2xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-orange-700 bg-orange-100/80 px-1.5 py-0.5 rounded">
                      {team.id}
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded border border-blue-200">
                      {team.psId || 'SIH1609'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{team.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{team.college}</p>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                    <span className="text-slate-500">{team.scheduledSlot?.startTime || '14:00'} · {team.stageId?.replace('-', ' ') || 'Stage A'}</span>
                    {hasEvaluation ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {hasEvaluation.total}/100
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">Pending Score</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center & Right: Active Squad Evaluation Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Squad Context Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono mb-1">
                  <span className="px-2 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-800 font-bold">
                    {selectedTeam.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-200 text-blue-800 font-bold">
                    PS: {selectedTeam.psId || 'SIH1609'}
                  </span>
                  <span className="text-slate-500 font-bold font-sans">{selectedTeam.track}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedTeam.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedTeam.college}</span>
                  <span>·</span>
                  <span>Leader: <strong className="text-slate-800">{selectedTeam.leaderName}</strong> ({selectedTeam.leaderEmail})</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowDeckPreview(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#faf7f2] hover:bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-orange-600" />
                  <span>Preview 6 Slides</span>
                </button>

                <button
                  onClick={() => setShowSIHModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-mono font-bold text-orange-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
                  <span>SIH PS Details</span>
                </button>
              </div>
            </div>

            {/* Problem Statement Blurb */}
            <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-orange-100 text-xs space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">OFFICIAL SIH PROBLEM STATEMENT:</span>
              <p className="text-slate-800 font-medium">{selectedTeam.problemStatement}</p>
              <div className="text-[11px] text-orange-700 font-bold pt-1">
                Organization: {selectedTeam.sihOrganization || 'Ministry of Education / AICTE'}
              </div>
            </div>

            {/* 4 SIH Scoring Pillars */}
            <div className="space-y-5 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                SIH Official 4-Pillar Evaluation Rubric (100 Pts Total)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pillar 1 */}
                <div className="p-4 rounded-2xl bg-[#faf7f2] border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">1. Novelty &amp; Problem Fit</span>
                    <span className="font-mono text-sm font-black text-orange-700">{noveltyScore} / 25</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="25"
                    value={noveltyScore}
                    onChange={(e) => setNoveltyScore(Number(e.target.value))}
                    className="w-full accent-orange-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">Uniqueness, alignment with {selectedTeam.psId || 'SIH'} PS ID, and originality.</p>
                </div>

                {/* Pillar 2 */}
                <div className="p-4 rounded-2xl bg-[#faf7f2] border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">2. Technical Architecture</span>
                    <span className="font-mono text-sm font-black text-orange-700">{techScore} / 25</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="25"
                    value={techScore}
                    onChange={(e) => setTechScore(Number(e.target.value))}
                    className="w-full accent-orange-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">System design, algorithm robustness, tech stack selection, scalability.</p>
                </div>

                {/* Pillar 3 */}
                <div className="p-4 rounded-2xl bg-[#faf7f2] border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">3. Feasibility &amp; ROI</span>
                    <span className="font-mono text-sm font-black text-orange-700">{feasibilityScore} / 25</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="25"
                    value={feasibilityScore}
                    onChange={(e) => setFeasibilityScore(Number(e.target.value))}
                    className="w-full accent-orange-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">Execution plan, cost estimation, compliance, societal impact.</p>
                </div>

                {/* Pillar 4 */}
                <div className="p-4 rounded-2xl bg-[#faf7f2] border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">4. 6-Min Pitch &amp; Live Demo</span>
                    <span className="font-mono text-sm font-black text-orange-700">{presentationScore} / 25</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="25"
                    value={presentationScore}
                    onChange={(e) => setPresentationScore(Number(e.target.value))}
                    className="w-full accent-orange-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">Adherence to 60s/slide timer, prototype quality, and answers to questions.</p>
                </div>
              </div>

              {/* Total Score & Grade Tier Banner */}
              <div className="p-4 rounded-2xl bg-orange-50/90 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black font-mono text-lg shadow-sm">
                    {totalScore}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-slate-500 font-bold">TOTAL SCORE (/100)</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTier(totalScore).bg}`}>
                        {getTier(totalScore).label}
                      </span>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isNominated}
                    onChange={(e) => setIsNominated(e.target.checked)}
                    className="w-4 h-4 accent-orange-600 rounded"
                  />
                  <span>Recommend for SIH 2026 National Nomination</span>
                </label>
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-600 font-bold">
                  Judge Feedback &amp; Review Observations (Visible to Team &amp; Committee)
                </label>
                <textarea
                  rows={3}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Enter detailed strengths, weaknesses, and recommendations for this pitch..."
                  className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-sans"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => onLaunchPresentation(selectedTeam.id, selectedTeam.stageId || 'stage-alpha')}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-orange-600" />
                  <span>Watch Stage Presentation</span>
                </button>

                <button
                  onClick={handleSaveEvaluation}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs transition-all shadow-md shadow-orange-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit &amp; Lock Score</span>
                </button>
              </div>
            </div>
          </div>

          {/* Evaluations Leaderboard */}
          <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 bg-[#faf7f2] border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-600" />
                <h4 className="font-extrabold text-sm text-slate-900">
                  Jury Evaluated Presentations Leaderboard ({Object.keys(evaluations).length})
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-mono">Ranked by Total Score</span>
            </div>

            <div className="divide-y divide-slate-100">
              {Object.entries(evaluations)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([teamId, evalData], idx) => {
                  const team = teams.find((t) => t.id === teamId);
                  if (!team) return null;

                  return (
                    <div key={teamId} className="p-3.5 px-5 flex items-center justify-between text-xs hover:bg-[#faf7f2]/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-6 font-mono font-bold text-slate-400">#{idx + 1}</span>
                        <span className="font-mono text-orange-700 font-bold">{team.id}</span>
                        <span className="font-bold text-slate-900">{team.name}</span>
                        <span className="text-slate-500 hidden sm:inline truncate max-w-xs">{team.college}</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold text-[10px] border border-blue-200">
                          {team.psId || 'SIH1609'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {evalData.nominated && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold hidden md:inline">
                            SIH NOMINATED
                          </span>
                        )}
                        <span className="font-mono font-black text-sm text-orange-700">
                          {evalData.total} <span className="text-[10px] text-slate-400 font-normal">/100</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Deck Modal */}
      {showDeckPreview && selectedTeam.submission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-between p-4 md:p-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-orange-400 font-bold">
                <span>{selectedTeam.id}</span>
                <span>·</span>
                <span>{selectedTeam.track}</span>
                <span>·</span>
                <span>PS: {selectedTeam.psId || 'SIH1609'}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedTeam.name} — 6-Slide Pitch Preview</h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setPreviewSlideIdx(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold cursor-pointer ${
                      previewSlideIdx === idx ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowDeckPreview(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl font-mono ml-3 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex items-center justify-center my-4">
            <PresentationRenderer
              slide={selectedTeam.submission.slides[previewSlideIdx] || selectedTeam.submission.slides[0]}
              team={selectedTeam}
              slideTimeRemaining={60}
            />
          </div>
        </div>
      )}
    </div>
  );
};
