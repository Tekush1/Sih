import React from 'react';
import { Clock } from 'lucide-react';

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

export const PresentationPitchBlueprint: React.FC = () => {
  return (
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
          Strict deterministic timing enforced by the presentation engine to ensure fair evaluation across all squads.
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
  );
};
