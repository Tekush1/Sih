import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Team, Stage } from '../../types';
import { 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Building2,
  Sparkles
} from 'lucide-react';

interface QRPassModalProps {
  team: Team;
  stage?: Stage;
  onClose: () => void;
}

export const QRPassModal: React.FC<QRPassModalProps> = ({ team, stage, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const payload = team.qrPass?.qrPayload || JSON.stringify({
      teamId: team.id,
      teamName: team.name,
      college: team.college,
      stage: stage?.name || 'Stage Alpha',
      time: team.scheduledSlot?.startTime || '14:00',
      token: team.qrPass?.token || `QR-${team.id}`
    });

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [team, stage]);

  const handleCopyToken = () => {
    if (team.qrPass?.token) {
      navigator.clipboard.writeText(team.qrPass.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `SmartHackathon2026_${team.id}_Presentation_Pass.png`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative text-slate-800">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#faf7f2]">
          <div className="flex items-center gap-2 text-orange-700 font-mono text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>DIGITAL STAGE PRESENTATION PASS</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ticket Container */}
        <div className="p-6 space-y-6 bg-[#fffdfa]">
          {/* Badge & Team Details */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>PRESENTATION AUTHORIZED · TIT BHOPAL</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{team.name}</h3>
            <p className="text-xs text-slate-600 font-medium">{team.college}</p>
            <div className="inline-block px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-mono font-bold">
              SIH PS ID: {team.psId || 'SIH1609'} · {team.sihOrganization || 'AICTE / MoE'}
            </div>
          </div>

          {/* QR Code Frame */}
          <div className="flex flex-col items-center justify-center">
            <div className="p-3.5 bg-white rounded-2xl shadow-md border-2 border-orange-200 relative group">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code Pass for ${team.id}`}
                  className="w-52 h-52 object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center bg-slate-100 text-slate-500 text-xs font-mono">
                  Generating Token...
                </div>
              )}
            </div>

            <p className="text-[11px] font-mono text-slate-500 mt-3 flex items-center gap-2">
              <span>Token:</span>
              <span className="text-orange-700 font-bold">{team.qrPass?.token || `QR-${team.id}`}</span>
              <button
                onClick={handleCopyToken}
                className="text-slate-500 hover:text-slate-800 p-1 rounded transition-colors cursor-pointer"
                title="Copy Token"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {copied && <span className="text-emerald-700 font-bold text-[10px]">Copied!</span>}
            </p>
          </div>

          {/* Ticket Information Grid */}
          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-mono block text-[10px] uppercase font-bold">TEAM ID</span>
              <span className="text-orange-700 font-mono font-black text-sm">{team.id}</span>
            </div>

            <div>
              <span className="text-slate-500 font-mono block text-[10px] uppercase font-bold">TRACK</span>
              <span className="text-slate-800 font-bold truncate block">{team.track}</span>
            </div>

            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 font-mono block text-[10px] uppercase font-bold">STAGE ALLOCATION</span>
                <span className="text-slate-900 font-bold">{stage?.name || 'Stage Alpha'}</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 font-mono block text-[10px] uppercase font-bold">SLOT TIME</span>
                <span className="text-slate-900 font-mono font-bold">
                  {team.scheduledSlot ? `${team.scheduledSlot.startTime} - ${team.scheduledSlot.endTime}` : '14:00 - 14:06'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center leading-relaxed">
            Please arrive at Auditorium Hall A (TIT Campus) 5 minutes prior to your slot. The presentation engine enforces 6 minutes total (60s/slide).
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-200 bg-[#faf7f2] flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Pass</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
