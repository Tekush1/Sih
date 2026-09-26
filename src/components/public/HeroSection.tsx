import React, { useState, useEffect } from 'react';
import { useHackathon } from '../../context/HackathonContext';
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
  Sparkles
} from 'lucide-react';
import { SIHProblemModal } from '../sih/SIHProblemModal';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  onOpenStage: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenStage }) => {
  const { stats } = useHackathon();
  const [showSIHModal, setShowSIHModal] = useState<boolean>(false);

  // Event countdown target: Internal Hackathon Presentation Day
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 14,
    minutes: 32,
    seconds: 40
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-12 pb-20 bg-gradient-to-b from-[#fdfbf7] via-[#faf5ea] to-[#f5efe4]">
      {/* SIH Explorer Modal */}
      <SIHProblemModal
        isOpen={showSIHModal}
        onClose={() => setShowSIHModal(false)}
        onSelect={() => {
          setShowSIHModal(false);
          onNavigate('registration');
        }}
      />

      {/* Background Graphic Rings & Ambient Glow (Exact match to screenshot) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Soft amber radial glow */}
        <div className="w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-gradient-to-tr from-amber-200/30 via-orange-100/40 to-transparent blur-3xl" />
        
        {/* Concentric subtle circular rings */}
        <div className="absolute w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full border border-amber-300/35" />
        <div className="absolute w-[680px] sm:w-[950px] h-[680px] sm:h-[950px] rounded-full border border-orange-200/25" />
        <div className="absolute w-[900px] sm:w-[1250px] h-[900px] sm:h-[1250px] rounded-full border border-slate-200/40" />

        {/* Floating soft cyan particle dots like in the screenshot */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-cyan-400/40 blur-[1px]" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-cyan-300/30 blur-[1px]" />
        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 rounded-full bg-cyan-400/35 blur-[1px]" />
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-cyan-300/40 blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7">
        {/* Top Tagline Pill: "Welcome to Innovation Hub" (Exact match to screenshot) */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#fee2ce] border border-[#fec7a2] text-xs sm:text-sm font-semibold text-[#c2410c] shadow-xs">
          <span>Welcome to Innovation Hub</span>
        </div>

        {/* Primary Titles (Exact match to screenshot: TIT Excellence in dark navy, Incubation Cell in golden bronze) */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#0f172a] leading-[1.08]">
            TIT Excellence
          </h1>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#b47e3a] leading-[1.08]">
            Incubation Cell
          </h2>
          <div className="text-sm sm:text-base font-extrabold text-orange-600 tracking-wider uppercase pt-1">
            Smart India Hackathon (SIH 2026) · Internal College Qualifier
          </div>
        </div>

        {/* Description Text (Exact copy from the screenshot + Hackathon qualifier focus) */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed text-balance">
          Nurturing entrepreneurial minds and transforming ideas into impactful ventures. Empowering students to innovate, collaborate, and lead the future through our automated 6-minute presentation engine and direct <strong className="text-slate-800 font-semibold">sih.gov.in</strong> nomination gateway.
        </p>

        {/* Action Buttons (Exact colors from screenshot: Vibrant Orange & Cyan Border) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          {/* Primary Button: Vibrant Orange "Explore Events" */}
          <button
            onClick={() => onNavigate('registration')}
            className="px-7 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 cursor-pointer"
          >
            <span>Explore Events &amp; Apply</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary Button: Cyan Outline "Learn More" (Exact match to screenshot) */}
          <button
            onClick={() => setShowSIHModal(true)}
            className="px-7 sm:px-8 py-3.5 rounded-xl border-2 border-[#38bdf8] text-[#0284c7] hover:text-[#0369a1] bg-white/90 hover:bg-cyan-50/80 font-bold text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Globe className="w-4 h-4 text-cyan-600" />
            <span>Fetch SIH Problem Statements</span>
          </button>

          {/* Third Button: Stage Arenas */}
          <button
            onClick={onOpenStage}
            className="px-6 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 bg-white/80 hover:bg-white font-semibold text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Play className="w-4 h-4 text-orange-600 fill-orange-600" />
            <span>Live Stage Arenas</span>
          </button>
        </div>

        {/* Live Countdown Clock Styled for Light Theme */}
        <div className="pt-4 pb-2">
          <div className="inline-flex items-center gap-3 sm:gap-6 p-4 rounded-2xl bg-white/90 border border-amber-200/80 shadow-md shadow-amber-900/5 backdrop-blur-md">
            <div className="text-center px-2">
              <span className="block text-2xl sm:text-4xl font-extrabold font-mono text-slate-800 tabular-nums">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-wider">Days</span>
            </div>
            <span className="text-xl sm:text-3xl text-amber-400 font-mono">:</span>
            <div className="text-center px-2">
              <span className="block text-2xl sm:text-4xl font-extrabold font-mono text-orange-600 tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-wider">Hours</span>
            </div>
            <span className="text-xl sm:text-3xl text-amber-400 font-mono">:</span>
            <div className="text-center px-2">
              <span className="block text-2xl sm:text-4xl font-extrabold font-mono text-orange-600 tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-wider">Mins</span>
            </div>
            <span className="text-xl sm:text-3xl text-amber-400 font-mono">:</span>
            <div className="text-center px-2">
              <span className="block text-2xl sm:text-4xl font-extrabold font-mono text-[#b47e3a] tabular-nums animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-wider">Secs</span>
            </div>
          </div>
        </div>

        {/* Live Metrics Grid (Warm cards with clean borders) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 text-left">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">TIT SQUADS</span>
              <Users className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0f172a] tabular-nums">
              {stats.totalTeams}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">TIT Bhopal Departments</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">TIT STUDENTS</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0f172a] tabular-nums">
              {stats.totalParticipants}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">4-6 Engineers per Squad</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">APPROVED PPTS</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 tabular-nums">
              {stats.pptApproved}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Digital QR Passes Generated</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">CAMPUS STAGES</span>
              <Layers className="w-4 h-4 text-[#b47e3a]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#b47e3a] tabular-nums">
              4 Arenas
            </div>
            <p className="text-[11px] text-slate-500 mt-1">TIT Auditorium &amp; Halls</p>
          </div>
        </div>
      </div>
    </section>
  );
};
