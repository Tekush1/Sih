import React from 'react';
import { 
  Clock, 
  Award, 
  FileText, 
  QrCode, 
  CheckCircle2, 
  ShieldAlert, 
  Layers, 
  Terminal,
  FolderSync
} from 'lucide-react';

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
          {[
            {
              num: '01',
              time: '0:00 – 1:00 min',
              title: 'Problem Statement & Context',
              desc: 'Clearly define the real-world friction point, existing industry limitations, and quantified stakeholder impact.'
            },
            {
              num: '02',
              time: '1:00 – 2:00 min',
              title: 'Proposed Architecture & Solution',
              desc: 'Walk judges through your high-level system topology, decoupled layers, edge ingress, and fault resilience.'
            },
            {
              num: '03',
              time: '2:00 – 3:00 min',
              title: 'Core Innovation & Tech Stack',
              desc: 'Highlight technical breakthroughs, proprietary algorithms, code snippets, and modern systems primitives.'
            },
            {
              num: '04',
              time: '3:00 – 4:00 min',
              title: 'Live Prototype & Demo',
              desc: 'Demonstrate live working software, stress benchmarks under simulated load, and real-time telemetry output.'
            },
            {
              num: '05',
              time: '4:00 – 5:00 min',
              title: 'Business Impact & Feasibility',
              desc: 'State ROI unit economics, enterprise integration speed, regulatory compliance, and environmental efficiency.'
            },
            {
              num: '06',
              time: '5:00 – 6:00 min',
              title: 'Roadmap, Team & Conclusion',
              desc: 'Summarize core differentiators, cross-disciplinary squad pedigree, and commercial rollout trajectory.'
            }
          ].map((item) => (
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
        {/* Judging Rubric */}
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
            {[
              {
                title: 'Innovation & Novelty (25 Points)',
                desc: 'Uniqueness of the solution, departure from generic templates, and creative algorithmic thinking.'
              },
              {
                title: 'Technical Rigor & Architecture (25 Points)',
                desc: 'Quality of system architecture, modular decoupling, throughput benchmarks, and code standards.'
              },
              {
                title: 'Feasibility & Real-World Impact (25 Points)',
                desc: 'Commercial viability, unit economics, regulatory adherence, and operational scalability.'
              },
              {
                title: 'Presentation & Live Demo (25 Points)',
                desc: 'Pacing within the 6-minute engine, clarity of delivery, and live prototype responsiveness.'
              }
            ].map((r, idx) => (
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
            <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-700">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Submission &amp; Stage Protocol</h3>
              <p className="text-xs text-slate-500">Google Drive &amp; QR Validation Workflow</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs text-slate-700">
            <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-100 space-y-1.5">
              <div className="flex items-center gap-2 text-orange-600 font-mono font-bold">
                <FileText className="w-4 h-4" />
                <span>1. File Format &amp; Deadline</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Submissions must be valid .PPTX or .PDF files up to 25MB. Must be structured with 6 presentation slides matching the official topics.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-100 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-700 font-mono font-bold">
                <FolderSync className="w-4 h-4" />
                <span>2. Automated Google Drive Team Folder</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Upon registration, a dedicated cloud storage directory is provisioned per team: <code className="text-blue-800 font-mono">/SmartHackathon2026/Teams/SH26-XXX/</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf7f2] border border-amber-100 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-700 font-mono font-bold">
                <CheckCircle2 className="w-4 h-4" />
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
