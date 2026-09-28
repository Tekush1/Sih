import React from 'react';
import { 
  Clock, 
  Award, 
  FileText, 
  QrCode, 
  CheckCircle2, 
  ShieldAlert, 
  Terminal,
  FolderSync
} from 'lucide-react';
import { SLIDE_CADENCE_ITEMS, EVALUATION_RUBRIC_PILLARS } from './guidelinesData';

export const GuidelinesSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-600 block">
          02. TIT BHOPAL · SIH 2026 EVALUATION &amp; RULES
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0f172a] tracking-tight">
          Standardized 6-Minute Presentation Engine
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Internal college elimination at <strong className="text-slate-900 font-bold">Technocrats Institute of Technology, Bhopal</strong> to nominate teams for the <strong className="text-orange-600 font-semibold">Smart India Hackathon 2026</strong>. Finalist presentations run through an automated browser engine with strict 60-second slide timing.
        </p>
      </div>

      {/* 6-Slide Cadence Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span>The 6-Minute Slide Architecture (60s / Slide)</span>
          </h3>
          <span className="text-xs font-mono text-orange-600 font-bold">Total: 360 Seconds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SLIDE_CADENCE_ITEMS.map((item) => (
            <div
              key={item.num}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-300 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-orange-600 font-bold">SLIDE {item.num}</span>
                  <span className="text-[#b47e3a] font-bold">{item.time}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Duration: 60 Seconds</span>
                <span className="text-orange-600 font-semibold">Auto-Advancing</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Judging Rubric and Presentation System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Evaluation Rubric</h3>
              <p className="text-xs text-slate-500">100 Total Points Across 4 Pillars</p>
            </div>
          </div>

          <div className="space-y-4">
            {EVALUATION_RUBRIC_PILLARS.map((r, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#faf7f2] border border-amber-100">
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="font-bold text-slate-900">{r.title}</span>
                  <span className="text-orange-600 font-bold">25 PTS</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PPT & QR Pass Protocol */}
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-[#b47e3a]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">PPT &amp; Stage Pass Protocol</h3>
              <p className="text-xs text-slate-500">4-Step Secure Presentation Pipeline</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-100 space-y-1.5">
              <div className="flex items-center gap-2 text-orange-600 font-mono font-bold">
                <FileText className="w-4 h-4" />
                <span>1. Google Drive PPT Upload</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Teams upload their standardized 6-slide deck via PPTX or PDF. Files are automatically archived in the team Google Drive folder.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-100 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600 font-mono font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>2. Automated 6-Slide Extraction</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                The engine normalizes deck metadata, speaker notes, and problem statement mappings ready for auditorium projector rendering.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-100 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-600 font-mono font-bold">
                <QrCode className="w-4 h-4" />
                <span>3. Admin Approval &amp; QR Pass Issuance</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Once the presentation deck passes review, a tamper-proof Digital QR Pass is issued containing your cryptographic token and stage clearance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-100 space-y-1.5">
              <div className="flex items-center gap-2 text-[#b47e3a] font-mono font-bold">
                <Terminal className="w-4 h-4" />
                <span>4. Stage Entrance Check-in</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Scan your QR Pass at the stage entrance. The engine verifies your scheduled time slot, preloads converted slides, and begins the 3, 2, 1 sequence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
