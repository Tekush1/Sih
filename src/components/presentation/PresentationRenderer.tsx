import React from 'react';
import { SlideData, Team } from '../../types';
import { 
  AlertCircle, 
  Cpu, 
  Layers, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Database, 
  ShieldCheck, 
  Terminal, 
  Clock, 
  Award,
  Users
} from 'lucide-react';

interface PresentationRendererProps {
  slide: SlideData;
  team: Team;
  slideTimeRemaining: number;
}

export const PresentationRenderer: React.FC<PresentationRendererProps> = ({
  slide,
  team,
  slideTimeRemaining
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-8 md:p-12 text-slate-100 select-none overflow-hidden relative">
      {/* Background ambient subtle glow matching track */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-violet-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Slide Header */}
      <div className="relative z-10 flex items-start justify-between border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3 text-xs tracking-wider text-orange-400 font-mono uppercase mb-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-orange-950/60 border border-orange-800/40 text-orange-300 font-bold">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              SLIDE 0{slide.slideNumber} / 06
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 font-medium tracking-normal">{slide.category}</span>
            <span className="text-slate-600">·</span>
            <span className="text-orange-400 font-mono font-bold">{team.id}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {slide.title}
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-1.5 font-light">
            {slide.subtitle}
          </p>
        </div>

        {/* Slide Pace Indicator */}
        <div className="hidden md:flex flex-col items-end">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>SLIDE WINDOW</span>
          </div>
          <div className="flex items-baseline gap-1 font-mono">
            <span className={`text-2xl font-bold tabular-nums ${slideTimeRemaining <= 10 ? 'text-rose-400 animate-pulse' : 'text-orange-400'}`}>
              {slideTimeRemaining}s
            </span>
            <span className="text-xs text-slate-500">/ 60s</span>
          </div>
          <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${slideTimeRemaining <= 10 ? 'bg-rose-400' : 'bg-orange-500'}`}
              style={{ width: `${(slideTimeRemaining / 60) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Slide Dynamic Body */}
      <div className="relative z-10 flex-1 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Key Points */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-3">
            {slide.bulletPoints.map((point, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-cyan-500/30 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400 text-xs font-mono font-semibold">
                  0{idx + 1}
                </div>
                <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* Metrics Strip */}
          {slide.metrics && slide.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {slide.metrics.map((m, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80"
                >
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">{m.label}</p>
                  <p className="text-xl md:text-2xl font-bold font-mono text-cyan-300 mt-1 tabular-nums">{m.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Visual Diagram / Code / Architecture */}
        <div className="lg:col-span-5 h-full flex flex-col justify-center">
          {slide.slideNumber === 1 && (
            /* Problem Impact Breakdown Card */
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-5">
              <div className="flex items-center gap-2.5 text-amber-400 text-sm font-semibold">
                <AlertCircle className="w-5 h-5" />
                <span>Critical Vulnerability Vector</span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">Current Industry Latency</span>
                  <span className="text-rose-400 font-bold tabular-nums">480ms - 1.2s</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">Centralized Single Point</span>
                  <span className="text-rose-400 font-bold">100% Vulnerable</span>
                </div>
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/50 flex items-center justify-between">
                  <span className="text-cyan-300">Target Smart 2026 Engine</span>
                  <span className="text-emerald-400 font-bold tabular-nums">&lt; 4.2ms Edge</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/50 text-xs text-slate-400 border border-slate-800">
                <span className="text-slate-200 font-semibold">Validation Scope:</span> 128 production teams evaluated across four critical multi-tenant stages.
              </div>
            </div>
          )}

          {slide.slideNumber === 2 && (
            /* Interactive Architecture Diagram */
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" /> DUAL-ENGINE TOPOLOGY</span>
                <span className="text-emerald-400 font-bold">LIVE TOPOLOGY</span>
              </div>
              
              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-white font-semibold">1. Edge Ingress Shard</p>
                    <p className="text-slate-400 text-[11px]">Quantized Neural Feature Extractor</p>
                  </div>
                </div>

                <div className="flex justify-center my-0.5">
                  <div className="w-0.5 h-4 bg-gradient-to-b from-cyan-500 to-indigo-500" />
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-700/50 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-indigo-200 font-semibold">2. Byzantine Micro-Consensus</p>
                    <p className="text-slate-400 text-[11px]">Sub-5ms Atomic Checkpoints</p>
                  </div>
                </div>

                <div className="flex justify-center my-0.5">
                  <div className="w-0.5 h-4 bg-gradient-to-b from-indigo-500 to-violet-500" />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <Database className="w-5 h-5 text-violet-400 shrink-0" />
                  <div>
                    <p className="text-white font-semibold">3. Cryptographic Storage & Relay</p>
                    <p className="text-slate-400 text-[11px]">Zero-Knowledge Proof Audit Trail</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {slide.slideNumber === 3 && (
            /* Code Snippet & Tech Stack Terminal */
            <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">engine_core.rs</span>
                </div>
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="p-4 font-mono text-[11px] leading-relaxed text-slate-300 overflow-x-auto max-h-[220px]">
                <pre>
{slide.codeSnippet || `// Edge Telemetry Ingress & State Verification
pub async fn process_pipeline(stream: &Stream) -> Result<Block> {
    let raw_shard = stream.pull_edge_telemetry().await?;
    let verified = zk_verify(&raw_shard, &PROOF_KEY)?;
    quantum_dispatch(verified).await
}`}
                </pre>
              </div>
              <div className="px-4 py-2.5 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Stack: Rust · WebAssembly · PyTorch</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED COMPILED
                </span>
              </div>
            </div>
          )}

          {slide.slideNumber === 4 && (
            /* Live Prototype Benchmark View */
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> BENCHMARK ACCELERATION</span>
                <span className="text-slate-400">Stress Test: 1,000 Nodes</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Legacy Framework Baseline</span>
                    <span className="tabular-nums">3,400 ops/s</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-slate-600 rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-cyan-300 font-semibold mb-1">
                    <span>Smart Hackathon 2026 Engine</span>
                    <span className="text-cyan-400 font-bold tabular-nums">12,800 ops/s (3.8x)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Mean Recovery Latency</span>
                    <span className="text-emerald-400 font-bold tabular-nums">4.2ms (-92%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Hardware Target: Embedded TPU / x86</span>
                <span className="text-cyan-300 font-mono">Zero Packet Drops</span>
              </div>
            </div>
          )}

          {slide.slideNumber === 5 && (
            /* Business Feasibility Matrix */
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Award className="w-4 h-4" />
                <span>COMMERCIAL VIABILITY & ROI</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-slate-400 font-mono">1st Year ROI</p>
                  <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">+320%</p>
                  <p className="text-[11px] text-slate-500 mt-1">Net positive within 90 days</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-slate-400 font-mono">Carbon Reduction</p>
                  <p className="text-2xl font-bold text-cyan-300 font-mono mt-1">-42%</p>
                  <p className="text-[11px] text-slate-500 mt-1">Smart energy routing</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero rip-and-replace: standard REST & gRPC bindings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ISO 27001 & SOC-2 Type II audit readiness</span>
                </div>
              </div>
            </div>
          )}

          {slide.slideNumber === 6 && (
            /* Team & Final Stage Wrap-up */
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Users className="w-4 h-4" />
                <span>ENGINEERING TEAM & CONCLUSION</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {team.members.map((member, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <p className="font-semibold text-white truncate">{member.name}</p>
                    <p className="text-[11px] text-cyan-400 truncate">{member.specialization || member.role}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{team.college}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-800/40 text-center">
                <p className="text-xs text-cyan-200 font-medium">Smart Hackathon 2026 Finale Entry</p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Stage Authorized · Verification #{team.id}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide Footer */}
      <div className="relative z-10 border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">{team.name}</span>
          <span>·</span>
          <span>{team.college}</span>
          <span>·</span>
          <span className="font-mono text-cyan-400">{team.track}</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-slate-500">
          <span>Smart Hackathon 2026 Presentation Engine</span>
          <span>·</span>
          <span>6-Minute Strict Enforcement</span>
        </div>
      </div>
    </div>
  );
};
