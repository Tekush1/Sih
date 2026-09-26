import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Stage, Team, ScheduleSlot } from '../../types';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Play, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';

interface QRScannerModalProps {
  stage: Stage;
  onClose: () => void;
  onLaunchPresentation: (team: Team) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  stage,
  onClose,
  onLaunchPresentation
}) => {
  const { validateQRScan, teams, schedules } = useHackathon();
  const [inputText, setInputText] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    team?: Team;
    slot?: ScheduleSlot;
    message: string;
  } | null>(null);

  const handleScanInput = (text: string) => {
    if (!text.trim()) return;
    const res = validateQRScan(text.trim(), stage.id);
    setScanResult(res);
  };

  const handleQuickSelectTeam = (teamId: string) => {
    setInputText(teamId);
    handleScanInput(teamId);
  };

  // Find teams assigned to this stage with approved PPT
  const candidateTeams = teams
    .filter((t) => t.stageId === stage.id && t.submission?.status === 'APPROVED')
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl text-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#faf7f2]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 border border-orange-200 text-orange-600">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Stage QR Scanner</h3>
              <p className="text-xs text-slate-500 font-medium">
                {stage.name} · {stage.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Camera Viewfinder Simulation */}
          <div className="relative rounded-2xl bg-[#faf7f2] border border-orange-200 overflow-hidden h-48 flex flex-col items-center justify-center group">
            {/* Crosshairs */}
            <div className="absolute inset-x-12 inset-y-6 border border-orange-300 rounded-xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-4 h-4 border-t-2 border-l-2 border-orange-500" />
                <div className="w-4 h-4 border-t-2 border-r-2 border-orange-500" />
              </div>
              {/* Laser animation */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_8px_#f97316] animate-bounce" />
              <div className="flex justify-between">
                <div className="w-4 h-4 border-b-2 border-l-2 border-orange-500" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-orange-500" />
              </div>
            </div>

            <div className="text-center space-y-2 relative z-10 px-4">
              <Camera className="w-8 h-8 text-orange-600 mx-auto animate-pulse" />
              <p className="text-xs text-slate-800 font-bold">Position Digital QR Pass within frame</p>
              <p className="text-[11px] text-slate-500 font-mono">Camera: Optical Sensor Active · Auto-detect ON</p>
            </div>
          </div>

          {/* Quick-Scan Candidates Bar */}
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-2 flex items-center justify-between font-bold">
              <span>DEMO: ONE-CLICK TEST PASSES ({stage.name})</span>
              <span className="text-[10px] text-orange-600">Click to Simulate Scan</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {candidateTeams.map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => handleQuickSelectTeam(ct.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#faf7f2] border border-slate-200 hover:border-orange-300 text-xs font-mono text-slate-700 hover:text-orange-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  <span className="font-bold">{ct.id}</span>
                  <span className="text-slate-500 font-sans truncate max-w-[100px]">{ct.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Form */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Team ID (e.g. SH26-001) or paste QR Token..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScanInput(inputText)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-mono shadow-2xs"
              />
            </div>
            <button
              onClick={() => handleScanInput(inputText)}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              Scan &amp; Verify
            </button>
          </div>

          {/* Scan Results Feedback Card */}
          {scanResult && (
            <div
              className={`p-4 rounded-2xl border transition-all ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-sm">
                    {scanResult.success ? 'Pass Verified Successfully' : 'Validation Failed'}
                  </h4>
                  <p className="text-xs opacity-90">{scanResult.message}</p>

                  {scanResult.success && scanResult.team && (
                    <div className="mt-3 p-3 rounded-xl bg-white border border-emerald-200 text-xs text-slate-700 space-y-1 font-mono">
                      <div className="flex justify-between text-slate-900 font-bold">
                        <span>{scanResult.team.name} ({scanResult.team.id})</span>
                        <span className="text-orange-700">{scanResult.team.track}</span>
                      </div>
                      <div className="text-slate-500 font-sans">{scanResult.team.college}</div>
                      <div className="text-emerald-700 font-bold pt-1">
                        Scheduled Slot: {scanResult.team.scheduledSlot?.startTime || '14:00'} - {scanResult.team.scheduledSlot?.endTime || '14:06'} (6 Mins)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {scanResult.success && scanResult.team && (
                <div className="mt-4 pt-3 border-t border-emerald-200 flex justify-end">
                  <button
                    onClick={() => {
                      if (scanResult.team) {
                        onLaunchPresentation(scanResult.team);
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Launch 6-Minute Presentation Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
