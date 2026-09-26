import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Team, Stage } from '../../types';
import { 
  QrCode, 
  Play, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Building2
} from 'lucide-react';
import { QRScannerModal } from '../qr/QRScannerModal';
import { PresentationEngine } from '../presentation/PresentationEngine';

export const StagePortal: React.FC = () => {
  const { 
    stages, 
    activeStageId, 
    setActiveStageId, 
    schedules, 
    teams, 
    startPresentation 
  } = useHackathon();

  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [activePresentationTeam, setActivePresentationTeam] = useState<Team | null>(null);

  const currentStage = stages.find((s) => s.id === activeStageId) || stages[0];

  const stageSlots = schedules
    .filter((s) => s.stageId === currentStage.id)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Determine current presenting team
  const inProgressSlot = stageSlots.find((s) => s.status === 'IN_PROGRESS');
  const presentingTeam = inProgressSlot
    ? teams.find((t) => t.id === inProgressSlot.teamId)
    : currentStage.currentTeamId
    ? teams.find((t) => t.id === currentStage.currentTeamId)
    : undefined;

  // Determine next up team
  const upcomingSlots = stageSlots.filter(
    (s) => s.status === 'SCHEDULED' && (!presentingTeam || s.teamId !== presentingTeam.id)
  );
  const nextSlot = upcomingSlots[0];
  const nextTeam = nextSlot ? teams.find((t) => t.id === nextSlot.teamId) : undefined;

  const handleLaunchTeam = (team: Team) => {
    setShowScanner(false);
    startPresentation(team.id, currentStage.id);
    setActivePresentationTeam(team);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Stage Header & Selector */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-600 font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>TECHNOCRATS INSTITUTE OF TECHNOLOGY · STAGE MARSHAL CONSOLE</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <span>{currentStage.name}</span>
            <span className="text-xs px-2.5 py-1 rounded bg-orange-100 border border-orange-200 text-orange-800 font-mono font-bold">
              {currentStage.track}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 border border-blue-200 text-blue-800 font-mono font-bold hidden sm:inline">
              SIH 2026 Internal
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span>{currentStage.location}</span>
            <span>·</span>
            <span className="font-medium text-slate-700">Marshal: {currentStage.operatorName}</span>
          </p>
        </div>

        {/* Stage Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {stages.map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStageId(st.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeStageId === st.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-[#faf7f2] text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Focus: Current Team vs Next Team */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active On-Stage Pod */}
        <div className="lg:col-span-7 rounded-3xl bg-white border-2 border-orange-300 p-6 md:p-8 space-y-6 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-orange-700 font-black flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
              CURRENT PRESENTING POD
            </span>

            <span className="px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 font-mono font-bold text-xs">
              6-Min Pitch Engine Active
            </span>
          </div>

          {presentingTeam ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-1 flex-wrap">
                  <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">{presentingTeam.id}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-200 text-blue-800 font-bold">
                    PS: {presentingTeam.psId || 'SIH1609'}
                  </span>
                  <span>·</span>
                  <span className="text-slate-600 font-medium">{presentingTeam.track}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {presentingTeam.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">{presentingTeam.college}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-orange-100 space-y-1.5 text-xs">
                <span className="text-slate-500 font-mono block text-[10px] uppercase font-bold">PROJECT FOCUS</span>
                <p className="text-slate-800 font-medium line-clamp-2">{presentingTeam.problemStatement}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-slate-200">
                  <span className="text-slate-500 block text-[10px] font-bold">SCHEDULED SLOT</span>
                  <span className="text-orange-700 font-black text-sm">
                    {presentingTeam.scheduledSlot?.startTime || '14:00'} - {presentingTeam.scheduledSlot?.endTime || '14:06'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-slate-200">
                  <span className="text-slate-500 block text-[10px] font-bold">PASS AUTHENTICATION</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    VERIFIED
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleLaunchTeam(presentingTeam)}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch 6-Minute Presentation Engine</span>
                </button>

                <button
                  onClick={() => setShowScanner(true)}
                  className="px-4 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-orange-600" />
                  <span>Scan Next Pass</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Clock className="w-10 h-10 text-orange-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800">Stage Currently Waiting for Next Team</p>
              <button
                onClick={() => setShowScanner(true)}
                className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan Team QR Pass to Begin</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Next Up in Queue */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200/90 p-6 md:p-8 space-y-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">
                NEXT UP IN QUEUE
              </span>
              <span className="text-orange-700 text-xs font-mono font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">ON DECK</span>
            </div>

            {nextTeam ? (
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-800 font-bold">
                    {nextTeam.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-200 text-blue-800 font-bold">
                    PS: {nextTeam.psId || 'SIH1609'}
                  </span>
                  <span className="text-slate-500">{nextTeam.college}</span>
                </div>

                <h4 className="text-xl font-bold text-slate-900">{nextTeam.name}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {nextTeam.problemStatement}
                </p>

                <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Scheduled Window:</span>
                    <span className="text-slate-900 font-bold">{nextSlot?.startTime} - {nextSlot?.endTime}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Status:</span>
                    <span className="text-emerald-700 font-bold">Approved &amp; Ready</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-8 text-center text-xs text-slate-500 font-mono">
                No subsequent teams currently scheduled in this stage queue.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowScanner(true)}
              className="w-full py-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-orange-600" />
              <span>Verify &amp; Check-In Team via QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Stage Schedule Queue Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 bg-[#faf7f2] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              {currentStage.name} · Full Queue ({stageSlots.length} Slots)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">6 minutes deterministic interval</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {stageSlots.map((slot, idx) => {
            const team = teams.find((t) => t.id === slot.teamId);
            if (!team) return null;

            const isPresenting = slot.status === 'IN_PROGRESS';
            const isCompleted = slot.status === 'COMPLETED';

            return (
              <div
                key={slot.id}
                className={`p-3.5 px-4 sm:px-6 flex items-center justify-between text-xs transition-colors ${
                  isPresenting ? 'bg-orange-50/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400 w-8">#{idx + 1}</span>
                  <span className="font-mono font-bold text-slate-900 w-24">
                    {slot.startTime} - {slot.endTime}
                  </span>
                  <span className="font-mono text-orange-700 font-bold">{team.id}</span>
                  <span className="text-slate-900 font-bold">{team.name}</span>
                  <span className="text-slate-500 hidden md:inline truncate max-w-[160px]">{team.college}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isPresenting
                        ? 'bg-orange-100 text-orange-800 border border-orange-300 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {slot.status}
                  </span>

                  <button
                    onClick={() => handleLaunchTeam(team)}
                    className="p-1 text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"
                    title="Launch Presentation Engine"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScannerModal
          stage={currentStage}
          onClose={() => setShowScanner(false)}
          onLaunchPresentation={handleLaunchTeam}
        />
      )}

      {/* Live Presentation Engine */}
      {activePresentationTeam && (
        <PresentationEngine
          team={activePresentationTeam}
          stage={currentStage}
          onClose={() => setActivePresentationTeam(null)}
          onNextTeam={(nextTeamId) => {
            const next = teams.find((t) => t.id === nextTeamId);
            if (next) {
              startPresentation(next.id, currentStage.id);
              setActivePresentationTeam(next);
            } else {
              setActivePresentationTeam(null);
            }
          }}
        />
      )}
    </div>
  );
};
