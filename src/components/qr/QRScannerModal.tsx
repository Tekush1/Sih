import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { Stage, Team, ScheduleSlot } from '../../types';
import { X, QrCode, Camera, Sparkles, Search } from 'lucide-react';
import { QRScannerResultCard } from './QRScannerResultCard';

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
  const { validateQRScan, teams } = useHackathon();
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

  const candidateTeams = teams
    .filter((t) => t.stageId === stage.id && t.submission?.status === 'APPROVED')
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl text-slate-800">
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
          <div className="relative rounded-2xl bg-[#faf7f2] border border-orange-200 overflow-hidden h-44 flex flex-col items-center justify-center">
            <div className="text-center space-y-2 relative z-10 px-4">
              <Camera className="w-8 h-8 text-orange-600 mx-auto animate-pulse" />
              <p className="text-xs text-slate-800 font-bold">Position Digital QR Pass within frame</p>
              <p className="text-[11px] text-slate-500 font-mono">Camera: Optical Sensor Active · Auto-detect ON</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 mb-2 flex items-center justify-between font-bold">
              <span>DEMO: ONE-CLICK TEST PASSES ({stage.name})</span>
              <span className="text-[10px] text-orange-600">Click to Simulate Scan</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {candidateTeams.map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => {
                    setInputText(ct.id);
                    handleScanInput(ct.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#faf7f2] border border-slate-200 hover:border-orange-300 text-xs font-mono text-slate-700 hover:text-orange-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  <span className="font-bold">{ct.id}</span>
                  <span className="text-slate-500 font-sans truncate max-w-[100px]">{ct.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Team ID or QR Token..."
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

          {scanResult && (
            <QRScannerResultCard
              scanResult={scanResult}
              onLaunchPresentation={onLaunchPresentation}
            />
          )}
        </div>
      </div>
    </div>
  );
};
